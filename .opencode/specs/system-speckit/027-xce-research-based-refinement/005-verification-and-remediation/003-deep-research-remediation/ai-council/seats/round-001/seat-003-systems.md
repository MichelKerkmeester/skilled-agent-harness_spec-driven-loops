---
round: 1
seat: seat-003
executor: inline-sequentialthinking
lens: "Systems / Maintainability (temp 0.4)"
status: ok
timestamp: "2026-06-13T00:00:00Z"
simulated: true
---
# Seat 003 — Systems / Maintainability

## Distinct mandate
Optimize for long-term coherence, cluster-level sequencing, and avoiding orphaned half-fixes. Ensure the follow-on packet is structured so design-first work stays doable (not punted into a junk drawer). Risk focus: doc patches that drift again because the underlying code stays dishonest; interlocked clusters fixed piecemeal.

## Proposed plan (structure-first)
A) Treat L7 Cluster A as ONE design unit: deliverable-1 = the honesty patch (explicit skipped-cycle + catalog inert), deliverable-2 = the privacy pool (operator-gated). Ship in the same follow-on, in that order, so the catalog never claims what the code doesn't do. (Beats piecemeal honesty-now/pool-elsewhere, which orphans the claim.)
B) Cluster B (tri-012/tri-133 promotion enforceability): SPECKIT_ADVISOR_SHADOW_MODE was just removed as dead (tri-039). Strong default = STAY RETIRED. Design question collapses to "is there any live consumer of promotion criteria post-tri-039?" If none (likely), DEFER-BY-DESIGN -> retire the dead plumbing + docs. Cheaper and more coherent than building computable criteria for a retired feature. (Verify-no-consumer step required — do not assume.)
C) Cluster C (tri-011/115/136): tri-011 is sharp — shadow/blocked feedback-retention mode PAUSES baseline TTL deletion (memory-retention-sweep.ts returns swept:0 before the delete path). An observe-only learning flag silently changes production retention enforcement. Code-careful (governance/deletion). DESIGN-FIRST-FAST, hand-implemented + adversarial verify.
D) tri-163 crosswalk (+tri-164 DUPLICATE) and the eval harnesses (tri-129 write-path stress, tri-135 live-dim eval) are FEATURE GAPS / test-infra, lowest urgency. DEFER-BY-DESIGN; none block anything.

## Follow-on packet structure (core contribution)
Not a flat ~24-item junk drawer — 4 design-units + 1 closed doc-wave:
- Unit 1 (honesty doc-wave): DONE inside 029-close (the DO-NOW batch).
- Unit 2 (vector storage truth): tri-010 (fix first) + tri-105 (SSOT) [+ tri-106 doc done in wave]. Design-doc: which surface is canonical.
- Unit 3 (shadow/feedback honesty): Cluster A (patch shipped + pool ESCALATED), Cluster B (retire-default), Cluster C incl. tri-011.
- Unit 4 (launcher parity): tri-148 — ESCALATE (likely document-the-asymmetry).
- Loose hardening (DEFER, no urgency): tri-163, tri-129/135, tri-072/073/119, tri-104, tri-138, L3 replay-time-validity.

## Reasoning
The dispatch explicitly asked for per-cluster recommendations + the design question each. Structuring by design-unit directly answers that and prevents the doc-drift a piecemeal approach risks. Interlocks are real (L7 says so; vector items share a root cause).

## Risks & trade-offs
Risk of gold-plating the follow-on with 4-unit ceremony for P2/P3 items. Mitigation: the items are genuinely interlocked, so the structure is load-bearing, not decorative.

## Assumptions and evidence gaps
Cluster B "retire-default" assumes no live consumer — flagged as a verify-step in the design question, not a settled assumption.

## Alternative challenged
Rejected "just track them and pick them off" — piecemeal fixes on interlocked clusters re-introduce drift and orphan catalog claims.

## Confidence
90: Strongest on follow-on structure + interlock sequencing; the direct answer to the question asked.
