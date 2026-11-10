---
title: "Goal Unification Hardening — Research Synthesis (deepseek lineage)"
trigger_phrases:
  - "goal unification hardening research"
  - "packet goal hardening findings"
---
# Goal Unification Hardening — Research Synthesis (deepseek lineage)

Research topic: what makes the shipped packet-bound goal system more robust, better integrated, easier for the operator, and smaller. Five iterations, one charter angle each, `stopPolicy: max-iterations`, executor `cli-pi` / `deepseek-v4.1-flash` at max effort. Every row below cites the file and line it changes and the test that would pin it; nothing was implemented, and nothing was written outside this lineage directory.

Evidence labels: **Confirmed** — read directly at the cited line. **Inferred** — supported by the cited lines but the failure needs a trigger not exercised here; the confirmation step is stated. **Unknown** — requires a runtime condition this research could not create.

## 1. Executive Summary

The packet-bound model is coherent at its center: one extractor, one writer for the log, one hash predicate for the resend, and a fail-closed unbound state when the directive escapes or disappears. Thirty findings sit around that center, and the three that matter most are integration and UX, not correctness: the lifecycle's offer path never binds (so the packet-backed model silently degrades to a text goal), the plugin cannot log or unbind and answers an unknown action with success, and the resend flow asks the operator to paste back up to 4,000 characters that the record could rewrite itself. Hardening adds four narrow defects, two of which (the reversed extractor parity and the alias-bypassed packet lock) the phase-007 review did not file. The overengineering pass found less to remove than expected: two unread projection fields and one unread record field, plus a pair of duplicated envelope lines; the manifest budget, both slices, both `packet` surfaces and both renderers all have named callers.

Ranked action: twelve small certain changes (do now), twelve needing a decision or harness (do next), nine defended designs (do not). Full ranking with scores in `iterations/iteration-005.md`.

## 2. Method and Evidence Boundary

| Iteration | Angle | Closed |
|---|-------|--------|
| 1 | Hardening | Where a bound session can still be lied to or left silent — extractor parity, packet races, stale workspace, encodings, binding containment |
| 2 | Integration | Where the shipped pieces still do not meet — bind wiring, save-path log fork, plugin action surface, native runtimes, retrieval vocabulary |
| 3 | Operator UX | The operator's day — set, edit a criterion, reminder, set again, switch packets, finish |
| 4 | Overengineering | Caller-or-remove for unread fields, duplicate surfaces, envelope lines and restating docs |
| 5 | Synthesis | Ranked do now / do next / do not |

Scope boundary: the eight frozen decisions were treated as fixed; no finding requires reopening one. The phase-007 review's fifteen findings were inputs; overlaps are merged and their current state is noted only where this research touched the same lines. Write surface: `research/lineages/deepseek/` only.

## 3. Deliverable 1 — Hardening Table

| # | Defect | Line | Smallest fix | Test |
|---|--------|------|--------------|------|
| H1 | Extractor parity drift reversed: the validator's fence regex is stricter than the runtime's since the phase-007 tolerance fix, so a compliant file's budget is measured including its frontmatter | `goal-slice.cjs:24` vs `spec-doc-structure.ts:1028` | Give `extractGoalDurableSlice` the runtime's tolerant pattern, or export one pattern both import | Fixture with trailing whitespace on each fence; assert equal slice and equal measured count |
| H2 | Bare-CR line endings bypass both the fence and opener patterns, so `splitFrontmatter` returns the whole file as body and the chat/CLI slice leaks the YAML, including `session_id` | `goal-slice.cjs:37`, `:43`; `spec-doc-structure.ts:1027` | Normalize `\r\n?` in both extractors | CR-only fixture: assert `frontmatter !== null` and no `session_id` in any slice |
| H3 | The packet lock is keyed on the lexical path while containment is judged on realpath, so an in-workspace alias and the real path take different locks and two `log` appends can interleave; the later rename wins and a row disappears | `goal-core.cjs:894–896`; `goal-slice.cjs:166–169` | Key the lock on the packet's realpath (already on the projection) | Two-writer test through alias and real path with a delay; assert both rows present |
| H4 | Core prefers the caller's live workspace; the plugin prefers the record's stored workspace, so one session can inject two different directives after a move or a copied record | `goal-core.cjs:889` vs `opencode-goal.js:2703` | One resolution order in the shared core; plugin delegates | Record with a fictional workspace plus a live directory; both surfaces read the live file |
| H5 | `readPacketGoal` can throw where its contract says fail-open: the `statSync` for `mtimeMs` sits outside the read guard | `goal-slice.cjs:236` | Move the stat inside the guard, or delete the field (see O1) | Delete/unlink between read and stat; assert `null`, not a throw |
| H6 | The first log append rewrites a non-UTF8 goal.md as UTF-8 with U+FFFD, destroying bytes; the hash guard cannot see it because both sides hash the same lossy string | `goal-core.cjs:1048`, `:1073` | Read bytes as a Buffer and refuse when re-encoding is lossy, or append without re-encoding | Latin-1 fixture; assert a named refusal or byte-identical content outside the new row |
| H7 | A CRLF goal.md gains a bare-LF row on every append because the read is raw and the splice inserts `\n` | `goal-core.cjs:1057–1068` | Detect the dominant terminator and reuse it for the inserted row | CRLF fixture; assert uniform terminators after a log |
| H8 | The binding table's escape check is lexical only — no realpath containment — so a symlinked child outside the workspace passes, while the runtime refuses the same escape elsewhere; the `..` substring test also rejects legitimate names | `spec-doc-structure.ts:1070` | Realpath both sides and require containment; keep the lexical test as a fast refusal for `..` path segments | Symlinked child fixture; legit `..` name fixture |
| H9 | The missing-child binding rule only sees backticked targets, so a row in link notation bypasses it silently | `spec-doc-structure.ts:1065` vs `goal.md.tmpl:80` | Extract link targets too, or warn on a binding-table row with no backticked path | Link-notation row naming a missing child; assert error or warning |

