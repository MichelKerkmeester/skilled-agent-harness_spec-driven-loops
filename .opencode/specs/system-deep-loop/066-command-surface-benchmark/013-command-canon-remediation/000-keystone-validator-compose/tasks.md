---
title: "Tasks: keystone frontmatter-validation composition"
description: "Task breakdown for composing the quick_validate.py frontmatter checks into the canonical validate_document.py --type command path keyed by template_rules.json."
status: in_progress
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/000-keystone-validator-compose"
    last_updated_at: "2026-07-16T08:00:35Z"
    last_updated_by: "claude"
    recent_action: "Authored keystone phase spec, plan, tasks, and scaffold docs"
    next_safe_action: "Read validate_document.py and quick_validate.py to plan composition"
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

`[ ]` open · `[x]` complete. Each task lists the verification evidence it will carry when done. All tasks are open: this phase is scaffolded but not yet implemented — the plan and gates are defined, and no composition code has been written or run.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Read `validate_document.py` and `quick_validate.py` in full and map which frontmatter checks quick-validate runs and how they are keyed by `template_rules.json`. Evidence: a written inventory of the frontmatter checks and their `template_rules.json` keys.
- [ ] T002 — Capture the current pass/fail baseline of `validate_document.py --type command` across the command corpus. Evidence: the baseline verdict list, recorded before any code change.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 — Compose the frontmatter checks onto the `--type command` path — preferably via a shared module both entrypoints import — keyed by `template_rules.json`, so a failing invariant fails the run with a clear message. Evidence: the composition seam in `validate_document.py` and, if used, the shared module.
- [ ] T004 — Preserve the existing section-presence behavior and every other `--type` document class. Evidence: unchanged section-presence verdicts on the corpus and unchanged behavior for non-command `--type` classes.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 — Prove the two success cases fail on the canonical path: a 2000-char `description` and a bare, non-fully-qualified MCP tool token. Evidence: both negative fixtures return non-zero on `validate_document.py --type command`.
- [ ] T006 — Prove no regression and no disagreement: every currently-conformant command still exits 0, and `quick_validate.py` and `--type command` agree on frontmatter for the same file. Evidence: the post-change corpus verdicts match the baseline for conformant commands and the two paths' frontmatter verdicts are identical.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The `--type command` path runs the composed frontmatter checks keyed by `template_rules.json`, both negative fixtures fail, every currently-conformant command still exits 0, and `quick_validate.py` and `--type command` no longer disagree on frontmatter for the same file.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation`. Predecessor: none (first phase). Successor: 001-versioned-command-contract.
<!-- /ANCHOR:cross-refs -->
