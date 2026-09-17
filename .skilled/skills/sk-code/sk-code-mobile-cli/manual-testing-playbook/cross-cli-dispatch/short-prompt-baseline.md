---
id: PR-013
category: cross_cli_dispatch
title: 'Short-prompt baseline across CLI runtimes'
description: "This scenario validates cross-CLI routing stability for `PR-013`. It focuses on confirming a minimal one-line IMPLEMENTATION prompt resolves the same surface, intent, and resource set on every CLI runtime the framework dispatches through."
expected_surface: PI_REMOTE
expected_intent: IMPLEMENTATION
expected_resources:
  - references/design-system/token-library.md
  - references/conventions/comment-grammar.md
  - references/design-system/component-tokens.md
  - references/design-system/retint-recipes.md
  - references/design-system/theme-remap.md
  - references/design-system/scoped-style-ownership.md
  - assets/token-retint-checklist.md
version: 1.0.0.0
---

# PR-013: Short-prompt baseline across CLI runtimes

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-013`.

---

## 1. OVERVIEW

This scenario validates cross-CLI routing stability for `PR-013`. It focuses on confirming that a minimal,
short `IMPLEMENTATION` prompt resolves the identical `PI_REMOTE` surface, `IMPLEMENTATION` intent, and
`expected_resources` set regardless of which CLI runtime (`cli-claude-code`, `cli-opencode`) hosts the hub
dispatch, since the routing evidence this packet supplies is runtime-agnostic prose and frontmatter, not
CLI-specific formatting.

### Why This Matters

If short-prompt routing drifted between runtimes — one CLI loading the full `IMPLEMENTATION` set, another
loading only a subset — an operator switching CLIs mid-task would see inconsistent evidence for the exact
same request. A short prompt is the cheapest possible baseline for catching that drift before testing it
under the harder conditions `PR-014` (large-prompt stress) and `PR-015` (multi-step dispatch) add.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact short prompt for `PR-013` resolves the identical surface, intent, and resource
set on at least two CLI runtimes.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `IMPLEMENTATION`, and every
  path in `expected_resources`, identically across `cli-claude-code` and `cli-opencode`.
- Real user request: `Retint the slash-panel option accent to a warmer role.`
- Prompt: `Retint the slash-panel option accent to a warmer role.`

**Exact prompt**:
```text
Retint the slash-panel option accent to a warmer role.
```

- Expected execution process: each CLI runtime dispatches the hub identically; `PI_REMOTE` resolves from
  the `app-mobile` context, the `IMPLEMENTATION` `INTENT_SIGNALS` keyword `retint` matches, and every path
  this scenario lists under `expected_resources` resolves under the skill root regardless of runtime.
- Expected signals: the same seven `expected_resources` paths, in the same surface/intent pairing, on
  every CLI runtime tested — no runtime-specific resource gain or loss.
- Desired user-visible outcome: an operator gets the same routing evidence for the same short prompt
  whether the request goes through `cli-claude-code` or `cli-opencode`.
- Pass/fail: PASS if every listed path exists and resolves identically on every CLI runtime tested; FAIL
  if any runtime resolves a different surface, intent, or resource set for the identical prompt.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Retint the slash-panel option accent to a warmer role.`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/cross-cli-dispatch/short-prompt-baseline.md`
2. Dispatch the exact prompt through `cli-claude-code`; capture the resolved surface, intent, and resource
   list.
3. Dispatch the exact prompt through `cli-opencode`; capture the resolved surface, intent, and resource
   list.
4. `for p in references/design-system/token-library.md references/conventions/comment-grammar.md references/design-system/component-tokens.md references/design-system/retint-recipes.md references/design-system/theme-remap.md references/design-system/scoped-style-ownership.md assets/token-retint-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Steps 2 and 3 report the identical surface (`PI_REMOTE`), intent (`IMPLEMENTATION`), and seven-path
resource set. Step 4 prints `OK` for all seven paths.

### Evidence

Command transcript from steps 1-4; the two CLI runtime transcripts side by side; the resolved
frontmatter block.

### Pass / Fail

- **Pass**: both CLI runtime transcripts report the identical surface/intent/resource set, and every
  listed path exists.
- **Fail**: any listed path is missing, or the two CLI runtimes resolve a different surface, intent, or
  resource set for the identical prompt.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. If the two runtime transcripts disagree, diff their raw routing traces to isolate whether the drift is
   in surface detection, intent classification, or resource resolution, then compare against `SKILL.md`
   §2b's declared `RESOURCE_MAP["IMPLEMENTATION"]`.

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

- Group: code-mobile-cli cross-CLI dispatch
- Playbook ID: PR-013
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cross-cli-dispatch/short-prompt-baseline.md`
