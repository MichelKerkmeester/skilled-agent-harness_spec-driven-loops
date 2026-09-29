---
title: Changelog Version Bump Rules
description: Concrete four-part version-bump examples, real sk-doc release shapes, the first-entry case and the major-versus-large-effort distinction for global changelogs.
trigger_phrases:
  - "version bump decision rules"
  - "changelog version examples"
  - "major minor patch build changelog"
  - "first changelog version"
  - "four part semantic version changelog"
importance_tier: normal
contextType: implementation
version: 1.1.0.4
---

# Changelog Version Bump Rules

Concrete four-part version choices and edge distinctions for global component changelogs.

---

## 1. OVERVIEW

Version bumps apply only to global component changelogs. Packet-local nested changelogs use deterministic filenames and are never versioned this way. This file adds examples to the bump table and auto-detection order in [../SKILL.md](../SKILL.md) section 4, which stay authoritative.

---

## 2. BUMP DECISION TABLE

| Bump | Calculation | Use When | Concrete Example |
|---|---|---|---|
| Major | `{MAJOR+1}.0.0.0` | Breaking change, overhaul, rewrite, migration or platform-level version shift | `v1.8.1.0` to `v2.0.0.0` for a breaking command contract rewrite |
| Minor | `{MAJOR}.{MINOR+1}.0.0` | Significant new feature or subsystem addition | `v1.8.1.0` to `v1.9.0.0` for a new `create-changelog` packet |
| Patch | `{MAJOR}.{MINOR}.{PATCH+1}.0` | Bug fix, refactor, docs update, improvement or cleanup | `v1.8.1.0` to `v1.8.2.0` for fixing packet validation wording |
| Build | `{MAJOR}.{MINOR}.{PATCH}.{BUILD+1}` | Hotfix, typo or same-day correction on a published version | `v1.8.1.0` to `v1.8.1.1` for a release-note typo fix |

---

## 3. MAJOR MEANS BREAKING, NOT LARGE

The most common mistake is choosing major because the work was large. Major means a breaking or architectural change, not high effort. Use minor for new feature work and patch for incremental repair, however many files moved.

---

## 4. REAL RELEASE SHAPES

The sk-doc entries under `.skilled/skills/sk-doc/changelog/` show normal releases. `v1.8.0.0` is a minor release that added the four-part frontmatter version standard. `v1.8.1.0` is a patch that enforces the skill-authoring contract end to end.

---

## 5. FIRST-ENTRY CASE

A global component folder that exists but holds no versions starts at `v1.0.0.0`. The workflow never creates the folder itself. If the calculated file already exists, increment `BUILD` until the filename is unique rather than overwriting.

---

## 6. RELATED

- [README.md](README.md) - reference route-map
- [worked-examples.md](worked-examples.md) - filled-in global and packet-local entries
- [topology-edge-cases.md](topology-edge-cases.md) - placement, back-dating, source conflicts and release edge cases
- [../SKILL.md](../SKILL.md) section 4 - authoritative bump table and auto-detection order
