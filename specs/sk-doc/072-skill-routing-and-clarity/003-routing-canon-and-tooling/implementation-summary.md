---
title: "Implementation Summary: Phase 3: Routing canon and tooling"
description: "The routing canon is in the templates and scaffolds, proven on sk-code-ci, and both creation checks reject the old shape while existing skills stay valid as known debt."
trigger_phrases:
  - "routing canon and tooling implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/003-routing-canon-and-tooling"
    last_updated_at: "2026-10-28T15:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Fixed the 3 P1 and 9 P2 review findings and reran every gate"
    next_safe_action: "Start phase 004: single vocabulary source"
    blockers: []
    key_files:
      - "scratch/routing-shape-contract.md"
      - "scratch/before.md"
      - "scratch/after.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does package_skill.py --strict accept SMART ROUTING followed by a final MACHINE ROUTER appendix? Yes, once the marker check also reads the appendix body; sk-code-ci passes."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 3: Routing canon and tooling

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-routing-canon-and-tooling |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

New skills now start in the routing canon, and the two creation checks refuse the old shape. Existing skills keep passing as recorded debt until phases 005 to 009 move them.

### The canon

`scratch/routing-shape-contract.md` is the one definition. In short:
- A hub keeps one root `ROUTER.md`.
- A mode packet has no `ROUTER.md`, a SMART ROUTING section of at most 12 non-blank lines and 180 words of prose, and any machine router block in a final, numbered `## N. MACHINE ROUTER` section.
- A standalone skill has the same short section, with its inline router in the same final section.

### What changed

| Area | Change |
|------|--------|
| `package_skill.py` | New routing-shape check over every skill kind: RS-001 SMART ROUTING over 12 lines or 180 words, RS-002 a machine block outside the final appendix, RS-003 an appendix that is not the last H2, RS-004 a packet `ROUTER.md`. `--strict` promotes all four. The smart-router marker check also reads the appendix body. |
| `parent-skill-check.cjs` | Check `12b-routing-shape` applies the same rules to the hub root and every packet. Each violation is a FAIL. Known debt is an INFO line. |
| `routing-shape-known-debt.json` | 54 existing skills, generated from the fleet, keyed by path under `.skilled/skills`. Each entry records lines, words, machine blocks outside the appendix and finding codes. A listed skill fails if a count grows or a new code appears; a folder outside the skills root is never debt. A ratchet test against a frozen snapshot stops the ledger growing, and the routing-registry-drift workflow runs it. |
| Scaffolds | Standalone, packet and hub scaffolds produce the canon, with the appendix numbered `## 8. MACHINE ROUTER`. The hub scaffold gained a `### Terms` glossary, and its final section holds the compiled-routing directive and the `UNKNOWN_FALLBACK_CHECKLIST`. |
| `init_skill.py` | The hub's `allowed-tools` renders as a list, so a fresh parent passes check 3j. |
| Templates and references | `skill-md-template.md`, `skill-smart-router.md`, `parent-skill-hub-template.md` and six reference docs teach the canon in plain words with one example. |
| `/create:skill`, `/create:skill-parent` | Both workflows, their YAML assets and presentations describe the canon. The skill flow's blocking completion gate runs `validate_skill_package.py --strict`, which runs `package_skill.py --check --strict`, so a routing-shape finding blocks creation. The parent flow authors from `parent-skill-hub-template.md` and is gated by check 12b. |
| Proof packet | `sk-code/sk-code-ci`: three lines of SMART ROUTING prose, block moved unchanged to the final appendix. |
| Changelogs | sk-create-skill v1.6.0.0, sk-code-ci v1.1.10.0. |

### Review fixes

A fresh review of the phase commit returned 3 P1 and 9 P2 findings. Every one is fixed.

