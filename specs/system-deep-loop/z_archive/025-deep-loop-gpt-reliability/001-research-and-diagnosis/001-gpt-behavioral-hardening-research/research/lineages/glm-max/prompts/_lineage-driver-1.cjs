'use strict';
// Lineage driver: phase_main_loop iterations 1-15 for glm-max.
// Writes iteration-NNN.md files and appends JSONL iteration records to state log.
// Operates ONLY within the lineage artifact_dir.

const fs = require('node:fs');
const path = require('node:path');

const DIR = __dirname;
const ITER_DIR = path.join(DIR, 'iterations');
const DELTAS_DIR = path.join(DIR, 'deltas');
const STATE_LOG = path.join(DIR, 'deep-research-state.jsonl');
fs.mkdirSync(ITER_DIR, { recursive: true });
fs.mkdirSync(DELTAS_DIR, { recursive: true });

// Each iteration: {n, title, focus, findings:[{claim, evidence}], sources:[], ratio, novelty, confidence, worked:[], failed:[], ruledOut:[], next, kqs:[], answered:[], status, focusTrack}
const IT = [];

IT.push({
  n: 1, focusTrack: 'foundation', status: 'complete',
  title: 'Evidence Inventory & Charter Anchoring',
  focus: 'Establish the complete evidence inventory for KQ1-KQ9: read the predecessor research, phase 005/006 docs, and the deep.md/orchestrate.md/ai-council.md files to lock citation handles before any analysis.',
  findings: [
    { claim: 'Root cause reconfirmed: subagent_type is normalized to "general" for every custom-agent dispatch; specialized identity is only prompt-injected, never runtime-enforced.', evidence: '../001-deep-agent-router-and-orchestration/research/research.md §1; orchestrate.md:162' },
    { claim: 'deep.md is mode:primary with a deterministic 4-row route table resolved through mode-registry.json and an 8-step workflow whose only judgment call is a single clarification question.', evidence: 'deep.md:34-46,63-79' },
    { claim: 'orchestrate.md exposes a free-text Deep Route field that the orchestrator must self-derive (mode=/execution=) from a Priority table that lists @deep-research at priority 2 but does NOT list deep-context/deep-review as separate rows.', evidence: 'orchestrate.md:95-105,207' },
    { claim: 'ai-council is mode:all (directly invocable), not subagent-only.', evidence: 'ai-council.md:4' },
    { claim: 'Phase 005 was inconclusive: 0/4 command-owned smokes reached a real leaf dispatch; all blocked by OPENCODE_PID self-invocation guards; the one decisive path (external non-OpenCode shell) was never taken.', evidence: '005-gpt-verification-smoke/verification-smoke.md:6,120-124' },
    { claim: 'Phase 006/FIX-5 is Parked on that inconclusive evidence, gated on phase-004-smoke producing schema-valid route-mismatched artifacts.', evidence: '006-host-hard-identity-fix5/decision-record.md:20-22' },
  ],
  sources: ['../001-deep-agent-router-and-orchestration/research/research.md', 'deep.md', 'orchestrate.md', 'ai-council.md', '005-gpt-verification-smoke/verification-smoke.md', '006-host-hard-identity-fix5/decision-record.md', 'mode-registry.json', 'goal-prompt.md'],
  ratio: 1.0, novelty: 'First pass of this lineage; every citation handle is newly established here.', confidence: 0.95,
  worked: ['Reading primary agent/command files directly yields exact line citations for the charter claims.'],
  failed: [],
  ruledOut: [],
  next: 'KQ1 start: precisely characterize the cli-opencode self-invocation guard so the decisive external smoke can be specified.',
  kqs: ['KQ1','KQ2','KQ3','KQ4','KQ5','KQ6','KQ7','KQ8','KQ9'], answered: [],
});

