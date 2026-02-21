---
description: "Activation triggers, 5 command overview, and decision matrix for when to use visual-explainer"
---
# When To Use

This node defines every activation path: explicit slash commands, keyword triggers, proactive rendering rules, and explicit exclusions. Use it to decide whether to invoke the skill and which command to run.

## The 5 Commands

### `/visual-explainer:generate`
Generate a styled HTML diagram or page from any topic, data, or concept.

**Activate when:** User asks for an architecture diagram, flowchart, data visualization, table render, or any "make this visual" request without a more specific command.

**Argument parsing:**
- Topic or concept (required)
- Diagram type hint (optional: `--type flowchart`, `--type er`, etc.)
- Aesthetic hint (optional: `--style blueprint`, `--style neon`, etc.)

**Defaults:** Auto-detect diagram type using the decision tree in [[diagram-types]]. Auto-detect aesthetic from content tone.

---

### `/visual-explainer:diff-review`
Visual review of git diffs, PR changes, or commit ranges. Produces a structured 10-section HTML review page.

**Activate when:** User provides a PR number, branch name, commit hash, or says "review this diff / PR / changes".

**Argument parsing:**
- Branch name, PR number, or commit range (required)
- Optional: `--repo` for cross-repo context

**Default aesthetic:** Blueprint (technical, precise feel matches code review context).

**Data gathering:** Calls `workflows-git` to collect diff output, changed file list, commit messages, and PR description.

---

### `/visual-explainer:plan-review`
Visual analysis of a plan document — produces a structured 9-section HTML analysis page.

**Activate when:** User provides a path to a `plan.md` or `spec.md`, or says "visually review this plan".

**Argument parsing:**
- File path to plan document (required)
- Optional: spec folder path for context loading from `system-spec-kit` memory

**Default aesthetic:** Editorial (structured, document-like feel matches plan review context).

**Data gathering:** Reads the plan file, loads memory context from the associated spec folder if available.

---

### `/visual-explainer:recap`
Visual recap of recent work or project progress — produces an 8-section HTML recap page.

**Activate when:** User says "recap", "summarize progress", "what happened this week", or provides a time window like "last 2 weeks".

**Argument parsing:**
- Time window (required: `1d`, `1w`, `2w`, `1m`, or a date range)
- Optional: spec folder for memory context

**Default aesthetic:** Data-dense (maximizes information per viewport).

**Data gathering:** Loads `system-spec-kit` memory entries from the time window. May call `workflows-git` for commit history.

---

### `/visual-explainer:fact-check`
Verify accuracy of an existing HTML visual output against source material. Produces a corrected file and a diff summary.

**Activate when:** User provides a path to an existing HTML output and asks to verify, correct, or fact-check it.

**Argument parsing:**
- Path to existing HTML file (required)
- Path to source document or spec (optional — used for comparison)

**Default aesthetic:** N/A — preserves the aesthetic of the input file.

**Output:** A corrected HTML file (overwrites or saves as `*-corrected.html`) plus a plain-text summary of changes made.

---

## Keyword Triggers (Auto-Activate Without Command)

Activate `generate` by default when user message contains any of:

| Keyword | Confidence |
|---------|-----------|
| `visual` | High |
| `diagram` | High |
| `generate HTML` | High |
| `flowchart` | High |
| `architecture diagram` | High |
| `mermaid` | High |
| `chart` | High |
| `sequence diagram` | High |
| `timeline` | High |
| `dashboard` | High |
| `render` | Medium |
| `visualization` | Medium |
| `styled page` | Medium |
| `table render` | Medium |
| `data table` | Medium |

If confidence is Medium and no other context confirms visual output, ask: "Should I generate an HTML visual for this?"

---

## Proactive Trigger: Auto-Render Tables

Automatically render a styled HTML table — without being asked — when a response contains tabular data meeting either condition:

- **4 or more rows**, OR
- **3 or more columns**

Announce before rendering: *"I'm rendering this as a styled HTML table for readability."*

Default aesthetic for proactive tables: **Data-dense** (maximum information density, compact layout).

---

## Decision Matrix: Which Command?

| Situation | Command |
|-----------|---------|
| "Make a diagram of X" | `generate` |
| "Review PR #47" | `diff-review` |
| "Visually review specs/007/plan.md" | `plan-review` |
| "Recap the last 2 weeks" | `recap` |
| "Check if this HTML is accurate" | `fact-check` |
| Response has 4+ row table | Auto-render with `generate` |
| "Show me the architecture of this system" | `generate` |
| "What changed in this branch?" | `diff-review` |
| "Summarize what we've done" | `recap` |
| "Is this diagram correct?" | `fact-check` |

---

## When NOT to Use

Do not activate this skill when:

1. **Plain text is sufficient** — the response is a short explanation, a list of < 4 items, or a 1–3 row table.
2. **React/Vue/Svelte component required** — the user explicitly needs a component file, not standalone HTML.
3. **Server-side rendering required** — the content depends on live API data, database queries, or authentication.
4. **User explicitly requests Markdown** — "give me the table in Markdown", "plain text only".
5. **Content is already visual** — user is viewing an existing diagram and only asking for interpretation.

---

## Cross References
- [[rules]] — Behavioral constraints once activated
- [[commands]] — Full argument contracts and section architecture for each command
- [[diagram-types]] — How to select the right diagram type
- [[aesthetics]] — How to select the right aesthetic profile
