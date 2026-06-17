---
title: "Research Report: Retrieval Evaluation & Post-027/002 Angles (028 child 008)"
description: "20-iteration Opus-4.8-via-claude2 research on the retrieval-evaluation + measurement angle space (A1-A8) the shipped 027/002 015-019 work opened up. PARTIAL — wave-1 dispatched."
trigger_phrases:
  - "028 retrieval evaluation research report"
  - "post-027-002 angles A1-A8 findings"
  - "memory eval harness research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/008-retrieval-evaluation"
    last_updated_at: "2026-06-17T14:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Banked wave-2 (A2/A3/A5): 3 harness-lanes + S5 silent-regression + 016-confirm"
    next_safe_action: "Dispatch wave-3 (A7/A8 + A1/A6 deepen) per recipe; continue toward 20"
    blockers: []
    key_files:
      - "research/research.md"
      - "../spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-17-028-008-retrieval-evaluation"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---

# Research Report: Retrieval Evaluation & Post-027/002 Angles

> **Status: PARTIAL — wave-1 dispatched.** 20-iteration deep research (Opus 4.8 via claude2 acct#2) on the angle space the shipped 027/002 015-019 search-intelligence work opened up. Born from the 028/007 ↔ 027/002 reconciliation (`../../research/synthesis/07`). Every candidate novelty-diffed vs the 016 research (027/002) + the 028/007 roadmap (`synthesis/06`). Research-only.

## The 8 angles (→ iteration plan)
- **A1 (keystone)** — memory-retrieval eval harness on the now-working cosine gate. → iters 1, (+11-12 deepen)
- **A2** — close 017/S4's flag-off isotonic calibration from real labels. → iters 4-5 (needs A1)
- **A3** — A/B the default-on levers 017 shipped unmeasured (reorder/escalation/verdict). → iters 6-7 (needs A1)
- **A4** — gate/rank divergence as a signal. → iter 2
- **A5** — post-015 cold-tier surfacing re-measurement. → iter 9 (needs A1)
- **A6** — unified semantic-embedding substrate (triggers+edges+summaries). → iter 3 (+13)
- **A7** — reindex-as-consolidation + maintenance-grace TTL. → iters 13-14
- **A8** — shadow-eval promotion methodology. → iter 15
- **Meta** — adversarial verify (16-18) + GO/no-go synthesis (19-20).

## Progress (banked)
| Iter | Angle | Candidates | Status |
|---|---|---|---|
| 1 | A1 eval harness (keystone) | 4 — harness already ~80% built; keystone = gate-accuracy lane (NET-NEW H/S) | ✅ banked |
| 2 | A4 gate/rank divergence | 4 + 015-residual-bug + similarity-gate boundary | ✅ banked |
| 3 | A6 unified semantic substrate | 5 — "shared rails, separate cars" + a 06/07 conflation fix | ✅ banked |
| 4 | A2 isotonic calibration | 5 — proxy-seed is a phantom; no ECE metric → promote unexecutable | ✅ banked |
| 5 | A3 A/B shipped levers | 4 — S5 harness blind-spot + S5 demotes correctly-fused non-vector hits | ✅ banked |
| 6 | A5 cold-tier re-measure | 4 — re-measure blocked by 2 preconditions; 016 "inert" holds operationally | ✅ banked |

**Wave-2 headline:** a recurring shape — **three "accuracy/coverage lanes the harness lacks"** (A1 gate-verdict, A2 calibration-ECE, A5 cold-tier), all EXTENDS into the live 110-query harness, all feeding A8's methodology. Plus two shipped-lever corrections: A2's isotonic "proxy seed" is a phantom + no ECE metric exists (promote-on-evidence unexecutable until built); A3's S5 reorder is both invisible to the harness (`evaluationMode` skip) AND has a confirmed silent-regression (demotes RRF-high/cosine-absent hits). A5 honestly refuted its own brief's premises + confirmed 016's FSRS call.

**Wave-1 headline:** the eval-harness keystone is **extend-not-greenfield** (a live harness already exists: 110-query graded golden set, 12 metrics, `eval_run_ablation` live runner, baseline+dashboard+5-table DB, traffic-feedback scaffolding) — the one NET-NEW is a gate-verdict-accuracy lane (H/S), and it produces the labeled set A2 (isotonic) is blocked on. A4 found the system already bets on divergence-direction (reorder) but discards its magnitude (free telemetry win) + a residual of the 015 fix (`resolveSearchScore` still reads RRF scale). A6 = unify bottom (3× cosine dup) + top (one shadow gate), keep middle per-channel.

## CONTINUATION RECIPE (turnkey — survives compaction)

**State:** 008 scaffolded (config maxIterations 20, strategy with 7 anchors, empty state.jsonl, iterations/ + deltas/). Wave-1 (iters 1-3 = A1/A4/A6) dispatched as claude2 Opus background seats; outputs at `/tmp/028-angles/iter{1,2,3}.out`. ~17 of 20 remain.

**Dispatch one claude2 Opus seat (read-only; the operator directive is claude2, NOT the in-process Agent tool, NOT native):**
```bash
USER=$USER LOGNAME=$LOGNAME CLAUDE_CONFIG_DIR=$HOME/.claude-account2 \
  CLAUDE_CODE_OAUTH_TOKEN="$(cat ~/.claude-account2/.oauth-token)" \
  /opt/homebrew/bin/gtimeout -k 30s 600s /Users/michelkerkmeester/.superset/bin/claude \
  -p --model opus --permission-mode bypassPermissions "$(cat /tmp/028-angles/iterN.prompt)" </dev/null \
  > /tmp/028-angles/iterN.out 2>&1
```
- NOT `--permission-mode plan` (truncates stdout). `</dev/null` is load-bearing (non-TTY). Run ≤3 seats/wave in background, staggered ~3s; reap stalled; the final assistant message is the findings block.
- Prompt template: each seat is READ-ONLY, grounds in `synthesis/{06,07}` + `027/before-vs-after.md §12-13` + live `mcp_server/` code, novelty-diffs vs 016 + 028/007, returns a `=== ITERN <ANGLE> FINDINGS ===` block of `CANDIDATE: id | what | evidence(file:line) | maps-to | novelty | lev/eff`.

**Orchestrator-writes per iteration (same 3-artifact contract as 007):**
1. `iterations/iteration-NNN.md` (the seat's findings, house style).
2. `deltas/iter-NNN.jsonl` (row 1 = `{"type":"iteration",...}`; then `candidate`/`finding`/`observation` rows).
3. append `{"type":"iteration","iteration":N,"newInfoRatio":x,"status":"insight","focus":"...","keyQuestions":["Qn"],"answeredQuestions":[...],"findingsCount":n,"durationMs":0,"timestamp":"...","sessionId":"2026-06-17-028-008-retrieval-evaluation","generation":1,"model":"opus-4-8-claude2","graphEvents":[{"op":"upsert_candidate","id":"..."},...]}` to `deep-research-state.jsonl`.
Then `node .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs <008-folder>` (needs the 7 strategy anchors — present).

**Remaining wave plan:** wave-2 = iters 4-5 (A2 isotonic) + 6-7 (A3 A/B) + 9 (A5 cold-tier) [need A1's harness banked first]; wave-3 = 13-14 (A7) + 15 (A8) + 11-12/13 (A1/A6 deepen); wave-4 = 16-18 adversarial-verify + 19-20 synthesis. Adjust per A1's harness design.

**Finish:** `reduce-state.cjs`; write `synthesis/08-retrieval-evaluation-findings.md` (before→after, matching 06) + update `00-index`; `validate.sh <028-parent> --strict --no-recursive` → 0/0; commit scoped + push.

## Honest status
- Wave-1 in flight; nothing banked yet. All lev/eff will be structural inference (no benchmark) — but A1's whole point is to make later candidates measurable (the reconciliation's key insight: 015 unblocked measurement).
- claude2 acct#2 may hit a usage cap on a 20-iter Opus run (per prior waves ~15 xhigh iters); on cap, fall back to native Opus same-model, noting the switch.
