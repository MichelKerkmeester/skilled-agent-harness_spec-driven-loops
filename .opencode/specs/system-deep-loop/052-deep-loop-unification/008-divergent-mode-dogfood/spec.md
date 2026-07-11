---
title: "Feature Specification: Divergent-Mode Live Dogfood — Research + Review"
description: "Parallel 10-iteration /deep:research and /deep:review runs against system-deep-loop itself, both configured with convergenceMode=divergent, using GPT-5.6-Sol-fast at high reasoning effort, deliberately exercising the new divergent-pivot mechanism for the first time with real content-generating iterations."
trigger_phrases:
  - "divergent mode dogfood"
  - "deep loop live dogfood run"
  - "divergent pivot live exercise"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood"
    last_updated_at: "2026-07-11T08:00:00Z"
    last_updated_by: "claude"
    recent_action: "P0 incident: entire packet deleted mid-run by a CLI dispatch, docs recreated from context"
    next_safe_action: "Operator decision needed before any re-run: see implementation-summary.md"
    blockers:
      - "Both loops destroyed mid-run by a CLI-dispatched opencode session with unscoped repo write access"
    key_files:
      - "research/INCIDENT.md"
      - "review/INCIDENT.md"
      - ".opencode/skills/cli-external/cli-opencode/references/destructive_scope_violations.md"
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Deliberately trigger the divergent pivot, not just default-mode regression testing — confirmed by operator."
      - "Spec folder: new phase (008) under 052-deep-loop-unification, matching where the only precedent (007) already lives — confirmed by operator."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Divergent-Mode Live Dogfood — Research + Review

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 8 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet `055-deep-loop-divergent-mode` shipped `convergenceMode: "divergent"` — an opt-in scope-expansion pivot where a legal STOP triggers a 3-seat native Council direction-selection instead of terminating. It was validated with unit, integration, and adversarial state-machine tests, but has never been exercised with real content-generating iterations against a real external executor. No one knows yet whether the pivot mechanism behaves correctly under genuine multi-iteration load, whether it produces useful research/review output, or what it actually costs in practice.

### Purpose
Run two real, parallel, 10-iteration deep-loop passes against `system-deep-loop` itself (its shared runtime, all four subskills, the `deep/*` commands, and their agent definitions) — `/deep:research` hunting for improvements/refinements/upgrades, `/deep:review` hunting for bugs/drift/issues — both with `convergenceMode: "divergent"` active and `cli-opencode`/`openai/gpt-5.6-sol-fast`/high as the executor, to genuinely exercise the pivot mechanism at real scale and capture whatever real findings surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `/deep:research`, `maxIterations: 10`, topic covering the full `system-deep-loop` surface (runtime, 4 subskills, `deep/*` commands, agent definitions), `convergenceMode: "divergent"`.
- `/deep:review`, `maxIterations: 10`, `reviewTarget: ".opencode/skills/system-deep-loop"`, `reviewTargetType: "skill"`, dimensions `[correctness, security, traceability, maintainability]`, `convergenceMode: "divergent"`.
- Both loops dispatched concurrently (parallel wall-clock execution), both using `cli-opencode`/`openai/gpt-5.6-sol-fast`/`--variant high`.
- Independent post-run verification: real iteration count, whether any divergent pivot fired and its outcome, spot-checked dispatch content, confirmed read-only guarantee held.

### Out of Scope
- **Fixing any finding either loop surfaces.** This is a pure discovery/dogfood pass — `treat_review_target_as_read_only` is an unconditional invariant for review, and research has no target-mutation path at all. Remediation (if any is warranted) is explicitly a separate, future packet.
- Forcing exactly 10 iterations regardless of outcome — a genuine hard-terminal-boundary (max-iterations, pause/cancel, manual stop, unrecoverable error) is allowed to end a loop early; that is the feature's designed safety guarantee, not a defect to work around.
- Any change to `system-deep-loop`'s own code as part of this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `research/*` (this packet) | Create | Research loop's own state/registry/synthesis artifacts |
| `review/*` (this packet) | Create | Review loop's own state/registry/report artifacts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | Both loops run with `convergenceMode: "divergent"` and the specified executor | `research/deep-research-config.json` and `review/deep-review-config.json` show the real config |
| REQ-002 | Neither loop mutates `system-deep-loop`'s own code | `git status` on `.opencode/skills/system-deep-loop/**` clean throughout and after both runs |
| REQ-003 | Real iteration count and any pivot outcome are captured from the raw state logs, not a self-report | `deep-research-state.jsonl` / `deep-review-state.jsonl` independently read and reconciled against each loop's own completion claim |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-004 | Both loops run genuinely concurrently, not sequentially | Wall-clock overlap confirmed (both loops' iteration timestamps interleave) |
| REQ-005 | Findings are reported honestly, including any early termination or pivot failure | Final report states real outcome, not an assumed "10/10 clean" narrative |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both loops reach a terminal state (converged, max-iterations, or a genuine hard boundary) with mechanically valid state artifacts.
- **SC-002**: At least one divergent pivot attempt is either observed, or its absence is explained by genuine non-eligibility (not a suppressed/misconfigured branch).
- **SC-003**: `system-deep-loop`'s own tree is unmodified by this packet's execution.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `deep_research_auto.yaml` / `deep_review_auto.yaml` phase_loop contracts | Same hand-driven orchestration proven for packet 055 and the 007 precedent | Faithfully execute the real skill-owned contract, not a hand-rolled substitute |
| Risk | First live exercise of a brand-new state-machine branch (the divergent-pivot path) | Could behave unexpectedly under real conditions despite passing synthetic tests | Independent post-run verification of raw state files, not trusting either loop's self-report |
| Risk | A divergent pivot's 3-seat Council round adds real cost/time on top of the 10 base iterations | Cost/duration overrun | Accepted and disclosed upfront — this is the intended cost of genuinely exercising the feature |
| Risk | Running research and review concurrently against overlapping single-dispatch discipline | Could violate `cli-opencode`'s dispatch discipline if misunderstood | Traced the actual rule text: per-loop/session-scoped with an explicit cross-skill-parallel exception when the operator authorizes it (this request does) |
| **Risk — REALIZED** | **Both CLI dispatches ran directly against the live working tree with `--dangerously-skip-permissions` and only prose-level (not sandboxed) containment, with no `git worktree` isolation** | **A dispatched session deleted the entire untracked `008-divergent-mode-dogfood/` packet mid-run — real, unrecoverable-via-git data loss** | **Not mitigated before this run; see `research/INCIDENT.md` and `review/INCIDENT.md`. Matches the repo's own documented RM-8 destructive-scope-violation precedent, whose four-layer mitigation (worktree isolation, banned-ops prompt text, clean-baseline commit, executor preference) was not applied here.** |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether/how to re-run this dogfood pass given the realized destructive-scope-violation risk — deferred to operator decision, see `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-001
REQ-002
REQ-003
REQ-004
REQ-005
**Given**
**Given**
**Given**
**Given**
**Given**
-->
