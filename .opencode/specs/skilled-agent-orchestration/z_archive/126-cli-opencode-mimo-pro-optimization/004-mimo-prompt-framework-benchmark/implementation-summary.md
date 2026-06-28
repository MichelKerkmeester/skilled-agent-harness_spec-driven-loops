---
title: "Implementation Summary: MiMo-V2.5-Pro prompt-framework benchmark"
description: "Benchmarked 5 prompt frameworks on real MiMo-V2.5-Pro via a lean self-contained eval rig; COSTAR + lean-to-medium pre-planning won (RACE a statistical tie) and was integrated into the cli-opencode MiMo dispatch path. Key finding: MiMo is the opposite of MiniMax — guardrail-heavy TIDD-EC ranked last."
trigger_phrases:
  - "mimo benchmark summary"
  - "mimo costar winner"
  - "mimo framework integration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Integrated COSTAR winner (RACE statistical-tie fallback); MiMo != MiniMax divergence recorded"
    next_safe_action: "Packet complete — close 126"
    blockers: []
    key_files:
      - "eval/synthesis.md"
      - ".opencode/skills/cli-opencode/assets/prompt_templates.md"
      - ".opencode/skills/cli-opencode/assets/prompt_quality_card.md"
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-126-004-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 004-mimo-prompt-framework-benchmark |
| **Completed** | 2026-06-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

We now know — empirically, not by guess — the best prompt framework for MiMo-V2.5-Pro when another AI drives it through cli-opencode, and it is wired into the dispatch path. The headline is a clean divergence from MiniMax: the guardrail-heavy TIDD-EC that WON for MiniMax (120/003) ranked DEAD LAST for MiMo. MiMo prefers lean, output/audience-framed prompts: **COSTAR + lean-to-medium pre-planning** (composite 1.0000), with **RACE** a statistical tie (0.9934).

### Empirical benchmark (lean self-contained rig)

A leaner self-contained bake-off was built under `eval/` (a port of the 120/003 MiniMax rig): 5 framework variants (RCAF/RACE/CIDI/TIDD-EC/COSTAR) x 2 deterministic JS fixtures (chunk, parseRange). The harness `run-mimo-bench.cjs` dispatches each combo to the real model `xiaomi-token-plan-ams/mimo-v2.5-pro` via `opencode run ... --format json` (NO `--agent` — 1.15.13 rejects/falls back on `--agent general`), extracts the function, runs hidden test suites in isolated child processes, and scores assertion-pass + format-adherence + output-length. It ran for real: **10/10 dispatches succeeded** (cidi__chunk needed 1 retry — a transient tool-only file-write turn), avg latency ~18s.

The discriminator was format adherence + token efficiency, not correctness: assertion-pass saturated at 100% for all 5 frameworks (MiMo is frontier-class), so the ranking is driven by whether MiMo returns ONLY inline code. COSTAR and RACE were the only frameworks at 100% inline-format adherence; CIDI/RCAF/TIDD-EC each leaked an explanatory prose preamble on the harder `parseRange` fixture. TIDD-EC produced ~2.4x longer output. Final ranking: COSTAR > RACE > CIDI > RCAF > TIDD-EC.

### Integration into the dispatch path

