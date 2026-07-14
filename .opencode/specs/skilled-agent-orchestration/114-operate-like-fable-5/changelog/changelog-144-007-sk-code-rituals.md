---
title: "Changelog: sk-code Verification Rituals and Decision-Economy Doctrine [144-operate-like-fable-5/007-sk-code-rituals]"
description: "Chronological changelog for the sk-code verification rituals phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/007-sk-code-rituals` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5`

### Summary

This phase adds a Verification Rituals subsection to `.opencode/skills/sk-code/SKILL.md` without changing smart-router behavior. The new eight-line section turns three recommendations into point-of-use ritual: mutation-check after green, a verification ladder with named blind spots and decision-economy with fail-closed construction. The edit stays confined to the verification section so routing remains untouched.

### Added

- None.

### Changed

- Added a Verification Rituals subsection to `.opencode/skills/sk-code/SKILL.md` in the verification section.
- Kept the change to 8 confined lines and confirmed smart-router behavior unchanged by git diff.
- Added B4 mutation-check and claim-falsifier language: after green, break the guarded code and confirm that the test fails.
- Distinguished true-RED from compile-RED and stated that a green-but-vacuous test is a defect, not coverage.
- Added B5 verification ladder language from unit to in-memory to on-server to live, with each rung's blind spot named in advance.
- Added the WEBFLOW and OPENCODE rung mapping.
- Added recommendation 11: decision-economy plus fail-closed by construction, with a named seam and closing condition instead of a bare TODO or dead control.
- Favored structural invariants over disciplinary reminders.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` | PLANNED: will run at implementation. |
| `bash .opencode/skills/sk-code/scripts/check-comment-hygiene.sh <snippet>` | PLANNED: will run on any added snippet. |
| Grep for required ritual phrases in `sk-code/SKILL.md` | PLANNED: covers REQ-001, REQ-002 and REQ-004. |
| Smart-router unchanged and relevant vitest suites | PLANNED: git diff confinement plus vitest where the skill has runnable suites. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| _No file-level detail recorded._ | N/A | The extracted baseline names `.opencode/skills/sk-code/SKILL.md` but records no file-level table detail. |

### Follow-Ups

- CHK-001 Requirements REQ-001 through REQ-005 documented in `spec.md` and traced to recommendations B4, B5 and 11.
- CHK-002 Technical approach defined in `plan.md` as additive and verification-section-confined.
- CHK-003 Dependencies identified and confirmed none. This is a point-of-use ritual.
- CHK-010 `check-comment-hygiene.sh` finds zero violations in any added code snippet, with no spec paths or artifact ids in comments and durable WHY only.
- CHK-011 Git diff shows edits confined to the verification section and section 2 smart-router text byte-untouched.
- CHK-012 Verification-section net growth stays within budget, about 40 lines, so the skill stays scannable.
