---
id: CR-R05
category: intra_routing_recall
stage: routing
title: 'SOLID routing'
description: "This scenario validates SOLID routing for `CR-R05`. It confirms an architecture-shaped prompt classifies as `SOLID` and resolves the declared expected_resources set under sk-code-review's smart router."
expected_intent: SOLID
expected_resources:
  - references/review-core.md
  - references/review-ux-single-pass.md
  - assets/security-checklist.md
  - assets/code-quality-checklist.md
  - assets/fix-completeness-checklist.md
  - assets/solid-checklist.md
version: 1.0.0.0
---

# CR-R05: SOLID routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CR-R05`.

---

## 1. OVERVIEW

This scenario validates SOLID routing for `CR-R05`. It confirms that an
architecture-shaped prompt classifies as `SOLID`, not a mismatched intent, and resolves every
path this scenario declares under `expected_resources` — this scenario's set adds one checklist beyond `DEFAULT_RESOURCES`.

### Why This Matters

`SOLID` is the widest keyword set in `INTENT_SIGNALS` (twelve terms spanning coupling, cohesion, adapters, interfaces, and dependency direction) and, unlike `SECURITY`/`QUALITY`/`KISS`/`DRY`, `RESOURCE_MAP["SOLID"]` points at `assets/solid-checklist.md`, which is *not* one of the five `DEFAULT_RESOURCES`. CR-R05 proves an architecture-shaped prompt adds this checklist on top of the ALWAYS-loaded baseline rather than the reviewer relying on the generic code-quality checklist alone for SRP/OCP/LSP/ISP/DIP findings.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CR-R05` classifies as `SOLID` and resolves the
declared resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to intent `SOLID` and every path in
  `expected_resources`.
- Real user request: `Review target changes module boundaries and needs an architecture-level pass.`
- Prompt: `Review this architecture for SOLID design, coupling, cohesion, module boundaries, adapter interfaces, abstraction responsibility, and dependency direction.`

**Exact prompt**:
```text
Review this architecture for SOLID design, coupling, cohesion, module boundaries, adapter interfaces, abstraction responsibility, and dependency direction.
```

- Expected execution process: the smart router matches the `SOLID` `INTENT_SIGNALS`
  keywords (`solid`, `architecture`, `design`, `coupling`, `cohesion`, `module`, `adapter`, `interface`, `abstraction`, `responsibility`, `dependency`, `boundary`) against the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-review/`, and the
  frontmatter `expected_intent` reads `SOLID`.
- Desired user-visible outcome: a review that adds SOLID-specific findings (SRP/OCP/LSP/ISP/DIP) on top of the baseline security/quality/completeness checks.
- Pass/fail: PASS if every listed path exists and the frontmatter `expected_intent` is
  `SOLID`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this architecture for SOLID design, coupling, cohesion, module boundaries, adapter interfaces, abstraction responsibility, and dependency direction.`

### Commands

1. `sed -n '1,18p' .opencode/skills/sk-code/sk-code-review/manual-testing-playbook/intra-routing-recall/solid.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/sk-code/sk-code-review/SKILL.md | grep '"SOLID"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .opencode/skills/sk-code/sk-code-review/SKILL.md | grep '"SOLID"'`
4. `for p in references/review-core.md references/review-ux-single-pass.md assets/security-checklist.md assets/code-quality-checklist.md assets/fix-completeness-checklist.md assets/solid-checklist.md; do test -e ".opencode/skills/sk-code/sk-code-review/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: SOLID` and the full `expected_resources` list. Step 2 shows
the `SOLID` `INTENT_SIGNALS` entry (weight `3`) this scenario's prompt keywords
derive from. Step 3 shows the `RESOURCE_MAP["SOLID"]` entry this scenario's set is built
from. Step 4 prints `OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the
`INTENT_SIGNALS["SOLID"]` and `RESOURCE_MAP["SOLID"]` excerpts.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `SOLID`.
- **Fail**: any listed path is missing, or the frontmatter `expected_intent` disagrees with
  `SOLID`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed
   under `assets/` or `references/`.
2. Diff this scenario's `expected_resources` against the step-3 `RESOURCE_MAP["SOLID"]`
   excerpt — `assets/solid-checklist.md` is additive beyond `DEFAULT_RESOURCES`, so a missing path here means the CONDITIONAL intent-specific load failed even if the ALWAYS-tier baseline is intact.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2 | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §2 | `DEFAULT_RESOURCES` baseline this scenario assumes |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CR-R05
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/solid.md`
