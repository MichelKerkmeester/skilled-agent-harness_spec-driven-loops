---
title: "Changelog: Review Registry and Metadata Backfill [009-research-backlog-remediation/006-review-registry-and-metadata-backfill]"
description: "Chronological changelog for the Review Registry and Metadata Backfill phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/006-review-registry-and-metadata-backfill` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation`

### Summary

Fourteen review findings across two lineages sat undispositioned, graph-metadata key_files omitted the real runtime surfaces a folder's own frontmatter already named and the description generator cut generated text off mid-word. Twelve findings resolved on real evidence, two remained genuinely open, a real generator bug was fixed and both metadata gaps were closed.

### Added

- Add `truncateSynopsisAtWordBoundary()`, a shared word-boundary clamp used by both the drift-gate and legacy description-generation paths.
- Add a fixture test proving a file named only in spec.md frontmatter key_files, not in document prose, is now included in derived key_files.

### Changed

- `deriveKeyFiles()` in `graph-metadata-parser.ts` now merges a folder's own spec.md frontmatter key_files ahead of prose-derived candidates, instead of reading document prose only.
- Both description-generation code paths now call the shared word-boundary clamp instead of a raw length slice.

### Fixed

- Fixed the mid-word truncation bug in the description generator, confirmed on the live root packet where the description previously cut off inside the word resilience.
- Fixed the 008-loop-systems-remediation graph-metadata key_files gap, which listed only document filenames despite the folder's own frontmatter already naming the real fan-out runtime scripts.
- Dispositioned 12 of 14 review findings as resolved with direct current-code evidence, including a lag-ceiling status-mapping fix, a permission-bypass opt-in gate and an already-shipped registry-reconstruction function. 2 findings (a session-id not carried into review-init bindings, a leaf agent asked to run a full loop) remain genuinely active and undispositioned as resolved.

### Verification

- Generator-hardening and related graph-metadata test suites run, PASS, 72 of 72 plus 16 of 16 for the new fixture.
- Full `deep-loop-runtime` and `system-spec-kit` suites run, no new regressions beyond the pre-existing unrelated baseline noted throughout this remediation phase.
- Root packet description.json re-generated and confirmed no longer truncated mid-word.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modified | Merged frontmatter key_files into derived candidates. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/packet-synopsis.ts` | Modified | Added the shared word-boundary clamp. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modified | Wired the legacy path to the shared clamp. |
| `review/lineages/glm/deep-review-findings-registry.json`, `review/lineages/codex/deep-review-findings-registry.json` | Modified | Added disposition and evidence to all 14 findings. |

### Follow-Ups

- The 2 genuinely active findings (session-id reuse into review-init bindings, leaf-agent naming and scope mismatch in the fan-out prompt) are real, unresolved gaps and remain open for a future phase.
- codex's own registry aggregate summary fields (openFindingsCount, convergenceScore, graphDecision) were left unrecalculated since reconciling them requires understanding the deep-review reducer's own contract, out of scope for this backfill.
