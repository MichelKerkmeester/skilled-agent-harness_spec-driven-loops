# Iteration 2: The rule layer's own citations, audited against the v4.0.1.0 tree

## Focus

Audit every skill file, script path, command name, relative link and section anchor that `REPO RULES.md` and the 13 files under `.skilled/repo-rules/` name, against the tree as it stands after v4.0.1.0, and close the redundancy question (Q5) for the remaining candidates.

Two ambiguities, resolved before research:

- The dispatch names `delegation-and-orchestration.md`'s "CLI packet paths" as a place to check. That file names no CLI packet path at all: `rg -n 'cli-' .skilled/repo-rules/delegation-and-orchestration.md` returns zero matches, and its only backticked references are `AGENTS.md`, `REPO RULES.md`, four sibling rule files, `file:line`, `COMPLETE` and three git command forms [SOURCE: .skilled/repo-rules/delegation-and-orchestration.md:1-230]. The narrowest reading is that the intended target was the CLI *dispatch* discipline, which lives there, not a path citation that does not exist. Recorded rather than chased.
- Strategy `## 11. NEXT FOCUS` still reads "Q5 partially open" (the reducer rewrote it from carried-forward state), while the dispatch names the citation audit. Dispatch context outranks strategy prose, so this iteration ran the citation audit and answered Q5 inside it. Section 11 is reducer-owned and was not edited.

## Actions Taken

1. Read config, state log, strategy, the iteration-1 narrative and the findings registry; derived iteration 2 of 5 from the single `type: "iteration"` record.
2. Read `REPO RULES.md` in full (114 lines) and `skill-hub-routing.md` in full (127 lines), the two files the dispatch names most specifically.
3. Extracted every path-like backtick citation from all 13 rule files and probed them under the v4.0.1.0 tree.
4. Resolved every relative markdown link target in the 13 rule files with a Python probe (`os.path.exists` against the resolved directory), and checked every `§N` cross-reference between rule files against the target file's real `## N.` headings.
5. Verified `skill-hub-routing.md`'s two external references (`parent-skills-nested-packets.md`, `skill-root-metadata-contract.md`) exist and that §1-2 and §7 hold what the rule says they hold.
6. Confirmed the `routingClass` vocabulary the rule enumerates is still live, and that all seven hubs still carry both `mode-registry.json` and `hub-router.json`.
7. Tested the rule's own gate claims against what v4.0.1.0 actually shipped: the pre-commit gate list, `package_skill.py`'s routing-shape rules, and `parent-skill-check.cjs`'s new checks.

A correction on method, because it matters for the evidence below: the first relative-link probe printed 51 "MISSING" lines and every one was false. The probe used `realpath`, which macOS does not ship, so each target resolved to the empty string and `[ -e "" ]` failed. The Python re-run over the same 13 files reports **0** broken links. Treat any `realpath`-based existence probe in this repository as unverified.

## Findings

### f-iter002-001 (P3) — `skill-hub-routing.md` shares its subject with a gate v4.0.1.0 added, and names neither the gate nor its codes

`skill-hub-routing.md:61` states the placement rule ("a router edit belongs in the `ROUTER.md`, never in `SKILL.md`") and `:78` states the coverage limit ("The per-hub gate covers some surfaces and asserts only presence, never reachability. Several surfaces have no gate at all"). Both remain true. Neither tells a reader that v4.0.1.0 turned that placement sentence into a blocking check with codes:

- `12a-router-contract` — every skill root and every declared packet owns one `ROUTER.md` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1795].
- `12b-routing-shape` — sibling `ROUTER.md`, a relative pointer to it, short routing prose, and no router section left in `SKILL.md`, ratcheted against `routing-shape-known-debt.json` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:2233].
- `RS-002` (machine router left in `SKILL.md`) [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:2116], `RS-004` (no sibling `ROUTER.md`) [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:2143], `RS-005` (no relative link to it) [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:2164].

The reference the rule sends readers to for the surface list is the one place this is now incomplete: its 11-row table has no row for routing-shape plumbing, and its coverage sentence says "`parent-skill-check` covers rows 1-3 and 9 … Rows 4, 5, 6, 8 and 10 have no gate" [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:245]. The gate now also covers something the table does not enumerate, so a mode-wiring change can be blocked by a code that appears in no rule and in no row.

Impact: a reader who follows `skill-hub-routing.md` §5 for "where the detail lives" repairs the six surfaces it lists and is then blocked by a seventh it never mentions. The rule is not wrong; its map of what will stop you is short one gate.

Proposed one-line edit, `skill-hub-routing.md:78`, appended after the second sentence:

