# Iteration 3: Q5 Consolidation — Verified Inventory of Doc-Version Writers and Checkers

## Focus

Q5 of the strategy key questions, carried forward for consolidation after iteration 2's inventory. Two loose ends made the consolidation non-trivial: (a) iteration 2's "package-time validators" leg rested solely on the versioning standard's prose, never on the validator sources themselves; (b) iteration 2 re-asserted iteration 1's "engine exists as two byte-identical copies" claim, which sits in tension with iteration 2's own `.opencode/skills` symlink discovery — if `.opencode/skills` is a symlink, sibling entrypoints under `scripts/` vs `shared/scripts/` deserved the same identity test. Both loose ends are closed here with direct filesystem/source evidence, after which the Q5 inventory is stated once, in full, with every leg source-verified.

## Actions Taken

1. Read state: `research/deep-research-config.json`, `research/deep-research-strategy.md`, `research/findings-registry.json`, `research/iterations/iteration-001.md`, `research/iterations/iteration-002.md`, `research/deltas/iter-002.jsonl`, and the state-log projection. Packet boundary and intended write paths were precomputed; `iterations/iteration-003.md` and `deltas/iter-003.jsonl` were verified absent before any write.
2. Searched the repository (excluding `specs/`) for `quick_validate|package_skill` to locate the real validator paths and any callers.
3. Read the version-handling lines of `package_skill.py` and `quick_validate.py` (required-field lists, 4-part regex, error strings, doc-class rules).
4. Searched `.opencode/scripts/git-hooks/` and `.skilled/hooks/` for `package_skill`/`quick_validate` callers, and `.github/workflows/` for validator and frontmatter references.
5. Read the post-edit router's `isVersionedSkillDoc` predicate and Row 3 scope (lines 131-139 and 196-212).
6. Ran `ls -la` + `readlink` over the `frontmatter-version.mjs`, `check-frontmatter-versions.sh`, `quick_validate.py` and `package_skill.py` entrypoint pairs, and read the wrapper's exec target.

## Findings

1. **The package-time validators enforce version presence and 4-part shape at source level — format only, so they too cannot see stored-vs-derived drift.** `package_skill.py` lists `version` in `REQUIRED_FRONTMATTER_FIELDS` [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:56], hard-errors on a missing version for versioned doc-class files [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:200], and rejects any value failing `^\d+\.\d+\.\d+\.\d+$` [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:334]. The create-skill command asset states the same contract as "package_skill.py --check hard-fails missing version / non-4-part version / name!=folder" [SOURCE: .skilled/commands/create/assets/create-skill-auto.yaml:210]. `quick_validate.py` mirrors it for skills: missing version is an error, present values must be 4-part [SOURCE: .skilled/skills/sk-doc/shared/scripts/quick_validate.py:255]. Neither script reads git, so both check shape only. (Source-verifies the leg iteration 2 cited only through the standard.)

2. **The validator entrypoints are symlinks, extending iteration 2's alias pattern — and the same test supersedes the "duplicated engine" claim.** `.skilled/skills/sk-doc/scripts/quick_validate.py -> ../shared/scripts/quick_validate.py` and `.skilled/skills/sk-doc/scripts/package_skill.py -> ../sk-create-skill/scripts/package_skill.py` [SOURCE: .skilled/skills/sk-doc/scripts/quick_validate.py:1][SOURCE: .skilled/skills/sk-doc/scripts/package_skill.py:1]. Applied to the engine pair: `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs -> ../shared/scripts/frontmatter-version.mjs` and `.skilled/skills/sk-doc/scripts/check-frontmatter-versions.sh -> ../shared/scripts/check-frontmatter-versions.sh` [SOURCE: .skilled/skills/sk-doc/scripts/frontmatter-version.mjs:1][SOURCE: .skilled/skills/sk-doc/scripts/check-frontmatter-versions.sh:1]. There is exactly one physical `frontmatter-version.mjs` (21686 bytes) at the `shared/scripts` path [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:1]; `diff -q` reported "identical" because it followed the symlink. The prior "two copies double the update surface" finding is corrected: the update surface is single, and the repository's convention is symlink aliasing (`.opencode/skills`, `.opencode/agents`, and these script pairs), not duplication.

3. **No hook or workflow invokes the package-time validators; they run only inside the create-skill command flow.** A search for `package_skill|quick_validate` across `.opencode/scripts/git-hooks/` and `.skilled/hooks/` returns zero matches, and the `.github/workflows/` search finds no reference either (only frontmatter-guard comments). Package-time validation happens when an operator or command runs `package_skill.py --check` during skill authoring — never on ordinary doc edits, never in CI, never at commit time. [INFERENCE: based on zero-match searches over the hook and workflow surfaces, plus the command-asset usage lines at .skilled/commands/create/assets/create-skill-auto.yaml:227.]

