# Research: Session relaunch loop through phases 024–032

## 1. Executive Summary

This ten-iteration review found one concrete settings-precedence defect: a valid live Pi or Hermes model can be replayed with the provider from the first launch when the live provider is absent. Two source-level concurrency risks need deterministic reproduction: withdrawal can race with the wrapper’s check-then-consume sequence, and Cursor’s shared model file can attribute one session’s choice to another. Both remain inferences rather than reproduced outcomes.

The review also found a documented goal-binding gap for manual Cursor and Devin claims, plus test gaps for reused notes when goal transfer is disabled, OpenCode 2’s equals-form --server flag, missing runtime executables, malformed persisted hop counts, and simultaneous note claims. Codex goal capture is intentionally unsupported and test-covered. OpenCode 2 and Devin replay limits match the shipped documentation.

The first iteration initially treated preservation of an existing goal_packet while SESSION_RELAUNCH_GOAL is off as a defect. The README explicitly requires the field to remain unchanged in that state, so the final classification is a narrower coverage gap around reused notes and a switch transition.

## 2. Scope and Method

The review covered the session-relaunch wrapper, hook adapters, goal core, OpenCode and Hermes plugins, handoff guidance, tests, README, and phase records through 032. It followed ten focused iterations and inspected existing test cases without running tests or changing implementation code.

The iteration artifacts are stored in this lineage. Each finding below gives file and line evidence and states what existing tests cover. Source-level inferences are labeled and include the reproduction needed to confirm the runtime outcome.

The lineage wrote only its own directory; this packet-level synthesis was compiled by the lead from it, with the lead verification in 9a and the Pi blackhole study in 11a.

## 3. Goal Packet Persistence

The handoff note is the canonical carrier of goal_packet. The pending loop record stores the handoff path and runtime settings, while consume rereads and validates the packet from the note; it does not duplicate goal_packet into the loop record. Tests cover this consume output shape. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:747-765; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:693-738; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2495-2516]

Sender discovery is runtime-specific. Claude reads the latest usable goal entry in its session log. OpenCode, Pi, Devin, Cursor, and Hermes resolve the active goal record. Codex returns no packet because its goal store does not map a thread goal to a packet; that limitation is documented and pinned by a test. [SOURCE: .skilled/hooks/session-relaunch/README.md:164-172; .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:51-58,625-691; .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2090-2100]

The disabled switch deliberately makes prepare and keep leave the note field unchanged. Claim and consume suppress transfer while the switch remains off. The current prepare test starts from an empty note, so it does not pin preservation of an existing field or the behavior if the switch changes before a later consume. [SOURCE: .skilled/hooks/session-relaunch/README.md:164-174; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:127-129,383-399; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2112-2125,2477-2516]

## 4. Receiver Binding and Environment Restoration

The wrapper removes inherited SESSION_RELAUNCH_GOAL_PACKET and claim-seed values from the first launch. On a relaunch it exports a validated packet from the consumed note, and clears the variable on a later hop without a packet. Focused tests cover both transitions. Claude starts on a freshly rendered /goal slice and carries the claim instructions through a start hook. Hermes receives the packet through HERMES_SPEC_FOLDER and restores the operator’s original value, or unsets it when no original value existed. [SOURCE: .skilled/bin/skilled-loop:471-484,755-784; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2634-2720,2734-2766,2833-2887]

Pi, Cursor, and Devin use the shared hook goal core to bind a packet when the new session has no live or archived goal. OpenCode’s plugin owns an equivalent session-start binder. These receiver paths guard against switch-off, dispatched children, invalid packets, and replacing an existing goal; the OpenCode binder has direct tests for those states. [SOURCE: .skilled/hooks/goal/lib/goal-core.cjs:1248-1290; .skilled/hooks/goal/lib/goal-core.test.cjs:1251-1320; .opencode/plugins/opencode-goal.js:2224-2269; .opencode/plugins/tests/opencode-goal-handover.test.cjs:68-145]

Cursor and Devin ship command-trigger relaunch adapters rather than automatic arm hooks. Their printed manual claim commands replay the seed but do not export the note’s goal packet, so those receivers cannot bind the sender’s goal through the manual path. The command shape is tested, but no manual-command test uses a packet-bearing note and asserts receiver binding. [SOURCE: .skilled/bin/skilled-loop:471-474,755-762; .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1186-1202; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2414-2434; .skilled/commands/speckit/handoff.md:97]

