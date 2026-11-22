# 2026-11-21--manual-testing-playbook--hub-path-live

> mcp-aside-devtools · manual-testing-playbook · CLI and MCP transport scenarios from the mcp-browser-use hub path · aside 1.26.626.1517

---

## 1. HEADLINE / OVERVIEW

Verdict: FAIL.

Four scenarios ran once from the packet's new home under `mcp-browser-use`, and one was skipped. The CLI install and help surface passed. The MCP stdio handshake failed with `fetch failed` and returned no initialize response, so tools/list discovery failed with it. The Aside app was not running at the time. The example.com REPL scenario was skipped, because Aside drives the operator's own Aside browser profile, which is signed in.

Tally: 2 PASS, 2 FAIL, 1 SKIP.

---

## 2. AGGREGATE RESULTS

| Scenario | File | Verdict | Observed |
|---|---|---|---|
| ASD-001 | `cli-lifecycle/install-version.md` | PASS | `~/.local/bin/aside`, version `1.26.626.1517` |
| ASD-002 | `cli-lifecycle/help-fixture.md` | PASS | `account`, `exec`, `repl` and `mcp` all present, both fixtures saved |
| ASD-008 | `mcp-transport/mcp-handshake.md` | FAIL | `FAIL: no initialize response.`, stderr `fetch failed`, exit 1 |
| ASD-009 | `mcp-transport/tools-list-discovery.md` | FAIL | fixture file written but empty, 0 bytes, no tools array |
| ASD-006 | `repl-evidence/repl-open-tab.md` | SKIP | blocker: opening example.com drives the operator's signed-in Aside browser profile |

---

## 3. METHODOLOGY

The packet playbook already points at `.skilled/skills/mcp-browser-use/mcp-aside-devtools/`. A search of the playbook for `.skilled/skills/` paths found only the new hub path and `mcp-code-mode` paths, and no `mcp-tooling` path. Before the run the playbook validated with 0 violations.

`aside --help` offers no option for a fresh or separate profile. Every REPL or agent call runs in the Aside browser the operator signs into, so no page-touching scenario ran. The transport scenarios use `examples/mcp-handshake-probe.sh`, which touches no browser profile. Nothing was retried. The Aside app was not started for the run, because starting it would open the signed-in browser.

---

## 4. RECORDED OUTPUT

### ASD-001

```text
$ command -v aside
~/.local/bin/aside
EXIT=0
$ aside --version 2>&1
1.26.626.1517
EXIT=0
```

### ASD-002

```text
$ aside --help 2>&1 | tee /tmp/aside-help-fixture.txt
EXIT=0 (43 lines saved. The help ran as a redirect, `aside --help > /tmp/aside-help-fixture.txt 2>&1`, so it printed nothing here)
$ grep -E "account|exec|repl|mcp" /tmp/aside-help-fixture.txt
  --account <id>              Use an account id, for example 0 or u0
  account                     Inspect and select Aside CLI accounts
  exec [options] [prompt...]  Run a browser agent session
  repl [code...]              Run browser automation JavaScript
  mcp                         Start the MCP server over stdio
  aside --account u1 -m openai-codex/gpt-5.5 "Plan this workflow"
  aside repl "const p = await openTab('https://example.com')"
  aside mcp
EXIT=0
$ aside mcp --help 2>&1 | tee /tmp/aside-mcp-help-fixture.txt
Usage: aside mcp [options]

Start the MCP server over stdio

Options:
  -h, --help  Print help
EXIT=0
```

### ASD-008 and ASD-009

Both scenarios run the same probe.

```text
$ bash .skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/mcp-handshake-probe.sh /tmp/aside-mcp-fixtures
Probing 'aside mcp' over stdio (output: /tmp/aside-mcp-fixtures/handshake-20261121-160538.jsonl)

== Results ==
FAIL: no initialize response.
stderr:
{"event":"startup","source":"aside-mcp","pid":85160,"ppid":85157,"timestamp":"2026-11-21T15:05:38.334Z","discoveryIdleTimeoutMs":300000,"replIdleTimeoutMs":1800000}
fetch failed
EXIT=1
$ pgrep -fl "aside mcp" || echo "no leaked process"
no leaked process
$ ls /tmp/aside-mcp-fixtures/handshake-*.jsonl
/tmp/aside-mcp-fixtures/handshake-20261121-160538.jsonl
EXIT=0
```

The fixture file was 0 bytes. A triage read after the verdicts, which did not change them:

```text
$ pgrep -x Aside || echo "Aside app not running"
Aside app not running
```

ASD-008 has no leaked process, but its pass needs an initialize response naming `aside`, and none came. ASD-009 needs a tools array, and the fixture is empty.

### ASD-006

Not run. Blocker: `aside repl "await openTab('https://example.com')"` drives the operator's own Aside browser, which is signed in, and the CLI has no option for a separate profile.

---

## 5. FINDINGS

1. `aside mcp` starts, logs its startup event, then stops with `fetch failed` before it answers initialize while the Aside app is not running. The packet's triage for a dead stdio child versus an unavailable Aside service applies here. This run points at the service.
2. The Aside CLI cannot target a fresh profile, so its page scenarios cannot run on a host where the only Aside profile is signed in.

---

## 6. CAVEATS

Each scenario ran once on macOS. The MCP failure was not retried with the Aside app running, because that opens the signed-in browser.

---

## 7. RECOMMENDATIONS

Tier 1, apply now: none.

Tier 2, validate first: rerun ASD-008 and ASD-009 with the Aside app running on a profile the operator approves for testing, in a new folder.

Tier 3, future: run the REPL and parity scenarios once a test-only Aside profile exists.

---

## 8. REPRODUCIBILITY

Run the files named in section 2 from the repository root. Each one lists its exact commands.

---

## 9. CROSS-LINKS

| File | Contents |
|---|---|
| `source.md` | Where the corpus and the raw evidence live |
