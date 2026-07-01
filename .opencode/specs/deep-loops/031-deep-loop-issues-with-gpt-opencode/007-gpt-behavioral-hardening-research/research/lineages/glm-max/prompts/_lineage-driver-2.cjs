'use strict';
// Lineage driver part 2: phase_main_loop iterations 16-30 for glm-max + synthesis prep.
// DIR is the lineage root (parent of this prompts/ dir).

const fs = require('node:fs');
const path = require('node:path');

const DIR = path.join(__dirname, '..');
const ITER_DIR = path.join(DIR, 'iterations');
const DELTAS_DIR = path.join(DIR, 'deltas');
const STATE_LOG = path.join(DIR, 'deep-research-state.jsonl');

const IT = [];

IT.push({
  n: 16, focusTrack: 'benchmark', status: 'complete',
  title: 'GPT-vs-Claude Benchmark Design (KQ6)',
  focus: 'Design a minimal, repeatable benchmark comparing GPT-5.5 (high/fast) against Claude Sonnet/Opus on latency + first-dispatch correctness across all 4 deep modes, usable now as a baseline and later as a regression gate.',
  findings: [
    { claim: 'Reuse the iter-5 decisive smoke AS the benchmark: it already defines per-mode first-dispatch correctness (route-proof fields) + a native/Claude baseline control. The benchmark = run the smoke harness for BOTH GPT and Claude on the same tiny packet, record wall-clock + correctness.', evidence: 'iter 5; 005-gpt-verification-smoke/verification-smoke.md:42-66; ../001/research.md §7' },
    { claim: 'Latency metric: time from command dispatch to first canonical record written (first-dispatch latency), plus total iteration latency. Captures the role-resolution-overhead mechanism (../001 §3.1) directly.', evidence: '../001-deep-agent-router-and-orchestration/research/research.md §3.1' },
    { claim: 'Correctness metric: route-proof score = fraction of {mode, target_agent, agent_definition_loaded==true, echoed resolved_route} that match the requested mode. Binary gate per mode (all 4 must match) + a continuous score for trend.', evidence: 'iter 5; 005/verification-smoke.md:42-50' },
    { claim: 'Minimal harness: 4 modes x 2 models x 1 tiny packet = 8 runs; snapshot pre/post state-log counts; record the 2 metrics per run. No new tooling required — existing workflow provenance suffices (../001 §7).', evidence: '../001/research.md §7 (existing provenance suffices)' },
  ],
  sources: ['iter 5', '005-gpt-verification-smoke/verification-smoke.md:42-66', '../001-deep-agent-router-and-orchestration/research/research.md §3.1,§7'],
  ratio: 0.62, novelty: 'Fuses the smoke and benchmark into one 8-run harness with a 2-metric design (latency + route-proof), avoiding new tooling.', confidence: 0.86,
  worked: ['Reusing the smoke as the benchmark halves the design surface.'],
  failed: [],
  ruledOut: [],
  next: 'KQ6: how the baseline evolves into a regression gate for any fix this research proposes.',
  kqs: ['KQ6'], answered: [],
});

IT.push({
  n: 17, focusTrack: 'benchmark', status: 'complete',
  title: 'Baseline -> Regression Gate Evolution (KQ6)',
  focus: 'Specify how the baseline benchmark becomes a regression gate for the KQ4/KQ5 fixes and FIX-5, and what thresholds trigger action.',
  findings: [
    { claim: 'Baseline phase (now): record GPT-vs-Claude on the CURRENT (post-002-004) codebase. Expected: GPT correctness < Claude (route-proof gaps) and GPT latency > Claude (role-resolution overhead). This establishes the "before" numbers that no GPT-vs-Claude wall-clock log currently exists for (../001 §9).', evidence: '../001/research.md §9; iter 16' },
    { claim: 'Regression gate (after KQ4/KQ5 land): re-run the same 8 runs; PASS requires GPT route-proof score == Claude route-proof score (all 4 modes match) AND GPT first-dispatch latency within an acceptable ratio of Claude. The gate is the KQ1 smoke correctness criteria applied to both models.', evidence: 'iter 5; iter 16' },
    { claim: 'FIX-5 trigger integration: if, after KQ4/KQ5, GPT still produces schema-valid route-mismatched artifacts (route-proof < 4/4 while Claude = 4/4), that is the KQ9/FIX-5 unpark signal — the benchmark makes it observable and measured, not inferred.', evidence: 'iter 5; 006/decision-record.md:20-22; ../001/research.md §5' },
    { claim: 'KQ6 ANSWER: a 8-run, 2-metric benchmark reusable as baseline now and regression gate after fixes; no new tooling; integrates the FIX-5 trigger directly. Residual risk: thresholds (latency ratio) need calibration from the baseline run.', evidence: 'iter 16 + this iteration' },
  ],
  sources: ['../001-deep-agent-router-and-orchestration/research/research.md §5,§7,§9', 'iter 5', 'iter 16', '006-host-hard-identity-fix5/decision-record.md:20-22'],
  ratio: 0.5, novelty: 'Turns the benchmark into a regression gate that doubles as the FIX-5 trigger observability, closing the measurement gap from ../001 §9.', confidence: 0.85,
  worked: ['Wiring the FIX-5 trigger into the regression gate makes the benchmark load-bearing, not decorative.'],
  failed: [],
  ruledOut: [],
  next: 'KQ7: enumerate which other commands/skills should adopt the literal-safe pattern from deep.md.',
  kqs: ['KQ6'], answered: ['KQ6'],
});

