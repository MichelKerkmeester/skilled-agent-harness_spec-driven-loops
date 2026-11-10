# Deep Research Strategy - v4.0.1.0 rules refresh

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
Check whether anything shipped in the Skilled v4.0.1.0 release means AGENTS.md (repo root, which CLAUDE.md mirrors), REPO RULES.md or the rule files under .skilled/repo-rules/ need updating or refining. Source of what changed: .skilled/changelog/skilled/v4.0.1.0.md, the per-skill changelog entries it names, and git log v4.0.0.0..v4.0.1.0 (or the commit range those tags cover). For each change, ask: does a gate, law, rule, trigger-table row, path, command name, skill or mode name, script path or workflow in AGENTS.md or a repo rule now point at something renamed, removed, added or behaving differently; is there a new mandatory behavior the rules should state; is any rule now redundant with something a tool now enforces. Check every path and command the rules cite still exists. Report gaps as findings ranked by impact, each with the exact file:line in AGENTS.md or the rule file, the v4.0.1.0 change that causes it (file:line or commit), and the proposed one-line edit. Say plainly when nothing needs to change. Read-only: write only under the spec folder. Cite file:line for every finding.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What did v4.0.1.0 rename, remove, retire or add (skills, modes, commands, scripts, paths), per .skilled/changelog/skilled/v4.0.1.0.md, the per-skill changelogs it names and the git range?
- [x] Which paths, commands, skills, modes and scripts cited in AGENTS.md no longer exist or now point at something renamed or behaving differently?
- [x] Which paths, commands and rule files cited in REPO RULES.md and the 13 rule files under .skilled/repo-rules/ no longer exist or are stale after v4.0.1.0?
- [x] Does v4.0.1.0 add a mandatory behavior (for example ROUTER.md per skill, doctor commands, decision capture of operator answers, render checks, doc rewrite guard) that AGENTS.md or a repo rule should state?
- [x] Is any rule in AGENTS.md or the repo rules now redundant with something a v4.0.1.0 tool or hook enforces?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing AGENTS.md, CLAUDE.md, REPO RULES.md or any repo rule (research only; write only under the spec folder).
- Auditing changes outside the v4.0.0.0..v4.0.1.0 range.
- Rewording rules for style when nothing in v4.0.1.0 makes them wrong.

---

