# Routing Benchmark Report — mcp-webflow registration

- **Date**: 2026-08-02
- **Method**: router-replay (`system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`) against the live `hub-router.json` signals of `.opencode/skills/mcp-tooling` — routing-level replay, not the full Lane C harness (see Limitations).
- **Scenarios**: 12 (7 webflow, 4 sibling boundary, 1 non-hub negative).

## Results

| Prompt | Routed intent | Expected | Verdict |
|---|---|---|---|
| update the webflow cms collection items in the test site | WEBFLOW | WEBFLOW | PASS |
| publish the webflow about page to staging | WEBFLOW | WEBFLOW | PASS |
| delete all webflow site scripts | WEBFLOW | WEBFLOW | PASS |
| run a webflow workflow | WEBFLOW | WEBFLOW | PASS |
| set the heading level of the hero element in webflow | WEBFLOW | WEBFLOW | PASS |
| webflow | WEBFLOW | WEBFLOW | PASS |
| find mobile design patterns for a checkout flow | MOBBIN | MOBBIN | PASS (boundary) |
| create a clickup task for the sprint | CLICK_UP | CLICK_UP | PASS (boundary) |
| extract design tokens from figma | FIGMA | FIGMA | PASS (boundary) |
| search refero for web product styles | REFERO | REFERO | PASS (boundary) |
| browser debug the login page | CHROME_DEVTOOLS | CHROME_DEVTOOLS | PASS (boundary) |
| review the auth module code | DEFER (no-mode-scored) | DEFER | PASS (negative) |

**Score: 12/12 (100%).** Sample webflow route evidence: `intents: [mcp-webflow]`, `resources: [mcp-webflow/references/tool-surface.md, mcp-webflow/references/mcp-wiring.md]`, `matchedAliases: [webflow, webflow cms]`, `defaultApplied: false`.

## Advisor recall (static → live re-probed)

The skill-advisor daemon was DOWN during the original run (documented infra blocker); static keyword coverage was recorded (`description.json` carries `mcp-webflow`, `webflow`, `webflow mcp`, `webflow cms`, `webflow publish`). **Re-probed live 2026-08-02 after daemon restart**: a webflow-heavy prompt returns `mcp-tooling` (0.598, top rank) ahead of `sk-code` (0.576) and `mcp-code-mode` (0.564); leaf mode selection resolves through `hub-router.json` (12/12 replay above). B-002 closed by this re-probe.

## Findings and recommendations

| ID | Severity | Finding | Recommendation |
|---|---|---|---|
| B-001 | P2 | `route-gold.typed.json` for mcp-tooling (019 compiled-routing program) predates webflow — no webflow cases in the gold set | Regenerate the compiled route-gold via the 019 program after this packet lands; the full Lane C hard gate cannot score webflow until then |
| B-002 | P2 | Advisor live recall unproven (daemon down) | Re-probe after daemon restart; static coverage is in place |

## Limitations

- Routing-level replay only; the Lane C harness's D2-D5 dimensions were not run (harness requires the deep-loop interactive invocation path).
- Route-gold coverage gap (B-001) blocks the full benchmark gate until the compiled set is regenerated.
