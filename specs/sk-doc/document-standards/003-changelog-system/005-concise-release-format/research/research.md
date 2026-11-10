---
title: "Research: making sk-create-changelog produce the concise release format by default"
description: "Five-iteration deep research on why sk-create-changelog produces the long v4.0.1.0 entry, which rules produce the short republished one, and a ranked file:line edit list with four operator decisions."
trigger_phrases:
  - "concise release format research"
  - "sk-create-changelog concise default"
  - "v4.0.1.0 short release entry rules"
importance_tier: "normal"
contextType: "research"
---
# Research: making sk-create-changelog produce the concise release format by default

<!-- ANCHOR:executive-summary -->
## 1. EXECUTIVE SUMMARY

The short republished `v4.0.1.0` entry (196 lines, 22 H4 items) is an Expanded entry, not a new tier. It carries two `**Breaking:**` markers [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:134] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:138], and the template routes any breaking change to Expanded regardless of count [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:223]. So the fix is to redefine what Expanded contains, not to add a third tier or re-route releases. The selection guide itself needs no edit.

The long format comes from three things working together:

- **Length follows the exemplar.** Precedence goes to the 535-line exemplar [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:31], and every ceiling is calibrated so that exemplar passes [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:212].
- **Expanded has no bounds.** There is no file total and no item count, and each H4 may run to seven paragraphs [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:101] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:208] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:210].
- **Selection starts from everything.** It opens with "List every change the source records", and in autonomous mode the text that actually runs is the YAML's copy of it [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:532].

The ranked fix has ten ranks across the template, `SKILL.md`, two references, both command YAMLs, the presentation file and `validate_document.py`, gated by four operator decisions (section 13). Rank 1, decoupling length from the exemplar, has to land before any ceiling is added.
<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:question-scope -->
## 2. RESEARCH QUESTION AND SCOPE

How should `.skilled/skills/sk-doc/sk-create-changelog` (SKILL.md, ROUTER.md, the template and references) and the `/create:changelog` command surface change so that, by default and especially for releases with many changes, generation produces the shape of `.skilled/changelog/skilled/v4.0.1.0.md` at `6a93a2cfeb`? Compared against the long version at `bc28fcbbba`, the canonical exemplar `v4.0.0.0.md` and the current template. Read-only: no file outside this research packet was edited.

Key questions: Q1 the short entry's rules; Q2 where the skill packet pushes long; Q3 where the command surface pushes long; Q4 what `validate_document.py` or `hvr_scan.py` could check; Q5 ranked exact edits. All five answered.
<!-- /ANCHOR:question-scope -->

<!-- ANCHOR:method -->
## 3. METHOD

Five iterations, each run by the `deep-research` leaf through cli-pi (`pi -p --offline --model llmgateway/deepseek-v4.1-flash-1017 --thinking max`). Stop policy was `max-iterations`, so convergence counted only as telemetry. Each iteration wrote its narrative, a delta and one gateway-recorded state record, and each passed `verify-iteration.cjs` (exit 0). The orchestrator re-read the load-bearing citations in section 14 before compiling this synthesis.
<!-- /ANCHOR:method -->

<!-- ANCHOR:target-format -->
## 4. THE TARGET FORMAT (Q1)

Measured: short entry 196 lines, 22 H4, 11 H2. Long version 338 lines, 38 H4. Exemplar 535 lines, 44 H4 (orchestrator `wc -l` and `grep -c '^#### '`).

Rules the short entry follows, each a candidate template rule:

- **SR-cut-at-H4.** Every H2 domain survives in the same order. The cut happens at the H4 level, never by deleting a domain [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:31].
- **SR-three-doors.** A cut H4 leaves in one of three ways:
  - folded into a sibling as a closing sentence [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:56];
  - folded into one `#### Smaller Fixes` bullet list [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:152];
  - dropped, when it is process, housekeeping or a fix with no visible effect [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:161].
