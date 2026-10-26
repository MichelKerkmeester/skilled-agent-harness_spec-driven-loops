# Review: phase 017, measured behavior and Draft metadata auto-repair

Fresh read-only review of the working-tree diff. Paths: `S` = `.skilled/skills/system-spec-kit`.

## Checks run

| Check | Result |
|---|---|
| `npx vitest run --config vitest.config.ts --project cli tests/measured-behavior-rule.vitest.ts` | 1 file, 7 of 7 passed |
| `npx vitest run --config vitest.config.ts --project cli tests/draft-auto-repair.vitest.ts` | 1 file, 11 of 11 passed (34.8 s) |
| `... tests/validator-registry-doc-count.vitest.ts tests/validate-help-lists-every-rule.vitest.ts` | 2 files, 3 of 3 passed |
| `bash S/runtime/cli/spec/check-card-sync.sh` | `CARD SYNC OK`, rc 0 |
| `node S/runtime/cli/hermes/sync-skills-hermes.cjs --check` | `PASS: 67 Hermes skill copies in sync` |
| `rg -n '41-rule registry' S` | no output |
| `rg -uu -l` for a `spec-core ... \| v2.4`-or-later stamp in any `spec.md` | no match; 4,898 spec-core-stamped `spec.md` files, all below v2.4 |
| Probe: temp root linked to this tree, Draft packet with a stale `graph-metadata.json`, `repair-derived.cjs --folder <p>` (dry run, no `--apply`) | `inspected=1 repairable=0`, `PACKET CHANGED BY DRY RUN` |
| Same probe with `SPECKIT_DRAFT_AUTO_REPAIR=0` | `To apply these repairs: ...`, dry rc 1, `PACKET UNCHANGED` |

## Write-path risk

`validate.sh` used to be read-only. It now rewrites `description.json`, `graph-metadata.json`, frontmatter packet pointers and the Spec Folder row when a packet is a Draft and its only errors are derived-metadata rules. Each guard you asked about:

- **Never from `validateFolder`: holds.** The spawn sits only in `runDraftAutoRepair` (`S/runtime/lib/validation/orchestrator.ts:1619-1662`), called from the `isMainModule` block (`:1676`). `validateFolder` (`:1320-1387`) has no write. The library test (`draft-auto-repair.vitest.ts:285-295`) hashes the packet and finds it unchanged.
- **Cannot loop: holds, depth is bounded.** Validate spawns repair with `[DRAFT_AUTO_REPAIR_SWITCH]: '0'` (`orchestrator.ts:1636`), `repair-derived.cjs` passes its environment on to its inner `validate.sh` (`CHILD` at `repair-derived.cjs:58` sets no `env`), and the count preload asserts exactly one repair start. A repair started any other way is a different problem, covered in F1.
- **CI and the switch: hold.** `orchestrator.ts:1569-1573`. `0`, `false` and `off` (any case) and any non-empty `CI` refuse. Tested at `:227-255` and `:299-308`.
- **A mixed content error refuses: holds for the rules that ran.** `orchestrator.ts:1575-1576`. One gap: under `SPECKIT_RULES` the check sees only a subset (F4).
- **Non-Draft statuses refuse: holds.** `specStatusIsDraft` (`orchestrator.ts:773-787`) needs exactly `draft`. Tested by `refuses on the status alone` (`:299-308`).
- **Repo-root detection cannot pick a wrong root: holds.** `findRepairRoot` (`orchestrator.ts:1538-1554`) takes the nearest ancestor that holds both tools and has the packet strictly inside its `specs` or `.opencode/specs`. A worktree nested inside the main checkout resolves to the worktree. A packet outside any spec root returns null, so the repair is refused. `report.folder` is already absolute (`orchestrator.ts:1321`).
- **`--json` and `--quiet` stay parseable: holds.** The notice goes to stderr in both modes (`orchestrator.ts:1623`), and the child's output is captured, not inherited. Tested at `:203-225`.
- **Hooks and gates that run validate and then diff the tree: partly broken (F1, F2).** The global pre-commit `gate:spec-remint` (`~/.config/git/hooks/pre-commit:711-858`) still works: its `repair-derived --apply` now triggers a nested auto-repair inside its inner validate, and the hook then finds and stages the JSON pair by `git diff`. The CI workflows run with `CI` set by the runner, which I inferred and did not run. The breakage is in tools that promise not to write and call `validate.sh` without the switch.

