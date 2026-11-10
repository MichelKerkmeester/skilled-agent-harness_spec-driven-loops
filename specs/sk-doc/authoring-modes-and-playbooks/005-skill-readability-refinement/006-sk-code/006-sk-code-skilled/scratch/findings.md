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

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/overview-header-and-comments.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/overview-header-and-comments.md:25 | 8 | The Usage load list is the entry file's index of the three-file tier, but it names only one of the two companions, so a reader following it never reaches the verification part. | Replace line 25 with: "2. **Load** this file and its two companions, [naming-init-formatting-and-css.md](./naming-init-formatting-and-css.md) and [verification-quick-reference-and-related.md](./verification-quick-reference-and-related.md), for a `.js` or `.css` target."

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/verification-quick-reference-and-related.md
- clean

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/mcp-server-authoring.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/mcp-server-authoring.md:38 | 7 | One pre-check packs the launcher, the daemon entrypoint and the socket path into a single sentence, so the three tiers cannot be scanned or checked separately. | Replace line 38 with the lead-in "- [ ] For launcher-backed services, account for the three-tier assembly:" followed by three indented sub-bullets: "- Launcher process"; "- Daemon/server `dist/` entrypoint"; "- Socket path configured through `SPECKIT_IPC_SOCKET_DIR`".

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/python-checklist.md
- clean

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md:30 | 8 | The entry file's Usage sentence acts as the index for the four-part directory but names none of the three remaining files, so the set is not listed anywhere in the file that introduces it. | Replace line 30 with: "Apply this first part with the universal checklist, then continue in order through [p0-safety-and-boundary-discipline.md](./p0-safety-and-boundary-discipline.md), [p1-required.md](./p1-required.md) and [p2-evidence-validation-and-resources.md](./p2-evidence-validation-and-resources.md)."

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md:52 | 7 | The prohibition packs four separate exposure categories into one sentence, so a reader checking a boundary DTO cannot scan what is banned. | Replace line 52 with "Boundary contracts must not expose:" followed by four bullets: "- `usize` or `isize`"; "- borrowed fields"; "- Rust ordinal enum values"; "- integers that exceed JavaScript’s safe range without an explicit `BigInt` or decimal-string contract".

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md
- [P1] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:164 | 1 | The evidence instruction points at "section 6", which does not exist in this file (the file ends at section 2); the gate sequence is section 4 of the P2 part, so the reference is undefined and the reader cannot find the commands. | Replace "in section 6" with "in [p2-evidence-validation-and-resources.md](./p2-evidence-validation-and-resources.md) §4".

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md
- [P1] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:130 | 1 | The review-evidence template cites `rust_checklist.md`, which does not exist; the Rust checklist is the four files in `rust-checklist/`, so a copied evidence row names a dead file. | Replace line 130 with: "- [ ] Rust standards validated in the `rust-checklist/` files"

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/shell-checklist.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/shell-checklist.md:58 | 6 | The strict-mode item requires `set -euo pipefail` "immediately after header", but the header it means is not defined until `### File Header` at 92-105, so a reader working top-down writes strict mode before the block the rule points at. | move lines 92-105 to before line 55, giving Shebang Line, File Header, Strict Mode, Double-Quoted Variables.

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/skill-authoring.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/skill-authoring.md:57 | 7 | Step 7 packs three mechanisms into one run-on item: where the packet router block goes, what a hub root `ROUTER.md` carries instead, and what `SKILL.md` SMART ROUTING keeps. | replace line 57 with four lines: `7. Put the router block in the packet's own ROUTER.md.` / `   - Put the INTENT_SIGNALS / RESOURCE_MAP block and its routing prose under a final ## MACHINE ROUTER heading.` / `   - A hub root ROUTER.md carries the hub's stage-two control document instead.` / `   - SKILL.md SMART ROUTING stays short prose plus the link to that file.`

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md
- [P1] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md:104 | 6 | "Explain reasoning, not mechanics." sits under `### Numbered ALL-CAPS Sections`, so it reads as a rule for section headings, which the same item defines as `## N. SECTION NAME`; it is a comment rule. | change line 104 to `Same rule as JavaScript.` and add `    - Explain reasoning, not mechanics` after line 95 inside the WHY Comments checklist block.

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md:369 | 8 | `### Language-Specific Checklists` indexes the sibling language checklists but omits the four `rust-checklist/` parts that `SKILL.md` routes for `.rs` files (`SKILL.md:195-198`), so a Rust change is pointed at no checklist. | add after line 369: `- [rust-checklist/overview-and-p0-parity.md](./rust-checklist/overview-and-p0-parity.md) - Rust checks, split into four topic parts`

