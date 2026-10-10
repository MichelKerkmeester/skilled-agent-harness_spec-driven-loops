---
title: "Tasks: Repoint the clickup_official Code Mode manual to the hosted ClickUp MCP and fix stale ClickUp docs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "clickup hosted route fix tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Repoint the clickup_official Code Mode manual to the hosted ClickUp MCP and fix stale ClickUp docs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record baselines: config check FAIL, `validate_config.py` PASS on 14 manuals (`.utcp_config.json`)
- [x] T002 Confirm `mcp-remote` resolves on npm and the hosted endpoint answers (`npm view mcp-remote`, `curl -I`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Repoint `clickup_official` args to `["-y","mcp-remote","https://mcp.clickup.com/mcp"]` and drop `env` (`.utcp_config.json`)
- [x] T004 Correct the `clickup_official` line to the hosted route and OAuth (`README.md`)
- [x] T009 Remove the ClickUp key pairs and the example that used them from the Code Mode secrets block (`.env.example`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Config check passes (REQ-001)
- [x] T006 `validate_config.py .utcp_config.json` prints `VALIDATION PASSED` (REQ-002)
- [x] T007 No `@clickup/mcp-server` left in `README.md` or `.utcp_config.json` (REQ-003)
- [x] T008 `validate.sh --strict` on this packet prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Registration after restart and OAuth approval is the operator's to verify
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



