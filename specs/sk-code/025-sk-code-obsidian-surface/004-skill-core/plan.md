---
title: "Implementation Plan: sk-code-obsidian SKILL.md and README.md"
description: "Execution plan for authoring SKILL.md and README.md: the reading order across the style templates, the authoring contracts, the design plan, and the plugin tree, then the drafting order for each section."
trigger_phrases:
  - "sk-code-obsidian skill core execution"
  - "obsidian surface skill drafting order"
  - "obsidian surface readme drafting"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/025-sk-code-obsidian-surface/004-skill-core"
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
    answered_questions: []
---
# Implementation Plan: sk-code-obsidian SKILL.md and README.md

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML frontmatter, one embedded Python routing block (design text, no executed code) |
| **Framework** | `sk-doc`'s `sk-create-skill` and `sk-create-readme` authoring contracts, applied against the `sk-code` surface-packet shape |
| **Storage** | `$HUB/.opencode/skills/sk-code/sk-code-obsidian/SKILL.md` and `README.md`; this leaf's own `spec.md`/`plan.md`/`tasks.md` |
| **Testing** | None executable; verification is section-shape parity against the template and citation accuracy against the audit and design plan, not a test run |

### Overview
This plan authors two files — `SKILL.md` and `README.md` — by reading the binding style template
(`sk-code-mobile-cli`), the two authoring contracts (`sk-create-skill`, `sk-create-readme`), the
approved design (`mode-design-plan.md`), the measured audit (`audit.json`), and enough of the live
plugin tree to state the stack truthfully. It mirrors the template's section grammar exactly while
replacing every Svelte-specific claim with the Obsidian plugin's real, measured facts, and labels
target-state conventions honestly rather than presenting them as already shipped.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Style template read in full: `sk-code-mobile-cli/SKILL.md`, `sk-code-mobile-cli/README.md`.
- [x] Authoring contracts read in full: `sk-doc/sk-create-skill/SKILL.md`, `sk-doc/sk-create-readme/SKILL.md`.
- [x] Design plan read in full: `../001-surface-design-plan/mode-design-plan.md`.
- [x] Measured audit read in full: `../002-repo-convention-audit/audit.json`.
- [x] Plugin repository evidence read: `AGENTS.md`, `package.json`, `manifest.json`,
      `<plugin-repo>/specs/public/HANDOVER.md`, plus directory listings and targeted greps across `src/views/`,
      `src/data/`, `src/views/modals/`, and `tools/screenshots/`.

### Definition of Done
- [x] `SKILL.md` created with frontmatter, keyword comments, and section sequence matching the
      template, content describing this plugin's real and target-state conventions.
- [x] `README.md` created with the eight-section sequence matching the template, content describing
      this plugin's stack and evidence layer.
- [x] `spec.md`, `plan.md`, and `tasks.md` in this folder replaced with real content — no scaffold
      placeholders remain.
- [x] No file written outside `$HUB/.opencode/skills/sk-code/sk-code-obsidian/{SKILL.md,README.md}`
      and this leaf's own folder.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-shape-first, content-from-evidence-second. The section headers, frontmatter fields, and file
structure come from `sk-code-mobile-cli` verbatim; every sentence inside those sections comes from
`mode-design-plan.md` or `audit.json`, never from the template's own prose.

### Key Components
- **Template read**: `sk-code-mobile-cli/SKILL.md` and `README.md`, read in full, as the binding
  shape (section order, frontmatter fields, keyword-comment format, rule-list style).
- **Contract read**: `sk-create-skill/SKILL.md` and `sk-create-readme/SKILL.md`, read for the
  authoring rules (frontmatter contract, DQI-adjacent quality bar, README section model).
- **Design read**: `mode-design-plan.md`, the source for the reference map, the smart-routing block,
  the asset list, and the OBSIDIAN detection precedence quoted in `SKILL.md` §1 and §6.
- **Evidence read**: `audit.json` plus targeted plugin-repository reads, the source for every
  concrete count and every "what is real vs. target" distinction in `SKILL.md` §3 and §3b.
- **Draft**: `SKILL.md` first (the executable contract), then `README.md` (the orientation
  document), each section drafted against its named source rather than free composition.
