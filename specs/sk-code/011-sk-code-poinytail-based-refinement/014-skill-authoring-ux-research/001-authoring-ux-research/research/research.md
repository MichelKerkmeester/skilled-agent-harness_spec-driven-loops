# Skill Authoring UX Research: making the 092 error class hard to make

One `/deep:research` lineage (`t3-dsflash-llmgw`) ran ten iterations on DeepSeek V4.1 Flash at max effort through cli-pi and the LLM Gateway route, from 18:43 to 19:03 UTC on 2026-10-10. The runner reported one lineage, one success, no containment advisory and no timeout. No usage limit was hit, so the cline fallback was never used. The lineage's own synthesis is `lineages/t3-dsflash-llmgw/research.md`. This file is the orchestrator's synthesis: it keeps the lineage findings that survived a rerun, corrects two, and adds four the lineage missed.

**Evidence labels.** `Evidence status: Verified` means the orchestrator ran the command or read the cited line itself in this session. `Inferred` means the conclusion follows from verified facts but no single observation proves it; each inferred entry says what would confirm it.

---

## 1. Root Causes

### E1. Generated artifacts drift from their sources

Evidence status: Verified

**Root cause.** Each generated artifact is a stored copy of authored input, and its regeneration runs on a different surface than the edit. The repository already closed this for compiled-route manifests: the pre-commit hook regenerates and stages them whenever a hub `SKILL.md`, `hub-router.json` or `mode-registry.json` is staged [SOURCE: .skilled/scripts/git-hooks/pre-commit:352] [SOURCE: .skilled/scripts/git-hooks/pre-commit:382]. The leaf manifest has no such trigger. Its freshness gate runs only in CI [SOURCE: .github/workflows/routing-registry-drift.yml:196], and the pre-push hook compares it for commit parity without checking freshness [SOURCE: .skilled/scripts/git-hooks/pre-push:455].

**What the author sees.** A scratch copy of `sk-code` with one new file under `sk-code-obsidian/references/` made `generate-leaf-manifest.cjs --check` exit 1 with two hashes and "Re-run with --write to regenerate." [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:546]. The message names the fix but not the file that changed, and it appears only when someone runs the check. A file added under the hub's `shared/references/` left the manifest unchanged, so not every reference edit stales it, which the author cannot tell in advance.

**A fixer already exists.** `ci-skill-root-metadata.cjs --fix --skill <name>` regenerates the leaf manifest and the derived aliases for one root and writes nothing else [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:33]. So the missing piece is the trigger, not a tool.

**Two more live drifts, found by the lineage and rerun here.** `generate-router-intent-signals.cjs --check` printed `RESULT: FAILED`, exit 1, with cli-classifier missing 23 declared phrases, and no hook or workflow runs it [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:1]. `skill-graph-freshness.cjs` printed `STALE COMPILED` (graph generated 2026-10-02, newest source 2026-10-04) and still exited 0, by design [SOURCE: .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:15].

**Owners outside the two skills.** Hermes copies are already gated at commit [SOURCE: .skilled/scripts/git-hooks/pre-commit:266], but the block says only "regenerate the mirror the message names" [SOURCE: .skilled/scripts/git-hooks/pre-commit:289]. The trigger index goes stale with every new spec doc and is rebuilt by CI after merge. Both belong to system-spec-kit, so they are named here and left to that owner.

### E2. One hub version in six files, and a changelog number that collided

Evidence status: Verified

**Root cause.** The hub version is a hand-allocated value stored in six places, and no single writer moves them together. `sk-code` carries `2.2.7.0` in `SKILL.md`, `ROUTER.md`, `README.md`, `description.json`, `hub-router.json` and `mode-registry.json` (grep, this session). Parity is checked only by the doctor's 13a to 13d, which runs from `/doctor` or CI [SOURCE: .github/workflows/routing-registry-drift.yml:185]. The commit that last bumped the hub lists the manual chores in its own body: "Bump the hub to 2.2.7.0 with a changelog, re-mint the manifest, refresh the Hermes copy and rebuild the trigger index" (`git show 5cf062b021`).

**What the author sees.** Bumping only `SKILL.md` in a scratch copy produced six separate FAIL lines (13a for four files, 13b, 13c), and none named a command that fixes them. sk-create-skill's maintenance guidance names one field: "Update frontmatter version field" [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:179].

**Three of the six copies have no reader.** No code under `.skilled/bin/`, the advisor runtime or the sk-create-skill scripts reads `version` from `hub-router.json`, `mode-registry.json` or `description.json`. 13a already skips a follower that declares no version [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1877]. Only the schema doc [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:53] and the templates require it. This sub-claim is Inferred from bounded greps; a full-repo search for readers of those three JSON `version` fields would confirm it.

**The collision.** The branch and main each minted system-spec-kit `2.7.1.0`, so the merge moved the branch's entry into `v2.7.2.0.md` (`git show 9a74576ccc`). The changelog workflow picks the next number from the local checkout's own files and resolves a clash by incrementing locally [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:507]. Two branches from one base therefore pick the same number, and the clash appears only at merge.

