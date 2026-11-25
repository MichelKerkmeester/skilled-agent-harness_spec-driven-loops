# Steering Log: plan-depth research fan-out

Operator-side steering record for the two-lineage fan-out in this folder. Lineage labels on disk are `vibe` and `opencode`.

## Standing facts (check 0, 2026-11-25 22:23 CET)

### opencode lineage failed at iteration 1 (terminal)

- `orchestration-status.log` records `"event":"failed","label":"opencode"` with `failure_class: quota`, `retry_verdict: fatal`, `retryable: false`.
- The cause is `provider.go-limit`: "OpenCode Go monthly usage limit reached" (`lineages/opencode/logs/fanout-lineage.out`), resets in 7d 10h.
- The same attempt logged a `containment_violation` on `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/goal.md`. The runner reverted it (`action: preserved_in_head, ok: true`), and the patch is in `lineages/opencode/containment/quarantine/1/`.
- Orphaned seeds that no lineage will work:
  - F-1-002 (007-per-bot-apps, 008-vault)
  - F-1-004 (009-skills, 010-conversations, 005-memory user flows)
  - F-1-006 (012-manual-testing-scenarios, 013-skilled-and-doc-alignment, 014-deep-review)
- The vibe lineage holds only F-1-001, F-1-003 and F-1-005 (`lineages/vibe/frontier-nodes.jsonl`).

### Steering surface does not reach the running lineage

- The vibe reducer runs with `--artifact-dir .../research/lineages/vibe` (`lineages/vibe/vibe-prompt.txt:17`).
- `reduce-state.cjs:3421-3431` resolves the inbox as `<artifactDir>/inbox.jsonl`, so vibe reads `lineages/vibe/inbox.jsonl`, not `research/inbox.jsonl`.
- `fanout-run.cjs` reads the root `frontier-nodes.jsonl` only to partition seeds at spawn (`fanout-run.cjs:481-483`). It writes lineage inboxes only in `writeLineageFrontierStore` (`fanout-run.cjs:619-638`, called at `:5533`).
- `fanout-merge.cjs` contains no inbox read.
- Result: an append to `research/inbox.jsonl`, or `frontier-admit.cjs admit --artifact-dir research`, is inert for this run. Pointing either at `lineages/vibe/` is barred by the brief (no lineage-file edits) and would race the lineage's own `step_frontier_admit` writer.
- Decision: no root-inbox appends. Each steering entry I would have added is recorded below as a "proposed steering" row, ready for a rerun.
- LOGIC-SYNC REQUIRED: the brief names `research/inbox.jsonl` as the steering surface, but in a fan-out run no lineage reducer or merge step reads it after spawn.

### Moving benchmark

- At iteration 1, `containment_contested` flagged `003-terminal-screen/003-shell-and-navigation/spec.md` and `graph-metadata.json` as changing under the run. Some other writer is editing them. Cites into 003 may go stale.

## Checks

### Check 1 (22:28 CET)

- Landed: vibe iterations 1-5, newInfoRatio 0.93, 0.86, 0.86, 0.90, 0.86, all `complete`. opencode: none (dead, see above).
- Focus per iteration:
  - 1: F-1-001 data contracts (001, 002, 005, 006, 010).
  - 2-3: F-1-003 (011).
  - 3 also covered F-1-005 cross-cutting architecture and 004.
  - 4: F-2-006 `--json` envelope rule.
  - 5: F-2-007 `ITEM_KEYS` ownership.
- All five vibe nodes are now `answered`. `lineages/vibe/frontier-focus.txt` now names 007 and 008, so the lineage is deriving its own questions for the orphaned phases.
- Judgment: high quality. Findings cite real lines, carry P0/P1/P2, and name closing artifacts: a packet `contracts/` folder with schemas and envelope rule, six children for 011, a target-state module map, a state-root tree, and sequence diagrams.
  - Iteration 5 corrected iteration 3's over-broad "no shared architecture doc" claim. The Shared Records table at `003-openbot-parity-build/spec.md:120-140` exists. Good self-correction.
- Spot checks:
  - Confirmed: no `*schema*` file in the packet outside one screenshot PNG.
  - Confirmed: `needs-you.ts:25-28` holds `{text, answeredAt}`.
  - Minor drift: the `{"groups":[]}` claim is cited as `001-activity-and-actor/spec.md:229` in iterations 1 and 4, but the text is on line 227. The claim holds and the line is off by two.