## 5. STOP CONDITIONS
- Fixed depth: run all 5 iterations (stop policy max-iterations).
- A quota or auth stop from the executor halts the run; no model or provider switch.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What did v4.0.1.0 rename, remove, retire or add (skills, modes, commands, scripts, paths), per .skilled/changelog/skilled/v4.0.1.0.md, the per-skill changelogs it names and the git range?
- Which paths, commands, skills, modes and scripts cited in AGENTS.md no longer exist or now point at something renamed or behaving differently?
- Which paths, commands and rule files cited in REPO RULES.md and the 13 rule files under .skilled/repo-rules/ no longer exist or are stale after v4.0.1.0?
- Does v4.0.1.0 add a mandatory behavior (for example ROUTER.md per skill, doctor commands, decision capture of operator answers, render checks, doc rewrite guard) that AGENTS.md or a repo rule should state?
- Is any rule in AGENTS.md or the repo rules now redundant with something a v4.0.1.0 tool or hook enforces?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- batching the existence probes into one shell loop, and extracting section anchors with `rg '^## '` instead of reading eleven files, made a 20-path plus 11-anchor citation audit cheap enough to finish inside one iteration. The `git diff --stat` against the four rule surfaces was the highest-value call of the run: it turned "audit everything" into "audit what the range did not already fix", and it is what exposed `f-iter001-001`. (iteration 1)
- doing the link and anchor audit in Python rather than shell closed 51 false positives in one call and turned a "the rule layer is broken" story into the correct one. The second thing that worked was testing the rule's gate claims against the gate itself: the question "is this rule now redundant" has a factual answer only if you read what the checker asserts, and `parent-skill-check.cjs:2233`'s header comment answers it in four lines. (iteration 2)
- reading the checker's *failure branch* instead of only its detail string. The detail said "16368 of 16384"; the branch said what would fail and that one phrase in the repository block silences it. That single read turned a cosmetic observation into a finding with an edit consequence and a footgun warning. The second thing that worked was computing the byte delta before recommending the edit, which is what caught that even the minimal rename breaks the budget. (iteration 3)
- following one variable to its producer. The whole of `f-iter004-001` came from asking "where does `output` come from" before accepting what `own` was asserted to mean — one line, `:450`, inverted the reading of the guard at `:480`. The second thing that worked was measuring the cheap candidate. Iteration 3 asked whether a *long* wording fits and concluded about all wordings; measuring the 89-byte form took one arithmetic pass and reversed the conclusion, which also dissolved the compensating-trim follow-up it had created. (iteration 4)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first advisor check grepped two guessed paths that do not exist, produced zero hits, and nearly became a P1 false finding that `AGENTS.md:67` was stale. The root cause is searching for a claimed symbol in an assumed location rather than in its declared contract. (iteration 1)
- the `realpath` probe. Root cause is trusting a coreutils binary that macOS does not ship, and not sanity-checking a 51-line failure list against a single link whose target I could see. A probe that fails almost everywhere is a broken probe, not a broken repository. (iteration 2)
- nothing failed this iteration. The one correction to method is earlier: iteration 1 proposed a one-line edit without checking whether the file it edits is byte-budgeted. The root cause is treating an `AGENTS.md` edit as prose editing when v4.0.1.0 made it a composition against a manifest. (iteration 3)
- nothing failed outright this iteration. The method failure being corrected is prior: iteration 3 read a correct line and inferred the wrong data flow, because it read the predicate without reading the variable's origin. A citation that resolves is not the same as a citation that is understood — `validate.sh` will happily confirm `:480` exists while the claim about it is backwards. (iteration 4)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **"`system-spec-kit` SKILL.md §3" may have lost its content to the router move.** It did not; §3 keeps "Retrieval and Continuity", "Reranking" and the declared-loss sentence. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"`system-spec-kit` SKILL.md §3" may have lost its content to the router move.** It did not; §3 keeps "Retrieval and Continuity", "Reranking" and the declared-loss sentence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"`system-spec-kit` SKILL.md §3" may have lost its content to the router move.** It did not; §3 keeps "Retrieval and Continuity", "Reranking" and the declared-loss sentence.

### **"A backticked token missing as a repo path is a vanished citation."** `@juicesharp/rpiv-ask-user-question` -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **"A backticked token missing as a repo path is a vanished citation."** `@juicesharp/rpiv-ask-user-question`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"A backticked token missing as a repo path is a vanished citation."** `@juicesharp/rpiv-ask-user-question`

### **"The `.codex/config.toml` change staled the `communication-handoff.md` Codex row."** `fa2f8321f8` -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **"The `.codex/config.toml` change staled the `communication-handoff.md` Codex row."** `fa2f8321f8`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The `.codex/config.toml` change staled the `communication-handoff.md` Codex row."** `fa2f8321f8`

### **"The range touched a third rule-layer surface that iterations 1-4 missed."** The touch set is -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **"The range touched a third rule-layer surface that iterations 1-4 missed."** The touch set is
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The range touched a third rule-layer surface that iterations 1-4 missed."** The touch set is

### **"The seven named gate scripts changed behavior in this release."** All seven return zero commits -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **"The seven named gate scripts changed behavior in this release."** All seven return zero commits
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The seven named gate scripts changed behavior in this release."** All seven return zero commits

### **"The sibling packets' deferrals hand work to `AGENTS.md` or the repo rules."** Both name only -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **"The sibling packets' deferrals hand work to `AGENTS.md` or the repo rules."** Both name only
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The sibling packets' deferrals hand work to `AGENTS.md` or the repo rules."** Both name only

### **`/doctor:install` and `/doctor:symlink` need a rule because they mutate a project.** No: the commands own their own plan-then-yes discipline, `blast-radius.md` governs any install, and `AGENTS.md:289` already delegates the inventory. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`/doctor:install` and `/doctor:symlink` need a rule because they mutate a project.** No: the commands own their own plan-then-yes discipline, `blast-radius.md` governs any install, and `AGENTS.md:289` already delegates the inventory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`/doctor:install` and `/doctor:symlink` need a rule because they mutate a project.** No: the commands own their own plan-then-yes discipline, `blast-radius.md` governs any install, and `AGENTS.md:289` already delegates the inventory.

