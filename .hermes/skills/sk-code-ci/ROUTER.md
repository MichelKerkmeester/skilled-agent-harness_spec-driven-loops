---
title: "CI Surface: GitHub Actions Workflow Evidence Router"
description: "Sibling router for sk-code-ci: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-code-ci router"
  - "sk-code-ci routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# CI Surface: GitHub Actions Workflow Evidence Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-code/sk-code-ci/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this surface when a CI-workflow signal fires: the request names a GitHub Actions workflow, a path filter, a job timeout, a concurrency group, a permissions block or a required status check, the task touches `.github/workflows/`, `.github/actions/` or `.github/scripts/`, or the request asks whether a workflow trigger is intentional or drift, or for the shape of a new workflow or job before it is written. It routes to two resource families: the rule data under `references/`, which starts at `references/ci-workflow-standards.md` and extends to `references/trigger-and-filter-rules.md`, `references/job-shape-rules.md` and `references/protected-set.md`, and the scaffold templates under `assets/`, which hold the whole-workflow template, the single-job template and the CI profile template. The default resource is `references/ci-workflow-standards.md`, the rule index the other three references extend, and no other reference loads before the single intent selects it.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`CI_WORKFLOW`** fires on `github actions workflow`, `ci workflow`, `github actions yaml`, `workflow path filters`, `github workflow timeout`, `github workflow concurrency`, `github workflow permissions`, `required status check workflow`, `ci job`, `action to a sha`, `sha-pinned action` and `.github/workflows/` at weight 4, the only intent in the packet. It loads `references/ci-workflow-standards.md`, `references/trigger-and-filter-rules.md`, `references/job-shape-rules.md` and `references/protected-set.md`, and `references/ci-workflow-standards.md` is also the default resource a run loads before intent scoring.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's deterministic intent-to-reference routing, kept equal to the projection the parent hub union carries.

```python
# sk-code-ci owns its intent -> reference routing. Paths are relative to this
# skill root. The parent sk-code hub RESOURCE_MAP carries the same four paths
# under the same key, re-prefixed with sk-code-ci/. The router-sync guard
# (sk-code-skilled/assets/scripts/verify-router-sync.cjs, leg 2) checks that equality.
# Every keyword is multi-word, so a bare "workflow" never scores this surface.
DEFAULT_RESOURCE = [
    "references/ci-workflow-standards.md",
]

INTENT_SIGNALS = {
    "CI_WORKFLOW": {"weight": 4, "keywords": ["github actions workflow", "ci workflow", "github actions yaml", "workflow path filters", "github workflow timeout", "github workflow concurrency", "github workflow permissions", "required status check workflow", "ci job", "action to a sha", "sha-pinned action", ".github/workflows/"]},
}

RESOURCE_MAP = {
    "CI_WORKFLOW": [
        "references/ci-workflow-standards.md",
        "references/trigger-and-filter-rules.md",
        "references/job-shape-rules.md",
        "references/protected-set.md",
    ],
}
```
