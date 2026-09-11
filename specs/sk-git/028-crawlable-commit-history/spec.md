---
title: "Feature Specification: Crawlable Commit History"
description: "A numbered, search-optimized commit message format for sk-git, its hook and search surface, and the retroactive rewrite of the 9,106 commits already on main and skilled/v4.0.0.0."
trigger_phrases:
  - "crawlable commit history"
  - "numbered commit format"
  - "searchable commit messages"
  - "commit id scheme"
  - "retroactive commit rewrite"
  - "filter-repo message rewrite"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/028-crawlable-commit-history"
    last_updated_at: "2026-09-11T09:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Scaffolded the six-phase packet and authored the parent directive"
    next_safe_action: "Run phase 001 research: 10 iterations, cli-pi, deepseek-v4.1-flash at max"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/scripts/git-hooks/commit-msg"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-028"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Crawlable Commit History

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-11 |
| **Branch** | `worktrees/048-crawlable-commit-history` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-git/028-crawlable-commit-history |
| **Predecessor** | sk-git/027-remote-push-approval |
| **Successor** | None |
| **Handoff Criteria** | All six phases validate under --strict, the new format is enforced by the commit-msg hook, and the rewritten history is on origin with citations remapped |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-git's commit contract produces readable conventional commits, but nothing in a commit is addressable the way a spec packet is. A packet has a track and a number, `sk-git/028`, and any reader or search tool can find it from that alone. A commit has a hash nobody remembers and a subject that the `commit-msg` hook forbids from carrying a number. The only link from a commit to its packet is an optional `Refs:` line in the body. With 9,106 commits on `skilled/v4.0.0.0`, finding the commits behind a packet, a phase or a decision means reading `git log` by eye.

### Purpose
Give every commit a stable, numbered, crawlable identity and a body shaped for search, enforce that shape in the hook and the skill, and retrofit the existing history on `main` and `skilled/v4.0.0.0` so old and new commits are searchable the same way. The ~11,000 commit-hash citations inside `specs/` are remapped in the same step so no document goes stale.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A researched, evidence-backed commit grammar: subject, body, trailers and a numbered identifier that survives search by `git log --grep`, GitHub search and the spec-kit trigger index.
- The sk-git contract update: `SKILL.md` commit logic, the commit-message template asset, the commit workflow reference, the preflight advisory rule and the blocking `commit-msg` hook, each with a test.
- The search surface the format promises: recipes, and an index only if research shows plain `git log` is not enough.
- The retroactive rewrite of `main`, `skilled/v4.0.0.0` and the tags phase 005 lists from the live refs with `git filter-repo`, an old-to-new hash map and a citation remap over `specs/**/*.md`.
- A repo rule for the git discipline, wired into `REPO RULES.md` and reflected in `AGENTS.md`, if phase 002 decides the current rules do not already cover it.
- An analysis of every git workflow that can fail an automated run, and the adjustments that stop it.
- sk-git documentation, changelog, advisor vocabulary and skill-root metadata for the new capability.

