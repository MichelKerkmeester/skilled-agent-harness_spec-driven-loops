---
title: "Iteration 2: Integration — Where the Shipped Pieces Still Do Not Meet"
trigger_phrases: []
---
# Iteration 2: Integration — Where the Shipped Pieces Still Do Not Meet

## Focus

Charter angle 2. Trace every seam between the pieces that shipped separately: the speckit lifecycle YAML's bind table versus the steps that actually run, the save workflow's log instruction versus the core's locked append, the plugin's action surface versus the CLI's and the core's, the two runtimes with no adapter at all, and the retrieval vocabulary that is supposed to lead an operator to the contract. Rank each seam by how often an operator would hit it.

## Actions Taken

1. Read the `goal_prompting` and `packet_goal` blocks of `speckit-plan.yaml` (:141–215), `speckit-implement.yaml` (:106–175) and `speckit-complete.yaml` (:199–245), and grepped every `bind` occurrence across the three.
2. Compared the plugin's action surface (`GOAL_ACTIONS`, dispatch switch) against the core's `ACTIONS` and the CLI's dispatch switch.
3. Read the save workflow's goal instruction (`commands/speckit/save.md:61`) against the core's locked append.
4. Confirmed the absence of any goal adapter under `.claude/hooks/` and `.codex/hooks/` and read the two runtimes' rows in the YAML bind table.
5. Queried the trigger index (`.opencode/skills/system-spec-kit/runtime/data/trigger-index.json`) for operator goal phrasings and for the goal contract documents, then read the corpus root list that produces it (`retrieval/lib/corpus.mjs:29`).
6. Read `system-spec-kit/SKILL.md:158` for the advisor-side goal vocabulary.

## Findings — ranked by how often an operator hits the seam

### I2-1 (hit: every goal set through an offer path) — The bind is documented but wired into no step

All three lifecycle assets carry a `packet_goal.bind_by_runtime` table naming the exact invocation for opencode and pi [SOURCE: file:.opencode/commands/speckit/assets/speckit-plan.yaml:177–186] [SOURCE: file:.opencode/commands/speckit/assets/speckit-implement.yaml:142–151] [SOURCE: file:.opencode/commands/speckit/assets/speckit-complete.yaml:235–244], and the comment above it states the packet is the source and the session binds to it [SOURCE: file:.opencode/commands/speckit/assets/speckit-plan.yaml:174–176]. The executable step, however, lives in `set_mutation` and calls only the set action [SOURCE: file:.opencode/commands/speckit/assets/speckit-plan.yaml:156–170]. Grepping `bind` across the three assets returns only lines inside that reference table, the resend trigger text, and unrelated intake `bind_fields` — no step, branch, or post-condition ever invokes a bind. An operator who accepts the offer therefore gets a text objective: the record carries no `packetPath`, `renderGoalBrief` renders the stored copy [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:394–401], and `resendPending` can never be true because it resolves the packet through the record's pointer [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1011–1015]. The packet file is then free to drift from the operator's copy with the resend machinery silent — the exact failure ADR-001 and ADR-004 exist to prevent. It reads as wired because the table is exhaustive and adjacent to the step.

**Smallest fix**: when the resolved packet has a `goal.md`, `set` is redundant — `bindGoal` already stores the objective slice and prompt derived from the file [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:932–933] — so `set_mutation`'s `set` call becomes `bind` with `packetPath: spec_path`, and the separate `bind_by_runtime` table collapses into it. **Test**: a contract check that each runtime's set call in the assets is the bind invocation whenever the packet carries `goal.md`, or a fixture run of the offer path asserting the record has `packetPath` set.

### I2-2 (hit: every OpenCode save) — The plugin cannot `log` or `unbind`, and an unknown action silently becomes `show`

The core exports both actions [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:74–82] and the CLI dispatches both [SOURCE: file:.opencode/hooks/goal/bin/goal.cjs:392–394], but the plugin's whitelist omits them [SOURCE: file:.opencode/plugins/opencode-goal.js:168] and its dispatch switch has no branch for either [SOURCE: file:.opencode/plugins/opencode-goal.js:2960–3024]. Worse than a refusal: an action that is not in the whitelist is rewritten to `show` [SOURCE: file:.opencode/plugins/opencode-goal.js:2943] [SOURCE: file:.opencode/plugins/opencode-goal.js:2951], so a caller asking to log a progress row receives a successful show payload and no error at all. On OpenCode — the runtime whose binding ADR-005 calls full capability — the two actions the other decisions rely on most are unreachable through the tool surface that exists: the log append is what `/speckit:save` asks for [SOURCE: file:.opencode/commands/speckit/save.md:61], and unbind is the documented recovery from a wrong pointer. The agent can still shell out to `bin/goal.cjs`, which is why this is friction and honesty rather than an outage.

