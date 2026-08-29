---
id: PR-009
category: resource_loading
title: 'Mixed reference-plus-asset resource load'
description: "This scenario validates mixed resource loading for `PR-009`. It focuses on confirming a CODE_QUALITY folder-docs-and-naming audit prompt loads the full paired set of references and asset checklists together, since a quality gate is an executable action, not a pure explanation."
expected_surface: PI_REMOTE
expected_intent: CODE_QUALITY
expected_resources:
  - references/editability-guardrails.md
  - references/css-class-naming-bem.md
  - references/comment-grammar.md
  - references/folder-docs.md
  - references/component-story-upkeep.md
  - assets/guardrail-audit-checklist.md
  - assets/bem-rename-checklist.md
  - assets/story-coverage-checklist.md
version: 1.0.0.0
---

# PR-009: Mixed reference-plus-asset resource load

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-009`.

---

## 1. OVERVIEW

This scenario validates resource-loading isolation for `PR-009`. It focuses on confirming that a
`CODE_QUALITY` prompt combining a folder-docs audit, a naming check, and a comment-grammar review loads
the full `RESOURCE_MAP["CODE_QUALITY"]` set — five references and all three of its asset checklists
together — because an audit is an action with a pass/fail outcome, not a convention explanation.

### Why This Matters

`PR-008` proves the references-only isolation case; this scenario proves the opposite edge of the same
routing behavior — that an executable quality-gate prompt pulls every checklist its action needs, not a
narrower subset. A router that drops the `bem-rename-checklist.md` or `story-coverage-checklist.md` from a
prompt that touches naming and folder pairing would leave a workflow auditing partial evidence and calling
it complete.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `PR-009` classifies as `CODE_QUALITY` and resolves every path in
the full `RESOURCE_MAP["CODE_QUALITY"]` set, references and assets together.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `CODE_QUALITY`, and every path
  in `expected_resources` — five references and three assets — resolves.
- Real user request: `Audit this folder's naming, comment grammar, and folder-docs pairing after a rename, and confirm every guardrail fence is still intact.`
- Prompt: `Audit this folder's naming, comment grammar, and folder-docs pairing after a rename, and confirm every guardrail fence is still intact.`

**Exact prompt**:
```text
Audit this folder's naming, comment grammar, and folder-docs pairing after a rename, and confirm every guardrail fence is still intact.
```

- Expected execution process: the hub detects `PI_REMOTE`, the `CODE_QUALITY` `INTENT_SIGNALS` keywords
  (`naming`, `comment grammar`, `folder docs`, `guardrail`, ...) match the prompt, and every path this
  scenario lists under `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-mobile-cli/`; the loaded set
  spans both `references/` and `assets/`, matching the full `RESOURCE_MAP["CODE_QUALITY"]` entry.
- Desired user-visible outcome: the bundled workflow reports a fence recount from
  `guardrail-audit-checklist.md`, a class-rename check from `bem-rename-checklist.md`, and a story-coverage
  status from `story-coverage-checklist.md`, alongside the folder-docs pairing verdict — not a subset of
  these three.
- Pass/fail: PASS if every listed path exists, the loaded set spans both `references/` and `assets/`, and
  the frontmatter surface/intent are `PI_REMOTE`/`CODE_QUALITY`; FAIL if any listed path is missing or an
  asset from the full `CODE_QUALITY` set is absent.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Audit this folder's naming, comment grammar, and folder-docs pairing after a rename, and confirm every guardrail fence is still intact.`

### Commands

1. `sed -n '1,18p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/resource-loading/mixed-load.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"CODE_QUALITY":/,/\],/p'`
3. `for p in references/editability-guardrails.md references/css-class-naming-bem.md references/comment-grammar.md references/folder-docs.md references/component-story-upkeep.md assets/guardrail-audit-checklist.md assets/bem-rename-checklist.md assets/story-coverage-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: PI_REMOTE` and `expected_intent: CODE_QUALITY`. Step 2 shows the
`CODE_QUALITY` `RESOURCE_MAP` entry this scenario's set mirrors in full. Step 3 prints `OK` for all eight
paths, three of them under `assets/`.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["CODE_QUALITY"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the set spans both `references/` and `assets/`, and
  the frontmatter's `expected_surface`/`expected_intent` match `PI_REMOTE`/`CODE_QUALITY`.
- **Fail**: any listed path is missing, the loaded set drops an asset from the full `CODE_QUALITY` map, or
  the frontmatter surface/intent disagree with `PI_REMOTE`/`CODE_QUALITY`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["CODE_QUALITY"]` excerpt to
   see whether the drift is a stale scenario file or a stale `SKILL.md` map.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §1 | The `PI_REMOTE` surface-detection trigger this scenario assumes |

---

## 5. SOURCE METADATA

- Group: code-mobile-cli resource loading
- Playbook ID: PR-009
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `resource-loading/mixed-load.md`
