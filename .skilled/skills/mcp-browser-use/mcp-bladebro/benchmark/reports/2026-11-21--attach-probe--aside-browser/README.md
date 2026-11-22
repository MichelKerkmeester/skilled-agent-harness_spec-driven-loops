# 2026-11-21--attach-probe--aside-browser

> mcp-bladebro · Bladebro v4.8.2 · macOS arm64 · attach to a running Aside browser · executed 2026-11-21T15:21:26Z

---

## 1. OVERVIEW

Verdict: PASS, 3 of 3.

The 14-step run, [`2026-11-21--manual-testing-playbook--macos-live`](../2026-11-21--manual-testing-playbook--macos-live/README.md), failed its real-browser step in `clone` mode. It launched a second Aside from a copied profile, and that instance exposed no page target. This probe tries the other real-browser mechanism: Bladebro attaches to the Aside the operator already runs, so it uses that browser's live cookies and sessions. Nothing is copied and no password store is read.

The operator approved a read-only visit to `https://example.com` only. No sign-in, form or other site was touched.

---

## 2. SETUP

1. Aside was started with a fixed local debug port: `open -a Aside --args --remote-debugging-port=9333`.
2. `curl http://127.0.0.1:9333/json/version` answered with `"Browser": "Chrome/156.0.8078.100"`. Aside opens the port on its normal profile, unlike branded Chrome 136 and later, which refuses it there.
3. On macOS, Bladebro takes a fixed port per command with `--port <N>`. That attaches to the running browser and skips Bladebro's own daemon.

---

## 3. AGGREGATE RESULTS

| Check | Command | Verdict | Observed |
|---|---|---|---|
| Read page text | `bladebro see content https://example.com --port 9333 --json` | PASS | `{"ok":true}` with the example.com text, exit 0 |
| Element model | `bladebro see model --port 9333 --json` | PASS | `1 actionable`, `e1 link "Learn more"`, exit 0 |
| Browser identity | `bladebro act eval "navigator.userAgent.includes('Chrome/156') + ' webdriver=' + navigator.webdriver" --port 9333 --json` | PASS | `result: "true webdriver=false"`, exit 0 |

`webdriver=false` matches Bladebro's guidance that a fixed debug port avoids Chrome's automation flag.

---

## 4. TEARDOWN

Aside was quit with `osascript -e 'tell application "Aside" to quit'`, which closed port 9333: a follow-up `curl` got no answer. `bladebro rb status` reported `STANDBY` and `bladebro stop` reported no daemon running. Aside had not been running before the probe and was left closed.

---

## 5. FINDINGS

1. Attach mode is the working route for Bladebro on a signed-in Aside on macOS. Clone mode with the Aside binary is not, as the 14-step run recorded.
2. The trade-off: while the debug port is open, any local process can drive the signed-in browser. Keep the port open only for the length of a task.
3. No signed-in site was tested, so cookie-backed access to a real account is shown only by construction: attach drives the live browser and its live session store.
