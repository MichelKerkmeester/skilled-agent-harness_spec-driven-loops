---
title: "Implementation Summary"
description: "What phase 6 built: a convert route on /doctor:sk-skill, a plan-first workflow that writes one skill folder only after an explicit yes, presentation states for the plan, the refusals and both outcomes, and an advisor bridge that routes convert requests to it."
trigger_phrases:
  - "convert plumbing implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/006-convert-plumbing"
    last_updated_at: "2026-10-30T10:06:00Z"
    last_updated_by: "implementer"
    recent_action: "Wired the convert target end to end and verified every gate"
    next_safe_action: "Run validate.sh --strict on the packet, then let the docs phase take the README and changelog"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml"
      - ".skilled/commands/doctor/_routes.yaml"
      - ".skilled/commands/doctor/sk-skill.md"
      - ".skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt"
      - ".skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-convert-plumbing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the command contract already register convert? It did not, so the execution target, the owned asset, the alias and the hint were added to the doctor family entry"
      - "Does the check route's bridge id survive a second target? No: a multi-target command is bridged per target, so both command-doctor-sk-skill-check and command-doctor-sk-skill-convert were activated"
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
| **Spec Folder** | 006-convert-plumbing |
| **Status** | Complete |
| **Completed** | 2026-10-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:sk-skill` now has two targets. `check` still reads only. `convert` takes one skill name or path, prints the whole conversion plan, and writes that one skill folder only after an explicit yes.

### Phase 6: convert-plumbing

You type `/doctor:sk-skill convert <name-or-path>`. The route resolves, the converter plans, and you read the numbered steps, the backup folder it will use and the follow-up items the router template left behind. If your skill's description is over 130 characters, you are asked whether to trim it, and the trim is its own yes. If `allowed-tools` is missing, you are offered `[Read, Grep, Glob]` and that is its own yes too. Then one question covers the conversion. Any answer but yes ends the run with `STATUS=CANCELLED` and nothing changed. On yes, the converter backs the pre-write files up, creates `ROUTER.md`, rewrites `SKILL.md`, proves the router still resolves to the same signals, the workflow re-reads the skill through the check engine, and the result prints the undo commands.

A refused target stops at the plan and never touches the folder: a dual declaration, a hub or half hub declaration, nested `SKILL.md` packets, a `local-` or `agent-` prefixed name, a name collision, a path outside `.skilled/skills`, and an `ROUTER.md` the conversion would have to replace. Each prints the converter's own reason with its machine code and ends `STATUS=FAIL`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml` | Created | The eight-phase workflow: read, refuse, plan, approval, write, re-read, undo, report, with a reason for every refusal the converter prints |
| `.skilled/commands/doctor/_routes.yaml` | Modified | The `convert` route with `mutating: mutates`, its three script invocations and six trigger phrases; `default_target: true` on `check` |
| `.skilled/commands/doctor/sk-skill.md` | Modified | Both targets in the execution table, the per-target flags, the ask-once rule for a convert name and the bare-command default |
| `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt` | Modified | The dual menu, the conversion plan and follow-up layout, the refusal table, and the converted, unchanged, cancelled and failed results |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modified | The convert row in the doctor target list |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | The convert execution target, owned asset, loader requirement, alias, hint and destructive operation in `families.doctor` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modified | Both sk-skill bridges activated in the TypeScript and Python lists |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json`, `runtime/lib/scorer/projection.ts`, `runtime/lib/render.ts`, `runtime/scripts/skill_advisor.py` | Regenerated | Written by `derive-command-bridges.cjs`, never by hand |
| `.skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` | Modified | Both routes, both workflows, the plan-before-write order, and every refusal code and reason, checked against the converter's own source |
| `.cursor/commands/doctor-sk-skill.md`, `.codex/prompts/doctor-sk-skill.md`, `.pi/prompts/doctor-sk-skill.md`, `.hermes/prompts/doctor-sk-skill.md` | Unchanged | The sync scripts wrote nothing: `.cursor` is a symlink to the router and the three generated prompt stubs point at the router without copying its text. All seven sync scripts then reported `PASS` in sync |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The command surfaces came from the `sk-create-command` mode: its `SKILL.md`, `ROUTER.md`, `references/router-presentation-split.md` and its three templates were read first, and `/create:command` was walked step by step (`scratch/t016-authoring-log.md`). The workflow follows the `doctor-ci-scaffold.yaml` shape: `mutation_boundaries` with an invariant, a plan phase, one approval, statuses `OK`, `CANCELLED` and `FAIL`.

The contract was extended before the bridges, so the deriver saw a finished manifest. `derive-command-bridges.cjs` then ran once, the drift guard and the accuracy ratchet confirmed nothing moved, and the advisor dist was rebuilt so phrase reach scored the new bridges.

The manual run walked the documented commands on a scratch skills root and recorded every command and its output in `scratch/t014-convert-run.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Model the workflow on `doctor-ci-scaffold.yaml` | That route already asks once and creates only after yes, so the doctor family keeps one approval shape |
| `default_target: true` on `check`, not on `convert` | Adding a second target makes the command multi-target, and a bare `/doctor:sk-skill` must keep reaching the read-only route. The route validator and the bridge deriver both refuse the flag on a mutating route |
| Activate both sk-skill bridges, not only convert | A multi-target command is bridged per target, so the single-target `command-doctor-sk-skill` id no longer exists. Activating only convert would leave `check` unreachable from the advisor |
| Keep the trim and the allowed-tools proposal as workflow questions, with their own yes | The converter refuses an over-budget description and a missing `allowed-tools` with a named code, and neither may be fixed by defaulting a value. Making each its own question keeps the engine the authority and keeps a permission grant off the operator's behalf |
| Assert each refusal reason against the converter's own source | A test that read only the workflow would pass on wording the engine never prints, so the reason and the code are both checked against `sk-skill-convert.cjs` and its transforms library |
| Leave the plain-skill conversion to the parallel path | The workflow names the follow-ups for both input shapes, but the plain-skill classification itself belongs to that path and lands through the same `plan` and `apply` calls |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0, `OK: route-validate — 20 routes validated, 3 warnings` |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | Exit 0, `[run-all] 7 suite(s) passed, 0 failed` |
| `node --test .skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` | Exit 0, 25 tests, 25 pass |
| `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | Exit 0, `STATUS=OK phrases=130 bridges=24`, both sk-skill bridges reached |
| `node .../command-bridges/derive-command-bridges.cjs --check` | Exit 0, `"status": "fresh"`, `"changed": []` |
| `vitest run tests/command-bridges-drift-guard.vitest.ts` | Exit 0, 5 tests pass |
| `vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | Exit 0, 7 tests pass |
| The seven mirror sync scripts with `--check` | Exit 0 each, every mirror tree in sync |
| JSON Schema check of `command-contract.json` | Exit 0, `schema errors = 0` |
| `validate_document.py .skilled/commands/doctor/sk-skill.md --type command` | Exit 0, `Total issues: 0` |
| Manual plan, no, yes and undo run | `scratch/t014-convert-run.md`, with the refusals and the two field follow-ups |
| Spec folder validation | `validate.sh --strict` run at close |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The scratch skill is two files.** Its post-conversion check still reports the rows a real skill package satisfies: the section shape, the root metadata files, the runtime copies, the changelog and a name collision with another fixture. The conversion itself ends `STATUS=OK` and names those rows as the next step, which is the behavior the workflow promises.
2. **The scratch skills live in the dispatcher's scratch root, not in this packet's `scratch/`.** The converter only converts a direct child of the skills root it is given, so a scratch skills root outside the repository is what the run needs. The transcript records every command so a reader can repeat it.
3. **The plain-skill input kind is not exercised here.** It belongs to the parallel conversion path and reaches the workflow through the same `plan` and `apply` calls.
4. **README and changelog are untouched.** The docs phase owns them.
<!-- /ANCHOR:limitations -->
