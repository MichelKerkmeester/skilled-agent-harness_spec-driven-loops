---
title: "Implementation Plan: Phase 20: plugins-purity-dual-export"
description: "Reproduce the plugins purity failure locally, then teach the test to recognise the dual OpenCode export: when the default export carries a `server` function, require `setup`, call `server({})` and demand a recognised hook key on the returned object. Mutation probes prove the new branch still rejects, and the full Runtime vitest project closes the phase with no plugin changed."
trigger_phrases:
  - "plugins purity dual export plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 20: plugins-purity-dual-export

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript vitest suite over the OpenCode plugin surface |
| **Framework** | Vitest, run as the Runtime vitest project of the Spec-Kit Check |
| **Storage** | None |
| **Testing** | The purity test itself, three temporary mutation-probe runs and the full Runtime vitest project |

### Overview
The failure is reproduced locally first, before any edit (`scratch/before/plugins-purity-vitest.txt`). The purity test then learns the one shape it did not know: the dual export `{ id, server, setup }`, verified the way commit `27763681f7` verified the session-relaunch conformance suite — call the `server` factory and require a recognised hook key on what comes back. Mutation probes prove the new branch still rejects malformed plugin exports, and the whole Runtime vitest project closes the phase locally.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single test repair with recorded before/after evidence. The phase changes one test and no production or plugin code.

### Key Components
- **`opencode-plugins-folder-purity.vitest.ts`**: the purity test. It reads each `.opencode/plugins` default export and decides which shape it is; the new branch treats a `server` function as the dual export and verifies it through the v1 factory call.
- **The dual-export branch**: requires a `setup` function next to `server`, calls `server({})` and requires a recognised OpenCode hook key on the returned object, mirroring commit `27763681f7`, which made the session-relaunch conformance suite call `default.server`.
- **The mutation probes**: temporary bad plugins under `.opencode/plugins/`, each deleted after its run, proving the new branch fails rather than absorbs a dual plugin whose server factory returns no hook key, a dual-shaped object missing `server` or a plain object with no hook key.

### Data Flow
The test loads each plugin file in sorted order and inspects its default export. Plain factories and plain hook objects keep their existing branches; an object whose `server` is a function now goes through the dual path, whose `server({})` return value must carry a recognised OpenCode hook key.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The phase's product is itself a test, so the verification tasks in `tasks.md` carry the runs: the before reproduction (`scratch/before/plugins-purity-vitest.txt`), the three mutation probes (`scratch/after/mutation-dual-server-no-hooks.txt`, `scratch/after/mutation-dual-missing-server.txt`, `scratch/after/mutation-plain-object-no-hooks.txt`), the after purity run (`scratch/after/plugins-purity-vitest.txt`) and the whole Runtime vitest project (`scratch/after/runtime-project-summary.txt`). No testing beyond them is planned.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`scratch/facts.md` supplies every claim this phase makes, including the red main run `22f563b032` (run `39373558502`), the masking chain through `47371b495f` and the fix pattern taken from `27763681f7`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the purity test edit. No plugin changed, so nothing else needs unwinding; the records under `scratch/` stay as history.
<!-- /ANCHOR:rollback -->

---
