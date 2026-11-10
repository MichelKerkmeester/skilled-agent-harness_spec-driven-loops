# Deep Research — Iteration 2 (A22: plugin bridge drift)

Run: `2026-10-19T19:08:58.499Z` (generation 2, restart). Segment 1, iteration 2 of 10.
Focus carried from the reducer: **A22 Plugin bridge drift** — `dualPlugin` coverage of `.opencode/plugins/*.js` entry files, hard-coded plugin lists in the v2 test suites and doctor battery, bridge event/hook mapping coverage, and README/mirror sync.

## Focus

1. Which `.opencode/plugins/*.js` entry files on main still lack the `dualPlugin` export from `.opencode/plugins/lib/v2-bridge.js`?
2. Which tests pin a hard-coded plugin list (v2-registration `PLUGIN_NAMES`, the hard-plugin suite, the doctor battery's expected count) instead of enumerating the directory — the gap class that once let `session-relaunch.js` reach main with only an OpenCode 1 factory?
3. Does the bridge's event and hook mapping cover every hook the plugins register (e.g. `session-relaunch.js`'s `message.updated` / `message.part.updated`)?
4. Do the plugin README and the mirrors under `.claude`, `.codex`, `.hermes` stay in sync?

## Actions Taken

All actions were read-only over the worktree at `/…/.worktrees/149-opencode-dual-compat-deep-research`. Nothing outside the packet's write paths was created, modified or deleted.

1. **Entry-file census.** `ls` of `.opencode/plugins/`, `lib/`, `tests/`; `grep -L dualPlugin .opencode/plugins/*.js` and `grep -l dualPlugin` per the focus; per-file extraction of every default-export line. Directory holds **17 entry files: 16 regular `.js` plus 1 symlink** (`sk-vision.js → ../skills/sk-vision/vision-runtime/dist/plugin.js`).
2. **Test-list audit.** Read `tests/v2-registration.test.cjs` in full; enumerated `PLUGIN_NAMES` and compared against the directory; audited `tests/v2-hard-plugins.test.cjs` (its own hard-coded `PLUGINS` array) and `tests/v2-bridge.test.cjs`; grepped all `tests/*.cjs` for `readdir*` to detect directory enumeration (only `goal-doc-contract.test.cjs` reads a directory — a different one, `.skilled/plugins/tests`).
3. **Read-only test run.** `node --test .opencode/plugins/tests/v2-registration.test.cjs` — 12/12 pass, ~171 ms. No repo files written by the run.
4. **Bridge mapping audit.** Read `lib/v2-bridge.js` in full (`MAPPED_HOOKS`, `EVENT_ALIASES`, `EVENT_MAPPINGS`, `skippedKeys` plumbing); grepped every plugin for hook keys it returns and event types its `event` handler switches on; checked which event-type literals are covered by mappings/aliases vs plain pass-through.
5. **README + mirror sync.** Read `.opencode/plugins/README.md` claims about the bridge, the test suites and sk-vision's exemption; enumerated `.claude`, `.codex`, `.hermes` mirror surfaces and read `.hermes/SYNC.md`'s drift-governance table; searched `.cursor/commands/doctor-*.md` for any plugin count pin (none found).

## Findings

### F-1 (P1) — No v1-only plugin remains on main, but nothing guards the invariant

Every one of the 16 regular entry files now builds its default export through the bridge, e.g. `session-relaunch.js` (the historical escapee) exports `dualPlugin('session-relaunch', sessionRelaunchPlugin)` [SOURCE: .opencode/plugins/session-relaunch.js:378]. `grep -L dualPlugin` flags only the one symlink [SOURCE: .opencode/plugins/sk-vision.js:1], which is not a bridge consumer by design (F-3). So the recurrence window for the original defect — an entry file reaching main with only an OpenCode 1 factory — is currently **closed in substance** but **open in enforcement**: no test, script or doctor check enumerates the directory and fails on a non-dual entry file. The invariant "every `.opencode/plugins/*.js` entry is dual" holds only as an unguarded convention.

### F-2 (P1) — Both v2 suites pin hand-maintained lists; the union happens to be complete, by coincidence only

