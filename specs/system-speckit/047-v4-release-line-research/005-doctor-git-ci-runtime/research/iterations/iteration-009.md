# Iteration 9 — repo-rules reachability, rule frontmatter shape, and doctor command format against sk-doc canon

## Focus

The repo-rules half of key question 6 (does `AGENTS.md` match `REPO RULES.md` and the files it routes) and the still-empty key question 11 (departures from sk-code / sk-doc / Skilled canon for command, skill and hub format). Two releases in this cluster were also to be covered: v4.0.0.1 ("The Working Checkout") and v4.0.0.14 (which landed `/doctor:ci`).

## Actions Taken

1. Read `REPO RULES.md` in full (114 lines) and enumerated the trigger table's Load column, then listed `.skilled/repo-rules/` on disk to compare the two sets one for one.
2. Read the frontmatter of all 13 rule files, first with a key extractor that matched only lowercase keys, then re-ran the extractor with the corrected pattern after spotting `contextType` in a diff hunk. The first pass under-reported the shape and would have produced a false "5 keys" uniformity claim.
3. Verified every cross-reference the two router documents make into the rule files: `communication-handoff.md` §1 and §5, `uncertainty-and-honesty.md` §7, `prevent-overengineering.md` §2, `scope-discipline.md` §5 and §6 against the actual heading lists.
4. Read `sk-doc`'s command authoring asset (`.skilled/skills/sk-doc/sk-create-command/assets/command-template.md`) around the frontmatter spec and the `argument-hint` budget rule, plus the machine contract `command-contract.json`, then compared them to the shipped `/doctor:ci` and `/doctor:runtime-mirrors` routers.
5. Grepped the whole tree for any consumer of the `<!-- skill_agent: X -->` marker that every doctor command carries, in `.cjs`, `.mjs`, `.ts`, `.py`, `.json` and `.yaml`, excluding `deep-review` prose.
6. Checked whether the committed trigger index carries any `repo-rules/<file>.md` path, to test whether rule `trigger_phrases` frontmatter is consumed by anything.
7. Path-limited the v4.0.0.1 and v4.0.0.14 diffs to `REPO RULES.md`, `AGENTS.md`, `.skilled/repo-rules` and `.skilled/commands/doctor`, and read the v4.0.0.1 rule-file hunks.

## Findings

### F9-01 — The `skill_agent` owner marker is canonical nowhere and read by nothing (misalignment, P2)

Every doctor command carries an owner tag in an HTML comment, directly under the frontmatter: `<!-- skill_agent: system-skilled-doctor -->` in `/doctor:runtime-mirrors` [SOURCE: .skilled/commands/doctor/runtime-mirrors.md:5] and `<!-- skill_agent: sk-code -->` in `/doctor:ci` [SOURCE: .skilled/commands/doctor/ci.md:5]. The marker is applied to 17 of the 44 shipped command files, so 27 carry no owner tag at all.

sk-doc's command authoring contract prescribes exactly three frontmatter fields for a command — `description`, `argument-hint`, `allowed-tools` [SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-template.md:221], [SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-template.md:223] — and says nothing about an owner marker, in frontmatter or in a comment. The machine-readable companion, `command-contract.json`, describes identity as `skillId`/`ownerMode` living in `command-metadata.json` and the allow-list, not in the command body.

No code reads the marker. A grep for `skill_agent` across `.cjs`, `.mjs`, `.ts`, `.py`, `.json` and `.yaml` outside `deep-review` returns zero hits. The only non-command matches anywhere in the tree are prose in the deep-review protocol, where `skill_agent` names an unrelated review overlay — "Compare SKILL.md contracts against runtime agent definitions" [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:320] — and prior research artifacts under `specs/system-skill-advisor/030-…` which already described the tag as "a latent machine-readable owner link a bridge generator could consume". Six releases later it is still latent.

Two problems in one: the marker is not in the format sk-doc prescribes, and it has no reader, so it is documentation for a consumer that does not exist. The deep-review overlay of the same name makes it worse, because a reader searching the repo finds the overlay's definition and believes the command tag is wired to it.

