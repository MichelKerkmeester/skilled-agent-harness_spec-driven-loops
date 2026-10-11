---
title: "Feature Specification: Phase 7: remediation-review-fixes"
description: "The remediation review confirmed four P2s: a weak sk-git stdin test, one more dead Webflow spec link, a wrong packet credit in the claim-corrections child, and a stale sk-git hooks README."
trigger_phrases:
  - "remediation review fixes"
  - "phase 7 remediation review fixes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: remediation-review-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/007-remediation-review-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-remediation-deep-review |
| **Successor** | None |
| **Handoff Criteria** | The three hooks are covered by the shared stdin suite and fail there on the pre-fix tree, no Webflow reference cites a spec path, the credit names the right packets, and the sk-git hooks README names the shared reader and suite |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Fix the confirmed P2 findings of the post-merge review specification.

**Scope Boundary**: The shared hook stdin suite and its README, the sk-git hooks README and one test file, one Webflow reference, two docs of child 005, and the two unreleased changelogs of this round.

**Dependencies**:
- Findings P2-1 to P2-4 in `../006-remediation-deep-review/review/review-report.md`

**Deliverables**:
- Three rows in `.skilled/hooks/shared/hook-stdin-deadline.test.mjs` and the weaker sk-git test deleted
- No dead spec link in `webflow-constraints.md`
- Correct commit provenance in child 005
- An sk-git hooks README that names the shared reader and suite

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-git open-stdin test passed against the unfixed preflight hook when a kill-switch was set, because the hook exits before reading stdin and the test kept the parent's environment and asserted only an upper bound. `webflow-constraints.md:168` linked a decision record that exists nowhere. Child 005 credited both doc-claims test commits to one packet, though `817ff5b2a7` belongs to `010-round-three-remediation/005-opencode-and-guards`. The sk-git hooks README named neither the shared reader nor any stdin test.

### Purpose
Each of the four confirmed findings is fixed by the smallest change the review named, and the stdin coverage cannot pass on an unfixed hook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the preflight advisory, message gate and Devin vision hooks to the shared stdin suite and delete `stdin-deadline.test.mjs`
- Replace the dead decision-record sentence with plain text
- Name the owning packet of each doc-claims test commit in child 005
- Add the shared reader and suite to the sk-git hooks README
- Update the unreleased sk-git 1.8.1.0 and sk-code-webflow 1.1.3.0 changelogs in place

### Out of Scope
- New version bumps: both changelogs are from this unmerged round, and the master bumps each hub once at merge
- The sk-vision test case added in phase 001, which stays valid because that hook checks its kill-switch only after reading stdin

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/shared/hook-stdin-deadline.test.mjs` | Modify | Three hook rows |
| `.skilled/hooks/shared/README.md` | Modify | Suite count seventeen |
| `.skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs` | Delete | Weaker duplicate harness |
| `.skilled/skills/sk-git/scripts/hooks/README.md` | Modify | Shared reader import and suite command |
| `.skilled/skills/sk-git/changelog/v1.8.1.0.md` | Modify | Names the shared suite |
| `.skilled/skills/sk-code/sk-code-webflow/references/performance/webflow-constraints.md` | Modify | Dead link removed |
| `.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.3.0.md` | Modify | Second dead pointer noted |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/005-claim-corrections/implementation-summary.md` | Modify | Commit provenance |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/005-claim-corrections/spec.md` | Modify | Commit provenance |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/001-hook-stdin-deadlines/goal.md` | Modify | Log row for the moved test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The three hooks are in the shared suite and it catches the unfixed hooks | `node --test .skilled/hooks/shared/hook-stdin-deadline.test.mjs` prints `pass 21`, `fail 0`. On a `git archive 1d078f3356^` tree with `SK_GIT_PREFLIGHT_DISABLED=1 SYSTEM_HOOKS_DISABLED=1`, the three new rows fail with `the hook must exit on its own, not be killed` |
| REQ-002 | No dead spec link in Webflow | `rg 'specs/0[0-9][0-9]-'` over `sk-code-webflow` outside changelogs prints nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Correct provenance | Child 005 names `010-round-three-remediation/005-opencode-and-guards` for `817ff5b2a7`, matching its Spec trailer |
| REQ-004 | README matches the code | The sk-git hooks README names `hook-adapter-shared.cjs` and the shared suite command, and validates with `Total issues: 0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Four of four findings fixed
- **SC-002**: No new version bump
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The shared suite runs seventeen hooks at once | Low | Its 8000 ms upper bound has room. The run took about 3 s per hook |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Each fix is the smallest move the review report names.
<!-- /ANCHOR:questions -->

---