> A mode that ships no sibling `ROUTER.md`, leaves its machine router in `SKILL.md`, or links no relative pointer to it fails `12a-router-contract` / `12b-routing-shape` under codes `RS-002`, `RS-004` and `RS-005`; those checks prove shape, not reachability.

### f-iter002-002 (P3) — No path, relative link or section anchor cited by `REPO RULES.md` or the 13 rule files is stale after v4.0.1.0

The audit the topic asks for, run over the whole rule layer rather than the two files the dispatch named. Zero repairs are needed, on these counts:

- **Relative links.** 0 broken across all 13 files. Every file links `../../REPO%20RULES.md` and it resolves to the root `REPO RULES.md`; the intra-folder links (`evidence-and-proof.md`, `communication.md`, `scope-discipline.md`, and the rest) all resolve.
- **Cross-file section anchors.** 23 of 23 `§N` citations between rule files resolve to a real `## N.` heading in the target file. Spot-checked claims hold: `evidence-and-proof.md` §10 is the fabrication section `answer-the-actual-request.md:101` sends the reader to, and `communication.md` §5 is the ordering section `communication-decisions.md:59` cites.
- **AGENTS.md section citations from inside rule files.** Every one points at a section that exists and says what the rule claims: §1 PLAN-WORKFLOW LOCK [SOURCE: .skilled/repo-rules/scope-discipline.md:102], §2 gates [SOURCE: .skilled/repo-rules/communication-handoff.md:189], §3 execution behavior and the coverage floor [SOURCE: .skilled/repo-rules/scope-discipline.md:117], §7 escalation [SOURCE: .skilled/repo-rules/communication-decisions.md:101], §10 Operational Mandates [SOURCE: .skilled/repo-rules/delegation-and-orchestration.md:73].
- **External references from `skill-hub-routing.md`.** `parent-skills-nested-packets.md` sits at `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` and holds §1 "OVERVIEW", §2 "REGISTRY AND ROUTER CONTRACT" (the `routingClass` table at line 132, the `ROUTER.md` locations at 42-55 and 79) and §7 "ADDING A MODE TO AN EXISTING HUB" with the surface table and the gate commands [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:116]. `skill-root-metadata-contract.md` sits at `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`. `sk-doc` does route to the former [SOURCE: .skilled/skills/sk-doc/SKILL.md:153].
- **The `routingClass` vocabulary** the rule enumerates is current, not historical: `metadata` 56 occurrences, `lexical` 16, `alias-fold` 2, `command-bridge` 1 across `.skilled/skills` (jsonl excluded) [SOURCE: .skilled/repo-rules/skill-hub-routing.md:52].
- **The hub file pair** the rule fires on still exists for all seven hubs — `cli-classifier`, `mcp-tooling`, `system-deep-loop`, `sk-code`, `sk-design`, `sk-doc`, `cli-external-orchestration` each carry `mode-registry.json` and `hub-router.json` [SOURCE: .skilled/repo-rules/skill-hub-routing.md:36].
- **The runtime surfaces `communication-handoff.md` §5 names** exist: `.pi/PLUGINS.md` records the `@juicesharp/rpiv-ask-user-question` extension, and `.codex/config.toml` carries the `default_mode_request_user_input` feature the section describes [SOURCE: .skilled/repo-rules/communication-handoff.md:153]. That section is the only place a tool name appears, which `REPO RULES.md:112` asserts.

`REPO RULES.md`'s trigger table and index are complete in both directions: 13 triggers and 13 index rows for 13 rule files, every one of which matches a real file.

### f-iter002-003 (P3) — Nothing in the rule layer became redundant with a v4.0.1.0 gate; `skill-hub-routing.md` is the closest call and it survives on what the gates do not assert

Q5's remaining candidates, decided one at a time:

- **`skill-hub-routing.md` vs `12a-router-contract` / `12b-routing-shape`.** Not redundant. The new checks assert shape and presence (a file exists, a link resolves, a section moved) and the ratchet only lets recorded debt shrink [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:2233]. The rule's subject is reachability, which the checks explicitly do not test and cannot: a hub passes every one of them with a mode no request can reach. The rule's opening claim is the one thing a green run still cannot say.
- **`skill-hub-routing.md:61` placement sentence vs `package_skill.py --strict`.** The *placement half* is now machine-enforced: a skill that keeps its router inside `SKILL.md` fails strict packaging [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60], and the checker's own routing-shape rules RS-002/RS-003 state the same invariant [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1420]. The *reachability half* of the section — the two-stage replay — has no check. Keeping the rule costs one sentence and covers the half no tool covers; deleting it would leave the replay undocumented. Keep.
- **Comment hygiene.** Already decided in iteration 1 and unchanged: the hook is bypassable (`SPECKIT_SKIP_COMMENT_HYGIENE=1`), runs only at commit, and reads only staged code, while `AGENTS.md:32-34` binds every code write [SOURCE: .skilled/hooks/git/README.md:18]. Not redundant.
- **The pre-commit gate list** confirms the scope of what a tool now enforces: comment hygiene, agent-mirror sync, mirror parity, prompt-card sync, MCP mutation-class, compiled-routing re-mint, spec derived-metadata re-mint [SOURCE: .skilled/hooks/git/README.md:18]. No rule in the 13 duplicates any of them.

## Ruled Out

- **`skill-hub-routing.md` became redundant when the routing shape became gated.** It did not, for the reason in f-iter002-003: shape is not reachability, and the rule's whole point is that distinction.
- **`## MACHINE ROUTER` in `skill-hub-routing.md:61` is stale because real headings are numbered (`## 3. MACHINE ROUTER`).** Not stale. `package_skill.py` extracts heading titles and compares `title == 'MACHINE ROUTER'`, so the number prefix is stripped before comparison [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1174], and its diagnostics print the unnumbered form the rule uses [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1420]. The rule quotes the heading title, which is the stable identifier.
- **`parent-skills-nested-packets.md` §1-2 did not actually carry the `routingClass` table or the `ROUTER.md` locations.** It does: table at line 132, stage-two file table at 42-55, canonical sentence at 79.
- **The rule's §7-covers-the-surface-list citation was off by one section.** It is not; §7 is "ADDING A MODE TO AN EXISTING HUB" and holds the 11-row table [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:245].

## Dead Ends

- **Probing relative links with `realpath` on macOS.** It does not exist there, so the probe silently reports every link as broken. Use `os.path.exists(os.path.normpath(os.path.join(dirname, target)))` from Python instead. Recorded so a later iteration does not spend a call rediscovering it.

## Edge Cases

- Ambiguous input: the dispatch's "delegation-and-orchestration.md's CLI packet paths" names something that does not exist in that file. Resolved to the narrowest evidence-backed reading (CLI dispatch discipline, which the file does cover) and the path-citation reading was dropped after one zero-hit grep.
- Ambiguous input: dispatch Next Focus vs strategy Next Focus disagreed. Dispatch won, per the persona's precedence order; the reducer-owned section was left alone.
- Contradictory evidence: none left open. The `realpath` probe contradicted the Python probe on whether the rule layer's links resolve; the Python result is the observed one and the shell probe is explained by a missing binary.
- Missing dependencies: `realpath` absent (fallback: Python `os.path`); nothing else missing.
- Partial success: none. Every probe in the plan ran, and the one gate-coverage question that could not be settled by reading (`12a` asserting key-set equality for row 4) is not claimed either way in f-iter002-001 — the finding rests only on the checks whose subject lines I read.

## Sources Consulted

- `REPO RULES.md:1-114`
- `.skilled/repo-rules/` — all 13 files; `skill-hub-routing.md:1-127` read in full, plus `communication-handoff.md:145-172`, `communication.md`, `communication-decisions.md:59`, `evidence-and-proof.md`, `scope-discipline.md:102,117`, `delegation-and-orchestration.md:73`, `answer-the-actual-request.md:101`, `prevent-overengineering.md`, `blast-radius.md:64`, `root-cause-debugging.md`, `uncertainty-and-honesty.md`, `communication-prose.md`, `answer-the-actual-request.md`
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:21-341`
- `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` (exists)
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:110,156,1795,1935,2116,2143,2164,2233`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:189,212,1076,1174,1420,1442`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:1-30`
- `.skilled/skills/sk-doc/SKILL.md:153`, `.skilled/skills/sk-doc/ROUTER.md:214,411,457`
- `.skilled/hooks/git/README.md:1-80`
- `.skilled/changelog/skilled/v4.0.1.0.md:56,60`
- `.skilled/bin/compiled-route.cjs`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, `.codex/config.toml`, `.pi/PLUGINS.md`
- `git log --diff-filter=A v4.0.0.16..v4.0.1.0 -- .../lib/root-router-contract.cjs`; `git log --oneline v4.0.0.16..v4.0.1.0 -- '.skilled/skills/**/ROUTER.md'`; `git grep '^#+ [0-9]*\.\? *MACHINE ROUTER' v4.0.0.16 -- .skilled/skills` (no output: no `ROUTER.md` existed at that tag)