- Release introduced: present at v4.0.0.14 when `/doctor:ci` shipped with the tag; the tag predates it in the other doctor commands.
- Confidence: high on "no consumer in code" (repo-wide code grep, zero hits), high on the sk-doc side (template read), medium on "never consumed by an external tool" — only this repository was searched.
- Verify: `grep -rl "skill_agent:" .skilled/commands --include=*.md | wc -l` → 17 against `ls .skilled/commands/*/*.md | wc -l` → 44; `grep -rn "skill_agent" --include=*.cjs --include=*.mjs --include=*.ts --include=*.py . | grep -v deep-review | wc -l` → 0.

### F9-02 — `/doctor:ci` grants the `Write` tool and no step uses it (over-engineering, P2)

The router's frontmatter is `allowed-tools: Read, Bash, Grep, Glob, Write` [SOURCE: .skilled/commands/doctor/ci.md:4]. The body then forbids the one thing a `Write` grant would enable — "Do not edit workflow YAML while executing this command" [SOURCE: .skilled/commands/doctor/ci.md:16] — and routes file creation through a script that the Bash grant already covers: the scaffold renderer is `.skilled/commands/doctor/scripts/ci-scaffold.cjs` [SOURCE: .skilled/commands/doctor/ci.md:24]. `Write` appears exactly once in the file, at line 4.

Nothing breaks if `Write` is removed from `ci.md`. The scaffold still writes, because the script does the writing. What the grant buys today is a capability the file's own contract tells the agent not to use, which is the standing invitation to a scope violation this repository's `scope-discipline.md` exists to prevent.

- Release introduced: v4.0.0.14 (the commit that added `ci.md`, 84 lines).
- Confidence: high. The one-hit grep is decisive within the file; the residual uncertainty is whether a skill-level instruction acts on the grant outside the router, which no file read this iteration showed.
- Verify: `grep -n "Write" .skilled/commands/doctor/ci.md` → line 4 only.

### F9-03 — `REPO RULES.md` §4 undercounts its own whole-turn triggers (drift, P2)

§4 states that Delivery is "one of two rules here whose trigger is a whole turn rather than a specific action, the other being the handback rule" [SOURCE: REPO RULES.md:85]. The trigger table contradicts the count. Four rows fire on a whole turn rather than an action: "Write any substantive reply" [SOURCE: REPO RULES.md:48], "Draft or edit any sentence a reader will read" [SOURCE: REPO RULES.md:49], "Present a recommendation, a fork, or a trade-off" [SOURCE: REPO RULES.md:50], and "End a turn" [SOURCE: REPO RULES.md:51]. A count of those four trigger phrases in the file returns 4, not 2.

The error is small and the consequence is not: §4 is the section a maintainer reads to decide whether a new rule belongs in this directory, and it understates how much of the directory is already turn-scoped. A maintainer trusting "one of two" will judge a fifth turn-scoped rule to be a category error.

- Release introduced: unknown precisely; §4 text is present at HEAD and was not touched by the v4.0.0.1 diff, which means it predates the release line opened by this audit and survived it.
- Confidence: high on the count, medium on "drift" being the right label versus stale prose — either way the sentence is wrong at HEAD.
- Verify: `grep -c "End a turn\|Write any substantive reply\|Draft or edit any sentence\|Present a recommendation" "REPO RULES.md"` → 4.

### F9-04 — Rule `trigger_phrases` are consumed by nothing, so Gate 1 can never surface a rule file (over-engineering + extension, P2)

