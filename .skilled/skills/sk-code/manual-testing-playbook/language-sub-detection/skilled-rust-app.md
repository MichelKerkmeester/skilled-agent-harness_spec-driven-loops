---
title: "LS-007: SKILLED Rust App Sub-Detection"
description: "Verify that within SKILLED surface, an app-style Rust binary named only by its crate (a clap CLI, with no .rs path in the prompt) loads the rust/* references alone, and that no TypeScript, Python, Shell or Config reference loads when no other language is in play."
version: 1.1.0.0
---

# LS-007: SKILLED Rust App Sub-Detection

## 1. OVERVIEW

Verify the RUST row in the sub-detection table of section 3 of `shared/references/stack-detection.md` for a Rust binary that owns its own entry point. The row resolves on `.rs` first, then on the Cargo markers and the binding or app-crate vocabulary, which names `clap cli`, `clap crate`, `clap derive`, `clap::`, `ratatui` and `crossterm`. LS-006 covers the parity case, where Rust and TypeScript load together. This scenario covers the opposite case: a Rust CLI with no TypeScript side, where the Rust set loads by itself and the TypeScript trio stays out. The prompt names no `.rs` file and no Cargo marker, so only the app-crate words can select Rust.

The Rust set holds the rules for this case. Its checklist scope names app-style Rust and its process contract, the exit code and the bytes on stdout and stderr, and its TypeScript ownership rules apply only where a TypeScript backend owns the process. A route that pulls the TypeScript trio in for this prompt has misread that scope.

This repository ships no `.rs` source and no `Cargo.toml`, so the reviewed code is a fixture the operator creates in a sandbox. The sandbox sits under `.skilled/skills/.state/`, which git ignores, because a `/tmp` path with no `.rs` or `.ts` file in the prompt leaves the surface `UNKNOWN` and loads no Rust reference. The fixture holds a `src/main.rs` for the review, so a worker that lists the sandbox sees `.rs` evidence. The prompt-only replay in step 1 is what proves the app-crate words, because it reads the prompt text and nothing else. The Rust reference set is three split folders rather than three files, and the Rust checklist is a folder of parts, so both are graded per path.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer who keeps a small Rust command line tool wants it reviewed against the right standards before a release.

**Exact prompt**:
```
In .skilled/skills/.state/skc-LS007-sandbox I have a clap CLI that prints a report and exits with code 2 on error. Review it and tell me which standards you applied.
```

Prompt: `In .skilled/skills/.state/skc-LS007-sandbox I have a clap CLI that prints a report and exits with code 2 on error. Review it and tell me which standards you applied.`

**Expected detection**:
- Surface: `SKILLED`
- Sub-language: `RUST` only. No other language is named, so no second trio joins it.

**Expected references loaded**:
- `sk-code-skilled/references/rust/style-guide/`
- `sk-code-skilled/references/rust/quality-standards/`
- `sk-code-skilled/references/rust/quick-reference/`
- `shared/references/stack-detection.md` and `shared/references/universal/code-quality-standards.md`, the hub guidance every route loads

The language-shared folder `sk-code-skilled/references/shared/` is not expected. The hub route adds a doc from it only for an intent that maps it, IMPLEMENTATION, VERIFICATION or HOOKS, and this review prompt scores none of them.

**Expected assets loaded**, as `quality-gate.cjs --explain` selects them for the fixture's `src/main.rs`:
- `sk-code-skilled/assets/checklists/rust-checklist/`
- `sk-code-skilled/assets/checklists/universal-checklist.md`

The selector also lists `skill-authoring.md`, because the sandbox sits under `.skilled/skills/`. That row is not graded.

**Expected NOT loaded**: any of `sk-code-skilled/references/{typescript,python,shell,config}/`, and `sk-code-skilled/assets/checklists/typescript-checklist.md`.

---

## 3. TEST EXECUTION

### Preconditions

1. The sandbox fixture exists:
   ```
   bash: mkdir -p .skilled/skills/.state/skc-LS007-sandbox/src && printf '[package]\nname = "report"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]\nclap = { version = "4", features = ["derive"] }\n' > .skilled/skills/.state/skc-LS007-sandbox/Cargo.toml && printf 'fn main() { std::process::exit(2) }\n' > .skilled/skills/.state/skc-LS007-sandbox/src/main.rs
   ```
2. The Rust reference set is intact: `bash: ls .skilled/skills/sk-code/sk-code-skilled/references/rust/` lists `quality-standards`, `quick-reference` and `style-guide`.
3. Skill advisor callable.
4. The fixture is ignored: `bash: git status --short .skilled/skills/.state/skc-LS007-sandbox` prints nothing.

### Exact Command Sequence