- Anomaly: a stray copy of `iteration-001.md` sits at `lineages/vibe/specs/system-skilled-bots/.../lineages/vibe/iterations/iteration-001.md`, a doubled relative path written by the vibe leaf. Same bytes (14721). Not touched.
- Duplication: not applicable (one live lineage).
- Gaps: 007, 008, 009, 012, 013, 014 unreviewed. The lineage's own Next Focus (iterations 3-5) already targets exactly these, so no steering is needed.
- Steering added: none. Proposed for a rerun: none beyond the orphaned seeds.

### Check 2 (22:32 CET)

- Landed: vibe iterations 6-10. newInfoRatio 0.93, 0.88, 0.90, 0.92, 0.80, all `complete`. vibe reached its 10-iteration cap at 21:31:31Z.
- Focus per iteration:
  - 6: 007 and 008.
  - 7: 009 and 012.
  - 8: 013 and 014.
  - 9: cross-cutting refusal catalogue, exit codes, schema version, migration and concurrency.
  - 10: ranked expansion plan.
- Judgment: on topic, P-graded, concrete closing artifacts. The lineage covered the orphaned phases from its own derived questions, without steering.
- Spot checks:
  - Confirmed: `runner.ts:113-120` holds `EXIT_CODES` with six values.
  - Confirmed: `REFUSAL_CAUSES` holds 25 entries, but it starts at line 123 and closes at 149, not 151. Count right, end line off by two.
  - Confirmed: `run-record.ts:142` types `cause: string`.
  - Confirmed: no non-research doc in `003-openbot-parity-build` names `REFUSAL_CAUSES`.
  - Confirmed: neither 010's nor 011's docs mention a mockup or a `design/` folder (iteration 10 finding 6).
- Shallow spots:
  - Iteration 6 is titled 007 and 008, but all eight findings are 008. 007 is judged "ready, P2 only" (iteration 10 finding 7) from one shared read.
  - Reference code in `specs/system-skilled-bots/context/` was read only in iteration 2 (rakazo, tinychannels, for 011). Nine of ten iterations name no repo. The topic asked, for each phase, which repo to study first.
  - 010's user-facing flows were not examined beyond "no mockup": transcript format, `@bot` routing, prompt budget and injection boundary. These sit in orphaned seed F-1-004.
  - 006 has no iteration of its own. It gets only "grant schema complete" (iteration 1) and the `kind` collision (iteration 5).
- Steering added: none. The lineage was already at its cap, and the surface is inert (see Standing facts).
- Proposed steering for a rerun (not appended):
  1. "Phase 010-conversations: design the chat transcript line format, `@bot` routing grammar, prompt budget per section and the injection boundary. Propose a `design/` folder like 003's `001-ux-and-component-map/design/`. Read 010 spec.md:144-174 and 005 plan.md:71."
  2. "Per phase 001-014 except 003: name the one repo under `specs/system-skilled-bots/context/` the builder should study first, with the file and line it mirrors."
  3. "Phase 007-per-bot-apps and 006-approval-grants: test the 'ready' verdict against the full spec and plan, including grant expiry and revocation lifecycle and 007's filtered-config write under concurrent runs."

### Check 3 (22:34 CET): original runner exited, top-up runner started

- The original runner (pid 32199, run `1795641770973-zif3qt`) exited. `orchestration-summary.json` records: vibe succeeded (exit 0), opencode failed (`failure_class: quota`), `completed_with_containment_advisory: 1`.
- At 22:34:26 CET a second runner (pid 67281) started in the same artifact dir with `fanout-config-codex-topup.json`: two `cli-codex` lineages (`gpt-6-luna`, xhigh, fast), labels `codex-1` and `codex-2`, 5 iterations each. I did not start it. The brief's pgrep pattern matches it, so monitoring continues.
- Partition from the root store:
  - codex-1: F-1-001, F-1-003, F-1-005, the nodes vibe already answered.
  - codex-2: F-1-002, F-1-004, F-1-006, the orphaned opencode share.
- Duplication risk: codex-1 re-asks vibe's three answered nodes. Vibe's answers sit only in `lineages/vibe/`, which codex-1 does not read. The root steering surface is inert after spawn, so I cannot redirect codex-1 to the gaps in check 2.
- Steering added: none.

## Codex top-up: standing facts (2026-11-25 22:44 CET)

### Runs and lineages

