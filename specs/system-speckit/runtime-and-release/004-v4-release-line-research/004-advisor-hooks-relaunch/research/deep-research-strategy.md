---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Audit the Skilled v4 release line (v4.0.0.0 to v4.0.2.0) for the advisor, hooks and relaunch cluster: .skilled/skills/system-skill-advisor/**, compiled routing (each skill's hub-router.json, ROUTER.md, mode-registry.json), .skilled/hooks/** with the runtime adapters in .claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks, .opencode/plugins, .pi/extensions and .dsh/plugins, session relaunch, history after compaction and question-tool decision capture. Find seven types: drift (release note vs code vs docs), misalignment with sk-code, sk-doc or Skilled canon, bugs (each with a repro command or failing check), improvement, operator and AI-user UX, over-engineering (name what breaks if removed), extension. Each finding states type, severity P0/P1/P2, a [SOURCE: path:line] you opened this iteration, the release that introduced it, confidence and a verify command. Release notes: .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0 3fed08373e, .1 bcb775402e, .2 7980001709, .3 c9bd4b156c, .4-.10 4d8f403355, .11 e2b2e393fa, .12 7fecd5f219, .13 42b41dd286, .14 bb9b9d1c09, .15 22c3a9b2c7, .16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317; always path-limit git diff. Read-only outside your research folder.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Advisor transport (v4.0.0.0, v4.0.0.16): is the MCP transport fully gone, and do degraded local scoring and the shared daemon behave as documented in system-skill-advisor/SKILL.md and ARCHITECTURE.md?
- [x] Advisor parity (v4.0.0.7): is the Python vs Node advisor parity check still wired into CI, and do the two advisors disagree on any prompt today?
- [x] Advisor prompt hook (v4.0.0.1, v4.0.0.2, v4.0.2.0): does every runtime adapter (.claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks, .opencode/plugins, .pi/extensions, .dsh/plugins) deliver the advisor brief from the single source in .skilled/hooks/skill-advisor, within its time limit?
- [x] Hermes removal (v4.0.2.0): which hook, plugin, advisor or routing files still reference Hermes, .hermes/ or a hermes runtime flag?
- [x] Session relaunch (v4.0.0.13, v4.0.0.14): do .skilled/hooks/session-relaunch and its runtime adapters implement the per-runtime SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED flags, the 80 percent trigger and the model, effort and goal carry-over as the notes claim?
- [x] History after compaction (v4.0.2.0): does the session history lookup (.opencode/plugins/session-history-lookup.js and its counterparts) stay read-only and work on each runtime the note names?
- [x] Question-tool capture (v4.0.2.0): do .skilled/hooks/ask-surface-guard and .skilled/hooks/decision-capture detect typed option menus as the fixtures claim, and where do they false-positive or false-negative?
- [x] Hook safety (v4.0.0.8, v4.0.0.16): do all hook entry points honor the three-second stdin deadline and the git-call time limit?
- [x] Over-engineering: which per-runtime hook copies, mirrors and generated artifacts could collapse into one source, and what would break if each were removed?
- [ ] UX and extension: what blocks the operator or AI user when enabling relaunch, reading the advisor brief or recovering history, and which concrete extensions would remove those blocks?
- [ ] Advisor follow-ups from generation 1: does the sk-doc mode-registry shared-packet entry (sk-create-skill-parent) and the duplicate package_skill.py cause any routing or package-check defect when the advisor routes a /create:skill-parent request?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Fixing anything: findings only, no edits outside the research folder.
- Clusters owned by sibling phases (spec kit core, authoring hubs, the other cluster of this pair, doctor/git/CI/runtime mirrors).
- Releases before v4.0.0.0 and commits after the v4.0.2.0 tag, except as context.

---

## 5. STOP CONDITIONS
- Forced depth: stopPolicy is max-iterations, so the run continues to maxIterations regardless of convergence telemetry.
- The orchestrator may extend the ceiling by +5 when the depth checkpoint is not cleared.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Advisor parity (v4.0.0.7): is the Python vs Node advisor parity check still wired into CI, and do the two advisors disagree on any prompt today?
- Advisor prompt hook (v4.0.0.1, v4.0.0.2, v4.0.2.0): does every runtime adapter (.claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks, .opencode/plugins, .pi/extensions, .dsh/plugins) deliver the advisor brief from the single source in .skilled/hooks/skill-advisor, within its time limit?
- Hermes removal (v4.0.2.0): which hook, plugin, advisor or routing files still reference Hermes, .hermes/ or a hermes runtime flag?
- Session relaunch (v4.0.0.13, v4.0.0.14): do .skilled/hooks/session-relaunch and its runtime adapters implement the per-runtime SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED flags, the 80 percent trigger and the model, effort and goal carry-over as the notes claim?
- History after compaction (v4.0.2.0): does the session history lookup (.opencode/plugins/session-history-lookup.js and its counterparts) stay read-only and work on each runtime the note names?
- Question-tool capture (v4.0.2.0): do .skilled/hooks/ask-surface-guard and .skilled/hooks/decision-capture detect typed option menus as the fixtures claim, and where do they false-positive or false-negative?
- Hook safety (v4.0.0.8, v4.0.0.16): do all hook entry points honor the three-second stdin deadline and the git-call time limit?
- Over-engineering: which per-runtime hook copies, mirrors and generated artifacts could collapse into one source, and what would break if each were removed?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Whether the top-ranked recommendation carrying a *lower* score than the runner-up (sk-doc 0.347 above system-spec-kit 0.579 under `--trusted`) is intended precedence or a sort defect. Recorded as an observation, not a finding, because I cannot establish intent from output order alone. (iteration 1)
- **Advisor transport (v4.0.0.0, v4.0.0.16)** stays open on its second half. MCP removal is confirmed. The degraded-mode and shared-daemon behavior is *not*: I read the launcher's lease and lock-dir surface but never exercised the daemon-down path or the two-simultaneous-launchers race, so "behaves as documented" is untested rather than confirmed. (iteration 1)
- Which layer drops the redirect: is it the CLI handler's post-scoring step, the shim's `recommend_with_native_advisor()` options, or the trust default of f-iter001-003? A root-cause pass on `handlers/advisor-recommend.ts` against `lib/compat/` would close f-iter001-001. (iteration 1)
- New: does `SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS` behave as the *undocumented* control implies on a real OpenCode timeout — does any stale brief survive, or does the turn always lose the brief? (iteration 2)
- Which layer drops the redirect between the CLI handler and the shim's `recommend_with_native_advisor()` (carried from iteration 1). (iteration 2)
- Hook safety (v4.0.0.8, v4.0.0.16): the three-second stdin deadline and the git-call time limit across every hook entry point. (iteration 2)
- Advisor transport (v4.0.0.0, v4.0.0.16): the shared daemon's degraded path and the two-launcher race are still unexercised (carried from iteration 1). (iteration 2)
- New: is dsh's `message.source?.kind === 'user'` provenance shape stable in current dsh, or does the adapter silently skip prompts when the shape changes? The test fixture proves only the fixture. (iteration 2)
- New: measure the Codex hook wall time on a cold daemon to decide whether f-iter002-003 stays P2. (iteration 2)
- Does OpenCode, Cursor or Devin expose an effort flag at launch at all? That single fact decides (iteration 3)
- Which layer supplies `SKILLED_LOOP_RUNTIME` for a session started before the shell line — is (iteration 3)
- Does the killer treat a `runtime: 'claude'` record written by a Pi sender differently from a (iteration 3)
- Carried: hook safety (three-second stdin deadline, git-call time limit) is still unexamined. (iteration 3)
- Question-tool capture (`ask-surface-guard`, `decision-capture`) is entirely unexamined. (iteration 4)
- Still untouched from earlier iterations: the three-second stdin deadline and the git-call time limit (iteration 4)
- f-iter004-005 needs one live Codex compaction to close. (iteration 4)
- Still open: which layer drops the advisor redirect (CLI handler vs the shim), and whether (iteration 4)
- Hermes removal (v4.0.2.0): untouched. (iteration 5)
- Advisor follow-ups from generation 1: not reached. (iteration 5)
- Carried: which layer drops the advisor redirect (CLI handler vs shim). (iteration 5)
- New: does `hook-flags.env` (live) actually carry `SYSTEM_ASK_SURFACE_DISABLED`, or only `hook-flags.env.example` [SOURCE: .skilled/hooks/hook-flags.env.example:26]? Killed-switch reachability is unverified. (iteration 5)
- Hook safety (v4.0.0.8, v4.0.0.16): the three-second stdin deadline and git-call time limit are still unexamined — note the Claude ask-surface adapter reads stdin with a plain blocking `readFileSync(0)` and no deadline. (iteration 5)
- New: where do the `node:test` hook suites run in CI, if anywhere? (iteration 5)
- Over-engineering: six runtime copies of one detector call; four different send-back mechanisms. (iteration 5)
- Advisor transport (v4.0.0.0, v4.0.0.16): degraded local scoring + shared daemon still unexercised (carried, 3 iterations). (iteration 5)
- UX and extension: not reached. (iteration 5)
- New: does `hook-flags.env` (live) carry `SYSTEM_ASK_SURFACE_DISABLED`, or only the `.example`? A disabled ask-surface switch would make f-iter006-001 unreachable in practice — unverified either way, and it decides f-iter006-001's real severity. (iteration 6)
- Advisor transport (v4.0.0.0, v4.0.0.16): degraded local scoring and the shared daemon are still unexercised — carried four iterations now, and this iteration did not touch them. (iteration 6)
- New: where the `node:test` hook suites actually run in CI, if anywhere. f-iter006-004's redundant suites only cost something if one of them is executed; if neither runs, the cost is larger and different. (iteration 6)
- UX and extension: never reached. (iteration 6)
- New: does the doctor actually read `agents-md-manifest.json` verbatim into `AGENTS.md`, or transform it? That is the gap between f-iter006-002's "string exists" and "vendored repos get Hermes text". (iteration 6)
- Which layer drops the advisor redirect, CLI handler or the shim's `recommend_with_native_advisor()` — carried unchanged. (iteration 6)
- Advisor follow-ups from generation 1: the sk-doc `sk-create-skill-parent` shared-packet entry and duplicate `package_skill.py` — never reached. (iteration 6)
- **Which layer drops the advisor redirect** (CLI handler vs the shim's `recommend_with_native_advisor()`) — carried unchanged. (iteration 7)
- **Hook safety (v4.0.0.8, v4.0.0.16)** — the *git-call* time limit half is still unexamined; the stdin half is now measured and has one gap. (iteration 7)
- **New:** does `hook-flags.sh`'s 113-line table actually disagree with `hook-flags.cjs` today? A one-shot differential (resolve every flag through both, diff) would turn f-iter007-004's drift *risk* into a yes/no, and is cheap. (iteration 7)
- **Advisor follow-ups from generation 1** — the sk-doc `sk-create-skill-parent` shared-packet entry and duplicate `package_skill.py`. Touched only tangentially via `create-skill-parent-auto.yaml:240`; not assessed. (iteration 7)
- **UX and extension** — never reached, seventh iteration running. (iteration 7)
- **New:** which of the 132 non-shared adapters import the flag module vs hand-roll their own env reads? That is the pre-condition for sizing f-iter007-002's cut. (iteration 7)
- **f-iter007-003** needs one live Claude turn-end hang, or the `timeout` repro run, to settle P1-vs-P2. (iteration 7)
- **New:** is `leaf-scopes.json` optional for a single-mode skill (f-iter007-006)? One generator run settles it. (iteration 7)
- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared daemon lease/race are still unexercised. Carried **five** iterations now. This is the largest untested claim in the run. (iteration 7)
- **UX and extension** proper — the relaunch-enable, brief-reading and history-recovery blocks. Only reached sideways. (iteration 8)
- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared daemon lease/race remain unexercised. **Six** iterations carried. Still the largest untested claim in the run. (iteration 8)
- Carried: which of the 132 non-shared adapters import the flag module vs hand-roll env reads; `leaf-scopes.json` optionality; `f-iter007-003` live Claude hang; `f-iter004-005` live Codex compaction. (iteration 8)
- **New:** why does the hook brief for this same phrase render `/doctor:env list` at `0.82/0.28` against `sk-code 0.95/0.16`, while a direct CLI call scores `/doctor:env` `0.8962/0.16` against `system-spec-kit 0.8794/0.12`? Recorded as an observation only: the hook scores the whole iteration prompt, not the phrase, so the divergence is confounded and proves nothing yet. (iteration 8)
- **Advisor follow-ups from generation 1** — the sk-doc `sk-create-skill-parent` shared-packet entry and the duplicate `package_skill.py`. Untouched, eighth iteration. (iteration 8)
- **New:** does `hook-flags.sh`'s 113-line table drift from `hook-flags.cjs` today (one-shot differential)? (iteration 8)
- **New:** what are `STRONG_PROBLEM_CUE` / `WEAK_PROBLEM_CUE` word lists, and does `matchDoctorProblem` on the hooks prompt clear `DOCTOR_HELPER_UNCUED_MIN_SCORE`? That single read converts f-iter008-001 from "inferred clause" to a located line, and would show whether the fix is the cue list or the `skillPasses` guard. (iteration 8)
- **Hook safety (v4.0.0.8, v4.0.0.16)** — the git-call time-limit half is still unexamined. (iteration 8)
- **Advisor follow-ups from generation 1** — the sk-doc `sk-create-skill-parent` shared-packet entry and the duplicate `package_skill.py`. Untouched, ninth iteration; now the oldest open item after the transport question. (iteration 9)
- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared daemon lease/race remain unexercised. Carried **seven** iterations. Still the largest untested claim in the run. (iteration 9)
- **Does the "OpenCode Plugin Tests" CI job actually gate this suite?** A red suite at HEAD is only possible if the job is skipped for these paths or not required. That decides whether f-iter009-001 is a code bug or a governance bug. (iteration 9)
- Carried: the hook git-call time limit; whether `hook-flags.sh`'s table drifts from `hook-flags.cjs`; which of the 132 non-shared adapters import the flag module; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction. (iteration 9)
- **UX and extension** proper: with f-iter009-001 understood, the remaining blocks are reading the advisor brief and recovering history, neither of which this iteration reached. (iteration 9)
- **Is the 27-failure red state a regression or a resolution failure?** The discriminator: run `session-relaunch.test.cjs` once with the plugin loading its compiled core from `.skilled/.../dist` and once with the source core. If the nudge appears only in one, the fault is the adapter-root resolution, not the nudge logic. (iteration 9)
- **`hook-flags.sh` vs `hook-flags.cjs` one-shot differential** — cheap, still unrun, and f-iter010-003's step table depends on the resolver being the single truth. (iteration 10)
- **History recovery as an operator path** — untouched. The concrete question: after compaction, which command returns the pre-compaction turn, and does `session-history-lookup` have an operator entry point at all, or only a plugin callback? (iteration 10)
- **The shared daemon and degraded scoring (v4.0.0.0/.16)** — still unexercised, now across **eight** iterations and the run's largest untested claim. Everything in the transport question except "MCP is gone" is inference from reading. (iteration 10)
- **Advisor follow-ups from generation 1** — the sk-doc `sk-create-skill-parent` shared-packet entry and the duplicate `package_skill.py`. Untouched for the tenth iteration and now the oldest open item. (iteration 10)
- **The advisor brief reader path** — open `.skilled/skills/system-skill-advisor/SKILL.md` and `hooks/skill-advisor-hook.md` and decide whether f-iter010-004 is a real doc gap or an artifact of where I looked. (iteration 10)
- Carried, all still open: the hook git-call time limit; which of the non-shared adapters import the flag module; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction. (iteration 10)
- **Which layer drops the advisor redirect** (CLI handler vs the shim's `recommend_with_native_advisor()`) — carried unchanged since iteration 1; `handlers/advisor-recommend.ts` against `lib/compat/` is the pass that closes it. (iteration 10)
- **Was `passes_threshold` true in that run?** Cheapest closure: temporarily surface it, or run the fusion function in a vitest harness with the same prompt. This is now the single fact that decides whether f-iter011-001 is a bug or a documented predicate doing something surprising. (iteration 11)
- **Generation-1 advisor follow-ups** — the sk-doc `sk-create-skill-parent` shared-packet entry and the duplicate `package_skill.py`. Eleventh iteration untouched. (iteration 11)
- Carried, unchanged: advisor transport degraded path and the shared-daemon lease/race (**nine** iterations now); the hook git-call time limit; which non-shared adapters import the flag module; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction; `hook-flags.sh` vs `hook-flags.cjs` differential; history recovery as an operator path; the advisor brief reader path. (iteration 11)
- **v4.0.0.10 hook claims** — untrusted repositories resolving helpers under `/dev/null`, and the Commit-Id allocator fallback. Both are security-shaped and unopened; the `/dev/null` claim in particular deserves a read against the hook helper resolver. (iteration 11)
- **v4.0.0.5 pre-commit phrase check** — fail-open when node, the linter, its YAML library or git is missing. A gate that silently passes on a missing dependency is worth one read. (iteration 11)
- **Which process answered?** The response reports `trustState.generation` and `freshness: live`, but no build path. Locate the build root, then re-run the f-iter011-001 probe against the built artifact and against `tsx`-style direct source execution — the differential names the layer and closes f-iter011-001's mechanism half. (iteration 11)
- **v4.0.0.11 `/doctor:git setup`** — eleven checks, seven tools, and the claim that a hook counts only when the script it runs exists. (iteration 11)
- Carried unchanged: the degraded daemon path; the duplicate `package_skill.py`; `hook-flags.sh` vs (iteration 12)
- **Does the bounded-git claim hold for `pre-push`?** Only four `git_bounded` calls there, with plain (iteration 12)
- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared-daemon (iteration 12)
- **Does the phrase linter's git-unavailable path exit non-zero?** One sandboxed run closes (iteration 12)
- **UX and extension** — relaunch enable, brief reading, history recovery. Never reached; twelfth (iteration 12)
- **Does any CI gate run `agents-md-manifest.cjs --check`?** It exits 1 at HEAD. A red consistency check that nobody runs is a governance gap, not a code gap, and that discriminates f-iter013-001's true severity. (iteration 13)
- **UX and extension proper** — reading the advisor brief and recovering history after compaction. f-iter013-004 now covers the relaunch/ask-surface *enablement* surface only; the other two blocks are untouched, thirteenth iteration. (iteration 13)
- Carried unchanged: the hook git-call time limit; `hook-flags.sh` vs `hook-flags.cjs` differential; which non-shared adapters import the flag module; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction; which layer drops the advisor redirect. (iteration 13)
- **Advisor transport (v4.0.0.0, v4.0.0.16)** — the respawn half is now verified. Degraded local scoring and the shared-daemon lease/race remain unexercised, **eight** iterations carried. Still the largest untested claim in the run. (iteration 13)
- **New:** `v4.0.0.9`'s routing claim (mode aliases lowercase and listed among router keywords) — one generator or doctor run settles it. (iteration 13)
- **Advisor follow-ups from generation 1** — the sk-doc `sk-create-skill-parent` shared-packet entry and duplicate `package_skill.py`. Untouched, thirteenth iteration. (iteration 13)
- Carried unchanged: which layer drops the advisor redirect (CLI handler vs shim); the hook git-call time limit; which non-shared adapters import the flag module; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction. (iteration 14)
- Where does "a recommendation that rotates mid-session" actually rotate? Not in `prompt-advisor.ts`. (iteration 14)
- **Advisor follow-ups from generation 1** — sk-doc's `sk-create-skill-parent` shared-packet entry and the duplicate `package_skill.py`. Untouched, fourteenth iteration; oldest open item. (iteration 14)
- **`hook-flags.sh` vs `hook-flags.cjs` one-shot differential** — still unrun. (iteration 14)
- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared-daemon lease/race remain unexercised. **Nine** iterations carried; still the largest untested claim in the run. (iteration 14)
- Does `SPECKIT_PI_DIRECTIVE_DEDUP` appear in `hook-flags.env` / `hook-flags.env.example`, and does any doc describe the suppression? Unchecked. (iteration 14)
- **UX and extension proper** — enabling relaunch, reading the advisor brief, recovering history. Only ever (iteration 15)
- **History recovery as an operator path** — after compaction, which command returns the pre-compaction turn, (iteration 15)
- **The two front doors on one prompt** — the Python half still needs one run, now without `timeout`. (iteration 15)
- **New:** should the state-log projection carry `focus` and `answeredQuestions`, or is the delta file the (iteration 15)
- **Which layer drops the advisor redirect** (CLI handler vs the shim's `recommend_with_native_advisor()`) — (iteration 15)
- **New — is the rank-1 anomaly a defect or an exposed-lane precedence rule?** One read of the fusion/ordering (iteration 15)
- **New:** what is the stated basis for the "181 adapters" figure? Two passes have now measured two different (iteration 15)
- **Live confirmations still owed:** the Claude turn-end hang, one Codex compaction, `leaf-scopes.json` (iteration 15)
- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared-daemon lease/race are (iteration 15)
- **Advisor follow-ups from generation 1** — sk-doc's `sk-create-skill-parent` shared-packet entry and the (iteration 15)
- **Does the steered dsh message carry `source.kind: 'repo-guards'` into `readTurn`?** If it does, a one-line provenance filter is the whole fix. (iteration 17)
- **UX and extension proper** — enabling relaunch, reading the advisor brief, recovering history. Fifteenth iteration unreached. (iteration 17)
- **Advisor follow-ups from generation 1** — sk-doc's `sk-create-skill-parent` shared-packet entry and the duplicate `package_skill.py`. Fifteenth iteration untouched, and now adjacent to f-iter017-005's generator finding. (iteration 17)
- **Shared daemon lease and two-launcher race** — the surviving half of question 63, ten iterations carried, now the run's largest untested claim. (iteration 17)
- **Is the dsh steer loop real?** f-iter017-003 needs the two-turn harness described above to move from inferred to measured. (iteration 17)
- **UX and extension proper** — enabling relaunch, reading the advisor brief, recovering history — still unreached after fifteen iterations. This iteration produced an extension and a UX finding, but in the hook-telemetry cluster, and they should not be counted against that question. (iteration 18)
- Carried and untouched: the advisor degraded-daemon path and the two-launcher race (now the run's oldest unexercised claim); which layer drops the advisor redirect; `hook-flags.sh` vs `hook-flags.cjs` differential; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction; the generation-1 advisor follow-ups (`sk-create-skill-parent` shared-packet entry, duplicate `package_skill.py`). (iteration 18)
- **Does anything read the canonical log and act on its absence?** f-iter018-001's severity rests on it. A read of `completion-sentinel` and any receipt/liveness check that tails `.skilled/logs/cli-dispatch-audit.log` would settle P1-vs-P2, and this iteration did not check. (iteration 18)
- **The two anchors that are already right are the answer to the fix.** `.skilled/hooks/goal/lib/goal-core.cjs:175` (`resolveRepoRoot`) and `:193` (`join(repoRoot, STATE_SUBDIR)`) anchor the goal state; `.skilled/hooks/goal/lib/goal-slice.cjs:253` walks upward testing for `.git` or `.skilled/skills`. Decision-capture anchors through git itself, with environment scrubbing and a fallback: `.skilled/hooks/decision-capture/lib/capture-core.mjs:242` through `:268`. Three concerns in this cluster solved the same problem three ways and only the dispatch adapters skipped it. Whether the goal and decision-capture implementations agree on a non-git directory is unread. (iteration 18)
- **Do the Codex and Devin payloads actually drift the way Claude's does?** The Claude drift is evidenced by a file on disk; for the other two it is inferred from identical source shape. A Cursor adapter, by contrast, uses `payload?.workspace_roots?.[0]` (`.skilled/hooks/dispatch/cursor/dispatch-preflight-lint.mjs:70`) and is likely immune — worth one read to confirm which adapters share the class. (iteration 18)
- **Are the two `findRepoRoot` bodies identical?** f-iter018-005 depends on it. (iteration 18)
- **New:** does sk-create-goal's goal.md template put its authoring instructions in HTML comments (iteration 19)
- **New:** does dsh register its goal plugin through a manifest rather than `.dsh/plugins`? One (iteration 19)
- **New:** is the absence of a Claude/Codex goal adapter deliberate (the native goal tools named in (iteration 19)
- **New:** should `budgetState` gain a fourth state separating "no manifest" from "phase child, no (iteration 19)
- Carried and untouched: the advisor degraded-daemon path and the two-launcher race (now the (iteration 19)
- **UX and extension proper** — enabling relaunch, reading the advisor brief, recovering history after compaction. Sixteenth iteration unreached as a whole; this iteration produced UX findings only inside the hook cluster (f-iter021-003) and they should not be counted against it. (iteration 21)
- **New — which install routes reproduce `.dsh/patches/guards.patch.yml`?** This decides whether f-iter021-003 is a silent-loss bug or a non-issue for every supported install. `.dsh/README.md` and `.dsh/SYNC.md` are the two documents to read. (iteration 21)
- **New — does the decision-capture queue ever get consumed for a session whose reader runs from a different checkout?** `projectToken` hashes the canonical root path, so a second clone of the same repository gets a different token and cannot see the first clone's queue. Whether a worktree counts as the same project is the untested case. (iteration 21)
- **New — is `ask-surface-guard/`'s missing concern README the same gap as f-iter021-001, or deliberate?** The two README-less concerns are exactly the two whose coverage tables live in the registry README. One read of either folder's docs plan settles whether the omission was a decision. (iteration 21)
- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared-daemon lease/two-launcher race remain unexercised. Now carried across **eleven** iterations of the run and still the largest untested claim in it. (iteration 21)
- Carried unchanged: which layer drops the advisor redirect (CLI handler vs `recommend_with_native_advisor()`); the generation-1 advisor follow-ups (`sk-create-skill-parent` shared-packet entry, duplicate `package_skill.py`); the hook git-call time limit; `hook-flags.sh` vs `hook-flags.cjs` differential; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction. (iteration 21)
- **UX and extension proper** — enabling relaunch, reading the advisor brief, recovering history after compaction. Seventeenth iteration unreached as a whole. f-iter022-003 is adjacent (the relaunch README an operator reads first is broken) but was found by a convention sweep, not by the UX question, and should not be counted against it. (iteration 22)
- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared-daemon lease/two-launcher race remain unexercised. Now carried across twelve iterations and still the largest untested claim in the run. Everything except "MCP is gone" is inference from reading. (iteration 22)
- **New — was the scratch spike tree deleted deliberately, or did the track rename orphan it?** f-iter022-003's remediation differs: restore five files versus rewrite five table rows. `git log --diff-filter=D -- 'specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/*/scratch/spike/*'` settles it, path-limited as the run config requires. (iteration 22)
- **New — which is the canon, `MODULE` or `COMPONENT`?** f-iter022-004 records the split but not the decision. `sk-code`'s module-header reference is the arbiter; if it says `MODULE`, the 4 files are the defect, and if it says nothing, the finding is the missing rule rather than the 4 files. (iteration 22)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
**New — which is the canon, `MODULE` or `COMPONENT`?** f-iter022-004 records the split but not the decision. `sk-code`'s module-header reference is the arbiter; if it says `MODULE`, the 4 files are the defect, and if it says nothing, the finding is the missing rule rather than the 4 files.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work: the ripgrep recipe over specs/ and .skilled/ found no prior packet for this exact topic.

Release map (tag to commit; diff between consecutive commits, always path-limited):
v4.0.0.0-beta.1 -> v4.0.0.0 3fed08373e -> v4.0.0.1 bcb775402e -> v4.0.0.2 7980001709 -> v4.0.0.3 c9bd4b156c -> v4.0.0.4..v4.0.0.10 all 4d8f403355 (tagged together: use each note and `git log --since/--until` by date or subject, not tag diffs) -> v4.0.0.11 e2b2e393fa -> v4.0.0.12 7fecd5f219 -> v4.0.0.13 42b41dd286 -> v4.0.0.14 bb9b9d1c09 -> v4.0.0.15 22c3a9b2c7 -> v4.0.0.16 f459b06479 -> v4.0.1.0 6a93a2cfeb -> v4.0.2.0 51f70a0317.
Release notes: .skilled/changelog/skilled/v4.0.<x>.md (19 files).

Evidence bar set by the orchestrator: every finding names its type (drift, misalignment, bug, improvement, UX, over-engineering, extension), severity P0/P1/P2, a [SOURCE: path:line] opened in this iteration, the release that introduced it, a confidence and a verify command. A bug needs a repro command or a failing check. Restating a release note is not a finding. The orchestrator opens at least two citations per iteration.

Cluster diff size per release (files changed, path-limited to system-skill-advisor and the hook/plugin dirs): beta.1->.0 864; .0->.1 60; .1->.2 127; .2->.3 272; .3->.4-10 269; ->.11 75; ->.12 11; ->.13 213; ->.14 125; ->.15 76; ->.16 87; ->4.0.1.0 214; ->4.0.2.0 381.

Hook sources live in .skilled/hooks/<name>/ (ask-surface-guard, decision-capture, session-relaunch, skill-advisor, goal, git-*, spec-gate and more) with runtime adapters under .claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks, .opencode/plugins (session-history-lookup.js, session-relaunch.js, decision-capture.js), .pi/extensions and .dsh/plugins.

Generation 1 (archived under research_archive/, executor cli-devin deepseek-v4-1-flash-max) completed two iterations before Devin's daily quota ran out. Its findings, verified by the orchestrator, are settled; do not redo them:
- Router files (v4.0.1.0): 55 SKILL.md and 57 ROUTER.md; the two extra routers are sk-doc test fixtures (scripts/tests/skill-router*/ROUTER.md). sk-doc mode-registry.json:53 declares workflowMode sk-create-skill-parent with no folder (packet sk-create-skill). sk-doc/scripts/package_skill.py and sk-doc/sk-create-skill/scripts/package_skill.py are byte-identical.
- Advisor scoring: ambiguity.ts:42-46 applies the confidence-floor exception only when the top is not floored, so a floored top ties with every floored skill; fusion.ts:675 read-only regex matches "do not change|edit|modify|touch" but not "do not write"; the workflow-first rank override for "use cli-pi for deep research" is not labelled in the output; "review .skilled/skills/sk-doc/SKILL.md" routes to sk-code with sk-doc deferred.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only under stopPolicy max-iterations)
- Per-iteration budget: 24 tool calls, 40 minutes (executor timeout 2400s)
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 2
- Started: 2026-11-08T20:14:40.000Z

- resource-map.md not present; skipping coverage gate
