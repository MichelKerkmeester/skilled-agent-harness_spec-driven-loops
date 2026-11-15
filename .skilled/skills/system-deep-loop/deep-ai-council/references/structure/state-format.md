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
version: 1.7.2.0
---

# AI Council State Format

`ai-council-state.jsonl` is append-only JSONL. Each line is one state event used for resume, audit, and convergence decisions.

---

## 1. OVERVIEW

### Purpose

Make the event log sufficient to tell an interrupted run from a completed one.

### When to Use

- You are resuming an interrupted council run.
- You are verifying that a run completed and its artifacts were written.
- You are adding or changing a state event type.

Every council run MUST end with a `council_complete` event once it converges or reaches `max_rounds`. Runs that exit before `council_complete` is written are incomplete and should be resumed or rolled back before completion is claimed. `council_complete` is not necessarily the final line in the file: each artifact write that follows it (the state log itself, config, strategy, deliberation, report, and seat files) appends its own `artifact_written` audit event — see §5.1.

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

This follows ADR-001 in the internal design notes.

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

### 5.1 WORKED EXAMPLE (V1.2 AUDIT TRAIL)

v1.2 adds audit events to the same append-only JSONL. Each artifact write records the relative `ai-council/` path, byte count, sha256 checksum, timestamp, optional seat id, and round id.

```jsonl
{"schema_version":"1.2","protocol":"ai-council","producer":"persist-artifacts@1.2.0","event":"artifact_written","path":"ai-council-state.jsonl","bytes":842,"checksum":"sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef","timestamp":"2026-05-08T22:30:00.000Z","seat_id":null,"round_id":"round-001"}
{"schema_version":"1.2","protocol":"ai-council","producer":"persist-artifacts@1.2.0","event":"artifact_written","path":"seats/round-001/seat-001-cli-opencode.md","bytes":2048,"checksum":"sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","timestamp":"2026-05-08T22:30:01.000Z","seat_id":"seat-001","round_id":"round-001"}
{"schema_version":"1.2","protocol":"ai-council","producer":"persist-artifacts@1.2.0","event":"rollback","round_id":"round-001","reason":"seat-002 timed out","timestamp":"2026-05-08T22:31:00.000Z","rollback_event_id":"rollback-round-001-20260508T223100Z","supersedes":["seats/round-001/seat-001-cli-opencode.md"]}
{"schema_version":"1.2","protocol":"ai-council","producer":"persist-artifacts@1.2.0","event":"artifact_superseded","original_path":"seats/round-001/seat-001-cli-opencode.md","round_id":"round-001","rollback_event_id":"rollback-round-001-20260508T223100Z","superseded_by":"rollback","timestamp":"2026-05-08T22:31:00.000Z"}
```

v1 readers must ignore `artifact_written`, `rollback`, and `artifact_superseded` events without error. v1.2 readers use them for completeness summaries, checksum verification, and rollback forensics. Outside of rollback scenarios, a normal completed run also appends an `artifact_written` event after `council_complete` for every artifact write that follows it (the state log itself, config, strategy, deliberation, report, and seat files); `council_complete` marks a run as done, but it is not guaranteed to be the last line in the file.

---

### 5.2 PROGRESS RECORD (v1.3, shared cross-mode)

A cross-cutting additive event type shared by all deep-loop modes (council, context, review, research). It provides step-transition liveness: `started`/`completed` pairs around long steps so the no-progress watchdog resets without masking genuine stalls. A progress record is NOT an iteration, a seat return, or a synthesis event — it is purely a liveness signal.

