---
title: "Feature Specification: Phase 12: purpose-reader-precision"
description: "The purpose reader prints a problem sentence or a layout sentence as a packet's Purpose, two hops state a narrower rule than the reader, and the Pi hook skips the folder walk-up. This phase fixes the reader and every hop rule so a Purpose line appears only when the packet states one."
trigger_phrases:
  - "purpose reader precision"
  - "phase 12 purpose reader precision"
  - "problem printed as purpose"
  - "purpose rule parity across hops"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: purpose-reader-precision

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/376-dsh-single-executor-loop` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 13 |
| **Predecessor** | 011-empty-parent-purpose-backfill |
| **Successor** | 013-purpose-docs-and-backfill |
| **Handoff Criteria** | The probe in `scratch/probe-purpose-origin.mjs` prints `combinedOpening":0` and `layout sentence as own purpose: 0`, and the purpose, session-start, precompact, Pi and relaunch suites pass at the counts in `plan.md` section 5 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Carry a packet's purpose across handovers and compactions specification.

**Scope Boundary**: The purpose reader, the two compaction adapters, the compaction folder detector, the relaunch nudge, the handoff command, the two resume assets, their tests and one library README. It also closes two stale doc fields in phases 006 to 011. Packet `spec.md` files outside this phase, the feature catalog, the playbook and the root README belong to phase 013.

**Dependencies**:
- Phases 001 to 011 are built and merged. Every search text in `plan.md` section 4 was counted on 2026-11-14 at `1bedb33577`.
- Phase 013 lands after this phase. Its backfill writes real purposes in the eight parents this phase stops reading as layout text.

**Deliverables**:
- A reader that returns a problem as `problem`, never as the purpose, and skips both layout sentences
- One purpose rule, word for word the same shapes, in the nudge, `handoff.md` and both resume assets
- One shared folder-to-packet resolver used by the Claude and Pi compaction hooks
- Tests that run in the system temp folder and cover each changed behavior
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The next AI after a compaction or hop reads a problem statement or a layout note labelled `Purpose:` for 211 live packets, so it is told the wrong reason for the work. The reader takes the opening paragraph of a combined `## PROBLEM & PURPOSE` section as the purpose, and it does not know the layout sentence eight deep-loop parents carry. Two hops also state a narrower rule than the reader: the relaunch nudge names one heading shape and an unqualified parent folder, and the Pi compaction hook skips the walk-up from a subfolder that the Claude hook performs. An independent Fable review and a five-iteration deep review found these, plus smaller defects listed in section 3.

### Purpose
Print a `Purpose:` line only when a packet states its purpose, and state the same rule on every hop, so the purpose that survives a handover is the real one.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Run from the worktree root on 2026-11-14 at `1bedb33577`, before this phase and its two siblings were scaffolded, with the runtime `dist/` current. The first run uses the built helper. The second runs the same probe against a scratch copy of the built helper with edits E1 to E6 applied, so it projects the after value. The 211 in the Problem Statement is 203 combined-heading paragraphs plus the 8 layout sentences.
```text
$ rg --files specs -g spec.md -g '!**/z_archive/**' -g '!**/scratch/**' -g '!**/lineages/**' | node <012>/scratch/probe-purpose-origin.mjs
sources {"packet":2928,"ancestor":53,"goal":0,"none":0}
own origin {"subheading":2656,"labelled":33,"combinedOpening":203,"otherSectionOpening":36}
layout sentence as own purpose: 8
own purpose of three words or fewer: 7
own purpose read: 2928 of 2981

$ ... | node <012>/scratch/probe-purpose-origin.mjs <scratch copy with E1 to E6>
sources {"packet":2717,"ancestor":259,"goal":0,"none":5}
own origin {"subheading":2656,"labelled":33,"combinedOpening":0,"otherSectionOpening":28}
layout sentence as own purpose: 0
own purpose of three words or fewer: 0
own purpose read: 2717 of 2981

$ node -e "...detectSpecFolder(['Read specs/a/001-x/spec.md:12','Edit specs/a/001-x/spec.md:40','see specs/b/002-y/plan.md'])"
"specs/a/001-x/spec.md:12"
```
The five packets with no line after the fix are `sk-git/live-sync-and-publishing/006-remote-push-approval`, `sk-git/worktree-lifecycle/003-worktree-dependency-provisioning`, `sk-code/verification-guards/002-dist-staleness-rebuild-on-drift`, `sk-code/verification-guards/003-dist-guard-skip-unprovisioned` and `system-speckit/memory-search-and-knowledge/004-memory-reindex-embed-performance`. Each prints a problem sentence as its Purpose today.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope

Each item names its source: Fable for the independent Fable 5.2 review, deep review for the five-iteration `/deep:review` whose report is `../review/review-report.md`.

| Item | Severity | Source | Change |
|------|----------|--------|--------|
| A1 | P1 | Fable A-P1-1 | The opening paragraph of a combined `## PROBLEM & PURPOSE` section becomes the packet's `problem`, and the reader keeps looking for a purpose in the phase parent or `goal.md` |
| A2 | P1 | Fable A-P1-2 | The sentence `This phase groups the related child phases below...` counts as layout text in the reader, `purpose_row` of both resume assets, `handoff.md` and `nudge.cjs` |
| A3 | P1 | Fable A-P2-2, deep review R1-P1-001 | The nudge names `## PURPOSE`, `## ROOT PURPOSE`, `UNKNOWN` and the repo-relative parent label, and its test asserts each |
| A4 | P1 | Fable A-P2-1, deep review R1-P1-002 | One exported `enclosingPacketFolder` gives the Pi hook the Claude hook's walk-up, and a failed import of the helper is logged on stderr |
| A5 | P2 | deep review R3-P2-001 | The Pi hook types the helper with `typeof import` instead of a hand-copied interface |
| A6 | P2 | Fable A-P2-3 | The folder a cached brief names is used only when the hook injected that brief |
| A7 | P2 | Fable A-P2-4 | `detectSpecFolder` strips a `:12` or `:12:3` line suffix before it counts a folder |
| A8 | P2 | Fable A-P2-5 | The session-start tests make their packets in the existing temp checkout, and `runSessionStartHook` takes the project root |
| A9 | P2 | Fable, held-back items | A lead-in of three words or fewer joins the next sentence, and bold markers are dropped, so fragments such as `Measure it.` and `**10.` read whole |
| A10 | P2 | deep review R1-P2-001 | The 300-character cut never splits a surrogate pair |
| A11 | P2 | deep review R2-P2-001 | The reader strips C0 control characters at the source, so the Claude hook gets what the Pi hook strips |
| A12 | P2 | Fable, held-back items | `completion_pct: 0` becomes `100` in the six finished phase `goal.md` files, and the stale `next_safe_action` in six summaries says the phase is done |

