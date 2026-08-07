# Iteration 7: Q7 state.jsonl forward-compat strategy

## Focus

Answer Q7: define the `ai-council-state.jsonl` forward-compatibility strategy for v1.1, including versioned events, optional fields, schema evolution rules, and compatibility guidance for packet 080 artifacts.

## Actions Taken

- Confirmed the iteration number from `deep-research-state.jsonl`: six completed iteration records make this iteration 7.
- Read the strategy, findings registry, and iteration 6 narrative to preserve Q1-Q6 decisions and follow Section 11 Next Focus.
- Inspected the current multi-ai-council agent state contract in `.opencode/agents/multi-ai-council.md`.
- Compared the reference state schema in `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md` with the real packet 080 smoke-test state log.
- Checked sibling deep-research and deep-review reducer patterns for tolerant JSONL parsing and backward-compatible optional fields.

## Findings

### 1. v1.1 must remain compatible with bare `event` rows

The current council state schema does not use a `type` discriminator. The agent body documents five event shapes at `.opencode/agents/multi-ai-council.md:621` through `.opencode/agents/multi-ai-council.md:626`, and all examples at `.opencode/agents/multi-ai-council.md:629` through `.opencode/agents/multi-ai-council.md:634` are bare `{"event":...}` JSONL records. The reference state-format file repeats the same shape at `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md:7` through `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md:43`.

Packet 080's live smoke-test artifact confirms that this is not theoretical. `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/ai-council-state.jsonl:1` starts with `{"event":"round_start",...}` and line 14 closes with a second `{"event":"council_complete",...}`. None of the 14 lines contains `type`.

Therefore v1.1 should not introduce a required `type` field for council logs. Readers may treat missing `schema_version` as v1, and missing `type` as "council state event". Adding a required discriminator would break the shipped packet 080 artifact and contradict ADD-5's forward-only scope clarification in `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:159` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:161`.

### 2. Optional fields are already in use, so the policy should document them instead of rejecting them

The formal v1 schema is intentionally small. The agent body lists `tokens?`, `convergence_score?`, `new_findings_count?`, and `convergence?` as optional fields at `.opencode/agents/multi-ai-council.md:623` through `.opencode/agents/multi-ai-council.md:626`. The reference file has the same narrow contract at `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md:15` through `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md:43`.

The live state log already carries richer advisory fields: `lens`, `vantage`, `simulated`, and score fields on seat rows at `ai-council-state.jsonl:2` through `ai-council-state.jsonl:4`, agreement/disagreement text at line 5, leadership metadata at line 6, and amendments at line 14. A strict unknown-field rejection policy would fail on packet 080's own artifact.

v1.1 should therefore define two layers:

- Minimal required fields per event type, preserving deterministic resume.
- Extension fields allowed by default, with the rule that readers ignore unknown keys unless a feature explicitly requires them.

This mirrors the deep-research state-format approach. Its convergence fields are optional and explicitly backward compatible: old records without the field parse normally at `.opencode/skills/deep-research/references/state_format.md:152` through `.opencode/skills/deep-research/references/state_format.md:167`.

### 3. Add `schema_version` as optional per-line metadata, not as a migration requirement

The least disruptive v1.1 versioning rule is:

```ts
type CouncilStateEnvelope = {
  event: "round_start" | "seat_returned" | "deliberation_synthesized" | "round_end" | "council_complete" | string;
  schema_version?: "1.0" | "1.1";
  protocol?: "multi-ai-council";
  producer?: string;
};
```

Existing v1 rows omit all of these fields. New v1.1 emitters may add `schema_version:"1.1"` and `protocol:"multi-ai-council"` to each new line, but they must not rewrite old lines. This keeps the append-only invariant from `.opencode/agents/multi-ai-council.md:637` intact.

Do not add a separate `schema_version` config migration as the primary compatibility mechanism. `ai-council-config.json` can track packet-level metadata later, but resume decisions operate from the append-only log. Per-line optional versioning makes mixed-version logs readable after interruption or resumed rounds.

### 4. Tolerant reader behavior is already the sibling reducer pattern

Deep-research parses JSONL line by line, collects valid records, and records corruption warnings for malformed lines rather than assuming every line has the latest shape. The parser behavior is visible in `.opencode/skills/deep-research/scripts/reduce-state.cjs:86` through `.opencode/skills/deep-research/scripts/reduce-state.cjs:109`. Deep-review exposes the same backward-compatible parser contract at `.opencode/skills/deep-review/scripts/reduce-state.cjs:107` through `.opencode/skills/deep-review/scripts/reduce-state.cjs:125`.

Council v1.1 does not need to import the full reducer machinery, but it should copy the reading policy:

- Parse valid JSON lines independently.
- Treat malformed lines as corruption warnings for any future helper/advisory tool.
- Filter by `event` and required fields for resume decisions.
- Ignore unknown keys.
- Prefer latest relevant event when duplicates exist.

That gives forward compatibility without violating ADR-003's convention-only validation decision.

### 5. Schema evolution should be additive until a runtime validator is justified

ADR-003 explicitly chose documented JSONL with convention-only validation at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:131` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:139`. It rejected a TypeScript-validated runtime schema as premature at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:148` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:151`.

For v1.1, the evolution policy should be:

- Additive changes only: optional fields and optional new event types are allowed.
- Required field removals are forbidden.
- Required field additions to existing event types are forbidden until a named v2.
- New event types must be skippable by v1 readers and must not be required for resume.
- Existing event names keep their meaning.
- Existing packet 080 artifacts are not migrated or normalized.

This keeps the lightweight bound from ADR-001 intact while leaving room for later helper diagnostics.

## Questions Answered

- Q7 answered: v1.1 should adopt additive, per-line optional version metadata (`schema_version`, `protocol`, optionally `producer`) while preserving bare `event` rows as valid v1 records. Readers should be tolerant: parse valid lines, ignore unknown keys, treat missing `schema_version` as v1, and base resume only on the minimal required fields for known event types.

## Questions Remaining

- Q8 remains: `/memory:save` council-completion anchoring should decide whether `council_complete` or `council-report.md` becomes a canonical memory anchor.
- Q9 remains: ADD-1..ADD-6 risk mitigation should incorporate the Q7 compatibility policy, especially ADD-2 and ADD-3.
- Q10 remains: lightweight-bound revisit conditions should be answered last, after the maintenance costs from Q8 and Q9 are visible.

## Next Focus

Iteration 8 should answer Q8: decide whether `/memory:save` should learn a council-completion anchor such as `ANCHOR:council-report-{packet}`, and how that would interact with existing canonical save behavior.
