DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 3
Questions: Q1 inventory complete; Q2/Q3 partial; Q4 open | Last focus: corpus inventory + initial coverage hypothesis
Last 2 ratios: N/A -> 0.82 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Executor: cli-codex gpt-5.5 xhigh. Sandbox: workspace-write (write ONLY under the research packet — never edit live sk-design).

Research Topic: Study the external make-interfaces-feel-better skill corpus (SKILL.md, animations.md, performance.md, surfaces.md, typography.md) and determine concrete, actionable improvements for the sk-design skill and its five modes (interface, foundations, motion, audit, md-generator) plus the shared register.
Iteration: 2 of 3
Focus Area: Iteration 2 of 3. RESEARCH ONLY — do NOT edit live sk-design; only write the 3 research artifacts.

First re-read research/iterations/iteration-001.md and the strategy to load the iteration-1 inventory + coverage hypothesis. This iteration DEEP-READS the sk-design target files to (a) confirm/correct coverage with EXACT anchors and (b) do the Q3 conflict analysis.

Read these targets and map each promising technique to a precise file+anchor:
- .opencode/skills/sk-design/design-motion/SKILL.md and its references/: interruptible CSS transitions vs keyframes, split/stagger enter, subtle exit, contextual icon swaps (scale 0.25→1 / blur 4px→0 / spring bounce 0), scale-on-press 0.96, AnimatePresence initial={false}, reduced-motion, motion-performance. For each: net-new vs already-covered, and the exact anchor where it should land or already lives.
- .opencode/skills/sk-design/design-audit/SKILL.md and references/ (ai_fingerprint_tells.md, anti_patterns_production.md, the audit checklist): turn concentric-radius math, image-outline rgba rule, 40-44px hit area, no-`transition: all`, `will-change` discipline, and optical alignment into AUDIT DETECTORS with finding language. RESOLVE Q3: shadow-as-border vs the ghost-card anti-pattern — when is a layered shadow legit depth vs slop?
- .opencode/skills/sk-design/design-foundations/SKILL.md and references/: tabular-nums, text-wrap balance/pretty, root font-smoothing, shadow-as-border tokens. Flag the conflict: image-outline pure-black/white alpha rule vs any existing token / dark-mode neutral guidance.
- .opencode/skills/sk-design/design-interface/SKILL.md: the 'details compound' philosophy, concentric radius, and optical alignment as build judgment / preflight.
- the shared reference base .opencode/skills/sk-design/references/ (anti_slop_principles.md, cognitive_laws.md, design_token_vocabulary.md): does any technique belong as SHARED vocabulary rather than in one mode?

PRODUCE: a refined coverage map (technique -> exact sk-design target file+anchor -> net-new/partial/covered), the Q3 conflict/ruled-out list with rationale, and a draft home + minimal-edit per technique. Defer the final prioritized backlog and effort/leverage ranking to iteration 3.
Budget: target 3-5 research actions, max 12 tool calls.
Remaining Key Questions: - [x] Q1: technique inventory (done in iteration 1)
- [ ] Q2: exact sk-design home (file + anchor) and minimal edit per adoptable technique
- [ ] Q3: conflicts/duplications to rule out (shadow-as-border vs ghost-card; image-outline vs token/dark-mode neutrals; global Review Output Format; wholesale numeric defaults)
- [ ] Q4: prioritized backlog with leverage + effort (iteration 3)
Carried-Forward Open Questions:
- Q2 needs precise anchors: deep-read target files and name exact insert locations per technique. (from iteration 1)
- Q3 needs conflict analysis: shadow-as-border vs ghost-card anti-pattern; image-outline rule vs existing token/dark-mode guidance. (from iteration 1)
- Q4 remains open: no prioritized implementation backlog yet. (from iteration 1)
Last 3 Iterations Summary: run 1: corpus inventory + initial coverage hypothesis (newInfoRatio 0.82, status insight)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-config.json
- State Log: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-strategy.md
- Registry: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-002.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deltas/iter-002.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

Example delta file contents (one iteration):
```json
{"type":"iteration","iteration":3,"newInfoRatio":0.62,"status":"insight","focus":"..."}
{"type":"finding","id":"f-iter003-001","severity":"P1","label":"...","iteration":3}
{"type":"invariant","id":"inv-iter003-001","label":"...","iteration":3}
{"type":"observation","id":"obs-iter003-001","packet":"007","classification":"real","iteration":3}
{"type":"edge","id":"e-iter003-001","relation":"VIOLATES","source":"obs-001","target":"inv-001","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
