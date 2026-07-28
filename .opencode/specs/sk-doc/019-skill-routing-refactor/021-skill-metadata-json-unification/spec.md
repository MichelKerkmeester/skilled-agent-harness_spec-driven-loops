---
title: "Feature Specification: Skill Root Metadata JSON Unification"
description: "Establish one documented class-based contract for every root-level skill metadata JSON (description, graph-metadata, leaf-manifest, leaf-aliases, leaf-manifest.config, mode-registry, hub-router, command-metadata), eliminate all undocumented presence variance across the 12 skills, document it canonically in create-skill, and automate generation plus drift enforcement."
trigger_phrases:
  - "skill metadata json unification"
  - "leaf-manifest leaf-aliases description drift"
  - "skill root json contract"
  - "command-metadata coverage"
  - "automate skill json generation"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification"
    last_updated_at: "2026-07-27T20:31:30Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped all six phases; fleet 12/12"
    next_safe_action: "Operator review and merge"
    blockers:
      - "Uncommitted: worktree pending operator review"
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "021-skill-metadata-json-unification-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the root framework doc point directly at the canonical contract? Deferred; that file was under concurrent edit."
    answered_questions:
      - "leaf-manifest.json is generated output, not authored: generate-leaf-manifest.cjs derives it from mode-registry.json (hubs) or leaf-manifest.config.json (registry-less skills)"
      - "Operator directive: uniformity is enforced per documented class; cross-class variance is legal only when a written rule explains it"
      - "Two classes: H (registry+router hub) and S (standalone); the pair is the discriminator"
      - "description.json is hub-only; no production advisor consumer reads a skill-root description.json"
      - "leaf-aliases.json is generated for S as an identity projection and authored for H"
      - "command-metadata.json stays an sk-design overlay; its consumers do not enumerate roots"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Skill Root Metadata JSON Unification

---

## EXECUTIVE SUMMARY

The 12 skills under `.opencode/skills/` carry eight distinct root-level metadata JSON files between them, and no two skills carry the same set. Some of that variance is principled and load-bearing (a registry-less skill uses `leaf-manifest.config.json` where a parent hub uses `mode-registry.json`). Some of it is undocumented drift with real consequences (five skills ship `graph-metadata.json` with no paired `description.json`, breaking the advisor identity pair that the root framework doc declares mandatory). And some of it is a single-skill pilot that never generalized (`command-metadata.json` exists only for `sk-design`, while three other skills own multiple commands).

Today a maintainer cannot tell, from any document, which of these files their skill is supposed to have. That is the actual defect: the absence of a written per-class contract is what lets drift accumulate silently.

**Key Decisions**: Adopt a class-based contract. Define skill classes, make presence mandatory and machine-checked within each class, and permit cross-class differences only where a canonical doc explains them. No file stays "optional by convention".

**Critical Dependencies**: The class taxonomy is a research deliverable, not an assumption. Implementation phases are gated on the 10-iteration research synthesis landing first.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Completed** | 2026-07-27 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor` |
| **Parent Spec** | ../spec.md |
| **Research Source** | `research/lineages/sol-high-fast/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A census of the 12 skill roots produces twelve distinct metadata shapes. The confirmed variance, measured on disk:

| Skill | description | graph-metadata | leaf-manifest | leaf-aliases | leaf-manifest.config | mode-registry | hub-router | command-metadata |
|-------|-------------|----------------|---------------|--------------|----------------------|---------------|------------|------------------|
| cli-external-orchestration | yes | yes | yes | no | no | yes | yes | no |
| mcp-code-mode | **no** | yes | yes | yes | yes | no | no | no |
| mcp-tooling | yes | yes | yes | no | no | yes | yes | no |
| sk-code | yes | yes | yes | no | no | yes | yes | no |
| sk-design | yes | yes | yes | no | no | yes | yes | **yes** |
| sk-doc | yes | yes | yes | **yes** | no | yes | yes | no |
| sk-git | **no** | yes | **no** | no | no | no | no | no |
| sk-prompt | yes | yes | yes | no | no | yes | yes | no |
| system-code-graph | **no** | yes | yes | yes | yes | no | no | no |
| system-deep-loop | yes | yes | yes | no | no | yes | yes | no |
| system-skill-advisor | **no** | yes | yes | yes | yes | no | no | no |
| system-spec-kit | **no** | yes | yes | yes | yes | no | no | no |

