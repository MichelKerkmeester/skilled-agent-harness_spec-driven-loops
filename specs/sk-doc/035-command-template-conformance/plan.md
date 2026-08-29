---
title: "Plan: Command Template Conformance"
description: "Audit every real command file against sk-create-command, distinguish confirmed defects from conformant patterns, fix only the confirmed defects, and verify through every runtime path."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "command template conformance plan"
  - "sk-create-command audit plan"
importance_tier: "high"
contextType: "plan"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/035-command-template-conformance"
    last_updated_at: "2026-08-29T09:43:41Z"
    last_updated_by: "claude"
    recent_action: "Fixed the two command-template gaps; audited all five files against sk-create-command"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/commands/design/extract.md"
      - ".opencode/commands/rewrite/response.md"
      - ".opencode/commands/prompt/improve.md"
      - ".opencode/commands/rewrite/explain-visually.md"
      - ".opencode/commands/rewrite/response-by-external-agent.md"
    session_dedup:
      fingerprint: "sha256:27a378bdd4cbae6659f730d4c13d2e225ed8ef802b5b5db1a320179aaae84e15"
      session_id: "2026-08-29-sk-code-029"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Command Template Conformance

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`.opencode/commands/{design,rewrite,prompt}` holds 5 real command files; `.claude/commands/` and `.cursor/commands/` are symlinks into `.opencode/commands/`, so there is exactly one real copy of each. `sk-doc/sk-create-command` governs frontmatter shape, the mandatory-gate rule for router commands with required arguments, and section-vocabulary expectations that differ between router and non-router commands.

### Overview

Audit all 5 real files against the contract, confirm each finding against the contract text before treating it as a defect, fix only confirmed defects, and verify each fix is reachable through all three runtime paths.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- All 5 real command files identified: `design/extract.md`, `prompt/improve.md`, `rewrite/explain-visually.md`, `rewrite/response-by-external-agent.md`, `rewrite/response.md`.
- The symlink topology confirmed: `.claude/commands/` and `.cursor/commands/` point into `.opencode/commands/`; `.codex`, `.pi`, `.devin` have no commands directory in this scope.

### Definition of Done

- `design/extract.md` has a mandatory input gate; `rewrite/response.md` declares `allowed-tools`.
- The two findings that turned out conformant (shifted section numbering, non-router vocabulary) are documented as checked-and-rejected, not silently dropped.
- Both fixes verified visible through `.opencode`, `.claude`, and `.cursor` paths.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Contract-first audit. Every candidate finding is checked against the actual `sk-create-command` text before it is treated as a defect, so a stylistic difference is not mistaken for a violation.

### Key Components

- Mandatory-gate check (`sk-create-command` Step 7): any `argument-hint` with a required `<argument>` needs a blocking gate immediately after frontmatter.
- `allowed-tools` least-privilege check: a command should declare the tool set it needs, not inherit an unrestricted one by omission.
- Router vs. non-router vocabulary check (`sk-create-command` Step 8): fixed section vocabulary is a router requirement, not a blanket one.

### Data Flow

Enumerate the 5 real files → check each against the mandatory-gate rule, the `allowed-tools` rule, and the vocabulary rule → confirm or reject each candidate finding against the contract text → fix confirmed defects only → verify fixes through `.opencode`, `.claude`, `.cursor`.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Enumerate the 5 real command files and confirm the symlink topology (`.claude`, `.cursor` into `.opencode`; no commands directory in `.codex`, `.pi`, `.devin`).

### Phase 2: Core Implementation

Audit each file against the mandatory-gate, `allowed-tools`, and vocabulary rules. Fix `design/extract.md` by adding a mandatory input gate binding `live_url`, `output_dir`, `execution_mode`, modelled on `prompt/improve.md`. Fix `rewrite/response.md` by adding `allowed-tools: Read`.

### Phase 3: Verification

Confirm the two checked-and-rejected findings (shifted section numbering in `design/extract.md`; non-router vocabulary in the three `rewrite/*` commands) against the contract text. Verify both fixes are visible through `.opencode`, `.claude`, and `.cursor` command paths.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Behavioral: read each of the 5 real files against the `sk-create-command` contract text directly, rather than assuming conformance from surface familiarity. Controlled: for each candidate finding, checked the contract's actual rule (Step 7 for the mandatory gate, Step 8 for vocabulary) before classifying it as a defect or as conformant.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sk-doc/sk-create-command` contract as source of truth.
- No new packages or network access.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Two-file, reversible: `git checkout -- .opencode/commands/design/extract.md .opencode/commands/rewrite/response.md` restores the prior state. Both edits are additive (a new gate section, a new frontmatter key) with no destructive removal.

<!-- /ANCHOR:rollback -->
