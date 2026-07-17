---
name: create-quality-control
description: Validate, score, and optionally improve existing markdown via structure extraction, DQI scoring, HVR review, and validation gates.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.1.1
---

# Doc Quality (quality)

`create-quality-control` is the existing-document audit and optimization workflow packet of the `sk-doc` family. It evaluates markdown, extracts structure, computes Document Quality Index evidence, applies Human Voice Rules, and, only when explicitly requested, edits the same target document to improve structure, clarity and AI-friendliness.

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
- Validating an edited markdown document before handoff.
- Auditing or validating an existing README or markdown flowchart when no new README or flowchart is being authored.

Keyword triggers: `doc quality`, `/doc:quality`, `audit documentation quality`, `document audit`, `validate a document`, `validate markdown`, `validation rules`, `score this document`, `optimize this doc`, `DQI`, `HVR`, `human voice`, `AI-friendly documentation`, `extract structure`, `quality bar`, `flag`, `model's budget`, `trim`.

### When NOT to Use

Use another `sk-doc` packet when:
- The user wants a brand-new skill, parent hub, README, install guide, agent, command, feature catalog, manual testing playbook, benchmark package, flowchart, or changelog. Use `create-skill`, `create-readme`, `create-agent`, `create-command`, `create-feature-catalog`, `create-manual-testing-playbook`, `create-benchmark`, `create-flowchart`, or `create-changelog`.
- The task is code implementation, debugging or code review. Use `sk-code`.
- The target is not markdown.
- The user only needs a tiny typo fix and did not ask for validation or scoring.
- The request is a formal PR-style findings review rather than author-side document improvement.

---

## 2. SMART ROUTING

### Family Boundary

This is an independently invokable nested workflow packet under `sk-doc`. It owns existing-document validation and optimization, not artifact scaffolding. It has no packet-local `graph-metadata.json`; the advisor identity lives at the `sk-doc` hub root.

### Smart Router Pseudocode

For this flat-reference packet, the canonical resilient router discovers resources at call
time, guards and loads only what exists, scores the four audit/execution intents documented
in WHEN TO USE, and returns a disambiguation checklist rather than silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"

