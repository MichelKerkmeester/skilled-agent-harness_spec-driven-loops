---
title: "Plan: sk-git Feature Catalog and Manual-Playbook Coverage"
description: "Plan to author sk-git's feature catalog and add owner-first worktree-tooling manual-playbook scenarios via two parallel Sonnet-5 builders, verified against the sk-doc create-feature-catalog and create-manual-testing-playbook canon."
trigger_phrases:
  - "sk-git feature catalog plan"
  - "sk-git playbook scenarios plan"
  - "worktree tooling documentation plan"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/011-feature-catalog-and-manual-playbook"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Completed catalog and playbook"
    next_safe_action: "Commit packet 004 deliverables"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-feature-catalog-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: sk-git Feature Catalog and Manual-Playbook Coverage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Deliverable A** | `.opencode/skills/sk-git/feature_catalog/feature_catalog.md` (new) |
| **Deliverable B** | New manual-playbook category + scenarios for the owner-first worktree tooling |
| **Canon** | `sk-doc/create-feature-catalog`, `sk-doc/create-manual-testing-playbook` |
| **Executor** | Two parallel Sonnet-5 (xhigh) builders + a canon-conformance verify pass |
| **Registration** | SKILL.md / README / graph-metadata cross-refs owned by the orchestrator |

### Overview

Bring sk-git to create-skill-canon parity by authoring the missing feature catalog and extending the manual-testing playbook to cover the worktree tooling. Two disjoint deliverables build in parallel (one writer each), a fresh reviewer verifies each against its canon template, and the orchestrator registers the catalog and reconciles the packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement | Verification |
|------|-------------|--------------|
| Catalog conformance | Matches the create-feature-catalog template | Template + reviewer check |
| Catalog completeness | All 11 capabilities cataloged incl. the 4 scripts | Reviewer checklist |
| Playbook conformance | Matches the create-manual-testing-playbook template | Template + reviewer check |
| Scenario coverage | Allocator/wrapper/reaper/pre-push each covered (valid+invalid) | Reviewer checklist |
| Packaging | Checker stays PASS | `package_skill.py --check` |
| Links | No broken links hub-wide | Link resolution scan |
| Structure | This packet valid | `validate.sh --strict` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Deliverable map

| Deliverable | Location | Canon source |
|-------------|----------|--------------|
| Feature catalog | `sk-git/feature_catalog/feature_catalog.md` | `sk-doc/create-feature-catalog/assets/feature_catalog_template.md` |
| Playbook scenarios | `sk-git/manual_testing_playbook/<new-category>/**` + index update | `sk-doc/create-manual-testing-playbook` |

### Capability surface cataloged

Owner-first allocator/validators, launch-wrapper session isolation, worktree reaper, pre-push naming hook (the four scripts), plus continuous-integration autosync, worktree/commit/finish workflows, GitKraken MCP, GitHub MCP, and the large-reorg playbook.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Build (parallel Sonnet-5 xhigh)

- **Builder A**: load create-feature-catalog canon → catalog every sk-git capability with per-feature fields; self-check `package_skill.py --check`.
- **Builder B**: load create-manual-testing-playbook canon → add a worktree-tooling category with GIT-NNN scenarios (allocator/wrapper/reaper/pre-push, valid+invalid); update the root index/count/coverage-note.

### Phase 2 — Verify (parallel reviewers)

Fresh reviewers check each deliverable against its canon template: structure, frontmatter, completeness, link resolution, checker PASS. Findings feed a fix pass.

### Phase 3 — Register + reconcile (orchestrator)

Add SKILL.md/README/graph-metadata cross-references for the catalog + new scenarios; reconcile packet docs; run terminal gates and regenerate metadata last.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Scope | Tool |
|-------|-------|------|
| Packaging | sk-git skill | `package_skill.py --check` |
| Links | New docs | path-resolution scan |
| Template | Catalog + scenarios | canon template compare (reviewer) |
| Structure | This packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| create-feature-catalog canon | Internal | Required | Template authority for the catalog |
| create-manual-testing-playbook canon | Internal | Required | Template authority for the scenarios |
| sk-git scripts (hardened by 003) | Internal | Parallel | Document the stable contract; converge before final |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Additive documentation only — revert the packet's commit to remove the catalog + new scenarios; no code or behavior changes to undo.
<!-- /ANCHOR:rollback -->
