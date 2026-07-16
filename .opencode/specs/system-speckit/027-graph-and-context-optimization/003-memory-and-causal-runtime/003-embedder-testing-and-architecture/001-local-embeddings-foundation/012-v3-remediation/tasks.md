---
title: "Tasks: Phase 12 - v3 Remediation"
description: "Task list for q8 default, launcher parity, dtype DB keys, Voyage guard timing, CocoIndex hardening, doc alignment, and validation."
trigger_phrases:
  - "012 v3 remediation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/012-v3-remediation"
    last_updated_at: "2026-05-13T08:30:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Shipped in 42aa114e3 with main-agent .codex patch"
    next_safe_action: "Use 013 for v4 cleanup follow-up"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140120c2a9e0000000000000000000000000000000000000000000000000003"
      session_id: "014-012-v3-remediation-2026-05-13"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12 - v3 Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

**Task Format**: `T### Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Code and Config

- [x] T001 Read v3 remediation scope and target files
- [x] T002 Flip hf-local dtype default to q8 (`hf-local.ts`)
- [x] T003 Add dtype to `EmbeddingProfile` slug/JSON/equality/filename (`profile.ts`, `types.ts`)
- [x] T004 Thread hf-local dtype into startup profile (`factory.ts`, `hf-local.ts`)
- [x] T005 Add pre-resolution Voyage auto-shadow warning (`factory.ts`)
- [x] T006 Route Claude config through launcher (`.claude/mcp.json`)
- [x] T007 Route Gemini config through launcher (`.gemini/settings.json`)
- [x] T008 Route Codex config through launcher (`.codex/config.toml`) — shipped by main agent in 42aa114e3
- [x] T009 Add dtype docs to `.env.example`
- [x] T010 Switch tcpdump default interface to `pktap` (`tcpdump-verify.sh`)
- [x] T011 Validate CocoIndex search-only `project_root` (`daemon.py`)
- [x] T012 Read unloaded CocoIndex sqlite status directly (`daemon.py`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Documentation

- [x] T013 Update 011 status to complete and clear blocker docs
- [x] T014 Update parent phase map and graph metadata for 012
- [x] T015 Update SETUP_A_RECIPE for shipped EmbeddingGemma q8 defaults
- [x] T016 Fix 002 2560/Qwen-era dimension claims
- [x] T017 Fix 006/009 baseline mentions
- [x] T018 Update handover terminal state
- [x] T019 Create 012 Level-1 docs and metadata
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Rebuild shared dist once after initial code edits
- [x] T021 Rebuild shared dist after final docs/code edits
- [x] T022 Verify dtype appears in dist filename builder grep
- [x] T023 Strict-validate 014 parent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] `.codex/config.toml` patch shipped in 42aa114e3
- [x] Strict validation exits 0 errors / 0 warnings
<!-- /ANCHOR:completion -->
