---
title: "Implementation Summary"
description: "A read-only --into-hub option on /doctor:sk-skill check that fills the eleven mode-integration surfaces for a skill headed into a hub, proved against a shipped hub, two fixture hubs and a clean tree."
trigger_phrases:
  - "hub gap report implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/008-hub-gap-report"
    last_updated_at: "2026-10-30T10:12:00Z"
    last_updated_by: "claude-opus-worker"
    recent_action: "Fixed the review findings and re-ran every gate green"
    next_safe_action: "Start phase 009, or add the option to command-contract.json when a phase owns that file"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/sk-skill-check.cjs"
      - ".skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs"
      - ".skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-285-doctor-hub-gap-report"
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
| **Spec Folder** | 008-hub-gap-report |
| **Status** | Complete |
| **Completed** | 2026-10-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:sk-skill check <skill> --into-hub <hub>` now prints the eleven surfaces a skill or mode has to land on before it is integrated into that hub. Each row is `PASS`, `FINDING`, `UNKNOWN` or `N/A` and carries the command it ran or the file it read, so the operator can repeat any verdict. The report writes nothing: no mode is registered, no hub file is edited, and the hub routes exactly as it did.

Ten rows come from probes that already exist. Rows H1 to H3 and H9 fold in `parent-skill-check.cjs`'s invariant lines and the hub's own registry, router and manifest reads; H2 also replays a natural request for the mode through `compiled-route.cjs`. H4 and H5 read the stage-two `ROUTER.md` map and its optional `FULL_INVENTORY` block. H6, H7 and H8 read `graph-metadata.json`, the hub `SKILL.md` mode table and `description.json`. H10 runs the Python scorer for a non-`metadata` mode and prints `N/A` for a `metadata` one, which is why a `metadata` hub needs no Python at all. H11 runs the three command-mirror checkers once.

Two rows print `N/A` on purpose: `H5` when the hub defines no `FULL_INVENTORY`, and `H10` for a `metadata`-routed mode. A checker that cannot run prints `UNKNOWN` and the report exits 2, never a pass, so an unfinished table can never read as a green hub.

### Phase 8: hub-gap-report

| Row | Surface | Probe |
|-----|---------|-------|
| H1 | Packet registration | `parent-skill-check.cjs` 3-family lines plus the registry entry |
| H2 | Stage-one signals | `routerSignals` entry, 5b line, `compiled-route.cjs` replay |
| H3 | Stage-one tie-break | `parent-skill-check.cjs` 5e and 5i lines |
| H4 | Stage-two intent | `ROUTER.md` `INTENT_SIGNALS` and `RESOURCE_MAP` key parity, plus the mode's packet leaves |
| H5 | Stage-two inventory | `ROUTER.md` `FULL_INVENTORY`, `N/A` when the hub declares none |
| H6 | Advisor vocabulary | `graph-metadata.json` `intent_signals` and derived trigger phrases |
| H7 | Human-facing contract | Hub `SKILL.md` mode table |
| H8 | Doctor metadata | `description.json` keywords and description |
| H9 | Leaf manifest | `leaf-manifest.json` mode entry plus the 10-family lines |
| H10 | Projection maps and scorer | `skill_advisor.py` for a non-`metadata` mode, `N/A` for a `metadata` one |
| H11 | Command mirrors | `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check`, `pi/sync-prompts-pi.cjs --check` |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/sk-skill-check.cjs` | Updated | `--into-hub <hub>` parsing, the eleven-row report, text and JSON rendering |
| `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` | Updated | Hub resolution, the `parent-skill-check` and child-process probes, and the stage-two, vocabulary, table, description and advisor row probes |
| `.skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` | Updated | Twenty-two hub-gap cases: fixtures, shipped hub, exit 75, mirror drift, argument handling, rows that pass by absence, shared-packet mode identity |
| `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-check/hubs/hub-gap/` | Created | Invented hub whose second mode carries no `routerSignals` |
| `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-check/hubs/hub-inventory/` | Created | Invented hub with a `FULL_INVENTORY` block and a lexical mode |
| `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-check/hubs/hub-shared-packet/` | Created | Invented hub whose two registered modes share one packet |
| `.skilled/commands/doctor/_routes.yaml` | Updated | `--into-hub <hub>` in the check route's `allowed_flags` and `into_hub` in `setup_vars` |
| `.skilled/commands/doctor/assets/doctor-sk-skill-check.yaml` | Updated | `into_hub` input, the hub-report steps, the extra upstream checkers and the report's output lines |
| `.skilled/commands/doctor/sk-skill.md` | Updated | The flag in mode routing, the argument table and the workflow summary |
| `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt` | Updated | Argument failure wording, the Hub Gap Report template with its gate footer, the JSON fields and five troubleshooting rows |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The report reuses the doctor family's existing checkers instead of adding new ones. `parent-skill-check.cjs` stays the authority for rows H1, H2, H3 and H9, and the report parses its `PASS`/`FAIL`/`WARN`/`INFO` lines by invariant id rather than trusting one exit code. The compiled route, the advisor scorer and the three mirror checkers are each spawned once per run.

