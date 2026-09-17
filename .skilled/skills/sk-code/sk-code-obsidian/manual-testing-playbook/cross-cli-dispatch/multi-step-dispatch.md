---
id: OB-016
category: cross_cli_dispatch
title: 'Multi-step dispatch stability'
description: "This scenario validates session-level resource-set stability for `OB-016`. It focuses on confirming three sequential prompts in one shared session each resolve their own correct intent and resources without carrying stale resources over from the previous step."
expected_surface: OBSIDIAN
expected_intent: IMPLEMENTATION+CODE_QUALITY+VERIFICATION
expected_resources:
  - references/view-renderer-architecture.md
  - references/folder-docs.md
  - references/verification.md
version: 1.0.0.0
---

# OB-016: Multi-step dispatch stability

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-016`.

---

## 1. OVERVIEW

This scenario validates session-level resource-set stability for `OB-016`. It focuses on confirming
that three sequential, distinct-intent prompts sent within one shared session each resolve their own
correct evidence, without step 2's `CODE_QUALITY` evidence bleeding into step 3's `VERIFICATION`
resolution, or step 1's `IMPLEMENTATION` evidence lingering once the conversation has moved on.

### Why This Matters

A single-prompt scenario cannot catch session-state leakage — a classifier that works correctly in
isolation can still carry a stale resource set forward once a session accumulates turns. Three
sequential asks spanning three distinct intents in one session is the minimum shape that can expose
that failure mode.

---

## 2. SCENARIO CONTRACT

Operators confirm each of the three sequential prompts for `OB-016` resolves its own correct
surface/intent/resource set, run one after another in the same session.

- Objective: confirm all three sequential prompts route to surface `OBSIDIAN`, resolve their own
  distinct intent, and each step's resource set is independently correct with no carryover from a
  prior step.
- Real user request (three sequential turns in one session):
  1. `Add a computed-percentage column type to the table renderer's row pipeline.`
  2. `Now that that's in, does src/data/ meet the folder-doc threshold — does it need a README.md and CODE.md pair?`
  3. `Before I merge both changes, run the full verification gate and report the lint delta.`
- Prompt: the three-turn sequence above, sent in order within one shared session.

**Exact prompt sequence**:
```text
Turn 1: Add a computed-percentage column type to the table renderer's row pipeline.
Turn 2: Now that that's in, does src/data/ meet the folder-doc threshold — does it need a README.md and CODE.md pair?
Turn 3: Before I merge both changes, run the full verification gate and report the lint delta.
```

- Expected execution process: the hub detects `OBSIDIAN` once at session start and holds it for all
  three turns; turn 1 resolves `IMPLEMENTATION` and loads `view-renderer-architecture.md` (plus
  `data-layer.md`); turn 2 resolves `CODE_QUALITY` and loads `folder-docs.md` (plus
  `folder-docs-checklist.md`) without re-surfacing turn 1's renderer evidence as new; turn 3 resolves
  `VERIFICATION` and loads `verification.md` (plus `verification-checklist.md`) without re-surfacing
  turn 2's folder-doc evidence as new.
- Expected signals: each turn's reported resource set matches that turn's own intent-appropriate
  evidence; no turn's transcript shows a prior turn's resources being re-cited as freshly loaded.
- Desired user-visible outcome: three independently correct answers in one coherent session — a new
  column type confirmed, a folder-doc verdict for `src/data/`, and a verification-gate report — with
  no cross-turn resource bleed the operator would notice as repetition or drift.
- Pass/fail: PASS if all three turns resolve their own correct surface/intent and every path in
  `expected_resources` (the cross-turn union anchor set) resolves, with no stale carryover observed;
  FAIL if any turn resolves the wrong intent, any listed path is missing, or a prior turn's resources
  visibly bleed into a later turn.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: the three-turn sequence in §2.

### Commands

1. `sed -n '1,16p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/cross-cli-dispatch/multi-step-dispatch.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"IMPLEMENTATION":/,/\],/p;/"CODE_QUALITY":/,/\],/p;/"VERIFICATION":/,/\],/p'`
3. `for p in references/view-renderer-architecture.md references/folder-docs.md references/verification.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`
4. Dispatch the three-turn sequence in one shared session and capture each turn's reported
   surface/intent/resource set separately.

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and the combined `expected_intent:
IMPLEMENTATION+CODE_QUALITY+VERIFICATION`. Step 2 shows all three `RESOURCE_MAP` entries. Step 3
prints `OK` for all three anchor paths. Step 4's three per-turn transcripts each show only their own
turn's intent-appropriate resources, with no prior-turn resource re-cited as newly loaded.

### Evidence

Command transcript from steps 1-3; three per-turn transcripts from step 4, saved to
`/tmp/ob-016-turn-1.txt`, `/tmp/ob-016-turn-2.txt`, `/tmp/ob-016-turn-3.txt`.

### Pass / Fail

- **Pass**: every `expected_resources` anchor path exists, each of the three turns resolves its own
  correct intent, and no turn's transcript shows a prior turn's resources being re-cited as freshly
  loaded.
- **Fail**: any anchor path is missing, any turn resolves the wrong intent, or a prior turn's
  resources visibly bleed into a later turn's reported set.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed.
2. If a turn shows stale carryover, isolate which turn boundary it crosses (1→2 or 2→3) by re-running
   that pair alone in a fresh session, to distinguish a genuine session-state leak from an
   coincidental keyword overlap between adjacent turns.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises across all three turns |
| [SKILL.md](../../SKILL.md) §1 | The `OBSIDIAN` surface-detection trigger this scenario assumes holds across the whole session |

---

## 5. SOURCE METADATA

- Group: Cross-CLI Dispatch
- Playbook ID: OB-016
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cross-cli-dispatch/multi-step-dispatch.md`