| Finding | Fix |
|---------|-----|
| P1, the create gate did not enforce the canon | Both `create-skill-*.yaml` blocking gates run `validate_skill_package.py ... --strict`. `create-skill-completion-gate.test.cjs` pins it. |
| P1, RS-002 to RS-004 tolerated without bound | Entries record `lines`, `words`, `machineBlocks` and `codes`; a new code or a higher count fails, in both checks. Ledger regenerated. |
| P1, spec honesty | AC-004 evidence cites the template scaffold plus check 12b; absolute paths and outside-log citations removed; CHK-012 marked honestly. |
| P2, basename keys | Key is the path under `.skilled/skills`; outside it, never debt. Comment fixed. |
| P2, the ledger could grow | `routing-shape-known-debt-ratchet.test.cjs` against a frozen snapshot, run by the routing-registry-drift workflow, which also names the ledger path. |
| P2, unnumbered appendix heading | `## 8. MACHINE ROUTER` in the three scaffolds and the template examples; DQI back to 70. |
| P2, long lines evade the cap | A 180-word cap beside the 12-line cap. |
| P2, hub boilerplate fills SMART ROUTING | The compiled-routing directive moved to the hub's final MACHINE ROUTER section. |
| P2, checklist placement unenforced | `UNKNOWN_FALLBACK_CHECKLIST =` is a machine line in both checks; rationale corrected. |
| P2, fence parser false negatives | Fences close on a same-character run at least as long; unfenced machine runs count. Fixtures in both suites. |
| P2, malformed-ledger claim | Invalid-JSON and old-format cases added; CHK-031 corrected. |
| P2, `defer` wording | `defer` is described as a tie or conflict, never the no-match result. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator wrote the shared contract first, so the Python and Node checks could be built in parallel against one definition. Seven workers then ran on disjoint files, followed by three fix-up workers and one changelog worker. All of them ran DeepSeek V4.1 Flash Max through cli-devin. A review-fix pass followed: nine more DeepSeek workers through Devin, each on one change with disjoint files, with the orchestrator regenerating the ledger and its snapshot and checking Python and Node parity over the fleet. The orchestrator diffed each result, reran its verify command and proved each new test fails against the HEAD code in a copied layout. Then it ran the regenerations and the whole gate set.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The no-match outcome is named `UNKNOWN_FALLBACK` | `package_skill.py` already requires that marker and the compiled router requires `UNKNOWN_FALLBACK_CHECKLIST`. The other names (`defer`, "UNKNOWN fallback") are prose that later phases rewrite. |
| The glossary lives in a `### Terms` subsection of each hub's root SKILL.md, under HOW IT WORKS | Readers meet the terms in SKILL.md files, and the hub SKILL.md is the one file every packet already points at. `ROUTER.md` is held to the root-router contract, so adding a section there risks RRC codes. Packets link to it and define no routing terms. |
| The limit is a maximum of 12 non-blank lines; 8 is guidance, not enforced | A packet whose leaves the hub names may need fewer than 8 lines. |
| Standalone skills use the same final `## MACHINE ROUTER` section | One rule for every SKILL.md keeps both checks simple. The router is still inline in SKILL.md, as the research requires. |
| Known debt is a ratchet on the recorded line count, keyed by path | Exempting a path alone would let a changed old-shape skill pass. Hashing the file would break every unrelated edit on main. The ratchet fails a debt skill only when its old shape grows. |
| Proof packet is sk-code-ci | It is the only small packet that verify-router-sync reads in leg 2 through `parseRouter`, so the proof covers all three gates. Packet SKILL.md files sit outside the compiled-route hash, so the change is low-blast. |
| The routing-shape check also runs on surface packets and hub roots | The shape rules are independent of the section layout that surface packets skip. |
| A hub SKILL.md keeps `UNKNOWN_FALLBACK_CHECKLIST` in a final `## MACHINE ROUTER` | The shared compiler fails with `FALLBACK_CHECKLIST_MISSING` without the list (`registry-compiler.cjs` `extractFallbackChecklist`), but it finds the list anywhere in SKILL.md, so the compiler is not why it sits in the appendix. It sits there because it is a machine-router block under the canon, and both checks now count a fenced or unfenced `UNKNOWN_FALLBACK_CHECKLIST =` as one, so its placement is enforced. Phases 005 to 008 must move that list into the appendix, never delete it. |
| Check id `12b-routing-shape`, not the `13a-routing-shape` the first draft used | `13a` is already the version-parity slot. 12b sits next to `12a-router-contract`, in the root-contract group. |
| verify-router-sync and router-replay-lib are unchanged | The proof showed `parseRouter` reads the appendix (leg 2 still sees all four paths). The empty `SHARED_CONTROL_RESOURCES` case did not arise, because sk-code declares the list. |
| Review fix: a word cap of 180 beside the 12-line cap | A line cap alone let three 300-character lines pass. Words, not characters, so long link targets do not count against prose. The two canon-shaped skills (mcp-tooling 148, sk-code-ci 99) and the scaffolds (at most 104 after the hub move) fit; 12 lines of about 15 words is the budget. |
| Review fix: the debt key is the path under the skills root, resolved through symlinks | A basename key let a same-named folder anywhere borrow an entry. The skills root is `.skilled/skills` by default, overridable for tests with `ROUTING_SHAPE_SKILLS_ROOT`. |
| Review fix: a malformed entry, including the old integer form, is ignored | A broken ledger can only tighten the check. The ledger was regenerated from the fleet in the new form: the same 54 keys and the same line counts as before. |
| Review fix: the hub compiled-routing directive moved into the final MACHINE ROUTER section | Excluding blockquotes from the count would let any prose hide in one. `validate_skill_package.py` finds the directive markers anywhere, so moving it costs nothing and frees five SMART ROUTING lines. |
| Review fix: the ledger path is added to the drift workflow filters explicitly | The existing `sk-create-skill/scripts/**` filter already matched it, so the finding's "omitted" was not accurate for triggering. The explicit line and the new ratchet step make the intent visible; the step is what actually enforces it. |
| Review fix: a timestamp-only skill-graph export was not kept | The export changed only `generated_at`, because no SKILL.md changed, so the file was restored to HEAD. Hermes sync wrote 0 copies and every compiled route stayed fresh for the same reason. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Every worker was DeepSeek through Devin, not half on Codex Terra.** The first three Terra dispatches failed at once with a ChatGPT usage limit until 12:53, and the Luna fallback hit the same limit. They were rerun on Devin, and the coordinator then directed DeepSeek only.
2. **Files outside the spec's Files to Change:** `.skilled/commands/doctor/scripts/parent-skill-check.cjs` and its new test, which REQ-005 names as the parent check; `.skilled/skills/sk-doc/scripts/tests/test_routing_shape.py`, where package_skill's tests live; and `sk-code/sk-code-ci/SKILL.md` and its changelog, the proof packet.
3. **A defect fixed outside the shape work.** The fresh parent scaffold failed parent-skill-check 3j before this phase (quoted `allowed-tools`), which blocked AC-004. The fix is in `init_skill.py`.
4. **Review-fix pass, files outside Files to Change:** `.github/workflows/routing-registry-drift.yml` (not a protected workflow) gained the ratchet step and the explicit ledger filter; `sk-create-skill/scripts/tests/` gained `create-skill-completion-gate.test.cjs`, `routing-shape-known-debt-ratchet.test.cjs` and the frozen snapshot fixture; `scratch/gates.sh` is a repo-relative copy of the gate runner, so the evidence names a command rather than a log location outside the repository.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Full gate set (`scratch/gates.sh`) | Every gate exit 0, identical results to `baseline.md`, after both passes; routing accuracy 155/195, 49/66, 19/24 |
| sk-doc Python tests | 247 to 256 passed, then 266 after the review fixes |
| parent-skill-check tests | 112 to 113 passed; still 113 after the review fixes |
| sk-create-skill node tests | 70/71 to 71/71, then 76/76 after the review fixes |
| Fresh standalone DQI | 70 (it fell to 66 in the first pass, on the unnumbered appendix heading) |
| New tests against HEAD code | fail (9 errors; fail 1); against the new code, pass |
| Old-shape fixtures | HEAD checks pass them; new checks reject them with RS-001, RS-002 and RS-004 |
| Fresh scaffolds | package_skill --strict and parent-skill-check pass once the TODO description is filled |
| Comment hygiene on changed code | exit 0 |

Detail: `scratch/after.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **54 skills are known debt**, including all seven hub roots except mcp-tooling. Phases 005 to 009 remove entries as they migrate.
2. **sk-code-review fails package_skill --strict on word count** (5,676 of 5,000), before and after. The routing check never reaches it, because the size check returns first. Phase 005 owns it.
3. **No live `/create:skill` or `/create:skill-parent` run was made.** AC-004 rests on running the scaffolder, the template and the checks directly. The skill flow's blocking gate now runs `validate_skill_package.py --strict`; the first pass left it non-strict, which downgraded RS findings to warnings.
4. **sk-code-skilled still has the old `## 2b. SMART ROUTING (machine-readable)` shape.** It is listed as debt, for phase 005.
<!-- /ANCHOR:limitations -->
