---
title: "Feature Specification: Doctor sk-code setup"
description: "R3: a read-only /doctor:sk-code command with one target, setup, that runs the external user's verify battery plus the derived-metadata freshness gate and a provisioning precheck, fails the route probe on the legacy stub, and prints one repair command per failing leg."
trigger_phrases:
  - "doctor sk-code setup"
  - "phase 2 doctor sk-code setup"
  - "sk-code setup battery doctor"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Doctor sk-code setup

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-13 |
| **Branch** | Its own worktree from origin/main, created as `goal.md` says |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-clone-path-and-messages |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the surface setup build. It builds research recommendation R3, phase P2 of `../../028-surface-setup-hardening-research/research/research.md` section 8, with the command shape research section 5 chose.

**Scope Boundary**: A new doctor command `/doctor:sk-code` with one read-only target `setup`: its command doc, route row, YAML asset and presentation, one read-only check script and its test, the doctor index rows in `.skilled/commands/README.txt`, one reference line each in the root `README.md` Verify step, the sk-code `README.md` VERIFICATION table and the sk-code `SKILL.md` surface-list sentence, and the runtime mirrors the sync script regenerates.

**Dependencies**:
- Phase 001 on origin/main: the setup target prints 001's repair texts (the provision command and the guard's refresh line).

**Deliverables**:
- `/doctor:sk-code setup`, read-only, passing `route-validate.sh`.
- `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs`, which runs the legs, asserts the probe routes and prints one repair command per failing leg, with a test.
- A sk-code release only if a sk-code doc changes and its hooks ask for one.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The README battery is six commands to copy by hand. Its last leg, `compiled-route.cjs --prompt`, exits 0 while printing only `{"servingAuthority":"legacy","hubId":"sk-code"}`, so "each of these must exit 0" passes a hub that routes nothing (research F7). The derived-metadata gate CI runs, `ci-skill-derived-freshness.cjs`, is missing from the user's battery (F16). Only two of the six legs have a doctor route today, and none runs under a sk-code owner (F21, F23).

### Purpose
One read-only command runs the external user's verify battery and names the repair for each failing leg.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `/doctor:sk-code` with one target `setup`, `mutating: read-only`, added by the documented recipe in `.skilled/commands/doctor/_routes.yaml` (append the route, list it in the command's router and presentation, rerun `route-validate.sh`).
- The legs, in order: a provisioning precheck (`@spec-kit/shared` resolves), `parent-skill-check.cjs .skilled/skills/sk-code`, `ci-skill-root-metadata.cjs`, `compiled-route-guard.cjs`, `compiled-route-sync.cjs --check`, `run-all-drift-guards.sh`, `ci-skill-derived-freshness.cjs`, and a route probe that must print `"action":"route"`.
- One repair command per failing leg, taken from the README block and the guard's own fix line.
- Index rows in `.skilled/commands/README.txt` and one reference line each in the root `README.md` Verify step, `.skilled/skills/sk-code/README.md` VERIFICATION and `.skilled/skills/sk-code/SKILL.md`.

### Out of Scope
- Any write or repair inside the command (research X4).
- A target under `/doctor:skill-advisor` (X2) or an extension of the `parent-skill` route (X3).
- A `sk-code-setup` hub mode (X1).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/sk-code.md` | Create | The command and its router |
| `.skilled/commands/doctor/_routes.yaml` | Modify | The `setup` route |
| `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml`, `doctor-sk-code-presentation.txt` | Create | Workflow and presentation |
| `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` and a test under `scripts/tests/` | Create | The read-only battery |
| `.skilled/commands/README.txt` | Modify | Doctor index rows |
| `README.md`, `.skilled/skills/sk-code/README.md`, `.skilled/skills/sk-code/SKILL.md` | Modify | One reference line each |
| Runtime command mirrors | Generated | By the sync script |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `route-validate.sh` exits 0 with a `/doctor:sk-code` route whose target is `setup` and whose `mutating` is `read-only` |
| REQ-002 | On the live tree and on a pristine copy, `sk-code-setup-check.cjs` reports every leg passing and exits 0 |
| REQ-003 | After a hand edit to sk-code routing without a refresh, it exits 1, reports the guard leg with the refresh command and fails the probe leg on the legacy stub |
| REQ-004 | In an unprovisioned tree, it reports the provisioning precheck with the provision command and no stack |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The runtime mirrors sync and the command catalog mirror check exit 0; the three reference files each name `/doctor:sk-code` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

Copy runs are ledger rows `| S-<n> | Pass | <backticked command and what it printed> |` in `implementation-summary.md`: S-1 pristine copy, S-2 stale copy, S-3 unprovisioned clone. Review findings go in a `| RV-<n> | P<0-2> | Fixed or Rejected | <proof or reason> |` table.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A user runs one command and learns which battery leg fails and the command that clears it.
- **SC-002**: The probe leg cannot pass a hub that serves no compiled route.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The battery takes about 15 s and grows with the drift guards | Low | Research E6 measured 15 s; legs run once each |
| Risk | The check script and the README battery drift apart | Med | The README Verify step names the doctor command as the one-shot form |
| Dependency | 001 on origin/main | High | The build starts from origin/main after the operator pushes 001 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The command writes nothing; `route-validate.sh` enforces read-only.
- **NFR-R02**: A failing leg prints its repair command and never a stack trace.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Both example surfaces removed by the README recipe: every leg passes.

### Error Scenarios
- The provisioning precheck fails: the later legs that load the contract library are reported as skipped, not as separate failures.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | A new command, its route, assets, one script and test, index rows, mirrors |
| Risk | 6/25 | Read-only |
| Research | 3/20 | Shape decided in research section 5 |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether the target also runs `test_readme_manifest.py` in check mode (research section 12); decide while building and record the decision in `goal.md`.
<!-- /ANCHOR:questions -->
