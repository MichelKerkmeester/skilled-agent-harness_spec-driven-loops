# Review Iteration 2 - accuracy-runner-confirm-5b

## Dispatcher

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec folder)
- Lineage: `accuracy-runner-confirm-5b`, area `accuracy-runner`, range `2a1a42263cc..d21dbc1cafe`
- Brief and scope re-read this iteration; `steer.md` is absent, so no lead ruling applies.
- Dimension: security (arena provenance refusals, live-turn guard).
- Operator review focus addressed this iteration: the focus asks whether the arena builder refuses
  "a dirty source, a stale build, an escaping or absolute link and answers a failed check with a JSON
  line", and whether "a live turn checks for a remote every turn and has no network push". Both
  halves are this iteration's whole subject; the documentation half is carried to iteration 3.
- No prompt corpus file was opened. No code was changed. The arena builder was not executed: a probe
  would have to write a temp repository outside the lineage's write surface, so every claim below is a
  direct read of the changed files plus the tests that pin each refusal.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:1-45` (header claim)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:56-101` (constants, refusal and abort shapes)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:190-379` (source checks, stale rule, link walk)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:381-481` (copy plan, dotenv list, platform copy flag)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:483-608` (build, marker, entry guard)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:605-654` (`liveArmRefusal`, `turnRefusal`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1000-1061` (`childEnv`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1284-1300`, `:1408-1433`, `:1495-1527` (guard call, arm loop, top-level catch)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:33-41`, `:354-362` (marker import and reader)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:325-360`, `:500-520`, `:580-600`, `:800-830` (guard, marker and clone-flag cases)
- `.skilled/skills/system-skill-advisor/runtime/tsconfig.build.json:1-25` and `system-spec-kit/runtime/tsconfig.json` (what the stale rule must watch)

## Findings - New

### P0 Findings

None.

### P1 Findings

None. The four provenance checks refuse before any copy, each answers with a JSON line, and the
every-turn guard is wired where D3 says it is.

### P2 Findings

1. **`turnRefusal` throws where its contract promises a refusal** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:653` -- `turnRefusal` delegates to `liveArmRefusal`, whose `gitAt` throws on any non-zero git exit (:623-626). The JSDoc at :639-648 says it returns a refusal or null, and `runTurn` (:1296-1299) only handles the returned object, so a throw reaches the top-level `throw error` at :1524.
   Finding class: correctness
   Scope proof: `run-command-behaviour.mjs:618-654` and `:1296-1299`, inside the declared accuracy-runner path; the every-turn call is the new code this round confirms.
   Affected surface hints: the arm loop (`:1428-1430`), the run log (a throw writes no refusal line), and the operator-facing exit code (1 instead of 2).
   Case: a live turn runs `rm -rf .git` in the arena; the next turn's `turnRefusal` runs `git -C <arena> remote`, git exits 128, and the arm ends with a stack trace and exit 1 instead of `{"ok":false,"code":"arena_unprepared"}`. Before this phase the guard ran only before the first turn, so the exposure existed once per arm; now it exists before every turn.
2. **A mid-arm refusal names no row, so the stop cannot be tied to the log's last line** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1429` -- `runArm` writes `result.refusal` and returns, and `liveArmRefusal`'s object holds only `code` and `remotes` (:633). The `head_moved` refusal beside it carries `rowId` (:1360), so the two mid-arm stops report differently.
   Finding class: traceability
   Scope proof: `run-command-behaviour.mjs:1408-1433`, the arm loop the every-turn guard now interrupts.
   Affected surface hints: the arm's JSON refusal and the run log; a later summary reads the short log without a stop marker (`score-command-transcripts.mjs:2462` sets `armIncomplete` from per-row run counts, not from the selection size).
   Case: an arm of twenty rows stops at row three after row two added `origin`; the operator gets `{"ok":false,"code":"remote_present","remotes":["origin"]}` with no row id, and the log ends at row two, so nothing in the two artifacts says which row was refused or that the arm stopped early.

## Traceability Checks

- `spec_code`: partial. Decision D2's order (dirty, then stale, then link, then the dotenv list) is exactly `main`'s order at `prepare-behaviour-arena.mjs:563-579`, and each refusal runs before `mkdirSync(dirname(dest))` at :581. D3's every-turn call is `runTurn`'s `turnRefusal` at :1296, the comment corrections match the new boundary, and `childEnv` sets `GIT_ALLOW_PROTOCOL=file` at :1059 with the credential overrides after it at :1060.
- `checklist_evidence`: pending. Lane A task rows are read in the traceability iteration.
- `skill_agent`: notApplicable. No agent definition changed.
- `agent_cross_runtime`: notApplicable. `copyArgs` is the one platform branch and its test pins both answers.
- `feature_catalog_code`: notApplicable. No feature page describes the arena builder.
- `playbook_capability`: notApplicable. No playbook surface changed.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:92-101`: `refuse` writes `{ok:false, code, ...}` to stdout and exits 2; `abort` writes `{ok:false, code}` as well as a stderr detail and exits 1. Every check inside the new `try` therefore answers with a JSON line.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:550-591`: `headOf` is read before the checks, and every new check sits inside the `try` whose catch is `abort`, so a source check that cannot read its input still prints JSON.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:522-544`: the marker is `head`, `source clean`, one `built <relPath> <ISO>` per copied `dist`, one `tracked-dotenv <path>` per tracked dotenv file, in that order.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:634-635` and `command-offer.mjs:356-361`: both readers still test the marker's existence only, so the added marker lines change no reader.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1055-1059`: `childEnv` sets `GH_CONFIG_DIR`, `GIT_TERMINAL_PROMPT=0`, `GIT_ALLOW_PROTOCOL=file`, then the empty credential helper, all after the allowlist copy.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1288-1299`: the guard runs after the before-snapshot and before the first-turn dirty check, on every turn and never on a dry run.

## Edge Cases

- `staleBuilds` watches `system-skill-advisor/hooks` for the advisor `runtime/dist`, because `runtime/tsconfig.build.json:14` includes `../hooks/**/*.ts`; the probe-free read confirms the one real cross-folder input in this checkout. `extends` is not read, which D13 records.
- A `dangling` link inside a copied tree is refused as `symlink_escape` with `target: null` (`prepare-behaviour-arena.mjs:361-365`); a link that stays inside the source but is written as an absolute path is refused too (:369). Both are deliberate.
- A copied tree that is itself a symlink is invisible to both `copyPlan` and the link walk (lstat is not a directory, so nothing is pushed or visited). This checkout has no such path (`find . -type l -name dist` is empty), so no input reaches it.
- `source_dirty` refuses an untracked run log left in the source; that is D2's stated rule ("any line"), not a defect.
- Env-based network limits are removable by the model's own shell; the arena header and D3 name that boundary as a boundary, not a sandbox, so it is not re-reported.

## Confirmed-Clean Surfaces

- Dirty source: `sourceChanges` maps `git status --porcelain` lines and refuses with the first ten paths; the test at `command-behaviour-guards.vitest.ts:585-600` pins the JSON `source_dirty`.
- Stale build: `staleBuilds` refuses when a copied `dist`'s newest file is older than the newest tracked file of its folder or of a tsconfig `include` that climbs out; the refusal names every stale tree with both ISO times (:335-339), and tests at `:603-620` and `:800-820` pin both cases.
- Link escape: outside, dangling and absolute-inside links are refused; an inside relative link is copied as a link and a test pins it (`:682-700`).
- JSON answer: every source check is inside the `try`, and `abort` prints `{ok:false, code}` on stdout (`:97-101`); the test at `:820-840` asserts that line.
- Live arm: `turnRefusal` is called from `runTurn` before every turn (`:1296`), returns null on a dry run (`:652`), and the guard reads both the remote list and the arena marker (`:629-635`).
- Network reach: `childEnv` keeps the allowlist, drops every advisor switch on the `off`/`on` arms, and sets the empty credential helper, empty `GH_CONFIG_DIR`, no prompt and `GIT_ALLOW_PROTOCOL=file` (`:1038-1060`); the test at `command-behaviour-guards.vitest.ts:15-50` pins the protocol value.
- Marker ownership: the literal lives only in `prepare-behaviour-arena.mjs:65`; the runner, the offer replay and both tests import `MARK`, so the duplicated literal finding is closed.

## Ruled Out

- "The stale rule passes a clean tree with an old build" (verifier case B): ruled out by reading `staleBuilds`, which compares the copied build with the tracked sources rather than the tree state, and by the test at `command-behaviour-guards.vitest.ts:603-620`.
- "A dirty source still writes a partial arena": ruled out; all source checks end before `mkdirSync(dirname(dest))` (`:581`).
- "The new marker lines break the runner or the offer replay": ruled out; both readers call `existsSync` on the marker path only.
- "The every-turn guard is skipped on a later turn": ruled out; `turnRefusal` is outside the `isFirst` branch at `:1296-1308`.
- "A dry run is now refused for a missing arena": ruled out; `turnRefusal` returns null for `dryRun` before it reads git (`:650-652`).
- "Copying still assumes `cp -Rc` on every platform": ruled out; `copyArgs` returns `['-R']` off darwin and the test pins both (`command-behaviour-guards.vitest.ts:506-508`).
- "The marker is still written by more than one code path": ruled out; one exported constant, imported by the runner, the offer replay and both tests.

## Next Focus

- Dimension: traceability and maintainability (closing pass)
- Focus area: the packet's lane A task rows, `routing-accuracy/README.md` and the three changed test files
- Reason: the brief's last check is "docs agree with code"; the changed docs and the tasks that claim
  these fixes have not been read against the code yet
- Rotation status: security closed this iteration; the two carried P2s stay open
- Required evidence: `032-review-pass-five-remediation/tasks.md` lane A rows with their verify text,
  the README rows for `prepare-behaviour-arena.mjs` and `run-command-behaviour.mjs`, and test names
  for each new behavior
- Recovery note: not applicable

Review verdict: PASS
