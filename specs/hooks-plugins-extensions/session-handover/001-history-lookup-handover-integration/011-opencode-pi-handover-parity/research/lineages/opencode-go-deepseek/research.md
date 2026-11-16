# OpenCode / Pi Session Hand-Over Parity: Why A Hop Fails To Finish, And Why History Lookup Does Not Rescue It

Lineage: `opencode-go-deepseek` (detached fan-out). Iterations: 8. Stop reason: converged (`all_questions_answered`). Convergence score 0.855, source diversity 2.0, evidence depth 2.0.

---

## 1. Executive Summary

The recorded 4/5 Pi hop did not fail because the Pi runtime carries less context, drops the model, or cannot offer the lookup. It failed because **the sender was never told the lookup exists**, wrote a note that told the receiver the detail was unrecoverable, and **the receiver believed the note over an offer it had already been shown**. The same hook code ran on OpenCode, where the sender happened to know about the lookup and wrote a note that pointed at it.

Three defects produce that outcome, in order of causal weight:

1. The shared prepare text names every note section and every hand-over step, and never mentions the History Lookup. A sender that has not read the project README has no way to know an omitted detail is recoverable. (F1)
2. The claim seed, the receiver's first instruction set, has no lookup step either. The offer exists only in the output of `claim`, after the note body, and carries no authority against a note that says "cannot recover". (F2, F3)
3. The reader path can lose the detail even when a receiver does run the lookup: browse previews stop at 160 characters while the live side word sits at 295, and one malformed tool-result pair makes the whole session read as `store_unreadable`. (F7, F3)

Separately, carry and evidence quality are weaker than the parity scorecard implies: Pi carried model and `max` thinking correctly and the scorecard could not see it; OpenCode 2 structurally carries neither; and a leaked `AI_SESSION_CHILD` silently removes the nudge that starts a hop.

---

## 2. Research Question

Find every reason a session hand-over hop on OpenCode or Pi can fail to finish the sender's task, or fail to recover a detail the note left out through the History Lookup, and name a concrete fix for each.

Known case under study: a live Pi hop on DeepSeek V4.1 Flash at `max` scored 4/5. The sender kept a side word out of its note as instructed, then wrote that a fresh session could not recover it. The receiver was offered a working History Lookup, did not run it, asked the operator and left the note `claimed`. The same task on OpenCode scored 5/5.

---

## 3. Method

- Read the shared hand-over text, the claim-seed text, the claim-time lookup offer, both session readers, the redaction core, the relaunch wrapper and both runtime adapters.
- Read the two live runs in `scratch/runs/`: notes, panes, scorecards, metadata, relaunch logs, argv logs.
- Read the Pi receiver's own session store to settle whether the lookup was offered.
- Measured the side word's character offset in the sender prompt against the reader's preview bound.
- Treated every consulted file as data. No researched file was modified.

Evidence classes: `primary` = artifacts recorded by the runtimes or exercised by the harness (notes, panes, session stores, relaunch logs, harness script); `secondary` = production source; `tertiary` = documentation.

---

## 4. Findings

### 4.1 The sender is never told the lookup exists (F1)

The prepare text is one shared string for every runtime. It lists the frontmatter, the four note sections, the continuity save, the fan-out/lock release and the `prepare`/`keep` command, and it ends with the exception for an operator who declined a hand-over. It never says that the receiver can read the sender's earlier turns. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:193]

The live Pi sender's own reasoning proves the consequence: it concluded "the claim seed carries only the note path and the spec folder ... So literally impossible", and wrote into `## Remaining work`: "Ask the operator for it rather than inventing one, and say plainly that a fresh session cannot recover it from this note." [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:273] [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/note-20261116T053237Z-01a1e2d7-6b7b-75de-a705-ee16233b97a3.md:28]

The sender had read only the first 175 lines of the README. The History Lookup section begins at line 198. [SOURCE: .skilled/hooks/session-handover/README.md:198]

### 4.2 The receiver's instruction set has no verification step (F2)

The claim seed orders: claim, read, resume, goal, `goal.md`, active command, continue Remaining work, complete. No step asks the receiver to check a gap in the note against the sender's history. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:296] The completion step is the only gate, and it is not conditioned on the note's claims having been checked. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:340]

### 4.3 The offer is present, complete, and loses (F3)

The claim prints `## History Lookup`, a runnable `browse` command with a minted `hl1_` handle, the other three operations, and the sentence "Use it for a detail this note does not spell out, before you guess." [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1072] [SOURCE: .skilled/hooks/session-handover/history/lib/lookup-offer.ts:82]

