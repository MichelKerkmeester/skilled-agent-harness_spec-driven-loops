---
title: opencode
description: System-code work under .opencode/ holds to the right standards: read-only evidence for the sk-code hub, from six language rule sets to shared patterns, hooks and authoring checklists, bundled beside a workflow mode and never routed as a primary.
trigger_phrases:
  - "opencode system code"
  - "opencode authoring"
  - "system code standards"
version: 1.0.0.5
---

# opencode

> System-code work under `.opencode/` lands with the right language standard and authoring checklist already attached, handed to the paired workflow mode without you having to know which reference tree to open.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | System-code work under `.opencode/`: skills, agents, commands, plugins, MCP servers, config and runtime wiring that must hold to the sk-code standards |
| **Invoke with** | No direct invocation. The sk-code hub bundles this surface beside a workflow mode when it detects a system-code surface, then slices evidence by the detected language |
| **Works on** | The read-only evidence tree: six language standard sets, the shared pattern tier, hook contracts, alignment verification and authoring checklists |
| **Produces** | The language-sliced evidence a workflow mode applies, plus drift-guard verification results. The surface itself edits nothing |

---

## 2. OVERVIEW

### Why This Skill Exists

A task that touches `.opencode/` system code, be it a skill, agent, command, plugin, MCP server or descriptor, needs the right language rules and the right authoring checklist, not the whole sk-code reference tree. Without this surface, a workflow mode would either hold every language standard itself or guess which trio applies. A TypeScript edit would end up pulling Python and shell guidance it never needed.

### What It Does

This surface carries the system-code evidence for the sk-code hub: language standards for TypeScript, Python, shell, Rust, config and JavaScript, a language-agnostic shared tier for naming, organization, hooks and alignment verification, plus authoring checklists for skills, agents, commands and MCP servers. The hub detects the `.opencode/` surface first, then slices to the set of languages the task actually touches. Its sibling `code-webflow` carries frontend and browser evidence instead. The hub picks one surface by detection. Only an interop task spanning both languages legitimately loads both. The surface is read-only and advisor-invisible. The paired workflow mode owns all edits, tests and commits.

### The Language Slice

| Language | What the surface can operate |
|---|---|
| **TypeScript** | `.ts`, `.tsx`, `.mts` and `.d.ts` style guides, quality standards, quick references and the TypeScript checklist |
| **Python** | `.py` style guide, quality standards, quick reference and the Python checklist |
| **Shell** | `.sh` and `.bash` style guides, quality standards, quick references and the shell checklist |
| **Rust** | `.rs` style guides, quality standards, quick references and the Rust checklist split across its topic parts |
| **Config** | JSON, JSONC and YAML descriptor style guide, quality standards, quick reference and the config checklist |
| **JavaScript** | CommonJS and ESM plugin style guide, quality standards, quick reference and the JavaScript checklist |
| **Shared tier** | Language-agnostic patterns, code organization, hooks and alignment verification, kept in every slice |

---

## 3. QUICK START

**Step 1: Let the hub bundle it.** There is nothing to install and no command to run. When a task touches `.opencode/` system code, the sk-code hub bundles this surface alongside the active workflow mode and slices the evidence to the languages the task touches.

**Step 2: Read the sliced evidence.** The workflow mode loads the standards for each detected language plus the shared tier. Confirm the slice against the resource map in `SKILL.md` section 2 before relying on it.

**Step 3: Run the drift guard before any completion claim.**

```bash
bash .opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh
```

A clean exit means the alignment verifier, the stack-folder verifier, the router-sync suite and the leaf-manifest bijection all pass. A non-zero exit reports a drift.

---

## 4. HOW IT WORKS

### Detection and Slicing

Detection is two-step. First, work under `.opencode/` selects this surface: skills, agents, commands, plugins, MCP servers, config, changelogs and runtime bridge wiring. Second, file extensions and local markers select the language. `.ts`, `.tsx`, `.mts` and `.d.ts` map to TypeScript. `.py` plus argparse maps to Python. `.sh` and `.bash` map to shell. `.rs` maps to Rust. JSON, JSONC and YAML with graph-metadata or spec-folder markers map to config. `.cjs`, `.mjs` and `.js` map to JavaScript. When no `.rs` file is touched, local `Cargo.toml` or `Cargo.lock` markers select Rust, with napi-rs and wasm-bindgen vocabulary as intent signals. The slice is the set of touched languages, not one per task.

### The Surface Standards

Four non-negotiables hold across the evidence. OpenCode plugins never write to the TUI. Their output goes through system-context injection, tools, append-only log files or a DEBUG-gated stream behind an env flag. Descriptors are load-bearing, since `graph-metadata.json` and `description.json` shape discovery. Alignment drift is a verification gate, so system-code changes re-run the drift guards before any completion claim. Rust preserves the TypeScript contract. The slice stays the touched-language set.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Surface

Use this surface when a task touches `.opencode/` system code, be it a skill, agent, command, plugin, MCP server or descriptor. Use it when a workflow phase needs a language standard, a language-agnostic organization pattern, a hook contract, an alignment-verification procedure or an authoring checklist. The surface is bundled, never invoked directly and never routed as a primary. Spec-folder authoring lives in system-spec-kit, not here.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Parent hub. Bundles this surface beside a workflow mode when the surface is detected |
| `code-webflow` | Sibling surface. Carries frontend and browser evidence. The hub picks one surface by detection |
| `code-review` | Receives the formal findings-first review hand-off |
| `code-quality` | Receives the author-side quality gate hand-off |
| `system-spec-kit` | Owns spec-folder authoring, which this surface does not cover |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| The drift guard exits non-zero | A language reference or router map fell out of sync with the filesystem or the machine router | Re-run `scripts/run-all-drift-guards.sh`, fix the drifted route, then re-run until clean |
| The expected language slice is missing | The touched extension has no entry in the surface reference map | Confirm the extension and its local markers, then check the resource map in `SKILL.md` section 2 |
| Both this surface and `code-webflow` are loaded | The task touches a frontend file under `.opencode/` or spans an interop boundary | Keep the slice to the touched-language set and load both only for a genuine interop task |

---

## 7. FAQ

**Q: Why does this surface exist as a separate skill?**

A: The workflow modes stay lean by owning the edit, debug and verify workflow while this surface holds the evidence they apply. One surface gives every language standard and authoring checklist a single home, sliced on demand, so a TypeScript task never pulls Python and shell guidance it does not need.

**Q: Can I invoke this surface directly?**

A: No. The hub bundles it beside a workflow mode. It never routes as a primary. For the evidence on its own, read the resource map in `SKILL.md` or browse `references/`.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code/sk-code-opencode/README.md --type readme` reports zero issues |
| Drift guard | `bash .opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exits clean, with a non-zero exit reporting the drift |
| Manual playbook | `manual-testing-playbook/manual-testing-playbook.md` runs the surface scenarios behind these checks |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Surface contract, reference map and standards |
| [`references/`](./references/) | Language standard folders and the shared pattern tier |
| [`assets/checklists/`](./assets/checklists/) | Component authoring checklists and per-language quality gates |
| [`scripts/README.md`](./scripts/README.md) | The drift-guard runner entry point |
| [`references/shared/hooks.md`](./references/shared/hooks.md) | Runtime hook entrypoints and wiring |
| [`references/shared/alignment-verification-automation.md`](./references/shared/alignment-verification-automation.md) | The alignment-drift verifier |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Manual scenarios that validate the surface |
| [`changelog/`](./changelog/) | Release history for this surface |
