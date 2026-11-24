---
title: "Feature Specification: Offer the right deep-loop command and flags from explicit loop wording"
description: "A request that asks for a deep loop in plain words gets no command row, while a depth-only request can get one it never asked for. After a yes, nothing tells the AI which suffix or flags to use. This packet makes explicit loop wording open the command gate and teaches the offer, the flags and the setup."
trigger_phrases:
  - "deep loop command offers"
  - "offer the right deep loop command and flags"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Offer the right deep-loop command and flags from explicit loop wording

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress: the traceability review rerun is open |
| **Created** | 2026-11-22 |
| **Branch** | `worktrees/516-deep-loop-command-offers` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor attaches `/deep:research` or `/deep:review` only when a prompt carries depth wording, so a request that asks for the loop in plain words gets no command row. In the block below, V6, H1a, H1b, E1 and E3 all ask for a loop or for iterations and all print `cmd=-`. A request that only asks for effort gets a command it did not ask for. R7 ("find out everything you can") prints `cmd=/deep:research pol=ask`. When a row is offered, no document says what the one question holds, which suffix follows a yes or which flags fit. The setup form after a yes is a typed-letter menu with no recommended option. A finished or stuck run halts with a message that names neither `--extend` nor `/doctor:deep-loop`.

### Purpose
A deep-loop command is offered when, and only when, the request asks for the loop itself. The offer is one question whose recommended option runs `:auto` with flags composed from the request.

### Decision this packet follows
The operator's decision of 2026-11-22 (`scratch/decisions.md`, row D2) narrows the gate to explicit loop asks. It supersedes the rule in `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/decision-record.md` (line 44, "a deep loop is offered only when the prompt uses depth wording"). A reader of that packet should treat its depth-wording rule as replaced by this one.

An explicit loop ask is any of these:
- It names deep research or deep review. It names a deep loop, a research loop or a review loop behind a use, continue or want verb, as in "run a deep loop" or "I want a review loop". A bare loop name, as in "deep loop: audit the payments flow", is not an ask (ADR-006).
- It gives an iteration count, or says "iterations", "iterative" or "iteratively".
- It says multi-pass, or multiple, several or many passes.
- It types a `/deep:*` command.
- It asks to continue, resume or extend a deep run.

Depth words alone are not a loop ask: thorough, thoroughly, in depth, exhaustive, deep dive, everything you can, final verdict. The council words are not one either: ask the council, convene, several models.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-22. `git status --short .skilled/skills/system-skill-advisor` printed nothing before and after the run, so this is the advisor as committed at `2ef3895f753`. The probe file holds 69 prompts taken from the routing analysis, grouped by what this packet expects of each. Every one exited 0 with `live` freshness.

