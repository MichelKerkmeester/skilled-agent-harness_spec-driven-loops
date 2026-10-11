---
title: "Deep Research Strategy: fresh-clone onboarding"
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

# Deep Research Strategy - fresh-clone onboarding

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
Walking a fresh clone of this framework from install to the first routed request and the first spec packet, as an external repo user: what are all the stumbles, ranked by user impact? For each known stumble (advisor runtime Node 20.19 vs spec-kit CLI Node 22.12 floor mismatch; sk-vision tests failing until vision-runtime/dist is built; the compiled-routing rebuild depending on an authored source under specs/sk-doc/z_archive referenced by .skilled/bin/lib/compiled-route-layout.cjs; worktree provisioning; hook trust via skilled.trustRepoHooks) is it real today and what does it cost the user? What is the smallest set of fixes, ranked by user impact, each passed through .skilled/repo-rules/prevent-overengineering.md?

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1 What is the documented install path for an external user (README, PUBLIC-RELEASE.md, CONTRIBUTING.md, install guides), and what does each step require up to the first routed request and the first spec packet?
- [x] Q2 Is the Node floor mismatch real today: which engines/version floors do the advisor runtime and the spec-kit CLI declare, and what happens on a single Node version a newcomer is likely to have?
- [x] Q3 Are the sk-vision vision-runtime/dist build gap and the compiled-routing rebuild dependence on specs/sk-doc/z_archive (.skilled/bin/lib/compiled-route-layout.cjs) real today, and when does a newcomer hit them?
- [x] Q4 Are worktree provisioning and hook trust (skilled.trustRepoHooks) real stumbles on the first-packet path, and what does each cost the user (blocked, confused, or silent degradation)?
- [x] Q5 What further stumbles appear on the walk (unclear errors, missing prerequisites, tracked clutter, absent credentials, per-runtime setup), and what is the smallest ranked fix set, each passed through .skilled/repo-rules/prevent-overengineering.md?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Changing install docs, scripts or runtime code; fixes are a later phase.
- Experience past the first spec packet, such as deep loops or skill authoring.
- Writes anywhere outside the packet folder.

---

