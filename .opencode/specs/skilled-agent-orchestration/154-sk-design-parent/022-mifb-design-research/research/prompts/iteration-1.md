DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 3
Questions: 0/4 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Executor: cli-codex gpt-5.5 xhigh. Sandbox: workspace-write (you MAY write files, but ONLY under the research packet — never edit live sk-design).

Research Topic: Study the external make-interfaces-feel-better skill corpus (SKILL.md, animations.md, performance.md, surfaces.md, typography.md) and determine concrete, actionable improvements for the sk-design skill and its five modes (interface, foundations, motion, audit, md-generator) plus the shared register.
Iteration: 1 of 3
Focus Area: Iteration 1 of 3. RESEARCH ONLY — do NOT edit any live sk-design file; the only files you write are the three required research artifacts below.

READ (fully) the external corpus, all 5 files in .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/make-interfaces-feel-better-main/skills/make-interfaces-feel-better/ : SKILL.md, surfaces.md, typography.md, animations.md, performance.md.
READ the sk-design hub: .opencode/skills/sk-design/SKILL.md and .opencode/skills/sk-design/mode-registry.json (and skim the five mode folders design-interface/ design-foundations/ design-motion/ design-audit/ design-md-generator/ and shared/ — a deep per-mode read is iteration 2's job, so just get oriented now).

PRODUCE this iteration: (1) a TECHNIQUE INVENTORY extracted from the corpus — each entry = short name, one-line gist, source corpus file; (2) an initial COVERAGE HYPOTHESIS per technique — net-new vs partially-covered vs already-covered in sk-design, citing the sk-design location when covered; (3) note the 3-5 most promising net-new or under-covered techniques to deep-map in iteration 2.

Budget: target 3-5 research actions, max 12 tool calls. The corpus files are small (~32KB total) — read them first.
Remaining Key Questions: - [ ] Q1: What distinctive techniques, principles, and heuristics does make-interfaces-feel-better encode across surfaces, animations, typography, and performance that sk-design's modes do not yet cover or cover more weakly?
- [ ] Q2: For each adoptable technique, which sk-design home is correct — interface, foundations, motion, audit, md-generator, or the shared register — and what is the minimal, surgical edit (file + anchor) to land it?
- [ ] Q3: Where does make-interfaces-feel-better conflict with, duplicate, or contradict existing sk-design guidance, and what must be ruled out to avoid bloat or taste drift?
- [ ] Q4: What is the prioritized, concrete improvement backlog (per mode + shared), each item traced to a corpus file and an sk-design target file, with effort and leverage noted?
Carried-Forward Open Questions:
[None yet — this is iteration 1]
Last 3 Iterations Summary: [None yet — this is iteration 1]

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/022-mifb-design-research/research/deep-research-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/022-mifb-design-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/022-mifb-design-research/research/deep-research-strategy.md
- Registry: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/022-mifb-design-research/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/022-mifb-design-research/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/022-mifb-design-research/research/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/022-mifb-design-research/research/iterations/iteration-001.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/022-mifb-design-research/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/022-mifb-design-research/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/022-mifb-design-research/research/deltas/iter-001.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

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
