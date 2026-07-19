---
title: "LC-003 Archive and Future Skills Indexed But Not Routed"
description: "Manual validation that skills under z_archive/ and z-future/ are indexed for visibility but are not surfaced as active routing candidates."
trigger_phrases:
  - "lc-003"
  - "z_archive skills"
  - "z_future skills"
  - "indexed not routed"
version: 0.8.0.14
id: LC-003
category: lifecycle_routing
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# LC-003 Archive and Future Skills Indexed But Not Routed

Prompt: Manual validation that skills under z_archive/ and z-future/ are indexed for visibility but are not surfaced as active routing candidates.


<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/lifecycle/archive-handling.ts` keeps `z_archive/` and `z-future/` skills visible to inspection queries but excludes them from live routing recommendations.

---

## 2. SCENARIO CONTRACT

- Workspace containing at least one skill under `z_archive/` and one under `z-future/`.
- MCP server built. Daemon reachable.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred-decisions.md` §F34 for rationale.

1. Call `advisor_status` and capture `skillCount`:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

2. Manually enumerate skills under `.opencode/skills/` plus any nested `z_archive/` and `z-future/` locations.
3. Call `advisor_recommend` with a prompt that historically mapped to the archived skill and capture the top-k recommendations.
4. Inspect whether any archived or future slug appears in `recommendations[]`.

### Expected Signals

- `advisor_status.skillCount` includes archived and future skills for visibility purposes or is documented to exclude them if `skillCount` is defined as active-only.
- Archived and future skill slugs do not appear in `recommendations[]` under `advisor_recommend`.
- IDF computed by `lib/corpus/df-idf.ts` uses the active corpus only (see AI-004).
- Lifecycle metadata on archived entries is available via inspection tools.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Archived skill routed | Slug appears in recommendations | Block release. Audit `archive-handling.ts` filter. |
| Archived skill not indexed | Inspection tool cannot find slug | Verify indexing policy allows archive discovery without routing. |
| Future skill routed prematurely | `z-future/` slug appears as top-1 | Block release. Future gating must hold until activation. |

---

## 4. SOURCE FILES

- Scenario [AI-004](../../manual-testing-playbook/auto-indexing/corpus-df-idf.md), active-only corpus.
- Scenario [LC-002](./supersession.md), supersession routing.
- Feature [`lifecycle-routing/archive-handling.md`](../../feature-catalog/lifecycle-routing/archive-handling.md).
- Source: `.opencode/skills/system-skill-advisor/mcp-server/lib/lifecycle/archive-handling.ts`.

---

## 5. SOURCE METADATA

- Group: Lifecycle Routing
- Playbook ID: LC-003
- Canonical root source: manual-testing-playbook.md
- Feature file path: lifecycle-routing/archive-handling.md
