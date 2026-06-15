---
title: "Implementation Summary"
description: "Cross-skill audit identified three runtime-feature gaps in the deep skill family; three targeted fixes closed them using existing runtime primitives; five deliberate non-fixes are recorded as ADRs after architect consult and two parallel confidence-gate audits."
trigger_phrases:
  - "deep-loop-runtime utilization summary"
  - "runtime hardening implementation"
  - "deep-improvement atomic state"
  - "deep-review loop-lock implementation"
  - "fanout-run executor-audit wiring"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-deep-context-gathering/003-runtime-feature-utilization"
    last_updated_at: "2026-06-07T07:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "10-round deep review + remediation: P0 resolver, reducer wiring, 6 P1s, 7 docs"
    next_safe_action: "Done; see review/review-report.md CONDITIONAL-PASS; P2 backlog deferred"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs"
      - ".opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs"
      - ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml"
      - ".opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-model-benchmark-loop_confirm.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:21f084a2955d99a9dfb62e715e4564513164ec612ad6122518ce1ba3ac9e1663"
      session_id: "dlr-135-20260606"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "fanout-run.cjs is the real CLI-seat spawn-env site; multi-seat-dispatch.cjs confirmed no-spawn primitive"
      - "All three fixes implemented and verified; five non-fix ADRs documented"
      - "Runtime 291/291; council 23/23; fixture smoke green; validate.sh PASSED"
      - "GAP-2: deep-improvement loop-lock added to all four improvement/benchmark YAMLs (auto+confirm)"
      - "GAP-3: readJournal corruption surfacing added; readJournalDetailed exported; node --check PASS"
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
| **Spec Folder** | 003-runtime-feature-utilization |
| **Status** | Complete |
| **Completed** | 2026-06-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet closes three runtime-feature gaps identified in a cross-skill audit of the deep skill family against the `deep-loop-runtime` feature catalogue. Each fix wires an already-existing runtime primitive at the right call site — no new abstractions, no new MCP tools, no shared-state schema changes. Five deliberate non-fixes are recorded as ADRs to give the audit a permanent decision trail.

### Fix 1: deep-improvement state safety

`deep-improvement/scripts/shared/reduce-state.cjs` previously read the JSONL state log with no tail-repair, and wrote all outputs with `fs.writeFileSync` — a silent-drop risk if the process is interrupted mid-write. The fix imports `repairJsonlTail` and `writeStateAtomic` from the deep-loop-runtime library (via in-process tsx register with an inline fallback), calls `repairJsonlTail` before parsing the state log, and replaces every `fs.writeFileSync` output write with `writeStateAtomic`. A fixture smoke confirms `repaired=true, source=runtime` and no temp files are left behind; 4/4 reduce-state unit tests pass; `node --check` is green.

### Fix 2: deep-review loop-lock

The deep-review auto and confirm YAML workflows had no `step_acquire_lock`, `step_release_lock`, or `lock_file` fields, meaning two concurrent review runs on the same spec folder could race on the convergence JSONL. The fix adds these three fields to both `deep_start-review-loop_auto.yaml` and `deep_start-review-loop_confirm.yaml`, mirroring the pattern deep-research has used since its initial ship. Both YAMLs now parse cleanly; the pattern is a verbatim copy from the verified deep-research source.

### Fix 3: deep-context executor-audit env (fanout-run.cjs)

The executor-audit's recursion-guard env var was set only in YAML `cli_contract` annotations — prose-only. The real CLI-seat spawn site is `fanout-run.cjs` (multi-seat-dispatch.cjs is a no-spawn model-agnostic primitive and not the right site). The fix calls `buildExecutorDispatchEnv` in `fanout-run.cjs` at the spawn site and merges its output into the child process env. Four new vitest tests gate this: env set on spawn, inline fallback, no temp leak, and `repaired=true` from the runtime path. The runtime suite passes 291/291 (including the 4 new tests) and the council suite passes 23/23 with no regression.

### Fix 4: deep-improvement loop-lock

An audit identified that while deep-review received `step_acquire_lock` / `step_release_lock` / `lock_file` in the original packet, the deep-improvement agent-improvement loop and model-benchmark loop had no equivalent. Both write to the same shared `{spec_folder}/improvement/agent-improvement-state.jsonl`, creating the same cross-session race risk. The fix adds `lock_file: "{spec_folder}/improvement/.deep-improvement.lock"` to `state_paths`, `step_acquire_lock` to `phase_init` (after `step_session_boundary_gate`), and `step_release_lock` to `phase_synthesis` (as the final step) in all four YAML files: `deep_start-agent-improvement-loop_auto.yaml`, `deep_start-agent-improvement-loop_confirm.yaml`, `deep_start-model-benchmark-loop_auto.yaml`, and `deep_start-model-benchmark-loop_confirm.yaml`. The auto variants use fail-closed semantics on contention; the confirm variants present recovery choices, mirroring deep-review's pattern exactly.

### Fix 5: readJournal corruption surfacing

`improvement-journal.cjs` `readJournal` previously caught JSON parse errors with `return []` — silently swallowing corrupt lines, the same anti-pattern the earlier reducer fix eliminated. The fix collects each corrupt line into a `corruptionWarnings` string array, writes each warning to `stderr` for immediate operator visibility, and attaches the array as a non-enumerable `corruptionWarnings` property on the returned records array (backward-compatible: existing callers that iterate the array are unaffected). A new `readJournalDetailed` function returns `{ records, corruptionWarnings }` as a plain object for callers that need the full picture, matching `parseJsonlDetailed`'s shape in the reducer. `node --check` passes.

### Boundary: code-enforced vs prose-only on the per-iteration council-seat path

