---
title: "Acceptance Criteria: Phase 3: advisor-vocabulary-cleanup"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "advisor vocabulary cleanup acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup"
    last_updated_at: "2026-10-23T13:10:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Rewrote the criteria for Level 3 with fenced proofs and positive controls"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-003-advisor-vocabulary-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: advisor-vocabulary-cleanup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup
**Level:** 3
**Status:** Draft
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. Every command lives in the fenced proof section below the table.

| AC-ID | REQ | Given / When / Then | Status | Waiver |
|-------|-----|---------------------|--------|--------|
| AC-001 | REQ-001 | Given the in-scope advisor, plugin, Hermes, CI and doctor files, When the surface sweep runs, Then it returns exactly three `webflow cms` lines: `fusion.ts:600`, `fusion.ts:602` and `explicit.ts:131` | Unmet | - |
| AC-002 | REQ-002 | Given a temp skills root holding `alpha` and a `local-beta` symlink whose target is inside that root, When `indexSkillMetadata` runs, Then `local-beta` is a row in `skill_nodes` | Unmet | - |
| AC-003 | REQ-002 | Given the graph linked-inside test, When it ran before the code change, Then it failed on the missing `local-beta` row and the observation is recorded | Unmet | - |
| AC-004 | REQ-003 | Given a workspace whose `.skilled/skills/local-beta` links to a directory inside the skills root, When the linked `SKILL.md` changes, Then `computeAdvisorSourceSignature` returns a different hash | Unmet | - |
| AC-005 | REQ-003 | Given the signature linked-inside test, When it ran before the code change, Then the signature stayed the same and the observation is recorded | Unmet | - |
| AC-006 | REQ-004 | Given a skills dir holding `alpha` and a `local-private` folder, When `discover_graph_metadata` runs, Then the returned names are `['alpha']` | Unmet | - |
| AC-007 | REQ-004 | Given a Hermes fixture source holding `local-webflow/SKILL.md` as a real folder, When the sync writes, Then it reports `Wrote 4 of 4` and no `local-webflow` folder exists under the output | Unmet | - |
| AC-008 | REQ-004 | Given a synthetic skills dir holding a healthy root and a `local-webflow` root, When `findSkillRoots` runs, Then only the healthy root is returned | Unmet | - |
| AC-009 | REQ-004 | Given a repo-shaped temp root whose `.skilled/skills/local-webflow/graph-metadata.json` exists and whose tracked graph does not carry it, When the panel reads disk, Then no `local-webflow` row appears | Unmet | - |
| AC-010 | REQ-006 | Given the four skip-scan tests and the two follow-scan tests, When they ran before their code task, Then every red-first observation is recorded | Unmet | - |
| AC-011 | REQ-005 | Given phase 2 is merged, When the compiler exports the fallback graph, Then no `sk-code` signal matches `webflow` or `obsidian` | Unmet | - |
| AC-012 | REQ-005 | Given the regenerated graph, When the diff is read, Then only sk-code surface signals and the `generated_at` and `skill_count` fields changed | Unmet | - |
| AC-013 | REQ-006 | Given every behavior change, When the red-first table is read, Then seven rows show a failing-before test and four rows are labelled as guards that pass before and after | Unmet | - |
| AC-014 | REQ-007 | Given the surface-hint test, When it runs, Then the hint it forwards is `SKILLED` and the argv assertion passes | Unmet | - |
| AC-015 | REQ-008 | Given the two tool schemas and the advisor README, When they are read, Then the `surfaceHint` example names `SKILLED` and no file names `WEBFLOW` | Unmet | - |
| AC-016 | REQ-009 | Given the no-change decisions, When `implementation-summary.md` is read, Then it records the native-scorer assertion, the zero-hit surface-id re-check and the leaf-manifest screen with their commands | Unmet | - |
| AC-017 | REQ-005 | Given the ambiguity slice was already red at baseline, When the phase ends, Then the live top-1 count is no lower than `17/24` | Unmet | - |
| AC-018 | REQ-001 | Given the final tree, When the packet validator runs, Then it prints `RESULT: PASSED` | Unmet | - |
| AC-019 | REQ-010 | Given a `local-*` link, When its realpath is inside the skills root it is accepted, and when it is outside every trusted root, missing or a regular file it is rejected | Unmet | - |
| AC-020 | REQ-010 | Given a `local-beta` symlink whose target is outside the skills root, When the graph scan runs, Then no `local-` row is written | Unmet | - |
| AC-021 | REQ-010 | Given a signature workspace with a trusted link, an untrusted link and a link into `SPECKIT_PRIVATE_SKILL_ROOTS`, When each target changes, Then only the trusted and declared links move the signature | Unmet | - |
| AC-022 | REQ-010 | Given a `local-*` symlink to a directory outside the scanned tree, When the compiler discovers skills, Then the link is absent | Unmet | - |
| AC-023 | REQ-010 | Given a `local-*` symlink to a directory outside the source tree, When the Hermes sync writes, Then no folder from the link is written | Unmet | - |
| AC-024 | REQ-011 | Given a `local-beta` skill declaring `conflicts_with: alpha`, When the conflict reader runs, Then `declarations['local-beta']` contains `alpha` | Unmet | - |
| AC-025 | REQ-012 | Given the two private source trees at `42b41dd286`, When the leaf-manifest screen runs, Then the fleet control returns 14, the private trees return 0, and the gate reports `checked=14 fresh=14 failed=0` | Unmet | - |
| AC-026 | REQ-013 | Given the final commit, When delivery completes, Then `git status --porcelain` is empty and HEAD equals `origin/main` | Unmet | - |
| AC-027 | REQ-013 | Given the independent review, When it closes, Then its report ends with `VERDICT: CLEAN` or every finding is resolved or recorded | Unmet | - |
| AC-028 | REQ-009 | Given the phase start and the phase end, When `implementation-summary.md` is read, Then the baseline table, the red-first table and the final-counts table are present and agree with the suite runs | Unmet | - |
| AC-029 | REQ-001 | Given the working tree, When the predecessor check runs, Then both surface folders are absent | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The proof command was run and its output matched. |
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

