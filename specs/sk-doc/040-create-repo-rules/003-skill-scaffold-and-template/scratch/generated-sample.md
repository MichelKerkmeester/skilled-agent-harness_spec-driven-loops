---
title: "Rule: Dependency intake"
description: "A new dependency is a permanent surface; take one only when what it replaces is named and the cost of removing it later is stated."
trigger_phrases:
  - "add a package"
  - "npm install"
  - "pull in a library"
  - "there is a package for this"
  - "faster than writing it"
  - "everyone uses this one"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Rule: Dependency intake

> Routed from [`REPO RULES.md`](../REPO%20RULES.md). Load before adding anything to a manifest.
> Expands `AGENTS.md`, never overrides it — where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- About to add an entry to a package manifest.
- About to reach for a library because writing the thing yourself feels slow.
- About to upgrade across a major version.

## The rule

**Take a dependency only when you can name what it replaces and say what removing it
later would cost.**

If neither sentence is available, the dependency is a guess about the future.

---

## 1. WHAT A DEPENDENCY COSTS

Supply chain, version drift, and a trust surface that outlives the person who added it.

The failure this prevents: a package added for one function, kept for years, and
discovered at upgrade time to be unmaintained.

---

## 2. SELF-CHECK

- [ ] I named what the dependency replaces.
- [ ] I stated the cost of removing it later.
