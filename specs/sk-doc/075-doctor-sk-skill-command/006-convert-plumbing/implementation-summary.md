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
    last_updated_at: "2026-10-30T12:20:00Z"
    last_updated_by: "implementer"
    recent_action: "Aligned the workflow with the engine's current interface and re-verified every gate"
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

You type `/doctor:sk-skill convert <name-or-path>`. The route resolves and the converter plans: you read the numbered steps, the backup folder, the integration rows it will run and the follow-up items the router template left behind. When the plan names a value the engine cannot write without an approval, you get one question for it, with its own yes: a plain skill's intent phrases are shown from the engine's own suggestion and must end as at least eight distinct phrases of three or more words, a description over the budget is trimmed to the text the engine proposed, and `allowed-tools` is offered as the list the plan printed — `Bash` included only when the skill ships a `scripts/` folder — which you may edit. A no at any question ends the run `STATUS=CANCELLED`, names what was declined, and writes nothing.

The workflow never edits a `SKILL.md` field itself. Each approved value becomes a flag, and the plan is rerun as `apply <target> <flags>` with no `--apply`: that documented form prints the plan, closes on the engine's own `Apply gate: no writes without --apply.` line and writes nothing, so you approve a plan that already carries each approved value as its own line. For a plain skill the workflow agent reshapes the prose into `--agent-output` while `preserve --snapshot` proves every original body line survived before the format gate, and all three of its temporary files — the agent output, the snapshot and the staging copy — live under one scratch root at `.skilled/skills/.state/doctor-sk-skill/<name>/scratch/`, which is deleted on cancel and after a finished run. A preservation failure stops the run with nothing written.

Then one question covers the conversion, against that plan. On yes the engine backs the pre-write files up, stages or rewrites the skill folder, runs the format gates and then the integration rows, the workflow re-reads the converted root — `.skilled/skills/<name>`, never the outside source a plain skill came from — through the check engine, and the result prints the undo block the engine printed, quoted whole: one `cp` or `cp -R` from the backup per overwritten file, one `rm` or `rm -r` per created path, then its `Check:` line. The advisor graph is rebuilt by the run's own scan rather than backed up, so the operator rescans it after an undo. `--dry-run` prints the plan — or, when the first plan refused with a follow-up message, that message as the pending follow-up — and ends `STATUS=OK` without asking anything.

A refused target stops at the plan and never touches the folder: a dual declaration, a hub or half hub declaration, nested `SKILL.md` packets, a `local-` or `agent-` prefixed name, a name collision, a path that is neither a direct child of `.skilled/skills` nor a plain skill, and an `ROUTER.md` the conversion would not own. Each prints the converter's own reason with its machine code and ends `STATUS=FAIL`. A plain skill's missing intent phrases, a description over budget and a missing `allowed-tools` are not refusals: they are the three questions above. An exit 1 from the apply that arrives with an `Undo:` block is an integration row failure with the conversion kept, and it is reported that way rather than as a failed conversion.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml` | Created | The eight-phase workflow in the engine's order: read, plan, follow-ups, approval, write, re-read, undo, report, with the engine's write set as its mutation boundary and a reason for every code it can print |
| `.skilled/commands/doctor/_routes.yaml` | Modified | The `convert` route with `mutating: mutates`, its five script invocations (plan, plan rerun, preserve, apply, re-read), `scratch_dir` among its setup vars, the engine's real write set as its gate-3 location and six trigger phrases; `default_target: true` on `check` |
| `.skilled/commands/doctor/sk-skill.md` | Modified | Both targets in the execution table, the per-target flags, the widened hint, the ask-once rule for a convert name, the bare-command default and the step list in the engine's order |
| `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt` | Modified | The dual menu, the conversion plan and its questions, the refusal table matched to the derived codes, and the converted, unchanged, cancelled, dry-run and failed results |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modified | The convert row in the doctor target list, with one yes per write and the engine's undo block |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | The convert execution target, owned asset, loader requirements, alias, widened hint and destructive operation in `families.doctor` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modified | Both sk-skill bridges activated in the TypeScript and Python lists |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json`, `runtime/lib/scorer/projection.ts`, `runtime/lib/render.ts`, `runtime/scripts/skill_advisor.py` | Regenerated | Written by `derive-command-bridges.cjs`, never by hand |
| `.skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` | Modified | Both routes, both workflows, the plan-before-question order, the four flags the rerun and the apply both carry, the cancelled wording at each question site, and every refusal code derived from the converter's own source |
| `.cursor/commands/doctor-sk-skill.md`, `.codex/prompts/doctor-sk-skill.md`, `.pi/prompts/doctor-sk-skill.md`, `.hermes/prompts/doctor-sk-skill.md` | Unchanged | The sync scripts wrote nothing: `.cursor` is a symlink to the router and the three generated prompt stubs point at the router without copying its text. All seven sync scripts then reported `PASS` in sync |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The command surfaces came from the `sk-create-command` mode: its `SKILL.md`, `ROUTER.md`, `references/router-presentation-split.md` and its three templates were read first, and `/create:command` was walked step by step (`scratch/t016-authoring-log.md`). The workflow follows the `doctor-ci-scaffold.yaml` shape: `mutation_boundaries` with an invariant, a plan phase before any question, one yes per write, and the statuses `OK`, `CANCELLED` and `FAIL`.

