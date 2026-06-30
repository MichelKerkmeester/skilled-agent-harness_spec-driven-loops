---
title: "112 — Commit Standards & Retroactive Rewrite (Phase Parent)"
description: "Define canonical commit-message standards, embed them in sk-git, then retroactively rewrite all 2,795 HEAD commits via cli-devin SWE-1.6 in a deep-skill-style iteration loop."
trigger_phrases:
  - "112-commit-standards-and-retroactive-rewrite"
  - "commit standards"
  - "retroactive commit rewrite"
  - "sk-git standards update"
  - "cli-devin commit rewrite"
  - "git filter-repo message rewrite"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/091-commit-standards-and-retroactive-rewrite"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded phase parent + 5 phase children; populated parent spec.md root purpose and phase map"
    next_safe_action: "Begin Phase 002 (commit-standards-definition) with Sequential Thinking MCP"
    blockers: []
    key_files:
      - "spec.md"
      - "001-prerequisites-and-baseline/spec.md"
      - "002-commit-standards-definition/spec.md"
      - "003-sk-git-skill-update/spec.md"
      - "004-cli-devin-rewrite-prompts/spec.md"
      - "005-retroactive-rewrite-execution/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Phase 002 must lock the 7 standards decisions before any downstream phase starts"
    answered_questions:
      - "Force-push to origin? — No, local-only rewrite"
      - "Rewrite scope? — HEAD only (2,795 commits), not --all"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# 112 — Commit Standards & Retroactive Rewrite

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase Parent (lean trio) |
| **Priority** | P1 |
| **Status** | In Progress (scaffold complete; Phase 002 next) |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Spec** | None (top-level packet) |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All 5 phase children pass `validate.sh --strict`; HEAD commit log matches the new standards under a 5% adversarial sample |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `sk-git` skill documents conventional-commit-style standards at `.opencode/skills/sk-git/SKILL.md` §3 and `assets/commit_message_template.md`, but the git log itself does not follow them. A 30-commit sample of recent HEAD shows 100% of commits prefixed with internal packet IDs (`111 W3.C:`, `111 W3.D-A:`), no message bodies, no Co-Authored-By trailers on the most recent activity (older history carries 3,498 Claude trailers in various forms), and free-form subjects that violate the imperative-mood + length rules. The standards exist on paper but nothing enforces them at commit time, and no retroactive normalization has been performed.

### Purpose

Three outcomes, in strict phase order:

1. **A canonical, deeply-considered commit-message standard** — Sequential Thinking MCP locks the standard once, covering subject format, body policy, trailer policy, packet-ID handling, special cases (merges/reverts/fixups/releases), and length caps.
2. **An updated `sk-git` skill** mirroring the locked standard across all 4 runtime dirs (`.opencode/`, `.claude/`, `.codex/`, `.gemini/`).
3. **A deep-skill-style cli-devin dispatch surface** that loops SWE-1.6 in batches of 50 across 56 iterations to retroactively rewrite all 2,795 HEAD commits — modeled on the `deep-research` / `deep-review` state machinery (config.json + state.jsonl + strategy.md + iterations/ + canonical synthesis + `stopReason` / `legalStop` convergence).

The rewrite stays **local-only** (no force-push to GitHub origin) and **HEAD-only** (2,795 commits — does not touch the 5 unmerged remote branches). Backup branch + `git bundle` snapshot are mandatory before execution. Annotated tag messages and hash drift on tags are accepted out-of-scope.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Canonical commit-message standard (name format, body format, trailers, packet-ID policy, special cases, length caps).
- `sk-git` skill content update in all 4 runtime mirrors (`SKILL.md` §3, `assets/commit_message_template.md`, `references/commit_workflows.md`, `manual_testing_playbook/` GIT-007 if trailer policy shifts).
- Deep-skill-style cli-devin dispatch scaffolding (config / state / strategy / iterations / agent-config recipe / output contract / convergence rules).
- Retroactive rewrite of all 2,795 HEAD commits, applied locally via `git filter-repo --message-callback`.
- Pre-rewrite backup: dedicated branch + full `git bundle`.

