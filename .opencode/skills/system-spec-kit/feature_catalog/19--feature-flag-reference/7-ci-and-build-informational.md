---
title: "7. CI and Build (informational)"
description: "This document captures the implemented behavior, source references, and validation scope for 7. CI and Build (informational)."
trigger_phrases:
  - "ci and build informational"
  - "git branch annotation"
  - "ci metadata variables"
  - "checkpoint branch context"
version: 3.6.0.12
---

# 7. CI and Build (informational)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 7. CI and Build (informational).

These are informational CI metadata variables, not feature toggles. They annotate records with branch context for traceability but do not change retrieval, scoring, or storage behavior.

---

## 2. HOW IT WORKS

These variables are read at runtime to annotate checkpoint and evaluation records with source-control context. They are not feature flags and have no effect on search or storage behavior.

| Name | Source | Description |
|---|---|---|
| `BRANCH_NAME` | `lib/storage/checkpoints.ts` | Git branch name as set by some CI environments (e.g. Jenkins). Used as a fallback when `GIT_BRANCH` is absent. |
| `CI_COMMIT_REF_NAME` | `lib/storage/checkpoints.ts` | Git branch or tag name as set by GitLab CI. Third fallback in the branch-detection chain. |
| `GIT_BRANCH` | `lib/storage/checkpoints.ts` | Git branch name. Primary source used to annotate checkpoint records with the active branch at creation time. |
| `VERCEL_GIT_COMMIT_REF` | `lib/storage/checkpoints.ts` | Git branch name as set by Vercel deployments. Last fallback in the branch-detection chain. |

---

## 3. SOURCE FILES

Source file references are included in the flag table above.

---

## 4. SOURCE METADATA
- Group: Feature Flag Reference
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `19--feature-flag-reference/7-ci-and-build-informational.md`
Related references:
- [6-debug-and-telemetry.md](6-debug-and-telemetry.md) — 6. Debug and Telemetry
- [audit-phase-020-mapping-note.md](audit-phase-020-mapping-note.md) — Feature flag reference mapping note
