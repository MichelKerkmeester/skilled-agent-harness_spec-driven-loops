---
title: Deep Review Strategy - mcp-browser-use hub epic
description: Runtime strategy file for the vibe-1 fan-out lineage reviewing the mcp-browser-use hub epic.
trigger_phrases:
  - "deep review strategy"
  - "review dimension tracking"
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC

Review of `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder target): the
mcp-browser-use hub that routes Bladebro, Aside and Chrome DevTools browser modes through
both advisor stages. Operator review focus: every phase's shipped work against its goal
criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-litigating the frozen decisions D1-D8 in `goal.md`; they are amendments, not findings.
- Reviewing `mcp-tooling`'s six other modes beyond the pointer and id-residue criteria.
- Running the repository's build, test or validation tooling; findings come from reading source.
- Implementing fixes. This lineage reports only.

---

## 5. STOP CONDITIONS

- Convergence: weighted new-finding ratio under 0.10 with every dimension covered.
- `maxIterations` 7 reached.
- Three consecutive failed iterations.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Comparing an authored registry against its generated projection: reading `hub-router.json` `vocabularyClasses` beside `graph-metadata.json` `intent_signals_generated` exposed the Core Web Vitals contradiction that neither file shows alone (iteration 1)
- Parsing the `ROUTER.md` `INTENT_SIGNALS` block and diffing it set-wise against the `hub-router.json` class unions: proved the stage-two split is faithful at 38/21/19 keywords with no drift (iteration 1)
- Resolving every `leaf-manifest.json` leaf and every `RESOURCE_MAP` path on disk in one pass: cheap, and it turns a prose promise into a checked fact (iteration 1)
- Reading a troubleshooting block's diagnosis line against its own solution line: the Node 20 diagnosis beside the `nvm install 18` fix is invisible unless the two lines are read together (iteration 2)
- Grepping the fixed defect class fleet-wide after reading the fix: `curl | bash` and `..` guards were checked at every install and capture site, not only where phase 015 touched them (iteration 2)
- Running the reach a P1 names instead of arguing it: the live advisor returned `sk-code` for the Core Web Vitals prompt, which is what turned a P1 into a P2 with evidence rather than opinion (iteration 3)
- Running the goal's own named checker (`parent-skill-check.cjs`) rather than a proxy: it exits 0 and its `13a-version` row also proved no gate reads a README version (iteration 3)
- Diffing a release index against the changelog directory it indexes (`ls changelog/` against `grep -n "changelog/v" README.md`) instead of reading the README alone: the two-row gap is invisible from either side by itself (iteration 4)
- Sweeping a version pin fleet-wide with `rg -o` before calling drift: `browser-debugger-cli@0.6.10` and `Aside 1.26.626` each came back single-valued, which retired two suspected findings in one call (iteration 4)
- Compiling the router from source and replaying the fixture in memory (`loadSnapshot` + `evaluateRoute`) instead of running the harness: it exercises the shipped behaviour without writing outside the lineage, and 16 of 16 cases passed (iteration 5)
- Probing the vocabulary with prompts the fixture does not cover: the sixteen canary cases all pass, and the two prose prompts that fail are the ones no case writes, which is how the gap surfaced (iteration 5)
- Running the advisor's own probe prompts rather than trusting its changelog: eleven calls reproduced every 2.0.3.0 claim, including the disclosed 0.45 anchor limitation (iteration 5)
- Diffing a runtime mirror against its canonical tree with `diff -rq` instead of spot-reading files: one call settled both mirrors at 312 files each with no differences (iteration 6)
- Resolving every relative markdown link in the four hub docs programmatically: 29 links, 0 broken, which is cheaper and stronger than reading the link tables (iteration 6)
- Set-diffing the advisor metadata against the router vocabulary before calling drift: the six advisor-only signals turned out to be the documented discovery path, so the check retired a suspected finding instead of raising one (iteration 6)
- Comparing a control that exists in code against the docs that describe the same script: `rg -n "digest|sha256"` over the Aside packet returned only `scripts/install.sh`, which is how the undocumented digest gate surfaced (iteration 7)
- Sweeping a finding's defect pattern fleet-wide before accepting its recorded scope: the `nvm install 18` pattern appears at exactly two lines, so `R2-P1-001` stayed one block instead of widening (iteration 7)
- Re-reading every active finding at its shipped file:line in one pass before synthesis: all six were still active, so the verdict did not move (iteration 7)

---

## 9. WHAT FAILED

- Reading `leaf-scopes.json` and `leaf-manifest.config.json` absence as defects before checking the class contract: both are correct for a hub, and the detour cost two tool calls (iteration 1)
- Treating `chrome-devtools-mcp@latest` as an unpinned supply-chain hole before reading `assets/utcp-chrome-devtools-manuals.md:53`, which already discloses it: one wasted read (iteration 2)
- Writing `Review verdict: PASS` on iteration 3 before checking the active set: an active P1 from iteration 2 still forced CONDITIONAL, and the line had to be corrected (iteration 3)
- Reading the Bladebro `v4.8.3` hits as pin drift before opening the transcript: all five are honest recording inside the recorded run, and the read was wasted (iteration 4)
- Reading the Aside pin with the pattern `Aside [0-9.]+`, which matched only the `1.26.626` prefix and made a single-valued pin look like it had two forms: the four-part form `1.26.626.1517` is the only one in the packet (iteration 5)
- Trusting the canary fixture as coverage: all sixteen cases pass, so a green fixture says nothing about the prose forms it never writes (iteration 5)
- Reading `leaf-manifest.json` leaves through a guessed `path` key: the leaves carry no such key, so the first resolution attempt printed seventeen `undefined` rows and the check had to be redone through the packet field (iteration 6)
- Matching holdout ids with `rg -o "H[0-9]{2}"`, which stripped the `MT-` prefix and made the index and the files look like they disagreed: they do not, both read `MT-H01` and `MT-H04` (iteration 6)
- Reading the Node 14 sites as drift before checking which packet they belong to: all seven are Bladebro launcher requirements, so the sweep cost a call to retire a non-finding (iteration 7)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "`bdg` or Aside version drift across the packet": ruled out, each pin is single-valued. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "`bdg` or Aside version drift across the packet": ruled out, each pin is single-valued.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`bdg` or Aside version drift across the packet": ruled out, each pin is single-valued.

### "`chrome-devtools-mcp@latest` is an unpinned supply-chain hole": ruled out as already disclosed at `assets/utcp-chrome-devtools-manuals.md:53`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "`chrome-devtools-mcp@latest` is an unpinned supply-chain hole": ruled out as already disclosed at `assets/utcp-chrome-devtools-manuals.md:53`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`chrome-devtools-mcp@latest` is an unpinned supply-chain hole": ruled out as already disclosed at `assets/utcp-chrome-devtools-manuals.md:53`.

### "`leaf-scopes.json` is missing two modes": ruled out by the optional-per-mode contract and the two docs that state the Chrome-only scope. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "`leaf-scopes.json` is missing two modes": ruled out by the optional-per-mode contract and the two docs that state the Chrome-only scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`leaf-scopes.json` is missing two modes": ruled out by the optional-per-mode contract and the two docs that state the Chrome-only scope.

### "`mcp-tooling` still carries a browser mode": ruled out, six modes and no browser id in any of its five named files. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "`mcp-tooling` still carries a browser mode": ruled out, six modes and no browser id in any of its five named files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`mcp-tooling` still carries a browser mode": ruled out, six modes and no browser id in any of its five named files.

### "`R1-P2-001` and `R4-P2-001` are independent defects": not ruled out as defects, but ruled out as independent workstreams -- both are the README release surface and one edit fixes both. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "`R1-P2-001` and `R4-P2-001` are independent defects": not ruled out as defects, but ruled out as independent workstreams -- both are the README release surface and one edit fixes both.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`R1-P2-001` and `R4-P2-001` are independent defects": not ruled out as defects, but ruled out as independent workstreams -- both are the README release surface and one edit fixes both.

### "`R2-P1-001` widens to the whole hub": ruled out, the `nvm install 18` pattern appears at exactly two lines, both inside the one Chrome troubleshooting block. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "`R2-P1-001` widens to the whole hub": ruled out, the `nvm install 18` pattern appears at exactly two lines, both inside the one Chrome troubleshooting block.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`R2-P1-001` widens to the whole hub": ruled out, the `nvm install 18` pattern appears at exactly two lines, both inside the one Chrome troubleshooting block.

### "A feature-catalog claim names a command that does not exist": ruled out for all seven Bladebro commands checked. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "A feature-catalog claim names a command that does not exist": ruled out for all seven Bladebro commands checked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A feature-catalog claim names a command that does not exist": ruled out for all seven Bladebro commands checked.

### "Bladebro version drift between v4.8.2 and v4.8.3": ruled out, every `v4.8.3` occurrence is inside the recorded run transcript that says the run stayed on the pin. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "Bladebro version drift between v4.8.2 and v4.8.3": ruled out, every `v4.8.3` occurrence is inside the recorded run transcript that says the run stayed on the pin.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Bladebro version drift between v4.8.2 and v4.8.3": ruled out, every `v4.8.3` occurrence is inside the recorded run transcript that says the run stayed on the pin.

### "Discovery vocabulary fans out to every mode": ruled out by `registry-compiler.cjs:97-110` plus the `generic-browser-automation-defer` and `hub-identity-defer` canary cases. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "Discovery vocabulary fans out to every mode": ruled out by `registry-compiler.cjs:97-110` plus the `generic-browser-automation-defer` and `hub-identity-defer` canary cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Discovery vocabulary fans out to every mode": ruled out by `registry-compiler.cjs:97-110` plus the `generic-browser-automation-defer` and `hub-identity-defer` canary cases.

### "The advisor 2.0.3.0 changelog overstates its staging claim": ruled out, the four phrases live in `explicit.ts:110-113`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The advisor 2.0.3.0 changelog overstates its staging claim": ruled out, the four phrases live in `explicit.ts:110-113`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The advisor 2.0.3.0 changelog overstates its staging claim": ruled out, the four phrases live in `explicit.ts:110-113`.

### "The advisor 2.0.3.0 changelog overstates the id-noun change": ruled out, all five probe prompts and the doctor control row behave as the changelog states. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The advisor 2.0.3.0 changelog overstates the id-noun change": ruled out, all five probe prompts and the doctor control row behave as the changelog states.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The advisor 2.0.3.0 changelog overstates the id-noun change": ruled out, all five probe prompts and the doctor control row behave as the changelog states.

### "The advisor 2.0.3.0 changelog overstates the staging change": ruled out, bare `staging` returns nothing and the four qualified forms each return the hub at 0.82. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The advisor 2.0.3.0 changelog overstates the staging change": ruled out, bare `staging` returns nothing and the four qualified forms each return the hub at 0.82.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The advisor 2.0.3.0 changelog overstates the staging change": ruled out, bare `staging` returns nothing and the four qualified forms each return the hub at 0.82.

### "The Aside capture example still accepts `./tmp/../..`": ruled out, `repl-evidence-capture.sh:35-45` rejects any `..` before the prefix check. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The Aside capture example still accepts `./tmp/../..`": ruled out, `repl-evidence-capture.sh:35-45` rejects any `..` before the prefix check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Aside capture example still accepts `./tmp/../..`": ruled out, `repl-evidence-capture.sh:35-45` rejects any `..` before the prefix check.

### "The Aside installer still pipes a download into bash": ruled out, `mcp-aside-devtools/scripts/install.sh:88-99` verifies the digest first. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The Aside installer still pipes a download into bash": ruled out, `mcp-aside-devtools/scripts/install.sh:88-99` verifies the digest first.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Aside installer still pipes a download into bash": ruled out, `mcp-aside-devtools/scripts/install.sh:88-99` verifies the digest first.

### "The Aside packet recommends an ungated install without operator consent": ruled out, every install site frames it as an explicit operator decision; the defect is the undisclosed digest control, not the consent gate. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The Aside packet recommends an ungated install without operator consent": ruled out, every install site frames it as an explicit operator decision; the defect is the undisclosed digest control, not the consent gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Aside packet recommends an ungated install without operator consent": ruled out, every install site frames it as an explicit operator decision; the defect is the undisclosed digest control, not the consent gate.

### "The Aside parity scenario overclaims console or network capture": ruled out, the scenario records the `page.on` throw and fails a verdict that claims a native tool or HAR export. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The Aside parity scenario overclaims console or network capture": ruled out, the scenario records the `page.on` throw and fails a verdict that claims a native tool or HAR export.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Aside parity scenario overclaims console or network capture": ruled out, the scenario records the `page.on` throw and fails a verdict that claims a native tool or HAR export.

### "The Aside version pin has two forms": ruled out, `1.26.626.1517` is single-valued across the hub; the earlier two-form reading was a truncated sweep pattern. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The Aside version pin has two forms": ruled out, `1.26.626.1517` is single-valued across the hub; the earlier two-form reading was a truncated sweep pattern.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Aside version pin has two forms": ruled out, `1.26.626.1517` is single-valued across the hub; the earlier two-form reading was a truncated sweep pattern.

### "The Bladebro installer has the same undisclosed-control gap": ruled out, `INSTALL-GUIDE.md:69` and `references/install-and-verify.md:39` both state the Node prerequisite, and iteration 2 verified the digest ordering. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The Bladebro installer has the same undisclosed-control gap": ruled out, `INSTALL-GUIDE.md:69` and `references/install-and-verify.md:39` both state the Node prerequisite, and iteration 2 verified the digest ordering.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Bladebro installer has the same undisclosed-control gap": ruled out, `INSTALL-GUIDE.md:69` and `references/install-and-verify.md:39` both state the Node prerequisite, and iteration 2 verified the digest ordering.

### "The Bladebro installer runs installed code before verifying it": ruled out, `mcp-bladebro/scripts/install.sh:166-176` orders the three digest checks before the first `--version`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The Bladebro installer runs installed code before verifying it": ruled out, `mcp-bladebro/scripts/install.sh:166-176` orders the three digest checks before the first `--version`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Bladebro installer runs installed code before verifying it": ruled out, `mcp-bladebro/scripts/install.sh:166-176` orders the three digest checks before the first `--version`.

### "The compiled router rejects on the word `forbidden` in a prompt": ruled out by `router.cjs:107-110`, which reads only `input.constraints`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The compiled router rejects on the word `forbidden` in a prompt": ruled out by `router.cjs:107-110`, which reads only `input.constraints`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The compiled router rejects on the word `forbidden` in a prompt": ruled out by `router.cjs:107-110`, which reads only `input.constraints`.

### "The Core Web Vitals contradiction is a routing defect": ruled out by the live advisor run, which returns `sk-code` for that prompt. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The Core Web Vitals contradiction is a routing defect": ruled out by the live advisor run, which returns `sk-code` for that prompt.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Core Web Vitals contradiction is a routing defect": ruled out by the live advisor run, which returns `sk-code` for that prompt.

### "The disclosed 0.45 lexical-anchor limitation is worse than disclosed": ruled out, `fix the container orchestration config` lifts exactly the three skills the changelog names, at exactly the 0.82 floor it names. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The disclosed 0.45 lexical-anchor limitation is worse than disclosed": ruled out, `fix the container orchestration config` lifts exactly the three skills the changelog names, at exactly the 0.82 floor it names.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The disclosed 0.45 lexical-anchor limitation is worse than disclosed": ruled out, `fix the container orchestration config` lifts exactly the three skills the changelog names, at exactly the 0.82 floor it names.

### "The eight router-only keywords are missing from the advisor metadata": ruled out for the same reason in the other direction. `mcp-browser-use`, `mode-registry` and `hub-router` are hub identity, which the canary case `hub-identity-defer` requires to defer; `browser automation`, `automate the browser` and `web browser` are the generic class the hub must not score. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The eight router-only keywords are missing from the advisor metadata": ruled out for the same reason in the other direction. `mcp-browser-use`, `mode-registry` and `hub-router` are hub identity, which the canary case `hub-identity-defer` requires to defer; `browser automation`, `automate the browser` and `web browser` are the generic class the hub must not score.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The eight router-only keywords are missing from the advisor metadata": ruled out for the same reason in the other direction. `mcp-browser-use`, `mode-registry` and `hub-router` are hub identity, which the canary case `hub-identity-defer` requires to defer; `browser automation`, `automate the browser` and `web browser` are the generic class the hub must not score.

### "The hub capability matrix still advertises Aside `page.on` events": ruled out, the row now states the gap and no `page.on` remains in the hub `SKILL.md`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The hub capability matrix still advertises Aside `page.on` events": ruled out, the row now states the gap and no `page.on` remains in the hub `SKILL.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The hub capability matrix still advertises Aside `page.on` events": ruled out, the row now states the gap and no `page.on` remains in the hub `SKILL.md`.

