# Lane C: READMEs and changelogs (054 alignment audit)

Read-only audit. Standards read first: `.skilled/skills/sk-doc/sk-create-readme/SKILL.md`, `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`, `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md`, `.skilled/skills/system-spec-kit/templates/changelog/{phase,root}.md`.
Reality sources: `runtime/cli/lib/validator-registry.json` (42 rules: 32 error, 8 warn, 2 info, 3 strict_only), `templates/` tree (core 4, addons 7, packet-types 4), `spec-kit-docs.json` levels, `create.sh`, `validate.sh`, `orchestrator.ts:1495`, `template-phrase-census.mjs:45-68`, SKILL.md `version: 2.12.0.0`, each phase `implementation-summary.md`.

## Findings

### C-01 (P1, literal) Root README says seven warn-only rules, registry has eight
- `README.md:373`: "Seven of them only warn and never fail a run". Registry warn rules: FRONTMATTER_VALUES, SOURCE_TAGS, MEASURED_BEHAVIOR, GRAPH_METADATA_PRESENT, GRAPH_METADATA_CHILD_DRIFT, GRAPH_METADATA_SHAPE, DESCRIPTION_SHAPE, LINKS_VALID = 8. The pre-054 registry (`62e4661e01^`) had 7; 62e4661e01 bumped 41 to 42 on this line but left "Seven".
- Fix: old `Seven of them only warn and never fail a run` new `Eight of them only warn and never fail a run`.

### C-02 (P1, literal) runtime/cli/spec README still says 18 template document kinds
- `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:120` "in the 18 document kinds" and `:121` "for the same 18 kinds". `template-phrase-census.mjs:45-68` COUNT_KINDS = 12 document kinds + 3 packet-spec kinds = 15. Phase 014's audit (`014-.../scratch/audit-reality.md:20`) fixed the same count on line 105 and missed these two.
- Fix: old `leave in the 18 document kinds` new `leave in the 15 document kinds`; old `for the same 18 kinds` new `for the same 15 kinds`.

### C-03 (P1, judgment) Packet root changelog is stale: stops at phase 012
- `specs/system-speckit/054-weak-model-spec-authoring/changelog/changelog-054-root.md:13` dated `2026-10-25`; Included Phases table `:23-36` lists 001-012 only; `:15` says "a phased packet of Level 3 phases" while 011, 012 and 019 are Level 1 and 013-018 are Level 2 (their own changelog spec lines). Summary `:19` and Added/Changed say nothing of add-on removal, Measured Behavior, Draft auto-repair, neutral examples or the benchmark redesign (013-019).
- Fix: regenerate with `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js specs/system-speckit/054-weak-model-spec-authoring --write` (or add a new dated section) covering 013-019, then hand-check the summary against each phase implementation-summary.

### C-04 (P2, literal) Phase 017 changelog says the SHA is not pinned yet
- `changelog/changelog-054-017-measured-behavior-and-draft-metadata.md:51` "- The commit SHA is pinned after the commit." The summary now pins it: `017-.../implementation-summary.md:40` and `:149` "committed as `62e4661e01` (code) and `ef939bf0ac` (docs)".
- Fix: old `- The commit SHA is pinned after the commit.` new `- The work is committed as \`62e4661e01\` (code) and \`ef939bf0ac\` (docs).`

### C-05 (P2, literal) Phase 012 changelog follow-up waits on a run that already happened
- `changelog/changelog-054-012-authoring-speed-fixes-and-alignment.md:61` "Ranks 4 to 8 and 10 to 12 of the phase 011 ranking wait for the 2026-10-26 timing run." The summary records that run: `012-.../implementation-summary.md:101` (speed loop row, time difference INCONCLUSIVE) and `:110`.
- Fix: old `- Ranks 4 to 8 and 10 to 12 of the phase 011 ranking wait for the 2026-10-26 timing run.` new `- The 2026-10-26 speed loop timed this tree against 054: all runs strict PASS, time difference INCONCLUSIVE, so the wording edits stand on clarity, not speed.`