The contract was extended before the bridges, so the deriver saw a finished manifest. `derive-command-bridges.cjs` then ran once, the drift guard and the accuracy ratchet confirmed nothing moved, and the advisor dist was rebuilt so phrase reach scored the new bridges.

The manual run walked the documented commands twice: first on a scratch skills root (`scratch/t014-convert-run.md`), then, after the engine grew the plain-skill path and its flags, on a temporary repository built for the purpose (`scratch/t018-alignment-run.md`). Both transcripts record every command and its output.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Model the workflow on `doctor-ci-scaffold.yaml` | That route already asks once and creates only after yes, so the doctor family keeps one approval shape |
| `default_target: true` on `check`, not on `convert` | Adding a second target makes the command multi-target, and a bare `/doctor:sk-skill` must keep reaching the read-only route. The route validator and the bridge deriver both refuse the flag on a mutating route |
| Activate both sk-skill bridges, not only convert | A multi-target command is bridged per target, so the single-target `command-doctor-sk-skill` id no longer exists. Activating only convert would leave `check` unreachable from the advisor |
| Keep the phrase, trim and allowed-tools proposals as questions with their own yes, written only by the engine | The converter refuses a plain skill below eight approved phrases, an over-budget description and a missing `allowed-tools` with named codes, and none may be fixed by defaulting a value. Each is asked on its own, the plan is rerun with the approved flag so the operator sees the value as a plan line, and the engine writes it beside the same backup. The workflow never edits a field by hand |
| Print the engine's undo block instead of composing one | A composed undo named a `ROUTER.md` delete even when the run created no router, and left out the files the integration rows overwrite. The engine's block names one `cp` or `cp -R` from the backup per overwritten file, one `rm` or `rm -r` per created path and the check that proves the result, so quoting it is the only way the operator can trust it |
| Run the plain-skill prose step through `--agent-output` and `preserve --snapshot` | A plain skill is staged as a new root, so the prose has to survive the move. The agent writes prose only, the engine keeps the source frontmatter, and `preserve --snapshot` fails the run before the format gate when a body line would be lost |
| Derive the refusal codes from the engine source instead of listing them | Two engine changes in a row left the hand-written list quoting wording the converter no longer prints. A derived list fails the moment a code stops matching the presentation, which is what the reviews caught |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0, `OK: route-validate — 20 routes validated, 3 warnings` |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | Exit 0, `[run-all] 7 suite(s) passed, 0 failed` |
| `node --test .skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` | Exit 0, 33 tests, 33 pass |
| `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | Exit 0, `STATUS=OK phrases=130 bridges=24`, both sk-skill bridges reached |
| `node .../command-bridges/derive-command-bridges.cjs --check` | Exit 0, `"status": "fresh"`, `"changed": []` |
| `vitest run tests/command-bridges-drift-guard.vitest.ts` | Exit 0, 5 tests pass |
| `vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | Exit 0, 7 tests pass |
| The seven mirror sync scripts with `--check` | Exit 0 each, every mirror tree in sync |
| JSON Schema check of `command-contract.json` | Exit 0, `schema errors = 0` |
| `validate_document.py .skilled/commands/doctor/sk-skill.md --type command` | Exit 0, `Total issues: 0` |
| Manual plan, no, yes and undo run | `scratch/t018-alignment-run.md`: the plain skill's plan refusal with its suggested phrases, the phrase and allowed-tools reruns, `STATUS=CANCELLED` on no with an unchanged tree hash, `STATUS=OK` on yes with the engine's undo block, the re-read at the converted root, and the older Skilled trim run with its one `cp` |
| Spec folder validation | `validate.sh --strict` run at close |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The scratch skill is two files.** Its post-write check still reports rows a real skill package satisfies: `C6` (derived content validation) and `C10` (the changelog index link). `C10` is a vantage artifact the run proves: the fixture's own `.skilled/changelog/brindle-lantern` resolves to the converted `changelog/`, while the check answers its repo-relative rows against this worktree, where that link does not exist. `C6` is reported as printed and was not chased. The conversion itself ends `STATUS=OK` and names those rows as the next step, which is the behavior the workflow promises.
2. **The scratch repository lives under `os.tmpdir()`.** The converter needs a repository shape and must not write into this checkout, so the harness builds one, drives it, and deletes it; `scratch/t018-alignment-run.md` records every command and its output.
3. **The questions are asserted, not exercised by a model.** The wording, the order and the cancelled status are asserted by the contract test; the scratch run drives the same calls with the harness answering. A model-driven run adds no coverage the transcript does not already hold.
4. **README and changelog are untouched.** The docs phase owns them.
<!-- /ANCHOR:limitations -->
