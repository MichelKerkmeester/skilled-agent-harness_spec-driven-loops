---
title: "Implementation Plan: Phase 20: deep-review-remediation"
description: "Eight lanes that close the deep review findings against phases 016 to 019, each lane with its red test first."
trigger_phrases:
  - "deep review remediation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 20: deep-review-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
- **Stack**: Node CJS and MJS modules, shell scripts, GitHub Actions YAML, and the Markdown contracts the spec-kit runtime loads.
- **Test runners**: `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` (vitest), `bash .skilled/commands/doctor/scripts/tests/run-all.sh`, and `node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/*.test.mjs`.
- **Storage**: none. The only persisted state is the trigger index that the CI workflow rebuilds.

### Overview
The review found three default paths that follow a symlink past a name check, a CI credential that install scripts can read, a retry that ignores a failed generator, a phrase cleanup with no provenance check, and documentation that disagrees with the code. Each finding maps to one requirement in `spec.md` and to one of eight lanes in section 3. Every code lane writes its red test first, runs it on the unfixed code, makes the fix, and runs it green.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- The finding is read in `review/review-report.md` section 3, and its cited line is re-read in the current tree before any edit.
- The red run exists in `scratch/evidence/` and was captured on the unfixed code.

### Definition of Done
- The green run exists in `scratch/evidence/`, and the acceptance row names both paths.
- The lane's files pass their own test file, and the lane's stated verification passes.
- `validate.sh --strict` prints RESULT: PASSED on this folder at closeout.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Confine, then act. A path is resolved to its real location, checked against the root it must stay under, and only then read, written, renamed or removed. The same pattern applies to four write or read paths (lanes A, B, C and F), and each one gets its own outside-root test.

### Key Components

| Lane | Requirements | Files | Red case first | Stated verification |
|------|--------------|-------|----------------|---------------------|
| A. archive.sh | REQ-001 | `runtime/cli/spec/archive.sh`, `runtime/cli/tests/archive-track.vitest.ts` | A `z_archive` symlink to a directory outside `specs`: archive refuses, copies nothing, and leaves the source intact | The existing track and phase archive cases still pass |
| B. Healer and shared helper | REQ-002, REQ-003 | `runtime/cli/spec/heal-spec-docs.cjs`, `runtime/cli/spec/upgrade-legacy.mjs`, `runtime/cli/tests/heal-symlink-containment.vitest.ts` | A symlinked `spec.md` and a symlinked `tasks.md` under default `--apply`: the outside target keeps its bytes | A parity case runs one fixture through `--folder`, `--roots` and the default root, and selects the same targets before and after the helper extraction |
| C. Leaf walker | REQ-004 | `sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`, `scripts/tests/generate-leaf-manifest-scopes.test.cjs` | A default root and a declared scope symlinked outside the skill: the generator refuses and the manifest keeps its bytes | `ci-leaf-manifest-freshness.test.cjs` and the 14 hub `--check` runs still pass |
| D. CI workflows | REQ-005, REQ-006, REQ-007 | `.github/workflows/trigger-index-rebuild.yml`, and the report producer traced for REQ-007 | A parse test that fails while checkout keeps credentials or a nonzero retry is ignored, and a packet title with a raw newline reaching an annotation, if the trace finds that route. **Amended 2026-10-10:** the in-step retry was removed by the operator's restructure decision of the same date, so the retry red case is historical, and the red runs are the restructured workflow's mutants (see spec.md REQ-006). | The parse test is the proof here, because `actionlint` is not installed (REQ-015). The first push's CI is recorded as the live receipt |
| E. Phrase cleanup provenance | REQ-008 | `runtime/cli/spec/template-phrase-cleanup.mjs`, `runtime/cli/tests/template-phrase-integration.vitest.ts` | An authored eight-token trigger that ends in a stop word: `--apply` leaves it byte-identical | The generated phrase is still trimmed, under the existing integration case |
| F. Upgrade-legacy audit | REQ-009 | `runtime/cli/spec/upgrade-legacy.mjs`, `runtime/cli/tests/upgrade-legacy.vitest.ts` | A symlinked apply or move target outside `specs`: nothing is written or moved | `scratch/evidence/upgrade-symlink-audit.txt` lists every apply and move path with the check that guards it |
| G. Gate 3 docs and repo-era catalog | REQ-010, REQ-011, REQ-012 | `system-spec-kit/SKILL.md`, `.hermes/skills/system-spec-kit/SKILL.md`, `speckit/assets/speckit-implement.yaml`, `feature-catalog/tooling-and-scripts/repo-era-report.md`, `runtime/cli/tests/repo-era.vitest.ts` | A contract assertion that all three Gate 3 surfaces state the child-dispatch pre-resolution, and a no-roots case for the classifier | `sync-skills-hermes.cjs --check` passes, and `validate_catalog_package.py` keeps the 019 baseline of 85 warnings and 0 failures |
| H. Packet and parent doc lane | REQ-013, REQ-014, REQ-015, REQ-016 | `034 spec.md`, `019` spec, acceptance and summary, this folder | `rg` finds no `[Criteria TBD]` cell in a handoff row, and no unchecked SC-002 in 019 | The CLI and doctor suites run from the final state, and each strict validate prints RESULT: PASSED |