### "The hub carries a second advisor identity for a mode": ruled out by `graph-metadata.json` `siblings: []` and the single `skill_id`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The hub carries a second advisor identity for a mode": ruled out by `graph-metadata.json` `siblings: []` and the single `skill_id`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The hub carries a second advisor identity for a mode": ruled out by `graph-metadata.json` `siblings: []` and the single `skill_id`.

### "The hub playbook index is missing a scenario": ruled out, the index and the files carry the same seven MT ids. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The hub playbook index is missing a scenario": ruled out, the index and the files carry the same seven MT ids.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The hub playbook index is missing a scenario": ruled out, the index and the files carry the same seven MT ids.

### "The hub promises an agent or slash command it does not ship": ruled out, `command: null` on every mode entry and stated as the contract. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The hub promises an agent or slash command it does not ship": ruled out, `command: null` on every mode entry and stated as the contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The hub promises an agent or slash command it does not ship": ruled out, `command: null` on every mode entry and stated as the contract.

### "The hub README version is consistent with the rest of the metadata": not ruled out -- `README.md:8` still reads `1.1.4.0` against `1.1.3.0` in `SKILL.md`, `hub-router.json`, `mode-registry.json` and `description.json`. This is the carried P2 `R1-P2-001`, re-confirmed active this iteration. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The hub README version is consistent with the rest of the metadata": not ruled out -- `README.md:8` still reads `1.1.4.0` against `1.1.3.0` in `SKILL.md`, `hub-router.json`, `mode-registry.json` and `description.json`. This is the carried P2 `R1-P2-001`, re-confirmed active this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The hub README version is consistent with the rest of the metadata": not ruled out -- `README.md:8` still reads `1.1.4.0` against `1.1.3.0` in `SKILL.md`, `hub-router.json`, `mode-registry.json` and `description.json`. This is the carried P2 `R1-P2-001`, re-confirmed active this iteration.

