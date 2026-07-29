# Deep Review Iteration 003

## Dispatcher
- Resolved route: mode=review target_agent=deep-review
- Session: `fanout-sol-high-1785257671132-a9gil1` (generation 1, lineage mode `new`)
- Focus: traceability
- Budget profile: `verify`
- Review target: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review`

## Files Reviewed
- `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/spec.md`
- `.opencode/skills/{cli-external-orchestration,mcp-tooling,sk-code,sk-design,sk-doc,sk-prompt,system-deep-loop}/command-metadata.json`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py`
- `.opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`
- `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-command-metadata-template.json`
- `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts`
- `.github/workflows/routing-registry-drift.yml`
- `.opencode/scripts/git-hooks/pre-push`

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **P1-002: The authoritative CI fleet gate is not triggered by command-metadata-only changes** -- `.github/workflows/routing-registry-drift.yml:15-52` -- Both `push.paths` and `pull_request.paths` enumerate registry, router, root metadata, manifests, skills, templates, and scripts, but omit `.opencode/skills/*/command-metadata.json`; the job nevertheless labels and runs the fleet root-metadata contract at lines 101-110. A commit that only changes one of the seven authored command surfaces can therefore avoid the authoritative CI validation required by the scope's trigger-coverage check [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/spec.md:55-58`; `.github/workflows/routing-registry-drift.yml:15-52,101-110`]. The local pre-push hook is counterevidence for ordinary local pushes, but it is explicitly bypassable and cannot substitute for pull-request CI [SOURCE: `.opencode/scripts/git-hooks/pre-push:165-190`].
   - Finding class: cross-consumer
   - Scope proof: Compared every workflow path filter with the root-authored command-metadata locations and the exact fleet-gate step; no listed pattern matches a command-metadata-only change, while the pre-push integration separately watches all `.opencode/skills` changes.
   - Affected surface hints: `["routing-registry-drift path filters", "seven hub command-metadata roots", "fleet metadata gate", "pre-push parity"]`
   - Recommendation: Add the seven-root wildcard for `command-metadata.json` to both workflow path filters and retain the fleet-gate step as the single CI consumer.

```json
{"type":"traceability","findingId":"P1-002","claim":"A command-metadata-only push or pull request does not trigger the workflow that declares and runs the authoritative fleet metadata gate.","evidenceRefs":[".github/workflows/routing-registry-drift.yml:15-52",".github/workflows/routing-registry-drift.yml:101-110",".opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/spec.md:55-58",".opencode/scripts/git-hooks/pre-push:165-190"],"counterevidenceSought":"Reviewed both push and pull-request path filters for broader patterns, then checked the exact local pre-push gate and its bypass semantics.","alternativeExplanation":"Another changed file can incidentally trigger this workflow, and ordinary local pushes run the pre-push gate; neither makes validation mandatory for a command-metadata-only pull request or an explicitly bypassed push.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade only if another mandatory CI workflow is proven to invoke the same fleet gate for every command-metadata-only change, or if both path filters are expanded to match those files."}
```

### P2 Findings
None.

## Traceability Checks
- `spec_code`: **fail** — the seven root files obey the documented array contract and the schema/fleet consumer match the doctrine, but CI trigger coverage does not enroll command-metadata-only changes [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs:9-35,95-180`; `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:254-303,352-357`; `.github/workflows/routing-registry-drift.yml:15-52,101-110`].
- `checklist_evidence`: **notApplicable (carried, not retried)** — the target has no `checklist.md`.
- `feature_catalog_code`: **notApplicable** — no feature-catalog implementation artifact is in the declared review scope; no coverage claim was inferred from unrelated advisor prose.
- `playbook_capability`: **partial (carried, not retried)** — the prior create-journey scaffold-to-`--fix` proof remains applicable; strategy marks repeating that approach exhausted.

## Integration Evidence
- `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:254-303,352-357` is the exact fleet consumer of root `command-metadata.json`; `.opencode/commands/doctor/scripts/parent-skill-check.cjs:1240-1277` consumes only the shared root-class presence contract.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:952-991` ingests `graph-metadata.json`, not command metadata, matching doctrine at `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md:73-81`.
- `.github/workflows/routing-registry-drift.yml:91-110` and `.opencode/scripts/git-hooks/pre-push:165-190` were reviewed as the exact CI and local-hook integrations for the fleet gate.

## Edge Cases
- Empty `command-metadata.json` arrays on `cli-external-orchestration`, `mcp-tooling`, and `sk-code` are valid declarations for hubs owning no commands, not missing data [SOURCE: `.opencode/skills/cli-external-orchestration/command-metadata.json:1`; `.opencode/skills/mcp-tooling/command-metadata.json:1`; `.opencode/skills/sk-code/command-metadata.json:1`; `.opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs:86-95`].
- P1-001 remains implementation-only rather than compounded by misleading doctrine: doctrine and template promise only that choreography resources resolve, exactly matching the current existence probe; neither claims containment [SOURCE: `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md:77-81,121-139`; `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-command-metadata-template.json:1-2`; `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:285-296`].
- Memory MCP and structural-impact tooling were not retried because strategy marks them blocked; packet and direct source evidence were sufficient.
- Resource-map coverage remains skipped because `resource-map.md` is absent.

## Confirmed-Clean Surfaces
- The template's required fields and the scaffolder's initial `[]` output agree with the core schema and authored ownership doctrine [SOURCE: `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-command-metadata-template.json:1-30`; `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py:601-604`; `.opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs:43-50,86-95`].
- Unit coverage exercises malformed entries, owner-mode binding, duplicate commands/signals, choreography ordering, and injected missing-resource/missing-command probes [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:406-452`].
- The pre-push hook enrolls all skill-tree changes, blocks on fleet-gate failure, and documents its narrow dirty-tree bypass [SOURCE: `.opencode/scripts/git-hooks/pre-push:165-190`].

## Ruled Out
- Ruled out a second doctrine finding for P1-001: documentation accurately describes resolution/existence validation and does not falsely claim containment.
- Ruled out treating advisor ingestion or the doctor as command-metadata consumers; direct source shows advisor identity ingestion and doctor class-presence checks only.
- Did not retry `feature_catalog_code`, `playbook_capability`, memory MCP, structural-impact tooling, or checklist evidence where strategy marks the direction blocked/exhausted or not applicable.

## Next Focus
- Dimension: maintainability
- Focus area: duplication, contract ownership, failure-message clarity, and safe follow-on change cost across the reviewed program
- Reason: traceability is complete with one new CI enrollment defect; remaining review coverage is D4
- Rotation status: D1 correctness, D2 security, and D3 traceability complete; rotating to D4
- Blocked/productive carry-forward: direct source matrices and exact integration reads remain productive; do not retry blocked overlays, memory MCP, structural-impact tooling, or checklist evidence
- Required evidence: duplicated contract logic, ownership boundaries, test maintainability, and actionable file:line proof

Review verdict: CONDITIONAL
