### .skilled/skills/sk-code/sk-code-skilled/references/shell/quality-standards/overview-and-priority-blockers.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shell/quality-standards/overview-and-priority-blockers.md:94 | 6 | The P0 list runs Shebang Line, Strict Mode, Double-Quoted Variables, then File Header Present, so the header a script's first lines carry is defined after rules that assume it, while the sibling style guide orders Shebang Line, File Header, Strict Mode. | move lines 94-104 (the `### File Header Present` block through its closing code fence) to immediately after line 70, giving Shebang Line, File Header Present, Strict Mode, Double-Quoted Variables.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shell/quality-standards/overview-and-priority-blockers.md:275 | 1 | The body ends on a bare `---` that separates nothing, left behind when the page was split, so the page closes on a stray horizontal rule. | delete line 275; the file should end after the ShellCheck code fence at line 273.

### .skilled/skills/sk-code/sk-code-skilled/references/shell/quality-standards/validation-security-and-shellcheck.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shell/quality-standards/validation-security-and-shellcheck.md:300 | 1 | The Google Shell Style Guide is the only related link with no description, while the template pairs every related link with what the reader gets there. | replace line 300 with: `- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html) - The upstream conventions these rules follow`
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shell/quality-standards/validation-security-and-shellcheck.md:248 | 7 | Numbered item 2 packs five clauses — the changed rule, its id, where its override row lives, which checklist every SKILLED file reaches, and why the shell checklist has no second row — into one 45-word item, so the two facts a reviewer needs are buried. | replace line 248 with:
  ```markdown
  2. The one default-lens rule the SKILLED surface changes is the TODO format, `review.todo-tracking`.
     - Its row lives in the `## 7. RULE OVERRIDES` section of [`universal-checklist.md`](../../../assets/checklists/universal-checklist.md).
     - That is the checklist every SKILLED file reaches, so the shell checklist, [`shell-checklist.md`](../../../assets/checklists/shell-checklist.md), repeats the format without a second row.
  ```

### .skilled/skills/sk-code/sk-code-skilled/references/shell/quick-reference/functions-strings-and-checklist.md
- clean

### .skilled/skills/sk-code/sk-code-skilled/references/shell/quick-reference/template-variables-and-loops.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shell/quick-reference/template-variables-and-loops.md:24 | 1 | Purpose ends in a two-link "For detailed explanations, see:" list, so it routes instead of stating the outcome, and this is the file's only use of those two resources because it has no related-resources section at all. | replace lines 24-26 with `Quick-access reference card for Bash patterns.`, and replace the trailing `---` at line 294 with:
  ```markdown
  ---

  ## 7. RELATED RESOURCES

  - [style-guide.md](../style-guide/overview-structure-and-naming.md) - Full style documentation
  - [quality-standards.md](../quality-standards/overview-and-priority-blockers.md) - Quality requirements
  ```

### .skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/overview-structure-and-naming.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/overview-structure-and-naming.md:283 | 6 | Three of the five H3s under `## 5. LOGGING FUNCTIONS` — `### Inline Comments`, `### Capitalization` and `### Function Purpose Comments` — are comment rules, so a reader scanning the H2 list for comment conventions never finds them, and §5 gets unrelated rules after the logging contract. | insert before line 283: `---`, a blank line, `## 6. COMMENT CONVENTIONS`, and a blank line.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/overview-structure-and-naming.md:168 | 7 | One paragraph carries two mechanisms — the plain-prefix naming exception for a file sourced into an interactive shell, and the function-snapshot reason `_helper` fails — so the failure mode is easy to miss inside the run-on sentence. | replace line 168 with:
  ```markdown
  **Exception**:

  - A file sourced into an interactive shell gives every helper that its public functions call a plain prefixed name instead, such as `skilled_loop_resolve`.
  - Agent tool shells, Claude Code's among them, are rebuilt from a function snapshot that drops names starting with a single underscore, so a public function that calls `_helper` there fails with `command not found`.
  ```
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/overview-structure-and-naming.md:288 | 2 | Items 2 and 3 state the same rule twice under different labels ("Focus on purposeful semantics" and "Focus on WHY, not WHAT"), so the list offers four numbered rules for three instructions. | replace lines 288-290 with:
  ```markdown
  2. **Focus on WHY, not WHAT:** Explain the intent, constraints and reasoning behind the code, not what it does
  3. **No commented-out code:** Delete unused code (git preserves history)
  ```
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/overview-structure-and-naming.md:345 | 1 | The body ends on a bare `---` that separates nothing, so the page closes on a stray horizontal rule. | delete line 345; the file should end after the code fence at line 343.

### .skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/variables-functions-and-output.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/variables-functions-and-output.md:319 | 1 | The Google Shell Style Guide is the only related link with no description, while the template pairs every related link with what the reader gets there. | replace line 319 with: `- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html) - The upstream conventions these rules follow`

### .skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/overview-and-type-system.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/overview-and-type-system.md:337 | 1 | The body ends on a bare `---` with a trailing blank line and no section after it, so the page closes on a stray horizontal rule. | delete line 337 (the trailing `---`) and the blank line after it; the file should end after "Why inferred on private helpers".

### .skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/tsconfig-and-modules.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/tsconfig-and-modules.md:117 | 5 | The governing Package-aware build rule — which `npm run build` applies to which package — comes after the code block that shows two identical `npm run build` lines with different meanings, so the reader meets the ambiguity before the rule that resolves it. | move line 117 to immediately after line 100, before `**Build command** (from skill root, e.g. ...)`.
