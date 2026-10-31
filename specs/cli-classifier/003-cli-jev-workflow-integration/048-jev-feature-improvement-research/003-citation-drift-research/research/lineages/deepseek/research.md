# Research: Improve, refine and expand the Jev citation drift scan (cli-jev feature 032)

**Lineage:** deepseek (cli-pi, deepseek-v4.1-flash, thinking max), 5 iterations, max-iterations stop policy.
**Session:** fanout-deepseek-1790979783604-glohfs.
**Scope:** research only; no scorer, workflow or corpus file was modified. All findings are reconstructed from existing artifacts, committed sources, and read-only replays.

---

## Executive Summary

The measured keep is real but narrower than its headline. `A=35` against `B=13` is a win over a syntactic comparator that misses every engineered row (B=0 of 20 constructed), and the published `p=2.384e-7` is dominated by that engineered half (live-only 6-0, p=0.015625) — though each half independently passes all five keep checks, so the decision itself is robust. The run's own call log replays the published column to the digit, the committed labels hash matches the report, and binary label reliability is good (kappa 0.79-1.00). Accuracy improves for free by changing the aggregation (TP 26→27-30 at FP 0-1) and by fixing the payload unit (3 of 20 live rows carry no claim for the model to judge). Cost is dominated not by Jev (41s, ~41k tokens) but by a census that reads 8,667 documents to find citations in 82. The same judgment has one large adjacent corpus (`specs/**`, 12,092 citing documents, currently deadness-only via acceptance criteria) and a resolution problem to solve first (41% of in-scope citations are ambiguous or unresolved, mostly illustrative examples). A default-on integration should be advisory and periodic, anchored to this 40-row label set as a frozen benchmark, and must widen requalification beyond provider/model.

---

## Method And Evidence Base