## 5. STOP CONDITIONS
- stopPolicy is max-iterations: run all 10 iterations; convergence is telemetry only.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1 What is the documented install path for an external user (README, PUBLIC-RELEASE.md, CONTRIBUTING.md, install guides), and what does each step require up to the first routed request and the first spec packet?
- Q2 Is the Node floor mismatch real today: which engines/version floors do the advisor runtime and the spec-kit CLI declare, and what happens on a single Node version a newcomer is likely to have?
- Q3 Are the sk-vision vision-runtime/dist build gap and the compiled-routing rebuild dependence on specs/sk-doc/z_archive (.skilled/bin/lib/compiled-route-layout.cjs) real today, and when does a newcomer hit them?
- Q4 Are worktree provisioning and hook trust (skilled.trustRepoHooks) real stumbles on the first-packet path, and what does each cost the user (blocked, confused, or silent degradation)?
- Q5 What further stumbles appear on the walk (unclear errors, missing prerequisites, tracked clutter, absent credentials, per-runtime setup), and what is the smallest ranked fix set, each passed through .skilled/repo-rules/prevent-overengineering.md?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- doc-first mapping followed by cheap clone probes. The probes falsified two assumptions in one pass -- the Verify step needs no installs (7/7 configs pre-wired and matched) and the advisor `dist` is genuinely absent -- while the package manifests pinned the hidden step-2 -> step-3 dependency that the prose hides. (iteration 1)
- staging the probes in README order made every claim falsifiable in one bake-off -- the bare-clone launcher probe decisively killed README:162 before any install could mask it, and the 22/26 and fake-HOME probes generalized the floor matrix beyond this machine's node_modules (proving the Code Mode block is interpreter-resolution, not tree state). Reading dist-freshness first also predicted the shim's fail-not-build behavior and the validate.sh fallback, which the clone then confirmed. (iteration 2)
- chasing each hypothesis down its consumer chain. The sk-vision claim died at the import list while the real breakage surfaced at the tracked plugin symlink -- one probe separated the stated mechanism from the actual one. Likewise, reading the trust gate and the pre-commit consumers together showed the z_archive dependence ships in the clone, converting a hypothesized blocker into a named, unfixable-today fragility. (iteration 3)
- probing the actual first routed request instead of trusting the doc path - the two commands showed the failure mode is degradation, not refusal, which re-frames the risk; one bake-off call converted iteration 3's file-level sk-vision claim into observed behavior; and the whole-clone tracked-symlink census surfaced the machine-absolute links a targeted probe would have missed. (iteration 4)
- reading the session-start chain backward from each runtime's config surfaced the trust-independent self-heal, which converts iteration 1's "silent machine-wide hook install" from an unresolved risk into a mechanism-backed, bounded behavior the README already describes. Checking dist tracking with `git ls-files` rather than the probe clone's filesystem avoided the trap that the clone's `runtime/dist` exists only because earlier iterations built it. (iteration 5)
- following the remedy text rather than the finding. Reading each runtime's fallback string side by side made the inconsistency visible in one pass, and testing codex's named tool against its own header and function inventory falsified its remedy claim cheaply and decisively. Reading the pi adapter and extension as a pair separated "documented fail-open" from "silent fail-open" before it could be overclaimed. (iteration 6)
- reading the gate's *dependency chain* instead of its behavior. The checker looks self-contained; following its two `require` hops surfaced the untracked build artifact in one pass, and the `git ls-files` count separated "exists on this machine" from "exists in a fresh clone" — the same trap iteration 6 named, met again in a new place. Reading the CI workflow next to the hook made the local/CI asymmetry visible immediately and explained why nobody has seen the crash. Executing both gates in the clone closed the content question with exit codes instead of prose. (iteration 7)
- following the string to its *source* instead of its first sighting. Iteration 6 read the message where it renders and, reasonably, treated the fix surface as the file; one registry read plus one `--check` run collapsed "a file full of strings" into "one registry entry plus a gate-enforced regen". Running the synchronizer in the clone with the exit code bound to the command (`out=$(...); rc=$?`) converted "the registry is canonical" from a doc claim into an observed PASS at the same HEAD. (iteration 8)
- consolidating from the registry instead of re-deriving from the walks. The registry already carried each finding with its evidence and each fix with its climbing sentence, so one full read plus one anchor re-verification read was enough to fold nine items — the iteration's cost went into ordering and decline logic, not evidence gathering. Reading the hook tail in the same pass turned F8 from "option (b)" into a concrete two-surface change with an in-file precedent (the hygiene branch's exit-2 convention). (iteration 9)
- reading the runtime's *own scope rule* instead of trusting the key's name. One doc line plus one dist read falsified a security implication that had survived nine iterations as an unprobed "shipped default" — the per-key scope table was the decisive artifact, not the settings file. Fetching the schema the tracked file itself declares turned the Claude semantics from assumption into the file's own contract, and that contract literally says "use only in isolated environments". (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- `.skilled/skills/system-spec-kit/runtime/cli/package.json` was not read, so the README "22.12+ for the spec-kit runtime CLI" floor is still unverified; it was one file and should have been batched with the other two manifests. (iteration 1)
- the first launcher exit-code read was corrupted by reading PIPESTATUS after an intervening echo (reported 0; command substitution shows the true exit 1) -- a reminder to bind an exit code to its command. Node 18 was absent, so one planned matrix cell stayed untested. (iteration 2)
- a repo-wide `grep -rln trustRepoHooks .` swallowed 322 seconds by scanning spec packets before I scoped to `.skilled`, and a follow-up call cost another 102 seconds. Recursive greps over this repository must be directory-scoped from the first call; the time went out of the research budget, not the evidence. (iteration 3)
- nothing failed this iteration; no retries were needed, and the earlier lesson about directory-scoped greps held. (iteration 4)
- nothing failed; the deliberate non-execution of the installer was a scope decision, not a failure, and is recorded under Ruled Out. (iteration 5)
- nothing failed; the deliberate non-execution of the build re-run was an economy decision recorded under Ruled Out, not a failure. (iteration 6)
- nothing failed. The crash reproduction was deliberately not executed (deletion ban) and is recorded as an inference hop; the `rg -rn` invocation accidentally replaced matches with the letter `n` (`-r` = replace), which garbled one output line and was corrected by re-reading the same region with a context flag — a reminder that flag collisions in `rg` are silent. (iteration 7)
- nothing failed. One near-miss: a stale fixture spec seen in grep output claims no generator exists, and it would have inverted the fix-surface conclusion had it been trusted over the live registry, the gate wiring, and the probe; the contradiction is recorded under Edge Cases rather than silently dropped. (iteration 8)
- nothing failed. One near-miss: iteration 7's (a) names the root build command, but the root script (`tsc --build`, read this iteration) is not evidence that project references fan out to `runtime/dist`; the set records the demonstrated runtime-workspace producer and defers the exact invocation rather than promoting an unverified command. (iteration 9)
- nothing failed. The live-session and dist-removal probes were deliberately declined (interactive or deletion-bound) and are recorded under Ruled Out rather than overclaimed. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "sk-vision tests fail until `vision-runtime/dist` is built": falsified at file level. Tests import `src` and spawn `python/runtime.py`; no test consumes `dist` [SOURCE: .skilled/skills/sk-vision/vision-runtime/python/runtime.test.ts:8-22]. The dist consumer is the plugin/CLI delivery surface, not the test suite. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "sk-vision tests fail until `vision-runtime/dist` is built": falsified at file level. Tests import `src` and spawn `python/runtime.py`; no test consumes `dist` [SOURCE: .skilled/skills/sk-vision/vision-runtime/python/runtime.test.ts:8-22]. The dist consumer is the plugin/CLI delivery surface, not the test suite.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "sk-vision tests fail until `vision-runtime/dist` is built": falsified at file level. Tests import `src` and spawn `python/runtime.py`; no test consumes `dist` [SOURCE: .skilled/skills/sk-vision/vision-runtime/python/runtime.test.ts:8-22]. The dist consumer is the plugin/CLI delivery surface, not the test suite.

