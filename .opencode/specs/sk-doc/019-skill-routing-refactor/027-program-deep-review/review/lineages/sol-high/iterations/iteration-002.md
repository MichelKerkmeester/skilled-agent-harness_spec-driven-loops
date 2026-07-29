# Deep Review Iteration 002

## Dispatcher
- Resolved route: mode=review target_agent=deep-review
- Session: `fanout-sol-high-1785257671132-a9gil1` (generation 1, lineage mode `new`)
- Focus: security
- Budget profile: `verify`
- Review target: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review`

## Files Reviewed
- `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/spec.md`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/tests/create-journey-proof.test.cjs`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher-orchestrator.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/provenance.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/daemon-watcher-new-root-ingestion.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/daemon-watcher-resource-leaks-049-005.vitest.ts`

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **P1-001 remains P1 after security adjudication: authored paths can escape validator containment, but no privilege-crossing write was confirmed** -- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:103-147` -- The standalone `packet` value is still joined and recursively walked without validating the normalized target against `skillDir`; the command-resource probe likewise joins authored values to repository/hub roots and accepts either existence result [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:260-296`; `.opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs:155-180`]. Counterevidence limits the security impact: leaf IDs are contained before manifest emission [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:104-123,355-363`], `--fix` writes only generated manifest/standalone-alias files under the already selected direct skill root [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:79-86,152-186,226-242`], and the resource probe performs only `existsSync`. The defect therefore remains a real validator-integrity and routing defect explicitly covered by the review scope, but it does not escalate to a P0 security vulnerability on the verified threat model.
   - Finding class: cross-consumer
   - Scope proof: Re-adjudication directly traced the two escaping path consumers through manifest normalization, fleet `--fix` targets, direct-root discovery, and the scoped negative tests. Traversal tests cover emitted leaf IDs but not standalone `packet` or choreography-resource roots [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs:106-115`; `.opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:442-450`].
   - Affected surface hints: `["standalone manifest generator", "fleet metadata gate", "command-metadata existence probe", "containment negative tests"]`
   - Recommendation: Validate normalized and real paths for standalone packet roots and choreography probes before filesystem access; keep `--fix` limited to generated files and add outside-root tests.

```json
{"type":"security","findingId":"P1-001","claim":"Authored standalone packet and choreography resource paths can resolve outside their documented roots, causing the validator to accept out-of-bound filesystem evidence, while verified write paths remain confined to generated files under a selected direct skill root.","evidenceRefs":[".opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:103-147",".opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:79-86",".opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:152-186",".opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:226-242",".opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:260-296",".opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs:155-180",".opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:104-123"],"counterevidenceSought":"Traced every --fix write, direct-root discovery, manifest leaf normalization, command resource probing, and scoped traversal test; inspected watcher boundaries separately for an adjacent path from authored metadata to daemon writes.","alternativeExplanation":"Repository-authored metadata is trusted and current entries may all be contained. That limits exploitability, but does not make a fleet validator's explicit containment check optional or prevent a mistaken/malicious commit from producing internally fresh out-of-bound routing data.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade to P2 only if an always-executed upstream boundary proves normalized and real standalone packet and choreography targets remain within their documented roots; escalate to P0 only if an untrusted input path or privileged out-of-root write/read of sensitive content is demonstrated."}
```

### P2 Findings
None.

## Traceability Checks
- `spec_code`: **partial** — security claims for probe containment, `--fix` write scope, watcher target containment, quarantine ordering, and delete/recreate behavior were checked against implementation [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/spec.md:51-58`].
- `checklist_evidence`: **notApplicable (carried, not retried)** — the target packet has no `checklist.md`.
- `feature_catalog_code`: **pending** — blocked/exhausted for this iteration by strategy; not retried.
- `playbook_capability`: **partial (carried, not retried)** — prior journey evidence remains applicable; this pass only verified its `--fix` containment assertions.

## Integration Evidence
- `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:305-357` was reviewed as the exact fleet-gate integration where generated writes and command-resource probes converge.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts:390-413,451-479,496-620` and `watcher-orchestrator.ts:75-128` were reviewed as the exact watcher/orchestrator boundary for target refresh, quarantine, addDir/unlinkDir, and delete/recreate processing.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/provenance.ts:43-59` was reviewed as the exact lexical-plus-realpath containment helper used for derived key-file targets.

## Edge Cases
- A symlink escape through derived watcher key files is rejected by `workspaceRelativeFilePath` after `realpathSync`, and chokidar is configured with `followSymlinks: false` [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/provenance.ts:48-59`; `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts:404-412`].
- A missing `SKILL.md` is considered non-malformed so delete events can reindex and clear stale hashes; root deletion then refreshes and removes all targets. This is deliberate lifecycle behavior, not evidence that malformed content bypasses quarantine [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts:277-285,588-620`; `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher-orchestrator.ts:75-113`].
- The memory preflight timed out and was not retried, as required by the exhausted/carry-forward strategy. Direct packet and source evidence was sufficient.
- Resource-map coverage remains skipped because `resource-map.md` is absent.

## Confirmed-Clean Surfaces
- `--fix` only writes `leaf-manifest.json` and generated standalone `leaf-aliases.json`; tests prove it neither invents authored config nor alters hub aliases [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:318-346`].
- Watcher `addDir`/`unlinkDir` handlers require an exact top-level child of `skillsRoot`, reject hidden additions, and the integration test proves delete/recreate recovery [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts:599-620`; `.opencode/skills/system-skill-advisor/mcp-server/tests/daemon-watcher-new-root-ingestion.vitest.ts:187-208,251-270`].
- Malformed existing `SKILL.md` content is quarantined before reindex; recovery occurs only after the validity check passes [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher-orchestrator.ts:75-105`].

## Ruled Out
- Ruled out escalation of P1-001 to P0: the verified paths expose validator/routing integrity risk, but no untrusted ingress, sensitive-content read, or out-of-root privileged write was found.
- Ruled out a watcher path-traversal finding: exact-parent checks, lexical/realpath containment, and `followSymlinks: false` constrain the reviewed event and derived-file surfaces.
- Ruled out a broad `--fix` mutation finding: implementation and tests agree that authored files and hub aliases are not rewritten.
- Structural-impact tooling and memory MCP were not retried because strategy marks those approaches blocked for this iteration.

## Next Focus
- Dimension: traceability
- Focus area: authored metadata, doctrine, CI/hook wiring, and exact spec-to-code coverage
- Reason: security adjacency produced no new finding; the active P1 now has a complete adjudication packet and needs cross-surface traceability coverage
- Rotation status: D1 correctness and D2 security complete; rotating to D3
- Blocked/productive carry-forward: direct source/test reads and targeted tests productive; do not retry memory MCP, structural-impact tooling, or checklist evidence
- Required evidence: exact authored-data consumers, doctrine claims, workflow/hook invocation paths, and spec anchors with file:line citations

Review verdict: CONDITIONAL
