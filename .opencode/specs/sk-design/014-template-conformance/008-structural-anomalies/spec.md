---
title: "Feature Specification: sk-design structural anomalies"
description: "Four small independent structural items across sk-design modes: a vestigial node_modules stub to remove, the loose .mjs placement question (RESOLVED — relocated to transport/), a missing benchmark index to add, and two legitimate absences to record without fixing."
trigger_phrases:
  - "sk-design structural anomalies"
  - "design-mcp-open-design loose executables"
  - "compiled-routing missing index"
  - "vestigial node_modules stub"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/008-structural-anomalies"
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "structural-anomalies-executor"
    recent_action: "Relocated four Open Design transport modules into transport/ and updated all references"
    next_safe_action: "Remove the vestigial design-md-generator/node_modules stub (item 1, still Planned)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/node_modules/"
      - ".opencode/skills/sk-design/design-mcp-open-design/transport/"
      - ".opencode/skills/sk-design/benchmark/reports/compiled-routing/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "structural-anomalies-session"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Should the four root .mjs files move? YES — relocated to transport/, a domain-named subdirectory (not scripts/)."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: sk-design structural anomalies
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress — item 3 shipped; items 1, 2 still Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Four small, unrelated structural irregularities surfaced during the hub-wide template audit that don't belong to any single mode's own conformance child: a vestigial empty test-result stub sitting where a real dependency install would go, four loose runtime `.mjs` modules at a packet root when every sibling mode keeps equivalent code in a domain-named subdirectory, a benchmark run-category directory missing the index file its siblings all have, and two structural absences (`procedures/` in one mode, `scripts/` in another) that are legitimate rather than gaps.

### Purpose

Resolve the two clearly mechanical items (the stub, the missing index), rule the loose-module placement question on repository evidence rather than deferring it indefinitely, and record the two legitimate absences without inventing a fix for something that isn't broken.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Removing `.opencode/skills/sk-design/design-md-generator/node_modules/`, confirmed to contain only `.vite/vitest/<empty-sha>/results.json` and nothing else.
- Adding a missing index file (`README.md`) to `.opencode/skills/sk-design/benchmark/reports/compiled-routing/`, modeled on the pattern its sibling run directories (`baseline/`, `2026-07-06--after-009--router/`, etc.) already use — each has its own `README.md`; `compiled-routing/` is the one sibling missing one.
- **RESOLVED AND EXECUTED** — relocating `design-mcp-open-design`'s four root-level `.mjs` files (`grounding-receipt.mjs`, `live-transport.mjs`, `offline-gate.mjs`, `return-reconciliation.mjs`) into a domain-named `transport/` subdirectory, with every importer, test, and doc reference updated. See §7 for the ruling and its evidence.
- Recording, without fixing, that `design-mcp-open-design` has no `procedures/` and `design-motion` has no `scripts/` — both are legitimate absences, not gaps.

### Out of Scope

