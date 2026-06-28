---
title: "Implementation Summary: sk-design routing/integration research"
description: "A 50-iteration non-converging GPT-5.5-xhigh deep-research study over six dimensions of the sk-design family — residual craft, /design:* command specificity, parent->sub-skill routing+utilization, mcp-open-design pairing, cross-CLI survival, and a designer-skills-main corpus expansion. Outcome: a per-dimension buildable backlog (~70 items), a shared four-layer enforcement spine (selection/loading/firing/survival), an honest enforceable-vs-advisory ledger, and a verification plan. Research only — no live edits, nothing committed."
trigger_phrases:
  - "sk-design routing research summary"
  - "design integration study outcome"
  - "non-converging research summary"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research"
    last_updated_at: "2026-06-28T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Summarized the 50-iteration routing/integration research outcome"
    next_safe_action: "Scope a build phase for the enforcement spine"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-037-design-routing-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Selection/loading/firing/survival are deterministically enforceable on fixtures; application and taste stay advisory"
      - "The command-as-workflow-verb pattern is the one net-new corpus port (D6-R1)"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Date** | 2026-06-28 |
| **Level** | 3 |
| **Type** | Research (no live sk-design / commands / mcp-open-design / cli-* edits) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A non-converging deep-research study of the `sk-design` family's routing, utilization, and cross-surface enforcement, producing `research/research.md` (coverage ledger + per-dimension buildable backlog + shared four-layer enforcement spine + enforceable-vs-advisory ledger + verification plan + convergence report) plus the full externalized loop state (50 iteration files, 50 deltas, angle-bank.json, strategy, dashboard, state.jsonl).

### Headline
This is the first sk-design arc past corpus-adoption craft into enforcement architecture. The single most important result is the honest reframing of the "1000%" guarantee: **selection, loading, firing, and survival can be made deterministically blocking** on a fixture corpus and at the tool boundary, while **application quality and taste stay advisory**. The build target is to make non-utilization loud and blocking, replace self-attestation with content-bound proof, and measure the residual miss-rate — never to "guarantee the model has taste."

### Backlog (frozen, ~70 items across D1-D6)
- **D1** residual craft: numeric-law index, transform-verb aliases + authoring lane, per-model AI-tell registry + fixtures.
- **D2** command specificity: a sibling `command-metadata.json` SSOT + `design-command-surface-check`; strip tool over-grants; per-mode arg grammar.
- **D3** routing/utilization: the four-layer spine on existing Lane C machinery (parseable `hub-router.json`, gated `hubRoute` scorer, gold corpus, content-bound proof, telemetry).
- **D4** open-design pairing: an all-surface deny-by-default gate + a content-bound `DESIGN_PROOF_TOKEN v1`, replacing the never-run `design_gate()` pseudocode.
- **D5** cross-CLI survival: a `Design Standards Loading` ALWAYS twin + `DESIGN_DISPATCH_MANIFEST v1` + payload-inline + parent-side re-validation.
- **D6** corpus expansion: the command-as-workflow-verb projection (D6-R1) plus its scorer cap — the one net-new pattern with no impeccable analogue.

### Key results to cite (verified on-disk)
`router-replay.cjs` returns `parseable:false` on the parent hub (`true` on `design-interface`); `intentRecall=0` / `telemetryMissingRate=1.000` across 55 prompt scenarios; the registry is clean (5 modes, 56 aliases, 0 alias collisions, 5/5 packet+name parity) but 46.5% of raw hub keywords are uncovered/untyped; `mcp-open-design design_gate()` is never-executed markdown pseudocode with a `feeds_design_decision=False` default; the three `cli-*` skills carry a code-standards ALWAYS rule but no design twin.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A no-converge deep-loop-runtime driver (externalized JSONL state + reduce-state.cjs) ran cli-codex gpt-5.5 xhigh fast for 50 iterations, advancing a 57-angle bank one fresh angle per iteration. A parallel monitor watched `deep-research-state.jsonl`, injected deeper/cross-cutting angles when info flow dipped, and switched the corpus to `designer-skills-main` for the back third. Several iterations *executed* the existing skill-benchmark scripts (`router-replay.cjs`, `d5-connectivity.cjs`, `advisor-probe.cjs`) to turn assertions into measured facts. Six parallel fresh-Opus synthesis agents — one per dimension — consolidated the 50 iteration files into research.md.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
- **ADR-001** - Non-converging by design; convergence logged as a signal, the only stop is iteration 50.
- **ADR-002** - Anti-convergence via a 57-angle bank + parallel monitor + corpus expansion.
- **ADR-003** - Honest "1000%" reframing: selection/loading/firing/survival enforceable on fixtures + tool boundary; application + taste advisory.
- **ADR-004** - Research only: emit a buildable backlog, make no live edits, defer the build.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
- **Coverage**: 50 iterations across D1×4, D2×13, D3×14, D4×10, D5×4, D6×5 (research.md §2-§3).
- **Verify-against-real**: every load-bearing claim cites a real `file:line`; a finding was a hypothesis until the cited line was opened (research.md §13).
- **Measured facts**: benchmark scripts executed live (router parseable:false, intentRecall=0, telemetryMissingRate=1.000, 0 alias collisions, 46.5% untyped hub keywords).
- **Reducer**: 50 iterations recorded, corruptionCount 0.
- **Non-convergence**: newInfoRatio mean 0.655 (min 0.57, max 0.74) — never near the 0.05 floor.
- **Doc validation**: validate.sh --strict clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
- **Coverage gap (D5)**: iterations 046-050 never exercised the `sk-prompt-small-model` per-model profiles or the `AGENTS.md` carry-path named in the D5 charter; whether small-model children honor the inlined manifest remains untested (research.md §8).
- **D6 angle re-use**: the monitor's corpus-expansion angle `MON-B3` ran three times (the override persisted across the driver's fast advance); those passes deepened rather than repeated, but ~2 of 5 D6 passes were lower-yield than their newInfoRatio claimed (research.md §3, §12).
- **Residual bypasses**: three D4 bypasses cannot be fully closed — the Open Design daemon ships unmodifiable in the app bundle, a text-only cli-claude-code child cannot prove it did not replay a stale token, and shell aliases the Bash parser cannot resolve escape the gate (research.md §7).
- **Working-tree only**: the packet is uncommitted; this is research, so no live sk-design change yet.
- **No runtime test**: verification is verify-against-real + executed benchmark probes + strict doc validation, not an executable test of the proposed gates (they are not built).
- **Resilience note**: one transient codex hang at iteration 9 recovered via a driver restart from externalized state (research.md §12).
<!-- /ANCHOR:limitations -->
