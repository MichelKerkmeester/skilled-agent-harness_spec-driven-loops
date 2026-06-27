# Deep-Research Synthesis: sk-design Interface Skill Improvement

> Session: `fanout-gpt55fast-1782532104406-wgsfs7`
> Artifact dir: `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/015-per-skill-improvement-research/001-interface/research/lineages/gpt55fast`
> Stop reason: converged after 6 iterations

## 1. Executive Summary

The interface skill is no longer under-supplied with references. The prior 009 expansion work largely landed: shared register, brief-to-dials intake, mechanical layout gate, content/mock-data gate, real-UI loop, Mobbin/Refero guidance, aesthetic cue guardrails, and the preflight card are all present in the current `design-interface` packet [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:73] [SOURCE: file:.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:16] [SOURCE: file:.opencode/skills/sk-design/design-interface/README.md:98].

The highest-leverage next improvements are not more design prose. They are router precision, route-away observability, narrower resource loading, redesign intake, a required design-to-build handoff manifest, and verification upgrades.

The benchmark evidence also differs from the prompt. The current report under `014-routing-benchmark/design-interface` says `CONDITIONAL` with aggregate `70/100`, not `78/100` [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:5]. The bottleneck is `routed-intra`, specifically ID-011 preflight and ID-005 pure-logic abstention [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:35] [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:50] [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:55].

## 2. Scope And Method

This lineage read the deep-research contract, the live interface packet, the sk-design hub, the prior 009 research synthesis, the current routing benchmark, the manual testing playbook, and selected external corpus files most relevant to interface behavior.

Writes were limited to this lineage artifact directory. The provided spec folder currently contains only `research/`, and no `spec.md` was seeded because the operator constrained writes to the lineage artifact directory.

## 3. Current State

The live mode key is `interface`, but the physical packet is `.opencode/skills/sk-design/design-interface/`. `mode-registry.json` maps `workflowMode: interface` to packet `design-interface` [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:16] [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:18].

Current strengths:

- Strong core design judgment: grounded subject, token system, anti-default critique, and quality floor [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:140].
- Shared register and dials are now first-class [SOURCE: file:.opencode/skills/sk-design/shared/register.md:16] [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-process/brief_to_dials.md:17].
- Mechanical and content gates are concrete and binary [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md:31] [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md:31].
- The preflight card is an executable checklist for planned or built UI [SOURCE: file:.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:16].
- The real-UI loop defines ground -> reuse -> render -> check -> revise -> hand off [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-process/real_ui_loop.md:33].

## 4. Benchmark Findings

The current benchmark says:

| Metric | Value | Evidence |
|---|---:|---|
| Aggregate | 70/100 | `skill-benchmark-report.md:5` |
| D1 intra | 54/100 | `skill-benchmark-report.md:17` |
| D2 discovery | 91/100 | `skill-benchmark-report.md:18` |
| D3 efficiency | 57/100 | `skill-benchmark-report.md:19` |
| D5 connectivity | 100/100 | `skill-benchmark-report.md:21` |
| Passed scenarios | 12/14 | `skill-benchmark-report.md:32` |
| First-fail bottleneck | routed-intra | `skill-benchmark-report.md:35` |

The current report leaves D1-inter and D4 unscored in this run [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:23]. Therefore, follow-up cannot honestly claim usefulness improvement from Mode A alone.

## 5. Prioritized Improvements

### P0 - Encode Route-Away Outcomes For Non-Design Prompts

ID-005 scores `31/100` and first-fails at `routed-intra` [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:55]. The skill already says pure logic should use `sk-code` [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:36], but the benchmark row observed empty resources and `agent: none` [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.json:647].

Recommendation: add a deterministic negative-intent branch to the parseable router or hub response contract:

```json
{"routeAway":"sk-code","reason":"pure logic or backend work with no visual surface"}
```

Also add the analogous `sk-doc` branch for pure documentation prompts, because `SKILL.md` also routes docs away [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:39].

### P1 - Split The Overloaded Grounding Branch

