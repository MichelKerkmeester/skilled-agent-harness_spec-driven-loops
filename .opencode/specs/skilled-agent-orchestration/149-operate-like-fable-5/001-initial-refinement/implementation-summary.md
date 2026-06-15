---
title: "Implementation Summary: Distribute Fable 5 Operating Doctrine Across Spec-Kit Surfaces"
description: "The Fable 5 operating doctrine is now enforced through the framework's most-read surfaces and two new auto-surfacing constitutional rules, distributed surgically without bloating AGENTS.md."
trigger_phrases:
  - "fable 5"
  - "implementation summary"
  - "operating doctrine"
  - "constitutional rules"
  - "claim legibility"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-operate-like-fable-5"
    last_updated_at: "2026-06-14T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 2 impl docs for Fable 5 distribution"
    next_safe_action: "Owner decides Barter git-posture contradiction"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/system-spec-kit/constitutional/regression-baseline-and-delta.md"
      - ".opencode/skills/system-spec-kit/constitutional/finding-is-a-hypothesis.md"
      - ".opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md"
      - ".opencode/skills/sk-code/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Barter's main-branch-direct-push.md authorizes direct push while its AGENTS.md §1 declares git read-only; owner decision needed."
    answered_questions:
      - "Distribution shape: surgical across AGENTS.md, two new constitutional rules, one fold, and sk-code."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | skilled-agent-orchestration/149-operate-like-fable-5 |
| **Completed** | 2026-06-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Fable 5 operating doctrine no longer lives only in an external note. Its rules — verify before you claim, make confirmed-vs-inferred claims legible, capture a baseline before "no regressions" and report the delta, treat a finding as a hypothesis until you open the cited code, and name the rollback before any irreversible or outward action — are now wired into the framework's most-read surfaces and into two auto-surfacing constitutional rules. The distribution was deliberately surgical: it cross-references the existing Four Laws and Completion Verification Rule instead of restating them, so AGENTS.md gained discipline without gaining bulk.

### Operating Discipline subsection in AGENTS.md
A new `Operating Discipline — Claim Legibility & Blast-Radius` subsection (9 bullets) now sits in §1 of the Public root `AGENTS.md` and its byte-identical `CLAUDE.md` twin, adding +14 lines to land at 447 — under the ~500-line budget. The same subsection went into `Barter/ai-speckit/coder/AGENTS.md` as a read-only-git variant (its rollback bullet defers to Barter §1's read-only git posture), adding +14 lines to land at 468. (The 9th bullet — "name what still speaks the old contract" — was added during review to close a confirmed Fable5 fidelity gap.)

### Two new constitutional rules
`regression-baseline-and-delta.md` (capture the baseline before claiming "no regressions"; report the delta) and `finding-is-a-hypothesis.md` (a sub-agent, reviewer, or Explore finding is a hypothesis until you open the cited code) were added to `.opencode/skills/system-spec-kit/constitutional/` and mirrored to Barter's constitutional folder. Both are deltas over the existing `verify-before-completion-claims.md` rather than restatements, and both auto-synced to the `.claude` mirror.

### Two small folds
`main-branch-direct-push.md` gained a 5th "How to apply" bullet covering non-git outward and irreversible actions — deploy, send, migrate, overwrite shared state — with the rule: name the rollback, then stop for a yes. `sk-code/SKILL.md` gained a "Baseline & blast-radius" line after the Iron Law: capture a baseline before Phase 1, report the delta, and lead with a one-phrase blast-radius read.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` (Public root) | Modified | Operating Discipline subsection in §1 (+13 → 446) |
| `CLAUDE.md` (Public root) | Modified | Byte-identical auto-synced twin |
| `Barter/ai-speckit/coder/AGENTS.md` | Modified | Read-only-git variant of the subsection (+13 → 467) |
| `.opencode/skills/system-spec-kit/constitutional/regression-baseline-and-delta.md` | Created | Baseline-before-no-regressions rule (Public + Barter + .claude mirror) |
| `.opencode/skills/system-spec-kit/constitutional/finding-is-a-hypothesis.md` | Created | Finding-is-a-hypothesis rule (Public + Barter + .claude mirror) |
| `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md` | Modified | 5th "How to apply" bullet for non-git outward/irreversible actions |
| `.opencode/skills/sk-code/SKILL.md` | Modified | Baseline & blast-radius line after the Iron Law |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery was research-first. A deep-research loop (cli-codex gpt-5.5, reasoning_effort=xhigh, service_tier=fast, max 10 iterations) ran over `external/Fable5.md` and the current agent stack, converged at 5 iterations (newInfoRatio 0.95 → 0.72 → 0.55 → 0.38 → 0.08, 5/5 questions answered), and produced the canonical synthesis at `research/research.md`. That synthesis validated two things before any file was touched: the surgical distribution shape, and the redundancy analysis that ruled out duplicating doctrine already covered elsewhere. The edits were then applied surface by surface and checked with diff, grep, and line-count gates. Each edit is independent and reversible.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cross-reference the Four Laws instead of restating them | Keeps AGENTS.md under its line budget while still absorbing the doctrine |
| Ship the doctrine as two new constitutional rules plus folds, not one AGENTS.md dump | Constitutional rules auto-surface and stay maintainable; a dump would bloat the most-read surface |
| Drop the planned sk-git embedding | Already covered by sk-git rule #12 plus `commit_workflows.md`; adding it would duplicate |
| Drop the planned orchestrate.md §5 hard-checklist edit | Superseded by the auto-surfacing `finding-is-a-hypothesis.md` rule, and orchestrate.md is three drifting mirrors (.opencode/.claude/.codex-generated), making a direct edit drift-prone |
| Defer the constitutional re-index | Blocked by a pre-existing stale spec-memory dist; the rules will index on the next daemon scan rather than forcing a build |
| Flag the Barter git-posture contradiction instead of auto-fixing it | Barter authorizing direct push while declaring git read-only is a pre-existing policy contradiction that belongs to the owner's judgment, not this surgical packet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `AGENTS.md` ≡ `CLAUDE.md` byte-identical | PASS |
| Both AGENTS files under ~500 lines | PASS (Public 446, Barter 467) |
| Operating Discipline subsection present in all 3 AGENTS files | PASS |
| Two new constitutional rules well-formed and present in Public & Barter | PASS |
| `main-branch-direct-push.md` 5th "How to apply" bullet present | PASS |
| `sk-code/SKILL.md` Baseline & blast-radius line present | PASS |
| `research/research.md` converged synthesis present | PASS |
| Constitutional re-index | PENDING — blocked by pre-existing stale spec-memory dist; will index on next daemon scan |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Constitutional re-index is deferred.** The two new rules are present and well-formed but are not yet indexed into spec-memory because the spec-memory dist is stale from pre-existing work. They will be picked up on the next daemon scan; no action is required beyond that scan.
2. **Barter git-posture contradiction is unresolved by design.** Barter ships `main-branch-direct-push.md` (which authorizes direct push) while its `AGENTS.md` §1 declares git READ-ONLY. This pre-existing contradiction surfaced during the work and is flagged for the owner's decision; it was deliberately not auto-fixed.
3. **The larger shared evidence contract is out of scope.** The research surfaced a machine-checkable evidence contract (claim_class / evidence / would_confirm / baseline / gate_delta / scope_state / child_result_verified) wired into post-dispatch-validate as a high-value follow-up. It is intentionally deferred as a future packet, not attempted here.
<!-- /ANCHOR:limitations -->
