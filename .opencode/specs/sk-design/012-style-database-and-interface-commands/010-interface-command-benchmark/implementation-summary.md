---
title: "Implementation Summary: /interface:* Structure + Live Multi-Model Benchmark"
description: "Executed the hybrid /interface:* benchmark: structure axis PASS (contract 8/8, 5/5 conformance) plus three live /interface:design legs on one shared brief. Presentation contract proved portable across all three executors; design taste ranked deepseek > mimo > luna. No proof-tier overclaims."
trigger_phrases:
  - "interface benchmark results summary"
  - "deepseek mimo luna interface verdict"
  - "interface command benchmark executed"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/010-interface-command-benchmark"
    last_updated_at: "2026-07-22T12:20:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Ran v2 parity rerun; corrected verdict"
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

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary: /interface:* Structure + Live Multi-Model Benchmark

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-interface-command-benchmark |
| **Level** | 1 |
| **Status** | COMPLETE — structure axis + three live legs scored |
| **Verification** | contract test 8/8; three leg artifacts under `review/legs/`; scorecard `review/review-report.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A hybrid benchmark of the `/interface:*` commands. **Structure axis:** `interface-command-contract.test.mjs`
8/8 and a per-command conformance scorecard (5/5 router-detected, one `@`-include, no command-taste, modes
wired). **Live-quality axis:** `/interface:design` on one shared brief (Product-register analytics-dashboard
empty state) across three executors — cli-opencode `deepseek-v4-pro`, cli-opencode `mimo-v2.5-pro`, and
cli-codex `gpt-5.6-luna` high — each artifact scored on a six-point rubric. Full per-dimension table +
verdict in `review/review-report.md`; leg evidence under `review/legs/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three sequential single-dispatch runs after a provider/auth pre-flight. The two cli-opencode legs invoked
the real command (`opencode run --command interface/design :auto`) with `--model` pinned and the child
spec-gate env; the codex/LUNA leg received the presentation asset + shared contract + a design manifest as
an inlined raw prompt (codex has no OpenCode command runtime). Each leg ran under a 10-minute timeout with
`</dev/null`; artifacts were extracted from the JSON event streams and scored against the rubric.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Structure axis | PASS — contract 8/8; 5/5 conformance |
| Three legs captured | PASS — deepseek 27 KB, mimo 20 KB, luna 9.7 KB under `review/legs/` |
| Presentation fidelity | All three emitted all 8 visible blocks (LUNA too, from a raw prompt) |
| Proof-tier honesty | No overclaims — deepseek `validated (advisory)`, mimo `validated`, LUNA `observed` |
| Design-taste ranking | deepseek (~110) > mimo (~38) > LUNA (~6) specificity |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- One brief, one command (`/interface:design`) — a strong proxy for presentation-contract fidelity, but
  `foundations`/`motion`/`audit` live runs are a noted extension, not executed.
- Taste "specificity density" is a keyword-count proxy (palette/type/motion/token mentions) — a directional
  signal, not an absolute design-quality metric.
- **V2 correction (prompt-parity rerun).** An independent Opus review found the v1 executor verdict
  confounded: the codex/LUNA leg alone was handicapped (`owned-tokens`, cap-at-`observed`, don't-fabricate)
  and the legs solved different problems. A v2 rerun on one fully-specified, equalized brief showed the v1
  "~18× taste gap" compressing to ~3× (deepseek 70 > mimo 46 > LUNA 23) once LUNA was un-handicapped — so
  the gap was mostly prompt design, not transport; the native path is a modest, not large, design win. It
  also exposed a real v1 overclaim (mimo labeled contrast `measured`) and refuted "mimo cheaper" (cost
  ~equal). Corrected verdict in `review/review-report.md` §V2; v2 evidence in `review/legs-v2/`.
- Still open (P1): repeats/variance (n=1 per leg) and a blind rubric-scored taste judgment to replace the
  verbosity-biased keyword proxy.
<!-- /ANCHOR:limitations -->
