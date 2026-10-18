---
title: "Feature Specification: Phase 9: sk-code-opencode-alignment"
description: "Align every code file that phases 002 to 008 change with the sk-code OPENCODE surface. Run the drift guards and the comment-hygiene check, and close every P0 and P1 review finding."
trigger_phrases:
  - "sk code opencode alignment"
  - "phase 9 sk code opencode alignment"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: sk-code-opencode-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-18 |
| **Branch** | `scaffold/009-sk-code-opencode-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 11 |
| **Predecessor** | 008-doctor-and-ci |
| **Successor** | 010-documentation-sweep |
| **Handoff Criteria** | The drift guards exit 0, no P0 or P1 finding stays open and every suite that phases 002 to 008 touched passes at or above its phase 001 baseline count. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the OpenCode v1 and v2 dual compatibility build specification.

**Scope Boundary**: The code files that phases 002 to 008 change. This phase reviews them against the sk-code OPENCODE surface, fixes every P0 and P1 finding and runs the gates. It adds no behaviour and leaves docs to phase 10.

**Dependencies**:
- Phases 002 to 008 closed, with their diffs readable from this worktree. The final file list comes from those diffs.
- The phase 001 baseline in `../001-unknowns-and-baseline/baseline.json`, which holds the suite pass counts.
- The sk-code OPENCODE surface in `.skilled/skills/sk-code/sk-code-opencode/`, which sets the standard.

**Deliverables**:
- `findings.md` in this folder, the findings ledger. It has one row per finding with its severity, class and status. The phase creates it at the start.
- Fixed code for every P0 and P1 finding, each fix made in the file that holds the defect.
- A passing run of `run-all-drift-guards.sh` and of the comment-hygiene check on every changed code file.
- Suite results against the phase 001 baseline, recorded in `implementation-summary.md`.

**Executor (D6)**: Luna (GPT-6 Luna max fast, through cli-codex) writes the fixes. DeepSeek (DeepSeek V4.1 Flash max, through cli-devin) reviews findings-first and reviews each fix diff. The orchestrator runs every drift guard, hygiene check and suite itself.

**Frozen decisions that bind this phase**:
- D1: Every plugin default-exports one plain object `{ id, setup, server }`, never a function carrying `.id`.
- D2: `opencode.json` stays in the v1 shape, with the singular `permission` map and `mcp.servers`. It carries no `permissions`, `plugins` or `disabled` key.
- D3: Version comes from parsed `--version` output, never from the binary name. Every v2 child dispatch uses `run --standalone`.
- D4: No phase runs `opencode upgrade --major`, changes an operator install or restarts the v2 background service.
- D5: `@opencode-ai/plugin` is pinned at 1.19.3 exactly, zod is declared and `@opencode/plugin` 2.0.32 is a type-only dev dependency.
- D6: Code goes to Luna through cli-codex. Docs, probes and review go to DeepSeek through cli-devin. Each model reviews the other's output.
- D7: New and changed code follows the sk-code OPENCODE surface.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 002 to 008 add and change plugin, guard, runtime and install code for two OpenCode versions. That code must meet the sk-code OPENCODE surface before the closeout. Without a gate, drift, comment hygiene problems and review findings would reach phase 11 unseen.

### Purpose
Every code file that phases 002 to 008 changed passes the drift guards and the comment-hygiene check, and no P0 or P1 review finding stays open.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A findings-first review of every code file that phases 002 to 008 changed, against the sk-code-opencode language checklists.
- A fix for every P0 and P1 finding, made in the file that holds the defect.
- The drift guard gate, `run-all-drift-guards.sh`.
- The comment-hygiene check on each changed code file.
- Suite runs for every suite that phases 002 to 008 touched, compared with the phase 001 baseline.

### Out of Scope
- Docs and READMEs. Phase 10 owns them under their sk-doc modes.
- New behaviour or new features. This phase aligns code that the build already contains.
- Files that phases 002 to 008 did not change. A finding there is recorded as adjacent and left alone.
- The sk-code surface rules. The standard belongs to sk-code, and a change to it needs its own packet.
- P2 findings. Each one may be deferred with a recorded reason.

### Files to Change

The paths below are known from the phase plans. The final list comes from the 002 to 008 diffs. Read those diffs first, then reconcile this table before the review starts.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/*.js` (the 11 mechanical plugins) | Modify | Dual-export plugins from phase 002. Review and fix only. |
| `.opencode/plugins/*.js` (the 5 hard plugins) | Modify | Ported hard plugins from phase 003. Review and fix only. |
| `.opencode/plugins/lib/` | Create | Local identity helper and shared modules from phase 002. |
| `.opencode/plugins/tests/` | Create or Modify | Plugin tests from phases 002 and 003. |
| `.skilled/skills/sk-vision/vision-runtime/src/` | Modify | sk-vision command ownership from phase 003. |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | Binary admission for `opencode\d*` from phase 005. |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | Version-aware rule checks from phase 005. |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | v2 dispatch branch from phase 006. |
| `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Modify | Contract compiler consumer from phase 004, if phase 004 changed it. |
| Any new check script from phase 004 | Create | Check that `opencode.json` carries no v2-only key. The path comes from phase 004. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` | Modify | Rule `appliesTo` lists from phase 005. Reviewed as config. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Create | Setup helper from phase 007. |
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Create | Doctor battery from phase 008. |
| The CI workflow file from phase 008 | Create | YAML config, reviewed under the config checklist. It stays local and unpushed. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `run-all-drift-guards.sh` exits 0 on the tree that phases 002 to 008 leave behind. |
| REQ-002 | Every code file that phases 002 to 008 changed has a findings-first review against the sk-code OPENCODE surface. |
| REQ-003 | No P0 or P1 finding stays open in `findings.md`. |
| REQ-004 | The comment-hygiene check exits 0 on every changed code file. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Every suite that phases 002 to 008 touched exits 0 at or above its phase 001 baseline pass count. |
| REQ-006 | Each finding carries one finding class: instance-only, class-of-bug, cross-consumer, algorithmic, matrix/evidence or test-isolation. |
| REQ-007 | Each fix on a path, parser, redaction or security surface has an adversarial table test that covers delimiter, joined-input, outside-root, no-op and fallback cases. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `run-all-drift-guards.sh` exits 0, and the comment-hygiene check exits 0 on each changed code file.
- **SC-002**: `findings.md` lists zero P0 or P1 findings with status Open.
- **SC-003**: Every suite that phases 002 to 008 touched reports a pass count at or above its phase 001 baseline count.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 002 to 008 closed, with final diffs | The file list stays incomplete | Read the diffs first and reconcile the Files to Change table |
| Dependency | Phase 001 baseline in `../001-unknowns-and-baseline/baseline.json` | Suite counts cannot be compared | Stop the phase until the baseline file exists |
| Dependency | cli-codex (Luna) and cli-devin (DeepSeek) | A dispatch fails or times out | Retry the same brief once, then record the failure and stop that step |
| Risk | A finding points at a frozen decision from an earlier phase | A fix would change a frozen choice | Record it as a finding and raise an amendment. Do not change a parent decision silently. (High) |
| Risk | A fix changes v1 behaviour | Phase 11 proof fails late | Rerun each touched suite after every fix batch (High) |
| Risk | The drift guards pass while a defect remains | The gate passes and the code still drifts | Review the changed files directly. Do not treat a green guard as proof of a fix (Med) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The drift guard gate runs offline with no model dispatch, so each rerun after a fix batch stays cheap.
- **NFR-P02**: Each dispatch brief covers one batch of related findings, so no brief carries several unrelated moves.

