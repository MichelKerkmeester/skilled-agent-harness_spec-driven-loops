# Repo Rules Digest

## 1. How to use this digest

Read this instead of the rule files. Every claim cites a repo-relative `path:line` that was opened when this digest was written.
Section 3 is the gate: a Jev integration proposal that fails any question there is rejected or reworked before it is ranked.
Lines marked INFERRED apply a rule to Jev by reasoning. The rule itself says nothing about Jev, so treat those as the digest author's reading.
Precedence when rules seem to conflict: `AGENTS.md` hard blockers first, then an explicit operator instruction, then the rule files, then judgment (`REPO RULES.md:22-27`).

## 2. What the operator values

1. **Build the smallest thing that solves the stated problem.** Go bigger only after naming what fails at the smaller one (`.skilled/repo-rules/prevent-overengineering.md:44-45`).
   - Prevents: speculative machinery justified by "cleaner" or "a future caller might" (`.skilled/repo-rules/prevent-overengineering.md:47-49`).
2. **Walk the reversal-cost order, cheapest move first.** Build nothing, change a value, extend in place, add a function, add a file, add an abstraction, add a dependency (`.skilled/repo-rules/prevent-overengineering.md:58-66`). Each step up needs a written climbing sentence with a real symbol and caller (`.skilled/repo-rules/prevent-overengineering.md:55-56`, `:84-85`).
   - Prevents: reaching past the move you can justify.
3. **"Build nothing" is a real answer.** A surprising share of requests are already met by existing code (`.skilled/repo-rules/prevent-overengineering.md:77-78`).
   - Prevents: duplicating a capability the repository already has.
4. **Restraint limits how much you build, never how much you deliver.** Build the frozen scope and raise the amendment beside it (`.skilled/repo-rules/prevent-overengineering.md:149-152`, `.skilled/repo-rules/scope-discipline.md:56-58`).
   - Prevents: narrowing dressed as restraint, the most common and least visible drift (`.skilled/repo-rules/scope-discipline.md:52`, `:56`).
5. **Produce the smallest complete result early.** A complete in-scope artifact beats scaffolding or fallback paths the target does not need (`AGENTS.md:122`).
   - Prevents: half-built frameworks with no working slice.
6. **A claim is only as strong as the observation behind it.** Mark each load-bearing claim OBSERVED, DERIVED or INFERRED (`.skilled/repo-rules/evidence-and-proof.md:45-46`, `:52-56`).
   - Prevents: a confident summary certifying work nobody checked (`.skilled/repo-rules/evidence-and-proof.md:58-59`).
7. **Measure or leave it alone.** An unmeasured performance claim is a fabrication, not a caveat (`.skilled/repo-rules/evidence-and-proof.md:135-136`, `AGENTS.md:140`). "No regressions" needs a before-number, a whole-gate rerun and a reported delta (`AGENTS.md:161`, `.skilled/repo-rules/evidence-and-proof.md:128-133`).
   - Prevents: usefulness asserted from intuition.
8. **Decide the proof plan before the result exists.** Convert acceptance criteria into 1 to 5 observable pass/fail checks before changing files (`.skilled/repo-rules/evidence-and-proof.md:167-172`).
   - Prevents: the result becoming its own standard.
9. **One model is one opinion.** For a judgment question, diverge the lens, ground it in the repository, or escalate it (`.skilled/repo-rules/delegation-and-orchestration.md:118-125`). Two runs of the same model agreeing is the same opinion twice (`.skilled/repo-rules/delegation-and-orchestration.md:127-128`).
   - Prevents: a single verdict closing a question.
   - INFERRED for Jev: a Jev probability or score is one lens and cannot close a judgment question alone.
10. **Do not average disagreeing delegates.** Disagreement means the question was underspecified or the evidence is thin (`.skilled/repo-rules/delegation-and-orchestration.md:161-162`).
   - Prevents: a tally passing as a finding.
11. **Hardcode by default.** An option earns existence only when two real callers need different values today (`.skilled/repo-rules/prevent-overengineering.md:115-117`).
   - Prevents: permanent branches in code, docs and test matrix.
