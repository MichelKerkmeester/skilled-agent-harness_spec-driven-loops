# Iteration 1: v4.0.1.0 inventory and the AGENTS.md citation pass

## Focus

Inventory what Skilled v4.0.1.0 renamed, removed, retired, added or changed behaviourally, from `.skilled/changelog/skilled/v4.0.1.0.md`, the git range and the per-skill changelog surface; then start checking every path, command, section anchor and skill/mode name that `AGENTS.md` cites against that inventory.

Ambiguity handled: the topic describes `AGENTS.md` as "(repo root, which CLAUDE.md mirrors)". No `CLAUDE.md` exists in this checkout (`ls CLAUDE.md` fails, `.claude/CLAUDE.md` fails). The selected interpretation is that `AGENTS.md` is the root instruction file, which is exactly what `/doctor:agents-md` manages per `AGENTS.md:301`. The mirror claim was treated as unverified and out of research scope.

## Actions Taken

1. Read the research config, state log and strategy, and derived iteration 1 of 5.
2. Read the release note in full (196 lines) and confirmed the tag range: `v4.0.0.16..v4.0.1.0` is 458 commits / 33,921 changed paths; `v4.0.0.0..v4.0.1.0` is 3,365 commits.
3. Diffed the range against the four rule surfaces (`AGENTS.md`, `REPO RULES.md`, `.skilled/repo-rules/`) with `git diff --stat` and `git log`, to separate what was already refreshed from what was not.
4. Batch-verified every filesystem path `AGENTS.md` cites (20 probes) and every section anchor it cites (11 anchors, via `rg '^## '`).
5. Read `REPO RULES.md` in full (114 lines) and inventoried the 13 rule files in `.skilled/repo-rules/`, confirming all 13 exist and all 13 are indexed.
6. Grepped `AGENTS.md`, `REPO RULES.md` and the 13 rule files for every retired surface the release names.
7. Verified three "behaviour may have changed" claims against their owners: the advisor CLI command contract, the trigger-index flags, and the comment-hygiene pre-commit gate.

## Findings

### f-iter001-001 (P2) — `AGENTS.md` Gate 2 never names `ROUTER.md`, the file that now holds every skill's routing

`AGENTS.md:70` says "Routing means loading what the router resolves, under the same loading rule as Gate 5", and `AGENTS.md:71` repeats it in the output contract ("`ARTIFACT: [skill] → [what its router resolved]`"). Neither line names the file, and `ROUTER.md` appears nowhere in `AGENTS.md` (grep for `ROUTER.md` over `AGENTS.md` returns zero matches).

v4.0.1.0 made that file the mandatory home of exactly the material Gate 2 tells the agent to load: "The intent tables, resource maps and pseudocode that scripts read now sit in a `ROUTER.md` beside each `SKILL.md`, and `SKILL.md` links to it in one line" [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:56], and "A skill that keeps its router inside `SKILL.md`, or has no `ROUTER.md`, now fails `package_skill.py --strict`" [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60]. The shape is live in the tree: `sk-code` ships both `.skilled/skills/sk-code/SKILL.md` and `.skilled/skills/sk-code/ROUTER.md`, and `system-spec-kit` ships a 25,874-byte `ROUTER.md` whose `## 3. MACHINE ROUTER` holds the resource domains [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:62].

The repo-rules layer already absorbed the move; `AGENTS.md` did not. `.skilled/repo-rules/skill-hub-routing.md:61` states "Every hub and every mode packet owns the `ROUTER.md` in its own folder … A packet's `SKILL.md` keeps only short routing prose and a link to it", and that sentence arrived inside this range as commit `6a3ecd37f5` ("docs(repo-rules): name a mode packet's own ROUTER.md in the hub routing rule") [SOURCE: .skilled/repo-rules/skill-hub-routing.md:61]. The only `AGENTS.md` commits in the range are `e0fb2624dd` (section manifest plus repository block) and the repo-rules pairing; the router move never reached it [INFERENCE: from `git log --oneline v4.0.0.16..v4.0.1.0 -- AGENTS.md "REPO RULES.md"`, which lists only `e0fb2624dd` for AGENTS.md].

