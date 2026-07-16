---
title: "Feature Specification: Skill Routing Optimization Mode (deep-improvement)"
description: "Lane C skill-benchmark is diagnostic-only. This adds a routing-optimization capability + command that turns the benchmark's own signals (D5 orphan references, D3 over-routing, gold misalignment) into concrete parent-router and per-child skill.md to asset/reference routing fixes, then re-baselines."
trigger_phrases:
  - "skill routing optimization mode"
  - "routing optimization command"
  - "orphan reference sweep"
  - "deep-improvement lane c optimize"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/003-routing-optimization-mode"
    last_updated_at: "2026-07-09T05:03:26Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the routing-optimization-mode spec"
    next_safe_action: "Implement the optimize mode + command; run the cross-skill audit"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/SKILL.md"
      - ".opencode/commands/deep/skill-benchmark.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "Optimize parent-router + per-child skill.md->asset/reference routing in deep-improvement, with a command — operator-locked"
---
# Feature Specification: Skill Routing Optimization Mode

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## 1. METADATA
<!-- ANCHOR:metadata -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-09 |
| **Branch** | `003-routing-optimization-mode` |
<!-- /ANCHOR:metadata -->

---

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->

### Problem Statement
The Lane C skill-benchmark (`/deep:skill-benchmark`) diagnoses routing quality but is diagnostic-only — it emits a ranked report and never proposes or applies fixes. The code-review case (packet 002) showed the fixes are mechanical and repeatable: wire orphan references into intents, map ALWAYS-tier files into `RESOURCE_MAP`, align each scenario's gold with the router's real load, and intent-gate genuine over-routing. Doing this by hand per skill does not scale to the parent hubs + every child.

### Purpose
A repeatable routing-optimization capability in deep-improvement, driven by a command, that converts benchmark signals into concrete parent-router and per-child `skill.md` to `references/`/`assets/` routing fixes and re-baselines — proposing by default, applying behind an explicit flag.
<!-- /ANCHOR:problem -->

---

## 3. SCOPE
<!-- ANCHOR:scope -->

### In Scope
- A cross-skill routing audit: for each benchmarked skill + both hubs, collect D5 orphan references, D3 over-routing, and gold-vs-router-load gaps.
- A methodology reference (Lane C) codifying the optimization playbook + a "do NOT game the metric" guard.
- A command surface: extend `/deep:skill-benchmark` with an `optimize` mode (or a sibling command) — propose router/gold edits, apply behind a flag, re-baseline.
- The parent-hub angle: keep the parent `RESOURCE_MAP` a union of children (existing drift guard) while making every child resource reachable.

### Out of Scope
- Auto-applying router edits without operator review (propose-by-default).
- Changing any skill's thoroughness contract (that is a per-skill judgment, e.g. code-review's ALWAYS tier).
- The code-review fix itself (packet 002) and the scorer fix (packet 001).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `deep-improvement/references/skill_benchmark/**` | Create | Routing-optimization methodology reference |
| `deep-improvement/SKILL.md` | Modify | Lane C: note the optimize capability |
| `.opencode/commands/deep/skill-benchmark.md` | Modify | Add the `optimize` mode + argument-hint |
| `deep-improvement/scripts/skill-benchmark/**` | Create/Modify | Optional helper for the audit + proposal (behind a flag) |
<!-- /ANCHOR:scope -->

---

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Cross-skill routing defect audit exists | A report lists D5 orphans + D3 over-routing per benchmarked skill + both hubs |
| REQ-002 | Methodology reference codifies the playbook | The Lane C reference documents orphan-wiring, ALWAYS-mapping, gold-alignment, over-routing gating, hub-union, and the anti-gaming guard |
| REQ-003 | Command surfaces the optimize mode | `/deep:skill-benchmark` documents the optimize mode; propose-by-default, apply behind a flag |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The mode is proven on at least one skill | code-review (packet 002) is the worked example the mode reproduces |
<!-- /ANCHOR:requirements -->

---

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->

- **SC-001**: Cross-skill audit report produced (all children + both hubs). — target
- **SC-002**: Methodology reference + command optimize mode documented. — target
- **SC-003**: The playbook is anti-gaming (never invents gold; never adds misrouting keywords). — target
<!-- /ANCHOR:success-criteria -->

---

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An "optimize" that games the metric (invented gold, keyword stuffing) | High | Propose-by-default + explicit anti-gaming guard in the methodology; operator review before apply |
| Risk | Auto-edits break a router | Medium | Apply behind a flag; re-benchmark + drift guard gate every change |
| Dependency | Lane C benchmark engine + D5/D3 signals | Met | Reuse as-is |
<!-- /ANCHOR:risks -->

---

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->

- None — capability scope operator-locked.
<!-- /ANCHOR:questions -->