- Config `fanout-config-codex-topup.json`: two `cli-codex` lineages (`gpt-6-luna`, xhigh, fast), labels `codex-1` and `codex-2`, 5 iterations each, concurrency 2.
- First top-up run `1795642466939-2ph6gu` (runner_pid 67311, lineage pids 92015 and 92053) got SIGTERM at 21:35:58Z, about 70 s after spawn, with `run_stopped` and `survivors: []`. I sent no signal to it or to any later run.
  - Correction to check 3: it named the runner pid as 67281, but the status log records `runner_pid` 67311 for that run. 67281 may be a wrapper process. I have not confirmed which.
- A second top-up runner (runner_pid 49113) restarted both lineages at 21:39:54Z. Lineage pids are 71793 (codex-1) and 71829 (codex-2), spawned 21:40:12Z.
- After the restart, `lineages/codex-1/frontier-nodes.jsonl` still holds F-1-001, F-1-003 and F-1-005, the nodes vibe already answered. `lineages/codex-2/frontier-nodes.jsonl` holds F-1-002, F-1-004 and F-1-006. The duplication risk from check 3 stands for codex-1.

### Steering surface, re-checked against the code

- The root inbox is still inert after spawn:
  - The reducer resolves `researchDir` from `--artifact-dir` when given (`deep-research/scripts/reduce-state.cjs:3421-3423`) and reads `<researchDir>/inbox.jsonl` (`:3431`). A lineage therefore reads only `lineages/<label>/inbox.jsonl`.
  - `fanout-run.cjs` writes a lineage's inbox only in `writeLineageFrontierStore` (`runtime/scripts/fanout-run.cjs:619-638`, called at `:5533`), before spawn.
  - The lineage prompt tells the leaf to "never write the inbox or the node store" (`fanout-run.cjs:2854`). The lineage's own `step_frontier_admit` calls `frontier-admit.cjs admit` before each reduce (`deep-research/references/protocol/loop-protocol.md:424`).
- A write aimed at a lineage is not safe:
  - `admitProposals` appends to the store and inbox with bare `fs.appendFileSync` (`runtime/scripts/frontier-admit.cjs:194-196`, used at `:846`, `:866` and `:871`). There is no lock anywhere in `frontier-admit.cjs` or in the research reducer.
  - It mints node ids by read-then-append (`nextNodeSerial`, `frontier-admit.cjs:280-288`). An operator `admit` that runs at the same moment as the lineage's own admit can mint the same `F-d-NNN`. The store is last-row-wins per nodeId (`frontier-admit.cjs:7-8`), so one node would silently replace the other.
  - The only lock in a lineage folder, `lineages/codex-1/locks-and-fencing-v1/*/coordinator-state.json`, guards `ledgerId=deep-research-effect-ledger`. Nothing guards the inbox or the node store.
- Decision: no write to any lineage file. Every steer below is a "proposed steering" entry only.

### Expected noise

- My appends to this untracked file may appear as `containment_advisory` / `preserved_untracked` on the codex lanes, as they did for vibe. Those are my writes, not lineage drift.

### Check 4 (22:44 CET): top-up baseline

- Landed: nothing. Both lineages show `iterations: 0`, nodes `answered 0, open 3`, at their 21:43Z progress events. No `iterations/` folder or `deep-research-state.jsonl` yet in either lineage.
- Coverage per phase: no change from vibe (see check 2 and `lineages/vibe/research.md` §4).
- Drift: none to judge yet.
- Proposed steering (not appended, see Standing facts):
  1. codex-1, under F-1-001: "Do not re-derive vibe's schema verdicts. Test 006's grant expiry and revocation lifecycle and 010's record schemas, and for each phase name the first repo under `specs/system-skilled-bots/context/` to study, with file and line." Vibe named a repo in only one of ten iterations.
  2. codex-2, under F-1-002: "Review 007-per-bot-apps on its own: filtered-config write under concurrent runs, and what `ready` rests on." Vibe's iteration 6 was titled 007 and 008, but all eight findings were 008.
  3. codex-2, under F-1-004: "For 010, design the transcript line format, `@bot` routing grammar, per-section prompt budget and injection boundary, and propose a `design/` folder like 003's."

### Check 5 (22:58 CET): first codex iterations

- Landed: one iteration per lineage, at about 21:54-21:55Z, both `complete`. Each took about 14 minutes (xhigh). At that pace, 5 iterations each would end near 22:50Z.
  - codex-1 iteration 1, "Shared data contracts" (F-1-001): newInfoRatio 0.5, 4 findings, all P1, 15 `[SOURCE:]` tags.
  - codex-2 iteration 1, "Per-bot app isolation and vault boundaries" (F-1-002): 3 findings (P0, P0, P1), 6 `[SOURCE:]` tags.