12. **Two is not a pattern.** One instance is a case, two a coincidence, three a pattern (`.skilled/repo-rules/prevent-overengineering.md:119-121`, `AGENTS.md:143`).
   - Prevents: a wrong abstraction that costs more than the duplication.
13. **Size effort to what the change can break.** Irreversible steps need a written rollback and an explicit yes (`.skilled/repo-rules/blast-radius.md:41-42`). Reversible steps get decided, not deliberated (`.skilled/repo-rules/blast-radius.md:72-76`).
   - Prevents: both a risky step without rollback and a cheap step stalled at a fork (`.skilled/repo-rules/blast-radius.md:78-80`).
14. **Fix the producer, not the symptom.** Every fix names its mechanism (`.skilled/repo-rules/root-cause-and-debugging.md:41-45`).
   - Prevents: special cases, retries and sleeps that hide the real bug (`.skilled/repo-rules/root-cause-and-debugging.md:72-80`).
15. **Never fabricate.** Write `UNKNOWN` plus what would resolve it (`.skilled/repo-rules/uncertainty-and-honesty.md:41-42`, `:62-64`). Never invent flags, env vars, config keys, API shapes or benchmark figures (`.skilled/repo-rules/uncertainty-and-honesty.md:66-68`). Check fast-moving names such as model ids and CLI flags live (`.skilled/repo-rules/uncertainty-and-honesty.md:74-77`).
   - Prevents: invented Jev endpoints or parameters quoted back as fact.
16. **Code and commands beat docs and memory.** Where a doc and the code disagree, the code wins and the doc is a defect (`.skilled/repo-rules/evidence-and-proof.md:220-224`).
   - Prevents: a design built on a README's description of behavior.
17. **Answer the actual request.** No silent narrower or safer version, no invented constraint, no estimate used as a gate (`.skilled/repo-rules/answer-the-actual-request.md:43-44`, `:61-65`, `:92-99`).
   - Prevents: stalling dressed as diligence. When the task is too big, name the smallest slice worth delivering and start there (`.skilled/repo-rules/answer-the-actual-request.md:97-99`).
18. **Test what changed, not what exists.** Coverage floor is happy path plus one edge case per public surface. Above it, a test must fail for one real reason no current test catches (`AGENTS.md:133`).
   - Prevents: test bloat that mirrors the implementation.
19. **Catch only what you can handle.** A catch that swallows into a default turns a loud failure into a silent wrong answer (`.skilled/repo-rules/prevent-overengineering.md:123-124`).
   - Prevents: a failed Jev call quietly returning a neutral score (INFERRED application).

## 3. Recommendation fitness checklist

Every Jev integration proposal must answer yes to each question, or state which one it fails and why that is acceptable.

1. **Does it name a metric, a baseline and a harness?** The metric is measured before the change, the whole gate is rerun after, and the delta is reported, including what did not move.
   - Source: `AGENTS.md:161`, `.skilled/repo-rules/evidence-and-proof.md:128-136`.
2. **Is the proof plan written before the build?** One to five pass/fail checks, each naming the command, the expected artifact and the boundary case.
   - Source: `.skilled/repo-rules/evidence-and-proof.md:167-172`.
3. **Did it try "build nothing" first?** It names the existing skill, script or heuristic that already covers the need, or shows why that fails.
   - Source: `.skilled/repo-rules/prevent-overengineering.md:60`, `:77-78`.
4. **Does every move past the cheapest carry a climbing sentence with a real symbol and caller?**
   - Source: `.skilled/repo-rules/prevent-overengineering.md:55-56`, `:84-85`.
5. **Is the first deliverable the smallest complete slice?** It works end to end for one caller, with no scaffolding for later callers.
   - Source: `AGENTS.md:122`, `.skilled/repo-rules/answer-the-actual-request.md:97-99`.
6. **Is every new option, abstraction and dependency needed by a caller today?** No "for flexibility", no "might need", no two-instance abstraction.
   - Source: `.skilled/repo-rules/prevent-overengineering.md:115-121`, `:160-162`, `AGENTS.md:139`, `:143`.
