import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Doctors available for scheduling
  doctors: defineTable({
    name: v.string(),
    specialty: v.optional(v.string()),
    timezone: v.string(),
    active: v.boolean(),
    metadata: v.optional(v.any()),
  })
    .index("by_active", ["active"]) // list active doctors
    .index("by_name", ["name"]), // basic name lookup

  // Patients identified primarily by phone number
  patients: defineTable({
    fullName: v.string(),
    phone: v.string(), // store normalized (e.g. E.164) for lookup
    email: v.optional(v.string()),
    notes: v.optional(v.string()),
    metadata: v.optional(v.any()),
  })
    .index("by_phone", ["phone"]) // quick lookup by phone
    .index("by_email", ["email"]) // lookup by email
    .searchIndex("search_name", {
      searchField: "fullName",
      filterFields: ["phone"],
    }),

  // Doctor availability blocks (source for computing open slots)
  availabilityBlocks: defineTable({
    doctorId: v.id("doctors"),
    startTime: v.number(), // ms since epoch (UTC)
    endTime: v.number(), // ms since epoch (UTC)
    repeatRule: v.optional(v.any()), // optional recurrence metadata
    source: v.optional(v.string()),
  }).index("by_doctor_start", ["doctorId", "startTime"]),

  // Appointments scheduled for a patient with a doctor
  appointments: defineTable({
    doctorId: v.id("doctors"),
    patientId: v.id("patients"),
    startTime: v.number(), // ms since epoch (UTC)
    endTime: v.number(), // ms since epoch (UTC)
    status: v.union(
      v.literal("scheduled"),
      v.literal("cancelled"),
      v.literal("completed"),
      v.literal("no_show")
    ),
    source: v.union(
      v.literal("voice"),
      v.literal("web"),
      v.literal("manual")
    ),
    notes: v.optional(v.string()),
    callSessionId: v.optional(v.id("callSessions")),
  })
    // For overlap checks and listing by doctor/time
    .index("by_doctor_time", ["doctorId", "startTime"]) 
    // For patient history queries
    .index("by_patient_time", ["patientId", "startTime"]) 
    // Filter by status over time windows
    .index("by_status_time", ["status", "startTime"]),

  // Inbound voice call sessions (one per call)
  callSessions: defineTable({
    callerPhone: v.string(),
    patientId: v.optional(v.id("patients")),
    status: v.union(
      v.literal("active"),
      v.literal("ended"),
      v.literal("abandoned")
    ),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    providerSessionId: v.optional(v.string()),
    lastIntent: v.optional(v.string()),
    summary: v.optional(v.string()),
  })
    .index("by_status_startedAt", ["status", "startedAt"]) // recent active sessions
    .index("by_callerPhone_startedAt", ["callerPhone", "startedAt"]), // phone history

  // Messages within a call session (ASR transcripts, bot prompts, user utterances)
  callMessages: defineTable({
    sessionId: v.id("callSessions"),
    role: v.union(
      v.literal("system"),
      v.literal("assistant"),
      v.literal("user")
    ),
    text: v.string(),
    audioId: v.optional(v.id("_storage")),
  })
    .index("by_session_creation", ["sessionId", "_creationTime"]) // ordered chat log
    .searchIndex("search_text", {
      searchField: "text",
      filterFields: ["sessionId"],
    }),
});
