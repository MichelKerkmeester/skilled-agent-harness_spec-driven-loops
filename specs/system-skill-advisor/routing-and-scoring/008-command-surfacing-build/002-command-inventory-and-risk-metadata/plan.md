---
title: "Implementation Plan: Phase 2: command-inventory-and-risk-metadata"
description: "Makes the command bridge deriver read the command tree, adds risk keys to every command metadata entry and emits a derived policy list. The approach adds a top-level key to the generated file so no bridge entry and no scorer input changes."
trigger_phrases:
  - "command inventory and risk metadata plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: command-inventory-and-risk-metadata

<!-- SPECKIT_LEVEL: 3+ -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (`.cjs`), JSON, YAML, TypeScript test |
| **Framework** | None |
| **Storage** | `command-metadata.json` per skill, `_routes.yaml`, `command-bridges.generated.json` |
| **Testing** | Vitest in the advisor runtime, `node --test` style `.test.cjs` in sk-create-skill |

### Overview
The deriver gains a tree read, two identity failures, attribute validation and a policy function, and it writes the result as a new top-level `commandPolicies` array. Five metadata files and the doctor manifest gain the risk keys, after the skill root metadata contract is amended to let a standalone root carry the file. The proof is `--check` printing `fresh`, a fixture test for the failures and the rule, and the phase 1 baseline rows holding still.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Commands run from the repository root. `ADV`, `SK`, `D` and `G` are defined in `tasks.md`.

### Definition of Ready
- [x] `node $D --check | jq -r .status` prints `fresh`
- [x] `node $SK/scripts/ci-skill-root-metadata.cjs | tail -1` prints `checked=14 passed=14 failed=0 fixed=0`
- [x] `npx vitest run tests/command-routing-slice.vitest.ts` in `ADV` reports 0 failed

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is `Met`
- [x] `npm test` in `ADV` reports 0 failed and `node $SK/scripts/ci-skill-root-metadata.cjs | tail -1` reports `failed=0`
- [x] `spec.md`, `plan.md` and `tasks.md` name the same files
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declare, derive, check. Owners declare a class, the deriver computes the policy, `--check` holds the generated file to both.

### Key Components
- **Tree read in `derive-command-bridges.cjs`**: lists `.skilled/commands/<namespace>/<name>.md`, skipping `README.md`, `*.contract.md` and any name starting `local-`. Without it the 4 commands that no source names stay invisible.
- **Identity check**: a command file with no metadata entry and no doctor route fails, and a metadata entry or doctor route with no file fails. Allow-list rows are skipped through one named constant.
- **Risk keys**: `mutating`, `gate3_location`, optional `ask_first`, optional `write_scope`. The doctor manifest already has the first two.
- **`derivePolicy(record)`**: a pure exported function with the five rows of REQ-007. Without it each later phase would restate the rule.
- **`commandPolicies`**: a top-level array in the generated file. It sits outside `entries` because the drift guard compares each entry with a fixed key set, and outside the scorer blocks because nothing scores on it yet.
- **Contract amendment**: `command-metadata.json` moves from forbidden to optional on standalone roots, and the gate requires `ownerMode` to equal the skill id where no registry exists.

### Data Flow
The deriver reads the tree, the metadata files, the allow-list and the doctor manifest. It builds `entries` as today, except that a metadata entry whose command an allow-list row already carries adds no entry. It then builds one policy record per non-doctor command from its metadata entry, one per doctor route and `mcp_subroutes` item, and one per action of a `standalone` doctor command that declares `actions`, or one for the command when it declares none. It sorts the records by `command` then `route` and writes them with the entries.

### Record shape

```json
{"command":"/doctor:git","route":"hooks","mutating":"mutates","askFirst":[],"policy":"ask"}
{"command":"/deep:research","route":null,"mutating":"mutates","askFirst":["spend"],"policy":"ask"}
{"command":"/speckit:search","route":null,"mutating":"read-only","askFirst":[],"policy":"run"}
```

### Classes to author

The hub entries take these values, from section 5 of the review. All 13 `/create` commands and the 3 `/design` commands are `mutates` with no `ask_first`, which derives `start`. The 3 `/deep` commands are `mutates` with `ask_first: ["spend"]`. In `system-spec-kit`: `plan`, `implement`, `complete`, `resume` and `save` are `mutates` with no `ask_first`, `search` is `read-only`, and `handoff` is `mutates` with `ask_first: ["relaunch"]`. `/prompt:improve` is `mutates` with no `ask_first`. `gate3_location` names the write target in one phrase, or starts with `n/a` for a read-only command.

