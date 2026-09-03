---
title: "Deep Review Iteration 003"
trigger_phrases: []
---
# Deep Review Iteration 003

## Dispatcher
- Session: `fanout-luna-xhigh-1788073473072-dysoga`
- Lineage: `new`, generation 1
- Dimension: traceability only
- Focus: reconcile normative requirements, acceptance rows, tasks verification evidence, implementation summary, tests, and exact producer/consumer surfaces
- Budget profile: verify
- Iteration derivation: authoritative lineage state contains two `type=iteration` records; this is iteration 003 at the hard ceiling (`maxIterations=3`).
- Output status: gateway receipt succeeded and committed sequence 3; the authoritative root projection still shows two iteration records, so the orchestrator's post-pass reducer refresh remains required and was not run. Review target and reducer-owned files were read-only.

## Files Reviewed
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/spec.md:103-143,170-190`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/plan.md:49-86,126-145`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:90-94,110-208`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/acceptance-criteria.md:52-92`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/implementation-summary.md:67-78,110-151`
- `.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh:729-744,1442-1444,1617-1620`
- `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:545-585`
- `.opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh:89-119`
- `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:52-62,1468-1475`
- `.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:150-176`
- `.opencode/skills/system-spec-kit/scripts/tests/check-ac-coverage.sh:1-211`
- `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:128-154`
- `.opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:211-231`

## Findings - New

### P0 Findings
None. No traceability defect established destructive data loss, authentication bypass, or privileged execution.

### P1 Findings
1. **The verification checklist claims closure while a required P1 item is explicitly deferred without approval** -- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:116-119,163-164,200-208` -- the local protocol says a P1 item must be completed or receive user approval, but `CHK-FIX-006` remains unchecked and only supplies a reason. The same document marks the packet complete, while its Verification Summary reports `P1 Items | 0 | 0/0` and `Verification Date: Not yet`; `acceptance-criteria.md:90-92` nevertheless says `Closeable: Yes`.
   - Finding class: matrix/evidence
   - Scope proof: The protocol, the sole unchecked P1 item, and the summary were read together; no packet-local approval or protocol exception is recorded. This is a closure-evidence contradiction, not a claim about the changed implementation.
   - Affected surface hints: ["tasks.md verification protocol", "CHK-FIX-006", "acceptance-criteria.md closure", "implementation-summary.md verification"]
   - Recommendation: Complete CHK-FIX-006, record the required user approval in the packet, or amend the protocol to state why this item is outside its P1 completion rule; then regenerate the verification summary and closure claim.
   - Claim adjudication: {"type":"closure-evidence contract claim","claim":"The packet cannot truthfully claim a complete verification checklist while CHK-FIX-006 is unchecked because its own protocol requires every P1 item to be complete or user-approved.","evidenceRefs":["specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:116-119","specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:163-164","specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:200-208","specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/acceptance-criteria.md:90-92"],"counterevidenceSought":"A packet-local approval, ADR, or explicit protocol scope that authorizes this P1 deferral.","alternativeExplanation":"The deferred note may be intended as an accepted exception, but no approval or exception rule is present and the protocol reserves documented-only deferral for P2.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"A recorded approval, a checked item with evidence, or an explicit protocol amendment that governs this exception."}

2. **AC-007 does not provide evidence for the full rules/server/scripts scope named by REQ-005** -- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/spec.md:131-143; specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/acceptance-criteria.md:64` -- REQ-005 requires every read-path to be removed from rules, server modules, and scripts, but AC-007's Verification cell only reports a zero search across rules, live templates, and `templates/spec-kit-docs.json`. T006 narrows its concrete zero claim further to `scripts/rules/`, while the implementation summary gives only an aggregate “35 files” statement (`implementation-summary.md:75`) without enumerating or naming the server/script search result.
   - Finding class: matrix/evidence
   - Scope proof: The normative requirement, criterion wording, task evidence, and implementation-summary scope were directly compared. The evidence names no MCP server module or non-rule script result, so it cannot independently establish the criterion's stated surface.
   - Affected surface hints: ["REQ-005", "AC-007 verification", "scripts/rules", "mcp-server modules", "scripts consumers"]
   - Recommendation: Attach the exact bounded search and zero-result output for all enumerated rules, MCP modules, and scripts, or narrow REQ-005/AC-007 to the smaller surface actually checked; keep the file inventory and criterion wording synchronized.
   - Claim adjudication: {"type":"acceptance-scope traceability claim","claim":"AC-007 is marked Met without evidence covering all producer/consumer categories named by REQ-005.","evidenceRefs":["specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/spec.md:131-143","specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/acceptance-criteria.md:64","specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:67-68","specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/implementation-summary.md:75"],"counterevidenceSought":"A named search artifact or command output covering every MCP server module and script in the declared inventory.","alternativeExplanation":"The aggregate 35-file statement may represent a complete search performed outside the packet, but it does not identify the command, file set, or result needed for independent acceptance.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"A reproducible full-scope search record, or a corrected criterion whose scope matches the evidence actually retained."}

3. **Fingerprint-generation coverage is claimed in the task matrix but absent from the cited test surface** -- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:163; specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/acceptance-criteria.md:60-61` -- CHK-FIX-005 says 16 rows cover the axes “id shape x source document x fingerprint generation,” yet `scripts/tests/check-ac-coverage.sh:1-211` exercises the evidence rule and traceability-source selection only. Its temporary packets never invoke the fingerprint producer or validator, and the bounded search over `scripts/tests` found no `SOURCE_FINGERPRINT_DOCSET`, `source_fingerprint_docset`, or `SOURCE_FINGERPRINT_MISMATCH` test reference. AC-003 and AC-004 therefore retain manual 12-packet/edit claims without naming a reproducible generation fixture or command.
   - Finding class: matrix/evidence
   - Scope proof: The cited shell suite was read end-to-end; the exact producer is `graph-metadata-parser.ts:52-62,1468-1475` and the consumer is `generated-metadata-integrity.ts:150-176`, but neither is exercised by the cited suite. This distinguishes evidence-rule coverage from fingerprint-generation coverage.
   - Affected surface hints: ["CHK-FIX-005 test matrix", "AC-003/AC-004", "graph metadata fingerprint producer", "generated metadata integrity consumer", "generation fixtures"]
   - Recommendation: Add or name a test that creates stale-generation, current-generation/no-drift, and current-generation/drift cases against the producer/consumer pair, and record its command/output; otherwise remove fingerprint generation from the 16-row coverage claim.
   - Claim adjudication: {"type":"test-surface traceability claim","claim":"The packet's retained test evidence proves the fingerprint-generation axis and the AC-003/AC-004 behavior.","evidenceRefs":["specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:163","specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/acceptance-criteria.md:60-61",".opencode/skills/system-spec-kit/scripts/tests/check-ac-coverage.sh:1-211",".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:52-62",".opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:150-176"],"counterevidenceSought":"A separate named MCP/server test or committed fixture/output that exercises generation mismatch and current drift behavior.","alternativeExplanation":"The packet may rely on an ad hoc live sample outside the unit suite; without a command, fixture, or retained output, that cannot independently verify the matrix claim.","finalSeverity":"P1","confidence":0.90,"downgradeTrigger":"A directly named executable test and retained result covering both stale-generation compatibility and current-generation drift."}

### P2 Findings
1. **AC-001 and T004 cite the wrong upgrade-level location for the producer evidence** -- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/acceptance-criteria.md:58; specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:66` -- both cite `upgrade-level.sh:798`, while the actual Level 1 to Level 2 acceptance-criteria creation block is at `.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh:729-740`. The stale citation makes an independent reviewer land outside the claimed behavior even though the producer itself is present.
   - Finding class: matrix/evidence
   - Scope proof: The cited packet rows and the current producer block were directly reread; this is a citation repair, not a new producer defect.
   - Affected surface hints: ["AC-001", "T004", "upgrade-level.sh producer block"]
   - Recommendation: Replace the stale line reference with the current creation block and, preferably, retain the live-run output or test name beside it.

## Traceability Checks
- `spec_code`: partial -- REQ-005 and the fingerprint/no-repair requirements are present, but AC-007 and the task matrix do not retain evidence across their full named surfaces; AC-003/004 lack a reproducible generation test pointer.
- `checklist_evidence`: fail -- the P1 protocol requires completion or approval, CHK-FIX-006 is unchecked, and the verification summary reports zero P1 items despite many P1 rows.
- `skill_agent`: notApplicable -- target is a spec folder.
- `agent_cross_runtime`: notApplicable -- no runtime mirror claim is named by this traceability pass.
- `feature_catalog_code`: notApplicable -- no catalog entry is named by the packet.
- `playbook_capability`: notApplicable -- no named playbook claim is in scope.

## Integration Evidence
- Upgrade producer: `.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh:729-740`; top-level dispatch reports created files at `:1442-1444,1617-1620`.
- Contract consumer: `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:545-585`; the contract exposes `acceptance-criteria.md` and no checklist bucket in the reviewed Level 2 block.
- Evidence-rule consumer: `.opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh:89-119`; it applies the merged tasks source to both task-shaped and verification-shaped ids.
- Fingerprint producer/consumer: `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:52-62,1468-1475` and `.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:150-176`.
- Cited test surfaces: `.opencode/skills/system-spec-kit/scripts/tests/check-ac-coverage.sh:1-211`, `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:128-154`, and `.opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:211-231`.
- Missing traceability surface: no fingerprint-generation symbol was found in the bounded `scripts/tests` search; the packet's manual fingerprint claims name neither a command nor a retained fixture/output.

## Edge Cases
- `CHK-FIX-006` is explicitly documented as deferred, but the local protocol gives documented-only deferral to P2, not P1; the reason is evidence of intentional deferral, not approval.
- The acceptance-criteria row for AC-001 and T004 still points at line 798 after the producer block moved to lines 729-740; this is a stale citation rather than a producer regression.
- The broad repository search still finds historical/template-mapping uses of “checklist”; those are outside the declared live producer/consumer file set and were not treated as active findings without a path to the retired document.
- Code graph and semantic memory were unavailable; direct reads and bounded exact searches were used. No validation, repair, build, or reducer was run.
- The gateway receipt reports `projectionRefreshed: true` and the ledger has frame 3, but the authoritative `deep-review-state.jsonl` projection remains at two iteration records; this projection mismatch is carried for the orchestrator rather than repaired directly.
- The previous four P1 and one P2 source-level findings remain active context in the registry; none is duplicated here. This pass adds packet-evidence scope and citation findings only.

## Confirmed-Clean Surfaces
- `upgrade-level.sh:729-740` creates `acceptance-criteria.md` for the Level 1 to Level 2 path and does not create `checklist.md`.
- `spec-kit-docs.json`'s reviewed Level 2 contract contains `acceptance-criteria.md` in `optionalAddonDocs`; the golden test checks all four buckets (`scaffold-golden-snapshots.vitest.ts:136` and surrounding assertions).
- `check-evidence.sh:89-119` applies evidence checking to both `T###` and `CHK-###` shapes from the merged tasks document.
- `check-ac-coverage.sh` directly covers canonical evidence parsing, source precedence, stray checklist rejection, and unanchored tasks rejection; those cases do not prove fingerprint generation and are not counted as such here.
- The packet's acceptance table has eight rows, each marked `Met`; that status is recorded as packet intent, while the findings above identify where its retained evidence is insufficient or stale.

## Ruled Out
- No P0 escalation: the traceability gaps block independent acceptance evidence but do not establish destructive data loss, auth bypass, or privileged execution.
- No duplicate of P1-001 through P1-004 or P2-001: those are current source correctness/security boundaries from earlier iterations; this pass tests their packet claims and evidence surfaces rather than reasserting their code behavior.
- No separate maintainability dimension finding: maintainability was considered only where stale citations and incomplete evidence affect traceability.
- No feature-catalog, playbook, runtime-mirror, or resource-map overlay claim was present to review.

## Next Focus
- dimension: none -- hard ceiling reached
- focus area: synthesis of active traceability findings and prior source-boundary findings
- reason: iteration 003 is the configured maximum; no further leaf review should run
- rotation status: stopped at max-iterations
- blocked/productive carry-forward: productive -- carry P1-005 through P1-007 and P2-002 to synthesis; retain prior P1-001 through P1-004 and P2-001 as context
- required evidence: gateway receipt, refreshed authoritative state projection, first delta record equality, and unchanged read-only review targets
- recovery note: if gateway verification fails, report error and do not run a reducer or directly repair the projection

Review verdict: CONDITIONAL