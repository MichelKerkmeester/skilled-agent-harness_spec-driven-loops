---
title: "031 GPT Reliability (Deep-Loop) Before vs After"
description: "Before-and-after narrative for packet 031, covering ten logical groupings across the seventeen phases: research, routing hardening, the blocked smoke test and parked host-identity spec, identity fixes, universal routing, ai-council reachability, the enforcement plugin, the benchmark and FIX-5 closure, skill-doc drift remediation, and loop-guard hardening."
trigger_phrases:
  - "031 before vs after"
  - "deep loop gpt opencode before after"
importance_tier: "normal"
contextType: "implementation"
---
# What Changed in Deep-Loop Issues with GPT-Backed OpenCode: The Full 031 Program

> Packet 031 turned an operator-reported symptom
> **Reorg note (2026-07-05):** the phases below were regrouped into **7 themed L1 tracks** (see `context-index.md` for the old→new remap) and the former top-level packet `037-mk-deep-loop-guard-retention` was folded in as `003-guard-and-enforcement/005`. The packet is **not fully complete**: tracks 001-005 are complete, **006 is Planned** and **007 is In Progress**. The narrative below is preserved by its original flat phase numbers for historical accuracy.
, GPT running slowly and mis-invoking deep skills inside OpenCode, into a diagnosed and measured fix. It researched the mis-routing problem, hardened dispatch identity end to end, hit one genuine block and parked one investigation pending evidence, ran a fresh six-lineage behavioral study, fixed the identity gaps that study found, completed orchestrate's routing table, deliberately narrowed ai-council's reachability, shipped a live-verified enforcement plugin, measured the real GPT-vs-Claude gap, closed the parked investigation against that evidence, audited and fixed every skill doc the program's own changes made stale, and finally hardened the enforcement plugin itself against a loop-like failure mode the benchmark had exposed. Fifteen of seventeen phases shipped. One was blocked without a clean pass and one was parked, then closed unimplemented once real evidence said it was unnecessary.

---

## 1. RESEARCH AND DECOMPOSITION

Phases 001 and 007 are the two research fronts of the packet. Phase 001 opened the investigation and phase 007 reopened it after a block, both using multi-lineage deep-research loops rather than single-pass reasoning.

**Before**

The operator's symptom report, GPT slow as `@orchestrate`, frequently mis-invoking deep sub-agents, stuck on pre-defined flows, needing literal rather than judgment-based instructions, had no ranked, evidence-backed decomposition into fixable phases.

**After**

Phase 001's 6-iteration research (10/10 key questions) decomposed the problem into phases 002 through 006. After phase 005 blocked without a clean pass, phase 007's two-round, six-lineage research (GLM-5.2, GPT-5.5-fast, Claude Sonnet 5, Claude Opus 4.8) answered 9 further key questions and, notably, caught and corrected its own round-1 error about the ai-council route-proof validator through independent 2-vs-1 convergence rather than trusting the first pass.

**Impact**

The packet never guessed at a fix. Every implementation phase from 002 onward traces back to one of these two research passes, and the research process itself demonstrated the self-correction discipline the rest of the packet would later apply to its own findings.

**Why**

A mis-routing symptom this broad, spanning prompt contracts, registry identity, host runtime behavior, and model-specific behavior differences, needed a research pass before implementation so the fix addressed the actual mechanism rather than the first plausible guess.

## 2. ROUTING IDENTITY AND DISPATCH HARDENING

Phases 002, 003, and 004 built the foundational routing-identity layer: route-proof validation, a new primary router, and pre-route headers on every deep-mode prompt pack.

**Before**

The dispatch path relied on prose and prompt contracts with no hard checkpoint. A validator could pass a schema-valid artifact naming the wrong mode. Orchestrate's dispatch instructions were long-form prose without a resolvable route. Prompt packs put route identity after body prose, forcing a model to infer identity from context rather than read it first.

**After**

Route-proof validation now rejects a mismatched `mode`/`target_agent`/`agent_definition_loaded`/`resolved_route` combination instead of passing it. A new `deep.md` primary router exists on both `.opencode` and `.claude` mirrors, and `orchestrate.md` carries a registry-backed `Deep Route:` field instead of free text. All 4 deep-mode prompt packs and command YAMLs now put a resolved-route header before body prose.

**Impact**

A GPT dispatch that gets the mode wrong is now caught mechanically rather than passing silently, and the route identity a model needs is the first thing it reads, not something it has to infer from surrounding prose.

**Why**

Identity has to be correct and checkable before anything downstream, benchmarking, enforcement, or behavioral research, can trust what it is measuring. These three phases built that ground truth first.

## 3. GPT VERIFICATION SMOKE AND HOST-IDENTITY PARKING

Phases 005 and 006 are the packet's one genuine block and one genuine park-then-close. Neither shipped a production change in its own right.

**Before**

Whether the dispatch-identity hardening in phases 002-004 actually worked under a real GPT invocation was unconfirmed, and a structural host-runtime hard-identity fix (FIX-5) sat as an open architectural question with no trigger condition defined.