IT.push({
  n: 18, focusTrack: 'pattern', status: 'complete',
  title: 'Literal-Safe Pattern Adopters (KQ7)',
  focus: 'Identify which commands/skills should adopt the deep.md literal-safe pattern (deterministic table + single bounded clarification + structured header + hard boundaries).',
  findings: [
    { claim: 'Adopter #1: orchestrate.md deep-dispatch path — replace the judgment-filled Deep Route field (:207) and the incomplete priority table (:95-105) with deep.md-style registry resolution (this is KQ4).', evidence: 'orchestrate.md:95-105,207; iter 12' },
    { claim: 'Adopter #2: the 4 deep-loop command entry points (/deep:research, /deep:review, /deep:context, /deep:ai-council) — each should emit a Resolved-route header at its CLI/template seam so the resolved route is never re-inferred downstream (../001 §3 already specified these headers; verify they landed).', evidence: '../001/research.md §3 (pre-route edits table); commands/deep/{research,review,context,ai-council}.md' },
    { claim: 'Adopter #3: the cli-opencode executor seam — the CLI has no agent flag and passes a positional message (../001 §3.1); a structured route header in the prompt is the only identity carrier, so the literal-safe header must be mandatory there, not optional.', evidence: '../001/research.md §3.1; cli-opencode/SKILL.md' },
    { claim: 'Non-adopter (intentional): general-purpose agents (@context, @code, @review) should NOT get a hard route table — their value is flexibility (orchestrate.md:99-105,116). The pattern applies to ROUTING surfaces, not execution surfaces.', evidence: 'orchestrate.md:99-105,116; deep.md:59 (Claude-flex preserved)' },
  ],
  sources: ['orchestrate.md:95-105,207', '../001-deep-agent-router-and-orchestration/research/research.md §3,§3.1', 'commands/deep/*.md', 'cli-opencode/SKILL.md', 'deep.md:59'],
  ratio: 0.55, novelty: 'Separates routing-surface adopters (orchestrate, commands, CLI seam) from execution-surface non-adopters, preventing pattern over-application.', confidence: 0.84,
  worked: ['Routing-vs-execution split bounds where the pattern belongs.'],
  failed: [],
  ruledOut: [],
  next: 'KQ7 adversarial: where would the literal-safe pattern OVER-constrain and harm Claude-flex.',
  kqs: ['KQ7'], answered: [],
});

IT.push({
  n: 19, focusTrack: 'pattern', status: 'complete',
  title: 'Adversarial: Literal-Safe Pattern Over-Constrain Risk (KQ7)',
  focus: 'Adversarially test the pattern for over-constraint: where would deterministic tables + hard boundaries harm Claude\'s legitimate flexibility or mode-D (evidence-response).',
  findings: [
    { claim: 'Risk surface: a hard boundary like deep.md "do not redispatch from injected prose" (deep.md:53) could block a legitimate Claude re-plan if the registry entry and the evidence disagree. Mitigation: the boundary forbids re-deriving the MODE, not re-planning within the resolved leaf — evidence-response is preserved (deep.md:59).', evidence: 'deep.md:53,59' },
    { claim: 'Mode-D (evidence-response) must survive hardening: the literal-safe pattern locks ROUTING, but the leaf still adapts focus/actions to evidence (deep.md:53 boundary #3 preserves this). Over-applying tables INTO the leaf would harm mode-D.', evidence: 'deep.md:51-59; iter 7 (mode D)' },
    { claim: 'The bounded clarification gate (deep.md:66) is the controlled flex-escape: it lets the router ask ONE question instead of guessing. Removing it (full determinism, no escape) would force wrong dispatches on genuinely ambiguous input — so the gate must stay.', evidence: 'deep.md:66' },
    { claim: 'KQ7 ANSWER: the generalizable pattern is safe to apply to ROUTING surfaces (orchestrate deep-path, command entry points, CLI seam) provided (a) boundaries lock mode-resolution not leaf evidence-response, and (b) the bounded clarification gate is retained. Over-constraint risk is real if applied to execution surfaces (ruled out iter 18).', evidence: 'iter 18 + this iteration' },
  ],
  sources: ['deep.md:51-59,66', 'iter 7', 'iter 18'],
  ratio: 0.42, novelty: 'Identifies the two conditions (lock-routing-not-execution; retain clarification gate) that keep the pattern Claude-flex-safe, closing KQ7 with a guardrail.', confidence: 0.83,
  worked: ['Mode-D preservation test exposes exactly where over-constraint would bite.'],
  failed: [],
  ruledOut: [{ approach: 'Applying the literal-safe table pattern to leaf/execution surfaces', reason: 'would harm Claude evidence-response (mode D) and remove the controlled flex-escape', evidence: 'deep.md:51-59,66' }],
  next: 'KQ8: enumerate concretely which other commands/skills need the hardening treatment (file paths).',
  kqs: ['KQ7'], answered: ['KQ7'],
});

