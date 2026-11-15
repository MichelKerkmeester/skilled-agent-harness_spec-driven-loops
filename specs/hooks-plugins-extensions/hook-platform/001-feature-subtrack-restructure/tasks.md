---
title: "Tasks: Give every hook, plugin and extension feature its own sub-track under the hooks track, with one overview of all features and their owning packets."
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "feature subtrack restructure tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Give every hook, plugin and extension feature its own sub-track under the hooks track, with one overview of all features and their owning packets.

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

The task lines use four shell variables. Export them once in the shell before any `Verify:` line:

```bash
export P=specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure
export M=$P/scratch/move-map
export R=.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs
export V=.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh
```
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the working tree holds only hooks-track paths, so the pre-move commit is exact (`specs/hooks-plugins-extensions/`). Verify: `git status --porcelain | awk '{print $2}' | grep -vc '^specs/hooks-plugins-extensions/'` prints 0.
- [x] T002 Confirm every destination sub-track is declared (`specs/hooks-plugins-extensions/*/description.json`). Verify: `find specs/hooks-plugins-extensions -maxdepth 2 -name description.json -exec grep -l '"level": "sub-track"' {} + | wc -l` prints 36.
- [x] T003 Confirm the map covers the track and leaves the two held packets out (`$M/map.txt`). Verify: `grep -c ' -> ' $M/map.txt` prints 40, `grep -c '^hooks-plugins-extensions/' $M/map.txt` prints 29, and `grep -c 'session-relaunch-loop\|file-relative-adapter-imports' $M/map.txt` prints 0.
- [x] T004 Confirm `relocate.mjs` refuses over the dirty tree, so the commit is the gate (`$M/map-intrack.json`). Verify: `node $R --map $M/map-intrack.json 2>&1 | grep -c 'nothing was written'` prints 1.
- [x] T005 Commit the scaffolding and this packet's docs locally, with no push (`specs/hooks-plugins-extensions/`). Verify: `git add -A && git commit -m "chore(specs): scaffold hook feature sub-tracks and the restructure packet"` exits 0 and `git status --porcelain | wc -l` prints 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Dry-run the in-track map and read every line against `map.txt` (`$M/map-intrack.json`). Verify: `node $R --map $M/map-intrack.json | grep -c '^  move '` prints 29.
- [x] T007 Apply the in-track map (`$M/map-intrack.json`). Verify: `node $R --map $M/map-intrack.json --apply | grep -c 'moves=29 moved=0'` prints 1.
- [x] T008 Dry-run the foreign map and read every line against `map.txt` (`$M/map-foreign.json`). Verify: `node $R --map $M/map-foreign.json | grep -c '^  move '` prints 11.
- [x] T009 Apply the foreign map (`$M/map-foreign.json`). Verify: `node $R --map $M/map-foreign.json --apply | grep -c 'moves=11 moved=0'` prints 1.
- [x] T010 Retire the three source sub-tracks that emptied out (`specs/hooks-plugins-extensions/goal-and-directive-hooks/`, `hook-injection-pipeline/`, `repo-commit-gates/`). Verify: `git rm -r --quiet specs/hooks-plugins-extensions/goal-and-directive-hooks specs/hooks-plugins-extensions/hook-injection-pipeline specs/hooks-plugins-extensions/repo-commit-gates` exits 0 and `ls -d specs/hooks-plugins-extensions/goal-and-directive-hooks specs/hooks-plugins-extensions/hook-injection-pipeline specs/hooks-plugins-extensions/repo-commit-gates 2>/dev/null | wc -l` prints 0.
- [x] T011 Rename the track identity to `hooks-plugins-extensions` (`specs/hooks-plugins-extensions/description.json`, `specs/hooks-plugins-extensions/graph-metadata.json`). Verify: `rg -n '"specFolder": "hooks"|"specId": "hooks"|"folderSlug": "hooks"|"packet_id": "hooks"|"spec_folder": "hooks"' specs/hooks-plugins-extensions/description.json specs/hooks-plugins-extensions/graph-metadata.json | wc -l` prints 0.
- [x] T012 Rebuild the track's `children_ids` from disk (`specs/hooks-plugins-extensions/graph-metadata.json`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs --track hooks-plugins-extensions --apply` exits 0 and `grep -c '"hooks-plugins-extensions/' specs/hooks-plugins-extensions/graph-metadata.json` prints 33.
- [x] T013 Commit the move locally, with no push (`specs/hooks-plugins-extensions/`). Verify: `git add -A && git commit -m "refactor(specs): file every hook feature under its own sub-track"` exits 0 and `git status --porcelain | wc -l` prints 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run the strict recursive validator over the track (`specs/hooks-plugins-extensions/`). Verify: `bash $V specs/hooks-plugins-extensions --strict --recursive --quiet | grep '^RESULT:' | grep -vc '^RESULT: PASSED'` prints 0.
- [x] T015 Check every map row left its old path and arrived at its new one (`$M/map.txt`). Verify: `while read -r from arrow to; do test -e "specs/$from" && echo "OLD $from"; test -e "specs/$to" || echo "MISSING $to"; done < $M/map.txt | wc -l` prints 0.
- [x] T016 Check the two held packets are still in place and named in the spec (`specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop`, `specs/hooks-plugins-extensions/pi-extensions/012-file-relative-adapter-imports`). Verify: `ls -d specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop specs/hooks-plugins-extensions/pi-extensions/012-file-relative-adapter-imports | wc -l` prints 2 and `rg -c '^- 002-session-relaunch-loop|^- 012-file-relative-adapter-imports' $P/spec.md` prints 2.
- [x] T017 Check no metadata store points at a retired sub-track (`specs/**/description.json`, `specs/**/graph-metadata.json`). Verify: `rg -l 'hooks-plugins-extensions/(goal-and-directive-hooks|hook-injection-pipeline|repo-commit-gates)/' specs --glob 'description.json' --glob 'graph-metadata.json' | wc -l` prints 0.
- [x] T018 Check the overview still holds one card per feature (`$P/feature-overview.md`). Verify: `grep -c '^## ' $P/feature-overview.md` prints 31 and `grep -c '^- Packets:' $P/feature-overview.md` prints 31.
- [x] T019 Check the overview still covers every feature folder, plugin file and Pi entry (`$P/feature-overview.md`). Verify: the three loops in REQ-008, REQ-009 and REQ-010 print 0, 0 and 0.
- [x] T020 Check every remaining sub-track is declared and holds a `z_archive/` (`specs/hooks-plugins-extensions/*/`). Verify: `for d in specs/hooks-plugins-extensions/*/; do test -f "$d/z_archive/.gitkeep" || echo "$d"; grep -q '"level": "sub-track"' "$d/description.json" || echo "$d"; done | wc -l` prints 0.
- [x] T021 Check the five source tracks still validate after their packets left (`specs/system-speckit/`, `specs/system-skill-advisor/`, `specs/system-deep-loop/`, `specs/sk-code/`, `specs/sk-git/`). Verify: `for t in system-speckit system-skill-advisor system-deep-loop sk-code sk-git; do bash $V specs/$t --strict --recursive --quiet; done | grep '^RESULT:' | grep -vc '^RESULT: PASSED'` prints 0; a failure that predates the move is recorded in `goal.md` section 4 and named in the handback.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `bash $V specs/hooks-plugins-extensions --strict --recursive --quiet` prints no `RESULT:` line other than `PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Move map**: See `scratch/move-map/map.txt`
- **Feature inventory**: See `feature-overview.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The approved map is present and both JSON inputs parse: `node -e "JSON.parse(require('fs').readFileSync('$M/map-intrack.json','utf8'));JSON.parse(require('fs').readFileSync('$M/map-foreign.json','utf8'))"` exits 0.
- [ ] CHK-002 [P0] The pre-move validation baseline is recorded in `goal.md` section 4 with the command that produced it: `rg -c 'RESULT: PASSED' $P/goal.md` prints at least 1.
- [ ] CHK-003 [P1] Every destination sub-track is declared: the T002 count prints 36.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every JSON file the move rewrites parses: `for f in specs/hooks-plugins-extensions/graph-metadata.json specs/hooks-plugins-extensions/description.json; do node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" || echo "$f"; done | wc -l` prints 0.
- [ ] CHK-011 [P0] No packet was moved by hand: `rg -c 'relocate.mjs --map' $P/goal.md` prints 1 and the ledger holds one batch per map run.
- [ ] CHK-012 [P1] No code file changed: `git log --name-only -1 --format= | grep -vc '^specs/'` prints 0 on the move commit.
- [ ] CHK-013 [P1] Nothing was pushed: `git branch -r --contains HEAD | wc -l` prints 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] The recursive strict validator reports no failure: the T014 count prints 0.
- [ ] CHK-021 [P0] Every map row moved: the T015 count prints 0.
- [ ] CHK-022 [P1] The overview covers every feature folder, plugin file and Pi entry: the T019 counts print 0, 0 and 0.
- [ ] CHK-023 [P1] The two held packets are untouched and named with their destinations: the T016 counts print 2 and 2.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret or dotenv file was opened or copied: `rg -c '\.env' $P/goal.md | wc -l` prints 0.
- [ ] CHK-031 [P0] No network call is part of the move: `rg -c 'curl\|wget\|npm install' $P/tasks.md | wc -l` prints 0.
- [ ] CHK-032 [P1] No credential is written into a spec document: `rg -c 'password\|token\|secret' $P/spec.md | wc -l` prints 0.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the three phases and the map: `rg -c '^## 4\. IMPLEMENTATION PHASES' $P/plan.md` prints 1 and the paragraph below it names Setup, Implementation and Verification.
- [ ] CHK-041 [P1] The five packet docs carry no unfilled token: `rg -o '\[YOUR_VALUE[_]HERE:' $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md $P/goal.md | wc -l` prints 0.
- [ ] CHK-042 [P2] The overview stays the single card-per-feature inventory: `rg -c '^# Hook, Plugin and Extension Feature Overview' $P/feature-overview.md` prints 1.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Moves ran only through `relocate.mjs`: `rg -c 'node \$R --map' $P/tasks.md` prints 5 and no task names a hand move.
- [ ] CHK-051 [P1] `scratch/` holds only the map and the wave-a cards: `ls $P/scratch` prints `brief-packet-docs.md`, `move-map`, `packet-docs.stderr.log`, `packet-docs.stdout.log` and `wave-a`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---
