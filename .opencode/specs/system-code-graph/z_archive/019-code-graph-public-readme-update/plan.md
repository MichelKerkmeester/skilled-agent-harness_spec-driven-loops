---
title: "Implementation Plan: Public README Update"
description: "Plan for updating the repository-root README as a factual aggregation layer after system-code-graph extraction."
trigger_phrases:
  - "015 public readme update plan"
  - "readme standalone mcp topology plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/z_archive/019-code-graph-public-readme-update"
    last_updated_at: "2026-05-14T19:30:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-015"
    recent_action: "Verified README aggregation update; staging blocked"
    next_safe_action: "Stage from writable shell"
    blockers:
      - ".git/index.lock creation is EPERM in this sandbox"
    key_files:
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-015-public-readme-update"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Public README Update

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Document** | Repository-root `README.md` |
| **Standards** | `sk-doc` README quality guidance: scannable structure, accurate cross-references, no placeholders |
| **Topology** | Standalone `spec_kit_memory`, `system_skill_advisor`, `system_code_graph`, `cocoindex_code`, `code_mode`, `sequential_thinking` |
| **Validation** | sk-doc structure check, local link check, strict spec validation |

### Overview

The README change updates existing sections rather than replacing the document. It keeps the file as a public aggregation page and links to the existing skill and spec docs for detail.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 answered with the new 015 packet path.
- [x] Existing README read.
- [x] sk-doc README quality guidance read.
- [x] system-code-graph and runtime config evidence checked.

### Definition of Done

- [x] README updated with standalone code graph and MCP topology.
- [x] README local links checked.
- [x] README placeholder scan checked.
- [x] 015 strict validation exits 0.
- [x] Scoped staging command attempted for only README and 015 packet files; sandbox blocked `.git/index.lock`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Public aggregation update. The README points to canonical skill docs, config, and spec packets instead of duplicating full subsystem internals.

### Key Components

- **README overview**: Counts, topology diagram, recent shipped work callout.
- **Quick start**: Build/install sequence for memory scripts, standalone advisor, standalone code graph, CLI scripts, and CocoIndex.
- **Feature sections**: Memory, Code Graph, Skill Advisor, skills library, native MCP server table.
- **Related documents**: Links to system-code-graph and system-skill-advisor docs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence Collection

- Read root README.
- Read sk-doc README creation and validation guidance.
- Read system-code-graph and system-skill-advisor skill/config evidence.
- Read relevant 014/038/039 packet evidence.

### Phase 2: README Update

- Update overview counts and topology language.
- Add recent shipped work callout.
- Update quick-start and code-graph sections.
- Update skill index, native MCP table, FAQ, and related docs.

### Phase 3: Verification and Commit

- Run sk-doc README validation.
- Run local link and placeholder checks.
- Run strict 015 packet validation.
- Stage only `README.md` and the 015 packet folder.
- Commit with the requested message if sandbox permits.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | README format | `python3 .opencode/skills/sk-doc/scripts/validate_document.py README.md --type readme` |
| Link sanity | Local markdown links in README | shell path-existence check |
| Placeholder sanity | README and packet docs | `rg` for placeholder markers |
| Spec validation | 015 packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 014 extraction docs | Internal | Green | Source of truth for first-class code graph ownership. |
| Runtime config server names | Internal | Green | Source of truth for current `system_code_graph` naming. |
| Packet 010 rename | Parallel | External | Mentioned as possible supersession only; not touched. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: README validation finds structural or link regressions that cannot be fixed within scope.
- **Procedure**: Revert only `README.md` and this 015 packet from the staged set before commit.
<!-- /ANCHOR:rollback -->