## 5. Model, Provider, and Effort Persistence

Launch arguments are captured per runtime and replayed by the wrapper. Current live settings take precedence when they are present and valid. Claude reads its latest main-chain session entry, Codex reads its thread rollout, Cursor reads cli-config.json, Pi supplies values when arming, and Hermes supplies model/provider from post_api_request. Devin has launch-model replay but no live model or effort source; OpenCode 2 does not replay a model flag at its root command. These limits are documented and covered by the runtime argument matrix. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:553-600,611-660,734-760,807-820; .skilled/bin/skilled-loop:515-568; .skilled/hooks/session-relaunch/README.md:42-47; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1315-1349]

A live model can be accepted without a live provider. In that case the wrapper leaves the provider captured from the original launch in place, even though the launcher’s comment says the model and provider move together. Pi and Hermes collect these values independently, so a valid new model can be paired with a stale provider. Tests cover changing both together but not a valid model with a missing or invalid provider. [SOURCE: .skilled/bin/skilled-loop:515-568,801-812; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:524-535; .skilled/hooks/session-relaunch/pi/session-relaunch.ts:401-417; .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:102-113; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1315-1349]

Cursor’s live model reader uses the shared ~/.cursor/cli-config.json and accepts its value when the file changed after this wrapper started. A second Cursor session can update that file after both wrappers launch, so this session may attribute and replay the other session’s choice. This is an inference from shared-file ownership and mtime-only checking. Tests cover a same-session update and an older config, but no two-session interleaving; such an interleaving would confirm the user-visible outcome. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:580-600; .skilled/bin/skilled-loop:655-658; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2368-2419]

## 6. OpenCode 2 and Devin Limits

When OpenCode help advertises --standalone, the wrapper adds it on the first launch and each automatic relaunch. A shared-server launch with --server avoids standalone and emits a warning because the wrapper cannot manage that service. OpenCode 2 also drops root-level model replay because that command does not accept -m. Tests cover first launch, repeated relaunch, standalone duplication, model dropping, and the separated --server URL form. The equals form --server=http://localhost:4096 is recognized in the code but lacks a test for launch arguments, warning, and no-arm behavior. [SOURCE: .skilled/bin/skilled-loop:352-363,573-578,617-635; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1029-1064; specs/hooks/023-session-relaunch-loop/032-opencode2-standalone-replay/spec.md:106-114,166-168]

Devin preserves a model given on its launch line but has no live model or effort reader and does not participate in the automatic arm path. These are documented capabilities, not defects found in this review. [SOURCE: .skilled/hooks/session-relaunch/README.md:42-47; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2421-2428]

## 7. Operator UX and Manual Recovery

The wrapper prints runtime-specific manual commands and fills a configured template only when it contains exactly one handoff placeholder. Invalid templates warn before fallback. Shell-sensitive path tests cover quotes, backticks, dollar signs, backslashes, and interactive Bash history expansion for bang characters. Line-broken paths are rejected or receive a warning instead of a manual command. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1186-1223; .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:892-1005; .skilled/bin/skilled-loop:845-857]

Hop-cap, stale-record, decline, cancellation, ordinary withdrawal, and nested-run behavior have focused tests. A missing runtime executable is different: the shell likely reports command-not-found and returns 127 through the non-relaunch path, but no wrapper test removes the selected binary from PATH and asserts the exit status and user-facing output. This is a test gap, not a reproduced behavior defect. [SOURCE: .skilled/bin/skilled-loop:661-673,834-891; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1820-1882,1969-1998]

## 8. Withdrawal, Stale Records, and Concurrency

The wrapper checks should-relaunch and later invokes consume as a separate operation. Withdrawal disarms the record under its lock, but consume reads the record before taking that lock, does not recheck status under the lock, then unlinks the current record. A withdrawal between approval and consume may therefore lose the race and still allow the already-approved relaunch. This is a source-level inference; current tests cover withdrawal and locked unlink separately, not the interleaving. A deterministic two-process test is needed to confirm the outcome. [SOURCE: .skilled/bin/skilled-loop:667-729; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:581-608,689-724; .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:965-971,1021-1026; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1642-1670; .skilled/hooks/session-relaunch/tests/withdraw.test.cjs:88-140]

