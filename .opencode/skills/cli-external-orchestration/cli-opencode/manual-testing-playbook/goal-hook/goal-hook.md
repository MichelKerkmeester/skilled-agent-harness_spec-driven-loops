---
title: "CO-039 -- Goal hook native mk-goal validation"
description: "Validates OpenCode goal actions, session isolation, fixed opaque state keys, lazy legacy migration, native token accounting, and system-prompt injection."
version: 1.1.0.0
---

# CO-039 -- Goal hook native mk-goal validation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-039`.

---

## 1. OVERVIEW

This scenario validates the OpenCode-native `mk-goal` plugin for `CO-039`. It focuses on the `/goal-opencode` command's action set (`set`, `show`, `history`, `doctor`, `health`, `clear`, `complete`, `pause`, `resume`), the `mk_goal` / `mk_goal_status` tool contract those actions route through, per-OpenCode-session goal state, native OpenCode token accounting, and the `experimental.chat.system.transform` injection that steers the model with a passive `[active_goal]` block.

`mk-goal` (`.opencode/plugins/mk-goal.js`) is a separate system from the runtime-neutral Pi/Cursor core under `.opencode/hooks/goal/` (see `CE-P03` in the hub playbook). It stores one file per OpenCode session as `<full-sha256-of-session-id>.json`, so filenames are fixed-length and do not expose a reversible session identifier. When a digest-keyed file is absent, a valid earlier hex-keyed file is adopted lazily only after its embedded session id is validated; an occupied digest target remains authoritative. Native `message.updated` events remain the source of `tokens_used`, not a turn-count estimate. Full contract: `.opencode/hooks/goal/goal-plugin.md`.

### Why This Matters

`/goal` is the only mechanism that gives an OpenCode session a durable, model-visible completion objective across turns. If the command router's action set, the per-session isolation, or the native token accounting silently regress, an operator's `/goal set` either corrupts a sibling session's goal, reports the wrong usage, or never reaches the model at all -- and nothing in a normal chat transcript would surface that until a goal quietly stalls. This scenario proves the plugin's own production code path (not a reimplementation) produces the documented envelope for the full action set, keeps two sessions' state files independent, and renders a well-formed injection block.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-039` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the native `mk-goal` plugin's action set, two-session isolation, fixed opaque state keys, validated lazy migration, long-session persistence, native token accounting, and passive `[active_goal]` injection by driving the shipped hooks directly against scratch state.
- Real user request: `Does /goal actually work end to end -- can I set a goal, see it reflected correctly, and does it stay scoped to my session without leaking into someone else's chat?`
- Prompt: `As an OpenCode plugin validator, exercise the shipped mk-goal hooks against scratch state. Verify the full /goal-opencode action set, two-session isolation, fixed 64-character SHA-256 state keys, long-session persistence, validated lazy migration of a legacy hex-keyed file, native message.updated token accounting, one [active_goal] injection, and fail-closed disable behavior. Return the exact envelope lines, state filenames, and a PASS/FAIL verdict.`
- Expected execution process: Import `.opencode/plugins/mk-goal.js`, instantiate it with a temporary `stateDir`, drive `tool.mk_goal`, `tool.mk_goal_status`, `event`, and `experimental.chat.system.transform` across two normal session ids plus one long id, rename one validated digest file into the earlier hex layout and trigger lazy adoption, then run all seven committed unit suites.
- Expected signals: `set` returns `STATUS=OK ACTION=set`, `mutation=created`, and a populated RICCE `goal_prompt`; every new basename matches `^[a-f0-9]{64}\.json$`; a 140-character session suffix persists successfully; a valid legacy file moves back to the digest path on read without changing its goal; the two normal sessions remain isolated; native input/output tokens sum exactly to `tokens_used=160` with `usage_source=opencode-native-tokens`; the transform appends one matching `[active_goal:<id>]` block; all actions return their documented success envelopes; the disable switch returns `code=PLUGIN_DISABLED`; and the focused suite passes 125/125.
- Evidence requirements: Capture the import exit status, scratch-script JSON result and state filename list, exact goal/status envelopes, migration source-and-target checks, injection assertion, and final TAP summary.
- Desired user-visible outcome: A concise PASS or FAIL verdict citing the exact captured envelope lines with no fabricated output, plus an explicit SKIP note (not a FAIL) for the live headless-model injection path, with the diagnosed reason.
- Pass/fail: PASS if every action above returns its documented envelope with correct field values (mutation on set, isolated per-session files, exact `tokens_used` sum, `opencode-native-tokens` source, an injection block naming the matching goal id, and every action failing closed under `PLUGIN_DISABLED`). FAIL if any envelope is malformed, if session state leaks across session ids, if token accounting mis-attributes, if the kill switch is ignored, or if a hook throws instead of returning its documented envelope.
- Failure triage: Check native session identity and the embedded legacy `sessionId` first. An occupied digest target must remain authoritative without deleting the legacy source. For token drift, inspect `properties.info.tokens`; never substitute generic usage or turn counts.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm `.opencode/plugins/mk-goal.js` and the 7 `.opencode/plugins/tests/mk-goal-*.test.cjs` suites exist.
3. Confirm `node -e "import('./.opencode/plugins/mk-goal.js')"` succeeds from the repository root; do not add temporary dependency links.
4. In a scratch script, instantiate the plugin with a fresh `stateDir` and drive the full action set against two normal session ids plus one 140-character id.
5. Assert every new state basename is a 64-character lowercase SHA-256 digest plus `.json`, with no raw or legacy hex session id present.
6. Rename one digest-keyed record to the earlier hex-keyed name, read it through `mk_goal_status`, and prove the validated record returns to the digest path while the source disappears.
7. Fire native token and system-transform hooks, then exercise the disable switch against every action.
8. Remove the scratch directory and separately run all seven committed unit suites.
9. Return a concise, evidence-backed verdict.