- `tests/v2-registration.test.cjs` pins `PLUGIN_NAMES` — 12 names [SOURCE: .opencode/plugins/tests/v2-registration.test.cjs:19].
- `tests/v2-hard-plugins.test.cjs` pins its own `PLUGINS` array — 5 names [SOURCE: .opencode/plugins/tests/v2-hard-plugins.test.cjs:28], with `sk-vision` among them [SOURCE: .opencode/plugins/tests/v2-hard-plugins.test.cjs:61].
- Union of the two lists = 17 = exactly today's directory. The four plugins absent from `PLUGIN_NAMES` (`opencode-goal`, `system-completion-sentinel`, `system-skill-advisor`, `system-spec-gate`) are covered only because the hard suite independently lists all four. **No test enumerates `.opencode/plugins/`** (grep for `readdir*` across `tests/*.cjs`); `goal-doc-contract.test.cjs` enumerates a different directory [SOURCE: .opencode/plugins/tests/goal-doc-contract.test.cjs:53].

Consequence: a **new** entry file lands in neither list by default → zero v2 coverage, silently. That is the same failure shape that let `session-relaunch.js` reach main v1-only, and one of the two historical escape vectors (add file + forget both lists) is still unguarded. The registration run is green (12/12, executed read-only this iteration), which only proves the coincidence holds today.

### F-3 (P2) — sk-vision is a designed bridge exception; a naive "fail on any entry without `dualPlugin`" guard is invalid

`sk-vision.js` is a symlink to a bundled dist artifact that contains no `dualPlugin` string. This is documented, not drift: sk-vision registers a hook key outside the bridge's set (`chat.message`), does **not** go through the bridge, and ships a native v2 `setup` (`ctx.session.hook("prompt")`, tools via `ctx.tool.transform`) alongside its v1 `server` entry [SOURCE: .opencode/plugins/README.md:181]. The hard suite already covers its v2 leg via a `command.transform` registration expectation [SOURCE: .opencode/plugins/tests/v2-hard-plugins.test.cjs:61]. Any guard implemented straight from the focus's `grep -L dualPlugin` heuristic would therefore fail the designed exception. The guard policy must distinguish entry-file classes (see Guard design below).

### F-4 (P2) — `cleanup.skippedKeys` is the bridge's only signal for silently dropped hooks, and nothing asserts it for the 16 bridged plugins

The bridge drops every hook key outside `MAPPED_HOOKS` (= `event`, `tool.execute.before`, `tool.execute.after`, `experimental.chat.system.transform`, `tool`, `dispose`) [SOURCE: .opencode/plugins/lib/v2-bridge.js:8], records them in `cleanup.skippedKeys` [SOURCE: .opencode/plugins/lib/v2-bridge.js:280], and never logs or fails. The only assertion of `skippedKeys` anywhere in the suites pins the designed exception (`['chat.message']`) [SOURCE: .opencode/plugins/tests/v2-bridge.test.cjs:632]; **no test asserts `skippedKeys` is empty** for any of the 16 bridged plugins. A future plugin that returns a hook key outside the mapped set would pass CI fully green and be inert under OpenCode 2 — the quiet variant of the registration gap.

### F-5 (P2) — Core behaviors gate on event names whose live delivery on OpenCode 2.0.32 is explicitly unverified

The README states live hook delivery "is unverified on OpenCode 2.0.32" [SOURCE: .opencode/plugins/README.md:65]. The bridge synthesizes only two v1 event names from v2 stream events — `session.text.ended → message.part.updated` and `session.step.ended → message.updated` [SOURCE: .opencode/plugins/lib/v2-bridge.js:22] — plus aliases [SOURCE: .opencode/plugins/lib/v2-bridge.js:17]; everything else is forwarded verbatim, so correctness depends on v2 emitting matching type names. Several plugins gate real behavior on names the suites only ever feed through stubs:

- `session.created`: core trigger of `session-cleanup` [SOURCE: .opencode/plugins/session-cleanup.js:247]; also `opencode-goal` [SOURCE: .opencode/plugins/opencode-goal.js:3222], `system-deep-loop-guard` [SOURCE: .opencode/plugins/system-deep-loop-guard.js:67], `codex-hooks-watchdog` [SOURCE: .opencode/plugins/codex-hooks-watchdog.js:78]. The bridge passes it through and reshapes its payload [SOURCE: .opencode/plugins/tests/v2-bridge.test.cjs:91] — but only against a stub stream.
- `session-relaunch`'s three event types are covered (`message.updated` [SOURCE: .opencode/plugins/session-relaunch.js:228] via the step-ended mapping; `message.part.updated` [SOURCE: .opencode/plugins/session-relaunch.js:269] via the text-ended mapping; `session.idle` [SOURCE: .opencode/plugins/session-relaunch.js:295] via alias + pass-through) — the specific question in the focus is answered affirmatively **for session-relaunch**, contingent on the live host.

One mapping shape caveat: the synthesized `message.part.updated` is lossy — fixed role `assistant`, text parts only [SOURCE: .opencode/plugins/lib/v2-bridge.js:22]. No bridged plugin currently needs other part types; the restriction matters only to future consumers.

