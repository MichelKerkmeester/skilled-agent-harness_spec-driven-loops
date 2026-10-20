---
title: "Implementation Plan: Phase 28: plugin-kill-switch-coverage"
description: "Route system-speckit-completion and the sk-vision plugin through the shared hook-flags resolver, so the master switch and each plugin's concern switch silence them on OpenCode 1 and OpenCode 2."
trigger_phrases:
  - "plugin kill switch coverage plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 28: plugin-kill-switch-coverage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ESM plugin), TypeScript (sk-vision, bundled by Bun) |
| **Framework** | OpenCode plugin API: v1 `server`, v2 `setup` |
| **Storage** | None; switches come from the environment and `.skilled/hooks/hook-flags.env` |
| **Testing** | `node --test .opencode/plugins/tests/`, `bun test` in `vision-runtime`, the two-version doctor battery |

### Overview
Both plugins check `isHookEnabled(concern)` from `.skilled/hooks/shared/hook-flags.cjs` once, when the host builds them, and register nothing when it returns false. speckit-completion uses the `completion` concern, whose aliases already include its own switch; sk-vision uses the `sk-vision` concern that its Devin hook already uses, so no switch name is new.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Early return at plugin construction, the pattern `system-dist-freshness-guard.js` and `session-cleanup.js` use.

### Key Components
- **`hook-flags.cjs`**: the shared resolver: master switch and aliases, concern switch and aliases, truthy values, the `hook-flags.env` file.
- **sk-vision resolver loader**: finds `hook-flags.cjs` from the real path of the running module, so the `.opencode/plugins/sk-vision.js` symlink does not change the result, and treats a missing resolver as switched on.

### Data Flow
Host loads plugin → `server(input)` or `setup(ctx)` → `isHookEnabled(concern)` → false: return `{}` / `{ dispose }` or a no-op cleanup, nothing registered → true: unchanged registration.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. The change adds no state and no new switch names, so a revert restores the old behavior exactly; the sk-vision bundle is rebuilt by provisioning.
<!-- /ANCHOR:rollback -->

---

