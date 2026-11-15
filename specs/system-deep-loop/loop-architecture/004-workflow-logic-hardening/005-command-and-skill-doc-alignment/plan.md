---
title: "Implementation Plan: Phase 5: command-and-skill-doc-alignment"
description: "Extend the deep-loop doc drift checker with a facts check, then correct the deep-research and deep-review command docs, mode skills, references, agent files, catalogs and playbooks so each fact points at one owner. The checker fails on the current tree first and passes when the docs are done."
trigger_phrases:
  - "command and skill doc alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: command-and-skill-doc-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, Node.js CommonJS for the drift checker |
| **Framework** | None. The `sk-doc` skill governs the doc edits. |
| **Storage** | None |
| **Testing** | Vitest 4 in `.skilled/skills/system-deep-loop/runtime/` |

### Overview
Add a facts check to `runtime/scripts/check-documentation-drift.cjs` and prove it fails on the current tree. Correct the docs the inventory below lists so each fact names or points at its owner, routed through `sk-doc`. Prove it by the checker exiting 0, the Vitest file passing and a zero-line inventory of stale names.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `rg -l '\| \*\*Status\*\* \| Complete' specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/00[1-4]-*/spec.md | wc -l` prints 4.
- [ ] `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` exits 0 before any edit.
- [ ] `ls .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml` prints three paths.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`.
- [ ] `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` exits 0 and prints `"errors": []`, and `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/check-documentation-drift.vitest.ts tests/unit/typo-flags.vitest.ts` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/005-command-and-skill-doc-alignment --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single owner per fact. Each fact lives in one file and the docs point at it.

| Fact | Owner | Pointer form in other docs |
|------|-------|----------------------------|
| Executor kinds | `EXECUTOR_KINDS` in `runtime/lib/deep-loop/executor-config.ts` | Name the constant, state no count. |
| Flag surface | The Workflow Flag Surface table in each command doc | The routing step says the table lists the workflow inputs. |
| Research tool-call budget | `maxToolCallsPerIteration` in `deep-research/assets/deep-research-config.json`, rendered into the prompt pack | Name the config field, state no number. |
| Review tool-call budget | Line 94 of `deep-review/assets/prompt-pack-iteration.md.tmpl`, the only value the review agent sees | Name the prompt pack line, state no number. |
| Workflow and script files | The files on disk: `runtime/scripts/convergence.cjs`, `deep-research.yaml` and `deep-review.yaml` | Name the real path. The facts check proves it exists. |
| Stop reasons | Phase 001's frozen list in `runtime/scripts/convergence.cjs` | List the full set or point at the script. |
| Reducer per mode | Phase 002 D6 and D7: research keeps `deep-research/scripts/reduce-state.cjs`, review keeps `runtime/scripts/reduce-state.cjs` | Each mode doc names its own reducer. |

### Key Components
- **Facts check in `check-documentation-drift.cjs`**: today a doc can state a wrong executor count, name a missing file or list flags the table lacks, and nothing fails. The check adds three rules:
  - Executor count. It parses `EXECUTOR_KINDS` from `executor-config.ts` and matches `<number or number word> executor kinds` in each scanned doc. Number words one to twelve are mapped.
  - File existence. It extracts every token ending in `.yaml`, `.cjs`, `.sh` or `.ts` and brace-expands `{a,b}`. It resolves the token against the repo root, then the doc's owning packet root, then the skill root, and fails when none exists.
  - Routing flags. In each command doc it compares the `--flag` tokens inside the numbered `MODE ROUTING` list with the first column of the Workflow Flag Surface table. Group labels such as "executor flags" are not flags, so after REQ-008 the routing list holds no `--flag` token and the check passes. A routing list that holds flags passes only when its set equals the table set.
- **Scan set**: `.skilled/commands/deep/research.md`, `review.md` and their two presentation files, plus every `*.md` file under `.skilled/skills/system-deep-loop/{deep-research,deep-review,runtime}/` and the hub `SKILL.md`, `README.md` and `ARCHITECTURE.md`. It excludes `changelog/`, `benchmark/`, `behavior-benchmark/`, `tests/` and `node_modules/`, because those keep historical names on purpose.
- **Boundary with phase 004**: phase 004 guards the workflow assets. This check guards prose docs only.

### Data Flow
The checker reads `executor-config.ts`, the scan set and the file system, then prints one JSON object with an `errors` array and exits 0 or 1. The Vitest file runs it against fixtures with a wrong count, a missing file and a routing mismatch, and once against the live tree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Inventory command, run on 2026-11-14:

```bash
rg -l 'deep[-_](research|review)[-_](\{auto,confirm\}|auto|confirm)' .skilled/skills/system-deep-loop .skilled/commands/deep -g '*.md' -g '*.txt' -g '!**/changelog/**' -g '!**/node_modules/**' -g '!**/benchmark/**' -g '!**/behavior-benchmark/**' | wc -l
```

It printed 131. Grouped by surface:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/deep/research.md`, `review.md` | Command docs, flag tables, directive. A phase 004 test reads them. | update the directive, routing step, section order and research restart rows (F17, F20, F21, phase 003). Phase 004 updates the workflow file names and the `--dry-run` row. | `rg -c 'AUTONOMOUS EXECUTION DIRECTIVE'` prints 1 per file. The facts check passes. |
| `.skilled/commands/deep/assets/deep-research-presentation.txt`, `deep-review-presentation.txt` | Setup prompts and checkpoints. Phase 004 updates their file names and dry-run text. | update the restart flags and the confirm-only failure gate (phases 002 and 003) | The facts check passes on both. |
| `deep-research/SKILL.md` | Budget at `:104` and `:206`, executor count at `:92`, rules at `:190`, `:207`, `:210` and `:288` | update (F13, F18, F19, phases 001 to 003) | `rg -n '\(max 12\)\|nine executor'` prints nothing. |
| `deep-review/SKILL.md` | Reducer path at `:59` and `:287`, workflow name at `:238`, budget at `:246` | update (F13, F18, phases 001 to 003) | The facts check passes. |
| `deep-research/references/` (1 file names a workflow file) plus `protocol/loop-protocol.md:307` | Protocol and convergence detail | update (F13, phases 001 to 003) | `rg -n 'default: 12' deep-research/references/protocol/loop-protocol.md` prints nothing. |
| `deep-research/references/convergence/convergence.md` sections 2 and 3 | Stop-reason table at `:85` to `:92` lacks `manualStop` and `maxDurationReached`. Step 7 at `:121` lets a STOP pass without a graph decision. | update (operator scope, phase 001 D2 and D4) | `rg -c 'manualStop\|maxDurationReached'` in section 2 prints at least 2. `rg -n 'If graphEvents exist'` prints nothing. |
| `deep-review/references/` (5 files, including `convergence.md` with 4 underscore names) | Protocol, state and convergence detail | update (F18, phases 001 to 003) | `rg -n 'deep_review_'` prints nothing outside changelogs. |
| `runtime/references/integration-points.md` | Lists the workflow consumers at `:46` to `:62` and `:196` to `:197` | update (phase 004 file names) | The facts check passes. |
| `deep-research/README.md` | Packet README naming workflow files | update (phase 004) | The facts check passes. |
| `deep-research/feature-catalog/` (18), `deep-review/feature-catalog/` (5), `runtime/feature-catalog/` (6) | Feature entries naming workflow files and steps | update (phases 001 to 004, F18 at `quality-gates.md:27`) | The facts check passes. |
| `deep-research/manual-testing-playbook/` (44), `deep-review/manual-testing-playbook/` (39), `runtime/manual-testing-playbook/` (6) | Scenarios naming workflow files and steps | update (phases 001 to 004) | The facts check passes. |
| `.skilled/agents/deep-research.md` `:186`, `:410` and `:464`, and its mirrors in `.claude/`, `.cursor/`, `.opencode/`, `.pi/`, `.codex/` and `.dsh/` | Agent budget text | update (F13) | `rg -l 'max 12' .*/agents/deep-research.*` prints nothing. |
| `.skilled/agents/deep-review.md` and its mirrors in `.claude/`, `.opencode/`, `.pi/`, `.codex/` and `.dsh/` | `:310` and `:311` name the review twins, handed over by phase 004 `plan.md:97`. Its budget, max 13, matches the prompt pack. `deep-review-contract-parity.vitest.ts:43` reads these files. | update the workflow name, leave the budget | `rg -n 'deep-review-(auto\|confirm)' .*/agents/deep-review.*` prints nothing. |
| `.skilled/skills/sk-doc/sk-create-command/SKILL.md:148` | Naming example `deep-research-confirm.yaml` | update to an asset that exists | `rg -n 'deep-research-confirm' .skilled/skills/sk-doc/sk-create-command/SKILL.md` prints nothing. |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/command-authoring.md:40` | Names `deep-research-auto.yaml` | update to `deep-research.yaml` | `rg -n 'deep-research-auto'` on the file prints nothing. |
| `.skilled/skills/system-spec-kit/README.md` | Names the commands at `:351`, `:493` and `:695`, no file or stop reason | unchanged unless phases 001 to 004 make a line wrong | `rg -n 'deep-(research\|review)-(auto\|confirm)\|stopReason'` on the file prints nothing. |
| Hub `SKILL.md`, `README.md` and `ARCHITECTURE.md` | Name no specific workflow file. `ARCHITECTURE.md:97` names "the command's workflow YAML" in general. | unchanged unless the facts check fails on them (D5) | The facts check passes on all three. |
| `changelog/` in `deep-research/`, `deep-review/`, `runtime/`, `sk-doc/sk-create-command/` and `sk-code/sk-code-skilled/` | Release notes | update: one new entry each | `ls -t <packet>/changelog \| head -1` names the new file. |
| `runtime/scripts/check-documentation-drift.cjs` | Existing doc drift checker, exits 0 today | update (D4) | `--facts` exits 1 before the doc edits and 0 after. |

Same-class producers handled elsewhere: `ai-council.md:44` and `integration-points.md:158` belong to phase 006, which retires the council mode. `deep-review/SKILL.md:249` carries the same "Ask the user" rule as F19 and is fixed here.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms phases 001 to 004 are Complete, records their file names and reruns the inventory. Implementation adds the failing facts check to `runtime/scripts/check-documentation-drift.cjs`, then edits the command docs, mode skills, references, agent files, catalogs, playbooks and changelogs through `sk-doc`. Verification runs the checker, the Vitest file, the stale-name inventory and `validate.sh --strict`. `tasks.md` owns the ordered work.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The three fact rules on fixtures: wrong count, missing file and routing mismatch fail, and an excluded changelog with an underscore name passes | Vitest: `npx vitest run tests/unit/check-documentation-drift.vitest.ts` |
| Integration | The checker on the live tree exits 0 and prints `"errors": []` | `node runtime/scripts/check-documentation-drift.cjs` |
| Manual | Read both command docs side by side and confirm the same `##` headings | `diff <(rg '^## ' research.md) <(rg '^## ' review.md)` prints only the command name differences |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 to 004 of this parent | Internal | Red: not started on 2026-11-14 | Docs cannot name files that do not exist. This phase waits (D6). |
| Phase 006 `006-ai-council-mode-deprecation` | Internal | Successor | Council docs stay stale until it runs. |
| `sk-doc` skill | Internal | Green | Doc edits lose template and voice checks. |
| Vitest in `runtime/` | Internal | Green | The facts check has no test. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the facts check fails on a file it should exclude, or a doc edit removes a fact an operator needs.
- **Procedure**: revert this phase's commit with `git revert <sha>`. It touches only prose docs, one script and one test, so no state or workflow needs repair.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001 to 004 at Status Complete | Implementation |
| Implementation | Setup and the failing facts check (T005, T006) | Verification |
| Verification | Implementation | Parent packet close |
<!-- /ANCHOR:phase-deps -->

---
