---
title: "Implementation Summary: Phase 6: sk-doc hub and mode packets"
description: "The sk-doc hub and all fourteen packets now open with a short routing statement and keep their machine detail in a final MACHINE ROUTER, the separation rationale lives once in the parent-skill reference and is linked from four hubs, and the fifteen sk-doc ledger entries are gone."
trigger_phrases:
  - "sk-doc hub and mode packets implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/006-sk-doc-hub"
    last_updated_at: "2026-10-28T13:25:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Moved the sk-doc hub and all fourteen packets to the routing canon"
    next_safe_action: "Conductor landing"
    blockers: []
    key_files:
      - "scratch/before.md"
      - "scratch/after.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Did the phase cover the five packets the spec counted, or all fourteen the ledger listed? All fourteen: nine carry call-sequence blocks that the canon counts as machine lines, so the five-packet count would have left nine entries in the ledger."
      - "Where does the reason the machine block stays out of the hub SKILL.md live? Once, in sk-create-skill/references/parent-skill/parent-skills-nested-packets.md, linked from the four hubs that used to restate it."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 6: sk-doc hub and mode packets

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-sk-doc-hub |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every sk-doc document now opens with a short routing statement and keeps its machine detail in a final `MACHINE ROUTER` section. The reason the leaf router stays a separate document is written once and linked from four hubs, and the fifteen sk-doc entries are gone from the routing-shape ledger.

### The shape, per file

Counted the way `package_skill.py` and `parent-skill-check` count: non-blank lines between the SMART ROUTING heading and the next heading, excluding `---`. Before is the ledger's recorded count; after is the same rule measured on the final file.

| File | SMART ROUTING (lines / words) | Machine router | Section after SMART ROUTING |
|------|-------------------------------|----------------|------------------------------|
| `.skilled/skills/sk-doc/SKILL.md` | 58 / 816 → 12 / 176 | `## 6. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 67 |
| `sk-create-agent/SKILL.md` | 78 / 497 → 5 / 109 | `## 7. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 57 |
| `sk-create-benchmark/SKILL.md` | 66 / 430 → 4 / 92 | `## 12. MACHINE ROUTER`, last | `## 3. REQUIRED PACKAGE SHAPE` at 88 |
| `sk-create-changelog/SKILL.md` | 78 / 520 → 8 / 125 | `## 13. MACHINE ROUTER`, last | `## 3. REQUIRED INPUTS` at 59 |
| `sk-create-command/SKILL.md` | 31 / 297 → 5 / 90 | `## 7. MACHINE ROUTER`, last | `## 3. HOW IT WORKS: CREATION WORKFLOW` at 62 |
| `sk-create-diff/SKILL.md` | 64 / 379 → 8 / 133 | `## 11. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 61 |
| `sk-create-feature-catalog/SKILL.md` | 89 / 600 → 4 / 104 | `## 12. MACHINE ROUTER`, last | `## 3. PACKAGE CONTRACT` at 61 |
| `sk-create-frontmatter/SKILL.md` | 81 / 475 → 8 / 133 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 63 |
| `sk-create-goal/SKILL.md` | 46 / 370 → 6 / 111 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 56 |
| `sk-create-manual-testing-playbook/SKILL.md` | 73 / 384 → 4 / 92 | `## 11. MACHINE ROUTER`, last | `## 3. OUTPUT PACKAGE CONTRACT` at 66 |
| `sk-create-quality-control/SKILL.md` | 68 / 397 → 5 / 103 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS: CORE WORKFLOW` at 55 |
| `sk-create-readme/SKILL.md` | 87 / 585 → 7 / 114 | `## 10. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 56 |
| `sk-create-repo-rule/SKILL.md` | 90 / 539 → 7 / 104 | `## 7. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 63 |
| `sk-create-skill/SKILL.md` | 143 / 696 → 6 / 119 | `## 7. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 57 |
| `sk-create-with-human-voice/SKILL.md` | 89 / 555 → 7 / 119 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 59 |