7. **Is it opt-in, and does it degrade cleanly with no Jev key?** With no key, the workflow behaves exactly as it does today and says so plainly, with no silent default score.
   - Source: the fallback rule requires a named environment for any degraded path (`.skilled/repo-rules/prevent-overengineering.md:136-139`), and a swallowed failure is a silent wrong answer (`.skilled/repo-rules/prevent-overengineering.md:123-124`, `.skilled/repo-rules/root-cause-and-debugging.md:80`).
   - INFERRED: "an operator without a Jev key" is the named environment that justifies the no-key path, and an off-machine call must not run unasked (see question 9).
8. **Are the owner, one real caller (`file:line`) and the frozen contract named before any shared surface is touched?** This covers hub registries, skill routers, deep-loop state files, advisor scoring and JSONL schemas. It also enumerates who still speaks the old contract, found by search rather than assumed.
   - Source: `.skilled/repo-rules/prevent-overengineering.md:95-98`, `AGENTS.md:144`, `.skilled/repo-rules/blast-radius.md:107-118`.
9. **Does no secret or sensitive content leave the machine without the operator knowing?** Keys stay in the environment and never appear in logs, prompts or artifacts. Any payload sent to Jev is treated as published.
   - Source: any call leaving the machine and any touch of secrets fires the blast-radius rule (`.skilled/repo-rules/blast-radius.md:36-37`), and sending is publishing (`.skilled/repo-rules/blast-radius.md:69-70`). A committed secret needs rotation by the operator (`.skilled/repo-rules/blast-radius.md:138-139`).
10. **Is it reversible, or is its blast radius named with a rollback sentence?** The proposal places itself on the reversibility ladder and completes "To undo this: ___".
   - Source: `.skilled/repo-rules/blast-radius.md:48-50`, `:59-63`, `:86-89`.
11. **Is a Jev judgment treated as one lens, not a verdict?** Where it decides something that matters, it is grounded against the repository or cross-checked with a different lens.
   - Source: `.skilled/repo-rules/delegation-and-orchestration.md:118-128`, `AGENTS.md:160`.
12. **Does it add no new dependency, or does it justify one?** A dependency is the costliest move, needs its climbing sentence and an install waits for a yes.
   - Source: `.skilled/repo-rules/prevent-overengineering.md:66`, `:141-143`, `.skilled/repo-rules/blast-radius.md:145-147`, `AGENTS.md:116`.
13. **If it wires a hub mode or alias, does it plan to verify both routing stages?** A registered mode is not a routed mode, and a new alias is replayed against an out-of-domain phrase.
   - Source: `.skilled/repo-rules/skill-hub-routing.md:43-45`, `:53-60`, `:94-96`.
14. **Does it respect an approved workflow instead of hand-rolling a substitute?** If a plan names a workflow, Jev plugs into it, and any deviation is stated for approval.
   - Source: `AGENTS.md:20-30`.
15. **Does it cover the tests the change earns, and no more?** Happy path plus one edge case per public surface, including the no-key path.
   - Source: `AGENTS.md:133`.
   - INFERRED: the no-key path counts as the edge case for an opt-in surface.

## 4. Red flags to reject

Reject or rework a proposal that shows any of these.

