---
title: "Iteration 2: D2 Security — embedding and IPC perimeters"
trigger_phrases: []
---

# Iteration 2: D2 Security — embedding and IPC perimeters

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

## Focus

Dimension: security. This slice follows the local HF model server from its remote-bind guard into the HTTP request handler, then checks the preserved embedding client and IPC socket perimeter for credential, path, symlink, and stale-resource weaknesses. The review is bounded to seven listed files and treats all target files as read-only.

## Scorecard

- Dimensions covered: security
- Files reviewed: 7
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0
- Scope inventory: 438 paths in `scratch/review-scope.txt`; this iteration reviewed 7 listed paths

## Findings

### P0, Blocker

- None.

### P1, Required

- **F003 — The remote HF model-server auth token gates binding but is not enforced at the HTTP request boundary.** `[SOURCE: .opencode/bin/hf-model-server.cjs:166-193]` The perimeter accepts a non-loopback `tcp://` target when `HF_EMBED_ALLOW_REMOTE_BIND` is enabled and `HF_EMBED_AUTH_TOKEN` is non-empty. `[SOURCE: .opencode/bin/hf-model-server.cjs:295-303]` The guarded target is then passed to `server.listen`. However, `[SOURCE: .opencode/bin/hf-model-server.cjs:827-909]` routes `POST /api/embed` directly into `embedPayload` with no token check, and `[SOURCE: .opencode/bin/hf-model-server.cjs:942-955]` parses and dispatches every HTTP request without examining `Authorization` or any other credential. A focused source search found no request-side use of `HF_EMBED_AUTH_TOKEN` beyond the bind guard. The client likewise sends only JSON content headers for POST requests `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:489-500]`. The adjacent README promises that the token protects non-loopback binding `[SOURCE: .opencode/bin/README.md:18-24]`, so the documented opt-in creates an exposed, unauthenticated inference endpoint.
  - Recommendation: either implement a request authentication check with a single documented token transport and make the client send it for remote targets, or remove the token-based remote-bind opt-in and fail closed for every non-loopback target. Add a real HTTP-path test that rejects missing and wrong credentials before model inference, while deciding explicitly whether `/api/health` is public.

## Claim adjudication

```json
{
  "findingId": "F003",
  "claim": "HF_EMBED_AUTH_TOKEN is checked only while deciding whether a remote model-server bind is allowed, not while authorizing requests to /api/embed.",
  "evidenceRefs": [
    ".opencode/bin/hf-model-server.cjs:166-193",
    ".opencode/bin/hf-model-server.cjs:827-909",
    ".opencode/bin/hf-model-server.cjs:942-955",
    ".opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:489-500",
    ".opencode/bin/README.md:18-24"
  ],
  "counterevidenceSought": "Read the bind guard, listen path, route dispatcher, request handler, client transport headers and the documented perimeter claim; searched the scoped embedding and bin sources for Authorization and HF_EMBED_AUTH_TOKEN use.",
  "alternativeExplanation": "The token could be intended only as an operator acknowledgement rather than transport authentication. Rejected because the guard requires it specifically to opt into a routable interface and the error/README describe it as the protection for that exposure.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "If remote binding is removed before release, or a separate authenticated reverse proxy is made a documented and enforced prerequisite, reclassify the current server defect as stale documentation or resolved.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P1", "reason": "Source-level request-boundary absence confirmed after tracing the guarded target into the HTTP handler" }
  ]
}
```

## Search and ruled-out checks

- The direct HF Unix-socket perimeter checks the parent directory's owner and write bits, rejects symlinked socket nodes, and changes only a verified real socket to mode `0600` `[SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:340-386,369-381,474-486]`. No separate stale-UDS unlink or chmod-through-symlink finding was opened in this slice.
- The model-server supervision path rejects symlinked socket directories and socket nodes and checks ownership before its Unix-socket lifecycle operations `[SOURCE: .opencode/bin/lib/model-server-supervision.cjs:522-552]`. The remaining TCP path is covered by the F003 trust-boundary finding rather than split into a duplicate path-resolution finding.
- The client validates the TCP port before constructing a target and keeps Unix-socket and TCP transport selection explicit `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:372-407]`; no separate malformed-target finding was supported by the reviewed lines.

## Traceability checks

- `spec_code`: partial. The bin README records a remote-bind token perimeter, but the implementation only uses the token as a bind gate and does not enforce the implied request contract (F003).
- `checklist_evidence`: blocked for this iteration. No root `checklist.md` exists and the authoritative validator/checklist tooling was intentionally not invoked.

## Adversarial self-check

- Hunter: followed the token from environment read to listen call and then searched the handler and client for actual credential use; inspected both Unix-socket ownership fences and stale-node handling.
- Skeptic: F003 is not inferred from the absence of a test alone—the production request path has no auth branch, while the opt-in explicitly enables a routable bind. The default loopback bind limits exposure, so this remains P1 rather than P0.
- Referee: no P0. F003 remains P1 because an operator following the documented remote opt-in exposes model inference to unauthenticated network callers.

## Next dimension

D3 Traceability — command assets, doctor/memory/deep surfaces, decommission residue, spec/code alignment, and evidence linkage.

Review verdict: CONDITIONAL
