# create-quality-control

Validate, score, and optionally improve existing markdown through structure extraction, DQI scoring, HVR voice review, and validation gates.

## 1. OVERVIEW

`create-quality-control` is the existing-document audit and optimization workflow packet of the `sk-doc` family. It extracts a target document's structure, computes a Document Quality Index (DQI) score and band, applies Human Voice Rules, and, only when edits are explicitly requested, makes targeted improvements to that same document. It is report-only by default and never creates new artifacts. `SKILL.md` is the authoritative contract; this README is human orientation.

## 2. WHEN TO USE

Use `create-quality-control` when you need to audit or improve an existing markdown document.

Good fits:

- Running `/doc:quality` on a README, `SKILL.md`, command doc, spec doc, reference, or other markdown file.
- Checking structure, clarity, publish readiness, or AI-friendliness.
- Computing or interpreting a DQI score from the shared structure extractor.
- Applying HVR voice cleanup after structural issues are known.
- Making targeted improvements to the same document when edits are explicitly requested.

Do not use it for brand-new artifacts. Route new README, skill, agent, command, catalog, benchmark, flowchart, or playbook creation to the matching `sk-doc` creation packet.

## 3. WHAT'S INSIDE

Packet-local files:

- `SKILL.md` - authoritative workflow contract for `create-quality-control`.
- `README.md` - human orientation for this packet.
- `references/README.md` - route map over the reference set (start here).
- `references/workflows.md` - the four execution modes and mode selection (externally cited entry file).
- `references/validation-and-enforcement.md` - validation touchpoints, enforcement approval prompts, phase chaining, and troubleshooting.
- `references/workflow-examples.md` - worked command examples and batch/multi-file processing.
- `references/optimization.md` - optimization procedure: heuristics, analysis workflow, README strategy, checklist, and iteration (externally cited entry file).
- `references/transformation-patterns.md` - the 16 transformation patterns with worked before/after examples.
- `changelog/.gitkeep` - packet-local changelog placeholder.

There are no packet-local `assets/` or `scripts/` directories in `create-quality-control`.

Shared backbone used by this packet:

- `../shared/scripts/extract_structure.py` - source of truth for structure metrics, checklist results, and DQI.
- `../shared/scripts/validate_document.py` - pre-delivery markdown validation gate.
- `../shared/scripts/quick_validate.py` - fast validation for files, folders, or skill packets.
- `../shared/references/filesystem-naming-convention.md` - structural naming authority and exemption boundary.
- `../shared/references/validation.md` - DQI bands and validation severity.
- `../shared/references/hvr-rules.md` - Human Voice Rules for natural documentation style.
- `../shared/references/quick-reference.md` - command and quality-gate cheat sheet.
- `../shared/assets/` - shared templates and rules used across `sk-doc`.

## 4. QUICK START

Report-only audit of one markdown file:

```bash
python ../shared/scripts/check_authored_name_kebab.py README.md
python ../shared/scripts/extract_structure.py README.md
python ../shared/scripts/validate_document.py README.md
```

The authored-name result is a non-scored filename-case conformance signal. It does not alter DQI components or the DQI score.

`extract_structure.py` takes only the file path and auto-detects the document type. If detection is ambiguous, force the type on the validation gate instead (the extractor has no `--type` flag):

```bash
python ../shared/scripts/validate_document.py README.md --type readme
```

Typical workflow:

1. Read the target document.
2. Load `references/README.md` (route map) and, for modes, `references/workflows.md`.
3. Run `../shared/scripts/extract_structure.py <file>`.
4. Interpret DQI and checklist output with `../shared/references/validation.md`.
5. Apply HVR review using `../shared/references/hvr-rules.md`.
6. If the user requested edits, use `references/optimization.md` and edit only the target document.
7. Validate with `../shared/scripts/validate_document.py <file>`.
8. Re-run extraction after edits to confirm the final state.

## 5. HUB RELATIONSHIP

`create-quality-control` is a nested workflow packet of the `sk-doc` parent hub.

The shared create-quality-control backbone lives at `../shared`. The single advisor identity and routing registry live at the hub root: `../graph-metadata.json`, `../description.json`, `../mode-registry.json`, and `../hub-router.json`.

This packet owns existing-document validation and optimization. It does not create new artifacts and must not add a packet-local `graph-metadata.json`.