### "The compiled-routing rebuild breaks a fresh clone because the authored source under `specs/sk-doc/z_archive` is absent": falsified. The path is tracked (6996 files) and present in the clone; sync, guard and the pre-commit gate all resolve it there. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The compiled-routing rebuild breaks a fresh clone because the authored source under `specs/sk-doc/z_archive` is absent": falsified. The path is tracked (6996 files) and present in the clone; sync, guard and the pre-commit gate all resolve it there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The compiled-routing rebuild breaks a fresh clone because the authored source under `specs/sk-doc/z_archive` is absent": falsified. The path is tracked (6996 files) and present in the clone; sync, guard and the pre-commit gate all resolve it there.

### **A fresh-HOME pi launch to observe the trust prompt end-to-end.** The trust decision is interactive, and a one-shot probe cannot bind it; pi's normative scope rule, the trust-resolution order and the dist read path settle the file-level question with primary sources (Finding 1). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A fresh-HOME pi launch to observe the trust prompt end-to-end.** The trust decision is interactive, and a one-shot probe cannot bind it; pi's normative scope rule, the trust-resolution order and the dist read path settle the file-level question with primary sources (Finding 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A fresh-HOME pi launch to observe the trust prompt end-to-end.** The trust decision is interactive, and a one-shot probe cannot bind it; pi's normative scope rule, the trust-resolution order and the dist read path settle the file-level question with primary sources (Finding 1).

### **A live Claude Code session to observe project-settings startup precedence.** No safe non-interactive probe exists; the fetched schema documents the shipped values' semantics, and the residual uncertainty is recorded in Finding 2 instead of being smoothed over. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A live Claude Code session to observe project-settings startup precedence.** No safe non-interactive probe exists; the fetched schema documents the shipped values' semantics, and the residual uncertainty is recorded in Finding 2 instead of being smoothed over.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A live Claude Code session to observe project-settings startup precedence.** No safe non-interactive probe exists; the fetched schema documents the shipped values' semantics, and the residual uncertainty is recorded in Finding 2 instead of being smoothed over.

### **Reproducing the Pi silence by removing `runtime/dist`.** Deletion is banned, and the probe clone's dist was produced by earlier iterations; the file-level chain plus the 0-tracked `git ls-files` count stand as the evidence. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Reproducing the Pi silence by removing `runtime/dist`.** Deletion is banned, and the probe clone's dist was produced by earlier iterations; the file-level chain plus the 0-tracked `git ls-files` count stand as the evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reproducing the Pi silence by removing `runtime/dist`.** Deletion is banned, and the probe clone's dist was produced by earlier iterations; the file-level chain plus the 0-tracked `git ls-files` count stand as the evidence.

### `docs/` tree: no `docs/` directory exists in worktree or clone; internal docs are the root markdown files plus the skill-local READMEs listed in README section 16. [SOURCE: README.md:1576-1592] [INFERENCE: find docs probe returned nothing, this iteration] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `docs/` tree: no `docs/` directory exists in worktree or clone; internal docs are the root markdown files plus the skill-local READMEs listed in README section 16. [SOURCE: README.md:1576-1592] [INFERENCE: find docs probe returned nothing, this iteration]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `docs/` tree: no `docs/` directory exists in worktree or clone; internal docs are the root markdown files plus the skill-local READMEs listed in README section 16. [SOURCE: README.md:1576-1592] [INFERENCE: find docs probe returned nothing, this iteration]

### Adding F6 to the implementation bundle: the "while we're here" restraint signal; no observed failure names it. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Adding F6 to the implementation bundle: the "while we're here" restraint signal; no observed failure names it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding F6 to the implementation bundle: the "while we're here" restraint signal; no observed failure names it.

