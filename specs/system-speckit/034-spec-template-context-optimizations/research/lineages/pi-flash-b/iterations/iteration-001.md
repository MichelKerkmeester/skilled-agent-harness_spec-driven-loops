# Iteration 001 — Templates + scaffolding pipeline under the Reducer Engineering lens

**Focus:** Measure token weight and duplication in `templates/manifest/*.tmpl`; verify how the doc workflow consumes them (renderer, staleness governance); map Reducer-Engineering techniques (dedupe/drop/group) to concrete template optimizations.
**Status:** complete | **newInfoRatio:** 0.95 (first pass over template surface; all findings new)

## Findings

### F1 — [AXIS: token-reduction | SURFACE: templates/manifest/*.tmpl] Cross-level variant duplication is the dominant template weight driver — GENUINE-GAP (restructure, not new machinery)

The four multi-level manifest templates are single files containing **stacked gated variants**: `spec.md.tmpl` has 4 sequential `<!-- IF level:N -->` blocks (lines 1, 146, 345, 592) each embedding a FULL copy of the shared core (METADATA, PROBLEM&PURPOSE, SCOPE, REQUIREMENTS, SUCCESS CRITERIA, RISKS).

Measured exact-line duplication vs the level:1 core (python script over the file, exact line matches):

| Template | Lines | L2 dup | L3 dup | L3+ dup |
|---|---|---|---|---|
| spec.md.tmpl (21,169 B) | 874 | 108/197 (72%) | 108/245 (60%) | 110/282 (53%) |
| plan.md.tmpl (29,381 B) | 1079 | 128/226 (73%) | 133/303 (58%) | 137/373 (49%) |

~111 lines of core are authored **4×** in spec.md.tmpl; ~133 in plan.md.tmpl. Combined manifest tree is ~150 KB; roughly 35-40% is exact cross-variant duplication.

**Why it matters (Reducer Engineering playbook):** the reducer article's core move is "group by normalized claim, keep the single best copy" and "measure raw input size before optimizing anything else" (context/Reducer Engineering.md §4, §8). Here the raw input to ANY agent that edits a template (or reviews the scaffold pipeline) is inflated ~1.6-1.9× by authored duplication. Scaffolded docs are NOT affected (renderer slices one variant — see F4), so this is a maintainer/author-context cost, not a per-scaffold cost.

**Concrete fix (file:line evidence that the mechanism already exists):** `renderInlineGates()` in `scripts/templates/inline-gate-renderer.ts:182-233` emits ALL lines when the gate stack is empty (`stack.every(...)` on an empty array → true; see output.push at line ~229). Ungated content is therefore included in EVERY rendered level. Restructure each template as: one ungated shared-core block (authored once) + per-level gated sections (only true addenda). This removes the 3 redundant core copies with **zero renderer changes**. Estimated reduction: spec.md.tmpl ~21 KB → ~9 KB, plan.md.tmpl ~29 KB → ~12 KB (core written once; only level-specific sections remain gated).

**Caveat (already-exists behavior):** `pendingInactiveGateBoundary` (inline-gate-renderer.ts:190-192, 224-227) deliberately skips the first blank line after an inactive gate closes. After restructure, a blank line immediately following an inactive gate is dropped — cosmetic only; use a non-blank separator or accept the one-line spacing change.

### F2 — [AXIS: token-reduction | SURFACE: templates/manifest/*.tmpl] Checklist/implementation-summary templates use a different gating pattern (plain sections + L3+ addenda) — lower duplication risk, no action — NOT-APPLICABLE

checklist.md.tmpl (593 L) and implementation-summary.md.tmpl (4 stacked variants, 530 L) do not repeat a full core per level with the same ratio (L1 core sections at checklist.md.tmpl:29-178 repeat at 179+ but with far less per-level addenda; implementation-summary variants are near-identical copies at 29/166/303/440). A full restructure is lower value here; the recommended fix is the same ungated-core pattern applied only where duplication is measured high (spec, plan).

### F3 — [AXIS: plan-adherence | SURFACE: scripts/spec/check-template-staleness.sh + templates] Staleness governance covers scaffold-vs-template drift, NOT intra-template variant drift — GENUINE-GAP (small)

`check-template-staleness.sh` (scripts/spec/check-template-staleness.sh:1-30) compares the `SPECKIT_TEMPLATE_SOURCE` version marker stamped into each spec folder against the current template version — i.e., it guards "scaffolded doc drifted from template". It does NOT verify that the 4 stacked variants inside one .tmpl agree on the shared core. Today, editing the L1 core in spec.md.tmpl only (lines 30-143) while forgetting L2/L3/L3+ (146+, 345+, 592+) silently produces level-divergent scaffolds — exactly the "duplicates noticed by nobody" failure the reducer article attributes to plain concatenation (context/Reducer Engineering.md §2, §5). The F1 restructure removes the failure mode entirely (single source); alternatively extend the staleness checker with a variant-agreement check.

### F4 — [AXIS: general | SURFACE: scripts/lib/template-utils.sh + scripts/templates/] The deterministic extraction pipeline IS the reducer for the scaffolding path — ALREADY-EXISTS (do not reinvent)

`copy_template` (scripts/lib/template-utils.sh:67-110) + `inline-gate-renderer.sh` implement exactly the reducer-engineering move at the scaffold boundary: one canonical source (manifest .tmpl), deterministic code-only extraction per level (no model involvement), fail-closed on missing templates. The article's "reducer between workers and synthesis" analog exists here as "renderer between template author and scaffold consumer". Any recommendation to add a new template-reduction engine would duplicate this.

## Dead ends / ruled out
- **"Scaffolded docs inherit all 4 variants' token weight"** — RULED OUT: renderInlineGates emits exactly one variant per level; a level-1 scaffold never contains level-3+ sections. Evidence: inline-gate-renderer.ts:182-233 + gate markers at spec.md.tmpl:1,146,345,592.
- Gate-3 classifier (shared/gate-3-classifier.ts, 887 L) and validate.sh (1422 L) are runtime scripts, not model-context surfaces — token reduction does not apply to them; they are execution logic. Deferred to iteration 2 for plan-adherence aspects only.

## Sources
- [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:1,146,345,592]
- [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:202,341,625,1007]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:182-233]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/template-utils.sh:67-110]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/check-template-staleness.sh:1-30]
- [SOURCE: specs/system-speckit/033-spec-templates-and-context-reducer/context/Reducer Engineering.md §2,4,5,8]
