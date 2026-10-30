---
title: "Implementation Summary"
description: "The read-only check engine landed with its twelve rows, its nine fixtures and the suite that proves each state, each planted defect, the three exit codes and a zero-write run."
trigger_phrases:
  - "agents md check implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/002-check-engine"
    last_updated_at: "2026-10-30T12:35:33Z"
    last_updated_by: "code-agent"
    recent_action: "Landed the engine, the suite and the nine fixtures; every criterion met"
    next_safe_action: "Child 003 composes the embed plan from A4, A7, A8, A9 and A10"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/agents-md-check.cjs"
      - ".skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs"
      - ".skilled/commands/doctor/scripts/tests/fixtures/agents-md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-check-engine |
| **Completed** | 2026-10-30 |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One command that answers, without writing a byte, what a repository holds against the template it was shipped. It reports the install state, the sections it still carries, whether their order and numbering survive, the currency of each body, every pinned string, the delivery budget, the shape of the repository block, the repository's own content outside that block, the local lines hiding inside shipped sections, each runtime copy, the router, and the source repository's own purity.

### Phase 2: check engine

`agents-md-check.cjs` prints twelve rows, each `PASS`, `FINDING`, `UNKNOWN` or `INFO`, with `--json` carrying the same report. It segments the root document with the shared library child 001 landed, compares each body by sha256 against the manifest's derived copies and its release history, and runs three neighbour tools as children instead of re-deriving what they own: the rule-copy canary for the budget, the gate 1 pointer sync for the Cursor rule, and the repo-rules checker for the router. Exit codes are 0 for nothing to report, 1 for a finding or a row it could not prove, and 2 for a failed precondition.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/agents-md-check.cjs` | Created | The read-only engine: argument parsing, twelve row functions, two renderers, the exit-code mapping |
| `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` | Created | The suite: one case per install state, one per planted defect, the exit codes, the write-spy, the tree digests, the JSON parity, and the case that keeps a recipe folder free of a composed tree |
| `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/<nine recipes>/` | Created | Nine synthetic repositories, each a `fixture.json` recipe and nothing else: the tree it describes is composed into a temporary folder for the run and removed with it |
| `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs` | Created | The composer: a recipe and an empty folder in, the tree it describes out, and the same command composes a fixture by hand for anyone reading it |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Tests first: the suite was written and run before the engine existed, and it failed with `Cannot find module '../agents-md-check.cjs'` (`scratch/failing-first.log`). The six baseline commands were recorded before the first edit (`scratch/baseline.txt`), and implementation proceeded one row group at a time against the focused suite.

Two decisions shaped the fixtures. The first is that a fixture is a recipe, not a tree: `fixture.json` names the planted shape, `compose-fixture.cjs` derives the document from the manifest, and composing all nine reproduces the sixteen files the criteria describe byte for byte. A fixture therefore cannot describe a template the manifest no longer ships, and refreshing a released body refreshes every fixture in the same edit. The second is that every engine run happens on a throwaway composition, so the assertion in `git status` and the tree digests both prove nothing about a fixture is writable.