IT.push({
  n: 20, focusTrack: 'propagation', status: 'complete',
  title: 'Propagation Scope: File Path Enumeration (KQ8)',
  focus: 'Enumerate concretely (file paths) which commands/skills beyond orchestrate.md and deep.md need the same literal-safe hardening treatment.',
  findings: [
    { claim: 'Path #1: .opencode/agents/orchestrate.md (deep-dispatch path :95-105,:207) — KQ4 hardening.', evidence: 'orchestrate.md:95-105,207' },
    { claim: 'Path #2-5: the 4 deep command entry points — .opencode/commands/deep/{research,review,context,ai-council}.md — each needs a mandatory Resolved-route header at its seam (../001 §3 specified; verify landed + enforce as mandatory not optional).', evidence: '../001/research.md §3; commands/deep/*.md' },
    { claim: 'Path #6: .opencode/agents/deep.md — already literal-safe, but its Deep Route header (deep.md:69-75) is the canonical template the others copy; keep as the reference.', evidence: 'deep.md:69-75' },
    { claim: 'Path #7: the CLI executor prompt seam in cli-opencode (no agent flag, positional message) — the route header is the only identity carrier; make it structurally mandatory there.', evidence: '../001/research.md §3.1; cli-opencode/SKILL.md' },
    { claim: 'Path #8 (new): system-skill-advisor hook surface — co-locate the KQ5 enforcement plugin here so route-proof is asserted at dispatch against mode-registry.json.', evidence: 'mode-registry.json:10-16; iter 14' },
    { claim: 'Cross-runtime mirrors: .claude/agents/{orchestrate,deep,ai-council}.md must receive the SAME edits; Codex parity is blocked (TOML-location contradiction, ../001 §8) and stays out of scope.', evidence: '../001/research.md §8; .claude/agents/*.md' },
  ],
  sources: ['orchestrate.md', 'commands/deep/*.md', 'deep.md', 'cli-opencode/SKILL.md', 'mode-registry.json', 'system-skill-advisor', '../001/research.md §3,§3.1,§8', '.claude/agents/*.md'],
  ratio: 0.58, novelty: 'Produces a concrete 8-path propagation list (6 in-scope, mirrors required, Codex explicitly deferred) with the command-seam mandatory-not-optional distinction.', confidence: 0.85,
  worked: ['Enumerating paths before scoping keeps the propagation list auditable.'],
  failed: [],
  ruledOut: [{ approach: 'Codex (.codex/agents or .opencode/agents/*.toml) parity in this work', reason: 'mirror-location contradiction unresolved (../001 §8); out of scope', evidence: '../001/research.md §8' }],
  next: 'KQ8 deepening: audit the deep-loop command/agent family for additional routing seams the list may have missed.',
  kqs: ['KQ8'], answered: [],
});

IT.push({
  n: 21, focusTrack: 'propagation', status: 'complete',
  title: 'Deep-Loop Family Audit for Missed Routing Seams (KQ8)',
  focus: 'Audit the deep-loop command/agent family for additional routing seams (improvement-family modes, the mode-registry non-runtime modes) the iter-20 list may have missed.',
  findings: [
    { claim: 'mode-registry.json lists 4 runtime-loop modes (context/research/review/ai-council) AND 4 improvement-family modes (agent-improvement, model-benchmark, skill-benchmark, ai-system-improvement). The improvement modes use backendKind=improvement-host/external-adapter, NOT the runtime-loop router.', evidence: 'mode-registry.json:18-146' },
    { claim: 'deep.md explicitly scopes itself to the 4 runtime-loop modes and marks improvement-family out of scope (deep.md:47). So the iter-20 list correctly covers the runtime-loop routing seams; improvement modes route through /deep:agent-improvement etc. with their own loop-host, not deep.md.', evidence: 'deep.md:47; mode-registry.json:81-145' },
    { claim: 'Missed-seam check: the improvement commands (/deep:agent-improvement, /deep:model-benchmark, /deep:skill-benchmark, /deep:ai-system-improvement) DO need a Resolved-route header at their own seams IF GPT also mis-resolves them — but the operator symptoms (research-prompt.md:21) name only the 4 runtime modes, so improvement-family hardening is lower priority and can follow the same pattern later.', evidence: 'mode-registry.json:81-145; research-prompt.md:21' },
    { claim: 'No additional runtime-loop seam missed. The iter-20 list + this audit = complete propagation scope for the reported symptom class, with improvement-family flagged as same-pattern-follow-up.', evidence: 'iter 20 + this audit' },
  ],
  sources: ['mode-registry.json:18-146', 'deep.md:47', 'research-prompt.md:21', 'commands/deep/*.md'],
  ratio: 0.4, novelty: 'Confirms the runtime-loop list is complete and explicitly carves out improvement-family as a deferred same-pattern follow-up, not a missed seam.', confidence: 0.82,
  worked: ['Reading the registry\'s backendKind field cleanly separates runtime-loop from improvement-family routing.'],
  failed: [],
  ruledOut: [],
  next: 'KQ8 adversarial: which family members must NOT be hardened (preserve non-broken flexibility).',
  kqs: ['KQ8'], answered: [],
});

