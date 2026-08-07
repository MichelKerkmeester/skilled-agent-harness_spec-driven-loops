# Phase 004 dispositions — all four withheld

Every approved finding in this phase proposed deleting something the repository still uses as
evidence or history. None was executed. No worker was dispatched, because re-verification resolved
all four before dispatch.

## RF-004-1 and RF-004-2 — the "legacy" fixtures are cited by retained benchmark evidence

Findings: `devin-01:F2` and `devin-05:F2`, both targeting
`.opencode/skills/sk-code/benchmark/fixtures/sk-code/` (4 files).

**Claim**: legacy synthetic fixtures superseded by the playbook corpus, no live caller.

**Why it is wrong**: two benchmark reports dated 2026-07-21 record those exact fixture paths in
their file inventories — `compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json`
and `compiled-routing/2026-07-21--acceptance--luna-high/skill-benchmark-report.json`. Those archives
are governed by the additive, never-overwritten contract this program already confirmed in phase 002.
Deleting the fixtures orphans the provenance of evidence that is contractually permanent.

The README also catalogs the fixtures at three separate lines (81, 89, 107) with status `legacy`,
where the taxonomy at line 93 defines `legacy` as "a pre-playbook artifact" — a description of what
the folder is, not a disposal marker.

"No longer the default corpus" is true. It does not follow that the inputs which produced retained
benchmark results can be removed.

**Verify**: `rg -l 'fixtures/sk-code' .opencode/skills/sk-code/benchmark/reports/compiled-routing/`

## RF-004-3 — `devin-01:F3` the v3.x changelogs are the history, not stale docs

**Claim**: eight pre-v4 changelog entries describe a superseded flat architecture.

**Why it is wrong**: that is what a changelog for a superseded architecture is supposed to contain.
A v3.2 entry describing v3.2's structure is not drift; it is the record. The repository keeps eleven
sequential version files, the root `README.md` references the changelog surface, and `v3.2.0.0.md`
is referenced elsewhere in the tree.

Deleting them destroys the only record of what changed when, and cannot be undone from the working
tree.

**Constructive alternative**: if changelog volume is the real concern, consolidation into a single
historical summary is possible — but it is lossy, it is a documentation decision, and it needs an
explicit operator ruling rather than an autonomous deletion.

## RF-004-4 — `devin-01:F4` v4.0.0.0 records a real release step

**Claim**: the v4.0.0.0 scaffold-phase changelog is superseded by v4.1.0.0.

**Why it is wrong**: `v4.0.0.0.md` states "sk-code converted from a flat two-axis skill into a nested
parent hub… Scaffold phase - packets are skeletons; content relocation follows." That is an honest
record of a real, dated step. v4.1.0.0 completing the restructure does not mean v4.0.0.0 never
happened.

Triage itself already refuted the sibling claim on `v4.0.1.0.md` for the same reason: the relocation
it recorded persisted through v4.1.0.0.

## Why this phase applied nothing

The category is "legacy and superseded", and the instinct behind it is sound — superseded artifacts
do accumulate. But every candidate here turned out to be either an input to permanent evidence or a
historical record. Both are things whose value is precisely that they describe a state the system has
moved past.

A phase that applies nothing is a valid outcome. The alternative was four irreversible deletions
against evidence that contradicted them.
