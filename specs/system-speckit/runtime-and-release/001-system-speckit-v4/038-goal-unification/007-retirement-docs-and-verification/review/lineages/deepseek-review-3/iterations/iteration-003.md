---
iteration: 3
focus: "traceability — the plugin's shared append against its documentation, and the log rule's own condition"
dimensions: [traceability, maintainability]
started_at: "2026-09-11T12:54:00Z"
status: complete
---

# Iteration 003 — traceability: the plugin's shared append against its documentation, and the log rule's own condition

## Scope

Phase 008 moved the packet-log append into the shared core and had the plugin call it (`../008-hardening-research/implementation-summary.md:70`, decision row `:94`), added `unbind` and `log` to the plugin tool surface, and narrowed the speckit `packet_goal.log` rule to the bound-session case. This iteration asks whether the documents that describe the plugin's import boundary and the command contracts that describe the log rule now match the shipped code — the axis pass 2 named for this pass.

Surfaces read: `.opencode/plugins/opencode-goal.js` (imports, action router, `log`/`packet`/`unbind`), `.opencode/hooks/goal/opencode/opencode-goal.js` (the claimed mirror), `.opencode/hooks/goal/README.md`, `.opencode/hooks/goal/goal-plugin.md`, `.opencode/plugins/README.md`, `.opencode/plugins/tests/opencode-goal-tool-path.test.cjs`, `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs`, all three speckit workflow YAMLs, `.opencode/commands/speckit/save.md`, `.opencode/commands/goal-opencode.md`, `.cursor/commands/goal-cursor.md`, `.opencode/hooks/goal/bin/goal.cjs`, `.opencode/hooks/goal/lib/goal-core.cjs`.

## Findings

### F305 — P2 — Three sentences in the hook README still say the OpenCode plugin imports only the slice module, while the plugin imports the core's locked append

**Dimension**: traceability | **Bears on**: ADR-003's shared-extractor contract and the phase-008 decision to log through the core | **Carry-over**: consequence of the phase-008 fix

**Evidence** (read at the cited lines):

- The plugin requires the core: `.opencode/plugins/opencode-goal.js:26-27` — `const { appendPacketLog: appendPacketLogShared } = require('../hooks/goal/lib/goal-core.cjs');` — and calls it in the `log` action (`:3024`).
- The README denies it in three places: `.opencode/hooks/goal/README.md:29` ("the OpenCode plugin requires `lib/goal-slice.cjs` and nothing else from this tree"), `:117` ("shares the kill switch, the state directory and `lib/goal-slice.cjs`, and imports nothing else from this tree") and `:140` ("The OpenCode plugin imports `goal-slice.cjs` only").
- The same file's State row was updated in the same round and gets it right: `.opencode/hooks/goal/README.md:143` ("packet-log locks live under the workspace's default state root").
- The sibling document is right too: `.opencode/hooks/goal/goal-plugin.md:34` ("shared with the runtime-neutral core so the frontmatter boundary is defined once"), `:42` ("appends one row below the packet's log anchor through the shared core's locked append") and `:113` ("through the shared core's locked append").

**Reproduction**: read-only; `grep -n "goal-slice.cjs\|goal-core" .opencode/hooks/goal/README.md .opencode/hooks/goal/goal-plugin.md` against the plugin's require block. The mirror is a real symlink (`.opencode/hooks/goal/opencode/opencode-goal.js → ../../../plugins/opencode-goal.js`, git mode `120000`), so there is no second copy to drift; the contradiction is only in the prose.

**Impact**: a reader who takes the import-boundary sentence as the contract concludes the two implementations cannot share a write path — which is exactly the property phase 008 changed to make the packet lock meaningful. The component README is the first document a maintainer opens. P2.

**Recommendation**: fold the shared append into the three sentences — the plugin imports and calls `goal-core.cjs`'s `appendPacketLog`, and nothing else. Report only; no fix in this review.

### F306 — P2 — The narrowed log rule permits a direct row append for "a packet no session is bound to", a condition no shipped surface can answer

**Dimension**: traceability | **Bears on**: ADR-004's single logged write path and the phase-008 narrowing of pass-2 F104

**Evidence** (read at the cited lines):

- The rule: `.opencode/commands/speckit/assets/speckit-plan.yaml:200`, `speckit-implement.yaml:165`, `speckit-complete.yaml:258` (same text, and `.opencode/commands/speckit/save.md:61`) — "On a bound session the goal command's log action is the only path: it takes the per-packet lock. A direct table-row append is allowed only for a packet no session is bound to."
- The session-free read reports no bound-ness: `describePacketGoal` returns exactly `packetPath, nested, durableChars, budgetState, hash, chatSlice, objectiveSlice` (`.opencode/hooks/goal/lib/goal-core.cjs:998-1006`), and the CLI's `packet` prints those plus nothing else (`.opencode/hooks/goal/bin/goal.cjs:211-219`).
- Every other read is per-session or aggregate: `show` needs the session's own record (`.opencode/hooks/goal/bin/goal.cjs:139-143`), `history` lists archives (`:273-291`), `doctor`/`health` return counts (`:293-307`). Nothing maps a packet to the sessions pointing at it; a bind exists only as `packetPath` inside one opaque per-session record (`.opencode/hooks/goal/lib/goal-core.cjs:950-965`).
- The two runtimes that must always take the carve-out cannot even ask: `/goal-cursor` exposes only the session-free `packet` read (`.cursor/commands/goal-cursor.md:2-3`, `:46`) and the Devin adapter has no command surface at all (`.opencode/hooks/goal/README.md:76`), so a Cursor or Devin agent appending a row cannot tell whether a Pi or OpenCode session bound the same packet.