### Exact Command Sequence

Run `node -e "import('./.opencode/plugins/mk-goal.js')"`, execute the scratch script below as `node co-039-mk-goal-live.mjs`, then run `node --test .opencode/plugins/tests/mk-goal-*.test.cjs`.

Scratch script (real invocation, no mocks -- imports the shipped plugin file unmodified):

```javascript
import assert from 'node:assert/strict';
import { access, mkdtemp, rename, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const pluginUrl = pathToFileURL('.opencode/plugins/mk-goal.js').href;
const stateDir = await mkdtemp(join(tmpdir(), 'co-039-goal-'));
const { default: MkGoalPlugin } = await import(pluginUrl);
const hooks = await MkGoalPlugin({}, { stateDir });
const helpers = MkGoalPlugin.__test;

const A = { sessionID: 'sess-co-039-a' };
const B = { sessionID: 'sess-co-039-b' };

const setA = await hooks.tool.mk_goal.execute({ action: 'set', objective: 'Ship the CO-039 goal-hook manual-testing scenario', tokenBudget: 500 }, A);
assert.match(setA, /STATUS=OK ACTION=set/);
assert.match(setA, /mutation=created/);

const digestAPath = helpers.goalPathForSession(A.sessionID, { stateDir });
assert.match(basename(digestAPath), /^[a-f0-9]{64}\.json$/);

const legacyAPath = join(stateDir, `${Buffer.from(A.sessionID, 'utf8').toString('hex')}.json`);
await rename(digestAPath, legacyAPath);
const migratedA = await hooks.tool.mk_goal_status.execute({}, A);
assert.match(migratedA, /goal_present=true/);
await access(digestAPath);
await assert.rejects(access(legacyAPath));

const output = { system: [] };
const systemTransform = hooks['experimental.chat.system.transform'];
await systemTransform({ sessionID: 'sess-co-039-a' }, output);
assert.equal(output.system.length, 1);
assert.match(output.system[0], /^\[active_goal:/);

await hooks.event({ event: { type: 'message.updated', properties: { sessionID: 'sess-co-039-a', info: { id: 'msg-1', tokens: { input: 120, output: 40 } } } } });
const tokenStatus = await hooks.tool.mk_goal_status.execute({}, A);
assert.match(tokenStatus, /tokens_used=160/);
assert.match(tokenStatus, /usage_source=opencode-native-tokens/);

assert.match(await hooks.tool.mk_goal_status.execute({}, B), /goal_present=false/);
await hooks.tool.mk_goal.execute({ action: 'set', objective: 'Session B isolated objective' }, B);
assert.match(await hooks.tool.mk_goal_status.execute({}, A), /Ship the CO-039 goal-hook manual-testing scenario/);

const longSession = { sessionID: `session-${'s'.repeat(140)}` };
await hooks.tool.mk_goal.execute({ action: 'set', objective: 'Long native session id remains persistable' }, longSession);
assert.match(basename(helpers.goalPathForSession(longSession.sessionID, { stateDir })), /^[a-f0-9]{64}\.json$/);

const stateFiles = (await readdir(stateDir)).filter((name) => name.endsWith('.json'));
assert.equal(stateFiles.length, 3);
assert.ok(stateFiles.every((name) => /^[a-f0-9]{64}\.json$/.test(name)));

await hooks.tool.mk_goal.execute({ action: 'pause', reason: 'operator break' }, A);
await hooks.tool.mk_goal.execute({ action: 'resume' }, A);
await hooks.tool.mk_goal.execute({ action: 'history' }, A);
await hooks.tool.mk_goal.execute({ action: 'doctor' }, A);
await hooks.tool.mk_goal.execute({ action: 'complete' }, A);
await hooks.tool.mk_goal.execute({ action: 'clear' }, A);

process.env.MK_GOAL_PLUGIN_DISABLED = '1';
for (const action of ['set', 'show', 'history', 'doctor', 'health', 'pause', 'resume', 'complete', 'clear']) {
  const result = await hooks.tool.mk_goal.execute(
    action === 'set' ? { action, objective: 'should fail closed' } : { action },
    B,
  );
  assert.match(result, /STATUS=FAIL/);
  assert.match(result, /code=PLUGIN_DISABLED/);
}
delete process.env.MK_GOAL_PLUGIN_DISABLED;

await rm(stateDir, { recursive: true, force: true });
console.log(JSON.stringify({ verdict: 'PASS', stateFiles, migrated: true, tokensUsed: 160 }));
```

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
||---|---|---|---|---|---|---|---|---|
|| CO-039 | Goal hook native mk-goal validation | Verify actions, opaque persistence, lazy migration, isolation, native accounting, and injection | `As an OpenCode plugin validator, exercise the shipped mk-goal hooks against scratch state. Verify the full /goal-opencode action set, two-session isolation, fixed 64-character SHA-256 state keys, long-session persistence, validated lazy migration of a legacy hex-keyed file, native message.updated token accounting, one [active_goal] injection, and fail-closed disable behavior. Return the exact envelope lines, state filenames, and a PASS/FAIL verdict.` | 1. `node -e "import('./.opencode/plugins/mk-goal.js')"` -> 2. `node co-039-mk-goal-live.mjs` using the scratch script above -> 3. `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` | Import succeeds; three opaque 64-hex state names are observed; the long id persists; validated legacy state migrates to its digest path; A/B remain isolated; `tokens_used=160`; one matching injection block appears; every disabled action returns `code=PLUGIN_DISABLED`; all 125 tests pass | Scratch-script assertion output, state filename list, exact status envelopes, and TAP summary | PASS only when every storage, migration, isolation, accounting, injection, action, and disable assertion passes with 125/125 tests | Check native session identity and embedded legacy `sessionId` first; an occupied digest target must win without source deletion; token drift means inspect `properties.info.tokens`, never substitute generic usage |

