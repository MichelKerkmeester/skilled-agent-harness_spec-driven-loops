---
title: "Implementation Plan: Consolidate Official Orca Skills Into Standalone cli-orca"
description: "Extract the mcp-orca-cli hub mode into a standalone class-S skill, embed the eight official Orca Agent Skills, move the predecessor packet, and re-verify every routing gate."
trigger_phrases:
  - "cli-orca implementation plan"
  - "hub extraction plan"
  - "official Orca skills embedding plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Consolidate Official Orca Skills Into Standalone cli-orca

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language | Markdown, JSON and Node scripts, no compiled code |
| Primary tooling | sk-create-skill package scripts, mcp-tooling parent check, system-spec-kit validator |
| Dispatch | External read-only workers on the cli-pi executor for research and writing passes |
| Testing | Deterministic repository gates plus advisor and compiled-route replays |

### Overview

The work runs extract-first. The hub is cleaned and its gates are re-run so the removal is proven by the hub's own invariants. The standalone skill is then authored into an empty root from the class-S templates, the packet move follows so every cited path resolves, and re-ingestion closes the loop. Each phase ends on an observable gate, never on prose.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The target root exists and is empty.
- The vendored snapshot is present and its skill set is enumerated.
- The gate suite commands are known and have a captured before-state.
- Rollback sources for every destructive action are identified.

### Definition of Done

- The class-S root metadata gate passes with no forbidden, missing or stale rows.
- The standalone package validator exits clean.
- The hub parent check reports nine modes and no warnings.
- Both cli-orca packets print `RESULT: PASSED` under the strict validator.
- The stale-reference sweep returns nothing outside preserved history.
- The advisor recommends `cli-orca` for an Orca CLI prompt and ignores the unrelated holdout label.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One subject becomes one class-S root. The hub keeps a single responsibility, and the new root owns routing for Orca CLI work through its own `SKILL.md`, which is the only discovery surface a class-S root exposes.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| `SKILL.md` | Routing contract: positive signals, boundaries, workflow, rules |
| `references/orca-cli-*.md` | Version-matched runtime knowledge behind the router |
| `references/orca-skills/**` | One authored reference per official Orca skill |
| `assets/*.txt` | Verbatim snapshots plus provenance |
| `feature-catalog/` | Feature inventory behind a package index |
| `manual-testing-playbook/` | Human-runnable routing and workflow scenarios |
| `graph-metadata.json` | Advisor identity for the new root |
| `leaf-manifest.config.json` | Authored leaf roots for manifest generation |

### Data Flow

A user request reaches the advisor, which selects the root through graph metadata, then the root's `SKILL.md` routes to a reference leaf. Hub requests never reach the new root, and the hub no longer holds any Orca signal.

### Component Diagram

```
request
  |
  v
advisor graph  --(Orca CLI vocabulary)-->  cli-orca/SKILL.md  -->  references/**
  |
  '--(MCP transport vocabulary)-->  mcp-tooling/SKILL.md  -->  mcp-*/SKILL.md
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline and Snapshot Cleanup

Capture the before-state of the hub gates, advisor answers and compiled routing. Remove the repository copy from the skill tree after proving byte equivalence with the vendored snapshot and locating a rollback archive.

### Phase 2: Research and Packet Docs

Dispatch read-only workers for the official-skill inventory, the CLI surface and the routing boundaries. Save the returns with a verification header, then author the migration packet documents at Level 3.

### Phase 3: Standalone Skill Root

Author `SKILL.md`, `graph-metadata.json` and `leaf-manifest.config.json` from the class-S templates, with routing vocabulary taken from the research returns.

### Phase 4: Corpus, Catalog and Playbook

Author the CLI references, the eight official-skill references, the feature catalog and the manual testing playbook. Generate the derived metadata and validate every document.

### Phase 5: Hub Extraction

Remove the mode from the registry, the router signals, the tie break, the router map, the hub skill table, the descriptions, the graph metadata and the manifest. Regenerate and re-run the parent check.

### Phase 6: Packet Move and Track Metadata

Move the predecessor packet to `specs/cli-orca/001-mcp-orca-cli`, re-point its metadata, add the supersession addendum, create the track metadata and drop 021 from the mcp-tooling track metadata.

### Phase 7: Fleet Catalogs, Re-ingestion and Gates

Update the fleet catalogs, re-ingest the advisor graph, then run the full gate suite and record the results in the implementation summary.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Gate | Command shape | Proves |
|------|---------------|--------|
| Root metadata | `ci-skill-root-metadata.cjs --fix` then a no-write run | Class-S conformance and freshness |
| Package validation | `validate_skill_package.py` and `package_skill.py --check` | Package shape and required docs |
| Document validation | `validate_document.py` per authored doc | Template and prose conformance |
| Hub invariants | `parent-skill-check.cjs` on the hub | Nine aligned modes |
| Routing replay | `compiled-route.cjs` for positive and negative prompts | Boundary behavior |
| Advisor replay | `skill_advisor.py` for `cli-orca` and the holdout | Discovery after re-ingestion |
| Spec validation | `validate.sh --strict` on both packets | Packet conformance |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Effect |
|------------|--------|
| Vendored snapshot | Source for every official-skill reference and snapshot |
| Class-S contract | Shapes the root and its metadata |
| Hub invariants | Define what a clean nine-mode hub looks like |
| Worker routes | Supply research and prose, and can fall back to the second rostered route |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The deleted repository copy is recoverable from the intact archive and the vendored snapshot, both byte-identical to the removed tree as proven before deletion. The created skill tree is new material and needs no rollback beyond removal. The hub edits are tracked-file edits and revert with `git checkout` on explicit paths. The spec move reverts with `git mv` back to the original folder plus a checkout of the original metadata.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the sanctioned paths for the step and that no unsanctioned path is touched.
- Confirm the rollback source for any deletion, overwrite or move.
- Confirm the gate command that will prove the step.

### Task Execution Rules

| Rule | Meaning |
|------|---------|
| One change per pass | Each dispatched worker receives exactly one document set and one write path |
| Evidence over assertion | Every load-bearing claim cites a command, a file line or a captured artifact |
| Gate before claim | No completion statement precedes the gate that proves it |
| Halt over guess | A mismatched line, path or hash stops the step rather than being worked around |

### Status Reporting Format

Report each step as: step name, command run, observed result, artifact written, gate verdict, remaining risk.

### Blocked Task Protocol

If a gate fails twice on the same symptom, stop, record the failing command and its output, and escalate with two or three concrete options instead of weakening the gate.

<!-- /ANCHOR:ai-protocol -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 --> Phase 2 --> Phase 3 --> Phase 4
                          |
                          v
Phase 5 --> Phase 6 --> Phase 7
```