The `GROUNDING` resource map currently loads design-system grounding, Mobbin/Refero reference discipline, and both tool catalogs together [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:119]. Benchmark rows show grounding-heavy scenarios with high routed and wasted counts, e.g. ID-008 `routedCount: 6`, `wastedCount: 5` [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.json:421].

Recommendation:

- `REAL_SYSTEM_GROUNDING`: load `design_inventory.md` and, when building/iterating, `real_ui_loop.md`.
- `REAL_WORLD_REFERENCE`: load `design_references_mcp.md` and only one tool catalog based on surface, Mobbin for app/iOS/screens/flows and Refero for web/style direction.
- Keep paid lookup optional and non-blocking, consistent with the design reference doc [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-grounding/design_references_mcp.md:40].

### P1 - Align Preflight Routing With The Preflight Card

ID-011 first-fails at `routed-intra` and scores `59/100` [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:50]. The preflight card says it depends on mechanical defaults, content gate, and dial calibration [SOURCE: file:.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:18]. Current `MECHANICAL_PREFLIGHT` maps mechanical, copy, and asset but not `brief_to_dials.md` [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:117].

Recommendation: add `brief_to_dials.md` to `MECHANICAL_PREFLIGHT` and rerun the benchmark. If D3 worsens without fixing ID-011, adjust fixture expectations instead.

### P1 - Add Narrow Redesign Intake

Current interface handles redesign prompts, but lacks explicit preserve/overhaul intake. External corpus states redesign mode misclassification is the biggest source of bad redesign output and requires greenfield, preserve, or overhaul detection [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/taste-skill.md:783] [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/taste-skill.md:787].

Recommendation: add a small `references/design-process/redesign_intake.md` only if the router can load it narrowly for redesign terms. It should include:

- Greenfield vs preserve vs overhaul.
- Audit before touching: brand tokens, IA, content blocks, patterns to preserve/retire, SEO baseline [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/taste-skill.md:794].
- Never change silently: URL slugs, nav labels, form field names/order, logo, legal/cookie copy [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/taste-skill.md:825].

### P1 - Require A Design-To-Build Handoff Manifest

The current handoff manifest is optional [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-process/real_ui_loop.md:90]. Make it required whenever interface hands implementation to `sk-code`.

Recommended fields:

- Register posture and Design Read.
- Token system and signature move.
- Files/surfaces intended for build.
- Required components/tokens to reuse if a system exists.
- Motion budget and reduced-motion expectations.
- Quality gates run or still pending.
- Reference lookup status: skipped, asked, or pulled one; source; URL if applicable; copied: no.
- Open risks and explicit do-not constraints.

### P2 - Fold Visual Asset Strategy Into Existing Content/Real-UI Guidance

The current content gate covers fake screenshots and image seeds [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md:121]. External corpus adds a stronger priority order: image generation first, real photography second, clearly labeled placeholders last [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/taste-skill.md:266].

Recommendation: add this as a short section in `copy_and_mock_data.md` or `real_ui_loop.md`, not as a broad standalone preset asset unless benchmark routing proves it stays narrow.

### P2 - Add Verification Around Playbook Structure And Router Regressions

The manual playbook says no dedicated automated module exists and root validation does not recurse into per-feature files [SOURCE: file:.opencode/skills/sk-design/design-interface/manual_testing_playbook/manual_testing_playbook.md:501] [SOURCE: file:.opencode/skills/sk-design/design-interface/manual_testing_playbook/manual_testing_playbook.md:516].

Recommendation:

- Add a structural sweep for all 14 per-feature files.
- Add static route-replay tests for ID-005 and ID-011.
- Run the benchmark report again after router changes.
- Run live/advisor D1-inter and D4 usefulness checks before claiming completion.

## 6. Tooling Recommendations

1. Add a small route replay fixture for negative routing.
2. Add a benchmark expected-resource fixture for `MECHANICAL_PREFLIGHT` so changes to `brief_to_dials.md` are intentional.
3. Add a one-line lookup status convention for Mobbin/Refero so operators can audit paid lookup decisions without reading Code Mode docs.
4. Keep Code Mode details in `mcp-tooling/*`; do not duplicate the tool catalogs into `SKILL.md`.

