# 2026-11-22--manual-testing-playbook--app-closed-safe-set

> mcp-aside-devtools · manual-testing-playbook · three scenarios that drive no browser · aside 1.26.626.1517 with the Aside app closed

---

## 1. HEADLINE / OVERVIEW

Verdict: FAIL.

The Aside app was closed, and the only uncovered scenarios that drive no browser ran. The missing-binary doctor check passed. Account status and Code Mode discovery both failed. The account commands printed `fetch failed`, and discovery found no Aside callable although the manual is registered. Both match the 2026-11-21 handshake failures, which also ran with the app closed and passed once it was open.

Tally: 1 PASS, 2 FAIL.

---

## 2. AGGREGATE RESULTS

| Scenario | File | Verdict | Observed |
|---|---|---|---|
| ASD-003 | `cli-lifecycle/account-status.md` | FAIL | `aside account list` and `aside account status` each printed `fetch failed`, exit 1 |
| ASD-011 | `mcp-transport/code-mode-discovery.md` | FAIL | the `aside` manual is in `.utcp_config.json`, but `search_tools("Aside browser automation")` returned no `aside.*` entry and `tool_info("aside.aside.repl")` returned `not found` |
| ASD-014 | `recovery-and-failure/missing-binary.md` | PASS | with `PATH=/usr/bin:/bin` and a scratch `HOME`, the doctor printed `aside not on PATH` and the install command, exit 0. The real `~/.local/bin/aside` was untouched |

---

## 3. METHODOLOGY

Most Aside scenarios open pages in the operator's signed-in Aside browser or start an agent task on the operator's account. Those wait for an operator yes and did not run here. This run took only the three that drive no browser. The Aside app was not running, and it was not started, because starting it opens the signed-in profile.

Each scenario ran once from the repository root. The ASD-014 scratch `HOME` sat in the session scratch folder and was removed afterwards. Account output was checked for emails and ids before quoting, and it held none.

---

## 4. FINDINGS

1. ASD-003 and ASD-011 need the Aside app running. The CLI and the MCP server both reach a local service the app provides. That cause is INFERRED from the 2026-11-21 pair of runs, where the same handshake failed with the app closed and passed with it open. A rerun with the app open would confirm it.
2. The doctor degrades cleanly when the binary is missing and changes nothing.

---

## 5. CAVEATS

Each scenario ran once on macOS. "fetch failed" names no endpoint, so the CLI output alone does not show which service was unreachable.

---

## 6. RECOMMENDATIONS

Tier 1, apply now: none.

Tier 2, validate first: rerun ASD-003 and ASD-011 with the Aside app open, after the operator agrees.

Tier 3, future: make the scenario preconditions say that the Aside app must be running.

---

## 7. REPRODUCIBILITY

Run the three files named in section 2 from the repository root with the Aside app closed. Each one lists its exact commands.

---

## 8. CROSS-LINKS

| File | Contents |
|---|---|
| `source.md` | Where the corpus and the raw evidence live |
| [`../2026-11-21--manual-testing-playbook--app-running-rerun/`](../2026-11-21--manual-testing-playbook--app-running-rerun/README.md) | The run that passed with the app open |
