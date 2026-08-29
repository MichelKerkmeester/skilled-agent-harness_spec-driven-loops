---
id: WF-003
category: implementation_quality
title: 'Debugging routing'
description: "This scenario validates DEBUGGING routing for `WF-003`. It confirms that a console-error/stack-trace/regression-after-publish prompt classifies as `DEBUGGING` and loads the full four-phase debugging workflow set plus the `webflow-debugging-checklist.md` asset, matching `SKILL.md` §2b's `RESOURCE_MAP[\"DEBUGGING\"]` entry exactly."
expected_surface: WEBFLOW
expected_intent: DEBUGGING
expected_resources:
  - references/debugging/debugging-workflows/systematic-four-phases.md
  - references/debugging/debugging-workflows/rules-and-root-cause.md
  - references/debugging/debugging-workflows/performance-debugging.md
  - references/debugging/debugging-workflows/quick-reference-and-lenis.md
  - references/debugging/debugging-workflows/sub-agent-verification.md
  - references/debugging/debugging-workflows/scroll-interceptor-and-related.md
  - references/debugging/error-recovery.md
  - assets/webflow-debugging-checklist.md
version: 1.0.0.0
---

# WF-003: Debugging routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `WF-003`.

---

## 1. OVERVIEW

This scenario validates DEBUGGING routing for `WF-003`. It confirms that a console-error/stack-trace/regression-after-publish prompt classifies as `DEBUGGING` and loads the full four-phase debugging workflow set plus the `webflow-debugging-checklist.md` asset, matching `SKILL.md` §2b's `RESOURCE_MAP["DEBUGGING"]` entry exactly.

### Why This Matters

SKILL.md §3's CDN runtime-reality standard means a "regression after publish" is a distinct symptom class from a plain source bug. DEBUGGING's resource set — the four-phase systematic workflow, root-cause rules, the scroll-interceptor note, `error-recovery.md`, and the `webflow-debugging-checklist.md` asset — assumes the operator reproduces the symptom against the published, minified runtime, not just local source.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `WF-003` classifies as `DEBUGGING` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `WEBFLOW`, intent `DEBUGGING`, and every
  path in `expected_resources`.
- Real user request: `Debug a broken Webflow interaction with a console error, stack trace, and regression after publish.`
- Prompt: `Debug a broken Webflow interaction with a console error, stack trace, and regression after publish.`

**Exact prompt**:
```text
Debug a broken Webflow interaction with a console error, stack trace, and regression after publish.
```

- Expected execution process: the hub detects `WEBFLOW`, the `DEBUGGING` `INTENT_SIGNALS` keywords
  (`debug`, `console error`, `stack trace`, `regression`, ...) match the prompt, and every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-webflow/`, and each one
  documents `DEBUGGING` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow reproduces the console error against the published (minified, CDN-served) script per the four-phase systematic debugging doctrine, not just the local source, and works through `error-recovery.md` and the `webflow-debugging-checklist.md` asset before proposing a fix.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `WEBFLOW`/
  `DEBUGGING`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Debug a broken Webflow interaction with a console error, stack trace, and regression after publish.`

### Commands

1. `sed -n '1,21p' .opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/implementation-quality/debugging-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-webflow/SKILL.md | sed -n '/"DEBUGGING": \[/,/\],/p'`
3. `for p in references/debugging/debugging-workflows/systematic-four-phases.md references/debugging/debugging-workflows/rules-and-root-cause.md references/debugging/debugging-workflows/performance-debugging.md references/debugging/debugging-workflows/quick-reference-and-lenis.md references/debugging/debugging-workflows/sub-agent-verification.md references/debugging/debugging-workflows/scroll-interceptor-and-related.md references/debugging/error-recovery.md assets/webflow-debugging-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-webflow/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: WEBFLOW` and `expected_intent: DEBUGGING`. Step 2 shows the
`DEBUGGING` `RESOURCE_MAP` entry this scenario's set mirrors exactly. Step 3 prints `OK` for every
path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["DEBUGGING"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `WEBFLOW`/`DEBUGGING`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `WEBFLOW`/`DEBUGGING`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["DEBUGGING"]` excerpt —
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
| [SKILL.md](../../SKILL.md) §3 | The "CDN runtime reality" non-negotiable this scenario grounds in |

---

## 5. SOURCE METADATA

- Group: Implementation And Quality
- Playbook ID: WF-003
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `implementation-quality/debugging-routing.md`

