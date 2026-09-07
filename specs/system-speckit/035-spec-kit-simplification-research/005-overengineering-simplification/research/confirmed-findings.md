---
title: "Confirmed findings: overengineering simplification"
description: "Every finding and plan move from the GLM 5.3 Flash synthesis over the validator registry, the hook matrix, the documentation corpus, the command surface, the root governance layer and the single-consumer abstractions, censused in the main checkout, with what was fixed, what was kept and why."
trigger_phrases:
  - "overengineering confirmed findings"
  - "validator help printer hidden rules"
  - "command surface retired checklist"
  - "optimizer adoption decision"
importance_tier: "important"
contextType: "research"
---
# Confirmed findings: overengineering simplification

Source: `lineages/glm-5-3-flash-overengineering/research.md` (10 of 10 iterations, stop reason `maxIterationsReached`, 30 findings: 5 P1, 25 P2, plus eight plan moves and one deferred phase). Every row was re-read against the registry, the orchestrator, `validate.sh`, the hook tree, the command assets and the documents in the main checkout on 2026-09-07 before child `011-command-surface-contract-realignment` was opened. The lane ran in worktree 046, so every count below was re-measured here; where the two differ the main checkout's number is given.

---

## 1. VERDICT

The lane's verdict holds: the overengineering sits in the perimeter, not in the validated core. The census confirmed the four perimeter defects it ranked P1 and found one it missed that outranks them: the `/speckit:*` command workflows still scaffold, verify and report on a `checklist.md` the level contract retired, name templates by a convention that resolves to no file, and call LOC thresholds soft guidance where the governance document says the scorer decides. Child 011 fixes those and the four confirmed perimeter defects; the core keeps every row the lane put on its keep-list, each with its reason below.

---

## 2. P1 ROWS

| ID | Claim | Census | Disposition |
|----|-------|--------|-------------|
| F1 | 39 rule rows run through three execution layers and 31 physical targets | 39 rows; 20 authored, 13 operational, 6 structural; 31 `check-*.sh` plus 3 helpers; TS-native entries, the embedded bash wrapper and the sourced scripts all present in `orchestrator.ts` | Confirmed. Kept: bash rules need a wrapper the TypeScript orchestrator can spawn, and the TypeScript rules cannot be spawned, so each layer carries rules the others cannot. The one defect the layering produced is F2, which is fixed. |
| F11 | The out-of-process adapters cost 3,582 lines of ceremony the in-process pattern does not | Exact: claude 4,249, codex 1,069, cursor 1,523, devin 1,608, pi 667, lib 4,030 | Confirmed. Recorded decision not to change: the adapters are five runtimes' live registration contracts, the delegation shape is documented in `hooks/README.md`, and a port changes runtime behavior the simplification program has no evidence against. |
| F14 | One severity vocabulary owned by five sites, and the display copy had drifted | The drift is real and is F2; `validation-rules.md` maps severities to exit codes, which the registry does not carry; `README.md:645` already names the registry authoritative | Confirmed for the printer only. Fixed there; the other sites state different layers' truths and stay. |
| F18 | `complete.md` promises six dashboards, three with no producing mechanism | The eight workflow assets say "dashboard" zero times; the presentation asset owns one dashboard layout and four checkpoints (research, deep-context, phase-decomposition, closeout) | Confirmed. Fixed: the presentation-boundary line now names what the asset holds. |
| F23 | The optimizer's promotion tail has zero recorded promotions | `audit/promotion-reports/` is empty; consumers outside the directory are the deep-research and deep-review configs, which point at the manifest, and the deep-loop anti-convergence test, which reads it; no runtime code imports the five scripts | Confirmed. Recorded decision: keep the directory, because the manifest is a live cross-skill contract and the scripts are its only producer; the README now states adoption to date instead of implying use. |

---

## 3. P2 ROWS

