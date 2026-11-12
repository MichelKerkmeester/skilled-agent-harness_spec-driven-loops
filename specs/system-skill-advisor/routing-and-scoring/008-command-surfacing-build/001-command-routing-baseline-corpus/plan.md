---
title: "Implementation Plan: Phase 1: command-routing-baseline-corpus"
description: "Adds a command prompt corpus, a capture script, a baseline file and a slice test beside the advisor's existing routing-accuracy files. The approach copies the doctor slice's pinned scoring regime and changes no scoring code."
trigger_phrases:
  - "command routing baseline corpus plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: command-routing-baseline-corpus

<!-- SPECKIT_LEVEL: 3+ -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM script (`.mjs`), TypeScript test, JSONL fixture |
| **Framework** | None. The script imports the built scorer from `dist/runtime/lib/scorer/fusion.js` |
| **Storage** | Two committed files: `command-prompts.jsonl` and `command-routing-baseline.json` |
| **Testing** | Vitest, collected by the runtime's `tests/**/*.vitest.ts` glob |

### Overview
Four files are added under `.skilled/skills/system-skill-advisor/runtime/` and one README gains three rows. The capture script scores each corpus row with `scoreAdvisorPrompt` under the pinned regime, maps each returned id to its command through `command-bridges.generated.json` and writes per-command numbers. The proof is a slice test that re-scores live and matches the baseline exactly, while the existing ratchet still passes on 158 of 195, 50 of 66, 20 of 24 and 5.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Commands run in `.skilled/skills/system-skill-advisor/runtime/`.

### Definition of Ready
- [x] `ls dist/runtime/lib/scorer/fusion.js` prints the path after `npm run build`
- [x] `node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq '.metrics.full_corpus_top1.correct'` prints 158
- [x] `ls ../../../commands/*/*.md | wc -l` prints 44

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is `Met`
- [x] `npx vitest run tests/command-routing-slice.vitest.ts tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts` reports 0 failed
- [x] `spec.md`, `plan.md` and `tasks.md` name the same five files
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fixture, capture, ratchet. It is the pattern `scorer-eval-baseline.json` and its ratchet test already use.

### Key Components
- **`command-prompts.jsonl`**: the gold rows. Without it no command other than a doctor command has a label.
- **`capture-command-routing-baseline.mjs`**: exports one `scoreCommandCorpus()` function and runs it as a CLI. With no flag it prints JSON, with `--write` it also writes the baseline. Without it the numbers would be produced by hand.
- **`command-routing-baseline.json`**: the captured numbers. Without it later phases have nothing to compare to.
- **`command-routing-slice.vitest.ts`**: imports `scoreCommandCorpus()` and asserts the result equals the baseline, and that every command file has rows. Without it the baseline drifts unseen, since CI runs the suite and never the script.

### Data Flow
The script reads the corpus, the list of `.skilled/commands/<namespace>/<name>.md` files and `command-bridges.generated.json`. It builds a map from each TypeScript projection id (`runtime.typescript.id`) to its `command` and `skillId`, keeping only entries whose TypeScript side is enabled. For each row it calls `scoreAdvisorPrompt(prompt, { workspaceRoot })` and reads the top three ids. A row reaches its command at 1 when the first id maps to `expected_command`, and in the top three when any does. A must-not-start row counts as a false offer when any of the three ids maps to a command. Agreement is counted on rows where a command id follows a skill id. The result is grouped per command and per split.

### Row shape

```json
{"id":"cmd-create-agent-plain-01","prompt":"I need a new agent that reviews pull requests","row_type":"plain","split":"tune","expected_command":"/create:agent","expected_top":"sk-doc","expected_policy":"start","source":"authored"}
```

`row_type` is one of `typed`, `plain`, `near-miss`, `must-not-start`, `slash-variant`. `split` is `tune` or `holdout` on plain rows and `none` elsewhere. `expected_policy` is `run`, `start`, `ask` or null and comes from the review's per-command table.

### Baseline shape

```json
{"schemaVersion":1,"capturedAt":"2026-10-11","capturedAtSha":"<sha>","corpusSha256":"sha256:<hash>","bridgeCounts":{"generated":62,"typescriptActive":40},"metrics":{"typed_recall_at_1":{"correct":0,"total":0},"plain_recall_at_1":{"tune":{"correct":0,"total":0},"holdout":{"correct":0,"total":0}},"false_offer":{"count":0,"total":0},"agreement":{"correct":0,"total":0}},"unreachable":["/speckit:handoff"],"commands":{"/create:agent":{"typed":{"rows":1,"top1":0,"top3":0},"plain":{"tune":{"rows":1,"top1":0,"top3":0},"holdout":{"rows":1,"top1":0,"top3":0}}}}}
```