### .skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md
- [P1] .skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md:100 | 9 | The usage example's expected output points at "the current refinement and release-alignment review", a transient work artifact no reader can open or reproduce. | replace line 100 with `Expected output: Findings name any file missing from the contents table and any documented path that no longer resolves.`
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md:109 | 9 | The troubleshooting row names "this audit" and "the current release-alignment README remediation check", both transient. | replace the row with `| README appears stale | Source files changed after the README was written | Refresh the structure table and rerun the README coverage check. |`
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md:65 | 9 | The FEATURES row promises that the README records an "audit packet" for follow-up work; no owner or packet is recorded anywhere in the file. | replace the row with `| Verification handoff | Points reviewers at the owning skill files for follow-up work. |`
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md:35 | 9 | The Key Statistics row "Audit context | Internal validation notes" records the audit that produced the file, not a durable fact about the folder. | delete line 35.
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md:79 | 1 | "Restored" carries migration history into a contents-table cell; the code-folder README template's writing rules say to document current behavior only. | replace `Restored router-sync drift guard:` with `Router-sync drift guard:`.

### .skilled/skills/sk-code/sk-code-skilled/references/config/quality-standards.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/config/quality-standards.md:108-111 | 1 | Every related-resources link is bare; the reference template's related section is `- [title](url) - [what the reader gets there]`. | replace lines 108-111 with `- [quick-reference.md](./quick-reference.md) - Pattern lookup for common config shapes` / `- [style-guide.md](./style-guide.md) - Formatting, naming and comment conventions` / `- [shared/code-organization/overview-and-module-organization.md](../shared/code-organization/overview-and-module-organization.md) - Module and file organization rules` / `- [config-checklist.md](../../assets/checklists/config-checklist.md) - Checklist form of these gates`

### .skilled/skills/sk-code/sk-code-skilled/references/config/quick-reference.md
- [P1] .skilled/skills/sk-code/sk-code-skilled/references/config/quick-reference.md:303-313 | 1 | The FILE LOCATIONS tree renders `.skilled/config/opencode.json` and `.skilled/skill/`, neither of which exists; the root config is `opencode.json` and skills live under `.skilled/skills/` (the sibling `style-guide.md:394-410` shows the real layout). | replace the fenced tree with: `opencode.json`, then `.skilled/`, then `└── skills/`, then `    └── [skill-name]/`, then `        └── config/`, keeping the existing `config.jsonc`, `filters.jsonc`, `complexity-config.jsonc` entries unchanged.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/config/quick-reference.md:24-26 | 1 | Purpose closes with a two-link pointer list that duplicates §12 RELATED RESOURCES (343-344), leaving the Purpose as routing rather than an outcome. | delete ` For detailed explanations, see:` from line 24 and delete lines 25-26, leaving `Quick-access reference card for configuration file patterns.`
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/config/quick-reference.md:345 | 1 | The external JSON Specification entry is the only related link with no description. | append ` - The grammar JSON and JSONC files must parse as`.

### .skilled/skills/sk-code/sk-code-skilled/references/config/style-guide.md
- [P1] .skilled/skills/sk-code/sk-code-skilled/references/config/style-guide.md:324-326 | 1 | The schema example puts two `$schema` keys in one object, so it is invalid JSON and contradicts the P0 "No duplicate keys" gate in `quality-standards.md:43`. | replace lines 323-327 with `{` / `  "$schema": "https://json-schema.org/draft-07/schema"` / `  // For VSCode settings, use "vscode://schemas/settings/user" instead.` / `}`.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/config/style-guide.md:420-421 | 1 | The two external-standards links carry no descriptions; the reference template pairs every related link with what the reader gets there. | append ` - The grammar JSON and JSONC files must parse as` to line 420 and ` - The comment and trailing-comma extension JSONC adds` to line 421.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/config/style-guide.md:417 | 8 | `### Internal References` lists only one of the two sibling config references, so `quality-standards.md` is unreachable from this file even though both siblings link back to it. | add after line 417: `- [quality-standards.md](./quality-standards.md) - P0/P1/P2 quality gates`

### .skilled/skills/sk-code/sk-code-skilled/references/javascript/quality-standards/overview-modules-and-docs.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/javascript/quality-standards/overview-modules-and-docs.md:50-53 | 7 | The CommonJS paragraph packs three separate rules (which files use CommonJS, the `'use strict'` requirement, and the ESM `.js` alignment exception) into one prose block, so a reader cannot check them separately. | Replace lines 50-53 with three bullets: `- Use CommonJS for \`.cjs\` files and \`.js\` files whose package boundary selects CommonJS.` / `- Include the repository's required \`'use strict'\` directive in those files.` / `- ESM \`.js\` files follow their package boundary and also keep that directive to satisfy the repository's alignment checks; it is redundant in ESM.`
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/javascript/quality-standards/overview-modules-and-docs.md:71-73 | 7 | The Export Pattern paragraph packs the camelCase rule, the MCP snake_case alias rule, and the plugin `export default` exception into one block, so the three export shapes cannot be scanned separately. | Replace lines 71-73 with three bullets: `- Export functions using \`camelCase\` names.` / `- For MCP handlers, include \`snake_case\` aliases for backward compatibility.` / `- Do not apply this export shape to OpenCode plugin paths; those use \`export default\`.`
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/javascript/quality-standards/overview-modules-and-docs.md:298 | 8 | This file is the entry part of the two-file `quality-standards/` set, and its Purpose (line 24) and When to Use (line 30) promise security patterns, but it ends at §5 without naming `security-testing-and-exemptions.md`; the split-set entry is the only place that indexes its companion, so a reader who opens this file cannot reach the security half. | Append after line 298: a blank line, `## 6. RELATED RESOURCES`, a blank line, and `- [security-testing-and-exemptions.md](./security-testing-and-exemptions.md) - Security, testing, async and exemption tiers`.

