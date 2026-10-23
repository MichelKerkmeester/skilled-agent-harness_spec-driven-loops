---
title: "Acceptance Criteria: Phase 2: hub-surface-removal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hub surface removal acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/002-hub-surface-removal"
    last_updated_at: "2026-10-23T07:03:39Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
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
**Level:** 2
**Status:** Draft
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase is implemented, When `git ls-files` is filtered for the two packet folders, Then no tracked path remains under either | `git ls-files \| grep -E "^\.skilled/skills/sk-code/sk-code-(webflow\|obsidian)/"` — expected: no output, exit status 1 | Unmet | - |
| AC-002 | REQ-002 | Given the phase is implemented, When the mode registry is read, Then only the three shipped packets are declared and the surface axis lists one | `node -e "const r=require('./.skilled/skills/sk-code/mode-registry.json');console.log(r.modes.map(m=>m.workflowMode).join(','),JSON.stringify(r.extensions['surface-axis'].surfaces))"` — expected: `sk-code-quality,sk-code-review,sk-code-skilled ["sk-code-skilled"]` | Unmet | - |
| AC-003 | REQ-002 | Given the phase is implemented, When the stage-one router is read, Then the tie-break order, the router signals and the vocabulary classes name no removed surface | `node -e "const r=require('./.skilled/skills/sk-code/hub-router.json');console.log(JSON.stringify(r.routerPolicy.tieBreak),Object.keys(r.routerSignals).join(','),Object.keys(r.vocabularyClasses).join(','))"` — expected: `["sk-code-quality","sk-code-review","sk-code-skilled"] sk-code-quality,sk-code-review,sk-code-skilled` and a class list with no `code-webflow-*` or `code-obsidian-*` entry | Unmet | - |
| AC-004 | REQ-003 | Given the leaf manifest was regenerated, When it is searched for the removed packets, Then it names none | `rg -n "sk-code-(webflow\|obsidian)" .skilled/skills/sk-code/leaf-manifest.json` — expected: no output, exit status 1 | Unmet | - |
| AC-005 | REQ-004 | Given section 11 of `ROUTER.md` was hand-edited, When it is searched and the sync guard runs, Then no removed-surface path survives and the projection reconciles | `rg -n "sk-code-(webflow\|obsidian)" .skilled/skills/sk-code/ROUTER.md \| wc -l` — expected: `0`; then `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` — expected: exit 0 | Unmet | - |
| AC-006 | REQ-004 | Given the derived metadata was regenerated, When `causal_summary` is read, Then it describes two workflow modes and one surface | `rg -n "sk-code-(webflow\|obsidian)\|WEBFLOW\|OBSIDIAN" .skilled/skills/sk-code/graph-metadata.json` — expected: no output, exit status 1 | Unmet | - |
| AC-007 | REQ-005 | Given the phase is implemented, When the hub and its consumers are searched outside the D6 kept records, Then neither a removed packet name nor a bare `WEBFLOW` / `OBSIDIAN` surface token survives, apart from the three kept tag-vocabulary files | `rg -n "sk-code-webflow\|sk-code-obsidian" .skilled/skills/sk-code .skilled/bin .skilled/commands/doctor .skilled/skills/sk-doc README.md .skilled/skills/README.txt --glob '!**/changelog/**' --glob '!**/benchmark/reports/**'` — expected: no output, exit status 1; then the phase-wide token proof `rg -n 'WEBFLOW\|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code* --glob '!**/changelog/**' --glob '!**/benchmark/reports/**'` — expected: exactly four lines, two in `manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md`, one in `shared/references/universal/code-style-guide.md` (the kept `WEBFLOW:` row that also carries `MOTION:` and `LENIS:`) and one in `sk-code-quality/scripts/check-comment-hygiene.sh`, with nothing under `.hermes/`; the file-level form `rg -l` with the same globs lists exactly those three files | Unmet | - |
| AC-008 | REQ-006 | Given every document edit is done, When the doc-claims gate runs, Then it reports nothing | `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` — expected: exit 0, `doc-claims: 4/4 checks passed`, no `FAIL` line | Unmet | - |
| AC-009 | REQ-007 | Given the phase is implemented, When the hub's four suites run, Then all pass | `node .skilled/bin/tests/compiled-route-surface-hint.test.cjs` and `bash .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh` and `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` and `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs` — expected: exit 0 for each | Unmet | - |
| AC-010 | REQ-007 | Given the phase is implemented, When the doctor and sk-doc suites run, Then both pass | `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` and `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs` — expected: exit 0 for each | Unmet | - |
| AC-011 | REQ-008 | Given the phase is implemented, When the D6 records that survive the two deleted surface folders are diffed against the base commit, Then nothing changed, and the only `z_archive` diff is the two live authored twins | `git diff --name-only 42b41dd286 -- '.skilled/skills/sk-code/changelog/**' '.skilled/skills/sk-code/sk-code-quality/changelog/**' '.skilled/skills/sk-code/sk-code-review/changelog/**' '.skilled/skills/sk-code/sk-code-skilled/changelog/**' '.skilled/skills/sk-code/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-quality/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-review/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-skilled/benchmark/reports/**' '.skilled/changelog/**'` — expected: no output; then `git diff --name-only 42b41dd286 -- 'specs/**/z_archive/**'` — expected: only the canary fixture and the compiled-routing activation manifest | Unmet | - |
| AC-012 | REQ-009 | Given the canary fixture was edited, When it is compared with its authored twin and the link is checked, Then the twin matches and `.opencode/skills` still resolves | `diff .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` — expected: no output; `test -L .opencode/skills` — expected: exit 0 | Unmet | - |
| AC-013 | SC-002 | Given the hub now ships three packets, When a plain system-code prompt is routed, Then the hub still wins and the Skilled surface is its target | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a typescript script"}' --format json \| node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const r=JSON.parse(s).data.recommendations[0];console.log(r.skillId, r.compiledRoute.targets.map(t=>t.packetId).join(','))})"` — expected: `sk-code sk-code-skilled` | Unmet | - |
| AC-014 | REQ-010 | Given the phase is committed and pushed to `main`, When the packet validator runs on the final state, Then the packet passes and the remote matches the local commit | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/002-hub-surface-removal --strict` — expected: `RESULT: PASSED`; then `git status --porcelain` — expected: no output; and `git rev-parse HEAD` equals `git rev-parse origin/main` | Unmet | - |

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

Planning is complete and every criterion is still `Unmet`; the packet closes when the implementation tasks in `tasks.md` have run and AC-001 through AC-014 each carry observed evidence. The one thing consciously left out of the criteria is the trigger-index zero count, because CI rebuilds that index after the push and phase 5 owns the proof.
<!-- /ANCHOR:closure -->
