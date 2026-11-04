---
title: "Feature Specification: Frontend upstream proposals from Barter's frontend practice program"
description: "Phase parent that plans the 13 Skilled proposals from Barter's frontend practice program: a dedicated stack-agnostic sk-code-frontend surface with the five-pass Figma check and the overrides contract, two tooling fixes, three design hand-offs, generic playbook scenarios and four proposals that each start with a confirming read."
trigger_phrases:
  - "frontend upstream proposals phase parent spec"
  - "sk-code-frontend surface plan"
  - "barter frontend proposals for skilled"
  - "five-pass figma check plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-frontend-upstream-proposals"
    last_updated_at: "2026-11-03T18:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed all six phases"
    next_safe_action: "None; the Barter re-pin is Barter's next step"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/mode-registry.json"
      - ".skilled/skills/sk-code/hub-router.json"
      - ".skilled/skills/sk-code/ROUTER.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Canonical sk-code is web only for frontend practice; React Native surfaces live in a project fork (operator, 2026-11-03; 007 ADR-001, superseding 001 ADR-001)."
      - "Router reach defaults to concurrency 2, decided from a measured run (002 ADR-002)."
      - "The Barter no-commit rule does not bind this packet: it follows the normal sk-git-skilled flow (operator, 2026-11-03)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Frontend upstream proposals from Barter's frontend practice program

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-03 |
| **Branch** | `worktrees/314-frontend-upstream-proposals` |
| **Parent Spec** | None |
| **Parent Packet** | sk-code/018-frontend-upstream-proposals |
| **Predecessor** | `specs/sk-code/017-portable-code-modes/` |
| **Successor** | None |
| **Handoff Criteria** | Each child closes on its own acceptance criteria, and `validate.sh --strict --recursive` on this folder prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skilled's sk-code hub has no frontend guidance. Its surface axis lists only `sk-code-ci` and `sk-code-skilled` (`.skilled/skills/sk-code/mode-registry.json:19`), and neither sk-code nor mcp-figma defines a check of a built screen against its design or hands an open visual value to `sk-design-fundamentals`. Barter's frontend practice program built and audited that guidance for Barter. Along the way it found tooling defects in Skilled's router and continuity scripts, and it ranked 13 proposals for Skilled in the primary checkout's gitignored `barter/ai-speckit/specs/barter-framework/001-coder-skilled-v4-conversion/028-frontend-practice-program/005-skilled-upstream-proposals/proposals.md`.

### Purpose
These phases bring the stack-agnostic part of that work into Skilled as a dedicated `sk-code-frontend` surface, fix the tooling defects the program confirmed, and settle each defect it only inferred with one read or run before any fix. No Barter-only content comes across.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A dedicated `sk-code-frontend` surface packet in sk-code: a peer of `sk-code-ci`, not part of `sk-code-quality`. It carries the core practice page, the web layer, the six web topic files, the five-pass Figma check and the per-mode Frontend overrides contract (ranks 1 to 3). Phase 001 also shipped a React Native layer, and phase 007 removed it.
- Two router-tooling fixes: orphan-phrase pruning in the intent-signal generator, and a safer default concurrency for router reach (ranks 4 and 9).
- Three design hand-offs into `sk-design-fundamentals`: an open-value pointer, a reduced-motion section and an optional project-profile slot (ranks 5 to 7).
- Generic playbook scenarios for mcp-figma and sk-design-fundamentals (rank 8).
- Ranks 10 to 13, each opened by the one read or run that confirms its INFERRED part, with a fix only where that read confirms the gap.