### Editing the generated `.codex/hooks.json` directly to change the notice: pre-commit and CI run `sync-hook-registrations.cjs --check` [SOURCE: .skilled/scripts/git-hooks/pre-commit:272] [SOURCE: .github/workflows/spec-kit-check.yml:161], so an un-regenerated edit reports drift; the registry is the edit point. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Editing the generated `.codex/hooks.json` directly to change the notice: pre-commit and CI run `sync-hook-registrations.cjs --check` [SOURCE: .skilled/scripts/git-hooks/pre-commit:272] [SOURCE: .github/workflows/spec-kit-check.yml:161], so an un-regenerated edit reports drift; the registry is the edit point.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Editing the generated `.codex/hooks.json` directly to change the notice: pre-commit and CI run `sync-hook-registrations.cjs --check` [SOURCE: .skilled/scripts/git-hooks/pre-commit:272] [SOURCE: .github/workflows/spec-kit-check.yml:161], so an un-regenerated edit reports drift; the registry is the edit point.

### Executing `install-codex-hooks.mjs --check` in the clone to observe user-global behavior: the user-global `~/.codex/hooks.json` sits outside the clone sandbox; the tool's contract is documented and `--check` is non-mutating by design [SOURCE: .skilled/bin/README.md:168], so its semantics were read, not executed. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Executing `install-codex-hooks.mjs --check` in the clone to observe user-global behavior: the user-global `~/.codex/hooks.json` sits outside the clone sandbox; the tool's contract is documented and `--check` is non-mutating by design [SOURCE: .skilled/bin/README.md:168], so its semantics were read, not executed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Executing `install-codex-hooks.mjs --check` in the clone to observe user-global behavior: the user-global `~/.codex/hooks.json` sits outside the clone sandbox; the tool's contract is documented and `--check` is non-mutating by design [SOURCE: .skilled/bin/README.md:168], so its semantics were read, not executed.

### Executing the `check-git-hooks.sh` self-heal end-to-end inside the clone: running it invokes the installer whose effects beyond the clone's `.git/hooks` were not verified from the 1-55 read, so the mechanism and its trigger conditions were established from the script text instead of mutating machine state. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Executing the `check-git-hooks.sh` self-heal end-to-end inside the clone: running it invokes the installer whose effects beyond the clone's `.git/hooks` were not verified from the 1-55 read, so the mechanism and its trigger conditions were established from the script text instead of mutating machine state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Executing the `check-git-hooks.sh` self-heal end-to-end inside the clone: running it invokes the installer whose effects beyond the clone's `.git/hooks` were not verified from the 1-55 read, so the mechanism and its trigger conditions were established from the script text instead of mutating machine state.

### Executing the checker against a tree without the built parser (the decisive crash reproduction): it would require deleting the built file inside the clone, and deletions are banned in this run; the arc is grounded by the tracked-file count, the load-time require structure, and Node module semantics, with the last hop marked inference. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Executing the checker against a tree without the built parser (the decisive crash reproduction): it would require deleting the built file inside the clone, and deletions are banned in this run; the arc is grounded by the tracked-file count, the load-time require structure, and Node module semantics, with the last hop marked inference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Executing the checker against a tree without the built parser (the decisive crash reproduction): it would require deleting the built file inside the clone, and deletions are banned in this run; the arc is grounded by the tracked-file count, the load-time require structure, and Node module semantics, with the last hop marked inference.

### No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, and the `z_archive`-absence claim all stayed untouched. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, and the `z_archive`-absence claim all stayed untouched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, and the `z_archive`-absence claim all stayed untouched.

### No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, and the two superseded `bun test` roasts all stayed untouched. -- BLOCKED (iteration 6, 2 attempts)
- What was tried: No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, and the two superseded `bun test` roasts all stayed untouched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, and the two superseded `bun test` roasts all stayed untouched.

### No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, the `bun test` roasts, the generated `.codex/hooks.json` edit path and the F6-bundling direction all stayed untouched. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, the `bun test` roasts, the generated `.codex/hooks.json` edit path and the F6-bundling direction all stayed untouched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, the `bun test` roasts, the generated `.codex/hooks.json` edit path and the F6-bundling direction all stayed untouched.

### Node 18 runtime reproduction on this machine: no Node 18 interpreter in nvm (versions v20.19.5+ only); used the lowest available floor 20.19.5 instead. The CONTRIBUTING 18+ claim stays contradicted statically by the >=20.11 floors [SOURCE: .skilled/skills/system-spec-kit/package.json:11-13] and is not runtime-proven either way. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Node 18 runtime reproduction on this machine: no Node 18 interpreter in nvm (versions v20.19.5+ only); used the lowest available floor 20.19.5 instead. The CONTRIBUTING 18+ claim stays contradicted statically by the >=20.11 floors [SOURCE: .skilled/skills/system-spec-kit/package.json:11-13] and is not runtime-proven either way.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Node 18 runtime reproduction on this machine: no Node 18 interpreter in nvm (versions v20.19.5+ only); used the lowest available floor 20.19.5 instead. The CONTRIBUTING 18+ claim stays contradicted statically by the >=20.11 floors [SOURCE: .skilled/skills/system-spec-kit/package.json:11-13] and is not runtime-proven either way.

