---
title: "Arc 020 Spec Docs sk-doc Alignment: H2 Case Sweep and Skill-Surface Evergreen Audit"
description: "36 arc 020 child docs audited for H2 casing and structural drift. 24 docs corrected for ALL CAPS compliance. Seven skill surfaces checked for evergreen packet-ID hygiene and doctor script shell headers. All strict validations exited 0."
trigger_phrases:
  - "arc 020 sk-doc sweep"
  - "021 003 spec docs alignment"
  - "H2 heading case drift fix"
  - "skill surface evergreen audit"
  - "arc 020 child doc alignment"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/003-align-arc-020-spec-docs-with-sk-doc` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2`

### Summary

Arc 020 closed the deferred-P2 behavior and API changes across six child packets, but 24 of those child docs carried H2 headings that did not conform to sk-doc ALL CAPS rules. Stale packet documentation weakens future memory retrieval and handoff quality even when the underlying runtime is correct. This phase audited all 36 arc 020 child markdown docs for H2 casing, ADR evidence rows, continuity frontmatter completeness and stale citations. The 24 drifted docs were corrected with mechanical uppercase fixes only. Seven runtime skill surfaces were also checked for evergreen packet-ID hygiene and doctor script shell headers. No violations were found and no edits were made. All strict validations for the arc 020 children, this packet and the arc 021 parent exited 0.

### Added

- `scratch/sk-doc-sweep-tally.csv` recording every audited arc 020 child doc with row count 36, fix count 24 (NEW)

### Changed

- 24 arc 020 child markdown docs updated for H2 ALL CAPS compliance across `001-*` through `006-*` sub-packets

### Fixed

- 24 H2 heading case violations in arc 020 child docs that were lowercase instead of ALL CAPS per sk-doc rules

### Verification

| Check | Result |
|-------|--------|
| Scaffold strict validation | PASS: `validate.sh --strict --verbose`, errors 0, warnings 0, exit 0 |
| Arc 020 child strict validation | PASS: all six child `validate.sh --strict` runs exited 0 |
| Post-fix drift scan | PASS: 36 docs audited, 24 fixed, 0 current H2/evidence/continuity violations |
| Skill-surface audit | PASS: 0 evergreen-rule violations removed. All five doctor scripts have shebang, strict mode and component header |
| 021/003 strict validation | PASS: final `validate.sh --strict` exited 0 |
| Arc 021 parent strict validation | PASS: `validate.sh --strict` exited 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `scratch/sk-doc-sweep-tally.csv` | Created (NEW) | Per-file audit tally covering 36 arc 020 child docs with fix category per row |
| Arc 020 child docs (24 files across `001-*` to `006-*`) | Modified | H2 ALL CAPS mechanical fixes applied where heading case drift was found |

### Follow-Ups

- Prose quality improvements beyond required structure and evidence drift fixes were intentionally out of scope for this phase.
- Runtime skill surfaces were not edited because no current-state evergreen violations or doctor header drift were found. If future skill updates introduce mutable packet-ID citations, a follow-on sweep should target those surfaces.
