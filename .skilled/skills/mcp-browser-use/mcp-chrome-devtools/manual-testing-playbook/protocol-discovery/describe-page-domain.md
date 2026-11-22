---
title: "BDG-006 -- Describe Page domain"
description: "This scenario validates CDP domain introspection for `BDG-006`. It focuses on confirming `bdg cdp --describe Page` summarizes the domain and `bdg cdp Page --list` names the core navigate and reload methods."
version: 1.0.2.0
---

# BDG-006 -- Describe Page domain

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-006`.

---

## 1. OVERVIEW

This scenario validates CDP domain introspection for `BDG-006`. It focuses on confirming `bdg cdp --describe Page` returns a summary of the `Page` domain and that `bdg cdp Page --list`, the method listing the summary points to, names the core navigation methods (`navigate`, `reload`). On `bdg` 0.6.10, `--describe` on a domain prints counts and a `nextStep` hint rather than method names.

### Why This Matters

The `--describe` and `--list` surfaces are how operators discover the exact method names and parameter shapes they need before issuing raw CDP calls. Without them, every advanced workflow degrades to guesswork. This scenario establishes that introspection works for the most-used domain and complements BDG-005 (list catalog) and BDG-007 (search method).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-006` and confirm the expected signals without contradictory evidence.

- Objective: Verify `bdg cdp --describe Page` returns a non-empty `Page` domain summary and `bdg cdp Page --list` lists methods including `navigate` and `reload`.
- Real user request: `"What methods does the Page CDP domain expose?"`
- Prompt: `Describe the Page CDP domain, list its methods, and confirm navigate and reload are listed.`
- Expected execution process: run the describe command, follow its hint to the method listing, and grep the listing for the core method names.
- Expected signals: `bdg cdp --describe Page` exits 0 with a domain summary; `bdg cdp Page --list` exits 0 and its output names `navigate` and `reload`.
- Desired user-visible outcome: A short report quoting the domain summary counts and the matched method names with a PASS verdict.
- Pass/fail: PASS if the summary returns and both methods appear in the listing; FAIL if either command errors, the domain is reported as unknown, or either method is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Describe the Page CDP domain, list its methods, and confirm navigate and reload are listed.`

### Commands

1. `bash: bdg cdp --describe Page 2>&1`
2. `bash: bdg cdp Page --list 2>&1 | grep -oE '"(Page\.)?(navigate|reload)"' | sort -u`

### Expected

- Step 1: returns a JSON summary of the `Page` domain with `"domain": "Page"`, command and event counts, and a `nextStep` that names `bdg cdp Page --list`; exit code 0
- Step 2: matches at least one form of `navigate` and one of `reload` (for example `"Page.navigate"` and `"Page.reload"`); exit code 0

### Evidence

Capture the full `--describe Page` output, the full `Page --list` output, and the grep match output.

### Pass / Fail

- **Pass**: `--describe Page` returns a non-empty domain summary AND the step 2 grep matches both `navigate` and `reload`.
- **Fail**: `--describe Page` errors with "unknown domain" (catalog mismatch, cross-reference BDG-005); `Page --list` errors; the listing is non-empty but missing either core method.

### Failure Triage

1. If `--describe Page` errors with "unknown domain": confirm the domain exists in the catalog via `bdg cdp --list 2>&1 | grep -o '"Page"'` and cross-reference BDG-005, since domain casing may have shifted upstream.
2. If the listing is present but missing `navigate` or `reload`: dump it with `bdg cdp Page --list 2>&1 | jq '.'` and inspect for renamed methods; upstream CDP versions occasionally rename methods between Chrome releases.
3. If step 1 prints method names instead of a summary: the installed `bdg` describes domains differently; record the output shape and keep step 2 as the method check.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/SKILL.md` | bdg cdp --describe usage |
| `bdg cdp --help` | Confirms `--list` lists all domains or the methods in a domain |

---

## 5. SOURCE METADATA

- Group: PROTOCOL DISCOVERY
- Playbook ID: BDG-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `protocol-discovery/describe-page-domain.md`
