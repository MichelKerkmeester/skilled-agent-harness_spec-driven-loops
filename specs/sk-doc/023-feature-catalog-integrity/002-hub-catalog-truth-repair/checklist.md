---
title: "Verification Checklist: hub catalog truth repair"
description: "Ten hub-root feature catalogs mislead a reading agent: eight files cite retired compiled-routing directories, six roster and count claims contradict their own registries, four shipped capabilities have no catalog entry at all, and one safety claim about transport mutation is flatly wrong. This phase repairs them in four lanes, starting with the mechanical retired-path lane that takes the validator from 19 violations to 0."
trigger_phrases:
  - "hub catalog truth repair verification checklist"
  - "feature catalog integrity verification checklist"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/002-hub-catalog-truth-repair"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verification checklist"
    next_safe_action: "Run checklist items after phase execution completes"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# QA Checklist: Hub Catalog Truth Repair

<!-- ANCHOR:protocol -->
## Verification Protocol

Planned phase. All items open. Ten hub lanes, one per catalog, each closed with evidence: a command and its output, or
a file and line. Baselines come from T001, not from the synthesis.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] Validator baseline captured (expected: 19 violations, all `missing_source_path`).
- [ ] Retired-path file list captured by grep, prose included (expected: 8 files).
- [ ] Six roster and count claims re-checked against their registries.
- [ ] All four Lane C features confirmed present and confirmed uncatalogued.
- [ ] Authored-brand guard path re-derived; the research path does not exist.
- [ ] Plain-text `.md` root rows enumerated.
- [ ] `RC-008-02` confirmed still closed and recorded as do-not-resurrect.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] No runtime code, registry, or script modified. Catalog markdown only.
- [ ] Every claim written names the registry or source file it was derived from.
- [ ] Duplicated facts replaced by links to the owner; no duplicate leaf authored for runtime-owned behavior.
- [ ] No catalog comment or prose embeds a spec path, packet number, phase number, or finding ID.
- [ ] Dark or not-yet-shipped behavior is labeled as such and carries an empty or stub SOURCE FILES table.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] `validate_catalog_package.py --strict` exits 0; delta reported as 19 to 0.
- [ ] `rg -l "011-runtime-engine|010-live-activation"` over the catalogs returns nothing.
- [ ] Zero plain-text `.md` rows in any hub root table.
- [ ] Derived assertion: mode count equals `len(mode-registry.modes)` in every hub root.
- [ ] Derived assertion: distinct packet count equals distinct `packet` values.
- [ ] Derived assertion: every `packet` or `workflowMode` identifier resolves to an existing directory.
- [ ] Derived assertion: `/interface:*` command count equals files in `.opencode/commands/interface/`.
- [ ] Derived assertion: every advisor and skill-graph tool appears in the advisor root.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Ten hub lanes. Each closes with evidence.

- [ ] **`cli-external-orchestration`** — `RC-005-01` six executors; `RC-005-03` parity; `RC-005-05` cross-reference.
- [ ] **`mcp-tooling`** — `RC-005-02` transport mutation claim (safety-ranked); `RC-005-04` parity.
- [ ] **`sk-code`** — `RC-002-05` compiled routing default-on.
- [ ] **`sk-design`** — `RC-002-01` authored-brand leaf; `RC-002-02` fingerprint leaf; `RC-002-03` command count;
      `RC-002-04` procedure owner.
- [ ] **`sk-doc`** — `RC-006-03` twelve modes over eleven packets; `RC-006-08` parity.
- [ ] **`sk-git`** — `RC-006-01` preflight advisory leaf; `RC-006-02` retired paths; `RC-006-04` provider scope;
      `RC-006-05` GitKraken anchor; `RC-006-06` GitHub MCP anchor; `RC-006-07` parity.
- [ ] **`sk-prompt`** — `RC-007-03` retired packet ids; `RC-007-06` parity.
- [ ] **`system-deep-loop`** — `RC-004-03` compiled routing default-on; `RC-004-05` nested-catalog link.
- [ ] **`system-skill-advisor`** — `RC-001-05` and `RC-007-02` phantom row and count (one work unit); `RC-001-04`
      retired paths; `RC-007-01` propagate-enhances leaf; `RC-007-04` test baseline; `RC-007-05` root reshape.
- [ ] **`system-spec-kit`** — Lane A prose citation only; the rest belongs to `003`.
- [ ] All 28 findings accounted for; none silently dropped.
- [ ] `RC-008-02` NOT reopened.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] The corrected transport-mutation wording does not understate write behavior.
- [ ] No catalog edit exposes a credential, token, or internal-only path.
- [ ] No narrowed claim hides a real capability; narrowing is applied only where the anchor genuinely does not test the
      broader claim.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] Every repaired root entry reads correctly for a first-time agent, not only for someone who knows the defect.
- [ ] The four new leaves follow the OVERVIEW / HOW IT WORKS / SOURCE FILES / SOURCE METADATA structure.
- [ ] Each new leaf's frontmatter carries `title`, `description` and `trigger_phrases`, with `title` matching its root
      H3.
- [ ] No catalog cites a packet or phase identifier; source paths only.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] New leaves sit in the correct kebab-case category directory under their hub's `feature-catalog/`.
- [ ] Every new leaf has exactly one root entry, and every root entry has exactly one leaf.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] Baseline captured and delta reported: validator 19 to 0, retired-path files 8 to 0.
- [ ] Every OPERATOR-DECISION item resolved or carrying a recorded deferral.
- [ ] Lane A landed independently, so its delta is attributable.
- [ ] Nothing in `003`'s scope was edited except the single Lane A prose citation.
<!-- /ANCHOR:summary -->
