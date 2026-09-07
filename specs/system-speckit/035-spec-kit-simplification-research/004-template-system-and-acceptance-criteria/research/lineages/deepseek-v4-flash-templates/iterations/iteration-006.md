# Iteration 006 — The goal addon end to end (RQ6)

- Angle: the goal document's full chain after 010 — flag (create.sh) → template validation (requested_lazy_addon_doc) → render (template-utils.sh copy_template → inline-gate-renderer) → playbook's two paths and its session-objective bridge — plus the nested-goal binding convention, verified live on the packet that built the system.
- Verdict: the end-to-end chain works (confirmed below); the playbook documents both paths and the two-artifacts distinction correctly EXCEPT its opening sentence, which says no command writes goal.md — the exact claim 010 just falsified. The SKILL gate list still omits the four author/flag docs, and the resolution scan cannot resolve the contract's `research/research.md` lazy entry. The nested-goal binding stays a convention — and the system-builder packet itself is the newest evidence for it: 035's parent goal carries a fully populated binding table (12/12 child goal files exist — verified by read, not by round-one counts).
- Findings: 3 (all P2). Tool calls: 8/12.

## Verification summary (what landed)

| Check | Evidence | Verdict |
|---|---|---|
| --with-goal → render chain | create.sh:467-474 (validates goal.md in contract) → template-utils.sh:87-107 copy_template (renders via `_inline_gate_renderer_path` :233 → inline-gate-renderer.sh --level) ; goal.md.tmpl:1 `IF level:1,2,3,3+,phase` matches RenderLevel ('1'|'2'|'3'|'3+'|'phase', inline-gate-renderer.ts:15-18) | CONFIRMED |
| Playbook names both paths + the two-artifacts distinction | goal-set-string-playbook.md:90-99 (item 1 create.sh; item 2 render by hand; :96-98 objective-string ≠ document, resync rule as bridge) | CONFIRMED except its first sentence |
| SKILL.md resource-map statement | SKILL.md:65 "lazy add-on in every level contract; render it with the inline gate renderer… deep loops write their own evidence ledger" | CONFIRMED (f-iter002-004's SKILL leg landed) |
| Nested-goal binding honored by the built system | specs/system-speckit/035-spec-kit-simplification-research/goal.md:70-96 — ANCHOR:binding table lists 12 phase child goal docs; all 12 files exist (001-012 under the parent; verified via directory read) | CONFIRMED (convention, still ungated) |

## Findings

### f-iter006-001 [P2] — the playbook opens section 6 by denying the command that section 6's own item 1 documents
- THE CLAIM: `references/workflows/goal-set-string-playbook.md:85` — "No command writes `goal.md` on its own. Two paths exist: 1. `create.sh ... --with-goal` scaffolds it…"
- WHAT THE CODE DOES: create.sh:467-474 `WITH_GOAL → requested_lazy_addon_doc goal.md`; the goal template renders via copy_template (template-utils.sh:87-107). The flag IS a command that writes goal.md on its own — the sentence is false and internally contradicts item 1 the same section prints two lines later. This is the 010 fix's own leftover: the lane wrote the two paths but left the "no command" opening that justified the old creatorless state (round one f-iter006-001's world).
- SEVERITY: P2 (self-contradicting prose in the canonical goal surface; item 1 immediately corrects the misdirection, so no capability confusion).
- RECOMMENDATION: fix — "`goal.md` is created on request. Two paths exist:" and delete the "No command" clause.

### f-iter006-002 [P2] — SKILL.md's authored-docs gate list still omits the four flag/author docs (re-list of f-iter002-005 with new evidence)
- THE CLAIM (kept row from round one): f-iter002-005 — the template gate and ToC lists omit 4 template-backed docs; disposition: "the gate list names the documents an author writes, and the omitted four are command- or workflow-owned."
- NEW EVIDENCE: SKILL.md:61 (Distributed Governance Rule) lists spec/plan/tasks/acceptance-criteria/implementation-summary/decision-record/handover/review-report/debug-delegation/resource-map — including THREE non-author-owned docs (handover — memory-save command; review-report — @deep-review workflow; debug-delegation — @debug agent) while omitting goal.md (now author-flag-owned via create.sh --with-goal), before-after.md, timeline.md, roadmap.md (all author-flag-owned via --with-lazy-addons). The disposition's criterion ("docs an author writes") is therefore NOT what the list follows: it includes 3 non-author docs and excludes 4 author docs, one of which (goal.md) gained a creation flag in this very remediation.
- VERDICT: the stated reason for not fixing is wrong for the current list — re-listed (round-two rule 3: new evidence that the stated reason is wrong).
- SEVERITY: P2 (authoring-gate completeness; no behavior — the gate is prose).
- RECOMMENDATION: fix — add goal.md, before-after.md, timeline.md, roadmap.md to SKILL.md:61 (and note the ToC list at :494 parallels the rule mismatch documented in f-iter003-005 — second instance of that class).

### f-iter006-003 [P2] — template-utils cannot resolve the contract's `research/research.md` lazy entry
- THE CLAIM: the manifest declares `research/research.md` lazy at every numbered level (spec-kit-docs.json:178,561,1056,1611) and its documents[] entry names template `research.md.tmpl` (:116-121); the structure validator treats it as a first-class lazy doc (spec-doc-structure.ts:223,230-233).
- WHAT THE CODE DOES: `_manifest_template_path` (template-utils.sh:201-226) builds `research/research.md.tmpl` from the doc name and scans `core/`, `addons/`, `packet-types/` → checks `addons/research/research.md.tmpl`, which does not exist (the file is `addons/research.md.tmpl`). Any path that tried to scaffold it via copy_template would fail with "required template document missing" (template-utils.sh:113-115). Today only the requested-4 lazy list reaches copy_template (create.sh:399), so the gap is latent — but the contract names a doc that the template machinery cannot resolve.
- SEVERITY: P2 (latent; the same class as round-one's f-iter001-001 (documents[] unwired) but narrower — a mapping gap between doc name and file layout).
- RECOMMENDATION: fix — key the doc-name→template resolution off the manifest's documents[].template (research.md.tmpl lives there already), or add a doc-name→template-name map beside the role scan.

## What worked
- Ground-truth-first: verifying the flag render chain from create.sh through template-utils to the renderer's RenderLevel type made the "works end-to-end" verdict citable at three levels of depth, and the playbook contradiction became visible as a two-line span rather than a claim to trust.

## Ruled out (this iteration)
- goal.md is exempted from the structure validator's anchor checks by a dedicated contract (like decision-record): RULED OUT — template-structure.js special-cases decision-record only (buildDecisionRecordContract :470-487); goal.md has no equivalent; the omission at spec-doc-structure.ts:214 is unengineered (see f-iter001-005).
- the nested-goal binding is enforced anywhere: RULED OUT again (kept row; the new 035-parent evidence confirms the convention is honored but nothing gates it — 88 goal.md files, 26 with ANCHOR:binding, including the system builder itself).

## Carried questions
- CQ-008: does upgrade-level.sh know the goal flag (a packet upgraded from L1 to L2/3 has no goal already)? — synthesis-level; the flag is scaffold-time only and upgrade-level.sh:55 uses the renderer — record in the merge/drop ledger.
