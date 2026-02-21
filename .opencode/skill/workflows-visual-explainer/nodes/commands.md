---
description: "Full contracts for all 5 visual-explainer slash commands including argument parsing, data gathering, section architecture, and output specs"
---
# Commands

This node defines the full contract for each of the 5 slash commands. Every command has a defined input, data-gathering phase, verification checkpoint, section architecture, and output convention.

---

## Command Overview

| Command | Input | Output | Default Aesthetic |
|---------|-------|--------|-------------------|
| `/visual-explainer:generate` | Topic + optional type/style | Diagram HTML page | Auto-detect |
| `/visual-explainer:diff-review` | Branch/commit/PR# | 10-section review page | Blueprint |
| `/visual-explainer:plan-review` | Plan file path | 9-section analysis page | Editorial |
| `/visual-explainer:recap` | Time window (e.g., `2w`) | 8-section recap page | Data-dense |
| `/visual-explainer:fact-check` | HTML file path | Corrected file + summary | Preserve source |

---

## `/visual-explainer:generate`

**Purpose:** Generate a styled HTML diagram or page from any topic, data set, or concept.

### Argument Parsing

```
/visual-explainer:generate [topic] [--type TYPE] [--style STYLE] [--audience AUDIENCE]
```

| Argument | Required | Values | Default |
|----------|----------|--------|---------|
| `topic` | Yes | Free text, concept, or file path | — |
| `--type` | No | See [[diagram-types]] for all 11 options | Auto-detect |
| `--style` | No | See [[aesthetics]] for all 9 options | Auto-detect from content tone |
| `--audience` | No | `developer`, `manager`, `stakeholder` | `developer` |

**Examples:**
```
/visual-explainer:generate the authentication flow for this API
/visual-explainer:generate the database schema --type er --style blueprint
/visual-explainer:generate weekly metrics --type dashboard --style neon
```

### Data Gathering Phase

1. Read source material if a file path is provided (`Read` tool)
2. Identify all entities, relationships, and data points to be represented
3. Confirm diagram type — if ambiguous, present 2–3 options and wait for user input
4. Confirm aesthetic — if not specified, auto-select based on content type and diagram type compatibility matrix

### Verification Checkpoint

Before writing HTML: state the chosen diagram type, aesthetic, and a brief section outline. Ask "Does this match your intent?" if confidence < 80% on any choice.

### Section Architecture

There is no fixed section count — `generate` is flexible. Typical structure:

1. **Header** — Page title, subtitle, metadata (date, source, version)
2. **Primary Diagram** — The main visual (Mermaid / Chart.js / CSS)
3. **Supporting Detail** — Explanatory cards, tables, or sub-diagrams (as needed)
4. **Notes / Legend** — Annotations, color key, assumptions (as needed)

Add sticky navigation if 4+ sections.

### Output

```
.opencode/output/visual/generate-{description}-{timestamp}.html
```

---

## `/visual-explainer:diff-review`

**Purpose:** Produce a structured 10-section visual review of a git diff, PR, or commit range.

### Argument Parsing

```
/visual-explainer:diff-review [target] [--repo REPO_PATH]
```

| Argument | Required | Values | Default |
|----------|----------|--------|---------|
| `target` | Yes | PR number (`47`), branch name (`feature/auth`), commit hash, or range (`main..HEAD`) | — |
| `--repo` | No | Path to git repo | Current working directory |

**Examples:**
```
/visual-explainer:diff-review 47
/visual-explainer:diff-review feature/auth-refactor
/visual-explainer:diff-review main..HEAD --repo /path/to/repo
```

### Data Gathering Phase

Call `workflows-git` skill to collect:
1. List of changed files with +/- line counts
2. Full diff output (or summarized diff for large PRs)
3. Commit messages for all commits in range
4. PR title and description (if available via `gh pr view`)
5. Failing CI checks (if available)

### Verification Checkpoint

After gathering data, report: "{N} files changed, {+X/-Y} lines, {Z} commits. Ready to generate visual review?" Pause if > 50 files or > 2000 lines changed — ask if user wants a summary view or full detail.

### Section Architecture (10 sections)

1. **Executive Summary** — Lead with the intuition: why do these changes exist? What problem were they solving, what was the core insight? Then the factual scope (X files, Y lines, Z new modules). Use hero depth: larger type (20–24px), subtle accent-tinted background, more padding than other sections.

2. **KPI Dashboard** — Lines added/removed, files changed, new modules, test counts. Include a housekeeping indicator: whether `CHANGELOG.md` was updated (green/red badge) and whether docs need changes (green/yellow/red).

