---
title: "Decision Record: Lineage Timestamp Guard"
description: "Architecture decisions for detecting fabricated lineage timestamps: warn-first severity and orchestration-boundary placement."
trigger_phrases:
  - "timestamp guard decisions"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/004-deep-loop/007-deep-review-followup-hardening/002-lineage-timestamp-guard"
    last_updated_at: "2026-07-04T16:33:20.324Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Implementation confirmed ADRs"
    next_safe_action: "Review final verification evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-002-timestamp-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Lineage Timestamp Guard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Warn-First Detection, Not Enforcement

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-02 |
| **Deciders** | Packet 032 orchestrator (Claude) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The observed incident produced fabricated timestamps but genuine findings — the run's substance was fine. Fabrication frequency across models and prompts is unknown; failing or retrying lineages on temporal anomalies could reject expensive, otherwise-valid work on day one of detection.

### Constraints
- Run outcomes (exit codes, retries, salvage) must not change in this rollout.
- The signal must land where operators already look (ledger + summary).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Detection only: count and record anomalies per lineage; never alter outcomes. Escalation to enforcement is a separate future decision once anomaly base rates are known.

**Details**: One rollout cycle of real data tells us whether fabrication is a gpt-5.5 quirk, a prompt-pack defect, or endemic — each implies a different enforcement design.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Warn-first (chosen)** | Zero risk to valid runs; produces the base-rate data enforcement needs | Fiction persists in state files for now | 9/10 |
| Fail the lineage on anomalies | Fiction never lands | Rejects expensive valid work; retry likely reproduces the same model behavior — burn with no gain | 3/10 |
| Rewrite timestamps to runner-observed times | State becomes "true" | Orchestrator forging executor records is worse than the disease; destroys audit honesty | 1/10 |

**Why Chosen**: The immediate problem is invisibility, not existence. Visibility first, policy second.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Anomalies become queryable data instead of manual-verification folklore.
- Enforcement, if later justified, starts from measured base rates.

**Negative**:
- Downstream consumers must check the anomaly signal before trusting durations. Mitigation: summary field makes that check one lookup.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Signal ignored indefinitely | L | Anomaly counts surface in the same summary operators read for verdicts |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Live incident: 11 fabricated records passed silently on 2026-07-02 |
| 2 | **Beyond Local Maxima?** | PASS | Fail-fast and rewrite options scored |
| 3 | **Sufficient?** | PASS | Detection closes the invisibility gap entirely |
| 4 | **Fits Goal?** | PASS | Truthful-telemetry goal without endangering valid runs |
| 5 | **Open Horizons?** | PASS | Enforcement remains an open, now-informable follow-up |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**: fanout-run lineage completion; ledger/summary consumers (additive only).

**Rollback**: Remove the call site.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Check At The Orchestration Boundary, Not Inside The Executor Prompt

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-02 |
| **Deciders** | Packet 032 orchestrator (Claude) |

---

<!-- ANCHOR:adr-002-context -->
### Context

The fabrication happened despite the prompt pack requesting ISO-8601 timestamps. Prompt-side fixes (stronger instructions, demanding `date -u` output) depend on the same executor honesty that already failed. The runner is the only party with independent knowledge of when the lineage actually ran.

### Constraints
- Ground truth must not come from the party being checked.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: The runner validates timestamps against its own slot timing at lineage completion. Prompt improvements may also happen elsewhere, but the guarantee lives where trust does not depend on the executor.

**Details**: Slot start/end (already ledger-recorded per attempt) bounds the window; a documented skew tolerance absorbs clock drift and write latency.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Runner-side window check (chosen)** | Independent ground truth; zero executor cooperation needed | Only catches out-of-window fabrication, not in-window fiction | 9/10 |
| Stronger prompt instructions only | No code | Trusts the party that already violated the instruction | 2/10 |
| Executor-side self-validation hook | Catches issues at write time | Same trust problem; LEAF executors vary by model/CLI | 3/10 |

**Why Chosen**: Verification must be independent of the verified — the same principle this program applies to dispatch self-reports.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Works identically for every executor kind (native, cli-opencode, cli-claude-code).
- No prompt-pack coupling.

**Negative**:
- In-window fabrication (plausible but invented times) is undetectable by this check. Mitigation: accepted; out-of-window was the observed failure mode, and in-window fiction has bounded analytic damage.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Retry windows conflate attempts | M | Window per successful attempt's slot (edge case #4 in spec) |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prompt-side instruction already failed in the observed incident |
| 2 | **Beyond Local Maxima?** | PASS | Prompt-only and executor-side options scored |
| 3 | **Sufficient?** | PASS | Catches the observed failure class completely |
| 4 | **Fits Goal?** | PASS | Independent verification at the boundary that owns ground truth |
| 5 | **Open Horizons?** | PASS | Same window data supports future enforcement or analytics |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**: fanout-run.cjs completion path; pure checker in lib.

**Rollback**: Remove the call site; checker remains as a library utility.

<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