### .skilled/skills/sk-code/sk-code-skilled/references/javascript/quality-standards/security-testing-and-exemptions.md
- clean

### .skilled/skills/sk-code/sk-code-skilled/references/javascript/quick-reference.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/javascript/quick-reference.md:24-26 | 1 | Purpose closes with `For detailed explanations, see:` and two links that duplicate §11 RELATED RESOURCES at lines 291-292, so the Purpose routes instead of stating what the card gives. | Delete ` For detailed explanations, see:` from line 24 and delete lines 25-26, leaving `Quick-access reference card for JavaScript patterns.`
- [P1] .skilled/skills/sk-code/sk-code-skilled/references/javascript/quick-reference.md:243 | 1 | `// Path resolution (safe)` labels `path.resolve(basePath, relativePath)` as safe, but `path.resolve` does not confine the result to `basePath`; the security part's CWE-22 pattern adds the `startsWith(resolvedBase + path.sep)` check this snippet omits, so a reader can copy a traversal-prone call under a safety label. | Change line 243 to `// Path resolution (then verify the result starts with basePath + path.sep before use)`.

### .skilled/skills/sk-code/sk-code-skilled/references/javascript/style-guide.md
- [P1] .skilled/skills/sk-code/sk-code-skilled/references/javascript/style-guide.md:430-431 | 1 | `### TODO Comments` gives `// TODO: [description of work needed]` and `// FIXME: [description of bug to fix]`, but the SKILLED TODO contract (`universal-checklist.md` §7 `review.todo-tracking`, restated in `python/quality-standards.md` §3) requires an owner as `TODO(owner)` and says a ticket id stays out; a JavaScript reader following this example writes a TODO the checklist rejects. | Change line 430 to `// TODO(username): [description of work needed]` and line 431 to `// FIXME(username): [description of bug to fix]`.

### .skilled/skills/sk-code/sk-code-skilled/references/python/quality-standards.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/python/quality-standards.md:442 | 7 | Item 2 packs the rule id, where its override row lives, why every SKILLED file reaches it, and why the Python checklist has no second row into one sentence, so the four points cannot be checked separately. | Replace line 442 with `2. The one default-lens rule the SKILLED surface changes is the TODO format, \`review.todo-tracking\`.` followed by two 3-space-indented sub-bullets: `   - Its row lives in the \`## 7. RULE OVERRIDES\` section of [\`universal-checklist.md\`](../../assets/checklists/universal-checklist.md), the checklist every SKILLED file reaches.` / `   - The Python checklist, [\`python-checklist.md\`](../../assets/checklists/python-checklist.md), repeats the format without a second row.`
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/python/quality-standards.md:444 | 2 | The `---` at line 444 has no blank line above it, violating the template rule that every divider has a blank line above it so the divider never turns the preceding line into a setext heading. | Insert a blank line between line 443 and line 444.

### .skilled/skills/sk-code/sk-code-skilled/references/python/quick-reference.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/python/quick-reference.md:24-26 | 1 | Purpose closes with `For detailed explanations, see:` and two links that duplicate §12 RELATED RESOURCES at lines 414-415, so the Purpose routes instead of stating what the card gives. | Delete ` For detailed explanations, see:` from line 24 and delete lines 25-26, leaving `Quick-access reference card for Python patterns.`
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/python/quick-reference.md:404-407 | 8 | The P2 block is the card's index of the P2 tier, but it omits `Consistent String Quotes`, which `python/quality-standards.md` §4 lists; a reader checking the card never sees that rule. | Insert `[ ] Consistent string quotes` after line 405 (`[ ] Import order`).

