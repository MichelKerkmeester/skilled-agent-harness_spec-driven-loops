---
title: "Feature Specification: Phase 009 — README Alignment (Hub + Sub-Skills)"
description: "Planned Level 2 specification for bringing sk-design's hub README.md and all five mode-packet README.md files up to date with the post-parity-refactor reality shipped by Phases 002-005: hub manager-shell behavior, the private procedure-card layer, the mode-packet refactor, and the extended benchmark and playbook."
trigger_phrases:
  - "readme alignment"
  - "sk-design readme alignment"
  - "hub readme update"
  - "mode packet readme"
  - "procedure card readme gap"
importance_tier: "normal"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/009-readme-alignment"
    last_updated_at: "2026-07-06T05:10:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Verified all six README edits; validator and canon check pass clean"
    next_safe_action: "Start Phase 010 feature-catalog-completeness"
---
# Feature Specification: Phase 009 — README Alignment (Hub + Sub-Skills)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-06 |
| **Completed** | 2026-07-06 |
| **Phase Folder** | `.opencode/specs/sk-design/009-sk-design-claude-parity/009-readme-alignment/` |
| **Parent Packet** | `.opencode/specs/sk-design/009-sk-design-claude-parity/` |
| **Writable Scope Planned** | The six README.md files named in Section 3, plus this Phase 009 folder |
| **Depends On** | `008-smart-routing-optimization/` closed for the routing-language gate (see REQ-001); content source of truth (Phases 001-005) is already closed |

<!-- /ANCHOR:metadata -->
---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../008-smart-routing-optimization/spec.md |
| **Successor Phase** | ../010-feature-catalog-completeness/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-design`'s hub `README.md` and its five mode-packet `README.md` files describe a snapshot of the skill that predates Phases 002-005. Verified, file-level evidence of drift as of this authoring pass:

- **Hub `README.md` never mentions `benchmark/` or `manual_testing_playbook/`.** Both directories exist at the hub root (`benchmark/baseline/`, `benchmark/after-009/`, and `manual_testing_playbook/` with six categories and 24 numbered scenarios, `MR-001` through `PB-003`), and the strict parent-skill canon checker (`node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design`, checks `9a`/`9b`) treats both as required hub artifacts. The hub README's `RELATED DOCUMENTS` table carries only four rows: `SKILL.md`, `mode-registry.json`, `design-interface/SKILL.md`, and `changelog/v1.2.0.0.md`.
- **None of the five mode-packet READMEs mention `procedures/`.** `mode-registry.json` already declares a `proceduresPath` field for every one of the five modes (for example `"proceduresPath": "design-md-generator/procedures"`), and 14 procedure-card files exist on disk: 6 under `design-interface/procedures/`, 3 under `design-foundations/procedures/`, 2 under `design-audit/procedures/`, 1 under `design-motion/procedures/`, 1 under `design-md-generator/procedures/`, plus 1 shared card at `shared/procedures/polish_gate_orchestration.md`. No mode README's `RELATED DOCUMENTS` or `HOW IT WORKS` section names its own `procedures/` folder or any card inside it.
- **`design-motion/README.md`'s VERIFICATION section is factually stale.** It states "Eight scenarios across decision, strategy, presence, reduced-motion and micro-interaction categories," but `design-motion/manual_testing_playbook/manual_testing_playbook.md` Section 1 Overview table lists 10 scenario rows (`MOTION-STRATEGY-001..003`, `MOTION-PRESENCE-001..002`, `MOTION-REDUCED-001..002`, `MOTION-MICRO-001`, `MOTION-DECISION-001`, `MOTION-ADVANCED-001`) across six categories, including a `advanced-craft` category the README's category list never names.
- **`design-md-generator/README.md` ships with no YAML frontmatter at all.** It starts directly at `# md-generator` with no `title`, `description`, `trigger_phrases`, or `version` block, unlike its four sibling mode READMEs (which all carry a frontmatter block matching `sk-doc`'s `skill_readme_template.md` scaffold) and unlike the hub README.
- **Hub `README.md` Section 4 ("Private procedure support") does not cite the actual Phase 002 hub-shell contract names.** `SKILL.md` Section 2 defines `Manager Intake Before Routing`, `Visible Plan Before Design or Build Work`, and `Proof Gates and Verifier Cadence`, and Section 7 states the transport-vs-taste separation; the README's current prose gestures at private procedure support generically but never names these sections or headings, so a reader cannot cross-check the README claim against the runtime contract it describes.

