---
title: "Feature Specification: Fresh-Verify Fleet Remediation"
description: "A fresh Sonnet-5 xhigh review of all 46 SKILL.md surfaced 11 pre-existing content defects (none from the prior conformance sweep); this phase remediates them and closes the packetKind:surface validator gap, each fix re-verified by a fresh Sonnet-5 xhigh agent."
trigger_phrases:
  - "fresh verify fleet remediation"
  - "sonnet-5 skill audit remediation"
  - "packetKind surface validator"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification/007-fresh-verify-remediation"
    last_updated_at: "2026-07-14T07:12:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Remediated fleet defects from fresh verify"
    next_safe_action: "Run advisor re-baseline for description changes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: Fresh-Verify Fleet Remediation

> **Phase adjacency** (grouping order under the parent, not a runtime dependency): predecessor `006-standalones`; successor None.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/014-sk-doc-parent/028-create-skill-contract-unification/007-fresh-verify-remediation |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Parent Packet** | sk-doc/014-sk-doc-parent/028-create-skill-contract-unification |
| **Defects fixed** | 11 |
| **Target** | correct, resolvable, ground-truth-accurate SKILL.md content across the fleet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

After the create-skill conformance sweep (phases `001`-`006`) shipped, a fresh independent review — 46 Sonnet-5 xhigh
agents, one per SKILL.md — was run to confirm the fleet. It returned 11 PASS, 24 CONCERN, 11 FAIL. Every FAIL was a
**pre-existing content defect** (broken asset paths, stale metadata, a whole mode missing from a hub, a factually-wrong
MCP config): none was introduced by the sweep (confirmed by git-diff against the sweep commits).

**Purpose:** remediate the 11 FAIL defects to real, resolvable, ground-truth-accurate content, and close the one
validator gap the review confirmed (`package_skill.py` did not recognise `packetKind: surface`, so surface packets
needed a manual exemption). Every fix is re-verified by a fresh Sonnet-5 xhigh agent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** the 11 FAIL skills (their SKILL.md plus the sibling README/reference/asset files carrying the same
defect) and the surface-aware branch in `package_skill.py`.

| `.opencode/skills/sk-doc/create-flowchart/**` | Modify | Repoint broken `assets/flowcharts/` paths |
| `.opencode/skills/sk-doc/create-manual-testing-playbook/**` | Modify | Repoint broken `assets/testing_playbook/` paths |
| `.opencode/skills/sk-code/code-webflow/SKILL.md` | Modify | Add missing RESOURCE_MAP commas |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Modify | Dedup HOOKS keyword, add codex |
| `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` | Modify | Drop json from markdown-guarded map |
| `.opencode/skills/sk-code/code-quality/SKILL.md` | Modify | Repoint checklist paths to code-opencode |
| `.opencode/skills/sk-code/code-review/**` | Modify | Fix pseudocode; snake_case asset; consolidate |
| `.opencode/skills/mcp-tooling/mcp-click-up/**` | Modify | Correct config/auth/namespace to ground truth |
| `.opencode/skills/system-deep-loop/**` | Modify | Add the 8th alignment mode to the hub |
| `.opencode/skills/sk-doc/{SKILL.md,description.json,graph-metadata.json}` | Modify | Add create-diff + create-changelog |
| `.opencode/skills/cli-external-orchestration/**` | Modify | Sync metadata with cli-codex |
| `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py` | Modify | Branch on packetKind: surface |

**Out of scope (deliberate):**
- The 24 CONCERN items that are non-blocking (word counts, cosmetic formatting, documented intentional exceptions).
- The 3 pre-existing warnings in phase `000` (its own record).
- **Advisor re-baseline** — the description changes are advisor routing inputs, but re-baselining needs the live
  advisor daemon + benchmark corpus (not runnable in this doc worktree) and is gated on a concurrent advisor track;
  flagged for the advisor-track owner.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | create-flowchart references resolve (`assets/flowcharts/` -> flat `assets/`), package-wide | P0 |
