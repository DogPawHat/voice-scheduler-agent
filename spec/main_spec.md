# Voice Scheduler Agent

This is a application that accepts voice calls and schedules appointments with a doctor. The user will login and select a doctor to schedule an appointment. The app will then start a web voice call in the server and start a conversation with an AI agent that can assist the user in scheduling appointments. The AI agent will help the user schedule appointments and suggest available time slots based on the doctor's availability and the patient's preferences.

**Data Model**
- `doctors`: roster of providers (name, timezone, active).
- `patients`: people identified primarily by phone.
- `availabilityBlocks`: provider availability windows.
- `appointments`: scheduled visits linking doctor + patient + time.

**Core Flows**
- Scheduling: derive open slots from availability minus existing appointments → create/cancel/reschedule.
- Patient: upsert/find by normalized phone (E.164), optional enrichment (name/email).

**API Surface (Convex)**
- Patients: upsertByPhone, findByPhone.
- Doctors: list, get.
- Availability: upsert, forDoctorInRange.
- Appointments: findOpenSlots, create, cancel, reschedule, forDoctorOnDay, forPatient.

**Rules**
- Time stored in UTC ms; display in doctor’s timezone.
- Validate: appointment inside availability and not overlapping existing appointments.
- Status lifecycle: scheduled → completed | cancelled | no_show.

**Acceptance**
- Book/reschedule/cancel without conflicts.
- Recognize returning patients via phone; book in one flow.
- Admin can view per‑doctor schedule.
- Voice integration details defined later; APIs support future integration.

**Open Questions**
- Default slot length and appointment durations?
- Per‑doctor rules (telehealth, buffers)?
- Voice provider/webhook details and retry behavior (for future integration)?
