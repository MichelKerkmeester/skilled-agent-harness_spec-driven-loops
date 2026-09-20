---
title: "Feature Specification: feature-catalog integrity"
description: "Feature catalogs across the repo drift because 92% of the 804-leaf corpus sits outside the only validator, the validated 8% is checked by four narrow check families rather than the standard's eight rules, and the default invocation exits 0 so nobody is required to read it. This phased parent settles the standard's open rulings, widens and hardens enforcement, then repairs the ten hub-root catalogs and the two large ungated surfaces so a reading agent is not misled."
trigger_phrases:
  - "feature catalog integrity"
  - "catalog drift remediation"
  - "validate catalog package coverage"
  - "hub catalog truth repair"
  - "feature catalog enforcement"
importance_tier: "high"
contextType: "planning"
parent: "sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phased parent from the track C deep-research synthesis"
    next_safe_action: "Scaffold child 001 and run its confirm-against-HEAD task"
    blockers:
      - "Q5 typed-spine rollout adjudication is owned by the 036 program, not this packet"
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions:
      - "Q1 does mcp-code-mode owe a feature catalog"
      - "Q3 staged or big-bang severity for the 104 orphan leaves"
      - "Q4 gate point and severity for the widened validator"
      - "Q5 who adjudicates typed-spine rollout state"
      - "Q7 phased parent or one Level 3 packet with three lanes"
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Feature-Catalog Integrity

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-doc` |
| **Governing Standard** | `.opencode/skills/sk-doc/sk-create-feature-catalog/` |
| **Evidence Source** | 10-iteration deep-research loop, track C, 42 active findings, 1 refuted |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature catalogs are the canonical inventory of what each skill does today, and agents read them to decide what
capabilities exist. They have drifted from the code in ways that make a reading agent act wrongly: a CLI hub that
advertises four executor packets against a registry of six, a prompt hub that names packet directories that no longer
exist, a fan-out leaf that lists three executor kinds and duplicates one of them against seven live kinds, an advisor
catalog that advertises a lifecycle-hook surface with no file behind it, and a transport hub whose blanket "never
mutates this workspace" wording contradicts its own registry. The structural reason is measurable and was confirmed on
the working tree on 2026-07-30: the repo holds **26 `feature-catalog/` packages with 804 leaves**, the only validator
covers **8 packages and 66 leaves** (8.2%), that validator runs **four narrow check families** rather than the
standard's eight rules, and its **default invocation exits 0** while reporting `FAIL: 19 violation(s)`.

### Purpose
Make the catalog standard enforceable first, then repair the catalogs. Child `001` settles the four rulings both
siblings depend on, widens the validator's covered set, adds the unenforced checks, and wires a real gate. Children
`002` and `003` then repair the ten hub-root catalogs and the two large ungated surfaces against those rulings, so the
repairs land on a corpus that can no longer silently re-rot.

### Non-Goals
- Changing how skill-advisor routing works. Catalogs do not drive advisor routing today; the standard states this
  explicitly, and the premise that they do is false as of this writing.
- Authoring an `mcp-code-mode` catalog. Child `001` owns only the applicability ruling.
- Any runtime behavior change. Every edit in `002` and `003` is documentation; `001` changes a validator and its wiring.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The catalog validator, its discovery rule, its check roster, its exit-code contract, and its gate wiring (`001`).
- Four rulings the standard leaves ambiguous: covered set, feature-leaf definition, description-parity strictness, and
  `mcp-code-mode` applicability (`001`).
- The ten researched hub-root catalogs: `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`,
  `sk-git`, `sk-prompt`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit` (`002`, plus `003` for the
  spec-kit surface).
- The two large surfaces outside every gate: `system-spec-kit/feature-catalog` (348 leaves) and the
  `system-deep-loop` nested `runtime/` and `deep-improvement/` catalogs (75 leaves) (`003`).
- All 42 active findings from the track C registry, each assigned to exactly one child.

### Out of Scope
- **The 14 nested packet catalogs nobody audited** (mcp-tooling x6, sk-design x3, deep-loop x4, sk-doc/sk-create-diff;
  313 leaves). No findings exist for them because no leaf examined them. `001`'s coverage widening subjects them to
  checks for the first time; measured exposure is 10 orphan leaves and 0 dangling links. This is the reason Q3 asks for
  staged severity rather than a big-bang flip.
- **Authoring an `mcp-code-mode` feature catalog.** A roughly 25-leaf authoring project. If Q1 answers "yes" it becomes
  a new child `004`; it is not folded into `002`.
- **Repo-wide catalog `trigger_phrases` harvesting.** That is a routing-architecture decision for
  `system-skill-advisor`, not a catalog-integrity packet.
- **`RC-008-02` (`memory_quick_search` obsolete parameter count).** Refuted at iteration 9 and confirmed repaired at
  HEAD. **Do not resurrect it.** It is excluded from the 42 and must not appear in any child scope table. If a future
  reader finds it in an older register, the disposition is "already fixed, verified, closed".
- Deep-loop **READMEs, SKILL.md, script contracts, and registry rosters** — owned by
  `system-deep-loop/036-deep-loop-innovation/032-docs-drift-and-p2-batch`. Zero file overlap with this packet, which
  owns `feature-catalog/**` only.
