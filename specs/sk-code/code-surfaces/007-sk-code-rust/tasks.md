---
title: "Tasks: Rust standards in sk-code, informed by rust-anything"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "sk code rust tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Rust standards in sk-code, informed by rust-anything

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

`P` is `specs/sk-code/code-surfaces/007-sk-code-rust`. `S` is `.skilled/skills/sk-code/sk-code-skilled`. `RA` is `specs/z_external-repo-library/rust-anything-main`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Preview the research fan-out with `--dry-run` and read each lineage's command (`$P/research/`). Verify: the preview prints three `cli-mistral-vibe` lineages with model `deepseek-flash`, and `ls $P/research` shows no iteration file written. Done in the sending session.
- [x] T002 Run the research fan-out, three lineages of up to eight iterations each (`$P/research/`). Verify: `test -f $P/research/research.md` exits 0 and `ls $P/research/lineages/*/iterations/*.md | wc -l` prints at least 3. It printed 15. vibe-2 stalled and was stopped.
- [x] T003 Open every rust-anything `file:line` the applied rules cite and mark each one that does not resolve (`$P/scratch/cite-check.txt`). Verify: every line in `$P/scratch/cite-check.txt` starts with `ok`. It lists 29 anchors, all `ok`, and each was also read by hand.
- [x] T004 Copy the pre-change text of the binding sections into `$P/scratch/before/` for the REQ-005 comparison (`$P/scratch/before/`). Verify: `ls $P/scratch/before | wc -l` prints 22, the 21 Rust parts plus `SKILL.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Rewritten after the research to match the rows of `research/research.md` section 4 as applied. Section 5 of that file records the rows changed while applying.

- [x] T005 Confirm the finish gate, Edition 2024, the declared `rust-version` and the six-lint deny list already stand, so `toolchain-and-project-structure.md` needs no edit (`$S/references/rust/quality-standards/build-and-organization.md`). Verify: `rg -n 'clippy --workspace --all-targets --locked -- -D warnings' $S/references/rust/quality-standards/build-and-organization.md` prints a line.
- [x] T006 Scope the checklist and `SKILL.md` to app-style Rust and add the process contract row, rows 1 to 3 (`$S/assets/checklists/rust-checklist/overview-and-p0-parity.md`, `$S/SKILL.md`). Verify: `rg -n 'Process contract' $S/assets/checklists/rust-checklist/overview-and-p0-parity.md` prints a line.
- [x] T007 Add `anyhow` for a crate with no ABI boundary and §Application Entry Point, rows 4 and 5 (`$S/references/rust/quality-standards/docs-errors-and-async.md`). Verify: `rg -n '### Application Entry Point' $S/references/rust/quality-standards/docs-errors-and-async.md` prints a line.
- [x] T008 Add the single-crate app layout with clap, the single-crate lint form, the binary tests and the child stdout rule, rows 6 to 9 (`$S/references/rust/quality-standards/build-and-organization.md`). Verify: `rg -c 'clap|CARGO_BIN_EXE|\[lints.clippy\]' $S/references/rust/quality-standards/build-and-organization.md` prints at least 3.
- [x] T009 Add §Porting Against a Recorded Original and the `serde_json` features, rows 10 to 13 (`$S/references/rust/quality-standards/determinism-and-parity.md`). Verify: `rg -n '### Porting Against a Recorded Original|float_roundtrip' $S/references/rust/quality-standards/determinism-and-parity.md` prints two lines.
- [x] T010 Name ratatui and crossterm as the terminal screen case with no rendering rules, part of row 6 (`$S/references/rust/quality-standards/build-and-organization.md`). Verify: `rg -l 'ratatui' $S/references/rust | wc -l` prints 1.
- [x] T011 Add the regex engine rule and the Java `char` refusal, rows 14 and 15 (`$S/references/rust/quality-standards/modeling-collections-and-api.md`). Verify: `rg -n 'fancy-regex|UTF-16 code unit' $S/references/rust/quality-standards/modeling-collections-and-api.md` prints two lines. Row 16, the C ABI contract, is dropped per research section 5.
- [x] T012 Prefer `#[expect]` over `#[allow]` and name the infallible exception, rows 17 and 18 (`$S/assets/checklists/rust-checklist/p1-required.md`, `$S/references/rust/quality-standards/build-and-organization.md`). Verify: `rg -n '#\[expect' $S/assets/checklists/rust-checklist/p1-required.md` prints at least two lines.
- [x] T013 Confirm no part was added, so the hub router and registry stay unchanged (`.skilled/skills/sk-code/ROUTER.md`, `.skilled/skills/sk-code/mode-registry.json`). Verify: `node $S/assets/scripts/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed`.
- [x] T014 Bump the version and write the changelog entry (`$S/SKILL.md`, `$S/changelog/v2.3.0.0.md`). Verify: `rg -n '^version:' $S/SKILL.md` prints `version: 2.3.0.0`, and the changelog names all seven changed parts.
- [x] T015 Leave the LS-006 scenario unchanged, because it names the Rust folders and no folder changed (`.skilled/skills/sk-code/manual-testing-playbook/language-sub-detection/skilled-rust.md`). Verify: `ls` on the three `references/rust/` folders and `assets/checklists/rust-checklist/` lists each one.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run the router sync check (`$S/assets/scripts/verify-router-sync.cjs`). Verify: it prints `router-sync: 5/5 checks passed` and exits 0.
- [x] T017 Run the package validator (`.skilled/skills/sk-doc/scripts/validate_skill_package.py`). Verify: `python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py $S` prints `package_skill.py --check: PASS (exit 0)`.
- [x] T018 Run the copy check against the reference repository (`$P/scratch/copy-check.txt`). Verify: the `comm -12` command, run over rust-anything's `.md` and `.rs` files and the Rust parts plus `SKILL.md`, wrote an empty `$P/scratch/copy-check.txt`.
- [x] T019 Compare each binding section with its pre-change copy (`$P/scratch/binding-check.txt`). Verify: it reports 517 rule lines, 513 verbatim, 4 changed with meaning kept and 0 missing.
- [x] T020 Rerun the coverage grep from `spec.md` Measured Behavior (`$S/references/rust/`). Verify: `clap`, `ratatui` and `crossterm` each print 1 file, `build-and-organization.md`.
- [x] T021 Validate the packet (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] The LS-006 scenario was replayed by hand and loaded both trios
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md, checked by `rg -c '^\| REQ-' $P/spec.md` printing 6. It printed 6.
- [x] CHK-002 [P0] The router sync baseline is recorded in plan.md section 2
- [x] CHK-003 [P1] Every cited rust-anything line resolves, per `$P/scratch/cite-check.txt`. 29 of 29 `ok`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `verify-router-sync.cjs` prints `router-sync: 5/5 checks passed`
- [x] CHK-011 [P0] `validate_skill_package.py` reports no error for sk-code-skilled
- [x] CHK-012 [P1] Every new rule carries a source citation, or rests on an existing sk-code rule
- [x] CHK-013 [P1] Each edited part keeps its frontmatter and section shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The LS-006 scenario replayed by hand. Steps 1 and 2 passed on 2026-11-26: the advisor put sk-code first at confidence 0.8538 with `passes_threshold` true. Steps 3 to 5 ran in one cli-mistral-vibe worker and fail on one point: the worker opened no `typescript/quick-reference/` file, although the routing it cited selects both. Every Rust part loaded, and no python, shell or config reference loaded. Evidence: `$P/scratch/ls006-replay.txt`.
- [x] CHK-022 [P1] The copy check prints nothing
- [x] CHK-023 [P1] The binding comparison lists no missing rule
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The research wrote nothing outside `$P/research/`, checked with `git status --short` after the run. It lists only the seven edited parts, the new changelog, this packet and the track `graph-metadata.json`.
- [x] CHK-031 [P1] No reference part tells a reader to run an install command without naming it as an install
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same final file list, in `plan.md` §Final File List
- [x] CHK-041 [P1] The changelog entry names every changed part
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files live in `$P/scratch/` only
- [ ] CHK-051 [P1] `$P/scratch/before/` is removed before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 6/7 |
| P1 Items | 10 | 9/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-26
<!-- /ANCHOR:summary -->

---