- **"Flexible", "future-proof", "might need", "scalable", "extensible".** An abstraction no current requirement earns (`AGENTS.md:139`, `.skilled/repo-rules/prevent-overengineering.md:39`).
- **"Could be slow", "might bottleneck", or any usefulness claim without numbers.** A cost or benefit asserted without measurement (`AGENTS.md:140`, `.skilled/repo-rules/prevent-overengineering.md:133-134`).
- **"Best practice", "always should".** A pattern imported without naming the failure it prevents here (`AGENTS.md:141`, `.skilled/repo-rules/communication-decisions.md:79-83`).
- **"While we're here", "also add", "might as well".** Work outside the frozen scope (`AGENTS.md:142`, `.skilled/repo-rules/scope-discipline.md:53`).
- **"DRY this up" across two call sites.** Similarity mistaken for sameness (`AGENTS.md:143`).
- **A config option "so we can change it later".** Hardcode it (`.skilled/repo-rules/prevent-overengineering.md:108`).
- **A wrapper that only forwards arguments.** Call the thing directly (`.skilled/repo-rules/prevent-overengineering.md:109`).
- **A fallback path for an environment nobody named.** "In case" is not an environment (`.skilled/repo-rules/prevent-overengineering.md:136-139`).
- **Defensive checks on what a type or caller contract already guarantees.** They teach readers to code around a ghost (`.skilled/repo-rules/prevent-overengineering.md:126-128`).
- **A retry around a deterministic call, a sleep, a broadened catch, a default that papers over a missing value.** Symptom fixes (`.skilled/repo-rules/root-cause-and-debugging.md:72-80`).
- **A change that touches callers or a shared contract without naming them.** The blast radius is wider than the file (`AGENTS.md:144`).
- **Delegation that costs more than doing the work.** Most tasks are cheaper done directly (`.skilled/repo-rules/delegation-and-orchestration.md:53-56`, `:207-209`). INFERRED for Jev: a Jev call that costs more latency, money or operator attention than the judgment it replaces fails the same test.
- **Averaging or tallying disagreeing judgments.** A tally is not a finding (`.skilled/repo-rules/delegation-and-orchestration.md:161-162`).
- **A new dependency with no climbing sentence.** Permanent supply-chain and trust surface (`.skilled/repo-rules/prevent-overengineering.md:66`, `:141-143`).
- **A test weakened, skipped or re-baselined to get green.** Never a fix (`.skilled/repo-rules/root-cause-and-debugging.md:111-117`).
- **An alias broad enough to catch unrelated work.** Misroutes surface only when someone types it (`.skilled/repo-rules/skill-hub-routing.md:94-96`).

## 5. What UX and ease of use mean here

The rules define operator experience mostly through what the operator must read, decide and do. INFERRED: a Jev integration serves UX when it removes a decision or a check from the operator, and hurts it when it adds a flag, a prompt or a report to parse.

**Defaults.**
- The default is the existing behavior. Decide cheap reversible forks yourself and keep going (`.skilled/repo-rules/blast-radius.md:72-76`).
- Hardcode rather than add a knob (`.skilled/repo-rules/prevent-overengineering.md:115-117`). INFERRED: one opt-in switch for an off-machine call is justified by the blast-radius rule, a second tuning knob is not until two callers need it.
- Do not ask permission to continue an approved, in-scope step (`AGENTS.md:126`).

**Operator friction.**
- Ask only when the answer changes the work. If both readings lead to the same action, pick one, state the assumption and proceed (`.skilled/repo-rules/uncertainty-and-honesty.md:55-56`).
- Consolidate questions into one prompt (`AGENTS.md:104`).
- A structured choice needs nameable alternatives, an answer that changes the next step and no way to resolve it yourself. It always carries a recommendation (`.skilled/repo-rules/communication-handoff.md:131-143`).
- Padding the operator's to-do list with your own work trains them to skim (`.skilled/repo-rules/communication-handoff.md:109-110`).
- Investigate up to three passes before asking (`.skilled/repo-rules/uncertainty-and-honesty.md:51-53`).

**Communication.**
- The first line carries the payload, and the outcome fits in two lines (`.skilled/repo-rules/communication.md:143-144`, `:194-195`).
- No tables in a reply, and no group shows more than five items (`.skilled/repo-rules/communication.md:91-94`, `:181-183`).
- Qualify only when it changes what the reader should do (`.skilled/repo-rules/uncertainty-and-honesty.md:130-134`). INFERRED for Jev: surface a probability or score to the operator only when it changes their next action.
- Verdict first, one recommended path, required separated from optional (`.skilled/repo-rules/communication-decisions.md:48`, `:72-77`).
- A synthesis carries its findings in the message, not just a path and a count (`.skilled/repo-rules/communication-decisions.md:139-147`).
- Plain words, no em dash, no semicolon, no serial comma (`.skilled/repo-rules/communication-prose.md:78-80`, `:92-99`).

