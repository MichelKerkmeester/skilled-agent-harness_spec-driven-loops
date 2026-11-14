---
title: "Feature Specification: Phase 12: catalog-and-playbook-alignment"
description: "The system-spec-kit feature catalog and manual testing playbook still describe relocation, restore, archive search and the sub-track proposal as they stood after phase 005. This phase brings each page in line with the shipped behavior of phases 006 to 011, to the sk-doc catalog and playbook standards."
trigger_phrases:
  - "catalog and playbook alignment"
  - "phase 12 catalog and playbook alignment"
  - "feature catalog relocation exit 3"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: catalog-and-playbook-alignment

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | Chosen by the operator before the build, worktree or current branch |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 13 |
| **Predecessor** | 011-relocate-and-restore-fixes |
| **Successor** | 013-skill-docs-and-housekeeping |
| **Handoff Criteria** | Every catalog and playbook row of `../review/review-report.md` is fixed or recorded as needing no change, and the catalog and playbook validators of sk-doc pass on each changed page |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search specification.

**Scope Boundary**: Pages under `.skilled/skills/system-spec-kit/feature-catalog/` and `.skilled/skills/system-spec-kit/manual-testing-playbook/`. No code. `SKILL.md`, references, READMEs and the changelog belong to phase 013.

**Dependencies**:
- Phase 011, whose final behavior these pages describe: exit 3 only on `RESULT: FAILED`, and the restore check without a dry run
- `.skilled/skills/sk-doc/sk-create-feature-catalog/SKILL.md` and `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md`, the standards each page is held to

**Deliverables**:
- Catalog pages that state exit 3, the restore outcomes, the mixed-track refusal, `archivedPaths`, the fourth no-map case and the phase 007 rewrite passes
- Playbook scenarios for exit 3 and the late-step resume, the proposal map fed to the preflight, and the archive path record
- Source inventories that list `relocate-real-pipeline.vitest.ts`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 006 to 010 changed what `relocate.mjs`, `archive.sh`, `rg-wrapper.mjs` and `suggest-subtracks.mjs` do, and only `runtime/cli/spec/README.md` was updated for one of those changes. The feature catalog tells an operator that a restore which succeeded has failed, never mentions exit 3 or `archivedPaths`, and lists three no-map cases where there are four. The playbook has no scenario that would catch any of this.

### Purpose
Each catalog page and playbook scenario matches the shipped behavior, so an operator reading the catalog acts correctly and a tester running the playbook exercises the new paths.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n '66p' .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md
Exit status 0 means nothing is left to do, and after `--apply` it means every step landed and the close passed. Status 1 means a dry run found work. Status 2 means a rejected argument, a refused plan, a failed step or a failed close.
$ sed -n '1661p' .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs
      if (status === 0) status = 3;
