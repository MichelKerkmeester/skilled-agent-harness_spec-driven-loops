# 2026-11-21--manual-testing-playbook--macos-live

> mcp-bladebro · manual-testing-playbook · 14-step macOS plan · Bladebro v4.8.2 on macOS arm64

---

## 1. HEADLINE / OVERVIEW

Verdict: FAIL.

The agent-browser lane works on macOS. Install, the digest pin, the health check, the MCP and Code Mode lane and every agent-browser probe passed. The real-browser probe failed: with the Aside browser binary and a cookie-only staged copy of Aside's signed-in profile, every read in the real lane exited 1 with `Chrome launch failed: no page target available`. It was not retried. The lane was rolled back. The uninstall waits for operator approval.

Tally: 12 PASS, 1 FAIL, 1 SKIP.

---

## 2. AGGREGATE RESULTS

| Scenario | Plan step | Verdict | Observed |
|---|---|---|---|
| BB-001 host-preflight | 1, 2 | PASS | `absent` before install, Node v26.13.0, Chrome binary present |
| BB-002 npm-install | 3 | PASS | `added 2 packages in 482ms` |
| BB-003 native-binary-digest | 4 | PASS | installed digest equals the v4.8.2 sidecar, `7324e502...d8fa8` |
| BB-004 version-and-doctor | 5 | PASS | `bladebro v4.8.2`, doctor `12/14 PASSED · 2 ADVISORIES` |
| BB-005 mcp-tools-and-code-mode | 6 | PASS | five tools over stdio, 5 tools in Code Mode, live `bladebro_see` call returned the page |
| BB-006 see-content | 7 | PASS | `"ok":true`, page text, exit 0 |
| BB-007 see-model-and-click | 8 | PASS | ref `e100 link "Learn more"`, click navigated once |
| BB-008 vision-marks | 9 | PASS | PNG `image_path`, 31 elements marked |
| BB-009 tabs-and-run-plan | 10 | PASS | tab listed, corrected plan `"status":"completed"` after one malformed first attempt |
| BB-010 lane-status-and-selection | 11 | PASS | Aside binary, staged profile copy and `clone` set, status `STANDBY` |
| BB-011 lane-on-clone | 12 | PASS | `imported 3361 files (594.9 MB)`, lane `ON` then `ACTIVE` |
| BB-012 real-mode-reads | 13 | FAIL | `see content`, `see model` and `act eval` each exit 1, `Chrome launch failed: no page target available` |
| BB-013 lane-off-and-stop | 14 | PASS | lane off, clone wiped, overrides reset, daemon stopped |
| BB-014 uninstall-and-data-root | 14 | SKIP | blocker: the uninstall waits for operator approval |

---

## 3. METHODOLOGY

The operator approved the install of `bladebro@4.8.2` pinned, with the rollback `npm uninstall -g bladebro` plus removing its data root. The answer is recorded in the packet `goal.md` before any step 3 output. Each command ran once from the repository root on macOS arm64 against `https://example.com`. Output went to a scratch folder outside the repository.

The real-browser steps ran once after the operator lifted the agent-profile limit for one probe: the Aside browser binary, Aside's signed-in `Default` profile copied with `Login Data*`, `Web Data*` and `Affiliation Database*` left out so that only cookies and site storage remained, `clone` mode and example.com only. `profile` mode was never used.

The scratch files hold output and exit status only, not the command lines. The `$` lines below come from the plan, the operator's account of the run and the installed `bladebro help`. Treat them as reconstructed. The output under each one is quoted from the files.

In the quotes below the home folder is shortened to `~` and the scratch folder to `<scratch>`. Long page text is cut where marked. No cookie name or value appears anywhere in this record.

---

## 4. RECORDED OUTPUT

### BB-001, plan steps 1 and 2

Step 1 is the measured block in the packet `spec.md`, taken before the install:

```text
$ command -v bladebro || echo absent
absent
```

Step 2 was not captured during the run. It was observed afterwards on the same host, on 2026-11-21:

```text
$ node --version
v26.13.0
$ ls "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

The doctor in BB-004 also found `Chrome version 157.0.8103.78`.

### BB-002, plan step 3

```text
$ npm install -g bladebro@4.8.2

added 2 packages in 482ms
```

### BB-003, plan step 4

Run before any Bladebro command. The second line is the v4.8.2 release sidecar.

```text
7324e502b1710f8fb0a073b1f71d3647266d986a50e7351cb4257ec4eb5d8fa8  ~/.nvm/versions/node/v26.13.0/lib/node_modules/bladebro/node_modules/bladebro-darwin-arm64/bladebro
7324e502b1710f8fb0a073b1f71d3647266d986a50e7351cb4257ec4eb5d8fa8  bladebro-darwin-arm64
```

### BB-004, plan step 5

```text
$ bladebro --version
bladebro v4.8.2 (bfdb5c3)
  platform: macOS (ARM64)
  install: npm
  update available: v4.8.2 → v4.8.3
  run: npm update -g bladebro
