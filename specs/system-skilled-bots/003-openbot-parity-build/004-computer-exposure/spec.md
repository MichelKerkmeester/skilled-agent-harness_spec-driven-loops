---
title: "Feature Specification: Phase 4: computer-exposure"
description: "Name the bot's worktree or run folder in its prompt as its working place, and show that path and branch in the run record and in `bots status`, so an operator can tell where an unattended run worked without opening its folder. No browser computer."
trigger_phrases:
  - "computer exposure"
  - "phase 4 computer exposure"
  - "bot working place"
  - "worktree in bots status"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: computer-exposure

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 10 |
| **Predecessor** | 003-terminal-screen |
| **Successor** | 005-memory |
| **Handoff Criteria** | `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints no `failed` and `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0; a worktree run's prompt names its tree and its record carries that branch; `bots status` prints `branch <name>` on that run's row; an index built before the change still opens without `--rebuild` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification.

**Scope Boundary**: One prompt line, one record field that already exists and is filled for every dispatched run, and two parts on a status row. It adds no module, no state file, no CLI verb, no dependency and no index schema change. The browser computer OpenBot ships stays out.

**Size**: S, risk low, as the research ranks computer exposure. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:143]

**Dependencies**:
- `isolation.ts`, which already creates the tree and knows its branch. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:3-30]
- `state-root.ts`, which already names the run folder. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:366]
- `posture.ts`, which already decides whether a run gets a tree at all. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:3-14]
- The `buildBotPrompt` section order, a shared record owned by 005 and fixed in the parent's table and in 005's Prompt Section Order paragraph, so the line has one slot rather than one per phase. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:130] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:71]

**Deliverables**:
- One working-place line in `buildBotPrompt`, naming the directory the child starts in, its branch and the run folder.
- `evidence.branch` filled for every dispatched run, not only a worktree run.
- `branch <name>` and `worktree <path>` on a `bots status` row, and `lastRun.branch` and `lastRun.worktreePath` in `bots status --json`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A bot run starts in a directory its prompt never names. `buildBotPrompt` adds a checkout line only when the executor kind keeps its child in a lineage folder, and that set holds one kind, so a worktree bot dispatched through any other kind is told nothing about the tree it is standing in. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:171] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:315-332] The record keeps the tree's path and branch for a worktree run and leaves both null for a shared one, and `bots status` prints neither, so an operator asking where a run worked has to open its record and know the isolation rule to read the answer. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:335-346] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:479-486]

### Purpose
Every dispatched prompt names the directory the bot works in, and every run record and status row says which path and branch that was.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/bots.cjs status
index built 2026-11-25T07:15:44.421Z (/Users/michelkerkmeester/.local/state/system-skilled-bots/index/status.sqlite)
ok	skilled-scratch/bots-live-consumer	hello	/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/e69eaf8b-97d2-4d96-ad3f-66a87da7bbe5/scratchpad/live-consumer	last 20261122T230742Z-513cb828 converged	delivery local-only:not-attempted
EXIT=0

$ node .skilled/bin/bots.cjs status --json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s);console.log(JSON.stringify(r.rows[0].lastRun));})'
{"runId":"20261122T230742Z-513cb828","dispatchedAt":"2026-11-22T23:07:43.026Z","exitReason":"converged","exitClass":null,"needsYouItemId":null,"delivery":[{"channel":"local-only","state":"not-attempted"}]}

$ node -e 'const r=require(process.argv[1]);console.log(JSON.stringify(r.evidence))' /Users/michelkerkmeester/.local/state/system-skilled-bots/skilled-scratch%2Fbots-live-consumer/records/20261122T230742Z-513cb828.json
{"runFolder":"/Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fbots-live-consumer/runs/20261122T230742Z-513cb828","ledgerDir":"/Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fbots-live-consumer/runs/20261122T230742Z-513cb828/ledger","receiptDir":"/Users/michelkerkmeester/.local/state/system-skilled-bots/skilled-scratch%2Fbots-live-consumer/receipts/20261122T230742Z-513cb828","observabilityStream":"/Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/skills/.state/system-skilled-bots/skilled-scratch%2Fbots-live-consumer/runs/20261122T230742Z-513cb828/observability.jsonl","worktreePath":null,"branch":null}

