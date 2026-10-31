GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm

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

TASK: add one exported async function, loadCensus(), to the eval script, and one test for it.
R = .skilled/skills/system-skill-advisor/runtime
Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read both first, then R/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs lines 20-76, which this function copies.

In score-jev-tiebreak.mjs:
1. Right after the header comment add: import { mkdtempSync, readFileSync } from 'node:fs'; import { tmpdir } from 'node:os'; import { dirname, join, resolve } from 'node:path'; import { fileURLToPath } from 'node:url';
2. Below ALPHA and POWER add: const HERE = dirname(fileURLToPath(import.meta.url)); const DIST = resolve(HERE, '../../dist/runtime'); const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md'; const CORPORA = { labeled: ['labeled-prompts.jsonl', 195], holdout: ['holdout-prompts.jsonl', 70], ambiguity: ['ambiguity-prompts.jsonl', 24] };
3. At the end of the file add `export async function loadCensus()` with a JSDoc block saying it scores the corpora once under the baseline capture's env. Body, in order:
   a. Copy capture-scorer-eval-baseline.mjs lines 35-46 exactly (env block and its comment), mkdtemp prefix 'advisor-jev-tiebreak-'. It runs before any dist import.
   b. The dynamic imports of lines 48-50 of that file, plus const { loadAdvisorProjection } = await import(join(DIST, 'lib/scorer/projection.js'));
   c. const workspaceRoot = findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: SENTINEL }); const projection = loadAdvisorProjection(workspaceRoot);
   d. Read each CORPORA file from HERE (trim, split on '\n', drop empty lines, JSON.parse each). When a count differs, throw new Error(`${file}: expected ${n} rows, got ${rows.length}`).
   e. isMatch(actual, goldRaw): the body of isTop1Correct, lines 70-76 of that file.
   f. scorePrompt(prompt) = scoreAdvisorPrompt(prompt, { workspaceRoot, projection }).
   g. holdoutTop1 = { correct, total } over all 70 holdout rows; a row is correct when isMatch(scorePrompt(row.prompt).topSkill, row.skill_top_1).
   h. tauIds = new Set(ambiguity rows' ids as strings).
   i. rows: for file 'labeled' then 'holdout', keep rows with a prompt and String(row.skill_top_1 ?? 'none') !== 'none'. Sort the kept rows by String(id) with localeCompare; even index gets split 'train', odd gets 'test'. For each kept row: const result = scorePrompt(row.prompt); const order = result.recommendations.map((r) => r.skill); const top = result.recommendations[0]; const members = new Set(top ? [top.skill, ...(top.ambiguousWith ?? [])] : []); push { id: String(row.id), file, split, prompt: row.prompt, gold: row.skill_top_1, goldKey: mergedSkillForAlias(row.skill_top_1), order, cluster: order.filter((s) => members.has(s)), confidence: Object.fromEntries(result.recommendations.map((r) => [r.skill, r.confidence])), score: Object.fromEntries(result.recommendations.map((r) => [r.skill, r.score])), tau03: tauIds.has(String(row.id)) }.
   j. labels: every labeled row as { id: String(row.id), prompt: row.prompt, yes: row.gate3_triggers === 'yes' }.
   k. describe(skill): the description of the projection.skills entry whose id equals skill, or '' when there is none.
   l. return { holdoutTop1, rows, labels, isMatch, describe }.

In the vitest file add loadCensus to the import and a new describe('score-jev-tiebreak census loader') with one it() given a 120_000 ms timeout. It awaits loadCensus() and expects: holdoutTop1 equals { correct: 53, total: 70 }; rows.length is 241; rows with file 'labeled' number 177; labels.length is 195; labels with yes true number 127; every row's cluster entries all appear in its order; describe('sk-code') is a non-empty string.

VERIFY (repo root):
  node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
  node -e "import('./.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs').then(async (m) => { const c = await m.loadCensus(); console.log(c.holdoutTop1.correct, c.rows.length, c.labels.length); })"
Accept when: 2 files changed and nothing else; node --check exits 0; the node -e line's last stdout line is `53 241 195`.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm
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
