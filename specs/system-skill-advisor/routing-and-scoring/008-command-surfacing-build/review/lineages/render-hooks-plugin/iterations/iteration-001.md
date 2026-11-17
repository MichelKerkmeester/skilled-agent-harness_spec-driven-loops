# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin`)
- Session: `fanout-render-hooks-plugin-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin` — the `render-hooks-plugin` rows of `review/review-scope.txt`, plus shared docs that describe them
- Operator review focus addressed this iteration: "behaviour on claude, codex, opencode, pi, devin and dsh", read through the correctness lens — the six named runtimes resolve to the shared session-reader dispatcher plus the OpenCode hook/plugin entry point, which is what this pass executed line by line.
- Budget profile: `verify` (12 analysis actions)

## Files Reviewed

- `.opencode/plugins/system-skill-advisor.js:1-80` — constants, imports, cache and concurrency bounds
- `.opencode/plugins/system-skill-advisor.js:1086-1250` — per-instance state, run-slot acquisition, CLI invocation
- `.opencode/plugins/system-skill-advisor.js:1440-1660` — `appendAdvisorBrief`, prompt recovery, fallback delivery
- `.opencode/plugins/README.md:1-257` — documented plugin surface and env contract
- `.skilled/hooks/shared/session-readers/index.mjs:1-147` — dispatcher, capability table, failure envelope
- `.skilled/hooks/shared/session-readers/claude.mjs:37-249` — store root, identity guard, loader
- `.skilled/hooks/shared/session-readers/pi.mjs:44-291` — project key, live branch, disk fallback
- `.skilled/hooks/shared/session-readers/devin.mjs:50-448` — SQLite projection, chain walk, transcript fallback
- `.skilled/hooks/shared/session-readers/dsh.mjs:52-333` — Zstandard frame cutting, project key, event mapping
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:30-60`, `:188-262`, `:500-610` — command label, policy word, brief render
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:44-100` — policy and mutating vocabulary (read as consumer context)
- `.skilled/hooks/shared/tests/session-readers/injected-text.test.mjs:1-229` — injected-text contract across runtimes

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Unknown runtime is reported as a missing locator, not a gated capability** -- `.skilled/hooks/shared/session-readers/index.mjs:99` -- `load()` validates the session id before it resolves the runtime, so `readSession({ runtime: 'cdoex', sessionId: '' })` returns `locator_unavailable`. A caller that typo'd the runtime name is told its locator is missing, and the `capability_gated` branch at `index.mjs:102` is unreachable for that shape.
Finding class: instance-only
Scope proof: `index.mjs:97-105` is the only dispatch entry; both `readSession` (`:114`) and `loadSession` (`:133`) funnel through it, and neither pre-validates `runtime`, so the ordering at `:99` is the single decision point.
Affected surface hints: ["session-reader dispatcher", "history lookup callers", "capability table"]
Case: a caller passes a misspelled runtime and an empty session id; the envelope says the locator is unavailable and the runtime typo is never surfaced.

2. **Containment is proven on the resolved path while the bytes are opened from the caller's path** -- `.skilled/hooks/shared/session-readers/claude.mjs:213` -- `storePath = containment.path` is recorded as the source, but `claude.mjs:217` reads `transcriptPath`; the same split appears at `devin.mjs:350`/`:354` and `dsh.mjs:306`/`:310`. A file inside the store that is a link, or a path whose resolution changes between check and open, yields records whose `source.storePath` does not name the file that produced them.
Finding class: cross-consumer
Scope proof: `rg -n "storePath = containment.path" .skilled/hooks/shared/session-readers` returns exactly the three readers above; `pi.mjs:246-256` already closes the same gap by reading the guard's resolved path, and `opencode.mjs`/`codex.mjs` do not use a path locator, so the three sites are the whole class.
Affected surface hints: ["claude reader", "devin transcript fallback", "dsh reader", "history lookup"]
Case: a store file reachable through a link is accepted by containment and then re-opened by its link name, so the reported `storePath` can differ from the file actually read.