### Security
- **NFR-S01**: Briefs and `findings.md` carry no credential value, such as a provider key or a session token.
- **NFR-S02**: Fixes stay inside the files named in the Files to Change table. A fix that needs another file is raised as an amendment first.

### Reliability
- **NFR-R01**: Two reruns of `run-all-drift-guards.sh` on the same tree give the same exit status.
- **NFR-R02**: A failed suite result is not counted as a flake until its cause is recorded.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: A changed file that the hygiene check skips, which exit status 2 reports, is recorded with its reason. It does not count as clean.
- Maximum length: No limit applies. The batch size sets the work per dispatch.
- Invalid format: A JSON or YAML file that does not parse is a P0 finding until it is fixed.

### Error Scenarios
- External service failure: A cli-codex or cli-devin dispatch fails. Retry the same brief once. If it fails again, record it and stop that step.
- Network timeout: A timed-out dispatch counts as failed. Follow the retry rule and claim no partial fix.
- Concurrent access: Two fix batches never edit the same file. Batches run one after another.

### State Transitions
- Partial completion: Some findings close and others stay open. The phase stays In Progress, and the ledger shows each open row.
- Session expiry: Resume from `findings.md` and the open checkboxes in `tasks.md`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | An estimate of 10 to 20 changed code files across phases 002 to 008. The 002 to 008 diffs set the exact count. |
| Risk | 12/25 | A review can change frozen behaviour. The fail-open guard fix in phase 005 sits inside this scope. |
| Research | 8/20 | The sk-code surface is known. Some findings may need a language reference. |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Resolved: the formal findings-first review runs through `sk-code/sk-code-review`, with the sk-code-opencode surface bundled as the standard. That is how the sk-code hub pairs a workflow mode with a surface, and the sk-code-opencode surface hands formal review to that mode in its section 1.
- Is the phase 008 CI workflow in the review scope? This plan treats it as YAML config under the sk-code config checklist.
<!-- /ANCHOR:questions -->
