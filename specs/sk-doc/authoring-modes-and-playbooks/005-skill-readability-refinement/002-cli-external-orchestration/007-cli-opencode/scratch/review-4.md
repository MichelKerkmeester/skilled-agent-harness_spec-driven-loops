VERDICT: FIX

- [P1] .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:291 | 10 | The round moved `## 5. REFERENCES AND RELATED RESOURCES` below SUCCESS CRITERIA and INTEGRATION POINTS and renumbered those to `## 5.` and `## 6.`, which breaks the frozen inbound reference `SKILL.md §5 prompt-templates.md entry` at `manual-testing-playbook/prompt-templates/templates-inventory.md:15` (that §5 is now SUCCESS CRITERIA) and reverses the finding's explicit skip. | Restore the HEAD order and numbers: `---`, `## 5. REFERENCES AND RELATED RESOURCES` (current lines 329-364 through `### Related Skills`), `---`, `## 6. SUCCESS CRITERIA` (current 291-311), `---`, `## 7. INTEGRATION POINTS` (current 313-325). Keep the three added Core References entries. The `render_section_order` warning that returns is the recorded citation constraint, not a defect.

- [P1] .skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md:273 | 2 | The decision tree is still the broken HEAD render: `parallel words` splits across 277-278, the left branch has `|` where the right has `v` at 280, and `+------+------+` at 286 hangs off no column, so the four leaves cannot be traced to their labels. | Replace current lines 273-293 (HEAD 269-289) with:

```text
[CALLING RUNTIME]   [PROMPT KEYWORDS]
        |               |
        |               +-- parallel words ......... USE CASE 2 (in-OpenCode parallel)
        |               +-- self-dispatch only ..... REFUSE (cycle — surface ADR-001 error)
        |
        +-- Anthropic (Claude Code) ............... USE CASE 1 (external to OpenCode)
        +-- Other (OpenCode Copilot)
              |
              v
        [PROJECT SUBSYSTEM NAMED?]
              +-- YES -> USE CASE 3 (cross-AI handback)
              +-- NO  -> USE CASE 1 (external to OpenCode)
```

- [P2] .skilled/skills/cli-external-orchestration/cli-opencode/references/context-budget.md:16 | 3 | The intro is still the pure pointer `Sentinel-style pointer that applies the canonical small-model context-budget semantics to cli-opencode dispatches without duplicating the pattern.` and gives the reader no reason to open the file; every claim it makes is already in the overview. | Replace line 16 with `Set a cli-opencode prompt's size from the model it targets, and label whatever the budget forces out.`

- [P2] .skilled/skills/cli-external-orchestration/cli-opencode/references/permissions-matrix.md:17 | 3 | The intro is still the bare topic list `Structured permissions-matrix schema, resolution semantics, example matrices, RM-8 replay reasoning, and migration checklist for cli-opencode deep-loop dispatches.`, which repeats the frontmatter description and the Purpose. | Replace line 17 with `Open this before you hand-author a matrix or assume one is protecting a run: nothing in the dispatch path enforces it yet.`

- [P2] .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:341 | 8 | `### Core References` lists 9 of the 10 files in `references/`; `context-budget.md` is shipped and has no entry, so the index remains incomplete after the three additions. | Append after the `permissions-matrix.md` entry in `### Core References`: `- [context-budget.md](./references/context-budget.md) - Model context windows and the truncation marker for bounded prompts`