### Out of Scope

- Force-pushing rewritten history to GitHub origin (user choice, 2026-05-16).
- Rewriting commits on 5 unmerged remote branches (`system-spec-kit/023…027`, `opencode-env`) — defer to future packets when those branches integrate.
- Rewriting annotated tag messages (129 tags) — accept hash drift on annotated tags; lightweight tag refs are repointed automatically by filter-repo.
- Enabling GPG signing (not currently configured on this Mac).
- AGENTS_Barter sibling sync — separate repo, only sync if standards apply there (deferred decision).
- Optional `commit-msg` hook / `commitlint` config to enforce on new commits — deferred unless user adds as explicit ask.

### Files to Change

Aggregate scope only. Per-phase detail lives in child plans.

| Layer | Touch Type | Phase | Notes |
|-------|------------|-------|-------|
| Spec folder (this packet) | Create | 001–005 | New `.opencode/specs/skilled-agent-orchestration/112-…/` tree |
| `evidence/` (this packet) | Add | 001 | Tooling pins, baseline log, pre-rewrite bundle |
| `.opencode/skills/sk-git/**` (+ 3 runtime mirrors) | Modify | 003 | SKILL.md §3, template asset, commit_workflows, GIT-007 |
| `.opencode/skills/cli-devin/assets/` | Add | 004 | New `agent-config-commit-rewrite-iter.json` pinned recipe |
| Repo HEAD history (local refs only) | Mutate | 005 | `git filter-repo` rewrites 2,795 commit messages |
| Backup refs | Add | 005 | `backup/pre-rewrite-YYYYMMDD` branch + `evidence/pre-rewrite.bundle` |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Level | Status |
|-------|--------|-------|-------|--------|
| 1 | `001-prerequisites-and-baseline/` | Install `git-filter-repo`, pin tool versions, snapshot pre-rewrite baseline (branch + bundle + text log) | L1 | Pending |
| 2 | `002-commit-standards-definition/` | Sequential Thinking MCP locks the 7 commit-standard decisions; hand-validates on 20 random commits | L1 (decision-record.md added as L3 addendum) | **Complete** — 7 ADRs Accepted, 20/20 sample deterministic |
| 3 | `003-sk-git-skill-update/` | Apply locked standards to `sk-git` SKILL.md / templates / references / GIT-007 across 4 runtime mirrors | L1 (upgrade to L2 on activation) | **Unblocked** — next phase |
| 4 | `004-cli-devin-rewrite-prompts/` | Author deep-skill-style state machinery + dispatch prompts + pinned agent-config for SWE-1.6 commit-rewrite loop | L1 (upgrade to L3 on activation) | Pending |
| 5 | `005-retroactive-rewrite-execution/` | Run 56-iter loop, synthesize mapping, apply via `git filter-repo`, verify against baseline | L1 (upgrade to L3 on activation) | Pending |

### Phase Transition Rules

