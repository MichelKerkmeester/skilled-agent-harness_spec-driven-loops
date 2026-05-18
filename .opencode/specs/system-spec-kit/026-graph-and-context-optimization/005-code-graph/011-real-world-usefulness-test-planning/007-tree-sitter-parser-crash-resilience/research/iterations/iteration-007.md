---
title: "Iteration 7: Final synthesis and convergence"
description: "This iteration produced the final research synthesis, resource map and convergence updates. It also ran an informational fresh-bash-only probe that supported the 70-file production seed recommendation."
trigger_phrases:
  - "iteration 7"
  - "final synthesis"
  - "convergence"
  - "fresh-bash-only probe"
  - "70-file production seed"
importance_tier: "important"
contextType: "research-iteration"
---

# Iteration 7 — Final Synthesis

**Timestamp:** 2026-05-06T20:30Z
**Role:** SYNTHESIS (not investigation).
**Focus:** Produce the final research deliverable — `research/research.md` (17-section synthesis) + `research/resource-map.md` + state convergence updates. No new investigation; closes Q1–Q7 final state.
**Executor:** `@deep-research` (cli-codex/gpt-5.5/high lineage)
**Tool budget used:** 10/12
**Status:** CONVERGED
**Stop reason:** `max_iterations_reached_with_full_convergence`

---

## What this iteration produced

### Primary deliverables

