---
title: "Phase 0 Baseline: Deep-Loop Divergent Convergence Mode"
description: "Pre-change golden decision fixtures, non-consumer file hashes, and auto/confirm asymmetry captured before any implementation edit, per plan.md Phase 0 and checklist.md CHK-006."
trigger_phrases:
  - "divergent convergence phase 0 baseline"
  - "pre-change golden fixtures"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/012-deep-loop-divergent-mode"
    last_updated_by: "claude"
    recent_action: "Captured Phase 0 baseline in isolated worktree wt/0026-deep-loop-divergent-mode before any runtime edit"
    next_safe_action: "Proceed to Phase 1 (command/config/runtime propagation) cli-opencode dispatch"
    blockers: []
    key_files:
      - "../../../../.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs"
    completion_pct: 100
---

# Phase 0 Baseline: Deep-Loop Divergent Convergence Mode

Captured inside isolated worktree `wt/0026-deep-loop-divergent-mode` at commit `37fc5f789a` (`feat(058): benchmark mcp-tooling + cli-external hubs and act on the findings`), before any implementation edit for packet 055.

## 1. Runtime test suite baseline

`cd .opencode/skills/system-deep-loop/runtime && npx vitest run --no-coverage`

**657 passed / 659 total (71 test files, 69 passed).** Two pre-existing failures, both unrelated to this packet's scope and NOT to be attributed to divergent-mode work:

| Test | Failure | Cause |
|---|---|---|
| `tests/unit/check-contract-drift.vitest.ts > passes against the real current compiled contracts` | `STALE_SOURCE_DIGEST` for command `deep/ai-council`: `recordedSha256` in the compiled contract no longer matches the live digest of `.opencode/skills/system-deep-loop/mode-registry.json` | Pre-existing drift from the just-landed `37fc5f789a` commit (unrelated `058` benchmark work touched `mode-registry.json` without regenerating compiled contracts). Not caused by, or in scope for, packet 055. |
| `tests/unit/executor-provenance-mismatch.vitest.ts > skips the check when the actual model cannot be extracted for Claude Code` | Expected a `'start'` state-log event, received `'dispatch_failure'` | Pre-existing test-ordering/fixture issue in an unrelated executor-provenance module. Not touched by this packet. |

This is the reference point for "no behavioral change outside pinned expected deltas" (spec.md REQ-001, checklist.md CHK-010): after Phase 5, the runtime suite must show the same 657/659 baseline (these exact 2 pre-existing failures allowed to persist untouched) plus all new divergent-mode tests passing.

## 2. Golden decision fixtures — `default`, `off`, `sliding-window`

`convergence.cjs` invoked directly against an empty graph (`--spec-folder specs/baseline-test --loop-type research --session-id baseline-00N`), one call per mode. All three currently produce byte-identical decision envelopes (mode does not change graph-empty behavior):

```json
{"status":"ok","data":{"decision":"CONTINUE","reason":"Graph is empty; insufficient data for convergence assessment","scoreDelta":null,"scoreDeltaNote":"no prior snapshot","signals":null,"blockers":[],"trace":[],"namespace":{"specFolder":"specs/baseline-test","loopType":"research","sessionId":"<id>"},"scopeMode":"session","nodeCount":0,"edgeCount":0},"graph_decision":"CONTINUE","graph_decision_json":"\"CONTINUE\"","graph_signals_json":{},"graph_blockers_json":[],"graph_blockers_csv":"","graph_stop_blocked":false,"graph_trace_json":[],"graph_convergence_score":0,"graph_score_delta":null,"graph_score_delta_json":"null"}
```

The populated-graph golden decisions for `default` mode across research/review/context/council loop types are already pinned as executable regression fixtures in `tests/integration/convergence-script.vitest.ts` (`describe('convergence profile parity pins', ...)`, lines 440-668) — these are the authoritative default-mode baseline; Phase 1+ must not change any of their expected values.

**`divergent` is confirmed rejected today:**

```json
{"status":"error","error":"convergenceMode must be \"default\", \"off\", or \"sliding-window\"","code":"INPUT_VALIDATION"}
```

Source of truth: `runtime/scripts/convergence.cjs` — `VALID_CONVERGENCE_MODES = new Set(['default', 'off', 'sliding-window'])` and `parseConvergenceModeValue()` (~line 46 / ~line 177), matching spec.md's cited evidence at `convergence.cjs:39-47,177-187`.

## 3. Non-consumer file hashes (must remain byte-unchanged through Phase 5)

| File | SHA-256 |
|---|---|
| `.opencode/skills/system-deep-loop/mode-registry.json` | `39bc42a8881b45c5a16a432bb33f94f62565b2d935c31e5b9c373c5e144a019f` |
| `.opencode/skills/system-deep-loop/hub-router.json` | `9683e3a4cb7311d04fc816395e6189f116669c41b74ecace3519b8356d14e7da` |
| `.opencode/skills/system-deep-loop/SKILL.md` | `4d990838018f72d97d426e8aa7cbd26e3042ace7eb9844c793a0b15b2fb466e3` |
| `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md` | `5562bf7fb1d48ab59928a0543b6136526363b4acba5c6c18e1c03a516d077eef` |

Note: `mode-registry.json`'s hash above already predates the `check-contract-drift` failure recorded in §1 — the compiled-contract staleness is pre-existing at this exact baseline, not something Phase 1+ introduces.

## 4. Existing `divergent` usage check

`grep -rl "convergenceMode.*divergent\|convergence-mode.*divergent\|\"divergent\"" .opencode/skills/system-deep-loop .opencode/commands/deep` — **no matches.** No packet currently relies on an unsupported `divergent` field (checklist.md pre-implementation requirement satisfied).

## 5. Auto/confirm convergence-mode asymmetry (current state, to be resolved into one target parity contract in Phase 1)

| Workflow | `convergence[-_]mode` / `convergenceMode` references |
|---|---|
| `deep_research_auto.yaml` | 8 |
| `deep_research_confirm.yaml` | 0 |
| `deep_review_auto.yaml` | 0 |
| `deep_review_confirm.yaml` | 0 |

Confirms research.md's finding verbatim: only research-auto currently exposes convergence-mode handling; research-confirm and both review variants have none. Phase 1 (T010-T012) must define one target parity contract across all four before wiring divergent eligibility.

## 6. Baseline authority

This file, plus the pinned fixtures in `runtime/tests/integration/convergence-script.vitest.ts`, are the authoritative "before" state for checklist.md CHK-006, CHK-010, and CHK-023 (existing `default`/`off`/`sliding-window` decisions must remain unchanged). Any diff against this file in Phase 5 must be either zero, or an explicitly justified, reviewed change.