The zeros are placeholders for shape. The capture run supplies the numbers. The built baseline adds three things this shape does not show: a `rows` object with one entry per corpus row (`expected_command`, `top`, `top1`, `top3`, `offered`), `typed_reach_top3` and `plain_reach_top3` beside the recall counts, and a `slash_variant` group. The `rows` object exists so a changed label or a moved row is named by its id.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A as a fix: this phase adds measurement and repairs no finding. The table records what was checked so that nothing existing moves.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | Pins the hashes of the labeled, holdout and ambiguity corpora | unchanged | It names those three files only, so a new file changes no hash |
| `tests/parity/holdout-independent.vitest.ts` | Fails when a runtime file names a scored corpus without declaring it | unchanged | Its name list at lines 75 to 83 has no `command-prompts` and no `doctor-prompts` entry, and the new files name neither pinned corpus |
| `.github/workflows/routing-registry-drift.yml` | Runs named gate files and a corpus hash check | not a consumer | Its hash loop reads the keys of `routing-baseline.json`, which list the pinned corpora |
| `.github/workflows/skill-advisor-stress.yml` | Runs `npm test` at line 96 | not a consumer of the files, runs the new test | The vitest glob collects `tests/command-routing-slice.vitest.ts` |
| `scorer-eval-baseline.json` | Supplies `capturedAt` to the doctor slice and the reach probe | unchanged, read for `capturedAt` | The new script reads that one field |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup builds `dist`, confirms the four numbers and lists the 44 commands with the bridge ids that map to each. Implementation authors `command-prompts.jsonl`, then `capture-command-routing-baseline.mjs`, then writes `command-routing-baseline.json`, then adds `tests/command-routing-slice.vitest.ts`. Verification runs the slice test, the ratchet and the holdout gate, and proves the slice test fails on a changed label.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The one command is `npx vitest run tests/command-routing-slice.vitest.ts tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts`, and it must report 0 failed.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None added. The script has one function and the slice test exercises it whole | - |
| Integration | The slice test: live score equals baseline, every command file has rows, the baseline's corpus hash matches the file | Vitest |
| Manual | One changed label in a scratch copy must make the test fail, and two capture runs must print identical JSON | `diff`, `jq` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Built advisor runtime (`npm run build`) | Internal | Green: `dist/runtime/lib/scorer/fusion.js` exists in this worktree | No row can be scored |
| `command-bridges.generated.json` | Internal | Green: 62 entries, 40 TypeScript-active | No id can be mapped to a command |
| Review section 5 per-command table | Internal | Green | Policy labels would be guesses |
| No new package | - | Green | - |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the ratchet or the holdout gate fails after the files are added, or the full suite slows past the CI job's 25 minute limit.
- **Procedure**: delete the four new files and revert the README rows with `git checkout -- scripts/routing-accuracy/README.md`. No other file depends on them in this phase.
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
| Setup | Nothing | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing the phase and starting 002 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
command list + bridge map ──► corpus ──► capture script ──► baseline ──► slice test
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Command list and bridge map (scratch) | None | The 44 commands and the ids that map to each | Corpus |
| `command-prompts.jsonl` | Command list | Gold rows | Capture script run |
| `capture-command-routing-baseline.mjs` | Corpus | `scoreCommandCorpus()` and the JSON | Baseline, slice test |
| `command-routing-baseline.json` and `command-routing-slice.vitest.ts` | Capture script | The pinned numbers and their gate | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Author the corpus** - the longest step, about 200 rows - CRITICAL
2. **Write the capture script and the baseline** - one script, one run - CRITICAL
3. **Add the slice test and run the three gates** - one test file - CRITICAL

**Total Critical Path**: one working session. No duration is measured yet.

**Parallel Opportunities**:
- The README rows can be written while the corpus is authored.
- Nothing else runs in parallel, because each file reads the one before it.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Corpus complete | Every command file has one typed and two plain rows, checked by the jq command in T009 | End of Implementation, first half |
| M2 | Baseline captured | `jq '.commands \| length' scripts/routing-accuracy/command-routing-baseline.json` prints 44 | End of Implementation |
| M3 | Gates green | The testing strategy command reports 0 failed | End of Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Generalise the doctor slice, with a captured baseline in place of exact-row assertions