```text
$ node specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/probe.mjs specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/probes-spec-baseline.json specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-spec-baseline.json
V6 [exit 0 live] n=3 amb=false | system-deep-loop c=0.9471 u=0.12 route/single/review cmd=- pol=- kind=skill || 2: sk-code c=0.82 cmd=- pol=- || 3: system-spec-kit c=0.82
H1a [exit 0 live] n=3 amb=true | system-deep-loop c=0.95 u=0.16 route/single/review cmd=- pol=- kind=skill || 2: sk-doc c=0.9449 cmd=- pol=- || 3: sk-code c=0.9316
H1b [exit 0 live] n=3 amb=false | system-deep-loop c=0.9008 u=0.12 route/single/research cmd=- pol=- kind=skill || 2: system-spec-kit c=0.82 cmd=- pol=- || 3: mcp-tooling c=0.82
E1 [exit 0 live] n=3 amb=true | system-deep-loop c=0.82 u=0.2 defer/-/- cmd=- pol=- kind=skill FLOORED || 2: cli-external-orchestration c=0.819 cmd=- pol=- || 3: sk-code c=0.82
E3 [exit 0 live] n=3 amb=true | system-deep-loop c=0.8756 u=0.16 defer/-/- cmd=- pol=- kind=skill || 2: cli-external-orchestration c=0.8746 cmd=- pol=- || 3: sk-code c=0.8651
R2 [exit 0 live] n=1 amb=false | system-spec-kit c=0.82 u=0.18 -/-/- cmd=- pol=- kind=skill FLOORED
V2 [exit 0 live] n=3 amb=false | sk-code c=0.95 u=0.12 route/single/sk-code-review cmd=- pol=- kind=skill || 2: sk-git c=0.8435 cmd=- pol=- || 3: system-deep-loop c=0.82
V4 [exit 0 live] n=1 amb=false | sk-code c=0.82 u=0.16 route/single/sk-code-review cmd=- pol=- kind=skill FLOORED
H7 [exit 0 live] n=0 amb=false | NONE
H10 [exit 0 live] n=1 amb=false | sk-code c=0.82 u=0.16 route/single/sk-code-review cmd=- pol=- kind=skill FLOORED
R7 [exit 0 live] n=2 amb=true | system-deep-loop c=0.8545 u=0.16 route/single/research cmd=/deep:research pol=ask kind=skill || 2: sk-code c=0.8349 cmd=- pol=-
N9 [exit 0 live] n=3 amb=false | system-deep-loop c=0.9073 u=0.12 route/single/research cmd=/deep:research pol=ask kind=skill || 2: cli-external-orchestration c=0.82 cmd=- pol=- || 3: sk-doc c=0.82
V3 [exit 0 live] n=2 amb=true | system-deep-loop c=0.8619 u=0.16 defer/-/- cmd=- pol=- kind=skill needsMode || 2: system-spec-kit c=0.8261 cmd=- pol=-
V8 [exit 0 live] n=2 amb=true | system-deep-loop c=0.95 u=0.16 defer/-/- cmd=- pol=- kind=skill needsMode || 2: sk-code c=0.95 cmd=- pol=-
V5 [exit 0 live] n=3 amb=false | sk-code c=0.95 u=0.12 route/single/sk-code-review cmd=- pol=- kind=skill || 2: system-deep-loop c=0.82 cmd=- pol=- || 3: sk-doc c=0.82
R2b [exit 0 live] n=1 amb=false | system-spec-kit c=0.8336 u=0.18 -/-/- cmd=- pol=- kind=skill
R3 [exit 0 live] n=2 amb=false | system-skill-advisor c=0.82 u=0.2 -/-/- cmd=- pol=- kind=skill FLOORED || 2: system-spec-kit c=0.82 cmd=- pol=-
R3b [exit 0 live] n=0 amb=false | NONE
R6 [exit 0 live] n=0 amb=false | NONE
A1 [exit 0 live] n=0 amb=false | NONE
A4 [exit 0 live] n=0 amb=false | NONE
A8 [exit 0 live] n=0 amb=false | NONE
H6 [exit 0 live] n=2 amb=false | sk-doc c=0.8866 u=0.12 route/single/sk-create-quality-control cmd=- pol=- kind=skill || 2: sk-code c=0.82 cmd=- pol=-
H8 [exit 0 live] n=1 amb=false | system-spec-kit c=0.82 u=0.16 -/-/- cmd=- pol=- kind=skill FLOORED
H9 [exit 0 live] n=3 amb=false | system-spec-kit c=0.82 u=0.22 -/-/- cmd=- pol=- kind=skill FLOORED || 2: cli-external-orchestration c=0.82 cmd=- pol=- || 3: sk-doc c=0.82
R1 [exit 0 live] n=3 amb=false | system-deep-loop c=0.9407 u=0.12 route/single/research cmd=/deep:research pol=ask kind=skill || 2: cli-external-orchestration c=0.82 cmd=- pol=- || 3: system-spec-kit c=0.82
R5 [exit 0 live] n=1 amb=false | system-deep-loop c=0.9089 u=0.12 route/single/research cmd=/deep:research pol=ask kind=skill
V1 [exit 0 live] n=3 amb=true | system-deep-loop c=0.95 u=0.12 route/single/review cmd=/deep:review pol=ask kind=skill || 2: system-skill-advisor c=0.8838 cmd=- pol=- || 3: sk-code c=0.95
E2 [exit 0 live] n=3 amb=true | system-deep-loop c=0.9372 u=0.16 route/single/review cmd=/deep:review pol=ask kind=skill || 2: cli-external-orchestration c=0.9362 cmd=- pol=- || 3: sk-doc c=0.9006
E4 [exit 0 live] n=3 amb=true | system-deep-loop c=0.881 u=0.12 route/single/research cmd=/deep:research pol=ask kind=skill || 2: cli-external-orchestration c=0.88 cmd=- pol=- || 3: sk-prompt c=0.82
E5 [exit 0 live] n=3 amb=true | system-deep-loop c=0.914 u=0.12 route/single/research cmd=/deep:research pol=ask kind=skill || 2: cli-external-orchestration c=0.913 cmd=- pol=- || 3: mcp-tooling c=0.82
E6 [exit 0 live] n=3 amb=true | system-deep-loop c=0.95 u=0.16 route/single/review cmd=/deep:review pol=ask kind=skill || 2: cli-external-orchestration c=0.949 cmd=- pol=- || 3: sk-code c=0.88
F3 [exit 0 live] n=2 amb=true | system-deep-loop c=0.9283 u=0.16 route/single/review cmd=/deep:review pol=ask kind=skill || 2: sk-code c=0.95 cmd=- pol=-
F4 [exit 0 live] n=1 amb=false | system-deep-loop c=0.9059 u=0.12 route/single/research cmd=/deep:research pol=ask kind=skill
F5 [exit 0 live] n=3 amb=false | system-deep-loop c=0.95 u=0.12 route/single/review cmd=/deep:review pol=ask kind=skill || 2: sk-code c=0.832 cmd=- pol=- || 3: cli-external-orchestration c=0.82
F6 [exit 0 live] n=3 amb=false | system-deep-loop c=0.95 u=0.12 route/single/review cmd=/deep:review pol=ask kind=skill || 2: sk-code c=0.878 cmd=- pol=- || 3: cli-external-orchestration c=0.82
F8 [exit 0 live] n=1 amb=false | system-deep-loop c=0.9356 u=0.12 route/single/research cmd=/deep:research pol=ask kind=skill
F12 [exit 0 live] n=3 amb=true | system-deep-loop c=0.934 u=0.16 defer/-/- cmd=/deep:review pol=ask kind=skill || 2: sk-code c=0.95 cmd=- pol=- || 3: sk-doc c=0.82
F13 [exit 0 live] n=3 amb=true | system-deep-loop c=0.82 u=0.16 defer/-/- cmd=/deep:research pol=ask kind=skill FLOORED || 2: cli-external-orchestration c=0.819 cmd=- pol=- || 3: sk-prompt c=0.82
H1e [exit 0 live] n=3 amb=false | system-deep-loop c=0.95 u=0.12 route/single/review cmd=/deep:review pol=ask kind=skill || 2: system-spec-kit c=0.8938 cmd=- pol=- || 3: sk-code c=0.82
X1 [exit 0 live] n=2 amb=false | system-deep-loop c=0.9438 u=0.12 route/single/research cmd=/deep:research pol=ask kind=skill || 2: cli-external-orchestration c=0.82 cmd=- pol=-
X2 [exit 0 live] n=2 amb=false | system-deep-loop c=0.9494 u=0.12 route/single/review cmd=/deep:review pol=ask kind=skill || 2: sk-code c=0.8312 cmd=- pol=-
N1 [exit 0 live] n=3 amb=false | sk-doc c=0.95 u=0.12 route/single/sk-create-readme cmd=- pol=- kind=skill || 2: sk-code c=0.82 cmd=- pol=- || 3: system-spec-kit c=0.82
N2 [exit 0 live] n=2 amb=false | system-deep-loop c=0.8706 u=0.16 defer/-/- cmd=- pol=- kind=skill || 2: cli-external-orchestration c=0.82 cmd=- pol=-
N3 [exit 0 live] n=1 amb=false | sk-code c=0.899 u=0.12 route/surfaceBundle/sk-code-review+sk-code-skilled cmd=- pol=- kind=skill
N4 [exit 0 live] n=1 amb=false | sk-git c=0.8608 u=0.12 -/-/- cmd=- pol=- kind=skill
N5 [exit 0 live] n=1 amb=false | sk-git c=0.9451 u=0.12 -/-/- cmd=- pol=- kind=skill
N6 [exit 0 live] n=3 amb=true | system-deep-loop c=0.8737 u=0.16 defer/-/- cmd=- pol=- kind=skill || 2: sk-code c=0.8621 cmd=- pol=- || 3: command-doctor-deep-loop c=0.82
N8 [exit 0 live] n=3 amb=false | sk-code c=0.9361 u=0.12 route/single/sk-code-review cmd=- pol=- kind=skill || 2: system-deep-loop c=0.82 cmd=- pol=- || 3: sk-doc c=0.82
N10 [exit 0 live] n=1 amb=false | system-deep-loop c=0.8573 u=0.12 defer/-/- cmd=- pol=- kind=skill
N12 [exit 0 live] n=0 amb=false | NONE
N13 [exit 0 live] n=3 amb=false | sk-doc c=0.95 u=0.12 route/single/sk-create-readme cmd=/create:readme pol=start kind=skill || 2: system-spec-kit c=0.82 cmd=- pol=- || 3: mcp-tooling c=0.82
N14 [exit 0 live] n=3 amb=false | sk-code c=0.9002 u=0.12 route/single/sk-code-review cmd=- pol=- kind=skill || 2: system-deep-loop c=0.82 cmd=- pol=- || 3: sk-doc c=0.82
N15 [exit 0 live] n=3 amb=false | system-deep-loop c=0.8525 u=0.16 defer/-/- cmd=- pol=- kind=skill || 2: system-spec-kit c=0.82 cmd=- pol=- || 3: sk-code c=0.82
A2 [exit 0 live] n=3 amb=false | sk-code c=0.859 u=0.22 defer/-/- cmd=- pol=- kind=skill || 2: mcp-tooling c=0.82 cmd=- pol=- || 3: sk-doc c=0.82
A7 [exit 0 live] n=3 amb=false | sk-code c=0.859 u=0.22 defer/-/- cmd=- pol=- kind=skill || 2: mcp-tooling c=0.82 cmd=- pol=- || 3: sk-doc c=0.82
H3a [exit 0 live] n=1 amb=false | command-speckit-ai-council c=0.8844 u=0.12 -/-/- cmd=/speckit:ai-council pol=ask kind=command
H4 [exit 0 live] n=0 amb=false | NONE
H5 [exit 0 live] n=3 amb=true | sk-code c=0.95 u=0.16 route/single/sk-code-review cmd=- pol=- kind=skill || 2: sk-doc c=0.95 cmd=- pol=- || 3: system-deep-loop c=0.82
H3b [exit 0 live] n=1 amb=false | system-deep-loop c=0.82 u=0.16 defer/-/- cmd=- pol=- kind=skill FLOORED
K1 [exit 0 live] n=1 amb=false | sk-prompt c=0.8217 u=0.12 -/-/- cmd=- pol=- kind=skill
K2 [exit 0 live] n=0 amb=false | NONE
K3 [exit 0 live] n=3 amb=false | system-deep-loop c=0.82 u=0.2 defer/-/- cmd=- pol=- kind=skill FLOORED || 2: cli-external-orchestration c=0.82 cmd=- pol=- || 3: system-spec-kit c=0.82
K5 [exit 0 live] n=3 amb=false | sk-code c=0.9023 u=0.12 route/single/sk-code-review cmd=- pol=- kind=skill || 2: system-deep-loop c=0.82 cmd=- pol=- || 3: sk-doc c=0.82
K6 [exit 0 live] n=3 amb=true | system-spec-kit c=0.95 u=0.16 -/-/- cmd=- pol=- kind=skill || 2: sk-code c=0.9003 cmd=- pol=- || 3: system-deep-loop c=0.82
N7 [exit 0 live] n=1 amb=false | command-doctor-deep-loop c=0.8 u=0.34 -/-/- cmd=/doctor:deep-loop pol=run kind=command
D1 [exit 0 live] n=3 amb=false | system-deep-loop c=0.9487 u=0.12 route/single/review cmd=/deep:review pol=ask kind=skill || 2: sk-code c=0.82 cmd=- pol=- || 3: command-doctor-deep-loop c=0.8
V7 [exit 0 live] n=3 amb=true | sk-doc c=0.95 u=0.16 route/single/sk-create-manual-testing-playbook cmd=/create:manual-testing-playbook pol=start kind=skill || 2: system-deep-loop c=0.95 cmd=- pol=- || 3: sk-code c=0.95
A3 [exit 0 live] n=2 amb=false | system-deep-loop c=0.82 u=0.2 defer/-/- cmd=- pol=- kind=skill FLOORED || 2: sk-doc c=0.82 cmd=- pol=-
```

