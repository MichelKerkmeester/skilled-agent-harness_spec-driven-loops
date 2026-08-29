---
title: "Plan: Agent Template Conformance"
description: "Audit all 12 agents across every runtime against sk-create-agent, fix the confirmed defects, and trace the RELATED RESOURCES gap back to the authoring template itself."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "agent template conformance plan"
  - "sk-create-agent audit plan"
importance_tier: "high"
contextType: "plan"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/036-agent-template-conformance"
    last_updated_at: "2026-08-29T10:24:54Z"
    last_updated_by: "claude"
    recent_action: "Fixed the 12 agents across 4 runtimes and the agent-template.md root cause"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md"
      - ".opencode/skills/sk-doc/sk-create-agent/SKILL.md"
      - ".opencode/agents/deep-improvement.md"
      - ".opencode/agents/prompt-improver.md"
      - ".codex/agents/deep-improvement.toml"
    session_dedup:
      fingerprint: "sha256:0e93af27ece777b3560561cf6abcb2bb7319f6f6d522f11db829c0f972c52de1"
      session_id: "2026-08-29-sk-code-030"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Agent Template Conformance

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`sk-doc/sk-create-agent/SKILL.md` defines "Canonical Frontmatter" (runtime-specific schema: `permission:` for `.opencode`, `tools:` for `.claude`) and "Required Body Shape" (seven items, including item 7: a related-resources section with real supporting paths). `.opencode`, `.claude`, and `.pi` hold three independently authored copies of each of the 12 agents; `.codex` holds the same body inside a `developer_instructions` TOML string; `.cursor` and `.devin` are symlinks into `.claude` with no independent content.

### Overview

Audit all 12 agents against both contract sections across all four independently-authored runtime directories, fix confirmed defects only, and trace any systemic defect back to its root cause rather than patching only its visible instances.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- All 12 agents and their 4 real runtime copies (`.opencode`, `.claude`, `.pi`, `.codex`) enumerated; `.cursor`/`.devin` confirmed as pure symlinks into `.claude`, not independent copies.
- `sk-create-agent/SKILL.md`'s "Required Body Shape" item 7 and "Canonical Frontmatter" schema read directly, not assumed from familiarity.

### Definition of Done

- All 12 agents carry a RELATED RESOURCES section across all 4 real runtimes; every referenced path resolves.
- `deep-improvement` and `prompt-improver` carry a permission-grounded hard-boundary block across all 4 runtimes.
- `agent-template.md` itself carries the fix, so the gap cannot be reproduced by the next agent authored from it.
- `.cursor`/`.devin` register zero independent git changes.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Root-cause-first remediation. A defect present in 10 of 12 instances is a strong signal the instances are not independently wrong — the thing that produced them is. Before touching any of the 12 agents, the packet traced the RELATED RESOURCES gap to its source: `sk-create-agent/assets/agent-template.md` itself.

### Key Components

- `sk-create-agent/SKILL.md` "Required Body Shape": the seven-item contract, with item 7 ("Related resources section with real supporting paths") as the rule the audit checked every agent against.
- `sk-create-agent/assets/agent-template.md`: the skeleton every agent is meant to start from. Before this packet, it ran `## 1. CORE WORKFLOW` through a final `## 8. SUMMARY` with no related-resources section anywhere in between — the same gap the audit found in 10 of 12 shipped agents.
- Four independently-authored runtime bodies (`.opencode`, `.claude`, `.pi`, `.codex`) versus two pure-symlink runtimes (`.cursor`, `.devin`): the reason the fix required four parallel edits per agent, not one.
- Permission-grounded hard-boundary text: `deep-improvement`'s boundary block is written from its own `write: allow` / `edit: allow` / `bash: allow` / `task: deny` frontmatter; `prompt-improver`'s is written from its own `write: deny` / `edit: deny` / `bash: deny` frontmatter — the two are not interchangeable.

### Data Flow

Read `sk-create-agent/SKILL.md`'s contract → audit all 12 agents across `.opencode`/`.claude`/`.pi`/`.codex` against it → find 10/12 missing RELATED RESOURCES, 2/12 of those also missing the hard-boundary block → trace the RELATED RESOURCES gap to `agent-template.md`'s own skeleton → fix the template (insert `## 8. RELATED RESOURCES`, renumber `SUMMARY` to `## 9.`) → fix all 40 agent files (10 agents × 4 runtimes) with real, verified paths → author the 2 missing hard-boundary blocks across all 4 runtimes, grounded in each agent's own permissions → confirm `.cursor`/`.devin` inherit through their symlinks untouched.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Enumerate the 12 agents and the runtime topology; read `sk-create-agent/SKILL.md`'s Canonical Frontmatter and Required Body Shape sections directly; confirm `.cursor`/`.devin` symlink targets.

### Phase 2: Core Implementation

Audit all 12 agents' frontmatter schema, permission-to-tools mapping, `name`-matches-filename-stem, and Required Body Shape across `.opencode`/`.claude`/`.pi`/`.codex`. Fix `agent-template.md`'s skeleton. Add RELATED RESOURCES to the 10 non-conforming agents across all 4 runtimes with verified, real paths. Author the hard-boundary block for `deep-improvement` and `prompt-improver` across all 4 runtimes, each grounded in that agent's own permission set.

### Phase 3: Verification

Confirm `git diff --stat` shows exactly 40 files changed with only `## N. SUMMARY` renumber deletions; confirm every added path resolves (212 checked); confirm `.codex`'s TOML parses cleanly in all 12 files; confirm `.cursor`/`.devin` register zero independent changes; confirm frontmatter/permission/name checks that were ruled out stay ruled out.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Behavioral: `git diff --stat` across the four real runtime directories, read for file count and insertion/deletion shape; a path-existence check over every newly referenced path in every added RELATED RESOURCES line; a TOML parse of all 12 `.codex/agents/*.toml` files. Controlled: `git status` on `.cursor/agents` and `.devin/agents` before and after the edit, to prove — not assume — the symlinks carried the fix with zero independent writes.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sk-doc/sk-create-agent/SKILL.md` and `assets/agent-template.md` as the governing contract and skeleton.
- A TOML parser (`tomli`) for the `.codex` delimiter-balance check.
- No new packages added to the repository; no network access.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reversible: `git checkout -- .opencode/agents .claude/agents .pi/agents .codex/agents .opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md` restores every prior state in one step. All edits are additive (a new section, a renumbered heading) with no destructive removal; `.cursor`/`.devin` need no rollback since they were never independently written.

<!-- /ANCHOR:rollback -->
