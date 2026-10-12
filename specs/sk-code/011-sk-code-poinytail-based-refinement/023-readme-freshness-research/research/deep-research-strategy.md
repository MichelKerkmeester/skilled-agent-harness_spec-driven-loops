---
title: "Deep Research Strategy: README freshness after v4.0.0.4"
description: "Session tracking for the ten-iteration README freshness research."
trigger_phrases:
  - "readme freshness research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - README freshness after v4.0.0.4

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
Is the root README.md still accurate after every change described in .skilled/changelog/skilled/v4.0.0.4.md (per-doc version model, install steps and Node 24, unknown-option refusal, playbook and catalog path checks, advisor CI agreement, retired deep-loop modes, hooks, routing, code review output and the rest of the note), and are the related READMEs accurate: every README the root README links to or that documents the same setup or features (for example .skilled/README.md, install guides, and the hub READMEs for sk-doc, sk-code, sk-git, system-spec-kit, system-skill-advisor and cli-pi, plus any README the v4.0.0.4 changes touch). For each finding give README path:line, the claim, repository evidence (path:line or a command and its output), a class (STALE, MISSING, WRONG or OK-VERIFIED) and a severity, and propose the smallest correct wording fix with no restructure.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Which READMEs are related to the root README.md (linked from it, or documenting the same setup or features, or touched by v4.0.0.4), built from links and grep rather than guesses?
- [x] Q2: Do the root README install, prerequisites (Node 24), first-use and setup statements match the v4.0.0.4 install changes and the repository?
- [x] Q3: Do the root README statements on features (deep-loop modes, skill hubs, routing and the advisor, hooks, code review output, scripts refusing unknown options, per-doc versions, playbook and catalog checks, CI gates) match v4.0.0.4 and the repository?
- [x] Q4: Which statements in the related READMEs are stale, missing or wrong against v4.0.0.4 and the repository?
- [x] Q5: Which v4.0.0.4 user-facing changes do the READMEs leave out where a reader would need them, and which README statements were checked and found accurate?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing any README or product file; this run only reports findings.
- Restructuring a README; each proposed fix is the smallest correct wording change.
- Judging prose style; only factual accuracy against the repository counts.

---