$ rg -n "LINEAGE_FOLDER_KINDS" .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts
171:const LINEAGE_FOLDER_KINDS: ReadonlySet<ExecutorKind> = new Set(['cli-mistral-vibe']);
179:  return LINEAGE_FOLDER_KINDS.has(kind);
503:  const lineageDir = LINEAGE_FOLDER_KINDS.has(input.executor.kind as ExecutorKind)
```

The first block is the measured gap: the row carries the checkout path and no branch. The second is the same row as data, and `lastRun` carries neither a branch nor a tree. The third is the record behind that row, where a shared run leaves `worktreePath` and `branch` null. The fourth is why a worktree bot's prompt names nothing: the checkout line is added for one executor kind only.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one working-place line to `buildBotPrompt`, naming the directory the child starts in, its branch and the run folder.
- Fill `evidence.branch` for every dispatched run, reading the checkout's branch once for a shared run.
- Print `branch <name>` and `worktree <path>` on a `bots status` row, and carry `lastRun.branch` and `lastRun.worktreePath` in `bots status --json`.
- Carry both fields in the status index's run summary without a schema-version bump.
- Prove each with a vitest case in the suite that already owns the module.

### Out of Scope
- A browser computer, a container, a per-bot token and a vault login - OpenBot's largest surface, and the research keeps it out because a small team uses its own logged-in browser for the steps that need one. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:85]
- A new CLI verb or flag - `bots status` already prints the row and already has `--json`. [SOURCE: .skilled/bin/bots.cjs:48]
- A new run-record field - `evidence.worktreePath` and `evidence.branch` already exist, so this phase fills the second for every run rather than adding a third. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:151-157]
- A status-index schema bump - the run summary is stored as JSON, so the two fields ride in it and an existing index keeps opening. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:55]
- Changing which runs get a tree - `posture.ts` owns that decision and this phase reads it. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:3-14]
- A status part for the run folder - the row already carries the checkout path, and the run folder is evidence, not a working place.
- The terminal screen's header - phase 003 owns `bots ui`, and it reads `bots status --json`, so it gains the fields without an edit.
- The `.opencode/` tree - `skills` and `bin` there are relative symlinks to `.skilled/`, so an edit through either path lands on the one source file. [SOURCE: .opencode/SYNC.md:32]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Modify | `workingPlaceLine` and the `workingPlace` input on `buildBotPrompt` |
| `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts` | Modify | `checkoutBranch`, the one git read of a checkout's branch |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | Pass the working place, fill `evidence.branch` on the dispatch path, and add the line to a resumed prompt that lacks it |
| `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` | Modify | `RunSummary.worktreePath` and `RunSummary.branch`, filled by `summarizeRecord` |
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | Modify | `LastRun.worktreePath` and `LastRun.branch`, and the two appended row parts |
| `.skilled/skills/system-skilled-bots/runtime/tests/dispatch.vitest.ts` | Modify | The line's two shapes and its absence when no working place is given |
| `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts` | Modify | A worktree run's prompt names its tree and branch |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Modify | A shared run's record carries the checkout branch, and a refusal carries neither |
| `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts` | Modify | The summary carries both, and a summary written without them reads back null |
| `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts` | Modify | The row text and the JSON carry both fields |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modify | The `dispatch.ts`, `isolation.ts` and `status.ts` rows |
| `.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` | Modify | What a row shows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `buildBotPrompt` emits one working-place line naming the directory the child starts in, its branch and the run folder: `Your working place is <path> on branch <branch>. This run's folder is <runFolder>.` When the branch is null the line reads `Your working place is <path>. This run's folder is <runFolder>.` One exported `workingPlaceLine` builds it, so a resumed run can find it by exact text and never by a pattern. The line takes the working-place slot in the shared section order, after the spec-folder line and before the checkout line, so the four phases that edit `buildBotPrompt` produce one prompt; the checkout line is emitted only for a child that starts outside the checkout, and 005's memory block and 009's skills block land after it and before the decision-marker line, so the assertion holds before and after them. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:130] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:71] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:326] |
| REQ-002 | The working place is the tree for a worktree run and the checkout for a shared run. `runner.ts` passes the directory it dispatches into and the branch it resolved, so the line and the child's `cwd` can never disagree. |
| REQ-003 | `evidence.branch` is a string for every dispatched run whose working place is on a branch, and null only when git reports a detached HEAD or does not answer. A shared run reads the checkout's branch once through `checkoutBranch` in `isolation.ts`; a worktree run uses the branch the tree was made on. The record is the file `recordFile(stateRoot, identity, runId)` returns, `<stateRoot>/<identityKey>/records/<runId>.json`, so a proof reads that path and never a copy inside the run folder. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:176-178] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:362-369] |
| REQ-004 | `bots status` prints `branch <name>` when the last run recorded a branch and `worktree <path>` when it recorded a tree, both appended after every part the row already prints, so no existing part moves. A row whose last run recorded neither prints neither. |
| REQ-005 | `bots status --json` carries `lastRun.branch` and `lastRun.worktreePath`, each a string or null, and adds no other key to a row. |
| REQ-006 | The status index carries both fields in `RunSummary`, filled by `summarizeRecord` from the record's evidence, and `SCHEMA_VERSION` stays `'2'`, so an index built before this phase still opens. |
| REQ-007 | A resumed run's prompt names the parked tree. When the parked prompt carries no working-place line, the runner adds the current one before dispatch, by exact-text check, so a prompt parked before this phase still names its working place. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | A run refused before dispatch records neither a branch nor a tree, so a refusal record reads exactly as it does today. |
| REQ-009 | The two docs name the fields: `runtime/lib/README.md` for the `dispatch.ts`, `isolation.ts` and `status.ts` rows, and `bots-status/references/status-and-inbox.md` for what a row shows. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Design references

Each requirement follows one existing shape in this tree rather than inventing one.

| Requirement | Reference | What it fixes |
|-------------|-----------|---------------|
| REQ-001 | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:301-308] | One exported line builder, so a resumed run swaps it by exact text |
| REQ-001 | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:130] | The section order is a shared record owned by 005, so the line has one slot rather than one per phase |
| REQ-002 | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1038] | The directory the child starts in is already one value, `workDir` |
| REQ-003 | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1033] | A worktree run already records the tree's branch |
| REQ-004 | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:479-486] | The row is a list of named parts, so a new part is appended |
| REQ-006 | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:266-292] | The summary is stored as JSON, so a field needs no column |
| REQ-007 | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:994-1000] | The resume path already checks a parked prompt by exact text |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A worktree run's prompt holds `Your working place is <tree> on branch worktrees/NNN-bot-<id>.` in the shared order's working-place slot, after the spec-folder line and before the checkout line, and its record's `evidence.branch` is that branch.
- **SC-002**: A shared run's record holds the checkout's branch, and `bots status` prints `branch <name>` on that run's row.
- **SC-003**: `bots status --json` carries `lastRun.branch` and `lastRun.worktreePath` and no other new key.
- **SC-004**: `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints no `failed`, and `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0.
- **SC-005**: An index built before the change still opens: `node .skilled/bin/bots.cjs status` exits 0 without `--rebuild`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `isolation.ts`'s git read of a checkout's branch | A shared run records a null branch and its row omits the part | Null is a legal value for `evidence.branch`, so a failed read never refuses a run |
| Dependency | `posture.ts`'s isolation answer | The line names the wrong directory if the runner and the posture disagree | The line is built from `workDir`, the same value the child's `cwd` uses |
| Risk | A prompt line that names an absolute path reaches a receipt | Low | The receipt already holds the prompt, and a lineage kind's prompt already names the checkout path; the line adds no new class of path |
| Risk | A prompt parked before this phase resumes without the line | Medium | REQ-007 adds it by exact-text check, and a test drives a parked prompt that lacks it |
| Risk | A consumer parses the status row by position | Low | Both parts are appended after every existing part, so no existing position moves, and `--json` is the documented machine surface |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A shared run adds one `git rev-parse` call, under 20 ms on this repository; a worktree run adds none, because the tree's branch is already known.
- **NFR-P02**: A status row gains at most two parts, so `bots status` over 200 bots stays under the time it takes today plus one string join.

### Security
- **NFR-S01**: The line names a path the record already holds and adds no credential, no environment value and no token.
- **NFR-S02**: The line is added after the secret-literal check runs, so a path the runner produced can never be the reason a run is refused.

### Reliability
- **NFR-R01**: A git read that fails records null and never refuses a run, so a detached or unreadable checkout still dispatches.
- **NFR-R02**: An index built before this phase opens and prints rows with neither part, so no operator needs `--rebuild` to keep reading status.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a run on a detached HEAD records `branch: null`, the prompt line omits the branch clause, and the row omits `branch`.
- Maximum input: a working-place path of 4,096 characters is carried verbatim; the line stays one line and the prompt is not wrapped.
- Failure path: `git rev-parse` exits non-zero - `checkoutBranch` returns null, the run dispatches, and the record's `branch` is null.
- Old index: an index built before this phase opens, and its rows print neither `branch` nor `worktree`.
- Old parked prompt: a prompt parked before this phase gains the working-place line before dispatch, and its record names the parked tree.
- Refused run: a run refused before dispatch records neither a branch nor a tree, so its record is byte-identical to today's.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Five modules and about 60 lines, four test files and two docs |
| Risk | 6/25 | No auth, no migration, no new dependency and no index schema change; one output shape gains two appended parts |
| Research | 4/20 | The research names the change and the five modules are read once |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should a shared run record the checkout's branch, or leave it null because the bot created no branch? Decision: record it. A shared run edits the operator's working tree, so the branch is exactly what tells them where the edits landed.
- Should `bots status` print the run folder too? Decision: no. The row already carries the checkout path, and the run folder is evidence, not a working place.
- Does the terminal screen need an edit? Decision: no. It reads `bots status --json` and gains both fields without a change.
- Does the `.opencode/` tree need a copy? Decision: no. `skills` and `bin` there are relative symlinks to `.skilled/`, so one edit reaches both paths.
<!-- /ANCHOR:questions -->

---