## 4. Deliverable 2 — Integration Seam Table

| # | Seam | Who hits it, how often | Fix |
|---|------|------------------------|-----|
| I1 | `packet_goal.bind_by_runtime` is a reference table with no step that calls it; `set_mutation` calls only `set`, so an offered goal leaves the session unbound and the packet file is never the source | Every operator who accepts the offer in plan, implement or complete | When the resolved packet has a `goal.md`, call `bind` instead of `set` — `bindGoal` already writes objective and prompt from the file (`goal-core.cjs:932–933`); collapse the table into the step |
| I2 | The plugin's action whitelist omits `log` and `unbind`, and an unknown action silently falls back to `show`, returning success-shaped output | Every OpenCode save (log) and every recovery from a wrong pointer | Add both actions to `GOAL_ACTIONS` and the dispatch switch; replace the silent fallback with a named error |
| I3 | The goal contract documents live under `.opencode/hooks/`, outside `CORPUS_ROOTS`, so the trigger index can never surface them; operator phrasings ("set the goal", "bind goal", "resend goal", "goal log") have zero entries among 35,924 phrases | Every lookup that mentions a goal | Add `.opencode/hooks` to the corpus roots and the phrasings to the two documents, or accept routing and point the indexed feature catalog at the contract |
| I4 | The save workflow offers the locked CLI append and an unlocked hand append with equal footing | Every save where a `goal.md` exists; bites only under a race | Make the log action the only path on a bound session; keep the hand append for unbound packets |
| I5 | Claude Code and Codex have no adapter, so no durable-slice hash exists to compare and the reminder is prose only | Every command entry on those two runtimes | Render the slice when `goal.md`'s mtime is newer than the session's start, or document the boundary as accepted |

## 5. Deliverable 3 — UX Friction Table

| # | Moment | Friction | Change | Wording |
|---|--------|----------|--------|---------|
| U1 | Edit a criterion → set again | Three manual steps including an operator paste of up to 4,000 durable characters; `bind` + `resent` already rewrite the record from the file | Split the reminder by runtime capability; drop the operator-set clause where an adapter exists | `[goal_resend_pending] The bound packet goal.md (<path>) changed above its log. Render its durable slice in chat, frontmatter excluded, refresh the stored copy with the goal command's bind, then record the send with resent. Keep working meanwhile.` |
| U2 | Switch packets, or lose one | `show` reports `packet_bound=true` after the document is gone; the render path injects nothing, leaving the operator with "bound" and silence | Derive the field from resolution; add `packet_state=bound\|missing\|unbound` and a hint | `hint='the bound packet goal.md is missing; this session injects nothing until it is rebound'` |
| U3 | Read the injected goal | `sanitizeInlineText` flattens the objective slice, so the `DONE WHEN:` criteria render as a run-on sentence, truncated near the preview cap and cut mid-phrase | Render criteria as their own list field and cut at item boundaries | `objective: Execute <path>/goal.md.` / `criteria: 1) … 2) … 3) …` |
| U4 | Read the usage envelope | `tokens 0/none` states a ratio that does not exist; the provenance footnote rides every system prompt | Omit the tokens segment when no budget is set; move provenance to `show` | `usage: time 12s; turn 3` |
| U5 | Get reminded on cursor or devin | The reminder names the goal command's resent action, which those runtimes do not expose; the pending bit can stay set | The adapter composes the exact command it knows, or the clause is suppressed where no surface exists | `record with: node .opencode/hooks/goal/bin/goal.cjs resent --runtime Cursor --session <sid> --workspace <root>` |
| U6 | Set a goal, check state | `show` answers with seventeen `KEY=VALUE` lines, two embedding entire documents, at equal weight with what matters | Keep the machine envelope; add a first-line summary and a `--human` mode with the injection block unquoted | `goal: bound to <path> | durable 1,842/3,000 chars | resend pending | status active` |
| U7 | Switch packets | Rebinding drops the prior record without archiving because the guard compares a spread copy to itself | Archive whenever a rebind replaces an active record with a different pointer | n/a |

