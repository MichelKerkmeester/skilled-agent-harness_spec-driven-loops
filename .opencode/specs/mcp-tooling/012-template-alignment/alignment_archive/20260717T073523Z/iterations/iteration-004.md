# Alignment Iteration 004

## Dispatcher

- Mode: `alignment`
- Target agent: `deep-alignment`
- Agent definition loaded: yes
- Resolved route: `Resolved route: mode=alignment target_agent=deep-alignment`
- Budget profile: `verify`
- Session: `2026-07-17T07:05:11.246Z`, generation 1
- Canonical lineage mode: `new`

## Lane

- Lane Id: `sk-doc::docs::.opencode/skills/mcp-tooling/mcp-mobbin/assets/, .opencode/skills/mcp-tooling/mcp-mobbin/references/, .opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md`
- Authority: `sk-doc`
- Adapter: `sk-doc`
- Artifact class: `docs`
- Scope: paths under `.opencode/skills/mcp-tooling/mcp-mobbin/assets/`, `.opencode/skills/mcp-tooling/mcp-mobbin/references/`, and `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md`

## Artifacts Checked

1. `.opencode/skills/mcp-tooling/mcp-mobbin/assets/utcp-mobbin-manual.md`
2. `.opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md`
3. `.opencode/skills/mcp-tooling/mcp-mobbin/references/tool-surface.md`
4. `.opencode/skills/mcp-tooling/mcp-mobbin/references/troubleshooting.md`
5. `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md`

## Findings - New

### P0

None.

### P1

#### P1-001 — Registered-manual asset retains a pre-discovery banner after discovery completed

- Lane identity: authority `sk-doc`; artifactClass `docs`; dispatched path scope.
- Adapter identity: type `reality-drift`; subcheck `reality-alignment`; layer `reasoning-agent`.
- Evidence: the banner says discovery has not run and the callable remains inferred, while the same asset later records three confirmed live tools and completed discovery. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/assets/utcp-mobbin-manual.md:28] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/assets/utcp-mobbin-manual.md:35] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/assets/utcp-mobbin-manual.md:75]
- Verify-first: the dated fixture contains `mobbin.mobbin.search_screens`, `mobbin.mobbin.search_flows`, and `mobbin.mobbin.search_sections`, and exposes the callable form in `tool_info_first`. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json:1]
- Impact: the asset's primary status banner directs operators as if discovery were still pending, contradicting the live baseline used elsewhere in the same document.
- Recommendation: update the banner and related-resource labels to the completed three-tool discovery state while keeping OAuth-only checks explicitly pending.

#### P1-002 — Wiring reference's frontmatter and opening warning contradict its confirmed discovery section

- Lane identity: authority `sk-doc`; artifactClass `docs`; dispatched path scope.
- Adapter identity: type `reality-drift`; subcheck `reality-alignment`; layer `reasoning-agent`.
- Evidence: the description says discovery is pending and naming inferred, and the opening warning says discovery has not run; Section 5 records the three observed names as confirmed. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md:3] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md:17] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md:103]
- Verify-first: the dated discovery fixture directly lists the three dotted discovery names and the callable access form. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json:1]
- Impact: the first-load contract is stale and can cause an operator to treat already-established names and inventory as unobserved.
- Recommendation: reconcile the frontmatter, opening warning, and related-resource descriptions with the confirmed three-tool fixture, without changing the discovery-first operating rule.

#### P1-003 — Troubleshooting still forbids `deep` as unresolved after the schema confirmed it

- Lane identity: authority `sk-doc`; artifactClass `docs`; dispatched path scope.
- Adapter identity: type `reality-drift`; subcheck `reality-alignment`; layer `reasoning-agent`.
- Evidence: the troubleshooting prohibition says the `deep` input conflict remains open, while the live tool-surface reference records it resolved as `mode?: "deep" | "standard" | "fast"`. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/troubleshooting.md:56] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/tool-surface.md:130]
- Verify-first: `tool_info_first` in the dated fixture declares `mode?: "deep" | "standard" | "fast"`. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json:1]
- Impact: the troubleshooting contract prohibits a valid, discovered input and preserves obsolete single-tool/inferred-naming labels in its related resources.
- Recommendation: replace the obsolete prohibition with the live mode contract and refresh the related-resource labels to the three-tool, observed-naming state.

### P2

#### P2-001 — Hyphenated asset basename does not follow the sk-doc filename convention