### None new this iteration. No exhausted-approach direction was retried: the docs-tree, PUBLIC-RELEASE and root-install directions stayed untouched. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: None new this iteration. No exhausted-approach direction was retried: the docs-tree, PUBLIC-RELEASE and root-install directions stayed untouched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new this iteration. No exhausted-approach direction was retried: the docs-tree, PUBLIC-RELEASE and root-install directions stayed untouched.

### None new. -- BLOCKED (iteration 10, 3 attempts)
- What was tried: None new.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new.

### None new. No exhausted-approach direction was retried: the docs-tree, PUBLIC-RELEASE, root-install and Node-18 directions stayed untouched. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None new. No exhausted-approach direction was retried: the docs-tree, PUBLIC-RELEASE, root-install and Node-18 directions stayed untouched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new. No exhausted-approach direction was retried: the docs-tree, PUBLIC-RELEASE, root-install and Node-18 directions stayed untouched.

### None new. Nothing found this iteration suggests a productive path for the falsified hypotheses. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: None new. Nothing found this iteration suggests a productive path for the falsified hypotheses.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new. Nothing found this iteration suggests a productive path for the falsified hypotheses.

### None new. The consolidated set resolves the carried fix-set recommendation; the remaining work is implementation-time anchor re-verification, not research. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: None new. The consolidated set resolves the carried fix-set recommendation; the remaining work is implementation-time anchor re-verification, not research.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new. The consolidated set resolves the carried fix-set recommendation; the remaining work is implementation-time anchor re-verification, not research.

### None new. The mirror-content direction is *not* a dead end but is now fully mapped: no content drift exists at HEAD, so no content fix is owed there. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: None new. The mirror-content direction is *not* a dead end but is now fully mapped: no content drift exists at HEAD, so no content fix is owed there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new. The mirror-content direction is *not* a dead end but is now fully mapped: no content drift exists at HEAD, so no content fix is owed there.

### None new. The registry-sourced generation pipeline is the live mechanism at HEAD, confirmed by both gates and by the clone probe; the direction is resolved rather than dead, and no content fix remains owed beyond the one string. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: None new. The registry-sourced generation pipeline is the live mechanism at HEAD, confirmed by both gates and by the clone probe; the direction is resolved rather than dead, and no content fix remains owed beyond the one string.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new. The registry-sourced generation pipeline is the live mechanism at HEAD, confirmed by both gates and by the clone probe; the direction is resolved rather than dead, and no content fix remains owed beyond the one string.

### Per-binding `message` overrides for the dist-only codex adapters: the mechanism exists [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:73] and is used five times [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:728], but all four runtimes use runtime-level defaults; adding per-adapter strings adds binding bookkeeping the requirement does not earn. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Per-binding `message` overrides for the dist-only codex adapters: the mechanism exists [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:73] and is used five times [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:728], but all four runtimes use runtime-level defaults; adding per-adapter strings adds binding bookkeeping the requirement does not earn.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Per-binding `message` overrides for the dist-only codex adapters: the mechanism exists [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:73] and is used five times [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:728], but all four runtimes use runtime-level defaults; adding per-adapter strings adds binding bookkeeping the requirement does not earn.

### PUBLIC-RELEASE.md as the external-user install path: it documents the maintainer release workflow and the symlink consumer model, both requiring ownership of a shared framework checkout. [SOURCE: PUBLIC-RELEASE.md:74-235] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: PUBLIC-RELEASE.md as the external-user install path: it documents the maintainer release workflow and the symlink consumer model, both requiring ownership of a shared framework checkout. [SOURCE: PUBLIC-RELEASE.md:74-235]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: PUBLIC-RELEASE.md as the external-user install path: it documents the maintainer release workflow and the symlink consumer model, both requiring ownership of a shared framework checkout. [SOURCE: PUBLIC-RELEASE.md:74-235]

### Re-probing the anchors beyond the fresh read: the read is the verification; a second pass is owed only at implementation start per iteration 8's (b). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Re-probing the anchors beyond the fresh read: the read is the verification; a second pass is owed only at implementation start per iteration 8's (b).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-probing the anchors beyond the fresh read: the read is the verification; a second pass is owed only at implementation start per iteration 8's (b).