## 6. Deliverable 4 — Overengineering Table

| # | Item | Caller today | Verdict |
|---|------|--------------|---------|
| O1 | Packet projection `content` and `mtimeMs` | None — the plugin's mtime stats are other files; the log re-reads under its lock | Remove; the throw path H5 goes with them |
| O2 | Record field `lastCheckAtMs` | Written and normalized in the plugin; never rendered | Remove, or render it; today neither |
| O3 | CLI `injection_preview` line | Nothing parses it; the plugin gates it behind an option | Gate it the same way |
| O4 | Envelope `last_check` / `verifier_last_verdict` and `usage_source` / `budget_usage_source` | One value printed twice each | Keep one of each |
| O5 | `goalDurableBudget` manifest block | Runtime resolver, validator resolver, validation reference | Keep — a constant would hardcode the pair in two implementations that already drifted |
| O6 | `packet` action on three surfaces | CLI (cursor command), plugin (opencode command), core (`describePacketGoal`) | Keep — two user surfaces, one implementation |
| O7 | Reminder text length | ~250 characters per turn while pending | Keep; only the operator-set clause moves (U1) |
| O8 | Posture restated in five documents | AGENTS.md (always-on), README (contract), playbook (how-to), three lifecycle assets (the only surface Claude Code/Codex load), SKILL.md | Trim the SKILL.md paragraph to a pointer; keep the rest; lint the three asset blocks |
| O9 | Two near-duplicate renderers | Both surfaces render; usage lines differ by design | Keep both; state the intended differences and add a label-parity test |

## 7. Deliverable 5 — Ranked Recommendations

Full scored table with files and tests: `iterations/iteration-005.md`.

**Do now (small, certain)**: reminder capability split; validator/runtime extractor parity; `show` packet truth; bind wired into the offer path; alias-safe packet lock; plugin `log`/`unbind` plus a named unknown-action error; rebind archiving; save-path log wording; envelope gating and de-duplication; `\r\n?` normalization; projection field removal (retires H5); `lastCheckAtMs`.

**Do next (needs a decision, harness or shape change)**: canonical workspace resolution; criteria list field; renderer parity test; three-asset block lint; goal contract docs in the retrieval corpus; non-UTF8 append policy; binding-row realpath containment and link notation; plugin brief cache keyed on the slice hash; lock-scope doc truth; a resend signal for Claude Code and Codex; the cursor/devin reminder command; re-verify the untouched phase-007 P2 items (F008, F011, F012, F015).

**Do not**: collapse the two slices; replace the budget manifest with a constant; drop bound records' stored objective/prompt; remove `legacy-*` actions; merge the two renderers; shorten the reminder; reopen the frozen decisions; add lock files beyond realpath keying; replace the machine envelope.

## 8. Convergence Report

- **Stop reason**: `maxIterationsReached` (hard cap; convergence before the cap was telemetry only, per `stopPolicy: max-iterations`).
- **Iterations**: 5 of 5 complete.
- **Questions answered**: 5 of 5 (hardening, integration, UX, overengineering, synthesis).
- **newInfoRatio trend**: `1.00 → 0.90 → 0.85 → 0.80 → 0.35`; rolling average (last 3) 0.6667; the final drop is the synthesis iteration's bookkeeping effect, not a signal.
- **Quality guards**: sources are all repository files read at the cited lines; focus alignment is one charter angle per iteration; no finding rests on a single weak source.

## 9. Unknowns and What Would Confirm Them

- **Alias race (H3)**: inferred from lock naming; a two-writer test through an alias would confirm the lost row.
- **Non-UTF8 append (H6)**: Node's replacement decoding is documented behavior; a Latin-1 fixture run through `log` confirms the corruption.
- **Advisor vocabulary (I3)**: the router keywords exist in `SKILL.md:158`; a `skill-advisor` run on "set the goal for this packet" confirms the route.
- **Cursor/Devin reminder loop (U5)**: inferred from the shared text and the missing management surface; a session on either runtime confirms whether the agent can compose the scope flags.
- **Plugin workspace precedence (H4)**: confirmed by reading both lines; the failure needs a moved checkout to exercise.

## References

- Iteration evidence: `iterations/iteration-001.md` … `iteration-005.md`; deltas `deltas/iter-001.jsonl` … `iter-005.jsonl`.
- Frozen contract: `specs/system-speckit/033-system-speckit-v4/036-goal-unification/002-decisions-and-contract-freeze/decision-record.md` (ADR-001 to ADR-008).
- Prior review: `specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review/review-report.md` (F001–F015).
- Source corpus: `resource-map.md` in this directory.
- `resource-map.md` was absent at the parent spec folder, so the coverage gate is informationally skipped.
