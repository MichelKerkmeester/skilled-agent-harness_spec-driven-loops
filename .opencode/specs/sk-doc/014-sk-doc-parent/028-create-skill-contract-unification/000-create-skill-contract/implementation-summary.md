---
title: "Implementation Summary: create-skill contract unification"
description: "Executed the Level-3 remediation: the nine create-skill audit findings are resolved across seven work units led by one machine-readable contract, shipped as 12 commits to skilled/v4.0.0.0. Two items are carried as follow-ups (a parent negative-fixture corpus; a pre-existing validate_document symlink path bug)."
trigger_phrases:
  - "028 create-skill contract unification summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification/000-create-skill-contract"
    last_updated_at: "2026-07-14T04:33:36.957Z"
    last_updated_by: "claude-opus"
    recent_action: "Executed all seven work units; reconciled packet docs to shipped state"
    next_safe_action: "Optional: parent negative-fixture corpus + validate_document symlink fix"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-skill/scripts/init_skill.py"
      - ".opencode/skills/sk-doc/create-skill/scripts/package_skill.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 000-create-skill-contract |
| **Status** | Complete (executed 2026-07-13; 12 commits on skilled/v4.0.0.0) |
| **Level** | 3 |
| **Deliverable** | The create-skill layer now enforces its own contract: one machine-readable `skill_contract.json` consumed by dual-language loaders and the validators, a strict mode, a kind-aware completion gate, asset-rendered generation, and `--kind parent` scaffolding of a hub that passes `parent-skill-check.cjs` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The nine audit findings from `../../create-skill-findings.md` are resolved. The create-skill create/validate/generate layer now enforces one machine-readable contract as its single source of truth. Executed as 12 commits on `skilled/v4.0.0.0`:

### The seven work units (finding mapping + commit)

1. **WU1 (P0)** `7a2acf34f4` (+`0f2c601f9f` WU1b) — one machine-readable contract at `sk-doc/shared/assets/skill_contract.json` (section order, description budget, RULES subsections, tool rules, packet kinds) with `.py`/`.cjs` degrade-on-error loaders; budget unified to ≤130 soft; dissolves findings 2, 4, 7.
2. **WU2 (P1)** `bebde560c4` — `package_skill.py --check --strict` promotes documented requirements to failures; warning mode stays default; finding 3.
3. **WU3 (P1)** `d68f66e218` — kind-aware completion dispatcher `validate_skill_package.py` (standalone → package check; parent → package check + `parent-skill-check.cjs`); documented gate repointed; finding 5.
4. **WU5 (P2)** `932bdd522c` + `aa951f1139` — structured YAML frontmatter parse (regex fallback), real `allowed-tools` array, packet `name`-vs-`packetSkillName`, `tieBreak` exact permutation; findings 6, 8.
5. **WU4 (P0)** `2ca7a9f4b2` (WU4a) + `5cbb31f2a3` (WU4b) — render `init_skill.py` from a canonical asset (stops example-file seeding) + `--kind parent` scaffolding a checker-passing minimal hub; findings 1, 2.
6. **WU6 (P2)** `f7525b9575` — parent templates: computed tool union + conditional `surfaceBundle`; finding 7.
7. **WU7 (P1)** `01978caa01` (+`3bedd7fb11` exemption follow-up) — contract + packaging fixtures and the two ZIP edge-case fixes; findings 3, 6, 8, 9.

