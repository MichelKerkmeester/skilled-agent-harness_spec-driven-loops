---
title: Deep Research Strategy - pi-deepseek lineage, command surfacing and workflow enforcement
description: Runtime strategy file for the pi-deepseek fan-out lineage of the command-surfacing research packet. Tracks focus decisions, key questions, and outcomes across ten iterations.
trigger_phrases:
  - "command surfacing lineage strategy"
  - "pi-deepseek research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy — pi-deepseek lineage

## 1. OVERVIEW

Fan-out lineage `pi-deepseek` of `/deep:research:auto` for packet 007. Ten iterations, `stopPolicy: max-iterations`, threshold 0.05 treated as telemetry only.

Machine-owned sections below (3, 6, 7-11A) are rewritten by `reduce-state.cjs`; this lineage only writes iteration files, deltas, and the append-gateway records.

---

## 2. TOPIC

How the skill advisor should surface all 45 slash commands (run-it-yourself vs ask-first), and how a plain-chat request reaches the proper command workflow on every runtime. Ten angles: inventory, scoring, output contract, run or ask, invocation mechanics, chat-only users, skill and command linkage, measurement, prior art, failure modes.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which of the 45 commands in .skilled/commands have an active advisor bridge, which bridges point at retired or unmatched names, and what would one drift-proof inventory require?
- [x] Why do plain planning and research prompts return zero recommendations, and what do the no-slash penalty and the mutating-command gate cost in recall versus what they buy in precision?
- [x] What must the advisor_recommend output contract carry (kind, runnable, brief wording, token budget) for a model to act on a surfaced command instead of a raw bridge id?
- [x] Which commands are safe to start without asking, which need a question first, and where should that run-or-ask policy live?
- [x] Can a model start a slash command by itself on Claude Code, OpenCode, Codex, Pi, Cursor, Devin and DSH, and what fallback exists where it cannot?
- [x] Which mechanism actually brings a plain-chat request onto the command workflow on every runtime: advisor brief, AGENTS.md gate, hook, skill-to-command pointer, or runner refusal?
- [x] Which command workflows never load the mode SKILL.md their metadata names, and should a skill recommendation imply its command?
- [x] Which benchmark rows and metrics separate a missed command from a wrongly started one?
- [x] What prior art exists for routing free text to a packaged workflow, and which failure modes (over-trigger, command/skill ambiguity, child sessions starting commands, loops, brief budget) must a design guard against?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing any advisor, hook, command or AGENTS.md change; this packet ends at research synthesis.
- Re-litigating how skills are scored against each other (settled by sibling packets in this sub-track).
- Repairing the Pi 1.5.2 extension loading failure (owned by its own packet).

---

## 5. STOP CONDITIONS