- **SR-one-paragraph.** Every surviving H4 is one paragraph. The only body bullet list is the Smaller Fixes list [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:146].
- **SR-spec-line.** The spec line lists paths with no `(Level N)` or phase annotation and ends with one trailing clause [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:27].
- **SR-upgrade-order.** Upgrade Notes are plain bullets led by the reader's situation, in the body's section order, without the Adopt, Repoint and Drop triad [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:179].
- **SR-own-entry-sentence.** One sentence in the last body section names every component and mode that has its own changelog entry [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:167].
- **SR-glance.** At-a-glance has 8 bullets for 22 H4s, in section order (iteration 1, iteration 4 finding 11).

Part of the long-to-short diff is a packet renumber pass, not a format change, and is excluded from these rules [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:27].
<!-- /ANCHOR:target-format -->

<!-- ANCHOR:skill-packet -->
## 5. WHERE THE SKILL PACKET PUSHES LONG (Q2)

- Format selection sends 10+ changes or any breaking change to Expanded [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:222] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:231]. Iteration 5 showed this is correct for the target and should stay.
- Exemplar precedence ("the exemplar wins") [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:31] and the calibration sentence that carries it out [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:212]. `SKILL.md` adds "sit beside the canonical exemplar" [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:100].
- The only file total is for Compact [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:210]. An H4 allows seven paragraphs [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:101] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:208].
- The domain count reopens "for a release the exemplar's size" [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:120].
- Small fixes have no container. The only instruction sits under Drop by Default [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:151], and the Expanded skeleton has no slot for a grouped list [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:105].
- Upgrade Notes are typed by action [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:123].
- The spec line requires `(Level {N})` [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:55] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:79] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:107], which contradicts the Drop list's ban on packet and phase labels [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:148].
- Selection opens by enumerating every change [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:133] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:198].
- The references point at the 535-line file as the full expanded shape and the canonical exemplar [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md:25] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/references/README.md:53].
- `ROUTER.md`, `version-bump-rules.md` and `topology-edge-cases.md` add no format pressure (iteration 2, findings 12 and 15).
<!-- /ANCHOR:skill-packet -->

<!-- ANCHOR:command-surface -->
## 6. WHERE THE COMMAND SURFACE PUSHES LONG (Q3)

- `changelog.md` is a pure router that bans inventing wording, so it is not a target for format rules [SOURCE: .skilled/commands/create/changelog.md:61].
- Both YAMLs copy the tier threshold [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:540] [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:534]. `change_count` is computed by the workflow, so no operator ever chooses the tier (iteration 3, finding 3).
- `style_reference` names v4.0.0.0 [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:314] [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:294]. The domain count reopens for an exemplar-sized release [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:322] [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:302].
- Selection says "List every change the source records" [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:532]. The H4 slot allows seven paragraphs [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:573]. The content check allows "H4 items 7 paragraphs at most" [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:647] [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:583].
- Upgrade guidance is Adopt, Repoint and Drop [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:597] [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:551]. "In section order" exists only for glance bullets [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:608].
- No length, body-size or item-count gate exists on the command surface (iteration 3, finding 4). The release step publishes whatever length was produced.
- The completion report scores volume [SOURCE: .skilled/commands/create/assets/create-changelog-presentation.txt:156] [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:812].
- The two YAMLs have drifted, and the auto path is the stricter one (iteration 3, finding 10).
<!-- /ANCHOR:command-surface -->

<!-- ANCHOR:validator -->
## 7. WHAT A VALIDATOR CAN CHECK (Q4)

- `hvr_scan.py` is ruled out. It has no document-type concept and excludes structural findings [SOURCE: .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:15].
- In `validate_document.py`, changelog content checks are two `warning` regexes (internal IDs, test counts). Every `>` line is skipped [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:2706]. No length rule exists. `requiredSections` and `h2DividerRequired` do nothing for unnumbered changelog H2s [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:1834].
- Mechanical checks that pass the short entry and fail the long one:
  - total H4 at most 26 (22 passes, 38 fails);
  - per-section H4 ceiling. Iteration 4 proposed 5, iteration 5 proposed 6; the build should take 5 if it must fail the long version's sections of 5 or more;
  - H4 body at most 90 words, excluding code and lists (80 passes, 148 fails);
  - glance bullets at least `ceil(H4/4)` (8 of 22 passes, 8 of 38 fails);
  - `(Level N)` on the spec blockquote, matched on the `>` line itself;
  - an unfolded-fixes heuristic.
