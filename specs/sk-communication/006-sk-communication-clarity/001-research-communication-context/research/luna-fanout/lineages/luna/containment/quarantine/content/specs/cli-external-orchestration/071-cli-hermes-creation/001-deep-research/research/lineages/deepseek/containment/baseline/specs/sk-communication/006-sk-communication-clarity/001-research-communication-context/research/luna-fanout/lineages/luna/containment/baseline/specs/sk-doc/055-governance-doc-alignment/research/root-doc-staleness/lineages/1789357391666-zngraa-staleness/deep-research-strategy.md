# Deep Research Strategy - Session Tracking

Fan-out lineage `staleness` of the root-doc-staleness research packet (`specs/sk-doc/055-governance-doc-alignment`, Stream C, REQ-004). State continuity lives in this packet, not in any session's memory.

## 1. OVERVIEW

### Purpose

Persistent research plan for the lineage. Records what to investigate, what worked, what failed, and where to focus next. Read by the lineage (orchestrator, executor, and reducer duty are this same process) at every iteration.

### Usage

- **Init:** populated Topic, Key Questions, Known Context, and Research Boundaries from the fan-out invocation.
- **Per iteration:** the executor reads Next Focus, writes iteration evidence, and then performs the reducer's step inline: What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus are refreshed by this process (see `deep-research-config.json` `reducer.modeReason`).
- **Mutability:** mutable, analyst-owned sections stable, machine-owned sections rewritten after each iteration.
- **Protection:** shared state with explicit ownership boundaries. The one process here is orchestrator, executor, and reducer, so ownership boundaries are recorded, not enforced between processes.

## 2. TOPIC

Which parts of AGENTS.md no longer describe reality (class one, not reality: a named file, folder, script, command, flag or threshold that does not exist or no longer behaves that way), and which explain in detail what a delegate already owns (class two, redundant detail: the binding clause belongs in the repo rule, skill document, reference or asset, and the root document should carry a pointer). Keep the two failure classes strictly apart and cite file:line for every claim. Known confirmed instance of class one: `checklist.md` (the scaffolder produces spec.md, plan.md, tasks.md, implementation-summary.md and acceptance-criteria.md at every level and never a checklist.md; the verification checklist now lives inside tasks.md; the closure gate is acceptance-criteria.md). It appears in at least five places; find the rest of the class. Class two candidates to confirm or clear: the git safety table, the validate.sh subsection, Gate 3's vocabulary, the advisor metadata placement paragraph, the MCP routing section. Target shape: AGENTS.md section 6, a question-to-answer routing table with almost no restatement, keeping exactly one rule local and saying why. Three-way test on every class-two finding, case stated: case one, a delegate exists and genuinely carries it, so the root doc keeps a pointer, and the finding must quote the delegate's own line; case two, it must bind when no delegate loads (read-only turn where the gate never fires), so keep it, which is section 8's whole design; case three, it is prompt-time discipline no script or skill can enforce, so keep it, which is section 6's stated exception.

## 3. KEY QUESTIONS (remaining)

Generated from the reducer registry. Add external or late questions through `deltas/inbox.jsonl`; direct edits are imported as compatibility input and may be replaced on the next reduce step.

