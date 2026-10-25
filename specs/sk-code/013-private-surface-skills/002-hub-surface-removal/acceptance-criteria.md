---
title: "Acceptance Criteria: Phase 2: hub-surface-removal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one, with its proof command in a fenced block."
trigger_phrases:
  - "hub surface removal acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/002-hub-surface-removal"
    last_updated_at: "2026-10-24T11:01:04.139Z"
    last_updated_by: "codex"
    recent_action: "AC-001–012 Met; AC-013–014 Unmet after T039–T104/T107 evidence."
    next_safe_action: "SWE-2 review (T105), validate (T106), commit and push (T108)."
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deepseek-v4.1-flash-1017-002-planning"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: hub-surface-removal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/013-private-surface-skills/002-hub-surface-removal
**Level:** 3
**Status:** In progress (~90%)
**Date:** 2026-10-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. Every command lives in the fenced block below the table, never in a table cell: a copied cell keeps its escaped pipes and reads as a false zero.

| AC-ID | REQ | Given / When / Then | Status | Waiver |
|-------|-----|---------------------|--------|--------|
| AC-001 | REQ-001 | Given the phase is implemented, When the tracked tree is filtered for the two packet folders, Then no tracked path remains under either and the base commit still holds all 226 | Met | - |
| AC-002 | REQ-002 | Given the phase is implemented, When the mode registry is read, Then only the three shipped packets are declared and the surface axis lists one | Met | - |
| AC-003 | REQ-002 | Given the phase is implemented, When the stage-one router is read, Then the tie-break order, the router signals and the vocabulary classes name no removed surface | Met | - |
| AC-004 | REQ-003 | Given the leaf manifest was regenerated, When it is searched for the removed packets, Then it names none | Met | - |
| AC-005 | REQ-004 | Given `ROUTER.md` was hand-edited, When it is searched and the sync guard runs, Then no removed-surface path or token survives and the projection reconciles | Met | - |
| AC-006 | REQ-004 | Given the derived metadata was regenerated, When it is read, Then `causal_summary` describes two workflow modes and one surface and no surface key survives | Met | - |
| AC-007 | REQ-005 | Given the phase is implemented, When the hub and its consumers are searched outside the D6 kept records, Then no removed packet name and no bare `WEBFLOW` / `OBSIDIAN` surface token survives, apart from the four kept tag-vocabulary lines | Met | - |
| AC-008 | REQ-006 | Given every document edit is done, When the doc-claims gate runs, Then it reports nothing | Met | - |
| AC-009 | REQ-007 | Given the phase is implemented, When the hub's four suites run, Then all pass | Met | - |
| AC-010 | REQ-007 | Given the phase is implemented, When the doctor, sk-doc and manifest suites run, Then all pass | Met | - |
| AC-011 | REQ-008 | Given the phase is implemented, When the D6 records that survive the two deleted surface folders are diffed against the base commit, Then nothing changed, and the only `z_archive` diff is the two live authored twins | Met | - |
| AC-012 | REQ-009 | Given the canary fixture was edited, When it is compared with its authored twin and the link is checked, Then the twin matches and `.opencode/skills` still resolves | Met | - |
| AC-013 | SC-002 | Given the hub now ships three packets, When a plain system-code prompt is routed, Then the hub still wins and the Skilled surface is its target — observed 2026-10-24 after the advisor rebuild and the sk-code manifest refresh: `advisor_recommend` for `implement a typescript script` prints `sk-code sk-code-skilled` | Met | - |
| AC-014 | REQ-010 | Given the phase is committed and pushed to `main`, When the packet validator runs on the final state, Then the packet passes and the remote matches the local commit | Unmet | - |

#### Progress notes (uncommitted worktree state, 2026-10-24)

