---
id: CQ-001
category: quality_gate
title: 'Quality gate routes to the code-quality checklist'
description: "This scenario validates QUALITY routing for `CQ-001`. It confirms a comment-hygiene and P0/P1/P2 quality-gate prompt resolves to code-quality's own routable checklist rather than a surface-owned OpenCode or Webflow checklist."
expected_intent: QUALITY
expected_resources:
  - assets/code-quality-checklist/overview-header-and-comments.md
  - assets/code-quality-checklist/naming-init-formatting-and-css.md
  - assets/code-quality-checklist/verification-quick-reference-and-related.md
version: 1.0.0.0
---

# CQ-001: Quality Gate Routes To The Checklist

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CQ-001`.

---

## 1. OVERVIEW

This scenario validates `QUALITY` routing for `CQ-001`. `code-quality` is a thin, deliberately narrow
Type-1 prompt-intent router: its real routing precision is target-path-keyed (the checklist map in
`SKILL.md` §2) and covered by a dedicated unit test, and its parent-to-child discoverability is the hub's
`quality` signal. This scenario exercises the one prompt-intent route the deterministic router-replay can
score — confirming that a comment-hygiene / P0-P1-P2 quality-gate prompt classifies as `QUALITY` and
loads code-quality's own checklist rather than a surface-owned checklist under `sk-code-opencode` or a
Webflow-only standard.

### Why This Matters

`code-quality` sits between implementation and verification for every surface. If a quality-gate prompt
is mis-routed away from its own checklist, an author-side pass could claim a gate ran without ever
loading the P0/P1/P2 criteria that actually block completion, per `SKILL.md` §2b's thin-router note.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CQ-001` classifies as `QUALITY` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt resolves intent `QUALITY` and every path in `expected_resources`.
- Real user request: `Run the comment hygiene quality gate and check P0/P1/P2 standards before marking this done.`
- Prompt: `Run the comment hygiene quality gate and check P0/P1/P2 standards before marking this done.`

**Exact prompt**:
```text
Run the comment hygiene quality gate and check P0/P1/P2 standards before marking this done.
```

- Expected execution process: the hub routes the request to `code-quality`, the thin `QUALITY`
  `INTENT_SIGNALS` keywords (`quality gate`, `p0 p1 p2`, ...) match the prompt, and every path this
  scenario lists under `expected_resources` resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-quality/`, and each one
  documents the JavaScript/CSS quality checklist per `SKILL.md` §2.
- Desired user-visible outcome: the bundled workflow loads code-quality's own checklist set, not
  `sk-code-opencode`'s target-path checklists or a Webflow-only standard, before any completion claim.
- Pass/fail: PASS if every listed path exists and the frontmatter `expected_intent` is `QUALITY`; FAIL if
  any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the comment hygiene quality gate and check P0/P1/P2 standards before marking this done.`

### Commands

1. `sed -n '1,14p' .opencode/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md`
2. `sed -n '/^INTENT_SIGNALS/,/^RESOURCE_MAP/p' .opencode/skills/sk-code/sk-code-quality/SKILL.md`
3. `for p in assets/code-quality-checklist/overview-header-and-comments.md assets/code-quality-checklist/naming-init-formatting-and-css.md assets/code-quality-checklist/verification-quick-reference-and-related.md; do test -e ".opencode/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: QUALITY` in the frontmatter. Step 2 shows the thin-router
`INTENT_SIGNALS["QUALITY"]` keyword list this scenario's prompt matches. Step 3 prints `OK` for all three
paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_SIGNALS["QUALITY"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_intent` matches `QUALITY`.
- **Fail**: any listed path is missing, or the frontmatter intent disagrees with `QUALITY`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether the checklist file was renamed or
   removed under `assets/code-quality-checklist/`.
2. Diff this scenario's `expected_resources` against `SKILL.md`'s `RESOURCE_MAP["QUALITY"]` and
   `DEFAULT_RESOURCE` (§2b) to see whether the drift is a stale scenario file or a stale router map —
   `RESOURCE_MAP["QUALITY"]` names only the first checklist file directly, while `DEFAULT_RESOURCE` names
   all three; this scenario tracks the full checklist set an operator actually loads.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | Thin `INTENT_SIGNALS`/`RESOURCE_MAP` router this scenario exercises |
| [SKILL.md](../../SKILL.md) §4 | The completion-claim rule this checklist gate must hold before hand-off |

---

## 5. SOURCE METADATA

- Group: code-quality routing
- Playbook ID: CQ-001
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/quality-checklist.md`
