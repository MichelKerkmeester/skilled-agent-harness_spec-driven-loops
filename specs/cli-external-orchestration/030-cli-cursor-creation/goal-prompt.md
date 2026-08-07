# Goal Prompt — paste this to start the next session

Continue implementing cli-cursor (Cursor CLI, binary `cursor-agent`) as a new mode in the `cli-external-orchestration` hub.

Spec folder: `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation`. Read `handover.md` there first, then `spec.md` (phase map + 3 open questions), then `001-cursor-contract-pin/implementation-summary.md` (the live-verified Cursor facts everything else depends on).

Current state: phase 001 (contract-pin) is Complete for real — Cursor CLI is installed and its actual contract (hooks, config, permissions, models, auth) is live-verified, not assumed. Phases 002-007 are fully spec'd (spec.md/plan.md/tasks.md/checklist.md, +decision-record.md for 003/004) and validate 0 errors/0 warnings, but **none of them is implemented yet** — that's this session's job.

Do this in order:
1. Confirm `cursor-agent login` has been completed (interactive OAuth — only the operator can do this; ask if unsure). Several later phases need an authenticated session for live verification.
2. Implement phase 002 (`002-deep-loop-executor-support`): add `cli-cursor` as a new `EXECUTOR_KINDS` entry across `executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs` (new `buildCursorLineageCommand`), `dispatch-model.cjs`, `profile-validator.cjs`, and their tests. Follow the phase's own `tasks.md`/`checklist.md` exactly.
3. Implement phase 003 (`003-cli-cursor-skill-packet`): build `cli-external-orchestration/cli-cursor/` per `sk-doc create-skill`'s existing-hub checklist (already spelled out in the phase's `spec.md`), wire `mode-registry.json`/`hub-router.json`/`leaf-manifest.json`/hub `SKILL.md`. Read the 3 ADRs in `decision-record.md` first.
4. Implement phase 004 (`004-cursor-hook-adapter-layer`): thin adapters over `.cursor/hooks.json` for the repo's guard hooks. Live-verify per-event delivery before claiming any guard "active" (Cursor CLI reportedly doesn't fire every event — this is an open question, resolve it here).
5. Implement phase 005 (`005-cursor-model-registry-and-routing`): add a Composer model profile + `cli-cursor` executor rows; wire the CI gate. Composer's exact specs are auth-gated — only fill in what login confirms.
6. Implement phase 006 (`006-cursor-manual-testing-playbook`): author the Cursor-native scenario playbook (plan/ask modes, worktree isolation, cloud worker, MCP, shared hooks).
7. Implement phase 007 (`007-docs-agents-governance-and-closeout`): roster/governance/sibling-doc mentions (grep the current tree fresh, don't assume paths), then run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/030-cli-cursor-creation --recursive --strict` and confirm 0/0 across the whole packet including implementation-summary.md files.

Hard rules:
- **Commit after each phase passes its own `validate.sh <phase-folder> --strict`.** Don't batch commits to the end — this exact repo has repeatedly lost uncommitted spec work mid-session to concurrent file-sync activity. Only `git add` the specific phase folder, never `-A` or `.`.
- Don't touch `mode-registry.json`/`hub-router.json`/hub files until phase 003 explicitly calls for it.
- `cursor-agent -p` exits `0` even on auth failure — any availability guard must check `command -v cursor-agent` plus an explicit auth-state probe, never the exit code alone.
- Don't fabricate anything auth-gated (model roster, pricing, Composer specs) — mark genuinely-unconfirmable details "TBD — verify at implementation time," matching the discipline already used throughout this packet.
- Mirror `029-cli-devin-revival`'s sibling phases when a header-format or template question comes up — it's the closest precedent and already validates clean.