What the block shows, by the `group` field in the probe file:
- **gain** (V6, H1a, H1b, E1, E3): five explicit loop asks, five `cmd=-`. V6, H1a and H1b already route to one mode. E1 and E3 defer.
- **stage-one** (R2, V2, V4, H7, H10): five explicit loop asks where the hub never tops.
- **lose** (R7): depth wording only, and it prints `cmd=/deep:research pol=ask`.
- **lose-n9** (N9): a summary of a past run that names "deep research" and prints `cmd=/deep:research pol=ask`.
- **no-gain** (V3, V8, V5, R2b, R3, R3b, R6, A1, A4, A8, H6, H8, H9): depth wording only, and no deep command today.
- **keep** (R1 to X2): named, typed or continue requests, seventeen rows, every one with its deep command.
- **negative** (N1 to H5): seventeen rows that ask for no loop.
- **drift** (H3b, K1, K2, K3, K5, K6) and **near-miss** (N7, D1, V7, A3): the rows the drift and corpus work aim at.

The 84-probe accuracy figures and the corpus run sit in `scratch/routing-analysis.md` section 2. This packet does not restate them as measured.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change the deep-loop command gate in `command-attach.ts` so it opens on an explicit loop ask and not on depth wording. Also let one mode cue resolve a deferred hub route when the prompt asks for the loop.
- Score explicit loop wording beside a research or review cue at stage one in `explicit.ts`, so the hub can top on a loop ask that never says "deep". Depth words do not score there.
- Add an "Offer From an Advisor Brief" section to both deep presentation files, with a pointer step in both command documents. The section covers one question, a flag table and `:auto` on a yes.
- Move the deep setup forms to the question tool with a recommended option, and make the finished-run and stuck-run messages name `--extend=N`, `--restart` and `/doctor:deep-loop`.
- Clear the drift between the advisor, the hub and the mode packets. Add the six single-probe misses as corpus near-miss rows, and replace the three deep-family holdout rows with fresh ones.

