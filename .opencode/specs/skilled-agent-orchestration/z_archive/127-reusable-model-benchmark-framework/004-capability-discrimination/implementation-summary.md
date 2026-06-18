---
title: "Implementation Summary: Capability discrimination — hard fixtures + isolated dispatch (live verdict blocked)"
description: "Built and verified the capability-discrimination harness: a sweep cwd-isolation fix (repo stays clean across real dispatches), a 4-fixture hard partial-credit pack whose oracles are validated through the real scorer (reference 1.0 vs wrong 0.33-0.625), the M3-vs-MiMo profile, and 6 isolation tests (vitest 149). The headline live M3-vs-MiMo verdict is blocked by an opencode run-startup hang on a wedged MCP server (mk-spec-memory .unclean-shutdown) — fully diagnosed, with a one-command re-run path documented in eval/synthesis.md."
trigger_phrases:
  - "capability discrimination summary"
  - "m3 vs mimo verdict blocked"
  - "sweep cwd isolation summary"
  - "hard fixtures oracle validation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-reusable-model-benchmark-framework/004-capability-discrimination"
    last_updated_at: "2026-06-02T07:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Capability run complete (24 cells); M3 edges MiMo on reliability — eval/synthesis.md"
    next_safe_action: "Optional: harder fixtures + more samples for a sharper margin (3 of 4 saturated)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs"
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures"
      - ".opencode/specs/skilled-agent-orchestration/127-reusable-model-benchmark-framework/004-capability-discrimination/eval/synthesis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-127-004-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which is better, M3 or MiMo? M3 — perfect consistency vs MiMo's 1-in-12 hard miss (reliability edge)"
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
| **Spec Folder** | 004-capability-discrimination |
| **Completed** | 2026-06-02 (harness + live M3-vs-MiMo verdict) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The benchmark can now separate models on **substance, not just format**. The prior rig saturated — two tractable fixtures meant both models scored 100% correct, so only brevity distinguished them. This phase built a harness that grades partial correctness over many adversarial cases, isolates the (agentic, file-writing) model dispatches so they cannot pollute the repo, and wires a real MiniMax-M3 vs MiMo-V2.5-Pro comparison profile. Everything is additive over Lane B; the suite is **149 passing**. The live capability run then completed (24 cells, 3 samples × 4 fixtures × 2 models, `--variant high`, ~33 min, 0 pollution / 0 orphans): **MiniMax-M3 edges MiMo-V2.5-Pro on reliability** — M3 is perfectly consistent (12/12 cells at 1.0, passes the correctness gate), while MiMo (0.898, gate-ineligible) had a single catastrophic miss on `hard-roman-to-int` (0.94/0.94/0.0). The full verdict + caveats live in `eval/synthesis.md`.

### Hard partial-credit fixture pack

Four T4 fixtures — `hard-merge-intervals` (16 oracle cases), `hard-parse-csv-line` (17), `hard-roman-to-int` (17), `hard-eval-expr` (18) — each instruct the model to "return ONLY the function source as text; do NOT write files." Every oracle value was validated through the real `code-task-scorer.cjs`: reference implementations score exactly **1.0** and deliberately-wrong implementations score **0.33–0.625**. That spread is the proof the fixtures discriminate code quality instead of saturating.

### Dispatch cwd-isolation fix

`sweep-benchmark.cjs` `dispatchCell` now runs each dispatch with `cwd` set to the per-cell `mkdtemp` temp dir (previously the repo root — the pollution bug) and removes it in a `try/finally`. A real-dispatch smoke proved the repo's untracked-file set is identical before/after (33→33, zero leakage). A test-only `_dispatch` seam lets the isolation be asserted offline.

### Capability profile + isolation tests

