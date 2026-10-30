---
title: "Implementation Summary"
description: "The six integration rows I1 to I6 are built as a library with a printed plan, an apply gate and a temp-repo test suite, and the conversion plans and applies them once both format validators pass."
trigger_phrases:
  - "integration implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/005-integration"
    last_updated_at: "2026-10-30T10:45:00Z"
    last_updated_by: "code-agent-worker"
    recent_action: "Wired the rows into the conversion and met every acceptance row"
    next_safe_action: "Close the parent packet"
    blockers: []
    key_files: []
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
| **Spec Folder** | 005-integration |
| **Status** | Complete |
| **Completed** | 2026-10-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A converted skill can pass every format check and still be unreachable. This phase supplies the six writes
that close that distance, as one library with a plan, an apply gate and its own tests.

### Phase 5: integration

`lib/sk-skill-integrate.cjs` exports one function per row, `planIntegration(options)` which returns the plan
lines and the writes it would make, and `applyIntegration(options)` which runs those rows only under
`apply: true`. The plan is read-only: a printed plan costs no file. Every row records the paths it wrote,
naming a created path as `create` and an existing one as `overwrite` with a backup taken before the write,
so the caller can print an undo list that never asks version control for a state it may not hold.

| Row | What it does | How it reports |
|-----|--------------|----------------|
| I1 advisor discovery | Runs `skill_graph_scan --trusted` through the advisor CLI | Names `/doctor:skill-advisor rebuild` as the manual fallback and never runs it; exit 75 is UNKNOWN, never a pass |
| I2 compiled skill graph | Runs the compiler with `--export-json` | Names the tracked `skill-graph.json` as an overwrite before it runs |
| I3 reach and budget | Probes three approved phrases with `advisor_recommend --warm-only` | Reports each phrase's rank, and the description against the 130-character budget |
| I4 regression corpus | Proposes one case row per approved phrase | Appends to the framework corpus only for a direct child of this repository's skills root; otherwise writes the skill's own `benchmark/advisor-cases.jsonl` and prints the `--dataset` command |
| I5 runtime mirrors | Runs the Hermes sync, then `--check` | n/a when `.hermes/` is absent and no output override is set; the recorded write is `<repo>/.hermes/skills`, the folder the sync regenerates, or the resolved override; Claude, OpenCode, Pi and Devin are whole-directory links and need no write |
| I6 changelog | Creates `changelog/v<version>.md` and the relative index link | Creates only what is absent; an existing entry or link is kept and reported; a root that is not a direct child of the skills folder gets the entry and an n/a for the link, which could not resolve `../skills/<name>/changelog` |

The reach script gains an opt-in `--skill <name-or-path>` that probes one standalone root, because a
standalone skill has no hub registry for the fleet scan to list. With no flag the script builds the same
report it always did.

The conversion calls the library. `buildPlainPlan` appends `planIntegration(...).lines` to the printed plan,
and `applyPlainPlan` calls `applyIntegration({ ..., apply: true })` only after `package_skill.py --check
--strict` and `validate_skill_package.py` both pass, so a failed format gate never reaches a row. The result
prints each row's lines, the undo list removes each path the run created and copies each overwritten path back
from the backup the row took first, and a row that reports FAILED leaves the staged tree in place and makes
the run exit non-zero rather than hiding the undo commands behind a success.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/lib/sk-skill-integrate.cjs` | Created | The six rows, their plan lines, and the apply gate |
| `.skilled/commands/doctor/scripts/sk-skill-convert.cjs` | Modified | Plans the rows beside the conversion and applies them after the format gate, printing each result and recording each write for the undo list |
| `.skilled/commands/doctor/scripts/tests/sk-skill-integrate.test.cjs` | Created | 25 temp-repo cases, including the freshness, package and dataset checks against the real tools |
| `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-integrate/router-reach-fleet-report.json` | Created | The fleet report recorded from the script before `--skill` existed, so the fleet path is compared against a golden and not against the file under test |
| `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` | Modified | Spawn wrappers for the scan, compiler and Hermes sync, plus the paths they need |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` | Modified | Opt-in `--skill <name-or-path>`, usage line, and a refusal to mix it with `--hub` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Unchanged | Not needed: `benchmark/` is already an exempt subtree for path naming and the resource-doc checks read only `scripts/`, `references/` and `assets/`, so the new `.jsonl` file passes `--check --strict` with no change |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each row is a small function that builds its plan lines from what it can see, then hands back a `run` that
performs the write. `planIntegration` calls all six; `applyIntegration` refuses to run any of them unless
`apply` is exactly `true`. A failing row reports and lets the others run, because the six surfaces are
independent and the caller is the one who knows what a partial wiring means.

