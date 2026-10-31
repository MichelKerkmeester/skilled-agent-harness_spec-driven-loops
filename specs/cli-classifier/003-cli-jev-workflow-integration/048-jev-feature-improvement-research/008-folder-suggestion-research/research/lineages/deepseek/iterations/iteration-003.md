# Iteration 003 -- Making the measurement more trustworthy

- **Focus:** Q3. Separate what the run legitimately measured from what a reader may infer; name the provenance gaps and the cheapest controls that close them.
- **Status:** complete. **newInfoRatio:** 0.82.
- **Sources read:** `022/spec.md` (REQ-001..010, baseline definition :118, Keep Rule :184-206), `022/plan.md:43`, `042/spec.md` (:40-44 arbiter amendment, :69 022 blocked), `042/scratch/evidence/card-022.md`, `label-inventory-1.md:254`, `047/goal.md` (D1, D4), `047/scratch/evidence/results.md`, both `022-rows.jsonl` copies, `022-arbiter.jsonl`, run dir (`calls.jsonl` field set, `report.json`).

## Findings

**F3-01 [OBSERVED] The scored corpus is not the corpus the spec drew.**
022 REQ draws rows from a real transcript directory (`--transcripts <dir> --rows-out <file>`; spec :55, :112-115, :225) and states labels are "the operator's, past the gate" (:48, :129). 042's inventory recorded the opposite situation -- "0 rows exist, no transcript directory is named, and the committed tree yields 0 alternative-listing events" (`label-inventory-1.md:254`) -- and the later 047 phase allowed a fixture under D4 and recorded the corpus as "fixture: 40 rows built by Luna 6 from real spec folders" (`results.md`). The result's external validity to real saves is therefore untested; the arithmetic is about the fixture.
[SOURCE: 022/spec.md:48, :55, :112-115, :129, :225; 042/scratch/evidence/label-inventory-1.md:254; 047/scratch/evidence/results.md]

**F3-02 [OBSERVED] The fixture kills one of the two free answers the baseline is defined over.**
Spec :118 defines the zero-call baseline as the better of staying with the target and taking the top alternative, tie to target. In the fixture the target equals the arbiter label on 0 of 40 rows, so the target arm scores zero and `chooseBaseline` falls to `top` (:583-593, printed `baseline: target=0 top=30 chosen=top`). `results.md` says this in one line. Consequences: (a) the run cannot answer "does Jev beat today's non-interactive save behavior (proceed with the target)?"; (b) any quoted gap must be the measured one (+22.5 points over the top alternative), not a gap against the target -- on this fixture proceeding with the target was right on 0 of 40, a number the fixture manufactured rather than observed.
[SOURCE: 022/spec.md:118; score-alignment-suggestion.ts:583-593; ~/.skilled/.labels/runs/047-022-jev.stdout.txt; 047 results.md]

**F3-03 [OBSERVED] Label provenance is thin: a delegated arbiter, 40 rows, `{id,label}` only, and no 022 decisions log.**
The label method is two amendments removed from the spec: 042 ADR-001 replaced operator review with "a fresh Opus 5.5 medium arbiter per feature and a digest the operator can veto" (`042/spec.md:44`), and 047 D1 accepts that arbiter's labels (`047 goal` D1). What survives in the repository for 022 is a draft file with 40 `{id,label}` pairs and the `results.md` row; 042's evidence directory holds no `022-decisions.md` (the logs stop at the features it could fill), and the inputs the arbiter saw per row are not recorded. The schema itself has no labeler field (`card-022.md` §5). Label error is unaudited, and the one row Jev lost is precisely a row whose label deserves a second read.
[SOURCE: 042/spec.md:44; 042/scratch/evidence/card-022.md §5; ~/.skilled/.labels/drafts/022-arbiter.jsonl; 047/scratch/evidence/results.md; ls of 042/scratch/evidence/labels/]

