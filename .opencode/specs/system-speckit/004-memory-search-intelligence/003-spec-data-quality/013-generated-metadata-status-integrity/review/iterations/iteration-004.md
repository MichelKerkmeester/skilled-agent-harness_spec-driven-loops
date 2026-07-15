## Dimension

Maintainability - minimal fix proposal for Target 1 only.

This iteration proposes the smallest correct repair for the confirmed `create.sh --phase --phase-parent` parent-packet `description.json` corruption path. The reviewed target files remain read-only.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28` - severity contract and evidence requirements.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-state.jsonl:1` - session lineage and max-iteration stop policy.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-strategy.md:21` - Target 1 bug statement.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-strategy.md:72` - planned Target 1 minimal-fix pass.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-001.md:54` - original T1-P1-001 finding.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-002.md:45` - deterministic append-mode confirmation.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-003.md:31` - repo-wide blast-radius scan summary.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-003.md:41` - existing corrupted packet finding.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1046` - append mode begins when `PHASE_PARENT` is present.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1054` - append mode sets `APPEND_TO_EXISTING_PARENT=true`.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1055` - append mode points `FEATURE_DIR` at the existing parent.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1310` - parent description generation block.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1315` - parent generator call that currently targets the existing parent.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1351` - child description generation block.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1355` - child generator call uses `_child_path` and remains legitimate.
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:77` - generator computes metadata identity from the provided base path.
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:83` - generator writes `specFolder` from the computed relative path.
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:90` - generator writes `parentChain` from the computed path segments.
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:108` - generator persists the description to the target folder.
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:59` - built generator mirrors the relative path calculation.
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:63` - built generator writes the canonical payload.
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js:87` - built generator persists the payload.
- `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:38` - phase-parent detection starts from direct `NNN-*` children.
- `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:50` - a direct child `spec.md` qualifies the parent.
- `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:51` - a direct child `description.json` also qualifies the parent.
- `.opencode/skills/system-spec-kit/scripts/utils/phase-classifier.ts:5` - utility file is only a re-export for conversation phase classification.
- `.opencode/skills/system-spec-kit/scripts/lib/phase-classifier.ts:86` - classifier labels conversation phases, not spec-folder parent/child structure.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:3` - corrupted basename-only `specFolder`.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:20` - corrupted empty `parentChain`.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/spec.md:41` - affected packet is a phase parent.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/spec.md:63` - affected packet purpose is parent-level.

## Findings by Severity

### P0

None.

### P1

#### T1-P1-001 [P1] Minimal fix: skip only existing-parent description regeneration in append mode

