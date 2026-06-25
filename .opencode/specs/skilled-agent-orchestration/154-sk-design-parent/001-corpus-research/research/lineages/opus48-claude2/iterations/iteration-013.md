# Iteration 13: Backward-compatibility plan for folding in the existing skills (KQ7 final)

## Focus
Specify how `sk-design-interface` and `sk-design-md-generator` fold into the family without breaking the cross-repo references and advisor/skill-graph metadata they already participate in.

## Findings

### F52 — Keep flat `sk-design-*` child names (the umbrella model makes this free)
Because the recommended parent is an umbrella-router over a sibling family (not a nesting hub), children keep their flat `sk-design-*` identities. `sk-design-interface` stays `sk-design-interface`; the existing cross-references from `sk-code`, `sk-code-review`, `mcp-figma`, `mcp-open-design`, and CLAUDE.md routing tables remain valid with zero rewrites. This is the single biggest compat win of the umbrella decision over the hub decision (which would have forced a `sk-design/interface` nesting and broken all of them). [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:196-202], [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:398-402]

### F53 — `sk-design-md-generator` → `sk-design-spec`: rename via alias, not in-place
The md-generator should present as the family's `sk-design-spec` (DESIGN.md extract + author). To preserve compat: keep `sk-design-md-generator` as a permanent alias/redirect (advisor keyword + skill-graph node) pointing to the canonical `sk-design-spec`, OR keep the canonical name `sk-design-md-generator` and add `sk-design-spec` as the alias. Either way, NO hard rename without an alias — the name is referenced by `sk-design-interface`, `sk-code`, the transports, and `system-spec-kit`. The "author from brief" path (stitch approach) is added as a new mode inside it; the extract backend is untouched. [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:398-425]

### F54 — `sk-design-interface` folds in as the flagship, augmented not replaced
It is already the family's design-judgment skill (F35). Onboarding augments it: (a) add a `references/aesthetics/` preset library (brutalist/minimalist/soft/apple-bento); (b) add craft/shape/redesign/explore mode packets distilled from impeccable/design-lab/redesign; (c) add the register split (brand vs product) and the first/second-order slop test from impeccable; (d) bump version, preserve the Apache-2.0 vendored base + LICENSE. Its existing references (design_principles, variation_diversity, real_ui_loop, quality floor) stay authoritative. No identity change. [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:151-167], [SOURCE: external/impeccable.md:13-117]

### F55 — Shared-base extraction without breaking children
The parent owns a shared design-base reference (anti-slop core, register, slop test, token conventions). Children *reference* it rather than embedding copies. Backward-compat rule: until the parent's shared base exists and is validated, children keep their current self-contained references; the shared base is introduced additively, and per-child duplication is removed only after the reference resolves and routing is validated. This avoids a window where a child loses its rules mid-migration. [SOURCE: external/audit.md:60-64], [SOURCE: external/impeccable.md:27-117]

### F56 — Migration sequence and compat gates (maps to the phase plan)
1. **003 scaffold** — create `sk-design` parent (umbrella-router + `skill-registry.json` + shared design-base). No child changes yet.
2. **004 onboard-existing** — register `sk-design-interface` + `sk-design-md-generator`(→spec alias) under the parent; add shared-base references additively; rewire CLAUDE.md/related-skills tables to ALSO mention the parent (additive). Compat gate: existing references still resolve; advisor still routes "design"→interface and "extract DESIGN.md"→spec at ≥0.8.
3. **005 build-sub-skills** — build `sk-design-foundations`, `sk-design-motion`, `sk-design-audit` from the assigned corpus sources; (decide output child).
4. **006 integration-validation** — advisor rebuild + skill-graph scan + `validate.sh --recursive`; routing-regression suite (each trigger set lands on its child); confirm no orphaned references.
Rollback: each phase validates independently; children remain individually invocable throughout, so a failed phase never dark-launches a broken family. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/spec.md:98-119]

## Sources Consulted
- Existing SKILL.md cross-reference sections (both skills); parent spec phase map; impeccable/audit shared-context evidence (prior iters).

## Assessment
- **newInfoRatio: 0.4** — The keep-flat-names compat win, the alias-not-rename rule, the augment-not-replace plan for interface, additive shared-base extraction, and the phase-mapped migration with compat gates are new and actionable.
- **Novelty justification:** Completes KQ7 with a concrete, low-risk migration that exploits the umbrella decision to avoid name breakage.
- **Confidence:** High — grounded in the actual cross-references and the parent spec's phase map.

## Reflection
- **Worked:** The umbrella decision (iter 11) directly pays off here — flat names mean near-zero reference rewrites.
- **Insight:** "Alias before rename" and "additive shared-base then de-dup" are the two rules that keep the migration non-breaking.
- **Ruled out:** Hard-renaming md-generator in place (breaks references); embedding the shared base by copy into every child (drift + a mid-migration rules gap).

## Recommended Next Focus
Iteration 14: Risks, tradeoffs, and alternative-taxonomy stress test — cross-check the recommendation against designer-skills and impeccable, and surface where it could be wrong.
