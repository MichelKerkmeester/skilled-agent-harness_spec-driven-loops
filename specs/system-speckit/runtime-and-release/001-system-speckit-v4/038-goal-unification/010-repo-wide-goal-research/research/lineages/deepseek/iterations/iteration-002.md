# Iteration 002 — Ring 2: every runtime surface

**Focus:** the OpenCode plugin, the per-runtime commands and prompts, the hook registries and
the generated mirrors under `.claude`, `.codex`, `.cursor`, `.devin`, `.pi`.
**Method:** runtime-directory enumeration; the registry and its generator; the three command
and prompt surfaces; targeted reads of `opencode-goal.js` (dispatch, state resolution, status
lines, kill switch); the export-contract and goal-offer tests; the injection contract.
**Prior rings kept:** ring 1 in full. **Two ring-1 verdicts are changed below** — one corrected,
one left standing with a stronger basis.

**Corrections carried forward**

- **R1-F7 is corrected.** Ring 1 called `goalSlice.resolveWorkspaceRoot` dead code. It is not.
  `opencode-goal.js` calls it at `:1828`, `:2724`, `:3080` and `:3089`. The core calls its own
  `resolveRepoRoot` at `goal-core.cjs:161`, `:194`, `:1046`, `:1118`. So **both** twins are live,
  in different implementations, which is worse than one being dead: `goal-slice.cjs:10-12`
  claims the module exists so "the CommonJS core and the ESM plugin cannot drift apart on it",
  and that claim holds for the *frontmatter boundary* it introduces — but the *workspace root*
  those two implementations resolve is computed by two separate functions that nothing forces
  to agree. The new finding is R2-F1.
- **A hypothesis of mine was falsified.** Mid-iteration I expected the goal adapter
  registrations to be hand-maintained, because `sync-hook-registrations.cjs` contains no
  `goal` literal. It is data-driven: the entries come from
  `hook-registry.json:506-547`, which carries the goal bindings for Cursor, Devin and Pi, and
  the generated registries are parity-tested. The hypothesis is recorded as ruled out, not as
  a finding.

---

## 1. What exists in this ring, by path

### 1.1 Native runtime artifacts

