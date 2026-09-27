---
title: "Feature Specification: Fixing the Phase 10 Observations"
description: "Phase 10's close-out named seven small problems outside its scope. This phase fixes the five that are real in this repository, records one that was never a defect and dismisses the six Dependabot alerts on the operator's yes."
trigger_phrases:
  - "phase 10 observations"
  - "appended phase numbering"
  - "drift guard count"
  - "placeholder phase description"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fixing the Phase 10 Observations

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-review-advisories-and-codex-cleanup |
| **Successor** | None |
| **Handoff Criteria** | Each observation below is fixed, recorded with evidence as no defect or decided by the operator, and the `create.sh` numbering test fails against `eaa02a56f5` and passes after the fix |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Pi skill orchestrator research for skill advisor refinement specification. It takes up the seven small problems that phase 10's close-out named as outside its scope, so none of them stays open.

**Scope Boundary**: The seven observations O1 to O7 below. A defect found while fixing them is added here before any work on it starts.

**Dependencies**:
- 010-review-advisories-and-codex-cleanup, soft. Its close-out named the seven observations.

**Deliverables**:
- Doc, comment and script fixes for O1 to O4, a local permission fix for O7 and the operator's decision on O5
- A `create.sh` test that shows an appended phase is named by its number

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 10's close-out listed seven small problems it had seen outside its own scope. Two are wrong text. The sk-code-opencode docs describe three drift guards where the wrapper runs two, and five phase descriptions in this packet read `Phase 1:` whatever their number. The rest are loose ends: an unused import, three doc paragraphs and two comments that break the voice rules, 46 metrics logs still at mode 0644 and six Dependabot alerts on vendored snapshots.

### Purpose
Every observation is fixed, shown not to be a defect or decided by the operator, so nothing from phase 10's list stays open.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **O1, drift-guard count.** The sk-code-opencode wrapper runs two guards and prints `all 2 guards PASSED`. Its own header, `SKILL.md` lines 173 and 185, both READMEs, the verification playbook scenario and the alignment reference still describe three, or name the deleted router-sync suite as live. The Hermes mirror of `SKILL.md` repeats the two `SKILL.md` lines.
- **O2, unused import.** `hooks/lib/skill-advisor-cli-fallback.ts:13` imports `AdvisorHookStatus` and never uses it.
- **O3, punctuation.** `runtime/lib/metrics.ts:238` and the fallback's comment at line 246 each hold an em dash. `feature-catalog/cli-surface/advisor-recommend.md:33` holds an em dash, a semicolon and a serial comma. The plugin bridge catalog line holds two semicolons, and `hooks/skill-advisor-hook.md:123` holds two semicolons and a serial comma.
- **O4, placeholder descriptions.** Phases 005 and 007 to 010 carry the scaffold description `Phase 1: <slug>`. `create.sh` builds that text from the child's position in one invocation, so every phase appended to an existing parent is named Phase 1. This phase came out as `Phase 1: observation-fixes`, which reproduced it. Thirteen more folders in other packets carry the same label, and the operator approved regenerating them on 2026-09-27. Three of the thirteen have a `spec.md` that was never written, so they get the numbered label the fixed `create.sh` would write instead of generated text. A final-state check then found five more labels from the same bug, each a number other than 1. Four are quarantine folders beside two of the thirteen, labeled `Phase 2:` or `Phase 3:` where their own `spec.md` says 22, 23, 25 and 26. The fifth is `071-cli-hermes-creation/016-dispatch-enforcement-ci-guard`, labeled `Phase 4:` where its `spec.md` says 16. They came after the operator's answer and are fixed the same way under this phase's scope rule.
- **O5, Dependabot alerts.** Six alerts are open on main. Five sit in `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/supercov-main/package-lock.json` and one in `specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/mobile/Gemfile.lock`. Both are vendored snapshots, and `.github/dependabot.yml` declares such snapshots out of scope because nothing installs or runs them.
- **O6, `maxMetadataFiles`.** `runtime/schemas/advisor-tool-schemas.ts:293` bounds it with a literal `10_000`. It is not the prompt limit. It caps how many metadata files one status call may scan, and `handlers/advisor-status.ts:34` sets its default to 5,000.
- **O7, metrics log modes.** 46 of the 53 logs in the advisor metrics directory kept mode 0644 from before phase 10. The directory is 0700, so no other user could open them.

