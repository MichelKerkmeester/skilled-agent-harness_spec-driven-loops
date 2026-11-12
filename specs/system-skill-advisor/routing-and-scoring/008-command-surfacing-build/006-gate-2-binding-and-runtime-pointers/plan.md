---
title: "Implementation Plan: Phase 6: gate-2-binding-and-runtime-pointers"
description: "Add one Gate 2 bullet for a surfaced command, copy it into the Cursor rule through the existing pointer generator, hand a hub mode to its command, name the plan workflow in the Gate 3 notice and downgrade commands in a child brief."
trigger_phrases:
  - "gate 2 binding and runtime pointers plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: gate-2-binding-and-runtime-pointers

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown instruction files, CommonJS generators, one ES module, one Bash script and TypeScript in the advisor |
| **Framework** | The `AGENTS.md` manifest and check engine under `.skilled/commands/doctor/`, the spec-kit runtime mirrors and the system-skill-advisor runtime (`ADV`) |
| **Storage** | None. Every output is a tracked text file |
| **Testing** | `/doctor:agents-md check`, the manifest check, the rule-copy canary, Vitest in `ADV` and in the spec-kit CLI, `node --test` for the spec gate |

### Overview
The rule lives once, in Gate 2 of `AGENTS.md`. Every other surface either copies it through a generator that checks the copy, or points at the command document from where a model already is: the hub router after it picks a mode, the Gate 3 notice before the first write and the brief in a child session. Nothing in scoring moves.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The operator answered the four wording questions on 2026-11-12. `spec.md` section 10 quotes each answer.
- [ ] Phase 005 shipped, and the Claude hook's first line for `create a readme for the utils folder` shows `/create:readme` and a policy word (T002). Without it only the REQ-004 tasks wait.
- [ ] The before numbers in `spec.md` Measured Behavior still hold (T001).

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`.
- [ ] `/doctor:agents-md check` prints `STATUS=OK`, and `sync-gate1-pointers.cjs --check` exits 0.
- [ ] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One source, generated copies, pointers at the point of use.

### Key Components
- **Gate 2 bullet** (`AGENTS.md`): without it no runtime has a rule for a surfaced command, because Gate 2 today says only "Confidence ≥ 0.8 → MUST invoke skill".
- **Manifest pin and derived copy** (`agents-md-manifest.json`): without the regenerated copy A4 reads `edited` and A12 fails, and without the pin a template edit that drops the marker leaves the Cursor block silently unwritten.
- **Second pointer block** (`sync-gate1-pointers.cjs`): without it Cursor and Devin, which read `.cursor/rules/skill-routing.md` on its own, never see the bullet. Cursor's brief is dormant, so this is its only copy.
- **Router handoff** (three `ROUTER.md` files): without it the skill path ends at the mode packet and never names the command its registry row records.
- **Gate 3 line** (`GATE_3_MUTATION_NOTICE`, `create.sh`): without it a plain build request gets the folder question and no workflow, because the advisor names no command for it (Measured Behavior).
- **Child downgrade** (`render.ts`): without it a child sees `/doctor:git hooks`, an `ask` route, as a plain recommendation.
- **Runtime parity test** (`advisor-runtime-list-parity.vitest.ts`): without it the hook reference drifts from the adapters again, as it did when DSH was added.

### Data Flow
An operator edits the Gate 2 bullet. `agents-md-manifest.cjs --write` copies the new body into `derived`, and `sync-gate1-pointers.cjs` copies the direct-call line and the bullet into the Cursor rule. `/doctor:agents-md check` then reads the budget, the currency and the pointer drift in one run. At prompt time a brief or CLI result names a command, and the model reads that command's document, takes the skill path instead or offers the command, by its policy word.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `AGENTS.md` Gate 2 | Skill routing only | Update | `rg -c "^- \*\*Command in the brief\.\*\*" AGENTS.md` prints 1 |
| `agents-md-manifest.json` `pins` and `derived` | Pins 30 strings, copies 44 bodies | Update | `agents-md-manifest.cjs --check` prints 31 pins and `PASS` |
| `agents-md-check.cjs` A10 | Runs the pointer generator's `--check` | Unchanged. It covers block two through the same exit code | A10 `PASS` |
| `agents-md-embed.cjs` | Calls the pointer generator in a consumer repository | Unchanged. A consumer with no bullet gets block one only (NFR-R01) | Gate1 test case for a fixture with no bullet |
| `.cursor/rules/skill-routing.md` | Gate 1 block, read by Cursor and Devin | Update by generator | `sync-gate1-pointers.cjs --check` exits 0 |
| Hub `ROUTER.md` section 3 replay maps | Stage-two replay source | Unchanged. The bullet goes in section 4 | `parent-skill-check.cjs` exits 0 per hub |
| `GATE_3_MUTATION_NOTICE` and `GATE_3_DENY_DETAIL` | Folder question at the first write, embedded in the deny text | Update. The deny text embeds the notice, so it changes with it | `spec-gate-core.test.mjs` 0 failed |
| `renderAdvisorBrief` | One brief for parent and child | Update, child branch only | `render-child-session.vitest.ts` and the unchanged golden briefs |
| `ADVISOR_RUNTIME_VALUES` | Runtime enum for tool input, the CLI manifest and stored metrics records | Update: `copilot` removed | `advisor-observability.vitest.ts` expects seven labels |
| `AdvisorValidateInputSchema` and the CLI manifest | Accept `outcomeEvents[].runtime` from the enum | Unchanged code. Input carrying `copilot` is now rejected | `runtime-label-removal.vitest.ts` |
| `readAdvisorHookDiagnosticRecords`, `readAdvisorHookOutcomeRecords` | Filter stored lines through the record validators | Unchanged code. A stored `copilot` record is now skipped | `runtime-label-removal.vitest.ts` |
| `hook-brief-signal-noise.bench.ts` | Fixture keyed by runtime | Update: the `copilot` row removed | `rg -c "copilot"` on the file prints nothing |

Matrix axes for the generator: bullet present or absent, block two present or absent, block two edited by hand or clean. Matrix axes for the label removal: stored diagnostics record, stored outcome record, new diagnostic record and tool input, each carrying `copilot`. Matrix axes for the renderer: child variable set to `1`, set to another value or unset, policy `run`, `start` or `ask`, class `read-only` or not. Every axis has one test row.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup re-reads the before numbers and checks that phase 005 shipped. Implementation edits the bullet, the generator, the routers, the notice, the hook reference, the runtime enum and the renderer, then regenerates the manifest and the Cursor rule. Verification runs the agents-md check, the manifest check, the canary, the pointer check, the three test suites, the hub checks and two live hook probes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Pointer generator: both blocks, no bullet, hand edit. Renderer: the child matrix. Runtime list: index, table and enum | `gate1-pointer-sync.vitest.ts`, `render-child-session.vitest.ts`, `advisor-runtime-list-parity.vitest.ts` |
| Integration | Delivery budget, section currency, pins, runtime copies and the canary over the real `AGENTS.md`. The pinned notice bytes | `agents-md-check.cjs`, `agents-md-manifest.cjs --check`, `check-rule-copies.js`, `spec-gate-core.test.mjs` |
| Manual | The Claude hook on one prompt with and without `AI_SESSION_CHILD=1` | `scratch/hook-first-line.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 brief line `use <skill> → <command> (<policy>)` | Internal | Planned in parallel, not built | REQ-004 waits. Every other task proceeds |
| Phase 002 `commandPolicies` with `mutating` on all 68 records | Internal | Green: in the generated file today | The child downgrade has no class to read |
| Phase 003 `attachCommand` and the CLI `command` field | Internal | Code shipped, phase In Progress | The bullet binds to the brief only |
| Operator answers to the four wording questions | Decision | Green: answered on 2026-11-12, ADR-001 and ADR-005 to ADR-007 | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `/doctor:agents-md check` not `OK`, the pointer check failing, a failing suite or a behaviour run in phase 007 showing the bullet steers turns wrongly.
- **Procedure**: revert this phase's commit, then run `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --write` and `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs` so the derived copy and the Cursor rule match the reverted `AGENTS.md`. Finish with `/doctor:agents-md check`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Operator answers, phase 005 for REQ-004 only | Implementation |
| Implementation | The before numbers | Verification |
| Verification | All implementation tasks | Phase 007 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:decisions -->
## ARCHITECTURE DECISION RECORD

