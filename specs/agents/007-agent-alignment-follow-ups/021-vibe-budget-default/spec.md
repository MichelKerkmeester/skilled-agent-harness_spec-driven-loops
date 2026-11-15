---
title: "Feature Specification: Phase 21: vibe-budget-default"
description: "Mistral bills two pools, and a Vibe lineage started from a shell that holds an API key bills the API pool. This phase makes the runner prefer the Vibe sign-in key, counts a budget refusal as a quota stop, and updates the Mistral docs."
trigger_phrases:
  - "vibe budget default"
  - "phase 21 vibe budget default"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 21: vibe-budget-default

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 25 |
| **Predecessor** | 020-agent-docs-alignment-research |
| **Successor** | 022-agent-source-and-drift-checks |
| **Handoff Criteria** | The two runtime unit files pass, the full deep-loop suite matches its baseline plus the new tests, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the agent alignment follow-ups. It acts on run finding V1 and V2 from phase 20.

**Scope Boundary**: The deep-loop executor env filter, the quota classifiers and the Mistral docs of three CLI skills plus the spec-kit env reference. Machine credential stores were changed by the conductor with the operator's approval and are recorded here, not in the repo.

**Dependencies**:
- Phase 20 run findings V1 and V2 in `../020-agent-docs-alignment-research/research/research.md`

**Deliverables**:
- A Vibe lineage gets the keychain sign-in key as `MISTRAL_API_KEY` when one exists
- A Mistral budget refusal is classed as a quota stop
- Docs that say the sign-in key is the default and the env key the fallback
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Mistral bills a Vibe budget and an API budget separately. Only a key made by the Vibe browser sign-in, stored in the macOS keychain as `ai.mistral.vibe`/`MISTRAL_API_KEY`, bills the Vibe budget. The runner passes the parent shell's `MISTRAL_API_KEY` to a Vibe lineage unchanged, so phase 20's first run billed the empty API budget, got `402 API budget exhausted`, and was recorded as a crash instead of a quota stop.

### Purpose
A Mistral lineage bills the Vibe budget by default, and an exhausted budget stops it as a quota stop.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ node -e '...detectQuotaExhaustion("Error: API error occurred: Status 402. Body: {\"message\":\"API budget exhausted.\",\"type\":\"billing_api_budget_exhausted\",...}", "")'
detectQuotaExhaustion -> null
$ grep -n "MISTRAL_API_KEY" lib/deep-loop/executor-audit.ts
192:  'cli-mistral-vibe': ['MISTRAL_API_KEY'],
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Make `buildExecutorDispatchEnv` set a `cli-mistral-vibe` lineage's `MISTRAL_API_KEY` to the keychain sign-in key when one is present.
- Add a budget-exhausted pattern to `detectQuotaExhaustion` and to the `classifyExecutorUnavailable` markers.
- Update the Mistral billing and key notes in cli-mistral-vibe, cli-pi, cli-opencode and the spec-kit env reference.

### Out of Scope
- Reading the keychain on Linux or Windows - Vibe stores the sign-in key in the macOS keychain only here; other platforms keep the env key.
- The 21 doc findings of phase 20 - each gets its own later phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Sign-in key preference and the budget marker |
| `.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs` | Modify | Budget-exhausted quota pattern |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` | Modify | Tests for both changes |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/cli-guards-needs-input.vitest.ts` | Modify | Quota test |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/**`, `cli-pi/references/providers-and-models.md`, `cli-opencode/references/providers-and-models.md` | Modify | Billing and key notes |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.env.example` | Modify | `MISTRAL_API_KEY` note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A `cli-mistral-vibe` lineage gets the sign-in key as `MISTRAL_API_KEY` when one exists, and the parent key otherwise. | `executor-audit.vitest.ts` covers both cases and a `cli-pi` case that gets no key |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The 402 `API budget exhausted` line is a quota stop. | `detectQuotaExhaustion` returns non-null for it in `cli-guards-needs-input.vitest.ts` |
| REQ-003 | The Mistral docs name the sign-in key as the default and the env key as the fallback. | `rg -n "sign-in key" ` over the four doc sets finds each note |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The full deep-loop suite fails no test that passed at baseline, and typecheck exits 0.
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | macOS `/usr/bin/security` | Low | Any error returns null and the parent key passes through |
| Risk | Tests read the real keychain | Medium | The function takes an injected reader; tests pass a stub |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The operator chose "Both": machine config and repo, 2026-11-15.
<!-- /ANCHOR:questions -->

---