| ID | Claim | Disposition |
|----|-------|-------------|
| F2 | The help printer lists two of three categories, hiding the six structural rules | Confirmed: `--help` printed 33 of 39 rules. Fixed: the printer derives categories from the registry and prints 39; `validate-help-lists-every-rule.vitest.ts` holds it there. |
| F3 | The freshness trio runs only under `--strict` | Confirmed by design; the completion covenant mandates strict. The skill README said "four strict-only rules" where the registry has three; corrected. |
| F4 | The `skip` severity is declared and threaded but used by no row | Confirmed. Kept: it is the documented way to disable a rule without deleting its row, and costs one type member. |
| F5 | Status vocabulary duplicated across the three execution paths | Confirmed. Kept with F1. |
| F6 | Two info-only rows that cannot fail | Confirmed. Kept: `LEVEL_DECLARED` states the detected level and `AC_COVERAGE` fails under its enforce switch since child 010. |
| F7 | 22 of 39 rows condition themselves on flow surfaces | Not re-counted; rules self-gate by description and that is the design. Recorded. |
| F8 | Ten rows collapse onto two implementations | Confirmed: five `CANONICAL_SAVE_*` rows through one script and the env round-trip, five rows through `ts:spec-doc-structure`. Recorded decision not to collapse: each row names a distinct failure the report attributes, and narrowing works per row through the alias map; eight fewer rows would buy wrong attribution. |
| F9 | 31 rows carry about 75 alias strings | Re-measured: 30 rows, 54 strings. Live: `orchestrator.ts:439` builds the canonical map from them. Kept. The `cli/lib/validator-registry.ts` loader this row also cited had no importer and was removed in child 014. |
| F10 | Freshness semantics spread across three surfaces with a warn-versus-enforce duality | Confirmed. Kept; the two-layer split is the governance-versus-implementation boundary, and F30 gives the hashed input a definition. |
| F12 | Five registration schemas for one behavioral contract | Recorded; the registrations live outside this packet's write scope. |
| F13 | The `opencode/` adapter directory is empty | Dropped: it holds a browsability symlink to `.opencode/plugins/system-spec-gate.js`, documented at `hooks/README.md:82`; the lane counted regular files. |
| F15 | The routing covenant taxes every references edit with two regenerations and a check | Confirmed by design; the changelog, benchmark and playbook trees are maintainer provenance the router never selects. Kept. |
| F16 | `validation-rules.md` restates severity levels while declaring the registry authoritative | Kept: its table maps severities to exit codes, a CLI contract the registry does not hold. |
| F17 | The 0.05 novelty default is written in eight places | Out of this packet's boundary; the default belongs to the deep-loop skill. Recorded. |
| F19 | The retired-memory covenant is stated in three document classes with a recovery ritual | The lane corrected its own dead-steps hypothesis; the covenant is enforced end to end. Recorded, no change. |
| F20 | `level_contract_optional_*.md` resolves to no file | Confirmed, and wider than stated: every `level_contract_*.md` name in the eight workflow assets (155 occurrences) was symbolic. Fixed: each now names the real template path under `templates/core/` or `templates/addons/`, and the resource-map README link points at the template. |
| F21 | The freshness covenant is stated at governance and implementation | Kept: two layers, two duties. |
| F22 | Nothing in the governance layer can fold into a repo rule | Confirmed: `CLAUDE.md` is a symlink to `AGENTS.md`; nine rule files carry one spec-kit mention. Kept. |
| F24 | `SPECKIT_BM25_ENGINE` survives only in a golden fixture and a test comment | Confirmed. Fixed: the query and its fixture document removed from `golden-queries.json`, the retired paragraph removed from `env-reference-drift.vitest.ts`. |
| F25 | `shared/embeddings.ts` and the fusion algorithms are consumed only out of boundary | Superseded: child 009 deleted `embeddings.ts` and `adaptive-fusion.ts`; `rrf-fusion.ts` stays as the shared package's live export. |
| F27 | 62 percent of implementation summaries carry the zero fingerprint | Re-measured here: 1,890 of 3,247, 58 percent. A fact about adoption, not a defect; kept. |
| F28 | The 035 track's five lanes were authored but not executed | Superseded: lanes 001 to 005 ran and children 006 to 010 are Complete with real fingerprints. |
| F29 | The honesty machinery works where exercised | Confirmed. Kept. |
| F30 | Two fingerprints collide across different packets and no layer names the hashed input | The collision did not reproduce: both `028-cli-hub-rename` summaries carry the zero placeholder in the main checkout. The second half held: no document named the input. Fixed: `validation-rules.md` now states that the fingerprint is the SHA-256 of `implementation-summary.md`'s own normalized text. |
| F31 | Playbook scenarios do not cite the suites they shadow | Re-measured: 23 of 85 cite a suite. Recorded decision not to change: a manual scenario is the non-automated proof path, and a provenance line claiming a shadowed suite where none exists would fabricate provenance. |

