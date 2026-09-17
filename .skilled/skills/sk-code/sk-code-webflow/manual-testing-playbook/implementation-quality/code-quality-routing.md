---
id: WF-002
category: implementation_quality
title: 'Code quality routing'
description: "This scenario validates CODE_QUALITY routing for `WF-002`. It confirms that a lint/format/naming/code-smell prompt for a Webflow client script classifies as `CODE_QUALITY` and loads the two-file shared cross-language quality set, matching `SKILL.md` §2b's `RESOURCE_MAP[\"CODE_QUALITY\"]` entry exactly."
expected_surface: WEBFLOW
expected_intent: CODE_QUALITY
expected_resources:
  - references/shared/cross-language-rules.md
  - references/shared/enforcement.md
version: 1.0.0.0
---

# WF-002: Code quality routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `WF-002`.

---

## 1. OVERVIEW

This scenario validates CODE_QUALITY routing for `WF-002`. It confirms that a lint/format/naming/code-smell prompt for a Webflow client script classifies as `CODE_QUALITY` and loads the two-file shared cross-language quality set, matching `SKILL.md` §2b's `RESOURCE_MAP["CODE_QUALITY"]` entry exactly.

### Why This Matters

`CODE_QUALITY` on this surface is intentionally thin: two shared cross-language files, with no Webflow-specific quality doctrine of its own, because `sk-code-quality` owns the full author-side quality gate. This scenario confirms a Webflow client-script lint/format request still resolves here for the shared enforcement standard rather than silently falling through to `UNKNOWN`.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `WF-002` classifies as `CODE_QUALITY` and resolves the declared
resource set without contradictory evidence.

- Objective: confirm the exact prompt routes to surface `WEBFLOW`, intent `CODE_QUALITY`, and every
  path in `expected_resources`.
- Real user request: `Run a quality gate for lint, format, naming, and code smell risks in a Webflow client script.`
- Prompt: `Run a quality gate for lint, format, naming, and code smell risks in a Webflow client script.`

**Exact prompt**:
```text
Run a quality gate for lint, format, naming, and code smell risks in a Webflow client script.
```

- Expected execution process: the hub detects `WEBFLOW`, the `CODE_QUALITY` `INTENT_SIGNALS` keywords
  (`lint`, `quality gate`, `naming`, `code smell`, ...) match the prompt, and every path this scenario lists under `expected_resources`
  resolves under the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-webflow/`, and each one
  documents `CODE_QUALITY` routing per `SKILL.md` §2 or §2b.
- Desired user-visible outcome: the bundled workflow runs the cross-language lint/format/naming gate and cites `cross-language-rules.md` and `enforcement.md` as the standard the client script is graded against, not a generic style opinion.
- Pass/fail: PASS if every listed path exists and the frontmatter surface/intent are `WEBFLOW`/
  `CODE_QUALITY`; FAIL if any listed path is missing or the frontmatter disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a quality gate for lint, format, naming, and code smell risks in a Webflow client script.`

### Commands

1. `sed -n '1,15p' .opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook/implementation-quality/code-quality-routing.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-webflow/SKILL.md | sed -n '/"CODE_QUALITY": \[/,/\],/p'`
3. `for p in references/shared/cross-language-rules.md references/shared/enforcement.md; do test -e ".opencode/skills/sk-code/sk-code-webflow/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: WEBFLOW` and `expected_intent: CODE_QUALITY`. Step 2 shows the
`CODE_QUALITY` `RESOURCE_MAP` entry this scenario's set mirrors exactly. Step 3 prints `OK` for every
path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `RESOURCE_MAP["CODE_QUALITY"]`
excerpt.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root and the frontmatter's
  `expected_surface`/`expected_intent` match `WEBFLOW`/`CODE_QUALITY`.
- **Fail**: any listed path is missing, or the frontmatter surface/intent disagree with
  `WEBFLOW`/`CODE_QUALITY`.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed
   under `references/` or `assets/`.
2. Diff this scenario's `expected_resources` against the step-2 `RESOURCE_MAP["CODE_QUALITY"]` excerpt —
   the two sets are an exact mirror for this intent, so any difference means either this scenario
   file or `SKILL.md` §2b drifted and needs reconciling, not that a subset omission is by design.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |

---

## 5. SOURCE METADATA

- Group: Implementation And Quality
- Playbook ID: WF-002
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `implementation-quality/code-quality-routing.md`

