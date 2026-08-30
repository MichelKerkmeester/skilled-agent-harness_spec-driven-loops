# Iteration 3 - Traceability: leftover docs pointers vs packet completion claim

## Dispatcher
Dimension: traceability
Focus: Spec/code/docs alignment after standalone checklist retirement. Template examples and README still name the deleted file. This packet claims Complete while its merged verification section is unchecked. Plan.md still describes a pre-merge checklist fallback the live rule no longer has.

## Files Reviewed
- `.opencode/skills/system-spec-kit/templates/README.md:105,141`
- `.opencode/skills/system-spec-kit/templates/examples/README.md:68`
- `.opencode/skills/system-spec-kit/templates/examples/level-2/spec.md:195`
- `.opencode/skills/system-spec-kit/templates/examples/level-2/tasks.md:123`
- `.opencode/skills/system-spec-kit/templates/examples/level-3/spec.md:271`
- `.opencode/skills/system-spec-kit/templates/examples/level-3+/spec.md:381`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/plan.md:82`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:107-124`
- `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1260-1315`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/spec.md:59`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/implementation-summary.md:25,44`

## Findings - New

### P0 Findings
None.

### P1 Findings
- **F006**: Templates README and worked examples still point at deleted checklist.md — `.opencode/skills/system-spec-kit/templates/README.md:105` — the tree and key-files table still list `addons/checklist.md.tmpl` (file glob is empty). Level-2/3/3+ examples say `See checklist.md` (`examples/level-2/spec.md:195`, `level-3/spec.md:271`, `level-3+/spec.md:381`) and matching tasks.md cross-refs. `examples/README.md:68` still says level-2 docs include checklist.md. An author following the template docs would recreate the retired document.
- **F007**: Packet verification checkboxes are unchecked while Status is Complete — `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:124` — `extractMergedVerification` spans `ANCHOR:protocol` through `ANCHOR:summary` (`graph-metadata-parser.ts:1298-1307`). That slice contains CHK-001..CHK-051 all `[ ]`. `evaluateChecklistCompletion` then returns INCOMPLETE (`:1310-1315`) and deriveStatus becomes `in_progress` (`:1263-1266`). spec.md table Status is Complete (`spec.md:59`); implementation-summary `completion_pct` is 100. Spec out-of-scope note covers checklist-as-pattern for the retirement itself; this packet's own completion claim still fails the generator.

### P2 Findings
- **F008**: Plan still describes a pre-merge checklist fallback the live rule removed — `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/plan.md:82` — Architecture still says "the merged tasks document first, the pre-merge checklist second". Live `_ac_traceability_file` returns only tasks.md with a protocol anchor and otherwise fails (`check-ac-coverage.sh:84-92`). Docs lag the shipped resolver.

## Claim Adjudication
- F006: claim=template docs still instruct authors to use deleted checklist.md; evidenceRefs=`templates/README.md:105`,`examples/level-2/spec.md:195`; counterevidenceSought=a live addons/checklist.md.tmpl (glob empty); alternativeExplanation=docs are historical and operators only follow spec-kit-docs.json; finalSeverity=P1; confidence=0.88; downgradeTrigger=if README is generated from the manifest and the stale tree is already queued.
- F007: claim=this packet would derive in_progress because merged verification CHK items are open; evidenceRefs=`tasks.md:124`,`graph-metadata-parser.ts:1263`; counterevidenceSought=sign-off end marker that excludes CHK items from the slice (summary marker is used; CHK items sit before it); alternativeExplanation=deriveStatus is not run on this packet so the Complete table is operator-authored only; finalSeverity=P1; confidence=0.9; downgradeTrigger=if extractMergedVerification is changed to stop at /ANCHOR:protocol.
- F008: claim=plan.md architecture still names the retired fallback; evidenceRefs=`plan.md:82`,`check-ac-coverage.sh:84`; counterevidenceSought=a second resolver that still prefers checklist.md; alternativeExplanation=plan describes pre-change intent not post-ship state; finalSeverity=P2; confidence=0.8; downgradeTrigger=if plan.md is frozen as historical design and implementation-summary is the shipped contract.

## Traceability Checks
- spec_code / REQ-001 template deletion: partial — files are gone; README/examples still name them (F006).
- spec_code / REQ-005 live resolver vs plan.md: partial — code matches REQ-005; plan.md:82 does not (F008).
- checklist_evidence / this packet: fail — T001-T012 are checked, but merged verification CHK items are open while Status is Complete (F007). T011 remains fail from iteration 1.
- skill_agent / agent_cross_runtime: notApplicable.
- feature_catalog_code / playbook_capability: notApplicable — no catalog or playbook in this packet.

## Confirmed-Clean Surfaces
- `templates/core/spec.md.tmpl` has no `checklist.md` pointer.
- `CANONICAL_PACKET_DOCS` still excludes checklist.md.
- Overlay protocols remain notApplicable for a spec-folder target without catalog/playbook artifacts.

## Assessment
Dimensions addressed: traceability
Provisional iteration verdict: CONDITIONAL (5 P1 after this pass: F001-F003 + F006-F007; 3 P2)
Maintainability (D4) remains uncovered because maxIterations=3.
newFindingsRatio telemetry: 1.0 (all findings this pass are new); stopPolicy=max-iterations → STOP after this iteration

## Next Focus (recommendation)
Maintainability would be next (stale tests vs docs vs generator completion). Not executed: iteration ceiling reached.

## SCOPE VIOLATIONS
None. Graph upsert, validate.sh, generate-context.js, and git writes skipped because they write outside this lineage.

Review verdict: CONDITIONAL
