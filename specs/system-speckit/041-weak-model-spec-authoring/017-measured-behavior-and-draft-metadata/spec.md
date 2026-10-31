---
title: "Feature Specification: Phase 17: measured-behavior-and-draft-metadata"
description: "Weak-model authors state wrong current behavior even after running the command, and spend about one validator round per run on metadata the repository can recompute. This phase adds a Measured behavior block to the spec template with a warning-only rule for new-version docs, and makes validate repair derived metadata on its own while a packet is a Draft."
trigger_phrases:
  - "measured behavior and draft metadata"
  - "phase 17 measured behavior and draft metadata"
  - "measured behavior block"
  - "draft metadata auto repair"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 17: measured-behavior-and-draft-metadata

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/recommend-level-quiet`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-26 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 18 |
| **Predecessor** | 016-scaffold-filler-section-trim |
| **Successor** | 018-benchmark-redesign-and-remeasure |
| **Handoff Criteria** | Both new tests pass, the strict census diff prints nothing, and the Hermes check prints PASS |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of packet 054, the fourth of the phases that act on the post-054 insight review (`../015-template-example-neutralization/scratch/insight-review.md`). The operator approved two changes on 2026-10-26: a Measured behavior block in the spec template, and automatic repair of derived metadata while a packet is a Draft.

**Scope Boundary**: the spec template, one new validator rule, the validate CLI path, their tests, and the docs that describe validator behavior. Phases 015 and 016 own the fill-note text and the scaffold sections; this phase edits neither.

**Dependencies**:
- Phases 015 and 016 edit the same templates. This phase starts from their committed templates and takes the next template version after theirs.

**Deliverables**:
- `scratch/metadata-rounds.md`: the measured count that sizes change 2 (done during planning)
- The Measured behavior block, the `MEASURED_BEHAVIOR` warning rule and its test
- Draft-only derived-metadata auto-repair in the validate CLI path, its switch and its test
- Doc updates, a rebuilt runtime, an unchanged strict census and a passing Hermes check

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The recommend-level script prints a 17-line report, so a caller that needs only the level cannot parse the answer. WEAK: The script has issues with output. -->

### Problem Statement
Graders found a wrong report shape ("five-row", "nine-line", "eight-line") in 5 of 12 benchmark packets (`../015-template-example-neutralization/scratch/evidence-summary.md:28-29`), and four of those authors had run the script (`insight-review.md:31`), so running a command does not stop an author from misstating its output; nothing asks the author to quote it. Separately, in the 24 benchmark author runs 33 of the 36 failed validator rounds failed only on `GENERATED_METADATA_*` rules and none failed on content (`scratch/metadata-rounds.md`), so a model spends about 1.4 rounds per run on metadata that `repair-derived.cjs` can recompute.

### Purpose
Every number a new spec states about current behavior comes from a pasted command and its verbatim output, and a Draft packet's validate run settles derived metadata without a model turn.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--quiet` flag that prints only the recommended-level line. WEAK: Update the script and docs. -->

### In Scope
- Add a `measured-behavior` block (anchor `measured-behavior`, heading `### Measured Behavior`, no H2) directly after the `problem` anchor in `templates/core/spec.md.tmpl`, so every level renders it, and bump that template's stamp to the next version.
- Add the `MEASURED_BEHAVIOR` rule: a warning, and only for a `spec.md` stamped at that new version or later, when the block is missing or empty.
- Make the validate CLI apply `repair-derived.cjs --apply` once, print what it rewrote and revalidate, when the packet is a Draft and every error is a derived-metadata rule; `SPECKIT_DRAFT_AUTO_REPAIR=0` or a set `CI` turns it off.
- Add one test file per change, rebuild the runtime, and update the docs that describe validator behavior.

