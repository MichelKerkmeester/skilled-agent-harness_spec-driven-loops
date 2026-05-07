---
title: "Multi-AI Council State Format"
description: "Append-only JSONL event format for Multi-AI Council state, resume and audit records."
trigger_phrases:
  - "multi-ai-council state format"
  - "ai-council-state jsonl"
  - "council state events"
  - "council resume semantics"
importance_tier: "normal"
contextType: "reference"
---

# Multi-AI Council State Format

`ai-council-state.jsonl` is append-only JSONL. Each line is one state event used for resume, audit, and convergence decisions.

---

## 1. OVERVIEW

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
```

---

## 2. OPTIONAL METADATA FIELDS

Helper-emitted v1.1 rows add three optional metadata fields before the event payload:

```ts
type StateMetadata = {
  schema_version?: "1.1";
  protocol?: "multi-ai-council";
  producer?: "persist-artifacts.cjs@1.1.0";
};
```

Examples:

- `schema_version: "1.1"` identifies helper-emitted rows. Missing means implicit v1.
- `protocol: "multi-ai-council"` distinguishes council state from other JSONL logs.
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

This follows agent body §14 and ADR-001 in `.opencode/specs/skilled-agent-orchestration/092-multi-ai-council-deferrals/decision-record.md`.

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
{"schema_version":"1.1","protocol":"multi-ai-council","producer":"persist-artifacts.cjs@1.1.0","event":"round_start","round":1,"timestamp":"2026-05-06T12:00:00.000Z","seats":["seat-001","seat-002","seat-003"]}
{"schema_version":"1.1","protocol":"multi-ai-council","producer":"persist-artifacts.cjs@1.1.0","event":"seat_returned","round":1,"seat":"seat-001","timestamp":"2026-05-06T12:01:00.000Z","status":"ok","tokens":1400}
{"schema_version":"1.1","protocol":"multi-ai-council","producer":"persist-artifacts.cjs@1.1.0","event":"seat_returned","round":1,"seat":"seat-002","timestamp":"2026-05-06T12:01:30.000Z","status":"ok","tokens":1320}
{"schema_version":"1.1","protocol":"multi-ai-council","producer":"persist-artifacts.cjs@1.1.0","event":"seat_returned","round":1,"seat":"seat-003","timestamp":"2026-05-06T12:02:00.000Z","status":"ok","tokens":1510}
{"schema_version":"1.1","protocol":"multi-ai-council","producer":"persist-artifacts.cjs@1.1.0","event":"deliberation_synthesized","round":1,"timestamp":"2026-05-06T12:03:00.000Z","convergence_score":0.84}
{"schema_version":"1.1","protocol":"multi-ai-council","producer":"persist-artifacts.cjs@1.1.0","event":"round_end","round":1,"timestamp":"2026-05-06T12:03:30.000Z","new_findings_count":0}
{"schema_version":"1.1","protocol":"multi-ai-council","producer":"persist-artifacts.cjs@1.1.0","event":"council_complete","timestamp":"2026-05-06T12:04:00.000Z","final_report_path":"ai-council/council-report.md","convergence":true}
```

---

## 6. RESUME SEMANTICS

The last completed event determines the next action. If `round_start` exists without all expected `seat_returned` events, redo or complete that round. If all seats returned but `deliberation_synthesized` is missing, synthesize deliberation. If deliberation exists but `round_end` is missing, close the round. If `council_complete` exists, treat the council as done unless the user requests another round.

---

## 7. VALIDATION POLICY

Per ADR-003, validation is convention-only for v1. Do not add a runtime schema validator unless a follow-on packet proves real drift.

Cross-references:
- Agent body: `.opencode/agent/multi-ai-council.md` §14
- Packet 092 decision record: `.opencode/specs/skilled-agent-orchestration/092-multi-ai-council-deferrals/decision-record.md` ADR-001
- Decision record: `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md` ADR-003 and ADR-004
