# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin-2`, pass two)
- Session: `fanout-render-hooks-plugin-2-1794570021136-noekp0`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin` — the shared session readers and their tests
- Operator review focus addressed this iteration: pass-one fix verification for the session-reader cluster (`R1-P2-002--fabc628596e7`, `R1-P2-003`, `R1-P2-004`, `R4-P2-001--09ff48e9a0b9`) and "behaviour on claude, codex, opencode, pi, devin and dsh" through the reader layer.
- Budget profile: `verify` (11 analysis actions)

## Files Reviewed

- `.skilled/hooks/shared/session-readers/claude.mjs:158-250` — attachment extraction, containment-resolved read, injected list
- `.skilled/hooks/shared/session-readers/devin.mjs:182-250`, `:312-450` — chain injection, database projection return shape, transcript fallback
- `.skilled/hooks/shared/session-readers/dsh.mjs:238-250`, `:280-335` — injected notices, contained read, decoder locator
- `.skilled/hooks/shared/session-readers/pi.mjs:160-290` — custom-message extraction, pre-read containment, guard re-resolution
- `.skilled/hooks/shared/session-readers/index.mjs:100-150` — `readSession` vs `loadSession` envelopes
- `.skilled/hooks/shared/session-readers/README.md:15-50` — contained-open rule, `injected` contract, failure codes
- `.skilled/hooks/shared/tests/session-readers/devin.test.mjs:60-135` — damaged-database fallback, injected continuation
- `.skilled/hooks/shared/tests/session-readers/dsh.test.mjs:40-95` — injected notice, unsourced event fail-closed
- `.skilled/hooks/shared/tests/session-readers/pi.test.mjs:112-171` — custom message, linked-outside refusal
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/advisor-runtime-list-parity.vitest.ts:120-140` — capabilities parity
- Git diff `35c3188681..HEAD` for all files above

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. The four reader fixes hold and the new `injected` list is documented where the two envelopes diverge.

## Pass-One Fix Verification

- **R1-P2-002--fabc628596e7 (open `containment.path`, not the caller path) — fix holds in all four readers.** `claude.mjs:217` reads `storePath` (the `resolveInside` result assigned at `:214`); `devin.mjs:354` reads `storePath` inside `loadTranscript`; `dsh.mjs:313` reads `storePath` while passing the locator name only to the decoder; `pi.mjs:233-262` resolves before the header read and opens `guard.path`. Each call site is the only read of the session bytes in its reader.
- **R1-P2-004 (`devin.mjs:395`, database failure must fall through to the transcript) — fix holds.** `transcriptFallback` at `devin.mjs:397-405` is used by the open failure (`:415`), the chain failure (`:431`) and the catch-all (`:449`). `tests/session-readers/devin.test.mjs:66-76` overwrites `sessions.db` with `not a database` and asserts the transcript wins with `locatorKind: 'transcript_file'`. The pass-one caveat (a transcript that also fails keeps `store_unreadable`) is exactly the README sentence added at `README.md:48`.
- **R1-P2-003 (`dsh.mjs:195`, an unsourced operator message stays fail-closed) — fix holds.** `injectedFromEvents` at `dsh.mjs:241-257` classifies every `user/message` whose `source.kind` is not `OPERATOR_SOURCE` as injected, with `source: 'unknown'` when no source names one. `tests/session-readers/dsh.test.mjs:64-84` pins it: the unsourced text appears in `injected` as `unknown` and in no record. The reader README states the rule at `README.md:35`.
- **R4-P2-001--09ff48e9a0b9 (`index.mjs:28`, capabilities not in the parity test) — fix holds.** `tests/hooks/advisor-runtime-list-parity.vitest.ts:134` compares `Object.keys(capabilities).sort()` with `ADVISOR_RUNTIME_VALUES`. The test passed.
- Test run: `env -u AI_SESSION_CHILD npx vitest run tests/hooks/advisor-runtime-list-parity.vitest.ts` -> 1 file, 1 test passed, exit 0. The reader suites are `node:test` files whose run is recorded in iteration 010 of the pass-one lineage; this pass read the changed cases line by line instead of re-running the whole suite.

## Traceability Checks

