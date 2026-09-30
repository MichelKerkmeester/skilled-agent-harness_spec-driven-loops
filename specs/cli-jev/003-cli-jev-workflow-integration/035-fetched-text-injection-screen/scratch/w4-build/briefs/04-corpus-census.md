GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/code.md; focused summary for a one-change brief) ===
You are @code, a leaf implementer dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. Read each file before editing it and re-read the edited region after.
Standards: read .skilled/skills/sk-code/SKILL.md and follow the route it resolves for this file type.
Comment hygiene is a hard block: no spec paths, packet or phase numbers, or REQ/task ids in code comments. Keep the durable why.
Verification: run only the checks this brief lists. Fail closed: no retry loop, no workaround. Report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: code) ===

TASK: add buildCorpus, corpusCensusLines and ruleLines to S (rest of R section 5), a fixture corpus helper to T, and two tests.
R = specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build/briefs/ref/design.md (read only). S and T exist; read both first. Read R sections 1, 2, 3 and 5 only.

STEP 1. In S section 5, after lexicalHit, add exported buildCorpus(repoRoot, commit, contextDir, tracked), corpusCensusLines(corpus)
and ruleLines() with JSDoc, exactly per R section 5. buildCorpus reads each document only through readAtCommit. Change nothing else.

STEP 2. In T, after makeRepo, add two private helpers:
 - sectionDoc(title): `# ${title}\n` followed by five lines `${title} line 1.` to `${title} line 5.`, each ending '\n' (6 lines).
 - corpusFiles(): an object; for each group of ['alpha-main', 'beta-main', 'gamma-main', 'delta-main'] and n from 1 to 30,
   key `${CONTEXT}/external repo's/${group}/doc-${String(n).padStart(2, '0')}.md` = sectionDoc(`${group} ${n}`); plus
   `${CONTEXT}/social posts/post.md` = '# short\nx\n'; `${CONTEXT}/ideas from michel kerkmeester.md` = sectionDoc('notes');
   `${CONTEXT}/external repo's/alpha-main/.env.example` = 'PLACEHOLDER=1\n';
   'specs/demo/deep-research-state.jsonl' = '{"toolsUsed":["WebFetch"]}\n';
   '.claude/agents/researcher.md' = '---\nname: researcher\ntools: Read, WebFetch\n---\n'.
STEP 3. Append two tests to the end of T:
 a. 'buildCorpus reads the fixture at its commit and prints the census':
    root = makeRepo(corpusFiles()); head = S.headCommit(root);
    corpus = S.buildCorpus(root, head, CONTEXT, S.trackedFiles(root)); lines = S.corpusCensusLines(corpus);
    assert.deepEqual(lines, [
      `corpus census: commit=${head} files=121 refused=1 excluded=1`,
      'corpus: source="alpha-main" files=30 sections=30 in_band=30 lexical_hits=0',
      'corpus: source="beta-main" files=30 sections=30 in_band=30 lexical_hits=0',
      'corpus: source="delta-main" files=30 sections=30 in_band=30 lexical_hits=0',
      'corpus: source="gamma-main" files=30 sections=30 in_band=30 lexical_hits=0',
      'corpus: source="social posts" files=1 sections=1 in_band=0 lexical_hits=0',
      'corpus: total sections=121 in_band=120 lexical_hits=0' ]);
    assert.equal(corpus.docs[0].sections[0].sha12, S.sha12(`# alpha-main 1\n${[1, 2, 3, 4, 5].map((i) => `alpha-main 1 line ${i}.`).join('\n')}`));
 b. 'ruleLines prints the patterns, the instruction and the keep rule before any label':
    const rules = S.ruleLines(); assert.equal(rules.length, 5);
    assert.equal(rules[0], `lexical patterns sha256=${S.sha256(S.LEXICAL_PATTERNS.join('\n'))}: ${S.LEXICAL_PATTERNS.join(' | ')}`);
    assert.equal(rules[1], `instruction sha256=${S.sha256(S.INSTRUCTION)}: ${S.INSTRUCTION}`);
    assert.equal(rules[3], 'margin: 0.10'); assert.equal(rules[4], S.KEEP_RULE_LINE);

VERIFY (repo root), paste each result line:
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs
  grep -c "^test('" .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs   (expect 11)
Accept when: 2 files changed (S and T) and nothing else; both node --check exit 0; T holds 11 tests.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen
- Other workers edit other files in this tree at the same time. Touch only the files this brief names.
- The orchestrator runs the test suites, spec validation and every git commit after you return.
- Your sandbox may block test runners that open local sockets (tsx, vitest). Run only the checks listed here; the orchestrator runs the rest.

DON'T
- Edit, create or delete any file this brief does not name.
- Run a git command that writes (add, commit, stash, checkout, restore, reset, merge, rebase, push).
- Install anything (npm/pnpm/pip/brew install, npm ci) or touch node_modules.
- Open any .env file, print environment variables, or write a key or token into any file.
- Call jev, the local Deem server (127.0.0.1:8300) or any network service.
- Put spec paths, packet or phase numbers, or REQ/task ids in code comments.
- Reformat, reorder or "improve" anything outside the named edit.
- Ask a question. If a step cannot be done exactly as written, stop and report BLOCKED with the reason.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