# Four routing targets this packet distinguishes; keywords come from its activation triggers.
INTENT_MODEL = {
    "validate": {"weight": 4, "keywords": ["validate a document", "validate markdown", "audit documentation quality", "document audit"]},
    "score_dqi": {"weight": 4, "keywords": ["doc quality", "/doc:quality", "score this document", "dqi"]},
    "optimize": {"weight": 4, "keywords": ["optimize this doc", "ai-friendly documentation"]},
    "extract_structure": {"weight": 4, "keywords": ["extract structure", "hvr", "human voice"]},
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the target document and execution mode (report-only audit, structure validation, content optimization, or batch snapshot)",
    "Confirm whether the expected output is a DQI score/report or an optimized rewrite of the document",
    "Confirm the quality-gate or DQI expectation driving this request",
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

def route_quality_control_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                      # Tier 1: unclear target/mode
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    intent = max(scores, key=scores.get)                      # Tier 2: happy path
    # Flat resource topology: no references/<key>/ subdirectories. The intent selects the
    # workflow step already documented below, not a keyed subtree; load the flat refs that exist.
    for path in sorted(inventory):
        load_if_available(path, inventory, loaded, seen)
    return {"intent": intent, "resources": loaded}
```

---

## 3. HOW IT WORKS: CORE WORKFLOW

Follow this workflow from the `SKILL.md` alone. Use references only for overflow examples and exhaustive detail.

### Step 1: Confirm Target and Mode

1. Identify the target markdown file or folder.
2. Read the target before judging or editing it.
3. Determine document type using path, frontmatter and structure:
   - README or install guide.
   - SKILL.md or nested skill packet.
   - Command doc.
   - Reference or knowledge file.
   - Spec-style markdown.
   - Generic markdown.
4. Select one execution mode:
   - **Report-only audit**: default for `/doc:quality` and quality check requests.
   - **Structure validation**: user asks for validation, readiness or blocking issues.
   - **Content optimization**: user asks to improve, rewrite, optimize or edit the existing doc.
   - **Batch snapshot**: user asks to assess multiple docs.

Do not edit in report-only mode. If the user asks for edits after a report-only run, confirm target and scope before modifying files.

### Step 2: Extract Structure

Run structure extraction and treat its output as the source of truth for structure, metrics, checklist results and DQI.

```bash
python ../shared/scripts/extract_structure.py <file>
```

`extract_structure.py` takes only the file path. It always prints its full analysis as JSON to stdout and auto-detects the document type from path and content, so there are no flags to pass here. The `--json` and `--type readme|skill|reference|asset|agent|command|install_guide|spec|changelog` options belong to `validate_document.py` (the validation step below), not the extractor.

Read the JSON output and capture:
- Detected document type.
- Metrics such as word count, heading depth and code ratio.
- Checklist results.
- DQI score and quality band.
- Evaluation prompts or questions surfaced by the extractor.
- Structural violations, missing sections and format issues.

Never claim a DQI score without running or reading `extract_structure.py` output.

### Step 3: Interpret Quality Gates

Classify findings before recommending or editing.

Use this order:
1. **Blocking structural failures**: required frontmatter, required sections, invalid markdown structure, broken required format, README delivery blockers.
2. **Warnings**: weak section order, shallow examples, incomplete usage, poor heading hierarchy, ambiguous document type.
3. **Recommendations**: polish, concision, example expansion, duplicate removal, voice cleanup.

For READMEs, run format validation before claiming completion:

```bash
python ../shared/scripts/validate_document.py <file>
```

For folder or packet checks, run quick validation:

```bash
python ../shared/scripts/quick_validate.py <path>
```

If validation exits non-zero, fix blocking errors when edits are in scope, then re-run the failing command.

### Step 4: Apply HVR Voice Review

Review the target for Human Voice Rules after structural issues are understood.

Flag only issues that matter:
- Overly generic AI phrasing.
- Passive, vague or padded language.
- Claims without actionable evidence.
- Abstract feature lists where examples would help.
- Robotic transitions, repeated sentence shapes or unnecessary throat-clearing.

Do not use HVR as a substitute for structural validation. HVR is a content-quality pass after extraction and gate interpretation.

### Step 5: Report Findings

For report-only, structure-validation or batch modes, produce a concise report with this shape:

```markdown
**Document**
- Path: `<file>`
- Type: `<detected type>`
- Mode: `<report-only|structure validation|batch snapshot>`

**DQI**
- Score: `<score>`
- Band: `<band>`
- Source: `extract_structure.py`

**Blocking Issues**
- `<issue>` or `None`

**Warnings**
- `<issue>` or `None`

**HVR Issues**
- `<issue>` or `None`

**Recommendations**
- `<actionable next step>`
```

For batch snapshot mode:
- Extract each requested file.
- Summarize per-file type, DQI, blockers and top recommendations.
- Do not edit unless the user explicitly requests edits for specific files.

---

## 4. CONTENT OPTIMIZATION WORKFLOW

Use this path only when the user explicitly asks to improve the existing document.

### Step 1: Audit Current State

Before editing, identify:
- Question-answering snippets versus API-only snippets.
- Import-only snippets with no usage.
- Metadata snippets such as licenses, citations, contributor lists or directory trees.
- Duplicate or nearly identical examples.
- Missing answers to common developer questions.
- Code blocks without language tags or complete setup.

### Step 2: Generate Question Coverage

For developer-facing docs, map the document against 15-20 likely questions. Cover the relevant items:
- Installation and setup.
- Basic initialization.
- Authentication methods.
- Primary use cases.
- Configuration options.
- Error handling.
- Advanced features.
- Integration examples.
- Testing approaches.

Core principle: answer questions, do not merely document APIs. Developers ask "How do I...?", not "What is the signature of...?".

### Step 3: Choose Targeted Transformation Patterns

Apply only the patterns needed for the observed gaps:
1. **API reference to usage example**: turn signatures and parameter lists into complete examples.
2. **Import-only to complete setup**: combine imports with initialization and first useful call.
3. **Multiple small snippets to one workflow**: merge fragments into one coherent example.
4. **Remove metadata**: delete licenses, citations, directory trees and governance material that does not help the reader act.
5. **Add error handling**: show realistic failures and recovery.
6. **Combine installation and first usage**: never leave installation as a standalone snippet.
7. **Add configuration examples**: show common dev/prod or option variants.
8. **Demonstrate auth patterns**: include OAuth or token flow when auth is central.
9. **Show batch or bulk operations**: add performance-aware examples when relevant.
10. **Add testing examples**: show how to test code using the library or workflow.
11. **Provide advanced use cases**: include complex real-world scenarios when core docs are already covered.
12. **Add integration examples**: show popular tools or adjacent systems when useful.
13. **Clarify common pitfalls**: show correct and incorrect usage when mistakes are likely.
14. **Add output examples**: show expected result shape.
15. **Consolidate duplicates**: keep one stronger example instead of repeated weak ones.
16. **Fix formatting**: add language tags, valid syntax, necessary imports and consistent naming.

### Step 4: Prioritize README Improvements

For README-style docs, prioritize:
1. Quick Start: installation plus first usage.
2. Common Use Cases: each major feature with a complete example.
3. Error Handling: realistic failure scenarios.
4. Configuration: common settings and environment differences.
5. Advanced Features: complex but practical workflows.
6. Integration Examples: popular ecosystem integrations.
7. Testing: how to test the documented usage.
8. API Reference: keep only when paired with usage examples.

Minimize or remove:
- Installation-only snippets.
- Long feature lists.
- Project governance.
- Licensing text.
- Directory trees unless essential.
- Academic citations.

### Step 5: Edit Narrowly

When edits are in scope:
1. Modify only the target document unless the user explicitly expands scope.
2. Preserve correct existing content.
3. Replace weak sections with actionable examples instead of wholesale rewriting.
4. Do not change product claims, policy text, legal text or canonical spec decisions without escalation.
5. Do not create new artifacts from this packet.

### Step 6: Re-Validate After Edits

After any Write/Edit operation on markdown:
1. Run document validation when applicable.

```bash
python ../shared/scripts/validate_document.py <file>
```

2. Run quick validation for the file or containing packet/folder.

```bash
python ../shared/scripts/quick_validate.py <path>
```

3. Re-run extraction.

```bash
python ../shared/scripts/extract_structure.py <file>
```

4. Compare pre-edit and post-edit results:
   - DQI score and band.
   - Checklist failures.
   - Structural violations.
   - Remaining warnings.
   - Remaining HVR issues.

Do not claim readiness until validation has been run and its result has been read.

---

## 5. ENFORCEMENT FIXES

When validation identifies common structural failures, apply these fixes only if edits are in scope.

### Missing Frontmatter

Detection: SKILL or command file does not start with `---`.

Fix:
1. Determine document type.
2. Ask for missing metadata if it cannot be inferred safely.
3. Insert the correct frontmatter at line 1.
4. Re-run validation and extraction.

### Incorrect Section Order

Detection: required sections are present but out of sequence.

Fix:
1. Identify current section order.
2. Map it to the required order for the detected document type.
3. Reorder sections without changing meaning.
4. Re-run validation and extraction.

### Missing Required Sections

Detection: a required section is absent.

Fix:
1. Identify missing sections.
2. Add the minimal required section at the correct position.
3. Fill only content supported by the document or user request.
4. Re-run validation and extraction.

Escalate instead of guessing when required content needs source evidence that is not present.

---

## 6. RULES

### ✅ ALWAYS

1. Read the target document before judging or editing it.
2. Treat `/doc:quality` as report-only unless the user explicitly asks for edits.
3. Use `../shared/scripts/extract_structure.py` as the source of truth for structure, metrics, checklist results and DQI.
4. Use validation output to distinguish blockers, warnings and recommendations.
5. Apply HVR voice review before final output.
6. Validate edited documents with `../shared/scripts/validate_document.py` when applicable.
7. Re-run `extract_structure.py` after edits to confirm the DQI and checklist state.
8. Keep optimization scoped to the existing target document unless the user expands scope.
9. Report residual risks when the document remains below the requested quality bar.

### ⛔ NEVER

1. Never create a new artifact from this packet. Route creation work to the relevant `sk-doc` workflow packet.
2. Never add a packet-local `graph-metadata.json`.
3. Never overwrite original content wholesale when targeted edits solve the issue.
4. Never claim a DQI score without extraction evidence.
5. Never treat HVR as a substitute for structural validation.
6. Never add a table of contents unless another active project rule explicitly overrides the shared standard.
7. Never broaden an audit into unrelated cleanup across nearby docs.
8. Never fabricate examples, claims, commands or source evidence.

### ⚠️ ESCALATE IF

1. The document type is ambiguous and `--type` cannot safely resolve it.
2. Validation reports blocking failures that require user decisions.
3. The requested optimization would change product claims, policy text, legal text or canonical spec decisions.
4. The document needs new source evidence that is not present in the workspace.
5. The user asks for edits after a report-only `/doc:quality` run but scope or target files are unclear.

---

## 7. SUCCESS CRITERIA

A successful `create-quality-control` run produces:
- Target document type and file path.
- Structure extraction result, including DQI score and quality band.
- Checklist failures grouped by blocking, warning and recommendation.
- HVR voice issues that matter, not cosmetic nitpicks.
- A concise optimization plan when edits are requested.
- Post-edit validation evidence when the workflow changes the document.
- Clear residual risks when the document remains below the requested quality bar.

Edited documents must also satisfy:
- Runnable, standalone examples where examples are present.
- Language-tagged code fences.
- Complete imports and setup when code usage is shown.
- Practical question-answering structure.
- No unnecessary metadata copied into instructional sections.
- No duplicate or near-duplicate examples unless each answers a distinct question.

---

## 8. REFERENCES

Use these only for deep overflow detail, edge cases, exhaustive templates and long examples. Start at the route map, then open the single-concern file the task needs:
- `references/README.md` - Route map over the reference set.
- `references/workflows.md` - The four execution modes and mode selection (externally cited entry file).
- `references/validation_and_enforcement.md` - Validation touchpoints, enforcement approval-prompt templates, phase interactions and troubleshooting.
- `references/workflow_examples.md` - Worked command examples and batch/multi-file processing.
- `references/optimization.md` - Optimization procedure: quality heuristics, analysis workflow, README strategy, checklist and iteration (externally cited entry file).
- `references/transformation_patterns.md` - The 16 transformation patterns with worked before/after examples.
- `../shared/scripts/extract_structure.py` - Structure extraction, metrics, checklist data and DQI.
- `../shared/scripts/validate_document.py` - Pre-delivery document validation gate.
- `../shared/scripts/quick_validate.py` - Fast validation for folders or skill packets.
- `../shared/references/core_standards.md` - Document type detection and structural rules.
- `../shared/references/validation.md` - DQI scoring, quality bands and gate interpretation.
- `../shared/references/hvr_rules.md` - Human Voice Rules for natural documentation style.
