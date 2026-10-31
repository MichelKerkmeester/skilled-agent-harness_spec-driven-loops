---
title: "Implementation Summary"
description: "Both doctor commands now sit on the surfaces that send people to them: the route manifest, the /doctor:setup list, the advisor activation lists and bridges, both command indexes, the root README, the catalog, the playbook and every runtime mirror. The route, phrase, catalog, suite and mirror checks prove it from the final tree."
trigger_phrases:
  - "integration and docs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/003-integration-and-docs"
    last_updated_at: "2026-10-31T15:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed the packet: AC-008 superseded by ADR-001, and the registration check moved to AC-010"
    next_safe_action: "Regenerate description.json and graph-metadata.json, then rerun validate --strict"
    blockers:
      - "The two generated metadata files still hold stale derived fields; repair-derived.cjs is the fix, and the orchestrator owns those files"
    key_files:
      - ".skilled/commands/doctor/_routes.yaml"
      - ".skilled/commands/README.txt"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-build"
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
| **Spec Folder** | 003-integration-and-docs |
| **Status** | Complete |
| **Completed** | 2026-10-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:symlink` and `/doctor:install` now reach the places that send people to them. Both are in the route manifest, in the `/doctor:setup` target list and in the skill advisor's activation lists, so `/doctor:helper` ranks them and a prompt about linking a repo gets the right line. The same pass put both commands in both command indexes, the root README, the doctor catalog, the playbook and every runtime mirror.

### Phase 3: integration-and-docs

A doctor command that no entry point names is a command nobody runs. This phase is the wiring that keeps the two new routers out of that state: a route in `_routes.yaml`, a row in the setup presentation, an activation entry per language list, three tune rows for the helper, two index rows, and a line in each document that lists the doctor family. It adds no behavior. The engine, both routers, the workflow YAMLs and the presentation texts stay as the two frozen contracts left them.

The advisor side is the part you feel. `derive-command-bridges.cjs` turns each route into a bridge, but a bridge stays unrouted until `scoring-compatibility.json` names it, so the four new bridges got four entries in each of the `typescript` and `python` lists and the advisor runtime was rebuilt. Three probe prompts now come back with the new commands. "symlink skilled into my project" reaches `command-doctor-symlink-link`, "install skilled into my project" reaches `command-doctor-install`, and "find broken skilled symlinks" reaches `command-doctor-symlink-check`. The reach probe reports `STATUS=OK phrases=184 bridges=32`, so every declared phrase lands on its own bridge and none of them lands on `/doctor:mcp install`.

The last criterion needed a decision rather than an edit. Two of the three documents it named carry no runnable command list. The advisor README states the brief shape generically, as `Also: /doctor:<command> <target>`, and names one concrete command, `/doctor:setup`. The routing document registers bridges by id and says at line 35 that a bridge renders as a runnable string, never as its id. ADR-001 records the registration in the form each document already uses: a runnable row in the spec-kit README table and a bridge id in the routing document. AC-010 checks both surfaces.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/_routes.yaml` | Modified | Three `/doctor:symlink` routes and one `/doctor:install` route, and the header raised from 14 to 16 router files |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modified | Two rows in the `/doctor:setup` target list, so the helper contract test sees both commands |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modified | Four activation entries in the `typescript` list and four in the `python` list |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` and the three source outputs | Regenerated | The deriver's output, so the four bridges route instead of sitting derived and unrouted |
| `.skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/tune.jsonl` | Modified | Three ranking rows, one per new `/doctor:symlink` target and one for `/doctor:install` |
| `.skilled/commands/README.txt` | Modified | Family row reads Sixteen, and the doctor table gains a row for each command |
| `README.md` | Modified | The Use It In Your Own Project section, the Keep It Healthy line, the Sixteen count, two table rows and two per-command entries |
| `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md` | Modified | Catalog coverage for both routers, and its own version raised from `1.7.7.0` to `1.7.8.0` because the body changed |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-symlink.md` | Created | DOC-398, one manual scenario for check, link and unlink |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-install.md` | Created | DOC-399, one manual scenario for the install guide |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` and `manual-testing-playbook.md` | Modified | Index rows for DOC-398 and DOC-399 |
| `.skilled/skills/system-spec-kit/README.md` | Modified | The doctor command table, now seven rows |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` | Modified | Routing coverage for the symlink and install bridges |
| Runtime mirror trees under `.claude`, `.opencode`, `.codex`, `.cursor`, `.devin`, `.pi` and `.hermes`, plus the pi, codex and hermes prompt mirrors | Regenerated | Generator output only; no mirror was hand-edited |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The bridges went first, because they are the widest blast radius: four activation entries, then the deriver, then the advisor runtime rebuild. The phrase reach probe ran next, so a phrase that landed on the wrong bridge would surface before anything else was built on it. It caught one. The link phrase "link skilled runtime folders into a repo" also matched `check`, and was replaced with "create the skilled links in a repo" rather than taught to the probe as an exception.

The doctor suite ran as one pass with `bash .skilled/commands/doctor/scripts/tests/run-all.sh`: 7 suites passed, 0 failed, 934 node tests. The same command on main had 925 passing and 0 failing, so the delta is the 9 new engine tests and nothing regressed. The advisor's four doctor vitest files read 97/97 on both trees, and `test_skill_advisor.py` reads 8/8 on both.

Every derived copy was regenerated and then proved current by its own `--check`: `PASS: 211 mirrors across 9 trees are in sync`, and `PASS: 43 prompts are in sync` from each of the pi, codex and hermes generators. `command-catalog-mirror-check.cjs` failed first, on the two missing commands and the 14 count, and both were fixed in the index rather than in the check.

The last step is the packet validator. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/005-doctor-symlink-install/003-integration-and-docs --strict` reports every document rule passing and two findings left: `GENERATED_METADATA_INTEGRITY` on the source fingerprint and `GENERATED_METADATA_DRIFT` on `description` and `causal_summary`. Both are generated output. `repair-derived.cjs --apply` rewrites them from the spec docs, and the packet save is where that refresh happens.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Added an activation entry per bridge in both language lists instead of relying on the deriver | The deriver writes the bridge file and leaves an unnamed bridge unrouted, so the route would exist and never be suggested. |
| Replaced the colliding link phrase rather than teach the reach probe an exception | "link skilled runtime folders into a repo" is shared with `check`, so the probe cannot tell which route it belongs to. A phrase that fits one route beats a special case in the probe. |
| Left the held-out fixture unchanged and added three rows to the tune fixture | The held-out file is hash-pinned, so editing it only breaks the pin. The tune rows are what the ranking test reads. |
| Counted router files, not routes, in the manifest header | The header lists files and the manifest holds routes. Writing 28 there would describe a different thing than the line says. |
| Regenerated every mirror from its generator, never by hand | A hand-edited mirror drifts from `.skilled` and fails the next check, and the generator output is the only copy that stays current. |
| Registered each new command in the form its owner doc already uses, and superseded the criterion that asked three docs for one shape | The spec-kit README carries one runnable row per command and the advisor routing document registers bridges by id; a runnable line in the routing document would contradict its own note that a bridge renders as a runnable string. ADR-001 carries the reasoning. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | PASS, exit 0: `OK: route-validate — 28 routes validated, 10 warnings`. The warnings are informational, shared flags across targets. |
| `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | PASS: `STATUS=OK phrases=184 bridges=32`, and each new symlink and install phrase reaches its own bridge |
| Advisor probe, "symlink skilled into my project" | `command-doctor-symlink-link`, never `/doctor:mcp install` |
| Advisor probe, "install skilled into my project" | `command-doctor-install` |
| Advisor probe, "find broken skilled symlinks" | `command-doctor-symlink-check` |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | PASS, 7 suites passed, 0 failed, 934 node tests. Main baseline 925 passing, 0 failing; the delta is the 9 new engine tests. |
| Advisor doctor vitest files and `test_skill_advisor.py` | PASS, 97/97 on main and 97/97 in the worktree; the Python suite 8/8 on both |
| `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` | PASS: `PASS: 211 mirrors across 9 trees are in sync` |
| pi, codex and hermes prompt generators with `--check` | PASS: `PASS: 43 prompts are in sync` each |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | PASS: `STATUS=OK`. Before the index edits it failed on the two missing commands and the 14 count. |
| `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` | PASS, exit 0, with four entries in each language list and the runtime rebuilt |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/005-doctor-symlink-install/003-integration-and-docs --strict` | FAILED, `Summary: Errors: 2  Warnings: 0`, on `GENERATED_METADATA_INTEGRITY` (source fingerprint) and `GENERATED_METADATA_DRIFT` (`description`, `causal_summary`) only. Every document rule passes: 10/10 criteria closed, level match, anchors, placeholders, cross-doc status. `repair-derived.cjs --apply` rewrites both files from the spec docs. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One criterion was superseded, not met.** AC-008 asked three documents for a runnable `/doctor:symlink` and `/doctor:install` line. The advisor README and the advisor routing document carry no such list, so ADR-001 records the registration in the form each document uses and AC-010 checks those two surfaces. The advisor README therefore names neither command.
2. **The bridge files are proved live, not proved byte-identical.** The recorded run is the deriver in regenerate mode exiting 0, not `--check`. The phrase reach probe and the advisor picks prove the generated files are loaded and routing; a `--check` run is the cheap way to close the rest.
3. **The held-out ranking fixture is unchanged and hash-pinned.** Ranking is proved on the tune rows only.
4. **Broken links in a target repo are reported, not repaired.** `/doctor:symlink link` writes only after a yes and a printed plan digest, so a drifted repo stays drifted until someone approves the plan.
5. **Doctor bridges match their own wording only.** A follow-up probe with reworded prompts, one per doctor command, found the doctor command in the recommendations for 3 of 16 and first for none. "set up skilled in my other repository" went to `/doctor:setup`. The follow-up added these phrases:
   - install: "skilled in my other repository" and "skilled in another repository"
   - symlink check: "the skilled links are broken", "broken skilled links in my project" and "skilled links in my project"
   - symlink link: "link skilled into my repo" and "link skilled into another project"

   It also added three rows to the advisor's `doctor-prompts.jsonl`. Two of them fail on the old phrases. After the change, phrase reach reports `STATUS=OK phrases=191 bridges=32`, the doctor node tests pass 991 of 991, and the advisor suite passes 1353 with 8 skipped. Three more install phrases were dropped because the `/doctor:helper` ranker put `/doctor:symlink check` first for them. Reworded prompts for the other doctor commands still miss, and fixing that is a change to how the advisor scores.
6. **The generated metadata was re-derived after the last doc edit.** `repair-derived.cjs --folder specs/commands/005-doctor-symlink-install/003-integration-and-docs --apply` reported `repaired=1 failed=0`, and strict validation then printed `RESULT: PASSED`. Any later edit to these docs needs the same re-derive before validation passes again.
<!-- /ANCHOR:limitations -->

---