### Out of Scope
- Writing a purpose into the eight layout-sentence parents - phase 013 does it with operator-approved sentences.
- The feature catalog, the playbook, the root README and `runtime/lib/README.md:118` - phase 013 owns the docs (deep review R2-P2-002 and R4-P2-001).
- A folder from another worktree resolving against this checkout (the second half of Fable A-P2-4) - dropped. The detector keeps the `specs/...` tail, and same-repo worktrees share packet paths, so the result names the same packet. No failing case was found.
- The Devin and OpenCode compaction hops - the parent's decision D6 defers them, and the deep review records them as search debt SL-006.
- Exporting the purpose type through `runtime/api/index.ts` - the Pi hook gets the real type from `typeof import` with no new export.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` | Modify | A1, A2, A4, A9, A10, A11 |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | Modify | A4 shared walk-up, A6, A8 project root |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts` | Modify | A4, A5 |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | Modify | A7 |
| `.skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts` | Modify | Five new tests, three changed expectations |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts` | Modify | A8 and one new test for A6 |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts` | Modify | One new test for A7 |
| `.skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts` | Modify | One new Pi walk-up test |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | A2, A3 |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modify | A3 assertions |
| `.skilled/commands/speckit/handoff.md` | Modify | A1, A2 rule text |
| `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` | Modify | A1, A2 in `purpose_row` |
| `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml` | Modify | A1, A2 in `purpose_row` |
| `.skilled/skills/system-spec-kit/runtime/lib/spec/README.md` | Modify | The `formatPacketProblem` row and a row for `enclosingPacketFolder` |
| `../006-purpose-carry-follow-ups/` to `../011-empty-parent-purpose-backfill/`, `goal.md` and `implementation-summary.md` in each | Modify | A12, twelve one-line edits |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The reader never returns the opening paragraph of a combined section or a layout sentence as a purpose (A1, A2) |
| REQ-002 | The nudge, `handoff.md` and both resume assets name the same heading shapes, the same two layout sentences, `UNKNOWN` and the repo-relative parent label (A2, A3) |
| REQ-003 | The Pi compaction hook resolves a subfolder to its packet the way the Claude hook does, through one shared function (A4) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A stale or quarantined brief does not choose the packet whose purpose is printed (A6) |
| REQ-005 | A path with a line suffix counts toward its folder (A7) |
| REQ-006 | The session-start tests leave nothing in the working tree (A8) |
| REQ-007 | A fragment lead-in, bold markers, a control character or an astral character at the cut never reach the printed line broken (A9, A10, A11) |
| REQ-008 | The Pi hook logs a failed helper import and types the helper from its source (A4, A5) |
| REQ-009 | Phases 006 to 011 record their real completion state (A12) |
| REQ-010 | The runtime typechecks, lints, builds and keeps its continuity tests and command mirrors unchanged |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The probe's `own purpose read` goes from the baseline T002 records to that baseline minus the combined-heading and layout counts it printed, with `combinedOpening` and the layout count at 0. At planning time that is 2928 to 2717 of 2981.
- **SC-002**: `packet-purpose.vitest.ts` goes from 9 tests to 14, `hook-session-start.vitest.ts` from 28 to 29, `hook-precompact.vitest.ts` from 18 to 19 and `history-locator-adapters.vitest.ts` from 19 to 20, all passing.
- **SC-003**: `rg -c -F 'process.cwd()' .skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts` goes from 11 to 1, the one left being the history test that restores its working folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The Pi hook loads the helper from `dist/` | The Pi test fails until `npm run build` regenerates it | T028 builds before the Pi test runs |
| Risk | Five packets print no line after A1 | Low. Each prints a problem sentence labelled Purpose today | Listed in section 2. The operator decides in section 10 whether phase 013 gives them a `### Purpose` |
| Risk | The packet's own problem now wins over the parent's for an inherited purpose, which amends phase 010's choice | Low. Only packets with a combined heading or a Problem Statement and no purpose are affected | A test pins the shape, and the operator decides in section 10 |
| Risk | Another worker edits these files before the build | Medium. A search text stops matching | T003 counts every search text and stops on any count other than the one in `plan.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->

### Performance
- **NFR-P01**: The probe over every live `spec.md` finishes in the same order of time before and after, because the reader reads one extra paragraph per packet at most.

### Security
- **NFR-S01**: No folder outside the project root is read. `enclosingPacketFolder` refuses a path that leaves the root before it opens any file, and a test proves it.
- **NFR-S02**: No C0 control character reaches a printed purpose or problem line.

### Reliability
- **NFR-R01**: Every read still fails soft. A missing or unreadable file yields no line, never a failed compaction.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a combined section with no paragraph gives a null problem and the reader goes on to the parent or `goal.md`.
- Maximum input: a sentence over 300 characters is cut at 297 UTF-16 units, minus one when the cut ends on a high surrogate, then `...`.
- Failure path: a missing `dist/` build makes the Pi hook print a `WARN [speckit-hook:session-compact-context]` line and recover without the purpose section.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 26 files, about 220 lines, two runtimes' hooks and three command docs |
| Risk | 8/25 | Fail-soft reader. One shared contract, the purpose rule, changes on four surfaces at once |
| Research | 4/20 | Both reviews and the probe already located every cause |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should the five packets listed in section 2 lose their line? Default taken: yes, because each line is a problem sentence labelled Purpose. Phase 013 can give them a `### Purpose` if the operator says so.
- Whose problem goes beside an inherited purpose? Default taken: the packet's own when it states one, else the parent's. This amends phase 010's choice of the parent's problem, so it needs the operator's yes.
- Should a purpose taken from `goal.md` carry the packet's own problem? Default taken: yes, because both come from the same folder. Phase 010 printed none there.
- Should the tests leave the working tree? Default taken: yes, as Fable asks. Phase 009 chose the working tree on purpose so a crashed run stays visible. Each test still removes its folder in `finally`, and a crashed run now leaves it in the system temp folder.
- Deep-review findings: folded in. The five-iteration review at `../review/review-report.md` finished with verdict CONDITIONAL. R1-P1-001, R1-P1-002, R1-P2-001, R2-P2-001 and R3-P2-001 are items A3, A4, A10, A11 and A5 here. R2-P2-002 and R4-P2-001 go to phase 013.
<!-- /ANCHOR:questions -->

---