All 13 rule files carry a full six-key frontmatter block — `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, `version` — for example [SOURCE: .skilled/repo-rules/blast-radius.md:24] and [SOURCE: .skilled/repo-rules/evidence-and-proof.md:28]. `blast-radius.md` ships 16 trigger phrases, `evidence-and-proof.md` ships 16, and every other file ships a comparable list.

The committed trigger index contains no rule-file path. `grep -o "repo-rules/[a-z-]*\.md"` over `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` returns nothing, while the same file holds 25 occurrences of the phrase "blast radius" sourced from spec documents. So the phrases that would make a rule file findable are indexed for specs and not for rules.

What that costs: Gate 1, the per-message context lookup, runs on every turn; Gate 5, the rule loader, runs only on the first write. A read-only or review turn therefore never loads `evidence-and-proof.md`, `uncertainty-and-honesty.md` or `answer-the-actual-request.md`, even when the message is "is this done?" or "are you sure?" — exactly the phrases those files index. `AGENTS.md` §4 acknowledges the gap by hoisting two clauses out of the rule files into itself so they bind "regardless of what loads".

What breaks if the frontmatter is removed: nothing measurable today, because no reader exists. That is the over-engineering half. The extension half is the useful one: index the 13 rule files the way specs are indexed, and Gate 1 surfaces them for read-only turns, which closes the hole §4 patches by hand.

- Release introduced: the frontmatter predates v4.0.0.0; the indexing gap is structural and was never closed through v4.0.2.0.
- Confidence: high on the index containing no rule path (direct grep), high on the field presence (13/13 counted), medium on "no other reader" — a reader outside `.skilled/skills/system-spec-kit/runtime/` was not exhaustively searched.
- Verify: `grep -o "repo-rules/[a-z-]*\.md" .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | sort -u | wc -l` → 0; `grep -c '^trigger_phrases:' .skilled/repo-rules/*.md` → 1 for each of 13 files.

### F9-05 — "The more specific wins on conflict" has no mechanism to resolve a conflict (improvement, P2)

The router's operating rule 4 says every firing trigger is loaded and that "the more specific wins on conflict" [SOURCE: REPO RULES.md:15]. The precedence table immediately below ranks all rule files together at one level: level 3 is "These rule files, and the guidance in a skill's `SKILL.md`" [SOURCE: REPO RULES.md:26]. No rule file declares a specificity rank, and `importance_tier` — the one field that could carry one — is `important` or `normal` on nearly all of them, which is not an ordering.

The clause is unexecutable as written. In practice an agent that follows it silently invents a specificity ranking at the moment of conflict, which is the one moment the ranking should not be improvised. A one-line fix exists either way: name the tie-break explicitly (narrower trigger wins; the file whose section the conflict sits in wins), or drop the clause and let "both load, and a genuine conflict is a LOGIC-SYNC halt" be the rule.

- Release introduced: predates the release line; unchanged by the v4.0.0.1 repo-rules edit.
- Confidence: high on the absence of any specificity field (13/13 frontmatter blocks read), high on the table's single level-3 row.
- Verify: `grep -n 'more specific wins' "REPO RULES.md"` → 1 hit; `grep -c 'specificity\|precedence_rank' .skilled/repo-rules/*.md` → 0 for each.

### F9-06 — Rule version stamps are hand-maintained and skip numbers (drift, P2)

v4.0.0.1 bumped `blast-radius.md` from `version: 1.0.1.0` to `version: 1.0.1.2`, skipping `1.0.1.1` with no intermediate commit in the diff [SOURCE: .skilled/repo-rules/blast-radius.md:25]. `uncertainty-and-honesty.md` went 1.0.1.0 → 1.0.1.1 in the same release, and HEAD now reads 1.0.1.5 [SOURCE: .skilled/repo-rules/uncertainty-and-honesty.md:134] region while `evidence-and-proof.md` reads `1.1.1.5` [SOURCE: .skilled/repo-rules/evidence-and-proof.md:29] — five hand bumps across this release line, in a field with no reader and no changelog to compare it against.

The same release added a substantive delivery rule to the blast-radius ladder — "Before you stop, finish what the yes does not depend on" — which is the kind of change that justifies a bump. The skip is what a manual counter does when two edits land in one session, and nothing in the repo can detect it. Removing the `version` field breaks nothing; keeping it costs a maintainer's attention at every edit and buys no checkable signal.

- Release introduced: v4.0.0.1 (bcb775402e).
- Confidence: high on the numeric skip (diff read), high on "no reader" (same evidence as F9-04), medium on whether a changelog elsewhere tracks these per-file versions.
- Verify: `git diff 3fed08373e..bcb775402e -- .skilled/repo-rules/blast-radius.md | grep '^[-+]version'` → `-version: 1.0.1.0` / `+version: 1.0.1.2`.

### INVARIANT-VERIFIED — the rule directory is fully reachable and its frontmatter shape is uniform (negative result)

The reachability question is clean, and this iteration can say so with evidence rather than assertion. `.skilled/repo-rules/` holds 13 files; `REPO RULES.md`'s trigger table holds 13 rows, one per file, with no file reachable only through the §3 index and no row pointing at a missing file. `AGENTS.md` additionally names 8 of them directly in prose. Every section anchor the two router documents cite resolves: `communication-handoff.md` §1 and §5 exist at [SOURCE: .skilled/repo-rules/communication-handoff.md:150], `uncertainty-and-honesty.md` §7 exists at [SOURCE: .skilled/repo-rules/uncertainty-and-honesty.md:134], `prevent-overengineering.md` §2 and `scope-discipline.md` §5 and §6 exist at their cited numbers. Frontmatter is uniform: all 13 files carry the same six keys in the same order, and all 13 carry `contextType: reference`.

This matters as a hedge against confirmation bias: the iteration set out to find repo-rules outliers and found none, so the findings above are the real residue rather than the most available thing to report.

## Questions Answered

- **Key question 11** ("Where do these surfaces depart from sk-code, sk-doc and Skilled canon for command format, skill format and hub routing?") — substantively answered for command format: the departures are the undocumented and unconsumed `skill_agent` owner marker carried by 17 of 44 command files (F9-01) and the unused `Write` grant in `/doctor:ci` (F9-02). The `argument-hint` budget the template sets at 140 characters is honoured — `ci.md` is 45 characters, `runtime-mirrors.md` is 16 — so the departures are about identity metadata and tool grants, not invocation shape.
- The repo-rules half of key question 6 is now closed: `AGENTS.md`'s references into `.skilled/repo-rules/` all resolve, the directory is fully reachable from the trigger table, and the frontmatter has no outliers. The residue is internal-to-`REPO RULES.md` inconsistency (F9-03, F9-05) rather than router-versus-rules mismatch. Devin's 16,384-byte rule cut was not measured this iteration and remains open.

## Questions Remaining

- Does Devin's 16,384-byte rule cut truncate a binding rule? The rule directory is reachable and ordered by the trigger table, but the concatenated byte size against the cut was not measured.
- Does a message carrying both `Commit-Id: 0000000` and a valid id get refused? Still open, still needs a deliberate hand-written message.
- Does `pre-push` refuse a pushed non-merge commit without a Commit-Id, and does a wedged git call block with `BLOCKED [gate:git-timeout]` at 20 s? The read-only bound has blocked inducing a live timeout across four iterations.
- Do the remaining v4.0.0.15/v4.0.0.16 worktree behaviours (`local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`) match their notes?
- Do the `sk-git` hook suites pass at HEAD, and would wiring them into CI fail today? Running them writes throwaway repos, outside the read-only bound.
- What would a bridge generator actually consume if `skill_agent` became machine-read — `_routes.yaml` `trigger_phrases`, or `command-metadata.json` `skillId`? The tag duplicates identity that already exists in two other places (F9-01), so any consumer design has to pick one of three.

## Next Focus

Iteration 10 should close the v4.0.0.15/v4.0.0.16 worktree behaviours, the last high-value unexamined surface in this cluster, by reading the `sk-git` worktree scripts and the two release notes together and path-limiting `git diff 22c3a9b2c7..f459b06479` to `.skilled/skills/sk-git`. If the read-only bound still blocks a live repro, the honest close-out for this cluster is that hook *behaviour* is evidenced by code path only and the repro debt is named in the final summary rather than left implicit. The Devin byte-cut measurement is cheap and belongs in the same iteration.
