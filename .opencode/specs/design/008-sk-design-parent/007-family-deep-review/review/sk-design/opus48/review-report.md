# Deep Review Report — sk-design (umbrella router)

| | |
|---|---|
| **Target** | `.opencode/skills/sk-design` (skill, design-family umbrella router) |
| **Session** | `skreview-sk-design-opus48` · executor cli-claude-code (claude-opus-4-8) |
| **Spec packet** | `design/008-sk-design-parent/007-family-deep-review` |
| **Iterations** | 5 of 5 (converged) |
| **Dimensions** | correctness · security · spec-alignment · completeness/maintainability (+ skill overlays) |
| **Verdict** | **CONDITIONAL** |
| **Release-readiness** | converged |
| **Severity totals** | P0: 0 · P1: 1 · P2: 4 · advisories: 1 |

---

## 1. Executive Summary

`sk-design` is a thin, well-scoped umbrella router that faithfully implements the structural model locked in the `002-architecture-decision` phase: a thin parent over five independently-invokable sibling children, shared base vocabulary in `references/`, no embedded per-child instructions, and clean child→parent reference resolution. Security surface is effectively nil (documentation + explicitly illustrative pseudocode), and the three shared reference docs now satisfy the hardened `sk-doc` validator (version fields, trigger phrases, smart-router pseudocode present).

One conditional-grade gap blocks an unqualified PASS: **the §2 routing authority — declared by §5 as the "single routing authority" — routes the SPEC / DESIGN.md intent to `sk-design-spec`, a child that does not exist on disk.** The real, onboarded child is `sk-design-md-generator`. The locked taxonomy (`002/spec.md:112`) intended `sk-design-spec` to fold `md-generator` as an alias, but the build deferred that rename and recorded the deferral in §7 + graph-metadata — without reconciling the §2 routing table and pseudocode. The family still functions (SPEC work is reachable via `md-generator`), so this is degraded routing, not a hard break → **P1 → CONDITIONAL**.

Four P2 consistency/maintainability items and one discoverability advisory round out the report. No P0. No security findings.

## 2. Planning Trigger

This report **should seed a small remediation packet** (Level 1–2). The single P1 is a one-or-two-line documentation reconciliation; the four P2s are mechanical consistency fixes plus one graph-validation step. Recommended trigger: a `154-sk-design-parent` follow-up child (e.g. `008-family-review-remediation`) or fold into the next family maintenance pass. No architecture re-litigation is required — the locked decision stands; only its surfacing in the parent SKILL.md and metadata symmetry need closure.

## 3. Active Finding Registry

| ID | Sev | Category | Title | Evidence |
|----|-----|----------|-------|----------|
| **F1** | **P1** | spec-alignment | §2 routing authority routes SPEC → non-existent `sk-design-spec` | `SKILL.md:93`, `SKILL.md:146`, `SKILL.md:315`, `SKILL.md:333`; `002/spec.md:112` |
| F2 | P2 | consistency | `family` disagreement: `sk-design` (SKILL frontmatter) vs `sk-code` (graph-metadata) | `graph-metadata.json:4`; `sk-design-foundations/SKILL.md:8` |
| F3 | P2 | completeness | Parent has no `changelog/`; all 5 children do | `SKILL.md:6`; `sk-doc/changelog/v1.8.1.0.md:9` |
| F4 | P2 | consistency | interface + md-generator lack weighted reverse edges to parent | `sk-design-interface/graph-metadata.json:7,44`; `sk-design-foundations/graph-metadata.json:53` |
| F5 | P2 | correctness | Router pseudocode dead branches + zero-score vs Rule #2 mismatch | `SKILL.md:133`, `SKILL.md:214`, `SKILL.md:188`, `SKILL.md:98` |
| A1 | advisory | discoverability | Umbrella vs flagship child entry not cross-linked | root `CLAUDE.md` UI/design row |

### F1 (P1) detail — the load-bearing finding

The parent declares §2 SMART ROUTING as the single routing authority [`SKILL.md:315`], and within it:
- routing table [`SKILL.md:93`]: `DESIGN.md / style reference / extraction → sk-design-spec`;
- pseudocode [`SKILL.md:146`]: `ROUTE_TO_CHILD["SPEC"] = "sk-design-spec"`.

`sk-design-spec` does not exist (`ls` → no such file or directory). The real child is `sk-design-md-generator`, which the deferral note [`SKILL.md:333`], the §8 references [`SKILL.md:350`], and the parent graph-metadata [`graph-metadata.json:16-19,41-45,69`] all correctly name. Root cause: the `002:112` taxonomy locked `sk-design-spec` (folding md-generator as alias); the build deferred the rename but updated only §7 + metadata, leaving the §2 authority stale. **Adversarial replay:** P0 escalation rejected — the family routes SPEC work successfully via the existing child, the §7/§8 redirects allow recovery, and §2 pseudocode is explicitly "illustrative, not exhaustive" [`SKILL.md:44`]. Net: degraded/misleading authority surface → P1.

## 4. Remediation Workstreams