### Out of Scope
- A `proposedArgs` field on the recommendation. Decision D5 keeps the advisor carrying only the command and its policy.
- A new guard for N7, N9, D1, V7, H6 or A3. Decision D6 records them as near-miss rows instead.
- `AGENTS.md`, `CLAUDE.md` and the repo rules. The analysis proposes no change to them.
- New phrases in `hub-router.json` beyond the three loop-shaped aliases D8 names. The anchored tune rows pass and the holdout rows fail, so more anchors would fit the corpus without fixing the gap.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modify | Explicit loop gate, mode cue for a deferred route, and the council words dropped from the depth list |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modify | Stage-one loop rule beside a research or review cue; drop the `several models` boost |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts` | Modify | Gate cases for every loop-ask clause and the depth-only negatives |
| `.skilled/skills/system-skill-advisor/runtime/dist/` | Regenerate | Rebuilt so the CLI shim serves the new code |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` | Modify | Six near-miss rows; three fresh deep-family holdout rows |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | Regenerate | Recaptured after the code change |
| `.skilled/commands/deep/research.md`, `.skilled/commands/deep/review.md` | Modify | Step 0 pointer to the offer section |
| `.skilled/commands/deep/assets/deep-research-presentation.txt`, `deep-review-presentation.txt` | Modify | Offer section, question-tool setup, recommended options, Next Steps rows, `=` flag form |
| `.skilled/commands/deep/assets/deep-research.yaml`, `deep-review.yaml` | Modify | Completed-packet message and `--extend` next step |
| `.skilled/commands/deep/assets/compiled/` | Regenerate | Compiled contracts rebuilt from the edited sources |
| `.skilled/skills/system-deep-loop/SKILL.md` | Modify | One sentence naming `/doctor:deep-loop` |
| `.skilled/skills/system-deep-loop/hub-router.json`, `ROUTER.md`, `graph-metadata.json` | Modify | The three loop-shaped research aliases, then the derived intent signals and activation manifest |
| `.skilled/skills/system-deep-loop/deep-research/SKILL.md` | Modify | Depth triggers removed; Gate 2 line names the advisor CLI |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` | Modify | Depth triggers removed; attached `:auto` form |
| `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | Modify | `=` flag form in the example |