```
The page names three statuses, and the script sets a fourth. The other rows of section 3 are quoted in `../review/review-report.md` sections 3 and 4, each checked against the file by the orchestrator on 2026-11-14.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

`FC` is `.skilled/skills/system-spec-kit/feature-catalog`. `MP` is `.skilled/skills/system-spec-kit/manual-testing-playbook`. Line numbers are from 2026-11-14 and T001 re-reads each one.

### In Scope
- `FC/tooling-and-scripts/spec-packet-relocation.md:66`: exit status 3 and its narrowed condition (P1).
- `FC/tooling-and-scripts/spec-lifecycle-automation.md:45`: a status 3 restore exits 0 with a warning, and the mixed-track restore refusal (P1).
- `FC/retrieval/rg-archive-search.md:28`: the path record's `archivedPaths` (P1).
- `FC/tooling-and-scripts/spec-packet-relocation.md:44`: the bare-name, re-parent and pre-archive id passes (P2).
- `FC/tooling-and-scripts/spec-packet-relocation.md:91` and the matching playbook source list: `relocate-real-pipeline.vitest.ts` (P2).
- `FC/tooling-and-scripts/sub-track-proposal.md:30`: the refusal of a packet that is not NNN-slug (P2).
- `MP/tooling-and-scripts/spec-packet-relocation.md:27` and `:226`: a status 3 and late-step resume scenario (P2).
- `MP/tooling-and-scripts/sub-track-proposal.md:169`: feed the printed map to `relocate.mjs --map` (P2).
- `MP/retrieval/rg-archive-search.md:176`: check the path JSON record (P2).
- `FC/feature-catalog.md` and `MP/manual-testing-playbook.md`: index rows for any scenario or summary this phase changes.

### Out of Scope
- Pages both reviews found current: `FC/retrieval/rg-flood-control.md`, `FC/tooling-and-scripts/track-root-children-lists.md`, `FC/tooling-and-scripts/spec-validation-rule-engine.md` and `MP/tooling-and-scripts/spec-validation-archive-reach.md`.
- `SKILL.md`, references, READMEs, the changelog and the packet's own documents. Phase 013 owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `FC/tooling-and-scripts/spec-packet-relocation.md` | Modify | Exit 3, rewrite passes, source list |
| `FC/tooling-and-scripts/spec-lifecycle-automation.md` | Modify | Restore outcomes and mixed-track refusal |
| `FC/retrieval/rg-archive-search.md` | Modify | `archivedPaths` |
| `FC/tooling-and-scripts/sub-track-proposal.md` | Modify | Fourth no-map case |
| `MP/tooling-and-scripts/spec-packet-relocation.md` | Modify | Status 3 and resume scenario, source list |
| `MP/tooling-and-scripts/sub-track-proposal.md` | Modify | Preflight step |
| `MP/retrieval/rg-archive-search.md` | Modify | Path JSON check |
| `FC/feature-catalog.md`, `MP/manual-testing-playbook.md` | Modify | Index rows, only where a summary changed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The relocation page states all four exit statuses, with 3 as a landed run whose only failure is a moved packet's `RESULT: FAILED` | `rg -n 'Status 3|status 3' FC/tooling-and-scripts/spec-packet-relocation.md` prints a line, and it names `RESULT: FAILED` |
| REQ-002 | The lifecycle page says a restore whose relocate run exits 3 is reported as restored with a warning and exits 0, and names the mixed-track restore refusal | The restore paragraph no longer says every failed `relocate.mjs` run exits 1, and `rg -n 'flat packets' FC/tooling-and-scripts/spec-lifecycle-automation.md` prints a line |
| REQ-003 | The archive search page names `archivedPaths` in the path recipe's JSON record | `rg -n 'archivedPaths' FC/retrieval/rg-archive-search.md` prints a line, and the sentence that `paths` stays plain strings still holds |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The relocation page's rewrite step names the bare-name pass, the re-parent phase rows and the pre-archive id | `rg -n 'bare|pre-archive' FC/tooling-and-scripts/spec-packet-relocation.md` prints at least two lines |
| REQ-005 | The relocation catalog page and playbook scenario list `relocate-real-pipeline.vitest.ts` among their sources | `rg -c 'relocate-real-pipeline' FC/tooling-and-scripts/spec-packet-relocation.md MP/tooling-and-scripts/spec-packet-relocation.md` prints 1 or more for each |
| REQ-006 | The proposal catalog page lists the NNN-slug refusal as a fourth case with no map | The page's enumeration names four cases, matching `suggest-subtracks.mjs:296` |
| REQ-007 | The relocation playbook scenario covers exit 3 and a rerun after a failed late step | The scenario's Expected and Pass / Fail sections name exit 3 and `relocate: nothing to do` after the rerun |
| REQ-008 | The proposal playbook scenario feeds the printed map to the relocation preflight. `relocate.mjs` takes its specs root from its own location and has no `--specs` flag, so the step runs in a `mktemp` copy of the tooling with its own git repository and a track `graph-metadata.json`, as phase 006 built `SCRATCH` | The Commands section builds that copy and runs `relocate.mjs --map <printed map>` in it, and Expected names exit 1 with no refusal. Run once by hand, it prints that exit |
| REQ-009 | The archive search playbook scenario checks the path JSON record | Pass / Fail names `archivedPaths` in the `--json` output |
| REQ-010 | Each changed page passes the sk-doc validator for its kind | T013 runs `validate_document.py` and `validate-playbook-package.cjs`, the validators the two sk-doc SKILL.md files name, on every changed page, and each exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every catalog and playbook row of `../review/review-report.md` sections 3 and 4 is fixed, and each check in section 4 prints what it names.
- **SC-002**: The sk-doc validators exit 0 on every changed page, and this folder validates with `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 011's final behavior | High: pages written before it lands describe the old exit 3 and restore check | This phase starts after 011 is committed, and T001 re-reads the two scripts |
| Risk | A new scenario id collides with an existing one | Low: the playbook index points at the wrong scenario | T001 lists the existing ids and the new ones take the next free number |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The exact validator commands come from the two sk-doc SKILL.md files, which T001 reads.
<!-- /ANCHOR:questions -->

---
