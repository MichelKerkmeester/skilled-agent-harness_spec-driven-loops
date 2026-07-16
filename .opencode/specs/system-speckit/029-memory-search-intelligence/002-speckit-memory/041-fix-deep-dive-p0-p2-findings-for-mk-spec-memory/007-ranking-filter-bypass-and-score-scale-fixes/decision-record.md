---
title: "Decision Record: Phase 007 - Ranking Filter Bypass and Score Scale Fixes"
description: "ADRs for the normalization headroom approach, the trigger-weight policy, and the per-cluster flag and rollout strategy governing the ranking fixes."
trigger_phrases:
  - "ranking filter bypass"
  - "score scale fixes"
  - "flag read root cause"
  - "normalization headroom"
  - "trigger weight policy"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/007-ranking-filter-bypass-and-score-scale-fixes"
    last_updated_at: "2026-07-04T17:51:13.944Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 planning docs from deep-dive research sources"
    next_safe_action: "Capture baselines, then run the confirm-before-fix pass on 🟡 findings"
    blockers: []
    key_files:
      - "decision-record.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-007-ranking-filter-bypass-and-score-scale-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 007 - Ranking Filter Bypass and Score Scale Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Normalization Headroom via a Sub-1.0 Band

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester |

---

<!-- ANCHOR:adr-001-context -->
### Context

Min-max normalization in stage2 fusion maps the top candidate to exactly 1.0. Every boost that runs after normalization clamps at 1.0, so boosts are structurally inert at the top ranks and ties resolve by hash or row id (findings-ledger, Agent C P2). The dominant post-normalization boost makes this concrete: the learned trigger boost is a large ADDITIVE term (+0.7, `learned-feedback.ts:75`) applied as `Math.min(1.0, currentScore + learnedBoost)` at `stage2-fusion.ts:843`. Any two rows that both receive it and start above ~0.3 both saturate at the 1.0 clamp and re-tie - the exact "ties resolve by hash" bug REQ-016 claims to fix. A sub-1.0 band alone does NOT fix this: normalizing into 0-0.95 still leaves a +0.7 additive boost far exceeding the 0.05 headroom, so both boosted rows still clamp to 1.0. The damage spreads: the HyDE gate compares an absolute 0.45 threshold against scores whose max is always 1.0, so it can never fire while any candidate exists (Agent D P1, hyde.ts:88), and an all-equal fusion input collapses to a flat all-1.0 output. We needed to restore boost headroom without breaking the documented 0-to-1 score envelope AND without leaving the additive-boost saturation unresolved.

### Constraints

- The score envelope stays inside 0 to 1; downstream consumers and telemetry assume that range.
- Thresholds tuned against the pinned scale (MIN_MATCH_THRESHOLD, HyDE 0.45, degradation 0.02) must be inventoried and reviewed in the same change, per the plan.md FIX ADDENDUM.
- A band constant alone is insufficient: the additive +0.7 learned boost (`stage2-fusion.ts:843`) must ALSO be reconciled with the band, or two boosted rows re-tie at 1.0 and the ADR ships the very bug it targets.
- **Precondition (006 gate):** this is a ranking-order change, not a correctness fix. Phase 006 owns the rescue-layer authority decision; if 006 chooses Option A (rescue stays the ranking authority, lexical dominance kept), ADR-001 is WITHDRAWN as moot BEFORE the threshold-consumer inventory runs, so R-002's migration cost is never paid for a no-op. ADR-001 only proceeds when 006 keeps ranking-order signals load-bearing.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: normalize fused scores into a sub-1.0 band (working constant 0.95, final value set by A/B on the 006 parity harness) AND rescale post-normalization boosts so they operate inside the remaining headroom instead of adding raw then clamping at 1.0. Both pieces are required; the band without the boost rescale re-ships the re-tie bug.

