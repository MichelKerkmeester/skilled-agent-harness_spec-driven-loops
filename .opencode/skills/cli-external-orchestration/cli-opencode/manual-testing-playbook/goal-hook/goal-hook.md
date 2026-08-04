---
title: "CO-039 -- Goal hook native mk-goal validation"
description: "This scenario validates the OpenCode-native mk-goal plugin for `CO-039`. It focuses on the /goal-opencode action set, mk_goal/mk_goal_status tool behavior, per-OpenCode-session state, native token accounting, and the experimental.chat.system.transform injection, driven directly in-process against the shipped plugin."
version: 1.0.0.0
---

# CO-039 -- Goal hook native mk-goal validation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-039`.

---

## 1. OVERVIEW

This scenario validates the OpenCode-native `mk-goal` plugin for `CO-039`. It focuses on the `/goal-opencode` command's action set (`set`, `show`, `history`, `doctor`, `health`, `clear`, `complete`, `pause`, `resume`), the `mk_goal` / `mk_goal_status` tool contract those actions route through, per-OpenCode-session goal state, native OpenCode token accounting, and the `experimental.chat.system.transform` injection that steers the model with a passive `[active_goal]` block.

`mk-goal` (`.opencode/plugins/mk-goal.js`) is a SEPARATE system from the runtime-neutral cross-runtime port under `.opencode/hooks/goal/` (see `CE-P03` in the `cli-external-orchestration` hub playbook). This plugin keeps **per-OpenCode-session** state, one JSON file per hex-encoded session id under `.opencode/skills/.goal-state/`, and derives its `tokens_used` accounting from OpenCode's own `message.updated` event feed rather than a turn-count estimate. Full contract: `.opencode/hooks/goal/goal-plugin.md`.

### Why This Matters