The rows live in this library rather than inline in `sk-skill-convert.cjs`. **This is the phase's one
deviation from the spec's file table.** The plain-skill phase owns the convert script and its test file in
parallel with this one, so an inline step would have made both phases edit the same two files. The call site
is one plan call and one apply call in `sk-skill-convert.cjs`, which is what kept the two phases apart while
keeping the rows where their tests can isolate them.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rows live in `lib/sk-skill-integrate.cjs`, not inline in the convert script | The two phases would otherwise edit the same ground in parallel; the call site is one line the conductor owns |
| `package_skill.py` was left alone | A shipped skill already carries `.jsonl` under `benchmark/` and passes strict, so a change there would have added nothing but risk |
| A missing tool or runtime directory is n/a, never created | The rows must not invent an advisor, a compiler or a Hermes tree that the repository does not have |
| The first proposed case row is P0 and the rest P1 | A dataset with no P0 row can never satisfy the harness's P0 gate, and the skill's primary phrase is the one that must route |
| The printed `--dataset` command sizes `--min-total-cases` to the file | The harness defaults to fifty cases, so a skill-local file would otherwise fail on its size rather than on its routing |
| The reach comparison uses a stand-in advisor | A live advisor answer changes between runs; a fixed answer makes the before-and-after byte comparison mean something |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests/sk-skill-integrate.test.cjs` | 25 tests, 25 pass, 0 fail, exit 0 |
| `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` | 54 tests, 54 pass, 0 fail, exit 0 |
| `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` | 51 tests, 51 pass, 0 fail, exit 0 |
| `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs` | 1 test, 1 pass, 0 fail, exit 0 |
| `node --check` on the two created and two modified scripts | exit 0 on each |
| `skill-graph-freshness.cjs --strict` over the temp repo | exit 0, `STALE COMPILED: none` |
| `package_skill.py <fixture> --check --strict` after I4 and I6 | `Result: PASS`, exit 0 |
| `skill_advisor_regression.py --dataset <fixture>/benchmark/advisor-cases.jsonl --min-total-cases 2` | `"overall_pass": true`, exit 0 |
| `cmp reach-before.txt reach-after.txt` (fleet, stand-in advisor) | exit 0, no output; 65536 bytes, identical sha256, identical verdict |
| `node REACH --skill sk-git --limit 1` (live advisor) | one row, `RESULT: PASSED`, exit 0, advisor generation 1 |
| Temp-repo convert, end state | `package_skill.py --check --strict` `Result: PASS`, `ci-skill-root-metadata.cjs --skill` exit 0, `sync-skills-hermes.cjs --check` `PASS: in sync`, `skill-graph-freshness.cjs --strict` exit 0 with `STALE COMPILED: none`, and `readlink .skilled/changelog/brindle-lantern` printing `../skills/brindle-lantern/changelog` |
| Temp-repo convert, undo list | `rm -r` for the staged root and the created folders, `rm` for the created files, and a `cp` from the backup for each overwritten target; no `git restore` line |
| `validate.sh … --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A failing row is a non-zero run, not a rollback.** The conversion keeps the staged tree and the recorded
   writes when a row reports FAILED, so the operator can re-run one surface; undoing an integration write is
   the printed undo list's job, not the runner's.
2. **The reach comparison is a one-hub-per-file mirror of the fleet.** The committed and current scripts are
   compared over the same copied routers with a stand-in advisor. A live advisory run is not reproducible, so
   it cannot be the evidence for a byte comparison.
3. **The regression harness passes only where its phrases route.** The `--dataset` proof borrows a shipped
   skill's phrases; an adopter skill's own rows route on the machine that has the skill, not here.
4. **The framework/adopter split reads one mechanism.** A skill is treated as a framework skill when the
   repository carries the framework corpus and the skill is a direct child of its skills root. An adopter who
   vendors that corpus into their own `.skilled/` tree would be read as the framework and would see an append
   where they expected nothing; no script-level signal distinguishes the two, so the split stays a documented
   mechanism rather than a guess.
<!-- /ANCHOR:limitations -->

---