### .skilled/skills/sk-code/sk-code-skilled/references/python/style-guide.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/python/style-guide.md:74 | 1 | The alternative full-box header example is 79 characters wide on line 74 while lines 73 and 75 are 78, so the right border is one column out and the example does not render as a closed box. | Delete one space before the closing `║` on line 74 so the line is 78 characters and its right border aligns with lines 73 and 75.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/python/style-guide.md:241 | 1 | The H2 says `DOCSTRINGS`, but two of its five H3s (`Inline Comments` at line 304 and `Capitalization` at line 338) are comment rules, so a reader scanning headings for the comment budget or capitalization rule has no heading to find them by. | Change line 241 to `## 5. DOCSTRINGS AND COMMENTS`.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/python/style-guide.md:308-311 | 2 | Items 2 and 3 are two labels for the same rule: `Focus on purposeful semantics: Explain WHY something is done, not WHAT it does` and `Focus on WHY, not WHAT: Explain intent, constraints, reasoning`; the list states one rule twice. | Replace lines 308-311 with three items: `1. **Quantity limit (Skilled surface setting):** Maximum 3 comments per 10 lines of code, this surface's budget for the shared comment-density rule (see [naming and commenting](../shared/universal-patterns/naming-and-commenting.md))` / `2. **Focus on purposeful semantics:** Explain WHY something is done, not WHAT it does, including the intent, constraints and reasoning` / `3. **No commented-out code:** Delete unused code (git preserves history)`.

### .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md
- [P1] .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:296-300 | 8 | The `[workspace] members` array names `crates/core`, `crates/napi` and `crates/wasm` but omits `crates/sidecar`, which the Workspace Layout tree at lines 259-262 and the Responsibility Matrix at line 272 both include; a copied manifest leaves the sidecar outside the workspace that the verification block at lines 132-134 and the build at line 127 are supposed to cover. | Add `  "crates/sidecar",` after line 299 (`  "crates/wasm",`).
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:293-305 | 6 | The block defines the workspace members and `[workspace.package]` edition/MSRV, but it sits at the end of `### Feature Organization`, whose bullets at lines 286-291 are about native/WASM features and target combinations; the block contains no feature configuration, so the feature section ends on an unrelated manifest. | Move lines 293-305 to after line 263 (the closing fence of the Workspace Layout tree), before `### Responsibility Matrix`.

### .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:205-207 | 7 | The twelve serialized-byte facets (lines 194-205) and the four acceptance-test rules (lines 207-210) are separated by a blank line only, so Markdown renders them as one 16-item list and the four `[P0]` prohibitions read as further facets of the contract rather than as rules. | Insert a blank line and the line `**Acceptance-test rules:**` between `- Error payload shape` (line 205) and `- **[P0]** Do not parse and reserialize expected output before comparison.` (line 207).

### .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md
- clean

### .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md:181 | 7 | The P0 rule packs two mechanisms into one paragraph, the passive/owned/versioned DTO requirement and a seven-item serialization contract (field names, field order, omission, nullability, escaping, encoding, number spelling), so the facets cannot be checked one at a time. | Replace line 181 with `**[P0] Boundary DTOs are passive, owned, and versioned.** Serialization must preserve the TypeScript contract for:` followed by seven bullets: `- Field names`, `- Field order`, `- Omission`, `- Nullability`, `- Escaping`, `- Encoding`, `- Number spelling`.

### .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/overview-and-data-ownership.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/overview-and-data-ownership.md:335 | 8 | This is the entry file of the five-file `quality-standards/` set, and its When to Use list (lines 44-46) sends readers to DTO and error definitions, Cargo/Clippy gates and native/WASM/WASI artifact testing that live in the siblings, yet the file links none of them and ends at §3, so the set has no route from its entry point. | Append after line 335: a blank line, `## 4. RELATED RESOURCES`, a blank line, then `- [build-and-organization.md](./build-and-organization.md) - Cargo, verification and module-organization baseline`, `- [modeling-collections-and-api.md](./modeling-collections-and-api.md) - Domain types, collection choices and public API/ABI contracts`, `- [docs-errors-and-async.md](./docs-errors-and-async.md) - Rustdoc, error and panic translation, and async patterns`, `- [determinism-and-parity.md](./determinism-and-parity.md) - Byte-for-byte determinism and TypeScript parity contracts`.

### .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/collections-imports-and-errors.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/collections-imports-and-errors.md:115-125 | 6 | `### IndexMap Exception` states the exception to the `BTreeMap` rule given at line 48, but it sits four subsections later, after two conversion patterns and the borrow/own pattern, so a reader choosing a map meets the exception only after unrelated material. | Move lines 115-125 (`### IndexMap Exception` through the `Use IndexMap only when...` paragraph) to after line 48, so it follows the `Use BTreeMap when...` paragraph and precedes `### Collect and Sort`.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/collections-imports-and-errors.md:207 | 1 | `## 4. ERROR AND PANIC MAPPING` also contains `### Narrow Lint Suppression` (lines 297-319), a clippy `#[allow]` policy, so a reader scanning the H2s for lint guidance finds no heading that covers it. | Change line 207 to `## 4. ERROR, PANIC, AND LINT POLICY`.