- Runs the full 10 iterations (`stopPolicy: max-iterations`); convergence is telemetry only.
- Stop early only on unrecoverable state corruption or a gateway refusal.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Why do plain planning and research prompts return zero recommendations, and what do the no-slash penalty and the mutating-command gate cost in recall versus what they buy in precision?
- What must the advisor_recommend output contract carry (kind, runnable, brief wording, token budget) for a model to act on a surfaced command instead of a raw bridge id?
- Which commands are safe to start without asking, which need a question first, and where should that run-or-ask policy live?
- Can a model start a slash command by itself on Claude Code, OpenCode, Codex, Pi, Cursor, Devin and DSH, and what fallback exists where it cannot?
- Which mechanism actually brings a plain-chat request onto the command workflow on every runtime: advisor brief, AGENTS.md gate, hook, skill-to-command pointer, or runner refusal?
- Which command workflows never load the mode SKILL.md their metadata names, and should a skill recommendation imply its command?
- Which benchmark rows and metrics separate a missed command from a wrongly started one?
- What prior art exists for routing free text to a packaged workflow, and which failure modes (over-trigger, command/skill ambiguity, child sessions starting commands, loops, brief budget) must a design guard against?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- diffing the generated inventory against the command tree in both directions surfaced both failure shapes at once — commands with no bridge (5) and bridges with no command (3). Counting per-runtime `enabled` rather than trusting `generated: 62` explained the spec's measured zero-recommendation result without running the CLI. (iteration 1)
- reading the projection file's generated block and counting flags produced exact population numbers (67/40/22/15) from static source, which let the scoring claim be quantified instead of asserted. Tracing `PHRASE_BOOSTS` for rows that name a command id converted "chat doesn't reach commands" into "8 rows reach 3 command families". (iteration 2)
- reading the schema before the renderer showed the boundary is a closed strict object, which turns "add a kind field" from a one-line patch into a schema change plus a renderer branch. Measuring the brief's composition turned the token-budget worry into a non-issue and stopped a plausible but wrong recommendation (raise the cap). (iteration 3)
- parsing `_routes.yaml` for `mutating` and cross-checking the tally against iteration 2's 15 `readOnly` projections produced an end-to-end verification of the risk path — the signal exists, is correct, and is dropped at the JSON boundary. Finding the ladder in `blast-radius.md` meant the policy vocabulary did not have to be invented. (iteration 4)
- counting command files per mirror turned a vague "runtime parity" question into a table with one real gap (Devin, zero command surface) and one documentation gap (DSH missing from the hook table). Reading the DSH adapter README prevented a wrong claim that DSH has no brief delivery. (iteration 5)
- testing each candidate mechanism against a property it must have (fires every prompt, can bind, fires before the decision, already exists) eliminated three of five with cited evidence and left a stack rather than a winner. Counting command-integration tables turned "skills could point at commands" into "one skill does". (iteration 6)
- resolving every `ownerMode` to a real `SKILL.md` and then checking whether the command file carries the same references produced a count in both directions (1 dangling, 27 unlinked) instead of an impression. Reading two routers from different families showed the divergence is systematic, not a doctor quirk. (iteration 7)
- counting rows per field and per bridge turned "we need benchmarks" into a coverage table with exact gaps (17/35 doctor bridges, 0/28 others) and an exact budget. Reading the baseline's metric names showed the regression that would pass silently. (iteration 8)
- reading the one always-applied rule rather than skimming six READMEs produced the strongest evidence in the packet — a shipped file that says the dynamic delivery is dormant and that a static rule is what actually routes. That single line changes the reliance model of the design. (iteration 9)
- looking for the child-session flag in the spec gate and then in the advisor hook produced the packet's most consequential asymmetry — Gate 3 guards children, the advisor does not — in two greps. Reading the doctor route manifest again for the cycle case found a concrete command that calls the advisor, which turns "loops are a risk" into a named cycle. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first recursive file walk produced 90 "commands" because the doctor fixture tree is shaped like command folders. The count was wrong in a way that would have inflated every later coverage ratio; excluding fixture paths fixed it. (iteration 1)
- the initial hypothesis was a hidden no-slash penalty constant. Grepping for one consumed two calls and found nothing; the real mechanism is an absent key plus a slash-only table. The dead end is now recorded so it is not repeated. (iteration 2)
- I expected to run the advisor CLI to capture a live brief; that would write cache/database state outside this lineage's write surface, so it was replaced by reading `renderAdvisorBrief` and computing the composition. The static path gave more detail than a single sample would have. (iteration 3)
- the first YAML parse used 4-space indentation and returned zero routes, which would have produced the false claim that no risk data exists. Re-parsing at the real indentation (2 spaces for list items, 4 for fields) fixed it. Second miss: I assumed `allowed-tools` would separate read-only from mutating commands; Bash is universal, so that classifier is empty. (iteration 4)
- the first mirror count used `find` without following symlinks, so `.opencode/commands` reported 2 files instead of 45. Symlinked mirrors are the OpenCode shape; a non-following count under-reports by an order of magnitude. (iteration 5)
- I expected a global rule about commands somewhere in the ruleset; grepping `hand-roll` found only the substitution prohibition, which assumes the workflow is named. That absence is itself the finding. (iteration 6)
- I initially assumed metadata `choreography` described execution because it is written in the imperative. `/create:agent` disproved it in one read. The lesson is that declarative metadata is not evidence of runtime behaviour until the runtime file is opened. (iteration 7)
- I first assumed all four corpora were skill-level and was ready to report zero command coverage; the doctor slice disproved it. The lesson is to inspect every corpus file's keys before characterising a suite. (iteration 8)
- with no fetch tool I could not read vendor documentation; two attempted conceptual shortcuts ("harnesses let models call commands") had to be demoted to inference. Marking them is the honest outcome. (iteration 9)
- I expected an existing depth guard or re-entry counter somewhere in the hook stack; there is none. That absence is the finding, but the search cost two calls. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "Emit the command only when the skill is a command owner": this is what the doctor companion line already does, and it cannot express the mapping for non-doctor commands because no non-doctor id has a command string to give. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Emit the command only when the skill is a command owner": this is what the doctor companion line already does, and it cannot express the mapping for non-doctor commands because no non-doctor id has a command string to give.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Emit the command only when the skill is a command owner": this is what the doctor companion line already does, and it cannot express the mapping for non-doctor commands because no non-doctor id has a command string to give.

