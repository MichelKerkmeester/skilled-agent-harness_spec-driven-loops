---
title: "AI Council State Format"
description: "Append-only JSONL event format for AI Council state, resume and audit records."
trigger_phrases:
  - "deep-ai-council state format"
  - "ai-council-state jsonl"
  - "council state events"
  - "council resume semantics"
importance_tier: "important"
contextType: "implementation"
version: 2.3.0.13
---

# AI Council State Format

`ai-council-state.jsonl` is append-only JSONL. Each line is one state event used for resume, audit, and convergence decisions.

---

## 1. OVERVIEW

Every council run MUST close with a `council_complete` event appended after `writeReport(...)` lands `council-report.md`. Runs that exit before `council_complete` are incomplete and should be resumed or rolled back before completion is claimed.

```ts
type RoundStart = {
  event: "round_start";
  round: number;
  timestamp: string;
  seats: string[];
};

type SeatReturned = {
  event: "seat_returned";
  round: number;
  seat: string;
  timestamp: string;
  status: "ok" | "timeout" | "error";
  tokens?: number;
};

type DeliberationSynthesized = {
  event: "deliberation_synthesized";
  round: number;
  timestamp: string;
  convergence_score?: number;
};

type RoundEnd = {
  event: "round_end";
  round: number;
  timestamp: string;
  new_findings_count?: number;
};

type CouncilComplete = {
  event: "council_complete";
  timestamp: string;
  final_report_path: string;
  convergence?: boolean;
};

type ArtifactWritten = {
  event: "artifact_written";
  path: string;
  bytes: number;
  checksum: `sha256:${string}`;
  timestamp: string;
  seat_id?: string | null;
  round_id: `round-${string}`;
};

type Rollback = {
  event: "rollback";
  round_id: `round-${string}`;
  reason: string;
  timestamp: string;
  supersedes?: string[];
};

type ArtifactSuperseded = {
  event: "artifact_superseded";
  original_path: string;
  round_id: `round-${string}`;
  rollback_event_id: string;
  superseded_by: "rollback";
  timestamp: string;
};
```

---

## 2. OPTIONAL METADATA FIELDS

Helper-emitted v1.1 and writer-emitted v1.2 rows add three optional metadata fields before the event payload:

```ts
type StateMetadata = {
  schema_version?: "1.1" | "1.2";
  protocol?: "ai-council";
  producer?: "persist-artifacts.cjs@1.1.0" | "persist-artifacts@1.2.0";
};
```

Examples:

- `schema_version: "1.1"` identifies helper-emitted rows; `schema_version: "1.2"` identifies scoped writer rows. Missing means implicit v1.
- `protocol: "ai-council"` distinguishes council state from other JSONL logs.
- `producer: "persist-artifacts.cjs@1.1.0"` identifies the writer family and version.

Consumers MUST treat these fields as optional. The event `event` value remains the semantic discriminator.

---

## 3. SCHEMA EVOLUTION POLICY

State schema evolution is additive-only:

1. New fields may be added when old readers can ignore them.
2. Missing metadata fields default to v1 semantics.
3. v1 rows without `schema_version`, `protocol`, or `producer` remain valid.
4. Existing rows are append-only history and MUST NOT be rewritten to backfill metadata.
5. Changes that would break v1 callers require a new packet and explicit migration plan.

This follows agent body §14 and ADR-001 in the internal design notes.

---

## 4. WORKED EXAMPLE

```jsonl
{"event":"round_start","round":1,"timestamp":"2026-05-06T12:00:00.000Z","seats":["seat-001","seat-002","seat-003"]}
{"event":"seat_returned","round":1,"seat":"seat-001","timestamp":"2026-05-06T12:01:00.000Z","status":"ok","tokens":1400}
{"event":"seat_returned","round":1,"seat":"seat-002","timestamp":"2026-05-06T12:01:30.000Z","status":"ok","tokens":1320}
{"event":"seat_returned","round":1,"seat":"seat-003","timestamp":"2026-05-06T12:02:00.000Z","status":"ok","tokens":1510}
{"event":"deliberation_synthesized","round":1,"timestamp":"2026-05-06T12:03:00.000Z","convergence_score":0.84}
{"event":"round_end","round":1,"timestamp":"2026-05-06T12:03:30.000Z","new_findings_count":0}
{"event":"council_complete","timestamp":"2026-05-06T12:04:00.000Z","final_report_path":"ai-council/council-report.md","convergence":true}
```

---

## 5. WORKED EXAMPLE (V1.1)

```jsonl
{"schema_version":"1.1","protocol":"ai-council","producer":"persist-artifacts.cjs@1.1.0","event":"round_start","round":1,"timestamp":"2026-05-06T12:00:00.000Z","seats":["seat-001","seat-002","seat-003"]}
{"schema_version":"1.1","protocol":"ai-council","producer":"persist-artifacts.cjs@1.1.0","event":"seat_returned","round":1,"seat":"seat-001","timestamp":"2026-05-06T12:01:00.000Z","status":"ok","tokens":1400}
{"schema_version":"1.1","protocol":"ai-council","producer":"persist-artifacts.cjs@1.1.0","event":"seat_returned","round":1,"seat":"seat-002","timestamp":"2026-05-06T12:01:30.000Z","status":"ok","tokens":1320}
{"schema_version":"1.1","protocol":"ai-council","producer":"persist-artifacts.cjs@1.1.0","event":"seat_returned","round":1,"seat":"seat-003","timestamp":"2026-05-06T12:02:00.000Z","status":"ok","tokens":1510}
{"schema_version":"1.1","protocol":"ai-council","producer":"persist-artifacts.cjs@1.1.0","event":"deliberation_synthesized","round":1,"timestamp":"2026-05-06T12:03:00.000Z","convergence_score":0.84}
{"schema_version":"1.1","protocol":"ai-council","producer":"persist-artifacts.cjs@1.1.0","event":"round_end","round":1,"timestamp":"2026-05-06T12:03:30.000Z","new_findings_count":0}
{"schema_version":"1.1","protocol":"ai-council","producer":"persist-artifacts.cjs@1.1.0","event":"council_complete","timestamp":"2026-05-06T12:04:00.000Z","final_report_path":"ai-council/council-report.md","convergence":true}
```

