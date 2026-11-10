# Iteration 004 — History After Compaction

## Focus

The v4.0.2.0 "History After Compaction" claim: one read-only command that searches, browses and
pages the session's own earlier turns after a compaction drops them. I mapped every producer, every
session reader, the redemption path and the refusal path, and I ran the read-only suites.

Release-note claims under test ([SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:88]):

1. the restored context *can* carry a `## History Lookup` section,
2. the command is read-only,
3. each reply is at most 16 KiB,
4. what comes back is treated as information, not instructions,
5. the handle lasts 30 minutes and works only for the session and checkout that minted it,
6. Devin shows the section with the next prompt, Cursor is not supported yet,
7. `/speckit:resume` stays first and the section is omitted when anything is stale.

## Actions Taken

1. Read the note section and every consumer of the lookup core
   (`rg -n -l 'lookup-offer|lookupOffer|History Lookup'`, non-markdown, outside `specs/`).
2. Read the lookup contract: `core.ts`, `locator-digest.ts`, `lookup-offer.ts`, and `cli.ts`'s
   locator gates, session resolution and entrypoint.
3. Traced each runtime's producer: Claude (`compact-inject.ts`, `session-prime.ts`), Codex (Claude
   adapter spawned with `SPECKIT_RUNTIME=codex`), Pi, DSH, OpenCode plugin, Devin, Cursor gate.
4. Proved read-only three ways: a source sweep for write/network/process APIs over the whole history
   library and CLI, the SQLite open flags in the two database readers, and the reader suite's own
   byte/mtime assertion.
5. Ran two read-only suites (below). I did **not** run vitest or `npm run build`: both write build and
   cache artifacts into the researched tree, which is outside this iteration's write authority.

### Verification runs

| Command | Result |
|---|---|
| `node --test .opencode/plugins/tests/session-history-lookup.test.cjs` | **exit 0**, 3/3 pass (offer mints, redeems from a subfolder, second request keeps the offer, non-checkout folder gets no offer) |
| `node --test .skilled/hooks/shared/tests/session-readers/` | **exit 0**, 85/85 pass; the side-effect test reports `stores unchanged: 7` — every reader leaves bytes, sizes and mtimes identical |

## Findings

### f-iter004-001 — The offer commands a gitignored build artifact, so an unbuilt copy silently has no feature

**Type** drift · **Severity** P2 · **Introduced** v4.0.2.0 · **Confidence** 0.9

The model-visible command is a constant that hardcodes `dist/` ([SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts:20]),
and `dist/` is ignored at the repository root ([SOURCE: .gitignore:60]). `lookupRunsFrom` requires
both `.git` and that CLI file to exist under the checkout root ([SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts:94]),
and `buildHistoryLookupSection` returns `null` when it does not
([SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts:136]).

The behaviour itself is good: the section is withheld rather than printing a command that cannot run,
and the plugin's own support loader degrades the same way
([SOURCE: .opencode/plugins/session-history-lookup.js:45]). The drift is in framing. The note presents
the lookup as part of the release and puts the build in a one-line upgrade note, so an operator on a
fresh clone or a vendored copy sees *nothing at all* — no section, no warning, no log line at default
verbosity — and has no way to tell "feature working" from "feature never built".

**Verify:** `git check-ignore -v .skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js`
(reports `.gitignore:60:dist/`), then in a clean worktree call `buildHistoryLookupSection` with a
locator whose workspace has no `dist`; it returns `null`.

### f-iter004-002 — The help line's operations cannot run as printed, and the CLI refuses on both missing pieces

**Type** UX (AI user) · **Severity** P2 · **Introduced** v4.0.2.0 · **Confidence** 0.85

The primary line carries both the `cd` to the checkout root and the runtime prefix
([SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts:70]). The
follow-up line lists `search`, `load` and `page` as bare JSON with neither
([SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts:73]). The CLI
refuses on both gates independently: `runtime_mismatch`
([SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts:61]) and
`workspace_mismatch` ([SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts:62]).

A model that keeps the working command but swaps the operation — the natural edit — gets a refusal
envelope instead of history. The recovery is easy once the refusal code is read, but the section the
model was handed teaches an invocation its own CLI rejects. The failure mode is worst on the five
non-Claude runtimes, where the prefix is mandatory and therefore easiest to lose.

**Verify:** with an OpenCode locator saved, run the CLI without `SPECKIT_RUNTIME`:
`{"ok":false,"code":"runtime_mismatch"}`; run it with the env prefix from the wrong directory:
`{"ok":false,"code":"workspace_mismatch"}`.

### f-iter004-003 — Two producers duplicate the same dynamic support probe

**Type** over-engineering · **Severity** P2 · **Introduced** v4.0.2.0 · **Confidence** 0.8

The OpenCode plugin and the DSH hook each hand-write a dynamic import of the same six compiled
symbols and each re-check their types
([SOURCE: .opencode/plugins/session-history-lookup.js:45],
[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs:21]). The
reader module path is also duplicated per runtime
([SOURCE: .opencode/plugins/session-history-lookup.js:36]).

The duplication is defensible — those runtimes load ESM at hook time and cannot statically import
TypeScript — but the *guard* need not be. One compiled `loadHistorySupport()` returning the six
symbols or `null` collapses both blocks.

**What breaks if removed:** nothing at runtime. Each runtime's hook registration must stay, because
that is what the host actually calls; only the probe bodies collapse. Pi and the Claude/Codex/Devin
adapters already resolve these symbols statically and would keep working untouched.

