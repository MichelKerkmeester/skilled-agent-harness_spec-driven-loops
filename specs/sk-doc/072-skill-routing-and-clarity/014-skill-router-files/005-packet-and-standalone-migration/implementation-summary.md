---
title: "Implementation Summary"
description: "Completed. This phase moved the machine router of 41 mode packets and six standalone skills into a sibling ROUTER.md each, left short SMART ROUTING prose and one pointer line behind, emptied the debt ledger and kept every parser, replay and policy output at its baseline."
trigger_phrases:
  - "packet and standalone migration implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/005-packet-and-standalone-migration"
    last_updated_at: "2026-10-29T14:15:00Z"
    last_updated_by: "pi"
    recent_action: "Recorded the delivered packet and standalone migration"
    next_safe_action: "Commit the packet docs, then open phase 006"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs"
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs"
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
| **Spec Folder** | 005-packet-and-standalone-migration |
| **Completed** | 2026-10-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 47 remaining skills now keep their machine router beside them instead of inside them. Each of the 41 mode packets and the six standalone skills owns a sibling `ROUTER.md` with `router_state: active` and `skill_pointer: SKILL.md`, holding an overview, an intent model and a final `## 3. MACHINE ROUTER` section that carries the body the old section carried. Each `SKILL.md` keeps short SMART ROUTING prose and ends with one line that links to the sibling file, and no `SKILL.md` in the tree holds a MACHINE ROUTER heading any more.

The routing is untouched, and that is measured rather than asserted. `parseRouter` in `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` returns identical output for all 47 skills against `main`, 47 same and 0 different. The leaf replay prints the baseline total, `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`. The stripped compiled policy of all seven hubs diffs by 0 lines, and the alignment scan reports `Findings: 0`.

What a skill load carries fell by 34,272 words, from 160,204 to 125,932 across the 47, which is 21.4 percent or about 45,600 tokens. That text now loads only when a request reaches the router. Both debt ledgers held exactly these 47 skills when the phase started and hold 0 entries now.

### Phase 5: packet-and-standalone-migration

