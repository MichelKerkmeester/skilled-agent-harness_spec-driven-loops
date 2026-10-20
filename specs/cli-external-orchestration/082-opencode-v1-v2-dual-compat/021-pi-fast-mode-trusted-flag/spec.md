---
title: "Feature Specification: Phase 21: pi-fast-mode-trusted-flag"
description: "A plain run of `pi --offline --help` in the trusted main checkout did not list `--fast`. The extension's copy claim keyed on a boolean, so the project copy stood down behind the user-scope copy at the same real path and Pi then dropped the user copy. The claim now keys on the claiming copy's real package root, copies at one root both register, the comment above the claim states Pi's real conflict model, and the README test counts come from a real run."
trigger_phrases:
  - "pi fast mode trusted flag"
  - "phase 21 pi fast mode trusted flag"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 21: pi-fast-mode-trusted-flag

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-20 |
| **Branch** | `scaffold/021-pi-fast-mode-trusted-flag` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 21 |
| **Predecessor** | 020-plugins-purity-dual-export |
| **Successor** | None |
| **Handoff Criteria** | `--fast` registers in the trusted main checkout in a plain run, the extension suite passes 81 tests, and the README counts match the run |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the Pi fast mode flag in the trusted main checkout specification.

**Scope Boundary**: The fast-mode extension under `.pi/extensions/pi-fast-mode-w-subagent-support/` — its `src/index.ts`, its `tests/extension.test.ts` and its three READMEs — this folder's records and the parent phase map rows. No Pi source change and no global install.

**Dependencies**:
- The four fix rows in `../014-post-merge-deep-research/research/research.md`: row 1 (P1, the missing flag), row 19 (P2, the README counts), row 21 (P2, the upstream loader issue) and row 22 (P2, the wrong comment).
- Pi 1.3.0's resource loader, `.pi/extensions/pi-fast-mode-w-subagent-support/node_modules` (or the installed `@earendil-works/pi-coding-agent`) for `dist/core/resource-loader.js`, which is read only and never edited.

**Deliverables**:
- A copy claim keyed on the claiming copy's real package root, so copies at one real path both register.
- A test named "lets two copies at one real path both register", the corrected comment above `claimPackage`, and README counts set from a real run.
- This folder's spec, plan, tasks and implementation summary, and the parent phase map rows.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
In a plain run (no `-a`) of `pi --offline --help` in the trusted main checkout, `--fast` was missing. Pi's resource loader (`dist/core/resource-loader.js:560-570`) preloads the user-scope copy of the extension before the trust decision, and that copy claimed the package on the shared event bus. The trusted pass then loaded the project copy at the same real path, it saw the claim and stood down, and Pi — which keys loaded extensions by real path — kept the project copy and dropped the user copy, so the flag the user copy had registered was gone. The comment above `claimPackage` also described a conflict model Pi does not use, and three READMEs stated a test count no run had checked.

### Purpose
`--fast` registers in the trusted main checkout in a plain run, a copy at another real path still stands down so a worktree copy and a global link do not clash, the comment tells the truth about Pi's loader, and the README counts match a real vitest run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The copy claim in `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts`, keyed on the claiming copy's real package root.
- The corrected comment above `claimPackage`, which states Pi's real conflict model.
- The new test "lets two copies at one real path both register" in `tests/extension.test.ts`.
- The test counts in `README.md`, `src/README.md` and `tests/README.md`, set from a real vitest run.
- The local proof under `scratch/`, and this folder's records plus the parent phase map rows.

