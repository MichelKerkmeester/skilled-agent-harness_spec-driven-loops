---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
The per-doc version commits 41302e72be..HEAD on branch worktrees/119-docver-per-doc: the frontmatter-version engine scope, verify and bump mode, the packager and post-edit router scope mirrors, the pre-commit doc-version-bump gate and gates.tsv row, the pull-request bump --check job, the versioning standard and templates, the 2,845-line version restore, the 22 docs given frontmatter, the 68 docs started at 1.0.0.0, the sk-code citation re-anchor and the sk-doc 2.3.7.0 release. Target type: files. Scope: 61 files listed in deep-review-config.json reviewScopeFiles; the bulk restore and the 68-doc start are one-line frontmatter edits read through `git show --stat`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Phase 002 (playbook path repair) and the frozen goal decisions D1 to D8.
- Spec-folder citations into restored docs, which are dated records.
- `.skilled/changelog/skilled/v4.0.0.4.md`, which this phase must not edit.

---

## 5. STOP CONDITIONS
- stopPolicy max-iterations: run all 5 iterations; convergence is telemetry only.

---

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
- P1 (Required): 1
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading the new doc-version gate against the spec-remint block it was copied from surfaced the shared trust questions in one pass. (iteration 2)
- Tracing every write and stage site to its source line (engine 292, 437; pre-commit 900) separated local-tamper risks from repository-driven ones. (iteration 2)
- Claim-vs-commit counting settled the traceability question in one pass: commit stats and parent-tree reads bounded every ledger claim, and one live engine run (verify: ok=3027, exit 0) replaced the recorded verification. (iteration 3)
- Six git-state probes in one hermetic scratch pass answered every iteration-5 question: pathspec commit blocked with nothing lost, amend raised against the amended HEAD, the conflict-resolution commit raised 1.2.0.0 to 1.2.2.0, deletion and unborn HEAD skipped by design, and the node-absent skip matches the other re-mint gates. (iteration 5)
- The f60 re-anchor reconciled mechanically against 31888d05bb^: 13 citation lines moved +1, the 4 untouched citation lines cite unshifted targets, and all 17 living citation lines carry pre-removal numbering with 0 window diffs. (iteration 5)

---

## 9. WHAT FAILED
- Static reading alone cannot prove shell-expansion safety end to end; the env-indirection conclusion rests on POSIX expansion rules, not a probe. (iteration 2)
- No executable probe was run this iteration, so R2-P2-001 and R2-P2-002 remain source-derived. (iteration 2)
- The packet's completion evidence could not be weighed: the ledger, acceptance statuses and task checkboxes are still scaffold/pending, so checklist_evidence had to be answered from the artifacts' absence. (iteration 3)
- The first probe batch staged nothing: the machine's global gitignore ignores the .opencode/ tree, so the scratch fixture's git add -A was a no-op and every scenario failed for the wrong reason. A hermetic GIT_CONFIG_GLOBAL=/dev/null rerun fixed it. (iteration 5)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `sk-code-post-edit-quality.test.cjs` drives `resolveDispatch` with path lists and asserts dispatch/no-dispatch per class [SOURCE: .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:185] [SOURCE: .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:206]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `sk-code-post-edit-quality.test.cjs` drives `resolveDispatch` with path lists and asserts dispatch/no-dispatch per class [SOURCE: .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:185] [SOURCE: .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:206].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `sk-code-post-edit-quality.test.cjs` drives `resolveDispatch` with path lists and asserts dispatch/no-dispatch per class [SOURCE: .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:185] [SOURCE: .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:206].

### `test_package_skill_regressions.py` runs the packager over fixture trees and asserts the exact flagged set for in-scope vs out-of-scope classes [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:280] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:285] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:291]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `test_package_skill_regressions.py` runs the packager over fixture trees and asserts the exact flagged set for in-scope vs out-of-scope classes [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:280] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:285] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:291].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `test_package_skill_regressions.py` runs the packager over fixture trees and asserts the exact flagged set for in-scope vs out-of-scope classes [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:280] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:285] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py:291].

