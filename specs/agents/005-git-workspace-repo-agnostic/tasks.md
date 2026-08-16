---
title: "Tasks: Repo-Agnostic Git Workspace Rows [specs/agents/005-git-workspace-repo-agnostic]"
description: "Task breakdown for rewriting the AGENTS.md Git Workspace Safety rows repo-agnostic."
trigger_phrases:
  - "agents.md tasks"
  - "repo agnostic"
  - "git workspace safety"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/005-git-workspace-repo-agnostic"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Rewrote the AGENTS.md rows and authored packet docs"
    next_safe_action: "Land the AGENTS.md edit and packet to v4 and main"
    blockers: []
    key_files:
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-hardening"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Repo-Agnostic Git Workspace Rows

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` open, `[x]` done. IDs are `T<n>`. Each task names its verification.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T1 — Read the current `##### Git Workspace Safety` table in `AGENTS.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T2 — Rewrite the Branch-grammar row into an agnostic "Branch naming" row (sk-git named, no literal grammar).
- [x] T3 — Rewrite the "Allocate, never count" row (drop script path + command names).
- [x] T4 — Rewrite the "No direct branch creation" row (keep universal git commands, point to sk-git).
- [x] T5 — Rewrite the "Ask before push" row (drop allowlist file, env bypass flag, reference path).
- [x] T6 — Remove the "Hold the hyphen-case pilot" row.
- [x] T7 — Rewrite the "Live-sync" row (drop the four flag names + reference path).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T8 — Section-scoped grep for the forbidden repo-specific tokens returns 0.
- [x] T9 — Confirm sk-git still named (Mandatory Tools + Quick Reference) and no other section changed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0/P1 requirements met; packet validates `--strict`; AGENTS.md edit + packet landed to v4 and main.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` · Plan: `plan.md` · Summary: `implementation-summary.md`
- Source of truth for git specifics: `.opencode/skills/sk-git/`
<!-- /ANCHOR:cross-refs -->
