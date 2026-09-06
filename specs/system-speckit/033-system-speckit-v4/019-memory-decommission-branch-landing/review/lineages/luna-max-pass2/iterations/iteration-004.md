---
title: "Iteration 4: D4 Maintainability — parser contracts, duplicate payload types, mirrors and decommission documentation"
trigger_phrases: []
---

# Iteration 4: D4 Maintainability — parser contracts, duplicate payload types, mirrors and decommission documentation

## Setup and route

- review_target: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- review_target_type: `spec-folder`
- review_dimensions: `all`
- spec_folder: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- execution_mode: `AUTONOMOUS`
- lineage_mode: `auto`
- target_agent: `deep-review`
- agent_definition_loaded: `true`
- resolved_route: `Resolved route: mode=review target_agent=deep-review`
- executor: `cli-codex model=gpt-5.6-luna`
- nested_dispatch: `false`

## Focus and method

Maintainability review of the advisor document harvester, the canonical and advisor-local shared-payload contracts, the executor documentation and decommission-facing current docs. Nine bounded source/test/document paths were directly re-read. Prior reports were used as search leads only; F008 and F009 were independently confirmed on the current tree, while the previously reported plugin and stdin documentation drifts were searched and ruled out.

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: 9
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- Carried active findings: F001–F007
- New findings ratio: 1.0 for this pass
- Convergence: score 0, threshold 3; telemetry only under `max-iterations`

## Findings

### P0, Blocker

- None.

### P1, Required

- None new in this slice.

### P2, Suggestions

- **F008 — The advisor document-frontmatter parser treats a prefix as a closing fence.** `parseDocFrontmatter` finds the first `\n---` substring at `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/doc-frontmatter.ts:86-103]`, so a content line such as `---not-a-fence` can terminate the block even though it is not a complete YAML delimiter. Keys and trigger phrases after that line are then omitted from the parsed block. The focused parser tests cover valid block and inline lists, missing fences and empty phrases at `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/skill-doc-harvest.vitest.ts:75-105]`, but no prefix-collision or malformed-closing-fence case. The more strict spec-kit frontmatter parser uses a whole-line closing pattern at `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts:246-252]`, showing the intended boundary is available elsewhere.
  - Recommendation: require `---` to occupy the complete line (with LF, CRLF or end-of-input), report malformed closing fences where appropriate, and add a regression fixture for `---not-a-fence` plus valid Windows line endings.

- **F009 — The advisor-local shared-payload producer vocabulary has drifted from the canonical contract.** The advisor copy accepts `startup_brief` and `session_snapshot` in addition to `compact_merger`, `hook_cache` and `advisor` at `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts:291-304]`, while the canonical spec-kit validator accepts only the latter three at `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/context/shared-payload.ts:258-275,350-380]`. The current advisor brief emits only `advisor` at `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts:273-291]`, so this is latent rather than a demonstrated live failure; it nevertheless leaves two copies with incompatible acceptance sets and no parity fixture. This is a maintainability/interoperability defect in a preserved shared contract, not a claim that the extra values are currently produced.
  - Recommendation: remove unused producer literals or explicitly mark them local-only, then add a cross-package parity test for the intended vocabulary and rejection behavior.

## Search and ruled-out checks

- The cli-codex hard rule and its default non-interactive example now both show the stdin redirect at `[SOURCE: .opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:7-10,212-221]`; no new executor-example finding was opened.
- Current plugin and hook documentation search did not find `SYSTEM_SPEC_MEMORY_DISABLED`, `SPECKIT_SPEC_MEMORY_PLUGIN_DISABLED`, `memory-plugin` or `spec-memory` in the current plugin README/test guidance and hook README. Historical removal explanations remain in the ENV reference and are clearly framed as removed behavior at `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md:16,250,362]`; no new residue finding was opened.
- The focused harvest tests cover valid parser shapes, flag-off invariance, reindex/delete behavior, scoring caps and path sanitization at `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/skill-doc-harvest.vitest.ts:75-265]`, but do not cover F008's malformed delimiter or F009's duplicate-vocabulary parity.
- No functional change was made to any preserved implementation; the review records the contract seams for their owning package.

## Traceability checks

- `spec_code`: partial. The packet's maintainability and decommission claims are readable, but F008/F009 leave preserved contract seams without complete parity coverage.
- `checklist_evidence`: blocked. No root `checklist.md` exists; authoritative validators/tests were intentionally not run under the lineage-only write constraint.
- `feature_catalog_code`: not applicable to this focused slice.
- `playbook_capability`: not applicable to this focused slice.

## Adversarial self-check

- Hunter: compared the two payload vocabularies, traced the only current advisor producer, checked parser tests against malformed-fence behavior and searched the documentation surfaces previously implicated by the decommission.
- Skeptic: F008 is bounded to a parser edge where a prefix collision changes which fields are harvested; F009 is explicitly labeled latent because no current extra-value producer was found. The plugin and stdin observations were not retained as findings after current-source rechecks.
- Referee: no P0/P1 was found in this slice. F008 and F009 remain P2 due bounded blast radius and lack of a demonstrated current production failure.

## Next focus

Rotation frontier is exhausted once; continue with correctness cross-lane ranking and deep-loop execution/state integrity while carrying all open findings.

Review verdict: CONDITIONAL

