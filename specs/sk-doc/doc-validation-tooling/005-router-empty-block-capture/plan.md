---
title: "Implementation Plan: Stop the router block patterns from capturing past a one-line empty INTENT_SIGNALS or RESOURCE_MAP block"
description: "Replace one lazy block pattern at seven places in five scripts with a pattern that ends a one-line block on its own line, and prove with a capture comparison that only one-line blocks change."
trigger_phrases:
  - "router empty block capture plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Stop the router block patterns from capturing past a one-line empty INTENT_SIGNALS or RESOURCE_MAP block

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS scripts |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview
Change one regular expression in five scripts, at four `INTENT_SIGNALS` sites and three `RESOURCE_MAP` sites. Add one test case to each of three existing test files. Prove it with those tests and with `scratch/compare-captures.cjs`, which compares the old and new captures over every `ROUTER.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `rg -l 'INTENT_SIGNALS\\s\*=' .skilled --glob '*.cjs' --glob '!**/node_modules/**'` lists the four `INTENT_SIGNALS` scripts named in `spec.md`
- [x] `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` exits 0 before any edit
- [x] The first open question in `spec.md` is answered

### Definition of Done
- [x] All acceptance criteria met
- [x] `node specs/sk-doc/doc-validation-tooling/005-router-empty-block-capture/scratch/compare-captures.cjs` prints `identical=56 differ=1` for both block names
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place pattern replacement.

### Key Components
- **The block pattern**: the one expression each script uses to find a router block. No file, option or helper is added, because the fault is in the expression and nowhere else.

The replacement keeps capture group 1, so no caller changes:

```js
/INTENT_SIGNALS\s*=\s*\{([^\n]*(?=\}[ \t]*$)|[\s\S]*?(?=\n\}))/m
```

The first alternative takes a block that closes on its opening line. The second is the current multi-line reading. `RESOURCE_MAP` takes the same expression with its own name. The `m` flag is required, because `$` must match at a line end.

It was run on six inputs. An empty one-line block captured nothing. A one-line block with contents captured only those contents. A multi-line block captured what the old pattern captures. A line with no brace and an unterminated block did not match. `INTENT_SIGNALS = {} # none` still over-captured, which `spec.md` puts out of scope.

### Data Flow
Each script reads a `ROUTER.md`, applies the pattern and pulls quoted strings out of group 1. The generator writes them to `graph-metadata.json` as `intent_signals`. The two checks compare them against what the hub declares. The sk-design registry compiler builds its intent layer from them, and the deep-loop one reads its resource map the same way.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup confirms the seven sites, a passing baseline and the answer to the regeneration question. Implementation replaces the seven patterns and adds the three test cases. Verification runs the tests and the capture comparison.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` exits 0 with the three new cases. `compare-captures.cjs` prints `identical=56 differ=1` for both block names. Each new case is run once against the old pattern first and must fail there, so it is known to detect the fault.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node and its built-in test runner. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a hub's generated `intent_signals` change on a run of `generate-router-intent-signals.cjs --check` after the edit. Revert the one commit that replaces the patterns.
<!-- /ANCHOR:rollback -->

---
