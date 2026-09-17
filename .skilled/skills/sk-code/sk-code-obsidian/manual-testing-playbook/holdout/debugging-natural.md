---
id: OB-H03
category: holdout
title: 'Holdout -- DEBUGGING via natural phrasing'
description: "Holdout scenario OB-H03: the fitted DEBUGGING answer (OB-005) restated in phrasing a real operator would use, with no literal INTENT_SIGNALS keyword from any group, measuring whether intent detection survives unseen wording."
expected_surface: OBSIDIAN
expected_intent: DEBUGGING
expected_resources:
  - references/mobile-and-touch.md
  - references/view-renderer-architecture.md
version: 1.0.0.0
---

# OB-H03: DEBUGGING held out (decontaminated phrasing)

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-H03`.

---

## 1. OVERVIEW

Generalization probe. The correct answer is the same underlying evidence `OB-005` exercises, but the
request avoids the router's literal keyword vocabulary — no "debug", no "broken", no "regression",
no "wrong render". It measures whether `DEBUGGING` classification survives a symptom described in
plain, non-technical language.

### Why This Matters

`OB-H03` guards the router decision for the Holdout category's `DEBUGGING` case. Real operators often
describe a symptom ("it looks off on my phone") rather than a diagnosis ("regression"), and a
classifier that only recognizes the diagnostic vocabulary misses the more common real-world phrasing.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact decontaminated prompt for `OB-H03` still classifies as `DEBUGGING`.

- Objective: confirm the router selects `DEBUGGING` for a keyword-blind phrasing of the same
  underlying request `OB-005` exercises.
- Real user request: `Something's off with how the calendar shows up on my phone — it's fine on my laptop, but the edges get cut off once I check it on the vault mobile app.`
- Prompt: `Something's off with how the calendar shows up on my phone — it's fine on my laptop, but the edges get cut off once I check it on the vault mobile app.`

**Exact prompt**:
```text
Something's off with how the calendar shows up on my phone — it's fine on my laptop, but the edges get cut off once I check it on the vault mobile app.
```

- Expected execution process: the hub detects `OBSIDIAN`; despite avoiding every literal `DEBUGGING`
  keyword, the request's underlying shape (a symptom description tied to a specific device state)
  still resolves `DEBUGGING`, and every path this scenario lists under `expected_resources` resolves
  under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, matching
  `OB-005`'s underlying evidence despite the decontaminated wording.
- Desired user-visible outcome: the bundled workflow recognizes "phone" plus "edges get cut off" as
  the same `is-phone` mobile-overflow symptom `OB-005` covers and reaches for the mobile/touch
  evidence without needing the literal word "debug" or "wrong render".
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OBSIDIAN`/
  `DEBUGGING`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Something's off with how the calendar shows up on my phone — it's fine on my laptop, but the edges get cut off once I check it on the vault mobile app.`

### Note

This is a prompt-only holdout scenario, scored the same way the other operator scenarios in this
package are — by frontmatter/path agreement, not by a live command transcript.

### Commands

1. `sed -n '1,13p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/debugging-natural.md`
2. `for p in references/mobile-and-touch.md references/view-renderer-architecture.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: DEBUGGING`. Step 2 prints `OK` for
both paths.

### Evidence

Command transcript from steps 1-2; the resolved frontmatter block; the routed intent from a live
dispatch of the exact prompt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists and the frontmatter's `expected_surface`/
  `expected_intent` match `OBSIDIAN`/`DEBUGGING`.
- **Fail**: any listed path is missing, or a live dispatch of the exact prompt resolves an intent
  other than `DEBUGGING`.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a live dispatch resolves the wrong intent, compare this prompt against `OB-005`'s
   literal-keyword form to isolate which phrase difference broke classification.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../intent-detection/debugging-routing.md` | The fitted `OB-005` scenario this holdout decontaminates |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` this holdout deliberately avoids matching literally |

---

## 5. SOURCE METADATA

- Group: Holdout
- Playbook ID: OB-H03
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `holdout/debugging-natural.md`
