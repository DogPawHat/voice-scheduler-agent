# Voice Scheduler Agent

This is a application that accepts voice calls and schedules appointments with a doctor.

**Data Model**
- `doctors`: roster of providers (name, timezone, active).
- `patients`: people identified primarily by phone.
- `availabilityBlocks`: provider availability windows.
- `appointments`: scheduled visits linking doctor + patient + time.
- `callSessions`: one record per call with status and summary.
- `callMessages`: transcript turns (user/assistant/system).

**Core Flows**
- Call lifecycle: start session → optional patient attach by phone → message stream → end with summary.
- Scheduling: derive open slots from availability minus existing appointments → create/cancel/reschedule.
- Patient: upsert/find by normalized phone (E.164), optional enrichment (name/email).

**API Surface (Convex)**
- Patients: upsertByPhone, findByPhone.
- Doctors: list, get.
- Availability: upsert, forDoctorInRange.
- Appointments: findOpenSlots, create, cancel, reschedule, forDoctorOnDay, forPatient.
- Call sessions: start, appendMessage, assignPatient, linkAppointment, end.

**Rules**
- Time stored in UTC ms; display in doctor’s timezone.
- Validate: appointment inside availability and not overlapping existing appointments.
- Status lifecycle: scheduled → completed | cancelled | no_show.

**Acceptance**
- Book/reschedule/cancel without conflicts.
- Recognize returning callers via phone; book in one call.
- Admin can view per‑doctor schedule and call transcripts.
- Session transcripts are searchable per session.

**Open Questions**
- Default slot length and appointment durations?
- Per‑doctor rules (telehealth, buffers)?
- Provider/webhook details and retry behavior?
