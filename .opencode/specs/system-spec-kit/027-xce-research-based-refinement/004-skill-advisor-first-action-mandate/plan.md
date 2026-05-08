---
title: "Plan — 027/004 skill advisor first-action mandate"
description: "Plan: single render.ts edit + tests."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 027/004 skill advisor first-action mandate

<!-- SPECKIT_LEVEL: 1 -->

## OVERVIEW
Single-file edit, ~80-120 LOC after pt-02 amendments. Wall-clock 60-90 minutes.

## PHASES

### Phase 1: Choose guard strategy (REQ-007)
**Decide BEFORE implementation**: renderer-side uncertainty re-check OR producer invariant fixture proving `passes_threshold` already encodes confidence + uncertainty thresholds.
- If **renderer-side**: add explicit `if (uncertainty > THRESHOLD) return softMessage` branch in render.ts before mandate wording.
- If **producer-invariant**: write a test in `skill_advisor/tests/` proving `passes_threshold:true ⇒ uncertainty ≤ T` for every code path that sets `passes_threshold`.
- Default recommendation: producer invariant fixture (cheaper, no scorer surgery).

### Phase 2: FIRST_ACTION_HINT map + safe fallback (REQ-001)
- Edit `mcp_server/skill_advisor/lib/render.ts`.
- Add module-level `const FIRST_ACTION_HINT = { 'mcp-coco-index': 'semantic search BEFORE grep', ... }` (one entry per known skill).
- Add safe fallback constant: `const FIRST_ACTION_HINT_FALLBACK = "open the skill instructions first"`.
- Lookup: `FIRST_ACTION_HINT[topLabel] ?? FIRST_ACTION_HINT_FALLBACK` — NEVER render `undefined`.

### Phase 3: capText callsite updates (REQ-002, REQ-003, REQ-004)
- Modify `capText` call at lines 149-152 (ambiguous case) — `"MUST invoke ${topLabel} FIRST (${score}/${uncertainty}) — ${hintOrFallback}"`.
- Modify `capText` call at lines 155-158 (normal case) — same template.
- Confidence threshold logic at 124-133 unchanged.
- Apply guard from Phase 1 (high-uncertainty case routes to soft "use X" wording, not "MUST invoke").

### Phase 4: Legacy fixture migration (REQ-008)
- `skill_advisor/tests/render.vitest.ts`: rewrite every exact-string fixture pinning the OLD `"use X"` brief shape. Replace with mandate-wording + directive-shape assertions.
- Preserve non-string fixtures: poisoning, null, freshness, cache, cap, ambiguous-output coverage.
- Audit `skill_advisor/tests/skill-advisor-brief.vitest.ts` (producer-side) for OLD-string pins; migrate same way.

### Phase 5: Boundary + edge fixtures (REQ-009, REQ-001 fallback, REQ-007 guard)
- Add fixture: confidence ∈ {0.79, 0.80, 0.81} × uncertainty {at threshold, over threshold} = 6 cases.
- Add fixture: unknown safe-label (e.g. `topLabel = "no-such-skill"`) renders FIRST_ACTION_HINT_FALLBACK, NOT `undefined`.
- Add fixture: `passes_threshold:true ∧ uncertainty>T` to lock the producer invariant chosen in Phase 1.
- Add token-cap fixture: longest known label + longest hint exercise both DEFAULT_TOKEN_CAP and AMBIGUOUS_TOKEN_CAP without truncation.
- Manual review of action hints for domain alignment (REQ-006).

### Phase 6: Verification
- `npx vitest run skill_advisor/tests/render.vitest.ts` green.
- `npm run check` (lint + typecheck) green.
- Smoke test: invoke advisor brief manually with sample prompt; verify mandate wording + fallback path + uncertainty guard all behave.

## DEPENDENCIES

None. Self-contained.

## OUT OF SCOPE

Per parent 027 spec.md: ANY scorer/ directory changes (unless the producer-invariant route requires a single test in `scorer/tests/` only — explicit user approval needed before touching scorer-owned source).
