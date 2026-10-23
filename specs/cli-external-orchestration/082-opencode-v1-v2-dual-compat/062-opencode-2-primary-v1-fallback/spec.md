---
title: "Feature Specification: Phase 62: opencode-2-primary-v1-fallback"
description: "OpenCode 1 support is temporary, kept because not every user has updated, so the repository must expect and promote OpenCode 2 while staying backwards compatible. The resolver used to walk PATH directory by directory and try opencode2 then opencode inside each, which let an OpenCode 1 install in an earlier directory beat an OpenCode 2 install in a later one. This phase makes the first opencode2 anywhere on PATH win, with the first opencode as the fallback only when no opencode2 exists, and reorders the documentation, setup text and listings to recommend OpenCode 2 first with OpenCode 1 labelled the fallback."
trigger_phrases:
  - "opencode 2 primary v1 fallback"
  - "phase 62 opencode 2 primary v1 fallback"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 62: opencode-2-primary-v1-fallback

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-22 |
| **Branch** | `worktrees/207-opencode-2-primary-v1-fallback` |
| **Parent Spec** | ../spec.md |
| **Phase** | 62 of 62 |
| **Predecessor** | 061-v4-0-0-13-changelog-trim-and-simplify |
| **Successor** | None |
| **Handoff Criteria** | The resolver returns the first `opencode2` anywhere on PATH and falls back to the first `opencode` only when no `opencode2` exists, while `OPENCODE_BIN` still overrides both. The dual-dispatch tests cover the later-`opencode2` case, the no-`opencode2` fallback and the `OPENCODE_BIN` override, with the old loop failing the new fixture as a negative control. The shared hermetic PATH setup removes host `opencode2` directories and deletes `OPENCODE_BIN`, and both vitest projects use it. Every listed doc, prompt asset, playbook, setup usage text, map, catalog and mirror names OpenCode 2 first and labels OpenCode 1 the fallback with no removal date. Live proof shows `opencode2` v2 and `opencode` v1 each dispatch unpinned with exit 0 and reply OK, and the rerun suites pass. The commit, push and CI run remain open |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 62** of the OpenCode v1 and v2 dual compatibility packet. It is the closing phase that changes which version the repository expects, after phase 61 finished the v4.0.0.13 changelog trim.

**Scope Boundary**: The two runtime resolvers, the dual-dispatch tests and their shared hermetic PATH setup, the two vitest configs, the listed documentation and prompt assets, the setup helper's usage text, the feature catalog, the runtime scripts README, the cli-opencode changelog, the Hermes mirror, this phase's four docs and the parent packet's phase-map and handoff rows. The setup helper's shell logic is not changed. The `.skilled/changelog/skilled/v4.0.0.13.md` file is not edited by this phase, even though it still states the old per-directory rule, because another phase owns it.

**Dependencies**:
- The operator's 2026-10-22 request that OpenCode 1 support is temporary, kept because not every user has updated, and that the repository must expect and promote OpenCode 2 while keeping backwards compatibility.
- The existing PATH resolver in the fan-out runtime and cli-opencode's documented one-line resolver, which both walked PATH directory by directory.
- DeepSeek v4.1 flash 1017 writers through cli-pi, at max thinking for code and high for docs, with separate read-only DeepSeek review sessions.

**Deliverables**:
- The resolver change in `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` and cli-opencode's documented resolver, with `OPENCODE_BIN` still winning.
- The test changes in `opencode-dual-dispatch.vitest.ts` and the new shared `tests/_support/hermetic-opencode-path.ts`, wired into the deep-loop and spec-kit vitest configs.
- The reordered docs, setup usage text, catalog, changelog and regenerated Hermes mirror, all naming OpenCode 2 first.
- This phase's four docs, the live proof in `scratch/live/` and the parent rows.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fan-out runtime resolver and cli-opencode's documented one-line resolver walked PATH directory by directory, trying `opencode2` then `opencode` inside each directory. That meant an `opencode` (OpenCode 1) in an earlier directory beat an `opencode2` in a later one. On this machine both live in `~/.local/bin`, so `opencode2` already won here, and the defect only showed on machines with the two installs in different directories. The documentation also still presented the two versions without making clear which one the repository expects.