### Out of Scope
- A check that each number in the spec quotes the block - matching prose numbers to output is not reliable enough for a rule; the fill note and the card carry it.
- Fill-note wording and scaffold sections - phases 015 and 016 own them.
- Repairing any rule outside the derived-metadata set, or any non-Draft packet - those failures are authored work or committed records.
- Library callers of `validateFolder` such as the census tools - they stay read-only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` | Modify | Add the block and fill note; bump the stamp on lines 36, 39 and 43 |
| `.skilled/skills/system-spec-kit/templates/examples/level-*/spec.md` | Modify | Show a filled block, so the example drift guard still passes |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-measured-behavior.sh` | Create | The warning rule |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Modify | Register `MEASURED_BEHAVIOR`, severity `warn` (41 rules become 42) |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | Draft auto-repair in the CLI entry, next to `writeRepairHint` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modify | List the new rule and the switch in `--help` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/measured-behavior-rule.vitest.ts` | Create | Rule test |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/draft-auto-repair.vitest.ts` | Create | Auto-repair test |
| Card section 9, `SKILL.md`, `references/validation/validation-rules.md`, `runtime/ENV-REFERENCE.md`, the READMEs that state the rule count | Modify | Describe the new rule, the auto-repair and its switch |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With `--quiet`, stdout holds exactly one line that starts with `Recommended Level:`. WEAK: The flag should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A spec scaffolded by `create.sh` at any level holds one `measured-behavior` anchor right after the `problem` anchor, with a fill note that asks for the command and its verbatim output, and says every number about current behavior quotes the block |
| REQ-002 | `MEASURED_BEHAVIOR` reports `warn` when a `spec.md` stamped at the new version or later has no block, or a block with neither a non-empty fenced output nor an `N/A:` line with a reason; it reports pass otherwise and never reports `error` |
| REQ-003 | A `spec.md` stamped below the new version gets no `MEASURED_BEHAVIOR` warning, and the strict census over the 010 shard lists matches its baseline row for row |
| REQ-004 | When validate runs from the CLI on a packet whose `spec.md` Status is Draft and every error is a derived-metadata rule, it runs `repair-derived.cjs --folder <packet> --apply` once, prints each file it rewrote, revalidates and reports the second result |
| REQ-005 | The auto-repair does not run when `SPECKIT_DRAFT_AUTO_REPAIR` is `0`, `false` or `off`, when `CI` is set, when the status is not Draft, when any error is outside the derived-metadata set, or when `validateFolder` is called as a library; in each case no file in the packet changes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `measured-behavior-rule.vitest.ts` and `draft-auto-repair.vitest.ts` cover every case in REQ-002, REQ-004 and REQ-005 and pass, and the full runtime suite has no new failure against its baseline |
| REQ-007 | `npm --prefix .skilled/skills/system-spec-kit/runtime run build` exits 0, run alone and never at the same time as a test run |
| REQ-008 | Card section 9, `SKILL.md`, `validation-rules.md`, `ENV-REFERENCE.md` and every "41-rule registry" line describe the new rule, the auto-repair and its switch; `check-card-sync.sh` prints `CARD SYNC OK` and `sync-skills-hermes.cjs --check` prints `PASS` |
| REQ-009 | In `--json` and `--quiet` modes the auto-repair notice goes to stderr, so stdout still holds one parseable report or one `RESULT:` line |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: `recommend-level.sh --quiet --loc 500 --files 15` prints one line and exits 0. WEAK: The feature is successful. -->

- **SC-001**: A fresh Level 1 scaffold validated with `--strict` prints `! MEASURED_BEHAVIOR` before the block is filled and `+ MEASURED_BEHAVIOR` after.
- **SC-002**: A Draft test packet with only a stale `graph-metadata.json` prints the rewritten file and `RESULT: PASSED` from one `validate.sh` run, exit 0.
- **SC-003**: `diff` of the sorted strict and rule census before and after prints nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A caller parses the level line and breaks when the label changes. Mitigation: keep the label stable and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 015 and 016 change `spec.md.tmpl` too | Two edits to one template conflict, or two phases both claim one stamp version | Start after both are committed; take the next stamp after theirs and record it in `goal.md` section 4 |
| Risk | The validator now writes files: `repair-derived.cjs` rewrites `description.json`, `graph-metadata.json`, frontmatter packet pointers and the Spec Folder row (`repair-derived.cjs:16`, `:500-549`). A hook, workflow gate or reviewer that runs validate on a Draft packet expecting a read-only check gets a changed tree | High | Draft-only, derived-only, once per run, CLI-only, off under `CI` and by switch; it prints every write; the repair is idempotent (`repair-derived.cjs:18`); the test hashes the packet before and after each refused case |
| Risk | Recursion: `repair-derived.cjs` runs `validate.sh --json` itself (`repair-derived.cjs:171`) | High | The CLI spawns it with `SPECKIT_DRAFT_AUTO_REPAIR=0`, so the inner validate never repairs; the test fails if the repair runs more than once |
| Risk | Adding an H2 section would make it required for every v2.3 doc (`orchestrator.ts:662-697`) and fail existing packets | High | The block has an H3 heading only, in its own anchor outside `problem`, so the required and optional sets stay as they are; nesting it inside `problem` is ruled out by `anchorNestingFindings` (`orchestrator.ts:880`) |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The flag adds no measurable time: the same 40 ms run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

- **NFR-R01**: A validate run that does not qualify for auto-repair writes no file; the test checks it by hashing the packet.
- **NFR-R02**: A qualifying run repairs at most once; a second validate run on the repaired packet writes nothing.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: the script exits 2 with usage. Maximum: 10,000 files scores in under one second. WEAK: Handle edge cases. -->
<!-- /ANCHOR:edge-cases -->

- Empty block: a fence with no output line, or the fill note alone, warns.
- No runnable current behavior, such as a docs-only change: `N/A:` plus a reason passes.
- Repair fails or exits 2: the original report and the existing repair hint print unchanged, and the exit code is the original one.
- Recursive validate of a phase parent: each child is judged on its own status and errors.

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 4/25: one file and 12 lines. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One template, one rule, one CLI path, two tests, about eight docs |
| Risk | 14/25 | The validator gains a write path |
| Research | 4/20 | Measured during planning |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does `--quiet` suppress warnings? No, stderr is unchanged. WEAK: Edge cases are unclear. -->

- None. The stamp version is set when work starts, by D3 in `goal.md`.
<!-- /ANCHOR:questions -->

---

