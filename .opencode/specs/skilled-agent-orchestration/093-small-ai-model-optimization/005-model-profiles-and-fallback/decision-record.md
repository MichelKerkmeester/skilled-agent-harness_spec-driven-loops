---
title: "Decision Record: shared model intelligence"
description: "ADRs for Phase D."
trigger_phrases: ["shared intelligence ADRs"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/005-model-profiles-and-fallback"
    last_updated_at: "2026-05-18T16:56:00Z"
    last_updated_by: "codex"
    recent_action: "Accepted revised ADR-001 during Phase 005 implementation"
    next_safe_action: "Review diffs and commit the explicit Phase 005 path list"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000023"
      session_id: "114-005-decisions-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Decision Record: shared model intelligence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Quota-pool-aware fallback for small-only ecosystem; fail-fast over silent same-pool retry

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (revised 2026-05-18) |
| **Date** | 2026-05-18 |
| **Deciders** | implementer + user (small-only scope confirmed) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The user's actual model rotation is small-only: SWE-1.6 (Cognition free), DeepSeek-v4-pro / Kimi-k2.6 / Qwen3.6 (all sharing one Cognition Pro pool via cli-opencode), with optional future Claude Haiku and Gemini Flash. There are no frontier models (Opus / Sonnet / gpt-5.5 / GLM-5.1) in scope to escalate to. The original Phase D plan assumed a small→frontier escalation chain — that assumption is gone. Naïve "pick another model" routing on hard-fail would just pick a same-pool sibling (e.g. SWE-1.6 fails → fall back to DeepSeek, but DeepSeek also fails because it's the same Cognition account) — accomplishing nothing while spending more Pro quota.

### Constraints

- Free tier: SWE-1.6 only (Cognition)
- Cognition Pro pool shared across DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6
- Anthropic Haiku (if adopted): separate quota pool
- Google Gemini Flash (if adopted): separate quota pool
- No frontier models in user's actual rotation
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Quota-pool-aware fallback with a 1-step max chain. Fallback is allowed ONLY to a model in a DIFFERENT quota pool. If no different-pool target is available, fail-fast to operator with a clear message naming the exhausted pool.

**How it works**: Each model in `model-profiles.json` has a `quota_pool` field (e.g. `cognition-free`, `cognition-pro`, `anthropic`, `google`) and an optional `fallback_target` field pointing to a model with a different pool. The fallback engine reads `quota_pool` on hard-fail, checks if the configured `fallback_target` is in a different pool, and either invokes it or fails fast.

Default behavior for the 4 in-scope models:
- SWE-1.6 (cognition-free) → fallback_target: null today; populated to Haiku or Gemini-Flash when adopted; fail-fast otherwise
- DeepSeek-v4-pro / Kimi-k2.6 / Qwen3.6 (cognition-pro) → fallback_target: null; same-pool siblings disallowed; fail-fast
- Optional Haiku (anthropic) → fallback_target: null; fail-fast
- Optional Gemini Flash (google) → fallback_target: null; fail-fast

The user can configure `fallback_target` per-model later when Haiku or Flash is adopted.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Quota-pool-aware fail-fast (chosen)** | No wasted retries; honest cost signal to operator | Auto-recovery limited until Haiku/Flash adopted | 8/10 |
| Original small→frontier escalation chain | Smart routing across many tiers | Doesn't apply — user has no frontier models | 2/10 |
| Naïve same-pool retry | Simple | Burns more quota on a problem already known to be quota-exhausted | 2/10 |
| Always fail-fast (no fallback at all) | Simplest | Misses real wins when Haiku/Flash adopted | 5/10 |
| Round-robin across pool siblings | Spreads load | Doesn't help when pool itself is exhausted | 3/10 |
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- SWE-1.6 free-tier exhaustion never burns Cognition Pro pool by accident
- Pro pool exhaustion never burns more Pro retries
- Adding Haiku or Gemini Flash later requires 1 registry edit (no new packet)
- Operators get a clear "Cognition Pro pool exhausted" message instead of cascading silent retries

**What it costs**:

- No auto-recovery from quota exhaustion today (until Haiku/Flash adopted). User's autonomous loops will fail-fast on exhaustion.
- Slightly more JSON fields than the original "escalation_chain" design.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| User assumed auto-recovery, gets fail-fast surprise | M | Reference doc states explicitly that fallback requires Haiku/Flash adoption; SC-001 makes the behavior visible |
| Pool membership mislabeled in registry | M | Schema validator checks `quota_pool` is one of the known values |
| User adopts Haiku/Flash but forgets to update registry | L | sk-doc reminder when adding new provider; reference doc has checklist |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Original escalation design doesn't fit small-only ecosystem |
| 2 | Beyond Local Maxima? | PASS | 5 alternatives weighed |
| 3 | Sufficient? | PASS | Covers current state + future Haiku/Flash adoption without re-shipping |
| 4 | Fits Goal? | PASS | Honors user's "avoid bloat" + small-only scope |
| 5 | Open Horizons? | PASS | Adding a new separate-pool provider only requires registry edit |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- model-profiles.json schema: per-model `quota_pool` (required) + `fallback_target` (optional, default null)
- cli-devin/references/quota-fallback.md documents the matrix + adoption checklist
- Agent-config recipes gain optional `fallback_chain` field (1-step max in v1)
- Default chain in registry: all `fallback_target` fields null today; populated when Haiku/Flash adopted

**How to roll back**: Set all `fallback_target` to null; engine returns to pure fail-fast behavior.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
