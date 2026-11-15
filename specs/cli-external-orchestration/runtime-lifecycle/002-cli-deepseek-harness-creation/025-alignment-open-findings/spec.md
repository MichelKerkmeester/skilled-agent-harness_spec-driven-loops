---
title: "Feature Specification: Phase 25: alignment-open-findings"
description: "The alignment run left findings open in files other work owns: two red CI checks, a deep-review FAIL rule that ignores a failed required gate, handover docs that leave out Mistral Vibe, a release coverage miss and advisor routing misses. This phase fixes them."
trigger_phrases:
  - "alignment open findings"
  - "phase 25 alignment open findings"
  - "deep review failed required gate verdict docs"
  - "mistral vibe session handover docs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 25: alignment-open-findings

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/408-alignment-open-findings` |
| **Parent Spec** | ../spec.md |
| **Phase** | 25 of 26 |
| **Predecessor** | 024-dsh-docs-alignment |
| **Successor** | 026-alignment-remaining-findings |
| **Handoff Criteria** | Both CI checks pass, the routing gates pass, the contract drift check prints OK and both spec folders validate strict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 25** of the DeepSeek Harness creation specification. The alignment run `20261115T095438Z` checked this session's range and named findings that phase 024 left alone because other work owns those files.

**Scope Boundary**: docs, two skill intent-signal lists, the compiled skill graph, one reach allowlist entry and one regenerated command contract. No runtime code changes.

**Dependencies**:
- Phase 024, whose release notes and README lines this phase edits again
- The alignment report run `20261115T095438Z`, which named each finding

**Deliverables**:
- Green markdown-link and playbook-package checks
- Deep-review docs that state the failed-required-gate FAIL rule the code applies
- Handover docs that name Mistral Vibe
- Advisor reach for the `executor_missing` and packet-purpose wording
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two CI checks on main fail: five benchmark links point at a spec packet that moved, and a playbook scenario carries a dated run line. The deep-review SKILL.md and three catalog entries say only a P0 makes a FAIL, while `deep-review.yaml` and `fanout-merge.cjs` also fail a run whose required gate still fails at its stop. The README, the hooks READMEs and the handover catalog entry leave out Mistral Vibe, which `relaunch-core.cjs` lists as a handover runtime. The release coverage check misses the retired `deep-ai-council` folder in the notes. The advisor returns nothing for a prompt about an iteration with no executor and nothing for a prompt about keeping the packet purpose across a relaunch.

### Purpose
Fix those findings so the checks pass and each doc matches the code.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs
check-markdown-links: 7604 files, 14910 links checked, 5 broken
$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict
  BAKED_RUN_TRANSCRIPT tooling-and-scripts/setup-native-module-health-and-mcp-installation.md:55 dated run evidence appears in scenario truth
exit=1
$ grep -n "FAIL" .skilled/skills/system-deep-loop/deep-review/SKILL.md | sed -n 2p
185:| **FAIL** | Any P0 finding confirmed after adversarial self-check |
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repoint the five broken benchmark links and drop the dated run line
- State the failed-required-gate FAIL rule in the deep-review SKILL.md and three catalog entries
- Name Mistral Vibe in the README, the hooks READMEs and the handover catalog entry, and fix the hooks test count
- Name the retired `deep-ai-council` folder in the release notes
- Add advisor intent signals for the `executor_missing` and packet-purpose wording
- Record the `mode packet` reach dispute in the allowlist

### Out of Scope
- The routing corpus pin, which the AI Council retirement broke - that recapture belongs to the packet that owns the baseline
- The two advisor probes whose fix moved a scorer ratchet - see Known Limitations in `implementation-summary.md`
- Runtime code changes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-{cursor,opencode,pi}/benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook/source.md` | Modify | Repoint five links |
| `system-spec-kit/manual-testing-playbook/tooling-and-scripts/setup-native-module-health-and-mcp-installation.md` | Modify | Drop the dated run line |
| `system-deep-loop/deep-review/SKILL.md` | Modify | FAIL rule in three places |
| `system-deep-loop/runtime/feature-catalog/feature-catalog.md`, `fanout/fanout-merge.md`, `deep-review/feature-catalog/loop-lifecycle/fanout-dispatch.md` | Modify | FAIL rule |
| `README.md`, `.skilled/hooks/README.md`, `.skilled/hooks/shared/README.md`, `.skilled/hooks/session-handover/README.md` | Modify | Mistral Vibe, test count |
| `system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md` | Modify | Seven runtimes |
| `.skilled/changelog/skilled/v4.0.2.1.md` | Modify | Retired mode folder name |
| `system-deep-loop/graph-metadata.json`, `system-spec-kit/graph-metadata.json` | Modify | Intent signals |
| `system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Recompiled graph |
| `sk-doc/sk-create-skill/scripts/router-reach-allowlist.json` | Modify | `mode packet` entry |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Modify | Regenerated digest |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both red CI checks pass | `check-markdown-links.cjs` prints `0 broken`, and `validate-playbook-package.cjs --strict` exits 0 |
| REQ-002 | No routing gate regresses | The scorer, holdout, divergence and golden-prompt suites pass, and the corpus floors print `"overall_pass": true` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The deep-review docs state the failed-required-gate FAIL rule | `grep -c "required quality gate" .skilled/skills/system-deep-loop/deep-review/SKILL.md` prints 3 |
| REQ-004 | The handover docs name Mistral Vibe | `grep -c "Mistral Vibe hand over on their own" README.md` prints 1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-release-coverage.cjs` on the run's scope prints `STATUS=OK`.
- **SC-002**: The advisor routes the `executor_missing` probe to system-deep-loop and the purpose probe to system-spec-kit.
- **SC-003**: `validate.sh` prints `RESULT: PASSED` for this phase and its parent with `--strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A new intent signal moves an exact-count scorer ratchet | High | Run every routing suite after each signal change and drop a signal that moves one |
| Dependency | The deep-review contract pins SKILL.md by digest | Drift check fails | Regenerate with `compile-command-contracts.cjs --write` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