### Optional Supplemental Checks

- **Dependency resolution.** The tracked `.opencode/node_modules/@opencode-ai/plugin` dependency resolves in this checkout. Treat import failure as install-state drift; do not create an untracked cache symlink as part of the playbook.
- **Unit-test suite run.** `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` passes 125/125: state 31, lifecycle 36, supervisor 14, continuation 24, export contract 3, capabilities 8, and tool-path 9.
- **Live headless `opencode run` attempt -- SKIP, not FAIL.** A live attempt to validate `mk_goal` through `opencode run` (rather than direct in-process invocation) is documented as not achievable in this environment, for two structural reasons independent of model quality: (1) the `mk_goal` / `mk_goal_status` tools are not exposed to the default headless-run agent -- `deepseek-v4-flash` replied verbatim "The `mk_goal` tool is not available in my tool set. I cannot call tools that don't exist."; (2) `experimental.chat.system.transform` does not fire in `opencode run --session`, even against a pre-seeded ACTIVE goal state matching the shipped schema exactly -- a resumed session asked "what is my active goal?" reported none, with zero `[active_goal]` occurrences in the transcript. Full write-up: `specs/hooks/004-goal-hook-playbooks-and-validation/evidence/opencode-mkgoal-finding.txt`. This is orthogonal to the PASS verdict above: the direct in-process run proves the plugin's own tool/event/transform code is correct; the headless-run surface simply does not expose it to a live model in this environment. All seven plugin suites are green, and a live model-visibility proof still requires an interactive OpenCode TUI or `serve` session.

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
|| `.opencode/plugins/tests/mk-goal-state.test.cjs` | State-store, fixed-key, long-id, and active migration coverage (31 tests) |
|| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Lifecycle, archive migration, and status-transition coverage (36 tests) |
|| `.opencode/plugins/tests/mk-goal-supervisor.test.cjs` | Heuristic / LLM verifier unit coverage (14 tests) |
|| `.opencode/plugins/tests/mk-goal-continuation.test.cjs` | Guarded auto-continuation unit coverage (24 tests) |
|| `.opencode/plugins/tests/mk-goal-export-contract.test.cjs` | Plugin export-shape unit coverage (3 tests) |
|| `.opencode/plugins/tests/mk-goal-capabilities.test.cjs` | Env/capability-flag coverage (8 tests) |
|| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Tool-context session-id resolution unit coverage (9 tests) |
|| `.opencode/hooks/goal/goal-plugin.md` | Operator contract for the plugin: runtime surfaces, environment variables, output fields, cross-runtime relationship |
|| `specs/hooks/004-goal-hook-playbooks-and-validation/evidence/opencode-mkgoal-finding.txt` | The live headless-run finding cited in Section 3 Optional Supplemental Checks |

---

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: CO-039
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `goal-hook/goal-hook.md`
