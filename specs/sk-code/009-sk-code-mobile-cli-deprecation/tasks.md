---
title: "Tasks: Deprecate the sk-code-mobile-cli surface packet and sweep its references"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deprecate the sk-code-mobile-cli surface packet and sweep its references

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture preflight receipts: HEAD `79646e64` on `skilled/v4.0.0.0`, pre-change census (85 tracked entries / 82 regular files, 494K in git / 668K on disk, 81 matching files, 674 mentions), baseline `compiled-route` JSON for both replay prompts, baseline `parent-skill-check` for the hub at version 4.2.2.0
- [x] T002 Create the Level 2 packet (`specs/sk-code/009-sk-code-mobile-cli-deprecation/`, created with `--skip-branch`)
- [x] T003 Author `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` from the level templates
- [x] T004 Refresh `specs/sk-code/description.json`: the track description named only `code-webflow`/`code-opencode` while the hub carries three surfaces, so it now lists `code-webflow`, `code-opencode`, `code-obsidian`
- [x] T005 Run `validate.sh specs/sk-code/009-sk-code-mobile-cli-deprecation --strict` to an explicit `RESULT: PASSED` before the first tree edit
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 [P] Wave 1 lane A — hub de-registration: `mode-registry.json` entry + `tieBreak`, `hub-router.json` signals/vocabulary/resources, `ROUTER.md` intent key + resource map + prose, `graph-metadata.json`, `description.json`, `SKILL.md` mode table and version authority, `shared/references/stack-detection.md`
- [x] T007 [P] Wave 1 lane A — history scrub: added `changelog/v4.2.3.0.md`; marked `changelog/v4.2.2.0.md` superseded in part; the three `benchmark/reports/compiled-routing/*luna-high*/skill-benchmark-report.json` carry no reference to the removed surface
- [x] T008 [P] Wave 1 lane B — deleted `.skilled/skills/sk-code/sk-code-mobile-cli/` (85 tracked entries); dropped the playbook allowlist root; corrected the example in `sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`
- [x] T009 [P] Wave 1 lane C — rewrote the 14 `sk-code-obsidian` files keeping the mirrored conventions, removed dead attribution and dangling citations, retargeted `OB-021` off the removed markers, dropped the packet from the root `README.md`, and confirmed `.skilled/skills/README.txt` needed no change
- [x] T010 Evaluate Wave 1 returns: no lane return exists because all three lanes were killed at the 30-minute tool ceiling after writing their edits; every artifact was verified instead by opening the diffs and running each gate, and the dead `causal_summary` reference the sweep missed was found and fixed
- [x] T011 Wave 2 — regenerated derived artifacts in order: `generate-leaf-manifest.cjs --write` (mode dropped), hub derived block (`key_files: pruned 1 dead reference`), `skill_graph_compiler.py --export-json`, then `generate-trigger-index.mjs` last
- [x] T012 Wave 2b — dropped the removed case from `canary-cases.v1.json` (10 → 9 cases), re-ran the sk-code `build-artifacts.cjs` harness (4 artifacts, new policy hash `accf7718…`), refreshed the activation manifest, copied it to the authored copy, then promoted the runtime closure with `compiled-route-sync.cjs` and finalised it after the gates passed
- [x] T013 Added the supersession note to `specs/sk-code/008-sk-code-mobile-cli-mode/spec.md`; the removed tree's anchor commit, file count and residue allowlist are recorded in `implementation-summary.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Ran the full verification battery and recorded each command's output and exit status
- [x] T015 Worked every row of the Verification Checklist and `acceptance-criteria.md` with its evidence text
- [x] T016 Authored `implementation-summary.md` and reconciled completion state across the packet docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure gate**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot complete until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: `spec.md` §4 carries REQ-001…REQ-012 and §3 the SC-001…SC-005 outcomes, read back from disk before the tree was touched]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: `plan.md` §3 lists the de-registration in reverse order with its generator-per-artifact map, and §5 the thirteen-check battery]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: `pi` resolved at `/Users/michelkerkmeester/.local/bin/pi` and `LLMGATEWAY_API_KEY` was set in the environment, both observed before the first dispatch]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## De-Registration Quality

