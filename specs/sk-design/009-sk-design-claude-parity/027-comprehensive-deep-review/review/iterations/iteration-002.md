# Iteration 002 — Hub Tier Correctness + Traceability

## Dimension

- Focus: correctness, traceability, sk-doc structural conformance for the `sk-design` hub tier only.
- Scope discipline: reviewed only the assigned hub files plus required state/doctrine files and mechanical existence checks for the six packet directories/procedure paths referenced by assigned hub metadata.
- Prior findings considered: `P1-001` in the md-generator backend area remains outside this iteration's assignment and was not re-investigated.

## Files Reviewed

- `.opencode/skills/sk-design/SKILL.md:1`
- `.opencode/skills/sk-design/mode-registry.json:1`
- `.opencode/skills/sk-design/hub-router.json:1`
- `.opencode/skills/sk-design/description.json:1`
- `.opencode/skills/sk-design/graph-metadata.json:1`
- `.opencode/skills/sk-design/README.md:1`
- `.opencode/skills/sk-design/command-metadata.json:1`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:1`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:1`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`

## Findings by Severity

### P0

- None.

### P1

- None.

### P2

#### P2-002 [P2] README still says every multi-mode request stays at the hub for disambiguation

- File: `.opencode/skills/sk-design/README.md:58`
- Evidence: The README says, "A request that spans modes stays at the hub for disambiguation." The runtime hub contract is more specific: `SKILL.md:142` permits pairing modes when a prompt has clearly separate design axes, and `SKILL.md:166` through `SKILL.md:170` define an explicit `ui-build-bundle` ordered bundle for interface + foundations.
- Finding class: instance-only
- Scope proof: The assigned hub files otherwise describe bundling consistently: `hub-router.json:19` through `hub-router.json:25` declares `ui-build-bundle`, and `mode-registry.json:38` through `mode-registry.json:164` still declares the six expected modes.
- Recommendation: Update the README wording to distinguish ambiguous multi-mode prompts from clearly separate axes that route to an ordered bundle.

#### P2-003 [P2] Graph metadata derived retrieval facets omit the Open Design transport despite the current six-mode hub

- File: `.opencode/skills/sk-design/graph-metadata.json:142`
- Evidence: `graph-metadata.json` derived `key_topics` list the five workflow modes (`interface-mode`, `foundations-mode`, `motion-mode`, `audit-mode`, `md-generator-mode`) but omit `design-mcp-open-design` / transport terms at `graph-metadata.json:142` through `graph-metadata.json:157`. The same derived block's `trigger_phrases` omit Open Design transport phrases at `graph-metadata.json:83` through `graph-metadata.json:141`, while current hub sources declare the transport in `mode-registry.json:145` through `mode-registry.json:163`, `hub-router.json:84` through `hub-router.json:91`, and `SKILL.md:30`.
- Finding class: instance-only
- Scope proof: This is not a missing runtime route: `parent-skill-check` passed router resources and registry mode resolution, and `graph-metadata.json:176` does mention the transport in the causal summary. The stale area is limited to derived retrieval facets.
- Recommendation: Refresh `graph-metadata.json` derived `trigger_phrases` / `key_topics` so metadata search and graph summaries reflect all six registered entries, including the transport axis.

## Traceability Checks

- `parent-skill-check`: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` ended with `OK: parent-skill-check — all hard invariants passed, 0 warnings`; no checker FAIL/WARN finding was recorded.
- Registry-to-packet mapping: `mode-registry.json:38` through `mode-registry.json:164` declares six modes; `Glob` confirmed the six packet `SKILL.md` and `README.md` files exist; `Grep` confirmed each packet `SKILL.md` name matches its `packetSkillName`.
- Procedure paths: the five workflow-mode `proceduresPath` entries resolve to existing procedure files. The transport entry has no `proceduresPath`; this matches the checked registry shape and was not classified as a bug because the parent checker does not require it and the transport has no procedure-path claim to verify.
- Router table: `hub-router.json:27` through `hub-router.json:91` references all six workflow modes and resources; the checker confirmed router signal keys match the registry workflowMode set.
- Command metadata: `command-metadata.json` enumerates the five runnable `/design:*` commands (`audit`, `foundations`, `interface`, `md-generator`, `motion`) and repeatedly states `design-mcp-open-design` has no standalone command, matching `mode-registry.json:14` and `mode-registry.json:157`.
- Description metadata: `description.json:3` reflects the current five workflow modes plus one transport mode and does not look stale.

## Verdict

- PASS with advisories: no new P0/P1 findings in this assigned hub-tier pass.

## Next Dimension

- Continue Wave 1 with sibling iteration scopes; do not sync registry/strategy until the orchestrator performs the post-wave merge.

Review verdict: PASS