Added by the sixth round (REQ-023 to REQ-034):

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modify | Refusal leads, run-refused stuck guard, typed-command list, subject-aware named mode, -ing defect cue, bounded prefix windows, exported word lists |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modify | The same gate changes, typed row kept on a stuck run, `typed` emitted, stage-one exceptions, capped gate input, named word lists |
| `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` | Modify | New cases and the served-layer typed column |
| `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts`, `tests/command-attach-guards.vitest.ts`, `tests/python/test_skill_advisor.py` | Modify | Fixture readers, drift guard, guard cases, long-prompt cases |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modify | The doctor row withheld when the prompt refuses any run or fix |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modify | Stage-one loop rule reads the gate's subject and refusal exceptions |
| `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts`, `runtime/skill-advisor-cli.ts` | Modify | The degraded brief paths carry `command`, `policy` and `typed` |
| `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts`, `tests/handlers/advisor-recommend-typed-command.vitest.ts`, `tests/scorer/stage-one-loop-subject.vitest.ts`, `tests/subprocess-typed-fields.vitest.ts`, `tests/command-brief-golden.vitest.ts` | Create or Modify | Served-layer, stage-one and degraded-path tests |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, `runtime/tests/unit/reduce-state-refinement-other-file.vitest.ts` | Modify, Create | A refinement against another file keeps its own registry entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

