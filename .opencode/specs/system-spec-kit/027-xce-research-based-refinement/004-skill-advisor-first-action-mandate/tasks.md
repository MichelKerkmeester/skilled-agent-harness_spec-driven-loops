---
title: "Tasks — 027/004 skill advisor first-action mandate"
description: "Per-file tasks for the render.ts mandate strengthening."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 027/004 skill advisor first-action mandate

<!-- SPECKIT_LEVEL: 1 -->

## P0
| # | Task | File | Done |
|---|------|------|------|
| T1 | Add `FIRST_ACTION_HINT` constant map + `FIRST_ACTION_HINT_FALLBACK` | `mcp_server/skill_advisor/lib/render.ts` (edit, +20 LOC) | [ ] |
| T2 | Update `capText` at lines 149-152 (ambiguous case) — fallback hint via `??` | same file (+5 LOC) | [ ] |
| T3 | Update `capText` at lines 155-158 (normal case) — fallback hint via `??` | same file (+5 LOC) | [ ] |
| T4 | Verify confidence ≥0.8 gate at 124-133 unchanged | same file | [ ] |
| T5 | Verify capText safety net unchanged | same file | [ ] |
| **T-004A** | Add high-uncertainty `passes_threshold` fixture | `skill_advisor/tests/render.vitest.ts` (edit) | [ ] |
| **T-004B** | Add 0.79 / 0.80 / 0.81 inclusive-threshold fixtures × {uncertainty at, over T} (REQ-009) | same | [ ] |
| **T-004C** | Add unknown-safe-skill-label fallback-hint fixture (REQ-001) | same | [ ] |
| **T-004D** | Rewrite renderer + producer exact-string tests for mandate wording (REQ-008) | `render.vitest.ts` + `skill-advisor-brief.vitest.ts` | [ ] |
| **T-004E** | Add longest-label + longest-hint token-cap fixtures (REQ-004) | `render.vitest.ts` | [ ] |

## P0 — Tests + Verification
| # | Task | File | Done |
|---|------|------|------|
| T6 | Update render.vitest.ts: assert "MUST invoke" + hint shape | `mcp_server/skill_advisor/tests/render.vitest.ts` (edit) | [ ] |
| T7 | All known skills covered in `FIRST_ACTION_HINT` (test assertion) | same | [ ] |
| T8 | `npx vitest run skill_advisor/tests/render.vitest.ts` green | terminal | [ ] |
| T9 | `npm run check` green | terminal | [ ] |
| T10 | Manual review: action hints reflect each skill's domain (REQ-006) | spec author | [ ] |
| T11 | Write `implementation-summary.md` with file:line evidence | new | [ ] |
