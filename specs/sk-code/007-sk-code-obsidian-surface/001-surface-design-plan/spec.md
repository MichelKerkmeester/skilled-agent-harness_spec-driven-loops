---
title: "Feature Specification: sk-code-obsidian Surface Design Plan"
description: "Design, against the live sk-code hub contract, of the sk-code-obsidian read-only SURFACE evidence packet — registry entry, router wiring, OBSIDIAN detection branch, reference map, and build-packet handoff. Plan only; authors no skill file."
trigger_phrases:
  - "sk-code-obsidian design plan"
  - "obsidian surface registry entry"
  - "obsidian detection branch design"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/001-surface-design-plan"
    last_updated_at: "2026-08-28T20:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored surface design plan"
    next_safe_action: "Begin hub wiring"
    blockers: []
    key_files:
      - "mode-design-plan.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether the packet needs a nested graph-metadata.json: no, that is a NESTED_IDENTITY violation (operator via goal.md, 2026-08-28)"
---
# Feature Specification: sk-code-obsidian Surface Design Plan

> Phase chain: parent [`../spec.md`](../spec.md), successor `002-repo-convention-audit` (already
> measured), then `003-hub-wiring` (consumes this plan's output).

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
| **Created** | 2026-08-28 |
| **Branch** | `worktrees/001-sk-code-obsidian-surface` |
| **Wave** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-code-obsidian` cannot be authored correctly on the first attempt without first grounding every
structural decision in the live hub contract, because that contract has moved since
`sk-code-mobile-cli` was written: the registry now carries five modes, not four, the router's
`vocabularyClasses` follow a compositional (not mirrored) strategy, and the target repository
symlinks `.opencode`, `.claude`, `.codex`, `.cursor`, and `.devin` back to the hub — a fact with no
precedent in `sk-code-webflow`, `sk-code-opencode`, or `sk-code-mobile-cli`'s design history, since
none of those surfaces' host repositories carry that symlink set. A design authored from memory or
from the mobile-cli template alone would silently miss the alias-collision check, the tie-break
append position, and the OPENCODE detection guard the symlinks require.

### Purpose

Produce `mode-design-plan.md`: a single design document specifying the exact `mode-registry.json`
entry, the `hub-router.json` wiring, the new `OBSIDIAN` branch in `stack-detection.md` (including
the symlink guard and its test cases), the reference map, the machine-readable smart-routing block,
the workflow-doctrine symlink plan, and the file-by-file handoff a later build packet executes —
every claim checked against a real file in `$HUB/.opencode/skills/sk-code/` or against
`002-repo-convention-audit/audit.json`. This phase authors no skill file under
`.opencode/skills/sk-code/sk-code-obsidian/`; that folder still holds only its `.gitkeep`
(`../goal.md` §6) when this phase closes.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reading and citing the live `mode-registry.json`, `hub-router.json`, `stack-detection.md`,
  `ROUTER.md`, `sk-code/SKILL.md`, the skill-root-metadata contract, and the parent-skill nested-
  packets doctrine, all under `$HUB/.opencode/skills/sk-code/` and `$HUB/.opencode/skills/sk-doc/`.
- Reading the measured plugin state in `002-repo-convention-audit/audit.json` and the packet's
  `goal.md`/`spec.md`/`roadmap.md`.
- Producing `mode-design-plan.md` (200-320 lines) with the exact JSONC/bash/python blocks a build
  packet applies verbatim or amends.
- Replacing this leaf's own `spec.md`, `plan.md`, and `tasks.md` scaffolds with real content.

### Out of Scope

- Writing any file under `$HUB/.opencode/skills/sk-code/sk-code-obsidian/` — that is phases
  004-008 of the parent roadmap.
- Editing `mode-registry.json`, `hub-router.json`, or `stack-detection.md` themselves — that is
  phase `003-hub-wiring`.
- Any change to the plugin's `src/`, `tools/`, or `styles.css` — that is phases 009-010.
- Re-measuring the plugin; `002-repo-convention-audit/audit.json` is the frozen source of counts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `mode-design-plan.md` | Create | The main deliverable: the cite-backed design (§1-9 internally) |
| `spec.md` | Replace scaffold | This document |
| `plan.md` | Replace scaffold | The execution plan for producing the design |
| `tasks.md` | Replace scaffold | The task breakdown for this phase |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No packet-level identity file | `mode-design-plan.md` §2 states, with a citation to `skill-root-metadata-contract.md` §3/§5, that `sk-code-obsidian` carries no `graph-metadata.json` and no `description.json`, and names the `NESTED_IDENTITY` violation code a build packet would trigger by adding either. |
| REQ-002 | Exact `mode-registry.json` entry | `mode-design-plan.md` §3 gives the full `modes[]` JSONC block plus the `extensions.surface-axis.surfaces` append, with `packetKind: "surface"`, `backendKind: "evidence-base"`, and a read-only `toolSurface` matching the three existing surface entries' shape. |
| REQ-003 | Alias disjointness verified against the live file | `mode-design-plan.md` §3 lists the 33 aliases carried by the five live modes and states, by comparison, that the five proposed `sk-code-obsidian` aliases collide with none of them and are lowercase. |
| REQ-004 | `hub-router.json` wiring named exactly | `mode-design-plan.md` §4 gives the `routerSignals` entry, the `code-obsidian-aliases`/`code-obsidian-runtime` vocabulary classes (the `code-` prefix, not `sk-code-`), and the `routerPolicy.tieBreak` append position, each checked against the live file's current contents. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | OBSIDIAN detection branch with the symlink guard | `mode-design-plan.md` §5 gives the OBSIDIAN markers, states the `OPENCODE > OBSIDIAN > PI_REMOTE > WEBFLOW > UNKNOWN` precedence, explains the `.opencode`/`.claude`/`.codex`/`.cursor`/`.devin` symlink trap in the plugin repo, specifies a resolved-realpath gate (not a literal-string match) for OPENCODE detection, and adds test-case rows in the existing table's format. |
| REQ-006 | Reference map, smart routing, symlinks, and build handoff | `mode-design-plan.md` §6-9 name the proposed `references/` set (covering the Obsidian API boundary, single-stylesheet ownership, `.db-*` grammar, screenshot/fixture harness, verification, comment grammar, folder docs, and view-renderer architecture), the `§2b` machine-readable routing block, the three workflow-doctrine symlinks, and a file-by-file list of what a build packet creates or edits with its gates. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `mode-design-plan.md` exists, is 200-320 lines, and uses upper-case numbered section headers matching `sk-code-mobile-cli`'s section style.
- **SC-002**: Every structural claim in `mode-design-plan.md` names the real file and, where practical, the line or section it was checked against.
- **SC-003**: The proposed `mode-registry.json` entry and `hub-router.json` wiring are internally consistent with each other (same `workflowMode` key, same alias set feeding the vocabulary class) and with the live files' existing shape.
- **SC-004**: The OBSIDIAN detection branch design explicitly resolves the symlink trap rather than ignoring it, with at least one test case demonstrating the guard.
- **SC-005**: `spec.md`, `plan.md`, and `tasks.md` in this folder contain no scaffold placeholder text (`REQUIREMENT_PLACEHOLDER`, `**Given**` with no scenario body, or similar).

### Acceptance Scenarios

- **Scenario 1**: **Given** the live `mode-registry.json` has three surface entries plus two workflow entries, **when** `mode-design-plan.md` §3 is read, **then** it shows the fourth surface entry appended in the same shape, with a citation to the exact line the three-entry `surfaces[]` array was read from.
- **Scenario 2**: **Given** the plugin repo symlinks `.opencode` back to the hub, **when** `mode-design-plan.md` §5 is read, **then** it names the resolved-realpath gate as the fix and gives a test case where a plugin-repo CWD resolves OBSIDIAN despite the symlink.
- **Scenario 3**: **Given** `sk-code-mobile-cli`'s reference map names 8 topics beyond token/tint specifics, **when** `mode-design-plan.md` §6 is read, **then** it names an Obsidian-specific reference for each of the 8 topics required by the dispatch (API boundary, single stylesheet, `.db-*` grammar, screenshot harness, verification, comment grammar, folder docs, view-renderer architecture).
- **Scenario 4**: **Given** 33 aliases exist across five live modes, **when** `mode-design-plan.md` §3's alias-disjointness claim is read, **then** none of the five proposed aliases string-matches any of the 33.
- **Scenario 5**: **Given** the packet must carry no `graph-metadata.json`, **when** `mode-design-plan.md` §2 is read, **then** it cites the `NESTED_IDENTITY` violation code by name.
- **Scenario 6**: **Given** a later build packet needs to know what to create, **when** `mode-design-plan.md` §9 is read, **then** every path a build phase touches is listed with its owning phase and its gate.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The hub contract drifts again before phase 003 executes | The registry entry or router wiring in `mode-design-plan.md` no longer matches the live file | Phase 003 re-verifies the cited line numbers before applying; this plan states what was true when written, not a promise of permanence |
| Risk | The symlink guard is under-specified and a build packet re-implements naive string matching | OPENCODE misfires for every plugin-repo task, silently defeating the whole packet | §5's CRITICAL GUARD and test-case rows are the acceptance bar phase 003 must satisfy, not optional color |
| Dependency | `002-repo-convention-audit/audit.json` | Every concrete count (file totals, class totals, gate baselines) cited in `mode-design-plan.md` §6 | Already measured and committed before this phase started |
| Dependency | `sk-code-mobile-cli/` as the shape template | Section grammar, file naming, and companion-file policy | Read in full before drafting; `goal.md` §3 makes deviation from it a frozen-constraint violation |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

### Structural Boundaries
- **A resource named in the reference map or the `§2b` routing block does not exist yet**: `mode-design-plan.md` states explicitly, at both §6 and §7, that these are proposed names for a build packet to author, not files this phase created.
- **The `ROUTER.md` stage-two question (§9, row `sk-code/ROUTER.md`)**: this plan defers that call to phase 003 against the live `leaf-manifest.json`, per `../spec.md` §4's open question — it does not fabricate a synthetic intent map here to force an answer.

### Grounding Boundaries
- **A claim that cannot be checked against a real file**: none is made; every structural section names its source file or measured document.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One design document plus its spec-kit wrapper; no code, no skill files |
| Risk | 4/25 | Read-only research and a documentation deliverable; nothing here executes |
| Research | 9/20 | Required reading spans the hub's registry, router, detection doctrine, metadata contract, nested-packets doctrine, the mobile-cli template's full tree, and the plugin's measured audit |
| **Total** | **19/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

All resolved for this phase; two decisions are explicitly deferred to their owning phase rather than answered here:
- **`ROUTER.md` stage-two promotion**: phase 003 decides against the live `leaf-manifest.json`, per `../spec.md` §4.
- **`styles.css` in-place sectioning vs. split**: phase 009's decision, per `../roadmap.md` §4; this plan's `references/single-stylesheet-ownership.md` proposal documents the current single-file state only.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: [`../spec.md`](../spec.md)
- **Packet Goal**: [`../goal.md`](../goal.md)
- **Packet Roadmap**: [`../roadmap.md`](../roadmap.md)
- **Measured Audit**: [`../002-repo-convention-audit/audit.json`](../002-repo-convention-audit/audit.json)
- **Main Deliverable**: [`mode-design-plan.md`](mode-design-plan.md)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`

<!-- /ANCHOR:related-docs -->
