# Iteration 001 — Ring 1: the goal engine

**Focus:** `.opencode/hooks/goal/` in full — the shared slice module, the core, the four runtime
adapters, the command-line surface, and their tests.
**Method:** full reads of `lib/goal-slice.cjs`, `lib/goal-core.cjs`, `bin/goal.cjs`,
`README.md`, `goal-plugin.md`; targeted reads of both adapter bodies; the whole test-name
inventory of all six suites; the kill-switch resolver; and on-disk state inspection.
**Prior rings kept:** none — this is the first ring.
**Procedural deviation:** the `append-mode-event.cjs` gateway is not invoked. It writes the
state log and receipts under the spec folder, outside this lineage's bound write surface, and
the lineage override forbids any command that writes outside it. Records are appended to the
in-lineage `deep-research-state.jsonl` in the same field shape instead. Recorded in
`deep-research-config.json`, `deep-research-state.jsonl`, and `research.md`. INFERRED that the
gateway could target the lineage root via its own run-directory argument; UNKNOWN whether it
accepts an out-of-spec-folder directory — running it with such a flag would settle that.

---

## 1. What exists here, by path

Fourteen files, 6,565 lines, plus one symlink.

| Path | Lines | Role |
|---|---|---|
| `.opencode/hooks/goal/lib/goal-slice.cjs` | 343 | Packet `goal.md` projections shared by every surface |
| `.opencode/hooks/goal/lib/goal-slice.test.cjs` | 198 | Slice boundary, no-leak, hash stability, containment |
| `.opencode/hooks/goal/lib/goal-core.cjs` | 1495 | Scope, opaque paths, atomic state I/O, lifecycle, packet binding, render, verifier, legacy quarantine |
| `.opencode/hooks/goal/lib/goal-core.test.cjs` | 1035 | 72 top-level tests across the core's surface |
| `.opencode/hooks/goal/bin/goal.cjs` | 443 | `STATUS=`/`ACTION=` manage CLI router |
| `.opencode/hooks/goal/bin/goal.test.cjs` | 157 | CLI identity, privacy, legacy actions, concurrency |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | 99 | Cursor `sessionStart` injection |
| `.opencode/hooks/goal/cursor/goal-cursor.test.mjs` | 244 | Cursor adapter + command fail-closed behavior |
| `.opencode/hooks/goal/devin/goal-inject.mjs` | 90 | Devin `SessionStart` + `UserPromptSubmit` injection |
| `.opencode/hooks/goal/devin/goal-devin.test.mjs` | 96 | Devin adapter |
| `.opencode/hooks/goal/pi/goal-context.ts` | 245 | Pi lifecycle + `/goal-pi` |
| `.opencode/hooks/goal/pi/goal-pi.test.mjs` | 412 | Pi adapter, identity isolation, command binding |
| `.opencode/hooks/goal/README.md` | 191 | Cross-runtime contract |
| `.opencode/hooks/goal/goal-plugin.md` | 174 | OpenCode-native plugin contract |
| `.opencode/hooks/goal/opencode/opencode-goal.js` | symlink | Points at `../../../plugins/opencode-goal.js` |

The symlink resolves. `ls -la` reports
`opencode-goal.js -> ../../../plugins/opencode-goal.js`, matching the browsability claim at
`README.md:81` and `README.md:100`. The target is 3,372 lines
(`.opencode/plugins/opencode-goal.js`) and is read in ring 2.

The four adapters are all present and all import the same core:
`pi/goal-context.ts:28` and `:29` hold both core paths,
`cursor/goal-inject.mjs:36` and `devin/goal-inject.mjs:25` require
`../lib/goal-core.cjs` directly.

---

## 2. What it actually does

### 2.1 The slice boundary is drawn once and does hold

`goal-slice.cjs` normalizes CRLF **and** bare CR before matching
(`goal-slice.cjs:39`), tolerates trailing whitespace on either fence, tolerates a BOM and
leading HTML comments (`goal-slice.cjs:24-25`), and **fails closed on an unclosed opener**:
a document whose fence never closes yields `body: ''` with `broken: true`
(`goal-slice.cjs:44`), and `readPacketGoal` turns that into `null`
(`goal-slice.cjs:309`). A broken document therefore reads as unbound rather than leaking its
frontmatter into a prompt. The five tests at `goal-slice.test.cjs:66-147` pin exactly that
set, including a CR-only file (`:141`) and a symlink escaping the workspace (`:125`).