| REQ-002 | create-manual-testing-playbook references resolve (`assets/testing_playbook/` -> `assets/`), package-wide | P0 |
| REQ-003 | code-webflow RESOURCE_MAP lists are comma-complete (no implicit string concat) | P0 |
| REQ-004 | system-skill-advisor HOOKS keyword list deduped, `codex` present | P1 |
| REQ-005 | deep-alignment markdown-guarded RESOURCE_MAP holds only markdown paths | P1 |
| REQ-006 | code-quality checklist routing points at the real `../code-opencode/assets/checklists/` | P0 |
| REQ-007 | code-review detect_surface_evidence returns concrete surface keys, not a placeholder | P0 |
| REQ-008 | mcp-click-up config/auth/namespace matches `.utcp_config.json` across SKILL.md + README + references | P0 |
| REQ-009 | system-deep-loop hub documents all 8 registered modes (alignment included) | P0 |
| REQ-010 | sk-doc hub lists create-diff and create-changelog in layout, references, descriptor | P1 |
| REQ-011 | cli-external-orchestration descriptor/graph/README include the cli-codex mode | P1 |
| REQ-012 | `package_skill.py --check --strict` passes surface packets natively (packetKind: surface branch) | P1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. All 11 FAIL defects confirmed resolved **on disk** by a fresh Sonnet-5 xhigh re-verify (12/12, 0 FAIL, no regression).
2. The two surface packets pass `package_skill.py --check --strict` natively; non-surface skills unaffected.
3. All remediated children keep a green `--check --strict` gate; the three parent hubs keep `parent-skill-check` at 0 warnings.
4. `validate.sh --recursive --strict` is Errors 0 on the 028 packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Parent agent clobbers a child** — the sk-doc / system-deep-loop hub fixes edit files under a dir that also holds
  children already fixed. Mitigated + verified: the hub agents touched only hub-level files; the surgical child fixes
  (create-flowchart, deep-alignment) stayed intact (git + re-verify confirmed).
- **Delegated over-reach** — a LUNA agent fixes more than the finding. Observed on code-review (a snake_case rename +
  section consolidation); accepted after verifying it is internally consistent, gate-green, and completes a prior
  migration, with the caveat that a future hyphen-naming pass re-migrates it.
- **Incomplete fix** — a defect fixed in SKILL.md but left in sibling docs. Caught by the re-verify (3 CONCERNs) and
  closed package-wide.
- **Dependency:** the create-skill validator (phase `000`); `.utcp_config.json` / `mode-registry.json` as ground truth.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Ground truth | every content fix verified against the real on-disk file / config, not the fix note |
| NFR-02 | Independence | remediation re-verified by a different model family (Sonnet-5) than the fixer |
| NFR-03 | Isolation | path-disjoint per-skill work-items; >=5 concurrent |
| NFR-04 | No regression | each fix confirmed to introduce no broken reference or routing change |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A defect persists in **sibling files** not named as the fix target -> extended package-wide (create-flowchart,
  create-manual-testing-playbook, mcp-click-up README).
- A finding's premise is **contested by an in-flight convention** (hyphen vs snake_case naming) -> fix follows the
  current validator/sibling convention and records the caveat.
- **Immutable records** (benchmark captures, historical changelog entries) referencing an old name -> left untouched.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

None blocking. Remediation shipped and was re-verified (12/12, 0 FAIL). One follow-up remains out of scope: an advisor
re-baseline for the ~17 sweep-trimmed descriptions plus the remediated hub descriptors, owned by the advisor track and
gated on its live daemon.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Plan**: `./plan.md` (verify -> remediate -> re-verify harness)
- **Tasks**: `./tasks.md` (one row per defect)
- **Checklist**: `./checklist.md`
- **Parent**: `../spec.md`; sweep phases `../001-*` .. `../006-*`
<!-- /ANCHOR:related-docs -->
