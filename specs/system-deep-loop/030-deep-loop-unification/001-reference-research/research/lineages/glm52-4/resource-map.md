# Resource Map - glm52-4

> Coverage derived from convergence evidence. Detached lineage — read-only investigation of files outside this directory.

## Coverage Summary

| Category | Paths / Evidence | Status | Notes |
|---|---|---|---|
| Specs | `030-deep-loop-unification/001-reference-research/{spec.md,plan.md}` | Read | Research scope + fan-out design. |
| Specs | `030-deep-loop-unification/002-hub-rename-and-runtime-nesting/{spec.md,plan.md}` | Analyzed | Structural move + Class A/B path-repair tables + Stage 3b tooling borrow. |
| Specs | `030-deep-loop-unification/003-external-reference-migration/{spec.md,plan.md}` | Read | External migration + advisor discipline + divergence ratchet. |
| Specs | `030-deep-loop-unification/004-fallback-router-wiring/{spec.md,plan.md}` | Analyzed | Optional fallback wiring scope + registry entry + Phase 2 call site. |
| Commands | `.opencode/commands/deep/assets/deep_research_auto.yaml` | Analyzed | `step_resolve_artifact_root` fanout branch (128-137); `step_detect_spec_present` (361); `step_writeback_spec_findings` (1510) — one-sided guard. |
| Commands | `.opencode/commands/deep/{research,review,ai-council}.md` + `create/*` + `doctor/*` | Counted (33 files) | Migration surface enumeration; `/deep:*` names stay stable. |
| Skills | `deep-loop-workflows/mode-registry.json` | Analyzed | Three-tier discriminator; advisor does NOT read at runtime. |
| Skills | `deep-loop-workflows/deep-ai-council/scripts/{orchestrate-session.cjs,orchestrate-topic.cjs,replay-graph-from-artifacts.cjs}` | Analyzed | Reverse coupling; orchestrate-session omitted from 002 Class B; replay-graph absolute-path form. |
| Skills | `deep-loop-workflows/deep-{research,review}/scripts/{reduce-state.cjs,runtime-capabilities.cjs}` | Analyzed | Reverse coupling; review pair + research runtime-capabilities omitted from 002 Class B. |
| Skills | `deep-loop-runtime/scripts/{render-command-contract.cjs,fanout-run.cjs,fanout-pool.cjs}` | Analyzed | Forward coupling (render-command-contract:11); detached-lineage prompt (fanout-run:1004-1017); model-slug dispatch (1349-1350). |
| Skills | `deep-loop-runtime/scripts/lib/cli-guards.cjs` | Analyzed | `classifyLineageFailure` — only TIMEOUT/SALVAGE_MISS/ARTIFACT_MISS retryable; EXIT fatal. |
| Skills | `deep-loop-runtime/lib/deep-loop/{artifact-root.cjs,fallback-router.ts}` | Analyzed | artifact-root internal path.join (missed seam); fallback-router reusable, zero callers. |
| Skills | `deep-loop-runtime/{package.json,tsconfig.json,vitest.config.ts}` | Analyzed | Tooling borrow (tsc + @types); Stage 3b repair correct. |
| Tests | `deep-loop-runtime/tests/unit/{artifact-root.vitest.ts,dependency-seams.vitest.ts,fallback-router.vitest.ts,executor-provenance-mismatch.vitest.ts}` | Analyzed | artifact-root/dependency-seams path setup breaks on nest; fallback-router fully tested. |
| Advisor | `system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Analyzed | Hardcoded `MODE_REGISTRY_PATH` (83) + `MERGED_DEEP_SKILL_ID` (2579). |
| Advisor | `system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Analyzed | `DEEP_MODE_BY_CANONICAL` (57) + `MERGED_DEEP_SKILL_ID` (109). |
| Advisor | `system-skill-advisor/mcp_server/tests/{routing-registry-drift-guard.vitest.ts,parity/fixtures/local-native-approved-divergences.json}` | Analyzed | Drift guard; divergence-ledger field-vs-prose distinction. |
| Model Registry | `sk-prompt-models/assets/model_profiles.json` | Analyzed | glm-5.2 + mimo-v2.5-pro: separate pools, both `fallback_target: null`, id vs slug mismatch. |
| Agents | `.opencode/agents/{orchestrate,deep-research,deep-review,ai-council,deep-improvement}.md` | Counted (5) | Opencode agent mirror. |
| Agents | `.claude/agents/{orchestrate,deep-research,deep-review,ai-council,deep-improvement}.md` | Counted (5) | Claude agent mirror — sync hazard. |
| READMEs | `README.md`, `deep-loop-{workflows,runtime}/README.md`, `system-spec-kit/README.md` | Counted (4) | User-facing old-identity references. |

## Coverage Gaps

- Did not inspect every historical `.opencode/specs/**` mention — 003 marks historical specs as out of scope.
- Did not inspect `.worktrees/**` — 003/005 classify live worktrees as coordination risk, not immediate migration targets.
- Did not run the advisor accuracy suite; validated that re-running it is required (not optional).
- Did not execute the merge; this phase is strictly read-only.

## Evidence-Derived File Set For Child 002 (structural + tooling-borrow repair)

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs` (+1 hop internal path.join)
- `.opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts` (+1 hop SPEC_KIT_ORIGINAL)
- `.opencode/skills/deep-loop-runtime/tests/unit/dependency-seams.vitest.ts` (skillsRoot +1 up)
- `.opencode/skills/deep-loop-runtime/package.json` (typecheck +1 hop) — already in 002 Stage 3b
- `.opencode/skills/deep-loop-runtime/tsconfig.json` (typeRoots +1 hop) — already in 002 Stage 3b
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-session.cjs` (Class B — omitted)
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs` (Class B — listed)
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs` (absolute-path rename)
- `.opencode/skills/deep-loop-workflows/deep-research/scripts/runtime-capabilities.cjs` (Class B — omitted)
- `.opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs` (Class B — omitted)
- `.opencode/skills/deep-loop-workflows/deep-review/scripts/runtime-capabilities.cjs` (Class B — omitted)

## Evidence-Derived File Set For Child 003 (external migration + advisor)

- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` (lines 83, 2579)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` (line 109)
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json` (field-scope nativeTop/gold only)
- `.opencode/commands/deep/assets/*.yaml` + `.opencode/commands/{create,doctor}/*`
- `.opencode/agents/*.md` + `.claude/agents/*.md` (mirror sync)
- `README.md` + 3 skill READMEs

## Evidence-Derived File Set For Child 004 (fallback wiring)

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` (reuse as-is)
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` (add resolveFallback call site)
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` (slug→id normalizer)
- `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs` (widen failure classes)
- `.opencode/skills/sk-prompt-models/assets/model_profiles.json` (set glm-5.2 fallback_target)
