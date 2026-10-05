## Row 47 (basename_only)
- Doc: `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/research/evilcharts-2026-09-03/lineages/deepseek-flash-max/iterations/iteration-003.md:15`
- Citation: `../../../../../../.opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json:1`
- Candidates: `.skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/palettes.json`

```text
**F3-3. The corpus's own system-definition rule says several neutral rows should be categorical.** `color-system.md` defines `categorical` as "category membership" for "unordered categories" and `neutral` as the fallback "whenever hue would carry no stable meaning". A multi-series comparison chart's series identity *is* a category: `grouped-bars` (2 series) is assigned `neutral` while `stacked-bars` (segments) is assigned `categorical` — the same kind of series membership, two different systems. `stacked-area` (2-5 series) is `categorical`, `parallel-axes` is `categorical`, but `grouped-bars` …

…The spec's edge-case list explicitly names "a choice that only reads well in a dark theme" and asks whether the corpus should gain one. [SOURCE: context/evilcharts/src/app/globals.css:102-126] [SOURCE: ../../../../../../.opencode/skills/sk-doc/sk-create-chart/references/color-system.md:75] [SOURCE: ../../../../../../.opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json:1]…

**F3-5. Numeric text is set in a mono face with tabular figures in evilcharts; the corpus uses the system face.** Tooltip values are `font-mono font-medium tabular-nums` (JetBrains Mono on the site, `font-mono` token). The corpus applies `font-variant-numeric: tabular-nums` to tick labels only (daily-line `.tick`); value labels inside the figure, notes and the source line do not. The exact fonts are not adoptable (the contract bans web fonts), but the *treatment* is: a system mono stack (`ui-monospace
```

## Row 80 (ambiguous)
- Doc: `specs/system-speckit/027-xce-research-based-refinement/research/002-implementation-risk-cross-validation/iterations/iteration-019.md:14`
- Citation: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/sub-packet-proposals.md:144`
- Candidates: `specs/system-speckit/027-xce-research-based-refinement/research/001-xce-adoption-matrix/sub-packet-proposals.md`, `specs/system-speckit/027-xce-research-based-refinement/research/007-gem-team-adoption-matrix/sub-packet-proposals.md`, `specs/system-speckit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings/sub-packet-proposals.md`, `specs/system-speckit/027-xce-research-based-refinement/research/010-openltm-memory-architecture-teachings/sub-packet-proposals.md`

```text

- Read parent phase order and declarations: parent `spec.md` recommends `004 first`, then `001 -> 002 -> 003 in parallel`, then `005 last` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:45-56`).
- Read proposal dependency graph: original proposals say structural packets `028/029/030` are Phase 1, `031` is standalone but tested with those tools, and `032` depends on `031` plus `028/029/030` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/sub-packet-proposals.md:144-162`).
- Read ground-truth child dependency metadata: Phase 001 declares no deps, Phase 002 declares `001-code-graph-hld-lld`, Phase 003 declares none, Phase 004 declares none, and Phase 005 declares `001/002/003/004` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/description.json:19-21`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-code-graph-trace/description.json:19-21`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-code-graph-impact-analysis/description.json:20-22`, `.opencode/specs/system-spec-kit/027-…
- Synthesized Iterations 001-009: Phase 001 needs deterministic ordering and edge policies (`iteration-001.md:17-45`); Phase 002 cannot rely on `CONTAINS` for file/module rungs (`iteration-002.md:19-29`); Phase 003 needs graph-only formula amendments but keeps `layer` optional (`iteration-003.md:30-70`); Phase 004 needs threshold/hint/string-test guardrails (`i
```

## Row 92 (ambiguous)
- Doc: `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/iterations/iteration-014.md:56`
- Citation: `.opencode/skills/system-spec-kit/mcp_server/package.json:3`
- Candidates: `.opencode/package.json`, `.pi/extensions/pi-cache-optimizer/package.json`, `.pi/extensions/pi-fast-mode-w-subagent-support/package.json`, `.skilled/package.json`, `.skilled/skills/mcp-code-mode/mcp-server/package.json`, `.skilled/skills/mcp-tooling/mcp-obsidian/mcp-servers/obsidian-mcp/package.json`, `.skilled/skills/sk-design/sk-design-md-generator/backend/package.json`, `.skilled/skills/sk-doc/package.json` and 10 more

```text
| `R10-P1-001` | Confirmed | README still labels the proxy replay boundary as read-only while source replays `memory_save`. | README wording at `.opencode/skills/system-spec-kit/mcp_server/README.md:254`; replayable set includes `memory_save` at `.opencode/bin/lib/launcher-session-proxy.cjs:28`; classifier permits it at `.opencode/bin/lib/launcher-session-proxy.cjs:125`. | Checked adjacent README error-code row and source replay classifier. | The README may use “read-only” as shorthand for safe-to-replay, but source implements a broader read plus idempotent-write boundary. | P1 | High | Downgr…
| `R13-P1-001` | Confirmed | 013 continuity surfaces still disagree on resume target and shipped/deployed state. | Parent spec says active child is `002` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/spec.md:119`; graph metadata points to `003` at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/graph-metadata.json:97`; graph metadata status is complete at line 41 while derived entities still include `In Progress` at l…
…m-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/implementation-summary.md:72`; source has `version: '1.8.0'` at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014`; package version is `1.8.0`
```

## Row 102 (basename_only)
- Doc: `specs/sk-doc/062-doc-validation-off-switches/review/lineages/luna/iterations/iteration-001.md:17`
- Citation: `.skilled/skills/sk-doc/scripts/tests/validate-skip-switch.vitest.ts:67`
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/tests/validate-skip-switch.vitest.ts`

```text
The shell resolver uses `__HF_UNSET__` as an in-band marker for an absent environment variable. If a caller explicitly sets a switch to that literal and the config file sets the switch to `1`, the shell reader treats the environment as unset and enables the switch from the file. That contradicts the packet's rule that any set environment value wins, including falsy values. [SOURCE: specs/sk-doc/062-doc-validation-off-switches/spec.md:129-130] [SOURCE: .skilled/hooks/shared/hook-flags.sh:37-44]

The Node and Python readers distinguish key presence from value, so this is isolated to the shell resolver's sentinel check. The existing falsy cases exercise empty, `0`, and `skip`, but not the sentinel literal. [SOURCE: .skilled/hooks/shared/hook-flags.cjs:181-193] [SOURCE: .skilled/skills/sk-doc/scripts/tests/validate-skip-switch.vitest.ts:67-75]

**Recommendation:** Check variable presence independently of its contents and add a focused regression row for this literal.
```

## Row 109 (basename_only)
- Doc: `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/013-shadcn-reference-research/research/lineages/luna/research.md:64`
- Citation: `.opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:58`
- Candidates: `.skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/palettes.json`

```text
| Standalone categorical dark | 96.5° | 3.38 / 1.72 | 0.161 / 0.153 / 0.221 |

The standalone neutral system is intentionally non-hued, and the ordered system is intentionally one hue: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:126-166]`. Their small hue gaps are not categorical failures. The standalone palette also has explicit light/dark grounds and numeric gates for text, marks, ramp steps, and emphasis: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:5-23]`, `[SOURCE: .opencode/skills/sk-design/sk-design-chart/assets/color/palettes.json:58-96]`.

The result is to adopt shadcn-style source-token indirection, not the raw five-token ramp. The standalone role split is more useful for this corpus, and the current checker enforces palette source/literal consistency and existing contrast gates but not CVD or hue thresholds: `[SOURCE: .opencode/skills/sk-design/sk-design-chart/references/color-system.md:229-247]`.
```

