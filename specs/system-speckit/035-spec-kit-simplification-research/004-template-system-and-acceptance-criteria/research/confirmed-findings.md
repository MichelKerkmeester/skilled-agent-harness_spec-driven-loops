---
title: "Confirmed findings: template system and acceptance criteria"
description: "Every P1 and P2 row from the GLM 5.3 Flash synthesis over the template manifest, the scaffolder, the validator rules and the prose that describes them, censused in the main checkout, with the answers to the operator's original questions."
trigger_phrases:
  - "template system confirmed findings"
  - "resource map optional addon"
  - "acceptance criteria enforcement"
  - "lazy addons flag"
importance_tier: "important"
contextType: "research"
---
# Confirmed findings: template system and acceptance criteria

Source: `lineages/glm-5-3-flash-templates/research.md` (10 of 10 iterations, stop reason `maxIterationsReached`, 35 findings: 15 P1, 20 P2). Every row was re-read against the manifest, `create.sh`, the validator rules and the documents in the main checkout on 2026-09-07 before child `010-template-contract-alignment` was opened.

---

## 1. THE OPERATOR'S QUESTIONS, ANSWERED

| Question | Answer from the code |
|----------|----------------------|
| Is `resource-map.md` an optional add-on? | Yes, and until this program nothing declared it one: no level contract listed it, no command created it, and the validator recognised it only through a hardcoded pair in `spec-doc-structure.ts`. It is now a lazy add-on in every level contract, rendered by hand with the inline gate renderer. The deep loops write a different file of the same name into their own artifact directory. |
| Are `timeline.md` and `roadmap.md` add-ons? | Yes. Both are lazy add-ons at every level, scaffolded only by `create.sh --with-lazy-addons` together with `before-after.md` and `decision-record.md`. That flag was documented nowhere but the script's own help; the root README now lists it. |
| Is `acceptance-criteria.md` used? | Yes. It is scaffolded by default at Levels 2, 3 and 3+; the `AC_CLOSURE` rule fails a packet created after 2026-08-30 that lacks it or leaves a criterion unmet; `AC_COVERAGE` reports how many criteria carry `file:line` evidence, advisory by default and failing only under the new enforce switch. The documents said it "warns", which had been false since the cutoff. |
| What is core and what is an add-on? | Core is `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` once implementation starts. Everything else is an add-on, and the add-on list is identical at every numbered level; a level changes which sections the core templates render, never which files exist. |

---

## 2. P1 ROWS

| ID | Claim | Census | Disposition |
|----|-------|--------|-------------|
| f-iter001-001 | The manifest's `documents` taxonomy has no consumer | `creationTrigger` and `absenceBehavior` appear in no code file; the scaffolder and validator read the `levels` arrays. | Confirmed. The extension guide now says the section is a descriptive index; its values were corrected to match reality and `context-index.md` was removed. |
| f-iter002-001 | The root README's trigger table promises ask-surfaces that do not exist | Only four documents had a flag; `goal.md`, `resource-map.md` and `context-index.md` had none. | Confirmed. The table now names `--with-lazy-addons`, the new `--with-goal`, and the inline gate renderer. |
| f-iter002-002 | The level table misdescribes Levels 2, 3 and 3+ | Decision records are lazy at every level; Level 3+ adds sections, not files; the closure document is scaffolded, not optional. | Confirmed. Three rows rewritten. |
| f-iter002-003 | The README says loops emit the resource map next to the review report | `reduce-state.cjs` writes it into the loop's artifact directory from deltas. | Confirmed. Sentence rewritten with the two-artifact distinction. |
| f-iter002-004 | `resource-map.md` sits in no contract and is structure-checked through a hardcoded list | Confirmed at `spec-doc-structure.ts`. | Fixed: added to every level's `lazyAddonDocs`; the hardcoded pair removed; the contract is the single authority. |
| f-iter003-001 | `--with-lazy-addons` is documented only in `create.sh` | Confirmed. | Documented in the root README and the extension guide. |
| f-iter003-002 | Prose describes a cumulative per-level add-on ladder | The `lazyAddonDocs` list is byte-identical at Levels 1, 2, 3 and 3+. | Confirmed. The style guide, level-selection guide, template guide and level-decision matrix now describe the flat model; a new test pins the four lists equal. |
| f-iter004-001 | README says coverage traces into `tasks.md` | The rule reads each criterion's own Verification cell; `tasks.md` is only the pre-rollout fallback. | Confirmed. Sentence rewritten. |
| f-iter004-002 | Documents say a missing closure document warns | `AC_CLOSURE` is severity error and fails post-cutoff. | Confirmed. Root README, folder structure, template guide, template mapping and level-decision matrix corrected. |
| f-iter005-002 | The hooks README says the sentinel reads `checklist.md` | `check-completion.sh` reads the checklist inside `tasks.md`. | Confirmed. README corrected. |
| f-iter005-003 | Two completion gates with no documented boundary | The validator runs the acceptance rules; the tasks checklist is enforced by the completion tool and the Stop hook. | Confirmed. The root README now states the boundary. |
| f-iter006-001 | Nothing creates `goal.md` | Confirmed: no flag, no command, no rule. | Fixed: `create.sh --with-goal` scaffolds it; the playbook documents both creation paths. The template's author slug also failed the memory-block rule on a fresh scaffold and was corrected. |
| f-iter007-001 | Manifest versions disagree with five template markers | Confirmed for research, resource-map, handover, debug-delegation and context-index. | Fixed: manifest reconciled to the markers; a new test compares them on every run. |
| f-iter007-002 | The staleness checker reads a manifest path that does not exist | Confirmed: `templates/manifest/spec-kit-docs.json`. | Fixed: the checker reads `templates/spec-kit-docs.json` and now classifies 7,807 documents instead of calling every one unknown; the test asserts the path exists. |
| f-iter009-001 | The template guide claims a hard block on a missing decision record | No such gate exists. | Confirmed. Guide corrected. |