The moved blocks are unchanged. `verify_move.py`, `verify_verbatim.py` and `rrv-verify.py` compared every machine line and every moved H3 block against the saved originals in `.scratch-dc90/072-006/orig/`, and `check_machine.py` compared the machine-line multisets before and after. The hub's moved block holds the compiled-routing directive, the surface-router pointer, the discriminator and the routing rule; each packet's holds its own pseudocode, intent maps and fallback checklist.

### The rationale, once

The "`ROUTER.md` stays a separate document on purpose" paragraph appeared in four hub `SKILL.md` files. It now lives once, as `### Why the leaf router stays in ROUTER.md` in `sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` (line 136), which is the reference a hub author already reads for the nested-packet contract. The four hubs link to its anchor:

| Hub | Line |
|-----|------|
| `sk-doc/SKILL.md` | 142 |
| `cli-external-orchestration/SKILL.md` | 77 |
| `system-deep-loop/SKILL.md` | 50 |
| `sk-design/SKILL.md` | 73 |

`rg -n "must not move into" .skilled/skills --glob 'SKILL.md'` finds nothing, so no hub `SKILL.md` restates the reason.

### Ledger, mirrors and carriers

The fifteen sk-doc entries came off `routing-shape-known-debt.json` (135 lines removed, none added), so `parent-skill-check` 12b passes with an empty ledger: `hub and 14 packet(s) follow the routing canon (0 known debt)`.

