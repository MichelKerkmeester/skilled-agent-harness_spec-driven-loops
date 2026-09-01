---
id: OB-006
category: verification
title: 'Verification routing'
description: "This scenario validates VERIFICATION routing for `OB-006`. It focuses on confirming a completion-claim prompt loads the measured gate baseline, the screenshot-freshness harness, the verification checklist, and the shared verify doctrine together."
expected_surface: OBSIDIAN
expected_intent: VERIFICATION
expected_resources:
  - references/verification.md
  - assets/verification-checklist.md
  - references/screenshot-harness.md
  - references/release/release-verification.md
version: 1.0.0.0
---

# OB-006: Verification routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-006`.

---

## 1. OVERVIEW

This scenario validates VERIFICATION routing for `OB-006`. It focuses on confirming that a
completion-claim prompt classifies as `VERIFICATION` and loads the gate command set with its
measured baseline, the screenshot-freshness harness contract, the verification checklist, the
shared verify doctrine, and the release-verification evidence together — so a workflow proves a
change instead of merely running commands and reporting them clean by assumption.

### Why This Matters

The gate is real and partly red: `tsc --noEmit`, `build`, and `vitest run` (386 passing across 49
files) must stay clean, `screenshots:verify` must hold or grow its 180-entry count, and `lint`
carries a known baseline of 115 problems (100 errors, 15 warnings) that must be reported, never
implied clean or claimed reduced without a rerun. Loading `verification.md` with
`verification-checklist.md` is what stops a workflow from treating "the commands exited" as proof
without opening a changed screenshot PNG or reporting the lint delta.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-006` classifies as `VERIFICATION` and resolves the
declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, intent `VERIFICATION`, and every
  path in `expected_resources`.
- Real user request: `Prove this change is safe to merge — run tsc, build, vitest, and screenshots:verify, and report the lint delta against the 115-problem baseline.`
- Prompt: `Prove this change is safe to merge — run tsc, build, vitest, and screenshots:verify, and report the lint delta against the 115-problem baseline.`

**Exact prompt**:
```text
Prove this change is safe to merge — run tsc, build, vitest, and screenshots:verify, and report the lint delta against the 115-problem baseline.
```

- Expected execution process: the hub detects `OBSIDIAN`, the `VERIFICATION` `INTENT_SIGNALS`
  keywords (`verify`, `tsc --noEmit`, `vitest`, `screenshots:verify`, `completion claim`, ...) match
  the prompt, and every path this scenario lists under `expected_resources` resolves under the skill
  root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, and each one
  documents `VERIFICATION` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow runs all five gate commands, reports the
  `vitest`/`screenshots:verify` counts against their measured baselines, states the `lint` problem
  count as a delta or unchanged rather than "passes," and opens any changed screenshot PNG rather
  than trusting its byte count.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OBSIDIAN`/
  `VERIFICATION`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Prove this change is safe to merge — run tsc, build, vitest, and screenshots:verify, and report the lint delta against the 115-problem baseline.`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/intent-detection/verification-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"VERIFICATION":/,/\],/p'`
3. `for p in references/verification.md assets/verification-checklist.md references/screenshot-harness.md references/workflow-verify.md references/release/release-verification.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: VERIFICATION`. Step 2 shows the
`VERIFICATION` `RESOURCE_MAP` entry this scenario's set derives from. Step 3 prints `OK` for all
five paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["VERIFICATION"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `OBSIDIAN`/`VERIFICATION`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `OBSIDIAN`/`VERIFICATION`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["VERIFICATION"]`
   excerpt — the two sets are not required to be identical (`expected_resources` is a curated core
   subset, not an exact mirror), and note that `SKILL.md` §2b's `VERIFICATION` entry does not name
   `references/release/release-verification.md`; that path was added here because it documents the
   same measured baseline from the release-readiness angle.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §3 | The measured gate baseline (`vitest` 386/49, `screenshots:verify` 180, `lint` 115) this scenario's prompt cites |

---

## 5. SOURCE METADATA

- Group: Intent Detection
- Playbook ID: OB-006
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intent-detection/verification-routing.md`