Every ADR below records an operator decision already made. None is new.

### ADR-001: The command path and the skill path are both whole workflows

**Status**: Accepted by the operator on 2026-11-12, "Looser: AI picks freely" (`../decision-record.md` Q011, D2)

**Context**: The review's Gate 2 text and its G1 router rule make the command the workflow a model must follow.

**Decision**: The Gate 2 bullet and the three router bullets name the command beside the skill. A model picks either and follows it whole, never an improvised mix. The operator approved the exact Gate 2 text on 2026-11-12, "Command beside the skill (Recommended)".

**Consequences**:
- The command is a suggestion the model may decline. The `COMMAND:` token records `declined` so phase 007 can count it.
- A `command: null` mode keeps its packet as the only path.

**Alternatives Rejected**:
- Command as the default entry with the skill for partial work: the operator chose the looser reading over it (Q011).

### ADR-002: A started command runs without `:auto`

**Status**: Accepted by the operator on 2026-11-12, "Start it (Recommended)" (`../decision-record.md` Q006, D1)

**Context**: Twenty commands carry the `start` policy, and their own setup asks for a mode, Gate 3 and a yes at an irreversible step.

**Decision**: The bullet defines `start` as starting the command without `:auto`, so its setup asks.

**Consequences**:
- A typed `:auto` or an explicit instruction still wins (L5).
- Whether a started command keeps to its setup is phase 007's G2 check.

