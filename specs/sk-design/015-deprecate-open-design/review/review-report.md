# Deep Review Report: Deprecate sk-design-mcp-open-design

**Session**: rvw-2026-08-10-deprecate-open-design · **Generation**: 1 · **Mode**: review (files)
**Target**: `.opencode/skills/sk-design/sk-design-mcp-open-design/**` + every live referencing surface + removal plan (specs/sk-design/015-deprecate-open-design)
**Executor**: native pi subagents — LEAF `deep-review` agent, model `openai-codex/gpt-5.6-luna`, thinking max, service tier fast
**Iterations**: 9 completed of 10 planned (operator-directed early convergence; iteration 10 dispatch aborted at launch)
**Verdict**: **CONDITIONAL**

---

## 1. EXECUTIVE SUMMARY

The review confirms the deprecation plan's core design and found the inventory incomplete in five material ways. **0 P0, 19 P1, 0 P2** findings. The plan (spec.md REQ-001..009, ADR-001..003) is sound — full removal with a zero-residue gate and preserved historical records — but the live surface list was missing: (a) mirror MCP registration in `.claude/.utcp_config.json`, (b) `.cursor/` and `.devin/` runtime agents/commands, (c) root `CLAUDE.md` (AGENTS.md mirror), (d) advisor manual-testing playbooks, (e) live benchmark fixture gold (42 transport-bearing rows loaded by the skill-benchmark harness). Verdict: **CONDITIONAL** — implementable after folding the 19 P1 findings into the plan/tasks. `hasAdvisories: false`.

## 2. PLANNING TRIGGER

CONDITIONAL routes to `/speckit:plan`: the implementation phases (T020-T032) must absorb the 19 P1 remediation workstreams below, then run the residue gate and `validate.sh --strict`. No P0 blocks promotion; no security vulnerability found (no live credentials, no exploitable path residue in the retired env block).

## 3. ACTIVE FINDING REGISTRY

