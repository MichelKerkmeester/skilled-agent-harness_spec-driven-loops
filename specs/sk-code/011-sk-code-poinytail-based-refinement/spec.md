---
title: "Feature Specification: sk-code Ponytail 5 refinement"
description: "Phase parent that mines Ponytail 5 for teachings, logic and new ideas to improve the sk-code hub, its nested modes and surfaces, and related tooling."
trigger_phrases:
  - "sk code poinytail based refinement phase parent spec"
  - "sk-code ponytail 5 refinement"
  - "ponytail based refinement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement"
    last_updated_at: "2026-10-10T10:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed phase 008, the round-two research recommendations"
    next_safe_action: "Operator reviews the worktree branch before it merges"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-code Ponytail 5 refinement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-09 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-code/011-sk-code-poinytail-based-refinement |
| **Predecessor** | `../z_archive/015-sk-code-ponytail-based-refinement/spec.md` |
| **Successor** | None |
| **Handoff Criteria** | Every phase goal's criteria pass and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Ponytail is an external coding-agent plugin that teaches restraint: write the least code that meets the requirement, and still ship tests for risky logic. An earlier packet, `z_archive/015-sk-code-ponytail-based-refinement`, already moved some of its teachings into sk-code and sk-code-review. Since then Ponytail shipped version 5.1.0, rebuilt from the ground up, and sk-code became a two-axis hub with two workflow modes and three surface packets. Nobody has checked what Ponytail 5 adds, or whether the earlier adoptions survived the hub restructure.

### Purpose
Find the Ponytail 5 teachings, mechanisms and ideas worth adopting across the sk-code hub, every nested mode and surface, and related tooling, then plan and build the ones that hold up.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Ponytail 5.1.0 source copy in `context/`, read as reference material only.
- The sk-code hub: `SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json` and `shared/`.
- The nested packets: `sk-code-quality`, `sk-code-review`, `sk-code-webflow`, `sk-code-opencode` and `sk-code-obsidian`.
- Related tooling that sk-code relies on or that Ponytail suggests, such as hooks, benchmarks and rule-copy checks.

### Out of Scope
- Editing anything inside `context/`. It is a vendored reference copy.
- Installing Ponytail or any of its runtime plugins.
- The sk-code advisor-accuracy failure the probe battery already shows, and any change to `agent-io-contract.md`.

### Cross-Phase Execution Rules

These bind every build phase, 002 to 006.