**Alternatives Rejected**:
- Ask before every write command: rejected by the operator (Q006).

### ADR-003: A deep loop is always asked first

**Status**: Accepted by the operator on 2026-11-12, "Only on depth wording (Recommended)" (`../decision-record.md` Q008, D3)

**Context**: The three `/deep:*` commands carry the `ask` policy in `commandPolicies` today.

**Decision**: The bullet's `ask` sentence covers them, and no deep-loop clause is added to `AGENTS.md`. The deep-loop router bullet notes that `deep-research/SKILL.md` names its command as its only entry.

**Consequences**:
- No bytes spent on a deep-loop rule in the delivery prefix.

**Alternatives Rejected**:
- A separate deep-loop clause in Gate 2: it would restate the policy word.

### ADR-004: The invocation table covers the 44 tracked commands

**Status**: Accepted by the operator on 2026-11-12, "No, exclude it (Recommended)" (`../decision-record.md` Q012, D5)

**Context**: `/local-skilled-alignment` is private and untracked.

**Decision**: No surface in this phase names it.

**Consequences**:
- `rg -n "local-skilled-alignment"` over the changed files prints nothing.

**Alternatives Rejected**:
- A local overlay: rejected by the operator (Q012).
### ADR-005: A child sees a surfaced command as parent-named only

**Status**: Accepted by the operator on 2026-11-12, "Shown as parent-named only (Recommended)"

**Context**: A child session gets the same brief as its parent. In this worktree a child got `/doctor:git hooks`, an `ask` route, as a plain recommendation.

**Decision**: With `AI_SESSION_CHILD=1`, a surfaced `start` or `ask` command, or a `run` command whose class is not `read-only`, renders as `(parent-named only)`. The class comes from `commandPolicies`.

**Consequences**:
- A child still sees the skill line and a read-only command.

**Alternatives Rejected**:
- Drop the command from a child's brief, or send a child no brief: the operator chose the downgrade.

### ADR-006: The Gate 3 notice names the plan workflow for a new folder

**Status**: Accepted by the operator on 2026-11-12, "/speckit:plan, or /speckit:complete for a build (Recommended)"

**Context**: A plain build request gets no command from the advisor, so the first write meets the folder question and no workflow.

**Decision**: The notice and the standard `create.sh` next steps name `/speckit:plan`, or `/speckit:complete` when the operator asked for the build itself.

**Consequences**:
- The pinned notice test changes in the same task wave.

**Alternatives Rejected**:
- `/speckit:plan` only, or both with no preference.

### ADR-007: `copilot` is removed from the runtime enum

**Status**: Accepted by the operator on 2026-11-12, "Drop it": "The label is removed. Old stored records and any tool input carrying 'copilot' fail validation from then on."

**Context**: No adapter or registration emits `copilot`, but the enum still lists it, so the hook index and the enum disagree.

**Decision**: Remove the label with no retired list. A stored record carrying it is skipped by both metrics readers, a new diagnostic record carrying it is refused by `serializeAdvisorHookDiagnosticRecord`, and tool input carrying it is rejected by `AdvisorValidateInputSchema`.

**Consequences**:
- Any old `copilot` record drops out of health and outcome summaries. None exists on this machine today.
- A new test pins the skip and the rejection.

**Alternatives Rejected**:
- Keep the label with a retired list: the operator chose removal.
<!-- /ANCHOR:decisions -->
