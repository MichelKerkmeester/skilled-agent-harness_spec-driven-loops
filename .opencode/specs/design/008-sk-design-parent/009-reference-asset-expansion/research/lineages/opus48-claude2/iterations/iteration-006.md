# Iteration 6: cross-cutting synthesis + convergence check

## Focus
Consolidate the cross-cutting findings that bind the five per-mode matrices: the `shared/register.md` must-add prerequisite (05), the zero-assets pattern, the shared-twin artifacts (N1 mock-content, N2 layout gate), a family-wide priority ranking, and a convergence assessment.

## Findings

### F6.1 — The register (05, must-add) is the highest single-leverage finding, but it is shared-scope [confirmed]
impeccable's **operating register** is a non-optional switch — "skipping it produces generic output" — between **Brand** (design IS the product: marketing/landing/campaign/portfolio) and **Product** (design SERVES the product: app/admin/dashboard/tool), picked by task cue → surface → PRODUCT.md field [SOURCE: external/impeccable.md:20]. It gates the anti-slop bar, palette dosage, motion budget, and density [SOURCE: external/impeccable.md:82-84,112]. Each transform verb is register-dependent: "bolder" in Brand = theatrics; in Product = stronger hierarchy, not drama [SOURCE: external/bolder.md:13-17]. gap-analysis ranks it the must-add and the dependency of 04/07/11/N1/N2 [SOURCE: gap-analysis.md:41,49]. **Scope note:** it lands in parent `sk-design/shared/register.md` (confirmed absent), not in a single mode's `references/`. So the family's single highest-leverage corpus finding is technically a *shared* addition that *gates* per-mode work (interface IF-R1/IF-R3, audit AU-R1/AU-R3). It is recorded here as the cross-cutting prerequisite rather than padded into one mode's column.

### F6.2 — The zero-assets pattern is a family-wide structural opportunity [confirmed]
Four of five modes (interface, foundations, motion, audit) ship references but **zero `assets/`**; only md-generator ships assets [filesystem, iters 1–5]. The single highest-ROI asset per mode: interface `design_plan_preflight` (IF-A1), foundations `token_starter` (FN-A1), motion `motion_plan_card` (MO-A1), audit `audit_report_template` (AU-A1). **Audit's is the strongest** — its deliverable already *is* a findings report, so a fill-in template directly operationalizes `audit_contract.md`. The asset opportunity is consistent enough to be a deliberate family pattern, not five unrelated ideas.

### F6.3 — N1 and N2 are shared twins; author once, reference twice [confirmed]
Mock-content/anti-AI-copy (N1) appears as a build check in interface (IF-R2) and a review check in audit (AU-R4); the mechanical layout pre-flight gate (N2) appears as interface build (IF-R1/IF-A1) and audit review (AU-R5). Authoring each once — ideally in `shared/` or one owning mode, referenced by the other — prevents the two copies from drifting. This is an authoring-economy finding the build phase should honor.

### F6.4 — Family-wide priority ranking [synthesized]
Ordering the should-adds by leverage (corpus strength × coverage hole × checkability):
1. `shared/register.md` (05, must) — gates the most downstream work.
2. AU-R1 model-tell catalog — most concrete, highest checkable value, no current analog.
3. N2 mechanical layout gate (IF-R1 + AU-R5, shared) — converts the most common LLM layout defects into a checkable gate.
4. AU-R2 remediation playbook — turnkey from redesign-skill.
5. MO-R1 motion frequency-decision gate — strongest motion restraint lever.
6. FN-R1 data-viz — the only real foundations coverage hole.
7. AU-R3 transform verbs + N1 mock-content (both register-dependent).
The four first-assets (IF-A1, AU-A1, FN-A1, MO-A1) rank with their modes; AU-A1 is the highest. md-generator's MD-A1 and the nice-to-haves (IF-R3/R4, FN-R3, MO-R3, AU-R6, FN-A1) sit below.

### F6.5 — Convergence reached [confirmed]
All six key questions (Q1–Q6) have evidence-backed matrix entries. newInfoRatio trend: 1.0 → 0.8 → 0.6 → 0.7 → 0.35 → 0.25 (declining, this iteration consolidates). Quality guards: source diversity holds (43-entry corpus + gap-analysis + per-mode corpus_maps + live references + 001 research), focus alignment holds (every finding maps to a mode column or the explicit cross-cutting prerequisite), no single weak source dominates. STOP is legal: all key questions answered + composite trend below threshold.

## Cross-cutting Additions (not a sixth mode — these gate or span the five)

| ID | Type | Scope | Title | Why | Sources | Effort |
|----|------|-------|-------|-----|---------|--------|
| XC-1 | reference | shared (parent) | `shared/register.md` — Brand-vs-Product operating register | The must-add prerequisite; gates interface + audit additions and all three transform verbs. | impeccable; bolder/quieter/distill Register sections | M |
| XC-2 | pattern | family | First-asset per reference-only mode | 4 modes have zero assets; one fill-in artifact each (preflight / token-starter / motion-plan / audit-report) operationalizes their references. | mode references + gpt-taste preflight + audit_contract | (per mode) |
| XC-3 | authoring rule | shared/interface/audit | Author N1 + N2 once, reference twice | Prevents drift between the build-side and review-side copies of mock-content and the layout gate. | gap-analysis N1/N2 | n/a |

## Do-NOT-add (cross-cutting)
- **A sixth "intake/register" child** — register is shared content, not a new sub-skill; net-new children are out of scope.
- **Duplicating N1/N2 independently in interface and audit** — author once, reference twice (XC-3).
- **Re-litigating gap severities** — the gap-analysis table is an authoritative input; this research grounds and prioritizes it, it does not re-derive it.

## Sources Consulted
- `external/impeccable.md` (register grep, lines 20,82-84,112), `external/bolder.md` (Register section, lines 13-17)
- `sk-design/shared/` inventory (register.md absent; anti_slop_principles + cognitive_laws + design_token_vocabulary present)
- iterations 1–5 (this lineage), `gap-analysis.md` (sequencing + severities)

## Assessment
- **newInfoRatio: 0.25** — Primarily consolidation; the register grounding (Brand/Product switch mechanics + transform-verb dependency) and the family-wide priority ranking are the only genuinely new content. Below the continue-bar, confirming convergence.
- **Novelty justification:** Binds the five columns with three cross-cutting items (register prerequisite, asset pattern, author-once rule) and a single leverage ranking — the connective tissue the synthesis needs.
- **Confidence:** High — register mechanics read directly; ranking is a defensible synthesis of the per-mode evidence.

## Reflection
- **Worked:** Holding the register as an explicit cross-cutting prerequisite (not forcing it into one mode's column) kept the per-mode matrices honest.
- **Ruled out:** a sixth intake child; duplicating N1/N2; re-deriving severities.
- **Failed:** nothing.

## Recommended Next Focus
Converged — proceed to synthesis. Compile `research.md` with the per-mode expansion matrix, the cross-cutting prerequisites, the eliminated-alternatives table, and the priority ranking.
