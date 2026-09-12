---
title: "Resource Map — Goal Unification Build (second pass)"
trigger_phrases: []
---
# Resource Map — Goal Unification Build (second pass)

Review-generated map (the target packet carried no `resource-map.md` at init, so the Resource Map Coverage Gate is skipped and this map stands in for the next reader). Status values: `reviewed` = opened at the cited lines; `reproduced` = exercised through the shipped module or CLI; `gap` = expected by the review scope but not reachable from this lineage.

## 1. Goal runtime (producer)

| Artifact | Role | Status | Evidence |
|---|---|---|---|
| `.opencode/hooks/goal/lib/goal-slice.cjs` | Shared extractor, projections, path containment, budget read, reminder text | reproduced | `extractDurableSlice` and `readPacketGoal` exercised; tolerant fence and symlink refusal verified |
| `.opencode/hooks/goal/lib/goal-core.cjs` | Scope resolution, locks, lifecycle, packet bind, resend, log append | reproduced | `bindGoal`, `appendGoalLog`, `setGoal` and the lock path exercised through the CLI and as a module |
| `.opencode/hooks/goal/bin/goal.cjs` | Runtime-neutral manage CLI | reproduced | `bind`, `log`, `set`, `packet` run against a fixture workspace |
| `.opencode/hooks/goal/README.md`, `goal-plugin.md` | Contract prose for the above | reviewed | lock claim, injection claim, env table, runtime matrix |

## 2. Goal runtime (consumers)

| Artifact | Role | Status | Evidence |
|---|---|---|---|
| `.opencode/plugins/opencode-goal.js` | Primary runtime: tool surface, injection, lifecycle | reproduced (via `__test`) | `bindGoal`, `executeGoalAction`, `renderGoalInjection` exercised |
| `.opencode/hooks/goal/pi/goal-context.ts` | Pi adapter: input injection, session start, turn end | reviewed | reminder append and fail-open handlers |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | Cursor adapter: session-start injection | reviewed | brief plus reminder envelope |
| `.opencode/hooks/goal/devin/goal-inject.mjs`, `.devin/hooks.v1.json` | Devin adapter and host wiring | reviewed | two hooks emitting one envelope key (F107) |
| `.cursor/commands/goal-cursor.md`, `.opencode/commands/goal-opencode.md` | Command surfaces | reviewed | hint and action list match the fail-closed contracts |

## 3. Validator and contracts

| Artifact | Role | Status | Evidence |
|---|---|---|---|
| `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` | Goal budget and binding rules | reproduced (dist export) | goal slice measured against the runtime slice (F102) |
| `.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Rule levels and phase-parent detection | reviewed | `detectLevel` returns `phase` for a phase parent |
| `.opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts` | Frontmatter regex ADR-003 names as the pin | reviewed | tolerant regex; no golden test links it to `goal-slice.cjs` |
| `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json` | Budget manifest and measure | reviewed | `goalDurableBudget.measure` vs the validator's copy |
| `002-decisions-and-contract-freeze/decision-record.md` | Eight frozen ADRs | reviewed | ADR-001, -002, -003, -004, -005, -006 read at their decision and constraint lines |

## 4. Command and packet documents

| Artifact | Role | Status | Evidence |
|---|---|---|---|
| `speckit-{plan,implement,complete}.yaml` `packet_goal` blocks | Executable goal instructions | reviewed | log rule offers an unsynchronized append (F104) |
| `speckit-resume-{auto,confirm}.yaml` | Read-only resume surfaces | reviewed | no goal mutation, `never_halts` present |
| `AGENTS.md` section 4 and Quick Reference row | Always-on posture | reviewed | block and row present; no drift found |
| `007/spec.md`, `007/goal.md`, `007/tasks.md`, `007/implementation-summary.md` | Target packet and its completion claims | reviewed | fix claims reconciled (F106; F103) |
| `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`, `specs/hooks/009-goal-isolation/spec.md` | Release and requirement claims | reviewed | Devin paragraphs and REQ-010 now agree |

## 5. Gaps

- Host-side behavior outside the repository: Devin's merge rule for two `additionalContext` emitters (F107) and the injection caps of Pi, Cursor and Devin remain unrecorded.
- No run of `validate.sh` from this lineage (write-surface rule); the validator's measurement was exercised through its exported function instead.
- The plugin's `bind` tool path could not be compared field-for-field because the probe context carried no session id; the exported `bindGoal` was compared instead.