- [x] Q1: Which AGENTS.md lines instruct loading `checklist.md`, what exactly does the scaffolder produce at every level, and what are all the places of the failure? (class one, confirmed specimen: find every occurrence) — ANSWERED (iteration 1): five occurrences (AGENTS.md:263, 266, 270, 303, 463-verb-form); the scaffolder never produces it at any level (create.sh:12-16, 304-308, 450-456; zero checklist templates at any depth); the verification checklist lives in tasks.md and the closure gate is acceptance-criteria.md (template-mapping.md:159,161; 055 spec.md:124-125; census 0/1203+)
- [x] Q2: Beyond `checklist.md`, which named files, folders, scripts, commands, flags or thresholds in AGENTS.md do not exist or no longer behave as described? (class one, the rest of the class) — ANSWERED (iteration 2): one failure, the advisor invocation (AGENTS.md:99) exits 69/75 on this working tree, its compiled runner absent, the freshness guard failing before any daemon start or Python-scorer fallback (skill-advisor.cjs:62-69); everything else swept and cleared (37/37 paths, the validate.sh exit contract, the classifyPrompt export, both quoted section titles, the retrieval scripts, recommend-level's LOC+files+risk scoring, the design/figma/goal.md candidates)
- [x] Q3: Does the memory save rule (the specimen) carry redundant detail, and which of its bullets reduce to a pointer under the three-way test? (class two) — ANSWERED (iteration 3): class two CONFIRMED; bullets 284 (pointer half) and 286 case one, 285 case one with the frontmatter-shortcut residual, 282-283 case three (session-bound); the compiled path appears five times across three documents; the sixth, unnamed candidate (mandates table) splits: 477+479 case one, 478 case two by the delegate's own back-pointer
- [x] Q4: Which of the five named class-two candidates, the git safety table, the validate.sh subsection, Gate 3's vocabulary, the advisor metadata placement paragraph, and the MCP routing section, confirm as case one, and which are cleared as case two or case three? — ANSWERED (iterations 4-5): the git safety table (7/8 rows case one, the ask-first-worktree row case three); the validate.sh subsection plus the completion rule's step-1 parenthetical (case one twice: validation-rules.md:35 and :757-775 carry them, the reference stating its own ownership rationale at :758-760); Gate 3 (cleared, keep: the classifier owns the FIRE vocabulary only, the question texts are case three); the advisor metadata placement (case one: the contract's :32,40-41,65-73,77 carry it; the root keeps the:6-cross-link); the MCP routing (mixed: the:353 second sentence reduces to the skill:4 pointer, the:357 exemplar stays untouched, the:359 honesty clause stays case three, the:355 proviso pending its delegate check)
- [x] Q5: Does the section 6 question-to-answer routing shape govern the rewrite of each confirmed case-one finding, and where does it not apply? — ANSWERED (iteration 5): the shape governs every case-one rewrite (trigger → pointer → one clause → why); the keeps are exactly the clauses no delegate reaches: the:282-283 session state, the:478 single-scale back-pointer, the:324 conversational ask, the:67-72 and:76-77 question-time vocabulary, the:359 promise-time honesty, the:64 non-hook fire-sentence, and section 8's:401-405 summaries (the:407 stated design, not duplication); the adjudication carries its judgment disclosure (one model's reading, grounded in the quoted delegate lines; the sibling lineages' merge is what would confirm it)

## 4. NON-GOALS

- No edits to `AGENTS.md`, `REPO RULES.md`, `repo-rules/`, or any skill, reference, or asset: acting on findings is deferred until the packet's sequencing question is answered (`specs/sk-doc/055-governance-doc-alignment/spec.md` Files to Change, "Deferred").
- No resolution of the packet's Open Questions (sequencing; 006 ratification): Streams A and B own those.
- No third failure taxonomy: the two named classes stay strictly apart; anything else is noted as context, not classified.
- No continuity save via `generate-context.js` and no `validate.sh` run: the invocation binds every write to this lineage directory, and both would write outside it. Continuity save is non-blocking by the deep-research success criteria.
- Writes only inside this lineage directory; research reads anywhere.

## 5. STOP CONDITIONS

- Five iterations complete, then synthesis. `stopPolicy: max-iterations`; convergence before the cap is telemetry only, and the review angle broadens instead of stopping early.
- Three consecutive no-progress evidence iterations would enter stuck recovery (`stuckThreshold: 3`).
- A state-log record refused by the append gateway (exit 2) is repaired before the loop continues; the refusal names the failed check.

## 6. ANSWERED QUESTIONS

- Q1 (iteration 1): the class-one checklist.md failure is confirmed at five places (AGENTS.md:263, 266, 270, 303, 463-verb-form); the scaffolder produces spec.md, plan.md, tasks.md, implementation-summary (lifecycle) and, where the contract lists it, acceptance-criteria.md, never checklist.md; the verification checklist lives inside tasks.md and the closure gate is acceptance-criteria.md.
- Q2 (iteration 2): beyond checklist.md, one class-one instance, the documented advisor invocation failing its own freshness guard on this working tree (compiled CLI absent, shim exit 69/75, the documented daemon-start and Python-scorer fallback unreachable); the validate.sh exit contract, the classifier export, the quoted section titles, the trigger-index scripts, the recommend-level scoring, and the command roster all verified real and recorded as cleared observations.
- Q3 (iteration 3): the memory save rule confirms as class two, case one on 284 (pointer half) and 286, case one with the shortcut residual on 285, case three on 282-283 (prompt-time, session-bound); the sixth, unnamed candidate (mandates 475-479) is case one on 477+479 and case two on 478, kept by the uncertainty rule's own back-pointer (its :48-49); the duplication breeds one unstated scope tension (AGENTS.md:285 versus save.md:25,61).

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Occurrence-rg → producer evidence → consumption census chain: the scaffolder's own header and its closure-gate comment carried the strongest evidence, stronger than inferring from the packet (iteration 1)
- Existence and behavior probed separately, then each surprise settled from its owning source: the case-sensitive SMART ROUTING miss, the shim's delegation, and the RESULT: PASSED marker's delegation all resolved from the owning file, not the first grep (iteration 2)
- Reading BOTH delegates (the 627-line reference AND the 92-line command) before verdicting the specimen: the command surface carried the heaviest duplication and the case-one quotes needed the delegate that reaches the operator (iteration 3)
- Chasing the promised delegate into the skill TREE when the SKILL.md lacked the specifics: the seven-digit ordinal lived in a workflow-playbook and the allocator in a patterns reference; the quote-the-delegate's-own-line discipline forced the deeper, correct evidence (iteration 4)
- Ending on the adjudication rather than another sweep: the four prior iterations had accumulated exactly the evidence the:6 test consumes, and the keep-cases fell out of the delegates' own words rather than judgment (iteration 5)
<!-- /ANCHOR:what-worked -->

## 8. WHAT FAILED

- Compound bash with variable assignment plus a multi-branch && chain: the runner's dispatch wrapper rejected it ("Pi dispatch denied: the command does not prove one direct executor"); repaired by re-running as a simpler `cd && command` chain (iteration 1)
- The rendered prompt step (prompts/iteration-001.md) was not produced before the iteration 1 work; the fan-out invocation prompt itself carried the iteration-1 context. prompts/iteration-002..005 will be rendered before each iteration's research actions, per the lineage prompt-pack contract (documented deviation, iteration 1; honored from iteration 2 on)
- The `rg -rn` probe: -r consumed the next token as the replacement, so the advisor_recommend probe printed with the command name substituted; resolved by reading the shim and ARCHITECTURE.md directly (iteration 2)
- The strategy's question-injection surface said deltas/inbox.jsonl while the shipped reducer reads <artifactDir>/inbox.jsonl; caught during iteration 2's reducer duty and corrected in the registry and Section 13 (iteration 2)
- The specimen clause-coverage grep under-returned (the pattern missed "frontmatter directly"), costing one extra targeted pass, and the 627-line reference got a targeted rather than full read; neither cost a finding (iteration 3)
- The trap-grep pattern ("trap") missed the reference's FOUR WAYS heading because the reference says ways, not traps; the :765 hit and the Section 14 read recovered it (iteration 4)
- The:git ls-files glob did not reach the trigger-index data file, so the:81 committed-ness survives as INFERRED with the targeted command named; the:359/:355 delegate-absence calls rest on greps, not reads, and are marked as such (iteration 5)
<!-- /ANCHOR:what-failed -->

## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

## 10. RULED OUT DIRECTIONS

- checklist.md produced by the scaffolder at some documentation level: ruled out by the scaffolder's own header, help text, contract-doc function, the templates tree (zero *checklist* matches at any depth), and the 0/1203+ census (iteration 1, evidence: create.sh:12-16, 304-308, 450-456; templates find, this session)
- checklist.md required by the level-requirements reference (folder-structure.md): zero occurrences there; the name survives only in the phase-parent prohibited/legacy list (iteration 1, evidence: template-mapping.md:70; rg -c, this session)
- The advisor recommendation subcommand (advisor_recommend) being a stale spelling: the advisor's own ARCHITECTURE.md nine-command contract names it; the reaching failure is the missing compiled dist (iteration 2, evidence: ARCHITECTURE.md; test -e, this session)
- The memory save rule's mechanics (writer, paths, review, ownership) lacking a delegate: both delegates carry them; only the trigger pair, the one-line why, and the shortcut clause are undelgated (iteration 3, evidence: save-workflow.md:24,151-152,211-244,553-578; save.md:19,25,61,68,90)
- The shared gate-3 classifier carrying the A-E question texts: it defines the FIRE vocabulary only (ClassificationResult :107-119; the exported Gate3VocabularySnapshot :878-882) and none of the five option strings; the grep that resolves SpecRoot labels was the positive control (iteration 4, evidence: classifier :107-119,878-882; 0-hit grep)
- The worktree-vs-branch ask clause riding in sk-git or in blast-radius's stop-for-yes ladder: the skill's ask-hits are the push ask, its worktree references carry mechanics only, and blast-radius prices a one-line-revert fork as decide-and-move-on, which is the exception the clause quotes; caveat: the workflow-playbooks directory was not exhausted, the confirming rg is named in iteration-004.md (iteration 4, evidence: SKILL.md:301,375; shared-patterns.md:113-125; blast-radius.md:72)
- The retrieval unsupported-features clause (:315) stating facts no delegate carries: the retrieval conventions' own:64 row secondes it verbatim, with the:40 no-hit meaning and the:167-173 exit contract (iteration 5, evidence: retrieval-conventions.md:40,64,167-173)
- The goal-hook binary or the committed trigger index being a class-one residue: both exist beside the tracked retrieval scripts; only the:81 committed-ness of the data file remains INFERRED, with its confirming step recorded (iteration 5, evidence: test -e and find, this session)
<!-- /ANCHOR:ruled-out-directions -->

## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

## 11A. CARRIED-FORWARD OPEN QUESTIONS

[Self-owned open questions from iteration write-back, populated after iteration 1 completes]
<!-- /ANCHOR:carried-forward-open-questions -->

## 11. NEXT FOCUS

Synthesis (this iteration's successor step, iteration 5 complete): compile research.md at the lineage root, set the config's status to complete, emit the in-process resource-map, and record the terminal synthesis_complete event through the gateway with stopReason "maxIterationsReached". The loop terminates: five of five evidence iterations, the strategy questions 5/5, the cap reached (stopPolicy max-iterations; the convergence nomination — all questions answered — is recorded, and the cap governs the label).
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers: `AGENTS.md` (496 lines, repository root, the research target, read in full at init); the delegate surfaces it names: `repo-rules/*.md`, `.opencode/skills/{sk-git,sk-code,sk-doc,mcp-code-mode,system-skill-advisor,cli-external-orchestration,system-spec-kit,system-deep-loop}/`, `system-spec-kit/references/**`, `system-spec-kit/shared/gate-3-classifier.ts`, `system-spec-kit/runtime/cli/**`.
- Reuse candidates: AGENTS.md section 6 (lines 363-377), the question-to-answer routing table, is the in-document target shape; every case-one recommendation should be checkable against it.
- Integration points: packet REQ-004 (exactly 5 iterations, the two failure classes kept apart, every finding citing its case under the three-way discrimination test, file:line cites) and SC-002 (5 iteration files plus a synthesis, written only inside this packet). The runner's forced-depth validators: `research.md` at the lineage root, iteration files exactly 1..5, integer `iteration` records 1..5, and a synthesis event whose `stopReason` starts with `maxiteration`.
- Constraints and risks: writes confined to this lineage directory (fan-out invocation, binding); the append gateway is the only sanctioned state-log writer; the shipped reducer step is satisfied in-process (see `deep-research-config.json` `reducer.modeReason`); concurrency, another session editing the governance documents mid-research, is mitigated by citing what was actually read. Evidence tier: every finding marks OBSERVED (a path, line, or command output read this session) versus INFERRED, and states what would confirm the latter.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output, at this lineage's root
- Lifecycle branches: `new` (this run, generation 1); `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: the reducer step controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `inbox.jsonl` at the lineage root (the shipped reducer reads `<artifactDir>/inbox.jsonl`; corrected in iteration 2, previously written as deltas/inbox.jsonl)
- Question conflict owner: the reducer (in-process); conflicts surface as `question_conflict` records
- Canonical pause sentinel: `.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-09-14T03:59:54Z
