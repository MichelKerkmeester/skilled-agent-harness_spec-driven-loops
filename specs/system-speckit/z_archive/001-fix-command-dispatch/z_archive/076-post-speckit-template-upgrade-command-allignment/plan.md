---
title: "Implementation Plan: Post-SpecKit Template Upgrade - Command Alignment"
description: "Reconstructed delivery plan for the command alignment packet, derived from spec.md, implementation-summary.md and git history."
trigger_phrases:
  - "command alignment implementation plan"
  - "post template upgrade rollout"
importance_tier: "important"
contextType: "planning"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Post-SpecKit Template Upgrade - Command Alignment

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command files and YAML command assets |
| **Framework** | OpenCode command system; command_template.md standards |
| **Storage** | Not recorded |
| **Testing** | Per-phase grep verification; verification matrix in `implementation-summary.md` |

### Overview

Align 19 OpenCode commands and their YAML assets with command_template.md and SpecKit v1.9.0 CORE + ADDENDUM v2.0 standards. The work spans section header standardization, parenthetical header cleanup, a mandatory gate for `/memory:search`, frontmatter corrections, OUTPUT FORMATS sections, cross-reference fixes, and YAML asset alignment.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Specs 072-075 analyzed
- [x] Current system-spec-kit state assessed
- [x] Command alignment gaps identified

### Definition of Done
- [x] 19/19 commands compliant with command_template.md
- [x] 20/20 YAML assets compliant with SpecKit v1.9.0
- [x] Cross-reference errors resolved
- [x] Verification matrix recorded in `implementation-summary.md`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Approach

Command alignment was split by namespace (spec_kit, memory, create, search) so each agent applied one consistent pattern, with a separate validation pass across all commands. YAML assets were handled as a second track: 20 files analyzed first, then fixed in namespace groups.

### Affected Surfaces

- `.opencode/commands/spec_kit/` (7 commands)
- `.opencode/commands/memory/` (4 commands)
- `.opencode/commands/create/` (6 commands)
- `.opencode/commands/search/` (2 commands)
- `.opencode/commands/spec_kit/assets/` (YAML assets)
- `.opencode/commands/create/assets/` (YAML assets)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. PHASES

| Phase | Description |
|-------|-------------|
| 1 | Section header standardization: replace `🔜 WHAT NEXT?` with `📌 NEXT STEPS` (14 files) |
| 2 | Parenthetical text removal from H2 headers (11 files) |
| 3 | Mandatory gate addition for `/memory:search` (1 file) |
| 4 | Frontmatter corrections for `/create:skill` and `/create:agent` (2 files) |
| 5 | Cross-reference fix in `/memory:database` (1 file) |
| 6 | OUTPUT FORMATS sections across spec_kit commands (7 files) |
| 7 | YAML asset analysis (20 files, 10 research agents) |
| 8 | spec_kit_plan YAML fixes: Level 1 required files and version (2 files) |
| 9 | spec_kit_resume YAML fixes: anchor-based memory retrieval (2 files) |
| 10 | spec_kit_research and handover YAML fixes: version and critical rules |
| 11 | create namespace YAML fixes: version and mode headers (5 files) |
| 12 | create_agent.yaml deep restructure: unified permissions, terminology, modes |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING

### Verification Approach

Per-phase grep checks recorded in `implementation-summary.md`, covering the emoji vocabulary, section presence, gate presence, frontmatter format, cross-reference target, and YAML field alignment.

### Verification Matrix

The full matrix (13 checks, all PASS) is recorded in `implementation-summary.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/072-speckit-template-memory-ranking-release`
- `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/073-speckit-template-optimization`
- `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/074-speckit-template-optimization-refinement`
- `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/075-post-speckit-template-upgrade-testing`
- `.opencode/skills/system-spec-kit/`
- `.opencode/commands/`
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK

Not recorded. The source documents do not describe a rollback plan.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Pre-Task Checklist
- [ ] Read spec.md, this plan and tasks.md before the first edit
- [ ] Confirm the target files match the workstream ownership in tasks.md
- [ ] Know the verification command for the task before starting it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute tasks in dependency order; parallel work stays inside one workstream |
| TASK-SCOPE | Touch only the files the task names; report anything else as a finding |
| TASK-VERIFY | Run the task's verification before marking it complete |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol
1. Mark the task BLOCKED with the blocking fact
2. Record the fact in the tasks.md blocked section
3. Continue with the next unblocked task; escalate after two blocked tasks
<!-- /ANCHOR:ai-execution -->
