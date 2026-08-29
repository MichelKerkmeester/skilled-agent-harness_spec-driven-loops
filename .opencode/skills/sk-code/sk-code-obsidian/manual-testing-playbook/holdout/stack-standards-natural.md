---
id: OB-H05
category: holdout
title: 'Holdout -- STACK_STANDARDS via natural phrasing'
description: "Holdout scenario OB-H05: the fitted STACK_STANDARDS answer (OB-007) restated in phrasing a real operator would use, with no literal INTENT_SIGNALS keyword from any group, measuring whether intent detection survives unseen wording."
expected_surface: OBSIDIAN
expected_intent: STACK_STANDARDS
expected_resources:
  - references/obsidian-plugin-api.md
  - references/standards/platform-support.md
version: 1.0.0.0
---

# OB-H05: STACK_STANDARDS held out (decontaminated phrasing)

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-H05`.

---

## 1. OVERVIEW

Generalization probe. The correct answer is the same underlying evidence `OB-007` exercises, but the
request avoids the router's literal keyword vocabulary — no "obsidian api", no "fileview", no
"workspaceleaf", no "manifest.json". It measures whether `STACK_STANDARDS` classification survives a
plugin-boundary question phrased without any of the technical class names.

### Why This Matters

`OB-H05` guards the router decision for the Holdout category's `STACK_STANDARDS` case. A question
about whether the plugin works on mobile is a boundary question even when it never names
`isDesktopOnly`, `FileView`, or `WorkspaceLeaf` directly — the classifier needs to recognize the
underlying concept, not just the vocabulary.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact decontaminated prompt for `OB-H05` still classifies as
`STACK_STANDARDS`.

- Objective: confirm the router selects `STACK_STANDARDS` for a keyword-blind phrasing of the same
  underlying request `OB-007` exercises.
- Real user request: `Can someone actually use this on their phone, or does it only work if Obsidian is running on a laptop?`
- Prompt: `Can someone actually use this on their phone, or does it only work if Obsidian is running on a laptop?`

**Exact prompt**:
```text
Can someone actually use this on their phone, or does it only work if Obsidian is running on a laptop?
```

- Expected execution process: the hub detects `OBSIDIAN`; despite avoiding every literal
  `STACK_STANDARDS` keyword, the request's underlying shape (a platform-support question about the
  plugin's manifest contract) still resolves `STACK_STANDARDS`, and every path this scenario lists
  under `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, matching
  `OB-007`'s underlying evidence despite the decontaminated wording.
- Desired user-visible outcome: the bundled workflow answers that `isDesktopOnly: false` means the
  plugin does run on mobile, and nothing in the tree may assume a desktop-only API — citing the API
  boundary and platform-support evidence without needing the literal manifest-field name.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `OBSIDIAN`/
  `STACK_STANDARDS`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Can someone actually use this on their phone, or does it only work if Obsidian is running on a laptop?`

### Note

This is a prompt-only holdout scenario, scored the same way the other operator scenarios in this
package are — by frontmatter/path agreement, not by a live command transcript.

### Commands

1. `sed -n '1,13p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/stack-standards-natural.md`
2. `for p in references/obsidian-plugin-api.md references/standards/platform-support.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: STACK_STANDARDS`. Step 2 prints `OK`
for both paths.

### Evidence

Command transcript from steps 1-2; the resolved frontmatter block; the routed intent from a live
dispatch of the exact prompt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists and the frontmatter's `expected_surface`/
  `expected_intent` match `OBSIDIAN`/`STACK_STANDARDS`.
- **Fail**: any listed path is missing, or a live dispatch of the exact prompt resolves an intent
  other than `STACK_STANDARDS`.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a live dispatch resolves the wrong intent (for example `DEBUGGING`, since "on their phone"
   overlaps with `OB-H03`'s mobile framing), compare this prompt against `OB-007`'s literal-keyword
   form to isolate which phrase difference broke classification.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../intent-detection/stack-standards-routing.md` | The fitted `OB-007` scenario this holdout decontaminates |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` this holdout deliberately avoids matching literally |

---

## 5. SOURCE METADATA

- Group: Holdout
- Playbook ID: OB-H05
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `holdout/stack-standards-natural.md`