4. **The only automatic version check is Row 3 of the post-edit router, and its scope is precisely bounded: skill-tree docs only, presence+format, deduped per skill.** Row 3 fires only when the edited file lives under `.skilled|.opencode` + `skills/` with at least four path segments [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:198], and only when `isVersionedSkillDoc` accepts the file: `SKILL.md` always; `README.md` only when a sibling `SKILL.md` exists; other docs only when a middle segment maps to a canonical skill scope subtree [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:131]. It then dispatches `check-frontmatter-versions.sh --skill <name>` with a per-skill dedupe key [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:204], and the wrapper execs the engine in `gate` mode [SOURCE: .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh:13] — "presence + format only — no git, no manifest" [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:399]. Docs outside skill trees receive no version check at all, and no automatic surface compares stored vs derived.

5. **Consolidated Q5 answer (closure):** no hook, generator, packaging step or CI workflow writes a doc version; the only writer is operator-run `apply` [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:445]. Every automated check is presence/format only, at three surfaces: the post-edit gate (skill docs), the package validators (command-run), and CI's coverage guard, which does not know the `version` field exists [SOURCE: .opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh:7]. `verify` — the only stored-vs-derived comparison — is invoked by nothing at all. Audit trail: iteration 1 (surfaces named) + iteration 2 (inventory) + iteration 3 (legs source-verified, duplicate-engine claim corrected).

## Questions Answered

- Q5: Which hooks, generators or CI steps write or check a doc version today, if any? — answered across iterations 1-2; this iteration source-verifies the residual package-validator leg, bounds the one automatic gate, and corrects the duplicate-engine claim. No autonomous writer exists; all automated checks are presence/format; `verify` has no caller.

## Questions Remaining

- Q2: What should doc versions mean for an external author?
- Q3: What is the smallest contract that stays green by construction?
- Q4: Should the per-doc version exist at all?

## Ruled Out

- **Package-time validators as an automated enforcement surface.** Nothing under `.opencode/scripts/git-hooks/`, `.skilled/hooks/` or `.github/workflows/` references `package_skill.py`/`quick_validate.py`; they are command-run only.
- **The engine pair as two drift-prone copies.** `readlink` resolves `scripts/frontmatter-version.mjs` to `../shared/scripts/frontmatter-version.mjs`; one physical file, one update surface.

## Dead Ends

- None newly eliminated. All iteration 1-2 dead ends remain BLOCKED and were not retried.

## Edge Cases

- Ambiguous input: none — the dispatch asked for Q5 consolidation; the two verification targets were chosen as the only legs lacking direct source evidence.
- Contradictory evidence: **resolved.** Iterations 1-2 asserted a "byte-identical duplicate engine pair" (iteration 2: "remains real"); direct `readlink`/`ls -la` evidence shows symlink aliases, not copies. The better-supported claim is the symlink reading — it is runtime-verifiable and explains the clean `diff -q` without requiring a second file. Recorded as a `SUPERSEDES` edge in graph events.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` (lines 56, 200, 326-339)
- `.skilled/skills/sk-doc/shared/scripts/quick_validate.py` (lines 255-268)
- `.skilled/commands/create/assets/create-skill-auto.yaml` (lines 210-227)
- `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` (lines 131-139, 196-212)
- `.skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh` (line 13)
- `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs`, `.skilled/skills/sk-doc/scripts/quick_validate.py`, `.skilled/skills/sk-doc/scripts/package_skill.py` (symlink entries)
- `rg` sweeps: `.opencode/scripts/git-hooks/`, `.skilled/hooks/`, `.github/workflows/`

## Assessment

- New information ratio: 0.60
- Questions addressed: Q5 (consolidation)
- Questions answered: Q5

## Reflection

- What worked and why: testing the one prose-only leg at source and running `readlink` on the "duplicate" pair. The symlink question was already in the air from iteration 2, so a single `ls -la`/`readlink` pass converted a carried assumption into a correction. Preferring a direct filesystem identity test over another documentary read is what made the consolidation decisive.
- What did not work and why: nothing failed; the repository-wide `rg` for `quick_validate|package_skill` returned a benchmark-report hit whose embedded transcript flooded the output, requiring signal to be separated from noise after the fact. Narrowing with `--glob` on the first pass would have helped.
- What I would do differently: on consolidation iterations, spend the first action re-testing the prior iteration's load-bearing assumptions (file identity, wiring) rather than re-reading their citations; identity checks are cheap and falsifiable.

## Recommended Next Focus

Q3: What is the smallest contract that stays green by construction? With the enforcement inventory now closed — every automatic check is presence/format and `verify` has no caller — Q3 can be answered against a fixed constraint set: what property can a stored per-doc version assert such that no automated surface can ever fail on it while it remains meaningful. Q4 (should it exist at all) and Q2 (external-author meaning) should follow, since the viable contract shapes from Q3 bound both.
