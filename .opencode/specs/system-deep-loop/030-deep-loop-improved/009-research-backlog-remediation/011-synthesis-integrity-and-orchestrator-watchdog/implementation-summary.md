---
title: "Implementation Summary: Synthesis Integrity and Orchestrator Watchdog"
description: "Summary of the synthesis-completion invariant, the post-exit orchestrator watchdog, and reconstructResearchRegistryFromState — the final child of the 009-research-backlog-remediation phase."
trigger_phrases:
  - "synthesis integrity orchestrator watchdog implementation summary"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/009-research-backlog-remediation/011-synthesis-integrity-and-orchestrator-watchdog"
    last_updated_at: "2026-07-01T17:35:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented by GPT-5.5 xhigh, independently verified by Sonnet 5"
    next_safe_action: "Phase 009 fully complete — no further children remain"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-deep-loop/030-deep-loop-improved/009-research-backlog-remediation/011-synthesis-integrity-and-orchestrator-watchdog` |
| **Completed** | 2026-07-01 |
| **Level** | 1 |
| **Implemented by** | `openai/gpt-5.5-fast` (`--variant xhigh`) via `cli-opencode` |
| **Verified by** | Claude Sonnet 5 (orchestrating session) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Fixed the two most severe bugs found during this whole remediation phase's own operational work — both directly observed in production during this same session (a real 1h20m+ orchestrator hang, and a real lineage whose 35 iterations of substantive work were nearly lost entirely) — plus closed the last related gap (`reconstructResearchRegistryFromState`).

1. **Synthesis-completion invariant** (both `deep_research_auto.yaml` and `deep_review_auto.yaml`): the unconditional `append_to_jsonl` action that logged `synthesis_complete` is now a real inline Node script that checks (a) the registry/output/dashboard artifacts actually exist on disk, and (b) the state log's own iteration finding counts are consistent with the registry's finding count. If either check fails, it logs `synthesis_incomplete` (with structured `invariantFailures`/`missingArtifacts`/counts) instead — exactly the invariant that would have caught the generation-2 `glm` lineage narrating false completion.
2. **Orchestrator post-exit watchdog**: a genuinely new mechanism, distinct from the pre-existing `lagCeilingMs` queue-lag heuristic. `fanout-pool.cjs` now accepts an injected `getAttemptLiveness` callback and a `postExitGraceMs` grace period; `fanout-run.cjs` wires real `onSpawn`/`onExit` callbacks from the actual subprocess lifecycle into a liveness map. Once a lineage's subprocess is confirmed dead (not merely "elapsed a long time"), a bounded grace period (default: the greater of 5 minutes or 2× the configured heartbeat) elapses before the worker is force-failed with reason `orphaned_after_subprocess_exit`, letting the top-level process settle and exit instead of hanging indefinitely.
3. **`reconstructResearchRegistryFromState`**: mirrors the already-shipped `reconstructReviewRegistryFromState` exactly, closing the last asymmetry between the review and research merge paths. Prefers structured state-log finding data when present, falls back to synthesizing minimal entries from `findingsCount` + narrative text when the registry is entirely missing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modified | Synthesis-completion invariant (research) |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Modified | Synthesis-completion invariant (review) |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified | `getAttemptLiveness`/`postExitGraceMs` watchdog mechanism |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Real subprocess liveness tracking (`onSpawn`/`onExit`), grace-period default computation |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modified | `reconstructResearchRegistryFromState`, wired into `mergeResearchRegistries` |
| `.opencode/skills/deep-loop-runtime/tests/unit/run-now-yaml-control.vitest.ts` | Modified | Synthesis-invariant tests (failure case + legitimate-zero-findings case) |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts` | Modified | Watchdog tests (force-fail case + must-not-false-positive case) |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` | Modified | `reconstructResearchRegistryFromState` test |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched to `openai/gpt-5.5-fast` (`--variant xhigh`) via `cli-opencode` with the exact production evidence from this session's own generation-2 research run (the false `synthesis_complete` narration, the live `ps`/`lsof`-confirmed 1h20m+ hang) and explicit instruction that the post-exit watchdog must be a distinct mechanism from the existing `lagCeilingMs` queue-lag heuristic, not a default-value flip. The dispatch captured a real pre-change baseline (563/565) before touching any code, correctly distinguished the two watchdog mechanisms, designed the liveness check as an injected callback (enabling deterministic unit tests without spawning real hung subprocesses), and chose a grace-period default matching both of the spec's own suggested values.

**The dispatch's background process was interrupted before delivering its final structured JSON report** (its last narrated step was running `validate.sh --strict` against its own spec folder, correctly blocked by the missing `implementation-summary.md` outside its allowed write paths — the log ends there with no further output, consistent with an unexpected process termination rather than a deliberate stop). This orchestrating session did not rely on the incomplete self-report: independently read the actual diffs for all 5 touched files to confirm each of the 3 fixes was genuinely and correctly implemented (not just narrated), independently re-ran the 3 modified test files (68/68) and the full suite (570/572, matching the delta the dispatch itself had reported mid-stream), before finalizing this documentation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Watchdog liveness as dependency injection, not a hardcoded check.** `getAttemptLiveness` is a callback the pool accepts, with `fanout-run.cjs` supplying real subprocess-exit evidence — this is what makes both the "force-fail after grace" and "must not false-positive on alive worker" test cases possible without spawning real long-running or hung subprocesses.
- **Grace period keyed off confirmed death time, tracked per-attempt** (`activeAttempt.subprocessExitedAtMs`), not off overall dispatch elapsed time — exactly the design constraint the spec required, verified directly in the diff.
- **Did not touch the existing `lagCeilingMs` mechanism at all** — confirmed via diff review that `handleLagCeilingExceeded`'s own logic, thresholds, and event types are byte-for-byte unchanged; the new watchdog is a fully separate code path (`handlePostExitWatchdog`).
- **This orchestrating session did not accept the dispatch's own self-report as sufficient**, given its process was interrupted mid-verification — every claim in this summary is backed by this session's own direct diff reads and independent test re-runs, not transcribed from the dispatch's (incomplete) narration.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

1. **`reconstructResearchRegistryFromState` wiring**, independently confirmed via diff: defined at `fanout-merge.cjs:872`, exported, and wired into the `lineageData` mapping analogously to the review-side function (`if (!registry && loopType === 'research') { registry = reconstructResearchRegistryFromState(...) }`).
2. **Synthesis invariant**, independently confirmed via diff for both YAMLs: real artifact-existence + finding-count cross-check logic, correctly distinguishes "artifacts missing" (fails) from "artifacts present, genuinely zero findings" (passes normally) — traced through the exact conditional logic.
3. **Watchdog**, independently confirmed via diff: `getAttemptLiveness`/`postExitGraceMs` accepted by `fanout-pool.cjs`; `fanout-run.cjs` wires real `onSpawn`/`onExit` subprocess-lifecycle callbacks into a liveness map; grace-period computation (`max(5min, 2×heartbeat)`) matches the spec's own suggested defaults; confirmed the pre-existing `lagCeilingMs` mechanism is completely untouched.
4. **3 modified test files**, independently re-run: `npx vitest run tests/unit/fanout-merge.vitest.ts tests/unit/fanout-pool.vitest.ts tests/unit/run-now-yaml-control.vitest.ts` → **68/68 pass**.
5. **Full suite**, independently re-run: `npx vitest run` (whole `deep-loop-runtime` package) → **570/572 pass** (up from the dispatch's own captured 563/565 pre-change baseline). The 2 failures are the same pre-existing, unrelated baseline confirmed throughout this entire remediation phase (`dependency-seams.vitest.ts`, `executor-provenance-mismatch.vitest.ts`).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- None identified. All 3 P0 requirements are independently verified against the actual repo state, not just the dispatch's own (incomplete) narration.
<!-- /ANCHOR:limitations -->