The four compiled-route manifests (sk-doc and the three linked hubs) were refreshed, and the archived copies under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/` were updated with them. `compiled-route-sync` reports 55 of 55 served copies matching, `compiled-route-guard` 7 of 7 fresh, and the Hermes check 67 copies in sync. `skill-graph.json` was regenerated.

### Changelogs and versions

sk-doc v2.3.27.0 and one patch step for each of the 14 packets: sk-create-agent 1.0.3.0, sk-create-benchmark 1.6.2.0, sk-create-changelog 1.3.9.0, sk-create-command 1.0.7.0, sk-create-diff 1.1.6.0, sk-create-feature-catalog 1.0.7.0, sk-create-frontmatter 1.0.5.0, sk-create-goal 1.4.4.0, sk-create-manual-testing-playbook 1.0.5.0, sk-create-quality-control 1.0.6.0, sk-create-readme 1.3.8.0, sk-create-repo-rule 1.1.3.0, sk-create-skill 1.7.1.0, sk-create-with-human-voice 1.2.3.0. The three linked hubs stepped too, because their `SKILL.md` changed: cli-external-orchestration 1.7.9.0, sk-design 2.0.7.0, system-deep-loop 1.6.17.0. Their `description.json`, `hub-router.json` and `mode-registry.json` stepped with them, and the parent-skill reference stepped to 1.2.7.0.

### Review fixes

A read-only review of the uncommitted diff returned three P0, one P1 and nine P2 findings (`report.md` ends `FINDINGS: P0=3 P1=1 P2=9`). All three P0 were timing artifacts: the review read the tree while the version bumps, manifest refreshes and mirror regeneration were still in flight. The one P1 and eight of the nine P2 are fixed in the working tree.

| Finding | Fix |
|---------|-----|
| P0-1 Three hubs' JSON routing files were not version-bumped | `description.json`, `hub-router.json` and `mode-registry.json` now carry the `SKILL.md` version for cli-external-orchestration (1.7.9.0), sk-design (2.0.7.0) and system-deep-loop (1.6.17.0); `parent-skill-check` 13a passes for all three. |
| P0-2 Three hubs' compiled-routing manifests were stale | Refreshed each manifest and copied it over the archived activation copy, which is what `compiled-route-sync` compares; the guard reports 7 of 7 fresh. |
| P0-3 Three hubs' `.hermes` mirrors were stale | Regenerated with `sync-skills-hermes.cjs`; the check reports 67 in sync. |
| P1-4 The hub manual-testing-playbook said §2 holds `UNKNOWN_FALLBACK_CHECKLIST` | Line 97 now names both blocks: §2 Smart Routing and §6 MACHINE ROUTER. Line 13 already named §6. |
| P2-5 The hub §2 dropped the "two layers stay separate" invariant | Restored as one sentence in §2: the hub never emits leaf paths, and the surface router never re-decides the mode. |
| P2-6 The hub §2 overstated what `ci-hub-vocabulary-source.cjs` enforces | §2 now names the four legs that fail (`alias`, `stage-two`, `triggers`, `packets`) and says the `stage-two-reverse` leg only reports. |
| P2-7 The benchmark said `references/shared/README.md` loads first | Reworded: it is the route map and the fallback load; on a resolved family the sorted keyed set loads the `assets/` templates before it. |
| P2-8 The readme said two artifacts route and the matching template loads first | Now three artifacts (general README, code-folder README, `ARCHITECTURE.md`) and "authoring starts from the matching template". |
| P2-9 The goal packet said `parent-and-nested-goals.md` is always the first resource | Scoped to an authoring or revision request, with the budget/handoff path on the next line unchanged. |
| P2-10 The voice packet said `hvr-rules.md` loads next | Reworded to "the standard the scanner parses on every run, so it is read rather than copied"; the changelog sentence matches. |
| P2-11 Three packets named a mode signal that does not exist | They now use the registry keys `sk-create-agent`, `sk-create-command`, `sk-create-skill` and `sk-create-skill-parent`. |
| P2-12 Five moved lines said "below" for content now above the MACHINE ROUTER | Changed to "above" in the four fenced comments and the command prose line. |
| P2-13 `validate this README for quality` returns `clarify` | Recorded, not fixed: the same prompt returns `clarify` on `main` at `00018303dc`, so it is pre-existing vocabulary behaviour, not a regression from this phase. A less ambiguous prompt (`validate this document for quality`) routes to `sk-create-quality-control`. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase moved each section with a scratch transform and proved the move before it ran the gates. `migrate.py`, `move_routing.py`, `move_router.py` and `rrv-move.py` slice the existing SMART ROUTING body by line range, so the moved bytes are preserved and only the prose body is replaced; each was followed by a verifier that read the pre-edit file from `.scratch-dc90/072-006/orig/` or `git show HEAD:` and compared the moved block. `rrv-scope.py` proves nothing outside SMART ROUTING and MACHINE ROUTER changed.

The gates then ran as one set: `scratch/gates.sh` runs 38 gates and prints one line per gate. `scratch/before.md` and `scratch/after.md` record the two runs.

No executor dispatch is recorded for this phase. The work is the scratch scripts, the verifiers, the review fixes and the phase commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| All 14 packets were moved, not the five the spec counted | The spec counted the packets whose machine block sat in SMART ROUTING. The ledger counts every machine line the canon names, and nine packets carry call-sequence blocks (`def discover_markdown_resources`, `def _guard_in_skill`) that are machine lines under the canon. Moving five would have left nine entries that could not be removed without raising the ceiling, which the ledger forbids. `before.md` §3 records the count and the research's own order (line 147) already said 14. |
| The rationale moved into `parent-skills-nested-packets.md`, not into the hub `SKILL.md` | That reference is the one document a hub author reads for the nested-packet contract, and it is where the two-stage authoring model already lives. A hub `SKILL.md` that restates the reason is exactly the copy that drifts; four hubs already carried it, three verbatim and one paraphrased. |
| The hub keeps its routing detail in `## 6. MACHINE ROUTER` | The compiled-routing directive, the surface-router pointer, the discriminator and the routing rule are operational, and the canon's shape is "short prose, machine block last", not "delete the machine block". The move kept every byte. |
| Each changed `SKILL.md` steps a patch version | The change is routing shape and prose only: no route, resource or rule changed. The three linked hubs step because their `SKILL.md` changed, not because their routing did. |
| The fourth routing prompt is left as `clarify` | It returns the same decision on `main`, so it is not this phase's regression. Changing the vocabulary to prefer `sk-create-quality-control` over `sk-create-readme` would alter live routing, which is a vocabulary phase's job. |
| No new script ships for the move | The move is one-off authoring, and the checks that matter already exist. A migration script would become a second source of the canon shape. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Files outside spec.md's Files to Change.** `routing-shape-known-debt.json`; `parent-skills-nested-packets.md`; the three linked hubs and their `description.json`, `hub-router.json` and `mode-registry.json`; the hub manual-testing-playbook; two readme playbooks and one readme reference; the four compiled-route manifests and their archived copies; the `.hermes` mirrors; `skill-graph.json`; the three deep-loop compiled contracts; 18 changelogs.
2. **The spec counted five packets with machine blocks; the phase did all 14.** The ledger listed all fourteen, and the research's phase order said "sk-doc hub and 14 packets". `tasks.md` T004 now records the fourteen.
3. **No separate `/speckit:plan` run (T003).** `plan.md` §4 fixed the four steps, and `scratch/gates.sh` supplied the verify command for every step.
4. **`catalog-packages` is red in this worktree.** Main's `e244718df9` fixes the sk-code leaf description the gate names, and this worktree's HEAD predates it. The gate goes green on the replay; see Known Limitations.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Full gate set (`scratch/gates.sh`), 38 gates | 37 of 38 exit 0 here; `contract-drift` was red on the first run and is 0 after the contract recompile; `catalog-packages` is 1 here and 0 on main |
| `parent-skill-check` 12b with an empty ledger | `PASS: 12b-routing-shape: hub and 14 packet(s) follow the routing canon (0 known debt)` |
| `package_skill.py --check --strict`, sk-doc and 14 packets | `Result: PASS` on all 15; six word-count advisories |
| `routing-shape-known-debt-ratchet.test.cjs` | 4 of 4 pass |
| `compiled-route-guard.cjs --json` | 7 of 7 `fresh`, failures 0 |
| `compiled-route-sync.cjs --check` | 55 of 55 served copies match |
| `sync-skills-hermes.cjs --check` | `PASS: 67 Hermes skill copies in sync` |
| Routing accuracy | 155/195, 49/66, 19/24, identical to the baseline |
| `rg -n "must not move into" .skilled/skills --glob 'SKILL.md'` | no matches |
| `validate.sh --recursive --strict` | `RESULT: PASSED` |