Impact: an agent obeying Gate 2 literally loads `SKILL.md` and stops. Since v4.0.1.0 shrank `SKILL.md` *by moving the router out*, the missing sentence is the one that says where it went. The rule is not wrong, it is now under-specified at the exact point it is used.

Proposed one-line edit, `AGENTS.md:70`, first sentence:

- now: `Routing means loading what the router resolves, under the same loading rule as Gate 5.`
- proposed: `Routing means loading what the skill's sibling ROUTER.md resolves (its SKILL.md links it in one line), under the same loading rule as Gate 5.`

### f-iter001-002 (P3) — No path, command or section anchor cited by `AGENTS.md` is stale after v4.0.1.0

Twenty filesystem probes and eleven anchor probes all resolved. Nothing the release renamed or removed had been cited, so no repair edit is needed here. Detail in **Verified Clean**.

This is a negative finding of the inventory kind, stated plainly as the topic asks: the v4.0.1.0 churn does not reach `AGENTS.md`'s path surface.

### f-iter001-003 (P3) — The four retirements and the `.skilled/release` removal have no expression in the rules to delete

`sk-vision`, `/vision`, `mcp-magicpath`, `sk-design-fundamentals` / `fundamentals`, `.skilled/release`, and `gpt-6` each return zero matches across `AGENTS.md`, `REPO RULES.md` and all 13 files in `.skilled/repo-rules/` [SOURCE: AGENTS.md:1-302] [SOURCE: REPO RULES.md:1-114]. `sk-design` now carries exactly three mode packets — `sk-design-chart`, `sk-design-diagram`, `sk-design-md-generator` [SOURCE: .skilled/skills/sk-design/], matching the release's "keeps three modes" [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:138], and no rule enumerates modes, so nothing in the rules decays from that retirement.

No edit. Recorded so a later iteration does not spend budget re-deriving it.

### f-iter001-004 (P2, candidate rejected after verification) — Decision capture, render checks and the doc rewrite guard are already owned downstream; restating them in `AGENTS.md` would duplicate an owner

These are the three v4.0.1.0 additions most likely to demand a new rule, and each one already has a contract the existing gates route to:

- **Decision capture.** `AGENTS.md:147-151` delegates save composition and "what the writer touches" to `save-workflow.md`. That file now specifies the whole behaviour: a `--full-auto` save writes each `operatorDecisions` entry into the packet's `decision-record.md` while a plan-only save writes nothing [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:261], the five runtime sweeps are named [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:262], and the writer matches an existing hand-written record before appending [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:277]. The delegation sentence stays true; no `AGENTS.md` edit.
- **Doc rewrite guard.** The guard exists at `.skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py` and the release makes it a pre-commit step for form-only rewrites [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:196]. It is **not** in the primary pre-commit gate — that hook runs comment hygiene, agent-mirror sync, mirror parity, prompt-card sync, MCP mutation-class, compiled-routing re-mint and spec derived-metadata re-mint [SOURCE: .skilled/hooks/git/README.md:18] — so a rule could be argued for. It is reached instead through routing: `sk-doc`'s router carries a `RENDER_LEDGER` intent weighted 4 on keywords `doc rewrite guard`, `doc-rewrite-guard.py`, `kept every claim` [SOURCE: .skilled/skills/sk-doc/ROUTER.md:174], and `AGENTS.md:70` already sends every first `.md` write through `sk-doc`. Adding a second statement to `AGENTS.md` would create the duplication `AGENTS.md:247` explicitly avoids ("Go to the owner rather than a summary here").
- **Render checks.** Same owner, same route: sixteen render checks fail strict packaging, and `sk-doc`'s README records them [SOURCE: .skilled/skills/sk-doc/README.md].

Impact if ignored: none, provided `sk-doc`'s router keeps the `RENDER_LEDGER` intent. Worth a follow-up check that the intent survives, not a rules edit.

## Verified Clean

Filesystem citations, all resolved:

| Cited at | Path | Result |
|---|---|---|
| `AGENTS.md:51` | `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | exists; `--scoring-only` and `--json` are real flags [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:19] |
| `AGENTS.md:66` | `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | exists |
| `AGENTS.md:67` | `.skilled/bin/skill-advisor.cjs` + `advisor_recommend` | exists; `advisor_recommend` is the first of nine frozen commands, spellable in snake/kebab/camel [SOURCE: .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:47] |
| `AGENTS.md:77` | `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts` | exists |
| `AGENTS.md:83` | `quick-reference.md` §8, §9 | §8 "UPDATE, PHASE, OR CREATE DECISION" carries the recommendation priority at line 278; §9 "CONFIRMATION OPTIONS" [SOURCE: .skilled/skills/system-spec-kit/references/workflows/quick-reference.md:233] |
| `AGENTS.md:83` | `phase-definitions.md` §2 | "PHASE DETECTION" [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:41] |
| `AGENTS.md:105-106` | five `communication-*.md` + `answer-the-actual-request.md` | all exist |
| `AGENTS.md:142` | `validate.sh`, `validation-rules.md` §1 and §14 | both exist; §14 "INVOKING VALIDATE.SH: FOUR WAYS A RUN LIES" [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:898] |
| `AGENTS.md:151` | `save-workflow.md` | exists |
| `AGENTS.md:155` | `sk-create-goal`'s `references/budget-and-handoff.md` §4 | resolves to `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md`; §4 "WHAT A PARENT GOAL SENT IN CHAT CONTAINS" at line 62 [SOURCE: .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:62] |
| `AGENTS.md:178,186,207` | `blast-radius.md`, `uncertainty-and-honesty.md` §7, `prevent-overengineering.md` §2 | §7 "SETTLED AND REOPENED" [SOURCE: .skilled/repo-rules/uncertainty-and-honesty.md:134]; §2 "THE PRE-WRITE PASS" [SOURCE: .skilled/repo-rules/prevent-overengineering.md:90] |
| `AGENTS.md:216` | `retrieval-conventions.md`; `system-spec-kit` SKILL.md §3 | §3 "HOW IT WORKS" spans 100-194 and holds the declared-loss sentence [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:151] |
| `AGENTS.md:217` | `.skilled/skills/sk-git/` | exists |
| `AGENTS.md:239` | `.utcp_config.json` | exists |
| `AGENTS.md:251` | `recommend-level.sh` | exists |
| `AGENTS.md:252-255` | `folder-structure.md` §3, `phase-definitions.md` §3, `folder-routing.md` | §3 "LEVEL REQUIREMENTS" [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:99]; §3 "FOLDER STRUCTURE" [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:134] |
| `AGENTS.md:269` | `root-cause-and-debugging.md` §7 | "WHEN YOU ARE STUCK, ESCALATION FORMAT" [SOURCE: .skilled/repo-rules/root-cause-and-debugging.md:137] |
| `AGENTS.md:281` | seven runtime agent directories | all seven exist, including `.hermes/agents/` |
| `AGENTS.md:283` | Hermes `agent-<name>` skill mirror | `.hermes/skills/` exists |
| `AGENTS.md:289` | `.opencode/commands/` | exists, and matches the release's OpenCode consolidation [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:150] |
| `AGENTS.md:301` | `/doctor:agents-md` | matches the released `check` / `embed` / `restore` surface [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:98] |
| `AGENTS.md:75` | `.skilled/skills/.state/` | directory exists |
| `REPO RULES.md:103-114` | `communication-handoff.md` §5 as the only place a tool name appears | §5 "THE QUESTION SURFACE IS PER RUNTIME" [SOURCE: .skilled/repo-rules/communication-handoff.md:145] |
| `REPO RULES.md:52` | `ROUTER.md`, `graph-metadata.json` in the hub-routing trigger | already updated in range; matches `skill-hub-routing.md:38` |

Redundancy check on the one rule a v4.0.1.0 hook now enforces: the primary pre-commit runs `check-comment-hygiene.sh` over staged blobs and blocks on exit 1 [SOURCE: .skilled/hooks/git/README.md]. `AGENTS.md:32-34` "Comment Hygiene — HARD BLOCK (cannot be overridden)" is **not** redundant with it: the hook is bypassable (`SPECKIT_SKIP_COMMENT_HYGIENE=1`), runs only at commit, and only over staged code, while the rule binds every code write and no rule file may relax it. Keep as is.

