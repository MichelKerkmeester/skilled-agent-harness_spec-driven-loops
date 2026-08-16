---
title: "Feature Specification: Phase 3: integration-and-tests [template:level-2/spec.md]"
description: "Full test suite for the fork, local install replacing pi-gpt-fast-mode, in-session verification of /fast, widget indicator, and subagent handoff, plus PLUGINS.md and sync/commit updates."
trigger_phrases:
  - "integration-and-tests"
  - "fast mode install"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests"
    last_updated_at: "2026-08-16T09:20:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Authored phase docs from scaffold"
    next_safe_action: "Execute phase plan: extend suite, install fork, remove pi-gpt-fast-mode, verify in-session"
    blockers: []
    key_files:
      - "context/pi-fast-mode/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Install source: local directory vs git source vs npm registry"
      - "Keep pi-gpt-fast-mode in PLUGINS.md as a documented predecessor or remove entirely"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: integration-and-tests

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-subagent-handoff |
| **Successor** | None |
| **Handoff Criteria** | Fork installed in `.pi/settings.json`, pi-gpt-fast-mode removed, `/fast` + widget indicator + subagent handoff verified in-session, PLUGINS.md + sync + commit complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the pi-fast-mode-w-subagent-support specification.

**Scope Boundary**: Test-suite completion, environment install, and in-session verification. Install the fork into `.pi/settings.json` (project scope via the Public repo canonical), remove `pi-gpt-fast-mode` (same `/fast` command and `--fast` flag — collision), verify the widget indicator and subagent handoff in a live session, and update `PLUGINS.md` + sync + commit per the pi sync manifest.

**Dependencies**:
- Phase 2 fork (with handoff)
- `context/pi-fast-mode/` (TheBinaryGuy, commit `e2827b6`) — reference for the footer-composition UX pattern; evaluated, not adopted (documented rejection)
- `.pi/settings.json` + `PLUGINS.md` in `Code_Environment/Public` (canonical, symlinked)

**Deliverables**:
- Extended vitest suite (upstream + handoff + integration tests) green
- Fork installed; `pi-gpt-fast-mode` removed from settings
- In-session evidence: `/fast` toggle message, widget indicator render, subagent env inheritance
- `PLUGINS.md` updated; `sync-pi-configs.sh --check` clean; commit in Public repo

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The fork is complete on disk but useless until installed and proven in the real environment. Installing it alongside `pi-gpt-fast-mode` would break `/fast` (two extensions register the same command and flag). The environment also has a custom `statusline.sh` footer that replaces pi's built-in footer — the fork's widget indicator must be verified to survive that (widgets render above/below the editor, not in the footer). Subagent handoff must be proven with a real spawned child, not just unit tests.

### Purpose

Deliver a verified, installed, documented extension: full test suite green, `/fast` and `--fast` working, indicator visible under the custom footer, subagents inheriting the preference, and the repo's pi docs (PLUGINS.md, settings) reflecting the new package.

### Non-Goals

- No npm publication (parent open question; local install is the default until decided)
- No changes to statusline.sh (widget placement means the fork does not need footer integration)
- No support for the pi-statusline footer-composition approach (rejected — see decision record in plan)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Test suite: keep upstream + handoff tests; add integration-style tests where cheap (config scope resolution, indicator fallback), run `npm test`
- Install the fork: `pi install` (source: local path default — open question), into `.pi/settings.json` project scope
- Remove `pi-gpt-fast-mode` from settings + both npm scopes (`pi remove` with `--approve`; legacy-peer-deps if the omplike peer conflict recurs)
- In-session verification: `/fast on` message + widget indicator + `--fast` flag + subagent spawn env check
- Docs: `PLUGINS.md` entry for the fork (sorted), drop pi-gpt-fast-mode entry; `sync-pi-configs.sh --check`; commit

### Out of Scope

