# Deep Review Strategy - spec-143 Guarded Refine Loop Delta

## 2. TOPIC

Review: spec-143 guarded-refine-loop delta (Lane D non-dev-ai-system + anti-Goodhart guards + packaging loop hosts)

Target type: files (38 files across the Public skill repo and the Barter packagings).
Executor: cli-opencode, model xiaomi/mimo-v2.5-pro, variant high. Max iterations 10, convergence threshold 0.05.

## 3. REVIEW DIMENSIONS (remaining)

- [ ] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization, prompt injection in dispatch surfaces
- [ ] D3 Traceability, Spec/code alignment, docs-vs-code drift, cross-reference integrity (operator guide vs loop contract vs templates vs instances)
- [ ] D4 Maintainability, Patterns, clarity, template/instance divergence cost, safe follow-on change cost

## 4. NON-GOALS

- Re-reviewing immutable spec-packet history or run logs.
- Modifying the review target (READ-ONLY contract).
- Re-litigating accepted-by-design findings from the prior informal review unless new evidence appears.

## 5. STOP CONDITIONS

- Hard stop at 10 iterations.
- All four dimensions covered, zero active P0/P1, quality gates pass, coverage age >= 1.
- Composite convergence per the auto YAML (rolling avg <= 0.08, MAD noise floor, coverage weight 0.45, weighted stop >= 0.60), graph convergence allowing STOP.

## 6. COMPLETED DIMENSIONS

- D1 Correctness — iter 1-2
- D2 Security — iter 5-6
- D3 Traceability — iter 3 + iter 7 (overlay protocols)

## 7. RUNNING FINDINGS

- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 26 active (24 prior + 2 new from iter 7)
- **Delta this iteration:** +0 P0, +0 P1, +2 P2 (R7-P2-001 gauntlet attack count overclaim, R7-P2-002 promote_skip missing from contract)

## 8. WHAT WORKED

(populated per iteration)

## 9. KNOWN CONTEXT

Prior informal review (NOT the canonical workflow, superseded by this session): 11 MiMo dispatches over rotating lenses found 28 findings (8 P0), 24 fixed across three remediation batches, 3 accepted-by-design, 1 false positive. Summary: ../deep-review/SUMMARY.md. Highlights already FIXED: vanished-anchor frozen-surface bypass, deals D/E/A/L dim keys, case-insensitive family kill-switch, fixture-lint prefix collision, lock O_EXCL race, n=0 fabrication. Accepted-by-design: residual stale-evict TOCTOU window (fail-safe), documented unknown-mode fallback, no process-race gauntlet test. Since that review the surface CHANGED: lane renamed non-dev-ai-system, asset/reference subfolders snake_cased, NEW onboarding kit (packaging_config schema + 9 templates + init_packaging.py scaffolder) and four new lane references - these are UNREVIEWED.

## 10. REVIEW SCOPE FILES

- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/model-family.cjs
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/rubric-guard.cjs
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/extract-deliverable.cjs
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/fixture-lint.cjs
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/shared/promote-candidate.cjs
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/non-dev-ai-system/run-non-dev-ai-system.cjs
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/non-dev-ai-system/init_packaging.py
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/packaging_config.schema.json
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/packaging_config.example.json
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/references/shared/heldout_and_gold_sets.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/start-non-dev-ai-system-loop.md
- /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/_loop/loop.py
- /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/_loop/gauntlet.py
- /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/_gates/gates.py
- /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/_gates/derive.py
- /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/benchmark/grader/regrade.py
- /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/benchmark/grader/calibrate.py
- /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/benchmark/grader/hvr_lint.py
- /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Copywriter/benchmark/run.sh
- /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Barter deals/_loop/loop.py
- /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Barter deals/_gates/gates.py
- /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/Barter deals/benchmark/grader/regrade.py
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/calibrate.py.template
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/derive.py.template
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/deterministic_lint.py.template
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/gates.py.template
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/gauntlet.py.template
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/grader_prompt.md.template
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/loop.py.template
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/regrade.py.template
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/non_dev_ai_system/templates/run.sh.template
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/references/non_dev_ai_system/fixture_authoring.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/references/non_dev_ai_system/grader_calibration.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/references/non_dev_ai_system/guardrails_teachings.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/references/non_dev_ai_system/loop_contract.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/references/non_dev_ai_system/operator_guide.md

## 11. NEXT FOCUS

Iteration 1 (inventory pass): build the artifact map across both repos, identify file types and complexity, verify scope completeness, surface any obviously broken cross-references. Then risk-ordered deep passes: correctness, security, traceability, maintainability.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 29
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **checklist_evidence**: PASS — security directions explicitly ruled out with evidence refs -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **checklist_evidence**: PASS — security directions explicitly ruled out with evidence refs
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence**: PASS — security directions explicitly ruled out with evidence refs

### **Init validation vs schema required**: `validate_config()` required list matches schema `required[]` exactly (14 fields). No gap on required fields. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Init validation vs schema required**: `validate_config()` required list matches schema `required[]` exactly (14 fields). No gap on required fields.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Init validation vs schema required**: `validate_config()` required list matches schema `required[]` exactly (14 fields). No gap on required fields.

### **Init validation vs template consumption**: All scaffolded placeholders derive from validated-or-defaulted config paths. No template will render broken Python/bash from valid config. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Init validation vs template consumption**: All scaffolded placeholders derive from validated-or-defaulted config paths. No template will render broken Python/bash from valid config.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Init validation vs template consumption**: All scaffolded placeholders derive from validated-or-defaulted config paths. No template will render broken Python/bash from valid config.

### **spec_code**: PASS — all dispatch surfaces trace to spec 143 teachings T1/T3/T5/T11 -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **spec_code**: PASS — all dispatch surfaces trace to spec 143 teachings T1/T3/T5/T11
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code**: PASS — all dispatch surfaces trace to spec 143 teachings T1/T3/T5/T11

### **Template placeholder audit**: 9 templates consume 28 unique `{{KEY}}` tokens. All 28 are produced by `build_placeholders()`. Schema-required fields map 1:1 to consumed tokens. Three schema fields (ci_compact_path, ci_full_path, skill_dir_name) are NOT consumed — dead config. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Template placeholder audit**: 9 templates consume 28 unique `{{KEY}}` tokens. All 28 are produced by `build_placeholders()`. Schema-required fields map 1:1 to consumed tokens. Three schema fields (ci_compact_path, ci_full_path, skill_dir_name) are NOT consumed — dead config.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Template placeholder audit**: 9 templates consume 28 unique `{{KEY}}` tokens. All 28 are produced by `build_placeholders()`. Schema-required fields map 1:1 to consumed tokens. Three schema fields (ci_compact_path, ci_full_path, skill_dir_name) are NOT consumed — dead config.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