### **`## MACHINE ROUTER` in `skill-hub-routing.md:61` is stale because real headings are numbered (`## 3. MACHINE ROUTER`).** Not stale. `package_skill.py` extracts heading titles and compares `title == 'MACHINE ROUTER'`, so the number prefix is stripped before comparison [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1174], and its diagnostics print the unnumbered form the rule uses [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1420]. The rule quotes the heading title, which is the stable identifier. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`## MACHINE ROUTER` in `skill-hub-routing.md:61` is stale because real headings are numbered (`## 3. MACHINE ROUTER`).** Not stale. `package_skill.py` extracts heading titles and compares `title == 'MACHINE ROUTER'`, so the number prefix is stripped before comparison [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1174], and its diagnostics print the unnumbered form the rule uses [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1420]. The rule quotes the heading title, which is the stable identifier.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`## MACHINE ROUTER` in `skill-hub-routing.md:61` is stale because real headings are numbered (`## 3. MACHINE ROUTER`).** Not stale. `package_skill.py` extracts heading titles and compares `title == 'MACHINE ROUTER'`, so the number prefix is stripped before comparison [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1174], and its diagnostics print the unnumbered form the rule uses [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1420]. The rule quotes the heading title, which is the stable identifier.

### **`advisor_recommend` looked removed.** `.skilled/agents/code.md` and `.skilled/skills/README.txt` both show the verb `l`, which reads as a rename. The frozen contract settles it the other way: nine commands, each accepting snake, kebab and camel spellings, `advisor_recommend` first in the table [SOURCE: .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:47], and the built CLI contains seven occurrences. `AGENTS.md:67` is correct and `l` is a separate short id. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`advisor_recommend` looked removed.** `.skilled/agents/code.md` and `.skilled/skills/README.txt` both show the verb `l`, which reads as a rename. The frozen contract settles it the other way: nine commands, each accepting snake, kebab and camel spellings, `advisor_recommend` first in the table [SOURCE: .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:47], and the built CLI contains seven occurrences. `AGENTS.md:67` is correct and `l` is a separate short id.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`advisor_recommend` looked removed.** `.skilled/agents/code.md` and `.skilled/skills/README.txt` both show the verb `l`, which reads as a rename. The frozen contract settles it the other way: nine commands, each accepting snake, kebab and camel spellings, `advisor_recommend` first in the table [SOURCE: .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:47], and the built CLI contains seven occurrences. `AGENTS.md:67` is correct and `l` is a separate short id.

### **`AGENTS.md:70`'s proposal is simply wrong.** No: it is substantively right and self-consistent with Gate 5 and the advisor. Only the `one line` parenthetical and the byte budget need correcting. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`AGENTS.md:70`'s proposal is simply wrong.** No: it is substantively right and self-consistent with Gate 5 and the advisor. Only the `one line` parenthetical and the byte budget need correcting.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`AGENTS.md:70`'s proposal is simply wrong.** No: it is substantively right and self-consistent with Gate 5 and the advisor. Only the `one line` parenthetical and the byte budget need correcting.

### **`parent-skills-nested-packets.md` §1-2 did not actually carry the `routingClass` table or the `ROUTER.md` locations.** It does: table at line 132, stage-two file table at 42-55, canonical sentence at 79. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`parent-skills-nested-packets.md` §1-2 did not actually carry the `routingClass` table or the `ROUTER.md` locations.** It does: table at line 132, stage-two file table at 42-55, canonical sentence at 79.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`parent-skills-nested-packets.md` §1-2 did not actually carry the `routingClass` table or the `ROUTER.md` locations.** It does: table at line 132, stage-two file table at 42-55, canonical sentence at 79.

### **`sk-create-goal`'s `references/budget-and-handoff.md` may have moved under `sk-doc`.** It sits at `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md`; `AGENTS.md:155` cites it by skill name, not by path, so the extra folder does not stale the citation. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`sk-create-goal`'s `references/budget-and-handoff.md` may have moved under `sk-doc`.** It sits at `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md`; `AGENTS.md:155` cites it by skill name, not by path, so the extra folder does not stale the citation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`sk-create-goal`'s `references/budget-and-handoff.md` may have moved under `sk-doc`.** It sits at `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md`; `AGENTS.md:155` cites it by skill name, not by path, so the extra folder does not stale the citation.