- Claim: The minimal correct code fix is to guard the parent `description.json` generation block so it does not run when `APPEND_TO_EXISTING_PARENT=true`. Concretely, the parent block at `create.sh:1313-1321` should be conditioned as `if [[ "$APPEND_TO_EXISTING_PARENT" != true && -f "$_DESC_SCRIPT" ]]; then ... fi`, or equivalently should branch around the `node "$_DESC_SCRIPT" "$FEATURE_DIR" "$(dirname "$FEATURE_DIR")" --description "$FEATURE_DESCRIPTION" --level "phase"` call only for append mode.
- EvidenceRefs: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1046`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1054`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1055`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1310`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1315`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1351`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1355`, `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:77`, `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:83`, `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:90`, `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:108`.
- Why minimal: The defect is caused by the append-mode parent write after `FEATURE_DIR` has been rebound to the existing parent. Skipping that one write leaves normal new-parent scaffolding unchanged, leaves the child loop unchanged, and avoids modifying the shared generator or merge semantics.
- Legitimate child write preserved: The child block still creates `_child_path`, then invokes the same generator with `_child_path` and `--description "Phase ${_i}: ${_phase_name}"` (`create.sh:1329`, `create.sh:1351-1357`). The proposed guard is above the loop and only suppresses the parent call in append mode.
- Phase-parent detection cross-check: `isPhaseParent()` detects a phase parent by direct `NNN-*` child folders that contain `spec.md` or `description.json`, not by the parent folder's own `description.json` (`is-phase-parent.ts:38`, `is-phase-parent.ts:50-51`). The fix still creates child folders and child metadata, so it does not break phase-parent detection.
- Phase-classifier cross-check: `scripts/utils/phase-classifier.ts` re-exports the conversation phase classifier, and `scripts/lib/phase-classifier.ts` scores conversation labels such as Research, Planning, Implementation, Debugging, and Verification. It does not classify spec-folder parent/child topology, so this fix has no phase-classifier contract to preserve beyond not changing its inputs.
- CounterevidenceSought: Checked for a safer generator-level fix, but changing `generate-description.ts` would alter all explicit-description callers and risk regressing the legitimate child write. Checked whether parent detection needs the parent description, and it does not. Checked whether skipping the parent call would affect newly-created phase parents; it would not if the guard is keyed only to `APPEND_TO_EXISTING_PARENT=true`.
- AlternativeExplanation: A generator hardening change could reject canonical identity changes on existing folders, but that is broader than the observed append-mode bug and would need separate compatibility analysis for other generator callers.
- Finding class: cross-consumer.
- Scope proof: Exact grep found only the append-mode parent call at `create.sh:1315` and the separate child call at `create.sh:1355` in the phase scaffold path; previous iterations confirmed the parent write as deterministic only when `APPEND_TO_EXISTING_PARENT=true`.
- Affected surface hints: `create.sh phase append mode`, `description.json metadata identity`, `phase-parent resume/search metadata`, `child phase metadata generation`.
- Recommendation: Implement the append-mode guard around the parent generation call, then add a regression test or shell harness fixture that appends a phase under a copied existing parent and asserts the parent `description.json` is byte-stable while the new child `description.json` is created.
- FinalSeverity: P1.
- Confidence: 0.94.
- DowngradeTrigger: Downgrade only if an unreviewed runtime wrapper already prevents the parent generation block from executing when `APPEND_TO_EXISTING_PARENT=true`, or if parent metadata regeneration in append mode is a documented requirement with a parent-owned description source.

#### T1-P1-003 [P1] Already-corrupted phase-parent metadata needs a scoped dry-run repair pass after the writer fix

- Claim: Fixing `create.sh` prevents future append-mode parent rewrites but does not repair the already-corrupted `001-speckit-memory` metadata found in iteration 3. A follow-up repair must be explicit, scoped, and dry-run first: classify phase parents using the same direct-child rule as `isPhaseParent()`, compare each `description.json.specFolder` and `parentChain` against the folder's repo-relative path, and only regenerate confirmed candidates after the writer fix lands.
- EvidenceRefs: `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-003.md:31`, `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/iterations/iteration-003.md:41`, `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:3`, `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:20`, `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/spec.md:41`, `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/spec.md:63`, `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:38`, `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:50`, `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:51`, `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:77`, `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:83`, `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:90`.
- Proposed detection: Read-only classifier over `.opencode/specs/**/description.json` and `specs/**/description.json`; require the physical folder to be a phase parent by the direct `NNN-*` child plus child `spec.md` or `description.json` rule; compute expected repo-relative `specFolder` and expected `parentChain` from path segments; flag candidates where `specFolder` collapses to only the basename or `parentChain` is empty despite a nested path.
- Proposed repair: After the `create.sh` guard is implemented, run the classifier in dry-run mode, create a checkpoint or reviewed diff, regenerate only confirmed candidates from parent-owned `spec.md` with the canonical specs root as base, verify `specFolder` and `parentChain`, then index or scan metadata. Do not infer child-description overwrite solely from basename-only identity; iteration 3 ruled out child-description overwrite for the high-confidence packet.
- CounterevidenceSought: Checked whether the iteration 3 candidate was only a child-description overwrite; it was not, because the parent spec still describes the phase parent and the issue is identity/lineage fields. Checked whether `isPhaseParent()` would miss repaired packets if the parent `description.json` is skipped; it would not, because detection depends on direct children. Checked whether `phase-classifier.ts` imposes folder-shape assumptions; it does not.
- AlternativeExplanation: Some legacy metadata drift may be unrelated to this append-mode bug, so the repair classifier must distinguish same-signature candidates from broader historical drift and should not bulk-write every drift record.
- Finding class: cross-consumer.
- Scope proof: Iteration 3 scanned 4918 `description.json` files and found 2 physical high-confidence same-signature files representing 1 logical packet; this iteration re-read the affected tracked file and parent spec to confirm the persisted mismatch.
- Affected surface hints: `metadata repair tooling`, `memory search specFolder filtering`, `graph parent-chain traversal`, `phase-parent discovery`.
- Recommendation: Treat this as a required follow-up remediation after the writer fix, not as part of the minimal code patch. The repair should be dry-run gated and limited to confirmed same-signature packets.
- FinalSeverity: P1.
- Confidence: 0.88.
- DowngradeTrigger: Downgrade only if both metadata roots containing the corrupted file are proven unreachable by every current scanner/indexer, or if a separate already-approved repair workflow will regenerate the confirmed candidate before the writer fix ships.

### P2

None.

## Traceability Checks

- `spec_code`: PASS. The fix proposal follows the exact producer path from append-mode routing through parent generator invocation and preserves the separate child generator invocation.
- `checklist_evidence`: NOT APPLICABLE. This Target 1 review pass is not auditing a completion checklist.
- `skill_agent`: PASS. The deep-review skill was loaded, and `sk-code-review/references/review_core.md` was read before severity classification.
- `agent_cross_runtime`: NOT APPLICABLE. No executor parity behavior was under review.
- `feature_catalog_code`: NOT APPLICABLE. No feature catalog surface was under review.
- `playbook_capability`: NOT APPLICABLE. No playbook capability claim was under review.

## SCOPE VIOLATIONS

None. No reviewed code or metadata files were modified. The repair proposal for the corrupted `description.json` files was recorded as a finding only.

## Verdict

CONDITIONAL. The minimal code fix is clear, but Target 1 still has active P1 work: implement the append-mode parent-generation guard and perform a scoped dry-run repair of already-corrupted metadata.

## Next Dimension

Proceed to Target 2 correctness: audit the shipped `deriveStatus` completion-evidence fix against REQ-001 through REQ-005.
Review verdict: CONDITIONAL