In `_routes.yaml`, `write_scope: spec-folder` goes on the `/doctor:speckit` and `/doctor:deep-loop` routes, whose targets are a packet's scratch folder. `/doctor:update align` stays without it, so it derives `start`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A as a fix. The table lists every reader of what this phase changes, because a shared contract and a generated file are both touched.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ADV/tests/command-bridges-drift-guard.vitest.ts` | Compares each entry with a fixed key set, pins 5 TypeScript and 15 Python non-doctor active entries and recomputes the expected ids from the sources | update: its expected ids skip a metadata entry whose command an allow-list row carries | Found at build time. The plan had it as unchanged, and its first run failed on the four `/speckit` ids the deriver now drops |
| `ADV/tests/command-metadata-e2e.vitest.ts` | Pins the metadata census at 19 and checks owner and command file per entry | update the census to 27 | The four allow-list commands keep `ownerMode` `system-spec-kit`, which equals the new metadata's owner |
| `ADV/scripts/skill_advisor.py` `_generated_command_bridges()` | Reads five keys per entry and ignores the rest | unchanged | A new top-level key is never read |
| `ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs` | Reads `counts` and the TypeScript-enabled entries | unchanged, baseline re-captured | Only `bridgeCounts` may differ |
| `.skilled/commands/doctor/scripts/route-validate.py` | Requires known keys and checks the `mutating` enum, tolerates unknown keys | unchanged | Run the doctor route validator after the manifest edit |
| `.skilled/commands/doctor/scripts/doctor-helper-match.cjs` | Reads `mutating` per route | not a consumer of the new keys | It reads routes, and `/doctor:env` keeps its command-level `mutating` |
| `SK/scripts/ci-skill-root-metadata.cjs` | Fails a standalone root that carries `command-metadata.json` | update | 14 roots pass before and after |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup confirms the deriver, the contract gate and the phase 1 slice are green and records the generated file's hash. Implementation amends the contract in `SK/scripts/lib/skill-root-metadata-contract.cjs`, adds the risk keys and the two new metadata files, then changes `derive-command-bridges.cjs` and regenerates. Verification runs the deriver check, the fixture test, the contract gate and the whole advisor suite, and compares the policy rollup with the review.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The one command is `npm test` in `ADV`, which must report 0 failed, followed by `node $SK/scripts/ci-skill-root-metadata.cjs | tail -1` printing `failed=0`.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `derivePolicy` over the five rule rows | Vitest, `tests/command-policy-derivation.vitest.ts` |
| Integration | The two identity failures against a fixture skills root and commands root, the contract gate over all roots, the phase 1 slice | Vitest, `.test.cjs`, the gate script |
| Manual | The rollup of 7 run, 22 start and 15 ask, and the baseline diff limited to `bridgeCounts` | `jq`, `git diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 baseline and slice test | Internal | Green | No proof that routing held still |
| `SK/scripts/ci-skill-root-metadata.cjs` | Internal | Green: 14 of 14 | The two new files cannot land |
| Review section 5 table | Internal | Green | Classes would be guesses |
| No new package | - | Green | - |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a pinned number or a baseline row moves, or the contract gate fails on a root this phase did not touch.
- **Procedure**: `git checkout -- .skilled` restores every tracked file, then delete the three new files (`system-spec-kit/command-metadata.json`, `sk-prompt/command-metadata.json`, `ADV/tests/command-policy-derivation.vitest.ts`). Phase 1's four files are untracked too and must be kept, so the delete names the three files and nothing wider.
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
| Verification | Implementation | Closing the phase and starting 003 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
contract amendment ──► new metadata files ──┐
risk keys on 19 entries ────────────────────┼──► deriver change ──► regenerate ──► tests
doctor manifest keys ───────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Contract amendment | None | A gate that accepts a standalone metadata file | New metadata files |
| Risk keys and new metadata files | Contract amendment | A class for every non-doctor command | Deriver change |
| Doctor manifest keys | None | `/doctor:env` actions and two `write_scope` marks | Deriver change |
| Deriver change and regeneration | The three above | `commandPolicies` and the identity check | Tests and the rollup |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Amend the contract and its test** - one rule in two files - CRITICAL
2. **Author the classes and the two new files** - 27 entries - CRITICAL
3. **Change the deriver, regenerate and test** - one script, one new test - CRITICAL

**Total Critical Path**: one working session. No duration is measured yet.

**Parallel Opportunities**:
- The risk keys on the three existing metadata files and the doctor manifest keys can be written while the contract is amended.
- The README and the contract reference can be written while the tests run.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Contract amended | The gate passes with a standalone metadata fixture and fails on a wrong owner | End of Implementation, first third |
| M2 | Classes authored | `jq` finds no entry without `mutating` in the five metadata files | End of Implementation, second third |
| M3 | Policies derived | `--check` prints `fresh` and the generated file lists 44 commands in `commandPolicies` | End of Implementation |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Amend the skill root metadata contract

**Status**: Accepted

**Context**: The review asks for `command-metadata.json` in `system-spec-kit` and `sk-prompt`. Both are standalone roots, and the contract forbids the file there because a standalone root has no registry mode for `ownerMode` to name.

**Decision**: The operator chose on 2026-11-12 to amend the contract. The file becomes optional on a standalone root, and where no `mode-registry.json` exists `ownerMode` must equal the skill id.

**Consequences**:
- The 8 commands get their attributes in the same file shape as the other 19.
- A shared sk-doc contract changes inside an advisor packet. Mitigation: the change is one rule, with a passing and a failing fixture in the contract's own test.

**Alternatives Rejected**:
- A manifest beside the commands, like `doctor/_routes.yaml`: kept the contract but added a third attribute format.
- Keys in command frontmatter: mirrored into every runtime's command directory with unknown effect.

### ADR-002: Policies as a top-level list, not entry fields

**Status**: Accepted

**Context**: The drift guard compares each entry with a fixed key set, the Python parity probe compares generated rows with a hand-kept copy, and a policy belongs to a command or route and not to a scorer runtime.

**Decision**: Emit `commandPolicies` beside `entries`. Leave every entry and every generated scorer block as it is.

**Consequences**:
- No scorer input changes, so the phase 1 baseline holds by construction.
- Phase 004 must join a recommendation to its policy by command and route. Mitigation: the list is sorted and keyed on both.

**Alternatives Rejected**:
- Fields on each entry: breaks the drift guard and feeds the generated blocks before anything reads them.

### ADR-003: A `write_scope` mark for spec-folder-only writes

**Status**: Accepted

**Context**: The rule runs an `add-only` route outright only when every write lands in the bound spec folder. `gate3_location` is free text, so the deriver cannot read that from it.

**Decision**: One optional key, `write_scope`, with the single value `spec-folder`.

**Consequences**:
- The rule is mechanical.
- One more key to keep true. Mitigation: it is set on two routes, and an unknown value fails the deriver.

**Alternatives Rejected**:
- Parsing `gate3_location`: a wording change would silently flip a policy.

### ADR-004: Keep the allow-list rows for now

**Status**: Accepted

**Context**: Four allow-list rows carry commands that gain metadata in this phase, and three name commands with no file. Their ids are active in the scorers.

**Decision**: A metadata entry whose command an allow-list row carries adds no second entry, and allow-list rows are exempt from the orphan check. Retirement stays in phase 004.

**Consequences**:
- No active id changes, so routing holds still.
- The exemption hides three known orphans. Mitigation: one named constant with a comment saying why.

**Alternatives Rejected**:
- Retiring the rows now: changes active ids in both scorers before the contract change that replaces them.

---


---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

One brief per file change, each naming the file, the edit and the check. The orchestrating session runs the setup and verification tasks and reads every diff before the next brief goes out.

### Tier 1: Sequential Foundation
**Files**: the contract module, the gate and the contract test
**Agent**: Primary or one worker

### Tier 2: Parallel Execution
| Agent | Focus | Files |
|-------|-------|-------|
| Worker A | Risk keys on existing entries | The three existing `command-metadata.json` files, one brief each |
| Worker B | New metadata files | `system-spec-kit/command-metadata.json`, `sk-prompt/command-metadata.json` |
| Worker C | Doctor manifest keys | `_routes.yaml` |

### Tier 3: Integration
**Agent**: Primary or one worker
**Task**: The deriver change, regeneration, the new test and the census update, in that order

### Pre-Task Checklist
- [x] Read spec.md, this plan and tasks.md before the first edit
- [x] Confirm the target files match the workstream file ownership below
- [x] Know the verification command for the task before starting it

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
| W-A | Contract | Primary | `SK/scripts/lib/skill-root-metadata-contract.cjs`, `SK/scripts/ci-skill-root-metadata.cjs`, its test and reference | Planned |
| W-B | Attributes | Workers | Five `command-metadata.json` files, `_routes.yaml` | Blocked on W-A for the two new files |
| W-C | Derivation | Primary | `derive-command-bridges.cjs`, the generated outputs, the two test files, the README, the baseline | Blocked on W-B |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A and W-B complete | Primary | The contract gate run |
| SYNC-002 | W-C complete | Primary | The whole suite and the rollup |

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
- **Per phase**: `implementation-summary.md` records the policy rollup and any command that departs from the review table.
- **Blockers**: reported to the operator in the session the same turn.

### Escalation Path
1. A pinned number moves → stop and report to the operator before any re-capture of `scorer-eval-baseline.json`.
2. A command's class cannot be confirmed from its workflow file → class it `mutates` and list it for the operator.
<!-- /ANCHOR:communication -->

---