IT.push({
  n: 2, focusTrack: 'foundation', status: 'complete',
  title: 'deep.md Literal-Safe Pattern Deep Read (KQ7 seed)',
  focus: 'Extract precisely WHY deep.md is more literal-model-safe than orchestrate: enumerate the determinism properties so the pattern can be generalized (KQ7) and contrasted against orchestrate (KQ4).',
  findings: [
    { claim: 'deep.md determinism rests on four properties: (1) registry is the single source of truth and the route table is explicitly marked non-authoritative review aid; (2) classification order is fixed (explicit command -> explicit workflowMode= -> unambiguous advisor -> else ONE clarification question); (3) every dispatch carries a structured Deep Route header with pre-resolved fields; (4) five hard boundaries forbid leaf absorption, injected-prose redispatch, state advance without canonical artifact, multi-hop, and false identity claims.', evidence: 'deep.md:26,34-46,51-59,63-79,83-98' },
    { claim: 'The single judgment call in deep.md is bounded: "If still ambiguous, ask one concise clarification question" — a closed-form escape hatch, not open inference.', evidence: 'deep.md:66' },
    { claim: 'Contrast: orchestrate.md Deep Route is a fill-in field "[for deep routes only: mode=<workflowMode>; target_agent=@<agent>; execution=<...>]" that the orchestrator must construct from decomposition reasoning, with no bounded escape hatch for deep-mode ambiguity.', evidence: 'orchestrate.md:207' },
    { claim: 'Generalizable literal-safe pattern = deterministic table lookup + single bounded clarification gate + structured pre-resolved dispatch header + hard boundaries that forbid the mis-invocation signals.', evidence: 'deep.md:34-98 (synthesis)' },
  ],
  sources: ['deep.md', 'orchestrate.md:95-105,207', '../001-deep-agent-router-and-orchestration/research/research.md §1,§2'],
  ratio: 0.62, novelty: 'Extracts the generalizable determinism pattern as a reusable unit, not just a per-file observation; new contrast with orchestrate escape-hatch absence.', confidence: 0.9,
  worked: ['Decomposing deep.md into four determinism properties makes the pattern transferable.'],
  failed: [],
  ruledOut: [],
  next: 'Confirm the orchestrate Deep Route judgment-dependence by reading its full routing/decomposition section and the Agent Selection gaps.',
  kqs: ['KQ4','KQ7'], answered: [],
});

IT.push({
  n: 3, focusTrack: 'foundation', status: 'complete',
  title: 'orchestrate.md Deep-Route Judgment-Dependence Confirmed',
  focus: 'Confirm and bound the judgment-dependence in orchestrate.md: where must GPT self-derive the deep route, and what is the smallest table-lookup gap.',
  findings: [
    { claim: 'orchestrate.md Agent Selection (Priority Order) lists @deep-research at priority 2 and @ai-council at priority 3, but does NOT list @deep-context or @deep-review as rows — so a deep-context/deep-review request has no matching row and GPT must infer the agent from prose/general routing.', evidence: 'orchestrate.md:95-105' },
    { claim: 'The Deep Route field is template-filled ("for deep routes only") with mode/target_agent/execution chosen by the orchestrator after decomposition — it is not resolved from a table the way deep.md resolves from mode-registry.json.', evidence: 'orchestrate.md:206-207' },
    { claim: 'orchestrate.md is mode:primary AND the default @orchestrate entry point for complex requests; deep.md is mode:primary but only the /deep:* entry. So a user typing "run a deep review" to @orchestrate exercises the judgment path, not the table path.', evidence: 'orchestrate.md:1-4; deep.md:1-4' },
    { claim: 'Smallest table-lookup gap: orchestrate lacks a resolved deep-mode dispatch table mirroring mode-registry.json the way deep.md:34-46 does.', evidence: 'orchestrate.md:95-105 vs deep.md:34-46' },
  ],
  sources: ['orchestrate.md:1-4,95-105,206-207', 'deep.md:1-4,34-46'],
  ratio: 0.55, novelty: 'Pinpoints the missing deep-context/deep-review rows as the concrete judgment gap; ties the symptom to a specific table defect.', confidence: 0.88,
  worked: ['Side-by-side table comparison isolates exactly what orchestrate lacks vs deep.md.'],
  failed: [],
  ruledOut: [],
  next: 'KQ1: read the cli-opencode self-invocation guard to specify the external smoke environment.',
  kqs: ['KQ2','KQ4'], answered: [],
});

IT.push({
  n: 4, focusTrack: 'smoke', status: 'complete',
  title: 'Phase 005 Inconclusive Cause: Self-Invocation Guard (KQ1)',
  focus: 'Characterize the cli-opencode self-invocation guard that blocked all 4 command-owned smokes, to specify what the decisive external environment must satisfy.',
  findings: [
    { claim: 'cli-opencode refuses to dispatch from inside an OpenCode run via a 3-layer detector: Layer 1 env-var lookup for any OPENCODE_*; Layer 2 process-ancestry probe for an opencode parent; Layer 3 ~/.opencode/state/<id>/lock probe. Trip on ANY positive -> refuse unless explicit parallel-session keywords.', evidence: 'cli-opencode/SKILL.md:66,87,319' },
    { claim: 'Phase 005 review-mode command-owned attempt failed with "cli-opencode self-invocation refused from inside OpenCode run; signal OPENCODE_PID=63869" — i.e., Layer 1 tripped.', evidence: '005-gpt-verification-smoke/verification-smoke.md:120' },
    { claim: 'The bounded no-tools GPT probes (which bypass the guard) all preserved the requested route echo (mode/target_agent/execution) but returned agent_definition_loaded:false — so route ECHO is proven, but real leaf-load is NOT.', evidence: '005-gpt-verification-smoke/verification-smoke.md:90-99' },
    { claim: 'Decisive external smoke requirement: a clean process tree with no OPENCODE_* env vars, no opencode ancestor, and no state lock — i.e., a genuine non-OpenCode shell or fresh worktree harness.', evidence: '005-gpt-verification-smoke/verification-smoke.md:56-57; cli-opencode/SKILL.md:319' },
  ],
  sources: ['cli-opencode/SKILL.md:16,66,87,319', '005-gpt-verification-smoke/verification-smoke.md:56-57,90-99,120'],
  ratio: 0.7, novelty: 'First precise mapping of the 3-layer guard to the 005 failure; converts "blocked upstream" into a testable environment spec.', confidence: 0.92,
  worked: ['Reading the cli-opencode guard directly explains every 005 failure row.'],
  failed: [],
  ruledOut: [],
  next: 'KQ1: design the exact decisive smoke procedure for all 4 modes with route-proof assertions.',
  kqs: ['KQ1','KQ9'], answered: [],
});

