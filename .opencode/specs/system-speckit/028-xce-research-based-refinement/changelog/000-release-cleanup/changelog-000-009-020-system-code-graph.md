---
title: "Changelog: Phase 20: system-code-graph Frontmatter Alignment [009-skill-frontmatter-alignment/020-system-code-graph]"
description: "Chronological changelog for the Phase 20: system-code-graph Frontmatter Alignment phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/020-system-code-graph` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment`

### Summary

system-code-graph's 7 reference docs now carry exactly the canonical frontmatter contract, so all of them are valid routing signal for the advisor doc harvest. Six docs needed only the missing importance_tier/contextType pair; launcher_lease.md had no detailed block at all and received net-new trigger phrases derived from its lease mechanism.

### Added

- importance_tier and contextType added to six partial-block reference docs: `references/config/database_path_policy.md`, `references/readiness/{code_graph_readiness_check,readiness_and_scope_fingerprint}.md`, and `references/runtime/{naming_conventions,ownership_boundary,tool_surface}.md`.
- Full detailed frontmatter block authored on `references/runtime/launcher_lease.md` — four trigger phrases derived from its lease mechanism ("code graph launcher lease", "stale launcher lease reclaim", "shared daemon lease", "lease file conventions"), tier `normal`, contextType `implementation`.

### Changed

- Fixed a camelCase phrase drift in `code_graph_readiness_check.md`: `ensureCodeGraphReady` replaced with lowercase multi-word "ensure code graph ready" to meet the campaign phrase contract.
- Four formal contract/policy docs promoted to tier `important`: `database_path_policy.md` (launcher-enforced path invariant), `readiness_and_scope_fingerprint.md` (false-safe read-path refusal contract), `naming_conventions.md`, and `ownership_boundary.md` (the two contract archetypes the campaign policy names). Descriptive and operator docs (`code_graph_readiness_check.md`, `tool_surface.md`, `launcher_lease.md`) remain tier `normal`.
- The two boundary/naming maps (`naming_conventions.md`, `ownership_boundary.md`) use contextType `general` (they define where things live and what they are called across layers); the five runtime-behavior docs use `implementation`.

### Fixed

- None.

### Verification

- check-skill-doc-frontmatter.sh --skill system-code-graph --coverage - PASS — docs=7, carrying-detailed-block=7, violations=0
- Python local-mode smoke ("code graph launcher lease stale reclaim", flag on) - PASS — system-code-graph first at 0.95 with !code graph launcher lease(signal) in the match reason
- Diff hygiene - PASS — git diff shows only frontmatter hunks in the 7 files
- Live daemon matchedDocs smoke - DEFERRED — rides packet 145 T025 (session-cycle daemon adoption)
- Tasks complete - 10 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-code-graph/references/config/database_path_policy.md` | Modified | tier important, contextType implementation; 4th phrase added |
| `.opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md` | Modified | tier normal, contextType implementation; camelCase phrase fixed |
| `.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md` | Modified | tier important, contextType implementation |
| `.opencode/skills/system-code-graph/references/runtime/launcher_lease.md` | Modified | net-new detailed block: 4 phrases, tier normal, contextType implementation |
| `.opencode/skills/system-code-graph/references/runtime/naming_conventions.md` | Modified | tier important, contextType general |
| `.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md` | Modified | tier important, contextType general |
| `.opencode/skills/system-code-graph/references/runtime/tool_surface.md` | Modified | tier normal, contextType implementation |

### Follow-Ups

- Live-daemon verification is campaign-level. The running advisor daemon predates the launcher allowlist fix, so matchedDocs cannot be observed live until every advisor-attached session cycles and a fresh session respawns it.