| Protocol | Level | Status | Notes |
|---|---|---|---|
| `spec_code` | core | partial | The `injected` contract matches README; the two envelopes (`readSession` projected, `loadSession` raw) are documented at `README.md:31`. |
| `checklist_evidence` | core | notApplicable | No checklist row governs the reader layer. |
| `skill_agent` | overlay | notApplicable | No agent definition in this area. |
| `agent_cross_runtime` | overlay | pass | Claude, Pi, Devin and DSH readers each expose `injected`; Codex and OpenCode readers are unchanged and the dispatcher forwards the field only when a reader returns it (`index.mjs:138-143`). |
| `feature_catalog_code` | overlay | deferred | Reader behavior is described in `hooks-and-plugin/claude-hook.md`, reviewed in iteration 4. |
| `playbook_capability` | overlay | notApplicable | No playbook surface in this iteration. |

## Integration Evidence

- Dispatcher surface: `.skilled/hooks/shared/session-readers/index.mjs` exports `readSession` (projected) and `loadSession` (raw); the raw path is the only one that carries `injected` (`:135-145`), and the README names that split so a caller cannot expect it from `readSession`.
- Consumer named: the callers that check `capabilities` before offering history are the compaction hooks and the lookup CLI (`index.mjs:1-8`), not the dispatcher.
- Containment helper named: `resolveInside`/`guardSessionPath` in `.skilled/hooks/shared/session-readers/identity.mjs:93-138`.

## Edge Cases

- **Scope-marker accuracy.** `review/review-scope-2.txt` marks 30 of this area's 59 files `no` for "changed since pass one" although `git diff 35c3188681..HEAD` names every one of them; the marks therefore mean "unchanged since pass one closed", not "unchanged in the window". The 29 `yes` files were reviewed line by line and the `no` files were read where a `yes` file depends on them (`index.mjs` envelopes, `claude.mjs` read path, `identity.mjs` guards). No code defect follows; recorded so the merged report does not claim the `no` rows were skipped.
- **DSH decoder takes the locator name.** `decodeSessionLog(readFileSync(storePath), logPath)` picks zstd by the locator extension while reading the resolved target. A file-level link whose name and target extensions differ would decode wrongly, but the pre-fix code read the same bytes through the link and chose the same decoder, so the fix neither introduced nor widened it. Recorded under Ruled Out.
- **Devin `session_ambiguous` collapse.** When the database fails and the transcript path is ambiguous, `transcriptFallback` reports `store_unreadable` rather than `session_ambiguous`. The README sentence makes that the stated contract for the Devin fallback, and the dominant condition is the failed database, so this is not a finding.

## Confirmed-Clean Surfaces

- No reader opens a path before its containment check: each read site uses a value returned by `resolveInside` or `guardSessionPath` (`claude.mjs:217`, `devin.mjs:354`, `dsh.mjs:313`, `pi.mjs:233`).
- `injected` is never folded into `records`: the DSH unsourced event and the Pi custom message are asserted absent from records (`dsh.test.mjs:78-83`, `pi.test.mjs:134-136`).
- `readSession` still returns one envelope and never throws; `loadSession` forwards `injected` only when the reader returned an array (`index.mjs:138-143`).
- The capability table marks `cursor` gated with a reason and the parity test keeps the runtime list aligned (`index.mjs:24-66`, parity test `:134`).

## Ruled Out

- **The DSH decoder/reader path split is a new defect.** `decodeSessionLog` selected its format from the locator name before this change too; the fix changed only which path's bytes are read. A mismatched link extension fails identically on the base commit.
- **`readSession` dropping `injected` hides a fix.** The README states the split (`README.md:31`), and the two consumers that need injection text use the raw `loadSession` path. No caller is left guessing.
- **Devin's fallback masks `session_not_found`.** A missing transcript after a damaged database is the `store_unreadable` case the README names; the database failure is the primary condition.

## Next Focus

- Dimension: traceability
- Focus area: the `yes` docs in this area — `feature-catalog/cli-surface/advisor-recommend.md`, `feature-catalog/hooks-and-plugin/claude-hook.md`, `hooks/skill-advisor-hook.md`, `.opencode/plugins/README.md`, and the shared `ARCHITECTURE.md`/`README.md` where they describe the command brief.
- Reason: the reader layer is clean; the remaining pass-one doc findings (`R3-P2-002--ecbea1260371`, `Q2`) and the command-surfacing documentation exist only as prose and must be checked against the code read in iterations 1-3.
- Rotation status: dimension 3 of 4.
- Blocked/productive carry-forward: none.
- Required evidence: each doc line against the code line it describes, plus the pass-one table rows for this area.

Review verdict: PASS
