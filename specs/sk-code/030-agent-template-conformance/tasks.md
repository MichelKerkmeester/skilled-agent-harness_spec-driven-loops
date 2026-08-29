---
title: "Tasks: Agent Template Conformance"
description: "Ordered tasks: audit all 12 agents, trace the RELATED RESOURCES gap to the template, fix all 4 runtimes, verify path existence and symlink inheritance."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "agent template conformance tasks"
  - "sk-create-agent audit tasks"
importance_tier: "high"
contextType: "tasks"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/030-agent-template-conformance"
    last_updated_at: "2026-08-29T10:24:54Z"
    last_updated_by: "claude"
    recent_action: "Completed the audit and fix tasks; verified 212/212 paths and 12/12 TOML parses"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md"
      - ".opencode/skills/sk-doc/sk-create-agent/SKILL.md"
      - ".opencode/agents/deep-improvement.md"
      - ".opencode/agents/prompt-improver.md"
      - ".codex/agents/deep-improvement.toml"
    session_dedup:
      fingerprint: "sha256:b412af18de48699ef2e5dcde408cd3db4bcfe2038fb44dc988045e743df323ac"
      session_id: "2026-08-29-sk-code-030"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Agent Template Conformance

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending.
- `T-NNN` identifiers are stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Enumerate the 12 agents and the runtime topology. Evidence: 12 agents present in `.opencode/agents/`, `.claude/agents/`, `.pi/agents/`, `.codex/agents/`; `.cursor/agents/*.md` confirmed 12/12 symlinks into `.claude/agents/`; `.devin/agents/*/AGENT.md` confirmed 12/12 symlinks into `.claude/agents/`.
- [x] T-002 Read `sk-create-agent/SKILL.md`'s Canonical Frontmatter and Required Body Shape sections directly. Evidence: Required Body Shape item 7 is "Related resources section with real supporting paths"; Canonical Frontmatter requires `permission:` under `.opencode/agents/` and `tools:` under `.claude/agents/`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 Audit frontmatter schema, permission-to-tools mapping, and `name`-matches-filename-stem across all 12 agents, all applicable runtimes. Evidence: `permission:` present in all 12 `.opencode` files, `tools:` present in all 12 `.claude` and `.pi` files, zero schema mismatches; zero `name` mismatches across `.opencode`/`.claude`/`.pi`/`.codex`; no OpenCode-denied tool found leaking into a Claude allow-list.
- [x] T-004 Audit Required Body Shape item 7 across all 12 agents, all 4 real runtimes. Evidence: only `design` and `markdown` had a RELATED RESOURCES section; the other 10 had none, in all 4 runtimes.
- [x] T-005 Trace the gap to its root cause. Evidence: `sk-create-agent/assets/agent-template.md`'s skeleton ran `## 1. CORE WORKFLOW` through a final `## 8. SUMMARY` with no related-resources section, despite `SKILL.md`'s own Required Body Shape requiring one.
- [x] T-006 Fix `agent-template.md`. Evidence: inserted `## 8. RELATED RESOURCES` ahead of the renumbered `## 9. SUMMARY`; 15 insertions, 1 deletion.
- [x] T-007 Add RELATED RESOURCES to the 10 non-conforming agents across `.opencode`, `.claude`, `.pi`, `.codex`. Evidence: `git diff --stat` across the four directories reports 40 files changed, 550 insertions(+), 32 deletions(-); every deletion line is a `## N. SUMMARY` heading renumber, confirmed by direct inspection of the diff hunks (for example `review.md`: `-## 12. SUMMARY` / `+## 13. SUMMARY`), no body content removed. Agents with no prior SUMMARY section (`debug`, `orchestrate`) show the new section appended with zero deletions.
- [x] T-008 Audit hard-boundary coverage. Evidence: `deep-improvement` and `prompt-improver` had no section-0 hard-boundary block, unlike every other agent.
- [x] T-009 Author the hard-boundary block for both, across all 4 runtimes, grounded in each agent's own permissions. Evidence: `deep-improvement`'s block cites its `write: allow` / `edit: allow` / `bash: allow` / `task: deny` frontmatter and confines writes to one candidate; `prompt-improver`'s block cites its `write: deny` / `edit: deny` / `bash: deny` / `task: deny` frontmatter and forbids mutation, delegation, and execution.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-010 Verify every newly referenced RELATED RESOURCES path resolves on disk. Evidence: 212 paths extracted from the added lines across all 40 changed files, 0 missing.
- [x] T-011 Verify `.codex`'s TOML string bodies remain well-formed after the edit. Evidence: `tomli.load()` parses all 12 `.codex/agents/*.toml` files cleanly; triple-quote (`'''`) delimiters balanced in all 12.
- [x] T-012 Verify `.cursor`/`.devin` inherited the fix without independent writes. Evidence: `git status --porcelain` / `git diff --stat` for `.cursor/agents` and `.devin/agents` report zero changes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All 12 agents carry a RELATED RESOURCES section with verified real paths, across `.opencode`, `.claude`, `.pi`, and `.codex`.
- `deep-improvement` and `prompt-improver` carry a permission-grounded hard-boundary block across all 4 runtimes.
- `agent-template.md` itself carries the fix that prevents the same gap from recurring in the next agent authored from it.
- `.cursor` and `.devin` register zero independent changes, confirming symlink inheritance.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Governing contract: `sk-doc/sk-create-agent/SKILL.md`, `assets/agent-template.md`.
<!-- /ANCHOR:cross-refs -->
