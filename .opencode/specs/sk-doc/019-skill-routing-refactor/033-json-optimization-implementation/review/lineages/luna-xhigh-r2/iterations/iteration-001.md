# Deep Review Iteration 001

## Dispatcher

- Route: Resolved route: mode=review target_agent=deep-review
- Target: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation`
- Focus: correctness
- Budget profile: scan
- Status: complete

## Dimension

Correctness. Reviewed parent/child status coherence, phase acceptance claims, and the command-bridge implementation anchors named by the packet.

## Files Reviewed

- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:46`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:80`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:86`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:94`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:129`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:151`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/001-derived-authority-decision/spec.md:47`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/002-baseline-capture/spec.md:45`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/spec.md:25`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/spec.md:44`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/010-parent-intent-projection-spike/implementation-summary.md:40`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/010-parent-intent-projection-spike/implementation-summary.md:51`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:84`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:85`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:86`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:89`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:93`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:94`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:103`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:3`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:24`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:41`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:42`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:77`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:85`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/012-integration-verification-rollout/spec.md:30`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/012-integration-verification-rollout/spec.md:49`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:58`
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2126`
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2219`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Parent coordination map is stale against every child phase status** -- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:129` -- The parent marks the overall packet Complete at `spec.md:46`, and child specs all self-report Complete, but the parent Phase Documentation Map still lists every phase 1-12 as Planned at `spec.md:129-140`. The same parent says this map is "the coordination truth" at `spec.md:151`, so operators following the parent will believe no phase has executed even though each child phase reports completion. This breaks the packet's own completion/ordering contract and can mis-route release or follow-up decisions. [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:46`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:129`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:140`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:151`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/001-derived-authority-decision/spec.md:47`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/012-integration-verification-rollout/spec.md:49`]
   Finding class: matrix/evidence
   Scope proof: Direct status sweep over `001` through `012` child `spec.md` files found all twelve `**Status** | Complete` rows, while direct reread of the parent map found all twelve rows still `Planned`.
   Affected surface hints: ["parent Phase Documentation Map", "child phase status metadata", "release-readiness routing", "resume/coordination readers"]
```json
{"type":"gate-relevant-p1","claim":"The parent coordination map lists all twelve child phases as Planned even though the child specs self-report Complete and the parent calls that map the coordination truth.","evidenceRefs":[".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:46",".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:129",".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:140",".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/spec.md:151",".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/001-derived-authority-decision/spec.md:47",".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/012-integration-verification-rollout/spec.md:49"],"counterevidenceSought":"Reread the full parent phase map and ran a filename-bearing status sweep across all child spec.md files. No child spec status row reported Planned.","alternativeExplanation":"The parent table may have been intended as a planning snapshot, but the same section labels it the coordination truth and it has no separate planning-vs-execution status column.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"If the parent explicitly labels the table as a historical planning snapshot and adds a current execution-status source elsewhere, downgrade to P2 documentation hygiene."}
```