- Moving the four `.mjs` files into `scripts/` specifically — investigation showed `scripts/` is the WRONG destination (see §7); they went to `transport/` instead.
- Editing the contents of the four modules beyond their import paths — `PAIRED_MODES` and `ALLOWED_INFLUENCE_AXES` (including the `'motion'` design axis) are preserved byte-for-byte.
- Any other mode's own template/structure conformance (owned by children 002-007).
- The stale `design-motion/corpus/motion-evidence.mjs` path in the hub feature catalog (belongs to the motion-merge packet, 010 — reported, not fixed here).
- Adding a `procedures/` to `design-mcp-open-design` or a `scripts/` to `design-motion` — both would be manufacturing structure the modes don't need.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design-md-generator/node_modules/` | Delete | Vestigial stub containing only an empty vitest result cache |
| `benchmark/compiled-routing/README.md` | Create | Missing index, modeled on sibling run-directory `README.md` files |
| `design-mcp-open-design/{grounding-receipt,live-transport,offline-gate,return-reconciliation}.mjs` | Move → `transport/` | Relocated into a domain-named subdirectory; only import-path lines changed |
| `design-mcp-open-design/transport/README.md` | Create | Required code-directory index, matching the `fixtures/` and `tests/` README shape |
| `design-mcp-open-design/fixtures/offline-fixtures.mjs` | Modify | Two imports repointed to `../transport/` |
| `design-mcp-open-design/tests/transport-grounding.test.mjs` | Modify | Four imports repointed to `../transport/` |
| `design-mcp-open-design/{fixtures,tests}/README.md` | Modify | Doc links repointed to `../transport/` |
| `sk-design/feature-catalog/styles-library-utilization/per-mode-consumers.md` | Modify | Two consumer-table paths repointed to `transport/` |
| (no path — record only) | Documented, not fixed | `design-mcp-open-design/procedures/` and `design-motion/scripts/` absences recorded as legitimate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `design-md-generator/node_modules/` is removed | `find .opencode/skills/sk-design/design-md-generator/node_modules` returns "No such file or directory"; `design-md-generator/backend/node_modules/` (the real install) is untouched |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `benchmark/compiled-routing/README.md` exists and indexes its run subdirectories | File exists; lists `2026-07-21--playbook-verify--sonnet`, `2026-07-21--real--luna-high`, `2026-07-21--verify--luna-high` (or whatever subdirectories exist at authoring time) |
| REQ-003 | The `.mjs` placement question is ruled on the evidence, executed, and the reasoning recorded | §7 states the ruling, the standard, the sibling precedent, and the consumer map; the four modules live under `transport/`; 37/37 transport tests pass; `parent-skill-check` OK with 0 warnings; `package_skill.py --check` PASS |
| REQ-006 | The relocation changes no module semantics | `diff` of each moved file against its `HEAD` content shows only import-path lines; `PAIRED_MODES` and `ALLOWED_INFLUENCE_AXES` (incl. the `'motion'` axis) are byte-identical |
| REQ-007 | No reference to the old root paths survives on any live surface | Repo-wide search for the four old paths (excluding historical `.opencode/specs/`) returns zero hits |
| REQ-004 | The two legitimate absences are recorded without a fabricated fix | Spec states both absences and why each is legitimate, with no corresponding task to add the missing folder |
| REQ-005 | The stub removal never touches the real `design-md-generator/backend/node_modules/` install | `ls .opencode/skills/sk-design/design-md-generator/backend/node_modules` still resolves after REQ-001 executes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The vestigial stub is gone and the real `backend/node_modules/` install is unaffected.
- **SC-002**: `benchmark/compiled-routing/` has the same self-describing index its sibling benchmark directories have.
- **SC-003**: The `.mjs` placement question is ruled on repo evidence, executed, and fully documented with its reasoning; the two legitimate absences remain recorded without a fabricated fix.
- **SC-004**: The Open Design transport behaves identically after the move — 37/37 tests, no semantic edit to any module.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Confusing the vestigial `design-md-generator/node_modules/` stub with the real `backend/node_modules/` install | Deleting the wrong directory breaks a real dependency install | Verify the stub's only content is `.vite/vitest/<empty-sha>/results.json` before deleting; never touch `backend/node_modules/` |
| Risk (retired) | Moving the `.mjs` files breaks the live transport's import graph | Transport fails closed or silently mis-validates receipts | Verified before acting: zero external consumers, zero fixed-path resolution. Moved all four together so sibling `./` imports stayed valid; re-ran the 37-test suite (37/37, unchanged from baseline) and diffed every moved file against `HEAD` to prove only import paths changed |
| Risk (materialized, handled) | The audit's stated blast radius was itself inaccurate | Acting on it would have caused pointless churn in a file that never imported these modules | `design-command-surface-check.mjs` was verified NOT to be a consumer; the claim is corrected in §7 rather than inherited |
| Risk | Colliding with concurrent sessions editing `sk-design/` | Overwriting another session's in-flight work | `git status` checked immediately before the move (clean) and again after; every changed file is one this packet owns |
| Dependency | Sibling `benchmark/` directory README pattern | New index must match the existing per-run `README.md` shape | Read `benchmark/baseline/README.md` before authoring the new index |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The stub-removal step never touches `design-md-generator/backend/node_modules/`, the real install.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error Scenarios
- **Stub turns out not to be empty**: if `design-md-generator/node_modules/` contains anything beyond `.vite/vitest/<empty-sha>/results.json`, halt and re-classify before deleting — do not assume the audit's snapshot is still accurate at execution time.
- **Sibling benchmark directories change shape before this packet executes**: re-read whichever run subdirectories actually exist under `compiled-routing/` at execution time rather than trusting this spec's list.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

**No open questions remain.** The one question this packet carried is resolved below.

### RESOLVED: Should the four root-level `.mjs` files move?

**Ruling: YES — relocate all four, but into a domain-named `transport/` subdirectory, NOT into `scripts/`.** The ruling is uniform: all four files are the same kind (one closed runtime import graph), so no mixed outcome was warranted. Executed in this packet.

#### What the four files are

