---
title: "Feature Specification: retire the /design:* alias namespace"
description: "Make /interface:* the sole public sk-design command surface by retiring the /design:* alias namespace end-to-end: re-key the surface checker and three registries, strip the alias plumbing, and delete the commands/design/ tree."
trigger_phrases:
  - "retire design aliases"
  - "interface command surface"
  - "command namespace dedup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/006-retire-design-alias-namespace"
    last_updated_at: "2026-07-20T18:23:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author the /design:* retirement spec (AUTHOR-SPEC stage)"
    next_safe_action: "Re-key checker + 3 registries, delete commands/design/, run checker + tests"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/commands/design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: retire the /design:* alias namespace

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `012-style-database-and-interface-commands` |
| **Predecessor** | `005-review-remediation` |
| **Successor** | None |
| **Phase** | 6 of 6 |
| **Source** | Operator decision (FROZEN): `/interface:*` is the sole public sk-design command surface; the `/design:*` alias namespace is retired |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 004 shipped the five `/interface:*` creation commands but kept a full `/design:*` alias layer for backward compatibility: five thin alias wrappers under `.opencode/commands/design/`, fifteen alias assets, `canonicalCommand` + `compatibilityAliases` fields across the command registries, and alias-reconciliation machinery in the surface checker. The result is a duplicated public command surface — every mode is addressable under two namespaces — which is exactly the kind of drift the surface checker exists to prevent. The operator has decided the alias era is over: `/interface:*` is the one true surface.

### Purpose

Make `/interface:*` the sole, primary, canonical command surface and delete the `/design:*` alias namespace end-to-end — no alias wrappers, no alias assets, no `compatibilityAliases`/`canonicalCommand` fields, no alias reconciliation in the checker, no alias assertions in the tests. The executable contract is the surface checker plus its test suite: the refactor is correct iff the checker exits 0 (no drift) and the tests are green.

### Decision (FROZEN)

Keep `/interface:*` as the SOLE public sk-design command surface and retire the `/design:*` alias namespace entirely.

- **Kept — the five `/interface:*` commands:** `/interface:design`, `/interface:design-reference`, `/interface:foundations`, `/interface:motion`, `/interface:audit`.
- **Retired — the `/design:*` aliases:** `design:audit`, `design:foundations`, `design:interface`, `design:md-generator`, `design:motion`.
- **Rename map (mode → primary command):** `interface` → `/interface:design`; `foundations` → `/interface:foundations`; `motion` → `/interface:motion`; `audit` → `/interface:audit`; `md-generator` → `/interface:design-reference`. Two of these are non-identity renames (`interface`→`design`, `md-generator`→`design-reference`).
- **Unchanged transport:** the `design-mcp-open-design` registry mode (`command: null`) is a bare no-command token, not a `/design:` command, and stays as-is everywhere.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Surface checker** — re-key the command set to `/interface:*`, remove the `canonicalCommand`/`compatibilityAliases` required fields, drop the alias-reconciliation and canonical-projection machinery, and point the wrapper roster read at `interface` only.
- **Three registries** — re-key each mode's command to its `/interface:*` primary and remove the alias fields/blocks in `command-metadata.json`, `hub-router.json`, and `mode-registry.json`.
- **Command tree deletion** — delete the entire `.opencode/commands/design/` tree (5 alias wrappers + 15 alias assets).
- **Two checker test files** — update `design-command-surface-check.test.mjs` and `interface-command-contract.test.mjs` to the `/interface:*` namespace and remove the alias-only assertions.
- **Ungated prose reconciliation** — update dangling `/design:*` "compatibility alias" language in ungated docs (skill/README/feature-catalog/testing-playbook) so it no longer describes a live alias surface; historical changelogs are preserved as-is.

### Out of Scope

