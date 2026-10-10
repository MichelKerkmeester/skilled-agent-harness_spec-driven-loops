# Iteration 2: Shared reference consistency and stale path families

## Focus

Part 1, second slice: read the shared reference set against itself and against the disk. The question was whether the always-loaded tier (`universal/*`, `stack-detection.md`, `phase-detection.md`) still describes the tree as it is, and whether the "loaded twice" question from iteration 1 resolves. This follows iteration 1's Recommended Next Focus.

## Actions Taken

1. Read `shared/references/universal/code-quality-standards.md`, `code-style-guide.md`, `phase-detection.md` and `stack-detection.md` in full.
2. Extracted every referenced path from the four files and tested each on disk (`test -f` / `test -d` for ten candidate paths).
3. Swept all 13 shared markdown files for the legacy path families `references/webflow/`, `references/opencode/`, `references/motion_dev/`, `assets/webflow/`, `assets/universal/`.
4. Spot-checked the three cross-file claims that would matter if they failed: the precedence order, the `AGENTS.md` §3 restraint-table pointer, and the `ceiling-report.sh` endpoint.
5. Checked the current counterparts on disk: `sk-code-review/assets/code-quality-checklist.md`, `sk-code-webflow/references/animation/quick-start.md`, `sk-code-opencode/assets/scripts/verify_alignment_drift.py`.

## Findings