- What each lineage knows of vibe:
  - codex-1's strategy says "Prior plan-depth analysis exists in the sibling vibe lineage; treat it as leads and verify every claim" (`lineages/codex-1/deep-research-strategy.md:177`). The iteration calls its own novelty "partially new", so the 0.5 ratio reads honest.
  - codex-2 cites the older `001-openbot-parity-research/.../lineages/vibe-2/` iterations, not this run's `lineages/vibe/`.
- codex-1 iteration 1, compared with vibe:
  - f1, a shared versioned `NeedsYouItem` contract for `kind`, `grants` and `conversationId` across 001/005/006/010: corroborates vibe's `contracts/` folder and `kind` collision (vibe iterations 1 and 5).
  - f2, 002 routine state schema and recovery: diverges. codex-1 proposes promoting 002 to a phase parent with four children, where vibe said addendum. Spot check: `002-routine-layer/plan.md:62` names `routines/<bot-id>.json` and `:71-72` name `untilMetAt`, `fatiguedAt` and the item id. A grep of 002's docs shows no field table or version for that file. The gap is confirmed. Whether it needs a phase parent is judgment.
  - f3, 005 memory line escaping and the append-versus-forget protocol: new.
  - f4, 006 grant rollback and a mixed-version downgrade: new. This is the first look at 006's lifecycle, which vibe left thin.
  - Ruled out: 010's `--transcript --json` payload is specified (`010-conversations/spec.md:153-157`).
- codex-2 iteration 1, compared with vibe:
  - f1, 007 P0: a shared run with no `apps` declaration reads the repository config. Diverges from vibe's "007 ready, P2 only". Spot check: the fact holds. `007-per-bot-apps/plan.md:68` says the shared-run child "reads the repository config", and `:116` has the integration test assert the `[]` record anyway. But the limit is decided and named, not open: `007-per-bot-apps/spec.md:104` and `:108` call it "the limit the risk table names". So this is a product decision the operator may want to reopen, not a decision left to the builder. Read the P0 as "should be P1 or an operator question". Either way, vibe's "ready" verdict misses it.
  - f2, 008 P0: same-user cross-bot read of secret values. Extends vibe's 008 findings (vibe's P0s were the name grammar and the env-key mapping).
  - f3, 008 P1: store concurrency and crash recovery. New. It is tagged `[INFERENCE: ...]`, not `[SOURCE:]`, though it names lines.
  - Verdict: 007 gets a narrow addendum. 008 becomes a phase parent with two children (access boundary and threat model, store lifecycle and recovery).
- Coverage per phase this check: 001, 002, 005, 006, 010 (codex-1), and 007, 008 (codex-2). No new coverage yet for 004, 009, 011, 012, 013, 014.
- Drift:
  - No hits on `003-terminal-screen/00[1-6]` in either iteration.
  - No `specs/system-skilled-bots/context/` repo named by either lineage yet. codex-2 notes the rakazo paths it first tried were wrong, and defers the reference check.
  - codex-1 re-covering F-1-001 is the expected duplication. It adds new ground on 005 and 006, so it is not pure re-derivation.
- Steering added: none.

#### The lead channel the brief does not name

- LOGIC-SYNC REQUIRED: the brief sanctions `frontier-admit admit` or an inbox append. That path takes no lock and mints ids by read-then-append (see Standing facts). The documented lead channel is `lineages/<label>/steer.md`. The lineage prompt says: "Before init, before each iteration, and before resolving any conflict, read .../steer.md when it exists. It is the lead's channel" (`runtime/scripts/fanout-run.cjs:2951-2953`; `runtime/scripts/README.md:83`). A lineage only reads that file and never writes it, so a write there cannot race. Both codex iterations record "`steer.md` absent".
  - I did not write it. The brief limits me to admit or inbox and says "Do not edit any other file". That rules `steer.md` out by scope, not because of a race.
- Lock facts, for the record:
  - Each codex lineage holds `.deep-research.lock`. codex-1's owner pid is 18663, which is already dead (transient owner). It is held for the whole loop ("one live deep-research writer per spec folder", `deep-research/references/protocol/spec-check-protocol.md:56-64`).
  - `frontier-admit.cjs` never consults that lock. It gives no safe path for an operator write.