3. **Module Architecture** — How the file structure changed, with a Mermaid dependency graph of the current state. Wrap in `.mermaid-wrap` with zoom controls (+/−/reset buttons), Ctrl/Cmd+scroll zoom, and click-and-drag panning.

4. **Major Feature Comparisons** — Side-by-side before/after panels for each significant area of change (UI, data flow, API surface, config, etc.). Apply `min-width: 0` on all grid/flex children and `overflow-wrap: break-word` on panels.

5. **Flow Diagrams** — Mermaid flowchart, sequence, or state diagrams for any new lifecycle/pipeline/interaction patterns. Same zoom controls as section 3.

6. **File Map** — Full tree with color-coded new/modified/deleted indicators. Use `<details>` collapsed by default for pages with many sections.

7. **Test Coverage** — Before/after test file counts and what's covered.

8. **Code Review** — Structured Good/Bad/Ugly analysis:
   - **Good**: Solid choices, improvements, clean patterns worth calling out
   - **Bad**: Concrete issues — bugs, regressions, missing error handling, logic errors
   - **Ugly**: Subtle problems — tech debt, maintainability concerns, things that work now but will cause issues later
   - **Questions**: Anything unclear or that needs author clarification
   - Use styled cards with green/red/amber/blue left-border accents. Each item references specific files and line ranges.

9. **Decision Log** — For each significant design choice in the diff, a styled card with:
   - **Decision**: one-line summary of what was decided
   - **Rationale**: why this approach — constraints, trade-offs, what it enables
   - **Alternatives considered**: what was rejected and why
   - **Confidence**: sourced from conversation/docs (green border) | inferred from code (blue border, labeled "inferred") | not recoverable (amber border, warn to document before committing)

10. **Re-entry Context** — A concise note from present-you to future-you covering:
    - **Key invariants**: assumptions the changed code relies on that aren't enforced by types or tests
    - **Non-obvious coupling**: files or behaviors connected in ways not visible from imports alone
    - **Gotchas**: things that would surprise someone modifying this code in two weeks
    - **Don't forget**: follow-up work required (migration, config update, docs)
    - Use `<details>` collapsed by default.

**Visual hierarchy:** Sections 1–3 should dominate the viewport on load (hero depth, larger type, more padding). Sections 6+ are reference material — flat or recessed depth, compact layout, collapsible where appropriate.

**Default aesthetic:** Blueprint (technical, grid-based, precise).

### Output

```
.opencode/output/visual/diff-review-{target}-{timestamp}.html
```

---

## `/visual-explainer:plan-review`

**Purpose:** Produce a structured 9-section visual analysis of a plan or spec document.

### Argument Parsing

```
/visual-explainer:plan-review [file-path] [--spec-folder FOLDER]
```

| Argument | Required | Values | Default |
|----------|----------|--------|---------|
| `file-path` | Yes | Path to plan.md, spec.md, or similar | — |
| `--spec-folder` | No | Spec folder path for memory context loading | Auto-detect from file path |

**Examples:**
```
/visual-explainer:plan-review .opencode/specs/007-auth/plan.md
/visual-explainer:plan-review specs/138-hybrid-rag-fusion/002-skill-graph-integration/plan.md
```

### Data Gathering Phase

1. Read the plan file (`Read` tool)
2. If `--spec-folder` provided or inferable: load memory context from `system-spec-kit`
3. Extract: objectives, tasks, decisions, risks, dependencies, timeline estimates
4. Identify gaps: missing sections, unresolved decisions, undefined dependencies

### Verification Checkpoint

Report extracted structure: "{N} objectives, {M} tasks, {K} open decisions found. Proceeding with visual analysis." Pause if plan.md is missing critical sections (no objectives, no tasks) — ask user to confirm intent.

### Section Architecture (9 sections)

1. **Executive Summary** — Spec title, level, status, one-paragraph objective summary
2. **Objectives Map** — Visual hierarchy of goals and sub-goals (Mermaid mindmap or card grid)
3. **Task Breakdown** — P0/P1/P2 tasks with status indicators, grouped by phase
4. **Decision Record** — Open vs. closed decisions, rationale where available
5. **Dependency Graph** — Skill, system, and spec dependencies (Mermaid graph)
6. **Risk Analysis** — Known risks with impact/likelihood matrix
7. **Timeline** — Phase dates or estimates as a visual timeline
8. **Gap Analysis** — Missing information, unresolved blockers, undefined scope
9. **Validation Checklist** — Level-appropriate completeness checks (L1/L2/L3)

**Default aesthetic:** Editorial (document-like, structured, generous whitespace).

### Output

```
.opencode/output/visual/plan-review-{spec-slug}-{timestamp}.html
```

---

