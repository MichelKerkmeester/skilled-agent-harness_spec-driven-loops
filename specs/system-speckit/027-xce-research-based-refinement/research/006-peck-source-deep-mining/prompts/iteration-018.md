DEEP-RESEARCH — CROSS-MODEL PROPOSAL REVIEW (MiniMax M3)

# Iteration 018 — Independent second opinion on the sub-packet proposal

## Task
A gpt-5.5-fast run produced `sub-packet-proposal.md` proposing three new 027 children (009 verification-discipline, 010 benchmark-substrate, 011 acceptance-coverage-gate), two coordination items folded into PENDING children 003/004, and a deferred list. Independently REVIEW the decomposition and either endorse it or propose a better structure.

## Instructions
1. Read: `specs/system-spec-kit/027-xce-research-based-refinement/research/006-peck-source-deep-mining/sub-packet-proposal.md` (the proposal), `027.../spec.md` (PHASE DOCUMENTATION MAP), `027.../research/005-live-rescope-coco-purge/research.md` (the live memory re-plan), `027.../research/006-peck-source-deep-mining/research.md` §2-§4.
2. Assess each decision and give AGREE / DISAGREE / REFINE with reasoning:
   - D1: three separate packets (009/010/011) vs merging or splitting differently.
   - D2: numbering 009/010/011 (000-008 occupied; avoid the 000 placeholder + internal 008/002 gap).
   - D3: land 010 (benchmark substrate) FIRST as the test substrate.
   - D4: fold T14/T12 residue into PENDING 003/004 rather than new packets.
   - D5: T1 as its OWN packet (011) vs a sub-phase of 009.
   - D6: sequencing independent of the 005 memory re-plan.
3. Flag any ordering/dependency error, scope overlap, or level mis-assignment.

## Do's
- READ-ONLY. Cite every claim as `file:line`. Max ~12 tool calls.
- Give a concrete verdict per decision; if you DISAGREE, propose the specific alternative.
- Sanity-check the numbering and non-conflict claims against the actual 027 map.

## Don'ts
- Do NOT modify, create, or write any file (the orchestrator integrates your review).
- Do NOT just endorse — look for a genuinely better decomposition or a missed dependency.
- Do NOT dispatch sub-agents; do NOT exceed 12 tool calls.

## Examples
Output exactly:
### DECISION_REVIEW
`[R-018-D1..D6] AGREE|DISAGREE|REFINE — <decision> — reasoning + `file:line` — (if DISAGREE/REFINE) the alternative`
### OVERALL
ENDORSE | ENDORSE-WITH-CHANGES | REWORK — 1-2 sentences. List any must-fix before scaffolding.
### METRICS
agreement: AGREE | MIXED | DISAGREE (overall vs the proposal)
newInfoRatio: <0.0-1.0>
status: complete
sources: <file:line list>

## Context
- Cross-model proposal review (MiniMax M3) of a gpt-5.5-fast deliverable. The proposal is a planning artifact — nothing is implemented.
- Spec folder `specs/system-spec-kit/027-xce-research-based-refinement` pre-approved; skip Gate 3 — you write NOTHING.
