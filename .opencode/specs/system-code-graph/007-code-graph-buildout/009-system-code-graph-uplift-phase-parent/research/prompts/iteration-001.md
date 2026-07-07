DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — Iteration 1 of 20

## STATE

Session: 029-uplift-9002D7A6 | Topic: system-code-graph uplift (skill usefulness + marketing README + sk-doc 1:1 alignment). Iter 1 is the discovery pass.

Research Topic: system-code-graph uplift: skill usefulness, marketing README rewrite (problem-first arc with HVR clean prose), and sk-doc 1:1 alignment (validate_document.py --type <type> exit-0 across every authored doc). Inputs: Public root README + system-spec-kit README as structural exemplars for the marketing voice; sk-doc readme_template.md + hvr_rules.md + template_rules.json as the validation contract; system-code-graph current authored docs as the targets; INSTALL_GUIDE.md lines 49/56/195 as confirmed drift. Three downstream implementation children scaffolded as stubs at 001-skill-docs-install-guide-and-readmes-polish/, 002-readme-problem-first-rewrite/, 003-sk-doc-type-validation-alignment/.

Iteration: 1 of 20
Focus Area: Q1 + Q3 — exhaustive scan of every authored doc in `.opencode/skills/system-code-graph/` for bugs, drift, weak prose, and HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas). Cite each hit with file:line.
Remaining Key Questions:
  - Q1: Per-doc bugs/drift/weak-prose beyond INSTALL_GUIDE 49/56/195
  - Q2: sk-doc --type per doc + mandatory anchors
  - Q3: HVR violations per-file with line numbers
  - Q4: README structural arc to mimic from Public root + system-spec-kit
  - Q5: Useful content gaps in SKILL.md/references/per-folder mcp_server READMEs
  - Q6: Per-folder mcp_server READMEs needing fresh authoring vs validation-only
  - Q7: feature_catalog index + per-feature validation as --type playbook
  - Q8: manual_testing_playbook index + per-scenario validation as --type playbook
  - Q9: Optimal child-001 task ordering
  - Q10: Worst-case HVR pitfalls in root README + system-spec-kit README

Last 3 Iterations Summary: None (first iteration).

## STATE FILES

All paths are relative to repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

- Config: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift-phase-parent/research/deep-research-config.json`
- State Log: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift-phase-parent/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift-phase-parent/research/deep-research-strategy.md`
- Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift-phase-parent/research/findings-registry.json`
- Write iteration narrative to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift-phase-parent/research/iterations/iteration-001.md`
- Write per-iteration delta file to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift-phase-parent/research/deltas/iter-001.jsonl`

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during this review. Report findings only; implementation is a separate follow-up step.
- The first 5 thoughts via `sequential_thinking` MUST cover: (1) pre-plan evidence to read, (2) read evidence, (3) extract findings with file:line citations, (4) identify gaps for next iter, (5) compose JSONL delta row.

## SCOPE (Iter 1 Discovery Pass)

In-bounds files for this iter:
- `.opencode/skills/system-code-graph/SKILL.md`
- `.opencode/skills/system-code-graph/README.md`
- `.opencode/skills/system-code-graph/ARCHITECTURE.md`
- `.opencode/skills/system-code-graph/INSTALL_GUIDE.md`
- `.opencode/skills/system-code-graph/references/*.md` (3 files)
- `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` (index only this iter)
- `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` (index only this iter)

Out-of-bounds (defer to later iters):
- `mcp_server/**/README.md` (covered by iters 2-3)
- Per-feature files in `feature_catalog/0N--*/` (covered by iter 4)
- Per-scenario files in `manual_testing_playbook/0N--*/` (covered by iter 5)
- `node_modules/`, `dist/`, `mcp_server/database/*.sqlite*`, `.opencode/` runtime cache

## HVR REFERENCE

Source of truth: `.opencode/skills/sk-doc/references/global/hvr_rules.md`.
Banned words (-5 each): leverage, empower, seamless, disrupt, harness, delve, realm, tapestry, illuminate, unveil, elucidate, revolutionise, game-changer, groundbreaking, cutting-edge, embark, abyss.
Banned phrases (-5 each): "It's important to", "It's worth noting", "Moving forward", "In today's world", "In today's digital landscape", "When it comes to", "Dive into", "Let me be clear", "The reality is", "Here's the thing", "In a world where", "navigate the challenges", "unlock the potential", "the customer journey" (metaphor sense).
Em dashes: ZERO ALLOWED. Replace with comma, period, or colon.
Semicolons: -5 each.
Pass bar: HVR score ≥ 85.

## OUTPUT CONTRACT

You MUST produce TWO artifacts (the workflow handles the third):

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift-phase-parent/research/iterations/iteration-001.md`. Structure: H2 headings for Focus, Actions Taken, Findings (per-file subsections with file:line citations), Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED (echo with `>>`) to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift-phase-parent/research/deep-research-state.jsonl`. Required schema:

```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<insight|stuck|partial|complete>","focus":"Q1+Q3 discovery scan of authored docs for bugs/drift/HVR violations","graphEvents":[]}
```

Append as single-line JSON with newline terminator. Do NOT pretty-print.

Optional: write the per-iteration delta file to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift-phase-parent/research/deltas/iter-001.jsonl` with the same iteration record plus one record per finding. If the recipe's write-permission denies the deltas path, the workflow will synthesize the delta file from your state-log append.

## SUCCESS CRITERIA FOR ITER 1

- Every in-bounds file scanned at least once with rg/grep evidence collection.
- ≥10 file:line-cited findings across the in-bounds set, mixed bugs/drift/HVR.
- newInfoRatio reflects how much of Q1+Q3 was answered (expect 0.55-0.75 for a discovery pass).
- status = "insight" if findings are concrete; "partial" if only partial coverage.
- Next Focus suggests iter 2 (likely Q5 or Q6 — useful gaps + per-folder mcp_server READMEs).