## `/visual-explainer:recap`

**Purpose:** Produce an 8-section visual recap of recent work and progress within a time window.

### Argument Parsing

```
/visual-explainer:recap [window] [--spec-folder FOLDER] [--include-git]
```

| Argument | Required | Values | Default |
|----------|----------|--------|---------|
| `window` | Yes | `1d`, `3d`, `1w`, `2w`, `1m`, or date range `2026-02-01..2026-02-20` | — |
| `--spec-folder` | No | Spec folder for targeted memory loading | All recent memory entries |
| `--include-git` | No | Flag to include git commit history | `false` |

**Examples:**
```
/visual-explainer:recap 2w
/visual-explainer:recap 1m --spec-folder specs/138-hybrid-rag-fusion
/visual-explainer:recap 1w --include-git
```

### Data Gathering Phase

1. Load `system-spec-kit` memory entries from the time window
2. If `--include-git`: call `workflows-git` for commit history in range
3. Extract: completed tasks, decisions made, blockers encountered, files modified
4. Summarize by spec folder / feature area

### Verification Checkpoint

Report: "Found {N} memory entries, {M} commits, {K} spec folders active in this window. Proceeding with recap." Pause if window produces 0 results — ask user to extend window or check spec folder path.

### Section Architecture (8 sections)

1. **Period Summary** — Date range, total commits, memory entries, spec folders active
2. **Completed Work** — Checked-off tasks by spec folder, sorted by recency
3. **Key Decisions** — Decisions made in this period from memory entries
4. **Files Modified** — Top changed files by commit frequency (if `--include-git`)
5. **Blockers Encountered** — Issues that caused halts or delays, with resolution status
6. **Progress Timeline** — Chronological activity view across the period
7. **Open Items** — Tasks in progress, unresolved decisions, pending reviews
8. **Next Steps** — Extracted "next-steps" anchors from memory entries

**Default aesthetic:** Data-dense (maximum information per viewport, compact layout).

### Output

```
.opencode/output/visual/recap-{window}-{timestamp}.html
```

---

## `/visual-explainer:fact-check`

**Purpose:** Verify accuracy of an existing HTML visual output against source material. Produce a corrected file and a plain-text change summary.

### Argument Parsing

```
/visual-explainer:fact-check [html-file] [--source SOURCE_FILE]
```

| Argument | Required | Values | Default |
|----------|----------|--------|---------|
| `html-file` | Yes | Path to existing HTML visual output | — |
| `--source` | No | Path to source document to check against | Inferred from HTML metadata or ask user |

**Examples:**
```
/visual-explainer:fact-check .opencode/output/visual/generate-auth-arch-20260220.html
/visual-explainer:fact-check output.html --source specs/007-auth/plan.md
```

### Data Gathering Phase

1. Read the HTML file (`Read` tool) — parse all text content, diagram labels, table values, and annotations
2. Read the source document if provided
3. Extract all factual claims from the HTML: entity names, relationship labels, step descriptions, metric values, dates
4. Compare claim by claim against source material

### Verification Checkpoint

Report: "Found {N} factual claims in the HTML, {M} source references. {K} discrepancies detected. Proceeding with corrections." If 0 discrepancies found, report that and offer to run quality checks instead.

### Correction Process

For each discrepancy:
1. Identify the location in the HTML (section, element type, current value)
2. Identify the correct value from source
3. Apply the correction using `Edit` tool (targeted find-and-replace, not full rewrite)
4. Log the change for the summary

### Output

Two outputs:

**1. Corrected HTML file:**
```
.opencode/output/visual/{original-name}-corrected-{timestamp}.html
```
(or overwrite original if explicitly requested)

**2. Plain-text change summary (printed to chat):**
```
Fact-Check Summary: {original-file}
Source: {source-file}
──────────────────────────────────────
{N} discrepancies found and corrected:

1. Section "Authentication Flow", Step 3 label
   Was: "Send token to database"
   Now: "Validate token via Redis cache"

2. Table "API Endpoints", row 3, Method column
   Was: "GET"
   Now: "POST"

{M} items verified as accurate. No changes needed.
──────────────────────────────────────
Quality checks: Run /visual-explainer:fact-check on the corrected file to verify.
```

**Default aesthetic:** N/A — preserves the aesthetic of the input file entirely.

---

## Cross References
- [[when-to-use]] — Decision matrix for choosing between commands
- [[how-it-works]] — The 4-phase workflow each command executes
- [[diagram-types]] — Type selection used in `generate` command
- [[aesthetics]] — Aesthetic defaults and overrides for each command
- [[integration-points]] — Cross-skill calls (workflows-git, system-spec-kit) used by diff-review and recap