- **Spec-kit wrapper**: `spec.md`, `plan.md`, `tasks.md` restate the same work in the level-2
  spec-kit shape, so this leaf validates like every sibling phase folder.

### Data Flow
Style template + authoring contracts + design plan + measured audit + live plugin reads → drafted
`SKILL.md` and `README.md` → the spec-kit wrapper documents around them → phase
`005-references-stack` reads `SKILL.md` §2/§2b/§4 as its own input contract for which files to
author.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Drafting, and Verification phase
checkboxes and task state.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Section-shape parity | `SKILL.md`/`README.md` header sequence against `sk-code-mobile-cli`'s | Manual side-by-side header comparison |
| Citation check | Every concrete number in either file traces to `audit.json` or a live plugin read | Manual re-read against the cited source |
| Anachronism check | No Svelte/SvelteKit/runes/scoped-style term appears in either file | `grep -in 'svelte\|runes\|scoped style' SKILL.md README.md` |
| Scaffold-residue check | No scaffold marker remains in `spec.md`/`plan.md`/`tasks.md` | `grep` for the scaffold markers |
| Frontmatter contract check | `SKILL.md` frontmatter has all required fields in the required shape | Manual check against `sk-create-skill`'s frontmatter contract |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `$HUB/.opencode/skills/sk-code/sk-code-mobile-cli/{SKILL.md,README.md}` | External (hub repo) | Green — read in full | Without it, section shape and frontmatter form would be guessed rather than mirrored |
| `$HUB/.opencode/skills/sk-doc/sk-create-skill/SKILL.md`, `sk-create-readme/SKILL.md` | External (hub repo) | Green — read in full | Without these, the frontmatter and README section contracts would be assumed rather than sourced |
| `../001-surface-design-plan/mode-design-plan.md` | Internal (this packet) | Green — already authored | Without it, the reference map, smart-routing block, and asset list in `SKILL.md` would be invented rather than handed off |
| `../002-repo-convention-audit/audit.json` | Internal (this packet) | Green — already measured | Without it, every concrete count in `SKILL.md` §3/§3b would be unsourced |
| Plugin repository (`AGENTS.md`, `package.json`, `manifest.json`, `HANDOVER.md`, `src/`, `tools/`) | External (plugin repo) | Green — read this session | Without direct reads, stack claims (chart.js, eslint-plugin-obsidianmd, `isDesktopOnly`, renderer family names) would be guessed |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a later phase finds a claim in `SKILL.md` or `README.md` that no longer matches the
  live audit, the design plan, or the plugin tree (for example, the hub wiring in phase 003 lands
  with a different alias set than the design plan proposed).
- **Procedure**: correct the specific section in place; this is a documentation artifact, so
  rollback is an edit, not a revert. Phase `005-references-stack` has not yet consumed the file
  paths this phase named, so no downstream file depends on exact wording yet — only on the section
  shape and the named paths remaining stable.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Reading (templates + contracts + design + audit + plugin) ──► Drafting (SKILL.md, then README.md) ──► Verification (shape parity, citations, anachronism check)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Reading | None | Drafting |
| Drafting | Reading | Verification |
| Verification | Drafting | Phase 005 (references-stack) consuming `SKILL.md`'s reference map |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Reading | Med | Two style-template files, two authoring-contract files, one design plan, one audit file, plus targeted plugin-repository reads |
| Drafting | Med | Two files (`SKILL.md` ~260 lines, `README.md` ~150 lines) |
| Verification | Low | Header-parity diff, citation re-check, anachronism grep, scaffold-residue grep |
| **Total** | | **Single-session** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every template, contract, design-plan, and audit fact this phase cites was actually read this
      session, not recalled from training.
- [x] No file was written outside `$HUB/.opencode/skills/sk-code/sk-code-obsidian/{SKILL.md,README.md}`
      and this leaf's own folder.

### Rollback Procedure
1. Identify the stale claim or the section that drifted from its source.
2. Edit that section of `SKILL.md` or `README.md` in place with the corrected fact.
3. Re-run the shape-parity, citation, and anachronism checks in §5.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — this phase mutates only the two named files plus its own leaf folder.

<!-- /ANCHOR:enhanced-rollback -->
