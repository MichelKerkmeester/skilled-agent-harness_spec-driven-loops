---
title: "Feature Specification: Code README coverage per the sk-doc standard"
description: "A ten-iteration read-only audit of 501 durable code-bearing directories found this repo does not have a code-README coverage problem: it has a README truthfulness problem and a standard-ambiguity problem. This phased packet settles the governing standard and makes it mechanically checkable, repairs the READMEs that are false or absent, and sweeps the remaining structural and durability nonconformances."
trigger_phrases:
  - "code readme coverage"
  - "code readme standard"
  - "readme directory tree requirement"
  - "readme truthfulness audit"
importance_tier: "high"
contextType: "planning"
parent: "sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-code-readme-coverage"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the phase-parent spec from the track-A research synthesis"
    next_safe_action: "Answer OPERATOR-DECISION Q1-Q5, then scaffold child 001"
    blockers:
      - "Q1 tree-vs-table ruling gates child 003 authoring"
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions:
      - "Q1 — does a complete CONTENTS/FILES table satisfy the multi-file Directory Tree requirement?"
      - "Q2 — do the General README format rules bind code-folder READMEs?"
      - "Q3 — is content-defined equivalent orientation acceptable in place of a README.md?"
      - "Q4 — should 019 widen from runtime/** to the whole system-deep-loop skill?"
      - "Q5 — phased parent with 3 children, or one standard Level-3 packet with 3 lanes?"
      - "Q6 — is the 003 mechanical sweep worth doing at its post-ruling survivor count?"
    answered_questions:
      - "Applicability is need-based, not census-based (SKILL.md:37, :140-150, :245)"
      - "The dedupe line against 036/019 is the literal runtime/** path prefix"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — child folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Code README Coverage Per The sk-doc Standard

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/022-code-readme-coverage |
| **Level** | 2 (phase parent) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `sk-doc` |
| **Owner skill** | sk-doc, which owns the create-readme standard and the document validator |
| **Evidence base** | Track-A deep-research loop, 10 iterations, 152 active findings, 501-dir frozen manifest |
<!-- /ANCHOR:metadata -->

> **[OPERATOR-DECISION: Q5 — phased parent vs single packet]** This packet is authored as a phased parent with three children. If the operator scores phase complexity below 25/50, collapse to one standard Level-3 packet with three work-unit lanes; the content below is unchanged, only the container differs. See MANIFEST for the collapse mapping.

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three separate defects share one root cause: nothing mechanically enforces the code-README standard, and the standard itself is ambiguous about what it requires.

1. **The standard contradicts itself.** `sk-create-readme/SKILL.md` forbids TOCs and anchor comments; `shared/references/hvr-rules.md` requires both. The format block that carries the tagline, numbering, casing and separator rules is titled "General README format rules" and §6 (code-folder output shape) never restates it, so every heading and separator finding rests on an inference. The code template ships YAML frontmatter while the SKILL calls frontmatter optional.
2. **Nothing can detect the defect class.** `validate_document.py` runs exactly three checks for a README (TOC, H2 case, required sections) and has no Directory-Tree rule. `audit_readmes.py` cannot discover a *missing* README at all — it scans only the repo-root README and `.opencode/**`, so `.claude`, `.pi`, `.github` and `scripts/` are invisible to it.
3. **READMEs make false claims.** A reader following them runs commands that fail and looks for files that do not exist: an install-scripts README advertising nine installers where six exist behind a broken symlink, a test README claiming three suites where nineteen live, a workflows README documenting a removed CI job while three live guards go undocumented.

Coverage itself is *not* the problem. Of 501 durable code-bearing directories, 122 lack a local README, but the need-based applicability rule in the standard exempts almost all of them. After the folders already scoped to `036/019` and the applicability exclusions, the confirmed missing-README set across the whole non-runtime repo is **three folders**.

### Purpose

Settle the standard, make it mechanically checkable, repair the READMEs that mislead a reader, and sweep the residual structural and durability nonconformances — in that order, because the ruling in child `001` is the oracle every later child is verified against.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The authoring standard for code-folder READMEs: the Directory-Tree requirement, the applicability of the general format rules, and the `hvr-rules.md` contradiction.
- Enforcement: an opt-in code-folder mode in `validate_document.py`, and manifest-driven discovery across all repository roots in `audit_readmes.py`.
- The READMEs that are false, non-runnable, or absent where the applicability rule genuinely demands one.
- The homogeneous structural and durability sweep across ~85 existing, substantively-accurate code READMEs in ten skill hubs plus `.opencode/bin`, `hooks`, `plugins`, `scripts`, `install-guides`, `.github/workflows` and `.pi`.

### Out of Scope

