---
title: "Feature Specification: Phase 6: purpose-carry-follow-ups"
description: "Building the five purpose-carry phases surfaced three defects outside them. Five live phase parents still carry the scaffold purpose sentence, the PreCompact brief names no spec folder for packets under specs/ and the resume workflow assets list different brief rows than the presentation file. This phase plans the fourteen edits that close them, and a fifteenth that closes one test gap the independent review found."
trigger_phrases:
  - "purpose carry follow ups"
  - "phase 6 purpose carry follow ups"
  - "scaffold purpose sentence live parents"
  - "precompact active spec folder line"
  - "resume brief reply format rows"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: purpose-carry-follow-ups

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/371-purpose-retention-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 10 |
| **Predecessor** | 005-continuity-purpose-field |
| **Successor** | 007-purpose-reader-coverage |
| **Handoff Criteria** | The five parents print no scaffold purpose sentence, the two hook test files pass 41 of 41, the phase workflow test prints `passed=148 failed=0` and the brief-row check prints `match` for both resume assets |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Carry a packet's purpose across handovers and compactions specification.

**Scope Boundary**: Three defects found while building phases 001 to 005. The `### Problem Statement` and `### Purpose` text of five live phase parents, the folder regex in the Claude PreCompact hook with one new test and the `reply_format` line of the two resume workflow assets. Added after the independent review of 2026-11-14: one assertion in the scaffold gate test. No change to the purpose helper, the resume `purpose_row` rule, the relaunch note, the scaffold templates or the continuity block.

**Dependencies**:
- None blocking. Phases 001 to 005 are built. The five parent rewrites make the parent purpose that phases 002 and 004 already read show up for those parents' children.

**Deliverables**:
- Real Problem Statement and Purpose text in five phase parent `spec.md` files
- `detectSpecFolder` in `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` matching `specs/` paths, with one new test in `runtime/tests/hook-precompact.vitest.ts`
- A `reply_format` line in both resume workflow assets that lists the presentation file's brief rows
- One assertion in `runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts` that a new phase parent which leaves Draft with an unfilled purpose fails the gate
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The parent exists because the reason for a piece of work got lost across session handovers and compactions. Its five built phases carry the Purpose written in a packet's `spec.md` into the resume brief, the relaunch note, the post-compaction context and the continuity save.

Building them surfaced three defects outside those phases. First, five live phase parents still hold the scaffold sentence that begins "Keep parent documentation lean" as their Purpose, and their Problem Statement only restates the folder title. A resume or compaction on one of their children finds no real parent purpose to quote. Second, `detectSpecFolder` in `compact-inject.ts` matches only `.opencode/specs/` paths, so in this repository, where packets live under `specs/`, the PreCompact brief never prints its `Active spec folder:` line. Third, the `reply_format` line in the two resume workflow assets lists six rows while the presentation file's Resume Brief lists ten, and the two name the source row and its values differently.

The independent review of 2026-11-14 added a fourth item. Phase 001 made an unfilled purpose in a new phase parent fail the gate once the parent leaves Draft, and that was proven in a hand-run sandbox only. `scaffold-passes-its-own-gate.vitest.ts` asserts that the unfilled token is present and never that it blocks.

### Purpose
After this phase, no live phase parent carries the scaffold purpose sentence, the brief cached before a compaction names the active packet for folders under `specs/` and the resume workflow assets list the same brief rows as the presentation file.

