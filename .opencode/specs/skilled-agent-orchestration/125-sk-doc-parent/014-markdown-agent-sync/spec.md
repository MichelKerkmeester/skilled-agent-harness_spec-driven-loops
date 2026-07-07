---
title: "Feature Specification: Align markdown agent files with current sk-doc setup"
description: "Reconcile .opencode/agents/markdown.md and .claude/agents/markdown.md against the post-010-013 sk-doc hub: dissected references, regrouped create-skill, the 10-packet set, the create_quality_control rename, and the flattened shared/references/."
trigger_phrases:
  - "markdown agent sync"
  - "125 sk-doc phase 014"
  - "markdown.md sk-doc reconciliation"
importance_tier: "important"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/014-markdown-agent-sync"
    last_updated_at: "2026-07-07T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Spec/plan/tasks authored; blocked on 011-013 landing first"
    next_safe_action: "Wait for 012 (rename) and 013 (reorg) to land, then diff both agents"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Align markdown agent files with current sk-doc setup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `skilled-agent-orchestration/125-sk-doc-parent` |
| **Depends On** | `012-quality-control-rename/`, `013-shared-refs-reorg/` |
| **Predecessor** | `013-shared-refs-reorg/` |
| **Successor** | none (last phase of this follow-up sub-arc) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/agents/markdown.md` and `.claude/agents/markdown.md` are the two runtime mirrors of the markdown-authoring agent, and both cite `sk-doc` packet paths directly (template paths per `/create:*` command, the required-reading table, and the resource inventory). Today those citations already reflect the dissected `*_creation.md` references and the regrouped `create-skill/assets/{skill,parent_skill}/` structure, and neither file names the `doc-quality` packet or a `shared/references/global/` path today. Once phases 011-013 land (router alignment, the `doc-quality` -> `create_quality_control` rename, and the `shared/references/global/` flatten), both files need a fresh pass to confirm nothing they cite has silently drifted.

### Purpose
After 012 and 013 land, diff both agent files against the actual sk-doc tree and update any path, packet name, or packet-count citation that no longer matches — keeping the two runtime mirrors (`.opencode/agents/` and `.claude/agents/`) identical to each other in content.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-diff both `markdown.md` files against the sk-doc tree after 011-013 land.
- Update any citation of a renamed `doc-quality` path to `create_quality_control`.
- Update any citation of a `shared/references/global/` path to the flattened `shared/references/` path.
- Confirm the `/create:*` command-to-template table lists all 10 packets accurately and stays byte-identical in content between the two runtime mirrors.

### Out of Scope
- Rewriting the agent's operating behavior, tool permissions, or decision logic — citations and path/name references only.
- The router alignment (011), the rename (012), and the reorg (013) themselves — this phase only reconciles the agent files afterward.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/agents/markdown.md` | Update | Repoint any citation stale after 011-013; confirm packet inventory |
| `.claude/agents/markdown.md` | Update | Same reconciliation, kept content-identical to the opencode mirror |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Neither agent file cites the pre-rename `doc-quality` path | Grep for `doc-quality` in both files returns 0 hits (or only intentional historical prose, none path-bearing) |
| REQ-002 | Neither agent file cites a `shared/references/global/` path | Grep for `references/global` in both files returns 0 hits |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The `/create:*` command-to-template table accurately lists all 10 packets | Manual cross-check against `.opencode/skills/sk-doc/mode-registry.json` |
| REQ-004 | Both runtime mirrors stay content-identical | `diff .opencode/agents/markdown.md .claude/agents/markdown.md` shows no unintended divergence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both agent files cite only paths and packet names that exist on disk after 011-013 land.
- **SC-002**: The two runtime mirrors remain content-identical.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `012-quality-control-rename/` and `013-shared-refs-reorg/` must land first | Diffing against a not-yet-renamed/reorganized tree would produce a no-op or wrong update | Sequence this phase last; verify 012/013 completion before starting the diff |
| Risk | The two runtime mirrors drift from each other during independent edits | Divergent agent behavior between OpenCode and Claude Code runtimes | Edit both files in the same pass and diff them against each other before closing the phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the agent's DQI-scoring prose (currently path-agnostic, no hardcoded packet reference) gain an explicit `create_quality_control` citation, or stay generic? Default: stay generic, since it already works without a hardcoded path and a hardcoded citation would reintroduce the same staleness risk this phase is closing out.
<!-- /ANCHOR:questions -->
