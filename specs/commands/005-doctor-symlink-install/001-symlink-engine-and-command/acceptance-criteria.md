---
title: "Acceptance Criteria: Phase 1: symlink-engine-and-command"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "symlink engine and command acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/001-symlink-engine-and-command"
    last_updated_at: "2026-10-31T14:24:00Z"
    last_updated_by: "doctor-symlink-install-reconcile"
    recent_action: "All 11 criteria read Met after the acceptance probes; the closure statement says closeable"
    next_safe_action: "Operator commits, then pins the evidence to that commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-build"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: symlink-engine-and-command

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** commands/005-doctor-symlink-install/001-symlink-engine-and-command
**Level:** 2
**Status:** Complete
**Date:** 2026-10-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a target repo, When `check --root` runs, Then it prints one status line per selected entry with the repo fields beside them, changes no path, and `--json` prints exactly one object | `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:78`: text mode printed one status line per entry, `--json` printed one object carrying `detected_runtimes`, `tracked_absolute_links` and `git` beside `entries`, and the root listing was unchanged afterwards. | Met | - |
| AC-002 | REQ-002 | Given the same target, When `plan` runs twice, Then both runs print the same action list and the same `PLAN DIGEST` line, and the target is unchanged | `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:85`: two `plan` runs with the same flags exited 0, printed byte-identical output and the same `PLAN DIGEST`, and left the root listing unchanged. | Met | - |
| AC-003 | REQ-003 | Given a plan, When `apply` runs with a digest that no longer matches, Then it prints `DIGEST MISMATCH`, exits 3 and writes nothing | `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:14` records the suite case `wrong digest exits 3`, inside a run of 9 tests, 9 pass, 0 fail recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:8`. | Met | - |
| AC-004 | REQ-004 | Given one recorded run, When `unlink` runs, Then the round-trip puts the tree back, a changed path is skipped, and a run with neither `--dry-run` nor `--yes` prints the plan and exits 2 | `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:103` and `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:104`: unlink with neither flag exited 2 with `pass --yes to perform this unlink`; a path replaced after apply was skipped as `changed since apply: CLAUDE.md` and kept; the round trip after the created-folder fix restored the listing and exclude file exactly (`specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:105`). | Met | - |
| AC-005 | REQ-005 | Given both link shapes, When `auto`, `whole` and `merge` each plan the same tree, Then `whole` refuses a real folder, `merge` reports each local conflict and keeps it, and only a broken link whose text points into the source is ever removed | `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:8` records 9 tests, 9 pass, 0 fail and names `whole refuses a real folder`, `local conflict byte-identical`, `merge keeps the local statusline` and `broken source link replaced, outside link left`. | Met | - |
| AC-006 | REQ-006 | Given a bad invocation or a refused root, When the engine runs, Then it exits 2 with one `ERROR:` line and writes nothing | `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:94`: eight bad invocations (unknown flag, missing root, bad mode, bad runtime, root inside source, second positional, apply without digest, `--root` without value) each exited 2 with exactly one `ERROR:` line. | Met | - |
| AC-007 | REQ-007 | Given a git work tree, When a plan creates links, Then the ignore lines land in `.git/info/exclude` unless `--ignore` says otherwise, a tracked absolute link is warned on, and a root that is not a work tree reports `ignored: null` | `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:79`, `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:80` and `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:91`: a tracked absolute link was warned on, a non-git root reported `ignored: null` for every entry, the default plan writes `.git/info/exclude` (suite case `git exclude add and remove`), `--ignore gitignore` targets `.gitignore` and `--ignore none` writes no ignore lines. | Met | - |
| AC-008 | REQ-008 | Given no `--runtimes` list, When `check` runs, Then it detects the runtimes whose primary entry exists, always includes `.skilled`, and reports an empty detection rather than guessing | `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:81`: with no `--runtimes`, an empty root detected `[]` and listed only `.skilled`, a root with a real `.claude` detected `["claude"]`, and `--runtimes core` was refused with exit 2. | Met | - |
| AC-009 | REQ-009 | Given the router, When it binds a target, Then `check` runs with no argument because it only reads, `link` and `unlink` each load their own workflow and presentation, and the existing routes still validate | `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:111`: `symlink.md:6` carries the `skill_agent` tag, lines 49-51 bind each target to its own workflow, line 68 loads the presentation, and `route-validate` passes with G3 holding `check` as the only read-only default; the 28-route count is explained at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:112`. | Met | - |
| AC-010 | REQ-010 | Given the extras and the instruction choice, When `link` runs, Then `--link-instructions` links the three instruction files, `.mcp.json` is written as its relative text, `.github` is merged and never linked whole, and `--include env` prints its secrets warning | `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:86`: `--link-instructions` planned links for `AGENTS.md`, `CLAUDE.md` and `REPO RULES.md`, `.mcp.json` was planned as the relative text `.claude/mcp.json`, `.github` was planned as `mkdir` plus per-child links and never whole, and `--include env` printed its secrets warning. | Met | - |
| AC-011 | REQ-011 | Given temp source and target trees, When the suite runs, Then every case the plan names passes with no write outside `os.tmpdir()` | `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:8` records `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs`: 9 tests, 9 pass, 0 fail, across the nine named cases; the suite now holds 10 tests, 10 pass, 0 fail, after the merge-only regression case (`specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:110`). | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All eleven rows are Met. AC-003, AC-005 and AC-011 rest on the engine suite (10 tests, 10 pass). The other eight rest on the acceptance probes recorded in the evidence addendum, which the orchestrator ran on throwaway scratch repos and which also found and fixed two engine defects: an absent merge-only folder and a created folder left behind by unlink.
<!-- /ANCHOR:closure -->