**After**

Phase 005's bounded GPT route probes preserved route text on all 4 modes but never proved real leaf-agent loading, and every command-owned smoke attempt failed before reaching leaf dispatch, blocked by a general-agent gate, a self-invocation refusal, or an `OPENCODE_PID` block. The phase closed honestly as blocked, not as a false pass. Phase 006's host-hard-identity spec stayed parked, exactly as designed, with no `plan.md` or `tasks.md` ever created, pending a trigger that phase 005's inconclusive result did not supply.

**Impact**

The packet did not manufacture a clean pass it did not have, and did not build FIX-5 speculatively either. Both phases left an honest, evidence-shaped gap for phase 007's research and phase 012's real benchmark to close.

**Why**

A blocked test that gets reported as blocked, and a parked spec that stays parked without invented urgency, is what let the later phases (007, 012, 013) resolve the real question with real evidence instead of inheriting a false premise.

## 4. MODE-D AND AI-COUNCIL IDENTITY FIXES

Phase 008 fixed two identity bugs that phase 005's smoke test and phase 007's research had directly surfaced.

**Before**

All 8 `/deep:*` commands used a self-classification "Mode D" gate that asked an agent an abstract, unanswerable question about its own capability, and it fired incorrectly during phase 005's real smoke test. Separately, the ai-council route-proof identity in `orchestrate-topic.cjs` and `deep_ai-council_auto.yaml` agreed with itself but disagreed with `mode-registry.json`, so a validator could certify an artifact naming a non-existent agent (`deep-ai-council`) as valid.

**After**

All 8 command files now use an evidence-based dispatch-context check that defaults to proceeding rather than blocking on an unanswerable self-assessment. The ai-council route-proof identity now matches the registry (`mode: ai-council` / `target_agent: ai-council`).

**Impact**

A real, observed false-positive block is gone, and a route-proof check that used to agree with itself while being wrong now agrees with the actual source of truth.

**Why**

Both bugs were found by direct observation, not speculation, phase 005's live block and phase 007's research, so the fix targeted the exact failure mechanism rather than a broader rewrite.

## 5. ORCHESTRATE UNIVERSAL ROUTING

Phase 009 completed `orchestrate.md`'s own routing table and later trimmed its size.

**Before**

Orchestrate's Priority table was missing rows for `@deep-context` and `@deep-review`, its `Deep Route:` field (added in phase 003) was still free text rather than a registry lookup, and nothing stopped a dispatch from targeting `@deep` itself as a worker.

**After**

Both missing rows are present, `Deep Route:` is now an explicit registry-resolved field, and an NDP boundary forbids dispatching `@deep` as a worker. A follow-up pass then trimmed both runtime mirrors by 8.3-8.4% (891 to 817 lines on OpenCode, 880 to 806 on Claude) by removing a duplicated flowchart and consolidating repeated NDP restatements.

**Impact**

Every deep mode now has a resolvable route in the one file every dispatch passes through, and that file is smaller without losing any of the non-deep routing rows, confirmed byte-unchanged by diff.

**Why**

A routing table with two silent gaps and an unresolved field is a routing table a GPT-backed agent can genuinely fail to use correctly, exactly the packet's original symptom. Closing the gaps here is what made the later enforcement plugin (phase 011) and benchmark (phase 012) meaningful.

## 6. AI-COUNCIL REACHABILITY CONVERSION

Phase 010 converted `ai-council.md` from a directly-invokable primary agent to a subagent, on explicit operator instruction that overrode research's unanimous recommendation.

**Before**

`ai-council.md` was `mode: all`, the repo's only agent besides `markdown.md` with that mode, creating a cross-runtime asymmetry since Claude Code has no equivalent "primary agent" concept.

**After**

`ai-council.md` is now `mode: subagent`. Live CLI testing confirmed direct invocation is now correctly rejected while Task-dispatch and orchestrate-routed dispatch both still work. Two real documentation callers that would have broken were found and redirected before the change landed, not after.

**Impact**

The repo's routing model is more consistent across runtimes, and the conversion shipped with zero broken callers because the redirect work happened proactively.

**Why**

This is the packet's one explicit, documented deviation from its own research: the operator's cross-runtime consistency argument outweighed research's unanimous "keep it as is" finding, and that deviation is recorded in a decision-record rather than silently overriding the research.

## 7. ENFORCEMENT PLUGIN

Phase 011 built the first mechanical enforcement layer for everything phases 002-010 had fixed at the identity level.

**Before**

Nothing stopped a Task dispatch from declaring a mismatched mode at the moment of dispatch. Phases 002-010 fixed identity; nothing enforced it.

**After**

A new `tool.execute.before` plugin (`deep-route-guard.js`, renamed the same day to `mk-deep-loop-guard.js`) reads `mode-registry.json` fresh on every dispatch and flags or blocks a mismatch. Live testing against the real installed `opencode` binary confirmed the hook fires, the reject mode genuinely blocks the dispatch (`task` tool status becomes `"error"`), the default warn mode does not, a missing registry fails open rather than blocking unrelated dispatches, and non-deep dispatches pass through untouched.

