---
title: "Implementation Plan: Phase 5: weak-model-authoring-card"
description: "One 172-line card replaces the 1,200-line template guide as the load for the four authoring intents, and a sync guard plus a vocabulary test make the card, the router, the inventory and the checklist fail together when one drifts."
trigger_phrases:
  - "weak model authoring card plan"
  - "spec authoring card text"
  - "router intent card rows"
  - "card sync guard"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: weak-model-authoring-card

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Bash, jq, awk, ripgrep, Node |
| **Framework** | system-spec-kit router, validator and leaf inventory |
| **Storage** | JSON inventory files and one markdown card |
| **Testing** | A shell guard, a vitest test that runs it, the vocabulary test, and three Level 1 smoke runs |

### Overview
The conductor copies one frozen card into `references/workflows/spec-authoring-card.md`, then changes four router rows so the authoring intents load the card instead of the long guide. Two generated inventory files are regenerated, one checklist line and one template line change, and a new shell guard plus a vitest test hold the four surfaces together. Three smoke runs measure whether a weak model can finish a Level 1 packet from the card alone.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 003 and 004 are closed on the tree this phase runs against, and `rg -c 'SPECKIT_TEMPLATE_SOURCE:.*\| v2\.3 -->' $S/templates/core/*.tmpl` prints a count for each of the four core templates
- [ ] The launch preconditions in `../spec.md` section 3 are recorded as met in `../goal.md` section 4
- [ ] `tasks.md` T001 to T003 are done: provider check, worktree check, locator pre-check

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this phase> --strict` prints `RESULT: PASSED`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` prints `CARD SYNC OK`
- [ ] `git status --porcelain` lists nothing outside this phase folder and the nine declared files
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One short default load, one long on-demand load, and a guard that reads all four surfaces that name them.

### Key Components
- **The card**: one markdown file under `references/workflows/`. It is the only authoring doc the four intents load.
- **The router**: `RESOURCE_MAP` in `SKILL.md`. Four intent rows change from the guide to the card.
- **The inventory**: `leaf-manifest.json` lists every routable leaf. `leaf-aliases.json` is its identity projection. Both are generated, never hand-edited.
- **The guard**: `runtime/cli/spec/check-card-sync.sh`. It reads the card, the router, the inventory and the checklist and fails on the first disagreement.
- **The vocabulary test**: `workflow-invariance.vitest.ts`. It bans four words on public surfaces. The card must pass it.

### 3.1 The card text (frozen)

Copy the block below into `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`, character for character, without the outer four-backtick fence. Do not rewrite a sentence. Do not add a section. The file is 172 lines and the guard fails above 260.

````markdown
---
title: Spec Authoring Card
description: The short path a model follows to write one spec packet that passes strict validation with no unfilled tokens.
trigger_phrases:
  - "spec authoring card"
  - "write a spec packet"
  - "spec folder authoring steps"
  - "fill a spec scaffold"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Spec Authoring Card

This card is the short path. Follow the steps in order. Each step has one action, one acceptance line and one command. When the command prints what the acceptance line says, go to the next step.

`references/templates/template-guide.md` is the long guide. Read it only when this card sends you there.

## 1. BOUNDS

You write one packet, in one folder. The folder is the one `create.sh` prints.

Allowed writes: the packet folder and its `scratch/` folder.
Forbidden: `git commit`, `git push`, `git checkout`, `git switch`, `git branch`, `git reset`, `git stash`, `generate-context.js`, `/speckit:save`. Do not edit `.skilled/`, another packet or a source file. Do not run `create.sh` twice.

Acceptance: you can name the packet folder and the one command you will run to check it.
Verify: `pwd` prints the repository root, and `ls <packet folder>` lists `spec.md`.

## 2. PICK THE LEVEL

Run the level helper first.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc <lines> --files <count>
```

Use the level it prints. Do not raise the level yourself. The level decides which files the packet needs.

| Level | Files the packet needs |
|-------|------------------------|
| 1 | `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` once implementation starts |
| 2 | the Level 1 files plus `acceptance-criteria.md` |
| 3 | the Level 2 files plus the architecture sections and a decision record when one is written |

Acceptance: the level in the scaffold header matches the level the helper printed.
Verify: `rg -n 'SPECKIT_LEVEL' <packet folder>/spec.md` prints one line with that level.

## 3. SCAFFOLD

Create the packet with one command. Keep `--skip-branch` so no git state changes.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level <level> --track <track> --short-name <two-to-four-words> "<one sentence>"
```

