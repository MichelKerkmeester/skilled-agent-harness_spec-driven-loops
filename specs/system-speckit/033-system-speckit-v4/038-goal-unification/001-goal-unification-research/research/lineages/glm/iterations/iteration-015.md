# Iteration 15: Synthesis — ranked verdicts per D1-D7: agree, correct, overturn (D1-D7)

- **Lineage:** glm (cli-pi, glm-5.3-flash) - Program iteration 15 of 15, run 5 of 5 (charter allocation row 15). Terminal iteration of the 15-iteration program.
- **Status:** `thought` — analytical-only; no evidence gathering (the enum's designated use). The five Evidence iterations (it-011…014) scored 0.6/0.55/0.65/0.7; this iteration ranks their outputs into per-decision verdicts and writes the lineage's `research.md`.

## Actions Taken

1. Re-read the four Evidence iterations' correction ledgers (6 + 5 + 9 + 7 = 27 recorded corrections) and their confirmation tables.
2. Ranked the seven decisions by (degree of correction × verification confidence), not by decision number.
3. Reconciled the it-010 open-gap list against it-011…014 (3 of 5 closed, 2 materially advanced).
4. Wrote `../research.md` — the terminal synthesis, `stop_reason: maxIterationsReached`.

## The ranked verdicts (full细节 in research.md §2)

| Rank | Decision | Run-2 verdict vs run 1 | What changed |
|---|---|---|---|
| 1 | **D6 budget** | **CORRECTED** | Recommendation changed: O8-A → O8-B (two-tier), on 036's own numbers (3,393-3,732 = 113-124% of 3,000, 93% of 4,000, at `completion_pct: 5`, 036:28). Mechanism story corrected: the prompt ceiling is the dynamic :417-418 label-clamp (≈3,875-3,910), not the 1900 constant nor the compact path; ≈2900 refuted; the 576-preview truncation is LIVE (1,182 vs 576). |
| 2 | **D3 strip** | **AGREE WITH CORRECTIONS** | O2-B (marker slice) survives; the payload wording ("full text of this file", tmpl:56-59 / playbook:74-75) vs the trigger ("anything above the log") resolved to the durable slice on three witnesses — and 036's own hand-rendered copy (036:62) already words it correctly; the fence-omission drift + the missing-anchor fallback both noted from the live fixture. |
| 3 | **D4 resend** | **AGREE WITH CORRECTIONS** | O4-A (edge trigger on the slice hash) survives; 029's exclusions (:71-72) are the design's boundary — detection mechanized, paste-verification still excluded; the criterion-5 (036:99) vs read-only-resume whitelist (resume.md:4) conflict is now NAMED, as 036:85-86 itself requires. |
| 4 | **D1 binding** | **AGREE (grounding corrected)** | O1-B survives; the carrier claim corrected (a prompt-side writer exists alongside the stop writer — two in-repo comments; identity inferred); the ADR constraint lines re-anchored (:65/:72/:73/:85/:87); `packet_pointer` (036:14) found as the existing adoption-able vocabulary. |
| 5 | **D7 isolation/authority** | **AGREE (grounding corrected + strengthened)** | The shared-directive/per-session split survives reconciliation; 009:50/:54 and ADR:129 supply the one-resolver+canary constraint; the template's naming rule (tmpl:77-78) is the pre-existing ratification principle; 009's own status is "delivery freshness pending" (009:64) — recorded. |
| 6 | **D5 runtimes** | **AGREE (substance), citations corrected** | 16/16 claims verified; 0 overturned; 4 anchors relocated (README:66/67/69-70/25), the Devin enumeration completed (4 events), the plugin's 3-spelling identity + duplicated budget policy found; the pi host-cap UNKNOWN stands, now with a recorded negative. |
| 7 | **D2 store fate** | **AGREE (untouched)** | O3-B (demote to per-session index + telemetry) survives uncontested; +1 migration fact: redirected stores never adopt legacy scoped keys (goal-core.cjs:195). |

**Bottom line: run 2 overturns no chosen option. It corrects the evidentiary foundations of five decisions (D1, D3, D4, D5, D7), changes one recommendation (D6), and leaves one untouched (D2).**

## Assessment

- `newInfoRatio`: 0.5 — the ranked cross-lineage verdict table is new to the packet; the underlying evidence was scored by it-011…014.
- The 15-iteration program terminates here: 10 iterations of discovery (run 1), 5 of verification (run 2), no early convergence honored (per D7 of the packet's own decisions, 036:57).
- The open-gap ledger closes 3 of 5 (G3 unbound→REQ-012; G5→measured 3,393-3,732; G4→resolved-in-principle via the naming rule) and advances 2 (G1: recorded negative; G2: the :391 fallback seam + the duplication finding).

## What this iteration did not do

No evidence calls; no writes outside the lineage directory; the deviations column of the synthesis (`deviation`) records the same gateway-unavailable note the state log has carried since its `initialized` event.
