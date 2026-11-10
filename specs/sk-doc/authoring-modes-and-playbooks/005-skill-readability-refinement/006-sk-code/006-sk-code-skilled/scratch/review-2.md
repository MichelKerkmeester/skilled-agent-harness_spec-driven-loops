VERDICT: FIX

- [P1] `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md:99` | 9 | the usage example still points at “the current refinement and release-alignment review”, a transient artifact no reader can reproduce | replace line 99 with `Expected output: Findings name any file missing from the contents table and any documented path that no longer resolves.`

- [P1] `.skilled/skills/sk-code/sk-code-skilled/references/config/quick-reference.md:301-311` | 1 | the FILE LOCATIONS tree still renders `.skilled/config/opencode.json` and `.skilled/skill/`, neither of which exists; the root config is `opencode.json` and skills live under `.skilled/skills/` | replace the fenced tree with:
  ```text
  opencode.json
  .skilled/
  └── skills/
      └── [skill-name]/
          └── config/
              ├── config.jsonc
              ├── filters.jsonc
              └── complexity-config.jsonc
  ```

- [P1] `.skilled/skills/sk-code/sk-code-skilled/references/config/style-guide.md:322-328` | 1 | the schema example still puts two `$schema` keys in one object, so it is invalid JSON and contradicts the P0 “No duplicate keys” gate | replace the block with:
  ```jsonc
  {
    "$schema": "https://json-schema.org/draft-07/schema"
    // For VSCode settings, use "vscode://schemas/settings/user" instead.
  }
  ```

- [P1] `.skilled/skills/sk-code/sk-code-skilled/references/javascript/quick-reference.md:241` | 1 | `// Path resolution (safe)` labels `path.resolve(basePath, relativePath)` as safe although it does not confine the result to `basePath`; the security part adds the `startsWith(resolvedBase + path.sep)` check this snippet omits | replace line 241 with `// Path resolution (then verify the result starts with basePath + path.sep before use)`

- [P1] `.skilled/skills/sk-code/sk-code-skilled/references/javascript/style-guide.md:430-431` | 1 | the TODO examples omit the owner and conflict with the `review.todo-tracking` rule, which requires `TODO(owner)` and keeps ticket ids out | replace lines 430-431 with:
  ```javascript
  // TODO(username): [description of work needed]
  // FIXME(username): [description of bug to fix]
  ```

- [P2] `.skilled/skills/sk-code/sk-code-skilled/references/python/quick-reference.md:403` | 8 | the P2 index omits `Consistent String Quotes`, which `python/quality-standards.md` §4 lists | insert `[ ] Consistent string quotes` after `[ ] Import order`.

- [P2] `.skilled/skills/sk-code/sk-code-skilled/references/python/style-guide.md:74` | 1 | the alternative full-box example is 79 characters wide while lines 73 and 75 are 78, so the right border is one column out | delete exactly one space immediately before the closing `║` on line 74, making the line 78 characters and aligning its right border with lines 73 and 75.

- [P1] `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:268-272` | 8 | the `[workspace] members` array omits `crates/sidecar`, which the Workspace Layout tree and Responsibility Matrix both include | add `  "crates/sidecar",` after `  "crates/wasm",`:
  ```toml
  members = [
    "crates/core",
    "crates/napi",
    "crates/wasm",
    "crates/sidecar",
  ]
  ```

- [P1] `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:130` | 1 | the review-evidence template cites `rust_checklist.md`, which does not exist; the Rust checklist is the four files in `rust-checklist/` | replace line 130 with:
  ```markdown
  - [ ] Rust standards validated in the `rust-checklist/` files
  ```

- [P2] `.skilled/skills/sk-code/sk-code-skilled/references/shared/hooks.md:224` | 10 | `(see §7)` points at the section it already sits in, not the “Cross-Runtime Parity” table it means | replace `(see §7)` with `(see "Cross-Runtime Parity" below)`.

- [P2] `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md:92-98` | 6 | the moved rule was placed as a paragraph outside the WHY Comments checklist, so it no longer scans with the checklist items the finding routes it into | remove the paragraph at line 98 and add `    - Explain reasoning, not mechanics` as the last line inside the fenced block at lines 92-96:
  ```markdown
  [ ] Purposeful WHY comments only (max 3 comments per 10 LOC)
      - Comments explain WHY, not WHAT
      - No narrative comments describing obvious mechanics
      - Explain reasoning, not mechanics
  ```

- [P2] `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/toolchain-and-project-structure.md:279-283` | 1, 6 | the new `## 4. MODULE AND WORKSPACE LAYOUT` H2 is immediately followed by an identically named `### Module and Workspace Layout` H3, a duplicate heading and anchor introduced by the move | delete the H3 line and its following blank line so the H2 carries the title:
  ```markdown
  ## 4. MODULE AND WORKSPACE LAYOUT

  Use a pure core with thin runtime adapters:
  ```
