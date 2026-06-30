DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 8 of 20
Questions remaining: 4/4 | Last 2 ratios: 0.52 -> 0.41
Resource map: resource-map.md not present; skipping coverage gate.
Executor: cli-codex gpt-5.5 xhigh fast. Sandbox: workspace-write (write ONLY under the research packet — never edit live sk-design).

Research Topic: Study the external designer-skills-main corpus (9 plugins, ~96 design skills) and determine concrete, actionable sk-design improvements while distinguishing adoptable build/visual craft from out-of-scope lifecycle capabilities.
Iteration: 8 of 20
Focus Area: 20-iteration run over the 9-plugin designer-skills-main corpus at .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/. RESEARCH ONLY — the only files you write are the three required research artifacts. Each iteration: advance coverage to plugins/skills NOT yet deeply read (check your prior iteration files + the strategy's answered questions to avoid repeats), keep the in-scope vs out-of-scope split current, and grow the corpus-traced + target-traced adoption backlog. Read corpus skill files at external/designer-skills-main/<plugin>/skills/<name>/SKILL.md plus the relevant sk-design target under .opencode/skills/sk-design/. sk-design is a taste-led build/visual skill with five modes — record design-ops/research/strategy lifecycle work as OUT OF SCOPE, do not adopt it.

This iteration's focus (from strategy): Do `prototyping-testing`, `design-ops`, and `designer-toolkit` contain audit-adjacent material stronger than the now-expanded audit backlog, or are they mostly validation/process wrappers?
Remaining Key Questions: - [ ] Q1: Across the 9 plugins / ~96 skills, which capabilities and techniques are genuinely net-new or stronger than what sk-design's five modes encode, and which fall OUTSIDE sk-design's build/visual scope (design-ops, research, and strategy are lifecycle stages sk-design does not own)?
- [ ] Q2: For each genuinely adoptable item, which sk-design home is correct — interface, foundations, motion, audit, md-generator, the shared register, or a justified NEW mode — and what is the minimal, surgical edit (file + anchor)?
- [ ] Q3: Where does designer-skills-main conflict with, duplicate, or deliberately exceed sk-design's scope (taste-led build vs full design-ops lifecycle), and what must be ruled out to avoid scope creep or bloat?
- [ ] Q4: What is the prioritized, concrete adoption backlog (per mode, plus any justified new-mode proposal), each item traced to a corpus skill and an sk-design target file, with leverage and effort noted?
Carried-Forward Open Questions:
- Which individual `visual-critique` skills contain concrete rubric language stronger than audit's current critique/hardening references? (iteration 1)
- Which `design-systems` skills are practical system-craft versus lifecycle governance, and where do they map without bloating foundations? (iteration 1)
- The root README says `interaction-design` has 16 skills, while its plugin README lists 15. The next pass should use filesystem skill inventory as the source of truth before declaring coverage complete. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/README.md:73] (iteration 1)
- Does `ui-design` contain net-new operational checklists after excluding already-adopted typography, readable measure, data visualization, and cognitive-law material? (iteration 1)
- Which `interaction-design` skills add net-new state or flow structure beyond motion's existing micro-interaction and reduced-motion guidance? (iteration 1)
- For the eventual build phase, should the interface quality reference become the single compact home for flow floors, or should search/forms/navigation each get separate references? My read: keep one compact home unless the content grows beyond a single page. (iteration 2)
- After the eventual build edit, does the expanded flow-floor section remain compact enough, or does it need a split then? (iteration 3)
- Does the rest of `ui-design` contain net-new operational checklists after excluding already-adopted typography, readable measure, data visualization, and cognitive-law material? (iteration 3)
- After the eventual build edit, does the expanded interface flow-floor section remain compact enough, or does it need a split then? (iteration 4)
- The `interaction-design` root/plugin README skill-count mismatch still needs filesystem confirmation before declaring that plugin fully covered. (iteration 4)
- Does the expanded interface flow-floor section remain compact enough after the eventual build edit, or does it need a split then? (iteration 5)
- Does the remaining corpus outside `interaction-design` and the read `ui-design` slice contain any high-leverage, build-facing checks not already captured in the backlog? (iteration 5)
- After all remaining plugins are sampled, what is the final priority order across audit, interface, foundations, motion, and explicit ruled-out lifecycle material? (iteration 6)
- Finish the rest of `design-systems` coverage: which remaining skills are pure docs/lifecycle versus small build-facing checks worth keeping? (iteration 6)
- Do `prototyping-testing`, `design-ops`, and `designer-toolkit` contain audit-adjacent material stronger than the now-expanded audit backlog, or are they mostly validation/process wrappers? (iteration 6)
Last 3 Iterations Summary: run 5: Confirm interaction-design root/plugin README skill-count mi (0.32); run 6: Check remaining corpus outside interaction-design and read u (0.52); run 7: Check prototyping-testing, design-ops, and designer-toolkit  (0.41)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/design/008-sk-design-parent/024-designer-skills-research/research/deep-research-config.json
- State Log: .opencode/specs/design/008-sk-design-parent/024-designer-skills-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/design/008-sk-design-parent/024-designer-skills-research/research/deep-research-strategy.md
- Registry: .opencode/specs/design/008-sk-design-parent/024-designer-skills-research/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/design/008-sk-design-parent/024-designer-skills-research/research/iterations/iteration-008.md
- Write per-iteration delta file to: .opencode/specs/design/008-sk-design-parent/024-designer-skills-research/research/deltas/iter-008.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/design/008-sk-design-parent/024-designer-skills-research/research/iterations/iteration-008.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/design/008-sk-design-parent/024-designer-skills-research/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/design/008-sk-design-parent/024-designer-skills-research/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/design/008-sk-design-parent/024-designer-skills-research/research/deltas/iter-008.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

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
