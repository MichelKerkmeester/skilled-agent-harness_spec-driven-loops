---
name: create-diff
description: Local, Git-free before/after review of an edited document (text, Markdown, HTML, DOCX, text PDF) as a self-contained HTML report.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.1.0.0
---
<!-- Keywords: create-diff, document diff, before after review, before/after document, local html diff report, document snapshot, ai edit review, docx diff, pdf diff, markdown diff -->

# Create Diff

`create-diff` is the `sk-doc` workflow packet for reviewing what changed in a locally edited document — outside Git and without a hosted service. It captures a baseline before an edit, then compares the before and after versions and renders a single self-contained, accessible HTML report. The comparison engine ships with this packet as `scripts/create_diff.py`; everything runs on the machine with no network, no upload, and no telemetry, and source files are never modified.

Supported formats and fidelity tiers: plain text and Markdown (full text fidelity), HTML and DOCX (visible/structural text), and text-layer PDF (conditional on a local extractor). Each report states its fidelity tier so a comparison is never trusted beyond what the extractor can actually see.

This packet owns diff authoring and its two scripts. It uses shared sk-doc standards from `../shared/` for surrounding-document quality. It must not add packet-local advisor metadata such as `graph-metadata.json` or `description.json`.

---

## 1. WHEN TO USE

### Activation Triggers

Use this packet when the request asks to:

- Review what an AI (or anyone) changed in a locally edited document.
- Produce a before/after report for a Markdown, text, HTML, DOCX, or PDF file that is not in Git.
- Capture a baseline of a document before editing it, so the change can be reviewed afterward.
- Compare two explicit versions of a document (an old file and a new file).

Keyword triggers: `create diff report`, `document before/after review`, `before/after document diff`, `document change report`, `review document edits`, `docx diff`, `pdf diff`.

### When NOT to Use

Route elsewhere when:

- The files are code or already tracked in Git — use `git`/`sk-git` for source diffs.
- The comparison is visual or design-oriented (layout, pixels, screenshots) — use `sk-design`.
- The task is auditing, scoring, or validating a single existing document rather than comparing two states — use `create-quality-control`.
- The deliverable is a README, skill, command, agent, changelog, or flowchart — use the matching `create-*` packet.

If the target document or output path is unknown and acting would be a guess, ask before writing.

---

## 2. SMART ROUTING

This packet ships a flat `references/` route-map and worked-example fixtures under `assets/`; there are no `references/<key>/` or `assets/<key>/` subdirectories to infer. Routing is intent-based:

- If the request clearly asks for a before/after document review, route here and pick the workflow shape in section 3 (automatic baseline vs. explicit pair).
- If the target document, baseline state, or output path is unclear, use `UNKNOWN_FALLBACK`: confirm the document, whether a baseline exists, and the report path before acting.
- If a referenced resource is missing, do not invent a path — use the nearest guidance in `references/README.md` and report the gap.
- Do not hijack routing from functional siblings when the intent is not clearly a document before/after review.

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"

# Two workflow shapes for one intent: automatic (snapshot-backed) or explicit pair.
INTENT_MODEL = {
    "auto_capture_compare": {"weight": 4, "keywords": ["review edits", "before/after", "before after review", "document change report", "what changed"]},
    "explicit_pair": {"weight": 4, "keywords": ["compare two files", "old and new", "before and after files", "explicit pair"]},
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the target document (and its format)",
    "Confirm whether a baseline snapshot already exists",
    "Confirm the output report path",
]

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path, inventory, loaded, seen) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def score_intents(request) -> dict:
    text = request.text.lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw in cfg["keywords"]:
            if kw in text:
                scores[intent] += cfg["weight"]
    return scores

def route_diff_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                      # Tier 1: target/baseline/output unclear
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    shape = max(scores, key=scores.get)                       # Tier 2: workflow shape resolved
    for path in sorted(inventory):
        load_if_available(path, inventory, loaded, seen)
    return {"shape": shape, "resources": loaded}
```

---

## 3. HOW IT WORKS

All comparison, extraction, snapshotting, and rendering are done by `scripts/create_diff.py`. Run it from this packet directory (or give an absolute path to it). The invariant is: **capture the baseline before the edit** — a diff needs a real before-state.

### Automatic flow (snapshot-backed)

```bash
# 0. (optional) confirm what is supported and at what fidelity
python3 scripts/create_diff.py capabilities

# 1. BEFORE the edit — capture a baseline (copies the file into a local .create-diff/ store;
#    never touches the source)
python3 scripts/create_diff.py snapshot path/to/doc.md

# 2. ... let the edit happen (AI or human) ...

