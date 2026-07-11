# Focus

F3 semantic_shadow lane weight drift.

# Actions Taken

- Grepped scorer source for `semantic_shadow`, `shadowOnly`, and `laneWeights`.
- Read the canonical scorer weight registry/config, fusion contribution code, semantic-shadow lane implementation, and semantic-shadow tests.
- Compared live-code evidence against SC-004 and SC-005 manual playbook expectations.
- Checked system-skill-advisor changelog references plus a light scoped `git log --oneline -n 20` over scorer, playbook, and changelog paths.

# Findings[file:line]

- Source of truth is the scorer lane registry, exported through weights config: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts:7` starts `LANE_DEFINITIONS`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts:12` sets `semantic_shadow` to `defaultWeight: 0.05`, `defaultShadowWeight: 0.05`, `live: true`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/weights-config.ts:18` exports `SEMANTIC_SHADOW_WEIGHT` from `DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow`.
- Fused attribution does not trust the lane's own `LaneMatch.shadowOnly` value. `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:316` derives `shadowOnly` from `!isLiveScorerLane(lane)`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:320` only zeroes weighted score when that derived flag is true or the lane is disabled, and `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts:91` defines liveness from the registry.
- The semantic-shadow lane implementation still contains stale shadow-only language and match metadata: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:160` says the registry remains `0.00 and live=false`, and `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:167` returns `shadowOnly: true` on raw lane matches.
- Automated scorer coverage confirms the live behavior is intentional at the fusion layer: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts:212` expects the semantic contribution's weighted score to be greater than zero, and `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts:213` expects `shadowOnly` to be false.
- Current feature catalog docs also align with the live 0.05 lane: `.opencode/skills/system-skill-advisor/feature_catalog/scorer-fusion/01-five-lane-fusion.md:29` lists `semantic_shadow` at weight `0.05`, `.opencode/skills/system-skill-advisor/feature_catalog/scorer-fusion/01-five-lane-fusion.md:31` says weights are exposed via `advisor_status.laneWeights`, and `.opencode/skills/system-skill-advisor/feature_catalog/scorer-fusion/06-weights-config.md:21` names `lib/scorer/weights-config.ts` plus `lib/scorer/lane-registry.ts` as canonical with `semantic_shadow: 0.05`.
- SC-004 is stale: `.opencode/skills/system-skill-advisor/manual_testing_playbook/scorer-fusion/004-lane-attribution.md:47` still says `semantic_shadow` always reports `shadowOnly: true`, and `.opencode/skills/system-skill-advisor/manual_testing_playbook/scorer-fusion/004-lane-attribution.md:57` treats a missing semantic shadow flag as an attribution tagging failure.
- SC-005 is stale: `.opencode/skills/system-skill-advisor/manual_testing_playbook/scorer-fusion/005-ablation.md:49` says disabling `semantic_shadow` has no effect because it is already weight 0, but the registry and feature catalog now make it a non-zero live lane.
- Changelog coverage is incomplete. The scoped changelog grep found no semantic-shadow promotion note; the light scoped `git log --oneline -n 20` did show broad scorer/default remediation history, especially `dbac78cbe7 feat(022): hardcoded-default remediation arc COMPLETE + 3 same-day follow-ons (011, 012, 013)`, but not a dedicated semantic-shadow promotion entry.

# Questions Answered

- (a) Source of truth: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts`, exported by `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/weights-config.ts`. `semantic_shadow` is configured as weight `0.05`, shadowWeight `0.05`, and `live: true`; fused attribution therefore reports `shadowOnly: false`.
- (b) This is more consistent with intentional promotion than accidental live drift: registry, weights docs, feature catalog, and vitest all agree on a live 0.05 semantic lane. The gap is documentation/changelog hygiene: the promotion is not explicitly explained in the checked changelog path, and stale comments/raw lane metadata still say shadow-only.
- (c) The bug is in SC-004/SC-005 scenario docs, plus adjacent stale semantic-shadow implementation commentary/raw `LaneMatch.shadowOnly` metadata. The live weight should not be reverted based on this finding.
- (d) Concrete remediation: update `.opencode/skills/system-skill-advisor/manual_testing_playbook/scorer-fusion/004-lane-attribution.md` to expect `semantic_shadow` fused contribution `shadowOnly: false` when the lane is live; update `.opencode/skills/system-skill-advisor/manual_testing_playbook/scorer-fusion/005-ablation.md` to treat `semantic_shadow` as a non-zero ablation lane; update `.opencode/skills/system-skill-advisor/feature_catalog/scorer-fusion/04-attribution.md` because it also says the semantic lane always reports `shadowOnly: true`; and update `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` comment/`LaneMatch.shadowOnly` semantics or remove that raw flag from any scenario expectation that concerns fused attribution.

# Questions Remaining

- Which commit first changed `semantic_shadow` from shadow-only to live 0.05 was not established without patch-level history. The light log is enough to show broad scorer/default remediation history, not exact authorship.
- Whether to add a changelog entry now belongs to the remediation pass. My read: yes, because current changelog coverage does not explain the promotion even though live docs/tests rely on it.

# Next Focus

F4 OpenCode plugin bridge native route