2. **Command-metadata phase claims Complete while live-generation acceptance remains unmet** -- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:41` -- The phase reports `Status | Complete` and `completion_pct: 100`, but the same implementation summary says `Delivered | Not yet - Planned, blocked on 006`, its verification says "Not yet run - this packet is Planned", and its limitations still say it is blocked on 006. The phase spec requires generated TS/Python `COMMAND_BRIDGES` blocks and a corpus-gated live cutover, while its recorded amendment says the cutover was reverted and the live bridge sets remain hand-authored. The live code corroborates that: TypeScript still declares an inline `COMMAND_BRIDGES` array, and Python still declares a hand-authored `COMMAND_BRIDGES` dict plus owner-normalization map. Marking this phase Complete overstates delivery against its own success criteria. [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:24`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:41`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:42`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:77`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:85`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:94`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:103`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:58`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2126`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2219`]
   Finding class: cross-consumer
   Scope proof: Checked the phase spec, the phase implementation summary, and both named live bridge consumers (`projection.ts` and `skill_advisor.py`).
   Affected surface hints: ["011 phase completion metadata", "TypeScript command bridge projection", "Python command bridge routing", "program close gate"]
```json
{"type":"gate-relevant-p1","claim":"Phase 011 is marked Complete even though its generated-live-bridge acceptance criteria are not met and its own summary records the cutover as reverted or planned.","evidenceRefs":[".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:24",".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:41",".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:42",".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/implementation-summary.md:77",".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:85",".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:94",".opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/011-command-metadata-ingestion/spec.md:103",".opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:58",".opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2126",".opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2219"],"counterevidenceSought":"Searched for command bridge generation markers and CLI flags, then reread both live bridge definitions. Shadow tooling exists, but the live TS/Python bridge definitions remain non-generated and the phase text explicitly says the live cutover was reverted.","alternativeExplanation":"The team may intend Complete to mean shadow machinery complete, but the spec's success criteria still require live generated blocks and the implementation summary has not reconciled the deferred requirement.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"If the phase spec is amended to define shadow-only completion and explicitly defer generated live bridge acceptance to a new owning phase, downgrade to P2 or resolved depending on parent mapping."}
```

### P2 Findings

1. **Child spec continuity frontmatter is stale after completion** -- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/spec.md:25` -- Ten child `spec.md` frontmatter blocks still report `completion_pct: 0` while their visible metadata rows report Complete. The implementation summaries appear to be the primary current resume surface, so this is not enough by itself to block release, but stale machine-readable continuity in `003` through `012` can confuse secondary tooling and status audits. [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/spec.md:25`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/spec.md:44`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/012-integration-verification-rollout/spec.md:30`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/012-integration-verification-rollout/spec.md:49`]
   Finding class: matrix/evidence
   Scope proof: Direct `completion_pct` sweep found `001` and `002` at 100 and `003` through `012` at 0; direct status sweep found every child spec status row Complete.
   Affected surface hints: ["child spec frontmatter", "secondary continuity consumers", "status audit tooling"]

## Traceability Checks

- `spec_code`: fail for correctness. Phase 011 acceptance requires generated live command bridge blocks, while source still exposes live hand-authored bridge definitions.
- `checklist_evidence`: partial. This iteration sampled status and implementation-summary evidence, not all checklist rows.
- `feature_catalog_code`: deferred to traceability iteration.
- `playbook_capability`: deferred to traceability iteration.

## Integration Evidence

- Reviewed `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:58` as the TypeScript live command bridge consumer.
- Reviewed `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2126` and `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2219` as the Python live command bridge consumer and owner normalization surface.
- No runtime daemon, CI, or external integration was invoked.

## Edge Cases

- State log contained a prior `dispatch_failure` event for iteration 1, but no prior `type:"iteration"` record; JSONL-derived iteration number is therefore 1.
- An initial broad text scan accidentally included other review lineage artifacts under the target tree. Those hits were treated as noisy context only and were not used as evidence.
- The command-metadata phase has an implementation amendment acknowledging a reverted live cutover. That amendment explains why the source remains hand-authored, but it does not reconcile the unchanged success criteria or `Status | Complete` claim.

## Confirmed-Clean Surfaces

- No P0 correctness issue was found in the reviewed surfaces.
- Review target files were read-only throughout this iteration.
- The scope boundary stayed on the bound spec folder and explicitly listed implementation anchors.

## Ruled Out

- No nested Task/sub-agent dispatch was requested or performed.
- No source modification or remediation attempt was made.
- Did not classify the stale child `spec.md` continuity as P1 because implementation-summary continuity appears current enough to keep the primary resume path intact.

## Next Focus

- dimension: security
- focus area: trust boundaries and unsafe side effects in scripts, generated artifacts, and CI/workflow hooks named by the packet
- reason: correctness now has two active P1s and one P2; the next configured dimension is security
- rotation status: advance to next dimension
- blocked/productive carry-forward: parent/child status matrix was productive; do not repeat except for fix verification
- required evidence: direct file:line reads of script inputs, path handling, shell/workflow invocation, and generated JSON validation

## Next Dimension

security

## Verdict

Review verdict: CONDITIONAL
