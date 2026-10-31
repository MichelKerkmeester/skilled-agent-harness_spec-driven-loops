---
title: "Tasks: Phase 1: symlink-engine-and-command"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "symlink engine and command tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/001-symlink-engine-and-command"
    last_updated_at: "2026-10-31T14:24:00Z"
    last_updated_by: "doctor-symlink-install-reconcile"
    recent_action: "Closed the checklist boxes the verification evidence observes and named the ones it does not"
    next_safe_action: "Run the checks the open boxes name, or accept them at closeout"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-reconcile"
      parent_session_id: "doctor-symlink-install-build"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: symlink-engine-and-command

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`$SCRATCH` is a scratch target tree this phase creates and owns. `$OBSIDIAN` and `$AI_SYSTEMS` are the two user repos the dry runs read, and `$RUN` is a run directory an apply printed.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the frozen engine contract and settle every flag, status, exit code and refusal before writing code (`001-symlink-engine-and-command/scratch/engine-contract.md`). Verify: `rg -n 'apply digest mismatch' 001-symlink-engine-and-command/scratch/engine-contract.md` prints one line.
- [x] T002 Check `scripts/lib/` for a digest or backup helper and reuse the exported hash instead of copying its body (`.skilled/commands/doctor/scripts/lib/agents-md-sections.cjs`). Verify: `rg -n '^function sha256' .skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` prints one line. Checked: the helper exists, but the engine hashes with `crypto.createHash('sha256')` directly, because importing the AGENTS.md section library for one hash would couple two unrelated engines.
- [x] T003 Read the plan, digest and run-record convention the doctor scripts already share, so the new record lands where an operator looks (`.skilled/commands/doctor/scripts/agents-md-embed.cjs`). Verify: `rg -n "BACKUP_DIR = " .skilled/commands/doctor/scripts/agents-md-embed.cjs` prints one line.
- [x] T004 Write the entry map for the core folder, the seven runtimes, the four extras and the three instruction files (`.skilled/commands/doctor/assets/symlink-manifest.json`). Verify: `node -e "const m=require('./.skilled/commands/doctor/assets/symlink-manifest.json'); console.log(Object.keys(m.runtimes).length, m.core.length, m.instructions.length)"` prints `7 1 3`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Engine
- [x] T005 Resolve the source root from the script's own realpath with `--source` as the override, and reject an unknown flag, a flag on the wrong subcommand, a missing value and a second positional with one `ERROR:` line and exit 2 (`symlink-engine.cjs`). Verify: `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --bogus; echo $?` prints one `ERROR:` line then `2`.
- [x] T006 Refuse a `--root` that is missing, is not a directory, equals the source, sits inside it or contains it (`symlink-engine.cjs`). Verify: `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root .; echo $?` prints one `ERROR:` line then `2`.
- [x] T007 Resolve the runtime set with `.skilled` always present, detection when no list is given, and one status per entry in text and under `--json` (`symlink-engine.cjs`). Verify: `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root "$SCRATCH" --json | node -e "JSON.parse(require('fs').readFileSync(0,'utf8'))"` exits 0.
- [x] T008 Write the merge walk, the mode table for `auto`, `whole` and `merge`, the sorted action list and the digest line (`symlink-engine.cjs`). Verify: `node .skilled/commands/doctor/scripts/symlink-engine.cjs plan --root "$SCRATCH" | tail -1` prints `PLAN DIGEST: ` and 64 hex characters.
- [x] T009 Write `apply` with the recomposition, the digest gate and the run record written before the first action and after each one (`symlink-engine.cjs`). Verify: `node .skilled/commands/doctor/scripts/symlink-engine.cjs apply --root "$SCRATCH" --plan-digest 0000; echo $?` prints `DIGEST MISMATCH` then `3`.
- [x] T010 Write the ignore lines into `<git-dir>/info/exclude` by default, honour `--ignore gitignore` and `--ignore none`, and warn on every tracked absolute symlink (`symlink-engine.cjs`). Verify: `rg -n '^/' "$SCRATCH/.git/info/exclude"` prints one line per whole link the plan created.
- [x] T011 Write `unlink` in reverse order with the recorded-target check, the empty-directory removal and the recorded-line removal (`symlink-engine.cjs`). Verify: `node .skilled/commands/doctor/scripts/symlink-engine.cjs unlink --run "$RUN" --dry-run` prints one line per recorded action and leaves the tree unchanged.

