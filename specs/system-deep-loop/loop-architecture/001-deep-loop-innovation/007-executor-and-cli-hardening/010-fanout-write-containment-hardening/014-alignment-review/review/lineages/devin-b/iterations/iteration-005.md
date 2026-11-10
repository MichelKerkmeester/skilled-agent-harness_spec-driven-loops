# Iteration 5: Lane E+F - Deep-loop agent alignment and general architecture

## Dispatcher
- Lineage: devin-b (fan-out lane 2 of 3), executor cli-devin model=deepseek-v4-flash-max
- Session: fanout-devin-b-1789432854146-6hhsgk, generation 1, lineageMode new
- BINDING: target=specs/system-deep-loop/045-fanout-write-containment-hardening/014-alignment-review
- BINDING: maxIterations=5
- BINDING: convergence=0.1 (mode off, telemetry only)
- BINDING: mode=review
- BINDING: dimensions=correctness,security,traceability,maintainability
- BINDING: specFolder=specs/system-deep-loop/045-fanout-write-containment-hardening/014-alignment-review

## Focus
Lane E: agent definitions under `.opencode/agents/` and mirrors (`.claude/agents/`, `.codex/agents/`, `.pi/agents/`) for deep-research, deep-review, deep-improvement, orchestrate, against command contracts and route-proof fields (review spec REQ-001). Lane F: the shared-checkout containment model, fan-out runner, merge and reducers, dispatch adapters, read as one system (parent REQ-001..REQ-004, ADR-007). D2 security close-out (containment path handling, symlink rules).

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 12
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.07 (weighted 1/15 accumulated)

## Findings

### P0, Blocker
None.

### P1, Required
None.

### P2, Suggestion

- **F011**: deep-review loop protocol's shared fan-out adapter list omits cli-hermes. `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:281` says "`cli-codex` is also an inline branch, while `cli-cursor`, `cli-devin`, and `cli-pi` use the shared fan-out adapters", but the fan-out runner ships a cli-hermes branch (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:479` `'cli-hermes': 'SPECKIT_HERMES_STATE_DIR'`, `hermesToolsetsFor` at 2616, model allowlist at 2643) and `cli-external-orchestration/mode-registry.json` registers `cli-hermes` as a workflow mode. The "seven-kind authority" phrasing in the same sentence is defensible (seven CLI kinds plus native), but the three-name adapter list is incomplete. Finding class: stale-enum-list, scope proof: hermes branch read at fanout-run.cjs:479/2616-2643, affected surface hints: deep-review loop-protocol.md Executor Resolution, fanout-run.cjs, cli-external-orchestration mode-registry.
  - Dimension: maintainability. Evidence: `[SOURCE: .opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:281]`, `[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:479]`, `[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2616-2643]`.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| agent_cross_runtime | pass | advisory | .opencode/agents/deep-review.md vs .pi/agents/deep-review.md vs .codex/agents/deep-review.toml | LEAF wording, path convention, canonical REFUSE string, route-proof fields identical across mirrors |
| spec_code | partial | hard | parent REQ-001..REQ-004 vs shipped runner | Containment outcome separation, churn sampler, quarantine layout, preserve default all shipped; loop-protocol adapter list incomplete (F011) |
| checklist_evidence | notApplicable | hard | acceptance-criteria.md | Scaffolded Unmet; no checked claims to verify |

## Integration Evidence
- Route-proof fields present in both loop modes' iteration contracts: `.opencode/agents/deep-review.md:230` (`target_agent`, `agent_definition_loaded`, `resolved_route`) and `.opencode/agents/deep-research.md:255` — review spec REQ-001 satisfied for the review lanes this lineage participates in.
- orchestrate agent resolves `Deep Route:` from mode-registry.json (orchestrate.md:207) — matches the hub's registry-driven routing claims.
- All four agents exist in all four runtimes (opencode/claude/codex/pi), including orchestrate.
- REQ-003 outcome separation shipped: `CONTAINMENT_ADVISORY_STATUS = 'completed_with_containment_advisory'` (fanout-pool.cjs:36, wired at 904).
- REQ-004 churn sampler shipped: `containment.churnThreshold` config read (fanout-run.cjs:2968) and `shared_checkout_detected` event emitted (fanout-run.cjs:3409).
- REQ-001 quarantine layout shipped: `PASS_QUARANTINE_DIR = containment/quarantine` (write-containment.ts:318), per-pass dirs with `containment-out-of-scope` vs `containment-reverted` naming (write-containment.ts:1236).
- REQ-002 baseline content shipped: `baselineContentRoot` opt-in restore target (write-containment.ts:241).
- ADR-007 worktree removal reflected: no worktree creation anywhere in fanout-run.cjs (only a hermetic-test comment at 3489); catalogs carry no worktree claims (iteration 2).
- Security close-out: containment writes open with `O_NOFOLLOW` and `pathRefusal` (write-containment.ts:839-843) — symlink-escape hardening consistent with phases 011/015 of the parent packet.

## Edge Cases
- The "seven-kind authority" phrase is ambiguous (8 kinds incl. native vs 7 CLI kinds); kept as clean because the sentence discusses CLI branches. F011 is scoped to the concrete three-name list omission.
- deep-improvement agent lacks route-proof fields; out of scope — review spec REQ-001 binds review/research iteration records, and improvement is host-driven (runtimeLoopType null per mode-registry).

## Confirmed-Clean Surfaces
- Agent mirrors: parity across .opencode/.claude/.codex/.pi for deep-research, deep-review, deep-improvement, orchestrate (existence + core wording).
- Containment architecture: preserve default, baseline capture, per-pass quarantine, outcome separation, churn detection, symlink hardening — all shipped and mutually consistent.
- fanout-merge strongest-restriction (fanout-merge.cjs --loop-type review) matches the YAML step and the DRV-064 contract.
- No duplicated containment rules found between write-containment.ts and fanout-run.cjs (single implementation, two call layers: runner + YAML inline).

## Ruled Out
- "Seven-kind authority" as a count error: reads naturally as seven CLI kinds + native; no finding.
- Worktree resurrection anywhere in the runner: grepped, absent.
- Agent mirror drift: wording parity confirmed by grep on the pi mirror and codex TOML conversion header.

## Dead Ends
- deep-improvement route-proof fields: checked, out of scope per REQ-001 lane scope; noted for the merged report's deferred items.

## Recommended Next Focus
- Synthesis phase: compile review-report.md (9 sections), finalize the findings registry, dashboard, and synthesis event with stopReason maxIterationsReached (5/5). F006 (P1) is the only P1 — bind to a remediation phase under the parent packet in the report's Remediation Workstreams.

Review verdict: PASS