3. **A DSH operator message with no `source` object is silently reclassified as injected** -- `.skilled/hooks/shared/session-readers/dsh.mjs:195` -- a record is emitted only when `data.source?.kind === 'user'`, and `dsh.mjs:250` sends every other `user/message` to `injected`. An event that omits `source` therefore loses the operator's own turn from history while still reporting `ok: true`.
Finding class: instance-only
Scope proof: `dsh.mjs:195-207` is the only user-record branch and `dsh.mjs:244-256` the only injected branch; `injected-text.test.mjs:174-206` exercises a non-operator source kind and an operator source kind, never an absent one, so no test pins the absent case.
Affected surface hints: ["dsh reader", "history lookup", "advisor brief prompt recovery"]
Case: a `user/message` event whose `data` has `role` and `content` but no `source` produces zero records and one injected entry.

4. **A corrupt Devin `sessions.db` suppresses the transcript fallback** -- `.skilled/hooks/shared/session-readers/devin.mjs:395` -- the database branch returns `store_unreadable` when `openDatabase` throws (`:403`), and a throw from `sessionRow` or the chain walk also returns `store_unreadable` (`:439`). Only an *absent* row or an *empty* projection falls through to `loadTranscript` at `:447`, so a store whose database is present but unreadable never reaches the JSON transcript that holds the same session.
Finding class: class-of-bug
Scope proof: `devin.mjs:395-447` is the whole loader tail; the fallthrough at `:447` is reached only after the `if (row)` block at `:408` declines, and every `catch` on that path returns instead of falling through.
Affected surface hints: ["devin reader", "transcript fallback", "history lookup"]
Case: a Devin install whose `sessions.db` is truncated or locked returns `store_unreadable` although `transcripts/<sessionId>.json` on the same machine is intact.