- Proposed `steer.md` text, ready to paste on a rerun or by the lead now:
  - `lineages/codex-1/steer.md`:
    ```text
    Vibe already answered F-1-001, F-1-003 and F-1-005 (lineages/vibe/research.md section 4). Do not re-derive its verdicts.
    Spend remaining iterations on: 006 grant expiry and revocation lifecycle; 004 and 002 against the 003 benchmark;
    011 child split only where you disagree with vibe's six children.
    For every phase you touch, name the first repo under specs/system-skilled-bots/context/ to study, with file:line.
    Cite every finding as [SOURCE: path:line]. Do not review 003-terminal-screen's children.
    ```
  - `lineages/codex-2/steer.md`:
    ```text
    For 010-conversations, design the transcript line format, the @bot routing grammar, the per-section prompt budget
    and the injection boundary, and propose a design/ folder like 003-terminal-screen/001-ux-and-component-map/design/.
    Cover 009-skills and 005-memory user flows in the same pass.
    Then F-1-006: 012 scenario list, 013 alignment targets, 014 review dimensions, executor waves and stop rules.
    For every phase you touch, name the first repo under specs/system-skilled-bots/context/ to study, with file:line.
    Tag every finding [SOURCE: path:line], not [INFERENCE].
    ```

### Check 6 (23:05 CET)

- Landed: codex-2 iterations 2 and 3 (about 22:01Z and 22:04Z). codex-1 has nothing new since iteration 1. codex-1 marked F-1-001 `answered`, and its focus file now names F-1-003 (011), which vibe already covered with a six-child split.
- codex-2 now has all three seeds `answered` or in progress: F-1-002 and F-1-004 answered, F-1-006 being worked. It moves faster than codex-1, about 4 to 7 minutes per iteration against codex-1's 14-plus.
- codex-2 iteration 2, "Memory, skills and conversation flows" (F-1-004), 4 findings, all P1, 11 `[SOURCE:]` tags:
  - f1, 005 concurrency and crash semantics for shared memory. Corroborates codex-1 iteration 1 f3, so two lineages agree independently.
  - f2, 009 operator handoff after an accepted skill proposal: move, `bots install`, pin refresh, verify. New; vibe's 009 findings did not name it. Defect: one cite is a doubled path, `specs/system-skilled-bots/003-openbot-parity-build/003-openbot-parity-build/009-skills/acceptance-criteria.md:60-67`, which does not exist. The meant file is `009-skills/acceptance-criteria.md`.
  - f3, 010 transcript retention, rotation and migration deferred to a later packet. New.
  - f4, 010 has no design handoff and no pane-state contract. It proposes making 010 a phase parent with four children (transcript storage and lifecycle, routing and resume flow, TUI integration and design handoff, hardening). Corroborates vibe iteration 10 finding 6 ("no mockup") and goes further. Spot check: `010-conversations/` holds no `design/` folder (confirmed by `ls`). The no-design claim is tagged `[INFERENCE]`.
  - Not answered yet: the `@bot` routing grammar, prompt budget per section and the injection boundary. The F-1-004 question asked for these, and the iteration does not give them as designed artifacts.
  - Reference code: first named repos, `context/OpenBot-main` (4) and `context/turnstone-main` (1).
- codex-2 iteration 3, "Verification and review gates" (F-1-006), 2 findings, both P1, 6 `[SOURCE:]` tags:
  - f1, 012 failures in `scratch/failures.md` never reach 014's inputs. New. Spot check: `012-manual-testing-scenarios/tasks.md:144` (T046) lets a FAIL stand when filed in `scratch/failures.md`. Confirmed. I did not check 014's input list beyond the cited `plan.md:29-30` and `:58-66`.
  - f2, 014's executor preflight contradicts its fallback. New. Spot check: `014-deep-review/tasks.md:41` (T003) requires `command -v vibe pi opencode devin codex | wc -l` to print `5`, while `014-deep-review/plan.md:125` says "A missing binary drops its lineage; the fallback order in §8 replaces it". Confirmed.
  - Verdict: 012, 013 and 014 are "mostly yes". This agrees with vibe's "two rules" verdicts and adds two concrete contradictions. 013 got no finding of its own.
- Coverage per phase, all lineages so far:
  - Two-lineage coverage: 001, 002, 005, 006, 007, 008, 009, 010, 012, 014.
  - Vibe only: 004, 011, 013.
  - 003: benchmark only, no child hits in any codex iteration.
