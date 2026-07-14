---
title: "Decision Record: Phase 8 — rename sk-ai-small-model → sk-prompt-models"
description: "3 ADRs covering family classification, REWRITE-ALL policy + deliberate cost, workflow inheritance from 007."
trigger_phrases: ["rename decision record", "sk-prompt-models adr", "rewrite-all policy decision"]
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/008-sk-prompt-small-model-rename"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored decision-record.md"
    next_safe_action: "Execute implementation"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000008"
      session_id: "114-008-adr-init"
      parent_session_id: "114-008-checklist-init"
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 8 — rename sk-ai-small-model → sk-prompt-models

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep family classification at `sk-util`

<!-- ANCHOR:adr-001-context -->
### Context
Rename adjacent to `sk-prompt` cluster. Family field could shift from `sk-util` to `sk-prompt` or a new `sk-prompt-*` cluster.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
Keep `family: sk-util`. Name-only refactor; family stays untouched.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Alternative | Decision |
|-------------|----------|
| Move to `sk-prompt` family | REJECTED — implies sk-prompt variant which it isn't |
| New `sk-prompt-*` cluster | DEFERRED — no other members yet (YAGNI) |
| **Keep `sk-util`** | **CHOSEN** — minimal change; advisor signals unchanged |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- Advisor recommendation behavior unchanged.
- `family`-keyed queries against `sk-prompt` still return only `sk-prompt`.
- Future `sk-prompt-*` clustering can be done later via separate ADR.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Answer |
|---|-------|--------|
| 1 | Necessary? | Yes — locks family decision explicitly |
| 2 | Beyond Local Max? | Yes — 3 alternatives evaluated |
| 3 | Sufficient? | Yes — simplest change |
| 4 | Fits Goal? | Yes — name-only refactor |
| 5 | Open Horizons? | Yes — leaves room for future clustering |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

graph-metadata.json keeps `family: sk-util`; no edit beyond `skill_id` rename.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: REWRITE-ALL historical-doc policy (load-bearing)

<!-- ANCHOR:adr-002-context -->
### Context
Phase 007 used preserve-history (historical docs under 114/001-006 left untouched as immutable provenance). Phase 008 user-directive chose the OPPOSITE policy: REWRITE-ALL. Every occurrence project-wide rewritten to new name — including phase-007's shipped spec docs (~200 hits), 131/scratch/115-arc-review (~70), deep-ai-council/v1.2.0.0 (3), rename-pattern.md (3).
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision
Adopt REWRITE-ALL. Every content occurrence of `sk-ai-small-model` rewritten to `sk-prompt-models`. Only acceptable residuals: (a) immutable phase-007 folder NAME `007-sk-ai-small-model-rename/` (path-only); (b) active 008/* phase docs (semantic-meaning preservation per D-008).

**Deliberate cost**: phase-007 shipped spec docs now describe a rename endpoint (`sk-prompt-models`) that did not exist in phase-007's actual timeline. Future readers without this ADR will misattribute phase-007's endpoint.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Alternative | Decision |
|-------------|----------|
| Preserve-history (007's policy) | REJECTED by user directive |
| **REWRITE-ALL** | **CHOSEN** by user |
| Hybrid (rename-pattern.md only) | REJECTED — incomplete |
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- `rg -il "sk[_-]ai[_-]small[_-]model"` returns 0 content hits outside exemptions
- Single-name grep state forever
- Future readers always find current canonical

**Negative (deliberate)**:
- Phase 007 docs describe an endpoint that didn't exist in their actual timeline
- Phase 007 implementation-summary.md, deep-review iter logs, review prompts all anachronistic post-008
- Historians need this ADR to interpret phase-007 docs correctly

**Mitigation**: this ADR is the canonical record explaining why phase-007 docs read as they do post-008.
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Answer |
|---|-------|--------|
| 1 | Necessary? | Yes — load-bearing policy choice needs explicit record |
| 2 | Beyond Local Max? | Yes — 3 alternatives evaluated |
| 3 | Sufficient? | Yes — IF cost accepted (which user accepted) |
| 4 | Fits Goal? | Yes — full rename realized |
| 5 | Open Horizons? | Yes — precedent both ways (policy + cost framing) |
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation

- Bucket 8 in plan.md enumerates the 4 historical surface groups
- Scripted sed sweep across `rg -l` output
- This ADR survives sweep (authored AT phase 008, references new name canonically)
- Path-only residual at 007 folder name acceptable
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Inherit phase-007 workflow shape verbatim

<!-- ANCHOR:adr-003-context -->
### Context
Phase 007 shipped 2026-05-21 in ~35 min with zero behavioral drift. Phase 008 has same workflow shape with 2 additions: Bucket 3 (changelog aggregator symlink — pattern didn't exist at 007 ship time) and Bucket 8 (historical sweep per ADR-002).
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision
Inherit phase-007 workflow shape verbatim. Same 8-bucket structure (+ buckets 3 and 8), same cli-devin protocol (RCAF + medium pre-planning + bundle-gate standard), same verification gates, same memory rules.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Alternative | Decision |
|-------------|----------|
| **Inherit 007 verbatim** | **CHOSEN** — proven |
| Redesign with parallel @code agents | REJECTED — violates user's cli-devin directive |
| Single-agent sequential | REJECTED — loses verification value |
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences

- Estimated wall ~50 min (vs 007's 35 min) due to Bucket 3 + Bucket 8 additions
- cli-devin context-gathering ultimately skipped per D-004 (007 precedent + spec.md §3 already comprehensive)
- Same memory rules apply
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Answer |
|---|-------|--------|
| 1 | Necessary? | Yes — workflow choice needs documentation |
| 2 | Beyond Local Max? | Yes — 3 alternatives |
| 3 | Sufficient? | Yes — 007's workflow proved sufficient |
| 4 | Fits Goal? | Yes — same shape (rename + propagation + reindex) |
| 5 | Open Horizons? | Yes — future renames fork from this precedent |
<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation

tasks.md / plan.md / checklist.md mirror 007's structure with Bucket 3 + Bucket 8 additions.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
