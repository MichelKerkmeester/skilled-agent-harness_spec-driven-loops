---
title: Deep Research Strategy - doc version contract
description: Session strategy for the doc-version-contract deep research run.
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
Why does `node .skilled/skills/sk-doc/scripts/frontmatter-version.mjs verify --skill <name>` exit 1 on every skill it checks (rule, derivation, or missing enforcement), what should a per-doc version mean for an external author, what is the smallest doc-version contract that stays green by construction, and should the per-doc version exist at all.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Why does verify fail: the rule, the derivation, or the fact that nothing enforces it?
- [x] Q2: What should doc versions mean for an external author?
- [x] Q3: What is the smallest contract that stays green by construction?
- [x] Q4: Should the per-doc version exist at all?
- [x] Q5: Which hooks, generators or CI steps write or check a doc version today, if any?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Changing any version, doc or script. Fixes are a later phase.
- Skill package versions and changelog version minting, unless the per-doc rule depends on them.

---

## 5. STOP CONDITIONS
- The run is forced to 10 iterations (stopPolicy max-iterations); convergence is telemetry only.
- Every recommendation must cite a path:line and name its prevent-overengineering move.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Why does verify fail: the rule, the derivation, or the fact that nothing enforces it?
- Q2: What should doc versions mean for an external author?
- Q3: What is the smallest contract that stays green by construction?
- Q4: Should the per-doc version exist at all?
- Q5: Which hooks, generators or CI steps write or check a doc version today, if any?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the standard's framing (enforced gate vs reconciliation tool) before diagnosing turned the "failure" into a documented expected state in one pass; running both commands live made the separation empirical rather than textual. (iteration 1)
- classing the automated surface into three bins (hooks, generators/CI, fixtures) and searching each bin directly produced a closed inventory instead of another partial list; the `ls -la .opencode/` check paid off immediately by converting ambiguous "`.opencode` copy" reasoning into a hard symlink fact. (iteration 2)
- testing the one prose-only leg at source and running `readlink` on the "duplicate" pair. The symlink question was already in the air from iteration 2, so a single `ls -la`/`readlink` pass converted a carried assumption into a correction. Preferring a direct filesystem identity test over another documentary read is what made the consolidation decisive. (iteration 3)
- reading the two CI workflow files end to end instead of trusting the iteration-3 summary. The workflow files are the authoritative wiring evidence, and one of them contained a fact (a Python test invoking the engine) that the dead-end ledger had generalized away. Checking the test runner's glob line directly is what separated "engine tests unreferenced" into its true and false halves. (iteration 4)
- reducing the contract question to "which segments are git-derived" before proposing anything. That made the answer mechanical — the git-derived segment is the only one that can drift, so the contract has to stop asserting it — and checkable against existing helper functions rather than requiring a new design. (iteration 5)
- measuring before arguing. Iteration 5 predicted the field was "noisy"; running the classification converted that into a distribution — the era segment, not `W`, is the dominant stale component (574/713) — which flips the intuitive defense of the field ("keep the era, drop the build") into its strongest cost argument. Enumerating code that touches frontmatter at all before reading any of it also kept the consumer search bounded and falsifiable. (iteration 6)
- treating a definition gap as a pointer to shipping surfaces instead of another lexical search. The packager was the highest-yield artifact available — it answers what actually leaves the repository, and its version checks read as a contract statement, not incidental code. Following iteration 6's recommendation turned a stalled normative question into two checkable facts (what ships; what needs git). (iteration 7)
- executing the claim instead of rereading it. The gate is the only surface in this investigation that is cheap to run, and one run per skill converted the run's central claim ("green by construction") from a code-reading inference into an exit code; the file counts then fell out for free as an independent check on the 713-measurement denominator. (iteration 8)
- broadening by execution rather than rereading. The fleet gate loop and two verify runs took about 20 seconds and converted "three sampled skills" into "all 14 skill dirs green" and "5 skills measured red" — the marginal cost of breadth was near zero, which is exactly why the earlier three-skill sample left it undone. Running the wrapper the router actually pins closed the last routing leg without touching a file. Reading both scope definitions and adding a directory census bounded the only asymmetry to zero live instances instead of leaving it as speculation. (iteration 9)
- executing breadth, not trusting the sample. Nine verify invocations in one loop (~1 tool call, a few minutes) converted "5/5 measured red" into "14/14 fleet red, 2,798 of 2,909 flagged", and the file-count reconciliation (2,022 + 887 = 2,909) matched iteration 9's independent gate denominator — two measurements agreeing on the same universe. Second: re-reading the gate block line-by-line before endorsing "delete the field stays green". Iteration 6 cited the same range [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:29] but read the positive path; the negative branches (:408-410) are what price the fix, and they change "delete the field" from a docs-only edit into an engine+docs change. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nothing failed; the one unresolved detail is the mint epoch of nonzero-`Z` stored values, which needs per-file `git log -S` on the `version:` line and does not block Q1. (iteration 1)
- the first `frontmatter-version` search returned dozens of spec-file hits that drowned the signal; narrowing to non-spec, non-markdown paths made the "no caller exists" claim testable. (iteration 2)
- nothing failed; the repository-wide `rg` for `quick_validate|package_skill` returned a benchmark-report hit whose embedded transcript flooded the output, requiring signal to be separated from noise after the fact. Narrowing with `--glob` on the first pass would have helped. (iteration 3)
- nothing failed. The one inefficiency was ordering: the workflow listing was available in iteration 3's state read, so this pass could have been scheduled earlier. (iteration 4)
- the external-author search returned no definition, so one research action produced only a negative finding; still usable for Q2, but it signals Q2 needs a product decision, not more repo evidence. (iteration 5)
- the first classification attempt was lost to an awk regex error (unescaped `(` in a split pattern) and had to be re-run; the verify pass is slow enough that this wasted a material slice of the iteration. Pre-testing the parser on one captured line would have avoided it. (iteration 6)
- nothing failed. One self-inflicted inefficiency: the advisor sweep invoked `rg -r` (replace) by mistake, muting matched terms to `n` in the displayed output; the hits were still legible — the graph JSON printed in full — so no re-run was needed, but the flag mix-up cost a read cycle. (iteration 7)
- nothing failed. One caution: the first sk-code gate invocation was piped to `tail`, which reports the pipe's exit status — the rerun captured the engine's own exit code to a file. Pipeline exit codes are not evidence; rerun with explicit capture [INFERENCE: from the first command returning EXIT=0 with `tail` as the last pipeline stage]. (iteration 8)
- nothing failed. One output-hygiene slip: the summary line has no trailing newline, so the merged FAIL-line count rendered as "ok=136"/"ok=174"; arithmetic reconciliation (36+1=37, 74+1=75) resolved it, but separated streams would have avoided the reconstruction. (iteration 9)
- nothing failed. Two limits to the evidence: the switch's activation key was not read (behavior verified at :64-72 only), and the verify summary's per-doc counts had to be derived arithmetically (files − ok − skip) because the aggregated groups do not list per-file lines. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "Make `verify` quiet by reconciling the fleet" — explicitly discouraged: the sweep rewrites every in-scope document, buries real changes in noise, and is undone by its own commit [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:135]. Candidate for reducer promotion to Exhausted Approaches; any recommendation that amounts to "run `apply --update` everywhere and commit" is a dead end. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "Make `verify` quiet by reconciling the fleet" — explicitly discouraged: the sweep rewrites every in-scope document, buries real changes in noise, and is undone by its own commit [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:135]. Candidate for reducer promotion to Exhausted Approaches; any recommendation that amounts to "run `apply --update` everywhere and commit" is a dead end.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Make `verify` quiet by reconciling the fleet" — explicitly discouraged: the sweep rewrites every in-scope document, buries real changes in noise, and is undone by its own commit [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:135]. Candidate for reducer promotion to Exhausted Approaches; any recommendation that amounts to "run `apply --update` everywhere and commit" is a dead end.

