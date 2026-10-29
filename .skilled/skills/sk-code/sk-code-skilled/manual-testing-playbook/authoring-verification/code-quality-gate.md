---
id: OC-007
category: authoring_verification
title: 'Code quality gate routing'
description: "This scenario validates CODE_QUALITY routing for `OC-007`. It confirms a lint/format/naming/code-smell prompt loads the full twelve-file authoring checklist set — universal, the JavaScript checklist with its three-part js-css-style tier, TypeScript, Python, Shell, and the four-part Rust checklist — instead of a single-language subset."
expected_surface: SKILLED
expected_intent: CODE_QUALITY
expected_resources:
  - assets/checklists/universal-checklist.md
  - assets/checklists/javascript-checklist.md
  - assets/checklists/js-css-style/overview-header-and-comments.md
  - assets/checklists/js-css-style/naming-init-formatting-and-css.md
  - assets/checklists/js-css-style/verification-quick-reference-and-related.md
  - assets/checklists/typescript-checklist.md
  - assets/checklists/python-checklist.md
  - assets/checklists/shell-checklist.md
  - assets/checklists/rust-checklist/overview-and-p0-parity.md
  - assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md
  - assets/checklists/rust-checklist/p1-required.md
  - assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md
version: 1.0.5.0
---

# OC-007: Code quality gate routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OC-007`.

---

## 1. OVERVIEW

This scenario validates `CODE_QUALITY` routing for `OC-007`. It focuses on confirming that the exact prompt
below classifies as `CODE_QUALITY` and loads the full 12-file resource set instead of a generic or mismatched
resource set, per `ROUTER.md` §3's machine-readable router.

### Why This Matters

`CODE_QUALITY` is the shared post-implementation gate across every language this surface owns. If the router drops the four-file Rust checklist from the resolved set, a Rust change could clear the quality gate without the P0 safety/boundary-discipline and P1/P2 checks that trio enforces. If it drops the three `js-css-style` parts, a JavaScript or stylesheet change clears the gate without the header, comment, naming and CSS-convention checks those parts carry, and the 12-entry list is the one `RESOURCE_MAP["CODE_QUALITY"]` actually declares.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OC-007` classifies as `CODE_QUALITY` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `SKILLED`, intent `CODE_QUALITY`, and every path in
  `expected_resources`.
- Real user request: `Run a quality gate for lint, format, naming, standards, and code smell risks in OpenCode system code.`
- Prompt: `Run a quality gate for lint, format, naming, standards, and code smell risks in OpenCode system code.`

**Exact prompt**:
```text
Run a quality gate for lint, format, naming, standards, and code smell risks in OpenCode system code.
```

- Expected execution process: the hub detects `SKILLED` (work under `.skilled/`), the `CODE_QUALITY`
  `INTENT_SIGNALS` keywords match the prompt, and every path this scenario lists under
  `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-skilled/`, and each one
  documents `CODE_QUALITY` routing per `SKILL.md` §2 or `ROUTER.md` §3.
- Desired user-visible outcome: the bundled workflow cites the routed `CODE_QUALITY` resources as the
  standards evidence, not a mismatched language or generic tier.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `SKILLED`/
  `CODE_QUALITY`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a quality gate for lint, format, naming, standards, and code smell risks in OpenCode system code.`

### Commands

1. `sed -n '/^---$/,/^---$/p' .skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/authoring-verification/code-quality-gate.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .skilled/skills/sk-code/sk-code-skilled/ROUTER.md | grep -F '"CODE_QUALITY"'`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .skilled/skills/sk-code/sk-code-skilled/ROUTER.md | sed -n '/"CODE_QUALITY": \[/,/\],/p'`
4. `for p in assets/checklists/universal-checklist.md assets/checklists/javascript-checklist.md assets/checklists/js-css-style/overview-header-and-comments.md assets/checklists/js-css-style/naming-init-formatting-and-css.md assets/checklists/js-css-style/verification-quick-reference-and-related.md assets/checklists/typescript-checklist.md assets/checklists/python-checklist.md assets/checklists/shell-checklist.md assets/checklists/rust-checklist/overview-and-p0-parity.md assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md assets/checklists/rust-checklist/p1-required.md assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md; do test -e ".skilled/skills/sk-code/sk-code-skilled/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: CODE_QUALITY` and the full `expected_resources` list in the frontmatter. Step
2 shows the `INTENT_SIGNALS["CODE_QUALITY"]` keyword list this scenario's prompt matches. Step 3 shows the
`RESOURCE_MAP["CODE_QUALITY"]` array this scenario's 12-path list mirrors entry for entry. Step 4 prints
`OK` for every path.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the `RESOURCE_MAP["CODE_QUALITY"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `CODE_QUALITY`.
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `CODE_QUALITY`.

### Failure Triage

1. Re-run step 4 for the specific path that failed and confirm whether it was renamed or removed under
   `assets/checklists/` or `assets/checklists/js-css-style/`.
2. Sort both lists — this scenario's `expected_resources` and the step-3 array — and diff them; both hold
   12 paths, so any difference is a stale scenario file or a stale `ROUTER.md` map, never a legitimate
   subset.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [ROUTER.md](../../ROUTER.md) §3 | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §2 | Reference-map prose entry for the `CODE_QUALITY` resource set |

---

## 5. SOURCE METADATA

- Group: sk-code-skilled routing
- Playbook ID: OC-007
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `authoring-verification/code-quality-gate.md`
