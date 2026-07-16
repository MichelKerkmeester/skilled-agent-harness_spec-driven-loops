---
title: "Changelog: Phase 9: deep-research Frontmatter Alignment [009-skill-frontmatter-alignment/009-deep-research]"
description: "Chronological changelog for the Phase 9: deep-research Frontmatter Alignment phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/009-deep-research` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

deep-research's 15 reference and asset docs now carry exactly the canonical frontmatter contract, making the skill fully valid routing signal for the advisor doc harvest. Unlike the pilot's pure normalization, this was the campaign's first net-new authoring phase: every doc had title+description only, so all trigger phrases, tiers, and contextTypes were authored from doc content while staying distinctive against the five sibling deep-* skills whose docs already carry phrases.

### Added

- Authored full canonical frontmatter blocks (five to eight trigger phrases each, plus tier and contextType) for all 15 deep-research docs, every one of which carried title and description only. This is the campaign's first net-new authoring phase.
- Assigned `contextType: implementation` for 11 runtime-behavior references, `general` for `quick_reference.md` and `deep_research_dashboard.md`, and `planning` for `deep_research_strategy.md` and `convergence_reference_only.md`. The split follows the sibling deep-review precedent: dashboards are read-back surfaces, strategy templates are forward-looking.

### Changed

- Harvested the trigger phrase corpus from five sibling deep-* skills and research-prefixed loop-generic vocabulary ("stopreason values" became "research stopreason values") to keep doc-trigger routing unambiguous across the loop family.
- Promoted five formal contract docs to `important` tier: `convergence.md` (live stop-contract hub), `loop_protocol.md` (canonical lifecycle spec), `spec_check_protocol.md` (bounded-mutation and advisory-lock contract), `capability_matrix.md` (single source of truth for runtime parity), and `state_format.md` (state packet ownership and file-protection hub). The 10 descriptive docs stayed at `normal`.
- Passed the coverage check (`check-skill-doc-frontmatter.sh --coverage`) with 15 of 15 docs carrying the detailed block and zero violations.

### Fixed

- None.

### Verification

- check-skill-doc-frontmatter.sh --skill deep-research --coverage - PASS — docs=15, carrying-detailed-block=15, violations=0
- Python local-mode smoke ("research stop contract stuck recovery", flag on) - PASS — deep-research first at 0.95 with !research stop contract(signal) in the match reason
- Diff hygiene - PASS — git diff shows insertion-only frontmatter hunks (all at line 3) in the 15 files
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 11 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-research/references/convergence/convergence.md` | Modified | Full contract authored; tier important |
| `.opencode/skills/deep-research/references/convergence/convergence_graph.md` | Modified | Full contract authored |
| `.opencode/skills/deep-research/references/convergence/convergence_recovery.md` | Modified | Full contract authored |
| `.opencode/skills/deep-research/references/convergence/convergence_reference_only.md` | Modified | Full contract authored; contextType planning |
| `.opencode/skills/deep-research/references/convergence/convergence_signals.md` | Modified | Full contract authored |
| `.opencode/skills/deep-research/references/guides/capability_matrix.md` | Modified | Full contract authored; tier important |
| `.opencode/skills/deep-research/references/guides/quick_reference.md` | Modified | Full contract authored; contextType general |
| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Modified | Full contract authored; tier important |
| `.opencode/skills/deep-research/references/protocol/spec_check_protocol.md` | Modified | Full contract authored; tier important |
| `.opencode/skills/deep-research/references/state/state_format.md` | Modified | Full contract authored; tier important |
| `.opencode/skills/deep-research/references/state/state_jsonl.md` | Modified | Full contract authored |
| `.opencode/skills/deep-research/references/state/state_outputs.md` | Modified | Full contract authored |

### Follow-Ups

- Live-daemon `matchedDocs` verification is deferred to a later campaign-level session cycle; the daemon requires a restart before doc-trigger routing takes effect.
- Phrase distinctiveness is point-in-time. Later campaign phases author their own phrases; bare deep-research claims like "question entropy" and "mad noise floor" rely on those phases honoring the same prefix-when-generic rule to prevent routing collisions.
