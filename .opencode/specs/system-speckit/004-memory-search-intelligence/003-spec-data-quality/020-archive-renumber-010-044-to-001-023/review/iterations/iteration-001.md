# Deep Review Iteration 001

## Dimension

Inventory pass: build artifact map, spot-check renamed archive metadata, estimate review complexity, and identify high-risk follow-up dimensions before the correctness/security/traceability/maintainability passes.

## Files Reviewed

- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/spec.md:58`
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/spec.md:72`
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/spec.md:112`
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/checklist.md:78`
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/implementation-summary.md:95`
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/implementation-summary.md:99`
- `.opencode/specs/system-deep-loop/z_archive/graph-metadata.json:6`
- `.opencode/specs/system-deep-loop/z_archive/006-deep-skill-evolution/005-deep-research/001-uplift-research-deep-review-changes/description.json:19`
- `.opencode/commands/deep/assets/compiled/deep_ai-council.contract.md:14`
- `.opencode/commands/deep/assets/compiled/deep_research.contract.md:14`
- `.opencode/commands/deep/assets/compiled/deep_review.contract.md:14`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts:142`

Programmatic inventory checks reviewed all 235 `graph-metadata.json` files and all 235 `description.json` files under `.opencode/specs/system-deep-loop/z_archive/`, plus the 23 top-level folders and 8 `006-deep-skill-evolution` child folders.

## Findings by Severity

### P0

None.

### P1

#### P1-001 [P1] Seven regenerated `description.json` records still carry stale `parentChain` ancestry

- File: `.opencode/specs/system-deep-loop/z_archive/006-deep-skill-evolution/005-deep-research/001-uplift-research-deep-review-changes/description.json:19`
- Claim: The packet claims all affected folder identity metadata was corrected, including full-depth `description.json` metadata. The spec explicitly names `parentChain` as one of the stale self-reference fields to regenerate, and the post-completion audit claims an all-folder metadata re-check found zero remaining mismatches. [SOURCE: `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/spec.md:58`, `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/checklist.md:78`, `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/implementation-summary.md:99`]
- Evidence: The sampled `description.json` has `specFolder` correctly set to `system-deep-loop/z_archive/006-deep-skill-evolution/005-deep-research/001-uplift-research-deep-review-changes`, but its `parentChain` still contains `021-deep-skill-evolution` and `004-deep-research` instead of the current `006-deep-skill-evolution` and `005-deep-research`. [SOURCE: `.opencode/specs/system-deep-loop/z_archive/006-deep-skill-evolution/005-deep-research/001-uplift-research-deep-review-changes/description.json:3`, `.opencode/specs/system-deep-loop/z_archive/006-deep-skill-evolution/005-deep-research/001-uplift-research-deep-review-changes/description.json:19`]
- Scope proof: A read-only Node audit over all 235 `description.json` files found 0 `specFolder` mismatches but 7 `parentChain` mismatches. The affected files are the three descendants under `006-deep-skill-evolution/005-deep-research`, the three descendants under `006-deep-skill-evolution/006-deep-agent-improvement`, and `006-deep-skill-evolution/z_archive/description.json`. The same audit found 0 `packet_id`/`spec_folder` mismatches across all 235 `graph-metadata.json` files and 0 dangling `children_ids`, so this is specifically a `description.json.parentChain` regeneration gap rather than a broad rename failure.
- Counterevidence sought: Checked `packet_id`, `spec_folder`, `specFolder`, and `children_ids` separately to avoid over-reporting the already-fixed TOP_MAP corruption. Those fields passed in the exhaustive audit. Checked direct sample lines to confirm this is not a scanner-only artifact.
- Alternative explanation: `specId` is a short local sequence ID in these files and does not appear to be intended as a full path, so it was not used as the blocking evidence. The stale `parentChain` entries are different: they encode old on-disk ancestry and contradict the current path hierarchy.
- Finding class: matrix/evidence
- Affected surface hints: [`description.json`, `parentChain`, `system-deep-loop/z_archive/006-deep-skill-evolution`, `metadata regeneration`]
- Final severity: P1
- Confidence: High
- Downgrade trigger: Downgrade to P2 or close if the metadata schema owner confirms `parentChain` is intentionally historical memory-name ancestry rather than current on-disk ancestry. Current adjacent records show top-level `parentChain` follows current path ancestry, so this downgrade requires explicit schema evidence.
- Recommendation: Re-run or patch the `description.json.parentChain` regeneration for the 7 affected records, then extend the verification script to assert `parentChain === specFolder.split('/').slice(0, -1)` for regenerated spec folders.

### P2

None.

## Traceability Checks

- `spec_code`: Partial. Structural claims passed for top-level folder count (`001`-`023`), nested `006-deep-skill-evolution` children (`001`-`008`), root `z_archive/graph-metadata.json.children_ids`, graph identity fields, and command contract digest alignment. The `description.json.parentChain` check failed for 7 records.
- `checklist_evidence`: Partial. CHK-P0-001 is contradicted for the `parentChain` slice of identity metadata, though the narrower fields named in the implementation-summary post-audit (`packet_id`, `spec_folder`, `specFolder`, `children_ids`) pass.
- `skill_agent`: Not evaluated in this inventory iteration.
- `agent_cross_runtime`: Not evaluated in this inventory iteration.
- `feature_catalog_code`: Not evaluated in this inventory iteration.
- `playbook_capability`: Not evaluated in this inventory iteration.

## Ruled-Out Directions

- Root `z_archive/graph-metadata.json.children_ids`: ruled out as a finding. It lists exactly 23 current child paths, with no stale entries, duplicates, missing entries, or extra entries. [SOURCE: `.opencode/specs/system-deep-loop/z_archive/graph-metadata.json:6`]
- `graph-metadata.json` identity fields: ruled out as a finding for this iteration. Exhaustive audit found 0 `packet_id`/`spec_folder` mismatches across 235 files.
- `description.json.specFolder`: ruled out as a finding for this iteration. Exhaustive audit found 0 `specFolder` mismatches across 235 files.
- Command contract drift: ruled out as a finding. Presentation source digests in all three compiled contracts match their current `.txt` source files, and `check-contract-drift.cjs` returned no failures or warnings. [SOURCE: `.opencode/commands/deep/assets/compiled/deep_ai-council.contract.md:14`, `.opencode/commands/deep/assets/compiled/deep_research.contract.md:14`, `.opencode/commands/deep/assets/compiled/deep_review.contract.md:14`, `.opencode/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts:142`]
- Live tree touch: current `git status --porcelain -- .opencode/specs/system-deep-loop` still shows 7 non-archive `changelog/038-deep-loop-runtime` deletions. This matches the packet's documented pre-existing concurrent-session caveat, but iteration 1 did not prove attribution from first principles.
- `.opencode/specs/descriptions.json`: current status is modified with a 1656/1359 diff. This matches the packet's documented out-of-scope concurrent-process caveat, but iteration 1 did not prove attribution from first principles.

## Scope Violations

None. Reviewed target files were read-only; only review artifacts were written.

## Verdict

CONDITIONAL: one P1 finding is active.

## Next Dimension

Iteration 2 should focus on correctness: verify the 7 stale `parentChain` records against schema expectations, expand old number+slug citation triage from inventory samples into a deliberate acceptance/rejection matrix, and confirm whether `.opencode/specs/descriptions.json` and live-tree status can be independently attributed to concurrent work rather than this packet.

Review verdict: CONDITIONAL
