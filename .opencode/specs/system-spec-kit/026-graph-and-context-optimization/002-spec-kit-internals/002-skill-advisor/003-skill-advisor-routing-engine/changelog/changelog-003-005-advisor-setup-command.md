

---
title: "Skill Advisor Setup Command"
description: "A new /doctor:skill-advisor slash command lets you analyze all skills in your repo, propose optimized advisor scoring, apply changes, and re-index the skill graph without hand-editing explicit.ts, lexical.ts, or per-skill graph-metadata.json files."
trigger_phrases:
  - "/doctor:skill-advisor"
  - "skill advisor setup command"
  - "005-advisor-setup-command"
  - "skill advisor auto mode"
  - "skill advisor confirm mode"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/005-advisor-setup-command` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine`

### Summary

The skill advisor scoring system was maintained by hand-editing explicit.ts, lexical.ts, and per-skill graph-metadata.json files. There was no guided workflow to analyze your repo's skills, detect scoring gaps, or apply optimized trigger phrases and token boosts. This phase shipped the `/doctor:skill-advisor` slash command with auto and confirm modes, two YAML workflow definitions, an updated commands README, and a user-facing install guide that replaces a broken symlink.

### Added

- The `/doctor:skill-advisor` slash command at `.opencode/commands/doctor/skill-advisor.md` with frontmatter defining argument-hint and allowed-tools, an execution protocol pointing at YAML assets, and a consolidated prompt for setup, scope, dry-run, and skip-tests flags
- Autonomous workflow file at `.opencode/commands/doctor/assets/doctor_skill-advisor_auto.yaml` (5-phase pipeline: Discovery, Analysis, Proposal, Apply, Verify, no approval gates)
- Interactive workflow file at `.opencode/commands/doctor/assets/doctor_skill-advisor_confirm.yaml` (same 5-phase pipeline with per-phase and per-skill approval gates)
- User-facing install guide at `.opencode/install_guides/SET-UP - Skill Advisor.md` (replaces a broken symlink) with an AI-first prompt, prerequisite checklist, scope and mode flag table, phase overview diagram, troubleshooting matrix, and rollback procedure
- Updated `.opencode/commands/spec_kit/README.txt` with a skill-advisor row in the commands table, structure tree, and usage example

### Changed

- None.

### Fixed

- None.

### Verification

- Both YAML workflows parse with `python3 -c "import yaml; yaml.safe_load(...)"` - PASS
- Command markdown frontmatter parses (description, argument-hint, allowed-tools) - PASS
- Command appears in runtime skill list as `doctor:skill-advisor` - PASS
- Strict spec-folder validation on `005-advisor-setup-command/` - PASS (0 errors, 0 warnings)
- `description.json` generated via `generate-description.js` - PASS
- `graph-metadata.json` written with parent_id, related_to, derived entities - PASS
- Acceptance scenarios count >= 4 for Level 2 - PASS (5 scenarios with Given/When/Then markers)
- All 12 child-packet tasks marked `[x]` - PASS
- 30 deep-review findings (0 P0, 25 P1, 5 P2) closed in-place across correctness, security, traceability, and maintainability dimensions - PASS (full report: `review/review-report.md`)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/doctor/skill-advisor.md` | Created | Command markdown definition (frontmatter, protocol, reference) |
| `.opencode/commands/doctor/assets/doctor_skill-advisor_auto.yaml` | Created | Autonomous 5-phase workflow |
| `.opencode/commands/doctor/assets/doctor_skill-advisor_confirm.yaml` | Created | Interactive 5-phase workflow with approval gates |
| `.opencode/commands/spec_kit/README.txt` | Modified | Added skill-advisor row to commands table, structure tree, and usage example |
| `.opencode/install_guides/SET-UP - Skill Advisor.md` | Created | User-facing setup guide (replaced broken symlink) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/context-index.md` | Modified | Added child phase row and summary |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/spec.md` | Modified | Added child phase row to documentation map |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/tasks.md` | Modified | Added task entry tracking the new child phase |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-advisor-setup-command/spec.md` | Modified | Reformatted acceptance scenarios to Given/When/Then pattern; moved template_source_hint for validator visibility |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-advisor-setup-command/plan.md` | Modified | Cross-refs use full paths; repositioned template_source_hint |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-advisor-setup-command/tasks.md` | Modified | Cross-refs use full paths; repositioned template_source_hint |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-advisor-setup-command/checklist.md` | Modified | Repositioned template_source_hint for validator visibility |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-advisor-setup-command/graph-metadata.json` | Created | Packet graph metadata |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-advisor-setup-command/description.json` | Created | Packet description metadata |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-advisor-setup-command/implementation-summary.md` | Created | This implementation summary |

### Follow-Ups

- Parent spec folder still fails the strict TEMPLATE_SOURCE check. The parent `006-skill-advisor/` has 4 files with `template_source_hint:` past line 20 of frontmatter, invisible to the validator. Out of scope for this packet; would require a repo-wide frontmatter normalization pass.
- Test suite execution is deferred to first real run. The 220-test advisor suite passes against the existing baseline. The first real test run happens the first time a user invokes `/doctor:skill-advisor:auto` with proposed scoring mutations.
- Per-run rollback script auto-invoke is limited to build or edit failures. Post-test-failure rollback is offered as an option at the post_phase_4 gate in confirm mode and as a recommended action in auto mode failure paths, but is not auto-executed. This is intentional because a regressed test may still represent a valid proposal that needs targeted investigation.
- Token-collision detection in Phase 2 is per-pair only, not transitive. Three-way collisions where two newly-proposed tokens for different skills would collide are not detected. This is rare in practice because proposals are generated one skill at a time.
- Confidence threshold is fixed at 0.40 (medium). Phase 2 emits `confidence_by_skill` per proposal and pre_phase_3 hard-blocks anything below 0.40. There is no flag to relax this without editing the YAML directly.
- Auto-extracted `derived.entities` proper-noun paths use bare filenames by design. They regenerate on each `generate-context.js` run so manual normalization would not persist. Repo-rooted file paths in `derived.key_files` are correctly normalized.