Containment is judged on real paths (`goal-slice.cjs:247-254`), and
`packetRealPath` is exported so the packet lock can be keyed on it
(`goal-slice.cjs:317`).

### 2.2 The directive really is the file

`renderGoalBrief` re-reads the packet on every render rather than replaying a stored copy
(`goal-core.cjs:424-429`), and returns `''` when the pointer resolves to nothing
(`goal-core.cjs:426`). `resendPending` compares the live slice hash against
`lastResentSliceHash` (`goal-core.cjs:1074-1078`). The log append refuses a write that would
move the durable hash (`goal-core.cjs:1155-1157`), refuses to rewrite non-UTF-8 bytes as
U+FFFD (`goal-core.cjs:1128-1130`), and preserves the document's own line terminator
(`goal-core.cjs:1139`). Tests: `goal-core.test.cjs:779` (renders the file as it is now),
`:788` (gone document injects nothing), `:801` (resend settles only on a durable change),
`:814` (append preserves the slice), `:866` (alias and real path serialize on one lock).

### 2.3 The turn counters are honest about their source

`USAGE_SOURCE = 'turn-count-estimate'` (`goal-core.cjs:94`) is written into every new record
(`goal-core.cjs:1199`) and rendered as `tokens n/a/<budget>` with
`(source: turn-count-estimate)` (`goal-core.cjs:464`). No runtime in this tree exposes a
native token feed, and the code says so rather than inventing one.

### 2.4 Injection is genuinely bounded

The full block is built, then the compact block if it does not fit, then hard-clamped
(`goal-core.cjs:469-483`). Criteria get their own labelled lines and a trimmed list says how
many it dropped (`goal-core.cjs:393-399`), which is the difference between "three criteria"
and "three of five".

### 2.5 Unreachable-but-live: the duplicate root walker

`goal-slice.cjs:213-222 resolveWorkspaceRoot` is a byte-for-byte twin of
`goal-core.cjs:136-145 resolveRepoRoot`: same two markers (`.git`, `.opencode/skills`), same
40-depth loop, same fall-back-to-start. Both are exported (`goal-slice.cjs:340`,
`goal-core.cjs:1455`).

- The only references to `resolveWorkspaceRoot` anywhere in the engine are its definition,
  its export, and one test (`goal-slice.test.cjs:165`). `goal-core.cjs` never calls it — it
  calls its own `resolveRepoRoot` at `:161`, `:194`, `:1046` and `:1118`.
- `resolveRepoRoot` is also consumed outside the core by `pi/goal-context.ts:94`.
- `goal-slice.cjs` has exactly three importers: `goal-core.cjs:37`,
  `opencode-goal.js:24`, and its own test.

So one of the two identical functions is dead code kept alive by its own test.
`CLAIM: the duplicate should be deleted rather than kept in sync; nothing imports it.`

---

## 3. Where it disagrees with another surface, or with a document

These are all confirmed by opening both sides.

### C1 — The live operator flag file documents a flag that does not exist

`.opencode/hooks/hook-flags.env:25` reads
`# SYSTEM_GOAL_DISABLED=1                  # session goal tracking`.

`SYSTEM_GOAL_DISABLED` appears exactly once in the whole repository — that line. The
resolver's canonical name is `OPENCODE_GOAL_DISABLED`
(`.opencode/hooks/shared/hook-flags.cjs:35`) and its alias list is
`["OPENCODE_GOAL_PLUGIN_DISABLED", "MK_GOAL_DISABLED", "MK_GOAL_PLUGIN_DISABLED"]`
(`hook-flags.cjs:52`). `SYSTEM_GOAL_DISABLED` is in neither. The bundled example file has
the right name (`hook-flags.env.example:25` → `OPENCODE_GOAL_DISABLED=1`).

