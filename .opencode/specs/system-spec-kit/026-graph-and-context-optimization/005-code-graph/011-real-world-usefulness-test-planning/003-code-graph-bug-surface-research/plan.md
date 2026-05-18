---
title: "Implementation Plan: Deep Research Issues [template:level_2/plan.md]"
description: "Plan for synthesizing the completed 10-iteration deep research sweep into canonical packet artifacts and a remediation backlog."
trigger_phrases:
  - "deep research plan"
  - "synthesis plan"
  - "code graph remediation backlog"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/003-code-graph-bug-surface-research"
    last_updated_at: "2026-05-06T05:27:17Z"
    last_updated_by: "cli-codex"
    recent_action: "Documented synthesis execution plan and framing correction"
    next_safe_action: "Implement remediation packet in corrected severity order"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/resource-map.md"
    session_dedup:
      fingerprint: "sha256:2222222222222222222222222222222222222222222222222222222222222222"
      session_id: "cli-codex-synthesis-003-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep Research Issues

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, Spec Kit validation scripts |
| **Framework** | Spec Kit Level 2 packet documentation |
| **Storage** | On-disk research packet under `specs/.../003-code-graph-bug-surface-research` |
| **Testing** | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |

### Overview
The packet is a synthesis-only documentation deliverable. The execution path is to read the 10 iteration narratives and JSONL deltas, deduplicate the 35 total findings, write the canonical synthesis and resource map, apply the user-provided design-intent correction, then validate the spec folder strictly.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research charter and config are present.
- [x] Iteration files `iteration-001.md` through `iteration-010.md` are present.
- [x] Delta files `iter-001.jsonl` through `iter-010.jsonl` are present.

### Definition of Done
- [x] Root Level 2 docs are complete and free of template placeholders.
- [x] `research/research.md` answers the charter's primary questions.
- [x] `research/research.md` reflects that default user-codebase scope is design intent, not a P0 bug.
- [x] `research/resource-map.md` maps finding citations by subsystem.
- [x] Parent metadata includes child packet `003-code-graph-bug-surface-research`.
- [x] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Research packet synthesis.

### Key Components
- **Iteration evidence**: Source narratives and deltas, retained under `research/iterations/` and `research/deltas/`.
- **Canonical synthesis**: `research/research.md`, the implementation-facing report.
- **Resource map**: `research/resource-map.md`, the citation ledger.
- **Root packet docs**: Level 2 planning and verification files for continuity and validation.

### Data Flow
Iteration reports and delta counts feed a dedupe pass. The deduped findings feed severity and axis views, primary-question answers, remediation sequencing, negative knowledge, and the resource map.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm target packet path.
- [x] Read system-spec-kit and deep-research workflow guidance.
- [x] Read template contracts and validation expectations.

### Phase 2: Core Implementation
- [x] Read all 10 iteration markdown files.
- [x] Read all 10 delta JSONL records.
- [x] Deduplicate P0/P1/P2 findings.
- [x] Reclassify F-001 as design intent and F-004/F-005 as maintainer-only P2.
- [x] Write root packet planning artifacts.
- [x] Write `research/research.md`.
- [x] Write `research/resource-map.md`.
- [x] Update parent `children_ids`.

### Phase 3: Verification
- [x] Run strict spec validation.
- [x] Count line totals for planning artifacts.
- [x] Report deduped counts and validation result.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static validation | Spec folder structure, anchors, frontmatter, template markers, metadata shape | `validate.sh --strict` |
| Content audit | Required report sections and finding citations | Direct file read and synthesis checklist |
| Metadata audit | Parent `children_ids` includes child packet | JSON read after patch |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `research/iterations/*.md` | Internal evidence | Green | Missing iterations would force TODO findings |
| `research/deltas/*.jsonl` | Internal evidence | Green | Missing deltas would weaken convergence note and count provenance |
| Spec validation script | Internal tooling | Green | Completion could not be claimed without strict validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Strict validation fails due to authored docs, or parent metadata points to the wrong child.
- **Procedure**: Patch the failing root doc or metadata field, rerun strict validation, and only report completion once exit code is 0.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Notes |
|-------|------------|-------|
| Setup | Existing research inputs | Charter, config, iterations, and deltas must be present |
| Core Implementation | Setup | Dedupe relies on the full iteration set |
| Verification | Core Implementation | Validation runs against authored packet docs |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Effort | Confidence |
|-----------|--------|------------|
| Iteration synthesis | Medium | High |
| Root artifact authoring | Medium | High |
| Strict validation repair | Low | Medium |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

If validation failed after parent metadata update, rollback would remove only the added child id from `../graph-metadata.json` and patch the failing packet doc. Research inputs under `research/iterations/` and `research/deltas/` are preserved as source evidence.
<!-- /ANCHOR:enhanced-rollback -->