### Out of Scope
- Barter-only content: the Barter App UI Profile, `@barter-bv` tokens, `barter-design-tokens.md` and its precedence order, the Angular mappings, the `@ngx-translate` notes, the declared Safari 18.0 and Firefox ESR browser floors, the eight Barter mode overrides, and every Barter repository mode and alias. These stay in `barter-overlays/`.
- Editing Barter's overlays or re-pinning Barter. Section 5 lists what the Barter conversion has to rework after each phase lands. That rework is Barter's own packet.
- The deep-research gateway refusing `lock_released`. Proposals section 4 shows Skilled works as designed there.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-code/mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `graph-metadata.json`, `ROUTER.md`, `SKILL.md` | Modify | 001-frontend-surface-mode | Register and route the new surface |
| `.skilled/skills/sk-code/sk-code-frontend/` | Create | 001-frontend-surface-mode | The surface packet, its `ROUTER.md`, the references and `figma-to-code.md` |
| `.skilled/skills/mcp-tooling/mcp-figma/SKILL.md` | Modify | 001, 003 | The check pointer, then the fundamentals hand-off line |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs`, `ci-router-vocabulary-reach.cjs` and their tests | Modify | 002-tooling-fixes | Orphan pruning and default concurrency |
| `.skilled/skills/sk-code/README.md`, `.skilled/skills/sk-design/sk-design-fundamentals/SKILL.md`, `references/motion-principles.md` | Modify | 003-design-handoffs | Hand-off line, profile slot, reduced-motion section |
| mcp-figma and sk-design-fundamentals `manual-testing-playbook/` | Create | 004-playbook-scenarios | Five generic scenarios and the index counts |
| `leaf-route-replay.cjs`, the sk-code stage-one alias matcher, `generate-trigger-index.mjs`, `generate-context.ts` | Modify, if confirmed | 005-inferred-confirmations | One fix per rank whose confirming read holds |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-frontend-surface-mode/ | Ranks 1 to 3: the `sk-code-frontend` surface, the five-pass Figma check, the overrides contract and its own router-reach run | Complete |
| 2 | 002-tooling-fixes/ | Ranks 4 and 9: orphan-phrase pruning and reach default concurrency | Complete |
| 3 | 003-design-handoffs/ | Ranks 5 to 7: open values to `sk-design-fundamentals`, reduced motion, the profile slot | Complete |
| 4 | 004-playbook-scenarios/ | Rank 8: generic mcp-figma and fundamentals playbook scenarios | Complete |
| 5 | 005-inferred-confirmations/ | Ranks 10 to 13: one confirming read or run each, then a fix only where it holds | Complete |
| 6 | 006-open-items-and-alignment/ | The five items phases 001 to 005 left open, then two alignment passes over the touched skills until a recheck leaves nothing open | Complete |
| 7 | 007-web-only-frontend/ | Remove the React Native layer from canonical sk-code: the frontend surface keeps web practice and the Figma check | Complete |
| 8 | 008-release-coverage/ | Fold the packet into the root release notes and README, and add a release-coverage check to the alignment harness | Complete |
| 9 | 009-reference-restructure/ | Rebuild the nine frontend references to the sk-doc reference template and remove the Angular-specific rules | Complete |
| 10 | 010-reference-readability-research/ | Research every sk-code reference and asset, then fix them and add render checks and a strict gate to sk-create-skill | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-frontend-surface-mode | 002-tooling-fixes | The surface routes and its vocabulary reaches sk-code with no outrank on sk-code, sk-design or mcp-tooling | `ci-router-vocabulary-reach.cjs --hub <hub> --concurrency 2` prints `outranked=  0` for each of the three hubs |
| 002-tooling-fixes | 003-design-handoffs | `--check` reports orphan phrases and reach defaults to the safer setting | Both scripts' test suites exit 0 |
| 003-design-handoffs | 004-playbook-scenarios | The hand-off line, the reduced-motion section and the profile slot exist | `rg -n "sk-design-fundamentals"` hits the three hand-off files |
| 004-playbook-scenarios | 005-inferred-confirmations | The five scenarios exist and both playbook validators pass | The playbook validator exits 0 for mcp-figma and for sk-design-fundamentals |
| 005-inferred-confirmations | 006-open-items-and-alignment | Ranks 10 to 12 shipped with revert-proven tests, rank 13 dropped, and the open items it left are listed | `005-inferred-confirmations/decision-record.md` holds four rank verdicts and its summary lists the known limitations |
| 006-open-items-and-alignment | 007-web-only-frontend | Every routing gate is green and no finding is open | `006-open-items-and-alignment/scratch/final-suites.txt` and `reach-final.txt` |
| 007-web-only-frontend | 008-release-coverage | The surface is web-only and every routing gate and the alignment recheck are clean | `007-web-only-frontend/scratch/final-suites.txt` and `alignment-fixes.md` |
| 008-release-coverage | 009-reference-restructure | The release notes, README and release-coverage check are on main | `008-release-coverage/scratch/release-check-after.txt` |
| 009-reference-restructure | 010-reference-readability-research | The nine frontend references follow the template and every gate passes | `009-reference-restructure/scratch/final-gates.txt` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open. The React Native question was answered twice by the operator: phase 001 kept stack-agnostic React Native practice in canonical sk-code (`001-frontend-surface-mode/decision-record.md` ADR-001), and phase 007 reversed it, so canonical sk-code is web only and React Native surfaces live in a project fork (`007-web-only-frontend/decision-record.md` ADR-001). The rank 9 choice was decided from a measured run: reach defaults to concurrency 2 (`002-tooling-fixes/decision-record.md` ADR-002).
<!-- /ANCHOR:questions -->

---

## 5. BARTER RE-PIN IMPACT

Barter pins Skilled at `4f583afbe7` (in the primary checkout's gitignored tree: `barter/ai-speckit/skilled/barter-overlays/overlay-manifest.json:6` and `sync-state.json:3`). Each phase that lands changes a file a Barter overlay copies or replaces. The Barter conversion re-pins and reworks these. This packet only lists them.

| After phase | Barter overlay that needs rework |
|-------------|----------------------------------|
| 001, 007 | The web files in `barter-overlays/sk-code/shared/references/frontend/` become thin overlays on `sk-code-frontend`; `barter-design-tokens.md`, the Barter deltas and every React Native file stay Barter-owned, since phase 007 keeps React Native out of canonical sk-code. |
| 001 | The Frontend overrides heading in the eight overlay modes that carry it (`sk-code-bartender`, `sk-code-barter-expo`, `sk-code-barter-scrooge`, `sk-code-fe-backoffice-app`, `sk-code-fe-barter-managed`, `sk-code-fe-creators-mobile`, `sk-code-fe-partners-app`, `sk-code-fe-ui-components`) re-points at the new surface's sections. |
| 001 | The sk-code playbook overlays `design-restraint/frontend-overrides-contract.md` and `frontend-topic-file-reach.md`. |
| 001, 003 | `barter-overlays/mcp-tooling/mcp-figma/SKILL.base.md` and `SKILL.barter.md` re-base on the new check pointer and the hand-off line. |
| 002 | The pin-restore workaround in `barter-overlays/sk-design/README.md:25` can retire, since `--write` prunes orphan phrases. |
| 003 | `barter-overlays/sk-design/sk-design-fundamentals/SKILL.md` and `ROUTER.md` drop their whole-file router pins, and `references/barter-app-ui-profile.md` moves into the profile slot. |
| 004 | The Barter mcp-figma `figma-to-code/*` scenarios and the fundamentals `profile-load/unknown-repo.md` and `value-discipline/*` scenarios become upstream duplicates to drop or overlay. |

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent goal**: See `goal.md` for the durable directive and the binding to each child goal
- **Source proposals** (gitignored, primary checkout only): `barter/ai-speckit/specs/barter-framework/001-coder-skilled-v4-conversion/028-frontend-practice-program/005-skilled-upstream-proposals/proposals.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
