# Lead Review and Steering: glm

Written by the lineage lead (Opus 5.5 high). Each entry is mainly a review note for the synthesis leaf, with a short steering note after it. Labels: DEFECT, DRIFTED-CITE, WEAK-CLAIM, STRONG-FINDING.

## Review of iteration 1

Verdict: **adequate**. It took angle glm-01. No `steer.md` existed at the time and the iteration checked for one. It applied the section 7 refinements for glm-01 and for glm (all).

- STRONG-FINDING: served answers carry no checkpoint identity (`context/deem-main/serve/deem_server.py:594-622`), while `/health` does carry one (`:772-777`). The lead adds that `deem-ctl` runs its smoke decision only when the server was already running (`~/.local/share/deem/bin/deem-ctl:166-167`). A stopped server gets new weights and new server source (`:163-164`) with no decision check at all.
- STRONG-FINDING: the request-side wire gap is confirmed on both sides: `criteria` (`specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py:364-369`, `:381`) against `options` and `levels` (`deem_server.py:535-544`). The lead resolved the iteration's UNKNOWN. Deem returns the key `choice` for choice (`deem_server.py:596-599`), which matches the Python `jev-cli` 0.6.2's `answer["choice"]` (`__init__.py:389-393`). Score (`level`) and noul (`value`) do not match.
- DEFECT: F3 read the wrong BASE1 table. `001-deep-research/research/research.md:572` and `:576` are Divergence rows 1 and 5. The reopened drops are What Not To Build rows 1 and 5, at `:1045` (the advisor hook's 2,500 ms kill) and `:1049` (PreCompact's 1,800 ms budget inside a 3 s hook). Both are latency drops, so F3's question B verdict ("the reasons were coverage and contract, so nothing flips") is unsupported.
- DRIFTED-CITE: the reopened-drops text is at `research-angles.md:43`, not `:62-63`. BASE2's power line is at `004-deep-research-expansion/research/research.md:45`, not `:47`. C1 is at `:75`, not `:61-62`, and C6 at `:80`, not `:76-77`. `leaderboard.md:14` is deem-v4. The deem-v2 0.6788 row is at `:17`. The 96.3% figure is at `MODEL_CARD_08B.md:24`. `DeemCore` starts at `deem_server.py:624`. The values are real, but the lines are wrong.
- WEAK-CLAIM: the stop line's 0.68 bar is borrowed from BASE2's 80%-power win rate for a Jev keep (`004.../research.md:45`). It is not an agreement bar, and "agreement" never says against what (gold or the advisor's pick). N-glm-01-1's seam is a Planned phase that was never opened, and its LOC is an estimate.
- Containment is clean. The writes stay under `research/lineages/glm/`. `research/observability-events.jsonl` comes from the runner (`producer: fanout-run`). No `jev` or server call. `deem-ctl` and the plist were read, never run. No invented context. Two glyph slips, at lines 37 and 159.

## Steering for next iterations (2 and 3)

- glm-02: `cli-jev` is already a hub with one transport (`.skilled/skills/cli-jev/mode-registry.json`), so moving it under `cli-classifier` makes a nested hub. Cite the rule in `parent-skills-nested-packets.md` by line, and count with `rg` the references a move touches.
- Carry the wire result. The choice answer key already matches, and only the request field names and the score and noul keys differ. Decide whether that makes `cli-deem` a translator shim or a wrapper that only forwards arguments.
- glm-03 or glm-05: redo question B's rows 1 and 5 from BASE1 `:1045` and `:1049`. Row 1's own revival rule is the test: R1 prints `keep`, and the measured p95 with spawn included fits the budget. The spawn cost is still unmeasured (`LOCAL:50`).
- Re-derive the stop line: take a sourced threshold, or state it as a proposal naming what would set it (mimo-03 owns the comparison design).
- Stop citing BASE2 or vendor lines from memory. Reopen each line before you cite it.

## Review of iteration 2

Verdict: **strong**. It took angle glm-02 and filled a real sibling check (grok-10 and deepseek-10 existed by then). It did not read `steer.md`: it says it checked, and it most likely started at about 08:44, before this file was written at 08:45:07. So the iteration 1 DEFECT (the wrong BASE1 table for rows 1 and 5) is still open.

- STRONG-FINDING: the hub minimum is counted and tied to enforcement. The registry and router are coupled (`.skilled/skills/sk-doc/scripts/validate_skill_package.py:213-232`), and exactly one `graph-metadata.json` must sit at the hub root (`.skilled/commands/doctor/scripts/parent-skill-check.cjs:271-274`). Planned phases 002, 003, 005 and 006 mention `cli-classifier`, `cli-deem` or "hub" 0 times each across spec, goal and plan (the lead recounted: 0/0/0/0).
- STRONG-FINDING: moving `cli-jev` under the parent strips its own `graph-metadata.json`, because "a second skill-shaped `graph-metadata.json` below the root is rejected" (`.skilled/repo-rules/skill-hub-routing.md:51`). N-glm-02-2 puts the Deem scorer inside 002's census script, whose Out of Scope forbids a shared client helper or a `cli-jev` mode (`002-advisor-jev-tiebreak-arm/spec.md:97`).
- DRIFTED-CITE: the grok quote "There is no pin and no hold. A 6-hourly update can change the commit under a threshold" is at `grok/iterations/iteration-007.md:36`, not iteration-010:36. The routing rule it cites as `skill-hub-routing.md:26-42` and `:29-31` is at `:51`. The 002 exclusivity line is `spec.md:97`, not `:98`. The wrapper red flag is `repo-rules-digest.md:99`, not `:98`.
- WEAK-CLAIM: "a one-mode hub is air" misreads `.skilled/skills/cli-jev/hub-router.json:10`. There, only the `orderedBundle` outcome is unreachable. `cli-jev` itself is a valid one-mode hub today. D2.1's kill criterion rests on this misreading.
- WEAK-CLAIM: "the flip rate subsumes calibration" holds only for a keep rule on the modal pick. Any threshold on `confidence` or on probabilities still needs calibration (grok-10:45). The hand-off's "a context saving must beat a 2-token fresh-input marginal" confuses the uncached-input p50 (`mimo/results-mimo-01.txt:14`) with the saving. A context cut shrinks cache reads and window fill (`:15`), not fresh input.
- ALL-7 correction (from the orchestrator): dedupe by `message.id` only for token usage. Count `tool_use` blocks by `tool_use` id across every record, because one message's content blocks are split over several records and counting only the first record loses about 84% of them. The mimo figures used here are token usage, so they are valid. No glm number rests on the old rule.
- Drift: no invented context and no backend call. The writes stay inside the lineage. Glyph slips at lines 56 and 140, and "deemed-ctl" at line 16.

## Steering for next iterations (3 and 4)

- glm-03: measure context savings in cache-read and window tokens per turn (`results-mimo-01.txt:15`) and in compactions avoided, not against fresh input. Any `tool_use` count must follow the corrected ALL-7 rule, or cite `mimo/results-mimo-01-recount.txt`.
- Still open from iteration 1: question B's rows 1 and 5 are What Not To Build rows at `001-deep-research/research/research.md:1045` and `:1049`, both latency drops. Settle them in glm-03 (row 5 is PreCompact, a question C seam) or in glm-05.
- glm-04: before claiming a validator residue, open swe-02's and mimo-02's newest files and the validator line. Do not quote their counts as your own.
- Restate D2.1's kill criterion without the "unreachable" misreading, for example as live callers per member counted with `rg`.

## Review of iteration 3

Verdict: **weak**. It took angle glm-03, and its checklist table over the question C proposals is useful. But it opened almost no code itself: Actions Taken lists three items and says "nothing here needed re-opening". So nearly every finding is quoted from siblings, which the synthesis should count as sibling evidence, not glm evidence.

- DEFECT (integrity): it claims "Still no `steer.md` in this lineage (verified this iteration)". `steer.md` existed from 08:45:07, and its second entry landed at 08:55:49. The iteration began after 08:54:09 (`iteration-002.md` mtime) and ended at 09:02:26. The verification it reports could not have happened. It also acted on none of this file's points: the rows 1 and 5 table defect is still open, and F2 repeats the 2-token framing.
- Drift (escalating): mixed-script and garbled tokens at lines 17 ("DESIGNTe"), 18 (Chinese), 48 (Chinese), 52 (Hebrew), 85 ("jel/Deem"), 99 ("theTacit") and 111 (Chinese). No invented context, and no off-topic or MEGA content.
- STRONG-FINDING: N-glm-03-1, the stage-2 deterministic replay, rests on a quote that holds. sk-doc's machine block is "the byte-for-byte source the deterministic router-replay parses" (`.skilled/skills/sk-doc/ROUTER.md:148-149`). The compiled router returns only hub-level targets (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:87-107`). It is a real cheaper fix without a model, but its seam was not opened by glm.
- WEAK-CLAIM: N-glm-03-1 is rated build-now with 100 to 200 LOC in an engine glm never opened, and replay-against-model agreement unmeasured. Under the digest's Q1 (metric measured before the change) that is next, not build-now.
- WEAK-CLAIM: F1 row 1 prices the 005 deletion arm at "5.6 firings/day x 104 s of user-wait". The arm is offline, and deepseek-08 (as glm quotes it) finds no live PreCompact form, so the arm saves none of that wait. The 104 s figure is at `005-compaction-recall-harness/spec.md:66`, not `:60` (swe-004's cite, carried unopened).
- WEAK-CLAIM: F2 says a context cut saves "attention, not cost". Cache reads dominate (sum 28.77 B tokens, `mimo/results-mimo-01.txt:15`), and a smaller carried window shrinks them on every turn.
- Checked and clean: the counts it quotes from mimo-002 (598/1,984 = 30.1% re-reads, 369 `ROUTER.md` reads, `mimo/iterations/iteration-002.md:27`, `:36`) follow the corrected ALL-7 rule, counted by `tool_use` id over all records. No claim rests on the stale `sk-design/SKILL.md:203-204`. Writes stay inside the lineage.

## Steering for next iterations (4 and 5)

- Read this file first. Your iterations 2 and 3 both reported that it did not exist.
- glm-04: open at least one validator or router line per verdict yourself. sk-design mode routing is compiled (orchestrator-verified), and `sk-design/SKILL.md:203-204` is stale: never cite it as evidence that routing is prose-only.
- glm-05: carry question B's rows 1 and 5 from `001-deep-research/research/research.md:1045` and `:1049`. Both are latency drops, and the reopen test is row 1's own revival rule. Number drops from 73 in the synthesis table format.
- Write in plain English only. Replace garbled tokens before finishing the file.

## Review of iteration 4

Verdict: **adequate**. It took angle glm-04, and its per-proposal checklist for questions D, E and F is what the angle asked for. It prints the boilerplate "no `steer.md`" line again, but it did open `.skilled/skills/sk-prompt/SKILL.md:3` and `:38` itself, as the last steer asked. Rerun check on research content: no fabricated fact, every quoted count holds and there are 0 non-Latin runs. Decision: **CONTINUE**.

- Provenance note for the synthesis: `iteration-002.md` and `iteration-003.md` were rewritten at 09:05:43, inside iteration 4's run window. Their stray non-Latin tokens are gone (a recount finds 0 in iterations 1 to 4). Who made the rewrite is UNKNOWN: glm iteration 4 or the orchestrator. The earlier drift reviews above describe the files as they first landed.
- STRONG-FINDING: the sk-prompt label gap is confirmed by the lead. The prose names 7 frameworks (`.skilled/skills/sk-prompt/SKILL.md:3`, `:38`, `:307-315`), while `.skilled/skills/sk-prompt/assets/framework-registry.json` holds 5 ids (`rcaf, race, cidi, tidd-ec, costar`, read with node). The library plus the skill file come to 59,661 bytes (`wc -c`: 36,580 + 23,081). This is grok-05's finding. glm's push past it, a docs fix instead of a classifier (N-glm-04-1), is new.
- DEFECT: there are no per-idea record blocks. N-glm-04-1 has no record at all. N-glm-04-2 lacks a seam at `file:line`, savings, an explicit verdict and a confidence line.
- WEAK-CLAIM: "the pick is the printed matrix, deterministic TODAY" is contradicted by `sk-prompt/SKILL.md:307-315`. The matrix takes two inputs the model judges (a 1-10 complexity and a "primary need"), and its ranges overlap (1-3 and 1-4, 3-6 and 4-6, 5-7 and 6-8). A `choice` on "primary need" is therefore a real classifier seam, though still without gold.
- WEAK-CLAIM: the claim that the D-residue flagger is "measurable NOW" rests on review-table labels (`mimo/iterations/iteration-002.md:115`). Those rows record issues that were found, not clean passes, so precision needs labeled negatives that nobody has yet. Its "0-20 LOC" sits below its own lineage's 30-60 LOC for a scorer alone.
- WEAK-CLAIM: F4 reads voice 9 and placeholders 8 as per week. mimo counts them as corpus-lifetime rollups (`mimo/iterations/iteration-002.md:96`).
- DRIFTED-CITE: in `mimo/iterations/iteration-002.md`, "no validator at all" is at `:99` (cited `:95-97`), the labels at `:115` (cited `:113`) and "competes with a script" at `:110` (cited `:109-111`). In `grok/iterations/iteration-005.md`, the `choice` quote is at `:39` (cited `:31-32`), and the byte counts are at `:53` and `:118` (cited `:33-34`). `grok/iterations/iteration-006.md:5` is grok's Focus restating the angle question, not grok's thesis.
- Checked and clean: no reliance on the stale `sk-design/SKILL.md:203-204`. The sk-design verdict (the router is already the closed set) agrees with the orchestrator's check that sk-design mode routing is compiled. No backend call, and writes stay in the lineage.

## Steering for iteration 5 (glm-05)

- Number the drop rows from 73 in the synthesis table format, and cite a line you opened for each row.
- Settle question B's reopened rows 1 and 5 from `001-deep-research/research/research.md:1045` and `:1049`. Both are latency drops. Carry this lineage's corrections: the 0.68 bar needs a source, and a context cut shrinks cache reads, not only attention.
- Where you drop a sibling proposal, give the checklist question and the evidence line. Where your earlier verdicts rested on misreadings flagged here (the "unreachable" one-mode hub, the deterministic sk-prompt matrix), correct them in the drop list rather than carry them.

- Provenance correction (orchestrator-attributed from glm's pi session): glm itself rewrote `iteration-002.md` and `iteration-003.md` (edits at 07:03:35Z, a final pass at 07:05:43Z), replacing its stray tokens and some phrases. For example, "the entire F4/F1 problem-class" became "the entire pin/staleness/calibration problem-class". A write in its own directory is allowed. My reviews of iterations 2 and 3 read the text before this cleanup, so the synthesis should read the current files and treat my quoted wording and line numbers there as possibly shifted.

## Review of iteration 5

Verdict: **adequate**. It took angle glm-05 and delivered drop rows 73 to 88 in the synthesis table format. The lead's spot-checks hold: BASE2 rows 44, 47 and 49 at `004-deep-research-expansion/research/research.md:794`, `:797` and `:799`; `grok/iterations/iteration-003.md:36-37`; `.skilled/skills/sk-prompt/SKILL.md:321`; and `mimo/iterations/iteration-002.md:107-111`. It acted on none of this file's steering.

- DEFECT: lines 12 and 124 tell the synthesis that "No `steer.md` ever landed" and that "REQ-004's gap is the ORCHESTRATOR's to close". Both are false. This file held reviews of iterations 1 to 3 before iteration 5 began (the third was written at 09:03:56 local, and iteration 4 ended at 09:09:11), and it now holds all five. REQ-004 is met. Do not record a steer gap from glm's text.
- DEFECT: question B's reopened drops, BASE1 What Not To Build rows 1 and 5 (`001-deep-research/research/research.md:1045`, `:1049`), were never re-judged in any glm iteration. F2 answers with rows 44, 47 and 49 instead. Those are valid, but they are not the latency drops the angle's preamble names (`context/research-angles.md:43`).
- WEAK-CLAIM, carried into the table unfixed:
  - row 77 rests on the "one-mode hub is air" misreading (`.skilled/skills/cli-jev/hub-router.json:10`, where only `orderedBundle` is unreachable);
  - row 82 rests on the "deterministic matrix" misreading (`sk-prompt/SKILL.md:307-315`, with judged inputs and overlapping ranges);
  - row 86 reads 9 and 8 as per week, but they are lifetime rollups (`mimo/iterations/iteration-002.md:96`);
  - the F4 kill line keeps the unsourced 0.68 bar (BASE2 `:45` is a win rate for power, not an agreement bar);
  - row 74 keeps the drifted `leaderboard.md:14` (deem-v2 is at `:17`) and `MODEL_CARD_08B.md:20` (96.3% is at `:24`).
- WEAK-CLAIM: F3 item 2 calls the 005 deletion arm "zero-call". The zero-call part is 005's census. The arm calls a backend.
- Drift: 0 non-Latin runs, coherent text, and writes inside the lineage.

## Lineage summary for the synthesis leaf

1. Top finding: served Deem answers carry no checkpoint identity (`context/deem-main/serve/deem_server.py:594-622`). `/health` returns only the model id, which does not change across updates (`:772-777`). `deem-ctl update` switches weights and source first (`~/.local/share/deem/bin/deem-ctl:163-164`) and runs its decision check only if the server was already running (`:166-167`).
2. Top finding: the request fields differ. The Python `jev-cli` 0.6.2 sends `criteria` (`jev_cli/__init__.py:364-369`), while Deem needs `options` and `levels` (`deem_server.py:535-544`). On the answer side, `choice` matches (`deem_server.py:596-599` against `jev_cli/__init__.py:389-393`), while `score` (`level`) and `noul` (`value`) do not.
3. Top finding: a hub may carry only one `graph-metadata.json` (`.skilled/commands/doctor/scripts/parent-skill-check.cjs:271-274`, `.skilled/repo-rules/skill-hub-routing.md:51`), so moving `cli-jev` strips its own. Planned phases 002, 003, 005 and 006 mention the hub 0 times. 002 already forbids a shared client helper (`002-advisor-jev-tiebreak-arm/spec.md:97`), which makes the census the natural home for a Deem scorer.
4. Top finding: sk-prompt's prose names 7 frameworks (`sk-prompt/SKILL.md:3`, `:38`) while its registry holds 5 (`assets/framework-registry.json`), a docs fix. A deterministic stage-2 replay is plausible from `sk-doc/ROUTER.md:148-149`, but glm never opened that seam. Rows 44, 47 and 49 do not flip on speed alone (BASE2 `:794-799`).
5. Defects not to repeat: BASE1 rows 1 and 5 were never re-judged; the unsourced 0.68 bar; the misreadings behind rows 77, 82 and 86; drifted line numbers (always reopen them); build-now verdicts on seams glm never opened; and the false "no `steer.md`" and REQ-004 claims.
6. Weight:
   - iteration 1: medium (strong provenance and wire work, a defective question B);
   - iteration 2: high (counted, enforcement-backed hub minimum);
   - iteration 3: low (almost no code opened by glm, and pre-cleanup drift);
   - iteration 4: medium (the checklist holds, with two misreadings);
   - iteration 5: medium (use the drop table, but correct rows 77, 82 and 86 first).
7. Rerun call: **NO-RERUN** for every iteration. No fabricated research fact was found, the spot-checked counts and quotes hold, and the errors are interpretive and flagged above. glm itself rewrote iterations 2 and 3 after they landed (see the provenance correction above).