- Drift:
  - codex-1 has started re-covering 011 (F-1-003), which vibe answered in depth (iterations 2-3, six children). That is the lowest-value use of its remaining iterations.
  - The finding with no `[SOURCE:]` and the bad path in codex-2 are noted above.
  - No 003-children drift.
- Steering added: none (see Standing facts and Check 5).
- Proposed steering: codex-1, now: "Skip the 011 re-derivation unless you disagree with vibe's six-child split. Use iterations 2-5 on 004, 013 and the `context/` reference repo per phase." codex-2, for iterations 4-5: "Close F-1-004's open half: the `@bot` routing grammar, per-section prompt budget and injection boundary for 010, as concrete artifacts."

### Check 7 (23:13 CET)

- Landed: codex-1 iterations 2 and 3, codex-2 iteration 4. Totals: codex-1 3 of 5, codex-2 4 of 5. No terminal event yet.
- Status-log warnings since the restart:
  - `stall_detected` for both lineages at 21:45:24Z, during the slow first iteration. Both recovered.
  - `shared_checkout_detected` on codex-2 at 21:59:22Z (`newly_dirty_paths: 4`, cumulative 6). `git status` shows 394 changed paths. Most of them are the parent `002-openbot-parity-research/` being turned into a phase parent: its root docs and `research/` deleted, and `001-openbot-parity-research/`, `002-plan-review-research/` and `003-plan-depth-research/` untracked. That looks like another writer's restructure, not a lineage write. I have not attributed it. This research folder, and so this log, is currently untracked.
- codex-1 iteration 2, "Messaging channels depth" (F-1-003, 011), newInfoRatio 0.33, 6 findings, all P1, 21 `[SOURCE:]` tags. Cites `context/tinychannels-main` (6) and `context/rakazo-main` (3).
  - Corroborates vibe's 011 phase-parent verdict and its six children.
  - Adds four child-level specifics vibe did not pin:
    - the capability enum and per-transport matrix, plus the five conformance rules REQ-017 promises but names only two of;
    - the inbound ack-versus-enqueue crash boundary per provider;
    - link, queue and `channel list --json` JSON Schemas;
    - a provider setup and operations runbook.
  - Its approval-message mockups (f4) match vibe's design-folder ask.
  - The low ratio is honest. Use it as corroboration plus four refinements.
- codex-1 iteration 3, "Shared architecture and routine/computer-exposure depth" (F-1-005), 2 findings, both P1, 12 `[SOURCE:]` tags. Cites `context/OpenBot-main`.
  - f1, 002: OpenBot's cap of twenty enabled routines and its first-failure notice are neither adopted nor deferred. New parity point.
  - f2: proposes `contracts/runtime-architecture.md` with the module/import map, state-root tree, file ownership matrix and prompt/answer sequence. Corroborates vibe iterations 3 and 5.
  - 004 gets no finding of its own, which agrees with vibe's "004 ready".
- codex-2 iteration 4, "Runtime foundations and messaging", newInfoRatio 1, 2 findings, both P1, 16 `[SOURCE:]` tags. Cites `context/OpenGhost-main` and `context/tinychannels-main`.
  - Its own seeds were all answered, so it derived a focus over 001, 002, 004, 006 and 011. That overlaps codex-1 and vibe.
  - f1, 002: `bots enable` races an in-flight failed run, with no crash ordering across switch, state and item writes. Extends codex-1 iteration 1 f2 with a concrete race.
  - f2, 011: no message catalog or mockups. It proposes a Level 3 parent with a UX/message-catalog child first. Corroborates vibe and codex-1 iteration 2 f4. The ratio of 1 overstates novelty: three lineages now agree on this point.
- Coverage per phase, all lineages:
  - Covered by two or more lineages: 001, 002, 005, 006, 007, 008, 009, 010, 011, 012, 014.
  - Vibe and codex-1 only: 004, both "ready".
  - Vibe only: 013. codex-2 iteration 3 found nothing new there.
  - 003: no child drift.
- Gaps still open across all lineages:
  - The 010 `@bot` routing grammar, per-section prompt budget and injection boundary as designed artifacts.
  - 006 grant expiry and revocation lifecycle. codex-1 iteration 1 f4 covered rollback only.
  - A first reference repo for 001, 004, 005, 006, 007, 008, 009, 012, 013 and 014. Named so far: 002 (OpenBot), 010 and 009 (OpenBot, turnstone), 011 (tinychannels, rakazo, OpenGhost).