The command surfaces changed through sk-doc's router/presentation split: the router routes and names the flag, the presentation owns the table and the footer wording, and the workflow YAML owns the behavior. `route-validate.sh` confirms the flag is declared, the workflow runs the engine, and the route stays read-only.

The proof is deliberately two-sided. The fixture hubs answer the mode-membership rows from their own JSON, with `parent-skill-check` stubbed, so a missing `routerSignals` is a real read of the fixture rather than a canned line. One case goes further: it copies a fixture hub, deletes its `hub-router.json`, runs the real `parent-skill-check.cjs` and asserts the rows that fold in its verdict. The shipped-hub case runs every real child process against `cli-classifier`, so a row can only pass if its probe actually answered.

### Review Fix Round

A review of the report found one P0, two P1 and seven P2 defects. The P0 was the one the report exists to prevent, one level up: a row whose checker stopped early passed because no failure line was printed. H2 and H3 now treat `5a` as their own failure, and every row backed by `parent-skill-check.cjs` requires its confirming PASS line, so an unfinished checker run surfaces as `UNKNOWN` and exit 2 rather than as green. The P1 items were a forged stage-two hit from `FULL_INVENTORY` and a mode reported as the other mode that shares its packet; the report now reads the registry's `workflowMode` for the subject and excludes the full-toolkit intent from a mode's own intent list. The P2 items tightened the vocabulary match to whole tokens, scoped the mode table to its mode-axis header and compared the stated mode and packet counts with the registry's distinct counts, restricted projection hits to `entry.skill`, made the text output print every unverified entry and `Result: INCOMPLETE`, accepted `--into-hub=<hub>`, and named the value form in the workflow step and the router.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Kept the router frontmatter `argument-hint` unchanged | `command-contract.json` pins the exact string and `doctor-sk-skill-contract.test.cjs` asserts the hint is contained in it. That contract file is outside this phase's file list, so the flag is documented in the router's argument table and the presentation instead. Whoever next owns the contract should extend both together |
| With no skill named, the rows describe the hub's own surfaces | The 11-row table stays meaningful without inventing a fleet report: H1 to H3 and H9 then assert the hub's own registry, router and manifest parity, and H10 prints `N/A` because no mode is scoped |
| A registered mode may be named by its `workflowMode` | Deep-loop's modes are `research`, `review` and `ai-council` but their packet folders are `deep-research` and so on, so resolution falls back to the hub registry before it reports `SKILL_NOT_FOUND` |
| Rows for a skill the hub does not register print `N/A`, not `PASS` | Stage two, `FULL_INVENTORY`, the advisor vocabulary and the manifest only carry registered modes. Reporting them as present for an unregistered skill would be the exact false green this report exists to stop |
| An unverified checker outranks a finding with exit 2 | Exit 2 says the table is unfinished, never that the hub failed. A finding plus an unreachable checker must not read as a complete report |
| Row 11 is the repository's mirror parity, not a per-command lookup | No shipped mode declares a command today, and the canon names the three checkers as the row's gate. A per-command mirror probe would be untested code for a case no hub carries |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` | Exit 0, `tests 53 / pass 53 / fail 0` |
| `node --test .skilled/commands/doctor/scripts/tests/doctor-sk-skill-contract.test.cjs` | Exit 0, `tests 14 / pass 14 / fail 0` |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0, `OK: route-validate — 19 routes validated, 3 warnings` |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | Exit 0, `[run-all] 7 suite(s) passed, 0 failed` |
| `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check` | Exit 0, `PASS: 39 prompts are in sync` |
| `node --check` on both changed scripts | Both exit 0 |
| `node .skilled/commands/doctor/scripts/sk-skill-check.cjs check cli-jev --into-hub cli-classifier` | Exit 0, 11 rows, `9 pass, 0 finding(s), 0 unknown, 2 n/a`, `Result: PASS` |
| The same run with `--json` | Exit 0, `mode: "hub"`, rows H1 to H11, `exitCode: 0` |
| `… check sk-create-command --into-hub sk-doc` | Exit 0, H5 `PASS` from `FULL_INVENTORY`, `10 pass, 1 n/a` |
| `… check sk-create-skill-parent --into-hub sk-doc --json` | Exit 0, `skill: "sk-create-skill-parent"`, H1 `Registered as sk-create-skill-parent`, H2 `routerSignals covers sk-create-skill-parent`, H4 intents `SKILL_CREATION, PARENT_HUB`, `10 pass, 1 n/a` |
| `… check sk-create-skill-parent --into-hub=sk-doc` | Exit 0, the same eleven rows from the inline form |
| `… check review --into-hub system-deep-loop` | Exit 0, H10 `PASS` from the live advisor scorer, `10 pass, 1 n/a` |
| Every mode of every shipped hub through `--into-hub` | 42 of 42 report `0 finding(s), 0 unknown`, exit 0, and name the requested mode |
| The fixture hub missing `routerSignals` | `H2 FINDING` with `routerSignals has no entry for fixture-gap-mute`, exit 1 |
| The copied hub with `hub-router.json` deleted, real `parent-skill-check.cjs` | `H2` and `H3` `FINDING` with `FAIL: 5a: hub-router.json is missing`, `unverified` empty, exit 1 |
| `git status --porcelain` before and after a live run | 14 entries each, `diff` prints nothing |
| `/opt/homebrew/bin/python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/commands/doctor/sk-skill.md --type command` | `VALID`, `Total issues: 0`, exit 0 |
| `validate.sh` on the phase folder, `--strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The frontmatter `argument-hint` does not show the flag.** `command-contract.json` carries `[check] [<name-or-path>] [--json] (sk-skill)` and the contract test asserts the router hint is contained in it, so widening the hint means widening that file in the same change. The flag is in the router's argument table, the route's `allowed_flags`, the workflow input and the presentation.
2. **The invented fixture hubs cannot pass `parent-skill-check.cjs`.** They carry the routing surfaces the report reads, not the full hub contract, so most unit tests stub that one checker; one case copies `hub-gap`, deletes `hub-router.json` and runs the real checker, which is how the pass-by-absence defect stays fixed. A CLI run against the fixture hubs prints the hub-contract findings they deliberately have.
3. **No agent-runtime manual run.** This phase was delivered from a non-interactive worker, so the interactive `/doctor:sk-skill check --into-hub` render was not performed; the text renderer is asserted directly instead.
4. **Row 11 is repository-wide.** It reports the three mirror checkers' verdict for the whole command tree, so it proves the mirrors are in sync rather than that one mode's command is mirrored. No shipped mode declares a command yet.
5. **No new CI gate.** Rows H4, H5, H6, H8 and H10 stay ungated by design; promoting one to a gate is a separate change. The report and the presentation both say so.
<!-- /ANCHOR:limitations -->

---
