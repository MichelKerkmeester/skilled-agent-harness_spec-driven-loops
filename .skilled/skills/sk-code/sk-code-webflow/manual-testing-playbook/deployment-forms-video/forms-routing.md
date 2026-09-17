---
id: WF-011
category: deployment_forms_video
title: 'Forms routing'
description: "This scenario validates FORMS routing for `WF-011`. It confirms that a FilePond/field-validation/focus-trap prompt classifies as `FORMS` and loads the form-upload-workflows trio plus the focus-management pair, matching `SKILL.md` §2b's `RESOURCE_MAP[\"FORMS\"]` entry exactly."
expected_surface: WEBFLOW
expected_intent: FORMS
expected_resources:
  - references/implementation/form-upload-workflows/overview-architecture-and-filepond.md
  - references/implementation/form-upload-workflows/state-machine-worker-and-forms.md
  - references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md
  - references/implementation/focus-management/selector-and-focus-trap.md
  - references/implementation/focus-management/restoration-touch-and-anti-patterns.md
version: 1.0.0.0
---

# WF-011: Forms routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `WF-011`.

---

## 1. OVERVIEW

This scenario validates FORMS routing for `WF-011`. It confirms that a FilePond/field-validation/focus-trap prompt classifies as `FORMS` and loads the form-upload-workflows trio plus the focus-management pair, matching `SKILL.md` §2b's `RESOURCE_MAP["FORMS"]` entry exactly.

### Why This Matters

SKILL.md §3 names focus and forms as accessibility-load-bearing. A focus trap for form errors is not a cosmetic nicety — it is the non-negotiable this scenario's `focus-management/selector-and-focus-trap.md` and `restoration-touch-and-anti-patterns.md` resources enforce alongside the FilePond upload architecture.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `WF-011` classifies as `FORMS` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `WEBFLOW`, intent `FORMS`, and every
  path in `expected_resources`.
- Real user request: `Build a Webflow form upload flow with filepond, field validation, and a focus trap for errors.`
- Prompt: `Build a Webflow form upload flow with filepond, field validation, and a focus trap for errors.`

**Exact prompt**:
```text
Build a Webflow form upload flow with filepond, field validation, and a focus trap for errors.
```

- Expected execution process: the hub detects `WEBFLOW`, the `FORMS` `INTENT_SIGNALS` keywords
  (`form upload`, `filepond`, `field validation`, `focus trap`, ...) match the prompt, and every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-webflow/`, and each one
  documents `FORMS` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow builds the FilePond upload state machine, wires field validation, and implements the error focus trap per `selector-and-focus-trap.md`, treating the trap as accessibility-load-bearing rather than a cosmetic UX detail.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `WEBFLOW`/
  `FORMS`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Build a Webflow form upload flow with filepond, field validation, and a focus trap for errors.`

### Commands

1. `sed -n '1,18p' .opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/deployment-forms-video/forms-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-webflow/SKILL.md | sed -n '/"FORMS": \[/,/\],/p'`
3. `for p in references/implementation/form-upload-workflows/overview-architecture-and-filepond.md references/implementation/form-upload-workflows/state-machine-worker-and-forms.md references/implementation/form-upload-workflows/mime-troubleshooting-and-deployment.md references/implementation/focus-management/selector-and-focus-trap.md references/implementation/focus-management/restoration-touch-and-anti-patterns.md; do test -e ".opencode/skills/sk-code/sk-code-webflow/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: WEBFLOW` and `expected_intent: FORMS`. Step 2 shows the
`FORMS` `RESOURCE_MAP` entry this scenario's set mirrors exactly. Step 3 prints `OK` for every
path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["FORMS"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `WEBFLOW`/`FORMS`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `WEBFLOW`/`FORMS`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["FORMS"]` excerpt —
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
| [SKILL.md](../../SKILL.md) §3 | The "Focus and forms are accessibility-load-bearing" non-negotiable this scenario grounds in |

---

## 5. SOURCE METADATA

- Group: Deployment Forms And Video
- Playbook ID: WF-011
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `deployment-forms-video/forms-routing.md`

