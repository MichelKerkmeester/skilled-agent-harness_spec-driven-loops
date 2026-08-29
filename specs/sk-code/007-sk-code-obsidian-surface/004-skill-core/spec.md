---
title: "Feature Specification: sk-code-obsidian SKILL.md and README.md"
description: "Author the sk-code-obsidian surface packet's two companion files — SKILL.md and README.md — mirroring sk-code-mobile-cli's shape exactly, describing the real Obsidian plugin stack rather than the template's Svelte stack."
trigger_phrases:
  - "sk-code-obsidian skill core"
  - "obsidian surface SKILL.md"
  - "obsidian surface README.md"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/004-skill-core"
    last_updated_at: "2026-08-28T21:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored SKILL.md and README.md"
    next_safe_action: "Author reference stack"
    blockers: []
    key_files:
      - "$HUB/.opencode/skills/sk-code/sk-code-obsidian/SKILL.md"
      - "$HUB/.opencode/skills/sk-code/sk-code-obsidian/README.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether the packet needs a nested graph-metadata.json: no, that is a NESTED_IDENTITY violation (carried over from phase 001, operator via goal.md, 2026-08-28)"
---
# Feature Specification: sk-code-obsidian SKILL.md and README.md

> Phase chain: parent [`../spec.md`](../spec.md), predecessor `003-hub-wiring` (registry, router, and
> detection wiring), successor `005-references-stack` (authors the reference files this phase names).

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Done |
| **Created** | 2026-08-28 |
| **Branch** | `worktrees/001-sk-code-obsidian-surface` |
| **Wave** | 2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-code-obsidian/` exists only as a `.gitkeep`. The packet's two companion files — `SKILL.md` and
`README.md` — cannot be authored correctly by copying `sk-code-mobile-cli`'s text, because that
packet documents a SvelteKit app with runes, component-scoped `<style>` blocks, and a live
design-system catalog, none of which this plugin has. A version written from the template's prose
rather than from the measured plugin state would carry Svelte doctrine (scoped styles, `$effect`
self-invalidation, BEM class grammar) that describes nothing real in this repository, while missing
what actually needs documenting: a single 18,931-line stylesheet, a `.db-*` class grammar with 769
orphaned classes, and a screenshot harness that photographs fixture markup, not the live plugin.

### Purpose

Author `SKILL.md` and `README.md` under `$HUB/.opencode/skills/sk-code/sk-code-obsidian/`, mirroring
`sk-code-mobile-cli`'s section grammar, frontmatter shape, and file structure exactly, while every
factual claim inside describes the Obsidian Note Database plugin as measured in
`002-repo-convention-audit/audit.json` and designed in `001-surface-design-plan/mode-design-plan.md`.
This phase creates no other file in the hub and touches no hub routing file
(`mode-registry.json`, `hub-router.json`, `ROUTER.md`, `stack-detection.md` — phase `003-hub-wiring`
owns those). It also replaces this leaf's own `spec.md`, `plan.md`, and `tasks.md` scaffolds.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reading the two style templates in full: `sk-code-mobile-cli/SKILL.md` and
  `sk-code-mobile-cli/README.md`.
- Reading the two authoring contracts: `sk-doc/sk-create-skill/SKILL.md` and
  `sk-doc/sk-create-readme/SKILL.md`.
- Reading the approved design (`../001-surface-design-plan/mode-design-plan.md`) and the measured
  audit (`../002-repo-convention-audit/audit.json`) as the two sources of truth for content.
- Reading enough of the plugin repository (`AGENTS.md`, `package.json`, `manifest.json`,
  `<plugin-repo>/specs/public/HANDOVER.md`, `src/views/`, `src/data/`, `tools/screenshots/`) to state the stack
  truthfully rather than from memory or inference.
- Creating `$HUB/.opencode/skills/sk-code/sk-code-obsidian/SKILL.md` and
  `$HUB/.opencode/skills/sk-code/sk-code-obsidian/README.md`. No other file under that directory.
- Replacing this leaf's own `spec.md`, `plan.md`, and `tasks.md` scaffolds with real content.

### Out of Scope

- `references/`, `assets/`, `manual-testing-playbook/`, `changelog/`, and `scripts/` under
  `sk-code-obsidian/` — phases 005 through 008 of the parent roadmap create those; `SKILL.md`'s
  reference map and asset list name the paths those phases will fill.
- `mode-registry.json`, `hub-router.json`, `ROUTER.md`, and `shared/references/stack-detection.md` —
  phase `003-hub-wiring` owns hub wiring; this phase writes the packet content those files will
  route to.
- Any change to the plugin's `src/`, `tools/`, or `styles.css` — phases 009 and 010.
- Re-measuring the plugin; `002-repo-convention-audit/audit.json` is the frozen source of counts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `$HUB/.opencode/skills/sk-code/sk-code-obsidian/SKILL.md` | Create | The executable runtime contract: activation, reference map, smart routing, standards, source-tree conventions, assets, rules, integration |
| `$HUB/.opencode/skills/sk-code/sk-code-obsidian/README.md` | Create | The orientation document: at-a-glance, overview, quick start, how it works, integration, FAQ, verification, related documents |
| `spec.md` | Replace scaffold | This document |
| `plan.md` | Replace scaffold | The execution plan for authoring the two files |
| `tasks.md` | Replace scaffold | The task breakdown for this phase |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Frontmatter and keyword-comment shape matches the template exactly | `SKILL.md` carries `name: sk-code-obsidian`, a description under 130 characters, `allowed-tools: [Read, Bash, Grep, Glob]`, `version: 0.1.0.0`, and a `metadata:` block with `author: OpenCode`, `family: sk-code`, `packetKind: surface`; the two HTML comments (`Keywords:`, `Owns: ... Does NOT own:`) appear immediately after frontmatter in the same one-line form as `sk-code-mobile-cli`. |
| REQ-002 | Section sequence matches the template exactly | `SKILL.md` carries, in order, `## 1. WHEN THE HUB BUNDLES THIS`, `## 2. REFERENCE MAP`, `## 2b. SMART ROUTING (machine-readable)`, `## 3. SURFACE STANDARDS (the non-negotiables)`, `## 3b. SOURCE TREE CONVENTIONS (the shipped grammar)`, `## 4. ASSETS (on-demand)`, `## 5. RULES` with `### ✅ ALWAYS`, `### ❌ NEVER`, `### ⚠️ ESCALATE IF`, and `## 6. INTEGRATION POINTS`. |
| REQ-003 | Content describes this plugin, not the template's app | No Svelte, SvelteKit, runes, or scoped-style doctrine appears anywhere in either file. Every stack claim (TypeScript, esbuild, vitest, eslint + eslint-plugin-obsidianmd, chart.js, `manifest.json`/`versions.json`, not desktop-only, `src/data/` and `src/views/` file counts, the single `styles.css`, the screenshot harness) is checked against `002-repo-convention-audit/audit.json` or a live plugin file read this session. |
| REQ-004 | §2b is a Python block shaped like the template's | `SKILL.md`'s `## 2b` section contains a fenced ```python``` block defining `DEFAULT_RESOURCE`, `INTENT_SIGNALS`, and `RESOURCE_MAP`, matching `../001-surface-design-plan/mode-design-plan.md` §7's proposed shape. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | README section sequence matches the template exactly | `README.md` carries, in order, `## 1. AT A GLANCE` (a two-column table), `## 2. OVERVIEW`, `## 3. QUICK START`, `## 4. HOW IT WORKS`, `## 5. INTEGRATION & NAVIGATION`, `## 6. FAQ`, `## 7. VERIFICATION`, `## 8. RELATED DOCUMENTS`. |
| REQ-006 | Traps are encoded as evidence, not silently fixed | Both files state, without proposing a fix: never inventing a `.db-*` class (`ScreenshotFixtures.test.ts`'s guard), that a capture succeeding is not proof, that `src/views/modals/` (17 files) is unphotographed because the original inventory used a non-recursing `ls`, and that six P0/P1 items are recorded in `<plugin-repo>/specs/public/HANDOVER.md`. |
| REQ-007 | Target-state conventions are labeled honestly | `SKILL.md` §3b distinguishes, in its own subsections, the plugin's measured current state (0 of 249 files carry a `MODULE:` banner, 0 folder docs exist, 232 of 248 filenames are PascalCase) from the target conventions a later phase adopts (kebab-case, `MODULE:` banners, paired folder docs) — it never states the target conventions are already shipped. |
| REQ-008 | No spec-path or requirement/task/checklist id is embedded in either file | Neither `SKILL.md` nor `README.md` contains a phase number, requirement id, task id, or checklist id in any prose or code-shaped example, per the plugin's own `AGENTS.md` comment rule and the operator's explicit instruction for this phase. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `SKILL.md` and `README.md` exist at `$HUB/.opencode/skills/sk-code/sk-code-obsidian/`
  and no other file was created in that directory by this phase.
- **SC-002**: A side-by-side section-header diff against `sk-code-mobile-cli/SKILL.md` and
  `sk-code-mobile-cli/README.md` shows matching header text and sequence, differing only in
  packet-specific names (`sk-code-obsidian` vs. `sk-code-mobile-cli`, `OBSIDIAN` vs. `PI_REMOTE`).
- **SC-003**: Every concrete number in either file (file counts, class counts, gate pass counts,
  screenshot entry counts, lint problem counts) traces to a value present in
  `002-repo-convention-audit/audit.json`.
- **SC-004**: Grepping both files for `Svelte`, `SvelteKit`, `runes`, `$effect`, or `scoped style`
  returns no match.
- **SC-005**: `spec.md`, `plan.md`, and `tasks.md` in this folder contain no scaffold placeholder text
  (`REQUIREMENT_PLACEHOLDER`, `AI EXECUTION`, `Pre-Task Checklist`, or similar scaffold markers).

### Acceptance Scenarios

- **Scenario 1**: **Given** `sk-code-mobile-cli/SKILL.md` orders its sections `1` through `6` with the
  `2b`/`3b` sub-numbering, **when** `sk-code-obsidian/SKILL.md` is read top to bottom, **then** the
  same section numbers and titles appear in the same order.
- **Scenario 2**: **Given** the measured audit records 128 files in `src/data/` and 91 in
  `src/views/`, **when** `SKILL.md` §3b is read, **then** it states those exact counts rather than an
  approximation or a count copied from the template's Svelte app.
- **Scenario 3**: **Given** the audit records 0 of 249 files carrying a `MODULE:` banner, **when**
  `SKILL.md` §3b's target-conventions subsection is read, **then** it states plainly that the
  banner convention is not yet adopted, rather than presenting it as the shipped grammar.
- **Scenario 4**: **Given** `HANDOVER.md` records six open P0/P1 items and roughly 145 unphotographed
  surfaces, **when** either file's rules or FAQ section is read, **then** it names them as recorded
  evidence a bundled workflow must honor, with no proposed remediation.
- **Scenario 5**: **Given** the plugin repository has no live design-system catalog the way the Pi
  Remote app does, **when** `README.md` §2 "The Design-System Evidence Layer" subsection is read,
  **then** it states that the plugin source itself (`styles.css`, `ScreenshotFixtures.test.ts`,
  `manifest.json`) is the evidence, rather than inventing a catalog file that does not exist.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Copying the template's prose structurally without replacing its Svelte-specific claims | The packet would document a stack this plugin does not have, misleading any workflow that bundles it | Every sentence describing the stack was checked against a live plugin file or the audit before being written; §3b explicitly separates measured fact from target convention |
| Risk | Hub routing (`mode-registry.json`, `hub-router.json`, `stack-detection.md`) has not landed yet | `SKILL.md` §1 and §6 describe bundling behavior that is not yet wired | The content describes the approved design (`mode-design-plan.md`), which phase `003-hub-wiring` is responsible for making live; this phase's scope is the packet's own content, not the wiring |
| Dependency | `../001-surface-design-plan/mode-design-plan.md` | The exact reference-map table, smart-routing block, and asset names used in `SKILL.md` §2, §2b, and §4 | Already authored and approved; read in full before drafting |
| Dependency | `../002-repo-convention-audit/audit.json` | Every concrete count cited in `SKILL.md` §3 and §3b | Already measured and committed before this phase started |
| Dependency | `sk-code-mobile-cli/SKILL.md` and `README.md` as the shape template | Section grammar, frontmatter shape, and file structure | Read in full before drafting; the operator's brief makes deviation from it a binding constraint |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

### Structural Boundaries
- **A reference or asset path named in `SKILL.md` §2/§2b/§4 does not exist yet**: this is expected.
  Those files are the deliverable of phases 005 and 006; naming them now is the handoff, not an error.
- **Hub routing files this phase does not touch**: `SKILL.md` §1 and §6 describe the OBSIDIAN
  detection precedence and the bundling behavior as the approved design states it, without editing
  `mode-registry.json`, `hub-router.json`, `ROUTER.md`, or `stack-detection.md` — those remain phase
  `003-hub-wiring`'s files to change.

### Grounding Boundaries
- **A claim that cannot be checked against a real file or the audit**: none is made. Every stack
  fact, file count, and gate result traces to `002-repo-convention-audit/audit.json` or a plugin file
  read during this phase.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | Two markdown files plus their spec-kit wrapper; no code, no hub routing edits |
| Risk | 5/25 | Read-only research and a documentation deliverable; nothing here executes or mutates the plugin |
| Research | 10/20 | Required reading spans two style templates, two authoring-skill contracts, the approved design plan, the measured audit, and enough of the live plugin tree to state the stack truthfully |
| **Total** | **22/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

None. The design plan resolved the structural questions (registry shape, router wiring, detection
precedence); this phase's own scope (packet content only) leaves nothing open. One deferral carries
forward from phase 001: whether `styles.css` is sectioned in place or split is phase 009's decision,
and `SKILL.md` §3b documents the current single-file state only, per `../roadmap.md` §4.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: [`../spec.md`](../spec.md)
- **Packet Goal**: [`../goal.md`](../goal.md)
- **Packet Roadmap**: [`../roadmap.md`](../roadmap.md)
- **Design Plan**: [`../001-surface-design-plan/mode-design-plan.md`](../001-surface-design-plan/mode-design-plan.md)
- **Measured Audit**: [`../002-repo-convention-audit/audit.json`](../002-repo-convention-audit/audit.json)
- **Main Deliverables**: `$HUB/.opencode/skills/sk-code/sk-code-obsidian/SKILL.md` and `README.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`

<!-- /ANCHOR:related-docs -->