### Out of Scope
- Rewriting the other 57 local branches or the 20 worktrees. They are rebased onto the rewritten lines or archived, and phase 005 records which.
- A second history rewrite for any reason other than the format. Secrets, large files and author fixes stay out.
- Changing the worktree and branch naming grammar sk-git already owns.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-research/research/research.md` | Create | 001-research | Ten-iteration findings on grammar, identifier minting and safe rewrite |
| `002-format-decision/decision-record.md` | Create | 002-format-decision | The frozen grammar and the rewrite mapping rule |
| `.opencode/skills/sk-git/SKILL.md` | Modify | 003-contract-and-hook | Commit Message Logic section and the ALWAYS/NEVER rules |
| `.opencode/skills/sk-git/assets/commit-message-template.md` | Modify | 003-contract-and-hook | Worked examples in the new grammar |
| `.opencode/skills/sk-git/references/commit-workflows.md` | Modify | 003-contract-and-hook | The seven-step workflow with identifier minting |
| `.opencode/scripts/git-hooks/commit-msg` | Modify | 003-contract-and-hook | Regexes for the new subject, body and trailer contract, plus a test beside it |
| `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs` | Modify | 003-contract-and-hook | Advisory rule for the new shape |
| `.opencode/skills/sk-git/references/quick-reference.md` | Modify | 004-search-surface | Search recipes |
| `.opencode/skills/sk-git/feature-catalog/` | Modify | 004-search-surface | Catalog entry for the search surface |
| `005-history-rewrite/scripts/` | Create | 005-history-rewrite | filter-repo message callback, hash-map emitter and citation remapper |
| `specs/**/*.md` | Modify | 005-history-rewrite | Commit-hash citations remapped to the rewritten hashes |
| `.opencode/skills/sk-git/README.md` | Modify | 006-docs-and-release | Capability overview |
| `.opencode/skills/sk-git/changelog/v1.6.0.0.md` | Create | 006-docs-and-release | Release entry |
| `.opencode/skills/sk-git/graph-metadata.json` | Modify | 006-docs-and-release | Advisor vocabulary for commit search |
| `repo-rules/<git-rule>.md` | Create | 006-docs-and-release | The git discipline rule, if 002 decides one is needed |
| `REPO RULES.md` | Modify | 006-docs-and-release | Trigger row routing git actions to the rule |
| `AGENTS.md` | Modify | 006-docs-and-release | Section 5 Git Workspace Safety row for commit identity and run-safe git |
| `.opencode/scripts/git-hooks/*` and `.opencode/bin/git-sync.sh` | Modify | 007-git-workflow-run-failures | Adjustments so hooks and live-sync cannot fail an automated run |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-research/` | Ten iterations of deep research on commit grammar, identifier minting and safe history rewrite, run by cli-pi with DeepSeek V4.1 Flash at max | Complete |
| 2 | `002-format-decision/` | Freeze the grammar, the identifier scheme and the rewrite mapping rule in a decision record the operator approves | Complete |
| 3 | `003-contract-and-hook/` | Update the sk-git contract, the commit-msg hook and the preflight rule, each with a test | Complete |
| 4 | `004-search-surface/` | Search recipes, catalog and playbook entries, and an index only if research shows one is needed | Complete |
| 5 | `005-history-rewrite/` | Rewrite main, skilled/v4.0.0.0 and tags on a mirror clone, remap citations in specs, force-push after a written rollback and an explicit yes | Planned |
| 6 | `006-docs-and-release/` | README, changelog, advisor metadata, skill-root metadata, the git repo rule with its REPO RULES.md and AGENTS.md integration, and the parent closeout, executed last | Planned |
| 7 | `007-git-workflow-run-failures/` | Analyze every git workflow that can fail an automated run and adjust sk-git and the hooks so it does not, executed before 006 | Planned |

| 7 | 007-git-workflow-run-failures/ | [Phase 7 scope] | Pending |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research | 002-format-decision | Ten iteration records and a ranked research.md exist | `deep-research-state.jsonl` holds 10 iteration records |
| 002-format-decision | 003-contract-and-hook | Operator approved the grammar in decision-record.md | Approval recorded in the decision record |
| 003-contract-and-hook | 004-search-surface | Hook and rule tests pass, drift guards green | `node --test` and `run-all-drift-guards.sh` exit 0 |
| 004-search-surface | 005-history-rewrite | Every recipe resolves a known commit | Recipes run against HEAD |
| 005-history-rewrite | 006-docs-and-release | Rewritten lines on origin, zero unmapped citations, recursive validate green | `validate.sh --recursive --strict` PASSED |
| 005-history-rewrite | 007-git-workflow-run-failures | Rewritten lines on origin | followers synced |
| 007-git-workflow-run-failures | 006-docs-and-release | Every run-failing workflow adjusted with a test or reproduction | `node --test` and hook tests exit 0 |
| 006-docs-and-release | Done | sk-doc validators, skill-root metadata gate and repo-rule validation green | `validate_document.py`, `package_skill.py --check`, `ci-skill-root-metadata.cjs` exit 0 |
| 006-docs-and-release | 007-git-workflow-run-failures | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- What identifier survives both branches: a per-track counter minted at commit time, or a derived key from packet path plus a sequence? Phase 001 answers with evidence.
- Does the retrofit assign identifiers to old commits from their `Refs:` lines and touched packet paths, or from a fixed ordinal? Phase 001 answers, phase 002 decides.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