### `test_template_version_seed.py` scaffolds a skill and a hub with `init_skill.py` into a temp tree, runs the engine gate over the result, and only then scans each template's first fenced block [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_template_version_seed.py:24]. No test re-asserts a constant or restates implementation structure. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `test_template_version_seed.py` scaffolds a skill and a hub with `init_skill.py` into a temp tree, runs the engine gate over the result, and only then scans each template's first fenced block [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_template_version_seed.py:24]. No test re-asserts a constant or restates implementation structure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `test_template_version_seed.py` scaffolds a skill and a hub with `init_skill.py` into a temp tree, runs the engine gate over the result, and only then scans each template's first fenced block [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_template_version_seed.py:24]. No test re-asserts a constant or restates implementation structure.

### `test-frontmatter-version.mjs` builds fixture skill trees and runs the engine CLI (`compute`, `verify`, `gate`), asserting discovery, derived versions, exit codes and out-of-scope refusal [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:62] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:91] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:123]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `test-frontmatter-version.mjs` builds fixture skill trees and runs the engine CLI (`compute`, `verify`, `gate`), asserting discovery, derived versions, exit codes and out-of-scope refusal [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:62] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:91] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:123].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `test-frontmatter-version.mjs` builds fixture skill trees and runs the engine CLI (`compute`, `verify`, `gate`), asserting discovery, derived versions, exit codes and out-of-scope refusal [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:62] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:91] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:123].

### 22 docs given frontmatter (commit 18d3233a52): 22 files changed, 161 insertions, 22/22 parents frontmatter-less. Match, with the record-drift finding R3-P2-001. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: 22 docs given frontmatter (commit 18d3233a52): 22 files changed, 161 insertions, 22/22 parents frontmatter-less. Match, with the record-drift finding R3-P2-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 22 docs given frontmatter (commit 18d3233a52): 22 files changed, 161 insertions, 22/22 parents frontmatter-less. Match, with the record-drift finding R3-P2-001.

### 68 docs started at 1.0.0.0 (commit 3e848d1303): 68 files changed, 68 insertions, every insertion is +version: 1.0.0.0, no SKILL.md. Match. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: 68 docs started at 1.0.0.0 (commit 3e848d1303): 68 files changed, 68 insertions, every insertion is +version: 1.0.0.0, no SKILL.md. Match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 68 docs started at 1.0.0.0 (commit 3e848d1303): 68 files changed, 68 insertions, every insertion is +version: 1.0.0.0, no SKILL.md. Match.

### agent_cross_runtime: pass - the Hermes mirror .hermes/skills/sk-doc/SKILL.md was regenerated in the same release commit (aa89063bca). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: agent_cross_runtime: pass - the Hermes mirror .hermes/skills/sk-doc/SKILL.md was regenerated in the same release commit (aa89063bca).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: pass - the Hermes mirror .hermes/skills/sk-doc/SKILL.md was regenerated in the same release commit (aa89063bca).

### Carried from iteration 3 (not re-run): `spec_code` partial (REQ-005 FAIL, R3-P1-001); `checklist_evidence` FAIL as recorded (R3-P1-001); `skill_agent` pass; `agent_cross_runtime` pass; `feature_catalog_code` partial; `playbook_capability` partial. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Carried from iteration 3 (not re-run): `spec_code` partial (REQ-005 FAIL, R3-P1-001); `checklist_evidence` FAIL as recorded (R3-P1-001); `skill_agent` pass; `agent_cross_runtime` pass; `feature_catalog_code` partial; `playbook_capability` partial.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Carried from iteration 3 (not re-run): `spec_code` partial (REQ-005 FAIL, R3-P1-001); `checklist_evidence` FAIL as recorded (R3-P1-001); `skill_agent` pass; `agent_cross_runtime` pass; `feature_catalog_code` partial; `playbook_capability` partial.

### Carried from iterations 2-4, not re-run: spec_code partial (REQ-005 FAIL, R3-P1-001); checklist_evidence FAIL as recorded (R3-P1-001); skill_agent pass; agent_cross_runtime pass; feature_catalog_code partial; playbook_capability partial. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Carried from iterations 2-4, not re-run: spec_code partial (REQ-005 FAIL, R3-P1-001); checklist_evidence FAIL as recorded (R3-P1-001); skill_agent pass; agent_cross_runtime pass; feature_catalog_code partial; playbook_capability partial.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Carried from iterations 2-4, not re-run: spec_code partial (REQ-005 FAIL, R3-P1-001); checklist_evidence FAIL as recorded (R3-P1-001); skill_agent pass; agent_cross_runtime pass; feature_catalog_code partial; playbook_capability partial.

