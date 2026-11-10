# Iteration 3: Contract-backed state versus residual complexity

## Focus

Investigate the first still-unanswered strategy question: which anchor-validation and doctor compatibility branches, states, fallbacks, or configuration are not earned by phases 009 and 013. The dispatch summary and strategy Next Focus repeat a question iteration 2 already answered; however, the dashboard and question checklist show iteration 2 complete and this question still open. I followed the first unchecked question, using only the requested implementation and requirement surface.

## Actions Taken

- Read the config, state log, strategy, findings registry, dashboard, and both prior iteration narratives before selecting focus. The state log contains canonical iterations 1 and 2; the failed earlier iteration-3 dispatch has no canonical iteration record. The current dashboard marks the first two questions answered and this question open. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-config.json:28-42] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-state.jsonl:4-8] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-dashboard.md:34-58] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/iterations/iteration-002.md:49-54]
- Compared planLayoutMove and its helpers plus the compatibility YAML against phase 009, then compared anchor-validation implementation against phase 013. All inspected implementation and specification files remained read-only.
- Did not run tests or builds. The reduced scope did not include doctor-script consumers or focused test files, so no claim is made that a declarative field is unused or a candidate behavior is untested.

## Findings

1. **The layout-map state machine is requirement-shaped, not gratuitous fallback machinery.** planLayoutMove distinguishes none, v4, v3, and partial; helpers preserve symlink identity, compare real targets, enumerate case-folded collisions, and return remaining move steps. Phase 009 requires detection of partial and complete moves, a path-map preview, collision checking before execution, and review of already-moved paths; the visible branches support those cases. No whole-state simplification is justified by this scope. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1185-1221] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1232-1305] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1312-1348] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:110-120] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:171-182]
2. **The compatibility workflow approvals, statuses, logging, and recovery are mostly mandated safety controls; only repeated declarative wording remains a small, unverified cleanup candidate.** The YAML requires a read-only preflight, map preview, explicit move approval, a separate upgrade approval, dirty-root refusal, per-step start/done/failure logging, post-move verification, interrupted-run recovery, and rollback reporting. These align with the required approval, preview, partial/complete handling, audit log, and resumability requirements. step_failure and on_step_failure repeat part of the same failure instruction, but may be separate workflow fields consumed independently; without inspecting their runtime consumer, collapsing them is not a justified functional simplification. The in-memory result schema likewise cannot be called dead configuration on this evidence. [SOURCE: .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:79-92] [SOURCE: .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:94-127] [SOURCE: .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:139-163] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:110-120] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:146-148]
3. **One anchor-order diagnostic exceeds phase 013’s explicit requirements, but removing its state could discard pre-existing validation behavior.** The validator’s opensAhead map and openedSoFar set distinguish a closer that appears before a later opener from a never-opened closer; phase 013 specifically requires nesting detection with the ADR-child exception and duplicate-closer detection, but does not name this additional message. This is a low-yield candidate (roughly one small pre-scan plus two tracking structures, around 5-10 lines net depending on replacement), not an approved deletion: older pairing behavior may rely on it, and no focused test was inspected. Keep the phase-013 nesting, ADR exception, fenced-code handling, and duplicate-closer logic. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:729-775] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:784-854] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md:75-85] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md:105-116] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md:163-170]

## Questions Answered

- Which parts of orchestrator.ts anchor validation (013) and the doctor update compatibility code and assets (009: planLayoutMove and its helpers, doctor-update-compat-action.yaml, the doctor scripts) carry fallbacks, states, configuration or abstraction no requirement asks for?

## Questions Remaining

- Which tests for these files mirror the implementation, re-assert the framework or add a case per branch above the coverage floor, and which tests pin each candidate simplification?
- What is the ranked list of concrete simplifications, each with its expected line or complexity reduction, its risk, the tests that pin it, and whether a requirement forbids it?

## Next Focus

Inspect only the relevant doctor compatibility and anchor-validation tests for redundant assertions versus essential behavioral pins, especially the ordering diagnostic and the two YAML failure-handling fields.

## Ruled Out

- Deleting planLayoutMove layout-state branches or collision and symlink checks: phase 009 preview and partial-move requirements depend on them.
- Removing move approval, upgrade approval, step logs, interrupted-run recovery, or rollback reporting: phase 009 requires a separately approved, auditable, resumable path.
- Removing pre-existing anchor pairing checks or the phase-parent exemption solely because phase 013 focuses on nesting and duplicate closers.

## Edge Cases

- **Ambiguous/stale focus metadata:** the generated Next Focus repeats the already answered question, while the dashboard marks it answered and the next unchecked question is the phase-009/013 complexity question. The latter governed this iteration.
- **Contradictory evidence:** none between code and the inspected phase requirements.
- **Missing dependencies:** doctor-script consumers and tests were intentionally outside this retry’s reduced read surface; this prevents concluding that repeated YAML instructions or the in-memory schema are unused.
- **Partial success:** none for the focused source comparison; tests were not run because this was read-only research and the retry scope excluded them.

## Sources Consulted

- specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-config.json
- specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-state.jsonl
- specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-strategy.md
- specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json
- specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/deep-research-dashboard.md
- specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/iterations/iteration-001.md
- specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/iterations/iteration-002.md
- .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts
- .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs
- .skilled/commands/doctor/assets/doctor-update-compat-action.yaml
- specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md
- specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md

## Assessment

- New information ratio: **0.83** (two new findings and one partial extension of prior anchor-contract context).
- Questions addressed: the phase-013 validator and phase-009 compatibility state/abstraction question.
- Questions answered: the exact question listed under Questions Answered.
- Questions remaining: two (test value/pinning and the ranked simplification list).

## Reflection

- What worked and why: matching concrete state transitions and diagnostics to explicit partial-move, approval, logging, and anchor requirements separated necessary safety machinery from possible excess.
- What did not work and why: without reading the doctor-script consumer or focused tests, it is not possible to establish whether repeated YAML instructions or the extra ordering diagnostic are externally consumed or pinned.
- What I would do differently: in the next iteration, inspect narrow test cases and consumer references that can establish whether either low-yield candidate is safe to rank.

## Recommended Next Focus

Map the implementation and contract surface to existing test assertions; identify tests that simply mirror branch structure versus tests that pin one potential simplification, without adding new tests or running code.
