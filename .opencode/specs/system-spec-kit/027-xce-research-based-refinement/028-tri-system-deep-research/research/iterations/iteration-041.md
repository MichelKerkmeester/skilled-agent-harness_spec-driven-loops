# Iteration 041 — Angle 41

**Angle:** Lane architecture transparency: shadowOnly lanes, lane weights, projection caps — operator-facing explanation and tuning surface.

**Summary:** Warm-only advisor_status probing failed with exit 75 (daemon IPC socket absent), so this pass is source-code based. The main risk is that the lane architecture has useful primitives, but the operator-facing tuning and shadow-lane surfaces are partially inert or misleading.

**Findings kept:** 5

## [P1][BROKEN-FEATURE] Documented lane-weight env tuning is stripped by the launcher

- Evidence: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts:67-74 reads SPECKIT_ADVISOR_LANE_WEIGHTS_JSON and SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON; .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:535-536 documents both as operator overrides; .opencode/bin/mk-skill-advisor-launcher.cjs:85-122 enumerates CHILD_ENV_ALLOWLIST without either variable, and createChildEnv filters strictly through that list at .opencode/bin/mk-skill-advisor-launcher.cjs:231-234 before spawn env is used at .opencode/bin/mk-skill-advisor-launcher.cjs:1113-1117.
- Detail: The code has a lane-weight override mechanism, and docs/config tell operators to use it, but the normal launched daemon cannot receive those env vars. Direct tests that import lane-registry can pass while the actual MCP runtime silently ignores operator tuning.
- Fix sketch: Add both lane-weight env vars to the launcher allowlist and cover pass-through plus effective advisor_status output in a launcher test.

## [P1][BROKEN-FEATURE] SPECKIT_ADVISOR_SHADOW_MODE is configured and documented but has no runtime reader

- Evidence: .opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:58-60 claims SPECKIT_ADVISOR_SHADOW_MODE=1 routes scoring through shadow weights; opencode.json:59, .claude/mcp.json:49, and .codex/config.toml:118 set SPECKIT_ADVISOR_SHADOW_MODE=0; Grep for SPECKIT_ADVISOR_SHADOW_MODE under .opencode/skills/system-skill-advisor found docs/tests/plugin bridge references only, while advisor_recommend always emits _shadow at .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:367-370.
- Detail: The live implementation always computes live recommendations plus a shadow delta sidecar; there is no operator switch that makes the scorer run in a shadow-weighted mode. This makes the documented shadow-mode tuning surface materially false.
- Fix sketch: Either implement the shadow-mode branch explicitly or remove the env flag from runtime configs and rewrite docs around the always-on _shadow sidecar.

## [P1][BROKEN-FEATURE] BM25 lexical shadow lane is registered but not observable through production recommendations

- Evidence: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts:21-28 defines SHADOW_SCORER_LANE_DEFINITIONS for bm25_lexical_shadow; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts:99-107 only exposes it via scoreLexicalShadowLanes; production fusion imports/calls scoreLexicalLane at .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:17 and .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:191-195; the BM25 test asserts flag-on live scorer output is unchanged at .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/bm25-lexical-shadow.vitest.ts:49-77.
- Detail: This is more than a live-ranking safety choice: the shadow lane is not wired into advisor_recommend attribution or shadow telemetry either. Operators can enable the flag but cannot see BM25 shadow evidence in the normal recommendation surface.
- Fix sketch: Wire BM25 into a shadow-only attribution/telemetry path that never affects live weightedScore, or document it as an inert library helper until promotion.

## [P2][DOC-DRIFT] Projection-cap docs point operators at the wrong layer

- Evidence: .opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/projection.md:57 says to inspect projection caps in projection.ts; projection.ts only clamps edge weight at .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:302-307, while actual graph traversal caps live in .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts:27-28 and .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts:62-64, and doc-trigger caps live in .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts:21-28 and .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts:68-70.
- Detail: The docs use the phrase projection caps, but the code distributes cap behavior across projection, graph-causal traversal, and derived doc scoring. That makes operator debugging harder when attribution is bounded but the cap is not in the referenced file.
- Fix sketch: Rename the playbook section to scoring caps and cite projection edge-weight clamp, graph depth/breadth/evidence caps, and derived doc top-N/contribution caps separately.

## [P2][README-MISALIGNMENT] Weight tuning docs conflict between env override and source edit workflow

- Evidence: .opencode/skills/system-skill-advisor/README.md:98 says weights can be overridden with SPECKIT_ADVISOR_LANE_WEIGHTS_JSON; .opencode/skills/system-skill-advisor/README.md:188-190 says to change lane-registry.ts; .opencode/skills/system-skill-advisor/references/scoring/lane_weight_tuning.md:84-90 instructs editing lane-registry.ts live/shadow weights as Step 3; .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:535-536 documents env overrides.
- Detail: The operator-facing tuning story has two incompatible paths: runtime env override versus changing source defaults. Because the launcher currently strips the env vars, the docs also lead operators toward a path that does not work in normal daemon use.
- Fix sketch: Collapse the README and tuning guide into one workflow that separates temporary env experiments from source-default promotion and names the restart/pass-through requirements.
