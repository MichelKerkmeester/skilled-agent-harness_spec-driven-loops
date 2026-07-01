# Iteration 5: Weak Evidence And Discovery Metadata

## Focus

Audit implementation evidence and metadata for weak-evidence phases and resource-map/key-file coverage.

## Findings

1. Root discovery metadata is still too sparse for a packet whose scope spans runtime, workflows, deep commands, and remediation. The parent `graph-metadata.json` status is `in_progress`, but `key_files` lists only `001-reference-research/research/research.md` and `spec.md` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/graph-metadata.json:42`-`.opencode/specs/deep-loops/030-agent-loops-improved/graph-metadata.json:47`]. This contradicts the parent scope table that names `.opencode/skills/deep-loop-runtime/**`, `.opencode/skills/deep-loop-workflows/**`, and `.opencode/commands/{deep,speckit}/**` as implementation surfaces [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/spec.md:78`-`.opencode/specs/deep-loops/030-agent-loops-improved/spec.md:86`]. Recommendation: backfill root `key_files` or generate a root `resource-map.md` with actual implementation surfaces and active review lineage artifacts.

2. Phase 008 remediation metadata remains biased toward docs and one benchmark workflow, not the fan-out/remediation runtime surfaces. Its `key_files` list includes `spec.md`, `plan.md`, `deep_model-benchmark_auto.yaml`, `tasks.md`, `implementation-summary.md`, and `handover.md` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/graph-metadata.json:49`-`.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/graph-metadata.json:58`], while the repaired phase 008 spec continuity says the important current files are `fanout-run.cjs`, `fanout-merge.cjs`, and `cli-guards.cjs` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/spec.md:14`-`.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/spec.md:23`]. Recommendation: regenerate graph metadata after continuity/key-file updates and assert key-file coverage includes current runtime surfaces.

3. `008/003-model-benchmark-reducer-ledger` is weak evidence: tasks mark the targeted Vitest attempt as checked complete [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/003-model-benchmark-reducer-ledger/tasks.md:73`-`.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/003-model-benchmark-reducer-ledger/tasks.md:81`], but the implementation summary says the targeted Vitest suites were blocked because no local runner was installed and network access prevented `npx` download [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/003-model-benchmark-reducer-ledger/implementation-summary.md:97`-`.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/003-model-benchmark-reducer-ledger/implementation-summary.md:103`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/003-model-benchmark-reducer-ledger/implementation-summary.md:109`-`.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/003-model-benchmark-reducer-ledger/implementation-summary.md:112`]. Recommendation: represent blocked tests as `[B]` or separate `attempted` evidence; completion should not say all verification passed when the primary targeted test gate did not run.

4. `006/005-per-iteration-memory-upsert` has a direct contradiction between summary and tasks. The implementation summary says `Unit tests (vitest) PASS` and `validate.sh --strict PASS` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/006-ux-observability-automation/005-per-iteration-memory-upsert/implementation-summary.md:80`-`.opencode/specs/deep-loops/030-agent-loops-improved/006-ux-observability-automation/005-per-iteration-memory-upsert/implementation-summary.md:85`], but the tasks file still has unchecked generic verification and completion criteria [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/006-ux-observability-automation/005-per-iteration-memory-upsert/tasks.md:71`-`.opencode/specs/deep-loops/030-agent-loops-improved/006-ux-observability-automation/005-per-iteration-memory-upsert/tasks.md:87`].

5. `006/006-loop-wide-dry-run` repeats the same weak-evidence pattern: summary claims unit tests and strict validation passed [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/006-ux-observability-automation/006-loop-wide-dry-run/implementation-summary.md:80`-`.opencode/specs/deep-loops/030-agent-loops-improved/006-ux-observability-automation/006-loop-wide-dry-run/implementation-summary.md:85`], but tasks still have unchecked generic verification and completion criteria [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/006-ux-observability-automation/006-loop-wide-dry-run/tasks.md:71`-`.opencode/specs/deep-loops/030-agent-loops-improved/006-ux-observability-automation/006-loop-wide-dry-run/tasks.md:87`]. Recommendation: require checklist/task synchronization evidence before a phase's implementation summary can claim green verification.

## Sources Consulted

- Root `graph-metadata.json`
- Phase 008 `graph-metadata.json`
- Phase 008 `spec.md`
- `008/003-model-benchmark-reducer-ledger/implementation-summary.md`
- `008/003-model-benchmark-reducer-ledger/tasks.md`
- `006/005-per-iteration-memory-upsert/implementation-summary.md`
- `006/005-per-iteration-memory-upsert/tasks.md`
- `006/006-loop-wide-dry-run/implementation-summary.md`
- `006/006-loop-wide-dry-run/tasks.md`

## Assessment

- newInfoRatio: 0.68
- Novelty justification: This converted known weak-evidence hints into concrete source-backed contradictions and metadata gaps.
- Confidence: High for cited contradictions; medium for full metadata coverage because no regeneration was run.

## Reflection

- What worked: Comparing implementation summaries to tasks exposed claim/evidence drift.
- What failed: Graph metadata does not explain why certain key files were selected, making root-cause attribution uncertain.
- Ruled out: Treating blocked test attempts as equivalent to green test evidence.

## Recommended Next Focus

Audit ADR/checklist presence for ADR-style phases and validation/completion gates.