## 5. STOP CONDITIONS
- The run is forced to 10 iterations (stopPolicy max-iterations); convergence is telemetry only.
- A provider usage limit stops the run; there is no fallback executor.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Which READMEs are related to the root README.md (linked from it, or documenting the same setup or features, or touched by v4.0.0.4), built from links and grep rather than guesses?
- Q2: Do the root README install, prerequisites (Node 24), first-use and setup statements match the v4.0.0.4 install changes and the repository?
- Q3: Do the root README statements on features (deep-loop modes, skill hubs, routing and the advisor, hooks, code review output, scripts refusing unknown options, per-doc versions, playbook and catalog checks, CI gates) match v4.0.0.4 and the repository?
- Q4: Which statements in the related READMEs are stale, missing or wrong against v4.0.0.4 and the repository?
- Q5: Which v4.0.0.4 user-facing changes do the READMEs leave out where a reader would need them, and which README statements were checked and found accurate?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- deriving the related set from the README's own links plus an existence find produced a bounded, evidence-backed list instead of a guess; the one-command `ls -d` resolution check turned link verification into a single verifiable step; reading the full changelog before checking claims made the map complete and the claim checks targeted. (iteration 1)
- re-reading the changelog's install section first-hand made the claim list exact; one compound read-only command per batch kept the evidence count low while still opening every cited file; verifying the daemon socket before running the README's own verify command turned a spawn-side-effect risk into a clean read-only run (exit 0, count 9); reading the shim and parser libraries pinned the "hooks and the mirror check load this build" claim to exact lines instead of the changelog's prose. (iteration 2)
- counting the repository side with the repository's own indexes (agents README.txt roster, commands README.txt group table) gave two independent confirmations for each count claim, so the STALE verdicts rest on both a directory walk and an authored index; checking git history pinned the 12 → 11 change to the exact commit, turning a count mismatch into a dated cause; reading the mode registry gave the command→agent pairs one authoritative source instead of six file-existence probes. (iteration 3)
- reading each hub's own mode registry with a one-line `node` probe turned three README hub claims into exact counts (15/14 and the nine mcp-tooling ids) instead of eyeballing directories; counting the repository side first made the two stale rows a simple subtraction; checking the CLI source for the fallback claim beat trying to force a daemon outage, which would have been a side effect; and one compound read-only command per batch kept the evidence count low while still opening every cited file. (iteration 4)
- parsing the validator registry directly turned three claims into exact numbers (41 rules, 7 warn + 2 info) instead of prose guesses, and the orchestrator's severity mapping confirmed what "warn" means at runtime; counting the doctor assets by the README's own `operating_mode` definition made the 19-vs-20 verdict self-contained; reading the shipped catalog and playbook gave both the 111/42 counts and the ClickUp capability contradiction in one pass; reading the routers (`update.md`, `mcp.md`, `compat-action.yaml`) verified four claims from their own contracts; the INSTALL-GUIDE plus session-auth scenario settled the two-iteration-old `CLICKUP_API_KEY` carry-over. (iteration 5)
- reading `.skilled/bin/README.md` in full and diffing it against one `ls -1 .skilled/bin` turned the tree staleness into a direct subtraction; checking the changelog's version-model paragraph (line 389) against the two install-guide frontmatter blocks produced two verifications and one real internal contradiction in a single pass; folding every probe into one compound read-only command per batch kept the evidence count low while still opening every cited file. (iteration 6)
- reading the changelog's hub-contract line (`:199`) before the READMEs turned the version model into a targeted one-command check per hub, and the doctor source then supplied the authoritative rule text, so all three version rows rest on both a release note and the enforcing code. Grepping the advisor runtime for `surfaceHint` confirmed the schema change from three independent files (schema, tool definition, handler) instead of trusting the changelog prose. The full-file reads of all three READMEs kept the OK rows anchored to exact lines. (iteration 7)
- running the version-parity probe before reading anything caught two of the four findings in one command, and reading the doctor's 13c block plus the frontmatter versioning standard before classifying turned the cli-pi/cli-devin version lines from apparent drift into a verified non-finding — the contract, not intuition, decided it. The bounded existence loops (28 §9 targets, seven mode dirs, five packets) produced six defensible OK rows at one call each. Checking the registry and iteration 5 for prior chart-count findings before writing prevented a duplicate row. (iteration 8)
- reading the six READMEs as line-numbered batches made every table row cite an exact line, and the `ls` diff against each README's own tree turned two stale inventories into direct subtractions. Scanning `pre-commit` for its `SPECKIT_SKIP_*` bypasses before judging the README's gate counts turned an internal contradiction into a counting exercise with a single source of truth. The `awk` pattern scans (unknown-argument wording, deadline constants, `require()` graph) produced negative and positive evidence at one call each. (iteration 9)
- batching the probes into compound read-only commands and extracting flagged lines per file kept the re-check inside the call budget; the fresh counts reproduced every prior count-based finding, so the flagged set survived adversarial review almost intact. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the repo-wide README find saturates at its 100-result cap and is dominated by report artifacts, so it cannot serve as the inventory source; the `spec/` README reference in the changelog has no root-level path, so its location needs a targeted search next. (iteration 1)
- nothing failed. The literal `grep -l` could not be used because shell grep is barred in this environment; the `awk` probe reproduces its predicate exactly, so the substitution changed the tool, not the evidence. (iteration 2)
- nothing failed. The crosswalk's stale "twelve agents" word briefly looked like a contradiction of the count finding; git history resolved it in the same pass. (iteration 3)
- nothing failed. The state reads and section mapping consumed more calls than the persona's target, so the research calls had to be batched aggressively at the end. (iteration 4)
- nothing failed. The state reads and claim mapping again consumed more calls than the persona's target, so the evidence probes had to be batched into compound read-only commands. (iteration 5)
- an early `&&`-chained probe aborted at the first missing file (`.skilled/README.md`) and a blind read of that same missing file spent a call — the file-not-found path was not budgeted; state reads plus those probes pushed the iteration to 14 tool calls, above the persona's 8-11 target and the pack's 12 cap. The changelog's lines 391-452 were not re-read this iteration; iteration 1's map already covers them and they target the root README install path (Q2, resolved). (iteration 6)
- state reads plus full-file reads of three long READMEs and the changelog pushed this iteration to 22 research calls, above the persona's 8-11 target and the pack's 12 cap (the config allows 24 per iteration). The `ls -1t` probe for the newest changelog entry sorted by mtime, not version, and misled at first glance; the version-parity answer had to come from the doctor's `compareVersions` sort instead. (iteration 7)
- two chained probes aborted early because an expected `ls` failure on a missing file broke an `&&` chain, costing a re-run and an overflow read; the pack's 12-call cap was exceeded again (about 25 calls; the config allows 24 per iteration and iteration 7 used 22) because full README reads plus contract reads plus artifact writes do not fit 12. (iteration 8)
- two batch prints overflowed the terminal capture and cost two extra overflow reads; the pack's 12-call cap again did not fit full-README coverage plus artifact writes (about 24 calls, the config's own limit), the same shortfall iterations 6-8 recorded. The first Q5 candidate (Pi dispatch-guard wrappers) could not be pinned to a README home without widening scope beyond the inventory, so it was deferred instead of guessed. (iteration 9)
- the first line-print awk dumped whole files (the pattern/action line split made `{print}` an always-true rule) and the iterations 1-5 row extraction missed (first-cell format differs), costing two recovery detours; both were replaced with narrower commands rather than retried. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `.skilled/README.md` as a related README to audit: the file does not exist and the root README has no reference to it (awk → 0 matches). Do not chase it in later iterations. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `.skilled/README.md` as a related README to audit: the file does not exist and the root README has no reference to it (awk → 0 matches). Do not chase it in later iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.skilled/README.md` as a related README to audit: the file does not exist and the root README has no reference to it (awk → 0 matches). Do not chase it in later iterations.

### A single multi-line awk program for the line re-print: a newline between the OR-chain pattern and its `{print}` action binds the action as an always-true rule, so it dumped whole files; per-file one-liner awks were used instead. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A single multi-line awk program for the line re-print: a newline between the OR-chain pattern and its `{print}` action binds the action as an always-true rule, so it dumped whole files; per-file one-liner awks were used instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A single multi-line awk program for the line re-print: a newline between the OR-chain pattern and its `{print}` action binds the action as an always-true rule, so it dumped whole files; per-file one-liner awks were used instead.

### An unknown-option note in `.skilled/scripts/README.md`: the v4.0.0.4 refusal set names the spec-kit CLI, the skill advisor, the deep loop, sk-doc, sk-code, sk-design, sk-git and the shared `.skilled/bin` tools, not `.skilled/scripts/`; only `orphan-mcp-sweeper.sh` already refuses an unknown argument (`:87`), so no README update is implicated. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: An unknown-option note in `.skilled/scripts/README.md`: the v4.0.0.4 refusal set names the spec-kit CLI, the skill advisor, the deep loop, sk-doc, sk-code, sk-design, sk-git and the shared `.skilled/bin` tools, not `.skilled/scripts/`; only `orphan-mcp-sweeper.sh` already refuses an unknown argument (`:87`), so no README update is implicated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An unknown-option note in `.skilled/scripts/README.md`: the v4.0.0.4 refusal set names the spec-kit CLI, the skill advisor, the deep loop, sk-doc, sk-code, sk-design, sk-git and the shared `.skilled/bin` tools, not `.skilled/scripts/`; only `orphan-mcp-sweeper.sh` already refuses an unknown argument (`:87`), so no README update is implicated.

### cli-devin README as an audit target this iteration: not in the Q1 inventory. Its observed lines (`README.md:12` `version: 1.4.0.11`, `SKILL.md:5` `version: 1.4.6.0`, newest changelog `v1.4.6.0.md`) are consistent with the own-edition model and are deferred. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: cli-devin README as an audit target this iteration: not in the Q1 inventory. Its observed lines (`README.md:12` `version: 1.4.0.11`, `SKILL.md:5` `version: 1.4.6.0`, newest changelog `v1.4.6.0.md`) are consistent with the own-edition model and are deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: cli-devin README as an audit target this iteration: not in the Q1 inventory. Its observed lines (`README.md:12` `version: 1.4.0.11`, `SKILL.md:5` `version: 1.4.6.0`, newest changelog `v1.4.6.0.md`) are consistent with the own-edition model and are deferred.

### Forcing the advisor CLI run past its freshness gate with `SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`: unnecessary; the shim's freshness check passed and `list-tools` exited 0 without any bypass, so the bypass env would have changed behavior without adding evidence. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Forcing the advisor CLI run past its freshness gate with `SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`: unnecessary; the shim's freshness check passed and `list-tools` exited 0 without any bypass, so the bypass env would have changed behavior without adding evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Forcing the advisor CLI run past its freshness gate with `SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`: unnecessary; the shim's freshness check passed and `list-tools` exited 0 without any bypass, so the bypass env would have changed behavior without adding evidence.

### Mode READMEs for the three hubs as this iteration's audit target: the root README links no per-mode README for them (0 matches for `sk-git/README`; the only nested README it links is `system-spec-kit/runtime/README.md`, which remains on the Q4 inventory). Do not chase per-mode READMEs for these hubs again. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Mode READMEs for the three hubs as this iteration's audit target: the root README links no per-mode README for them (0 matches for `sk-git/README`; the only nested README it links is `system-spec-kit/runtime/README.md`, which remains on the Q4 inventory). Do not chase per-mode READMEs for these hubs again.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mode READMEs for the three hubs as this iteration's audit target: the root README links no per-mode README for them (0 matches for `sk-git/README`; the only nested README it links is `system-spec-kit/runtime/README.md`, which remains on the Q4 inventory). Do not chase per-mode READMEs for these hubs again.

### Mode-packet README version parity as a drift class: closed by the frontmatter versioning standard — a mode README carries its own edition, raised by the bump rule, and only the parent-skill doctor's README check compares a hub root README with its `SKILL.md` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30], [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122]. Do not re-chase cli-pi 1.5.0.8 vs 1.5.15.0. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Mode-packet README version parity as a drift class: closed by the frontmatter versioning standard — a mode README carries its own edition, raised by the bump rule, and only the parent-skill doctor's README check compares a hub root README with its `SKILL.md` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30], [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122]. Do not re-chase cli-pi 1.5.0.8 vs 1.5.15.0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mode-packet README version parity as a drift class: closed by the frontmatter versioning standard — a mode README carries its own edition, raised by the bump rule, and only the parent-skill doctor's README check compares a hub root README with its `SKILL.md` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30], [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122]. Do not re-chase cli-pi 1.5.0.8 vs 1.5.15.0.

### None beyond Ruled Out. -- BLOCKED (iteration 9, 3 attempts)
- What was tried: None beyond Ruled Out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None beyond Ruled Out.

### None beyond Ruled Out. The `.skilled/README.md` and root `spec/README.md` absence checks confirm the topic's premise errors rather than opening new work; the real spec README sits at `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: None beyond Ruled Out. The `.skilled/README.md` and root `spec/README.md` absence checks confirm the topic's premise errors rather than opening new work; the real spec README sits at `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None beyond Ruled Out. The `.skilled/README.md` and root `spec/README.md` absence checks confirm the topic's premise errors rather than opening new work; the real spec README sits at `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`.