## Findings

### F1 [P1] A `repair-derived.cjs` dry run now writes, then reports nothing to repair

- `S/runtime/cli/spec/repair-derived.cjs:16-18`: "Dry by default; --apply writes. Everything --apply will write is named by the dry run first, so the report is a faithful preview"
- `repair-derived.cjs:171`: `run('bash', [VALIDATE, folder, '--strict', '--json', '--no-recursive'], CHILD)`, where `CHILD` (`:58`) does not turn the switch off
- `S/runtime/lib/validation/orchestrator.ts:1502`: the hint every failed run prints: "Optional: run it without --apply first to preview the changes."

`repairFolder` validates before it checks `apply`. On a Draft packet with only derived errors, the inner `validate.sh` auto-repairs and returns a passing report. The dry run has then already written `graph-metadata.json`, and it prints `repairable=0`. The probe above confirms this: with the switch unset the dry run changed the packet, and with `SPECKIT_DRAFT_AUTO_REPAIR=0` the packet stayed the same. The test author worked around this in `draft-auto-repair.vitest.ts:157` by setting the switch for the direct repair call. That is the same fix, applied only in the test.

Fix at the source: set `SPECKIT_DRAFT_AUTO_REPAIR: '0'` in `repair-derived.cjs`'s `CHILD` options. As the repair tool, it should never trigger a second repair.

### F2 [P1] Read-only sweeps that shell out to `validate.sh` now write into every qualifying Draft packet

The spec keeps only library callers of `validateFolder` read-only (spec.md Out of Scope). These shell callers run without the switch:

- `S/runtime/cli/spec/upgrade-legacy.mjs:17`: "Dry by default; --apply writes." The first `validateAll` (`:1679`) runs on dry runs too, with `VALIDATE_CHILD` (`:82`) passing the inherited environment. Under `--apply`, it also runs before `prepareManifest` (`:1705`), whose own comment (`:644`) says "Write the before-images before any packet repair can change their contents." The reversibility manifest therefore records the already-repaired state. With up to 24 workers (`:78`), each repair also starts its own validate and backfill.
- `S/runtime/cli/spec/quality-audit.sh:126`: `output=$(bash "$validate_script" "$folder" --json --quiet 2>/dev/null)`. An audit across the whole repository rewrites every qualifying Draft packet. It also discards stderr, so the "rewrote ..." notices that make the write visible are lost.
- `S/runtime/cli/sweep/strict-pass-freshness.ts:279-283`: `env: process.env`. A local run reports the result after the repair, not the state of the tree as it was. Inside CI the guard holds.

This is inferred from the code and was not run, but it follows the same mechanism F1 confirmed. Fix: these three pass `SPECKIT_DRAFT_AUTO_REPAIR=0` in their child environment. The alternative is to make the switch default off for any caller that is not interactive.

### F3 [P1] The Level 2 example's Measured Behavior contradicts its own Problem Statement

- `S/templates/examples/level-2/spec.md:42`: "The application currently has no user authentication"
- `S/templates/examples/level-2/spec.md:58`: "This `HTTP/1.1 200 OK` line is what the spec quotes as measured behavior: REQ-002 and SC-001 both rest on this status."

The other three examples measure a `404` for the missing route. This one shows a successful login before the feature exists, then claims the requirements rest on it. A weak model that copies examples learns the misquote this block exists to prevent. Fix: make it match the other levels (`404`, no login route).

### F4 [P2] `SPECKIT_RULES` narrows what "every error is derived" can see