### checklist_evidence (core): deferred to the traceability iteration, per the strategy's recorded blocked direction. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: checklist_evidence (core): deferred to the traceability iteration, per the strategy's recorded blocked direction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence (core): deferred to the traceability iteration, per the strategy's recorded blocked direction.

### checklist_evidence: pending - deferred to the traceability iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: checklist_evidence: pending - deferred to the traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: pending - deferred to the traceability iteration.

### Citation re-anchor (f60fa8adac): 7 files, 20 and 20 lines, all inside the sk-code manual-testing-playbook docs the restore shifted. Consistent. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Citation re-anchor (f60fa8adac): 7 files, 20 and 20 lines, all inside the sk-code manual-testing-playbook docs the restore shifted. Consistent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Citation re-anchor (f60fa8adac): 7 files, 20 and 20 lines, all inside the sk-code manual-testing-playbook docs the restore shifted. Consistent.

### citation_reanchor (traceability, this iteration): PASS - 13/13 shifted-target citation lines moved +1; 17/17 living citation lines carry pre-removal numbering; 0/17 window diffs. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: citation_reanchor (traceability, this iteration): PASS - 13/13 shifted-target citation lines moved +1; 17/17 living citation lines carry pre-removal numbering; 0/17 window diffs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: citation_reanchor (traceability, this iteration): PASS - 13/13 shifted-target citation lines moved +1; 17/17 living citation lines carry pre-removal numbering; 0/17 window diffs.

### feature_catalog_code: partial - 611 of 653 feature-catalog docs carry a version; the remainder falls to the exempt classes (verify exit 0 implies out of scope); not traced per file this iteration. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: feature_catalog_code: partial - 611 of 653 feature-catalog docs carry a version; the remainder falls to the exempt classes (verify exit 0 implies out of scope); not traced per file this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: partial - 611 of 653 feature-catalog docs carry a version; the remainder falls to the exempt classes (verify exit 0 implies out of scope); not traced per file this iteration.

### git_state_probes (correctness, this iteration): PASS - 10 probes, 0 wrong raises, 0 crashes, 0 lost raises. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: git_state_probes (correctness, this iteration): PASS - 10 probes, 0 wrong raises, 0 crashes, 0 lost raises.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: git_state_probes (correctness, this iteration): PASS - 10 probes, 0 wrong raises, 0 crashes, 0 lost raises.

### One sk-doc release (D6/REQ-008): only .skilled and .hermes sk-doc SKILL.md changed in the range; changelog v2.3.7.0.md added; SKILL.md 2.3.7.0 equals the newest changelog entry. Match. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: One sk-doc release (D6/REQ-008): only .skilled and .hermes sk-doc SKILL.md changed in the range; changelog v2.3.7.0.md added; SKILL.md 2.3.7.0 equals the newest changelog entry. Match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: One sk-doc release (D6/REQ-008): only .skilled and .hermes sk-doc SKILL.md changed in the range; changelog v2.3.7.0.md added; SKILL.md 2.3.7.0 equals the newest changelog entry. Match.

### playbook_capability: partial - 1,465 of 1,481 manual-testing-playbook docs carry a version; same caveat. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: playbook_capability: partial - 1,465 of 1,481 manual-testing-playbook docs carry a version; same caveat.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: playbook_capability: partial - 1,465 of 1,481 manual-testing-playbook docs carry a version; same caveat.

### Restore 2,845 files, 2,824 unquoted and 21 quoted (spec PV-R1): 31888d05bb touches 2,845 files and removes 2,845 version lines of which 21 are quoted; a8d0dd7c2a is 2,845 files changed, 2,845 insertions; 3 spot-checks return their pre-removal values exactly (0.8.1.0, 1.0.0.5, 1.1.0.12). Match. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Restore 2,845 files, 2,824 unquoted and 21 quoted (spec PV-R1): 31888d05bb touches 2,845 files and removes 2,845 version lines of which 21 are quoted; a8d0dd7c2a is 2,845 files changed, 2,845 insertions; 3 spot-checks return their pre-removal values exactly (0.8.1.0, 1.0.0.5, 1.1.0.12). Match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Restore 2,845 files, 2,824 unquoted and 21 quoted (spec PV-R1): 31888d05bb touches 2,845 files and removes 2,845 version lines of which 21 are quoted; a8d0dd7c2a is 2,845 files changed, 2,845 insertions; 3 spot-checks return their pre-removal values exactly (0.8.1.0, 1.0.0.5, 1.1.0.12). Match.

