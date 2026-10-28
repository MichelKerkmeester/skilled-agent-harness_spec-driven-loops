---
title: "Implementation Summary"
description: "The CI report, toggle and scaffold now read each repository's conventions from .sk-code/ci.json, so a foreign repository reads clean, and this repository's committed profile keeps today's output while the toggle gains ruleset refusals and the second named confirmation."
trigger_phrases:
  - "ci repo profile implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/007-ci-repo-profile"
    last_updated_at: "2026-10-28T05:30:00Z"
    last_updated_by: "fixer"
    recent_action: "Fixed the two review P2s: the unread-ruleset plan line and the --profile route flag"
    next_safe_action: "Conductor adds the child to the parent phase table, reviews and commits"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/lib/ci-profile.cjs"
      - ".skilled/commands/doctor/scripts/ci-report.cjs"
      - ".skilled/commands/doctor/scripts/ci-toggle.cjs"
      - ".skilled/commands/doctor/scripts/ci-scaffold.cjs"
      - ".sk-code/ci.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ci-repo-profile-implementer"
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
| **Spec Folder** | 007-ci-repo-profile |
| **Status** | Complete |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:ci` now works in a repository that is not this one. A fixture with `ACME_CI` switches reads its real switch state with no false flag, the toggle accepts `ACME_CI_TESTS` and refuses the variable behind the required check, and the scaffold prints none of this repository's names. Here the report JSON is unchanged apart from a `profile` key, the templates render byte for byte, and switching off `SKILLED_CI_FRESHNESS` or `SKILLED_CI_REPORTS` now asks the second named confirmation `sk-code-ci/SKILL.md:91` promised.

### CI repository profile for sk-code-ci and doctor ci

`lib/ci-profile.cjs` reads `--profile`, then the file-scoped `skcode.ciProfile`, then `.sk-code/ci.json`, then a default that forces nothing, with the quality config's strict unknown-key rejection. The report detects switches by the `vars.X != 'off'` shape and takes the branch, the required switch, the exemptions, the README and the trailer from the profile. The toggle planner reads the required contexts from the live ruleset, maps each to the jobs whose name it is and refuses every variable their `if:` reads, and keeps `neverOff` and the README sentence as further sources. The renderer fills slots that sit in YAML comments or plain scalars, so the quality gate still parses both templates.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/lib/ci-profile.cjs` | Created | Profile discovery, validation and normalization |
| `.skilled/commands/doctor/scripts/ci-report.cjs` | Modified | Switch shape, profile-driven checks, `profile` field, exports |
| `.skilled/commands/doctor/scripts/ci-toggle.cjs` | Created | Toggle planner |
| `.skilled/commands/doctor/scripts/ci-scaffold.cjs` | Created | Template renderer and `--protected` |
| `.skilled/commands/doctor/scripts/tests/ci-profile.test.cjs`, `ci-toggle.test.cjs`, `ci-scaffold.test.cjs` | Created | New suites |
| `.skilled/commands/doctor/scripts/tests/ci-report.test.cjs`, `doctor-ci-contract.test.cjs` | Modified | Profile cases and the committed-profile contract |
| `.sk-code/ci.json` | Created | This repository's Skilled profile |
| `.skilled/skills/sk-code/sk-code-ci/assets/ci-profile.template.json` | Created | Profile template |
| `.skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml`, `job-block-template.yml` | Modified | Profile slots |
| `.skilled/commands/doctor/assets/doctor-ci-report.yaml`, `doctor-ci-scaffold.yaml`, `doctor-ci-toggle.yaml`, `doctor-ci-presentation.txt`, `ci.md`, `_routes.yaml` | Modified | Routes read the profile and run the scripts |
| `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md`, `trigger-and-filter-rules.md`, `job-shape-rules.md`, `protected-set.md` | Modified | Universal guidance and the profile doc |
| `.skilled/skills/sk-code/leaf-manifest.json` | Modified | Regenerated for the new asset |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`, `README.md` | Modified | Toggle rows |
| `.skilled/commands/doctor/scripts/README.markdown`, `tests/README.markdown` | Modified | Script and suite rows |
| `.skilled/skills/sk-code/sk-code-ci/changelog/v1.1.5.0.md`, `.skilled/skills/sk-doc/sk-create-command/changelog/v1.0.6.0.md` | Created | Changelog entries. The sk-code-ci entry is 1.1.5.0 because origin/main already holds a 1.1.4.0 entry from a sibling lane |
| Both `SKILL.md` files and their `.hermes/` copies | Modified | Version carriers and Hermes sync |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The report JSON and both templates were saved before any edit. Each script landed with its suite, and every suite was then run against a scratch copy of the HEAD doctor folder to show 29 cases fail there. The HEAD report and the new one ran back to back against live gh to compare JSON, and the toggle ran read-only against the live ruleset. The doctor suite runner, gate-inputs, the trigger-index vitest, route validation, the hub check and the quality gate closed it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The toggle plans and the route runs the gh command | Every refusal is testable in code, and the contract test keeps the route's "Run exactly the printed gh variable command" wording |
| `neverOff` always applies, not only when the ruleset is unreadable | The brief says the ruleset falls back to `neverOff`; applying it always is stricter and is still what remains when gh cannot read the ruleset |
| Template directives live in YAML comments and plain scalars | The quality gate parses changed YAML at P0, and a `{{ }}` slot made both templates fail it |
| A wrap width per comment block | Today's templates wrap at different widths, and the only way to print them byte for byte is to state each width in the template |
| No profile means no required switch and no README check | "Forces nothing" leaves a foreign repository with the parser checks only |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Five CI suites, HEAD copy | `tests 62 pass 33 fail 29`, exit 1 |
| Five CI suites, worktree | `tests 62 pass 62 fail 0`, exit 0 |
| `ci-report.test.cjs` plus `doctor-ci-contract.test.cjs` | 36 of 36, up from the 26 of 26 baseline |
| Report JSON, HEAD and new, live and `--no-gh` | equal apart from `profile` |
| Templates rendered with this repository's profile | byte for byte equal to HEAD |
| `run-all.sh` | `7 suite(s) passed, 0 failed`, exit 0 |
| `check-gate-inputs.sh .` | `RESULT: PASSED` |
| `trigger-index-rebuild-workflow.vitest.ts` | `60 passed, 1 skipped` |
| `route-validate.sh` | `OK`, 18 routes, 2 warnings that predate this change |
| `parent-skill-check.cjs .skilled/skills/sk-code` | all hard invariants passed |
| `quality-gate.cjs --files`, 19 files | `NO_BLOCKER_FOUND`, 0 findings |
| Changelog validation, Hermes `--check` | 0 issues on both entries, 67 copies in sync |
| Review fix: unread ruleset line, `ci-toggle.test.cjs` new case | exit 1 against a copy with the old renderer, exit 0 now; the suite prints `tests 12 pass 12 fail 0` |
| Review fix: `--profile=<path>` on the routes, `doctor-ci-contract.test.cjs` new case | exit 1 before the route edits, exit 0 now; the suite prints `tests 15 pass 15 fail 0` |
| `run-all.sh` after the review fixes | `node:test (27 files)` 518 of 518, `7 suite(s) passed, 0 failed`, exit 0 |
| `route-validate.sh` after the review fixes | `OK`, 18 routes, 3 warnings: the two older ones and an informational H1 note that `--profile` sits on all three `/doctor:ci` targets |
| Runtime mirror checks for `ci.md` | runtime mirrors, Codex, Pi and Hermes prompt checks all PASS; the mirrors are symlinks or pointer stubs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The parent phase table does not list this child yet.** The brief forbids editing the parent's `spec.md` and `graph-metadata.json`, so the conductor adds the row and `children_ids` entry.
2. **The `/doctor:ci` argument hint is now a summary.** Adding `--profile=<path>` put the full flag list over the 140-character hint budget, so the hint reads `[report|scaffold|toggle] [flags] | list | ?` and the execution targets table lists every flag.
3. **Playbooks, feature catalogs and the sk-code-ci README still describe the six names only.** The docs-alignment lane owns them.
4. **A required context is matched to a job by its name.** A matrix job whose name holds an expression does not match, so its context shows in `requiredChecks` but refuses no variable; `neverOff` covers such a switch.
<!-- /ANCHOR:limitations -->

---
