---
title: "Decision Record: D3 efficiency is not-applicable when a positive scenario routes nothing"
description: "ADR-001 records why routed-nothing positive scenarios return a null D3 (efficiency undefined) rather than a full-marks 1.0 salvage, and why that is the honest scoring choice — with the Mode-B semantic-holdout evaluation noted as a follow-on."
trigger_phrases:
  - "d3 routed nothing null"
  - "efficiency undefined salvage"
  - "holdout scoring honesty"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/018-routed-nothing-efficiency-na"
    last_updated_at: "2026-07-11T22:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "ADR-001 accepted; scoreD3 routed-nothing salvage removed"
    next_safe_action: "Complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl/062-routed-nothing-efficiency-na"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: D3 efficiency is not-applicable when a positive scenario routes nothing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Return a null D3 for routed-nothing positive scenarios instead of a 1.0 salvage

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | Operator + Claude (this session) |
| **Supersedes** | n/a (first ADR for this packet) |

---

<!-- ANCHOR:adr-001-context -->
### Context

Packet 061 added the fitted/holdout split and a `generalizationGap`, which surfaced a 69-point gap on cli-opencode and mcp-click-up (fitted 100 / holdout 31). Tracing it: every holdout scoring exactly 31 has `routedCount === 0` and `d3.score === 1`. `scoreD3` returns `score: 1` for a positive scenario that routed nothing ("nothing routed, nothing wasted"). Since D1-intra and D2 are 0 for a total miss, the spurious D3=1 floors the weighted row at `(0·13 + 0·20 + 1·15) / 48 ≈ 31`.

A blast-radius scan across every corpus, split by stage, found the salvage fires on 0 fitted routing scenarios, 0 negatives, and 5 holdout scenarios — the decontaminated prompts the keyword router cannot match. So the salvage only ever softens genuine routing failures, and it does so exactly where an honest generalization signal matters most.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

Make routing efficiency **not-applicable** when a positive scenario routes nothing. `scoreD3` returns `{ score: null, proxy: 'no-routing' }` (past the negative and no-positive-gold guards). `modeAScore` already drops a null dimension, so the row normalizes over D1-intra + D2 alone and a total recall miss scores an honest 0.

This is the same convention `scoreD3` already uses for the no-positive-gold case (efficiency is unmeasurable, so it returns null) — extended to the symmetric case where there IS gold but nothing was routed. The negative branch (routing nothing is suppression success) and the over-routing computation are untouched.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Return null (efficiency N/A)** | Row scores on recall alone; consistent with the existing no-gold branch; a total miss scores an honest 0; 0 fitted impact | Slightly widens the reported gap (more honest) | CHOSEN |
| **Keep score 1 (current)** | No change | Rewards a total recall failure with perfect efficiency; floors real generalization failures at 31, masking them | Rejected |
| **Return score 0** | Also yields 0 for the common case | Wrong semantics: efficiency isn't "0" when nothing routed, it's undefined; would over-penalize a row whose intent-null gives partial D1-intra credit | Rejected |
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- Routed-nothing holdouts now score 0 (honest total-miss) instead of 31; routed-something holdouts are unchanged. Generalization gaps become honest: cli-opencode / mcp-click-up 69 → 100 (the keyword router routes nothing for these decontaminated prompts), while cli-external (84) and mcp-figma (100) are unmoved.
- Every fitted aggregate is byte-identical (0 fitted scenarios route nothing), so no verdict moves and the 061 shipped numbers stand.
- A future fitted scenario that routes nothing will now score honestly (0) rather than being floored at 31.
- Follow-on (out of scope): decontaminated / `blindToRouterKeywords` holdouts are designed for semantic evaluation; a keyword-only Mode-A router scoring them 0 is honest but is not a live-model generalization score. Wiring Mode-B holdout evaluation would let the gap reflect model generalization rather than keyword-router coverage.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The salvage floors real routing failures at 31 and misreports the generalization gap |
| 2 | **Beyond Local Maxima?** | PASS | null / keep-1 / score-0 framed with a decision criterion |
| 3 | **Sufficient?** | PASS | One guard makes routed-nothing honest; re-baseline proves no fitted regression |
| 4 | **Fits Goal?** | PASS | Restores honest holdout/generalization numbers without disturbing fitted scores or verdicts |
| 5 | **Open Horizons?** | PASS | Leaves Mode-B semantic holdout evaluation as a clean follow-on |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `scoreD3`: add a `routed === 0` guard (past negative + no-gold) returning `{ score: null, proxy: 'no-routing' }`.
- A unit test: positive scenario with empty router result → `d3.score === null`, `modeAScore === 0`.

**How to roll back**: `git checkout -- score-skill-benchmark.cjs` restores the `routed === 0 ? 1` salvage. If a re-baseline ever shows a fitted-aggregate change, a fitted scenario routes nothing and the fix should be re-scoped to holdout-stage rows only.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
