---
title: "Feature Specification: resolve 005 deep-research follow-on findings (LG-0001 correction, config cleanup, cli-devin recipe drift, cross-skill evergreen sweep)"
description: "Closes the remaining follow-ons from the 005-deep-agent-improvement deep-research loop: correct the SKILL.md trajectory description (a 005 reword was wrong), clean vestigial target-profiles config + add the missing vitest config, strip cli-devin recipe fields the strict parser rejects, and sweep 2 evergreen citations in sibling deep-* skills."
trigger_phrases:
  - "resolve 005 deep-research followons"
  - "009 followon findings"
  - "LG-0001 correction cli-devin recipe drift cross-skill evergreen"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/000-release-cleanup/015-deep-agent-improvement-deep-research-followon-findings"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "spec-authored"
    next_safe_action: "execute-four-fix-groups-then-verify"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - ".opencode/skills/deep-agent-improvement/SKILL.md"
      - ".opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json"
      - ".opencode/skills/deep-research/README.md"
      - ".opencode/skills/deep-ai-council/references/depth_dispatch.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000009001"
      session_id: "131-000-009-followons"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "LG-0001 verdict: two DISTINCT mechanisms (mutation-coverage checkConvergenceEligibility ±2 vs reduce-state exact plateau). The 005 reword conflated them and was WRONG; correct SKILL.md §6."
      - "Cross-skill sweep is only 2 citations (deep-research README, deep-ai-council depth_dispatch)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: resolve 005 deep-research follow-on findings

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-24 |
| **Branch** | `main` |
| **Parent Packet** | `skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup` |
| **Source** | `005-deep-agent-improvement` deep-research follow-ons + `008` residuals |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Four follow-ons remained after 005 + 008. This packet closes them across four skills.

- **F1 — LG-0001 correction (deep-agent-improvement, doc).** The 005 phase-5 loop flagged the SKILL.md §6 "Dimension Trajectory" `+/-2` text as contradicting `reduce-state.cjs` exact-equality plateau, and the 005 operator-override reword changed it to "exact-repeat". That reword was WRONG. There are two distinct mechanisms: `mutation-coverage.cjs checkConvergenceEligibility()` uses `DEFAULT_STABILITY_DELTA = 2` (the `+/-2` trajectory convergence-eligibility), and `reduce-state.cjs stopOnDimensionPlateau` uses exact-equality (the plateau stop). The original `+/-2` text was correct for the trajectory. SKILL.md §6 must be corrected to describe both accurately.
- **F2 — config cleanup + vitest config (deep-agent-improvement, config).** `target_manifest.jsonc` + `improvement_config.json` reference a non-existent `target-profiles` directory in unconsumed fields (008 residual). The `scripts/tests/*.vitest.ts` suite has no runnable config. Remove/repoint the dead refs and add a minimal `vitest.config` so the suite runs.
- **F3 — cli-devin recipe drift / T122 (cli-devin, config + doc).** All three `assets/agent-config-*.json` recipes carry fields the current `devin 2026.5.6` strict parser rejects (`verification_enabled`, `verification_languages`, `bayesian_scoring_enabled`, `bayesian_score_file`, `fallback_chain`). Strip them and update the contract docs.
- **F4 — cross-skill evergreen sweep (deep-research, deep-ai-council, doc).** Two evergreen-rule citations remain in sibling references: `deep-research/README.md:235` ("arc 118 ... 117 SPLIT") and `deep-ai-council/references/depth_dispatch.md:24` ("packet 129"). Reword to present-tense.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- F1: `.opencode/skills/deep-agent-improvement/SKILL.md` §6 trajectory paragraph (correct the two-mechanism description).
- F2: `.opencode/skills/deep-agent-improvement/assets/target_manifest.jsonc` + `assets/improvement_config.json` (dead `target-profiles` refs) + a new `.opencode/skills/deep-agent-improvement/scripts/vitest.config.mjs` (include `*.vitest.ts`), then run the suite.
- F3: `.opencode/skills/cli-devin/assets/agent-config-{deep-research-iter,deep-review-iter,synthesis}.json` (strip rejected fields) + `references/deep-loop-iter-contract.md` + `references/agent-config-recipes.md` doc alignment.
- F4: `.opencode/skills/deep-research/README.md:235` + `.opencode/skills/deep-ai-council/references/depth_dispatch.md:24` (reword citations).

### Out of Scope

- Any runtime-behavior change to deep-agent-improvement scoring/promotion (closed in 008 or by-design).
- The `mcp_servers` recipe field (reserved-not-wired in devin; leave omitted).
- A broader cross-skill audit beyond the 2 confirmed citations.

### Files Changed

| File Path | Change Type | Item |
|-----------|-------------|------|
| `deep-agent-improvement/SKILL.md` | Modify | F1 |
| `deep-agent-improvement/assets/target_manifest.jsonc`, `assets/improvement_config.json` | Modify | F2 |
| `deep-agent-improvement/scripts/vitest.config.mjs` | Create | F2 |
| `cli-devin/assets/agent-config-*.json` (3) | Modify | F3 |
| `cli-devin/references/deep-loop-iter-contract.md`, `references/agent-config-recipes.md` | Modify | F3 |
| `deep-research/README.md`, `deep-ai-council/references/depth_dispatch.md` | Modify | F4 |
| `.../009-.../{spec,plan,tasks,implementation-summary}.md` | Create | This packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F1: SKILL.md §6 accurately distinguishes the ±2 trajectory convergence (mutation-coverage) from the exact-equality plateau (reduce-state) | The "exact-repeat" mischaracterization is gone; both mechanisms named with their source files |
| REQ-002 | F2: no live `target-profiles` references remain; the vitest suite runs | `grep target-profiles` clean (excl changelog); `vitest run` discovers + passes the `*.vitest.ts` suite |
| REQ-003 | F3: all 3 cli-devin recipes pass the devin strict `--agent-config` parser | `devin -p --agent-config <each> ... -- "ok"` parses (no "unknown field"); docs match |
| REQ-004 | F4: the 2 sibling-skill evergreen citations are reworded; changelog citations untouched | `grep` shows no arc/packet citation in those 2 files outside changelog |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four items (F1-F4) applied and verified.
- **SC-002**: `node --check` / JSON validity clean on all touched code/config; 3 cli-devin recipes strict-parse; vitest suite runs + passes.
- **SC-003**: sk-code alignment-drift PASS on deep-agent-improvement; evergreen re-grep clean (excl changelog) in the touched docs.
- **SC-004**: 009 spec folder passes `validate.sh --strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adding a vitest config surfaces pre-existing test failures unrelated to this work | Med | Report honestly; only this packet's changes are in scope to fix; pre-existing failures noted, not chased |
| Risk | Stripping cli-devin recipe fields breaks a consumer that read them | Low | The fields are rejected by the parser today (dispatch already fails with them); strict-parse smoke confirms |
| Dependency | `devin` binary for the recipe strict-parse smoke | Green | Verified present (2026.5.6) |
| Dependency | repo-root vitest (v4) | Green | Present; needs the include config |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The LG-0001 two-mechanism verdict is confirmed in code (`mutation-coverage.cjs:36` `DEFAULT_STABILITY_DELTA = 2` + feature_catalog `06-plateau-detection.md`).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Plan**: `plan.md` | **Tasks**: `tasks.md` | **Summary**: `implementation-summary.md`
- **Source**: `../005-deep-agent-improvement/research/convergence-summary.md`, `../008-fix-deep-research-findings-for-benchmark-threshold-and-profile-path/implementation-summary.md`