| WS | Findings | Action | Effort |
|----|----------|--------|--------|
| **WS-1 Routing reconciliation** | F1 | Point `SKILL.md:93` table cell and `SKILL.md:146` `ROUTE_TO_CHILD["SPEC"]` at `sk-design-md-generator`, or add inline alias `(currently sk-design-md-generator)` at the authority surface. Optionally promote the §7 deferral note into §2. | XS (docs) |
| **WS-2 Metadata symmetry** | F2, F4 | Decide whether `graph-metadata.family` is a coarse bucket (document it) or reconcile to `sk-design`; add `family` to parent + interface frontmatter; run `skill_graph_validate` / `skill_graph_propagate_enhances` and add reverse edges for interface + md-generator if `edges.*` is the sole traversal surface. | S |
| **WS-3 Family doc completeness** | F3 | Add `sk-design/changelog/v1.0.0.0.md` for the initial parent release. | XS |
| **WS-4 Router pseudocode hygiene** | F5 | Align illustrative pseudocode with Routing Rule #2 (zero-score → interface) and drop dead `LOAD_LEVELS` / `or [0]` / fix 0.5-vs-integer threshold; or mark the block non-normative. | XS |
| **WS-5 Discoverability** | A1 | One-line cross-link in §1 clarifying umbrella vs flagship-child entry. | XS |

## 5. Spec Seed

> **Problem:** The `sk-design` umbrella router's primary routing authority (§2) names a child (`sk-design-spec`) that was planned in the locked taxonomy but never built; the build instead kept `sk-design-md-generator` and deferred the rename, leaving the authority surface inconsistent with the implemented family. Secondary: family metadata (`family` field, reverse graph edges, parent changelog) is asymmetric across the six skills.
>
> **Outcome:** Parent SKILL.md routes every design intent to a child that exists; metadata surfaces agree on family identity and graph reciprocity; parent has a changelog. No change to the locked umbrella-router architecture.
>
> **Scope:** `.opencode/skills/sk-design/**` (SKILL.md, graph-metadata.json, new changelog) and the `family`/edge fields of `sk-design-interface` + `sk-design-md-generator` graph-metadata. **Out of scope:** building an actual `sk-design-spec` skill (that is the deferred onboarding decision, not this remediation); any child design-judgment content.

## 6. Plan Seed

1. WS-1: reconcile §2 routing (table + pseudocode) to `sk-design-md-generator`; lift deferral note inline. *(verifies F1)*
2. WS-3: add parent `changelog/v1.0.0.0.md`. *(verifies F3)*
3. WS-2: run `skill_graph_validate`; decide family-field semantics; apply reverse-edge / frontmatter fixes. *(verifies F2, F4)*
4. WS-4: clean illustrative pseudocode or mark non-normative. *(verifies F5)*
5. WS-5: add umbrella-vs-child cross-link. *(verifies A1)*
6. Validate: `validate.sh <spec-folder> --strict` on the remediation packet; re-run `skill_advisor.py "route design work" --threshold 0.8` to confirm the parent still surfaces.

## 7. Traceability Status

| Protocol | Status | Notes |
|----------|--------|-------|
| `spec_code` (core) | ✅ executed | SKILL.md routing/taxonomy vs `002/spec.md:111-114`; 5/6 locked requirements aligned; taxonomy naming gap → F1 |
| `checklist_evidence` (core) | ✅ executed | Review packet `007` empty (fan-out → artifact_dir); parent is phase-parent Level 2 (`spec.md:39` Status=Complete) |
| `skill_agent` (overlay) | ✅ executed | No agent/command references the bare `sk-design` router (advisor/Skill-tool invoked); children cite parent shared refs, all resolvable |
| `feature_catalog_code` (overlay) | ⊘ N/A | No `feature_catalog/` directory in target |
| `playbook_capability` (overlay) | ⊘ N/A | No `manual_testing_playbook/` directory in target |

**Locked-requirement alignment (`002` decision):** structural model ✅, independent children ✅, hub-only-in-interface ✅, flat names ✅, 5 children present ✅, 5th-child canonical naming ❌ (F1).

## 8. Deferred Items

- **Building `sk-design-spec` as a real skill** — deferred by design (`SKILL.md:333` "until the spec child is fully onboarded"). This review does NOT require building it; it requires the routing authority to stop pointing at it until it exists.
- **`sk-design-output` child** — deferred at the architecture decision (`002/spec.md:112`); out of scope here.
- **`skill_graph_validate` result for F4** — recommended but not run during this read-only review (mutation-adjacent); the reverse-edge severity may downgrade if `manual.related_to` participates in traversal.

## 9. Audit Appendix

### Scope discovery (skill branch)
- Read: `SKILL.md` (353 ln), `graph-metadata.json` (171 ln), `references/{anti_slop_principles,cognitive_laws,design_token_vocabulary}.md`.
- Absent in target: `assets/`, `scripts/`, `feature_catalog/`, `manual_testing_playbook/`, `changelog/`.
- Entry-point search: `.opencode/agents`, `.claude/agents`, `.codex/agents`, `.opencode/commands` → no bare `sk-design` references.
- Baselines: `154-sk-design-parent/spec.md`, `002-architecture-decision/spec.md`; descriptions.json family-build history (001→007).

### Method
- 5 iterations, fresh-context per dimension; one stabilization/adversarial-replay pass.
- Every finding carries `file:line` evidence; the P1 was re-read at source and adversarially tested for P0 escalation (rejected).
- Convergence: newFindingsRatio 0.00 < 0.10 with full dimension coverage.

### Verdict logic
- 0 P0 → not FAIL. 1 confirmed P1 → CONDITIONAL (remediation plan in §4–§6). 4 P2 + 1 advisory recorded as `hasAdvisories: true`.

### Read-only attestation
No file outside the artifact_dir was created, modified, moved, or deleted. `.opencode/skills/sk-design` and all repository files were treated as read-only.

---

Review verdict: CONDITIONAL
