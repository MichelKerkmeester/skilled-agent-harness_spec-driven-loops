---
title: "Implementation Plan: Phase 8: orchestrate-routing-and-retry"
description: "Fix the seven owned orchestrate findings in file order, then move the decomposition aids and budget tables into a new system-spec-kit reference so orchestrate.md lands at or below 600 lines. Each fix is proven by the grep the spec names, and the roster, mirror and two plugin tests run after every agent edit."
trigger_phrases:
  - "orchestrate routing and retry plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: orchestrate-routing-and-retry

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent definition, one JSON registry record, JSON and Markdown skill routing files |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `rg` and `wc -l` checks, the roster and mirror checks, two `node --test` plugin tests and `sk-skill-check.cjs` |

The four step-5 explorers of `speckit-plan.yaml` ran inline, as the workflow's own fallback ("Use inline planning activities"), because a leaf worker cannot dispatch. The architecture pass read `orchestrate.md` in full and mapped its sections with `awk`. The feature pass found the registry record that generates the routing row and the existing `agent-io-contract.md`. The dependency pass found every consumer with `rg`, listed in the addendum below. The test pass found the two plugin tests that pin `orchestrate.md` text and ran them for a baseline.

Unknown: the line numbers of section 9 after phase 6 lands. Phase 1 of `tasks.md` re-measures them before any edit.

### Overview
Seven findings, one file. The routing and `Deep Route:` fixes come first, because the registry record regenerates part of the file. The retry ladder, the definition load, the collection rule, the gates and the stale text follow in file order. The section moves come last, from the fixed text, so a moved section never carries a bug the phase was meant to fix. REQ-004 waits on the operator and nothing else waits on it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 6 and 7 are merged, and `git log --oneline -- .skilled/agents/orchestrate.md .skilled/agents/code.md` shows their commits
- [ ] `scratch/measured-behavior.txt` is re-run on that base and saved as `scratch/baseline.txt`
- [ ] The section-move table below is rebuilt from the new line numbers

### Definition of Done
- [ ] Every acceptance command in `spec.md` section 4 prints what it names, REQ-004 aside if the operator has not answered
- [ ] `wc -l < .skilled/agents/orchestrate.md` prints 600 or less
- [ ] `sync-agent-roster.cjs --check` prints `agent-roster: OK`, `check-agent-mirror-sync.cjs` exits 0 and both plugin tests print `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Agent prose edit with a generated block and a reference move. No runtime code changes.

### Key Components
- **`.skilled/agents/orchestrate.md`**: the canonical orchestrator. Three blocks inside it are generated from `agent-registry.json` by `sync-agent-roster.cjs`.
- **`.skilled/agents/agent-registry.json`**: the `taskType` of each record becomes the Task Type cell of the routing table.
- **The runtime copies**: `.claude/agents/orchestrate.md` is a hand-kept fork that differs only in frontmatter. The Pi, Codex and harness copies are generated. `.opencode/agents` is a symlink to `.skilled/agents`.
- **`system-spec-kit/references/workflows/orchestrator-dispatch.md`** (new): holds the decomposition aids and the budget tables the orchestrator still follows. Without it the file stays above 600 lines, because the fixes alone remove about 86 lines of the 310 needed.

### Data Flow
The orchestrator reads its own definition at session start and reads the reference when a dispatch needs a budget or a decomposition aid. A `/deep:*` request runs the command, the command creates state and dispatches the leaf with a `Deep Route:` line, and the dispatch guard checks that line's `mode=` against the registry.

### Fix Approach per REQ
- **REQ-001**: set the `deep-research` `taskType` to name `/deep:research` as the route, run `sync-agent-roster.cjs`, and rewrite `:140` to say a `/deep:*` request runs its command, which dispatches the leaf at depth 1 with the state it created.
- **REQ-002**: the Task Format `Deep Route:` field keeps `mode`, `target_agent` and `source_of_truth`, and loses `execution`. The rule at `:233-234` names the three registry modes and drops "execution semantics".
- **REQ-003**: one `### Retry Ladder` in section 7. A `FAIL` gets two re-dispatches with the failure named. A third `FAIL`, or any `BLOCKED`, ends retries for that task and goes to the operator with the attempt history, and the `@debug` offer is made at that point. The circuit breaker opens on the same third failure. `:66`, `:602`, `:624-627`, `:693` and `:728` point to the ladder.
- **REQ-004**: the operator named the main agent on 2026-11-14. One rule names it as the writer, keeping `:461`, and Rules 2, 2b and 6 point to it. The `@markdown` route at `:444` and the rejection at `:499` go. The 32-line Rule 6 shrinks to its detection table.
- **REQ-005**: the mirror routine below after each agent edit.
- **REQ-006**: step 2 of the Agent Loading Protocol includes content only when `subagent_type` is `general-purpose`. `:157`, the Task Format `Agent Definition` field at `:214`, the PDR line at `:308` and the anti-pattern at `:887` say the same.
- **REQ-007**: Pattern C keeps the file write for write-capable leaves. `@context`, `@review` and `@prompt-improver` return the 3-line summary, and the orchestrator writes it to the scratch file. `:464` names the same limit.
- **REQ-008**: delete the 2-minute row, the 80% row, the mid-execution score, the 50,000-token default, the self-budget table and the threshold-action table. The ≥ 70 checklist item and the quality bands take phase 6's self-score rule.
- **REQ-009**: delete the Single-Hop Dispatch Model at `:526-542`, which the depth rules in section 2 already state. The example's `@code` skill becomes `sk-code`. Rule 3 and `:718` say the orchestrator runs `/speckit:save` itself.
- **REQ-010 and REQ-011**: the section moves below, then the registration.