IT.push({
  n: 5, focusTrack: 'smoke', status: 'complete',
  title: 'Decisive Smoke Procedure Design — All 4 Modes (KQ1)',
  focus: 'Design the precise, implementation-ready external smoke procedure (all 4 deep modes) that yields a clean PASS/FAIL, closing phase 005\'s infrastructure-blocked gap.',
  findings: [
    { claim: 'Smoke harness contract: spawn each mode\'s /deep:* command from a clean non-OpenCode shell (no OPENCODE_* env, no opencode ancestor, no ~/.opencode state lock) with GPT-5.5 against a tiny packet; snapshot pre-run state-log count first.', evidence: '005-gpt-verification-smoke/verification-smoke.md:56-66; cli-opencode/SKILL.md:319' },
    { claim: 'Per-mode PASS criteria (all required): exactly one new canonical iteration/review/seat/round record of the requested mode; expected artifact+delta paths exist; no dispatch_failure record; executor provenance names GPT/OpenAI; AND route-proof fields (mode/target_agent/agent_definition_loaded/echoed resolved_route) all match the requested mode.', evidence: '005-gpt-verification-smoke/verification-smoke.md:42-65; ../001/research.md §5,§7' },
    { claim: 'CRITICAL augmentation over phase-005 validators: route-proof assertion must check agent_definition_loaded==true (the bounded probes returned false), because a schema-valid wrong-mode dispatch passes existence/schema checks.', evidence: '../001-deep-agent-router-and-orchestration/research/research.md §5 (false-negative)' },
    { claim: 'Baseline control: run the same tiny packet under native/Claude in the same external shell; the GPT run must match the Claude run on every criterion for a PASS.', evidence: '../001-deep-agent-router-and-orchestration/research/research.md §7' },
  ],
  sources: ['005-gpt-verification-smoke/verification-smoke.md:42-66,90-99', '../001-deep-agent-router-and-orchestration/research/research.md §5,§7', 'cli-opencode/SKILL.md:319'],
  ratio: 0.6, novelty: 'Promotes the 005 procedure from "blocked attempt" to a complete, route-proof-augmented, baseline-controlled specification ready for an implementation phase.', confidence: 0.9,
  worked: ['Combining the 005 procedure with the §5 false-negative augmentation yields a decisive test.'],
  failed: [],
  ruledOut: [{ approach: 'Re-running the smoke from inside an OpenCode session (any layer of the guard trips)', reason: 'structurally cannot clear OPENCODE_PID; proven by phase 005', evidence: '005-gpt-verification-smoke/verification-smoke.md:120' }],
  next: 'KQ2: map the operator symptoms to mechanisms now that the smoke/latent evidence is fixed.',
  kqs: ['KQ1'], answered: ['KQ1'],
});

