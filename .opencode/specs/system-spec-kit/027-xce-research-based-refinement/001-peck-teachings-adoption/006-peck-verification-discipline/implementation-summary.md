---
title: "Implementation Summary: 027/009 Peck Verification Discipline"
description: "Placeholder implementation summary for the peck verification-discipline bundle (T5-T9): completion-verdict freshness, escalation gates, anti-softening, reviewer read-budget, numeric-severity note. Populate after each phase lands."
trigger_phrases:
  - "027 phase 009"
  - "peck verification discipline"
  - "completion-verdict freshness"
  - "anti-verdict-softening"
  - "SPECKIT_COMPLETION_FRESHNESS"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-peck-source-adoption/002-peck-verification-discipline"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 009 planning docs (not implemented)"
    next_safe_action: "Land 010 fixtures, then implement Phase 1 freshness in WARN mode"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-009-peck-verification-discipline-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-peck-source-adoption/002-peck-verification-discipline` |
| **Completed** | Pending |
| **Level** | 3 |
| **Status** | Spec-Scaffolded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Pending implementation. This packet adopts the peck verification-discipline bundle (teachings T5-T9, `../../research/006-peck-source-deep-mining/research.md` §2, cross-model verified §5) per the integration plan (`../../research/006-peck-source-deep-mining/integration-plan.md`): five rules shipping warn-first on existing surfaces, with completion-verdict freshness as the anchor. Zero new infrastructure; depends on `010-reviewer-prompt-benchmark-substrate` for regression fixtures (land first).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `CLAUDE.md` / `AGENTS.md` §2 | Pending | Completion rule: content-fingerprint + clean-tree freshness; anti-softening wording |
| `.opencode/skills/system-spec-kit/constitutional/verify-before-completion-claims.md` | Pending | Durable freshness/clean-tree completion binding |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` + `scripts/validation/continuity-freshness.ts` | Pending | Recompute fingerprint vs content; tighten clock-drift PASS for completion claims |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` | Pending | Recompute `session_dedup.fingerprint` at completion time |
| `.opencode/commands/speckit/complete.md` + `speckit_complete_{auto,confirm}.yaml` | Pending | Freshness precondition; anti-softening verdict; single deep-review verdict line |
| `.opencode/skills/sk-code/SKILL.md` + `CLAUDE.md` Logic-Sync | Pending | Escalation gates (one-sentence root-cause; spec-conflict->amendment; 3-strike; reviewers-contradict) |
| `.opencode/skills/deep-review/SKILL.md` + `deep_start-review-loop_{auto,confirm}.yaml` | Pending | Anti-softening verdict lock; numeric `riskScore` note |
| `.opencode/agents/review.md`, `context.md`, `deep-review.md`, `deep-research.md` (+ `.claude/agents/*` mirrors) | Pending | Reviewer read-budget discipline |
| `.opencode/skills/sk-code-review/SKILL.md` + `references/review_core.md` | Pending | Docs-only +/-2 context calibration note (literal score>=4 block rejected) |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Pending | `SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE` flag rows |
| Net-new UX/automation: validator auto-fix hints; startup/brief freshness indicator; one-command fingerprint refresh; deep-review verdict in `/speckit:complete`; checklist evidence quick-fill | Pending | Folded in as requirements (integration-plan §6) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending. Delivery evidence should include the freshness recompute wired into `validate.sh --strict`, the escalation/anti-softening/read-budget prompt-contract edits with their `.claude` mirrors, the docs-only numeric note, the `SPECKIT_COMPLETION_FRESHNESS` warn->error graduation copying `SPECKIT_SAVE_QUALITY_GATE`, the 010 regression fixtures passing, and strict spec validation. Each rule reuses an existing UX surface with a warn-first actionable message.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Freshness is the anchor, ships warn-first | Highest-value gap; must not false-block legacy folders (copy SPECKIT_SAVE_QUALITY_GATE graduation) |
| Zero new infrastructure | Every rule maps onto an existing surface (validate.sh, structured verdicts, env rollout) |
| Numeric note docs-only; reject literal `score>=4 blocks` | Literal cutoff over-blocks spec-kit P2-advisory cleanup |
| Read-budget ADOPT for `@review`, ADAPT for deep loops | Must not override P0 evidence rereads |
| Depends on 010 first | Reviewer fixtures make the rules regression-safe before any blocker ships |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Freshness invalidates a green completion after in-scope edits (warn-first, then enforce) | Pending |
| 010 fixtures green for stale-verdict, softened-Fail, over-read | Pending |
| Anti-softening keeps exact parseable PASS/CONDITIONAL/FAIL verdicts | Pending |
| Escalation surfaces one consolidated decision (not per-uncertainty thrash) | Pending |
| `.claude/agents/*` mirrors updated or mirror-lag recorded | Pending |
| Strict spec validation: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-peck-source-adoption/002-peck-verification-discipline --strict` | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented yet.** This is a scaffold placeholder; no behavior changes are claimed here.
2. **Broad surface area.** ~40 surfaces incl. `.claude` mirrors and command YAMLs; the rollout is phased and flag-gated to contain blast radius.
<!-- /ANCHOR:limitations -->
