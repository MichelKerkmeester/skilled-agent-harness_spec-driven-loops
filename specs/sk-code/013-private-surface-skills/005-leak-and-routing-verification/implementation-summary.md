---
title: "Implementation Summary"
description: "Read-only verification that the public repository carries no live trace of the removed Webflow and Obsidian surfaces and that the private skills still route for the operator."
trigger_phrases:
  - "leak and routing verification implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/005-leak-and-routing-verification"
    last_updated_at: "2026-10-24T22:30:00Z"
    last_updated_by: "template-author"
    recent_action: "Closed the phase: final-tip re-clone at 634c32b3c7 matched, 15 of 15 criteria Met"
    next_safe_action: "Check the parent goal criteria and run recursive strict validation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-leak-and-routing-verification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-leak-and-routing-verification |
| **Status** | Complete |
| **Planned** | 2026-10-23 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fresh clone of `origin/main` at `9129007915` holds no live path for either removed surface, and the private skills still rank second in the advisor for the operator. Fifteen evidence files record the commands and their output. Every check holds against the expectations as the operator amended them on 2026-10-24, and two independent review rounds found 25 defects in the evidence, all answered. A second fresh clone at the final tip `634c32b3c7`, taken after the evidence push and its trigger-index rebuild, printed the same values as the first, so all fifteen criteria are met.

### Phase 5: leak-and-routing-verification

You asked whether removing the Webflow and Obsidian surfaces from the public repository held. This phase answers with measured output and changes no code.

In the fresh clone, `git ls-files` outside `specs/` counts `0` paths for `local-webflow`, `local-obsidian`, `sk-code-webflow` and `sk-code-obsidian`. The same pattern counts `336` at the base commit `42b41dd286`, so the zero is a real drop. The content sweep finds 17 paths. Eight are the D6 kept records, six are test fixtures that name a private skill as a throwaway directory and three are regenerated retrieval artifacts. Every hit in those 17 paths is a name, a path string or a phrase key. No private skill body appears. The bare `WEBFLOW` and `OBSIDIAN` token count is `0` once the four platform-tag lines are filtered out.

Of the 225 unique private blob ids, 138 were already public through the base commit and 1 came from a copied hub reference. The other 86 are new or changed content, and none of them is reachable from the clone. A throwaway advisor database built from the clone reports 14 skills and no surface vocabulary. In the operator checkout the rebuilt graph reports 16 skills, with `local-webflow` and `local-obsidian` ranked second on their own prompts at confidence `0.82` and `0.8325`. The generic frontend prompt still ranks `sk-code` first. The plugin checkout resolves all eight runtime symlinks into this hub, so its probes repeat the same measurement and do not add an independent one.

Removed content stays in git history. The inventory records 1681 reachable objects, 157 remote tags and 30 hosted releases with no assets, and nothing was rewritten. That limit is listed below and is the operator's decision to take.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/evidence/00-preflight.md` | Created | Records the tool versions, the phase 001 to 004 commits and the baselines every later count is compared with |
| `scratch/evidence/01-head-leak-sweep.md` | Created | Sweeps tracked paths, tracked content and bare tokens in the operator checkout before the first push |
| `scratch/evidence/02-fresh-clone.md` | Created | Records the clone of `origin/main` that every later sweep reads |
| `scratch/evidence/03-fresh-clone-leak.md` | Created | Repeats the path, content and token sweeps in the clone and compares private blob identities with the public object database |
| `scratch/evidence/04-d6-kept-records.md` | Created | Audits the ten D6 out-of-scope prefixes for change since the removal commit |
| `scratch/evidence/05-advisor-db.md` | Created | Rebuilds a throwaway advisor database from the clone and queries it for surface vocabulary |
| `scratch/evidence/06-trigger-index.md` | Created | Counts surface hits in the four regenerated retrieval artifacts |
| `scratch/evidence/07-routing-probes.md` | Created | Runs six routing probes across the operator and plugin checkouts and records every rank and score |
| `scratch/evidence/08-local-invisibility.md` | Created | Shows git sees neither private skill as a change and names the ignore rules that hide them |
| `scratch/evidence/09-ci.md` | Created | Groups the CI runs on `main` by conclusion and states the four recorded limits |
| `scratch/evidence/12-history-inventory.md` | Created | Counts reachable objects, tags and hosted releases that still carry old paths, read-only |
| `scratch/evidence/13-drift.md` | Created | Runs the three routing drift scripts and the graph export in the operator checkout |
| `scratch/evidence/14-corpus-boundary.md` | Created | Proves with a probe repository that the retrieval generator leaves an ignored private skill out |
| `scratch/evidence/10-review.md` | Created | Holds the two review rounds, one verdict row per criterion and the 25 findings with their resolutions |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase is read-only, so delivery means publishing evidence. The plan uses three commits, and each push starts a trigger-index rebuild that the next step waits for.

