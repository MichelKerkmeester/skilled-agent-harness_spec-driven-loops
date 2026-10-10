---
title: "Implementation Summary"
description: "Restraint requests reach the sk-code quality mode, and check 5k fails on sk-code when its aliases, description keywords or canary routes drift from the router vocabulary."
trigger_phrases:
  - "restraint routing implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/001-restraint-routing"
    last_updated_at: "2026-10-10T06:56:29Z"
    last_updated_by: "orchestrator"
    recent_action: "Built restraint routing and the vocabulary-parity check; orchestrator reran all six criteria"
    next_safe_action: "Commit this child, then build the review-contract and agent-disclosure children"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-restraint-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-restraint-routing |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Requests that ask for restraint now reach the sk-code quality mode. Before this change, the phrase `this module is over-engineered, apply yagni and find the simplest solution` returned `defer` from the compiled router. It now resolves to one `sk-code-quality` route. The doctor also gained check 5k, which fails on sk-code when its registry aliases, description keywords or canary routes drift away from the router vocabulary.

### Phase 1: restraint-routing

The sk-code hub gained a `quality-restraint` vocabulary class. Only the `sk-code-quality` signal references it, so no other mode's routes change. The quality mode gained the aliases `yagni`, `simplest solution` and `over-engineering check`. The description gained four keywords, and the section 2 CODE_QUALITY row of ROUTER.md names the same words. The canary fixture gained one single-mode case, and the compiled manifest was re-minted by the refresh command.

Check 5k has three legs. The alias leg requires each registry alias to be a keyword of the classes its routerSignal lists. The packet leg requires each mode packet name to be a description keyword. The canary leg requires each routerSignals mode to be the expected route of a case in the hub's canary fixture. Hubs that already carry drift (mcp-tooling, sk-design, sk-doc and system-deep-loop) report it as warnings on the listed legs. Every other drift fails.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/hub-router.json` | Modified | Adds the `quality-restraint` class and references it from the `sk-code-quality` signal |
| `.skilled/skills/sk-code/mode-registry.json` | Modified | Adds three aliases to the `sk-code-quality` mode |
| `.skilled/skills/sk-code/description.json` | Modified | Adds four restraint keywords |
| `.skilled/skills/sk-code/ROUTER.md` | Modified | Names restraint and simplification in the section 2 CODE_QUALITY row |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modified | Adds the single-mode restraint canary case, 11 cases in all |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modified | Byte copy of the canary fixture, the authored source |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Regenerated | Re-minted by the refresh command, reported fresh |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Modified | Byte copy of the manifest |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modified | Check 5k, its warn-only table, and one call in main() |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modified | Clean fixture shape, two FAILING rows, and tests for the canary leg and the warn-only severity |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-command-column.test.cjs` | Modified | Fixture data only: demo vocabulary and packet keywords for check 5k |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs` | Modified | Fixture data only: the same vocabulary and packet keywords |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-root-router.test.cjs` | Modified | Fixture data only: the same vocabulary and packet keywords |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change was built in the `092-sk-code-ponytail-refinement` worktree. Nothing is committed or pushed. Each task in tasks.md records its command and output in an evidence line, and the before and after captures sit in this folder's scratch directory. The manifest was re-minted once, after the last sk-code edit of this change, and both authored copies match their promoted files byte for byte. Other builders' edits in the same worktree are not part of this change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The restraint vocabulary lives in its own class, referenced only by the quality signal | Other modes keep their routes, so only restraint requests move. |
| `over-engineering check` is a class keyword as well as an alias | Leg (a) matches each alias against the class keywords, so the alias must also be a keyword. |
| The warn-only table is keyed by hub and leg, not by item | The parent goal allows warnings for drift that already exists, and a per-item list would go stale as aliases change. |
| The canary fixture is found by folder name | Every hub follows the same naming rule, so no per-hub mapping is needed. |
| No SKILL.md edit, no version bump, no changelog | The release version lives in SKILL.md, which this change does not edit. The orchestrator decides any release. |
| The test fixtures use the real vocabulary shape and register their vocabulary | Check 5k flags demo hubs that lack it. No assertion changed. The three sibling suites received the data edit the coordinator approved. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| C1: compiled route for the canary prompt | PASS: prints `true`, exit 0 |
| C2: canary assertion | PASS: prints `cases 11 failures 0`, exit 0 |
| C3: invariants suite, then the checker on sk-code | PASS: `ℹ fail 0`, three `PASS: 5k-` lines, `OK: parent-skill-check`, exit 0 |
| C4: seven hubs exit 0 | PASS: all seven exit 0. Warnings: mcp-tooling 4, sk-design 16, sk-doc 19, system-deep-loop 4, the other three 0 |
| C5: compiled guard and drift guards | PASS: sk-code reported `fresh`, `run-all-drift-guards: all 3 guards PASSED`, exit 0 |
| C6: validate.sh --strict on this folder | PASS: `Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0, after the repair-derived step |

Also run: the four parent-skill-check suites each report `ℹ fail 0`, and the advisor vitest golden passes 7 of 7.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Restraint aliases also catch non-code phrases.** The phrases `find the simplest solution for my tax return`, `run an over-engineering check on my holiday packing list` and `my yagni budget for groceries` each route to `sk-code-quality`. The aliases were not narrowed, because narrowing needs an explicit yes.
2. **Stage one still returns no hub for the yagni phrase.** The sk-code graph does not list description.json as a source, so the new keywords do not reach the advisor. The graph was not regenerated here, and the advisor output is identical before and after.
3. **Existing drift stays and warns.** Check 5k reports 14 sk-design, 3 sk-doc, 4 mcp-tooling and 4 system-deep-loop items as warnings. These are listed in plan.md section 3 and were not repaired.
<!-- /ANCHOR:limitations -->

---