```

```text
$ bladebro doctor
BLADEBRO v4.8.2 (bfdb5c3) — System Dossier [macOS (ARM64) · npm]
  -- Environment --
  ✓ Operating system   macOS (ARM64)
  ✓ Data directory     ~/.local/state/blade (XDG default; override with BLADE_HOME)
  ✓ Binary integrity   v4.8.2 (7.1 MB) [npm]
  ✓ Disk space         619.07 GB free
  -- Browser & Display --
  ✓ Chrome/Chromium    /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
  ✓ Chrome version     157.0.8103.78
  ✓ Agent browser mode persistent profile
  -- Vault & Hygiene --
  ⚠ Profile directory  ~/.local/state/blade/profile (will be created on first run)
  ✓ Login persistence  no saved logins yet (created on first login)
  ✓ Knowledge & cache  0 domains (0 consent, 0 site-chrome, 0 chirpy, 0 heavy-risk; 0 links folded); HTTP cache: 0 warm slot(s)
  ✓ Profile hygiene    no orphaned session dirs
  ✓ Profile locks      no stale locks
  -- Network & Release --
  ✓ Release registry   reachable (latest: v4.8.3)
  ⚠ Version            v4.8.2 (update available: v4.8.3)
    fix: Run: npm update -g bladebro

  ⚠ 12/14 PASSED · 2 ADVISORIES (0.2s)
    note: Bladebro is operational; review advisories above