**Status**: Accepted

**Context**: The doctor slice asserts an exact top and second pick per row, which works because doctor phrases were admitted wave by wave and each row passes. A corpus for all 44 commands is written before the scorer can reach most of them, so most rows would fail on day one.

**Decision**: Keep the doctor slice's pinned regime and file placement, and ratchet on a captured baseline the way `scorer-eval-baseline.json` does. A number that moves in either direction fails until the baseline is captured again.

**Consequences**:
- Later phases show a gain by re-capturing, and the diff of the baseline file is the evidence.
- The slice test passes on day one while recall is low. Mitigation: the baseline file states the recall plainly and lists unreachable commands.

**Alternatives Rejected**:
- Exact-row assertions with a wave gate per command: most waves would stay switched off until phase 3, so the test would assert nothing now.
- Adding command rows to `labeled-prompts.jsonl`: its hash is pinned and its gold label is a skill, so the four existing numbers would move.

### ADR-002: Hold out half of the plain-chat rows

**Status**: Accepted

**Context**: Phase 3 authors intent phrases so that plain chat reaches a command, and it will be measured by this corpus.

**Decision**: Each command's plain rows are split into `tune` and `holdout`. Phase 3 may read `tune` rows and reports both numbers.

**Consequences**:
- A gain on `holdout` rows shows the phrases generalise.
- Twice the plain rows to author. Mitigation: two per command is the minimum.

**Alternatives Rejected**:
- One undivided set: a phrase copied from a row would score a hit and prove nothing.

### ADR-003: Drop `expected_second`, keep `expected_policy` unscored

**Status**: Accepted

**Context**: The review asks for the doctor row shape plus `expected_command` and `expected_policy`. Under decision D2 the command is surfaced beside its owner skill and the order between them is not fixed.

**Decision**: The row carries `expected_top` as the owner skill and `expected_command`. Reach is measured at 1 and in the top three, which replaces `expected_second`. `expected_policy` is stored now and scored from phase 5, when a recommendation carries a policy.

**Consequences**:
- The corpus does not need relabeling when phase 3 changes where the command sits.
- This departs from the review's field list. The reason is recorded here.

**Alternatives Rejected**:
- Keeping `expected_second`: it would encode an order that D2 leaves open.

---


---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

One worker runs the phase in order. The files are small and each reads the one before it, so nothing is split across workers.

### Tier 1: Sequential Foundation
**Files**: scratch command list and bridge map, then `command-prompts.jsonl`
**Agent**: Primary

### Tier 2: Parallel Execution
N/A: no two tasks are independent except the README rows.

### Tier 3: Integration
**Agent**: Primary
**Task**: Write the baseline, add the slice test and run the three gates

### Pre-Task Checklist
- [ ] Read spec.md, this plan and tasks.md before the first edit
- [ ] Confirm the target files match the workstream file ownership below
- [ ] Know the verification command for the task before starting it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute tasks in dependency order; parallel work stays inside one workstream |
| TASK-SCOPE | Touch only the files the task names; report anything else as a finding |
| TASK-VERIFY | Run the task's verification before marking it complete |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol
1. Mark the task BLOCKED with the blocking fact
2. Record the fact in the tasks.md blocked section
3. Continue with the next unblocked task; escalate after two blocked tasks
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Corpus and baseline | Primary | `command-prompts.jsonl`, `capture-command-routing-baseline.mjs`, `command-routing-baseline.json`, `tests/command-routing-slice.vitest.ts`, `scripts/routing-accuracy/README.md` | Planned |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | Baseline written | Primary | The three gates run |

### File Ownership Rules
- Each file owned by ONE workstream
- Cross-workstream changes require SYNC
- Conflicts resolved at sync points
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per task**: the box in `tasks.md` is ticked with its verify output.
- **Per phase**: `implementation-summary.md` records the baseline numbers and the slice test's run time.
- **Blockers**: reported to the operator in the session the same turn.

### Escalation Path
1. A pinned number moves → stop and report to the operator before any re-capture of `scorer-eval-baseline.json`.
2. A gold label needs a preference outside decisions D1 to D5 → ask the operator.
<!-- /ANCHOR:communication -->

---