- Lane identity: authority `sk-doc`; artifactClass `docs`; dispatched path scope.
- Adapter identity: type `filename-convention`; subcheck `template-conformance`; layer `reasoning-agent`.
- Evidence: the audited basename is `utcp-mobbin-manual.md`; sk-doc requires lowercase snake_case and exempts only `README.md`, skill-local `SKILL.md`, and numbered packet docs. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/assets/utcp-mobbin-manual.md:1] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:37]
- Recommendation: rename the asset to a snake_case basename and update its consumers in a separately gated remediation.

#### P2-002 — Hyphenated wiring-reference basename does not follow the sk-doc filename convention

- Lane identity: authority `sk-doc`; artifactClass `docs`; dispatched path scope.
- Adapter identity: type `filename-convention`; subcheck `template-conformance`; layer `reasoning-agent`.
- Evidence: the audited basename is `mcp-wiring.md`; sk-doc requires lowercase snake_case and this file matches none of the exceptions. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md:1] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:39]
- Recommendation: rename the reference to a snake_case basename and update its consumers in a separately gated remediation.

#### P2-003 — Hyphenated tool-surface basename does not follow the sk-doc filename convention

- Lane identity: authority `sk-doc`; artifactClass `docs`; dispatched path scope.
- Adapter identity: type `filename-convention`; subcheck `template-conformance`; layer `reasoning-agent`.
- Evidence: the audited basename is `tool-surface.md`; sk-doc requires lowercase snake_case and this file matches none of the exceptions. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/tool-surface.md:1] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:39]
- Recommendation: rename the reference to a snake_case basename and update its consumers in a separately gated remediation.

#### P2-004 — Tool-surface related-resource description still calls the registered wiring a draft with inferred naming

- Lane identity: authority `sk-doc`; artifactClass `docs`; dispatched path scope.
- Adapter identity: type `reality-drift`; subcheck `reality-alignment`; layer `reasoning-agent`.
- Evidence: the related-resource label says “draft manual” and “inferred naming,” while the same reference describes the three-tool surface and observed callable name as live-discovered. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/tool-surface.md:3] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/tool-surface.md:129] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/tool-surface.md:142]
- Verify-first: the dated fixture lists all three discovery names and the callable access form. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json:1]
- Recommendation: refresh the link description to registered wiring with observed naming and three discovered tools.

## Verify-First Evidence

- Ran the real `sk-doc.cjs check` adapter over all five artifacts. Each returned `[]`, confirming no active deterministic validator or DQI finding after known-deviation suppression.
- Parsed the live `.utcp_config.json`: exactly one `mobbin` manual exists with stdio `npx -y mcp-remote https://api.mobbin.com/mcp` and an empty `env`.
- Parsed the dated discovery fixture: it contains three discovered callable names and a schema with client-settable `mode` values `deep`, `standard`, and `fast`. [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/discovery-fixture-2026-07-16.json:1]
- Re-read the sk-doc filename authority, including all three exceptions. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:37]

## Known-Deviation Suppressions Applied

None. The compact-pointer-card DQI deviation did not activate because there was no DQI finding. The legacy kebab-case entry applies to legacy filename references and has no active match type; it does not suppress the audited artifact basenames or reality-drift findings.

## Edge Cases

- The dispatch text labels the session “lineage restart,” while immutable config and prior state identify generation 1 with `lineageMode: "new"`. This record preserves the canonical config/state value `new`; session ID and generation agree across all sources.
- The live discovery fixture is JSON on one physical line, so fixture evidence cites line 1.
- OAuth completion remains genuinely pending and was not treated as contradicted by pre-auth tool discovery.
- No remediation was run, and no audited artifact was modified.

## Confirmed-Clean Artifacts

- `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md` — adapter validation and DQI checks returned no findings; its cited install guide and embedded MCP README targets both exist.

## Ruled Out

- Missing required sections, malformed frontmatter, heading-shape violations, and below-floor DQI were ruled out by the real sk-doc adapter for every artifact.
- Broken links from the scripts README were ruled out by direct path existence checks.
- The registered manual shape itself was ruled out as drift by parsing `.utcp_config.json` and comparing its transport, command, args, and empty environment.
- The known-deviation list did not suppress any sibling finding.

## Next Focus

`partition-corpus.cjs` resolved the Mobbin documentation lane above with these five artifacts and reported `remainingAfterThisSlice: 0`.
