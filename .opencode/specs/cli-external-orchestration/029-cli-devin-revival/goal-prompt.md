# Goal Prompt — paste this to start the next session

Continue implementing cli-devin (Devin CLI, binary `devin`) revival across the remaining 8 phases in the `cli-external-orchestration` hub.

Spec folder: `.opencode/specs/cli-external-orchestration/029-cli-devin-revival`. Read `spec.md` first (parent — phase map, transition rules, open questions), then `001-devin-contract-pin/implementation-summary.md` (the live-verified Devin facts everything else depends on).

Current state: phase 001 (contract-pin) is Complete — Devin CLI v3000.2.17 is installed, `devin auth login` is done (Devin Pro tier, logged in), and its real 4-mode permission contract (`auto`/`accept-edits`/`smart`/`dangerous`, corrected 2026-07-24 from a wrong docs-sourced name set) is live-verified. Phases 002-009 are all fully spec'd (spec.md/plan.md/tasks.md/checklist.md, +decision-record.md for 003/004/008/009) and validate 0/0, but **none is implemented yet**.

Numbering note: 008/009 were added after 002-007 existed. Their real Predecessor isn't the prior-numbered phase — 008 depends only on 004, 009 only on 001. Parent `spec.md`'s Phase Transition Rules say this; don't let folder numbers imply a dependency that isn't real.

Order (or jump to step 8 first — 009 only needs already-Complete 001):
1. `002-deep-loop-executor-support` (L2/P0): widen `EXECUTOR_KINDS` to 5 across `executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs` (new `buildDevinLineageCommand`), `dispatch-model.cjs`, `profile-validator.cjs` + tests. 3 open questions need live confirmation, never invented: Devin's session-id env var, `SandboxMode`→`--sandbox` mapping, whether `EXECUTOR_ENV_PREFIXES_BY_KIND` needs `DEVIN_` alongside `COGNITION_`.
2. `003-cli-devin-skill-packet`: build `cli-external-orchestration/cli-devin/` per `sk-doc create-skill`, wire `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`. Owns the self-invocation guard design (packet-owned, non-negotiable per the hub `SKILL.md`).
3. `004-devin-hook-adapter-layer`: first 2 of 8 lifecycle hooks (`SessionStart`, `UserPromptSubmit`). Live-verify against the now-authenticated `devin` session.
4. `005-devin-model-registry-and-quota`.
5. `006-devin-manual-testing-playbook`.
6. `007-docs-agents-governance-and-closeout`: roster/governance mentions — grep the tree fresh, don't assume paths.
7. `008-devin-hook-parity`: remaining 6 hook adapters + `task-dispatch-guard.cjs` + `PostCompaction`/`SessionEnd` decisions. Needs 004 done first; live session for verification.
8. `009-devin-mcp-host-integration`: register the 3 repo MCP servers via `devin mcp add`, two-tier deny-by-default policy. Only needs 001 — buildable independently.

Hard rules:
- **Commit after each phase passes its own `validate.sh <phase-folder> --strict`.** This repo has repeatedly lost uncommitted spec work to concurrent multi-session file-sync activity, reconfirmed this same day. `git add` the specific phase folder only, never `-A`/`.`.
- `PHASE_LINKS` is a substring grep for the numerically-adjacent phase name in each `spec.md`, not the Predecessor/Successor field. If a phase's real dependency isn't its numeric neighbor (008, 009), add a one-line "sequential-numbering neighbor only, not a dependency" cross-reference to satisfy it without misstating the real one.
- `description.json`/`graph-metadata.json` are never hand-authored: `generate-description.js <folder> <base-path>` then `backfill-graph-metadata.js <folder-relative-to-.opencode/specs>` — content edits BEFORE generating, never after (else `SOURCE_FINGERPRINT_MISMATCH`).
- Don't invent Devin facts needing live confirmation — mark "TBD — verify at implementation time" like the rest of the packet does.
- Final gate: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/029-cli-devin-revival --recursive --strict` → 0/0 across the parent + all 9 phases, incl. each `implementation-summary.md`.
