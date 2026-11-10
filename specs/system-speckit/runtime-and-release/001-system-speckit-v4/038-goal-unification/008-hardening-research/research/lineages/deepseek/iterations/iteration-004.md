---
title: "Iteration 4: Overengineering — What Shipped That No Current Caller Needs"
trigger_phrases: []
---
# Iteration 4: Overengineering — What Shipped That No Current Caller Needs

## Focus

Charter angle 4. For each named candidate — record fields nobody reads, the two-slice projection versus one, the budget block in the contract JSON versus a constant, the `packet` action on three surfaces, envelope lines, the reminder text length, and doc paragraphs that restate each other — find the caller that justifies it or recommend removal. A row is only removed when no caller exists today, not when the caller is hard to imagine.

## Actions Taken

1. Enumerated record fields from `buildNewRecord` (`goal-core.cjs:1086–1104`) and `bindGoal`'s additions (`goal-core.cjs:938–952`), then grepped every field for non-test readers across core, CLI, plugin, adapters and command assets.
2. Traced the packet projection's fields (`goal-slice.cjs:224–237`) to consumers.
3. Counted readers of the budget manifest block: runtime resolver, validator resolver, validation reference.
4. Traced each of the three `packet` action surfaces to a consumer command.
5. Compared the two renderers' block assembly line by line and read the two "byte-for-byte" claims (`README.md:37`, `goal-core.cjs:383–387`).
6. Grepped the posture text across AGENTS.md, the hook README, the playbook, the spec-kit SKILL.md and the three lifecycle assets.

## Findings — item, caller today, verdict

### O4-1 — Packet projection fields `content` and `mtimeMs`: no caller, remove both

`readPacketGoal` returns `content` (the raw document) [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:229] and `mtimeMs` [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:236]. Grepping the whole goal surface for consumers of either on a packet projection returns nothing: the plugin's `mtimeMs` references are `stat()` results for other files [SOURCE: file:.opencode/plugins/opencode-goal.js:831] [SOURCE: file:.opencode/plugins/opencode-goal.js:1445], and no caller reads `packet.content` — `appendGoalLog` re-reads the file under its lock instead [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1048]. The one candidate that would justify `mtimeMs` is the plugin's brief cache, which keys on the *record* file's stats and not the packet's [SOURCE: file:.opencode/plugins/opencode-goal.js:2790]; the review's F004 argues that cache should key on the slice hash instead, which the projection already computes [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:235]. Removing both also deletes the `statSync` that iteration 1's F1-H5 identified as the one throw path in a function whose contract is fail-open. **Verdict: remove `content` and `mtimeMs`; the stat disappears with them.**

### O4-2 — Record field `lastCheckAtMs`: written twice, normalized once, read never

The plugin normalizes it on load [SOURCE: file:.opencode/plugins/opencode-goal.js:1241], initializes it [SOURCE: file:.opencode/plugins/opencode-goal.js:1732] and writes it on every verifier run [SOURCE: file:.opencode/plugins/opencode-goal.js:2388], but no surface renders it: the status envelope prints the verdict, the source and the evidence, not the timestamp [SOURCE: file:.opencode/plugins/opencode-goal.js:2897–2900]. Core's record does not carry the field at all. **Verdict: remove, or render it in `show` if a staleness signal was actually wanted — pick one; today it is neither.**

### O4-3 — CLI `injection_preview` line: unconditional where the plugin gates it

The plugin only appends `injection_preview=` when an option asks for it [SOURCE: file:.opencode/plugins/opencode-goal.js:2850], while the CLI prints it on every `show` and `bind` [SOURCE: file:.opencode/hooks/goal/bin/goal.cjs:137]. The line embeds a whole multi-line block inside a quoted single field, which is the least readable content in the envelope and the least likely to be parsed. **Caller that would justify it**: a debugging session. **Verdict: gate it behind the same opt-in the plugin uses.**

### O4-4 — Envelope duplication: `last_check` and `verifier_last_verdict` carry one value twice

Both lines print the same verdict [SOURCE: file:.opencode/plugins/opencode-goal.js:2897–2898], and `usage_source` appears twice as `usage_source=` and `budget_usage_source=` [SOURCE: file:.opencode/plugins/opencode-goal.js:2886–2889]. **Verdict: keep one of each; the duplicated names exist only because two output generations were concatenated.**