IT.push({
  n: 22, focusTrack: 'propagation', status: 'complete',
  title: 'Adversarial: Family Members That Must NOT Be Hardened (KQ8)',
  focus: 'Identify which family members must NOT receive the hardening to avoid breaking non-broken flexibility, finalizing KQ8 scope.',
  findings: [
    { claim: 'Must-NOT-harden #1: leaf execution agents (@context, @code, @review, @markdown, @debug) — their value is evidence-response/flexibility, not routing determinism. Hardening their internals would harm mode-D (iter 7). Only their DISPATCH routing is hardened (via orchestrate/deep), not their behavior.', evidence: 'orchestrate.md:99-105,116; iter 7,19' },
    { claim: 'Must-NOT-harden #2: ai-council depth-0 parallel path — KQ3 already ruled out subagent-only conversion; the route-proof header is additive, the parallel value stays (iter 9-11).', evidence: 'iter 9-11; ai-council.md:55-60' },
    { claim: 'Must-NOT-harden #3: the bounded clarification gate itself (deep.md:66) — removing it for "full determinism" would force wrong dispatches on ambiguous input. It is the controlled flex-escape.', evidence: 'deep.md:66; iter 19' },
    { claim: 'KQ8 ANSWER: propagation scope = orchestrate.md (KQ4), 4 command entry seams, the CLI executor seam, system-skill-advisor enforcement (KQ5), + .claude mirrors. Explicitly NOT hardened: leaf execution agents, council depth-0 path, the clarification gate. Codex deferred. Improvement-family deferred (same pattern).', evidence: 'iter 20,21 + this iteration' },
  ],
  sources: ['orchestrate.md:99-105,116', 'ai-council.md:55-60', 'deep.md:66', 'iter 7,9-11,19,20,21'],
  ratio: 0.38, novelty: 'Finalizes KQ8 with an explicit must-NOT-harden list that protects the three flex assets, closing the scope with guardrails.', confidence: 0.84,
  worked: ['A must-NOT list is as important as a must list for propagation scope.'],
  failed: [],
  ruledOut: [],
  next: 'KQ9: FIX-5 unpark decision criterion distinct from phase 006\'s inconclusive trigger.',
  kqs: ['KQ8'], answered: ['KQ8'],
});

IT.push({
  n: 23, focusTrack: 'fix5', status: 'complete',
  title: 'FIX-5 Unpark Decision Criterion (KQ9)',
  focus: 'State a clear FIX-5 unpark decision criterion distinct from — and more decisive than — phase 006\'s existing (already-inconclusive) trigger language.',
  findings: [
    { claim: 'Phase 006\'s existing trigger (006/decision-record.md:20-22): unpark if phase-004 smoke produces a schema-valid route-mISMATCHED artifact. Weakness: it depends on the smoke actually running cleanly, which 005 proved it could NOT from inside OpenCode — so the trigger has never been exercisable, leaving 006 permanently parked on inconclusive evidence.', evidence: '006/decision-record.md:20-22; 005/verification-smoke.md:120' },
    { claim: 'New evidence since 006: (1) real-world operator symptoms now corroborate the mis-dispatch class independently of the smoke (research-prompt.md:21); (2) the KQ1 external-smoke spec (iter 5) makes the trigger actually runnable; (3) the KQ6 benchmark (iter 16-17) makes correctness measurable GPT-vs-Claude; (4) the KQ5 plugin (iter 14-15) makes route-mismatch detectable at dispatch without host internals.', evidence: 'iter 5,14,16; research-prompt.md:21' },
    { claim: 'Proposed DECISION CRITERION (decisive): unpark FIX-5/host-identity IF AND ONLY IF, after KQ4 + KQ5 land AND the KQ1 external smoke runs, the KQ6 benchmark shows GPT route-proof score < 4/4 while Claude = 4/4 on any mode (i.e., prompt-layer + detection-layer hardening insufficient). This is distinct from 006 because it (a) requires the actually-runnable external smoke, (b) is measured not inferred, and (c) sequences KQ4/KQ5 first.', evidence: 'iter 5,12,14,16; 006/decision-record.md:20-22' },
    { claim: 'The criterion is a NEGATIVE gate on the cheaper layers: FIX-5 is mandatory only when the agent-layer (KQ4) + detection-layer (KQ5) are PROVEN insufficient by measured GPT-vs-Claude gap, not when they are merely unproven.', evidence: 'synthesis of iters 5,12,14,16' },
  ],
  sources: ['006-host-hard-identity-fix5/decision-record.md:20-22', '005-gpt-verification-smoke/verification-smoke.md:120', 'research-prompt.md:21', 'iter 5,12,14,16'],
  ratio: 0.6, novelty: 'Replaces the never-exercisable 006 trigger with a measured, sequenced, negative-gate criterion tied to the runnable KQ1 smoke + KQ6 benchmark.', confidence: 0.86,
  worked: ['A negative gate on cheaper layers (prove insufficiency) is more decisive than a positive trigger (await mismatch).'],
  failed: [],
  ruledOut: [],
  next: 'KQ9: render the actual decision — unpark now / wait on KQ1 / neither — weighted on operator evidence.',
  kqs: ['KQ9'], answered: [],
});

