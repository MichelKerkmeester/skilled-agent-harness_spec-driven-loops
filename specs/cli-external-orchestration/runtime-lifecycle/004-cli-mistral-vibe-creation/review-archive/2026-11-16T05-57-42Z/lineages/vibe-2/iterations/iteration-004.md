# Review Iteration 004

## Dispatcher

- Mode: review (fan-out lineage `vibe-2`)
- Session: `fanout-vibe-2-1794765851303-zrv85l`, generation 1, lineageMode `new`
- Dimension: maintainability
- Review target: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation` (spec-folder)
- Operator review focus: phases 013-022 and the 2026-11-15 fixes. This iteration addresses the focus by holding the operator-facing documentation against the code the 2026-11-15 tier changed: the goal adapter README, the session-lifecycle README, the `guards-and-hooks.md` reference, and phase 013's style claims. The open lead is a documentation problem as much as a code one, because the doc that owns the goal slice denies the mechanism the lead is about.
- Sources read this iteration: `steer.md` (absent), `.skilled/hooks/goal/vibe/README.md:1-42`, `.skilled/hooks/session-lifecycle/vibe/README.md:1-61`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:1-258`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:191-252`, `.skilled/hooks/session-handover/vibe/handover-parts.mjs:66-70,183-193,280-294`, `.vibe/hooks.toml:1-152`, `013-vibe-audit-fixes/{goal.md,plan.md,spec.md,tasks.md}`, `git log` for the three doc paths.

## Files Reviewed

- `.skilled/hooks/goal/vibe/README.md:1-42`
- `.skilled/hooks/session-lifecycle/vibe/README.md:1-61`
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:1-258`
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:191-252`
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:66-70,183-193,280-294`
- `.vibe/hooks.toml:1-152`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/013-vibe-audit-fixes/goal.md:97`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/013-vibe-audit-fixes/tasks.md:69,73`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The goal adapter's README states that nothing re-injects the slice after compaction, while the compaction detector calls that adapter on every new compaction** -- `.skilled/hooks/goal/vibe/README.md:21` -- the paragraph reads "Nothing refreshes the slice per turn, and nothing re-injects it after compaction, because Vibe has no idle or compaction event." The detector does exactly that: `compaction-context.mjs:25` imports `renderVibeGoalSlice`, `:205` takes it as the `goalSlice` dependency, and `:243` calls `goalSlice({ env, workspace })` and puts the result in the returned context. The frontmatter description at `:3` repeats the omission ("for the one session_start hook to inject"), and `guards-and-hooks.md:134`'s `opencode-goal.js` row lists only `session_start` as the Vibe event. History confirms the drift rather than a misreading: `git log -- .skilled/hooks/goal/vibe/README.md` shows the file was last touched by `dbf713f64cf` and before that by the initial feature commit `36ddad5062d`, so neither the phase-018 compaction work nor the `e5b8611a4fa` hand-over tier ever revised it.
   Finding class: maintainability
   Scope proof: the README and the detector are both inside the declared review target; the detector's call site is the code the README describes.
   Affected surface hints: `.skilled/hooks/goal/vibe/README.md`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`
   Case: an operator debugging the open lead opens the goal adapter's own README to ask whether the slice survives a compaction, reads that it does not, and rules out the mechanism that is actually responsible before reading any code.
   ```json
   {"type":"claim","claim":"The goal adapter README denies the compaction re-injection that compaction-context.mjs:243 performs, and the reference doc's plugin row agrees with the README.","evidenceRefs":["goal/vibe/README.md:3","goal/vibe/README.md:21","compaction-context.mjs:25","compaction-context.mjs:205","compaction-context.mjs:243","guards-and-hooks.md:134"],"counterevidenceSought":"Looked for a later revision of the README (git log shows none after the initial feature commit), for a second doc that states the re-injection correctly (session-lifecycle/vibe/README.md:25 does), and for a reading of 're-injects it' that excludes the detector (the sentence names compaction explicitly, so no).","alternativeExplanation":"The author may have meant 'no per-turn refresh', which is true; but the same sentence asserts the compaction case, and two of the three docs that describe the goal slice repeat the wrong version.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if the README is amended in the same change that fixes R1-P1-001, since the two edits touch the same behaviour."}
   ```

### P2 Findings

1. **The reference doc's Status paragraph still describes `.vibe/hooks.toml` as the guard bundle plus one `session_start` entry, while the file declares 18 entries** -- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:37` -- the sentence reads "`.vibe/hooks.toml` declares the guard bundle under `.vibe/plugins/repo-guards/` and one `session_start` entry for the goal and context hook." `grep -c '^\[\[hooks\]\]' .vibe/hooks.toml` returns 18, and the names include `turn-start` (`:16`), `turn-end` (`:26`), `compaction-post-tool` (`:125`), `decision-capture-ask` (`:133`), `classifier-injection-screen` (`:116`) and two `dist-freshness` entries (`:99`, `:108`) that are not guards and not `session_start`. The paragraph survived the `e5b8611a4fa` doc pass, which did touch this file.
   Finding class: maintainability
   Scope proof: the reference doc is the named integration surface for the hook registration, and `.vibe/hooks.toml` is the file it describes.
   Affected surface hints: `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`, `.vibe/hooks.toml`
   Case: a maintainer reads section 1 to learn what the project hook file contains, concludes it holds guards plus one context entry, and does not look for the `pre_agent` and `post_agent` composers that the rest of the document depends on.

