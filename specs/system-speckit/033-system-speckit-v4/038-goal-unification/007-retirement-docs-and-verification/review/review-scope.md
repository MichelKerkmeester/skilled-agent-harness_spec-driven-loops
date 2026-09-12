# Review scope: goal unification build

Review these surfaces for correctness, regressions and contract drift. Read the decision record at
`specs/system-speckit/033-system-speckit-v4/036-goal-unification/002-decisions-and-contract-freeze/decision-record.md`
first; every finding must cite file:line and name the decision it bears on.

- `.opencode/hooks/goal/lib/goal-slice.cjs` and `goal-core.cjs` (packet binding, resend hash, locked log append, render path)
- `.opencode/hooks/goal/bin/goal.cjs` (bind, unbind, resent, log, packet actions)
- `.opencode/hooks/goal/pi/goal-context.ts`, `cursor/goal-inject.mjs`, `devin/goal-inject.mjs`
- `.opencode/plugins/opencode-goal.js` (bindGoal, noteResent, packet action, renderGoalInjection, normalizeStoredGoal)
- `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` and `lib/templates/level-contract-resolver.ts` (goal budget and binding diagnostics)
- `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl`, `templates/spec-kit-docs.json`, `references/workflows/goal-set-string-playbook.md`
- `.opencode/commands/speckit/assets/speckit-{plan,implement,complete,resume-auto,resume-confirm}.yaml`, `.opencode/commands/goal-opencode.md`, `.cursor/commands/goal-cursor.md`
- `AGENTS.md` section 4 GOAL POSTURE RULE and the Quick Reference row

Dimensions: frontmatter leak paths, concurrency on the packet log, path escape on bind, plugin and core drift, budget arithmetic, the no-halt posture wording. Write findings only; change no files outside this review directory.

## Second pass (five iterations)

The first pass's five P1 findings were fixed and four P2 were fixed; read `lineages/deepseek-review/review-report.md` first and do not re-report a fixed finding unless the fix is wrong. Go deeper on: concurrency between two sessions on one packet, the plugin versus core parity (labels, caps, keying, the `set` on a bound record), the validator's measurement against the extractor's, the speckit YAML `packet_goal` blocks as executable instructions, the reminder's effect on prompt budgets, and the devin adapter. Report only findings you reproduced or read at the cited line.

## Third pass (five iterations)

Read `lineages/deepseek-review/review-report.md` and `lineages/deepseek-review-2/review-report.md` first; every P1 and six of seven pass-2 P2s were fixed in phase 008 (`../008-hardening-research/implementation-summary.md` lists what changed and what was deferred). Do not re-report a fixed finding unless the fix is wrong. Go deeper on what phase 008 touched: the packet lock now under the workspace state root keyed on the real path (`goal-core.cjs` appendPacketLog), the record-free append the plugin calls, the rebind-archives guard, `packet_state` and its hint, the CR and fence normalization in both extractors, the offer-path bind rule in the three workflow YAMLs, the plugin's `unbind`, `log` and unknown-action error, the capability-aware reminder text on all four adapters, and the text-set truncation warning. Also probe the deferred rows: the duplicated envelope aliases and the unused plugin timestamp, and say whether deferring them was right. Report only findings you reproduced or read at the cited line.
