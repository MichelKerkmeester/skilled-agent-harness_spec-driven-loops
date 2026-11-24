# 2026-11-24--two-stage-replay--compiled--second-follow-up

> mcp-browser-use · two-stage routing replay · advisor plus compiled front door · policy `4db40e86`, generation 1

**Verdict: 55 of 56 PASS. The mixed id and alias bundles and the Aside prose rows pass, and every out-of-domain prompt scores 0 for the hub. MBU-PB-04 still fails at stage one only.**

---

## 1. OVERVIEW

This run replays the hub's routing after the second follow-up review fixes. It keeps the 52 rows of the [first follow-up run](../2026-11-24--two-stage-replay--compiled--follow-up/README.md) and adds four:

- MBU-B-02, "use mcp-chrome-devtools and bladebro". The front door returned Chrome DevTools alone before, because the full id also matched the alias "chrome devtools" and counted twice.
- MBU-B-03, "use mcp-bladebro and aside browser". Same cause, with Bladebro named by its id.
- MBU-P-17, "open it in aside". It deferred before, because no prose form of "aside" was in the vocabulary.
- MBU-B-04, a request naming Aside in prose beside Chrome DevTools. It dropped Aside before.

The before numbers for the four new rows come from front-door calls made before the change, so the table marks them not captured. The pass rules are the same as in the earlier runs.

---

## 2. RUN

| Field | Value |
|---|---|
| Target hub | `mcp-browser-use` |
| Stage one | `skill-advisor.cjs advisor_recommend`, default threshold 0.8 |
| Stage two | `compiled-route.cjs --hub mcp-browser-use --prompt "<request>"` |
| Serving authority | compiled, policy hash `4db40e8689a0a2f76dbfc6c98e3ccae10ffc6fd7e27998a4b4b7a3c4e878114c`, generation 1 |
| Policy before the change | `fc55eafafd5fc13b99c71dee65d396017419a630ceb540fd0dd88498d138aeb8`, generation 1 |
| Scenarios | 56 |
| Outcome tally | 55 PASS, 1 FAIL |
| Recorded at | 2026-11-24T09:38:34Z |

---

## 3. RESULTS

The before column is the first follow-up run.

