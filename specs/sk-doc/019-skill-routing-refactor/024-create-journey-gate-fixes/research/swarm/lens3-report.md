## Journey Table

| Journey step | Result | Evidence |
|---|---|---|
| Standalone 1-4: define purpose and triggers | PARTIAL | Captures examples and trigger phrases, but never maps them into `graph-metadata.json.intent_signals`, `derived.trigger_phrases`, or the `<!-- Keywords: ... -->` block used by scoring (`create-skill/SKILL.md:173-176`). |
| Standalone 5-10: plan resources | OK | Correctly separates scripts, references, assets, and procedures. |
| Standalone 11: run initializer | PARTIAL | Emits advisor-ingestible schema v2 metadata with `family: sk-util`, arrays, and a derived object, but routing signals are only the skill slug (`init_skill.py:271-294`). |
| Standalone 12-25: author skill | GAP | No explicit instruction to replace scaffolded graph routing signals, explain scorer inputs, or prove a representative prompt selects the new skill. |
| Standalone 26: class gate `--fix` | PARTIAL | Temporary scaffold passed and generated its manifest/aliases, but the gate validates root topology and generated artifacts, not advisor metadata semantics. |
| Standalone 27-29: validate/package | GAP | Fresh scaffold failed strict validation because generated `manual-testing-playbook.md` lacks required `version`. No advisor scan/recommendation check exists. |
| Standalone 30: improve after usage | PARTIAL | Says to improve trigger descriptions, but provides no scorer-attribution or advisor-validation workflow. |
| Parent 1-4: identity and initializer | PARTIAL | Correctly creates one hub identity, but graph signals remain mostly slug and routing-framework terms (`init_skill.py:515-572`). |
| Parent 5: root metadata | OK | Includes `command-metadata.json`; initializer writes `[]` when no command is owned (`init_skill.py:600-603`). An exact authoring template exists. |
| Parent 6-9: nested packet identities | OK | Packets omit `graph-metadata.json`, preserving one advisor identity. |
| Parent 10-23: registry/router | OK | Steps require `advisorRouting`; initializer and registry template emit it (`create-skill/SKILL.md:259-272`, `init_skill.py:453-477`). |
| Parent 24-25: compiled routing | OK | Covers within-hub mode routing, not advisor discovery of the hub itself. |
| Parent 26: class gate | GAP | Current document has 26 parent steps, not 30. The command omits `--fix`, so a fresh hub fails with missing `leaf-manifest.json`. |
| Parent after `--fix` | GAP | Generated manifest activates doctor rule 10a, but initializer and registry template omit required numeric `resourceContractVersion` (`parent-skill-check.cjs:1085-1101`). |
| New-skill ingestion seam | PARTIAL | Manual rebuild/scan is documented in system-skill-advisor, but create-skill never hands off to it. The daemon watcher enumerates existing files only and cannot reliably see a wholly new top-level directory. |
| Route verification | GAP | Neither journey ends with `skill_graph_scan`/`advisor_rebuild`, graph validation, or representative `advisor_recommend` acceptance tests. |

## Findings

P1 | `create-skill/SKILL.md`, `system-skill-advisor/mcp-server/lib/daemon/watcher.ts` | The creation journeys do not close the ingestion seam, and “wait for the watcher” is unreliable for a new root | Create-skill ends at validation/package (`SKILL.md:198-202`, `273-275`). The watcher starts with paths discovered from existing top-level skill directories and watches those exact files (`watcher.ts:171-176`, `228-253`, `390-404`). `refreshTargets()` runs only after an already-watched event is processed (`watcher-orchestrator.ts:100-127`). A new sibling directory therefore requires rebuild, scan, restart, or another watched event.

P1 | `create-skill/SKILL.md`, `scripts/init_skill.py` | Structurally valid scaffolds retain weak routing evidence because authors are never told to update the fields the advisor scores | Standalone metadata defaults `domains`, `intent_signals`, triggers, and topics to the slug (`init_skill.py:271-294`). Hub defaults add generic terms such as `mode-registry`, `hub-router`, and `primary` (`515-572`). The explicit lane scores `intentSignals` and SKILL keyword comments (`explicit.ts:315-331`); lexical scoring consumes description, domains, intent signals, and keywords (`lexical.ts:62-71`). The workflow does not connect its trigger-design step to these fields or require an attributed recommendation test.