This phase does not make every live phase parent state a purpose. It rewrites the five parents that hold the scaffold sentence. Parents that state a purpose under another heading are read after phase 007, and the parents with a bracket placeholder or no purpose text are listed in Out of Scope.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
All three ran from the worktree root on 2026-11-14 at `145d8e980f`. The first lists the live parents that carry the scaffold sentence, leaving out archived packets and this parent's own docs. The second loads the built hook and feeds it one transcript line that names a `specs/` path. The third compares the brief row labels with `scratch/check-brief-rows.py`, which this phase adds.
```text
$ rg -l -F 'Keep parent documentation lean' specs/ -g spec.md -g '!**/z_archive/**' -g '!specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/**' | sort
specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/spec.md
specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/006-operator-tooling/003-install-scripts-doctor-realignment/spec.md
specs/system-speckit/runtime-and-release/001-system-speckit-v4/003-spec-doc-template-reduction/spec.md
specs/system-speckit/runtime-and-release/001-system-speckit-v4/004-decisions-and-notes-system/spec.md
specs/system-speckit/runtime-and-release/001-system-speckit-v4/030-spec-kit-simplification-research/spec.md

$ node --input-type=module -e "
const m = await import('./.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/compact-inject.js');
const lines = ['Read /repo/specs/system-speckit/x/y/spec.md during compaction'];
console.log('specs/ ->', JSON.stringify(m.detectSpecFolder(lines)));
console.log('.opencode/specs/ ->', JSON.stringify(m.detectSpecFolder(['Read .opencode/specs/x/y/spec.md'])));
const r = await m.buildMergedCompactResult(lines, process.cwd());
console.log('Active spec folder lines in brief:', (r.text.match(/Active spec folder:/g) ?? []).length);
" 2>/dev/null
specs/ -> null
.opencode/specs/ -> ".opencode/specs/x/y"
Active spec folder lines in brief: 0

$ python3 specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/006-purpose-carry-follow-ups/scratch/check-brief-rows.py .skilled/commands/speckit/assets/speckit-resume-presentation.txt .skilled/commands/speckit/assets/speckit-resume-auto.yaml .skilled/commands/speckit/assets/speckit-resume-confirm.yaml
speckit-resume-auto.yaml differ yaml=['Purpose', 'Confidence', 'Context source', 'Now', 'Last confirmed', 'Next safe action'] brief=['Spec', 'Purpose', 'Confidence', 'Source', 'Now', 'Last confirmed', 'Next safe action', 'Blockers', 'Progress', 'Why this is next']
speckit-resume-confirm.yaml differ yaml=['Purpose', 'Confidence', 'Context source', 'Now', 'Last confirmed', 'Next safe action'] brief=['Spec', 'Purpose', 'Confidence', 'Source', 'Now', 'Last confirmed', 'Next safe action', 'Blockers', 'Progress', 'Why this is next']
```

