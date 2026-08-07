# Iteration 3: Review Lineage Reconciliation Drift

## Focus

Audit review lineages and stale findings registries after 007 fan-out hardening.

## Findings

1. `008-loop-systems-remediation/007-fan-out-hardening` claims it shipped fixes for prompt bindings, salvage/retry classification, opt-in sandbox, leaf-only merge, lag-ceiling statuses, and playbook regression repointing [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/007-fan-out-hardening/implementation-summary.md:51`-`.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/007-fan-out-hardening/implementation-summary.md:67`]. Its tasks are fully checked through verification, including 549 tests and strict spec validation [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/007-fan-out-hardening/tasks.md:78`-`.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/007-fan-out-hardening/tasks.md:95`].

2. The codex review report and registry were not reconciled after that claimed fix: the report still says `CONDITIONAL`, `0 P0, 5 P1`, and release readiness in-progress [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/codex/review-report.md:3`-`.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/codex/review-report.md:8`]. The registry still lists all five findings active with zero resolved findings [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/codex/deep-review-findings-registry.json:5`-`.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/codex/deep-review-findings-registry.json:11`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/codex/deep-review-findings-registry.json:162`-`.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/codex/deep-review-findings-registry.json:187`]. Recommendation: add a post-remediation adjudication step that marks each fixed finding `resolved`, `accepted`, or `still-active` with evidence instead of leaving pre-fix registries as current truth.

3. The GLM lineage has the same problem at larger scale: the report remains `CONDITIONAL` with eight active P1s and one active P2 [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/review-report.md:7`-`.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/review-report.md:16`], while its registry still lists P1-001..P1-007, P1-011-001, and P2-009-001 as active [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:10`-`.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:103`]. This conflicts directly with the 007 fan-out-hardening summary's claim that the corresponding fixes shipped.

4. GLM P1-007 is still explicitly unresolved in the registry: discovery metadata omits fan-out/remediation surfaces and recommends backfilling key files/resource maps [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:73`-`.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:80`]. This remains a high-value fix because it affects resume and detached reviewer discovery, not just docs aesthetics.

5. The native review lineage is abandoned/expired by lock contract: `.deep-review.lock` has `started_at_iso`, `last_heartbeat_iso`, and `last_activity_iso` all at `2026-06-30T08:01:03.899Z`, with `ttl_ms: 300000` and phase `running` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/.deep-review.lock:1`-`.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/.deep-review.lock:11`]. Its `packet_id` still points at old `skilled-agent-orchestration/156-agent-loops-improved` while the config target is the new deep-loops packet [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/.deep-review.lock:6`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/deep-review-config.json:1`-`.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/deep-review-config.json:10`]. Recommendation: stale-lock cleanup must verify PID liveness and packet id before allowing resume/merge, then archive or mark the lineage abandoned.

6. A pre-migration GLM report still exists under the old `skilled-agent-orchestration/123-agent-loops-improved` path and reports a different historical finding set (`5 P1, 2 P2`) [SOURCE: `.opencode/specs/skilled-agent-orchestration/123-agent-loops-improved/review/lineages/glm/review-report.md:1`-`.opencode/specs/skilled-agent-orchestration/123-agent-loops-improved/review/lineages/glm/review-report.md:13`]. Recommendation: create an explicit archive pointer or tombstone so future searches do not merge old-path and new-path review reports as simultaneous current states.

## Sources Consulted

- `review/lineages/codex/review-report.md`
- `review/lineages/codex/deep-review-findings-registry.json`
- `review/lineages/glm/review-report.md`
- `review/lineages/glm/deep-review-findings-registry.json`
- `review/lineages/native/.deep-review.lock`
- `review/lineages/native/deep-review-config.json`
- `008-loop-systems-remediation/007-fan-out-hardening/implementation-summary.md`
- `008-loop-systems-remediation/007-fan-out-hardening/tasks.md`
- Old-path `skilled-agent-orchestration/123-agent-loops-improved/review/lineages/glm/review-report.md`

## Assessment

- newInfoRatio: 0.74
- Novelty justification: This connected shipped 007 evidence to unreconciled review registries and stale lineage control artifacts.
- Confidence: High for registry/report mismatch; medium for runtime process state because PID liveness was not checked.

## Reflection

- What worked: Cross-reading the remediation child and review registries exposed the exact reconciliation gap.
- What failed: The lineage artifacts do not include an adjudication ledger explaining which pre-fix findings were validated resolved.
- Ruled out: Treating the old-path GLM report as current; it is a historical pre-migration artifact but remains searchable.

## Recommended Next Focus

Audit workflow YAMLs and runtime fan-out code for live comment-hygiene and convergence/timeout threading issues.