### f-iter004-004 — The runtime label set is enumerated twice and can disagree

**Type** improvement · **Severity** P2 · **Introduced** v4.0.2.0 · **Confidence** 0.75

`capabilities` in the readers dispatcher is the declared source of runtime status, but the CLI
enumerates the reader-backed labels a second time in `currentRuntime()`
([SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts:488]). The CLI refuses
`unsupported_runtime` *before* it consults the capability table, so a runtime added to the table but
missed in that list is unreachable, and a runtime removed from the table but left in the list falls
through to the table's check. Both failure directions exist; only one is documented.

**Verify:** add a hypothetical label to `capabilities` only, then run the CLI with
`SPECKIT_RUNTIME=<label>`; it refuses with `unsupported_runtime` while the table says `ready`.

### f-iter004-005 — Codex is marked ready, but its offer depends on a field its own adapter does not require (hypothesis)

**Type** bug (unconfirmed) · **Severity** P2 · **Introduced** v4.0.2.0 · **Confidence** 0.4

Codex reaches the Claude PreCompact adapter with `SPECKIT_RUNTIME=codex`, and the shared detector
maps that to a Codex locator ([SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:334]).
Minting then requires *all* of: a non-empty transcript path
([SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:114]), a `.jsonl`
basename ending `-<sessionId>.jsonl` for the codex branch
([SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:122]), and a file
that stats as a regular file. But the Codex
adapter's own required-field list is `session_id` alone, and the runtime's capability row says
`ready`.

If a Codex PreCompact payload omits or renames `transcript_path`, the section never appears on Codex
and nothing says why. I could not settle this from the code — it depends on what the live host sends,
and I did not run a live compaction. Recorded as a hypothesis with the exact confirmation step rather
than as a defect.

**Verify:** force a Codex compaction with hook logging on, then read the compact-inject line
`Read N transcript lines; history locator minted|not minted for codex`. `not minted` with a non-zero
transcript count confirms the filename mismatch; `Read 0 transcript lines` confirms a missing path.

### f-iter004-006 — The section's size bound is asserted by a test, not enforced by the builder

**Type** improvement · **Severity** P2 · **Introduced** v4.0.2.0 · **Confidence** 0.8

`HISTORY_LOOKUP_MAX_CHARS` is 600 ([SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts:21])
and the builder never measures itself against it; the only enforcement is a test assertion. A longer
runtime prefix or a longer session id would ship an over-budget section and fail CI rather than fail
closed at runtime. Cheap fix: have the builder drop the "Also:" line when the total exceeds the
bound, and let the test assert the drop instead of the length.

## Invariants confirmed

- **inv-iter004-001 — Read-only holds.** A sweep for `writeFile|appendFile|mkdir|unlink|rmSync|
  createWriteStream|node:http|node:https|fetch(|net.|child_process|execSync|spawn` across the history
  library and CLI returned **zero** matches. The CLI reads the state file directly *instead of* the
  shared loader specifically so a refused lookup cannot cause a migration or quarantine write
  ([SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts:182]). Both SQLite readers
  open `{ readOnly: true }`. The reader suite's side-effect test confirms it empirically over all
  seven stores.
- **inv-iter004-002 — The 30-minute handle matches the note.** `LOCATOR_TTL_MS = 30 * 60 * 1000` in
  the CLI ([SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts:37]) and in the
  producer that stops re-offering at the same bound
  ([SOURCE: .opencode/plugins/session-history-lookup.js:33]). A future timestamp counts as stale, not
  fresh.
- **inv-iter004-003 — 16 KiB.** `MAXIMUM_RECOVERY_REPLY_BYTES = 16_384` and the image path re-measures
  the whole reply after attaching, because metadata alone understates it.
- **inv-iter004-004 — Cursor is gated exactly as the note says.** The reader returns
  `capability_gated` before touching any file, and `locator_unavailable` even with the operator switch
  on, because there is no confirmed capture point.

## Questions Answered

- **History after compaction (v4.0.2.0) — answered at code level.** Read-only: yes, proven three ways.
  Per runtime the note names: Claude, Pi, Devin, DSH and OpenCode each mint and offer; Codex mints
  through the Claude adapter with its own runtime label; Cursor is deliberately gated and says so.
  Residual: I verified *wiring and minting*, not live end-to-end delivery on any host — that stays a
  manual-playbook item, and f-iter004-005 is the one path where wiring and delivery may disagree.

## Questions Remaining

- f-iter004-005 needs one live Codex compaction to close.
- Still untouched from earlier iterations: the three-second stdin deadline and the git-call time limit
  across every hook entry point (carried three times now — it is the largest unexamined surface left).
- Still open: which layer drops the advisor redirect (CLI handler vs the shim), and whether
  `SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS` leaves a stale brief behind.
- Question-tool capture (`ask-surface-guard`, `decision-capture`) is entirely unexamined.

## Next Focus

Hook safety: enumerate every hook entry point and measure the stdin deadline and the git-call limit
against the documented 3-second host budget, starting with the two hot paths this iteration touched —
`.codex/hooks.json` PreCompact (`runClaudeHookAdapter(..., 2_800)` against a 3 000 ms host kill) and
the Devin prompt hook that builds the offer on every prompt.

## SCOPE VIOLATIONS

None. Two actions were deliberately not taken because they write into the researched tree:
`npm run build` in `.skilled/skills/system-spec-kit/runtime` (the note's own upgrade step), and
`vitest` runs whose cache and coverage output land under the runtime package. The read-only `node
--test` suites were run instead.