### None this iteration. -- BLOCKED (iteration 7, 7 attempts)
- What was tried: None this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration.

### None this iteration. (The retired-mode name search is not a dead end: 0 hits is the verified absence that confirms README:562.) -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None this iteration. (The retired-mode name search is not a dead end: 0 hits is the verified absence that confirms README:562.)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration. (The retired-mode name search is not a dead end: 0 hits is the verified absence that confirms README:562.)

### Per-file READMEs inside `.skilled/bin/lib/compiled-routing/`: the README itself documents the directory is generated output that carries no README on purpose [SOURCE: .skilled/bin/lib/README.md:58]. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Per-file READMEs inside `.skilled/bin/lib/compiled-routing/`: the README itself documents the directory is generated output that carries no README on purpose [SOURCE: .skilled/bin/lib/README.md:58].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Per-file READMEs inside `.skilled/bin/lib/compiled-routing/`: the README itself documents the directory is generated output that carries no README on purpose [SOURCE: .skilled/bin/lib/README.md:58].

### Recovering iterations 1-5 full rows by matching the first table cell against `` | `path` ``: the rows' first cells do not match that shape; direct probes replaced the need. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Recovering iterations 1-5 full rows by matching the first table cell against `` | `path` ``: the rows' first cells do not match that shape; direct probes replaced the need.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recovering iterations 1-5 full rows by matching the first table cell against `` | `path` ``: the rows' first cells do not match that shape; direct probes replaced the need.