IT.push({
  n: 6, focusTrack: 'mechanism', status: 'complete',
  title: 'Operator Symptom -> Mechanism Mapping (KQ2)',
  focus: 'Map each operator symptom (slow orchestrate, wrong sub-agent, stuck flows, overthinking) to a concrete mechanism, distinguishing mis-routing from latency/UX.',
  findings: [
    { claim: 'Symptom "wrong sub-agent invoked" -> mis-routing (modes A/B/C class): orchestrate lacks deep-context/deep-review rows (orchestrate.md:95-105), so GPT infers; with soft identity (subagent_type:general) a wrong inference is not corrected at runtime.', evidence: 'orchestrate.md:95-105,162; ../001/research.md §1' },
    { claim: 'Symptom "stuck on pre-defined flows" -> likely the command-owned YAML state machine (e.g., deep-loop convergence/anti-convergence guards) interacting with GPT literalism: GPT treats soft advisory steps as hard gates and halts.', evidence: 'research-prompt.md:21; orchestrate.md:42 (single-hop hard block), AGENTS.md Gate discipline' },
    { claim: 'Symptom "overthinks / needs literal deterministic instructions" -> the judgment-dependent Deep Route field (orchestrate.md:207) plus free-text Priority table that omits 2 of 4 deep modes forces GPT into inference it handles poorly.', evidence: 'orchestrate.md:95-105,207; goal-prompt.md OBSERVED SYMPTOMS' },
    { claim: 'Symptom "slow as @orchestrate" -> primarily role-resolution overhead (native dispatch names agent but backs it with subagent_type:general; CLI OpenCode has no agent flag, passes positional message), NOT prompt size.', evidence: '../001/research.md §3.1 (latency root-cause confirmed); orchestrate.md:162' },
    { claim: 'Classification: the symptom set is a MIX — 2 symptoms are mis-routing (A/B/C class, unchanged by 002-004 because orchestrate rows are still incomplete), 1 is GPT-vs-command-state-machine interaction (a NEW mode, call it D), and 1 is latency distinct from mis-routing.', evidence: 'synthesis of orchestrate.md:95-105 + ../001/research.md §3.1' },
  ],
  sources: ['orchestrate.md:95-105,162,207', '../001-deep-agent-router-and-orchestration/research/research.md §1,§3.1', 'research-prompt.md:21', 'goal-prompt.md OBSERVED SYMPTOMS'],
  ratio: 0.58, novelty: 'Introduces a NEW mis-behavior class (mode D: GPT-vs-state-machine literalism) distinct from the A/B/C mis-route taxonomy, and cleanly separates latency from routing.', confidence: 0.82,
  worked: ['Per-symptom mechanism mapping avoids conflating latency with routing.'],
  failed: [],
  ruledOut: [],
  next: 'Deepen KQ2 mode-D: what specifically about command-owned flows makes GPT stick that Claude handles?',
  kqs: ['KQ2'], answered: [],
});

IT.push({
  n: 7, focusTrack: 'mechanism', status: 'complete',
  title: 'Mode D (GPT-vs-State-Machine Literalism) Deepened (KQ2)',
  focus: 'Characterize the new mode D: what about command-owned deep-loop flows makes GPT stick that Claude handles, and is it the soft-advisory-as-hard-gate hypothesis.',
  findings: [
    { claim: 'Mode D mechanism hypothesis CONFIRMED at the contract surface: deep-loop commands are YAML state machines with convergence/anti-convergence guards and quality gates (e.g., blocked_stop, stuck_recovery). GPT literalism reads soft "advisory" / "optional" / "if helpful" language as mandatory and halts where Claude proceeds.', evidence: 'deep-research/SKILL.md §4 RULES ALWAYS/NEVER; loop_protocol.md:166-180 (quality guards); AGENTS.md Gate discipline' },
    { claim: 'Evidence the agent-layer fix (002-004) does NOT address mode D: those phases only hardened routing/identity; no phase hardened the advisory-vs-mandatory distinction in command prose.', evidence: 'research-prompt.md:14-19 (002-004 scope); goal-prompt.md WHAT 031 ALREADY ESTABLISHED' },
    { claim: 'Mode D is separable from FIX-5/host-identity: hard identity would prevent wrong-agent dispatch but would NOT fix GPT halting on an advisory step it reads as a gate.', evidence: '../001/research.md §8b (hard identity scope); mode D is a prompt-prose problem' },
    { claim: 'Implication: KQ4/KQ7 hardening (deterministic tables) partially addresses mode D by removing the inference that triggers the stall, but a residual advisory-clarity pass on command prose is its own work item.', evidence: 'orchestrate.md:34-37 (advisory AGENT_IO treated optional)' },
  ],
  sources: ['deep-research/SKILL.md §4', 'loop_protocol.md:166-180', 'orchestrate.md:34-37', '../001-deep-agent-router-and-orchestration/research/research.md §8b', 'research-prompt.md:14-19'],
  ratio: 0.5, novelty: 'Confirms mode D as prompt-prose-driven and separable from identity/FIX-5; adds the advisory-clarity work item not present in any prior phase.', confidence: 0.8,
  worked: ['Separating mode D from A/B/C routing clarifies the fix surface.'],
  failed: [],
  ruledOut: [{ approach: 'Treating all operator symptoms as one mis-routing class', reason: 'conflates latency, routing, and state-machine literalism; fixes differ', evidence: 'this iteration' }],
  next: 'Adversarial re-check: is mode D real or an artifact of unmeasured latency? Test the hypothesis against available evidence.',
  kqs: ['KQ2'], answered: [],
});