### **`skill-hub-routing.md:78` should name `RS-002` / `RS-004` / `RS-005`.** Rejected: mechanics in the rule, against `REPO RULES.md:98-101`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`skill-hub-routing.md:78` should name `RS-002` / `RS-004` / `RS-005`.** Rejected: mechanics in the rule, against `REPO RULES.md:98-101`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`skill-hub-routing.md:78` should name `RS-002` / `RS-004` / `RS-005`.** Rejected: mechanics in the rule, against `REPO RULES.md:98-101`.

### **`skill-hub-routing.md` became redundant when the routing shape became gated.** It did not, for the reason in f-iter002-003: shape is not reachability, and the rule's whole point is that distinction. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`skill-hub-routing.md` became redundant when the routing shape became gated.** It did not, for the reason in f-iter002-003: shape is not reachability, and the rule's whole point is that distinction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`skill-hub-routing.md` became redundant when the routing shape became gated.** It did not, for the reason in f-iter002-003: shape is not reachability, and the rule's whole point is that distinction.

### **A `delivery prefix` line in the repository block silences A6.** False. `own` is canary stdout screened for `MISSING:` / `BLOCKED:` `[SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:461-463]`; document prose cannot enter it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A `delivery prefix` line in the repository block silences A6.** False. `own` is canary stdout screened for `MISSING:` / `BLOCKED:` `[SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:461-463]`; document prose cannot enter it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `delivery prefix` line in the repository block silences A6.** False. `own` is canary stdout screened for `MISSING:` / `BLOCKED:` `[SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:461-463]`; document prose cannot enter it.

### **A doc-rewrite-guard rule is missing from `AGENTS.md`.** Rejected: `sk-doc`'s router owns the intent and Gate 2 already routes there. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A doc-rewrite-guard rule is missing from `AGENTS.md`.** Rejected: `sk-doc`'s router owns the intent and Gate 2 already routes there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A doc-rewrite-guard rule is missing from `AGENTS.md`.** Rejected: `sk-doc`'s router owns the intent and Gate 2 already routes there.

### **A rule is needed about which lines an update may overwrite.** No: A7/A8 plus the note line own it; the gap is capacity, not ownership. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A rule is needed about which lines an update may overwrite.** No: A7/A8 plus the note line own it; the gap is capacity, not ownership.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A rule is needed about which lines an update may overwrite.** No: A7/A8 plus the note line own it; the gap is capacity, not ownership.

### **A rule is needed for conversation playbook scenarios.** No: `sk-doc`'s `playbook-conversation` intent already routes the request, and the runner is documented by the skill that ships it [SOURCE: .skilled/skills/sk-doc/ROUTER.md:103]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A rule is needed for conversation playbook scenarios.** No: `sk-doc`'s `playbook-conversation` intent already routes the request, and the runner is documented by the skill that ships it [SOURCE: .skilled/skills/sk-doc/ROUTER.md:103].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A rule is needed for conversation playbook scenarios.** No: `sk-doc`'s `playbook-conversation` intent already routes the request, and the runner is documented by the skill that ships it [SOURCE: .skilled/skills/sk-doc/ROUTER.md:103].

### **A trigger-table row should route to `/doctor:agents-md` or `/doctor:install`.** Rejected: `REPO RULES.md:5-6` and `:18` make the table a rule-file router; the commands already fire rows 42, 44 and 45. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A trigger-table row should route to `/doctor:agents-md` or `/doctor:install`.** Rejected: `REPO RULES.md:5-6` and `:18` make the table a rule-file router; the commands already fire rows 42, 44 and 45.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A trigger-table row should route to `/doctor:agents-md` or `/doctor:install`.** Rejected: `REPO RULES.md:5-6` and `:18` make the table a rule-file router; the commands already fire rows 42, 44 and 45.

### **Measuring only the variants already on the table.** Iteration 3 tested the two wordings it had and concluded about "any version". A budget question has to be answered by measuring the cheapest candidate, not the two most discussed. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Measuring only the variants already on the table.** Iteration 3 tested the two wordings it had and concluded about "any version". A budget question has to be answered by measuring the cheapest candidate, not the two most discussed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Measuring only the variants already on the table.** Iteration 3 tested the two wordings it had and concluded about "any version". A budget question has to be answered by measuring the cheapest candidate, not the two most discussed.

