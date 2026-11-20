---
title: "Feature Specification: Phase 7: fix the Barter findings from the extended deep review of the overlay layout"
description: "The extended deep review of this packet found six Barter-side problems: a commit gate that skipped every overlay check silently without a manifest, no test for that branch, three hooks that hard-code the overlay folder, plugin tests that stub the bridge, an unignored relayout backup, a leftover fixture name and a rule that quotes the wrong guard path. This phase is the plan of record for those fixes, which ran in ai-speckit."
trigger_phrases:
  - "barter review fixes"
  - "phase 7 barter review fixes"
  - "commit gate fails closed without an overlay manifest"
  - "barter hooks read overlayDir"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: fix the Barter findings from the extended deep review of the overlay layout

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `skilled/v4.1.0.0` in ai-speckit |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 8 |
| **Predecessor** | 006-review-remediation |
| **Successor** | 008-push-and-repin |
| **Handoff Criteria** | ai-speckit commit `5dd004f3faa` carries every fix in this phase, and its record (`039-overlays-framework-root-layout/implementation-summary.md`) shows every Barter gate green after it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the overlay framework/root layout packet. It runs after phase 006, which fixed the review's Skilled findings, and covers the ones phase 006 left to an ai-speckit session.

**Scope Boundary**: ai-speckit only. This phase changes nothing in Skilled except its own docs. The work itself ran in an ai-speckit session, and this folder records the plan and the evidence.

**Dependencies**:
- The review report `../review/review-report.md`, §3 rows `R2-P1-001`, `R2-P2-001--e1e7b8a500f3`, `R14-P2-001`, `R12-P2-001`, `R3-P2-001` and `R3-P2-002`.
- The ai-speckit record `specs/skilled-barter-overlays/002-spec-tracks-restructure/039-overlays-framework-root-layout/` and its commit `5dd004f3faa`.

**Deliverables**:
- One ai-speckit commit fixing all six findings and the guard-path doc drift.
- This phase's record of what changed and how it was checked.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Barter's commit gate exited 0 with no output when it could not find `../overlays/overlay-manifest.json`, so a moved or missing manifest switched every overlay check off silently, and no test covered that branch. The edit guard core, the commit gate and the git-write gate each hard-coded `overlays` beside the tree instead of reading `overlayDir` from `skilled/.skilled-overlays.json`, and the plugin tests loaded only a stub of the OpenCode bridge, so the upstream `dualPlugin` to `definePlugin` rename could not fail them. Three hygiene items stayed open as well: `overlays/relayout-runs/` was not ignored, a temp fixture still named its folder `barter-overlays`, and the overlay-first rule quoted `overlays/...` where the guard prints `../overlays/...`.

