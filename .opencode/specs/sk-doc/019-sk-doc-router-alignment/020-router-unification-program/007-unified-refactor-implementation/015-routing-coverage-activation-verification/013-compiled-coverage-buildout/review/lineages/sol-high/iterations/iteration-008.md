# Iteration 8: Authored And Promoted Closure Root Cause

## Dispatcher
- Focus dimension: correctness
- Budget profile: adjudicate
- Scope: sync source-of-truth, traceClosure, authored/promoted engines, manifests, and changed per-hub routers

## Files Reviewed
- `.opencode/bin/compiled-route-sync.cjs`
- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/011-runtime-engine/lib/compiled-route.cjs`
- `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/compiled-route.cjs`
- Authored and promoted router pairs for sk-code, system-deep-loop, mcp-tooling, cli-external-orchestration, sk-design, and sk-doc
- Authored and promoted activation manifests for sk-code, sk-design, and sk-doc

## Findings - New

### P0 Findings
None.

### P1 Findings
- **F007 (refined)**: Current manifest suite fails because source and promoted hub closures diverge — `.opencode/bin/compiled-route-sync.cjs:276-296` — The sync contract says the spec-tree closure is authored source and the runtime closure is generated from it. However, hash comparison shows different authored/promoted router bytes for sk-code, system-deep-loop, mcp-tooling, sk-design, and sk-doc; cli-external-orchestration remains identical. The `--check` trace cannot resolve sk-code, system-deep-loop, mcp-tooling, and sk-doc, while `--verify` on the promoted tree succeeds. Activation manifests checked in both trees are byte-identical, isolating the drift to implementation closure rather than activation metadata. The build path fails before copying when authored hubs are unresolved, so the promoted fixes cannot currently be regenerated from the declared source. [SOURCE: .opencode/bin/compiled-route-sync.cjs:4-17] [SOURCE: .opencode/bin/compiled-route-sync.cjs:276-296] [SOURCE: .opencode/bin/compiled-route-sync.cjs:330-357]
  - Finding class: cross-consumer
  - Scope proof: Resolver and manifest copies were checked equal; router-pair hashes and both sync modes isolate the mismatch to authored versus promoted implementation files.
  - Affected surface hints: authored spec closure, promoted runtime mirror, sync build, manifest suite, future regeneration
  - Recommendation: reconcile changed hub implementations back to the authored closure (or formally change the source-of-truth contract), then rebuild the promoted mirror and rerun `--check`, `--verify`, and the manifest suite.

### P2 Findings
None.

## Traceability Checks
- `spec_code`: fail; shipped code no longer follows the documented authored-source-to-promoted-mirror regeneration path for four hubs.
- `checklist_evidence`: fail; byte-identical resolver copies do not establish closure-wide source/mirror parity.

## Integration Evidence
- `compiled-route-sync.cjs` builds only after all authored hubs resolve; unresolved source blocks copy before runtime deletion/copy.
- Promoted `--verify` remains green because it traces the already-divergent runtime mirror.
- Authored and promoted manifests checked are identical, excluding manifest drift as the root cause.

## Edge Cases
- `sk-design` router bytes differ but its authored trace still resolves; byte difference alone is not sufficient for failure.
- Four unresolved hubs align with hubs whose effective compiled policy/engine path changed without a coherent authored closure update.

## Confirmed-Clean Surfaces
- Resolver pair is byte-identical.
- Sampled manifest pairs are byte-identical.
- Sync build fails before replacing runtime when authored resolution is incomplete.

## Ruled Out
- Resolver-copy drift as F007 root cause.
- Activation-manifest copy drift as F007 root cause.
- Promoted closure currently failing to serve.

## Next Focus
- Dimension: security
- Focus area: kill-switch and fail-safe replay under malformed or stale state
- Reason: stabilize release controls after closure-source diagnosis
- Rotation status: expansion pass 3 complete
- Blocked/productive carry-forward: F007 root cause confirmed; no separate duplicate finding
- Required evidence: flag-off matrix and stale/malformed manifest behavior

Review verdict: CONDITIONAL