---

## 3. P2 ROWS

| ID | Claim | Disposition |
|----|-------|-------------|
| f-iter001-002 | `lazyAddonDocs` mixes two ownership models | Documented in the extension guide. |
| f-iter001-003 | The scaffolder decides to write the closure document by a substring grep over the whole contract | Fixed: `create.sh` asks the contract's `optionalAddonDocs` list. Moving it to `requiredAddonDocs` would hard-fail every grandfathered packet, so it stays optional. |
| f-iter002-005 | The skill's template gates omit four template-backed documents | Recorded; the gate list names the documents an author writes, and the omitted four are command- or workflow-owned. |
| f-iter003-003 | Research is described as lazy only at Levels 3 and 3+ | Fixed in the three lines. |
| f-iter003-004 | The explicit-option rows never name the renderer | Fixed: the root README and the playbook name the command. |
| f-iter003-005 | "Level 2 = Level 1 + checklist" | Fixed. |
| f-iter004-003 | Coverage is advisory end to end while the README says "requires" | Fixed in the README; the reserved enforce switch now works. |
| f-iter004-004 | This lane's own acceptance criteria were self-referential | Recorded; the criteria named what the lane must produce, which is what a research lane can promise. |
| f-iter005-001 | The runtime README's discovery list names `checklist.md` | Fixed to match `spec-doc-paths.ts`. |
| f-iter005-004 | `SPECKIT_AC_COVERAGE_ENFORCE` reserved but unconsumed and undocumented | Fixed: implemented in the rule, documented in the reference and the env template. |
| f-iter006-002 | Nested-goal binding is a convention, not a gate | Recorded; the binding is what the parent goal asks of its children, and a rule would have to know which packets are parents of goal-bearing children. |
| f-iter006-003, f-iter008-004 | Two things named "goal" | Documented in the playbook: the packet document and the session objective string, with the resync rule as the bridge. |
| f-iter007-003 | `templateVersions` has no consumer | The new parity test consumes the manifest directly; the resolver export stays for the test that already read it. |
| f-iter007-004 | The template-source remediation example names a template that does not exist | Fixed with a real marker. |
| f-iter007-005 | Legacy markers versus the repaired checker | Documented in the checker's header: presence is enforced, versions are grandfathered. |
| f-iter008-001 | Three document-inclusion authorities | Fixed: the contract is the one authority; the workflow-document exclusion stays because those files have no authored shape. |
| f-iter008-002 | `checklist.md` still presented as live in prose | Fixed in the template guide, level specifications, validation rules, phase checklists, runtime README, and the level-decision, template-mapping and parallel-dispatch assets the lane did not list. |
| f-iter008-003 | Golden coverage covers only the flagged four | Recorded; the version-parity test covers the drift class the goldens missed. |
| f-iter009-002 | The migration guide says it lives in a directory that does not exist | Fixed. |

Found during the census, not in the synthesis: `runtime/tests/continuity-freshness.vitest.ts` fails on the untouched worktree as well as here; its fixture edits a `checklist.md` the packet contract retired, so the test describes a document that no longer exists. Recorded for the tasks and tests lane rather than patched here.

---

## 4. OPEN QUESTIONS CARRIED

1. Whether the `documents` index in the manifest should be wired into enforcement or removed outright now that it is declared descriptive.
2. Whether the continuity-freshness test should be rewritten around `tasks.md` or retired with the document it edits.

---

## 6. ROUND TWO (DeepSeek V4 Flash max through DevPass, 10 iterations on the remediated tree)

Source: `lineages/deepseek-v4-flash-templates/research.md`, stop reason `maxIterationsReached`, 34 findings: 6 P1, 28 P2. Censused in the main checkout on 2026-09-07 before child `016-template-seams-and-sentinel-repair` was opened.

### Verdict held

Every machine-level claim of child 010 held: the goal flag scaffolds at every creatable level, the closure decision is list-driven, the enforce switch fails, the staleness checker reads the manifest that exists, and every template version matches its marker. Round two's rows are the seams beside those changes.

