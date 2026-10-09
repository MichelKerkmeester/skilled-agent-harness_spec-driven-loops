---
title: "Tasks: Phase 6: guard-retirement-notes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "guard retirement notes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: guard-retirement-notes

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Run every command from the repository root, in one shell, after setting these variables:

```bash
OC=.skilled/skills/sk-code/sk-code-opencode
SCRIPT=$OC/scripts/run-all-drift-guards.sh
SREADME=$OC/scripts/README.md
SKILL=$OC/SKILL.md
AVA=$OC/references/shared/alignment-verification-automation.md
BENCH=.skilled/skills/sk-code/benchmark/README.md
PHASE=specs/sk-code/011-sk-code-poinytail-based-refinement/006-guard-retirement-notes
```

In parentheses at the end of each task, these names identify the file the task touches. The gap owner is sk-code in every note.

- [x] T001 Capture the umbrella baseline: `bash "$SCRIPT" > "$PHASE"/scratch/drift-before.txt 2>&1; echo "rc=$?" >> "$PHASE"/scratch/drift-before.txt`. Record the exit code and the `PASS:`/`FAIL:` lines. In the worktree on 2026-10-09 it exited 0 with both guards passing and stack-folders at 6 folders; the main checkout exited 1 on an unrelated uncommitted file the worktree does not carry. Record whatever this run prints (SCRIPT) Evidence: baseline retained; not rerun
- [x] T002 [P] Capture the script static baselines: `bash -n "$SCRIPT"; echo rc=$?` and `shellcheck "$SCRIPT"; echo rc=$?`. Both were 0 at planning time (SCRIPT) Evidence: both previously reported rc=0
- [x] T003 [P] Capture the doc baselines: `for f in "$BENCH" "$SREADME" "$SKILL" "$AVA"; do python3 .skilled/skills/sk-doc/scripts/validate_document.py --blocking-only "$f"; echo "rc=$?"; done`. All four printed `VALID`, 0 issues, rc 0 at planning time (BENCH, SREADME, SKILL, AVA) Evidence: four documents previously reported 'VALID', rc=0
- [x] T004 [P] Capture the routing baselines. First run `python3 "$OC"/assets/scripts/verify_alignment_drift.py --root .skilled/skills/sk-code --check-router; echo rc=$?`: rc 0, Errors 0, Warnings 0 at planning time. Then run `node .skilled/bin/compiled-route-guard.cjs; echo rc=$?`: rc 0 with `sk-code fresh`. Then run `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs; echo rc=$?`: `checked=14 fresh=14 failed=0`. Last, run `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs; echo rc=$?`: `checked=14 fresh=14 stale=0 errored=0` (SKILL) Evidence: alignment errors 0; 'checked=14 fresh=14 failed=0'; 'checked=14 fresh=14 stale=0 errored=0'
- [x] T005 Confirm the edit targets have not drifted. Halt and report if any differs: Evidence: all edit targets matched
  - `sed -n 50,53p "$SCRIPT"` shows the four-line router-sync comment.
  - `sed -n 14p "$BENCH"` shows the `**Retired lane:**` blockquote.
  - `sed -n 12p "$SREADME"` ends with `has no replacement yet.`
  - `sed -n 20p "$SREADME"` ends with `is recorded as missing |`.
  - `sed -n 55,59p "$SKILL"` shows the comment from `# parent-owned universal/shared tier.` to `# only), so it is not the equality authority.`
  - `sed -n 173p "$SKILL"` contains `so the wrapper no longer runs it.`
  - `sed -n 58,61p "$AVA"` runs from `router block only).` to `These remain manual review gates:`.
  - `sed -n 69,71p "$AVA"` shows the last list item, a blank line and `### Severity model`.
  - `sed -n 123,126p "$AVA"` shows the Doc pointer item.

  (SCRIPT, BENCH, SREADME, SKILL, AVA)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Use no packet, phase or commit ids in any edit, per comment hygiene. Use no em dashes.

- [x] T006 Replace the comment block at lines 50-53 (from `# The third guard was a router-sync suite` through `# one lane, so it is recorded as missing rather than quietly dropped.`) with the block below. Keep the blank line before it (49) and after it (54). Change no other line (SCRIPT:50-53) Evidence: anchor matched once

