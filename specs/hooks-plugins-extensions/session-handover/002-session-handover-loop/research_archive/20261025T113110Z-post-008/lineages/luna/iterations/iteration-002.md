# Iteration 2: Runtime adapter parity and packet metadata

## Focus

Compare runtime adapter nudge decisions with the documented runtime behavior, then follow up on the packet's worktree amendment across its durable records.

## Actions Taken

- Read the shared session-relaunch README and the Codex/Hermes and Pi/OpenCode manual-testing playbooks.
- Compared the Claude, Codex, Hermes, Pi and OpenCode nudge paths and their host-specific delivery points.
- Searched the current parent and phase 008 goal/spec records for the old and amended worktree values.
- Read adapter test sources for coverage context. Tests were not run.

## Findings

1. **LUNA-R2-001 — The parent spec still records the superseded worktree (CONFIRMED).** Evidence: the parent spec's Branch field still says `worktrees/142-session-relaunch-loop`, while the parent goal log records the amendment to `worktrees/148-session-relaunch-deep-review` and phase 008's durable decision binds worktree 148. Fix the Branch field in the parent spec to worktree 148 and reconcile any remaining active packet metadata with that amendment. [SOURCE: specs/hooks/023-session-relaunch-loop/spec.md:34] [SOURCE: specs/hooks/023-session-relaunch-loop/goal.md:131] [SOURCE: specs/hooks/023-session-relaunch-loop/008-review-3-remediation/goal.md:46]
2. **LUNA-R2-002 — The runtime adapters repeat the nudge policy orchestration (INFERRED refinement).** The inspected adapters independently apply the fill threshold, pending-handoff and hop-cap suppression, nudge-level decision, note planning, persisted-state update and handoff-text construction; Pi and OpenCode then add different deferred-delivery state. This is not evidence of a current policy mismatch, but it makes future policy changes easy to apply unevenly. Extract a shared policy preparation function that accepts normalized usage, session, cwd and runtime inputs and returns a decision plus handoff text; keep host event parsing and delivery timing in each adapter, and add a table-driven parity contract for the common decision. [SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:92-113] [SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:100-130] [SOURCE: .skilled/hooks/session-relaunch/hermes/context-nudge.mjs:73-99] [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:306-350] [SOURCE: .opencode/plugins/session-relaunch.js:124-168]

## Questions Answered

- **Do runtime adapters translate usage, session identity and relaunch decisions consistently?** The host-specific usage and identity inputs differ, while the inspected adapters share the threshold, pending-handoff, hop-cap and next-level checks. Pi and OpenCode defer delivery through their host lifecycle. This is a source comparison; no runtime tests were run.

## Workflow Conflicts

- The dispatcher requires `findingsCount` on each canonical iteration state row. The deep-research state projection reconstructs its legacy delta row from ledger fields and explicitly omits fields lost during upcast, including `findingsCount`; the legacy upcaster stores status and new-info ratio but not the count. Direct state-log writes are forbidden by the deep-research contract, so the iteration event will carry the count into the append gateway and the delta file will carry one row per finding, but the gateway-projected state row may omit that count. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-deltas-contract.ts:78-83] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:386-396] [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:269-274]
- The append gateway was called three times with the checked lineage and event paths. Each call receipted an iteration-completed event but failed projection with `PROJECTION_FAILED` because replacement would drop keys from the existing config row; the root state log remains at its pre-iteration contents. The projection guard compares the existing and projected config-row keys, so another identical retry cannot repair this row. Continue the research and retain the findings in the lineage delta artifacts; do not bypass the gateway with a direct state-log write. [SOURCE: specs/hooks/023-session-relaunch-loop/research/lineages/luna/gateway-refusals.jsonl:1-3] [SOURCE: specs/hooks/023-session-relaunch-loop/research/lineages/luna/deep-research-state.jsonl:1-2] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/shadow-projection-store.ts:204-233]

## Questions Remaining

- Does skilled-loop preserve handoff, claim, save, resume and relaunch behavior under failures?
- Do tests cover the public behavior and edge cases claimed by docs and specs?
- Which document, spec-record or standards gaps need correction?

## Next Focus

Trace skilled-loop and the handoff CLI through decline, failure, signal and recovery paths, then compare those transitions with their tests and documented outcomes.
