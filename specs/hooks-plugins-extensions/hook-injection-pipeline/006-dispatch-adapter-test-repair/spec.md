---
title: "Feature Specification: Document the owning runner for the dispatch adapter vitest suites"
description: "Two dispatch adapter suites were recorded as failing, but each failed only because it ran under the wrong runner. The dispatch READMEs now give the command that loads them and say why."
trigger_phrases:
  - "dispatch adapter test repair"
  - "document the owning runner for the dispatch adapter"
  - "codex shell tool test node test"
  - "pi preflight lint test hooks vitest config"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Document the owning runner for the dispatch adapter vitest suites

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Branch** | `worktrees/147-dispatch-adapter-test-repair` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The OpenCode dual-compat build recorded two dispatch adapter suites as failing before it began and still failing after: `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` and `.skilled/hooks/dispatch/codex/codex-shell-tool.test.mjs`. Neither has a defect. The codex file imports vitest and was run under `node --test`, which has no vitest runner. The Pi file was run with vitest but without `.skilled/hooks/vitest.config.ts`. The Pi adapter imports `hook-flags.mjs` by a path written for its `.pi/extensions/` symlink, and only that config's alias resolves the path from the real tree. The dispatch README gave neither command, so nothing told a reader the right runner.

### Purpose
A reader of the dispatch READMEs finds the command that loads every adapter suite and the reason the plain runners fail.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-cause both recorded failures, with the failing and passing runs captured.
- State the right runner in `.skilled/hooks/dispatch/README.md` (directory tree, imports boundary, validation) and `.skilled/hooks/README.md` (validation).

### Out of Scope
- Changing the Pi adapters' link-relative imports. `.pi/extensions/README.md` documents them as the contract Pi loads by, and Pi resolves an extension's imports from the symlink path.
- Changing either test. Both pass under their owning config, and their assertions stay as they are.
- Correcting the dual-compat packet's record of these suites as failing. That packet's files belong to its own worktree, so the correction is reported to its owner.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/dispatch/README.md` | Modify | The test files in the tree, the Pi import exception, and the adapter suite command with why the plain runners fail |
| `.skilled/hooks/README.md` | Modify | The validation command covers all three adapter suites |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each recorded failure has a root cause backed by a reproduced failing run and a reproduced passing run. |
| REQ-002 | Both target suites pass under the documented command, run from the worktree root. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The dispatch README and the hooks README give that command, and every sentence they add is true. |
| REQ-004 | No dispatch, guard or shared hook suite drops below its baseline. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run --config .skilled/hooks/vitest.config.ts` on the three adapter suites reports 3 files and 58 tests passed.
- **SC-002**: A read-only reviewer confirms the root cause and the README text.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The root cause is wrong and a real defect hides behind the runner | High | Luna reproduces both failures and both passes and weighs a code fix |
| Dependency | `.skilled/hooks/vitest.config.ts` keeps its link alias | Med | The README names the config, so a change to it is visible there |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime code changes, so hook latency is unchanged.

### Security
- **NFR-S01**: No guard behavior changes. The preflight and audit adapters are untouched.

### Reliability
- **NFR-R01**: Every documented command exits 0 when run as written.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `directive-dedup.test.ts` and the codex file load under a vitest run without `--config`, and only the Pi preflight file fails there. The README says so, not that all three fail.

### Error Scenarios
- `node --test` on any of the three files fails, because each imports vitest.

### State Transitions
- A worktree without `.opencode/node_modules` cannot run the OpenCode plugin suite. That suite is outside this packet's baseline.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Two README files, about 15 lines |
| Risk | 3/25 | Docs only |
| Research | 10/20 | Two root causes traced through git history and runner behavior |
| **Total** | **17/70** | **Level 2, chosen for the acceptance criteria file; recommend-level.sh scored Level 0** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