### Re-running the spec-kit runtime workspace build end-to-end in the clone to re-prove the devin-named remedy command: the clone is not pristine (prior iterations installed its node_modules and produced its dist), so a re-run would not establish the claim that matters — that the documented step 2 is sufficient. The build script, the present `dist/hooks` tree and the two executed adapters already ground the remedy chain; the step-2 sufficiency statement stays an explicit inference. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Re-running the spec-kit runtime workspace build end-to-end in the clone to re-prove the devin-named remedy command: the clone is not pristine (prior iterations installed its node_modules and produced its dist), so a re-run would not establish the claim that matters — that the documented step 2 is sufficient. The build script, the present `dist/hooks` tree and the two executed adapters already ground the remedy chain; the step-2 sufficiency statement stays an explicit inference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the spec-kit runtime workspace build end-to-end in the clone to re-prove the devin-named remedy command: the clone is not pristine (prior iterations installed its node_modules and produced its dist), so a re-run would not establish the claim that matters — that the documented step 2 is sufficient. The build script, the present `dist/hooks` tree and the two executed adapters already ground the remedy chain; the step-2 sufficiency statement stays an explicit inference.

### Retrying any exhausted-approach direction: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, the `bun test` roasts, the `check-git-hooks.sh` execution, and the build re-run all stayed untouched. -- BLOCKED (iteration 8, 2 attempts)
- What was tried: Retrying any exhausted-approach direction: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, the `bun test` roasts, the `check-git-hooks.sh` execution, and the build re-run all stayed untouched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying any exhausted-approach direction: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, the `bun test` roasts, the `check-git-hooks.sh` execution, and the build re-run all stayed untouched.

### Retrying any exhausted-approach direction: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the z_archive-absence claim, the bun-test roasts, the check-git-hooks execution and the build re-run all stayed untouched. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Retrying any exhausted-approach direction: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the z_archive-absence claim, the bun-test roasts, the check-git-hooks execution and the build re-run all stayed untouched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying any exhausted-approach direction: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the z_archive-absence claim, the bun-test roasts, the check-git-hooks execution and the build re-run all stayed untouched.

### Rewording the claude/cursor defaults in the same pass: both name a correct rebuild direction [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:8] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:36]; no observed misdirection; keeps the pass off the "while we're here" path. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Rewording the claude/cursor defaults in the same pass: both name a correct rebuild direction [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:8] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:36]; no observed misdirection; keeps the pass off the "while we're here" path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rewording the claude/cursor defaults in the same pass: both name a correct rebuild direction [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:8] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:36]; no observed misdirection; keeps the pass off the "while we're here" path.

### Root-level single install (`npm install` at the repository root): no root `package.json` exists; install is per-workspace across 15 manifests outside `specs/` (probe). [INFERENCE: find probe listing package.json files, this iteration] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Root-level single install (`npm install` at the repository root): no root `package.json` exists; install is per-workspace across 15 manifests outside `specs/` (probe). [INFERENCE: find probe listing package.json files, this iteration]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Root-level single install (`npm install` at the repository root): no root `package.json` exists; install is per-workspace across 15 manifests outside `specs/` (probe). [INFERENCE: find probe listing package.json files, this iteration]

### Runtime `bun test` roast of sk-vision was planned and not executed (tool-call budget and the clone's missing node_modules for that workspace); carried to next iteration rather than inferred away. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Runtime `bun test` roast of sk-vision was planned and not executed (tool-call budget and the clone's missing node_modules for that workspace); carried to next iteration rather than inferred away.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Runtime `bun test` roast of sk-vision was planned and not executed (tool-call budget and the clone's missing node_modules for that workspace); carried to next iteration rather than inferred away.

### Spawning a second pristine sandbox clone: the sanctioned fixture plus `git ls-files` tracking evidence answers the pristine-state question without a new probe zone. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Spawning a second pristine sandbox clone: the sanctioned fixture plus `git ls-files` tracking evidence answers the pristine-state question without a new probe zone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Spawning a second pristine sandbox clone: the sanctioned fixture plus `git ls-files` tracking evidence answers the pristine-state question without a new probe zone.

### The `bun test` Python-spawning roast was not run and is superseded: its motivating hypothesis (tests fail until `dist` is built) is falsified, and the delivery-surface question it was meant to close is answered by the observed build probe (finding 5). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The `bun test` Python-spawning roast was not run and is superseded: its motivating hypothesis (tests fail until `dist` is built) is falsified, and the delivery-surface question it was meant to close is answered by the observed build probe (finding 5).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `bun test` Python-spawning roast was not run and is superseded: its motivating hypothesis (tests fail until `dist` is built) is falsified, and the delivery-surface question it was meant to close is answered by the observed build probe (finding 5).