| ID | Severity | Title | Primary evidence | Workstream |
|----|----------|-------|------------------|------------|
| P1-001 | P1 | Residue gate misses camelCase/uppercase transport identifiers | `.opencode/skills/sk-design/shared/design-proof-token.md:40` | WS-1 gate |
| P1-002 | P1 | Inventory omits live mcp-tooling discovery fixtures | `.opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json:6` | WS-2 inventory |
| P1-003 | P1 | NFR-S01 lacks explicit env/path/token residue assertions | `spec.md:196` | WS-1 spec |
| P1-004 | P1 | Claimed checklist items lack pinned evidence | `checklist.md:22-24` | WS-6 evidence |
| P1-005 | P1 | T032 lacks executable derived-manifest regeneration contract | `tasks.md:58` | WS-3 derived |
| P1-006 | P1 | Deprecation changelog entry not task-mapped | `spec.md:88` | WS-3 changelog |
| P1-007 | P1 | Live-surface exclusion allowlist prose-only, not reproducible | `plan.md:57` | WS-1 gate |
| P1-008 | P1 | Playbook/catalog token mismatch vs executable adapter (`design-mcp-open-design` rejected by code) | `deep-alignment/scripts/adapters/sk-design-live-render.cjs` (executed) | WS-2 inventory |
| P1-009 | P1 | `design-generation-patterns.md` unclassified (delete vs rewrite) | `.opencode/skills/sk-prompt/sk-prompt-improve/references/design-generation-patterns.md` | WS-4 sibling |
| P1-010 | P1 | Advisor retains transport-specific intent boosters; T029 lacks exact cleanup/probe | `skill_advisor.py:2122-2135` | WS-5 advisor |
| P1-011 | P1 | sk-doc frozen README + durable-directory fixtures encode the deleted tree; consumed by live tests | `sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`, `durable-directory-manifest.json` | WS-2 fixtures |
| P1-012 | P1 | sk-doc validator/agent-template/parent-skill reference hardcode the retired packet | `sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py`, `sk-create-agent/assets/agent-template.md`, `sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | WS-4 sibling |
| P1-013 | P1 | system-spec-kit workflow contract + link-integrity guard retain transport claims | `system-spec-kit/references/workflows/agent-io-contract.md`, `manual-testing-playbook/tooling-and-scripts/markdown-link-integrity-guard.md` | WS-4 sibling |
| P1-014 | P1 | system-spec-kit ground-truth lib+dist copies are live eval data; paired update + parity proof required | `mcp-server/lib/eval/data/ground-truth.json` + `mcp-server/dist/lib/eval/data/ground-truth.json` (byte-identical) | WS-3 derived |
| P1-015 | P1 | Live Lane-C benchmark fixture gold omitted; 42 transport-bearing rows (43 loaded) | `deep-improvement/assets/skill-benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:34` | WS-2 fixtures |
| P1-016 | P1 | Live `.claude/.utcp_config.json` MCP registration omitted | `.claude/.utcp_config.json:143-156` | WS-2 config |
| P1-017 | P1 | `.cursor/` + `.devin/` runtime agents/commands outside cross-runtime inventory | `.cursor/agents/design.md`, `.devin/agents/design/AGENT.md` | WS-2 agents |
| P1-018 | P1 | Advisor manual-testing playbooks retain transport paths beyond T029 corpus | `system-skill-advisor/manual-testing-playbook/{auto-indexing/corpus-df-idf.md,lifecycle-routing/age-haircut.md,lifecycle-routing/supersession.md}` | WS-5 advisor |
| P1-019 | P1 | Root `CLAUDE.md` omitted from root-document cleanup | `CLAUDE.md:526` | WS-4 root docs |

Adjudication notes: P1-001, P1-010, P1-015 re-verified in iteration 9 (Skeptic pass) — all confirmed, no downgrades. P1-008 confirmed by executing the adapter against the documented payload (dispatch-boundary violation reproduced). No finding relies on inference alone; every finding cites file:line.

## 4. REMEDIATION WORKSTREAMS

- **WS-1 Gate hardening** (P1-001, P1-003, P1-007): full-variant residue regex (`mcp[-_]open[-_]design|design-mcp-open-design|sk-design-mcp-open-design|open_design|openDesign|OpenDesign|OPEN_DESIGN|Open Design|OD_[A-Z0-9_]+`); reproducible allowlist file (machine-readable, checked in under the packet or a lint script); NFR-S01 rewritten with explicit env/path/token assertions.
- **WS-2 Inventory completion** (P1-002, P1-008, P1-011, P1-015, P1-016, P1-017): add mcp-tooling discovery fixtures, both token spellings, sk-doc fixtures, Lane-C fixture gold (update or regenerate 42 gold rows), `.claude/.utcp_config.json`, `.cursor/`, `.devin/` to the Files-to-Change table and tasks.
- **WS-3 Derived-artifact regeneration** (P1-005, P1-006, P1-014): T032 becomes an executable contract (regenerate leaf-manifest, advisor graph, ground-truth lib+dist with parity check, changelog entry task T030 mapped to a file path).
- **WS-4 Sibling/root docs** (P1-009, P1-012, P1-013, P1-019): classify `design-generation-patterns.md` as delete (transport-specific); strip sk-doc validator/template/parent-skill refs; strip spec-kit workflow + link-guard; add CLAUDE.md to T030.
- **WS-5 Advisor corpus** (P1-010, P1-018): remove transport boosters from `skill_advisor.py`; strip advisor playbooks; regenerate `skill-graph.json` via `skill_graph_compiler.py` after sk-design metadata edits; probe advisor no longer surfaces the skill.
- **WS-6 Evidence discipline** (P1-004): checklist claims get evidence columns pinned to commands.

## 5. SPEC SEED

Spec delta: expand §3 Files-to-Change with the five missed surfaces; rewrite NFR-S01 with explicit residue assertions; add REQ-010 (mirror-config parity: `.claude/.utcp_config.json`, `.cursor/`, `.devin/`, `CLAUDE.md` covered); close open questions (benchmark fixtures = LIVE-UPDATE; dated reports = LEAVE; sqlite/advisor graph = REGENERATE-AFTER; canary fixture = must-update).

## 6. PLAN SEED

Plan delta: T020..T032 absorb WS-1..WS-6; add T033 (advisor probe after corpus regen), T034 (Lane-C fixture regen + harness dry-run), T035 (mirror-config strips), T036 (changelog deprecation entry at a named path); residue gate command frozen in plan §3.

## 7. TRACEABILITY STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | REQ targets verifiable; NFR-S01 incomplete (P1-003) |
| `checklist_evidence` | core | partial | 3 | CHK-001..003 checked without evidence (P1-004) |
| `skill_agent` | overlay | pass | 3 | Agent defs inventoried across runtimes |
| `agent_cross_runtime` | overlay | pass→partial | 3, 9 | `.cursor`/`.devin` surfaces found in replay (P1-017) |
| `feature_catalog_code` | overlay | partial | 5 | Token mismatch P1-008; catalog claims verified executable |
| `playbook_capability` | overlay | partial | 5, 9 | Advisor playbooks retain paths (P1-018) |

## 8. DEFERRED ITEMS

- Iteration 10 (stabilization pass) not dispatched: dispatch aborted at launch; operator directed early convergence. The closure work it would have done (final gate dry-run, plan-table reconciliation) is folded into implementation Phase 3 verification instead.
- Reducer CLI defect: fixed during closeout — `emitResourceMapOutput` was referenced in the CLI success-logging block before being defined (`reduce-state.cjs`). The variable is now bound from `parsedArgs.emitResourceMap` before the call; the reducer CLI verified exit 0 with clean JSON output on rerun.
- Pre-existing staged workspace files (hooks/002-injection-bloat-reduction etc., staged by other sessions) — verified untouched by this packet via `git status` review.
- sqlite indexes (context-index, skill-graph, deep-loop-graph) — REGENERATE-AFTER via canonical scan; not hand-edited.
- Dated benchmark reports (2026-07-21) — LEAVE-HISTORICAL.

## 9. AUDIT APPENDIX

- **Coverage**: 9 iterations × (state summary → LEAF dispatch → artifact verification → reducer). Dimensions: correctness (1), security (2), traceability (3, 5), maintainability (4); completeness sweeps (6, 7, 8); adversarial replay (9).
- **State machine**: `deep-review-state.jsonl` (10 records: config + 9 iterations + converged event), `deltas/iter-001..009.jsonl` (first line matches state), `deep-review-findings-registry.json` (37 entries: 19 canonical P1 + reducer summary rows; 0 P0), `deep-review-dashboard.md`, `deep-review-strategy.md` (all 4 dimensions complete).
- **Replay validation**: every iteration file ends with the exact verdict line `Review verdict: CONDITIONAL`; delta/state first-line parity verified per iteration; convergence score 0.711 at stop (composite weighted; stopReason operator-directed early convergence, not convergence threshold).
- **Model/tier proof**: `attemptedModels` = `openai-codex/gpt-5.6-luna` on all 9 runs; thinking max + service tier fast requested per run and accepted (no param rejection); costs ≈ $0.9 total across 9 iterations.
- **Budget note**: several iterations exceeded the 12-call LEAF guidance (17-89 calls; harness SIGKILL'd runs after completion with exit 0 and full artifacts). Recorded; no artifact loss.