The first shape of this committed the composed tree beside each recipe, six of them carrying a full copy of the shipped document at 172 KB, 252 KB with the mirrors, and the copy turned out to be the problem rather than the guard. Its relative links resolve from the fixture folder instead of the root, so the markdown link integrity job read it; a runtime that loads nested instruction files could load it as a repository's own document; and every template edit would have forced a regeneration commit. So the trees were removed, the composer was kept and made callable, and the suite now proves the absence with a case that fails on any file beside a recipe other than `fixture.json`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One fixture per row rather than one large fixture | A fixture that fails several rows cannot tell which row broke |
| Fixtures are recipes composed from the manifest at run time, and no composed tree is committed | A hand-written fixture drifts from the data it is supposed to exercise, and a committed copy of the template is a second copy of the framework's own prose: its relative links resolve from the fixture folder, a runtime can load it, and each template edit needs a regeneration commit |
| An absent canary is `UNKNOWN`, never `PASS` | A green result with no evidence behind it is the failure mode this row exists to prevent |
| `UNKNOWN` fails the run | A row that could not be proven is not an all-clear, so the status line may not read `OK` while one exists |
| A local edit outranks a missed release in the install-state reading | An edited section is the case that loses text when somebody replaces the document; staleness only loses a patch |
| The canary's `AGENTS.md` findings are filtered by their own prefixes | Its other pins belong to the skill it ships in, so a consumer's missing skill files must not read as this document's verdict |
| The block is empty when nothing but the shipped heading and note sits between its markers | The template itself ships those two lines inside the markers, so counting them as content would classify the source repository as `adopted` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/commands/doctor/scripts/agents-md-check.cjs` | `A1 install state: pure   (PASS)`, `STATUS=OK rows=12 findings=0 unknown=0`, exit 0 |
| Runtime on this repository | 0.39-0.44 seconds over three runs of `time -p`, and 0.41 seconds for the `--json` form, against a five-second target (0.27-0.30 before the review repair) |
| `node --test .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` | `tests 39`, `pass 39`, `fail 0`, exit 0 (`tests 37` before the second review repair) |
| `node --test .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` | `tests 28`, `pass 28`, `fail 0`, exit 0 |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | `node:test (37 files)` PASS, `unittest (1 files)` PASS, three shell suites PASS, `route-validate.sh --self-test` PASS, freshness panel PASS, `7 suite(s) passed, 0 failed`, exit 0 |
| Read-only promise | `git status --porcelain \| shasum` gave `e257400fe1ee97622e3d5e1fe2274bf7e0edb1f8` before and after composing each of the nine recipes, running the engine twice on each and once on this repository; the suite additionally hashes each composed tree by sha256 before and after, and a write-spy over every row records no call |
| Every fixture's state | `pure`, `adopted`, `stale`, `forked`, `foreign`, `claude-only`, `absent` classify as named; `shadowed-pin` and `over-budget` classify as `forked` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md/002-check-engine --strict` | `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:review-repair -->
## Review Repair

A review of the engine found ten defects, four of them the kind that read as a pass. All ten were repaired, each held by a case that failed first:

| Finding | What was wrong | What changed |
|---------|----------------|--------------|
| The tail of the document did not exist | The segmenter read only up to the block's start marker, so everything below it was invisible to A1, A4, A8 and A9 | The segmenter reads the whole document: the block's lines are a hole, a heading inside the hole belongs to the repository, a section the hole interrupts keeps the text on both sides, and every section below it keeps its own body word for word |
| Text above the first heading read as a pure template | The segmenter now returns that text as `prelude`, and A8 reports it with its byte range |
| A block written between shipped sections read as `foreign` | A7 reports a block that sits before sections that follow it, by byte and by the first section that follows |
| A10 swallowed an unmeasured copy | A copy whose own tool is missing makes the row `UNKNOWN`, prints its own line and counts in `unknown=` |
| An unknown pin kind counted as a hold | A `pinVerdict` with no rule is `UNKNOWN`, and A5 says `unmeasured` in its detail |
| A4 passed with nothing to classify | A report with no matched section is `INFO` |
| AC-012's command showed one of the two sites it claimed | The row now records what the command prints: the tag constant the summary is picked out by |
| AC-008's write-spy could not see the writes the engine makes | The row names AC-010's tree digests as the proof that covers the child processes, and keeps the spy for the in-process half |
| `main` hardcoded the root filename | The readability precondition reads `manifest.root_file`, the same declaration every other read uses |
| A9 collapsed repeated local lines | A line is counted once per occurrence, because a replacement loses both |

The repair is eight new cases in this suite and three in the embed suite. Tests came first: the eight cases failed on `fail 8` against the old engine, and every one passes now.

A second review of the embed engine it feeds reported two rows that could not be acted on. Both are repaired, each held by a case that failed first:

| Finding | What was wrong | What changed |
|---------|----------------|--------------|
| A7 counted marker bytes anywhere | The row counted substring occurrences, so a document whose prose quotes the start and end markers read as carrying two blocks, and a `pure` tree with no block at all reported one 7 bytes long | The row reads the segmenter's marker lines, so a sentence is prose; a document with more than one block has the line of each marker printed under the finding |
| A9 reported a finding with no line | A body that carried every shipped line and differed by one leading space produced `0 local line(s)` and an empty line list, so the operator had a finding and nothing to look at | The row prints the line where the two bodies part company with the shipped and the document line, and `INFO` is kept for a difference it cannot name |
<!-- /ANCHOR:review-repair -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The three child tools are this installation's copies.** The canary, the pointer sync and the router checker are resolved from the tree the engine ships in and pointed at the target with `--root`, which is what lets a consumer's own `AGENTS.md` be measured. The consequence is that a repository carrying a newer copy of a tool is measured by the older one it installed alongside the engine.
2. **The canary gap is proven through the harness rather than by moving a file.** T014 asks for the canary to be moved aside; the suite instead hands `buildReport` an absent tool path, because moving a tracked file was outside this packet's scope. The row logic, the `UNKNOWN` state and the exit code are the same either way.
3. **`claude-only` and `absent` fixtures fail several rows.** Their `A5`, `A10` and `A11` rows report the pins and copies a repository with no root document cannot carry. That is honest output, not a planted defect, and it is why only the `pure` fixture could ever exit 0 — and in fact no temp-root fixture does, since A11's router needs the shipped rule corpus to pass.
4. **A7 measures the block's own byte span, not the block's contribution to the delivery budget.** The headroom it reports is the whole document's headroom against the ceiling, which is what a truncating runtime acts on.
<!-- /ANCHOR:limitations -->

---
