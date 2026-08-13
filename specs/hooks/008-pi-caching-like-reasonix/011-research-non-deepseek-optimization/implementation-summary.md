---
title: "Implementation Summary: Non-DeepSeek Optimization Research"
description: "A 10-iteration forced-depth read-only deep-research loop audited pi-cache-optimizer's non-DeepSeek surface and produced 15 priority-ranked findings; a concurrent unrelated dispatch collision caused and recovered a real write-containment false-positive revert."
trigger_phrases:
  - "implementation summary"
  - "non-deepseek optimization research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/011-research-non-deepseek-optimization"
    last_updated_at: "2026-08-11T06:43:19.204Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Closed the research packet; recorded deliverable and the containment-revert recovery"
    next_safe_action: "Packet complete; operator may authorize a P0/P1 implementation follow-up"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
      - "research/lineages/deepseek-flash/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "close-011-non-deepseek-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Non-DeepSeek Optimization Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-research-non-deepseek-optimization |
| **Completed** | 2026-08-09 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A read-only deep-research loop audited `.pi/extensions/pi-cache-optimizer/index.ts` (9,239 lines) for further optimization opportunities on its non-DeepSeek code path. 10 forced-depth iterations ran via a single fan-out lineage on `deepseek/deepseek-v4-flash` (executor `cli-opencode`); stop policy was `max-iterations`, so convergence was telemetry-only and the loop ran the full requested depth (average `newInfoRatio` 0.72, far above the 0.05 convergence threshold — this was intentional exhaustive coverage, not premature stopping).

