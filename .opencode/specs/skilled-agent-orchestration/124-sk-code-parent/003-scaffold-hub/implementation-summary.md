---
title: "Implementation Summary: scaffold hub"
description: "The sk-code skill now has a nested parent-hub scaffold: one routing-only hub, five mode-packet skeletons, registry/router metadata, and one preserved graph identity; content relocation starts in phase 004."
trigger_phrases:
  - "sk-code scaffold hub summary"
  - "sk-code parent scaffold outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/003-scaffold-hub"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed and documented the sk-code parent-hub scaffold"
    next_safe_action: "Proceed to 004-onboard-implement to relocate implement, quality, debug, and verify contracts into packets and shared/"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/mode-registry.json"
      - ".opencode/skills/sk-code/hub-router.json"
      - ".opencode/skills/sk-code/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-scaffold-hub |
| **Completed** | 2026-07-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 003 delivered the verified 14-file scaffold that converted the flat `sk-code` skill into a nested parent-hub scaffold. The result is a structural foundation only: mode packet contracts are skeleton-depth, and no existing content was relocated.

### Hub scaffold

`.opencode/skills/sk-code/SKILL.md` is now a routing-only hub at version `4.0.0.0`. It declares five modes, routes by `workflowMode`, reads `mode-registry.json`, and states that mode contracts live in the mode packets rather than the hub.

### Registry and router metadata

`mode-registry.json` declares the five accepted modes: `implement`, `quality`, `debug`, `verify`, and `review`. All use `advisorRouting.routingClass: "metadata"`; implement/quality/debug/verify use backend `surface-router`, while review uses `review-cache`. Tool surfaces match decision-record §3.1.

`hub-router.json` defines the router policy, default mode `implement`, five router signals, and vocabulary classes seeded from the existing `sk-code` identity so current routing intent can be preserved for later parity checks.

### Single graph identity

`graph-metadata.json` remains the only graph metadata file under `.opencode/skills/sk-code/`. It keeps `skill_id: sk-code` and `family: sk-code`, preserves existing edges/domains/intent signals, and extends derived fields for the hub and five modes.

### Packet skeletons

Five packet folders were added: `code-implement`, `code-quality`, `code-debug`, `code-verify`, and `code-review`. Each folder has `SKILL.md` + `README.md`; none has packet-local `graph-metadata.json`. These are placeholders for contracts authored in later phases.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-code/SKILL.md` | Rewritten | Thin routing-only hub |
| `.opencode/skills/sk-code/mode-registry.json` | Created | Five-mode registry and advisor-routing contract |
| `.opencode/skills/sk-code/hub-router.json` | Created | Hub routing policy and vocabulary |
| `.opencode/skills/sk-code/graph-metadata.json` | Rewritten | One preserved advisor graph identity |
| `.opencode/skills/sk-code/README.md` | Created | Hub overview |
| `.opencode/skills/sk-code/changelog/v4.0.0.0.md` | Created | Scaffold changelog |
| `.opencode/skills/sk-code/shared/README.md` | Created | Shared-router placeholder |
| `.opencode/skills/sk-code/code-*/SKILL.md` | Created | Five mode-packet skeletons |
| `.opencode/skills/sk-code/code-*/README.md` | Created | Five packet overviews |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-5.5-fast through `cli-opencode` authored the scaffold in the worktree from a precise structural spec. Claude verified the resulting files against the phase 002 decision and the scaffold invariants. The build deliberately avoided content relocation, review fold-in, advisor rebuild, and slash-command metadata work so phase 003 remained an additive structural step.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hub is routing-only | Prevents the parent from absorbing mode contracts and preserves clean packet ownership |
| Mode packets are skeleton-depth | Phase 003 scaffolds shape; phase 004+ authors/relocates contracts |
| Exactly one graph metadata file | Keeps the advisor on one `sk-code` identity while nested packets stay invisible as top-level identities |
| `command-metadata.json` deferred | `sk-code` has no `/code:*` slash-command surface and `parent-skill-check.cjs` does not require the file; phase 007 owns command/integration metadata |
| Out-of-scope package side effect reverted | Package runtime changes were not part of the scaffold contract |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Exactly one graph metadata | PASS: only hub root `graph-metadata.json` exists under `.opencode/skills/sk-code/` |
| JSON validity | PASS: scaffold JSON files parse validly |
| Registry completeness | PASS: five modes present with metadata routing and expected backend/tool surfaces |
| Banned paths untouched | PASS: `references/`, `assets/`, `scripts/`, `benchmark/`, `manual_testing_playbook/`, and `description.json` untouched |
| `sk-code-review` untouched | PASS: no changes to `.opencode/skills/sk-code-review/` |
| Comment/doc hygiene | PASS: no comment-hygiene leaks found |
| Out-of-scope runtime side effect | PASS: `package.json` / `package-lock.json` side effect was reverted |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Skeleton packets only.** The five mode folders are native packet shells; contracts are authored or relocated in later phases.
2. **No routing baseline captured here.** `fixtures/routing-parity-fixtures.md` freezes static expectations, but baseline capture runs later on `main`.
3. **No command metadata yet.** This is deliberate: `command-metadata.json` is deferred to phase 007 with advisor rebuild and integration work.
4. **No `sk-code-review` fold-in yet.** The standalone review skill remains untouched until phase 005.
<!-- /ANCHOR:limitations -->
