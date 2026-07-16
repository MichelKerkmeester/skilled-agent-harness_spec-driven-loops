---
title: "Skill Advisor README Marketing Rewrite (Pending)"
description: "Skeleton specification for a full marketing-voice README rewrite of system-skill-advisor, gated on parent research synthesis. Nine-section, HVR-compliant, peer-anchored on system-code-graph README."
trigger_phrases:
  - "skill-advisor readme rewrite"
  - "003 marketing readme phase"
  - "system-skill-advisor marketing readme"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/003-readme-problem-first-rewrite` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor`

### Summary

The system-skill-advisor README read as a structural reference but lacked the marketing voice found in the project root README and the peer system-code-graph README. A skeleton specification defined a full rewrite into 9 numbered sections at approximately 2000 words, with Hard Voice Rules (HVR) compliance and eight unique selling points surfaced prominently. Implementation is gated on completion of the parent research synthesis and has not yet shipped.

### Added

- None.

### Changed

- None.

### Fixed

- None.

### Verification

- HVR grep clean: `rg -niE '\b(delve` (command truncated in scaffold) | PENDING
- sk-doc validate: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` | PENDING
- Word count: `wc -w .opencode/skills/system-skill-advisor/README.md` (expect 1800-2200) | PENDING
- User read-through: Manual side-by-side with peer system-code-graph/README.md | PENDING

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/README.md` | Modified | Target for marketing-style rewrite (pending) |

### Follow-Ups

- Complete the 9-section README rewrite after parent research synthesizes
- Run HVR compliance check on final text
- Validate against sk-doc skill_readme template
- Compare voice density with peer system-code-graph README