### E3. Advisor routing: a named thing is read as the requested tool

Evidence status: Verified

**Measured.** The battery was run through `node .skilled/bin/skill-advisor.cjs advisor_recommend` this session. sk-code was first on 12 of 17 positives (P1, P4, P7, P11 and P15 went elsewhere) and on 2 of 5 negatives (N1, N5). The recorded 092 figure is 13 of 17. The battery's pass rule is at least 14 of 17 and zero negatives [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:58].

**Root cause one, corrected from the lineage.** The lineage said the file-path pull comes from the derived keyword lane, capped at 0.35. Attribution says otherwise. For N1 ("Update the sk-code SKILL.md headline section...") the winning lane is `explicit_author` at raw score 1.0, because any skill name in the prompt adds a full point to that skill [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:342]. The scorer cannot tell the object of an edit (the sk-code docs) from the tool to use (sk-doc).

**Root cause two, new.** For P1 ("...executor-config.ts to throw on missing model when type is cli-opencode") the executor-delegation pass reads the string value `cli-opencode` as a request to delegate. It lifts cli-external-orchestration to 0.95 and caps sk-code at 0.88 after fusion [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:55] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:57]. The output lists cli-external-orchestration first with score 0.613 above sk-code at 0.668, so neither score nor confidence explains the order to a reader. N4 ("Reorganize the cli-opencode README...") fails the same way.

**Root cause three, generic words in scorer source.** Phrase boosts such as `'audit the'` add a full point to sk-code [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:178]. A write verb plus a word like `classifier` or `json` adds 0.7 [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:299]. These tables live in advisor code, so a skill author cannot see or offset them from their own skill.

**Root cause four, a false instruction to authors.** sk-create-skill tells authors that `description.json` keywords are among "the fields the advisor's scorers read" [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:329]. No advisor code reads `description.json` (grep over the whole skill, excluding tests, dist and docs). Keywords come from `SKILL.md` frontmatter and graph metadata [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:770] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:756]. The round-two child hit exactly this: new keywords in `description.json` did not move the route.

### E4. advisor_recommend never passes --surface-hint

Evidence status: Verified

**Root cause.** The front door accepts `--surface-hint` [SOURCE: .skilled/bin/compiled-route.cjs:36], and the sk-code hub tells its caller to pass it [SOURCE: .skilled/skills/sk-code/SKILL.md:63]. The advisor, the only automated caller, spawns the front door with `--hub` and `--prompt-stdin` only [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:376]. Its input schema is strict and has no surface field [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:248]. The hint therefore never fires on the advisor path, which is why the battery did not move after the round-four change.

**What the author would need to know.** That the advisor handler is itself a caller of the front door, and that its options object is closed. Nothing on the front-door side says so.

### E5. Doctor and router-sync rules fire after the fact

Evidence status: Verified

**Root cause.** The structural rules (5e, 5i, 13a to 13d, 10b) live in `parent-skill-check.cjs`, which runs from `/doctor` and the routing-drift CI job [SOURCE: .github/workflows/routing-registry-drift.yml:185]. The commit hook already computes which hubs a commit stages, for the route re-mint, but asks none of these questions there [SOURCE: .skilled/scripts/git-hooks/pre-commit:382]. The checker is fast enough for a commit gate: one hub took about two seconds here. A clean run on sk-code reported that all hard invariants passed with 0 warnings, exit 0.

**Already partly reachable for external authors.** `validate_skill_package.py` calls `parent-skill-check.cjs` for a hub package [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py:267]. An external author who runs the validator gets these rules; a maintainer who commits does not.

### E6. A regenerator whose check mode cannot fail

Evidence status: Verified

`regenerate-skill-derived.cjs` documents "1 stale in check mode" and a `--skills-dir` option [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:237], but its argument parser rejects `--skills-dir` and its run function returns 0 for any dry run that finds changes [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:257]. The real check is `ci-skill-derived-freshness.cjs`, so this is a documentation defect, but an author who trusts the header gets a green exit on stale metadata.

### Cross-class pattern

Evidence status: Inferred

Every class above has the same shape: a value the author's edit should determine is stored as a copy, and the check that compares the copy runs somewhere the author is not. The repository already has the answer for one family, the commit hook that regenerates and stages compiled-route manifests. Most fixes below attach an existing check or writer to that same hook, or remove a copy that nothing reads. A rerun of the battery and the doctor after the phases land would confirm or refute this.

---

## 2. Rejected Ideas

Evidence status: Inferred

Each was tested against the reversal-cost order in `.skilled/repo-rules/prevent-overengineering.md`.

