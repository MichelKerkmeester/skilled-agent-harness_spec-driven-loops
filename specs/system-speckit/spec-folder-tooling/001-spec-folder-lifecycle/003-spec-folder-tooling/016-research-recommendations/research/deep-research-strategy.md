---
title: "Deep Research Strategy: research-recommendations overengineering"
description: "Session tracking for the deep-research run on overengineering and simplification in the research-recommendations build."
---

# Deep Research Strategy

## 2. TOPIC
Overengineering and simplification in the research-recommendations build. Code in scope: `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`, `runtime/cli/spec/upgrade-legacy.mjs`, `runtime/lib/validation/orchestrator.ts`, `runtime/cli/lib/frontmatter-migration.ts`, the doctor update compatibility assets under `.skilled/commands/doctor/`, and their tests. Judge every point against `.skilled/repo-rules/prevent-overengineering.md` and the Restraint Signals in `AGENTS.md` section 3, measured against what the phase specs under `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/` (phases 003, 009, 011, 012, 013, 015) actually require.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which modes, flags, options and branches in heal-spec-docs.cjs and upgrade-legacy.mjs (anchor repair from 011, folded one-off repairs from 012, lane rules as heal modes from 015) go beyond what those phase specs require?
- [x] Where does duplicated machinery remain across heal-spec-docs.cjs, upgrade-legacy.mjs and frontmatter-migration.ts (writers, loaders, parsers, walkers, refusal ordering, exports), and did the eight applied P2 simplifications go far enough?
- [x] Which parts of orchestrator.ts anchor validation (013) and the doctor update compatibility code and assets (009: planLayoutMove and its helpers, doctor-update-compat-action.yaml, the doctor scripts) carry fallbacks, states, configuration or abstraction no requirement asks for?
- [x] Which tests for these files mirror the implementation, re-assert the framework or add a case per branch above the coverage floor, and which tests pin each candidate simplification?
- [x] What is the ranked list of concrete simplifications, each with its expected line or complexity reduction, its risk, the tests that pin it, and whether a requirement forbids it?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Not a bug hunt: correctness defects are recorded only when they bear on a simplification.
- No code, test or spec edits: the research is read-only on all code; writes go only under this research/ directory.
- Not re-deriving the eight P2 simplifications already applied after the Opus review (section numbering, one atomic writer, one healer loader, a planLayoutMove JSDoc, an unreachable fallback, the nesting-severity constant, two private exports). Only judge whether they went far enough.
- Not reviewing phases 001, 002, 004-008, 010, 014, 016 except where their code is shared with the files in scope.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: the operator asked for exactly 5 iterations; convergence is telemetry only.
- Halt if the executor fails three iterations in a row (error recovery in the workflow).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which modes, flags, options and branches in heal-spec-docs.cjs and upgrade-legacy.mjs (anchor repair from 011, folded one-off repairs from 012, lane rules as heal modes from 015) go beyond what those phase specs require?
- Where does duplicated machinery remain across heal-spec-docs.cjs, upgrade-legacy.mjs and frontmatter-migration.ts (writers, loaders, parsers, walkers, refusal ordering, exports), and did the eight applied P2 simplifications go far enough?
- Which parts of orchestrator.ts anchor validation (013) and the doctor update compatibility code and assets (009: planLayoutMove and its helpers, doctor-update-compat-action.yaml, the doctor scripts) carry fallbacks, states, configuration or abstraction no requirement asks for?
- Which tests for these files mirror the implementation, re-assert the framework or add a case per branch above the coverage floor, and which tests pin each candidate simplification?
- What is the ranked list of concrete simplifications, each with its expected line or complexity reduction, its risk, the tests that pin it, and whether a requirement forbids it?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- comparing the exact phase scope with the live CLI branches separated optional interface convenience from required repair behavior. (iteration 1)
- tracing actual callers and data contracts distinguished repeated syntax from interchangeable behavior, avoiding a speculative “one helper” recommendation. (iteration 2)
- matching concrete state transitions and diagnostics to explicit partial-move, approval, logging, and anchor requirements separated necessary safety machinery from possible excess. (iteration 3)
- reading the focused tests alongside the phase requirement separated test-only mode isolation from the optional CLI selector and distinguished list pinning from actual ordered execution. (iteration 4)
- comparing the current phase edge case and test directly against the earlier registry note exposed that the anchor-order diagnostic was requirement-backed, not optional. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- no second-model review was run because the dispatch forbids sub-agents and CLI dispatch. The judgment is grounded in phase requirements, current call paths, tests and a bounded non-test reference search; an external consumer could alter the trade-off. (iteration 1)
- a bounded textual search did not locate a direct refusal-sort test; source inspection alone cannot establish that stable output is intentionally pinned elsewhere. (iteration 2)
- without reading the doctor-script consumer or focused tests, it is not possible to establish whether repeated YAML instructions or the extra ordering diagnostic are externally consumed or pinned. (iteration 3)
- a current `sortRefusals` test was not found in the bounded search. Existing repeated-run equality proves stable output for identical inputs, not canonical ordering across different input orders. (iteration 4)
- the in-repository search cannot prove that external tools do not use either healer CLI option or rely on the doctor action's field names. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Deleting planLayoutMove layout-state branches or collision and symlink checks: phase 009 preview and partial-move requirements depend on them. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Deleting planLayoutMove layout-state branches or collision and symlink checks: phase 009 preview and partial-move requirements depend on them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deleting planLayoutMove layout-state branches or collision and symlink checks: phase 009 preview and partial-move requirements depend on them.

