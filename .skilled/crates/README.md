---
title: "Crates: the Rust binaries Skilled ships"
description: "Holds the Rust crates Skilled ships outside any skill folder, one self-contained crate per folder."
trigger_phrases:
  - "skilled rust crates"
  - "bots-tui crate folder"
  - "cargo manifest path build"
version: 1.0.0.0
---

# Crates: the Rust binaries Skilled ships

---

## 1. OVERVIEW

`.skilled/crates/` holds the Rust crates Skilled ships outside any skill folder. Each crate builds on its own with `--manifest-path`. There is no Cargo workspace file at this level.

The crates sit here for two reasons. A skill hub root may hold only the folders `.skilled/commands/doctor/scripts/parent-skill-check.cjs` allows, and that list has no crates folder. A crate inside a skill would also put its `target/` build output where the skill tools walk.

---

## 2. WHAT BELONGS HERE

| Belongs | Why |
|---|---|
| One folder per crate, each with its own `Cargo.toml`, `Cargo.lock`, `README.md`, `src/` and `tests/` | A crate builds on its own, so it carries its own manifest and lock file |
| Files the crate ships beside its code, such as `bots-tui/design/` | They stay inside that crate's folder, next to the code they describe |

| Does not belong | Where it goes |
|---|---|
| Skill documents, mode packets and the bots runtime TypeScript | Under [`../skills/system-skilled-bots/`](../skills/system-skilled-bots/README.md) |
| A crate's `target/` build output | Nowhere, git ignores it through the `/.skilled/crates/bots-tui/target` line |
| Loose files at this level other than this README | Inside the crate folder that owns them |
| Planning and design work in progress | The spec packet that owns it |

---

## 3. DIRECTORY TREE

```text
crates/
+-- README.md            # What belongs here and how to validate a crate
`-- bots-tui/            # The crate that builds the bots-ui binary
    +-- Cargo.toml       # The crate manifest, read through --manifest-path
    +-- Cargo.lock       # The locked dependency set every --locked command reads
    +-- README.md        # Build, run, keys and validation for bots-ui
    +-- design/          # The screen mockups, key map, glyph table and payload contracts
    +-- src/             # The crate source
    `-- tests/           # The crate tests and the fake bots CLI they read
```

---

## 4. CRATES

| Crate | What it builds | README |
|---|---|---|
| `bots-tui/` | The `bots-ui` binary, the terminal screen for the skilled bots CLI | [`bots-tui/README.md`](bots-tui/README.md) |

The usual way to start the screen is `node .skilled/bin/bots.cjs ui` from inside a checkout.

---

## 5. VALIDATION

Run from the repository root.

```bash
cargo fmt --check --manifest-path .skilled/crates/bots-tui/Cargo.toml
cargo clippy --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml --all-targets -- -D warnings
cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml
```

Each command exits 0. `cargo test` prints a `test result: ok` line for every target.

The workflow `.github/workflows/bots-runtime.yml` runs the same three checks plus a release build for `bots-tui` when a path under `.skilled/crates/bots-tui/` changes.

---

## 6. RELATED

- [`bots-tui/README.md`](bots-tui/README.md) covers the screen's build, flags, keys and exit codes.
- [`../skills/system-skilled-bots/README.md`](../skills/system-skilled-bots/README.md) covers the bots skill the screen reads.
