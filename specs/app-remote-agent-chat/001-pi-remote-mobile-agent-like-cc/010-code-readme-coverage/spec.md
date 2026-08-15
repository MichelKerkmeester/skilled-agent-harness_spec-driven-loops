---
title: "Feature Specification: Code README Coverage"
description: "Plans a code-folder README in every Pi Remote source folder and realigns the four existing READMEs to the sk-create-readme code-folder template."
trigger_phrases:
  - "pi remote code readme coverage"
  - "pi mobile phase 10"
  - "code readme coverage"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/010-code-readme-coverage"
    last_updated_at: "2026-08-13T17:22:43Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Authored 32 code READMEs to the sk-create-readme template"
    next_safe_action: "Proceed to phase 011 architecture reference"
    blockers:
      - "Draft planning phase; implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---

# Feature Specification: Code README Coverage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-08-13 |
| **Branch** | `skilled/0147-pi-remote-experience` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 10 of 15 |
| **Predecessor** | `../009-release-verification-and-rollout/spec.md` |
| **Successor** | `../011-architecture-reference/spec.md` |
| **Handoff Criteria** | Every planned code-folder README exists in the `sk-create-readme` code-folder shape, the four existing READMEs are realigned to that template, and `audit_readmes.py` coverage reports zero missing code-folder targets |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The built Pi Remote monorepo has code folders with no developer orientation: a new agent or contributor landing in `apps/pi-remote-relay/src/store/` or `packages/pi-rpc-protocol/tests/` cannot tell what the folder owns, what it may import, or which validation commands apply. Only four READMEs exist today (`README.md`, `deploy/README.md`, `deploy/containment/README.md`, `extensions/pi-remote-approval/README.md`), and none follow the `sk-create-readme` code-folder template shape. Without a bounded phase, coverage would be partial and each folder would document itself differently.

### Purpose

Deliver a bounded, independently verifiable workstream that puts a current-state code-folder README in every Pi Remote source folder, realigns the four existing READMEs, and makes README coverage measurable so future folders cannot silently ship without orientation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `README.md` in every planned code folder of the Pi Remote app at `Apps/Pi Mobile/`, authored to the `sk-create-readme` code-folder template (`assets/readme-code-template.md`).
- Realignment of the four existing READMEs to the same template shape.
- A coverage inventory that maps each planned README to its target folder and documents the template standard applied.

### Out of Scope
- The root project `README.md` realignment (owned by phase `014-onboarding-and-root-readme`).
- Rewriting the `docs/*.md` runbooks (owned by phase `012-docs-as-skill-references`).
- Authoring the architecture document (owned by phase `011-architecture-reference`).
- Any change to app source code, tests, or configuration.

### Files to Change

