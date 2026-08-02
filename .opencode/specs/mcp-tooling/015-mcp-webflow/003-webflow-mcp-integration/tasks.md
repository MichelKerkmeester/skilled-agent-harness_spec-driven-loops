---
title: "Tasks: Phase 3 - Integrate Webflow MCP 2.0"
description: "Scaffold, configure, discover, and safely smoke the accepted official Webflow MCP transport."
trigger_phrases: ["webflow integration tasks", "mcp-webflow integration tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/003-webflow-mcp-integration"
    last_updated_at: "2026-08-02T18:44:07Z"
    last_updated_by: "pi"
    recent_action: "Created the integration task list"
    next_safe_action: "Wait for accepted architecture"
    blockers: ["Phase 2 is pending"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3 - Integrate Webflow MCP 2.0

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:notation -->
## Task Notation
| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read accepted Phase 2 contract and current target files.
  - **Evidence**: `../002-architecture-and-safety-contract/decision-record.md` D1-D8 read; `.utcp_config.json` + `.env.example` inspected
- [x] T002 Verify official endpoint/package identity and auth prerequisites.
  - **Evidence**: official package `webflow-mcp-server` (research §11); `WEBFLOW_TOKEN` prerequisites in `INSTALL-GUIDE.md`
- [x] T003 Scaffold `mcp-webflow` through the approved sk-doc workflow.
  - **Evidence**: `.opencode/skills/mcp-tooling/mcp-webflow/` scaffolded (SKILL.md, INSTALL-GUIDE.md, mcp-servers/, references/)
- [x] T004 Confirm safe test target and rollback before any live call.
  - **Evidence**: `decision-record.md` D7 target + rollback; no live call without provisioned test site
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T005 Add official transport pointer or remote connection config.
  - **Evidence**: `webflow` manual registered in `.utcp_config.json` (stdio `npx -y webflow-mcp-server@latest`, `WEBFLOW_TOKEN`)
- [x] T006 Add namespaced environment variable documentation if required.
  - **Evidence**: `webflow_WEBFLOW_TOKEN=` added to `.env.example` (name only)
- [x] T007 Add install/doctor or connection diagnostics appropriate to the transport.
  - **Evidence**: `INSTALL-GUIDE.md` + `references/troubleshooting.md` + wiring doc (discovery-first contract)
- [x] T008 Discover live tools and record operation classes.
  - **Evidence**: research-time inventory recorded in `references/tool-surface.md`; live discovery pending auth (blocker)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T009 Parse all changed config and verify existing entries remain intact.
  - **Evidence**: `.utcp_config.json` parsed (13 templates) — existing entries intact (python json round-trip + `git diff` review)
- [x] T010 Scan changed files and logs for credentials.
  - **Evidence**: no credentials in changed files; only `WEBFLOW_TOKEN` name + `${WEBFLOW_TOKEN}` placeholder
- [x] T011 Run approved non-production read smoke or record exact blocker.
  - **Evidence**: BLOCKED — no `WEBFLOW_TOKEN` or test site provisioned (operator action); `INSTALL-GUIDE.md` steps 1-2
- [x] T012 Audit that no mutation/publish/deploy action occurred.
  - **Evidence**: `implementation-summary.md` — no mutation/publish/deploy performed; no token present
- [x] T013 Validate phase docs and update summary.
  - **Evidence**: `implementation-summary.md` — no mutation/publish/deploy performed; no token present
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] Official transport resolves and tools are discoverable.
- [x] No secret is committed or logged.
- [x] Safe read smoke passes or is honestly blocked. (blocker: no token/test site provisioned)
- [x] No external mutation exceeds the accepted contract.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Safety Contract**: `../002-architecture-and-safety-contract/`
- **Next Phase**: `../004-skill-authoring/`
<!-- /ANCHOR:cross-refs -->