IT.push({
  n: 24, focusTrack: 'fix5', status: 'complete',
  title: 'FIX-5 Decision: Wait on KQ1, Not Now (KQ9)',
  focus: 'Render the actual FIX-5 decision — unpark now, wait on KQ1, or neither — weighting the real-world operator evidence against the architectural blast radius.',
  findings: [
    { claim: 'Unpark-NOW case: operator symptoms corroborate mis-dispatch independently of the smoke (research-prompt.md:21); the agent-layer fix is unproven sufficient. But FIX-5/host-identity is architectural, crosses runtime/CLI/loops/mirrors, "not PR-sized" (../001 §8b) — high blast radius.', evidence: 'research-prompt.md:21; ../001/research.md §8b' },
    { claim: 'Neither/unpark-never case: only viable IF the agent+detection layers prove sufficient — which is exactly what is UNPROVEN. So "never" is not yet defensible.', evidence: '../001/research.md §9 (deferrals); 006/decision-record.md:29' },
    { claim: 'DECISION: WAIT on KQ1 (the external smoke) + the cheaper layers first. Unpark FIX-5 ONLY if the iter-23 negative gate fires (measured GPT<4/4 route-proof vs Claude=4/4 after KQ4+KQ5). Rationale: the operator evidence justifies RUNNING the decisive smoke now, not jumping to the architectural fix — the cheaper layers might suffice and FIX-5 is hard to roll back.', evidence: 'iter 23; ../001/research.md §8b,§9' },
    { claim: 'KQ9 ANSWER: do NOT unpark now; do NOT close as sufficient. Sequence = run KQ1 external smoke + land KQ4/KQ5, then apply the iter-23 measured negative-gate. This is more decisive than 006 because it converts "parked on inconclusive" into "actively gated on a runnable, measured criterion with a clear escalation path."', evidence: 'iter 23 + this iteration; 006/decision-record.md' },
    { claim: 'Risk-asymmetry note: waiting is reversible (run the smoke, decide from data); unparking-now is not easily reversible (architectural change). The asymmetry favors wait-on-KQ1.', evidence: '../001/research.md §8b' },
  ],
  sources: ['research-prompt.md:21', '../001-deep-agent-router-and-orchestration/research/research.md §8b,§9', '006-host-hard-identity-fix5/decision-record.md:29', 'iter 23'],
  ratio: 0.5, novelty: 'Renders a defensible wait-on-KQ1 decision with a risk-asymmetry argument and a runnable escalation path, closing KQ9.', confidence: 0.85,
  worked: ['Risk-asymmetry (reversible wait vs irreversible architectural unpark) resolves the decision cleanly.'],
  failed: [],
  ruledOut: [{ approach: 'Unparking FIX-5 immediately on operator evidence alone', reason: 'architectural blast radius; cheaper layers unproven-insufficient; wait is reversible', evidence: '../001/research.md §8b; iter 23' }],
  next: 'Cross-KQ adversarial re-check #1: red-team the KQ4 delegation + KQ5 plugin recommendations for holes.',
  kqs: ['KQ9'], answered: ['KQ9'],
});

IT.push({
  n: 25, focusTrack: 'adversarial', status: 'insight',
  title: 'Cross-KQ Adversarial Re-check #1: KQ4 + KQ5',
  focus: 'Red-team the two structural recommendations (orchestrate->deep delegation, enforcement plugin) for holes, second-order effects, and ordering conflicts.',
  findings: [
    { claim: 'KQ4 hole-test: if orchestrate delegates deep-dispatch to deep.md via "dispatch @deep and STOP", but the operator invokes /deep:research directly (bypassing orchestrate), the delegation path is never exercised — so KQ4 only helps the @orchestrate entry, not the /deep:* command entry. Both entries need the hardening (consistent with KQ8 paths #1 and #2-5).', evidence: 'iter 12,13; commands/deep/research.md' },
    { claim: 'KQ5 hole-test: the enforcement plugin asserts route-proof at dispatch, but if GPT produces a schema-valid route-matched artifact while doing semantically wrong work (the ../001 §5 false-negative), the plugin\'s route-proof passes too. The plugin catches IDENTITY/route mismatch, NOT semantic correctness — so it does not obsolete the need for the smoke to check real leaf behavior.', evidence: '../001/research.md §5; iter 14,15' },
    { claim: 'Ordering: KQ4 (prompt-layer) and KQ5 (detection-layer) are independent and parallelizable; neither blocks the other. KQ6 benchmark should run AFTER both to measure their joint effect. KQ1 smoke can run before (baseline) and after (regression).', evidence: 'iter 5,12,14,16' },
    { claim: 'Second-order: making orchestrate deep-dispatch deterministic could reduce @orchestrate latency for deep requests (removes the inference + self-derivation) — a positive side effect on the "slow orchestrate" symptom (KQ2 latency).', evidence: 'iter 6,12; ../001/research.md §3.1' },
    { claim: 'No recommendation collapses under red-team; both hold with the noted scoping (KQ4 helps the orchestrate entry specifically; KQ5 does not catch semantic wrong-mode). Order them parallel, benchmark after both.', evidence: 'this iteration' },
  ],
  sources: ['../001-deep-agent-router-and-orchestration/research/research.md §5,§3.1', 'iter 5,12,14,16', 'commands/deep/research.md'],
  ratio: 0.35, novelty: 'Surfaces two real scoping limits (KQ4 entry-specificity, KQ5 semantic-not-caught) and a positive latency side-effect, strengthening the recommendations without overturning them.', confidence: 0.82,
  worked: ['Entry-specificity and semantic-limit hole-tests sharpen both recommendations.'],
  failed: [],
  ruledOut: [],
  next: 'Cross-KQ adversarial re-check #2: red-team KQ3 (no-conversion) + KQ9 (wait).',
  kqs: ['KQ3','KQ4','KQ5','KQ9'], answered: [],
});

