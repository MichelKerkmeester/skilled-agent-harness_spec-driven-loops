ROLE: Remove the improvement and benchmark mode families that the deep-loop runtime and its behavior benchmark still carry. Work only in this git worktree. Do not commit.

FACT: the agent-improvement and model-benchmark modes are gone; system-deep-loop now has research, review and ai-council only. These still model the retired families:
- runtime/lib/path-coverage-termination/types.ts (union members 'improvement', 'benchmark') and profiles.ts (profile('improvement'...) and profile('benchmark'...)), test runtime/tests/unit/path-coverage-termination.vitest.ts (~378-381)
- runtime/lib/stopping-clocks/stopping-clock-types.ts (~68-69) and stopping-clock-profiles.ts (~51-52)
- runtime/lib/deep-loop/continuity-identity/continuity-identity-types.ts (IMPROVEMENT, BENCHMARK)
- shared/behavior-benchmark/behavior-bench-run.cjs: the candidate_evidence evidence kind (improvement's candidate + evaluator score, ~325-340, 433, 495-497, 607) and its tests in shared/behavior-benchmark/tests/behavior-bench-run.test.cjs; shared/behavior-benchmark/framework.md (mode enum line ~72, the ai-council/improvement cap ~213, the candidate_evidence row ~253)
- sk-doc/sk-create-benchmark: assets/behavior-benchmark/behavior-benchmark-scenario-template.md (CANDIDATE_EVIDENCE placeholders ~85, 121, 175), and any candidate_evidence or improvement-mode mention in its SKILL.md, references/behavior-benchmark/behavior-benchmark-guide.md and manual-testing-playbook/benchmark-families/author-behavior-package.md
All paths above under .skilled/skills/system-deep-loop/ unless they start with sk-doc/.

TASK: delete those members, profiles, the evidence kind and their tests and doc rows, so nothing models a mode that no longer exists. Typecheck tells you every importer; fix each. Keep deep-review's own CANDIDATE_EVIDENCE artifact kind in runtime/lib/deep-review-sealed-artifacts (it is a review concept, not the retired mode). Keep runtime/tests/unit/legacy-projections.test.ts as it is (it names retired surfaces on purpose).

ALLOWED WRITES: .skilled/skills/system-deep-loop/runtime/lib, runtime/tests, system-deep-loop/shared/behavior-benchmark, .skilled/skills/sk-doc/sk-create-benchmark. Nothing else.

BASELINE FIRST, then after the edit rerun and report both:
A. cd .skilled/skills/system-deep-loop/runtime && npx tsc --noEmit -p .   (or its typecheck script; baseline 0)
B. cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage   (baseline 2710 passed, 0 failed; takes ~25 minutes, run it once at the end)
C. node --test .skilled/skills/system-deep-loop/shared/behavior-benchmark/tests/   (baseline pass)
D. rg -n "'improvement'|'benchmark'|candidate_evidence|CANDIDATE_EVIDENCE" .skilled/skills/system-deep-loop/runtime/lib .skilled/skills/system-deep-loop/shared .skilled/skills/sk-doc/sk-create-benchmark   (only deep-review sealed-artifact hits may remain)

DONE WHEN: A and C pass, B has 0 failed, D shows only the kept deep-review hits.

HANDBACK: files changed, what was removed per file, before/after for A-D with exit codes and the B test count.