The COSTAR winner is now the documented MiMo default: a COSTAR scaffold in cli-opencode's prompt templates (Template 15), a per-model override in the quality card (COSTAR default, RACE fallback, with the explicit MiMo != MiniMax divergence note), a sentinel pattern-index row, and a strengths note in the sk-prompt model registry.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `004/eval/**` | Created | Lean self-contained rig — `frameworks.cjs` (5 variants), `fixtures.cjs` (2 fixtures + hidden suites), `run-mimo-bench.cjs` + `extract.cjs` / `runner-child.cjs` / `runtests.cjs`, `runs/*.json`, `results.json`, `synthesis.md` |
| `cli-opencode/assets/prompt_templates.md` | Modified | Template 15 — MiMo-V2.5-Pro COSTAR scaffold + lean-to-medium pre-planning |
| `cli-opencode/assets/prompt_quality_card.md` | Modified | MiMo per-model override -> COSTAR default, RACE fallback, MiMo != MiniMax divergence |
| `sk-prompt-models/references/pattern-index.md` | Modified | MiMo prompt-framework row -> cli-opencode canonical location |
| `sk-prompt/assets/model-profiles.json` | Modified | `mimo-v2.5-pro` notes -> COSTAR/RACE-lean finding |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Built leaner than 120/003 on purpose: a self-contained harness scoped to MiMo and 2 fixtures, real dispatches gated behind a confirmed live probe (002 had already fixed the `--agent general` fallback). The scorer is fully deterministic (assertion-pass against hidden suites in isolated child processes + a regex format check + word count), so there is no grader-fallback ambiguity. The one wrinkle — `cidi__chunk` returned empty inline text on its first turn because MiMo took a tool-only `write`-to-file turn — was handled by a single retry and recorded honestly in the caveats rather than papered over.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Port the 120/003 rig leaner instead of reusing Lane B | Lane B's fixture model did not fit a prompt-framework bake-off cleanly; the proven 120/003 shape (framework variants + deterministic scorer + synthesis) ported to a smaller self-contained form was lower-risk and directly comparable |
| Hold everything constant but the framework | Isolates the framework effect; pre-planning density framed lean/medium/dense inside each variant |
| Omit `--agent` entirely | opencode 1.15.13 rejects/falls back on `--agent general`; 002 established the no-`--agent` dispatch as the clean path |
| Winner = COSTAR + lean-to-medium (not TIDD-EC + dense) | Empirical: COSTAR 1.0000 > RACE 0.9934 > ... > TIDD-EC 0.8000. MiMo is already scope/correctness-disciplined, so guardrails add no correctness and inflate output + trigger preamble |
| Treat COSTAR vs RACE as a tie, pick COSTAR | The 0.0066 margin is inside single-sample noise; COSTAR edges it on output length (50 vs 53 words avg) and its explicit `Style: "no preamble"` instruction. Both are lean, both 100% format-adherent |
| Record the MiMo != MiniMax divergence loudly | The guardrail-heavy TIDD-EC that WON for MiniMax came LAST for MiMo — the per-model override and the divergence note prevent a future reader from over-generalizing the MiniMax result |
| No cross-CLI propagation | MiMo is reachable only via cli-opencode, so the override belongs in cli-opencode + sk-prompt master, not the cli-devin/codex/gemini cards |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| Live MiMo dispatch probe | PASS — `xiaomi-token-plan-ams/mimo-v2.5-pro` responds via `opencode run --format json` (no `--agent`) |
| Full benchmark | PASS — 10/10 real dispatches succeeded (cidi__chunk +1 retry); avg ~18s latency |
| Assertion-pass | SATURATED — 100% for all 5 frameworks (frontier model on tractable fixtures); discriminator moved to format + length |
| Format adherence | COSTAR / RACE 100% inline; CIDI / RCAF / TIDD-EC 50% (prose preamble on `parseRange`) |
| Integration present | PASS — COSTAR in cli-opencode prompt template + quality-card override + sentinel row + model-profiles note |
| model-profiles.json | PASS — valid JSON, `mimo-v2.5-pro` entry shape unchanged |
| `validate.sh --strict` 004 | PASS — Exit 0 (see RESULT line in the closing report) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Single sample per (framework x fixture).** The COSTAR (1.0000) vs RACE (0.9934) margin is inside single-sample noise — treat them as a tie. Re-run the close top-2 via `node eval/run-mimo-bench.cjs --frameworks costar,race --repeat 3`.
2. **Two fixtures only** (chunk, parseRange), scoped smaller than 120/003's 7 fixtures by design. A harder/multi-file set would be needed to separate frameworks on raw correctness rather than format+length.
3. **Correctness saturated.** Assertion-pass was 100% for every framework, so frameworks separated on format discipline + token efficiency, not correctness. That IS the operative question for an AI-driving-AI dispatch loop, but it is not a correctness ranking.
4. **Deterministic scoring only.** No LLM-judge / grader-model step, so there is no qualitative-quality dimension beyond pass/format/length (and no grader-fallback ambiguity).
5. **CIDI reliability tax.** CIDI's process framing intermittently nudges MiMo into a tool-only `write`-to-file turn (~22% empty-inline across 9 observed cidi__chunk dispatches). Quantify via `node eval/run-mimo-bench.cjs --frameworks cidi --fixtures chunk --repeat 4`.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
