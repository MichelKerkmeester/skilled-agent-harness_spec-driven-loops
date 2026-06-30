# Deep Review Report — sk-design-interface

- **Review target:** `.opencode/skills/sk-design-interface` (skill)
- **Lineage / session:** `skreview-sk-design-interface-opus48` (generation 1, lineageMode `new`)
- **Executor:** cli-claude-code · model `claude-opus-4-8`
- **Iterations:** 5 of max 5 · **Stop reason:** maxIterations reached with full dimension coverage + 1 stabilization pass
- **Dimension coverage:** 4/4 (correctness, security, traceability, maintainability) + stabilization replay
- **Date:** 2026-06-25

> **VERDICT: CONDITIONAL** — `hasAdvisories: true`. One P1 contract contradiction; six P2 advisories; zero P0.

---

## 1. Executive Summary

`sk-design-interface` is a well-constructed, internally coherent design-judgment skill. Its core thesis — *make deliberate, subject-grounded choices, take one justified risk, and never ship a templated default or a style chooser* — is stated consistently across `SKILL.md`, the vendored `design_principles.md`, and every supporting reference, and it is unusually well cross-anchored by a feature catalog and a 10-scenario manual testing playbook.

That same rigor is what surfaces the single material defect. The skill ships a **preset chooser** at `references/aesthetics/` (an index plus four reusable presets: Brutalist, Minimalist, Soft, Apple Bento) whose framing — "pick a design preset", "Use one preset as the dominant aesthetic per direction", cross-brief "Best For" mappings — is the exact artifact the skill's own hard rules say "must not ship" and "never a style chooser". The contradiction is corroborated by three traceability protocols (`spec_code`, `feature_catalog_code`, `playbook_capability`) and falsifies the skill's own shipped QA assertions (feature-catalog guardrail claim and playbook ID-008 negative control).

| Metric | Value |
|---|---|
| Active P0 | 0 |
| Active P1 | 1 (`F-D3-01`) |
| Active P2 | 6 |
| Scope | SKILL.md, README.md, all `references/**`, `feature_catalog/**`, `manual_testing_playbook/**`, `graph-metadata.json`, `changelog/` |
| spec_code (core, hard) | **FAIL** |
| checklist_evidence (core, hard) | PASS |
| Verdict | **CONDITIONAL** |
| Release readiness | in-progress |

The defect is bounded: the contradicting directory is **orphaned** — wired into no routing row, reference list, feature catalog, playbook, or `graph-metadata.json` `key_files`, and added in the latest commit (`8662196959 feat(154)`). That orphan-ness is why this is P1 (the primary documented flow is not actively corrupted) rather than P0. The six P2s are routine doc-hygiene items (metadata staleness, version drift, a numbering gap, a heuristic imprecision, a least-privilege over-grant, a README omission), most sharing the same root cause: the latest commit added surfaces without refreshing metadata or reconciling the contract.

---

## 2. Planning Trigger

The verdict is **CONDITIONAL**, which routes to `/speckit:plan` for a small remediation packet. The plan should:

1. Resolve `F-D3-01` first — it is the only required (P1) fix and it is the one that contradicts the skill's central contract. Resolution is a binary choice (remove vs. reconcile-as-critique-baseline) and is small.
2. Batch the six P2s into the same packet; F-D4-01/02/03 share a root cause with F-D3-01 (the same commit) and can be closed together with a metadata/version refresh.

There is no P0 and no security blocker, so this is a routine cleanup plan, not a release-blocking incident.

---

## 3. Active Finding Registry

### F-D3-01 — `references/aesthetics/` ships a reusable preset chooser the skill's hard rules forbid · **P1** · traceability/spec-alignment

**Claim.** The skill ships a directory of reusable, cross-brief visual-direction *presets* with a "pick a design preset" framing, contradicting the skill's repeated hard rule that a style chooser / reusable preset must never be surfaced and "must not ship".

**Shipped content (contradiction source):**
- `references/aesthetics/README.md:15-17` — "Aesthetics Presets … one row per preset mapping best-fit use cases to a core cue."
- `references/aesthetics/README.md:9` — trigger phrase `"pick a design preset"` (also `"design preset catalog"`, `"visual direction presets"`).
- `references/aesthetics/README.md:29` — "Use one preset as the dominant aesthetic per direction."
- `references/aesthetics/README.md:35-40` — 4-row preset table with cross-brief "Best For" use cases.
- `references/aesthetics/brutalist.md:28-29` + `:33-61` — "Use one preset as the dominant aesthetic per direction" with fixed, subject-independent palette/type cues (droppable onto any brief).

**Normative rules contradicted:**
- `SKILL.md:139` (NEVER rule 1 — never ship a templated default), `SKILL.md:134` (ALWAYS rule 6 — "Never … a style chooser").
- `references/design-process/real_ui_loop.md:105` — "No style presets, no pick-a-vibe or theme-swap menu … the templated default the skill exists to resist."
- `references/design-process/variation_diversity.md:114` — "Never a reusable preset … If the same option set could be dropped onto a different brief, it has become a preset and must not ship."
- `references/design-grounding/design_inventory.md:70`, `references/design-grounding/design_references_mcp.md:98` — "NEVER surface a list … as a chooser."

