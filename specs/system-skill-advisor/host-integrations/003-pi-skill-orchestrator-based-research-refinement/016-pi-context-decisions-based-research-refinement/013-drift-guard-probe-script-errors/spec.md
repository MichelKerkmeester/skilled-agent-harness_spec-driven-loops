---
title: "Feature Specification: Drift-Guard Probe Script Errors"
description: "The sk-code drift-guard gate exits 1 on 11 ERROR rows, all in ten archived review probes of the routing-and-scoring 008 packet. This phase gives each probe the canonical bash shebang, `set -uo pipefail` or a TypeScript MODULE header, so the gate exits 0 without weakening the check."
trigger_phrases:
  - "drift guard probe script errors"
  - "phase 13 drift guard probe script errors"
  - "alignment drift probe shebang strict mode"
  - "run-all-drift-guards exit 1 review probes"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Drift-Guard Probe Script Errors

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-18 |
| **Branch** | `worktrees/474-advisor-pasted-context-and-crash-fallback` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 011-route-receipts-build |
| **Successor** | 012-plan-text-and-goal-closeout |
| **Handoff Criteria** | `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0, so phase 012 can tick the parent goal on a green gate. Phase 012 builds after this one by the parent build order |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the pi-context-decisions refinement packet. It closes one open item the 002, 004 and 003 build left: the drift-guard gate failed during that build, and the 003 summary recorded it as unrelated (`../003-follow-up-routing-benchmark/implementation-summary.md:102`).

`R` is `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/`. `V` is `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py`.

**Scope crossing**: every file this phase edits belongs to another packet, `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`. They are archived review probes under its `review/` folder. This phase owns the edit because the operator asked that every open item close under this packet. The 008 packet's own docs are not touched.

**Scope Boundary**: Ten files, each changed at its top only: the shebang line, one `set -uo pipefail` line or a three-line comment header. No body line changes. No guard, rule or exclusion changes.

**Dependencies**:
- The alignment-drift rules in `V`, read as they stand on this branch.

**Deliverables**:
- Nine shell probes that carry `#!/usr/bin/env bash` on line 1 and `set -uo pipefail` near the top.
- One TypeScript probe config that carries a `MODULE:` header in its first 40 lines.
- A drift-guard gate that exits 0.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`run-all-drift-guards.sh` runs four guards and exits 1 when any fails (`.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:80-83`). The alignment-drift guard fails on any ERROR row (`V:1055`, `V:1082`). It reports 11, all in ten tracked probes under `R`. A shell file must start with `#!/usr/bin/env bash` (`V:648-657`) and hold a line that matches `^\s*set\s+-e?uo\s+pipefail\s*$` in its first 80 lines (`V:662`, `V:671-680`). A TypeScript file must hold `MODULE:` in its first 40 lines (`V:600-610`). These three rules are integrity rules, so they count as ERROR (`V:92-99`, `V:539-543`). A path is downgraded to WARN only when it has a `research`, `fixtures`, `scratch` or other advisory segment (`V:129-138`, `V:374-377`). The `review/lineages/.../probes` and `review/verify-N/probes` paths have none, so every miss there is an ERROR. Any later completion gate that runs the drift guards fails on this packet's branch and on `main` for a reason unrelated to the work being checked.

### Purpose
The drift-guard gate exits 0 because the ten probes meet the rules, not because the guard looks away.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on 2026-11-18 from the worktree root. `OUT` is a scratch file outside the repository.

```text
$ bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh > "$OUT" 2>&1 || echo "exit=$?"
exit=1
$ sed -n 2,6p "$OUT"
[alignment-drift] FAIL
Scanned files: 20751
Findings: 57
Errors: 11
Warnings: 46
$ grep '\[ERROR\]' "$OUT" | sed -E 's#^- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/(.*):1 \[([A-Z-]+)\] \[ERROR\].*#\1 \2#'
lineages/noedit-close-3c/probes/hook-probe.sh SH-SHEBANG
lineages/noedit-close-3c/probes/hook-probe.sh SH-STRICT-MODE
lineages/scorer-attach-4/probes/vitest.config.ts TS-MODULE-HEADER
verify-4/probes/cli-rows.sh SH-STRICT-MODE
verify-4/probes/holdout-guard-emulation.sh SH-STRICT-MODE
verify-4/probes/make-heredoc-variant.sh SH-STRICT-MODE
verify-4/probes/make-shell-start-variant.sh SH-STRICT-MODE
verify-4/probes/paired-arm.sh SH-STRICT-MODE
verify-4/probes/top-only-head.sh SH-STRICT-MODE
verify-4/probes/top-only-sweep.sh SH-STRICT-MODE
verify-5/probes/arena-provenance.sh SH-STRICT-MODE
$ grep -cE '(sk-git/commit-standards|repo-guards/fixtures).*\[ERROR\]' "$OUT"
0
$ tail -1 "$OUT"
run-all-drift-guards: 1 guard(s) FAILED
$ git diff --stat main -- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review
$ git ls-files specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review | grep -E 'probes/.*\.sh$' | xargs -n1 bash -n && echo "nine-parse exit=$?"
nine-parse exit=0
```

The other three guards pass: stack-folders, router-sync 5 of 5 and doc-claims 4 of 4.

The empty `git diff --stat main` shows the ten probes are byte-identical on `main`, so `main` carries the same 11 errors. The guard was not run in the primary checkout.

