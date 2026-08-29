---
title: Skill Reference Integrity
description: The cross-repo drift guard that resolves every plugin path this surface names, why a surface packet rots silently without it, and why the guard checks a file that must never exist.
trigger_phrases:
  - "skill reference integrity"
  - "cross-repo drift guard"
  - "scan skill references"
  - "surface cites a dead path"
  - "broken zero"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Skill Reference Integrity

This surface lives in a different repository from the plugin it describes. Nothing in either
repository's own gates makes the two move together, so a citation here can go stale without a single
check turning red. `tools/naming/scan-skill-references.mjs` is what closes that gap.

---

## 1. OVERVIEW

### Core Principle

A surface packet is only worth reading if its paths resolve. Prose that names
`src/views/table-renderer.ts` is making a claim about another repository, and that claim expires the
moment someone renames the file. The guard turns every such claim into something a command can check.

### When to Use

- After any rename, move, or deletion in the plugin tree
- Before claiming a phase of this packet complete
- When adding a reference, checklist, or playbook scenario that cites a plugin path
- As part of `scripts/run-source-gates.sh`, which runs it alongside the three source scanners

### Key Sources

- `tools/naming/scan-skill-references.mjs` — the guard
- `scripts/run-source-gates.sh` — the runner that invokes it

---

## 2. WHAT IT RESOLVES

The guard reads this surface's `SKILL.md` plus every non-symlinked document under `references/`,
`assets/`, and `manual-testing-playbook/`. From each it extracts backticked tokens and keeps the ones
that name something in the plugin repository: anything under `src/`, `tools/`, `screenshots/`, or
`specs/`, plus the repo-root files it owns — `styles.css`, `manifest.json`, `package.json`,
`esbuild.config.mjs`, and their siblings.

Symlinked references are skipped deliberately. `workflow-implement.md`, `workflow-debug.md`, and
`workflow-verify.md` belong to the shared doctrine under `../../shared/`, not to this surface, and
their paths are not this guard's to police.

A cited path may carry a line anchor (`src/data/touch-environment.ts:91-95`) or trailing sentence
punctuation. Both are normalised away before resolution, so prose can cite a line range without
tripping the guard.

Globs, `@`-scoped package specifiers, URLs, and any token containing whitespace or braces are shapes
rather than files, and are skipped.

---

## 3. THE COUNTER-EXAMPLE

A resolver with a broken path join reports zero broken references and looks exactly like success.
The guard therefore also resolves a sentinel that must never exist —
`src/views/this-file-must-never-exist.ts` — and refuses to pass unless that resolution fails.

The output line `counter-example rejected : yes` is what makes `broken : 0` mean something. Without
it, a clean run proves only that the guard matched nothing, which is the same result a completely
broken guard produces.

---

## 4. WHAT IT CAUGHT

The kebab-case rename of the plugin source moved 235 files. Every plugin-side gate stayed green
afterwards — type-check, build, the full test suite, capture freshness, and the lint baseline — and
23 citations in this packet were left pointing at filenames that no longer existed.

Nothing in the plugin repository could have noticed. The dead paths were in another repository, in
prose, in a packet that no test imports. The guard found all 23 in one run, and reported `broken : 0`
only after each was repaired.

That is the failure mode this file exists for: a surface that reads as authoritative while
documenting a tree that has moved on.

---

## 5. RUNNING IT

```bash
# From the plugin repo root
node tools/naming/scan-skill-references.mjs
node tools/naming/scan-skill-references.mjs --json
node tools/naming/scan-skill-references.mjs path/to/SKILL.md
```

Exit is 0 only when `broken` is 0 **and** the counter-example was rejected. Any dead citation, or a
resolver that has stopped working, exits 1.

---

## 6. RELATED REFERENCES

- `folder-docs.md` — the folder-doc threshold, whose scanner also resolves the paths its docs name.
- `verification.md` — the plugin's own gate set, which this guard sits beside rather than inside.
- `screenshot-harness.md` — the capture contract, whose `sources` lists are the other place a rename
  silently invalidates a recorded path.