### "Enablement is the whole story": if the 22 disabled bridges were enabled, plain prose would still not match, because their keywords are slash strings and their only plain-phrase path is the 8-row table. Enablement widens typed-slash recall only. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "Enablement is the whole story": if the 22 disabled bridges were enabled, plain prose would still not match, because their keywords are slash strings and their only plain-phrase path is the 8-row table. Enablement widens typed-slash recall only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Enablement is the whole story": if the 22 disabled bridges were enabled, plain prose would still not match, because their keywords are slash strings and their only plain-phrase path is the 8-row table. Enablement widens typed-slash recall only.

### "Give the model the slash string and it will invoke it": no runtime exposes slash commands as model tools, and no repository rule instructs the model to type one. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "Give the model the slash string and it will invoke it": no runtime exposes slash commands as model tools, and no repository rule instructs the model to type one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Give the model the slash string and it will invoke it": no runtime exposes slash commands as model tools, and no repository rule instructs the model to type one.

### "Raise the token cap to make room for commands": contradicted by the measurement — the routing head is ~13 tokens of an 80-token budget, and the one overrun comes from a directive appended outside the cap. Raising the cap would grow the directive budget, not the command payload. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Raise the token cap to make room for commands": contradicted by the measurement — the routing head is ~13 tokens of an 80-token budget, and the one overrun comes from a directive appended outside the cap. Raising the cap would grow the directive budget, not the command payload.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Raise the token cap to make room for commands": contradicted by the measurement — the routing head is ~13 tokens of an 80-token budget, and the one overrun comes from a directive appended outside the cap. Raising the cap would grow the directive budget, not the command payload.

### "Runtime parity is a per-runtime brief problem": one renderer feeds all transports, so divergence lives in command mirroring and DSH's missing documentation row, not in the brief. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "Runtime parity is a per-runtime brief problem": one renderer feeds all transports, so divergence lives in command mirroring and DSH's missing documentation row, not in the brief.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Runtime parity is a per-runtime brief problem": one renderer feeds all transports, so divergence lives in command mirroring and DSH's missing documentation row, not in the brief.

### "The advisor deliberately abstains on commands": contradicted by the doctor family, which is fully enabled, read-only-flagged where appropriate, and renders runnable strings. Abstention is a property of non-doctor commands, not of commands as a class. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The advisor deliberately abstains on commands": contradicted by the doctor family, which is fully enabled, read-only-flagged where appropriate, and renders runnable strings. Abstention is a property of non-doctor commands, not of commands as a class.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The advisor deliberately abstains on commands": contradicted by the doctor family, which is fully enabled, read-only-flagged where appropriate, and renders runnable strings. Abstention is a property of non-doctor commands, not of commands as a class.