### Purpose
A missing manifest is visible, and refuses a commit that stages a vendored path. Every hook finds the overlay folder through the same setting the engine reads, one test fails on a real bridge rename, and no live file names the old folder or a path the guard does not print.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Quoted from the review report, which re-read the code before the fix; not re-run in this session:
```text
review-report.md §2: "A re-read of `pre-commit:83-118` confirms the silent skip:
`HAS_OVERLAYS=0` and exit 0 with no output when `../overlays/overlay-manifest.json`
is absent."
review-report.md §3, R14-P2-001: "The edit guard core, pre-commit (`:85-89`) and
git-write gate (`:182`) each hard-code `overlays` beside the tree and never read
`.skilled-overlays.json`."
review-report.md §3, R3-P2-001: "`/overlays/repin-runs/` is ignored, but
`overlays/relayout-runs/` (the relayout backup) is not."
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make Barter's commit gate refuse, with exit 1, a commit that stages a vendored path when no overlay manifest is found, naming the path it looked for, and print one visible skip line otherwise (`R2-P1-001`).
- Add a hook test for the lookup, the skip and the refusal (`R2-P2-001--e1e7b8a500f3`).
- Make the edit guard core, the commit gate and the git-write gate read `overlayDir` from `skilled/.skilled-overlays.json`, falling back to `../overlays` (`R14-P2-001`).
- Add one plugin test case that loads the real vendored `v2-bridge.js` (`R12-P2-001`).
- Ignore `overlays/relayout-runs/`, rename the last `barter-overlays` fixture folder, and make the overlay-first rule quote `../overlays/...` (`R3-P2-001`, `R3-P2-002`, the guard-path doc drift).

### Out of Scope
- Any Skilled engine change - phase 006 owns the Skilled findings, and this phase writes nothing in Skilled outside this folder.
- Pushing ai-speckit or re-pinning it onto a new Skilled commit - phase 008 owns the push of Skilled and leaves the re-pin to a later ai-speckit session.
- The vendored upstream test `overlay-engine-fixes.test.cjs`, which uses `barter-overlays` on purpose as a custom setting value - it is an upstream engine file.

### Files to Change
All paths are in ai-speckit. Each overlay source and its applied copy under `skilled/` changed together.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `overlays/root/opencode/scripts/git-hooks/pre-commit` | Modify | Fail closed with a staged vendored path and no manifest, a visible skip otherwise, NUL-separated names, `overlayDir` read from the setting |
| `overlays/root/opencode/scripts/git-hooks/tests/pre-commit.test.cjs` | Create | Lookup, skip and refusal cases |
| `overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs` and its test | Modify | Read `overlayDir`; one `"../ovl"` case |
| `overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs` and its test | Modify | Read `overlayDir`; one `"../ovl"` case |
| `overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs` | Modify | One case loads the real vendored bridge |
| `overlays/framework/repo-rules/barter-overlay-first.md` | Modify | Quote `../overlays/...`, the path the guard prints |
| `overlays/tests/compiled-routing-byte-parity.test.cjs` | Modify | Rename the fixture folder to `overlays` |
| `.gitignore`, `overlays/README.md` | Modify | Ignore and name `overlays/relayout-runs/` |
| `overlays/overlay-manifest.json`, `overlays/sync-state.json` | Modify | Adopt the new hook test, refresh the sync hashes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | With no overlay manifest, the commit gate refuses a commit that stages a vendored path and names the manifest path it looked for | A throwaway index staging an unowned vendored file makes the live `pre-commit` exit 1, and `pre-commit.test.cjs` covers the refusal |
| REQ-002 | With no manifest and no vendored path staged, the gate prints `overlay checks skipped: no overlay manifest at <path>` and exits 0 | `pre-commit.test.cjs` covers the visible skip |
| REQ-003 | The three hooks resolve the overlay folder from `skilled/.skilled-overlays.json` and keep their fail-open or fail-closed posture | Each hook's tests pass a `"../ovl"` case |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | One plugin test loads the real vendored bridge | The case fails with `definePlugin` renamed in the live bridge, and passes once the bridge is restored byte for byte |
| REQ-005 | `overlays/relayout-runs/` is ignored and named in `overlays/README.md` | The commit diff shows both lines |
| REQ-006 | No live file names the old folder or a guard path the guard does not print | `compiled-routing-byte-parity.test.cjs` passes 5 of 5 with the fixture renamed, and the rule's examples match `--guard` output from `skilled/` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: In ai-speckit after `5dd004f3faa`, `overlay-engine.cjs status --audit` prints `RESULT: PASSED` with `offLayout` empty, and `pre-commit` prints `allow` with exit 0.
- **SC-002**: Both `overlays/checks` print `RESULT: PASSED`, `bash tests/run-all.sh` exits 0 with 8 `PASS` lines, and the overlay test files fail only the 11 baseline cases.
- **SC-003**: `git -C <ai-speckit> show --stat 5dd004f3faa` lists every file in §3's table.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | ai-speckit commit `5dd004f3faa` is local and on no remote branch | Lost if the ai-speckit checkout is lost before it is pushed | Phase 008's re-pin session pushes ai-speckit with the re-pin, on the operator's go-ahead |
| Risk | A failing closed gate blocks a legitimate commit outside the vendored tree | Med | It fails closed only when a vendored path is staged, and a commit outside the tree gets the visible skip line |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The review report named the fix for each finding, and the ai-speckit session took each one.
<!-- /ANCHOR:questions -->

---
