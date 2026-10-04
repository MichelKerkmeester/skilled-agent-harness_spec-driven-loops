---
title: "Implementation Summary"
description: "Each doctor command now diagnoses one owner: /doctor:speckit checks retrieval, and the advisor, deep-loop and runtime-mirror checks have their own commands. /doctor:rebuild and the fable-mode target are gone."
trigger_phrases:
  - "doctor ownership split summary"
  - "doctor skill-advisor rebuild shipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/008-doctor-ownership-split"
    last_updated_at: "2026-10-04T06:09:44Z"
    last_updated_by: "doctor-ownership-split"
    recent_action: "Split the doctor surface by owner and deleted the retired commands"
    next_safe_action: "Design the git hooks doctor as phase 009"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/_routes.yaml"
      - ".skilled/commands/doctor/skill-advisor.md"
      - ".skilled/commands/doctor/scripts/route-validate.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-ownership-split"
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
| **Spec Folder** | 008-doctor-ownership-split |
| **Completed** | 2026-10-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Each doctor command now checks one owner's surface. `/doctor:speckit` checks spec-kit retrieval and nothing else. The skill advisor, the deep loop and the runtime mirrors each have their own command. The advisor's database rebuild now lives with the advisor, and `/doctor:rebuild` and the fable-mode target are gone.

### Doctor ownership split

- **One manifest, four routers.** Every route in `_routes.yaml` names the command that owns it. The validator checks each route against its own router and presentation. New rule B3 fails a route whose command has no router.
- **`/doctor:skill-advisor <target>`.** `tune` is the old `skill-advisor` target. `rebuild` is new: it backs up `skill-graph.sqlite`, rebuilds through `advisor_rebuild` and `skill_graph_scan`, validates, and restores the backup if any step fails. The four read-only audits (`skill-graph-freshness`, `router-reach`, `skill-budget`, `parent-skill`) moved over unchanged.
- **`/doctor:deep-loop` and `/doctor:runtime-mirrors`.** Each runs its one workflow. The deep-loop workflow no longer recommends `/doctor:rebuild` for its coverage graph, which that command had already stopped rebuilding. It now points to resuming the loop or a manual `upsert.cjs` repair.
- **`/doctor:speckit`.** It takes no target. An old target name gets a notice naming the command that owns it now.
- **Deleted.** `/doctor:rebuild` with its workflow, presentation, bootstrap script and test. The fable-mode workflow, script and test, plus the fable metrics module, which had no other consumer. Nine playbook scenarios that only tested the old orchestrator. The trigger index now regenerates by a direct `generate-trigger-index.mjs` run, and the v3.3 migration leg was dropped.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/_routes.yaml` | Modified | Command owner per route; `tune` and `rebuild` routes |
| `.skilled/commands/doctor/{skill-advisor,deep-loop,runtime-mirrors}.md` and their presentations | Created | One router per owner |
| `.skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml` | Created | Advisor graph rebuild behind a backup |
| `.skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml` | Renamed | The tuning workflow, formerly `doctor-skill-advisor.yaml` |
| `.skilled/commands/doctor/speckit.md` and its presentation | Modified | Retrieval only, moved-target notice |
| `.skilled/commands/doctor/scripts/route-validate.{py,sh}`, `tests/route-validate.test.sh` | Modified | Command-aware checks, rule B3 |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | Doctor router list, hints, targets and loader rules |
| Kept doctor workflows, tests that named moved paths, READMEs, skill docs, the playbook and the feature catalog | Modified | Repointed to the new commands |
| Runtime mirrors under `.claude`, `.cursor`, `.codex`, `.pi`, `.hermes` | Regenerated | Through their own sync scripts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator chose the split before work began: `parent-skill` into `/doctor:skill-advisor`, `runtime-mirrors` as its own command, and an outright delete of `/doctor:rebuild`. The parent session wrote the manifest, validator, routers, workflows, contract and READMEs. A fresh Opus 5.5 at high effort swept the skill docs, playbook and catalog over a fixed file list, and the parent session checked its result with a repository-wide search. The runtime copies were regenerated through their own sync scripts, never edited by hand.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep one `_routes.yaml` with a `command` owner per route | One validator keeps checking every route; four manifests would split the checks |
| Rebuild the advisor graph through the advisor CLI | The advisor already owns `advisor_rebuild`; the doctor adds only the approval, backup and restore |
| Point trigger-index regeneration at the generator itself | It is one command with no daemon, and the pre-commit hook already runs it when spec docs change |
| Drop the v3.3 migration leg | No v4 checkout needs it, and release migration belongs to `/doctor:update` |
| Keep the `.doctor-rebuild.*` ignore line | An older checkout may still hold that state and must never commit it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `route-validate.sh` | `OK: route-validate — 9 routes validated, 1 warnings`, exit 0; the warning is a real `--dry-run` shared by two `/doctor:skill-advisor` targets |
| `route-validate.sh --self-test` and `route-validate.test.sh` | All self-tests pass; 20 passed, 0 failed, including the new B3 mutation |
| J1 against a broken scratch copy | Named a removed router row and a renamed target, exit 1 each |
| `run-all.sh` | 7 suites passed, node:test 203 of 203, exit 0 (before: 8 suites; the bootstrap and fable-mode tests left with their scripts) |
| Tests that named moved paths | Advisor route contract 7 of 7, sk-doc handoff 9 of 9, advisor vitest 8 of 8, sk-doc README fixtures pass |
| Contract | Valid against its schema; router generator `routers=34 clean=34 path-drift=0` |
| Mirrors and catalog | 179 runtime mirrors in sync, 36 prompts in sync for each of Codex, Pi and Hermes, catalog `STATUS=OK`, compiled route guard exit 0 |
| Links | `check-markdown-links.cjs`: 0 broken across 7,869 files |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The rebuild workflow has no automated run.** Its CLI commands are checked against the live advisor registry, and playbook scenario DOC-348 covers the dry run, a backed-up rebuild and a restore on failure, but that scenario is manual and has not been run.
2. **The old rebuild orchestrator's playbook coverage is gone.** Its failure injection, lock, signal and dashboard scenarios tested behaviour the new rebuild does not have, so they were retired rather than retargeted.
<!-- /ANCHOR:limitations -->

---


