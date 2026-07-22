---
title: "Deep-Alignment Adapters: per-authority DISCOVER and CHECK"
description: "One adapter per registered standard authority, each implementing discover(), standardSource() and check()."
---

# Deep-Alignment Adapters

---

## 1. OVERVIEW

Adapters translate a deep-alignment lane into calls against one named authority (sk-doc, sk-git, sk-design, sk-code). Every adapter implements the same three-method contract, `discover(scope)`, `standardSource(authority)` and `check(artifact, rules, options)`, so the state machine in `../` never branches on which authority a lane names.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `sk-doc.cjs` | Reference adapter. Wraps `validate_document.py` and `extract_structure.py` behind the adapter contract |
| `sk-git.cjs` | Wraps `git log`, `git show`, `git diff-tree`, `git branch`, `git worktree` plus commit-message grammar and branch-naming checks |
| `sk-code.cjs` | Two-layer adapter: deterministic surface detection plus `verify_alignment_drift.py` and a reasoning-agent dispatch packet for pattern-conformance judgment |
| `sk-design.cjs` | Static-only adapter. Reads `DESIGN.md` and `tokens.json`, never renders and never drives Playwright or chrome-devtools |
| `sk-design-live-render.cjs` | Live-render peer of `sk-design.cjs`. Wraps no local renderer, checks caller-supplied render evidence only |
| `sk-doc-command.cjs` | Checks cross-artifact integrity for canonical OpenCode command documents |

## 3. CONSUMERS

- `scoping.cjs` resolves which adapter a lane uses through its `adapter` discriminator, defaulting to the authority's own module
- `../tests/scoping-adapter.test.cjs` and `../tests/sk-doc-command-adapter.test.cjs` cover the discriminator and the command adapter

## 4. RELATED

- [`../README.md`](../README.md)
- [`../../references/adapters/`](../../references/adapters/) for each adapter's full specification and known-deviation suppression list
