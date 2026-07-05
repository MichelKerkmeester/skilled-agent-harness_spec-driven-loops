---
title: "Feature Specification: Convergence Threshold Alignment and Forced-Depth Flag"
description: "Align the fan-out (0.1 hardcoded) vs config-default (0.05) convergence-threshold mismatch, and promote --stop-policy=max-iterations to a documented first-class flag."
trigger_phrases:
  - "convergence threshold default mismatch"
  - "stop policy max iterations flag"
  - "forced depth research flag"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/009-research-backlog-remediation/008-convergence-threshold-and-forced-depth-flag"
    last_updated_at: "2026-07-01T08:10:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from research.md F-005/G-004 (Tier2 #14,#15)"
    next_safe_action: "Author plan.md and tasks.md, then dispatch implementation to MiMo v2.5 ultraspeed"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json"
      - ".opencode/commands/deep/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Convergence Threshold Alignment and Forced-Depth Flag

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 8 |
| **Predecessor** | 007-parent-scaffold-and-governance-docs |
| **Successor** | 009-convergence-design-and-hardening |
| **Handoff Criteria** | The fan-out and native dispatch paths agree on a default convergence threshold (or the mismatch is intentional and documented); `--stop-policy` is a documented flag on `/deep:research` and `/deep:review` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`fanout-run.cjs:846` hardcodes `const convergenceThreshold = options.convergenceThreshold ?? 0.1;` as the fallback when no explicit value is supplied to a CLI-executor fan-out lineage, while `deep_research_config.json`'s own documented default is `0.05` — confirmed distinct from (though related to) the separate "the flag doesn't propagate at all" bug already fixed in child 001's dispatch. This finding is about the two paths *disagreeing on default*, not about the value failing to reach the lineage (`research/research_archive/20260701T071133Z-gen1/research.md` §4.3, F-005/G-004). Separately, this session's own operational experience confirmed `--stop-policy=max-iterations` (`normalizeStopPolicy` in `fanout-run.cjs`) already exists, is already wired through `buildLoopPrompt`, and works correctly (used successfully to force the generation-2 research re-run to genuinely reach 35 iterations/lineage) — but it is **not documented as a flag** on either `/deep:research` or `/deep:review`'s command surface, so an operator has no way to discover it without reading the runtime source (§3.4, backlog item #15).

### Purpose
Make both dispatch paths (fan-out CLI executor, native command dispatch) agree on the same convergence-threshold default when no explicit value is given, and add `--stop-policy` to the documented argument-hint / flag table on both consumer commands so operators can request a forced-depth run without needing runtime-source archaeology.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change `fanout-run.cjs:846`'s hardcoded `0.1` fallback to match `deep_research_config.json`'s documented `0.05` (confirm this is the correct direction — i.e. that `0.05` is the intended canonical default, not the reverse — by reading `deep-research/SKILL.md`'s own "Convergence Threshold Semantics" section, which states 0.05 is the documented default).
- Log the *effective* threshold value actually used at dispatch time (in the lineage's own config/state, already partially done — confirm and make explicit) so a future mismatch is visible rather than silent.
- Add `--stop-policy <convergence|max-iterations>` to the argument-hint and flag documentation table in `.opencode/commands/deep/research.md` and `.opencode/commands/deep/review.md`.

### Out of Scope
- Any change to the actual convergence ALGORITHM (that's child 009's sliding-window design work).
- Making `max-iterations` the new default `stopPolicy` (stays opt-in; this phase only documents the existing, working, but undocumented flag).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Align hardcoded default to 0.05 |
| `.opencode/commands/deep/research.md`, `.opencode/commands/deep/review.md` | Modify | Document `--stop-policy` flag |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fan-out and config defaults agree, per loop type | **Amended during implementation**: `buildNativeCommandInput` serves research/review/context loop types through one shared code path; a flat 0.1→0.05 change (this row's original wording) would have fixed research but regressed review/context (both independently documented at 0.10). Shipped fix: `options.convergenceThreshold ?? (loopType === 'research' ? 0.05 : 0.1)` — research gets 0.05, everything else keeps 0.1, matching each loop type's own SKILL.md-documented default |
| REQ-002 | `--stop-policy` is documented on both consumer commands | Argument-hint / flag table in both `.md` files names it with its two valid values and effect |

### P1 — Required (complete OR user-approved deferral)

None beyond P0 for this small phase.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fan-out dispatch with no explicit `--convergence` flag now uses 0.05, matching the documented default.
- **SC-002**: `--stop-policy` appears in both commands' argument-hint text.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Behavior change | Changing the fallback default changes behavior for any caller relying on the old 0.1 implicit default | Runs that didn't specify `--convergence` explicitly will converge differently | Confirm via `SKILL.md` that 0.05 was always the INTENDED default (i.e. 0.1 was the bug) before changing; note the change in the implementation summary either way |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Confirm which of 0.05/0.1 is actually "correct" per the documented semantics before changing — don't assume the research's framing (config=correct, fanout=wrong) without checking `SKILL.md` directly.
<!-- /ANCHOR:questions -->