```bash
# Retired guard: the router-sync suite (sk-code-router-sync.vitest.ts), deleted with the
# skill-benchmark lane that hosted it. It checked four things:
#   1. every path in the machine-readable router exists on disk, every routable
#      reference or asset doc is routed, and every full path the prose maps name is routed;
#   2. the parent surface RESOURCE_MAP equals the union of the surface children's maps
#      plus the parent tier;
#   3. compiled route-gold destinations, leaf-manifest.json and the code-opencode
#      RESOURCE_MAP agree through qualifiedIdToLeaf;
#   4. every playbook routing scenario's expected_resource is emitted by the router.
# Successor, partial: the dead-path part of check 1 is the alignment-drift guard above
# (--check-router). .github/workflows/routing-registry-drift.yml covers the compiled side
# of checks 3 and 4, in CI only: its compiled-serving admission step scores compiled
# decisions against playbook routing gold through qualifiedIdToLeaf but runs --warn-only,
# and its leaf-manifest freshness step byte-checks every leaf-manifest.json. No step
# reads RESOURCE_MAP.
# Gap: orphan and prose-path coverage (check 1), parent-equals-union (check 2),
# RESOURCE_MAP-to-manifest agreement (check 3) and the surface-router side of check 4
# have no guard. Owner: sk-code.
```

- [x] T007 Insert one blank line and then the blockquote below directly after line 14 (the `**Retired lane:**` blockquote), before the existing blank line 15. Keep every other line as it is (BENCH:14) Evidence: anchor matched once

```markdown
> **Successor:** the router-mode CI gate has a partial successor in `.github/workflows/routing-registry-drift.yml`. Its compiled-serving admission step scores each hub's compiled decisions against its playbook routing gold, warn-only, and its golden-prompt job checks skill selection and the compiled workflow mode. Together they cover part of D1 routing. D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity and live-mode scoring have no successor. Owner of that gap: sk-code.
```

- [x] T008 On line 12, replace the final sentence `A third guard, the router-sync suite, was retired with its lane and has no replacement yet.` with the text below. Keep the rest of line 12 as it is (SREADME:12) Evidence: anchor matched once

```markdown
A third guard, the router-sync suite, was retired with its lane and has no full replacement. It checked four things: (1) every path in the machine-readable router exists on disk, every routable reference or asset doc is routed, and every full path the prose maps name is routed; (2) the parent surface RESOURCE_MAP equals the union of the surface children's maps plus the parent tier; (3) compiled route-gold destinations, `leaf-manifest.json` and the code-opencode RESOURCE_MAP agree through `qualifiedIdToLeaf`; (4) every playbook routing scenario's `expected_resource` is emitted by the router. The dead-path part of (1) is `verify_alignment_drift.py --check-router`, which this entrypoint runs. `.github/workflows/routing-registry-drift.yml` covers the compiled side of (3) and (4), in CI only: its compiled-serving admission step runs `--warn-only`, and its leaf-manifest freshness step byte-checks every `leaf-manifest.json`. No step reads RESOURCE_MAP. Orphan and prose-path coverage in (1), all of (2), the RESOURCE_MAP-to-manifest leg of (3) and the surface-router side of (4) have no guard. Owner of the gap: sk-code.
```

- [x] T009 On line 20, replace the cell text `the retired router-sync guard is recorded as missing` with `a comment after the guard calls records the retired router-sync guard's four checks, its partial successor, the gap and the owner (sk-code)`. Keep the table pipes (SREADME:20) Evidence: anchor matched once
- [x] T010 Replace lines 55-59 of the router-block comment, from `# parent-owned universal/shared tier. The sk-code-router-sync.vitest.ts suite` through `# only), so it is not the equality authority.`, with the block below. Do not touch lines 52-54 or any `DEFAULT_RESOURCE`/`RESOURCE_MAP` line (SKILL:55-59) Evidence: anchor matched once

```python
# parent-owned universal/shared tier. The sk-code-router-sync.vitest.ts suite
# that enforced that equality was deleted with the skill-benchmark lane, and no
# guard checks it now: .github/workflows/routing-registry-drift.yml never reads
# RESOURCE_MAP. verify_alignment_drift.py --check-router checks dead routes only,
# so it is not the equality authority. The suite's other three checks, what
# partly covers each and the gap owner (sk-code) are recorded in
# scripts/run-all-drift-guards.sh.
```

- [x] T011 On the line that holds it (173 before T010, 175 after T010 adds two lines), replace the sentence `The third guard, the \`sk-code-router-sync.vitest.ts\` suite, was deleted with the skill-benchmark lane, so the wrapper no longer runs it.` with the text below. Keep the rest of the bullet as it is (SKILL:173) Evidence: anchor matched once

