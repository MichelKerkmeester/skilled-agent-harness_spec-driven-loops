# Review Iteration 005

## Dispatcher

- Mode: review (deep-review LEAF, inline executor for this detached lineage)
- Session: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- Iteration: 5 of 24
- Focus: **Frontier node F-1-004: security**
- Dimension: security
- Frontier node: F-1-004 (depth 1 of 3), scope `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts`, `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs`, `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts`
- Convergence before dispatch: `CONTINUE` / `noStopCandidate`, stuck 0, consecutive failures 0.
- Sources read this iteration: `steer.md` (absent), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, the three node files, `runtime/feature-catalog/script-entry-points/append-mode-event-script.md`.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:240-330,429-495,532-540` (authority admission, ledger construction, cutover binding, canonical-envelope passthrough, review meta)
- `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:540-610,640-700` (pre-append checks, authorization request, epoch source, projection refresh)
- `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:370-440` (`findIdempotentReplay`, `eventContentDigest`)
- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts:280-310` (projection row construction)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. This pass produced no new finding.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/append-mode-event-script.md:29-33` | The catalog's identity and timing description matches the CLI's behavior for both the model-row and canonical-envelope paths, including the documented caller-identity exception for a canonical envelope. |
| `checklist_evidence` | notApplicable | - | No spec checklist for a commit-range target. |
| `skill_agent` | notApplicable | - | No agent definition in the range. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror in the range. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:607` builds the authorization request with `authorityEpoch: admission.epoch`, the epoch the gateway admitted, not the caller's `identity.authorityEpoch`. A forged epoch in a canonical envelope is therefore recorded as data and never used to authorize the append.
- `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:669-672` resolves the projection contract from `options.runDirectory`, so the projection writes inside the run the caller named rather than a path derived from the event payload.
- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:270-290` constructs the ledger and authorization gateway with `rootDirectory: runDirectory`, so every ledger, audit and fence file lands under the run directory the CLI was given.

## Edge Cases

- **`--run-directory` is caller-controlled.** The gateway does not sandbox the caller; it orders and authorizes writes inside the directory the caller names. The agent invoking it already holds filesystem write authority, so the gateway is not the containment boundary — the fan-out write-containment guard is. Recorded as a boundary, not a finding.
- **Cutover binding falls back to `process.cwd()`.** When the run directory cannot resolve a binding, the CLI retries from the working directory rather than fabricating an identity. The fallback is deliberate and fails closed if both attempts fail; it does not let an append proceed unauthorized.
- **Canonical envelopes keep caller identity.** The catalog documents this, and the authorization path ignores the caller's epoch, so the exception is provenance-only.
- **`eventContentDigest` transforms both sides identically.** A caller cannot make two different payloads compare equal by injecting a head value, because the same nulling applies to the existing and incoming payloads.

## Confirmed-Clean Surfaces

- **Authorization epoch is server-side.** The admission epoch, not the envelope's, authorizes the append.
- **Projection path is run-scoped.** The contract is resolved from the run directory, and the projection writes the state log there.
- **Idempotency conflict is refused before append.** The conflict return precedes the authorize/append loop.
- **Ledger, audit and fence files share one root.** All three are constructed from `runDirectory`, so a run cannot scatter its ledger across directories.

## Ruled Out

- **A privilege escalation through a forged `identity.authorityEpoch`.** Ruled out: the authorization request uses `admission.epoch`, and the caller's value is never read for authorization.
- **A path-traversal write through the projection.** Ruled out: the projection contract and the state-log path are both resolved from the run directory, and no event field contributes a path segment.
- **A cross-run append through `--run-directory`.** Ruled out as a gateway finding: the caller already holds filesystem write authority, so naming another directory is not an escalation the gateway can prevent; containment is the fan-out guard's job.
- **A digest-collision replay bypass.** Ruled out: the digest is computed over the payload with the same head-nulling on both sides, and a different payload produces a different digest.

## Next Focus

- Dimension: security
- Frontier node: F-1-006 (active, correctness covered; the reducer's breadth-first rule selects the shallowest node with the fewest visits)
- Focus area: docs and contracts as a security surface: whether any shipped help, reference or playbook tells an operator a confinement control exists when it does not, or omits one that does, beyond the pi line already reported as R4-P2-001.
- Reason: F-1-004 security is clean; the docs node has had only a correctness pass and carries the operator-facing security claims.
- Rotation status: F-1-004 correctness and security covered; F-1-006 security next.
- Blocked/productive carry-forward: productive (the epoch-source check is the decisive evidence); no blocked approaches.
- Required evidence: the sandbox and containment paragraphs in both presentations, `loop-protocol.md` §Executor Resolution, and the manual-testing playbooks.
- Recovery note: none.

Review verdict: PASS
