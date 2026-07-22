---
title: "Plan: /interface:* Structure + Live Multi-Model Benchmark"
description: "Plan for the hybrid /interface:* benchmark: a deterministic structure axis (contract test + conformance scorecard) plus a live output-quality axis running /interface:design on one shared brief across three executors (cli-opencode deepseek-v4-pro, cli-opencode mimo-v2.5-pro, cli-codex gpt-5.6-luna), scored on a six-point rubric."
trigger_phrases:
  - "interface benchmark plan structure live"
  - "three executor interface design benchmark plan"
  - "deepseek mimo luna benchmark plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/010-interface-command-benchmark"
    last_updated_at: "2026-07-22T12:20:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Executed the benchmark per this plan"
    next_safe_action: "Operator reviews the verdict"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/012-style-database-and-interface-commands/010-interface-command-benchmark/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-010-interface-benchmark-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: /interface:* Structure + Live Multi-Model Benchmark

<!-- ANCHOR:approach -->
## Approach

Two axes. The **structure axis** is deterministic: run `interface-command-contract.test.mjs` and a
per-command router-conformance scorecard — no models involved. The **live-quality axis** runs the flagship
`/interface:design` command on ONE shared brief (a Product-register analytics-dashboard empty state) across
three executors and scores each artifact on a six-point rubric (presentation fidelity, grounding
discipline, proof-tier honesty, real content/states, design taste, artifact-first).

- **Legs:** cli-opencode `deepseek/deepseek-v4-pro --variant high` (native `--command`); cli-opencode
  `xiaomi/mimo-v2.5-pro` (native `--command`); cli-codex `gpt-5.6-luna` high (raw prompt — presentation +
  shared contract inlined, since codex has no OpenCode command runtime).
- **Discipline:** single-dispatch (one cli-* dispatch at a time), each with a 10-minute timeout guard and
  the child spec-gate env (`MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1`, `</dev/null`).
- **Honesty:** `deep:command-benchmark` is NOT used — its frozen engines cannot select these models; a
  bespoke harness is built instead.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:steps -->
## Steps

1. Provider/auth pre-flight (DeepSeek + Xiaomi opencode providers; codex ChatGPT OAuth) and self-invocation guards.
2. Scaffold the `010` packet + evidence dir; write the shared brief and the codex raw prompt (presentation + contract + design manifest).
3. Capture the structure axis: contract test 8/8 + the five-command conformance scorecard.
4. Dispatch the three legs sequentially; capture each artifact under `review/legs/`.
5. Extract each artifact, score the rubric, write `review/review-report.md`, finalize packet docs + metadata, validate.
<!-- /ANCHOR:steps -->

---

<!-- ANCHOR:risks -->
## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| A dispatch hangs (opencode stdin / loop group-kill history) | `</dev/null` + a 10-minute `gtimeout` guard per leg; direct `--command` dispatch, not the fanout loop |
| A provider is unauthenticated | Mandatory pre-flight; ASK rather than substitute a model the operator did not name |
| Single brief / single command over-generalizes | Scope-limit the verdict to presentation-contract fidelity + design richness on one representative brief; note the extension |
| Cross-runtime asymmetry unfairly scores the codex leg | Report it explicitly as a transport limitation, not a model verdict |
<!-- /ANCHOR:risks -->