- Steering added: none.
- Proposed steering (unchanged channel, see Check 5): codex-2 iteration 5 should close the 010 routing, budget and injection artifacts rather than re-survey 011. codex-1 iterations 4 and 5 should cover 006 grant expiry and revocation, 013, and the per-phase reference repo.

### Check 8 (23:21 CET)

- Landed: codex-1 iteration 4, codex-2 iteration 5. codex-2 has written `synthesis_complete.json` and `lineages/codex-2/research.md`. Its state log records `synthesis_complete` with `stopReason: "maxIterationsReached"`, `totalIterations: 5`, `answeredCount: 3`. The runner has not yet logged a `completed` event for it.
- codex-2 iteration 5, "Cross-phase contract audit", status `insight`, newInfoRatio 0, no findings.
  - It says no new gap emerged and carries iterations 1-4 forward.
  - Its assessment confirms the 001→006 answer-scope sequence (`003-openbot-parity-build/spec.md:78-84`) and that delivery knows only `desktop` today (`runtime/lib/delivery.ts:44-50`).
  - It does not close the 010 routing grammar, prompt budget or injection boundary, so codex-2 ends with that F-1-004 half unanswered.
- codex-1 iteration 4, "Phases 007-009 security, persistence, and proposal lifecycle", 3 findings, 14 `[SOURCE:]` and 2 `[INFERENCE]` tags. Repos named: hermes-muse, OpenBot, OpenGhost, rakazo.
  - This is codex-2's seed ground. codex-1 has no seed left: F-1-005 is its last, and it shows `answered` in the reducer after iteration 3. So codex-1 has moved to derived questions.
  - f1, 007 P1: two concurrent runs on one worktree both write and restore `<worktree>/.utcp_config.json`, with no per-worktree lease. New. It is exactly the concurrent filtered-config test proposed in check 2, and a second, independent reason vibe's "007 ready" verdict is wrong. With codex-2 iteration 1 f1, 007 now has two P1-or-higher gaps.
  - f2, 008 P0: name grammar, env mapping, a versioned index schema, migration for existing `secrets:` and cross-backend forget semantics, all consolidated into `008-secret-store-contract-and-upgrade.md`. Corroborates vibe's two 008 P0s and adds the cross-backend and migration items.
  - f3, 009 P1: proposal creation writes `SKILL.md`, `proposal.json` and a needs-you item separately, with no crash-safe commit. New. It complements codex-2 iteration 2 f2, which covered the 009 operator handoff.
- Coverage per phase, all lineages (final for codex-2):
  - Covered by two or more lineages: 001, 002, 004, 005, 006, 007, 008, 009, 010, 011, 012, 014.
  - Vibe only: 013. No codex finding on 013.
- Still uncovered by any lineage:
  - 010: the `@bot` routing grammar, per-section prompt budget and injection boundary, as designed artifacts.
  - 006: grant expiry and revocation lifecycle.
  - 013: no second look.
  - First reference repo still unnamed for 001, 004, 005, 006, 012, 013 and 014.
- Drift: none into 003's children across all nine codex iterations so far.
- Steering added: none. codex-2 is past steering. codex-1 has one iteration left. Proposed for it: 006 grant expiry and revocation plus the 010 routing, budget and injection artifacts.

### Check 9 (23:35 CET): top-up run ended, monitoring stops

- Terminal events (run `1795642794796-3326pw`, runner 49113 has exited):
  - codex-2 `completed` at 22:20:58Z after 5 iterations, with `synthesis_complete` and `stopReason: "maxIterationsReached"` in its state log and `lineages/codex-2/research.md` written.
  - codex-1 `failed` at 22:33:32Z: "lineage codex-1 exited 0 but is not complete: the state log holds no terminal stop row (synthesis_complete or phase_synthesis_complete or synthesis)". That is `failure_class: exit`, `reason: no_terminal_event`, `retry_verdict: fatal`. Not quota.
  - `orchestration-summary.json`: `succeeded: 1`, `failed: 1`.