| ID | Rule |
|----|------|
| E1 | Each build phase is executed by cli-codex with `--model gpt-6-luna`, reasoning effort `max` and service tier `fast`. The dispatcher reads `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` before the first dispatch |
| E2 | The executor's report is a claim. The orchestrator reruns every completion criterion in the phase's `goal.md` itself before the phase counts as done |
| E3 | All build work happens in one numbered git worktree created through the sk-git skill's worktree workflow before the first edit. No branch is created with raw git commands. This packet folder is untracked, so it is copied into the worktree before the first edit, and every packet doc update happens in that copy |
| E4 | Phases run in order 002, 003, 004, 005, 006. Phase 003 never starts before 002 is complete |
| E5 | A phase is complete only when every criterion in its `goal.md` passes, its `implementation-summary.md` is filled, `repair-derived.cjs --apply` has run on it and `validate.sh --strict` on it prints `RESULT: PASSED` |
| E6 | Each complete phase gets one conventional commit in the worktree. Nothing is pushed |
| E7 | A phase that still fails after three repair attempts stops the run; the failure is reported with the command and its output |

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-ponytail-deep-research/research/` | Create | ponytail-deep-research | Deep-research state, iterations and synthesis |
| sk-code hub, playbook and routing fixture | Modify | surface-contract-alignment | See `002-surface-contract-alignment/spec.md` |
| sk-code shared standards and rule-copy canary | Modify | doctrine-pass | See `003-doctrine-pass/spec.md` |
| Webflow and OpenCode checker scripts | Modify | webflow-checker-fix | See `004-webflow-checker-fix/spec.md` |
| sk-code-review contract and review agent mirrors | Modify | review-output-additions | See `005-review-output-additions/spec.md` |
| Drift-guard script and retired-guard docs | Modify | guard-retirement-notes | See `006-guard-retirement-notes/spec.md` |
| Review checker, leaf generator, mirror gate, hook stdin reader, router-sync guard | Modify | follow-up-fixes | See `007-follow-up-fixes/spec.md` |
| sk-code routing, review contract, code agents, quality scripts, pre-commit mirror gate, two repo rules | Modify | round-two-recommendations | See `008-round-two-recommendations/spec.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-ponytail-deep-research/ | Ten-iteration deep research over Ponytail 5 with two CLI lineages | Complete |
| 2 | 002-surface-contract-alignment/ | One surface precedence order, Obsidian coverage, stale stack-folder scenario, Obsidian canary case | Complete |
| 3 | 003-doctrine-pass/ | Reuse step and reach list in the ladder and implement workflow; never-cut pointer and canary pins | Complete |
| 4 | 004-webflow-checker-fix/ | Callback error capture in the Webflow pre-deploy checker; known-bad inputs for two checkers | Complete |
| 5 | 005-review-output-additions/ | "Not checked:" line, workload note, User impact rewording, removal search line, final-line check | Complete |
| 6 | 006-guard-retirement-notes/ | Owner and partial-successor notes for retired guards | Complete |
| 7 | 007-follow-up-fixes/ | Five follow-up fixes found while building 002 to 006, one child each | Complete |
| 8 | 008-round-two-recommendations/ | The round-two research recommendations that still hold, one child per group | Complete |
| 9 | 009-round-two-follow-ups/ | Five follow-ups the round-two build left open, one child each | Complete |
| 10 | 010-round-three-remediation/ | Every round-three finding and the five 009 follow-ups, one child per file area | Complete |
| 11 | 011-round-four-remediation/ | The eleven items round three left open, one child per file area | Complete |
| 12 | 012-post-merge-deep-review/ | Ten-iteration deep review of the epic on main after the merge | Complete |
| 13 | 013-root-cause-and-ux-research/ | Ten-iteration deep research into the root causes of the epic's issues and the external-user experience, plus six fix phases | Complete |
| 14 | 014-skill-authoring-ux-research/ | Research on how sk-create-skill and system-skill-advisor can make the 092 class of authoring errors near impossible | Complete |
| 15 | 015-closeout/ | Close every item the epic left open: fixed with proof, or closed with a written reason | Complete |
| 16 | 016-residual-closeout/ | Fix what the closeout left: package strict, hooks README voice, admission gold, battery misses, hooks vitest scope, and a DeepSeek review of the closeout with its fixes | Complete |
| 17 | 017-release-changelog/ | Record the epic's and the catalog anchor track's user-facing changes in the v4.0.0.4 release entry | Complete |
| 18 | 018-create-sh-unknown-options/ | Make create.sh refuse an unknown option instead of adding it to the title, and fix the docs that passed a flag it never had | Complete |
| 19 | 019-routing-miss-fixes/ | Fix the three routing misses the closeout left: DOC-331 in the deep-loop router, and P4 and P7 in the advisor | Complete |
| 20 | 020-open-ends-research/ | Five ten-iteration loops on the epic's open ends: doc versions, fresh-clone onboarding, playbook and catalog truth, routing evaluation and silent CLI input | Complete |
| 21 | 021-open-ends-remediation/ | Build every recommendation the open ends research kept: typo-proof parsers, onboarding fixes, doc and catalog truth, and routing parity in CI | Complete |
| 22 | 022-doc-version-and-playbook-paths/ | Give every skill doc its own automatically raised version again, and resolve every unresolved backticked playbook path | Complete |
| 23 | 023-readme-freshness-research/ | Ten-iteration research into whether the root README and its related READMEs still hold after the v4.0.0.4 changes; research only | Complete |
| 24 | 024-readme-freshness-fixes/ | Apply the README fixes F1 to F23 from the 023 research and retire doctor check 13c, so a hub README keeps its own version | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-ponytail-deep-research | 002-surface-contract-alignment | Research amended after independent re-review | `validate.sh --strict` on 001 |
| 002-surface-contract-alignment | 003-doctrine-pass | One precedence order in `code-quality-standards.md`, since 003 edits the same paragraph | `rg -n "OPENCODE >"` over sk-code |
| 003-doctrine-pass | 004-webflow-checker-fix | None; 004 is independent and may run in parallel | n/a |
| 004-webflow-checker-fix | 005-review-output-additions | None; 005 is independent | n/a |
| 005-review-output-additions | 006-guard-retirement-notes | None; 006 is independent | n/a |
| 006-guard-retirement-notes | 007-follow-up-fixes | 006 committed; drift guards and leaf manifests fresh | Orchestrator rerun of the 011 goal criteria |
| 007-follow-up-fixes | 008-round-two-recommendations | 007 committed; round-two findings rechecked against the tree | Orchestrator rerun of the 011 goal criteria |
| 008-round-two-recommendations | 009-round-two-follow-ups | 008 committed; its recorded follow-ups rechecked against the tree | Orchestrator rerun of the 011 goal criteria |
| 009-round-two-follow-ups | 010-round-three-remediation | 009 committed; round-three findings recorded in the research | Orchestrator rerun of the 011 goal criteria |
| 010-round-three-remediation | 011-round-four-remediation | 010 committed; its open items recorded in the children's Known Limitations | Orchestrator rerun of the 011 goal criteria |
| 011-round-four-remediation | 012-post-merge-deep-review | 011 committed and merged to main | Orchestrator rerun of the 012 goal criteria |
| 012-post-merge-deep-review | 013-root-cause-and-ux-research | None; 012, 013 and 014 ran in parallel from main and were merged on one integration branch | `validate.sh --recursive --strict` on the parent |
| 013-root-cause-and-ux-research | 014-skill-authoring-ux-research | None; see the row above | `validate.sh --recursive --strict` on the parent |
| 014-skill-authoring-ux-research | 015-closeout | 012 to 014 merged on the integration branch with every gate green | `validate.sh --recursive --strict` on the parent |
| 015-closeout | 016-residual-closeout | 015 committed with every gate green | `validate.sh --recursive --strict` on the parent |
| 016-residual-closeout | 017-release-changelog | 016 committed and both tracks on origin/main | `validate.sh --recursive --strict` on the parent |
| 017-release-changelog | 018-create-sh-unknown-options | 017 committed and on origin/main | `validate.sh --recursive --strict` on the parent |
| 018-create-sh-unknown-options | 019-routing-miss-fixes | 018 committed and on origin/main | `validate.sh --recursive --strict` on the parent |
| 019-routing-miss-fixes | 020-open-ends-research | 019 committed and on origin/main; 020 is read-only research | `validate.sh --recursive --strict` on the parent |
| 020-open-ends-research | 021-open-ends-remediation | The five 020 syntheses merged; 021's four children build in parallel | `validate.sh --recursive --strict` on the parent |
| 021-open-ends-remediation | 022-doc-version-and-playbook-paths | 021 merged; 022's two children build in parallel from the scaffold commit | `validate.sh --recursive --strict` on the parent |
| 022-doc-version-and-playbook-paths | 023-readme-freshness-research | 022 on origin/main; 023 is read-only research | `validate.sh --recursive --strict` on the parent |
| 023-readme-freshness-research | 024-readme-freshness-fixes | 023 synthesis committed; the operator approved every fix and ruled that each doc keeps its own version | `validate.sh --recursive --strict` on the parent |