**Smallest fix**: add `log` and `unbind` to `GOAL_ACTIONS` and route them to the existing handlers, and replace the silent `show` fallback with a named invalid-action error. **Test**: a plugin-tool test calling both actions and asserting mutation results; a negative test asserting an unknown action errors instead of returning a show payload.

### I2-3 (hit: every lookup that mentions a goal) — The goal contract documents are outside the retrieval corpus

`CORPUS_ROOTS` indexes `specs`, `.opencode/skills` and `.opencode/install-guides` [SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:29]; `.opencode/hooks/` is not a root, so the two documents that define the model — `.opencode/hooks/goal/README.md` and `goal-plugin.md`, both carrying `trigger_phrases` [SOURCE: file:.opencode/hooks/goal/README.md:5–11] [SOURCE: file:.opencode/hooks/goal/goal-plugin.md:5–10] — cannot be indexed. The index's phrase map holds 35,924 phrases and none of the phrasings an operator actually types resolves to them: `set the goal`, `bind goal`, `resend goal`, `goal log` and `goal.md` have zero entries, while `packet goal` exists and points at unrelated packets' `goal.md` files. The one goal entry that is indexed under `.opencode/skills` — `.state/goal/README.md` — is indexed only because the state directory happens to live inside an indexed root, so the index surfaces the store's README and not the contract's. Advisor-side vocabulary does exist, in the spec-kit router's HOOKS keyword set (`skill advisor hook`, `goal plugin`, `opencode-goal`, `set goal`, `bind goal`, `packet goal`, `resend goal`, `goal.md`, `durable slice`) [SOURCE: file:.opencode/skills/system-spec-kit/SKILL.md:158], which routes a goal question to the spec-kit skill rather than to the contract docs. [INFERRED: the router keywords reach the advisor scorer; confirmation is a `skill-advisor` run on the prompt "set the goal for this packet" showing system-spec-kit as the routed skill.]

**Smallest fix**: add `.opencode/hooks` to `CORPUS_ROOTS`, add the operator phrasings to both documents' `trigger_phrases`, and regenerate the index; alternatively accept the current routing and add the two paths to the feature-catalog entry, which is indexed. **Test**: a lookup for `goal durable slice` returning `README.md` after regeneration.

### I2-4 (hit: every save where a goal.md exists, on the race only) — The save path offers the locked append and the hand append as equals

The save workflow instructs: append one progress row "through the goal command's log action or a direct table-row append below the log anchor" [SOURCE: file:.opencode/commands/speckit/save.md:61]. The direct write has none of the core's properties: no packet lock [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1047], no durable-slice refusal if the edit strays above the anchor [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1070], no log-table check [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1065–1067], and none of the encoding care iteration 1 filed (F1-H6, F1-H7). Two paths for one operation, and the one beside it in the same sentence is the unfenced one.

**Smallest fix**: reword to make the log action the only path on a bound session and the hand append the unbound fallback. **Test**: none needed beyond the wording; the guarded path already has tests.

### I2-5 (hit: every command entry on Claude Code and Codex) — Two runtimes get the posture as prose and can never see `resend_pending`

No goal adapter exists under `.claude/hooks/` or `.codex/hooks/`; the YAML's rows for both runtimes say "native goal command; render the durable slice, frontmatter excluded, and ask the operator to set it" [SOURCE: file:.opencode/commands/speckit/assets/speckit-plan.yaml:183–184]. The resend predicate is a durable-slice hash compared against a per-session record field [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1011–1015], and with no adapter there is no record and no hash comparison, so the only trigger on those runtimes is the agent noticing that the file changed. ADR-005 chose this deliberately, so this is a boundary, not a defect — but it is the one seam where the shipped rule ("the reminder rides the injection path", ADR-004) has no mechanism at all.

**Smallest fix** (least machinery available): the command entry renders the durable slice when `goal.md`'s mtime is newer than the session's start, mirroring the reminder's intent without a per-session store; the record-keeping variant is not available without an adapter. **Test**: a doc-level assertion that the two runtime rows name this check once it exists.

## Questions Answered

- **Q2** (integration): answered. Five seams, ranked: the bind that no step calls (I2-1), the plugin's missing `log`/`unbind` and silent `show` fallback (I2-2), the goal contract docs outside the retrieval corpus (I2-3), the save path's unlocked append given equal footing (I2-4), and the two runtimes with no hash mechanism at all (I2-5).

