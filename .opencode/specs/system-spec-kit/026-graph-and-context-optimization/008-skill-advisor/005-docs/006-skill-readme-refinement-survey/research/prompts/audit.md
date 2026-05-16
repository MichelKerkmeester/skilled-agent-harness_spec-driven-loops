SKILL-README REFINEMENT AUDIT (read-only, single dispatch)

# Goal

Audit 17 skill README.md files for refinement opportunities mirroring the just-shipped packet 005 (`a1a1ca9d3`): cross-skill coupling, §1 OVERVIEW tables, em dashes, HVR banned words and banned phrases, and frontmatter drift. Emit two artifacts:

1. JSON report at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/006-skill-readme-refinement-survey/research/audit-report.json` (machine-readable, see schema below)
2. Markdown summary at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/006-skill-readme-refinement-survey/research/audit-report.md` (human-readable; cites every finding with file:line and the literal matched substring)

NO file edits beyond those two artifacts. Read-only across the 17 target READMEs.

# Sequential thinking

You MUST call `mcp__sequential_thinking__sequentialthinking` with at least 5 thoughts before emitting either artifact: (1) plan which READMEs to read and in what order, (2) define the cross-skill-coupling judgment criteria precisely, (3) sweep banned-word/phrase lists per file, (4) classify Section 1 tables into "convert to prose" vs "keep but move to a later section", (5) compose the report.

# Target files (17 READMEs)

cli-claude-code, cli-codex, cli-devin, cli-gemini, cli-opencode,
deep-agent-improvement, deep-ai-council, deep-research, deep-review,
mcp-chrome-devtools, mcp-coco-index, mcp-code-mode,
sk-code-review, sk-code, sk-doc, sk-git, sk-prompt.

All located at `.opencode/skills/<skill-name>/README.md`.

# Refinement criteria

For each of the 17 files, build a finding bundle covering:

## 1. Cross-skill coupling

A README is "coupled" when it documents another skill's internals or paths in a way that creates pre-extraction-style drift. The previous packet's example: `system-spec-kit/README.md` documented `advisor_recommend` tool internals and `system-code-graph` ownership boundaries before those skills became standalone. Those are inappropriate refs.

LEGITIMATE refs that must stay:
- `cli-devin` dispatching `deep-research` (the skill is a dispatcher; naming what it dispatches is correct)
- `sk-code-review` consuming `sk-code` (one skill genuinely uses another's output)
- `mcp-coco-index` referencing `system-code-graph` in a cross-link section (semantic + structural pair)
- Any "Related" / "See also" section linking to sibling docs

INAPPROPRIATE refs that should be flagged:
- A README documenting another skill's tool surface in detail (more than just naming it)
- Path references like `../system-skill-advisor/mcp_server/...` outside a Related section
- Tables that compare ownership boundaries with sibling skills (those belong in ARCHITECTURE)
- Frontmatter `trigger_phrases` that name another skill's domain

For every flagged ref report `{file, line, literalText, judgment}` where `judgment` is a one-line explanation of why it's inappropriate.

## 2. Section 1 tables

The user's strict rule: ZERO markdown tables inside `## 1. OVERVIEW`. For each README report:
- `tables`: array of `{startLine, endLine, columns, rows, purpose, conversionHint}` per table found inside §1
- `conversionHint` is one of `"to-paragraph"`, `"to-bullets"`, `"move-to-§N"` (where §N is a later section)

## 3. Em dashes

Report `{count, citations}` where `citations` is the first 5 file:line + literal-context pairs.

## 4. Banned words

Source-of-truth: `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Check at minimum these 17 banned words: `leverage`, `empower`, `seamless`, `disrupt`, `harness`, `delve`, `realm`, `tapestry`, `illuminate`, `unveil`, `elucidate`, `revolutionise`, `game-changer`, `groundbreaking`, `cutting-edge`, `embark`, `abyss`.

Per file report `{word, line, literalSentence}` for each hit. Skip context-dependent banned words (e.g., `navigating` in non-metaphorical use) if the context is clearly literal.

## 5. Banned phrases

Check at minimum these 14: `It's important to`, `It's worth noting`, `Moving forward`, `In today's world`, `In today's digital landscape`, `When it comes to`, `Dive into`, `Let me be clear`, `The reality is`, `Here's the thing`, `In a world where`, `navigate the challenges`, `unlock the potential`, `customer journey` (metaphor sense only).

Per file report `{phrase, line, literalSentence}` for each hit.

## 6. Frontmatter drift

Canonical frontmatter keys for a skill README: `title`, `description`, `trigger_phrases`, `importance_tier`. Report any extra keys present (e.g. `contextType`, `allowed-tools` should NOT be in README frontmatter; those belong in SKILL.md).

# JSON schema (`audit-report.json`)

```json
{
  "auditedAt": "<ISO-8601>",
  "auditor": "cli-devin/swe-1.6",
  "totalFiles": 17,
  "skills": [
    {
      "skill": "cli-claude-code",
      "readme": ".opencode/skills/cli-claude-code/README.md",
      "lineCount": 353,
      "crossSkillCoupling": [
        {"line": 42, "literalText": "...", "judgment": "..."}
      ],
      "section1Tables": [
        {"startLine": 50, "endLine": 60, "columns": 3, "rows": 5, "purpose": "Key Statistics", "conversionHint": "to-paragraph"}
      ],
      "emDashes": {"count": 0, "citations": []},
      "bannedWords": [],
      "bannedPhrases": [],
      "frontmatterDrift": [],
      "refinementScore": "none|light|medium|heavy",
      "summary": "One-line summary of what needs fixing."
    }
  ]
}
```

`refinementScore` heuristic:
- `none`: 0 hits across all 5 categories
- `light`: 1-5 hits total
- `medium`: 6-20 hits total
- `heavy`: 21+ hits total OR any P0-severity coupling

# Markdown summary (`audit-report.md`)

Structure:
- One-paragraph executive summary
- Table: `| Skill | Refinement Score | §1 Tables | Em Dashes | Banned Words | Banned Phrases | Coupling Hits |`
- Per-skill detail sections (skip skills with `refinementScore: none`)
- Top-10 highest-priority cleanups across all 17 with file:line citations

# Output contract

Both artifacts must land at the paths named at the top of this prompt. Every citation must be grep-verifiable: include the literal matched substring (not paraphrased) so a reviewer can `grep -nF` to confirm. Do NOT include any other file writes.

# Constraints

- READ-ONLY across the 17 target files. Only write the two report artifacts.
- Per-file budget ~12 tool calls (sequential thinking + reads + greps).
- Output the JSON as valid syntactically (use a JSON validator before writing if possible).
- No fabricated line numbers. If unsure, grep first.
