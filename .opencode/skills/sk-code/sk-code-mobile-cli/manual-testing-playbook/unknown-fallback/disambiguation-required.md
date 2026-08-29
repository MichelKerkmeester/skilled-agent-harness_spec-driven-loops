---
id: PR-012
category: unknown_fallback
title: 'CODE_QUALITY / LANGUAGE_STANDARDS folder-docs disambiguation'
description: "This scenario validates a disambiguation-required tie for `PR-012`. It focuses on a folder-docs-threshold prompt that hits the shared `folder docs` keyword in both CODE_QUALITY and LANGUAGE_STANDARDS, and documents why this playbook resolves the tie to CODE_QUALITY."
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

# PR-012: CODE_QUALITY / LANGUAGE_STANDARDS folder-docs disambiguation

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-012`.

---

## 1. OVERVIEW

This scenario validates a genuine disambiguation-required tie for `PR-012`. It focuses on confirming that
a folder-documentation-threshold question hits the `folder docs` keyword, which `SKILL.md` §2b lists in
**both** the `CODE_QUALITY` and `LANGUAGE_STANDARDS` `INTENT_SIGNALS` keyword sets — the only literal
keyword shared between two of this surface's six declared intents — and documenting which intent this
playbook resolves the tie toward and why.

### Why This Matters

Unlike `PR-011`'s cross-intent overlap (no shared keyword, just a co-occurring pair), this is a literal
keyword collision: `"folder docs"` appears verbatim in `RESOURCE_MAP["CODE_QUALITY"]`'s keyword list and
`RESOURCE_MAP["LANGUAGE_STANDARDS"]`'s keyword list, and `references/folder-docs.md` itself is a member of
**both** intents' full resource sets. A prompt hitting only `folder docs` cannot distinguish the two
intents by that keyword alone; the tie needs a second, distinguishing signal from the prompt's other
words. This scenario documents the resolution rule so an operator does not have to re-derive it from
scratch on every occurrence.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `PR-012` hits the shared `folder docs` keyword plus at least one
`CODE_QUALITY`-only keyword (`naming`), resolves to `CODE_QUALITY`, and every path in `expected_resources`
resolves.

- Objective: confirm the exact prompt matches the shared `folder docs` keyword and a second,
  `CODE_QUALITY`-only keyword, resolves surface `PI_REMOTE` and intent `CODE_QUALITY`, and every path in
  `expected_resources` resolves.
- Real user request: `Explain when a source folder needs a paired CODE.md under the folder-docs threshold, and confirm the file naming grammar for its contents.`
- Prompt: `Explain when a source folder needs a paired CODE.md under the folder-docs threshold, and confirm the file naming grammar for its contents.`

**Exact prompt**:
```text
Explain when a source folder needs a paired CODE.md under the folder-docs threshold, and confirm the file naming grammar for its contents.
```

- Expected execution process: the hub detects `PI_REMOTE`; the prompt matches the shared `folder docs`
  keyword and the `CODE_QUALITY`-only `naming` keyword; because the second word breaks the tie toward
  `CODE_QUALITY`, and because `references/folder-docs.md` is present in both intents' resource sets
  regardless of which one wins, the workflow resolves `CODE_QUALITY` and loads its full `RESOURCE_MAP`
  entry.
- Expected signals: every path in `expected_resources` exists under `sk-code-mobile-cli/`;
  `references/folder-docs.md` is present in the resolved set either way, since it belongs to both
  intents' maps.
- Desired user-visible outcome: the answer states the folder-docs pairing threshold (3+ direct source
  files or child source folders), cites the kebab-case naming grammar, and — because `CODE_QUALITY` won —
  frames the answer as an auditable convention check rather than a pure language reference.
- Pass/fail: PASS if every listed path exists, the resolved intent is `CODE_QUALITY`, and
  `references/folder-docs.md` is present regardless of resolution; FAIL if any listed path is missing or
  the resolved intent has no documented tie-break rationale.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Explain when a source folder needs a paired CODE.md under the folder-docs threshold, and confirm the file naming grammar for its contents.`

### Commands

1. `sed -n '1,19p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/unknown-fallback/disambiguation-required.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"CODE_QUALITY":/p;/"LANGUAGE_STANDARDS":/p'`
3. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"CODE_QUALITY":/,/\],/p'`
4. `for p in references/editability-guardrails.md references/css-class-naming-bem.md references/comment-grammar.md references/folder-docs.md references/component-story-upkeep.md assets/guardrail-audit-checklist.md assets/bem-rename-checklist.md assets/story-coverage-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 2 shows `"folder docs"` present verbatim in both the `CODE_QUALITY` and `LANGUAGE_STANDARDS` keyword
lists. Step 3 shows `RESOURCE_MAP["CODE_QUALITY"]`, confirming `references/folder-docs.md` is a member.
Step 4 prints `OK` for all eight paths.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the dual-list keyword-collision
confirmation; the `RESOURCE_MAP["CODE_QUALITY"]` excerpt.

### Pass / Fail

- **Pass**: the shared-keyword collision is confirmed in step 2, the resolved intent is `CODE_QUALITY`,
  and every listed path exists.
- **Fail**: any listed path is missing, or the resolved intent lacks a documented rationale for the tie.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. If the resolved intent drifted to `LANGUAGE_STANDARDS`, confirm the prompt still carries a
   `CODE_QUALITY`-only keyword (`naming`, `guardrail`, `lint`, `quality gate`, `frozen value`, `code
   smell`, `do-not-edit`) — if it does not, the prompt itself needs the disambiguating word restored, not
   the router.

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

- Group: code-mobile-cli unknown fallback
- Playbook ID: PR-012
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `unknown-fallback/disambiguation-required.md`
