

---
title: "Changelog: Skill Advisor Setup Command"
description: "Adds a /doctor:skill-advisor slash command with auto and confirm modes that lets users analyze every skill in the repo, propose optimized advisor scoring, apply approved changes, re-index the skill graph, and validate with the existing 220-test advisor suite."
trigger_phrases:
  - "skill advisor setup command"
  - "/doctor:skill-advisor"
  - "skill advisor routing"
  - "advisor scoring optimization"
  - "005-advisor-setup-command"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/005-advisor-setup-command` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine`

### Summary

You can now run `/doctor:skill-advisor` to interactively analyze every skill in your repo, propose optimized advisor scoring (TOKEN_BOOSTS, PHRASE_BOOSTS, derived triggers, CATEGORY_HINTS), apply approved changes, re-index the skill graph, and validate with the existing 220-test advisor suite. Before this packet, the only way to tune advisor routing was to hand-edit explicit.ts / lexical.ts / per-skill graph-metadata.json files and remember to rebuild dist plus run tests. Now the workflow is one command.

### Added

- `doctor:skill-advisor` slash command with auto and confirm modes, frontmatter, protocol header, scoring system reference, and next-step routing
- `doctor_skill-advisor_auto.yaml` autonomous 5-phase workflow (discovery, analysis, proposal, apply, verify) with no approval gates
- `doctor_skill-advisor_confirm.yaml` interactive 5-phase workflow with per-phase and per-skill approval gates
- Skill advisor row added to the commands table, structure tree, and usage example in the spec_kit README
- User-facing install guide (SET-UP - Skill Advisor.md) with AI-first prompt, prerequisite checklist, phase overview diagram, troubleshooting matrix, and rollback procedure
- Parent phase documentation updated with 012 child phase row, summary, and open-items entry

### Changed

- None.

### Fixed

- Broken symlink at `.opencode/install_guides/SET-UP - Skill Advisor.md` replaced with a real file.

### Verification

- Both YAML workflows parse via `python3 yaml.safe_load` - PASS
- Command markdown frontmatter parses (description, argument-hint, allowed-tools) - PASS
- Command appears in runtime skill list as `doctor:skill-advisor` - PASS
- Strict spec-folder validation on 005-advisor-setup-command/ - PASS (0 errors, 0 warnings)
- description.json generated via generate-description.js - PASS
- graph-metadata.json written with parent_id, related_to, derived entities - PASS
- Acceptance scenarios count >= 4 for Level 2 - PASS (5 scenarios with Given/When/Then markers)
- All 12 child-packet tasks marked [x] - PASS
- Deep-review loop closed 30 findings (0 P0, 25 P1, 5 P2) - PASS
- Command markdown DQI 94/100 - PASS
- Install guide DQI 99/100 - PASS

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/doctor/skill-advisor.md` | Created | Command markdown definition (frontmatter + protocol + reference) |
| `.opencode/commands/doctor/assets/doctor_skill-advisor_auto.yaml` | Created | Autonomous 5-phase workflow (no approval gates) |
| `.opencode/commands/doctor/assets/doctor_skill-advisor_confirm.yaml` | Created | Interactive 5-phase workflow with per-phase and per-skill approval |
| `.opencode/commands/spec_kit/README.txt` | Modified | Added skill-advisor row to commands table, structure tree, and usage example |
| `.opencode/install_guides/SET-UP - Skill Advisor.md` | Created (was broken symlink) | User-facing setup guide with AI-first prompt and rollback procedure |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/context-index.md` | Modified | Added 012 child phase row, summary, and open-items entry |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/spec.md` | Modified | Added 012 row to phase documentation map |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/tasks.md` | Modified | Added T013 entry tracking the new child phase |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-advisor-setup-command/spec.md` | Modified | Acceptance scenarios reformatted to validator pattern, cross-refs use full paths, template_source_hint moved up in frontmatter |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-advisor-setup-command/plan.md` | Modified | Cross-refs use full paths, template_source_hint repositioned |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-advisor-setup-command/tasks.md` | Modified | Cross-refs use full paths, template_source_hint repositioned |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-advisor-setup-command/checklist.md` | Modified | template_source_hint repositioned for validator visibility |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-advisor-setup-command/graph-metadata.json` | Created | Packet graph metadata (parent_id, related_to, derived entities, key files) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-advisor-setup-command/description.json` | Created | Packet description metadata via generate-description.js |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-advisor-setup-command/implementation-summary.md` | Created | Implementation summary document |

### Follow-Ups

- Parent spec folder still fails strict TEMPLATE_SOURCE check. The parent 006-skill-advisor/ has 4 files with template_source_hint past line 20 of frontmatter, invisible to the validator. Would require a repo-wide frontmatter normalization pass.
- Test suite execution is deferred to first real run. This packet ships the command plus YAML workflows plus install guide but does not modify live scoring tables (explicit.ts, lexical.ts, graph-metadata.json files). The 220-test advisor suite passes against the existing baseline. The first time a user runs /doctor:skill-advisor:auto the suite will run against actual proposed mutations.
- Per-run rollback script auto-invoke triggers on build or edit failure only. Post-test-failure rollback is offered as option B at the post_phase_4 gate in confirm mode and surfaces as a recommended action in auto mode failure paths, but is not auto-executed without operator decision.
- Token-collision detection is per-pair, not transitive. Phase 2 cross-checks each proposed token against existing TOKEN_BOOSTS for other skills but does not detect three-way collisions. In practice this is rare because Phase 2 generates proposals one skill at a time.
- Confidence threshold is fixed at 0.40 (medium). Phase 2 emits confidence_by_skill per proposal and pre_phase_3 hard-blocks anything below 0.40. There is no flag to relax this for development or testing without editing the YAML directly.