| Path | Kind | What it is |
|---|---|---|
| `.opencode/plugins/opencode-goal.js` | 3,372 lines, real file | The OpenCode-native plugin |
| `.opencode/plugins/tests/opencode-goal-*.test.cjs` | 7 files, 4,005 lines | state, tool path, lifecycle, supervisor, continuation, capabilities, export contract |
| `.opencode/plugins/tests/opencode-goal-render-parity.test.cjs` | 141 lines | Pins the two renderers against each other |
| `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | real file | Pins the speckit "Session Goal (optional)" offer across 12 command/workflow assets |
| `.opencode/commands/goal-opencode.md` | 109 lines | `/goal-opencode` router |
| `.cursor/commands/goal-cursor.md` | real file | `/goal-cursor` router |
| `.pi/prompts/goal-pi.md` | 1,857 bytes | Pi fallback prompt for `/goal-pi` |

### 1.2 Discovered-by-symlink artifacts

Every one was checked; all three resolve and all three are byte-identical to their target,
which is the same inode rather than a copy:

| Discovery path | Target |
|---|---|
| `.cursor/hooks/goal-inject.mjs` | `../../.opencode/hooks/goal/cursor/goal-inject.mjs` |
| `.devin/hooks/goal-inject.mjs` | `../../.opencode/hooks/goal/devin/goal-inject.mjs` |
| `.pi/extensions/goal-context.ts` | `../../.opencode/hooks/goal/pi/goal-context.ts` |
| `.opencode/hooks/goal/opencode/opencode-goal.js` | `../../../plugins/opencode-goal.js` |

### 1.3 Absent where a reader might expect them

`.claude/commands/` holds eight entries, none of them a goal command.
`.codex/prompts/` holds a long prompt list, none of them a goal prompt.
`.codex/hooks.json` has no goal binding. `hook-registry.json` carries goal bindings for
`cursor`, `devin` and `pi` only — **no `claude` binding and no `codex` binding**
(`hook-registry.json:506-547`).

---

## 2. What it actually does

### 2.1 The registrations are generated, and the goal entries are in the source of truth

`hook-registry.json`'s own note names the generator and the generated files:
`.claude/settings.json` hooks key, `.codex/hooks.json`, `.cursor/hooks.json`,
`.devin/hooks.v1.json` via `sync-hook-registrations.cjs`, with Pi "verified, not generated".
The goal entry is id `goal-inject`, concern "Inject the bound packet's goal and the resend
reminder", with:

- Cursor: `sessionStart`, group 0, slot 6, script
  `.opencode/hooks/goal/cursor/goal-inject.mjs`, timeout 10, fallback `envelope`
  (`hook-registry.json:509-520`).
- Devin: `SessionStart` slot 5 and `UserPromptSubmit` slot 2, script
  `.opencode/hooks/goal/devin/goal-inject.mjs` (`:521-542`).
- Pi: extension `goal-context.ts` (`:544-546`).

The emitted commands carry an `||` fallback that prints an `mk-hook-drift` line and a
fail-open JSON payload, which `hook-adapter-path-parity.vitest.ts:228` pins for Cursor and
`:218` for Claude. So a missing goal adapter is reported rather than silently skipped.

### 2.2 The plugin is a second full implementation, not a thin adapter

It imports only three things from the hook tree: `isHookEnabled`
(`opencode-goal.js:21`), the slice module (`:24`), and the locked append
(`:27` — specifically `appendPacketLog`, aliased `appendPacketLogShared`). Everything else is
its own: token accounting (`:948`, `:954`), the verifier, the continuation gates, retention
and sweeping, the `.continuation.log` and `.goal-events.log` files (`:71-72`), and the
lifecycle event handling.

Its status surface is much larger than the core's. `goalStateLines` emits 38 lines including
`plugin_id`, `prompt_framework`, `prompt_methodology`, `prompt_clear_score`, `prompt_char_count`,
`time_used_seconds`, `max_auto_turns`, `remaining_auto_turns`, `max_wall_ms`,
`remaining_wall_ms`, `provider_retry_after_ms`, `store_health`, `verifier_source`,
`verifier_last_evidence`, `blocked_by_prompt`, `continuation_suppressed`,
`continuation_attempts` and `continuation_suppressed_reason`
(`opencode-goal.js:2940-2988`). It also emits **both** naming generations:
`tokens_used=` and `budget_tokens_used=`, `usage_source=` and `budget_usage_source=`
(`:2960`, `:2968`, `:2967`, `:2970`). The CLI emits neither of the canonical pair (see R1-F6,
confirmed here from the other side).

### 2.3 The plugin's `packet` and `log` actions match the core's shape

`executeGoalAction`'s `packet` branch (`:3088-3101`) emits the same seven fields as
`bin/goal.cjs:211-219`. Its `log` branch (`:3074-3086`) calls the shared
`appendPacketLogShared` (`:3079`) with `workspace: current.workspace || goalSlice.resolveWorkspaceRoot(...)`,
so it serializes on the same per-packet lock the core uses. There is no second log appender.

### 2.4 Three layers route unknown actions three different ways

This is worth stating precisely, because all three look like "the goal command".

| Layer | Unknown-action behaviour | Evidence |
|---|---|---|
| OpenCode command router | Any other non-empty `QUERY` → `opencode_goal({action:"set", objective: QUERY})` | `goal-opencode.md:50`, `:82` |
| OpenCode plugin tool | Unknown `action` string → `UNKNOWN_ACTION` failure; no `action` at all → `show` | `opencode-goal.js:3034-3037` |
| Shared CLI | Unrecognized first token → falls through to `set` with the **original tokens as the objective** | `bin/goal.cjs:391`, `:429-435` |

The CLI's comment at `:430-431` says it mirrors "the /goal-opencode router's 'any other
non-empty QUERY' rule". That is true of the *command* and false of the *tool*, and the comment
does not say which one it means.

The pi fallback prompt is the only surface that states the consequence plainly
(`.pi/prompts/goal-pi.md:7`): "An unrecognized action is not rejected: it falls through to
`set`, so a mistyped action becomes the objective text." The CLI's own README and the plugin
contract do not carry that warning.

---

## 3. Where it disagrees with another surface, or with a document

### R2-F1 — Both twins of the workspace walk are live, in different implementations

`goal-slice.cjs:213-222 resolveWorkspaceRoot` and `goal-core.cjs:136-145 resolveRepoRoot` are
identical. The plugin calls the slice module's one (`opencode-goal.js:1828`, `:2724`, `:3080`,
`:3089`); the core calls its own (`goal-core.cjs:161`, `:194`, `:1046`, `:1118`) and Pi calls
the core's through the Pi adapter (`pi/goal-context.ts:94`).

`goal-slice.cjs:10-12` states the design intent: it is "the one place that boundary is drawn,
so the CommonJS core and the ESM plugin cannot drift apart on it." That is true of the
frontmatter boundary. The workspace root is the other boundary in the same module, and it is
drawn twice. `CLAIM: the plugin should call the core's export, or the core should call the
slice module's; leaving both means a marker-list or depth change can move the two
implementations' state roots apart, and the failure would appear as "the goal I bound is not
the goal I see" rather than as a test failure.`