```ts
type ProgressRecord = {
  schema_version: "1.3";
  protocol: "deep-loop";
  type: "progress";
  event: "progress_record";
  mode: "ai-council" | "context" | "review" | "research";
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

Threshold T derivation:

T is half the watchdog no-progress window. The benchmark runner's watchdog fires after 120s of no new event AND no artifact mtime change, so a progress pair at T=60s resets the timer with a 60s margin for the watchdog to still catch a genuine stall if the step hangs after the `started` record.

Rules:

- Append one `started` record immediately before any step expected to run longer than T without another state-log append or artifact write.
- Append one `completed` record only after that step actually transitions or settles.
- Do not emit timer-only heartbeats; every record must correspond to a real step transition.
- At least one work-anchored field (`progress_delta` > 0 or a non-empty `artifact_path`) must be present on the `completed` record so a consumer can reject a zero-delta no-op pair (GAP-35). A pair with neither is invalid.
- `progress_delta` is a numeric unit-count (items, seats, bytes, etc.) scoped to the step. `artifact_path` is optional and only present when the transition produced or settled a concrete artifact.

Reducer allowlist (GAP-30):

Every completion reducer that derives completion from a `*-state.jsonl` uses an explicit allowlist of completion-bearing record types (`iteration`, `event`) and ignores `type:'progress'` / `event:'progress_record'` for completion math. A progress record can never be counted as a completion, an iteration, or a terminal stop. This is enforced by the shared `filterCompletionBearingRecords` helper imported by every reducer.

v1 readers must ignore `progress_record` events without error. v1.3 readers use them for liveness/watchdog support only — they never affect resume semantics, convergence scoring, or completion status.

---

## 6. ROUND MODEL AND RESUME SEMANTICS

### One Round per Invocation

`@ai-council` runs one round per invocation, then returns. The caller owns the round loop, the resume and the round limit. `max_rounds` defaults to 3, matching `lib/persist-artifacts.cjs` and `/deep:ai-council`.

The agent writes each artifact with Write and Edit and names every state event in its report, in order. The caller records those events through the append gateway (`append-mode-event.cjs --mode ai-council`). The gateway keeps them in the mode ledger and does not refresh `ai-council-state.jsonl`, because `append-mode-event.ts` registers no projection for this mode. Never write, rewrite or truncate `ai-council-state.jsonl` from the agent, and never put secrets, credentials, tokens or private keys into a state event.

### First Call

When no `ai-council/` folder exists at the resolved packet path, one invocation runs these steps in order. Each writer name is the shape of a file the agent writes with Write or Edit, and each event is one the agent names for the caller to record.

1. `writeConfig` initializes `ai-council-config.json` with `current_round: 1`, `status: "in_progress"` and timestamps.
2. `writeStrategyMd` authors the charter: purpose, task framing, selected lenses, vantage targets, evidence inputs, convergence rule and known constraints.
3. Event `round_start` (`round`, `seats`) opens the round.
4. Seats run: in parallel through the runtime's delegation tool at Depth 0, in context at Depth 1.
5. For each returning seat, `writeSeat` writes `seats/round-NNN/seat-MMM-*.md`, then event `seat_returned` (`round`, `seat`, `status`).
6. `writeDeliberation` writes `deliberations/round-NNN.md`: composition, comparison table, agreements, disagreements, cross-seat critique, synthesis and convergence decision.
7. Events `deliberation_synthesized` (`round`, `convergence_score`) and `round_end` (`round`).
8. Convergence check by the two-of-three rule in `../convergence/convergence-signals.md`. If converged, or if this round reached `max_rounds`, `writeReport` writes `council-report.md` and event `council_complete` (`final_report_path`, `convergence`) closes the run. Otherwise the agent returns with the round's result and the caller decides whether to invoke the next round.

### Subsequent Call

When the `ai-council/` folder exists, the agent reads `ai-council-config.json` and the round artifacts on disk. The next round is the highest round with a `deliberations/round-NNN.md` file, plus one. It runs that one round with the prior deliberation as input, steps 3 to 8, and does not rewrite earlier rounds.

### Resume

The caller resumes from the artifacts on disk, because the events of an interrupted invocation were never recorded. The last complete artifact decides the next action:

- `seats/round-NNN/` holds fewer seat files than the round started: rerun the missing seats, then continue from step 6.
- All seat files exist but `deliberations/round-NNN.md` is missing: run step 6 onward.
- `deliberations/round-NNN.md` exists but no `council-report.md` and the round did not converge: invoke the next round.
- `council-report.md` exists: treat the council as done unless the user requests another round.

When the helper wrote `ai-council-state.jsonl`, its events give the same answer: `round_start` without `round_end` means the round is incomplete, and `council_complete` means the council is done.

---

## 7. VALIDATION POLICY

Per ADR-003, validation is convention-only for v1. Do not add a runtime schema validator unless a follow-on packet proves real drift.

---

## 8. CROSS-REFERENCES

- Agent body: `.skilled/agents/ai-council.md` §7 RULES (round model and the pointer to this reference)
- Decision context: ADR-001 in internal design notes
- Decision context: local doctor command ADRs ADR-003 and ADR-004
