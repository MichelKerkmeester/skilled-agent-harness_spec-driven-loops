# Iteration 6: ADR And Checklist Governance Gaps

## Focus

Audit ADR/checklist presence for ADR-style phases and validation/completion gates.

## Findings

1. The entire packet contains only one `decision-record.md`, under `003-deep-loop-workflows/002-convergence-profile-unification-adr/`, and no `checklist.md` files anywhere under `030-agent-loops-improved` [SOURCE: Glob `.opencode/specs/deep-loops/030-agent-loops-improved/**/decision-record.md`; SOURCE: Glob `.opencode/specs/deep-loops/030-agent-loops-improved/**/checklist.md`]. For a packet with multiple Level 2/3 and ADR-style Complete phases, this is a systemic completion-governance gap.

2. `003/002-convergence-profile-unification-adr` is Level 3, Status Complete, and explicitly requires an ADR document plus validate/parity evidence [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/002-convergence-profile-unification-adr/spec.md:41`-`.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/002-convergence-profile-unification-adr/spec.md:52`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/002-convergence-profile-unification-adr/spec.md:122`-`.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/002-convergence-profile-unification-adr/spec.md:132`]. It has the one decision record, but no packet checklist, and its spec continuity still says `completion_pct: 0` and `next_safe_action: "Draft the ADR document and parity test before any migration"` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/002-convergence-profile-unification-adr/spec.md:11`-`.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/002-convergence-profile-unification-adr/spec.md:29`].

3. `003/003-cross-mode-anti-convergence-adr` is Level 2 and Status Complete, but no decision record exists for it. Its title and trigger phrases call it an ADR, and it scopes a cross-mode contract/optimizer invariant decision [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/003-cross-mode-anti-convergence-adr/spec.md:1`-`.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/003-cross-mode-anti-convergence-adr/spec.md:9`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/003-cross-mode-anti-convergence-adr/spec.md:40`-`.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/003-cross-mode-anti-convergence-adr/spec.md:52`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/003-cross-mode-anti-convergence-adr/spec.md:67`-`.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/003-cross-mode-anti-convergence-adr/spec.md:72`]. Recommendation: add or regenerate `decision-record.md` and an evidence checklist for every ADR-labeled Complete phase.

4. `003/005-anchor-ownership-conflict-adr` is also Level 2 and Status Complete with ADR title/trigger phrases and reducer ownership decisions, but no decision record or checklist exists [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/005-anchor-ownership-conflict-adr/spec.md:1`-`.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/005-anchor-ownership-conflict-adr/spec.md:9`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/005-anchor-ownership-conflict-adr/spec.md:40`-`.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/005-anchor-ownership-conflict-adr/spec.md:52`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/005-anchor-ownership-conflict-adr/spec.md:66`-`.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/005-anchor-ownership-conflict-adr/spec.md:72`].

5. `002/008-loop-lock-single-flight-decision` is Level 3, Status Complete, and its handoff criteria say an ADR was written/merged [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/002-deep-loop-runtime/008-loop-lock-single-flight-decision/spec.md:45`-`.opencode/specs/deep-loops/030-agent-loops-improved/002-deep-loop-runtime/008-loop-lock-single-flight-decision/spec.md:56`], but no `decision-record.md` exists in that phase per the packet-wide decision-record glob. The ADR content may be embedded in `spec.md`, but the packet framework expects separate decision artifacts for Level 3; current state makes ADR discovery inconsistent.

## Sources Consulted

- Glob for `decision-record.md` under packet
- Glob for `checklist.md` under packet
- `003/002-convergence-profile-unification-adr/spec.md`
- `003/003-cross-mode-anti-convergence-adr/spec.md`
- `003/005-anchor-ownership-conflict-adr/spec.md`
- `002/008-loop-lock-single-flight-decision/spec.md`
- Grep for ADR/checklist/status/completion under `003-deep-loop-workflows`

## Assessment

- newInfoRatio: 0.55
- Novelty justification: This added packet-governance evidence around missing ADR/checklist artifacts, though it overlaps with stale completion metadata.
- Confidence: High for missing file presence; medium for whether embedded spec ADR text was intentionally accepted as a substitute.

## Reflection

- What worked: Glob checks gave definitive file-presence evidence.
- What failed: Some phases may intentionally embed ADR text in `spec.md`, but that exception is undocumented.
- Ruled out: Assuming the single `decision-record.md` covers all ADR phases; it is scoped only to convergence-profile unification.

## Recommended Next Focus

Audit code/runtime hardening opportunities beyond known defects: observability, safety, and validators to prevent recurrence.
