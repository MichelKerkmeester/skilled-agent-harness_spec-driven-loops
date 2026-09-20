---
title: "Implementation Summary: Runtime Parity"
description: "Phase 6 of the git action advisory hook packet."
trigger_phrases:
  - "006-runtime-parity docs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/006-runtime-parity"
    last_updated_at: "2026-07-28T07:30:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Built and verified in one pass"
    next_safe_action: "Operator review"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-sk-git-016-6"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Runtime Parity

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-runtime-parity |
| **Completed** | 2026-07-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisory hook accepts both payload dialects — Claude's `Bash` and Codex's `exec` — and resolves the repository from the payload's own `cwd` before falling back to either runtime's project-dir variable. Registered in the Codex `exec` hook group alongside the dispatch preflight that already lives there. One file serves both runtimes; a sibling copy was rejected because a second copy is a second thing to drift.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-git/scripts/hooks/git-preflight-advisory.mjs` | Modified | Accept exec payloads and payload cwd |
| `.codex/hooks.json` | Modified | Registered in the exec group |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One pass on the packet's established discipline: reproduce against a real repository before asserting, keep every rule advisory, and re-measure noise after the change rather than assuming it held.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Follow the phase 002/003 shape exactly | The foundation was built to be extended; deviating would create a second pattern |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Codex payload fires | PASS — simulated exec payload drew the advisory |
| Claude payload unchanged | PASS — Bash payload still fires |
| Non-git exec stays silent | PASS — shape gate unchanged |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Verified against a simulated exec payload, not a live Codex session.
2. OpenCode runtime is not covered; its hook surface differs and was out of scope here.
<!-- /ANCHOR:limitations -->
