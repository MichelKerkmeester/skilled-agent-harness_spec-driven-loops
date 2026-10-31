# Iteration 007 — Q4: Final disposition of the DB rebuild (decision record)

## Focus

Q4: should the release-aware redesign be one command or several, and what happens to today's
database-rebuild behaviour of `/doctor:update` (kept, moved, renamed or retired)? Prior iterations
(3–6) converged on "retain as route or as apply's final phase" but never recorded a decision. This
iteration closes Q4 with a concrete decision record grounded in the command's contract, its
cross-route references, its changelog history, and its mutation boundaries.

## Actions Taken

1. Read the current router `.skilled/commands/doctor/update.md` and the full workflow
   `.skilled/commands/doctor/assets/doctor-update.yaml` (phases 0–10, mutation boundaries,
   invariant, dependency order, migration rationale).
2. Read the presentation contract head and the `_routes.yaml` standalone block that keeps
   `/doctor:update` visible to the advisor.
3. Swept cross-references to `/doctor:update` across doctor surfaces (deep-loop, speckit, skill
   advisor), changelogs (`v3.4.1.0`, `v3.5.0.0`), and `README.md`.
4. Compared the evidence against prior Q4 findings (iterations 3–6) and the v3.5.0.0 changelog's
   own description of the command, then wrote the decision record below.

## Findings

### F-iter007-001 — Today's command IS the DB rebuild, with hard boundaries that exclude skill content

`update.md:2` describes `/doctor:update` as "Rebuild spec-kit runtime databases in dependency-safe
order"; `doctor-update.yaml:5` states the purpose as "Execute dependency-safe database rebuild with
explicit approval at every phase boundary." The orchestrator invariant (`doctor-update.yaml:29-36`)
is a single-instance flock-protected DB rebuild chain with per-DB VACUUM snapshots and
SIGINT/restore semantics. The dependency order is exactly the derived-data set:
`["trigger-index", "skill-graph", "advisor", "deep-loop-graph"]` (`doctor-update.yaml:164-165`).

Critically, the mutation boundary is the inverse of a release updater's: `allowed_targets` are
runtime DBs, dist output, locks and state logs only, while `forbidden_targets` explicitly include
`.skilled/skills/**/SKILL.md`, `.skilled/skills/**/graph-metadata.json`,
`.skilled/commands/doctor/*.md` and `.skilled/commands/doctor/assets/doctor_*.yaml`
(`doctor-update.yaml:102-133`, forbidden at 119-133). A release-aware apply must write exactly the
skill bodies this workflow is forbidden to touch, and roll back via git, not VACUUM snapshots.
Two mutation classes, two rollback disciplines — they cannot share one transaction.

### F-iter007-002 — Namespace collision: the rebuild command already claims release-migration trigger phrases

The `standalone` block in `_routes.yaml:228-237` (kept "for advisor visibility"; the command does
NOT route through `/doctor`) declares trigger phrases: `"spec-kit version migration"` (line 234),
`"doctor update orchestrator"` (235), `"rebuild all spec-kit databases"` (236), `"doctor full sync"`
(237). "Spec-kit version migration" is now literally what the release-aware updater will do, while
"rebuild all spec-kit databases" is the rebuild's true identity. The phrase set must be split in
the rename commit.

### F-iter007-003 — Cross-route rebuild ownership is established and must survive

Other doctor surfaces defer to `/doctor:update` as the rebuild owner:
`doctor-deep-loop.yaml:30` — "it never calls deep_loop_graph_upsert; rebuilds are owned by
/doctor:update"; `doctor-deep-loop.yaml:205-207` recommends "coverage-graph rebuild via
/doctor:update" for empty/stale graphs; `doctor-speckit-presentation.txt:206` routes "Need
dependency-safe full rebuild | Use `/doctor:update`". Cross-route rebuild also already exists the
other way: `/doctor:skill-advisor` rebuilds the advisor itself (`doctor-skill-advisor.yaml:303`
"STEP 9 rebuild dist", `:324` STEP 1 `advisor_rebuild`), while `/doctor:update` runs
`advisor_rebuild({force:true}) + advisor_validate` inside its dependency order
(`doctor-update.yaml:371`). Retiring the rebuild would orphan those recommendations and remove the
safe, idempotent repair path.

### F-iter007-004 — Changelog precedent: the command is kept by function, and "alignment" terminology is already taken

`v3.4.1.0.md:368` records that ten `/doctor:*` markdown commands collapsed to three, and
`v3.4.1.0.md:403` records "**Keep.** `/doctor:update` is unchanged." `v3.5.0.0.md:184` describes
the command as "a dependency-ordered cross-subsystem alignment with snapshot, validate and
rollback"; `README.md:1211` calls it a "multi-subsystem orchestrator". So the word "alignment"
in this repo currently means DB alignment via rebuild — the release family's proposed "align"
(customized-skill proposal) needs disambiguated wording.

### F-iter007-005 — Adjacent Q1 evidence: package.json is not a version source

`doctor-update.yaml:247-248` (Phase 8, Council FIX-03): "package.json version field is a build-time
placeholder ('0.0.0' in release tarballs), so version detection MUST use file-system signals
instead." This validates the Q1 direction — release detection must use `.skilled/changelog/`
versions and skill `version` frontmatter (or git), never `package.json` — and shows the current
auto-migration heuristics (4 file-system signals, threshold 2) as the existing precedent for
degraded version detection.