**Corroboration:**
- feature_catalog_code — `feature_catalog/07--real-ui-loop/handoff-and-parity-guardrails.md:18,30`: "There are no style presets, pick-a-vibe menus, or named aesthetic dials … must not ship."
- playbook_capability — `manual_testing_playbook/07--real-ui-loop/reuse-before-generate-with-design-system.md:19,33`: ID-008 negative control "no style-preset or pick-a-vibe menu exists."

**Blast radius (why P1, not P0):** orphaned content. `rg "aesthetics"` across the skill (excluding the dir) returns only an unrelated `ui-aesthetics` keyword at `SKILL.md:12`; absent from `graph-metadata.json:113-127` `key_files`; the SKILL.md router (`SKILL.md:80-88`) never loads it. The primary documented flow is intact. Survived 3 adversarial refutation attempts at P1 (iteration-005). **P0 upgrade trigger:** confirmation that the advisor/memory layer surfaces reference-doc `trigger_phrases` for this skill (so "give me a brutalist preset" routes an agent into the chooser), or the presets being wired into routing.

---

## 4. Remediation Workstreams

### Workstream A — Restore the no-preset contract (P1) — *required*

Pick one:

- **A1 (recommended): Remove `references/aesthetics/`.** Cleanest restoration of the contract; nothing else references it, so removal is zero-blast.
- **A2: Reconcile as sanctioned critique-against baselines.** If the presets are intentional, strip the chooser framing — delete the "pick a design preset" / "Use one preset as the dominant aesthetic" language and the cross-brief "Best For" menu — and reframe each as a *named default to deviate from* under the existing one-reference / no-chooser discipline (`design_inventory.md` model). Then wire them into `SKILL.md §5`, the feature catalog, and `graph-metadata.json`. This is the only path that keeps them without breaking the contract, and it is strictly more work than A1.

### Workstream B — Metadata + version refresh (P2 batch)

- Re-run `generate-description.js` + graph-metadata backfill after A (closes F-D4-01).
- Reconcile package version / document the 4-segment scheme (F-D4-02).
- Compact the feature-catalog numbering (`07 → 06`) or document the reserved gap (F-D4-03).
- Add `ux_quality_reference.md` and `design_inventory.md` to README §9 (F-D4-04).

### Workstream C — Lightweight contract hardening (P2)

- Reword the SMART ROUTING detection heuristic to test for *pinning*, not axis mention (F-D1-01).
- Narrow `allowed-tools` or justify the write/Bash grant in one line (F-D2-01).

---

## 5. Spec Seed

> Minimal spec delta for the remediation packet.

**Problem.** The skill ships content that violates its own central, repeatedly stated contract ("never a style chooser; a preset must not ship"), and ships stale/ drifted metadata from its latest commit.

**In scope.** `references/aesthetics/` (remove or reconcile); `graph-metadata.json`; version frontmatter reconciliation; feature-catalog numbering; SKILL.md §5 / README §9 reference inventories; SKILL.md §2 detection heuristic wording; SKILL.md `allowed-tools`.

**Out of scope.** The vendored `design_principles.md` content (unchanged Apache-2.0; do not edit); any change to the routing model or the skill's design philosophy; any executable behavior of sibling skills.

**Acceptance.** (1) No directory/file in the skill presents a reusable preset chooser; `rg -i "pick a .*preset|dominant aesthetic per direction"` over the skill returns nothing (or only sanctioned critique-baseline framing). (2) feature-catalog and playbook no-preset assertions are true on disk. (3) `graph-metadata.json.last_updated_at` ≥ the latest commit date and `key_files` matches the on-disk reference set. (4) `validate.sh <spec-folder> --strict` exits 0.

---

## 6. Plan Seed

1. **Decide A1 vs A2** for `references/aesthetics/` (default A1 — remove). *Blast: low, reversible via git.*
2. Apply the chosen Workstream A change. *Read-first; the dir is self-contained.*
3. Run Workstream B metadata/version refresh in the same change.
4. Apply Workstream C wording/scoping tweaks.
5. Re-validate: `package_skill.py`, `validate_document.py` on README + references, advisor discovery (`README.md:148-155`), and `validate.sh --strict` on the spec folder.
6. Add a `changelog/` entry recording the contract reconciliation.

---

## 7. Traceability Status

### Core protocols (hard gate)

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | **FAIL** | Normative no-preset rule (`SKILL.md:139`, `real_ui_loop.md:105`, `variation_diversity.md:114`) contradicted by shipped `references/aesthetics/README.md:29`. Drives F-D3-01. |
| `checklist_evidence` | PASS | No `checklist.md`; playbook release-readiness rules internally consistent and source-anchored (`manual_testing_playbook.md:124-152`). |

