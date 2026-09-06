---
title: "Deep Review Iteration 001"
trigger_phrases: []
---
# Deep Review Iteration 001

## Dispatcher
- Session: `fanout-luna-xhigh-1788073473072-dysoga`
- Lineage: `new`, generation 1
- Dimension: correctness
- Focus: broad producer/consumer and boundary behavior
- Budget profile: verify (current-source rereads and P1 adjudication)

## Files Reviewed
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/spec.md:53-86`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:35-64`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/acceptance-criteria.md:30-47`
- `.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh:729-744`
- `.opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh:89-119`
- `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:52-62, 670-676, 736-752, 1468-1475`
- `.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:150-171`
- `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:10-19`
- `.opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts:190-216`
- `.opencode/skills/system-spec-kit/scripts/tests/check-ac-coverage.sh:135-151`
- `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:28-50`
- `.opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:211-231`
- `.opencode/skills/system-spec-kit/mcp-server/lib/search/validation-metadata.ts:104-116`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:245-265`

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **Current-generation fingerprints omit acceptance criteria from the hashed source set** -- `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:52-62,673-676` -- `CANONICAL_PACKET_DOCS` drives `collectPacketDocs`, and its complete list contains `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, research, handover, and resource-map, but not `acceptance-criteria.md`. The generator and validator therefore compute the same digest while ignoring edits to a document that the packet contract treats as a canonical spec document (`spec-doc-paths.ts:10-19`) and that validation explicitly collects when present (`spec-doc-structure.ts:190-216`). A current-generation packet can change acceptance criteria without `generated-metadata-integrity.ts:168-170` reporting `SOURCE_FINGERPRINT_MISMATCH`, contradicting the packet's stated real-drift guarantee in `spec.md:76-85` and `acceptance-criteria.md:36-40`.
   - Finding class: cross-consumer
   - Scope proof: The parser's `collectPacketDocs` loop is the only source-doc collection used by `computeSourceFingerprintForFolder`; the strict validator compares the resulting digest at `generated-metadata-integrity.ts:150-171`. The independent document allowlists include `acceptance-criteria.md`, while the fingerprint list does not.
   - Affected surface hints: ["graph metadata producer", "generated metadata integrity consumer", "acceptance-criteria.md document contract", "current-generation drift tests"]
   - Recommendation: Include `acceptance-criteria.md` in the canonical fingerprint set (and bump the documented source-doc generation), or explicitly define and test it as excluded from source-drift semantics. Add a current-generation acceptance-criteria edit case so the producer/consumer boundary cannot silently diverge.
   - Claim adjudication: {"type":"cross-consumer correctness claim","claim":"The current-generation source fingerprint does not detect edits to acceptance-criteria.md.","evidenceRefs":[".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:52-62",".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:673-676",".opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:150-171",".opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:10-19",".opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts:190-216"],"counterevidenceSought":"A separate acceptance-criteria hash or validation path that augments computeSourceFingerprintForFolder.","alternativeExplanation":"Acceptance criteria may be intentionally excluded from generated source fingerprints as derived/optional content, but no such exclusion is documented in the fingerprint contract and the packet's canonical document/validation surfaces include it.","finalSeverity":"P1","confidence":0.88,"downgradeTrigger":"If the owning fingerprint contract explicitly excludes acceptance-criteria.md or an independently consumed acceptance-criteria digest is proven."}

## Traceability Checks
- `spec_code`: partial — producer retirement and generation-boundary intent are evidenced, but the real-drift claim does not enumerate acceptance-criteria.md and the current hash set omits it.
- `checklist_evidence`: pass — the merged tasks evidence rule and current test fixtures were reread; prior fanout stale-test hypotheses are resolved in the current files.
- `skill_agent`: notApplicable — target is a spec folder.
- `agent_cross_runtime`: notApplicable — no runtime mirror was in the declared review focus.
- `feature_catalog_code`: notApplicable — no catalog entry is named by this packet.
- `playbook_capability`: notApplicable — no named playbook claim was reviewed.

## Integration Evidence
- Producer reviewed: `.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh:729-744` creates `acceptance-criteria.md` for the L1→L2 path and no standalone checklist.
- Fingerprint producer reviewed: `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:52-62,673-676,1468-1475`.
- Fingerprint consumer reviewed: `.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:150-171`.
- Packet-document consumers reviewed: `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:10-19` and `.opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts:190-216`.
- Prior fanout findings were treated as hypotheses only; current rereads confirmed the stale test and substring-path hypotheses are fixed and they were not copied as findings.

## Edge Cases
- A stale pre-generation fingerprint is intentionally skipped by `generated-metadata-integrity.ts:166-170`; that containment avoids fleet-wide false drift but does not address the current-generation omission above.
- Missing `acceptance-criteria.md` is valid for some packet levels, so adding it to the set must preserve the existing missing-document behavior and generation compatibility.
- The repository retains intentional `checklist` taxonomy/history references; those are not standalone document producers and were ruled out for this correctness pass.
- Code graph and semantic memory were unavailable; direct reads of the named producer and consumers provide the available evidence.
- The first legacy-shaped gateway input was refused before append; it was replaced with a valid canonical stem event, and the single successful append produced sequence 1 with `projectionRefreshed: true`. The gateway projection is at `review/deep-review-state.jsonl` relative to this lineage root.

## Confirmed-Clean Surfaces
- The upgrade producer's L1→L2 branch renders `acceptance-criteria.md` and does not render `checklist.md` (`upgrade-level.sh:729-744`).
- The current evidence rule applies to both `T###` and `CHK-###` item shapes (`check-evidence.sh:89-119`).
- Current test files retarget the merged tasks source, acceptance-criteria-only contract, and no-checklist example expectations (`scripts/tests/check-ac-coverage.sh:135-151`, `level-contract-resolver.vitest.ts:28-50`, `test-integration.vitest.ts:211-231`).
- The current path classifier is filename-bounded rather than substring-based, and level discovery no longer uses a checklist sibling heuristic (`validation-metadata.ts:104-116`, `memory-index-discovery.ts:245-265`).
- Gateway verification found exactly one iteration row in `review/deep-review-state.jsonl`; the root-level initialization projection was not directly edited.
- A tracked workspace diff already exists at `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/review/observability-events.jsonl`, outside this lineage's writable artifacts. This iteration did not modify it; clean-target diff verification is therefore blocked by pre-existing workspace state.

## Ruled Out
- Prior fanout findings F001-F003, F004, and F005 were not reused: current source rereads show their tests and heuristics have been corrected.
- A P0 was ruled out: the omission causes missed drift detection, not an exploitable security issue, authentication bypass, destructive write, or data loss.
- No direct producer regression was found in the L1→L2 upgrade path.

## Next Focus
- dimension: security
- focus area: fingerprint-generation boundaries, path confinement, and stale-generation skip behavior
- reason: correctness exposed a cross-consumer document-set boundary; the next pass should test whether the skip and path handling can suppress or redirect validation beyond the intended packet.
- rotation status: planned
- blocked/productive carry-forward: productive — retain the current-generation acceptance-criteria omission as a carried hypothesis only if a security boundary depends on it; do not duplicate this finding without new evidence.
- required evidence: direct reads of fingerprint generation/validation callers, path normalization, symlink handling, and any write/repair boundary.
- recovery note: graph and semantic-memory evidence remain unavailable; use direct source reads and bounded searches.

Review verdict: CONDITIONAL