## Assessment

- New information ratio: 0.77
- Questions addressed: Q2, Q3, Q4 (partially), Q5
- Questions answered: Q2, Q3, Q5
- Calculation: 3 findings — 1 fully new (f-iter002-001), 2 partially new (both negatives that close an open question) → (1 + 0.5 + 0.5) / 3 = 0.667, plus the +0.10 simplicity bonus for closing Q3 and Q5 with one model ("the rule layer is a step ahead of `AGENTS.md`, and its citations are current") → 0.77.

## Reflection

- What worked and why: doing the link and anchor audit in Python rather than shell closed 51 false positives in one call and turned a "the rule layer is broken" story into the correct one. The second thing that worked was testing the rule's gate claims against the gate itself: the question "is this rule now redundant" has a factual answer only if you read what the checker asserts, and `parent-skill-check.cjs:2233`'s header comment answers it in four lines.
- What did not work and why: the `realpath` probe. Root cause is trusting a coreutils binary that macOS does not ship, and not sanity-checking a 51-line failure list against a single link whose target I could see. A probe that fails almost everywhere is a broken probe, not a broken repository.
- What I would do differently: when a checker's subject line is what settles a finding, read the check function's own header comment first — `12b`'s nine-line comment states the whole canon and the ratchet policy, which is more than the surrounding code shows in twenty.

## Questions Remaining

- Q4 still open: whether a v4.0.1.0 addition not yet examined — conversation playbook scenarios (`specs/sk-doc/065-conversation-playbook-scenarios`), `/doctor:symlink` and `/doctor:install`, and the worker-session nudge removal — warrants a rule statement, and whether `/doctor:agents-md`'s section manifest now makes any shipped `AGENTS.md` section self-maintaining.

## Next Focus

Close Q4 the way iteration 1 closed the other three additions: one decision per addition, either "state it in `AGENTS.md`" with the proposed line, or "the owning skill already carries it" with the file:line that proves it. Start with `/doctor:agents-md`'s section manifest, because it is the one addition that touches `AGENTS.md` itself and it is where a rule could now be redundant rather than missing.

## Gateway Record and Scope Notes

The canonical iteration record is recorded through `append-mode-event.cjs --mode research --run-directory specs/agents-md/017-v4-0-1-0-rules-refresh/research`, with the single-record event file at `deltas/iter-002.record.json` inside this packet.

Scope note, same as iteration 1 and still unresolved by design: `progressiveSynthesis` is `true` in the config, but `research/research.md` is not in this dispatch's ALLOWED WRITE PATHS. The narrower allowlist governs, so synthesis remains unowned until the workflow writes it or a later dispatch widens the allowlist.

Scope note on state: the prior iteration's `containment_violation` event in the state log names ten paths under `specs/sk-doc/055-changelog-system/...` and one under `.skilled/skills/sk-doc/scripts/tests/`. This iteration issued no write outside `specs/agents-md/017-v4-0-1-0-rules-refresh/research/`, did not touch those paths, and reverted nothing.

Note carried from iteration 1, because it affects how this packet's own records are read: the gateway's projection keeps only `type`, `iteration`, `run`, `status`, `newInfoRatio`, `ruledOut` and `timestamp`, dropping `focus`, `answeredQuestions` and `graphEvents`. Those survive in the delta file's first line and in the ledger event, which the reducer reads together.

## Concurrent Workspace Activity (operator note, added after the gateway receipt)

At 21:18:13 local (20:18:13Z), inside this iteration's window, 36 files matching `.skilled/skills/**/ROUTER.md` changed on disk — 72 insertions and 72 deletions, a uniform 2-line edit per file. Spot-checking `.skilled/skills/system-spec-kit/ROUTER.md` shows a `version: 1.0.5.0 -> 1.0.6.0` bump plus a prose edit to the OVERVIEW section. This iteration issued no write to any of those paths; every write it made landed under `specs/agents-md/017-v4-0-1-0-rules-refresh/research/`. The gateway returned exit 0 with no containment event for iteration 2, so the change is not attributed here. It was left in place, not reverted.

Effect on this iteration's evidence: none load-bearing. The findings cite `skill-hub-routing.md`, `parent-skill-check.cjs`, `package_skill.py`, `parent-skills-nested-packets.md`, `REPO RULES.md` and `hooks/git/README.md`; no finding depends on the prose of any of the 36 changed `ROUTER.md` files. The one claim that touches them is structural — that every such file's machine router sits under a `MACHINE ROUTER` heading — and a version bump plus prose edit does not move a heading.