**How it works**: the stage2 min-max step scales into 0 to BAND instead of 0 to 1.0. The additive learned boost at `stage2-fusion.ts:843` changes from `Math.min(1.0, score + boost)` to a headroom-proportional application - the boost moves a row a fraction of the distance from its score toward BAND (for example `score + boost * (BAND - score)`), so two boosted rows separate by their base signal instead of both saturating at the clamp. Demotions apply symmetrically inside the band. We chose rescale-into-the-band over shrink-the-band because shrinking far enough to leave raw +0.7 additive headroom (band <= 0.3) would crush the base similarity signal; rescaling keeps the base signal intact and still makes boosts reorder. The threshold-consumer inventory runs first, and every absolute threshold is re-based or explicitly confirmed against the new band.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Sub-1.0 band + boost rescale (chosen)** | Boosts become visible at top ranks; envelope preserved; base similarity signal kept intact; resolves the additive +0.7 re-tie directly | Two coordinated changes (band constant + boost-application rewrite at `stage2-fusion.ts:843`); threshold consumers need review; band constant needs A/B | 8/10 |
| Band only (no boost rescale) | Truly one-site change | Does NOT fix the additive +0.7 saturation - two boosted rows still re-tie at 1.0, shipping the exact bug REQ-016 targets | 3/10 |
| Shrink the band far enough for raw additive boosts (band <= 0.3) | No boost-application change | Crushes the base similarity signal into a narrow range; over-compresses real relevance | 4/10 |
| Apply boosts pre-normalization | No band constant; ordering survives normalization | Touches every boost site; interaction with the rescue overlay gets murky; much larger diff | 6/10 |
| Keep pinning, retire the boosts | Honest about today's behavior | Contradicts the phase goal; wholesale signal retirement belongs to phase 006 | 3/10 |

**Why this one**: it is the smallest change that makes boosts mean something AND actually resolves the additive-boost re-tie, and it keeps the retirement question where it belongs (006).
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Post-normalization boosts and demotions can reorder the top ranks; ties break by signal instead of hash.
- Dead gates that compare absolute thresholds against a pinned 1.0 (HyDE) become fixable on honest terms.

**What it costs**:
- Every consumer that assumes top equals 1.0 needs a review pass. Mitigation: grep inventory in plan.md FIX ADDENDUM runs before the change, plus adversarial threshold tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Downstream threshold tuned to the old scale silently misfires | H | Inventory plus per-threshold test before merge; eval-delta gate on the 006 harness |
| Band constant chosen badly compresses real signal | M | A/B the constant on the fixed query set before flipping the cluster-3 flag default |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Live telemetry shows boosts computed then discarded; top-pinning is a verified mechanism in the deep-dive report |
| 2 | **Beyond Local Maxima?** | PASS | Pre-normalization boosts and boost retirement were scored as alternatives |
| 3 | **Sufficient?** | PASS | One normalization-site change plus a threshold inventory covers the failure class |
| 4 | **Fits Goal?** | PASS | Directly serves REQ-016 and SC-002 (measurable ranking influence) |
| 5 | **Open Horizons?** | PASS | Band constant is tunable; 006 can still retire signals wholesale later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes** (only when the 006 gate is not Option A):
- `lib/search/pipeline/stage2-fusion.ts`: min-max normalization emits the sub-1.0 band, AND the additive learned-boost application at `:843` becomes headroom-proportional so it no longer saturates at the 1.0 clamp.
- Threshold consumers flagged by the FIX ADDENDUM inventory: re-based or confirmed, each with a test.

**How to roll back**: set the band constant back to 1.0 and restore the additive clamp (single-commit revert) or turn the cluster-3 phase flag off per ADR-003; both restore pre-phase ranking on the next request once cluster 1 lands. If 006 = Option A the ADR is not implemented at all (withdrawn), so there is nothing to roll back.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Trigger-Weight Policy - Normalize Through Fusion

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester |

---

<!-- ANCHOR:adr-002-context -->
### Context

The trigger lane applies a 1.4 weight outside fusion normalization, so a trigger hit outranks a vector hit by roughly 2.3 times on scale alone (deep-dive report, section 3 P2 highlights). In the same area, the keyword lane double-counts documents when BM25 delegates to FTS5, and the ablation-tuned 0.3 and 0.6 channel weights exist as dead code that nothing applies. Agent B's detailed ledger section is still pending, so task T004 confirms the exact mechanics before any edit. We needed one policy for how lane weights participate in ranking.

