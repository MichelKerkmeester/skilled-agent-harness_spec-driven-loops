# 2026-11-21--manual-testing-playbook--hub-routing

> mcp-browser-use · manual-testing-playbook · hub routing through the compiled router · seven scenarios plus the admission check

---

## 1. HEADLINE / OVERVIEW

Verdict: FAIL.

Six of seven hub-routing scenarios matched their gold. The blind holdout MT-H04, a plain-language autonomous browser task, deferred where its gold expects `mcp-aside-devtools`. The admission check reports the same drift and exits 1.

Tally: 6 PASS, 1 FAIL.

---

## 2. AGGREGATE RESULTS

| Scenario | Stage | Gold | Observed | Verdict |
|---|---|---|---|---|
| MT-001 chrome-devtools-browser-debug | routing | `mcp-chrome-devtools` | route `mcp-chrome-devtools` | PASS |
| MT-007 aside-browser-automation | routing | `mcp-aside-devtools` | route `mcp-aside-devtools` | PASS |
| MT-012 bladebro-stealth-browser | routing | `mcp-bladebro` | route `mcp-bladebro` | PASS |
| MT-013 lighthouse-performance-audit | routing | `mcp-chrome-devtools` | route `mcp-chrome-devtools` | PASS |
| MT-004 ambiguous-defer | routing | `defer` | defer | PASS |
| MT-H01 holdout-browser-inspect | holdout | `mcp-chrome-devtools` | route `mcp-chrome-devtools` | PASS |
| MT-H04 holdout-agentic-browser | holdout | `mcp-aside-devtools` | defer | FAIL |

---

## 3. METHODOLOGY

Each scenario prompt went through `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "<prompt>"` once, from the repository root. Every call printed `effectivePolicyHash` `dd69936393b40a51080dac4772d42a8e317e8fe099514d4db846716027000698` at generation 1. The five scenarios MT-001, MT-004, MT-007, MT-H01 and MT-H04 were recreated from the `mcp-tooling` hub-routing corpus at `HEAD` with their prompts and gold unchanged, and their leaf gold repointed to the same leaves in this hub. MT-012 and MT-013 are new.

---

## 4. RECORDED OUTPUT

```text
$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging."
{"hubId":"mcp-browser-use","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-chrome-devtools","packetKind":"workflow","skillId":"mcp-browser-use","workflowMode":"mcp-chrome-devtools"}],"effectivePolicyHash":"dd69936393b40a51080dac4772d42a8e317e8fe099514d4db846716027000698","generation":1}
EXIT=0

$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget."
{"hubId":"mcp-browser-use","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-aside-devtools","packetKind":"workflow","skillId":"mcp-browser-use","workflowMode":"mcp-aside-devtools"}],"effectivePolicyHash":"dd69936393b40a51080dac4772d42a8e317e8fe099514d4db846716027000698","generation":1}
EXIT=0

$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use Bladebro to read example.com in stealth mode and click the Learn more link."
{"hubId":"mcp-browser-use","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-bladebro","packetKind":"workflow","skillId":"mcp-browser-use","workflowMode":"mcp-bladebro"}],"effectivePolicyHash":"dd69936393b40a51080dac4772d42a8e317e8fe099514d4db846716027000698","generation":1}
EXIT=0

$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Run a Lighthouse audit on the staging homepage and report the performance score."
{"hubId":"mcp-browser-use","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-chrome-devtools","packetKind":"workflow","skillId":"mcp-browser-use","workflowMode":"mcp-chrome-devtools"}],"effectivePolicyHash":"dd69936393b40a51080dac4772d42a8e317e8fe099514d4db846716027000698","generation":1}
EXIT=0

$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use the MCP tool bridge for this."
{"hubId":"mcp-browser-use","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"dd69936393b40a51080dac4772d42a8e317e8fe099514d4db846716027000698","generation":1}
EXIT=0

$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause."
{"hubId":"mcp-browser-use","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-chrome-devtools","packetKind":"workflow","skillId":"mcp-browser-use","workflowMode":"mcp-chrome-devtools"}],"effectivePolicyHash":"dd69936393b40a51080dac4772d42a8e317e8fe099514d4db846716027000698","generation":1}
EXIT=0

$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes."
{"hubId":"mcp-browser-use","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"dd69936393b40a51080dac4772d42a8e317e8fe099514d4db846716027000698","generation":1}
EXIT=0
```

### Admission check

```text
$ node .skilled/bin/compiled-route-admission.cjs --hub mcp-browser-use
  mcp-browser-use             drift                   6 pass, 1 drift, 0 stale, 0 n/a

1 hub(s) fail the admission check.
EXIT=1
```

The `--json` report names the drift row: `MT-H04`, status `drift`, reason `silent-defer`, detail `engine returned defer`. Before these scenarios existed the same command printed `pass`, `0 pass, 0 drift, 0 stale, 0 n/a; 3 mode(s) without gold`.

```text
$ node --test .skilled/bin/tests/compiled-route-admission.test.cjs
ℹ tests 29
ℹ pass 29
ℹ fail 0
EXIT=0
```

That test pins the size of the live gold corpus. The seven new scenarios raised it from 78 to 85, and the pinned constant was updated to match. Before that update the only failure was that count, `actual: 85, expected: 78`.

---

## 5. FINDINGS

1. MT-H04 drift. Under `mcp-tooling` this holdout routed to Aside through the keywords "click through" and "on its own". The `mcp-browser-use` vocabulary carries neither, and its `hub-router.json` and `ROUTER.md` state that bare agentic phrasing is discovery-only and belongs to neither Aside nor Bladebro. The recreated gold and the new router contract disagree. Deciding which one holds is for the routing owner. The gold was not edited to match.
2. Every declared mode now has gold, and the hub has one defer scenario.

---

## 6. CAVEATS

Each prompt ran once. This run tests the hub's stage-two routing only. It does not replay the advisor stage.

---

## 7. RECOMMENDATIONS

Tier 1, apply now: none.

Tier 2, validate first: the routing owner decides whether a plain autonomous-browser request should route to Aside, route to Bladebro or defer, and then either adds vocabulary or revises the MT-H04 gold in a new corpus revision.

Tier 3, future: add blind holdouts for `mcp-bladebro` and for the Lighthouse leaves.

---

## 8. REPRODUCIBILITY

```bash
node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "<prompt from each scenario>"
node .skilled/bin/compiled-route-admission.cjs --hub mcp-browser-use
node --test .skilled/bin/tests/compiled-route-admission.test.cjs
```

---

## 9. CROSS-LINKS

| File | Contents |
|---|---|
| `source.md` | Where the corpus and the raw evidence live |
