---
title: "Feature Specification: Follow-up Fixes"
description: "Phases 1 to 4 left four known limitations: the deep-review workflows reject every fan-out close for a dashboard that fan-out never writes, Pi's edit_lines tool refuses edits with a misleading message when a file ends in a newline, the OpenCode plugin's transform dedup misses a repeat that lifecycle dedup already reduced, and the trigger index lacks this packet's phrases. This phase fixes each one at its source."
trigger_phrases:
  - "deep review fan-out dashboard"
  - "edit_lines trailing newline"
  - "edit_lines line_count"
  - "plugin transform dedup lifecycle"
  - "trigger index regenerate committed"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Follow-up Fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-headless-fallback-status-and-dedup |
| **Successor** | 006-fanout-deep-review |
| **Handoff Criteria** | A fan-out review close records `synthesis_complete` without a root dashboard, `edit_lines` explains a trailing-newline count instead of claiming lines moved, a same-message repeat is suppressed with lifecycle dedup on, and the committed trigger index finds this packet's phrases |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Pi skill orchestrator research for skill advisor refinement specification. It fixes the limitations recorded in `../001-deep-research/implementation-summary.md` and `../004-headless-fallback-status-and-dedup/implementation-summary.md`, plus one tool defect met while building phases 2 to 4.

**Scope Boundary**: The two deep-review workflows' convergence step, the `edit_lines` tool in the Pi cache-optimizer extension, the OpenCode advisor plugin's order of transform dedup and lifecycle dedup, and the committed trigger index. No change to what a review or research run checks beyond the dashboard rule, to how `edit_lines` detects moved lines, or to the default plugin configuration.

**Dependencies**:
- 001-deep-research, hard. Its fix to the research workflows is the rule this phase carries to the review workflows.
- 004-headless-fallback-status-and-dedup, hard. It recorded the plugin interaction this phase removes.

**Deliverables**:
- The fan-out dashboard rule in both deep-review workflows, with tests and a regenerated compiled contract
- A trailing-newline refusal in `edit_lines` that tells the model what to do, and `line_count` guidance that says the final empty line counts
- Transform dedup decided on the full advisor block in the plugin, with the same-message suppression test run with lifecycle dedup on
- A trigger index rebuilt from committed content only

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four defects remain from phases 1 to 4.

1. **Review close.** `step_convergence_report` in `.skilled/commands/deep/assets/deep-review-auto.yaml:2389` and `deep-review-confirm.yaml:1872` requires `review/deep-review-dashboard.md`. A fan-out review writes dashboards only inside each lineage: `fanout-merge.cjs` writes a root registry and no dashboard, and past fan-out reviews such as `specs/hooks/002-injection-bloat-reduction/review/` hold none. Every fan-out review close therefore logs `synthesis_incomplete`, which phase 6 would hit.
2. **`edit_lines` count.** A read annotates the empty string after a file's final newline as a numbered line, for example `211:e3b0c442→` in a 210-line file (`.pi/extensions/pi-cache-optimizer/index.ts:8111-8134`). The tool counts the same way (`:8491`), as do Pi's own read notices. A model that takes the empty line for a formatting artifact passes 210, and the refusal at `:8161-8167` says lines were inserted or removed. On 2026-09-26 GPT-6 Luna halted on that message twice, and later dispatches excluded the tool.
3. **Plugin dedup order.** Lifecycle dedup reduces the advisor block to its head (`.skilled/plugins/system-skill-advisor.js:1357-1365`) before transform dedup hashes it (`:1370-1376`). With `deduplicateTransforms` on, a second transform for the same message hashes the reduced text, misses the first transform's hash and is delivered again. Phase 4 switched lifecycle dedup off in four transform-dedup tests; in one of them, same-message suppression, that hid this defect.
4. **Trigger index.** `runtime/data/trigger-index.json` was last built at `954ed7fde8`, before this packet's phase documents existed, so the Gate 1 lookup cannot surface them. A plain rebuild walks the working tree and would also index another session's uncommitted folders.

