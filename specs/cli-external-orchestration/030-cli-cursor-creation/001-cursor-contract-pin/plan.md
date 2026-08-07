---
title: "Implementation Plan: Cursor CLI contract pin"
description: "Plan for verifying the live Cursor CLI contract before executor/skill-packet work begins."
trigger_phrases: ["cursor cli contract pin plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/001-cursor-contract-pin"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Plan executed in full during authoring"
    next_safe_action: "Proceed to 002"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cursor CLI contract pin

<!-- ANCHOR:summary -->
## 1. SUMMARY
Install the official Cursor CLI, then verify its live build/binary-name/flags/auth/hooks/config/permissions/models/unique-surfaces contract against the installed `cursor-agent` binary and `cursor.com/docs`, producing a citable evidence base for phases 002-007.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Every contract fact traces to either a live command's stdout or a specific `cursor.com/docs` URL.
- No fact carried forward from Cursor-the-editor knowledge without being re-verified against the CLI itself.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Read-only verification phase; no new components. Evidence flows into phase 002's executor-kind design and phase 003's SKILL.md/README.md content.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
None (verification only).
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Install
`curl https://cursor.com/install -fsS | bash` - installs `cursor-agent` (and an `agent` alias symlink) under `~/.local/bin/`, pointing into `~/.local/share/cursor-agent/versions/<build>/cursor-agent`.

### Phase 2: Verify binary, version, and auth state
`which cursor-agent`/`which agent`, `cursor-agent --version`, `cursor-agent about`, `cursor-agent status`, `cursor-agent --help`.

### Phase 3: Fetch and cross-check official docs
Fetch `cursor.com/cli`, `cursor.com/docs/cli/overview`, `cursor.com/docs/cli/headless`, `cursor.com/docs/cli/using`, `cursor.com/docs/cli/mcp`, and `cursor.com/docs/hooks`; cross-check each claim against the live command surface and the local `.cursor/`/`~/.cursor/` config files.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
`cursor-agent --version`, `--help`, `about`, `status`, and a single `-p` dispatch (which fails closed without account auth) are the only live commands run - all read-only, no side effects beyond installing the binary itself.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
None - first phase.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`cursor-agent uninstall-shell-integration` plus removing `~/.local/bin/cursor-agent`, `~/.local/bin/agent`, and `~/.local/share/cursor-agent/` reverses the install if the creation is abandoned. No repo files were changed by this phase.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
None - foundational phase all others depend on.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
Actual: ~30 minutes (install + live command capture + documentation fetches + cross-check).
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
N/A - no destructive or hard-to-reverse actions taken (install is fully reversible by removing the bin symlinks and the versions directory).
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
