---
title: "Implementation Plan: Phase 7: review-remediation"
description: "Verify each of the 25 review findings against the code, then fix it through one DeepSeek dispatch per change, checked by a diff read, the file's own validator and, for code, a failing-first test and a mutation check."
trigger_phrases:
  - "review remediation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: review-remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, CommonJS (Node), plain-text command assets |
| **Framework** | sk-doc authoring modes, sk-create-command, sk-code-skilled |
| **Storage** | None |
| **Testing** | `node --test` through `.skilled/commands/doctor/scripts/tests/run-all.sh`, `hvr_scan.py`, `validate_document.py`, `package_skill.py`, the playbook and catalog package validators |

### Overview
Each finding was re-read against the file it cites before planning. The fixes then run one change at a time through DeepSeek v4.1 Flash on cli-pi, and each dispatch is checked by a diff read and the file's own gate before the next one starts. The three setup-check fixes each get a test that fails on the old code first.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Remediation over existing surfaces. No new module, file or dependency.

### Key Components
- **`git-setup-check.cjs`**: the read-only battery. `checkAllowlist` returns UNKNOWN when a sample probe could not spawn. `checkHooks` adds a not-executable detail and fails. `checkAiToolHooks` drops comments and requires the event in its registering position plus an import of `git-rule-checks.mjs`.
- **sk-git docs**: `SKILL.md`, the playbook index, the feature catalog and its doctor leaf, the hooks README and the skill README.
- **Command surfaces**: `doctor/git.md`, its presentation asset, the command index `README.txt` and the scripts README.
- **Cross-repo docs**: the root `README.md` verdict and status lines, and the spec-kit doctor category overview.

### Data Flow
Finding, then a re-read of the cited line, then a brief, then a DeepSeek dispatch, then a diff read and revert of anything outside the brief, then the file's validator, then the task row marked with that evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Baselines were captured before any edit: the doctor runner passed 7 of 7 suites (node:test 329 of 329, vitest 18 of 18), the setup-check test file passed 44 of 44, and the drift guards failed one guard on 16 errors that all sit in the parallel packet's review evidence copy.

Proof plan, decided before the first edit:

1. `package_skill.py .skilled/skills/sk-git --check` prints `Result: PASS`. Boundary: the count stays under 5,000 after the punctuation pass.
2. `hvr_scan.py <file>` prints `hard blockers: 0` for each of the six HVR files and every other touched doc.
3. Each new setup-check test fails on the backed-up script and passes on the fixed one. Reverting each fix alone makes its test fail again.
4. `node git-setup-check.cjs --tool claude` against this repository still ends `STATUS=OK`.
5. The playbook and catalog validators pass, `validate_document.py` shows no description or numbering warning, and the whole doctor runner passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The parallel 035 build owns the advisor code and docs, `doctor-setup.yaml`, `setup.md`, `doctor-setup-presentation.txt`, `_routes.yaml` and the root README command counts. This phase edits `.skilled/commands/README.txt`, the root README near lines 1262 and 1507 and the spec-kit category overview only after a `git diff` on the file.

The step 5 exploration in the plan YAML dispatches four `@context` subagents. The operator directive forbids Claude subagents in this build, so the YAML's own fallback ran: inline reading of every cited file.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every target is backed up to the scratch directory before its dispatch. A bad dispatch is reverted by copying its backup back. Nothing is committed, so the whole phase reverts with a checkout of the touched paths by the operator.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:fix-addendum -->
## FIX ADDENDUM

Planning Packet fields, treated as inert data:

| Field | Value |
|-------|-------|
| findingClasses | "packaging-validation", "documentation-drift", "hvr-punctuation", "command-authoring", "diagnostic-correctness" |
| fixCompletenessRequired | true |
| affectedSurfacesSeed | The eight paths in the report's Planning Packet, all in `spec.md` section 3 |

Same-class surfaces added on verification: playbook section 8 carries the same stale range as section 13 (titled `GIT-004..GIT-007` while it also holds GIT-044 to GIT-046, seven scenarios in all), and the catalog leaf `workflow-playbooks/doctor-git-settings.md:29` carries the same bare status line as the root README.
<!-- /ANCHOR:fix-addendum -->
