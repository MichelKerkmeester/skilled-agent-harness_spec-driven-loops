---
title: "Implementation Summary: skill-benchmark codex transport"
description: "A runtime-hosted codex dispatch helper and a thin skill-benchmark codex executor now let a GPT-5.6 model be benchmarked live over the codex transport, without a packet-local codex adapter."
trigger_phrases:
  - "codex transport implementation summary"
  - "068 closeout"
  - "skill-benchmark codex executor summary"
  - "tier-2 luna routing benchmark analysis"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-skill-benchmark-codex-executor"
    last_updated_at: "2026-07-16T02:57:29Z"
    last_updated_by: "claude"
    recent_action: "Tier-2 luna breadth + SOL-ULTRA deep-review landed; 12 recs reconciled"
    next_safe_action: "Commit the Tier-2 extension (068 paths only)"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/codex-executor.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/036-skill-benchmark-codex-executor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the codex transport produce comparable measurements? Yes: luna-codex 85 vs luna-opencode 86, 7/9 scenarios identical."
      - "Did the SKILL.md changes move deterministic routing? No: Mode-A now vs baseline is delta 0 on all 9 scenarios."
      - "How far to scale the live benchmark breadth (Tier-2)? The operator ran 3 skills (mcp-tooling, sk-doc, sk-code) with gpt-5.6-luna xhigh/fast via cli-opencode; a fresh SOL-xhigh agent analyzed and a SOL-ULTRA 5-iteration deep-review reconciled 12 adjusted recommendations."
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
| **Spec Folder** | 036-skill-benchmark-codex-executor |
| **Completed** | 2026-07-15 |
| **Level** | 2 |
| **Status** | Complete (adapter + Tier-1 comparison; Tier-2 luna breadth + SOL-ULTRA deep-review landed as an extension) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now benchmark a GPT-5.6 model live over the codex transport, side by side with the existing opencode transport, by passing `--executor codex` to the Lane C skill-benchmark. The codex dispatch itself stays inside the deep-loop runtime, so the repository keeps exactly one place that spawns `codex exec` and the cli-codex single-adapter rule holds.

### Runtime codex dispatch helper

`runtime/scripts/codex-dispatch.cjs` is the runtime's single-shot codex adapter. It complements `fanout-run.cjs` (which owns multi-lineage loops) by handling one synchronous request and reply, which is what a measurement harness needs. It spawns `codex exec` with the model, reasoning effort, service tier, and a read-only sandbox, delivers the prompt on stdin, captures the last message with `-o`, enforces a timeout, and reaps only its own child tree by captured PID on a timeout. Model, effort, tier, sandbox, and timeout all come from env vars so nothing machine-specific is baked in.

### Thin codex executor

`skill-benchmark/codex-executor.cjs` reuses the opencode path's prompt builder and reply parsers, so both transports ask the identical routing question and parse it identically. It only swaps the dispatch channel: build the prompt, call the runtime helper, normalize the reply into the observed-result the scorer already consumes. On an xhigh timeout it retries once at a lower fallback effort and flags the fallback. Because codex emits no `tool_use` event stream, activation and observed file-reads are recorded as unmeasured (`activation: null`, the same convention the deterministic router mode uses) rather than as misses, so codex scores are not depressed on a channel it cannot report.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/scripts/codex-dispatch.cjs` | Created | Single-shot codex execution helper (the runtime's one-shot codex adapter). |
| `skill-benchmark/codex-executor.cjs` | Created | Thin executor: prompt to runtime helper to parsed observed-result. |
| `skill-benchmark/executor-dispatch.cjs` | Modified | Branch the live path on `executor === 'codex'`. |
| `skill-benchmark/live-executor.cjs` | Modified | Export `hasRouteGold` so both transports single-source the route-gold predicate. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build reused the existing executor seam rather than forking the scorer. Confidence comes from a layered verification: `node --check` on all five files, an import-chain check that resolves the cross-directory require, a `parseCodexResult` unit that produces the scorer's exact observed-result shape, and a regression baseline that ran the whole skill-benchmark vitest gate with and without the two edits and got identical numbers (19 failed / 131 passed both ways, delta 0; the 19 failures are pre-existing sk-code and sk-design playbook and design-proof failures owned by a concurrent session). The final proof was a live dispatch of one deep-improvement scenario through the fully wired path on each transport: both returned PASS with `statedRoutingParsed: true`, and the codex reply showed `eventCount: 0` against opencode's `eventCount: 6`, confirming the documented fidelity gap.

