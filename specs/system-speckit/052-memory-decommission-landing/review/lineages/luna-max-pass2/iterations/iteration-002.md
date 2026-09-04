---
title: "Iteration 2: D2 Security — embedding authorization, model identity, IPC and process boundaries"
trigger_phrases: []
---

# Iteration 2: D2 Security — embedding authorization, model identity, IPC and process boundaries

## Setup and route

- review_target: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- review_target_type: `spec-folder`
- review_dimensions: `all`
- spec_folder: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- execution_mode: `AUTONOMOUS`
- lineage_mode: `auto`
- target_agent: `deep-review`
- agent_definition_loaded: `true`
- resolved_route: `Resolved route: mode=review target_agent=deep-review`
- executor: `cli-codex model=gpt-5.6-luna`
- nested_dispatch: `false`

## Focus and method

Security review of the HF HTTP server/client perimeter, auto-selection model identity, Unix-domain socket hardening and related tests. Eight bounded source/test paths were directly re-read. The current request-boundary bearer check and loopback guard were verified before opening the remaining findings. No live server or test command was run because its side effects are outside the user-authorized lineage surface.

## Scorecard

- Dimensions covered: security
- Files reviewed: 8
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- Carried active findings: F001, F002, F003
- New findings ratio: 1.0 for this pass
- Convergence: score 0, threshold 3; telemetry only under `max-iterations`

## Findings

### P0, Blocker

- None.

### P1, Required

- **F004 — HF-local availability accepts a ready server without proving it serves the requested model.** `HfLocalProvider.canLoad` accepts a `model` option in its public type but never reads it; it returns `{available:true}` whenever the response body says `ready` or `loading`, before checking the HTTP status or health model at `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:679-705]`. The default auto-select probe calls that method with only a timeout at `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:246-250]`; its later `probeHfLocal` selects the configured model without adding a model-identity check at `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:437-458]`. The eventual readiness path notices a mismatch only by setting `isHealthy=false` while still returning from `waitForReady` at `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:824-832]`. The subsequent embed sends the requested model and the server returns 404 when its loaded model differs at `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:940-988]` and `[SOURCE: .opencode/bin/hf-model-server.cjs:855-871]`. Thus a resident server for model A can make the auto-selection path persist/select HF for model B, with failure deferred to the first embedding request rather than rejected at availability.
  - Recommendation: pass the resolved model into the availability probe and require a successful health response whose reported model is absent only under an explicit compatibility policy, or equals the requested model. Make `waitForReady` throw on a non-null mismatch before latching readiness, and add a test that a mismatched resident server is unavailable and cannot be persisted as the active embedder.

### P2, Suggestions

- **F005 — The direct HF Unix-socket path does not type-check the socket before the post-bind chmod or close-time unlink.** The direct server's `listenHttpServer` performs ownership/perms checks and then calls `fsImpl.chmodSync(target, 0o600)` with no `lstat`/socket-type check at `[SOURCE: .opencode/bin/hf-model-server.cjs:338-383]`. Its `close` path later unlinks `state.listenTarget` directly at `[SOURCE: .opencode/bin/hf-model-server.cjs:1022-1051]`. The shared IPC implementation has the stronger type and symlink checks before chmod at `[SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:369-381,478-485]`. Directory ownership reduces the threat from other users, but the direct model-server surface has no equivalent defense against a same-user path substitution or an unexpected non-socket node; this is a perimeter inconsistency, not proof of an externally exploitable race in this read-only pass.
  - Recommendation: lstat after binding and before chmod, require a real socket, and verify the node again before close-time unlink; add hermetic injected-fs cases for a symlink and non-socket node.

- **F006 — The client truncates fractional positive dimensions instead of rejecting an invalid response.** `parseResponseDim` accepts any finite positive number and returns `Math.trunc(body.dim)` at `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:438-443]`. The value is then adopted as provider metadata in health and embedding paths at `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:748-755,892-900]`. The server's own batch slicer requires an integer dimension at `[SOURCE: .opencode/bin/hf-model-server.cjs:740-749]`, but the client boundary is also used with a transport seam and can receive malformed or intermediary responses; a `dim:3.5` payload is silently normalized to `3` rather than rejected. This weakens dimension integrity and can make a malformed response appear compatible with a three-dimensional vector.
  - Recommendation: require `Number.isSafeInteger(body.dim) && body.dim > 0` before adopting it; add health and embed response tests for fractional, zero, negative, unsafe and string dimensions.

## Claim adjudication

```json
{
  "findingId": "F004",
  "claim": "HF-local availability can select a ready resident model that does not match the requested model.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:679-705",
    ".opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:246-250,437-458",
    ".opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:824-832,940-988",
    ".opencode/bin/hf-model-server.cjs:855-871"
  ],
  "counterevidenceSought": "Traced the default probe call, the configured model selection, the readiness latch and the server's model mismatch response; the probe has no model comparison and readiness returns after setting isHealthy false.",
  "alternativeExplanation": "A resident server is always assumed to be single-model and the first embed may be the intended validation point. Rejected because the same packet persists the probe result as an active embedder and exposes model in health, while the server explicitly rejects a different requested model.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "If the active embedder contract explicitly permits deferred model validation and the persistence/fallback path demonstrably retries or rejects before accepting the selection, downgrade to P2 availability latency.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P1", "reason": "Current call graph shows model-blind availability followed by a deferred 404" }
  ]
}
```

## Search and ruled-out checks

- Request authorization is present at `[SOURCE: .opencode/bin/hf-model-server.cjs:196-221,970-988]`, and the perimeter tests cover missing, wrong, non-bearer and valid tokens at `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/embedders/hf-model-server-perimeter.vitest.ts:191-220]`; no repeat of the repaired remote-token finding was opened.
- The loopback bind guard requires explicit remote opt-in plus a non-empty token at `[SOURCE: .opencode/bin/hf-model-server.cjs:167-193]`, with focused tests at `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/embedders/hf-model-server-perimeter.vitest.ts:140-189]`; no bind-policy finding was opened.
- Supervision and socket bridge sources were checked for ownership, liveness and stale-node handling. The shared IPC server rejects symlinked/non-socket nodes before chmod at `[SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:369-381,478-485]`; F005 is limited to the separate direct HF server path.
- The client retries only transient connection errors and does not retry a 404 model mismatch at `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:966-979]`; this supports F004 rather than a separate retry-loop finding.

## Traceability checks

- `spec_code`: partial. The packet's preserved embedding and model-server requirements can be traced to current implementations, but F004 leaves model identity unproven at the selection boundary.
- `checklist_evidence`: blocked. No root `checklist.md` exists and validators/tests were intentionally not run under the lineage-only write constraint.
- `feature_catalog_code`: not applicable to this focused pass.
- `playbook_capability`: not applicable to this focused pass.

## Adversarial self-check

- Hunter: followed both sides of the HTTP boundary, the auto-select call graph, the deferred readiness path and the server's explicit 404 branch; compared direct and shared socket hardening.
- Skeptic: F004 is not based on the unused option alone—the default call omits the model, the probe returns a selection, and the next request is demonstrably rejected by the server for a mismatch. F005 is P2 because the guarded directory materially narrows the threat and the race was not reproduced. F006 is P2 because the server normally emits integers, but the client accepts malformed boundary data.
- Referee: no P0. F004 remains P1 because a selected/persisted backend is not operational for the configured model. F005 and F006 remain P2.

## Next dimension

D3 Traceability — packet requirements, acceptance rows, workflow evidence links and completion metadata.

Review verdict: CONDITIONAL