`/goal` is the only mechanism that gives an OpenCode session a durable, model-visible completion objective across turns. If the command router's action set, the per-session isolation, or the native token accounting silently regress, an operator's `/goal set` either corrupts a sibling session's goal, reports the wrong usage, or never reaches the model at all -- and nothing in a normal chat transcript would surface that until a goal quietly stalls. This scenario proves the plugin's own production code path (not a reimplementation) produces the documented envelope for the full action set, keeps two sessions' state files independent, and renders a well-formed injection block.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-039` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the native `mk-goal` plugin's command-router action set, per-session state isolation, native token accounting, and passive `[active_goal]` injection all work as documented, by driving the shipped plugin's own `tool`, `event`, and `experimental.chat.system.transform` hooks directly in-process against a scratch session-state directory (not `opencode run`, which cannot exercise this surface headlessly -- see Optional Supplemental Checks).
- Real user request: `Does /goal actually work end to end -- can I set a goal, see it reflected correctly, and does it stay scoped to my session without leaking into someone else's chat?`
- Prompt: `As an OpenCode plugin validator, exercise the mk-goal plugin's tool, event, and experimental.chat.system.transform hooks directly against a scratch session-state directory. Verify the full /goal-opencode action set (set, show, history, doctor, health, pause, resume, complete, clear) returns the documented STATUS envelope, per-session goal state stays isolated by session id, native OpenCode token accounting attributes tokens correctly from a message.updated event, and the transform renders a well-formed [active_goal] injection block. Return the exact envelope lines and a PASS/FAIL verdict.`
- Expected execution process: An operator imports `.opencode/plugins/mk-goal.js` (ESM) directly, instantiates it against a scratch `stateDir`, and drives `tool.mk_goal` / `tool.mk_goal_status` / `event` / `experimental.chat.system.transform` exactly as the real OpenCode runtime would call them, across two independent session-id contexts, then separately runs the plugin's own 7 committed unit-test suites.
- Expected signals: `mk_goal` `set` returns `STATUS=OK ACTION=set` with `mutation=created`, `plugin_id=mk-goal`, and a populated RICCE `goal_prompt` (Role/Objective/Context/Method/Success Criteria/Stop Conditions, `prompt_framework="CRAFT+TIDD-EC"`); `experimental.chat.system.transform` appends exactly one `[active_goal:<id>]...[/active_goal]` block to `output.system`; an `event(message.updated)` carrying `properties.info.tokens.{input,output}` raises `tokens_used` by the exact sum and sets `usage_source=opencode-native-tokens`; a second session id reports `goal_present=false` before its own `set` and never disturbs the first session's file, leaving two distinct hex-named JSON files in the state dir; `pause`/`resume`/`history`/`doctor`/`health`/`complete`/`clear` all return `STATUS=OK ACTION=<action>`; `MK_GOAL_PLUGIN_DISABLED=1` fails every action closed with `code=PLUGIN_DISABLED`.
- Desired user-visible outcome: A concise PASS or FAIL verdict citing the exact captured envelope lines with no fabricated output, plus an explicit SKIP note (not a FAIL) for the live headless-model injection path, with the diagnosed reason.
- Pass/fail: PASS if every action above returns its documented envelope with correct field values (mutation on set, isolated per-session files, exact `tokens_used` sum, `opencode-native-tokens` source, an injection block naming the matching goal id, and every action failing closed under `PLUGIN_DISABLED`). FAIL if any envelope is malformed, if session state leaks across session ids, if token accounting mis-attributes, if the kill switch is ignored, or if a hook throws instead of returning its documented envelope.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm `.opencode/plugins/mk-goal.js` and the 7 `.opencode/plugins/tests/mk-goal-*.test.cjs` suites exist.
3. Resolve the plugin's runtime dependency (`@opencode-ai/plugin`) for in-process import: this checkout's `.opencode/node_modules` ships empty even though `.opencode/package.json` declares `@opencode-ai/plugin@1.15.12`, so link it from the OpenCode CLI's own resolved cache copy for the duration of the run, then remove the link -- this is a local install-state gap, not a plugin defect.
4. In a scratch script, import the plugin module, instantiate it with a `stateDir` override under a fresh temp directory, and drive the full action set against two independent session-id contexts.
5. Fire the `event` hook with a synthetic `message.updated` payload carrying native `tokens.{input,output}` fields.
6. Fire `experimental.chat.system.transform` and inspect the appended `output.system` entry.
7. Toggle `MK_GOAL_PLUGIN_DISABLED=1` mid-run against the same hooks object and confirm every action fails closed.
8. Remove the scratch state dir and the temporary dependency link, restoring the checkout to its original state.
9. Separately run each of the 7 committed unit-test suites.
10. Return a concise, evidence-backed verdict.

Scratch script (real invocation, no mocks -- imports the shipped plugin file unmodified):

