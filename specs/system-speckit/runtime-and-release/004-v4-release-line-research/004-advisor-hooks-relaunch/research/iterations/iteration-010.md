# Iteration 10 — Close-out: UX and extension

## Focus

Final iteration. Three targets, in the orchestrator's order:

1. Root cause of the relaunch-nudge suite failure under `AI_SESSION_CHILD=1`: which code reads the variable, which test lacks env isolation, what the fix is.
2. Operator UX: the exact steps and env names to enable relaunch, read the advisor brief and recover history, marking each step with no doc or a wrong doc.
3. Three concrete extensions, each naming files and what breaks today without it.

The orchestrator's correction was taken as the baseline and independently re-verified here: the suite is green in a clean environment and red only when the child marker is inherited. `hook-flags.env` being untracked is confirmed.

## Actions Taken

1. Located every reader of `AI_SESSION_CHILD` inside the concern tree. The only nudge-path read is `relaunchSessionIsChild(env)`, called from `nudgeDecision()` — `[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:569]`, imported through a **deferred** `require('../../goal/lib/goal-core.cjs')` on the preceding line `[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:568]`. The predicate itself lives in the goal concern `[SOURCE: .skilled/hooks/goal/lib/goal-core.cjs:1189]`.
2. Read the hermetic fixture the relaunch suites share. `HERMETIC_DROP_KEYS` is built from the relaunch switch keys, the goal switch keys and `HOOK_FLAGS_CONFIG` only — `[SOURCE: .skilled/hooks/session-relaunch/tests/fixtures/relaunch-env.cjs]`. `AI_SESSION_CHILD` is not among them, so `clearRelaunchSwitches()` cannot remove it.
3. Read the OpenCode plugin suite's own save/restore list. `ENV_KEYS` names 15 keys and none is the child marker — `[SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:37]` through `[SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:53]`; the setup then calls `clearRelaunchSwitches(process.env)` `[SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:59]` and restores only `ENV_KEYS` afterwards `[SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:76]`.
4. Reproduced both directions and measured a second victim suite:
   - `.opencode/plugins/tests/session-relaunch.test.cjs` — `env -u AI_SESSION_CHILD`: **65 tests, 65 pass, 0 fail**. `AI_SESSION_CHILD=1`: **65 tests, 38 pass, 27 fail**.
   - `.skilled/hooks/session-relaunch/tests/` — `env -u AI_SESSION_CHILD`: **813 tests, 813 pass, 0 fail**. `AI_SESSION_CHILD=1`: **813 tests, 785 pass, 28 fail**.
   - `.skilled/hooks/goal/` — `AI_SESSION_CHILD=1`: **199 tests, 199 pass** — the goal suites are immune because they isolate the marker themselves `[SOURCE: .skilled/hooks/goal/pi/goal-pi.test.mjs:36]` and delete it `[SOURCE: .skilled/hooks/goal/pi/goal-pi.test.mjs:40]`.
5. Confirmed the flags-file state: `git ls-files .skilled/hooks/hook-flags.env` returns **0** lines while the working copy holds a 5,645-byte file, so a fresh clone has no flags file at all. The copy step is documented in two places `[SOURCE: .skilled/hooks/README.md:83]`, `[SOURCE: README.md:1604]`.
6. Resolved the flag surface from the resolver itself rather than from prose: `DEFAULT_OFF['session-relaunch'] = SYSTEM_SESSION_RELAUNCH_ENABLED`, six runtimes `claude,codex,pi,opencode,cursor,devin`, per-runtime names `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED`, kill switch `SYSTEM_SESSION_RELAUNCH_DISABLED`. Matches the reference rows `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:107]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:109]`.
7. Read the enable paragraph an operator actually lands on `[SOURCE: .skilled/hooks/session-relaunch/README.md:89]` and the manual-handoff paragraph `[SOURCE: .skilled/hooks/session-relaunch/README.md:58]`, plus the doctor asset that can create the flags file `[SOURCE: .skilled/commands/doctor/assets/doctor-env.yaml:122]`.
8. Sampled the copy surface for the extension proposals: four near-identical per-runtime READMEs for one concern `[SOURCE: .skilled/hooks/git-worktree-guard/claude/README.md:19]` vs `[SOURCE: .skilled/hooks/git-worktree-guard/codex/README.md:19]`, the per-runtime ask-surface adapter `[SOURCE: .skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs:30]` and its per-runtime test `[SOURCE: .skilled/hooks/ask-surface-guard/tests/dsh-ask-surface-guard.test.mjs:65]`.

## Findings

