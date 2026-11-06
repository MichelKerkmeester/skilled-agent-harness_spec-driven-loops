---
title: "Tasks: Phase 5: dsh-mirror-generators"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh mirror generators tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: dsh-mirror-generators

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

`G` is `.skilled/skills/system-spec-kit/runtime/cli/dsh/`. `T` is `.skilled/skills/system-spec-kit/runtime/cli/tests/`. `C` is this phase's `evidence/closeout-checks.txt` (closeout rerun) and `O` is `evidence/checks.txt` (the orchestrator's run). Authoring mode is `sk-code` `sk-code-skilled`, plus `sk-code-ci` for T008. Executor is `cli-codex gpt-6-luna xhigh fast`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 004 landed (`.dsh/SYNC.md`). Verify: `ls .dsh/SYNC.md` prints the path and `git check-ignore -q .dsh/skills/local-probe` exits 0. Evidence: `.dsh/SYNC.md` printed, then `exit=0` (`C:190-192`).
- [x] T002 Record the baseline skill count. Verify: `find .skilled/skills -name SKILL.md -not -path '*/node_modules/*' | wc -l` prints a number, saved in `goal.md` section 4. Evidence: 54 when the spec was written (`spec.md` Measured Behavior) and 55 at closeout (`C:127-129`). The farm is counted at run time, so it follows the 55.
- [x] T003 [P] Read the precedent generators (`.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`). Verify: their `--check` contracts are noted in `plan.md` section 3. Evidence: `plan.md` section 3 names the Pi and Hermes generators as the pattern, and the codex brief told the executor to read them and mirror their `--check` contract and env overrides.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the skill farm generator (`G/sync-skills-dsh.cjs`). Verify: `node G/sync-skills-dsh.cjs --check` exits 0 after a write run. Evidence: `PASS: 55 skill links are in sync.`, `exit=0` (`O:1-3`, rerun `C:79-80`).
- [x] T005 [P] Write the prompt generator (`G/sync-prompts-dsh.cjs`). Verify: `node G/sync-prompts-dsh.cjs --check` exits 0 after a write run. Evidence: `PASS: 44 prompt stubs are in sync.`, `exit=0` (`O:4-6`, rerun `C:81-83`).
- [x] T006 [P] Write the persona generator (`G/sync-agents-dsh.cjs`). Verify: `node G/sync-agents-dsh.cjs --check` exits 0 after a write run. Evidence: `PASS: 11 agent patches are in sync.`, `exit=0` (`O:7-9`, rerun `C:84-86`). The orchestrator composed all 11 patches through `dsh --dump-config` from a disposable `DSH_HOME`, each exit 0 with empty stderr (`O:24`).
- [x] T007 Write the three tests (`T/sync-skills-dsh.test.mjs`, `T/sync-prompts-dsh.test.mjs`, `T/sync-agents-dsh.test.mjs`) with a duplicate-name case and an over-500-character description case. Verify: `node --test T/sync-*-dsh.test.mjs` prints `# fail 0`. Evidence: `ℹ tests 8`, `ℹ pass 8`, `ℹ fail 0`, `exit=0`, with the named cases `exits with code one and names both paths when frontmatter names collide` and `skips missing metadata with warnings and warns without failing for long descriptions` (`C:93-105`, `O:10-14`).
- [x] T008 Add the `dsh-mirror` job (`.github/workflows/command-tree-parity.yml`). Verify: `rg -n 'dsh-mirror' .github/workflows/command-tree-parity.yml` prints a line. Evidence: `130:  dsh-mirror:` (`C:118-120`, `O:17-18`). Both paths filters gain `.dsh/**` and the generator folder at lines 20-22 and 49-51.
- [x] T009 Add the `.dsh/` mirror to the doctor (`.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`, `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs`). Verify: `node --test` on the contract test prints `# fail 0`. Evidence: `ℹ pass 7`, `ℹ fail 0`, `exit=0` (`C:106-117`, `O:19-23`). Deviation: the new test also needs three `script_invocations` lines in `.skilled/commands/doctor/_routes.yaml`, a file outside the plan's list. The orchestrator added them because the runtime-mirrors route lists every mirror check.
- [x] T010 Write `G/README.md` and update `.dsh/SYNC.md` with the three mirrors. Verify: `rg -n 'skills|prompts|agents' .dsh/SYNC.md` prints one line per mirror. Evidence: `.dsh/SYNC.md:27-29` hold one inventory row each for `skills/<name>`, `prompts/*.md` and `agents/<name>.patch.yml`. `validate_document.py` gives the README `VALID` with 0 issues and SYNC.md one `document_type_fallback` warning (`C:175-189`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Check the farm count (REQ-001). Verify: `ls -d .dsh/skills/*/ | wc -l` equals the T002 count minus the exclusions the generator prints. Evidence: farm 55 (`C:121-123`) and `find` 55 (`C:127-129`). The generator prints 75 excluded directories (`C:4-78`) and none holds a `SKILL.md` that `find` counts, so 55 minus 0 is 55 (`O:15-16`).
- [x] T012 Check link resolution (REQ-004). Verify: `ls .dsh/skills/*/SKILL.md | wc -l` equals `ls -d .dsh/skills/*/ | wc -l`. Evidence: 55 and 55 (`C:121-126`).
- [x] T013 Check idempotence. Verify: a second run of all three generators leaves `git status --porcelain .dsh` empty. Evidence: `.dsh/` is untracked (`?? .dsh/`, `C:152-154`), so `git status` cannot show a diff and the literal command does not apply. In its place: each generator builds one expected set and either compares it (`--check`) or writes it (`G/sync-skills-dsh.cjs:363-368`, `G/sync-prompts-dsh.cjs:230-235`, `G/sync-agents-dsh.cjs:218-223`), and all three `--check` runs pass after the orchestrator's write run (`O:1-9`), so a second write has nothing to change. The closeout did not rerun write mode, because this pass may not touch `.dsh/`.
- [x] T014 Validate the phase docs. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`. Evidence: the strict run on 2026-11-06 printed `RESULT: PASSED` (`implementation-summary.md` Verification).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The three `--check` runs exit 0 and their output is recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Phase plan**: `../001-deep-research/research/phase-plan.md` section 4, `005-dsh-mirror-generators`
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

A task blocked by phase 004 is marked `[B]` with the missing file named, and the phase stays open.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-005 in spec.md section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md section 3 names the generate-then-check pattern and the three components
- [x] CHK-003 [P1] `ls .dsh/SYNC.md` prints the path before T004 starts. Evidence: phase 004 closed Complete before the dispatch, and the path still prints (`C:190-191`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` exits 0 on each of the three generators. Evidence: three `exit=0` lines (`C:87-92`)
- [x] CHK-011 [P0] `--check` writes nothing: `git status --porcelain .dsh` is unchanged by a `--check` run. Evidence: `.dsh/` is untracked, so the closeout hashed `find .dsh -exec stat` before and after the three `--check` runs: `before=a9ef18defa72 after=a9ef18defa72` (`C:171-172`). The tests also assert `--check` reports drift `without repairing` (`C:95`, `C:97`, `C:100`)
- [x] CHK-012 [P1] A duplicate frontmatter `name` exits non-zero with the two paths named. Evidence: test `exits with code one and names both paths when frontmatter names collide` passes (`C:101`)
- [x] CHK-013 [P1] `rg -n -E 'specs/|packet [0-9]|phase [0-9]' G` returns nothing, so comments carry no ephemeral labels. Evidence: run as three `-e` patterns, no match, `exit=1` (`C:136-137`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: AC-001 to AC-005 are Met in `acceptance-criteria.md`
- [x] CHK-021 [P0] `node --test T/sync-*-dsh.test.mjs` prints `# fail 0`. Evidence: `ℹ fail 0`, `exit=0` (`C:104-105`)
- [x] CHK-022 [P1] The over-500-character description case prints a warning and does not fail. Evidence: test `warns without failing for long descriptions` passes and asserts `result.status` 0 (`C:99`, `T/sync-skills-dsh.test.mjs:125`)
- [x] CHK-023 [P1] Deleting one farm link makes `sync-skills-dsh.cjs --check` exit non-zero. Evidence: test `--check reports missing, stale, and extra links without repairing them` passes and asserts `check.status` 1 on a temp farm with a missing link (`C:100`, `T/sync-skills-dsh.test.mjs:155`). Not repeated on the real `.dsh/skills/`, which this pass may not touch
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `rg -n '\.env|DSH_HOME|API_KEY' G` returns nothing, so no generator reads a credential. Evidence: the literal pattern matches six lines, all `process.env.DSH_*_DIR` path overrides the tests use for temp dirs (`C:138-145`). The pattern's `\.env` catches `process.env`, not an env file. A narrower scan for a `'.env'` file name, `DSH_HOME`, `API_KEY` and `apiKey` finds nothing, `exit=1` (`C:173-174`)
- [x] CHK-031 [P0] Every farm link resolves inside the repository (`readlink` targets start with `../../.skilled/`). Evidence: `grep -vc` over all `readlink` targets counts 0 that do not start with `../../.skilled/` (`C:130-132`), for example `../../.skilled/skills/cli-external-orchestration/cli-pi` (`C:133-135`)
- [x] CHK-032 [P1] No generator writes outside `.dsh/`. Evidence: each output default is `path.join(REPO_ROOT, '.dsh', ...)` (`C:140`, `C:142`, `C:144`). A `DSH_*_OUTPUT_DIR` override can point elsewhere, which only the tests set, to a `mkdtemp` dir
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same three generators. Evidence: all three name `sync-skills-dsh.cjs`, `sync-prompts-dsh.cjs` and `sync-agents-dsh.cjs`
- [x] CHK-041 [P1] `G/README.md` documents each generator's write and `--check` usage. Evidence: `G/README.md:16` and `:45` describe write mode and `--check`, and the validator gives 0 issues (`C:175-180`)
- [x] CHK-042 [P2] `.dsh/SYNC.md` names each generated mirror with its mechanism and source. Evidence: `.dsh/SYNC.md:27-29`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Test fixture trees are created in temp dirs by the tests, never in the repository. Evidence: each test builds its root with `mkdtempSync(join(tmpdir(), 'dsh-<surface>-'))` (`T/sync-skills-dsh.test.mjs:32`, `T/sync-prompts-dsh.test.mjs:21`, `T/sync-agents-dsh.test.mjs:32`)
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `ls -la scratch` lists only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-06. All items verified.
<!-- /ANCHOR:summary -->

---
