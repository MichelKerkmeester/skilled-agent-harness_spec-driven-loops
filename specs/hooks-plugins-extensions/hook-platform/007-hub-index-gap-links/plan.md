---
title: "Implementation Plan: Hook hub index gap links and conversation scenario renames"
description: "Add fourteen browsability symlinks under .skilled/hooks for the Vibe guard scripts and two OpenCode plugins, then rename 29 conversation scenarios and rewrite their links."
trigger_phrases:
  - "hub index gap links plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Hook hub index gap links and conversation scenario renames

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Relative symlinks, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | node:test, vitest, markdown link checker, playbook validator |

### Overview
Fourteen relative symlinks go under `.skilled/hooks/<concern>/{vibe,opencode}/`, the same direction the existing OpenCode mirrors take, because Vibe and OpenCode load their scripts from fixed runtime folders. 29 scenario files lose the `-conversation` suffix through `git mv`, and a script rewrites only the references that resolve to a renamed path. The coverage scan, the link checker and the playbook validator prove it.
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
- [x] `check-markdown-links.cjs` prints `0 broken markdown links` and the coverage scan prints `"LINKED_FROM_HOOKS":108`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Browsability symlink mirror.

### Key Components
- **`.skilled/hooks/<concern>/vibe/`**: one link per Vibe guard script. Without it the concern folder shows every runtime but Vibe.
- **`.skilled/hooks/{ask-surface-guard,decision-capture}/opencode/`**: the two OpenCode plugins the mirror set lacked.

### Data Flow
Nothing loads through the new links. Vibe runs `.vibe/plugins/repo-guards/` from `.vibe/hooks.toml` and OpenCode globs `.opencode/plugins/`, so the links only make the runtimes visible from the hub.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs the coverage scan for the baseline. Implementation adds the links, updates the READMEs and renames the scenarios. Verification reruns the scan and the repository checks. `tasks.md` owns the checkboxes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The coverage scan, `check-markdown-links.cjs`, `validate-playbook-package.cjs` per touched package, `sync-runtime-mirrors.cjs --check`, the hook vitest config, the node:test hook collection the OpenCode plugin workflow runs, and `package_skill.py --check --strict` on each touched skill.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a runtime loads a hook twice or a playbook run cannot find a scenario. Revert the commit. The links and renames carry no state.
<!-- /ANCHOR:rollback -->

---
