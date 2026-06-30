---
title: "Changelog: Compact Fable-5 Governor Capsule on the Skill-Advisor Hook [144-operate-like-fable-5/005-governor-capsule-hook]"
description: "Chronological changelog for the compact Fable-5 governor capsule hook phase."
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

> Spec folder: `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/005-governor-capsule-hook` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5`

### Summary

This phase places a compact fable-5 governor capsule on the live per-turn skill-advisor reminder path. The durable doctrine record lives in `.opencode/skills/system-spec-kit/constitutional/fable-governor.md`, while `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts` carries the render-path edit and rebuild. The point is to make the doctrine visible at the reminder seam without changing the existing sanitization contract.

### Added

- None.

### Changed

- Shipped the compact fable-5 governor capsule.
- Created `.opencode/skills/system-spec-kit/constitutional/fable-governor.md` as the durable doctrine record.
- Edited and rebuilt `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts` as the render-path target.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this phase folder | PENDING: planning self-check passes and final run follows implementation. |
| Render vitest for capsule presence | PENDING: will confirm the capsule appears in the per-turn reminder. |
| Capsule word-count and model-name check | PENDING: will confirm the capsule is at or under about 90 words and model-name-free. |
| Existing render suite | PENDING: hygiene directive, sanitization and token-cap behavior must remain unchanged. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| _No file-level detail recorded._ | N/A | The extracted baseline names target files but records no file-level table detail. |

### Follow-Ups

- CHK-001 Requirements REQ-001 through REQ-008 documented in `spec.md` with acceptance criteria.
- CHK-002 Technical approach defined in `plan.md`: constant beside `HYGIENE_DIRECTIVE`, append and rebuild.
- CHK-003 Dependencies identified: 003 baseline before and after, 004 doctrine spine and 006 subagent channel.
- CHK-010 `render.ts` typechecks and the advisor artifact rebuilds clean.
- CHK-011 No build errors or warnings introduced by the capsule constant.
- CHK-012 Capsule is appended after existing instruction-label sanitization so no new injection surface is added.
