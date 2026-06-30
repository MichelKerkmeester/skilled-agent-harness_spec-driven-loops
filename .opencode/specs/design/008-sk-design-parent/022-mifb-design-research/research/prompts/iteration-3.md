DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 3 of 3 (FINAL — loop hits the iteration cap after this; synthesis follows)
Questions: Q1 (inventory), Q2 (exact homes/anchors), Q3 (conflicts) answered; Q4 (prioritized backlog) open
Last 2 ratios: 0.82 -> 0.64 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Executor: cli-codex gpt-5.5 xhigh. Sandbox: workspace-write (write ONLY under the research packet — never edit live sk-design).

Research Topic: Study the external make-interfaces-feel-better skill corpus (SKILL.md, animations.md, performance.md, surfaces.md, typography.md) and determine concrete, actionable improvements for the sk-design skill and its five modes (interface, foundations, motion, audit, md-generator) plus the shared register.
Iteration: 3 of 3
Focus Area: Iteration 3 of 3 — FINAL. RESEARCH ONLY; only write the 3 research artifacts.

Re-read research/iterations/iteration-002.md and the strategy to load the refined coverage map and Q3 decisions. This iteration answers Q4: turn the map into a PRIORITIZED IMPLEMENTATION BACKLOG for a future build phase.

PRODUCE:
1. A ranked backlog table. Each row: technique -> sk-design target file+anchor -> coverage (net-new / partial / covered) -> leverage (H/M/L) -> effort (S/M/L) -> priority rank -> one-line minimal edit. Group smallest high-leverage NET-NEW edits first (e.g. concentric-radius math, image-outline pure-rgba exception, shadow-as-border-vs-ghost-card audit detector, contextual icon-swap CSS fallback, root font smoothing, text-wrap line-count caveats, `transition: all` audit detector, hit-area collision detector, static press-scale escape hatch).
2. A per-mode rollup: for interface, foundations, motion, audit, md-generator, and shared — the concrete edits that land there, and which mode is the single highest-leverage home.
3. An explicit DO-NOT / ruled-out list (global Review Output Format; wholesale numeric defaults like 40px over 44px and 100ms universal stagger; per-mode logic in the hub; re-adopting already-covered items: interruptible transitions, AnimatePresence initial=false, scale 0.96, bounce:0).
4. Note the separate, non-corpus cleanup found in iteration 2: the hub SKILL.md cites a `references/` shared base that does not exist (the real dir is `shared/`). Record it as a small doc-fix recommendation, kept out of the corpus-adoption backlog.
5. A short 'definition of done' for the future build phase and a one-paragraph executive takeaway (what is genuinely net-new from this external corpus vs what sk-design already encodes).

Budget: target 3-5 research actions, max 12 tool calls. Lean on iterations 1-2; only re-open a target file if you must confirm a rank or anchor.
Remaining Key Questions: - [x] Q1: technique inventory (iteration 1)
- [x] Q2: exact homes/anchors + minimal edits (iteration 2)
- [x] Q3: conflicts ruled out / reconciled (iteration 2)
- [ ] Q4: prioritized backlog with leverage + effort, per-mode rollup, do-not list, build-phase definition of done (THIS iteration)
Carried-Forward Open Questions:
- Q4: turn the coverage map into a prioritized backlog ranked by leverage and effort. (from iteration 2)
- Separate cleanup: hub SKILL.md cites a stale `references/` shared base; real dir is `shared/`. Record as a doc-fix recommendation, not a corpus-adoption item. (from iteration 2)
Last 3 Iterations Summary: run 1: corpus inventory + initial coverage hypothesis (newInfoRatio 0.82, insight); run 2: exact anchors + Q3 conflict decisions (newInfoRatio 0.64, insight)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-config.json
- State Log: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-strategy.md
- Registry: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-003.md
- Write per-iteration delta file to: .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deltas/iter-003.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/iterations/iteration-003.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/design/008-sk-design-parent/022-mifb-design-research/research/deltas/iter-003.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

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
