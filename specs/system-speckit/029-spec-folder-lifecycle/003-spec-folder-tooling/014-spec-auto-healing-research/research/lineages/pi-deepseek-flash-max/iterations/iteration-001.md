# Iteration 1: Branch inventory and failure-class taxonomy

## Focus

Inventory every change branch `091-consolidate-small-packets` made to the spec folder tooling and the spec corpus (commits plus the uncommitted phase 013 repair), and build the initial failure-class taxonomy from the rule-by-rule detail reports and the one-off repair scripts. This is the foundation iteration for all five key questions; no question is fully answerable from inventory alone, so none is marked answered.

## Actions Taken

- Read `git log` / `git show --stat` for all 10 commits in `origin/main..HEAD` and the merge-base diff stat.
- Read the phase 013 spec (`specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md`, uncommitted working tree).
- Listed the read-only scratchpad and derived per-rule occurrence counts from `all-detail.txt` (baseline) and `detail3.txt` (latest).
- Read the header and decision logic of the one-off anchor repair script `fix-dup-anchors.mjs`.

## Findings

1. The branch is 10 commits and 2,641 changed files against the merge base (+45,902 / -32,651). Corpus-scale data commits dominate: `7fe1cbeda87` alone changes 1,856 files (removing template default trigger phrases from live packets) and `bdd678bccff` changes 898 files (replacing template trigger phrases in 375 packets); the tooling feature commits are `5e4164bfac9` (7 files) and `4af470d1531` (79 files, Gate 3 menus plus tooling and CI). [SOURCE: git show --stat for each commit in origin/main..HEAD] CONFIRMED
2. The baseline strict-validation failure taxonomy over 2,083 failing folders is led by generated-metadata path drift: METADATA_DISK_PATH_CONSISTENCY 2,898 folder-occurrences, then ANCHORS_VALID 510, SPEC_DOC_INTEGRITY 417, SPEC_DOC_SUFFICIENCY 261, GRAPH_METADATA_CHILD_IDENTITY 260, GREP_CONVENTION 195, LEVEL_MATCH 180, FILE_EXISTS 180, GENERATED_METADATA_INTEGRITY 119, TEMPLATE_SOURCE 99, FRONTMATTER_VALID 95, SCAFFOLD_NEVER_TOUCHED 42, FOLDER_NAMING 38, STATUS_CROSS_DOC_CONSISTENCY 24, AI_PROTOCOLS 22, GENERATED_METADATA_DRIFT 10, FRONTMATTER_MEMORY_BLOCK 8, TOC_POLICY 2, PLACEHOLDER_FILLED 1. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:1] CONFIRMED (counts re-derived with `rg -o '^x [A-Z_]+' | sort | uniq -c`)
3. The latest repair snapshot (`detail3.txt`) still shows 474 failing folders, re-ranked: ANCHORS_VALID 235, GREP_CONVENTION 152, LEVEL_MATCH 131, FILE_EXISTS 131, SPEC_DOC_SUFFICIENCY 108, TEMPLATE_SOURCE 76, SPEC_DOC_INTEGRITY 62, FRONTMATTER_VALID 33, SCAFFOLD_NEVER_TOUCHED 30, AI_PROTOCOLS 22, STATUS_CROSS_DOC_CONSISTENCY 20, GRAPH_METADATA_CHILD_IDENTITY 7, METADATA_DISK_PATH_CONSISTENCY 6. The path-drift class (2,898 occurrences) is nearly eliminated while anchor and convention classes persist. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/detail3.txt:1] CONFIRMED
4. Phase 013's own baseline: 4,371 packets total (2,173 live, 2,198 archived); 2,046 failed strict validation (111 live, 1,935 archived) plus 37 non-packet folders; 470 archive files carried template default trigger phrases; 102 packets lacked documents their level requires. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:47] CONFIRMED (working tree, uncommitted)
5. The one-off repairs are prose-preserving by construction. `fix-dup-anchors.mjs` only ever rewrites whole anchor-marker lines: a stray later pair that is glued to other markers and overlaps another pair is deleted, an isolated later pair gets a numbered id (`<id>-2`, `<id>-3`), and anything ambiguous is left alone and reported. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-dup-anchors.mjs:1] CONFIRMED
6. The failure classes cluster into seven families: (a) generated-metadata path drift (METADATA_DISK_PATH_CONSISTENCY, GENERATED_METADATA_INTEGRITY, GENERATED_METADATA_DRIFT, GRAPH_METADATA_CHILD_IDENTITY); (b) anchor integrity (ANCHORS_VALID, SPEC_DOC_SUFFICIENCY); (c) template provenance and placeholders (TEMPLATE_SOURCE, PLACEHOLDER_FILLED, SCAFFOLD_NEVER_TOUCHED); (d) required-document completeness (FILE_EXISTS, LEVEL_MATCH); (e) frontmatter completeness (FRONTMATTER_VALID, FRONTMATTER_MEMORY_BLOCK); (f) document conventions (GREP_CONVENTION, FOLDER_NAMING, TOC_POLICY); (g) cross-document status coherence (STATUS_CROSS_DOC_CONSISTENCY, SPEC_DOC_INTEGRITY, AI_PROTOCOLS). [SOURCE: re-derived counts from all-detail.txt and detail3.txt] INFERRED from the rule-name clustering; the confirmable check is reading each rule's implementation in the validator registry.
7. The archive is the dominant failure surface, not the live corpus: 1,935 of 2,198 archived packets failed baseline versus 111 of 2,173 live ones. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:47] CONFIRMED

