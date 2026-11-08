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
Audit the Skilled v4 spec-kit core, .skilled/skills/system-spec-kit/** and .skilled/commands/speckit/**, across releases v4.0.0.0 to v4.0.2.0. Surfaces: the Gate 3 classifier (system-spec-kit/shared/gate-3-classifier.ts), validate.sh and its rules (runtime/cli/spec/, runtime/cli/rules/), the trigger index and retrieval (runtime/cli/retrieval/), continuity save and resume (generate-context.js, /speckit:save, /speckit:resume), the goal system (goal.md, goal.cjs), upgrade and /doctor:update, the level templates and create.sh. Releases: notes in .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0-beta.1 (baseline), v4.0.0.0 3fed08373e, v4.0.0.1 bcb775402e, v4.0.0.2 7980001709, v4.0.0.3 c9bd4b156c, v4.0.0.4 to v4.0.0.10 all 4d8f403355 (one commit: use each note plus git log --since/--until by date, not tag diffs), v4.0.0.11 e2b2e393fa, v4.0.0.12 7fecd5f219, v4.0.0.13 42b41dd286, v4.0.0.14 bb9b9d1c09, v4.0.0.15 22c3a9b2c7, v4.0.0.16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317. Always path-limit git diff: git diff <prev>..<tag> -- <cluster path>; the unlimited diff times out. Finding types: 1 drift (note vs code vs docs disagree), 2 misalignment with sk-code, sk-doc or Skilled canon, 3 bug, 4 improvement, 5 UX for the operator and the AI user, 6 over-engineering (say what breaks if removed, or that nothing does), 7 extension (a concrete way to extend the logic). Evidence bar for every finding: type, severity P0/P1/P2, [SOURCE: path:line] for a line you read this iteration, the release that introduced it, confidence, and a verify command. A bug needs a repro command or a failing check you ran. Read code, not only release notes. Read-only research: never edit, stage or commit repository files, and run commands only in read-only, check, plan or dry-run modes.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Does the Gate 3 classifier in .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts classify the same prompts as the Gate 3 text in AGENTS.md and the v4.0.0.1 note section The Gate That Asks Once, and which prompt does it misclassify?
- [x] Which validate.sh rules named in the v4.0.0.0 and v4.0.0.5 notes exist in runtime/cli/rules and the validation orchestrator, and does any rule pass on a packet it should fail?
- [x] Does the trigger index lookup and build (runtime/cli/retrieval/) match retrieval-conventions.md and the release notes on rebuild, staleness and exit codes?
- [x] Does continuity save and resume (generate-context.js, /speckit:save, /speckit:resume) route content where the v4.0.0.13, v4.0.0.14 and v4.0.1.0 notes say it does?
- [x] Does the goal system shipped in v4.0.0.2 (goal.md template, goal.cjs, the 4,000-character slice budget) behave as its docs say, and where is the budget enforced?
- [ ] Do upgrade, preview and rollback (/doctor:update check, align, apply, rollback from v4.0.0.3 and v4.0.0.5) hold up when read end to end and run only in check, preview or dry-run modes, and which step has no test?
- [ ] Do create.sh and the level templates produce a packet that passes validate.sh --strict without hand edits, and do template fill notes agree with sk-doc and the template canon?
- [x] Which spec-kit changes in v4.0.0.13 to v4.0.2.0 (handover, environment settings, Decisions Through the Question Tool) are missing or stale in system-spec-kit SKILL.md and references?
- [x] Which spec-kit scripts, rules or options have no caller, no test, or duplicate another, and what breaks if each is removed?
- [x] What friction do the operator and the AI user hit in validate.sh, create.sh and the speckit commands: error text, exit codes, required flags, output length?
- [x] Where do system-spec-kit code and docs depart from sk-code standards and sk-doc skill format?
- [x] What concrete extensions to the Gate 3 classifier, validate rules, trigger index, continuity and goal features would close a gap found in this run?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Fixing, editing, staging or committing anything outside this run directory.
- Surfaces owned by sibling phases of the parent packet, except where they meet this cluster.
- Releases before v4.0.0.0 or after v4.0.2.0, except as context.

---

## 5. STOP CONDITIONS
- stopPolicy is max-iterations: convergence is telemetry only and the loop runs to maxIterations.
- Three consecutive executor failures halt the loop for an executor switch, logged in decision-record.md.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Does the Gate 3 classifier in .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts classify the same prompts as the Gate 3 text in AGENTS.md and the v4.0.0.1 note section The Gate That Asks Once, and which prompt does it misclassify?
- Which validate.sh rules named in the v4.0.0.0 and v4.0.0.5 notes exist in runtime/cli/rules and the validation orchestrator, and does any rule pass on a packet it should fail?
- Does the trigger index lookup and build (runtime/cli/retrieval/) match retrieval-conventions.md and the release notes on rebuild, staleness and exit codes?
- Does continuity save and resume (generate-context.js, /speckit:save, /speckit:resume) route content where the v4.0.0.13, v4.0.0.14 and v4.0.1.0 notes say it does?
- Does the goal system shipped in v4.0.0.2 (goal.md template, goal.cjs, the 4,000-character slice budget) behave as its docs say, and where is the budget enforced?
- Which spec-kit changes in v4.0.0.13 to v4.0.2.0 (handover, environment settings, Decisions Through the Question Tool) are missing or stale in system-spec-kit SKILL.md and references?
- Which spec-kit scripts, rules or options have no caller, no test, or duplicate another, and what breaks if each is removed?
- What friction do the operator and the AI user hit in validate.sh, create.sh and the speckit commands: error text, exit codes, required flags, output length?
- Where do system-spec-kit code and docs depart from sk-code standards and sk-doc skill format?
- What concrete extensions to the Gate 3 classifier, validate rules, trigger index, continuity and goal features would close a gap found in this run?

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
- Questions 3–12 remain untouched: trigger index and retrieval, continuity save/resume routing, goal budget, upgrade preview/rollback, create.sh and level templates, v4.0.0.13–v4.0.2.0 doc drift, dead scripts, operator friction, sk-code/sk-doc conformance, extensions. (iteration 1)
- Question 2 is only half answered: the inventory is compared, but no packet with a known defect was run through `validate.sh --strict` to prove a rule does not pass when it should fail. (iteration 1)
- Residual on Q3: whether the lookup should expose a freshness signal, and whether `retrieval-conventions.md` should carry the `--check` contract. (iteration 2)
- Q4–Q12 remain: continuity save/resume routing, the goal budget, upgrade preview/rollback, `create.sh` and the level templates, the v4.0.0.13–v4.0.2.0 doc drift, dead scripts, operator friction, sk-code/sk-doc conformance, and concrete extensions. (iteration 2)
- Residual on Q2: the other four named rules were inventoried but not each executed with a failing fixture; the phase-parent exemption and the structure-parser divergence need a decision. (iteration 2)
- Q3 residual: whether the trigger index should expose a freshness signal, and whether `retrieval-conventions.md` should carry the `--check` contract. The resume workflow runs the lookup without a freshness gate [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:75], so a stale index can still return hits; this is recorded as a residual, not a new finding, because it may overlap the Q3 work. (iteration 3)
- Q4 residual: v4.0.2.0 says “if anything is missing or stale, the lookup section is left out” [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:98]; the resume YAML handles no-hit and error exits but does not gate on staleness before running the lookup. (iteration 3)
- Q5 residual: whether bind and packet should refuse an over-budget goal, or whether the current warn-and-report split is the intended contract. (iteration 3)
- Q6–Q12 remain: upgrade preview/rollback, `create.sh` and level templates, v4.0.0.13–v4.0.2.0 doc drift, dead scripts, operator friction, sk-code/sk-doc conformance, and concrete extensions. (iteration 3)
- Q3 residual unchanged (freshness signal; `--check` contract in retrieval-conventions.md). Q4 residual unchanged (stale-index gate absent from the resume YAML). (iteration 5)
- Q8-Q12 untouched: v4.0.0.13-v4.0.2.0 doc drift, dead scripts, operator friction across the speckit commands, sk-code/sk-doc conformance, concrete extensions. (iteration 5)
- Q6 residual: only `check` was executed. `align --dry-run`, `apply --dry-run`, `rollback --dry-run` and `compat --dry-run` were read (update.md §§3-7, the compat YAML's phase list and command table [SOURCE: .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:36]) but not run, so the dry-run preview path is unverified end to end. (iteration 5)
- F2 needs one more probe: whether the divergence is the unresolved-budget case only, or every check whose `options` differ between corpus and packet paths. (iteration 5)
- Q7 residual: the template fill-note question against sk-doc canon, and the `MEASURED_BEHAVIOR` rule's source file. (iteration 5)
- Q10–Q12 untouched by this iteration's findings: operator friction across the speckit commands (F2 is adjacent but is a self-count, not command friction), sk-code/sk-doc conformance, and concrete extensions beyond F5. (iteration 6)
- F3 depends on one missing probe (canonical `ENV-REFERENCE.md` location and coverage). (iteration 6)
- Q8 residual: the **Decisions Through the Question Tool** limb (v4.0.2.0) and the v4.0.1.0 "answers reach the decision record" limb were read in the notes only. Neither was grepped against `SKILL.md`/`references`. Also unverified: whether a repo-root `ENV-REFERENCE.md` (named in the v4.0.0.13 note) exists and covers the relaunch switches. (iteration 6)
- Q9 residual: the rules/options limb. `runtime/cli/rules` carries paired `.sh`/`.cjs` implementations (`check-canonical-save-*`, `check-frontmatter*`, `check-graph-metadata*`); whether each pair is a thin shim or a duplicate implementation was not read, and neither was whether every registered rule has a failing fixture. (iteration 6)
- **Q7 residual unchanged:** the template fill-note comparison against sk-doc canon, and the `MEASURED_BEHAVIOR` rule's source file. (iteration 7)
- **New residual from F8:** whether the module header appears on line 2 of those 14 files (which would make them conforming under a reasonable reading) — only line 1 was measured. (iteration 7)
- **Q6 residual unchanged:** only `check` was executed for `/doctor:update`; `align`, `apply`, `rollback` and `compat` were read, not run. (iteration 7)
- **New residual from F9:** the three vitest project prefixes were read from a cached results file; the config that declares them was not opened, so "three roots" is observed output, not declared intent. (iteration 7)
- **Q12 partial:** the trigger-index and continuity extension limbs remain — F5–F7 cover the classifier, validate rules and goal only. (iteration 7)
- **New residual from F2:** whether the `9-command` self-count was ever correct (at v4.0.0.0 the family may have had nine commands including two `/deep` entries), which would make this a stale count rather than a wrong one. Needs the v4.0.0.0 note read against the then-current table. (iteration 7)
- **Carried:** Q3 freshness signal, Q4 stale-index gate, Q5 over-budget bind, Q9 rules/options pairs, Q10–Q12. (iteration 8)
- **New residual from F2:** whether a v3-era memory daemon used to provide the router (the `LLM_REFORMULATION_ENDPOINT` name suggests it). `git log -S` showed a single docs commit for the section, so the code was never in this tree — but the docs commit could have migrated text from `.opencode/skill/...`. Unverified. (iteration 8)
- **Q6 (upgrade preview/rollback)** — unchanged residual: only `check` has been executed; `align`, `apply`, `rollback`, `compat` are read but unrun. (iteration 8)
- **New residual from F4:** whether `usesSpecKit()` accepts a project that only carries a `specs/` folder — the scratch repo *had* `specs/001-probe` and was still rejected, so the marker is something else (unread). That is the difference between "fallback for a non-skilled project" and "fallback for a project that merely looks wrong", and only the first is defensible. (iteration 8)
- **Q7 (create.sh + level templates)** — unchanged; the fill-note comparison against sk-doc canon is still open. (iteration 8)
- **New residual from F1:** whether any consumer (hook, CI job, resume YAML) ever reads the `--check` exit status. (iteration 9)
- **New residual from F6:** whether the four other runtimes' capture hooks are documented anywhere outside the (iteration 9)
- **Q6** — `align`, `apply`, `rollback`, `compat` still unrun. Third iteration carrying this. (iteration 9)
- **New residual from F7:** whether `runtime/dist` is rebuilt at release time by CI or hand-committed; that decides (iteration 9)
- **Q7 residual from iteration 5 closed:** `check-measured-behavior.sh` is the `MEASURED_BEHAVIOR` rule's source (iteration 9)
- **Q7** — blocked on F5: no preview mode exists, so "does the scaffold pass `--strict` without hand edits" can (iteration 9)
- **Q6 (`/doctor:update` preview/rollback)** — unchanged, and now the oldest open item: only `check` has ever been (iteration 10)
- **Untouched:** Q3 freshness signal, Q4 stale-index gate, Q5 over-budget bind, Q8 doc drift across (iteration 10)
- **Q7 (`create.sh` + level templates)** — still blocked: no preview mode exists, so "does the scaffold pass (iteration 10)
- **Residual from W1:** whether the 43 stale rows match the untracked docs one-for-one. I counted 566 untracked (iteration 10)
- **Residual from F1:** whether the order asymmetry also suppresses the `memory_save_match` / `resume_match` (iteration 10)
- **Residual from F3:** whether the skip is triggered by the packet living outside the repository or by cwd being (iteration 10)
- **Q8–Q12** — v4.0.0.13–v4.0.2.0 doc drift (partly advanced by F1), dead scripts, operator friction, (iteration 11)
- **New residual from F6:** whether `measure-cold-lookup.mjs` is meant to price the *shipped* corpus or a (iteration 11)
- **Q7** — `create.sh` + level templates: blocked on F5-of-iteration-9 (no preview mode exists), so "does the (iteration 11)
- **Q6** — `align`, `apply`, `rollback`, `compat` remain unrun. Fourth iteration carrying this. It is now (iteration 11)
- **New residual from F2:** whether the manifest should exclude `specs/**/research/**` (making the index (iteration 11)
- **Q6 (`/doctor:update`)** — `align`, `apply`, `rollback`, `compat` still unrun. Fifth iteration. It is (iteration 12)
- **Q7 (`create.sh` + level templates)** — the scaffold-vs-`--strict` half still blocked on "no preview (iteration 12)
- **Q8–Q12** — the v4.0.0.13–v4.0.2.0 doc-drift remainder, dead scripts, operator friction across the (iteration 12)
- **Open from F8**: what a consumer is supposed to do with `corpusHash`. If nothing reads it, the field (iteration 12)
- **Open from F4**: whether other `sk-doc` scripts share the module-relative `getDefaultWorkspaceRoot` (iteration 12)
- **New residual from F5**: what `usesSpecKit` requires, given that a scratch repo carrying `specs/` was still rejected (iteration 8). That decides whether the fallback fires only for non-skilled projects or also for skilled-looking ones. (iteration 13)
- **New residual from F6**: whether `create.sh:1219`'s global read can precede all three assignments on any path; if it can, the template root is empty there and `copy_template` fails with an argument error rather than a root error. (iteration 13)
- **Carried:** Q3 freshness signal, Q4 stale-index gate, Q5 over-budget bind, Q8 doc-drift remainder, Q10 operator friction, Q11 sk-code/sk-doc conformance, Q12 extensions for trigger index, continuity and goal. (iteration 13)
- **Q6** — `align`, `apply`, `rollback`, `compat` unrun. Sixth iteration carrying this; it is the oldest open item and the only one where the read path is complete and only execution is missing. (iteration 13)
- **New residual from F2**: whether `phase-parent.spec.md.tmpl` in fact defines anchors. If it defines none, the phase exemption is harmless today and only becomes wrong when the template gains an anchor — which changes F2 from "silently passing bad input" to "a latent trap". (iteration 13)
- **Q7** — still blocked on the missing preview mode: whether a `create.sh` scaffold passes `validate.sh --strict` without hand edits is unverified, and the fill-note comparison against sk-doc canon is untouched. F6 improves the failure mode, not the answer. (iteration 13)
- **New residual from F3**: whether `scanWorkspace` already exposes a per-packet `passed` flag that the corpus ladder simply ignores — if so F3 is a one-line change, not a signature change. (iteration 13)
- **Q6** — `align`, `apply`, `rollback`, `compat` still unrun. Seventh iteration carrying this. Nothing in this pass blocked it; the budget went to the coverage and UX work instead. (iteration 14)
- **Carried**: Q3 freshness signal, Q4 stale-index gate (F1 sharpens it — a typo'd resume prompt now yields 20 noise rows with exit 0), Q5 over-budget bind, Q8 doc-drift remainder, Q10 operator friction (F1, F4, F5 are three concrete instances), Q11 sk-code/sk-doc conformance, Q12 extensions for trigger index, continuity and goal. (iteration 14)
- **New from F2**: whether the generated-metadata rules could compare against the *declared* packet id rather than the on-disk path, which is what makes copies fail. (iteration 14)
- **New from F2**: whether `report.passed` is meant to ignore warn-level skips by design, or whether any consumer (hook, CI, resume) treats `Warnings: 1` as failure. That decides whether F2 is "the gate lies" or "the gate is right and only the `RESULT:` line overstates". (iteration 14)
- **New from F6**: whether `derived.created_at` is rewritten by `repair-derived.cjs --apply`, which would pull old packets into the 14-day window. (iteration 14)
- **Q7** — the fill-note comparison against sk-doc canon is untouched, and the strict-pass half now has a method requirement (scratch repo, not a copy). (iteration 14)
- **Q7** — `create.sh` scaffold versus `validate.sh --strict` still unverified, and the template fill-note comparison against sk-doc canon untouched. (iteration 15)
- **New from F1(b):** whether the wrapper's broader doc reach is load-bearing anywhere — a hand-written `handover.md` or `context-save.md` carrying a token is flagged by the hook and ignored by the validator, and the reverse (a doc the validator reads that the wrapper's `find` misses) cannot happen, so the divergence is one-directional. (iteration 15)
- **Q6** — `align`, `apply`, `rollback`, `compat` still unrun. Eighth iteration carrying this; it remains the oldest open item with a complete read path and no execution. (iteration 15)
- **New from F1:** whether any *other* hook-consumed script likewise reimplements a rule it could call. `rules/*.sh` has paired `.sh`/`.cjs` implementations per the iteration-6 residual; the wrapper-to-lib pairing here is the first case found where the pair diverges behaviourally rather than stylistically. (iteration 15)
- **Carried:** Q3 freshness signal, Q4 stale-index gate, Q5 over-budget bind, Q8 doc-drift remainder, Q9 rules/options pairs, Q10 operator friction, Q11 sk-code/sk-doc conformance, Q12 extensions for trigger index, continuity and goal. (iteration 15)
- **New from F3:** whether the level decision is ever taken from `--loc` alone in practice, which decides if the "required" label is merely stale or actively misleading. (iteration 15)
- **Q7 `create.sh` + level templates** — the scaffold-versus-`--strict` half still needs a scratch repo plus a real (non-dry) scaffold, and the template fill-note comparison against sk-doc canon is untouched. (iteration 16)
- **Q6 `/doctor:update`** — `align`, `apply`, `rollback`, `compat` still unrun. Ninth iteration carrying this; the read path is complete and only execution is missing. (iteration 16)
- **Carried** — Q3 freshness signal, Q4 stale-index gate, Q5 over-budget bind, Q8 doc-drift remainder, Q9 rules/options pairs, Q10 operator friction, Q11 sk-code/sk-doc conformance, Q12 extensions for trigger index, continuity and goal. (iteration 16)
- **New from V11** — the v4.0.0.15 draft-auto-repair limb ("never runs in CI", "never for a non-draft"): `orchestrator.ts` carries a `REPAIR_DERIVED_REL` spawn and a five-minute hang guard, but the CI/non-draft gates were only grepped, not executed. (iteration 16)
- **New from V4/F2** — why the corpus path reports `parent-budget` where the packet path reports none: whether corpus passes an unresolved budget through, and whether that same split exists for the other four checks. (iteration 16)
- **New from V6** — whether any `.js` consumer actually calls `resolveProjectRoot` from `dist/core/config.js`; if one does, it throws today, which would make V6 a crash rather than a wrong root. (iteration 16)
- **Q7 `create.sh` + level templates** — unchanged; the scaffold-versus-`--strict` half still needs a (iteration 17)
- **New from F3:** whether adding the alignment eval to CI is even the right fix, given F2 says it (iteration 17)
- **New from F1:** what a consumer of a packet's `_memory.continuity` can do to identify the writer (iteration 17)
- **Q6 `/doctor:update`** — `align`, `apply`, `rollback`, `compat` still unrun. Tenth iteration (iteration 17)
- **Carried** — Q3 freshness signal, Q4 stale-index gate, Q5 over-budget bind, Q8 doc-drift remainder, (iteration 17)
- **New from F1:** whether the doctor/upgrade path provisions `cli/dist` when it aligns a project. If (iteration 17)
- **Q6 `/doctor:update`** — `align`, `apply`, `rollback`, `compat` still unrun. Eleventh iteration carrying (iteration 18)
- **Carried:** Q3 freshness signal, Q4 stale-index gate, Q5 over-budget bind, Q7 `create.sh` + level (iteration 18)
- **New from F1:** whether `runtime/cli/dist` also ships `match-decision-table.js`, which `save.md:71` and (iteration 18)
- **New from F3:** what `finalize-dist.mjs`'s "checker-origin cache" (its own words, line 70) actually stores, (iteration 18)
- **New from F1:** do the upstream `runtime/dist` and `runtime/cli/dist` ever diverge in content, or is (iteration 18)
- **Q7 `create.sh` + level templates** — unchanged: the scaffold-versus-`--strict` half needs a scratch repo and a real scaffold, and the fill-note comparison against sk-doc canon is untouched. (iteration 19)
- **New from F1/F2**: whether a *project* install (as opposed to this repo) always ships `.skilled/hooks/shared/hook-flags.cjs`. If doctor can align the gate without the hub, then three of the four documented disable values and the whole documented alias are inert in that project. (iteration 19)
- **New from F5**: whether `runtime/ENV-REFERENCE.md` is the right home for names whose readers are all outside `runtime/`. The measured 191/251 mismatch is a placement question as much as a guard question, and the answer decides whether the fix is a wider guard or a split document. (iteration 19)
- **Q3/Q4/Q5/Q8/Q9/Q10/Q11/Q12** — carried unchanged. (iteration 19)
- **New from F3**: whether any adapter passes `projectDir` as `undefined` in practice. `evaluateMutation` defends against it (line 1777) and `runEnforceGate` does not (line 1876), so the two disagree about whether the parameter can be absent; if no adapter can omit it, F3's destructive path needs a different trigger (unwritable state dir, `ENOTDIR` on the way to `.state`). (iteration 19)
- **Q6 `/doctor:update`** — `align`, `apply`, `rollback`, `compat` still unrun. Twelfth iteration carrying it; nothing blocked it here, the budget went to the hook surface. (iteration 19)
- **New from F2**: whether `usesSpecKit` is intentionally `.skilled`-only as a migration stance. If it (iteration 20)
- **New from F4**: whether any code compares a `findRepoRoot` result to a `resolveProjectRoot` result (iteration 20)
- **New from F3**: whether any real caller can be more than 14 levels below the sentinel. A vendored (iteration 20)
- **Carried, now the oldest open item (13th iteration)**: `/doctor:update` — `align`, `apply`, (iteration 20)
- **New from F1**: does any other writer bind `CONFIG.PROJECT_ROOT` from a source that bypasses (iteration 20)
- **Carried**: Q7 `create.sh` + level templates (scaffold-versus-`--strict`, fill-note canon); (iteration 20)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
**Carried**: Q7 `create.sh` + level templates (scaffold-versus-`--strict`, fill-note canon);

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
None. No handover.md and no prior research in specs/system-speckit/047-v4-release-line-research/001-spec-kit-core; the free-text recipe was not run because the topic is a long brief rather than a search phrase.

resource-map.md not present; skipping coverage gate

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
- Per-iteration budget: 24 tool calls, 10 minutes (executor timeout 2400 seconds)
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
- Started: 2026-11-08T19:56:59.168Z
