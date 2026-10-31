---
title: "Implementation Summary"
description: "Completed. This phase moved the seven hubs' MACHINE ROUTER prose from SKILL.md into a named section of each root ROUTER.md, left one pointer line behind and proved the move with an identical replay capture."
trigger_phrases:
  - "hub router merge implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/004-hub-router-merge"
    last_updated_at: "2026-10-29T13:50:00Z"
    last_updated_by: "pi"
    recent_action: "Recorded the delivered hub router merge"
    next_safe_action: "Commit the phase, then open phase 005 for the remaining 47 skills"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/SKILL.md"
      - ".skilled/skills/sk-doc/ROUTER.md"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-hub-router-merge |
| **Completed** | 2026-10-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Each of the seven parent hubs now keeps its routing prose in one place. SMART ROUTING ends with a single pointer line, which reads: Run the compiled-routing directive in `ROUTER.md` before selecting hub resources. The prose that used to sit under a MACHINE ROUTER heading in SKILL.md moved to the bottom of the sibling ROUTER.md. Nothing else about routing changed: the stage-two machine block stays where it was, remains the only replay source, and every hub returns the same route it returned before the move.

### Phase 4: hub-router-merge

The section that moved deleted 42 to 114 lines from each SKILL.md and added 41 to 113 lines to each ROUTER.md. Each ROUTER.md also deletes its old version line as it appends the moved prose. Self-references inside the moved prose were rebased to the new file, so `cli-classifier` and `cli-external-orchestration` now say stage two lives in section 3 of this file, the two lines of `sk-design`'s SKILL.md that named section 6 now name section 5 of `ROUTER.md`, and the contributor checklist in `system-deep-loop/README.md` points at the MACHINE ROUTER section of ROUTER.md.