```markdown
The third guard, the `sk-code-router-sync.vitest.ts` suite, was deleted with the skill-benchmark lane, so the wrapper no longer runs it. It checked four things: (1) router paths exist on disk, every routable doc is routed, and every full path the prose maps name is routed; (2) the parent RESOURCE_MAP equals the union of the surface children's maps plus the parent tier; (3) compiled route-gold destinations, `leaf-manifest.json` and this RESOURCE_MAP agree through `qualifiedIdToLeaf`; (4) every playbook routing scenario's `expected_resource` is emitted by the router. The dead-path part of (1) is `--check-router`. `.github/workflows/routing-registry-drift.yml` covers the compiled side of (3) and (4), in CI only and warn-only for the admission step, and never reads RESOURCE_MAP. The rest of (1), all of (2), the RESOURCE_MAP leg of (3) and the surface-router side of (4) have no guard. Owner of the gap: sk-code.
```

- [x] T012 Edit AVA from the bottom up, so the line numbers in T013 and T014 stay valid. First replace lines 123-126 (the Doc pointer item, through `markdown-blind \`verify_alignment_drift.py\` is not that authority.`) with the block below (AVA:123-126) Evidence: anchor matched once

```markdown
1. **Doc pointer.** This file plus the code-opencode `SKILL.md` SMART ROUTING
   block, which record that the `sk-code-router-sync.vitest.ts` suite was
   deleted, that nothing checks RESOURCE_MAP equality now, and what partly
   covers its other checks (section 3, "Retired router-sync suite"). The
   markdown-blind `verify_alignment_drift.py` is not that authority.
```

- [x] T013 Insert the subsection below after line 69 (the last list item, ending `CommonJS defaults.`), with one blank line before it. Keep the blank line before `### Severity model` (AVA:69) Evidence: anchor matched once

```markdown
### Retired router-sync suite

The `sk-code-router-sync.vitest.ts` suite was deleted with the skill-benchmark
lane. It checked four things:

1. Every path in the machine-readable router exists on disk, every routable
   reference or asset doc is routed, and every full path the prose maps name
   is routed.
2. The parent surface RESOURCE_MAP equals the union of the surface children's
   maps plus the parent tier.
3. Compiled route-gold destinations, `leaf-manifest.json` and the code-opencode
   RESOURCE_MAP agree through `qualifiedIdToLeaf`.
4. Every playbook routing scenario's `expected_resource` is emitted by the
   router.

| Check | Coverage now |
|---|---|
| 1, dead paths | `verify_alignment_drift.py --check-router`, run by `scripts/run-all-drift-guards.sh` |
| 1, orphans and prose paths | None |
| 2 | None |
| 3, compiled side | `.github/workflows/routing-registry-drift.yml`, CI only: the compiled-serving admission step (`--warn-only`, never fails the job) and the leaf-manifest freshness step |
| 3, RESOURCE_MAP to manifest | None; no workflow step reads RESOURCE_MAP |
| 4, compiled side | The same admission step, scoring compiled decisions against playbook routing gold, `--warn-only` |
| 4, surface router | None |

Owner of every gap marked None: sk-code.
```

- [x] T014 Replace lines 58-61 (from `router block only). It still never inspects markdown prose. RESOURCE_MAP` through `skill-benchmark lane. These remain manual review gates:`) with the block below (AVA:58-61) Evidence: anchor matched once