### .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/determinism-parity-and-related.md
- clean

### .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/naming-ordering-and-signatures.md
- clean

### .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/overview-and-boundary-template.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/overview-and-boundary-template.md:24-27 | 1 | The Purpose is a card title followed by `For detailed explanations, see:` and a two-link list, so it routes to other documents instead of stating what the card gives, while the template's Purpose is an outcome statement. | Change line 24 to `Quick-access reference card for Rust compute kernels and their JavaScript boundaries.` and delete lines 25-27; both targets reappear in the §3 RELATED RESOURCES added below.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/overview-and-boundary-template.md:469 | 8 | This file carries the set title `Rust Quick Reference` but names none of the four other files in `quick-reference/`, so the Cargo commands promised by When to Use (line 35), the naming tables and the error recipes are not reachable from the card's entry file. | Append after line 469: a blank line, `## 3. RELATED RESOURCES`, a blank line, then `- [naming-ordering-and-signatures.md](./naming-ordering-and-signatures.md) - Naming table, source-section order and boundary signature patterns`, `- [collections-imports-and-errors.md](./collections-imports-and-errors.md) - Canonical collection, import/export and error-mapping recipes`, `- [rustdoc-and-cargo.md](./rustdoc-and-cargo.md) - Rustdoc template and the Cargo, formatting, build and supply-chain commands`, `- [determinism-parity-and-related.md](./determinism-parity-and-related.md) - Determinism, parity and golden-replay recipes`, `- [style-guide.md](../style-guide/overview-and-file-header.md) - Full Rust style and interop documentation`, `- [quality-standards.md](../quality-standards/overview-and-data-ownership.md) - Safety, parity, and verification requirements`.

### .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/rustdoc-and-cargo.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/rustdoc-and-cargo.md:201 | 7 | Two separate requirements — choosing the Node-API level and running the oldest-Node/OS/CPU/libc test matrix — are packed into one paragraph after the code block. | Replace line 201 with two bullets: `- Use the lowest proven Node-API level supporting the required APIs.` and `- Test the oldest declared Node version and every published OS, CPU, and libc package.`
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/rustdoc-and-cargo.md:250 | 5 | The blocking/advisory status of the supply-chain commands is stated after the commands, so a reader runs them before learning which are gates. | Move lines 250-251 (the paragraph and its trailing blank) to before line 244, above the `cargo deny`/`cargo audit`/`cargo vet` block.

### .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/commenting-and-rustdoc.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/commenting-and-rustdoc.md:107 | 5 | The boundary-crate-only restriction and the pure-core `forbid(unsafe_code)` rule sit after the unsafe example, so a reader can copy the example into the core before learning it is forbidden there. | Move lines 107-115 (the restriction, the additional unsafe requirements, and their trailing blank) to before line 94, above the `rust` example.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/commenting-and-rustdoc.md:223 | 5 | The mandatory rustdoc headings rule follows the public-operation template that demonstrates them, so a reader drafts from the template before learning which headings are required, notably `# Safety` for an `unsafe fn`. | Move lines 223-233 (the subsection and its trailing blank) to before line 128, above `### Public Operation Template`.

### .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/formatting-and-imports.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/formatting-and-imports.md:250 | 6 | `### Numeric Parity Helpers` is separated from `### Numeric Literals` by the collection and sorting subsections, so the file's numeric rules are split across two unrelated blocks. | Move lines 250-284 (the subsection and its trailing blank) to before line 191, directly after `### Numeric Literals`.

### .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-errors-and-parity.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-errors-and-parity.md:125 | 5 | The list of sinks JavaScript-controlled data must never reach follows both the bad and good examples, so the prohibition is read after the patterns it governs. | Move lines 125-134 (the list and its trailing blank) to before line 103, above `Do not use:`.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-errors-and-parity.md:225 | 7 | Two mechanisms — the ban on nondeterministic reduction order and the fallback for unavoidable parallel reduction — are packed into one paragraph. | Replace line 225 with two bullets: `- Parity-visible floating-point reductions MUST NOT run in nondeterministic parallel order.` and `- If parallel reduction is unavoidable, fix the reduction tree and golden-test it across every supported target.`
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-errors-and-parity.md:265 | 5 | The production-placement rule — ranking stays in the pure core and the adapter only converts — follows the napi example, so a reader can copy the example as the production shape. | Move lines 265-266 (the paragraph and its trailing blank) to before line 233, above the example code fence.

### .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-model.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-model.md:322 | 5 | The rule to implement `From`/`TryFrom` rather than `Into`/`TryInto` directly sits after both conversion examples, so it reads as a postscript instead of the section's governing rule. | Move lines 322-323 (the rule and its trailing blank) to before line 260, above `Use `From` only when conversion is:`.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-model.md:340 | 5 | The ban on `variant as u8` wire contracts follows the enum example, separating it from the lead-in at line 326 that it qualifies. | Move lines 340-341 (the rule and its trailing blank) to before line 328, above the enum example.