### "Nothing enforces it" as an accidental oversight — the gate/verify separation and the "What nothing enforces" section are explicit in the standard, so this is a stated boundary, not a gap someone forgot. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "Nothing enforces it" as an accidental oversight — the gate/verify separation and the "What nothing enforces" section are explicit in the standard, so this is a stated boundary, not a gap someone forgot.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Nothing enforces it" as an accidental oversight — the gate/verify separation and the "What nothing enforces" section are explicit in the standard, so this is a stated boundary, not a gap someone forgot.

### **A live fixture probe of the FAIL:missing branch** (a scratch skill tree under `/tmp` fed to `gate --skills-root`). Rejected: it would create files outside the allowed-write list; the direct code citation at :408-410 is sufficient and the branch is unambiguous. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A live fixture probe of the FAIL:missing branch** (a scratch skill tree under `/tmp` fed to `gate --skills-root`). Rejected: it would create files outside the allowed-write list; the direct code citation at :408-410 is sufficient and the branch is unambiguous.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A live fixture probe of the FAIL:missing branch** (a scratch skill tree under `/tmp` fed to `gate --skills-root`). Rejected: it would create files outside the allowed-write list; the direct code citation at :408-410 is sufficient and the branch is unambiguous.

### **An automated writer hiding in hooks/CI.** Searched `.github/`, `.skilled/hooks/`, `.opencode/scripts/git-hooks/` for `frontmatter-version`/`check-frontmatter-versions` callers: none exist; every match is documentation, tests, or the engine itself. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **An automated writer hiding in hooks/CI.** Searched `.github/`, `.skilled/hooks/`, `.opencode/scripts/git-hooks/` for `frontmatter-version`/`check-frontmatter-versions` callers: none exist; every match is documentation, tests, or the engine itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An automated writer hiding in hooks/CI.** Searched `.github/`, `.skilled/hooks/`, `.opencode/scripts/git-hooks/` for `frontmatter-version`/`check-frontmatter-versions` callers: none exist; every match is documentation, tests, or the engine itself.