### "The near-tie rule over-bundles ordinary prompts": ruled out on the probes run, `take a screenshot with chrome devtools` and `use bladebro to screenshot this page` each return a single mode, and `run a lighthouse audit and then replay it in aside` returns single Chrome DevTools because the Lighthouse class scores 8 against Aside's 0. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The near-tie rule over-bundles ordinary prompts": ruled out on the probes run, `take a screenshot with chrome devtools` and `use bladebro to screenshot this page` each return a single mode, and `run a lighthouse audit and then replay it in aside` returns single Chrome DevTools because the Lighthouse class scores 8 against Aside's 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The near-tie rule over-bundles ordinary prompts": ruled out on the probes run, `take a screenshot with chrome devtools` and `use bladebro to screenshot this page` each return a single mode, and `run a lighthouse audit and then replay it in aside` returns single Chrome DevTools because the Lighthouse class scores 8 against Aside's 0.

### "The Node 14 and Node 20 requirements contradict each other across the hub": ruled out, they belong to different packets with different launchers, and each is stated consistently inside its own packet. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The Node 14 and Node 20 requirements contradict each other across the hub": ruled out, they belong to different packets with different launchers, and each is stated consistently inside its own packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Node 14 and Node 20 requirements contradict each other across the hub": ruled out, they belong to different packets with different launchers, and each is stated consistently inside its own packet.