### Section Moves

Line numbers are at `c1dbb1bcc4`. Phase 1 rebuilds them after phases 6 and 7.

| Section | Lines | Count | Goes to |
|---------|-------|-------|---------|
| Pre-Delegation Reasoning | 299-320 | 22 | `orchestrator-dispatch.md` |
| Complexity Estimation | 321-336 | 16 | `orchestrator-dispatch.md` |
| Delegation Eligibility Gate | 337-349 | 13 | `orchestrator-dispatch.md` |
| Parallel vs Sequential Dispatch | 350-368 | 19 | `orchestrator-dispatch.md` |
| Conditional Branching | 373-389 | 17 | `orchestrator-dispatch.md` |
| Example Decomposition, after the REQ-009 fix | 390-413 | 24 | `orchestrator-dispatch.md` |
| Context Health Monitoring, after REQ-008 | 722-732 | 11 | `orchestrator-dispatch.md` |
| Command Suggestions | 742-758 | 17 | `orchestrator-dispatch.md` |
| CWB scale, collection and enforcement tables, after REQ-007 and REQ-008 | 767-790 | 24 | `orchestrator-dispatch.md` |
| TCB heuristic, thresholds and batch sizing, as phase 6 leaves them | 795-828 | 34 | `orchestrator-dispatch.md` |
| Optional dispatch header | 238-258 | 21 | Pointer only. `agent-io-contract.md` §3 already holds it |
| Scoped Pre-Execution Predicates and the handoff block | 273-298 | 26 | Pointer only. `agent-io-contract.md` §5 and §6 already hold them |

Estimate: 910, less 197 moved, less 47 already in `agent-io-contract.md`, less about 86 removed by REQ-003, REQ-008 and REQ-009, plus about 11 pointer lines, is about 591. If phase 6 or the rebuild leaves the count above 600, the next cuts are Session Recovery Protocol (`:670-682`) and Rule 7 items 3 to 7, which restate the `cli-external-orchestration` hub. `### Code Review Marker`, `### Reading @code's Quality Gate` and `### 🔒 Agent Loading Protocol (MANDATORY)` stay in the file because tests and five skills read them there.

The cheaper moves fail. Building nothing leaves 910 lines. Extending `agent-io-contract.md` mixes orchestrator policy into the advisory envelope schema that `sk-create-command/assets/command-contract.json:141` cites as `workflow_schema_ref`. Extending `parallel-dispatch-config.md` puts the orchestrator's three complexity bands next to that file's own 5-dimension scoring, two models in one file. A new reference beside them on the same route is the smallest move that holds.

### Mirror Routine
After each edit to `.skilled/agents/orchestrate.md`: hand-edit `.claude/agents/orchestrate.md` to match, keeping its `tools:` frontmatter. Then run `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs` and `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs`, then `node .skilled/bin/sync-agent-roster.cjs --check` and `node .skilled/bin/check-agent-mirror-sync.cjs`. All five paths exist at `c1dbb1bcc4`. The commit gate blocks a commit with an unstaged mirror.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/agents/agent-registry.json` record `deep-research` | Producer of the routing row at `:80` | update `taskType` | `sync-agent-roster.cjs --check` prints `agent-roster: OK` |
| `.skilled/bin/sync-agent-roster.cjs` | Writes the three generated blocks and `README.txt` | unchanged, run | same check |
| `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs:135` and `:271` | Parses `mode=` and `target_agent=` from a `Deep Route:` line | unchanged. Both fields stay | `node --test .opencode/plugins/tests/system-deep-loop-guard.test.cjs` prints `pass 1` |
| `.opencode/plugins/tests/speckit-review-dispatch-contract.test.cjs:61-78` | Pins `### Code Review Marker` and the Quality Gate table | unchanged. Both sections stay | the test prints `pass 5` |
| `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor` and `cli-devin` `SKILL.md` | Cite "Agent Loading Protocol" as the native precedent | unchanged. The heading stays | `rg -c 'Agent Loading Protocol' .skilled/agents/orchestrate.md` prints 1 or more |
| `sk-prompt/assets/cli-prompt-quality-card.md:116` | Paraphrases the protocol as read, include, dispatch, for external CLIs | unchanged. An external CLI loads no named agent, so the include step still applies there | read the line after the edit |
| `.skilled/agents/context.md:336-345` | Return sizes per orchestrator collection mode | unchanged. The reference keeps the thresholds as they are. Its "1-4" against `:771` "1-3" predates this phase | `rg -n '1-3\|1-4' .skilled/agents/context.md` |
| `.skilled/agents/review.md:223` and `:460` | Name pre, mid and post gate stages | unchanged. The mid-execution stage stays, only its score goes | `rg -n 'Mid-execution' .skilled/agents/orchestrate.md` prints a line |
| `system-spec-kit/references/workflows/agent-io-contract.md` | Owns the dispatch header, handoff and pre-execution groups | unchanged, now the pointer target | `rg -c 'agent-io-contract.md' .skilled/agents/orchestrate.md` prints 1 or more |
| `system-spec-kit/leaf-manifest.json`, `leaf-aliases.json`, `ROUTER.md` | Register the skill's references | update | `sk-skill-check.cjs` prints `Result: NO FINDINGS` |
| Trigger-index outputs under `system-spec-kit/runtime/` | Index skill docs | regenerate | `generate-trigger-index.mjs --check` exits 0 |
| `.claude`, `.pi`, `.codex` and `.dsh` copies | Runtime mirrors | update by the mirror routine | `check-agent-mirror-sync.cjs` exits 0 |