### **An external meaning for `W` or `Z`.** `W` needs repository git history that cannot travel in the package [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:70-101]; `Z` has no producer or consumer by design [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:50]. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **An external meaning for `W` or `Z`.** `W` needs repository git history that cannot travel in the package [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:70-101]; `Z` has no producer or consumer by design [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:50].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An external meaning for `W` or `Z`.** `W` needs repository git history that cannot travel in the package [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:70-101]; `Z` has no producer or consumer by design [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:50].

### **CI script tests as a doc-version check.** The suite runs the engine against fixtures in gate/apply modes [SOURCE: .opencode/skills/sk-doc/scripts/tests/test_validation_switch.py:183]; it never inspects real repository documents, so it cannot fail on a stored version and does not close the enforcement gap. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **CI script tests as a doc-version check.** The suite runs the engine against fixtures in gate/apply modes [SOURCE: .opencode/skills/sk-doc/scripts/tests/test_validation_switch.py:183]; it never inspects real repository documents, so it cannot fail on a stored version and does not close the enforcement gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **CI script tests as a doc-version check.** The suite runs the engine against fixtures in gate/apply modes [SOURCE: .opencode/skills/sk-doc/scripts/tests/test_validation_switch.py:183]; it never inspects real repository documents, so it cannot fail on a stored version and does not close the enforcement gap.

### **Enforced per-doc era parity:** would flag 574 docs today; going green requires the fleet-wide sweep the standard explicitly discourages [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136]. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Enforced per-doc era parity:** would flag 574 docs today; going green requires the fleet-wide sweep the standard explicitly discourages [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Enforced per-doc era parity:** would flag 574 docs today; going green requires the fleet-wide sweep the standard explicitly discourages [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136].

### **Live edit probe of the post-edit hook.** Would mutate a read-only researched file, outside the research boundary; executing the router-pinned wrapper is the strongest permissible strengthening step. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Live edit probe of the post-edit hook.** Would mutate a read-only researched file, outside the research boundary; executing the router-pinned wrapper is the strongest permissible strengthening step.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Live edit probe of the post-edit hook.** Would mutate a read-only researched file, outside the research boundary; executing the router-pinned wrapper is the strongest permissible strengthening step.

### **Package-time validators as an automated enforcement surface.** Nothing under `.opencode/scripts/git-hooks/`, `.skilled/hooks/` or `.github/workflows/` references `package_skill.py`/`quick_validate.py`; they are command-run only. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Package-time validators as an automated enforcement surface.** Nothing under `.opencode/scripts/git-hooks/`, `.skilled/hooks/` or `.github/workflows/` references `package_skill.py`/`quick_validate.py`; they are command-run only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Package-time validators as an automated enforcement surface.** Nothing under `.opencode/scripts/git-hooks/`, `.skilled/hooks/` or `.github/workflows/` references `package_skill.py`/`quick_validate.py`; they are command-run only.