### R2-F2 — `OPENCODE_GOAL_STATE_DIR` is honoured everywhere except OpenCode

The core resolves the state root from an explicit option, then `OPENCODE_GOAL_STATE_DIR`, then
the repo root (`goal-core.cjs:152-163`). The plugin resolves it from an explicit option, then
a constant derived from its own file location (`opencode-goal.js:34`, `:244-246`), and
**the literal `OPENCODE_GOAL_STATE_DIR` does not appear anywhere in the plugin.**

The engine README presents the override as a property of the concern:
"`OPENCODE_GOAL_STATE_DIR` | Override the state root (tests and isolated probes use this to avoid
touching the real `.state/goal/` tree)" (`README.md:130`), and `.env.example:304` says the same
without qualification. The plugin contract does not list it (its table, `goal-plugin.md:59-73`,
omits it — correctly).

The practical consequence: a probe that isolates state with that variable behaves as intended
under Pi, Cursor, Devin and the CLI, and **silently writes to the real
`.opencode/skills/.state/goal/` under OpenCode**. The repo already instructs operators to use
exactly that technique — `README.md:180` says "Use temporary `OPENCODE_GOAL_STATE_DIR` paths
for manual probes; never point migration fixtures at the operator's live state root." The
instruction is correct for four runtimes and wrong for the fifth.

`INFERRED: the omission is deliberate, because the plugin derives its default from its own
location and the loader pins that location. Reading the plugin's loader assumptions or asking
the author would settle it; the plugin contract's silence is weak evidence either way.`

### R2-F3 — The plugin repeats the wrong-variable disable message

`opencode-goal.js:58` sets `DISABLED_ENV = 'OPENCODE_GOAL_PLUGIN_DISABLED'` and interpolates
it into the `PLUGIN_DISABLED` message at `:3044` and `:3144`, while the gate is
`isHookEnabled('goal')` at `:243`. Identical in shape to R1-F2, in the second implementation.
Two independent code paths produce the same misleading sentence, so an operator who reads it
twice still learns the wrong variable name.

### R2-F4 — The plugin disables its own diagnostics too

`executeGoalAction` throws `PLUGIN_DISABLED` at `:3043-3045` **before** reaching `history`
(`:3046`), `doctor`/`health` (`:3050`) or `packet` (`:3088`). This is the same behaviour ring 1
found in the CLI (`bin/goal.cjs:395-397`), so R1-F3 is not a CLI quirk — it is the contract of
both front ends: **disabling the goal hook removes the goal diagnostics.** The core's exported
`appendPacketLog` and `describePacketGoal` still carry no check, so the gate exists only at the
two front ends.

### R2-F5 — The Role-line enumeration in the injection contract omits Devin

