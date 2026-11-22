---
title: "Implementation Plan: Phase 1: contracts-and-state-root"
description: "Build six TypeScript libraries under the new skill's runtime folder: run record, BOT.md definition, bots/config.json, repository identity, state layout and needs-you item. Each is proven by vitest with state redirected to temp folders."
trigger_phrases:
  - "contracts and state root plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: contracts-and-state-root

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, loaded through `tsx`, the same as `.skilled/skills/system-deep-loop/runtime/` |
| **Framework** | None |
| **Storage** | Plain files. Records, queue, leases, switches and needs-you items under the user-level state root. Run folders in the Skilled tree's gitignored `.skilled/skills/.state/system-skilled-bots/`. No database in this phase |
| **Testing** | vitest, run by `npm test` in the skill's runtime folder |

### Overview
This phase adds six libraries under `.skilled/skills/system-skilled-bots/runtime/lib/`: the run record, the `BOT.md` definition, the `bots/config.json` reader, hub identity, the state layout and the needs-you item. They reuse `currentRepository` from sk-code and `writeStateAtomic` from the deep-loop runtime and copy neither. A vitest suite with `XDG_STATE_HOME` and the Skilled tree pointed at temp folders proves each acceptance criterion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [x] The operator has answered ADR-001 (Q3, answer D2) and ADR-002 (Q5, answer D3) on 2026-11-22

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npm test` in `.skilled/skills/system-skilled-bots/runtime/` exits 0, `git status --short` prints the same lines before and after it, and the real `.skilled/skills/.state/system-skilled-bots` is absent after it
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Pure contract libraries. Each module parses or locates and has no side effect apart from the atomic write helpers.

### Key Components
- **`run-record.ts`**: the record schema of research.md §10, with write by temp file and rename and a validating read. The record lives user-level and points to its run folder. The exit accepts `awaiting-decision` (ADR-010). Without it, status, delivery and the failure classes have no shared fields.
- **`definition.ts`**: parses `BOT.md` frontmatter and body, applies defaults and exports the field predicates, including the isolation resolver of ADR-007. Without it, the checker and the runner would each restate the field rules.
- **`repo-config.ts`**: reads `bots/config.json`. Without it, allowed executor kinds, default isolation, the identity field, the `gitHookTrigger` opt-in and the retention numbers have no home.
- **`identity.ts`**: wraps `currentRepository`, adds the explicit identity rule and exports the guard install and enqueue call. Without it, two remote-less repositories share one state folder (research.md §16 Q5).
- **`state-root.ts`**: resolves the user-level state root and the in-tree run root and names every subfolder. It checks that a run folder path is gitignored before it creates it. Without it, each later phase picks its own paths.
- **`needs-you.ts`**: the needs-you item schema with write by temp file and rename, a validating read and the derived item state. Without it, phases 3, 5 and 7 would each invent the item shape (operator D1).

### Data Flow
A caller passes a checkout root and the Skilled tree that checkout resolves. `repo-config.ts` reads `bots/config.json` if present. `identity.ts` answers from the config's identity field, then the environment, then the origin remote, or refuses with `identity-unknown`.

`state-root.ts` turns that identity into two places:
- The user-level `<state root>/<identity key>/` holds `requests/` (with `inbox/`, `tmp/`, `claimed/`, `done/`, `quarantine/` and `seen/`), `leases/`, `switches/`, `needs-you/`, `records/` and `installs/`. The shared `index/` and `registered-roots` sit beside the identity folders. The state root is `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots/` (ADR-008).
- The in-tree `<Skilled tree>/.skilled/skills/.state/system-skilled-bots/<identity key>/runs/<run id>/` holds the evidence files of one run (ADR-001). The resolver asks git whether the path is ignored and refuses with `run-folder-not-ignored` when it is not.

`definition.ts` parses one `BOT.md` into a typed definition and resolves its isolation against the config default. `run-record.ts` writes the record for a run to `records/<run id>.json` with the absolute run folder path inside it. When a run parks, phase 3 writes the record with exit `awaiting-decision` and one item through `needs-you.ts`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/sk-code/shared/scripts/lib/repository-identity.cjs` | Owns `owner/name` identity from env or origin | unchanged, imported only | `git diff --stat` on the file prints nothing after the phase |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts` | Owns `writeStateAtomic` | unchanged, imported only | `git diff --stat` on the file prints nothing after the phase |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs` | Owns `STOP_REASONS`, including `blockedStop` | unchanged, read only | `awaiting-decision` maps to `blockedStop`. A test pins the mapping |
| `.gitignore` lines 134 to 137 and 273 to 274 | Ignore `.skilled/skills/.state/*/*` and nested copies | unchanged | `git check-ignore -v` on a run folder path prints line 135 |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Re-pins a vendored tree | unchanged, read only | T018 records what `touchedPaths` does to `.skilled/skills/.state/` |