- Not checkable today:
  - glance order, because bullets carry no section name until the template adds a tag;
  - upgrade-note order, which needs an attribution convention;
  - maintainer-only detail by vocabulary, because the kept entry names tools and numbers on purpose [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60].
- All new checks ship at `warning`, because the 535-line exemplar fails any total ceiling.
<!-- /ANCHOR:validator -->

<!-- ANCHOR:ranked-edits -->
## 8. RANKED EDIT LIST (Q5)

Ranked by effect on default output. "Confirmed" means the cited line was re-read in the final working tree, by the leaf in iteration 5 and by the orchestrator where marked in section 14.

| Rank | Site | Change | Produces |
|---|---|---|---|
| 1 | `assets/changelog-template.md:31` | Exemplar wins on how a section reads; the template's ceilings win on length | length not from exemplar |
| 1 | `assets/changelog-template.md:212` | Ceilings set from what a reader needs; exemplar exempt from the file total | same |
| 1 | `SKILL.md:100` | Replace "sit beside the canonical exemplar" with "exemplar voice and section shape at your own ceilings", and name v4.0.1.0 as the many-change model | same |
| 1 | `references/worked-examples.md:25`, `references/README.md:53` | Point the expanded shape at v4.0.1.0; v4.0.0.0 stays as the major-release scale | same |
| 2 | `assets/changelog-template.md:101`, `:208` | One paragraph per H4; two only for a breaking change | SR-one-paragraph |
| 2 | `assets/changelog-template.md:210` (append) | Add `Expanded file total` 120-180 / 240 and `Expanded H4 items` 12-22 / 26 | bounded Expanded |
| 2 | `SKILL.md:259`, `create-changelog-auto.yaml:573`, `:647`, `create-changelog-confirm.yaml:583` | Mirror the same ceilings | same |
| 3 | `assets/changelog-template.md:151` + insert after `:105`, `create-changelog-auto.yaml:574` | Add a `#### Smaller Fixes` skeleton slot (bold-led bullets, last in the owning section). Leave out a fix with no visible effect | SR-three-doors |
| 4 | `assets/changelog-template.md:123`, `create-changelog-auto.yaml:597`, `create-changelog-confirm.yaml:551` | One plain bullet per action in section order, led by the reader's situation. A retirement's note sits under the section naming its replacement | SR-upgrade-order |
| 5 | `assets/changelog-template.md:55`, `:79`, `SKILL.md:107` | Delete ` (Level {N})` from the spec line | SR-spec-line |
| 6 | `assets/changelog-template.md:133`, `SKILL.md:198`, `create-changelog-auto.yaml:532`, `create-changelog-confirm.yaml:527` | Start from what the reader would notice, then confirm against the source (the YAML edit is the one that runs) | fewer items |
| 7 | `assets/changelog-template.md:91`, `:61`, `create-changelog-auto.yaml:566`, `create-changelog-confirm.yaml:539` | Tag glance bullets with their section, the precondition for an order check | SR-glance |
| 8 | `assets/changelog-template.md:120`, `create-changelog-auto.yaml:321-322`, `create-changelog-confirm.yaml:301-302` | Remove "more for a release the size of the exemplar" | no exemplar-sized escape |
| 9 | `shared/scripts/validate_document.py:2559` (after `CHANGELOG_VERSION_NAME`), `:3051` (after `validate_changelog_omissions`) | Add `validate_changelog_shape` with the section 7 checks at `warning` | detection |
| 10 | `create-changelog-presentation.txt:156`, `create-changelog-auto.yaml:812` | Report an H4 item count instead of `files_changed_count` | incentive |

The exact replacement text for every row is in [iteration-005.md](iterations/iteration-005.md) under THE RANKED EDIT LIST. Correction found by the orchestrator: that list quotes `CHANGELOG_VERSION_NAME` as line 2558. The constant is at line 2559, and line 2558 is `CHANGELOG_ENTRY_NAME`.

Builder order: D1, then Ranks 1 and 2 together (neither is safe alone), then Rank 3, then D3 and Rank 5, then Ranks 4, 6, 7, 8 and 10, then D2 and Rank 9.