- Changing any `/interface:*` wrapper or asset content — they already carry `/interface:*` sibling tokens and zero `/design:` references, so no interface asset is rewritten.
- Changing the `design-mcp-open-design` transport token or any design judgment (mode taste, numeric laws, audit rubric).
- Rewriting historical changelog entries (`changelog/v1.4.3.0.md`, `changelog/v1.6.0.0.md`) that document the alias era — those stay; a new changelog entry records the retirement.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Re-key command set to `/interface:*`; drop `canonicalCommand`/`compatibilityAliases` fields, alias reconciliation, and canonical projection; roster read `interface` only |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs` | Modify | Re-key assets/tokens to `/interface:*` sibling set; update mutation fixtures |
| `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` | Modify | Drop legacy/alias fields; remove the "thin in-place alias" test |
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Re-key `command` per rename map; delete `canonicalCommand`/`compatibilityAliases`; rewrite cross-reference tokens preserving array order |
| `.opencode/skills/sk-design/hub-router.json` | Modify | Delete `commandSurface.compatibilityAliases`; keep `canonicalNamespace` + `canonicalByMode` |
| `.opencode/skills/sk-design/mode-registry.json` | Modify | Re-key each mode's `command` to `/interface:*`; delete `compatibilityAliases`; update prose |
| `.opencode/commands/design/` | Delete | Remove the 5 alias wrappers + 15 alias assets (whole tree) |
| `.opencode/skills/sk-design/SKILL.md`, `README.md`, `feature-catalog/**`, `styles/manual-testing-playbook.md` | Modify | Reconcile dangling `/design:*` alias prose (ungated) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Surface checker passes with zero drift | `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` exits 0 (STATUS=VALID, drift=0) against the re-keyed `/interface:*` surface |
| REQ-002 | Checker test suite is green | `node --test design-command-surface-check.test.mjs interface-command-contract.test.mjs` passes; the removed "legacy thin aliases" test drops the count from 16 to 15 with no failures |
| REQ-003 | `/design:*` is gone | No `/design:` command token remains in `design-command-surface-check.mjs` or the three registries, and `.opencode/commands/design/` (5 wrappers + 15 assets) no longer exists |
| REQ-004 | `/interface:*` is intact | The five `commands/interface/` wrappers and their fifteen assets remain present and unmodified; the five `/interface:*` commands resolve through the registries |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Alias plumbing removed | `REQUIRED_FIELDS` no longer names `canonicalCommand`/`compatibilityAliases`; the alias-reconciliation and canonical-projection code paths are deleted; `hub-router.json` and `mode-registry.json` no longer carry a `compatibilityAliases` block; each `mode-registry` mode `command` is its `/interface:*` primary |
| REQ-006 | Prose honesty | Dangling `/design:*` "compatibility alias" language in ungated docs is reconciled to describe the primary `/interface:*` surface; historical changelog entries are preserved unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The surface checker exits 0 with drift=0 after the re-keying (REQ-001).
- **SC-002**: `node --test design-command-surface-check.test.mjs interface-command-contract.test.mjs` is green at 15 tests (REQ-002).
- **SC-003**: `rg -n '/design:' .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs .opencode/skills/sk-design/command-metadata.json .opencode/skills/sk-design/hub-router.json .opencode/skills/sk-design/mode-registry.json` returns no command tokens, and `.opencode/commands/design/` is absent (REQ-003).
- **SC-004**: The five `commands/interface/` wrappers + fifteen assets are present and byte-unchanged (REQ-004).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `commands/interface/` already self-contained on `/interface:*` tokens | Low | Confirmed: the interface wrappers/assets carry zero `/design:` references, so the surface-drift target is already correct — the work is re-keying the JSON layer, not rewriting assets |
| Risk | Cross-reference tokens in `command-metadata.json` are order-sensitive (validators enforce `handoff.nextOptions == next` and subset relations) | Med | Rewrite tokens via the deterministic 5-key rename map while preserving array element order; run the checker to confirm no ordering drift |
| Risk | Deleting `commands/design/` makes the checker's `readdir(["design","interface"])` throw ENOENT | Med | The roster read must be narrowed to `["interface"]` in the same change so the checker does not crash post-deletion |
| Risk | `mode-registry` `command` fields still `/design:*` would desync the discriminator/pipeline/handoff sets from the re-keyed metadata | Med | Re-key every mode `command` to its `/interface:*` primary; the transport mode `command:null` stays null |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- The surface checker is the single executable authority; correctness is defined solely by its exit-0 result plus the green test suite. No behavior claim is made without those two checks.

### Security

- Comment hygiene [HARD BLOCK]: no spec/packet/phase/REQ ids in any code comment touched by the implementation — all edits are identifiers/strings/JSON values, not annotations.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The rename map, the executable contract (checker exit 0 + tests green), and the delete-vs-preserve boundary are all fixed by the frozen operator decision and confirmed against the on-disk surface.
<!-- /ANCHOR:questions -->
