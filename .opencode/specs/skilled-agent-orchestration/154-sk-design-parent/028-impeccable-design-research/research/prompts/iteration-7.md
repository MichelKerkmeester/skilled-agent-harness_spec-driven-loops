DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 7 of 30
Questions remaining: 4/4 | Last 2 ratios: 0.32 -> 0.29
Resource map: resource-map.md not present; skipping coverage gate.
Executor: cli-codex gpt-5.5 xhigh fast. Sandbox: workspace-write (write ONLY under the research packet — never edit live sk-design).

Research Topic: Study the external impeccable design skill and determine concrete, actionable sk-design improvements, distinguishing genuinely net-new build/visual craft from material sk-design already encodes (after the 022/023 and 024-027 adoptions) and from build/site/test/CLI infrastructure outside sk-design scope.
Iteration: 7 of 30
Focus Area: 30-iteration run over the impeccable design skill at .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/. RESEARCH ONLY — the only files you write are the three required research artifacts (the iteration-NNN.md, the iter-NNN.jsonl delta, and the strategy update). NEVER edit live sk-design.

SCOPE — read ONLY these parts of the corpus:
- .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md (shared design laws + command router + the <codex>/<gemini> per-model defect blocks)
- .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/*.md (the 23 command flows + domain refs: audit, polish, critique, harden, optimize, brand, product, colorize, typeset, layout, animate, delight, bolder, quieter, shape, distill, clarify, craft, extract, document, interaction-design, etc.)
- .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/cli/engine/detect-antipatterns.mjs (extract the ANTIPATTERNS rule catalog SEMANTICS — id, category, what it detects — NOT the implementation plumbing)
- .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/docs/STYLE.md (the prose denylist)
DO NOT read or research: the generated provider duplicate skill trees (.claude/skills/, .cursor/skills/, .gemini/skills/, .trae/, .agents/, .codex/, .kiro/, etc. — they MIRROR skill/), nor build/site/test/extension/functions/scripts plumbing. Those are infrastructure, not design methodology.

FRAME — crosswalk every impeccable slice onto sk-design's five modes + the shared register + hub: design-audit (audit/critique/harden/anti-patterns/per-model tells), design-foundations (color/type/layout/tokens/register), design-interface (shape/distill/clarify/bolder/quieter/delight/craft/register), design-motion (animate + motion laws), design-md-generator (extract/document → CSS-to-DESIGN.md). sk-design is a taste-led build/visual skill.

VERIFY — impeccable overlaps heavily with what sk-design already encodes (phases 022/023 pulled cream-bg/tracking/line-length/reduced-motion craft; 024-027 added audit/interface/motion/foundations slices). For EACH candidate, OPEN the actual current sk-design target file under .opencode/skills/sk-design/ and confirm whether the rule is already present. Mark each: NET-NEW (cite the sk-design file you checked + why it is absent), ALREADY-COVERED (cite where), or OUT-OF-SCOPE-INFRA. A finding is a hypothesis until the cited sk-design file is opened. Do NOT propose a second parallel scoring/register/detector system — adopt as a crosswalk/refinement. No new mode unless a cluster clears distinct-intent + distinct-output + distinct-owner.

Each iteration: advance coverage to impeccable slices NOT yet deeply read (check your prior iteration files to avoid repeats), keep the net-new vs already-covered vs out-of-scope ledger current, and grow the impeccable-traced + sk-design-target-traced adoption backlog. End your iteration delta with a canonical {"type":"iteration",...} record carrying a newInfoRatio estimate.

This iteration's focus (from strategy): Q1 remains open for actual anti-pattern catalog semantics because the earlier detector pass only reached the scoped facade and did not expose rule IDs or detector descriptions.
Remaining Key Questions: - [ ] Q1: Which of impeccable's shared design laws, 23 command flows, anti-pattern rules, per-model defect blocks, and prose denylist are genuinely net-new or MORE SPECIFIC than what sk-design's five modes already encode (after the 022/023 and 024/025–027 adoptions), and which are already-covered or are build/site/test/CLI infrastructure outside sk-design's scope?
- [ ] Q2: For each genuinely net-new item, which sk-design home is correct — interface, foundations, motion, audit, md-generator, the shared register, the hub, or a justified NEW mode — and what is the minimal, surgical edit (file + anchor)?
- [ ] Q3: Which of impeccable's STRUCTURAL ideas (register-as-first-class, the per-model codex/gemini defect catalog, the color-strategy commitment axis, the anti-pattern detector engine, the prose denylist) are worth adopting versus ruling out as scope creep or already-analogous to sk-design's existing register / `/20` audit score / `ai_fingerprint_tells`?
- [ ] Q4: What is the prioritized, concrete adoption backlog (per mode, plus any justified new-mode proposal), each item traced to an impeccable source and an sk-design target file, with leverage and effort noted, and a clear no-new-mode verdict?
Carried-Forward Open Questions:
- Q1 remains open for `bolder.md`, `quieter.md`, `shape.md`, `distill.md`, `clarify.md`, `craft.md`, `extract.md`, `document.md`, `optimize.md`, `adapt.md`, `live.md`, `onboard.md`, `codex.md`, `hooks.md`, `init.md`, and `overdrive.md`. (iteration 5)
- Q1 also remains open for actual anti-pattern catalog semantics because the scoped detector facade did not expose rule IDs or detector descriptions. (iteration 5)
- Q4 remains open for prioritized adoption order after the remaining command-flow references are read. (iteration 5)
- Q4 remains open for final prioritized adoption order after the remaining command-flow references and detector semantics are read. (iteration 6)
- Q1 remains open for `extract.md`, `document.md`, `optimize.md`, `adapt.md`, `live.md`, `onboard.md`, `hooks.md`, `init.md`, and `overdrive.md`. (iteration 6)
- Q1 remains open for actual anti-pattern catalog semantics because the earlier detector pass only reached the scoped facade and did not expose rule IDs or detector descriptions. (iteration 6)
Last 3 Iterations Summary: run 4: Brand/product/color/type/layout command references: crosswal (0.34); run 5: Motion, delight, and interaction-design command references:  (0.32); run 6: Interface transformation and pre-build direction cluster: bo (0.29)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research/research/deep-research-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research/research/deep-research-strategy.md
- Registry: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research/research/iterations/iteration-007.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research/research/deltas/iter-007.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research/research/iterations/iteration-007.md` (path is pre-substituted for the current iteration number). Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored (the iteration will look incomplete and the reducer may re-run it). Required schema:

```json
{"type":"iteration","iteration":<n>,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */],"executor":{/* workflow-owned for non-native runs */}}
```

Append via single-line JSON with newline terminator — for example: `echo '<single-line-json>' >> .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research/research/deep-research-state.jsonl`. Do NOT pretty-print. Do NOT print the JSON to stdout only; it MUST land in the state log file.

For non-native CLI executors, the workflow owns executor provenance. It writes a pre-dispatch sentinel, then patches the first canonical `"type":"iteration"` record with the `executor` block before `post_dispatch_validate` runs. Do NOT append your own `dispatch_failure` event or a partial fallback record when the executor itself crashes or times out; the workflow emits the typed failure event on that path.

3. **Per-iteration delta file** at `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research/research/deltas/iter-007.jsonl` (path pre-substituted for the current iteration — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same content as the state-log append) plus per-event structured records (one per graphEvent, finding, invariant, observation, edge, ruled_out direction). Each record on its own JSON line. The reducer reads the combined state log + delta files to rebuild dashboards and registries after interruption or partial runs.

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
