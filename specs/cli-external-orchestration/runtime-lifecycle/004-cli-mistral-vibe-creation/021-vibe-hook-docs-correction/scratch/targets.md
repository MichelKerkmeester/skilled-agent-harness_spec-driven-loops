# T001 - Target anchors at the start of the phase

Anchors are the text that identifies each line, so a later edit can find it after the
line numbers drift. The line number is the one in this checkout at the time of the read.

## Guard reference

- TGT-01 `guards-and-hooks.md:13` frontmatter `version: 1.2.0.0`.
- TGT-02 `guards-and-hooks.md:37` the Status paragraph sentence `The rest of this file is a source reading ... phase 011 builds the goal and context hooks.`
- TGT-03 `guards-and-hooks.md:43` the Evidence Base table, first row `The seven types, the strict set, the hook fields and the default timeout`.
- TGT-04 `guards-and-hooks.md:65` the `post_agent` row: `Nothing that holds the turn`.
- TGT-05 `guards-and-hooks.md:74` the `What strict Buys` prose: `while post_agent always accepts the turn`.
- TGT-06 `guards-and-hooks.md:128` the `system-dist-freshness-guard.js` row: `the mid-session refresh after an edit has no seam`.
- TGT-07 `guards-and-hooks.md:129` the `system-skill-advisor.js` row: `Vibe has no per-prompt system transform`.
- TGT-08 `guards-and-hooks.md:130` the `ask-surface-guard.js` row: `not portable - it stops a turn`.
- TGT-09 `guards-and-hooks.md:131` the `system-completion-sentinel.js` row: `not portable - it stops a turn`.
- TGT-10 `guards-and-hooks.md:132` the `session-relaunch.js` row: `not portable - Vibe has no idle or compaction event`.
- TGT-11 `guards-and-hooks.md:133` the `session-history-lookup.js` row: `it arms on session.compacted`.
- TGT-12 `guards-and-hooks.md:135` the `decision-capture.js` row: `which Vibe has no equivalent of`.
- TGT-13 `guards-and-hooks.md:140` the paragraph beginning `Phase 008 builds the ten hook rows`.
- TGT-14 `guards-and-hooks.md:158-164` the `What Is Not Portable` heading and its five bullets.
- TGT-15 `guards-and-hooks.md:238` the `post_agent cannot be strict` row of the section 5 table.

## Comment and index lines

- TGT-16 `.vibe/plugins/repo-guards/spec-gate-classify.mjs:42-43` the comment `a deny does not exist on this event`.
- TGT-17 `cli-mistral-vibe/SKILL.md:145` the matrix line `the UNKNOWN wire format`.
- TGT-18 `cli-mistral-vibe/README.md:110` the tree line `the UNKNOWN wire format`.
- TGT-19 `cli-mistral-vibe/SKILL.md:65` the short dispatch block, which chains no render step.

## Supporting docs

- TGT-20 `.skilled/commands/speckit/save.md:23` the runtime list `claude, codex, opencode, pi, devin, dsh or cursor`.
- TGT-21 `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md:33` the Sweeps paragraph, which names every sweep but `sweep-vibe.mjs`.
- TGT-22 `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md:69` the Source Files table, which ends at `sweep-dsh.mjs`.
- TGT-23 `.skilled/hooks/README.md:323` the coverage-matrix header `| Concern | Claude | Codex | Cursor | Devin | OpenCode | Pi | DSH |`.
- TGT-24 `.skilled/hooks/README.md:328` the `decision-capture` coverage row.
- TGT-25 `.skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs:10` the pinned `RUNTIMES` list.
- TGT-26 `.skilled/skills/cli-external-orchestration/feature-catalog/mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md:33` the `Enforcement` section, which names no hook entry.
- TGT-27 `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:498-506` the Mistral Vibe run surface, which lacks `MISTRAL_VIBE_SESSION_ROOT`.