### Repo-wide `**/README.md` sweep as the inventory source: the find returns more than 100 paths, dominated by benchmark-report and fixture READMEs; the related set was built from root-README links plus the topic-named hubs instead. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Repo-wide `**/README.md` sweep as the inventory source: the find returns more than 100 paths, dominated by benchmark-report and fixture READMEs; the related set was built from root-README links plus the topic-named hubs instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Repo-wide `**/README.md` sweep as the inventory source: the find returns more than 100 paths, dominated by benchmark-report and fixture READMEs; the related set was built from root-README links plus the topic-named hubs instead.

### Root `.nvmrc` or root `package.json` as the Node 24 enforcement source: both absent (cat probes returned not-found); the requirement is enforced per package via the four `engines` fields, so no root version file can be cited or expected. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Root `.nvmrc` or root `package.json` as the Node 24 enforcement source: both absent (cat probes returned not-found); the requirement is enforced per package via the four `engines` fields, so no root version file can be cited or expected.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Root `.nvmrc` or root `package.json` as the Node 24 enforcement source: both absent (cat probes returned not-found); the requirement is enforced per package via the four `engines` fields, so no root version file can be cited or expected.

### Running `check-corpus.cjs --families` to list the check families: unnecessary; reading `FAMILY_NAMES` (lines 100-150) yields the same list without executing a script. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Running `check-corpus.cjs --families` to list the check families: unnecessary; reading `FAMILY_NAMES` (lines 100-150) yields the same list without executing a script.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running `check-corpus.cjs --families` to list the check families: unnecessary; reading `FAMILY_NAMES` (lines 100-150) yields the same list without executing a script.