2. **The same paragraph claims every section-4 row names the run that proved it, while five of the seventeen `hook` rows name a run** -- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:37` -- the sentence reads "Each row in section 4 names the run that proved it." Counting the `hook` verdict rows: `system-dist-freshness-guard` names "phase 015's keyed child run", `system-skill-advisor` "phase 015's keyed main-session run", `ask-surface-guard` "phase 016's ten fixture cases", `system-completion-sentinel` "phase 016's fixture suite and print-mode smoke run", and `decision-capture` "phase 017's fixture suites". The other twelve, including `session-handover` and `opencode-goal`, name no run.
   Finding class: maintainability
   Scope proof: the claim and the table it describes are both in the reference doc inside the review target.
   Affected surface hints: `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`
   Case: an auditor trusts the paragraph, treats every section-4 row as run-backed, and reports the hand-over and goal rows as verified when they are source readings.

3. **The session-lifecycle README counts six kill switches, and the two parts behind the open lead have none** -- `.skilled/hooks/session-lifecycle/vibe/README.md:29` -- the paragraph reads "Six switches turn parts off" and lists `SYSTEM_SESSION_LIFECYCLE_DISABLED`, `SYSTEM_DIST_FRESHNESS_DISABLED`, `SYSTEM_SESSION_CLEANUP_DISABLED`, `SYSTEM_SKILL_ADVISOR_DISABLED`, `SYSTEM_COMPLETION_DISABLED` and `SYSTEM_ASK_SURFACE_DISABLED`. `grep -n process.env` over `compaction-context.mjs` returns only the two dependency defaults at `:200` and `:297`, and over `compaction-post-tool.mjs` returns nothing, so the compaction detector and its `post_tool` binding cannot be turned off. `handover-parts.mjs` reads the environment only through `dependencies.env` at `:187` and `:287`, and its one gate is `handoverEnabled` at `:66`, which is the feature switch rather than a part switch.
   Finding class: maintainability
   Scope proof: the README, the detector, the binding and the hand-over part are all inside the declared review target.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/README.md`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs`, `.skilled/hooks/session-handover/vibe/handover-parts.mjs`
   Case: an operator trying to isolate the open lead on a live session has no switch for the compaction re-injection or the hand-over part, so the only way to bisect is to edit `.vibe/hooks.toml` in the checkout under test.

4. **The session-lifecycle README states the watermark-before-build order and the journal-size-only gate as the contract, so the fixes for R1-P1-001 and R1-P1-002 will read as regressions** -- `.skilled/hooks/session-lifecycle/vibe/README.md:25` -- the paragraph reads "on a new one the detector writes the watermark first, advances the advisor directive receipt ... and returns the goal slice and the open handoff note pointer", and "it sums the journal files' sizes, returns nothing when the size is unchanged". Both sentences describe the two defects iteration 1 raised: the watermark is written at `compaction-context.mjs:231` before the text is built at `:241-252`, and the size gate at `:271-282` watches only `journal/*.jsonl`. The file was revised by `e5b8611a4fa`, so the wording is current rather than stale.
   Finding class: maintainability
   Scope proof: the README and the detector are both inside the declared review target.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/README.md`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs`
   Case: a maintainer fixes the watermark order, the README now contradicts the code, and the next reviewer reads the diff as a behaviour change against a documented contract.

5. **The goal-fallback comment added by the 2026-11-15 fix is wrapped past the file's own width, and one template literal in the turn-start composer is 148 characters** -- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:747` -- the comment block at `:745-748` wraps at roughly 85 characters for its first two lines and then runs to 123 on the third, breaking mid-clause ("A log read only in part cannot rule out a goal that" / "ended earlier"). Separately, `turn-start.mjs:82` is a 148-character template literal, the only non-box line over 120 in the Vibe hook surface. Phase 013 set 120 as the convention for the files it touched (`tasks.md:69,73` both verify with `awk 'length > 120'`), and the box-drawing headers are the documented exception.
   Finding class: maintainability
   Scope proof: both files are inside the declared review target, and the convention is recorded in the packet's own phase 013.
   Affected surface hints: `.skilled/hooks/session-handover/lib/relaunch-core.cjs`, `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`
   Case: a maintainer editing the goal fallback re-wraps the block to the surrounding width and produces a diff that mixes a formatting change with the behaviour change it was meant to isolate.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Carried from iterations 1 and 2. Phase 018's spec promises the slice is re-injected after a compaction; the code does it (`compaction-context.mjs:243`) and the goal adapter's README denies it (R4-P1-001). |
| `checklist_evidence` | core | notApplicable | No phase in 013-022 carries a `checklist.md`; evidence lives in `tasks.md` checkboxes. |
| `skill_agent` | overlay | pass | Carried from iteration 2. |
| `agent_cross_runtime` | overlay | pass | Carried from iteration 2. |
| `feature_catalog_code` | overlay | pending | Deferred to the cross-reference iteration. |
| `playbook_capability` | overlay | partial | Carried from iteration 2. |

## Integration Evidence

- `.vibe/hooks.toml:1-152` was read in full to count the declared entries: 18 `[[hooks]]` blocks, of which `turn-start` (`:16`), `turn-end` (`:26`), `compaction-post-tool` (`:125`) and `session-start` (`:142`) are the four the session-lifecycle README describes.
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:66-70,183-193,280-294` was read to confirm the hand-over part's only gate is `handoverEnabled`, which reads `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED` and the master switch rather than a per-part switch.
- `git log --oneline` over the three doc paths established which revision last touched each: `goal/vibe/README.md` predates both the compaction work and the hand-over tier, while `session-lifecycle/vibe/README.md` and `guards-and-hooks.md` were both revised by `e5b8611a4fa`.

## Edge Cases

- The `guards-and-hooks.md:37` sentence "Each row in section 4 names the run that proved it" can be read as scoped to the phases-014-to-019 list that precedes it rather than to the whole table. The narrower reading would make the claim true for the five rows it names. Severity is held at P2 under the wider reading, and the finding carries a `downgradeTrigger` for the narrower one.
- The 120-column convention is recorded in phase 013 for the files that phase touched, not as a repository-wide rule. R4-P2-005 is scoped to the two files whose own surrounding code already wraps at that width, and the box-drawing headers are excluded from the count.
- `goal/vibe/README.md` is a runtime-mirror-adjacent doc under `.skilled/hooks/`, not a mirror itself. It is treated as a review target because the packet's phase 011 and 018 both own it.

## Confirmed-Clean Surfaces

- Phase 013's single-source claim holds: `grep -rn VIBE_SESSION_FREE_FLAGS .skilled/hooks/dispatch/lib/` names `dispatch-audit.mjs:357` as the only definition, with `dispatch-rule-checks.mjs:26,486` importing it, and `VIBE_SESSION_FREE_SUBCOMMANDS` behaves the same at `dispatch-audit.mjs:356`. `goal.md:97`'s claim is accurate.
- The `session-handover.js` row at `guards-and-hooks.md:134` is accurate on the switches it names: `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED` exists and gates the part through `handoverEnabled` (`handover-parts.mjs:66,193,294`), and `SESSION_HANDOVER_WINDOW_TOKENS` is the documented override.
- `goal/vibe/README.md:30-32` names a test file that exists (`goal-vibe.test.mjs`) and a command that matches the repository's `node --test` convention.
- The `session-lifecycle/vibe/README.md:37-43` per-file table matches the code on every row: the event, the part order and the error behaviour all agree with `turn-start.mjs:92-101`, `turn-end.mjs` and `compaction-post-tool.mjs:56-84`.

## Ruled Out

- **The line-length convention is violated across the Vibe hook surface.** Ruled out: the 14 to 10 over-width lines per file are box-drawing comment rules (`// ─────`), which phase 013 treats as a separate style item. Only two non-box lines exceed 120, and they are R4-P2-005.
- **The `guards-and-hooks.md` plugin table misclassifies a plugin.** Ruled out: the 21 rows match the 21 files in `.opencode/plugins/`, and the three `not needed` verdicts each name the reason.
- **The session-lifecycle README's part order is wrong.** Ruled out: `turn-start.mjs:92-101` composes completion, compaction, advisor, save nudge and hand-over in exactly the order the README states.
- **The goal adapter README's test command is stale.** Ruled out: `goal-vibe.test.mjs` exists beside the adapter and the command matches the repository convention.

## Next Focus

- Dimension: cross-reference
- Focus area: the `feature_catalog_code` overlay, which is still `pending`, plus a re-check of the three carried P1 findings against the current files.
- Reason: four dimensions are complete and the overlay is the last unchecked protocol; the carried P1s need one confirmation pass before synthesis.
- Rotation status: correctness, traceability, security and maintainability complete; cross-reference is the final iteration.
- Blocked/productive carry-forward: productive — the maintainability pass produced the first P1 that is a documentation defect rather than a code defect.
- Required evidence: `file:line` in `feature-catalog/` beside the `file:line` of the code it claims to describe, and a fresh read of `compaction-context.mjs:219-252` for the carried P1.
- Recovery note: not applicable.

Review verdict: CONDITIONAL