### **Re-deriving the 713 / 574 classification.** That measurement belongs to iteration 6's scope and its arithmetic was not challenged by new evidence; the useful new check was the scope denominator (Finding 2), which held. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Re-deriving the 713 / 574 classification.** That measurement belongs to iteration 6's scope and its arithmetic was not challenged by new evidence; the useful new check was the scope denominator (Finding 2), which held.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-deriving the 713 / 574 classification.** That measurement belongs to iteration 6's scope and its arithmetic was not challenged by new evidence; the useful new check was the scope denominator (Finding 2), which held.

### **Re-running gate/verify on the three already-measured skills.** Covered by iteration 8 (gate) and iteration 1 (verify); this pass extended breadth to previously unmeasured skills instead. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Re-running gate/verify on the three already-measured skills.** Covered by iteration 8 (gate) and iteration 1 (verify); this pass extended breadth to previously unmeasured skills instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-running gate/verify on the three already-measured skills.** Covered by iteration 8 (gate) and iteration 1 (verify); this pass extended breadth to previously unmeasured skills instead.

### **Re-running the fleet gate.** Already executed green across 14/14 dirs in iterations 8-9 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-009.md:19]; this pass extended verify breadth instead. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Re-running the fleet gate.** Already executed green across 14/14 dirs in iterations 8-9 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-009.md:19]; this pass extended verify breadth instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-running the fleet gate.** Already executed green across 14/14 dirs in iterations 8-9 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-009.md:19]; this pass extended verify breadth instead.

### **Re-running the Q5 inventory as fresh ground.** Iteration 3 already consolidated Q5; this pass's value was adversarial re-verification plus the two uncited CI wiring surfaces. Repeating the inventory itself would add no new evidence. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Re-running the Q5 inventory as fresh ground.** Iteration 3 already consolidated Q5; this pass's value was adversarial re-verification plus the two uncited CI wiring surfaces. Repeating the inventory itself would add no new evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-running the Q5 inventory as fresh ground.** Iteration 3 already consolidated Q5; this pass's value was adversarial re-verification plus the two uncited CI wiring surfaces. Repeating the inventory itself would add no new evidence.

### **Re-running the Q5 inventory as fresh ground.** Q5 was consolidated and adversarially re-verified in iterations 3-4; re-running it is BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:144-147]. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Re-running the Q5 inventory as fresh ground.** Q5 was consolidated and adversarially re-verified in iterations 3-4; re-running it is BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:144-147].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-running the Q5 inventory as fresh ground.** Q5 was consolidated and adversarially re-verified in iterations 3-4; re-running it is BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:144-147].

### **Re-searching for an in-repo definition of "external author".** Iteration 5's search of sk-doc and system-spec-kit returned no definition [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-005.md:29]; iteration 6 recommended the surface-enumeration path instead [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:79], and that path closed the question this iteration. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Re-searching for an in-repo definition of "external author".** Iteration 5's search of sk-doc and system-spec-kit returned no definition [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-005.md:29]; iteration 6 recommended the surface-enumeration path instead [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:79], and that path closed the question this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-searching for an in-repo definition of "external author".** Iteration 5's search of sk-doc and system-spec-kit returned no definition [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-005.md:29]; iteration 6 recommended the surface-enumeration path instead [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:79], and that path closed the question this iteration.

### **Status-quo retention of the asserted 4-part per-doc version:** non-convergent by construction — writing `W` changes `W` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-104] — and measured today at 713 mismatches, 80.5% era staleness (Actions §3). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Status-quo retention of the asserted 4-part per-doc version:** non-convergent by construction — writing `W` changes `W` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-104] — and measured today at 713 mismatches, 80.5% era staleness (Actions §3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Status-quo retention of the asserted 4-part per-doc version:** non-convergent by construction — writing `W` changes `W` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-104] — and measured today at 713 mismatches, 80.5% era staleness (Actions §3).

### **Stored git-derived W with a better reconciliation workflow.** Any commit that changes the file's numstat count makes the stored value stale by definition [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-104]; the two-pass amend flow amortizes the ceremony per commit but never removes it [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:106-113]. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Stored git-derived W with a better reconciliation workflow.** Any commit that changes the file's numstat count makes the stored value stale by definition [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-104]; the two-pass amend flow amortizes the ceremony per commit but never removes it [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:106-113].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stored git-derived W with a better reconciliation workflow.** Any commit that changes the file's numstat count makes the stored value stale by definition [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-104]; the two-pass amend flow amortizes the ceremony per commit but never removes it [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:106-113].