### Constraints

- Trigger matches carry real user-intent signal, and phase 005 is improving trigger quality; the lane must not be deleted.
- All channels must contribute on the fused scale (the same invariant driving ADR-001).
- Weight values are empirical: the 006 parity harness decides them, not spec constants.
- **Precondition (006 gate):** like ADR-001, this is a ranking-order change, not a correctness fix. If 006 chooses Option A (rescue stays the ranking authority, lexical dominance kept), the trigger contribution never reaches the fused ranking in a load-bearing way, so ADR-002 is WITHDRAWN as moot rather than shipped as an inert re-weighting. The keyword-lane FTS5 dedupe (a correctness fix, not a ranking-order change) still lands either way. ADR-002's trigger-weight normalization only proceeds when 006 keeps ranking-order signals load-bearing.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: route the trigger contribution through fusion normalization as a proper channel weight, with the weight value picked by A/B on the 006 harness.

**How it works**: the 1.4 out-of-band multiplier moves inside the fusion step as a per-channel weight on the shared scale. The keyword lane dedupes FTS5-delegated rows before fusion. The dead 0.3 and 0.6 weights get one disposition in the same commit: wired if the A/B shows they earn rank quality, deleted otherwise. No dead knobs remain.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Normalize through fusion (chosen)** | One scale for all lanes; weight becomes tunable and measurable | Needs an A/B pass to pick the value | 8/10 |
| Keep the out-of-band 1.4 and document it | Zero code change | Repeats the signal-theater pattern; trigger hits keep drowning vector relevance by scale accident | 4/10 |
| Delete trigger weighting entirely | Simplest code | Throws away genuine intent signal that phase 005 is cleaning up | 4/10 |

**Why this one**: it converts an accidental 2.3x dominance into an explicit, measured policy without losing the signal.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Trigger-lane influence becomes proportional and tunable instead of a scale artifact.
- Keyword-lane result counts stop inflating when BM25 delegates to FTS5.

**What it costs**:
- Users accustomed to trigger-dominant ordering may see different top ranks. Mitigation: change ships inside the cluster-3 flag with an eval-delta gate.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent-B mechanics differ from the second-hand description | M | T004 verify-first confirms at the cited sites before edits |
| Chosen weight under-serves resume-style trigger queries | M | Include resume-style prompts in the fixed A/B query set |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 2.3x scale dominance and double-counting are recorded findings feeding REQ-011 and REQ-012 |
| 2 | **Beyond Local Maxima?** | PASS | Keep-and-document and delete options were scored |
| 3 | **Sufficient?** | PASS | Channel-weight plus dedupe covers the lane-scale failure class |
| 4 | **Fits Goal?** | PASS | Serves SC-002 measurable ranking and the one-scale invariant |
| 5 | **Open Horizons?** | PASS | Weight stays tunable per intent profile later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `lib/search/pipeline/stage2-fusion.ts`: trigger channel weight inside fusion (006-gated ranking-order change); keyword-lane dedupe (correctness fix, lands either way); dead-weight disposition.
- `lib/cognitive/adaptive-ranking.ts`: adaptive-fusion divisor fix confirmed by T004.

**How to roll back**: revert the cluster-3 commit or turn the cluster-3 phase flag off; both restore the out-of-band multiplier behavior. If 006 = Option A, the trigger-weight normalization is not implemented (withdrawn); only the keyword-lane dedupe lands.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Per-Cluster Flag and Rollout Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester |

---

<!-- ANCHOR:adr-003-context -->
### Context

The program's cross-cutting rule says fixes to default-ON behavior ship direct, and behavior-changing ranking work sits behind flags only when measurement needs an A/B. The Group-A history in the ex-031 tracker adds a warning: flags that do not propagate at request time create false confidence, which is exactly the root cause this phase's cluster 1 removes. We needed a rollout policy that keeps correctness fixes fast while making ranking-order changes measurable and reversible.