1. **`research/research.md`** — final 17-section synthesis covering:
   - Topic, convergence status, executive summary, investigation path
   - Confirmed findings (P0), ruled-out directions
   - Mechanism story (6-step cascade)
   - Cohort statistics (production + iter-005/006 harness data)
   - Remediation backlog (R-3 primary, R-1' defense-in-depth, R-2 Phase-3)
   - Phase-2 implementation plan refining `tasks.md` T007–T015 + new T016+T017
   - Skip-list parameter recommendations (Q6 final)
   - Open questions resolved (Q1–Q7 final state)
   - Tensions / contradictions (iter-4 vs iter-5; iter-3 vs iter-5)
   - Citations (file:line + npm + live data)
   - Negative knowledge ledger
   - Convergence metrics
   - Next steps (Phase-2 sequence + Phase-3 backlog)

2. **`research/resource-map.md`** — path ledger of every artifact touched/created across 7 iterations.

3. **`research/deltas/iter-007.jsonl`** — synthesis-iteration delta with verification-probe finding F-7.1 + final answered-question entries for Q1–Q7 + convergence record.

4. **`research/iterations/iteration-007.md`** — this file.

5. **`research/deep-research-state.jsonl`** — appended one final iteration record with `status: "converged"`.

6. **`research/deep-research-strategy.md`** — updated §15 (final convergence row), §11 (final answered-question table), §16 ("CONVERGED — see research.md").

### Verification probe (informational, F-7.1)

Quick `/tmp/find-9-bash.mjs` probe (single fresh `web-tree-sitter@0.24.7` parser, bash language only, no interleaving) on the 33 .sh files in the iter-005/006 cohort revealed **~29 of 33 .sh files throw B1 in fresh-bash-only mode**, a broader set than the iter-005 mixed-cohort "9 of 33" steady-state count. This is treated as a tension/caveat and surfaced honestly in research.md §13 and §10.1 Note. The skip-list seed recommendation uses the **70-file production B1 set** (broadest safe default from `parse_diagnostics`), not the 9-file replay-stable subset and not the 29-file fresh-bash-only set. Tool-call cost: 2 (Bash + cat-script-via-bash for the probe).

---

## Findings

### F-7.1 [P2] Verification probe: fresh-bash-only mode shows ~29 of 33 .sh files throw B1
- **Evidence:** Single fresh `web-tree-sitter@0.24.7` parser, ONLY bash language loaded, replay all 33 .sh files in `iter-004-oob-cohort.txt` order. Result: 29 of 33 throw B1 (`resolved is not a function`) before the fresh parser crashes. The first non-B1 throw aborts the probe.
- **Comparison:** iter-005 mixed-cohort steady state = 9 B1 per loop on the same 33 files. The interleaving (where the parser keeps `setLanguage`-switching to ts/py/js between bash parses) MASKS some bash throws — possibly via partial scanner-state resets at language-switch boundaries.
- **Citation:** `/tmp/find-9-bash.mjs` (verification probe), `scratch/fixtures/iter-004-oob-cohort.txt:13-45` (33 .sh files in cohort).
- **Strategic impact:** Adds confidence to research.md §10.1 recommendation: seed the skip-list from the 70-file production set in `parse_diagnostics` rather than the 9-file iter-005 steady-state set. The 70-file set is the broadest empirically-observed B1 cohort and minimizes the risk of a bash file slipping through to re-poison the singleton.

(No other new findings — iter 7 is synthesis, not investigation.)

---

## Sources Consulted

- `research/deep-research-strategy.md:1-270` — full strategy state
- `research/deep-research-state.jsonl:1-7` — append-only ledger
- `research/iterations/iteration-006.md:1-211` — most recent investigative iteration
- `research/deltas/iter-006.jsonl:1-12` — iter 6 deltas
- `scratch/fixtures/iter-004-oob-cohort.txt:1-51` — 51-file ordered cohort
- `scratch/fixtures/iter-005-stress-output.txt:1-29` — 5,000-parse stress data
- `scratch/fixtures/iter-006-variant-a-sh-only-output.txt:1-19` — sh-only first-B2 evidence
- `scratch/fixtures/iter-006-r1-output.txt:1-20` — R-1 reset-mode rejection
- `scratch/fixtures/iter-006-bash-isolation.mjs:1-110` — variant harness pattern (used for verification probe)
- `tasks.md:50-91` — Phase 1/2/3 task list (refinement targets)
- `mcp_server/database/code-graph.sqlite` `parse_diagnostics` — production B1 cohort (verified via SQLite query, 70+ unique .sh files matching `error_message LIKE '%resolved is not a function%'`)
- `/tmp/find-9-bash.mjs` — iter-7 verification probe (fresh-bash-only mode)

---

## Assessment

- **New information ratio:** 0.05 (F-7.1 alone is "new"; 95% of iter 7 is synthesis-of-existing-evidence)
- **Questions addressed:** Q1, Q2, Q3, Q4, Q5, Q6, Q7 (all)
- **Questions answered:** Q1 (RULED OUT final), Q2 (ANSWERED final, confidence 0.95), Q3 (EFFECTIVELY ANSWERED final), Q4 (ANSWERED final), Q5 (PARTIAL — fixture extraction deferred to post-research), Q6 (ANSWERED final), Q7 (ANSWERED final)
- **Questions remaining:** 0 productive / 1 deferred (Q5 standalone-fixture extraction is a documentation aid for upstream bug report, not a Phase-2 blocker)

---

## Reflection

### What worked and why
- **Synthesis-first writing pass over re-investigation.** With 6 iterations of evidence already on disk, the Right Thing for iter 7 was to consolidate, not gather. Reading strategy + most-recent iteration + most-recent delta gave 95% of the synthesis content; a single verification probe added the remaining nuance.
- **Honest tension surfacing in §13.** Iter 4's "rejected at 51-file horizon" reversed by iter 5's "confirmed at 5,000 parses" is a real research dynamic that future readers (and remediation-implementation reviewers) need to understand. Documenting the iso-corruption budget as the resolution rather than burying the contradiction makes the mechanism story load-bearing.
- **70-file vs 9-file seed clarification.** The original dispatch context said "default seed = 9 known bad-bash file paths". A quick verification probe revealed 29 of 33 .sh files throw B1 in fresh-bash-only mode — broader than 9. Reframing the recommendation to "seed from 70-file production set, document the 9 as the iter-005 replay-stable subset" preserves correctness without contradicting the dispatch.

### What did not work and why
- **First two attempts at the verification probe failed** with module-export shape errors (`Named export 'Language' not found` then `Cannot read properties of undefined (reading 'init')`). Cost ~2 tool calls. Root cause: assumed the same import shape would work without copying the working `iter-006-bash-isolation.mjs` template. Lesson re-learned: iter-3/iter-4 both hit similar API-shape gotchas; the working production fixture is always the right starting point. (Iter 4's "what failed" §8 documents the exact same lesson.)

### What I would do differently
- **For future research-loop synthesis iterations:** read at least one working fixture from the most recent investigative iter BEFORE writing any verification-probe code. Saves 1–2 tool calls.
- **For the dispatch context shape:** when "primary remediation seeds with N known files" is in the dispatch, an iter-7 synthesis pass should ALWAYS double-check N from a fresh probe before locking it into the synthesis. The 9-vs-70-vs-29 nuance would have been buried otherwise.

---

## Recommended Next Focus

**Convergence reached. No further iterations.** Recommended next command:

1. **`/spec_kit:plan` against this packet** — refine `plan.md` and `tasks.md` per research.md §10 (T009 default seed change, T011 self-heal posture change, T016+T017 new tasks for R-1' quarantine).
2. **`/memory:save`** — index the synthesis into continuity DB; update `description.json` and `graph-metadata.json`.
3. **Phase-2 implementation** — execute T007–T017 sequence per research.md §17.

**DO NOT** initiate iter 8 (loop is at max_iterations cap, full convergence achieved). Phase-3 R-2 grammar-rebuild epic is a separate packet, not a follow-on iteration of this loop.