### Purpose
Each of the four behaves correctly at its source, so no dispatch needs a workaround and no close reports a finished run as incomplete.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Both deep-review workflows require the root dashboard only when the run has no lineage state logs, the rule 001 gave the research workflows.
- `edit_lines`: when the claimed count is one short of the file's count and the file ends with a newline, refuse with a message that names the final empty line and says when a retry without a new read is safe. The `line_count` description and the tool's prompt guidelines say that line counts.
- Plugin: decide transform dedup on the full advisor block, and apply lifecycle reduction only to a block that will be delivered.
- Rebuild the trigger index from an export of committed content.

### Out of Scope
- Accepting a count one short. That would hide a real one-line insertion from a model that counted correctly.
- Hiding the final empty line from read annotations. Pi's own notices count it, so the tool must too.
- Reading lineage state logs in the review invariants. The review step reads only the root log, so its finding checks are vacuous on a fan-out run; that is recorded, not changed.
- The plugin's default configuration. `deduplicateTransforms` stays opt-in.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modify | Root dashboard required only without lineage logs |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml` | Modify | The same rule |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.md` | Regenerate | Source digests |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/run-now-yaml-control.vitest.ts` | Modify | Fan-out and no-lineage review cases |
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modify | Trailing-newline refusal, `line_count` description, guideline |
| `.pi/extensions/pi-cache-optimizer/tests/hash-verified-edits.test.ts` | Modify | Trailing-newline cases |
| `.pi/extensions/pi-cache-optimizer/README.md` | Modify | One sentence on how `line_count` counts |
| `.skilled/plugins/system-skill-advisor.js` | Modify | Transform dedup before lifecycle reduction |
| `.skilled/plugins/tests/system-skill-advisor.test.cjs` | Modify | Remove the lifecycle kill switch from the same-message suppression test |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | Modify | Same-message repeat with both dedups on |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and `runtime/cli/retrieval/fixtures/` | Regenerate | Index of committed content |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A fan-out review close completes | A YAML control test with a lineage review state log and no root dashboard records `synthesis_complete`, and without lineage logs still records `synthesis_incomplete` naming the dashboard |
| REQ-002 | `edit_lines` explains a trailing-newline count | For a file ending in a newline, a claim one short returns a refusal that names the final empty line and does not say lines were inserted or removed. Any other mismatch keeps today's message |
| REQ-003 | `edit_lines` still refuses a moved line | The existing moved-line test passes unchanged, and no count other than the file's own is accepted |
| REQ-004 | A same-message repeat is suppressed | With `deduplicateTransforms` and lifecycle dedup both on, two transforms for one message deliver one block, and a transform for the next message delivers the head alone |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The isolation that hid the defect is gone | The same-message suppression test passes with lifecycle dedup on. The distinct-message, flag-off and unresolvable-identity tests keep lifecycle dedup off, because with it on their second call is correctly reduced to the head, and they measure transform dedup alone |
| REQ-006 | Contracts stay in step | `check-contract-drift.cjs` prints OK after the review contract is regenerated |
| REQ-007 | The index covers committed content only | The Gate 1 lookup for "pi skill orchestrator research" returns this packet, and the rebuilt manifest includes no path that `git ls-files` does not list |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 6's fan-out review closes with `synthesis_complete`.
- **SC-002**: A Pi dispatch can leave `edit_lines` enabled.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The new refusal invites a retry that skips a needed read | Med | It says to retry without reading only when the read's last numbered line matches the file's count now; otherwise it says to read again |
| Risk | Reordering dedup changes default delivery | Low | With `deduplicateTransforms` off the transform decision always delivers, so lifecycle reduction runs exactly as before; the existing plugin suites guard it |
| Risk | Other sessions' dirty files enter a commit | Med | The trigger index is built from a `git archive` export, and every commit stages named paths only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The operator asked on 2026-09-26 for the recorded follow-ups to be fixed before the phase 6 review.
<!-- /ANCHOR:questions -->

---
