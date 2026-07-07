---
title: "Implementation Plan: Deep Skills Unique-Value Differentiation Analysis"
description: "Plan for 10-iter deep-research audit of deep-review vs deep-research vs deep-ai-council boundaries; outputs a differentiation verdict + routing rule + parity invariants."
trigger_phrases:
  - "deep skills plan"
  - "differentiation analysis plan"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/006-deep-stack-cross-cutting/001-unique-value-differentiation"
    last_updated_at: "2026-05-23T06:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Author plan.md for 10-iter deep-research"
    next_safe_action: "Dispatch deep-research iter-001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Deep Skills Unique-Value Differentiation Analysis

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

## 1. APPROACH

10-iter deep-research dispatch via `/deep:start-research-loop`, executor `cli-devin` (model `swe-1.6`, permission-mode `dangerous`). One iteration at a time per memory `feedback_deep_loop_iter_one_at_a_time.md` — main agent kills zombies between iters.

Each iter explores a dimension from §3 below, accumulates findings into `research/findings-registry.json`, and emits delta to `research/iterations/iter-NNN.md`. Saturation check after iter-005; convergence threshold 0.2 novelty rate. On convergence OR iter-010 reached, synthesize `research/research.md` and emit `decision-record.md` with routing rule + parity invariants.

## 2. EXECUTION SEQUENCE

| Step | Action | Output |
|------|--------|--------|
| 1 | `/deep:start-research-loop:auto` initialize on this folder | `research/` packet structure populated |
| 2 | iter-001 — characterize deep-review contract (input/output/state/convergence) | `research/iterations/iter-001.md` |
| 3 | iter-002 — characterize deep-research contract | `research/iterations/iter-002.md` |
| 4 | iter-003 — characterize deep-ai-council (assumed-upgraded) contract per packet 129/001 | `research/iterations/iter-003.md` |
| 5 | iter-004 — overlap surface inventory (trigger phrases, output artifacts, state files) | `research/iterations/iter-004.md` |
| 6 | iter-005 — fixture-prompt suite + expected routing | `research/iterations/iter-005.md` |
| 7 | iter-006 — saturation check; if convergence → skip to synthesis | conditional |
| 8 | iter-006/007 — boundary-sharpening strategies (keep-distinct, merge, unify-mode, hybrid) | `research/iterations/iter-00N.md` |
| 9 | iter-008 — skill-advisor routing rule candidates + lexical/structural triggers | `research/iterations/iter-008.md` |
| 10 | iter-009 — parity-test contracts to keep boundaries from drifting | `research/iterations/iter-009.md` |
| 11 | iter-010 — recommendation synthesis pass | `research/iterations/iter-010.md` |
| 12 | synthesize `research.md` | `research/research.md` |
| 13 | emit ADRs to `decision-record.md` | `decision-record.md` |
| 14 | fill `implementation-summary.md` Status=Completed | `implementation-summary.md` |
| 15 | strict validate this packet | exit 0 |

## 3. DIMENSIONS OF ANALYSIS

1. **Contract surface** — input shape, output artifacts, state files, convergence semantics, command-mode suffixes.
2. **Use-case overlap** — trigger phrases, common operator framings, "what is the right answer when intent is mixed?".
3. **Cost & latency profile** — iters × seats × executor cost; user-visible wall time; failure-tail behaviors.
4. **Findings/output schema** — finding fingerprints, severity tiers, registry shape.
5. **Routing rule** — lexical, structural, prior-art (operator-history) signals to drive advisor.
6. **Drift risk** — what tests / parity invariants must ship to keep the three from re-converging in practice.

## 4. SAFETY & MEMORY GUARDS

- After each iter: `ps aux | grep -E "ccc search|devin|codex|gtimeout|deep-research|rerank"` + SIGKILL stale daemons; `rm -f /tmp/devin-* /tmp/deep-research-*` per memory `feedback_proactive_orphan_cleanup.md`.
- If SWE-1.6 returns empty output (token-budget exhausted past ~14 iters), fallback per memory: cli-opencode deepseek-v4-pro variant=high `--dangerously-skip-permissions --format json --pure --dir "$PWD" "PROMPT" </dev/null`.
- Cache-warm window: deep-research dispatches inside a single iter group ≤ 270s.
