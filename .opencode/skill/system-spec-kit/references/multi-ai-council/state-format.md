# Multi-AI Council State Format

`ai-council-state.jsonl` is append-only JSONL. Each line is one state event used for resume, audit, and convergence decisions.

## Event Types

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

## Worked Example

```jsonl
{"event":"round_start","round":1,"timestamp":"2026-05-06T12:00:00.000Z","seats":["seat-001","seat-002","seat-003"]}
{"event":"seat_returned","round":1,"seat":"seat-001","timestamp":"2026-05-06T12:01:00.000Z","status":"ok","tokens":1400}
{"event":"seat_returned","round":1,"seat":"seat-002","timestamp":"2026-05-06T12:01:30.000Z","status":"ok","tokens":1320}
{"event":"seat_returned","round":1,"seat":"seat-003","timestamp":"2026-05-06T12:02:00.000Z","status":"ok","tokens":1510}
{"event":"deliberation_synthesized","round":1,"timestamp":"2026-05-06T12:03:00.000Z","convergence_score":0.84}
{"event":"round_end","round":1,"timestamp":"2026-05-06T12:03:30.000Z","new_findings_count":0}
{"event":"council_complete","timestamp":"2026-05-06T12:04:00.000Z","final_report_path":"ai-council/council-report.md","convergence":true}
```

## Resume Semantics

The last completed event determines the next action. If `round_start` exists without all expected `seat_returned` events, redo or complete that round. If all seats returned but `deliberation_synthesized` is missing, synthesize deliberation. If deliberation exists but `round_end` is missing, close the round. If `council_complete` exists, treat the council as done unless the user requests another round.

## Validation Policy

Per ADR-003, validation is convention-only for v1. Do not add a runtime schema validator unless a follow-on packet proves real drift.

Cross-references:
- Agent body: `.opencode/agent/multi-ai-council.md` §15
- Decision record: `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md` ADR-003 and ADR-004
