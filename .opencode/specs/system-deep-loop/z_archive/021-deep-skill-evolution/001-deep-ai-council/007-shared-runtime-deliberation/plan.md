---
title: "Implementation Plan: sk-ai-council Shared Runtime Deliberation"
description: "Plan for a planning-only AI Council packet that compares full extraction, keep-inline, and hybrid runtime boundaries for sk-ai-council."
trigger_phrases:
  - "124 sk-ai-council plan"
  - "ai-council runtime deliberation plan"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/001-deep-ai-council/007-shared-runtime-deliberation"
    last_updated_at: "2026-05-23T05:04:55Z"
    last_updated_by: "codex"
    recent_action: "Authored deliberation strategy and dimensions."
    next_safe_action: "read-council-report"
    blockers: []
    key_files:
      - "ai-council/ai-council-strategy.md"
      - "ai-council/council-report.md"
    session_dedup:
      fingerprint: "sha256:1241241241241241241241241241241241241241241241241241241241240002"
      session_id: "116-deep-skill-evolution/001-ai-council/007-shared-runtime-deliberation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The deliberation should score full extraction, keep-inline, and hybrid boundaries against current evidence."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-ai-council Shared Runtime Deliberation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, JSONL |
| **Framework** | Spec Kit Level 3 packet plus `sk-ai-council` packet-local artifact convention |
| **Storage** | Filesystem packet artifacts only |
| **Testing** | `validate.sh --strict` and checklist evidence |

### Overview

The packet uses the 117 council structure as the scaffold, then adapts the question to `sk-ai-council`: current footprint, possible runtime boundary, benefits, costs, and decision criteria. The four seats are authored inline in this dispatch and labeled as in-session council perspectives, not external CLI results.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec folder pre-approved by user.
- [x] Reference inputs identified: 117 packet, `sk-ai-council`, `deep-loop-runtime`, and memory-leak remediation arc.
- [x] Forbidden paths documented: no arc 010, no source code, no skill edits.

### Definition of Done
- [x] Four seat files authored with line citations.
- [x] `council-report.md` states verdict, convergence, top findings, risks, and implementation sketch.
- [x] `decision-record.md` contains council-derived ADRs.
- [x] Strict validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Planning-only packet-local council.

### Key Components
- **Spec docs**: Capture problem, plan, tasks, checklist, ADRs, and summary.
- **Council config/state**: Initialize the single-round council and record the packet path.
- **Council strategy**: Define evidence inputs, seat mandates, and convergence criteria.
- **Seat files**: Present extract, keep-inline, hybrid, and adjudicator positions.
- **Council report**: Synthesize the ruling and decision criteria.

### Data Flow

Reference files are read first. Their line-cited evidence is distilled into seat files. Seat recommendations feed the round summary and final report. The final report feeds `decision-record.md` ADRs and the implementation summary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is not a fix packet. The table documents deliberation surfaces only.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-ai-council/` | Current council skill and helper scripts | Read-only evidence source | Seat citations to SKILL.md, references, and scripts |
| `.opencode/skills/deep-loop-runtime/` | Runtime extraction precedent | Read-only comparison source | Seat/report citations to SKILL.md, README.md, and 118 ADRs |
| `.opencode/specs/.../124.../ai-council/**` | New packet-local council artifacts | Created | Strict validation plus checklist |
| `.opencode/specs/.../124.../*.md` | New Level 3 packet docs | Created/updated | Strict validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence Read
- [x] Read 117 spec, decision record, config, strategy, seats, and report.
- [x] Read `sk-ai-council` skill, references, scripts, agent surface, and consumer grep.
- [x] Read `deep-loop-runtime` skill, README, 118 ADRs, and memory-leak lifecycle context.

### Phase 2: Council Authoring
- [x] Author Seat 1: advocate extract.
- [x] Author Seat 2: advocate keep-inline.
- [x] Author Seat 3: advocate hybrid.
- [x] Author Seat 4: adjudicator.
- [x] Author round summary and report.

### Phase 3: Packet Closeout
- [x] Author ADRs and implementation summary.
- [x] Update metadata files.
- [x] Run strict validation and patch any issues.
- [x] Append commit handoff to report.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Level 3 packet completeness | `validate.sh --strict` |
| Evidence | Seat/report file:line citations | Manual read and grep evidence |
| Scope | No source-code modifications | `git diff --stat` and path review |
| Artifact | Council folder shape | `find <packet> -maxdepth 4 -type f` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 117 | Internal precedent | Green | Would weaken shape parity |
| `sk-ai-council` skill | Internal evidence | Green | Required for current-footprint claims |
| `deep-loop-runtime` skill | Internal evidence | Green | Required for runtime comparison |
| Memory-leak arc 009 | Internal evidence | Green | Required for lifecycle-hardening context |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: User rejects the deliberation packet or asks to discard it.
- **Procedure**: Remove only `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/007-shared-runtime-deliberation/`. No source-code rollback is needed because this packet does not modify skill or MCP files.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Evidence read -> Council authoring -> Packet closeout -> Strict validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Evidence read | None | Council authoring |
| Council authoring | Evidence read | Packet closeout |
| Packet closeout | Council authoring | Strict validation |
| Strict validation | Packet closeout | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Evidence read | 1 unit | Existing local files only |
| Council authoring | 2 units | Four seats plus synthesis |
| Validation and patching | 1 unit | Template compliance and final handoff |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production deployment involved.
- [x] No source-code files changed.
- [x] All changes are isolated to this packet folder.

### Rollback Procedure
1. Remove `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/007-shared-runtime-deliberation/`.
2. Re-run `git diff --stat` to confirm no skill or MCP files are included.
3. If the decision is wrong later, supersede this packet with a new ADR packet instead of editing history.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Delete the packet folder only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Reference reads
  -> spec docs
  -> council strategy
  -> four seat files
  -> round summary
  -> council report
  -> decision records
  -> implementation summary
  -> strict validation
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Read the 117 precedent and current skill/runtime evidence.
2. Author all four seats from the same evidence base.
3. Synthesize the report and ADRs.
4. Run strict validation.
5. Append commit handoff and re-run strict validation.

**Total Critical Path**: evidence read plus single-round in-session deliberation plus strict validation.

**Parallel Opportunities**: file reads and grep checks were parallelized; authoring was sequential to keep the same evidence baseline.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Status |
|-----------|-------------|------------------|--------|
| M1 | Evidence read | Required references inspected | Complete |
| M2 | Council authored | Four seat files and round summary exist | Complete |
| M3 | Final report | Verdict, criteria, sketch, risks present | Complete |
| M4 | Validation | Strict validation exits 0 | Complete |
<!-- /ANCHOR:milestones -->