### P1 rows

| ID | Claim | Census | Disposition |
|----|-------|--------|-------------|
| f-iter001-001 | The optional-continuity set is defined twice with different members | `orchestrator.ts` had nine members, `spec-doc-structure.ts` ten | Fixed: one exported set in the structure module, imported by the orchestrator; `resource-map.md` joins it because its template ships no continuity block, and `acceptance-criteria.md` stays optional in both readers |
| f-iter002-001 | The extension guide says the lazy list is the same at every level | Numbered levels identical; phase drops two, review and research drop three | Fixed: the guide, the style guide and a new parity case say so |
| f-iter003-001 | The template guide calls `decision-record.md` required at Level 3 | The manifest lists it lazy at every level | Fixed |
| f-iter004-001 | Child 010's own criteria cite no `file:line` | Six Met rows, none path-cited | Fixed: every row now names the line that proves it |
| f-iter005-001 | The completion-evidence sentinel gates its whole evaluation on `checklist.md` | `completion-evidence-sentinel.cjs:500` stat'd the retired file, so `check-completion.sh` never ran from the Stop hook | Fixed: the sentinel gates on a `tasks.md` carrying the verification section's protocol anchor; its three tests build that section instead of the retired document |
| f-iter009-001 | `--sharded` advertises a templates directory that does not exist | `templates/sharded/` absent; the block warned and touched empty stubs | Fixed: the flag, its help rows and the block are removed |

### P2 rows

| ID | Claim | Disposition |
|----|-------|-------------|
| f-iter001-002 | `resource-map.md` renders with a continuity warning | Fixed by the unified set |
| f-iter001-003 | The freeform exemption comment claims inertness at numbered levels | Fixed: the comment states what the exemption does |
| f-iter001-004 | The document collector special-cases the closure document instead of the optional list | Fixed: every present optional add-on is collected |
| f-iter001-005 | `goal.md` has section gates but no anchor enforcement | Fixed: it joins the static-anchor set; the decision-record omission is commented as deliberate |
| f-iter002-002 | Field descriptions and the absence enum in the extension guide | Fixed: the trigger is a label, the enum has the two values the manifest uses |
| f-iter002-003 | The README says `resource-map.md` renders through an owning workflow | Fixed in both READMEs |
| f-iter002-004 | The closure document's trigger is level-qualified | Fixed: the index entry says at which levels |
| f-iter003-002 | The style guide's lazy row omits three documents and overstates "every level" | Fixed |
| f-iter003-003 | One README trigger row joins two creators | Fixed: two rows |
| f-iter003-004 | The scaffold walkthrough names neither flag | Fixed |
| f-iter003-005 | The ToC lists disagree with the rule | Fixed: `acceptance-criteria.md` joins the rule, which now matches both documents |
| f-iter004-002 | One in five Met criteria cite `file:line` repository-wide | Documented: the coverage reference now calls the floor aspirational and says what enabling the switch would do |
| f-iter004-003 | The template-source rule checks required documents only | Fixed: a separate document list carries the closure document and the six author-scaffolded add-ons, without widening the file-presence rules |
| f-iter004-004 | The evidence pattern accepts clock times and ports | Fixed: a path-like token is required before the colon |
| f-iter005-002, 003, 004 | The sentinel header and two README sentences | Fixed with the sentinel; the README sentences were rewritten in child 010's own pass and re-read |
| f-iter006-001 | The playbook contradicts itself about who writes `goal.md` | Fixed |
| f-iter006-002 | The skill's gate list omits the four flag-owned documents | Fixed |
| f-iter006-003 | The template helper cannot resolve `research/research.md` | Fixed: the helper resolves by basename |
| f-iter007-001 | The staleness checker compares one template | Documented in the checker: the parity test keeps the others at the same version |
| f-iter007-002 | The changelog templates are untracked by the manifest | Documented in the templates README |
| f-iter007-003 | The auto-upgrade set omits two scaffolded documents | Fixed |
| f-iter008-001 | The templates README omits `goal.md.tmpl` and misnames one example directory | Fixed |
| f-iter008-002 | `privateTaxonomy` has no consumer | Removed |
| f-iter008-003 | No golden covers the goal scaffold | Fixed: the goal template joins the anchor goldens and a `--with-goal` scaffold case |
| f-iter008-004 | `templates/stress-test/` has no consumer | Removed with its folder-structure and README rows |
| f-iter009-002 | The parity suite pins only the numbered lazy lists | Fixed: a case pins how the packet-type rows narrow it |

### The seven runtime suites

The same defect class reached the runtime test project, which CI never ran: three suites built the retired checklist document, one expected pre-nesting paths, one expected an old rule message, one expected children ids outside the packet's identity to survive a merge, one hit the council writers' new authorized-roots guard, and the stdio check scanned the CLI package that now nests under the runtime. All seven are repaired at their own faults in this child.
