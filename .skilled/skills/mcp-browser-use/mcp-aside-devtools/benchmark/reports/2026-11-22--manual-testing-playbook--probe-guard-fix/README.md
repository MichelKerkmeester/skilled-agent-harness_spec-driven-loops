# 2026-11-22--manual-testing-playbook--probe-guard-fix

> mcp-aside-devtools · manual-testing-playbook--probe-guard-fix · claude-opus-5-5-on-claude-code-aside-1.26.626.1517-macos

---

## 1. OVERVIEW

Verdict: PASS.

Tally: 2 PASS.

The recorder wrote this folder from `outside the repository and not kept (r.csv)`. A field the run did not capture reads "not recorded".

---

## 2. RESULTS

| Scenario | File | Runtime | Verdict | Reason | Evidence |
|---|---|---|---|---|---|
| ASD-012 | `probes-and-gaps/console-probe.md` | not recorded | PASS | unsupported path: page.on console is not supported, verbatim error logged, pointer to page.console.logs() | outside the repository and not kept (ASD-012.txt) |
| ASD-013 | `probes-and-gaps/network-probe.md` | not recorded | PASS | unsupported path: page.on request is not supported, verbatim error logged; no headers or bodies captured | outside the repository and not kept (ASD-013.txt) |

---

## 3. CROSS-LINKS

| File | Contents |
|---|---|
| `results.csv` | The same verdicts, one row per scenario and runtime |
| `source.md` | Where the corpus and the raw evidence live |
