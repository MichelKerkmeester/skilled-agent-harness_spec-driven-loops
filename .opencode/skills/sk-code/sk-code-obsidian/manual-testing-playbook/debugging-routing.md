---
id: OB-005
category: debugging
title: 'Debugging routing'
description: "This scenario validates DEBUGGING routing for `OB-005`. It focuses on confirming a renderer-overflow-on-mobile prompt loads the mobile/touch evidence and the shared debug doctrine instead of the plain-implementation evidence."
expected_surface: OBSIDIAN
expected_intent: DEBUGGING
expected_resources:
  - references/mobile-and-touch.md
  - references/view-renderer-architecture.md
  - references/verification.md
  - references/workflow-debug.md
version: 1.0.0.0
---

# OB-005: Debugging routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-005`.

---

## 1. OVERVIEW

This scenario validates DEBUGGING routing for `OB-005`. It focuses on confirming that a
symptom-shaped prompt ("draws outside its frame on mobile") classifies as `DEBUGGING`, not
`IMPLEMENTATION`, and loads the mobile/touch detection evidence, the renderer architecture it
regresses against, the browser-free verification method, and the shared implement→debug→verify
doctrine's debug reference — so a workflow reproduces the symptom under the `is-phone` body class
before touching any renderer code.

### Why This Matters

`manifest.json` declares `isDesktopOnly: false`, and `src/data/touch-environment.ts` is the one
module that decides mobile layout — three signals combined with OR, not just Obsidian's own
platform flag. A renderer that overflows its frame only under `is-phone` is a missing or
misapplied mobile-layout branch, not a general rendering bug; loading `mobile-and-touch.md` gives
the resolver the `is-phone` context a desktop-only repro would miss entirely.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-005` classifies as `DEBUGGING` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, intent `DEBUGGING`, and every
  path in `expected_resources`.
- Real user request: `Debug why the calendar renderer draws outside its frame on mobile — it looks fine on desktop but overflows once the is-phone body class is applied.`
- Prompt: `Debug why the calendar renderer draws outside its frame on mobile — it looks fine on desktop but overflows once the is-phone body class is applied.`

**Exact prompt**:
```text
Debug why the calendar renderer draws outside its frame on mobile — it looks fine on desktop but overflows once the is-phone body class is applied.
```

- Expected execution process: the hub detects `OBSIDIAN`, the `DEBUGGING` `INTENT_SIGNALS` keywords
  (`debug`, `wrong render`, ...) match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, and each one
  documents `DEBUGGING` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow reproduces the overflow specifically with the
  `is-phone` body class applied (not a narrow desktop window alone), traces it to the calendar
  renderer's mobile-layout branch or a missing `.is-phone` selector in `styles.css`, and shows a
  browser-free or screenshot diff as evidence before proposing a fix.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OBSIDIAN`/
  `DEBUGGING`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Debug why the calendar renderer draws outside its frame on mobile — it looks fine on desktop but overflows once the is-phone body class is applied.`

### Commands

1. `sed -n '1,16p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/debugging-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"DEBUGGING":/,/\],/p'`
3. `for p in references/mobile-and-touch.md references/view-renderer-architecture.md references/verification.md references/workflow-debug.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: DEBUGGING`. Step 2 shows the
`DEBUGGING` `RESOURCE_MAP` entry this scenario's set derives from. Step 3 prints `OK` for all four
paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["DEBUGGING"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `OBSIDIAN`/`DEBUGGING`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `OBSIDIAN`/`DEBUGGING`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["DEBUGGING"]` excerpt —
   the two sets are not required to be identical (`expected_resources` is a curated core subset, not
   an exact mirror), and `SKILL.md` §2b's own `DEBUGGING` entry currently names
   `assets/debug-checklist.md`, which does not exist in the shipped tree.

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
| [SKILL.md](../SKILL.md) §1 | The `OBSIDIAN` surface-detection trigger this scenario assumes |

---

## 5. SOURCE METADATA

- Group: code-obsidian routing
- Playbook ID: OB-005
- Canonical root source: [manual-testing-playbook.md](manual-testing-playbook.md)
- Feature file path: `debugging-routing.md`
