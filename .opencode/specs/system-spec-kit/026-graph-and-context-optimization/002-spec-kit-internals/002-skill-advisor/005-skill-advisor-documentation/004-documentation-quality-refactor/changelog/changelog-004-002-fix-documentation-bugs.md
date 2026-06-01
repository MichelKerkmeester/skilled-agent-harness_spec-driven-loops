---
title: "Fix skill-advisor documentation bugs (skeleton, pending 001 synthesis)"
description: "Skeleton phase for P0 documentation bug fixes in the system-skill-advisor package. Specifics are gated on completion of the 001 documentation quality audit research synthesis."
trigger_phrases:
  - "skill-advisor documentation bug fixes"
  - "002-fix-documentation-bugs phase"
  - "system-skill-advisor P0 bug fixes"
  - "documentation quality refactor bug fixes"
  - "skill-advisor broken links ADR-001 fix"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/002-fix-documentation-bugs` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor`

### Summary

Audit-confirmed P0 bugs exist in the system-skill-advisor documentation: a broken ADR-001 path missing the `001-skill-graph/` segment, a broken hook reference link in the README and install guide, an incorrect build-command path in the architecture document, and stale audit-packet rows across nine nested READMEs. This skeleton phase is gated on the 001 documentation quality audit research synthesis. No bug fixes have shipped yet.

### Added

- None.

### Changed

- None.

### Fixed

- None.

### Verification

- None. Pending completion of 001 research synthesis.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| Packet docs (spec, implementation-summary) | Created | Scaffolded skeleton phase documentation, gated on 001 synthesis |

### Follow-Ups

- Complete the 001 documentation quality audit research synthesis
- Build a per-file edit list from the P0 catalog in the research report
- Apply P0 bug fixes: restore ADR-001 path, fix hook reference link, correct build-command path, and refresh stale audit-packet rows
- Verify no stale paths remain via grep
- Run validate.sh in strict mode
- Update implementation summary after fixes ship