### Do not merge the manifest writer with the healer writer, the focused healer frontmatter reader with the full migration parser, or the active and archive walkers. The existing evidence shows distinct write, parse, and selection contracts. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:225-244] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Do not merge the manifest writer with the healer writer, the focused healer frontmatter reader with the full migration parser, or the active and archive walkers. The existing evidence shows distinct write, parse, and selection contracts. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:225-244]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not merge the manifest writer with the healer writer, the focused healer frontmatter reader with the full migration parser, or the active and archive walkers. The existing evidence shows distinct write, parse, and selection contracts. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:225-244]

### Do not merge the reversibility-manifest writer with the healer writer without preserving the manifest's exclusive-create and private-file semantics. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Do not merge the reversibility-manifest writer with the healer writer without preserving the manifest's exclusive-create and private-file semantics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not merge the reversibility-manifest writer with the healer writer without preserving the manifest's exclusive-create and private-file semantics.

### Do not merge the specialized healer frontmatter reader with the full migration parser without a demonstrated shared contract; their visible responsibilities differ. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Do not merge the specialized healer frontmatter reader with the full migration parser without a demonstrated shared contract; their visible responsibilities differ.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not merge the specialized healer frontmatter reader with the full migration parser without a demonstrated shared contract; their visible responsibilities differ.

### Do not remove deterministic refusal sorting without checking the persisted-baseline equality contract and adding a focused ordering assertion. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Do not remove deterministic refusal sorting without checking the persisted-baseline equality contract and adding a focused ordering assertion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not remove deterministic refusal sorting without checking the persisted-baseline equality contract and adding a focused ordering assertion.

### Do not remove refusal sorting based on the present evidence. A direct order assertion is missing, but baseline stability is exercised by repeated-run equality. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1141-1160] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1267-1283] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Do not remove refusal sorting based on the present evidence. A direct order assertion is missing, but baseline stability is exercised by repeated-run equality. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1141-1160] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1267-1283]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not remove refusal sorting based on the present evidence. A direct order assertion is missing, but baseline stability is exercised by repeated-run equality. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1141-1160] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1267-1283]

### Do not remove the lane-mode behaviors, their refusal and idempotence gates, or the ordered all-mode run. Phase 015 requires them. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-114] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Do not remove the lane-mode behaviors, their refusal and idempotence gates, or the ordered all-mode run. Phase 015 requires them. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-114]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not remove the lane-mode behaviors, their refusal and idempotence gates, or the ordered all-mode run. Phase 015 requires them. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-114]