**Not refused but not covered.** No ranked edit produces SR-own-entry-sentence or SR-cut-at-H4. None adds the brief's specific maintainer-only drop categories (tie-break order, test and scenario lists, how the work was done) to the Drop by Default list at `assets/changelog-template.md:144-151`. See section 12.
<!-- /ANCHOR:ranked-edits -->

<!-- ANCHOR:contradictions -->
## 9. CONTRADICTIONS RECORDED

- The spec-line shape `(Level {N})` contradicts the Drop list ban on packet and phase labels. Rank 5 resolves it at no cost, because validation check 4 tests only presence [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:254].
- A literal "upgrade notes by section" check would fail the target entry itself unless the retirement attribution rule is stated (iteration 4, finding 16).
- The proposed domain range of three to six does not cover the target's nine topical domains (iteration 5, Rank 8 note). The range needs an operator choice.
<!-- /ANCHOR:contradictions -->

<!-- ANCHOR:risks -->
## 10. RISKS

- If ceilings are added without editing `changelog-template.md:212`, they get calibrated back up to the exemplar.
- A blocking total ceiling fails `validate.sh --strict` on the 535-line exemplar.
- Editing only the template leaves autonomous output unchanged, because the YAML selection text is the one that runs.
- The glance section tag adds visible text to compact entries.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:recommendations -->
## 11. RECOMMENDATIONS

Take D1 option A: two exemplars by scale, v4.0.1.0 for many-change releases and v4.0.0.0 for major ones. Then build Ranks 1 to 3 as one change set, since they turn the target's three sharpest rules (length authority, bounded Expanded, folded fixes) into defaults. Before treating the concise format as fully specified, add the two uncovered rules from section 12.
<!-- /ANCHOR:recommendations -->

## Eliminated Alternatives

| Alternative | Why eliminated | Evidence |
|---|---|---|
| A third tier for many non-breaking changes | The target carries two breaking markers, so it would still route to Expanded | [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:134], [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:223] |
| A changelog mode on `hvr_scan.py` | No document-type concept; structural findings are out of its scope | [SOURCE: .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:15] |
| Populating `requiredSections` | The finder reads only numbered H2s | [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:1834] |
| A vocabulary ban for maintainer detail | The kept entry names tools and numbers deliberately | [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60] |
| Format rules in `changelog.md` | Router with a wording ban | [SOURCE: .skilled/commands/create/changelog.md:61] |
| Editing `SKILL.md:342` | Stays true once Expanded is redefined | [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:342] |
| Amending the Drop list to allow `(Level N)` | Widens the exemption; Rank 5 removes the need | [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:148] |
| A blocking total ceiling before D1 | Fails strict validation on the exemplar | iteration 4, finding 19 |

## Divergence Map

- Saturated directions: none recorded. The run used `convergenceMode: default`, and no divergent pivot fired.
- Pivots taken: 0. Pivot failures and audited overrides: 0.
- Remaining frontier: the two uncovered rules in section 12, and a reader-experience ranking that would place Rank 4 above Rank 2.

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

- No edit has been drafted for SR-own-entry-sentence (one sentence naming components with their own entry) or for SR-cut-at-H4 (cut items, never domains). Both are measured in Q1 but missing from the ranked list.
- The Drop by Default list (`assets/changelog-template.md:144-151`) has no edit naming tie-break order, test or scenario lists, or how the work was done. Iteration 4 showed these cannot be checked by vocabulary, so they need explicit template wording.
- The per-section H4 ceiling is 5 in iteration 4 and 6 in iteration 5. The build should settle it against the long version's per-section counts.
- Before editing, re-read `create-changelog-confirm.yaml:583` and packet `README.md:101`. The leaf carried both without re-reading them in iteration 5.
<!-- /ANCHOR:open-questions -->

<!-- ANCHOR:operator-decisions -->
## 13. OPERATOR DECISIONS

