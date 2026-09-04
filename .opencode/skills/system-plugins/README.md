---
title: system-plugins
description: Vendored third-party engines the harness depends on but does not author, each a git subtree of its own fork with its own manifest, dependencies and build, so a checkout carries the exact code the harness was verified against.
trigger_phrases:
  - "system plugins"
  - "vendored fork"
  - "zvec-grep subtree"
  - "update the vendored engine"
  - "where is the fork installed"
version: 0.1.0.0
---

# system-plugins

> Third-party engines the harness ships as vendored source, pinned by subtree rather than by a package registry.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Finding, building and updating an engine the harness forked and carries in-tree |
| **Invoke with** | Never directly. Each engine is reached through the skill that wraps it; this folder is where the code lives |
| **Works on** | One directory per engine, each a squashed `git subtree` of a fork branch |
| **Not a skill** | Nothing here is routed by the advisor. There is no `SKILL.md`; the wrapping skill owns the contract |

---

## 2. WHY VENDORED

Every other engine in `.opencode` is a package the harness authors. These are not: they are forks of upstream projects that needed changes upstream had not shipped, and the harness depends on those changes. A registry pin would point at a package nobody publishes, and a clone outside the repository is invisible to a fresh checkout. A subtree gives the harness the exact source it was verified against, keeps upstream history reachable through the fork, and lets a maintainer pull upstream fixes with one command.

---

## 3. ENGINES

| Engine | Upstream | Fork | Wrapped by |
|---|---|---|---|
| [`zvec-grep/`](zvec-grep/) | `zvec-ai/zvec-grep`, Apache-2.0 | `MichelKerkmeester/zvec-grep`, branch `harness` | `system-spec-kit` retrieval lane `scripts/retrieval/zvec-lane.mjs` and the doctor `zvec` route |

The `harness` branch merges three fork branches, each based on upstream main so it can be offered upstream alone: an Ollama embedding backend, an MCP server over stdio that needs no daemon, and a direct-query path that no longer scans the workspace on every call.

---

## 4. BUILD

Built output is not committed. After a fresh checkout, or after pulling the subtree, build the engine in place:

```bash
cd .opencode/skills/system-plugins/zvec-grep
npm ci
npm run build
```

`node_modules/` and `dist/` are ignored by the engine's own `.gitignore`. The retrieval lane resolves `dist/cli/index.js` here ahead of any `zg` on PATH, because the global package is upstream and lacks the fork's behaviour; an unbuilt copy is reported by the doctor route as a missing entry point, never silently replaced by the upstream binary.

Dependencies here are the engine's own, not the harness's. `npm ci` in this directory is a scoped install of roughly 620 MB, of which the vector store binding is 29 MB.

---

## 5. UPDATE

Pull the fork's `harness` branch into the subtree, squashed, and rebuild:

```bash
git subtree pull --prefix=.opencode/skills/system-plugins/zvec-grep <fork-remote> harness --squash
cd .opencode/skills/system-plugins/zvec-grep && npm run build
```

Edit the engine in the fork, not here. A change made in the subtree can be pushed back with `git subtree push`, but the fork is where tests, lint and the upstream relationship live.