- Each phase MUST pass `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-folder> --strict` independently before the next phase begins.
- Phase 002 acceptance criterion: 20 randomly-sampled HEAD commits rewrite **deterministically** under the locked standard. If any sample is underspecified, Phase 002 reopens (Phase 003 does NOT churn).
- Parent spec tracks aggregate progress via this map. Update `Status` column inline as phases ship.
- Use `/speckit:resume .opencode/specs/skilled-agent-orchestration/112-…/00X-…/` to resume a specific phase.
- `derived.last_active_child_id` in `graph-metadata.json` should point at the phase under active execution (currently `002-commit-standards-definition`).

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-prerequisites-and-baseline | 002-commit-standards-definition | `git-filter-repo` installed; `evidence/pre-rewrite.bundle` exists and verifies; `evidence/baseline-log.txt` captured; `evidence/tooling-pins.json` populated | `git bundle verify evidence/pre-rewrite.bundle`; `git filter-repo --version`; `wc -l evidence/baseline-log.txt` == 2,795 |
| 002-commit-standards-definition | 003-sk-git-skill-update | `commit-standards.md`, `derivation-heuristics.md`, `hand-sample-validation.md` exist; 20/20 random commits show deterministic rewrite; `decision-record.md` ADRs cover packet-ID policy, trailer merge rule, imperative-mood enforcement, unrecoverable-diff body policy | Manual review of `hand-sample-validation.md`; ADR completeness check; `validate.sh --strict` passes |
| 003-sk-git-skill-update | 004-cli-devin-rewrite-prompts | All 4 runtime mirrors byte-identical for sk-git core files; GIT-007 manual test scenario passes against new trailer policy; `checklist.md` mirror-parity items all `[x]` | `diff` between 4 mirrors; manual GIT-007 run; `validate.sh --strict` |
| 004-cli-devin-rewrite-prompts | 005-retroactive-rewrite-execution | `agent-config-commit-rewrite-iter.json` schema-validates against cli-devin's recipe pattern; template iter prompt passes sk-prompt CLEAR 5-check; dry-run on 5 hand-authored mappings via filter-repo callback succeeds on throwaway clone | sk-prompt CLEAR run on template; filter-repo dry-run; `validate.sh --strict` |
| 005-retroactive-rewrite-execution | (Packet close) | All 2,795 HEAD commits rewritten; pre-rewrite baseline recoverable; new log shows no packet-ID leakage; 5% adversarial sample (≈140 commits) hand-checks clean; 24 merge commits preserved | `git log --pretty=format:'%s' \| head -50` inspection; `git rev-list --count HEAD` == 2,795; `git bundle verify evidence/pre-rewrite.bundle` |

<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

These are explicitly **deferred into Phase 002** (Sequential Thinking owns these decisions, not the parent):

- Exact packet-ID-prefix rewrite policy: strip / fold into scope / preserve in body?
- Existing Co-Authored-By merge rule: preserve / replace / canonicalize? (3,498 historical commits already carry Claude trailers in varying forms.)
- Imperative-mood enforcement on retroactive rewrites — rewrite past-tense subjects or preserve original tense?
- Body-required-vs-optional rule when the diff is unrecoverable (squashed merges, file-only renames).
- Special-case rules for merge / revert / fixup / release commits.

Answered at planning time (2026-05-16):
- **Force-push to GitHub origin?** No — local-only rewrite.
- **Rewrite scope?** HEAD only (2,795 commits). The 5 unmerged remote branches stay untouched.
- **Annotated tags?** Out of scope. Accept hash drift.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-prerequisites-and-baseline/` → `005-retroactive-rewrite-execution/` (each child owns its full spec.md / plan.md / tasks.md and any Level 2+ addenda).
- **Source plan**: `/Users/michelkerkmeester/.claude/plans/create-a-new-phased-synchronous-mitten.md` (approved 2026-05-16).
- **Existing standards reference (will be updated in Phase 003)**:
  - `.opencode/skills/sk-git/SKILL.md` §3 (type/scope priority logic, lines 177–196)
  - `.opencode/skills/sk-git/assets/commit_message_template.md` (lines 53–95)
  - `.opencode/skills/sk-git/references/commit_workflows.md` (6-step commit analysis workflow)
- **Pattern reference for Phase 004**:
  - `.opencode/skills/cli-devin/assets/deep-loop-iter-template.md`
  - `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`
  - `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md`
  - `.opencode/skills/deep-research/references/state_format.md`
  - `.opencode/skills/deep-research/references/loop_protocol.md`
  - `.opencode/skills/deep-research/references/convergence.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer (currently `002-commit-standards-definition`).
