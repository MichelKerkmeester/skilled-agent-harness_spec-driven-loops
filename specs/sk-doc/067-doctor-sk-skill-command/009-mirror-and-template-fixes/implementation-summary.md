---
title: "Implementation Summary"
description: "Implemented: `sync-skills-hermes.cjs --check` and `sync-prompts-hermes.cjs --check` now run in the /doctor:runtime-mirrors route and its workflow with a contract test that fails on a removed line, and the leaf-manifest config template points authors at the router in the sibling ROUTER.md."
trigger_phrases:
  - "mirror and template fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/009-mirror-and-template-fixes"
    last_updated_at: "2026-10-30T07:05:00Z"
    last_updated_by: "code-agent"
    recent_action: "Implemented both fixes and passed every gate"
    next_safe_action: "Record the template fix in the sk-create-skill changelog, then let phase 10 verify the program"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/_routes.yaml"
      - ".skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml"
      - ".skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-leaf-manifest-config-template.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-mirror-and-template-fixes"
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
| **Spec Folder** | 009-mirror-and-template-fixes |
| **Status** | Complete |
| **Completed** | 2026-10-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:runtime-mirrors` now checks the generated Hermes skill and prompt copies that CI checks,
and the leaf-manifest config template points authors at the router in the sibling `ROUTER.md`.

### Phase 9: mirror-and-template-fixes

**Hermes checks in the route.** The runtime-mirrors route declares `sync-skills-hermes.cjs --check`
and `sync-prompts-hermes.cjs --check` beside the eight checkers it already declared, so a local run
reports the same Hermes drift CI's `command-tree-parity.yml` does. `route-validate.sh` reports 46
script invocations where it reported 44, and stays green.

**Hermes checks in the workflow.** The workflow asset gains a `hermes_skills` and a `hermes_prompts`
entry under `upstream_assets`, a checker step for each that names the exact `--check` command, the
surface it covers and the n/a rule for an absent `.hermes/` tree, and a repair line for each that is
the generator without `--check`. The route keeps `mutating: read-only` and still runs no generator in
write mode.

**The contract test.** A new suite pins both halves together, because a checker CI enforces but the
pair omits is the failure mode that costs nothing to create and a remote run to find. It asserts the
manifest entry, the workflow asset, the step's surface and n/a wording, the repair line, and the
read-only boundaries. Its gap functions are pure, so the same assertion is applied to a copy with the
line removed and has to report the gap. Both file paths resolve through an environment override,
which is what lets the removal cases run without deleting a tracked line.

**The template wording.** `skill-leaf-manifest-config-template.json` told authors to keep the leaf
roots the skill's "in-SKILL.md router" routes into. The machine router lives in the sibling
`ROUTER.md`, so the note now says that. The file's keys and shape are unchanged and it still parses.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/_routes.yaml` | Modified | Two `script_invocations` lines in the runtime-mirrors route, each with the n/a note |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | Modified | Two `upstream_assets` entries, two checker steps carrying the n/a rule, two repair lines, one note on the n/a verdict |
| `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` | Created | Pins the route and the workflow together, and fails when either Hermes line leaves either file |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-leaf-manifest-config-template.json` | Modified | One sentence in `_template` now names the router in the sibling `ROUTER.md` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both edits landed together, because `route-validate.py` fails a `script_invocations` entry its
workflow never invokes, so either one alone leaves the manifest red.

The proof plan ran from the final state. `route-validate.sh` exited 0. The contract test passed 7 of
7, and each of the four removals failed it. `run-all.sh` passed 7 suites, 0 failed, with 555 node
tests. `create-journey-proof.test.cjs` passed. `rg -n "in-SKILL.md router" .skilled/skills` exited 1
with no output.

The manual Hermes drift run became a checker-level run, because no runtime was attached to this
session and the tracked `.hermes/` tree was outside this run's write authority. The skills checker
was pointed at a scratch copy of the mirror through `HERMES_SKILLS_OUTPUT_DIR`: in sync, exit 0. One
copy was edited by hand: `DRIFT sk-git`, exit 1. The generator ran: in sync again, exit 0. The
prompts checker exposes no output-root override, so the conductor ran its drift half in the worktree
on the tracked tree: one line appended to `.hermes/prompts/create-agent.md` made `--check` print
`STALE .hermes/prompts/create-agent.md` and exit 1, the generator rewrote it, and `--check` exited 0
again with `.hermes/` clean in git. Every transcript is in `scratch/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add the line to both the route and the YAML in one change | `route-validate.py` fails when a `script_invocations` script is not invoked by the YAML |
| Name the `--check` command inside each step | The requirement measures the literal string `<script> --check` in both files, and a step that names the asset key alone would satisfy the workflow check while leaving that string absent |
| Resolve the test's two paths through environment overrides | The removal cases have to fail a real test run, and deleting a tracked line to prove it would leave the tree dirty if the run stopped early |
| Write the gap checks as pure functions | The removal case then exercises the shipped assertion instead of a second copy of it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | exit 0, 18 routes, 3 warnings, 46 invocations from 44 |
| `node --test .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` | 7 tests, 7 passed, exit 0 |
| The same test with either Hermes line removed from either file | exit 1 in all four cases (`scratch/contract-fail-proof.md`) |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | exit 0, 7 suites passed, 0 failed |
| `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs` | 1 test passed, exit 0 |
| `rg -n "in-SKILL.md router" .skilled/skills` | exit 1, no output |
| Hermes prompts drift on the tracked tree | `STALE .hermes/prompts/create-agent.md`, exit 1; exit 0 after the generator, `.hermes/` clean |
| Workflow `purpose` line | now names `.pi` and `.hermes` beside the four runtimes it listed |
| `node -e "JSON.parse(...)"` on the template | exit 0, seven keys unchanged |
| Spec folder validation | `validate.sh --strict` run at close, `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The n/a row was verified at the test level, not by a route run.** No runtime was attached, so
   the presentation never rendered. What is proven is the step rule in both files, the contract test
   that fails without it, and that the check form leaves an absent tree absent.
2. **The `sk-create-skill` changelog has no entry for this template fix.** That file is outside this
   run's write authority. `tasks.md` marks the item `[B]` with the blocker named, and
   `007-docs-and-changelogs` owns the changelog it belongs in.
<!-- /ANCHOR:limitations -->

---