### Writing `research/research.md` despite `progressiveSynthesis: true`: outside this dispatch's allowed write paths; progressive synthesis stays workflow-owned. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Writing `research/research.md` despite `progressiveSynthesis: true`: outside this dispatch's allowed write paths; progressive synthesis stays workflow-owned.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Writing `research/research.md` despite `progressiveSynthesis: true`: outside this dispatch's allowed write paths; progressive synthesis stays workflow-owned.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `docs/` tree: no `docs/` directory exists in worktree or clone; internal docs are the root markdown files plus the skill-local READMEs listed in README section 16. [SOURCE: README.md:1576-1592] [INFERENCE: find docs probe returned nothing, this iteration] (iteration 1)
- PUBLIC-RELEASE.md as the external-user install path: it documents the maintainer release workflow and the symlink consumer model, both requiring ownership of a shared framework checkout. [SOURCE: PUBLIC-RELEASE.md:74-235] (iteration 1)
- Root-level single install (`npm install` at the repository root): no root `package.json` exists; install is per-workspace across 15 manifests outside `specs/` (probe). [INFERENCE: find probe listing package.json files, this iteration] (iteration 1)
- Node 18 runtime reproduction on this machine: no Node 18 interpreter in nvm (versions v20.19.5+ only); used the lowest available floor 20.19.5 instead. The CONTRIBUTING 18+ claim stays contradicted statically by the >=20.11 floors [SOURCE: .skilled/skills/system-spec-kit/package.json:11-13] and is not runtime-proven either way. (iteration 2)
- None new this iteration. No exhausted-approach direction was retried: the docs-tree, PUBLIC-RELEASE and root-install directions stayed untouched. (iteration 2)
- "sk-vision tests fail until `vision-runtime/dist` is built": falsified at file level. Tests import `src` and spawn `python/runtime.py`; no test consumes `dist` [SOURCE: .skilled/skills/sk-vision/vision-runtime/python/runtime.test.ts:8-22]. The dist consumer is the plugin/CLI delivery surface, not the test suite. (iteration 3)
- "The compiled-routing rebuild breaks a fresh clone because the authored source under `specs/sk-doc/z_archive` is absent": falsified. The path is tracked (6996 files) and present in the clone; sync, guard and the pre-commit gate all resolve it there. (iteration 3)
- None new. No exhausted-approach direction was retried: the docs-tree, PUBLIC-RELEASE, root-install and Node-18 directions stayed untouched. (iteration 3)
- Runtime `bun test` roast of sk-vision was planned and not executed (tool-call budget and the clone's missing node_modules for that workspace); carried to next iteration rather than inferred away. (iteration 3)
- No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, and the `z_archive`-absence claim all stayed untouched. (iteration 4)
- None new. Nothing found this iteration suggests a productive path for the falsified hypotheses. (iteration 4)
- The `bun test` Python-spawning roast was not run and is superseded: its motivating hypothesis (tests fail until `dist` is built) is falsified, and the delivery-surface question it was meant to close is answered by the observed build probe (finding 5). (iteration 4)
- Executing the `check-git-hooks.sh` self-heal end-to-end inside the clone: running it invokes the installer whose effects beyond the clone's `.git/hooks` were not verified from the 1-55 read, so the mechanism and its trigger conditions were established from the script text instead of mutating machine state. (iteration 5)
- No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, and the two superseded `bun test` roasts all stayed untouched. (iteration 5)
- None new. (iteration 5)
- Re-running the spec-kit runtime workspace build end-to-end in the clone to re-prove the devin-named remedy command: the clone is not pristine (prior iterations installed its node_modules and produced its dist), so a re-run would not establish the claim that matters — that the documented step 2 is sufficient. The build script, the present `dist/hooks` tree and the two executed adapters already ground the remedy chain; the step-2 sufficiency statement stays an explicit inference. (iteration 6)
- Executing the checker against a tree without the built parser (the decisive crash reproduction): it would require deleting the built file inside the clone, and deletions are banned in this run; the arc is grounded by the tracked-file count, the load-time require structure, and Node module semantics, with the last hop marked inference. (iteration 7)
- None new. The mirror-content direction is *not* a dead end but is now fully mapped: no content drift exists at HEAD, so no content fix is owed there. (iteration 7)
- Retrying any exhausted-approach direction: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, the `bun test` roasts, the `check-git-hooks.sh` execution, and the build re-run all stayed untouched. (iteration 7)
- Spawning a second pristine sandbox clone: the sanctioned fixture plus `git ls-files` tracking evidence answers the pristine-state question without a new probe zone. (iteration 7)
- Editing the generated `.codex/hooks.json` directly to change the notice: pre-commit and CI run `sync-hook-registrations.cjs --check` [SOURCE: .skilled/scripts/git-hooks/pre-commit:272] [SOURCE: .github/workflows/spec-kit-check.yml:161], so an un-regenerated edit reports drift; the registry is the edit point. (iteration 8)
- Executing `install-codex-hooks.mjs --check` in the clone to observe user-global behavior: the user-global `~/.codex/hooks.json` sits outside the clone sandbox; the tool's contract is documented and `--check` is non-mutating by design [SOURCE: .skilled/bin/README.md:168], so its semantics were read, not executed. (iteration 8)
- None new. The registry-sourced generation pipeline is the live mechanism at HEAD, confirmed by both gates and by the clone probe; the direction is resolved rather than dead, and no content fix remains owed beyond the one string. (iteration 8)
- Per-binding `message` overrides for the dist-only codex adapters: the mechanism exists [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:73] and is used five times [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:728], but all four runtimes use runtime-level defaults; adding per-adapter strings adds binding bookkeeping the requirement does not earn. (iteration 8)
- Rewording the claude/cursor defaults in the same pass: both name a correct rebuild direction [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:8] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:36]; no observed misdirection; keeps the pass off the "while we're here" path. (iteration 8)
- Adding F6 to the implementation bundle: the "while we're here" restraint signal; no observed failure names it. (iteration 9)
- None new. The consolidated set resolves the carried fix-set recommendation; the remaining work is implementation-time anchor re-verification, not research. (iteration 9)
- Re-probing the anchors beyond the fresh read: the read is the verification; a second pass is owed only at implementation start per iteration 8's (b). (iteration 9)
- Retrying any exhausted-approach direction: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the z_archive-absence claim, the bun-test roasts, the check-git-hooks execution and the build re-run all stayed untouched. (iteration 9)
- Writing `research/research.md` despite `progressiveSynthesis: true`: outside this dispatch's allowed write paths; progressive synthesis stays workflow-owned. (iteration 9)
- **A fresh-HOME pi launch to observe the trust prompt end-to-end.** The trust decision is interactive, and a one-shot probe cannot bind it; pi's normative scope rule, the trust-resolution order and the dist read path settle the file-level question with primary sources (Finding 1). (iteration 10)
- **A live Claude Code session to observe project-settings startup precedence.** No safe non-interactive probe exists; the fetched schema documents the shipped values' semantics, and the residual uncertainty is recorded in Finding 2 instead of being smoothed over. (iteration 10)
- **Reproducing the Pi silence by removing `runtime/dist`.** Deletion is banned, and the probe clone's dist was produced by earlier iterations; the file-level chain plus the 0-tracked `git ls-files` count stand as the evidence. (iteration 10)
- No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, the `bun test` roasts, the generated `.codex/hooks.json` edit path and the F6-bundling direction all stayed untouched. (iteration 10)

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
- Q2, Q3, Q4, Q5 (4 of 5) (iteration 1)
- Q3, Q4, Q5 (3 of 5). (iteration 2)
- None from the strategy's key-question registry. The reducer owns the tick; this iteration answers Q5. (iteration 4)
- None in the strategy registry. Optional unprobed slots are listed under Recommended Next Focus. (iteration 5)
- None in the strategy registry. The two unranked candidates are listed under Recommended Next Focus. (iteration 7)
- None in the strategy registry. Two carried fix-set items are listed under Recommended Next Focus. (iteration 8)
- None in the strategy registry. Iteration 10 candidates: the settings-defaults security flag (iteration 5, finding 4) and the Pi silent fail-open notice question (iteration 6, finding 4). (iteration 9)
- None in the strategy registry. The run reaches its iteration ceiling with no open question. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior context: none beyond the packet's own spec.md, plan.md and goal.md.