---

## 5.1 WORKED EXAMPLE (V1.2 AUDIT TRAIL)

v1.2 adds audit events to the same append-only JSONL. Each artifact write records the relative `ai-council/` path, byte count, sha256 checksum, timestamp, optional seat id, and round id.

```jsonl
{"schema_version":"1.2","protocol":"ai-council","producer":"persist-artifacts@1.2.0","event":"artifact_written","path":"ai-council-state.jsonl","bytes":842,"checksum":"sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef","timestamp":"2026-05-08T22:30:00.000Z","seat_id":null,"round_id":"round-001"}
{"schema_version":"1.2","protocol":"ai-council","producer":"persist-artifacts@1.2.0","event":"artifact_written","path":"seats/round-001/seat-001-cli-opencode.md","bytes":2048,"checksum":"sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","timestamp":"2026-05-08T22:30:01.000Z","seat_id":"seat-001","round_id":"round-001"}
{"schema_version":"1.2","protocol":"ai-council","producer":"persist-artifacts@1.2.0","event":"rollback","round_id":"round-001","reason":"seat-002 timed out","timestamp":"2026-05-08T22:31:00.000Z","rollback_event_id":"rollback-round-001-20260508T223100Z","supersedes":["seats/round-001/seat-001-cli-opencode.md"]}
{"schema_version":"1.2","protocol":"ai-council","producer":"persist-artifacts@1.2.0","event":"artifact_superseded","original_path":"seats/round-001/seat-001-cli-opencode.md","round_id":"round-001","rollback_event_id":"rollback-round-001-20260508T223100Z","superseded_by":"rollback","timestamp":"2026-05-08T22:31:00.000Z"}
```

v1 readers must ignore `artifact_written`, `rollback`, and `artifact_superseded` events without error. v1.2 readers use them for completeness summaries, checksum verification, and rollback forensics.

---

## 5.2 PROGRESS RECORD (v1.3, shared cross-mode)

A cross-cutting additive event type shared by all deep-loop modes (council, context, review, research, improvement). It provides step-transition liveness: `started`/`completed` pairs around long steps so the no-progress watchdog resets without masking genuine stalls. A progress record is NOT an iteration, a seat return, or a synthesis event — it is purely a liveness signal.

```ts
type ProgressRecord = {
  schema_version: "1.3";
  protocol: "deep-loop";
  type: "progress";
  event: "progress_record";
  mode: "ai-council" | "context" | "review" | "research" | "improvement";
  run: string;            // e.g. "round-001", "iter-003"
  phase: string;          // e.g. "STEP 2: Deliberate And Converge"
  step: string;           // e.g. "Run independent proposals"
  unit_id: string;        // e.g. "round-001/seat-001"
  status: "started" | "completed";
  timestamp: string;      // ISO 8601
  progress_delta?: number;  // work-anchored: items, seats, bytes, etc.
  artifact_path?: string;   // work-anchored: path to the produced/settled artifact
};
```

Rules:

- Append one `started` record immediately before any step expected to run longer than T without another state-log append or artifact write.
- Append one `completed` record only after that step actually transitions or settles.
- Do not emit timer-only heartbeats; every record must correspond to a real step transition.
- At least one work-anchored field (`progress_delta` > 0 or a non-empty `artifact_path`) must be present on the `completed` record so a consumer can reject a zero-delta no-op pair (GAP-35). A pair with neither is invalid.
- `progress_delta` is a numeric unit-count (items, seats, bytes, etc.) scoped to the step. `artifact_path` is optional and only present when the transition produced or settled a concrete artifact.

Threshold T derivation:

T is half the watchdog no-progress window. The benchmark runner's watchdog fires after 120s of no new event AND no artifact mtime change, so a progress pair at T=60s resets the timer with a 60s margin for the watchdog to still catch a genuine stall if the step hangs after the `started` record.

Reducer allowlist (GAP-30):

Every completion reducer that derives completion from a `*-state.jsonl` uses an explicit allowlist of completion-bearing record types (`iteration`, `event`) and ignores `type:'progress'` / `event:'progress_record'` for completion math. A progress record can never be counted as a completion, an iteration, or a terminal stop. This is enforced by the shared `filterCompletionBearingRecords` helper imported by every reducer.

v1 readers must ignore `progress_record` events without error. v1.3 readers use them for liveness/watchdog support only — they never affect resume semantics, convergence scoring, or completion status.

---

## 6. RESUME SEMANTICS

The last completed event determines the next action. If `round_start` exists without all expected `seat_returned` events, redo or complete that round. If all seats returned but `deliberation_synthesized` is missing, synthesize deliberation. If deliberation exists but `round_end` is missing, close the round. If `council_complete` exists, treat the council as done unless the user requests another round.

---

## 7. VALIDATION POLICY

Per ADR-003, validation is convention-only for v1. Do not add a runtime schema validator unless a follow-on packet proves real drift.

Cross-references:
- Agent body: `.opencode/agents/ai-council.md` §14
- Decision context: ADR-001 in internal design notes
- Decision context: local doctor command ADRs ADR-003 and ADR-004