A twelfth commit adds the contract loader-parity + template-order guard test.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each of the nine audit findings was independently re-verified at file:line against HEAD before planning (e.g., `init_skill.py` has no `--kind`; the embedded template orders `REFERENCES` at #3 vs the canonical last; `package_skill.py:185-192` demotes requirements to warnings; three description budgets disagree; `SKILL.md:25` names only the standalone gate; `:156` is a substring name check). The plan was then authored in an isolated git worktree at the origin tip to avoid a concurrent session's shared-tree churn, and validated from the main tree's tooling against the worktree paths.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **ADR-001**: one machine-readable contract as the single source — dissolves the triplicated-contract root cause rather than patching each validator.
- **ADR-002**: strict mode opt-in, then required — promotes documented requirements to failures without redding the fleet on day one.
- **ADR-003 (resolved)**: operator confirmed the ≤130-char soft target (retiring `package_skill.py`'s 150-300 recommendation, 1,536 hard cap retained); shipped in WU1b (`0f2c601f9f`).
- **ADR-004**: a kind-aware completion dispatcher so a parent hub proves its parent invariants, not just the standalone gate.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|---|---|
| Nine findings resolved across the work units | 9/9 shipped |
| `parent-skill-check.cjs` on live sk-doc hub (regression) | exit 0 / 0 warnings |
| `package_skill.py --check` on create-skill (regression) | PASS |
| `--kind parent` scaffold → `parent-skill-check.cjs` | exit 0 / 0 warnings |
| sk-doc contract/package/quick_validate pytest | pass (2 unrelated `test_changelog_validator` failures are pre-existing — see Known Limitations) |
| `validate.sh --recursive --strict` (this folder) | Errors:0 (recorded at finalize) |
| Execution gates (tasks T001–T012) | 10/12 met + 2 partial (parent negative fixtures) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**Deviations from the plan (recorded, not silent):**
- **Contract location** — shipped at `sk-doc/shared/assets/skill_contract.json` (sibling to `template_rules.json`), not the plan's prospective `create-skill/contract.json`, so both create-skill scripts and shared loaders consume one file.
- **WU4 split** — delivered as WU4a (standalone render) + WU4b (`--kind parent`) as two commits; WU4b generates a MINIMAL checker-PASSING hub rather than a placeholder skeleton.
- **WU5 H2 matching** — kept SUBSTRING + normalization, not exact equality: 43 legitimate fleet heading forms (e.g. `REFERENCES AND RELATED RESOURCES`) would hard-fail on `==`.
- **WU5 alias-lowercase** — DEFERRED: sk-doc uses capitalized proper-noun aliases; lowercasing needs a synced multi-surface migration.
- **WU6 phantom-README** — the plan's "drop the unrequired root README" was REFUTED: real hubs (sk-code, sk-doc) carry a hub-root README and reference it in graph-metadata, so it is legitimate and was left intact.
- **Resource-doc exemption** (`3bedd7fb11`) — an unplanned follow-up: WU4a's scaffold asset (skill frontmatter) was wrongly flagged as a resource doc; skill-template-signature files are now exempt from the 5-field resource-doc check.

**Remaining follow-ups (not blocking completion):**
- **Parent negative-fixture corpus (T004/T010, partial)** — the surface/transport-parent and duplicate-`tieBreak` NEGATIVE fixtures are not committed. The rules are exercised by WU5b's change and WU4b's generated hub is a verified golden workflow-only parent, but a standalone negative corpus remains.
- **Pre-existing `validate_document.py` symlink path bug** — discovered during finalize: `test_changelog_validator.py` fails on both the worktree AND the untouched main tree because `load_template_rules` resolves `Path(__file__).parent/assets` to `sk-doc/assets/` (the symlink dir) instead of `sk-doc/shared/assets/`. Out of this packet's scope; flagged for a separate fix.
<!-- /ANCHOR:limitations -->

---

## Post-Completion Follow-Up
- **Parent negative-fixture corpus** — add committed fixtures for surface/transport-parent and duplicate-`tieBreak` to close T004/T010 fully.
- **`validate_document.py` symlink path bug** — fix `load_template_rules` to resolve the real script location (or search `shared/assets/`) so `test_changelog_validator.py` passes when invoked via the `sk-doc/scripts/` symlink; pre-existing and repo-wide, out of this packet's scope.
- No advisor-scorer surface was touched, so no re-baseline gate applies.