| Scenario | Kind | Request | Before | Hub confidence | Front door | Verdict |
|---|---|---|---|---|---|---|
| MBU-R-01 | mode | debug this page with chrome devtools and take a screenshot | 0.95 / route mcp-chrome-devtools | 0.95 | route mcp-chrome-devtools | PASS |
| MBU-R-02 | mode | use aside to fill this form in my signed-in account | 0.9441 / route mcp-aside-devtools | 0.9441 | route mcp-aside-devtools | PASS |
| MBU-R-03 | mode | use bladebro to attach to my open browser and finish the checkout flow | 0.9295 / route mcp-bladebro | 0.9295 | route mcp-bladebro | PASS |
| MBU-T-01 | tie-break | replay this signed-in checkout step by step and save the evidence | 0.8482 / route mcp-aside-devtools | 0.8482 | route mcp-aside-devtools | PASS |
| MBU-T-02 | tie-break | in the browser I already have open, work out how to finish this signup | 0.8525 / route mcp-bladebro | 0.8525 | route mcp-bladebro | PASS |
| MBU-T-03 | tie-break | export a HAR of this page load | 0.8764 / route mcp-chrome-devtools | 0.8764 | route mcp-chrome-devtools | PASS |
| MBU-P-01 | paraphrase | fill out the form in my signed-in account | 0.9161 / route mcp-aside-devtools | 0.9161 | route mcp-aside-devtools | PASS |
| MBU-P-02 | paraphrase | replay the signed-in login flow and keep the evidence | 0.8368 / route mcp-aside-devtools | 0.8368 | route mcp-aside-devtools | PASS |
| MBU-P-03 | paraphrase | browse this site without getting flagged as a bot | 0.8751 / route mcp-bladebro | 0.8751 | route mcp-bladebro | PASS |
| MBU-P-04 | paraphrase | in my already open browser, figure out how to finish the order | 0.8525 / route mcp-bladebro | 0.8525 | route mcp-bladebro | PASS |
| MBU-P-05 | paraphrase | save the network log of this page as a har file | 0.9161 / route mcp-chrome-devtools | 0.9161 | route mcp-chrome-devtools | PASS |
| MBU-P-06 | paraphrase | run lighthouse on the staging page | 0.8665 / route mcp-chrome-devtools | 0.8665 | route mcp-chrome-devtools | PASS |
| MBU-P-07 | paraphrase | record a performance trace of the page load in chrome | 0.95 / route mcp-chrome-devtools | 0.95 | route mcp-chrome-devtools | PASS |
| MBU-P-08 | paraphrase | attach to my own chrome and inspect the signed-in dashboard | 0.8947 / route mcp-chrome-devtools | 0.8947 | route mcp-chrome-devtools | PASS |
| MBU-P-09 | paraphrase | use bladebro status to check the daemon | 0.8661 / route mcp-bladebro | 0.8661 | route mcp-bladebro | PASS |
| MBU-N-01 | negative | as an aside, can you tidy this paragraph | 0 / defer | 0 | defer | PASS |
| MBU-N-02 | negative | set that aside and fix the failing unit test first | 0 / defer | 0 | defer | PASS |
| MBU-N-03 | negative | convert this ruby rb file to python | 0 / defer | 0 | defer | PASS |
| MBU-N-04 | negative | write a lighthouse keeper short story | 0 / defer | 0 | defer | PASS |
| MBU-N-05 | negative | click through rate dropped, analyse the csv | 0 / defer | 0 | defer | PASS |
| MBU-N-06 | negative | make the checkout flow stealthier in the copy, less salesy | 0 / defer | 0 | defer | PASS |
| MBU-N-07 | negative | summarise the performance trace review notes in the spec | 0 / defer | 0 | defer | PASS |
| MBU-N-08 | negative | export a har file parser in typescript | 0 / defer | 0 | defer | PASS |
| MBU-N-09 | negative | set that aside and fix the failing unit test | 0 / defer | 0 | defer | PASS |
| MBU-N-10 | negative-rb | rb status of the ruby build | 0 / defer | 0 | defer | PASS |
| MBU-N-11 | negative-rb | check rb attach logs in the deploy | 0 / defer | 0 | defer | PASS |
| MBU-P-10 | paraphrase | run aside on the pricing page | 0.8665 / route mcp-aside-devtools | 0.8665 | route mcp-aside-devtools | PASS |
| MBU-P-11 | paraphrase | open aside and log in | 0.9019 / route mcp-aside-devtools | 0.9019 | route mcp-aside-devtools | PASS |
| MBU-P-12 | paraphrase | run a lighthouse audit on the homepage | 0.95 / route mcp-chrome-devtools | 0.95 | route mcp-chrome-devtools | PASS |
| MBU-P-13 | paraphrase | check bladebro rb status | 0.9116 / route mcp-bladebro | 0.9116 | route mcp-bladebro | PASS |
| MBU-P-14 | paraphrase | export a HAR of the checkout page | 0.8764 / route mcp-chrome-devtools | 0.8764 | route mcp-chrome-devtools | PASS |
| MBU-P-15 | paraphrase | attach to the browser i have open and finish the signup | 0.8588 / route mcp-bladebro | 0.8588 | route mcp-bladebro | PASS |
| MBU-P-16 | paraphrase | replay the signed-in checkout and keep the proof | 0.8527 / route mcp-aside-devtools | 0.8527 | route mcp-aside-devtools | PASS |
| MBU-PB-01 | playbook | Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging. | 0.95 / route mcp-chrome-devtools | 0.95 | route mcp-chrome-devtools | PASS |
| MBU-PB-02 | playbook | Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget. | 0.95 / route mcp-aside-devtools | 0.95 | route mcp-aside-devtools | PASS |
| MBU-PB-03 | playbook | Use Bladebro to read example.com in stealth mode and click the Learn more link. | 0.8333 / route mcp-bladebro | 0.8332 | route mcp-bladebro | PASS |
| MBU-PB-04 | playbook | The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause. | 0 / route mcp-chrome-devtools | 0 | route mcp-chrome-devtools | FAIL |
| MBU-PB-05 | playbook | Run a Lighthouse audit on the staging homepage and report the performance score. | 0.9275 / route mcp-chrome-devtools | 0.9275 | route mcp-chrome-devtools | PASS |
| MBU-PB-06 | playbook-defer | Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes. | 0.82 / defer | 0.82 | defer | PASS |
| MBU-PB-07 | playbook-defer | Use the MCP tool bridge for this. | 0 / defer | 0 | defer | PASS |
| MBU-N-12 | negative | use aside comments to explain the tradeoff in the doc | 0 / route mcp-aside-devtools | 0 | route mcp-aside-devtools | PASS |
| MBU-N-13 | negative | write a report on the lighthouse score methodology for the blog | 0 / defer | 0 | defer | PASS |
| MBU-N-14 | negative | parse the network har of this page in a python script | 0 / defer | 0 | defer | PASS |
| MBU-N-15 | negative | my emails got flagged as a bot by the spam filter, fix the smtp headers | 0 / defer | 0 | defer | PASS |
| MBU-N-16 | negative | update the form in my signed-in account settings component in react | 0 / defer | 0 | defer | PASS |
| MBU-N-17 | negative | add a performance trace of the sql queries to the server logs | 0 / defer | 0 | defer | PASS |
| MBU-N-18 | negative | the browser i have open is slow, which extensions should i remove | 0 / defer | 0 | defer | PASS |
| MBU-F-01 | contract | attach to my own chrome and finish the checkout | 0.8588 / route mcp-chrome-devtools | 0.8588 | route mcp-chrome-devtools | PASS |
| MBU-N-19 | negative | fix the code in the parser | 0 / defer | 0 | defer | PASS |
| MBU-N-20 | negative | fix the config loader that reads the wrong settings file in staging | 0 / defer | 0 | defer | PASS |
| MBU-B-01 | bundle | use mcp-chrome-devtools, mcp-aside-devtools and mcp-bladebro | 0.9464 / route mcp-chrome-devtools | 0.9464 | route mcp-chrome-devtools+mcp-aside-devtools+mcp-bladebro | PASS |
| MBU-B-02 | bundle | use mcp-chrome-devtools and bladebro | not captured | 0.95 | route mcp-chrome-devtools+mcp-bladebro | PASS |
| MBU-B-03 | bundle | use mcp-bladebro and aside browser | not captured | 0.95 | route mcp-aside-devtools+mcp-bladebro | PASS |
| MBU-P-17 | paraphrase | open it in aside | not captured | 0.8491 | route mcp-aside-devtools | PASS |
| MBU-B-04 | bundle | check the pricing page in aside and in chrome devtools | not captured | 0.95 | route mcp-chrome-devtools+mcp-aside-devtools | PASS |
| MBU-F-02 | contract | attach to my own chrome, the browser i already have open, and finish the checkout | 0.8841 / route mcp-chrome-devtools | 0.8841 | route mcp-chrome-devtools+mcp-bladebro | PASS |

---

## 4. KNOWN LIMITATIONS

- MBU-PB-04 still gets no advisor recommendation. The front door routes it to Chrome DevTools.
- `in aside` also matches ungrammatical prose such as "put this in aside notes", which routes to Aside at stage two. Normal English says "in an aside", which does not match.

---

## 5. FILES

| File | Holds |
|---|---|
| [`results.csv`](./results.csv) | One row per scenario |
| [`skill-benchmark-report.json`](./skill-benchmark-report.json) | The machine record |
| [`source.md`](./source.md) | How the run was made |
