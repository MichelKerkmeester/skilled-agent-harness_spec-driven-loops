---
id: PR-014
category: cross_cli_dispatch
title: 'Large-prompt stress across CLI runtimes'
description: "This scenario validates cross-CLI routing stability under prompt-size stress for `PR-014`. It focuses on confirming a long, noisy VERIFICATION prompt still isolates to the correct resource set on every CLI runtime, without the incidental words pulling in unrelated evidence."
expected_surface: PI_REMOTE
expected_intent: VERIFICATION
expected_resources:
  - references/verification.md
  - references/browser-free-verification-recipe.md
  - references/skill-reference-integrity.md
  - assets/ds-verification-checklist.md
version: 1.0.0.0
---

# PR-014: Large-prompt stress across CLI runtimes

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-014`.

---

## 1. OVERVIEW

This scenario validates cross-CLI routing stability under prompt-size stress for `PR-014`. It focuses on
confirming that a long, discursive `VERIFICATION` prompt — one that restates project background, lists
several unrelated concerns, and only lands on the actual verification request near the end — still
isolates to the four-path `VERIFICATION` resource set on every CLI runtime, instead of over-loading
resources triggered by incidental words earlier in the prompt.

### Why This Matters

Real operator prompts are rarely as terse as `PR-013`'s baseline. A verbose prompt that happens to mention
"token" in passing, or references an unrelated accessibility concern before getting to the actual
verification ask, should not pull in `IMPLEMENTATION` or `ACCESSIBILITY` resources alongside the correct
`VERIFICATION` set. Large-prompt stress is also where a CLI's own input handling (chunking, truncation, or
stdin redirection for very long inputs) could silently drop the load-bearing sentence — this scenario
catches that as a routing failure, not just a formatting quirk.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact long prompt for `PR-014` resolves the identical `VERIFICATION` resource set on
at least two CLI runtimes, with no extra resource pulled in by the prompt's incidental language.

- Objective: confirm the exact long prompt routes to surface `PI_REMOTE`, intent `VERIFICATION`, and every
  path in `expected_resources`, identically across `cli-claude-code` and `cli-opencode`, with no
  false-positive resource load from the prompt's surrounding text.
- Real user request: `We've been going back and forth on the model-sheet accent retint for a while now — first it was too cool, then the second pass looked better in light mode but felt off in dark mode, and there was a separate conversation earlier about whether the composer's focus ring needed a contrast bump, which is a different concern entirely and not what this message is about. Setting all of that aside: before we tell anyone this retint is done, verify the token retint preserved every frozen value in both themes and that the completion claim is backed by the resolver diff, not a visual impression.`
- Prompt: `We've been going back and forth on the model-sheet accent retint for a while now — first it was too cool, then the second pass looked better in light mode but felt off in dark mode, and there was a separate conversation earlier about whether the composer's focus ring needed a contrast bump, which is a different concern entirely and not what this message is about. Setting all of that aside: before we tell anyone this retint is done, verify the token retint preserved every frozen value in both themes and that the completion claim is backed by the resolver diff, not a visual impression.`

**Exact prompt**:
```text
We've been going back and forth on the model-sheet accent retint for a while now — first it was too cool, then the second pass looked better in light mode but felt off in dark mode, and there was a separate conversation earlier about whether the composer's focus ring needed a contrast bump, which is a different concern entirely and not what this message is about. Setting all of that aside: before we tell anyone this retint is done, verify the token retint preserved every frozen value in both themes and that the completion claim is backed by the resolver diff, not a visual impression.
```

- Expected execution process: each CLI runtime ingests the full prompt (mitigating stdin/argv limits where
  the runtime requires it); `PI_REMOTE` resolves; the terminal `verify`/`completion claim` sentence
  dominates the classification over the earlier incidental `retint` and `focus ring` mentions; every path
  this scenario lists under `expected_resources` resolves.
- Expected signals: the same four `expected_resources` paths on every CLI runtime tested; no
  `IMPLEMENTATION` resource (`retint-recipes.md`, `token-retint-checklist.md`) or `ACCESSIBILITY` resource
  (`a11y-parity.md`) loads despite those words appearing earlier in the prompt.
- Desired user-visible outcome: the bundled workflow answers the actual verification request — resolver
  diff plus frozen-value preservation in both themes — without getting sidetracked into re-litigating the
  earlier retint history or the unrelated focus-ring aside.
- Pass/fail: PASS if every listed path exists, resolves identically on every CLI runtime tested, and no
  resource outside the four-path `VERIFICATION` set loads; FAIL if any runtime drops the terminal
  verification sentence, resolves a different intent, or pulls in a resource from the prompt's incidental
  language.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: see the fenced `Exact prompt` block above (verbatim, including the earlier retint history and
  the unrelated focus-ring aside).

### Commands

1. `sed -n '1,20p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/cross-cli-dispatch/large-prompt-stress.md`
2. Dispatch the exact prompt through `cli-claude-code`; capture the resolved surface, intent, and resource
   list.
3. Dispatch the exact prompt through `cli-opencode`, applying that runtime's stdin-redirection mitigation
   for long inputs if required; capture the resolved surface, intent, and resource list.
4. `for p in references/verification.md references/browser-free-verification-recipe.md references/skill-reference-integrity.md assets/ds-verification-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Steps 2 and 3 report the identical surface (`PI_REMOTE`), intent (`VERIFICATION`), and four-path resource
set, with no `IMPLEMENTATION` or `ACCESSIBILITY` resource present. Step 4 prints `OK` for all four paths.

### Evidence

Command transcript from steps 1-4; the two CLI runtime transcripts side by side, including input token
counts; the resolved frontmatter block.

### Pass / Fail

- **Pass**: both CLI runtime transcripts report the identical four-path resource set with no false-positive
  load, and every listed path exists.
- **Fail**: any listed path is missing, a runtime truncates or drops the terminal verification sentence, or
  either runtime loads a resource outside the `VERIFICATION` set.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. If a runtime resolved `IMPLEMENTATION` or `ACCESSIBILITY` instead of `VERIFICATION`, check whether that
   runtime truncated the prompt before the terminal sentence — this is a runtime input-handling defect,
   not a routing-map defect, and should be triaged against that CLI's known input-size limits before
   touching `SKILL.md`.

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
- Playbook ID: PR-014
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cross-cli-dispatch/large-prompt-stress.md`
