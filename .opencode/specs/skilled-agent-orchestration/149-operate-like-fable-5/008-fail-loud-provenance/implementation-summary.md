---
title: "Implementation Summary: Fail-loud executor provenance (Complete)"
description: "Requested-vs-actual model diff in the deep-loop executor audit: detectable model substitution now emits a loud model_mismatch dispatch failure, with a fallback-router approval guard. Shipped and proven by vitest."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-operate-like-fable-5/008-fail-loud-provenance"
    last_updated_at: "2026-06-16T05:00:00Z"
    last_updated_by: "opus-agent"
    recent_action: "Shipped model_mismatch guard + fallback approval guard; 21 packet tests green"
    next_safe_action: "Orchestrator reconciles the 149 parent map"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts"
      - ".opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-008-fail-loud-provenance"
      parent_session_id: null
    completion_pct: 100
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
| **Status** | Complete |
| **Completed** | 2026-06-16 |
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

The deep-loop executor now refuses to ship a lying provenance record. The original plan assumed the audit already recorded an actual model to diff against — it does not. `buildExecutorAuditRecord` records `executor.model`, which is the model the caller requested from config, not the model the CLI actually ran. No actual model was captured anywhere. So the shipped fix captures the actual model from CLI output where it is reliably reported, then fails loud when it disagrees with the requested model.

A new `extractActualModel(stdout, kind)` helper parses the model the CLI reported, but only for `cli-opencode`, whose `opencode run --format json` output is a machine-readable JSON event stream. It returns `null` for `cli-codex`, `cli-claude-code`, and `native`, because those do not reliably report the actual model on stdout, so guessing would risk a false loud failure. After a clean spawn (no error, status 0, no signal), `runAuditedExecutorCommand` computes the actual model; when it is known, a model was requested, and the normalized actual differs from the normalized requested, it emits a loud `model_mismatch` dispatch failure through the existing `emitDispatchFailure` seam and returns without recording success. When the actual model is unknown, the kind is native, or no model was requested, the run proceeds untouched — no false positive.

`model_mismatch` joins the `DispatchFailureReason` union so the type forces the reason string to stay consistent and downstream readers tolerate the additive value. The fallback router gained an optional caller-approved model set on `resolveFallback`: when supplied, a configured `fallback_target` outside that set returns `fail-fast` (unapproved substitution rejected) while the legitimate cross-pool fallback to an approved target still routes; when the set is omitted, behavior is unchanged, so the guard is additive.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Modify | Add `model_mismatch` to `DispatchFailureReason`; add `extractActualModel` (opencode-only) + `normalizeModelId`; fail loud on a detectable requested-vs-actual mismatch after a clean spawn. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | Modify | Add an optional caller-approved model set so `resolveFallback` never routes to an unapproved model; preserve the configured separate-pool fallback. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts` | Create | 10 cases: detectable mismatch fails loud, match passes, casing/whitespace tolerance, native skip, actual-unknown (codex/claude) skip, no-model-requested skip, approved fallback routes, unapproved substitution fails fast, backward-compatible no-approval-set route. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

A green baseline of the full deep-loop-runtime suite was captured first (351 passing). The opencode JSON event stream shape was confirmed against the live CLI (`opencode run --format json`) rather than assumed: a successful run's `step_start` / `text` / `step_finish` events do not carry a model id on this build, which is exactly why `extractActualModel` returns `null` and skips when no model field is surfaced. The comparison and guard were then added and proven by a new vitest that drives a fake opencode-style CLI emitting a model-bearing event, so the mismatch path is exercised regardless of the live build. A mutation check confirmed the test bites: inverting the comparison turned the mismatch and match-pass cases RED, and restoring it returned them to green. The change is additive with no data migration, so rollback is a clean `git revert`.
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

Evidence pinned to the working tree at base SHA `ff7b28ebcd` plus the uncommitted edits in this packet (not yet committed).

| Check | Result |
|-------|--------|
| Full `deep-loop-runtime` suite (`npx vitest run --no-coverage`) | PASS, 376 passing (351 baseline + 21 new packet tests across 008/009, plus pre-existing untracked test deltas) |
| `vitest` mismatch-loud + match-pass + edge cases (`executor-provenance-mismatch.vitest.ts`) | PASS, 10/10 |
| Mutation check (invert the comparison) | Mismatch + match-pass cases went RED, then restored to green — the test bites |
| `vitest` regression (`executor-audit.vitest.ts`, `fallback-router.vitest.ts`, `dispatch-failure.vitest.ts`) | PASS, unchanged |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Detectable mismatches only.** The guard catches a substitution only when the CLI reports the actual model on stdout AND that model differs from the requested one. A CLI that silently substitutes a model AND still reports the requested model cannot be caught — there is no signal to diff against.
2. **Actual-model extraction is opencode-only.** `extractActualModel` parses the model from `cli-opencode`'s JSON event stream. For `cli-codex`, `cli-claude-code`, and `native`, it returns `null` (actual model not reliably reported on stdout), so those kinds are skipped rather than guessed. This is deliberate: a guess would risk a false loud failure that blocks a legitimate run. Catching codex/claude substitutions would require parsing their own provenance output and is out of scope here.
3. **opencode's success stream may omit the model.** On the verified live build, a clean `opencode run --format json` stream's step/text events carry no model id; the id was observed only in error events. When no model field is surfaced, `extractActualModel` returns `null` and the check is skipped, so in practice the mismatch fires only when a build does surface the model on a successful stdout stream. The logic is proven regardless via a fake CLI in the vitest. **Because the live build does not surface the model, the requested-vs-actual check is DISABLED BY DEFAULT — gated behind `SPECKIT_PROVENANCE_CHECK=1`.** It ships dormant (no overhead, no false positives) and activates only when a CLI is known to report the model on success; the `model_mismatch` type and the fallback-router approval guard remain active regardless.
4. **Efficiency-only scope.** This phase makes provenance honest; it does not add the governor capsule, subagent injection, or behavioral measurement (separate 149 phases).
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