### Overlay protocols (advisory)

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | PASS (scoped) | No dedicated runtime agent (`rg` of `.claude/.opencode/.codex` agents → none); SKILL.md §7 (`SKILL.md:194-206`) agrees with CLAUDE.md / sibling-skill routing. |
| `feature_catalog_code` | PARTIAL | 12 features map to real surfaces, but the catalog's own "no style presets … must not ship" claim (`handoff-and-parity-guardrails.md:30`) is contradicted on disk; `06` numbering gap. |
| `playbook_capability` | PARTIAL | 10/10 scenarios executable/anchored, but ID-008's "no style-preset menu exists" negative control (`reuse-before-generate-with-design-system.md:19`) is falsified by `references/aesthetics/`. |
| `agent_cross_runtime` | N/A | Target type is `skill`, not `agent`. |

**Unresolved gap:** the spec_code FAIL until `F-D3-01` is remediated.

---

## 8. Deferred Items (P2 advisories)

| ID | Severity | Summary | Evidence |
|---|---|---|---|
| F-D1-01 | P2 | SMART ROUTING heuristic conflates axis-mention with axis-pinning | `SKILL.md:47-51` |
| F-D2-01 | P2 | `allowed-tools` over-broad vs the skill's "owns the look, not the build" boundary | `SKILL.md:4`, `README.md:129-131`, `feature_catalog/feature_catalog.md:189` |
| F-D4-01 | P2 | `graph-metadata.json` stale (last_updated 2026-06-14 < v1.5.0.0 2026-06-17; `key_files` omits aesthetics) | `graph-metadata.json:156`, `changelog/v1.5.0.0.md:7` |
| F-D4-02 | P2 | Version-field drift (SKILL 1.5.0.0 vs README 1.5.0.9 vs playbook 1.5.0.10) | `SKILL.md:5`, `README.md:10`, `manual_testing_playbook.md:4` |
| F-D4-03 | P2 | feature_catalog category numbering gap (no `06`) | `feature_catalog/feature_catalog.md:22-29` |
| F-D4-04 | P2 | README §9 omits `ux_quality_reference.md` and `design_inventory.md` | `README.md:160-170`, `SKILL.md:155-161` |

No blocked checks. No escalations triggered (no 3+ timeouts, no state corruption, no security vulnerability in production code, no P0 remaining).

---

## 9. Audit Appendix

### Coverage

- **Files read in full:** `SKILL.md`, `README.md`, `references/design-process/{design_principles,real_ui_loop,variation_diversity,ux_quality_reference}.md`, `references/design-grounding/{design_inventory,design_references_mcp}.md`, `references/aesthetics/{README,brutalist}.md` (+ heads of minimalist/soft/apple_bento), `feature_catalog/feature_catalog.md`, `feature_catalog/07--real-ui-loop/handoff-and-parity-guardrails.md`, `manual_testing_playbook/manual_testing_playbook.md`, `manual_testing_playbook/07--real-ui-loop/reuse-before-generate-with-design-system.md`, `graph-metadata.json`, `changelog/v1.5.0.0.md`, `references/mcp-tooling/refero_tools.md` (head).
- **Entry-point search:** `rg "sk-design-interface"` over `.claude/agents`, `.opencode/agents`, `.codex/agents`, `.opencode/commands`, `.claude/commands` → no dedicated agent/command; integration is via root `CLAUDE.md` and sibling skills (`mcp-open-design`, `sk-code`, `mcp-figma`).
- **Orphan probe:** `rg "aesthetics"` over the skill excluding the dir → only `SKILL.md:12` (`ui-aesthetics` keyword).
- **Provenance:** `git log --diff-filter=A` → `references/aesthetics/` introduced in `8662196959 feat(154): sk-design umbrella skill family + sk-doc machinery hardening`.

### Replay validation

Recomputed from `deep-review-state.jsonl`: 5 iteration records + 1 `claim_adjudication` event + `synthesis_complete`. newFindingsRatio series 0.15 → 0.10 → 0.55 → 0.30 → 0.00. Dimension coverage 4/4 + stabilization. Recomputed severity totals (P0:0, P1:1, P2:6) match the registry and the synthesis event. No P0 → P0-resolution gate trivially passes; the spec_code hard gate FAIL is reflected as a P1 finding (it does not block STOP because STOP was reached by maxIterations, and the FAIL is reported, not suppressed). Replay agrees with the recorded synthesis decision.

### Adversarial replay (P1)

`F-D3-01` was subjected to three refutation attempts (sanctioned-baseline / dead-content / pure-maintainability) in iteration-005; it survived all three at P1. The P0 upgrade and P2 downgrade triggers are recorded in the iteration-003 claim-adjudication packet.

### Verdict logic

PASS requires no active P0/P1. One active P1 (`F-D3-01`) → **CONDITIONAL** (no active P0). `hasAdvisories = true` (6 active P2). Release readiness: `in-progress`. Next command: `/speckit:plan`.

### Acceptance-coverage signal

Target is a skill, not a Level 2+ spec folder; `AC_COVERAGE` does not apply. `resource-map.md` not present → coverage gate skipped (no `## Resource Map Coverage Gate` section emitted).