The synthesis numbers its findings F1 to F31 and states 30; no F26 appears in the text or the register.

---

## 4. THE CENSUS FINDING THE LANE MISSED

| Claim | Census | Disposition |
|-------|--------|-------------|
| The command workflows describe a level system the contract no longer runs | 115 mentions across the eight `speckit-*.yaml` assets, four presentation assets, `README.txt` and `implement.md`: `checklist.md` in every level's required files, a step that loads its template and creates the file, a step that verifies it, an inline scaffold for it, a note that LOC thresholds are soft guidance | Confirmed. Fixed in child 011: the acceptance-criteria document takes the closure role the contract gives it, the tasks.md verification checklist keeps the P0/P1 protocol, the level note names `recommend-level.sh`, and every symbolic template name is a real path. |

---

## 5. PLAN MOVES

| Move | Disposition |
|------|-------------|
| R1 one vocabulary | The printer is fixed and tested; the pointer edits it proposed would remove layer-specific truths and are not made. |
| R2 collapse the multiplexes | Recorded decision not to change (F8). |
| R3 playbook provenance lines | Recorded decision not to change (F31). |
| R4 make the dashboard promise true | Done (F18). |
| R5 resolve the naming conventions | Done for every symbolic template name (F20); the `opencode/` directory needed no change (F13). |
| R6 freeze the optimizer's promotion tail | Kept with its adoption stated (F23). |
| R7 retire the readerless flag | Done (F24). |
| R8 orientation pointer for the two retrievals | Superseded: child 009 removed the machinery the pointer would have distinguished. |
| Phase 2 adapter port | Recorded decision not to change (F11). |

---

## 6. ROUND TWO (DeepSeek V4 Flash max through DevPass, 10 iterations on the remediated tree)

Source: `lineages/deepseek-v4-flash-overengineering/research.md`, stop reason `maxIterationsReached`, 15 findings: 2 P1, 13 P2. Censused in the main checkout on 2026-09-07 before child `017-completion-gate-and-catalog-alignment` was opened.

### Verdict held

Every asset-level claim of children 011 and 012 held: the eight workflow assets, the help printer and its test, the fingerprint definition across three layers, the presentation boundary, the optimizer's adoption statement, the resource-map link and the BM25 residue. The round's rows are the enforcement chain behind those assets and the documents beside them. No round-one kept row was re-listed; two of its figures were corrected.

### P1 rows

| ID | Claim | Census | Disposition |
|----|-------|--------|-------------|
| F2-01 | The completion-evidence sentinel gates on the retired `checklist.md` and knows nothing of acceptance closure | Confirmed for the gate: child 016 had already moved it to the `tasks.md` verification section during this round. The closure half was open: `check-completion.sh` read the checklist only | Fixed: `check-completion.sh` reads the acceptance-criteria table when the document exists, reports `AC_UNMET` for an `Unmet` row or a waiver that names no decision record, and the sentinel advises on that status |
| F2-14 | 27 packets carry a human label in the `sha256:` slot and the freshness checker classifies them as never recorded | 27 in the main checkout, all in closed packets of the 045 and z_archive eras; `continuity-freshness.ts:345` folded them into `missing_fingerprint` | Fixed in the checker: a present, non-zero, malformed value is its own `malformed_fingerprint` warning. The 27 stamps stay as written: rewriting closed packets' attestations would alter historical documents and their generated fingerprints, and the new class is what makes them visible |

### P2 rows