**Reproduction**: the session-free read over the iteration-1 fixture packet prints the seven fields above and no bound-ness field; the CLI's `packet` with `--workspace` alone fails on the scope pre-check (F307), and with scope flags prints the same field set.

**Impact**: the qualifier that pass 2's F104 fix introduced is not actionable from any tool surface, so the safe reading ("never append directly") and the permitted reading ("append when nothing is bound") cannot be distinguished by the agent the instruction is written for. On the two injection-only runtimes it degrades to an unpinned direct append with no lock — the original F104 exposure, now narrowed in prose only. P2.

**Recommendation**: either give the session-free read a `packet_bound` field (a scan of the state root's active records for that `packetPath` is a bounded read), or drop the carve-out and state that tooling appends only through the log action, with the command surface itself as the guarantee. Report only; no fix in this review.

### F307 — P2 — The README says the session-free `packet` read needs only `--workspace`; the CLI refuses it without a session identity

**Dimension**: traceability | **Bears on**: the session-free read contract in ADR-001's vocabulary and the Cursor command's reachable surface

**Evidence** (read at the cited lines):

- The claim: `.opencode/hooks/goal/README.md:62` — "Current-session actions (`set`, `bind`, `unbind`, `resent`, `log`, `show`, `history`, `clear`, `complete`, `pause`, `resume`) require `--runtime`, `--session`, and `--workspace`; `packet` needs only `--workspace`." The same read is called session-free at `.opencode/hooks/goal/README.md:60` and at `.opencode/hooks/goal/goal-plugin.md:42`.
- The router disagrees: `.opencode/hooks/goal/bin/goal.cjs:386-393` runs `core.resolveGoalScope(options)` unless the action is one of `doctor`, `health`, `legacy-inspect`, `legacy-archive`; `packet` is not in that set, and `resolveGoalScope` throws `MISSING_SESSION_ID` before any handler runs (`.opencode/hooks/goal/lib/goal-core.cjs:180-183`).
- The action itself needs no identity: `runPacket` reads `options.scope.workspace` only (`.opencode/hooks/goal/bin/goal.cjs:206-219`), and the core API answers session-free when called directly. The shipped Cursor command works around the pre-check by inventing a scope — `node .opencode/hooks/goal/bin/goal.cjs packet <packet-path> --runtime cursor --session command-surface --workspace "$PWD"` (`.cursor/commands/goal-cursor.md:27`).

**Reproduction** (shipped CLI over the iteration-1 fixture):

- `… packet <fixture> --workspace <ws>` → `STATUS=FAIL ACTION=packet ERROR="Session identity is required" code=MISSING_SESSION_ID`.
- Adding `--runtime cursor` alone: still `MISSING_SESSION_ID`.
- With `--runtime cursortest --session cmd --workspace <ws>`: `STATUS=OK ACTION=packet` with all seven fields.

**Impact**: the one action documented — and documented again in the Cursor command — as needing no session is the one action whose documented invocation fails; the operator is pushed toward inventing a session identity for a read that never uses it. P2.

**Recommendation**: add `packet` to `actionsWithoutScope` in the router, so the documented invocation works and the Cursor command can drop its placeholder scope. Report only; no fix in this review.

## Ruled out

- The `opencode/` mirror being a second copy of the plugin that can drift: ruled out. It is a symlink (`git ls-files -s` mode `120000`, `readlink → ../../../plugins/opencode-goal.js`) and the README describes it as browsability-only, which the loader pattern confirms (it is outside `.opencode/plugins/`).
- The plugin's `log` action bypassing the lock: ruled out. It calls `appendPacketLogShared` (`.opencode/plugins/opencode-goal.js:3024`) with the record's workspace, so it takes the same per-packet lock as the CLI; the tool-path suite lands a row end to end (`opencode-goal-tool-path.test.cjs:230-233`).
- The offer-path bind rule missing from one of the three workflows: ruled out. All three YAMLs carry `bind_when_goal_present` exactly once (plan `:160`, implement `:125`, complete `:218`), and the resume YAMLs stay read-only.
- The plugin's `log` argument splitting diverging from the CLI's: ruled out. Both split `item` on `|` into item/state/evidence (`.opencode/plugins/opencode-goal.js:3023`, `.opencode/hooks/goal/bin/goal.cjs:197`), and `/goal-opencode` documents that shape (`goal-opencode.md:43`).
- `plugins/README.md` listing only `bind`, `resent` and `packet`: recorded as part of F305's family, not a separate finding — the list is introduced by "including", and `goal-plugin.md:42` carries the complete set.

## Coverage

| Item | Value |
|---|---|
| Dimensions touched | traceability, maintainability |
| Files reviewed | `opencode-goal.js:26-27,171,2976-3050`, `goal-core.cjs:180-183,950-1006`, `bin/goal.cjs:196-219,386-393`, `README.md:29,60,62,76,117,140,143`, `goal-plugin.md:34,42,113`, `plugins/README.md:31`, three YAMLs, `save.md:61`, `goal-opencode.md:41-43`, `goal-cursor.md:2-3,27,46`, `opencode-goal-tool-path.test.cjs:224-242`, `speckit-goal-offer-contract.test.cjs` |
| New findings | 3 (P2) |
| Reproduction fidelity | two shipped-CLI invocations over the fixture packet plus one direct core call; the remainder read at the cited lines |
| Prior-lineage closure verified | pass-2 F104 (narrowed: the rule now scopes the carve-out but leaves it undecidable), pass-2 F103/F105 (verification deferred to iteration 4) |

Review verdict: PASS
