# Iteration 010 — Q1b: Composite Child Skills as Independent Update Units (Decision Closure)

## Focus

**Q1b** (carried): are composite child skills (`sk-code-*`, `sk-doc-*`, and every other hub's packets) independent update units with their own versions, or updated only through the parent? Iteration 003 established the supporting facts; the run's registry never marked the question resolved, so later iterations kept carrying it as a "decision needed". This final iteration closes it as a decision record and checks the two residual gaps: (a) does nesting ever go deeper than hub → child; (b) which hubs actually carry children today.

## Actions Taken

1. Depth census over all 59 `SKILL.md` files under `.skilled/skills/`: `find ... -name SKILL.md` piped through a path-depth histogram.
2. Composite-hub enumeration: grouped the 45 child `SKILL.md` files by hub directory.
3. Projection inventory: listed `leaf-manifest.json`, `mode-registry.json`, `hub-router.json` across all hubs.
4. Fresh git evidence: for the newest commits touching a child `SKILL.md` or child `changelog/` path, counted whether the same commit also touched the parent `SKILL.md` (`git show --name-only` per commit).
5. Registry check: read `findings-registry.json` (`resolvedQuestions` is empty; carried questions re-listed from iteration markdown) to confirm why the question kept resurfacing.
6. Recorded this iteration through the append gateway; exit status checked.

All actions were read-only; the only writes were this narrative, the iteration delta, the temp gateway event file, and the gateway's own run-directory writes.

## Findings

### F-iter010-001 — The unit taxonomy is closed at exactly two levels: 14 hubs and 45 direct children

Observed. Depth histogram of `.skilled/skills/**/SKILL.md`: **14 at depth 2** (hub `SKILL.md`) and **45 at depth 3** (child packet `SKILL.md`), **zero at depth ≥ 4**. No grandchild packets exist anywhere in the tree.

The 45 children distribute across six composite hubs: `sk-doc` 14, `mcp-tooling` 9, `cli-external-orchestration` 9, `sk-code` 5, `sk-design` 4, `system-deep-loop` 4.

Consequence for the updater: the update unit is always *exactly* a hub or a direct child — never a deeper path. The addressing scheme `git diff <base>..<release> -- .skilled/skills/<hub>/` (hub unit) and `-- .skilled/skills/<hub>/<child>/` (child unit) is complete; no recursive walk logic is needed. Name prefixes (`sk-*`, `mcp-*`, `cli-*`, `deep-*`) are workload-family conventions, not addressing rules.

### F-iter010-002 — Child-scoped commits land without the parent `SKILL.md` and without a hub version bump

Observed (fresh git evidence this iteration):

- `24841a6882` (`docs(sk-code): rewrite the sk-code changelogs...`) — 29 files, all under `sk-code` children, parent `SKILL.md` **not** touched.
- `b5127d2d34` (`feat(sk-doc): teach create-changelog the Skilled release line`) — 17 files under `sk-create-changelog`, parent **not** touched.
- `4da16a6516` (`feat(sk-doc): write shorter changelog entries...`) — 15 files under `sk-create-changelog`, parent **not** touched.
- `094cdb9f8a` (`docs(changelog): complete the search metadata on every release and skill entry`) — 587 files across skills, parent `SKILL.md` **not** touched.
- Counter-case confirmed: `8e4b86b247` (`chore(skills): renumber ... under their new caps`) touched the parent — broad structural refactors move hub and children together.

Iteration 003 reported the same pattern on other paths; this sample confirms child content plus child changelog changes are routinely committed independently of the hub version line.

Two design consequences:

- A hub version change is not evidence that any child changed, and a child change is not evidence the hub changed. The updater cannot use hub versions as a proxy for child deltas in either direction.
- Comparison, delta and apply must be per unit. A customized child must not block an update of its pristine siblings, and an uncustomized hub must not force child rewrites.

### F-iter010-003 — Decision: children are independent *update* units and non-independent *identities*

This is the Q1b decision record the carried-forward entries kept asking for, built on iteration 003's F1–F6 and the two checks above.

**Decision: YES at the version/diff/apply layer; NO at the routing/identity layer.**

Rules the updater inherits:

- **R1 — Iterate units.** Plan and execute per hub/child pair. Customization class is a property of the unit, so a customized `sk-git` or `sk-code-review` blocks only itself.
- **R2 — Per-unit version truth.** A unit's release identity is its `SKILL.md` `version:` frontmatter plus its numerically newest `changelog/` entry. Hub projections pin only the hub version (`mode-registry.json`, `hub-router.json`, `leaf-manifest.json`) and are never a child-version source.
- **R3 — Per-unit delta scope.** Path-scoped `git diff` per unit; the child's version change is the release stamp for that unit.
- **R4 — Structural coupling handled in the same transaction.** A child update that changes only content inside an existing leaf is self-contained; one that adds/removes/renames leaves or changes routing vocabulary must regenerate `mode-registry.json`, `hub-router.json` and `leaf-manifest.json` in the same apply transaction (iteration 004 F6), gated post-apply by `generate-leaf-manifest.cjs --check <hub>`.
- **R5 — No identity operations.** There is nothing per-child to register or deregister: runtime mirrors are symlinks to `.skilled/skills`, packets carry no `graph-metadata.json`/`description.json`, and advisor identity stays the hub.

### F-iter010-004 — The hub-projection sub-item is closed: regeneration belongs in the same apply transaction

Recap plus confirmation: iteration 004 F6 already specified the ordering. This iteration adds that six composite hubs carry all three projections (`sk-code`, `sk-doc`, `sk-design`, `mcp-tooling`, `cli-external-orchestration`, `system-deep-loop`), so the "same transaction" rule applies to any unit whose apply changes leaf inventory or routing text. The byte-gate `generate-leaf-manifest.cjs --check <hub>` is the trigger detector; its failure means the update was structural.

### Observation — why Q1b kept resurfacing

- **obs-iter010-001:** `findings-registry.json` has `resolvedQuestions: []` and re-derives open/carried questions from the iteration narratives' "Questions Remaining" sections each run. Nothing in the pipeline consumes a narrative's "Questions Answered" section back into the registry, so Q1b — answered in iteration 003 — was carried forward nine more times. This narrative therefore omits Q1b from Questions Remaining; the planner should treat it as resolved by iterations 003 + 010. Reported, not repaired — registry and reducer files are machine-owned.

## Questions Answered

- **Q1b — answered and closed as a decision** (F-iter010-001, F-iter010-003): composite children are independent update units with their own version lines, changelogs and path scope; they are not independent identities; structural changes pull hub projections into the same transaction.
- **Q1b sub-item — answered** (iteration 003 open-note + iteration 004 F6, confirmed F-iter010-004): hub-projection regeneration belongs in the same apply transaction as the child update; `generate-leaf-manifest.cjs --check <hub>` is the detector.

## Questions Remaining

- **Q1 / Q1a:** release detection (git tag vs `.skilled/changelog/` version vs frontmatter versions) and the no-git/no-`gh` degradation path — carried; still the blocking dependency for `/doctor:check`'s data path.
- **Q5 (residual):** EXECUTION TARGETS rows and per-action YAML phase structure for the new commands; `_routes.yaml` registration shape for a 3-command family (iteration 004 sketched both; iteration 009 fixed the registration surface).
- **Q4 (residual):** whether the rebuilt family replaces `/doctor:update` outright or ships a deprecated alias for one release; DB-rebuild disposition decision record.
- **Q1c:** system-skill-advisor frontmatter/changelog mismatch severity — error or warning.
- **Q3a:** exact `provenance_fingerprint` hash input — cheap close-out.
- **Q3b:** divergence ledger git-tracked vs gitignored.

No new research directions were opened. As the final iteration, these residuals are synthesis inputs for `research.md` and the planner, not blockers to a next research pass.

## Next Focus

None — this is iteration 10 of 10. Synthesis should fold the Q1b decision into the command specs: unit-granular apply loop (R1–R3), per-unit customization classification (Q2), projection regeneration gated by `generate-leaf-manifest.cjs --check` (R4), and no identity layer (R5).

## SCOPE VIOLATIONS

None executed. All research actions were read-only; writes stayed in the run's allowed paths.

## Graph Events (also emitted in the iteration record)

- `q1b` (QUESTION) answered by `f-iter010-001` and `f-iter010-003`; `f-iter010-002` supports the unit-independence premise; `f-iter010-004` supports the decision.
- `obs-iter010-001` recorded as a process observation; no edges emitted for it.
- Sources: depth census of `.skilled/skills` (`src-iter010-001`), child-commit git analysis (`src-iter010-002`), projection inventory (`src-iter010-003`).
- Ruled out: "child updates mediated only through the parent" — child-scoped commits and per-child version/changelog lines contradict it.