### Purpose
Expect and promote OpenCode 2: the first `opencode2` anywhere on PATH wins, the first `opencode` is used only when no `opencode2` exists, `OPENCODE_BIN` still overrides both, and every user-facing doc recommends OpenCode 2 first with OpenCode 1 as the temporary fallback for users who have not updated.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Changing the fan-out runtime resolver and cli-opencode's documented one-line resolver so a later `opencode2` beats an earlier `opencode`, with the first `opencode` as the fallback only when no `opencode2` exists and `OPENCODE_BIN` still overriding both.
- Replacing the PATH-order test in `opencode-dual-dispatch.vitest.ts` with "prefers opencode2 on a later PATH directory over opencode on an earlier one", and adding "falls back to the first opencode on PATH when no opencode2 exists" and "OPENCODE_BIN overrides an opencode2 elsewhere on PATH".
- Adding the shared `tests/_support/hermetic-opencode-path.ts` setup, which removes host `opencode2` directories from PATH and deletes `OPENCODE_BIN`, and wiring it into the deep-loop `vitest.config.ts` and `system-spec-kit/runtime/vitest.config.ts`.
- Reordering OpenCode 2 first, with OpenCode 1 labelled the fallback for users who have not updated and no removal date, in cli-opencode's SKILL.md, README.md, references/install-and-versions.md, cli-reference.md and providers-and-models.md; assets/prompt-templates.md, prompt-quality-card.md and the manual-testing-playbook overview; the opencode-setup.sh usage text; `.opencode/plugins/README.md`, `.skilled/CROSS-CLI.md` and the root README.md; the feature-catalog opencode-dual-version-dispatch doc, the runtime scripts README and the cli-opencode changelog v1.5.0.0; and the Hermes mirror, regenerated.
- Live proof in `scratch/live/` on both versions and the full suite rerun.

