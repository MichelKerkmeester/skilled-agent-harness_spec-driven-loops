# Iteration 002 — create.sh --with-goal, the contract-driven AC decision, and the extension guide (RQ2)

- Angle: the new scaffold flag and the rewritten AC decision, checked against the manifest lists, the flag help, the summary output, and the maintainer guide that now documents the flag set.
- Verdict: the mechanics land correctly — `--with-goal` validates against `lazyAddonDocs` at every creatable level (1/2/3/3+/phase-parent; review/research are not creatable from create.sh, `--level` accepts only `1|2|3|3+|phase-parent` at :87-101), the AC decision is now list-driven, not grep-driven, and the phase paths (parent :763, children :1458) both honor both flags. What did not land: three prose surfaces that document the same system disagree with it and with each other, and the extension guide — the very document that declared the index descriptive — describes field semantics the index does not use.
- Findings: 4 (1×P1, 3×P2). Tool calls: 7/12.

## Verification summary (what landed)

| 010 claim | Evidence in tree | Verdict |
|---|---|---|
| --with-goal scaffolds at any level and on phase parents | `requested_lazy_addon_doc goal.md` validates against contract.lazyAddonDocs (create.sh:467-474); goal.md present in all 4 numbered + phase lazy lists (spec-kit-docs.json:183, 566, 1061, 1616, 2175) and helper exits 3 if omitted (create.sh:420-430) | CONFIRMED |
| AC decided from optionalAddonDocs, not a whole-contract grep | create.sh:462-465 `contract_lists_optional_addon "$contract_json" "acceptance-criteria.md"`; optionalAddonDocs = [acceptance-criteria.md] at L2/3/3+ only (spec-kit-docs.json:555, 1050, 1605), [] at L1/phase/review/research (:174, 2168, 2310, 2428) | CONFIRMED |
| Goal template author slug fixed | goal.md.tmpl:25 `last_updated_by: "scaffold"` | CONFIRMED |
| Render path exists for the goal | goal.md.tmpl:1 gate wrapper `IF level:1,2,3,3+,phase`; copy_template renders via INLINE_GATE_RENDERER (create.sh:1099, template-utils.sh:233) | CONFIRMED (end-to-end detail in iteration 006) |

## Findings

### f-iter002-001 [P1] — the extension guide says the lazy list is "the same at every level"; it is not
- THE CLAIM: `templates/EXTENSION-GUIDE.md:40` — "`lazyAddonDocs` for files a packet gets only on request. The list is the same at every level and mixes two ownership models…"
- WHAT THE CODE DOES: the four numbered levels are identical (9 docs: spec-kit-docs.json:176-184, 559-567, 1054-1062, 1609-1617) but PHASE is 7 docs (drops debug-delegation, research/research.md — :2170-2180) and REVIEW/RESEARCH are 6 (also drop goal.md — :2312-2322, 2430-2440). The guide's sentence that a maintainer extends a doc list from is wrong for 3 of 7 contracts.
- SEVERITY: P1 (wrong-or-unused: the guide is the manifest-maintainer entry point; a maintainer adding a lazy doc on "every level" would skip checking phase/review/research).
- RECOMMENDATION: fix — "the list is identical across Levels 1-3+; phase drops the command/agent docs and review/research additionally drop goal.md".

### f-iter002-002 [P2] — the extension guide's field semantics do not describe the index's values
- THE CLAIM: EXTENSION-GUIDE.md:29-31 — `creationTrigger`: "the workflow that creates it"; `absenceBehavior`: "`hard-error`, `warn`, or `silent-skip`".
- WHAT THE CODE DOES: documents[] values are `scaffold` / `explicit-option` / `phase-scaffold` / `memory-save` / `debug-dispatch` / `deep-research` / `deep-review` (spec-kit-docs.json:63-158) — most are NOT workflows; and the vocabulary includes `warn` but no documents[] entry uses it and round one established no rule produces a "warn" absence (CQ2 closed: the only absence behaviors in the system are hard-error via FILE_EXISTS/AC_CLOSURE/TEMPLATE_SOURCE and silent-skip via presence of nothing). The guide's own "descriptive index" contract is therefore self-inconsistent: it documents fields the values don't follow.
- SEVERITY: P2 (maintainer-facing vocabulary drift; no behavior impact).
- RECOMMENDATION: fix — "creationTrigger: the flag, command, workflow, or phase action that creates it"; drop `warn` from the enum or name the rule that can produce it.

### f-iter002-003 [P2] — root README says resource-map.md renders "through the workflow that owns them"; no workflow owns it
- THE CLAIM: `README.md:279` — "Optional support documents such as `handover.md`, `debug-delegation.md`, `research.md` and `resource-map.md` render through the workflow that owns them."
- WHAT THE CODE DOES: handover.md → memory-save (continuity writer), debug-delegation.md → debug dispatch (scaffold-debug-delegation.sh:137), research/research.md → deep-research loop — all workflow-owned. resource-map.md has NO workflow: its only creation path is a manual invocation of the inline gate renderer (EXTENSION-GUIDE.md:46-47: "the inline gate renderer any of them"), and it sits in the lazy list at every level with no flag (create.sh --with-lazy-addons = 4 docs :399; --with-goal = goal.md :467-474).
- SEVERITY: P2 (prose misattributes the creation path of the document this lane's 010 remediation just made contract-lazy; the renderer name the f-iter003-004 fix promised lives in the playbook/extension guide, not in this line).
- RECOMMENDATION: fix — split the sentence: name the three workflow-owned docs and say resource-map.md is rendered by hand with the inline gate renderer (named in the playbook).

### f-iter002-004 [P2] — documents[] says acceptance-criteria.md is "scaffold"-triggered with no level qualification
- THE CLAIM (index claim): spec-kit-docs.json:146-151 — `"acceptance-criteria.md": {creationTrigger: "scaffold", absenceBehavior: "hard-error"}`.
- WHAT THE CODE DOES: the scaffold decision is level-qualified — create.sh:462-465 scaffolds AC only when the CONTRACT lists it in optionalAddonDocs, which happens at L2/3/3+ (spec-kit-docs.json:555,1050,1605) and not at L1 (:174), phase (:2168), review (:2310), research (:2428). The index cannot express the split, and EXTENSION-GUIDE.md:33-35 (the descriptive-index contract) gives no hint that "scaffold" is level-qualified.
- SEVERITY: P2 (descriptive imprecision; the index is now explicitly "for readers", so a reader at L1 is misled).
- RECOMMENDATION: document — qualify the value in the extension guide ("scaffold at Levels 2-3+; the file-presence rule never sees it — AC_CLOSURE owns absence").

## What worked
- Reading the guide immediately after the manifest made the "same at every level" claim falsifiable in one comparison; the guide is the surface round one's f-iter001-002 asked to document, so its truthfulness is exactly what round two must verify.

## Ruled out (this iteration)
- An extension maintainer can break --with-goal by editing a phase/review lazy list: RULED OUT for review/research (not creatable), but the exit-3 helper protects every reachable path; nothing silent.

## Carried questions
- CQ-003: does AC_CLOSURE apply to phase parents (which create.sh never gives AC)? — iteration 004.
- CQ-004: what does the README trigger table actually name for the goal and the resource map (verification of f-iter003-004's fix) — iteration 003/006.
