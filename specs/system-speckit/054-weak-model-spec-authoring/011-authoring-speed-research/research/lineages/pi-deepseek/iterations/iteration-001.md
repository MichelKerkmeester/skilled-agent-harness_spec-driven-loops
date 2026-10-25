# Iteration 1: Template and fill-note volume per level

## Focus

How much text does each level's template and fill guidance add to a finished packet? Measure template bytes and required sections against completed-document bytes, and price the guidance surfaces (authoring card, fill guidance, level selection guide) an author must read before writing.

## Actions Taken

- Measured every core and addon template with `wc -lc` under `.skilled/skills/system-spec-kit/templates/`, plus the level-1/2/3 example packets used as completed-document baselines.
- Rendered each core template at levels 1, 2 and 3 by applying its own `<!-- IF level:N -->` gates, then counted surviving FILL notes, FILL bytes, `YOUR_VALUE_HERE` tokens and composed bytes.
- Read the level model in `.skilled/skills/system-spec-kit/references/templates/level-specifications.md` for the published LOC targets and required sections per level.
- Read the authoring card and the section fill guidance doc, and counted the sections an author is asked to walk.
- Checked the level-gating syntax in the templates themselves, and looked for duplicate guidance that a naive measurement would double-count.

## Findings

1. A Level-1 packet's template volume roughly equals the finished packet: composed templates total 14,673 bytes (spec 4,449, plan 3,653, tasks 2,875, implementation-summary 3,696) against 14,621 bytes of completed level-1 example docs, so template prose is the author's read cost, not a rounding error. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:1] [SOURCE: .skilled/skills/system-spec-kit/templates/examples/level-1/spec.md:1]
2. FILL notes occupy about a third of the template text an author actually reads at every level: 33.2% of composed spec at L1, 35.5% of composed plan at L1, 41.3% of composed tasks at L1, and 12.7% of the Level-2 acceptance-criteria template, which makes fill-guidance trimming the single largest available cut in read volume. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:59] [SOURCE: .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl:71]
3. Level gating already prunes lower levels hard, so the remaining cost sits inside the retained sections rather than in missing per-level pruning: composed spec is 4,449 bytes at L1, 6,751 at L2 and 8,306 at L3 (204 lines total), and gate markers are the `<!-- IF level:N -->` / `<!-- /IF -->` pairs that carry it. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:25]
4. A Level-1 author faces about 26 KB of guidance reading before writing 14.6 KB of output: the authoring card is 174 lines / 7,846 bytes with 11 numbered sections, the section fill guidance doc is 70 lines / 3,831 bytes, and the level selection guide is 220 lines / 7,841 bytes, none of which is level-filtered for small work. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:14] [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/template-section-fill-guidance.md:1] [SOURCE: .skilled/skills/system-spec-kit/references/templates/level-selection-guide.md:1]
5. FILL guidance is duplicated in level-gated twins, so a raw `grep -c 'FILL:'` over a template over-counts exactly double and any trimming edit must change both twins: spec.md.tmpl lines 198 and 203 carry byte-identical text, as do lines 244 and 249. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:198] [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:203]
6. The authoring card asks a small change to walk ten numbered sections before its first write (BOUNDS, PICK THE LEVEL, SCAFFOLD, READ BEFORE YOU WRITE, ONE ACTION PER SECTION, THE PLAN SHAPE, TASK LINES, FILL EVERY TOKEN, VALIDATE, CLOSE), which is planning ceremony a single-file fix does not need but which is not separated by level. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:20] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:150]
7. The published LOC targets are internally inconsistent and are simultaneously presented as guidance and as value scale: Level 3 is stated at ~1090 LOC while Level 3+ is stated at ~1075 LOC, so the one number an author might self-check against decreases when the level goes up. [SOURCE: .skilled/skills/system-spec-kit/references/templates/level-specifications.md:55] [SOURCE: .skilled/skills/system-spec-kit/references/templates/level-specifications.md:61]
8. The scaffold-to-fill gap is visible in this very packet: the phase-11 spec.md was scaffolded with `[YOUR_VALUE_HERE:` placeholders still present in its description and body while the placeholder gate is what forces them to be found later, which is the fix loop this research is meant to shorten. [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/spec.md:3] [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/spec.md:24]

## Questions Answered

- How much text does each level's template and fill guidance add to a finished packet, measured as template bytes and required sections against completed-document bytes? Answered with measured byte counts and per-level composition at levels 1, 2 and 3.

## Questions Remaining

- Which validation gates and their fix loops consume the most per-edit time.
- What the level-selection and required-section path costs on small work.
- What Verify clauses, acceptance criteria and the authoring card cost to author.
- Which derived-metadata refreshes are mandatory per edit.
- The final ranked change list.

## Ruled Out

- Using the LOC targets as a time proxy: they are soft guidance, internally inconsistent at L3/L3+, and not enforced by any validator, so a time estimate built on them would be a guess wearing a number.
- Counting guidance volume from raw template bytes without applying level gates: the gates remove a third of the spec at L1, so raw counts would overstate Level-1 cost by roughly 46% on spec alone.

## Dead Ends

- Searching for a per-level authoring-time measurement inside the packet: no wall-clock authoring session exists in the repository, so time must be inferred from volume and fix-loop counts and has to be labelled as inference.

## Sources Consulted

- .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl
- .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl
- .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl
- .skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl
- .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl
- .skilled/skills/system-spec-kit/templates/examples/level-1
- .skilled/skills/system-spec-kit/templates/examples/level-2
- .skilled/skills/system-spec-kit/templates/examples/level-3
- .skilled/skills/system-spec-kit/references/templates/level-specifications.md
- .skilled/skills/system-spec-kit/references/templates/level-selection-guide.md
- .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md
- .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/template-section-fill-guidance.md

## Recommended Next Focus

Iteration 2: price validation. Read the validator rule inventory and the validation orchestrator, count the rules an edit can trip per level, and look for measured runtimes and the documented fix loop in the validation references and packet 054 phase reports.

## SCOPE VIOLATIONS

- The workflow's pre-init spec branch would have mutated `specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/spec.md` (append to Open Questions and Research Context). That path is outside this lineage's write authority, so the mutation was not executed and the folder state is recorded here as `spec-present` instead. Same rule applies to the post-synthesis findings fence and to `validate.sh` runs against the packet.