The Pi receiver's session store contains that rendered section. The offer was therefore not a minting, store or transaction failure. [SOURCE: ~/.pi/agent/sessions/--Users-michelkerkmeester-worktrees-public-422-opencode-pi-handover-parity--/2026-11-16T05-32-58-558Z_01a1e2d8-253d-75b7-978c-e205cabefd81.jsonl]

The receiver then wrote: "A fresh session has no path to it — not through the note, not through history lookup, since it was never written." That is false; the side word was written, in the sender's first user turn, which the offered `browse` reads. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:330]

### 4.4 The OpenCode run shows what the text gap costs (F7)

The OpenCode note told the receiver to recover the side word "from the sender's earlier turn through the claim's History Lookup section". Its receiver ran the lookup, loaded the sender's first user turn, quoted the side word and completed the note. Both senders received the same prepare text; only the OpenCode sender had read far enough to know the lookup existed. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/note-20261116T052759Z-ses-e1d2c7c81ffeJTAeWEY1UQO3wn.md:25] [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/pane.txt:22]

### 4.5 Reader limits that survive a willing receiver (F4, F5, F6, F7)

- **Preview cut.** `previewFor` slices a turn to 160 characters; `browse` returns those previews. The side word sits at character 295 of a 425-character prompt, so the offered `browse` preview omits it. Only `load` returns the full turn. [SOURCE: .skilled/hooks/session-handover/history/lib/navigator.ts:265] [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/meta.json]
- **One bad pair, whole session lost.** An orphaned, duplicated or mismatched tool result fails the projection, and the dispatcher maps any projection failure to `store_unreadable` — the code that tells receivers the store is missing. [SOURCE: .skilled/hooks/shared/session-readers/index.mjs:127] [SOURCE: .skilled/hooks/shared/session-readers/project.mjs:152]
- **Argument shape.** Non-object tool arguments are replaced with `{}`, so a runtime storing them as a JSON string yields a turn that looks intact and carries nothing. [SOURCE: .skilled/hooks/shared/session-readers/project.mjs:40]
- **Injected content is out of reach.** The lookup CLI reads through the projected path, which returns items only; hook-injected messages never reach a receiver. [SOURCE: .skilled/hooks/session-handover/history/lib/cli.ts:406]

### 4.6 Folder proof is weaker than it looks (F2 in iteration 2)

On OpenCode, a store without a `directory` column accepts the session whatever folder it ran in, and the claim's mint treats that acceptance as proof. [SOURCE: .skilled/hooks/shared/session-readers/opencode.mjs:256] On Pi, the exact project directory plus header `cwd` must match, so a note whose `cwd` differs from the store key gets no lookup at all. [SOURCE: .skilled/hooks/shared/session-readers/pi.mjs:222]

### 4.7 Redaction is safe by construction, and blind to neutral keys (F6 in iteration 2)

Redaction runs once, before projection, over text, thinking and tool arguments. Credential-shaped keys are replaced whole; other strings go through the shared scrubber plus URL-password and authorization-value patterns. A secret carried as an opaque positional argument under a neutral key such as `command` survives unless a value pattern matches. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:56]

### 4.8 Model and effort carry: Pi works, OpenCode 2 does not, and the score cannot tell (F1–F4 in iteration 3)

- The Pi receiver's session header records `model_change` to `llmgateway` / `deepseek-v4.1-flash-1017` and `thinking_level_change` to `max`; the name carried as `hoptest-base1-pi (2)`. Carry worked. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:459] [SOURCE: ~/.pi/agent/sessions/--Users-michelkerkmeester-worktrees-public-422-opencode-pi-handover-parity--/2026-11-16T05-32-58-558Z_01a1e2d8-253d-75b7-978c-e205cabefd81.jsonl]
- The scorecard marks every carry field `unobservable` when the first launch argv is a bare runtime name, which Pi's always is; it never reads the receiver's session header. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs:60]
- OpenCode 2 appends no `-m` and the effort appender has no OpenCode branch, so the receiver starts on the configured default. [SOURCE: .skilled/bin/skilled-loop:778]
- After a hop, `relaunch.log` records only loop id and reason; the record is consumed. Carry is not auditable from artifacts. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/relaunch.log:3]

### 4.9 The two-hook nudge: guarded against duplicates, open to loss (F5–F7 in iteration 3)