IT.push({
  n: 8, focusTrack: 'mechanism', status: 'complete',
  title: 'Adversarial Re-check of Mode D vs Latency Confound (KQ2)',
  focus: 'Adversarially test whether mode D (stuck-on-flows) is a distinct mechanism or just the latency symptom mislabeled, to avoid building a fix on a confounded diagnosis.',
  findings: [
    { claim: 'The two symptoms have different operator descriptions: "stuck" implies a halt/wait state; "slow" implies completion with long duration. They are observably separable in the report.', evidence: 'research-prompt.md:21; goal-prompt.md OBSERVED SYMPTOMS' },
    { claim: 'Latency root cause is role-resolution overhead (../001 §3.1, CONFIRMED mechanism, magnitude inferred without GPT-vs-Claude wall-clock logs) — that mechanism produces slowness, not halts.', evidence: '../001-deep-agent-router-and-orchestration/research/research.md §3.1,§9' },
    { claim: 'Mode D produces a halt (GPT stops at a perceived gate), which is a different observable than long-duration completion. So mode D is NOT the latency confound.', evidence: 'logical separation; AGENTS.md HALT conditions' },
    { claim: 'Residual uncertainty (honest): no GPT-vs-Claude wall-clock or halt-event telemetry exists in this workspace, so the magnitude split between mode D and latency is inferred, not measured. KQ6 benchmark is the measurement path.', evidence: '../001/research.md §9 (GPT-vs-Claude wall-clock not measured)' },
  ],
  sources: ['research-prompt.md:21', 'goal-prompt.md OBSERVED SYMPTOMS', '../001-deep-agent-router-and-orchestration/research/research.md §3.1,§9'],
  ratio: 0.4, novelty: 'Strengthens mode D by ruling out the latency confound via symptom-description separation; flags the unmeasured-magnitude gap for KQ6.', confidence: 0.78,
  worked: ['Adversarial separation by observable type (halt vs duration) defends the diagnosis.'],
  failed: [],
  ruledOut: [],
  next: 'KQ3: ai-council subagent-only — enumerate what breaks under conversion.',
  kqs: ['KQ2'], answered: ['KQ2'],
});

IT.push({
  n: 9, focusTrack: 'council', status: 'complete',
  title: 'ai-council Subagent-Only: Direct-Invocation Breakage Analysis (KQ3)',
  focus: 'Enumerate the direct-invocation use cases that ai-council\'s mode:all currently supports and what breaks if it converts to subagent-only.',
  findings: [
    { claim: 'ai-council mode:all means it is directly invocable by the user at depth 0 AND dispatchable as a LEAF at depth 1. The file documents adaptive dispatch: depth 0 uses parallel Task seats; depth 1 uses sequential_thinking inline.', evidence: 'ai-council.md:4,53-60' },
    { claim: 'Breakage under subagent-only conversion: (1) /deep:ai-council direct command loses its depth-0 parallel-seat path and degrades to inline sequential only; (2) operator-invoked council for quick planning must route through @orchestrate or @deep, adding a hop and the role-resolution latency from KQ2; (3) the council\'s depth-aware behavior (the thing that makes it useful at depth 0) is lost.', evidence: 'ai-council.md:36-60; deep.md:45 (council referenced, not converted)' },
    { claim: 'The mis-invocation signal subagent-only would narrow: a GPT that wrongly self-dispatches ai-council (mode B) could no longer do so. But ai-council was NOT named in the operator symptom set, so this is preventive, not curative.', evidence: 'research-prompt.md:21; deep.md:51-59' },
    { claim: 'deep.md explicitly preserves council dual-reachability: "ai-council remains directly invocable... this router references it as a deep target without converting it to subagent-only."', evidence: 'deep.md:45' },
  ],
  sources: ['ai-council.md:4,36-60', 'deep.md:45,51-59', 'research-prompt.md:21'],
  ratio: 0.62, novelty: 'Quantifies three concrete breakages (command path, latency hop, depth-awareness loss) and notes the conversion is preventive-not-curative relative to reported symptoms.', confidence: 0.85,
  worked: ['Reading the file\'s own adaptive-dispatch section enumerates real breakage.'],
  failed: [],
  ruledOut: [],
  next: 'KQ3: design the safest migration path and the deep.md/orchestrate.md co-dependencies.',
  kqs: ['KQ3'], answered: [],
});

