# 2026-11-22--manual-testing-playbook--signed-in-live

> mcp-aside-devtools · manual-testing-playbook--signed-in-live · claude-opus-5-5-on-claude-code-aside-1.26.626.1517-macos

---

## 1. OVERVIEW

Verdict: FAIL.

Tally: 10 PASS, 5 FAIL.

The recorder wrote this folder from `outside the repository and not kept (results.csv)`. A field the run did not capture reads "not recorded".

---

## 2. RESULTS

| Scenario | File | Runtime | Verdict | Reason | Evidence |
|---|---|---|---|---|---|
| ASD-003 | `cli-lifecycle/account-status.md` | not recorded | PASS | run as the precondition for the agent and repl scenarios | outside the repository and not kept (asd003.txt) |
| ASD-004 | `agent-task/direct-task.md` | not recorded | PASS | not recorded | outside the repository and not kept (asd004.txt) |
| ASD-005 | `agent-task/session-continuation.md` | not recorded | PASS | the run printed no session id; the id came from the sessions table of the Aside state database, and the folder name with its date prefix is rejected as Session not found | outside the repository and not kept (asd005.txt) |
| ASD-006 | `repl-evidence/repl-open-tab.md` | not recorded | PASS | run as the bound-tab precondition | outside the repository and not kept (asd006.txt) |
| ASD-007 | `repl-evidence/repl-screenshot-artifact.md` | not recorded | FAIL | Aside redirected the /tmp screenshot into its session tmp folder, so /tmp/aside-test.png never existed and the redirected file was gone after the repl exited; repl scenarios ran in one aside repl process after ASD-006's openTab, since a separate repl call starts with page null | outside the repository and not kept (asd007.txt) |
| ASD-010 | `mcp-transport/unbound-profile-error.md` | not recorded | PASS | version drift on 1.26.626.1517: a fresh aside mcp is bound and listBrowserTabs returns tabs, no not-bound error; the literal return form yields empty text because return values are not printed | outside the repository and not kept (asd010.jsonl) |
| ASD-012 | `probes-and-gaps/console-probe.md` | not recorded | PASS | unsupported path: page.on console is not supported (Aside points to page.console.logs()); the literal return form prints nothing, so a console.log form carried the evidence; repl scenarios ran in one aside repl process after ASD-006's openTab, since a separate repl call starts with page null | outside the repository and not kept (asd012.txt) |
| ASD-013 | `probes-and-gaps/network-probe.md` | not recorded | PASS | unsupported path: page.on request is not supported; the literal return form prints nothing, so a console.log form carried the evidence; no headers or bodies captured; repl scenarios ran in one aside repl process after ASD-006's openTab, since a separate repl call starts with page null | outside the repository and not kept (asd013.txt) |
| ASD-015 | `recovery-and-failure/dead-mcp-process.md` | not recorded | PASS | probe-owned pid only; stderr shows a sigterm shutdown, the write hit a broken pipe, the fresh handshake passed and no probe process leaked | outside the repository and not kept (asd015.txt) |
| ASD-016 | `devtools-parity/dom-query-inspection.md` | not recorded | FAIL | page.$eval h1 failed with Selector h1 not found: example.com now has no h1 (querySelectorAll h1 length 0), so the expected Example Domain heading is stale; repl scenarios ran in one aside repl process after ASD-006's openTab, since a separate repl call starts with page null | outside the repository and not kept (asd016.txt) |
| ASD-017 | `devtools-parity/screenshot-pdf-capture.md` | not recorded | FAIL | the PNG was redirected into the session tmp folder and page.pdf refused the /tmp path as escaping the session directory, so neither artifact exists at the checked paths; repl scenarios ran in one aside repl process after ASD-006's openTab, since a separate repl call starts with page null | outside the repository and not kept (asd017.txt) |
| ASD-018 | `devtools-parity/console-network-capture.md` | not recorded | FAIL | page.on console threw page event console is not supported, so the unguarded listener errored before any capture; repl scenarios ran in one aside repl process after ASD-006's openTab, since a separate repl call starts with page null | outside the repository and not kept (asd018.txt) |
| ASD-019 | `devtools-parity/cookies-storage.md` | not recorded | FAIL | page.context is not a function in Aside's Playwright API, so the cookie read errored against a bound tab; repl scenarios ran in one aside repl process after ASD-006's openTab, since a separate repl call starts with page null | outside the repository and not kept (asd019.txt) |
| ASD-020 | `devtools-parity/performance-timing.md` | not recorded | PASS | navigation and paint timing parsed; no Lighthouse score is produced, the documented gap; repl scenarios ran in one aside repl process after ASD-006's openTab, since a separate repl call starts with page null | outside the repository and not kept (asd020.txt) |
| ASD-021 | `devtools-parity/navigation-multi-tab.md` | not recorded | PASS | repl scenarios ran in one aside repl process after ASD-006's openTab, since a separate repl call starts with page null | outside the repository and not kept (asd021.txt) |

---

## 3. CROSS-LINKS

| File | Contents |
|---|---|
| `results.csv` | The same verdicts, one row per scenario and runtime |
| `source.md` | Where the corpus and the raw evidence live |
