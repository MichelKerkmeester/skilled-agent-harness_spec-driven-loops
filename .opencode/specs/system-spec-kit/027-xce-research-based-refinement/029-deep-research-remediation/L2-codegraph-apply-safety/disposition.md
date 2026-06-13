---
title: "L2 Code-Graph Apply Safety — Disposition"
description: "Lane state: 28/28 batch-verified STILL-REAL; doc-only drifts shipped via fenced seats + hand fixes; the interlocking apply-pipeline cluster (confirm gates, rollback target selection, snapshot retention, skip-list honesty) is sequenced as one careful packet, not piecemeal."
trigger_phrases:
  - "L2 apply safety disposition"
  - "code graph apply remediation"
  - "rollback snapshot cluster"
importance_tier: "important"
contextType: "implementation"
---
# L2 Code-Graph Apply Safety — Disposition

<!-- ANCHOR:verified -->
## Batch verification (2026-06-12)

Fresh Fable pass: **28/28 STILL-REAL** — none overtaken by the L1 lanes, none refuted. Full evidence: `../verify/l2-still-real-batch.md`. Triage: 12 doc-only, 11 code-small, 5 code-careful.
<!-- /ANCHOR:verified -->

<!-- ANCHOR:shipped -->
## Shipped this pass

Doc-only contract drifts (fenced gpt-5.5-fast seats, host diff-reviewed + Fable re-verified — verdict: `../verify/l2-docs-batch-verdict.md`, 9 CLOSED outright; 3 INCOMPLETE remedied in-commit: the `.claude` review tools whitelist, the deep-review permission-key naming, and the prune-excludes Expected text that promised tier data a dry-run response cannot contain):
- tri-024 doctor YAML schema-invalid `detect_changes({})` step → status-based stale analysis.
- tri-076 prune-excludes playbook now requires `dryRun: true` in classification and names the mutation contract.
- tri-146 apply wall-clock guidance (30s CLI default vs pre+post battery cost; dry-run runs both).
- tri-154 first step: documented the absence of any VACUUM/compaction policy and the manual maintenance path.
- tri-147 `rollback-bad-run` → `rollback-bad-apply` route-token fix.
- tri-157 spec-kit SKILL.md code-graph surface corrected (8 tools, per-family contracts).
- tri-074/143/144 detect_changes adoption in review workflows (review + deep-review agents incl. runtime mirrors, sk-code-review SKILL + playbook scenario) with the degrade-gracefully rule: blocked/unavailable → caveat + continue plain diff review.
- tri-014 generate-context relabeled as metadata+index save (no canonical doc content) in `commands/memory/save.md` AND the workspace AGENTS.md (hand).
- tri-107 `repairSuccessCoverage` opt-in documented in INSTALL_GUIDE (troubleshooting row + reconcile section).
- tri-150 (hand): apply-pipeline artifacts ignored database-locally (`apply-audit/`, `quarantine-*/`, `recovery-*/`, `known-good-*/`, `bad-apply-*/`) — worktree shows 0 untracked artifacts; rules deliberately NOT `database/**` so tracked docs stay visible.
<!-- /ANCHOR:shipped -->

<!-- ANCHOR:held -->
## Apply-pipeline packet — SHIPPED + adversarially verified CLOSED 7/7

Shipped as one unit with shared rollback-target-selection (commit `1cd7d104e5`; verdict `../verify/l2-pipeline-packet-verdict.md`): unconditional confirm gates for destructive ops BEFORE the snapshot, pre-dispatch repair-nodes refusal with requiredAction, run-scoped rollback target exclusion (operator rollback only — failure-path rollbacks deliberately restore the just-taken pre-dispatch snapshot), dry-run target preview via the same selection function, post-commit-only retention with protected dirs. The verifier enumerated every branch: no bypass path; 30/30 tests; tsc clean. The confirm-scope descriptions in tool-schemas.ts and tool_surface.md were updated to match (the verifier caught the understatement). Dist rebuilt 2026-06-12 so the fix is in the built artifact; the live daemon adopts it at its next respawn (the code-index launcher has no transparent recycle).

Verifier follow-ons (recorded, not reopeners):
- F2 (P2): the orchestrator never inspects `recovery.status` — a midway-failed operator rollback can surface as `committed` or trigger an unexcluded second rollback restoring run-start state; no data loss in any branch (quarantine + baseline survive as copies), strictly better than pre-fix.
- F3 (P3): refusal-by-throw remnants (repair-nodes confirm-with-eligible-rows, prune-excludes tier gates) still produce snapshot/rollback churn + a misleading `rolled-back` status for semantic refusals — candidates for the pre-snapshot gate pattern.
- P3s: cross-root known-good lexicographic sort quirk exploitable by legacy snapshot names; remaining doc nits listed in the verdict file.

## Held — independent code items

tri-013 CLOSED (verdict `../verify/code-wave2-verdict.md`): dry-run now aggregates the same real signal window as apply (pure read; the preview records no audits — early return traced). tri-078 and tri-091 CLOSED earlier with the advisor batch (verdict `../verify/l5-batch-verdict.md`). tri-145 and tri-186 CLOSED (verdict `../verify/code-wave3-verdict.md`): bare CLI apply now refuses without explicit mutation intent (operation / dry-run / env opt-in, all three escape hatches proven), and the new exit-taxonomy smoke pins the 75/64 failure contract daemon-free, 8/8.

tri-029 CLOSED (code wave 11, gpt-5.5 xhigh verified): the prune-excludes branch now falls back to a shipped curated default confidence artifact (`mcp_server/data/exclude-rule-confidence.json`) via `resolveExcludeRuleConfidence`, so real MCP requests are classified and gated instead of collapsing to `tier:'unknown'`. Blast radius stays conservative: only operator-passed patterns are classified, unmatched patterns stay unknown (dropped), medium needs confirm and low needs lowTierOptIn; only high-tier `.git`/`node_modules` auto-apply. An explicit-but-missing path still throws (operator error); a missing default degrades to the prior unknown no-op. The default path anchors on the on-path `.opencode` segment (config.ts pattern) so it resolves from dist or source with no build copy.

| Finding | One-line | Class |
|---|---|---|
| tri-022 | semantic-trigger shadow telemetry not durable — promotion criteria uncomputable; hot-path, fail-safe, env-gated | code-careful |
| tri-031 | **LOGIC-SYNC** — the tool schema (`crashRootCauseAddressed` gates repair-nodes re-parsing skip-list candidates) contradicts a deliberate code invariant: the parser early-sentinels skip-listed files and `recordSuccess` is an intentional no-op ("manual-review-only; must not imply self-heal"). Retry-vs-honest-doc is a design decision; routed to the multi-model deep review to adjudicate rather than picked unilaterally. | code-careful |
| tri-131 | no semantic-trigger stress suite; depends on tri-022 telemetry — sequence after it | code-careful |

Seat-quality notes for the record: one seat over-synced two runtime-adapted lines into the codex tomls (path convention; host-reverted) and fixed a pre-existing duplicated mirror-table row while doing so; the doc-batch verifier caught the `.claude` tools-whitelist gap and the lone `mcp__`-prefixed permission key that would have silently denied the documented preflight.
<!-- /ANCHOR:held -->
