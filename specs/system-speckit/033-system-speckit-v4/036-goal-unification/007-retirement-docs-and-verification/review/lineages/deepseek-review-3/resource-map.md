---
title: "Resource Map — Goal Unification Build (third pass)"
trigger_phrases: []
---
# Resource Map — Goal Unification Build (third pass)

Review-generated map (the target packet carried no `resource-map.md` at init, so the Resource Map Coverage Gate is skipped and this map stands in for the next reader). Status values: `reviewed` = opened at the cited lines; `reproduced` = exercised through the shipped module or CLI; `gap` = expected by the review scope but not reachable from this lineage.

## 1. Goal runtime (producer)

| Artifact | Role | Status | Evidence |
|---|---|---|---|
| `.opencode/hooks/goal/lib/goal-slice.cjs` | Shared extractor, projections, path containment, budget read, reminder text | reproduced | `extractDurableSlice` against the validator's copy over a 10-input matrix; symlink refusal re-verified |
| `.opencode/hooks/goal/lib/goal-core.cjs` | Scope resolution, locks, lifecycle, packet bind, resend, log append | reproduced | lock contention (40/40 across divergent state dirs), rebind archive, truncation report, hostile row, anchor-markup row; lock root at :902 (F301) |
| `.opencode/hooks/goal/bin/goal.cjs` | Runtime-neutral manage CLI | reproduced | `bind`, `log`, `set`, `packet` against fixture workspaces; the `packet` pre-check reproduced F307 |
| `.opencode/hooks/goal/README.md`, `goal-plugin.md` | Contract prose for the above | reviewed | three stale import-boundary sentences (F305); the `packet` example (F307); the state-dir override claim (F301) |

## 2. Goal runtime (consumers)

| Artifact | Role | Status | Evidence |
|---|---|---|---|
| `.opencode/plugins/opencode-goal.js` | Primary runtime: tool surface, injection, lifecycle | reproduced (via `__test`) + reviewed | shared `appendPacketLog` import (:26-27, called :3024); `bindGoal`/`mutateGoal` (F309); unknown-action error and `unbind`/`log` pinned by tests |
| `.opencode/hooks/goal/pi/goal-context.ts` | Pi adapter | reviewed | capability-aware reminder; `/goal-pi resent` |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | Cursor adapter | reviewed | reminder names a runnable command |
| `.opencode/hooks/goal/devin/goal-inject.mjs`, `.devin/hooks.v1.json` | Devin adapter and host wiring | reviewed | three same-field writers in one event (F310/F107) |
| `.cursor/commands/goal-cursor.md`, `.opencode/commands/goal-opencode.md` | Command surfaces | reviewed (goal-opencode at synthesis) | Cursor hint matches the session-free `packet` surface; the CLI workaround at `goal-cursor.md:27`; the OpenCode router lists the new `unbind`/`log`/`packet` actions consistently |

## 3. Validator and contracts

| Artifact | Role | Status | Evidence |
|---|---|---|---|
| `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` | Goal budget and binding rules | reproduced (dist export) | extractor matrix (F302), tolerant/strict parser split (F303), anchor parser (F308), the vitest parity case (F304) |
| `.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Rule levels and phase-parent detection | reviewed | frontmatter checks exclude goal.md from the unclosed-fence diagnostic; phase parents keep the budget |
| `.opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts` | Frontmatter variant ADR-003 names as the pin | reviewed | tolerant regex at :21; no golden test links it to `goal-slice.cjs` |
| `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json` | Budget manifest and measure | reviewed | `goalDurableBudget` thresholds match the validator's copy |
| `002-decisions-and-contract-freeze/decision-record.md` | Frozen ADRs | reviewed | ADR-002 (:162-165) re-verified against disk state; ADR-003's pin promise (:265) still unmet (F304) |

## 4. Command and packet documents

| Artifact | Role | Status | Evidence |
|---|---|---|---|
| `speckit-{plan,implement,complete}.yaml` `packet_goal` blocks | Executable goal instructions | reviewed | bind rule present in all three; the log carve-out undecidable (F306) |
| `.opencode/commands/speckit/save.md` | Save-path goal rule | reviewed | same log text at :61 |
| `007/spec.md`, `tasks.md`, `implementation-summary.md`, `goal.md` | Target packet and its completion claims | reviewed | every task and success criterion reconciled (iteration 5) |
| `008-hardening-research/implementation-summary.md` | Follow-on phase claims | reviewed | do-now list verified against code; the Devin limitation scope is stale (F310) |
| `036-goal-unification/goal.md` | Parent packet log | reviewed | rows for 004 through 008 with evidence |

## 5. Gaps

- Host-side behavior outside the repository: Devin's merge rule for the same-field writers (F107/F310), and the injection caps of Pi, Cursor and Devin, remain unrecorded.
- No run of `validate.sh` from this lineage (write-surface rule); the validator's rules were exercised through their exported functions and the shipped dist.
- The plugin's tool path was exercised through its `__test` seam rather than a live OpenCode host; the rebind archive absence was proven by enumerating every archive call site.