### C-06 (P2, literal) Phase 006 changelog row contradicts the summary's correction
- `changelog/changelog-054-006-speckit-command-and-agent-alignment.md:58` row: "`.skilled/agents/markdown.md, orchestrate.md, code.md, context.md` | Modified | Card and filled example, retired checklist doc dropped". `006-.../implementation-summary.md:77`: "Correction 2026-10-25: only `markdown.md` gained the card and the filled example. In `orchestrate.md`, `code.md` and `context.md` this phase only dropped the retired checklist doc".
- Fix: old `| Modified | Card and filled example, retired checklist doc dropped |` new `| Modified | Card and filled example in markdown.md only; retired checklist doc dropped in all four |`

### C-07 (P2, judgment) Phase 013-019 changelogs drift from the phase.md heading set
- `templates/changelog/phase.md:18-44` renders Summary, Added, Changed, Fixed, Verification, Files Changed, Follow-Ups always (the generator writes `- None recorded.` for an empty list, `nested-changelog.ts:551`). Phases 001-012 carry all seven. 013-019 do not:
  - 013: no Fixed, no Follow-Ups, extra `### Removed` (`:37`)
  - 014, 015, 016, 018: no Added, no Fixed, no Follow-Ups
  - 017: no Fixed, no Follow-Ups, extra `### Deviations` (`:45`)
  - 019: no Added, no Follow-Ups, extra `### Deviations` (`:40`), and Fixed (`:22`) sits before Changed (`:27`)
- Fix: add the missing headings in template order with `- None recorded.` and fold Removed into Changed and Deviations into Follow-Ups (or regenerate through `nested-changelog.js <phase> --write` and re-apply the narrative).

### C-08 (P2, literal) v2.12.0.0 description is 275 characters, ceiling 250
- `.skilled/skills/system-spec-kit/changelog/v2.12.0.0.md:3`; sk-create-changelog SKILL.md section 5 Frontmatter Contract "250 characters at most".
- Fix (221 chars): new `description: "Template examples no longer echo a real task, the scaffold drops sections models padded, spec.md gains a Measured Behavior block with a warn-only rule and a Draft packet's strict validate repairs its own derived metadata."`

### C-09 (P2, literal) v2.12.0.0 topic phrase carries a version number
- `v2.12.0.0.md:9` `  - "template v2.4"`. SKILL.md section 5: a topic phrase "carries no version number". Two other topic phrases remain.
- Fix: delete the line `  - "template v2.4"`.

### C-10 (P2, literal) Semicolons and one Oxford comma in the 054 release entries
- `hvr_scan.py` hard blockers: v2.11.0.0 x3 (`:32`, `:65`, `:79`), v2.12.0.0 x1 (`:46`). Oxford comma at `v2.11.0.0.md:49`. SKILL.md section 8 rule 5.
- Fixes:
  - v2.11:32 old `followed by what it rewrites; the dry run` new `followed by what it rewrites. The dry run`
  - v2.11:65 old `That is one round; after three rounds` new `That is one round. After three rounds`
  - v2.11:79 old `because no template defines its values; the file is left as written.` new `because no template defines its values. The file is left as written.`
  - v2.11:49 old `the templates tree, and the docs that called` new `the templates tree and the docs that called`
  - v2.12:46 old `three token lines per level; the Level 3 edge-case block` new `three token lines per level. The Level 3 edge-case block`

### C-11 (P2, judgment) v2.12.0.0 keeps test counts, check housekeeping and internal ids
- `v2.12.0.0.md:62-66` `## Verification` section: "24 affected test files pass, including the new `measured-behavior-rule` (7) and `draft-auto-repair` (15) suites" and the card-sync, Hermes and link checks. Template section 3 Drop by Default: "Test counts, test tables" and "Follow-on housekeeping"; SKILL.md section 9 check 7. Neither tier shape has a Verification section.
- `v2.12.0.0.md:46` "CHK-100 is conditional and the deploy-ready checks CHK-121 and CHK-122": task ids, which section 3 drops.
- Fix: keep the census sentence (it is the evidence for "no verdict change") by moving it into Upgrade Notes or the opening, drop lines 65-66 and the section heading, and rewrite line 46 without CHK ids.

