# 2026-11-24--two-stage-replay--compiled

> mcp-browser-use · two-stage routing replay · advisor plus compiled front door · policy `be9b1fe7`, generation 1

**Verdict: 48 of 49 PASS. Every original, paraphrase, contract and out-of-domain row passes both stages. MBU-PB-04 still fails at stage one only.**

---

## 1. OVERVIEW

This run replays the hub's routing after its generic aliases were narrowed and its tie-break vocabulary was widened. It keeps the six requests of the 2026-11-21 run and adds paraphrases, the hub playbook prompts, out-of-domain prompts and two rows for the own-Chrome rule. The final replay also runs on the skill advisor 2.0.2.0 scorer, whose task-intent confidence floor now needs the prompt to name the skill.

Stage one is the skill advisor. Stage two is the hub's compiled front door. A positive row passes when the advisor ranks `mcp-browser-use` first at 0.8 or above, `mcp-tooling` stays below 0.8, and the front door returns `action: route` with the expected mode or bundle. A negative row passes when the advisor does not return the hub at 0.8 or above. An `rb` row passes when the front door does not pick `mcp-bladebro`. A playbook defer row passes when the front door returns `action: defer`.

Rows MBU-R, MBU-T, MBU-P-01 to MBU-P-09 and MBU-N-01 to MBU-N-11 ran before and after the change. The other rows were added during the change, to replay each new alias against an out-of-domain prompt and to test the own-Chrome rule, so they have no before numbers.

---

## 2. RUN

| Field | Value |
|---|---|
| Target hub | `mcp-browser-use` |
| Stage one | `skill-advisor.cjs advisor_recommend`, default threshold 0.8 |
| Stage two | `compiled-route.cjs --hub mcp-browser-use --prompt "<request>"` |
| Serving authority | compiled, policy hash `be9b1fe7c9b66b6dc610b1cbb3a6b1b53ebcbcc5fa7e5530dca11eb3d4a8e4d2`, generation 1 |
| Policy before the change | `3c55ad216b21b80cf876048cc2b91252423f0b9ccea43041ee9f370b76f415ca`, generation 1 |
| Scenarios | 49 |
| Outcome tally | 48 PASS, 1 FAIL |
| Recorded at | 2026-11-24T06:57:34Z |

---

## 3. RESULTS

The before column shows the hub's advisor confidence and the front door's decision before the change.