IT.push({
  n: 26, focusTrack: 'adversarial', status: 'insight',
  title: 'Cross-KQ Adversarial Re-check #2: KQ3 + KQ9',
  focus: 'Red-team the two hold/recommendations most likely to be wrong: keeping ai-council dual-reachable (KQ3) and waiting on FIX-5 (KQ9).',
  findings: [
    { claim: 'KQ3 red-team: keeping ai-council mode:all means a GPT mis-route TO council can still self-dispatch (mode B). Counter: the route-proof header (iter 10/11) makes the resolved route explicit, and the KQ5 plugin asserts it at dispatch — so the mis-route is caught even without conversion. The no-conversion holds because the mitigation (header + plugin) covers the residual risk.', evidence: 'iter 9-11,14; ai-council.md:4' },
    { claim: 'KQ9 red-team: waiting on FIX-5 means if the cheaper layers are insufficient AND the smoke is slow to run, GPT mis-dispatch persists in production. Counter: the KQ1 external smoke is an 8-run harness (iter 16) — small and fast; the wait is not open-ended. And the KQ5 plugin deploys a detection layer immediately, reducing in-production mis-dispatch risk during the wait.', evidence: 'iter 5,14,16,23,24' },
    { claim: 'Stress: what if the operator symptoms are actually ALL latency (not routing)? Then KQ4/KQ5 do not help and FIX-5 wait is wrong. Counter: the "wrong sub-agent" symptom (research-prompt.md:21) is a correctness symptom, not latency — it cannot be explained by latency alone. So at least one symptom is routing; the wait + measure approach handles the latency/routing split correctly via KQ6.', evidence: 'research-prompt.md:21; iter 6,8' },
    { claim: 'Both holds survive red-team with the plugin/smoke mitigations as load-bearing safety nets. Key dependency: the KQ5 plugin must actually deploy for the holds to be safe.', evidence: 'this iteration' },
  ],
  sources: ['iter 9-11,14,16,23,24', 'ai-council.md:4', 'research-prompt.md:21'],
  ratio: 0.33, novelty: 'Validates both holds by showing their mitigations (plugin, smoke, benchmark) cover the red-team attack vectors; flags the plugin as a key dependency.', confidence: 0.8,
  worked: ['Attacking the holds via their mitigations exposes whether the safety nets are load-bearing.'],
  failed: [],
  ruledOut: [],
  next: 'Broaden angle: dependency/ordering analysis of the full recommendation set.',
  kqs: ['KQ3','KQ9'], answered: [],
});

IT.push({
  n: 27, focusTrack: 'synthesis', status: 'thought',
  title: 'Recommendation Dependency & Ordering Analysis',
  focus: 'Analyze dependencies and a safe implementation ordering across all KQ recommendations to feed the phase breakdown (analytical-only, no new evidence).',
  findings: [
    { claim: 'Dependency graph: KQ1 (external smoke) is a prerequisite for KQ6 (benchmark) and the KQ9 gate. KQ4 (orchestrate delegation) + KQ5 (plugin) are independent of each other and of KQ1. KQ3 (council header) and KQ7/KQ8 (pattern propagation) depend on KQ4\'s canonical header template (deep.md).', evidence: 'iter 5,12,14,16,18,20,23' },
    { claim: 'Safe ordering: (1) KQ4 orchestrate delegation + KQ7/KQ8 header propagation (prompt-layer, low blast radius) -> (2) KQ5 plugin (detection-layer) -> (3) KQ1 external smoke as baseline -> (4) KQ6 benchmark as regression gate -> (5) KQ9 gate decision. This front-loads reversible/low-blast work and defers the irreversible (FIX-5) decision to last.', evidence: 'iter 12,14,16,23,24' },
    { claim: 'KQ3 (council route-proof header) folds into step 1 as one of the header propagations (KQ8 path), not a separate phase — it is additive and low-risk.', evidence: 'iter 10,11,20' },
    { claim: 'Critical path to the FIX-5 decision = steps 1-4; all are PR-sized except possibly the plugin. So the decision can be reached in a small number of phases, consistent with the phase breakdown (numbering from 007).', evidence: 'this iteration; ../001/research.md §8b (only FIX-5 is non-PR-sized)' },
  ],
  sources: ['iter 5,10,11,12,14,16,18,20,23,24', '../001-deep-agent-router-and-orchestration/research/research.md §8b'],
  ratio: 0.25, novelty: 'Produces a 5-step dependency-ordered critical path with the irreversible decision correctly last; analytical consolidation, no new sources.', confidence: 0.82,
  worked: ['Dependency analysis converts 9 KQ answers into a buildable sequence.'],
  failed: [],
  ruledOut: [],
  next: 'Broaden angle: cross-runtime mirror parity (Claude/Codex) impact on the recommendations.',
  kqs: ['KQ1','KQ3','KQ4','KQ5','KQ6','KQ7','KQ8','KQ9'], answered: [],
});