## Ruled Out

- **The plugin re-implements everything and the core is unused**: false; the plugin imports `goal-slice.cjs` directly [SOURCE: file:.opencode/plugins/opencode-goal.js:24] and the checked paths share the projections. The divergence is in action coverage and workspace precedence, not in the slice contract.
- **A second runtime action surface is missing entirely**: pi, cursor and devin adapters each call `renderGoalBrief` and `renderResendReminder` [SOURCE: file:.opencode/hooks/goal/pi/goal-context.ts:192–197] [SOURCE: file:.opencode/hooks/goal/cursor/goal-inject.mjs:80–84] [SOURCE: file:.opencode/hooks/goal/devin/goal-inject.mjs:67–70]; the gap is Claude Code and Codex only.
- **`resume`'s read-only posture is another unwired bind**: both resume assets carry `packet_goal` with explicit read-and-never-bind rules and `never_halts` [SOURCE: file:.opencode/commands/speckit/assets/speckit-resume-auto.yaml:45–48]; that seam is intentional and testable as written.

## Dead Ends

- Looking for a step-level hook (an `after`/`post` action in the YAML) that would carry the bind indirectly found none: the assets have no post-goal step, and the intake contract's `bind_fields` [SOURCE: file:.opencode/commands/speckit/assets/speckit-plan.yaml:488–501] is intake state binding, unrelated to the goal pointer. No indirect wiring hides the seam.

## Edge Cases

- **`set` after `bind`**: on a bound runtime, `bindGoal` alone produces the objective and prompt [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:932–933], so I2-1's fix removes a call rather than adding one.
- **`default` runtime row**: the set table's `default` hands off to the operator; the bind table's explicit runtime list includes devin as injection-only, so a devin session taking the default row gets a handoff consistent with its bind row.
- **Unknown plugin action**: the silent `show` fallback [SOURCE: file:.opencode/plugins/opencode-goal.js:2943] also means a typo in a mutation action returns success-shaped output, which is how I2-2 would be noticed late.

## Sources Consulted

- `.opencode/commands/speckit/assets/speckit-plan.yaml` (:141–215, :488–501), `speckit-implement.yaml` (:106–175), `speckit-complete.yaml` (:199–245), `speckit-resume-auto.yaml` (:31–48)
- `.opencode/commands/speckit/save.md` (:61)
- `.opencode/hooks/goal/lib/goal-core.cjs` (:74–82, :394–401, :932–933, :1011–1015, :1047, :1065–1070)
- `.opencode/hooks/goal/bin/goal.cjs` (:388–405)
- `.opencode/plugins/opencode-goal.js` (:24, :168, :2943–3024)
- `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` (phrase map, 35,924 entries)
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` (:29)
- `.opencode/skills/system-spec-kit/SKILL.md` (:158)
- `.opencode/hooks/goal/README.md` (:5–11), `goal-plugin.md` (:5–10)
- `.opencode/hooks/goal/pi/goal-context.ts` (:192–197), `cursor/goal-inject.mjs` (:80–84), `devin/goal-inject.mjs` (:67–70)

## Assessment

- New information ratio: 0.90
- Novelty justification: the integration angle is new to this lineage and four of the five seams are new; the plugin's missing `log`/`unbind` was already filed as F007 in the phase-007 review, so it is confirmation with a sharper failure mode (the silent `show` fallback) rather than a discovery.
- Confidence: high for I2-1, I2-2, I2-3, I2-4 (each read directly from the cited lines); medium for I2-5 (the absence is confirmed, but the proposed mtime check is a design sketch).
- Marked inferred: the advisor's use of the router's keyword set (I2-3) — a skill-advisor run on a goal prompt would confirm it.

## Reflection

- What worked and why: grepping the *invocation* (`bind`) rather than the *topic* (`packet_goal`) is what proved no step calls it; the topic grep finds the table and looks healthy.
- What did not work and why: searching for an indirect wiring path (hooks, post-steps, intake bindings) found nothing, which is itself the evidence — the seam is exactly as bare as it looks.
- What I would do differently: query the retrieval index by operator phrasing first; the corpus-root explanation came second and should have framed the finding.

## Recommended Next Focus

Iteration 3 — Operator UX: walk set, edit-a-criterion, reminder, set-again, switch-packet, finish, and locate every manual step the runner could do, every unclear message, and every paste a tool could produce. Carry forward: the bind-not-wired seam (I2-1) and the plugin's silent action fallback (I2-2) both change what the operator sees.