- Read the scorer end to end (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`, 1,398 lines at HEAD `1f7746def8`), the committed labels (`.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl`, commit `ebcc68e8edb4`), and the recorded run (`~/.skilled/.labels/runs/032-jev-20261001/report.json`, `calls.jsonl`, `032-jev.stdout.txt`).
- Replayed the run's own arithmetic from `calls.jsonl` + labels: M=40, A=35, TP=26, FP=0, F=3 — identical to the published column — and re-scored under alternative aggregations, per row kind, and per corpus.
- Reconstructed per-row payloads (sentence + window) at the labels' recorded commit, and matched the run's printed payload estimate exactly (40,717 planned input tokens).
- Read the 042 label evidence (rater drafts, id map, split table, decisions) and computed agreement and kappa directly from the committed files.
- Read the two neighboring checkers (`check-ac-coverage.sh`, `validate_catalog_package.py`) and ran per-corpus citation censuses over tracked files.

---

## Q1 — What drove the result

The verdict is the pre-registered keep rule evaluated over a sample that is 31/40 drifted (20 construction-labeled + 11 of 20 live), scored against the better of two zero-call comparators. Every letter in `verdict jev: keep K=40 M=40 A=35 B=13 W=22 L=0 TP=26 FP=0 F=3 p=2.384e-7` is defined before any call (`:82`, `:700-708`), and the column replays exactly from the recorded answers (`:1148-1175`). The three strongest drivers:

1. **Baseline weakness.** identifier-overlap only fires when the citing line's backticked tokens vanish from the ±10-line window (`:540-564`); it is right on 13/40 where flag-nothing is right on 9/40, and 0/20 on the constructed half. The 22-row margin is mostly baseline weakness.
2. **Sample construction.** 20 rows have windows moved 60+ lines down their own file, guaranteeing positive labels; the effective prevalence is 9 supports / 31 drifted, which fixes what flag-nothing and the margin can score against.
3. **Jev's actual behaviour.** Precision 26/26 = 1.00, recall 26/31 = 0.839; all five misses are false negatives, three of them threshold-adjacent (p 0.49-0.65). F=3 comes from three 2-1 rerun splits, all in the constructed half, all within 0.06 of 0.5. `p` is exactly 2^-22, the exact sign test over W/L — a superiority test, not an accuracy test.

## Q2 — Accuracy and cost levers

- **Free accuracy (same 120 recorded answers):** flag on `min(reruns) < 0.5` → TP 27, FP 0, acc 0.900. Flag on `mean < 0.6` → TP 29, FP 1, FN 2, acc 0.925 (precision 0.967, recall 0.935). `mean < 0.65` → TP 30, FP 1, acc 0.950. The keep rule's precision check tolerates roughly `TP/4` false positives, so all variants keep.
- **Payload fix:** the model receives one trimmed line as the claim (`sentence`, `:160`, `:1030`). Three of the 20 live rows are bare `**Evidence**:` pointer lines with no claim at all; one of them (live-17) is Jev's only live miss and remains missed at every threshold through 0.75. Send the enclosing paragraph/block, or exclude claim-less lines from live draws.
- **Cost:** the model arm is 121 calls, 40.9s wall (p50 326ms), ~40,717 input tokens, avg 1,357 chars/row. The census reads 8,667 tracked skill documents (one `git show` each) to find citations in 82; the draw re-reads the same tree. Recorded wall times: ~171s default, ~381s draw. Prefilter or batch the doc reads; that is the difference between a refresh and a lint.
- **Rerun strategy:** 12 of 40 rows touch [0.35, 0.65]; 26 are fully confident. A one-rerun screen with confirmation only in the band uses ~65 calls instead of 121 while preserving every vote that changed an answer. First-rerun-only scoring is worse (acc 0.850), so the reruns themselves earn their keep.
- **Qualification:** the instruction is hashed on the gate line (`:662`) and the keep rule is fixed, but requalification watches only provider/model (`:719-726`). Any prompt, window, rerun or row-set change must be treated as a new qualification.

## Q3 — Trustworthiness

- **Per-kind split:** live W=6 L=0 (p=0.015625); constructed W=16 L=0 (p=1.526e-5); pooled 2.384e-7. Re-scored per half, both live-only (A=19, B=13) and constructed-only (A=16, B=0) pass all five checks — the verdict is robust, the pooled p overstates the live evidence. Report per kind.
- **Label reliability (computed from committed drafts):** three-class agreement Luna-SWE 29/40; binary (supports vs drifted) 37/40, kappa 0.793 Luna-SWE and Luna-arbiter, 1.000 SWE-arbiter; the three binary splits (R13, R22, R33) are all documented Luna errors and the arbiter sided with SWE each time. The labels file hashes to the exact sha the report recorded.
- **Frontier coincidence:** Jev's two doubtful live answers (live-17 at 0.76-0.78, live-18 at 0.50/0.50/0.52) land on two of the three blind-rater splits (R13, R22) — model noise and label noise concentrate on the same rows.
- **Comparator blindness:** the sentence's backticked tokens still appear in 20/20 constructed (moved) windows; the comparator cannot see same-file drift.
- **Record:** replay needs `report.json` + stdout + `calls.jsonl` (which must stay outside the repo — it holds doc text). Per-row outcomes, the kind split, the instruction hash and the payload estimate belong in `report.json`; a per-row outcome file makes the run self-contained.
- **Product surface:** both dead citations found by the run are in the SANDBOXED CP-050 fixture (one range overshoots `SKILL.md` by one line); no live guidance document has a dead citation. The dead check, as a product, currently has nothing to report.
- **Tests:** no coverage for `stop (sign test)`, `stop (flips)` or disagreeing reruns; the `.state` line defect is live in the run output.

## Q4 — Where else the same judgment pays off

- **`specs/**` is the corpus:** 12,092 documents carry file:line citations (7,203 outside `z_archive`), against 82 in the skills tree. Acceptance criteria are checked for deadness only (`check-ac-coverage.sh` proves the line number exists); the catalog validator strips line ranges and checks paths (`validate_catalog_package.py`). No existing check asks whether the window supports the sentence.
- **Mirrors and governance docs are null:** `.skilled/hooks` 2, `.skilled/agents` 1, one each in the runtime agent trees, none in root docs or repo-rules. Their dialect is path-only references (43,523 across 5,736 skill docs), which need a path/anchor-existence check — a different tool.
- **Resolution first:** 44 ambiguous + 103 unresolved citations are invisible to the judgment, dominated by illustrative example paths in guidance prose (`main.ts`, `src/main.ts`, `code_surface_detection.md:30-37` inside an "e.g." triage example). A wider scan without an illustrative-reference classifier drowns in noise.
- **Cost is boundable:** the model cost scales with labeled rows, not corpus size; per-corpus draws with the same 20+20 shape let each corpus carry its own gate. The read side is the part to fix first.

## Q5 — Default-on integration: needs, cost, risk

- **Reader:** documented (README §8 row, catalog, playbook, SKILL.md sentence) but consumed by nothing; 032 itself says a keep that serves nothing. Needs a named consumer and an advisory-only policy — never a blocking gate.
- **Cost:** minutes per run today (census ~171s, draw ~381s, model 41s); seconds after the read-side fix. Per-commit cadence is infeasible; periodic advisory is trivial. Model cost is flat in corpus size.
- **Label lifecycle:** the draw refuses to overwrite once labels exist, rows pin their commits, and the gate needs all 20 live rows labeled by a human. The sustainable shape is this set as a frozen regression benchmark plus explicit re-draw + re-label cycles.
- **Record and qualification:** per-row outcomes + instruction/rule/row-set hashes in the report; requalification when any of them changes.
- **Risks:** claim-less rows; threshold-adjacent flips; silent credential/version skips; doc text in `calls.jsonl` (keep outside the repo); untested decision branches; a moving surface (the Deem arm was removed in `7c2bb6e3d1`); and a zero-call half that currently finds nothing actionable — the feature must be presented as a model-backed measurement, not a lint.

---

## Ranked Recommendations

Ranked by value per unit of effort and risk; each cites its evidence. "Re-measure" marks changes that must be qualified against the labeled set before their numbers are trusted.

| # | Recommendation | Evidence | Effect | Effort / risk |
|---|---|---|---|---|
| R1 | Send the enclosing paragraph/block as the claim unit (nearest preceding prose line + citation line); exclude claim-less lines from live draws until then | F2-04; live-17 is a bare `**Evidence**:` line, 3/20 live rows claim-less, missed at every threshold ≤0.75 | Removes the one miss that is a harness artifact; aligns the model's unit with the labelers' | Small extraction change; **re-measure** (payload change) |
| R2 | Change the flag decision to `min(reruns) < 0.5` or `mean < 0.6` (modal-2-of-3 stays for reporting) | F2-03: TP 26→27 at FP 0; mean<0.6 → TP 29, FP 1, acc 0.925 | Buys 1-3 caught drifts and ~4-8 accuracy points at zero call cost | Trivial; **re-measure** (rule change) |
| R3 | Report per-kind columns and a live-only sign test beside the pooled one | F3-01: live p=0.015625 vs pooled 2.384e-7; B 13/0 across kinds | Makes the measurement's strength legible; kills the easy misreading | Small; no re-measure of labels |
| R4 | Prefilter the census doc list (or batch reads with `git cat-file --batch`); stop re-reading in the draw | F2-02: 8,667 docs read, 82 citing (0.95%); ~171s default, ~381s draw | Minutes → seconds; the precondition for any default-on cadence | Small-medium; no measurement change |
| R5 | Make the record self-contained: per-row outcome file + kind split + instruction/rule/row-set hashes + payload estimate in `report.json`; widen requalification to those hashes | F3-05, F2-07, F5-04, F5-05 | Third-party replay without `calls.jsonl`; honest requalification | Small; no measurement change |
| R6 | Adaptive reruns: one screen call, confirm to three only in [0.35, 0.65] | F2-06: 12/40 rows in band; ~65 vs 121 calls; first-rerun-only is worse | ~46% fewer calls with the flip signal kept where it exists | Medium; **re-measure** |
| R7 | Strengthen or reframe the baseline: localize the token check (tokens within the cited range/proximity, not anywhere in the window) or restrict the margin check to live rows | F3-04: 20/20 constructed windows contain the sentence's tokens; B_constructed=0 | Removes the "weak comparator" criticism from the keep itself | Medium; **re-measure** |
| R8 | Test the decision paths: `stop (sign test)`, `stop (flips)`, disagreeing reruns; fix the `.state` census line and the `--out` message | F3-07; 032 review P2s | Protects exactly the branches a default-on run depends on | Small; no measurement change |
| R9 | Integrate as advisory + periodic, anchored to the frozen 40-row benchmark; reader = the sk-doc verification row; never blocking | F5-01..F5-07; recorded costs | Turns a one-off measurement into a maintained signal without a CI tax | Medium; process design |
| R10 | Put label reliability in the record: retain the rater drafts/split table reference and publish binary kappa; pre-register the disagreement rule for future draws | F3-02, F3-03: kappa 0.79-1.00; Jev's doubtful rows coincide with rater splits | Makes label noise visible and bounded | Small; no measurement change |
| R11 | Expand to spec acceptance-criteria citations — but only after a deterministic illustrative-reference classifier exists | F4-01, F4-02, F4-04: 12,092 citing docs; deadness-only today; unresolved mostly illustrative | Largest reach; acceptance criteria are the closure gate | Large; **re-measure per corpus** (new draw+labels) |
| R12 | Keep the scan's design invariants: pre-registered five-check rule, printed gate before calls, zero-call default, labels outside the repo, conditional skip on backend/credential | F1-01, F2-07, F5-06 | Preserves the properties that make the measurement trustworthy at all | None (guidance) |

**Sequencing:** R2/R3/R5/R8 are free or cheap and need no new evidence; R1/R6/R7 change what is measured and should ride one requalification against the frozen label set; R4 unblocks R9; R11 is the strategic expansion once the resolution/classifier problem is solved.

---

## Eliminated Alternatives

- **"Construction rows inflate the headline accuracy."** Ruled out: constructed rows are the harder half (Jev-right 16/20 vs live 19/20). [iteration-001.md]
- **"The result is a threshold artifact."** Ruled out: all five checks are fixed pre-run and pass independently. [iteration-001.md]
- **"Fewer reruns will fix the misses."** Ruled out: first-rerun-only scoring is worse (acc 0.850). [iteration-002.md]
- **"The misses are pure model error."** Ruled out: live-17 is a payload flaw — a claim-less Evidence line. [iteration-002.md]
- **"The keep is an artifact of the constructed half."** Ruled out: each half alone passes all five keep checks. [iteration-003.md]
- **"The blind labels are unreliable."** Ruled out on the binary scale: kappa 0.79-1.00, all splits resolved against documented rater errors, committed hash matches the report. [iteration-003.md]
- **"Expand to runtime mirrors and repo rules."** Ruled out: 1-3 line-anchored citations total; their dialect is path-only references. [iteration-004.md]
- **"Path-only references are the same judgment."** Ruled out: there is no window to judge; that class needs a path/anchor check. [iteration-004.md]
- **"Wire it into the pre-commit hook."** Ruled out: minutes per run today; per-commit cadence is infeasible and the model arm needs labels and a credential. [iteration-005.md]
- **"Auto-label the draw with a model."** Ruled out by design: the draw and gate exist to keep labels human; the draw refuses override once labels exist. [iteration-005.md]

## Open Questions

1. Does the paragraph-unit fix (R1) survive re-labeling, and does it remove more than the one attributable miss? Needs a re-measure.
2. Does a strengthened comparator (R7) leave the keep intact, and is the margin check still the binding criterion?
3. Who owns the periodic advisory run and at what cadence — and does its output feed the sk-doc verification row, a spec-phase gate, or a report only?
4. Can the illustrative-reference classifier (R11) be deterministic (path shape: extension-only basenames, `src/…` layouts) or does it need a model judgment of its own?
5. Should the margin/flips checks be evaluated per kind by default in future Jev measurements, not just here?

## References

- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`
- `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs`
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl`
- `.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md`
- `.skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-scan.md`
- `.skilled/skills/sk-doc/README.md` (§8 verification table)
- `~/.skilled/.labels/runs/032-jev-20261001/report.json`, `calls.jsonl`; `~/.skilled/.labels/runs/032-jev.stdout.txt`
- `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/{drafts,compare,evidence/labels}/032-*`
- `specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/` (goal.md, implementation-summary.md)
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh`; `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py`
- This lineage: `iterations/iteration-001.md` .. `iteration-005.md`, `deltas/iter-001.jsonl` .. `iter-005.jsonl`, `findings-registry.json`

---

## Appendix: Convergence Report

- **Stop reason:** maxIterationsReached
- **Total iterations:** 5
- **Questions answered:** 5 / 5 (Q1-Q5 each answered by its numbered iteration)
- **Remaining questions:** none at the directive level; the five open questions above are follow-ups, not directive gaps
- **newInfoRatio trend:** 1.0 → 0.9 → 0.9 → 0.85 → 0.8 (no convergence stop; the max-iterations cap was reached as configured, and the final iteration was synthesis of constraints, not a new question)
- **Convergence threshold:** 0.05 (telemetry only under the max-iterations stop policy)
- **Coverage:** 36 findings across 5 iterations; every finding carries a `file:line`, artifact, or replay source; 8 ruled-out directions recorded as negative knowledge; all quantitative claims were reproduced by read-only replay of recorded artifacts.
- **Divergence summary:** no divergent pivots recorded.