Every probe requirement is checked by rerunning `scratch/probes/probes-spec-baseline.json` through `scratch/probes/probe.mjs` and reading the top row of each id.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Plain loop asks gain the command row. The top row reads `system-deep-loop` with `cmd=/deep:review pol=ask` for V6, H1a and E3, and `cmd=/deep:research pol=ask` for H1b and E1. Each prints `cmd=-` today. |
| REQ-002 | Depth-only requests carry no deep command. R7 prints `cmd=-` where it prints `cmd=/deep:research` today. V3, V8, V5, R2b, R3, R3b, R6, A1, A4, A8, H6, H8 and H9 carry no `/deep:*` command in any of their three rows. V5 ("do a thorough code review") keeps `sk-code` on `sk-code-review` as its top row. |
| REQ-003 | Named, typed and continue requests keep their command. R1, R5, V1, E2, E4, E5, E6, F3, F4, F5, F6, F8, F12, F13, H1e, X1 and X2 print the same `/deep:*` command and `pol=ask` as the baseline block. |
| REQ-004 | The negatives do not change. N1, N2, N3, N4, N5, N6, N8, N10, N12, N13, N14, N15, A2, A7, H3a, H4 and H5 print the same top skill and the same `cmd=` value as the baseline block. |
| REQ-005 | The offer is taught where the AI reads it. Both deep presentation files carry an `### Offer From an Advisor Brief` section. It asks one question through the runtime question tool. Option A is recommended and runs `:auto` with the composed flags plus `--spec-folder=<the Gate 3 answer>`. Option B runs `:confirm`. Option C is no loop. The executor is native unless the request names a `cli-*` executor or a model. Fan-out appears only when two or more executors or models are named, or independent takes are asked for. `research.md` and `review.md` each carry a step 0 that points at the section. |
| REQ-006 | The gate change is tested and served. `command-attach.vitest.ts` holds a passing case for each loop-ask clause and a passing `undefined` case for each depth word. The whole advisor vitest suite passes. `dist` is rebuilt, so the probe run prints `live` for every row. |
| REQ-007 | The command edits stay consistent. `sync-runtime-mirrors.cjs --check` and `validate-command-references.cjs` both pass. The compiled contracts under `.skilled/commands/deep/assets/compiled/` are regenerated from the edited sources. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | Explicit loop wording beside a research or review cue scores at stage one, and depth wording does not. The probe rerun records the top row of R2, V2, V4, H7 and H10. Fusion decides the winner, so each id's outcome is recorded rather than required. No id in REQ-004 changes its top skill. |
| REQ-009 | Finished and stuck runs name their way forward. The completed-packet message in `deep-research.yaml` names `--extend=N` and `--restart`. Both presentation files' Next Steps tables gain an `--extend=N` row and a `/doctor:deep-loop --scope=<mode>` row. Both YAML `next_steps` lists gain the `--extend=N` line. |
| REQ-010 | Setup runs through the question tool. Step 6 of both presentation files names the question tool in `.skilled/repo-rules/communication-handoff.md` §5 in place of `ASK with SINGLE prompt`. Q2 marks Autonomous `(Recommended)`. The first Q-Exec option marks Native `(Recommended, default)`. |
| REQ-011 | The drift rows are cleared. `ask the council`, `convene` and `several models` leave `DEPTH_WORDING`, and the `several models` boost leaves `explicit.ts`, so H3b no longer tops `system-deep-loop`. The research aliases `iterative research` and `multi-round research` reach `hub-router.json` and `ROUTER.md`, so K2 tops `system-deep-loop` on the research route. `autonomous research` was dropped after its out-of-domain replay pulled a slide-deck prompt to the hub, and ADR-007 amends this requirement to the two aliases the tree carries. `comprehensive research` and `deep investigation` leave `deep-research/SKILL.md`. `audit spec folder` and `pre-release review` leave `deep-review/SKILL.md`. The `:auto` invoke form is attached, the Gate 2 line names the advisor CLI, and both examples use `=` flags. The hub `SKILL.md` names `/doctor:deep-loop`. |
| REQ-012 | The single-probe misses are recorded. N7, N9, D1, V7, H6 and A3 each appear in `command-prompts.jsonl` as a `near-miss` row, and no new guard is added for them. |
| REQ-013 | The deep-family holdouts are fresh. The three deep-family `holdout` rows are replaced by rows a separate worker writes after tuning. No builder reads a `holdout` row. |
| REQ-014 | N9 ("summarize the research.md from the last deep research run") carries no deep command after the build. This is kept apart from REQ-002 because D2 keeps "deep research" as a loop ask and D6 rules out a guard for N9. See Open Questions. |
| REQ-015 | A spelled-out refusal withholds the command. "don't do deep research, just answer quickly", "never run deep research on this", "no need to run a deep review here", "I'm not asking for a deep review, just explain the bug", "no deep review, please; explain the bug" and "a deep review is not needed, just check the diff" carry no `/deep:*` command, and "do a deep review of the parser" keeps `/deep:review`. |
| REQ-016 | A question about the loop carries no command. "how many iterations does deep research run by default?" and "how many passes does the deep review do" carry no `/deep:*` command. |
| REQ-017 | Spelling variants keep the command. "run a deep-review of the auth module" gets `/deep:review`, and "I’d like a research loop on cache eviction policies", with a curly apostrophe, gets `/deep:research`. |
| REQ-018 | A negated symptom is not a stuck run. "the deep research run is not stuck, run 5 more iterations" gets `/deep:research`, not `/doctor:deep-loop`. |
| REQ-019 | A loop name that names the loop's own code or results, and a count that describes a subject, carry no command (D2 as narrowed by ADR-004). "refactor the deep research scorer", "fix the bugs the deep review found", "open the review loop config", "we need a review loop for every PR", "I want a review loop that approves PRs automatically", "compare 10 iterations of the model and review the results", "research three-pass vs two-pass compilers", "several passes of the linter failed, review the config" and "review our multi-pass compiler" carry no `/deep:*` command. "run a deep review on the parser", "do 5 research iterations on caching" and "review the parser in several passes" keep theirs. |
| REQ-020 | The Python typed-command check agrees with the TypeScript one at the gate layer. For "don't run /deep:review, explain the review loop", "what does /deep:review do?" and "see (/deep:review.md) for the flags", `_apply_deep_loop_offer_gate` with a typed row returns what `attachCommand` returns: no run command. For "my deep review run is stuck, /deep:review again", both copies read a stuck run (`isStuckRunComplaint` and `is_stuck_run_complaint` agree), and `attachCommand` alone answers `/doctor:deep-loop`. By operator decision (ADR-005), a typed command outranks the stuck diagnosis on the served head, so the native brief keeps the typed `/deep:review` with policy `ask`. The served result of that prompt, and the Python fallback's alignment with it, is REQ-029. |
| REQ-021 | Nothing earlier regresses. Every REQ-015 to REQ-020 prompt is in the shared fixture, both suites pass, the TypeScript and Python predicate comparison shows drift 0, every gain, keep and stage-one line of the 69-probe rerun keeps its command, and the corpus `false_offer` count stays 0. |
| REQ-022 | The docs say what was measured. The v4.2.0.0 changelog no longer says refused asks are skipped before they are, names packet 013's brief change and quotes the final suite count, and AC-008 reads `Waived` with ADR-003. |
| REQ-023 | Common refusal verbs withhold the command in both copies. "skip the deep review and just answer", "avoid deep research; answer from memory", "there is no need for a deep review", "instead of a deep review, just explain the bug", "I refuse a deep review here" and "do not even think about running a deep review" carry no `/deep:*` command. "skip straight to the deep review of the parser", "don't hesitate to run a deep review" and "don't forget to run a deep review on the parser" keep `/deep:review`. |
| REQ-024 | A stuck-run complaint that refuses any run or fix gets no `/doctor:deep-loop`. "the deep research run is stuck. please don't run anything" and "my deep research run is stuck and I don't want a fix" carry no doctor command from `attachCommand` or from the fused command row, and the Python fallback drops its doctor row on both. "my deep research run is stuck" keeps `/doctor:deep-loop`. |
| REQ-025 | A typed deep command survives a second typed command. "run /deep:review on the parser, then /create:changelog" and "/deep:review the parser and then /doctor:deep-loop" keep `/deep:review` from `attachCommand` on a review route and on the served head, as the Python gate already does. `typedCommandIn` keeps its longest-key result for every other caller. |
| REQ-026 | The deferred-route mode cue reads only loop names that are asks. "run a deep loop to review the research loop config" gets `/deep:review` on a deferred route, not `/deep:research`, and "run a deep loop checking the parser for bugs" gets `/deep:review`, because the defect-check cue reads its -ing forms. |
| REQ-027 | The stage-one loop rule honours the gate's subject and refusal readings. "several passes of the linter failed, review the config" no longer tops `system-deep-loop` with no command (measured 2026-11-24 on this tree: the head holds `sk-code` at 0.8754 and `sk-doc` at 0.82, neither with a command, and the hub is not among them), while "review the parser in several passes" keeps the hub with `/deep:review`. The Python stage-one copy `_is_loop_workflow_request` reads the same exceptions. No REQ-004 id changes its top skill. |
| REQ-028 | A typed deep command shows plain `(ask)` on both degraded brief paths. On the CLI degraded path (`degradedRecommendations`) and on the Python subprocess path (`parseRecommendations`), "/deep:review:confirm the auth module" renders `/deep:review (ask)` with no `A ` option text. This corrects the degraded half of packet 013's REQ-006. |
| REQ-029 | The typed-on-stuck exception is pinned where the reader sees it. "my deep review run is stuck, /deep:review again" keeps `/deep:review` with policy `ask` and `typed: true` on the native served head (`attachTypedCommand`), and the Python fallback keeps its typed run row on a stuck complaint, so both served heads agree (ADR-005). A serving-layer test asserts the native result, and a shared fixture column read by both suites asserts the served result on every typed case. |
| REQ-030 | Long prompts stay cheap. The Python gate reads the same 10,000-code-unit head the native schema accepts, and the per-match prefix scans in both copies test a bounded window instead of the whole prefix. A 96,000-character prompt runs the Python gate in under one second, a 10,000-character prompt of repeated "do not run /deep:review." stays withheld in both copies, and no fixture case changes its result. |
| REQ-031 | The vocabulary drift guard covers every word list. The count words, run symptoms, artifact-after nouns, past-run read verbs and iterative verbs are exported arrays in `command-attach.ts` that build their patterns, and named lists in `skill_advisor.py` that build theirs. A test fails when the two copies of any list differ, and every list entry has a fixture case that uses it. |
| REQ-032 | A refinement filed against another file keeps its own registry entry. When a deep-review finding `refines` an earlier one but names a different file or dimension, the reducer keeps it as its own finding with the `refines` link, and the target keeps its own title and location. A refinement at the same file still folds into its target. |
| REQ-033 | The review's coverage gate passes. After the build, a deep-review rerun on this packet with traceability as its focus finishes `spec_code` and `checklist_evidence`, and its terminal gates read evidence, scope and coverage pass. |
| REQ-034 | The closure docs match the built behaviour. The fixture header names which layer each typed column pins. Implementation-summary limitations 6 and 7 and the fifth-round "A stuck run drops the run row" line are rewritten, the v4.2.0.0 changelog names the typed-on-stuck exception and the new refusal verbs, the tasks.md checklist evidence and Verification Summary agree with the boxes they count, and packet 013 records the degraded-path evidence for its REQ-006. |

