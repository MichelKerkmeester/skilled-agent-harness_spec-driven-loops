---
id: PR-005
category: verification
title: 'Verification routing'
description: "This scenario validates VERIFICATION routing for `PR-005`. It focuses on confirming a pre-completion-claim prompt loads the browser-free verification method and its checklist instead of the implementation evidence."
expected_surface: PI_REMOTE
expected_intent: VERIFICATION
expected_resources:
  - references/verification.md
  - assets/ds-verification-checklist.md
version: 1.0.0.0
---

# PR-005: Verification routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-005`.

---

## 1. OVERVIEW

This scenario validates VERIFICATION routing for `PR-005`. It focuses on confirming that a
pre-completion-claim prompt loads `verification.md`, the shared verify doctrine, and the design-system
verification checklist, so a workflow proves a retint held every frozen value in both themes before
claiming the change is done — instead of substituting a screenshot the app's CSP would render unstyled
anyway.

### Why This Matters

This surface's completion gate is deliberately browser-free: the app's strict CSP blocks Vite's injected
styles under headless CDP, so pixel diffing proves nothing about color. A `VERIFICATION` prompt that fails
to load `verification.md` and its checklist would let a workflow substitute "looks right" for the
resolver diff and command-gate evidence the checklist requires.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `PR-005` classifies as `VERIFICATION` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `VERIFICATION`, and every path
  in `expected_resources`.
- Real user request: `Verify the token retint preserved every frozen value in both themes before the completion claim.`
- Prompt: `Verify the token retint preserved every frozen value in both themes before the completion claim.`

**Exact prompt**:
```text
Verify the token retint preserved every frozen value in both themes before the completion claim.
```

- Expected execution process: the hub detects `PI_REMOTE`, the `VERIFICATION` `INTENT_SIGNALS` keywords
  (`verify`, `resolver`, `value-preservation`, `completion claim`, ...) match the prompt, and every path
  this scenario lists under `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-mobile-cli/`, and each one
  documents `VERIFICATION` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow states the resolver's `CHANGED`/`VANISHED`/`ADDED`
  counts and the `typecheck`/`build`/`test:web` exit statuses per `assets/ds-verification-checklist.md`
  before making any completion claim.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `PI_REMOTE`/
  `VERIFICATION`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Verify the token retint preserved every frozen value in both themes before the completion claim.`

### Commands

1. `sed -n '1,13p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/verification-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"VERIFICATION":/,/\],/p'`
3. `for p in references/verification.md assets/ds-verification-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: PI_REMOTE` and `expected_intent: VERIFICATION`. Step 2 shows the
`VERIFICATION` `RESOURCE_MAP` entry this scenario's set derives from. Step 3 prints `OK` for all three
paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["VERIFICATION"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `PI_REMOTE`/`VERIFICATION`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `PI_REMOTE`/`VERIFICATION`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["VERIFICATION"]` excerpt to
   see whether the drift is a stale scenario file or a stale `SKILL.md` map — the two sets are not
   required to be identical (`expected_resources` is a curated core subset, not an exact mirror).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../SKILL.md) §1 | The `PI_REMOTE` surface-detection trigger this scenario assumes |

---

## 5. SOURCE METADATA

- Group: code-mobile-cli routing
- Playbook ID: PR-005
- Canonical root source: [manual-testing-playbook.md](manual-testing-playbook.md)
- Feature file path: `verification-routing.md`