```markdown
router block only). It still never inspects markdown prose. RESOURCE_MAP
parent-child *equality* is not checked by this script either; "Retired
router-sync suite" below records the suite that checked it and what covers its
checks now. These remain manual review gates:
```
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 REQ-001, script: `rg -n -e 'routing-registry-drift.yml' -e '^# Successor, partial:' -e '^# Gap:' -e 'Owner: sk-code' "$SCRIPT"`. Expect at least one hit for each of the four patterns, all inside the comment block after line 48 (SCRIPT) Evidence: successor, gap, owner and workflow path found
- [x] T016 REQ-001, Lane C index: `rg -n -e '\*\*Successor:\*\*' -e 'routing-registry-drift.yml' -e 'Owner of that gap: sk-code' "$BENCH"`. Expect hits on the first non-blank line after the `**Retired lane:**` blockquote (BENCH) Evidence: successor, workflow path and owner found on line 16
- [x] T017 REQ-001, the three code-opencode docs: `for f in "$SREADME" "$SKILL" "$AVA"; do echo "== $f"; rg -c 'routing-registry-drift.yml' "$f"; rg -c 'sk-code\)|Owner of (the|every) gap' "$f"; rg -c 'has no replacement yet|recorded as missing|nothing checks it now\.' "$f"; done`. For each file, expect the first two counts to be 1 or more. Expect the third `rg` to print nothing and exit 1, because the stale wording is gone (SREADME, SKILL, AVA) Evidence: successor/owner counts positive; stale-wording searches empty, expected exit 1
- [x] T018 REQ-001, four-check accuracy: `rg -n 'union of the surface children' "$SCRIPT" "$SREADME" "$SKILL" "$AVA"` and `rg -n 'qualifiedIdToLeaf' "$SCRIPT" "$SREADME" "$SKILL" "$AVA"`. Expect a hit in each of the four files for both patterns. In `SKILL.md`, both hits come from the new line 173 text (SCRIPT, SREADME, SKILL, AVA) Evidence: both phrases found in all four files
- [x] T019 REQ-002, script still runs: `bash "$SCRIPT" > "$PHASE"/scratch/drift-after.txt 2>&1; echo "rc=$?" >> "$PHASE"/scratch/drift-after.txt`, then `diff <(grep -E '^(PASS|FAIL|rc=|run-all-drift-guards:)' "$PHASE"/scratch/drift-before.txt) <(grep -E '^(PASS|FAIL|rc=|run-all-drift-guards:)' "$PHASE"/scratch/drift-after.txt)`. Expect no output: the exit code and guard verdicts match T001 (SCRIPT) Evidence: no diff output, exit 0
- [x] T020 REQ-002, comment-only script change: `git diff -U0 -- "$SCRIPT" | grep -E '^[+-]' | grep -vE '^(\+\+\+|---)' | grep -vE '^[+-][[:space:]]*(#|$)'`. Expect no output (SCRIPT) Evidence: orchestrator rerun with fsmonitor off: comment-only diff filter prints nothing (exit 1, expected)
- [x] T021 REQ-002, script static checks: `bash -n "$SCRIPT"; echo rc=$?` and `shellcheck "$SCRIPT"; echo rc=$?`. Expect rc 0 for both, matching T002 (SCRIPT) Evidence: both rc=0
- [x] T022 Router block unchanged in substance: `git diff -U0 -- "$SKILL" | grep -E '^[+-]' | grep -vE '^(\+\+\+|---)' | grep -vE '^[+-][[:space:]]*(#|$)' | grep -v 'The third guard, the'`. Expect no output: inside the router block only `#` lines changed, and outside it only line 173 changed. Then run `python3 "$OC"/assets/scripts/verify_alignment_drift.py --root .skilled/skills/sk-code --check-router; echo rc=$?` and expect rc 0, Errors 0, no `ROUTER-DEAD-PATH`, matching T004 (SKILL) Evidence: orchestrator rerun: SKILL.md diff filter prints nothing; router check exit 0, Errors 0, no ROUTER-DEAD-PATH
- [x] T023 Compiled-routing freshness: `node .skilled/bin/compiled-route-guard.cjs; echo rc=$?`, `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs; echo rc=$?` and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs; echo rc=$?`. Expect the T004 results. If sk-code reports stale, do not re-mint: record the output in the report for the orchestrator, because the pre-commit `gate:route-remint` re-mints at commit time (SKILL) Evidence: all hubs fresh; freshness checks report 14/14 fresh, zero failures or stale entries
- [x] T024 Docs still valid: `for f in "$BENCH" "$SREADME" "$SKILL" "$AVA"; do python3 .skilled/skills/sk-doc/scripts/validate_document.py --blocking-only "$f"; echo "rc=$?"; done`. Expect `VALID`, 0 issues, rc 0 for each, matching T003 (BENCH, SREADME, SKILL, AVA) Evidence: each printed 'VALID', 0 issues, rc=0
- [x] T025 SC-001, no retired guard is silent: `rg -n -i 'retired|router-sync' "$SCRIPT" "$BENCH" "$SREADME" "$SKILL" "$AVA"`. For each hit that names the router-sync suite or the Lane C router-mode gate, confirm that the same comment block, paragraph, bullet or the next blockquote names the partial successor or the gap, and the owner sk-code. Exception: the `SKILL.md` router-block comment satisfies this by pointing at `scripts/run-all-drift-guards.sh` (SCRIPT, BENCH, SREADME, SKILL, AVA) Evidence: relevant mentions carry or point to coverage, gaps and owner
- [x] T026 No em dash and scope check: `git diff -U0 -- "$SCRIPT" "$BENCH" "$SREADME" "$SKILL" "$AVA" | rg '^\+.*\x{2014}'` prints nothing, meaning no added line contains U+2014. Then `git status --porcelain -- .skilled/skills/sk-code .skilled/bin` must show no file changed by this phase other than the five named here. Another phase building at the same time may list its own files (all five) Evidence: orchestrator rerun: added-line em-dash rg prints nothing (exit 1); status shows the five scoped files plus the orchestrator's leaf-manifest and Hermes regenerations
- [x] T027 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PHASE" --strict` and require `RESULT: PASSED` (PHASE) Evidence: validate.sh --strict prints RESULT: PASSED, Errors: 0 Warnings: 0
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
<!-- /ANCHOR:cross-refs -->

---