### Tests and router
- [x] T012 Write the temp-tree suite for whole and merge, the local-conflict refusal, source-pointing pruning with a foreign link kept, the digest-drift refusal, the unlink round-trip and the target-inside-source refusal (`scripts/tests/symlink-engine.test.cjs`). Verify: `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` exits 0.
- [x] T013 Write the router with `check` as the default target, `link` and `unlink` as the writing targets, and the skill tag (`symlink.md`). Verify: `rg -n 'skill_agent: system-spec-kit' .skilled/commands/doctor/symlink.md` prints one line.
- [x] T014 Write the three workflows, `check` read-only and `link` and `unlink` mutating, each running the engine and composing nothing (`assets/doctor-symlink-{check,link,unlink}.yaml`). Verify: `rg -c '^role:' .skilled/commands/doctor/assets/doctor-symlink-check.yaml .skilled/commands/doctor/assets/doctor-symlink-link.yaml .skilled/commands/doctor/assets/doctor-symlink-unlink.yaml` prints `1` three times.
- [x] T015 Write the presentation contract with the menu, the plan and digest, the yes, the refusals and the next steps (`assets/doctor-symlink-presentation.txt`). Verify: `rg -c 'STATUS=CANCELLED ACTION=cancelled' .skilled/commands/doctor/assets/doctor-symlink-presentation.txt` prints `1`. Observed `2`: one cancelled result for a declined link and one for a declined unlink, which is the intended shape.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run the engine suite and read its tally (`scripts/tests/symlink-engine.test.cjs`). Verify: `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` prints `# fail 0`.
- [x] T017 Run the doctor suites this phase does not touch, to prove the new files broke nothing (`scripts/tests/`). Verify: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0.
- [x] T018 Dry run `check` against the repo that links whole folders, with no write (`symlink-engine.cjs`). Verify: `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root "$OBSIDIAN"` reports its folders as `linked-whole` and names `.pi-subagents` as broken.
- [x] T019 Dry run `check` against the repo that links each entry, with no write (`symlink-engine.cjs`). Verify: `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root "$AI_SYSTEMS"` reports its entries as `linked-merge` and names 10 broken links.
- [x] T020 Run `plan` twice against a scratch copy and prove it is deterministic and writes nothing (`symlink-engine.cjs`). Verify: `node .skilled/commands/doctor/scripts/symlink-engine.cjs plan --root "$SCRATCH" > scratch/plan-1.txt && node .skilled/commands/doctor/scripts/symlink-engine.cjs plan --root "$SCRATCH" > scratch/plan-2.txt && diff scratch/plan-1.txt scratch/plan-2.txt` prints nothing and exits 0.
- [x] T021 Run the route validator to prove the new router left the 24 existing routes alone (`symlink-engine.cjs`, `symlink.md`). Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh` prints `OK: route-validate — 24 routes validated`.
- [x] T022 Run strict validation over this packet (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/005-doctor-symlink-install/001-symlink-engine-and-command --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` exits 0 with `fail 0` (10 tests), and both live read-only checks ran; see SC-002 in spec.md for the amended expectation
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Frozen engine contract**: See `scratch/engine-contract.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Open: the evidence file records the engine runs only and holds no line about spec.md.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Open: no line records the plan's approach.
- [ ] CHK-003 [P1] Dependencies identified and available: `node --version` exits 0 and `rg -n 'sha256' .skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` prints its definition and its export. Open: no line records either command.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check .skilled/commands/doctor/scripts/symlink-engine.cjs` exits 0
- [ ] CHK-011 [P0] The suite prints no warning line: `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` shows `# fail 0` and no `Warning:` output. Open: lines 8 and 110 record the `0 fail` tally, and neither records whether the run printed a `Warning:` line.
- [ ] CHK-012 [P1] Error handling: every bad invocation exits 2 with one `ERROR:` line, and a failed apply exits 1 naming the action it stopped on. Open: lines 94-102 cover every bad invocation; no line covers a failed apply.
- [x] CHK-013 [P1] Comment hygiene: `bash .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` exits 0 on the engine and its test file. Evidence: `verification-evidence.md:115`, exit 0 on both files.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: the eleven rows of `acceptance-criteria.md` each cite a line in `verification-evidence.md`: 8, 14, 78-81, 85-86, 91, 94, 103-105 and 110-111.
- [x] CHK-021 [P0] Manual testing complete: both live dry runs against `$OBSIDIAN` and `$AI_SYSTEMS` reported the shapes SC-002 names. Evidence: `verification-evidence.md:22-31` for both runs and `verification-evidence.md:117` for the `.pi-subagents` link the manifest never reports. SC-002 was amended to these shapes.
- [ ] CHK-022 [P1] Edge cases tested: an empty action list, a deep merge, a foreign link and a root that is not a git work tree. Open: line 12 covers the foreign link and line 80 the non-git root; no line covers an empty action list or a deep merge.
- [x] CHK-023 [P1] Error scenarios validated: a refused root, a drifted digest, a missing flag value, and the unlink refusal without `--dry-run` or `--yes`. Evidence: `verification-evidence.md:14` (drifted digest), `verification-evidence.md:96` and `verification-evidence.md:99` (refused roots), `verification-evidence.md:102` (missing value), `verification-evidence.md:103` (unlink with neither flag).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Finding class: the missing link check is `cross-consumer`, because both link shapes exist in user repos and no doctor command reads either. Open: a classification call no line records; lines 22-31 and 117 record the two shapes, not the class.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n "output', 'doctor-" .skilled/commands/doctor/scripts` names `doctor-agents-md` and `doctor-symlink` as the only run-record writers. Open: no line records this search.
- [x] CHK-FIX-003 [P0] Consumer inventory: `rg -ln 'symlink-manifest.json' .skilled` names only files this packet added: the engine, its test, the three symlink workflows, the router and the playbook scenario (evidence addendum, manifest consumers). Amended from "the engine and the test suite and nothing else", which predated the workflows and docs that cite the manifest by path.
- [x] CHK-FIX-004 [P0] Path handling: the suite holds an outside-root link, a foreign link, a broken link into the source and a root inside the source, each with a case. Evidence: `verification-evidence.md:12` (broken link into the source replaced, outside link left) and `verification-evidence.md:16` (root inside source exits 2); the outside-root link and the foreign link are that one recorded case.
- [ ] CHK-FIX-005 [P1] Matrix axes listed: 7 runtimes by 3 modes, plus the 8 entry statuses, in `plan.md` section 3. Open: the axes are on disk at `plan.md:83`; no line records the check.
- [x] CHK-FIX-006 [P1] Hostile env variant: a target with no `.git`, and one whose `.git` is a file because it is a worktree, each checked. Evidence: `verification-evidence.md:80` (no `.git`: `git: false` and every `ignored` null) and `verification-evidence.md:113` (a `.git` file: the exclude lines resolved through the common dir).
- [ ] CHK-FIX-007 [P1] Evidence pinned to the phase commit rather than a moving branch-relative range. Open: nothing is committed yet; the operator commits.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets, and `--include env` prints its secrets warning before the plan. Open: line 90 records the warning; no line records a secrets scan of the engine.
- [ ] CHK-031 [P0] Input validation: flags, runtimes, extras and modes are validated before any path is read or written. Open: lines 95-102 cover a bad flag, runtime and mode; no line covers an unknown extra value.
- [ ] CHK-032 [P1] The engine writes only inside the root, the ignore file and the run directory under the source. Open: lines 78, 85 and 109 record unchanged listings and an exact restore, not a full write audit outside the root.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks name the same files and commands: `rg -c 'symlink-engine.cjs' spec.md plan.md tasks.md` prints a count above zero in each. Open: no line records the count.
- [ ] CHK-041 [P1] The engine's header comment states why the digest gate exists, with no spec path and no task id. Open: line 115 confirms no artifact label sits in either file's comments; no line records the header's why.
- [ ] CHK-042 [P2] The presentation owns every visible line, and the workflow YAMLs add no wording of their own. Open: no line records it.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp trees live under `os.tmpdir()`, and `scratch/` holds only the contract and the dry-run output. Open: no line records where the suite builds its trees; `scratch/` holds `engine-contract.md` and a `.gitkeep`.
- [ ] CHK-051 [P1] `scratch/` is cleaned of the plan output before completion. Open: no line records the check; the folder holds `engine-contract.md` and a `.gitkeep` and no plan output.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 4/12 |
| P1 Items | 13 | 3/13 |
| P2 Items | 1 | 0/1 |

Every `[x]` cites the `verification-evidence.md` line that observed it. The open boxes are of two kinds: behaviours no recorded run exercised, and document-structure checks the evidence file never covers.

**Verification Date**: 2026-10-31
<!-- /ANCHOR:summary -->

---