**F3-04 [OBSERVED] Labels repeat the row's own folder 40 of 40 times, so the corpus cannot show where the label came from.**
Every row's label equals the folder its `path` points into (f022-001 -> label 001-deep-research, and so on). The four gridlines that could show whether Jev read content rather than construction (distractor states, anonymized option text, a swapped-label control, cross-folder states) do not exist in this run. Combined with F1-08 (states paraphrase the label folder's own materials) the correct option and the state share provenance on every row.
[SOURCE: ~/.skilled/.labels/022-rows.jsonl (40/40 fields); F1-08]

**F3-05 [OBSERVED] Reproducing the run needs files outside the repository, and neither the corpus nor the run is hash-pinned.**
The scored rows live at `~/.skilled/.labels/022-rows.jsonl`; the repo copy differs only by `label: null` on all 40 rows. The audit trail lives at `~/.skilled/.labels/runs/047-022-jev-20261002/`. `results.md` pins the command and the verdict line but no content hash; `report.json` holds counts, the verdict line and p -- no corpus hash, no scorer version or commit. REQ-004 permits counts-only artifacts, so a hash + `report.json` copy could be committed without exposing row text.
[SOURCE: field-wise diff of the two rows files; ~/.skilled/.labels/runs/047-022-jev-20261002/report.json; 022/spec.md REQ-004]

**F3-06 [OBSERVED] The call log pins the backend identity but not the scorer identity.**
All 121 records carry `jev_version=jev 0.6.2`, `provider=official`, `model=jev-1.13.0`; `model_commit` and `source_commit` are absent from every record (they are the Deem arm's commit pair per REQ-007, and this was a Jev-only run). Nothing in the run directory names the scorer revision that produced it, and no token/price receipt exists (F2-06). The scorer's version can drift between the run and any later reading without a linking artifact.
[SOURCE: calls.jsonl field union; 022/spec.md REQ-007]

**F3-07 [OBSERVED] What the design already gets right and should keep.**
The Keep Rule is frozen in the spec with a dated statement "`fixed 2026-09-29, before any model run`" (`spec.md:184`), matching plan DoR:43; the baseline is chosen before any call (:118, :1266-1267); the label and callable gates stop the run and foreign labels exit 2 (REQ-002, :1247-1264); zero calls happen when the free answer is already >=90% right (:1269-1276); every call records an `options_hash` of the exact option text (:1119) plus exit, pick, probability and status (REQ-007); calls never carry row text (REQ-004); the Jev arm is dormant without version, auth and payload acceptance (REQ-003, :731-770).
[SOURCE: 022/spec.md:118, :184, REQ-002..004, REQ-007; score-alignment-suggestion.ts:731-770, :1119, :1247-1276]

**F3-08 [DERIVED] Ranked trust improvements.**
- **T1 Restore the real-transcript corpus** (the unblock condition 042 named: >=30 low/infrastructure events listing alternatives, >=30 carrying a state). It brings genuine targets and possible `gold` interactive picks, restores the target comparator (F3-02) and tests external validity (F3-01). The writer and draw command already exist.
- **T2 Adjudicate the 11 discordant rows** (10 W + 1 L) with a second independent labeler and record agreement; f022-001 first. A single flipped label inside W or L moves the sign test materially at n=11.
- **T3 Record label provenance** (labeler id, date, rubric version) in a sidecar or an added schema field, and keep the arbiter's exact input set. The card already notes the schema has no labeler field.
- **T4 Hash-pin the run**: corpus sha256 plus a `report.json` copy inside the packet, and the scorer commit or version into `report.json`.
- **T5 Report the informative sample**: print W+L and an interval for the A-B delta, because p=0.0059 rests on 11 discordant pairs, not 40 rows.
- **T6 Add cheap negative controls**: a swapped-label run (expect near-zero A) and a distractor-state run; these turn "39 of 40" from an assertion into a validated rate.
- **T7 Re-run once for inter-run stability**: the internal F=0 measures option-order stability, not run-to-run reproducibility.

## Ruled out

- Discarding the result because the corpus is a fixture: the verdict states exactly what it measured (Jev vs the top alternative on a 40-row built fixture). The repair belongs in what readers infer and in the next corpus, not in the counts.
[SOURCE: 047 results.md; 022/spec.md:118]

## Next focus

Q4 -- where else in `.skilled` the same suggestion judgment appears and would pay off, grounded in call sites and competing suggesters.