| File | Kind | Role |
|------|------|------|
| `grounding-receipt.mjs` | Contract root | Declares `PAIRED_MODES` and `ALLOWED_INFLUENCE_AXES`, the receipt schema, and its validators. Every other module depends on it. |
| `return-reconciliation.mjs` | Contract | Recomputes semantic outcome/divergence from returned evidence; authority stays with the paired mode. |
| `offline-gate.mjs` | Gate | Replays the fixture atlas plus eight falsifiers, fails closed, and binds the result identity before live I/O. |
| `live-transport.mjs` | Executor | Capability-gated live read/run; asserts the offline gate first. |

None is an operator entrypoint or a CLI. They are library modules imported by other code.

#### Who consumes them (complete map)

Searched the whole repository for requires, imports, CLI invocations, test references, npm scripts, and YAML step references. The consumer graph is **entirely internal to the packet**:

- `live-transport.mjs` → the other three (sibling `./` imports).
- `offline-gate.mjs` → `grounding-receipt.mjs`, `return-reconciliation.mjs`, `fixtures/offline-fixtures.mjs`.
- `return-reconciliation.mjs` → `grounding-receipt.mjs`.
- `grounding-receipt.mjs` → `sk-design/shared/corpus-context/` (the shared proof contract).
- `fixtures/offline-fixtures.mjs` and `tests/transport-grounding.test.mjs` → import them by relative path.

**Nothing outside `design-mcp-open-design/` imports them. No consumer resolves them by an absolute or fixed path.** No npm script, YAML step, MCP server config, `mode-registry.json`, `hub-router.json`, or `leaf-manifest.json` entry references them — `leaf-manifest.json` tracks only markdown leaves, so the move produced no manifest drift. Two documentation surfaces referenced them by path (`fixtures/README.md`, `tests/README.md`) plus the hub feature catalog; all were updated.

The prior spec text claimed `shared/scripts/design-command-surface-check.mjs` was an affected consumer. **That claim was wrong** — that script imports only `node:fs/promises` and `node:url` and never references these modules. Corrected here so the next audit does not inherit the error.

#### Why root placement is a genuine defect

1. **The standard does not sanction it.** `create-skill`'s `references/shared/overview.md` §2 enumerates the skill anatomy as `SKILL.md` + `README.md` + bundled resources `scripts/` / `references/` / `assets/`. Loose executable code at a packet root is outside the enumerated layout.
2. **It is the sole instance in the repository.** Across all of `.opencode/skills/`, only these four files sit as loose runtime `.mjs` at a skill or packet root. Every other JS module lives under `scripts/`, `shared/`, or a domain-named subdirectory. The only other root-level `.mjs` files are `vitest.config.mjs` and `eslint.config.mjs`, which are **tool-mandated** root configs — a real exemption these four cannot claim.
3. **Both sibling packets in this hub already show the pattern.** `design-interface/corpus/` holds three runtime `.mjs` contract modules plus their tests in a domain-named subdirectory; `design-md-generator/backend/` holds all its runtime code the same way. `sk-design/shared/corpus-context/` does likewise.
4. **The packet already uses the pattern internally.** `fixtures/` and `tests/` are domain-named subdirectories holding `.mjs`. The four contract modules are their peers and were the only ones left at root.
5. **No load-bearing reason for root exists.** No fixed-path consumer, no tool mandate, and no document anywhere declared the placement intentional.

#### Why NOT `scripts/` (the original framing was wrong)

The packet's own `scripts/README.md` scopes `scripts/` explicitly to "local readiness checks" — the bash `install.sh`, `doctor.sh`, and `_common.sh`. The `create-skill` standard likewise describes `scripts/` as agent-invocable executable code (its examples are `rotate_pdf.py`, `init_skill.py`). Filing a runtime contract library there would contradict that directory's documented scope and mix two different kinds of code. `transport/` names the subsystem, exactly as `corpus/` and `backend/` do for the siblings.

#### Note on checker silence

`package_skill.py --check` and `parent-skill-check.cjs` both passed **before** the move. Neither has a rule about root-level code placement, so their silence was absence of enforcement, not affirmative approval — it is not evidence that root placement was correct.

#### What was deliberately NOT changed

`PAIRED_MODES` (the two-mode set) and `ALLOWED_INFLUENCE_AXES` are preserved byte-for-byte. `ALLOWED_INFLUENCE_AXES` still contains `'motion'`, which is a **design axis, not a mode id**, and is correct despite the motion mode's retirement. A `diff` of each moved file against its `HEAD` content confirms only import-path lines changed; `live-transport.mjs` and `return-reconciliation.mjs` were not edited at all.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: `.opencode/specs/sk-design/014-template-conformance/spec.md`