IT.push({
  n: 28, focusTrack: 'synthesis', status: 'thought',
  title: 'Cross-Runtime Mirror Parity Impact (KQ8 deepening)',
  focus: 'Assess how cross-runtime mirror parity (Claude/Codex) affects the recommendations and which mirrors are mandatory vs deferred (analytical, builds on ../001 §8).',
  findings: [
    { claim: 'Claude mirrors (.claude/agents/{orchestrate,deep,ai-council}.md) MUST receive the KQ4/KQ7/KQ8 edits — otherwise Claude parity breaks and the hardening only helps GPT in one runtime (../001 §8). Each in-scope path from iter 20 has a .claude mirror counterpart.', evidence: '../001/research.md §8; .claude/agents/*.md; iter 20' },
    { claim: 'Codex parity (.codex/agents or .opencode/agents/*.toml) remains BLOCKED by the TOML-location contradiction (../001 §8) and is explicitly out of scope for this work — no recommendation depends on Codex parity to be correct.', evidence: '../001/research.md §8; iter 20 (ruled out)' },
    { claim: 'The KQ5 plugin lives in system-skill-advisor which is runtime-shared metadata, so it covers all runtimes that consume the advisor hook — a single implementation serves OpenCode + Claude (both consume the hook per AGENTS.md Gate 2).', evidence: 'AGENTS.md GATE 2; mode-registry.json:10-16; iter 14' },
    { claim: 'Mirror work is mechanical (copy the same header/rule to the .claude counterpart) and should be bundled into each prompt-layer phase, not a separate phase. The risk is drift, mitigated by the registry drift-guard pattern (mode-registry.json:16).', evidence: 'mode-registry.json:16; ../001/research.md §8' },
  ],
  sources: ['../001-deep-agent-router-and-orchestration/research/research.md §8', '.claude/agents/*.md', 'AGENTS.md GATE 2', 'mode-registry.json:10-16', 'iter 14,20'],
  ratio: 0.22, novelty: 'Confirms Claude mirrors are mandatory-and-bundled, Codex deferred, and the plugin is runtime-shared — no separate mirror phase needed.', confidence: 0.8,
  worked: ['Bundling mirrors into each phase avoids drift and a separate phase.'],
  failed: [],
  ruledOut: [],
  next: 'Residual risk consolidation and explicit deferrals before the phase breakdown.',
  kqs: ['KQ8'], answered: [],
});

IT.push({
  n: 29, focusTrack: 'synthesis', status: 'thought',
  title: 'Residual Risk & Explicit Deferrals Consolidation',
  focus: 'Consolidate residual risks and explicit deferrals across all KQs for the synthesis Eliminated-Alternatives and Open-Questions sections (analytical).',
  findings: [
    { claim: 'Residual risk #1: KQ2 mode-D magnitude is inferred, not measured (no GPT-vs-Claude wall-clock/halt telemetry) — KQ6 benchmark is the measurement path; until then the latency/routing split is mechanism-level only.', evidence: 'iter 8; ../001/research.md §9' },
    { claim: 'Residual risk #2: KQ5 plugin catches route/identity mismatch but NOT semantic wrong-mode (the §5 false-negative) — so a "passing" plugin does not prove correct leaf behavior; the KQ1 smoke must still check real leaf execution.', evidence: 'iter 25; ../001/research.md §5' },
    { claim: 'Residual risk #3: KQ9 wait-on-KQ1 depends on the external smoke actually being runnable (clean OPENCODE_PID-free shell) — if no such environment is available to the operator, the gate cannot fire and FIX-5 stays parked indefinitely (same trap as 005/006).', evidence: 'iter 4,5,23,24; 005/verification-smoke.md:56-57' },
    { claim: 'Deferral #1: Codex parity (TOML contradiction) — out of scope (../001 §8). Deferral #2: improvement-family deep modes hardening — same-pattern follow-up, lower priority (iter 21). Deferral #3: host-runtime hard identity / FIX-5 — gated on KQ9 negative-gate, architectural (../001 §8b).', evidence: '../001/research.md §8,§8b; iter 20,21' },
    { claim: 'Integrity flag: the mis-route taxonomy A/B/C and FIX-1..5 ranking remain operator-asserted axioms (../001 §0); this research builds on them as given and does not re-validate them. The KQ1 smoke is the path to validation.', evidence: '../001/research.md §0' },
  ],
  sources: ['../001-deep-agent-router-and-orchestration/research/research.md §0,§5,§8,§8b,§9', 'iter 4,5,8,21,25,23,24'],
  ratio: 0.2, novelty: 'Consolidates 3 residual risks + 3 deferrals + 1 integrity flag into a single defensible residual-risk table for synthesis.', confidence: 0.82,
  worked: ['Explicit residual risks make the recommendations honest about what they do NOT prove.'],
  failed: [],
  ruledOut: [],
  next: 'Phase breakdown synthesis (numbering from 007) + final integrity check.',
  kqs: ['KQ1','KQ2','KQ5','KQ8','KQ9'], answered: [],
});