### A fifth inventory or a command registry: four hand-maintained sources already exist and iteration 1-2 showed the drift between them. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A fifth inventory or a command registry: four hand-maintained sources already exist and iteration 1-2 showed the drift between them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A fifth inventory or a command registry: four hand-maintained sources already exist and iteration 1-2 showed the drift between them.

### A new benchmark harness: the doctor slice already has the exact shape (prose prompt → command id, `expected_second`, controls), and a second harness would duplicate its fixtures. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A new benchmark harness: the doctor slice already has the exact shape (prose prompt → command id, `expected_second`, controls), and a second harness would duplicate its fixtures.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new benchmark harness: the doctor slice already has the exact shape (prose prompt → command id, `expected_second`, controls), and a second harness would duplicate its fixtures.

### A new gate: Gate 2 already occupies the per-turn slot; a second gate would compete for the same prefix budget. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A new gate: Gate 2 already occupies the per-turn slot; a second gate would compete for the same prefix budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new gate: Gate 2 already occupies the per-turn slot; a second gate would compete for the same prefix budget.

### A separate "command loop breaker" subsystem: the cycle is one command calling the advisor, so a depth counter at the brief boundary is enough. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A separate "command loop breaker" subsystem: the cycle is one command calling the advisor, so a depth counter at the brief boundary is enough.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A separate "command loop breaker" subsystem: the cycle is one command calling the advisor, so a depth counter at the brief boundary is enough.

### Copying a command list into each runtime's static rule by hand: the tree already proves that pattern drifts (iteration 1's four sources) and already has a generator for the one block that stays in sync. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Copying a command list into each runtime's static rule by hand: the tree already proves that pattern drifts (iteration 1's four sources) and already has a generator for the one block that stays in sync.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying a command list into each runtime's static rule by hand: the tree already proves that pattern drifts (iteration 1's four sources) and already has a generator for the one block that stays in sync.

### Counting commands by recursive `find`: reports 90 vs the real 45 because the doctor fixture tree contains SKILL/ROUTER markdown. Rejected as an inventory method; group-level enumeration is the reliable count. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Counting commands by recursive `find`: reports 90 vs the real 45 because the doctor fixture tree contains SKILL/ROUTER markdown. Rejected as an inventory method; group-level enumeration is the reliable count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting commands by recursive `find`: reports 90 vs the real 45 because the doctor fixture tree contains SKILL/ROUTER markdown. Rejected as an inventory method; group-level enumeration is the reliable count.

### Deriving risk from `allowed-tools`: Bash is declared by all 45 commands, so the signal is constant. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Deriving risk from `allowed-tools`: Bash is declared by all 45 commands, so the signal is constant.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deriving risk from `allowed-tools`: Bash is declared by all 45 commands, so the signal is constant.

### Deriving risk from the command name: `/doctor:install` is read-only by manifest and `/doctor:env` mutates, so names invert the truth on real examples. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Deriving risk from the command name: `/doctor:install` is read-only by manifest and `/doctor:env` mutates, so names invert the truth on real examples.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deriving risk from the command name: `/doctor:install` is read-only by manifest and `/doctor:env` mutates, so names invert the truth on real examples.

### Hook-level enforcement of commands: the hook contract is fail-open by design and every adapter returns `{}` on failure. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Hook-level enforcement of commands: the hook contract is fail-open by design and every adapter returns `{}` on failure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hook-level enforcement of commands: the hook contract is fail-open by design and every adapter returns `{}` on failure.

