---
title: "Implementation Plan: Phase 62: opencode-2-primary-v1-fallback"
description: "Make the resolver prefer the first opencode2 anywhere on PATH and fall back to the first opencode only when none exists, while OPENCODE_BIN still overrides both. Replace the PATH-order test with the later-opencode2 preference, add the no-opencode2 fallback and OPENCODE_BIN override tests, add a shared hermetic PATH setup for both vitest projects, then reorder every listed doc and asset to recommend OpenCode 2 first with OpenCode 1 as the temporary fallback, and prove both versions live."
trigger_phrases:
  - "opencode 2 primary v1 fallback plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 62: opencode-2-primary-v1-fallback

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS runtime scripts, TypeScript tests and vitest configs, Markdown docs and shell usage text |
| **Framework** | vitest, cli-opencode, the deep-loop fan-out runtime |
| **Storage** | None |
| **Testing** | vitest suites, the cli-opencode playbook, and live unpinned dispatches on both versions |

### Overview
The resolver changes from a per-directory walk that tries `opencode2` then `opencode` inside each PATH directory to a two-pass lookup: the first `opencode2` anywhere wins, and the first `opencode` is used only when no `opencode2` exists. `OPENCODE_BIN` is checked first and still overrides both. The dual-dispatch tests carry the new preference, the fallback and the override, and a new shared `tests/_support/hermetic-opencode-path.ts` strips host `opencode2` directories and `OPENCODE_BIN` so the v1 stubs win where a suite intends them to. Both vitest projects wire that setup in. The documentation, prompt assets, setup usage text, maps, catalog, changelog and regenerated Hermes mirror then present OpenCode 2 first and OpenCode 1 as the fallback for users who have not updated, with no removal date. Live proof on both versions and a full suite rerun close the verification.
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
- [x] Live proof recorded for both versions (`scratch/live/`)
- [ ] Commit pushed to main with CI green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-pass PATH lookup with an explicit environment override.

### Key Components
- **Runtime resolver**: `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` reads `OPENCODE_BIN` first, then scans PATH for `opencode2`, then scans again for `opencode`.
- **Documented one-line resolver**: cli-opencode's documented resolver applies the same order, so the docs and the runtime agree.
- **Dual-dispatch tests**: `opencode-dual-dispatch.vitest.ts` holds the later-`opencode2` preference, the no-`opencode2` fallback and the `OPENCODE_BIN` override.
- **Hermetic PATH setup**: `tests/_support/hermetic-opencode-path.ts` removes host `opencode2` directories from PATH and deletes `OPENCODE_BIN`, wired into the deep-loop and spec-kit vitest configs.
- **Docs and assets**: the cli-opencode pages, prompt assets, playbook overview, setup usage text, plugin README, cross-CLI map, root README, feature catalog, runtime scripts README and changelog all name OpenCode 2 first.

### Data Flow
A dispatch begins by reading `OPENCODE_BIN`; if it is set, that executable runs. Otherwise the resolver scans PATH once for the first `opencode2` and returns it, and only if no `opencode2` exists does it scan PATH again for the first `opencode`. The tests control PATH and `OPENCODE_BIN` through the shared setup so each case presents exactly one intended pair.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The tests live in `opencode-dual-dispatch.vitest.ts`: the replaced PATH-order test, the no-`opencode2` fallback and the `OPENCODE_BIN` override, with the old loop returning the v1 `opencode` for the new fixture as the negative control. The shared hermetic PATH setup makes the suites independent of a host install. Beyond the unit suites, the cli-opencode playbook runs 72 scenarios with 0 violations, and two live unpinned dispatches prove each version end to end.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---
