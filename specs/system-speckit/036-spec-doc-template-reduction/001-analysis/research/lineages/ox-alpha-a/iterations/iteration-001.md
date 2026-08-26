# Iteration 001 — Angle (a): Unified tasks+checklist design & status/validator migration

**Focus:** Q-A1 — Can tasks.md + checklist.md merge into ONE doc (Tasks + Verification Checklist + Testing Checklist)? What breaks in deriveStatus/detectLevel/manifest/PRIORITY_TAGS, and should the verification half start at L2?

## Method
Read the live contract sources: `templates/manifest/tasks.md.tmpl`, `templates/manifest/checklist.md.tmpl`, `mcp-server/lib/graph/graph-metadata-parser.ts` (deriveStatus), `mcp-server/lib/validation/orchestrator.ts` (detectLevel, requiredDocsForLevel, PRIORITY_TAGS), `mcp-server/lib/templates/level-contract-resolver.ts`, `templates/manifest/spec-kit-docs.json`.

## Findings

### F-A1.1 — deriveStatus does NOT uniformly read checkboxes from BOTH files [CONFIRMED]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1178-1184] `deriveStatus` ranks docs: `implementation-summary.md > checklist.md > tasks.md > plan.md > spec.md`.
- **checklist.md PRESENT (L2+):** status = `evaluateChecklistCompletion(checklistDoc.content)` — ONLY checklist checkboxes are parsed ([SOURCE: graph-metadata-parser.ts:1253-1257, 1260-1266]). tasks.md `[x]` state is ignored entirely once a checklist exists.
- **checklist.md ABSENT (L1):** status gates on `parseCompletionPct(implementation-summary)` AND `hasOpenTaskItems(tasks.md)` ([SOURCE: graph-metadata-parser.ts:1227-1251]).
- The "reads BOTH" behavior is real but split: `hasStartedWork()` scans `[x]` items in checklist.md OR tasks.md to decide whether implementation-summary is *required* ([SOURCE: mcp-server/lib/validation/orchestrator.ts:349-359]), and the L1 completion path combines implementation-summary completion_pct with open tasks.md items.
**Implication:** a merge changes the L2+/L1 asymmetry. Today L1 derives completion WITHOUT any checklist semantics; L2+ derives it from checklist-only. A merged doc needs ONE evaluation function over combined task+verification checkboxes, applied at all levels — otherwise L1 and L2+ diverge further.

### F-A1.2 — detectLevel infers level from FILE PRESENCE of exactly these two docs [CONFIRMED]
[SOURCE: mcp-server/lib/validation/orchestrator.ts:157-171] Level fallback chain: `decision-record.md` exists → `'3'`; else `checklist.md` exists → `'2'`; else `'1'`. (Primary detection is the SPECKIT_LEVEL marker in spec.md head.)
**Implication:** deleting checklist.md as a separate file removes the L2-presence heuristic. If the merged doc is named `tasks.md`, detectLevel must instead key off a marker inside tasks.md (e.g., presence of an `ANCHOR:verification` block or a frontmatter flag) — a VERSIONED contract change.

### F-A1.3 — Per-level required-doc manifest treats checklist.md as ADDON at L2/3/3+ [CONFIRMED]
[SOURCE: templates/manifest/spec-kit-docs.json (manifestVersion 1.0.0)] Levels 1: core=[spec,plan,tasks,implementation-summary], addons=[]. L2: addons=[checklist.md]. L3/3+: addons=[checklist.md, decision-record.md].
Loaded by `resolveLevelContract` ([SOURCE: mcp-server/lib/templates/level-contract-resolver.ts:39-41, 192-205]) and consumed by `docsForLevel`/`requiredDocsForLevel` ([SOURCE: orchestrator.ts:343-347]) plus `spec-doc-structure.ts:191`.
**Implication:** the OWNER DIRECTIVE (merge) maps cleanly onto the manifest model: replace the `checklist.md` addon entry with section gates INSIDE tasks.md (`sectionGatesByDocument['tasks.md']`), keeping the required-doc count per level identical in spirit while dropping one file. Manifest version bump + golden snapshot refresh are mandatory (shared fact).

### F-A1.4 — PRIORITY_TAGS validator scans ONLY checklist.md [CONFIRMED]
[SOURCE: orchestrator.ts:550-561] `validatePriorityTags` reads `checklist.md` exclusively and enforces `- [ ] CHK-* [P0|P1|P2]` format. Also `detectAnchorShape` classifies checklist-shaped anchors ([SOURCE: mcp-server/lib/validation/spec-doc-structure.ts:795-807]).
**Implication:** after merge, this rule must retarget to the merged doc's verification anchors. CHK-NNN id format itself is untouched (constraint respected).

### F-A1.5 — Template structure already anticipates phase-gated verification [OBSERVED]
[SOURCE: templates/manifest/tasks.md.tmpl:96-140] tasks.md.tmpl already carries `ANCHOR:phase-3` "Verification" tasks (T008-T010) AND an `ANCHOR:completion` criteria block; checklist.md duplicates the same intent as CHK-020/021 ("All acceptance criteria met", "Manual testing complete"). Overlap between T008-T010 and CHK-020/021 is direct evidence the two docs encode one workflow twice.
**Implication:** merging eliminates a real duplication, not just a file-count optimization.

### F-A1.6 — L1-behavior answer: verification section should be a level-GATED addendum inside the merged doc [RECOMMENDATION-DRAFT]
Evidence: checklist.md.tmpl is wrapped entirely in `<!-- IF level:2 -->…<!-- IF level:3 -->…<!-- IF level:3+ -->` blocks (one body per level, see Iteration 002 for duplication cost); L1's manifest has NO checklist addon; deriveStatus L1 branch never consults checklist semantics. Therefore: merged doc ships `ANCHOR:notation`, `phase-*`, `completion` at all levels; verification protocol + CHK sections render only at L2+ via existing IF gating. L1 keeps today's deriveStatus path (completion_pct + open tasks) — zero behavioral change where it matters most (bulk L1 packets).

## Migration surface (exact files to change)
1. `templates/manifest/spec-kit-docs.json` — remove checklist.md addon rows; add tasks.md sectionGates for L2+; bump manifestVersion.
2. `mcp-server/lib/validation/orchestrator.ts:163` — detectLevel heuristic (checklist presence → new merged-doc signal).
3. `orchestrator.ts:550-561` — PRIORITY_TAGS retarget to merged doc.
4. `graph-metadata-parser.ts:1178-1266` — deriveStatus ranking collapses checklist.md entry; single evaluation over merged checkboxes; keep L1 fast-path unchanged.
5. `spec-doc-structure.ts` + golden snapshots + `dist/` rebuild + content-router targets (shared fact: all-or-nothing).
6. Back-compat: shipped packets still contain standalone checklist.md — deriveStatus must keep accepting legacy checklist.md (read-only legacy branch) or every existing packet regresses to in_progress.

## Ruled out this iteration
- Ruled OUT: naive merge that deletes checklist.md without a legacy read-path in deriveStatus — would regress status derivation for ALL shipped packets (F-A1.1 ranking logic).
- Ruled OUT: making verification section required at L1 — contradicts manifest (no L1 addon) and adds friction to the most common packet type.

## Dead ends hit
- None; all targeted files found and consistent with dispatch's shared facts.

## Open questions carried forward
- Does the renderer support shared-core/include mechanics needed for Iteration 002 (shared-core + gated addenda)? What does 033's byte-identical gate actually assert?
