# Dimension

Maintainability + traceability overlays: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability` for the gated edge-confidence and seeded-PPR revisit work.

# Files Reviewed

| File | Lines | Purpose |
| --- | --- | --- |
| `.opencode/skills/sk-code-review/references/review_core.md` | 28-49, 88-103 | Severity and evidence doctrine before final severity call. |
| `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md` | 166-176 | Iteration artifact and state-writing contract. |
| `review/deep-review-config.json` | 35-56 | Confirmed dimensions and overlay protocols. |
| `review/deep-review-strategy.md` | 42-48, 122-158, 163-184 | Confirmed pending overlay scope and file inventory. |
| `review/deep-review-findings-registry.json` | 9-157 | Confirmed prior active P1/P2 state before new severity call. |
| `.opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/spec.md` | 80-85, 112-122, 141-160 | Confirmed packet scope: default-off confidence differentiation, seeded-PPR recovery, and consumer no-change requirement. |
| `.opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit/implementation-summary.md` | 57-65, 87-90, 113-117 | Confirmed delivered capability, default-off rationale, and known limitations. |
| `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts` | 5-11 | Confirmed dedicated edge-confidence feature flag helper is small and self-explanatory. |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | 128-144, 680-810 | Confirmed seeded-PPR flag and recovered ranking logic. |
| `.opencode/skills/system-code-graph/mcp_server/lib/README.md` | 174-185 | Checked local code ownership map for confidence/PPR context. |
| `.opencode/skills/system-code-graph/SKILL.md` | 269-287, 312-334, 344-370 | Checked skill-owned dispatch and integration documentation. |
| `.opencode/skills/system-code-graph/README.md` | 119-136 | Checked operator-facing `code_graph_context` overview. |
| `.opencode/skills/system-code-graph/feature_catalog/context-retrieval/code-graph-context.md` | 17-33, 47-53 | Checked feature catalog detail page. |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | 143-169 | Checked feature catalog index. |
| `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` | 94-99 | Checked context-retrieval playbook index. |
| `.opencode/skills/system-code-graph/manual_testing_playbook/context-retrieval/code-graph-context-readiness-block.md` | 21-27, 35-49 | Checked existing `code_graph_context` manual scenario. |
| `.opencode/agents/deep-review.md` | 259-267 | Checked canonical OpenCode agent references to code-graph internals. |

# Findings By Severity

## P0

None.

## P1

None new in this iteration. Prior P1 findings remain active: P1-001, P1-002, and P1-003.

## P2

### P2-005 [P2] Catalog and playbook omit the new gated `code_graph_context` capability

- Claim: The implementation and packet docs establish two default-off flags that change or evaluate `code_graph_context` impact behavior, but the code-graph feature catalog and manual context playbook still describe only baseline context retrieval, readiness blocking, partial output, and one-hop trace breadcrumbs. They do not mention seeded-PPR impact ranking, the edge-confidence differentiation flag, or a manual scenario that exercises the gated behavior.
- Evidence: `spec.md:80-85` puts confidence differentiation and seeded-PPR recovery in scope, with zero behavior change required when flags are off. `implementation-summary.md:57-65` and `implementation-summary.md:113-117` confirm the delivered gated behavior and that both flags remain default-off. `code-graph-context.ts:138-144` defines the seeded-PPR flag and PPR constants. `edge-confidence-flags.ts:5-11` defines the edge-confidence differentiation flag. `feature_catalog/context-retrieval/code-graph-context.md:17-33` documents context retrieval and trace breadcrumbs but not either gated behavior. `manual_testing_playbook/context-retrieval/code-graph-context-readiness-block.md:21-27` only validates broad stale-state blocking, and `manual_testing_playbook/context-retrieval/code-graph-context-readiness-block.md:47-49` only adds a single-stale-file variant.
- Scope proof: Scoped grep for `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING|SEEDED_PPR|seeded PPR|seeded-PPR|edge confidence|confidence differentiation` returned no matches under `.opencode/skills/system-code-graph/feature_catalog/`, `.opencode/skills/system-code-graph/manual_testing_playbook/`, and `.opencode/agents/`. `system-code-graph/SKILL.md:278` routes `code_graph_context` readers to the feature catalog entry, so that omission is the visible operator path.
- Counterevidence sought: Checked the system-code-graph SKILL, README, feature catalog index/detail, manual playbook index/detail, and canonical OpenCode agent definitions for seeded-PPR/edge-confidence references. Also checked `mcp_server/lib/README.md:184`, which documents rank-time confidence blending but not the default-off seeded-PPR revisit behavior or a playbook scenario.
- Alternative explanation: The team may intentionally avoid promoting default-off experimental flags in user-facing docs after a CUT verdict. That would explain keeping README/SKILL high-level, but the feature catalog and manual playbook are capability/validation inventories and are the expected places for gated capability traceability.
- Final severity: P2. This is documentation/playbook currency and discoverability debt, not a runtime correctness defect. The flags are default-off and the implementation remains gated.
- Confidence: 0.86.
- Downgrade trigger: Downgrade to no finding if the project policy is that CUT/default-off experimental branches must stay out of feature catalogs and playbooks, or if a sibling manual scenario already covers `code_graph_context` with both gated flags enabled.

# Traceability Checks

| Protocol | Status | Evidence |
| --- | --- | --- |
| `spec_code` | pass for this dimension | Packet scope and delivered implementation agree that confidence differentiation is default-off and seeded-PPR is flag-gated (`spec.md:80-85`, `implementation-summary.md:57-65`, `code-graph-context.ts:138-144`, `edge-confidence-flags.ts:5-11`). Prior P1-001/P1-002 are not re-adjudicated here. |
| `checklist_evidence` | conditional inherited | Prior P1-003 remains active; this iteration did not re-open completion-state evidence. |
| `skill_agent` | partial | `system-code-graph/SKILL.md:278` routes `code_graph_context` users to the feature catalog, but the skill itself does not need low-level flag detail. Currency depends on the catalog/playbook gap in P2-005. |
| `agent_cross_runtime` | pass | `.opencode/agents/deep-review.md:259-267` and scoped `.opencode/agents/*.md` grep show generic stable tool references, not stale internal claims about PPR or edge confidence. |
| `feature_catalog_code` | conditional | P2-005 records missing default-off capability coverage in the code-graph feature catalog. |
| `playbook_capability` | conditional | P2-005 records missing manual scenario coverage for `code_graph_context` with the gated flags enabled. |

# Verdict

PASS with advisory for this iteration. No new P0/P1 was found. The overall review remains conditional because prior P1-001, P1-002, and P1-003 are still active in the registry.

# Next Dimension

Continue under `--stop-policy=max-iterations`. Iteration 5 should broaden rather than stop: review target tests and runtime-handler surfaces for trace assertions around `includeTrace`, flag-off behavior, and seeded-PPR impact ordering, while keeping prior P1 findings active until remediated or explicitly downgraded with new evidence.

Review verdict: PASS