### **The CI coverage guard as a version checker.** Its header contract lists five fields and `version` is not among them [SOURCE: .opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh:7-8]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The CI coverage guard as a version checker.** Its header contract lists five fields and `version` is not among them [SOURCE: .opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh:7-8].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The CI coverage guard as a version checker.** Its header contract lists five fields and `version` is not among them [SOURCE: .opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh:7-8].

### **The engine pair as two drift-prone copies.** `readlink` resolves `scripts/frontmatter-version.mjs` to `../shared/scripts/frontmatter-version.mjs`; one physical file, one update surface. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The engine pair as two drift-prone copies.** `readlink` resolves `scripts/frontmatter-version.mjs` to `../shared/scripts/frontmatter-version.mjs`; one physical file, one update surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The engine pair as two drift-prone copies.** `readlink` resolves `scripts/frontmatter-version.mjs` to `../shared/scripts/frontmatter-version.mjs`; one physical file, one update surface.

### **The engine's `.mjs` tests as a wired CI check.** The CI harness globs `test_*.py` only; the `.mjs` suite is unreferenced by any workflow. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The engine's `.mjs` tests as a wired CI check.** The CI harness globs `test_*.py` only; the `.mjs` suite is unreferenced by any workflow.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The engine's `.mjs` tests as a wired CI check.** The CI harness globs `test_*.py` only; the `.mjs` suite is unreferenced by any workflow.

### **Treating the changelog divergence as a live failure.** Measured: 68/68 entries versioned (Finding 5); the divergence is a coverage gap for the fix phase, not a current flag. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Treating the changelog divergence as a live failure.** Measured: 68/68 entries versioned (Finding 5); the divergence is a coverage gap for the fix phase, not a current flag.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the changelog divergence as a live failure.** Measured: 68/68 entries versioned (Finding 5); the divergence is a coverage gap for the fix phase, not a current flag.

### **Wiring verify into CI to force fleet reconciliation.** Re-enters the explicitly documented fleet-sweep dead end [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136] and adds a pipeline where the smallest contract calls for a deletion. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Wiring verify into CI to force fleet reconciliation.** Re-enters the explicitly documented fleet-sweep dead end [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136] and adds a pipeline where the smallest contract calls for a deletion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Wiring verify into CI to force fleet reconciliation.** Re-enters the explicitly documented fleet-sweep dead end [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136] and adds a pipeline where the smallest contract calls for a deletion.

### `verify` exit 1 as an engine bug — the engine's comparison matches its documented rule, and the spot-check arithmetic supports the derivation. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `verify` exit 1 as an engine bug — the engine's comparison matches its documented rule, and the spot-check arithmetic supports the derivation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `verify` exit 1 as an engine bug — the engine's comparison matches its documented rule, and the spot-check arithmetic supports the derivation.

### Git-derived precision as a stored invariant: structurally non-convergent. New elimination candidate for the reducer to promote to strategy "Exhausted Approaches". -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Git-derived precision as a stored invariant: structurally non-convergent. New elimination candidate for the reducer to promote to strategy "Exhausted Approaches".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Git-derived precision as a stored invariant: structurally non-convergent. New elimination candidate for the reducer to promote to strategy "Exhausted Approaches".

### New elimination candidate for the reducer: **"Retain the per-doc field asserting era parity"** — its measured cost equals the discouraged reconciliation [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136]. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: New elimination candidate for the reducer: **"Retain the per-doc field asserting era parity"** — its measured cost equals the discouraged reconciliation [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New elimination candidate for the reducer: **"Retain the per-doc field asserting era parity"** — its measured cost equals the discouraged reconciliation [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136].

### New elimination candidate for the reducer: **"the gate silently stops enforcing after one edit per skill"** — dedupe is per checking row label (`frontmatter:<skillName>`) within a session [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:210], but each edit to an in-scope doc recomputes scope, so a regression introduced by a different file in a later edit session still fires on the next such edit. Not a dead end; recorded as an operational caveat for the fix phase. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: New elimination candidate for the reducer: **"the gate silently stops enforcing after one edit per skill"** — dedupe is per checking row label (`frontmatter:<skillName>`) within a session [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:210], but each edit to an in-scope doc recomputes scope, so a regression introduced by a different file in a later edit session still fires on the next such edit. Not a dead end; recorded as an operational caveat for the fix phase.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New elimination candidate for the reducer: **"the gate silently stops enforcing after one edit per skill"** — dedupe is per checking row label (`frontmatter:<skillName>`) within a session [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:210], but each edit to an in-scope doc recomputes scope, so a regression introduced by a different file in a later edit session still fires on the next such edit. Not a dead end; recorded as an operational caveat for the fix phase.