C1 carried the head sweep, `scratch/evidence/01-head-leak-sweep.md`, and is already pushed as `4aeb061b49`. Its CI run finished with `success` and skipped the rebuild push, because the commit changed only a scratch file the corpus excludes. The next docs commit, `25aa533f0b`, changed corpus files and produced the rebuild commit `aecc4258c0`. That was the first CI wait.

The clone checks in `scratch/evidence/02-fresh-clone.md` through `scratch/evidence/06-trigger-index.md` ran against a fresh public clone of `origin/main` at `9129007915`, taken with `git clone --no-local`. The routing probes, the invisibility check and the drift scripts ran in the operator checkout because they need the private roots. The probe repository for the corpus boundary check lives in a scratch folder.

C2 carried the review file and the packet documents with thirteen of fifteen criteria met, pushed as `01742752c1`. Its push started the trigger-index rebuild `634c32b3c7`. C3 carries `11-final-tip.md`, the re-verification of that tip, and closes the last two criteria. Each evidence push's own CI runs go into the phase handoff message.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| ADR-001: verify the public remote, not the working tree | A fresh `git clone --no-local` of `origin/main` shows only what the public sees. The operator checkout supplies only the private trees and the probes that need both external roots. |
| ADR-002: scope the artifact zero check and allowlist the retained 007 paths | Each artifact gets a live-source count that must be `0` and a retained count that must match its measured value. A path outside both populations is a third count that must also be `0`, so a new leak cannot hide inside the allowlist. |
| ADR-003: prove private bytes absent by blob identity and partial content by markers | `git hash-object` over the private files gives exact ids to compare with the clone. Ids the base commit already carries are recorded as already public, and the zero assertion covers only new or changed content. Fragments fall to the marker and token sweeps. |
| ADR-004: probe routing in both consumer checkouts | The operator run proves the split for the primary consumer. The plugin run covers a repository that reaches the hub only through symlinks, which a hub-local test never exercises. |
| ADR-005: inventory history and tags read-only and leave every rewrite to the operator | The phase measures what stays reachable and publishes the counts. A history rewrite is a separate, irreversible operator decision, so this phase executes none. |
| ADR-006: publish three commits and report each push's CI result in the handoff | A file cannot hold the CI results of the push that carries it. C1 gives the clone a tip, C2 carries the evidence and C3 re-verifies the final tip. The handoff names every push's run ids and head sha. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Preflight and baselines, `scratch/evidence/00-preflight.md` | PASS. Operator checkout at `9129007915`, `gh` logged in, baselines recorded (336 tracked paths, 566 and 548 bare-token lines, `skillCount` 14). |
| Head sweep of tracked paths, `scratch/evidence/01-head-leak-sweep.md` section A | PASS. Control `336`, live `0`, retained `specs/` paths `108`. |
| Head sweep of tracked content, `scratch/evidence/01-head-leak-sweep.md` section B | Recorded as BLOCKED against the original expectation of `0`. The live count is `256` over 17 paths, and the operator ruling of 2026-10-24 reclassifies them. Section B of `scratch/evidence/03-fresh-clone-leak.md` holds against the amended expectation. |
| Fresh clone identity, `scratch/evidence/02-fresh-clone.md` | PASS. Clone `HEAD` and operator `HEAD` are both `9129007915a2b6ada693440ad106fd8eefa5e589` and `git status --porcelain` counts `0`. The clone is of the `origin/main` tip, not of C1. |
| Clone tracked paths, `scratch/evidence/03-fresh-clone-leak.md` section A | PASS. Control `336`, live `0`, retained `108`. |
| Clone tracked content, `scratch/evidence/03-fresh-clone-leak.md` sections B and C | PASS as amended. Control `1528`, 17 paths, 8 retained D6 records and 9 accepted (6 test fixtures and 3 retrieval artifacts). |
| Bare surface tokens, `scratch/evidence/03-fresh-clone-leak.md` section D | PASS. `566` at the base, `4` raw, `0` after the `WEBFLOW:` filter. The four removed lines are platform-tag mentions. |
| Blob identity, `scratch/evidence/03-fresh-clone-leak.md` section E | PASS with a finding. With `find -L`: 228 files, 225 unique ids, 138 already public, 1 copied reference, 86 new or changed, control `139`, assertion `0`. The command as written, without `-L`, hashes nothing. |
| D6 kept records, `scratch/evidence/04-d6-kept-records.md` | PASS as amended. Only `skill_advisor.py` from `e00fef3e76` differs, 4 insertions and 2 deletions. The other nine prefixes show no difference. |
| Throwaway advisor database, `scratch/evidence/05-advisor-db.md` | PASS. `skillCount` `14`, `0` `EMPTY-SKILL-SCAN` warnings, sk-code family control `1`, surface query `0`, no `local-*` node. |
| Retrieval artifacts, `scratch/evidence/06-trigger-index.md` sections C to H | PASS, marked PROVISIONAL in the file. Index: `0` live `.skilled/` paths, `69` allowlisted paths, `38` phrase keys, `0` bare keys. Manifest `69` and `0`. Diagnostics `0`. Phrase variants `38`. Measured before the pull of the rebuild commit. |
| Routing probes, `scratch/evidence/07-routing-probes.md` | PASS. Graph `skillCount` `16`. `local-webflow` ranks second at `0.82`, `local-obsidian` ranks second at `0.8325` and `sk-code` stays first on the generic prompt at `0.9296`. The plugin checkout gives identical values and its eight symlinks resolve into this hub. |
| Local invisibility, `scratch/evidence/08-local-invisibility.md` | PASS. `2` ignored entries as the control, `0` tracked or untracked entries, and `git check-ignore -v` prints `2` lines naming `.gitignore:236` and `.gitignore:237`. |
| CI on main, `scratch/evidence/09-ci.md` | PASS. The latest 10 runs and the latest 40 runs are all `completed/success`, with `0` failed, cancelled, timed-out or running. |
| History inventory, `scratch/evidence/12-history-inventory.md` | PASS as amended. `1681` reachable objects, `157` remote tags with `18` carrying old paths, `30` of `146` hosted releases checked with `0` assets. No rewrite ran. |
| Drift scripts, `scratch/evidence/13-drift.md` | PASS. Root metadata `checked=14 passed=14 failed=0`, leaf manifest `fresh=14`, derived freshness `fresh=14 stale=0`, all exit `0`. The exported graph holds `0` `local-` ids. |
| Corpus boundary, `scratch/evidence/14-corpus-boundary.md` | PASS. The tracked control marker reads `2` in phrase variants and `1` in the index, the ignored private marker reads `0` in all four artifacts. With the ignore rule removed the private marker reads `2` and `1` in those two files, so the ignore rule causes the zero. |
| Review rounds, `scratch/evidence/10-review.md` | PASS. Two rounds ran, the second re-ran the read-only commands and returned 1 blocking finding (the missing evidence files and a failing validator, both expected before closure) and 15 others, each answered in the file. |
| Final-tip re-verification, `scratch/evidence/11-final-tip.md` | PASS. A fresh clone at `634c32b3c7` printed paths `336`, `0`, `0`, `108`, content `1528` then 17 paths (8 kept, 9 accepted), tokens `4` raw then `0`, blobs with control `139` and assertion `0`, and artifacts `0`, `69`, `0`, `69 0`, `0`, `38`. Every value equals the earlier run. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Removed content stays in git history.** This is the D7 history-retention decision. `scratch/evidence/12-history-inventory.md` records 1681 reachable objects, 157 remote tags and 30 hosted releases with no assets. Nothing was rewritten, and a rewrite stays the operator's decision.
2. **`git commit --no-verify` bypasses the pre-commit guard.** The guard refuses to stage a `local-*` skill, and a bypass skips it. The fresh-clone sweep in `scratch/evidence/03-fresh-clone-leak.md` carries the proof instead.
3. **An evidence push's own CI runs are reported in the phase handoff message and not committed.** A file cannot hold the results of the push that carries it. `scratch/evidence/09-ci.md` covers the runs on `main` up to the commit before that push.
4. **No pre-push surface-token guard exists.** The private-skill guard sits in the pre-commit hook only, and `scratch/evidence/09-ci.md` records `0` surface-related matches in the pre-push hook.
5. **The routing confidence bound cannot fail on its own.** Every non-leading recommendation reads `0.82` or `0.8325`, so a private skill ranked second always clears `0.8`. This floor is inferred from the rows and the advisor source was not read. The rank is the test that carries weight (`scratch/evidence/07-routing-probes.md` section L).
6. **The drift scripts do not read the private roots.** Output was byte-identical with and without `SPECKIT_PRIVATE_SKILL_ROOTS`, so those scripts say nothing about the two private skills (`scratch/evidence/13-drift.md` section E).
7. **The corpus generator honours only the repository's own `.gitignore`.** It does not read the machine-wide ignore file (`scratch/evidence/14-corpus-boundary.md` section D). The private skills are covered because the repository's own rule ignores them.
8. **The first retrieval artifact counts were provisional.** They were measured before the pull of the rebuild commit, and the final-tip rerun in `scratch/evidence/11-final-tip.md` section E reproduced them.
<!-- /ANCHOR:limitations -->

---
