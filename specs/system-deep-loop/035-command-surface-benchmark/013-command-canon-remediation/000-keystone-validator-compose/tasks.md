---
title: "Tasks: keystone frontmatter-validation composition"
description: "Task breakdown for composing the quick_validate.py frontmatter checks into the canonical validate_document.py --type command path keyed by template_rules.json."
status: complete
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/000-keystone-validator-compose"
    last_updated_at: "2026-07-16T11:30:00Z"
    last_updated_by: "claude"
    recent_action: "Composed frontmatter checks onto --type command; all six tasks verified"
    next_safe_action: "Open 001-versioned-command-contract"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/shared/scripts/quick_validate.py"
      - ".opencode/skills/sk-doc/shared/assets/template_rules.json"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: keystone frontmatter-validation composition

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task carries its verification evidence. All six tasks are complete: the frontmatter checks now fire on the canonical `--type command` path, both negative fixtures fail, the conformant corpus is unchanged, and the two validators agree.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Read `validate_document.py` and `quick_validate.py` in full and mapped which frontmatter checks quick-validate runs and how they key on `template_rules.json`. Evidence: the `command` block in `template_rules.json` already declared `frontmatterRequired: true` + `frontmatterFields.required: [description]`, but `validate_document()` had no `command` dispatch branch — the config was dead. quick_validate owns description-budget (soft 110 / hard 1536), angle-bracket, TODO, YAML-multiline, and allowed-tools checks.
- [x] T002 — Captured the pre-change baseline of `--type command` across the command corpus. Evidence: 42 exit-0 / 9 exit-1 over the corpus; the 9 failures are pre-existing section-structure failures under `deep/assets/compiled|legacy/` and `*/scripts*/README.md`. No real command carries an over-cap or multiline description, and every `mcp__` token in the corpus is already fully qualified.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 — Composed the frontmatter checks onto the `--type command` path via a shared-leaf import: `quick_validate.py` gained `is_non_fq_mcp_token` / `iter_allowed_tools` and the description-budget helpers, and `validate_document.py` imports them into a new `validate_command_frontmatter()` dispatched under `if doc_type == 'command'`, keyed on the `frontmatterFields.required` list. Evidence: the import block + `validate_command_frontmatter()` in `validate_document.py`; the two validators share one primitive set so they cannot drift.
- [x] T004 — Preserved section-presence behavior and every other `--type` class: the new branch is presence-conditional (no frontmatter ⇒ skip), so compiled/legacy artifacts under commands/ do not newly block; the command surface's comma-form allowed-tools and `<arg>` description notation are accepted by design. Evidence: skill/agent/readme/asset smoke runs unchanged; skills still hard-fail angle brackets and still require name/version.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 — Both negative fixtures fail on the canonical path. Evidence: a 2000-char description returns exit 1 (`command_description_over_hard_cap`); a bare `mcp__mk_goal` token returns exit 1 (`command_allowed_tools_non_fq_mcp`). A non-namespaced plugin token (`mk_goal`) and every fully-qualified `mcp__server__tool` still pass.
- [x] T006 — No regression, no disagreement. Evidence: post-change corpus is 42/9 with the identical failing set (zero conformant regression); with sections held constant, `quick_validate.py` and `--type command` both return VALID on a clean command and both return INVALID citing the same non-FQ-MCP reason on a bad one. `test_quick_validate_086.py` passes; the two changelog/validator suite failures reproduce identically on HEAD (the pre-existing `scripts/`-symlink entrypoint bug, out of this phase's scope).
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Met. The `--type command` path runs the composed frontmatter checks keyed by `template_rules.json`, both negative fixtures fail, every currently-conformant command still exits 0, and `quick_validate.py` and `--type command` agree on frontmatter for the same file.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation`. Predecessor: none (first phase). Successor: 001-versioned-command-contract.
<!-- /ANCHOR:cross-refs -->