The handoff also named `specs/sk-git/commit-standards/.../deepseek/` and `.vibe/plugins/repo-guards/fixtures/`. The count above is 0 ERROR rows there. Both show only WARN rows: the `deepseek` probes sit under a `research` segment and the `.vibe` files under a `fixtures` segment, and both segments are advisory (`V:129-138`). WARN rows never fail the gate (`V:1055`).
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace `#!/bin/bash` with `#!/usr/bin/env bash` on line 1 of `R/lineages/noedit-close-3c/probes/hook-probe.sh`, and turn its `set -u` at `:4` into `set -uo pipefail`.
- Turn `set -u` at `R/verify-5/probes/arena-provenance.sh:6` into `set -uo pipefail`.
- Add one `set -uo pipefail` line after the header comment of each of the seven `R/verify-4/probes/*.sh` files.
- Add a three-line `MODULE:` comment header above line 1 of `R/lineages/scorer-attach-4/probes/vitest.config.ts`.

### Out of Scope
- Excluding paths from the guard, or moving the probes into an `evidence`, `scratch` or `z_archive` folder, which `V:68-89` would skip - each one hides the files from the check instead of fixing them.
- `set -e` in any probe - errexit would abort a probe on a tolerated non-zero, such as `grep` finding nothing in `paired-arm.sh:8`, and change what it prints.
- The 46 WARN rows, including the `.vibe` fixtures and the `sk-git` `deepseek` probes - WARN rows do not fail the gate.
- Editing the probes' hard-coded worktree 352 paths or their bodies - they are archived records, and nothing here runs them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `R/lineages/noedit-close-3c/probes/hook-probe.sh` | Modify | Line 1 becomes `#!/usr/bin/env bash`. Line 4 `set -u` becomes `set -uo pipefail` |
| `R/lineages/scorer-attach-4/probes/vitest.config.ts` | Modify | Three-line `MODULE:` comment header above the import on line 1 |
| `R/verify-4/probes/cli-rows.sh` | Modify | `set -uo pipefail` after the comment on line 2 |
| `R/verify-4/probes/holdout-guard-emulation.sh` | Modify | `set -uo pipefail` after the comment on line 5 |
| `R/verify-4/probes/make-heredoc-variant.sh` | Modify | `set -uo pipefail` after the comment on line 4 |
| `R/verify-4/probes/make-shell-start-variant.sh` | Modify | `set -uo pipefail` after the comment on line 4 |
| `R/verify-4/probes/paired-arm.sh` | Modify | `set -uo pipefail` after the comment on line 3 |
| `R/verify-4/probes/top-only-head.sh` | Modify | `set -uo pipefail` after the comment on line 3 |
| `R/verify-4/probes/top-only-sweep.sh` | Modify | `set -uo pipefail` after the comment on line 4 |
| `R/verify-5/probes/arena-provenance.sh` | Modify | Line 6 `set -u` becomes `set -uo pipefail` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The drift-guard gate passes | `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0, and its alignment-drift block prints `Errors: 0` |
| REQ-002 | Every shell probe still parses | `bash -n` on each of the nine `.sh` files exits 0 with no output |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The edits touch only the top of each file | `git diff --numstat -- R` lists exactly the ten files, and every added line is a shebang, `set -uo pipefail` or a `//` comment line |
| REQ-004 | The guard itself is unchanged | `git diff --stat -- .skilled/skills/sk-code` prints nothing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `run-all-drift-guards.sh` prints `run-all-drift-guards: all 4 guards PASSED` with its warning count, and exits 0.
- **SC-002**: The alignment-drift `Warnings:` count equals the count before the edits, 46 at planning, so no ERROR row turned into a WARN row by a path move.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The strict-mode regex at `V:662` is anchored at both ends | A trailing comment or a second flag on the line fails the rule | Every brief pastes the exact line `set -uo pipefail`, and the two files that already hold `set -u` get that line replaced, not a second line added |
| Risk | `-u` stops a probe that is called with too few arguments, and `pipefail` changes a pipeline's exit status | Low | Each probe documents its arguments, so only a misuse changes. No probe reads a pipeline's status. Checked per file in `plan.md` section 3 |
| Risk | The inserted lines shift every line number below them | Low | A search of the 008 packet for `probes/<file>:<line>` citations found only a captured Vite warning naming `vitest.config.ts:1:1` in `R/lineages/scorer-attach-4/logs/fanout-lineage.out`, which is a recorded log and stays as it is |
| Risk | A commit on `main` touches these probes before the merge | Low | The merge conflicts visibly. Rerun the gate on `main` after the merge |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The 003 summary says the 11 errors sit in "unrelated spec probe scripts and `.vibe` fixtures" (`../003-follow-up-routing-benchmark/implementation-summary.md:102`). The measured run shows the `.vibe` fixtures as WARN only. Recommended default: phase 012, which already edits the 003 docs, corrects that row to name only the 008 review probes.
- `#!/usr/bin/env bash` resolves to `/bin/bash` 3.2 on this machine, the same shell `#!/bin/bash` named. On a machine whose `PATH` puts a newer bash first, `hook-probe.sh` would run under that one. INFERRED harmless, because the probe uses no version-specific feature. Recommended default: accept it, since nothing runs the archived probe.
<!-- /ANCHOR:questions -->

---
