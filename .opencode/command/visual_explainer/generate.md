---
description: Generate a styled, self-contained HTML visualization from a topic, concept, or terminal output
argument-hint: "<topic> [--type <architecture|flowchart|sequence|data-flow|er|state|mindmap|table|timeline|dashboard>] [--style <terminal|editorial|blueprint|neon|paper|hand-drawn|ide|data-dense|gradient>]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

```
IF $ARGUMENTS is empty, undefined, whitespace-only, or contains only flags:
    -> STOP IMMEDIATELY
    -> Ask:
        question: "What would you like to visualize?"
        options:
          - label: "Topic or concept"
            description: "A technical subject like architecture, workflow, or schema"
          - label: "Terminal output"
            description: "CLI logs or command output that should be explained visually"
          - label: "Code/system artifact"
            description: "A file, diff, plan, or implementation area to visualize"
    -> WAIT for user response
    -> Use that answer as <topic>
    -> Only THEN continue

IF $ARGUMENTS contains a non-flag topic:
    -> Continue reading this file
```

**CRITICAL RULES:**
- **DO NOT** infer the topic from prior conversation context.
- **DO NOT** assume a diagram type or style without either explicit input or documented defaults.
- **DO NOT** proceed without an explicit topic from `$ARGUMENTS` or user reply.
- Topic and options MUST come from the current command invocation.

---

# Visual Explainer Generate

Create a styled, self-contained HTML artifact using the visual explainer 4-phase workflow (Think, Structure, Style, Deliver).

---

## 1. PURPOSE

Generate a polished HTML visualization for a technical topic, concept, or terminal output. Keep the output static, portable, and readable in both light and dark themes.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` with required `<topic>` and optional `--type` / `--style` flags.
**Outputs:** `.opencode/output/visual/generate-{desc}-{timestamp}.html`
**Status:** `STATUS=OK ACTION=create PATH=<output-path>` or `STATUS=FAIL ERROR="<message>"`

---

## 3. REFERENCE

Load `sk-visual-explainer` and required references before generating:
- `.opencode/skill/sk-visual-explainer/SKILL.md`
- `references/quick_reference.md` (always)
- `references/css_patterns.md` (always)
- `references/library_guide.md` (if Mermaid, Chart.js, or anime.js is used)
- `references/navigation_patterns.md` (if output has 4+ major sections)
- `references/quality_checklist.md` (before final delivery)

---

## 4. USER INPUT

Parse `$ARGUMENTS` with this contract:
- `<topic>`: required non-flag text
- `--type`: optional visual structure hint (`architecture`, `flowchart`, `sequence`, `data-flow`, `er`, `state`, `mindmap`, `table`, `timeline`, `dashboard`)
- `--style`: optional aesthetic override (`terminal`, `editorial`, `blueprint`, `neon`, `paper`, `hand-drawn`, `ide`, `data-dense`, `gradient`)

Defaults when omitted:
- `--type`: infer from topic using `references/quick_reference.md`
- `--style`: infer from topic/type using `references/css_patterns.md`

---

## 5. INSTRUCTIONS

### Step 1: Resolve Inputs and Defaults

- Confirm `<topic>` is explicit and non-empty.
- Parse optional `--type` and `--style` flags.
- If flags are invalid, return `STATUS=FAIL` with a supported-value hint.

### Step 2: Think Phase

- Identify audience and explanatory goal.
- Choose the most appropriate visual representation for the topic.
- Capture key points that must appear in the output.

### Step 3: Structure Phase

- Load the closest matching starter from `assets/templates/`.
- Build semantic HTML sections (`header`, `main`, `section`, `figure`, `figcaption`).
- Choose renderer strategy: Mermaid, Chart.js, HTML table, or CSS layout.

### Step 4: Style Phase

- Apply the selected aesthetic via `--ve-*` CSS custom properties.
- Ensure readable typography and visual hierarchy.
- Add meaningful animation with reduced-motion fallback.
- Provide light and dark theme compatibility.

### Step 5: Deliver Phase

- Run all quality checks in `references/quality_checklist.md`.
- Save file to `.opencode/output/visual/generate-{desc}-{timestamp}.html`.
- Open in browser.

### Step 6: Return Structured Status

- Success: `STATUS=OK ACTION=create PATH=<output-path>`
- Failure: `STATUS=FAIL ERROR="<message>"`

---

## 6. ERROR HANDLING

| Condition | Action |
| --- | --- |
| Missing or whitespace-only topic | Ask the mandatory gate question and wait |
| Unsupported `--type` or `--style` value | Return `STATUS=FAIL` with supported options |
| Output folder unavailable | Create folder, then retry save |
| Validation checks fail | Fix issues and rerun checks before returning |

---

## 7. COMPLETION REPORT

After successful execution, return:

```text
STATUS=OK ACTION=create PATH=<output-path>
SUMMARY="Generated visual explainer HTML using Think/Structure/Style/Deliver workflow"
```

---

## 8. EXAMPLES

```bash
/visual-explainer:generate "CI/CD pipeline architecture"
/visual-explainer:generate "database schema" --type er --style blueprint
/visual-explainer:generate "git branching strategy" --type flowchart
```