| Scenario | Kind | Request | Before | Hub confidence | Front door | Verdict |
|---|---|---|---|---|---|---|
| MBU-R-01 | mode | debug this page with chrome devtools and take a screenshot | 0.95 / route mcp-chrome-devtools | 0.95 | route mcp-chrome-devtools | PASS |
| MBU-R-02 | mode | use aside to fill this form in my signed-in account | 0.9342 / route mcp-aside-devtools | 0.9441 | route mcp-aside-devtools | PASS |
| MBU-R-03 | mode | use bladebro to attach to my open browser and finish the checkout flow | 0.928 / route mcp-bladebro | 0.9295 | route mcp-bladebro | PASS |
| MBU-T-01 | tie-break | replay this signed-in checkout step by step and save the evidence | 0.8255 / route mcp-aside-devtools | 0.8482 | route mcp-aside-devtools | PASS |
| MBU-T-02 | tie-break | in the browser I already have open, work out how to finish this signup | 0.8298 / route mcp-bladebro | 0.8525 | route mcp-bladebro | PASS |
| MBU-T-03 | tie-break | export a HAR of this page load | 0.9161 / route mcp-chrome-devtools | 0.8764 | route mcp-chrome-devtools | PASS |
| MBU-P-01 | paraphrase | fill out the form in my signed-in account | 0 / defer | 0.9161 | route mcp-aside-devtools | PASS |
| MBU-P-02 | paraphrase | replay the signed-in login flow and keep the evidence | 0 / defer | 0.8368 | route mcp-aside-devtools | PASS |
| MBU-P-03 | paraphrase | browse this site without getting flagged as a bot | 0 / defer | 0.8751 | route mcp-bladebro | PASS |
| MBU-P-04 | paraphrase | in my already open browser, figure out how to finish the order | 0.8298 / route mcp-bladebro | 0.8525 | route mcp-bladebro | PASS |
| MBU-P-05 | paraphrase | save the network log of this page as a har file | 0.9161 / route mcp-chrome-devtools | 0.9161 | route mcp-chrome-devtools | PASS |
| MBU-P-06 | paraphrase | run lighthouse on the staging page | 0.95 / route mcp-chrome-devtools | 0.9346 | route mcp-chrome-devtools | PASS |
| MBU-P-07 | paraphrase | record a performance trace of the page load in chrome | 0.9295 / route mcp-chrome-devtools | 0.95 | route mcp-chrome-devtools | PASS |
| MBU-P-08 | paraphrase | attach to my own chrome and inspect the signed-in dashboard | 0.8996 / route mcp-chrome-devtools | 0.8947 | route mcp-chrome-devtools | PASS |
| MBU-P-09 | paraphrase | use bladebro status to check the daemon | 0.8963 / route mcp-bladebro | 0.8661 | route mcp-bladebro | PASS |
| MBU-N-01 | negative | as an aside, can you tidy this paragraph | 0 / route mcp-aside-devtools | 0 | defer | PASS |
| MBU-N-02 | negative | set that aside and fix the failing unit test first | 0.82 / route mcp-aside-devtools | 0 | defer | PASS |
| MBU-N-03 | negative | convert this ruby rb file to python | 0 / defer | 0 | defer | PASS |
| MBU-N-04 | negative | write a lighthouse keeper short story | 0.82 / route mcp-chrome-devtools | 0 | defer | PASS |
| MBU-N-05 | negative | click through rate dropped, analyse the csv | 0 / defer | 0 | defer | PASS |
| MBU-N-06 | negative | make the checkout flow stealthier in the copy, less salesy | 0 / defer | 0 | defer | PASS |
| MBU-N-07 | negative | summarise the performance trace review notes in the spec | 0.8864 / route mcp-chrome-devtools | 0 | defer | PASS |
| MBU-N-08 | negative | export a har file parser in typescript | 0.9129 / route mcp-chrome-devtools | 0 | defer | PASS |
| MBU-N-09 | negative | set that aside and fix the failing unit test | 0.82 / route mcp-aside-devtools | 0 | defer | PASS |
| MBU-N-10 | negative-rb | rb status of the ruby build | 0.8229 / route mcp-bladebro | 0 | defer | PASS |
| MBU-N-11 | negative-rb | check rb attach logs in the deploy | 0.8452 / route mcp-bladebro | 0 | defer | PASS |
| MBU-P-10 | paraphrase | run aside on the pricing page | not captured | 0.8665 | route mcp-aside-devtools | PASS |
| MBU-P-11 | paraphrase | open aside and log in | not captured | 0.9019 | route mcp-aside-devtools | PASS |
| MBU-P-12 | paraphrase | run a lighthouse audit on the homepage | not captured | 0.95 | route mcp-chrome-devtools | PASS |
| MBU-P-13 | paraphrase | check bladebro rb status | not captured | 0.9117 | route mcp-bladebro | PASS |
| MBU-P-14 | paraphrase | export a HAR of the checkout page | not captured | 0.8764 | route mcp-chrome-devtools | PASS |
| MBU-P-15 | paraphrase | attach to the browser i have open and finish the signup | not captured | 0.8588 | route mcp-bladebro | PASS |
| MBU-P-16 | paraphrase | replay the signed-in checkout and keep the proof | not captured | 0.8527 | route mcp-aside-devtools | PASS |
| MBU-PB-01 | playbook | Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging. | not captured | 0.95 | route mcp-chrome-devtools | PASS |
| MBU-PB-02 | playbook | Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget. | not captured | 0.95 | route mcp-aside-devtools | PASS |
| MBU-PB-03 | playbook | Use Bladebro to read example.com in stealth mode and click the Learn more link. | not captured | 0.8333 | route mcp-bladebro | PASS |
| MBU-PB-04 | playbook | The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause. | not captured | 0 | route mcp-chrome-devtools | FAIL |
| MBU-PB-05 | playbook | Run a Lighthouse audit on the staging homepage and report the performance score. | not captured | 0.95 | route mcp-chrome-devtools | PASS |
| MBU-PB-06 | playbook-defer | Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes. | not captured | 0.82 | defer | PASS |
| MBU-PB-07 | playbook-defer | Use the MCP tool bridge for this. | not captured | 0 | defer | PASS |
| MBU-N-12 | negative | use aside comments to explain the tradeoff in the doc | not captured | 0 | route mcp-aside-devtools | PASS |
| MBU-N-13 | negative | write a report on the lighthouse score methodology for the blog | not captured | 0 | defer | PASS |
| MBU-N-14 | negative | parse the network har of this page in a python script | not captured | 0 | defer | PASS |
| MBU-N-15 | negative | my emails got flagged as a bot by the spam filter, fix the smtp headers | not captured | 0 | defer | PASS |
| MBU-N-16 | negative | update the form in my signed-in account settings component in react | not captured | 0 | defer | PASS |
| MBU-N-17 | negative | add a performance trace of the sql queries to the server logs | not captured | 0 | defer | PASS |
| MBU-N-18 | negative | the browser i have open is slow, which extensions should i remove | not captured | 0 | defer | PASS |
| MBU-F-01 | contract | attach to my own chrome and finish the checkout | not captured | 0.8588 | route mcp-chrome-devtools | PASS |
| MBU-F-02 | contract | attach to my own chrome, the browser i already have open, and finish the checkout | not captured | 0.8841 | route mcp-chrome-devtools+mcp-bladebro | PASS |

