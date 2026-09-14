# Iteration 4: The five named class-two candidates, first half, the git safety table, the validate.sh subsection, Gate 3

focusTrack: redundant-detail

## Focus

For each of the three candidates: does a delegate exist and genuinely carry the mechanics (case one: quote the delegate's own line), or must the clause stay because nothing else reaches it (case two: the read-only-turn bind; case three: prompt-time discipline)? (Strategy question Q4, first half.)

## Actions Taken

1. Read the sk-git skill's ownership声明 and ran the mechanics greps over the SKILL.md and its references: naming, allocator, Commit-Id, allowlist, bypass, hooks, live-sync, and the ask-first-worktree clause.
2. Found the deeper delegates in the skill TREE: conventional-commit-workflows.md (the seven-digit ordinal, the hook refusal semantics) and shared-patterns.md (the clone-wide-locked allocator), then read their operative lines.
3. Read references/validation/validation-rules.md: the severity table, the CLI taxonomy line, and §14 "INVOKING VALIDATE.SH: FOUR WAYS A RUN LIES".
4. Grepped the shared classifier for the A-E option texts (0 hits) and read ClassificationResult and the vocabulary-snapshot interface.
5. Checked the traps' presence in the reference: the literal word "trap" never appears; the four ways are the numbered list under §14.

## Findings

- **F-004-1 (OBSERVED — the git safety table, AGENTS.md:318-331: seven of eight rows are case one; the ask-first row is case three).** The skill genuinely carries the mechanics, in these, the delegates' own words: the commit-identity mechanics live at conventional-commit-workflows.md:32, "Every commit ends with a contiguous trailer paragraph. Packet work carries `Spec: <track>/<packet>[/<phase>...]`... A stamped commit carries `Commit-Id: NNNNNNN`, a seven-digit zero-padded ordinal minted once in commit order and never reissued," and :34, "The `commit-msg` hook whitelists both keys, refuses an id that is not exactly seven digits and refuses an id that already belongs to another commit" [SOURCE: .opencode/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md:32,34]; the allocator lives at shared-patterns.md:34, "`{NNN}` is allocated by `worktree-naming.sh`, which holds the clone-wide lock (per-namespace counters: `worktrees/` and `branches/` each number independently)" [SOURCE: .opencode/skills/sk-git/references/shared-patterns.md:34,57]; the ask-before-push lives at SKILL.md:301, "**MANDATORY**: The AI must NEVER push a branch to `origin` outside the remote allowlist without a fresh, explicit go-ahead for THAT push — a prior approval doesn't carry forward to the next push," with the one-invocation bypass at :307, "Once granted, set `SPECKIT_ALLOW_REMOTE_PUSH=1` for that one `git push` only, never the session. The [pre-push hook]... backstops this" [SOURCE: .opencode/skills/sk-git/SKILL.md:301,303,307,375]; the hook-install/verify duty lives at :314-321 ("advisory hook evaluates every visible `git` command... All six AI runtimes carry the same shared hook... Full docs: [scripts/hooks/README.md] (registration, delivery, ...)") and :626 (the feature-catalog: "naming allocator/validators (`scripts/worktree-naming.sh`)... naming hook (`.opencode/scripts/git-hooks/pre-push`), CI autosync"); the live-sync leg and its disable surface live at :297 ("The wrapper exports `SPECKIT_LIVE_BRANCH` + `SPECKIT_AUTOSYNC`... Full model: [continuous-integration.md]"); and the skill's own ownership sentence, the case-one, is :79: "Owns: git worktree / create worktree / numbered worktree / ... / branch naming allocator / skilled branch / ... Does NOT own: spec folders, memory, continuity, save context (system-spec-kit); code implementation, tests (sk-code)." [SOURCES: .opencode/skills/sk-git/SKILL.md:79,297,301,303,307,314-321,626]. The surviving row: **the ask-first-worktree clause (AGENTS.md:324) is case three**. The mechanics it guards are the skill's (shared-patterns.md:113-125 carries the create-commands, not the choice); blast-radius's own ladder prices a reversible fork as decide-and-move-on ("A change that reverts in one line does not earn... a question to the operator" [SOURCE: repo-rules/blast-radius.md:72-76]), so the ask is precisely the quoted exception, and no skill file carries the A/B requirement (the only ask-hits in the skill are the PUSH ask at :301,375; the completeness caveat: the workflow-playbooks directory was not exhaustively read; INFERRED, what would confirm: `rg -in "A\) Create|B\) Work|ask the operator" .opencode/skills/sk-git/feature-catalog/`).
- **F-004-2 (OBSERVED — the validate.sh subsection and the rule's step-1 parenthetical: case one, twice over).** The reference carries its own ownership rationale and the root then repeats it: §14's preamble, "These are properties of the harness rather than of any one repository, and each has already certified a broken packet as green. They belong here because this document owns what a validation run means; a copy kept anywhere else goes stale the first time the harness moves" [SOURCE: .opencode/skills/system-spec-kit/references/validation/validation-rules.md:757-760] — the root's "The harness has four ways of reporting a pass it did not perform, and each has already certified a broken packet as green" (AGENTS.md:274-275) is that sentence, shortened. The four numbered traps, each with its exact command (rebuild; realpath+NODE_PRESERVE_SYMLINKS; first-RESULT-line; regenerate metadata), are items 1-4 of §14 (:764-775). The exit-code semantics the rule states at AGENTS.md:262 are the reference's:35, near-verbatim: "CLI taxonomy: `0` = success, `1` = user error, `2` = validation error, and `3` = system error. `--strict` selects the rules that only run under strict; a warning stays advice in both modes and never changes the exit code. A rule that should block reports an error itself." [SOURCE: validation-rules.md:35]. The requirement itself (":765: 1. **Require an explicit `RESULT: PASSED`.**...") is likewise the reference's own numbered item. What the root irreducibly keeps: the CLAIMING-DONE trigger that routes there, and the four-step completion order; the wording, the traps, the commands, and the warning-philosophy all reduce. (Class-two, case one; the specimen's pattern exactly, including a third copy: the root's:463 quick-reference row repeats "validate.sh --strict → checklist → reconcile".)
- **F-004-3 (OBSERVED — Gate 3: cleared, keep; the invocation's suspicion does not survive its own three-way test).** The machine contract owns the FIRE vocabulary, not the question vocabulary. The classifier's result carries the fire decision, `ClassificationResult { triggersGate3, requiresGate3Prompt, satisfiedBy, writeBoundary, reason: 'file_write_match' | 'memory_save_match' | 'resume_match' | 'read_only_override' | 'no_match', matched }` [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:107-119], and the snapshot it exports for non-TS consumers is explicitly the fire vocabulary: "Serializable JSON snapshot of the vocabulary (for Python / YAML consumers). export interface Gate3VocabularySnapshot { version; fileWrite: patterns; memorySave: patterns; ...}" [SOURCE: :878-882]. The A-E option texts appear nowhere in the classifier: zero hits for `'A)'`, `Existing`, `Update related`, `Skip`, or "Reply with the folder path" (the same rg demonstrably works on this file: it found the SpecRoot labels at :127,137,375-376). Therefore the ROOT's,64 fire-sentence is the human-readable twin of the classifier's,66 pointer (the root's own words: "the human-readable form for runtimes that do not [call it]"), the,67-72 option texts are question-time vocabulary no delegate carries (case three: the gate question is conversational discipline), and the,73-74 guard bullets are already the target shape, pointers with a one-clause why ("the phase score and the level score are different scales and conflating them is the common error"). What survives of the invocation's suspicion: the,64 sentence itself, which is the case-two keep (it binds on a non-hook runtime where the classifier never loads), not a duplication to delete.

## Questions Answered

- Q4 answered for three of the five candidates: the git table (7/8 case one, the ask-first-worktree row case three), the validate.sh subsection (case one, twice: the rule's step-1 parenthetical AND the subsection), and Gate 3 (cleared, keep, case two plus case three).

## Questions Remaining

- Q4's second half: the advisor metadata placement paragraph and the MCP routing section (iteration 5).
- Q5: the section 6 shape question, adjudicated across all confirmed findings (iteration 5).

## Sources Consulted

- AGENTS.md:63-77 (Gate 3), 260-262, 272-278 (validate.sh), 316-331 (the git mandates + the safety table), 463 (the claim-completion row)
- .opencode/skills/sk-git/SKILL.md:79,297,301,303,307,314-321,374-375,381-382,489-518,626
- .opencode/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md:32,34,43,46
- .opencode/skills/sk-git/references/shared-patterns.md:24,34,57,113-125
- .opencode/skills/system-spec-kit/references/validation/validation-rules.md:28-35,757-775
- .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:107-119,855-860,878-882
- repo-rules/blast-radius.md:72 (the decide-and-move-on clause, loaded at this session's Gate 5)

## Assessment

- newInfoRatio: 1.0
- Novelty justification: three candidate adjudications with their delegates' own lines, the 7/8-1/8 split of the git table, the double duplication of the validate.sh contract, and the classifier's fire-only ownership are all first recordings; the case-one quote standard produced evidence iterations 1-3 do not contain.
- Confidence: every quoted delegate line OBSERVED this session. INFERRED, with the confirming step named: that no sk-git workflow-playbook carries the worktree A/B ask (the playbooks directory was not exhausted); and that the vocabulary snapshot's later fields do not secretly carry the option texts (the interface opened at :878 shows its first three keys; the shapes, not the question texts, are the snapshot's business).

## Reflection

What worked: chasing the promised delegate into the skill TREE when the SKILL.md came back without the specifics. The root's "seven-digit" appeared in a workflow-playbook, not the skill proper, and the allocator in a patterns reference; the case-one discipline (quote the delegate's own line) is what forced the deeper search.
What failed: the trap-grep pattern ("trap") missed the reference's "FOUR WAYS" heading, because the reference says ways, not traps; the targeted :765 hit and the §14 read recovered it. The completeness caveat above is the honest cost of the reference-sized sources.
Ruled out (see deltas/iter-004.jsonl): that the classifier carries the A-E question texts, and that the worktree-ask clause rides in sk-git or blast-radius.

## SCOPE VIOLATIONS

None. Every write this iteration stayed inside the lineage directory.

## Recommended Next Focus

Iteration 5: the five named candidates, second half, plus the adjudication. The advisor metadata placement paragraph (AGENTS.md:110-112) against the skill-root-metadata-contract: does the contract's own placement table carry the hub-only/standalone/none-below rules (case one, quote it), and which clauses survive (the cross-guard: "Never the same file, never interchangeable", and the §6 back-reference). The MCP routing section (AGENTS.md:351-359) against the naming convention and the configs: which sentences are the configs' own roster-discovery discipline. Then Q5: the section 6 shape, applied to every confirmed case-one finding, with the keep-cases (the specimen's 282-283, the mandates' 478, the worktree-ask, Gate 3) argued, not asserted.