Four distinct defect classes are visible in that table:

1. **Broken advisor identity pair.** Five skills (`mcp-code-mode`, `sk-git`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit`) ship `graph-metadata.json` without `description.json`. The root framework doc states the advisor metadata pair lives together at a hub or standalone-skill root. Half the pair is missing on 42 percent of the fleet.
2. **Unexplained alias-overlay variance.** `leaf-aliases.json` exists on five skills and not the other seven. `generate-leaf-manifest.cjs` treats absence as zero authored aliases, so absence is legal — but no document states when a skill should author one, so a maintainer cannot tell whether their skill's absence is correct or an oversight.
3. **Ungeneralized command-metadata pilot.** `command-metadata.json` exists only for `sk-design`, consumed by four distinct call sites including the skill-benchmark harness and an advisor command-binding test. `sk-doc`, `system-deep-loop` and `system-spec-kit` each own multiple commands and have no equivalent, so those consumers see partial fleet coverage.
4. **No canonical documentation and no fleet-wide gate.** `create-skill` documents the leaf-manifest generator's mechanics but not the per-class presence contract. `ci-leaf-manifest-freshness.cjs` gates one file type fleet-wide; the other seven have no equivalent coverage gate. Nothing regenerates or backfills the pair-level metadata automatically.

The through-line: partial adoption is invisible because nothing declares what full adoption means.

### Purpose

Produce a single written contract that says, for each skill class, exactly which root-level JSONs are mandatory, which are generated versus authored, and what each one is consumed by. Document it canonically in `create-skill`. Bring every skill into conformance with its class. Automate generation and backfill so conformance is the default outcome of running a script, not a manual chore. Add a fleet-wide drift gate so a future skill cannot ship partially adopted.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Census and consumer map.** Every root-level metadata JSON across all 12 skills, each one's producer (authored or generated, by which script) and every consumer call site (advisor scorer, benchmark harness, doctor checks, tests).
- **Class taxonomy.** Define the skill classes that determine which files apply. Candidate axes surfaced by the census: parent hub versus standalone skill, registry-backed versus config-backed leaf routing, command-owning versus command-less. The final taxonomy is the research deliverable.
- **Per-class mandatory set.** For each class, the exact required file list, plus the rule that explains every cross-class difference.
- **Eight file types in scope:** `description.json`, `graph-metadata.json`, `leaf-manifest.json`, `leaf-aliases.json`, `leaf-manifest.config.json`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`.
- **Canonical documentation in create-skill**, plus the pointer updates in every other doc that currently describes a subset of this surface.
- **Conformance backfill** of every non-conforming skill to its class contract.
- **Automation**: generation and backfill for whichever files are derivable, extending the existing generator surface rather than adding a parallel one.
- **Enforcement**: a fleet-wide presence and freshness gate, wired into the existing doctor and CI surfaces.

### Out of Scope

- Nested packet-level and mode-level JSON files (`routing-allowlist.json`, per-mode metadata, benchmark report JSON). Root-level only, per the operator's scope decision.
- Spec-folder `description.json` / `graph-metadata.json` (the continuity schema). These share filenames with the advisor identity pair but are an unrelated schema in an unrelated tree; the distinction is documented in the root framework doc and this packet must not conflate them.
- Changing advisor scorer weights, thresholds, or routing behavior. This packet changes which metadata exists and where it is documented, not how routing scores it.
- Renaming any of the eight files. Naming is settled by the hyphen-case program.

### Files to Change

Enumerated after research synthesis. The classes of change are known:

| Target | Change Type | Description |
|--------|-------------|--------------|
| `.opencode/skills/sk-doc/create-skill/references/` | Create + Modify | Canonical per-class metadata contract doc; update the parent-skill doctrine doc to point at it |
| `.opencode/skills/sk-doc/create-skill/scripts/` | Create + Modify | Extend the generator surface to cover backfill and presence checking |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Modify | Add per-class presence rules to the existing rule set |
| `.opencode/skills/*/` (12 skills) | Create + Modify | Conformance backfill of missing class-mandatory files |
| `AGENTS.md` / `CLAUDE.md` | Modify | Point the advisor-metadata-placement paragraph at the new canonical doc |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce a complete census: every root-level metadata JSON, its producer, and every consumer call site, cited to file:line | Census covers all 12 skills and all 8 file types with no "unknown" producer or consumer entries |
| REQ-002 | Define the skill class taxonomy and the per-class mandatory file set | Every one of the 12 skills maps to exactly one class, and every observed presence difference is either explained by the class rule or flagged as a defect to fix |
| REQ-003 | Document the contract canonically in create-skill | One doc states, per class, which files are mandatory, which are generated versus authored, and what consumes each; every other doc describing this surface points at it rather than restating it |
| REQ-004 | Bring every skill into conformance with its class contract | Zero undocumented presence variance remains across the fleet |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Automate generation and backfill for every derivable file | A single documented command brings a skill from non-conforming to conforming without hand-editing JSON |
| REQ-006 | Add a fleet-wide presence and freshness gate | The gate fails closed on a skill missing a class-mandatory file, and on byte drift in any generated file |
| REQ-007 | Resolve the `command-metadata.json` generalization question with evidence | Either every command-owning skill has one and its consumers handle the full fleet, or the file is documented as sk-design-specific with the reason stated |

### P2 - Optimization

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Reduce the file-type count where two files carry redundant data | Any proposed merge names the consumers it would break and how they migrate; no merge lands without that analysis |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A maintainer creating a new skill can read one create-skill doc and know exactly which root JSONs to produce, without reading any script source.
- **SC-002**: The presence gate fails on a deliberately-broken fixture skill (missing a class-mandatory file) and passes on all 12 real skills.
- **SC-003**: Re-running the generation and backfill automation across the fleet produces zero diffs on a conforming tree.
- **SC-004**: Every consumer identified in the census still passes its own test suite after the backfill.
- **SC-005**: The advisor identity pair is complete on every skill that is required to have it, and the requirement is stated in the canonical doc rather than only in the root framework doc.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Research synthesis | The class taxonomy is unknown until research lands. Implementing against a guessed taxonomy would encode the drift instead of fixing it | Gate every implementation phase on synthesis; author plan.md only afterward |
| Risk | Backfilling `description.json` onto five skills changes advisor lexical evidence and could shift routing scores | M | Capture a routing baseline before backfill, re-measure after, and treat any regression as blocking |
| Risk | Generalizing `command-metadata.json` to three more skills expands a schema whose consumers were written against one example | M | Enumerate all four consumer call sites first; confirm each handles N skills before authoring the new files |
| Risk | A "reduce the file count" merge breaks a consumer discovered only at runtime | M | REQ-008 requires the consumer-migration analysis before any merge; no merge lands on analysis alone |
| Risk | Filename collision with the spec-folder continuity schema causes a tool or a future maintainer to conflate the two | M | State the two-schema distinction explicitly in the canonical doc, and make the presence gate scope itself to `.opencode/skills/` paths only |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The fleet-wide presence gate runs over 12 skill roots and must stay fast enough to sit in the existing doctor and CI paths without a new timeout budget.

### Reliability
- **NFR-R01**: Generated files stay byte-reproducible. The freshness gate compares regenerated output against the committed file, so any nondeterminism in the generator is itself a defect.

### Maintainability
- **NFR-M01**: The canonical doc is the single source of truth. Any other doc describing this surface points at it; no doc restates the per-class table, because two copies drift.

---

## 8. EDGE CASES

### Data Boundaries
- `sk-git` is the sparsest skill: `graph-metadata.json` only, no leaf manifest at all. It is either a legitimate class of its own or the most non-conforming skill in the fleet, and the taxonomy must decide which rather than leaving it unclassified.
- `sk-doc` carries `leaf-aliases.json` while also being a registry-backed parent hub, which is the one observed case of an alias overlay on a hub rather than on a registry-less skill. The taxonomy must explain whether that is legal.

### Error Scenarios
- A skill with both `mode-registry.json` and `leaf-manifest.config.json` would have two competing manifest inputs. No skill is in that state today; the gate should make it unreachable.
- A `description.json` backfilled with weak or generic keywords is worse than absence, because it adds noise to advisor lexical evidence without adding signal. Backfill quality is part of REQ-004, not a follow-up.

### State Transitions
- A new skill created by `init_skill.py` must land conforming from the first commit, otherwise the gate turns into a chore that gets skipped. Scaffolding is part of the automation requirement.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | 8 file types across 12 skill roots, plus the create-skill doc surface, the generator scripts, the doctor check and the CI gate |
| Risk | 12/25 | No production runtime behavior changes directly, but backfilled advisor metadata can shift routing scores fleet-wide |
| Research | 15/20 | The class taxonomy, the alias-overlay rule and the command-metadata generalization question are all genuinely open |
| Multi-Agent | 6/15 | Research runs as a multi-iteration loop; implementation is sequential per phase |
| Coordination | 8/15 | Touches sk-doc, system-skill-advisor and every other skill root, plus two root framework docs |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Backfilled `description.json` files shift advisor routing outcomes | H | M | Baseline routing accuracy before, re-measure after, block on regression |
| R-002 | The class taxonomy is drawn to fit the current drift rather than the real design intent, ratifying the mess | H | M | Require the taxonomy to be justified from consumer requirements and file:line evidence, not from the presence table |
| R-003 | `command-metadata.json` generalization breaks a consumer written against the single sk-design example | M | M | Enumerate and test all four consumers before authoring new files |
| R-004 | The new gate is added but not wired into any path that actually runs | M | M | Wire into the existing doctor route and CI script, and prove it fails on a broken fixture |

---

## 11. USER STORIES

### US-001: Knowable metadata contract (Priority: P0)

**As a** maintainer creating or auditing a skill, **I want** one document that states which root-level JSONs my skill must have and why, **so that** I can tell conformance from drift without reading generator source or comparing against a sibling skill.

**Acceptance Criteria**:
1. Given a new skill of any class, When the maintainer reads the canonical create-skill doc, Then the required file list is unambiguous.
2. Given an existing skill, When the presence gate runs, Then a missing class-mandatory file fails closed with the class named in the message.

### US-002: Conformance without hand-editing (Priority: P1)

**As a** maintainer bringing a skill into conformance, **I want** a documented command that generates or backfills every derivable file, **so that** conformance does not depend on hand-authoring JSON correctly.

**Acceptance Criteria**:
1. Given a non-conforming skill, When the automation runs, Then every derivable file is produced and the gate passes.
2. Given an already-conforming tree, When the automation re-runs, Then it produces zero diffs.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- What is the correct class taxonomy, and is it one axis or several crossed axes?
- Is `leaf-aliases.json` a durable authored contract, or should its data fold into `mode-registry.json` / `leaf-manifest.config.json` so the file type disappears?
- Should `command-metadata.json` generalize to every command-owning skill, or retract to a documented sk-design-specific case?
- Is `sk-git` a legitimate sparse class, or the most non-conforming skill in the fleet?
- Does backfilling the five missing `description.json` files measurably change advisor routing, and if so, in which direction?
- Can the eight file types be reduced without breaking a consumer, and is reduction actually better than documented per-class presence?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research Source**: `research/lineages/sol-high-fast/research.md`
- **Prior routing-registry work (shared boundary)**: `../012-skill-advisor-routing-fixes/spec.md`
- **Prior hub-side routing work**: `../011-sk-doc-routing-fixes/spec.md`
- **Router unification program**: `../015-router-unification-program/spec.md`
- **Canonical parent-hub doctrine**: `.opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `020-compiled-routing-next-move` |
| **Successor** | none |

---