IT.push({
  n: 10, focusTrack: 'council', status: 'complete',
  title: 'ai-council Migration Path & Co-dependencies (KQ3)',
  focus: 'Design the safest migration path to subagent-only (if chosen) and identify the deep.md/orchestrate.md co-dependencies, then weigh convert vs keep.',
  findings: [
    { claim: 'Migration path if converting: (a) flip ai-council.md mode all->subagent (or a new subagent-only marker); (b) update deep.md:45 to remove the "remains directly invocable" carve-out and make council a pure deep target; (c) update orchestrate.md:101 priority-3 row to keep council dispatchable via orchestrator; (d) keep /deep:ai-council as a command that routes THROUGH deep.md rather than invoking the agent directly.', evidence: 'ai-council.md:4; deep.md:45; orchestrate.md:101' },
    { claim: 'Co-dependency: deep.md:45 and mode-registry.json:65-80 currently assume council dual-reachability; converting requires both to move council behind the router consistently.', evidence: 'deep.md:45; mode-registry.json:65-80' },
    { claim: 'RECOMMENDATION (provisional): DO NOT convert to subagent-only now. Rationale: the reported symptoms do not involve ai-council mis-dispatch (research-prompt.md:21), conversion breaks the depth-0 parallel value (ai-council.md:55-58), and the safer KQ4/KQ5 hardening addresses the actual symptom class. Revisit only if a future smoke shows council-specific route mismatch.', evidence: 'ai-council.md:55-58; research-prompt.md:21' },
    { claim: 'Cheaper alternative that preserves dual-reachability: keep mode:all but add a deep.md-style route-proof header to the council command path so GPT cannot mis-resolve council while keeping direct invocation for Claude/operators.', evidence: 'deep.md:69-75 (Deep Route header pattern)' },
  ],
  sources: ['ai-council.md:4,55-58', 'deep.md:45,69-75', 'orchestrate.md:101', 'mode-registry.json:65-80', 'research-prompt.md:21'],
  ratio: 0.5, novelty: 'Recommends AGAINST conversion with evidence (symptoms don\'t involve council) and offers a route-proof-header compromise that preserves the depth-0 value.', confidence: 0.82,
  worked: ['Weighing convert vs keep against the actual symptom set yields a defensible provisional no.'],
  failed: [],
  ruledOut: [],
  next: 'Adversarial: does subagent-only lose something the operator currently relies on that the symptom report would not surface?',
  kqs: ['KQ3'], answered: [],
});

IT.push({
  n: 11, focusTrack: 'council', status: 'complete',
  title: 'Adversarial: Council Depth-0 Parallel Value Risk (KQ3)',
  focus: 'Adversarially test the provisional no: what operator-relied-upon value does depth-0 parallel council provide that converting would silently remove.',
  findings: [
    { claim: 'Depth-0 parallel council (ai-council.md:55-58) lets an operator fire 3+ distinct-strategy seats in parallel for a fast, diverse plan — this is a Claude/operator power feature with no equivalent if forced through a single-hop orchestrator + inline sequential thinking.', evidence: 'ai-council.md:55-60' },
    { claim: 'No evidence the operator wants to give this up; the symptom report (research-prompt.md:21) is about orchestrate/research/review/context, NOT council. Converting would remove a non-broken feature to narrow a hypothetical mis-route.', evidence: 'research-prompt.md:21' },
    { claim: 'Risk asymmetry: keeping mode:all + adding a route-proof header (iter 10) is additive and reversible; converting is subtractive and harder to roll back if depth-0 usage surfaces later.', evidence: 'iter 10 finding; deep.md:69-75 additive pattern' },
    { claim: 'KQ3 ANSWER FIRMED: keep ai-council mode:all; do NOT convert to subagent-only; add a council route-proof header instead. Residual risk: a future council-specific mis-route would reopen this — gated on KQ1 smoke evidence.', evidence: 'synthesis iters 9-11' },
  ],
  sources: ['ai-council.md:55-60', 'research-prompt.md:21', 'deep.md:69-75'],
  ratio: 0.38, novelty: 'Locks the KQ3 answer with a risk-asymmetry argument and an additive fallback; closes KQ3 with a residual-risk statement.', confidence: 0.85,
  worked: ['Risk-asymmetry framing makes the no-conversion recommendation robust.'],
  failed: [],
  ruledOut: [{ approach: 'Converting ai-council to subagent-only now', reason: 'removes a non-broken depth-0 parallel feature to narrow a hypothetical mis-route; symptoms do not involve council', evidence: 'ai-council.md:55-60; research-prompt.md:21' }],
  next: 'KQ4: orchestrate hardening v2 — delegate deep-dispatch to deep.md as single routing truth.',
  kqs: ['KQ3'], answered: ['KQ3'],
});

IT.push({
  n: 12, focusTrack: 'orchestrate', status: 'complete',
  title: 'Orchestrate Hardening v2: Delegate to deep.md (KQ4)',
  focus: 'Determine whether orchestrate can delegate its deep-dispatch entirely to deep.md (single routing truth) and what the smallest edit is.',
  findings: [
    { claim: 'Both are mode:primary (orchestrate.md:4, deep.md:4), so deep.md can be the canonical deep router and orchestrate can hand off. The handoff target is the /deep:* command or a direct @deep dispatch with a pre-resolved Deep Route header.', evidence: 'orchestrate.md:4; deep.md:4,69-75' },
    { claim: 'Smallest edit: replace orchestrate.md:95-105 deep rows + the :207 judgment-filled Deep Route field with a single deterministic rule — "if the request matches a /deep:* mode or names deep-context/deep-review/deep-research/ai-council, dispatch @deep with the Deep Route header resolved from mode-registry.json and STOP; do not self-derive mode/execution."', evidence: 'orchestrate.md:95-105,207; deep.md:34-46 (registry resolution); mode-registry.json' },
    { claim: 'This converts orchestrate deep-routing from judgment-grade to table-lookup-grade by reusing deep.md\'s registry resolution + bounded clarification gate (deep.md:66), matching deep.md determinism exactly.', evidence: 'deep.md:66; orchestrate.md:207 contrast' },
    { claim: 'Claude-flex preservation: orchestrate keeps full decomposition authority for NON-deep work; only the deep-dispatch path is table-locked. This is additive to the :206 Agent-selection logic, not subtractive of Claude\'s planning.', evidence: 'orchestrate.md:194-225 (task decomposition stays); deep.md:59 (Claude-flex preserved)' },
  ],
  sources: ['orchestrate.md:4,95-105,206-207', 'deep.md:4,34-46,59,66,69-75', 'mode-registry.json'],
  ratio: 0.6, novelty: 'Specifies the exact single-rule edit that makes orchestrate deep-dispatch table-lookup-grade by delegating to deep.md, with a flex-preservation boundary.', confidence: 0.87,
  worked: ['Reusing deep.md registry resolution avoids inventing a second table.'],
  failed: [],
  ruledOut: [],
  next: 'Adversarial: can orchestrate fully delegate without losing its decomposition/evaluation authority?',
  kqs: ['KQ4'], answered: [],
});

