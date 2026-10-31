---
title: "Implementation Summary"
description: "The /doctor:agents-md command is on the branch: three routes, a six-section router, three workflows, a presentation, the contract entries and every derived surface written by its own generator."
trigger_phrases:
  - "agents md plumbing implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/004-command-plumbing"
    last_updated_at: "2026-10-30T15:20:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Implemented the command plumbing and ran every gate"
    next_safe_action: "Run the end-to-end verification pass"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/agents-md.md"
      - ".skilled/commands/doctor/assets/doctor-agents-md-embed.yaml"
      - ".skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-296-agents-md-command"
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
| **Spec Folder** | 004-command-plumbing |
| **Completed** | 2026-10-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:agents-md` exists, and the two engines behind it are reachable from three targets. `check` reports the twelve rows and writes nothing, `embed` composes a plan, shows its digest and writes only after a yes to that plan, and `restore` puts back exactly the paths one recorded run wrote. A bare invocation runs `check`, because the read-only target claims `default_target` and a bare invocation must never reach a write.

### Phase 4: command plumbing

The router carries the six canonical sections and one `sk-doc` skill tag, and it composes nothing: the check engine and the embed engine own every read, every composition and every write. The three workflows name those engines and their subcommands, and the embed workflow's allowlist is the engine's own exported `ALLOWLIST` rather than a second list that could drift from it.

The contract suite was written before the router, and its first run failed on the missing file. It now reports 37 tests with `fail 0`, because most cases read files rather than run engines; the four that run an engine compose a throwaway repository first and remove it afterwards.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/agents-md.md` | Created | Router with the six canonical sections and one skill tag |
| `.skilled/commands/doctor/assets/doctor-agents-md-check.yaml` | Created | Read-only workflow over the check engine |
| `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml` | Created | Plan, digest, yes and only then a write |
| `.skilled/commands/doctor/assets/doctor-agents-md-restore.yaml` | Created | Restore from one recorded run |
| `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt` | Created | Every visible line the three targets print |
| `.skilled/commands/doctor/_routes.yaml` | Modified | Three routes, the header list and the re-measured counts |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modified | One target-list row |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` | Modified | One next-step line naming the check target |
| `.skilled/commands/README.txt` | Modified | One catalog row, and the doctor group count from 13 to 14 |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | Router path, hint, three execution targets, owned assets, aliases, loader rules and two destructive operations |
| `.skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` | Created | The contract suite |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Regenerated | Three inactive bridge entries |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | Regenerated | The generated bridge block |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Regenerated | The generated bridge block |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Regenerated | The generated command list |

The runtime command mirrors and the three prompt stub sets were written by their own scripts and are not listed one by one: two mirror links, and one prompt file per runtime.

### Review Fixes

A fresh review of the wiring raised seven findings. Each one is closed by a change to the router, a workflow, the presentation or the manifest, and each one carries a case in the contract suite that failed before the change.

| Finding | What was wrong | What changed |
|---------|----------------|--------------|
| F1 | An embed whose pointer generator exited nonzero ended `STATUS=OK` with no field to carry the line, and no repair for the `A10` row that still reported it | `Pointer sync:`, `Router:` and `Next:` are fields of the embedded result, the write phase turns a nonzero line into a `Next:` naming `/doctor:runtime-mirrors`, `A10` has a troubleshooting row with that repair, and the presentation says the generator never creates a missing `.cursor/rules/skill-routing.md` so it is never listed as written |
| F2 | The plan and the apply resolved different backup folders from a clock reading | Fixed in the engine before this pass: the folder is named after the plan digest, so plan and apply resolve one directory. The suite now asserts the plan's `backup:` and `undo:` are the apply's, on a composed fixture |
| F3 | The plan's `absent` target action had no place in the enumeration | The plan paragraph and its `Targets:` field name `<create\|replace\|remove\|unchanged\|absent>` and say what `absent` means |
| F4 | `backup-fallback:` was printed by every plan and named by nothing | It is in the plan phase's keep-list and has a `Backup note:` field |
| F5 | A value flag without its value, and a second positional on `check` or `restore`, had no defined failure | The argument table has a `missing_argument` row and a `too_many_arguments` row naming each target's own suggestion, and the router promises both |
| F6 | An engine exit 1 with `findings=0` is `UNKNOWN`, and the route only knew `FINDINGS` | `STATUS=UNKNOWN` is a status the route prints, the check output block has a third clause, and the summary's status list carries it |
| F7 | The `_routes.yaml` header named 11 of the 14 router files | It names all 14, and the suite compares that list against the folder |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline was measured before the first edit and recorded in `scratch/baseline.txt`: 21 routes and 3 warnings, 40 files and 699 node tests, `phrases=142 bridges=24`, 25 doctor bridges of 52 generated entries, 38 clean routers, 205 mirrors across 9 trees, 40 prompts per runtime and 40 commands in the catalog.

The order was the contract suite, then the router, then the routes, then the three workflows, then the presentation, then the contract entries and the catalog row, and last the four generators. Each generator's `--check` then ran twice: the second run printed `"changed": []` for the bridge deriver and a clean verdict for every other one.

The counts after the change, all measured on this branch:

- `route-validate.sh`: 24 routes validated, 11 commands in target-set parity, 60 route script invocations covered, 5 warnings (three that already existed, plus one flag-name note each for `--dry-run` and `--root` now that two more targets accept them).
- `derive-command-bridges.cjs`: 28 doctor routes, 55 generated entries, 29 active TypeScript bridges and 39 active Python bridges. The three new entries are generated and inactive.
- `doctor-phrase-reach.cjs`: `STATUS=OK phrases=142 bridges=24`. The probe only admits bridges the compatibility list activates, so the three new routes are named by the helper and by the setup list rather than by the advisor.
- `generate-command-routers.cjs --check`: `routers=39 clean=39`.
- `sync-runtime-mirrors.cjs --check`: 207 mirrors across 9 trees.
- The three prompt syncs: 41 prompts each.
- `command-catalog-mirror-check.cjs`: 41 commands.
- `setup` target list: 23 `/doctor:` rows, one of them this command, and 13 areas in the helper's own view.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The router copies the read-only exemplar's six sections | The family already asserts that shape, so a different shape would be a second convention |
| The contract suite compares the workflow allowlist against the engine's exported `ALLOWLIST` | A copied list of paths is a second boundary, and the one that drifts is the one nobody runs |
| The advisor bridge ships inactive | Activation shifts scoring for every prompt, and the exemplar ships inactive too |
| Every trigger phrase is plain language an operator would type | The helper ranks the manifest by phrase overlap, so an internal word reaches nobody |
| The generated surfaces are never hand-edited | A hand edit is reverted by the next generation run, silently |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | `OK: route-validate — 24 routes validated, 5 warnings`, exit 0 |
| `node --test .skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` | 37 tests, 37 pass, `fail 0`, exit 0 |
| `node --test` on the three agents-md engines | 103 tests, 103 pass, `fail 0`, exit 0 |
| `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-contract.test.cjs` | 20 tests, 20 pass, `fail 0`, exit 0 |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | 7 suites passed, 0 failed, exit 0 (node:test: 41 files, 911 tests) |
| `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | `STATUS=OK phrases=142 bridges=24`, exit 0 |
| `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check` | `routers=39 clean=39 path-drift=0 shape-drift=0`, exit 0 |
| `sync-prompts.cjs --check`, `sync-prompts-pi.cjs --check`, `sync-prompts-hermes.cjs --check` | `41 prompts are in sync` each, exit 0 |
| `sync-runtime-mirrors.cjs --check` | `PASS: 207 mirrors across 9 trees are in sync`, exit 0 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh` | `PASS: 207 mirrors across 9 trees are in sync`, exit 0 |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | `STATUS=OK`, 41 commands covered, exit 0 |
| `derive-command-bridges.cjs --check` after a second run | `"status": "fresh"`, `"changed": []`, exit 0 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md/004-command-plumbing --strict` | `RESULT: PASSED`, Errors 0, Warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Discovery depends on the operator knowing the name.** The bridge stays inactive, so the command is reachable by name, through the setup list and through `/doctor:helper`, not through advisor routing.
2. **The restore path is proven by the engine's suite, not by an end-to-end run on a real repository.** This child writes on the branch that ships the command; the end-to-end pass belongs to the verification phase, which can point `--root` at a fixture.
<!-- /ANCHOR:limitations -->

---