| Idea | Rejected because |
|------|------------------|
| A new standalone `bump-hub-version` script | The changelog workflow already resolves the component and writes the versioned file; extending it is one rung cheaper than a new file |
| Teach the advisor to read `description.json` keywords (the lineage's proposal) | It adds a third vocabulary source to keep in sync. Correcting the one false sentence in sk-create-skill removes the reason authors edit that file for routing |
| A new negative-keyword scorer lane | A new lane is an abstraction. Telling an edit object from a requested tool inside the existing explicit lane is an in-place extension and fixes N1, N4 and P1 directly |
| Auto-reindexing the skill graph on every commit | The reindex is operator-gated by design and write-heavy. Making the freshness panel exit non-zero on STALE is enough to stop a silent stale state |
| Deriving `routerPolicy.tieBreak` from the registry | The order among modes of one kind is a real choice. Running 5e and 5i at commit catches the drift without taking the choice away |
| Dropping the version from `ROUTER.md` and `README.md` too | Doc-class frontmatter must carry a four-part version under the packaging check, so those two copies stay and the writer moves them |
| Deriving the leaf manifest at read time | It is the typed keying surface the router loads; derivation would move cost into every route for an event that happens per commit |
| Fleet-wide re-mint on every commit | The fleet leaf gate took about ten seconds for fourteen manifests; scoping to the staged skill keeps the hook fast |
| Documentation-only fixes for E1 and E5 | The docs already say "regenerate rather than hand-edit" and the drift still happened; the failure is timing, not knowledge |
| A version registry with allocation locks | Coordination machinery without a measured collision rate; reading the shared ref inside the existing workflow covers the one recorded collision |
| Inferring the surface hint from the prompt | That is the tie the hint exists to break; the hint has to come from the session's files |
| A new unified authoring gate for external users | `validate_skill_package.py` already is that command; a second one splits the surface |

---

## 3. Proposed Implementation Phases

Evidence status: Inferred

Ranked by 092-class errors prevented per unit of cost. Each phase changes existing files only.

| Rank | Phase | Classes | File it changes | Check that proves it | Audience |
|------|-------|---------|-----------------|----------------------|----------|
| 1 | Correct the routing-field sentence: name `graph-metadata.json` `intent_signals` and the ROUTER.md carry as what the scorer reads, and say `description.json` is not read | E3 | `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` | `grep -c "description.json. keywords" .skilled/skills/sk-doc/sk-create-skill/SKILL.md` prints 0 | Both |
| 2 | Extend the staged-hub block of the commit hook: run `ci-skill-root-metadata.cjs --fix --skill <hub>` and stage the leaf manifest, run `parent-skill-check.cjs <hub>` and block on hard failures, run `generate-router-intent-signals.cjs --check` | E1, E2 parity, E5 | `.skilled/scripts/git-hooks/pre-commit` | On a scratch branch: stage a new leaf file and see the manifest staged; stage a `SKILL.md`-only version bump and see the commit blocked by 13a | Maintainers |
| 3 | Make the changelog workflow the one bump command: pick the next number against the upstream ref as well as the checkout, and write the same version into `SKILL.md`, `ROUTER.md` and `README.md` | E2 | `.skilled/commands/create/assets/create-changelog-auto.yaml` | `parent-skill-check.cjs <hub>` after one run prints PASS for 13a, 13b, 13c and 13d | Both |
| 4 | Drop `version` from the three JSON carriers that nothing reads, after a full-repo reader search confirms it | E2 | `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md`, the three parent-skill templates, `init_skill.py`, then each hub's JSON | `parent-skill-check.cjs` on every hub still prints `13a-version: all routing artifacts carry the SKILL.md version` | Both |
| 5 | Stop a named edit object from routing to its owner: skip the `explicit:<skill>` point when the name is followed by a doc or path token, and skip the delegation lift when the executor name is a quoted value in a code edit | E3 | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` and `lib/scorer/executor-delegation.ts` | The battery replay reaches 14 or more of 17 and 0 of 5; `routing-golden-prompts.vitest.ts` shows no regression | Both |
| 6 | Pass the surface hint: add an optional `surfaceHint` to the advisor input schema and forward it as `--surface-hint` | E4 | `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` and `runtime/handlers/advisor-recommend.ts` | A handler test asserting the front-door argv carries `--surface-hint WEBFLOW` when the option is set and omits it otherwise | Both |
| 7 | Clearer messages: the leaf check lists added and removed leaves and prints the full `--write` command; the freshness panel exits 1 on STALE behind a flag the CI job passes; the regenerator header matches its real exit codes | E1, E6 | `generate-leaf-manifest.cjs`, `skill-graph-freshness.cjs`, `regenerate-skill-derived.cjs` | The scratch-copy drift reproduction prints the new file name; the panel exits 1 on today's stale graph with the flag | Both |

**Order of work.** Phase 1 is a one-sentence fix and goes first. Phase 2 prevents the most classes for one file. Phase 5 is the only phase that moves the failing battery, so it should run early if impact outranks the cost metric.

**Left to other owners.** The Hermes mirror message and the trigger-index cadence belong to system-spec-kit and are not ranked here.
