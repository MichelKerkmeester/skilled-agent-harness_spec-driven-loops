---
title: "Acceptance Criteria: Phase 2: builtin-runner"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "builtin runner acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/002-builtin-runner"
    last_updated_at: "2026-10-25T23:21:48Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: ["001-honest-checker has not landed"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-builtin-runner"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 2: builtin-runner

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/015-quality-agnostic-gate/002-builtin-runner
**Level:** 2
**Status:** Draft
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Commands run from the repository root. Set the variables from `tasks.md` (`Q`, `H`, `P`), then set `TEST=$Q/scripts/tests/quality-gate.test.cjs`. A `\|` inside a table cell stands for a plain `|` in the command.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a changed file in a folder, When the runner runs with `--files`, Then one verdict prints and the fixture snapshot is unchanged | `node --test --test-name-pattern='^F01' $TEST` prints `# fail 0` | Unmet | - |
| AC-002 | REQ-002 | Given an untracked file and a folder outside git, When the runner runs, Then every line of those files counts as changed | `node --test --test-name-pattern='^F03\|^F10' $TEST` prints `# fail 0` | Unmet | - |
| AC-003 | REQ-003 | Given a blocking P0 and an UNVERIFIED check in one run, When the verdict is built, Then the exit code is 1 and no output carries a pass value | `node --test --test-name-pattern='unit: exit precedence' $TEST` prints `# fail 0` | Unmet | - |
| AC-004 | REQ-004 | Given a check that writes to a tracked file, When it runs under the guard, Then the run ends with `CHECK_MUTATED_WORKSPACE` and exit 3 | `node --test --test-name-pattern='unit: argv spawn and guard' $TEST` prints `# fail 0` | Unmet | - |
| AC-005 | REQ-005 | Given one old violation on an unchanged line and one on a changed line, When hygiene runs, Then the changed line blocks and the unchanged line blocks only with a whole-file layer present | `node --test --test-name-pattern='^F0[34]' $TEST` prints `# fail 0` | Unmet | - |
| AC-006 | REQ-006 | Given a conflict marker and a secret signature in changed lines, When the sensors run, Then both block and the secret finding carries no matched text | `node --test --test-name-pattern='^F12' $TEST` prints `# fail 0` | Unmet | - |
| AC-007 | REQ-007 | Given a `.sh` file with a Python shebang and a `.sh` file with a bash shebang that does not close its `if`, When the syntax floor runs, Then the first parses clean and the second gets a P0 parse finding | `node --test --test-name-pattern='^F1[38]' $TEST` prints `# fail 0` | Unmet | - |
| AC-008 | REQ-008 | Given a repository with a pre-commit hook, a CI workflow and a post-edit hook path that is missing, When the layers probe runs, Then each layer reports its own state | `node --test --test-name-pattern='unit: layers' $TEST` prints `# fail 0` | Unmet | - |
| AC-009 | REQ-009 | Given a changed workflow file and a file inside the fixture hub's `.skilled/`, When checklists resolve, Then each lists its hub checklist with the `hub:` prefix and the floor appears for both | `node --test --test-name-pattern='^F1[46]' $TEST` prints `# fail 0` | Unmet | - |
| AC-010 | REQ-010 | Given a symlink to another repository, a `..` path and a path with spaces, When surfaces resolve, Then only paths inside the hub's `.skilled/` resolve to SKILLED | `node --test --test-name-pattern='unit: real-path guard' $TEST` prints `# fail 0` | Unmet | - |
| AC-011 | REQ-011 | Given the registry after the declarations land, When its modes are listed, Then the SKILLED and `sk-code-ci` entries carry `quality` and the registry still compiles | `node .skilled/bin/compiled-route-sync.cjs --check && node -p "require('./$H/mode-registry.json').modes.filter(m => m.quality).map(m => m.workflowMode).join(',')"` prints `sk-code-skilled,sk-code-ci` | Unmet | - |
| AC-012 | REQ-011 | Given a `quality` block with an unknown role or no selector, When the compiler validates the registry, Then it fails with `QUALITY_DECLARATION_INVALID` | `node --test --test-name-pattern='unit: compiler rejects' $TEST` prints `# fail 0` | Unmet | - |
| AC-013 | REQ-012 | Given the SKILLED surface from `declaredSurfaces`, When its fields are read, Then `pathMarkers` and `contentMarkers` are arrays beside the merged `markers` list | `node -p "(s => Array.isArray(s.pathMarkers) && Array.isArray(s.contentMarkers))(require('./$H/sk-code-skilled/assets/scripts/router-replay-lib.cjs').declaredSurfaces('./$H')[0])"` prints `true` | Unmet | - |
| AC-014 | REQ-013 | Given a finished run, When the envelope renders, Then it carries the `code-quality/v1` keys, the grammar `code-quality-run/v1 gate=` in `checker_outputs`, and `PENDING_AGENT_JUDGMENT` in each judgment field | `node --test --test-name-pattern='unit: envelope' $TEST` prints `# fail 0` | Unmet | - |
| AC-015 | REQ-014 | Given a private `local-example` surface in a fixture hub, When the envelope renders, Then the label `EXAMPLE` appears and no `local-` text does | `node --test --test-name-pattern='unit: private label' $TEST` prints `# fail 0` | Unmet | - |
| AC-016 | REQ-015 | Given the twelve named fixtures, When they run together, Then each passes and each asserts the snapshot is unchanged | `node --test --test-name-pattern='^F(0[1-5]\|10\|1[234]\|1[678])' $TEST 2>&1 \| rg '^# (pass\|fail)'` prints `# pass 12` and `# fail 0` | Unmet | - |
| AC-017 | REQ-016 | Given `python3` absent from the path, When hygiene runs, Then it reports `SKIPPED_ABSENT`, the run reports UNVERIFIED and exits 4, and hygiene never reads clean | `node --test --test-name-pattern='^F17' $TEST` prints `# fail 0` | Unmet | - |
| AC-018 | REQ-017 | Given the new code files, When the comment hygiene check runs, Then it prints `clean` and no code comment names a packet, phase, REQ, ADR or task id | `python3 $Q/scripts/check-comment-hygiene.sh $Q/scripts/quality-gate.cjs $Q/scripts/lib/run-check.cjs $Q/scripts/tests/fixtures.cjs $TEST && echo clean` prints `clean` | Unmet | - |
| AC-019 | REQ-018 | Given the runner reference, When its headings are counted, Then the contract has its eight sections | `rg -c '^## ' $Q/references/runner-contract.md` prints `8` | Unmet | - |
| AC-020 | REQ-018 | Given the reader table in `stack-detection.md`, When the runner is searched for, Then one row names it inside the table | `rg -n 'quality-gate' $H/shared/references/stack-detection.md` prints one line numbered between 121 and 128 | Unmet | - |
| AC-021 | REQ-019 | Given the `Q/SKILL.md` target map, When it is compared with the declarations, Then the two are equal | `node --test --test-name-pattern='unit: target map' $TEST` prints `# fail 0` | Unmet | - |
| AC-022 | REQ-020 | Given each flag `--lines`, `--only`, `--skip`, `--no-run`, `--timeout` and `--explain`, When it runs, Then it behaves as `runner-contract.md` section 1 states | `node --test --test-name-pattern='unit: flags' $TEST` prints `# fail 0` | Unmet | - |
| AC-023 | REQ-021 | Given `--config` with any path, When the runner starts, Then it rejects the flag with a usage error and exit 3 | `node $Q/scripts/quality-gate.cjs --config /dev/null --files $Q/scripts/check-comment-hygiene.sh > /dev/null 2>&1 \|\| echo "exit=$?"` prints `exit=3` | Unmet | - |
| AC-024 | REQ-022 | Given the new versions, When the packet and the hub are read, Then they carry 1.6.0.0 and 3.2.0.0 and each has a changelog file | `rg -n '^version: 1\.6\.0\.0$' $Q/SKILL.md && rg -n '^version: 3\.2\.0\.0$' $H/SKILL.md && node -p "[require('./$H/hub-router.json').version, require('./$H/mode-registry.json').version, require('./$H/description.json').version].join(',')"` prints the two version lines and `3.2.0.0,3.2.0.0,3.2.0.0` | Unmet | - |
| AC-025 | REQ-023 | Given a declared generated path, When the dist adapter runs, Then it runs the per-file mode with `SPECKIT_DIST_AUTO_REBUILD=0` and reads the banner text | `node --test --test-name-pattern='unit: dist adapter' $TEST` prints `# fail 0` | Unmet | - |
| AC-026 | REQ-024 | Given the sk-code script test workflow, When it is linted and searched, Then it runs the quality tests once | `actionlint .github/workflows/sk-code-script-tests.yml && rg -c 'sk-code-quality/scripts/tests' .github/workflows/sk-code-script-tests.yml` prints `1` | Unmet | - |
| AC-027 | REQ-007 | Given the self-run on `check-comment-hygiene.sh`, When the verdict is read, Then SKILLED resolves and no `syntax.` finding appears (SC-003) | `node $Q/scripts/quality-gate.cjs --files $Q/scripts/check-comment-hygiene.sh --format json \| node -p "(v => v.resolved_surface.includes('SKILLED') && !v.findings.some(f => f.rule.startsWith('syntax.')))(JSON.parse(require('fs').readFileSync(0, 'utf8')))"` prints `true` | Unmet | - |
| AC-028 | REQ-010 | Given a temporary Go repository with an untracked `// see ADR-12` comment, When the runner runs without a hub declaration for it, Then the verdict is `BLOCKED` with surface `unknown` and exit 1 (SC-004) | `ROOT=$(git rev-parse --show-toplevel) && T=$(mktemp -d) && git -C "$T" init -q && printf 'package a\n\n// see ADR-12\nfunc A() {}\n' > "$T/a.go" && (cd "$T" && node "$ROOT/$Q/scripts/quality-gate.cjs" > "$T/v.json" \|\| echo "exit=$?") && node -p "(v => v.gate === 'BLOCKED' && v.resolved_surface[0] === 'unknown')(require('$T/v.json'))"` prints `exit=1` and `true` | Unmet | - |
| AC-029 | REQ-011 | Given the hub after the declarations and version bumps, When both validators run, Then both exit 0 (SC-005) | `node .skilled/bin/compiled-route-sync.cjs --check && node .skilled/commands/doctor/scripts/parent-skill-check.cjs $H > /dev/null && echo hub-validators-ok` prints `hub-validators-ok` | Unmet | - |
| AC-030 | REQ-014 | Given the envelope for the checker file, When it is searched, Then it holds no `local-` text and no pass status (SC-006) | `node $Q/scripts/quality-gate.cjs --files $Q/scripts/check-comment-hygiene.sh --format envelope \| grep -c -e 'local-' -e 'status: pass'` prints `0` | Unmet | - |
| AC-031 | All | Given the finished packet, When the strict validator runs, Then its last line reads `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict --no-recursive \| tail -1` prints `RESULT: PASSED` | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

All 31 criteria are `Unmet`. Phase 1 has not landed, and no runner file exists yet. The criteria that carry the packet are AC-001 to AC-030, which map to the seven completion criteria in `goal.md`. Nothing is consciously left out. No criterion is waived.
<!-- /ANCHOR:closure -->