What the second defect does and does not block. The `## Packet Purpose` section that phase 004 added is built in `runtime/hooks/claude/session-prime.ts` by `buildPacketPurposeSection` from `state.lastSpecFolder` in hook state. The Stop hook writes that field (`session-stop.ts` lines 536 to 553) through its own `detectSpecFolder`, whose regex at `session-stop.ts:49` is `/(?:\.opencode\/)?specs\/[^\s"'`]+/g` and already matches `specs/`. The PreCompact `detectSpecFolder` at `compact-inject.ts:330` feeds only two things, the `Active spec folder:` line at line 465 and the spec folder handed to the authored continuity snapshot at line 636. So the defect hides the folder line and leaves the purpose line alone. The authored snapshot is off unless `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT=1` or the payload asks for it (`compact-inject.ts:348-352`), and with the fix it gets a folder for `specs/` packets when it is on.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Replace the Problem Statement and Purpose of the five parents in the Measured Behavior list with text taken from each parent's title and its children's own docs.
- Widen the folder regex in `detectSpecFolder` in `compact-inject.ts` to the one `session-stop.ts:49` already uses, and add one test that proves the brief prints `Active spec folder:` for a `specs/` path.
- Replace `reply_format` in both resume workflow assets with the row labels of the presentation file's Resume Brief, in the same order.
- Assert in the scaffold gate test that a new phase parent set to `In Progress` with its purpose token unfilled fails validation on that token.

### Out of Scope
- The live phase parents whose Purpose is a bracket placeholder or that hold no purpose text, listed with their count and how they were found in `scratch/phase-parents-without-purpose-text.txt` - nothing is written there to carry, and a true purpose for a packet in another track needs someone who knows that work. The operator decides whether to order that backfill.
- The live phase parents that state a purpose under a heading other than `### Purpose` - phase 007 widens the reader for them, so their text needs no edit.
- The phase maps of `004-decisions-and-notes-system` and `003-install-scripts-doctor-realignment`, which still hold `[Phase N scope]` and `[Criteria TBD]` rows - a separate cleanup, and the Purpose rewrite does not depend on it.
- The unfilled Problem Statement and Purpose of the four children of `003-install-scripts-doctor-realignment` and of `004-decisions-and-notes-system/001-decisions-system-analysis` - child docs, not parent purposes.
- The archived `specs/mcp-tooling/z_archive/003-mcp-figma-transfer/spec.md`, which also holds the scaffold sentence - archived packets are not resumed.
- The `mcp_enrichment` value in the presentation file's `Source:` row - no step in either resume asset produces it (`context_source` at `speckit-resume-auto.yaml:176` lists `handover|continuity|spec_docs|ripgrep_context|ripgrep_anchor`), and the presentation file is the owner of that row.
- The stray backslash a JSON-escaped path can leave on a matched folder in `detectSpecFolder` - it exists for `.opencode/specs/` paths today and no report names it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/spec.md` | Modify | Real Problem Statement and Purpose |
| `specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/006-operator-tooling/003-install-scripts-doctor-realignment/spec.md` | Modify | Real Problem Statement and Purpose |
| `specs/system-speckit/runtime-and-release/001-system-speckit-v4/003-spec-doc-template-reduction/spec.md` | Modify | Real Problem Statement and Purpose |
| `specs/system-speckit/runtime-and-release/001-system-speckit-v4/004-decisions-and-notes-system/spec.md` | Modify | Real Problem Statement and Purpose |
| `specs/system-speckit/runtime-and-release/001-system-speckit-v4/030-spec-kit-simplification-research/spec.md` | Modify | Real Problem Statement and Purpose |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | Modify | Folder regex matches `specs/` |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts` | Modify | One test for a `specs/` folder and the brief line |
| `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` | Modify | `reply_format` lists the presentation rows |
| `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml` | Modify | `reply_format` lists the presentation rows |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts` | Modify | One assertion that a non-Draft parent with an unfilled purpose fails |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No live phase parent outside this packet carries the scaffold purpose sentence. This covers that one sentence only, and makes no claim that every live phase parent states a purpose | The first Measured Behavior command piped to `wc -l` prints `0` |
| REQ-002 | `detectSpecFolder` in `compact-inject.ts` returns the folder for a `specs/` path and the merged brief prints its `Active spec folder:` line | `../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/hook-precompact.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime`, prints `Tests  18 passed (18)` |
| REQ-003 | Both resume workflow assets list the presentation file's brief rows in order | `python3 <this folder>/scratch/check-brief-rows.py` with the presentation file and both assets prints `speckit-resume-auto.yaml match` and `speckit-resume-confirm.yaml match` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each of the five rewritten parents still validates | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <parent> --strict` prints `RESULT: PASSED` on its first RESULT line for each parent, with no more errors or warnings than the baseline in `plan.md` section 5 |
| REQ-005 | The purpose line from phase 004 and the existing command checks are unchanged | `hook-session-start.vitest.ts` prints 23 passed, `test-phase-command-workflows.js` prints `Result: passed=148 failed=0`, `sync-runtime-mirrors.cjs --check` prints `PASS: 256 mirrors across 10 trees are in sync.` and the YAML load prints `yaml ok` |
| REQ-006 | The runtime still typechecks and the built hook carries the fix | `npm run typecheck` and `npm run build` in `.skilled/skills/system-spec-kit/runtime` exit 0, and the second Measured Behavior command prints `specs/ -> "specs/system-speckit/x/y"` and `Active spec folder lines in brief: 1` |
| REQ-007 | A test proves that a new phase parent which leaves Draft with an unfilled purpose fails the gate | `npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts runtime/cli/tests/template-version-parity.vitest.ts runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts runtime/cli/tests/placeholder-token-gate.vitest.ts --config vitest.config.ts`, run from `.skilled/skills/system-spec-kit`, prints `Test Files  4 passed (4)` and `Tests  99 passed (99)`, and `rg -c -F 'PLACEHOLDER_FILLED' .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts` prints `1` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The scaffold sentence count over live parents drops from 5 to 0, and each of the five parents opens its Purpose with a sentence its children's docs support.
- **SC-002**: The built hook prints `Active spec folder: specs/system-speckit/x/y` for a transcript that names `specs/system-speckit/x/y/spec.md`, where it prints no such line today.
- **SC-003**: `check-brief-rows.py` prints `match` for both resume assets, where it prints `differ` for both today.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The runtime `dist` build. Claude runs `dist/hooks/claude/compact-inject.js` (`.claude/settings.json` line 332) and `dist/` is git-ignored | Without a build the live hook keeps the old regex | Run `npm run build` in the runtime folder after the edit and rerun the second Measured Behavior command |
| Risk | The wider regex also counts a `specs/` path that sits under some other folder, such as an absolute path into another checkout | Low. The folder line names the most-referenced folder only, and the Stop hook has used the same regex for its own detection | Mirror the Stop hook regex exactly and keep the existing `.opencode/specs/` test passing |
| Risk | A parent Purpose written from partial child docs states a reason the work never had | Medium. A resumed child would quote a wrong reason | Every replacement in `plan.md` names the child docs it comes from, and the builder rereads them before the edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should `reply_format` repeat the presentation file's Source values? Decision: no. `.skilled/commands/speckit/resume.md` section 5 says the resume brief template lives only in the presentation file, so the asset names the rows and leaves the values to that file. Repeating them is how the two drifted.
- Does the second defect stop the purpose line from appearing? Decision: no. The purpose line reads `lastSpecFolder`, which the Stop hook sets with a regex that already matches `specs/`. The defect hides only the PreCompact folder line and the folder handed to the opt-in authored snapshot.
- Can all five parents get a true purpose from their own docs? Decision: yes. Four have children with filled Problem Statements or a `goal.md`. `003-install-scripts-doctor-realignment` has unfilled child specs, and its child `001-deep-research-install-scripts-doctor/research/research.md` section 1 states the problem, so its text comes from there.
<!-- /ANCHOR:questions -->

---