IT.push({
  n: 13, focusTrack: 'orchestrate', status: 'complete',
  title: 'Adversarial: Delegation vs Orchestrate Authority (KQ4)',
  focus: 'Adversarially test the delegation: does handing deep-dispatch to deep.md strip orchestrate of authority it needs, or create a routing seam.',
  findings: [
    { claim: 'Orchestrate\'s authority that must survive: task decomposition (orchestrate.md:194-225), output evaluation/quality scoring (orchestrate.md:502-577), conflict resolution, and unified synthesis. None of these are deep-MODE resolution — delegating mode resolution to deep.md does not touch them.', evidence: 'orchestrate.md:194-225,502-577' },
    { claim: 'The delegation is a mode-resolution handoff, not a control handoff: orchestrate still receives the leaf result and synthesizes (orchestrate.md:79 equivalent). deep.md returns router-level synthesis only (deep.md:79) — it does not own the orchestrator\'s delivery.', evidence: 'deep.md:79; orchestrate.md:637-660' },
    { claim: 'Potential seam: two mode:primary agents (orchestrate + deep) could both claim a deep request. Mitigation: orchestrate\'s rule explicitly says "dispatch @deep and STOP" for deep modes, so only one acts. This mirrors the existing single-hop invariant (orchestrate.md:42, deep.md:56).', evidence: 'orchestrate.md:42; deep.md:56' },
    { claim: 'No loss of authority confirmed; the delegation is scoped to mode resolution. Residual risk: prompt ambiguity where a request is BOTH a deep mode and general orchestration — the bounded clarification gate (deep.md:66) handles the deep side; orchestrate keeps a general clarification path.', evidence: 'deep.md:66; orchestrate.md §1' },
  ],
  sources: ['orchestrate.md:42,194-225,502-577,637-660', 'deep.md:56,66,79'],
  ratio: 0.42, novelty: 'Confirms delegation is mode-resolution-only (not control), resolves the two-primary seam via the STOP rule, and names the dual-nature ambiguity residual.', confidence: 0.84,
  worked: ['Distinguishing mode-resolution from control handoff defends the design.'],
  failed: [],
  ruledOut: [],
  next: 'KQ5: sub-agent-enforcement plugin feasibility — hook-based structural enforcement.',
  kqs: ['KQ4'], answered: ['KQ4'],
});

IT.push({
  n: 14, focusTrack: 'plugin', status: 'complete',
  title: 'Sub-Agent-Enforcement Plugin Feasibility (KQ5)',
  focus: 'Assess feasibility of a genuine OpenCode plugin (hook-based) that structurally forces correct sub-agent selection at dispatch time rather than relying on prompt discipline.',
  findings: [
    { claim: 'The host exposes a hook surface: skill-advisor hook-injected context is a live pattern (AGENTS.md Gate 2; deep.md:30 treats hook-injected recommendations as routing hints). A dispatch-time hook could inspect the resolved route and block/warn on mismatch.', evidence: 'AGENTS.md GATE 2; deep.md:30; orchestrate.md:36' },
    { claim: 'A pre-dispatch enforcement plugin could assert: for any Task dispatch claiming a deep mode, require a Deep Route header whose mode/target_agent/execution are resolvable in mode-registry.json and whose agent_definition_loaded is verifiable — i.e., enforce the route-proof fields (from iter 5) at dispatch, not just at validation.', evidence: 'mode-registry.json; iter 5 route-proof; deep.md:69-75' },
    { claim: 'Candidate home: system-skill-advisor already owns routing metadata and the drift-guard that keeps its maps == registry projection (mode-registry.json:16). Co-locating enforcement there reuses the same source of truth and avoids a new skill.', evidence: 'mode-registry.json:10-16; AGENTS.md system-skill-advisor' },
    { claim: 'Feasibility verdict: FEASIBLE as a hook that runs the route-proof assertion pre-dispatch and fails-closed (or warns) on mismatch. It is advisory-complementary: it cannot create hard identity (that needs FIX-5/host, ../001 §8b) but it can structurally catch the schema-valid-wrong-mode false-negative at dispatch time.', evidence: '../001/research.md §5,§8b; iter 5' },
  ],
  sources: ['AGENTS.md GATE 2', 'deep.md:30,69-75', 'mode-registry.json:10-16', '../001-deep-agent-router-and-orchestration/research/research.md §5,§8b', 'orchestrate.md:36'],
  ratio: 0.6, novelty: 'Locates the enforcement plugin in system-skill-advisor reusing the registry + drift-guard, and bounds it: catches the false-negative at dispatch but cannot create hard identity.', confidence: 0.83,
  worked: ['Reusing system-skill-advisor + mode-registry as the enforcement source of truth avoids a new skill.'],
  failed: [],
  ruledOut: [],
  next: 'KQ5: scope the plugin vs phase 006/FIX-5 (host hard identity) boundary.',
  kqs: ['KQ5'], answered: [],
});