Required inventories:
- Same-class producers: `rg -n 'XDG_STATE_HOME' .skilled` lists the existing state-root users, so the hub follows the same spelling.
- Consumers of changed symbols: none. Every symbol in this phase is new.
- Matrix axes: identity source (config, env, origin, none) by state-root source (default, `XDG_STATE_HOME`, config override). Twelve rows in the identity and state-root tests. Run root: ignored or not ignored, folder present or vanished. Four rows in the state-root and record tests.
- Algorithm invariant: two different checkouts with unknown identity never map to one state folder, and two clones with one origin map to the same folder. The only resolved path inside a Skilled tree is a run folder under `.skilled/skills/.state/system-skilled-bots/`, and it is gitignored. No path a run must not write resolves inside any tree.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup creates the runtime package root, runs the existing skill and advisor checks against the near-empty skill folder, lists the five status vocabularies, and records what a re-pin does to `.skilled/skills/.state/` and whether the doctor install flow ignores it. Implementation writes the state-root, identity, config, definition, record and needs-you libraries in that order, then the `BOT.md` template. Verification runs `npm test`, compares `git status --short` before and after, checks the real `.state` folder stays absent, and greps for `launchctl` and new status values.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

The one command is `npm test` in `.skilled/skills/system-skilled-bots/runtime/`. It must exit 0. `git status --short` must print the same lines before and after.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Record round trip, `null` cost, vanished run folder, definition parse and rejections, config defaults and retention keys, identity matrix and guard, state-root matrix, needs-you round trip and derived state | vitest |
| Integration | Identity against a real temp git repository with no remote, and one with an origin remote. The run root inside a temp Skilled tree that git ignores, and one it does not | vitest with `git init` in a temp folder |
| Manual | Read the `BOT.md` template against the three worked shapes of research.md §5 | Reading |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

No predecessor phase. Phases 2 and 3 depend on this one.

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `repository-identity.cjs` `currentRepository` | Internal | Green: exists and returns `{identity, source}` | Hub identity would need its own remote parser |
| deep-loop `atomic-state.ts` `writeStateAtomic` | Internal | Green: exists | Atomic writes would need a local helper |
| `tsx` and `vitest` | External, already used by the deep-loop runtime | Green | No TypeScript import and no test runner |
| Operator answers to Q3 and Q5 | Operator | Green: answered 2026-11-22 (D2, D3). The parent record carries them as ADR-002 and ADR-003, both Accepted | None. AC-006 stays Unmet only until this phase closes |
| Doctor overlay engine `touchedPaths` | Internal, read only | Green: read, not yet run | Without the staged re-pin, the claim that a re-pin keeps `.state` stays inferred |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: an existing skill, advisor or mirror check fails because of the new skill folder, or a test leaves a file in the checkout.
- **Procedure**: revert the phase commit. Every file in this phase is new and sits under `.skilled/skills/system-skilled-bots/`, so the revert touches no shared file. Delete the temp state folders and temp Skilled trees the tests made.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation, because the layout depends on what the skill checks accept |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close, and the start of phases 2 and 3 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH
<!-- FILL: Draw the component order and fill the matrix with produces and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: `scripts/rotate-logs.sh`, then its test, then close. WEAK: Components depend on each other. -->

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ repo-config  │────►│   identity   │────►│  state-root  │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
              ┌──────────────────┬───────────────┤
              ▼                  ▼               ▼
       ┌────────────┐     ┌────────────┐  ┌────────────┐
       │ definition │     │ run-record │  │  needs-you │
       └────────────┘     └─────┬──────┘  └─────┬──────┘
                                └───────┬───────┘
                                        ▼
                                 ┌────────────┐
                                 │   verify   │
                                 └────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `repo-config.ts` | None | Typed config with defaults, including `identity` and `retention` | identity, definition |
