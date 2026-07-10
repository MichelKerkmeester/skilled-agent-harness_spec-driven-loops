---
title: "Tasks: Phase 2: sk-prompt-124-remediation"
description: "Task list for the sk-prompt/124 remediation: verify each of 12 candidate findings, apply Cluster A/B/C1 fixes, re-verify, exclude C2."
trigger_phrases:
  - "sk-prompt 124 remediation tasks"
  - "prompt-improve hardening tasks"
  - "referrer sweep tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/002-sk-prompt-124-remediation"
    last_updated_at: "2026-07-10T05:50:20Z"
    last_updated_by: "claude"
    recent_action: "T023 A5 sweep done; 26 tasks complete"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/commands/prompt-improve.md"
      - ".opencode/agents/prompt-improver.md"
      - ".claude/agents/prompt-improver.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "127-deep-review-remediation-002-sk-prompt-124-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: sk-prompt-124-remediation

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

- [x] T001 Read fix manifest `phase2-sk-prompt.md` - 10 review findings reconciled into 12 concrete edit targets across Clusters A (4 findings, merge-introduced), B (3 findings, pre-existing), and C (2 candidates, doc-accuracy).
- [x] T002 Read `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/review/review-report.md` §3 registry in full - confirmed the manifest's severity nuances (e.g. R1/R4/R7 nominally P1 but adjudicated effective P2) and the WS-B "pre-existing, not merge-caused" framing.
- [x] T003 [P] Verified all 12 findings against live files before editing - `prompt-improver.md:62,83,156,231,362` (opencode) and `:47,68,141,216,347` (claude) all confirmed stale `/prompt`; `prompt-models/SKILL.md:4` confirmed `allowed-tools: []`; `mode-registry.json` confirmed `prompt-models` toolSurface.allowed = `[Read, Grep, Glob]`; playbook `manual_testing_playbook.md:56` confirmed stale hub-root path; `README.md:55,180,181` and `context_budget.md:243` confirmed dead top-level path; `prompt-improve.md:93,441-457,579` confirmed all 3 Cluster B gaps live.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 A1: Fixed `.opencode/agents/prompt-improver.md` - 5 stale `/prompt` references repointed to `/prompt-improve` / `.opencode/commands/prompt-improve.md` at lines `62`, `83`, `156`, `231`, `362` (ASCII summary box re-aligned to preserve the box-drawing width).
- [x] T005 A1 mirror: Fixed `.claude/agents/prompt-improver.md` - same 5 repoints at lines `47`, `68`, `141`, `216`, `347`.
- [x] T006 A2: Fixed `.opencode/skills/sk-prompt/prompt-models/SKILL.md:4` - `allowed-tools: []` -> `allowed-tools: [Read, Grep, Glob]`, matching `mode-registry.json`'s `prompt-models` mode `toolSurface.allowed`.
- [x] T007 A3: Fixed `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md` GLOBAL PRECONDITIONS — BOTH dead-path lines. Precondition #2 (line `56`): repointed `sk-prompt/SKILL.md` -> `sk-prompt/prompt-improve/SKILL.md` (confirmed the target has §2 Smart Routing, §3 Operating Modes table, §7 Agent Invocation Contract before writing). Precondition #3 (line `57`, initially missed, caught by a coordinator cross-verify): repointed all 5 dead pre-fold resource paths (`sk-prompt/references/depth_framework.md`, `sk-prompt/references/patterns_evaluation.md`, and 3 bare-relative `assets/format_guide_*.md`) to their real nested `sk-prompt/prompt-improve/references/` and `sk-prompt/prompt-improve/assets/` locations — all 5 verified to resolve on disk after the fix.
- [x] T008 A4: Fixed `.opencode/skills/sk-prompt/prompt-models/README.md` - 3 dead top-level `prompt-models` path repoints at lines `55` (quick-start `Read()` call), `180`-`181` (2 verification commands).
- [x] T009 A4: Fixed `.opencode/skills/sk-prompt/prompt-models/references/context_budget.md:243` - 1 dead top-level path repoint (`jq empty` verification command).
- [x] T010 C1: Added the `glm-5.2` row to `README.md`'s Framework Map table (now at line `94`) - `COSTAR (fallback TIDD-EC, avoid RCAF) | lean | Empirical (benchmark 008)`, cross-verified against `references/models/_index.md` and `assets/model_profiles.json`'s `recommended_frameworks` block for `glm-5.2` before writing.
- [x] T011 B1: Fixed `.opencode/commands/prompt-improve.md` Step 5-C (now lines `455`-`460`) + the Setup-step-9 preview (line `143`) - added a spec-tree containment check and an overwrite guard (never silently clobber; confirm or auto-suffix) before the write. Containment boundary is the `.opencode/specs/` spec-folder tree (NOT the whole repo), matching the finding's "reject paths escaping the intended spec-folder root" intent: rejects absolute-elsewhere paths, repo paths outside `.opencode/specs/`, and `..` segments that climb out of the spec root, with saving-outside-the-spec-tree stated as an explicit deliberate non-goal. (First pass used the repo root, too loose; tightened to the spec root after a coordinator cross-verify.)
- [x] T012 B2: Fixed `prompt-improve.md` Step 5-B (now lines `448`-`453`) - added topic sanitization (whitelist to `[a-z0-9-]`, collapse/trim hyphens, `untitled-prompt` fallback) as step 1, before any shell interpolation.
- [x] T013 B3: Fixed `prompt-improve.md` Setup Phase step 5 (line `93`, discovery), step 9 (line `142`-`143`, background-ops preview), Step 5-B (lines `450`-`453`, creation), and §7 NOTES (line `582`) - all repointed to prefer `.opencode/specs/`, with legacy `specs/` documented as a symlink alias rather than a separate store (confirmed via `realpath specs` and `git ls-files -- specs`).
- [x] T014 Coherence fix (not a 4th cited finding, required by T013): updated Step 5-A (lines `441`-`446`) so `[folder]` is treated as the full path already returned by the (now `.opencode/specs/`-rooted) discovery search, instead of re-prepending a `specs/` root that would have double-nested the path once discovery started returning full relative paths.
- [x] T015 Decided and documented: C2 (`124-sk-prompt-parent/008-cutover-and-rollout/implementation-summary.md:122` closeout-note annotation) excluded from this phase's scope - it lives in the 124 spec docs, which this phase's own boundary and the required `124 --recursive --strict` non-regression check both explicitly exclude; the manifest itself marked it optional/low-value.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Re-ran `grep -n '/prompt\b' .opencode/agents/prompt-improver.md .claude/agents/prompt-improver.md | grep -v '/prompt-improve'` - 0 matches (CLEAN).
- [x] T017 Re-ran `grep -rn 'commands/prompt\.md' .opencode/agents/prompt-improver.md .claude/agents/prompt-improver.md .opencode/commands/prompt-improve.md` - 0 matches (CLEAN).
- [x] T018 Re-ran `grep -rln '\.opencode/skills/prompt-models\b' .opencode/skills/sk-prompt/ --include='*.md' | grep -v '/changelog/'` - 0 matches (CLEAN); confirmed the excluded `changelog/` occurrences are historical narration of the pre-fold identity, correctly left untouched.
- [x] T019 Read back `.opencode/commands/prompt-improve.md` Step 5 A/B/C (lines `441`-`460`) in full - confirmed all 3 Cluster B fixes read coherently end-to-end and the 2 remaining bare `specs/012-onboarding` mentions (§5/§6 illustrative examples, Q2=A scenario) correctly remain valid under the new "legacy `specs/` remains valid when already in use" fallback, not stale.
- [x] T020 Authored the Level 1 spec-kit docs for this phase (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`).
- [x] T021 Regenerated `description.json` via `generate-description.js` (created) and `graph-metadata.json` via `backfill-graph-metadata.js` (`"failed": []`, scoped to this folder only). Ran `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../002-sk-prompt-124-remediation --strict` — `Errors: 0 Warnings: 0`, PASSED. Ran `.../124-sk-prompt-parent --recursive --strict` — `Errors: 0`, 1 pre-existing warning in `006-advisor-and-integration` (`EVIDENCE_CITED`, `Jul 9` mtimes on all its files, never touched by this phase) — confirmed unrelated via `git status --porcelain -- .../124-sk-prompt-parent/` (whole tree untracked, pre-dates this session) and mtime comparison against this phase's own `Jul 10` files.
- [x] T022 Coordinator cross-verify (gpt-5.6-sol-fast) correction pass — 2 fixes: (a) A3 was incomplete — the adjacent playbook precondition #3 (line `57`) still named 5 dead pre-fold paths; repointed to nested `prompt-improve/references/` + `prompt-improve/assets/`, all 5 verified on disk. (b) B1 was too loose — tightened the Step 5-C containment boundary from the repository root to the `.opencode/specs/` spec-folder tree, matching the finding's intent, with out-of-tree saves stated as an explicit non-goal. Re-verified: line 57's 5 paths all resolve; root playbook file clean of dead disk-resolution claims; Step 5 A/B/C coherent (all three branches target the spec tree). DISCOVERED + FLAGGED (subsequently EXECUTED in T023): per-feature playbook files under `manual_testing_playbook/NN--*/` carry the same-root-cause dead absolute `sk-prompt/references/` + `sk-prompt/assets/` paths inside their `bash: rg`/`ls` verification commands (pre-existing, `Jul 10 00:11` merge mtimes; their `../../references/` and `../../assets/` relative Source-Anchor refs, by contrast, resolve correctly post-fold). Flagged for a decision — the coordinator subsequently authorized folding the sweep into cluster A per the operator "fix all" directive; EXECUTED in T023.
- [x] T023 A5 per-feature playbook referrer sweep (coordinator-authorized fold-in of the T022-flagged condition, per operator "fix all"): repointed all dead absolute `sk-prompt/references/` + `sk-prompt/assets/` paths in the `bash: rg`/`ls` verification commands of the 18 per-feature files under `manual_testing_playbook/NN--*/` to their nested `prompt-improve/` locations. Applied via a scoped in-place transform (`sk-prompt/references/` -> `sk-prompt/prompt-improve/references/`, `sk-prompt/assets/` -> `sk-prompt/prompt-improve/assets/`) touching ONLY the `NN--*/` files. Result: 18 files, 21 repoints. Verified — acceptance grep `grep -rE '\.opencode/skills/sk-prompt/(references\|assets)/' NN--*/` returns 0 (CLEAN); no double-application (`prompt-improve/prompt-improve` absent); all 4 distinct nested targets + both nested dirs resolve on disk; the `../../references/` (45) and `../../assets/` (4) relative Source-Anchor refs left untouched as instructed. NARROWED residual flag: 17 files still grep the hub `sk-prompt/SKILL.md` (resolves on disk, but the fold moved its content to `prompt-improve/SKILL.md` — hub 0 matches / packet 1 for sampled patterns); distinct sub-case requiring per-command verification, left for a coordinator decision (Known Limitations #5).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` - Evidence: T001-T023 all checked above.
- [x] No `[B]` blocked tasks remain.
- [x] All findings independently re-verified against live files, including the T022 coordinator cross-verify correction pass and the T023 A5 sweep fold-in - Evidence: T016-T019, T022, T023, plus the final `validate.sh --strict` PASS in T021.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
