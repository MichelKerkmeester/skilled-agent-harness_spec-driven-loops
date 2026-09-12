---
iteration: 4
focus: "security — the log row as an input surface, and rebind history across the two implementations"
dimensions: [security, correctness]
started_at: "2026-09-11T13:02:00Z"
status: complete
---

# Iteration 004 — security: the log row as an input surface, and rebind history across the two implementations

## Scope

Phase 008 rewired the write path the log row travels (the shared `appendPacketLog` with a real-path lock), added the rebind-archives guard, `packet_state` and its hint, the truncation report, and the capability-aware reminder text. This iteration treats the log row as untrusted input, re-verifies the containment properties the rewiring touches, and checks the one phase-008 behavior the core and the plugin implement differently.

Surfaces read: `.opencode/hooks/goal/lib/goal-core.cjs` (sanitizers, `appendPacketLog`, `bindGoal`, `packetState`, `setGoal`), `.opencode/hooks/goal/lib/goal-slice.cjs` (path containment), `.opencode/plugins/opencode-goal.js` (`bindGoal`, `mutateGoal`, `unbindGoal`, `appendGoalBrief`, the archive call sites), `.opencode/hooks/goal/{pi,cursor,devin}/` reminder wiring, `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` (anchor parsing), `.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` (anchor integrity).

## Findings

### F308 — P2 — A log row carrying anchor markup passes the sanitizer and makes the packet fail the sufficiency rule it previously passed

**Dimension**: security | **Bears on**: ADR-004 (the log is the only region tooling writes) and the sanitizer contract that neutralizes tooling-owned markup | **Carry-over**: adjacent to pass-2 F104 (the log write path)

**Evidence** (read at the cited lines):

- The row writer sanitizes but does not neutralize anchor markup: `.opencode/hooks/goal/lib/goal-core.cjs:1063` — `const safeItem = sanitizeInlineText(item, 200)` — whose pipeline collapses newlines and folds role tokens but only special-cases `[active_goal]` markers, fences and instruction phrasing: `.opencode/hooks/goal/lib/goal-core.cjs:255-278`.
- The validator parses anchors line by line and treats a second opener for an id already on the stack as a hard error: `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:599-603` (`line ${lineNumber}: nested anchor '${id}' is not legal`), and any parse error becomes `SPECDOC_SUFFICIENCY_001` at severity `error` (`:1089-1097`). Unlike the orchestrator's own anchor integrity check, this parser is not limited to whole-line anchor syntax, so markup inside a table row counts (`:596-597`).

