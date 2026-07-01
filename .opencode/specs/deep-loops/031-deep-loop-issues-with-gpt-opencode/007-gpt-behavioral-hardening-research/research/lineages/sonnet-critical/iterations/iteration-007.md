# Iteration 7 — Turning iterations 1-6 into implementation-ready diffs (not diagnostic scaffolding)

**Focus:** KQ-CRIT-8 — the charter demands concrete, implementation-ready improvements this round, not more diagnosis. Convert findings 7 (Mode D), 9-10 (ai-council validator), 12-14 (orchestrate NDP-safe routing) into diff-level specificity, staying within the research non-goal of "design + recommendations, not implementation."

## What was done

No new file reads this iteration — pure synthesis of prior findings into implementation-ready form, per charter §9.3.3: "If the prior round's answer to a KQ was itself already concrete, either sharpen it... Produce concrete, implementation-ready improvements, not more diagnostic scaffolding."

## Deliverable 1 — Mode D fix: replace the Phase 0 self-assessment gate with a deterministic signal (targets Finding 7-8)

Current text (research.md:44-71 and near-identical in the other 7 command files):
```
SELF-CHECK: Are you operating as the @general agent?
├─ INDICATORS that you ARE @general agent:
│   ├─ You can orchestrate the deep-research loop (YAML workflow execution)
│   ├─ You can orchestrate Read/Write/Edit/Bash workflow execution
│   ├─ You can load skill references and execute defined logic
├─ IF YES (all indicators present): → Continue
└─ IF NO or UNCERTAIN: ⛔ HARD BLOCK
```

Proposed replacement pattern (deterministic, no self-classification):
```
DISPATCH-CONTEXT CHECK (deterministic, not a self-assessment):
- This command file is being executed directly (via `/deep:research`, `opencode run --command deep/research`,
  or equivalent primary-agent command execution) — this is the ONLY supported invocation path.
- If you were dispatched via the Task tool BY another agent (i.e., you are a sub-agent receiving this file's
  content as delegated instructions rather than executing it as your own top-level command), STOP: this command
  must be invoked directly, not delegated. Return control to the dispatching agent with:
  STATUS=FAIL ERROR="deep:research must be invoked directly, not via sub-agent delegation"
- Otherwise, proceed — no further self-classification required.
```
Rationale: this replaces a fuzzy multi-bullet self-assessment ("are you operating as X" with judgment-dependent indicators) with a single structural fact the model can observe directly from its own dispatch context (was I invoked as a command, or was I handed this text inside a Task prompt by another agent?) rather than asked to judge. This is the KQ7 literal-safe pattern (deterministic signal, not self-classification) applied to the exact mechanism iteration 3 confirmed already fired against GPT. Apply identically across all 8 `/deep:*` command files (research, review, context, ai-council, skill-benchmark, agent-improvement, model-benchmark, ai-system-improvement) — this is a propagation-scope addition to KQ8 beyond what either prior lineage's list included.

## Deliverable 2 — ai-council route-proof validator fix (targets Finding 9-11)

`.opencode/commands/deep/assets/deep_ai-council_auto.yaml:132-136`, current:
```yaml
route_proof:
  mode: council
  target_agent: deep-ai-council
  agent_definition_loaded: true
  resolved_route: "Resolved route: mode=council target_agent=deep-ai-council"
```
Proposed replacement (mirror the emitter block at :117-118 exactly, do not invent new values):
```yaml
route_proof:
  mode: ai-council
  target_agent: "@ai-council"
  agent_definition_loaded: true
  resolved_route: "Resolved route: mode=ai-council; target_agent=@ai-council; execution=multi_topic_session_round; state_source=ai-council/session-state.jsonl; depth_aware=true; do_not_switch_mode=true"
```
This is a 4-line value change, zero structural risk, and — per Finding 10 — a precondition for the KQ1/KQ6 benchmark's ai-council leg to produce an interpretable result for EITHER model. Sequence this before KQ1/KQ6, not merely alongside KQ3/KQ8 hygiene as both prior lineages implied.

## Deliverable 3 — Orchestrate deep-routing fix, NDP-safe (targets Finding 12-14, supersedes both prior lineages' KQ4 wording)

Add to `orchestrate.md` §2 (near the existing Priority table, :95-105), a new routing rule:

```
### Deep-Loop Routing (deterministic, no @deep dispatch)

If the request matches a `/deep:*` command, or names a deep-loop leaf target
(deep-research, deep-review, deep-context, ai-council) explicitly:
1. Read `.opencode/skills/deep-loop-workflows/mode-registry.json` directly (the same
   registry `deep.md` §0 resolves against — do NOT Task-dispatch `@deep`; it is a
   `mode: primary` router, not a depth-1 LEAF target, and dispatching it would create
   an illegal Orch(0) -> Sub-Orch(1) -> @leaf(2) chain per §0 ILLEGAL NESTING).
2. Resolve `workflowMode`, `target_agent`, `artifactRoot` from the matched registry entry.
3. Populate the `Deep Route:` field in the Task Format (:207) from that resolution —
   do not self-derive `mode=`/`execution=` from the free-text Priority table.
4. Dispatch the resolved LEAF agent directly at Depth 1. No mode-switching after dispatch.
```

This is the corrected version of KQ4 — same intent (deterministic table lookup replaces judgment-dependent free-text derivation) as both prior lineages, but implementable without violating orchestrate's own depth cap. It also resolves the ambiguity between gpt-fast-high's "resolve via deep.md" (compatible with this fix) and glm-max's "dispatch @deep and STOP" (not compatible, per iteration 5) in the NDP-safe direction.

## Deliverable 4 — Sequencing correction combining Deliverables 1-3 with the prior round's phase plan

Both prior lineages proposed phase 008 as a bundle of prompt-layer fixes (KQ4 + KQ7/KQ8 propagation + KQ3 council header), phase 009 as the plugin, phase 010 as smoke+benchmark. This round's findings suggest a **precondition ordering within phase 008 itself**: Deliverable 2 (ai-council validator, zero risk, 4-line value fix) and Deliverable 1 (Mode D self-check rewrite, the only fix targeting a *confirmed-fired* failure) should land before Deliverable 3 (orchestrate routing, corrects an as-yet-unexercised recommendation) and well before phase 010's benchmark — otherwise the benchmark's ai-council leg is uninterpretable (Finding 10) and the benchmark would be measuring a Mode D failure mode already known to be fixable cheaply (Finding 7-8) as if it were unresolved GPT unreliability.

## Ruled out this iteration

- Treating all of phase 008's proposed edits as equally sequenced/parallel — RULED OUT; Deliverables 1 and 2 have a hard precedence claim over Deliverable 3 and phase 010, established by Findings 7, 10, and 16.

## Status

`complete` (synthesis iteration, no new primary-source reads).

newInfoRatio: 0.45 — novelty: converts six prior findings (7, 8, 9, 10, 12, 13, 14) into copy-pasteable diff-level proposals with an internal precedence ordering, directly answering the charter's "concrete, implementation-ready improvements, not more diagnostic scaffolding" mandate (§9.3.3). Declining ratio reflects synthesis-of-existing-findings rather than new evidence gathering — expected at this stage of a 10-iteration arc, not a signal to stop early per the charter's stop-policy.
