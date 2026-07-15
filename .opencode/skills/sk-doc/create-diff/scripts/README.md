---
title: "create-diff scripts: Code README"
description: "Code-facing README for the create-diff diff engine and report safety validator."
trigger_phrases:
  - "create-diff scripts"
  - "diff engine"
  - "report validator"
---

# create-diff scripts

The deterministic before/after document diff engine and the report safety validator.

---

## 1. OVERVIEW

This folder owns the two command-line tools behind the create-diff skill: a Git-free, stdlib-first diff engine that renders a self-contained HTML report, and a safety validator that proves a generated report is inert and self-contained. Both run locally with no network access; the engine never writes to a source document.

Behavior details (flags, JSON summaries, fidelity tiers) live in [`../references/cli-reference.md`](../references/cli-reference.md); this README stays navigational.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 3 |
| CLI entrypoints | 2 |
| Test suites | 1 |

---

## 2. QUICK START

Run from the packet root. Generate a report from two explicit files, then verify it is safe:

```bash
python3 scripts/create_diff.py compare-pair --before old.md --after new.md --report /tmp/out.html
python3 scripts/validate_report.py /tmp/out.html
```

The engine reads both inputs and writes only the report — it never mutates either source document.

---

## 3. STRUCTURE

| Path | Purpose |
|---|---|
| `create_diff.py` | Diff engine and report renderer. Subcommands: `capabilities`, `snapshot`, `compare`, `compare-pair`, `status`, `cleanup`. |
| `validate_report.py` | Self-contained/safe HTML report validator — an allowlist of the emitter's exact HTML dialect. |
| `test_create_diff.py` | Stdlib regression suite covering the engine and the validator. |

---

## 4. CLI ENTRYPOINTS

- **`create_diff.py`** — Compare two document versions and render a single self-contained, zero-JavaScript, accessible HTML diff report; supports stored baseline snapshots or explicit file pairs.
- **`validate_report.py`** — Assert one or more generated reports are inert and self-contained, printing `PASS`/`FAIL` per file.

The full flag list and JSON-summary contract are defined in [`../references/cli-reference.md`](../references/cli-reference.md), which is authoritative. Do not duplicate that content here.

---

## 5. EXIT CODES

**`create_diff.py`**

| Code | Meaning |
|---:|---|
| 0 | OK |
| 2 | Usage error |
| 3 | Unsupported or limited capability |
| 4 | No baseline snapshot |
| 5 | I/O error |

**`validate_report.py`**

| Code | Meaning |
|---:|---|
| 0 | Every report safe |
| 1 | At least one report unsafe |

---

## 6. REPORT CONTRACT

`validate_report.py` passes a report only when it conforms to the renderer's exact dialect:

- A `<!doctype html>` preamble and an `<html lang=...>` element.
- Exactly one `Content-Security-Policy` meta tag whose directive set matches the required policy, placed as an early `<head>` child before `<body>`.
- Only allowlisted tags and attributes; anything outside the set is rejected structurally.
- No `<script>`, no inline event handlers, and no `style`/URL-bearing attributes.
- URLs limited to local `#`-fragment references; escaped document content reaches the parser as inert character data, never as markup.

These enforce the two invariants that make a report trustworthy: the source is never mutated, and the output is self-contained with zero JavaScript.

---

## 7. VALIDATION / TESTS

Run the regression suite from the packet root:

```bash
python3 scripts/test_create_diff.py
```

Expected pass signal:

```text
Ran 39 tests
OK
```

---

## 8. RELATED

| Document | Purpose |
|---|---|
| [`../SKILL.md`](../SKILL.md) | Owning packet: runtime routing and workflow boundaries. |
| [`../references/cli-reference.md`](../references/cli-reference.md) | Authoritative CLI flags, JSON summaries, and contract. |
| [`../../../sk-code/code-opencode/SKILL.md`](../../../sk-code/code-opencode/SKILL.md) | OpenCode coding standard these scripts conform to. |