- codex-1's content is complete despite the failure:
  - All five iteration files landed, the last at 22:23:42Z. Its state log holds five `iteration` rows, all `complete`, and no synthesis row.
  - `lineages/codex-1/research.md` is a "Progressive Research Synthesis" with sections for iterations 1 to 5.
  - The lineage then idled about ten minutes and exited 0 without writing the stop row.
  - codex-1 logged `shared_checkout_detected` at 22:25:11Z with `cumulative_dirty_paths: 12`, equal to `churn_cumulative_threshold: 12`, about 90 s after its iteration 5 landed. That event only latches containment to `preserve` mode and appends a warning (`runtime/scripts/fanout-run.cjs:5798-5817`). It does not pause or halt the lineage. Root cause of the missing stop row: unknown, not established.
  - No merge has run (no merge event in the status log). If one runs, `fanout-merge.cjs` marks every codex-1 finding untrusted as `runner_failed:exit` (`fanout-merge.cjs:1120-1123`), and codex-1 does not vouch for coverage (`:1114-1115`). Read its findings from `lineages/codex-1/iterations/` directly.
- codex-1 iteration 5, "Phases 012-014 close conditions and evidence handoffs", newInfoRatio 0.5, 3 findings, all P1, 8 `[SOURCE:]` tags. No repo named, no 003-children hits.
  - f1, 012: REQ-006 and AC-006 let a run close with FAILs only filed in `scratch/failures.md`. Corroborates codex-2 iteration 3 f1 from the 012 side. Proposes `012-fail-close-and-post-fix-replay.md`.
  - f2, 013: 013 hands report folders and findings to 014, but 014 depends only on 013's acceptance rows and validator. New, and the first codex finding on 013. Proposes `013-to-014-evidence-handoff.md`.
  - f3, 014: the fix pass excludes a second review and does not rerun the affected 012 scenarios. New. Proposes `014-final-verification-loop.md`.
- Containment on the final events:
  - `containment_advisory` on both lanes lists untracked paths outside the lineages. Among them are the root `research/research.md` and `research/resource-map.md`, and new `design/` and `research/` files under `003-openbot-parity-build/003-terminal-screen/` (`002-architecture-and-contracts/design/*`, `005-answer-flow/design/state-machines.md`, `research/fable-review-1.md`, `research/context-manifest.md`).
  - Every path shows `preserved_untracked`, and the runner did not attribute any of them to a lane. No `containment_violation` was logged for either codex lane.
  - The root `research/research.md` is a synthesis draft ("Draft: Codex lineages still running", folding in codex-1 iterations 1-2 and codex-2 iterations 1-3 as of 22:10Z). Someone other than me wrote it, and it now trails the run by codex-1 iterations 3-5 and codex-2 iterations 4-5.
  - `containment_contested` again lists this steering log, which is my own write.
- Final coverage per phase, all lineages:
  - 001, 002, 005, 006, 010: vibe and codex-1, plus codex-2 on 005, 010 and 002.
  - 004: vibe and codex-1, both "ready" with nothing new.
  - 007, 008, 009: vibe, codex-2 and codex-1 iteration 4.
  - 011: vibe, codex-1 and codex-2.
  - 012, 014: all three lineages.
  - 013: vibe and codex-1 iteration 5.
  - 003: benchmark only. No codex iteration cited `003-terminal-screen/00[1-6]`.
- Gaps no lineage closed:
  1. 010: the `@bot` routing grammar, per-section prompt budget and prompt-injection boundary, designed as artifacts. F-1-004 asked for them, and codex-2 iterations 2 and 5 left them open.
  2. 006: the grant expiry and revocation lifecycle. codex-1 iteration 1 f4 covers schema rollback only.
  3. First reference repo per phase. Named so far: 002, 009 and 010 (OpenBot, turnstone); 007, 008 and 009 (hermes-muse, OpenGhost, rakazo, in codex-1 iteration 4); 011 (tinychannels, rakazo, OpenGhost). Unnamed: 001, 004, 005, 006, 012, 013, 014.
- Verdict changes against vibe, for the synthesis writer:
  - 007 is not "ready". It has two independent gaps: the shared-run repository-config limit (codex-2 iteration 1 f1, a decided limit, so better read as P1 or an operator question than P0) and concurrent worktree-config restore with no lease (codex-1 iteration 4 f1, P1).
  - 002 has a case for a phase parent (codex-1 iteration 1 f2), with a concrete `bots enable` race (codex-2 iteration 4 f1). Vibe said addendum.
  - 008 becomes a phase parent with access-boundary and store-lifecycle children (codex-2 iteration 1 f2 and f3, codex-1 iteration 4 f2).
  - 010 becomes a phase parent with four children (codex-2 iteration 2 f4).
  - 012→014 and 013→014 evidence handoffs and the 014 executor preflight contradiction are new across both lineages.
- Steering added in the whole top-up: none. Every steer was recorded as proposed, for the reasons in the Standing facts and Check 5.
