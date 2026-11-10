---
title: "Changelog: Phase 7: review-remediation [033-git-setup-customization/007-review-remediation]"
description: "Chronological changelog for the Phase 7: review-remediation phase."
trigger_phrases:
  - "git setup customization review remediation changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-16

> Spec folder: `specs/sk-git/033-git-setup-customization/007-review-remediation` (Level 1)
> Parent packet: `specs/sk-git/033-git-setup-customization`

### Summary

The documented sk-git release check passes again, at 4,990 words against the 5,000 limit. Every doc the review named clears the voice-rule hard-blocker scan, and the setup battery no longer reports PASS for a probe it never ran, a hook git would skip, or an adapter that only mentions its handler.

### Added

- F-13 Add doctor-commands/ to the canonical artifact list (.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:18)
- Update implementation-summary.md and save continuity

### Changed

- Re-read every cited line and confirm or reject each finding (review-report.md section 3)
- F-01 Trim sk-git SKILL.md under 5,000 words, starting with the Repository Settings section (.skilled/skills/sk-git/SKILL.md:259)
- F-10 State the real playbook census (.skilled/skills/sk-git/SKILL.md:573)
- F-11 Replace the playbook validation command with one that runs (.skilled/skills/sk-git/SKILL.md:573)
- F-12 Clear the HVR hard blockers (.skilled/skills/sk-git/SKILL.md:220)
- F-15 Schedule GIT-042 once and GIT-044 to GIT-046 in the wave plan (.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:161)

### Fixed

- Capture baselines for every gate before any edit (scratch fix007/baseline/)
- Write the child preamble and back up each target before its dispatch (scratch fix007/)
- F-14 Fix the section ranges and scenario counts, sections 8 and 13 (.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:603)
- F-17 Fix the repeated worktree reaper outcome (.skilled/skills/sk-git/README.md:57)
- F-19 Restore the section 3 heading (.skilled/skills/sk-git/feature-catalog/feature-catalog.md:105)
- Fix the three review findings: section 8 count back to 7, repair wording per check row, literal handler values rejected (manual-testing-playbook.md:224, README.md:1262, README.md:1507, feature-catalog.md:167, git-setup-check.cjs:913)

### Verification

- package_skill.py .skilled/skills/sk-git --check - PASS, 4,990 words (baseline FAIL, 5,038)
- Doctor runner run-all.sh - 7 of 7 suites, node 332 of 332, vitest 18 of 18 (baseline node 329 of 329, vitest 18 of 18)
- git-setup-check.test.cjs - 47 of 47 (baseline 44 of 44)
- Battery against this repository - STATUS=OK checks=11 with --tool claude, opencode and pi
- Mutation checks - F-02 guard removed: fails. F-03 probe removed: fails. F-04: no comment stripping, bare import, bare OpenCode event, bare Pi event and literal exclusion reverted each fail
- hvr_scan.py on every touched doc - 0 hard blockers each
- validate_document.py on every touched markdown doc - 0 issues each, typed for the playbook, catalog and command
- validate-playbook-package.cjs --package sk-git - PASS, 46 scenarios, 9 categories

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/sk-git/SKILL.md` | Modified | Word limit, playbook pointer and command, HVR punctuation (F-01, F-10, F-11, F-12) |
| `.hermes/skills/sk-git/SKILL.md` | Regenerated | Hermes mirror |
| `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md` | Modified | Category list, ranges and counts, wave plan, HVR (F-13 to F-16) |
| `.skilled/skills/sk-git/feature-catalog/feature-catalog.md` | Modified | Section 3 heading, DEGRADED, HVR (F-18 to F-20) |
| `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md` | Modified | Status-line counters (F-25) |
| `.skilled/skills/sk-git/scripts/hooks/README.md` | Modified | HVR (F-21) |
| `.skilled/skills/sk-git/README.md` | Modified | Reaper row (F-17) |
| `.skilled/commands/README.txt` | Modified | Two semicolons (F-22) |
| `.skilled/commands/doctor/assets/doctor-git-presentation.txt` | Modified | Four semicolons (F-06) |
| `.skilled/commands/doctor/assets/doctor-git-setup.yaml` | Modified | --tool only for supported runtimes (coordinator request) |
| `.skilled/commands/doctor/git.md` | Modified | Description, --target binding, gate placement (F-05, F-07, F-08) |
| `.skilled/commands/doctor/scripts/README.md` | Modified | Test coverage claim (F-09) |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modified | Allowlist UNKNOWN, hook execute bit, adapter registration shape (F-02, F-03, F-04) |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modified | Three tests, 44 to 47 |
| `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md` | Modified | Names /doctor:sk-code (F-23) |
| `README.md` | Modified | Verdict set, repair wording, status counters (F-24, F-25) |

### Follow-Ups

- The adapter check is a pattern match, not a parser. An unused object that binds the event to a function, or a .on('tool_call', fn) on an object other than the Pi extension API, still reads as registered. The code comment states this.
- Adjacent defects, recorded and not fixed. .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs has no test and belongs to the 035 packet. The header that sync-skills-hermes.cjs writes into all 68 Hermes mirrors carries two semicolons, so .hermes/skills/sk-git/SKILL.md shows 2 HVR hard blockers that this phase cannot fix without editing the generator.
- sk-create-command disagrees with itself on gate placement. SKILL.md Step 7 and references/argument-hints-and-modes.md:49 say the gate comes immediately after the frontmatter, and assets/command-router-template.md shows it after the H1. The template comment should say "immediately after the frontmatter, before the H1", to match Step 7.