- **D1 (blocks Ranks 1, 2 and 9).** Which file is canonical for a many-change release? A) two exemplars by scale (recommended); B) v4.0.1.0 replaces v4.0.0.0; C) keep v4.0.0.0 alone and accept that it fails the new ceilings.
- **D2 (blocks Rank 9).** Shape checks at `warning` only (recommended), or `error` from the next version with the exemplar exempted.
- **D3 (blocks Rank 5).** Remove `(Level N)` from the spec line (recommended), or keep it and widen the Drop list.
- **D4 (blocks Rank 3).** Make `#### Smaller Fixes` a mandated heading name, or leave it free.
<!-- /ANCHOR:operator-decisions -->

<!-- ANCHOR:evidence-status -->
## 14. EVIDENCE STATUS

- Orchestrator re-read with `sed -n`, all matching the leaf's quoted text:
  - template `:31, :55, :79, :91, :101, :105, :120, :123, :133, :148, :151, :208, :210, :212, :223, :231`;
  - `SKILL.md:100, :107, :198, :254, :259`;
  - `worked-examples.md:25`, `references/README.md:53`;
  - auto YAML `:314, :322, :532, :540, :566, :573, :574, :597, :608, :647, :812`;
  - confirm YAML `:294, :302, :527, :534, :539, :551, :583`;
  - `create-changelog-presentation.txt:156`, `changelog.md:61`;
  - `validate_document.py:2558, :2559, :2676, :2679, :2706, :3049, :3051`;
  - `v4.0.1.0.md:27, :134, :138, :152`.
- Two quoted sentences start one line earlier than cited: auto YAML `:321-322` and confirm YAML `:527-528`.
- Measurements re-run by the orchestrator: 196/22, 338/38 and 535 lines. `v4.0.1.0.md` is unchanged since HEAD (last commit `a8cc47730b`).
- Inferred, not mechanically confirmed: the three-doors classification of the 16 cut H4s (iteration 1, matched by subject), and the claim that the ceiling values pass the short entry and fail the long one for word counts (leaf-measured, not re-run).
<!-- /ANCHOR:evidence-status -->

<!-- ANCHOR:references -->
## 15. REFERENCES

- Iterations: [iteration-001.md](iterations/iteration-001.md) to [iteration-005.md](iterations/iteration-005.md)
- [resource-map.md](resource-map.md)
- `.skilled/changelog/skilled/v4.0.1.0.md`, `git show bc28fcbbba:.skilled/changelog/skilled/v4.0.1.0.md`, `.skilled/changelog/skilled/v4.0.0.0.md`
- `.skilled/skills/sk-doc/sk-create-changelog/{SKILL.md,ROUTER.md,assets/changelog-template.md,references/}`
- `.skilled/commands/create/changelog.md`, `.skilled/commands/create/assets/create-changelog-{auto.yaml,confirm.yaml,presentation.txt}`
- `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py`
<!-- /ANCHOR:references -->

<!-- ANCHOR:run-notes -->
## 16. RUN NOTES

- Executor: cli-pi, `deepseek-v4.1-flash-1017` via llmgateway, `--thinking max`, 900 s timeout. Each prompt carried the child-dispatch preamble and the inlined `deep-research` persona, with `AI_SESSION_CHILD=1`, `SYSTEM_SPEC_GATE_ENFORCE=0` and `PI_BLACKHOLE_PASSIVE=true` in the environment.
- Route proof: every delta iteration record carries `target_agent`, `agent_definition_loaded`, `resolved_route` and `mode`. The gateway's projected state log does not, which `verify-iteration.cjs` reports as a warning.
- Write containment reported paths from a concurrent session: the `specs/agents-md/instruction-surface-integrity/005-v4-0-1-0-rules-refresh/research/` run, and a 37-file ROUTER.md version bump stamped 21:18:13. None of them came from this run's leaf.
<!-- /ANCHOR:run-notes -->

<!-- ANCHOR:artifact-index -->
## 17. ARTIFACT INDEX

`deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`, `iterations/`, `deltas/`, `prompts/`, `dispatch-receipts/`, `resource-map.md`, this file.
<!-- /ANCHOR:artifact-index -->

## Convergence Report
- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3: Q3 command doc and YAMLs (0.95); run 4: Q4 validator checks (0.91); run 5: Q5 ranked edit list (0.81)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Graph convergence before iteration 5: STOP_BLOCKED (source_diversity_guard, unverified_claims), telemetry only under the max-iterations stop policy
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