The freshness check rejects future-dated and over-age armed records. Its hop check converts hops to a number and only rejects non-finite counts or counts at/above the limit, so syntactically valid malformed state with a negative or fractional count can pass. The record producer validates non-negative integer input, limiting the path to malformed or manually altered persisted state. Tests cover hop 9 and hop 10, but not negative or fractional record values. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1016-1054; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:496-511; .skilled/bin/skilled-loop:643-647; .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:807-860]

claimHandoff holds the note lock across the open-status check and write. Source inspection shows no race inside that transition, but tests only cover sequential claims. There is no concurrent two-process test asserting one winner, one rejection, and the winner’s claim metadata. Generic concurrent log tests do not cover this handoff path. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1065-1085; .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:278-304,1071-1101]

## 9. Findings and Test Coverage

1. **P2 — Model/provider precedence can mix a new model with the first-launch provider.** Pi or Hermes can supply a valid live model without a live provider; the wrapper updates the model and leaves the initial provider in place. Tests update both values together but do not cover missing or invalid provider beside a valid model. [SOURCE: .skilled/bin/skilled-loop:515-568,801-812; .skilled/hooks/session-relaunch/pi/session-relaunch.ts:401-417; .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:102-113; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1315-1349]

2. **P2 — Withdrawal may race with consume after wrapper approval.** The wrapper checks and consumes separately; consume does not revalidate the record under its lock. Withdrawal and consume-lock tests are separate, with no interleaved cancellation test. This is an inference, not a reproduced outcome. [SOURCE: .skilled/bin/skilled-loop:667-729; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:581-608,689-724; .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:965-971,1021-1026; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1642-1670; .skilled/hooks/session-relaunch/tests/withdraw.test.cjs:88-140]

3. **P2 — Cursor may replay another session’s live model.** The reader uses a shared config file and a post-launch mtime check without session identity. Tests cover same-session change and stale pre-launch config, not concurrent sessions. This is an inference requiring two-session confirmation. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:580-600; .skilled/bin/skilled-loop:655-658; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2368-2419]

4. **P2 — Manual Cursor and Devin claims do not transfer the goal packet.** Their printed commands carry the handoff seed and spec-folder answer, but not SESSION_RELAUNCH_GOAL_PACKET. Command replay is tested; packet-bearing manual receiver binding is not. The handoff guide documents this boundary. [SOURCE: .skilled/bin/skilled-loop:471-474,755-762; .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1186-1202; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2414-2434; .skilled/commands/speckit/handoff.md:97]

5. **P3 — A negative or fractional persisted hop count can pass the cap.** The reader checks finiteness and the upper bound, not non-negativity or integer shape. Tests cover 9 and 10 only; producer-side input validation does not validate a tampered record. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1044-1047; .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:841-860]

6. **P3 — Goal-switch tests omit an already-populated note.** The documented contract intentionally preserves the existing field when the switch is off. Tests start with an empty note and do not cover reuse or the inferred off-at-prepare/on-at-consume transition. This is a test gap, not a confirmed defect. [SOURCE: .skilled/hooks/session-relaunch/README.md:164-174; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:127-129,383-399; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2112-2125,2477-2516]

7. **P3 — OpenCode 2 lacks a test for the equals-form --server argument.** The parser branch appears to recognize it; tests cover only --server followed by a separate URL. This is a coverage gap, not a confirmed runtime defect. [SOURCE: .skilled/bin/skilled-loop:573-578,625-635; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1056-1064; specs/hooks/023-session-relaunch-loop/032-opencode2-standalone-replay/spec.md:106-114,166-168]

8. **P3 — Missing runtime binaries have no focused wrapper test.** The expected 127 status and command-not-found output are inferred from the shell path; tests cover other startup and consume failures but not a missing executable. [SOURCE: .skilled/bin/skilled-loop:661-673,834-891; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1820-1882,1969-1998]

9. **P3 — Simultaneous claims to one note lack a direct test.** The code locks the transition, but the tests only verify sequential behavior. Source inspection does not show a defect. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1065-1085; .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:278-304]

## 9a. Lead Verification

The lead re-read the evidence for the two P2 defects before accepting them.

