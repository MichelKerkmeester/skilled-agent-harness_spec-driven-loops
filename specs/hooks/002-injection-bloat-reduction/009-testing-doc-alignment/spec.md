---
title: "Feature Specification: Testing-Doc and Feature-Catalog Alignment Sweep"
description: "Research spec: sweep the repo-wide manual-testing-playbooks and feature-catalogs for snippets and entries now stale against the changed injection-bloat behavior, via two parallel 10-iteration deep-loop lineages (gpt-5.6-luna and opencode-go deepseek-v4-flash)."
status: complete
completion_pct: 100
trigger_phrases:
  - "testing playbook alignment"
  - "feature catalog freshness"
  - "playbook snippet staleness"
  - "gate3 shadow delivery doc sweep"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/009-testing-doc-alignment"
    last_updated_at: "2026-08-07T06:00:00Z"
    last_updated_by: "claude"
    recent_action: "Completed the dual-lineage sweep and implemented the must-fix findings"
    next_safe_action: "Optionally add spec-gate env rows to feature-flag-reference catalogs"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/README.md"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/README.md"
    session_dedup:
      fingerprint: "sha256:39f974b1bdc2002203fa20f77ec7dd8bf6fcea774732b670e7140dc33c2777b5"
      session_id: "2026-08-07-hooks-002-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The playbooks and catalogs are authoritative-versus-illustrative distinction resolved during the sweep: only assertions that would now fail (the stale test count) were treated as must-fix; illustrative references were left unchanged."
---
# Feature Specification: Testing-Doc and Feature-Catalog Alignment Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete (sweep done; must-fix implemented and verified) |
| **Created** | 2026-08-07 |
| **Branch** | `sk-code/0131-injection-bloat-impl` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | 008-sk-code-alignment |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The injection-bloat changes (delivery confirmation now requires an observed receipt with `lifecycleEpoch >= 1`, Gate-3 delivery observers fire strictly post-emission, and the shadow-delivery state machine keeps every candidate flag off) may have left manual-testing-playbook snippets and feature-catalog entries repo-wide describing or exercising the older behavior. A stale test snippet or catalog entry silently misleads anyone who runs or reads it.

### Purpose
Sweep the repo-wide manual-testing-playbooks and feature-catalogs for snippets and entries now inconsistent with the current behavior, prioritizing docs that reference the changed Gate-3, spec-gate, shadow-delivery, or advisor-delivery surfaces. Run two parallel independent 10-iteration deep-loop lineages — `gpt-5.6-luna` (max, fast) and `opencode-go/deepseek-v4-flash` — for diverse-model coverage. The sweep produces findings only; a follow-on implementation applies the fixes after each finding is verified against the real file.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every manual-testing-playbook file repo-wide, checked for test snippets, commands, or expected outputs now contradicted by the changed behavior
- Every feature-catalog file repo-wide, checked for entries that describe the changed surfaces inaccurately or omit now load-bearing behavior
- Priority on docs referencing Gate-3, spec-gate, shadow delivery, the delivery-observation API, or the epoch-floored confirmation contract

### Out of Scope
- Changing the frozen shadow-delivery or Gate-3 code behavior
- Non-playbook, non-catalog documentation (READMEs and code were covered by phase 008)
- Rewriting playbooks that are illustrative examples rather than authoritative test contracts, unless they assert now-false behavior

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Synthesized findings on stale playbook snippets and catalog entries |
| `research/deep-research-state.jsonl` | Create | Per-iteration externalized loop state for each lineage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The sweep names every stale manual-testing-playbook snippet with the specific statement now contradicted by current behavior | Each finding cites file:line and the contradicted assertion |
| REQ-002 | The sweep names every feature-catalog entry that is inaccurate or omits now load-bearing changed behavior | Each finding cites file:line and the inaccurate or missing statement |
| REQ-003 | Every finding is verified against the real file before it drives any fix | The follow-on implementation confirms each cited snippet or entry exists as described |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Findings are categorized by severity and split into must-fix versus optional | Findings ranked P0/P1/P2 with a clear must-fix versus optional boundary |
| REQ-005 | Two independent model lineages cover the sweep for diversity | `gpt-5.6-luna` and `opencode-go/deepseek-v4-flash` each run ten iterations under `--stop-policy max-iterations` |
| REQ-006 | The opencode-go lineage uses the gateway provider, not the direct DeepSeek API | The executor model resolves to `opencode-go/deepseek-v4-flash`, an independent surface from `deepseek/` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` names every stale playbook snippet with file:line and the contradicted statement
- **SC-002**: Every inaccurate or omission-stale feature-catalog entry is named with file:line
- **SC-003**: Findings are ranked by severity with a must-fix versus optional split ready for implementation
- **SC-004**: Both lineages complete ten iterations and their findings are reconciled into one synthesis
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The repo-wide surface is very large (dozens of playbooks, ~1500 catalog files) for a bounded loop | High | The topic directs the sweep to concentrate on docs referencing the changed surfaces; two lineages widen coverage |
| Risk | A fast model produces shallow or fabricated findings | Medium | Ten forced iterations per lineage plus per-finding verification against the real file before any fix |
| Dependency | The changed surface is committed and stable | High | This session's changes are committed at `2af2feb113` before the sweep begins |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which playbooks and catalogs are authoritative test contracts versus illustrative examples that need no change?
- Does any stale snippet describe deliberately-frozen shadow behavior that should be documented as intentional rather than "fixed"?
<!-- /ANCHOR:questions -->