- `.opencode/skills/system-deep-loop/runtime/**` — owned by `system-deep-loop/036-deep-loop-innovation/019-runtime-code-readmes`. This packet contributes an amendment (14 defects in existing runtime READMEs plus a dependency edge) and nothing more. **[OPERATOR-DECISION: Q4 — 019 scope width]**
- `.opencode/specs/**` (4,494 scratch dirs) — excluded from the frozen manifest; no categorical README obligation.
- Content drift in `system-deep-loop` mode-root READMEs — owned by WS1 child `032-docs-drift-and-p2-batch`. Two coordination points are recorded per child; WS1's facts are never re-derived here.
- A repo-wide HVR sweep. Child `001` removes only the `hvr-rules.md` contradiction that affects README audits.

### Files to Change

Summary only; per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/sk-create-readme/SKILL.md` | Modify | 001 | Codify the tree ruling and the scope of the format rules in §6 |
| `.opencode/skills/sk-doc/sk-create-readme/assets/readme-code-template.md` | Modify | 001 | Align the scaffold with the ruling (frontmatter, tagline, tree) |
| `.opencode/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py` | Modify | 001 | Manifest-driven discovery across all repo roots plus codified exclusions |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Modify | 001 | Opt-in code-folder README mode |
| `.opencode/skills/sk-doc/shared/references/hvr-rules.md` | Modify | 001 | Remove or scope away the anchor/TOC contradiction |
| `.opencode/skills/sk-doc/shared/assets/template-rules.json` | Modify | 001 | Machine rules for the code-folder mode |
| `.opencode/skills/sk-doc/scripts/tests/**` | Create | 001 | Negative-fixture corpus, one per defect class |
| ~20 existing README.md files | Modify | 002 | Re-derive false claims and stale inventories from source |
| 3 new README.md files | Create | 002 | `sk-design/shared/authored-brand`, `system-spec-kit/scripts/runtime-mirrors`, `system-skill-advisor/mcp-server/scripts/command-bridges` |
| ~85 existing README.md files | Modify | 003 | Structural conformance and durability strip across four lanes |

### Dispositions — findings carried here with no work item

Twenty-three finding IDs are recorded at parent level so nothing is silently dropped. They generate no task in any child.

**Census exclusions (21).** Correct rows of the raw 122-candidate census that the need-based applicability rule exempts. They are the derivation corpus for `001`'s codified path-class exclusions and each should appear as an exclusion test case in the auditor fixtures.

| ID | Path class | Reason |
|----|-----------|--------|
| `RA-001-05` | fixture payload | `bin/tests/fixtures/no-spec-import/negative` — single fixture input; parent `bin/README.md` documents the owning test surface |
| `RA-001-06` | fixture payload | `.../no-spec-import/positive` — the fixture file itself states it is never wired into a runtime path |
| `RA-001-07` | benchmark fixture | `fixtures/**/seed/scripts` — one `check.cjs` of benchmark input, not a module root |
| `RA-001-08` | equivalent orientation | `.claude` — `SYNC.md:8-41` supplies full runtime-root orientation. **[OPERATOR-DECISION: Q3 — equivalent orientation]** |
| `RA-002-18` | parent-documented | `sk-design-interface/scripts/tests` — parent names `tests/`, all three files, and the pytest command |
| `RA-003-03` | parent-documented | `spec-kit/mcp-server/hooks/lib` — one file, named in the parent tree and Key Files |
| `RA-003-04` | parent-documented | `.../hooks/lib/workspace` — single-file child under a parent-documented boundary |
| `RA-003-05` | parent-documented | `.../hooks/pi/lib` — one file, named and explained in the parent's file table |
| `RA-005-02` | benchmark fixture | Bundle-gate fixture seed script covered by the benchmark README |
| `RA-005-03` | benchmark fixture | Acceptance fixture `seed/src` — specimen input, not a maintained module API |
| `RA-005-04` | benchmark fixture | `fix-001-hallucinated-cli-flag/seed` — bounded evaluator fixture payload |
| `RA-005-05` | benchmark fixture | `fix-002-wrong-cwd-paths/seed` — single-file fixture payload |
| `RA-005-06` | benchmark fixture | `fix-005-acceptance-strict/seed/src` — fixture payload |
| `RA-005-07` | benchmark fixture | `fix-007-baseline-pure-function/seed/src/utils` — fixture payload |
| `RA-005-08` | fixture-owned README | `fix-006-adversarial-path-traversal/seed/README.md` — must be path-excluded from conformance scoring, else the validator scores its own test input |
| `RA-006-01` | generated output | `bin/lib/compiled-routing/**` — `bin/lib/README.md:58` states it deliberately carries no README; hand edits are erased on republication |
| `RA-006-02` | fixture payload | `bin/tests/fixtures/no-spec-import` parent — consumed by `compiled-routing-foundation.vitest.ts` |
| `RA-006-03` | fixture payload | `commands/create/assets/tests/fixtures` — a single JSON payload bound as `FIXTURE_PATH` |
| `RA-007-08` | parent-documented | `.opencode/hooks/**` children (24 dirs) — `hooks/README.md:45-90` maps every child |
| `RA-007-09` | equivalent orientation | `.claude/SYNC.md` — a README would duplicate it. **[OPERATOR-DECISION: Q3 — equivalent orientation]** |
| `RA-007-10` | self-documenting | `scripts/` — exactly one script, self-documenting at `setup-maintainer-filters.sh:1-10` |

**Refuted (2).** Do not resurrect under these IDs.

| ID | Status |
|----|--------|
| `RA-005-10` | Refuted. `mcp-aside-devtools/examples/README.md:25-83` names all three scripts with invocation contracts; it lacks tree *syntax*, not navigation. Re-enters `003-C` as a narrow missing-tree item **only if** Q1 rules fenced trees mandatory. **[OPERATOR-DECISION: Q1 — tree vs table]** |
| `RA-005-12` | Refuted. `mcp-click-up/examples/README.md:68-169` navigates both scripts. It does carry a prohibited TOC; that residual defect is real but is not the recorded finding. File it fresh in `003-C` rather than reviving this ID. |

**Analysis, not file defects (3).** `RA-003-06`, `RA-005-41`, `RA-009-01` are inputs to `001`'s ruling. Their remedy is a decision record, not an edit. They are listed in `001`'s scope table and must not generate per-file tasks.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-code-readme-standard-and-enforcement` | Settle the standard; make it mechanically checkable. Produces the oracle. Level 3, 9 findings + `NEW-A1` | Planned |
| 2 | `002-code-readme-truth-and-missing-orientation` | READMEs that are false, non-runnable, or genuinely absent. Level 2, 20 findings (8 P1) | Planned |
| 3 | `003-code-readme-structure-and-durability-sweep` | Four-lane structural conformance and durability strip. Level 3, 88 findings | Planned |

External sibling, amended not created: `system-deep-loop/036-deep-loop-innovation/019-runtime-code-readmes` gains 14 findings, one requirement (R5), and a hard dependency on `001`.

### Phase Transition Rules

- Each phase MUST pass `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` independently before the next phase begins.
- `001` is a **hard gate** on `003` and on the `019` amendment. Do not author `003`'s task list before `001`'s ruling lands — 26 of its findings dissolve outright and ~50 shrink if the ruling goes one way.
- `001` is a **soft gate** on `002`: classes (a) and (b) are ruling-independent and may run concurrently with `001`; class (c), the three new READMEs, waits for the ruling to know what tree shape to author.
- Parent spec tracks aggregate progress via this map.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 (class c) | Tree-equivalence and format-applicability rulings recorded in `001/decision-record.md` | The 3 new READMEs pass `001`'s code-folder validator mode |
| 001 | 003 | Ruling recorded AND the code-folder validator mode ships green over its fixture corpus | `003` Task 1 re-triage publishes a surviving finding count before `tasks.md` is authored |
| 001 | 019 (amend) | Ruling recorded AND the manifest-driven auditor ships | `019` R1 becomes verifiable; R4 coverage check runs off `001`'s manifest |
| 002 | 003 | Truth defects fixed, so the sweep is purely structural | `003`'s no-truth-drift gate finds nothing to escalate back |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Q1 — Directory Tree.** Does a complete `CONTENTS`/`FILES`/`Key Files` table satisfy the multi-file Directory Tree requirement, or is fenced tree syntax mandatory? Controls 76 of 88 findings in `003`; 26 dissolve outright if tables count. *Research recommendation: require the fenced tree only where it carries information a table cannot — mandatory when the folder has subdirectories or layering, satisfied by a complete table when the folder is flat. Codify it; do not leave it to reviewer taste.*
- **Q2 — Format-rule applicability.** Do the "General README format rules" at `SKILL.md:217-229` bind code-folder READMEs? *Research recommendation: yes for numbering, casing, separators, fences and no-TOC; no for the blockquote tagline. State it explicitly in §6.*
- **Q3 — Equivalent orientation.** Is `SYNC.md`-style orientation acceptable in general, defined by required content rather than filename? *Research recommendation: yes, content-defined — the auditor accepts a designated orientation file supplying Overview plus inventory, and records the exemption rather than reporting a false gap.*
- **Q4 — 019 width.** Should `019` widen from `runtime/**` to the whole `system-deep-loop` skill, absorbing lane `003-B` (29 findings)? *Research recommendation: no — keep `019` at `runtime/**`; `deep-*/scripts/**` and `shared/**` are ordinary hub docs whose fix shape matches the other three lanes.*
- **Q5 — Container.** Phased parent with three children, or one standard Level-3 packet with three lanes? *Research recommendation: phased parent; complexity scored ~28-32 against a 25 threshold, level 3.*
- **Q6 — Is `003` worth it?** Every one of its 88 findings is P2 and none makes a reader do something wrong. *Research recommendation: do `001` + `002` unconditionally; gate `003` on the post-ruling survivor count, and if survivors stay near 88 consider shipping only the durability grep gate rather than repainting 85 files.*
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Amended sibling**: `.opencode/specs/system-deep-loop/036-deep-loop-innovation/019-runtime-code-readmes/`
- **Coordinating packet**: WS1 child `032-docs-drift-and-p2-batch` (system-deep-loop mode-root README content drift)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
