---
id: PR-H05
category: holdout
title: 'Independent holdout — VERIFICATION (keyword-blind)'
description: "This scenario validates an independent, keyword-blind VERIFICATION probe for `PR-H05`. Authored without consulting the VERIFICATION INTENT_SIGNALS keyword list, it confirms the classifier still resolves the full verification resource set from a proof-before-done request phrased in plain language."
expected_surface: PI_REMOTE
expected_intent: VERIFICATION
expected_resources:
  - references/verification/verification.md
  - references/verification/verification.md
  - references/verification/skill-reference-integrity.md
  - assets/ds-verification-checklist.md
version: 1.0.0.0
---

# PR-H05: Independent holdout — VERIFICATION (keyword-blind)

This document captures the routing-recall contract, execution process, source anchors, and metadata for `PR-H05`.

---

## 1. OVERVIEW

Authored blind to the `VERIFICATION` `INTENT_SIGNALS` keyword list in `SKILL.md` §2b. This is an
independent probe for `PR-H05`, composed from the plain concern an operator would raise before trusting a
"done" claim — prove the colors actually resolved correctly, don't just eyeball it — without first reading
which literal words the router matches on.

### Why This Matters

Trust in a completion claim is the whole point of this surface's browser-free verification gate. If the
request to prove that trust has to be phrased in spec vocabulary ("verify," "completion claim") to route
correctly, then the surface fails the exact users it exists to protect: the ones who do not yet know the
gate's name and just want proof before they believe the work is done.

---

## 2. SCENARIO CONTRACT

Operators confirm the independently authored prompt for `PR-H05` classifies as `VERIFICATION` and resolves
the full four-path `RESOURCE_MAP["VERIFICATION"]` set.

- Objective: confirm the exact prompt routes to surface `PI_REMOTE`, intent `VERIFICATION`, and every path
  in `expected_resources` resolves.
- Real user request: `Before you tell me this is done, prove the colors actually resolved the way we expect in both themes — don't just eyeball it.`
- Prompt: `Before you tell me this is done, prove the colors actually resolved the way we expect in both themes — don't just eyeball it.`

**Exact prompt**:
```text
Before you tell me this is done, prove the colors actually resolved the way we expect in both themes — don't just eyeball it.
```

- Expected execution process: the hub detects `PI_REMOTE`; the request's shape (a proof-before-done
  demand covering both themes, explicitly rejecting a visual-only check) resolves to `VERIFICATION`; every
  path this scenario lists under `expected_resources` resolves.
- Expected signals: the resolved intent and resource set match the full `RESOURCE_MAP["VERIFICATION"]`
  entry, despite the prompt never using the words "verify," "resolver," or "completion claim."
- Desired user-visible outcome: the bundled workflow states the resolver's `CHANGED`/`VANISHED`/`ADDED`
  counts per theme instead of describing what the change looks like, exactly as `PR-005`/`PR-017`
  describe.
- Pass/fail: PASS if every listed path exists and the resolved intent matches `VERIFICATION`; FAIL if the
  resolved intent diverges or a listed path is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Before you tell me this is done, prove the colors actually resolved the way we expect in both themes — don't just eyeball it.`

### Commands

1. `sed -n '1,17p' .opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/holdout/ind-verification.md`
2. `for p in references/verification/verification.md references/verification/verification.md references/verification/skill-reference-integrity.md assets/ds-verification-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-mobile-cli/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 2 prints `OK` for all four paths.

### Evidence

Command transcript from steps 1-2; the resolved frontmatter block; the dispatch transcript's resolved
intent.

### Pass / Fail

- **Pass**: the resolved intent is `VERIFICATION` and every listed path exists.
- **Fail**: the resolved intent diverges from `VERIFICATION`, or a listed path is missing.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed under
   `references/` or `assets/`.
2. If the resolved intent drifted elsewhere, compare this prompt's actual language against every declared
   intent's keyword list in `SKILL.md` §2b to see whether it accidentally matched a different intent's
   keyword by coincidence, since this prompt was composed independently of that list.

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

- Group: code-mobile-cli holdout
- Playbook ID: PR-H05
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `holdout/ind-verification.md`
