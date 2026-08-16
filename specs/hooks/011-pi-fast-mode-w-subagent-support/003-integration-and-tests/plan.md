---
title: "Implementation Plan: Phase 3 integration-and-tests"
description: "Plan for completing the test suite, installing the fork in place of pi-gpt-fast-mode, verifying in-session, and updating docs."
trigger_phrases:
  - "003-integration-and-tests"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests"
    last_updated_at: "2026-08-16T09:20:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Authored phase docs"
    next_safe_action: "Execute phase plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: integration-and-tests

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, pi extension install machinery |
| **Framework** | `pi install` / `pi remove` (settings + npm scopes) |
| **Storage** | `.pi/settings.json` (canonical, symlinked to `~/.pi/agent/settings.json`) |
| **Testing** | Vitest (fork) + live-session verification |

### Overview
Finish the fork's test suite (upstream + handoff + integration), then install it into the environment and remove `pi-gpt-fast-mode` in one transition to avoid a `/fast` command collision. Verify in a live session: toggle message, widget indicator under the custom statusline footer, and a real subagent inheriting `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1`. Update PLUGINS.md (sorted), run the sync check, and commit per the pi sync manifest.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (fork, settings canonical, pi install machinery)

### Definition of Done
- [ ] `npm test` exit 0 in the fork (all suites)
- [ ] `/fast`, `--fast`, widget indicator, and subagent handoff verified in-session with evidence
- [ ] `pi list` shows the fork, not pi-gpt-fast-mode
- [ ] PLUGINS.md updated + sorted; `sync-pi-configs.sh --check` exit 0; committed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Replace-and-verify install: same-transition removal of the colliding extension, then live verification.

### Key Components

- **Fork tests**: `tests/extension.test.ts`, `tests/config.test.ts`, `tests/commands.test.ts`, `tests/payload-status.test.ts` (upstream) + `tests/handoff.test.ts` (phase 2) + integration additions
- **Install path**: `pi install <source>` → settings entry + npm scope install; `pi remove npm:pi-gpt-fast-mode --approve` → removal; `--legacy-peer-deps` fallback for the omplike peer conflict
- **Verification surface**: live session (message + widget), spawned child env check, `pi list`, git status

### Data Flow

Install fork + remove pi-gpt-fast-mode → `/fast on` in session → message + widget indicator → config persisted → env written → subagent spawn inherits env → child session applies fast mode on supported model → docs + sync + commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix; environment integration. Affected surfaces:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.pi/settings.json` packages | lists npm:pi-gpt-fast-mode | replace with fork source entry | `pi list` + settings diff |
| `~/.pi/agent/npm` + `.pi/npm` | installed packages | remove pi-gpt-fast-mode, add fork | `npm ls` in both scopes |
| `.pi/PLUGINS.md` | plugin reference list | add fork (sorted), remove pi-gpt-fast-mode | sort check |
| `statusline.sh` footer | custom footer (replaces built-in) | unchanged — widget indicator must survive it | in-session screenshot/log |
| pi-subagents spawn | child pi processes | unchanged — inherits env automatically | spawned env check |
| `sync-pi-configs.sh` | config sync | run `--check` after settings change | exit 0 |

Rejected surface (documented): `pi-fast-mode` (TheBinaryGuy) footer-composition pattern — would fight pi-statusline's `setFooter`; the fork's widget approach is footer-independent.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Test suite completion
- [ ] Review upstream tests for integration gaps (config scope resolution, indicator fallback)
- [ ] Add integration test cases to the fork suite
- [ ] `npm run typecheck` + `npm test` → both 0

### Phase 2: Install transition
- [ ] Record pre-state: `pi list`, `npm ls` both scopes, settings packages
- [ ] `pi remove npm:pi-gpt-fast-mode --approve` (with `--legacy-peer-deps` fallback in `.pi/npm`)
- [ ] `pi install` the fork (source per open question; local path default) — `--approve`
- [ ] Verify `pi list` shows fork only; `npm ls` both scopes; settings packages sorted

### Phase 3: In-session verification + docs
- [ ] `/fast on` → message + config persisted + env written; widget indicator visible (custom footer active)
- [ ] Spawn a subagent/child pi → env `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1` inherited; fast mode applied on supported model
- [ ] `/fast off` → disabled; `/fast` toggle round-trip
- [ ] PLUGINS.md: add fork entry (sorted), remove pi-gpt-fast-mode; `sync-pi-configs.sh --check` → 0
- [ ] Commit .pi/ changes in Public repo; record evidence in checklist.md; close phase docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | upstream + handoff suites | Vitest |
| Integration | config scope resolution, indicator fallback | Vitest (fork) |
| Live | `/fast` toggle, widget under custom footer, subagent env inheritance | live pi session + spawned child |

Safety: the install transition happens once, with pre/post state recorded; any failure rolls back (below).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Version | Purpose |
|-----------|---------|---------|
| Phase-2 fork | local | package to install |
| pi CLI | installed | install/remove machinery |
| `.pi/npm` peer conflict (pi-omplike-advisor) | pre-existing | may force `--legacy-peer-deps` |
| Live session | — | in-session verification |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback = restore the previous extension set:

1. `pi remove <fork-source>` (settings entry + npm scopes)
2. `pi install npm:pi-gpt-fast-mode --approve` (restores previous behavior; config `pi-gpt-fast-mode.json` unchanged)
3. Revert PLUGINS.md + settings via git (`git checkout -- .pi/PLUGINS.md .pi/settings.json`)
4. `sync-pi-configs.sh --check` → 0; verify `/fast` works with the restored extension

Pre-state snapshot (task T2-phase2) makes the rollback target explicit before the transition starts.
<!-- /ANCHOR:rollback -->
