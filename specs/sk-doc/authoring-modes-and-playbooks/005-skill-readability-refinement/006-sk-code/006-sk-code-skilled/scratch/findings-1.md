### .skilled/skills/sk-code/sk-code-skilled/README.md

- [P2] .skilled/skills/sk-code/sk-code-skilled/README.md:30 | 1 | OVERVIEW opens with `### Why This Skill Exists`; the skill README template says OVERVIEW starts with `### What It Does` and the problem narrative follows it | move lines 30-32 (`### Why This Skill Exists` and its paragraph) to after line 36, immediately before `### The House Style Lives Here`
- [P2] .skilled/skills/sk-code/sk-code-skilled/README.md:36 | 7 | one paragraph packs five mechanisms (evidence inventory, detection order, second-evidence load, language slicing, read-only ownership) into seven sentences, against the template's two-to-four | replace line 36 with:
  ```markdown
  This surface carries the system-code evidence for the sk-code hub:

  - Language standards for TypeScript, Python, shell, Rust, config and JavaScript, plus a language-agnostic shared tier for naming, organization, hooks and alignment verification.
  - Authoring checklists for skills, agents, commands and MCP servers.
  - Detection that tries every declared specific surface first, including any operator-private surface skill, and checks this surface last as the hub's fallback. When a specific surface also matches, this surface loads as second evidence.
  - The hub slices to the set of languages the task actually touches. Only an interop task spanning both languages legitimately loads both.
  - Read-only, advisor-invisible evidence. The paired workflow mode owns all edits, tests and commits.
  ```
- [P2] .skilled/skills/sk-code/sk-code-skilled/README.md:78 | 7 | the two-step detection paragraph packs eight extension-to-language mappings into prose | replace line 78 with:
  ```markdown
  Detection is two-step.

  1. Work under `.skilled/` makes this surface the leading one when no specific surface matched: skills, agents, commands, plugins, MCP servers, config, changelogs and runtime bridge wiring.
  2. File extensions and local markers select the language:
     - `.ts`, `.tsx`, `.mts` and `.d.ts` map to TypeScript.
     - `.py` plus argparse maps to Python.
     - `.sh` and `.bash` map to shell.
     - `.rs` maps to Rust.
     - JSON, JSONC and YAML with graph-metadata or spec-folder markers map to config.
     - `.cjs`, `.mjs` and `.js` map to JavaScript.

  When no `.rs` file is touched, local `Cargo.toml` or `Cargo.lock` markers select Rust, with napi-rs and wasm-bindgen vocabulary as intent signals. The slice is the set of touched languages, not one per task.
  ```
- [P1] .skilled/skills/sk-code/sk-code-skilled/README.md:82 | 7 | the paragraph says "Four non-negotiables" but states five; SKILL.md §4 lists the same five as bullets, so the count contradicts the surface contract | replace line 82 with:
  ```markdown
  Five non-negotiables hold across the evidence.

  - **OpenCode plugins never write to the TUI.** Their output goes through system-context injection, tools, append-only log files or a DEBUG-gated stream behind an env flag.
  - **Descriptors are load-bearing**, since `graph-metadata.json` and `description.json` shape discovery.
  - **Alignment drift is a verification gate**, so system-code changes re-run the drift guards before any completion claim.
  - **Rust preserves the TypeScript contract.**
  - **The slice stays the touched-language set.**
  ```
- [P2] .skilled/skills/sk-code/sk-code-skilled/README.md:134 | 8 | RELATED DOCUMENTS omits `ROUTER.md`, the sibling router the skill README template lists second after `SKILL.md` | insert a row after line 138 linking `./ROUTER.md` with the purpose `Machine router: intent map, resource map and loading levels`

### .skilled/skills/sk-code/sk-code-skilled/ROUTER.md

- clean

### .skilled/skills/sk-code/sk-code-skilled/SKILL.md

- [P2] .skilled/skills/sk-code/sk-code-skilled/SKILL.md:112 | 6 | SMART ROUTING sits at §3 behind the 70-line REFERENCE MAP at §2 because it was appended as `2b` and later renumbered, so the routing decision comes after the catalog it governs and the template's required §2 | move lines 112-118 (`## 3. SMART ROUTING` and its three paragraphs) to after line 110, renumber it `## 2. SMART ROUTING`, and renumber `## 2. REFERENCE MAP` to `## 3.`
- [P1] .skilled/skills/sk-code/sk-code-skilled/SKILL.md:166 | 6 | `## 6. QUALITY CHECKLIST MAP` is the section `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/ci-target-change.md:161` cites as `SKILL.md` §5; the `2b` to `3` renumber pushed it to 6, so that inbound reference now lands on SUPPORTING ASSETS | move the `## 6. QUALITY CHECKLIST MAP` block (heading through its last table row) to directly after the `---` that closes §4, renumber it `## 5.`, add a `---` divider after the moved table, and renumber `## 5. SUPPORTING ASSETS` to `## 6.`
- [P2] .skilled/skills/sk-code/sk-code-skilled/SKILL.md:91 | 8 | the REFERENCE MAP's Checklists list omits the three `assets/checklists/js-css-style/` parts, which §6 routes for every `.js` and `.css` target and ROUTER.md §3 lists under CODE_QUALITY | insert after line 91:
  ```markdown
    - `assets/checklists/js-css-style/overview-header-and-comments.md`
    - `assets/checklists/js-css-style/naming-init-formatting-and-css.md`
    - `assets/checklists/js-css-style/verification-quick-reference-and-related.md`
  ```

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/agent-authoring.md

- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/agent-authoring.md:75 | 8 | Related Resources names two runtime directories, but PRE-CHECKS at line 42 declares `.codex/agents/` a third live mirror that must stay in parity | replace line 75 with `- Runtime directories: `.skilled/agents/`, `.claude/agents/` and `.codex/agents/``

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/command-authoring.md

- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/command-authoring.md:42 | 6 | PRE-CHECKS tells the reader to run the mirror generator before the command exists, and STEP 7 at line 58 runs the same generator after authoring, so the action sits in the wrong phase twice | replace line 42 with `- [ ] Classify the command's runtime scope: `.claude/commands` is a real filtered tree of per-command symlinks, so OpenCode-only commands must be excluded deliberately.`

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/config-checklist.md

- clean

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/javascript-checklist.md

- [P1] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/javascript-checklist.md:137 | 6 | a P0 hard blocker sits inside `## 3. P1 - REQUIRED`, whose preamble says items may be deferred with approval, so a reader who trusts the section heading can defer a commit blocker | move lines 137-144 to after line 107 (end of `## 2. P0 - HARD BLOCKERS`), replacing the `**Plugin runtime output (P0)**:` label with `### Plugin Runtime Output` and keeping the fenced checklist and the two following sentences verbatim

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/naming-init-formatting-and-css.md

- clean
