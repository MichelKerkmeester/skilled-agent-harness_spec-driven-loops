---
title: "sk-code-skilled"
description: "System code under `.skilled/` meets this repository's standards, because the sk-code hub bundles this read-only surface beside a workflow mode, with language standards and checklists sliced to the files a task touches plus the hook contracts and workflow references."
trigger_phrases:
  - "skilled system code"
  - "skilled surface authoring"
  - "system code standards"
version: 1.0.12.0
---

# sk-code-skilled

> System code under `.skilled/` gets the language standards and authoring checks its task needs, sliced to the files it touches.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What it gives you |
|---|---|
| **Use it for** | System code under `.skilled/`: a skill, agent, command, plugin, MCP server or config file |
| **Invoke with** | No direct call. The hub routes it beside a workflow mode, or alone when no workflow mode scores |
| **Works on** | Six language standard sets, the shared pattern tier, the authoring checklists, the hook contracts and the house style |
| **Produces** | The evidence the acting agent applies, sliced to the languages the task touches |

### What It Does

This surface carries the standards this repository applies to its own code under `.skilled/`. It holds six language standard sets, a shared pattern tier, the authoring checklists, the hook contracts and the workflow references that link to the hub's shared doctrine. The sk-code hub bundles it beside a workflow mode when one scores, or routes it alone for a lookup, implement, debug or verify task. The surface is read-only: its tool list allows `Read`, `Bash`, `Grep` and `Glob` and carries no `Write` or `Edit` tool.

### The Language Slice

The language follows the extensions, Cargo markers and Rust crate words a task names. The shared tier is exempt from the language slice and joins through the intent that maps each doc. A parity task that spans a language pair loads both sets.

| Language | What the surface carries |
|---|---|
| **TypeScript** | `.ts`, `.tsx`, `.mts` and `.d.ts`: two style-guide parts, three quality-standard parts, two quick-reference parts and the TypeScript checklist |
| **Python** | `.py`: a style guide, quality standards, a quick reference and the Python checklist |
| **Shell** | `.sh` and `.bash`: two style-guide parts, two quality-standard parts, two quick-reference parts and the shell checklist |
| **Rust** | `.rs`, plus `Cargo.toml`, `Cargo.lock`, the napi-rs, wasm-bindgen, WASI and cdylib binding words, and the app-crate words `clap cli`, `clap crate`, `clap derive`, `clap::`, ratatui and crossterm: seven style-guide parts, five quality-standard parts, five quick-reference parts and four checklist parts |
| **Config** | `.json`, `.jsonc`, `.yaml` and `.yml` with a `graph-metadata` or `spec-folder` marker: a style guide, quality standards, a quick reference and the config checklist |
| **JavaScript** | `.js`, `.cjs` and `.mjs`: a style guide, two quality-standard parts, a quick reference and the JavaScript checklist |
| **Shared tier** | By intent, never by language: universal patterns and code organization with IMPLEMENTATION, alignment verification with VERIFICATION and hook contracts with HOOKS. The workflow guardrails open first when a reader routes inside this packet |

### The House Style Lives Here

The quality and review modes read a universal floor that holds in any repository. This surface adds this repository's own house rules. A rule applies only to a file that resolves to SKILLED. That covers the `MODULE:` header, the `ceiling:` shortcut marker, the test layout under `tests/`, the line-length limits and the JavaScript and CSS checks under `assets/checklists/js-css-style/`. The documentation row sits at P1 here. The type-safety rule is stricter than the universal floor. The universal checklist carries a `## 7. RULE OVERRIDES` section with one row, which replaces the review mode's TODO rule with the SKILLED owner-first format. The row follows the shared [rule overrides contract](../shared/references/universal/rule-overrides.md).

---

## 2. QUICK START

**Step 1: Let the hub route it.** There is nothing to install and no command that loads the surface. The hub bundles it beside a workflow mode when one scores, or routes it alone for a lookup, implement, debug or verify task.

**Step 2: Read the slice.** The workflow mode loads the standards for each detected language plus the shared tier. The resource map in `ROUTER.md` section 3 lists the files for each intent.

**Step 3: Run the drift guard before any completion claim.**

```bash
bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh
```

A clean run prints a `PASS:` line for each guard and exits 0. A failed guard prints `FAIL:` and the script exits 1. Guards can report non-blocking warnings, and the summary counts them.

---

## 3. HOW IT WORKS

### The Detection Order

Surface detection runs before intent. It tries every declared specific surface first, then the outside skills that declare one, then this fallback, then `UNKNOWN`. This surface leads only when no specific surface matched. When a specific surface also matches, this surface comes along as second evidence, so its standards still load for the `.skilled/` files in the same task.

A specific surface is a hub packet whose `surfaceDetection` block in `../mode-registry.json` states `"role": "specific"`. A skill beside the hub can join by declaring `surface_detection` with that role and `"family": "sk-code"` in its own `graph-metadata.json`. The shared [stack detection reference](../shared/references/stack-detection.md) holds the order and the markers.

Language selection reads the file extensions and local markers in the task. A parity task that holds a Rust module to its TypeScript oracle loads both language sets plus the shared tier, because the module must match its oracle byte for byte. For any other task the slice stays the set of touched languages.