### Purpose

This phase brings the hub `README.md` and the five mode-packet `README.md` files (`design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`) into agreement with the shipped Phase 002-005 reality, using `sk-doc`'s `readme_template.md` / `skill_readme_template.md` as the structural template. It documents current state only: no packet numbers, phase IDs, or migration narration land in the READMEs themselves, per the template's own "current-state only" writing rule.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit and update `.opencode/skills/sk-design/README.md` (hub) to reference `benchmark/` and `manual_testing_playbook/`, and to name the Phase 002 hub-shell contract headings by their real `SKILL.md` section numbers.
- Audit and update `.opencode/skills/sk-design/design-interface/README.md` to reference its `procedures/` folder (6 cards).
- Audit and update `.opencode/skills/sk-design/design-foundations/README.md` to reference its `procedures/` folder (3 cards).
- Audit and update `.opencode/skills/sk-design/design-motion/README.md` to reference its `procedures/` folder (1 card) and correct the VERIFICATION section's scenario count and category list to match the live playbook.
- Audit and update `.opencode/skills/sk-design/design-audit/README.md` to reference its `procedures/` folder (2 cards).
- Audit and update `.opencode/skills/sk-design/design-md-generator/README.md` to add a YAML frontmatter block (title, description, trigger_phrases, version) matching sibling convention, and to reference its `procedures/` folder (1 card).
- Re-run `sk-doc`'s README validator and the parent-skill canon checker after every edit to confirm structural and canon compliance.

