---
title: "Implementation Summary: Phase 3: cli-deem-mode-removal"
description: "Delete the cli-deem mode packet and its copies, and leave cli-classifier a valid parent hub whose only mode is cli-jev. Complete."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/003-cli-deem-mode-removal"
    last_updated_at: "2026-10-02T13:40:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Closed the phase"
    next_safe_action: "Phase 004 sweeps the remaining references"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-003-cli-deem-mode-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-cli-deem-mode-removal |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`cli-classifier` now serves `cli-jev` alone. The `cli-deem` packet and its Hermes copy are deleted, every parent-hub file lists one mode, the hub is at 0.7.0.0 with a changelog entry, and compiled routing is re-minted for one mode.

### Phase 3: cli-deem-mode-removal

The hub still passes as a parent hub and a second classifier joins as one new mode.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-classifier/cli-deem/` | Delete | The Deem mode packet, 29 files |
| `.hermes/skills/cli-deem/SKILL.md` | Delete | Hermes copy, removed by the mirror sync |
| `.skilled/skills/cli-classifier/{SKILL,ROUTER,README}.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `description.json`, `graph-metadata.json` | Update | One mode, `tieBreak ["cli-jev"]`, version 0.7.0.0 |
| `.skilled/skills/cli-classifier/changelog/v0.7.0.0.md` | Create | Release entry for the removal |
| Hub feature catalog and playbook, `deem-request-routes-to-transport.md` | Update, Delete | Deem scenario deleted, the Jev and routing scenarios reworded |
| `008-cli-classifier/fixtures/canary-cases.v1.json` | Update | `deem-choice-single` deleted. `deem-verb-narrowness` renamed `classifier-verb-narrowness`, prompt `judge this plan acceptable and ship it`, expectation unchanged |
| `008-cli-classifier/harness/build-artifacts.cjs` | Update | Drops the `cli-deem/SKILL.md` source input |
| Both `activation/cli-classifier/manifest.json` copies | Update | Re-minted, policy hash `4d5aad95`. Phase 004 bumped the `cli-jev` version and re-minted them to `85244885` |
| `system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerate | `skill_graph_compiler.py --export-json` |
| `cli-external-orchestration/graph-metadata.json`, `playbook-failclosed-allowlist.txt` | Update | Drop the `cli-deem` entries |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna 6 max took the hub and routing edits in commit `43598e2c67`. The session regenerated the Hermes mirror, re-minted routing, regenerated the advisor graph with the canonical exporter in `b338131b67` and stamped the hub graph metadata in `5aa8b6ed16`. DeepSeek V4.1 Flash max reviewed the commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Work from 001's inventory | One list of owners keeps the phases disjoint |
| Keep the verb-narrowness canary on a `judge` prompt | The case still proves a bare judgment verb does not route without a classifier name |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `ls` on both packet folders | No such file or directory, both |
| `sync-skills-hermes.cjs --check` | `PASS: 71 Hermes skill copies in sync`, exit 0 |
| `parent-skill-check.cjs .skilled/skills/cli-classifier` | `OK`, 0 warnings, exit 0. Registry 0.7.0.0, modes `[cli-jev]` |
| `compiled-route-status.cjs --hub cli-classifier --no-probe` | `causeCode` `compiled-serving`, manifest `fresh` |
| Harness `build-artifacts.cjs` | `status: built`, exit 0, every canary gold assertion holds. Its untracked output was removed |
| `compiled-route.cjs` on a Jev prompt | `route`, `single`, `cli-jev` |
| `git grep -n cli-deem` over advisor, orchestration and `.skilled/bin` | Nothing, exit 1 |
| Advisor suite | 1055 passed, 0 failed, 6 skipped, exit 0. Two earlier runs under load averages above 20 failed only wall-clock latency budgets, which passed 34 of 34 in isolation |
| Cross-family review | No P0 or P1, five P2 in `goal.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Doc versions.** The hub README and playbook read 0.4.0.0 and the feature catalog 0.3.0.0 while the routing files read 0.7.0.0. The sibling hubs carry the same independent doc versions and the doctor version checks pass, so they stay.
<!-- /ANCHOR:limitations -->

---