The deliverable is `research/lineages/deepseek-flash/research.md`: an executive verdict, method, source-reliability classes, 15 priority-ranked findings (K1-K15, P0-P3) each with `index.ts:line` citations, a provider coverage matrix across every enabled model, a test-coverage-gap analysis, eliminated alternatives (negative knowledge), open questions, and a convergence report.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/**` | Created | Single-lineage fan-out outputs: config, state log, strategy, registry, 10 iteration files, `research.md` |
| `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md` | Created | Level-1 closure doc set, authored after the loop (the single-lineage CLI-executor path does not auto-seed packet-root docs the way the native per-iteration path does) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator asked for 10 iterations of deep research using `deepseek-v4-flash` to find further non-DeepSeek optimization opportunities for `pi-cache-optimizer`. Since a single named executor (not multiple `--executor` groups) does not by itself route through the fan-out runtime, the config was constructed directly as a one-entry `legacyFanoutConfigSchema` (`kind: cli-opencode`, `model: deepseek/deepseek-v4-flash`, `label: deepseek-flash`, `count: 1`, `iterations: 10`) and dispatched through `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` directly, matching the same runtime this packet's sibling research phase (`007-research-fork-improvements`) used for its 3-lineage fan-out — a single lineage is the same code path with one entry, not a hand-rolled substitute.

The research topic was seeded with real, already-gathered evidence from this session (the guard's exact hook names, the historical live cache-hit-rate baseline, the provider-specific logic already confirmed present, and the specific gap in GLM/MiniMax/Xiaomi/Kimi/Qwen coverage) so the loop built on confirmed facts rather than rediscovering them.

**Before letting a `--dangerously-skip-permissions` dispatch run unsupervised, the exact mechanism was read, not assumed.** `cli-opencode`'s own reference material documents a real, prior incident (2026-05-04, 44 files deleted under a different automated dispatch) from this same executor/permission combination. The current `fanout-run.cjs` source was read directly before launch: every dispatch kind runs a write-containment guard unconditionally — a not-in-HEAD (untracked) out-of-scope path is preserved on disk and reported as a non-fatal advisory, never deleted; only an in-HEAD (tracked) breach is reverted, and that revert is git-recoverable (`checkout HEAD`). This is a materially different, and materially safer, protection than existed at the time of the 2026-05-04 incident. The run was launched and monitored on that basis, not on blind trust of the `--dangerously-skip-permissions` flag alone.

**The 10 iterations completed cleanly** (`deep-research-config.json` `status: "complete"`), each producing a real iteration file and state-log record, at roughly 60-90 seconds per iteration.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Construct a one-entry fan-out config instead of hand-simulating the native single-executor phase_loop manually | The fan-out runtime already implements the full per-iteration CLI dispatch, state management, and lineage `research.md` synthesis for exactly this executor kind; hand-walking the markdown workflow's raw step definitions one iteration at a time would duplicate that logic error-prone-ly for no benefit |
| Read `fanout-run.cjs`'s actual containment-guard code before launch, rather than trusting the printed `FATAL WARN` at face value | The warning alone reads as "unmitigated"; the real code showed an active, uniform revert-on-violation guard that materially changes the risk calculus versus the documented 2026-05-04 incident |
| Author packet-root closure docs after the fact rather than leaving the packet as research-artifacts-only | Every spec folder in this repo needs the standard Level-1 doc set to be discoverable/complete per the project's own spec-folder discipline; the single-lineage fan-out path does not auto-seed them the way the native per-iteration path's `step_preinit_spec_branch` does |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Loop completion | PASS — 10/10 forced-depth iterations, `deep-research-config.json` status=complete |
| `research/lineages/deepseek-flash/research.md` synthesized | PASS — executive verdict, method, 15 findings, provider matrix, test-gap analysis, convergence report |
| Evidence spot-check (K1) | PASS — `index.ts:1371-1376` (`shouldInjectOpenAIPromptCacheKey`), `index.ts:2599-2616` (`addOpenAIPromptCacheKey`, `hasEffectivePromptCacheKey`) read directly and match the finding's description exactly |
| Evidence spot-check (K2) | PASS — `index.ts:3956-3967` (`selectAdapterForAssistantMessage`), `index.ts:8196-8197` (early return when no adapter matches) read directly and match the finding's description exactly |
| `validate.sh --strict` on this folder | PASS — 0 errors, 0 warnings |
| `validate.sh --recursive --strict` on the whole `039` packet | PASS — 0 errors, 0 warnings across all folders including this new one |
| Scoped `git status` after recovery | PASS — only the intended packet files plus the restored `AGENTS.md`/004-packet files; no other file touched |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A real write-containment false-positive occurred and was recovered during this run.** While this lineage was running, a separate, unrelated agent dispatch (requested by the operator in parallel, in the same turn) legitimately edited `AGENTS.md` and 3 metadata files under `specs/agents/004-agents-md-bloat-audit/`. The fan-out's write-containment guard snapshots dirty paths outside the lineage directory before dispatch and reverts any new dirty path afterward, attributing all such changes to the lineage under test. It has no way to distinguish "this lineage wrote this" from "an unrelated concurrent process wrote this," so on lineage exit it reverted all 4 files to their pre-edit committed state (`orchestration-summary.json`: `"error":"lineage deepseek-flash violated write containment: reverted 4 out-of-scope path(s): AGENTS.md, specs/agents/004-agents-md-bloat-audit/description.json, specs/agents/004-agents-md-bloat-audit/graph-metadata.json, specs/agents/004-agents-md-bloat-audit/implementation-summary.md"`). The revert was a real regression on the unrelated agent's already-verified work, not a hallucinated write by this lineage — confirmed by checking the actual reverted content (the Fable/Open Design rows were back, the Cursor/Devin rows were gone, and `git status --porcelain` on those 4 paths showed no diff at all, i.e. a full revert to HEAD). It was fixed immediately by reapplying the already-known-correct edit directly (no re-dispatch needed) and re-validating that packet clean. **Lesson for future runs: do not launch a `--dangerously-skip-permissions` CLI research/review dispatch concurrently with any other file-editing dispatch against the same repository** — the containment guard's git-dirty-based attribution cannot tell the two apart.
2. **The orchestration-level status is technically "partial"/`all_failed: true`** (`orchestration-summary.json`), even though the research content itself is real, complete, and unaffected — the failure classification is entirely about the write-containment attribution above, not about the quality or completeness of the 10 iterations or the synthesized `research.md`. Treat the research deliverable as complete; treat the orchestration exit code as a false-negative caused by the concurrent-dispatch collision, not as evidence the research failed.
3. **This packet's own research is proposal-only.** No implementation was performed against any of the 15 findings; that is an explicit, separate follow-up decision per the packet's own scope.
<!-- /ANCHOR:limitations -->