```

The two advisories are the profile folder that is created on first run and the 4.8.3 update. Neither is a failed check. The version is 4.8.2, so the packet flags stand, with the one correction in BB-007.

### BB-005, plan step 6

The plan registers `mcpServers.bladebro` in a client and restarts it. The run tested the same lane without a client restart: a stdio probe against `bladebro mcp`, then Code Mode through `.skilled/bin/mcp-code-mode-launcher.cjs`. Which UTCP config file the Code Mode probe read is not recorded.

```text
$ bladebro mcp    (initialize, notifications/initialized, tools/list)
tools: act,see,state,run,vision
[bladebro] termination signal — shutting down Chrome gracefully
EXIT=0
```

```text
Code Mode discovery
bladebro tools via code mode: bladebro.bladebro,bladebro_act,bladebro.bladebro_act,bladebro_see,bladebro.bladebro_see,bladebro_run,bladebro.bladebro_run,bladebro_vision,bladebro.bladebro_vision,bladebro_state,bladebro.bladebro_state
stderr bladebro lines: [McpCommunicationProtocol] Registering MCP manual 'bladebro' by discovering tools. | ... | [McpCommunicationProtocol] Discovered 5 tools from server 'bladebro'. | Successfully registered manual 'bladebro' with 5 tools.
EXIT=0
```

```text
call_tool_chain: return bladebro.bladebro_see({ mode: 'content', url: 'https://example.com' });
{"content":[{"type":"text","text":"{\"success\":true,\"result\":\"This domain is for use in documentation examples without needing permission. This is not a service; avoid relying on it for testing and monitoring purposes. [text truncated]
bladebro tools via code mode: see-ok
EXIT=0
```

Code Mode exposes `bladebro.bladebro_{act,see,state,run,vision}`. The call must be synchronous. A call written with `await` failed with `await is only valid in async functions`, because Code Mode wraps the code in a synchronous function. That attempt's output file was later overwritten, so no capture of it survives.

### BB-006, plan step 7

```text
$ bladebro see content https://example.com --json
{"is_error":false,"ok":true,"text":"This domain is for use in documentation examples without needing permission. This is not a service; avoid relying on it for testing and monitoring purposes. [text truncated] [Learn more](https://iana.org/help/example-domains)"}
EXIT=0
```

### BB-007, plan step 8

The run clicked by positional text, `bladebro act click "Learn more"`. The plan's `act click --text '<unique text>'` form also works: `bladebro help act` lists `--text` among its flags, and a follow-up `bladebro act click --text 'Learn more' --url https://example.com --json` exited 0 with the click dispatched.

```text
$ bladebro see model --json
{"is_error":false,"ok":true,"text":"Page: example.com/ | phase: ready | 1 actionable\ntitle: Example Domain\ne100 link \"Learn more\" → https://iana.org/help/example-domains\n\n--- page content --- [text truncated]"}
EXIT=0
$ bladebro act click "Learn more" --json
{"is_error":false,"ok":true,"text":"outcome: navigated → www.iana.org/help/example-domains via mouse\nnavigated → www.iana.org/help/example-domains\nPage: www.iana.org/help/example-domains | phase: ready | 31 actionable\ntitle: Example Domains [text truncated]"}
EXIT=0
```

### BB-008, plan step 9

```text
$ bladebro vision --marks --json
{"image_path":"~/.local/state/blade/artifacts/blade-5446-0001.png","is_error":false,"ok":true,"text":"screenshot (31 elements marked; badge refs match the structural model)"}
EXIT=0
```

### BB-009, plan step 10

```text
$ bladebro state tabs --json
{"is_error":false,"ok":true,"text":"* A3D31CD20EEDED47A9CD38F857B8FA86  Example Domains — https://www.iana.org/help/example-domain…\n(* = current tab; switch-tab <target_id> to change)"}
EXIT=0
```

The first plan attempt exited 1. The step file was malformed, an author error: its second step carried no action. The malformed file was overwritten by the corrected one, so its exact content is not recorded.

```text
$ bladebro run @steps.json --format json    (first attempt, malformed step file)
{"is_error":true,"ok":false,"text":"✗ error: usage: step 2: usage: unknown action: \"\"\nvalid actions: click, type, clear, select, press, scroll, navigate, read, wait, dialog, back, forward, reload, hover, upload, fill, batch, eval, pdf, download, collect, paginate, extract, open-tab, close-tab, switch-tab, save, load\n--- current page state --- [text truncated]"}
EXIT=1
```

The corrected `steps.json` is `[{"action":"navigate","url":"https://example.com"},{"action":"see","mode":"content"}]`.

```text
$ bladebro run @steps.json --format json    (corrected step file)
{"results":[{"output":"step 1: outcome: navigated → https://example.com/ [text truncated]","status":"ok","step":1},{"output":"step 2: see (958 chars): [text truncated]","status":"ok","step":2}],"status":"completed"}
EXIT=0
```

### BB-010, plan step 11

```text
$ bladebro rb status --json
{ "attach_live": false, "attach_port": 9222, "binary": null, "browser": null,
  "browsers_found": ["chrome","chrome-beta","chrome-canary","chromium","brave","arc","edge","vivaldi","opera"],
  "effective_mode": "clone", "enabled": false, "mode": "auto", "ok": true, "paused": false, "profile": null, ... }
EXIT=0
$ bladebro rb use --binary /Applications/Aside.app/Contents/MacOS/Aside
binary override: /Applications/Aside.app/Contents/MacOS/Aside
EXIT=0
$ bladebro rb profile ~/Library/Application Support/Aside/Default
profile set to `~/Library/Application Support/Aside/Default`
EXIT=0
$ bladebro rb mode clone
mechanism set to clone
EXIT=0
$ bladebro rb profile <scratch>/aside-cookie-profile/Default
profile set to `<scratch>/aside-cookie-profile/Default`
EXIT=0
$ bladebro rb status
Real-Browser Lane: STANDBY

  browser  Google Chrome (Chrome) · auto (most recently used)
  binary   /Applications/Aside.app/Contents/MacOS/Aside  (override)
  profile  "Default" · <scratch>/aside-cookie-profile/Default
  mode     clone → clone (now)
  clone    not imported yet (first launch imports)
EXIT=0
```

The profile was first pointed at Aside's live `Default` folder, then repointed to the cookie-only staged copy before the lane turned on. No import happened while it pointed at the live folder. The status labels the browser `Google Chrome (Chrome)` even with the Aside binary override.

### BB-011, plan step 12

```text
$ bladebro rb on
[realbrowser] importing Google Chrome profile `Default` (<scratch>/aside-cookie-profile/Default)...
[realbrowser] imported 3361 files (594.9 MB) in 547ms
Real-Browser Lane: ON

  browser    Google Chrome (Chrome)
  mechanism  clone
  stealth    zero page patches — your real environment IS the stealth
  revert     `bladebro rb off` · wipe imported copy: `rb forget`
EXIT=0
$ bladebro rb status
Real-Browser Lane: ACTIVE
  binary   /Applications/Aside.app/Contents/MacOS/Aside  (override)
  mode     clone → clone (now)
  clone    3361 files (594.9 MB) · up to date
```

This scenario covers the lane switch. The plan's "tools and refs working" clause for step 12 is tested by BB-012, which failed.

### BB-012, plan step 13

```text
$ bladebro see content https://example.com --json
{"is_error":true,"ok":false,"text":"Chrome launch failed: no page target available"}
  ✖ bladebro: Chrome launch failed: no page target available
EXIT=1
$ bladebro see model --json
{"is_error":true,"ok":false,"text":"Chrome launch failed: no page target available"}
  ✖ bladebro: Chrome launch failed: no page target available
EXIT=1
$ bladebro act eval <expression> --json
{"is_error":true,"ok":false,"text":"Chrome launch failed: no page target available"}
  ✖ bladebro: Chrome launch failed: no page target available
EXIT=1
```

The eval expression used is not recorded. The browser launch log, with the process ids left out:

```text
DevTools listening on ws://127.0.0.1:65472/devtools/browser/854f13be-03d0-4a4e-8d4f-992c18e5b1b5
DevTools listening on ws://127.0.0.1:45103/devtools/browser/2333c47a-17b0-4f86-9d94-21f77e9eaa98
ERROR:base/process/process_mac.cc:45] task_policy_set TASK_CATEGORY_POLICY: (os/kern) invalid argument (4)
ERROR:base/process/process_mac.cc:90] task_policy_set TASK_SUPPRESSION_POLICY: (os/kern) invalid argument (4)
ERROR:CONSOLE:12276] "[Remix] Failed to sync content script registration. TRPCClientError: Failed to request daemon auth challenge: Failed to fetch", source: chrome-extension://fjdhphbdlfjogobdofoaagnlnkoibdge/background.js (12276)
ERROR:CONSOLE:44247] "Uncaught (in promise) Error: Aside can't connect to its local service. Restart Aside and try again.", source: chrome-extension://clcdgiameigmljcbkkcbjiljinmfkncl/background.js (44247)
ERROR:extensions/browser/service_worker/service_worker_task_queue.cc:533] DidStartWorkerFail ghmbeldphafepmbegfdlkpapadhbakde: 5
ERROR:extensions/browser/service_worker/service_worker_task_queue.cc:533] DidStartWorkerFail bbpokcagpggnekcmamgdieebhpkjmljm: 5
ERROR:extensions/browser/service_worker/service_worker_task_queue.cc:533] DidStartWorkerFail mpbjkejclgfgadiemmefgebjfooflfhl: 5
```

Aside accepted the debugging flag, since DevTools reported listening twice. The launched instance exposed no page target, and its built-in extensions could not reach Aside's local service. Not retried.

### BB-013, plan step 14

```text
$ bladebro stop
daemon stopped
EXIT=0
$ bladebro rb off
Real-browser lane: off — the isolated agent browser is the default again
EXIT=0
$ bladebro rb forget
clone for `chrome` wiped (template + session dirs)
EXIT=0
$ bladebro rb use --binary auto
binary override cleared — auto-discovery again
EXIT=0
$ bladebro rb profile auto
profile set to auto (most recently used)
EXIT=0
$ bladebro rb mode auto
mechanism set to auto
EXIT=0
$ bladebro stop
daemon not running
EXIT=0
$ bladebro rb status
Real-Browser Lane: STANDBY
  binary   /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
  mode     auto → clone (now)
  clone    not imported yet (first launch imports)
```

The first `bladebro stop` ran after the agent-browser probe. The second ran after the real-browser rollback. The status block left out its profile line, which names the host's own Chrome profile. The staged profile copy was deleted after this step.

### BB-014, plan step 14

SKIP. Blocker: removing the package and the data root `~/.local/state/blade` waits for operator approval. `bladebro` is still installed.

---

## 5. FINDINGS

1. The real-browser lane failed on macOS with the Aside browser binary: `Chrome launch failed: no page target available`. The real-browser half of the plan is unverified on macOS.
2. `act click` accepts its target both positionally and through `--text` in v4.8.2. The packet's `--text` examples are correct.
3. A Code Mode call to Bladebro must be synchronous, `return bladebro.bladebro_see({...})`. A call written with `await` fails.
4. The doctor reports v4.8.3 as available. The run stayed on the pinned 4.8.2.

---

## 6. CAVEATS

Each step ran once. Step 2 output was captured after the run, not during it. The Code Mode `await` failure was observed in an earlier attempt whose output file was later overwritten, so no capture of it survives. The malformed first `steps.json` and the BB-012 eval expression were not kept.

---

## 7. RECOMMENDATIONS

Tier 1, apply now: state in the packet references that Code Mode calls are synchronous.

Tier 2, validate first: rerun BB-010 to BB-012 with a stock Chromium-family binary and a fresh profile, in a new, separately approved run, to tell an Aside binary limit from a Bladebro defect.

Tier 3, future: approve or decline BB-014 so the host ends clean.

---

## 8. REPRODUCIBILITY

Run the scenarios in `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/` in ID order on macOS, after the operator yes. Each scenario lists its exact commands.

---

## 9. CROSS-LINKS

| File | Contents |
|---|---|
| `source.md` | Where the corpus and the raw evidence live |
