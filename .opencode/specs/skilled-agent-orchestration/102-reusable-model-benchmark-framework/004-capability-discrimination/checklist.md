---
title: "Verification Checklist: Capability discrimination — hard fixtures + isolated dispatch + M3-vs-MiMo verdict"
description: "Verification Date: in progress (run + synthesis pending)"
trigger_phrases:
  - "capability discrimination checklist"
  - "sweep isolation verification"
  - "hard fixtures verification"
  - "m3 vs mimo verdict checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/004-capability-discrimination"
    last_updated_at: "2026-06-02T07:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Capability run complete (24 cells); M3 edges MiMo on reliability — eval/synthesis.md"
    next_safe_action: "Optional: harder fixtures + more samples for a sharper margin (3 of 4 saturated)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts"
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "checklist-127-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which is better, M3 or MiMo? M3 — perfect consistency vs MiMo's 1-in-12 hard miss (reliability edge)"
---
# Verification Checklist: Capability discrimination

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..004, SC-001..004)
- [x] CHK-002 [P0] Technical approach defined in plan.md (isolation fix + hard fixtures + capability run)
- [x] CHK-003 [P1] Dependencies identified and available (003 dispatch envelope + CI; real `code-task-scorer.cjs`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Tests pass — `cd .opencode/skills/deep-improvement/scripts && npx vitest run model-benchmark/tests/` → 149 passed (143 baseline + 6 new), exit 0
- [x] CHK-011 [P0] No new repo pollution from a real dispatch — isolation smoke (1 real dispatch, no `--mock`): git untracked set 33→33 (zero new files)
- [x] CHK-012 [P1] Error handling implemented — `dispatchCell` wraps dispatch in `try/finally fs.rmSync(dir, { recursive: true, force: true })` cleanup
- [x] CHK-013 [P1] Code follows project patterns — per-cell `mkdtemp` temp dir reused as the dispatch `cwd`; test-only `_dispatch` seam for offline isolation assertions
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — REQ-001 (isolation: 0 new untracked, before/after diff) + REQ-002 (fixtures discriminate: roman-to-int separated 1.0 vs 0.627) + REQ-003 (live 24-cell run → aggregate.json) + REQ-004 (honest verdict: M3 edges MiMo on reliability; framework's saturation "TIE" contextualized) all met
- [x] CHK-021 [P0] Build + isolation testing complete — suite 149 passed exit 0; smoke 33→33; 6 isolation tests (dispatch cwd under `os.tmpdir()` not repo root, holds prompt file, cleaned after single + 8-cell sweep, simulated model write does not leak, fixture-shape + profile-load)
- [x] CHK-022 [P1] Oracle / partial-credit cases validated through the real `code-task-scorer.cjs` — reference 1.0 vs wrong <1.0: `hard-merge-intervals` 1.0/0.625, `hard-parse-csv-line` 1.0/0.529, `hard-roman-to-int` 1.0/0.471, `hard-eval-expr` 1.0/0.333
- [x] CHK-023 [P1] Hard fixture pack created — 4 T4 fixtures with 16/17/17/18 oracle cases, each "return ONLY the function source as text; do NOT write files"
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded — the dispatch cwd-pollution bug is a `test-isolation` class fix (per-cell working directory leaked into repo root)
- [x] CHK-FIX-002 [P0] Same-class producer inventory — `dispatchCell` is the only dispatch site that passes a `cwd`; no other dispatch entry passes a working directory
- [x] CHK-FIX-003 [P0] Consumer inventory — `_dispatch` seam consumed only by `sweep-isolation.vitest.ts`; hard fixtures consumed by `code-task-scorer.cjs` and the `capability-m3-vs-mimo.json` profile
- [x] CHK-FIX-004 [P0] Adversarial cases present — hard fixtures carry 16–18 adversarial hidden oracle cases each; the isolation fix is covered by a "simulated model write does not leak" test plus the live smoke (33→33)
- [x] CHK-FIX-005 [P1] Matrix axes listed — model (2) × framework (1, costar) × fixture (4) × samplesPerCell (3)
- [x] CHK-FIX-006 [P1] Process-wide state variant — dispatch writes to a process working directory; isolation asserted under `os.tmpdir()` across single + 8-cell sweeps and verified by a live dispatch
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA — deferred; pin once the run lands and the folder is finalized (currently command + result evidence)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — fixtures and profile contain only task prompts, oracle cases, and model ids
- [x] CHK-031 [P0] Input handling validated — model responses scored by the real scorer; a write-only response scores as a format/extraction miss (honest)
- [x] CHK-032 [P1] Repo safety enforced — agentic model file-writes confined to a temp dir removed in `finally`; smoke proves zero leakage (33→33)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — REQ/SC ids and build-vs-blocked state aligned across spec.md, plan.md, tasks.md
- [x] CHK-041 [P1] Implementation-summary written — `implementation-summary.md` records harness-complete + the live-verdict blocker + verification table
- [x] CHK-042 [P2] Capability synthesis written — `eval/synthesis.md` (SC-003): oracle-level discrimination proof, full blocker diagnosis, and the one-command re-run path (verdict deferred, not fabricated)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files — model writes isolated to per-cell temp dirs, removed in `finally`
- [x] CHK-051 [P1] `eval/` finalized — `results.json` + `aggregate.json` + `synthesis.md` (machine leaderboard + human interpretation) all present from the 24-cell run
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 9/10 |
| P2 Items | 2 | 2/2 |

**Status**: **Complete.** Dispatch-isolation (0 new untracked, before/after diff), the hard fixture pack (oracle-validated, and proven to discriminate live: roman-to-int 1.0 vs 0.627), the 149-test suite, and the live 24-cell M3-vs-MiMo run are all done. Verdict: **MiniMax-M3 edges MiMo-V2.5-Pro on reliability** — M3 perfectly consistent (12/12 at 1.0, gate-eligible); MiMo 0.898 (gate-ineligible) from a single 0.0 on `hard-roman-to-int`. Full reading + caveats (n=3 thin; 3/4 fixtures saturated; framework's "TIE-on-format" is a saturation artifact) in `eval/synthesis.md`. Deferred: CHK-FIX-007 (SHA pin — no commit made this session).

**Verification Date**: 2026-06-02 (harness + live verdict)
<!-- /ANCHOR:summary -->
