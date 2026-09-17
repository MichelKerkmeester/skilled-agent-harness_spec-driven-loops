---
id: OB-H04
category: holdout
title: 'Holdout -- VERIFICATION via natural phrasing'
description: "Holdout scenario OB-H04: the fitted VERIFICATION answer (OB-006) restated in phrasing a real operator would use, with no literal INTENT_SIGNALS keyword from any group, measuring whether intent detection survives unseen wording."
expected_surface: OBSIDIAN
expected_intent: VERIFICATION
expected_resources:
  - references/verification.md
  - assets/verification-checklist.md
version: 1.0.0.0
---

# OB-H04: VERIFICATION held out (decontaminated phrasing)

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-H04`.

---

## 1. OVERVIEW

Generalization probe. The correct answer is the same underlying evidence `OB-006` exercises, but the
request avoids the router's literal keyword vocabulary — no "verify", no "tsc --noEmit", no
"vitest", no "screenshots:verify", no "completion claim". It measures whether `VERIFICATION`
classification survives an operator asking for merge safety in plain language.

### Why This Matters

`OB-H04` guards the router decision for the Holdout category's `VERIFICATION` case. An operator who
does not know the exact command names still needs the completion-claim discipline this surface
enforces; a classifier tied only to literal command names misses that operator entirely.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact decontaminated prompt for `OB-H04` still classifies as `VERIFICATION`.

- Objective: confirm the router selects `VERIFICATION` for a keyword-blind phrasing of the same
  underlying request `OB-006` exercises.
- Real user request: `I think I'm done with this change — how do I actually know it's safe to hand off, and what should I be checking before I say it's finished?`
- Prompt: `I think I'm done with this change — how do I actually know it's safe to hand off, and what should I be checking before I say it's finished?`

**Exact prompt**:
```text
I think I'm done with this change — how do I actually know it's safe to hand off, and what should I be checking before I say it's finished?
```

- Expected execution process: the hub detects `OBSIDIAN`; despite avoiding every literal
  `VERIFICATION` keyword, the request's underlying shape (a completion-claim question) still
  resolves `VERIFICATION`, and every path this scenario lists under `expected_resources` resolves
  under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, matching
  `OB-006`'s underlying evidence despite the decontaminated wording.
- Desired user-visible outcome: the bundled workflow recognizes "how do I know it's safe to hand off"
  as a completion-claim question and reaches for the gate-baseline and checklist evidence without
  needing the literal command names.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OBSIDIAN`/
  `VERIFICATION`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I think I'm done with this change — how do I actually know it's safe to hand off, and what should I be checking before I say it's finished?`

### Note

This is a prompt-only holdout scenario, scored the same way the other operator scenarios in this
package are — by frontmatter/path agreement, not by a live command transcript.

### Commands

1. `sed -n '1,13p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/verification-natural.md`
2. `for p in references/verification.md assets/verification-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: VERIFICATION`. Step 2 prints `OK`
for both paths.

### Evidence

Command transcript from steps 1-2; the resolved frontmatter block; the routed intent from a live
dispatch of the exact prompt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists and the frontmatter's `expected_surface`/
  `expected_intent` match `OBSIDIAN`/`VERIFICATION`.
- **Fail**: any listed path is missing, or a live dispatch of the exact prompt resolves an intent
  other than `VERIFICATION`.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a live dispatch resolves the wrong intent, compare this prompt against `OB-006`'s
   literal-keyword form to isolate which phrase difference broke classification.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../intent-detection/verification-routing.md` | The fitted `OB-006` scenario this holdout decontaminates |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` this holdout deliberately avoids matching literally |

---

## 5. SOURCE METADATA

- Group: Holdout
- Playbook ID: OB-H04
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `holdout/verification-natural.md`
