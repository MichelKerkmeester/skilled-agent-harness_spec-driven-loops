# Iteration 005 — Drift consolidation, measured-results visibility, and top-finding verification

- **Focus:** Axis 7. Mirror drift, metadata-vs-code cross-checks, whether the measured with-and-without results are visible to a reader, and objective re-verification of every finding from iterations 1–4.
- **Read first:** no `steer.md` exists in this lineage (checked at iteration start, absent).
- **Method:** `diff -rq` across the runtime mirror; metadata/version cross-checks; read the hub-routing reports and the two measurement docs plus the packet records that hold the live results; re-ran the objective checks behind F-001…F-007.

## Findings

### F-008 — Hub changelog and version metadata do not reflect the 2026-10-03 injection-screen improvements present in shipped files (axis 7, P2)

The hub's injection-screen files carry the improvements recorded by packet `049-jev-feature-improvement-build/004-injection-screen-improvements`: two calls with a third on disagreement, the 0.60 flag line, the opt-in `--reworded-arm`, the trust package and the corpus check. The hub `benchmark/injection-screen/README.md:41-67` describes exactly this behavior, and the packet records the live re-measure on 2026-10-03: "`verdict jev: keep K=90 M=90 A=82 B=68 W=19 L=5 TP=30 FP=3 F=1 p=0.003305`, brier 0.0670, natural recall 0.600, planted 0.900" (`049-…/004-injection-screen-improvements/implementation-summary.md:3,62-64,93-94`).

The hub's release surfaces do not mention it: the newest changelog is `v0.7.0.0` (the cli-deem removal, pointing at packet `046-deem-deprecation/003-cli-deem-mode-removal`), there is no later entry, `description.json:25` still says `"lastUpdated": "2026-10-02T10:45:00Z"`, and `graph-metadata.json:111` says `"last_updated_at": "2026-10-02T12:00:00Z"` — both a day before the changes now present in the files.

- **Confirmed by:** reading the 049 packet's own record of the hub-file changes and live run, then comparing against the hub changelog list, `description.json`, and `graph-metadata.json`.
- **Impact:** a reader of the hub's release history cannot tell when the current injection-screen behavior shipped, and the hub-doctor metadata advertises a last-updated date earlier than the code it describes. If this is pending-release state, one changelog entry plus a metadata refresh closes it.

### F-009 — The packet summary that records the hub's live result misstates the review band (axis 5, P2; spec-packet doc, hub README is correct)

`049-…/004-injection-screen-improvements/implementation-summary.md:56` says "a review-band question on rows in the 0.25 to 0.75 band". The code's review call fires only when the primary mean is `>= REVIEW_AT && < FLAG_AT` — 0.25 to 0.60 (`score-injection-screen.mjs:1387`), with `FLAG_AT = 0.6`, `REVIEW_AT = 0.25`, `BLOCK_AT = 0.75` (`:65-67`). The hub README states the band correctly ("between the 0.25 review line and the 0.60 flag line", `benchmark/injection-screen/README.md:51`).

- **Confirmed by:** reading the review-call condition and the three constants, then the README and summary lines side by side.
- **Impact:** the record of the hub's measured result overstates the review band's upper bound (0.75 is the block line). The hub's own docs are correct; fix the summary line.

## Verified clean (evidence recorded)

- **No mirror drift.** `diff -rq .claude/skills/cli-classifier .skilled/skills/cli-classifier` reports zero differences across the entire tree (exit 0) — the runtime mirror is a byte-identical copy, including the F-001 line and the F-003 files.
- **Measured results are visible for pi-transport.** `pi-transport-integration.md:109-111` quotes the adopted verdict and names the recorded run; the cited file exists (`specs/cli-jev/003-…/037-pi-native-classifier-transport/scratch/live-run.stdout.txt`) and its verdict line matches the quote exactly. The comparison doc documents the keep rule (`pi-transport-comparison.md:38`).
- **Hub-routing results are visible with before/after.** The 2026-09-26 report gives the verdict (3 PASS), the with-and-without delta ("Before the vocabulary change … the six phrasings answered `action: defer`", §5), out-of-domain replays, and an honest known false positive (`use jev` matching `use jevons`, mitigated at stage one). The hub benchmark README documents the dated-folder convention, so the older reports' `--hub cli-jev` command is a historical record, not a stale instruction; current playbook scenarios all use `--hub cli-classifier` (migration documented at `changelog/v0.4.0.0.md:26`).
- **Compiled route and activation record agree.** The live front door's `effectivePolicyHash` matches the activation manifest exactly (iteration 4).
- **Top findings re-verified from the final state:** F-001 (`SKILL.md:114`, "opt-in" present); F-002/F-004 (`score-clarify-default.cjs`: 0 `transport:` fields, 3 `backend: 'jev'` literals); F-003 (all five files exit 1 with `--blocking-only`); F-005 (46 tests vs "41 cases"); F-006 (fixture, 1 entry); F-007 (0 install lines in hub README/SKILL).

## Ruled-out directions

- Reporting the older benchmark reports' `--hub cli-jev` command as stale — dated run records under an explicit "stay as written" convention; the migration is documented.
- Reporting the injection-screen measurement doc's lack of a results section as drift for the hub — the result is recorded in the packet summary; F-008 captures the actual metadata lag. (The measurement docs describe method by design, matching their sibling docs.)

## Key-question progress

- Q5 (axis 7): addressed; F-008. All seven axes now have findings or explicit clean lines.
- Q1 (axes 1+5): F-001…F-005, F-009.
- Q2: verified clean + F-005. Q3: F-006. Q4: F-007.

## Next focus

Phase synthesis — compile `research.md` with every finding ranked, the per-axis coverage, the convergence report, and the resource map.
