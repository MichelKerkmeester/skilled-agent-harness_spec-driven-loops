---
title: "Implementation Summary"
description: "This phase is planned. It will stage all four generator outputs, guard the loop exactly, and retry a raced push after regenerating and checking the index. The token is left as it is."
trigger_phrases:
  - "trigger index rebuild hardening implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/004-trigger-index-rebuild-hardening"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "planning-author"
    recent_action: "Planned the phase"
    next_safe_action: "Build against goal.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-trigger-index-rebuild-hardening |
| **Status** | Planned |
| **Level** | 2 |
| **Created** | 2026-10-08 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Will Be Built

This phase is planned and not yet built. When completed, it will ensure all generator outputs are committed, guard the job's loop exactly and recover once from a push race.

### Phase 4: trigger-index-rebuild-hardening

The `.github/workflows/trigger-index-rebuild.yml` job will stage all four files the generator writes (trigger-index.json and three sidecars) and verify them before the commit. Its loop guard will match the rebuild commit exactly, or by a marker, instead of a subject prefix. The push step will retry once on non-fast-forward errors after fetching, rebasing, regenerating the index and passing `--check`. The token is left as it is.

### What Was Already Delivered

Commit abb53ecc698 already added `npm ci` to install the workspace and a TypeScript build step for the shared package, and moved the job to Node 22.

### Files That Will Change

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/trigger-index-rebuild.yml` | Modified | Stage all outputs, exact loop guard, regenerate-and-check retry, explicit error handling |
| `.github/workflows/README.md` | Modified | Document the four generator files, the loop guard and the retry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Token left as it is, `skilled/**` trigger kept (operator, 2026-10-08) | Scoping was considered because a ruleset-bypass token sits in the checkout credential while repository code runs and `skilled/**` has no protection. The operator chose not to change it |
| Exact or marker loop guard | A subject-prefix guard reopens the loop when the subject changes and skips unrelated commits that share the prefix |
| Stage all four files with post-commit `--check` | Catches a missing sidecar file before the push, when it is still reversible |
| Regenerate and `--check` before the retry push | A rebase moves the corpus, so the index must be rebuilt on the new tip before it is pushed |
<!-- /ANCHOR:decisions -->

---