### Inferring a command from a skill recommendation: unsound for 13 skills with no command pointer and for the 27 commands with no skill pointer. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Inferring a command from a skill recommendation: unsound for 13 skills with no command pointer and for the 27 commands with no skill pointer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Inferring a command from a skill recommendation: unsound for 13 skills with no command pointer and for the 27 commands with no skill pointer.

### Looking for a command-level metric anywhere in the captured baseline or the bench files: none. `scorer-bench.ts` and the baseline both speak skill ids only. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for a command-level metric anywhere in the captured baseline or the bench files: none. `scorer-bench.ts` and the baseline both speak skill ids only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a command-level metric anywhere in the captured baseline or the bench files: none. `scorer-bench.ts` and the baseline both speak skill ids only.

### Looking for a model-invocable command mechanism in the hooks: the adapters only inject context or notices; none can dispatch a command. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a model-invocable command mechanism in the hooks: the adapters only inject context or notices; none can dispatch a command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a model-invocable command mechanism in the hooks: the adapters only inject context or notices; none can dispatch a command.

### Looking for an existing "command discovery" rule elsewhere in the ruleset: none. The closest text (`PLAN-WORKFLOW LOCK`, `sk-git` rule 16) forbids substitution but assumes the workflow is already named. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Looking for an existing "command discovery" rule elsewhere in the ruleset: none. The closest text (`PLAN-WORKFLOW LOCK`, `sk-git` rule 16) forbids substitution but assumes the workflow is already named.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an existing "command discovery" rule elsewhere in the ruleset: none. The closest text (`PLAN-WORKFLOW LOCK`, `sk-git` rule 16) forbids substitution but assumes the workflow is already named.

### Measuring command surfacing through the existing skill metrics: a command-only regression leaves all five baseline metrics unchanged, which is the failure this iteration exists to prevent. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Measuring command surfacing through the existing skill metrics: a command-only regression leaves all five baseline metrics unchanged, which is the failure this iteration exists to prevent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measuring command surfacing through the existing skill metrics: a command-only regression leaves all five baseline metrics unchanged, which is the failure this iteration exists to prevent.

### None unresolved. The single open thread is that `workflowMode` exists publicly but is unpopulated for command bridges; whether it is the intended carrier is a question for the skill-linkage angle, not this one. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None unresolved. The single open thread is that `workflowMode` exists publicly but is unpopulated for command bridges; whether it is the intended carrier is a question for the skill-linkage angle, not this one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None unresolved. The single open thread is that `workflowMode` exists publicly but is unpopulated for command bridges; whether it is the intended carrier is a question for the skill-linkage angle, not this one.

### None. The three bridge sources are readable and the diff is complete at the id/command level. What remains open is the *authority* question (which source wins when they disagree), which needs the drift-guard tests, not more enumeration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None. The three bridge sources are readable and the diff is complete at the id/command level. What remains open is the *authority* question (which source wins when they disagree), which needs the drift-guard tests, not more enumeration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The three bridge sources are readable and the diff is complete at the id/command level. What remains open is the *authority* question (which source wins when they disagree), which needs the drift-guard tests, not more enumeration.

### Putting the policy in `AGENTS.md` as a second list: there are already four hand-maintained sources (three metadata hubs, `allow-list.json`, `_routes.yaml`, `scoring-compatibility.json`); a fifth would drift the same way. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Putting the policy in `AGENTS.md` as a second list: there are already four hand-maintained sources (three metadata hubs, `allow-list.json`, `_routes.yaml`, `scoring-compatibility.json`); a fifth would drift the same way.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Putting the policy in `AGENTS.md` as a second list: there are already four hand-maintained sources (three metadata hubs, `allow-list.json`, `_routes.yaml`, `scoring-compatibility.json`); a fifth would drift the same way.

### Relying on skill-to-command pointers alone: 1 of ~14 skills has one, and pointers cannot trigger discovery. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Relying on skill-to-command pointers alone: 1 of ~14 skills has one, and pointers cannot trigger discovery.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relying on skill-to-command pointers alone: 1 of ~14 skills has one, and pointers cannot trigger discovery.