## Ruled Out

- **`advisor_recommend` looked removed.** `.skilled/agents/code.md` and `.skilled/skills/README.txt` both show the verb `l`, which reads as a rename. The frozen contract settles it the other way: nine commands, each accepting snake, kebab and camel spellings, `advisor_recommend` first in the table [SOURCE: .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:47], and the built CLI contains seven occurrences. `AGENTS.md:67` is correct and `l` is a separate short id.
- **"`system-spec-kit` SKILL.md §3" may have lost its content to the router move.** It did not; §3 keeps "Retrieval and Continuity", "Reranking" and the declared-loss sentence.
- **`sk-create-goal`'s `references/budget-and-handoff.md` may have moved under `sk-doc`.** It sits at `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md`; `AGENTS.md:155` cites it by skill name, not by path, so the extra folder does not stale the citation.
- **A doc-rewrite-guard rule is missing from `AGENTS.md`.** Rejected: `sk-doc`'s router owns the intent and Gate 2 already routes there.

## Dead Ends

- **Sweeping the rule files for v4.0.1.0 impact as a first move.** Only two of thirteen files changed in the range — `communication-handoff.md` (4 lines) and `skill-hub-routing.md` (8 lines) — and both changes were themselves router-related. The rules layer is ahead of `AGENTS.md`; a rule sweep on this axis yields nothing until the rules' own internal citations are the target.
- **Treating `.skilled/changelog/skilled/v4.0.1.0.md:27`'s spec-folder list as the change inventory.** It names nine packets and "smaller packets for the fixes"; the git range covers 458 commits and 33,921 paths, so the list is a pointer, not an inventory. The named-packet approach cannot substitute for the tree probe.

## Edge Cases

- Ambiguous input: the topic's "CLAUDE.md mirrors AGENTS.md" premise. No `CLAUDE.md` exists at the root or under `.claude/`; interpreted as `AGENTS.md` being the root instruction file, and the mirror claim was deferred rather than resolved.
- Contradictory evidence: the advisor CLI verb appeared to be `l` (agent docs, README) against `advisor_recommend` (`AGENTS.md:67`). Resolved in favour of `advisor_recommend` on the frozen front-door contract plus the built dist; recorded in **Ruled Out** so a later iteration does not re-litigate it.
- Missing dependencies: none. Every cited path required for this pass existed.
- Partial success: none. All planned probes ran; scope of what remains unverified is listed under **Questions Remaining**.

## Sources Consulted