## Ruled Out

- Treating the Claude 5.5 roster commits (`e9935e99bbc`, `75c78afa045`) as spec-tooling evidence: they touch only `.claude/settings.json`, `.hermes`/`.pi`/`.opencode` CLI skill docs and their spec packet, and contain no spec-folder tooling or corpus changes. They are noted and dropped from the analysis scope.
- Deriving failure causes from the aggregated detail reports alone: the reports name rules and paths but not the producer that wrote the bad value, so source attribution needs the tooling source (next iterations).

## Dead Ends

- None yet. The baseline count method (line occurrence counts, not issue counts) was initially misread; the per-folder `x RULE` lines aggregate issues, so occurrence counts measure how many folders hit a rule, not how many individual defects exist.

## Edge Cases

- Ambiguous input: none; the evidence map in `steer.md` is explicit about the commit range and the repair phase.
- Contradictory evidence: none on inventory facts; the "2,046 failing" phase number aggregates stricter rule coverage than the "2,083 folders" detail report, which is a scope difference (packets versus folders including non-packet scopes), not a contradiction.
- Missing dependencies: none; scratchpad read access works.
- Partial success: none; all inventory actions succeeded.

## Sources Consulted

- `git log --oneline origin/main..HEAD`, `git show --stat <each commit>`, `git diff origin/main...HEAD --stat`
- `specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md` (working tree)
- `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt`
- `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/detail3.txt`
- `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-dup-anchors.mjs`
- `specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/pi-deepseek-flash-max/steer.md`

## Assessment

- New information ratio: 1.00 (all findings new to this lineage; nothing previously recorded)
- Questions addressed: Q1, Q2, Q4, Q5 at inventory depth
- Questions answered: none (baseline only)

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-001 | Commit a corpus census that re-derives the per-rule failure counts from a validation run, so the baseline and each repair round are reproducible without a scratchpad | Q5 | `.skilled/skills/system-spec-kit/runtime/cli/spec/` (a report mode beside `validate.sh`) | S | Low, read-only reporting | One new script plus docs | The 2,083-folder taxonomy currently exists only as an ad-hoc `rg` over a 28k-line scratchpad file | CONFIRMED gap, INFERRED fix shape | Yes (report only) | Delete the script | No |
| R-002 | Keep archive as a first-class validation target in the repair story: the archive carried 1,935 of 2,046 baseline failures and 470 phrase files, and any heal-on-upgrade path that skips `z_archive/` leaves most of the corpus broken | Q3 | Repair/heal tooling under `.skilled/skills/system-spec-kit/runtime/cli/spec/` | S | Low, analysis only here | None in this iteration | 013 spec baseline | CONFIRMED | n/a | n/a | No |

## Reflection

- What worked and why: batched git and count derivations in two shell calls gave a complete branch shape and taxonomy cheaply; the scratchpad counts reproduced the lead's stated numbers exactly, which confirms the reports are the right evidence base.
- What did not work and why: the first count derivation used GNU awk syntax that BSD awk rejects; switching to `rg -o | sort | uniq -c` fixed it. The lesson is to prefer pipeline counting over awk `match` on this host.
- What I would do differently: read the validator registry next to map each rule name to its check implementation before assigning causes.

## Recommended Next Focus

Iteration 2: read the validator registry and the validation reference docs to classify each rule family by its producer (templates, `create.sh`, `archive.sh`, generators), so Q2 cause attribution starts from the rule implementation rather than from rule names.