`orchestrator.ts:1575-1576` judges only the entries that ran. Running `SPECKIT_RULES=GENERATED_METADATA_DRIFT validate.sh <draft>` on a packet with content errors outside the subset still auto-repairs. Non-strict runs skip the `strict_only` rules in the same way. The repair still writes only derived metadata, so the impact is low, but REQ-005's "any error outside the derived-metadata set" refusal does not hold in that case. Fix: refuse when `SPECKIT_RULES` is set.

### F5 [P2] Docs say "never body text", but the repair rewrites the Spec Folder row

- `S/runtime/ENV-REFERENCE.md:207` and `S/references/validation/validation-rules.md:847`: "... and frontmatter packet pointers, never body text."
- In contrast, `orchestrator.ts:1498-1499` and the card (`spec-authoring-card.md:145`) say "frontmatter packet pointers and the Spec Folder row". `repair-derived.cjs:399-404` writes that row in the summary file's body.

Card section 9 (`spec-authoring-card.md:147`) also leaves out the `CI` exception and the condition that every error is derived. Minor: the `validate.sh` help text says "0 turns off" while the code also accepts `false` and `off`.

### F6 [P2] Untested edge paths of the write path

spec.md Edge Cases names "Repair fails or exits 2: the original report and the existing repair hint print unchanged, and the exit code is the original one" and the recursive phase-parent case. Neither has a test. `draft-auto-repair.vitest.ts` covers neither a failing repair child nor a `--recursive` run. The code path (`orchestrator.ts:1649-1653`) looks right on reading.

## Rule checks (MEASURED_BEHAVIOR)