- `.skilled/changelog/skilled/v4.0.1.0.md:23-196`
- `AGENTS.md:1-302`
- `REPO RULES.md:1-114`
- `.skilled/repo-rules/` (13 files; `skill-hub-routing.md:38,59,61,110`, `communication-handoff.md:145`, `uncertainty-and-honesty.md:134`, `prevent-overengineering.md:90`, `root-cause-and-debugging.md:137`)
- `.skilled/skills/system-spec-kit/SKILL.md:100-194`, `.skilled/skills/system-spec-kit/ROUTER.md:62`
- `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md:233,278`
- `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md:41,134`
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:99`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md:898`
- `.skilled/skills/system-spec-kit/references/memory/save-workflow.md:261,262,277`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:19,204`
- `.skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:47`
- `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:137,151,351`
- `.skilled/skills/sk-doc/ROUTER.md:174`
- `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:62`
- `.skilled/hooks/git/README.md` (gate list, comment hygiene)
- `git diff --name-status v4.0.0.16..v4.0.1.0`; `git log --oneline v4.0.0.16..v4.0.1.0 -- AGENTS.md "REPO RULES.md"`

## Assessment

- New information ratio: 0.75
- Questions addressed: Q1 (what v4.0.1.0 changed), Q2 (whether AGENTS.md's citations still resolve)
- Questions answered: Q1

## Reflection

- What worked and why: batching the existence probes into one shell loop, and extracting section anchors with `rg '^## '` instead of reading eleven files, made a 20-path plus 11-anchor citation audit cheap enough to finish inside one iteration. The `git diff --stat` against the four rule surfaces was the highest-value call of the run: it turned "audit everything" into "audit what the range did not already fix", and it is what exposed `f-iter001-001`.
- What did not work and why: the first advisor check grepped two guessed paths that do not exist, produced zero hits, and nearly became a P1 false finding that `AGENTS.md:67` was stale. The root cause is searching for a claimed symbol in an assumed location rather than in its declared contract.
- What I would do differently: for any command name a rule cites, read the owning contract's command table first, then confirm in the built artefact. One call instead of three, and it cannot produce the inverted conclusion.

## Questions Remaining

- Q3 open: the 13 rule files' own internal citations (section anchors into skills, script paths, gate command names) were not audited beyond `communication-handoff.md` §5 and the hub-routing references.
- Q4 partially open: whether any remaining v4.0.1.0 addition — conversation playbook scenarios, `/doctor:install`/`symlink`, worker-session nudge removal — warrants a rule statement.
- Q5 partially open: the redundancy question was answered only for comment hygiene and the doc rewrite guard.

## Recommended Next Focus

Iteration 2: audit the 13 rule files' internal citations rather than `AGENTS.md`'s — every skill file, script path and section anchor they name (`skill-hub-routing.md`'s `parent-skills-nested-packets.md` §1-2 and its gate commands, `communication-handoff.md`'s per-runtime question surfaces, `delegation-and-orchestration.md`'s CLI packet paths). Then close Q4 with a decision per addition: state it, or record why the owning skill already carries it.

## Gateway Record and Scope Notes

The canonical iteration record was recorded through `append-mode-event.cjs --mode research --run-directory specs/agents-md/017-v4-0-1-0-rules-refresh/research`, which returned exit 0 with receipt `event-2b363fa9-3bf9-4b6b-89b2-48eb37612b2e`, ledger sequence 4, `projectionRefreshed: true`, and one warning: "Trusted evidence yield was absent and remains explicitly zero." The refreshed `deep-research-state.jsonl` carries exactly one `type: "iteration"` record, `status: complete`, `newInfoRatio: 0.75`, and four `ruledOut` entries.

One verification item does not hold as written, and it is not fixable inside this packet: the gateway's projection keeps only seven fields — `type`, `iteration`, `run`, `status`, `newInfoRatio`, `ruledOut`, `timestamp`. It drops `focus`, `findingsCount`, `noveltyJustification`, `answeredQuestions`, `graphEvents`, `toolsUsed`, `sourcesQueried` and `durationMs` [INFERENCE: read directly from the iteration record in `deep-research-state.jsonl` after the gateway run]. The full record survives in two places this iteration does write: the delta file's first line, which is byte-identical to the event handed to the gateway, and the ledger event the receipt hashes. The reducer reads the state log and delta files together, so Q1's answer and the graph events remain available; a future iteration that relies on the projection alone would lose them.

Scope note: `progressiveSynthesis` is `true` in the config, but `research/research.md` is outside this dispatch's ALLOWED WRITE PATHS, which name only `iterations/iteration-001.md`, `deltas/iter-001.jsonl` and the gateway's own writes. The narrower allowlist governs, so `research/research.md` was not created, and synthesis remains unowned until the workflow writes it or a later dispatch widens the allowlist.

Scope-integrity note for the operator: `git status` shows five modified tracked files outside this packet, and four of them carry mtimes inside this run's window — `.skilled/skills/sk-doc/shared/scripts/validate_document.py` and `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` at 21:14:06, `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` at 21:15:10, plus `specs/sk-doc/055-changelog-system/spec.md` and its `graph-metadata.json` at 21:05. This iteration issued no write outside `specs/agents-md/017-v4-0-1-0-rules-refresh/research/`; a concurrent sibling deep-research run holds `specs/sk-doc/055-changelog-system/005-concise-release-format/research/.deep-research.lock` (touched 21:14:24) and its subject matches those files. They were left untouched, not reverted.
