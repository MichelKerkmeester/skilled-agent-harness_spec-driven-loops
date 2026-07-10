---
title: "Feature Specification: Phase 2: sk-prompt-124-remediation"
description: "Fixes 5 merge-introduced referrer-sweep gaps left by the sk-prompt/124 parent-hub merge (stale `/prompt` command refs, a stale `allowed-tools` frontmatter, a stale playbook precondition path, and 2 dead top-level `prompt-models` path refs), hardens 3 pre-existing `/prompt-improve` save-path gaps inherited unchanged through the merge's git-mv (path containment, topic sanitization, spec-root preference), and adds a missing GLM-5.2 row to the prompt-models README framework map."
trigger_phrases:
  - "sk-prompt 124 remediation"
  - "prompt-improve save-path hardening"
  - "prompt-improver referrer sweep"
  - "phase 002 sk-prompt"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/002-sk-prompt-124-remediation"
    last_updated_at: "2026-07-10T05:50:20Z"
    last_updated_by: "claude"
    recent_action: "A5 18-file playbook sweep folded into cluster A"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/agents/prompt-improver.md"
      - ".claude/agents/prompt-improver.md"
      - ".opencode/commands/prompt-improve.md"
      - ".opencode/skills/sk-prompt/prompt-models/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "127-deep-review-remediation-002-sk-prompt-124-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 12 findings (5 Cluster A, 3 Cluster B, 2 Cluster C candidates) verified against live files before editing"
      - "C2 excluded: lives in 124 spec docs, which this phase's own scope boundary and the 124 --recursive --strict re-check explicitly exclude"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: sk-prompt-124-remediation

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-cli-opencode-content-hygiene |
| **Successor** | 003-packet-125-126-refinements |
| **Handoff Criteria** | sk-prompt/124 fixes land and this phase validates `--strict`; phase 003 (125/126 packets) runs independently on a disjoint tree, so no blocking handoff is required. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Fix all open deep-review findings across cli-opencode, the sk-prompt 124 hub, and the 125/126 planning packets specification.

**Scope Boundary**: The sk-prompt hub tree (`.opencode/skills/sk-prompt/**`), `.opencode/commands/prompt-improve.md`, and the two `prompt-improver.md` agent mirrors (`.opencode/agents/`, `.claude/agents/`) only. No changes to `cli-opencode` (owned by sibling phase 001) or the 125/126 packets (owned by sibling phase 003). No file moves or renames. No 124 spec-doc edits — those are excluded by this phase's own boundary, not merely deferred.

**Dependencies**:
- The deep-review report `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/review/review-report.md` (§3 Active Finding Registry) that surfaced all 10 findings across WS-A/WS-B/WS-C.
- The fix manifest `phase2-sk-prompt.md` (scratchpad input) that specified the exact fix for each finding with approximate file:line evidence, grouped into Cluster A (merge-introduced), Cluster B (pre-existing), and Cluster C (doc-accuracy).

**Deliverables**:
- All 5 Cluster A merge-introduced referrer-sweep gaps fixed in the live sk-prompt hub tree and both agent mirrors.
- All 3 Cluster B pre-existing `/prompt-improve` save-path hardening gaps fixed in the live command file.
- The Cluster C1 GLM-5.2 doc-accuracy gap fixed; C2 explicitly excluded (out of this phase's scope).
- This Level 1 spec-kit packet, validated `--strict` 0/0.
- Confirmation that `124-sk-prompt-parent --recursive --strict` stays 0/0 (no 124 spec doc touched).

**Changelog**:
- None authored this phase — no `SKILL.md`/command `version:` field was bumped, matching the fix manifest's scope (content-hygiene fixes only, no version-bump requirement was specified, unlike sibling phase 001's manifest).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 124 sk-prompt parent-hub merge left 5 stale cross-references behind (a phase-006 referrer-sweep miss): both `prompt-improver.md` agent mirrors still route to the removed `/prompt` command, the `prompt-models` packet's frontmatter `allowed-tools: []` contradicts its own registry grant, a playbook precondition still points at the pre-fold hub-root `SKILL.md`, and two files cite a dead top-level `prompt-models` path. Separately, three pre-existing `/prompt-improve` save-path behaviors — inherited unchanged through the merge's git-mv from the old `/prompt` command — lack path containment, topic sanitization, and `.opencode/specs/` root preference. A README framework map also omits the active GLM-5.2 model.