1. **Prompt-only replay**:
   ```
   bash: node -e 'const {routeSkillResources}=require("./.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs"); const r=routeSkillResources({skillRoot:".skilled/skills/sk-code",taskText:process.argv[1]}); console.log(JSON.stringify({surface:r.surface,intents:r.surfaceIntents,resources:r.resources},null,2))' "In .skilled/skills/.state/skc-LS007-sandbox I have a clap CLI that prints a report and exits with code 2 on error. Review it and tell me which standards you applied." > /tmp/skc-LS007-replay.json
   ```
   Verify: `surface` is `SKILLED`, `intents` holds `RUST`, every `sk-code-skilled/references/rust/` part is in `resources`, and no `typescript`, `python`, `shell` or `config` path is.
2. **Advisor probe**:
   ```
   bash: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "In .skilled/skills/.state/skc-LS007-sandbox I have a clap CLI that prints a report and exits with code 2 on error. Review it and tell me which standards you applied." --threshold 0.8 > /tmp/skc-LS007-advisor.txt
   ```
3. **Verify**: sk-code is the top-1 candidate and its `passes_threshold` is true.
4. **Checklist selector**: `bash: node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --explain .skilled/skills/.state/skc-LS007-sandbox/src/main.rs > /tmp/skc-LS007-explain.json`. Verify its `surfaces` is `["SKILLED"]` and its `checklists` list the `rust-checklist/` parts and `universal-checklist.md`.
5. **Invoke sk-code** with the exact prompt.
6. **Capture loaded refs** to `/tmp/skc-LS007-loaded-refs.txt`.
7. **Verify**: all three rust folders and the hub's `shared/references/` guidance loaded, the rust checklist parts loaded, and 0 typescript/python/shell/config paths loaded.
8. **Remove the fixture**: `bash: rm -rf .skilled/skills/.state/skc-LS007-sandbox`.

### Expected Signals

Expected signals: `LANGUAGE: RUST` reported alone for the prompt; the Rust trio represented by its folders rather than a single file; `shared/references/stack-detection.md` present; the review names the process contract, meaning the exit code and the bytes on stdout and stderr; 0 typescript/python/shell/config refs.

### Pass/Fail Criteria

- **PASS** iff: the prompt-only replay reports `SKILLED` with RUST and every rust part AND RUST is detected in the live run AND all three rust folders plus `shared/references/stack-detection.md` are in the load set AND the selector lists `rust-checklist/` and `universal-checklist.md` AND 0 typescript/python/shell/config refs are loaded.
- **FAIL** iff: the prompt-only replay misses RUST or reports a surface other than `SKILLED`, RUST is not detected, any rust folder is missing, the TypeScript trio or `typescript-checklist.md` loads with no `.ts` evidence in the prompt, or any python/shell/config ref is loaded.

Evidence: `/tmp/skc-LS007-replay.json` (prompt-only replay), `/tmp/skc-LS007-advisor.txt` (advisor probe output), `/tmp/skc-LS007-explain.json` (checklist selector) and `/tmp/skc-LS007-loaded-refs.txt` (loaded-refs transcript).

### Failure Triage

1. If the TypeScript trio loads: read the Rust checklist scope in `sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md`. TypeScript ownership applies only where a TypeScript backend owns the process, and this prompt names none.
2. If RUST is not detected at all: confirm SKILLED was detected and that the `clap cli` phrase appears in the prompt. The detector takes any one Rust marker, and this prompt carries only the app-crate phrase, so confirm the RUST row in `shared/references/stack-detection.md` and the detector in `router-replay-lib.cjs` still list it.
3. If the surface is `UNKNOWN`: the sandbox path left `.skilled/`. A path outside it, such as `/tmp`, carries no SKILLED marker when the prompt names no `.rs` or `.ts` file.
4. If the route finds RUST from the word `clap` in an unrelated prompt: the keywords are the phrases `clap cli`, `clap crate`, `clap derive` and `clap::`, never the bare word, so check that no router list carries a bare `clap`.
5. If `rust-checklist/` is empty in the load set: the Rust checklist is a folder of parts, so there is no single `rust-checklist.md` to load.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` - Root directory page and scenario summary.
- `.skilled/skills/sk-code/shared/references/stack-detection.md` (section 3, the RUST row and its app-crate vocabulary).
- `.skilled/skills/sk-code/ROUTER.md` (section 4, the language overlay).
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/` - the expected-loaded Rust references.
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/` - the Rust checklist parts, whose scope names app-style Rust.

Catalog: `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`, the entry that names `ROUTER.md` as the owner of the stage-two resource maps the language overlay lives in.

---

## 5. SOURCE METADATA

- Group: Language Sub-Detection
- Playbook ID: LS-007
- **Created**: 2026-11-26
- **Critical path**: No
- **Destructive**: No (the only writes are two gitignored fixture files under `.skilled/skills/.state/skc-LS007-sandbox/`, removed in step 8)
- **Sandbox**: the reviewed code lives in `.skilled/skills/.state/skc-LS007-sandbox/`, which git ignores, because the repository ships no `.rs` source and no Cargo markers and a `/tmp` path would leave the surface `UNKNOWN`.
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