## DECISION RECORD — DR-Q4-001: Disposition of the DB rebuild

**Status:** accepted at research level; implementation lands in the follow-up packet (rename
mechanics + reference sweep are out of this iteration's write scope).
**Scope:** what happens to today's database-rebuild behaviour when `/doctor:update` becomes
release-aware.

**Decision**

1. **Retain the rebuild; move it out; never retire it.** The workflow trio
   (`update.md` + `doctor-update-presentation.txt` + `doctor-update.yaml`) is relocated to its own
   standalone command identity — proposed `/doctor:rebuild` — as a mechanical rename that preserves
   all flags (`--force`, `--no-snapshot`, `--cleanup-legacy`, `--migrate`, `--keep-snapshots`,
   `--resume-bootstrap`), phases 0–10, flock, snapshots, SIGINT contract, migration manifest
   handling, `restart_required` bootstrap, and state log. This is the same posture the v3.4.1.0
   collapse took ("Keep... unchanged", `v3.4.1.0.md:403`), now made explicit by function name.
2. **`/doctor:update` is repurposed as the release-aware front door.** "Update" becomes literally
   true; the trigger phrase `"spec-kit version migration"` (`_routes.yaml:234`) transfers to it,
   and `"rebuild all spec-kit databases"` (line 236) stays with the rebuild command. `check`,
   `apply` and `align` are the release family's modes/routes per the Q5 shape.
3. **Composition, not merge.** Release apply runs *after* skill content lands and then invokes the
   rebuild as its final reindex phase (or instructs the operator to run it when the operator
   declines the nested approval). Apply's state log records `reindex: rebuilt|skipped|failed`;
   skipped/failed ends apply in a stale-index warning state, never a silent success. The rebuild
   keeps its own approval gate and snapshot contract; release apply keeps git-based rollback.
4. **Migration/bootstrap travel with the rebuild, not with release apply.** Phase 0 bootstrap
   (dist builds, `STATUS=RESTART_REQUIRED`, `--resume-bootstrap`) and Phase 8 migration (manifest
   Phase 0, gap refusal, file-system signal heuristics) mutate dist artifacts, DBs and metadata —
   not skill content. Release apply consults the migration manifest only for version-skip gating.
5. **Rejected options.** (a) *Retiring the rebuild*: orphans `doctor-deep-loop.yaml:30` and
   `doctor-speckit-presentation.txt:206`, and removes the idempotent repair path. (b) *Silent
   folding into release apply*: merges two mutation classes and two rollback disciplines into one
   transaction; a failed release apply would need git revert AND snapshot restore. (c) *Keeping
   the name on the rebuild and naming the release family `/doctor:release`*: possible but loses the
   user-stated redesign intent, leaves "update" meaning "rebuild", and strands the
   "version migration" trigger phrase on a command that does not do version migration.

**Consequence for the one-command-or-several question:** several. Release family
(check / apply / align per Q5) plus retained `/doctor:rebuild`. Terminology hazard recorded for
Q5: avoid reusing "align/alignment" for skill-override proposals without qualifying it, because
`v3.5.0.0.md:184` already uses "cross-subsystem alignment" for the rebuild.

## Questions Answered

- **Q4** — decision recorded (DR-Q4-001): rebuild retained and relocated to `/doctor:rebuild`;
  `/doctor:update` repurposed for releases; apply composes rebuild as its final reindex phase;
  migration/bootstrap travel with the rebuild. Follow-up sub-question **Q4a** (implementation-level):
  exact rename mechanics and the full reference sweep (deep-loop YAML, speckit presentation,
  manual-testing playbook g5–g9, feature catalog, `db-path-policy.md`, changelogs, README) to be
  executed in the implementation packet, not here.

## Questions Remaining

- **Q5**: each resulting command's shape under the sk-create-command contract and reuse of the
  install/sync scripts; include the phrase transfer from `_routes.yaml:234/236`.
- **Q5a**: exact flag surface (`--dry-run` default? `--accept <proposal>?`) and whether align ever
  applies or always hands off to apply.
- **Q3b**: divergence ledger git-tracked vs gitignored — decision needed.
- **Q1c**: system-skill-advisor frontmatter/changelog mismatch — error or warning.
- **Q3a**: exact hash input of `provenance_fingerprint` (`lib/derived/provenance.ts`) — cheap close-out.
- **Q1b**: composite child skills as independent update units — decision needed.
- **Q1 / Q1a**: release detection and the no-git/no-`gh` degradation path (carried); note the
  F-iter007-005 constraint (package.json is not a version source).
- **Q4a** (new): rename mechanics and reference sweep for the rebuilt command (implementation-level).

## Next Focus (recommendation)

Q5: specify the release family's command shapes and the `/doctor:rebuild` rename contract under
sk-create-command, closing the phrase-transfer item from F-iter007-002; then batch the remaining
decision conversions (Q3b, Q5a, Q1b, Q1c) and the Q3a verification.

## SCOPE VIOLATIONS

None executed. The rename/reference sweep in DR-Q4-001 is a proposal for the implementation packet;
no researched file was modified. No out-of-scope mutation was attempted.
