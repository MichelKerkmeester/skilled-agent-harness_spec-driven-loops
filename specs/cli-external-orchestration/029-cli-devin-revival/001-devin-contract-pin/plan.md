---
title: "Implementation Plan: Devin CLI contract pin"
description: "Plan for verifying the live Devin CLI contract before executor/skill-packet work begins."
trigger_phrases: ["devin contract pin plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/001-devin-contract-pin"
    last_updated_at: "2026-07-23T20:03:10Z"
    last_updated_by: "claude-code"
    recent_action: "Plan executed in full during authoring."
    next_safe_action: "Proceed to 002"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Devin CLI contract pin

<!-- ANCHOR:summary -->
## 1. SUMMARY
Install the official Devin CLI, then verify its live version/hooks/config/permissions/models/subagents/auth contract against `docs.devin.ai`, producing a citable evidence base for phases 002-007.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Every contract fact traces to either a live command's stdout or a specific `docs.devin.ai` URL.
- No fact carried forward from the archived (2026-05/06) packets without being re-verified live.
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
`curl -fsSL https://cli.devin.ai/install.sh | bash` - installs to `~/.local/bin/devin` (symlink into `~/.local/share/devin/cli/_versions/current/bin/devin`).

### Phase 2: Verify version and auth state
`devin --version`, `devin auth status`.

### Phase 3: Fetch and cross-check official docs
Essential commands, full command reference, hooks overview + lifecycle hooks, configuration + config-file reference, models, handoff, Windsurf enterprise auth, API authentication, sandbox, subagents, permissions.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
`devin --version` and `devin auth status` are the only live commands run (both read-only, no side effects beyond installing the binary itself).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
None - first phase.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`devin uninstall --clean` removes the CLI and all local data if the revival is abandoned. No repo files were changed by this phase.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
None - foundational phase all others depend on.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
Actual: ~30 minutes (install + 13 documentation fetches + cross-check).
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
N/A - no destructive or hard-to-reverse actions taken (install is fully reversible via `devin uninstall --clean`).
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