### Relying on the ambiguity brief form for command ties: it takes two skill labels and has no slot for a command string. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Relying on the ambiguity brief form for command ties: it takes two skill labels and has no slot for a command string.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relying on the ambiguity brief form for command ties: it takes two skill labels and has no slot for a command string.

### Searching for a `risk`, `writes`, or `danger` field in command metadata: none exists under any name. The only risk vocabulary in the tree is doctor's `mutating`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Searching for a `risk`, `writes`, or `danger` field in command metadata: none exists under any name. The only risk vocabulary in the tree is doctor's `mutating`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a `risk`, `writes`, or `danger` field in command metadata: none exists under any name. The only risk vocabulary in the tree is doctor's `mutating`.

### Searching for a non-Cursor static routing rule: none exists; Codex, Pi and DSH receive `AGENTS.md` directly and have no rules folder. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Searching for a non-Cursor static routing rule: none exists; Codex, Pi and DSH receive `AGENTS.md` directly and have no rules folder.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a non-Cursor static routing rule: none exists; Codex, Pi and DSH receive `AGENTS.md` directly and have no rules folder.

### Searching for a separate "no-slash penalty" constant: there is none. The effect the spec describes is produced by the *absence* of a plain-language key on command projections plus the explicit lane's slash-only boost table, not by a negative constant. Recorded so later iterations do not hunt for a penalty that does not exist. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching for a separate "no-slash penalty" constant: there is none. The effect the spec describes is produced by the *absence* of a plain-language key on command projections plus the explicit lane's slash-only boost table, not by a negative constant. Recorded so later iterations do not hunt for a penalty that does not exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a separate "no-slash penalty" constant: there is none. The effect the spec describes is produced by the *absence* of a plain-language key on command projections plus the explicit lane's slash-only boost table, not by a negative constant. Recorded so later iterations do not hunt for a penalty that does not exist.

### Searching for a single canonical command→skill field: there is none. The three existing carriers (`skill_agent`, `ownerMode`, `allow-list.skillId`) are the whole vocabulary, and only `allow-list.skillId` covers commands without metadata. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Searching for a single canonical command→skill field: there is none. The three existing carriers (`skill_agent`, `ownerMode`, `allow-list.skillId`) are the whole vocabulary, and only `allow-list.skillId` covers commands without metadata.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a single canonical command→skill field: there is none. The three existing carriers (`skill_agent`, `ownerMode`, `allow-list.skillId`) are the whole vocabulary, and only `allow-list.skillId` covers commands without metadata.

### Searching for an existing depth counter or re-entry guard in the hook stack: none. The only cycle protection in the tree is the fan-out lineage's own tool budget. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Searching for an existing depth counter or re-entry guard in the hook stack: none. The only cycle protection in the tree is the fan-out lineage's own tool budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for an existing depth counter or re-entry guard in the hook stack: none. The only cycle protection in the tree is the fan-out lineage's own tool budget.

### Treating hook delivery as the parity guarantee: one runtime documents its adapter as dormant under the tested build. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating hook delivery as the parity guarantee: one runtime documents its adapter as dormant under the tested build.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating hook delivery as the parity guarantee: one runtime documents its adapter as dormant under the tested build.

### Treating metadata `choreography` as the executed path: contradicted by `/create:agent`, whose router loads only assets, and by `/speckit:plan`, which loads reference cards rather than the SKILL.md. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating metadata `choreography` as the executed path: contradicted by `/create:agent`, whose router loads only assets, and by `/speckit:plan`, which loads reference cards rather than the SKILL.md.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating metadata `choreography` as the executed path: contradicted by `/create:agent`, whose router loads only assets, and by `/speckit:plan`, which loads reference cards rather than the SKILL.md.