### **No `ROUTER.md`-naming wording fits the budget.** False at the short end: the 89-byte form lands at 16,371, 13 bytes inside. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **No `ROUTER.md`-naming wording fits the budget.** False at the short end: the 89-byte form lands at 16,371, 13 bytes inside.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **No `ROUTER.md`-naming wording fits the budget.** False at the short end: the 89-byte form lands at 16,371, 13 bytes inside.

### **Probing relative links with `realpath` on macOS.** It does not exist there, so the probe silently reports every link as broken. Use `os.path.exists(os.path.normpath(os.path.join(dirname, target)))` from Python instead. Recorded so a later iteration does not spend a call rediscovering it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Probing relative links with `realpath` on macOS.** It does not exist there, so the probe silently reports every link as broken. Use `os.path.exists(os.path.normpath(os.path.join(dirname, target)))` from Python instead. Recorded so a later iteration does not spend a call rediscovering it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Probing relative links with `realpath` on macOS.** It does not exist there, so the probe silently reports every link as broken. Use `os.path.exists(os.path.normpath(os.path.join(dirname, target)))` from Python instead. Recorded so a later iteration does not spend a call rediscovering it.

### **Sweeping the rule files for v4.0.1.0 impact as a first move.** Only two of thirteen files changed in the range — `communication-handoff.md` (4 lines) and `skill-hub-routing.md` (8 lines) — and both changes were themselves router-related. The rules layer is ahead of `AGENTS.md`; a rule sweep on this axis yields nothing until the rules' own internal citations are the target. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Sweeping the rule files for v4.0.1.0 impact as a first move.** Only two of thirteen files changed in the range — `communication-handoff.md` (4 lines) and `skill-hub-routing.md` (8 lines) — and both changes were themselves router-related. The rules layer is ahead of `AGENTS.md`; a rule sweep on this axis yields nothing until the rules' own internal citations are the target.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Sweeping the rule files for v4.0.1.0 impact as a first move.** Only two of thirteen files changed in the range — `communication-handoff.md` (4 lines) and `skill-hub-routing.md` (8 lines) — and both changes were themselves router-related. The rules layer is ahead of `AGENTS.md`; a rule sweep on this axis yields nothing until the rules' own internal citations are the target.

### **The `§4`-before-`§3` order was introduced by the manifest.** No: identical order at `v4.0.0.16`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The `§4`-before-`§3` order was introduced by the manifest.** No: identical order at `v4.0.0.16`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `§4`-before-`§3` order was introduced by the manifest.** No: identical order at `v4.0.0.16`.

### **The canary is silent past the prefix, so A6's fallback is the only signal.** False. The canary emits its own failure containing `delivery prefix` `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:428]`, printed as `MISSING:` `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:440]`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The canary is silent past the prefix, so A6's fallback is the only signal.** False. The canary emits its own failure containing `delivery prefix` `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:428]`, printed as `MISSING:` `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:440]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The canary is silent past the prefix, so A6's fallback is the only signal.** False. The canary emits its own failure containing `delivery prefix` `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:428]`, printed as `MISSING:` `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:440]`.

### **The rule's §7-covers-the-surface-list citation was off by one section.** It is not; §7 is "ADDING A MODE TO AN EXISTING HUB" and holds the 11-row table [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:245]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The rule's §7-covers-the-surface-list citation was off by one section.** It is not; §7 is "ADDING A MODE TO AN EXISTING HUB" and holds the 11-row table [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:245].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The rule's §7-covers-the-surface-list citation was off by one section.** It is not; §7 is "ADDING A MODE TO AN EXISTING HUB" and holds the 11-row table [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:245].

### **The worker-session nudge removal leaves a dangling rule.** No: zero references to a nudge in the rule layer; only an unrelated English use of the word. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The worker-session nudge removal leaves a dangling rule.** No: zero references to a nudge in the rule layer; only an unrelated English use of the word.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The worker-session nudge removal leaves a dangling rule.** No: zero references to a nudge in the rule layer; only an unrelated English use of the word.