`capability-m3-vs-mimo.json` defines the model-vs-model run (M3 + MiMo, `cli-opencode`, `--variant high`, COSTAR, the 4 hard fixtures, correctness gate 1.0, grouped by model). `sweep-isolation.vitest.ts` adds 6 tests (dispatch cwd under `os.tmpdir()` and not the repo root, holds the prompt file, cleaned up after single + 8-cell sweeps, a simulated model write does not leak, plus fixture-shape and profile-load).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A build sub-agent implemented the isolation fix, the fixture pack, the profile, and the tests, then ran a Builder→Critic→Verifier self-check. Independent verification confirmed vitest 149, the four fixtures' oracle counts, a valid profile, and zero stray repo files. The live run then took a long detour: raw `opencode run` dispatches hung, misattributed first to a (real but separate) MCP-server wedge and then to memory pressure. The actual fix came from the `cli-opencode` skill — `opencode run` blocks on stdin in non-TTY automation and needs `</dev/null` (the dispatcher already does this via `stdio: ['ignore',…]`). Once dispatches were proven (single dispatch in ~5 s) and the outer timeout was sized to the ~150 s/dispatch high-reasoning reality (after three under-budgeted attempts), the 24-cell sweep completed cleanly and produced the verdict.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Read the cli-X skill before dispatching.** The whole `opencode run` hang was the documented `</dev/null` stdin contract (cli-opencode ALWAYS rule 5). Skipping the skill (the CLI dispatch rule) turned a one-line fix into a long misdiagnosis; the skill is the source of truth for the invocation contract.
- **Report verdict from data, never fabricate.** The run is gated by a correctness threshold; the honest reading separates raw capability (both models strong) from reliability (M3 consistent; MiMo one 0.0 blip), rather than taking the framework's saturation-artifact "TIE-on-format" label at face value.
- **No destructive environment recovery unprompted.** During the (misattributed) MCP-wedge phase, did not prune the 8.5 GB session DB, delete sessions, edit `opencode.json`, or clear `.unclean-shutdown` — all out-of-scope mutations of the user's environment.
- **Size the timeout to measured reality.** High-reasoning hard-fixture dispatches run ~150 s each; the outer `gtimeout` must cover cells × per-dispatch-cap + backoff. Three under-budgeted attempts preceded the 3000 s run that finished.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run model-benchmark/tests/` | **149 passed**, exit 0 |
| Dispatch isolation (real smoke) | untracked set 33→33, zero new files |
| Oracle validation (real scorer) | reference 1.0 vs wrong 0.33–0.625 across all 4 fixtures |
| Capability profile | `profile-validator.cjs` → `{valid:true, errors:[]}` |
| Repo / orphan hygiene after all runs | 0 stray files, 0 orphaned opencode processes (before/after untracked diff) |
| Live M3-vs-MiMo verdict | **DELIVERED** — 24-cell run, M3 1.0 (gate-eligible) vs MiMo 0.898; verdict + caveats in `eval/synthesis.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **3 of 4 fixtures saturated (primary caveat).** Both frontier models scored 1.0 on merge-intervals, parse-csv-line, and eval-expr; only `hard-roman-to-int` discriminated. The harness flags `promote-or-demote-to-smoke` — a sharper verdict needs harder fixtures (and the saturated three can become smoke tests).
- **n=3 samples is thin.** MiMo's gate miss rests on a single 0.0 event; the true failure rate is uncertain. More samples would tighten it.
- **Framework verdict label can mislead.** When correctness saturates, the reporter ranks on `format` and may print "TIE" even though the correctness gate cleanly separates the models — read the gate eligibility + per-fixture table, not just the headline.
- **`spawnSync` does not bound opencode** (its `timeout` orphans the child) and the **sweep writes results only at the end** (a mid-run kill loses everything) — both recommended P2 hardening; mitigated here with `gtimeout -k` and a correctly-sized outer timeout.
- **Token-efficiency may be partial.** The OpenCode usage parser is defensively null; correctness (partial-credit) is the primary capability signal regardless.
<!-- /ANCHOR:limitations -->
