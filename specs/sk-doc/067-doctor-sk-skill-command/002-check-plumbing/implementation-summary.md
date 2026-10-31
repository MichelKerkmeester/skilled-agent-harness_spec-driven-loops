---
title: "Implementation Summary"
description: "The /doctor:sk-skill check surface: a router, a presentation, a read-only check workflow, the route, the contract entry, the setup row, generated mirrors and a contract test, all verified."
trigger_phrases:
  - "check plumbing implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/002-check-plumbing"
    last_updated_at: "2026-10-30T08:50:00Z"
    last_updated_by: "claude-opus-worker"
    recent_action: "Built the check surface and ran every gate green"
    next_safe_action: "Start phase 003, or regenerate the advisor bridge once the convert route lands"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/sk-skill.md"
      - ".skilled/commands/doctor/assets/doctor-sk-skill-check.yaml"
      - ".skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-check-plumbing |
| **Status** | Complete |
| **Completed** | 2026-10-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:sk-skill` now reaches the phase 001 engine from every runtime. A bare invocation binds the read-only `check` target, which runs `sk-skill-check.cjs` once and writes nothing: with no skill named it prints one row per skill root, and with a name or path it prints rows C1 to C13 for that skill.

### Phase 2: check-plumbing

The router binds the target from `_routes.yaml`, loads the presentation contract and the check workflow, and keeps every visible line in the presentation. The workflow runs the engine with the skill name or path and `--json` passed through unchanged, so the presentation owns the tables and the workflow owns the flags.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/sk-skill.md` | Created | Router: the six canonical sections, the `check` target row and the presentation boundary |
| `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt` | Created | Argument failure, startup menu, fleet and deep result tables, JSON note, summary and failure templates, troubleshooting |
| `.skilled/commands/doctor/assets/doctor-sk-skill-check.yaml` | Created | Read-only workflow: one engine run, thirteen rows for one skill or one row per root for the fleet |
| `.skilled/commands/doctor/_routes.yaml` | Updated | `check` route with `mutating: read-only` and no `default_target`, since it is the only target, plus the router in the owner list |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Updated | `families.doctor`: router path, argument hint, execution target, owned assets, loader requirement, invocation alias |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Updated | One `/doctor:sk-skill check` row in the doctor target list |
| `.skilled/commands/README.txt` | Updated | One doctor index row and the group count 11 to 12 |
| `.skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` | Created | Five-surface contract test: route, router template, presentation template, workflow, contract schema |
| `.claude/commands/doctor/sk-skill.md` | Generated | Link, written by `sync-runtime-mirrors.cjs` |
| `.cursor/commands/doctor-sk-skill.md` | Generated | Link, written by `sync-runtime-mirrors.cjs` |
| `.codex/prompts/doctor-sk-skill.md` | Generated | Prompt entry, written by `sync-prompts.cjs` |
| `.pi/prompts/doctor-sk-skill.md` | Generated | Prompt entry, written by `sync-prompts-pi.cjs` |
| `.hermes/prompts/doctor-sk-skill.md` | Generated | Prompt entry, written by `sync-prompts-hermes.cjs` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The surfaces were authored through sk-doc's `sk-create-command` mode. Its `SKILL.md`, `ROUTER.md` and `references/router-presentation-split.md` were read first, then `command-router-template.md`, `command-presentation-template.md`, `command-template.md` and the machine-readable contract supplied the shapes. Nothing was hand-rolled from a sibling router: the router keeps the six canonical sections, and the presentation keeps the template's startup, results and next-step sections.

Every mirror came from a sync script. No generated file was edited by hand, and the two Hermes ones were produced the same way after checking that the Hermes prompt check passes.

The contract test is the piece that keeps the five surfaces in agreement. It reads the manifest, the router, the presentation, the workflow, the command contract and the JSON schema, so a later edit to one surface that leaves another behind fails the suite rather than shipping quietly.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Dropped `default_target` from the single `check` route | The bridge deriver refuses the flag on a single-target command, and `/doctor:setup` already shows that a bare single-target command reaches its only route without it. Phase 006 adds the flag to `check` when `convert` makes the command multi-target |
| Added the command index row to `.skilled/commands/README.txt` | The catalog mirror check is a required gate and reads that index. Its own repair line names the index row and the group count, and the `/doctor:ci` addition touched the same lines. README.md and the changelogs stay with phase 007 |
| One engine run per invocation | The engine already runs every validator it needs in check-only form, so the workflow adds flags rather than steps, and the read-only class stays true |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0, `OK: route-validate — 19 routes validated, 3 warnings` (18 routes before) |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | Exit 0, `7 suite(s) passed, 0 failed`, rerun after the bridge regeneration and the advisor `dist` rebuild |
| `derive-command-bridges.cjs` and `command-bridges-drift-guard.vitest.ts` | Deriver exit 0 once `check` dropped `default_target`; drift guard 5/5 |
| Presentation statuses | Legend, both row templates and the summary count include `N/A`, which the engine emits for rows that do not apply |
| `node --test .skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` | Exit 0, 14 of 14 pass |
| `/opt/homebrew/bin/python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/commands/doctor/sk-skill.md --type command` | `VALID`, `Total issues: 0`, exit 0 |
| `command-contract.json` against `command-contract.schema.json` | `/usr/bin/python3` jsonschema 4.25.1 `Draft7Validator`: 0 errors. Negative control: removing `families.doctor.topology` yields 2 errors, so the pass is discriminating |
| `validate-command-tree-parity.sh --quiet` | Exit 0 |
| `codex/sync-prompts.cjs --check` | Exit 0, `PASS: 39 prompts are in sync` |
| `pi/sync-prompts-pi.cjs --check` | Exit 0, `PASS: 39 prompts are in sync` |
| `hermes/sync-prompts-hermes.cjs --check` | Exit 0, `PASS: 39 prompts are in sync` |
| `command-catalog-mirror-check.cjs` | Exit 0, `STATUS=OK`, 39 of 39 commands listed |
| `validate.sh` on the phase folder, `--strict` | See `tasks.md`; `RESULT: PASSED` |

One early full-suite run reported a node-suite failure that counted 599 tests instead of 600. Six later runs, three of them direct `node --test` passes over the same 33 files and three full suite runs, each counted 600 tests and reported `fail 0`. The likely cause is inferred, not observed: `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` and the engine beside it carry another worker's staged edits in this shared worktree, and that test file grew by about 95 net lines, so a run that loaded it mid-rewrite would register a different count. What would confirm it is that worker's in-flight state at that moment, which this session cannot see. The last run of the same gate from the final state is the one reported above.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Docs stay with phase 007.** `README.md`, the Doctor section, the changelogs and the sk-create-skill docs are untouched; only the command index row was added, because a required gate reads it.
2. **No `convert` surface.** The route, workflow and presentation for `convert` belong to phase 006, and the router advertises no mode it cannot reach.
<!-- /ANCHOR:limitations -->

---