**Handoff.**
- End every turn by naming what is now the operator's to do, or saying nothing is (`.skilled/repo-rules/communication-handoff.md:55`, `:116`).
- Show completed work: the command and its exit status before any interpretation (`.skilled/repo-rules/communication-handoff.md:85-90`).
- Name anything still running with its real state, and what resumes you (`.skilled/repo-rules/communication-handoff.md:180-192`).
- Close with honest status: what ran, what is inferred, what only the operator can verify, and edited versus committed versus pushed (`.skilled/repo-rules/evidence-and-proof.md:191-197`).

## 6. Hard constraints any integration must respect

- **Comment hygiene.** Never put spec paths, packet or phase numbers, or task and finding ids in code comments. Keep the durable why (`AGENTS.md:32-34`). This is a hard block that nothing overrides.
- **Read first and scope lock.** Never edit an unread file. Only modify files in scope, and scope in `spec.md` is frozen (`AGENTS.md:13-14`). Adjacent defects are recorded and reported, not fixed (`.skilled/repo-rules/scope-discipline.md:94-100`).
- **What always needs a yes first.** A new dependency, a file outside the named area, deleting code you did not write, a cross-file rename, a formatting sweep (`.skilled/repo-rules/scope-discipline.md:79-85`).
- **Verification.** Syntax checks and tests pass before any completion claim (`AGENTS.md:15`, `:18`). Verify by content, not exit code, and exit 0 with no output is suspicious (`.skilled/repo-rules/evidence-and-proof.md:87-97`). Final-state verification reruns the proof plan and the whole gate and removes task residue (`AGENTS.md:165-170`). Spec completion requires an explicit `RESULT: PASSED` from `validate.sh --strict` (`AGENTS.md:174`).
- **Halt conditions.** Stop when confidence is below the bar, line numbers do not match, or tests fail (`AGENTS.md:16`). Halt and report LOGIC-SYNC on a contradiction (`.skilled/repo-rules/uncertainty-and-honesty.md:96-104`).
- **Plan-workflow lock.** A workflow named in an approved plan is frozen. Read its contract before claiming friction, and never silently hand-roll a substitute (`AGENTS.md:20-28`).
- **Irreversible actions.** A send, a publish, an external call with side effects or a non-allowlisted push needs a written rollback and an explicit yes. Approval does not transfer (`AGENTS.md:116`, `.skilled/repo-rules/blast-radius.md:63`, `:98-101`).
- **Git safety.** Never choose the workspace or create a branch with git primitives. Ask before every push outside the sk-git allowlist (`AGENTS.md:207-208`). Commit by named paths, never the whole index, when a delegate shares the tree (`.skilled/repo-rules/delegation-and-orchestration.md:189-201`).
- **Delegated workers.** Bind write authority before dispatch, freeze scope in the brief, and put gate answers in the prompt, since a model cannot read an env var (`.skilled/repo-rules/delegation-and-orchestration.md:74-91`). While a fan-out lineage runs, nothing outside its directory changes (`.skilled/repo-rules/delegation-and-orchestration.md:78-81`).
- **Opt-in env flags.** The gate-waiver flags `SYSTEM_SPEC_GATE_ENFORCE=0` and `AI_SESSION_CHILD=1` show the repository already uses env vars to mark non-interactive runs (`AGENTS.md:61`). No rule file names a Jev flag. INFERRED: a Jev switch should follow the same opt-in shape, default off, and its exact name must be verified live in the cli-jev skill before any proposal cites it (`.skilled/repo-rules/uncertainty-and-honesty.md:66-68`, `:74-77`).
- **Hub wiring.** Report a mode as routed only after checking both stages against the hub you changed, with the hub path passed to the per-hub gate (`.skilled/repo-rules/skill-hub-routing.md:43`, `:85-86`).
- **Artifact routing.** The first code write routes through `sk-code`, the first `.md` write through `sk-doc` (`AGENTS.md:84`).