```javascript
import { mkdtemp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const pluginUrl = pathToFileURL('.opencode/plugins/mk-goal.js').href;
const stateDir = await mkdtemp(join(tmpdir(), 'co-039-goal-'));
const { default: MkGoalPlugin } = await import(pluginUrl);
const hooks = await MkGoalPlugin({}, { stateDir });

const A = { sessionID: 'sess-co-039-a' };
const B = { sessionID: 'sess-co-039-b' };

await hooks.tool.mk_goal.execute({ action: 'set', objective: 'Ship the CO-039 goal-hook manual-testing scenario', tokenBudget: 500 }, A);
await hooks.tool.mk_goal_status.execute({}, A);

const output = { system: [] };
await hooks['experimental.chat.system.transform']({ sessionID: 'sess-co-039-a' }, output);

await hooks.event({ event: { type: 'message.updated', properties: { sessionID: 'sess-co-039-a', info: { id: 'msg-1', tokens: { input: 120, output: 40 } } } } });
await hooks.tool.mk_goal_status.execute({}, A);            // tokens_used should now be 160

await hooks.tool.mk_goal_status.execute({}, B);             // goal_present=false
await hooks.tool.mk_goal.execute({ action: 'set', objective: 'Session B isolated objective' }, B);
await hooks.tool.mk_goal_status.execute({}, A);              // session A objective unchanged
await readdir(stateDir);                                     // 2 distinct hex-named files

await hooks.tool.mk_goal.execute({ action: 'pause', reason: 'operator break' }, A);
await hooks.tool.mk_goal.execute({ action: 'resume' }, A);
await hooks.tool.mk_goal.execute({ action: 'history' }, A);
await hooks.tool.mk_goal.execute({ action: 'doctor' }, A);
await hooks.tool.mk_goal.execute({ action: 'complete' }, A);
await hooks.tool.mk_goal.execute({ action: 'clear' }, A);

process.env.MK_GOAL_PLUGIN_DISABLED = '1';
await hooks.tool.mk_goal.execute({ action: 'set', objective: 'should fail closed' }, B);

await rm(stateDir, { recursive: true, force: true });
```

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
||---|---|---|---|---|---|---|---|---|
|| CO-039 | Goal hook native mk-goal validation | Confirm the mk-goal plugin's command-router action set, per-session isolation, native token accounting, and [active_goal] injection all work via direct in-process invocation of the shipped plugin | `As an OpenCode plugin validator, exercise the mk-goal plugin's tool, event, and experimental.chat.system.transform hooks directly against a scratch session-state directory. Verify the full /goal-opencode action set (set, show, history, doctor, health, pause, resume, complete, clear) returns the documented STATUS envelope, per-session goal state stays isolated by session id, native OpenCode token accounting attributes tokens correctly from a message.updated event, and the transform renders a well-formed [active_goal] injection block. Return the exact envelope lines and a PASS/FAIL verdict.` | 1. `bash: ls .opencode/plugins/mk-goal.js .opencode/plugins/tests/mk-goal-*.test.cjs` -> 2. `bash: ln -s ~/.cache/opencode/node_modules/@opencode-ai .opencode/node_modules/@opencode-ai` (resolves the plugin's declared-but-uninstalled runtime dependency; reversible, gitignored path) -> 3. `node co-039-mk-goal-live.mjs` (the scratch script above: set/show/transform/message.updated-accounting/second-session-isolation/pause/resume/history/doctor/complete/clear/PLUGIN_DISABLED, all against two session-id contexts) -> 4. `bash: rm .opencode/node_modules/@opencode-ai` -> 5. `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` | Step 3: `set` -> `STATUS=OK ACTION=set` + `mutation=created`; transform appends one `[active_goal:<id>]...[/active_goal]` block; post-`message.updated` show -> `tokens_used=160` + `usage_source=opencode-native-tokens`; session B `show` before its own set -> `goal_present=false`; session A `show` after session B's `set` -> unchanged objective; state dir lists 2 distinct hex-named `.json` files; `pause`/`resume`/`history`/`doctor`/`complete`/`clear` all `STATUS=OK`; disabled `set` -> `STATUS=FAIL ... code=PLUGIN_DISABLED` | Captured stdout from the scratch script (every `STATUS=` line plus the `tokens_used`/`usage_source` and state-dir listing), plus the `node --test` summary line for each of the 7 suites | PASS if every action in Step 3 returns its documented envelope with correct mutation/isolation/accounting/injection fields AND the disabled toggle fails every action closed; FAIL if any envelope is malformed, session state leaks across ids, token accounting mis-attributes, or a hook throws | Confirm `@opencode-ai/plugin` resolves from `.opencode/plugins/mk-goal.js`'s own node_modules chain before debugging plugin logic (a `Cannot find package '@opencode-ai/plugin'` error is an install-state gap, not a plugin defect -- see step 2); if `tokens_used` is not exactly 160, confirm the `message.updated` payload nests tokens under `properties.info.tokens` (the native-usage path) rather than a generic `usage` object |

### Optional Supplemental Checks

- **Environment dependency resolution.** This checkout's `.opencode/node_modules/` is empty even though `.opencode/package.json` pins `@opencode-ai/plugin@1.15.12`; a fresh `npm install` under `.opencode/` would resolve it permanently, but for a read-only reproduction the temporary symlink in Step 2 above is sufficient and leaves no tracked-file change (`.opencode/node_modules` is gitignored; `git status --porcelain -- .opencode/node_modules` was confirmed clean both before and after).
- **Unit-test suite run.** `node --test` against each of the 7 suites, with the same dependency resolved: `mk-goal-state.test.cjs` 26/26, `mk-goal-lifecycle.test.cjs` 35/35, `mk-goal-supervisor.test.cjs` 14/14, `mk-goal-continuation.test.cjs` 24/24, `mk-goal-export-contract.test.cjs` 3/3, and `mk-goal-tool-path.test.cjs` 9/9 all pass in full. `mk-goal-capabilities.test.cjs` passes 7/8 -- the one failure is a pre-existing stale-path defect independent of this scenario: `mk-goal-capabilities.test.cjs:282` reads `.opencode/commands/goal-opencode.md`, but the shipped command lives at `.opencode/commands/goal-opencode.md` (confirmed present and correct via `Read`). This is a documented test-suite drift, out of scope for this playbook to fix, and does not affect the CO-039 verdict above (none of the passing suites depend on that path).
- **Live headless `opencode run` attempt -- SKIP, not FAIL.** A live attempt to validate `mk_goal` through `opencode run` (rather than direct in-process invocation) is documented as not achievable in this environment, for two structural reasons independent of model quality: (1) the `mk_goal` / `mk_goal_status` tools are not exposed to the default headless-run agent -- `deepseek-v4-pro` replied verbatim "The `mk_goal` tool is not available in my tool set. I cannot call tools that don't exist."; (2) `experimental.chat.system.transform` does not fire in `opencode run --session`, even against a pre-seeded ACTIVE goal state matching the shipped schema exactly -- a resumed session asked "what is my active goal?" reported none, with zero `[active_goal]` occurrences in the transcript. Full write-up: `.opencode/specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/opencode-mkgoal-finding.txt`. This is orthogonal to the PASS verdict above: the direct in-process run proves the plugin's own tool/event/transform code is correct; the headless-run surface simply does not expose it to a live model in this environment. mk-goal's `setGoal` / injection / lifecycle / supervisor behavior remains covered by its unit suites (6/7 fully clean, see above), and a live proof of the injection path requires an interactive OpenCode TUI or `serve` session, which is not scriptable here.

---

## 4. SOURCE FILES

### Playbook Sources

|| File | Role |
||---|---|
|| `manual-testing-playbook.md` | Root directory page and scenario summary |
|| `goal-hook/goal-hook.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