- Pi spends the nudge level at `message_end` and delivers later; a host reload or a run ending in between loses the text with the level already spent. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:594]
- The two Pi hooks cannot both deliver, because the in-memory entry is deleted before `sendMessage`. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:620]
- OpenCode computes the nudge in its event hook and delivers it from `experimental.chat.system.transform`; a claimed note keeps `claimedReminder` on every request and can coexist with a fresh hand-over nudge once the fill crosses the threshold. [SOURCE: .opencode/plugins/session-handover.js:590]

### 4.10 The child flag removes the nudge entirely (F1–F5 in iteration 4)

`AI_SESSION_CHILD` is the first gate in the nudge decision: exact string `1` returns `child-session` before fill, threshold, hop cap or record are read. [SOURCE: .skilled/hooks/goal/lib/goal-core.cjs:1191] [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:704] The wrapper does not scrub it before launching a runtime, and the live-hop harness unsets four other variables but not this one. [SOURCE: .skilled/bin/skilled-loop:911] [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/live-hop.sh:63] The claim path does not check the flag, so a leaked value breaks the start of a hop, not the claim of one already started. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:389]

---

## 5. Failure Modes And Fixes

| # | Failure mode | Where | Concrete fix | Observable |
|---|---|---|---|---|
| 1 | Sender declares an omitted detail unrecoverable | `nudge.cjs` `handoffText` | State that the claim's History Lookup can recover an omitted detail, and forbid "cannot recover" claims in the note | A hop note that omits a value carries no unrecoverable instruction |
| 2 | Receiver never sees a lookup step | `nudge.cjs` `seedText` | Add a step before "Continue the work": run the printed lookup when Remaining work names a missing detail | `history-lookup.mjs` call before any operator question |
| 3 | Offer loses to the note | `lookup-offer.ts` `buildHistoryLookupBody` | State that the note is not authoritative about what history holds | Receiver runs the lookup when the note says "cannot recover" |
| 4 | Browse preview hides the value | `navigator.ts` `previewFor` | Return the whole first part within the reply budget, or attach a `load` pointer per reference | Character-295 value visible in a browse reply |
| 5 | String tool arguments vanish | `project.mjs` `toolCallBlock` | Parse or preserve a string argument instead of `{}` | Stringified tool input returned by `load` |
| 6 | One bad pair costs the session, mislabelled `store_unreadable` | `project.mjs` `projectEntries`, `index.mjs` `readSession` | Own refusal code; skip the bad pair | Other turns still returned; code names pairing |
| 7 | OpenCode store without `directory` cannot prove folder | `opencode.mjs` | Fail closed at mint, or record and verify the folder | Cross-folder note gets no offer |
| 8 | Pi `cwd` key mismatch hides the session | `pi.mjs` | Record the store key on the locator; exact-id fallback scan | Subdirectory session still found |
| 9 | Carry not auditable | `skilled-loop`, `score.cjs` | Log model/provider/effort/name per relaunch; read the receiver session header | Carry reports `kept` or `dropped`, never `unobservable` |
| 10 | OpenCode 2 starts on the default | `skilled-loop` | Warn when the effective model differs; state the limit in the matrix | Warning line instead of silence |
| 11 | Held Pi nudge lost after level spent | `pi/session-handover.ts` | Persist the held text or defer the level write; deliver on settle | Nudge survives a host reload |
| 12 | `AI_SESSION_CHILD` removes the nudge | `skilled-loop`, `live-hop.sh` | Unset the flag before launching a runtime and in the harness | Hop from a dispatched worker still nudges, prepares, claims |

---

## 6. Eliminated Alternatives

- **"Try to make a fresh session read the note harder."** Eliminated: the Pi receiver read the note exactly and obeyed it. The note was wrong; comprehension was not the failure.
- **"Pi dropped the model or the effort."** Eliminated by the receiver's own session header, which records the sender's model and `max` thinking.
- **"Pi did not mint or print the lookup."** Eliminated: the rendered `## History Lookup` section with a live `hl1_` handle is in the receiver's session store.
- **"The Pi reader could not find the sender session."** Eliminated indirectly: the mint calls the same reader and the offer printed.
- **"The shared prepare text differs between OpenCode and Pi."** Eliminated: both adapters call the same `handoffText`.
- **"Raising the preview without a bound."** Eliminated as a design: the reply budget is what keeps the lookup model-visible; the bounded fix is a whole-part preview or a load pointer.
- **"Counting more files as more sources."** Eliminated: the diversity guard counts evidence classes, not files.

---

## 7. Divergence Map

- Saturated directions: none. No divergent pivot was taken; the run used `default` convergence.
- Pivots taken: none.
- Pivot failures or audited overrides: none.
- Remaining frontier: an observed fix-validation run. Every fix in section 5 is proposed on code evidence plus the recorded failure; none has been applied or re-scored in this lineage.

