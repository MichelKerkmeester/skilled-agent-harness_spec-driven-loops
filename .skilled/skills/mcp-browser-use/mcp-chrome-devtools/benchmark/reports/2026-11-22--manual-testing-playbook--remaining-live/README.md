# 2026-11-22--manual-testing-playbook--remaining-live

> mcp-chrome-devtools · manual-testing-playbook · the 17 live scenarios no earlier run covered · bdg 0.6.10 and chrome-devtools-mcp 0.26.0

---

## 1. HEADLINE / OVERVIEW

Verdict: FAIL.

Every live scenario the 2026-11-21 run left out ran once against `https://example.com`. Four passed as written: the CDP method search, `dom eval`, the HAR export and the cleanup-leak check. Most failures are stale scenario text, not broken tools. `bdg` 0.6.10 prints human-readable text unless it gets `--json`, so five scenarios that pipe into `jq` or grep a line format fail. Code Mode rejects the top-level `await` that all five MCP scenarios use. Three failures are real tool behavior: `bdg` ignored a bogus `CHROME_PATH`, accepted `not-a-url` as a URL and kept screenshotting after its Chrome was killed.

Tally: 4 PASS, 13 FAIL.

---

## 2. AGGREGATE RESULTS

| Scenario | File | Verdict | Observed |
|---|---|---|---|
| BDG-003 | `cli-bdg-lifecycle/status-json.md` | FAIL | `jq: parse error`, `bdg status` prints text; `bdg status --json` carries `active` and `url` |
| BDG-005 | `protocol-discovery/list-cdp-domains.md` | FAIL | output is JSON with 53 domains including Page, Network and Runtime, but the line-anchored grep matched 0 lines |
| BDG-006 | `protocol-discovery/describe-page-domain.md` | FAIL | `--describe Page` prints a summary (61 commands, 28 events) and names no method; `bdg cdp Page --list` does list `Page.navigate` and `Page.reload` |
| BDG-007 | `protocol-discovery/search-cdp-method.md` | PASS | exit 0, output names `captureScreenshot` |
| BDG-009 | `dom-and-screenshot/eval-javascript.md` | PASS | `"Example Domain"`, exit 0 |
| BDG-011 | `console-and-network/console-list.md` | FAIL | sentinel `BDG-011 test` present, but `console --list` prints text, jq exit 5 |
| BDG-012 | `console-and-network/cookies-retrieval.md` | FAIL | `No cookies found` as text, jq parse error; `getCookies --json` returns an array of length 0 |
| BDG-013 | `console-and-network/har-export.md` | PASS | HAR 8701 bytes, `log.version` `"1.2"`, 2 entries |
| BDG-014 | `mcp-parallel-instances/chrome-devtools-1-navigate.md` | FAIL | `await is only valid in async functions`. Synchronous calls then wrote a 114358-byte PNG |
| BDG-015 | `mcp-parallel-instances/dual-instance-parallel.md` | FAIL | `await` and `Promise.all` rejected. Synchronous Part A wrote one PNG per instance, Part B timing could not run |
| BDG-016 | `mcp-parallel-instances/close-and-select-page.md` | FAIL | `await` rejected. Synchronously, `close_page` and `select_page` got `pageId` undefined, `expected number` |
| BDG-017 | `mcp-parallel-instances/multi-tab-same-instance.md` | FAIL | `await` rejected. Synchronously, `pageCount 0` and `select_page` validation errors, because the tools return text, not page objects |
| BDG-018 | `mcp-parallel-instances/page-context-isolation.md` | FAIL | `await` rejected. Synchronously, `in1: true, in2: false`, so the cookie stayed in instance 1 |
| BDG-019 | `recovery-and-failure/missing-browser.md` | FAIL | `CHROME_PATH=/nonexistent/chrome` still gave `Session Started`, exit 0 |
| BDG-020 | `recovery-and-failure/invalid-url.md` | FAIL | `bdg not-a-url` exit 0, `Target: http://not-a-url/` |
| BDG-021 | `recovery-and-failure/dead-session.md` | FAIL | after `kill -9` of the bdg Chrome, the screenshot still exit 0. The restart exit 104 `Session already running` |
| BDG-022 | `recovery-and-failure/cleanup-leak.md` | PASS | Chrome-family process count 8 before, 17 during, 8 after `bdg stop`. No `.bdg/chrome-profile` process left |

---

## 3. METHODOLOGY

`bdg` used its own profile, `~/.bdg/chrome-profile`. The two MCP manuals, `chrome_devtools_1` and `chrome_devtools_2`, run `chrome-devtools-mcp@0.26.0 --isolated=true`. No signed-in profile was touched, and the `chrome_devtools_live` manual, which attaches to the operator's Chrome, was not used. Only example.com and example.org were opened. No form was filled.

Captures went to the session scratch folder instead of `/tmp`, per ALWAYS rule 7, and were deleted after the run. The cookie scenario printed names and domains only, and the page set none.

