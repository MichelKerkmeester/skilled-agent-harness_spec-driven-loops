---
title: "Implementation Summary: utilization-review"
description: "All eleven create-frontmatter playbook scenarios were executed for the first time and all passed, while six of eight realistic newcomer prompts reached the mode not at all. Four documentation defects were fixed and two were written up."
trigger_phrases:
  - "frontmatter playbook execution results"
  - "frontmatter mode reachability measurement"
  - "numstat inflation remeasured"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/008-utilization-review"
    last_updated_at: "2026-09-02T18:55:24Z"
    last_updated_by: "implementation"
    recent_action: "Closed the five open goal items and re-minted the hub activation manifests"
    next_safe_action: "Review the packet for closure"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-utilization-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-utilization-review |
| **Status** | Complete |
| **Completed** | 2026-09-02 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The mode answers well and is almost never reached. Every one of the eleven playbook scenarios
passed on its first execution, including a negative control proving the gate actually reads what
the scenario authored. Then six of eight prompts a real person would type returned no
recommendation at all, and two routed to the wrong hub. A contract nobody arrives at is a contract
nobody uses, whatever its quality.

Four defects surfaced along the way and were fixed. Two more were written up because they sit in
files this phase was told not to edit.

### What the playbook run showed

Running the scenarios is what turned the mode's claims into observations. Two of its own documented
figures did not survive that: the edit-count inflation the standard puts at three to five times
measures 1.06 to 1.09 times across 1,214 documents, and the rule that spec documents use inline
metadata instead of frontmatter is contradicted by the validator, which fails a spec document whose
block is missing. Both are now corrected against a measurement rather than an estimate.

### What the routing measurement showed

