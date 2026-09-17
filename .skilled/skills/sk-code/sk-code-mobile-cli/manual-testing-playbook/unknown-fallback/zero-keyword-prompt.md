---
id: PR-010
category: unknown_fallback
title: 'Zero-keyword prompt falls back to DEFAULT_RESOURCE'
description: "This scenario validates the DEFAULT_RESOURCE fallback for `PR-010`. It focuses on confirming a PI_REMOTE-scoped prompt that hits none of the six declared INTENT_SIGNALS keyword sets still loads the two-path default instead of loading nothing or every resource."
expected_surface: PI_REMOTE
expected_intent: DEFAULT_RESOURCE
expected_resources:
  - references/design-system/token-library.md
  - references/conventions/comment-grammar.md
version: 1.0.0.0
---

# PR-010: Zero-keyword prompt falls back to DEFAULT_RESOURCE

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-010`.

---

## 1. OVERVIEW

This scenario validates the `DEFAULT_RESOURCE` fallback for `PR-010`. It focuses on confirming that once
the hub resolves `PI_REMOTE` from the task's `app-mobile`/`app-relay`/`packages/pi-rpc-protocol` context,
a prompt that matches none of the six declared `INTENT_SIGNALS` keyword sets (`IMPLEMENTATION`,
`CODE_QUALITY`, `DEBUGGING`, `VERIFICATION`, `LANGUAGE_STANDARDS`, `ACCESSIBILITY`) still loads
`SKILL.md` §2b's `DEFAULT_RESOURCE` pair — `token-library.md` and `comment-grammar.md` — rather than
loading nothing at all or the full union of every intent's resources.

### Why This Matters

`DEFAULT_RESOURCE` exists so a workflow bundling this surface never starts from zero evidence when a
prompt is generic ("look at the composer" carries no `retint`, `debug`, `verify`, or `kebab-case`
keyword). Silently loading nothing would leave the workflow guessing at the token model and comment
grammar from scratch; silently loading everything would defeat the purpose of intent-scoped resource
loading and inflate the token cost of every ambiguous prompt.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `PR-010` matches zero `INTENT_SIGNALS` keywords across all six
declared intents and resolves exactly the two `DEFAULT_RESOURCE` paths.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, matches no `INTENT_SIGNALS` keyword
  in any of the six declared intents, and resolves exactly the `DEFAULT_RESOURCE` pair.
- Real user request: `Take a look at the composer in app-mobile and tell me what you notice about it.`
- Prompt: `Take a look at the composer in app-mobile and tell me what you notice about it.`

**Exact prompt**:
```text
Take a look at the composer in app-mobile and tell me what you notice about it.
```

- Expected execution process: the hub detects `PI_REMOTE` from the `app-mobile` reference, no keyword from
  any of the six `INTENT_SIGNALS` entries matches the prompt, and the packet falls back to
  `DEFAULT_RESOURCE`.
- Expected signals: the loaded set is exactly `references/design-system/token-library.md` and
  `references/conventions/comment-grammar.md` — no other reference, and no `assets/` path.
- Desired user-visible outcome: the bundled workflow orients on the token model and the natural comment
  grammar before asking a clarifying question about which specific change the operator wants, rather than
  guessing an intent from a prompt that does not support one.
- Pass/fail: PASS if both `DEFAULT_RESOURCE` paths exist and no other packet resource is loaded; FAIL if
  either path is missing or a resource outside `DEFAULT_RESOURCE` loads for this zero-keyword prompt.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Take a look at the composer in app-mobile and tell me what you notice about it.`

### Commands

1. `sed -n '1,15p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/unknown-fallback/zero-keyword-prompt.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^INTENT_SIGNALS = {/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | grep 'DEFAULT_RESOURCE'`
3. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md`
4. `for p in references/design-system/token-library.md references/conventions/comment-grammar.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 2 shows the `DEFAULT_RESOURCE` list. Step 3 shows the full `INTENT_SIGNALS` block; a manual scan
confirms none of its keyword lists appear in the exact prompt from step 1. Step 4 prints `OK` for both
paths.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the `DEFAULT_RESOURCE` excerpt; the
keyword-scan confirmation that no `INTENT_SIGNALS` entry matched.

### Pass / Fail

- **Pass**: both `DEFAULT_RESOURCE` paths exist, the prompt matches zero `INTENT_SIGNALS` keywords, and no
  resource outside the two-path default loads.
- **Fail**: either path is missing, the prompt unexpectedly matches a declared intent's keyword, or a
  resource outside `DEFAULT_RESOURCE` loads.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/`.
2. If the prompt turns out to match a keyword after all, revise the prompt to remove the accidental match
   and confirm the six `INTENT_SIGNALS` keyword lists in step 3 have not gained a new broad term that now
   catches generic language.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `DEFAULT_RESOURCE` and `INTENT_SIGNALS` this scenario exercises |
| [SKILL.md](../../SKILL.md) §1 | The `PI_REMOTE` surface-detection trigger this scenario assumes |

---

## 5. SOURCE METADATA

- Group: code-mobile-cli unknown fallback
- Playbook ID: PR-010
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `unknown-fallback/zero-keyword-prompt.md`