### Handoffs Outside sk-code

These defects came out of the research and belong to other owners, so phases 002 to 006 left them alone. At the operator's direction, phase 007 built both: D2 in `007-follow-up-fixes/003-codex-mirror-gate/`, D4 in `007-follow-up-fixes/004-hook-stdin-deadline/`.

| Defect | Owner | Change needed |
|--------|-------|---------------|
| D2: Codex-only agent changes pass the mirror check | deep-improvement and the git hooks | Add `codex` to `check-agent-mirror-sync.cjs:32`, both pre-commit greps (`.skilled/hooks/git/pre-commit:87`, `.skilled/scripts/git-hooks/pre-commit:170`) and the orphan list, with a Codex regression case |
| D4: no stdin deadline | hooks | One deadline in `.skilled/hooks/shared/hook-adapter-shared.cjs:14`, with the post-edit adapters switched to it, keeping fail-open behavior |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Answered 2026-10-10: the research synthesis proposed phases 002 to 006, and phase 007 closed the gaps found while building them.
- Answered 2026-10-10: yes. The surface precedence order and the Obsidian coverage around it were lost (`001-ponytail-deep-research/research/research.md` section 8); phase 002 restored both.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Earlier refinement**: `../z_archive/015-sk-code-ponytail-based-refinement/research/research.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
