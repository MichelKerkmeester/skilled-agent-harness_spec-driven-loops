---
title: "Implementation Plan: Skill and Command README [skilled-agent-orchestration/033-skill-command-readme-rewrite/plan]"
description: "Batch plan for rewriting skill README files and the command README surfaces with the upgraded sk-doc standards."
trigger_phrases:
  - "readme rewrite plan"
  - "skill readme plan"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/033-skill-command-readme-rewrite"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Skill and Command README Rewrite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | sk-doc README standards applied across skill and command surfaces |
| **Storage** | Git-tracked README and packet files |
| **Testing** | HVR review, structural checks, and spec validation |

### Overview
This packet records a batch rewrite program across the skill README surfaces under `.opencode/skills/` and the command README surfaces currently stored as `.opencode/commands/README.txt`, `.opencode/commands/create/README.txt`, `.opencode/commands/memory/README.txt`, and `.opencode/commands/speckit/README.txt`. The plan uses `.opencode/skills/sk-doc/references/specific/readme_creation.md`, `.opencode/skills/sk-doc/assets/documentation/readme_template.md`, and `.opencode/skills/sk-doc/references/global/hvr_rules.md` as the standards baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Standards baseline available from spec 032
- [x] Skill README surfaces identified under `.opencode/skills/`
- [x] Command README surfaces identified under `.opencode/commands/`
- [x] Rewrite scope broken into batches

### Definition of Done
- [ ] Packet docs use template-compliant headers and anchors
- [ ] Packet references point at the current committed repo files
- [ ] Validator exits with no hard errors for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Batch-oriented documentation rewrite program driven by shared standards and per-surface source documents.

### Key Components
- **Standards inputs**: `.opencode/skills/sk-doc/references/specific/readme_creation.md`, `.opencode/skills/sk-doc/assets/documentation/readme_template.md`, `.opencode/skills/sk-doc/references/global/hvr_rules.md`
- **Skill sources**: the committed `README.md` files under `.opencode/skills/` plus their paired skill definitions under the same folders
- **Command sources**: `.opencode/commands/README.txt`, `.opencode/commands/create/README.txt`, `.opencode/commands/memory/README.txt`, `.opencode/commands/speckit/README.txt`
- **Exemplars**: `.opencode/skills/system-spec-kit/README.md`, `.opencode/skills/system-spec-kit/mcp_server/README.md`, `.opencode/skills/system-spec-kit/SHARED_MEMORY_DATABASE.md`

### Data Flow
The standards files define structure and voice, the skill and command sources provide the raw feature content, and the exemplars provide quality targets for the rewrite batches and later review.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Lock the standards baseline from spec 032
- [x] Group the rewrite targets into five batches
- [x] Identify the command README surfaces that still live as `.txt` files in the repo

### Phase 2: Core Implementation
- [x] Rewrite the CLI skill READMEs
- [x] Rewrite the MCP skill READMEs
- [x] Rewrite the sk-code and sk-doc READMEs
- [x] Rewrite the remaining skill READMEs
- [x] Update the command README surfaces and the root README follow-up notes

### Phase 3: Verification
- [ ] Re-run packet validation after the structural repair
- [ ] Confirm the packet cites current repo paths for skills and commands
- [ ] Record any remaining non-blocking warnings separately from hard errors
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Standards verification | Packet references to the sk-doc standards files | Manual path review and spec validator |
| Surface verification | Skill and command README source paths cited in the packet | Manual existence checks against `.opencode/skills/` and `.opencode/commands/` |
| Completion review | Batch summaries in `tasks.md` and `implementation-summary.md` | Manual consistency review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skills/sk-doc/references/specific/readme_creation.md` | Internal | Green | Rewrite standards become unclear |
| `.opencode/skills/sk-doc/assets/documentation/readme_template.md` | Internal | Green | Structural scaffold becomes unclear |
| `.opencode/skills/sk-doc/references/global/hvr_rules.md` | Internal | Green | Voice and HVR expectations lose traceability |
| `.opencode/skills/system-spec-kit/README.md` | Internal | Green | Exemplar quality target weakens |
| `.opencode/commands/speckit/README.txt` | Internal | Green | Command-surface documentation source becomes less explicit |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The packet repair misstates the rewrite program or cites command and skill paths that do not exist in the current repo.
- **Procedure**: Revert the packet docs and rebuild them from the committed skill, command, and standards files.

<!-- ANCHOR:phase-deps -->
### L2: PHASE DEPENDENCIES
The standards baseline feeds batching, batching feeds the recorded rewrite work, and the recorded rewrite work feeds final packet validation.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
### L2: EFFORT ESTIMATION
The packet repair is moderate because it consolidates a large rewrite history into template-safe sections and current repo references.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
### L2: ENHANCED ROLLBACK
If rollback is needed, treat the committed README and README.txt surfaces as the source of truth and re-author only the packet docs.
<!-- /ANCHOR:enhanced-rollback -->
<!-- /ANCHOR:rollback -->

---