```text
                      ┌───────────────────────────────────────┐
                      │ A task in system code                 │
                      └───────────────────┬───────────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │ Surface detection                     │
                      └───────┬───────────────────┬───────────┘
                              │                   │
                              ▼                   ▼
┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
│ A specific surface leads              │   │ SKILLED leads when none matched       │
└─────────────────────────────┬─────────┘   └─────┬─────────────────────────────────┘
                              │                   │
                              ▼                   ▼
                      ┌───────────────────────────────────────┐
                      │ Language slice, plus the shared tier  │
                      └───────────────────┬───────────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │ Drift guards                          │
                      └───────────────────┬───────────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │ The acting agent applies the evidence │
                      └───────────────────────────────────────┘
```

### The Drift Guards

A completion claim on system code needs a clean drift-gate run. The wrapper runs four guards in order: the alignment verifier, the stack-folder verifier, the router-sync guard and the documentation claim guard. The alignment verifier checks language integrity and dead router routes. The stack-folder verifier checks that every language reference folder resolves. The router-sync guard checks the skill router against the parent hub and the compiled router. It also checks the playbook routes. The documentation claim guard reads the hub prose for paths that fail to resolve, retired packet names, surface counts and load-tier claims.

The alignment verifier scans only the files git tracks, and the router-sync guard drops git-ignored docs. Ignored trees and sibling worktrees therefore stay out of a gate they can never pass. It exits 0 only when every guard passes.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Surface

Use this surface when a task touches `.skilled/` system code: a skill, agent, command, plugin, MCP server, descriptor or config file. Use it when a workflow phase needs a language standard, a language-agnostic organization pattern, a hook contract, an alignment-verification procedure or an authoring checklist. A file that resolves to a specific surface follows that surface first. This surface stays as second evidence for the `.skilled/` files in the task. Spec-folder authoring lives in system-spec-kit, not here.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Parent hub. Bundles this surface beside a workflow mode, or routes it alone |
| `sk-code-frontend` | Specific surface for frontend files. Leads ahead of this surface when a frontend marker matches |
| `sk-code-review` | Takes the formal findings-first review hand-off |
| `sk-code-quality` | Takes the author-side quality gate hand-off |
| `system-spec-kit` | Owns spec-folder authoring |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| The drift guard exits non-zero | A language-integrity finding, a missing or orphan language folder, router drift or a prose claim that no longer matches the files on disk | Read the `FAIL:` line, fix the finding it names, then rerun the wrapper |
| A `[WARN]` line appears and the run still exits 0 | Warnings are non-blocking and the summary counts them | Read the warning and decide whether to fix it |
| The expected language slice is missing | The extension or local marker has no entry in the language table | Check the extension and its markers against the [stack detection reference](../shared/references/stack-detection.md) section 3 |
| The documentation claim guard fails | The hub prose no longer matches the files on disk or the registry | Fix the prose or the registry row, then rerun |

---

## 6. FAQ

### Can I invoke this surface directly?

Not as a command. The hub routes it: beside a workflow mode when one scores, or alone for a lookup, implement, debug or verify task. To read the evidence on your own, open the resource map in `ROUTER.md` or the language folders under `references/`.

### Why does this surface sit apart from the workflow modes?

The workflow modes own the acting side of the work. This surface holds the evidence those modes apply, so every language standard and authoring checklist has one home. A TypeScript task then loads the TypeScript set and the shared tier without pulling the Python or shell guidance.

### What happens when another surface also matches?

The declared specific surface leads. This surface comes along as second evidence, so its standards still apply to the `.skilled/` files the task touches. The order comes from the surface declarations, so no reader keeps a list of its own.

### Why does `SKILL.md` carry a different version from this README?

`SKILL.md` holds the packet release version, which matches the newest entry under `changelog/`. This file and `ROUTER.md` count their own document revisions.

---

## 7. VERIFICATION

Every check below runs from the repository root.

| Check | What a pass looks like |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-skilled/README.md --type readme` reports zero issues |
| Drift guards | `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0 and prints a `PASS:` line for each guard |
| Manual playbook | The scenarios under `manual-testing-playbook/` pass, and each outcome and reason lands in `benchmark/reports/<dated-run-label>/` |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Surface contract and standards |
| [`ROUTER.md`](./ROUTER.md) | Intent map and resource map for each route |
| [`references/`](./references/) | Language standards and the shared pattern tier |
| [`assets/checklists/`](./assets/checklists/) | Authoring checklists and per-language quality gates |
| [`scripts/README.md`](./scripts/README.md) | The drift-guard entry point and its test suites |
| [`references/shared/hooks.md`](./references/shared/hooks.md) | Runtime hook entry points and wiring |
| [`references/shared/alignment-verification-automation.md`](./references/shared/alignment-verification-automation.md) | The alignment-drift verifier and its checks |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Manual scenarios that validate the surface |
| [`changelog/`](./changelog/) | Release history for this surface |

<!-- readme-check
allow-count four guards | the four guards run-all-drift-guards.sh runs, named in the same sentence
-->
