---
title: "Implementation Summary: GPT Reliability Research Campaign"
description: "Campaign complete: 15/15 productive GPT-5.5-fast xhigh research iterations (10 angles + 5 design passes), 44 orchestrator-verified findings, ranked P0/P1/P2 synthesis with 033-benchmark verification cells per proposal. Unified thesis: our systems are Claude-shaped — GPT executes contract letter where Claude follows intent; the P0 Gate-3 autonomous-precedence package plus four P1 packages (render contract, dispatch receipts, progress records, routing offer) are design-complete and ready to implement."
trigger_phrases:
  - "implementation"
  - "summary"
  - "gpt reliability research"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/001-research-and-diagnosis/002-gpt-reliability-research"
    last_updated_at: "2026-07-03T12:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Campaign complete: synthesis published, docs closed"
    next_safe_action: "Implementation packet: land the P0 Gate-3 package first per synthesis section 5"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-impl-final"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Implementation is a FUTURE packet: synthesis hands off 5 verification-process items (multi-cause cell adjudication, presentation snapshot tests, budget-edge harness, routing telemetry, feature-flagged rollout)."
    answered_questions:
      - "Why does GPT fail where Claude succeeds? Our contracts rely on Claude-convention: the classifier lists /deep:*+:auto as Gate-3 triggers, setup prompts render by convention, the LEAF prompt licenses absorption, loop protocols license dark windows, hard rules are position-buried behind 14-file chains. GPT executes the letter."
      - "Is more research needed? No — early stop at 15/15 productive: the independent ranking pass surfaced zero unexplored mechanisms."
---
# Implementation Summary: GPT Reliability Research Campaign

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-gpt-reliability-research |
| **Completed** | 2026-07-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

1. **15 research iterations** (`research/iterations/iter-001..015.md`): 10 first-pass angles (Gate-3 design, presentation contracts, dispatch/absorption, structured-mode stalls, agent parseability, skill routing, context volume, pacing/budgets, indirection depth, authoring profile) + 5 design/adjudication passes producing ready-to-apply packages (P0 Gate-3 text diffs, dispatch-receipt schema, render-contract edits, progress-record schema, independent ranking).
2. **`research/findings-registry.md`**: 44 deduped findings, every one orchestrator-verified against the actual files before entry (line counts, regexes, YAML steps, empirical advisor runs).
3. **`research/iteration-log.md`**: per-iteration verdicts, durations, steering decisions, and the early-stop rationale.
4. **`research/synthesis.md`**: ranked P0/P1/P2 proposals, each mapped to a measured 033 failure and the exact behavior-benchmark cells that verify it; dependency-ordered rollout plan; the 7-rule GPT-safe authoring profile.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator (Claude session) hosted the loop per the packet's own thesis — packet 033 proved GPT cannot reliably self-host deep-loop commands, so GPT ran only bounded, read-only, single-iteration research dispatches (`opencode run --variant xhigh`) with strict evidence-cited output contracts. Zero Gate-3 halts occurred across all 15 dispatches (the read-only framing left the gate nothing to trigger on), zero stalls, zero retries; iterations ran 5-17 minutes. Notable moments: iteration 006 ran the skill-advisor scorer EMPIRICALLY (vague prompts score [] at the 0.8 threshold) and exposed a path-token confound in the 033 vague-ask scenarios; iteration 011's before/after diffs were machine-verified verbatim against the live files (16/16 lines); iteration 014 taught an orchestration lesson mid-campaign (judge dispatch liveness by tool-activity stream, not stdout — the exact watchdog principle the research itself was proposing).

**Headline**: every measured 033 failure class traced to a contract that depends on Claude-convention — and each got a concrete, cheap-to-medium fix: an autonomous-precedence bridge for Gate 3 (P0, text diffs ready), verbatim-render markers for setup prompts (S), unforgeable HMAC dispatch receipts (M), step-transition progress records (M), and a sub-threshold routing offer (S).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Orchestrator hosts; GPT never self-hosts | 033-measured: GPT Gate-3-halts/stalls when self-hosting — the campaign architecture applied its own subject matter |
| Read-only briefs with explicit "no file writes requested" | Left Gate-3 nothing to trigger on: zero halts in 15 dispatches (empirical confirmation of the halt mechanism from the control side) |
| Every GPT claim verified against real files before registry entry | Findings are hypotheses; three verifications materially sharpened claims (symlink discovery, benchmark path-token confound, block-boundary checks) |
| Early stop at 15/15 productive | Independent ranking pass (iteration 015) surfaced zero unexplored mechanisms; its gaps are verification-process items folded into synthesis §5 |
| Design-iteration outputs graded on diff-verified grounding | iter-011 Before-blocks checked verbatim (16/16 lines) so the P0 package can be applied mechanically |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iterations productive | 15/15 (log has per-iteration verdict + steering) |
| Angle coverage | 10/10 (success criterion ≥8) |
| Registry findings verified | 44/44 orchestrator-checked against real files |
| Synthesis proposal→cell mapping | Every P0/P1 package names its 033 verification cells |
| Zero writes outside packet tree | Confirmed (GPT dispatches read-only; outputs under research/ only) |
| `bash validate.sh --strict` | Run at closeout — 0 errors (accepted corpus advisories only) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Designs are unimplemented** — this packet delivers verified mechanisms + ready-to-apply designs; the implementation packet must still land them and re-run the 033 cells.
2. **Single-model researcher** — all iterations used gpt-5.5-fast xhigh; a different executor might weight mechanisms differently (mitigated by orchestrator verification of every claim).
3. **`--variant xhigh` forwarding remains accepted-unverified** (same status as med/high in 033).
4. **R5 scoring is one model's adjudication** — the dependency orderings were sanity-checked by the orchestrator, but the numeric scores are advisory.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:followup -->
## Recommended Follow-Up

Implementation packet in synthesis §5 order: (1) P0 Gate-3 package (bridge diff + classifier API + profile; verify RVB-008/RSB-008/ACB-004/IMB-004/IMB-005 flip); (2) the three S-effort quick wins in parallel (render markers, routing offer, absorption guard); (3) dispatch receipts; (4) progress records; (5) P2 structural items. Re-run affected 033 benchmark cells after each package with primary/secondary cause adjudication for the multi-cause cells.
<!-- /ANCHOR:followup -->