### **Treating "the manifest requires a rule about which lines an update may overwrite" as a single question.** It splits into ownership (settled by A7/A8) and capacity (unstated, and load-bearing). Asking it as one question would have produced either a duplicated rule or a missed budget. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Treating "the manifest requires a rule about which lines an update may overwrite" as a single question.** It splits into ownership (settled by A7/A8) and capacity (unstated, and load-bearing). Asking it as one question would have produced either a duplicated rule or a missed budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating "the manifest requires a rule about which lines an update may overwrite" as a single question.** It splits into ownership (settled by A7/A8) and capacity (unstated, and load-bearing). Asking it as one question would have produced either a duplicated rule or a missed budget.

### **Treating `.skilled/changelog/skilled/v4.0.1.0.md:27`'s spec-folder list as the change inventory.** It names nine packets and "smaller packets for the fixes"; the git range covers 458 commits and 33,921 paths, so the list is a pointer, not an inventory. The named-packet approach cannot substitute for the tree probe. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Treating `.skilled/changelog/skilled/v4.0.1.0.md:27`'s spec-folder list as the change inventory.** It names nine packets and "smaller packets for the fixes"; the git range covers 458 commits and 33,921 paths, so the list is a pointer, not an inventory. The named-packet approach cannot substitute for the tree probe.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `.skilled/changelog/skilled/v4.0.1.0.md:27`'s spec-folder list as the change inventory.** It names nine packets and "smaller packets for the fixes"; the git range covers 458 commits and 33,921 paths, so the list is a pointer, not an inventory. The named-packet approach cannot substitute for the tree probe.

