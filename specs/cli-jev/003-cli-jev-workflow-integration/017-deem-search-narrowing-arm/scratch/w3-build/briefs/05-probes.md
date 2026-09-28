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

TASK: add the paraphrase-probe reader, its gold sets and its report line to the track-narrowing script, with one vitest case.
S = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs. T = .skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts. Read both first. The probe fixture retrieval/fixtures/semantic-probes.json is read only: its `paraphrase.rows` entries carry caseId, locale ('latin' or 'cjk'), variant ('exact', 'paraphrase' or 'distractor') and query.

In S:
1. Add `import { fileURLToPath } from 'node:url';` with the node imports. In section 1 add `const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));` and the exported DEFAULT_PROBES_PATH = path.join(SCRIPT_DIR, 'fixtures', 'semantic-probes.json').
2. New section `5. PARAPHRASE PROBES` after section 4, exported functions with JSDoc. A comment says the probes are reported for every method and never decide a verdict, and their gold comes from the exact query's scoring spec rows on the current index because the fixture's captured paths predate it.
 a. loadProbes(probesPath): parse the file; rows = parsed.paraphrase.rows, which must be an array, else throw new Error(`${probesPath} has no paraphrase rows`). For every row with locale 'latin' and variant 'paraphrase', in file order, return { id: `probe:${row.caseId}`, caseId: row.caseId, question: row.query, exactQuery } where exactQuery is the query of the row with the same caseId, locale 'latin' and variant 'exact', or null when there is none.
 b. probeGold(loaded, probes): returns each probe with gold added: the distinct trackOf(result.path) values, sorted with compareCodeUnits, over lookup(loaded, probe.exactQuery, { limit: 0 }).results whose score > 0 and whose trackOf is not null; gold is [] when exactQuery is null.
 c. probeHits(probes, picks), picks a Map from probe id to a track or null: the number of probes with a non-empty gold whose pick is in that gold.
 d. probeLine(probes, methods), methods an array of [name, hits] pairs in print order: total = probes.length, goldLess = probes with an empty gold, P = total - goldLess; returns `paraphrase probes: total=${total} gold-less=${goldLess}` followed by ` ${name}=${hits}/${P}` for each pair.

In T, import the new names and add describe('score-track-narrowing paraphrase probes') with one case, 'derives gold from the exact query and counts hits only inside it': write probes.json in a temp root as JSON { paraphrase: { rows: [ {caseId:'c1',locale:'latin',variant:'exact',query:'quartz lantern calibration'}, {caseId:'c1',locale:'latin',variant:'paraphrase',query:'tune the glowing crystal lamp'}, {caseId:'c1',locale:'latin',variant:'distractor',query:'open the billing page'}, {caseId:'c1',locale:'cjk',variant:'paraphrase',query:'cjk text'}, {caseId:'c2',locale:'latin',variant:'exact',query:'no phrase matches this text'}, {caseId:'c2',locale:'latin',variant:'paraphrase',query:'something else entirely here'} ] } }. Tracks 'alpha-track' and 'beta', doc(root, 'specs/alpha-track/001-a/spec.md', ['quartz lantern calibration']) and doc(root, 'specs/beta/002-c/spec.md', ['quartz lantern']); loaded = indexFor(root).
 - loadProbes(file) equals [{ id: 'probe:c1', caseId: 'c1', question: 'tune the glowing crystal lamp', exactQuery: 'quartz lantern calibration' }, { id: 'probe:c2', caseId: 'c2', question: 'something else entirely here', exactQuery: 'no phrase matches this text' }].
 - withGold = probeGold(loaded, that list): withGold[0].gold equals ['alpha-track', 'beta'] and withGold[1].gold equals [].
 - probeHits(withGold, new Map([['probe:c1', 'beta'], ['probe:c2', 'alpha-track']])) is 1, and with 'probe:c1' mapped to null it is 0.
 - probeLine(withGold, [['lookup', 0], ['ripgrep', 1], ['deem', 1]]) is 'paraphrase probes: total=2 gold-less=1 lookup=0/1 ripgrep=1/1 deem=1/1'.
 - loadProbes(DEFAULT_PROBES_PATH) has length 20 and every entry has a string exactQuery.

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