<!-- ANCHOR:proofs -->
## 3. PROOF COMMANDS

Each block is copy-ready. A zero check is preceded by a positive control that proves the same pattern matches a known-present file.

### AC-001

```bash
rg -c -i 'webflow|obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts
rg -n -i 'webflow|obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer .skilled/skills/system-skill-advisor/runtime/tools .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts .skilled/skills/system-skill-advisor/README.md .opencode/plugins/system-skill-advisor.js .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs .skilled/commands/doctor/scripts/skill-graph-freshness.cjs
```

Expected: `2`, then exactly three lines at `fusion.ts:600`, `fusion.ts:602` and `explicit.ts:131`.

### AC-002

```bash
cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts -t 'inside the skills root'
```

Expected: `Tests  1 passed (1)`.

### AC-003

```bash
grep -c '^| T018 ' implementation-summary.md
```

Expected: `1`.

### AC-004

```bash
cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/handlers/advisor-status.vitest.ts -t 'inside the skills root'
```

Expected: `Tests  1 passed (1)`.

### AC-005

```bash
grep -c '^| T021 ' implementation-summary.md
```

Expected: `1`.

### AC-006

```bash
cd .skilled/skills/system-skill-advisor/runtime && python3 tests/python/test_skill_advisor.py | rg 'T246-GC-013'
```

Expected: `PASS: T246-GC-013: graph discovery skips a private skill (local-private absent)`.

### AC-007

```bash
node --test --test-name-pattern 'skips a top-level' .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs
```

Expected: `ℹ tests 1`, `ℹ pass 1`, `ℹ fail 0`.

### AC-008

```bash
node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs
```

Expected: the last line reads `[sk-doc] skill-root-metadata contract + fleet gate coverage passed`.

### AC-009

```bash
cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/doctor/skill-graph-freshness-panel.vitest.ts -t 'private skill on disk'
```

Expected: `Tests  1 passed (1)`.

### AC-010

```bash
grep -c '^| T0' implementation-summary.md
```

Expected: `11`, one red-first or guard row per test task.

### AC-011

```bash
node -e "const g=require('./.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json');console.log(g.signals['mcp-tooling'].filter(x=>/obsidian/i.test(x)).length)"
node -e "const g=require('./.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json');console.log(JSON.stringify(g.signals['sk-code'].filter(x=>/webflow|obsidian/i.test(x))))"
```

Expected: `3`, then `[]`.

### AC-012

