---
title: "RD-002: sk-code vs sk-doc Anti-Pattern Routing"
description: "Verify the skill advisor routes documentation-edit prompts to sk-doc, NOT sk-code, even when the prompt mentions code-related vocabulary."
version: 1.5.1.0
---

# RD-002: sk-code vs sk-doc Anti-Pattern Routing

## 1. OVERVIEW

This scenario verifies that the skill advisor correctly distinguishes documentation work from code work. Prompts that mention code-related terms (skill names, file paths under `.skilled/skills/`, technical vocabulary) but actually request a documentation edit MUST route to `sk-doc`, not `sk-code`.

The risk this scenario guards against: sk-code's broad signal coverage ("opencode", "skill", "typescript", "python") could falsely capture doc-edit prompts that target SKILL.md, README.md, or other markdown files inside `.skilled/skills/` directories.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: A skill maintainer wants to clarify the routing model in sk-code's SKILL.md by rewriting the headline section.

**Exact prompt**:
```
Update the sk-code SKILL.md headline section to clarify the two-axis routing model and add a one-line summary at the top.
```

Prompt: `Update the sk-code SKILL.md headline section to clarify the two-axis routing model and add a one-line summary at the top.`

**Why this is sk-doc, not sk-code**:
- The action is `Update the SKILL.md headline section` — pure documentation editing.
- The target is a `.md` file (markdown), not code.
- The deliverable is text content, not behavior change.
- sk-doc is the unified markdown specialist; sk-code is for executable code work.

**Expected advisor result**:
- Top-1 skill: `sk-doc`
- Top-1 `passes_threshold`: true, at the probe's own `--threshold 0.8`
- Top-1 `confidence`: at or above the probe threshold
- Ranking, native path only: sk-doc's `score` is higher than sk-code's `score`. `score` orders the candidates and never reaches a `--threshold` value, so it is compared with the other candidates' `score`, not with a threshold. When the run reports `source: "local"` there is no `score` to compare, so the criterion rests on top-1 and `passes_threshold` alone and the evidence names the fallback.
- sk-code: ranked below sk-doc, and it does not need to be absent from the list, only ranked lower.

**Expected behavior if sk-code wins anyway**: This is a misroute. The remediation is an edit to the `signals` list of `skill-graph.json`: either append the doc-edit vocabulary that should have outranked sk-code, or remove the sk-code signal that captured it. Any such edit changes global advisor routing for every skill, so it needs the operator's explicit approval before it lands and it is never made as part of a scenario run.

---

## 3. TEST EXECUTION

### Preconditions

1. Skill advisor binary callable.
2. `skill-graph.json` has both `sk-code` and `sk-doc` entries.

### Exact Command Sequence

1. **Advisor probe**:
   ```
   bash: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "Update the sk-code SKILL.md headline section to clarify the two-axis routing model and add a one-line summary at the top." --threshold 0.8 > /tmp/skc-RD002-advisor.txt
   ```
2. **Parse**: extract the top-1 skill, its `confidence` and `score`, `passes_threshold`, and sk-code's `score`.
3. **Verify**: top-1 == `sk-doc` AND sk-doc's `passes_threshold` is true.

### Expected Signals

Expected signals: advisor top-1 is `sk-doc` with `passes_threshold` true, and sk-doc's `score` is higher than sk-code's `score`.

### Pass/Fail Criteria

- **PASS** iff: top-1 == sk-doc AND sk-doc's `passes_threshold` is true AND sk-doc's `score` exceeds sk-code's `score`.
- **FAIL** iff: top-1 == sk-code (false positive — sk-code captured a doc-edit prompt), or sk-doc wins but does not clear the probe threshold.

Evidence: `/tmp/skc-RD002-advisor.txt` (advisor probe output: the ordered candidates with each `confidence`, `passes_threshold` and `score`).

### Failure Triage

1. If sk-code wins: dump the full `signal` block of `skill-graph.json` for sk-code. Check whether a broad signal such as "system code" is dominating.
2. Propose the edit as a change to the `signals` list, which is a flat list of strings keyed by skill id: append the doc-edit vocabulary that should outrank sk-code, or remove the entry that captured this prompt. The graph has no per-skill object and no anti-signal field, so there is nothing else to edit. Every such change alters global advisor routing, so it needs the operator's explicit approval before it lands.
3. If the probe printed `Native advisor unavailable ... falling back to local Python scorer`, the local scorer routes this prompt to sk-code on its own signal match. The FAIL is real for that run, and the repair is to restore the native advisor build, not to relax the criterion.
4. Cross-check with `labeled-prompts.jsonl` golden set — does it have any sk-doc-labeled prompts that look like this one? If yes, why are they labeled correctly there but failing here?

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` — Root directory page and scenario summary.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` — Skill signals for both sk-code and sk-doc.
- `.skilled/skills/sk-code/SKILL.md` — sk-code routing scope.
- `.skilled/skills/sk-doc/SKILL.md` — sk-doc routing scope (markdown specialist).

Catalog: `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`, the entry that states the skill advisor routes every code-related prompt to the single identity `sk-code`.

---

## 5. SOURCE METADATA

- Group: Routing Disambiguation
- Playbook ID: RD-002
- **Created**: 2026-05-04
- **Critical path**: Yes (validates skill advisor correctness for the most common false-positive risk)
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run + Phase E aggregate report