The mode is reachable by keyword and not by description. `frontmatter block` routes at 0.6655.
`what frontmatter does it need` returns nothing. Adding the word `frontmatter` back to a natural
sentence does not rescue it, so this is dilution rather than missing vocabulary, and it is the
structural cause the routing pass left untouched by its own account.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/frontmatter-templates.md` | Modified | Moved the `version` blockquote below the class table so all eight rows render as one table, and corrected the spec-document rule at nine sites |
| `references/frontmatter-versioning.md` | Modified | Replaced the 3-5x inflation estimate with the figure measured over 1,214 documents |
| `README.md` | Modified | Same correction, and dropped the `1.5.0.19` worked case that no longer reproduces |
| `manual-testing-playbook/manual-testing-playbook.md` | Modified | Same correction in the silent-failures list and the FMV-002 summary |
| `manual-testing-playbook/version-derivation/numstat-gate.md` | Modified | Graded FMV-002 on producing both counts rather than on the size of the gap |
| `manual-testing-playbook/version-derivation/idempotent-rerun.md` | Modified | Corrected the FMV-004 expectation that `verify` reports every file as already correct |

A second pass then carried out the two written-up items and three more the goal named:

| File | Action | Purpose |
|------|--------|---------|
| `sk-doc/graph-metadata.json` | Modified | Added the eight dead aliases to `intent_signals` and `derived.trigger_phrases` |
| `sk-create-frontmatter/SKILL.md` | Modified | Replaced the three-to-five-times claim with the measured figure and its corpus |
| `sk-doc/shared/scripts/frontmatter-version.mjs` | Modified | `parseArgs` recognises `--help` and `-h` from any position, before the mode is derived |
| `sk-doc/scripts/tests/test-frontmatter-version.mjs` | Modified | Two cases covering the lone `--help`, which no test reached |
| `assets/fixtures/README.md`, `over-budget-description.md`, `under-budget-trim-lost-tokens.md` | Added | The fixed inputs for `FMB-001` and `FMB-002` |
| `manual-testing-playbook/description-budget/*.md`, `manual-testing-playbook.md` | Modified | Both scenarios name their fixture in the prompt, the commands and the anchors |
| `sk-doc/leaf-manifest.json` | Regenerated | Picks up the three fixture leaves |
| `sk-doc/ROUTER.md` | Modified | The three fixtures in `FULL_INVENTORY`, matching how `sk-create-diff` routes its own |
| `assets/frontmatter-templates.md` | Modified | Feature catalog, testing playbook and agent in the section 1, 2 and 10 index tables |
| `013-live-activation/activation/sk-doc/manifest.json` (runtime and authored) | Re-minted | The `SKILL.md` edit is a compiled-routing input, so both manifests moved to `60f98f69...` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every scenario was executed as written, in playbook order: field and class resolution first,
description budget second, version derivation last. Nothing was graded from reading. `FMC-001`
authored a real temporary document and proved the gate reads it by deleting a required field and
watching the gate fail, then restoring and cleaning up. `FMV-004`'s byte-level assertion was proved
by hashing all 390 in-scope documents before and after the run rather than by `git status`, because
a concurrent session was editing unrelated files under the same tree.

Routing was measured through the advisor CLI, with `freshness: live` confirmed on every response, so
an empty recommendation list means the prompt matched nothing rather than that the advisor was cold.

### 3. Scenario outcomes

| ID | Scenario | Outcome | Evidence |
|----|----------|---------|----------|
| FMC-001 | Author a reference block | PASS | Draft authored from the class template, `package_skill.py --check --strict` exit 0 `Result: PASS`. A negative control removing `contextType` gave exit 1 and named the field. Draft deleted, target paths clean |
| FMC-002 | Class row before field row | PASS | Two classes named before any field compared, `allowed-tools` required for the manifest and absent from the five-field block, neither file wrong, gate exit 0 |
| FMC-003 | Out-of-scope class | PASS | Scope section read before format, the out-of-scope clause quoted with all three paths, no edit made, `git status --porcelain .opencode/commands` empty |
| FMB-001 | Trim an over-budget description | PASS | Soft target quoted as 130, four drop categories named, 545 to 125 characters, keep-list tokens preserved, and `quick_validate.py` exit 0 with its thresholds read from source at 130/110/1536 |
| FMB-002 | Trim that loses routing tokens | PASS | Trim rejected on the keep list rather than on length, missing skill-name token and mode suffixes named, replacement offered, validator silence not treated as approval |
| FMB-003 | Silent discovery drop | PASS | Per-skill target 130 separated from the project ceiling 5,600 against the 8,000 budget, drop identified as silent and selecting the longest entries, affected file not blamed, and `quick_validate.py` exit 0 as the negative control |
| FMV-001 | Changelog-anchored derivation | PASS | Both anchor inputs read, `SKILL.md` 1.0.0.0 and changelog `v1.0.0.0.md`, compared as integer tuples with the child rule applied, and the engine agreed across 390 documents |
| FMV-002 | Numstat gate | PASS | Ungated 35 against gated 29 for the templates asset, gap named, engine independently derived 1.0.0.29. The documented 3-5x magnitude did not reproduce and was corrected |
| FMV-003 | Skip on differ | PASS | `verify` run read-only, 29 conflicts named with both values, nothing written, update flag described and not used |
| FMV-004 | Idempotent rerun | PASS | All 390 in-scope documents hashed before and after: `d081e28b7e3cc0070b70b1d59c9b4294bf11a2f0695066f346cd4ddf10eaa5bd` both times. The scenario's own expectation was wrong and was corrected |
| FMV-005 | No frontmatter is skipped | PASS | `check-frontmatter-versions.sh --skill sk-doc` exit 0, `ok=389 skip-no-frontmatter=1`, skipped file named as `sk-create-diff/references/README.md`, skip explained as intended, nothing written |

### 4. Routing measurement

Eight realistic prompts, none of them a restated keyword:

| Prompt intent | Result |
|---------------|--------|
| New reference doc, what goes at the top | no recommendation |
| Neighbour file lacks the field the validator demands | no recommendation |
| What number goes at the top of a new doc | no recommendation |
| Blurb is 500 characters and something warns | no recommendation |
| Skill stopped appearing but still runs when named | no recommendation |
| How many times has this file really been edited | no recommendation |
| Add the version line to a command file | `sk-code`, wrong hub |
| Safe to re-run the versioning pass | `sk-code` at floor confidence, no target packet |

Seventeen declared keyword triggers: seven resolve on a declared signal, two resolve incidentally at
the 0.8200 floor with scores near 0.2 and no compiled route, and eight return nothing. The eight are
`frontmatter template`, `frontmatter fields`, `trigger_phrases`, `importance_tier`, `contextType`,
`X.Y.Z.W`, `missing frontmatter` and `frontmatter contract`. Exactly those eight are absent from
`sk-doc/graph-metadata.json`, and the seven that resolve are present in it, so the mechanism is the
hub metadata rather than the manifest line.

### 5. Tool behavior

`gate --skill sk-doc` exits 0 over 390 files with one skip, and is the enforced check. `verify` exits
1 with 29 mismatches on that same clean tree, because writing a version is itself an edit. Both facts
match what the reference already says. A lone `--help` is read as the mode name: scoped, it prints
`Unknown mode: --help` and exits 64, and unscoped it walks git history for more than two minutes
before it does so. The engine lives in `sk-doc/shared/scripts/`, and the mode's own manifest places
enforcement in the shared tier, so this defect is not this mode's to fix.

### 6. Template conformance

One real document of each newly added class, checked against its template: `sk-create-changelog/README.md`
and this packet's own README for the readme class, the playbook root and a scenario leaf for the
testing-playbook class, `mcp-aside-devtools` catalog root and leaf for the catalog class, and an
agent file from both `.opencode/agents/` and `.claude/agents/`. All eight carry every field their
template requires, and every extra key they carry is one the template already documents as optional.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Correct the spec-document rule at all nine sites rather than the two most visible | One rule stated nine times is one change, not nine adjacent ones, and leaving seven wrong would keep the reference misleading |
| Prove the `--help` defect and hand it on rather than fix it | The mode states that enforcement lives in the shared tier because a hook outside the hub resolves it by path, so the engine is not this mode's to edit |
| Measure the inflation figure over two skills before rewriting it | Rewriting a documented number on one file's evidence would replace one estimate with another |
| Hash the corpus instead of reading `git status` for FMV-004 | A concurrent session was editing unrelated files under the same tree, so the status output could not be attributed to the run |
| Leave the pre-existing human-voice blockers alone | 18 in the reference and 36 in the asset predate this phase, and a voice sweep is a different piece of work |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate-playbook-package.cjs --package .../manual-testing-playbook` | PASS, exit 0, `scenarios=11 categories=3 operator=11 violations=0 warnings=0` |
| `package_skill.py .../sk-create-frontmatter --check --strict` | PASS, exit 0 |
| `quick_validate.py .../sk-create-frontmatter` | PASS, exit 0 |
| `validate_document.py` on all six modified files | PASS, exit 0 on each |
| `hvr_scan.py` on all six modified files, `--include-code` for the asset | PASS, no file gained a hard blocker against its committed baseline, at deltas 0, 0, 0, 0, 0 and -1 |
| `validate.sh <this phase> --strict` | See the closing run recorded against AC-012 |
| `test-frontmatter-version.mjs` | PASS, exit 0, 23 passed 0 failed (21 before) |
| `parent-skill-check.cjs .opencode/skills/sk-doc` | PASS, exit 0, all hard invariants, 0 warnings |
| `compiled-route-guard.cjs` | PASS, exit 0, all five hubs fresh |
| `compiled-route-sync.cjs --verify` | PASS, exit 0, `move-simulation OK: all 5 hubs resolve; 0 reads under .opencode/specs` |
| `frontmatter-version.mjs gate --skill sk-doc` | PASS, exit 0, `393 files | ok=392 skip-no-frontmatter=1` |
| `hvr_scan.py` on the nine files this pass wrote | No file gained a blocker: `ROUTER.md` 25 to 25, `frontmatter-templates.md` 36 to 36, the other seven at 0 |
| `validate-canary.cjs` | PASS, exit 0, `"status":"REAL-GREEN"`, 23 of 23 route-gold rows |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Reachability from natural language is better, not solved.** Every declared trigger now resolves
   and two of three realistic prompts moved, but the dilution effect behind the rest is a scorer
   property that vocabulary does not fix.
2. **The canary re-pin captured a second packet's bytes.** Unavoidable, since the digest set refreshes
   as a whole. Those bytes are committed at `HEAD`, so the pin attests a real state.
3. **The four aliases at the 0.82 floor sit on the threshold.** They resolve, but with no margin, so a
   scorer change could drop them again without anything else moving.
4. **The inflation figure is measured on two skills, not the whole fleet.** The corrected text names
   the corpus and the date, so a later measurement can extend it rather than contradict it.
5. **The fixtures carry their subject in a fenced block rather than in their own frontmatter.** A
   fixture whose own block broke the rule would read as a live defect to the versioning engine and to
   every document validator, none of which can tell a deliberate fixture from a mistake.
6. **`validate_document.py` misclassifies spec-folder documents.** Left alone, it types them as
   general, then blocks them for carrying anchor comments and for having no overview section. The
   spec-kit templates require those anchors and `validate.sh` checks them, so the two tools
   disagree and the spec gate is the authority. Passing `--type spec` resolves it and all five
   documents here exit 0 that way. The auto-detection lives in a `sk-doc` script outside this
   packet, so it is recorded rather than changed.

---

## 7. THE FOLLOW-UP PASS

**The hub routing gap is closed at stage one.** The eight aliases are in `sk-doc/graph-metadata.json`.
Stage two already carried all eight, in `hub-router.json`, `mode-registry.json` and `ROUTER.md:170`, so
the repair was one file. Measured on the same eleven prompts before and after:

| Prompt | Before | After |
|---|---|---|
| `frontmatter template` | nothing | `sk-doc` 0.8828 |
| `frontmatter fields` | nothing | `sk-doc` 0.8777 |
| `missing frontmatter` | nothing | `sk-doc` 0.8777 |
| `frontmatter contract` | nothing | `sk-doc` 0.8777 |
| `trigger_phrases`, `importance_tier`, `contextType`, `X.Y.Z.W` | nothing | `sk-doc` 0.82, the floor |
| `what frontmatter fields does this reference doc need` | nothing | `sk-doc` 0.8926 |
| `the validator says this file is missing frontmatter, what goes at the top` | nothing | `sk-doc` 0.82 |
| `which importance_tier and contextType should I set for a new skill reference` | `sk-doc` 0.82 | `sk-doc` 0.9121 |

Two of the three realistic prompts moved from nothing to the hub, which is more than the write-up
expected. Four out-of-domain phrases were replayed against the new aliases: `commit and push my branch`
and `review this webflow animation for jank` are unaffected, `add a contextType field to the TypeScript
config interface` goes to `sk-code`, and `write a parser for X.Y.Z.W semver strings in rust` is captured
by `sk-doc` at 0.9006. That last one is a real capture, kept because the token is repo-specific and the
directive names it.

**The `--help` defect is fixed at the cause.** `parseArgs` now scans argv for `--help` or `-h` before the
mode is derived, so the flag can no longer become a mode name. `--help`, `-h`, `--help --skill sk-vision`
and no arguments each print usage and exit 0 without a git pass. `bogus` still reaches `Unknown mode:
bogus` at exit 64 after discovery, unchanged. The engine's test file gained the two cases that would
have caught it: 23 passed, 0 failed, against 21 before.

**The compiled-routing sequence went with the `SKILL.md` edit, not the alias edit.** The sk-doc policy
pins eighteen source hashes and `graph-metadata.json` is not one of them. The pinned set is the hub
`SKILL.md`, its `hub-router.json`, its `mode-registry.json` and each packet `SKILL.md`. The alias edit left the
guard fresh. The `SKILL.md` correction turned it to `stale-manifest`, which was the negative control for
the refresh. Both the runtime and the authored activation manifests were re-minted to
`60f98f69b2245f6203fd5b0ac5ec02f24b093048ddc62fc3a506048edd53f922` and the guard reads all five hubs
fresh. The promote and finalize legs were not run, because no closure file changed and the guard already
reports the runtime matching its authored source.

**The canary digest was re-pinned, second.** `009-parent-hub-rollout/007-sk-doc/harness/validate-canary.cjs`
pins the same eighteen source hashes in `AUTHORED_DIGESTS`, and it was red on two of them. One was this
work's `sk-create-frontmatter/SKILL.md`. The other was `sk-create-with-human-voice/SKILL.md`, drifted by a
concurrent session, which means the canary was already red before this pass began. The set refreshes as a
whole, so the re-pin waited until that session committed, which it did during this one. `build-artifacts.cjs`
then regenerated the six compiled and activation artifacts and both values were updated in a single pass.
`validate-canary.cjs` returns `"status":"REAL-GREEN"` at exit 0, with 23 of 23 route-gold rows real-green.
ADR-001 records the sequencing.

<!-- /ANCHOR:limitations -->

---