Two hubs needed a compiler change before they would build again. `sk-code` and `sk-design` read the fallback checklist from SKILL.md alone, so the move left them failing with `FALLBACK_CHECKLIST_MISSING`; both now read it from the ROUTER.md machine section when it is present. Two compiled-route tests built their `sk-code` fixture from SKILL.md alone for the same reason and now include ROUTER.md.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-classifier/SKILL.md` and the six other hub SKILL.md files | Modified | SMART ROUTING ends with the pointer line, the MACHINE ROUTER section is gone, the edition is raised |
| `.skilled/skills/cli-classifier/ROUTER.md` and the six other hub ROUTER.md files | Modified | The moved prose is appended under `## 5. MACHINE ROUTER`, or `## 11. MACHINE ROUTER` in `sk-code`, with 1 deleted version line on every file |
| `description.json`, `hub-router.json` and `mode-registry.json` in the seven hub roots | Modified | Edition parity: `0.8.6.0`, `1.7.12.0`, `1.9.3.0`, `3.9.24.0`, `2.0.10.0`, `2.3.32.0` and `1.6.20.0` |
| `changelog/v<edition>.md` under the seven hub roots | Created | One release note per hub |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs` and `.../009-sk-design/lib/registry-compiler.cjs`, with their authored mirrors under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/` | Modified | Read the fallback checklist from the ROUTER.md machine section and hash ROUTER.md |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs`, `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Modified | Build the `sk-code` fixture from ROUTER.md and list it among the hashed inputs |
| `.skilled/bin/tests/quality-declaration.test.cjs`, `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate-runner-units.test.cjs` | Modified | Compile `sk-code` with the ROUTER.md machine section, and assert the heading exists before slicing |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` | Modified | Rewrite relative prose links in the ROUTER.md copy, keeping fences and inline code byte-identical |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes-router.vitest.ts` | Created | Fixture proof that router prose links resolve from the copy and the maps stay identical |
| `manual-testing-playbook/manual-testing-playbook.md` in `sk-doc` and `cli-external-orchestration`, `feature-catalog/compiled-routing-and-legacy-fallback/` in four hubs | Modified | Name `ROUTER.md` as the home of the machine router and the directive |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/` and its authored copy under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/` | Modified | Refreshed manifests for the new SKILL.md bytes, fourteen files |
| `.hermes/skills/` under the seven hub folder names | Modified | Regenerated SKILL.md and ROUTER.md copies, fourteen files |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json` and `scripts/tests/fixtures/routing-shape-known-debt-frozen.json` | Modified | The seven hub entries were stale, so both ledgers drop from 54 entries to 47 |
| `scratch/replay-before.txt`, `replay-after.txt`, `routes-before.txt`, `routes-after.txt`, `machine-sections-before.txt`, `machine-sections-after.txt` | Created | Before and after evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The run captured first: the replay lines, one compiled route per hub and the sha256 of each ROUTER.md machine section, all three written to `scratch/` before any edit. The seven hubs were then moved one at a time, each verified by two greps for the pointer line and the absence of the old heading plus one grep for the new heading in ROUTER.md. Editions and their three JSON carriers were raised in the same pass, with one changelog entry per hub. Two hubs and two tests then failed to compile, and the compiler fix came before the recaptures rather than after. The recaptures ran at the end: all three `diff` runs print nothing, and a fresh replay run reproduces its capture byte for byte. The derived files were regenerated last, and the seven stale known-debt entries were removed from both ledgers once `package_skill.py --check --strict` named them.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Name the appended section `MACHINE ROUTER`, not `MACHINE ROUTER NOTES` as the plan and the first task draft wrote | The parent-skill root-router template that phase 003 shipped names its section `## 6. MACHINE ROUTER`, and the shared resolver finds a machine router by that exact heading, so a differently named section would not be found |
| Read the fallback checklist from the ROUTER.md machine section in the `sk-code` and `sk-design` compilers instead of leaving it in SKILL.md | Both hubs stopped compiling with `FALLBACK_CHECKLIST_MISSING` once their SKILL.md no longer held the section, and keeping a second copy in SKILL.md would have defeated the one prose home this phase is for |
| Append the moved prose as a final numbered section instead of placing it beside the machine block | Appending keeps every existing section number, and `sk-code`'s own prose cites `ROUTER.md` section 9 |
| Replace the SMART ROUTING sentence that points at the removed section with one pointer line | Every hub already carries that sentence, and it is the line a reader reads before routing, so no new heading is needed |
| Rewrite links in the Hermes copy of ROUTER.md instead of keeping it verbatim | The moved prose carries relative links that resolve only from the canonical folder, and no tool reads the copy's prose as data; fences and inline code are copied byte for byte, so every map a parser reads is unchanged |
| Leave the machine block untouched | The declaration is the only replay source, and a second `INTENT_SIGNALS = {` line would make the parser read the wrong block |
| Capture the baseline after phases 002 and 003 land | Phase 002 changes which file the replay reads, so a baseline taken on the current tree would compare two different readers |
| Compare route decisions but not policy hashes | The compiler hashes the SKILL.md bytes, so the hash has to change when SKILL.md changes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Replay capture diff | `diff` prints nothing. Both captures read `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`, and a fresh run reproduces the capture |
| Compiled route diff for seven hubs | `diff` prints nothing. Every hub keeps `action=route`, `selectionKind=single` and one target |
| Machine-section hash diff | `diff` prints nothing. Seven matching sha256 hashes, for example `sk-code 37d20b4b...` and `sk-doc b4117881...` |
| `compiled-route-guard.cjs` | Seven `fresh` lines and `All hubs fresh or excused: serving matches inputs, and the runtime matches its source`, exit 0 |
| `compiled-route-sync.cjs --check` | `all 55 served copies match their authored files`, exit 0 |
| `compiled-route-admission.cjs --all --warn-only` | `Every hub passes the admission check`, 4, 7, 15, 14, 4, 24 and 20 passing routes, 0 drift |
| Seven per-hub checks | `OK: parent-skill-check` with `all hard invariants passed, 0 warnings` on all seven |
| `package_skill.py --check --strict` | `Result: PASS` on all seven, which named the stale known-debt entries that were then removed |
| Routing suites | `290 passed` under pytest, and 1, 22, 1, 4, 48 and 13 passing with 0 failing under `node --test` |
| Hermes copies | `PASS: 65 Hermes skill copies in sync` |
| Remaining `sk-code` compiler tests and the Hermes router test | pass 8 and 11 with 0 failing under `node --test`, and 2 of 2 under vitest |
| Spec validation | `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The remaining 47 skills and modes are phase 005's.** They stay on the old routing shape, in batches behind the debt ledger, which read 47 entries at commit `1af3e7aa58` after this phase's seven were removed.
2. **The leaf replay does not score the `sk-code` surface slice.** Its line reads `hub=sk-code gold=8 unscored=8 surface slice not replayed`, as it did before this phase, so the move is proved on the other six hubs' rows.
3. **The replay's prose arm covers 0 of 56 rows.** Its verdict line reads `prose arm covers 0 of 56 rows`, so the proof here is that routing behavior did not change, not a prose score.
<!-- /ANCHOR:limitations -->

---