5. **`needsMode` withholding is defeated when the skill also has a generated command row** -- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:226` -- `commandLabel` resolves `recommendation.command ?? row?.command`, and the `(needs a mode)` head at `render.ts:550` is applied only when `commandRowFor(top.skill) === undefined`. A recommendation that withholds its command with `needsMode: true` therefore still prints a runnable command whenever its skill resolves a row, which is the outcome `render.ts:219-222` says the recommendation's own fields must prevent.
Finding class: instance-only
Scope proof: `render.ts:226` is the only place `row?.command` backfills a recommendation, and `render.ts:550` is the only `needsMode` branch; `command-attach.ts:66-100` keys rows by `command-*` ids, so no hub skill that sets `needsMode` currently resolves one, which is the counterevidence that keeps this advisory.
Affected surface hints: ["brief renderer", "command label", "needsMode contract"]
Case: a recommendation with `needsMode: true`, no `command`, and a skill that has a generated row renders as `owner → /command (policy)` instead of `owner (needs a mode)`.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | The offer contract in the reviewed renderer matches the typed-command policy vocabulary at `command-attach.ts:50-51` (`run`/`start`/`ask` × `read-only`/`add-only`/`mutates`). Two of the six named runtimes (`codex`, `opencode`) have no reader in this area's changed set, so their behaviour is evidenced only through the dispatcher contract. |
| `checklist_evidence` | core | pending | Deferred to the traceability dimension. |
| `skill_agent` | overlay | pending | Deferred. |
| `agent_cross_runtime` | overlay | partial | `index.mjs:28-65` declares seven runtimes; the six the operator named are all present, `cursor` is marked `gated`. |
| `feature_catalog_code` | overlay | pending | Deferred to the traceability dimension. |
| `playbook_capability` | overlay | notApplicable | No manual-testing playbook row covers this area. |

## Integration Evidence

- `.opencode/plugins/system-skill-advisor.js:29-34` resolves every relative import against a real file: `lib/tool-identity.js`, `lib/v2-bridge.js`, `lib/opencode-message-identity.js`, `../hooks/shared/hook-flags.cjs` and `../skills/system-spec-kit/runtime/hooks/lib/workspace/repo-root.mjs` all exist, so the plugin's load path is intact.
- `.skilled/hooks/shared/session-readers/index.mjs:15-22` imports `codex`, `cursor`, `opencode`, `project` and `identity` readers that all exist beside it, so the dispatcher's import graph is complete.
- `.skilled/hooks/shared/tests/session-readers/injected-text.test.mjs` covers codex, pi, devin, dsh and opencode for injected-text containment; the claude attachment path is covered by `claude.test.mjs` (out of this iteration's read set).

## Edge Cases

- **Runtime coverage gap (recorded, not a finding):** `codex` and `opencode` readers are unchanged files outside this area's diff, so the operator's "behaviour on codex/opencode" question is answered only through the shared dispatcher contract and the OpenCode plugin path. Named here so synthesis does not read this iteration as full six-runtime coverage.
- **Declaration files:** `.d.mts` and `.d.mts.map` rows in scope carry types only. Comparing them to `.mjs` bodies produced no actionable difference, so they are recorded as consistent by construction rather than reviewed as behaviour.
- **Absent `resource-map.md`:** the coverage gate is skipped for this packet, so no resource-map cross-check appears here.

## Confirmed-Clean Surfaces

- `claude.mjs:196-198` refuses a subagent transcript before any read, so a side conversation cannot stand in for the parent session.
- `claude.mjs:200-212` decides containment before opening the file, so an out-of-store path is refused without its content being read.
- `pi.mjs:226-229` refuses `session_ambiguous` rather than guessing between two files that decode to one id.
- `pi.mjs:242-244` uses the header `cwd` as the tie-breaker when separator flattening lets two projects share a directory name.
- `dsh.mjs:286-293` resolves the session directory by exact id, so a newer decoy session is never opened.
- `devin.mjs:111-131` refuses a chain with a cycle or a missing parent instead of emitting a partial conversation.
- `.opencode/plugins/system-skill-advisor.js:1123-1124` bounds live advisor runs at `MAX_CONCURRENT_ADVISOR_RUNS = 2`, matching the README's "Subprocess spawns ... are bounded".
- `render.ts:194-199` downgrades `start`, `ask` and any non-read-only `run` to parent-named for a child session, so a mutating command is not offered as startable to a dispatched child.

## Ruled Out

- "Session readers re-read the whole transcript on every call": ruled out. `claude.mjs:228-232` and `pi.mjs:261-266` parse a single file per call and `pi.mjs:56-65` probes only a bounded 64 KiB header prefix.
- "The plugin reads the prompt from the session on every turn": ruled out. `system-skill-advisor.js:1473` fetches session messages only when `extractPrompt` returned nothing.
- "`decodeSessionLog` silently truncates a log": ruled out. `dsh.mjs:52-80` throws on a truncated frame header or block, and `:94` throws on an unknown magic; only a 1-3 byte tail that cannot be a frame is skipped.
- "Declaration files disagree with their implementations": ruled out as a review direction — the `.d.mts` bodies are type-only.

## Next Focus

- Dimension: security
- Focus area: the mutating-command offer path (`render.ts:194-258`, `command-attach.ts:66-110`) and the injected-text boundary in the four reviewed readers (`claude.mjs:174-183`, `dsh.mjs:244-256`, `devin.mjs:189-212`, `pi.mjs:165-174`).
- Reason: correctness is clean of P0/P1, so the highest remaining risk in this area is a command the brief offers as startable and text one runtime's store can push into another runtime's history.
- Rotation status: D1 complete, D2 next, then D3 traceability, D4 maintainability.
- Blocked/productive carry-forward: `.d.mts` parity stays blocked; reader-vs-test comparison stays productive.
- Required evidence: `file:line` on both the render decision and the policy row that supplies `mutating`, plus the exact store field that decides operator versus injected text.

Review verdict: PASS
