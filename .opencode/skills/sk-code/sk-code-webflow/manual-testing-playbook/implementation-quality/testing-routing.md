---
id: WF-005
category: implementation_quality
title: 'Testing routing'
description: "This scenario validates TESTING routing for `WF-005`. It confirms that a unit-test/integration-test/vitest coverage-plan prompt for a Webflow animation classifies as `TESTING` and loads the single `assets/animation/playbook-entries.md` resource, matching `SKILL.md` §2b's `RESOURCE_MAP[\"TESTING\"]` entry exactly."
expected_surface: WEBFLOW
expected_intent: TESTING
expected_resources:
  - assets/animation/playbook-entries.md
version: 1.0.0.0
---

# WF-005: Testing routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `WF-005`.

---

## 1. OVERVIEW

This scenario validates TESTING routing for `WF-005`. It confirms that a unit-test/integration-test/vitest coverage-plan prompt for a Webflow animation classifies as `TESTING` and loads the single `assets/animation/playbook-entries.md` resource, matching `SKILL.md` §2b's `RESOURCE_MAP["TESTING"]` entry exactly.

### Why This Matters

This surface has no standalone testing doctrine of its own. A vitest-coverage-plan prompt for a Webflow animation routes to `assets/animation/playbook-entries.md`, the manual-scenario catalog, rather than to a generic testing reference this surface does not own. This scenario confirms that thin, one-file routing is a deliberate map entry, not a missing resource the operator should treat as a gap.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `WF-005` classifies as `TESTING` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `WEBFLOW`, intent `TESTING`, and every
  path in `expected_resources`.
- Real user request: `Add an integration test and unit test coverage plan for a Webflow animation, including vitest checks.`
- Prompt: `Add an integration test and unit test coverage plan for a Webflow animation, including vitest checks.`

**Exact prompt**:
```text
Add an integration test and unit test coverage plan for a Webflow animation, including vitest checks.
```

- Expected execution process: the hub detects `WEBFLOW`, the `TESTING` `INTENT_SIGNALS` keywords
  (`unit test`, `integration test`, `coverage`, `vitest`, ...) match the prompt, and every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-webflow/`, and each one
  documents `TESTING` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow builds the vitest coverage plan for the Webflow animation against the `assets/animation/playbook-entries.md` catalog of manual scenarios, since this surface routes animation test coverage there rather than to a standalone testing doctrine.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `WEBFLOW`/
  `TESTING`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add an integration test and unit test coverage plan for a Webflow animation, including vitest checks.`

### Commands

1. `sed -n '1,14p' .opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/implementation-quality/testing-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-webflow/SKILL.md | sed -n '/"TESTING": \[/,/\],/p'`
3. `for p in assets/animation/playbook-entries.md; do test -e ".opencode/skills/sk-code/sk-code-webflow/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: WEBFLOW` and `expected_intent: TESTING`. Step 2 shows the
`TESTING` `RESOURCE_MAP` entry this scenario's set mirrors exactly. Step 3 prints `OK` for every
path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["TESTING"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `WEBFLOW`/`TESTING`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `WEBFLOW`/`TESTING`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["TESTING"]` excerpt —
   the two sets are an exact mirror for this intent, so any difference means either this scenario
   file or `SKILL.md` §2b drifted and needs reconciling, not that a subset omission is by design.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |

---

## 5. SOURCE METADATA

- Group: Implementation And Quality
- Playbook ID: WF-005
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `implementation-quality/testing-routing.md`

