---
title: "Iteration 7: D1 Correctness and security — retrieval ranking, determinism and corpus boundaries"
trigger_phrases: []
---

# Iteration 7: D1 Correctness and security — retrieval ranking, determinism and corpus boundaries

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

Correctness/security review of the retrieval lanes, generated trigger index and corpus boundary. Eight bounded implementation/test paths were directly re-read. Current ranking, normalization, scope and publication fixtures were checked; F012 was independently derived from the file-symlink path, while carried retrieval parity issues remained open and no prior conclusion was treated as proof.

## Scorecard

- Dimensions covered: correctness and security (retrieval/index sub-slice)
- Files reviewed: 8
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- Carried active findings: F001–F011
- New findings ratio: 1.0 for this pass
- Convergence: score 0, threshold 3; telemetry only under `max-iterations`

## Findings

### P0, Blocker

- None.

### P1, Required

- **F012 — Corpus indexing accepts Markdown symlinks whose real target is outside the repository.** `walkDirectory` intentionally calls `recordFile` for a symlinked Markdown file at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:174-189]`. `recordFile` resolves the target only to key duplicate identity and stores the repo-relative link path without checking that `realPath` is inside `repoRoot` at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:216-245]`. `buildIndex` later reads `path.join(repoRoot, relativePath)` at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:116-121]`, which follows the link and hashes/indexes the external file under an internal-looking path. The focused test at `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:308-324]` covers a symlink to an in-repository file and duplicate suppression, but has no out-of-tree target case. This crosses the documented corpus boundary and can publish external trigger metadata into the committed index.
  - Recommendation: reject or explicitly report symlinked files whose canonical target is outside `repoRoot` (prefer fail-closed for generation), and add an out-of-tree symlink fixture proving no external bytes are indexed.

### P2, Suggestions

- None new in this slice.

## Search and ruled-out checks

- The shared lane's flags retain `--no-config`, `--hidden`, fixed-string and ignore-case controls plus the `.git` exclusion at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/rg-lane.mjs:29-47]`; F001 remains the separate public-wrapper parity defect.
- The index lookup scans normalized phrase keys and applies the shared score classes, then breaks ties by code-unit path at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:128-205]`; normalization and exact/containment/token-overlap fixtures cover these classes at `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:96-121,558-636]`.
- `publishJson` round-trips, validates and same-directory-renames artifacts, and generation tests cover byte-identical reruns and fail-closed malformed corpora at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/artifact.mjs:96-145]` and `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:362-408]`; no publication-determinism finding was opened.
- The legacy replay retains lifecycle filters, escaped scope matching and a separate unwindowed diagnostic pass at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/legacy-lane.mjs:220-339]`; no new ranking finding was opened without running the parity harness.
- No test, generator or repository validator was run because the user-bound write surface forbids commands that can write outside the lineage.

## Traceability checks

- `spec_code`: partial. The packet requires deterministic retrieval and residue-safe behavior; the out-of-tree corpus boundary remains unguarded.
- `checklist_evidence`: blocked. No root `checklist.md` exists; authoritative validation was not run under the lineage-only boundary.
- `feature_catalog_code`: not applicable to this focused slice.
- `playbook_capability`: not applicable to this focused slice.

## Adversarial self-check

- Hunter: followed a Markdown symlink from directory walk through `recordFile` into `buildIndex`, and compared the existing in-tree symlink test with the absent external-target case.
- Skeptic: this is a read/index boundary issue, not a claim that arbitrary non-Markdown symlinks are walked; the path is limited to `.md` links under the two corpus roots.
- Referee: F012 is P1 because an external file can influence a committed retrieval artifact while being represented as a repository path; the fix is bounded to canonical-target validation and its fixture.

## Next focus

Review command/workflow templates, mirror surfaces and decommission residue again against the current tree, carrying all active findings. Continue to treat convergence as telemetry until iteration 10.

Review verdict: CONDITIONAL