### SC-002: every file 31888d05bb touched still exists and carries a 4-part version - 2,845 checked, 0 gone, 0 missing. Match. Live verify run: 5624 files, ok=3027, skip-no-frontmatter=2597, exit 0. Match. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: SC-002: every file 31888d05bb touched still exists and carries a 4-part version - 2,845 checked, 0 gone, 0 missing. Match. Live verify run: 5624 files, ok=3027, skip-no-frontmatter=2597, exit 0. Match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SC-002: every file 31888d05bb touched still exists and carries a 4-part version - 2,845 checked, 0 gone, 0 missing. Match. Live verify run: 5624 files, ok=3027, skip-no-frontmatter=2597, exit 0. Match.

### scope_mirror_parity (maintainability): FAIL - root-level changelog (packager in; engine + router out) and `SKILL.md` under `tests`/`fixtures` (engine + router in; packager out). Recorded as R4-P2-001. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: scope_mirror_parity (maintainability): FAIL - root-level changelog (packager in; engine + router out) and `SKILL.md` under `tests`/`fixtures` (engine + router in; packager out). Recorded as R4-P2-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: scope_mirror_parity (maintainability): FAIL - root-level changelog (packager in; engine + router out) and `SKILL.md` under `tests`/`fixtures` (engine + router in; packager out). Recorded as R4-P2-001.

### Seeding observation (ruled out, kept visible): `INITIAL_SKILL_VERSION` at `init_skill.py:66` is bypassed by inline `'version: 1.0.0.0'` literals at 492, 588, 613, 733, 781. The scaffold-and-gate test fails loudly if a covered file drifts, so this stays an observation rather than a finding; residual risk is limited to paths the engine skips. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Seeding observation (ruled out, kept visible): `INITIAL_SKILL_VERSION` at `init_skill.py:66` is bypassed by inline `'version: 1.0.0.0'` literals at 492, 588, 613, 733, 781. The scaffold-and-gate test fails loudly if a covered file drifts, so this stays an observation rather than a finding; residual risk is limited to paths the engine skips.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Seeding observation (ruled out, kept visible): `INITIAL_SKILL_VERSION` at `init_skill.py:66` is bypassed by inline `'version: 1.0.0.0'` literals at 492, 588, 613, 733, 781. The scaffold-and-gate test fails loudly if a covered file drifts, so this stays an observation rather than a finding; residual risk is limited to paths the engine skips.

### skill_agent: pass - sk-doc SKILL.md 2.3.6.0 to 2.3.7.0 equals the new changelog entry; the standard lives inside the updated skill. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: skill_agent: pass - sk-doc SKILL.md 2.3.6.0 to 2.3.7.0 equals the new changelog entry; the standard lives inside the updated skill.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent: pass - sk-doc SKILL.md 2.3.6.0 to 2.3.7.0 equals the new changelog entry; the standard lives inside the updated skill.

### spec_code (core): partial - the security surfaces the findings concern are the enforcement wiring the standard names (hook gate block pre-commit:841-916, gates.tsv row 15, PR job workflow:48-78); requirement-level mapping stays deferred to the traceability iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: spec_code (core): partial - the security surfaces the findings concern are the enforcement wiring the standard names (hook gate block pre-commit:841-916, gates.tsv row 15, PR job workflow:48-78); requirement-level mapping stays deferred to the traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code (core): partial - the security surfaces the findings concern are the enforcement wiring the standard names (hook gate block pre-commit:841-916, gates.tsv row 15, PR job workflow:48-78); requirement-level mapping stays deferred to the traceability iteration.