### Data Flow
Finding, then requirement, then lane. The lane runs its red test, makes the fix, and runs the green test. The result goes to `scratch/evidence/`, then into the matching acceptance row. Lane H reads the rows at closeout and runs the authoritative gates.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- Default healer `--apply` document write (R2-P1-001, lane B)
- Anchor-repair and lane-mode CLIs and the upgrade caller (R4-P2-001, lane B)
- Default leaf roots and declared scopes, and the manifest consumers (R2-P1-002, lane C)
- Archive destination and packet source removal (R2-P1-003, lane A)
- Trigger-index workflow checkout, npm install and push, and the retry (R2-P1-004 and R8-P1-001, lane D). **Amended 2026-10-10:** the in-step retry was removed by the operator's "Restructure now" decision of the same date, and the exit-checked regenerate step is the equivalent check (see spec.md REQ-006).
- Report producer feeding Actions annotations (SL-006-010, lane D)
- Spec trigger lists and phrase cleanup `--apply` (R5-P1-001, lane E)
- upgrade-legacy apply and move paths (SL-SEC-008, lane F)
- system-spec-kit SKILL.md, its Hermes mirror, `speckit-implement.yaml` and autonomous child dispatch (R7-P1-001, lane G)
- Repo-era feature catalog and its classifier (R7-P2-001, lane G)
- Parent phase map and handoff table, and phase 019 success criteria and evidence (R3-P1-001 and R3-P1-002, lane H)

Required inventories for the fix-completeness rule:
- **Same-class producers** (class-of-bug rows, lanes B, C, E, F): grep the lane's package for every call that writes, reads, renames or removes a path derived from user input. Each call site is either confined by the fix or listed as out of reach, with the grep output saved to `scratch/evidence/`.
- **Consumers of a changed helper** (lane B): the three entrypoints and `upgrade-legacy.mjs`.
- **Matrix axes** (lane B parity): three entrypoints by three selections (`--folder`, `--roots`, default root).
- **Cross-surface contract** (lane G): the canonical SKILL.md, the Hermes copy and the implementation YAML.

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Read each finding's cited lines in the current tree.
- Record the starting numbers: the strict validates for phase 019 and the 034 parent, both PASSED at this phase's start, and the 019 suite baselines.

### Phase 2: Lanes
- Lanes A to G each run red, fix, and run green, in their own files.
- Lane H updates the parent, the phase 019 records and this packet's documents, and reads the lane evidence before it marks any row Met.

### Phase 3: Verification
- Run the CLI suite, the doctor suites and the hooks suite from the final state.
- Run `validate.sh --strict` on this folder, on phase 019 and on the 034 parent, and save each output.
- Mark every acceptance row with the evidence path.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Path containment (adversarial) | Outside-root symlink, inside-root symlink (allowed), dangling symlink (refused), plain packet (happy path) for lanes A, B, C and F | vitest and `node --test` |
| Workflow contract | Checkout credential, token placement, the retry exit and the four-output check, from a stub generator | A YAML parse test in vitest. **Amended 2026-10-10:** the retry exit named above was removed by the operator's "Restructure now" decision of the same date, and the exit-checked regenerate step is the equivalent check (see spec.md REQ-006). |
| Phrase provenance | Authored trigger that matches the eight-token shape, and a generated phrase that must still be trimmed | vitest |
| Contract assertion | Child-dispatch branch present in the three Gate 3 surfaces | vitest or a `.test.cjs` file in the owning skill |
| Full suites | CLI suite with `SPECKIT_TEST_RUN_TIMEOUT_MS=3600000`, doctor `run-all.sh`, hooks `node --test` | The commands listed in section 1 |
| Specs-root isolation | The CLI suite leaves the real `specs/` listing unchanged, as in phase 019 | `ls` before and after the run |

Baselines to beat, from phase 019: CLI suite 1776 passed, 19 skipped, 0 failed. Hooks 186 pass, 0 fail, 3 skipped. Doctor suites 7 passed, 0 failed.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if blocked |
|------------|------|--------|-------------------|
| Phase 019 on `main` at `079e9c34d2` | Internal | Met | None |
| `actionlint` | Tool | Not installed | REQ-015 stays open, and the parse test is the only workflow proof |
| First push of the workflow change | External | Not yet made | REQ-005 and REQ-006 get live CI proof only after the orchestrator pushes |
| Operator's yes for the `actionlint` install | Human | Pending | Blocks the install, under the blast-radius rule |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Undo a lane**: restore that lane's files from the last commit, then rerun the lane's red test and confirm the failure comes back.
- **Undo the packet docs and parent edits**: restore `034 spec.md`, the phase 019 documents and this folder from the last commit.
- **Stop condition**: a green run that a later edit turns red stops the lane until the cause is found.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Lanes A to G are independent of one another, and each owns its files.
- Lane H reads every lane's evidence. REQ-016 runs last, after all lanes.

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Lane | Relative size | Reason |
|------|---------------|--------|
| A. archive.sh | Small | One guard and one test |
| B. Healer and helper | Medium | Four entrypoints and a parity matrix |
| C. Leaf walker | Small | One guard on each start scope |
| D. CI workflows | Medium | Workflow edits, a parse test and a producer trace |
| E. Phrase provenance | Small | One predicate and one test |
| F. Upgrade audit | Medium | Every apply and move path needs a check |
| G. Gate 3 docs and catalog | Small | Three mirrored text edits, a diff and one catalog line |
| H. Doc lane | Small | Parent rows, phase 019 evidence, and closeout runs |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Each red run is saved before its fix is written.
- Each lane's files are listed in `spec.md` section 3.

### Rollback Procedure
- Restore the lane's files from the last commit, rerun the red test, and confirm it fails again.

### Data Reversal
- Not applicable. No data store is touched. The trigger index is regenerated by the workflow, and a revert regenerates it again.

<!-- /ANCHOR:enhanced-rollback -->