### C-12 (P2, judgment) v2.11 and v2.12 use the expanded tier for compact-sized releases
- Each has 5 glance bullets, is a minor bump and is non-breaking. Template section 5: "< 10 changes AND not major AND not breaking -> Compact format" (summary, What's New at a Glance, `## Upgrade`). Both use topical H2s with H4 items and `## Upgrade Notes`. Note: v2.9.3.0 sets the same precedent, so this is a family-wide drift, not a one-off.
- Fix: either recast both as compact entries or record why the expanded tier was chosen; also drop v2.11 "Docs Match the Code" (`:47-49`), which is follow-on housekeeping by template section 3.

### C-13 (P2, literal) v2.11.0.0 spec-folder line omits phase 014, whose doc sweep it describes
- `v2.11.0.0.md:17` names only `013-addon-removal-and-speed-refinements`; `:47-49` "Docs Match the Code" is phase 014's work (`014-.../implementation-summary.md:54-56`, incl. "decision-record required at Level 3"). v2.12 already uses the plural form for several phases (`v2.12.0.0.md:18`).
- Fix: old `> Spec folder: \`specs/system-speckit/054-weak-model-spec-authoring/013-addon-removal-and-speed-refinements\` (Level 2)` new `> Spec folders: \`specs/system-speckit/054-weak-model-spec-authoring/013-addon-removal-and-speed-refinements\` and \`014-removed-template-reality-sweep\` (Level 2)`

### C-14 (P2, judgment) No README tells a reader that strict validate can now write files
- Draft auto-repair (`validate.sh --strict` on a Draft packet runs `repair-derived.cjs --apply`, `SPECKIT_DRAFT_AUTO_REPAIR`, `validate.sh:77-80`) and `--quiet` (`validate.sh:69,101`) appear in SKILL.md, validation-rules.md, the card and ENV-REFERENCE.md, but in no README: `.skilled/skills/system-spec-kit/README.md:136` and `:618`, `runtime/cli/spec/README.md:107` and root `README.md:378` still describe validate.sh as a read-only check. sk-create-readme section 4 step 5 "current-state documentation". 017's changelog lists README.md under "Docs for the rule, the repair and the count" (`changelog-054-017...md` Files Changed), but the README diff in `62e4661e01` changed only the 41 to 42 counts.
- Fix: add one sentence to the validate.sh row in `runtime/cli/spec/README.md:107` and to `system-spec-kit/README.md:136` naming the Draft auto-repair, its off switch `SPECKIT_DRAFT_AUTO_REPAIR=0` and `--quiet`. Cross-lane note: `references/config/environment-variables.md`, which the skill README calls "the full environment variable reference" (`README.md:375`), does not list `SPECKIT_DRAFT_AUTO_REPAIR`.

### C-15 (P2, literal) templates README names a level_* examples glob that does not exist
- `.skilled/skills/system-spec-kit/templates/README.md:197` "`examples/level_*`"; folders are `examples/level-1`, `level-2`, `level-3`, `level-3+`.
- Fix: old `` `examples/level_*` `` new `` `examples/level-*` ``

### C-16 (P2, literal) Em dashes and an Oxford comma in in-scope command READMEs (predate 054)
- `.skilled/commands/speckit/README.txt:49,181,194,195,196,268,355` and `.skilled/commands/README.txt:80` use em dashes; `speckit/README.txt:181` "research, plan, and implement". sk-create-readme section 8 Human Voice Rules.
- Fixes: replace each spaced em dash (U+2014) with `: ` (49, 194-196, 268), `, ` (181 "rather than inside it, either can run" -> better `. Either can run`), and for 355 wrap the ladder in parentheses: `the continuity ladder (\`handover.md\`, then \`_memory.continuity\`, then canonical spec docs) and falls back`; `README.txt:80` the spaced em dash before `see` -> `, see`; 181 `research, plan, and implement` -> `research, plan and implement`.

### C-17 (P2, literal) Stale module counts in the skill README tree (predate 054)
- `.skilled/skills/system-spec-kit/README.md:432` "Core library (28 modules)": `runtime/cli/core/` holds 27 non-README files. `:434` "Utility modules (18 utilities)": `runtime/cli/utils/` holds 17.
- Fix: `(28 modules)` -> `(27 modules)`; `(18 utilities)` -> `(17 utilities)`.

## Checked and aligned

- Root `README.md`: no removed template is named (grep for before-after, roadmap, resource-map template: only `:258`, which correctly says `resource-map.md` is a deep-loop ledger, not an add-on); rule count 42 at `:148`, `:373`, `:378`, `:738`; "Fifteen templates" (`:263`) matches 4 core + 7 addons + 4 packet-types; Lazy Add-ons list (decision-record, goal, timeline) matches `create.sh:281`; level rows match `spec-kit-docs.json`; it makes no system-spec-kit version claim, so nothing to contradict SKILL.md 2.12.0.0; changelog link `:1647` resolves.
- `.skilled/skills/system-spec-kit/README.md`: 42-rule and three strict-only claims (`:63,136,463,618,669`) match the registry; authoring card row and links resolve; placeholder gate wording (`:537`, v2.3 or later) matches `check-placeholders.sh:95`; template groups and tree (`:284`, `:423-427`) match disk; `validate_document.py` reports VALID, 0 issues. Frontmatter `version: 2.7.15.0` differs from SKILL.md 2.12.0.0 by design: sk-create-changelog step 6 says README versions are "each document's own".
- `templates/README.md`: v2.4 stamps (`:25`) match the five templates' `SPECKIT_TEMPLATE_SOURCE` lines; addons tree (`:105-112`) and key-files table list exactly the seven remaining add-ons; Measured Behavior description matches `spec.md.tmpl`.
- `templates/examples/README.md`: four level folders exist; no removed template named.
- `runtime/cli/rules/README.md`: wildcard `check-*.sh` covers the new `check-measured-behavior.sh`; `runtime/cli/README.md:81` and `runtime/cli/resource-map/README.md` describe the deep-loop ledger only; `runtime/README.md:154` discovery list keeps `resource-map.md`, which v2.11 says the runtime name lists intentionally keep.
- All 154 README/README.txt files in the lane list (scope READMEs plus every README under system-spec-kit and commands): no mention of the deleted templates, no 41-rule count, no packet ids outside test fixtures.
- `.skilled/commands/README.txt`, `.skilled/commands/speckit/README.txt`: no template, add-on or rule-count claim to go stale (only C-16 voice issues).
- Release changelogs: v2.11.0.0 and v2.12.0.0 both exist with the five-key frontmatter in order, both identity phrases, H1, spec-folder blockquote, `&nbsp;` before every H2, bold glance lead-ins, `validate_document.py` VALID. Coverage of 054: v2.9.0.0 (001-009), v2.9.3.0 (010 and 012's card, Verify: and fsmonitor work), v2.11.0.0 (013, and 014's sweep), v2.12.0.0 (015-017). 011 and 018 shipped research and benchmark scratch only, and 019 touched only a `specs/system-deep-loop` script and 011's scratch loop (`019-.../implementation-summary.md` Files Changed), so no skill release is owed for them. v2.12 claims (87 lines in 12 files, v2.4 stamps, 42 rules, Draft auto-repair conditions) match the 015 and 017 changelogs and the code; v2.11 claims (`--with-lazy-addons` = timeline + decision-record, repair hint order) match `create.sh:281` and `orchestrator.ts:1495`.
- Packet changelogs: 20 files present (001-019 plus root), all named `changelog-054-<phase>.md` / `changelog-054-root.md`, five-key frontmatter, generator identity phrase, correct `SPECKIT_TEMPLATE_SOURCE`, spec-folder and parent lines, no leftover `{{` tokens, no em dashes. 001-005, 007-011, 013-016, 018, 019 content checked against their implementation summaries: later summary edits for 005, 010, 011, 015, 016, 018 are continuity or SHA-pin only and leave the changelog accurate.

## Commands run (all read-only)

- `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` on v2.11.0.0 (3 hard, `;`) and v2.12.0.0 (1 hard, `;`)
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` on v2.11, v2.12, skill README, spec README: all VALID, 0 issues (templates README skipped by the validator's template exclusion)
- registry counts via `python3` over `validator-registry.json`, current and at `62e4661e01^`
- `git log`/`git blame`/`git diff`/`git show` with fsmonitor off, for line provenance and summary-vs-changelog drift
