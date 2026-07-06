---
title: Changelog Version Bump Rules
description: Concrete four-part version-bump examples, real sk-doc release shapes, the first-entry case, and the major-versus-large-effort distinction for global changelogs.
trigger_phrases:
  - "version bump decision rules"
  - "changelog version examples"
  - "major minor patch build changelog"
  - "first changelog version"
  - "four part semantic version changelog"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Changelog Version Bump Rules

Concrete four-part version choices and edge distinctions for global component changelogs.

---

## 1. OVERVIEW

Version bump rules apply only to global component changelogs; packet-local nested changelogs use deterministic filenames and are never versioned this way. This file adds concrete examples and edge distinctions on top of the bump table in [../SKILL.md](../SKILL.md) §3. The auto-detection order — explicit `--bump`, then `spec.md` keywords, then commit prefixes, then default `patch`, then build-increment on collision — is authoritative in that SKILL.md section and is not repeated here.

---

## 2. BUMP DECISION TABLE

Each row pairs the calculation with a concrete before/after example so the choice is unambiguous.

| Bump | Calculation | Use When | Concrete Example |
|---|---|---|---|
| Major | `{MAJOR+1}.0.0.0` | Breaking change, overhaul, rewrite, migration, or platform-level version shift | `v1.8.1.0` to `v2.0.0.0` for a breaking command contract rewrite |
| Minor | `{MAJOR}.{MINOR+1}.0.0` | Significant new feature or subsystem addition | `v1.8.1.0` to `v1.9.0.0` for a new `create-changelog` packet |
| Patch | `{MAJOR}.{MINOR}.{PATCH+1}.0` | Bug fix, refactor, docs update, improvement, cleanup, or incremental change | `v1.8.1.0` to `v1.8.2.0` for fixing packet validation wording |
| Build | `{MAJOR}.{MINOR}.{PATCH}.{BUILD+1}` | Hotfix, typo, or same-day correction on an already-published version | `v1.8.1.0` to `v1.8.1.1` for a release-note typo fix |

---

## 3. MAJOR MEANS BREAKING, NOT LARGE

The most common bump mistake is choosing major because the work was large. Major means a breaking or architectural change, not merely high effort. Use minor for new feature work and patch for incremental repair, regardless of how many files moved.

---

## 4. REAL RELEASE SHAPES

The real sk-doc entries show the shape of normal releases:

- `v1.8.0.0` records a versioning standard, engine, enforcement rollout, and hardening work.
- `v1.8.1.0` records a validator and create-machinery improvement that extended the skill-authoring contract.

---

## 5. FIRST-ENTRY CASE

When a global component folder exists but has no prior versions, use `v1.0.0.0`. Do not create a new component folder from the changelog workflow — the target folder must already exist. If the calculated version file already exists, increment `BUILD` until the filename is unique rather than overwriting.

---

## 6. RELATED

- [README.md](README.md) - reference route-map
- [worked_examples.md](worked_examples.md) - filled-in global and packet-local entries
- [topology_edge_cases.md](topology_edge_cases.md) - placement, back-dating, source conflicts, and release edge cases
- [../SKILL.md](../SKILL.md) §3 - authoritative bump table and auto-detection order
