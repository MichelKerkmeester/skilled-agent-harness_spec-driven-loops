---
id: OB-009
category: resource_loading
title: 'Assets-only isolation'
description: "This scenario validates VERIFICATION resource-loading isolation for `OB-009`. It focuses on confirming a checklist-only follow-up loads only assets/verification-checklist.md and pulls in zero references/ files, since the operator has already stated they know the gate commands."
expected_surface: OBSIDIAN
expected_intent: VERIFICATION
expected_resources:
  - assets/verification-checklist.md
version: 1.0.0.0
---

# OB-009: Assets-only isolation

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-009`.

---

## 1. OVERVIEW

This scenario validates VERIFICATION resource-loading isolation for `OB-009`. It focuses on
confirming that a narrow, already-informed checklist request loads only
`assets/verification-checklist.md` and pulls in zero `references/` files — the mirror case of
`OB-008`. This scenario's objective differs from `OB-006` (intent-detection/verification-routing.md):
`OB-006` proves a full completion-claim prompt loads the whole gate-baseline evidence set; `OB-009`
proves a narrower, already-informed follow-up loads only the checklist itself.

### Why This Matters

Not every `VERIFICATION`-shaped prompt needs the full gate-baseline reference — an operator who
already knows the commands and only wants the pre-merge checklist should not have
`verification.md`'s full measured-baseline prose re-loaded on every follow-up. Proving the isolated,
single-asset case exists is what stops a workflow from either over-loading (wasting context) or
under-loading (missing the one file the prompt actually needs) at this narrower end of the same
intent.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-009` classifies as `VERIFICATION` and resolves only the
one `assets/` path in `expected_resources`, with zero `references/` paths.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, intent `VERIFICATION`, and the
  sole path in `expected_resources` is an `assets/` path with no `references/` path present.
- Real user request: `I already know tsc, build, vitest, and screenshots:verify — just give me the pre-merge checklist itself, not the explainer for each command.`
- Prompt: `I already know tsc, build, vitest, and screenshots:verify — just give me the pre-merge checklist itself, not the explainer for each command.`

**Exact prompt**:
```text
I already know tsc, build, vitest, and screenshots:verify — just give me the pre-merge checklist itself, not the explainer for each command.
```

- Expected execution process: the hub detects `OBSIDIAN`, the `VERIFICATION` `INTENT_SIGNALS`
  keywords (`verify`, `tsc --noEmit`, `vitest`, `screenshots:verify`, ...) match the prompt, and the
  operator's explicit "just the checklist" framing resolves to `assets/verification-checklist.md`
  alone.
- Expected signals: `expected_resources` contains exactly one path, it exists under
  `sk-code-obsidian/`, and it starts with `assets/`; no `references/` path is present in the set.
- Desired user-visible outcome: the bundled workflow returns the checklist items directly, without
  re-explaining the gate commands or the measured baseline the operator already stated they know.
- Pass/fail: PASS if `assets/verification-checklist.md` exists, no `references/` path is present in
  the set, and the frontmatter surface/intent are `OBSIDIAN`/`VERIFICATION`; FAIL if the path is
  missing, a `references/` path appears in the set, or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I already know tsc, build, vitest, and screenshots:verify — just give me the pre-merge checklist itself, not the explainer for each command.`

### Commands

1. `sed -n '1,14p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/resource-loading/assets-only-isolation.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"VERIFICATION":/,/\],/p'`
3. `test -e .opencode/skills/sk-code/sk-code-obsidian/assets/verification-checklist.md && echo "OK assets/verification-checklist.md" || echo "MISS assets/verification-checklist.md"`
4. `grep -c '^  - references/' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/resource-loading/assets-only-isolation.md`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: VERIFICATION` with a single-item
`expected_resources` list. Step 2 shows the `VERIFICATION` `RESOURCE_MAP` entry the checklist is
drawn from. Step 3 prints `OK`. Step 4 prints `0`, confirming zero `references/` entries in this
file's own `expected_resources` list.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the zero-count from step 4.

### Pass / Fail

- **Pass**: `assets/verification-checklist.md` exists, step 4 prints `0`, and the frontmatter's
  `expected_surface`/`expected_intent` match `OBSIDIAN`/`VERIFICATION`.
- **Fail**: the path is missing, a `references/` path appears in the set, or the frontmatter
  surface/intent disagree with `OBSIDIAN`/`VERIFICATION`.

### Failure Triage

1. Re-run step 3 and confirm whether `verification-checklist.md` was renamed or removed under
   `assets/`.
2. If step 4 prints a nonzero count, a `references/` path was added to this scenario's own list by
   mistake — this scenario's entire purpose is to hold exactly one `assets/` path; remove any
   `references/` entry rather than reclassifying the scenario.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §3 | The measured gate baseline this scenario's checklist enforces without re-citing |

---

## 5. SOURCE METADATA

- Group: Resource Loading
- Playbook ID: OB-009
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `resource-loading/assets-only-isolation.md`
