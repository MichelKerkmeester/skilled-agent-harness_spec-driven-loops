---
title: "Implementation Summary: Fail-loud executor provenance (PLANNED)"
description: "Planning-stage summary for the requested-vs-actual model diff in the deep-loop executor audit. Not built yet; see plan.md and tasks.md for the implementation path."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/008-fail-loud-provenance"
    last_updated_at: "2026-06-15T14:06:40Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-fail-loud-provenance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-fail-loud-provenance |
| **Status** | PLANNED |
| **Completed** | Not yet (planning stage) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

Pending implementation — see plan.md / tasks.md. This phase makes the deep-loop executor provenance fail loud: it adds a requested-vs-actual model comparison at the point the audit already records the actual model, and emits a loud `model_mismatch` dispatch failure instead of silently shipping an artifact whose recorded model does not match the one the caller approved.

Target files: `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` (add the requested-vs-actual diff around `buildExecutorAuditRecord`, emit `model_mismatch` via the existing `emitDispatchFailure`), `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` (guard `resolveFallback` so it never routes to an unapproved model while keeping the configured separate-pool fallback), and `.opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts` (new vitest proving mismatch fails loud and a match passes).

### Planned Behavior

Once built, a requested-vs-actual model mismatch produces a loud dispatch failure rather than a silent substitution, a provenance-losing crash escalates visibly through the existing `crash` path, and the existing audit and quota-pool fallback behavior is otherwise preserved.

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Modify (planned) | Add requested-vs-actual model diff; emit `model_mismatch` dispatch failure on mismatch. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | Modify (planned) | Never route to an unapproved model; preserve configured separate-pool fallback. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts` | Create (planned) | Prove mismatch fails loud and match passes. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Pending implementation. The planned delivery captures a green baseline of the existing `executor-audit`, `fallback-router`, and `dispatch-failure` vitests first, adds the comparison and guard, then proves both paths with a new vitest plus a mutation check (revert the comparison, confirm the mismatch test goes RED, restore). The change is additive with no data migration, so rollback is a clean `git revert`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Reuse the existing `emitDispatchFailure` / `DispatchFailureReason` seam instead of a new error channel | The audit already records the actual model and already emits typed dispatch failures, so the fix is one comparison plus one reason member, keeping blast radius small and downstream readers unchanged. |
| Compare against the caller-approved model (including a configured `fallback_target`), not the originally requested one | A legitimate configured fallback is approved, so comparing against the approved target avoids false-loud failures on valid cross-pool fallback. |
| Add a dedicated `model_mismatch` reason rather than reusing `invalid_output`/`other` | A precise reason lets downstream consumers and the vitest assert on the exact provenance failure and keeps the JSONL events self-explaining. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

Pending — gates defined in checklist.md; will run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/008-fail-loud-provenance --strict` and the relevant `vitest` suites (`executor-provenance-mismatch.vitest.ts`, `executor-audit.vitest.ts`, `fallback-router.vitest.ts`, `dispatch-failure.vitest.ts`).

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this spec folder | Pending (planning stage) |
| `vitest` mismatch-loud + match-pass (`executor-provenance-mismatch.vitest.ts`) | Pending (planning stage) |
| `vitest` regression (`executor-audit.vitest.ts`, `fallback-router.vitest.ts`, `dispatch-failure.vitest.ts`) | Pending (planning stage) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Not built yet.** This is a planning-stage summary; the comparison, the fallback-router guard, and the vitest are defined in plan.md and tasks.md but not implemented.
2. **Efficiency-only scope.** This phase makes provenance honest; it does not add the governor capsule, subagent injection, or behavioral measurement (separate 149 phases). Re-measurement is paired with phase 003.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

