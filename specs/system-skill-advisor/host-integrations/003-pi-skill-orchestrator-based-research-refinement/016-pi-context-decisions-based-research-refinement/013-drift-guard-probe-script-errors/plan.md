---
title: "Implementation Plan: Drift-Guard Probe Script Errors"
description: "Give ten archived review probes the header lines the alignment-drift guard checks, one top-of-file edit per file through one-file Luna briefs, then prove it with bash -n on the nine shell probes and a drift-guard gate that exits 0."
trigger_phrases:
  - "drift guard probe script errors plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Drift-Guard Probe Script Errors

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash for nine probes, TypeScript for one Vitest probe config |
| **Framework** | The sk-code drift-guard gate, `run-all-drift-guards.sh` |
| **Storage** | None |
| **Testing** | `bash -n` per shell probe and the drift-guard gate |

### Overview
Ten files under `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/` change at their top only. Nine shell probes get the canonical shebang or a `set -uo pipefail` line, and one TypeScript probe config gets a `MODULE:` comment header. `bash -n` proves every shell probe still parses, and the drift-guard gate exiting 0 proves the rules are met.

`R` is `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/`. `V` is `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py`. `GATE` is `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`, run from the repository root.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `GATE` exits 1, and its alignment-drift block prints `Errors: 11`, every ERROR row under `R`
- [ ] `git diff --stat main -- R` prints nothing, so the branch and `main` hold the same probes

### Definition of Done
- [ ] `GATE` exits 0 and prints `run-all-drift-guards: all 4 guards PASSED`
- [ ] `bash -n` exits 0 for each of the nine shell probes
- [ ] `git diff --numstat -- R` lists exactly the ten files in `spec.md` Files to Change
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Top-of-file header fix.

### Key Components
- **Shell shebang and strict mode**: `V:648-657` wants line 1 to equal `#!/usr/bin/env bash`. `V:662` wants a line matching `^\s*set\s+-e?uo\s+pipefail\s*$` in the first 80 lines. The plan uses `set -uo pipefail`, the form `V:659-661` names for scripts that tolerate a non-zero. Each probe, read in full:
  - `R/lineages/noedit-close-3c/probes/hook-probe.sh`: line 1 is `#!/bin/bash` and line 4 is `set -u`. Both are replaced. No pipeline exists, so `pipefail` changes nothing.
  - `R/verify-4/probes/cli-rows.sh`: the new line goes between the comment at `:2` and the `cd` at `:3`. The `node | jq` pipeline at `:6-8` has an unread status. `-u` is safe on the empty `"$@"` loop at `:4`, checked under `/bin/bash` 3.2.
  - `R/verify-4/probes/holdout-guard-emulation.sh`: the new line goes between `:5` and `:6`. The `|` characters at `:9-17` are inside a jq program. `-u` stops early only when an argument named in the usage at `:4` is missing.
  - `R/verify-4/probes/make-heredoc-variant.sh` and `R/verify-4/probes/make-shell-start-variant.sh`: the new line goes between `:4` and `:5`. No shell pipeline. `$1` is the documented output path.
  - `R/verify-4/probes/paired-arm.sh`: the new line goes between `:3` and `:4`. The pipelines at `:8` and `:9` have unread statuses. Only the script's final exit code can change, when the `node` at `:9` fails.
  - `R/verify-4/probes/top-only-head.sh`: the new line goes between `:3` and `:4`. The pipeline inside the `head` function at `:6-9` runs inside a command substitution, and nothing reads its status.
  - `R/verify-4/probes/top-only-sweep.sh`: the new line goes between `:4` and `:5`. The pipelines at `:13` and `:17` run inside command substitutions. Every counter is set at `:10` before use, and `read -r` at `:11` sets both names.
  - `R/verify-5/probes/arena-provenance.sh`: line 6 `set -u` is replaced. The pipeline at `:25` runs inside a command substitution.
- **TypeScript header**: `V:600-610` wants `MODULE:` in the first 40 lines. `R/lineages/scorer-attach-4/probes/vitest.config.ts` gets the same three-line block its sibling `R/lineages/hook-confirm-3b/probes/command-attach-pre.ts:1-3` already carries, above the import on line 1. The text says the file is a Vitest config for a scorer probe. It names no packet, phase or lineage id. Comments do not change the exported config.

### Data Flow
`GATE` runs `V` with `--root` at the repository root (`run-all-drift-guards.sh:59-60`). `V` scans tracked files only (`V:283`), applies the shell and TypeScript rules and counts ERROR rows (`V:1053-1055`). With the ten files fixed, no ERROR row remains and `V` returns 0 (`V:1082`).

### Executors
Per the parent goal's D2, GPT-6 Luna `xhigh` `fast` leaves through cli-codex make the edits, one file per brief, in waves of at most four on disjoint files: four, four, then two. Each brief pastes the old line and the new line. The conductor runs every check, as D4 requires. The fallback is the parent's DeepSeek Flash rule in `../delegation-strategy.md` section 3.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs `GATE` for the 11-error baseline and confirms the probes match `main`. Implementation applies the ten top-of-file edits in three Luna waves. Verification runs `bash -n` on the nine shell probes, checks that the diff touches only the top lines of the ten files, then runs `GATE` for exit 0. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The failing check exists before any edit: `GATE` exits 1 with 11 ERROR rows, recorded in task T001. It must exit 0 after the edits. `bash -n` on each shell probe proves the edit kept the file parseable. The probes are archived records that hard-code worktree 352 paths, so they are not run. No new test is added, because the guard is the test.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash`, `python3` for `V` and `git`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a probe that someone runs again behaves differently because of strict mode. Revert the one commit, which restores the ten files, and the gate fails again with the same 11 rows.
<!-- /ANCHOR:rollback -->

---