### What moved

- Tie-break rows: MBU-T-01 rose from 0.8255 to 0.8482 and MBU-T-02 from 0.8298 to 0.8525.
- Paraphrases: MBU-P-01, MBU-P-02 and MBU-P-03 returned no skill before. They now reach their modes at 0.9161, 0.8368 and 0.8751.
- Out-of-domain prompts: before the change, the front door routed 8 of the 11 original negatives to a mode. It now defers on all 11. MBU-N-04 and MBU-N-11 also fall below the advisor floor, to 0. After the scorer change MBU-N-10 does too, and it no longer reaches Bladebro.
- Own Chrome: MBU-F-01 names the user's own Chrome and routes to Chrome DevTools, as the hub contract now states. MBU-F-02 names both the user's own Chrome and an already-open browser, and returns an ordered bundle with Chrome DevTools first.

### Stage one after the scorer change

- MBU-N-02, MBU-N-04, MBU-N-09, MBU-N-10, MBU-N-15 and MBU-N-16 sat at the advisor's 0.82 confidence floor on one or two shared words, such as "aside", "lighthouse", "rb", "flagged" and "signed". The floor now needs the prompt to name the skill, so each keeps the confidence it earned and falls below 0.8.
- MBU-N-07 and MBU-N-17 reached 0.82 through the browser read-only lift on a bare "performance trace". The lift now needs "chrome performance trace" or "browser performance trace", and both fall below 0.8. MBU-P-07, which says "in chrome", still scores 0.95.
- MBU-N-08 and MBU-N-14 matched a bare `har` in the scorer's explicit token table and its lexical hints. Both entries are gone, and the two rows fall below 0.8. MBU-T-03 and MBU-P-14 keep the hub's own "export a HAR of" phrase and pass at 0.8764.

### Row that still fails

- MBU-PB-04 returns no advisor recommendation, while the front door routes it to `mcp-chrome-devtools` as the playbook expects. None of the changes in this run touch the vocabulary that prompt matches. It is a known limitation of stage one.

### Hit rate per mode, positive and contract rows

| Mode | Hits | Rate |
|---|---|---|
| mcp-chrome-devtools | 11 of 12 | 92% |
| mcp-aside-devtools | 8 of 8 | 100% |
| mcp-bladebro | 8 of 8 | 100% |
| Chrome DevTools plus Bladebro bundle | 1 of 1 | 100% |

`mcp-tooling` was below threshold on every positive row. The one Chrome DevTools miss is MBU-PB-04, which fails at stage one only. `mcp-tooling` cleared 0.8 only on MBU-PB-07, which names the MCP tool bridge and must defer here.

---

## 4. FILES

| File | Contents |
|---|---|
| [`skill-benchmark-report.json`](./skill-benchmark-report.json) | The machine record every other file here derives from |
| [`results.csv`](./results.csv) | One row per scenario with before and after columns, for spreadsheet and diff use |
| [`source.md`](./source.md) | How the run was produced and what it does not cover |
