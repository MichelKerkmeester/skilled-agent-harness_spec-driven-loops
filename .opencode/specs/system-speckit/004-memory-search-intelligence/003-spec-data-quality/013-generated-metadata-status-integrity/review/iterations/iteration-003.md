# Deep Review Iteration 003

## Dimension

Security - blast-radius scan for Target 1 only.

Scope was read-only across `.opencode/specs/**/description.json` and `specs/**/description.json`. No reviewed metadata files were modified.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28` - severity contract.
- `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md:166` - iteration artifact contract.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-state.jsonl:1` - review state lineage.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/deep-review-strategy.md:72` - planned blast-radius scan.
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:77` - relative path source for `specFolder`.
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:83` - generated `specFolder` assignment.
- `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:90` - generated `parentChain` assignment.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1315` - parent description generation call.
- `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:27` - phase-parent classifier definition.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:3` - basename-only `specFolder` in tracked metadata root.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:20` - empty `parentChain` in tracked metadata root.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/spec.md:41` - parent packet title.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/spec.md:63` - parent purpose statement.
- `specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:3` - duplicate basename-only `specFolder` in legacy metadata root.
- `specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:20` - duplicate empty `parentChain` in legacy metadata root.
- `specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/spec.md:41` - duplicate parent packet title.
- `specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/spec.md:63` - duplicate parent purpose statement.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/description.json:3` - canonical path-shaped sibling metadata contrast.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/description.json:25` - canonical non-empty parent chain contrast.

Scan coverage: 4918 `description.json` files enumerated, 512 phase-parent packets classified, 0 parse errors. High-confidence same-corruption candidates: 2 files, representing 1 logical packet duplicated under `.opencode/specs` and `specs`.

## Findings by Severity

### P0

None.

### P1

#### T1-P1-002: Existing phase-parent metadata is already stored under basename-only identity in both metadata roots

- Claim: The `001-speckit-memory` phase-parent packet already carries the same metadata identity corruption signature on disk: `specFolder` is reduced to `001-speckit-memory`, and `parentChain` is `[]`, even though the folder path is `system-speckit/004-memory-search-intelligence/001-speckit-memory`.
- EvidenceRefs: `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:3`, `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:20`, `specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:3`, `specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:20`.
- Parent-purpose cross-check: The parent `spec.md` title and purpose are still parent-level (`Spec-Kit Memory MCP Phase Parent`, routing 30 Memory MCP child folders), so the confirmed persisted corruption is identity/lineage metadata rather than the description body itself. Evidence: `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/spec.md:41`, `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/spec.md:63`, `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/spec.md:66`.
- CounterevidenceSought: A path-aware JSON classifier scanned both requested roots; it required a direct phase-parent child set and looked separately for missing track prefix, empty parent chain, and child-phase description labels. It found exactly 2 high-confidence files across 512 parent packets.
- AlternativeExplanation: The duplicate roots may intentionally mirror the same packet, and some unrelated metadata drift exists in older folders. That does not downgrade this candidate because both mirrored files are persisted metadata surfaces and both carry the exact basename-only `specFolder` plus empty `parentChain` signature.
- FinalSeverity: P1.
- Confidence: 0.91.
- DowngradeTrigger: Downgrade only if the runtime contract is changed or proven to ignore `description.json.specFolder` and `parentChain` for both memory search and graph traversal, or if one of the two roots is confirmed non-indexed and unreachable by all metadata scanners.
- Finding class: cross-consumer.
- Scope proof: 4918 `description.json` files scanned; 512 parent packets classified; 2 file candidates found; 1 unique logical packet affected.
- Affected surface hints: `memory_search` spec-folder filtering, graph traversal parent lineage, phase-parent discovery, duplicate-root metadata scans.
- RiskScore: 7 (advisory only).
- Recommendation: After fixing the parent-write path in `create.sh`, repair or regenerate both `description.json` copies for `system-speckit/004-memory-search-intelligence/001-speckit-memory` so `specFolder` and `parentChain` match the path identity.

### P2

None.

## Traceability Checks

- `spec_code`: PASS. The expected metadata fields come from `generate-description.ts:77-90`, while the observed files show basename-only `specFolder` and empty `parentChain`.
- `checklist_evidence`: NOT APPLICABLE. This iteration was a read-only blast-radius data-integrity scan, not a completion-evidence audit.
- `skill_agent`: PASS. `deep-review` was loaded, and `sk-code-review/references/review_core.md` was read before severity classification.
- `agent_cross_runtime`: NOT APPLICABLE. No cross-runtime executor behavior was under review.
- `feature_catalog_code`: NOT APPLICABLE. The target was generated metadata identity, not feature catalog code.
- `playbook_capability`: NOT APPLICABLE. No playbook capability claim was adjudicated.

## Blast-Radius Assessment

- Confirmed blast radius: 2 physical files, 1 logical active phase-parent packet.
- Confirmed corruption signatures: missing track/path prefix in `specFolder`; empty `parentChain` despite a nested track path.
- Not confirmed: child-description overwrite in the affected packet. The description body still reads as a parent-level summary and aligns with the parent `spec.md` title/purpose.
- Related but not counted: the scan also surfaced 332 related metadata drift records, mostly absolute-root `parentChain` values or legacy `system-spec-kit` versus `system-speckit` path spelling mismatches. Those are not the same high-confidence corruption signature and were deferred rather than counted as Target 1 same-corruption blast radius.
- If left unfixed, the affected logical packet can become difficult to retrieve by its real folder path, can be grouped under the wrong `specFolder`, and can lose parent-chain lineage in graph traversal. This matches the framework warning that wrong or missing `description.json` metadata can make packets invisible or miswired for memory search and graph traversal.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. One new P1 data-integrity blast-radius finding was confirmed.

## Next Dimension

Traceability.

Review verdict: CONDITIONAL