The command prints the folder it made. Use that path for every later command.

Acceptance: the folder holds `spec.md`, `plan.md`, `tasks.md` and `scratch/`.
Verify: `ls <packet folder>` lists those names.

## 4. READ BEFORE YOU WRITE

Open one rendered example at the same level under `.skilled/skills/system-spec-kit/templates/examples/level-<level>/`. Read `spec.md` and `tasks.md`.

Do not copy from a `.tmpl` file. A `.tmpl` file carries tokens and gate markers. The examples are filled and safe to imitate for shape.

Each section of your scaffold carries a fill note. The note says what that section needs. Read the note before you write the section. The note is the contract for that section.

Acceptance: you can say, in one sentence, what the first section of `spec.md` must contain.
Verify: `sed -n '1,40p' <packet folder>/spec.md` shows the fill notes.

## 5. ONE ACTION PER SECTION

Each section does one job. Write one idea per paragraph. Do not repeat the same fact in two sections.

- `spec.md` states the problem, the scope, the requirements and the success criteria.
- `plan.md` states the approach, the files to change, the test plan and the dependencies.
- `tasks.md` states the ordered actions.
- `implementation-summary.md` states what changed and how it was checked. Write it last.

Do not put a task list in `spec.md`. Do not put requirements in `plan.md`.

Acceptance: every heading in the packet has content under it, and no heading holds content that belongs to another heading.
Verify: `rg -n '^## ' <packet folder>/spec.md <packet folder>/plan.md` lists the headings you filled.

## 6. THE PLAN SHAPE

A plan has 3 or 4 steps. More than 4 steps means the feature is too large for one packet. Split it or raise the level.

Each step carries three lines:
1. What the step does.
2. The acceptance line: what is true when the step is done.
3. The verify command: the command a reader runs, and the text it prints.

```markdown
### Step 1: Add the flag parser

Acceptance: `--quiet` is accepted and the default output is unchanged.
Verify: `bash script.sh --quiet` prints one line.
```

Acceptance: `plan.md` holds 3 or 4 steps, and each step has an acceptance line and a verify command.
Verify: `rg -c '^### Step ' <packet folder>/plan.md` prints 3 or 4.

## 7. TASK LINES

Every task line has one action, one file and one verify clause.

```markdown
- [ ] T001 Add the quiet flag to the option parser (`runtime/cli/spec/script.sh`). Verify: `bash runtime/cli/spec/script.sh --quiet` prints one line.
```

Rules:
- One action per task.
- Name the file in parentheses.
- End with `Verify:` and the command plus its expected output.
- Put the tasks in the order you will run them.
- Mark a task `[x]` only after its verify command printed the expected output.

Acceptance: every task line ends with a `Verify:` clause.
Verify: `rg -c 'Verify: ' <packet folder>/tasks.md` and `rg -c '^- \[ \] T[0-9]' <packet folder>/tasks.md` print the same number.

## 8. FILL EVERY TOKEN

A scaffold stamped `v2.3` or later carries tokens. A token starts with `[YOUR_VALUE_HERE:` and ends at the next closing bracket. Replace the whole token, brackets included, with real content. Do not leave a token in a finished packet.

If you cannot answer a question the token asks, write `UNKNOWN` in its place and write an open question in `goal.md` section 4.

A token in a packet whose `spec.md` says `Status: Draft` is a warning, so strict validation can pass with tokens still in the file. A token in any other status is an error. Do not use the warning as permission. Count the tokens.

Acceptance: the count is 0.
Verify: `rg -o '\[YOUR_VALUE_HERE: ' <packet folder>/spec.md <packet folder>/plan.md <packet folder>/tasks.md | wc -l` prints 0.

## 9. VALIDATE

Run the validator before you claim the packet is done.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet folder> --strict
```

The last line must be `RESULT: PASSED`. Read the summary line above it. `Errors: 0` is the pass condition. Warnings do not block the pass, but read them.

When it fails, read the first failing rule. Fix that rule only. Run the command again. Stop after three fixes on the same rule and write the rule and the error in the packet's `goal.md`.

Acceptance: the command prints `RESULT: PASSED` and `Errors: 0`.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet folder> --strict | tail -1` prints `RESULT: PASSED`.

## 10. CLOSE