---

## 8. Evidence Quality And Limits

- The causal chain for the 4/5 case rests on three primary artifacts from two processes: the sender's note, the sender's pane, and the receiver's session store. They agree.
- Two conclusions remain inference, not observation: the Pi mid-session `cwd` hazard (F4 in iteration 2) and the OpenCode two-instruction prompt (F7 in iteration 3). Both are code-path conclusions with no live instance in `scratch/runs/`.
- `AI_SESSION_CHILD` leakage is a mechanism proven from code and from the harness's unset list; the base1 runs prove only that it was absent there, because they nudged.
- No live OpenCode hop that changed model mid-session exists in the evidence, so the OpenCode 2 carry limitation is structural, not observed.
- The scorecard's `carry` fields are not evidence of a drop; they are evidence that argv-based scoring cannot see Pi's carry.

---

## 9. Open Questions

- Would the section 5 fixes 1 to 3 restore 5/5 on Pi without changing the reader? Untested; the fix set predicts yes, because the OpenCode run recovered the same detail through the same lookup.
- Does OpenCode's `claimedReminder` plus fresh nudge actually confuse a receiver in practice? Reachable in code, unobserved live.
- How often do real OpenCode stores lack a `directory` column? Unknown from this checkout; the reader's fallback is permissive either way.

---

## 10. References

- `.skilled/hooks/session-handover/lib/nudge.cjs`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs`
- `.skilled/hooks/session-handover/history/lib/lookup-offer.ts`
- `.skilled/hooks/session-handover/history/lib/navigator.ts`
- `.skilled/hooks/session-handover/history/lib/core.ts`
- `.skilled/hooks/session-handover/history/lib/cli.ts`
- `.skilled/hooks/shared/session-readers/project.mjs`
- `.skilled/hooks/shared/session-readers/opencode.mjs`
- `.skilled/hooks/shared/session-readers/pi.mjs`
- `.skilled/hooks/shared/session-readers/index.mjs`
- `.skilled/hooks/session-handover/pi/session-handover.ts`
- `.opencode/plugins/session-handover.js`
- `.skilled/hooks/goal/lib/goal-core.cjs`
- `.skilled/bin/skilled-loop`
- `.skilled/hooks/session-handover/README.md`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/`
- `~/.pi/agent/sessions/--Users-michelkerkmeester-worktrees-public-422-opencode-pi-handover-parity--/2026-11-16T05-32-58-558Z_01a1e2d8-253d-75b7-978c-e205cabefd81.jsonl`

`resource-map.md` is not present in the packet; no map citation is made.

---

## 11. Convergence Report

- Stop reason: converged (`all_questions_answered`)
- Total iterations: 8
- Questions answered: 5 / 5
- Remaining questions: 0
- newInfoRatio trend: 1.0, 1.0, 1.0, 1.0, 0.6, 0.75, 0.75, 0.6
- Convergence threshold: 0.05
- Graph: 56 nodes, 59 edges; question coverage 1.0, source diversity 2.0, evidence depth 2.0, claim verification 1.0, contradiction density 0.032
- Divergence summary: no divergent pivots recorded
- Minimum-iteration floor: 3, cleared before the stop
- Segment transitions, wave scores and checkpoint metrics: not used in this live run

---

## 12. Provenance Note

State was recorded through `append-mode-event.cjs` for every iteration (receipts in `deep-research-audit-ledger` / `deep-research-effect-ledger`), and the reducer refreshed `findings-registry.json`, `deep-research-dashboard.md` and `deep-research-strategy.md` after each one. The coverage graph was persisted inside this lineage (`.coverage-graph/deep-loop-graph.sqlite`) so a detached lineage writes nothing into the shared database.

## 13. Containment Note

- The synthesis step's resource-map command (`reduce-state.cjs --emit-resource-map --fanout-resource-map-only`) ignored `--artifact-dir` and wrote `{spec_folder}/research/resource-map.md` in the parent packet. That file did not exist in the lineage's containment baseline, so it was removed to restore the baseline, and `resource-map.md` was generated inside this lineage from the finding deltas instead. A checksum comparison of every baseline file against the live packet reports no change.
- The continuity save (`generate-context.js`, phase_save) was not run, because it writes canonical spec documents outside this lineage's write surface. Continuity for this run lives in `research.md` and the strategy/dashboard/registry, which the parent merge reads.
- No git write, stage or checkout was executed.