### Bounded Context Snapshot

- Source pointers: README.md, PUBLIC-RELEASE.md, CONTRIBUTING.md, .skilled/bin/lib/compiled-route-layout.cjs, .skilled/skills/sk-vision/, .skilled/skills/system-skill-advisor/, .skilled/skills/system-spec-kit/runtime/, .skilled/skills/sk-git/, .skilled/hooks/, REPO RULES.md, .skilled/repo-rules/prevent-overengineering.md.
- Fresh-clone fixture: a disposable clone of the current tree exists at /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/8bb7f97a-f291-4af3-b712-1b46f9323681/scratchpad/o2-fresh-clone (no node_modules, no build outputs). Run probes there (read-only commands, or installs/builds inside that clone only). Never write into the repository working tree outside the packet's research/ folder.
- Node versions available for reproduction: ~/.nvm/versions/node/v20.19.5, v22.23.1, v24.9.0, v25.6.1, v26.8.2 (default on PATH is v26). Use e.g. PATH=$HOME/.nvm/versions/node/v20.19.5/bin:$PATH to test a floor.
- Early observation to verify: 36 empty files named .skilled_skills_* are tracked at the repository root (git ls-files | grep '^.skilled_skills').
- Constraints and risks: every claim must carry a [SOURCE: path:line] that was read this iteration; an external user does not have the operator's global git hooks, credentials or ~/.pi config.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10 (stopPolicy max-iterations)
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes target (executor timeout 1800s)
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
- Current generation: 1
- Started: 2026-10-11T16:24:46Z