### F-6 (P3) — README count drift is real; mirror sync is governed and does not depend on the README

`.opencode/plugins/README.md` says the registration suite covers "11 plugins" [SOURCE: .opencode/plugins/README.md:77]; the suite's array holds 12 and the run executed this iteration reports `tests 12`. This is a live instance of the hand-maintained-list drift the focus hunts. Mirror-side (F-6b): `.hermes/SYNC.md` governs each mirrored surface with an explicit "Can it drift?" column — skills and prompts are checked by generated-copy sync scripts (`--check`), and the one plugin mirror (`.hermes/plugins/repo-guards`) is hand-authored against shared guard cores with behavioral parity only, validated by `hermes plugins validate` rather than file-list equality. No doctor command under `.cursor/commands/doctor-*.md` mentions plugins at all, so the focus's expected "doctor battery count" pin could not be located there; the only pinned count found in the repo is README:77.

## Questions Answered

No strategy key question is ticked this iteration. The A22 focus is one sub-angle of the open key question *"Which plugins, tests, generators and docs still assume one OpenCode version or a fixed file list?"*; this iteration resolved its **plugins** sub-angle (none v1-only; one designed exception) and its **tests/docs fixed-file-list** sub-angle (two hard-coded suites, one README count drift), but did not examine **generators** — so the box stays open for an iteration that can close it wholesale.

## Questions Remaining

- Which **generator scripts** still assume one OpenCode version or a fixed file list (the unexamined sub-angle of the open key question)?
- Does the OpenCode 2.0.32 host in fact emit the pass-through event names the plugins gate on (`session.created`, `server.instance.disposed`, `global.disposed`)? README:65 concedes this is unverified; closing it needs a read-only live observation, not edits.
- Should `skippedKeys` become loud (asserted empty per bridged plugin, exceptions manifest-gated) — sequencing question for the remediation phase.

## Next Focus

Recommended next (A22 → next): the **generator half** of the open key question plus the dual-version-architecture convergence item — enumerate any script that emits or validates plugin/tool/hook inventories (the only directory-enumerating test found reads `.skilled/plugins/tests`, a separate surface), and check whether the four-branch merged docs (sk-doc contracts) conflict with the README's own dual-export contract statement. F-5's live-delivery question can ride along only as an observation pass if a read-only window exists; it must not mutate the shared OpenCode 2 service.

## Guard design (report-only, for the remediation phase)

1. **Enumeration source of truth.** One module (e.g. `lib/plugin-inventory.cjs`) does `fs.readdirSync('.opencode/plugins', { withFileTypes: true })`, filters `.js` entries, resolves symlinks (`isSymbolicLink()`), and exports `{ files, nativeDual }`.
2. **Class A — bridge consumers (regular files):** require the default export line to read `export default dualPlugin('<stem>'` — asserting both the bridge import and that the registered id equals the file stem (kills the id/filename drift vector too).
3. **Class B — native-dual exceptions (symlinks/dist bundles):** allow only files named in an explicit exceptions manifest (initially `sk-vision`); each exception entry must (a) resolve to an existing file whose module, imported under the registration test's existing stub context, default-exports a plain object with string `id` equal to the stem and function `setup` and `server`, and (b) carry a free-text justification. The manifest fails both ways: naming a missing file fails, and an unlisted `.js` entry fails — forcing a conscious policy decision, never silent admission.
4. **Feed both suites from the inventory.** Replace `PLUGIN_NAMES` and the hard suite's `PLUGINS` array with the enumerated list (Class A in the registration suite; the hard suite continues to select from the inventory so removal of a file is caught).
5. **Make skipped keys loud.** In the registration suite, assert `cleanup.skippedKeys` is empty for every Class A plugin; any deliberately skipped key must appear in the exceptions manifest with justification. This turns the bridge's silent-drop channel into a CI failure.
6. **Doctor/CI count.** If a doctor battery wants a display count, print the enumerated count rather than pinning a literal; a pinned literal (the README:77 pattern) is what drifted.
7. **Event-name policy (second-order).** Derive from the plugin sources the set of `event.type` literals they handle, and assert each is either a stub-exercised stream type, an `EVENT_MAPPINGS`/`EVENT_ALIASES` source or target, or a manifest-listed pass-through with a live-verification note. This addresses F-5 structurally without touching any plugin.

## SCOPE VIOLATIONS

None. All writes this iteration were confined to `iterations/iteration-002.md`, `deltas/iter-002.jsonl`, a `/tmp` staging file consumed by the append gateway, and the gateway's own writes into the run directory.