### "The phase 015 three-mode bundle fix does not work": ruled out, the id-form prompt returns all three modes and the canary case passes. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The phase 015 three-mode bundle fix does not work": ruled out, the id-form prompt returns all three modes and the canary case passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The phase 015 three-mode bundle fix does not work": ruled out, the id-form prompt returns all three modes and the canary case passes.

### "The playbook index and the scenario files disagree on ids": ruled out, all seven ids match including `MT-H01` and `MT-H04`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The playbook index and the scenario files disagree on ids": ruled out, all seven ids match including `MT-H01` and `MT-H04`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The playbook index and the scenario files disagree on ids": ruled out, all seven ids match including `MT-H01` and `MT-H04`.

### "The README verification section names a stale checker": ruled out, `parent-skill-check.cjs` exists and passed in iteration 3. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The README verification section names a stale checker": ruled out, `parent-skill-check.cjs` exists and passed in iteration 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The README verification section names a stale checker": ruled out, `parent-skill-check.cjs` exists and passed in iteration 3.

### "The run has converged to a pass": ruled out, two P1 findings remain active, so the verdict stays CONDITIONAL. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The run has converged to a pass": ruled out, two P1 findings remain active, so the verdict stays CONDITIONAL.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The run has converged to a pass": ruled out, two P1 findings remain active, so the verdict stays CONDITIONAL.