- Publishing to npm (open question)
- Changes to the fork's src beyond phase-2 state (test-only phase; defects found during install are fixed via the phase workflow)
- Other machines' installs (this phase targets the local environment + versioned settings)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `tests/` (fork) | Modify | extended suite (integration cases) |
| `.pi/settings.json` | Modify | replace `npm:pi-gpt-fast-mode` with the fork source entry |
| `~/.pi/agent/npm` + `.pi/npm` | Modify | package install/removal (operator-local, not committed) |
| `.pi/PLUGINS.md` | Modify | fork entry (sorted), remove pi-gpt-fast-mode |
| `specs/hooks/011-.../` | Modify | phase closeout + evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements

| ID | Requirement | Verification |
|----|-------------|--------------|
| REQ-FUNC-1 | Full suite green in the fork: upstream + handoff + integration | `npm test` exit 0 |
| REQ-FUNC-2 | `/fast on` enables fast mode and `/fast off` disables it in-session | live session message + config file |
| REQ-FUNC-3 | Widget indicator visible with the custom `statusline.sh` footer active | live session screenshot/log |
| REQ-FUNC-4 | Subagent spawned after `/fast on` inherits `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1` and applies it | spawned process env + child session log |
| REQ-FUNC-5 | `pi-gpt-fast-mode` removed; no duplicate `/fast` registration | `pi list` output, settings.json |
| REQ-FUNC-6 | PLUGINS.md lists the fork alphabetically, versions accurate | sort check + `npm`/`git` version grep |
| REQ-FUNC-7 | `sync-pi-configs.sh --check` exits 0 after settings changes | command output |

### Non-Functional Requirements

| ID | Requirement | Verification |
|----|-------------|--------------|
| REQ-NFR-1 | No stray files in `.pi/` after install/removal (npm dirs are operator-local and git-ignored) | `git status --short .pi/` shows only intended files |
| REQ-NFR-2 | Rollback documented: reinstall pi-gpt-fast-mode restores previous behavior | rollback section in plan |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] `npm test` exit 0 in the fork (upstream + handoff + integration)
- [ ] `/fast` toggle verified in a live session with evidence (message + indicator)
- [ ] Subagent handoff verified with a real spawned child (env + applied state)
- [ ] `pi list` shows the fork and not pi-gpt-fast-mode
- [ ] PLUGINS.md sorted, accurate, committed; `sync-pi-configs.sh --check` exit 0
- [ ] No stray files in `.pi/` git status
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `pi remove`/`install` hits the pre-existing omplike peer conflict in `.pi/npm` | Medium | Medium | `--legacy-peer-deps` fallback (used successfully on 2026-08-16) |
| Two extensions register `/fast` during transition → broken command | High (transition window) | Medium | Remove pi-gpt-fast-mode in the same operation as installing the fork; verify `pi list` before/after |
| Widget indicator invisible in some pi version | Low | Medium | Fallback path is setStatus (upstream status.ts); verify in-session |
| External live-sync process rebases/commits over our .pi changes | Medium | Low | Commit promptly; re-verify after commit (recurred 2026-08-16) |
| Subagent spawn doesn't inherit env in a given runner | Low | High | Manual two-process check in phase 2; repeat in-session in this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

| Question | Impact | Decision Needed By |
|----------|--------|-------------------|
| Install source: local dir (`pi install <path>`) vs git URL vs npm? | settings entry shape, upgrade path | Phase 3 execution |
| Document pi-gpt-fast-mode as a predecessor entry in PLUGINS.md? | doc completeness vs list purity | Phase 3 execution |
<!-- /ANCHOR:questions -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-suite-and-static-gates/ | [Phase 1 scope] | Pending |
| 2 | 002-install-and-command-ownership/ | [Phase 2 scope] | Pending |
| 3 | 003-live-ui-handoff-and-closeout/ | [Phase 3 scope] | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-suite-and-static-gates | 002-install-and-command-ownership | [Criteria TBD] | [Verification TBD] |
| 002-install-and-command-ownership | 003-live-ui-handoff-and-closeout | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->
