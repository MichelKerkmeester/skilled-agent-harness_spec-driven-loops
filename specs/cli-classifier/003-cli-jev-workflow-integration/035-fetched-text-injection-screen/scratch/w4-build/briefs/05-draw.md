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

TASK: add the seeded draw to S (R section 6) and one test to T.
R = specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build/briefs/ref/design.md (read only). S and T exist; read both first. Read R sections 1, 2 and 6 only.

STEP 1. In S section 6 (DRAW), under its divider, add exported mulberry32, drawRows, readJsonl, writeJsonl and
holdsOperatorContent with JSDoc, exactly per R section 6. The row key order and the order of the rand() calls are part of
the contract: the shuffle first, then one rand() per planted row while rows are built in order. Change nothing else in S.

STEP 2. Append one test to the end of T:
 'drawRows is reproducible, caps each source and holds no text':
    root = makeRepo(corpusFiles()); head = S.headCommit(root);
    corpus = S.buildCorpus(root, head, CONTEXT, S.trackedFiles(root));
    first = S.drawRows(corpus, 7); second = S.drawRows(corpus, 7);
    assert.deepEqual(first, second); assert.notDeepEqual(S.drawRows(corpus, 8).labels, first.labels);
    assert.equal(first.labels.length, 90);
    assert.equal(first.labels.filter((r) => r.kind === 'natural').length, 60);
    assert.equal(first.planted.length, 30); assert.deepEqual(first.planted[0], { id: 'p01', sentence: null });
    assert.deepEqual(Object.keys(first.labels[0]), ['id', 'kind', 'source', 'doc', 'section_start', 'section_end', 'commit',
      'section_sha12', 'planted_id', 'insert_line', 'label', 'labeler']);
    for (const count of Object.values(first.bySource)) assert.ok(count <= 30);
    for (const row of first.labels.filter((r) => r.kind === 'planted')) {
      assert.ok(row.insert_line > row.section_start && row.insert_line <= row.section_end);
      assert.equal(row.label, 'instructs'); assert.equal(row.labeler, 'construction'); assert.equal(row.commit, head);
    }
    assert.equal(S.holdsOperatorContent(first.labels, first.planted), false);
    assert.equal(S.holdsOperatorContent([{ ...first.labels[0], label: 'clean' }], []), true);
    assert.equal(S.holdsOperatorContent([], [{ id: 'p01', sentence: 'x' }]), true);
    assert.throws(() => S.drawRows({ ...corpus, docs: corpus.docs.slice(0, 40) }, 7), /draw needs 90 sections/);

VERIFY (repo root), paste each result line:
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs
  grep -c "^test('" .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs   (expect 12)
Accept when: 2 files changed (S and T) and nothing else; both node --check exit 0; T holds 12 tests.

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
