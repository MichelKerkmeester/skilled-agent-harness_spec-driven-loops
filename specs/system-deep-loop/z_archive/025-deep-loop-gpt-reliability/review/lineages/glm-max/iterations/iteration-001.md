# Iteration 1: D3 Traceability — cited key_files & graph-metadata parity

## Focus
Dimension: D3 Traceability. Verify that normative claims and key_file citations in the phase-parent packet resolve to shipped artifacts. Scope: spec.md continuity `key_files`, graph-metadata.json `derived.key_files` / `last_active_child_id`, and cross-references from child phases back to root documents.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 5 (spec.md, graph-metadata.json, timeline.md, 007/research/research.md refs, root file inventory)
- New findings: P0=0 P1=1 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.62

## Findings

### P1, Required

- **F001**: Cited key_file `goal-prompt.md` is missing from the packet root, `spec.md:20`
  - spec.md continuity `key_files` (line 20) lists `"goal-prompt.md"` as the FIRST entry. spec.md prose (line 66) directs readers to it: "Full charter for the follow-up investigation: `goal-prompt.md` (this folder) and phase `007` (pending)." The file does not exist anywhere under the packet (`find . -name goal-prompt.md` returns nothing; root inventory has only `before-vs-after.md`, `spec.md`, `timeline.md`).
  - Phase 007's consolidated research synthesis (`007-gpt-behavioral-hardening-research/research/research.md:104`) lists `../goal-prompt.md` as "Goal / operator symptom report" in its References, and its glm-max lineage iterations cite `goal-prompt.md OBSERVED SYMPTOMS` as a primary evidence source (e.g. `007/.../lineages/glm-max/iterations/iteration-001.md:24`, `iteration-006.md:11`, `iteration-008.md:9`). So the document was a real input to the packet's central research, not a stale pointer.
  - graph-metadata.json `derived.key_files` (lines 53-62) correctly OMITS `goal-prompt.md` (it lists the other 5 docs + plugin files), confirming the file was already absent at the last derive. The divergence between spec.md continuity key_files and graph-metadata key_files is itself a symptom of the gap.
  - [SOURCE: spec.md:20,66; graph-metadata.json:53-62; 007/.../research/research.md:104; root `ls`]

### P2, Suggestion

- **F002**: graph-metadata `last_active_child_id` is stale — points at phase 007, not the last-worked phase 017, `graph-metadata.json:137-138`
  - `derived.last_active_child_id` = `.../007-gpt-behavioral-hardening-research`, `last_active_at` = `2026-07-01T05:45:00.000Z`. timeline.md (epoch five, lines 100-105) shows the actual last work was phase 017 at 19:43-19:55. Resume/handover surface would re-anchor on the wrong phase.
  - [SOURCE: graph-metadata.json:137-138; timeline.md:100-105]

- **F003**: spec.md prose calls phase 007 "(pending)" after it is marked Complete, `spec.md:66`
  - Line 66 reads "...and phase `007` (pending)." The Phase Map (spec.md:84) and timeline record phase 007 as Complete. Stale narrative left over from the pre-007 writing window.
  - [SOURCE: spec.md:66,84]

- **F004**: spec.md continuity key_files and graph-metadata derived.key_files disagree, `spec.md:20-25` vs `graph-metadata.json:53-62`
  - spec continuity lists `goal-prompt.md` (missing) and omits `.opencode/plugins/mk-deep-loop-guard.js`, `.opencode/plugins/README.md`, and `spec.md`. graph-metadata lists the plugin files + spec.md but omits goal-prompt.md. Two sources of truth for "key files" diverge. (F001's missing file is the most consequential element of this divergence.)
  - [SOURCE: spec.md:20-25; graph-metadata.json:53-62]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:20,66; graph-metadata.json:53-62 | Normative key_file citation does not resolve to a shipped artifact (goal-prompt.md missing). Partial, not fail, because the claim is about documentation presence and the rest of the cited files exist. |
| checklist_evidence | pending | hard | - | Scheduled for a later iteration (read across phase checklists). |

## Assessment
- New findings ratio: 0.62 (4 new findings, 1 P1 severity-weighted; high novelty for an opening traceability pass)
- Dimensions addressed: traceability
- Novelty justification: This is the first dimension pass; all 4 findings are net-new. F001 (missing primary source doc) is the highest-value discovery and was independently confirmed via both the spec citation and the 007 research's reliance on it.

## Ruled Out
- graph-metadata as the source of the missing-file error: ruled out — graph-metadata correctly omits goal-prompt.md, so it is spec.md continuity that is wrong, not the derived metadata. (iteration 1, evidence: graph-metadata.json:53-62)

## Dead Ends
- None this iteration.

## Recommended Next Focus
- Dimension: D1 Correctness — audit the decision-record rationale chains (phase 006 FIX-5 closure, phase 010 operator override, phase 013 checkpoint) and phase-map status/implementation-summary consistency for logical contradictions or completion-metadata drift.

---

### Claim Adjudication Packet (F001)

```json
{
  "findingId": "F001",
  "claim": "Cited key_file goal-prompt.md is missing from the packet root despite being referenced in spec.md continuity key_files, spec.md prose, and phase 007 research as a primary symptom-report source.",
  "evidenceRefs": [
    "spec.md:20",
    "spec.md:66",
    "007-gpt-behavioral-hardening-research/research/research.md:104",
    "007-gpt-behavioral-hardening-research/research/lineages/glm-max/iterations/iteration-001.md:24",
    "graph-metadata.json:53-62"
  ],
  "counterevidenceSought": "Ran find . -name goal-prompt.md across the whole packet (none found). Checked the git-adjacent timeline.md and before-vs-after.md for an inlined copy of the goal content (neither contains it). Confirmed graph-metadata derived.key_files omits it, so the derive step also saw it absent. Checked whether 007's research-prompt.md absorbed the goal content — it is the charter, not the goal doc.",
  "alternativeExplanation": "The goal-prompt could have been intentionally deleted after research consumed it, making this a deliberate cleanup rather than a gap. Rejected: spec.md continuity key_files still lists it as a current key_file, and the packet is declared complete with no deletion note in timeline or decision records. A complete packet should not cite a missing primary source.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If a decision-record or timeline entry documents the intentional removal of goal-prompt.md as obsolete (and spec.md continuity is updated to drop it), downgrade F001 to P2 doc-hygiene.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery — cited primary source artifact absent from a complete packet" }
  ]
}
```

Review verdict: CONDITIONAL
