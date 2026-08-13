# Iteration 023 — traceability

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T07:51:38.463Z
- New findings: 3 (of 3 reported; prior total 81)
- Coverage: {"filesExamined":42,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/deep-alignment-ledger-types.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema/legacy-compatibility.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema/deep-ai-council-ledger-types.ts",".opencode/commands/deep/assets/deep-alignment-auto.yaml",".opencode/commands/deep/assets/deep-ai-council-auto.yaml",".opencode/agents/deep-alignment.md",".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs",".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs",".opencode/skills/system-deep-loop/runtime/lib/council/round-state-jsonl.cjs",".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs",".opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/spec.md",".opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/spec.md"]}

## Summary
I traced both 013 typed lane families against their live alignment and AI-council writers. The typed packages remain additive-dark and are consumed by runtime tests, while live commands still emit legacy JSONL. Compatibility boundaries contain concrete mismatches: alignment iterations are mislabeled, live alignment records lack required identity and event mappings, and council heartbeat/terminal records are unregistered. These defects prevent faithful replay or migration of normal lifecycle evidence.

## Findings
- [P1] F-023-01 Alignment upcaster treats every iteration as lane completion @ .opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts:92
  - evidence: `recordTarget()` maps every record with `type === 'iteration'` to `deep_alignment.lane_completed`. The live command dispatches one lane-slice iteration at `.opencode/commands/deep/assets/deep-alignment-auto.yaml:352-354`, and the agent contract requires each per-iteration record to use `type:"iteration"` at `.opencode/agents/deep-alignment.md:226-230`. A migrated slice is therefore represented as terminal lane completion rather than an iteration/convergence observation.
  - recommendation: Require an explicit lane-terminal marker before emitting `lane_completed`, or add a dedicated upcast path for per-slice iteration records. Test with a command-generated multi-slice lane stream and verify the reducer does not complete the lane after the first slice.
- [P1] F-023-02 Alignment compatibility cannot migrate live identity and convergence records @ .opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts:77
  - evidence: `hasStableIdentity()` requires `runId`, `sessionId`, and `authorityEpochId`, but the live config record at `.opencode/commands/deep/assets/deep-alignment-auto.yaml:252` emits only `sessionId`. The same file emits `type:"event", event:"convergence_check"` at line 732, while `LEGACY_EVENT_STEMS` registers only `resumed`, `restarted`, and `blocked_stop`. The decision path therefore returns `pin-old-runtime` for normal config/iteration records and `blocked:unknown-legacy-record` for convergence records.
  - recommendation: Stamp live records with the authenticated run and authority identity required by the schema, register the actual convergence event vocabulary, and add fixtures copied from command output rather than synthetic identity-complete records.
- [P1] F-023-03 Council compatibility rejects live heartbeat and terminal state records @ .opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema/legacy-compatibility.ts:194
  - evidence: `PINNED_LEGACY_EVENTS` contains `progress_record`, but the decision checks `input.event`; the live heartbeat is `{type:'progress_record', event:'session_heartbeat'}` at `deep-ai-council/scripts/orchestrate-session.cjs:423-431`, so it is neither pinned nor mapped and becomes `unknown-legacy-record`. The live writers also emit `type:'topic_completed'` and `type:'round_completed'` at `orchestrate-session.cjs:520-524` and `orchestrate-topic.cjs:257-261`, neither of which appears in `LEGACY_EVENT_STEMS`; the round payload additionally lacks the required `runId` checked at line 89.
  - recommendation: Match pinned records using the actual record discriminator, register the shipped session/topic/round event vocabulary, and bind missing run identity from authenticated session context before migration.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 23,
  "dimension": "traceability",
  "summary": "I traced both 013 typed lane families against their live alignment and AI-council writers. The typed packages remain additive-dark and are consumed by runtime tests, while live commands still emit legacy JSONL. Compatibility boundaries contain concrete mismatches: alignment iterations are mislabeled, live alignment records lack required identity and event mappings, and council heartbeat/terminal records are unregistered. These defects prevent faithful replay or migration of normal lifecycle evidence.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Alignment upcaster treats every iteration as lane completion",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts",
      "line": 92,
      "evidence": "`recordTarget()` maps every record with `type === 'iteration'` to `deep_alignment.lane_completed`. The live command dispatches one lane-slice iteration at `.opencode/commands/deep/assets/deep-alignment-auto.yaml:352-354`, and the agent contract requires each per-iteration record to use `type:\"iteration\"` at `.opencode/agents/deep-alignment.md:226-230`. A migrated slice is therefore represented as terminal lane completion rather than an iteration/convergence observation.",
      "recommendation": "Require an explicit lane-terminal marker before emitting `lane_completed`, or add a dedicated upcast path for per-slice iteration records. Test with a command-generated multi-slice lane stream and verify the reducer does not complete the lane after the first slice."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Alignment compatibility cannot migrate live identity and convergence records",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts",
      "line": 77,
      "evidence": "`hasStableIdentity()` requires `runId`, `sessionId`, and `authorityEpochId`, but the live config record at `.opencode/commands/deep/assets/deep-alignment-auto.yaml:252` emits only `sessionId`. The same file emits `type:\"event\", event:\"convergence_check\"` at line 732, while `LEGACY_EVENT_STEMS` registers only `resumed`, `restarted`, and `blocked_stop`. The decision path therefore returns `pin-old-runtime` for normal config/iteration records and `blocked:unknown-legacy-record` for convergence records.",
      "recommendation": "Stamp live records with the authenticated run and authority identity required by the schema, register the actual convergence event vocabulary, and add fixtures copied from command output rather than synthetic identity-complete records."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Council compatibility rejects live heartbeat and terminal state records",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema/legacy-compatibility.ts",
      "line": 194,
      "evidence": "`PINNED_LEGACY_EVENTS` contains `progress_record`, but the decision checks `input.event`; the live heartbeat is `{type:'progress_record', event:'session_heartbeat'}` at `deep-ai-council/scripts/orchestrate-session.cjs:423-431`, so it is neither pinned nor mapped and becomes `unknown-legacy-record`. The live writers also emit `type:'topic_completed'` and `type:'round_completed'` at `orchestrate-session.cjs:520-524` and `orchestrate-topic.cjs:257-261`, neither of which appears in `LEGACY_EVENT_STEMS`; the round payload additionally lacks the required `runId` checked at line 89.",
      "recommendation": "Match pinned records using the actual record discriminator, register the shipped session/topic/round event vocabulary, and bind missing run identity from authenticated session context before migration."
    }
  ],
  "refutations": [
    {
      "id": "F-022-01",
      "verdict": "deepened",
      "reason": "The same absence of live callers for 013 typed runtime packages exists in the scoped alignment and AI-council command paths: imports are confined to runtime/lib and unit tests. The phase summaries describe these surfaces as additive-dark, so this was treated as evidence broadening for the existing integration finding, not reported as a separate cutover defect."
    }
  ],
  "coverage": {
    "filesExamined": 42,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/deep-alignment-ledger-types.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema/legacy-compatibility.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema/deep-ai-council-ledger-types.ts",
      ".opencode/commands/deep/assets/deep-alignment-auto.yaml",
      ".opencode/commands/deep/assets/deep-ai-council-auto.yaml",
      ".opencode/agents/deep-alignment.md",
      ".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs",
      ".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs",
      ".opencode/skills/system-deep-loop/runtime/lib/council/round-state-jsonl.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs",
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/spec.md",
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/spec.md"
    ]
  }
}
```