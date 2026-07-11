---
title: "DR-001: Design Restraint Ladder (pre-write rung selection)"
description: "Verify sk-code walks the Design Restraint Ladder and selects the laziest viable rung before writing new code, after surface and intent routing, without overriding surface precedence or the Iron Law."
version: 3.5.0.1
---

# DR-001: Design Restraint Ladder (pre-write rung selection)

## 1. OVERVIEW

This scenario verifies that for an implementation-intent request, sk-code climbs the Design Restraint Ladder and picks the laziest viable rung before writing any new code: does this need to exist at all (YAGNI), then a standard-library primitive, a native platform or runtime feature, an already-installed dependency, a one-line expression, and only then minimal custom code.

The ladder is a post-read reflex that runs AFTER surface and intent routing, so it consumes the detected surface but changes neither surface precedence (OPENCODE over WEBFLOW over UNKNOWN) nor the Iron Law (Phase 3 verification is still required). It is gated to the Phase 0 to Phase 1 transition and named in the SKILL.md Phase Overview.

The ladder is defined in `references/universal/code_quality_standards.md`, and the Phase 0 to 1 gate that requires the laziest viable rung is in `references/phase_detection.md`.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer asks the AI to add a small helper that removes duplicate strings from an array — a task a one-line standard-library expression already solves.

**Exact prompt**:
```
Add a helper to .opencode/skills/system-spec-kit/mcp_server/lib/util/unique.ts that removes duplicate strings from an array. Before writing, walk the Design Restraint Ladder and pick the laziest viable rung.
```

**Expected detection**:
- Surface: `OPENCODE` (target path contains `/.opencode/`)
- Intent: implementation (write work)
- Sub-language: `TYPESCRIPT` (target file extension `.ts`)

**Expected references loaded**:
- `references/stack_detection.md`
- `references/smart_routing.md`
- `references/universal/code_quality_standards.md`
- `references/phase_detection.md`
- `code-opencode/references/typescript/style_guide/overview-strict-and-naming.md`

**Expected ladder behavior**:
- The ladder runs AFTER surface and intent routing, not before.
- The selected rung is the laziest viable one — a one-line expression such as `[...new Set(arr)]` — NOT a hand-written deduplication loop (minimal custom code is the last rung).
- The Phase 0 to 1 gate records that the laziest viable rung was chosen before any new code.

**Desired user-visible outcome**: The AI names the rung it selected and proposes the one-line standard-library expression instead of a bespoke loop, with surface precedence and the Phase 3 verification requirement untouched.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/sk-code/SKILL.md` is at HEAD-of-main and its Phase Overview names the Design Restraint Ladder.
2. The ladder reference exists: `bash: rg -n "Design Restraint Ladder" .opencode/skills/sk-code/shared/references/universal/code_quality_standards.md`.
3. The Phase 0 to 1 gate exists: `bash: rg -n "laziest viable" .opencode/skills/sk-code/shared/references/phase_detection.md`.
4. Skill advisor callable.

### Exact Command Sequence

1. **Advisor probe**:
   ```
   bash: python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Add a helper to .opencode/skills/system-spec-kit/mcp_server/lib/util/unique.ts that removes duplicate strings from an array." --threshold 0.8 > /tmp/skc-DR001-advisor.txt
   ```
2. **Verify**: top-1 == `sk-code`, score >= 0.80.
3. **Invoke sk-code** with the exact prompt.
4. **Capture the ladder trace**: the AI should report the detected surface first, then the rung it selected from the ladder.
5. **Persist evidence** to `/tmp/skc-DR001-ladder.txt`.

### Expected Signals

| Step | Signal |
|---|---|
| 2 | Advisor: top_skill == sk-code, score >= 0.80. |
| 3 | sk-code router emits `SURFACE: OPENCODE` BEFORE any ladder reasoning. |
| 4 | The ladder selects a standard-library or one-line rung (e.g. `new Set`) and explicitly rejects writing a custom loop. |
| 4 | The Phase 0 to 1 gate is honored: the rung is chosen before new code. |

### Pass/Fail Criteria

- **PASS** iff: surface == OPENCODE AND the ladder runs after routing AND the selected rung is the laziest viable one (stdlib / native / one-liner over custom) per `references/universal/code_quality_standards.md` AND the Phase 0 to 1 gate in `references/phase_detection.md` is honored.
- **PARTIAL** iff: the ladder runs and picks a lazy rung but does not cite the Phase 0 to 1 gate.
- **FAIL** iff: the AI jumps straight to custom code, runs the ladder before routing, or overrides surface precedence.

### Failure Triage

1. If the AI writes a custom loop: verify the ladder rungs and ordering in `references/universal/code_quality_standards.md`.
2. If the ladder runs before routing: verify the Phase Overview ordering in SKILL.md places the ladder at the Phase 0 to 1 transition.
3. If surface precedence shifts: confirm the ladder text states it consumes, but does not change, the detected surface.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/shared/references/universal/code_quality_standards.md` — The pre-write Design Restraint Ladder.
- `.opencode/skills/sk-code/shared/references/phase_detection.md` — Phase 0 to 1 gate requiring the laziest viable rung for implementation intent.
- `.opencode/skills/sk-code/SKILL.md` — Phase Overview naming the ladder; surface precedence and Iron Law.

## 5. SOURCE METADATA

- **Created**: 2026-06-13
- **Critical path**: No
- **Destructive**: No (read-only behavior test; the helper edit is described but not applied)
- **Sandbox**: production read-only; do not actually create `unique.ts` during the behavior test.
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
