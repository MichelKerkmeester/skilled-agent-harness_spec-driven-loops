---
title: "Implementation Summary"
description: "The Hermes runtime folder and the cli-hermes skill are deleted, and no live document, registry or mirror names Hermes as a runtime any more."
trigger_phrases:
  - "remove hermes from docs"
  - "delete hermes runtime folder"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/003-cli-hermes-deprecation/002-docs-and-registries"
    last_updated_at: "2026-11-07T14:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Completed phase 2: docs-and-registries"
    next_safe_action: "Proceed to phase 003 regeneration and sweep"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-086-002-docs-and-registries"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Remove cli-hermes completely with no backup"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-docs-and-registries |
| **Status** | Complete |
| **Completed** | 2026-11-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Hermes runtime folder and the cli-hermes skill are deleted, and no live document, registry or mirror names Hermes as a runtime any more.

### Phase 2: docs-and-registries

The repository now ships six runtimes in its README and seven modes in the cli-external-orchestration hub. AGENTS.md no longer tells an agent about `.hermes/agents/` or a Hermes persona, and the sync checks no longer expect a `.hermes` mirror.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.hermes/` | Delete | The Hermes runtime folder, 177 tracked files |
| `.skilled/skills/cli-external-orchestration/cli-hermes/` | Delete | The executor mode |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/` | Delete | The skill and prompt sync scripts |
| `.skilled/skills/cli-external-orchestration/` hub files | Modify | Drop the mode, 8 to 7 |
| `README.md`, `AGENTS.md`, `SECURITY.md`, `.env.example`, `.gitignore` | Modify | Drop Hermes, fix runtime counts |
| `.skilled/agents/*.md` and their mirrors | Modify | Drop Hermes from orchestrate and prompt-improver |
| `.skilled/commands/**`, `.github/workflows/**` | Modify | Drop Hermes mirrors, routes and checks |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One Claude agent handled the hub, system-spec-kit and root docs, and another handled commands and workflows until the operator stopped it; I finished and verified its remaining items. Generated surfaces were regenerated with their own generators. Every gate was run before and after.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave released changelogs and `specs/` untouched | They record history; rewriting them would falsify past releases |
| Revert the doctor-helper held-out fixture | Its hash is pinned before tuning; a Hermes prompt in it is harmless test data |
| Keep the frozen anchor-repair fixtures | Their test pins exact counts of historical spec text |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hub gate | PASS, OK, 7 modes |
| Runtime mirrors | PASS, 241 mirrors across 10 trees in sync |
| Agent mirrors | PASS, 11 agents in sync |
| Markdown links | PASS, 0 broken |
| AGENTS.md check | PASS, STATUS=OK |
| Doctor suite | No new failure against main |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **History still names Hermes.** `specs/` and released changelogs keep their records by design.
2. **The AGENTS.md manifest keeps one history body.** It stores old section text so it can recognize stale embedded copies.
<!-- /ANCHOR:limitations -->

---