### f-iter010-001 — The relaunch nudge is silently off for a whole test process that inherits `AI_SESSION_CHILD` (bug, **P1**)

Type: bug. Introduced with the child-session gate on the nudge path (v4.0.0.13/.14 cluster). Confidence: high — reproduced both directions.

Chain, in order:

1. `nudgeDecision()` returns `quiet('child-session')` before any ratio check `[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:569]`.
2. The OpenCode plugin hands it `process.env` at every call site `[SOURCE: .opencode/plugins/session-relaunch.js:183]`.
3. The hermetic fixture drops relaunch switches, goal switches and `HOOK_FLAGS_CONFIG` — never the child marker `[SOURCE: .skilled/hooks/session-relaunch/tests/fixtures/relaunch-env.cjs]`.
4. The suite's `ENV_KEYS` does not name it either, so nothing clears or restores it `[SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:37]`.
5. Every CLI dispatch in this repository exports `AI_SESSION_CHILD=1` (the repo's own dispatch audit log records it in the dispatched command lines), so a test runner started from inside any dispatched session — including a deep-research child like this one — runs the suite with the marker set.

The failure mode is the worst possible one for a gate: the code is correct and the *test* is silently disabled. 27 of 65 cases stop testing anything, and they fail rather than pass only because each asserts the nudge fires.

**Fix (reported, not applied — this run is read-only on the target):**

- One line in the shared fixture: add `'AI_SESSION_CHILD'` to `HERMETIC_DROP_KEYS` in `.skilled/hooks/session-relaunch/tests/fixtures/relaunch-env.cjs`. That single edit covers both victim suites, because both clear through `clearRelaunchSwitches()`.
- One line in the plugin suite: add `'AI_SESSION_CHILD'` to `ENV_KEYS` `[SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:37]` so the after-hook restores the shell's value instead of deleting it for the rest of the process.
- Safe to drop unconditionally: the suites that need the child path set it explicitly per case (`nudge.test.cjs:1131`, `claude-adapters.test.cjs:1543`), so a cleared ambient value changes nothing for them.

Verify:

```bash
env -u AI_SESSION_CHILD node --test .opencode/plugins/tests/session-relaunch.test.cjs   # 65/65 pass
AI_SESSION_CHILD=1 node --test .opencode/plugins/tests/session-relaunch.test.cjs        # 38 pass / 27 fail today
AI_SESSION_CHILD=1 node --test .skilled/hooks/session-relaunch/tests/                   # 785 pass / 28 fail today
```

### f-iter010-002 — The child-session predicate belongs to the goal concern and is loaded lazily from the nudge path (misalignment / over-engineering, **P2**)

`session-relaunch` cannot answer "am I a child" without `goal`'s core, and it hides that dependency behind a `require` inside the function body `[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:568]`. The comment above it states the intent; the require placement states a cycle that was worked around rather than removed. Consequence: if `goal-core.cjs` is renamed or its path shifts, `session-relaunch` fails **at nudge time inside a host callback**, not at load time, and the failure is invisible until a session crosses the threshold. A marker one hook reads and another hook's library defines is a shared-contract object; it belongs in `.skilled/hooks/shared/`, where `hook-flags.cjs` already is.

Verify: `grep -n "relaunchSessionIsChild" .skilled/hooks/session-relaunch/lib/*.cjs .skilled/hooks/shared/*.cjs` returns exactly one hit, the deferred require.

### f-iter010-003 — The enable-relaunch recipe has no single owner, and the file it tells you to edit does not exist in a fresh clone (UX, **P2**)

Confidence: high for the doc state, high for the file state (`git ls-files` returns nothing).

Step table, with the exact surface and its doc state:

| # | Step and exact surface | Doc state |
|---|---|---|
| 1 | Create the flags file: `cp .skilled/hooks/hook-flags.env.example .skilled/hooks/hook-flags.env` | Documented, but **in the wrong document**: `[SOURCE: .skilled/hooks/README.md:83]` and `[SOURCE: README.md:1604]`. The relaunch doc an operator reaches from the concern never names this step — `[SOURCE: .skilled/hooks/session-relaunch/README.md:89]` |
| 2 | Enable: `SYSTEM_SESSION_RELAUNCH_ENABLED=1` for every runtime, or one of `SYSTEM_SESSION_RELAUNCH_{CLAUDE,CODEX,PI,OPENCODE,CURSOR,DEVIN}_ENABLED=1` | Documented well: `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:108]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:109]`. Correct: verified against the resolver, which also reports the concern as off by default |
| 3 | Know what overrides what: `SYSTEM_SESSION_RELAUNCH_DISABLED` and the master hook switch win over step 2; a file value beats an environment value per runtime | Documented: `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:107]`, `:109` |
| 4 | Tune: `SESSION_RELAUNCH_THRESHOLD` (default 0.80), `SESSION_RELAUNCH_WINDOW_TOKENS`, `SESSION_RELAUNCH_MAX_HOPS` (default 10), `SESSION_RELAUNCH_MAX_AGE_MIN` (default 10) | Documented: `:119`–`:122` |
| 5 | Actually get a hop — inside the wrapper (`skilled-loop`, which exports `SKILLED_LOOP_ID`) or by hand via `/speckit:handoff` plus the claim command `prepare` prints and exits 3 with | **No doc**: the two routes are described separately `[SOURCE: .skilled/hooks/session-relaunch/README.md:58]` and neither doc states the ordering, nor that a step-2-only install produces zero hops outside the loop |
| 6 | Confirm it is live (e.g. the `history` subcommand, which bypasses the switch) | **No doc**: the subcommand's switch-independence is stated in passing `[SOURCE: .skilled/hooks/session-relaunch/README.md:122]`; nothing tells an operator to run it as a smoke test |
| 7 | Let the doctor do steps 1–2 for you | Half a doc: the asset can initialize the file from the example after an explicit yes and set one eligible non-secret switch `[SOURCE: .skilled/commands/doctor/assets/doctor-env.yaml:122]`, but nothing in the doctor's surface says relaunch ships off, so `STATUS=OK` reads as "relaunch works" |

The gap is not missing prose — the reference table is genuinely good. It is that the **first** step depends on a file only two other documents mention, and the **last** step (the loop) is the one no table describes. An operator who sets the flag and waits gets silence, with no signal distinguishing "off" from "on but never inside a loop".

### f-iter010-004 — The advisor appears in the operator surface only as a kill switch (UX, **P2**, confidence medium)

In the operator-facing docs opened this iteration, the advisor's only mention is the re-enable example inside the hooks README's config paragraph `[SOURCE: .skilled/hooks/README.md:80]`. There is no brief-reading or "why was this skill recommended" recipe in the surfaces sampled: the hooks README config section, the ENV-REFERENCE relaunch rows, and the doctor env assets. The reference table gives relaunch nine rows with defaults, effects and readers, and gives the advisor no equivalent block.

Scoped honestly: this is an absence in the documents opened, not proof of absence everywhere. `.skilled/skills/system-skill-advisor/SKILL.md` and `hooks/skill-advisor-hook.md` were not opened this iteration.

### f-iter010-005 — Extension: generate per-runtime adapters and their READMEs from one hook manifest (extension, **P2**)

Today one concern carries a directory per runtime, each with its own adapter and its own README whose paragraphs are byte-identical across runtimes — `[SOURCE: .skilled/hooks/git-worktree-guard/claude/README.md:19]`, `[SOURCE: .skilled/hooks/git-worktree-guard/codex/README.md:19]`, and the cursor and devin copies. The resolver already centralizes the *names* (`RUNTIMES`, `runtimeEnableFlag`, `DEFAULT_OFF` in `.skilled/hooks/shared/hook-flags.cjs`); nothing centralizes the *files*.

Proposal: one manifest (`.skilled/hooks/hooks.manifest.json`) mapping concern → runtimes → adapter entry point, event name and flag key; a generator writes each runtime's adapter and README, and a test asserts the tree matches the manifest.

What breaks today without it: a new runtime is an N-file hand edit across every concern, and nothing detects a partial application. The four identical README paragraphs are the visible symptom — they stay in sync only because nobody has edited one yet.

Verify today's spread: `find .skilled/hooks -maxdepth 3 -name README.md | wc -l` and diff any two per-runtime copies of one concern.

### f-iter010-006 — Extension: one shared detector corpus across runtimes, run under a hostile ambient env (extension, **P1**)

Today each runtime's detector has its own adapter and its own test file — `[SOURCE: .skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs:30]`, `[SOURCE: .skilled/hooks/ask-surface-guard/tests/dsh-ask-surface-guard.test.mjs:65]` — with no shared corpus and no shared ambient-env contract.

What breaks today without it: **exactly f-iter010-001**. A whole suite's env isolation gap survived the entire release line because no harness asserts "every runtime's suite behaves the same under a dispatched-child environment". The same shape recurs for every marker the hooks read (`AI_SESSION_CHILD`, `SKILLED_LOOP_*`, the six per-runtime switches): each suite decides for itself what to clear, and three of them got it wrong.

Proposal: `.skilled/hooks/shared/tests/corpus/` holding one case list, plus a per-runtime runner that executes each case twice — once with a clean env and once with a hostile ambient env (`AI_SESSION_CHILD=1`, `SYSTEM_HOOKS_DISABLED` unset-but-present, a stale `HOOK_FLAGS_CONFIG`). A case that passes only in the clean run is a finding, not a flake.

Verify: `AI_SESSION_CHILD=1 node --test .skilled/hooks/session-relaunch/tests/` — 28 failures today, which such a runner would have surfaced at the release that added the gate.

### f-iter010-007 — Extension: drive the doctor's concern report from the flag resolver (extension, **P2**)

The doctor can already create the flags file and set one switch `[SOURCE: .skilled/commands/doctor/assets/doctor-env.yaml:122]`, and it knows where a missing file should come from `[SOURCE: .skilled/commands/doctor/assets/doctor-env.yaml:22]`. It does not know that `session-relaunch` is the one concern that ships off: `DEFAULT_OFF['session-relaunch']` lives in the resolver and reaches no doctor output.

Proposal: a flags-derived row set in `.skilled/commands/doctor/assets/doctor-env.yaml` (plus a matching entry in the presentation asset) enumerating every concern with `default`, `effective value`, `source file or env` and, for `DEFAULT_OFF` concerns, the exact copy-paste enable line.

What breaks today without it: an operator runs `/doctor:env`, gets a clean status, and relaunch is still off — the only signal is a nudge that never arrives, which is indistinguishable from "not near the threshold". This is the cheapest of the three: the resolver already exports everything the row needs.

Verify: `node -e "const f=require('./.skilled/hooks/shared/hook-flags.cjs'); console.log(f.DEFAULT_OFF)"` then `grep -c "session-relaunch" .skilled/commands/doctor/assets/doctor-env.yaml`.

## Questions Answered

None ticked. The UX-and-extension question is **partly** answered — enabling relaunch is fully characterised with evidence (f-iter010-003), and the extension half is answered (f-iter010-005/006/007) — but three of its five sub-parts are not:

- reading the advisor brief: only the absence of an operator recipe was established (f-iter010-004), not the reader path itself;
- recovering history: not examined this iteration at all;
- the extension half's own claim ("what blocks the AI user", as opposed to the operator) rests on the operator evidence plus the child-session finding, not on a separate AI-user measurement.

Per the exact-match rule the box stays unticked rather than claiming a partial answer.

## Questions Remaining

Ordered by what the next run should do first.

1. **The shared daemon and degraded scoring (v4.0.0.0/.16)** — still unexercised, now across **eight** iterations and the run's largest untested claim. Everything in the transport question except "MCP is gone" is inference from reading.
2. **History recovery as an operator path** — untouched. The concrete question: after compaction, which command returns the pre-compaction turn, and does `session-history-lookup` have an operator entry point at all, or only a plugin callback?
3. **The advisor brief reader path** — open `.skilled/skills/system-skill-advisor/SKILL.md` and `hooks/skill-advisor-hook.md` and decide whether f-iter010-004 is a real doc gap or an artifact of where I looked.
4. **Which layer drops the advisor redirect** (CLI handler vs the shim's `recommend_with_native_advisor()`) — carried unchanged since iteration 1; `handlers/advisor-recommend.ts` against `lib/compat/` is the pass that closes it.
5. **Advisor follow-ups from generation 1** — the sk-doc `sk-create-skill-parent` shared-packet entry and the duplicate `package_skill.py`. Untouched for the tenth iteration and now the oldest open item.
6. **`hook-flags.sh` vs `hook-flags.cjs` one-shot differential** — cheap, still unrun, and f-iter010-003's step table depends on the resolver being the single truth.
7. Carried, all still open: the hook git-call time limit; which of the non-shared adapters import the flag module; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction.

## Next Focus

Two items, in this order:

1. Apply f-iter010-001's two-line fix in a separate implementation step and confirm all three suites go green with `AI_SESSION_CHILD=1`. It is the only finding in this run that is a code-level defect *and* a one-line repair, and it currently masks 55 test cases across two suites.
2. Then close the transport question properly — start the advisor daemon twice concurrently and once with it down, and record the lease behaviour. Eight iterations of carrying it is no longer a gap in coverage; it is a gap in the run.

## SCOPE VIOLATIONS

None. Every write landed under the iteration's own lineage directory; the target surfaces were read only. The f-iter010-001 fix is described, not applied, per the no-implementation constraint.