### spec_code: partial (correctness rules only). The standard's section 4 table matches observed behavior for every row: new doc without a version seeds 1.0.0.0; body change raises third segment and resets fourth (1.2.0.0 to 1.2.1.0, 1.0.0.0 to 1.0.1.0); a hand raise is left alone; frontmatter-only edits raise nothing; clean renames raise nothing; malformed values are never guessed at. Section 7 enforcement wiring verified: hook gate, gates.tsv row 15, PR job (workflow lines 65-78). The three findings are deviations from the table's intent at its edges. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: spec_code: partial (correctness rules only). The standard's section 4 table matches observed behavior for every row: new doc without a version seeds 1.0.0.0; body change raises third segment and resets fourth (1.2.0.0 to 1.2.1.0, 1.0.0.0 to 1.0.1.0); a hand raise is left alone; frontmatter-only edits raise nothing; clean renames raise nothing; malformed values are never guessed at. Section 7 enforcement wiring verified: hook gate, gates.tsv row 15, PR job (workflow lines 65-78). The three findings are deviations from the table's intent at its edges.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: partial (correctness rules only). The standard's section 4 table matches observed behavior for every row: new doc without a version seeds 1.0.0.0; body change raises third segment and resets fourth (1.2.0.0 to 1.2.1.0, 1.0.0.0 to 1.0.1.0); a hand raise is left alone; frontmatter-only edits raise nothing; clean renames raise nothing; malformed values are never guessed at. Section 7 enforcement wiring verified: hook gate, gates.tsv row 15, PR job (workflow lines 65-78). The three findings are deviations from the table's intent at its edges.

### Templates seed 1.0.0.0 (REQ-007): 812197ab82 changes the README, code-README and architecture templates plus init_skill.py, which seeds version: 1.0.0.0 into generated doc frontmatter (line 212); 0 sk-doc asset templates lack a version line. The changelog's "playbook index generator" phrase maps to that generator in init_skill.py. Match. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Templates seed 1.0.0.0 (REQ-007): 812197ab82 changes the README, code-README and architecture templates plus init_skill.py, which seeds version: 1.0.0.0 into generated doc frontmatter (line 212); 0 sk-doc asset templates lack a version line. The changelog's "playbook index generator" phrase maps to that generator in init_skill.py. Match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Templates seed 1.0.0.0 (REQ-007): 812197ab82 changes the README, code-README and architecture templates plus init_skill.py, which seeds version: 1.0.0.0 into generated doc frontmatter (line 212); 0 sk-doc asset templates lack a version line. The changelog's "playbook index generator" phrase maps to that generator in init_skill.py. Match.

### tests_not_mirrors: PASS - every suite exercises behavior, not the implementation's shape: -- BLOCKED (iteration 4, 1 attempts)
- What was tried: tests_not_mirrors: PASS - every suite exercises behavior, not the implementation's shape:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: tests_not_mirrors: PASS - every suite exercises behavior, not the implementation's shape:

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Workflow branch-name/PR-title shell injection: base_ref arrives via env: BASE_REF and is referenced as "$BASE_REF" inside double quotes, so the value is never parsed as shell source; the job is pull_request-only with a read-only token. (iteration 2, evidence: .github/workflows/skill-doc-frontmatter.yml:76-78)
- Bypass variable set by commit content: the flag is read from the live environment (pre-commit:841); persisted sources are local/global git config (never cloned) and hook-flags.env, which is gitignored (.gitignore:348), absent, and untracked. (iteration 2, evidence: .skilled/scripts/git-hooks/pre-commit:841; .skilled/scripts/git-hooks/lib/gates.tsv:1-6; .gitignore:348)
- Partial-staging data loss on re-stage: the engine returns 3 before writing when a raise target has unstaged edits (engine 428-435) and the hook blocks on rc 3 (pre-commit:880-887); raised files equalled the staged text before the rewrite, so the follow-up git add (pre-commit:900) stages only the version-line rewrite. (iteration 2, evidence: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:428-435; .skilled/scripts/git-hooks/pre-commit:900)
- Spaces and leading dashes in staged paths: changedDocs parses NUL-delimited diff output (engine 346), inScope rejects .. and absolute segments (engine 174), and the hook stages via quoted git add -- (pre-commit:900). (iteration 2, evidence: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:346; .skilled/scripts/git-hooks/pre-commit:900)
- Ledger claim vs commit counts: restore 2,845 (21 quoted), seeds 68, frontmatter additions 22, one sk-doc release - all matched exactly; 0 of the 2,845 restore files lack a version today. (iteration 3, evidence: git show --format= 31888d05bb; a8d0dd7c2a; 3e848d1303; 18d3233a52)
- Standard vs engine scope: the standard's out-of-scope table matches EXCLUDED_DIRS, SCOPE_SUBTREES, TEST_DIRS, CORPUS_DIRS and SPEC_EXAMPLES_DIR class for class. (iteration 3, evidence: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:53-62)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Reverses the child-doc version scope of 021/003. resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-12T07:01:58.951Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: [from config.reviewTargetType]
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: [timestamp]
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