### Out of Scope
- The 39 descriptions across other packets that hold the template sentence `[What is broken, missing, or inefficient? ...]`. Each already held it at `eaa02a56f5`, none carries a phase number and this phase touched none of them.
- The three older em dashes elsewhere in `metrics.ts` comments. sk-code carries no punctuation rule for code comments, and phase 10 flagged only line 238.
- The `sk-create-changelog` Hermes mirror drift, which belongs to the session editing that skill.
- Seven containment copies under deep-loop `review/` and `research/` lineage folders that still hold an old `Phase 1:` label. Each is a frozen record of a file at capture time, so changing one would falsify it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | Modify | The header comment names the two live guards |
| `.skilled/skills/sk-code/sk-code-opencode/SKILL.md` | Modify | Lines 173 and 185 describe two guards |
| `.hermes/skills/sk-code-opencode/SKILL.md` | Modify | The regenerated mirror of the edited `SKILL.md` |
| `.skilled/skills/sk-code/sk-code-opencode/README.md` and `scripts/README.md` | Modify | The clean exit and the expected output name two guards |
| `.skilled/skills/sk-code/sk-code-opencode/manual-testing-playbook/authoring-verification/verification-alignment.md` | Modify | Names the two guards |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md` | Modify | Records the deleted suite and what tests the bijection module now |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Modify | Drops the unused import and the comment's em dash |
| `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts` | Modify | The comment loses its em dash |
| `advisor-recommend.md`, `opencode-plugin-bridge.md` and `hooks/skill-advisor-hook.md` under `.skilled/skills/system-skill-advisor/` | Modify | The paragraphs lose their em dash, semicolons and serial commas |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Names an appended child by its phase number |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts` | Modify | A test for the appended phase's number |
| `description.json` in phases 005, 007, 008, 009, 010 and 011 | Modify | Regenerated from each `spec.md` |
| `description.json` in the 18 other folders listed in `implementation-summary.md` | Modify | Regenerated from each `spec.md`, or numbered where the `spec.md` was never written |
| `../spec.md` | Modify | The phase 11 row and its handoff |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `create.sh` names an appended phase by its phase number | The new test in `create-root-numbering.vitest.ts` fails against the committed `create.sh` with `Phase 1: third-step` and passes after the fix. The nine create test files pass |
| REQ-002 | No phase description in the repository carries a wrong phase number | Outside the frozen containment copies, no `description.json` under `specs/` names a phase number other than its folder's own. Each regenerated folder keeps its `specFolder`, `parentChain` and `specId` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The sk-code-opencode docs describe the two live guards | A tracked-file grep for three-guard claims returns only retirement notes, the wrapper exits 0 with `all 2 guards PASSED` and the Hermes `--check` no longer lists `sk-code-opencode` |
| REQ-004 | The advisor fallback drops its unused import, and the two flagged comments lose their em dash | The advisor typecheck exits 0 and the advisor suite matches its `eaa02a56f5` counts |
| REQ-005 | The three flagged doc paragraphs follow the voice rules | Each paragraph holds no em dash, semicolon or serial comma, and the sk-doc validator reports 0 issues for each file |
| REQ-006 | Every advisor metrics log is private | All 53 logs report mode 600, and the old modes are kept for rollback |
| REQ-007 | The six Dependabot alerts get the operator's decision | The operator said yes on 2026-09-27. Each alert is dismissed as `not_used` with a comment on its vendored snapshot, and the open count reads 0 |
| REQ-008 | O6 is recorded with its evidence | The schema line and the handler default are cited, and no code changes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `create.sh` numbering test fails before the fix and passes after it.
- **SC-002**: No three-guard claim, placeholder description or flagged punctuation remains, and every gate matches or beats its baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `create.sh` scaffolds every session's phases | Med | The change touches only the naming text, and the nine create test files pass |
| Risk | Rebuilding the whole Hermes mirror would also write the other session's pending `sk-create-changelog` change | Med | Generate into a scratch folder and copy back only the sk-code-opencode file |
| Risk | The advisor TypeScript edits leave the dist older than its source, and the CLI then refuses to run, which turns every session's brief into an outage line | High | Rebuild right after the edit and probe `advisor_status` |
| Risk | Another session is editing the system-spec-kit retrieval files that the trigger index build reads | Med | Stage only this phase's paths and build the index from a clean export of the pushed commit |
| Dependency | The operator's yes for the Dependabot dismissals | O5 waits | Every other fix lands first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator answered both in one prompt on 2026-09-27: dismiss the six Dependabot alerts, and regenerate the thirteen placeholder descriptions in other packets.
<!-- /ANCHOR:questions -->

---
