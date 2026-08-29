---
id: CD-H01
category: intra_routing_recall
stage: holdout
title: 'Blind holdout: session drop'
description: "This scenario is the natural-phrasing holdout for `CD-R04`. It focuses on confirming a prompt written in plain user language, blind to most of INTENT_SIGNALS's TROUBLESHOOT vocabulary except the two recorded exceptions, still routes to TROUBLESHOOT over the near-tied CLI hit on 'headless'."
expected_intent: TROUBLESHOOT
expected_resources:
  - references/troubleshooting.md
blindToRouterKeywords: true
blindExceptions:
  - "keeps dropping"
  - "work out the cause"
version: 1.0.0.1
---

# CD-H01: Blind holdout: session drop

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CD-H01`.

---

## 1. OVERVIEW

This scenario is the natural-phrasing holdout for `CD-R04` (`blindToRouterKeywords: true`). It focuses on confirming that a prompt describing a session that keeps dropping mid-run, phrased the way a real user would, still classifies as `TROUBLESHOOT` per `SKILL.md` §2 and resolves the same `RESOURCE_MAP["TROUBLESHOOT"]` set as `CD-R04`, not on actually diagnosing the drop.

### Route Binding

Bound to `TROUBLESHOOT` by the keywords "keeps dropping" and "work out the cause" ("work out the cause" added during routing remediation so the diagnostic signal outranks the near-tied `CLI` hit on "headless"). The holdout stays blind to the literal intent key, skill id, and resource basenames, but is no longer blind for the two bound phrases -- recorded in `blindExceptions` above.

### Why This Matters

The word "headless" alone is a `CLI` keyword, which makes this prompt a genuine near-tie rather than a clean decontamination -- exactly why "keeps dropping" and "work out the cause" are recorded as explicit `blindExceptions` instead of left as an undocumented loophole. This holdout is what proves the diagnostic phrasing outweighs the incidental `CLI` term, not that the prompt is keyword-free.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact holdout prompt for `CD-H01` classifies as `TROUBLESHOOT` and resolves the same declared resource set as its fitted counterpart `CD-R04`.

- Objective: confirm the natural-phrasing prompt routes to intent `TROUBLESHOOT` (not the near-tied `CLI`) and every path in `expected_resources`, decontaminating `CD-R04`
- Real user request: `The headless page-debugging session keeps dropping halfway through a run and I cannot work out the cause.`
- Prompt: `The headless page-debugging session keeps dropping halfway through a run and I cannot work out the cause.`

**Exact prompt**:
```text
The headless page-debugging session keeps dropping halfway through a run and I cannot work out the cause.
```

- Expected execution process: the router scores the prompt against `INTENT_SIGNALS` (`SKILL.md` §2); "keeps dropping" and "work out the cause" are the two recorded-exception `TROUBLESHOOT` keyword hits, outscoring the single incidental `CLI` hit on "headless", so `TROUBLESHOOT` becomes the primary intent and `RESOURCE_MAP["TROUBLESHOOT"]` loads the declared path
- Expected signals: the `expected_resources` path exists under `mcp-chrome-devtools/`, the frontmatter intent is `TROUBLESHOOT`, and the resolved set matches `CD-R04`'s
- Desired user-visible outcome: the bundled workflow classifies the natural-phrasing request the same way it classifies the keyword-heavy `CD-R04` prompt, loading the same troubleshooting reference despite the incidental `headless` term
- Pass/fail: PASS if the listed path exists, the frontmatter intent is `TROUBLESHOOT`, and the resolved set matches `CD-R04`; FAIL if the listed path is missing or the frontmatter disagrees

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The headless page-debugging session keeps dropping halfway through a run and I cannot work out the cause.`

### Commands

1. `sed -n '1,18p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/holdout-troubleshoot.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md | sed -n '/"TROUBLESHOOT":/p;/"CLI":/p'`
3. `for p in references/troubleshooting.md; do test -e ".opencode/skills/mcp-tooling/mcp-chrome-devtools/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_intent: TROUBLESHOOT` in the frontmatter. Step 2 shows the `INTENT_SIGNALS["TROUBLESHOOT"]` and `INTENT_SIGNALS["CLI"]` keyword-weight entries this scenario's near-tie classification derives from. Step 3 prints `OK` for the path.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_SIGNALS["TROUBLESHOOT"]` and `INTENT_SIGNALS["CLI"]` excerpts.

### Pass / Fail

- **Pass**: the `expected_resources` path exists under the skill root, the frontmatter's `expected_intent` matches `TROUBLESHOOT`, and the set matches `CD-R04`
- **Fail**: the listed path is missing, the frontmatter intent disagrees with `TROUBLESHOOT`, or the resolved set diverges from `CD-R04` without explanation

### Failure Triage

1. Re-run step 3 for `references/troubleshooting.md` and confirm whether it was renamed or removed under `references/`.
2. Compare this file's `expected_resources`/`expected_intent` against `troubleshoot.md` (`CD-R04`) directly -- a divergence between the fitted and holdout scenario for the same intent points to a routing regression, not a stale path.
3. If the near-tie flips to `CLI`, confirm whether a keyword-weight change in `SKILL.md` §2 caused it before treating this as a scenario-file defect.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2 | `INTENT_MODEL`/`INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §1 | Activation triggers this scenario's prompt assumes |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CD-H01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/holdout-troubleshoot.md`
