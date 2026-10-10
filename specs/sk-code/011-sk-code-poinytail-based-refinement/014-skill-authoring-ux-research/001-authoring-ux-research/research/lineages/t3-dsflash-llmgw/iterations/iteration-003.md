# Iteration 3: E2 — the six-file hub version and the changelog number

## Focus
E2: the hub version carried in six files (SKILL.md, ROUTER.md, README.md, description.json, hub-router.json, mode-registry.json) plus the changelog file whose number collided at merge. Questions: which rules define parity, which writes allocate the version, where the author is told what to bump, and where a parallel branch's changelog number can collide.

## Actions Taken
- Read parent-skill-check rules 13a-13d end to end and ran it against sk-doc (read-only; the checker has no write calls).
- Read the /create:changelog auto workflow's version determination and write steps.
- Read the author-facing versioning guidance (examples-and-maintenance.md).
- Read the packet spec's own E2 problem statement.
- Checked the pre-commit gate list for any commit-time version parity check.

## Findings
1. [VERIFIED] The parity contract is explicit: SKILL.md is the release authority (four-part version); ROUTER.md, description.json, hub-router.json and mode-registry.json must carry exactly it (13a); the newest changelog entry must equal it (13b); README.md should carry it (13c); each packet SKILL.md must match its newest changelog entry, and that entry's own version line must match its filename (13d). [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1783-1802,1862-1891]
2. [VERIFIED] Live state on sk-doc: 13a PASS (all routing artifacts 2.3.0.0), 13b PASS, 13d PASS across 14 mode packets, 13c WARN — README.md still carries 2.2.0.77 against SKILL.md 2.3.0.0. (ran `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc`)
3. [VERIFIED] The README drift is tolerated by design on exactly the hubs that have it: README_VERSION_WARN_ONLY lists cli-classifier, cli-external-orchestration, sk-doc and system-deep-loop, and 13c downgrades those to a warning while every other hub fails. [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1804-1821]
4. [VERIFIED] The only writer of the changelog filename computes the next version from the local checkout's own `.skilled/changelog/{component}/v*.md` list and verifies uniqueness the same way — "IF file v{next_version}.md already exists: Increment BUILD segment until unique" — then writes only the changelog file. It never writes SKILL.md, ROUTER.md, README.md, description.json, hub-router.json or mode-registry.json. [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:486-512,636-652]
5. [VERIFIED] The author-facing versioning guidance names one field: "Update frontmatter version field" with a single SKILL.md example; the six-carrier rule and the changelog-filename coupling appear nowhere in that maintenance section. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:172-185]
6. [VERIFIED] No commit-time version parity check exists: the pre-commit gates cover comment hygiene, phrase lint, agent mirrors, mirror parity, prompt cards, MCP mutation class, route re-mint and spec metadata re-mint; none runs parent-skill-check's 13a-13d. A hub version bump is therefore verified only by a doctor run after the edit. [SOURCE: .skilled/scripts/git-hooks/pre-commit:191-700]
7. [VERIFIED] The packet's own problem statement records the outcome — "A hub version lives in six files plus a changelog whose number collided at merge" — stated as an experienced failure of the 092 epic, not a hypothetical. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/spec.md:62]
8. [INFERRED] Root cause: the version is a hand-allocated value stored multiply, and no single writer moves it. The changelog command allocates a number from one checkout's view and writes one file; the carriers are bumped by hand from a maintenance doc that mentions one of them; parity is verified only by a doctor rule that runs out-of-loop and, for README, only warns. Parallel branches allocate from the same base list, so the same next number is chosen independently; at merge a filename collision is either a conflict or two histories claiming one number.
9. [INFERRED] Smallest fix ranked by reversal cost: (a) build nothing fails — the guidance already exists and the drift persists (13c WARN live); (b) change a value first — empty README_VERSION_WARN_ONLY once those four READMEs are repaired, so the check has teeth; (c) extend the existing /create:changelog workflow in place — allocate the next version against the shared ref (remote branch tip) rather than only the working tree, and after writing the changelog file write the same four-part version into the component's SKILL.md and its followers, then run the 13x parity as its own verify step; one command then performs the whole bump and most parallel-branch collisions disappear; (d) a standalone bump script is a new file the command already supersedes; (e) a version registry with locks is a new file plus coordination, unearned while the command exists. A commit-time parity check is worth adding as the safety net for hand bumps, ideally as one more entry in the existing hook. Proof: re-run parent-skill-check on the bumped hub and expect 13a/13b/13c/13d all PASS; for the collision, rerun the changelog command from two worktrees against the same base and expect the second to take the next free number. Audience: maintainers (hook safety net, fleet parity), external authors (the one command ships in sk-create-skill; the doctor does not, so the command is their whole fix).

## Ruled Out
- A version registry or allocation lock: new file plus cross-branch coordination machinery for a value that a remote-ref read in the existing command can pick safely; fails the cheaper move.
- Deriving the follower versions at read time instead of storing them: the files are authored JSON/markdown that ship to consumers, so there is nothing to derive them from at read time; a new abstraction.
- A standalone bump script as the primary fix: the changelog command already resolves the component and writes the versioned file; a second tool duplicates that surface.
- Adding the 13x check to CI only: CI sees the merged result but the author is already gone; the commit-time surface is where the hook precedent lives.

## Dead Ends
- Searching the epic goal logs for a recorded duplicate-changelog incident found no line-level record; the collision survives only in the packet's problem statement (spec.md:62). Noted as evidence status: the failure mode is stated by the packet, while its mechanics are verified in the command.

## Edge Cases
- Contradictory evidence: none. The 13c warn set is a deliberate carve-out, documented as such in the code comment.
- Missing dependencies: none.
- Partial success: none; E2 is answered at the root-cause level.
- Ambiguous input: the exact merge incident behind spec.md:62 is not reproducible from the checkout; treated as a packet-stated fact and labeled accordingly.

## Sources Consulted
- .skilled/commands/doctor/scripts/parent-skill-check.cjs
- .skilled/commands/create/assets/create-changelog-auto.yaml
- .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md
- .skilled/scripts/git-hooks/pre-commit
- specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/spec.md

## Assessment
- New information ratio: 0.90
- Questions addressed: Q2 (complete), Q5 (partial: commit-time surface)
- Questions answered: Q2

## Reflection
- What worked and why: running parent-skill-check turned a doc-level parity contract into a live picture (three passes, one tolerated warn) and located the drift the fix must repair first.
- What did not work and why: an initial git probe for duplicate changelog additions produced counts that measured modifications, not additions; discarded rather than reported.
- What I would do differently: read the command workflow's write step before its rule prose — the write scope (one file) decided the fix ranking more than the rules did.

## Recommended Next Focus
Iteration 4, E3 first half: the advisor routing pipeline itself — how a prompt reaches a hub (graph sources, description.json keywords, intent_signals, path and marker rules), why a file path in the prompt pulls the route to the skill that owns it, and why documentation and research prompts land on sk-code.