Each scenario ran once, in the order 005, 006, 007, 002 as a precondition, 003, 009, 011, 012, 013, then a stop, then 019, 020, 021, 022 and the MCP group. Code Mode discovery ran first: `search_tools` and `tool_info` confirmed `chrome_devtools_1.chrome_devtools_1_<tool>` callables. The verdict reads each scenario as written. Where a scenario failed on its own wording, the same step was retried in the form the tool accepts, and the table reports that as observed detail. Those retries did not change a verdict.

The MCP preconditions run `jq '.manuals | keys' .utcp_config.json`, which errors here because the config keeps manuals under `manual_call_templates`. Both manuals are registered there.

---

## 4. RECORDED OUTPUT

### BDG-003

```text
$ bdg status 2>&1 | jq '.state, .url'
jq: parse error: Invalid numeric literal at line 1, column 8
EXIT=5
$ bdg status --json | jq -c 'keys'
["active","activity","bdgPid","chromeAlive","chromePid","duration","durationFormatted","pageState","port","startTime","targetId","telemetry","version","webSocketDebuggerUrl"]
```

### BDG-006

```text
$ bdg cdp --describe Page
{"type": "domain", "domain": "Page", "commands": 61, "events": 28,
 "nextStep": "Use: bdg cdp Page --list (to see all methods)"}   [description trimmed]
EXIT=0
$ bdg cdp Page --list | grep -oE '"(Page\.)?(navigate|reload)"' | sort -u
"Page.navigate" "Page.reload" "navigate" "reload"
```

### BDG-011

```text
$ bdg console --list
Console Messages (1 total)
[0]  log     08:10:17.724  BDG-011 test
EXIT=0
```

### BDG-014, first attempt as written

```text
[ERROR] Code execution failed: await is only valid in async functions and the top level bodies of modules [<isolated-vm>:7:9]
```

### BDG-019 and BDG-020

```text
$ CHROME_PATH=/nonexistent/chrome bdg https://example.com
Session Started
Target: https://example.com/
EXIT=0
$ bdg not-a-url
Target: http://not-a-url/
EXIT=0
```

### BDG-021

```text
$ kill -9 <bdg Chrome pid>      [first pid matching .bdg/chrome-profile]
killed
$ bdg dom screenshot <scratch>/dead.png
Screenshot captured
EXIT=0
$ bdg https://example.com
Error: Session already running
EXIT=104
```

### BDG-022

```text
B=8   S=17   P=8
[cleanup] Found 1 orphaned daemon process(es): 6258
```

---

## 5. FINDINGS

1. `bdg` 0.6.10 defaults to text output. BDG-003, BDG-005, BDG-011 and BDG-012 need `--json` or a JSON-aware match, and BDG-006 needs `bdg cdp Page --list`.
2. Code Mode needs synchronous calls. All five MCP scenarios use top-level `await`, which fails. The Bladebro live run found the same rule.
3. The MCP page tools return text such as `## Pages\n1: https://example.com/`, not objects. So BDG-016 and BDG-017 cannot read a `pageId` and need to parse it from that text.
4. Instance isolation holds. A cookie set in `chrome_devtools_1` was absent in `chrome_devtools_2`.
5. `bdg` ignored the bogus `CHROME_PATH` and accepted `not-a-url`. Both scenarios expect a non-zero exit, so either `bdg` changed or the scenarios never held. That is INFERRED until an older `bdg` is checked.
6. BDG-021 killed the first process that matched the bdg profile. That may have been a helper rather than the main browser, which would explain a working screenshot afterwards. This is INFERRED. Reading the `Chrome PID` from `bdg status` first would settle it.
7. The two BDG-015 screenshots are byte-identical. example.com and example.org serve the same page, so the images alone do not prove instance 2 loaded example.org. The navigate result named it.

---

## 6. CAVEATS

Each scenario ran once on macOS. The BDG-015 timing comparison did not run, because synchronous calls cannot overlap. The two MCP server processes Code Mode started stay up with the Code Mode session.

---

## 7. RECOMMENDATIONS

Tier 1, apply now: none. Scenario edits belong to the packet owner and a new run.

Tier 2, validate first: rewrite BDG-003, 005, 006, 011 and 012 for `--json` output. Rewrite BDG-014 to 018 as synchronous calls with `pageId` parsed from the page list, then rerun all ten in a new folder.

Tier 3, future: check whether `bdg` should reject a missing `CHROME_PATH` and a bare word as a URL, and report it upstream if so. Make BDG-021 kill the `Chrome PID` that `bdg status` reports.

---

## 8. REPRODUCIBILITY

Run the files named in section 2 from the repository root in the order in section 3. Each one lists its exact commands. Send captures to a scratch folder.

---

## 9. CROSS-LINKS

| File | Contents |
|---|---|
| `source.md` | Where the corpus and the raw evidence live |
| [`../2026-11-21--manual-testing-playbook--hub-path-live/`](../2026-11-21--manual-testing-playbook--hub-path-live/README.md) | The first five scenarios |
