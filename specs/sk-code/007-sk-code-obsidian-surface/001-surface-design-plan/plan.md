---
title: "Implementation Plan: sk-code-obsidian Surface Design Plan"
description: "Execution plan for producing mode-design-plan.md: the reading order across the live hub contract and the measured plugin audit, then the drafting order for each design section."
trigger_phrases:
  - "sk-code-obsidian design plan execution"
  - "surface design plan reading order"
  - "obsidian surface plan drafting"
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
    answered_questions: []
---
# Implementation Plan: sk-code-obsidian Surface Design Plan

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON/JSONC, Python-shaped routing blocks (design text, no executed code) |
| **Framework** | `sk-code` parent-hub contract (`mode-registry.json`, `hub-router.json`, `ROUTER.md`, `shared/references/stack-detection.md`) |
| **Storage** | None — this phase writes only to `specs/sk-code/007-sk-code-obsidian-surface/001-surface-design-plan/` |
| **Testing** | None executable; verification is citation accuracy against live files, not a test run |

### Overview
This plan produces one design document (`mode-design-plan.md`) by reading the live `sk-code` hub
contract and the measured plugin audit, then drafting nine numbered sections that mirror
`sk-code-mobile-cli`'s shape: packet identity, the registry entry, the router wiring, the OBSIDIAN
detection branch with its symlink guard, the reference map, the machine-readable routing block, the
workflow-doctrine symlinks, and the build-packet handoff. No skill file is written; the deliverable
is the design a later build packet consumes.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Live hub files read in full: `mode-registry.json`, `hub-router.json`, `stack-detection.md`, `sk-code/SKILL.md`, `sk-code/ROUTER.md`.
- [x] Doctrine read in full: `skill-root-metadata-contract.md`, `parent-skills-nested-packets.md`.
- [x] Template packet read in full: `sk-code-mobile-cli/` (`SKILL.md`, `README.md`, and its full file tree).
- [x] Measured plugin state read: `002-repo-convention-audit/audit.json`, `goal.md`, `spec.md`, `roadmap.md`, the plugin's `AGENTS.md` and `package.json`.

### Definition of Done
- [x] `mode-design-plan.md` created, 200-320 lines, upper-case numbered sections.
- [x] Every JSONC/bash/python block in it is checked against a live file's current content, not invented.
- [x] `spec.md`, `plan.md`, and `tasks.md` in this folder replaced with real content — no scaffold placeholders remain.
- [x] No file written outside this leaf's folder.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-then-cite. Every section of `mode-design-plan.md` names the file it was checked against
before it states a design decision, so a later build packet can re-verify each claim rather than
trust the plan on faith.

### Key Components
- **Grounding pass**: reads the hub contract (registry, router, detection, doctrine) and the
  template packet (`sk-code-mobile-cli/`) in full before any drafting.
- **Measurement pass**: reads `002-repo-convention-audit/audit.json` and the parent packet's
  `goal.md`/`spec.md`/`roadmap.md` for the frozen scope and the real plugin counts.
- **Design draft**: nine sections of `mode-design-plan.md`, each naming its citation inline.
- **Spec-kit wrapper**: `spec.md`, `plan.md`, `tasks.md` restate the same work in the level-2
  spec-kit shape, so this leaf validates like every sibling phase folder.

### Data Flow
Live hub files + measured audit → cited design decisions in `mode-design-plan.md` → the
spec-kit wrapper documents around it → phase `003-hub-wiring` reads `mode-design-plan.md` as its
own input contract.

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
| Citation check | Every structural claim in `mode-design-plan.md` names a real file/path | Manual re-read against the cited file |
| Disjointness check | The five proposed aliases against the 33 live aliases | Manual comparison against `mode-registry.json`'s live `aliases[]` arrays |
| Line-count check | `mode-design-plan.md` is 200-320 lines | `wc -l mode-design-plan.md` |
| Scaffold-residue check | No `REQUIREMENT_PLACEHOLDER` or bare `**Given**` remains in `spec.md`/`plan.md`/`tasks.md` | `grep` for the scaffold markers |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `$HUB/.opencode/skills/sk-code/mode-registry.json`, `hub-router.json`, `shared/references/stack-detection.md` | External (hub repo) | Green — read in full | Without these, §3-5 of `mode-design-plan.md` would be invented rather than cited |
| `$HUB/.opencode/skills/sk-code/sk-code-mobile-cli/` | External (hub repo) | Green — read in full | The shape template; deviating from it violates `goal.md` §3's frozen constraint |
| `002-repo-convention-audit/audit.json` | Internal (this packet) | Green — already measured | Without it, §6's reference-map counts would be unsourced |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a later phase finds a citation in `mode-design-plan.md` no longer matches the live hub file (the contract moved again).
- **Procedure**: correct the specific cited section in place; this is a documentation artifact, so rollback is an edit, not a revert. No downstream file depends on this leaf's exact wording yet — phase 003 has not executed.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Grounding (hub + template + audit) ──► Drafting (9 sections) ──► Verification (citations, line count)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Grounding | None | Drafting |
| Drafting | Grounding | Verification |
| Verification | Drafting | Phase 003 (hub-wiring) consuming this plan |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Grounding | Med | Reading ~15 files across two repositories |
| Drafting | Med | One 280-line design document, nine sections |
| Verification | Low | Citation re-check, line count, scaffold-residue grep |
| **Total** | | **Single-session** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every live file this plan cites was actually opened and read this session, not recalled from training.
- [x] No packet file was written outside `001-surface-design-plan/`.

### Rollback Procedure
1. Identify the stale citation or section.
2. Edit that section of `mode-design-plan.md` in place with the corrected fact.
3. Re-run the citation and line-count checks in §5.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — this phase mutates only its own folder's markdown.

<!-- /ANCHOR:enhanced-rollback -->
