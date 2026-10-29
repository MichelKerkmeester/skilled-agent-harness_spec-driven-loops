---
title: "Tasks: Phase 4: hub-router-merge"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hub router merge tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: hub-router-merge

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs`. `G` is `.skilled/commands/doctor/scripts/parent-skill-check.cjs`.

The moved prose sits under the heading `## 5. MACHINE ROUTER` in six hubs and `## 11. MACHINE ROUTER` in `sk-code`. The plan and the first draft of this file called it `MACHINE ROUTER NOTES`. The section takes its name from the parent-skill root-router template that phase 003 shipped, `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md`, whose section 6 is `## 6. MACHINE ROUTER`, because the shared resolver finds a machine router by that exact heading. Every verify command below uses the real heading.

`T020` and `T021` were added during the build. They run after `T012` and before the Phase 3 recaptures.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the replay lines on the tree with phases 002 and 003 landed (`scratch/replay-before.txt`). Verify: `node "$R"` prints seven `hub=` lines and one `total` line, and the file holds them. Observed: `scratch/replay-before.txt` holds the seven `hub=` lines, the `total` line `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`, and the two trailing report lines.
- [x] T002 Capture one compiled route per hub with a fixed prompt (`scratch/routes-before.txt`). Verify: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "write a skill README"` prints one JSON object, and the file holds seven of them. Observed: `scratch/routes-before.txt` holds seven lines, one per hub, each with `action`, `selectionKind` and `targets`. The `sk-code` line reads `action=route`, `selectionKind=single`, target `sk-code-review`. The only recorded prompt is the inline `sk-doc` prompt in this Verify command; prompts for the other six hubs were not saved.
- [x] T003 Hash the machine section of each hub router (`scratch/machine-sections-before.txt`). Verify: `sed -n '/^## .*MACHINE-READABLE ROUTER/,/^## /p' .skilled/skills/sk-doc/ROUTER.md | sha256sum` prints one hash, and the file holds seven. Observed: `scratch/machine-sections-before.txt` holds seven sha256 hashes, for example `sk-code 37d20b4b4d35813e858925dcd30051abb2ee25a994221d71234be6aef4f5e558`.
- [x] T004 Confirm the seven per-hub checks pass before the edit. Verify: `node "$G" .skilled/skills/sk-doc` prints `OK: parent-skill-check`, and the same command on the other six hub paths prints `OK`. Observed: all seven print `OK: parent-skill-check` with `all hard invariants passed, 0 warnings`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Move the `cli-classifier` prose and the SMART ROUTING pointer sentence (`SKILL.md`, `ROUTER.md`). Verify: `grep -c 'MACHINE ROUTER' .skilled/skills/cli-classifier/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/cli-classifier/SKILL.md` prints 1, and `grep -c '^## 5. MACHINE ROUTER' .skilled/skills/cli-classifier/ROUTER.md` prints 1. Observed: the three counts print 0, 1 and 1. `git diff --numstat` reports 2 additions and 43 deletions on SKILL.md and 42 additions and 1 deletion on ROUTER.md, and the stage-two sentence now reads `section 3 of this file`.
- [x] T006 [P] Move the `cli-external-orchestration` prose and the SMART ROUTING pointer sentence (`SKILL.md`, `ROUTER.md`). Verify: `grep -c 'MACHINE ROUTER' .skilled/skills/cli-external-orchestration/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/cli-external-orchestration/SKILL.md` prints 1, and `grep -c '^## 5. MACHINE ROUTER' .skilled/skills/cli-external-orchestration/ROUTER.md` prints 1. Observed: the three counts print 0, 1 and 1. `git diff --numstat` reports 2 additions and 61 deletions on SKILL.md and 60 additions and 1 deletion on ROUTER.md, and the stage-two sentence now reads `section 3 of this file`.
- [x] T007 [P] Move the `mcp-tooling` prose and the SMART ROUTING pointer sentence (`SKILL.md`, `ROUTER.md`). Verify: `grep -c 'MACHINE ROUTER' .skilled/skills/mcp-tooling/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/mcp-tooling/SKILL.md` prints 1, and `grep -c '^## 5. MACHINE ROUTER' .skilled/skills/mcp-tooling/ROUTER.md` prints 1. Observed: the three counts print 0, 1 and 1. `git diff --numstat` reports 2 additions and 42 deletions on SKILL.md and 41 additions and 1 deletion on ROUTER.md.
- [x] T008 [P] Move the `sk-code` prose and the SMART ROUTING pointer sentence (`SKILL.md`, `ROUTER.md`). Verify: `grep -c 'MACHINE ROUTER' .skilled/skills/sk-code/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/sk-code/SKILL.md` prints 1, and `grep -c '^## 11. MACHINE ROUTER' .skilled/skills/sk-code/ROUTER.md` prints 1. Observed: the three counts print 0, 1 and 1. `git diff --numstat` reports 3 additions and 114 deletions on SKILL.md and 113 additions and 1 deletion on ROUTER.md. `sk-code` carries the highest section number, so its heading is `## 11. MACHINE ROUTER`.
- [x] T009 [P] Move the `sk-design` prose and the SMART ROUTING pointer sentence (`SKILL.md`, `ROUTER.md`). Verify: `grep -c 'MACHINE ROUTER' .skilled/skills/sk-design/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/sk-design/SKILL.md` prints 1, and `grep -c '^## 5. MACHINE ROUTER' .skilled/skills/sk-design/ROUTER.md` prints 1. Observed: the three counts print 0, 1 and 1. `git diff --numstat` reports 5 additions and 94 deletions on SKILL.md and 92 additions and 1 deletion on ROUTER.md, and the two lines of SKILL.md that named section 6, lines 138 and 140, now name section 5 of `ROUTER.md`.
- [x] T010 [P] Move the `sk-doc` prose and the SMART ROUTING pointer sentence (`SKILL.md`, `ROUTER.md`). Verify: `grep -c 'MACHINE ROUTER' .skilled/skills/sk-doc/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/sk-doc/SKILL.md` prints 1, and `grep -c '^## 5. MACHINE ROUTER' .skilled/skills/sk-doc/ROUTER.md` prints 1. Observed: the three counts print 0, 1 and 1. `git diff --numstat` reports 2 additions and 90 deletions on SKILL.md and 89 additions and 1 deletion on ROUTER.md. The regenerated copy at `.hermes/skills/sk-doc/` carries the same pointer line and the same heading.
- [x] T011 [P] Move the `system-deep-loop` prose and the SMART ROUTING pointer sentence (`SKILL.md`, `ROUTER.md`). Verify: `grep -c 'MACHINE ROUTER' .skilled/skills/system-deep-loop/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/system-deep-loop/SKILL.md` prints 1, and `grep -c '^## 5. MACHINE ROUTER' .skilled/skills/system-deep-loop/ROUTER.md` prints 1. Observed: the three counts print 0, 1 and 1. `git diff --numstat` reports 2 additions and 84 deletions on SKILL.md and 83 additions and 1 deletion on ROUTER.md, and the contributor checklist in `README.md` now points at the MACHINE ROUTER section of `ROUTER.md`.
- [x] T012 Raise the seven editions and align their carriers (`SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json`, `changelog/`). Verify: `node "$G" .skilled/skills/sk-doc` prints PASS on 13a and 13b, and the same command on the other six hubs does too. Observed: `description.json`, `hub-router.json` and `mode-registry.json` agree on `0.8.6.0` for `cli-classifier`, `1.7.12.0` for `cli-external-orchestration`, `1.9.3.0` for `mcp-tooling`, `3.9.24.0` for `sk-code`, `2.0.10.0` for `sk-design`, `2.3.32.0` for `sk-doc` and `1.6.20.0` for `system-deep-loop`. Each hub carries one changelog entry at `<hub>/changelog/v<edition>.md`, and 13a and 13b each print one PASS line on all seven hubs.
- [x] T020 Fix the per-hub compiled-routing code so it reads the fallback checklist from the ROUTER.md machine section (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs`, and their authored mirrors under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/`). Verify: `node .skilled/bin/compiled-route-guard.cjs` prints seven `fresh` lines. Observed: after the move `sk-code` and `sk-design` stopped compiling with `FALLBACK_CHECKLIST_MISSING`, because each read the checklist from SKILL.md alone and phase 003 had taught only the shared manifest path and the `sk-code` compiler to read it from ROUTER.md. The build now passes the ROUTER.md machine-router section and hashes ROUTER.md, the registry compiler reads the checklist from that section when it is present, and both files are mirrored to their authored copies. With source hashes removed, the compiled policy of all seven hubs matches the pre-move policy, seven diffs of zero lines. The other five hubs compiled identically with no code change.
- [x] T021 Teach the two compiled-route tests to build their `sk-code` fixture from ROUTER.md (`.skilled/bin/tests/compiled-route-manifest.test.cjs`, `.skilled/bin/tests/compiled-route-surface-hint.test.cjs`). Verify: `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs` prints `pass 48` and `fail 0`, and `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` prints `pass 13` and `fail 0`. Observed: both fixtures built `sk-code` from SKILL.md alone and failed, 17 cases and 2 cases. The manifest test now copies ROUTER.md into its fixture and lists it among the hashed inputs, the surface-hint test passes the ROUTER.md section, and both report the counts they report on main, 48 and 13 passing with 0 failing.
- [x] T022 Teach the remaining `sk-code` compiler tests to read ROUTER.md (`.skilled/bin/tests/quality-declaration.test.cjs`, `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate-runner-units.test.cjs`), and guard the section search in all three tests that slice it. Verify: `node --test` on each prints `fail 0`. Observed: both built `sk-code` from SKILL.md alone, so `quality-declaration.test.cjs` failed 1 case and the `unit: compiler rejects` case failed with `fallback checklist is absent from authored skill`, which made the sk-code setup battery report FAIL. Each now passes the ROUTER.md machine section and hashes ROUTER.md, and each asserts the heading exists before slicing, so a missing heading fails with a message instead of slicing from the last character. They print pass 8 and pass 11, each with fail 0.
- [x] T023 Rewrite relative links in the Hermes copy of ROUTER.md the way the SKILL.md copy already is (`.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, new test `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes-router.vitest.ts`). Verify: the new test passes, and `sync-skills-hermes.cjs --check` prints `PASS`. Observed: the sync copied ROUTER.md byte for byte, so prose links moved in from SKILL.md, such as `../sk-doc/...` in `cli-external-orchestration`, pointed at nothing under `.hermes/skills/<name>/`. The copy now runs the same rewrite, which leaves fenced blocks and inline code untouched, so the router maps stay byte-identical. Run against the old script, a fixture link stays `references/a.md`; the new test passes 2 of 2, and `--check` prints `PASS: 65 Hermes skill copies in sync` after seven hub copies were regenerated.
- [x] T024 Correct the documents that still placed the machine router in SKILL.md (the `sk-doc` and `cli-external-orchestration` manual testing playbooks, the `compiled-routing-and-legacy-fallback` feature catalog entries of `cli-external-orchestration`, `sk-code`, `sk-doc` and `system-deep-loop`, and the `sk-design`, `sk-doc` and `system-deep-loop` ROUTER.md self-references). Verify: `grep -n 'SKILL.md'` on each catalog entry no longer says SKILL.md carries the directive, and the capture diffs still print nothing. Observed: the playbooks name `ROUTER.md` section 5, the catalog entries name `ROUTER.md` as the directive's home, `SKILL_ROOT` reads `path containing this ROUTER.md and its SKILL.md`, the separate-document line reads `This router stays a separate document from SKILL.md`, and the `allowed-tools` note names SKILL.md's frontmatter. The sk-doc playbook had also named `AMBIGUITY_DELTA` and `ON_DEMAND_KEYWORDS`, which exist nowhere in sk-doc, so those two names were dropped. After the edits the manifests were refreshed and the replay, route and machine-section diffs still print nothing, and the stripped compiled policies of all seven hubs still diff by zero lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Rerun the replay (`scratch/replay-after.txt`). Verify: `diff scratch/replay-before.txt scratch/replay-after.txt` prints nothing. Observed: `diff` prints nothing and exits 0. Both captures hold `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`, and a replay run from the final tree reproduces `scratch/replay-after.txt` byte for byte.
- [x] T014 Rerun the compiled routes (`scratch/routes-after.txt`). Verify: the compared `action`, `selectionKind` and `targets` values match for all seven hubs. Observed: `diff scratch/routes-before.txt scratch/routes-after.txt` prints nothing and exits 0. Every hub returns `action=route` and `selectionKind=single` with one target: `cli-classifier` to `cli-jev`, `cli-external-orchestration` to `cli-codex`, `mcp-tooling` to `mcp-figma`, `sk-code` to `sk-code-review`, `sk-design` to `sk-design-chart`, `sk-doc` to `sk-create-readme` and `system-deep-loop` to `deep-research` under the `research` discriminator.
- [x] T015 Rerun the machine-section hashes (`scratch/machine-sections-after.txt`). Verify: `diff scratch/machine-sections-before.txt scratch/machine-sections-after.txt` prints nothing. Observed: `diff` prints nothing and exits 0. All seven hashes match, for example `sk-doc b411788161679cc354996f41a6372bb1c9e4004af4673e6443260bde4d9c2f5c` and `system-deep-loop 308cd4134bbf8cbd1fef164f538356503963b1ff24962feb3da04fbea429751f`.
- [x] T016 Regenerate the derived copies (`.hermes/skills/`, the two activation manifest roots). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS` and `node .skilled/bin/compiled-route-guard.cjs` reports seven fresh hubs. Observed: `sync-skills-hermes.cjs --check` prints `PASS: 65 Hermes skill copies in sync`. `compiled-route-guard.cjs` prints seven `fresh` lines and `All hubs fresh or excused: serving matches inputs, and the runtime matches its source`, and exits 0. `compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files`. `compiled-route-admission.cjs --all --warn-only` prints `Every hub passes the admission check`, with 4 passing routes for `cli-classifier`, 7 for `cli-external-orchestration`, 15 for `mcp-tooling`, 14 for `sk-code`, 4 for `sk-design`, 24 for `sk-doc` and 20 for `system-deep-loop`, all with 0 drift.
- [x] T017 Run the routing suites (`.skilled/skills/sk-doc/scripts/tests/`, `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/`, `.skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs`). Verify: each run reports no failure and records its passed count in `scratch/`. Observed: `python3 -m pytest .skilled/skills/sk-doc/scripts/tests/` reports `290 passed`. Under `node --test`, `root-router-contract.test.cjs` passes 1 of 1, `leaf-route-replay.test.cjs` 22 of 22, `parent-skill-check-routing-shape.test.cjs` 1 of 1 and `routing-shape-known-debt-ratchet.test.cjs` 4 of 4, each with 0 failing. The `sk-create-skill/scripts/tests/` directory holds no pytest cases, so its suites run under `node --test` and are listed here.
- [x] T018 Run the seven per-hub checks. Verify: `node "$G" .skilled/skills/sk-doc` prints `OK: parent-skill-check`, and the same command on the other six hub paths prints `OK`. Observed: all seven print `OK: parent-skill-check` with `all hard invariants passed, 0 warnings`, and each exits 0.
- [x] T019 Run validation on this packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/004-hub-router-merge --strict` prints `RESULT: PASSED`. Observed: the run prints `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, and exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `diff scratch/replay-before.txt scratch/replay-after.txt` prints nothing, and the guard reports seven fresh hubs

### Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Tasks | 24 | 24 |
| Acceptance criteria | 8 | 8 |
| Blocked tasks | 0 | 0 |

**Verification Date**: 2026-10-29
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---