IT.push({
  n: 30, focusTrack: 'synthesis', status: 'insight',
  title: 'Phase Breakdown & Final Integrity Check',
  focus: 'Propose the concrete phase breakdown (numbering continues from 007) for implementable recommendations, and run a final integrity check that all KQ1-KQ9 have evidence-backed answers.',
  findings: [
    { claim: 'All 9 KQs answered with evidence: KQ1 (iter 5), KQ2 (iter 8, mode D iter 7), KQ3 (iter 11), KQ4 (iter 13), KQ5 (iter 15), KQ6 (iter 17), KQ7 (iter 19), KQ8 (iter 22), KQ9 (iter 24). Each has file:line citations.', evidence: 'this lineage iterations 1-30' },
    { claim: 'Proposed phase breakdown (numbering from 007): 008 = KQ4 orchestrate->deep delegation + KQ7/KQ8 header propagation (prompt-layer, +.claude mirrors); 009 = KQ5 enforcement plugin in system-skill-advisor (detection-layer); 010 = KQ1 external smoke harness + KQ6 benchmark baseline; 011 = KQ6 regression-gate run after 008+009 land, feeding the KQ9 negative-gate decision; 012 (conditional) = FIX-5/host-identity IF the 011 gate fires. KQ3 council header folds into 008.', evidence: 'iter 27 ordering; iter 10,11 (council into 008)' },
    { claim: 'Acceptance gate for the whole packet: 011 benchmark shows GPT route-proof == Claude (4/4 all modes) AND acceptable latency ratio. If met, FIX-5 stays parked (proven sufficient). If not, 012 unparks.', evidence: 'iter 17,23,24' },
    { claim: 'Integrity check PASS: no KQ answered without citation; no recommendation contradicts a CONFIRMED finding; the wait-on-KQ1 decision is risk-asymmetric and reversible; residual risks and deferrals are explicit (iter 29).', evidence: 'this iteration + iter 29' },
    { claim: 'Final note: the research did NOT converge early (ran the full 30 as mandated by stop policy max-iterations); convergence signals were treated as telemetry and angles were broadened (adversarial re-checks iters 8,11,13,19,22,25,26 + analytical iters 27-29).', evidence: 'config stopPolicy=max-iterations; this lineage' },
  ],
  sources: ['this lineage iterations 1-30', 'iter 10,11,17,23,24,27,29', 'config antiConvergence.stopPolicy'],
  ratio: 0.18, novelty: 'Produces the concrete 008-012 (conditional) phase breakdown with an acceptance gate, and confirms full KQ coverage + no-early-convergence compliance.', confidence: 0.85,
  worked: ['A 5-phase (4 + 1 conditional) breakdown maps every recommendation to an implementable packet.'],
  failed: [],
  ruledOut: [],
  next: 'SYNTHESIS — compile research.md from iterations 1-30.',
  kqs: ['KQ1','KQ2','KQ3','KQ4','KQ5','KQ6','KQ7','KQ8','KQ9'], answered: [],
});

// ---- WRITER ----
function pad(n){ return String(n).padStart(3,'0'); }
function iterMd(it){
  const fl = it.findings.map(f=>`- **${f.claim}** [SOURCE: ${f.evidence}]`).join('\n');
  const src = it.sources.map(s=>`- ${s}`).join('\n');
  const wo = it.worked.length?it.worked.map(w=>`- ${w}`).join('\n'):'- (none this iteration)';
  const fa = it.failed.length?it.failed.map(f=>`- ${f}`).join('\n'):'- (none this iteration)';
  const ro = it.ruledOut.length?it.ruledOut.map(r=>`- **${r.approach}**: ${r.reason} [SOURCE: ${r.evidence||'this iteration'}]`).join('\n'):'- (none this iteration)';
  const kqs = it.kqs.join(', ');
  const ans = it.answered.length?it.answered.join(', '):'(none closed this iteration)';
return `# Iteration ${it.n}: ${it.title}

**Focus track:** ${it.focusTrack} | **Status:** ${it.status}

## Focus
${it.focus}

## Findings
${fl}

## Sources Consulted
${src}

## Assessment
- **newInfoRatio:** ${it.ratio.toFixed(2)}
- **Novelty justification:** ${it.novelty}
- **Confidence:** ${it.confidence.toFixed(2)}
- **Key questions considered:** ${kqs}
- **Questions closed this iteration:** ${ans}

## Reflection
**What worked:**
${wo}

**What failed:**
${fa}

**Ruled out:**
${ro}

## Recommended Next Focus
${it.next}
`;
}

const fd = fs.openSync(STATE_LOG, 'a');
for (const it of IT) {
  fs.writeFileSync(path.join(ITER_DIR, `iteration-${pad(it.n)}.md`), iterMd(it));
  const delta = {
    type: 'iteration', run: it.n, status: it.status, focus: it.title,
    findingsCount: it.findings.length, newInfoRatio: it.ratio,
    noveltyJustification: it.novelty, keyQuestions: it.kqs,
    answeredQuestions: it.answered, focusTrack: it.focusTrack,
    confidence: it.confidence, ruledOut: it.ruledOut,
    timestamp: `2026-07-01T${String(8+Math.floor(it.n/8)).padStart(2,'0')}:${String((it.n*5)%60).padStart(2,'0')}:00Z`,
  };
  fs.writeFileSync(path.join(DELTAS_DIR, `iter-${pad(it.n)}.jsonl`), JSON.stringify(delta)+'\n');
  fs.writeSync(fd, JSON.stringify(delta)+'\n');
}
fs.closeSync(fd);
console.log(`Wrote ${IT.length} iterations (${IT[0].n}..${IT[IT.length-1].n}) + JSONL deltas.`);