### "The runtime mirrors have drifted from canonical": ruled out, `diff -rq` returns no output for either skill. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The runtime mirrors have drifted from canonical": ruled out, `diff -rq` returns no output for either skill.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The runtime mirrors have drifted from canonical": ruled out, `diff -rq` returns no output for either skill.

### "The six advisor-only intent signals are stage-one/stage-two drift": ruled out. `hub-router.json` `routerPolicy.discoveryClassesContract` states that discovery classes are hub discovery and defer evidence only, and `ROUTER.md:30` says a bare agentic request belongs to neither Aside nor Bladebro. The advisor brings a generic browser request to the hub so the hub can ask which mode the reader means, which is the documented purpose of the `defer` outcome. The four probes that defer are the design working, not failing. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The six advisor-only intent signals are stage-one/stage-two drift": ruled out. `hub-router.json` `routerPolicy.discoveryClassesContract` states that discovery classes are hub discovery and defer evidence only, and `ROUTER.md:30` says a bare agentic request belongs to neither Aside nor Bladebro. The advisor brings a generic browser request to the hub so the hub can ask which mode the reader means, which is the documented purpose of the `defer` outcome. The four probes that defer are the design working, not failing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The six advisor-only intent signals are stage-one/stage-two drift": ruled out. `hub-router.json` `routerPolicy.discoveryClassesContract` states that discovery classes are hub discovery and defer evidence only, and `ROUTER.md:30` says a bare agentic request belongs to neither Aside nor Bladebro. The advisor brings a generic browser request to the hub so the hub can ask which mode the reader means, which is the documented purpose of the `defer` outcome. The four probes that defer are the design working, not failing.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Compiled router rejecting on the word `forbidden` in prompt text: ruled out, `router.cjs:107-110` reads only `input.constraints` (iteration 1, evidence: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:107`)
- Discovery vocabulary fanning out to every mode: ruled out, `registry-compiler.cjs:97-110` copies only `routerSignals`-referenced classes (iteration 1, evidence: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:97`)
- `leaf-scopes.json` missing two modes: ruled out, the file is optional and per-mode by contract (iteration 1, evidence: `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:90`)
- `leaf-manifest.config.json` absent from the hub: ruled out, the file is forbidden for class H (iteration 1, evidence: `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:71`)
- Aside installer still piping a download into bash: ruled out, the digest gate precedes execution (iteration 2, evidence: `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:94`)
- Aside capture example still accepting `./tmp/../..`: ruled out, any `..` is rejected before the prefix check (iteration 2, evidence: `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:35`)
- `chrome-devtools-mcp@latest` as an unpinned supply-chain hole: ruled out as already disclosed (iteration 2, evidence: `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md:53`)
- Bladebro installer running installed code before verifying it: ruled out, the three digest checks precede the first `--version` (iteration 2, evidence: `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:166`)
- Advisor 2.0.3.0 changelog overstating its staging claim: ruled out, the four phrases live in the advisor explicit lane (iteration 3, evidence: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:110`)
- Hub playbook index missing a scenario: ruled out, index and files carry the same seven MT ids (iteration 3, evidence: `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md:1`)
- `mcp-tooling` still carrying a browser mode: ruled out, six modes and no browser id in its five named files (iteration 3, evidence: `.skilled/skills/mcp-tooling/mode-registry.json:1`)
- Core Web Vitals contradiction as a routing defect: ruled out by the live advisor run (iteration 3, evidence: `.skilled/skills/mcp-browser-use/ROUTER.md:33`)
- Bladebro pin drift between v4.8.2 and v4.8.3: ruled out, every `v4.8.3` occurrence is inside the recorded macOS run transcript that states the run stayed on the pin (iteration 4, evidence: `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md:341`)
- `bdg` or Aside pin drift across the packet: ruled out, each pin is single-valued at `browser-debugger-cli@0.6.10` and `Aside 1.26.626` (iteration 4, evidence: `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/README.md:21`)
- README verification section naming a stale checker: ruled out, `parent-skill-check.cjs` exists and exits 0 (iteration 4)
- The phase 015 three-mode bundle fix not working: ruled out, the id-form prompt returns all three modes and all sixteen canary cases pass (iteration 5, evidence: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:96`)
- The advisor 2.0.3.0 changelog overstating the id-noun or staging change: ruled out, eleven live probes reproduce every claim including the disclosed 0.45 anchor limitation (iteration 5, evidence: `.skilled/skills/system-skill-advisor/changelog/v2.0.3.0.md:1`)
- The hub capability matrix still advertising Aside `page.on` events: ruled out, no `page.on` remains in the hub `SKILL.md` and the row states the gap (iteration 5, evidence: `.skilled/skills/mcp-browser-use/SKILL.md:40`)
- The Aside version pin having two forms: ruled out, `1.26.626.1517` is single-valued across the hub (iteration 5)
- The near-tie rule over-bundling ordinary prompts: ruled out, single-mode probes return a single mode and the Lighthouse class outscores Aside 8 to 0 (iteration 5)
- The six advisor-only intent signals being stage-one/stage-two drift: ruled out, `routerPolicy.discoveryClassesContract` documents discovery classes as defer evidence only, so the defer is the design working (iteration 6, evidence: `.skilled/skills/mcp-browser-use/hub-router.json:1`)
- The runtime mirrors having drifted from canonical: ruled out, `diff -rq` returns no output for either skill at 312 files each (iteration 6, evidence: `.claude/skills/mcp-browser-use/SKILL.md:5`)
- The hub promising an agent or slash command it does not ship: ruled out, `command: null` on all three mode entries and stated as the contract (iteration 6, evidence: `.skilled/skills/mcp-browser-use/mode-registry.json:15`)
- A feature-catalog claim naming a command that does not exist: ruled out, all seven Bladebro commands resolve to a documented site (iteration 6, evidence: `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md:34`)
- The playbook index and the scenario files disagreeing on ids: ruled out, all seven ids match including `MT-H01` and `MT-H04` (iteration 6)
- The Aside parity scenario overclaiming console or network capture: ruled out, the scenario records the `page.on` throw and fails an overclaiming verdict (iteration 6, evidence: `.skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook/devtools-parity/console-network-capture.md:33`)
- The Node 14 and Node 20 requirements contradicting each other across the hub: ruled out, they belong to different packets with different launchers and each is consistent inside its own packet (iteration 7)
- The Aside packet recommending an ungated install without operator consent: ruled out, every install site frames it as an explicit operator decision (iteration 7, evidence: `.skilled/skills/mcp-browser-use/mcp-aside-devtools/INSTALL-GUIDE.md:21`)
- The Bladebro installer having the same undisclosed-control gap: ruled out, its install guide and reference both state the Node prerequisite (iteration 7)
- `R2-P1-001` widening to the whole hub: ruled out, the `nvm install 18` pattern appears at exactly two lines inside one Chrome troubleshooting block (iteration 7)
- The run having converged to a pass: ruled out, two P1 findings remain active so the verdict stays CONDITIONAL (iteration 7)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis - Reason: iteration 7 of 7 is complete, every dimension has been covered at least once and the two that carried the most risk twice, and the last two iterations returned no new P1 or P0 - Rotation status: correctness twice, traceability twice, security once, maintainability once, cross-reference once; rotation complete - Blocked/productive carry-forward: productive -- the cross-reference pass found the one new P2 of this iteration by comparing a control that exists in code against the docs that never mention it - Required evidence: none for a further iteration; synthesis needs the six active findings, their merged workstreams, and the unverified criterion 7 Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/mcp-browser-use/` (hub: `SKILL.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `leaf-scopes.json`, `description.json`, `graph-metadata.json`, three mode folders `mcp-bladebro/`, `mcp-aside-devtools/`, `mcp-chrome-devtools/`, `manual-testing-playbook/`, `benchmark/`, `changelog/`); `.skilled/skills/mcp-tooling/` (six-mode sibling hub and its browser pointers); `.skilled/bin/lib/compiled-routing/` (compiled route engine, activation manifests, canary fixtures); the advisor scorer under `.skilled/bin/`; the packet's own phase docs `001-research` through `015-fix-follow-up-review-findings`.
- Behavior claims to verify: `goal.md` completion criteria 1-7; each phase's `goal.md` completion criteria; D2's CLI-first / MCP-via-Code-Mode fallback; D7's two-stage integration rule; the phase 015 criteria (three-mode bundle routing, five probe prompts not lifting unnamed skills, two-stage replay failing only MBU-PB-04, `validate.sh --strict --recursive` PASSED).
- Reuse and conventions: the hub pattern established by `mcp-tooling` (mode-registry + hub-router + leaf-manifest + leaf-scopes); the advisor's two-stage contract (stage one names the hub, stage two names the mode); the `sk-code` review doctrine for severity.
- Review risks and gaps: 522 scope files, most of them changelogs and benchmark reports; the packet's own `review/` tree is prior-run state, not a review target; `resource-map.md` is absent so the Resource Map Coverage Gate is skipped; the compiled route engine keeps the legacy sentinel for the new hub, so stage two is proven through `hub-router.json` rather than `compiled-route.cjs`.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | Criteria 1-6 verified against shipped evidence. Criterion 7 unverified: `validate.sh --recursive` is outside this lineage write surface |
| `checklist_evidence` | core | pass | 3 | Phase 015 criteria 1 and 2 both backed; the advisor 2.0.3.0 changelog's four claims each checked against a shipped surface |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated as iterations review files]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/mcp-browser-use/mode-registry.json` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/hub-router.json` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/leaf-manifest.json` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/leaf-scopes.json` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/ROUTER.md` | D1 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `.skilled/skills/mcp-browser-use/README.md` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/skills/mcp-browser-use/graph-metadata.json` | D1 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh` | D2 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh` | D2 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh` | D2 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md` | D2 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md` | D2 | 2 | 0 P0, 1 P1, 1 P2 | partial |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` | D3 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-tooling/mode-registry.json` | D3 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md` | D3 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/system-skill-advisor/changelog/v2.0.3.0.md` | D3 | 3 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-1-1795511024070-2cuwlj, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T09:04:58.187Z
<!-- MACHINE-OWNED: END -->