# 3. AFTER the edit — compare the current file against its latest baseline and render the report
python3 scripts/create_diff.py compare path/to/doc.md --report review.html
```

### Explicit-pair flow (fallback — no stored state needed)

Use this when there is no baseline, when comparing two arbitrary versions, or when the automatic store is unavailable:

```bash
python3 scripts/create_diff.py compare-pair --before old.md --after new.md --report review.html
```

### Report and verification

- The report is a single self-contained HTML file (inlined CSS, no scripts, no network). Views: `--view unified` (default) or `--view side-by-side`.
- Always verify a generated report is safe and self-contained before handing it off:

```bash
python3 scripts/validate_report.py review.html
```

### Lifecycle helpers

```bash
python3 scripts/create_diff.py status [path/to/doc.md]      # list stored baselines
python3 scripts/create_diff.py cleanup --older-than 14      # prune old baselines (add --dry-run to preview)
```

### Machine-readable output and exit codes

Add `--json` to `compare`, `compare-pair`, `capabilities`, or `status` for a structured summary. Exit codes: `0` success · `2` usage error · `3` unsupported/limited format with no fallback · `4` missing baseline snapshot · `5` I/O or extraction failure. Map these to actionable messages rather than swallowing them.

---

## 4. CAPABILITY & FIDELITY TIERS

State the tier to the user; never present a low-fidelity comparison as complete.

| Format | Tier | What is compared | Not compared |
| --- | --- | --- | --- |
| text | full | exact text | — |
| markdown | full | exact text + heading/section awareness | rendered-HTML differences |
| html | text | visible text | CSS, attributes, inline styles, scripts, layout |
| docx | text | paragraph and table text | formatting, styles, images, comments, tracked changes |
| pdf | text* | text layer only | layout, images; scanned/image-only PDFs (no OCR) |

`text*` (PDF) requires a local extractor — poppler's `pdftotext` or the `pypdf`/`pdfplumber` package. Run `capabilities` to see what is available; when none is, the engine says so and offers the explicit-pair fallback with pre-extracted text. Full detail: `references/capabilities-and-fidelity.md`.

---

## 5. RULES

### ✅ ALWAYS

- Capture the baseline **before** the edit; that ordering is an invariant.
- Keep everything local — no network, upload, or telemetry.
- State the format fidelity tier and any warnings honestly.
- Read a file before editing it; never modify the source document during comparison.
- Run `scripts/validate_report.py` on a generated report before handing it off, and report the result.
- Offer the explicit-pair fallback when no valid baseline exists.

### ⛔ NEVER

- Never mutate, overwrite, or "fix up" the source document — capture and comparison are read-only against it.
- Never present a `text`/`text*`-tier comparison as if it captured formatting, layout, or tracked changes.
- Never claim a diff was produced when the format was unsupported and no fallback ran.
- Never add packet-local `graph-metadata.json` or `description.json`.
- Never send document content off-machine or fetch a remote resource into the report.

### ⚠️ ESCALATE

- When a PDF has no text layer (appears scanned) — the comparison would be empty; OCR is out of scope.
- When the document format is unsupported and no explicit pre-extracted pair can be provided.
- When the target document or output path is unknown and acting would be a guess.

---

## 6. VERIFICATION

Before delivery:

1. Confirm the source file is byte-for-byte unchanged (compare should never write to it).
2. Run `python3 scripts/validate_report.py <report>` → expect `PASS` (asserts doctype, `lang`, a Content-Security-Policy meta tag, zero `<script>`, no inline event handlers, no remote resource references).
3. Report the change summary (`+added −removed ~changed`, possible moves, fidelity tier) and the report path.

If the validator fails, fix the renderer or report the failure explicitly — do not claim a clean, self-contained report.

---

## 7. SUCCESS CRITERIA

The task is successful when:

- The correct workflow shape is used (automatic baseline when one exists; explicit pair otherwise), and code/Git/design/audit requests are deferred to their owners.
- The baseline was captured before the edit, or the explicit-pair fallback was used, and the source file is unchanged.
- A single self-contained, accessible HTML report is produced and passes `validate_report.py`.
- The fidelity tier and any warnings are stated; a limited-fidelity result is never presented as complete.
- All processing stayed local, and no packet-local advisor metadata was created.

---

## 8. INTEGRATION POINTS

- **sk-doc parent hub** — this packet is registered in `../mode-registry.json` and `../hub-router.json`; the single advisor identity and workflow registry live at the hub root, not here.
- **Shared backbone** — `../shared/` provides sk-doc quality standards and the document validator for surrounding markdown when that is in scope.
- **Canon gates** — `parent-skill-check.cjs`, `create-skill/scripts/package_skill.py --check`, and `scripts/check-frontmatter-versions.sh` validate this packet's registration and shape.
- **`/create:diff` command** — the mode is invocable as `/create:diff` (`:auto`/`:confirm`) via a full sibling-pattern router plus presentation and auto/confirm YAML assets under `.opencode/commands/create/`, alongside advisor-alias routing and direct script invocation.
- **Sibling boundaries** — hands off to `sk-git` (code/Git diffs), `sk-design` (visual comparison), and `create-quality-control` (single-document audit).

---

## 9. RELATED RESOURCES

- `references/README.md` — reference route-map (capabilities/fidelity, workflow, CLI reference, accessibility contract, worked example).
- `feature-catalog/feature-catalog.md` — canonical inventory of this mode's capabilities.
- `manual-testing-playbook/manual-testing-playbook.md` — operator-facing manual validation scenarios.
- `assets/fixtures/` — a runnable before/after worked example.
- `../shared/` — shared sk-doc quality standards and document validator.
- Engine and mode design: `.opencode/specs/sk-doc/033-create-diff-mode/` (parent spec, phase `006-opencode-skill-and-accessibility`, research synthesis in `001-research-and-requirements/research/research.md`).

---

## 10. REFERENCES

- `scripts/create_diff.py` — the comparison engine (extraction, diff, snapshots, report).
- `scripts/validate_report.py` — report safety/self-containment validator.
- `references/cli-reference.md` — full command, flag, and exit-code reference.
- `references/capabilities-and-fidelity.md` — format support matrix and fidelity tiers.
- `references/workflow.md` — baseline-capture, explicit-pair, and snapshot lifecycle.
- `references/accessibility-contract.md` — the report's accessibility guarantees.
- `references/worked-example.md` — an end-to-end walkthrough using the shipped fixtures.
