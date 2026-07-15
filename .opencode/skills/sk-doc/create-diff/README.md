# create-diff

Local, Git-free before/after review of an edited document — text, Markdown, HTML, DOCX, or text PDF — rendered as a single self-contained, accessible HTML report.

## 1. OVERVIEW

This workflow packet reviews what changed in a locally edited document without Git and without a hosted service. It captures a baseline before an edit, then compares the before and after versions and produces one self-contained HTML report (inlined CSS, zero JavaScript, no network). The comparison engine ships here as `scripts/create_diff.py`; everything runs on the machine and the source file is never modified.

## 2. WHEN TO USE

Use this packet when you need to:

- Review what an AI (or anyone) changed in a locally edited document.
- Produce a before/after report for a Markdown, text, HTML, DOCX, or PDF file outside Git.
- Capture a baseline of a document before editing it.
- Compare two explicit versions of a document (old file vs. new file).

Do not use it for code or Git-tracked files (use `git`/`sk-git`), for visual/design comparison (use `sk-design`), or for auditing a single existing document (use `create-quality-control`).

## 3. WHAT'S INSIDE

- `SKILL.md`
  The authoritative packet contract: activation triggers, routing, the diff workflow, capability tiers, rules, and success criteria.

- `scripts/create_diff.py`
  The comparison engine: format extraction (text, Markdown, HTML, DOCX, text PDF), deterministic line + inline word diff, content-addressed baseline snapshots, and the self-contained HTML report renderer. Python 3 standard library only (PDF optionally uses `pdftotext`/`pypdf`/`pdfplumber` when present).

- `scripts/validate_report.py`
  Asserts a generated report is safe and self-contained: correct doctype, `lang`, a Content-Security-Policy meta tag, zero `<script>`, no inline event handlers, and no remote resource references.

- `references/`
  Overflow guidance behind a route-map: `README.md` (reference map), `capabilities-and-fidelity.md` (format matrix + tiers), `workflow.md` (baseline/explicit-pair/lifecycle), `cli-reference.md` (commands, flags, exit codes), `accessibility-contract.md` (report guarantees), and `worked-example.md` (end-to-end walkthrough).

- `assets/fixtures/`
  A runnable before/after worked example (`onboarding-before.md`, `onboarding-after.md`) plus a short `README.md`.

- `feature-catalog/`
  Canonical inventory of what this mode does today: a root `feature-catalog.md` plus per-feature reference files grouped by capability area.

- `manual-testing-playbook/`
  Operator-facing manual validation package: a root `manual-testing-playbook.md` plus per-scenario files with deterministic prompts, commands, expected signals, and pass/fail criteria.

- `changelog/`
  Versioned packet changelog entries.

For shared markdown standards and the document-level validator, this packet reuses `../shared` rather than duplicating them.

## 4. QUICK START

`SKILL.md` holds the authoritative workflow — read it first. In brief, from this packet directory:

```bash
# BEFORE the edit: capture a baseline (never touches the source)
python3 scripts/create_diff.py snapshot path/to/doc.md

# AFTER the edit: compare against the baseline and render the report
python3 scripts/create_diff.py compare path/to/doc.md --report review.html

# Or compare two explicit files (no stored state needed)
python3 scripts/create_diff.py compare-pair --before old.md --after new.md --report review.html

# Verify the report is safe/self-contained before handoff
python3 scripts/validate_report.py review.html
```

Run `python3 scripts/create_diff.py capabilities` to see supported formats and fidelity tiers. Try it against the shipped fixtures — see `assets/fixtures/README.md`.

## 5. HUB RELATIONSHIP

`create-diff` is a nested workflow packet of the `sk-doc` parent hub. The shared backbone lives at `../shared`. The single advisor identity and workflow registry live at the hub root (`../mode-registry.json`, `../hub-router.json`), not inside this packet. This packet must not add packet-local advisor metadata such as `graph-metadata.json`.