### Out of Scope
- Editing any `SKILL.md`, `mode-registry.json`, `hub-router.json`, `procedures/**` content file, `shared/**` content file, `benchmark/**` content file, or `manual_testing_playbook/**` content file. This phase edits only the six named `README.md` files.
- Changing what the hub or any mode actually does. This phase documents shipped behavior; it does not add, remove, or alter behavior.
- Editing `changelog/**`. Adding a changelog entry for the README pass, if wanted, is a decision for the implementer to raise, not a requirement of this phase.
- Editing any file under `.opencode/specs/sk-design/009-sk-design-claude-parity/` other than this `009-readme-alignment/` folder, including the parent `spec.md`, sibling phase folders (`001` through `005`, and any concurrently authored `006`-`013` phase folders), `external/**`, or `research/**`.
- Feature-catalog work for `sk-design` (that is Phase 010, the named successor).
- Dispatching sub-agents or nested Task execution.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/README.md` | Update (planned) | Add `benchmark/` and `manual_testing_playbook/` references; name the Phase 002 hub-shell contract headings by section |
| `.opencode/skills/sk-design/design-interface/README.md` | Update (planned) | Add a `procedures/` reference (6 cards) to `RELATED DOCUMENTS` and, if warranted, `HOW IT WORKS` |
| `.opencode/skills/sk-design/design-foundations/README.md` | Update (planned) | Add a `procedures/` reference (3 cards) |
| `.opencode/skills/sk-design/design-motion/README.md` | Update (planned) | Add a `procedures/` reference (1 card); correct the stale scenario count and category list in VERIFICATION |
| `.opencode/skills/sk-design/design-audit/README.md` | Update (planned) | Add a `procedures/` reference (2 cards) |
| `.opencode/skills/sk-design/design-md-generator/README.md` | Update (planned) | Add missing YAML frontmatter; add a `procedures/` reference (1 card) |
| `spec.md` | Created | This specification |
| `plan.md` | Created | Implementation plan for the README pass |
| `tasks.md` | Created | Task breakdown for audit, drafting, and verification |
| `checklist.md` | Created | P0/P1/P2 verification checklist, unchecked pending implementation |
| `description.json` | Regenerated | Discovery metadata for this phase packet, generated last |
| `graph-metadata.json` | Regenerated | Graph metadata and source hashes for this phase packet, generated last |

### README Alignment Findings

| File | Current State (verified) | Required Update | Evidence |
|------|---------------------------|------------------|----------|
| `README.md` (hub) | No mention of `benchmark/` or `manual_testing_playbook/` anywhere | Add both to `RELATED DOCUMENTS`, with the scenario/category counts and the benchmark verdict fields a reader would expect | `grep -n "benchmark\|manual_testing_playbook" .opencode/skills/sk-design/README.md` returns no match |
| `README.md` (hub) | Section 4 names "Private procedure support" generically | Cite `SKILL.md` Section 2 (`Manager Intake Before Routing`, `Visible Plan Before Design or Build Work`, `Proof Gates and Verifier Cadence`) and Section 7 (transport-vs-taste) by section number | `.opencode/skills/sk-design/SKILL.md` Section 2 and Section 7 headings, read directly |
| `design-interface/README.md` | No `procedures/` reference | Add `procedures/` (6 cards: `aesthetic_direction.md`, `deck_direction_spec.md`, `discovery_question_round.md`, `prototype_flow_spec.md`, `variation_set.md`, `wireframe_exploration.md`) | `find .opencode/skills/sk-design/design-interface/procedures -maxdepth 1 -type f` lists 6 files; README has zero matches for `procedures/` |
| `design-foundations/README.md` | No `procedures/` reference | Add `procedures/` (3 cards: `component_system_inventory.md`, `hierarchy_rhythm_review.md`, `tweakable_design_controls.md`) | `find .opencode/skills/sk-design/design-foundations/procedures -maxdepth 1 -type f` lists 3 files |
| `design-motion/README.md` | No `procedures/` reference; VERIFICATION claims "Eight scenarios" across 5 named categories | Add `procedures/` (1 card: `interaction_states_pass.md`); correct to 10 scenarios across 6 categories, naming `advanced-craft` | `design-motion/manual_testing_playbook/manual_testing_playbook.md` Section 1 Overview table lists 10 `MOTION-*` rows across 6 categories |
| `design-audit/README.md` | No `procedures/` reference | Add `procedures/` (2 cards: `accessibility_audit.md`, `ai_slop_check.md`) | `find .opencode/skills/sk-design/design-audit/procedures -maxdepth 1 -type f` lists 2 files |
| `design-md-generator/README.md` | No YAML frontmatter at all; no `procedures/` reference | Add frontmatter (title, description, trigger_phrases sourced from `mode-registry.json`'s `md-generator` `aliases`, version); add `procedures/` (1 card: `design_system_extraction.md`) | File starts at line 1 with `# md-generator`, no `---` frontmatter fence; `mode-registry.json` lines 114-131 carry the `md-generator` entry with an `aliases` array and a `proceduresPath` field |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Evidence |
|----|-------------|---------------------|
| REQ-001 | Phase 008 gate closes before implementation begins | Phase 008 `checklist.md` records its gate status closed, so the hub README's routing-behavior language matches the final post-008 routing contract rather than a pre-008 snapshot |
| REQ-002 | Hub README documents `benchmark/` and `manual_testing_playbook/` | Hub `README.md` `RELATED DOCUMENTS` (or an added section) links both paths with a one-line description of what each holds |
| REQ-003 | Each of the five mode READMEs documents its own `procedures/` folder | Each mode `README.md` names its `procedures/` folder and lists (or links) its cards, sourced from a live `find`/`Glob` of that mode's `procedures/` directory at implementation time |
| REQ-004 | `design-motion/README.md`'s scenario count and category list match the live playbook | VERIFICATION section states the scenario count and category names the implementer reads directly from `design-motion/manual_testing_playbook/manual_testing_playbook.md` Section 1 at implementation time, not the count in this spec (which could drift before implementation starts) |
| REQ-005 | `design-md-generator/README.md` gains a YAML frontmatter block | File opens with a `---` frontmatter fence carrying `title`, `description`, `trigger_phrases`, and `version`, matching the shape used by the other four mode READMEs |
| REQ-006 | Hub README cites the actual Phase 002 hub-shell contract section names | Hub `README.md` names `Manager Intake Before Routing`, `Visible Plan Before Design or Build Work`, `Proof Gates and Verifier Cadence`, and the transport-vs-taste separation by the `SKILL.md` section they live in, verified against the live file at implementation time |
| REQ-007 | No non-README file is edited | `git diff --name-only` for this phase's implementation pass lists only the six `README.md` files plus this phase folder's own docs and metadata |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Evidence |
|----|-------------|---------------------|
| REQ-008 | Each edited README's version marker is bumped where one exists | Frontmatter `version` (hub and the four mode READMEs that already carry one) increments per the project's existing patch/minor convention; `design-md-generator`'s new frontmatter starts at a first version |
| REQ-009 | Every new or edited link resolves on disk | Each `procedures/`, `benchmark/`, and `manual_testing_playbook/` path named in an edited README is confirmed to exist via `Read` or `Glob` before the README ships |
| REQ-010 | README structure validates with zero issues | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` reports zero issues for each of the six edited files |
| REQ-011 | Parent-skill canon check remains a clean pass | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` still exits 0 with 0 failures and 0 warnings after the README edits |
| REQ-012 | Human Voice Rules pass on every edited README | No em dashes, no semicolons, no Oxford commas, no banned words, and no setup phrases in any newly written or edited passage |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| Criterion | Result |
|-----------|--------|
| **SC-001** Phase 009 docs and metadata exist and validate as a Level 2 child packet | Met; `validate.sh --strict` passes for this folder (Errors: 0) |
| **SC-002** Implementation waits for Phase 008 closure | Met; Phase 008 `checklist.md` Gate Status CLOSED before the README edits landed |
| **SC-003** Hub README names `benchmark/` and `manual_testing_playbook/` | Met; `.opencode/skills/sk-design/README.md` lines 102-103 |
| **SC-004** All five mode READMEs name their own `procedures/` folder | Met; confirmed by grep in all five mode READMEs |
| **SC-005** `design-motion/README.md`'s scenario claim matches the live playbook | Met; 10 scenarios across 6 categories, matches the live playbook table exactly |
| **SC-006** `design-md-generator/README.md` carries a frontmatter block matching sibling convention | Met; frontmatter added with title/description/trigger_phrases/version |
| **SC-007** README validator and parent-skill canon checker both pass after the edits | Met; validator reports 0 issues for all six files, canon checker exits 0 with 0 warnings |

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Current State | Mitigation |
|------|------|----------------|------------|
| Dependency | Phase 008 gate closure | Not yet reached; Phase 008 folder does not exist on disk at authoring time | Do not start implementation until Phase 008's checklist records a closed gate; re-read the live hub `SKILL.md` and `mode-registry.json` immediately before drafting so the README reflects post-008 routing, not this spec's snapshot |
| Dependency | Phases 001-005 content source of truth | Closed | Read the live hub/mode files at implementation time rather than trusting this spec's counts, since sibling phases (`011-manual-testing-playbook-alignment`, and others) may still be landing content concurrently |
| Risk | Concurrent sibling phase authoring | `011-manual-testing-playbook-alignment/` and `013-design-commands-asset-refactor/` exist as empty folders at authoring time, created by parallel work on the same parent packet | This phase writes only inside `009-readme-alignment/` and the six named README files; it does not read from or write to those sibling folders |
| Risk | Procedure-card language could read as a public taxonomy | Existing hub README already frames procedure cards as maintainer-facing internal support (Section 4, "Private procedure support") | New mode-README language must match that framing: name the folder and card count, never present cards as a user-selectable menu |
| Risk | README edits regress the parent-skill canon check | Canon check currently passes with 0 failures, 0 warnings | Re-run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` after every README edit, not only at the end |
| Risk | `design-md-generator` frontmatter trigger_phrases could contradict `mode-registry.json`'s registered aliases | Registry already lists 12 aliases for `md-generator` | Source the frontmatter `trigger_phrases` from a subset of the registry's own `aliases` array rather than inventing new phrasing |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Traceability
- **NFR-T01**: Every README claim about `procedures/`, `benchmark/`, or `manual_testing_playbook/` traces to a file or directory the implementer confirms exists at implementation time.
- **NFR-T02**: Every claim about hub-shell behavior (intake, visible plan, proof gates, verifier cadence, transport-vs-taste) traces to the specific `SKILL.md` section it lives in.

### Maintainability
- **NFR-M01**: README changes stay within `sk-doc`'s `readme_template.md` / `skill_readme_template.md` section model; no ad hoc section shapes are introduced.
- **NFR-M02**: Procedure-card mentions stay maintainer-facing, matching the hub README's existing "Private procedure support" framing, so no README accidentally exposes a public procedure-card taxonomy.

### Safety
- **NFR-S01**: No `SKILL.md`, `mode-registry.json`, `hub-router.json`, `procedures/**`, `shared/**`, `benchmark/**`, or `manual_testing_playbook/**` content file is edited by this phase.
- **NFR-S02**: Rollback requires non-destructive diff/status inspection first and explicit approval before any destructive recovery.

### Verification
- **NFR-V01**: `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` is run for each of the six edited files.
- **NFR-V02**: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` is run after the edits and must still exit 0 with 0 failures and 0 warnings.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **`shared/procedures/polish_gate_orchestration.md` belongs to no single mode**: This shared-level card is not owned by any one of the five mode packets. The implementer decides whether it belongs in the hub README's `RELATED DOCUMENTS` (as a shared resource) rather than any single mode README, and records that decision instead of silently dropping it or double-listing it under every mode.
- **`design-motion`'s scenario count could change again before implementation**: This spec cites 10 scenarios across 6 categories as observed at authoring time. The implementer must re-read `design-motion/manual_testing_playbook/manual_testing_playbook.md` Section 1 live, not copy this spec's number, since sibling phase `011-manual-testing-playbook-alignment` may still be landing playbook changes concurrently.
- **`mode-registry.json` is read-only evidence, not an editable target**: Any frontmatter `trigger_phrases` added to `design-md-generator/README.md` must be sourced from reading the registry's `aliases` array, never by editing the registry itself.

### Error Scenarios
- **README validator fails**: Fix only the file that failed and re-run the single-file validator command; do not touch a sibling README to chase an unrelated warning.
- **Parent-skill canon check regresses**: Stop, diff the specific README edit against the failing check number (for example `9a`/`9b`), and revert only that edit before re-running the checker.
- **A cited path does not resolve**: Treat this as a logic-sync signal between this spec and the live tree; re-verify with `Read` or `Glob` before writing the claim into a README.

### Concurrent Operations
- **Sibling phase folders exist as empty directories**: `011-manual-testing-playbook-alignment/` and `013-design-commands-asset-refactor/` are mid-authoring by parallel work on the same parent packet. This phase does not read from, write to, or depend on their contents.
- **Unrelated worktree dirt**: Preserve any pre-existing uncommitted changes outside the six named README files and this phase folder.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

No open questions block closing this planning pass. The questions below gate the later implementation "go" signal.

### Resolved Questions and Decisions

| Question | Resolution |
|----------|------------|
| What Phase 008 evidence is the implementation go signal? | Phase 008's `checklist.md` recording gate status closed, and its `implementation-summary.md` (once it exists) not naming this phase as blocked. |
| Which commands prove README structural and canon compliance? | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` per file, plus `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` for the whole hub. |
| Where does `shared/procedures/polish_gate_orchestration.md` get documented? | Left to the implementer to decide and record, most likely in the hub README's `RELATED DOCUMENTS`, since it is not scoped to one mode. |
| Who owns release/threshold decisions for the later implementation run? | Repository owner, delegated to whichever session performs the implementation, matching the delegation pattern used by the prior phases in this packet. |

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Packet**: `../spec.md`
- **Predecessor Phase**: `../008-smart-routing-optimization/` (not yet created at authoring time)
- **Successor Phase**: `../010-feature-catalog-completeness/` (not yet created at authoring time)
- **Structural Template Examples**: `../002-parent-hub-compatibility-shell/`, `../003-private-procedure-card-layer/`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`

<!-- /ANCHOR:related-docs -->