The code-enforcement applies to the lineage/`buildLineageCommand` spawn path in `fanout-run.cjs`. The pure-prose per-iteration council-seat path still relies on the YAML `cli_contract` for the recursion guard. This is documented as an acceptable boundary in ADR-005 — the council-seat path is a future-hardening option, not a current gap.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work started with a structured audit of each skill's runtime-feature adoption. The audit produced five potential fixes; a cli-opencode architect consult (deepseek-v4-pro) prioritized the list and identified three as actionable and two as over-engineering. Two fresh parallel opus confidence-gate audits independently validated the non-fix decisions before any code was written.

Implementation proceeded fix by fix: reduce-state first (highest risk: silent data loss), review loop-lock second (concurrent-run race), fanout-run third (code-enforcement of an existing prose guard). Each fix is independently revertable. The inline fallback pattern in reduce-state and fanout-run means a missing runtime import degrades gracefully rather than crashing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Inline fallback for runtime imports in reduce-state | Ensures the script works even if the tsx register fails; `source` field in output distinguishes runtime vs fallback path |
| Loop-lock YAMLs mirror deep-research verbatim | The deep-research pattern is verified and in production; copy-exact avoids subtle variation |
| fanout-run.cjs (not multi-seat-dispatch.cjs) as the executor-audit call site | fanout-run.cjs is the real spawn site; multi-seat-dispatch.cjs is a no-spawn model-agnostic primitive |
| No new abstractions for three independent call sites | Direct primitive calls are smaller diffs, easier to review, and easier to revert than a wrapper module |
| Five deliberate non-fixes recorded as ADRs | Gives the audit findings a permanent trail; prevents the same questions from being re-opened in a future session |
| Lock model-benchmark loop too (not skip) | model-benchmark writes to the same `agent-improvement-state.jsonl` as the agent-improvement loop; state is not isolated per run |
| readJournal warnings as non-enumerable property | Keeps all existing callers working (they only iterate the array); `readJournalDetailed` provides the structured form for new callers |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` on `reduce-state.cjs` | PASS |
| `node --check` on `fanout-run.cjs` | PASS |
| `node --check` on `improvement-journal.cjs` | PASS |
| Fixture smoke: `repaired=true, source=runtime`, no temp leak | PASS |
| 4/4 reduce-state unit tests | PASS |
| +4 fanout-run vitest tests | PASS |
| Full deep-loop-runtime vitest suite | PASS, 291/291 |
| Council suite | PASS, 23/23 |
| Review YAML parse (auto + confirm) | PASS |
| Improvement YAML parse (auto + confirm): step_acquire_lock + lock_file present | PASS |
| Model-benchmark YAML parse (auto + confirm): step_acquire_lock + lock_file present | PASS |
| `validate.sh --strict` on packet | PASS, 0 errors, 0 warnings, 2026-06-06 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Inline fallback paths diverge from the runtime over time.** If `repairJsonlTail` or `writeStateAtomic` change their interface, the inline fallback in `reduce-state.cjs` will not track automatically. The fallback is covered by the `source=fallback` test; engineers adding a new test should verify the fallback still behaves identically.
2. **Council-seat path recursion guard remains prose-only.** The per-iteration council-seat path relies on the YAML `cli_contract` for the recursion guard. Code enforcement on that path is a future-hardening option (ADR-005); it is not a current gap because the council path is a discrete-call loop driven by the host, not a long-running daemon that can fork undetected.
3. **Non-fix decisions require re-validation if the skills change materially.** The five non-fix ADRs are grounded in the current architecture (single-process in-memory for graph-replay, host-driven discrete-call for loop-lock advisory, etc.). If those architectural facts change, the ADRs should be revisited.
4. **`ai-council-state.jsonl` writes are non-atomic (known follow-up, non-blocking).** deep-ai-council has a third state writer — `ai-council-state.jsonl` — written by `audit-trail.cjs` (appendFileSync) and `persist-artifacts.cjs` (writeFileSync/appendFileSync) without fsync or a file lock. This differs from the durable sibling writers (`round-state-jsonl.cjs` and `findings-registry.cjs`) that use atomic patterns. The risk is LOW and non-material: the council runs in a single process, so there is no concurrent writer; `ai-council-state.jsonl` carries an artifact audit trail with per-artifact checksums, not the decision-critical state, which lives in the two durable logs. Hardening it would be a marginal gain consistent with the single-process-council reasoning in ADR-001. Deliberately deferred as a documented known follow-up; it does not affect this packet's Complete status.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:audit-methodology -->
## Audit Methodology

The optimization was guided by a structured three-stage process:

1. **Cross-skill sweep**: Each skill's SKILL.md, command YAMLs, and key scripts were read and mapped against the `deep-loop-runtime` feature catalogue (atomic-state, jsonl-repair, loop-lock, executor-audit, bayesian-scorer, fallback-router, permissions-gate, post-dispatch-validate). Findings were classified: code-enforced, prose-only, or unused.

2. **Architect consult**: A cli-opencode (deepseek-v4-pro) dispatch received the full gap list and returned a prioritized recommendation: three actionable fixes, five deliberate non-fixes. The consult provided the `fanout-run.cjs` vs `multi-seat-dispatch.cjs` site-choice reasoning that became ADR-004.

3. **Parallel confidence-gate audits**: Two fresh opus instances independently reviewed the five non-fix decisions. Both returned the same verdict — the non-fixes are justified given current architecture — which elevated confidence above the threshold before any code was written.

The three-stage process is a reusable pattern for future cross-skill optimization work on this family.
<!-- /ANCHOR:audit-methodology -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
