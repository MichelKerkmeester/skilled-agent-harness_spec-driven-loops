# sk-code-opencode changelog digest

Skill path: `.opencode/skills/sk-code/sk-code-opencode/`
Versions covered: v1.0.0.0 through v1.0.0.5 (only 2 changelog files exist, fewer than 10, so all were read)
Date range: none. Neither changelog file carries a date in its frontmatter or body.

Note on file layout: `changelog/v1.0.0.0.md` is a two-entry file. Its frontmatter declares `version: 1.0.0.4` and its body holds the `v1.0.0.4` entry first and the `v1.0.0.0` establishment entry second. The filename does not match the newest version inside it.

---

## Per version, newest first

### v1.0.0.5 (`changelog/v1.0.0.5.md`)

Documentation only. The README was rewritten from a tabular reference-card layout with an AT A GLANCE table and a layout list into the purpose-first narrative standard: a one-line pitch, a problem-first OVERVIEW, a capability table for the language slice and the remaining facts in the family section model. The README frontmatter version moved from 1.0.0.4 to 1.0.0.5. The entry states explicitly that surface behavior and the SKILL.md contract were untouched and that no migration is required. Work was tracked under spec folder `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/015-sk-code-opencode` at Level 2.

### v1.0.0.4 (inside `changelog/v1.0.0.0.md`)

Rust became a first-class language on the OpenCode surface alongside TypeScript, Python, shell, JavaScript and config, making six languages. New material: `references/rust/` holding the system-code alignment gate applied to Rust plus the napi-rs, wasm-bindgen, WASI and cdylib FFI-boundary rules, `assets/checklists/rust_checklist.md` as the per-language quality gate, and `manual-testing-playbook/language-standards/009-rust-standards.md` as scenario `OC-009` in the surface benchmark. Rust detection works off the `.rs` extension, with `Cargo.toml` and `Cargo.lock` selecting it when no `.rs` file is touched. napi-rs and wasm-bindgen vocabulary are intent signals only, not stand-alone surface detectors. Surface routing, the parent language union and the shared router-replay all register Rust as the sixth OpenCode language.

BREAKING within this same entry: language slicing changed from a single first-match language to the full touched-language set, so a task touching two languages now pulls both slices. The entry says in its own words that this supersedes the v1.0.0.0 standard of one language per task. A fix in the same release removed a duplicate Rust playbook feature file that collided with the config-schema scenario on id `OC-004`, so the Rust scenario is `OC-009` and the surface benchmark now loads nine unique scenarios. The entry also records that builds 1.0.0.1 through 1.0.0.3 were repository-sweep and frontmatter maintenance with no surface-behavior change, and that the version was reconciled to 1.0.0.4 across SKILL.md, README.md and the changelog.

### v1.0.0.0 (inside `changelog/v1.0.0.0.md`)

First release of the opencode surface packet. MOVED PATH: system-code evidence that previously lived under the workflow modes at `code-implement/references/opencode/`, `code-quality/assets/opencode-checklists/` and `shared/references/opencode-shared/` was consolidated under one read-only surface packet on the sk-code hub's surface axis. The packet shipped SKILL.md as the surface contract, README.md, `references/` with the TypeScript, Python, shell, config and JavaScript standards plus a language-agnostic `shared/` tier covering universal patterns, code organization, hooks and alignment verification, and `assets/checklists/` with component authoring checklists for skill, agent, command and MCP server plus per-language quality gates. The entry names four non-negotiable system-code standards: plugins never write to the TUI, descriptors are load-bearing, alignment drift is a verification gate, and one language per task. That last one was superseded in v1.0.0.4. Packet identity per the entry: `packetKind: surface`, `backendKind: evidence-base`, read-only with a tool surface inside Read, Bash, Grep and Glob, and advisor-invisible via `routingClass: metadata`. Spec-folder authoring is explicitly out of scope and stays in system-spec-kit.

---

## Facts the v4 draft gets wrong or misses

Draft read: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`, 463 lines.

- MISSES the multi-language slicing change. `changelog/v1.0.0.0.md` v1.0.0.4 states that slicing moved from first-match single language to the full touched-language set, superseding the earlier one-language-per-task standard. The draft's Rust paragraph at line 321 and its summary bullet at line 33 mention only Rust as a first-class language and say nothing about a task now pulling every touched language's slice. This is user-visible routing behavior, not internal cleanup.
- MISSES the six-language count. `changelog/v1.0.0.0.md` v1.0.0.4 names Rust as the sixth OpenCode language after TypeScript, Python, shell, JavaScript and config. Draft line 321 says Rust is first-class but never states the language set the surface slices on.
- MISSES the old paths the opencode evidence came from. `changelog/v1.0.0.0.md` v1.0.0.0 names `code-implement/references/opencode/`, `code-quality/assets/opencode-checklists/` and `shared/references/opencode-shared/` as the sources. The draft's Repoint what moved bullet at line 444 tells readers that sk-code files moved under new mode and surface packets but gives no old-path list for this surface, so a reader with local references to those three paths gets no concrete target.
- MISSES the benchmark scenario id fix. `changelog/v1.0.0.0.md` v1.0.0.4 records the duplicate Rust playbook file colliding with the config-schema scenario on `OC-004`, the reassignment to `OC-009` and the resulting nine unique scenarios. The draft has no equivalent. This one is internal and arguably below release-notes altitude.
- MISSES the v1.0.0.5 README rewrite. `changelog/v1.0.0.5.md` is documentation only and states no behavior changed, so its omission from the draft is defensible, but the draft also never mentions the README refinement program that produced it.
- No factual contradiction found. Draft line 321's claim that routing covers both child and parent-union layouts matches `changelog/v1.0.0.0.md` v1.0.0.4, which says surface routing, the parent language union and the shared router-replay all register Rust. Draft line 307's description of `sk-code-opencode` as a read-only surface packet matches the v1.0.0.0 entry's read-only, evidence-base, advisor-invisible identity. Draft line 309's breaking-move claim matches the v1.0.0.0 consolidation.

---

## Current version and identity

- SKILL.md frontmatter version: `1.0.0.4` (`.opencode/skills/sk-code/sk-code-opencode/SKILL.md`, `version: 1.0.0.4`).
- README.md frontmatter version: `1.0.0.5`, and the newest changelog file is `v1.0.0.5.md`. SKILL.md is therefore one build behind README.md and the changelog. `changelog/v1.0.0.5.md` bumped only the README, so this drift is expected by that entry rather than an error, but the packet does not present a single version number.
- Identity: this is a MODE, specifically a read-only surface packet under a parent hub. There is no `mode-registry.json` at `.opencode/skills/sk-code/sk-code-opencode/`. The registry lives one level up at `.opencode/skills/sk-code/mode-registry.json`, which lists `sk-code-opencode` in its `surfaces` array alongside `sk-code-webflow`, `sk-code-mobile-cli` and `sk-code-obsidian`, and carries a modes entry with `workflowMode: "sk-code-opencode"` and `packet: "sk-code-opencode"`. The parent also holds `hub-router.json`, `graph-metadata.json`, `description.json` and `leaf-manifest.json`, which is the parent-hub metadata set. The surface itself is advisor-invisible per its own v1.0.0.0 entry, so it is reached through the hub rather than by an advisor route of its own.
