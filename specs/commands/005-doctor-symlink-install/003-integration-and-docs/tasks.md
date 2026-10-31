---
title: "Tasks: Phase 3: integration-and-docs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "integration and docs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: integration-and-docs

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

**Paths**: `D` is `.skilled/commands/doctor/`. `B` is `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/`.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm both routers are on disk (`D/symlink.md`, `D/install.md`). Verify: `ls .skilled/commands/doctor/symlink.md .skilled/commands/doctor/install.md` prints both paths.
- [x] T002 Record the route baseline (`D/_routes.yaml`). Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh | rg 'B1:'` prints `PASS: B1: .routes has 24 entries`.
- [x] T003 [P] Record the index baseline (`D/scripts/command-catalog-mirror-check.cjs`). Verify: `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs | rg 'doctor:install|STATUS='` prints `/doctor:install not listed` and `STATUS=DRIFT`.
- [x] T004 [P] Read both frozen contracts before any edit (`specs/commands/005-doctor-symlink-install/001-symlink-engine-and-command/scratch/engine-contract.md`, `specs/commands/005-doctor-symlink-install/002-install-guide-router/scratch/install-contract.md`). Verify: `rg -l 'symlink-engine.cjs' specs/commands/005-doctor-symlink-install/001-symlink-engine-and-command/scratch/engine-contract.md` and `rg -l 'doctor-install.yaml' specs/commands/005-doctor-symlink-install/002-install-guide-router/scratch/install-contract.md` print both paths.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Routes

- [x] T005 Add the three `/doctor:symlink` routes, `check` (default, read-only), `link` and `unlink` (`D/_routes.yaml`). Verify: `rg -c '^  - command: /doctor:symlink$' .skilled/commands/doctor/_routes.yaml` prints 3.
- [x] T006 Add the one `/doctor:install` route, target `guide`, read-only (`D/_routes.yaml`). Verify: `rg -c '^  - command: /doctor:install$' .skilled/commands/doctor/_routes.yaml` prints 1.
- [x] T007 List both router files in the manifest header and raise its count from 14 to 16 (`D/_routes.yaml`). Verify: `rg -c '^#   /doctor:' .skilled/commands/doctor/_routes.yaml` prints 16 and `rg -n 'every one of the 16 router files' .skilled/commands/doctor/_routes.yaml` prints one line.

### Setup List And Advisor Bridges

- [x] T008 Add the two target rows to the `/doctor:setup` list (`D/assets/doctor-setup-presentation.txt`). Verify: `rg -c '^\| `/doctor:(symlink|install)' .skilled/commands/doctor/assets/doctor-setup-presentation.txt` prints 2.
- [x] T009 Activate the four new bridges, `command-doctor-symlink-check`, `-link`, `-unlink` and `command-doctor-install`, in both the `typescript` and the `python` list (`B/scoring-compatibility.json`). Verify: `node -e "const j=require('./.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json'); for (const l of ['typescript','python']) console.log(l, j[l].filter(e=>/^command-doctor-(symlink-(check|link|unlink)|install)$/.test(e.id)).length)"` prints `typescript 4` and `python 4`.
- [x] T010 Regenerate the four bridge files, then prove them current (`B/derive-command-bridges.cjs`). Verify: `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` exits 0.
- [x] T011 Add ranking fixtures for both commands (`D/scripts/tests/fixtures/doctor-helper/tune.jsonl`, `D/scripts/tests/fixtures/doctor-helper/heldout.jsonl`). Verify: `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs` exits 0.

### Command Index

- [x] T012 Change the family row from Fourteen to Sixteen and name both commands in it (`.skilled/commands/README.txt`). Verify: `rg -n 'Sixteen command files' .skilled/commands/README.txt` prints one line.
- [x] T013 Add the two rows to the doctor table, `Symlink` and `Install Guide` (`.skilled/commands/README.txt`). Verify: `rg -c '^\| (Symlink|Install Guide) \|' .skilled/commands/README.txt` prints 2.
- [x] T014 Prove the index agrees with the command frontmatter (`.skilled/commands/README.txt`). Verify: `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs | rg 'STATUS='` prints `STATUS=OK`.

### Root README

- [x] T015 Add the `### Use It In Your Own Project` section after `### Check The Setup`, opening on `/doctor:install` (`README.md`). Verify: `rg -n '^### Use It In Your Own Project' README.md` prints one line.
- [x] T016 Name both commands in `### Keep It Healthy` (`README.md`). Verify: `rg -n '/doctor:install' README.md` prints the Keep It Healthy line.
- [x] T017 Change the doctor count to Sixteen, add the two table rows and the two per-command entries (`README.md`). Verify: `rg -c '^\| `/doctor:(symlink|install)' README.md` prints 2 and `rg -n 'Sixteen commands check and repair' README.md` prints one line.

