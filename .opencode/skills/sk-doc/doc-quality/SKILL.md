---
name: doc-quality
description: Validate, score and optionally improve existing markdown through structure extraction, DQI scoring, HVR voice review and validation gates.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

# Doc Quality (quality)

`doc-quality` is the document-audit workflow packet of the `sk-doc` family. It evaluates an existing markdown document, reports structure and quality issues, scores it with the Document Quality Index, applies Human Voice Rules and, only when requested, makes targeted edits to improve the same document.

This packet is invoked by `/doc:quality`. The command is report-only by default.

---

## 1. WHEN TO USE

### Activation Triggers

Use this workflow when the request involves:
- Auditing an existing markdown document for structure, clarity, quality or publish readiness.
- Running `/doc:quality` on a README, SKILL.md, command doc, knowledge file, spec doc or generic markdown file.
- Extracting document structure before deciding what to improve.
- Computing or interpreting a DQI score from `../shared/scripts/extract_structure.py`.
- Applying HVR voice checks for AI-pattern cleanup, direct language and natural writing.
- Optimizing existing documentation for AI assistants, question-answering format or practical usage examples.
- Validating an edited document before handoff.

Keyword triggers: `doc quality`, `/doc:quality`, `DQI`, `document audit`, `validate markdown`, `score this document`, `optimize this doc`, `HVR`, `human voice`, `AI-friendly documentation`, `extract structure`.

### When NOT to Use

Skip this workflow when:
- The user wants a brand-new artifact created. Route to the matching `sk-doc` creation packet.
- The task is code implementation, debugging or code review. Use `sk-code`.
- The target is not markdown.
- The user only needs a tiny typo fix and did not ask for validation or scoring.
- The request is a formal PR-style findings review rather than author-side document improvement.

### Family Boundary

This is an independently invokable nested workflow packet under `sk-doc`. It owns existing-document validation and optimization, not artifact scaffolding. It has no packet-local `graph-metadata.json`; the advisor identity lives at the `sk-doc` hub root.

---

## 2. HOW IT WORKS

### Pipeline

Run the workflow in this order:

1. Read the target document and identify its document type using `../shared/references/global/core_standards.md`.
2. Load `references/workflows.md` for execution mode selection.
3. Run structure extraction with `../shared/scripts/extract_structure.py <file>`.
4. Interpret the JSON output using `../shared/references/global/validation.md`.
5. Report DQI score, checklist failures, document type, structural issues and improvement recommendations.
6. Apply HVR review with `../shared/references/global/hvr_rules.md`.
7. If optimization is requested, load `references/optimization.md` and edit only the target document.
8. Validate the final document with `../shared/scripts/validate_document.py <file>`.
9. Re-run `../shared/scripts/extract_structure.py <file>` after edits to confirm the DQI and checklist state.

### Execution Modes

| Mode | Use When | Default Behavior |
| --- | --- | --- |
| Report-only audit | `/doc:quality` or quality check requests | Extract, score, assess and report without edits |
| Structure validation | User asks for validation or publish readiness | Run validation scripts and identify blockers |
| Content optimization | User asks to improve the document | Edit targeted sections, then validate |
| Batch snapshot | User asks to assess multiple docs | Extract and summarize, do not edit unless requested |

### Script Commands

Run scripts from the packet or skill root with paths adjusted as needed:

```bash
python ../shared/scripts/extract_structure.py <file>
python ../shared/scripts/validate_document.py <file>
python ../shared/scripts/quick_validate.py <path>
```

Use `--json` when another agent or command needs machine-readable output. Use `--type readme|skill|reference|asset|agent` when path-based type detection is ambiguous.

### Optimization Focus

Use `references/optimization.md` for targeted improvements:
- Convert API-reference prose into usage examples.
- Replace import-only snippets with complete setup and first use.
- Add missing error handling, configuration and output examples.
- Remove metadata that does not help the reader act.
- Deduplicate repeated sections or nearly identical examples.
- Make examples runnable, tagged and self-contained.
- Prioritize answering real "How do I..." questions over listing features.

---

## 3. RULES

### ALWAYS

1. Read the target document before judging or editing it.
2. Treat `/doc:quality` as report-only unless the user explicitly asks for edits.
3. Load `references/workflows.md` before selecting the workflow mode.
4. Use `../shared/scripts/extract_structure.py` as the source of truth for structure, metrics, checklist results and DQI.
5. Use `../shared/references/global/validation.md` to interpret DQI bands and gate severity.
6. Use `../shared/references/global/hvr_rules.md` for voice cleanup before final output.
7. Validate edited documents with `../shared/scripts/validate_document.py` before claiming the document is ready.
8. Keep optimization edits scoped to the existing target document unless the user expands scope.

### NEVER

1. Never create a new artifact from this packet. Route creation work to the relevant `sk-doc` workflow packet.
2. Never add a packet-local `graph-metadata.json`.
3. Never overwrite original content wholesale when targeted edits solve the quality issue.
4. Never claim a DQI score without running or reading `extract_structure.py` output.
5. Never treat HVR as a substitute for structural validation.
6. Never add a table of contents unless another active project rule explicitly overrides the shared standard.
7. Never broaden an audit into unrelated cleanup across nearby docs.

### ESCALATE IF

1. The document type is ambiguous and `--type` cannot safely resolve it.
2. Validation reports blocking failures that require user decisions, such as missing required sections or incompatible structure.
3. The requested optimization would change product claims, policy text, legal text or canonical spec decisions.
4. The document needs new source evidence that is not present in the workspace.
5. The user asks for edits after a report-only `/doc:quality` run but scope or target files are unclear.

---

## 4. SUCCESS CRITERIA

A successful `doc-quality` run produces:
- Target document type and file path.
- Structure extraction result, including DQI score and quality band.
- Checklist failures grouped by blocking, warning and recommendation.
- HVR voice issues that matter, not cosmetic nitpicks.
- A concise optimization plan when edits are requested.
- Post-edit validation evidence when the workflow changes the document.
- Clear residual risks when the document remains below the requested quality bar.

---

## 5. REFERENCES

- `references/workflows.md` - Workflow modes, validation sequence, troubleshooting and phase interactions.
- `references/optimization.md` - AI-friendly documentation transformation patterns.
- `../shared/scripts/extract_structure.py` - Structure extraction, metrics, checklist data and DQI.
- `../shared/scripts/validate_document.py` - Pre-delivery document validation gate.
- `../shared/scripts/quick_validate.py` - Fast validation for folders or skill packets.
- `../shared/references/global/core_standards.md` - Document type detection and structural rules.
- `../shared/references/global/validation.md` - DQI scoring, quality bands and gate interpretation.
- `../shared/references/global/hvr_rules.md` - Human Voice Rules for natural documentation style.
- `../shared/references/global/quick_reference.md` - Command and quality-gate cheat sheet.
