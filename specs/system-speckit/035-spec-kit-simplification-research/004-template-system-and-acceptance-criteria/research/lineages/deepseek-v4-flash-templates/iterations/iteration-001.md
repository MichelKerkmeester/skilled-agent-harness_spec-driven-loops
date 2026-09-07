# Iteration 001 — Contract vs structure-validator seams (RQ1)

- Angle: the reorganized manifest contract as consumed by the two native validators (spec-doc-structure.ts, orchestrator.ts) — the seam the 010 remediation touched and claimed to have made single-authority.
- Verdict: the hardcoded pair is gone ✓, but the doc-universe authority is still three-way, and the remediation left one new consumer unaligned: the duplicated OPTIONAL_CONTINUITY_DOCS sets now disagree with each other; resource-map.md's new contract membership meets a continuity-optional set that does not know it; goal.md's contract gates are not enforced by the static-anchor check; the FREEFORM exemption comment is now false; optionalAddonDocs is still not a validator authority.
- Tool calls: 8/12. Evidence: reads only (checked-in source; no node/validate/git).

## Findings (5: 1×P1, 4×P2)

### f-iter001-001 [P1] — OPTIONAL_CONTINUITY_DOCS duplicated in two engines, and the copies disagree
- THE CLAIM (test-side): "the contract is the one authority" (010 implementation-summary.md, What Was Built §One authority) and the two validators agree on which documents may omit the `_memory` block.
- WHAT THE CODE DOES: `runtime/lib/validation/orchestrator.ts:82-91` defines the set with **9** entries (spec, plan, tasks, handover, debug-delegation, research/research.md, before-after, timeline, roadmap — NO acceptance-criteria.md); `runtime/lib/validation/spec-doc-structure.ts:202-213` defines the same concept with **10** entries (same 9 PLUS acceptance-criteria.md). Both feed the identical rule shape (`!OPTIONAL_CONTINUITY_DOCS.has(name)` ⇒ `_memory` required): orchestrator.ts:879, spec-doc-structure.ts:668.
- CONSEQUENCE: a Level 2+ packet whose acceptance-criteria.md lacks a `_memory` block gets SPECDOC_FRONTMATTER_002 ("missing _memory block", warning) from spec-doc-structure (AC is in its optional set → no warning) but NOT from orchestrator (AC not in its set → warning). Two engines, one concept, two verdicts — the exact class of divergence the lane exists to catch, and 010 touched this exact file (spec-doc-structure.ts) without reconciling the twin set at orchestrator.ts:82.
- SEVERITY: P1 (wrong-or-unused: a maintainer reading one file's verdict cannot infer the other's; the AC template ships `_memory` so the visible surface is warnings, but the divergence is a real split-brain in a gate that 010 claims is unified).
- RECOMMENDATION: fix — hoist one shared constant (or import) and align the memberships; then adjudicate AC's class once.