The sting is the neighbourhood: every other line in the live file uses the
`SYSTEM_<CONCERN>_DISABLED` shape (`hook-flags.env:18-32`), a shape that genuinely works for
other concerns — `SYSTEM_DISPATCH_DISABLED` is a real alias
(`hook-flags.cjs:53`). Goal is the one concern whose canonical name breaks the pattern, so
the one line that ignores the pattern is the one line that does nothing. Uncommenting it
disables nothing, and no test can catch it because `hook-flags.env` is gitignored
(`.gitignore:287`).

### C2 — The disable error names a variable that did not fire

`goal-core.cjs:44` sets `DISABLED_ENV = 'OPENCODE_GOAL_PLUGIN_DISABLED'`, and that constant
is interpolated into the `PLUGIN_DISABLED` message at `:828`, `:893`, `:984`, `:1022`,
`:1092`, `:1164`, `:1265`, `:1284`, `:1304`, `:1323`, and again at `bin/goal.cjs:396`.

Every one of those guards actually calls `isPluginDisabled()`
(`goal-core.cjs:128-130`), which delegates to `isHookEnabled('goal', env)` and therefore
reads `OPENCODE_GOAL_DISABLED` first, then the aliases (`hook-flags.cjs:164-168`). An
operator who sets only the canonical flag is told that a different variable is responsible.

### C3 — The kill switch also switches off the diagnostics

`bin/goal.cjs:395-397` returns `PLUGIN_DISABLED` **before** routing, so with the hook
disabled every action fails — including `packet` (`bin/goal.cjs:206-220`), `packet-log`
(`:224-234`), `doctor` and `health` (`:401`, `:307-321`). `README.md:60` describes `packet`
and `packet-log` as *session-free* surfaces precisely for "a runtime with no management
surface or a packet no session is bound to", and `README.md:62` describes `doctor` and
`health` as aggregate diagnostics. A disabled hook therefore also disables the surfaces you
would use to find out what the disabled hook left on disk.

The library disagrees with its own CLI on the same flag: `appendPacketLog`
(`goal-core.cjs:1113`) and `describePacketGoal` (`goal-core.cjs:1042`) carry **no** disable
check, so a direct importer — `opencode-goal.js:24` is one — still writes packet log rows
while the CLI refuses to. Whether that is intended is not written down anywhere.
`INFERRED: the asymmetry is accidental, from adding the guard to session-scoped mutations
only. Reading the plugin's disable handling in ring 2 would settle it.`

### C4 — The budget contract is enforced on the packets it excludes

The spec-kit manifest declares the tiers it owns
(`.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:24-29`):
`warnChars: 3000`, `errorChars: 4000`, and
`appliesTo: "phase parents and top-level packets; phase children are unbounded"`.

`resolveGoalBudget` (`goal-slice.cjs:267-278`) reads only the two numbers and drops
`appliesTo` entirely. `budgetState` (`goal-slice.cjs:280-285`) compares any packet's measured
slice against them, and `bin/goal.cjs:169-171` emits a `warning=` line when the result is
`warn` or `over`. So the hook reports a budget breach that the contract that owns the numbers
says cannot exist for a phase child.

This is a cross-ring finding: the ring-1 surface (the engine) contradicts the ring-3 surface
(the spec-kit contract). It is named here because both files were opened in this iteration; it
is re-tested in ring 3 against the validator's own resolver.

### C5 — "Injection-only" does not mean "writes nothing"

`README.md:79` says Cursor and Devin "remain injection-only". `README.md:73` and `:74` frame
that as an absence of *management*: Cursor "management needs identity the prompt command does
not carry", Devin has no command surface at all.

