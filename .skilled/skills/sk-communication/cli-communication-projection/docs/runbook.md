# Rollout Runbook

## 1. OVERVIEW

Roll out projection in stages. Complete every capability and privacy
prerequisite first, then read the evaluation gate before enabling each runtime.
Keep a runtime on original-only until its gate passes. Stop the rollout and stay
on original-only when any prerequisite is missing, stale, provisional,
contradictory or failed.

Projection ships only where it reads at least as well as the original. This
runbook teaches the staged order, the capability and privacy prerequisites, and
the evaluation-gate reading rule that together decide when a runtime is safe to
enable.

---

## 2. STAGED ENABLEMENT

Enable one runtime at a time and verify it before the next stage.

| Stage | Runtime | Verify |
| --- | --- | --- |
| 1 | OpenCode plugin | Assistant text renders as the projection with the flag on and as the byte-exact original with the flag off |
| 2 | One wrapper runtime | The launcher reports the runtime plan and renders the projection or the exact original |
| 3 | Remaining wrapper runtimes | Each runtime passes the same per-runtime verification |

Move a runtime to the next stage only when the doctor is ready and the
evaluation gate approves it. Never enable a second runtime while the first stage
is still failing. At every stage, confirm the canonical transcript, events, tool
inputs and tool results stay unchanged.

---

## 3. CAPABILITY PREREQUISITES

Run the compatibility doctor before enabling any route. Save the doctor script
from [configuration.md](./configuration.md) as
`operator/run-communication-projection-doctor.mjs` and run it with Node.

Read the report decision:

- `ready` with `routeSelection: 'proposed'` is gate-green.
- `degraded` requires explicit operator review before any projection.
- `blocked` forces original-only. Do not bypass a blocked report.

The doctor checks version compatibility, capability presence, endpoint
reachability, credential references, privacy-fact freshness and the presentation
tier. Refresh dated evidence instead of bypassing a stale finding.

---

## 4. PRIVACY PREREQUISITES

Choose one privacy mode explicitly. The options are local-only, hosted and
mixed, as defined in [privacy.md](./privacy.md). Confirm the route before
enabling a runtime.

- Local-only routes allow only local records and keep egress consent off.
- Hosted routes require fresh retention and training-use facts and a credential reference.
- Mixed routes name every cross-class fallback and set the privacy class deliberately.

Run the privacy canary gate and stop if any canary appears in an export or
manifest. Pass only content-free telemetry and evidence. Never record prompts,
responses, raw transcripts or credential values.

---

## 5. EVALUATION GATE READING

Read the release gate before enabling a runtime. The gate runs
`evaluateReleaseReadiness` and returns an `overallDecision` of `release-ready`
or `blocked`, with an `aborts` list that names each failing lane. The lanes are
the doctor, the evaluation verdict, the fidelity negative controls, the privacy
canaries, the provider contracts, the runtime smokes, the strict packet
validation and the support matrix.

A runtime is rollout-ready only when every condition holds:

- The evaluation verdict is `pass` with `releaseApproved: true`.
- The evidence class is `human` and not provisional.
- All six runtime smokes pass.
- All privacy canaries pass.
- Every evidence reference is dated and unexpired.

An `llm-proxy` provisional pass never marks a runtime rollout-ready. A stale,
missing, invalid or failed lane blocks the gate. Stay on original-only when the
verdict is `fail` or `inconclusive`. Stay on original-only when a measured
regression crosses the frozen margin. Stay on original-only when any lane
aborts.

---

## 6. STOP CONDITION

Stop and select original-only mode on any missing, stale, provisional,
contradictory or failed release prerequisite. A measured regression on any
non-inferiority dimension blocks the gate and holds rollout. Re-run the doctor
and the release gate with fresh evidence before resuming.

---

## 7. RELATED RESOURCES

- [Enablement](./enablement.md)
- [Configuration](./configuration.md)
- [Privacy modes](./privacy.md)
- [Support matrix](./support-matrix.md)
- [Rollback](./rollback.md)