A packet is closeable when:
- every required file exists for its level
- every token is filled, or replaced with `UNKNOWN` and an open question in `goal.md`
- `tasks.md` has no `[B]` line
- `implementation-summary.md` names the files that changed
- `validate.sh --strict` prints `RESULT: PASSED`

Acceptance: all five are true.
Verify: run the five commands in this card in order, then run the validator once more. The last line prints `RESULT: PASSED`.

## 11. WHEN TO STOP AND ASK

Stop and write the question in `goal.md` when:
- two documents in the packet state opposite rules
- a command in the plan would write outside the packet folder
- the validator fails on the same rule after three fixes
- the feature needs more than 4 plan steps

Acceptance: the question is written in `goal.md` as `Open question:` under the rule or command that raised it.
Verify: `rg -n 'Open question:' <packet folder>/goal.md` prints at least one line.
Do not guess. A written question is a finished step. A guess is a defect.
````

### 3.2 Router edits

Four rows change in `RESOURCE_MAP`. Each old text below occurs once in `SKILL.md`, checked with a Node count before this plan was written. `$S` is `.skilled/skills/system-spec-kit`.

| # | Intent | Old text | New text |
|---|--------|----------|----------|
| R1 | PLAN | `    "PLAN": [` then `        "references/templates/template-guide.md",` | `    "PLAN": [` then `        "references/workflows/spec-authoring-card.md",` |
| R2 | IMPLEMENT | `        "references/validation/template-compliance-contract.md",` then `        "references/templates/template-guide.md",` then `        "assets/template-mapping.md",` | the same first and last line, with `        "references/workflows/spec-authoring-card.md",` between them |
| R3 | INTAKE | `    "INTAKE": [` then `        "references/workflows/intake-contract.md",` then `        "references/templates/template-guide.md",` | the same first two lines, then `        "references/workflows/spec-authoring-card.md",` |
| R4 | TEMPLATE_AUTHORING | `    "TEMPLATE_AUTHORING": [` then `        "references/templates/template-style-guide.md",` then `        "references/templates/template-guide.md",` | the same first two lines, then `        "references/workflows/spec-authoring-card.md",` |

The leading four spaces belong to the intent header. The eight spaces belong to a list entry. Copy both exactly.

#### Copy-paste pairs

R1 old:

```text
    "PLAN": [
        "references/templates/template-guide.md",
```

R1 new:

```text
    "PLAN": [
        "references/workflows/spec-authoring-card.md",
```

R2 old:

```text
        "references/validation/template-compliance-contract.md",
        "references/templates/template-guide.md",
        "assets/template-mapping.md",
```

R2 new:

```text
        "references/validation/template-compliance-contract.md",
        "references/workflows/spec-authoring-card.md",
        "assets/template-mapping.md",
```

R3 old:

```text
    "INTAKE": [
        "references/workflows/intake-contract.md",
        "references/templates/template-guide.md",
```

R3 new:

```text
    "INTAKE": [
        "references/workflows/intake-contract.md",
        "references/workflows/spec-authoring-card.md",
```

R4 old:

```text
    "TEMPLATE_AUTHORING": [
        "references/templates/template-style-guide.md",
        "references/templates/template-guide.md",
```

R4 new:

```text
    "TEMPLATE_AUTHORING": [
        "references/templates/template-style-guide.md",
        "references/workflows/spec-authoring-card.md",
```

### 3.3 One prose sentence in `SKILL.md`

The sentence at line 95 claims every leaf is named under an intent. After R1 to R4 that is false for the guide, so the sentence changes with them.

Old text, one line, occurs once:

```text
The `RESOURCE_MAP` below names every leaf in that manifest under at least one intent, so each reference and asset is reachable through the router as well as by browsing; the manifest stays the inventory, and a leaf added to the corpus without an intent is a routing gap to close, not a browse-only tier.
```

New text, three sentences:

```text
The `RESOURCE_MAP` below names every leaf in that manifest under at least one intent, so each reference and asset is reachable through the router as well as by browsing. The one exception is `references/templates/template-guide.md`, which the `ON_DEMAND` level loads on request. The manifest stays the inventory, and a leaf added to the corpus without an intent is a routing gap to close, not a browse-only tier.
```

The `ON_DEMAND` list already holds the guide at line 295. This phase does not change that list.

### 3.4 Tasks template edit