- AC-001 — Met. `git ls-tree -r --name-only 42b41dd286 | grep -cE '^\\.skilled/skills/sk-code/sk-code-(webflow|obsidian)/'` returned 226. `git ls-files | grep -cE '^\\.skilled/skills/sk-code/sk-code-(webflow|obsidian)/' || echo 0` returned 0; T004 reports both folders absent.
- AC-002 — Met. The AC-002 registry command returned sk-code-quality,sk-code-review,sk-code-skilled and [\"sk-code-skilled\"], as recorded by T006-T013.
- AC-003 — Met. The AC-003 router command returned the three-mode tie-break, three router signals and 11 vocabulary classes, as recorded by T009-T013.
- AC-004 — Met. `generate-leaf-manifest.cjs --check` printed leaf-manifest.json OK; T014 confirms no removed packet names remain.
- AC-005 — Met. `rg -ci 'webflow|obsidian' .skilled/skills/sk-code/ROUTER.md || echo 0` returned 0. Router-sync reported 5/5 checks passed and T097 reported pass 9, fail 0.
- AC-006 — Met. `rg -ci 'webflow|obsidian' .skilled/skills/sk-code/graph-metadata.json || echo 0` returned 0. The AC node check for one read-only surface evidence packet returned true.
- AC-007 — Met. T107 returned 12 for the positive control, 0 for the removed packet-name scan and 4 kept tag-vocabulary lines.
- AC-008 — Met. `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs | tail -1` printed doc-claims: 4/4 checks passed.
- AC-009 — Met. T096 printed PASS, T097 printed ℹ pass 9 and ℹ fail 0, T098 printed ℹ pass 14 and ℹ fail 0, and T099 printed PASS.
- AC-010 — Met. T101 printed ℹ pass 109 and ℹ fail 0, T102 printed PASS, README parity printed PARITY PASS: verdict diff is empty, and manifest validation printed manifest=reproducible.
- AC-011 — Met. T104 phase-scoped D6 comparisons returned 20, 0 and 0 after excluding the unrelated cli-external-orchestration manifest.
- AC-012 — Met. `diff <live fixture> <authored twin> && echo IDENTICAL` printed IDENTICAL. `test -L .opencode/skills && echo LINK-OK` printed LINK-OK, and the link checker reported 0 broken links.
- AC-013 — Unmet. The recommendation command returned sk-code first, but compiledRoute was absent because compiled-route.cjs returned the legacy sentinel. T103 remains Partial pending the T108 manifest refresh.
- AC-014 — Unmet. The documentation validation run printed RESULT: PASSED, but T105 review, final T106 closure and T108 commit/push remain open.


### AC-001

Positive control: the same pattern finds the 226 files at the base commit.

```bash
git ls-tree -r --name-only 42b41dd286 | grep -cE '^\.skilled/skills/sk-code/sk-code-(webflow|obsidian)/'
```

Zero check: no tracked path remains under either folder.

```bash
git ls-files | grep -cE '^\.skilled/skills/sk-code/sk-code-(webflow|obsidian)/' || echo 0
```

Expected: `226`, then `0`.

### AC-002

```bash
node -e "const r=require('./.skilled/skills/sk-code/mode-registry.json');console.log(r.modes.map(m=>m.workflowMode).join(','), JSON.stringify(r.extensions['surface-axis'].surfaces))"
```

Expected: `sk-code-quality,sk-code-review,sk-code-skilled ["sk-code-skilled"]`

### AC-003

```bash
node -e "const r=require('./.skilled/skills/sk-code/hub-router.json');console.log(JSON.stringify(r.routerPolicy.tieBreak));console.log(Object.keys(r.routerSignals).join(','));console.log(Object.keys(r.vocabularyClasses).join(','))"
```

Expected, three lines:

```text
["sk-code-quality","sk-code-review","sk-code-skilled"]
sk-code-quality,sk-code-review,sk-code-skilled
hub-identity,quality-aliases,quality-gates,quality-restraint,code-review-aliases,code-review-findings,code-review-security,code-review-pr,code-skilled-aliases,code-skilled-runtime,code-skilled-authoring
```

### AC-004

Positive control: the pattern finds four lines in the manifest at the base commit.

```bash
git show 42b41dd286:.skilled/skills/sk-code/leaf-manifest.json | grep -cE 'sk-code-(webflow|obsidian)'
```

Zero check:

```bash
rg -c 'sk-code-(webflow|obsidian)' .skilled/skills/sk-code/leaf-manifest.json || echo 0
```

Expected: `4`, then `0`.

### AC-005

Positive control: the pattern finds 152 packet-name lines and 20 token lines in `ROUTER.md` at the base commit.

```bash
git show 42b41dd286:.skilled/skills/sk-code/ROUTER.md | grep -cE 'sk-code-(webflow|obsidian)'
git show 42b41dd286:.skilled/skills/sk-code/ROUTER.md | grep -cE 'WEBFLOW|OBSIDIAN'
```

Zero check, then the projection guard:

```bash
rg -ci 'webflow|obsidian' .skilled/skills/sk-code/ROUTER.md || echo 0
node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs 2>&1 | grep -E '^# fail'
node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs | tail -1
```

Expected: `152`, `20`, then `0`, `# fail 0`, `router-sync: 5/5 checks passed`.

### AC-006

Positive control: the pattern finds 30 lines in the metadata at the base commit.

```bash
git show 42b41dd286:.skilled/skills/sk-code/graph-metadata.json | grep -ciE 'webflow|obsidian'
```

Zero check:

```bash
rg -ci 'webflow|obsidian' .skilled/skills/sk-code/graph-metadata.json || echo 0
node -e "const m=require('./.skilled/skills/sk-code/graph-metadata.json');console.log(m.derived.causal_summary.includes('one read-only surface evidence packet'))"
```

Expected: `30`, then `0`, then `true`.

### AC-007

Positive control: the packet-name pattern finds 12 lines in `SKILL.md` at the base commit, and the token pattern finds four lines in the three kept files today.

```bash
git show 42b41dd286:.skilled/skills/sk-code/SKILL.md | grep -cE 'sk-code-(webflow|obsidian)'
rg -c 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md .skilled/skills/sk-code/shared/references/universal/code-style-guide.md .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh
```

Zero check on packet names:

```bash
rg -c 'sk-code-webflow|sk-code-obsidian' .skilled/skills/sk-code .skilled/bin .skilled/commands/doctor .skilled/skills/sk-doc README.md .skilled/skills/README.txt --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' || echo 0
```

Token check: exactly four surviving lines in three files, and nothing under `.hermes/`.

```bash
rg -n 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code* --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | wc -l
rg -l 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code* --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | wc -l
```

Expected: `12`, then `2` and `1` and `1` (one per kept file), then `0`, then `4`, then `3`.

### AC-008

```bash
node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs | tail -1
```

Expected: `doc-claims: 4/4 checks passed`

### AC-009

```bash
node .skilled/bin/tests/compiled-route-surface-hint.test.cjs >/dev/null && echo surface-hint-PASS
bash .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh >/dev/null && echo typo-flags-PASS
node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs 2>&1 | grep -E '^# fail'
node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs 2>&1 | grep -E '^# fail'
```

Expected: `surface-hint-PASS`, then `typo-flags-PASS`, then `# fail 0`, then `# fail 0`.

### AC-010

```bash
node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs 2>&1 | grep -E '^# fail'
node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs >/dev/null && echo leaf-resource-PASS
python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py | tail -1
python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py | tail -1
```

Expected: `# fail 0`, then `leaf-resource-PASS`, then `PARITY PASS: verdict diff is empty`, then `manifest=reproducible`.

### AC-011

Positive control: the base commit holds the kept records the diff is measured against.

```bash
git ls-tree -r --name-only 42b41dd286 -- .skilled/skills/sk-code/changelog .skilled/changelog | wc -l
```

Zero check on the surviving records:

```bash
git diff --name-only 42b41dd286 -- '.skilled/skills/sk-code/changelog/**' '.skilled/skills/sk-code/sk-code-quality/changelog/**' '.skilled/skills/sk-code/sk-code-review/changelog/**' '.skilled/skills/sk-code/sk-code-skilled/changelog/**' '.skilled/skills/sk-code/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-quality/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-review/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-skilled/benchmark/reports/**' '.skilled/changelog/**' '.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-*' '.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/**' | wc -l
```

The only `z_archive` diff is the two live authored twins:

```bash
git diff --name-only 42b41dd286 -- 'specs/**/z_archive/**' | grep -vE 'canary-cases\.v1\.json|013-live-activation/activation/sk-code/manifest\.json' | wc -l
```

Expected: a non-zero control count, then `0`, then `0`.

### AC-012

```bash
diff .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json && echo IDENTICAL
test -L .opencode/skills && echo LINK-OK
```

Expected: `IDENTICAL`, then `LINK-OK`.

### AC-013

```bash
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a typescript script"}' --format json | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const r=JSON.parse(s).data.recommendations[0];console.log(r.skillId, r.compiledRoute.targets.map(t=>t.packetId).join(','))})"
```

Expected: `sk-code sk-code-skilled`

### AC-014

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/002-hub-surface-removal --strict | tail -1
git status --porcelain | wc -l
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" && echo IN_SYNC
```

Expected: `RESULT: PASSED`, then `0`, then `IN_SYNC`.

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

Implementation is in progress at about 90%. AC-001 through AC-012 are Met with evidence above. AC-013 remains Unmet because the compiled route still returns the legacy sentinel pending the T108 manifest refresh. AC-014 remains Unmet until the SWE-2 review, final validation and commit/push finish. The trigger-index zero count stays with CI and phase 5. AC-007 keeps the three surviving tag-vocabulary files and dated historical records inside the D6 boundary.
<!-- /ANCHOR:closure -->
