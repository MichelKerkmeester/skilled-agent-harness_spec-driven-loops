---
title: "Tasks: Codex skill advisor Node runtime alignment"
description: "Track the scoped diagnosis, one-line configuration repair, and final MCP verification."
trigger_phrases:
  - "Codex MCP runtime alignment tasks"
  - "mk_skill_advisor startup repair"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/019-codex-node-runtime-alignment"
    last_updated_at: "2026-08-10T08:41:19Z"
    last_updated_by: "codex"
    recent_action: "Completed the repair and verification tasks"
    next_safe_action: "Start a fresh Codex session and inspect the startup banner"
    blockers: []
    key_files:
      - ".codex/config.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-mcp-runtime-alignment-20260810"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Codex Skill Advisor Node Runtime Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Inspect Codex MCP runtime pins (`.codex/config.toml`).
- [x] T002 Identify the advisor native module ABI and compatible runtime. [evidence: `process.versions.modules` reports 127 under Node 22 and 141 under Node 25.]
- [x] T003 Create the Level 1 packet (`specs/system-skill-advisor/019-codex-node-runtime-alignment/`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reproduce the Node 22 ABI mismatch. [evidence: the SQLite constructor exits 1 with `ERR_DLOPEN_FAILED`.]
- [x] T005 Update only the advisor runtime path (`.codex/config.toml`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Load the final Codex TOML configuration. [evidence: `codex mcp get mk_skill_advisor --json` resolves `/opt/homebrew/bin/node`.]
- [x] T007 Verify a live advisor MCP initialize handshake. [evidence: `mk_skill_advisor` v0.1.0 returned initialize PASS.]
- [x] T008 Verify registered MCP commands and the scoped diff. [evidence: `codex mcp list` loaded all registrations; `git diff -- .codex/config.toml` shows one runtime command change.]
- [x] T009 Refresh metadata and pass strict packet validation. [evidence: `validate.sh specs/system-skill-advisor/019-codex-node-runtime-alignment --strict` exits 0 with zero warnings.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Objective checks pass from the final state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