### Catalog, Playbook And Owner Docs

- [x] T018 Cover both commands in the doctor feature catalog (`.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md`). Verify: `rg -l '/doctor:symlink' .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md` prints the path.
- [x] T019 Add one playbook scenario per command under the next free DOC numbers (`.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/`). Verify: `rg -l '/doctor:install' .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands` prints at least one path.
- [x] T020 Name both commands in the spec-kit owner README's doctor table (`.skilled/skills/system-spec-kit/README.md`). Verify: `rg -c '/doctor:(symlink|install)' .skilled/skills/system-spec-kit/README.md` prints 2.
- [x] T021 Superseded, not executed: the advisor README carries no per-command list (`decision-record.md` ADR-001). Verify: `rg -c '/doctor:(symlink|install)' .skilled/skills/system-skill-advisor/README.md` prints nothing, which is the recorded reason rather than a gap.
- [x] T022 Name both bridges in the advisor's doctor routing document (`.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md`). Verify: `rg -c 'command-doctor-symlink|command-doctor-install' .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` prints 1, the sentence that names both families beside `command-doctor-helper` and the `command-doctor-agents-md-*` bridges. Recorded at `specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md:70`, and the id form is the one ADR-001 keeps.

### Mirrors

- [x] T023 Regenerate the runtime mirrors (`node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` exits 0.
- [x] T024 Regenerate the pi, codex and hermes prompt mirrors (`.skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs`). Verify: `for g in pi/sync-prompts-pi.cjs codex/sync-prompts.cjs hermes/sync-prompts-hermes.cjs; do node .skilled/skills/system-spec-kit/runtime/cli/$g --check; done` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T025 Run every doctor script suite (`D/scripts/tests/run-all.sh`). Verify: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0.
- [x] T026 Run the route, phrase and catalog checks. Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh | rg '^OK:'` prints one line starting `OK: route-validate — 28 routes validated`, `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs | rg 'STATUS='` prints `STATUS=OK`, and the catalog mirror check prints `STATUS=OK`.
- [x] T027 Run the advisor bridge suite and the Python suite. Verify: `npm --prefix .skilled/skills/system-skill-advisor/runtime test -- doctor-command-bridges` exits 0, and `python3 .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` exits 0.
- [x] T028 Probe the live advisor prompt. Verify: `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "symlink skilled into my project" --format json` names `/doctor:symlink` or `/doctor:install` and does not name `/doctor:mcp install`.
- [x] T029 Dry-run the engine against both real repositories, read-only. Verify: `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root "<path to the Obsidian Plugin repository>"` reports whole links plus one broken `.pi-subagents` link, `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root "<path to the AI Systems repository>"` reports merge links plus 10 broken links, and both write nothing.
- [x] T030 Strict-validate all three phase folders. Blocked on generated metadata, not on a document rule: each folder prints `Summary: Errors: 2` and `RESULT: FAILED` on `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` alone. The refresh is `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder <folder> --apply`, which rewrites the two generated files this lane may not write. Verify: `for d in 001-symlink-engine-and-command 002-install-guide-router 003-integration-and-docs; do bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/005-doctor-symlink-install/$d --strict; done` prints `RESULT: PASSED` three times.
- [x] T031 Fill `implementation-summary.md` with what changed and how it was checked (`implementation-summary.md`). The doc is filled, including the supersession and the known limitations. Its verify waits on T030: the run prints `RESULT: FAILED` on the two generated-metadata rules while passing every document rule, so it reads `RESULT: PASSED` once the metadata is refreshed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. T030 and T031 closed once strict validation printed `RESULT: PASSED` after the metadata re-derive
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — the recorded runs in `../scratch/verification-evidence.md`, plus the two registration scans AC-010 names.
- [x] `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK` and `bash .skilled/commands/doctor/scripts/route-validate.sh` reports 28 routes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Symlink contract**: See `../001-symlink-engine-and-command/scratch/engine-contract.md`
- **Install contract**: See `../002-install-guide-router/scratch/install-contract.md`
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

- [x] CHK-001 [P0] Both contracts are frozen and name their engine or workflow file. See T004.
- [x] CHK-002 [P0] Both routers are on disk, so the surfaces have something to register. See T001.
- [x] CHK-003 [P1] The task list covers all nine steps of the approved plan. Verify: `rg -c '^- \[[x ]\] T[0-9]' specs/commands/005-doctor-symlink-install/003-integration-and-docs/tasks.md` prints 31, one line per step. The original filter counted unchecked tasks, which can only read 31 while the list is untouched; it now reads 2, both waiting on the metadata refresh.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The route manifest parses and validates. Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0.
- [x] CHK-011 [P0] Both edited JSON files parse. Verify: `node -e "require('./.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json'); require('./.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json')"` exits 0.
- [x] CHK-012 [P1] No command reuses a target name. Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh | rg 'C1'` prints `PASS: C1`.
- [x] CHK-013 [P1] Every route carries the manifest's required keys. Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh | rg 'B2'` prints `PASS: B2`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria closed. Verify: every row in `acceptance-criteria.md` reads `Met`, `Waived` or `Superseded` — nine `Met` and AC-008 `Superseded` through ADR-001 — which the validator reports as `AC_CLOSURE: 10/10 criteria met, waived or superseded; packet is closeable`.
- [x] CHK-021 [P0] The doctor suites pass. Verify: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0.
- [x] CHK-022 [P0] The live advisor prompt names a new command and not `/doctor:mcp install`. See T028.
- [x] CHK-023 [P1] Every declared phrase reaches its bridge. Verify: `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs | rg 'STATUS='` prints `STATUS=OK`.
- [x] CHK-024 [P1] Both real-repository dry runs write nothing and report the known broken links. See T029.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No file this phase edits holds a credential. Verify: `rg -n 'sk-[A-Za-z0-9]{16,}|ghp_' README.md .skilled/commands/README.txt .skilled/skills/system-spec-kit/README.md .skilled/skills/system-skill-advisor/README.md` prints nothing; it exited 1 with no match in this pass.
- [x] CHK-031 [P0] No doc line tells a reader to commit an absolute link. Verify: `rg -n 'commit the link|commit an absolute link|commit a link' README.md .skilled/commands/README.txt` prints nothing; it exited 1 with no match in this pass.
- [x] CHK-032 [P1] The install route stays read-only. Verify: `rg -n -A8 '^  - command: /doctor:install$' .skilled/commands/doctor/_routes.yaml | rg 'mutating:'` prints `mutating: read-only`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The two command counts agree. Verify: `rg -n 'Sixteen' README.md .skilled/commands/README.txt` prints both lines.
- [x] CHK-041 [P1] Every index agrees with the command frontmatter. Verify: `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs | rg 'STATUS='` prints `STATUS=OK`.
- [x] CHK-042 [P2] The doctor catalog version moves forward. Its body gained the two command entries, and the bump rule raises the third segment when a body changes, so the file carries `version: 1.7.8.0` at `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:10`. Verify: `rg -n '^version:' .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md` prints `1.7.8.0`, above `1.7.7.0`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No scratch leftovers in this folder. The folder holds only `.gitkeep`, which `git status --porcelain` reports as the untracked folder because the whole packet is new. Verify: `ls -A specs/commands/005-doctor-symlink-install/003-integration-and-docs/scratch` prints `.gitkeep`.
- [x] CHK-051 [P1] Every mirror is regenerated, never hand-edited. Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` exits 0.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-31
<!-- /ANCHOR:summary -->

---