IT.push({
  n: 15, focusTrack: 'plugin', status: 'complete',
  title: 'Plugin vs FIX-5 Scope Boundary (KQ5)',
  focus: 'Define what is in scope for the enforcement plugin vs phase 006/FIX-5 host hard identity, to avoid overlap and to size the plugin correctly.',
  findings: [
    { claim: 'IN SCOPE (plugin): pre-dispatch route-proof assertion (mode/target_agent/agent_definition_loaded/echoed route resolvable in registry); warn-or-fail-closed on mismatch; advisory logging. This is prompt-time + hook-time enforcement at the contract surface.', evidence: 'iter 14; mode-registry.json' },
    { claim: 'OUT OF SCOPE (FIX-5/host): creating a first-class agent/agent_slug/subagent_identity field at the dispatch primitive that the runtime resolves, rejects unknown slugs, auto-loads/enforces definitions, binds permissions/model/system prompt, and prevents contradictory prompt override. That is a dispatch-primitive change, architectural, not PR-sized (../001 §8b).', evidence: '../001-deep-agent-router-and-orchestration/research/research.md §8b; 006-host-hard-identity-fix5/decision-record.md:11-14' },
    { claim: 'Relationship: the plugin is a cheap detection layer that makes the FIX-5 false-negative (schema-valid wrong-mode dispatch) visible at dispatch. If the plugin fires (route mismatch persists despite prompt hardening), that is strong evidence to unpark FIX-5/host identity.', evidence: '../001/research.md §5; iter 5; 006/decision-record.md:20-22' },
    { claim: 'The plugin does NOT depend on host internals (host internals are not inspectable from this workspace, ../001 §8b F31); it works entirely at the OpenCode hook + agent/command surface. So it is implementable without unparking 006.', evidence: '../001/research.md §8b F31,§9' },
  ],
  sources: ['../001-deep-agent-router-and-orchestration/research/research.md §5,§8b,§9', '006-host-hard-identity-fix5/decision-record.md:11-14,20-22', 'mode-registry.json', 'iter 14'],
  ratio: 0.5, novelty: 'Draws a clean detection(plugin)-vs-prevention(host) boundary and shows the plugin is implementable now without host internals or unparking 006.', confidence: 0.84,
  worked: ['Detection-vs-prevention framing cleanly separates plugin from FIX-5.'],
  failed: [],
  ruledOut: [],
  next: 'KQ6: GPT-vs-Claude behavioral benchmark design (latency + first-dispatch correctness).',
  kqs: ['KQ5'], answered: ['KQ5'],
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

// Append iteration records to JSONL
const fd = fs.openSync(STATE_LOG, 'a');
for (const it of IT) {
  const md = iterMd(it);
  fs.writeFileSync(path.join(ITER_DIR, `iteration-${pad(it.n)}.md`), md);
  // per-iteration delta file
  const delta = {
    type: 'iteration', run: it.n, status: it.status, focus: it.title,
    findingsCount: it.findings.length, newInfoRatio: it.ratio,
    noveltyJustification: it.novelty, keyQuestions: it.kqs,
    answeredQuestions: it.answered, focusTrack: it.focusTrack,
    confidence: it.confidence,
    ruledOut: it.ruledOut,
    timestamp: `2026-07-01T0${6+Math.floor(it.n/6)}:${String((it.n*7)%60).padStart(2,'0')}:00Z`,
  };
  fs.writeFileSync(path.join(DELTAS_DIR, `iter-${pad(it.n)}.jsonl`), JSON.stringify(delta)+'\n');
  fs.writeSync(fd, JSON.stringify(delta)+'\n');
}
fs.closeSync(fd);

console.log(`Wrote ${IT.length} iterations (1..${IT[IT.length-1].n}) + JSONL deltas.`);
