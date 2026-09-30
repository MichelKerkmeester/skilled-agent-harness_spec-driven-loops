GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm

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

TASK: add the ripgrep baseline to the track-narrowing script, with two vitest cases.
S = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs. T = .skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts. Read both first, and read retrieval/lib/rg-lane.mjs lines 1-200 (pathOnlyRecipe and runRecipe). rg-lane.mjs stays unchanged.

In S:
1. Add `import { pathOnlyRecipe, runRecipe } from './lib/rg-lane.mjs';` after the normalize import.
2. At the end of section 3 add two exported functions with JSDoc:
 a. ripgrepTokens(question): the distinct tokens of normalizeTriggerText(question).split(' ') with length >= 3, first-seen order. ('an ox quartz quartz Lantern' gives ['quartz', 'lantern'].)
 b. ripgrepPick(question, ownFolder, context), context = { repoRoot, cache } where cache is a Map from token to string[] of repo-relative paths. For each token of ripgrepTokens(question): when the cache lacks it, run = runRecipe(pathOnlyRecipe(token, ['specs']), { cwd: context.repoRoot }); outcome 'error' throws new Error(`ripgrep failed on ${token}: ${run.stderr.trim()}`); outcome 'no-match' caches []; outcome 'match' caches the stdout lines trimmed, empty ones dropped, '\\' replaced by '/', a leading './' removed. Then each file scores the number of the question's tokens whose cached list holds it, skipping a file whose trackOf is null or which isInsideFolder(file, ownFolder) (skip that test when ownFolder is null). No scoring file returns null (an abstention). Otherwise take the files at the top score, count them per track, and return the track with the most such files; a tie on that count goes to the first track name by compareCodeUnits. The cache is kept across calls so each token runs ripgrep once per run.

In T:
1. Import ripgrepTokens and ripgrepPick from the script.
2. New describe('score-track-narrowing ripgrep baseline') with two cases; each makes its root with tempDir, writes tracks 'alpha-track', 'beta' and 'gamma' with track(), writes the .md files below with write(root, rel, text), and uses context = { repoRoot: root, cache: new Map() }.
 a. 'picks the track of the file matching the most distinct tokens': files specs/alpha-track/001-a/spec.md 'quartz lantern ember', specs/beta/002-b/spec.md 'quartz lantern', specs/beta/003-c/notes.md 'quartz', specs/gamma/004-d/spec.md 'ember'. ripgrepPick('quartz lantern ember', null, context) is 'alpha-track'; ripgrepPick('quartz lantern ember', 'specs/alpha-track/001-a', context) is 'beta'; context.cache has keys 'quartz', 'lantern' and 'ember', and context.cache.get('ember') sorted equals ['specs/alpha-track/001-a/spec.md', 'specs/gamma/004-d/spec.md']; ripgrepTokens('an ox quartz quartz Lantern') equals ['quartz', 'lantern'].
 b. 'breaks a tie by file count, then by track name, and abstains on no match': files specs/beta/010-x/a.md 'harbor', specs/gamma/011-y/a.md 'harbor', specs/gamma/012-z/a.md 'stone', specs/gamma/013-w/a.md 'willow', specs/beta/014-w/a.md 'willow'. ripgrepPick('harbor stone', null, context) is 'gamma'; ripgrepPick('willow', null, context) is 'beta'; ripgrepPick('zzqxv wwkqz', null, context) is null.

VERIFY (repo root): node --check .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs
Accept when: 2 files changed and nothing else; node --check exits 0.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm
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