### Purpose
Every Cluster A/B/C1 finding is fixed in the live file, verified against file:line evidence before and after, without touching cli-opencode, the 125/126 packets, or the 124 spec docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Cluster A (merge-introduced)**: A1 both agent mirrors' `/prompt` → `/prompt-improve` referrer sweep; A2 `prompt-models/SKILL.md` frontmatter `allowed-tools` fix; A3 playbook GLOBAL-PRECONDITIONS repoint — BOTH dead-path lines (the `SKILL.md` precondition AND the adjacent references/assets precondition, which name 5 dead pre-fold resource paths); A4 two dead top-level `prompt-models` path repoints; A5 the per-feature playbook referrer sweep — 21 dead absolute `sk-prompt/references/` + `sk-prompt/assets/` paths across 18 files under `manual_testing_playbook/NN--*/`, repointed to their nested `prompt-improve/` locations (same merge-referrer-sweep class as A3/A4; folded in per operator "fix all" directive).
- **Cluster B (pre-existing, command hardening)**: B1 custom save-path containment (bounded to the `.opencode/specs/` spec-folder tree) + overwrite guard; B2 new-spec-folder topic sanitization; B3 `.opencode/specs/` root preference (discovery + creation + Notes).
- **Cluster C1 (doc-accuracy)**: GLM-5.2 row added to the prompt-models README framework map, grounded in `references/models/_index.md` and `assets/model_profiles.json`.

