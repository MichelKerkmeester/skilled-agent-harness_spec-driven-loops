---
title: "create-diff"
description: "Local, Git-free before/after review of an edited document, rendered as one self-contained HTML report, for anyone who needs to know what changed without touching Git."
trigger_phrases:
  - "before after document review"
  - "document diff report"
version: 1.0.0.0
---

# create-diff

> Capture what changed in an edited document, offline, without Git, as one HTML report you can open in any browser.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Reviewing what changed in a locally edited Markdown, text, HTML, DOCX or text-PDF document, without Git |
| **Invoke with** | `python3 scripts/create_diff.py snapshot / compare / compare-pair`, or `/create:diff` |
| **Works on** | One document at a time, or a pre-composed multi-file aggregate pair |
| **Produces** | A single self-contained HTML report, inlined CSS, zero JavaScript, no network |

---

## 2. OVERVIEW

### Why This Skill Exists

Not everything you edit lives in Git. An AI or a person edits a Markdown spec, a DOCX brief or a PDF export outside version control, and now you need to know exactly what changed before you trust it. Diffing that by eye is unreliable for anything beyond a sentence, and pasting the file into a hosted diff tool sends its content somewhere you may not want it to go. create-diff exists so review works the same everywhere: locally, without a server and without ever touching the source file.

### What It Does

create-diff captures a baseline snapshot of a document before an edit happens, then compares the current file against that snapshot (or against an explicit second file) and renders one self-contained HTML report you can open offline. The engine ships as `scripts/create_diff.py` and reads Markdown, plain text, HTML, DOCX and text-layer PDF. It does not touch code or Git-tracked files (that boundary belongs to `sk-git`), and it does not audit a single document on its own since comparing two states is the point. `create-quality-control` handles single-document scoring.

---

## 3. QUICK START

**Step 1: capture a baseline before the edit.**

```bash
python3 scripts/create_diff.py snapshot path/to/doc.md
```

Confirms a snapshot was stored. Nothing else changes.

**Step 2: after the edit, compare and render.**

```bash
python3 scripts/create_diff.py compare path/to/doc.md --report review.html
```

Or, without a stored baseline, compare two explicit files directly, using the shipped fixtures:

```bash
python3 scripts/create_diff.py compare-pair \
  --before assets/fixtures/onboarding-before.md \
  --after  assets/fixtures/onboarding-after.md \
  --report /tmp/onboarding-review.html
```

You get one HTML file with a change summary line like `markdown, tier full, +6 -0 ~3` and a unified or side-by-side diff view.

**Step 3: verify the report before you hand it off.**

```bash
python3 scripts/validate_report.py /tmp/onboarding-review.html
```

Prints `PASS` when the report is safe and self-contained.

---

## 4. HOW IT WORKS

The lifecycle has one hard invariant: the baseline has to exist before the edit happens. `snapshot` copies the current file into a local `.create-diff/` store without altering the source. Once the edit is done, `compare` diffs the live file against its latest stored baseline and writes the report. When no baseline exists, or you already have two explicit versions, `compare-pair` skips the store entirely and diffs `--before` against `--after`. Either path ends the same way: a deterministic line-and-word diff, run through a format-aware extractor, rendered into one inlined-CSS HTML file with no scripts and no network calls.

### Key Concept: Aggregate File Boundaries

`compare-pair` can also review a bundle of multiple files in one call, as long as both `--before` and `--after` wrap every file in matching `===== BEGIN FILE: <path> =====` / `===== END FILE: <path> =====` markers. When the markers line up, the report renders each transition as a full-width boundary band with a canvas gap before it, so a five-file bundle still reads as five distinct reviews instead of one file's heading bleeding into the next. Malformed or unbalanced markers just render as ordinary text. The CLI itself still only ever receives one before-document and one after-document.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-diff when an AI or a person edited a document outside Git and you need proof of what changed, when you want a baseline captured before a risky edit or when a pre-composed multi-file bundle needs its transitions to stay visible in review. Skip it for code or anything already tracked in Git (use `sk-git`), for visual or pixel-level comparison (use `sk-design`) and for scoring a single document with no second state to compare (use `create-quality-control`).

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-git` | Owns diffs for code and Git-tracked files. create-diff is for everything outside that boundary. |
| `sk-design` | Owns visual and pixel-level comparison. create-diff only compares extracted text. |
| `create-quality-control` | Audits one existing document. create-diff always compares two states. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Exit `4`, missing baseline | `compare` ran with no stored snapshot for that file | Run `snapshot` first, or use `compare-pair` with explicit `--before`/`--after` |
| Exit `3`, unsupported format | The file type has no extractor, or PDF has no text layer | Run `capabilities` to see what is available, or provide a pre-extracted explicit pair |
| Report already exists | The engine refuses to overwrite an existing report path | Pass a new `--report` path or remove the old file first |
| File-boundary bands missing on a multi-file pair | The `BEGIN FILE`/`END FILE` markers are unbalanced or unmatched between the two inputs | Match marker order and paths exactly in both `--before` and `--after` |
| `validate_report.py` fails | The report references a remote resource or an inline script somehow made it through | Fix the renderer input and regenerate. Never hand off a failed report as clean |

---

## 7. FAQ

**Q: Why not just use `git diff` for this?**

A: Git needs the file under version control with commit history. create-diff works on any document, anywhere on disk, without ever needing a Git repo.

**Q: Does this send my document anywhere?**

A: No. Everything runs locally with the Python standard library. The report has no scripts and no remote references. When PDF extraction is available it uses a local extractor only.

**Q: What if the document is a scanned PDF?**

A: There is no text layer to diff, so the comparison would be empty. OCR is out of scope. Use the explicit-pair fallback with pre-extracted text instead.

**Q: Can I compare more than two files at once?**

A: `compare-pair` accepts one before-document and one after-document, but you can pre-compose either side into a multi-file bundle using the `BEGIN FILE`/`END FILE` markers described in Section 4.

---

## 8. VERIFICATION

| Check | Result |
|---|---|
| `python3 scripts/validate_report.py <report>` | `PASS` (asserts doctype, `lang`, a CSP meta tag, zero `<script>`, no inline handlers, no remote resources) |
| Source unchanged | The source file stays byte-for-byte identical before and after `compare`/`compare-pair` |
| Manual scenarios | `manual-testing-playbook/manual-testing-playbook.md` groups scenarios by snapshot lifecycle, comparison formats and safety guarantees |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Authoritative packet contract, routing and rules |
| [`references/README.md`](./references/README.md) | Reference route-map |
| [`references/cli-reference.md`](./references/cli-reference.md) | Full command, flag and exit-code reference |
| [`references/capabilities-and-fidelity.md`](./references/capabilities-and-fidelity.md) | Format support matrix and fidelity tiers |
| [`references/workflow.md`](./references/workflow.md) | Baseline, explicit-pair and snapshot lifecycle |
| [`references/accessibility-contract.md`](./references/accessibility-contract.md) | The report's accessibility guarantees |
| [`assets/fixtures/README.md`](./assets/fixtures/README.md) | Runnable before/after worked example |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Canonical capability inventory |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator-facing validation scenarios |
