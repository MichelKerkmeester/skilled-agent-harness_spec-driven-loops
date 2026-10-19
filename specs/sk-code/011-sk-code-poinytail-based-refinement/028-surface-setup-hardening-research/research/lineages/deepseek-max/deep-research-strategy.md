
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
Surface setup hardening for external sk-code users. Skilled assumes every sk-code surface except sk-code-skilled (the native surface, lowest priority for an external user) and sk-code-review (workflow) is irrelevant to an external user, that sk-code-obsidian and sk-code-webflow are the operator's personal examples an external user deletes, that shared/ and sk-code-quality stay, and that any surface the user adds outranks sk-code-skilled. The tie order today is quality, review, opencode, obsidian, webflow (.skilled/skills/sk-code/hub-router.json routerPolicy.tieBreak). Already shipped and NOT to be re-recommended: phase 025 research (specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md, F1-F96, R1-R10, X1-X24; its section 14 is the final list); phase 026 built R1 (/create:skill-parent update --surfaces places a new surface ahead of sk-code-skilled), R2 (sk-code drift guards tolerate removed examples), R3 and R7 (doctor, guard and sync messages name the fix; a missing authored closure is a named failure), R8 (scaffold handoff names the canary and re-mint follow-ups), R4 and R9 (examples marked, the root README block "What Adapting `sk-code` Looks Like" is the single external-user guide, release note v4.0.0.5); phase 027 added doctor check 5l in .skilled/commands/doctor/scripts/parent-skill-check.cjs that reports a hand-placed surface after sk-code-skilled in tieBreak unless it is one of the two examples. Operator ruling R5 stands: sk-code-skilled keeps its generic language keywords (report its UX cost only). Answer with path:line or command evidence, classify every finding NEW or ALREADY-COVERED (name the 025 F/R/X id or 026/027), and observe behavior in throwaway copies only: (1) remaining ways the assumption breaks: hand edits to tieBreak, mode-registry.json or hub-router.json, skill-advisor routing (graph metadata, scorer boosts, batteries), compiled routing (manifest, canary fixtures, authored copies), the Hermes copies and the other runtimes' mirrors (.opencode, .claude, .codex, .cursor, .devin, .pi, .hermes), manual-testing playbooks, benchmarks, canaries, feature catalogs, and a fresh clone; (2) the end-to-end external-user journey from clone to a green battery (doctor, guard, sync, drift guards, advisor, one routed prompt), with every friction point; (3) automation that removes manual steps without a judgment call; (4) the operator's two shapes weighed against each other with better names: a new doctor command such as `/doctor sk-code-setup` referenced and integrated in the sk-code hub, versus a new mode inside the sk-code hub such as `sk-code-setup`; for each, where it would be referenced, what it would run, its cost and blast radius, and which existing surfaces (doctor command family under .skilled/commands/doctor/, hub mode-registry, /create:skill-parent) it would overlap; (5) ideas to reject and why. Every recommendation must pass .skilled/repo-rules/prevent-overengineering.md: name the failure it prevents today, the smallest change, and the cheaper move that fails.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Where can the assumption still break (hand edits to tieBreak or the registries, skill-advisor routing, compiled routing, Hermes copies, runtime mirrors, playbooks, benchmarks, canaries, feature catalogs, fresh clones)?
- [ ] Q2: What does an external user do from clone to a green battery, and where is each friction point?
- [x] Q3: Which manual steps can existing automation absorb without a judgment call?
- [x] Q4: Should the setup be a new doctor command or a new sk-code hub mode, what should it be called, where would it be referenced and what does each cost?
- [x] Q5: Which ideas should be rejected, and why?
- [x] Q6: Which findings are NEW and which are ALREADY-COVERED by 025, 026 or 027?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Changing any skill, command, script or README; this is research only.
- Re-recommending what 025, 026 or 027 already shipped.
- Changing sk-code-skilled's generic language keywords (operator ruling R5).

---