The deliverables are authored under `Apps/Pi Mobile/`. The plan writes only the planned README files listed below.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `Apps/Pi Mobile/packages/pi-rpc-protocol/README.md` | Planned | Package orientation: wire contracts, typed envelope, runtime guards |
| `Apps/Pi Mobile/packages/pi-rpc-protocol/src/README.md` | Planned | Source zone map: `types.ts`, `approval.ts`, `auth.ts`, `guards.ts`, `index.ts` |
| `Apps/Pi Mobile/packages/pi-rpc-protocol/tests/README.md` | Planned | Test orientation: `guards.test.ts`, fixture coverage, validation command |
| `Apps/Pi Mobile/apps/pi-remote-relay/README.md` | Planned | Package orientation: supervision, state, auth, push, mutation |
| `Apps/Pi Mobile/apps/pi-remote-relay/migrations/README.md` | Planned | Numbered up/down SQL migrations `001`-`004` and migration runner |
| `Apps/Pi Mobile/apps/pi-remote-relay/src/README.md` | Planned | Source zone map and allowed dependency direction for the relay |
| `Apps/Pi Mobile/apps/pi-remote-relay/src/approval/README.md` | Planned | `approval-service.ts`, `final-gate.ts` lease path |
| `Apps/Pi Mobile/apps/pi-remote-relay/src/auth/README.md` | Planned | `auth-service.ts`, `enrollment.ts`, `policy.ts`, `rate-limit.ts` |
| `Apps/Pi Mobile/apps/pi-remote-relay/src/fixtures/README.md` | Planned | `pi-rpc.jsonl` recorded fixture and replay contract |
| `Apps/Pi Mobile/apps/pi-remote-relay/src/http/README.md` | Planned | `server.ts` HTTP/WSS loopback surface and secret-prefix guard |
| `Apps/Pi Mobile/apps/pi-remote-relay/src/policy/README.md` | Planned | `mutation-policy.ts` per-command mutation gates |
| `Apps/Pi Mobile/apps/pi-remote-relay/src/prompt/README.md` | Planned | `prompt-service.ts` steering prompt transport |
| `Apps/Pi Mobile/apps/pi-remote-relay/src/push/README.md` | Planned | `push-service.ts` privacy-minimized Web Push hints |
| `Apps/Pi Mobile/apps/pi-remote-relay/src/release/README.md` | Planned | `rollback-drill.ts` drill entrypoint |
| `Apps/Pi Mobile/apps/pi-remote-relay/src/replay/README.md` | Planned | `sync.ts` sync/replay barrier |
| `Apps/Pi Mobile/apps/pi-remote-relay/src/rpc/README.md` | Planned | `supervisor.ts`, `demux.ts`, `framing.ts` Pi RPC child supervision |
| `Apps/Pi Mobile/apps/pi-remote-relay/src/sessions/README.md` | Planned | `catalog.ts` session catalog |
| `Apps/Pi Mobile/apps/pi-remote-relay/src/store/README.md` | Planned | `relay-store.ts`, `migrations.ts`, `redaction.ts`, `transcript-projector.ts` |
| `Apps/Pi Mobile/apps/pi-remote-relay/scripts/README.md` | Planned | `copy-runtime-assets.mjs` build asset step |
| `Apps/Pi Mobile/apps/pi-remote-relay/tests/README.md` | Planned | Unit, `integration/`, `kill-points/`, `security/` suites and run command |
| `Apps/Pi Mobile/apps/pi-remote-web/README.md` | Planned | Package orientation: installable PWA, service worker, cache |
| `Apps/Pi Mobile/apps/pi-remote-web/src/README.md` | Planned | Source zone map: `state.ts`, `cache.ts`, `relay.ts`, `auth.ts`, `attention.ts`, `App.tsx` |
| `Apps/Pi Mobile/apps/pi-remote-web/public/README.md` | Planned | Static assets: `manifest.webmanifest`, `service-worker.js`, `icon.svg` |
| `Apps/Pi Mobile/apps/pi-remote-web/tests/README.md` | Planned | `App.test.tsx`, `setup.ts`, web test config |
| `Apps/Pi Mobile/extensions/pi-remote-approval/README.md` | Realigned | Final-boundary extension orientation to the code-folder template |
| `Apps/Pi Mobile/extensions/pi-remote-approval/src/README.md` | Planned | `index.ts` tool-call handler and lease transport |
| `Apps/Pi Mobile/extensions/pi-remote-approval/tests/README.md` | Planned | `final-boundary.test.ts` fixture suite |
| `Apps/Pi Mobile/deploy/README.md` | Realigned | Tailnet deployment orientation to the code-folder template |
| `Apps/Pi Mobile/deploy/containment/README.md` | Realigned | macOS `sandbox-exec` containment orientation to the code-folder template |
| `Apps/Pi Mobile/release/README.md` | Planned | Thresholds, rollout policy, and `evidence/` output contract |
| `Apps/Pi Mobile/scripts/README.md` | Planned | Release gate and rollback drill entrypoints |
| `Apps/Pi Mobile/tests/README.md` | Planned | Release-readiness tests at repo root |
| `Apps/Pi Mobile/README.md` | Deferred to phase 014 | Root project README realignment |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every planned code folder has a current-state README. | Each README exists at the listed path under `Apps/Pi Mobile/` and describes only confirmed files, exports, and commands. |
| REQ-002 | READMEs follow the `sk-create-readme` code-folder template. | Every authored README uses the code-folder shape: optional frontmatter, `## 1. OVERVIEW`, and only applicable sections from the template. |
| REQ-003 | Coverage is measurable. | The `audit_readmes.py` inventory or an equivalent inventory reports zero missing code-folder targets for the planned set. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Existing READMEs are realigned, not duplicated. | `Apps/Pi Mobile/deploy/README.md`, `deploy/containment/README.md`, and `extensions/pi-remote-approval/README.md` keep their verified commands while adopting the template shape. |
| REQ-005 | Validation commands work from the repo root. | Every README VALIDATION command matches an existing `package.json` script or a confirmed `vitest`/`tsc` invocation. |
| REQ-006 | No packet history enters durable READMEs. | READMEs cite current source files and commands, not spec or phase numbers, per the evergreen-packet-id rule. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A developer landing in any listed code folder can identify the folder's responsibility, key files, boundaries, and validation command without opening source.
- **SC-002**: A reviewer can trace every README claim to a confirmed file, export, or command under `Apps/Pi Mobile/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Stable app surface | READMEs can drift during later phases | Freeze claims to the current working tree and re-run the inventory after phases 011-015 |
| Risk | Stale or unverified commands | Broken orientation | Test commands from the repo root or mark them explicitly as examples |
| Risk | Scope overlap with phase 014 | Root README ownership ambiguity | Root `README.md` is deferred to phase 014 and excluded from this phase's inventory |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- The coverage inventory runs in bounded time against `Apps/Pi Mobile/` only.

### Security
- READMEs never contain secrets, enrollment payloads, host paths, or credential-bearing example output.

### Reliability
- A missing or failing README target is reported by the inventory, not silently skipped.

---

## L2: EDGE CASES

### Data Boundaries
- Flat folders (no subdirectories) use the template's complete `KEY FILES` table branch instead of a directory tree.

### Error Scenarios
- Confirmed file or command missing: drop the claim and mark the target blocked.
- Existing README conflict: realign in place rather than overwriting verified operator guidance.

### State Transitions
- The planned READMEs are Draft deliverables; implementation starts only after this phase is approved.

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 13/25 | 30 planned README targets across the monorepo |
| Risk | 8/25 | Documentation-only surface, no runtime change |
| Research | 10/20 | App surface confirmed; template details in `sk-create-readme` |
| Multi-Agent | 5/15 | Single owner by default |
| Coordination | 10/15 | Reads the whole monorepo, writes only README files |
| **Total** | **46/100** | **Level 2** |

---

## 10. OPEN QUESTIONS

- Does implementation preflight confirm the exact `npm` workspace script names for each folder's validation section?
- Which README targets does the operator choose to defer as P1 items after seeing the inventory?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent phase map**: [../spec.md](../spec.md)
- **Implementation plan**: [plan.md](plan.md)
- **Task ledger**: [tasks.md](tasks.md)
- **Verification checklist**: [checklist.md](checklist.md)
- **Current state**: [implementation-summary.md](implementation-summary.md)
