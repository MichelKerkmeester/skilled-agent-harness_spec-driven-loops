# Deep Review Report: mcp-figma skill package (opus-claude2 lineage)

**Target**: `skilled-agent-orchestration/146-mcp-figma-with-direct-cli-support`
**Session**: `fanout-opus-claude2-1781464600582-ntawto`
**Lineage**: generation 1, new session · executor cli-claude-code / claude-opus-4-8
**Verdict**: **CONDITIONAL** (hasAdvisories: true)
**Date**: 2026-06-14

---

## 1. Executive Summary

The `mcp-figma` skill package is functionally sound — the install, connect, daemon, and gating logic are correct, no credentials leak, the app.asar patch is properly consented, and all six REQ-001..006 normative requirements resolve to shipped artifacts with reciprocal sibling graph edges. The review does **not** return a clean PASS, however, because one checked completion claim is demonstrably false against the shipped artifact: the packet records "Voice sweep: PASS, no em dashes, no new prose semicolons", yet `SKILL.md` carries 31 em dashes and a prose semicolon, and em dashes appear across 15 of the skill's markdown files. That is a `checklist_evidence` hard-gate contradiction (P1), which routes the verdict to CONDITIONAL.

| Metric | Value |
|--------|-------|
| Iterations | 5 (4 dimension passes + 1 stabilization) |
| Dimensions | 4/4 (correctness, security, traceability, maintainability) |
| Active P0 | 0 |
| Active P1 | 1 |
| Active P2 | 5 |
| Core protocols | spec_code (pass 6/6), checklist_evidence (partial 25/26) |
| Overlay protocols | feature_catalog_code (pass), playbook_capability (pass), skill_agent (pass), agent_cross_runtime (N/A) |
| Convergence reason | converged (composite 1.00, finding set stable, 4/4 coverage, stabilization satisfied) |
| Release readiness | converged |

**Lineage divergence note.** The sibling `deepseek-v4-pro` lineage returned **PASS / 9 P2s** and did not surface the voice-sweep contradiction. This lineage independently re-derived it as a P1; the fan-out merge should treat this as the stronger restriction.

---

## 2. Planning Trigger

Verdict is **CONDITIONAL** → routes to `/speckit:plan` for fixes. The single P1 (F-OPUS-003) requires either stripping the em dashes / prose semicolon from the skill prose to match the recorded claim, or amending the false verification claim in `checklist.md`, `tasks.md`, `spec.md` (NFR-C01), and `implementation-summary.md`. Both paths are low-risk and small. The 5 P2 advisories are optional follow-ups.

---

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | File | First Seen | Status |
|----|----------|-----------|-------|------|------------|--------|
| F-OPUS-003 | P1 | traceability | Voice-sweep completion claim is false (31 em dashes + prose semicolon vs NFR-C01/CHK-013/impl-summary) | `.opencode/skills/mcp-figma/SKILL.md:14` | 3 | active |
| F-OPUS-001 | P2 | correctness | `install.sh` leaks `v` to global scope in `main()` | `.opencode/skills/mcp-figma/scripts/install.sh:156` | 1 | active |
| F-OPUS-002 | P2 | security | Arbitrary/destructive gating is contract-only (no programmatic consent wrapper) | `.opencode/skills/mcp-figma/references/tool_surface.md:185` | 2 | active |
| F-OPUS-004 | P2 | traceability | Stale `mcp-magicpath` references in spec-002 docs (sibling deleted) | `.../002-skill-build-and-registration/spec.md:93` | 3 | active |
| F-OPUS-005 | P2 | traceability | Zero-fingerprint `session_dedup` placeholder | `.../146-mcp-figma-with-direct-cli-support/spec.md:20` | 3 | active |
| F-OPUS-006 | P2 | maintainability | Em-dash style divergence from sibling norm raises follow-on-edit cost | `.opencode/skills/mcp-figma/SKILL.md:14` | 4 | active |

F-OPUS-003 survived adversarial self-check (iteration 005) at confidence 0.9. The two correctness findings raised by the sibling lineage (connect-safe stdin guard, daemon help output) were re-examined and **rejected as false positives** — `connect-safe.sh:20` does guard the non-interactive case before its `read`.

---

## 4. Remediation Workstreams

### Lane 1: Verification-integrity (F-OPUS-003) — required for PASS
Pick ONE:
- **(a) Conform the artifact**: strip the 31 em dashes and the prose semicolon from `SKILL.md` (and the other 14 markdown files) to match the recorded "no em dashes" claim and the sibling norm; OR
- **(b) Amend the claim**: correct CHK-013, `tasks.md:74`, NFR-C01 (`spec.md:151`), and `implementation-summary.md:62` to state the true voice-sweep result.
- Recommendation: (a) — it both fixes the claim and removes the maintainability divergence (F-OPUS-006) in one pass.