### Constraints

- Cluster 2 closes tenant-scope bypasses; holding those behind an off-by-default flag would knowingly ship a security-relevant hole.
- Flag sprawl is real debt: the deep-dive found dead knobs and doc-drifted defaults across the search surface.
- Any new flag must obey the cluster-1 contract (read per-request) or it recreates Group-A.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: ship clusters 1, 2, and the gate-CORRECTNESS parts of cluster 4 direct with per-cluster revertable commits and no new flags; group every RANKING-ORDER change - the headroom band (ADR-001), the trigger-weight normalization (ADR-002), the recency curve, AND cluster 4's two ranking-order gate fixes (#13 non-hybrid blend, #14 causal-boost scaling) - behind one phase-scoped flag, measured together on the 006 harness, default OFF, flipped ON after the eval-delta gate passes, then removed at phase close.

**How it works**: each cluster lands as its own conventional commit. Correctness fixes (minState, scope hard-gating, HyDE gate-fire, graph-FTS, quality-gap, evidence-gap, intent-classifier, community existence) ship direct because they change whether a gate is correct, not the rank order of already-correct results. The single ranking-order flag guards ADR-001, ADR-002, the recency curve, and #13/#14 together, because they are measured together on the 006 harness. #13 and #14 are NOT shipped "direct" even though they live in cluster 4: they are rank-order changes the harness must measure, and the review flagged that shipping them direct would land a ranking change the harness never sees. **006 gate:** if 006 chooses Option A, this entire flagged group (ADR-001, ADR-002, #13, #14) is withdrawn rather than flipped on. After a clean eval-delta the default flips, and the flag is deleted before the phase claims completion so no dead knob survives.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One cluster-3 flag, others direct (chosen)** | Fast correctness fixes; single measurable A/B unit; bounded flag debt | Cluster-3 changes cannot be toggled independently of each other | 8/10 |
| Flag per fix (about 9 flags) | Fine-grained isolation | Combinatorial toggle matrix; test burden explodes; invites permanent flag debt | 3/10 |
| No flags anywhere | Simplest shipping story | No A/B for the headroom band or weight constants; rollback only by revert | 5/10 |
| Permanent tuning flag | Operators can keep both modes | Contradicts the no-dead-knobs rule this phase enforces elsewhere | 4/10 |

**Why this one**: it matches the program rule exactly and keeps the A/B unit identical to the measurement unit.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Security-relevant gate fixes reach users immediately.
- Ranking changes are measurable, reversible on a warm daemon, and leave no flag debt behind.

**What it costs**:
- Cluster-3 sub-changes succeed or fail the eval gate as a unit. Mitigation: the harness reports per-query deltas, so a failing sub-change is identifiable before re-landing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Flag removal forgotten after default flip | M | Removal is task T055 plus checklist CHK-121; completion is blocked while the flag exists |
| Cluster-3 flag read at process start (Group-A repeat) | H | Flag reader built on the cluster-1 fixed plumbing; toggle test included in T014 matrix |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Ranking-order changes need A/B; correctness fixes need speed; one policy resolves both |
| 2 | **Beyond Local Maxima?** | PASS | Per-fix flags, no flags, and permanent flags were scored |
| 3 | **Sufficient?** | PASS | One flag plus per-cluster commits covers rollback and measurement |
| 4 | **Fits Goal?** | PASS | Implements the program's cross-cutting flag rule for this phase |
| 5 | **Open Horizons?** | PASS | Pattern reusable by phases 008-010 for their behavior-changing work |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `lib/search/search-flags.ts`: one phase-scoped ranking-order flag using the per-request read contract, guarding ADR-001, ADR-002, the recency curve, and cluster 4's #13/#14 together.
- Git history: per-cluster commits (clusters 1, 2, 3, 4, and the cluster 5 silent-drop absorptions), each independently revertable.

**How to roll back**: turn the ranking-order flag off for the flagged group (effective next request), or `git revert` the specific cluster commit for direct-shipped fixes.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