`injection-contract.md:123` prints the verbatim block shape with
`Role: Focused <Cursor|Pi> execution agent operating under the active session goal.`
The same section names Devin as an owner and documents Devin's channel
(`:139`, `:140`), and the Devin adapter renders `runtimeLabel: 'Devin'`
(`devin/goal-inject.mjs:67`). So the enumerations that a reader copies from the shape block are
short by one, and the one they miss is the adapter whose payload shape differs most
(`hookSpecificOutput.additionalContext` versus Cursor's `agent_message`).

### R2-F6 — `.cursor/hooks/README.md` calls the goal hook Cursor-only

`.cursor/hooks/README.md:42` says `goal-inject.mjs` "is a Cursor-only `sessionStart`
goal-injection hook". A Devin twin exists at `.opencode/hooks/goal/devin/goal-inject.mjs`, is
bound twice in the registry (`hook-registry.json:528`, `:538`), and is documented as such one
directory over. The sentence is true of the file in the directory it describes and false as a
statement about the fleet; a reader reconciling the hook tree against the runtime directories
gets two answers.

### R2-F7 — Cursor and Devin are invoked through the hook tree; only Pi is discovered through its symlink

| Runtime | What runs | What the symlink is for |
|---|---|---|
| Pi | `.pi/extensions/goal-context.ts`, discovered by Pi's loader | the discovery path — load-bearing |
| Cursor | `.opencode/hooks/goal/cursor/goal-inject.mjs`, invoked by the generated registry | decorative |
| Devin | `.opencode/hooks/goal/devin/goal-inject.mjs`, invoked by the generated registry | decorative |
| OpenCode | `.opencode/plugins/opencode-goal.js`, globbed by the loader | decorative |

`README.md:81` explains the OpenCode direction and the Pi direction accurately — "the real
`pi/goal-context.ts` lives here, and `.pi/extensions/` holds the relative symlink Pi discovers"
— but never mentions that `.cursor/hooks/` and `.devin/hooks/` also hold symlinks that resolve
and are never executed. A reader who "fixes" the symlink after a runtime break would change
nothing, and a reader who deletes it would break nothing.

### R2-F8 — Claude and Codex goal support is asserted, not present

`README.md:76-77` says Claude "Keeps its host goal command" and Codex the same.
`.opencode/hooks/README.md:234` repeats it as a coverage-matrix cell:
"by-design: native host goal command; the packet goal reaches it through the speckit
workflows". This repository carries no Claude goal command, no Codex goal prompt, no goal
binding in either runtime's hook registry, and no test that could fail if the host command
changed. The claim is a statement about software outside this tree.
`UNKNOWN whether Claude Code and Codex CLI currently ship a session-goal command with the
surface this document assumes. Checking those products' own documentation would settle it;
nothing in this repository can.`

### R2-F9 — The command surface names the alias as the disable flag

`goal-opencode.md:56` tells the operator that "When `OPENCODE_GOAL_PLUGIN_DISABLED=1`, plugin
tools fail closed". The hooks hub names `OPENCODE_GOAL_DISABLED` as canonical with
`OPENCODE_GOAL_PLUGIN_DISABLED` as its alias (`hooks/README.md:50`). The alias does work, so
the instruction is not wrong — but it is the third surface (after the live flag file and the
plugin contract) to present the alias as the primary name, and none of the three says which one
the resolver reads first.

---

## 4. What is unreachable, unused, or reads as live but is not

1. **`.cursor/hooks/goal-inject.mjs` and `.devin/hooks/goal-inject.mjs`** — resolve, are
   byte-identical to their targets, and are never executed. See R2-F7.
2. **`opencode-goal.js` `__test` seam** — 22 named exports pinned by
   `opencode-goal-export-contract.test.cjs`, and the module exposes **only** `default`
   (`Object.keys(pluginModule)` is asserted to be `['default']`). So the seam is
   test-reachable and not import-reachable. That is deliberate and pinned.
3. **`speckit-goal-offer-contract.test.cjs`** exists in `.opencode/plugins/tests/` and is
   listed by neither engine document's test list. `README.md:164` names
   `opencode-goal-*.test.cjs`, which does match it, but `goal-plugin.md:124-130` enumerates
   seven named files and omits this one. It is also the only test in the directory that
   asserts on speckit command assets rather than on the plugin.
4. **`OPENCODE_GOAL_STATE_DIR` for OpenCode** — reads as a universal override and is not one.
   See R2-F2.

---

## 5. What a new reader would get wrong

- **That `/goal-cursor` can bind.** It cannot; `goal-cursor.md:15` fails closed with
  `UNSUPPORTED_SESSION_BINDING`, and its one working read passes a placeholder session
  (`--session command-surface`) that the CLI never validates because `packet` is
  scope-exempt (`bin/goal.cjs:401`). The placeholder is harmless and reads as if it mattered.
- **That `/goal-pi` and `/goal-opencode` treat a typo the same.** They do not: the plugin tool
  fails with `UNKNOWN_ACTION`, the shared CLI sets a goal whose objective is the typo.
- **That "host goal command" is something in this repo.** It is not. See R2-F8.
- **That the state-dir override isolates a probe.** It does everywhere but OpenCode. See R2-F2.
- **That the two renderers are the risk.** They are parity-tested
  (`opencode-goal-render-parity.test.cjs`). The un-parity-tested duplication is the workspace
  walk. See R2-F1.
- **That the runtime symlinks are the wiring.** For three of four runtimes they are decoration.

---

## 6. Ruled out in this iteration

| Approach tried | Result |
|---|---|
| Claiming the goal adapter registrations are hand-maintained | Falsified. `sync-hook-registrations.cjs` is data-driven; the goal bindings live in `hook-registry.json:506-547` and are generated into `.cursor/hooks.json` and `.devin/hooks.v1.json`. Recorded as a ruled-out hypothesis, not a finding. |
| Claiming the goal adapter paths are unverified | Falsified. `hook-adapter-path-parity.vitest.ts:218` and `:228` pin the drift-marker fallback per runtime, and the registry note records Pi as verified rather than generated. |
| Treating `.claude/worktrees/**` as runtime surfaces | Ruled out. It is a checked-out worktree copy of an earlier tree (89,265 files) and is not the live repository. Every ring-2 claim above was taken from the live path, not from that copy. |
| Assuming `.cursor/hooks/goal-inject.mjs` is what Cursor runs because it is what Cursor's directory holds | Falsified by the generated registry, which invokes the hook-tree path. This became R2-F7. |

---

## 7. Open questions handed to ring 3

1. `speckit-goal-offer-contract.test.cjs` pins an offer line across 12 speckit assets. What
   renders the goal's durable slice into those workflows, and does that renderer enforce the
   same budget the hook does (R1-F4)?
2. Does the speckit lifecycle write `goal.md` for a new packet, and does the template carry the
   same 3000/4000 numbers the manifest declares?
3. Does the validator resolve the budget through the same manifest path
   (`templates/spec-kit-docs.json`) and does it read `appliesTo`?
4. `hook-registry.json` is a spec-kit runtime artifact that decides which goal adapters run.
   Which skill owns it, and does anything else in spec-kit read it?

Recorded `newInfoRatio`: **0.88**. The ring offered 14 paths of genuinely new material, two
corrections to ring 1, and seven new contradictions — but the deduction is honest on three
counts: R1-F6 and R1-F3 were *confirmed* from the second implementation rather than newly
found; one hypothesis was falsified rather than producing a finding; and R2-F3, R2-F9 and
R2-F6 are the same class of alias/precision gap that ring 1 already established, so their
marginal information is lower than a first occurrence would be.

---

## Evidence index

| Claim | Source |
|---|---|
| Plugin imports only three things from the hook tree | `opencode-goal.js:21`, `:24`, `:27` |
| Plugin state dir from its own file location | `opencode-goal.js:34`, `:244-246` |
| `OPENCODE_GOAL_STATE_DIR` absent from the plugin | literal search over `opencode-goal.js` |
| Core state-dir precedence | `goal-core.cjs:152-163` |
| Plugin uses the slice module's walk | `opencode-goal.js:1828`, `:2724`, `:3080`, `:3089` |
| Core uses its own walk | `goal-core.cjs:161`, `:194`, `:1046`, `:1118` |
| Pi uses the core's walk | `pi/goal-context.ts:94` |
| Plugin wrong-variable message | `opencode-goal.js:58`, `:243`, `:3044`, `:3144` |
| Plugin gates diagnostics behind the kill switch | `opencode-goal.js:3043`, `:3046`, `:3050`, `:3088` |
| Plugin calls the shared append | `opencode-goal.js:3079` |
| Plugin emits both field-name generations | `opencode-goal.js:2960`, `:2967`, `:2968`, `:2970` |
| CLI emits neither canonical field | `bin/goal.cjs:131` |
| Plugin status field list | `opencode-goal.js:2940-2988` |
| Plugin unknown-action failure | `opencode-goal.js:3034-3037` |
| CLI fall-through to `set` | `bin/goal.cjs:391`, `:429-435` |
| Pi prompt states the fall-through hazard | `.pi/prompts/goal-pi.md:7` |
| Command router falls through to `set` | `goal-opencode.md:50`, `:82` |
| Command names the alias as the switch | `goal-opencode.md:56` |
| Hooks hub names the canonical flag | `.opencode/hooks/README.md:50` |
| Cursor command fails closed | `goal-cursor.md:15`, `:36` |
| `packet` is scope-exempt | `bin/goal.cjs:401` |
| Registry goal bindings | `hook-registry.json:506-547` |
| Registry note names generator and outputs | `hook-registry.json` `_note` |
| Path parity pins the drift fallback | `hook-adapter-path-parity.vitest.ts:218`, `:228` |
| Symlinks resolve | on-disk `ls -la`, `readlink`, `cmp` |
| Claude/Codex absence | `.claude/commands/`, `.codex/prompts/`, `.codex/hooks.json`, `hook-registry.json` |
| Role-line enumeration | `injection-contract.md:123`, `:139`, `:140`; `devin/goal-inject.mjs:67` |
| Cursor-only claim | `.cursor/hooks/README.md:42` |
| Export seam pinned | `opencode-goal-export-contract.test.cjs` |
| Goal-offer test scope | `speckit-goal-offer-contract.test.cjs:14-40` |
| Probe instruction | `README.md:180`; `.env.example:304` |