### No new elimination candidate beyond the two above; the divergence in Finding 3 is a fix-phase item, not a dead end. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No new elimination candidate beyond the two above; the divergence in Finding 3 is a fix-phase item, not a dead end.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new elimination candidate beyond the two above; the divergence in Finding 3 is a fix-phase item, not a dead end.

### No new elimination candidate: the underscore-form scope asymmetry is latent (0 instances) and recorded as a fix-phase caveat, not eliminated. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No new elimination candidate: the underscore-form scope asymmetry is latent (0 instances) and recorded as a fix-phase caveat, not eliminated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new elimination candidate: the underscore-form scope asymmetry is latent (0 instances) and recorded as a fix-phase caveat, not eliminated.

### No new elimination candidate. The validation-switch escape hatch is an operational caveat, not a dead end. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No new elimination candidate. The validation-switch escape hatch is an operational caveat, not a dead end.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new elimination candidate. The validation-switch escape hatch is an operational caveat, not a dead end.

### None newly eliminated for the Q5 focus. The iteration-2 `.mjs`-suite claim is refined, not reversed: `test-frontmatter-version.mjs` remains unrun by any workflow, while a sibling Python test does invoke the engine in CI. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: None newly eliminated for the Q5 focus. The iteration-2 `.mjs`-suite claim is refined, not reversed: `test-frontmatter-version.mjs` remains unrun by any workflow, while a sibling Python test does invoke the engine in CI.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None newly eliminated for the Q5 focus. The iteration-2 `.mjs`-suite claim is refined, not reversed: `test-frontmatter-version.mjs` remains unrun by any workflow, while a sibling Python test does invoke the engine in CI.

### None newly eliminated. All iteration 1-2 dead ends remain BLOCKED and were not retried. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None newly eliminated. All iteration 1-2 dead ends remain BLOCKED and were not retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None newly eliminated. All iteration 1-2 dead ends remain BLOCKED and were not retried.

### None newly eliminated. The iteration-1 dead ends (fleet reconcile via `apply --update`; "nothing enforces it" as oversight; engine bug; broken numstat counter) all remain outside this focus and were not retried. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: None newly eliminated. The iteration-1 dead ends (fleet reconcile via `apply --update`; "nothing enforces it" as oversight; engine bug; broken numstat counter) all remain outside this focus and were not retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None newly eliminated. The iteration-1 dead ends (fleet reconcile via `apply --update`; "nothing enforces it" as oversight; engine bug; broken numstat counter) all remain outside this focus and were not retried.

### None of iterations 1-5's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:120-212]. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: None of iterations 1-5's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:120-212].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None of iterations 1-5's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:120-212].

### None of iterations 1-6's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:120-212]. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: None of iterations 1-6's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:120-212].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None of iterations 1-6's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:120-212].

### None of iterations 1-7's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:127-258]. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: None of iterations 1-7's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:127-258].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None of iterations 1-7's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:127-258].

### None of iterations 1-8's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:128-280]. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: None of iterations 1-8's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:128-280].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None of iterations 1-8's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:128-280].

### None of iterations 1-9's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:131-302]. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: None of iterations 1-9's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:131-302].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None of iterations 1-9's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:131-302].