### .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/naming-conventions.md
- clean

### .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/overview-and-file-header.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/overview-and-file-header.md:98 | 5 | The Requirements list — box width, attribute order, module-documentation and import placement — follows all three header templates it governs, so a reader can copy a template before seeing the hard constraints. | Move lines 98-111 (the Requirements subsection and its trailing blank) to before line 70, above `### Module Template`.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/overview-and-file-header.md:100 | 5 | “Box width: 67 characters total” matches only the `─` run; every template line is 70 columns including the `// ` prefix, so the stated total contradicts the templates. | Replace line 100 with: `- Box width: 67 `─` characters plus the `// ` prefix (70 columns total)`

### .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/toolchain-and-project-structure.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/toolchain-and-project-structure.md:191 | 5 | The numbering rule for the source-order table follows the table, so a reader can apply the 1-7 order column before learning that numbering starts at the first divider actually present. | Move lines 191-192 (the rule and its trailing blank) to before line 181, above the table.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/toolchain-and-project-structure.md:277 | 6 | `### Module and Workspace Layout`, `### Module Responsibilities`, and `### Module Visibility` sit under `## 3. SECTION ORGANIZATION`, whose intro and template are about in-file dividers; project structure is buried under a file-format heading. | Insert `## 4. MODULE AND WORKSPACE LAYOUT` before line 277; section 3 keeps its number and the new section takes the next integer.

### .skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md:16 | 3 | The intro is a pure pointer sentence ("This document describes …"), not a hook, and its "introduced" framing is a change event the overview never states; the durable claims it makes (a repeatable verifier for recurring drift checks) are already carried by Purpose and When to Use. | Replace line 16 with: `When a repeatable drift check fires, this tells you whether it was meant to block the build and where a new check attaches so the guard set stays one system.`
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md:54 | 7 | One paragraph packs four mechanisms: the lightweight scope, the `--check-router` exception, the RESOURCE_MAP equality delegation, and the manual-gate lead-in, so the exception and the delegation are easy to miss. | Replace lines 54-61 with:
  ```markdown
  The verifier is intentionally lightweight. It does not replace the standards
  checklists and, by default, does not scan markdown.

  - The opt-in `--check-router` flag adds one narrow exception: it checks that
    every RESOURCE_MAP/DEFAULT_RESOURCE leaf a skill's router names exists on
    disk (a dead-route guard, scoped to the router block only). It still never
    inspects markdown prose.
  - RESOURCE_MAP parent-child *equality* is not checked by this script either;
    leg 2 of `verify-router-sync.cjs` checks it, as the section "Router-sync
    guard" below records.

  These remain manual review gates:
  ```

### .skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/directory-and-test-conventions.md
- clean

### .skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/imports-and-exports.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/imports-and-exports.md:221 | 1 | The body ends on a bare `---` that separates nothing, left behind by a section that is no longer there, so the page closes on a stray horizontal rule. | Delete line 221 (the trailing `---`); the file should end after the Python exports code block.

### .skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/overview-and-module-organization.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/overview-and-module-organization.md:210 | 1 | The body ends on a bare `---` with a trailing blank line and no section after it, leaving the page closing on a stray horizontal rule. | Delete line 210 (the trailing `---`) and the blank line after it; the file should end after "Implementation details hidden".