| `identity.ts` | repo-config | Identity or `identity-unknown`, and the guard | state-root |
| `state-root.ts` | identity | User-level paths and the in-tree run folder path | run-record, needs-you |
| `definition.ts` | repo-config | Typed definition and the isolation resolver | Verification |
| `run-record.ts` | state-root | Record write and read, with the exit value `awaiting-decision` | Verification |
| `needs-you.ts` | state-root | Item write and read, with derived state | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH
<!-- FILL: Name the longest chain and its total. List what can run in parallel. Write `N/A` with one reason, or delete the whole section. GOOD: Implementation to verification, 40 minutes. Docs run in parallel. WEAK: The critical path is the main path. -->

1. **Setup T001 to T004, T018 and T023** - half a day - CRITICAL, because the layout depends on what the checks accept and on what a re-pin does
2. **config, identity, state-root (T007, T006, T005, T019, T022)** - one day - CRITICAL
3. **run-record and needs-you (T009, T020)** - half a day - CRITICAL
4. **Verification T012 to T017** - two hours - CRITICAL

**Total Critical Path**: about two and a half days. These are estimates, not measurements.

**Parallel Opportunities**:
- `definition.ts` (T008) and the fixtures (T010) can run beside identity and state-root.
- The template (T011) and the retention keys (T021) can run after config.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES
<!-- FILL: Name three milestones with a command-checkable success criterion. Write `N/A` with one reason, or delete the whole section. GOOD: M1: `--keep` parses. `rg -n 'keep' scripts/rotate-logs.sh` prints the branch. WEAK: Milestones are tracked. -->

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | `scratch/skill-checks.txt`, `scratch/vocabularies.md` and `scratch/overlay-repin-state.md` exist, and `npm --prefix $R test -- --passWithNoTests` exits 0 | Setup |
| M2 | Contracts written | `npm --prefix $R test` exits 0 with every library's test file present | Implementation |
| M3 | Phase closeable | Every row in `acceptance-criteria.md` is Met and `validate.sh --strict` prints `RESULT: PASSED` | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD
<!-- FILL: Write one ADR per decision. Name the context, the choice, the consequence and the rejected option. GOOD: ADR-001: an option, because the script already parses options. WEAK: We made a decision. -->

The full records live in `decision-record.md`. This table is an index only.

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Run folders in the Skilled tree's gitignored `.state`, the record and everything a run must not write user-level, nothing committed | Accepted (operator D2) |
| ADR-002 | Explicit `identity` field, refuse install and enqueue while unknown | Accepted (operator D3) |
| ADR-003 | Code lives in the skill's `runtime/` with a thin bin CLI | Proposed |
| ADR-004 | TypeScript with a self-contained runtime package | Proposed |
| ADR-005 | Reuse the five status vocabularies | Proposed |
| ADR-006 | Two clones share one identity folder | Proposed |
| ADR-007 | Missing isolation is refused | Proposed |
| ADR-008 | Folder name and the closed subfolder list across both roots | Proposed |
| ADR-009 | `gitHookTrigger` opt-in key | Proposed |
| ADR-010 | Exit `awaiting-decision` and the needs-you item | Proposed (operator chose the queue in D1) |
| ADR-011 | Retention keys and defaults | Accepted (operator D5) |

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read the task's files and the ADR it names before the first edit.
- [ ] Export `XDG_STATE_HOME=$S` and pass a temp Skilled tree before any test run.
- [ ] Save `git status --short` and the listing of the real `.skilled/skills/.state/` before the suite.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Run the tasks in `tasks.md` order. A `[P]` task may run beside its neighbors |
| TASK-SCOPE | Write only under `.skilled/skills/system-skilled-bots/` and this phase's `scratch/`. Never edit sk-code, deep-loop or doctor files |
| TASK-PATHS | Call the `state-root.ts` path functions. Never join a state path by hand |

### Status Reporting Format
After each task: "Task T### complete. Files: [list]. Verify: [command] printed [output], exit [code]."

### Blocked Task Protocol
If BLOCKED: stop, mark the task `[B]` with the reason and the ADR or operator answer it waits on, and report it. Do not work around a refusal by picking a default.
