---
title: "Tasks: Rewrite sk-create-changelog template and workflow to the v4 narrative style"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Rewrite sk-create-changelog template and workflow to the v4 narrative style

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verify HVR scanner presence and invocation (`sk-create-with-human-voice/scripts/hvr_scan.py`) -- verified, scanner exercised throughout (flags --all, --json, --rules)
- [x] T002 Read the auto/confirm command YAMLs and catalog stale validation snippets -- 17 contradicting blocks cataloged, reconciled in T009
- [x] T003 [P] Baseline: run validate_document.py and hvr_scan.py on current packet files -- old template: VALID, 0 issues, 0 hard blockers, ceiling 94/100
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Dispatch cli-codex drafting review for the new template shape -- folded per the approved plan into the finished-artifact consistency review (T010), the blueprint was drafted from the direct v4 analysis
- [x] T005 Rewrite `assets/changelog-template.md` to the two-tier v4 shape with omission rules -- 1.1.0.0, 0 hard blockers, ceiling 91/100
- [x] T006 Rewrite SKILL.md format contract and voice/omission/validation sections -- 1.1.0.0, 0 hard blockers, ceiling 84/100
- [x] T007 Rework `references/worked-examples.md` to the v4-style annotated entry -- 1.1.0.0, 0 hard blockers, ceiling 97/100
- [x] T008 [P] Stale-path touch-ups in `references/README.md` and `topology-edge-cases.md` -- 0 hard blockers, ceilings 100/100 and 98/100
- [x] T009 [P] Reconcile command YAMLs with the new template -- both parse as valid YAML, remaining mentions are the new prohibition wording
- [x] T010 Dispatch cli-codex consistency review and apply confirmed findings -- 9 findings returned, 9 confirmed against the files, 9 applied, residual inconsistencies none known
- [x] T015 Post-close quality review: measure the exemplar against the contract's own checks -- the exemplar failed 12 times (11 H4 items over the 3-paragraph cap, longest 7, and one 10-word heading), so the H4 ceilings became 7 paragraphs and 10 words with 1-3 and 2-7 kept as the norm (template, SKILL.md, both YAMLs)
- [x] T016 Align at-a-glance bullets with the exemplar's bold lead-in sentence (template, SKILL.md, auto YAML, worked example) -- the double-dash bullet shape appears nowhere in the exemplar
- [x] T017 Finish the 2-5 to 2-7 heading amendment and the other reconciliation gaps in both YAMLs -- 7 stale 2-5 rules, "one to three domains", "no H1", a tier-blind summary check, an unconditional spec-folder check, a breaking change that never selected expanded, a stale Section 4 pointer
- [x] T018 Strip YAML frontmatter as well as the title H1 from the GitHub release body (template §7, SKILL.md §8, both YAML release steps) -- allowing frontmatter would otherwise publish it into the release notes
- [x] T019 Correct false or stale claims -- the misquoted exemplar sentence, the "exactly as the exemplar writes it" excerpt claim, the three-sentence Upgrade annotated as two, SKILL.md step 5 still checking "files changed", four wrong SKILL.md section pointers in topology-edge-cases.md
- [x] T022 Document the release mechanics the command YAMLs already run -- SKILL.md §7 explains the YAMLs' eight-step numbering and §8 describes `step_7_publish_release`. The `--release` row and the when-not-to-use line match it. topology-edge-cases.md §6 lists the defined tag and commands instead of calling them UNKNOWN. The mechanics themselves are unchanged
- [x] T023 Refresh the packet README.md (operator-directed drift fix) -- the plain-category vocabulary, the validation-only claim and the claim that only sk-git releases replaced, the voice scan added to Quick Start and Verification, 0 hard blockers, VALID
- [x] T024 Add the packet changelog `changelog/v1.1.0.0.md` so SKILL.md 1.1.0.0 has a matching entry -- compact v4 format, structural checks PASSED 0, VALID, 0 hard blockers
- [x] T025 Apply the derived frontmatter versions to six child docs -- README 1.1.0.12, template 1.1.0.28, references/README 1.1.0.9, worked-examples 1.1.0.8, topology-edge-cases 1.1.0.5, version-bump-rules 1.1.0.4, verify ok 7 of 7
- [x] T026 Operator-directed drift fixes outside the packet -- Hermes mirrors regenerated for sk-create-changelog and sk-design, Codex hooks reinstalled, sk-doc compiled-routing activation manifests re-pinned to the current policy hash in both copies
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Positive test: worked example passes structural checks and hvr_scan.py -- RESULT: PASSED, all checks green
- [x] T012 Negative test: old-format sample (Files Changed/Test Impact tables) fails the checks -- 6 violations reported as expected
- [x] T013 validate_document.py passes on all rewritten files, and link targets exist -- VALID, 0 issues on all five, every link target resolves
- [x] T014 Bump packet to 1.1.0.0, write nested changelog entry, fill implementation-summary.md -- nested entry written via the generator (changelog/changelog-057-root.md), summary filled, decision note records the 2-5 to 2-7 heading amendment
- [x] T020 Make the structural checks reproducible (`scratch/check-changelog-structure.py`) and rerun them -- exemplar PASSED 0, both worked examples PASSED 0, the real v3.9.0.0 changelog FAILED 10, the pre-fix compact example FAILED 4
- [x] T021 Repair the packet record and rerun every gate -- metadata re-derived, placeholders filled, status reconciled, nested changelog regenerated, validate.sh --strict RESULT: PASSED
- [x] T027 Rerun every gate after the drift round -- sk-doc serves compiled with two route replays correct, Hermes check leaves only deep-ai-council, Codex hooks --check OK, validate.sh --strict RESULT: PASSED
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed -- machine gates: RESULT: PASSED (spec validate.sh --strict, 0 errors, 0 warnings), positive/negative tests, link integrity, 0 HVR hard blockers. The style-approval read (template beside the exemplar) remains the operator's judgment call
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



