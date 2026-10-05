---
title: "Iteration 3: Shortened drafts of communication.md and evidence-and-proof.md"
trigger_phrases: []
---
# Iteration 3: Shortened drafts of communication.md and evidence-and-proof.md

## Focus

Steer iteration 3: shortened drafts of `.skilled/repo-rules/communication.md` and `.skilled/repo-rules/evidence-and-proof.md`, written inside this lineage only, each with a ledger giving per sentence or part: keep or drop, enforcement kept or lost, bytes.

Method: apply iteration-2 patterns P1–P10 conservatively — every prohibition, procedure, test, taxonomy and checklist survives verbatim or compressed with its operative content intact; the cuts are apparatus (P4), provenance (P8), restatement (P9), justification tails (P1/P7), duplicate pointers (P2) and elaboration. Both drafts were written in the corpus's own voice and verified: zero em dashes, and the only semicolons present are ones inherited verbatim from the originals (4 in communication, 3+list-items in evidence-and-proof — the originals carry the same).

## Findings

### Drafts produced

| draft | original | draft | cut | ledger |
|---|---:|---:|---:|---|
| `drafts/communication.md` | 11,458 B | 8,279 B | −27.8% | `drafts/communication.ledger.md` |
| `drafts/evidence-and-proof.md` | 11,823 B | 10,465 B | −11.5% | `drafts/evidence-and-proof.ledger.md` |

Section-level byte accounts for both drafts are in the ledgers (measured by `## ` heading spans, consistent with the iteration-1 block method).

### What the drafts actually cut (the honest ledger headline)

**communication.md −27.8%.** Cuts: routing precedence clause (P4, ~123 B), §8 provenance (~170 B), table-block justification "reads as a form / parse a grid" (~250 B, P1), three restatements of the length norm collapsed to one keeping the effort axis (~400 B, P9), three duplicate "same floor" pointers (~170 B, P2), all ten failure-prevents tails (~1,200 B), meta sentences and glosses (~400 B), §4 spec-syntax tightening (~190 B). Every prohibition, test, exception and the six-offender enumeration survives verbatim; all 12 self-check items kept (P3-B).

**Enforcement actually lost — three named edge clauses (~145 B total):**
1. §7 "a step that is itself a paragraph is two steps that were not split" (~70 B) — merge/split edge case.
2. §8 "a count line is not an item" (~30 B) — exemption boundary.
3. §10 "the reader decides whether it happens" (~45 B) — decision-rights clause.
Plus all failure-*naming* sentences (motivation, not norms). If this draft shipped, restoring those three clauses costs ~145 B — the only place the ledger shows a real coverage narrowing.

**evidence-and-proof.md −11.5%.** Cuts: routing clause (~123 B), §1 triplicate receipt-principle deduplicated (~600 B — the test survives with all four shapes and repairs), the `grep` NUL narrative compressed (~90 B), §10 intro/glosses (~140 B), §11 elaboration + §8 cross-ref tail (~260 B), §6 framing sentence (~63 B). Enforcement loss: **≈zero** — every tier definition, test, checklist (§9 gate + §12 audit, both kept verbatim), disclosure requirement and verdict survives.

### The correction to iteration 2 (measured, not assumed)

The modelled per-rule keep-rates implied e-and-p → ~8,500 B (−28%). The draft floor is 10,465 B (−11.5%): applying the modelled rates would have eaten ~2,000 B of operative content — both checklists and body norms. **Compression floor tracks rule-statement share, not a global rate**: e-and-p (64%) and root-cause (65%) bottom out near −10–15%; communication (43% rule-statement, plus 1,239 B failure-prevents + 695 B what-not + 1,228 B self-check apparatus) goes to −28%. The −28% corpus estimate survives only as a weighted mix, not a per-file promise.

Combined with the card test, this completes the enforcement picture the loading lineage needed:

- **Card-only load keeps the headline norm, drops every operative prohibition** — safe only for umbrella files (skill-hub, answer-the-actual-request).
- **Full-file concision keeps everything, saves ~11–28%** — the drafts prove the floor.
- **Card + self-check is the middle path nobody designed**: communication.md's card (1,809 B) + its checklist (1,219 B) = ~3,030 B and retains every norm in checkable form — but loses the offender enumeration and the plain re-render spec, i.e. it would pass the checklist test yet fail to carry the *content* the checklist audits. A slim card answers "did you apply it" without carrying "apply what, exactly" — the checklist compresses the norms' shape, not their content.

## Questions Answered

- Shortened drafts with ledgers: produced inside the lineage at `drafts/`, per-part keep/drop, enforcement kept/lost, bytes measured per section.
- What does shortening cost? For communication.md: three edge clauses (~145 B) plus all failure-naming sentences. For e-and-p: ≈nothing — the file is already near its normative floor.
- Whether the corpus's −28% model holds per-file: no — floor tracks rule-statement share.

## Questions Remaining

- Whether the three lost edge clauses matter in practice (a step that is a paragraph; a count line as item; reader-decides on tangents) — UNKNOWN, unmeasured; restoring them costs ~145 B.
- Whether failure-naming sentences contribute to compliance (motivational vs normative for a model) — UNKNOWN; the drafts drop them all, so the draft is also the test artifact for that question.

## Ruled Out

- Cutting self-check to hit the modelled target (would have eaten the enforcement carrier — P3-B direction confirmed by draft).
- Cutting §9 final-state checklist in e-and-p (it is a gate procedure, not a restatement).
- Relocating trigger_phrases inside these drafts (P5 is a loading-side change; drafts keep the authoring contract intact).

## Assessment

- `newInfoRatio`: `0.80`
- Novelty justification: the drafts convert pattern-list claims into measured, auditable files with named enforcement losses (three clauses for communication, zero for e-and-p) and falsify the uniform −28% model with a measured floor tied to rule-statement share.
- Confidence: high on bytes (all spans measured); medium on "enforcement lost ≈ zero for e-and-p" (every norm traced through the ledger, but behavioural confirmation is unmeasured — UNKNOWN).

## Reflection

- Worked: writing the drafts in the corpus's own voice and then grepping for banned punctuation caught five self-introduced semicolons before the ledger was written — the rules applied to their own rewriting.
- Worked: section-level byte accounting (heading spans) made the ledger rows trivially auditable against the drafts.
- Correction: iteration 2's uniform keep-rate model over-predicted compression for dense files; the draft floor corrected it — the right output of an experiment.

## Recommended Next Focus

None — maxIterations (3) reached; proceed to synthesis with `stopReason: "maxIterationsReached"`. Residual open thread for the parent spec: whether the three named edge clauses and the failure-naming sentences should be restored in any shipped rewrite (~145 B + ~1,200 B), and whether card+checklist slim loading is worth a mechanism.

## Sources Consulted

- [SOURCE: steer.md (lineage dir)]
- [SOURCE: .skilled/repo-rules/communication.md (full read)]
- [SOURCE: .skilled/repo-rules/evidence-and-proof.md (full read)]
- [SOURCE: iterations/iteration-001.md; iterations/iteration-002.md]
- [SOURCE: scratch/classify-parts.py; scratch/parts-dump.txt]
- [SOURCE: prep/evidence-pack.md:19-26,45-51]
- [SOURCE: drafts/communication.md, drafts/evidence-and-proof.md + measured section spans this iteration]