### Do not replace both packet discovery paths with a configurable generic walker based only on traversal similarity; active/archive/artifact and skip policies differ. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Do not replace both packet discovery paths with a configurable generic walker based only on traversal similarity; active/archive/artifact and skip policies differ.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not replace both packet discovery paths with a configurable generic walker based only on traversal similarity; active/archive/artifact and skip policies differ.

### Merging archived packets into the active repair path: phase 011 explicitly restricts archive edits to questions-anchor un-nesting. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:78-80]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:114-116]` -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Merging archived packets into the active repair path: phase 011 explicitly restricts archive edits to questions-anchor un-nesting. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:78-80]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:114-116]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Merging archived packets into the active repair path: phase 011 explicitly restricts archive edits to questions-anchor un-nesting. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:78-80]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:114-116]`

### Merging distinct file writers, parsers or walkers, or removing refusal sorting based on the evidence from the previous iteration. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:230-263] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/iterations/iteration-004.md:31-35] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Merging distinct file writers, parsers or walkers, or removing refusal sorting based on the evidence from the previous iteration. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:230-263] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/iterations/iteration-004.md:31-35]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Merging distinct file writers, parsers or walkers, or removing refusal sorting based on the evidence from the previous iteration. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:230-263] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/iterations/iteration-004.md:31-35]

### Removing any of the five lane modes, their refusal/idempotence gates or the all-mode sequence: phase 015 requires each. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:73-77]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:103-113]` -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Removing any of the five lane modes, their refusal/idempotence gates or the all-mode sequence: phase 015 requires each. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:73-77]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:103-113]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing any of the five lane modes, their refusal/idempotence gates or the all-mode sequence: phase 015 requires each. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:73-77]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:103-113]`

### Removing grouped-detail reporting: phase 012 requires grouped failures with detail counts. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/012-fold-one-off-repairs/spec.md:47-50]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/012-fold-one-off-repairs/spec.md:104-113]` -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Removing grouped-detail reporting: phase 012 requires grouped failures with detail counts. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/012-fold-one-off-repairs/spec.md:47-50]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/012-fold-one-off-repairs/spec.md:104-113]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing grouped-detail reporting: phase 012 requires grouped failures with detail counts. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/012-fold-one-off-repairs/spec.md:47-50]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/012-fold-one-off-repairs/spec.md:104-113]`

### Removing move approval, upgrade approval, step logs, interrupted-run recovery, or rollback reporting: phase 009 requires a separately approved, auditable, resumable path. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Removing move approval, upgrade approval, step logs, interrupted-run recovery, or rollback reporting: phase 009 requires a separately approved, auditable, resumable path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing move approval, upgrade approval, step logs, interrupted-run recovery, or rollback reporting: phase 009 requires a separately approved, auditable, resumable path.

### Removing pre-existing anchor pairing checks or the phase-parent exemption solely because phase 013 focuses on nesting and duplicate closers. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Removing pre-existing anchor pairing checks or the phase-parent exemption solely because phase 013 focuses on nesting and duplicate closers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing pre-existing anchor pairing checks or the phase-parent exemption solely because phase 013 focuses on nesting and duplicate closers.

### Removing the anchor-repair mode or its dry-run/apply route: phase 011 explicitly requires the repair mode, correct dry run and upgrade integration. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:48-52]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:72-80]` -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Removing the anchor-repair mode or its dry-run/apply route: phase 011 explicitly requires the repair mode, correct dry run and upgrade integration. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:48-52]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:72-80]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing the anchor-repair mode or its dry-run/apply route: phase 011 explicitly requires the repair mode, correct dry run and upgrade integration. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:48-52]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:72-80]`

### Removing the close-before-open diagnostic. Phase 013 explicitly requires it, and a focused test pins it. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md:172-178] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:185-198] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Removing the close-before-open diagnostic. Phase 013 explicitly requires it, and a focused test pins it. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md:172-178] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:185-198]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing the close-before-open diagnostic. Phase 013 explicitly requires it, and a focused test pins it. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md:172-178] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:185-198]