**Reproduction** (shipped CLI plus the shipped rule runner, fixture under this lineage's `scratch/anchor-inject/`):

- Clean fixture: `SPEC_DOC_SUFFICIENCY status=pass`, no diagnostics. Bind succeeds.
- One `log` invocation whose item is `documented the <!-- ANCHOR:log --> section`: `STATUS=OK ACTION=log mutation=logged`, and the row is present in the file exactly as typed.
- Same rule afterwards: `status=fail` with three errors — `anchor parse failure: line 26: nested anchor 'log' is not legal`, `anchor parse failure: line 21: unclosed anchor 'log'`, `goal.md:log is empty` — while the durable slice is byte-identical to the clean fixture and the append's own guard held (`GOAL_LOG_WRITE_REFUSED` never fired because the row sits below the anchor).

**Impact**: the sanctioned write path can invalidate the packet's own validation from a log item, and the item looks like an ordinary note about the document. The append is not a privilege boundary (anything that can append can edit the file directly), so this is not a privilege escalation; it is a correctness and robustness defect in the sanitizer's coverage, and the failure is loud rather than silent. P2.

**Recommendation**: extend the inline sanitizer to neutralize anchor markup the way it already neutralizes `[active_goal]` markers and fences — escape `<`/`>` or fold `<!-- ANCHOR:x -->` / `<!-- /ANCHOR:x -->` to a bracketed literal before the row is written. Report only; no fix in this review.

### F309 — P2 — A rebind archives the prior record in the core but overwrites it in place in the OpenCode plugin, so the two implementations keep different history

**Dimension**: traceability | **Bears on**: the rebind-archives guard the phase-008 summary reports as built (`../008-hardening-research/implementation-summary.md:57`) and the "one contract, two implementations" boundary | **Carry-over**: pass-2 F009 (archive-on-rebind, recorded open)

**Evidence** (read at the cited lines):

- The core archives before the new record is written: `.opencode/hooks/goal/lib/goal-core.cjs:945-949` — `if (current && (current.packetPath !== packet.packetPath || …)) archiveGoalRecord(current, goalScope)` — and the archive write is a real one, keyed on the record digest (`.opencode/hooks/goal/lib/goal-core.cjs:661-671`).
- The plugin's `bindGoal` has no archive step: `.opencode/plugins/opencode-goal.js:1818-1855` builds the next record and hands it to `mutateGoal`, which reads, mutates and writes the one file in place (`.opencode/plugins/opencode-goal.js:1691-1700`).
- The plugin's archive is session-cleanup only: `archiveGoalStateFile` is called from the stale-session sweep (`.opencode/plugins/opencode-goal.js:1541`) and from `session.deleted` (`.opencode/plugins/opencode-goal.js:3229`); nothing in the bind path calls it.

**Reproduction** (shipped CLI over the iteration-4 fixture): `bind specs/t/001-alpha` then `bind specs/t/002-beta` on one session reports `mutation=rebound` and leaves `history` at `archive_count=1`, whose archived record carries `packetPath="specs/t/001-alpha"`; the archive tree holds exactly that one file. The plugin half is read at every call site rather than exercised through its harness — the absence claim rests on the complete archive call-site list above.

**Impact**: on OpenCode the prior packet pointer and the operator copy derived from it are replaced with no history entry, so `history` cannot answer "which packet was this session on before", while the same action on Pi, Cursor and Devin keeps the record. The 008 summary reports the guard as built without scoping it to the core. P2.

**Recommendation**: either archive in the plugin's bind when the packet path changes, or state in `goal-plugin.md` and the 008 summary that rebind archiving is a core-only behavior. Report only; no fix in this review.

## Ruled out

- A hostfile log item smuggling structure into the durable slice: ruled out. A row containing `<!-- /ANCHOR:log -->`, a bare carriage return, a newline and a forged `[active_goal]` marker was written with the newlines collapsed, the marker folded to `[goal-marker-redacted]` and a role token folded to `system-role:`; the durable-slice guard held and the extracted slice stayed identical (`.opencode/hooks/goal/lib/goal-core.cjs:1096-1098`, `:255-278`).
- A packet reached through a symlinked directory or a symlinked `goal.md` escaping the workspace: ruled out. `bind`, `packet` and the core read all return `PACKET_GOAL_NOT_FOUND` for both, on real paths (`.opencode/hooks/goal/lib/goal-slice.cjs:188-200`); pass-1 F005's containment still holds after the rewiring.
- The phase-008 rebind archive: **verified in the core** (`archive_count=1` with the prior packet path, one archive file).
- `packet_state=missing` and its hint: **verified**. With the bound document deleted, `show` renders `packet_state=missing`, `packet_bound=false`, an empty `injection_preview` and the hint naming the cause (`.opencode/hooks/goal/bin/goal.cjs:139-143`).
- The text-set truncation report: **verified**. A 4,500-character objective returns `STATUS=OK ACTION=set` with `warning="objective was 4500 characters and was truncated to 4000; the tail is lost"` (`.opencode/hooks/goal/bin/goal.cjs:227-231`), so pass-2 F106 is closed on the CLI path.
- The reminder naming a command the runtime cannot run: ruled out. Each adapter names only what its own surface can execute — `/goal-pi resent` (`pi/goal-context.ts:197`), a fully scoped CLI line for Cursor (`cursor/goal-inject.mjs:86-87`) and Devin (`devin/goal-inject.mjs:72-73`) built from the session id each hook receives, `/goal-opencode resent` (`opencode-goal.js:2845`), with a generic fallback when no command is supplied (`goal-slice.cjs:144-148`).
- A stale or forged lock file in the new workspace-root lock directory granting a writer priority: not reachable without write access to the workspace state root, and the stale window is 120 s against a millisecond operation (`.opencode/hooks/goal/lib/goal-core.cjs:56-58`, `:555-568`).

## Coverage

| Item | Value |
|---|---|
| Dimensions touched | security, correctness |
| Files reviewed | `goal-core.cjs:255-300,540-583,661-671,945-949,1035-1101,1150-1195` (set), `goal-slice.cjs:144-148,178-203`, `opencode-goal.js:1691-1700,1818-1855,2840-2852,1541,3229`, `pi/goal-context.ts:197`, `cursor/goal-inject.mjs:86-87`, `devin/goal-inject.mjs:72-73`, `bin/goal.cjs:139-143,227-231`, `spec-doc-structure.ts:570-610,1085-1097`, `orchestrator.ts:666-711` |
| New findings | 2 (P2) |
| Reproduction fidelity | four fixture runs through the shipped CLI (rebind, missing document, truncation, hostile row) plus three rule runs; the plugin's archive gap read at every call site |
| Prior-lineage closure verified | pass-2 F106 (fixed), pass-2 F009 (fixed in the core, not in the plugin), pass-1 F005 (still holds) |

Review verdict: PASS