- **Warn only: holds.** The script never sets `fail` (`check-measured-behavior.sh:94-136`), the registry severity is `warn` (`validator-registry.json:244`), and `mapShellRuleStatus` (`orchestrator.ts:298-309`) maps `warn` to `warn`. `passed` counts errors only (`orchestrator.ts:1385`), so `--strict` does not fail on it. The one exception is shared by every shell rule: if the script crashes or prints nothing parseable, the bridge records `error` (`orchestrator.ts:379-386`). With `set -euo pipefail`, that needs an unreadable `spec.md` to happen.
- **spec-core v2.4+ only: holds.** The stamp is parsed from the first 70 lines and the source must start with `spec-core`. Numeric compare is tested for v2.3, v2.10, v3.0, another source and a spec with no stamp.
- **Cannot warn on an existing packet: holds.** No `spec.md` in the tree carries a spec-core stamp at v2.4 or later. The four examples carry v2.2 stamps (`templates/examples/level-*/spec.md:15`), so the rule never judges them. New scaffolds will warn until the block is filled, which is intended (SC-001; the probe's fresh scaffold printed `MEASURED_BEHAVIOR` as a warning with `RESULT: PASSED`).

Blockers: none

## Re-review 2026-10-26

Fresh read-only re-review of the shared tree. `S` = `.skilled/skills/system-spec-kit`.

First-review status: F1 fixed (`S/runtime/cli/spec/repair-derived.cjs` `VALIDATE_CHILD` sets `SPECKIT_DRAFT_AUTO_REPAIR: '0'` and `validate()` uses it; the dry-run case in `S/runtime/cli/tests/draft-auto-repair.vitest.ts:450-451` passes). F2 fixed (`upgrade-legacy.mjs` `VALIDATE_CHILD`, `quality-audit.sh:128`, `sweep/strict-pass-freshness.ts:284` and `progressive-validate.sh:40` all set the switch to 0). F3 fixed (`S/templates/examples/level-2/spec.md` measures `HTTP/1.1 404 Not Found`). F4 fixed (`S/runtime/lib/validation/orchestrator.ts` `draftAutoRepairRefusal` returns `rule-subset` for any non-empty `SPECKIT_RULES` and `not-strict` without `--strict`; tested at `draft-auto-repair.vitest.ts:360`). F5 fixed (`S/runtime/ENV-REFERENCE.md:207` and `S/references/validation/validation-rules.md:847` no longer say "never body text"; `validate.sh` help names `0`, `false` and `off`; card `:147` names `CI` and the subset). F6 fixed (`draft-auto-repair.vitest.ts:375` failing child, `:402` recursive parent).

Checks rerun: `measured-behavior-rule.vitest.ts` 7 passed, `draft-auto-repair.vitest.ts` 15 passed, `CARD SYNC OK`, `EXAMPLE_DRIFT_OK`. Registry holds 42 rules (23 authored-template, 13 operational-runtime, 6 structural), `MEASURED_BEHAVIOR` at `warn`. `check-measured-behavior.sh:94-136` never sets `fail` and `:28-51` applies only to a `spec-core` stamp at v2.4 or later. Every refusal is in code and tested: switch off, `CI`, rule subset, not strict, not Draft, mixed content error, library call. Template stamps are v2.4 on spec, plan, tasks, implementation-summary and acceptance-criteria, matching `S/templates/spec-kit-docs.json:5-16`. No ephemeral label in any added code comment. `S/changelog/v2.12.0.0.md:52-58` matches the code.

Findings:

1. P2 `implementation-summary.md:151` (Known Limitation 4) says `ARCHITECTURE.md` line 185 still states 41 rules, but `S/ARCHITECTURE.md:185` now says 42 rules (23, 13 and 6), which matches the registry, and the Files Changed table omits it. Fix: drop the limitation and add `ARCHITECTURE.md` to Files Changed and the phase changelog.
2. P2 `tasks.md:178` (CHK-030) says no case hashes the parent folder, but `draft-auto-repair.vitest.ts:427-443` reads every top-level file of the phase parent before the Draft child's repair and asserts each is unchanged after it. Fix: tick CHK-030 with that evidence, or narrow the check to a parent of a standalone packet and add that case.
3. P2 `S/SKILL.md:483` says "Tools that run the validator as a child set it to `0`", but `S/runtime/cli/setup/check-prerequisites.sh:138-143` runs `validate.sh --strict` without the switch, so it can repair a Draft packet. That caller is an explicit validate request, so the write may be intended. Fix: name the read-only tools as `v2.12.0.0.md:58` does, or set the switch there too.
4. P2 `goal.md:83` still reads `Stamp taken | Pending` while all stamps ship at v2.4 (T002 open at `tasks.md:39`). Fix: record v2.4 and say the 015 and 016 commit precondition was waived because the three phases share one tree.
5. P2 this section adds a second `Blockers: none` line, so the T026 verify at `tasks.md:79`, which expects one line, now prints two. Fix: reword T026 to "prints at least one line" or cite this section.

Blockers: none

## Fix check 2026-10-26

A fresh checker read the tree after the fixer's pass.

1. P2 ARCHITECTURE limitation: fixed. No limitation mentions 41 rules; `implementation-summary.md:77` lists `ARCHITECTURE.md`, and the phase changelog names it at lines 33 and 57. `ARCHITECTURE.md:185` says 42 rules (23/13/6).
2. P2 CHK-030: fixed. Ticked at `tasks.md:178`, citing `draft-auto-repair.vitest.ts:402`, whose lines 427-443 read every top-level parent file before the repair and assert each unchanged after. It compares text, not hashes; the check's wording still says "hashes", which is a wording nit only.
3. P2 SKILL.md tool claim: fixed. `SKILL.md:483` and the Hermes copy at line 488 name the five read-only tools; each of `repair-derived.cjs`, `upgrade-legacy.mjs`, `quality-audit.sh`, `progressive-validate.sh` and `strict-pass-freshness.ts` references `SPECKIT_DRAFT_AUTO_REPAIR`. `check-prerequisites.sh` is no longer covered by the claim.
4. P2 Stamp taken: fixed. `goal.md:83` reads v2.4 and records the waived commit-first precondition; T002 stays honestly open (`tasks.md:39`).
5. P2 T026 verify: fixed. `tasks.md:79` says "prints at least one line" and cites lines 82 and 100.

Strict validation of this phase with `SPECKIT_DRAFT_AUTO_REPAIR=0`: Errors 0, Warnings 0, RESULT: PASSED, exit 0.

Blockers: none
