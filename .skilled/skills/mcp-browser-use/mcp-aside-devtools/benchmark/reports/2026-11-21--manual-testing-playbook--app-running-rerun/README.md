# 2026-11-21--manual-testing-playbook--app-running-rerun

> mcp-aside-devtools · aside 1.26.626.1517 · macOS · Aside app running · executed 2026-11-21T15:22:01Z

---

## 1. OVERVIEW

Verdict: PASS, 3 of 3.

The earlier run, [`2026-11-21--manual-testing-playbook--hub-path-live`](../2026-11-21--manual-testing-playbook--hub-path-live/README.md), failed ASD-008 and ASD-009 and skipped ASD-006. The Aside app was not running, so the MCP server could not reach it. This run repeats those three scenarios with the app running. The earlier run stays as it was recorded.

The operator approved driving the signed-in Aside browser for a read-only visit to `https://example.com` only. No sign-in, form or other site was touched. Aside was closed again after the run.

---

## 2. AGGREGATE RESULTS

| Scenario | File | Verdict | Observed |
|---|---|---|---|
| ASD-008 | `mcp-transport/mcp-handshake.md` | PASS | `protocolVersion` `2024-11-05`, `serverInfo` name `aside` version `1.26.626.1517`, exit 0, no leaked `aside mcp` process |
| ASD-009 | `mcp-transport/tools-list-discovery.md` | PASS | fixture `handshake-20261121-162201.jsonl` written, 7087 bytes, with exactly one tool, `repl`, requiring `title` and `code` |
| ASD-006 | `repl-evidence/repl-open-tab.md` | PASS | `aside repl` opened example.com in a new tab, title `Example Domain`, exit 0, no `not bound to a browser profile` text |

---

## 3. RECORDED OUTPUT

### ASD-008 and ASD-009

```text
$ bash .skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/mcp-handshake-probe.sh <scratch>/aside-mcp-fixtures
== Results ==
-- serverInfo / protocol --
{"protocolVersion":"2024-11-05","serverInfo":{"name":"aside","version":"1.26.626.1517"},"capabilities":{"tools":{"listChanged":true}}}
-- discovered tools --
{"name":"repl","required":["title","code"]}
PASS: 'repl' tool discovered (matches the version-pinned research inventory).
EXIT=0
$ pgrep -fl "aside mcp" || echo "no leaked process"
no leaked process
```

### ASD-006

The command printed the page title as well, so the run also shows the tab was readable.

```text
$ aside repl "const p = await openTab('https://example.com'); console.log(await p.title())"
✔︎ Opened a new tab and set it active: tabs[0], page → Example Domain (https://example.com/)
Example Domain
[ok | 724ms]
EXIT=0
```

---

## 4. FINDINGS

1. The earlier ASD-008 and ASD-009 failures were environmental. `aside mcp` needs the Aside app running, and a closed app shows up as `no initialize response` with `fetch failed`, not as a clear error.
2. ASD-006 needs the signed-in browser by design. It can only run where the operator accepts that use.

---

## 5. SOURCE

Raw output lives outside the repository in the session scratch folder, never committed. The probe fixture holds the handshake only, with no cookies or page content.