### Out of Scope
- **C2** (closeout-note annotation in `124-sk-prompt-parent/008-cutover-and-rollout/implementation-summary.md`) - lives in the 124 spec docs, which this phase's scope boundary explicitly excludes; the manifest itself marked it optional/low-value. Left untouched, not silently dropped.
- `cli-opencode` fixes - owned by sibling phase 001.
- 125/126 packet advisory refinements - owned by sibling phase 003.
- Any `SKILL.md`/command `version:` bump or changelog entry - not requested by the fix manifest for this phase (unlike phase 001's).
- Redesigning the `/prompt-improve` "new spec folder" flow to add a `[track]` segment or full spec-kit metadata (`description.json`, `graph-metadata.json`) - a pre-existing, unflagged characteristic of the command, not one of the 3 cited Cluster B findings.
- The 17 per-feature playbook files whose `bash: rg` verification commands additionally grep the hub `.opencode/skills/sk-prompt/SKILL.md` for content that the fold moved into `prompt-improve/SKILL.md` (confirmed stale: hub SKILL.md returns 0 matches for sampled patterns like the CLEAR dimensions and the Framework Selection Matrix, the packet SKILL.md returns them). Distinct from the A5 sweep: the hub `SKILL.md` file still *resolves* on disk (it is the thin router), so it is not a "dead path," and the hub retains its own routing §2 — a blanket `sk-prompt/SKILL.md` → `prompt-improve/SKILL.md` repoint would need a per-command check that each grep targets moved content (not hub routing content), so it is not the clean uniform sweep A5 was. Flagged for a decision (see implementation-summary.md Known Limitations #5); not repointed here. The `../../references/` and `../../assets/` relative Source-Anchor refs resolve correctly post-fold and are untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agents/prompt-improver.md` | Modify | A1: 5 stale `/prompt` → `/prompt-improve` repoints |
| `.claude/agents/prompt-improver.md` | Modify | A1 mirror: same 5 repoints |
| `.opencode/skills/sk-prompt/prompt-models/SKILL.md` | Modify | A2: `allowed-tools: []` → `[Read, Grep, Glob]` |
| `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md` | Modify | A3: both GLOBAL-PRECONDITIONS dead-path lines repointed — the `SKILL.md` precondition to `prompt-improve/SKILL.md`, and the 5 references/assets paths to their nested `prompt-improve/` locations |
| `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/NN--*/` (18 per-feature files) | Modify | A5: 21 dead absolute `sk-prompt/references/` + `sk-prompt/assets/` paths in `bash: rg`/`ls` verification commands repointed to nested `prompt-improve/` locations |
| `.opencode/skills/sk-prompt/prompt-models/README.md` | Modify | A4: 3 dead top-level path repoints; C1: GLM-5.2 row added |
| `.opencode/skills/sk-prompt/prompt-models/references/context_budget.md` | Modify | A4: 1 dead top-level path repoint |
| `.opencode/commands/prompt-improve.md` | Modify | B1: containment + overwrite guard; B2: topic sanitization; B3: `.opencode/specs/` root preference |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

None - all findings are P1/P2 doc-hygiene and hardening fixes; the review verdict (CONDITIONAL) carried 0 P0.

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix all Cluster A merge-introduced referrer-sweep gaps (A1-A5). | `grep -rn '/prompt\b' .opencode/agents/prompt-improver.md .claude/agents/prompt-improver.md \| grep -v '/prompt-improve'` returns 0 matches; `prompt-models/SKILL.md:4` reads `allowed-tools: [Read, Grep, Glob]`; both playbook GLOBAL-PRECONDITIONS dead-path lines are repointed (the `SKILL.md` one cites `prompt-improve/SKILL.md`, and all 5 references/assets paths cite their nested `prompt-improve/` locations and resolve on disk); 0 remaining `.opencode/skills/prompt-models/...` refs outside `changelog/`; and (A5) `grep -rE '\.opencode/skills/sk-prompt/(references\|assets)/' manual_testing_playbook/NN--*/` returns 0 matches, with every repointed nested `prompt-improve/references|assets/` target confirmed to resolve on disk. |
| REQ-002 | Harden the 3 pre-existing `/prompt-improve` save-path gaps. | Step 5-C states an explicit spec-tree containment check (bounded to `.opencode/specs/`, out-of-tree saves stated as a deliberate non-goal) + overwrite guard; Step 5-B sanitizes the topic into an `[a-z0-9-]` slug before shell interpolation; discovery, creation, and the Notes section all prefer `.opencode/specs/`. |
| REQ-003 | Add the missing GLM-5.2 row to the prompt-models README framework map. | `README.md` "Framework Map" table includes a `glm-5.2` row matching `references/models/_index.md`'s recorded framework (COSTAR; TIDD-EC fallback; avoid RCAF; lean; benchmark 008). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All findings verified against live files with file:line evidence, fixed, and re-verified after editing — 5 Cluster A gaps (A1-A4 plus the A5 21-path / 18-file per-feature playbook sweep folded in per the operator "fix all" directive), 3 Cluster B hardening gaps, and Cluster C1 (with C2 explicitly excluded).
- **SC-002**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/002-sk-prompt-124-remediation --strict` returns 0 errors / 0 warnings.
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent --recursive --strict` shows no *new* errors/warnings attributable to this phase. Actual result: 0 errors, 1 pre-existing warning (`006-advisor-and-integration`, `EVIDENCE_CITED`) that predates this phase - all 006 files carry `Jul 9` mtimes, this phase's files carry `Jul 10` mtimes, and this phase never read or wrote any file under `124-sk-prompt-parent/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `specs` top-level symlink (`specs -> .opencode/specs`, git-tracked) that the B3 root-preference fix depends on for its "legacy alias" framing. | Low - if the symlink were ever removed, the hardened command still resolves correctly since it prefers the real `.opencode/specs/` path. | Verified the symlink live (`realpath specs` → `.opencode/specs`) and git-tracked (`git ls-files -- specs` → `specs`) before writing the fix; documented the dependency explicitly in the command text rather than assuming it silently. |
| Risk | The Cluster B fix touches `/prompt-improve`'s Step 5-A (`[folder]` path semantics) even though it wasn't one of the 3 cited findings, to stay coherent with the B3 discovery-command change. | Low - the touched lines are prose-instruction text, not executable code; the change removes a redundant root prefix rather than altering behavior. | Documented explicitly in Key Decisions (implementation-summary.md) as a necessary coherence fix, not a 4th cited finding. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All 12 candidate findings were fully specified in the fix manifest with approximate file:line evidence; the one scope ambiguity (C2 vs. this phase's own "do not touch 124 spec docs" boundary) resolved unambiguously in favor of the explicit scope boundary.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