```bash
git show --stat --format= "$(git log -1 --format=%H -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json)" -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json
git show "$(git log -1 --format=%H -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json)" -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json | rg -c '^[-+].*sk-code'
git show "$(git log -1 --format=%H -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json)" -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json | rg '^[-+].*mcp-tooling' || echo 0
```

Expected: one file changed, a `sk-code` line count of at least `1`, then `0`.

### AC-013

```bash
grep -c '^| T0' implementation-summary.md
grep -c 'passes before and after' implementation-summary.md
```

Expected: `11`, then `4`.

### AC-014

```bash
cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/advisor-surface-hint.vitest.ts
```

Expected: `Tests  3 passed (3)`.

### AC-015

```bash
git show 42b41dd286:.skilled/skills/system-skill-advisor/README.md | rg -c 'WEBFLOW'
rg -n 'WEBFLOW' .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts .skilled/skills/system-skill-advisor/README.md || echo 0
```

Expected: `1`, then `0`.

### AC-016

```bash
rg -c -i 'obsidian' .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py
rg -n -i 'webflow|obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts .skilled/skills/system-skill-advisor/leaf-aliases.json .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json || echo 0
rg -c 'native-scorer' implementation-summary.md
rg -c 'leaf-manifest' implementation-summary.md
```

Expected: `1`, then `0`, then `1`, then `1`.

### AC-017

```bash
cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/ambiguity-slice.vitest.ts 2>&1 | rg 'live='
```

Expected: a `live=` value of `17/24` or higher; the gate stays red against `baseline=19`.

### AC-018

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict
```

Expected: `RESULT: PASSED`.

### AC-019

```bash
cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/private-skill-target.vitest.ts
```

Expected: `Tests  5 passed (5)`.

### AC-020

```bash
cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts -t 'outside the skills root'
```

Expected: `Tests  1 passed (1)`.

### AC-021

```bash
cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/handlers/advisor-status.vitest.ts -t 'private skill linked'
```

Expected: `Tests  3 passed (3)`.

### AC-022

```bash
cd .skilled/skills/system-skill-advisor/runtime && python3 tests/python/test_skill_advisor.py | rg 'T246-GC-014'
```

Expected: `PASS: T246-GC-014: graph discovery never follows a private link (local-linked absent)`.

### AC-023

```bash
node --test --test-name-pattern 'never follows a local' .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs
```

Expected: `ℹ tests 1`, `ℹ pass 1`, `ℹ fail 0`.

### AC-024

```bash
cd .skilled/skills/system-skill-advisor/runtime && python3 tests/python/test_skill_advisor.py | rg 'T246-CONFLICT-001'
```

Expected: `PASS: T246-CONFLICT-001: a local-* conflict declaration is read`.

### AC-025

```bash
git ls-tree -r --name-only 42b41dd286 -- .skilled/skills | rg -c 'leaf-manifest.json'
git ls-tree -r --name-only 42b41dd286 -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian | rg -c 'leaf-manifest.json' || echo 0
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs --format text | tail -1
```

Expected: `14`, then `0`, then `checked=14 fresh=14 failed=0`.

### AC-026

```bash
git status --porcelain --ignored | rg -c '^!!'
git status --porcelain
git rev-parse HEAD
git rev-parse origin/main
```

Expected: an ignored-file count of at least `1`, then no output from `git status --porcelain`, then two identical hashes.

### AC-027

```bash
tail -1 /tmp/phase3-review.txt
```

Expected: `VERDICT: CLEAN`, or a `VERDICT: FINDINGS` line whose findings are all resolved or recorded.

### AC-028

```bash
rg -n '### Baseline' implementation-summary.md
rg -n '### Red-first evidence' implementation-summary.md
rg -n '### Final counts' implementation-summary.md
sed -n '/^ *### Final counts/,/^ *## Known Limitations/p' implementation-summary.md | grep -c '^ *| '
```

Expected: one match for each heading, then `16` table lines.

### AC-029

```bash
test ! -d .skilled/skills/sk-code/sk-code-webflow && test ! -d .skilled/skills/sk-code/sk-code-obsidian && echo absent
```

Expected: `absent`.
<!-- /ANCHOR:proofs -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

The criteria close the packet when the seven scan decisions are proven, the tracked graph carries no sk-code surface signal, and delivery ends with HEAD equal to `origin.main`. Nothing is waived: every criterion is either met by a task or blocks closure.
<!-- /ANCHOR:closure -->
