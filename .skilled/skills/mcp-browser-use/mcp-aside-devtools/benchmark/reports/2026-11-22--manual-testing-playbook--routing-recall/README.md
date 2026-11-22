# 2026-11-22--manual-testing-playbook--routing-recall

> mcp-aside-devtools · manual-testing-playbook · 8 intra-routing-recall scenarios · packet `ROUTER.md` replay

---

## 1. HEADLINE / OVERVIEW

Verdict: PASS.

Every intra-routing-recall scenario in the Aside playbook passed. Each one checks that a prompt resolves the intent and resource set its frontmatter names. This run checked the scenario contract and also replayed the prompt through the packet's own machine router. Both agreed for all 8.

Tally: 8 PASS, 0 FAIL.

---

## 2. AGGREGATE RESULTS

| Scenario | File | Verdict | Observed |
|---|---|---|---|
| AD-H01 | `intra-routing-recall/holdout-repl.md` | PASS | expected `REPL`, router chose `REPL` and loaded `references/aside-cli-reference.md`, `references/session-management.md` |
| AD-H02 | `intra-routing-recall/holdout-troubleshoot.md` | PASS | expected `TROUBLESHOOT`, router chose `TROUBLESHOOT` and loaded `references/troubleshooting.md`, `references/session-management.md` |
| AD-R04 | `intra-routing-recall/install.md` | PASS | expected `INSTALL`, router chose `INSTALL` and loaded `references/troubleshooting.md` |
| AD-R03 | `intra-routing-recall/mcp.md` | PASS | expected `MCP`, router chose `MCP` and loaded `references/mcp-wiring.md`, `references/session-management.md`, `assets/utcp-aside-manual.md` |
| AD-N01 | `intra-routing-recall/negative.md` | PASS | expected `none`, router chose `UNKNOWN` and loaded none |
| AD-R02 | `intra-routing-recall/repl.md` | PASS | expected `REPL`, router chose `REPL` and loaded `references/aside-cli-reference.md`, `references/session-management.md` |
| AD-R01 | `intra-routing-recall/task.md` | PASS | expected `TASK`, router chose `TASK` and loaded `references/aside-cli-reference.md`, `references/session-management.md` |
| AD-R05 | `intra-routing-recall/troubleshoot.md` | PASS | expected `TROUBLESHOOT`, router chose `TROUBLESHOOT` and loaded `references/troubleshooting.md`, `references/session-management.md` |

---

## 3. METHODOLOGY

A scenario's own pass rule is that every path in `expected_resources` exists and the frontmatter names the intent. That rule never runs the router, so this run added a replay. A small harness read the Python block under `## 3. MACHINE ROUTER` in the packet `ROUTER.md`, ran `route_aside_devtools_resources` on each scenario's exact prompt and compared the top intent and loaded resources with the frontmatter. The negative scenario passes when the router returns `UNKNOWN_FALLBACK` with no resources.

A negative control ran first on a copy of one Chrome DevTools scenario, with its expected intent changed to `MCP` and one resource renamed. The harness failed both checks, so a PASS here is not a harness that always agrees.

The run is offline: no browser, network or account was used. Each scenario ran once.

---

## 4. FINDINGS

1. The packet router and the routing-recall corpus agree on every prompt.
2. The scenario pass rule checks file existence only. A stale `RESOURCE_MAP` would still pass it, which is why this run added the router replay.

---

## 5. CAVEATS

This exercises stage two inside the packet only. Stage one, the advisor, and the hub router are covered by the hub's own reports under `.skilled/skills/mcp-browser-use/benchmark/reports/`.

---

## 6. RECOMMENDATIONS

Tier 1, apply now: none.

Tier 2, validate first: make the scenarios' step 3 replay the router as well, so the scenario itself fails on a stale map.

Tier 3, future: none.

---

## 7. REPRODUCIBILITY

Run steps 1 to 3 of each file named in section 2 from the repository root. For the replay, execute the `ROUTER.md` machine-router block with the scenario's exact prompt as `task.text`.

---

## 8. CROSS-LINKS

| File | Contents |
|---|---|
| `source.md` | Where the corpus and the raw evidence live |
