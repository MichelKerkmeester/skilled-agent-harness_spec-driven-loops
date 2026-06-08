# Iteration 001: Daemon Reclaim And Packet Traceability

## Focus

Single-iteration breadth review across correctness, security, traceability, and maintainability for the recent daemon re-election/reap behavior, portability hook commands, durability tests, and the fanout review packet docs.

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 17
- New findings: P0=0 P1=3 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

None.

### P1, Required

- **F001**: Stale owner-lease reclaim is not serialized by O_EXCL, `.opencode/bin/mk-spec-memory-launcher.cjs:469`. The stale-existing lease branch does not use `writeOwnerLeaseFileExclusive`; it writes the replacement owner lease with `writeOwnerLeaseFile()` and only rereads it [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:469-480]. The later stale-reclaim reap path says the owner-lease `O_EXCL` acquisition is the spawn mutex [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1487-1488], but that exclusive path only applies when no existing owner lease exists [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:455-467]. Two fresh launchers racing the same pre-existing stale owner lease can both write and reread their own owner pid before the other write lands, so both can proceed into stale reclaim, lease write, and spawn. That reopens the double-writer class the reap-before-respawn change was meant to close.

```json
{
  "findingId": "F001",
  "claim": "The stale owner-lease reclaim path is not protected by the O_EXCL mutex claimed by the stale-reclaim branch, so concurrent reclaimers can both acquire ownership.",
  "evidenceRefs": [
    ".opencode/bin/mk-spec-memory-launcher.cjs:469-480",
    ".opencode/bin/mk-spec-memory-launcher.cjs:1482-1502"
  ],
  "counterevidenceSought": "Checked the no-existing-lease path, bootstrap lock, and post-write lease reprobe. O_EXCL is used only when existing is absent; bootstrap lock gates build work, not the owner-lease reclaim itself; reprobe after write does not prevent two launchers from passing before later overwrites.",
  "alternativeExplanation": "The reread check reduces some races and a later lease reprobe can make one launcher stand down, but those are probabilistic checks rather than an exclusive claim for the stale-existing lease branch.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if a real mutation lock or exclusive rename claim around stale owner-lease replacement is shown to serialize all reclaimers before they can reach stale reclaim.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

- **F002**: Fresh stale-reclaim can reap a daemon still serving a secondary, `.opencode/bin/mk-spec-memory-launcher.cjs:1372`. Owner shutdown releases the live context-server for adoption and drops only the owner lease [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1372-1383]. A later fresh launcher that sees the stale daemon lease reaps `staleLease.childPid` before respawn with no live-socket, active-secondary, or adopt-before-reap gate [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1482-1492]. The live test proves a secondary can bridge to the released daemon after owner disposal [SOURCE: .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:183-208] and separately proves a fresh session reaps a released daemon in a no-secondary setup [SOURCE: .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:210-243]. The combined owner plus secondary plus fresh-session case is the feature promise and is not protected by code or tests in the inspected paths.

```json
{
  "findingId": "F002",
  "claim": "A fresh stale-reclaim launcher can kill the released daemon that a live secondary is still using because stale reclaim reaps childPid before attempting adoption.",
  "evidenceRefs": [
    ".opencode/bin/mk-spec-memory-launcher.cjs:1372-1383",
    ".opencode/bin/mk-spec-memory-launcher.cjs:1482-1492",
    ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:183-208",
    ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:210-243"
  ],
  "counterevidenceSought": "Checked bridge/proxy behavior and the adoption live tests. The proxy can reattach and replay safe requests, which bounds severity, but the stale-reclaim branch still kills the active backend before any adopt-or-bridge decision and the tests split the two behaviors into separate scenarios.",
  "alternativeExplanation": "The reconnecting proxy may preserve many client sessions after the backend swap. That mitigates impact but does not satisfy the stronger promise that a live secondary keeps its daemon through owner disposal and later fresh-session startup.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "Downgrade if stale reclaim first deep-probes the daemon socket and adopts a live released daemon, or if a combined live test proves secondary requests survive the fresh-session reclaim without interruption or unsafe retry loss.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

- **F003**: Fanout review packet docs remain scaffold placeholders, `.opencode/specs/skilled-agent-orchestration/139-multi-model-deep/spec.md:53`. The active review scope is concrete in `review/shared-context.md`, but the canonical packet spec still contains placeholder problem/scope/files-to-change sections [SOURCE: .opencode/specs/skilled-agent-orchestration/139-multi-model-deep/spec.md:53-78], the plan overview is still placeholder text [SOURCE: .opencode/specs/skilled-agent-orchestration/139-multi-model-deep/plan.md:48-49], tasks are generic scaffold items [SOURCE: .opencode/specs/skilled-agent-orchestration/139-multi-model-deep/tasks.md:53-67], and checklist items are generic/unverified [SOURCE: .opencode/specs/skilled-agent-orchestration/139-multi-model-deep/checklist.md:50-64]. That makes the hard `spec_code` and `checklist_evidence` protocols partial at best, so this packet cannot support a release-readiness claim without using side-channel context.

```json
{
  "findingId": "F003",
  "claim": "The fanout review packet's canonical spec, plan, tasks, and checklist are still scaffold placeholders, so hard traceability gates cannot pass from packet docs.",
  "evidenceRefs": [
    ".opencode/specs/skilled-agent-orchestration/139-multi-model-deep/spec.md:53-78",
    ".opencode/specs/skilled-agent-orchestration/139-multi-model-deep/plan.md:48-49",
    ".opencode/specs/skilled-agent-orchestration/139-multi-model-deep/tasks.md:53-67",
    ".opencode/specs/skilled-agent-orchestration/139-multi-model-deep/checklist.md:50-64"
  ],
  "counterevidenceSought": "Read description.json, graph-metadata.json, and review/shared-context.md. Shared context has the concrete target, but the hard packet docs themselves remain placeholder-based.",
  "alternativeExplanation": "This may be intentional for a transient review fanout packet. The deep-review contract still treats the spec folder as the traceability source, so the placeholder state is a gate failure for completion evidence.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade after the canonical packet docs are updated with the concrete scope, target files, acceptance criteria, and evidence-backed checklist rows.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

### P2, Suggestion

- **F004**: Live durability helpers interpolate temp paths into shell commands, `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:50`. `pgrepContains()` passes `needle` through a shell string and `sqliteOpenerPids()` interpolates `dbDir` into an `lsof | awk` shell pipeline [SOURCE: .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:50-62]. Those values are derived from temporary directories built under `tmpdir()` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:69-88]. Normal macOS temp paths are low-risk, but unusual or hostile `TMPDIR` values with quotes or shell metacharacters can break or alter the test commands. Use argument-array `spawnSync`/`execFileSync` for `pgrep` and `lsof`, or shell-escape the interpolated paths.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `review/shared-context.md:6-12`; `spec.md:53-78` | Shared context has concrete scope; canonical spec is scaffold. |
| checklist_evidence | partial | hard | `checklist.md:50-64` | Generic unchecked checklist cannot substantiate completion. |
| feature_catalog_code | partial | advisory | target reads | One iteration was not enough for catalog sweep. |
| playbook_capability | partial | advisory | target reads | One iteration was not enough for playbook sweep. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: findings span distinct root causes: stale owner-lease serialization, released-daemon continuity, packet traceability, and test shell isolation.
- Iteration verdict: CONDITIONAL because P1 findings exist and no P0 was confirmed.
- Synthesis verdict: FAIL because hard traceability protocols are partial.

## Ruled Out

- Missing `SPECKIT_DAEMON_REELECTION` in hook JSON: ruled out because runtime configs, not hook commands, own the default-on setting.
- Code-index stale-reclaim parity as the same detached-daemon bug: ruled out for this pass because inspected code-index lines do not show the spec-memory released child daemon lease behavior.

## Dead Ends

- Code graph structural analysis: not used because readiness was stale and scanning would mutate state outside the lineage artifact root.
- Memory context: the direct `memory_context` call rejected the provided or implicit session id; packet reads were used instead.

## Recommended Next Focus

Implement a real owner-lease stale-reclaim mutex or exclusive claim, add adopt-before-reap or live-socket gating for released daemon leases, add the combined owner plus secondary plus fresh-session durability row, and replace the packet placeholders before claiming release readiness.
Review verdict: CONDITIONAL
