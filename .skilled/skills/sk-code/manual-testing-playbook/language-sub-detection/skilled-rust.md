---
title: "LS-006: SKILLED Rust Sub-Detection"
description: "Verify that within SKILLED surface, Rust evidence (.rs, then the Cargo markers and napi-rs or wasm-bindgen vocabulary) loads the rust/* references, and that Rust never displaces the TypeScript trio on a parity task that touches both languages."
version: 1.5.1.0
---

# LS-006: SKILLED Rust Sub-Detection

## 1. OVERVIEW

Verify the last two rules in the sub-detection table of section 3 of `shared/references/stack-detection.md`. The RUST row resolves on `.rs` first, then on the `Cargo.toml` or `Cargo.lock` markers and napi-rs or wasm-bindgen vocabulary. The paragraph below the table adds the rule this scenario exists for: Rust never overrides another language, so a napi-rs or WASM parity task touching `.rs` and `.ts` loads both trios plus the shared guidance, because the Rust module must match its TypeScript oracle byte for byte. The Cargo markers count only after SKILLED is detected, never as a signal for another project's surface.

This repository ships no `.rs` source and no `Cargo.toml`, so the language evidence is a fixture the operator creates in a sandbox. The Rust reference set is three split folders rather than three files, and the Rust checklist is a folder of parts, so both are graded per path.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer who keeps a Rust binding and the TypeScript client it must match wants both files reviewed together so the two cannot drift.

**Exact prompt**:
```
In /tmp/skc-LS006-sandbox I have lib.rs and client.ts, a napi-rs binding and the TypeScript client it has to match byte for byte. Review both together and tell me which standards you applied to each.
```

Prompt: `In /tmp/skc-LS006-sandbox I have lib.rs and client.ts, a napi-rs binding and the TypeScript client it has to match byte for byte. Review both together and tell me which standards you applied to each.`

**Expected detection**:
- Surface: `SKILLED`
- Sub-language: `RUST` for the `.rs` side and `TYPESCRIPT` for the `.ts` side, both at once. Neither displaces the other.

**Expected references loaded**:
- `sk-code-skilled/references/rust/style-guide/`
- `sk-code-skilled/references/rust/quality-standards/`
- `sk-code-skilled/references/rust/quick-reference/`
- `sk-code-skilled/references/typescript/style-guide/`
- `sk-code-skilled/references/typescript/quality-standards/`
- `sk-code-skilled/references/typescript/quick-reference/`
- `sk-code-skilled/references/shared/`

**Expected assets loaded**:
- `sk-code-skilled/assets/checklists/rust-checklist/`
- `sk-code-skilled/assets/checklists/typescript-checklist.md`
- `sk-code-skilled/assets/checklists/universal-checklist.md`

**Expected NOT loaded**: any of `sk-code-skilled/references/{python,shell,config}/`.

---

## 3. TEST EXECUTION

### Preconditions

1. The sandbox fixture exists:
   ```
   bash: mkdir -p /tmp/skc-LS006-sandbox && printf 'pub fn normalize(input: &str) -> String { input.trim().to_string() }\n' > /tmp/skc-LS006-sandbox/lib.rs && printf 'export function normalize(input: string): string { return input.trim(); }\n' > /tmp/skc-LS006-sandbox/client.ts
   ```
2. The Rust and TypeScript reference sets are intact: `bash: ls .skilled/skills/sk-code/sk-code-skilled/references/rust/` and `bash: ls .skilled/skills/sk-code/sk-code-skilled/references/typescript/` each list `quality-standards`, `quick-reference` and `style-guide`.
3. Skill advisor callable.

### Exact Command Sequence

1. **Advisor probe**:
   ```
   bash: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "In /tmp/skc-LS006-sandbox I have lib.rs and client.ts, a napi-rs binding and the TypeScript client it has to match byte for byte. Review both together and tell me which standards you applied to each." --threshold 0.8 > /tmp/skc-LS006-advisor.txt
   ```
2. **Verify**: sk-code is the top-1 candidate and its `passes_threshold` is true.
3. **Invoke sk-code** with the exact prompt.
4. **Capture loaded refs** to `/tmp/skc-LS006-loaded-refs.txt`.
5. **Verify**: all three rust folders, all three typescript folders and `sk-code-skilled/references/shared/` loaded; 0 python/shell/config paths loaded.
6. **Remove the fixture**: `bash: rm -rf /tmp/skc-LS006-sandbox`.

### Expected Signals

Expected signals: `LANGUAGE: RUST` and `LANGUAGE: TYPESCRIPT` both reported for the same prompt; each trio represented by its folder rather than a single file; `sk-code-skilled/references/shared/` present; 0 python/shell/config refs.

### Pass/Fail Criteria

- **PASS** iff: RUST is detected for the `.rs` side AND TYPESCRIPT stays detected for the `.ts` side AND both trios plus `sk-code-skilled/references/shared/` are in the load set AND 0 python/shell/config refs are loaded.
- **FAIL** iff: RUST displaces TYPESCRIPT (only the rust trio loads), TYPESCRIPT displaces RUST, either trio is missing, the Cargo-marker rule fires on the sandbox path alone with no `.rs` or vocabulary evidence, or any python/shell/config ref is loaded.

Evidence: `/tmp/skc-LS006-advisor.txt` (advisor probe output) and `/tmp/skc-LS006-loaded-refs.txt` (loaded-refs transcript).

### Failure Triage

1. If only one trio loads: read the never-overrides paragraph in `shared/references/stack-detection.md` section 3 and confirm the route applied it, because the parity case is explicitly a two-language load.
2. If RUST is not detected at all: confirm the `.rs` extension and the napi-rs vocabulary both appear in the prompt, and that the RUST row still lists them.
3. If RUST is detected for a path with no `.rs`: the Cargo-marker branch fired too early. It counts only after SKILLED is detected, so confirm the surface was SKILLED first.
4. If `rust-checklist/` is empty in the load set: the Rust checklist is a folder of parts, so there is no single `rust-checklist.md` to load.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` — Root directory page and scenario summary.
- `.skilled/skills/sk-code/shared/references/stack-detection.md` (section 3, the RUST row and the never-overrides paragraph).
- `.skilled/skills/sk-code/ROUTER.md` (section 4, the language overlay).
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/` — the expected-loaded Rust references.
- `.skilled/skills/sk-code/sk-code-skilled/references/typescript/` — the TypeScript side of the parity load.
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/` — the Rust checklist parts.

Catalog: `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`, the entry that names `ROUTER.md` as the owner of the stage-two resource maps the language overlay lives in.

---

## 5. SOURCE METADATA

- Group: Language Sub-Detection
- Playbook ID: LS-006
- **Created**: 2026-10-28
- **Critical path**: No
- **Destructive**: No (the only writes are two fixture files under `/tmp/skc-LS006-sandbox/`, removed in step 6)
- **Sandbox**: the language evidence lives in `/tmp/skc-LS006-sandbox/`, because the repository ships no `.rs` source and no Cargo markers.
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
