# 2026-11-22--manual-testing-playbook--rewritten-forms-rerun

> mcp-aside-devtools · manual-testing-playbook--rewritten-forms-rerun · claude-opus-5-5-on-claude-code-aside-1.26.626.1517-macos

---

## 1. OVERVIEW

Verdict: FAIL.

Tally: 8 PASS, 2 FAIL.

The recorder wrote this folder from `outside the repository and not kept (results.csv)`. A field the run did not capture reads "not recorded".

---

## 2. RESULTS

| Scenario | File | Runtime | Verdict | Reason | Evidence |
|---|---|---|---|---|---|
| ASD-006 | `repl-evidence/repl-open-tab.md` | not recorded | PASS | not recorded | outside the repository and not kept (ASD-006.txt) |
| ASD-007 | `repl-evidence/repl-screenshot-artifact.md` | not recorded | PASS | rewritten form: ./tmp in the session folder, size 84666, magic 89504e47 | outside the repository and not kept (ASD-007.txt) |
| ASD-012 | `probes-and-gaps/console-probe.md` | not recorded | FAIL | rewritten form prints nothing and exits in 10ms: the early return in the catch drops the LISTENER_UNSUPPORTED line logged just before it, so no outcome is evidenced | outside the repository and not kept (ASD-012.txt) |
| ASD-013 | `probes-and-gaps/network-probe.md` | not recorded | FAIL | same as ASD-012: the early return in the catch drops the logged LISTENER_UNSUPPORTED line, so no outcome is evidenced | outside the repository and not kept (ASD-013.txt) |
| ASD-016 | `devtools-parity/dom-query-inspection.md` | not recorded | PASS | title element Example Domain, h1 count 0, snapshot tree 265 | outside the repository and not kept (ASD-016.txt) |
| ASD-017 | `devtools-parity/screenshot-pdf-capture.md` | not recorded | PASS | PNG 84666 bytes magic 89504e47 and PDF 160572 bytes head %PDF, both deleted in the same evaluation | outside the repository and not kept (ASD-017.txt) |
| ASD-018 | `devtools-parity/console-network-capture.md` | not recorded | PASS | output parses; console, request and response each reported unsupported with the verbatim error | outside the repository and not kept (ASD-018.txt) |
| ASD-019 | `devtools-parity/cookies-storage.md` | not recorded | PASS | page.context is undefined, recorded as the gap; no cookie names or values on example.com | outside the repository and not kept (ASD-019.txt) |
| ASD-020 | `devtools-parity/performance-timing.md` | not recorded | PASS | timing parsed; no Lighthouse score is produced | outside the repository and not kept (ASD-020.txt) |
| ASD-021 | `devtools-parity/navigation-multi-tab.md` | not recorded | PASS | not recorded | outside the repository and not kept (ASD-021.txt) |

---

## 3. CROSS-LINKS

| File | Contents |
|---|---|
| `results.csv` | The same verdicts, one row per scenario and runtime |
| `source.md` | Where the corpus and the raw evidence live |
