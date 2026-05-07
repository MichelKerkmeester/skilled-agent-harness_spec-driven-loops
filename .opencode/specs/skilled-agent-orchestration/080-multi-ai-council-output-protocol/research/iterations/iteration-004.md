# Iteration 4: Q4 validator awareness

## Focus

Answer Q4: decide whether the spec validator should stay free-form for `ai-council/`, add non-blocking hints for missing `council-report.md`, or enforce recommended files only under explicit council-aware validation.

## Actions Taken

- Confirmed iteration number from `deep-research-state.jsonl`; three prior iteration records mean this is iteration 4.
- Read the strategy, findings registry, and iteration 3 narrative to avoid repeating Q1-Q3 and to follow §11 Next Focus.
- Inspected ADR-004, packet 080's council report risk table, the current validator regression test, `validate.sh`, and the TypeScript validation orchestrator.
- Compared the validator's existing severity model with the council artifact lifecycle to decide where a missing-report signal belongs.

## Findings

### 1. Strict layout enforcement would contradict ADR-004 and break in-flight council runs

ADR-004 explicitly keeps `ai-council/` free-form inside spec folders: `validate.sh --strict` must not enforce specific files under that subfolder, and internal layout is canonical-but-not-enforced at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:171`.

The rejected alternative is also explicit: requiring `council-report.md` was rejected because council runs can be in-flight and partial at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:177`. That makes a strict required-file rule the wrong default surface. A packet can legitimately contain `ai-council/ai-council-state.jsonl`, seats, and deliberations before the final report exists.

### 2. The current regression test protects free-form behavior, not a meaningful layout check

The vitest file states the policy directly: `ai-council/` is free-form alongside `scratch/`, `research/`, and `review/` at `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts:1`. The first test runs strict validation against packet 080 and asserts there is no unknown-subfolder failure and that validation passes at `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts:15`.

The second test is weaker than its title suggests: it only creates arbitrary `ai-council/` files and shells out to `ls`, so it proves filesystem presence is non-fatal but does not exercise the validator at `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts:25`. Packet 081 should keep the non-enforcement assertion, but replace or augment the second case with a real synthetic Level 1 packet that runs `validate.sh --strict` and still passes with partial `ai-council/` contents.

### 3. A warning inside `validate.sh --strict` is not safe, because strict mode converts warnings to failures

The validator already has a warning channel: `ValidationEntry.status` includes `warn` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:19`, and the shell validator has warning severities at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:75`. But strict mode treats warnings as failed validation: the TypeScript report marks `passed` false when `opts.strict && summary.warnings > 0` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:378`, and the shell summary prints `FAILED (strict)` when warnings exist under strict mode at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:899`.

That means "non-blocking hint" cannot be implemented as an ordinary validator warning if the normal completion gate is `validate.sh <spec-folder> --strict`. It would make missing `council-report.md` a hard failure in the exact path where ADR-004 says it should remain free-form.

### 4. The right split is free-form base validation plus an opt-in council-aware advisory check

Packet 080's council report identifies a real risk: orchestrators may bypass the future helper and cause artifact-layout drift; its proposed mitigation includes a validator hint flagging packets missing `council-report.md` at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:114` and again in the consolidated risk table at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:178`.

The evidence reconciles that with ADR-004 by making the hint opt-in and council-aware, not part of generic strict spec validation. Candidate shape:

- Keep `validate.sh --strict` unchanged for normal spec validation and completion gates.
- Add a separate council artifact check in packet 081 only after the persistence helper exists, e.g. `scripts/multi-ai-council/check-artifacts.cjs <spec-folder> [--expect-complete]`.
- In default mode, the check reports advisory info for `ai-council/` partial state but exits 0.
- With `--expect-complete`, it requires `ai-council/council-report.md` and can exit 1 for missing final report.
- Wire this check only from callers that know a council run has completed or from the helper's own post-write path, not from every `validate.sh --strict` invocation.

This preserves free-form evolution while still catching the specific operational failure the council identified: a completed dispatch whose report was never persisted.

### 5. Recommended validator work for packet 081 is test hardening, not new enforcement

Packet 081 should not add `ai-council/` to required spec docs or template contracts. The TypeScript validator's required-file logic is level-based at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:168`, and extending that to council artifacts would blur spec-document validation with optional planning evidence.

The landable validator-adjacent work is:

- Strengthen `multi-ai-council-validator.vitest.ts` so the partial-layout case actually invokes `validate.sh --strict` against a synthetic valid spec folder.
- Add a future helper-owned advisory check once `persist-artifacts.cjs` exists.
- Keep ADR-004 intact unless real drift appears across multiple packets.

## Questions Answered

- Q4 answered: the base validator should stay free-form for `ai-council/`; do not enforce `council-report.md` or internal layout in `validate.sh --strict`. Add only an explicit council-aware advisory/completion check, preferably owned by the future persistence helper or a sibling helper, and invoke it only when the caller knows a council run should be complete.

## Questions Remaining

- Q5 remains: skill advisor trigger scoring has not been inspected.
- Q6 remains: four-runtime mirror-sync automation still needs investigation.
- Q7 remains: state.jsonl forward-compat policy is separate from validator layout awareness.
- Q8 remains: `/memory:save` council anchoring needs a separate decision.
- Q9 remains: ADD-1..ADD-6 risks need a combined mitigation pass after Q5-Q8 sharpen the implementation shape.

## Next Focus

Iteration 5 should answer Q5: inspect the skill advisor hook/script scoring path and decide whether `multi-ai-council` deserves token or phrase boosts, or whether direct user dispatch remains sufficient.
