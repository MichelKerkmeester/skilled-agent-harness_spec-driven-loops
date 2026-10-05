# Iteration 001 — Spec-kit anatomy

- **Focus (charter 1):** Spec docs per level, templates, anchors, contracts, the phase-parent shape.
- **Status:** complete
- **NewInfoRatio:** 0.85
- **Novelty:** First systematic read of the packet anatomy (level contract, anchors, lean-trio phase parent) as a single model; concrete counts and enforcer names were not previously in the loop's context.

## Findings

### F1 — A spec packet is a numbered directory; phase parents are thin coordination roots

- Spec folders are `NNN-short-name` directories under `specs/`, 3-digit zero-padded number, single hyphen, lowercase hyphen-separated name; sub-folders for iterative work use the same shape (`folder-structure.md:64`, `folder-structure.md:68-70`, `folder-structure.md:79-90`).
- Packets may nest as coordination-root packets with direct-child phase folders, e.g. `specs/02--track/022-feature/011-phase/002-child/` (`SKILL.md:20`, `SKILL.md:23`).
- A phase parent keeps only the "lean trio": parent `spec.md`, `description.json`, `graph-metadata.json`. Heavy docs (`plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `implementation-summary.md`) live only in phase children (`phase-definitions.md:97-113`).
- Parent `spec.md` carries a **Phase Documentation Map** table (Phase | Folder | Status | Description) (`phase-definitions.md:125-137`); its `graph-metadata.json` carries `derived.last_active_child_id` / `derived.last_active_at` pointers (`phase-definitions.md:104-107`). Detection rule: a folder is a phase parent iff it has a direct `^[0-9]{3}-[a-z0-9][a-z0-9-]*$` child carrying `spec.md` or `description.json` (`phase-definitions.md:120-123`).
- Phase-parent template: `templates/packet-types/phase-parent.spec.md.tmpl`, with sections metadata / problem / scope / phase-map / questions (`phase-parent.spec.md.tmpl:43-125`).

### F2 — The level contract is one manifest, seven packet shapes

- `templates/spec-kit-docs.json` is the single level contract resolved by `create.sh` and the Level contract resolver (`folder-structure.md:56`, `SKILL.md:101`).
- Levels: `1` (simple-change), `2` (validated-change), `3` (arch-change), `3+` (governed-change, frontmatterMarkerLevel 4), plus non-level packet types `phase`, `review`, `research` (`spec-kit-docs.json:103`; `spec-kit-docs.json:2109+` for later levels).
- Every level requires core docs `spec.md`, `plan.md`, `tasks.md`; `implementation-summary.md` is lifecycle-required once implementation starts (`spec-kit-docs.json:108-117`). `acceptance-criteria.md` is an optional addon at Level 2+ (`spec-kit-docs.json:500-502`), scaffolded by default and the closure gate when present (`folder-structure.md:123`).
- The same file also fixes a `goalDurableBudget`: the durable slice after frontmatter up to the log anchor is counted in characters, error at 4000 chars, applied to parents and top-level packets (`spec-kit-docs.json:24-27`).

### F3 — Templates are anchor-indexed markdown with explicit source markers

- Anchor occurrences per core template: spec.md 29, plan.md 34, tasks.md 42, implementation-summary.md 12; packet types: phase-parent 10, research.spec 8, review.spec 10 (`templates/core/*.tmpl`, `templates/packet-types/*.tmpl` counted at iteration time).
- `spec.md.tmpl` opens with a frontmatter block carrying `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType` and an inline `SPECKIT_TEMPLATE_SOURCE` marker plus per-level `SPECKIT_LEVEL` markers (`spec.md.tmpl:2-49`).
- Core spec anchors: metadata, problem, scope, requirements, success-criteria, risks, questions at L1-L3, plus gated nfr, edge-cases, complexity, approval-workflow, compliance-checkpoints, stakeholder-matrix, change-log (`spec.md.tmpl:71-190`, `spec.md.tmpl:190-385`).

### F4 — Anchors are a validated grammar, addressed by line number

- Anchor grammar is an exact pair: `<!-- ANCHOR:id -->` / `<!-- /ANCHOR:id -->`, each on its own line, one-based line addressing, lower-kebab ids, typed ids like `DECISION-pipeline-003`, ids stable once written, at most once per document (`grep-convention.md:191-213`).
- Unmatched openers, orphan closers and duplicate ids are diagnostics that the retrofit and validator report but never silently repair (`grep-convention.md:204-207`).
- `ANCHORS_VALID` is an ERROR-severity rule over spec docs and memory artifacts ("ANCHOR pairs properly opened and closed") in the validation registry (`validation-rules.md:58`, section at `validation-rules.md:332-354`); the native rule lives in `runtime/lib/validation/orchestrator.ts` (`phase-definitions.md:120-123`).

### F5 — The frontmatter canon is five author-declared keys

- One canonical spelling each: `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`; `triggerPhrases` is a read-only alias rewritten on retrofit (`grep-convention.md:56-74`).
- These are exactly the fields the trigger index consumes; the anatomy therefore wires author-declared vocabulary into retrieval (cross-ref iteration 3).

## Sources

- `[SOURCE: .skilled/skills/system-spec-kit/SKILL.md:18-24, 61, 101, 440, 450-458]`
- `[SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:56, 64-90, 96-144]`
- `[SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:97-140, 120-123]`
- `[SOURCE: .skilled/skills/system-spec-kit/references/structure/grep-convention.md:56-74, 191-213]`
- `[SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:58, 332-354]`
- `[SOURCE: .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24-27, 103-117, 500-502, 2109]`
- `[SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:2-49, 71-190]`
- `[SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:43-125]`

## Open questions carried forward

- Which validator enforces each frontmatter key exactly (charter focus 2)?
- How do `description.json` and `graph-metadata.json` shape packet discovery (charter focus 2)?
- Does the research packet shape (`research.spec.md.tmpl`) differ from the core spec shape in ways OKF's concept model could describe (charter focus 6)?

## Next focus

Iteration 2 — Spec-kit metadata: frontmatter fields per doc type, `description.json`, `graph-metadata.json`, `_memory.continuity`, `trigger_phrases`, `importance_tier`, `contextType`, and which validator enforces each.

## Negative knowledge (tried, failed / dead ends)

- No dead ends yet; the anatomy read was direct. Deferred: exhaustive per-template section gating (spec-kit-docs.json `sectionGates`) to iteration 7 where touched surfaces matter.