### Out of Scope
- The `.skilled/changelog/skilled/v4.0.0.13.md` file - another phase owns it, so it still states the old per-directory rule as a known limitation.
- Any change to the opencode-setup.sh shell logic - only its usage text was reordered.
- Any global install, service command or upgrade.
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` beyond the phase map and handoff rows for this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` | Modify | Resolver returns the first `opencode2` anywhere on PATH, falls back to the first `opencode` only when none exists, and keeps `OPENCODE_BIN` as the override |
| `opencode-dual-dispatch.vitest.ts` (cli-opencode suite) | Modify | Replaces the PATH-order test with the later-`opencode2` preference and adds the no-`opencode2` fallback and `OPENCODE_BIN` override tests |
| `tests/_support/hermetic-opencode-path.ts` | Create | Shared vitest setup that removes host `opencode2` directories from PATH and deletes `OPENCODE_BIN` |
| `.skilled/skills/system-deep-loop/vitest.config.ts`, `system-spec-kit/runtime/vitest.config.ts` | Modify | Wire the shared hermetic PATH setup into both vitest projects |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`, `README.md`, `references/install-and-versions.md`, `references/cli-reference.md`, `references/providers-and-models.md` | Modify | Document and promote OpenCode 2 first, OpenCode 1 as the fallback |
| `.skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md`, `assets/prompt-quality-card.md`, `references/manual-testing-playbook.md` | Modify | Reorder to OpenCode 2 first in the prompt assets and playbook overview |
| `.skilled/skills/cli-external-orchestration/cli-opencode/opencode-setup.sh` | Modify | Usage text names OpenCode 2 recommended first; shell logic unchanged |
| `.opencode/plugins/README.md`, `.skilled/CROSS-CLI.md`, `README.md` | Modify | Reorder to OpenCode 2 first with OpenCode 1 labelled the temporary fallback |
| `.skilled/feature-catalog/opencode-dual-version-dispatch.md`, `.skilled/skills/system-deep-loop/runtime/scripts/README.md`, `.skilled/skills/cli-external-orchestration/cli-opencode/changelog.md` | Modify | Reorder the catalog doc, the runtime scripts README and the v1.5.0.0 changelog entry |
| Hermes mirror of the cli-opencode skill | Modify | Regenerated from the updated source |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `../spec.md` | Modify | The phase map row for 062 and the 061 to 062 handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The first `opencode2` anywhere on PATH wins. | With no `OPENCODE_BIN`, a later `opencode2` beats an earlier `opencode`, and the test "prefers opencode2 on a later PATH directory over opencode on an earlier one" passes. The old per-directory loop returned the v1 `opencode` for the new fixture, which is the negative control. |
| REQ-002 | The first `opencode` is used only when no `opencode2` exists. | The test "falls back to the first opencode on PATH when no opencode2 exists" passes. |
| REQ-003 | `OPENCODE_BIN` still overrides both. | The test "OPENCODE_BIN overrides an opencode2 elsewhere on PATH" passes. |
| REQ-004 | The suites are hermetic against a host install. | `tests/_support/hermetic-opencode-path.ts` removes host `opencode2` directories from PATH and deletes `OPENCODE_BIN`, and both the deep-loop and spec-kit vitest configs use it. Without it, the host install shadows the v1 stubs the suites put first: 53 tests failed in the fan-out suites and 32 in a full run on this host. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Every listed doc recommends OpenCode 2 first and labels OpenCode 1 the fallback, with no removal date. | cli-opencode's SKILL.md, README.md, references/install-and-versions.md, cli-reference.md and providers-and-models.md; assets/prompt-templates.md, prompt-quality-card.md and the manual-testing-playbook overview; the opencode-setup.sh usage text; `.opencode/plugins/README.md`, `.skilled/CROSS-CLI.md` and the root README.md; the feature-catalog opencode-dual-version-dispatch doc, the runtime scripts README and the cli-opencode changelog v1.5.0.0 all read OpenCode 2 first, and the Hermes mirror is regenerated. |
| REQ-006 | Live proof exists for both versions. | With both installed, the resolver returns `opencode2` v2 and an unpinned fan-out cli-opencode dispatch ran `opencode2 run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max`, exit 0, reply OK. With v2 hidden from PATH, the resolver returns `opencode` v1 and an unpinned dispatch ran `opencode run --model llmgateway/deepseek-v4.1-flash-1017 --variant max`, exit 0, reply OK. The records are in `scratch/live/`. |
| REQ-007 | The suites and playbook pass on the final state. | Plugins 533 of 533; battery, config-shape and cli-opencode script tests 85 of 85; cli-opencode playbook PASS with 72 scenarios and 0 violations; deep-loop full suite 2806 passed and 8 skipped of 2814; the combined spec-kit config runs 35 deep-loop tests green. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On a machine with OpenCode 1 and OpenCode 2 in different PATH directories, the repository runs OpenCode 2 without any pin, and falls back to OpenCode 1 only when OpenCode 2 is absent.
- **SC-002**: A reader of any listed doc or prompt asset meets OpenCode 2 as the expected and recommended version first, and OpenCode 1 as the temporary fallback for users who have not updated, with no removal date.
- **SC-003**: The new tests fail on the old loop and pass on the new resolver, the suites are hermetic against a host install, and both live proofs exit 0 and reply OK.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Both versions installed on the machine | High | The hermetic PATH setup removes host `opencode2` directories so each suite controls PATH itself |
| Dependency | cli-opencode's documented resolver is a one-line copy | Med | The same resolution order was applied to both the runtime resolver and the documented one-liner |
| Risk | A host OpenCode 2 install shadows the v1 stubs in tests | High | The shared setup deletes `OPENCODE_BIN` and strips host `opencode2` directories; before it, 53 fan-out tests and 32 tests in a full run failed on this host |
| Risk | Reordering docs implies OpenCode 1 is being removed | Med | Every page labels OpenCode 1 the fallback for users who have not updated and gives no removal date |
| Risk | The v4.0.0.13 changelog still states the old per-directory rule | Med | Recorded as a known limitation because another phase owns that file; this phase leaves it alone |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator stated the direction on 2026-10-22: OpenCode 1 support is temporary, the repository must expect and promote OpenCode 2, and backwards compatibility stays. The open tasks are delivery, not decisions.
<!-- /ANCHOR:questions -->

---