| ID | Claim | Disposition |
|----|-------|-------------|
| F2-02 | Seven surfaces present `check-completion.sh` as the completion gate while it read only the checklist | Fixed: the execution-methods reference, the spec README rows and the catalog entry say what it reads now |
| F2-03 | The lifecycle catalog entry says `upgrade-level.sh` detects and creates `checklist.md` | Fixed: the entry names the acceptance-criteria and decision-record documents the script reads |
| F2-04 | The nested-changelog reader keeps a legacy branch | Kept, as the lineage recommended |
| F2-05 | The quick reference, the template guide, the matrix and the mapping asset still call LOC soft guidance and say enforcement is manual | Fixed: each names the level recommender that scores LOC, file count and risk |
| F2-06 | The decision matrix's examples say "L1 + checklist" | Fixed: the closure document |
| F2-07 | The composition catalog entry says Level 2 adds `checklist.md`, lists the removed bridge document as lazy, and calls the validators' document set the scaffolder's | Fixed: the closure document, the bridge dropped, and the sentence now distinguishes the presence rules' required list from the marker rule's author-rendered list |
| F2-08 | Two manifest fields have no consumer and the Level 2 required-add-on list is empty while the workflow lists four files | Recorded: child 010 declared the index descriptive (its D1) and kept the closure document optional in the presence rule because the rule cannot see the rollout cutoff (its D2); the workflow's four files are the scaffold set, not the presence rule's |
| F2-09 | The manifest checker and its fixture live in another packet's tree | Kept, as child 012's limitation note disclosed |
| F2-10 | The rules README claims a full rule list while one script has no registry row | Fixed: the README states the registry's rows are the rule list and names the standalone scan separately; the orphan pointer rule was already removed by child 014 |
| F2-11 | The wikilink scan is gated by a flag nothing sets and defaults to a directory that does not exist | Fixed: the flag-gated rule path is removed with no caller, the default directory is the skills root, and the README calls it a standalone scan |
| F2-12 | Ten catalog references point at removed or moved source | Fixed: two moved files re-pointed, eight removed files marked as gone with the memory server, and the two entries that describe removed modules carry a retirement note pointing at the catalog's boundary table |
| F2-13 | Round one's playbook provenance figure came from the other skill's tree | Recorded: the in-boundary figure is 17 of 85 files; the decision not to fabricate provenance lines stands |
| F2-15 | Round one's fingerprint adoption figure accepted any `sha256:` prefix | Recorded: 412 of 3,250 summaries carry a well-formed stamp; the new checker class makes the malformed ones countable |


---

## 7. ROUND THREE (DeepSeek V4 Flash max through DevPass, five bounded iterations on the twice-remediated tree)

Source: `lineages/deepseek-v4-flash-overengineering-r3/research.md`, stop reason `maxIterationsReached`, 19 findings: 1 P1, 18 P2, five bounded angles. The GLM 5.3 Flash attempt that ran before the operator switched executors is kept under `lineages/glm-5-3-flash-overengineering-r3-partial/` as supplementary evidence. Censused in the main checkout on 2026-09-07 before child `020-rule-headers-registry-coverage-and-playbook-paths` was opened.

| Rows | Claim | Census | Disposition |
|------|-------|--------|-------------|
| F3-19 | Four playbook commands resolve to a directory that does not exist | Confirmed | Fixed: they run the deep-loop runtime's own tests |
| F3-06/08 | Six rule ids are named by no test | Confirmed, and one of them reported an id the registry does not carry | Fixed: one test scaffolds and validates a packet and asserts every registry id appears; the protocol rule reports the registry's id |
| F3-01/02/07 | Sibling rules state their split nowhere | Confirmed | Fixed: the headers of the presence, level-match, two frontmatter, anchor and grep rules name the sibling and the division |
| F3-03 | The files-rule header states the old ladder | Confirmed | Fixed in child 018 |
| F3-04 | The three metadata shape rules and the strict bridge overlap | Confirmed as a layer split | Fixed: the two shell headers name the bridge; the bridge's own header already names its scope |
| F3-05 | One rule script has no header block | Confirmed | Fixed |
| F3-09 | The canonical-save grandfather window expired on 2026-05-01 | Confirmed: the allowlist and two branches could no longer execute | Fixed: removed, with the script header updated |
| F3-10/12/13 | The lifecycle command assets repeat each other's steps and keep auto and confirm twins | Confirmed | Recorded: merging them is a command-surface redesign, not a remediation; the cadence of validate runs is a per-write choice each asset makes |
| F3-11 | Two placeholder conventions across the lifecycle assets | Not reproduced | Recorded: neither token occurs in the six assets in the main checkout |
| F3-14/15 | Seventeen reference files are browse-only and SKILL.md claims the map emits every leaf | Confirmed | Fixed for the claim: the map routes a subset and the manifest is the inventory. Recorded for the files: routing each needs its body read |
| F3-16/17/18 | Three deep-loop surfaces live in the spec-kit runtime tree with no document calling them contracts | Confirmed | Fixed: named in the integration reference |
| GLM partials | Two GLM iterations on rule value before the switch | Read | Their rows are the first-half and second-half rule reads, covered above |
