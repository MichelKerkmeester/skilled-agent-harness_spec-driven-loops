---
title: "M-012 -- SCOPE_ADHERENCE advisory change-set rule"
description: "Verify the opt-in SCOPE_ADHERENCE rule: it no-ops without a change-set, warns only on paths outside a packet's declared Files to Change, and always treats that packet's own docs as in-scope (folder-scoped, not by basename)."
version: 3.9.0.0
id: tooling-and-scripts-scope-adherence-advisory-rule
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# M-012 -- SCOPE_ADHERENCE advisory change-set rule

## 1. OVERVIEW

`SCOPE_ADHERENCE` (`scripts/rules/check-scope-adherence.sh`) is a default-inactive, advisory (warn, never error) validation rule. It activates only when a change-set is supplied via `MK_SCOPE_CHANGED_FILES` (an explicit whitespace/newline-separated list) or `MK_SCOPE_BASE` (a git ref; the change-set is then `git diff --name-only <ref>`). It compares each changed path against the packet's `spec.md` "Files to Change" declared prefixes (matched anchored at the repo root) and warns on any path outside them. A packet's own canonical docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`, …) are always in-scope — but only when they live in that packet's folder; a same-named doc in a different folder is not exempt.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the rule no-ops with no change-set, warns only on genuinely out-of-scope paths, and treats packet docs as in-scope by folder (not basename).
- Real user request: `Check that the scope-adherence rule flags out-of-scope changed files but leaves declared paths and my packet's own docs alone.`
- Prompt: `Exercise SCOPE_ADHERENCE with MK_SCOPE_CHANGED_FILES against a packet's declared Files to Change and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION commands, capture the observed `RULE_STATUS` / violation list, compare against the expected signals, and return a pass/fail verdict.
- Expected signals: no change-set → `RULE_STATUS=pass`, message "not active". A change-set mixing a packet-own doc, a declared path, and an unrelated path → `RULE_STATUS=warn` listing only the unrelated path. A same-named doc in a different folder → warns. The rule never emits `error` and never blocks `--strict`.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the rule is advisory-only, warns on exactly the out-of-scope path(s), and never blocks validation.

---

## 3. TEST EXECUTION

### Prompt

`Exercise SCOPE_ADHERENCE with MK_SCOPE_CHANGED_FILES against a packet's declared Files to Change and report cited pass/fail evidence.`

### Commands

1. Pick a packet whose `spec.md` has a "Files to Change" section (declared prefixes), e.g. `specs/system-speckit/034-spec-template-context-optimizations`.
2. No change-set → inactive no-op:
   ```bash
   MK_SCOPE_CHANGED_FILES="" MK_SCOPE_BASE="" \
     bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict 2>&1 | grep -i SCOPE_ADHERENCE
   # expect: "+ SCOPE_ADHERENCE: ... not active (no change-set provided)"
   ```
3. Mixed change-set → warns on only the out-of-scope path:
   ```bash
   MK_SCOPE_CHANGED_FILES="<spec-folder>/spec.md <a-declared-prefix>/x some/unrelated/file.ts" \
     bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> 2>&1 | grep -i SCOPE_ADHERENCE
   # expect: "! SCOPE_ADHERENCE: ... 1 out-of-scope changed file(s)" naming some/unrelated/file.ts;
   # the packet's own spec.md and the declared prefix are NOT listed.
   ```
4. The automated behavioral gate for this rule is `scripts/tests/check-scope-adherence.vitest.ts` (no-op / warns out-of-scope only / packet docs in-scope by folder / anchored prefix match). Run it for a fast deterministic check:
   ```bash
   ( cd .opencode/skills/system-spec-kit/scripts && npx vitest run tests/check-scope-adherence.vitest.ts )
   # expect: 5 passed
   ```

### Expected Evidence

- `RULE_STATUS` transitions: `pass` (inactive) → `warn` (out-of-scope present) — never `error`.
- The violation list contains exactly the unrelated path(s); declared prefixes and packet-own docs are excluded.
- `validate.sh --strict` exit code is unaffected by the advisory warning.