### Reopened after a fresh review

A fresh review on 2026-11-23 found gate gaps outside the probe set. Six of them, reproduced through the Claude prompt hook at `a5d054a2f1c`:

```text
[don't do deep research, just answer quickly] => use system-deep-loop → /deep:research (ask: A /deep:research:auto (Recommended), B /deep:research:confirm, C no loop) 0.90/0.12 pass.
[no need to run a deep review here] => ambiguous: system-deep-loop → /deep:review (ask: A /deep:review:auto (Recommended), B /deep:review:confirm, C no loop) 0.95/0.16 vs sk-code 0.90/0.12 pass.
[/deep:review:confirm the auth module] => use system-deep-loop → /deep:review (ask: A /deep:review:auto (Recommended), B /deep:review:confirm, C no loop) 0.94/0.12 pass.
[run a deep-review of the auth module] => use system-deep-loop 0.95/0.12 pass.
[how many iterations does deep research run by default?] => use system-deep-loop → /deep:research (ask: A /deep:research:auto (Recommended), B /deep:research:confirm, C no loop) 0.93/0.12 pass.
[the deep research run is not stuck, run 5 more iterations] => use system-deep-loop → /doctor:deep-loop (run) 0.93/0.12 pass.
```

The typed-suffix hint is packet 013's to fix. REQ-015 to REQ-022 cover the rest.