Phase 4 depends on the authored root because references follow the routing contract. Phase 5 depends on Phase 4 because the hub may only drop the mode once the replacement exists. Phase 6 follows extraction so moved files cite live paths.

<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Relative effort |
|-------|-----------------|
| Phase 1 | Low |
| Phase 2 | Medium, dominated by external round trips |
| Phase 3 | Medium |
| Phase 4 | High, the largest authoring block |
| Phase 5 | Medium, several coupled JSON edits |
| Phase 6 | Medium, mostly metadata surgery |
| Phase 7 | Low to medium, dominated by gate runtime |

<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- Equivalence proof captured for the deleted tree.
- Before-state captured for every gate that will be re-run.
- Tracked paths identified so a revert can name explicit paths.

### Rollback Procedure

1. Restore the repository copy from the archive if it is ever needed.
2. Revert tracked edits with explicit-path checkouts.
3. Move the packet back and restore its original metadata.
4. Re-run the hub parent check to confirm the restored state.

### Data Reversal

No data migration occurs. The only irreversible artifact is convenience metadata that can be regenerated by the canonical generators.

<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:l3-dep-graph -->
## L3: DEPENDENCY GRAPH

```
snapshot --> research wave --> packet docs
                  |
                  v
              SKILL.md --> references --> catalog and playbook
                  |            |
                  v            v
            root metadata --> derived metadata --> gates
                  |
                  v
             hub removal --> packet move --> track metadata --> fleet catalogs --> re-ingestion
```

### Dependency Matrix

| Node | Depends on | Blocks |
|------|-----------|--------|
| Snapshot | None | Research wave |
| Research wave | Snapshot | Packet docs, `SKILL.md` |
| `SKILL.md` | Research wave | References, root metadata |
| Root metadata | `SKILL.md` | Derived metadata |
| Hub removal | Derived metadata | Packet move |
| Packet move | Hub removal | Track metadata |
| Track metadata | Packet move | Fleet catalogs |
| Fleet catalogs | Track metadata | Re-ingestion |
| Re-ingestion | Fleet catalogs | Final gates |

<!-- /ANCHOR:l3-dep-graph -->

---

<!-- ANCHOR:l3-critical-path -->
## L3: CRITICAL PATH

Snapshot, research wave, `SKILL.md`, root metadata, derived metadata, hub removal, packet move, track metadata, fleet catalogs, re-ingestion, final gates. Any slip in the corpus authoring or in the hub JSON edits extends the path directly.

<!-- /ANCHOR:l3-critical-path -->

---

<!-- ANCHOR:l3-milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| M1 Snapshot removed with proof | Equivalence diff and rollback locations recorded |
| M2 Skill root authored | Root files exist and the metadata gate passes |
| M3 Corpus complete | Every authored document validates and the manifest is fresh |
| M4 Hub clean | Parent check reports nine modes with zero warnings |
| M5 Packets live | Both packets pass the strict validator |
| M6 Discovery closed | Advisor answers the positive prompt and ignores the holdout |

<!-- /ANCHOR:l3-milestones -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

| Decision | Summary |
|----------|---------|
| Class-S root | No registry, no router, no hub description, routing lives in `SKILL.md` |
| Knowledge layer | One authored reference per official skill plus verbatim snapshots |
| Snapshot storage | Verbatim bytes kept outside the doc extension scope |
| Extraction order | Extract the source first, author the target second, move packets last |
| Worker model | Read-only research and writing passes on external routes |

<!-- /ANCHOR:l3-adr-summary -->

---

## RELATED DOCUMENTS

- **Feature Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research Artifacts**: See `scratch/research-*.md`
