---
id: PR-011
category: unknown_fallback
title: 'Ambiguous DEBUGGING/VERIFICATION multi-intent prompt'
description: "This scenario validates ambiguous multi-intent resolution for `PR-011`. It focuses on confirming a prompt that hits both DEBUGGING and VERIFICATION keyword sets resolves to DEBUGGING, whose own RESOURCE_MAP already carries verification.md, rather than needing a forced coin-flip between the two."
expected_surface: PI_REMOTE
expected_intent: DEBUGGING
expected_resources:
  - references/verification/verification.md
  - references/design-system/component-tokens.md
  - references/svelte/svelte-runes-effects.md
  - assets/runes-effect-audit-checklist.md
version: 1.0.0.0
---

# PR-011: Ambiguous DEBUGGING/VERIFICATION multi-intent prompt

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-011`.

---

## 1. OVERVIEW

This scenario validates ambiguous multi-intent resolution for `PR-011`. It focuses on confirming that a
prompt combining a `DEBUGGING` keyword (`debug`, `regression`) and a `VERIFICATION` keyword (`verify`,
`completion claim`) in the same sentence resolves to `DEBUGGING` as the dominant intent — because
symptom-tracing precedes the completion-claim gate causally — and that the `DEBUGGING`
`RESOURCE_MAP` entry already includes `verification.md`, so the overlap does not strand the workflow
without the verification evidence the prompt also asked for.

### Why This Matters

`SKILL.md` §2b's `INTENT_SIGNALS` are independent per-intent keyword sets with no explicit tie-breaker
rule documented at this surface. A prompt that legitimately needs to debug a regression and then verify
the fix before a completion claim will match keywords from both `DEBUGGING` and `VERIFICATION`. This
scenario exists so a router facing that overlap has a documented, defensible resolution instead of an
undefined 50/50 pick: resolve to the intent whose action must happen first, and confirm its resource set
does not omit the other intent's core evidence.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `PR-011` matches keywords from both `DEBUGGING` and `VERIFICATION`,
resolves to `DEBUGGING` as the primary intent, and confirm `verification.md` is present in the resolved
set regardless of which intent notionally "won."

- Objective: confirm the exact prompt matches at least one `DEBUGGING` keyword and at least one
  `VERIFICATION` keyword, resolves surface `PI_REMOTE` and intent `DEBUGGING`, and every path in
  `expected_resources` resolves — including `verification.md`, which both intents share.
- Real user request: `Debug the reported contrast regression and verify it before we make the completion claim.`
- Prompt: `Debug the reported contrast regression and verify it before we make the completion claim.`

**Exact prompt**:
```text
Debug the reported contrast regression and verify it before we make the completion claim.
```

- Expected execution process: the hub detects `PI_REMOTE`; the prompt matches `DEBUGGING` keywords
  (`debug`, `regression`) and `VERIFICATION` keywords (`verify`, `completion claim`) at once; the
  workflow resolves `DEBUGGING` as the dominant intent because the symptom must be traced before a
  completion claim is meaningful; every path this scenario lists under `expected_resources` resolves.
- Expected signals: every path in `expected_resources` exists under `sk-code-mobile-cli/`;
  `references/verification/verification.md` is present in the resolved set even though `DEBUGGING` was chosen over
  `VERIFICATION`, because it already sits in `RESOURCE_MAP["DEBUGGING"]`.
- Desired user-visible outcome: the bundled workflow reproduces and traces the contrast regression first,
  using `verification.md`'s resolver method as the evidence for both the trace and the eventual completion
  claim, instead of splitting the request into two uncoordinated passes.
- Pass/fail: PASS if the prompt matches both intents' keywords, the resolved intent is `DEBUGGING`, and
  `verification.md` is present in the resolved set; FAIL if the resolved intent is neither `DEBUGGING` nor
  documented as an accepted alternate, or if `verification.md` is absent from the resolved set.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Debug the reported contrast regression and verify it before we make the completion claim.`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"DEBUGGING":/p;/"VERIFICATION":/p'`
3. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md | sed -n '/"DEBUGGING":/,/\],/p'`
4. `for p in references/verification/verification.md references/design-system/component-tokens.md references/svelte/svelte-runes-effects.md assets/runes-effect-audit-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 2 shows both keyword lists; a manual scan confirms the prompt hits `debug`/`regression` (DEBUGGING)
and `verify`/`completion claim` (VERIFICATION). Step 3 shows `RESOURCE_MAP["DEBUGGING"]` already contains
`references/verification/verification.md`. Step 4 prints `OK` for all four paths.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the dual-keyword-match confirmation;
the `RESOURCE_MAP["DEBUGGING"]` excerpt showing the shared `verification.md` entry.

### Pass / Fail

- **Pass**: the prompt matches both intents' keywords, the resolved intent is `DEBUGGING`, and
  `verification.md` is present.
- **Fail**: the resolved intent is undocumented, ambiguous with no resolution rule applied, or
  `verification.md` is missing from the resolved set.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. If the resolved intent drifted to `VERIFICATION` instead of `DEBUGGING`, confirm whether
   `RESOURCE_MAP["VERIFICATION"]` still lacks the runes-effect and component-token evidence a real
   regression trace needs — if so, the resolution rule in this scenario's Overview still holds and the
   router needs correcting, not this scenario.

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
- Playbook ID: PR-011
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `unknown-fallback/ambiguous-multi-intent.md`
