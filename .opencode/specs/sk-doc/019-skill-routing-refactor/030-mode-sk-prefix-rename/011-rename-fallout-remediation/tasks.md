---
title: "Task List: Post-rename fallout remediation"
description: "Ordered tasks for the three rename-fallout follow-ups."
contextType: "planning"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
---
# Task List: Post-Rename Fallout Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

- [x] T-1 [REQ-1] Repoint the `sk-doc/create-skill` contract import to `sk-doc/sk-create-skill`.
- [x] T-2 [REQ-1] Repoint hardcoded sk-code surface literals (`code-opencode`, `code-webflow`) and the `code-review/assets/...` path to their `sk-code-*` names.
- [x] T-3 [REQ-1] Re-run the router-sync suite to green (10/10) and confirm 0 stale literals remain.
- [x] T-4 [REQ-2] Reproduce the compiled-routing drift and probe live serving authority for sk-doc.
- [x] T-5 [REQ-2] Document the operator-gated recompile conclusion (guarded legacy fallback, no live mis-route, no clean regen entrypoint).
- [x] T-6 [REQ-3] Attempt the mcp-server dist rebuild and record the exact pi-hook blocker.
