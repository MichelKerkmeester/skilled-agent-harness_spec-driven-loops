---
description: Generate a styled, self-contained HTML visualization from a topic, source document, or SpecKit artifact
argument-hint: "<topic-or-source> [--artifact <auto|spec|plan|tasks|checklist|implementation-summary|research|decision-record|readme|install-guide>] [--source-file <path>] [--traceability] [--type <architecture|flowchart|sequence|data-flow|er|state|mindmap|table|timeline|dashboard>] [--style <terminal|editorial|blueprint|neon|paper|hand-drawn|ide|data-dense|gradient>]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

```
IF $ARGUMENTS is empty, undefined, whitespace-only, or contains only flags:
    -> STOP IMMEDIATELY
    -> Ask:
        question: "What should I generate a visual for?"
        options:
          - label: "Topic"
            description: "A concept such as architecture, workflow, or system behavior"
          - label: "Document file"
            description: "A source file like spec.md, plan.md, README.md, or install guide"
          - label: "Terminal output"
            description: "Command output or logs to visualize"
    -> WAIT for user response
    -> Use that reply as <topic-or-source>
    -> Only THEN continue

IF $ARGUMENTS contains a non-flag topic/source:
    -> Continue reading this file
```

**CRITICAL RULES:**
- **DO NOT** infer source file paths from prior conversation context.
- **DO NOT** assume artifact type when `--artifact` is explicitly provided.
- **DO NOT** skip metadata tags for SpecKit-aware outputs.

---

# Visual Explainer Generate

Create a styled, self-contained HTML artifact using the visual explainer 4-phase workflow (Think, Structure, Style, Deliver), with artifact-aware routing for SpecKit and user-guide documents.

---

## 1. PURPOSE

Generate a polished HTML visualization for topics, docs, or terminal output while preserving traceability through explicit artifact metadata.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` with required `<topic-or-source>` and optional flags:
- `--artifact <auto|spec|plan|tasks|checklist|implementation-summary|research|decision-record|readme|install-guide>`
- `--source-file <path>`
- `--traceability`
- `--type <architecture|flowchart|sequence|data-flow|er|state|mindmap|table|timeline|dashboard>`
- `--style <terminal|editorial|blueprint|neon|paper|hand-drawn|ide|data-dense|gradient>`

**Outputs:** `.opencode/output/visual/generate-{desc}-{timestamp}.html`

**SpecKit Metadata Contract:**
- `<meta name="ve-artifact-type" content="<artifact>">`
- `<meta name="ve-source-doc" content="<workspace-relative-path>">`
- `<meta name="ve-speckit-level" content="<1|2|3|3+|n/a>">`
- `<meta name="ve-view-mode" content="<artifact-dashboard|traceability-board>">`

**Status:** `STATUS=OK ACTION=create PATH=<output-path>` or `STATUS=FAIL ERROR="<message>"`

---

## 3. REFERENCE

Load `sk-visual-explainer` and required references before generating:
- `.opencode/skill/sk-visual-explainer/SKILL.md`
- `references/quick_reference.md` (always)
- `references/css_patterns.md` (always)
- `references/speckit_artifact_profiles.md` (if artifact is SpecKit doc)
- `references/speckit_user_guide_profiles.md` (if artifact is `readme` or `install-guide`)
- `references/library_guide.md` (if Mermaid, Chart.js, or anime.js is used)
- `references/navigation_patterns.md` (if output has 4+ major sections)
- `references/quality_checklist.md` (before delivery)

---

## 4. USER INPUT

Parse `$ARGUMENTS` with this contract:
- `<topic-or-source>`: required non-flag text
- `--artifact`: optional artifact override (`auto` default)
- `--source-file`: optional explicit source doc path
- `--traceability`: optional mode switch to traceability board
- `--type`: optional visual structure hint
- `--style`: optional aesthetic override

Defaults when omitted:
- `--artifact`: `auto`
- `--type`: infer from source/topic and profiles
- `--style`: infer from source/type using `references/css_patterns.md`

---

## 5. INSTRUCTIONS

### Step 1: Resolve Inputs and Flags

- Confirm `<topic-or-source>` is explicit and non-empty.
- Parse all supported flags and reject unknown values.
- Resolve effective source file in this order:
  1. `--source-file` if provided
  2. `<topic-or-source>` if it is an existing path
  3. none (topic-only mode)

### Step 2: Resolve Artifact Profile and View Mode

- If `--artifact != auto`, use that artifact.
- If `--artifact=auto`, detect artifact via profile rules:
  - filename signals
  - frontmatter/title signals
  - SpecKit markers (`SPECKIT_LEVEL`, `SPECKIT_TEMPLATE_SOURCE`)
  - section and anchor signatures
- Resolve `ve-view-mode`:
  - `traceability-board` if `--traceability` is set
  - otherwise `artifact-dashboard` for artifact-driven docs
  - otherwise diagram mode based on `--type`/topic

### Step 3: Select Template Strategy

- `artifact-dashboard`: prefer `assets/templates/speckit-artifact-dashboard.html`.
- `traceability-board`: prefer `assets/templates/speckit-traceability-board.html`.
- Non-artifact topic mode: use existing architecture/mermaid/data-table templates.
- Keep output static single-file HTML.

### Step 4: Build Content and Metadata

- Build semantic layout (`header`, `main`, `section`, `figure`, `figcaption`).
- Inject the four SpecKit metadata tags in `<head>` when artifact mode is active.
- For user guides:
  - set `ve-speckit-level` to `n/a`
  - use README/install-guide profile modules.

### Step 5: Validate and Deliver

- Run quality checks from `references/quality_checklist.md`.
- Ensure no placeholder leakage (`[YOUR_VALUE_HERE`, `[PLACEHOLDER]`).
- Save to `.opencode/output/visual/generate-{desc}-{timestamp}.html`.
- Open in browser.

### Step 6: Return Structured Status

- Success: `STATUS=OK ACTION=create PATH=<output-path>`
- Failure: `STATUS=FAIL ERROR="<message>"`

---

## 6. ERROR HANDLING

| Condition | Action |
| --- | --- |
| Missing topic/source | Trigger mandatory gate and wait |
| Invalid `--artifact`, `--type`, or `--style` value | Return `STATUS=FAIL` with supported values |
| Artifact detection ambiguous in `auto` mode | Return `STATUS=FAIL` with request to set explicit `--artifact` |
| Source file unreadable | Return `STATUS=FAIL ERROR="Cannot read source file: <path>"` |
| Validation checks fail | Fix issues and rerun checks before returning |

---

## 7. COMPLETION REPORT

After successful execution, return:

```text
STATUS=OK ACTION=create PATH=<output-path>
SUMMARY="Generated artifact-aware visual explainer HTML with metadata and validation checks"
```

---

## 8. EXAMPLES

```bash
/visual-explainer:generate "CI/CD pipeline architecture"
/visual-explainer:generate "specs/007-auth/plan.md" --artifact plan
/visual-explainer:generate "specs/007-auth/spec.md" --traceability
/visual-explainer:generate "README.md" --artifact readme
/visual-explainer:generate "INSTALL_GUIDE.md" --artifact install-guide
```