### O4-5 — The budget block in `spec-kit-docs.json`: three readers, keep

`goalDurableBudget` is read by the runtime resolver [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:183], by the validator's resolver [SOURCE: file:.opencode/skills/system-spec-kit/runtime/lib/templates/level-contract-resolver.ts:290], and it is the number the validation reference documents [SOURCE: file:.opencode/skills/system-spec-kit/references/validation/validation-rules.md:698]. Replacing it with a constant would hardcode the pair in two runtimes that already drifted once (iteration 1's F1-H1), with no single comparison point left. **Verdict: keep; add the parity test, do not fold the numbers into code.**

### O4-6 — The `packet` action on three surfaces: three consumers, keep

The core's `describePacketGoal` is the implementation [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:979–995]; the CLI exposes it as the one action that needs no session identity [SOURCE: file:.opencode/hooks/goal/README.md:62] and the Cursor command routes to exactly that [SOURCE: file:.cursor/commands/goal-cursor.md:46]; the plugin exposes it for the OpenCode command [SOURCE: file:.opencode/commands/goal-opencode.md:42]. Two user-facing surfaces, one implementation, each surface's command documented against it. **Verdict: keep.**

### O4-7 — The resend reminder text: one clause is removable, the length is not the problem

The text is one line of roughly 250 characters [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:138]. The trailing `Keep working meanwhile` is load-bearing: it encodes the never-halts rule, which on the injection path has no other carrier. The clause `ask the operator to set it` is the removable one on adapted runtimes, because the record can be rewritten by `bind` and `resent` (iteration 3's U3-1). **Verdict: keep the length, split the mandate by runtime capability.**

### O4-8 — Posture restatement across five documents: trim one, keep four, lint the triple

The never-halts and resend posture is stated in AGENTS.md's posture block and quick-reference row [SOURCE: file:AGENTS.md:314–315] [SOURCE: file:AGENTS.md:483], in the spec-kit skill paragraph [SOURCE: file:.opencode/skills/system-spec-kit/SKILL.md:483], in the hook README's binding paragraph [SOURCE: file:.opencode/hooks/goal/README.md:60], in the playbook [SOURCE: file:.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:77], and in each of the three lifecycle assets [SOURCE: file:.opencode/commands/speckit/assets/speckit-plan.yaml:190–193]. Each has a distinct reader: AGENTS.md binds every turn on every runtime, the README is the hook contract, the playbook is the set-time how-to, and the lifecycle assets are the only posture Claude Code and Codex ever load. The spec-kit skill paragraph restates mechanics the README owns while its router keywords already carry the vocabulary [SOURCE: file:.opencode/skills/system-spec-kit/SKILL.md:158], so it can shrink to a pointer without losing reach. The three identical `packet_goal` blocks cannot be merged into one shared file because each asset is loaded standalone by its command runner; a lint comparing the three blocks is the cheaper protection against the drift that already produced one changelog contradiction (F011) and one stale requirement (F012). **Verdict: shorten the skill paragraph to a pointer; keep posture in AGENTS.md and behavior in the assets; add the three-way block lint.**

### O4-9 — Two renderers, no parity test, and a claim that is narrower than it reads

The core's `renderGoalBrief` [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:389–448] and the plugin's `renderGoalInjection` [SOURCE: file:.opencode/plugins/opencode-goal.js:2707–2759] are near-duplicates whose usage lines genuinely differ (turn estimate versus auto-turn budget) [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:429] [SOURCE: file:.opencode/plugins/opencode-goal.js:2740]. The README's and core's "byte-for-byte" phrasing refers to markers and labels [SOURCE: file:.opencode/hooks/goal/README.md:37] [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:384], which is true and easy to misread as a whole-block guarantee; no test pins even the labels (F014 remains open). Merging them would require porting the plugin's auto-turn semantics into the runtime-neutral core, which is a real cost for a shared skeleton. **Verdict: keep both, state the intended differences in one comment each, and add a label-parity test.**

## Questions Answered

- **Q4** (overengineering): answered. Two removals (O4-1, O4-2), one gate (O4-3), one de-duplication (O4-4), and five keeps with named callers (O4-5 to O4-9), each with the reason it survives.

## Ruled Out

- **The two-slice projection collapses to one**: false. `objectiveSlice` is what the runtime stores and what `bind` derives [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:932–933]; `chatSlice` is what a person reads and pastes after anchor and comment stripping [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:67–73]. They differ by both content and cap, and a single slice would either ship markup into chat or store prose the runtime cannot budget.
- **Bound records' stored `objective`/`goalPrompt` are dead weight**: they have a caller — the render fallback after `unbind` [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:394–401] — and `setGoal` compares against them to decide `refreshed` versus `replaced` [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1114–1141]. Removing them changes unbind semantics (iteration 1's observation), so the verdict is keep.
- **The `legacy-*` actions are dead code**: this checkout holds zero legacy records, but the actions are the documented migration path for other machines [SOURCE: file:.opencode/hooks/goal/README.md:62]; no manifest evidence justifies removal.
- **The plugin's extra actions (`history`, `doctor`, `health`, `complete`, `pause`, `resume`) are surface bloat**: each has a command caller in `goal-opencode.md`; the asymmetry worth fixing is the two *missing* actions (iteration 2's I2-2), not the extras.