### Running `create.sh` with an unknown option to observe the refusal: not executed; a scaffolder run risks writes, so the refusal was evidenced from the source token scan and the changelog instead. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Running `create.sh` with an unknown option to observe the refusal: not executed; a scaffolder run risks writes, so the refusal was evidenced from the source token scan and the changelog instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running `create.sh` with an unknown option to observe the refusal: not executed; a scaffolder run risks writes, so the refusal was evidenced from the source token scan and the changelog instead.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- None this iteration. (The retired-mode name search is not a dead end: 0 hits is the verified absence that confirms README:562.) (iteration 1)
- Repo-wide `**/README.md` sweep as the inventory source: the find returns more than 100 paths, dominated by benchmark-report and fixture READMEs; the related set was built from root-README links plus the topic-named hubs instead. (iteration 1)
- Forcing the advisor CLI run past its freshness gate with `SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`: unnecessary; the shim's freshness check passed and `list-tools` exited 0 without any bypass, so the bypass env would have changed behavior without adding evidence. (iteration 2)
- None beyond Ruled Out. (iteration 2)
- Root `.nvmrc` or root `package.json` as the Node 24 enforcement source: both absent (cat probes returned not-found); the requirement is enforced per package via the four `engines` fields, so no root version file can be cited or expected. (iteration 2)
- None this iteration. (iteration 3)
- Running `check-corpus.cjs --families` to list the check families: unnecessary; reading `FAMILY_NAMES` (lines 100-150) yields the same list without executing a script. (iteration 5)
- Running `create.sh` with an unknown option to observe the refusal: not executed; a scaffolder run risks writes, so the refusal was evidenced from the source token scan and the changelog instead. (iteration 5)
- `.skilled/README.md` as a related README to audit: the file does not exist and the root README has no reference to it (awk → 0 matches). Do not chase it in later iterations. (iteration 6)
- Mode READMEs for the three hubs as this iteration's audit target: the root README links no per-mode README for them (0 matches for `sk-git/README`; the only nested README it links is `system-spec-kit/runtime/README.md`, which remains on the Q4 inventory). Do not chase per-mode READMEs for these hubs again. (iteration 7)
- cli-devin README as an audit target this iteration: not in the Q1 inventory. Its observed lines (`README.md:12` `version: 1.4.0.11`, `SKILL.md:5` `version: 1.4.6.0`, newest changelog `v1.4.6.0.md`) are consistent with the own-edition model and are deferred. (iteration 8)
- Mode-packet README version parity as a drift class: closed by the frontmatter versioning standard — a mode README carries its own edition, raised by the bump rule, and only the parent-skill doctor's README check compares a hub root README with its `SKILL.md` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30], [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122]. Do not re-chase cli-pi 1.5.0.8 vs 1.5.15.0. (iteration 8)
- An unknown-option note in `.skilled/scripts/README.md`: the v4.0.0.4 refusal set names the spec-kit CLI, the skill advisor, the deep loop, sk-doc, sk-code, sk-design, sk-git and the shared `.skilled/bin` tools, not `.skilled/scripts/`; only `orphan-mcp-sweeper.sh` already refuses an unknown argument (`:87`), so no README update is implicated. (iteration 9)
- Per-file READMEs inside `.skilled/bin/lib/compiled-routing/`: the README itself documents the directory is generated output that carries no README on purpose [SOURCE: .skilled/bin/lib/README.md:58]. (iteration 9)
- A single multi-line awk program for the line re-print: a newline between the OR-chain pattern and its `{print}` action binds the action as an always-true rule, so it dumped whole files; per-file one-liner awks were used instead. (iteration 10)
- None beyond Ruled Out. The `.skilled/README.md` and root `spec/README.md` absence checks confirm the topic's premise errors rather than opening new work; the real spec README sits at `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`. (iteration 10)
- Recovering iterations 1-5 full rows by matching the first table cell against `` | `path` ``: the rows' first cells do not match that shape; direct probes replaced the need. (iteration 10)

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
- Q3: Do the root README statements on features (deep-loop modes, skill hubs, routing and the advisor, hooks, code review output, scripts refusing unknown options, per-doc versions, playbook and catalog checks, CI gates) match v4.0.0.4 and the repository? (iteration 1)
- Q5: Which v4.0.0.4 user-facing changes do the READMEs leave out where a reader would need them, and which README statements were checked and found accurate? (iteration 1)
- Q2: Do the root README install, prerequisites (Node 24), first-use and setup statements match the v4.0.0.4 install changes and the repository? (iteration 1)
- Q4: Which statements in the related READMEs are stale, missing or wrong against v4.0.0.4 and the repository? (iteration 1)
- Q3 (part 2): skill hubs, routing and the advisor, hooks, code-review output, unknown-option refusal, per-doc versions, playbook and catalog checks, CI gates. (iteration 3)
- Q3 (part 3): code review output, scripts refusing unknown options, per-doc version model, playbook and catalog checks. (iteration 4)
- Q5: which v4.0.0.4 user-facing changes the READMEs leave out where a reader would need them, and which statements checked out accurate — this iteration contributes five first-time verifications and one gap (row 2). (iteration 6)
- Q4: the remaining related READMEs (hub READMEs for sk-doc, sk-code, sk-git, system-spec-kit, system-skill-advisor, system-deep-loop, cli-pi; `.skilled/scripts/README.md`, `.skilled/hooks/README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/skills/system-deep-loop/runtime/README.md`, `.skilled/skills/system-spec-kit/runtime/README.md`, `.skilled/bin/lib/README.md`). (iteration 6)
- Q4: the remaining hub READMEs (sk-doc, sk-code, system-deep-loop, cli-pi) and the inventory READMEs (`.skilled/scripts/README.md`, `.skilled/hooks/README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/skills/system-deep-loop/runtime/README.md`, `.skilled/skills/system-spec-kit/runtime/README.md`, `.skilled/bin/lib/README.md`). (iteration 7)
- Q5: which v4.0.0.4 user-facing changes the READMEs leave out where a reader would need them, and which statements checked out accurate — this iteration contributes six first-time verifications (five OK rows plus the version-parity check) and six gaps. (iteration 7)
- Q4: the inventory READMEs (`.skilled/scripts/README.md`, `.skilled/hooks/README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/skills/system-deep-loop/runtime/README.md`, `.skilled/skills/system-spec-kit/runtime/README.md`, `.skilled/bin/lib/README.md`) and the deferred cli-devin README confirmation. (iteration 8)
- Q5: which v4.0.0.4 user-facing changes the READMEs leave out where a reader would need them, and which statements checked out accurate — this iteration contributes four findings and six first-time verifications. (iteration 8)
- Q5: Which v4.0.0.4 user-facing changes do the READMEs leave out where a reader would need them, and which README statements were checked and found accurate? — this iteration contributes one Q5 gap (row 1's §1 summary), two documented-change verifications and one non-implicated check; the synthesis plus two remaining candidates go to iteration 10. (iteration 9)
- None at the strategy level. Residual verification debt, each with its next evidence: `:113` option set (CLI schema), `:881` catalog/playbook totals, `:204` playbook totals, `:1435` env half (`mcp-click-up/INSTALL-GUIDE.md`), and the `:49` adjudication (v4.0.0.4 install section). (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- Release note under test: `.skilled/changelog/skilled/v4.0.0.4.md` (452 lines). Root README: `README.md` (1,600 lines).
- Prior work: 020-open-ends-research/002-fresh-clone-onboarding studied the README install path before v4.0.0.4 shipped its fixes; its `research/research.md` is a pointer, not evidence for the current tree.

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
- Started: 2026-10-12T14:40:22.000Z