### **Treating iteration 3's A6 read as sufficient because it quoted the right file and line.** The citation was correct and the inference from it was inverted — the code was read as parsing the document when it parses a subprocess's stdout. For any row that shells out, the variable's provenance (`output` at `:450`) has to be established before its predicate is interpreted. Recorded because this is the second time in this packet that a correct citation carried a wrong inference. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Treating iteration 3's A6 read as sufficient because it quoted the right file and line.** The citation was correct and the inference from it was inverted — the code was read as parsing the document when it parses a subprocess's stdout. For any row that shells out, the variable's provenance (`output` at `:450`) has to be established before its predicate is interpreted. Recorded because this is the second time in this packet that a correct citation carried a wrong inference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating iteration 3's A6 read as sufficient because it quoted the right file and line.** The citation was correct and the inference from it was inverted — the code was read as parsing the document when it parses a subprocess's stdout. For any row that shells out, the variable's provenance (`output` at `:450`) has to be established before its predicate is interpreted. Recorded because this is the second time in this packet that a correct citation carried a wrong inference.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **"`system-spec-kit` SKILL.md §3" may have lost its content to the router move.** It did not; §3 keeps "Retrieval and Continuity", "Reranking" and the declared-loss sentence. (iteration 1)
- **`advisor_recommend` looked removed.** `.skilled/agents/code.md` and `.skilled/skills/README.txt` both show the verb `l`, which reads as a rename. The frozen contract settles it the other way: nine commands, each accepting snake, kebab and camel spellings, `advisor_recommend` first in the table [SOURCE: .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:47], and the built CLI contains seven occurrences. `AGENTS.md:67` is correct and `l` is a separate short id. (iteration 1)
- **`sk-create-goal`'s `references/budget-and-handoff.md` may have moved under `sk-doc`.** It sits at `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md`; `AGENTS.md:155` cites it by skill name, not by path, so the extra folder does not stale the citation. (iteration 1)
- **A doc-rewrite-guard rule is missing from `AGENTS.md`.** Rejected: `sk-doc`'s router owns the intent and Gate 2 already routes there. (iteration 1)
- **Sweeping the rule files for v4.0.1.0 impact as a first move.** Only two of thirteen files changed in the range — `communication-handoff.md` (4 lines) and `skill-hub-routing.md` (8 lines) — and both changes were themselves router-related. The rules layer is ahead of `AGENTS.md`; a rule sweep on this axis yields nothing until the rules' own internal citations are the target. (iteration 1)
- **Treating `.skilled/changelog/skilled/v4.0.1.0.md:27`'s spec-folder list as the change inventory.** It names nine packets and "smaller packets for the fixes"; the git range covers 458 commits and 33,921 paths, so the list is a pointer, not an inventory. The named-packet approach cannot substitute for the tree probe. (iteration 1)
- **`## MACHINE ROUTER` in `skill-hub-routing.md:61` is stale because real headings are numbered (`## 3. MACHINE ROUTER`).** Not stale. `package_skill.py` extracts heading titles and compares `title == 'MACHINE ROUTER'`, so the number prefix is stripped before comparison [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1174], and its diagnostics print the unnumbered form the rule uses [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1420]. The rule quotes the heading title, which is the stable identifier. (iteration 2)
- **`parent-skills-nested-packets.md` §1-2 did not actually carry the `routingClass` table or the `ROUTER.md` locations.** It does: table at line 132, stage-two file table at 42-55, canonical sentence at 79. (iteration 2)
- **`skill-hub-routing.md` became redundant when the routing shape became gated.** It did not, for the reason in f-iter002-003: shape is not reachability, and the rule's whole point is that distinction. (iteration 2)
- **Probing relative links with `realpath` on macOS.** It does not exist there, so the probe silently reports every link as broken. Use `os.path.exists(os.path.normpath(os.path.join(dirname, target)))` from Python instead. Recorded so a later iteration does not spend a call rediscovering it. (iteration 2)
- **The rule's §7-covers-the-surface-list citation was off by one section.** It is not; §7 is "ADDING A MODE TO AN EXISTING HUB" and holds the 11-row table [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:245]. (iteration 2)
- **`/doctor:install` and `/doctor:symlink` need a rule because they mutate a project.** No: the commands own their own plan-then-yes discipline, `blast-radius.md` governs any install, and `AGENTS.md:289` already delegates the inventory. (iteration 3)
- **`AGENTS.md:70`'s proposal is simply wrong.** No: it is substantively right and self-consistent with Gate 5 and the advisor. Only the `one line` parenthetical and the byte budget need correcting. (iteration 3)
- **A rule is needed about which lines an update may overwrite.** No: A7/A8 plus the note line own it; the gap is capacity, not ownership. (iteration 3)
- **A rule is needed for conversation playbook scenarios.** No: `sk-doc`'s `playbook-conversation` intent already routes the request, and the runner is documented by the skill that ships it [SOURCE: .skilled/skills/sk-doc/ROUTER.md:103]. (iteration 3)
- **The `§4`-before-`§3` order was introduced by the manifest.** No: identical order at `v4.0.0.16`. (iteration 3)
- **The worker-session nudge removal leaves a dangling rule.** No: zero references to a nudge in the rule layer; only an unrelated English use of the word. (iteration 3)
- **Treating "the manifest requires a rule about which lines an update may overwrite" as a single question.** It splits into ownership (settled by A7/A8) and capacity (unstated, and load-bearing). Asking it as one question would have produced either a duplicated rule or a missed budget. (iteration 3)
- **`skill-hub-routing.md:78` should name `RS-002` / `RS-004` / `RS-005`.** Rejected: mechanics in the rule, against `REPO RULES.md:98-101`. (iteration 4)
- **A `delivery prefix` line in the repository block silences A6.** False. `own` is canary stdout screened for `MISSING:` / `BLOCKED:` `[SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:461-463]`; document prose cannot enter it. (iteration 4)
- **A trigger-table row should route to `/doctor:agents-md` or `/doctor:install`.** Rejected: `REPO RULES.md:5-6` and `:18` make the table a rule-file router; the commands already fire rows 42, 44 and 45. (iteration 4)
- **Measuring only the variants already on the table.** Iteration 3 tested the two wordings it had and concluded about "any version". A budget question has to be answered by measuring the cheapest candidate, not the two most discussed. (iteration 4)
- **No `ROUTER.md`-naming wording fits the budget.** False at the short end: the 89-byte form lands at 16,371, 13 bytes inside. (iteration 4)
- **The canary is silent past the prefix, so A6's fallback is the only signal.** False. The canary emits its own failure containing `delivery prefix` `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:428]`, printed as `MISSING:` `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:440]`. (iteration 4)
- **Treating iteration 3's A6 read as sufficient because it quoted the right file and line.** The citation was correct and the inference from it was inverted — the code was read as parsing the document when it parses a subprocess's stdout. For any row that shells out, the variable's provenance (`output` at `:450`) has to be established before its predicate is interpreted. Recorded because this is the second time in this packet that a correct citation carried a wrong inference. (iteration 4)
- **"A backticked token missing as a repo path is a vanished citation."** `@juicesharp/rpiv-ask-user-question` (iteration 5)
- **"The `.codex/config.toml` change staled the `communication-handoff.md` Codex row."** `fa2f8321f8` (iteration 5)
- **"The range touched a third rule-layer surface that iterations 1-4 missed."** The touch set is (iteration 5)
- **"The seven named gate scripts changed behavior in this release."** All seven return zero commits (iteration 5)
- **"The sibling packets' deferrals hand work to `AGENTS.md` or the repo rules."** Both name only (iteration 5)

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
- Q4 partially open: whether any remaining v4.0.1.0 addition — conversation playbook scenarios, `/doctor:install`/`symlink`, worker-session nudge removal — warrants a rule statement. (iteration 1)
- Q3 open: the 13 rule files' own internal citations (section anchors into skills, script paths, gate command names) were not audited beyond `communication-handoff.md` §5 and the hub-routing references. (iteration 1)
- Q5 partially open: the redundancy question was answered only for comment hygiene and the doc rewrite guard. (iteration 1)
- Q4 still open: whether a v4.0.1.0 addition not yet examined — conversation playbook scenarios (`specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios`), `/doctor:symlink` and `/doctor:install`, and the worker-session nudge removal — warrants a rule statement, and whether `/doctor:agents-md`'s section manifest now makes any shipped `AGENTS.md` section self-maintaining. (iteration 2)
- None at the key-question level. Three carried-forward items stay open as refinements rather than questions: (a) the `AGENTS.md:70` edit's compensating trim is a follow-up decision, not research; (b) `research/research.md` synthesis is unowned while the dispatch allowlist excludes it; (c) iteration 2's note that the gateway projection keeps only seven fields still governs how this packet's own state is read. (iteration 3)
- None at the key-question level. Three items carry forward as refinements: (a) 13 bytes of headroom at `AGENTS.md:70` is thin enough that the next edit above the last anchor must re-measure, though no trim is owed now; (b) `research/research.md` synthesis remains unowned while the dispatch allowlist excludes it; (c) the `parent-skills-nested-packets.md` §7 table has no routing-shape row, which is `sk-doc`-owned and outside this packet's surface. (iteration 4)
- `research/research.md` synthesis remains unowned while the dispatch allowlist excludes it. (iteration 5)
- `f-iter004-002`'s 89-byte wording now has 13 bytes of headroom against the 16,384-byte delivery (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- Release notes: `.skilled/changelog/skilled/v4.0.1.0.md` (196 lines). Headline: every skill keeps its routing tables in a sibling `ROUTER.md`; new doctor commands (`/doctor:sk-skill`, `/doctor:symlink`, `/doctor:agents-md`); decision capture of operator answers; sk-code web frontend surface; sk-design fundamentals retired; magicpath and vision retired; render checks and a doc rewrite guard. Its spec-folder list names `specs/sk-doc/hub-routing-and-surfaces/001-hub-routing-quality/002-skill-routing-and-clarity`, `specs/commands/004-doctor-sk-skill-command`, `specs/commands/005-doctor-symlink-install`, `specs/agents-md/016-doctor-agents-md`, `specs/system-speckit/043-decision-capture`, `specs/sk-code/code-surfaces/005-frontend-upstream-proposals`, `specs/sk-design/021-deprecate-fundamentals`, `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios`, `specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement`.
- Git range: tags `v4.0.0.0` through `v4.0.0.16` and `v4.0.1.0` exist. `git rev-list --count v4.0.0.0..v4.0.1.0` = 3365; `v4.0.0.16..v4.0.1.0` = 458. The release note most likely covers `v4.0.0.16..v4.0.1.0`; confirm before relying on the wider range.
- Targets: `AGENTS.md` (302 lines), `REPO RULES.md` (114 lines), 13 files under `.skilled/repo-rules/`. No root `CLAUDE.md` file exists in this checkout (`ls CLAUDE.md` fails), so the "CLAUDE.md mirrors AGENTS.md" claim itself is worth checking.
- Prior packet in the same track: `specs/agents-md/016-doctor-agents-md` (doctor:agents-md, which manages shipped AGENTS.md sections).

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
- Convergence threshold: 0.05 (telemetry only; stop policy max-iterations)
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
- Started: 2026-11-05T20:09:09Z