### Out of Scope
- Pi's loader behaviour — the pre-trust listeners and bus subscriptions that survive the trusted load are upstream (row 21). They are recorded here as an upstream issue in Pi 1.3.0. The fix belongs in Pi and has not shipped; this repo changes nothing for it.
- The "register the flag before the claim gate" approach the research first suggested, because Pi reports a flag registered at two different real paths as a conflict (`resource-loader.js:584-590`, around `975-1007`), and print mode fails on it (`specs/system-deep-loop/040-cli-pi-worktree-extension-clash/spec.md:35`), so a worktree layout would exit 1 again.
- Any global install, `opencode upgrade`, or Pi service command.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts` | Modify | Record the claiming copy's real package root (`realpathSync`, falling back to `path.resolve`) in the claim; a copy stands down only when a copy at a different real root claimed first. Correct the comment above `claimPackage` |
| `.pi/extensions/pi-fast-mode-w-subagent-support/tests/extension.test.ts` | Modify | Add "lets two copies at one real path both register", a symlinked package beside its real checkout |
| `.pi/extensions/pi-fast-mode-w-subagent-support/README.md` | Modify | Test count to 7 files, 81 tests, and the copy-claim paragraph rewritten for the real-root rule |
| `.pi/extensions/pi-fast-mode-w-subagent-support/src/README.md` | Modify | Test count to 7 files, 81 tests |
| `.pi/extensions/pi-fast-mode-w-subagent-support/tests/README.md` | Modify | Test counts to 7 files, 81 tests, and the `extension.test.ts` row now names the copy claim |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/021-pi-fast-mode-trusted-flag/spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This folder's records, filled from the scaffold |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` | Modify | The phase 21 row and the 020-to-021 handoff row in the phase map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The claim records the claiming copy's real package root, so a copy at the same real path registers too. | `claimPackage` takes the root and carries `claimedBy`; a copy stands down only when `claimedBy` is set and differs from its own root. `realpathSync` falls back to `path.resolve` when the path cannot be resolved. A copy at another real path still stands down (row 1). |
| REQ-002 | `--fast` appears in every run of the help probe in both layouts. | `scratch/probe/probe-4layout.txt`: new code gives `--fast=1` in all six runs (primary and worktree layouts × plain, `-a`, `-na`), with `conflict=0` and `exit=0`; old code gave `--fast=0` in the primary plain run (row 1). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A test proves copies at one real path both register, and it fails on the old code. | The test creates a real package directory and a symlink to it, loads both copies on one fake bus and expects `registerFlag` on each. `scratch/mutation/old-code-run.txt`: 1 failed, 12 passed, exit 1. `scratch/mutation/new-code-run.txt`: 13 passed, exit 0 (row 1). |
| REQ-004 | The extension suite passes and the README counts match it. | Full vitest run: 7 files, 81 tests, and `tsc --noEmit` exit 0. The count 81 replaces 80 in four places: `tests/README.md` lines 21 and 53, `README.md` line 124 and `src/README.md` line 78 (row 19). |
| REQ-005 | The comment above `claimPackage` states Pi's real conflict model. | It says Pi keeps every copy keyed by real path, copies at one real path collapse, a flag from two real paths is a conflict that fails a print-mode run, and the pre-trust listeners stay subscribed (row 22). |
| REQ-006 | The upstream loader issue is recorded, with no repo change. | Row 21 says Pi's loader keeps pre-trust listeners and bus subscriptions across the trusted load in Pi 1.3.0, and names the suggested upstream fix: release the pre-trust bus subscriptions on `reload()`. No Pi source file is edited. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every requirement REQ-001 to REQ-006 is checked with recorded evidence in this folder.
- **SC-002**: The help probe lists `--fast` once in all six runs across both layouts, and the extension suite passes 81 tests.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pi 1.3.0's `dist/core/resource-loader.js` line numbers | The claim about preloading and the claim gate could drift from the installed loader | The line numbers are read from the installed Pi of this session and every claim cites them; the loader is never edited |
| Risk | The new rule lets a flag register twice and Pi reports a conflict | Med | Copies at one real root collapse in Pi, so they must both register; the probe shows `conflict=0` in all six runs, and the print-mode probe shows no conflict in either layout (`scratch/probe/probe-4layout.txt`, `scratch/probe/print-after.txt`) |
| Risk | A reader takes the print-mode probe's `exit=1` for a load failure | Low | No `failed-load` and no conflict appears in that run; the exit is only because the temporary agent dir has no models configured (`scratch/probe/print-after.txt`) |
| Risk | The pre-trust listeners cannot be released from this repo | Low | Recorded as row 21 with the upstream fix; no repo change is claimed for it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None left open. Rows 1, 19, 21 and 22 of `../014-post-merge-deep-research/research/research.md` fixed the scope, and the mutation and probe runs in `scratch/` answered how the fix is proven.
<!-- /ANCHOR:questions -->

---