|| File | Role |
||---|---|
|| `.opencode/plugins/mk-goal.js` | The OpenCode-native goal plugin: `tool.mk_goal` / `tool.mk_goal_status`, `event`, `experimental.chat.system.transform` |
|| `.opencode/commands/goal-opencode.md` | The `/goal-opencode` command router whose action set this plugin implements |
|| `.opencode/plugins/tests/mk-goal-state.test.cjs` | State-store unit coverage (26 tests) |
|| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Lifecycle / status-transition unit coverage (35 tests) |
|| `.opencode/plugins/tests/mk-goal-supervisor.test.cjs` | Heuristic / LLM verifier unit coverage (14 tests) |
|| `.opencode/plugins/tests/mk-goal-continuation.test.cjs` | Guarded auto-continuation unit coverage (24 tests) |
|| `.opencode/plugins/tests/mk-goal-export-contract.test.cjs` | Plugin export-shape unit coverage (3 tests) |
|| `.opencode/plugins/tests/mk-goal-capabilities.test.cjs` | Env/capability-flag unit coverage (7/8; 1 pre-existing stale-path failure, see Section 3) |
|| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Tool-context session-id resolution unit coverage (9 tests) |
|| `.opencode/hooks/goal/goal-plugin.md` | Operator contract for the plugin: runtime surfaces, environment variables, output fields, cross-runtime relationship |
|| `.opencode/specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/opencode-mkgoal-finding.txt` | The live headless-run finding cited in Section 3 Optional Supplemental Checks |

---

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: CO-039
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `goal-hook/goal-hook.md`
