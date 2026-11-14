---
title: "CI Surface: GitHub Actions Workflow Evidence Router"
description: "Sibling router for sk-code-ci: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-code-ci router"
  - "sk-code-ci routing"
importance_tier: normal
contextType: general
version: 1.0.4.0
router_state: active
skill_pointer: SKILL.md
---

# CI Surface: GitHub Actions Workflow Evidence Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this surface when a CI-workflow signal fires: the request names a workflow concern such as a trigger, a path filter, a job shape, a permission or a protected workflow, or the task touches a workflow, action or CI script path. It routes to two resource families: the rule references under `references/` and the scaffold templates under `assets/`, which hold the workflow, job and profile starting points. §2 INTENT MODEL holds the exact keywords, the four reference paths and the default resource.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource other than `DEFAULT_RESOURCE`
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`CI_WORKFLOW`** is the only intent in the packet, at weight 4.
  - Fires on the keywords of the `CI_WORKFLOW` row in section 3. That row holds the same set as the two CI classes of the hub's `hub-router.json`, and the router-sync guard compares them.
  - Loads `references/ci-workflow-standards.md`, `references/trigger-and-filter-rules.md`, `references/job-shape-rules.md` and `references/protected-set.md`.
  - Default resource: `references/ci-workflow-standards.md`, which a run loads before intent scoring.

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
    "CI_WORKFLOW": {"weight": 4, "keywords": ["github actions workflow", "ci workflow", "github actions yaml", "workflow path filters", "github workflow timeout", "github workflow concurrency", "github workflow permissions", "required status check workflow", "github actions permissions", "ci workflows", "ci switch", "turn off ci", ".github/workflows", "workflow concurrency", "github actions release workflow", "github actions deploy workflow", "release workflow yaml", "deploy workflow yaml", "github actions minutes", "actions minutes", "actions runner minutes", "runner minutes", "ci workflow cost", "ci cost", "reduce ci costs", "lower ci costs", "cut ci costs", "reduce our ci costs", "lower our ci costs", "ci spend", "ci bill", "ci minutes cost", "cut the ci minutes", "cut ci minutes", "reduce ci minutes", "ci pipeline cost", "ci pipeline cheaper", "ci pipelines cheaper", "cheaper ci pipeline", "ci runs cheaper", "failing ci", "failing ci pipeline", "ci failure", "ci failures", "ci is failing", "broken ci", "debug the ci", "debug ci", "cost of our ci", "make ci cheaper", "github actions bill", "github actions cost", "turn off the ci", "turn on the ci", "ci review workflow", "runner-minutes", "timeout-minutes", "paths-ignore", "pull_request_target", "permissions: contents: read", "actions/cache", "setup-bun", "fail-fast: false", "strategy matrix", "ruleset context", "trigger-index rebuild", "workflow_dispatch", "actions concurrency group", "actions cache key", "ci job", "action to a sha", "sha-pinned action"]},
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