1. **Eight of the thirteen shared markdown files still route readers through the pre-merge directory families, and none of those paths exists any more.** The stale families are `references/webflow/…`, `references/opencode/…`, `references/motion_dev/…`, `assets/webflow/…` and `assets/universal/…`. Confirmed dead: the hub has no `references/` directory at all, `assets/webflow/checklists/code-quality-checklist.md` does not exist (the one live copy is `sk-code-review/assets/code-quality-checklist.md`), `assets/universal/checklists/` does not exist, and neither does `references/motion_dev/`. The mentions: `universal/code-quality-standards.md:39,118,174,175,177`; `universal/code-style-guide.md:24,39,221,222,230,231`; `universal-verification-checklist.md:71,119,120,121`; `universal/error-recovery.md:133`; `universal/multi-agent-research.md:50,216`; `stack-detection.md:103,104`; `phase-detection.md:62,74`; and `assets/patterns/README.md:5` carries the same legacy vocabulary in a trigger phrase. [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-style-guide.md:24] [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:39] [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:103] [SOURCE: .skilled/skills/sk-code/shared/references/phase-detection.md:62]. Reproducing case: `test -f .skilled/skills/sk-code/assets/webflow/checklists/code-quality-checklist.md` returns no while `test -f .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md` returns yes, and `rg -n "references/webflow/|references/opencode/|references/motion_dev/|assets/webflow/|assets/universal/" .skilled/skills/sk-code/shared --glob "*.md"` prints 23 lines across 8 files, 22 of them path references in 7 reference files. NEW, P1 (the shared tier is loaded on every route; a reader who follows any of these links lands on a missing path, and the router's own path-existence check does not inspect inline links).
2. **`phase-detection.md` is semantically stale on top of its dead paths: it describes two surfaces, one phase layout, and one verification command.** Its opening says "Both supported surfaces follow the same lifecycle" [SOURCE: .skilled/skills/sk-code/shared/references/phase-detection.md:16] while the hub has carried three surfaces since the Obsidian packet landed [SOURCE: .skilled/skills/sk-code/SKILL.md:38], and its per-phase tables list only WEBFLOW and OPENCODE [SOURCE: .skilled/skills/sk-code/shared/references/phase-detection.md:57] [SOURCE: .skilled/skills/sk-code/shared/references/phase-detection.md:69]. Its OPENCODE verification row names `verify_alignment_drift.py --root <changed-scope>` alone [SOURCE: .skilled/skills/sk-code/shared/references/phase-detection.md:77], while the live completion gate is the three-guard umbrella `scripts/run-all-drift-guards.sh` [SOURCE: .skilled/skills/sk-code/sk-code-opencode/SKILL.md:173]. Reproducing case: `rg -n "OBSIDIAN" .skilled/skills/sk-code/shared/references/phase-detection.md` exits 1, while `rg -c "OBSIDIAN" .skilled/skills/sk-code/shared/references/stack-detection.md` counts several. NEW, P1 (the lifecycle doc is a DEFAULT_RESOURCE entry on every route, and it no longer matches the surface set it governs).
3. **Cross-links inside the shared tier use three different forms for the same directory.** `phase-detection.md` links its sibling as `references/phase-detection.md` in Related Resources [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:154], while `phase-detection.md` itself links the same sibling correctly as `./stack-detection.md` [SOURCE: .skilled/skills/sk-code/shared/references/phase-detection.md:39]; `code-quality-standards.md` links `references/universal/code-style-guide.md` without the leading `../` context that its own location would need [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:172]. None of these is caught by a checker (the router guard validates `ROUTER.md` entries, not links inside referenced docs). Reproducing case: `rg -n "references/phase-detection.md" .skilled/skills/sk-code/shared/references/stack-detection.md` prints line 154; opening that from `stack-detection.md`'s directory resolves to `shared/references/references/phase-detection.md`, which does not exist. NEW, P2 (same failure family as Finding 1, but a resolver bug rather than a deleted tree; a link checker would catch the whole class at once).
4. **The three consistency claims that matter most all hold.** The precedence order is identical in `stack-detection.md:39`, `code-quality-standards.md:56` and the hub `SKILL.md:135` (`OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN`) [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:39] [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:56] [SOURCE: .skilled/skills/sk-code/SKILL.md:135]; the `AGENTS.md` §3 restraint-table pointer resolves (`AGENTS.md:198` carries the table) [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:56] [SOURCE: AGENTS.md:198]; and the `ceiling:` harvest endpoint named by the style guide exists at `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-style-guide.md:186] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh]. ALREADY-ADOPTED, P2, no action.

## Questions Answered

- None fully. Key question 3 (where is the shared layer inconsistent, stale or weak) now has its staleness leg answered for the universal and lifecycle references; the loading leg remains open.

## Questions Remaining

- Does the `RESOURCE_MAP` emit the whole universal tier, as `ROUTER.md` §11 claims, or only the two universal files under `CODE_QUALITY`?
- Do the surface packets restate any of the universal rules the shared tier already owns (duplication on the other side of the boundary)?

## Ruled Out

- **"Treat the stale paths as a routing bug."** The router's own entries are correct; only the prose inside referenced docs is stale. The defect class is a link/pointer sweep, not a router change, and it does not belong to phase 009's routing list.
- **"Report version skew among the shared files."** The hub's version-authority statement deliberately stops at the hub root [SOURCE: .skilled/skills/sk-code/SKILL.md:17]; shared files carry independent versions by design.

## Dead Ends

- `universal-debugging-checklist.md` showed no direct stale-family hit in the sweep; its cross-links are clean. No further angle there this iteration.
- No consumer anywhere pins the legacy path strings, so no runtime branch depends on them being wrong or right.

## Edge Cases

- Ambiguous input: whether a path inside a `trigger_phrases` frontmatter line counts as a stale link. Chosen interpretation: no; `shared/assets/patterns/README.md:5`'s `sk-code assets/universal/patterns` is a phrase, not a path, and was excluded.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`
- `.skilled/skills/sk-code/shared/references/universal/code-style-guide.md`
- `.skilled/skills/sk-code/shared/references/universal/error-recovery.md` (sweep)
- `.skilled/skills/sk-code/shared/references/universal/multi-agent-research.md` (sweep)
- `.skilled/skills/sk-code/shared/references/universal-verification-checklist.md` (sweep)
- `.skilled/skills/sk-code/shared/references/phase-detection.md`
- `.skilled/skills/sk-code/shared/references/stack-detection.md`
- `.skilled/skills/sk-code/SKILL.md`
- `.skilled/skills/sk-code/sk-code-opencode/SKILL.md`
- `.skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md`
- `.skilled/skills/sk-code/sk-code-webflow/references/animation/quick-start.md`
- `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py`
- `AGENTS.md`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.87 (three fully new findings, one ALREADY-ADOPTED verification finding; five of five actions completed).
- Questions addressed: key question 3 (the staleness leg).
- Questions answered: none.

## Reflection

- What worked and why: testing every path on disk rather than trusting the sweep's grep counts. The grep found the families; the `test -f` calls proved the targets missing and found the live counterparts, which turned a suspicion into a reproducible defect.
- What did not work and why: an initial `cd`-relative `../../AGENTS.md` check reported the restraint table missing; the path was wrong, not the file. Corrected by resolving from the repository root before recording anything.
- What I would do differently: build the path-existence matrix first, then read the four files, so the reading is aimed at the failures rather than preceded by it.

## Recommended Next Focus

The shared workflow trio (`workflow-implement.md`, `workflow-debug.md`, `workflow-verify.md`) and the universal checklists: test whether these overlap the repo rules (`.skilled/repo-rules/*.md`, `AGENTS.md`) verbatim, and whether the surface packets restate rules the shared tier owns.
