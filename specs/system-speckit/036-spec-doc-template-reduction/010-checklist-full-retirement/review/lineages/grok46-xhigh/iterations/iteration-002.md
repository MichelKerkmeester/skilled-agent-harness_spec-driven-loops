# Iteration 2 - Security: fingerprint skip, path confinement, leftover checklist signals

## Dispatcher
Dimension: security
Focus: Confirm the fingerprint generation skip is the intended docset marker, that packet-doc collection cannot traverse, and that leftover checklist path heuristics cannot be used as a write or privilege path.

## Files Reviewed
- `.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:160-170`
- `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:52-62,670-704,729-739`
- `.opencode/skills/system-spec-kit/mcp-server/lib/search/validation-metadata.ts:105-112,228-233`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:250-259`
- `.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh` (no `checklist` string)
- `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js` (no `checklist` string)

## Findings - New

### P0 Findings
None.

### P1 Findings
None this pass.

### P2 Findings
- **F004**: checklistFromFilePath uses a substring match not a path segment — `.opencode/skills/system-spec-kit/mcp-server/lib/search/validation-metadata.ts:111` — the comment says a checklist segment, but `filePath.toLowerCase().includes('checklist')` matches any substring. This packet folder `010-checklist-full-retirement` therefore tags every file in the packet with `hasChecklist: true` at `validation-metadata.ts:229-232`. Score fields are not modified (metadata-only), so this is classification pollution, not a producer or auth bypass.
- **F005**: Level discovery still treats sibling checklist.md as a Level-2 signal — `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:255` — after the SPECKIT_LEVEL header miss, `siblings.includes('checklist.md')` returns 2. Remaining copies under symlinked repos would still bump inferred level. Not a write path; leftover read-path after REQ-005.

## Claim Adjudication
- F004: claim=substring checklist match false-positives this packet; evidenceRefs=`mcp-server/lib/search/validation-metadata.ts:111`,`validation-metadata.ts:229`; counterevidenceSought=path.sep-bounded segment split (not present); alternativeExplanation=callers ignore hasChecklist so the flag is unused; finalSeverity=P2; confidence=0.84; downgradeTrigger=if no indexer consumes validationMetadata.hasChecklist.
- F005: claim=sibling checklist.md still infers Level 2; evidenceRefs=`memory-index-discovery.ts:255`; counterevidenceSought=SPECKIT_LEVEL always present so the fallback never runs on live packets; alternativeExplanation=heuristic is documented memory-taxonomy residue the operator kept; finalSeverity=P2; confidence=0.78; downgradeTrigger=if every in-scope spec.md carries SPECKIT_LEVEL.

## Traceability Checks
- spec_code / REQ-002 fingerprint skip: pass — `storedDocset !== SOURCE_FINGERPRINT_DOCSET` returns without mismatch (`generated-metadata-integrity.ts:168`); `SOURCE_FINGERPRINT_DOCSET = 2` (`graph-metadata-parser.ts:739`).
- spec_code / REQ-001 producer: pass — `upgrade-level.sh` and `template-structure.js` have no `checklist` string; `templates/**/checklist.md*` glob is empty.
- spec_code / REQ-004 symlink writes: pass for remaining producers — collectPacketDocs iterates a fixed relative-path list then `path.join` (`graph-metadata-parser.ts:670-675`); no lstat is needed because this packet no longer deletes checklist.md from upgrade-level.sh.
- skill_agent / agent_cross_runtime: notApplicable (spec-folder target).
- feature_catalog_code / playbook_capability: notApplicable — no feature-catalog or playbook artifacts in this packet.

## Confirmed-Clean Surfaces
- Fingerprint generation skip is the documented docset marker, not a silent integrity bypass.
- `CANONICAL_PACKET_DOCS` is a closed relative-path list; collectPacketDocs does not walk user-supplied paths.
- No remaining production writer of `checklist.md` under system-spec-kit scripts/templates (test fixtures still write temp copies; out of producer scope).

## Assessment
Dimensions addressed: security
Provisional iteration verdict: CONDITIONAL (prior 3 P1 remain; 2 new P2)
newFindingsRatio telemetry: 1.0 (all findings this pass are new); stopPolicy=max-iterations so CONTINUE

## Next Focus (recommendation)
Traceability: template/example cross-refs still pointing at deleted checklist.md, plan.md leftover fallback prose, and this packet's unchecked verification section vs Complete status.

## SCOPE VIOLATIONS
None. Graph upsert, validate.sh, generate-context.js, and git writes skipped because they write outside this lineage.

Review verdict: CONDITIONAL