### Reopened after a three-lineage deep review

A deep review on 2026-11-24 (`review/review-report.md`, three Opus lineages of five iterations) returned FAIL on its coverage gate, with no P0, one P1 found twice and eighteen P2. The P1 is a closure-record gap: REQ-020, SC-005 and AC-027 stated typed-command parity and hook results without the typed-on-stuck exception the operator had confirmed on 2026-11-23. That docs fix is made in this round's planning pass (REQ-020, SC-005, AC-027, AC-008, ADR-005). REQ-023 to REQ-034 cover the P2 findings, the bare-loop-name decision (ADR-006), the registry fold that lost two structured findings, and the coverage rerun.

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Plain loop asks with a command row go from 0 of 5 to 5 of 5 on the gain group (V6, H1a, H1b, E1, E3) of the probe rerun.
- **SC-002**: Depth-only false offers go from 1 to 0. R7 is the one case, and no row in the no-gain group gains a `/deep:*` command.
- **SC-003**: The keep and negative groups, 34 rows in all, print the same top skill and `cmd=` value as the baseline block.
- **SC-005**: Every REQ-015 to REQ-020 prompt gives its stated result through the prompt hook, with the 69-probe and corpus results unchanged. One prompt is an operator-confirmed exception (ADR-005): "my deep review run is stuck, /deep:review again" prints the typed `system-deep-loop → /deep:review (ask)` on the head, because a typed command outranks the stuck diagnosis on the served head (`scratch/probes/fresh-review-hook.txt:28`).
- **SC-006**: Every REQ-023 to REQ-031 prompt gives its stated result in both suites through the shared fixture, the deep-review rerun of REQ-033 passes its coverage gate, and the 69-probe and corpus results stay unchanged apart from the intended moves REQ-027 names.
- **SC-004**: The recaptured routing baseline's `false_offer` and `false_offer_attached` counts, taken over the rows that existed before this packet, equal the counts captured before the code change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The rebuilt advisor `dist`. The CLI shim refuses a stale one | Every probe and corpus check fails without it | Rebuild with `npm run build` in the advisor runtime, then confirm the probe run prints `live` |
| Risk | The stage-one rule in `explicit.ts` scores every prompt on every runtime | High: a new rule can move an unrelated top skill | The negative group and the corpus recapture both gate it. Reject the change if any REQ-004 id moves |
| Risk | A new hub alias pulls an unrelated prompt | Medium: an earlier "research run" alias did this | Replay each new alias against an out-of-domain phrase, per `.skilled/repo-rules/skill-hub-routing.md` §4 |
| Risk | The near-miss rows raise the corpus false-offer totals by construction. N7 and D1 still put a command bridge in the top three (`false_offer`), and N9, D1 and V7 still attach or carry a command (`false_offer_attached`), with no guard | Low: the count reads as a regression | Compare the counts over the rows that existed before. Record the new rows' outcome on their own |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The gate and the stage-one rule add only in-memory regular-expression tests, with no file or network I/O.
- **NFR-P02**: N/A for throughput. The advisor serves one prompt per call.

### Security
- **NFR-S01**: The `run` policy never starts a deep command. Both `/deep` commands keep `ask`, as their `ask_first: ["spend"]` metadata derives.
- **NFR-S02**: N/A for data protection. No credential or user data is read or written.

### Reliability
- **NFR-R01**: All 69 probes exit 0 with `live` freshness on the rerun, as they do in the baseline block.
- **NFR-R02**: The whole advisor vitest suite passes with zero failures.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt with no loop ask and no depth word, such as N10 ("how does the deep loop decide to stop?"), carries no command, as it does today.
- Maximum input: at the attach step, a prompt that holds both a loop ask and a depth word opens the gate on the loop ask. A prompt that names both research and review cues does not resolve a deferred route, so it carries no command. Both are unit cases in `command-attach.vitest.ts`, because whether such a prompt reaches the hub at all is the scorer's call.
- Failure path: a refusal to run, such as N6 ("don't run /deep:review"), carries no command. The no-edit guard holds before the mode-cue path.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | About 20 files across the advisor runtime, two commands and one hub. The code change is two TypeScript files. |
| Risk | 15/25 | A scoring lane that every prompt passes through, on every runtime |
| Research | 6/20 | Done. 84 probes in `scratch/routing-analysis.md` and the baseline block above |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- N9 names "deep research", which D2 keeps as a loop ask, and D6 rules out a guard for it. REQ-014 asks that N9 lose its command, but nothing in the five lanes is designed to drop it. If the rerun still shows `cmd=/deep:research` on N9, the operator decides between a waiver recorded in `decision-record.md` and a narrower reading of "names deep research", such as requiring a run verb.
- K3 ("start an autonomous research session ... let it run overnight") would have carried the alias `autonomous research`, which was dropped after its out-of-domain replay (ADR-007), and it carries no D2 loop ask. Should it gain the command? The packet assumes no, so K3 is recorded and not required.
<!-- /ANCHOR:questions -->

---