### .skilled/skills/sk-code/sk-code-skilled/references/shared/hooks.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/hooks.md:164 | 7 | Two paragraphs under "MCP Config And The Split-Shape Caveat" pack five mechanisms together (symlink, schema compatibility, the excluded `opencode.json`, the field-split requirement, the tested evidence), so a reader cannot scan for the rule that must be implemented. | Replace lines 164-166 with:
  ```markdown
  - `.cursor/mcp.json` is a symlink to the repo's own `.mcp.json`.
  - Cursor's documented MCP schema is byte-compatible with Claude's (`mcpServers` / `command` string / `args` array / `env` object), so one file serves both.
  - `opencode.json` cannot participate — its schema differs (`mcp` key, `command` as an array, `environment` rather than `env`).
  - Cursor's MCP hook payloads split the server and tool across **two** fields — `mcp_server_name: "sequential_thinking"` alongside a BARE `tool_name: "sequentialthinking"` — where Claude packs both into one `mcp__<server>__<tool>` string.
  - The shared `mcp-route-guard` core parses only the packed forms, so a Cursor adapter MUST recombine the two fields before forwarding; passing the bare tool name through matches nothing and the guard silently never advises.
  - Confirmed by testing the core directly: `mcp__figma__get_screenshot` and `figma_get_screenshot` both advise, bare `get_screenshot` does not.
  - `afterMCPExecution` also fires (adding `result_json` + `duration`) but has no Claude-side counterpart to proxy to, so nothing is wired for it.
  ```
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/hooks.md:170 | 7 | The "Discovery Mirror" paragraph is a single ~120-word run that packs six mechanisms (the symlink set, the real-path commands, the entrypoint-guard comparison, the `.mjs` exception, the consistency choice, the README pointer), so the one fact a reader needs — the symlinks produce no output — is buried mid-sentence. | Replace lines 170 with:
  ```markdown
  - `.cursor/hooks/` holds a symlink to every file `.cursor/hooks.json` invokes, purely so the scripts are visible at Cursor's own documented conventional path (`.cursor/hooks/<script>`).
  - `.cursor/hooks.json`'s `command` fields still point at the real paths above, not these symlinks.
  - Invoking `session-start.js`/`session-end.js`/`user-prompt-submit.js`/`precompact.js` through the symlink produces **zero output** (confirmed by direct testing): each compiles from a `.ts` source ending in `runCursorHook(import.meta.url, main)`, whose entrypoint guard compares `process.argv[1]` (stays the symlink path) against the ESM-loader-resolved `import.meta.url` (resolves through the symlink to the real path) — they never match, so `main()` never runs.
  - The plain `.mjs` files have no such guard and work through either path, but every `command` entry stays pointed at the real path for consistency.
  - See `.cursor/hooks/README.md` for the full explanation.
  ```
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/hooks.md:216 | 10 | "(see §7)" is a section-number pointer to the section it already sits in, while the intended target is the "Cross-Runtime Parity" table at the end of §7, so the pointer gives the reader nothing to follow. | Replace `(see §7)` with `(see "Cross-Runtime Parity" below)`.

### .skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md:305 | 6 | The KISS/DRY/SOLID "Design Principles Gate" is filed under §4 REFERENCE COMMENT PATTERNS although it governs general implementation, not comment prefixes, so a reader looking for the gate under its own topic will not find it and a reader inside §4 gets unrelated rules after the reference-comment contract. | Cut lines 305-313 (the `### Design Principles Gate (KISS/DRY/SOLID)` block through "Keep rule constants centralized …") and paste it after the `---` at line 315, promoting the H3 to `## 5. DESIGN PRINCIPLES GATE (KISS/DRY/SOLID)`; the divider then separates §4 from §5, §4 keeps its number and line 265 is untouched, and the file no longer ends on a dangling divider.

### .skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/organization-security-and-examples.md
- [P1] .skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/organization-security-and-examples.md:277 | 10 | "see §4" resolves to this file's own §4 — the section the sentence sits in — not to the canonical "No ephemeral-artifact pointers" rule in `code-style-guide.md` §4, so the reader is sent to the page they are already reading. | Replace `see §4` with ``see [`../../../../sk-code-quality/references/code-style-guide.md`](../../../../sk-code-quality/references/code-style-guide.md) §4``.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/organization-security-and-examples.md:317 | 6 | Five normative cross-language determinism contracts sit inside §5 RELATED RESOURCES, so a reader who skips the link section never sees rules the code is bound by, and the section title misdescribes its own contents. | Move lines 317-327 (the `### Cross-Language Determinism Contracts` block) to immediately before `## 5. RELATED RESOURCES`, promote the heading to `## 5. CROSS-LANGUAGE DETERMINISM CONTRACTS`, and renumber `## 5. RELATED RESOURCES` to `## 6. RELATED RESOURCES`. No inbound reference cites §5 of this file.

### .skilled/skills/sk-code/sk-code-skilled/references/shared/workflow-guardrails.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/workflow-guardrails.md:20 | 4 | §1 OVERVIEW is a single unlabelled paragraph: it has no `### Purpose` and no `### When to Use`, the two subsections the reference template requires and every other file in this set carries, so a reader cannot tell from the overview when to load the file. | Replace the body of `## 1. OVERVIEW` (line 22) with:
  ```markdown
  ### Purpose

  The shared [implementation](../workflow-implement.md) and [verification](../workflow-verify.md) workflows apply on every surface. This file adds what holds only for OpenCode system code under `.skilled/`: the implementation guardrails, the verification command chain and the runtime build traps.

  ### When to Use

  - Implementing or verifying a change to OpenCode system code under `.skilled/`
  - Deciding whether a source edit needs a `dist/` rebuild before its behavior is verified
  - Handing missing build output, stale generated runtime files or a wrong package boundary back to implementation
  ```
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/workflow-guardrails.md:44 | 7 | One paragraph packs four separate rules — the root/project-reference `tsc --build` command, the satellite `tsc -p` command, the `--noEmit --composite false` overlay, and the Vitest-backed test script — into prose, so the command for a given package is hard to extract. | Replace line 44 with:
  ```markdown
  Use the package script for the package you changed:

  - **Spec-kit root and project-reference workspaces**: `tsc --build`.
  - **Satellite packages with their own package boundary**: `tsc -p tsconfig.build.json`. A satellite typecheck script may add `--noEmit --composite false` over that same overlay.
  - **TypeScript tests**: run the package's Vitest-backed script where present, such as `npm test`, `npm run test:core`, or the targeted `vitest run ...` command exposed by that package.
  ```

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

