# Iteration 2: Proving delivery from a record each runtime already writes

## Focus

Q2 of the lane: can brief delivery be proven for every runtime from a record the runtime itself writes, and what exactly must be recorded at hook time? The narrow reading was chosen: name the field and the file per runtime, not redesign the brief. The four runtimes whose `briefDelivered` is `unknown` in the committed after arm (pi, devin, dsh, opencode) were read at their store-mapping code, and Codex was kept as the control because its zero is genuinely a delivery zero.

## Findings

1. **Each shared reader drops the harness-injected text by construction, and each says so in a comment.** Pi maps only `type === 'message'` entries and states that Pi records harness injections as a separate `custom_message` entry type "which this mapping never reads". Devin's database chain maps `user`, `assistant` and `tool` rows only, and skips a user row unless `metadata.is_user_input` is set, so a system or synthetic row never reaches `records`. DSH keeps only `user/message` events whose `source.kind` equals `user`, and says injected notices carry a non-operator source kind. OpenCode maps only `text`, `reasoning` and `tool` parts. [SOURCE: .skilled/hooks/shared/session-readers/pi.mjs:127] [SOURCE: .skilled/hooks/shared/session-readers/devin.mjs:145] [SOURCE: .skilled/hooks/shared/session-readers/devin.mjs:161] [SOURCE: .skilled/hooks/shared/session-readers/dsh.mjs:195] [SOURCE: .skilled/hooks/shared/session-readers/opencode.mjs:122]

2. **Pi's brief is on disk and the probe cannot see it.** `briefDelivered` for Pi calls `loadSession` and runs `recordsHaveBrief(loaded.records)`, but the brief lives in the `custom_message` entry the reader discards, so the probe can only answer `false` or `unknown` — never `true` — even though the goal log records 24 of 24 Pi briefs by another probe. The committed `unknown` is therefore a probe/log mismatch, not a missing store. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:193] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:202] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md]

3. **OpenCode has no stored trace at any layer.** The plugin appends the brief inside `experimental.chat.system.transform`, an in-memory transform of the system prompt; it writes no session row, no metric row and no marker. Delivery can therefore only be inferred from the model quoting the brief (10 of 24 runs in the goal log) or from the plugin being loaded, and neither is a per-row fact. [SOURCE: .opencode/plugins/system-skill-advisor.js:1694] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md]

4. **One additive field on the load result would make three runtimes provable without touching the conversation contract.** A reader that returns `{ ok, source, records, injected }` — where `injected` holds the entries the reader already parses and then drops — lets `briefDelivered` read `loaded.injected` while every existing consumer keeps reading `records`. The extractors already exist: Pi has the `custom_message` entries in hand before the type filter, Devin has the unflagged/system rows before the role switch, DSH has the non-operator `user/message` events before the source filter. [INFERENCE: based on the four reader mappings cited in Finding 1 and the `loadSession` return shape]

5. **OpenCode needs one written marker, and the risk of not having one is a silent stop.** Because the transform is `experimental`, an OpenCode upgrade can stop calling it and nothing in the repository would notice. A single diagnostic row per delivered brief — reusing the advisor's existing hook-diagnostic writer — makes delivery a stored fact and turns a silent stop into a measurements gap on the next arm. [SOURCE: .opencode/plugins/system-skill-advisor.js:1077] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:50]

6. **Codex stays the one runtime where the honest answer is `false`, not `unknown`.** The rollout reader already keeps every payload role, so once the project hooks are approved the brief would be visible; until then a probe that reads the rollout should return `false`, not `unknown`, because the hook is registered and unapproved, which is a delivery miss. Distinguishing that from `unknown` is what makes the 24 Codex rows attributable. [SOURCE: .skilled/hooks/shared/session-readers/codex.mjs:99] [SOURCE: .skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:25]

## Ruled Out

- **"The brief is not stored, so delivery cannot be proven."** False for pi, devin and dsh: all three store it and the readers drop it. Only opencode has no store.
- **"Add the brief to the session by editing the hook's output."** The hook output is the host's contract; a second copy written by the advisor would prove only that the advisor ran, not that the host delivered it. Rejected as circular evidence.
- **"Re-run the whole after arm to recover delivery numbers."** Not needed for pi, devin and dsh: re-running the committed `backfillRunLog` over the existing log recovers the field without a model run, and no CLI session is allowed here anyway.

## Dead Ends

- Reading the OpenCode SQLite part table for the brief. The brief never becomes a part; the transform is applied to the system prompt after the parts are written. Confirmed by the plugin's hook name and the reader's part filter.
- Using the model's own quotation of the brief as the delivery signal. It scores the model's obedience, not the host's delivery, and would undercount.

## Edge Cases

- **Missing dependency:** no live session store from the arm is available for a re-probe inside this run (no writes outside the lineage, no CLI runs), so the reader change is verified by fixture rather than by a live re-backfill.
- **Contradictory evidence:** the goal log says devin, pi and dsh delivery is 24 of 24 by probe, while the committed log says `unknown`. Both are cited; the resolution is that the probe and the log use different paths, not that either number is wrong.
- **Ambiguous input:** "prove delivery" could mean "the host received the text" or "the model's prompt contained it". The narrow reading chosen is the host-side record, because that is the only one a committed script can check after the run.

## Sources Consulted

- `.skilled/hooks/shared/session-readers/pi.mjs`
- `.skilled/hooks/shared/session-readers/devin.mjs`
- `.skilled/hooks/shared/session-readers/dsh.mjs`
- `.skilled/hooks/shared/session-readers/opencode.mjs`
- `.skilled/hooks/shared/session-readers/index.mjs`
- `.skilled/hooks/shared/session-readers/codex.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs`
- `.opencode/plugins/system-skill-advisor.js`
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl`

## Assessment

- New information ratio: 0.85
- Questions addressed: Q2 (provable delivery per runtime)
- Questions answered: Q2

## Reflection

- What worked and why: reading each reader's own comment found the drop rule stated in the code, which is stronger evidence than inferring it from a zero rate. Reading the OpenCode plugin's hook name settled why that runtime has no trace at all.
- What did not work and why: the winning move was not a new probe but an additive field on an existing return value; the earlier framing ("add a delivery probe per runtime") would have duplicated parsing the readers already do.
- What I would do differently: start from `loadSession`'s return shape, not from each store, because one interface change covers three runtimes.

## Recommended Next Focus

Q3 and Q4: the four remaining unsafe runs and the `COMMAND:` line. Establish whether the unsafe rows are delivery failures, obedience failures or routing deferrals, and whether the command line is a usable obedience signal or only a measurement token.