The move itself was mechanical and the passage was not. Once the routers became active `ROUTER.md` files, the parent-skill check inspected them for the first time and failed 11 of them on authoring that was deliberate, so the contract learned three rules for non-hub routers instead of the files being rewritten to suit it. A pattern sweep then found 627 lines across 151 documents that still said the router lives in `SKILL.md`, and those were corrected. A commit hook defect surfaced while landing the work and was fixed separately, because a version the doc-version gate raised was changing bytes that two regeneration gates had already approved.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/**/ROUTER.md` (47 files, one beside each moved `SKILL.md`) | Created | Frontmatter with `router_state: active` and `skill_pointer: SKILL.md`, then `## 1. OVERVIEW`, `## 2. INTENT MODEL` and a final `## 3. MACHINE ROUTER` |
| The same 47 `SKILL.md` files | Modified | SMART ROUTING ends with the pointer line, the edition is raised and the work carries one changelog entry |
| `changelog/v<edition>.md` under the same 47 folders | Created | One release note per skill, each reported with 0 issues by `validate_document.py` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json` and `scripts/tests/fixtures/routing-shape-known-debt-frozen.json` | Modified | Both ledgers drop from the 47 moved skills to 0 entries |
| `.hermes/skills/*/SKILL.md` and `.hermes/skills/*/ROUTER.md` (94 files) | Modified/Created | Regenerated copies of the 47 changed pairs |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/*/manifest.json` (8 files) | Modified | Manifests re-minted for the new `SKILL.md` bytes |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modified | Passes a `resolveInOwnRoot` probe so a declared root resource resolves in the router's own folder and never falls back to the hub |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` and `scripts/tests/root-router-contract.test.cjs` | Modified | `NO_LOAD_INTENTS`, the own-root `ROOT_RESOURCES` rule and the `INTENT_SIGNALS`/`INTENT_MODEL` mirror rule, with six new cases |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/overview.md`, `assets/skill/skill-md-template.md` and its own `SKILL.md` | Modified | Four canon lines now place the router in `ROUTER.md`: the routing-authority paragraph, the checklist line, the `RS-003` row and rule 21 |
| 146 manual testing playbooks, feature catalogs, references and assets under `.skilled/skills` | Modified | Each sentence that placed the router inside `SKILL.md` now names `ROUTER.md` |
| `.skilled/scripts/git-hooks/pre-commit` and `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modified | The doc-version raise runs before mirror parity and the route re-mint, and a case pins that order |
| `scratch/router-replay-baseline.txt`, `scratch/router-replay-after.txt`, `scratch/router-token-after.csv` | Created | The replay before and after, and one token row per skill with a before, an after, a saved and a router word column plus a `TOTAL` row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The plan called for five batches with a seven-leg gate after each and a commit per batch. The work ran as two waves of parallel workers instead: 20 skills, then 27. Every skill passed the same per-skill checks inside its wave, counting the absence of the old heading, the presence of the pointer line, the sibling router's shape and its strict package check, and one full gate ran on the final tree. The trade is recorded in Key Decisions and Known Limitations: the per-batch evidence files do not exist, and the final-state run stands in for them.

The move then exposed work the plan had not foreseen, in the order it appeared. Active routers made the parent-skill check read them, which failed 11 and produced the three contract rules. A sweep for stale prose produced 151 documents to correct. Landing the result produced a hook defect, which was fixed and committed on its own before the move, so the move commit landed on a gate that could not ship a stale copy. The final run then took the whole set of measurements once, on the tree that is there now.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run two waves of parallel workers instead of five gated batches with a commit each | The per-skill checks catch what a batch would catch, and 47 mechanical moves do not need 47 sequential gate runs; the cost is that `scratch/batch-01.txt` to `scratch/batch-05.txt` do not exist and the cumulative batch counts in the plan were never captured |
| Teach the contract `NO_LOAD_INTENTS` rather than rewrite the signal-only intents | Five `cli-*` runners declare a DESIGN intent and `cli-pi` a CLASSIFIER intent that load nothing, and an empty SCALES list sits in `sk-design-fundamentals`; rewriting that content would have changed what `parseRouter` returns, which is the one thing this phase must not do |
| Resolve a declared `ROOT_RESOURCES` file in the router's own folder only | `mcp-click-up` routes to `INSTALL-GUIDE.md` beside its router, and a resolver that fell back to the hub would have accepted a path that points at the wrong file |
| Hold two intent maps to an exact mirror | `mcp-figma`, `mcp-mobbin` and `mcp-refero` keep a commented `INTENT_SIGNALS` beside `INTENT_MODEL`; two maps are one map only when their keys and keywords agree, so the check compares them rather than banning the pair |
| Keep three moved bodies as reviewed near-copies, not verbatim copies | `sk-code-review` keeps its "Related skills" line in `SKILL.md` because it is not router content, and `sk-design-diagram` and `sk-design-fundamentals` drop one self-reference line that reads as false inside `ROUTER.md`; all three were reviewed and none touches the declarations a parser reads |
| Sweep every document that named `SKILL.md` as the router's home | A reader who follows a playbook to the old section finds nothing and re-reads the whole skill, which is the cost this phase removes; 627 candidate lines in 151 files were rewritten per packet and 27 remaining hits were reviewed as correct |
| Move the doc-version raise above the mirror-parity and re-mint gates | A version raised in `ROUTER.md` after those gates changed bytes they had already approved, so the commit shipped a stale Hermes copy and a stale manifest and the pre-push guard refused it |
| Commit the hook fix separately from the move | The hook defect was a toolchain fault, not a migration step; kept apart, it can be reviewed and reverted on its own, and the move commit then lands on a gate that holds |
| Count tokens from the moved heading | A frontmatter block in `ROUTER.md` cannot move the number that way, so the figure stays comparable with the CSV |
| Move the file before deleting the ledger entry | The entry is the only tolerance the skill has between the phase 003 rule change and the move, so removing it first would reopen the old shape with no gate on it |
| Read name lists and intent maps the way the runtime reads them | A commented-out name, an apostrophe in a comment or a declaration quoted in prose is not something the router runs, so the check strips comments outside quotes and reads name lists from fenced code only |
| Keep the map-less relaxation for non-hub routers | Seven `sk-doc` mode routers declare an intent map and route through their own tables with no `RESOURCE_MAP`; requiring one would change their content and their parse |
| Leave the seven hubs untouched | Phase 004 owns them; no hub `SKILL.md` and no hub `ROUTER.md` changed, and the eight re-minted activation manifests live under the compiled-routing tree |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| MACHINE ROUTER headings left in `SKILL.md` | 0 across `.skilled/skills` |
| `ROUTER.md` count | 54, one beside each `SKILL.md`, and all 47 moved routers carry `router_state: active`, `skill_pointer: SKILL.md`, `## 1. OVERVIEW`, `## 2. INTENT MODEL` and a final `## 3. MACHINE ROUTER` |
| Pointer line | 47 `SKILL.md` files carry `before selecting skill-local resources`, and each prints 0 for `MACHINE ROUTER` |
| Parsed routers against `main` | 47 same, 0 different, through `parseRouter` in `router-replay-lib.cjs` |
| Replay | `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`, and `scratch/router-replay-after.txt` equals `scratch/router-replay-baseline.txt` byte for byte |
| Compiled policy of the seven hubs | Stripped of source hashes, 0 lines of diff against `main` |
| Alignment drift | `verify_alignment_drift.py --root .skilled/skills --check-router` scans 5,426 files and prints `Findings: 0`, `Errors: 0`, `Warnings: 0`, `Violations: 0` |
| `package_skill.py --check --strict` | `Result: PASS` on all 54 skill folders, 0 failing |
| Debt ledgers | Both print 0 entries, and the ratchet prints pass 4 fail 0 |
| Seven per-hub checks | `OK: parent-skill-check` with `all hard invariants passed, 0 warnings` on all seven, and a hub that declares `NO_LOAD_INTENTS` still fails |
| Router contract suite | `all positive and negative fixtures passed`, pass 1 fail 0, with six cases covering the three new rules and two covering comments and prose, each of those two failing on the committed parser |
| Review fixes | The fixed `sk-code-review` snippets print their Expected output, including the two-stage security scenario that had failed with `FALLBACK_CHECKLIST_MISSING` |
| Hermes copies | `PASS: 65 Hermes skill copies in sync` |
| Hook suite | `pre-commit gates: 153 passed, 0 failed`, including the case that fails if the doc-version raise moves below the two regeneration gates |
| Markdown links | `7631 files, 14219 links checked, 0 broken` |
| Changelog documents | Each of the 47 carries one entry that `validate_document.py` reports with `Total issues: 0` |
| Token result | `scratch/router-token-after.csv` totals 160,204 words before, 125,932 after, 34,272 saved, 54,675 router words; the `o200k_base` command over the 47 moved routers prints 84,640 |
| Spec validation | `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` |
| Goal check | `[check-goal] RESULT: PASSED (5/5 checks)` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The five gated batches became two waves, and the per-batch evidence is missing.** `scratch/batch-00.txt` to `scratch/batch-05.txt` do not exist, so the cumulative figures in the plan's batch table, 21 then 29 then 37 then 48 then 54 routers and 33 then 25 then 17 then 6 then 0 ledger entries and the five token sums, were never captured one batch at a time. The final-state gate covers every leg those files would have shown, but a reader cannot see the tree as it stood after batch 3.
2. **The token figures use an O200K proxy.** The authoritative tokenizer for gpt-6-luna is UNKNOWN, so this phase counts with installed tiktoken `o200k_base`. The measured router text is also larger than the plan projected: the same command that the batch table expected to print 82,439 prints 84,640 over the 47 moved routers, so the phase's saving is claimed from the measured `SKILL.md` word delta rather than from that projection. Phase 006 recaptures the token table with the authoritative tokenizer.
3. **Three moved bodies are reviewed near-copies.** `sk-code-review`, `sk-design-diagram` and `sk-design-fundamentals` do not hold a byte-identical copy of the section that left `SKILL.md`. The differences are one retained line and two dropped self-references, each reviewed, and none of them reaches a declaration a parser reads.
4. **The phase changed four surfaces its scope had excluded.** A check (`parent-skill-check.cjs` and `root-router-contract.cjs` with its test), a template row, the create-skill canon and the commit hook were pulled in by three findings. `AC-006` records the passage, and `T013` to `T015` record what each one was for.
5. **The replay's prose arm still covers 0 of 56 rows.** The after capture reads `replay verdict: stop (prose arm covers 0 of 56 rows)`, so the proof here is that parsed routing and the replay total did not change, not a prose score.
6. **The `sk-code` surface slice is not replayed.** Its line reads `hub=sk-code gold=8 unscored=8 surface slice not replayed`, as it did before the move, so the move is proved on the other rows.
7. **`system-spec-kit` still carries an advisory word warning.** Its `SKILL.md` prints one warning at 3,364 words against the 3,000 recommended maximum and still prints `Result: PASS`, because `--strict` does not promote that warning. The 5,000-word hard limit that blocked the three largest skills is cleared.
8. **A non-hub router may still declare an intent map without a `RESOURCE_MAP`.** Seven `sk-doc` mode routers rely on that shape, so the check cannot tell one of them from a router whose map was lost. A router that does declare `RESOURCE_MAP` is still checked key for key.
<!-- /ANCHOR:limitations -->

---