- Code **READMEs** under `system-deep-loop/runtime/**` — owned by `036/019-runtime-code-readmes`. Adjacent directory,
  disjoint files.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` | Modify | `001` | Discovery, check roster, exit-code contract |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md` | Modify | `001` | Ruling amendments |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-snippet-template.md` | Modify | `001` | Description-parity amendment |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/SKILL.md` | Modify | `001` | Covered-set and rules documentation |
| `.opencode/skills/sk-doc/shared/scripts/` | Create | `001` | Shared count-derivation helper and fixtures |
| `.opencode/skills/{9 hub roots}/feature-catalog/**` | Modify | `002` | Root and leaf repairs, four new leaves |
| `.opencode/skills/system-spec-kit/feature-catalog/**` | Modify | `002`, `003` | Prose path fix (`002` Lane A); full reconciliation (`003`) |
| `.opencode/skills/system-deep-loop/{feature-catalog,runtime/feature-catalog,deep-improvement/feature-catalog}/**` | Modify | `003` | Typed-spine labeling, derived rosters, metadata cleanup |

### Finding Assignment Roll-Up

| Destination | P1 | P2 | Total |
|-------------|----|----|-------|
| `001-catalog-enforcement-and-coverage` | 0 | 5 | 5 |
| `002-hub-catalog-truth-repair` | 10 | 18 | 28 |
| `003-large-surface-catalog-reconciliation` | 7 | 2 | 9 |
| **Total assigned** | **17** | **25** | **42** |
| Dropped | 0 | 0 | 0 |
| Refuted, excluded | — | — | 1 (`RC-008-02`) |

Registry total is 42 active. Assigned is 42. Balanced. Per-ID mapping lives in each child's `spec.md` scope table.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation
> details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-catalog-enforcement-and-coverage` | Rulings, validator widening, check gaps, gate wiring (Level 3) | Planned |
| 2 | `002-hub-catalog-truth-repair` | Ten hub-root catalogs: retired paths, stale rosters, four missing leaves, hygiene (Level 2) | Planned |
| 3 | `003-large-surface-catalog-reconciliation` | `system-spec-kit` 348 leaves and the `system-deep-loop` nested catalogs (Level 3) | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume sk-doc/023-feature-catalog-integrity/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.
- `002` Lane A (retired paths) is unblocked and may run in parallel with `001`. It is the measured 19 to 0 delta.
- `002` Lanes B-D and all of `003` wait on `001`'s rulings.
- `003` Lane B additionally holds on the Q5 adjudication, which is external to this packet.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001` | `002` | Description-parity strictness ruled; derived-assertion checks available | `decision-record.md` ADR-001 status Accepted; new checks have paired fixtures |
| `001` | `003` | Feature-leaf definition ruled; widened coverage includes both large packages | `expected_root_packages()` returns the ruled set; coverage test present |
| `002` Lane A | any | Validator violations go 19 to 0 on the hub packages | `validate_catalog_package.py --strict` exits 0 |
| external (036 owner) | `003` Lane B | Typed-spine per-module rollout state adjudicated | Adjudicated table recorded in `003/decision-record.md` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

Eight operator questions gate parts of this decomposition. Each child tags the elements that depend on one with an
`OPERATOR-DECISION (Qn)` marker. The synthesis recommendation is recorded here so a decision can be a yes/no rather
than an open design task.

- **Q1 — does `mcp-code-mode` owe a feature catalog?** Recommendation: no, the README stays canonical for now, but
  repair its two confirmed inaccuracies. Governs `RC-001-03`, `RC-007-07`. If yes, a new child `004` is created.
- **Q2 — leaf frontmatter `description`: literal equality with the root entry, or normalized?** Recommendation:
  literal for `title` (already the standard's rule), normalized for `description`, and amend the template to say so.
  Governs five findings in `002` Lane D.
- **Q3 — widening surfaces 104 orphan-leaf violations at once. Staged or big-bang?** Recommendation: staged, with
  per-package severity (a package enters at `warn` and promotes to `fail` when clean).
- **Q4 — where does the gate run and at what severity?** Recommendation: CI on `skilled/v*` at `fail` for promoted
  packages, plus a `/doctor` route for local runs. Not pre-push initially until runtime over 804 leaves is measured.
- **Q5 — who adjudicates the rollout state of each `system-deep-loop` typed-spine module?** Recommendation: the 036
  program owner, not this packet. `003` produces the candidate table with evidence and requests adjudication. This is
  the single hard external dependency in the decomposition.
- **Q6 — volatile values: ban from catalog prose, or generate plus freshness-check?** Recommendation: generate for
  structural rosters (executor lists, tool inventories), ban for measurement snapshots (test counts).
- **Q7 — phased parent with three children, or one Level 3 packet with three lanes?** Recommendation: phased parent.
  The complexity read is approximately 26-29 against a threshold of 25, which is over the line but not comfortably. If
  the operator scores below 25, collapse to one Level 3 packet with three lanes; the content is unchanged.
- **Q8 — should validator discovery switch from `hub-router.json` to `feature-catalog/` presence, or should `sk-git`
  and `system-spec-kit` be added by name?** Recommendation: switch to presence. Naming exceptions is how the current
  gap was created.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md, checklist.md
- **Governing standard**: `.opencode/skills/sk-doc/sk-create-feature-catalog/SKILL.md` and its `assets/` templates
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
