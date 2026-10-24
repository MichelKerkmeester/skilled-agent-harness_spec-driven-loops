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
    last_updated_at: "2026-10-23T12:40:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Applied T001 to T038 uncommitted; T039 partial; six rows already hold their end state"
    next_safe_action: "Finish T039 (code-quality-standards.md lines 16, 24, 39, 49, 56), then continue at T040"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deepseek-v4.1-flash-1017-002-planning"
      parent_session_id: null
    completion_pct: 35
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
**Status:** Draft
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. Every command lives in the fenced block below the table, never in a table cell: a copied cell keeps its escaped pipes and reads as a false zero.

| AC-ID | REQ | Given / When / Then | Status | Waiver |
|-------|-----|---------------------|--------|--------|
| AC-001 | REQ-001 | Given the phase is implemented, When the tracked tree is filtered for the two packet folders, Then no tracked path remains under either and the base commit still holds all 226 | Unmet | - |
| AC-002 | REQ-002 | Given the phase is implemented, When the mode registry is read, Then only the three shipped packets are declared and the surface axis lists one | Unmet | - |
| AC-003 | REQ-002 | Given the phase is implemented, When the stage-one router is read, Then the tie-break order, the router signals and the vocabulary classes name no removed surface | Unmet | - |
| AC-004 | REQ-003 | Given the leaf manifest was regenerated, When it is searched for the removed packets, Then it names none | Unmet | - |
| AC-005 | REQ-004 | Given `ROUTER.md` was hand-edited, When it is searched and the sync guard runs, Then no removed-surface path or token survives and the projection reconciles | Unmet | - |
| AC-006 | REQ-004 | Given the derived metadata was regenerated, When it is read, Then `causal_summary` describes two workflow modes and one surface and no surface key survives | Unmet | - |
| AC-007 | REQ-005 | Given the phase is implemented, When the hub and its consumers are searched outside the D6 kept records, Then no removed packet name and no bare `WEBFLOW` / `OBSIDIAN` surface token survives, apart from the four kept tag-vocabulary lines | Unmet | - |
| AC-008 | REQ-006 | Given every document edit is done, When the doc-claims gate runs, Then it reports nothing | Unmet | - |
| AC-009 | REQ-007 | Given the phase is implemented, When the hub's four suites run, Then all pass | Unmet | - |
| AC-010 | REQ-007 | Given the phase is implemented, When the doctor, sk-doc and manifest suites run, Then all pass | Unmet | - |
| AC-011 | REQ-008 | Given the phase is implemented, When the D6 records that survive the two deleted surface folders are diffed against the base commit, Then nothing changed, and the only `z_archive` diff is the two live authored twins | Unmet | - |
| AC-012 | REQ-009 | Given the canary fixture was edited, When it is compared with its authored twin and the link is checked, Then the twin matches and `.opencode/skills` still resolves | Unmet | - |
| AC-013 | SC-002 | Given the hub now ships three packets, When a plain system-code prompt is routed, Then the hub still wins and the Skilled surface is its target | Unmet | - |
| AC-014 | REQ-010 | Given the phase is committed and pushed to `main`, When the packet validator runs on the final state, Then the packet passes and the remote matches the local commit | Unmet | - |

#### Progress notes (uncommitted worktree state, 2026-10-24)

Every row stays `Unmet` until the phase commit lands; the notes below record rows
whose end state is already true in the worktree.

- AC-001 — Partial (uncommitted): 226 paths at `42b41dd286`, 0 under `git ls-files`, both folders absent on disk
- AC-002 — Partial (uncommitted): registry prints `sk-code-quality,sk-code-review,sk-code-skilled` and `["sk-code-skilled"]`
- AC-003 — Partial (uncommitted): tie-break, router signals and vocabulary classes name no removed surface
- AC-004 — Partial (uncommitted): regenerated manifest names no removed packet; `--check` prints `leaf-manifest.json OK`
- AC-005 — Partial (uncommitted): `ROUTER.md` `webflow|obsidian` count 0 and `router-sync: 5/5 checks passed`
- AC-011 — Partial (uncommitted): surviving D6 records diff 0 and `z_archive` diff 0 besides the two excluded twins; verified 2026-10-24, re-run at closure

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

Planning is complete and every criterion is still `Unmet`; the packet closes when the implementation tasks in `tasks.md` have run and AC-001 through AC-014 each carry observed evidence. The one thing consciously left out of the criteria is the trigger-index zero count, because CI rebuilds that index after the push and phase 5 owns the proof. AC-007 also leaves out three families the phase deliberately does not touch: the two `benchmark/fixtures/*.private.json` notes that describe a past measurement, the `verify-doc-claims.cjs` retired-name regex that exists to detect the old names, and mixed-case prose in `sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md` that names no packet and no uppercase token. ADR-005 records that boundary.
<!-- /ANCHOR:closure -->
