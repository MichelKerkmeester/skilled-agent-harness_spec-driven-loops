---
title: "Implementation Plan: Phase 1: research-and-context"
description: "Plan for the read-only research gate that queries the locally installed gk CLI for the real GitKraken MCP tool surface and resolves the read/write safety-carve-out decision before any file changes."
trigger_phrases:
  - "gitkraken mcp research plan"
  - "gk cli inventory plan"
  - "phase 001 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/007-gitkraken-mcp-integration/001-research-and-context"
    last_updated_at: "2026-07-14T20:48:58Z"
    last_updated_by: "claude"
    recent_action: "Executed the research passes and recorded the safety-carve-out decision"
    next_safe_action: "Proceed to phase 002"
    blockers: []
    key_files:
      - ".opencode/specs/sk-git/007-gitkraken-mcp-integration/001-research-and-context/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research-and-context"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: research-and-context

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec-kit documentation with read-only CLI + repository inspection |
| **Framework** | System Spec Kit Level 1 phase documentation |
| **Storage** | None; findings recorded directly in this phase's spec.md |
| **Testing** | Live `gk` CLI probes; manual diff against existing `.utcp_config.json` conventions |

### Overview
Query the real, locally installed and authenticated GitKraken CLI (`gk`) for its MCP tool surface rather than relying on the GitHub README's partial documentation, reconcile the config shape against this repo's existing `.utcp_config.json` conventions, and resolve whether to register the manual with or without `--readonly` against the user's explicit request to use write-capable tools (`gitlens_commit_composer`, `pull_request_create_review`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (none — first phase)

### Definition of Done
- [x] All acceptance criteria met
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only research gate: live CLI probe plus repo-convention diff, producing a resolved design decision consumed by phases 002-003.

### Key Components
- **CLI probe**: `gk --version`, `gk whoami`, `gk mcp --help`, `gk mcp --list-tools`, `gk mcp config claude` — captured verbatim to ground every claim in phase 001's spec.md against real tool output, not the README.
- **Convention diff**: Compare `gk mcp config claude`'s locally-installed-binary form against the `npx -y <pkg>` form already used by every manual in `.utcp_config.json`.
- **Safety-carve-out resolution**: Cross-reference the 31-tool inventory against `sk-git/SKILL.md` §4 RULES (ask-first worktree, no direct branch creation, conventional commits) and `references/github_mcp_integration.md`'s existing local-vs-remote tool-selection precedent.

### Data Flow
CLI stdout becomes the tool inventory in phase 001's `spec.md`; that inventory plus the resolved safety decision become direct inputs to phase 002 (`.utcp_config.json` entry shape) and phase 003 (reference doc + router rules).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase folder scope and the no-write boundary outside `001-research-and-context/`
- [x] Identify the exact CLI probes needed (`--version`, `whoami`, `mcp --help`, `mcp --list-tools`, `mcp config claude`)

### Phase 2: Core Implementation
- [x] Execute the CLI probes and capture the full 31-tool inventory
- [x] Diff the config shape against existing `.utcp_config.json` manuals
- [x] Resolve the read/write safety-carve-out decision against sk-git's existing rules

### Phase 3: Verification
- [x] Reconcile findings for internal consistency (tool count, grouping, forbidden tools)
- [x] Confirm no files outside this phase folder were touched
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live probe | GitKraken MCP tool surface | `gk mcp --list-tools` |
| Convention check | Config shape | Manual diff vs. `.utcp_config.json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Locally installed, authenticated `gk` CLI | External | Green | Without it, tool inventory would rely on the incomplete README only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N/A — this phase is read-only and produced no file changes outside the phase folder.
- **Procedure**: None required.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Tasks**: See `tasks.md`
