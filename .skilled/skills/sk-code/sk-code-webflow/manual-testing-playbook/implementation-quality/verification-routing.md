---
id: WF-004
category: implementation_quality
title: 'Verification routing'
description: "This scenario validates VERIFICATION routing for `WF-004`. It confirms that a passing/type-check/alignment-drift/completion-claim prompt classifies as `VERIFICATION` and loads the verification-workflows pair plus the `webflow-verification-checklist.md` asset, matching `SKILL.md` §2b's `RESOURCE_MAP[\"VERIFICATION\"]` entry exactly."
expected_surface: WEBFLOW
expected_intent: VERIFICATION
expected_resources:
  - references/verification/verification-workflows/gate-and-automated-options.md
  - references/verification/verification-workflows/requirements-rules-and-checklist.md
  - assets/webflow-verification-checklist.md
version: 1.0.0.0
---

# WF-004: Verification routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `WF-004`.

---

## 1. OVERVIEW

This scenario validates VERIFICATION routing for `WF-004`. It confirms that a passing/type-check/alignment-drift/completion-claim prompt classifies as `VERIFICATION` and loads the verification-workflows pair plus the `webflow-verification-checklist.md` asset, matching `SKILL.md` §2b's `RESOURCE_MAP["VERIFICATION"]` entry exactly.

### Why This Matters

SKILL.md §3 states the non-negotiable directly: client scripts ship over a CDN with cache lag, so every deploy must be treated as versioned and the minified runtime verified, not just the source. A completion claim that only checks type-check signals against source, without the deployed-runtime verification gate, is exactly the failure mode this scenario's resource set exists to catch.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `WF-004` classifies as `VERIFICATION` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `WEBFLOW`, intent `VERIFICATION`, and every
  path in `expected_resources`.
- Real user request: `Verify the Webflow fix is passing, check type-check signals, and confirm no alignment drift before the completion claim.`
- Prompt: `Verify the Webflow fix is passing, check type-check signals, and confirm no alignment drift before the completion claim.`

**Exact prompt**:
```text
Verify the Webflow fix is passing, check type-check signals, and confirm no alignment drift before the completion claim.
```

- Expected execution process: the hub detects `WEBFLOW`, the `VERIFICATION` `INTENT_SIGNALS` keywords
  (`verify`, `type-check`, `alignment drift`, `completion claim`, ...) match the prompt, and every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-webflow/`, and each one
  documents `VERIFICATION` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow runs the verification gate's automated options, checks type-check signals, and confirms the deployed minified runtime — not just the local source — before the completion claim, per the `webflow-verification-checklist.md` asset.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `WEBFLOW`/
  `VERIFICATION`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Verify the Webflow fix is passing, check type-check signals, and confirm no alignment drift before the completion claim.`

### Commands

1. `sed -n '1,16p' .opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/implementation-quality/verification-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-webflow/SKILL.md | sed -n '/"VERIFICATION": \[/,/\],/p'`
3. `for p in references/verification/verification-workflows/gate-and-automated-options.md references/verification/verification-workflows/requirements-rules-and-checklist.md assets/webflow-verification-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-webflow/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: WEBFLOW` and `expected_intent: VERIFICATION`. Step 2 shows the
`VERIFICATION` `RESOURCE_MAP` entry this scenario's set mirrors exactly. Step 3 prints `OK` for every
path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["VERIFICATION"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `WEBFLOW`/`VERIFICATION`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `WEBFLOW`/`VERIFICATION`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["VERIFICATION"]` excerpt —
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
- Playbook ID: WF-004
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `implementation-quality/verification-routing.md`