Detail: `scratch/after.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`catalog-packages` is red in this worktree.** The failure is the sk-code leaf description, fixed on main in `e244718df9`, which this worktree predates (`git merge-base --is-ancestor e244718df9 HEAD` exits 1). The replay carries the commit; its leaf description is byte-identical to the root entry's text, checked against `feature-catalog.md`, so the gate passes there.
2. **The ledger's hub word count is six words stale.** It records 58 lines and 816 words; a recount of the same file at `00018303dc` by the checker's own rule gives 810. Both are over the old 180-word limit, which is what the entry recorded, and the after figure (176) is measured.
3. **The fourth review prompt still returns `clarify`.** `validate this README for quality` matches both the `quality-actions` and `create-readme-aliases` classes and clarifies on `main` too. It is recorded as P2-13, not fixed here.
4. **The transform scripts and verifiers are not committed.** They live in `.scratch-dc90/072-006/`. The evidence inside the packet is the runner `scratch/gates.sh` and the two gate tables, which land with these docs.
5. **Six packets carry a word-count advisory.** sk-create-benchmark 3,269, sk-create-changelog 4,233, sk-create-command 3,687, sk-create-feature-catalog 3,299, sk-create-manual-testing-playbook 3,668 and sk-create-skill 3,713 words against the 3,000 recommended max. `package_skill.py` passes them; trimming them belongs to the prose phase.
<!-- /ANCHOR:limitations -->