### The numstat edit counter as silently broken — 28 path-commits resolve to an expected `W=26`, consistent with zero-line/rename commits being discarded as documented. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The numstat edit counter as silently broken — 28 path-commits resolve to an expected `W=26`, consistent with zero-line/rename commits being discarded as documented.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The numstat edit counter as silently broken — 28 path-commits resolve to an expected `W=26`, consistent with zero-line/rename commits being discarded as documented.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- "Make `verify` quiet by reconciling the fleet" — explicitly discouraged: the sweep rewrites every in-scope document, buries real changes in noise, and is undone by its own commit [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:135]. Candidate for reducer promotion to Exhausted Approaches; any recommendation that amounts to "run `apply --update` everywhere and commit" is a dead end. (iteration 1)
- "Nothing enforces it" as an accidental oversight — the gate/verify separation and the "What nothing enforces" section are explicit in the standard, so this is a stated boundary, not a gap someone forgot. (iteration 1)
- `verify` exit 1 as an engine bug — the engine's comparison matches its documented rule, and the spot-check arithmetic supports the derivation. (iteration 1)
- The numstat edit counter as silently broken — 28 path-commits resolve to an expected `W=26`, consistent with zero-line/rename commits being discarded as documented. (iteration 1)
- **An automated writer hiding in hooks/CI.** Searched `.github/`, `.skilled/hooks/`, `.opencode/scripts/git-hooks/` for `frontmatter-version`/`check-frontmatter-versions` callers: none exist; every match is documentation, tests, or the engine itself. (iteration 2)
- **The CI coverage guard as a version checker.** Its header contract lists five fields and `version` is not among them [SOURCE: .opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh:7-8]. (iteration 2)
- **The engine's `.mjs` tests as a wired CI check.** The CI harness globs `test_*.py` only; the `.mjs` suite is unreferenced by any workflow. (iteration 2)
- None newly eliminated. The iteration-1 dead ends (fleet reconcile via `apply --update`; "nothing enforces it" as oversight; engine bug; broken numstat counter) all remain outside this focus and were not retried. (iteration 2)
- **Package-time validators as an automated enforcement surface.** Nothing under `.opencode/scripts/git-hooks/`, `.skilled/hooks/` or `.github/workflows/` references `package_skill.py`/`quick_validate.py`; they are command-run only. (iteration 3)
- **The engine pair as two drift-prone copies.** `readlink` resolves `scripts/frontmatter-version.mjs` to `../shared/scripts/frontmatter-version.mjs`; one physical file, one update surface. (iteration 3)
- None newly eliminated. All iteration 1-2 dead ends remain BLOCKED and were not retried. (iteration 3)
- **CI script tests as a doc-version check.** The suite runs the engine against fixtures in gate/apply modes [SOURCE: .opencode/skills/sk-doc/scripts/tests/test_validation_switch.py:183]; it never inspects real repository documents, so it cannot fail on a stored version and does not close the enforcement gap. (iteration 4)
- **Re-running the Q5 inventory as fresh ground.** Iteration 3 already consolidated Q5; this pass's value was adversarial re-verification plus the two uncited CI wiring surfaces. Repeating the inventory itself would add no new evidence. (iteration 4)
- None newly eliminated for the Q5 focus. The iteration-2 `.mjs`-suite claim is refined, not reversed: `test-frontmatter-version.mjs` remains unrun by any workflow, while a sibling Python test does invoke the engine in CI. (iteration 4)
- **Re-running the Q5 inventory as fresh ground.** Q5 was consolidated and adversarially re-verified in iterations 3-4; re-running it is BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:144-147]. (iteration 5)
- **Stored git-derived W with a better reconciliation workflow.** Any commit that changes the file's numstat count makes the stored value stale by definition [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-104]; the two-pass amend flow amortizes the ceremony per commit but never removes it [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:106-113]. (iteration 5)
- **Wiring verify into CI to force fleet reconciliation.** Re-enters the explicitly documented fleet-sweep dead end [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136] and adds a pipeline where the smallest contract calls for a deletion. (iteration 5)
- Git-derived precision as a stored invariant: structurally non-convergent. New elimination candidate for the reducer to promote to strategy "Exhausted Approaches". (iteration 5)
- **Enforced per-doc era parity:** would flag 574 docs today; going green requires the fleet-wide sweep the standard explicitly discourages [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136]. (iteration 6)
- **Status-quo retention of the asserted 4-part per-doc version:** non-convergent by construction — writing `W` changes `W` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-104] — and measured today at 713 mismatches, 80.5% era staleness (Actions §3). (iteration 6)
- New elimination candidate for the reducer: **"Retain the per-doc field asserting era parity"** — its measured cost equals the discouraged reconciliation [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136]. (iteration 6)
- None of iterations 1-5's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:120-212]. (iteration 6)
- **An external meaning for `W` or `Z`.** `W` needs repository git history that cannot travel in the package [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:70-101]; `Z` has no producer or consumer by design [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:50]. (iteration 7)
- **Re-searching for an in-repo definition of "external author".** Iteration 5's search of sk-doc and system-spec-kit returned no definition [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-005.md:29]; iteration 6 recommended the surface-enumeration path instead [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:79], and that path closed the question this iteration. (iteration 7)
- No new elimination candidate beyond the two above; the divergence in Finding 3 is a fix-phase item, not a dead end. (iteration 7)
- None of iterations 1-6's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:120-212]. (iteration 7)
- **Re-deriving the 713 / 574 classification.** That measurement belongs to iteration 6's scope and its arithmetic was not challenged by new evidence; the useful new check was the scope denominator (Finding 2), which held. (iteration 8)
- **Treating the changelog divergence as a live failure.** Measured: 68/68 entries versioned (Finding 5); the divergence is a coverage gap for the fix phase, not a current flag. (iteration 8)
- New elimination candidate for the reducer: **"the gate silently stops enforcing after one edit per skill"** — dedupe is per checking row label (`frontmatter:<skillName>`) within a session [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:210], but each edit to an in-scope doc recomputes scope, so a regression introduced by a different file in a later edit session still fires on the next such edit. Not a dead end; recorded as an operational caveat for the fix phase. (iteration 8)
- None of iterations 1-7's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:127-258]. (iteration 8)
- **Live edit probe of the post-edit hook.** Would mutate a read-only researched file, outside the research boundary; executing the router-pinned wrapper is the strongest permissible strengthening step. (iteration 9)
- **Re-running gate/verify on the three already-measured skills.** Covered by iteration 8 (gate) and iteration 1 (verify); this pass extended breadth to previously unmeasured skills instead. (iteration 9)
- No new elimination candidate: the underscore-form scope asymmetry is latent (0 instances) and recorded as a fix-phase caveat, not eliminated. (iteration 9)
- None of iterations 1-8's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:128-280]. (iteration 9)
- **A live fixture probe of the FAIL:missing branch** (a scratch skill tree under `/tmp` fed to `gate --skills-root`). Rejected: it would create files outside the allowed-write list; the direct code citation at :408-410 is sufficient and the branch is unambiguous. (iteration 10)
- **Re-running the fleet gate.** Already executed green across 14/14 dirs in iterations 8-9 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-009.md:19]; this pass extended verify breadth instead. (iteration 10)
- No new elimination candidate. The validation-switch escape hatch is an operational caveat, not a dead end. (iteration 10)
- None of iterations 1-9's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:131-302]. (iteration 10)

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
- Q4: Should the per-doc version exist at all? (iteration 1)
- Q5: Which hooks, generators or CI steps write or check a doc version today, if any? (evidence partially gathered this iteration: post-edit hook gate, package-time validators, separate CI coverage guard; nothing runs verify/apply — to be consolidated under Q5 rather than claimed answered here.) (iteration 1)
- Q2: What should doc versions mean for an external author? (iteration 1)
- Q3: What is the smallest contract that stays green by construction? (iteration 1)
- Q2: What should doc versions mean for an external author? (partial: the era-only reading is recorded; blocked on a definition of "external author") (iteration 5)
- Q4: Should the per-doc version exist at all? (deferred; bounded by this iteration's contract shape) (iteration 5)
- Q2: What should doc versions mean for an external author? (partial: the era-only reading is recorded; the definition of "external author" is still outstanding) (iteration 6)
- None at the key-question level: Q1-Q5 are all resolved (Q1, Q3-Q5 in earlier iterations [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:63-67], Q4 in iteration 6, Q2 here). Iterations 8-10 remain under the max-iterations stop policy; the productive direction is consolidation, not new questions. (iteration 7)
- None at the key-question level. Iterations 9-10 remain under the max-iterations stop policy; the productive direction is the single decision record (see Recommended Next Focus). (iteration 8)
- None at the key-question level. Iteration 10 remains under the max-iterations stop policy; the productive direction is the single decision record (see Recommended Next Focus). (iteration 9)
- None. This is the terminal iteration (max-iterations stop policy); the consolidation is complete. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Packet spec.md reports verify flagging 340 files in sk-code, 320 in sk-doc and 115 in system-skill-advisor, mostly stored-vs-derived 4-part version mismatches. No handover.md; implementation-summary continuity is a scaffold.

Resource map: resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs`; `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md`.
- Reuse candidates: git hooks under `.skilled/` and `.githooks/`, CI workflows under `.github/workflows/`, any generator that rewrites frontmatter.
- Integration points: frontmatter `version:` fields in skill docs (sk-code, sk-doc, system-skill-advisor).
- Constraints and risks: read-only research; writes only under this packet's research/ folder.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10 (stop policy: max-iterations)
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
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
- Started: 2026-10-11T16:24:08Z
