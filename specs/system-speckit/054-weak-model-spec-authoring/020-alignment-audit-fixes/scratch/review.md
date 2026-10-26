# Verifier verdicts and residual outcomes

Each lane ran four passes: a lead that dispatched the literal fixes through cli-pi (DeepSeek V4.1 Flash 1017, thinking max), a Sonnet judgment pass, a fresh verifier that re-checked every finding and re-audited its share of `audit/scope2.txt`, and a residual pass. The verifiers edited no file. The text below records their verdicts and what happened to each residual.

## Lane A: code

**Verdict:** PASS. A1, A3, A4, A5, A6, A7 and A8 are fixed as their fix text asks. A1, the P0, is confirmed: the AST import check exits 0. Targeted checks: 117/117 across 7 CLI vitest files, `validation-gate-hardening` 10/10, `repair-hint-order` 2/2, `fanout-root-resource-map` 4/4. `shellcheck` and `bash -n` clean, `EXAMPLE_DRIFT_OK`, CLI and runtime dist fresh. A4 kept every FAIL line: a three-failure fixture printed the same three lines and exit 1 before and after strict mode.

| Residual | Severity | Outcome |
|----------|----------|---------|
| A2, the scope gap | P1 | Closed by re-audit. Each lane verifier re-audited its share of the `scope2.txt` delta |
| R-A1, stale trigger index | P2 | Fixed: regenerated, then regenerated again at close after the new release note; `--check` prints `trigger index matches the corpus` |
| R-A1-timing | P2 | Handled at close: the final regeneration ran after every lane finished |

Left as instructed: the TypeScript stamp parses (`carriesTokenGateStamp`, `carriesClauseCutStamp`) stay separate code with the same semantics.

## Lane B: skill docs, catalog and playbook

**Verdict:** PASS for B-01 to B-14. The skill package gate prints `package_skill.py --check: PASS (exit 0)`, the Hermes check `PASS: 67`, the catalog validator `PASS tier=fail violations=0`, and the playbook validator `PASS ... scenarios=112 violations=0 warnings=9` (all 9 warnings predate this phase, in files no lane touched). Scenarios 485 and 486 were run verbatim and match their Expected text.

| Residual | Severity | Outcome |
|----------|----------|---------|
| B-09-carry, `v2.3` lines 3, 12, 24 and 29 in scenario 476 | P2 | Fixed: `v2.3-or-later` on 3, 12 and 24, `v2.4 stamp` on 29 |
| RB-01, a packet path in `spec-folder-authoring-checklist.md` | P2 | Fixed: points at `templates/examples/level-1/` |
| RB-02, `a v2.3 doc` meaning v2.3 or later in five places | P2 | Fixed in all five, root and leaf descriptions kept identical |
| RB-03, `goal.md` missing from the MIGRATION.md add-on list | P2 | Fixed |
| RB-04, `templates/packet-types/` missing in `examples/README.md` | P2 | Fixed |

## Lane C: READMEs and changelogs

**Verdict:** PASS WITH RESIDUALS. All 16 lane findings (C-01 to C-17, with C-15 covered by B-12 on the same line) are fixed on disk. Strict validate of the 054 packet printed `RESULT: PASSED`.

| Residual | Severity | Outcome |
|----------|----------|---------|
| C-03-r1, root changelog misstated phase 018's REAL verdicts | P2 | Fixed |
| C-06-r1, a semicolon the literal fix added | P2 | Fixed |
| RA-01, `v2.9.0.0.md` description over 250 characters | P2 | Fixed: 222 characters |
| RA-02, `a phased packet of Level 3 phases` in `v2.9.0.0.md` | P2 | Fixed: `a phased packet` |
| RA-03, a narrative-length glance bullet in `v2.9.0.0.md` | P2 | Fixed |
| RA-04, a version number in a `v2.9.3.0.md` trigger phrase | P2 | Fixed |
| RA-05, check housekeeping in `v2.9.3.0.md` | P2 | Fixed |
| RA-06, `nested-changelog.md` named files the generator never reads | P2 | Fixed, Oxford comma removed |

## Lane D: routing, agents, commands and the critic's findings

**Verdict:** Partially verified. D-F1, D-F2, D-F3, D-F4, X1, X2 and X3 are fixed on disk and their checks pass, but D-F4 left the committed `skill-graph.json` stale, so `skill-graph-freshness.cjs --strict` exited 1 (R1, P1). The leaf check that hung in the audit runs in seconds with `--skill`: `OK [S] system-spec-kit, checked=1 passed=1`.

| Residual | Severity | Outcome |
|----------|----------|---------|
| R1, compiled `skill-graph.json` stale after D-F4 | P1 | Fixed: `skill_graph_compiler.py --export-json`; freshness now prints `SIGNAL DRIFT compiled vs disk: none`, rc 0 |
| R2, the speckit command docs promise guard-script runs the workflow YAML only declares | P2 | **Fixed by the conductor.** The conductor wired `guard_command` (with a non-blocking `guard_on_fail`) into all nine `post_write_validation` gates: 2 in `speckit-plan.yaml`, 2 in `speckit-implement.yaml`, 5 in `speckit-complete.yaml`. All three files parse, `check-contract-drift.cjs` prints `OK commands=3`, `route-validate.sh` exits 0 and `yaml-intake-event-payloads.vitest.ts` passes 7/7 |
| R3, `Level template contract` names no real file | P2 | Fixed in both sources and regenerated into the codex, pi and hermes copies |
| D-F4 probe 2, `repair derived metadata after editing docs` | P2 | Open, operator call: sk-doc 0.8681 first, system-spec-kit 0.8622 second (it was absent before) |
| X3, hours in the level-3 and level-3+ example `plan.md` critical path | P2 | Left on purpose: the core `plan.md.tmpl` keeps a critical path with durations |

## Close gates

The conductor bumped system-spec-kit to 2.12.1.0 with a compact release note, regenerated the Hermes copy and the trigger index, and ran the CLI check gate, the guards, the mirror checks and a recursive strict validate of 054 with the repair switched off (21 of 21 `RESULT: PASSED`).

| Item | Outcome |
|------|---------|
| Em dashes already in edited files | Open: 75 files hit a literal full-file scan, all text that predates this phase or CLI run transcripts. No added line in the tracked diff holds one |
| The phase changelog for this phase in `../changelog/` | Not written: this closeout writes only inside the phase folder |
