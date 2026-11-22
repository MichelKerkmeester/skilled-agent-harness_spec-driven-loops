# 2026-11-22--manual-testing-playbook--clickup-real-browser

> mcp-bladebro · manual-testing-playbook--clickup-real-browser · claude-opus-5-5-on-claude-code-bladebro-v4.8.2-macos-arm64

---

## 1. OVERVIEW

Verdict: FAIL.

Tally: 4 PASS, 1 FAIL.

The recorder wrote this folder from `outside the repository and not kept (results.csv)`. A field the run did not capture reads "not recorded".

---

## 2. RESULTS

| Scenario | File | Runtime | Verdict | Reason | Evidence |
|---|---|---|---|---|---|
| BB-010 | `real-browser/lane-status-and-selection.md` | not recorded | PASS | not recorded | outside the repository and not kept (bb010.txt) |
| BB-011 | `real-browser/lane-on-clone.md` | not recorded | PASS | not recorded | outside the repository and not kept (bb011.txt) |
| BB-012 | `real-browser/real-mode-reads.md` | not recorded | FAIL | clone mode with the Aside binary and a cookie-only profile copy, target app.clickup.com: see content, see model and act eval each exit 1 with Chrome launch failed: no page target available; not retried | outside the repository and not kept (bb012.txt) |
| BB-013 | `teardown/lane-off-and-stop.md` | not recorded | PASS | not recorded | outside the repository and not kept (bb013.txt) |
| BB-015 | `real-browser/attach-mode-reads.md` | not recorded | PASS | not recorded | outside the repository and not kept (bb015.txt) |

---

## 3. CROSS-LINKS

| File | Contents |
|---|---|
| `results.csv` | The same verdicts, one row per scenario and runtime |
| `source.md` | Where the corpus and the raw evidence live |