`templates/core/tasks.md.tmpl` line 52 declares the task format. It gains the `Verify:` slot.

| Old text | New text |
|----------|----------|
| ``**Task Format**: `T### [P?] Description (file path)` `` | ``**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>` `` |

Both texts are one line and the old text occurs once.

The three files under `templates/examples/*/tasks.md` keep their current format lines. Phase 004's drift guard is not in the tree when this plan was written, so no skeleton check requires them to change. If phase 004 adds a guard that compares the four declarations, that guard owns the example edits.

### 3.5 The sync guard

The full source of `runtime/cli/spec/check-card-sync.sh` is frozen in `tasks.md` T009. The script resolves the skill root from its own location, so it runs from any directory, and it prints one PASS or FAIL line per check.

### 3.6 Wiring

The script is wired in two places, the two conventions the tree uses for a repo-level guard.

1. `runtime/cli/spec/README.md`, package topology block, after the `check-template-staleness.sh` line:

   Old text: `+-- check-template-staleness.sh  # Compare generated docs with templates`
   New text: the same line, then a new line `+-- check-card-sync.sh           # Assert the authoring card, router, inventory and checklist agree`

2. `runtime/cli/tests/card-sync.vitest.ts`, a new test that spawns the guard and asserts exit 0:

```ts
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(TEST_DIR, '..', '..', '..');
const GUARD = path.join(SKILL_ROOT, 'runtime', 'cli', 'spec', 'check-card-sync.sh');

describe('authoring card sync', () => {
  it('keeps the card, the router, the inventory and the checklist in agreement', () => {
    const output = execFileSync('bash', GUARD, { cwd: SKILL_ROOT, encoding: 'utf8' });
    expect(output).toContain('CARD SYNC OK');
  });
});
```

`rg -n 'check-' $S/package.json` prints nothing on this tree, so there is no npm-script convention to follow. The two places above are the conventions that do exist: the package topology list in `runtime/cli/spec/README.md` and the vitest suite under `runtime/cli/tests/`.

### 3.7 Checklist edit

`references/workflows/spec-folder-authoring-checklist.md` line 36 sends a reader to the templates root, where the `.tmpl` sources carry tokens.

| Old text | New text |
|----------|----------|
| ``- [ ] Read templates from `.skilled/skills/system-spec-kit/templates/` and the manifest entries under `.skilled/skills/system-spec-kit/templates/`.`` | ``- [ ] Read one rendered example under `.skilled/skills/system-spec-kit/templates/examples/` or a fresh `create.sh` scaffold. Do not copy from a `.tmpl` source: it carries unfilled tokens.`` |

Both texts are one line and the old text occurs once.

### Data Flow
`SKILL.md` intent, then `RESOURCE_MAP` row, then the card, then the packet. The guard reads the same four files in the opposite direction and stops at the first surface that does not name the card.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `references/templates/template-guide.md` | Default load for four authoring intents | unchanged content, moved out of the intent lists and still listed in `ON_DEMAND` | guard check `guide-on-demand-only` |
| `SKILL.md` `RESOURCE_MAP` | Maps intent to doc | four rows change | guard checks `intent-PLAN` to `intent-TEMPLATE_AUTHORING` |
| `leaf-manifest.json` | Inventory of routable leaves | regenerate | guard check `leaf-manifest` and `generate-leaf-manifest.cjs --check` |
| `leaf-aliases.json` | Identity projection of the inventory | regenerate | guard check `leaf-aliases` |
| `references/workflows/spec-folder-authoring-checklist.md` | Pre-check guidance | one line changes | guard check `checklist` |
| `templates/core/tasks.md.tmpl` | Produces the task list of every new packet | one format line changes | `rg -c 'Verify: <command> prints <expected output>'` prints 1 |
| `runtime/cli/spec/*.sh` | Script entrypoints | one script added | `bash check-card-sync.sh` prints `CARD SYNC OK` |
| `workflow-invariance.vitest.ts` | Bans four words on public surfaces | unchanged, now reads the card too | the test passes with the card as an extra path |

Required inventories:
- Same-class producers: `rg -l 'template-guide\.md' $S --glob '!**/node_modules/**' --glob '!**/changelog/**'` listed 20 files before this plan was written. Four are router rows in `SKILL.md` and the rest are browse links. Only the four router rows change.
- Consumers of changed symbols: `rg -n 'spec-authoring-card' .skilled --glob '!**/node_modules/**'` printed nothing before this plan was written, so the card has no consumer that must change with it.
- Matrix axes: four intents by two tiers. Each intent loads the card and none loads the guide. The guide is listed once in `ON_DEMAND`.
- Algorithm invariant: a reader who follows an authoring intent never lands on a file that carries unfilled tokens. The guard fails when that invariant breaks.

### Cross-phase contracts

- Phases 006 to 009 cite the card as `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`. The name and path are frozen.
- Phase 009 may reuse the five metric names in `tasks.md` T013: `strict_passed`, `leftover_tokens`, `missing_anchors`, `out_of_scope_writes` and `seconds`. Phase 001 called the second one `leftover_hints`, so phase 009 must map the two names before it compares a delta.
- Phase 004's fill note must be readable in the scaffold a reader opens. The card says each section carries a note and does not quote its form, so any note wording fits.
- Phase 004's drift guard, if it compares the four `Task Format` declarations, must accept the `Verify:` slot this phase adds to the core template.
- A later phase that adds a router intent must add the card to it, or `check-card-sync.sh` fails. A later phase that adds a reference under `references/` must regenerate the inventory, or the generator check fails.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The guard passes on the changed tree and fails on a copy with the card removed | `check-card-sync.sh` |
| Integration | The guard runs inside the suite | `runtime/cli/tests/card-sync.vitest.ts` |
| Vocabulary | The card carries none of the four banned words | `workflow-invariance.vitest.ts` with `WORKFLOW_INVARIANCE_EXTRA_PATHS` |
| Manual | Three Level 1 packets authored from the card alone | the worker brief in `tasks.md` T012 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 prerequisite landed (v2.3 stamp and token form) | Internal | Checked in T001 | The card's token section would name a form the templates do not carry |
| Phase 004 prerequisite landed (fill notes) | Internal | Checked in T001 | The card's fill-note step would point at notes that are not there |
| `jq`, `awk`, `rg` on PATH | Internal | Checked in T001 | The guard cannot run |
| An interactive OpenCode v2 session with `llmgateway/deepseek-v4.1-flash-1017` in `opencode.json` | External | Checked in T001 | The three smoke runs cannot run |
| `cli-codex` with `gpt-6-luna` | External | Checked in T014 | The review is recorded as skipped and REQ-009 stays open |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a guard check fails after three fixes, or a file outside the nine declared paths changed.
- **Procedure**: `git diff --name-only <start commit>` lists the changed files. Restore each with `git restore --source=<start commit> -- <path>`. Delete the three created files, `references/workflows/spec-authoring-card.md`, `runtime/cli/spec/check-card-sync.sh` and `runtime/cli/tests/card-sync.vitest.ts`, with `rm`, after their paths are written in `goal.md` section 4. Regenerate the two inventory files from the restored tree with the commands in T008.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T003) ──► Card (T004) ──► Router (T005) ──┬──► Checklist (T006) ──┐
                                                       ├──► Template (T007) ───┤
                                                       └──► Inventory (T008) ──┤
                                                                               ▼
                          Guard (T009) ──► Wiring (T010) ──► Vocabulary (T011)
                                                                               │
                                       Smoke runs 1-3 (T012-T013) ─────────────┤
                                                                               ▼
                                                        Review (T014) ──► Close (T015)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Launch preconditions | Card |
| Card | Setup | Router |
| Router | Card | Checklist, Template, Inventory |
| Checklist, Template | Router | Guard |
| Inventory | Checklist, Template | Guard |
| Guard, Wiring | Inventory, Checklist, Template | Vocabulary |
| Vocabulary | Guard | Smoke runs |
| Smoke runs | Vocabulary | Review |
| Review | Smoke runs | Phase close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Card and router | Med | 1 hour |
| Inventory and guard | Med | 1 hour |
| Smoke runs | Med | 1 to 2 hours, three serial runs |
| Review and close | Low | 30 minutes |
| **Total** | | **4 to 5 hours, an assumption with no timed earlier run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Start commit hash recorded in `goal.md` section 4 before the first edit
- [ ] `git status --porcelain` saved to `scratch/status-start.txt`
- [ ] No feature flag applies, this phase ships documentation and one guard

### Rollback Procedure
1. List changed files with `git diff --name-only <start commit>`.
2. Restore each one with `git restore --source=<start commit> -- <file>`.
3. Delete `spec-authoring-card.md`, `check-card-sync.sh` and `card-sync.vitest.ts` after their paths are in `goal.md` section 4.
4. Run `generate-leaf-manifest.cjs --write $S` and `ci-skill-root-metadata.cjs --fix --skill system-spec-kit` to rebuild the inventory from the restored tree.
5. Run `git status --porcelain` and compare with `scratch/status-start.txt`.
6. Record the rollback in `goal.md` section 4.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the two inventory files are generated and rebuild from the tree
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐
│  Setup   │────►│   Card   │────►│  Router   │────►│ Inventory│
└──────────┘     └──────────┘     └─────┬─────┘     └────┬─────┘
                                        │                │
                              ┌─────────▼────────┐       │
                              │ Checklist, Tmpl  │       │
                              └─────────┬────────┘       │
                                        │                │
                              ┌─────────▼────────────────▼─┐
                              │      Guard and wiring      │
                              └─────────────┬──────────────┘
                                            │
                              ┌─────────────▼──────────────┐
                              │ Vocabulary, smoke runs,    │
                              │ review, close              │
                              └────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | Launch preconditions | Start commit, checks | Card |
| Card | Setup | `spec-authoring-card.md` | Router |
| Router | Card | Four intent rows | Inventory, guard |
| Inventory | Router | Two generated files | Guard |
| Guard | Router, Inventory, Checklist, Template | `check-card-sync.sh` | Wiring, vocabulary |
| Vocabulary | Guard | A clean card | Smoke runs |
| Smoke runs | Vocabulary | `scratch/runs/` replies and `scratch/card-bench/` metrics | Review |
| Review | Smoke runs | Findings | Phase close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Card and router** - 1 hour - CRITICAL
2. **Smoke runs** - 1 to 2 hours - CRITICAL
3. **Review and close** - 30 minutes - CRITICAL

**Total Critical Path**: about 2.5 to 3.5 hours

**Parallel Opportunities**:
- The checklist edit and the template edit run together, because they touch different files and neither reads the other.
- The inventory regeneration runs after both. The generator reads every file under `references/`, and the checklist edit writes one of them, so a generator run that starts before the edit finishes would read the old file.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup done | T001 to T003 marked `[x]` with evidence | Start of phase |
| M2 | Card and router done | The card exists at 172 lines and four intents load it | Mid phase |
| M3 | Guard green | `CARD SYNC OK` and the vitest test passes | Mid phase |
| M4 | Phase closeable | Every acceptance criterion `Met` | End of phase |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

Written for the executing swarm. Follow each rule as written. Where a rule and your own judgment disagree, follow the rule and record the disagreement in `goal.md` section 4.

### Roles
- **Conductor**: the operator's interactive OpenCode v2 session on DeepSeek V4.1 Flash max. It dispatches workers, runs every verify command, edits the nine declared paths and keeps `goal.md` section 4 current.
- **Worker**: one Task subagent, dispatched with the Task tool and inheriting the session model. One worker authors one Level 1 packet, then stops.
- **Reviewer**: one read-only frontier review through `cli-codex` at phase close. It writes nothing.

### Pre-Task Checklist
- [ ] Read this phase's `spec.md`, this plan and `tasks.md` before the first edit
- [ ] Read `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` NEVER rules 1 and 5 before the first Task dispatch
- [ ] Confirm the working directory is the build worktree recorded in `../goal.md` section 4, never the main checkout
- [ ] Confirm `rg -c 'deepseek-v4.1-flash-1017' opencode.json` prints a number above 0
- [ ] Save every brief to `scratch/briefs/<task-id>.txt` before dispatching it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run tasks in ID order. No two tasks write the same file, so no task is marked `[P]` |
| TASK-SCOPE | A worker writes only the paths under ALLOWED WRITE PATHS in its brief |
| TASK-VERIFY | The conductor runs the task's verify command and reads both its output and its exit status before marking the task `[x]` |
| TASK-LOCATE | Find text by its exact content, never by a line number. Each edit below names its old text |
| TASK-BANNED | Workers never run `git commit`, `git push`, `git checkout`, `git switch`, `git branch`, `git reset`, `git stash`, `generate-context.js` or `/speckit:save` |
| TASK-COPY | The card is copied from section 3.1, never retyped. A retyped card fails the vocabulary check or the line count |

### Worker Brief Skeleton

Every brief starts with this block, word for word, with the two paths filled in:

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a dispatched Task subagent. This repository's AGENTS.md treats a dispatched worker as
pre-resolved for the spec-folder question, and this prompt is that pre-resolution.

Your write authority is already bound. The spec folder is:
  <the packet folder this task names>

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

ROLE: <one line, the focused persona for this task>

ALLOWED WRITE PATHS:
  <the one folder this task names>

BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset,
git stash, rm, mv, create.sh outside the task's stated command, generate-context.js,
/speckit:save, and any edit to a file not listed under ALLOWED WRITE PATHS.
```

The role line is a focused persona summary in place of a catalogue agent file. The Task call names the `general` subagent type, so the worker loads no agent file.

### Dispatch Command

Dispatch with the Task tool: subagent_type `general`, description `<TASK id>`, prompt = the full text of
`$PHASE/scratch/briefs/<TASK>.txt`. When the subagent returns, write its final reply verbatim to
`$PHASE/scratch/runs/<TASK>.txt` with the write tool.

Where the task records seconds, measure the dispatch:

```bash
date +%s > "$PHASE/scratch/runs/$TASK.t0"
```

then make the Task call, then:

```bash
date +%s > "$PHASE/scratch/runs/$TASK.t1"
```

Two rules: at most 3 Task calls in one message, and never two in one message that write the same file. `PHASE` is this folder's path.

### Status Reporting Format

```text
[T###] DONE | BLOCKED - one line of evidence
```

Written as a row in the progress table of `goal.md` section 4.

### Blocked Task Protocol
1. Restore any file the task changed with `git restore --source=<start commit> -- <file>`.
2. Mark the task `[B]` in `tasks.md` with the failing command and the first line of its output.
3. Re-dispatch at most twice with the brief corrected for what failed. After the third failure on the same task, leave it `[B]` and continue with the next task.
4. Stop the phase when two tasks are blocked, and write `STOP` with both task IDs in `goal.md` section 4.
<!-- /ANCHOR:ai-execution -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: One card replaces the guide as the default load

**Status**: Accepted

**Context**: Four authoring intents load a 1,200-line guide. A weak model samples a long doc and copies the nearest example. The guide also mixes template-authoring rules with packet-authoring rules, so a model that only needs to fill a scaffold reads rules about files it must not touch.

**Decision**: The four intents load a 172-line card. The guide stays in the `ON_DEMAND` list, so a reader who asks for the full guide still gets it.

**Consequences**:
- A weak model gets one screen of rules and a command per step.
- A reader who needs the guide's depth must ask for it. The card names the guide once, so the path is visible.

**Alternatives Rejected**:
- Shortening the guide in place: it would still be the default load, and phase 2 owns its defect repairs.
- Two cards, one for templates and one for packets: it doubles the surface the guard must read for a difference only a template author sees.

### ADR-002: Generate the inventory, never hand-edit it

**Status**: Accepted

**Context**: `leaf-manifest.json` is byte-checked by `generate-leaf-manifest.cjs --check`, and `leaf-aliases.json` is checked as its projection by `ci-skill-root-metadata.cjs`. A hand edit passes one and fails the other.

**Decision**: Run `generate-leaf-manifest.cjs --write` then `ci-skill-root-metadata.cjs --fix --skill system-spec-kit`. The `--skill` scope keeps the write inside this skill.

**Consequences**:
- Both files agree with the tree and with each other.
- The fix command also reports other root metadata violations. A non-zero exit with the two files written is recorded, not treated as a write failure.

**Alternatives Rejected**:
- Adding the card row by hand: it survives until the next generator run and then disappears.

### ADR-003: A shell guard plus one vitest test, not a validator rule

**Status**: Accepted

**Context**: The surfaces are skill files, not a spec folder. `validate.sh` reads a packet, so it cannot check a router. The post-edit router runs per edited file and returns no finding on failure, so it cannot hold a repo-wide invariant.

**Decision**: `runtime/cli/spec/check-card-sync.sh` holds the invariant and `runtime/cli/tests/card-sync.vitest.ts` runs it in the suite. The script is also listed in `runtime/cli/spec/README.md`.

**Consequences**:
- One command answers whether the four surfaces agree.
- The check costs one process per suite run and reads five files.

**Alternatives Rejected**:
- A validator rule: it would need a packet argument it does not have.
- A post-edit hook: a hook that cannot block is not a guard.

---