Citations of the moved sections, from `rg -n "§9|§4|CWB|TCB|PDR|DEG|Pre-Delegation|Complexity Estimation|Conditional Branching|Batch Sizing|Collection Pattern|Pattern [ABC]|Scale Thresholds|Example Decomposition|Parallel vs Sequential" .skilled/agents/orchestrate.md`: lines 59, 60, 66, 217, 218, 221, 230, 299, 313, 321, 329, 333, 334, 335, 337, 339, 348, 350, 359, 361, 366, 373, 390, 558, 654, 667, 730, 761, 763, 767, 775, 777, 779, 780, 781, 783, 787, 791, 793, 808, 818, 856, 884, 885, 886 and 890. Line 567 also matches, but its `§9` is `code.md`'s. Each one that stays in the file is re-pointed to the reference. Outside the file, the same search over the repository, specs, changelogs, benchmarks and fixtures excluded, finds `context.md:336` and `:338` ("Context Window Budget Compliance"), which name the budget and no section number, and `PUBLIC-RELEASE.md:294`, a version history row. Neither changes. The five `cli-*` skills and `cli-prompt-quality-card.md:116` cite "Agent Loading Protocol", which does not move.

Finding classes: orchestrate-1 is `cross-consumer` (registry, generated block, guard). orchestrate-2, -7 and -8 are `instance-only`, proven by the greps in the spec. orchestrate-4, -5 and -6 are `class-of-bug` inside one file, and every same-class line is named in the fix approach above. across-6 is `matrix/evidence`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-runs the measurement on the post-phase-7 base and rebuilds the section-move table. Implementation makes the seven fixes in file order, then creates the reference, moves the sections and registers the reference, running the mirror routine after each agent edit. Verification runs every acceptance command in `spec.md` section 4, both plugin tests, the skill check and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The pinned sections and the `Deep Route:` parse | `node --test .opencode/plugins/tests/speckit-review-dispatch-contract.test.cjs` prints `pass 5` and `fail 0`. `node --test .opencode/plugins/tests/system-deep-loop-guard.test.cjs` prints `pass 1` and `fail 0` |
| Integration | Roster, mirrors and the new reference's registration | `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`. `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0. `node .skilled/commands/doctor/scripts/sk-skill-check.cjs .skilled/skills/system-spec-kit` prints `Result: NO FINDINGS`. `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0 |
| Manual | Each REQ's grep and the line count | The acceptance column of `spec.md` section 4, then `wc -l < .skilled/agents/orchestrate.md` prints 600 or less |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 6, `006-shared-agent-contract` | Internal | Yellow, planned | REQ-008's ≥ 70 item and the TCB move wait for its budget and self-score rules |
| Phase 7, `007-code-agent-retry-and-status` | Internal | Yellow, planned | REQ-003 cannot count `FAIL` and `BLOCKED` until `code.md` defines them |
| Operator answer on the spec-doc owner | Internal | Green, answered 2026-11-14: the main agent | None. REQ-004 builds |
| `node`, `rg` | External | Green | None. No new package |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a plugin test fails on main after the merge, the dispatch guard rejects a command-driven `/deep:*` dispatch, or the router no longer reaches `orchestrator-dispatch.md`.
- **Procedure**: `git revert` the phase's commits. The registry record, the regenerated roster blocks and the four runtime copies ship in the same commit as the `orchestrate.md` edit, so one revert restores all of them. Then re-run the mirror check.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 6 and 7 merged | Implementation |
| Implementation | Setup's rebuilt section-move table. REQ-004 also needs the operator's answer | Verification |
| Verification | Implementation | Phase 9 handoff |
<!-- /ANCHOR:phase-deps -->

---