## Dead Ends

- Looking for a consumer of `content`/`mtimeMs` in test fixtures to argue the fields are used for assertions found only the core's own slice tests, which construct projections from strings; no production reader exists.

## Edge Cases

- **Plugin records normalized from core records**: the plugin's `normalizeStoredGoal` accepts core's unknown fields and drops the rest, so removing `lastCheckAtMs` from the plugin's shape is compatible with a core-written record that never had it.
- **`injection_preview` in the plugin's `show` parity**: gating the CLI line makes the two surfaces' output differ unless the same option name is honored in both; name it once.

## Sources Consulted

- `.opencode/hooks/goal/lib/goal-core.cjs` (:389–448, :932–952, :979–995, :1048, :1086–1104, :1114–1141)
- `.opencode/hooks/goal/lib/goal-slice.cjs` (:67–73, :183, :224–237)
- `.opencode/hooks/goal/bin/goal.cjs` (:118–141)
- `.opencode/plugins/opencode-goal.js` (:831, :1241, :1445, :1732–1732, :2388, :2707–2759, :2850, :2872–2900)
- `.opencode/skills/system-spec-kit/runtime/lib/templates/level-contract-resolver.ts` (:290), `references/validation/validation-rules.md` (:698)
- `.opencode/hooks/goal/README.md` (:37, :60, :62)
- `.opencode/skills/system-spec-kit/SKILL.md` (:158, :483)
- `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` (:77)
- `.opencode/commands/speckit/assets/speckit-plan.yaml` (:190–193)
- `.opencode/commands/goal-opencode.md` (:42), `.cursor/commands/goal-cursor.md` (:46)
- `AGENTS.md` (:314–315, :483)

## Assessment

- New information ratio: 0.80
- Novelty justification: the caller-or-remove pass is a new angle for this lineage; the two removals and two envelope de-duplications are new, while the renderer duplication and the manifest question confirm known items with the caller analysis attached.
- Confidence: high for O4-1 to O4-5 (each reader or its absence read directly); medium for O4-7 to O4-9 (verdicts rest on reader mapping rather than line-level proof of absence).
- Marked inferred: O4-2's "read never" holds across the surfaces I grepped (core, CLI, plugin, adapters, commands); a consumer outside that set would overturn it.

## Reflection

- What worked and why: grepping each field name outside test files separated "written and read" from "written and rendered once" — `lastCheckAtMs` fell out immediately, while `goalPrompt` and `tokenBudget` survived with dozens of references.
- What did not work and why: trying to collapse the two renderers found a genuine semantic difference (auto-turn budgets versus turn estimates), so the honest verdict is to pin the difference rather than merge it.
- What I would do differently: check the renderer-divergence question before the field sweep; it changes how much shared-renderer work the other recommendations imply.

## Recommended Next Focus

Iteration 5 — Synthesis: rank every recommendation from iterations 1 to 4 by (operator impact × confidence) / cost, group into do now, do next, do not, each row citing file:line.
