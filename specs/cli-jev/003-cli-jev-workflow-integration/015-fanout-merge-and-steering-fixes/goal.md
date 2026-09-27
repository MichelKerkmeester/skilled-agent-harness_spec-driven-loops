---
title: "Goal: Fix Phase: Fan-out Merge Under-count and Per-Iteration Steering"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fanout merge fix goal"
  - "short registry reconstruction criteria"
  - "steer.md prompt goal"
  - "merge replay criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes"
    last_updated_at: "2026-09-27T14:30:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the durable directive from this phase's spec and acceptance criteria"
    next_safe_action: "Run the diagnosis replay and record its table before any code change"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should steering reach native lineages through a prompt-pack token"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Fix Phase: Fan-out Merge Under-count and Per-Iteration Steering

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the `system-deep-loop` fan-out merge rebuild every count-only finding a research lineage's own files can account for and count the rest as a gap, and make each CLI lineage iteration read its lineage's `steer.md` when one exists.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Diagnose first: the replay of the current merge and its per-lineage table come before any code change |
| D2 | Change only `fanout-merge.cjs`, `fanout-run.cjs` and their two test files. The workflow YAML convergence check, the prompt pack template and the native lineage path stay as they are |
| D3 | A short registry is rebuilt per iteration from markdown, graph, then delta evidence by exact count. The rebuild replaces the registry's findings only when it holds more, and every unrebuilt finding is counted in `reconstructionGaps` |
| D4 | Tests copy the records they need out of the committed lineage files. No test reads the spec folder at run time |
| D5 | No live fan-out run. The replay runs on temp copies and never writes the committed `research/` directories |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] Before any code change, the merge replay over temp copies of the three rounds' lineages prints `001-deep-research 85 0`, `004-deep-research-expansion 74 0` and `007-classifier-deep-research 65 0`
- [ ] `npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts`, run from `.skilled/skills/system-deep-loop/runtime`, exits 0 with 0 failed and includes a "short registry" test and a "no iteration matches" test
- [ ] After the fix, the replay prints round 1 `sourceFindings` at least 112 with `reconstructionGaps` 0, and rounds 2 and 3 `sourceFindings` above 74 and 65 with `reconstructionGaps` above 0
- [ ] `npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts -t "steer.md"` exits 0 and asserts a CLI lineage prompt names its `steer.md` by absolute path with the words "when it exists"
- [ ] `git status --short -- 'specs/cli-jev/003-cli-jev-workflow-integration/*/research'` prints nothing after the replay
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, this goal and `implementation-summary.md` authored on 2026-09-27 |
| Evidence reopened | Done | `fanout-merge.cjs:187-214`, `:760-767`, `:1040-1079`, `:1126-1144` and `:1210-1233`. `fanout-run.cjs:1406-1525`, `:1527` and `:3260`. `deep-research-auto.yaml:2215-2216`. Each round's `research/deep-research-state.jsonl` line 1 holds the `synthesis_incomplete` event |
| Read-only replay of the current merge | Done | Temp copies in the session scratchpad printed 85, 74 and 65 with `reconstructionGaps` 0 and no `lineage_reconstruction_failed` warning, so reconstruction never ran |
| Owner history | Done | `git log -5` on `fanout-merge.cjs`: only `ec33385ae5` (2026-09-17, path move). On `fanout-run.cjs`: `9fe8526284` (2026-09-26) here, and `main` has `ac156a7112` (2026-09-27) instead |
| Build | Pending | Nothing is built |

### Deviations and findings

| Item | Note |
|------|------|
| Cause located before the build | The gate at `fanout-merge.cjs:1210` reconstructs only an empty registry. Every short lineage wrote a non-empty one: round 1 deepseek 8 of 57, round 2 deepseek 21 of 41, grok 7 of 21 and swe 20 of 30, round 3 deepseek 13 of 83, grok 9 of 35 and swe 10 of 55. The build's diagnosis still runs first (D1) |
| Delta records | The lineages' `deltas/iter-NNN.jsonl` hold `type: "finding"` records whose per-iteration count matches `findingsCount` for 106 of 112, 100 of 118 and 126 of 173 count-only findings (leaf's scratch count). The markdown parser matches far fewer, for example 0 of 10 iterations for round 3 deepseek |
| Preliminary expected numbers | A scratch script applying D3's rule predicts round 1 `sourceFindings` 134 with gap 0, round 2 105 with gap 13 and round 3 168 with gap 38. Round 1's 134 includes grok's 22 structured findings. These are the leaf's estimate, and the build's table is the authority |
| Round 3 figure | The brief and `007-classifier-deep-research/implementation-summary.md:113` say 57 of 173. 57 is `registryFindingCount`. The convergence check compares `sourceFindingCount`, which the event records as 65 |
| Collision | `fanout-run.cjs` differs between this branch and `main` by 11 lines from two Grok 4.7 roster commits. The build starts from a tree holding both |
| Steering scope | A CLI lineage runs all its iterations from one prompt, so the steering line goes in `buildLoopPrompt`. Round 3's five lineages were all CLI kinds (`cli-pi`, `cli-cursor`, `cli-devin` per `invocation-metadata.json`). Native lineages get `buildNativeCommandInput` and are left for a separate design |
| Scaffold title | `create.sh` titled the scaffold "Phase 6". The folder is phase 15 of 17, and the titles now name the fix |
| Test titles | The acceptance filters use the test title words "short registry", "no iteration matches" and "steer.md". This is the leaf's choice, and the build may rename them only with the criteria |
<!-- /ANCHOR:log -->