### Lane 2: Documentation hygiene (F-OPUS-004, F-OPUS-005) — low-risk parallel
- F-OPUS-004: remove `mcp-magicpath` from `spec.md:93` Files Changed and `implementation-summary.md:5`.
- F-OPUS-005: replace the zero-fingerprint placeholder with a computed content hash (or document why it is left as a placeholder).

### Lane 3: Defense-in-depth (F-OPUS-001, F-OPUS-002) — optional
- F-OPUS-001: add `local v` in `install.sh main()`.
- F-OPUS-002: no action required; documented as inherent to a docs-and-scripts skill.

---

## 5. Spec Seed

The only required spec delta is reconciling the voice-sweep verification record (F-OPUS-003) — either by conforming the prose or by correcting NFR-C01 / CHK-013 / tasks / implementation-summary. Secondary spec edits: drop the stale `mcp-magicpath` sibling reference (F-OPUS-004). No functional/behavioral spec change is needed; REQ-001..006 are accurate to the shipped skill.

---

## 6. Plan Seed

1. **[T1] Voice-sweep reconciliation** — strip em dashes + prose semicolons from the 15 skill markdown files OR amend the four claim sites. ~20-40 min. (Closes F-OPUS-003 + F-OPUS-006.)
2. **[T2] Drop stale magicpath refs** — `spec.md:93`, `implementation-summary.md:5`. ~5 min. (Closes F-OPUS-004.)
3. **[T3] Fingerprint** — compute real `session_dedup.fingerprint` values. ~10 min. (Closes F-OPUS-005.)
4. **[T4] install.sh `local v`** — one-line. ~2 min. (Closes F-OPUS-001.)

---

## 7. Traceability Status

| Protocol | Level | Gate | Status | Evidence |
|----------|-------|------|--------|----------|
| `spec_code` | core | hard | **pass** (6/6) | REQ-001→install.sh:51,113; REQ-002→tool_surface.md:62-162; REQ-003→connect-safe/yolo/unpatch; REQ-004→mcp_wiring.md:111; REQ-005→sibling shape; REQ-006→graph-metadata.json:2 + reciprocal edges |
| `checklist_evidence` | core | hard | **partial** (25/26) | CHK-013 contradicted by SKILL.md em dashes/semicolon (F-OPUS-003) |
| `feature_catalog_code` | overlay | advisory | **pass** (8/8) | feature_catalog.md:199-215; classes match tool_surface.md |
| `playbook_capability` | overlay | advisory | **pass** | playbook scenarios map to executable figma-ds-cli verbs |
| `skill_agent` | overlay | advisory | **pass** | SKILL.md allowed-tools self-consistent; no runtime agent |
| `agent_cross_runtime` | overlay | advisory | **N/A** | mcp-figma is a user-invocable skill, not a runtime agent |

Reciprocal sibling edges verified live: `mcp-open-design/graph-metadata.json:23` and `mcp-chrome-devtools/graph-metadata.json:23` both back-edge to `mcp-figma`.

---

## 8. Deferred Items

| Item | Severity | Reason |
|------|----------|--------|
| F-OPUS-001 install.sh global `v` | P2 | Harmless; script exits after `main` |
| F-OPUS-002 contract-only gating | P2 | Inherent to a docs-and-scripts skill; AGENTS.md framework enforces |
| F-OPUS-004 stale magicpath refs | P2 | Shipped graph is clean; only spec-002 prose is stale |
| F-OPUS-005 zero-fingerprint | P2 | Advisory; CONTINUITY_FRESHNESS only when enforced |
| F-OPUS-006 em-dash style cost | P2 | Cosmetic substrate of F-OPUS-003; closes with Lane 1(a) |

---

## 9. Audit Appendix

- **Coverage**: 4/4 dimensions; iterations 1-5; core protocols spec_code + checklist_evidence both run; overlays run or N/A.
- **Replay validation**: convergence recomputed from JSONL — newFindingsRatio 0.20→0.15→0.50→0.08→0.00; the 0.50 spike is the P1-override floor in iteration 3; finding set stable across the iteration-5 stabilization pass. Recorded stop reason `converged` agrees with the replay.
- **Adversarial replay**: F-OPUS-003 (only P1) survived a four-angle refutation attempt (em-dash identity, code/table exemption, norm bindingness, semicolon reality) at confidence 0.9. No P0 raised at any point.
- **Resource map**: `resource-map.md not present. Skipping coverage gate.` (`resource_map_present: false`).
- **Severity discipline**: the em-dash *style* itself is P2 (F-OPUS-006); the *false verification claim* is scored P1 (F-OPUS-003) because checklist_evidence is a core hard-gate protocol and an affirmatively false "PASS" is worse than a gap.
- **Verdict lock**: no active P0 → not FAIL; one active P1 → CONDITIONAL (not softened to PASS).

Review verdict: CONDITIONAL