### f-iter001-002 [P2] — resource-map.md's new contract membership meets a continuity set that does not know it
- THE CLAIM: f-iter002-004's fix made resource-map.md a lazy addon at every level (spec-kit-docs.json:176-184, 559-567, 1054-1062, 1609-1617, 2170-2180, 2312-2322, 2430-2440), and the remediation summary claims the validator now consumes the contract as the single authority.
- WHAT THE CODE DOES: `resource-map.md` is in NEITHER OPTIONAL_CONTINUITY_DOCS copy (orchestrator.ts:82-91, spec-doc-structure.ts:202-213), and its template ships no `_memory` block (templates/addons/resource-map.md.tmpl — grep `_memory:` = 0). Its only supported creation path is the manual inline-gate renderer. So every rendered resource-map.md in a packet is collected (it's in lazyAddonDocs → collectDocuments spec-doc-structure.ts:224-237) and is continuity-required → SPECDOC_FRONTMATTER_002 warning on every packet carrying one.
- CONTEXT: this is not new (the hardcoded collect path pre-remediation had the same effect for resource-map.md), but the 010 fix widened its exposure to every level contract AND claimed single-authority completion without aligning this consumer of the same doc-universe.
- SEVERITY: P2 (cosmetic in impact — a warning, misdirected at the only supported creation path; wrong in principle — the set's memberships no longer match the templates' shipped frontmatter).
- RECOMMENDATION: fix — add resource-map.md to both optional-continuity sets (or ship `_memory` in its template), and pin the set against the templates in the parity suite.

### f-iter001-003 [P2] — the FREEFORM exemption comment is false, and the exemption is not inert at numbered levels
- THE CLAIM (code comment): "No numbered level references these, so the exclusion is inert for Levels 1-3+ and phase parents" (spec-doc-structure.ts:196-199).
- WHAT THE CODE DOES: the comment guards `FREEFORM_WORKFLOW_DOCS = {review/review-report.md, research/research.md}` (spec-doc-structure.ts:200), applied at :230-233 inside collectDocuments. But `research/research.md` IS in lazyAddonDocs of all four numbered levels (spec-kit-docs.json:178, 561, 1056, 1611) and of phase-parent's sibling lists? No — phase drops it; numbered levels keep it. So a research/research.md sitting in a Level 1/2/3/3+ packet folder IS collected via the contract and THEN skipped at :230-233 — the exclusion is NOT inert; the contract declares a lazy doc that both validators structurally exempt (orchestrator.ts:513-516 does the same with its own FREEFORM filter).
- SEVERITY: P2 (comment false + one more contract-vs-code divergence in the doc-universe; no behavior break — the exemption protects a genuinely template-less artifact).
- RECOMMENDATION: fix the comment to the true statement ("the exclusion is inert for review/research contracts only"), and either document the exemption policy in the manifest or move research/research.md out of the numbered lazy lists into a documented template-free category.

### f-iter001-004 [P2] — collectDocuments still does not treat optionalAddonDocs as an authority
- THE CLAIM: 010 says the contract is the single authority for which documents exist and are validated.
- WHAT THE CODE DOES: spec-doc-structure.ts:224-237 unions requiredCoreDocs + requiredAddonDocs + lifecycleRequiredDocs + lazyAddonDocs, then special-cases acceptance-criteria.md with an `fs.existsSync` add at :233-235. optionalAddonDocs is never part of the union (it is read only by create.sh:415-418 and the parity test's documents check). Today the only optionalAddonDocs member (acceptance-criteria.md, spec-kit-docs.json:555/1050/1605) is handled by the special case, so a future member of that array would be invisible to SPEC_DOC_SUFFICIENCY/FRONTMATTER_MEMORY_BLOCK silently.
- SEVERITY: P2 (structural drift risk; current behavior correct for the one member).
- RECOMMENDATION: fix — union optionalAddonDocs and validate presence by the same present-addon filter the orchestrator uses (orchestrator.ts:508-509), dropping the fs special case.

### f-iter001-005 [P2] — goal.md's contract gates are never enforced: LAZY_DOCS_WITH_STATIC_ANCHORS is stale
- THE CLAIM: the manifest declares sectionGates (anchor-level requirements) for goal.md — directive/completion/log at L1-3+ and binding at phase (spec-kit-docs.json:521-527 and phase :2200-2205, verified via python dump: goal.md gates = {directive, completion, log} × [1,2,3,3+,phase] + binding × [phase]) — i.e., the contract says a goal.md carries those anchors.
- WHAT THE CODE DOES: the only validator that checks "present lazy doc must carry its contract anchors" is spec-doc-structure.ts:1011-1022, gated on `LAZY_DOCS_WITH_STATIC_ANCHORS` = {before-after.md, timeline.md, roadmap.md} (spec-doc-structure.ts:214). goal.md is not in it, so a goal.md missing ANCHOR:directive (or with an empty one) passes SPEC_DOC_SUFFICIENCY. decision-record.md is likewise out, but there the omission is engineered: template-structure.js:470-487 builds a dedicated decision-record contract with `requiredAnchors: []` and `allowedAnchors` for the adr-001 set plus dynamic ADR/DR headers — a deliberate dynamic-count design with code documentation. No equivalent special-case or documented reason exists for goal.md.
- SEVERITY: P2 (the violation mode is authoring drift, not machine breakage; but the contract-gate/validator mismatch is exactly the class round one's f-iter008-001 fixed for inclusion, now recurring for anchor requirements).
- RECOMMENDATION: fix — add goal.md to LAZY_DOCS_WITH_STATIC_ANCHORS (its anchors are static and now flag-scaffoldable), and document decision-record.md's dynamic-header design in the same comment.

## What worked
- Direct read of both validator engines immediately surfaced the twin-set divergence; the registry-first probe (validator-registry.json) confirmed no rule beyond spec-doc-structure enforces lazy-doc anchors, so the LAZY set finding did not need a second search.
- The python inventory of sectionGates doc-sets made the "contract declares gates that no validator enforces" contrast visible in one pass.

## Ruled out (this iteration)
- decision-record.md anchor non-enforcement is an accident: RULED OUT — template-structure.js:470-487 deliberately builds a dynamic record contract (requiredAnchors: [], allowedAnchors adr-001*, dynamic ADR/DR header rules); the design is code-documented.
- A registry rule enforces template required headers/anchors for lazy docs: RULED OUT — the registry's TEMPLATE_SOURCE (check-template-source.sh) checks marker presence only, and template-structure.js's compare/header machinery is not registered as a validate.sh rule.

## Carried questions
- CQ-001: does any OTHER validator surface handle goal.md anchors (level-match, check-files, template-guide claims)? — will verify in iteration 006 (goal angle).
- CQ-002: what do the two engines' docs-for-level constructions agree on beyond the continuation set (docsForLevel vs validationDocsForLevel)? — iteration 006/007.