- [x] CHK-010 [P0] The removed mode is absent from every hub surface [EVIDENCE: `parent-skill-check.cjs .skilled/skills/sk-code` printed `OK: all hard invariants passed, 0 warnings`, with `3b` 5 modes, `5b` 5 signal keys, `5e` tieBreak a full permutation, `5i` ordering, `6b` mode table and `10c`/`10d` reachability all PASS]
- [x] CHK-011 [P0] Version authority coherent [EVIDENCE: `13a`/`13b` PASS and `4.2.3.0` read identically from `SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json` and `description.json`]
- [x] CHK-012 [P1] No derived artifact hand-edited [EVIDENCE: `ci-leaf-manifest-freshness` 13 fresh, `ci-skill-derived-freshness` 13 fresh / 0 stale / 0 errored, `test_readme_manifest.py` manifest reproducible; the only hand-written field was the authored `causal_summary`]
- [x] CHK-013 [P1] Comment hygiene [EVIDENCE: a scan for `ADR-`/`REQ-`/`CHK-`/task ids and spec paths in code comments found none; the authored `causal_summary` states the durable reason without an id]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Mobile prompt replay [EVIDENCE: `compiled-route.cjs --hub sk-code` on the `--pi-*`/`app-mobile` prompt returned `{"hubId":"sk-code","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"accf7718d466bbb7a5c31bbda7bebe1d8fd6eecc258ce37460b7a42eb1bd7c25","generation":2}` where the baseline routed `sk-code-mobile-cli`]
- [x] CHK-021 [P0] Hub still serves [EVIDENCE: the quality prompt returned `{"action":"route","selectionKind":"single","targets":[{"packetId":"sk-code-quality","packetKind":"workflow",…}]}` at the same policy hash]
- [x] CHK-022 [P0] `compiled-route-guard.cjs` [EVIDENCE: exit 0 with `All hubs fresh or excused: serving matches inputs, and the runtime matches its source.` and no stale-manifest or authored-drift line for any hub]
- [x] CHK-023 [P0] Freshness trio [EVIDENCE: `ci-skill-root-metadata.cjs` 13/13 passed, `ci-leaf-manifest-freshness.cjs` 13 fresh, `ci-skill-derived-freshness.cjs` 13 fresh with 0 stale and 0 errored]
- [x] CHK-024 [P0] Advisor graph [EVIDENCE: `skill_graph_compiler.py --validate-only` printed `VALIDATION PASSED: all metadata files are valid` over 13 discovered files]
- [x] CHK-025 [P0] Playbook contract [EVIDENCE: `validate-playbook-package.cjs --strict` validated every package, `sk-code` 32 scenarios 0 violations and `sk-code/sk-code-obsidian` 27 scenarios 0 violations, with the removed root gone from the allowlist and the six remaining roots discovered]
- [x] CHK-026 [P1] Link integrity [EVIDENCE: `check-markdown-links.cjs` reported 7752 files, 13175 links checked, 0 broken]
- [x] CHK-027 [P1] sk-doc test baselines [EVIDENCE: `test_readme_manifest.py` discovery=pass manifest=reproducible; `test_readme_verdict_parity.py` baseline_files=1024 post_files=1024 diff_entries=0]
- [x] CHK-028 [P0] Packet validation [EVIDENCE: `validate.sh specs/sk-code/009-sk-code-mobile-cli-deprecation --strict` printed `RESULT: PASSED` with 0 errors and 0 warnings, and `check-completion.sh --json` reports `COMPLETE`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Sweep Completeness

- [x] CHK-FIX-001 [P0] Every mention enumerated before processing [EVIDENCE: the pre-change census recorded 81 matching files / 674 mentions across the same surface, and the packet itself as 85 tracked entries (82 regular files + 3 symlinks)]
- [x] CHK-FIX-002 [P0] Post-change census over the same surface [EVIDENCE: `rg -l -e sk-code-mobile-cli -e PI_REMOTE .skilled/skills README.md` returned 7 files / 52 matches, each named in the residue allowlist — two hub changelog entries, four generated retrieval artifacts and one frozen sk-doc baseline — and the hub metadata is at 0 hits]
- [x] CHK-FIX-003 [P0] Consumer inventory closed [EVIDENCE: the sibling `sk-code-obsidian` packet census is at 0 hits, the `sk-doc` reference and playbook allowlist were updated, the root `README.md` surface list was edited, and the routing program packet's fixture and compiled artifacts were regenerated]
- [x] CHK-FIX-004 [P1] Delta reconciled against the frozen scope [EVIDENCE: `git status --porcelain` was mapped path by path; the pre-existing unrelated dirty paths were untouched and the fleet-wide promotion performed by `compiled-route-sync.cjs` is disclosed in `implementation-summary.md` §Known Limitations]
- [x] CHK-FIX-005 [P1] Evidence pinned to the anchor [EVIDENCE: receipts cite anchor commit `79646e64` rather than a moving branch-relative range, and the rollback command restores from that commit]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret written into an artifact [EVIDENCE: the dispatch commands named the provider-qualified model only; no key was echoed into a command, brief, log or packet file, confirmed by scanning the scratch logs]
- [x] CHK-031 [P1] No dispatch beyond what was authorized [EVIDENCE: the only outbound calls were the three `llmgateway/deepseek-v4.1-flash` child invocations named in the briefs, and each brief carried no repository content beyond the file lists it needed]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Packet docs synchronized with what shipped [EVIDENCE: `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` all carry the final state, including the two recorded deviations and the corrected 85-entry count]
- [x] CHK-041 [P1] Predecessor note [EVIDENCE: `specs/sk-code/008-sk-code-mobile-cli-mode/spec.md:27` carries the supersession note pointing at this packet, and that packet's derived metadata was re-derived afterwards]
- [x] CHK-042 [P2] Root README [EVIDENCE: the surface list at `README.md:950` now names only `sk-code-webflow/`, `sk-code-opencode/` and `sk-code-obsidian/`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Delegation receipts under `scratch/` [EVIDENCE: `ls specs/sk-code/009-sk-code-mobile-cli-deprecation/scratch` lists the three briefs, six dispatch logs and `delegation-plan.md`, and the dispatch record is appended to that plan]
- [x] CHK-051 [P1] File organization [EVIDENCE: `scratch/` is retained deliberately as the delegation record and the sync tool's rollback directory was finalised away; no generated log or temporary file remains elsewhere, confirmed by the scope audit]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-19
<!-- /ANCHOR:summary -->

---


