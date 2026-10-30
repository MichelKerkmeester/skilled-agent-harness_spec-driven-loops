---
title: "Implementation Summary"
description: "The embed engine as built: what composes, what it refuses, what it backs up, what it proves after the write, and the figures it was measured against."
trigger_phrases:
  - "agents md embed implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/003-embed-engine"
    last_updated_at: "2026-10-30T13:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the delivered engine and the evidence for every acceptance criterion"
    next_safe_action: "Child 004 invokes plan, apply and restore from the command plumbing"
    blockers: []
    key_files: []
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
| **Spec Folder** | 003-embed-engine |
| **Completed** | 2026-10-30 |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A repository can now take the shipped template and keep every line it wrote. The engine
composes one new document per target in memory, prints it, hashes it, and writes only what
the digest names. When it finishes, it proves against the bytes on disk that no
repository-unique line was lost, and puts the backup back when one was.

### Phase 3: embed engine

- **`plan`** reads the check engine's report, composes `AGENTS.md` from the shipped bodies
  plus one repository block, and prints each target with its action, a unified diff, the
  full new block, the byte budget before and after, the survival ledger, the backup
  location, the undo command and a sha256 plan digest. It writes nothing: the backup path
  it prints is not even created.
- **`apply --plan-digest <d>`** recomposes and refuses a digest that differs, runs the
  preservation proof before backing anything up, backs up every path it will touch, checks
  each path against the write allowlist, writes, regenerates the Gate 1 pointer block with
  its own generator, and re-proves on the written bytes. A lost line restores the backup
  and ends `STATUS=FAIL` with the dropped lines printed.
- **`restore --run=<dir>`** replays a run's record: it puts each recorded file back byte
  for byte, recreates a removed one, deletes one the run created, verifies every hash, and
  never touches a path the run did not record. A hand-edited record cannot widen it,
  because the same allowlist is applied to it.
- **`preservationCheck(old, new, manifest, {removed})`** is a pure export implementing the
  four parts of the invariant, so the proof can be read and driven without a run.

The block carries, in order: what the block already held, the sections that match no
shipped section (verbatim, in document order), the local lines of each edited or
unknown-base section under `### Carried from <id>`, and the unique lines of a folded
`CLAUDE.md` or `.codex/AGENTS.md` under `### Carried from <path>`. A released body is
replaced with no carry, because every line of it is already shipped.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/agents-md-embed.cjs` | Created | `plan`, `apply`, `restore`, the composer, the write allowlist, the backups and the preservation proof |
| `.skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` | Created | 23 cases over temporary copies: composition, carry order, the four invariant parts, the digest gate, the allowlist, the backups, the fallback, the copies, the router and the mirror |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Tests came first and failed on `Cannot find module` (`scratch/failing-first.log`), then the
engine grew one concern at a time until the suite was green. The six baseline commands were
captured at `d66b108cc1` into `scratch/baseline.txt`, and the end-to-end runs are recorded
in `scratch/evidence.txt`.

The measured runtime sits well inside the five-second budget. A `plan` over a 43,769-byte
repository document takes 0.13 to 0.15 seconds across three runs, and the matching `apply`
takes 0.30 seconds; a 70,289-byte input plans in 0.17 seconds. Most of that is the check
engine's own report, which the composer reuses rather than re-derives.

Two design decisions are worth naming because they are visible in the output. A repository
whose template is already current and whose block is empty gains nothing from the two
marker lines, so the plan leaves it alone and says so; that is why a plan on this repository
reads `NOTHING TO DO`. And the backup is written with plain `fs`, never through the
caller-supplied write hook, because a rollback must not share a path with the writer it
exists to undo.

The `--create-router` flag comes from the approved design and is not named in this child's
requirements, which say only that the router gains the missing shipped rows. It was
implemented as the design states: an absent router is reported and left alone unless the
flag is given, and a router that exists gains only the rows it is missing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The preservation check is a pure function with an exported name | A proof that needs a whole run to exercise is a proof nobody repeats |
| The plan runs the same proof before anything is backed up | A composition that already loses a line should never produce a backup, let alone a write |
| Adopt-and-carry is the default even when a three-way merge is clean | A merged section stays edited forever, so the next run has the same problem; the merge is reported as an available reading and never taken |
| The backup never goes inside a path the ignore check does not match | A backup in a tracked path becomes part of the diff it is supposed to undo |
| Apply refuses a digest mismatch, and answers `NOTHING TO DO` before comparing one | What is written must equal what the operator approved, and a tree already in its target state has nothing a digest could authorise |
| An incomplete block is refused rather than repaired | A block that cannot be placed cannot be carried out of, and guessing would drop the marker lines it contains |
| The engine backs up the Gate 1 pointer rule too | The run regenerates that file through its own tool, so the undo has to include it |
| A symlinked root document is refused, and containment is measured on the real path | Writing through a link would change a file the repository does not own, and a backup cannot put a link back |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` | `pass 23`, `fail 0`, exit 0 |
| `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` | `NOTHING TO DO`, exit 0, on this repository |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | `38` suites, `805` node cases, `0 failed`, exit 0 |
| `node .skilled/commands/doctor/scripts/agents-md-check.cjs` | `A1 install state: pure`, `STATUS=OK rows=12 findings=0 unknown=0`, exit 0 |
| `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` | `RESULT: PASSED (11/11 checks)`, exit 0 |
| `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | `OK: all rule invariants present`, `#### Blast-Radius Management` ends at byte `16368` |
| Foreign fixture, plan then apply | `preservation: kept 5, carried 0, shipped-replaced 44, dropped 0`, `STATUS=OK` |
| Foreign fixture, `restore --run=<dir>` then `cmp` | exit 0, byte-identical to the pristine copy |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <child> --strict` | `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED` |
| `git diff --quiet AGENTS.md` | exit 0: the template is untouched by this child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A fork copied from a non-release commit classifies as `unknown-base`.** Its old template lines are carried into the block, which is noisy but never lossy, because only known shipped lines are dropped.
2. **A budget overflow is a finding, not a refusal.** A carried document can push the result past the 32,768-byte ceiling a truncating runtime stops at; the plan says so and still keeps every line, because moving a line into a rule file changes when it binds.
3. **The plan's backup path is advisory to the second.** Apply takes its own stamp when it runs, so a run started a second later prints a different directory than the plan did. The path apply names is the one that exists.
4. **A router without a trigger table or an index table is reported, not repaired.** Adding a second table of either kind would number a section the checker reads by number.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:handoff -->
## Handoff

Child 004 owns the command plumbing: the router, the three workflow YAMLs, the route
manifest entry, the presentation and the contract test. The engine's surface is `plan`,
`apply --plan-digest <d>` and `restore --run=<dir>`, with `--root`, `--keep-claude-md`,
`--create-router`, `--dry-run` and `--yes` as options, and exit codes 0, 1 and 2 as
documented in its usage text.
<!-- /ANCHOR:handoff -->