The work ran on the shared `skilled/v4.0.0.0` branch alongside a concurrent session. Benchmark run outputs write to the session scratchpad, not the skill tree, to keep the shared tree clean.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the codex spawn in the runtime, not the benchmark packet | cli-codex's `deep-loop-runtime-required` hard rule (severity error) forbids a packet-local codex adapter; the operator chose the compliant runtime-hosted helper over waiving the rule. |
| Reuse the opencode path's prompt + parsers | Both transports must pose the identical routing question and parse identically, so a score gap reflects the model or transport, not a different harness. |
| Record codex activation as `null`, not `false` | Codex emits no `tool_use` stream, so activation is unobservable; the scorer treats `null` as unmeasured (the router-mode convention), which keeps codex scores fair instead of penalizing an unreportable channel. |
| Deliver the prompt on stdin with `-o` capture | Matches `fanout-run.cjs`'s proven codex invocation (avoids ARG_MAX and quoting) and gives a clean last message to parse instead of the full exec log. |
| Exclude the `system-deep-loop` hub from live runs | Its playbook references feature files at hyphenated paths while the real dirs are underscored, yielding 0 readable scenarios; the mismatch is pre-existing and concurrent-owned, out of this packet's scope. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` (5 files) | PASS on codex-dispatch, codex-executor, live-executor, executor-dispatch, run-skill-benchmark |
| Import chain across directories | PASS, codex-executor resolves `../../../runtime/scripts/codex-dispatch.cjs`; `hasRouteGold` exported |
| `parseCodexResult` shape unit | PASS, emits mode/observedResources/observedSurface/observedIntents/observedWorkflowMode/routeDeclaration with `activation: null`, `transport: codex` |
| Mode A router path | PASS, exit 0, deterministic path undisturbed |
| Regression baseline (whole vitest gate, with vs without edits) | PASS, 19 failed / 131 passed identical both ways, delta 0 |
| Live codex dispatch, full wired path (DI-R03) | PASS/100, `statedRoutingParsed: true`, 6 on-target resources, `eventCount: 0` |
| Live opencode dispatch, same scenario (DI-R03) | PASS/100, `statedRoutingParsed: true`, `eventCount: 6`, `toolCalls: 1` |
| Codex OAuth pre-flight | PASS, `codex login status` reports logged in |
| Tier-1 both-transport batch (deep-improvement, 9 scenarios) | PASS both — opencode 86, codex 85; 9/9 parsed, 0 dispatch errors; 7/9 scenarios identical |
| Change-attribution (Mode-A now vs frozen baseline) | PASS, delta 0 on all 9 scenarios (SKILL.md edits did not move deterministic routing) |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:results -->
## Tier-1 Results (deep-improvement, luna xhigh/fast)

The full comparison lives in `transport-comparison.md`; the headline: the two transports agree within 1 aggregate point (opencode 86, codex 85), with 7 of 9 scenarios scoring identically. The entire gap is one scenario (DI-R03) where codex-luna recalled 5 of 6 expected resources against opencode's 6 of 6, at N=1 per cell. The dimensions that would expose a real routing difference, D3 (efficiency) and D5 (connectivity), are identical across transports (56 and 97). Codex's missing `tool_use` stream did not distort the comparison because activation is not among the scored dimensions for this skill. Separately, deterministic Mode-A now matches the frozen baseline exactly (delta 0 on every scenario), so this session's SKILL.md changes did not move deep-improvement's routing score.
<!-- /ANCHOR:results -->

---

<!-- ANCHOR:tier2-extension -->
## Tier-2 Extension: luna routing breadth + SOL deep-review

After the adapter and Tier-1 comparison shipped, the operator scaled the live benchmark to a Tier-2 breadth sweep. Three runnable skills ran with gpt-5.6-luna at xhigh/fast over the cli-opencode transport. A fresh GPT-5.6-SOL xhigh/fast agent then analyzed the raw reports and drafted recommendations, and a GPT-5.6-SOL ULTRA/fast deep-review ran five iterations over those findings to reconcile the final adjusted recommendations.

### What the sweep measured

| Skill | Routing gold | luna result | Reading |
|-------|--------------|-------------|---------|
| `mcp-tooling` (hub) | none | PASS, 100/100 | No routing gold, so the aggregate collapses to a deterministic pass and measures nothing about luna's routing. |
| `sk-doc` (hub) | present | FAIL, 20/100 (gold-only resource recall 19.4%) | luna recalls few of the expected resources on the doc hub's fitted suite. |
| `sk-code` (hub) | present | CONDITIONAL, 65/100 (surface 18/18, gold-only resource recall 49.8%) | Strong hub-surface routing, weak leaf-resource recall (5 of 15 full, 6 of 15 zero). |

Every gold-bearing suite carries `holdoutScore: null` with zero holdout scenarios, so all scores are fitted, not held-out generalization. mcp-tooling reports a four-plus-two fitted/holdout split but has no routing gold, so that split is a harness control, not routing evidence. Conclusions are scoped to "gpt-5.6-luna xhigh/fast under the tested cli-opencode executor configuration," not to luna in general.

### Deep-review outcome

The SOL-ULTRA review re-derived every headline figure against the raw reports and reproduced them exactly (verdict CONDITIONAL; P0=0, P1=2, P2=4). The defects it found were evidence-scoping and citation, not arithmetic: the draft over-generalized fitted-suite results as if they were held-out (P1), and left several claims uncited (P1). It reconciled to 12 adjusted recommendations, each now scoped to the fitted-suite / single-config caveat and cited to a specific report line.

### Deliverables

| Artifact | Path |
|----------|------|
| Analysis + 12 adjusted recommendations | `tier2-luna-routing-analysis.md` |
| Raw benchmark reports (3 skills) | `artifacts/tier2-{mcp-tooling,sk-doc,sk-code}-luna-opencode.report.{json,md}` |
| Deep-review packet (report + 5 iterations) | `review/` |
<!-- /ANCHOR:tier2-extension -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Cross-transport scores compare on routing declaration, not tool evidence.** Codex emits no `tool_use` stream, so activation and observed file-reads are unmeasured on the codex transport. Compare opencode and codex on the stated-routing dimensions (surface, resources, intents, workflowMode); a gap on activation is a transport-fidelity artifact, not a model difference.
2. **The `system-deep-loop` hub is not live-runnable.** Its playbook's feature-file paths use hyphens while the directories are underscored, so it loads 0 scenarios. Fixing that is a separate, concurrent-owned migration; deep-improvement is the runnable Tier-1 target.
3. **The timeout to fallback path is code-verified, not runtime-triggered.** No dispatch timed out during verification, so the one-shot fallback to a lower effort is proven by code inspection, not by an observed timeout.
4. **Tier-2 breadth is bounded by cost.** Each xhigh dispatch takes minutes; how many Tier-2 skills to sweep is an operator decision recorded as an open question.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
