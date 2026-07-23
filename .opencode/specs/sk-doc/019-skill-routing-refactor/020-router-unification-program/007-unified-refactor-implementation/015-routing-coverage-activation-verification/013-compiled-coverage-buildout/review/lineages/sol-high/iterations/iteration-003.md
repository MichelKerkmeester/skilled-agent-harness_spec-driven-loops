# Iteration 3: Security And Trust Boundaries

## Dispatcher
- Focus dimension: security
- Budget profile: scan
- Scope: resolver environment gate, activation manifests, path containment, prompt handling, and representative hub routers

## Files Reviewed
- `.opencode/bin/lib/compiled-route-manifest.cjs`
- `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs`
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs`
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs`
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/002-system-deep-loop/lib/canary-router.cjs`
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/003-mcp-tooling/lib/router.cjs`

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- `spec_code`: pass for NFR-S01 and NFR-S02 in the reviewed runtime surfaces; no compiled-routing runtime source contains a `.opencode/specs` reference, and route targets remain typed decisions checked against the selected policy identity.
- `checklist_evidence`: partial; the static security claims are supported, while live command evidence is reserved for verification iterations.

## Integration Evidence
- Resolver checks flag/cohort permission, manifest authority, and exact policy hash plus generation before returning a compiled route. [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:99-122]
- Manifest source paths reject traversal, symlink roots, hub mismatches, and non-owned files. [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:216-253]
- Router prompt handling uses substring/escaped-regex matching only; no dynamic evaluation or shell execution is present in reviewed routers.

## Edge Cases
- Invalid flag values fail closed to legacy.
- Missing, malformed, or stale manifests fail closed.
- Public hub identifiers may reach a failed manifest read before the compiled engine rejects unknown hubs, but no manifest content is returned and route failure falls back to legacy; no actionable exposure was confirmed.

## Confirmed-Clean Surfaces
- No runtime compiled-routing code references `.opencode/specs`.
- Environment flag handling is explicit for unset, force-on, force-legacy, and invalid values.
- Manifest refresh validates the canonical output path and source ownership before write.

## Ruled Out
- Prompt-driven code execution: no `eval`, dynamic `Function`, or prompt-derived shell command exists in reviewed live routers.
- Stale policy serving: resolver compares both hash and generation before returning a route. [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:108-118]
- Invalid routing flag enabling compiled mode: invalid values return false. [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:67-75]

## Next Focus
- Dimension: traceability
- Focus area: canonical completion metadata, checked evidence, and acceptance claims
- Reason: packet documents already show contradictory status and unchecked required work
- Rotation status: correctness and security covered; traceability next
- Blocked/productive carry-forward: security surfaces are clean; P1 correctness findings remain active
- Required evidence: cross-document status matrix and checked-item evidence

Review verdict: PASS