- **Finding 1 confirmed by code.** `.skilled/bin/skilled-loop:803-805` applies a live provider only when one is present and the live model was accepted, so a live model with no live provider keeps the launch provider. Pi always hands both (`.skilled/hooks/session-relaunch/pi/session-relaunch.ts`), so the practical exposure is a Hermes request whose `post_api_request` carries no provider.
- **Finding 2 confirmed by code, window narrow.** `consume` reads the record outside the lock (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:693`) and unlinks it under the lock without rechecking its status (`:717-723`). The wrapper only asks after the runtime exited, so the window is limited to a hook firing as the runtime dies or an operator `cancel` from another shell.
- Findings 3 and 4 and the P3 items stay as the lineage classified them: inferences or coverage gaps, not reproduced defects.

## 10. Runtime Limits and Expected Behavior

Codex cannot currently map its per-thread goal record to a packet; its empty result is intentional and tested. OpenCode 2 does not accept a root-level model flag, and Devin has no live model/effort reader. These are documented limits rather than unexplained defects. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:51-58,662-691; .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2090-2100; .skilled/hooks/session-relaunch/README.md:42-47]

Goal transfer is path-based: the note does not copy goal text. Receivers read the current goal.md, which avoids embedding stale goal text in the handoff. The disabled switch’s note-preservation behavior is explicit in the README and is not treated as a defect here. [SOURCE: .skilled/hooks/session-relaunch/README.md:164-184]

## 11. Recommendations

1. Make model and provider replacement atomic: if either live value is missing or invalid, retain the launch pair or drop both according to one explicit policy. Add model-only and invalid-provider cases for Pi and Hermes.
2. Move withdrawal validation and record consumption into one locked transition, comparing status and arm identity under that lock. Add a deterministic cancellation interleaving test.
3. Attribute Cursor settings to the sending session or explicitly decline to replay an ambiguous shared-file value. Add a two-session fixture.
4. Decide whether manual Cursor and Devin claim flows should carry a goal packet. If yes, bind it through a validated first-launch environment path and test packet-bearing notes.
5. Validate persisted hops as a non-negative integer in shouldRelaunch, and add malformed-record cases.
6. Add focused coverage for --server=value, missing runtime executable behavior, simultaneous claims, and a reused note while the goal switch is off.

## 11a. Pi Blackhole Extension: Lessons For The In-Session Handover

pi-blackhole 0.5.15 (github.com/k0valik/pi-blackhole) replaces Pi compaction on this machine (`compactionEngine: "blackhole"`, `midRunCompaction: "resume"`, `compactAfterTokens: 272000`). A source study, with the load-bearing claims re-read by the lead, found no break in the handover:

- Every blackhole compaction (settled, inline mid-run, manual `/blackhole`, `/compact` takeover) goes through Pi `compact()`, which emits `session_compact` (Pi 0.87 `dist/core/agent-session.js:1940-1946`), so the compact-pointer fires.
- Our pointer is sent with no options; while a run streams, Pi steers it into the running loop (`agent-session.js:1494`), so it reaches the next model call after an inline compaction.
- The held nudge cannot be swallowed by blackhole's settled `ctx.compact()`: our follow-up keeps the session busy, and blackhole's idle wait yields to the next `agent_start`.
- Blackhole's observer reads `custom_message` entries (`src/om/ledger/progress.ts:22`, `src/om/serialize.ts:172`), so a pointer can become a model-written memory that outlives its note; `claimHandoff` refuses a non-open note (`relaunch-core.cjs:1072`), which contains the damage.

Lessons worth adopting, as proposals:

1. Deterministic decision capture: blackhole renders question-tool answers verbatim as `User decided: <question> → <answer>` (`src/extract/user-decisions.ts`). The after-compaction pointer could append the transcript's recorded answers, so approvals survive a compaction the note did not record.
2. Staleness by evidence: blackhole clears an outstanding error only when the same command later succeeds (`src/core/build-sections.ts:138-154`). The pointer could list commits and changed files newer than the note, so a stale Remaining work is neither redone nor trusted.
3. A clear dead end: the claim error for a non-open note could say the work is finished and must not be continued, as blackhole's recap says "Do not redo work already completed" (`src/core/format.ts:51-54`).
4. Arm Pi on `agent_settled`: Pi emits it only when no auto-retry, compaction or queued continuation will run (`agent-session.js:683-690`, the `_emitAgentSettled` emit, called from the run's finally block at :1471), a cleaner arm point than `agent_end`.

Operator configuration note: Pi native compaction is off (`~/.pi/agent/settings.json` `compaction.enabled: false`), so Pi's overflow retry never runs, and blackhole's 272000-token threshold sits at the window Pi reports for `gpt-6-luna`. A lower `compactAfterTokens` leaves headroom.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat the disabled switch as deleting a note’s existing goal field | The README explicitly says prepare and keep leave it unchanged while disabled; transfer is suppressed while the switch remains off. | [SOURCE: .skilled/hooks/session-relaunch/README.md:164-174; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2477-2516] | 1, 10 |
| Require goal_packet to be duplicated in the loop record | The handoff note is the documented carrier; consume validates and returns its packet, while the record stores the handoff path and settings. Tests cover that output. | [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:747-765; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:693-738; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2495-2516] | 1 |
| Treat missing Codex packet capture as a regression | The phase decision deferred the mapping and the resolver test pins an empty result. | [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:51-58,662-691; .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2090-2100; specs/hooks/023-session-relaunch-loop/027-goal-rebind-claude-and-codex/implementation-summary.md:57] | 1, 10 |
| Treat automatic packet export and clear behavior as untested | Wrapper tests cover packet export, switch-off suppression, inherited packet clearing, and later-hop clearing. | [SOURCE: .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2634-2720] | 2 |
| Treat Hermes environment restoration as untested | Tests cover goal export, no-packet behavior, and restoration of the operator’s original HERMES_SPEC_FOLDER. | [SOURCE: .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2833-2887] | 2, 10 |
| Treat the runtime argument replay matrix as absent | Tests exercise launch argument capture/replay across seven runtimes, with effort limited to runtimes that accept it. | [SOURCE: .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1315-1349; .skilled/hooks/session-relaunch/README.md:42-47] | 3 |
| Treat pre-launch Cursor config as live state | The reader ignores a config older than wrapper launch; same-session later changes are covered. Only cross-session attribution remains unverified. | [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:580-600; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2368-2419] | 4 |
| Treat OpenCode 2 or Devin constraints as implementation defects | Standalone, shared-server handling, root model dropping, and Devin’s launch-only model support match docs and tests. | [SOURCE: .skilled/bin/skilled-loop:352-363,573-578,617-635; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1029-1064; .skilled/hooks/session-relaunch/README.md:42-47] | 5 |
| Treat shell quoting and ordinary operator messages as unreviewed | Covered tests handle special characters, Bash history expansion, template fallback, hop cap, and withdrawal messages. | [SOURCE: .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:892-1005; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:786-900] | 6, 9 |
| Treat ordinary hop caps, freshness checks, nested-run suppression, or concurrent log append as broken | These have focused tests; remaining gaps concern malformed persisted counts, withdrawal interleaving, and concurrent note claims. | [SOURCE: .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:807-860,1069-1101; .skilled/hooks/session-relaunch/tests/withdraw.test.cjs:88-140; .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1820-1882] | 7, 8, 9 |

## Divergence Map

- Saturated directions: none; the run used the default convergence mode with `stopPolicy: max-iterations`, and the last ratio was 0.12 against a 0.05 threshold.
- Pivots taken: none recorded.
- Pivot failures and audited overrides: none.
- Remaining frontier: the two race inferences (withdraw against consume, Cursor shared config) need a deterministic two-process reproduction, and the manual Cursor and Devin goal-packet contract needs a product decision.

## 12. Open Questions

The generated strategy and findings registry still report all four configured questions as open (0 of 4 resolved), even though the iteration narratives cover each scope. The machine-owned question records were left as the reducer produced them; the lead should reconcile those records during lineage merge.

Runtime interleaving remains unconfirmed for the withdrawal race and Cursor model attribution. The switch-toggle scenario is also inferred; preserving the existing field while off is documented, while its behavior after re-enabling before consume lacks a test.

The manual Cursor and Devin packet boundary is documented. A product decision is still needed on whether their command-only first-launch path should transport a goal packet or remain a no-packet manual recovery path.

## 13. Confidence and Limitations

The model/provider mismatch and persisted-hop validation gap follow directly from the current control flow. The manual Cursor/Devin goal limitation is supported by wrapper behavior and handoff guidance. The equals-form server, missing-runtime, switch-transition, and simultaneous-claim items are coverage gaps rather than reproduced failures.

The cancellation and Cursor shared-config findings are source-level race inferences. A deterministic multi-process interleaving would confirm or disprove each user-visible outcome. No tests or live runtime sessions were run during this research pass; existing tests and recorded README probes were inspected as evidence.

## 14. Runtime Coverage Matrix

| Runtime | Sender goal source | Receiver binding / persistence | Model, provider, effort |
|---|---|---|---|
| Claude | Latest usable session-log goal | Starts on /goal slice; claim seed arrives through the startup hook | Live model/effort from session log; launch flags replay |
| Codex | No packet source; intentional unsupported mapping | No receiver packet by design | Live settings from rollout; launch flags replay |
| Cursor | Active goal record | Shared goal core can bind a packet, but automatic relaunch is unavailable; manual command omits packet | Shared cli-config.json model; concurrent attribution risk |
| Pi | Active goal record | Shared goal core binds on first turn | Adapter supplies model/provider/effort at arm; model-only provider fallback gap |
| OpenCode 2 | Active goal record | Session-start binder uses SESSION_RELAUNCH_GOAL_PACKET | Adds --standalone when supported; no root model flag; --server skips loop |
| Devin | Active goal record | Shared goal core can bind, but automatic relaunch is unavailable; manual command omits packet | Launch model only; no live model or effort reader |
| Hermes | Active goal record | HERMES_SPEC_FOLDER binds packet; original value is restored when next hop has no packet | post_api_request supplies model/provider/effort; partial-pair gap |

Sources: [SOURCE: .skilled/hooks/session-relaunch/README.md:42-47,164-193; .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:51-58,553-660; .skilled/hooks/session-relaunch/pi/session-relaunch.ts:401-417; .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:102-113; .hermes/plugins/repo-guards/__init__.py:632-668]

## 15. Suggested Test Cases

- Prepare a note that already contains goal_packet with the switch off; verify the documented preservation, then consume with the switch still off. Add a second case for the switch changing between prepare and consume.
- Supply a valid live model with a missing or invalid live provider for both Pi and Hermes; assert the chosen fallback policy.
- Start two Cursor wrapper fixtures against one cli-config.json and interleave model updates.
- Interleave should-relaunch approval, withdrawal, and consume with a barrier; assert cancellation wins or document the approved-hop rule.
- Feed shouldRelaunch negative, fractional, missing, and non-finite persisted hops.
- Run two claimHandoff processes against one open note; assert one claim wins and the other sees claimed.
- Pass --server=http://localhost:4096 to OpenCode 2 and assert warning, launch args, and no arm.
- Remove the selected runtime from PATH and assert the wrapper’s status and user-facing diagnostic.
- For Cursor and Devin, decide and test whether a manual claim binds a packet-bearing note.

## 16. Convergence and Workflow Notes

The run completed all ten iterations under stopPolicy max-iterations. Ratios fell from 0.75 to 0.12; the configured 0.05 threshold was not reached, and convergence remained telemetry only. The last three passes were persisted-hop validation (0.24), unusual paths and concurrent claims (0.22), and goal-switch semantics (0.12).

The reducer completed after each iteration with zero corruption. The lineage registry contains eleven key-finding entries because it retains both the iteration-1 switch-off framing and the iteration-10 reclassification; this report supersedes the earlier “defect” framing. The registry’s four questions remain open pending lead reconciliation.

The phase workflow’s parent-spec findings writeback and strict validation target outside this lineage and were skipped. The continuity-save phase was not run because it writes a temporary file outside the permitted surface and updates canonical parent continuity. The synthesis-deferred status will be recorded through the append gateway. No git staging was performed.

## 17. Proposed Implementation Order

1. Resolve or reproduce the two concurrency risks: cancellation versus consume, and Cursor settings attribution across sessions.
2. Correct model/provider pairing so a partial live update cannot mix providers.
3. Decide the Cursor/Devin manual packet contract and preserve goal binding if that path is meant to resume goals.
4. Add malformed persisted-hop validation and the smaller missing tests for server equals syntax, missing executables, reused goal notes, and concurrent claims.
5. Reconcile the four machine-owned questions and the iteration-1 reclassification when the lead merges this lineage.

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered in machine state: 0 / 4
- Remaining questions in machine state: 4
- Last 3 iteration summaries: iteration 8: persisted hop-count validation and stale/concurrent record coverage (0.24); iteration 9: handoff path quoting and concurrent claims by receiver sessions (0.22); iteration 10: goal switch-off semantics and receiver rebinding reconciliation (0.12)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics omitted by the workflow