### .skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/tsdoc-errors-and-async.md

- [P2] .skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/tsdoc-errors-and-async.md:166-227 | 6 | `### Custom Error Pattern` runs before `### Error Code Const Object`, so the class example declares a one-entry `export const ErrorCodes` at 173-175 while the full six-entry map is defined forty lines later at 215-222, after the code that consumes it | move lines 212-227 (the `### Error Code Const Object` block) to immediately before line 166 so the full map precedes its consumer.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/tsdoc-errors-and-async.md:156 | 2 | the `@example` cell wraps its fences in a single-backtick span, so the backslashes render literally as ``` \`\`\` ``` instead of showing a fence | replace the cell with a double-backtick span: ``| `@example` | Usage example with code block | ``@example ```typescript ... ``` `` |``
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/tsdoc-errors-and-async.md:320 | 1 | the file ends with a section divider and no section after it, leaving a bare rule at EOF; the template uses `---` only between sections | delete line 320.

### .skilled/skills/sk-code/sk-code-skilled/references/typescript/quick-reference/imports-errors-and-tsconfig.md

- [P2] .skilled/skills/sk-code/sk-code-skilled/references/typescript/quick-reference/imports-errors-and-tsconfig.md:258-279 | 5 | the build-strategy rule that decides which of the two identical `npm run build` lines applies sits at 279, after the command block the reader executes | move line 279 to before the code fence at line 260.

### .skilled/skills/sk-code/sk-code-skilled/references/typescript/quick-reference/template-naming-and-types.md

- [P2] .skilled/skills/sk-code/sk-code-skilled/references/typescript/quick-reference/template-naming-and-types.md:28-30 | 6, 7 | the package-layout note sits inside Purpose, separating Purpose from When to Use, and packs three module configurations into one sentence | move lines 28-30 to after line 36 and render them as: `Current system-spec-kit TypeScript is package-aware:` then `- \`shared/\` and \`mcp-server/\` use NodeNext ESM`, `- \`scripts/\` uses ES2022 ESM`, `- root CommonJS settings are only fallback defaults for workspaces that do not override them`.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/typescript/quick-reference/template-naming-and-types.md:24-26,280 | 1, 10 | the file's only cross-references sit inside Purpose and the file has no Related Resources section, ending instead with a divider at 280 that introduces nothing | drop ` For detailed explanations, see:` from line 24 and replace the divider at line 280 with `---` followed by `## 7. RELATED RESOURCES` and the two moved link bullets at lines 25-26.

### .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md

- [P2] .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md:215-218 | 2 | items 2 and 3 state the same principle twice under two labels (`Focus on purposeful semantics` and `Focus on WHY, not WHAT`) | replace items 2-3 with `2. **Focus on purposeful semantics**: Explain WHY something is done — intent, constraints, reasoning — not WHAT it does` and renumber item 4 to `3.`; this removes one line, so the recorded naming-and-commenting citation now at line 229 moves to 228 and must be updated.
- [P1] .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md:244 | 1 | `See \`quality-standards.md\`` points at a file that does not exist under `references/typescript/`; the full TSDoc reference is `tsdoc-errors-and-async.md`, so the pointer is dead | replace with `See [tsdoc-errors-and-async.md](../quality-standards/tsdoc-errors-and-async.md) for the full TSDoc reference.`
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md:295 | 7 | one paragraph packs four things — co-locate the `.d.ts`, the failing `declare module` form, the `TS7016` failure, and the alternative | replace with bullets: `- **Do**: add a \`.d.ts\` declaration file co-located with the JS module and sharing its exact basename.` `- **Don't**: use a relative \`declare module './legacy-config.js' { ... }\` block; it fails with \`TS7016 (Could not find a declaration file for module …)\` on an untyped local sibling.` `- **Instead**: use plain top-level declarations:`

### .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md

- [P2] .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md:53-56 | 7 | one Rationale paragraph packs the strict-mode explanation and three package module configurations into a single sentence | keep the first sentence and render the rest as: `Current system-spec-kit workspaces are package-aware:` then `- \`shared/\` and \`mcp-server/\` use NodeNext ESM`, `- \`scripts/\` uses ES2022 ESM`, `- the root CommonJS setting is only a fallback default`.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md:380 | 1 | the file ends with a section divider and no section after it, leaving a bare rule at EOF | delete line 380.

