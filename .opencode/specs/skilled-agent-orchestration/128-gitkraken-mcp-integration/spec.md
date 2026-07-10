---
title: "Feature Specification: Integrate the GitKraken MCP server into sk-git and Code Mode with advisor-routed utilization"
description: "Phase parent for registering the GitKraken MCP server (@gitkraken/gk mcp) as a Code Mode manual, documenting it inside sk-git with safety-scoped tool selection guidance, and updating sk-git's router plus the skill advisor's routing metadata so GitKraken-MCP-shaped requests reach sk-git automatically."
trigger_phrases:
  - "128-gitkraken-mcp-integration"
  - "phase parent"
  - "gitkraken mcp integration"
  - "gitkraken mcp sk-git"
  - "gitlens launchpad routing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/128-gitkraken-mcp-integration"
    last_updated_at: "2026-07-10T06:21:30Z"
    last_updated_by: "claude"
    recent_action: "All 5 phases complete; GitKraken MCP integrated end-to-end"
    next_safe_action: "Packet complete; no further action needed"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "128-gitkraken-mcp-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "GitKraken CLI (`gk`) is already installed locally (Homebrew, /opt/homebrew/bin/gk) and authenticated to GitHub; `gk mcp --list-tools` enumerates 31 real tools, confirming the README's tool list is incomplete"
      - "Registration target is a new top-level packet under the existing skilled-agent-orchestration track (117-127 exist), not a new hub — this adds one MCP server into the existing flat sk-git skill"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Integrate the GitKraken MCP server into sk-git and Code Mode with advisor-routed utilization

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration/128-gitkraken-mcp-integration |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | `.utcp_config.json` parses and Code Mode can list the `gitkraken` manual; `validate.sh --recursive --strict` passes on this whole track; the advisor's vocabulary-agreement vitest suite still passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
GitKraken publishes an MCP server (`gitkraken/mcp`, npm package `@gitkraken/gk`, stdio transport) exposing 31 tools spanning local git operations, GitLens AI workflows (commit composer, launchpad, PR review, start-work), and cross-platform issue/PR management across GitHub, GitLab, Azure DevOps, Bitbucket, and Jira. Neither `.utcp_config.json` (Code Mode) nor `sk-git` (the skill that owns all git/version-control intent) knows this server exists, so the AI has no path to it and no reason to reach for it.

### Purpose
Register the GitKraken MCP server as a Code Mode manual, document it inside `sk-git` with explicit tool-selection guidance that preserves sk-git's existing safety rules (ask-first worktree creation, no direct branch creation, deterministic conventional-commit format — see `SKILL.md` §4 RULES), and update both sk-git's own smart router and the skill advisor's routing metadata so GitKraken-MCP-shaped requests (cross-platform PR/issue triage, GitLens AI workflows, multi-repo queries) route to sk-git without the user having to name the tool explicitly.

A safety-relevant finding from research (phase 001) shapes this program: several GitKraken MCP tools (`git_add_or_commit`, `git_push`, `git_branch`, `git_checkout`, `git_worktree`) duplicate local-git mutations that sk-git already gates behind mandatory ask-first / conventional-commit / no-direct-branch rules. This packet must extend, not bypass, those guardrails — mirroring the existing `references/github_mcp_integration.md` precedent, which already routes local mutations to Bash and reserves the remote MCP for read/collaboration-rich operations.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for onboarding the GitKraken MCP server.
- The high-level outcome: one new Code Mode manual, one new sk-git reference doc with safety-scoped tool guidance, sk-git router + advisor metadata updates so utilization follows automatically.
- Per-phase implementation detail in the child folders.

### Out of Scope
- Detailed per-phase implementation plans at the parent level (they live in child `plan.md`/`tasks.md`).
- Building a new parent hub (unlike sibling packet `126-mcp-tooling-parent`, this adds one MCP server into the existing flat `sk-git` skill; `sk-git` does not become a hub).
- Changing GitHub MCP, `gh` CLI, or local `git` Bash workflows — those stay the primary path for local mutations and already-covered GitHub operations.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.utcp_config.json` | Modify | 002 | Register `gitkraken` as a stdio `manual_call_template` |
| `.opencode/skills/sk-git/references/gitkraken_mcp_integration.md` | Create | 003 | Tool-selection guide, safety carve-outs, usage examples |
| `.opencode/skills/sk-git/SKILL.md` | Modify | 003 | New intent signal, resource-map row, keyword triggers, references table row, safety rule |
| `.opencode/skills/sk-git/graph-metadata.json` | Modify | 004 | GitKraken domains/intent_signals/trigger_phrases |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Modify | 004 | GitKraken phrase boost for the explicit-author lane |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-research-and-context/ | Research gate (no writes): verified GitKraken MCP tool inventory, config shape, and safety-carve-out analysis against sk-git's existing rules | Planned |
| 2 | 002-utcp-config-registration/ | Register the `gitkraken` manual in `.utcp_config.json` | Planned |
| 3 | 003-sk-git-integration-doc-and-router/ | Author `gitkraken_mcp_integration.md` and update `SKILL.md`'s router, keyword triggers, references table, and safety rules | Planned |
| 4 | 004-advisor-routing-update/ | Update `sk-git/graph-metadata.json` and the explicit-lane phrase boosts so the advisor routes GitKraken-shaped prompts to sk-git | Planned |
| 5 | 005-verify-and-rollout/ | Terminal gates: JSON validity, `validate.sh --recursive --strict`, vocabulary-agreement vitest, advisor smoke test, parent rollup | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research-and-context | 002-utcp-config-registration | Verified tool inventory, config shape, and safety-carve-out list ready | Human review (research gate stops here) |
| 002-utcp-config-registration | 003-sk-git-integration-doc-and-router | `.utcp_config.json` parses; `gitkraken` manual present with correct stdio shape | `python3 -c "import json; json.load(open('.utcp_config.json'))"` passes |
| 003-sk-git-integration-doc-and-router | 004-advisor-routing-update | New reference doc + router edits present; safety carve-out documented | `validate.sh` on phase folder + a Grep confirming the new rule text exists in `SKILL.md` |
| 004-advisor-routing-update | 005-verify-and-rollout | Advisor metadata updated; vocabulary-agreement vitest still green | `npx vitest run vocabulary-agreement` (or the project's configured runner) passes |
| 005-verify-and-rollout | (done) | All terminal gates pass; parent rolled up | `validate.sh --recursive --strict` 0 errors across parent + 5 phases |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None outstanding. Registration scope, transport shape, and safety carve-out were resolved empirically in phase 001 against the locally installed `gk` CLI before this parent was authored.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Prior art**: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/` (broader hub-merge program; this packet is narrower — one server into an existing skill)