## 7. UX Recommendations

1. Make the first visible design answer include a compact Design Read when visual work is in scope.
2. For redesign prompts, ask one preserve-vs-overhaul question when ambiguous.
3. For real-world references, use a single status line: `Reference lookup: skipped/asked/pulled one`.
4. At build handoff, emit the required manifest instead of relying on conversation memory.

## 8. Assets And References

Add sparingly:

- Add `redesign_intake.md` only if routed narrowly.
- Consider no new asset for preflight; the existing card is enough if routing is fixed.
- Fold visual asset priority into existing docs instead of creating a broad asset.
- Do not add more aesthetic cue files as a primary improvement.

## 9. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat `.opencode/skills/sk-design/interface` as physical packet path | Registry maps interface mode to `design-interface`; no `interface/` directory was found | `mode-registry.json:16-18` | 1 |
| Trust prompt's 78/100 score over files | Current report artifact says aggregate 70/100 conditional | `skill-benchmark-report.md:5` | 2 |
| Optimize aggregate score without scenario diagnosis | Benchmark names routed-intra and IDs 011/005 | `skill-benchmark-report.md:35,50,55` | 2 |
| Remove references broadly to improve efficiency | D2 and D5 are strong; defect is branch precision, not missing or excessive knowledge globally | `skill-benchmark-report.md:18,21` | 3 |
| Require Mobbin/Refero for every design task | Docs make lookup optional, paid, and non-blocking | `design_references_mcp.md:40,75-84` | 4 |
| Claim improvement from docs without rerunning benchmark/playbook checks | D1-inter and D4 are unscored; playbook validation does not recurse | `skill-benchmark-report.md:23,64`; `manual_testing_playbook.md:516` | 5 |
| Add more aesthetic preset files as the main improvement | Aesthetic cues are critique-against only and must never become a chooser | `references/aesthetics/README.md:26-28` | 6 |
| Bulk-import external corpus | Prior 009 rejected bulk import; leverage is operational cards and gates | `009-reference-asset-expansion/research/research.md:17,158-175` | 6 |

## 10. Open Questions

1. Should redesign intake be standalone or folded into `real_ui_loop.md`? Recommendation: standalone only if narrow router loading is added.
2. Should benchmark fixtures expect `brief_to_dials.md` for ID-011? Recommendation: add the router mapping first and rerun.
3. Which benchmark mode produced the prompt's `78/100`? Current artifacts show 70/100; preserve artifact truth unless a newer report appears.

## 11. Recommended Implementation Sequence

1. Add route-away output for pure logic and docs prompts.
2. Split `GROUNDING` into owned-system vs real-world-reference branches.
3. Align `MECHANICAL_PREFLIGHT` with the card and benchmark.
4. Add redesign intake and required handoff manifest.
5. Fold visual asset priority into existing guidance if needed.
6. Add static route/playbook checks.
7. Rerun benchmark, including live/advisor usefulness dimensions when available.

## 12. Convergence Report

- Stop reason: converged
- Total iterations: 6
- Questions answered: 10 / 10
- Remaining blocking questions: 0
- Last 3 iteration summaries: run 4 usefulness/UX/handoff (0.34), run 5 verification (0.18), run 6 synthesis (0.04)
- Convergence threshold: 0.05
- Quality guards: passed via source diversity, focus alignment, and explicit negative knowledge

## 13. References

- `deep-research/SKILL.md` and references loaded for loop contract.
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/shared/register.md`
- `.opencode/skills/sk-design/design-interface/references/design-process/*.md`
- `.opencode/skills/sk-design/design-interface/references/design-grounding/*.md`
- `.opencode/skills/sk-design/design-interface/references/mcp-tooling/*.md`
- `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md`
- `.opencode/skills/sk-design/design-interface/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.json`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/taste-skill.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/gpt-tasteskill.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/redesign-skill.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable.md`