## 5. STOP CONDITIONS
- Five iterations completed (stop policy max-iterations).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q3: Which manual steps can existing automation absorb without a judgment call?
- Q4: Should the setup be a new doctor command or a new sk-code hub mode, what should it be called, where would it be referenced and what does each cost?
- Q5: Which ideas should be rejected, and why?
- Q6: Which findings are NEW and which are ALREADY-COVERED by 025, 026 or 027?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- narrowing from repo-wide grep to the runtime surface (`.skilled/` + the seven mirrors) converted a 900-file noise field into six decisive files; reading the canary leg's implementation rather than the fixture alone turned F46's "gate exits 1" into its exact removal-direction semantics. (iteration 1)
- reading the sync contract before running it made the probe's expected outcomes falsifiable (STALE/FAIL vs prune/PASS), and the copy let a bare delete and two hand edits run to completion with real exit codes; hardcoding the copy path after the `$X` loss removed the last source of ambiguity. (iteration 2)
- reading the validator's self-test fixtures gave the doctor route contract's exact rule set (B2-L1) in one file, which made the "files it touches" list falsifiable rather than inferred; reading `mode-registry.json` and `hub-router.json` together showed both the two-axis contract and the routing dead end in two files. (iteration 3)
- the fixed-path copy (instead of the recipe's `mktemp` suffix) removed the cross-exec variable loss that cost iteration 2; the stand-in's failure set was richer than predicted because the copied-example path trips leaf-set collision, which neither 5l nor the README mentions. (iteration 4)
- driving the exact README sequence with exit codes made the contested claim falsifiable in one pass — the refresh command's `refreshed:true` JSON and the post-copy `targets[0]` route output are the two decisive lines. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first two greps were budget-expensive because spec archives share the surface names; the F-row verification would have been cheaper by reading section 3.1-3.11 once instead of grepping F-rows. (iteration 1)
- relying on a shell variable across exec calls — the persistent session did not preserve it, and the fallback run silently measured the original worktree; caught by the count mismatch (68 vs 66 copies) and the `PWD` print. (iteration 2)
- the first `What Adapting` grep returned 87 files, dominated by spec archives and lineage prompts — the same noise pattern iteration 1 recorded; targeting README.md directly was decisive. (iteration 3)
- the string-rename shortcut (content only) produced dead-path noise in `check paths`; renaming files too would have isolated `check surfaces`. (iteration 4)
- the clone-with-rename add tripped `3d-alias` (aliases without the example's name in them survive) and `5k-packet` (a `rails` keyword is not the literal packet id) — two self-named failures that a targeted clone cannot avoid. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Copy probes for Q4: unnecessary — the doctor family's registration, validation and mirroring contracts are all committed files, and every claim above is a path:line read. The recipes remain for the Q2 fresh-clone journey. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Copy probes for Q4: unnecessary — the doctor family's registration, validation and mirroring contracts are all committed files, and every claim above is a path:line read. The recipes remain for the Q2 fresh-clone journey.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copy probes for Q4: unnecessary — the doctor family's registration, validation and mirroring contracts are all committed files, and every claim above is a path:line read. The recipes remain for the Q2 fresh-clone journey.

### None definitive this iteration; the deferred copy probe (below) is the candidate for a later iteration, not a dead end. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None definitive this iteration; the deferred copy probe (below) is the candidate for a later iteration, not a dead end.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None definitive this iteration; the deferred copy probe (below) is the candidate for a later iteration, not a dead end.

### None definitive. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None definitive.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None definitive.

### None definitive. The bare-delete wall is a finding, not a dead end; the copy probes are reproducible (copy `deepseek-max-i2-wGIE`, or re-run the recipes above). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: None definitive. The bare-delete wall is a finding, not a dead end; the copy probes are reproducible (copy `deepseek-max-i2-wGIE`, or re-run the recipes above).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None definitive. The bare-delete wall is a finding, not a dead end; the copy probes are reproducible (copy `deepseek-max-i2-wGIE`, or re-run the recipes above).

### None definitive. The commit-path repair question is a named remaining uncertainty, not a dead end. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: None definitive. The commit-path repair question is a named remaining uncertainty, not a dead end.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None definitive. The commit-path repair question is a named remaining uncertainty, not a dead end.

### None definitive. The stand-in's `check paths` noise is a probe artifact and not a candidate for "Exhausted Approaches". -- BLOCKED (iteration 4, 1 attempts)
- What was tried: None definitive. The stand-in's `check paths` noise is a probe artifact and not a candidate for "Exhausted Approaches".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None definitive. The stand-in's `check paths` noise is a probe artifact and not a candidate for "Exhausted Approaches".

### Re-running the 5l failing direction (surface placed after OpenCode): the message text is a committed-file read ([SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]) and 027 already shipped the check; budget spent on the un-run directions instead. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Re-running the 5l failing direction (surface placed after OpenCode): the message text is a committed-file read ([SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]) and 027 already shipped the check; budget spent on the un-run directions instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the 5l failing direction (surface placed after OpenCode): the message text is a committed-file read ([SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]) and 027 already shipped the check; budget spent on the un-run directions instead.

### Re-running the swe-max failure sequence with their exact edit order to force `MOVE-SIMULATION`: budget; the README path's end-to-end green (sync, guard, route) is the decisive answer, and the non-reproduction is recorded as a BREAK row. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Re-running the swe-max failure sequence with their exact edit order to force `MOVE-SIMULATION`: budget; the README path's end-to-end green (sync, guard, route) is the decisive answer, and the non-reproduction is recorded as a BREAK row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the swe-max failure sequence with their exact edit order to force `MOVE-SIMULATION`: budget; the README path's end-to-end green (sync, guard, route) is the decisive answer, and the non-reproduction is recorded as a BREAK row.

### Reproducing the `check paths` dead-reference lines as a product finding: they came from my rename shortcut (content rewritten, filenames not), so they are probe noise, not a product defect. The decisive stand-in guard failures are `check surfaces` and doc-claims. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reproducing the `check paths` dead-reference lines as a product finding: they came from my rename shortcut (content rewritten, filenames not), so they are probe noise, not a product defect. The decisive stand-in guard failures are `check surfaces` and doc-claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reproducing the `check paths` dead-reference lines as a product finding: they came from my rename shortcut (content rewritten, filenames not), so they are probe noise, not a product defect. The decisive stand-in guard failures are `check surfaces` and doc-claims.

### Row-by-row reading of all 025 F-rows: budget; used sections 7, 8, 14 and targeted F-row greps instead. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Row-by-row reading of all 025 F-rows: budget; used sections 7, 8, 14 and targeted F-row greps instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Row-by-row reading of all 025 F-rows: budget; used sections 7, 8, 14 and targeted F-row greps instead.

### Running the Hermes sync from a shell whose `$X` variable did not persist: an intermediate invocation fell back to the default cwd (the original worktree) and reported `Wrote 0 of 68 ... pruned 0`. Verified harmless — `git status --porcelain -- .hermes` is empty and the original `.hermes/skills` still holds both example copies — and the probe was re-run with a hardcoded copy path. All later commands used the hardcoded path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Running the Hermes sync from a shell whose `$X` variable did not persist: an intermediate invocation fell back to the default cwd (the original worktree) and reported `Wrote 0 of 68 ... pruned 0`. Verified harmless — `git status --porcelain -- .hermes` is empty and the original `.hermes/skills` still holds both example copies — and the probe was re-run with a hardcoded copy path. All later commands used the hardcoded path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running the Hermes sync from a shell whose `$X` variable did not persist: an intermediate invocation fell back to the default cwd (the original worktree) and reported `Wrote 0 of 68 ... pruned 0`. Verified harmless — `git status --porcelain -- .hermes` is empty and the original `.hermes/skills` still holds both example copies — and the probe was re-run with a hardcoded copy path. All later commands used the hardcoded path.

### Whole-repo name grep as the classification instrument: 849/925 matching files, dominated by spec archives; narrowed to `.skilled/` and the runtime mirrors. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Whole-repo name grep as the classification instrument: 849/925 matching files, dominated by spec archives; narrowed to `.skilled/` and the runtime mirrors.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Whole-repo name grep as the classification instrument: 849/925 matching files, dominated by spec archives; narrowed to `.skilled/` and the runtime mirrors.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- None definitive this iteration; the deferred copy probe (below) is the candidate for a later iteration, not a dead end. (iteration 1)
- Row-by-row reading of all 025 F-rows: budget; used sections 7, 8, 14 and targeted F-row greps instead. (iteration 1)
- Whole-repo name grep as the classification instrument: 849/925 matching files, dominated by spec archives; narrowed to `.skilled/` and the runtime mirrors. (iteration 1)
- None definitive. The bare-delete wall is a finding, not a dead end; the copy probes are reproducible (copy `deepseek-max-i2-wGIE`, or re-run the recipes above). (iteration 2)
- Running the Hermes sync from a shell whose `$X` variable did not persist: an intermediate invocation fell back to the default cwd (the original worktree) and reported `Wrote 0 of 68 ... pruned 0`. Verified harmless — `git status --porcelain -- .hermes` is empty and the original `.hermes/skills` still holds both example copies — and the probe was re-run with a hardcoded copy path. All later commands used the hardcoded path. (iteration 2)
- Copy probes for Q4: unnecessary — the doctor family's registration, validation and mirroring contracts are all committed files, and every claim above is a path:line read. The recipes remain for the Q2 fresh-clone journey. (iteration 3)
- None definitive. (iteration 3)
- None definitive. The stand-in's `check paths` noise is a probe artifact and not a candidate for "Exhausted Approaches". (iteration 4)
- Re-running the 5l failing direction (surface placed after OpenCode): the message text is a committed-file read ([SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]) and 027 already shipped the check; budget spent on the un-run directions instead. (iteration 4)
- Reproducing the `check paths` dead-reference lines as a product finding: they came from my rename shortcut (content rewritten, filenames not), so they are probe noise, not a product defect. The decisive stand-in guard failures are `check surfaces` and doc-claims. (iteration 4)
- None definitive. The commit-path repair question is a named remaining uncertainty, not a dead end. (iteration 5)
- Re-running the swe-max failure sequence with their exact edit order to force `MOVE-SIMULATION`: budget; the README path's end-to-end green (sync, guard, route) is the decisive answer, and the non-reproduction is recorded as a BREAK row. (iteration 5)

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
- Q1 remainder: `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/*` (5-9 example-name hits each), benchmarks, feature catalogs, hand-edit tolerance of registries, fresh clone. (iteration 1)
- Q2-Q6 untouched. (iteration 1)
- Q1 remainder: fresh clone from `git clone` to a green battery; scaffolded-removal re-mint behavior (canary fixture, compiled manifest) — not probed this iteration. (iteration 2)
- Q2-Q6 untouched (the copy journey probes above are raw material for Q2/Q3). (iteration 2)
- Detail left uncaptured: the identity of the second failed guard in the umbrella run (the captured tail names doc-claims; the full log is in the exec overflow file). (iteration 2)
- Q1 remainder: fresh clone from `git clone` to a green battery; scaffolded-removal re-mint behavior (canary fixture, compiled manifest) — not probed. (iteration 3)
- Q3, Q5, Q6 untouched. (iteration 3)
- Detail left uncaptured (iteration 2): the identity of the second failed guard in the umbrella run. (iteration 3)
- Q2: the clone-to-battery journey — partially informed here (the battery is README:1476-1483) but the fresh-clone probe is not done. (iteration 3)
- Q1 remainder: fresh clone from `git clone` to a green battery; scaffolded-removal re-mint behavior — not probed. (iteration 4)
- Q2: the clone-to-battery journey — timing and friction now captured, but the fresh-clone probe is not done. (iteration 4)
- Detail left uncaptured (iteration 2): the identity of the second failed guard in the earlier umbrella run — this iteration's copy shows the failure set directly (doc-claims + check paths). (iteration 4)
- Q5, Q6 untouched (classification rows above are input). (iteration 4)
- Unsettled detail: whether the routing re-mint gate copies a re-minted manifest to its authored path after the mirror-parity gate passes (my commit was blocked before that point; settle by running `sync-skills-hermes.cjs`, `git add`, and re-committing). (iteration 5)
- Q1 remainder: fresh clone from `git clone` to a green battery; playbooks/benchmarks/feature-catalog mentions; Hermes copies beyond the mirror-parity gate. (iteration 5)
- Q2: the clone-to-battery journey — battery timing and friction captured (iterations 3-4), fresh-clone probe still not done. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q2: the clone-to-battery journey — battery timing and friction captured (iterations 3-4), fresh-clone probe still not done.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior synthesis: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md (section 14 is the final list). Builds: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/ (five children) and 027-surface-tie-order-warning/. resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 9 minutes
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
- Started: 2026-10-13T17:31:23.657Z