P1 | `create-skill/SKILL.md`, `scripts/init_skill.py`, `parent-skill-registry-template.json` | The parent-hub completion path cannot pass its gates as written | Step 26 runs the class gate without `--fix` (`SKILL.md:273-275`); a fresh temporary hub failed `MISSING_GENERATED_FILE: ... leaf-manifest.json`. After `--fix`, doctor requires `mode-registry.json.resourceContractVersion` (`parent-skill-check.cjs:1091-1101`), but neither initializer registry output (`init_skill.py:453-477`) nor the parent registry template declares it.

P2 | `ci-skill-root-metadata.cjs`, `skill-graph-db.ts`, `skill-derived-v2.ts` | Passing the class gate does not prove advisor ingestibility or healthy v2 derived metadata | The class gate checks presence, class, nested identities, and generated files; it never validates `schema_version`, allowed `family`, array fields, or derived schema. The actual parser rejects unsupported versions/families and malformed arrays (`skill-graph-db.ts:757-777`). The generated derived block is ingestible because it is an object, but omits current v2 fields such as `sanitizer_version`; graph validation explicitly warns about that (`validate.ts:158-170`, `skill-derived-v2.ts:42-55`).

P2 | `scripts/init_skill.py`, `scripts/package_skill.py` | Both fresh scaffold kinds fail their documented strict validator due to generated content | `scaffold_playbook_tree()` emits frontmatter without `version` (`init_skill.py:188-197`), while strict package validation requires a four-part version for manual-testing-playbook documents (`package_skill.py:618-633`). Both temporary scaffolds failed on this defect in addition to expected TODO placeholders.

P2 | Parent-hub docs/templates and `skill-root-metadata-contract.md` | `description.json` is repeatedly called advisor-facing even though production routing does not consume it | The hub scaffold calls it “advisor-facing” (`hub-skill-scaffold.md:121`), while the canonical contract says no production consumer reads skill-root `description.json`; the advisor ingests `graph-metadata.json` (`skill-root-metadata-contract.md:73-75`). Doctor only checks that `keywords` is an array and that registry-owned keys are absent (`parent-skill-check.cjs:1029-1043`), not keyword quality. This directs author effort toward dead routing metadata.

## Refuted

- **REFUTED: P0 undocumented ingestion step.** The seam is documented outside create-skill. `system-skill-advisor/README.md:117-125,183` documents watcher/rebuild behavior, and `references/graph/skill-graph-drift.md:95-110,141` explicitly prescribes `advisor_rebuild` or `skill_graph_scan` for a new skill. The defect is disconnected and partly inaccurate guidance, not total absence.
- **REFUTED: scaffolded graph metadata is parser-incompatible.** Both temporary scaffolds used schema v2, allowed families (`sk-util`, `sk-hub`), string arrays, and a derived object accepted by `skill-graph-db.ts:757-777`.
- **REFUTED: parent workflow omits command metadata.** Step 5 requires it, initializer emits `[]`, the root contract lists it as required, and `parent-skill-command-metadata-template.json` provides the schema.
- **REFUTED: parent workflow omits `advisorRouting`.** Step 13 requires it, initializer emits a metadata route, and the registry template documents all routing classes.
- **REFUTED: no description keyword structure exists.** The description template includes `keywords` and `trigger_examples`; the remaining defect is that production routing does not consume that file and doctor does not assess keyword quality.

## Verification

- Temporary class gate with `--fix`: `2/2` roots passed.
- Fresh parent class gate as written: failed on missing `leaf-manifest.json`.
- Strict package validation: both scaffold kinds failed on generated playbook version.
- Contract test: `1/1` passed.
- Advisor parser/watcher tests: `16/16` passed.
- Temporary scaffolds removed.
- Final `git status --short` and `git diff --check`: clean.

VERDICT: FINDINGS 6

Review status: REQUESTED_CHANGES