### Treating the 62 bridge entries as "62 commands": entries over-count doctor subcommands and under-count five shipped commands. Rejected; command strings, not ids, are the unit that must be covered. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the 62 bridge entries as "62 commands": entries over-count doctor subcommands and under-count five shipped commands. Rejected; command strings, not ids, are the unit that must be covered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the 62 bridge entries as "62 commands": entries over-count doctor subcommands and under-count five shipped commands. Rejected; command strings, not ids, are the unit that must be covered.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Counting commands by recursive `find`: reports 90 vs the real 45 because the doctor fixture tree contains SKILL/ROUTER markdown. Rejected as an inventory method; group-level enumeration is the reliable count. (iteration 1)
- None. The three bridge sources are readable and the diff is complete at the id/command level. What remains open is the *authority* question (which source wins when they disagree), which needs the drift-guard tests, not more enumeration. (iteration 1)
- Treating the 62 bridge entries as "62 commands": entries over-count doctor subcommands and under-count five shipped commands. Rejected; command strings, not ids, are the unit that must be covered. (iteration 1)
- "Enablement is the whole story": if the 22 disabled bridges were enabled, plain prose would still not match, because their keywords are slash strings and their only plain-phrase path is the 8-row table. Enablement widens typed-slash recall only. (iteration 2)
- "The advisor deliberately abstains on commands": contradicted by the doctor family, which is fully enabled, read-only-flagged where appropriate, and renders runnable strings. Abstention is a property of non-doctor commands, not of commands as a class. (iteration 2)
- Searching for a separate "no-slash penalty" constant: there is none. The effect the spec describes is produced by the *absence* of a plain-language key on command projections plus the explicit lane's slash-only boost table, not by a negative constant. Recorded so later iterations do not hunt for a penalty that does not exist. (iteration 2)
- "Emit the command only when the skill is a command owner": this is what the doctor companion line already does, and it cannot express the mapping for non-doctor commands because no non-doctor id has a command string to give. (iteration 3)
- "Raise the token cap to make room for commands": contradicted by the measurement — the routing head is ~13 tokens of an 80-token budget, and the one overrun comes from a directive appended outside the cap. Raising the cap would grow the directive budget, not the command payload. (iteration 3)
- None unresolved. The single open thread is that `workflowMode` exists publicly but is unpopulated for command bridges; whether it is the intended carrier is a question for the skill-linkage angle, not this one. (iteration 3)
- Deriving risk from `allowed-tools`: Bash is declared by all 45 commands, so the signal is constant. (iteration 4)
- Deriving risk from the command name: `/doctor:install` is read-only by manifest and `/doctor:env` mutates, so names invert the truth on real examples. (iteration 4)
- Putting the policy in `AGENTS.md` as a second list: there are already four hand-maintained sources (three metadata hubs, `allow-list.json`, `_routes.yaml`, `scoring-compatibility.json`); a fifth would drift the same way. (iteration 4)
- Searching for a `risk`, `writes`, or `danger` field in command metadata: none exists under any name. The only risk vocabulary in the tree is doctor's `mutating`. (iteration 4)
- "Give the model the slash string and it will invoke it": no runtime exposes slash commands as model tools, and no repository rule instructs the model to type one. (iteration 5)
- "Runtime parity is a per-runtime brief problem": one renderer feeds all transports, so divergence lives in command mirroring and DSH's missing documentation row, not in the brief. (iteration 5)
- Looking for a model-invocable command mechanism in the hooks: the adapters only inject context or notices; none can dispatch a command. (iteration 5)
- A fifth inventory or a command registry: four hand-maintained sources already exist and iteration 1-2 showed the drift between them. (iteration 6)
- A new gate: Gate 2 already occupies the per-turn slot; a second gate would compete for the same prefix budget. (iteration 6)
- Hook-level enforcement of commands: the hook contract is fail-open by design and every adapter returns `{}` on failure. (iteration 6)
- Looking for an existing "command discovery" rule elsewhere in the ruleset: none. The closest text (`PLAN-WORKFLOW LOCK`, `sk-git` rule 16) forbids substitution but assumes the workflow is already named. (iteration 6)
- Relying on skill-to-command pointers alone: 1 of ~14 skills has one, and pointers cannot trigger discovery. (iteration 6)
- Inferring a command from a skill recommendation: unsound for 13 skills with no command pointer and for the 27 commands with no skill pointer. (iteration 7)
- Searching for a single canonical command→skill field: there is none. The three existing carriers (`skill_agent`, `ownerMode`, `allow-list.skillId`) are the whole vocabulary, and only `allow-list.skillId` covers commands without metadata. (iteration 7)
- Treating metadata `choreography` as the executed path: contradicted by `/create:agent`, whose router loads only assets, and by `/speckit:plan`, which loads reference cards rather than the SKILL.md. (iteration 7)
- A new benchmark harness: the doctor slice already has the exact shape (prose prompt → command id, `expected_second`, controls), and a second harness would duplicate its fixtures. (iteration 8)
- Looking for a command-level metric anywhere in the captured baseline or the bench files: none. `scorer-bench.ts` and the baseline both speak skill ids only. (iteration 8)
- Measuring command surfacing through the existing skill metrics: a command-only regression leaves all five baseline metrics unchanged, which is the failure this iteration exists to prevent. (iteration 8)
- Copying a command list into each runtime's static rule by hand: the tree already proves that pattern drifts (iteration 1's four sources) and already has a generator for the one block that stays in sync. (iteration 9)
- Searching for a non-Cursor static routing rule: none exists; Codex, Pi and DSH receive `AGENTS.md` directly and have no rules folder. (iteration 9)
- Treating hook delivery as the parity guarantee: one runtime documents its adapter as dormant under the tested build. (iteration 9)
- A separate "command loop breaker" subsystem: the cycle is one command calling the advisor, so a depth counter at the brief boundary is enough. (iteration 10)
- Relying on the ambiguity brief form for command ties: it takes two skill labels and has no slot for a command string. (iteration 10)
- Searching for an existing depth counter or re-entry guard in the hook stack: none. The only cycle protection in the tree is the fan-out lineage's own tool budget. (iteration 10)

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
- 9 of 9 key questions remain open; Q1 is two-thirds answered. (iteration 1)
- 8 of 9 remain open. (iteration 2)
- 7 of 9 remain open. (iteration 3)
- 6 of 9 remain open. (iteration 4)
- 5 of 9 remain open. (iteration 5)
- 4 of 9 remain open. (iteration 6)
- 3 of 9 remain open. (iteration 7)
- 2 of 9 remain open. (iteration 8)
- 1 of 9 remains open (failure modes, which this iteration touched but did not close). (iteration 9)
- None of the nine key questions remains open. Two carry-forward uncertainties are recorded for synthesis: whether doctor YAML workflows load their `skill_agent` skill (iteration 7 edge case), and whether the child-session brief is delivered in practice on each runtime (this iteration's missing dependency). (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None of the nine key questions remains open. Two carry-forward uncertainties are recorded for synthesis: whether doctor YAML workflows load their `skill_agent` skill (iteration 7 edge case), and whether the child-session brief is delivered in practice on each runtime (this iteration's missing dependency).

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Advisor runtime root: `.skilled/skills/system-skill-advisor/` (command-bridges, scorer projection and fusion, `render.ts`).
- Commands tree: `.skilled/commands/` (spec reports 45 commands).
- Root `AGENTS.md` Gate 2 (skill routing) and Gate 4 (skill-owned workflow tiebreakers) are the current model-facing policy surface.
- Prior packets: `specs/system-skill-advisor/003-doctor-command-surfacing/`, `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/`.
- `resource-map.md` not present at init; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only under `max-iterations`)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Current generation: 1
- Started: 2026-11-12T09:30:02.000Z
