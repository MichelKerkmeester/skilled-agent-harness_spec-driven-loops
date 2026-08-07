

---
title: "Command Markdown and YAML Workflow Alignment"
description: "The SpecKit command surface now reflects the current template and validation system. Eighteen command assets were audited, seven stale YAML references were removed, and current behavior notes were added where they affect command execution."
trigger_phrases:
  - "command md yaml alignment"
  - "spec kit command audit"
  - "workflow yaml audit"
  - "template levels packet 006"
  - "spec kit command surface"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/006-command-markdown-yaml-workflow-alignment` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels`

### Summary

The command-facing SpecKit surface now matches the current validation and template-level system. Eighteen command assets were audited, stale references to deleted phase addendum files were removed from YAML workflows, validation exit semantics were corrected, and current behavior notes were added where they affect command execution. This matters because users and AI runtimes receive accurate, parseable, and verification-backed instructions.

### Added

- None.

### Changed

- Command entry docs updated to reflect current validation taxonomy, exit codes, and hardening behavior.
- `complete.md` now documents the `validate.sh` exit taxonomy, `SPECKIT_POST_VALIDATE`, and `create.sh --path` traversal rejection.
- `implement.md` now explains strict completion validation.
- `plan.md` now shows full phase creation syntax with phase names and documents path hardening.
- `resume.md` now mentions the spec-folder advisory lock used by continuity saves.
- `start-research-loop.md` now notes the fast Node validation orchestrator for targeted strict validation after spec mutations.
- Seven YAML workflow assets updated to remove stale phase addendum filename references and align pre-completion validation outcomes to current taxonomy.

### Fixed

- None.

### Verification

- Stale-pattern grep across `.opencode/commands/spec_kit/` returned zero hits. PASS.
- Banned-vocabulary grep for `preset`, `capability`, `capabilities`, `kind`, or `manifest` in command scope returned zero hits. PASS.
- Workflow-invariance vitest: 1 file, 2 tests, duration 243ms. PASS.
- All 12 YAML assets parsed successfully. PASS.
- Packet 006 strict validation: zero errors, zero warnings. PASSED.
- Sibling packets 003, 004, and 005 strict validation: each reported zero errors and PASSED.
- Parent `graph-metadata.json` updated. `children_ids` includes 006 and `derived.last_active_child_id` points to 006. PASS.
- 38 completed task items recorded.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/spec_kit/complete.md` | Modified | Exit taxonomy, `SPECKIT_POST_VALIDATE`, path hardening, system-error failure mode |
| `.opencode/commands/spec_kit/implement.md` | Modified | Strict completion validation taxonomy |
| `.opencode/commands/spec_kit/plan.md` | Modified | Phase creation syntax and path hardening |
| `.opencode/commands/spec_kit/resume.md` | Modified | Parallel continuity-save advisory lock note |
| `.opencode/commands/deep/start-research-loop.md` | Modified | Validation orchestrator performance note |
| `.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml` | Modified | Deleted phase addendum filenames replaced with Level template contract wording |
| `.opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modified | Deleted phase addendum filenames replaced with Level template contract wording |
| `.opencode/commands/spec_kit/assets/spec_kit_implement_auto.yaml` | Modified | Pre-completion validation outcomes aligned to current taxonomy |
| `.opencode/commands/spec_kit/assets/spec_kit_implement_confirm.yaml` | Modified | Pre-completion validation outcomes aligned to current taxonomy |
| `.opencode/commands/spec_kit/assets/spec_kit_plan_auto.yaml` | Modified | Deleted phase addendum filenames replaced with Level template contract wording |
| `.opencode/commands/spec_kit/assets/spec_kit_plan_confirm.yaml` | Modified | Deleted phase addendum filenames replaced with Level template contract wording |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modified | Validation orchestrator notes added to targeted strict validation steps |

### Follow-Ups

- Batch inline renderer mention omitted intentionally. It is internal and no in-scope command or YAML workflow had a natural behavior-facing place for it.
- No runtime-manifest exemptions recorded. The banned-vocabulary grep returned zero command-scope hits, so there were no YAML runtime manifest terms to classify.
