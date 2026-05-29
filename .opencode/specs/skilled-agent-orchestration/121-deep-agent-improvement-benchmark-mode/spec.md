---
title: "Feature Specification: deep-agent-improvement model-benchmark mode"
description: "Phase parent: design + research toward adding a model/prompt-framework benchmark mode to the deep-agent-improvement skill."
trigger_phrases:
  - "121-deep-agent-improvement-benchmark-mode"
  - "deep-agent-improvement benchmark mode"
  - "model-benchmark mode phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode"
    last_updated_at: "2026-05-28T15:15:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All 6 phases complete (latest: 006 deep-loop empty-archive-dir fix)"
    next_safe_action: "None — feature shipped, reviewed, remediated, scorer wired, documented"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: deep-agent-improvement model-benchmark mode

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | None (top-level packet in `skilled-agent-orchestration`) |
| **Parent Packet** | `skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode` |
| **Predecessor** | `skilled-agent-orchestration/120-cli-opencode-minimax-optimization` (the rig + model this generalizes) |
| **Successor** | None |
| **Handoff Criteria** | 001 design reviewed; 002 deep-research converges with build-ready guidance; a later packet builds the mode |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 120/003 benchmark rig (run a model against fixtures under prompt-framework variants, score, hill-climb) is packet-local and one-off. The deep-agent-improvement skill runs the same loop shape for agent definitions but cannot benchmark models/prompts. We want model/prompt benchmarking to be a first-class, repeatable capability of deep-agent-improvement.

### Purpose
Decide and detail how to add a `model-benchmark` mode to deep-agent-improvement (alongside the existing `agent-improvement` mode), then hand a build-ready design to a follow-on build packet.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Design the mode-selector architecture + the three pluggable seams (phase 001)
- Deep-research the implementation detail with MiniMax M2.7 as the executor (phase 002)
- Build the mode in deep-agent-improvement from the verified 002 build-delta (phase 003)

### Out of Scope
- Moving or changing the 120/003 rig (referenced as the port source)
- New benchmark fixtures/profiles beyond what the mode wiring needs

### Files to Change
Summary of aggregate scope. Per-phase detail lives in child docs.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-mode-selector-design/**` | Authored | 001 | Design spec + ADRs + build plan |
| `002-implementation-deep-research/research/**` | Create | 002 | MiniMax M2.7 deep-research state + `research.md` |
| `003-build-benchmark-mode/**` + `.opencode/skills/deep-agent-improvement/scripts/**` | Create/Modify | 003 | Build plan + the mode implementation (new + modified scripts) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-mode-selector-design/ | Design: mode selector + 3 pluggable seams + ADRs + build plan (Level 3) | Complete |
| 2 | 002-implementation-deep-research/ | Deep-research (MiniMax M2.7) deepening the implementation design — converged, 5 evidence iters | Complete |
| 3 | 003-build-benchmark-mode/ | Build the mode from the 002 research build-delta (loop-host.cjs + dispatch-model.cjs + scorer port + mode-aware records), TST-1 identity gate | Complete |
| 4 | 004-benchmark-mode-remediation/ | Remediate the 122 tri-model review findings: 3 unique P1 fixes (cwd propagation, path-guard boundary, criteria-exec gate + grader clamp) + actionable P2s, with regression tests | Complete |

| 5 | 005-optin-5dim-scorer-and-skill-docs/ | Wire the ported 5-dim scorer as an opt-in run-benchmark scorer (closes review deferral F-P2-1/2) + document the model-benchmark mode in SKILL.md (sk-doc DQI 97) | Complete |

| 6 | 006-deep-loop-empty-archive-dir-fix/ | Maintenance: deep-research init eagerly created `{mode}_archive` (empty dirs); make all 4 deep-loop restart branches archive lazily+guarded + regression tests; sweep existing empties | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-mode-selector-design | 002-implementation-deep-research | Design ADRs + build plan authored | strict validate on 001 |
| 002-implementation-deep-research | 003-build-benchmark-mode | Research converged with a verified, build-ready delta | strict validate on 002 + ground-truth verification |
| 003-build-benchmark-mode | 004-benchmark-mode-remediation | Build shipped + tri-model review (122) surfaced findings | review-report.md CONDITIONAL verdict |
| 004-benchmark-mode-remediation | 005-optin-5dim-scorer-and-skill-docs | Remediation closed; the substantive deferral (5-dim scorer not wired) warranted a follow-on | review-report §11 + 004 dispositions |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Can MiniMax M2.7 reliably drive a deep-research loop (dogfood signal from phase 002)?
- After 002, is the design build-ready, or does it need another research pass before the build packet opens?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
