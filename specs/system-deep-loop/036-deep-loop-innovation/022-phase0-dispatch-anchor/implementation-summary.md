---
title: "Implementation Summary: Objective Dispatch-Context Anchor for the deep/* Phase-0 Gate"
description: "Final state and verification for making the injection prefix authoritatively resolve the deep/* Phase-0 dispatch-context gate, ending the DIRECT INVOCATION false-block on capable orchestrators."
trigger_phrases:
  - "phase 0 dispatch anchor summary"
  - "DISPATCH-CONTEXT authorization prefix"
  - "deep review direct invocation false block fix"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/022-phase0-dispatch-anchor"
    last_updated_at: "2026-08-27T05:20:00.000Z"
    last_updated_by: "claude"
    recent_action: "Prefix now resolves the dispatch-context gate; verified render + both gates + no drift"
    next_safe_action: "Commit; push; run the Grok review with a Luna orchestrator"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The gate false-blocks on model self-classification; the injection prefix is an objective discriminator present only for real invocations."
      - "Authorizing in the prefix fixes all 4 injection commands with no per-doc edit and no contract recompile."
---
# Implementation Summary: Objective Dispatch-Context Anchor for the deep/* Phase-0 Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-phase0-dispatch-anchor |
| **Completed** | 2026-08-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Actual Effort** | ~1.5 hours (mostly render-path mapping) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Ended the false-block where capable orchestrators (GPT-5.6-Luna) hard-stopped a genuine `/deep:review` at the Phase-0 dispatch-context gate with "DIRECT INVOCATION REQUIRED". The gate asks the model to self-classify "real invocation vs pasted-inline"; Luna saw the command content in its prompt and mis-concluded "pasted inline". The real command runner already prepends an objective marker (`ARGS_PRESENT=true` / `<!-- INVOCATION MESSAGE -->`) that a pasted-inline paste never carries — the gate just did not use it. The fix adds two reinforcing layers, both keyed on that marker: (1) a DISPATCH-CONTEXT authorization in the injection prefix, and (2) an OBJECTIVE OVERRIDE at the top of the gate in each of the 4 injected legacy bodies that resolves on a literal marker lookup and tells the model to skip the fragile self-classification. Both explicitly state that seeing this file's own content is NOT evidence of pasting. Neither weakens the pasted-inline guard (a paste has no marker) and neither needs a contract recompile (the prefix is generated at render; the legacy bodies are not contract sources).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/scripts/render-command-contract.cjs` | Modified | `buildInvocationPrefix` adds the DISPATCH-CONTEXT authorization to the ARGS_PRESENT=true branch |
| `commands/deep/assets/legacy/deep-review.body.md` | Modified | OBJECTIVE OVERRIDE ahead of the Phase-0 CHECK |
| `commands/deep/assets/legacy/deep-research.body.md` | Modified | OBJECTIVE OVERRIDE ahead of the Phase-0 CHECK |
| `commands/deep/assets/legacy/deep-ai-council.body.md` | Modified | OBJECTIVE OVERRIDE ahead of the Phase-0 CHECK |
| `commands/deep/assets/legacy/deep-alignment.body.md` | Modified | OBJECTIVE OVERRIDE ahead of the Phase-0 CHECK |
| `runtime/tests/unit/render-command-contract.vitest.ts` | Modified | Regression: authorization present ahead of body (real) / absent (no-message) |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The injected prompt was rendered directly to see the ground truth: the `ARGS_PRESENT=true` prefix comes first, then the body, then the Phase-0 gate — so Luna received the objective marker but still ran the self-classification below it. That located the fix in the prefix generator rather than in each command doc: the authorization is emitted only on the real-invocation branch (`if (present)`), so a paste — which never carries a message — still hits the guard. This is a cleaner realization of the chosen "anchor on the ARGS_PRESENT prefix" than editing four doc gates: one source, all injection commands, and no contract recompile because the prefix is generated at render and not stored. Verified: `render deep/review` shows the authorization ahead of the gate, the no-args render omits it, `check-contract-drift` stays green, and both whole-suite gates are clean.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Authorize in the prefix, not in each doc gate | The prefix is one source that reaches all 4 injection commands, is present only for real invocations, and needs no contract recompile. Editing four doc gates would be higher-blast and could drift per-doc. |
| Keep the gate text unchanged | The gate already defaults to PROCEED and blocks only on concrete pasted-inline evidence; the prefix now refutes that evidence for real invocations, so the gate resolves correctly without editing it. |
| Emit only on the real-invocation branch | A pasted-inline paste has no invocation message, so it never receives the authorization — the guard against genuine pasted-inline use is preserved. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `render deep/review` | PASS — DISPATCH-CONTEXT at prefix line 7, before PHASE 0 at line 22 |
| No-args render | PASS — authorization absent (count 0) |
| `render-command-contract.vitest.ts` | PASS — 19/19 incl. the new regression |
| `check-contract-drift.vitest.ts` | PASS — no drift, no recompile |
| Comment hygiene | PASS — `check-comment-hygiene.sh` exit 0 |
| `run-node-tests.mjs` | 84 files, 767 pass, 17 fail — all pre-existing, 0 new |
| Runtime vitest whole suite | Delta clean — no new code-caused failures |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Model compliance is not guaranteed by a doc change alone.** Two objective layers now tell the model, as a literal marker lookup, that it was invoked as the command — but a live run is the only way to confirm a stubborn orchestrator honors them. A prior smoke (before this fix landed) showed GPT-5.6-Luna still false-blocking; if it still blocks after being explicitly told the marker is present and to skip the self-check, that is a model-compliance ceiling no doc change closes, and the reliable path is an orchestrator proven to pass Phase 0 (e.g. the cline-Pro tier).
2. **The source docs / `fix` contracts were not synced.** The live rollout is `fallback`, so only the legacy bodies are injected; syncing `review.md` etc. + recompiling is a follow-up relevant only to a future `fix`-mode flip.
3. **Only the 4 injection commands are covered.** `model-benchmark`, `skill-benchmark`, and `agent-improvement` have no compiled contract / injection path, so they receive neither layer.

<!-- /ANCHOR:limitations -->
