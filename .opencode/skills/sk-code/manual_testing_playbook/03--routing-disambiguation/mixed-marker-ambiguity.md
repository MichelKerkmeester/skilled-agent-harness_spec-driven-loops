---
title: "RD-001: Mixed-Marker Ambiguity"
description: "Verify sk-code asks for clarification (or applies a documented precedence rule) when WEBFLOW library markers and OPENCODE path markers co-occur in the same prompt."
---

# RD-001: Mixed-Marker Ambiguity

## 1. OVERVIEW

This scenario verifies sk-code's behavior when surface detection is genuinely ambiguous: the prompt mentions a WEBFLOW library (e.g. Lenis) AND targets a file under `.opencode/`. Expected behavior is one of:

A) Apply a documented precedence rule (e.g. "OPENCODE target path overrides WEBFLOW library marker").
B) Ask the user for explicit clarification.

Either is acceptable IF the chosen behavior is documented in SKILL.md. What is NOT acceptable: silently picking one without surfacing the conflict.

> **Note**: This scenario was the validation target for F-NEW-001 from the 2026-05-04 deep-review iteration. SKILL.md smart router pseudocode previously had a precedence bug (WEBFLOW markers capturing OPENCODE-targeted prompts; unconditional `SURFACE="UNKNOWN"` overwriting prior matches). **REMEDIATED 2026-05-04**: pseudocode restructured with explicit `if/elif/else` precedence — OPENCODE target/CWD wins over WEBFLOW markers. This scenario now exercises the documented precedence (Outcome A).

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants to add Lenis smooth-scroll to a local preview server's index page (the preview server is itself an `.opencode/` system tool).

**Exact prompt**:
```
Add Lenis smooth-scroll to .opencode/skills/sk-doc/scripts/preview-server.js for the local preview index page.
```

**Markers present**:
- WEBFLOW library marker: `Lenis` (matches `references/stack_detection.md:30-37`)
- OPENCODE path marker: `.opencode/skills/sk-doc/scripts/preview-server.js`

**Expected behavior** (one of two acceptable outcomes):

**Outcome A (documented precedence)**: SKILL.md states OPENCODE target path overrides WEBFLOW library marker. sk-code reports `SURFACE: OPENCODE`, `LANGUAGE: JAVASCRIPT`, loads `references/opencode/javascript/*` + shared. Does NOT load `references/webflow/*`.

**Outcome B (clarification ask)**: sk-code reports `SURFACE: AMBIGUOUS` and asks: "Is this an OpenCode internal tool (use OPENCODE) or a Webflow shipping artifact you happened to place under `.opencode/` (use WEBFLOW)?"

**Unacceptable**: Silent choice (e.g. WEBFLOW silently wins because of marker order in pseudocode) without documenting the precedence.

## 3. TEST EXECUTION

### Preconditions

1. SKILL.md is at HEAD-of-main.
2. `references/stack_detection.md` precedence section is intact.
3. Either remediation for F-NEW-001 has landed (then test for Outcome A) OR has not (then test for either A or B; document which behavior the AI exhibits).

### Exact Command Sequence

1. Invoke sk-code with the prompt.
2. Capture `SURFACE` decision and any clarification question to `/tmp/skc-RD001-response.txt`.
3. Capture loaded refs to `/tmp/skc-RD001-loaded-refs.txt`.

### Pass/Fail Criteria

- **PASS** iff:
  - **Outcome A**: surface == OPENCODE AND no `references/webflow/*` loaded AND SKILL.md documents this precedence.
  - **Outcome B**: surface reported as AMBIGUOUS AND a clarification question is asked AND no surface-specific refs are loaded yet.
- **FAIL** iff: surface silently picked without surfacing the conflict AND no documented precedence exists in SKILL.md.

### Failure Triage

1. If WEBFLOW silently wins (current state per F-NEW-001): this is the documented bug. Fix the smart router pseudocode in SKILL.md to make OPENCODE target/CWD detection an explicit override before workspace-wide WEBFLOW marker checks.
2. If OPENCODE silently wins WITH no documentation: add the precedence rule to SKILL.md "Smart Router" section.
3. If AMBIGUOUS but no clarification question: the router is detecting ambiguity but not surfacing it. Verify the disambiguation-question rule is documented.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/SKILL.md` §2 "Code Surface Detection (FIRST)" — post-remediation pseudocode with explicit if/elif/else precedence.
- `.opencode/skills/sk-code/references/stack_detection.md` §2 "DETECTION ORDER" — post-remediation precedence wording + new mixed-marker test case in §4 TEST CASES.
- Internal design notes — F-NEW-001 source (historical gpt-5.5 high adversarial pass).

## 5. SOURCE METADATA

- **Created**: 2026-05-04
- **Critical path**: No (but tied to F-NEW-001 P1)
- **Destructive**: No (read-only routing test)
- **Concurrent-safe**: Yes
- **Last validated**: pending Phase C remediation of F-NEW-001
