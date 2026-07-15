---
title: "sk-doc Legacy Template Debt Cleanup"
description: "Bulk additive remediation that drove eligible MISALIGN-HIGH findings from 82 to 0 and reduced explicit MISALIGN-MEDIUM from 136 to 45 across older spec folders, without deleting any substantive prose."
trigger_phrases:
  - "sk-doc legacy template debt cleanup"
  - "tier 4 sk-doc remediation"
  - "misalign-high remediation 026"
  - "memory continuity batch backfill"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/008-remove-sk-doc-legacy-template-debt` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

The sk-doc template alignment audit over the last 40 commits flagged 93 MISALIGN-HIGH and 177 MISALIGN-MEDIUM findings in 384 documentation files. Nearly all were pre-existing legacy debt in spec folders authored under earlier sk-doc template versions that lacked current frontmatter, anchor requirements and template-source-marker requirements.

Four batches shipped in a single session: continuity metadata added to 34 files. Required anchor wrappers or stubs were added to 46 files. Two missing `SPECKIT_TEMPLATE_SOURCE` body markers were restored. Another 91 low-risk frontmatter metadata fixes were applied. Every change was strictly additive. No substantive prose was deleted or rewritten.

Re-audit confirmed eligible HIGH findings dropped from 82 to 0. Explicit MED findings dropped from 136 to 45, with the remainder deferred to a Tier 5 pass that requires narrative rewrite, skill-doc restructuring or manual playbook source-file sections outside the additive scope of this packet.

### Added

- `_memory.continuity` frontmatter blocks to 34 eligible legacy spec, resource, checklist and task docs (Batch A).
- Required anchor wrappers or stubs to 46 eligible spec-folder docs that were missing template-mandated sections (Batch B).
- `SPECKIT_TEMPLATE_SOURCE` body markers to 2 files that were missing the inline marker (Batch C).

### Changed

- 91 eligible spec-folder docs received low-risk `template_source` or `trigger_phrases` frontmatter additions to close MISALIGN-MEDIUM metadata findings (Batch D).

### Fixed

- Eligible HIGH count reduced from 82 to 0. Previously, spec folders from packet series 040-042 and 022 hybrid-rag-fusion lacked continuity blocks, anchor stubs and template-source markers required by the current sk-doc template surface.
- Explicit MED count reduced from 136 to 45. The 91 metadata-only fixes closed findings that did not require prose rewrite.

### Verification

| Check | Result |
|-------|--------|
| Quick HIGH/MED re-audit | PASS. Eligible HIGH 82 to 0. Explicit MED eligible 136 to 45. |
| Protected write-set check | PASS. Remediation report shows 0 protected-path modifications. |
| `validate.sh 022-stress-test-results-deep-research --strict` | PASS, exit 0. |
| `validate.sh 023-live-handler-envelope-capture-interface --strict` | PASS, exit 0. |
| `validate.sh 024-harness-telemetry-export-mode --strict` | PASS, exit 0. |
| `validate.sh 025-memory-search-degraded-readiness-wiring --strict` | PASS, exit 0. |
| `validate.sh 026-remove-readiness-scaffolding --strict` | PASS, exit 0. |
| `validate.sh 027-memory-context-structural-channel-research --strict` | PASS, exit 0. |
| `validate.sh 028-deep-review-research-skill-contract-fixes --strict` | PASS, exit 0. |
| `validate.sh 008-remove-sk-doc-legacy-template-debt --strict` | PASS, exit 0. |

### Files Changed

| File | What changed |
|------|--------------|
| Batch A: 34 files across legacy spec folders 040, 041, 042, 022 | Added `_memory.continuity` frontmatter block to each. |
| Batch B: 46 files across the same folder groups | Added missing anchor wrappers or placeholder stubs per each file's template category. |
| Batch C: 2 files missing inline body marker | Restored `SPECKIT_TEMPLATE_SOURCE` comment at the required body position. |
| Batch D: 91 files with low-risk MED metadata gaps | Added `template_source` or `trigger_phrases` frontmatter fields. |

### Follow-Ups

- Resolve the 45 remaining explicit MISALIGN-MEDIUM findings that require narrative rewrite, skill-doc restructuring or manual playbook source-file sections. These are grouped in the implementation-summary Tier 5 deferral table and need a dedicated Tier 5 pass.
- Verify MED hidden-ref enumeration. The original audit summary reported 177 MED findings but the file body exposed only 142 concrete refs plus summarized `(+N more)` entries. A full enumeration pass would confirm whether hidden refs are covered by the Tier 5 group assignments.
