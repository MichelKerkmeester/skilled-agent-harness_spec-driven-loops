# mcp-tooling manual-testing-playbook — compiled vs legacy verification

Generated: 2026-07-21T13:21:52.263Z

Total scenarios: 14 | PASS: 14 | FAIL: 0 | SKIP: 0

Compiled engine: `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` (flag unset -> DEFAULT_ON_HUBS cohort; mcp-tooling included)

Legacy engine: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`

| ID | Group | Expected mode | Compiled | Legacy | Resources match | Verdict | Notes |
|----|-------|----------------|----------|--------|------------------|---------|-------|
| MT-001 | primary | mcp-chrome-devtools | mcp-chrome-devtools | mcp-chrome-devtools | yes | PASS | compiled == expected == legacy; resources match; markers consistent |
| MT-002 | primary | mcp-click-up | mcp-click-up | mcp-click-up | yes | PASS | compiled == expected == legacy; resources match; markers consistent |
| MT-003 | primary | mcp-figma | mcp-figma | mcp-figma | yes | PASS | compiled == expected == legacy; resources match; markers consistent |
| MT-004 | primary | defer | defer | defer | yes | PASS | compiled == expected == legacy; resources match; markers consistent |
| MT-007 | primary | mcp-aside-devtools | mcp-aside-devtools | mcp-aside-devtools | yes | PASS | compiled == expected == legacy; resources match; markers consistent |
| MT-008 | primary | mcp-refero | mcp-refero | mcp-refero | yes | PASS | compiled == expected == legacy; resources match; markers consistent |
| MT-009 | primary | mcp-mobbin | mcp-mobbin | mcp-mobbin | yes | PASS | compiled == expected == legacy; resources match; markers consistent |
| MT-CR-001 | compiled-routing-primary | mcp-refero | mcp-refero | mcp-refero | yes | PASS | compiled == expected == legacy; resources match; markers consistent |
| MT-H01 | holdout | mcp-chrome-devtools | mcp-chrome-devtools | mcp-chrome-devtools | yes | PASS | compiled == expected == legacy; resources match; markers consistent |
| MT-H02 | holdout | mcp-figma | mcp-figma | mcp-figma | yes | PASS | compiled == expected == legacy; resources match; markers consistent |
| MT-H03 | holdout | mcp-click-up | mcp-click-up | mcp-click-up | yes | PASS | compiled == expected == legacy; resources match; markers consistent |
| MT-H04 | holdout | mcp-aside-devtools | mcp-aside-devtools | mcp-aside-devtools | yes | PASS | compiled == expected == legacy; resources match; markers consistent |
| MT-H05 | holdout | mcp-refero | mcp-refero | mcp-refero | yes | PASS | compiled == expected == legacy; resources match; markers consistent |
| MT-H06 | holdout | mcp-mobbin | mcp-mobbin | mcp-mobbin | yes | PASS | compiled == expected == legacy; resources match; markers consistent |

## Per-scenario detail

### MT-001 — hub-routing/chrome-devtools-browser-debug.md

**Prompt**: Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging.

**Expected workflowMode**: `mcp-chrome-devtools`  
**Expected resources**: `mcp-chrome-devtools/references/cdp-patterns.md`, `mcp-chrome-devtools/references/session-management.md`

**Signal**: chrome-devtools-aliases / browser-debug (Chrome DevTools, HAR capture)

**Compiled decision**: `{"hubId":"mcp-tooling","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-chrome-devtools","packetKind":"workflow","skillId":"mcp-tooling","workflowMode":"mcp-chrome-devtools"}],"effectivePolicyHash":"47ce771af7c0e300307581785849c9caa82644ffc2508e9159e2e9b7c90f794c","generation":4}`

**Legacy decision**: intents=`["mcp-chrome-devtools"]` matchedAliases=`["chrome devtools"]` resources=`["mcp-chrome-devtools/references/cdp-patterns.md","mcp-chrome-devtools/references/session-management.md"]`

**Verdict**: PASS — compiled == expected == legacy; resources match; markers consistent

### MT-002 — hub-routing/clickup-task-management.md

**Prompt**: Mark the ClickUp task done and add a note that it shipped.

**Expected workflowMode**: `mcp-click-up`  
**Expected resources**: `mcp-click-up/references/cupt-commands.md`, `mcp-click-up/references/mcp-tools.md`

**Signal**: clickup-aliases / task-management (ClickUp, mark done)

**Compiled decision**: `{"hubId":"mcp-tooling","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-click-up","packetKind":"workflow","skillId":"mcp-tooling","workflowMode":"mcp-click-up"}],"effectivePolicyHash":"47ce771af7c0e300307581785849c9caa82644ffc2508e9159e2e9b7c90f794c","generation":4}`

**Legacy decision**: intents=`["mcp-click-up"]` matchedAliases=`["clickup","clickup task"]` resources=`["mcp-click-up/references/cupt-commands.md","mcp-click-up/references/mcp-tools.md"]`

**Verdict**: PASS — compiled == expected == legacy; resources match; markers consistent

### MT-003 — hub-routing/figma-transport.md

**Prompt**: Render this component in Figma and export the design tokens.

**Expected workflowMode**: `mcp-figma`  
**Expected resources**: `mcp-figma/references/figma-cli-reference.md`, `mcp-figma/references/mcp-wiring.md`

**Signal**: figma-aliases / design-transport (Figma, render, export)

**Compiled decision**: `{"hubId":"mcp-tooling","action":"route","selectionKind":"single","targets":[{"backendKind":"figma-desktop-transport","packetId":"mcp-figma","packetKind":"transport","skillId":"mcp-tooling","workflowMode":"mcp-figma"}],"effectivePolicyHash":"47ce771af7c0e300307581785849c9caa82644ffc2508e9159e2e9b7c90f794c","generation":4}`

**Legacy decision**: intents=`["mcp-figma"]` matchedAliases=`["figma","design tokens"]` resources=`["mcp-figma/references/figma-cli-reference.md","mcp-figma/references/mcp-wiring.md"]`

**Verdict**: PASS — compiled == expected == legacy; resources match; markers consistent

### MT-004 — hub-routing/ambiguous-defer.md

**Prompt**: Use the MCP tool bridge for this.

**Expected workflowMode**: `defer`  
**Expected resources**: (none — defer, fallback-only contract)

**Signal**: hub-identity vocabulary only (discovery-only, scores no mode) -> defer, fallback-only contract

**Compiled decision**: `{"hubId":"mcp-tooling","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"47ce771af7c0e300307581785849c9caa82644ffc2508e9159e2e9b7c90f794c","generation":4}`

**Legacy decision**: intents=`[]` matchedAliases=`[]` resources=`[]`

**Verdict**: PASS — compiled == expected == legacy; resources match; markers consistent

### MT-007 — hub-routing/aside-browser-automation.md

**Prompt**: Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget.

**Expected workflowMode**: `mcp-aside-devtools`  
**Expected resources**: `mcp-aside-devtools/references/aside-cli-reference.md`, `mcp-aside-devtools/references/mcp-wiring.md`

**Signal**: aside-devtools-aliases / agentic-browser (Aside browser, REPL evidence)

**Compiled decision**: `{"hubId":"mcp-tooling","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-aside-devtools","packetKind":"workflow","skillId":"mcp-tooling","workflowMode":"mcp-aside-devtools"}],"effectivePolicyHash":"47ce771af7c0e300307581785849c9caa82644ffc2508e9159e2e9b7c90f794c","generation":4}`

**Legacy decision**: intents=`["mcp-aside-devtools"]` matchedAliases=`["aside","aside browser"]` resources=`["mcp-aside-devtools/references/aside-cli-reference.md","mcp-aside-devtools/references/mcp-wiring.md"]`

**Verdict**: PASS — compiled == expected == legacy; resources match; markers consistent

### MT-008 — hub-routing/refero-design-reference.md

**Prompt**: Search Refero for real-app checkout flow screens and pull style references for the redesign.

**Expected workflowMode**: `mcp-refero`  
**Expected resources**: `mcp-refero/references/tool-surface.md`, `mcp-refero/references/mcp-wiring.md`

**Signal**: refero-aliases / design-reference-research (Refero, real-app screens, style references)

**Compiled decision**: `{"hubId":"mcp-tooling","action":"route","selectionKind":"single","targets":[{"backendKind":"code-mode-remote-mcp","packetId":"mcp-refero","packetKind":"transport","skillId":"mcp-tooling","workflowMode":"mcp-refero"}],"effectivePolicyHash":"47ce771af7c0e300307581785849c9caa82644ffc2508e9159e2e9b7c90f794c","generation":4}`

**Legacy decision**: intents=`["mcp-refero"]` matchedAliases=`["refero"]` resources=`["mcp-refero/references/tool-surface.md","mcp-refero/references/mcp-wiring.md"]`

**Verdict**: PASS — compiled == expected == legacy; resources match; markers consistent

### MT-009 — hub-routing/mobbin-app-research.md

**Prompt**: Research onboarding flow patterns from real iOS apps on Mobbin and collect screen examples for the signup redesign.

**Expected workflowMode**: `mcp-mobbin`  
**Expected resources**: `mcp-mobbin/references/tool-surface.md`, `mcp-mobbin/references/mcp-wiring.md`

**Signal**: mobbin-aliases / app-design-research (Mobbin, real-app screens, onboarding flow patterns)

**Compiled decision**: `{"hubId":"mcp-tooling","action":"route","selectionKind":"single","targets":[{"backendKind":"code-mode-remote-mcp","packetId":"mcp-mobbin","packetKind":"transport","skillId":"mcp-tooling","workflowMode":"mcp-mobbin"}],"effectivePolicyHash":"47ce771af7c0e300307581785849c9caa82644ffc2508e9159e2e9b7c90f794c","generation":4}`

**Legacy decision**: intents=`["mcp-mobbin"]` matchedAliases=`["mobbin"]` resources=`["mcp-mobbin/references/tool-surface.md","mcp-mobbin/references/mcp-wiring.md"]`

**Verdict**: PASS — compiled == expected == legacy; resources match; markers consistent

### MT-CR-001 — compiled-routing/ordered-bundle-figma-refero-compiled-routing.md

**Prompt**: Pull real shipped-app UI references from Refero and Mobbin for this checkout screen.

**Expected workflowMode**: `mcp-refero`  
**Expected resources**: `mcp-refero/references/tool-surface.md`, `mcp-refero/references/mcp-wiring.md`

**Signal**: design-transport ordered-bundle family; refero leg (route_shape: orderedBundle); mobbin scores secondary but single dominant mode wins (selectionKind: single)

**Compiled decision**: `{"hubId":"mcp-tooling","action":"route","selectionKind":"single","targets":[{"backendKind":"code-mode-remote-mcp","packetId":"mcp-refero","packetKind":"transport","skillId":"mcp-tooling","workflowMode":"mcp-refero"}],"effectivePolicyHash":"47ce771af7c0e300307581785849c9caa82644ffc2508e9159e2e9b7c90f794c","generation":4}`

**Legacy decision**: intents=`["mcp-refero"]` matchedAliases=`["refero","ui reference"]` resources=`["mcp-refero/references/tool-surface.md","mcp-refero/references/mcp-wiring.md"]`

**Verdict**: PASS — compiled == expected == legacy; resources match; markers consistent

### MT-H01 — hub-routing/holdout-browser-inspect.md

**Prompt**: The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause.

**Expected workflowMode**: `mcp-chrome-devtools`  
**Expected resources**: `mcp-chrome-devtools/references/cdp-patterns.md`, `mcp-chrome-devtools/references/session-management.md`

**Signal**: blind holdout, chrome-vs-aside boundary case: developer-driven inspection primitives, no agentic vocabulary -> must stay mcp-chrome-devtools, not mcp-aside-devtools/defer

**Compiled decision**: `{"hubId":"mcp-tooling","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-chrome-devtools","packetKind":"workflow","skillId":"mcp-tooling","workflowMode":"mcp-chrome-devtools"}],"effectivePolicyHash":"47ce771af7c0e300307581785849c9caa82644ffc2508e9159e2e9b7c90f794c","generation":4}`

**Legacy decision**: intents=`["mcp-chrome-devtools"]` matchedAliases=`["network requests"]` resources=`["mcp-chrome-devtools/references/cdp-patterns.md","mcp-chrome-devtools/references/session-management.md"]`

**Verdict**: PASS — compiled == expected == legacy; resources match; markers consistent

### MT-H02 — hub-routing/holdout-design-tokens.md

**Prompt**: Pull the button component's colors and spacing values out of our shared design file and hand them to the build.

**Expected workflowMode**: `mcp-figma`  
**Expected resources**: `mcp-figma/references/figma-cli-reference.md`, `mcp-figma/references/mcp-wiring.md`

**Signal**: blind holdout, bound via blindException "design file"

**Compiled decision**: `{"hubId":"mcp-tooling","action":"route","selectionKind":"single","targets":[{"backendKind":"figma-desktop-transport","packetId":"mcp-figma","packetKind":"transport","skillId":"mcp-tooling","workflowMode":"mcp-figma"}],"effectivePolicyHash":"47ce771af7c0e300307581785849c9caa82644ffc2508e9159e2e9b7c90f794c","generation":4}`

**Legacy decision**: intents=`["mcp-figma"]` matchedAliases=`["design file"]` resources=`["mcp-figma/references/figma-cli-reference.md","mcp-figma/references/mcp-wiring.md"]`

**Verdict**: PASS — compiled == expected == legacy; resources match; markers consistent

### MT-H03 — hub-routing/holdout-task-tracking.md

**Prompt**: Close out yesterday's two open items in our project tracker, add a short note on what shipped, and log the hour I spent.

**Expected workflowMode**: `mcp-click-up`  
**Expected resources**: `mcp-click-up/references/cupt-commands.md`, `mcp-click-up/references/mcp-tools.md`

**Signal**: blind holdout, bound via blindException "project tracker"

**Compiled decision**: `{"hubId":"mcp-tooling","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-click-up","packetKind":"workflow","skillId":"mcp-tooling","workflowMode":"mcp-click-up"}],"effectivePolicyHash":"47ce771af7c0e300307581785849c9caa82644ffc2508e9159e2e9b7c90f794c","generation":4}`

**Legacy decision**: intents=`["mcp-click-up"]` matchedAliases=`["project tracker"]` resources=`["mcp-click-up/references/cupt-commands.md","mcp-click-up/references/mcp-tools.md"]`

**Verdict**: PASS — compiled == expected == legacy; resources match; markers consistent

### MT-H04 — hub-routing/holdout-agentic-browser.md

**Prompt**: Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes.

**Expected workflowMode**: `mcp-aside-devtools`  
**Expected resources**: `mcp-aside-devtools/references/aside-cli-reference.md`, `mcp-aside-devtools/references/mcp-wiring.md`

**Signal**: blind holdout, inverse of MT-H01 boundary; bound via blindExceptions "click through" / "on its own"

**Compiled decision**: `{"hubId":"mcp-tooling","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-aside-devtools","packetKind":"workflow","skillId":"mcp-tooling","workflowMode":"mcp-aside-devtools"}],"effectivePolicyHash":"47ce771af7c0e300307581785849c9caa82644ffc2508e9159e2e9b7c90f794c","generation":4}`

**Legacy decision**: intents=`["mcp-aside-devtools"]` matchedAliases=`["click through","on its own"]` resources=`["mcp-aside-devtools/references/aside-cli-reference.md","mcp-aside-devtools/references/mcp-wiring.md"]`

**Verdict**: PASS — compiled == expected == legacy; resources match; markers consistent

### MT-H05 — hub-routing/holdout-web-design-reference.md

**Prompt**: Show me how shipped web products design their checkout pages — concrete screenshots and the styles they use — so I can compare against our redesign.

**Expected workflowMode**: `mcp-refero`  
**Expected resources**: `mcp-refero/references/tool-surface.md`, `mcp-refero/references/mcp-wiring.md`

**Signal**: blind holdout, bound via blindException "web products"

**Compiled decision**: `{"hubId":"mcp-tooling","action":"route","selectionKind":"single","targets":[{"backendKind":"code-mode-remote-mcp","packetId":"mcp-refero","packetKind":"transport","skillId":"mcp-tooling","workflowMode":"mcp-refero"}],"effectivePolicyHash":"47ce771af7c0e300307581785849c9caa82644ffc2508e9159e2e9b7c90f794c","generation":4}`

**Legacy decision**: intents=`["mcp-refero"]` matchedAliases=`["web products"]` resources=`["mcp-refero/references/tool-surface.md","mcp-refero/references/mcp-wiring.md"]`

**Verdict**: PASS — compiled == expected == legacy; resources match; markers consistent

### MT-H06 — hub-routing/holdout-mobile-pattern-research.md

**Prompt**: Collect how popular phone apps welcome first-time users — real product walkthroughs, not mockups — so we can rework our signup.

**Expected workflowMode**: `mcp-mobbin`  
**Expected resources**: `mcp-mobbin/references/tool-surface.md`, `mcp-mobbin/references/mcp-wiring.md`

**Signal**: blind holdout, bound via blindException "phone apps"

**Compiled decision**: `{"hubId":"mcp-tooling","action":"route","selectionKind":"single","targets":[{"backendKind":"code-mode-remote-mcp","packetId":"mcp-mobbin","packetKind":"transport","skillId":"mcp-tooling","workflowMode":"mcp-mobbin"}],"effectivePolicyHash":"47ce771af7c0e300307581785849c9caa82644ffc2508e9159e2e9b7c90f794c","generation":4}`

**Legacy decision**: intents=`["mcp-mobbin"]` matchedAliases=`["phone apps"]` resources=`["mcp-mobbin/references/tool-surface.md","mcp-mobbin/references/mcp-wiring.md"]`

**Verdict**: PASS — compiled == expected == legacy; resources match; markers consistent
