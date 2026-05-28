---
title: "Decision Record: Eval Rig"
description: "ADR for separate deterministic vs grader caches; ADR for mkdir-based advisory locking; ADR for fixture-grounding rule."
trigger_phrases:
  - "113/002 decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/113-cli-devin-prompt-quality/002-eval-rig"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded decision-record.md with ADR-001"
    next_safe_action: "Add ADRs as design surfaces them during build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114024"
      session_id: "114-002-decisions"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Eval Rig

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Separate caches for deterministic vs grader results

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-16 |
| **Deciders** | Main agent (council ratifies cache schema downstream) |

---

<!-- ANCHOR:adr-001-context -->
### Context

A single cache keyed on (variant_hash, fixture_id) would invalidate every entry when the grader model changes, even though deterministic scores (regex-checkable: bundle-gate, cwd, preplanning, hallucination) are grader-independent. Each cache miss costs free-tier credits we can't afford to waste during 003's iteration loop. Memory: `feedback_codex_sandbox_blocks_network` confirms grader-cost is non-trivial.

### Constraints

- Free-tier rate limits on grader CLI (claude-sonnet OR codex-gpt-5.5)
- Deterministic and grader scores have different invalidation triggers
- Cache must survive operator-paused runs (003 can pause mid-iteration on 429)
- Atomic write semantics required (no torn rows)
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Split cache into `cache/det/` (deterministic scores) and `cache/grader/` (grader scores), each with its own `index.jsonl`.

**How it works**: Det cache keyed on `sha256(variant_hash || fixture_id)` — survives grader model swaps and rubric weight changes. Grader cache keyed on `sha256(variant_hash || fixture_id || rubric_hash || grader_model_id)` — invalidates when rubric or grader changes.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Separate det/grader caches (chosen)** | Det cache survives grader changes; minimal grader re-spend | More files; reconstruct script handles 2 dirs | 9/10 |
| Single cache, composite key with grader model | Simpler directory layout | Invalidates det results when grader changes | 5/10 |
| No cache (always recompute) | Trivially simple | Burns free-tier credits on every re-run | 1/10 |

**Why this one**: Free-tier credit conservation is the dominant constraint. Separate caches let us swap grader models or tweak rubric weights without paying det re-computation costs.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Cheaper re-runs after grader model swap (det cache survives)
- Cheaper re-runs after rubric weight tweaks (det cache survives if dims unchanged)

**What it costs**:
- Reconstruct script (`cache-reconstruct.cjs`) handles 2 directories. Mitigation: small added complexity, well-bounded.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operator confuses det vs grader cache contents | L | Directory naming is explicit; README in each cache subdir |
| Cache key derivation diverges between det and grader handlers | M | Single key-derivation module imported by both |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Free-tier credit conservation is a real constraint; single cache invalidates too aggressively |
| 2 | **Beyond Local Maxima?** | PASS | Considered single-cache and no-cache alternatives |
| 3 | **Sufficient?** | PASS | 2-cache split is minimum needed; no further partitioning required |
| 4 | **Fits Goal?** | PASS | Directly serves 003's iteration budget |
| 5 | **Open Horizons?** | PASS | Pattern reusable for any rubric+grader combination |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Cache directory layout: `cache/det/{index.jsonl, *.out.md}` + `cache/grader/{index.jsonl, *.out.md}`
- Key derivation module exposes `derive_det_key(variant_hash, fixture_id)` and `derive_grader_key(variant_hash, fixture_id, rubric_hash, grader_model_id)`
- Reconstruct script handles both directories

**How to roll back**: If split proves unnecessary overhead, merge by symlinking `cache/det/index.jsonl` and `cache/grader/index.jsonl` to a single file with extra `cache_kind` column. No data loss.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