### Removing the doctor layout-state cases, preview and collision checks, separate approvals, logs, interrupted-run recovery or rollback reporting. Phase 009 requires these safety and recovery behaviors. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:110-120] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:170-182] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Removing the doctor layout-state cases, preview and collision checks, separate approvals, logs, interrupted-run recovery or rollback reporting. Phase 009 requires these safety and recovery behaviors. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:110-120] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:170-182]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing the doctor layout-state cases, preview and collision checks, separate approvals, logs, interrupted-run recovery or rollback reporting. Phase 009 requires these safety and recovery behaviors. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:110-120] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:170-182]

### Removing the five lane modes, their derivability/refusal behavior, idempotence gates or ordered upgrade integration. Phase 015 requires these behaviors and tests. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-114] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Removing the five lane modes, their derivability/refusal behavior, idempotence gates or ordered upgrade integration. Phase 015 requires these behaviors and tests. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-114]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing the five lane modes, their derivability/refusal behavior, idempotence gates or ordered upgrade integration. Phase 015 requires these behaviors and tests. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-114]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Merging archived packets into the active repair path: phase 011 explicitly restricts archive edits to questions-anchor un-nesting. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:78-80]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:114-116]` (iteration 1)
- Removing any of the five lane modes, their refusal/idempotence gates or the all-mode sequence: phase 015 requires each. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:73-77]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/015-lane-rules-as-heal-modes/spec.md:103-113]` (iteration 1)
- Removing grouped-detail reporting: phase 012 requires grouped failures with detail counts. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/012-fold-one-off-repairs/spec.md:47-50]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/012-fold-one-off-repairs/spec.md:104-113]` (iteration 1)
- Removing the anchor-repair mode or its dry-run/apply route: phase 011 explicitly requires the repair mode, correct dry run and upgrade integration. `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:48-52]` `[SOURCE: specs/system-speckit/034-spec-folder-tooling/011-anchor-repair-mode/spec.md:72-80]` (iteration 1)
- Do not merge the reversibility-manifest writer with the healer writer without preserving the manifest's exclusive-create and private-file semantics. (iteration 2)
- Do not merge the specialized healer frontmatter reader with the full migration parser without a demonstrated shared contract; their visible responsibilities differ. (iteration 2)
- Do not remove deterministic refusal sorting without checking the persisted-baseline equality contract and adding a focused ordering assertion. (iteration 2)
- Do not replace both packet discovery paths with a configurable generic walker based only on traversal similarity; active/archive/artifact and skip policies differ. (iteration 2)
- Deleting planLayoutMove layout-state branches or collision and symlink checks: phase 009 preview and partial-move requirements depend on them. (iteration 3)
- Removing move approval, upgrade approval, step logs, interrupted-run recovery, or rollback reporting: phase 009 requires a separately approved, auditable, resumable path. (iteration 3)
- Removing pre-existing anchor pairing checks or the phase-parent exemption solely because phase 013 focuses on nesting and duplicate closers. (iteration 3)
- Do not merge the manifest writer with the healer writer, the focused healer frontmatter reader with the full migration parser, or the active and archive walkers. The existing evidence shows distinct write, parse, and selection contracts. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:225-244] (iteration 4)
- Do not remove refusal sorting based on the present evidence. A direct order assertion is missing, but baseline stability is exercised by repeated-run equality. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1141-1160] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1267-1283] (iteration 4)
- Do not remove the lane-mode behaviors, their refusal and idempotence gates, or the ordered all-mode run. Phase 015 requires them. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-114] (iteration 4)
- Merging distinct file writers, parsers or walkers, or removing refusal sorting based on the evidence from the previous iteration. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/findings-registry.json:230-263] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/iterations/iteration-004.md:31-35] (iteration 5)
- Removing the close-before-open diagnostic. Phase 013 explicitly requires it, and a focused test pins it. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md:172-178] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:185-198] (iteration 5)
- Removing the doctor layout-state cases, preview and collision checks, separate approvals, logs, interrupted-run recovery or rollback reporting. Phase 009 requires these safety and recovery behaviors. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:110-120] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md:170-182] (iteration 5)
- Removing the five lane modes, their derivability/refusal behavior, idempotence gates or ordered upgrade integration. Phase 015 requires these behaviors and tests. [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:73-77] [SOURCE: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md:103-114] (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Which parts of orchestrator.ts anchor validation (013) and the doctor update compatibility code and assets (009: planLayoutMove and its helpers, doctor-update-compat-action.yaml, the doctor scripts) carry fallbacks, states, configuration or abstraction no requirement asks for? (iteration 1)
- Which tests for these files mirror the implementation, re-assert the framework or add a case per branch above the coverage floor, and which tests pin each candidate simplification? (iteration 1)
- Where does duplicated machinery remain across heal-spec-docs.cjs, upgrade-legacy.mjs and frontmatter-migration.ts (writers, loaders, parsers, walkers, refusal ordering, exports), and did the eight applied P2 simplifications go far enough? (iteration 1)
- What is the ranked list of concrete simplifications, each with its expected line or complexity reduction, its risk, the tests that pin it, and whether a requirement forbids it? (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- Continuity ladder: the parent packet has no handover.md, implementation-summary.md or decision-record.md; spec.md and goal.md describe 16 child phases, each planning one recommendation from `../014-spec-auto-healing-research/research/research.md` section 11. The context-loading ripgrep recipe on the topic returned no hit.
- Phase docs in scope: `003-archive-path-follow-ups/`, `009-doctor-update-compatibility/`, `011-anchor-repair-mode/`, `012-fold-one-off-repairs/`, `013-anchor-contract-alignment/`, `015-lane-rules-as-heal-modes/` (each has spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md).
- Already applied after a fresh Opus high alignment and overengineering review (closeout 3, 2026-10-09; recorded in 011, 013, 015, 009 and 003 implementation-summary.md): section numbering and constants moved into section 2 of heal-spec-docs.cjs; OC-O2/O3 one exported atomic writer (`writeFileAtomic`, one exclusive create, no EEXIST retry; upgrade-legacy `writeDocumentAtomic` deleted); OC-O1 one healer loader `healerFor` replacing `anchorToolsFor` and `laneToolsFor`; F2 a `planLayoutMove` JSDoc; O5 an unreachable `?? order.size` fallback removed (`sortRefusals`); OC-O4 `ANCHOR_NESTING_SEVERITY` removed from orchestrator.ts; O6 two exports made private in frontmatter-migration.ts.
- Rule sources: `.skilled/repo-rules/prevent-overengineering.md`; `AGENTS.md` section 3 Restraint Signals and Quality Principles ("Test what changed, not what exists").

### Bounded Context Snapshot

- Source pointers (line counts at init): `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` (1479), `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` (1622), `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` (1339), `.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts` (1567); `.skilled/commands/doctor/assets/doctor-update-compat-action.yaml`, `.skilled/commands/doctor/update.md`, `.skilled/commands/doctor/assets/doctor-update-presentation.txt`, `.skilled/commands/doctor/scripts/tests/doctor-update-compat*.test.cjs`.
- Tests: `.skilled/skills/system-spec-kit/runtime/cli/tests/` heal-anchor-repair, heal-lane-modes, heal-provenance, upgrade-legacy, anchor-contract, anchor-repair-sample, archive-track, backfill-frontmatter, check-frontmatter-values (`*.vitest.ts`).
- Integration points: upgrade-legacy loads the healer (`healerFor`) and shares its atomic writer; orchestrator `validateAnchorIntegrity` and `anchorNestingFindings`; doctor compat action calls `upgrade-legacy.mjs --layout-map`.
- Constraints: another session is committing in this worktree, so line numbers can move; cite paths as they are now.

resource-map.md not present; skipping coverage gate

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 (stop policy max-iterations)
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes (executor timeout 900 s)
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-10-09T08:44:52Z