**Impact**

A routing mismatch is no longer just theoretically wrong, it is mechanically caught at the moment of dispatch, with both an observability-only mode and a hard-reject mode available depending on how much enforcement a given rollout wants.

**Why**

Fixing identity without enforcing it leaves the fix optional. This phase closed that gap and, critically, tested the fail-open and fail-closed behavior live rather than assuming the OpenCode host's hook contract worked the way its type signature implied.

## 8. GPT-VS-CLAUDE BENCHMARK AND FIX-5 CLOSURE

Phases 012 and 013 are where the packet stopped inferring and started measuring, then closed its oldest open question against that measurement.

**Before**

Whether the agent-layer fixes (002-011) were sufficient, or whether the parked host-hard-identity spec (006) was actually needed, was an open question resting on phase 005's inconclusive block and phase 007's research recommendation, not on real dispatch evidence.

**After**

Phase 012 confirmed the external-shell precondition that had blocked phase 005, then ran live smoke dispatches across 4 deep modes times 2 models: zero semantic wrong-mode artifacts, zero route-proof mismatches, zero Mode-D recurrences, and a measured 3-10x GPT latency gap corroborating the operator's original report. Phase 013 applied research's cross-validated negative gate against those real results and formally closed phase 006 as unnecessary.

**Impact**

The packet's central open question, is the agent-layer fix enough, now has a real, measured answer instead of an assumption, and the closure is explicitly reopenable if future evidence contradicts it.

**Why**

A structural decision this consequential (whether to build host-runtime hard identity) deserved real dispatch evidence, not the inconclusive result phase 005 left behind. Measuring first and deciding second is what let phase 013's closure be a genuine gate rather than a rubber stamp.

## 9. SKILL-DOC DRIFT AUDIT AND REMEDIATION

Phases 014 and 015 turned the same dual-model deep-loop methodology the packet used for its own research back onto its own documentation.

**Before**

Phases 008-013 changed real behavior (ai-council's mode, orchestrate's routing table, the plugin's name, agent mirror requirements) without a dedicated pass to check whether the repo's `SKILL.md`/reference/README files still described that behavior accurately.

**After**

A 20-iteration dual fan-out (10 deep-review, 10 deep-research) audited 45 candidate files and confirmed 6 real drift clusters, independently re-verified by 20 fresh Sonnet 5 agents with zero fabrications found. Phase 015 fixed all 6, then a follow-up 10-iteration dual-model adversarial review found and fixed 2 more real residuals, while correctly rejecting one reviewer's false claim and flagging one genuinely real but out-of-scope finding rather than silently expanding scope to fix it.

**Impact**

Every skill doc this program's own changes made stale is now accurate, and the process demonstrated its own adversarial discipline by rejecting a false finding instead of fixing something that was not actually broken.

**Why**

A packet that changes real behavior but leaves its own documentation describing the old behavior creates exactly the kind of confusion this whole program exists to prevent. Auditing the packet's own trailing docs closed that loop.

## 10. LOOP-GUARD HARDENING

Phases 016 and 017 hardened the phase-011 enforcement plugin against a gap the benchmark and the plugin's own dispatch convention had exposed.

**Before**

Phase 012's benchmark measured GPT inconsistently refusing one direct `deep-research` dispatch while allowing an identical `deep-review` one, with no mechanism to detect a loop-like repeated hand-off from `orchestrate` to the same loop executor. Separately, `orchestrate.md`'s own dispatch convention always sets `subagent_type: "general"`, which meant the phase-011 mode-mismatch check's `registry.get(args.subagent_type)` silently no-oped on every real `orchestrate`-routed dispatch, the exact path it was built to guard, a gap phase 016's research surfaced and independently re-verified rather than trusting at face value.

**After**

Phase 016's 5-iteration dual-model research converged on a session-scoped, iteration-aware design. Phase 017 implemented it: `resolveTargetIdentity()` now resolves the real target from prompt text before falling back to `subagent_type`, fixing both checks at once, and a new loop-repeat check flags or blocks a non-command-driven repeated hand-off to the same loop executor. The hermetic test suite was extended and passes in full, and a live smoke test against the real installed `opencode` host reconfirmed the throw-blocks-dispatch mechanism with zero regression.

**Impact**

The plugin now correctly resolves identity for the dispatch shape `orchestrate` actually uses in production, closing a real, previously-undiscovered gap in already-shipped code, and can additionally catch a GPT re-implementing a command's loop by hand instead of letting the parent command own it.

**Why**

Phase 011's original live verification used a test harness that set `subagent_type` directly to the real agent name, which does not match how `orchestrate` actually dispatches. This phase's research caught that mismatch, verified it directly against `orchestrate.md`'s real content rather than trusting the claim, and fixed it as part of the same change that added loop-repeat detection, since both needed identical prompt-text parsing.