Both adapters nonetheless mutate the record. `cursor/goal-inject.mjs:36` and
`devin/goal-inject.mjs:25` both import `recordTurn`, and Cursor's own suite pins it at
`cursor/goal-cursor.test.mjs:83` ("records a turn touch when injecting an active goal").
`recordTurn` bumps `turnsUsed`, `lastActivityAtMs`, `revision` and `updatedAtMs`
(`goal-core.cjs:1355-1363`). `goal-plugin.md:151-152` states this more precisely ("Turn touch
only"), but a reader of `README.md` alone would take "injection-only" to mean the adapter is
read-only, which would make Cursor and Devin invisible to `history` and to record-revision
reasoning.

### C6 — The CLI and the plugin do not expose the same status field names

`goal-plugin.md:103-105` names `tokens_used` and `usage_source` as the canonical status
fields, with `budget_tokens_used` / `budget_usage_source` kept as legacy aliases.
`bin/goal.cjs:131` emits `usage_source=` but never `tokens_used=`. So a script that reads
`tokens_used` from the plugin gets the value, and the same script against the manage CLI gets
nothing.

### C7 — `README.md` §6 omits a variable the CLI reads

The configuration table (`README.md:125-130`) lists four variables. `bin/goal.cjs:394` reads
`OPENCODE_GOAL_RUNTIME_LABEL`, and `.env.example:305` documents it:
`# OPENCODE_GOAL_RUNTIME_LABEL=          # Runtime label recorded in goal state`. The README
does not mention it. The naming is also misleading next to `--runtime`: `--runtime` is
constrained to lowercase by `RUNTIME_NAMESPACE_PATTERN`
(`goal-core.cjs:51`, enforced at `:168`) and forms part of the state key, while
`OPENCODE_GOAL_RUNTIME_LABEL` is a free-form display string — the benchmark reports pass
`Pi` and `Cursor` through it
(`.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/README.md:51`).

---

## 4. What is unreachable, unused, or reads as live but is not

1. **`goal-slice.cjs resolveWorkspaceRoot`** — dead twin of `resolveRepoRoot`, kept alive by
   one test. See §2.5.
2. **`goal-core.cjs:1348 recordTurn(_input = {})`** — the first parameter is accepted and
   discarded. Every caller passes `{}` or nothing. Harmless, but it reads as if it takes turn
   data.
3. **`goal-core.cjs:1042 describePacketGoal` and `:1113 appendPacketLog` bypass the kill
   switch** while the CLI that fronts them does not. See C3.
4. **`goal-core.cjs:1495 readGoalRecord` is exported but never used inside the engine**; the
   engine's internal reads go through `readGoalRecordForScope` (`:675`). The export exists for
   the adapters, which use it (`cursor/goal-inject.mjs:36`, `devin/goal-inject.mjs:25`,
   `pi/goal-context.ts:44`).
5. **`goal-core.cjs:1461 legacyStatePath` and `:1462 legacyArchiveDir` are exported**; the
   engine's own legacy paths are reached through `resolveStateDir` + the constants at `:46-48`
   and through `inspectLegacyGoal` (`:726`) and `legacyArchiveDir` (`:230`, called from
   `:757`). Whether any external consumer reads the two exports is not settled here; a
   repository-wide symbol search would settle it, and ring 2 covers the remaining importers.
6. **The pre-seeded `containment/` tree in this lineage is not a goal surface.** It is 13 MB of
   baseline copies of other packets' `review/` and `research/` trees, including copies of
   `goal-slice.cjs`. It is harness scaffolding for write containment and is never cited as
   evidence.

---

## 5. What a new reader would get wrong

- **Reading `hook-flags.env` and believing it.** Its goal line is the one line in the file
  that names a nonexistent variable. See C1.
- **Reading `README.md` §6 as the complete environment surface.** It omits
  `OPENCODE_GOAL_RUNTIME_LABEL`, and it presents `OPENCODE_GOAL_PLUGIN_DISABLED` as an alias
  while `goal-plugin.md:61` presents the same variable as the plugin's primary flag. The
  canonical name is `OPENCODE_GOAL_DISABLED`.
- **Trusting the `PLUGIN_DISABLED` message.** It names the alias, not the switch that fired.
- **Assuming a disabled hook is a full write freeze.** The CLI stops; the library does not.
- **Assuming the 3000/4000 budget applies to every packet.** The contract that owns the
  numbers excludes phase children; the hook does not.
- **Assuming "injection-only" means read-only.** Both adapters bump the turn counter.
- **Assuming `resolveWorkspaceRoot` and `resolveRepoRoot` are two different jobs.** They are
  one implementation written twice, and only one of the two is reachable.
- **Assuming the tests guard the flag file.** `hook-flags.env` is gitignored, so C1 is
  invisible to CI by construction.

---

## 6. Ruled out in this iteration

| Approach tried | Result |
|---|---|
| Citing the repository's prior goal research lineages as evidence for current behaviour | Ruled out. Prior lineages under `specs/system-speckit/033-system-speckit-v4/036-goal-unification/00*/research/lineages/**` are claim sets from earlier runs, not current behaviour. They are read for reconciliation only in ring 5, and every claim taken from them is re-checked against the file. |
| Using `rg -r` for symbol search | Ruled out as a method. `-r` is ripgrep's `--replace`, so `rg -rn "<sym>"` silently rewrites the matches in the output. Every citation in this iteration comes from a read or from a grep whose output was inspected for that artifact. |
| Treating `containment/` copies as a second source | Ruled out — scaffolding, not evidence. |
| Counting repository-wide references to a symbol to prove it unused | Ruled out as too noisy here: unrelated lineage logs and revert patches under `specs/` contain verbatim copies of this engine's source. The unused-export claims in §4 are scoped to what was actually opened. |

## 7. Open questions handed to ring 2

1. Does `opencode-goal.js` honour the kill switch before calling `appendPacketLog`, or does
   the C3 asymmetry reach the OpenCode surface in practice?
2. Does the plugin emit `tokens_used`, and does it read
   `OPENCODE_GOAL_RUNTIME_LABEL` (`goal-plugin.md:98-99` mentions other variables)?
3. Is `.opencode/hooks/hook-flags.env` the file operators are told to edit, i.e. does any
   instruction surface point at it rather than at the example?
4. Does the plugin require the same duplicated root-walker, or does it use
   `goalSlice.resolveWorkspaceRoot` — which would make §2.5's "dead" verdict wrong for the
   plugin's consumer path?

Recorded `newInfoRatio`: **0.95**. Ring 1 is entirely new information for this lineage: 14
paths, four contradiction classes, one dead-code duplicate, and an unreachable diagnostics
path. The small deduction from 1.0 is the one item that is INFERRED rather than confirmed
(C3's intent) and the two exports left unresolved in §4.

---

## Evidence index

| Claim | Source |
|---|---|
| Slice module boundary, fail-closed broken fence, CR normalization | `goal-slice.cjs:24`, `:25`, `:39`, `:44`, `:309` |
| Real-path containment and packet lock key | `goal-slice.cjs:247`, `:254`, `:317` |
| Budget read and state tiers | `goal-slice.cjs:26`, `:267`, `:280` |
| Duplicate root walker | `goal-slice.cjs:213`, `:340`; `goal-core.cjs:136`, `:1455` |
| Core call sites of `resolveRepoRoot` | `goal-core.cjs:161`, `:194`, `:1046`, `:1118` |
| Pi consumer of `resolveRepoRoot` | `pi/goal-context.ts:94` |
| Kill switch resolution | `hook-flags.cjs:35`, `:52`, `:53`, `:164` |
| Disable constant and its message sites | `goal-core.cjs:44`, `:828`, `:893`, `:984`, `:1022`, `:1092`, `:1164`, `:1265`, `:1284`, `:1304`, `:1323`; `bin/goal.cjs:396` |
| CLI refuses every action while disabled | `bin/goal.cjs:395`, `:401` |
| Library appends without the disable check | `goal-core.cjs:1042`, `:1113` |
| Plugin imports the slice module | `opencode-goal.js:24` |
| Budget contract excludes phase children | `spec-kit-docs.json:24-29` |
| Adapters mutate the record | `cursor/goal-inject.mjs:36`; `devin/goal-inject.mjs:25`; `goal-core.cjs:1355` |
| Adapter mutation pinned by test | `cursor/goal-cursor.test.mjs:83` |
| Plugin status field names | `goal-plugin.md:103-105`; `bin/goal.cjs:131` |
| Runtime label env var | `bin/goal.cjs:394`; `.env.example:305` |
| Live flag file names a dead variable | `hook-flags.env:25`; `hook-flags.env.example:25` |
| Flag file is gitignored | `.gitignore:287` |
| Browsability symlink | `README.md:81`, `:100`; on-disk symlink target |
