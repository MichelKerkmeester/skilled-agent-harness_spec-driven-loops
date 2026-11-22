# 2026-11-21--manual-testing-playbook--hub-routing--post-review

> mcp-browser-use · manual-testing-playbook · hub routing through the compiled router · seven scenarios, one canary probe and the admission check, after the deep-review fixes

---

## 1. HEADLINE / OVERVIEW

Verdict: PASS.

All seven hub-routing scenarios matched their gold. The admission check passes with no drift and exits 0. This run supersedes [`2026-11-21--manual-testing-playbook--hub-routing/`](../2026-11-21--manual-testing-playbook--hub-routing/README.md), which recorded FAIL. The MT-H04 gold has changed since that run, from `mcp-aside-devtools` to `defer`, by operator decision Q003 in the packet's `006-verification/decision-record.md`. The router fix in this run is a separate change and does not alter any scenario's result.

Tally: 7 PASS, 0 FAIL. Canary probe: PASS.

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
| MT-H04 holdout-agentic-browser | holdout | `defer` | defer | PASS |
| Canary probe, not a playbook scenario | routing | `mcp-chrome-devtools` | route `mcp-chrome-devtools` | PASS |

---

## 3. METHODOLOGY

Each prompt went through `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "<prompt>"` once, from the repository root. Every call printed `effectivePolicyHash` `8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a` at generation 1. The scenarios and their gold were read from `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/` and were not edited.

The router change under test came from the deep review of this branch. The compiled router used to reject any prompt whose text contained the word "forbidden", so a 403 Forbidden debugging request was refused. It now rejects only on the `forbidden` constraint. The canary probe is that 403 request. It is the case the canary fixture gained with the fix, and it is not part of the playbook corpus.

---

## 4. RECORDED OUTPUT

```text
$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging."
{"hubId":"mcp-browser-use","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-chrome-devtools","packetKind":"workflow","skillId":"mcp-browser-use","workflowMode":"mcp-chrome-devtools"}],"effectivePolicyHash":"8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a","generation":1}
EXIT=0

$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use the MCP tool bridge for this."
{"hubId":"mcp-browser-use","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a","generation":1}
EXIT=0

$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget."
{"hubId":"mcp-browser-use","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-aside-devtools","packetKind":"workflow","skillId":"mcp-browser-use","workflowMode":"mcp-aside-devtools"}],"effectivePolicyHash":"8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a","generation":1}
EXIT=0

$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use Bladebro to read example.com in stealth mode and click the Learn more link."
{"hubId":"mcp-browser-use","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-bladebro","packetKind":"workflow","skillId":"mcp-browser-use","workflowMode":"mcp-bladebro"}],"effectivePolicyHash":"8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a","generation":1}
EXIT=0

$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Run a Lighthouse audit on the staging homepage and report the performance score."
{"hubId":"mcp-browser-use","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-chrome-devtools","packetKind":"workflow","skillId":"mcp-browser-use","workflowMode":"mcp-chrome-devtools"}],"effectivePolicyHash":"8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a","generation":1}
EXIT=0

$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause."
{"hubId":"mcp-browser-use","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-chrome-devtools","packetKind":"workflow","skillId":"mcp-browser-use","workflowMode":"mcp-chrome-devtools"}],"effectivePolicyHash":"8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a","generation":1}
EXIT=0

$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes."
{"hubId":"mcp-browser-use","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a","generation":1}
EXIT=0

$ node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "debug the 403 Forbidden network requests in chrome devtools"
{"hubId":"mcp-browser-use","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-chrome-devtools","packetKind":"workflow","skillId":"mcp-browser-use","workflowMode":"mcp-chrome-devtools"}],"effectivePolicyHash":"8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a","generation":1}
EXIT=0
```

Before the router fix, the same canary prompt printed `"action":"reject"`.

### Admission check

```text
$ node .skilled/bin/compiled-route-admission.cjs --hub mcp-browser-use
  mcp-browser-use             pass                    7 pass, 0 drift, 0 stale, 0 n/a

Every hub passes the admission check.
EXIT=0
```

```text
$ node --test .skilled/bin/tests/compiled-route-admission.test.cjs
ℹ tests 29
ℹ pass 29
ℹ fail 0
```

---

## 5. FINDINGS

1. MT-H04 now matches its gold. The defer it returned in the earlier run was the router's intended behavior, and the gold was changed to `defer` by operator decision Q003.
2. The policy hash differs from the earlier run's `dd699363…`. The devtools phrases added during the branch's alignment pass changed `hub-router.json`, and the manifest was re-minted then. The router fix in this run does not change the hash: the policy is compiled from the hub's registry, router and skill files, not from the router code.

---

## 6. CAVEATS

Each prompt ran once. This run tests the hub's stage-two routing only. It does not replay the advisor stage.

---

## 7. RECOMMENDATIONS

Tier 1, apply now: none.

Tier 2, validate first: none.

Tier 3, future: add blind holdouts for `mcp-bladebro` and for the Lighthouse leaves, as the earlier run recommended.

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
| [`../2026-11-21--manual-testing-playbook--hub-routing/`](../2026-11-21--manual-testing-playbook--hub-routing/README.md) | The earlier FAIL run this one supersedes |
