---
title: Deep Research Strategy - Retrieval Evaluation & Post-027/002 Angles
description: Session tracking for researching the retrieval-evaluation + post-027/002 angle space (A1-A8) the shipped 015-019 work opened up.
trigger_phrases:
  - "deep research strategy"
  - "retrieval evaluation research session"
  - "post-027-002 angles research"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Persistent brain for the retrieval-evaluation + post-027/002 angle research. Records key questions, focus decisions, and outcomes across 20 iterations run as Opus 4.8 seats via claude2 (acct#2). Born from the 028/007 ↔ 027/002 reconciliation (`synthesis/07`): 027/002 shipping 015-019 changed the ground — it fixed the broken request-quality gate (measurement now possible) and surfaced flag-off/deferred levers worth researching.

---

## 2. TOPIC
Research the angle space the shipped **027/002 phases 015-019** opened up, against the live Memory MCP (`.opencode/skills/system-spec-kit/mcp_server/`). Every candidate is NOVELTY-DIFFED vs the 016 research (027/002's own 10-iter Opus pass) + the 028/007 roadmap (`synthesis/06`) — do not re-surface what either already covered. Read-only; orchestrator writes state.

### Dispatch
- **Opus 4.8 via claude2** (`CLAUDE_CONFIG_DIR=~/.claude-account2` + OAuth token; real binary `/Users/michelkerkmeester/.superset/bin/claude -p --model opus --permission-mode bypassPermissions </dev/null`; NOT plan mode — it truncates stdout; NOT the in-process Agent tool — operator directive 2026-06-17). Run in waves of ~3 background seats; reap stalled; synthesize + independently verify the crux.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1 (A1, keystone): Eval harness — what golden-query set + relevance-label schema + label-bootstrap (from live traffic / existing specs) makes Memory MCP retrieval measurable on the now-working cosine gate? Cite the gate seam (`resolveAbsoluteRelevance`, `confidence-scoring.ts`).
- [ ] Q2 (A2): Isotonic calibration — how to collect real labels, fit, validate, and promote 017/S4's flag-off isotonic infra (replacing the proxy seed)? What live-evidence threshold justifies default-on?
- [ ] Q3 (A3): A/B methodology + expected result for the default-on levers 017 shipped unmeasured — cosine top-N reorder (S5), generic-query escalation (S3), top-dominant verdict (S2). Does reorder ever demote a correctly-fused hit?
- [ ] Q4 (A4): Gate/rank divergence — now the gate reads cosine while RRF ranks; characterize when they disagree and what the divergence signals (fusion miscalibration vs ambiguous query). Where to surface it?
- [ ] Q5 (A5): Re-measure cold-tier surfacing rate + precision POST-015 admission (016 found "~2 rows, inert" pre-admission). Does admission change the distribution?
- [ ] Q6 (A6): Unified semantic-embedding substrate — can 027's semantic-trigger fallback + the 028/007 semantic-edge-layer + the fused-summary-channel collapse into ONE embeddable-channel framework instead of three bolt-ons? Architecture + shadow-promotion economics.
- [ ] Q7 (A7): Reindex-as-consolidation — can async sleep-time reorganization (028/007 Initiative B) be hosted inside 018's now-responsive/cancellable scan? + maintenance-grace TTL tuning (019 open gap: avoid premature reap AND zombie pileup).
- [ ] Q8 (A8): Shadow-eval methodology — which shadow metrics (false-positive rate, recall delta, latency, cost) predict promotion-worthiness? Define one reusable promotion gate for all intelligence-class candidates.
- [ ] Q9 (NOVELTY GATE): vs 016 (027/002 research) + 028/007 roadmap + the live 015-019 code — refute re-discoveries; confirm each angle is genuinely un-covered.
- [ ] Q10 (GO/no-go): rank every surfaced candidate GO (additive/reversible) vs NEEDS-BENCHMARK vs NO-TRANSFER by leverage x effort; assign 027 doctrine-class (correctness-always-on vs intelligence-shadow-gated).

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any candidate (deferred to a later packet — research-only, 028 §3).
- Modifying the live Memory MCP code or the 027/002 shipped work.
- Re-mining the external memory systems (that was 007; this is the internal eval/measurement frontier).

---

## 5. STOP CONDITIONS
- All key questions have evidence-backed, code-mapped, novelty-tagged answers.
- 20 iterations reached (ceiling).
- Genuine saturation: newInfoRatio below 0.02 across the rolling window AND no unexplored frontier after a broadening attempt. Mark saturation; do not pad.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q1 (A1, keystone): Eval harness — what golden-query set + relevance-label schema + label-bootstrap (from live traffic / existing specs) makes Memory MCP retrieval measurable on the now-working cosine gate? Cite the gate seam (`resolveAbsoluteRelevance`, `confidence-scoring.ts`).

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
Source of the angles: `028/research/synthesis/07-reconciliation-with-027-002.md` (the reconciliation verdict) + `06-memory-systems-findings.md` (the 028/007 roadmap). What 027/002 shipped: `027/before-vs-after.md` §12-13. The reconciliation established: 015 fixed the broken gate (measurement now possible); reindex is gate-zero; adopt correctness-always-on / intelligence-shadow-gated doctrine; 016 independently converged with 028/007 on cold-tier/reranker/fusion-channel conclusions. Do NOT re-surface 016 or 028/007 findings as net-new — novelty-diff against both.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 20 (Opus 4.8 via claude2)
- Convergence threshold: 0.02
- Per-iteration budget: 12 tool calls, 12 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-06-17T14:00:00Z
