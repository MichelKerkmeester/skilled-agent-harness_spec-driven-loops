# Iteration 006 — Crosswalk: OKF v0.2 versus system-spec-kit

- **Focus (charter 6):** Field-by-field and file-by-file mapping between spec-kit and OKF: what matches, what is missing on each side, what conflicts.
- **Status:** complete
- **NewInfoRatio:** 0.75
- **Novelty:** First single-table crosswalk of the two systems; surfaces the structural split (OKF = one file per concept with all families; spec-kit = authored docs + generated sidecars + machine-owned continuity) and names the adoption conflicts precisely.

## A. Field-by-field

| OKF field (v0.2) | system-spec-kit today | Verdict |
|---|---|---|
| `type` (required) | No doc-level type field; document kind is the filename (`spec.md`, `plan.md`, …) and packet role; skills carry `name` in SKILL.md frontmatter (`SKILL.md:2`) | **Gap (spec-kit)** — mapping exists, field does not |
| `title` | `title` in every doc frontmatter, enforced non-empty by `FRONTMATTER_VALID` (`validation-rules.md:60`) | **Match** |
| `description` | `description` frontmatter + packet `description.json` (`description.json:1-16`) | **Match** |
| `resource` (URI of underlying asset) | No analogue; `graph-metadata.json` `key_files` lists paths, not canonical asset URIs | **Gap (spec-kit)** |
| `tags` | No tags; `description.json` `keywords[]` and `graph-metadata` `key_topics` are *generated* token lists, not authored taxonomy | **Gap (spec-kit)** |
| `sources[]` + credibility signals (`id`, `resource`, `title`, `author`, `usage_count`, `last_modified`, `usage_window`) | Citations live in body prose with a per-loop convention (this lineage: `[SOURCE: file:line]`); no structured provenance anywhere; `recent_context`/`observations` in the save payload are session narrative, not sources (`save-workflow.md:195-232`) | **Gap (spec-kit)** — largest single gap |
| `generated{by,at}` | `_memory.continuity` `last_updated_by` + `last_updated_at`; `graph-metadata` `last_save_at` (`save-workflow.md:250`, `save-workflow.md:305-317`) | **Partial** — semantics close, location split |
| `verified[]` (trust tiers) | No per-document verification events. Nearest: `tasks.md` verification checklist + `acceptance-criteria.md` closure gate — verification of *work*, not of *document truth* (`SKILL.md:444-458`) | **Gap (spec-kit)** |
| `status: draft\|stable\|deprecated` | `spec.md` metadata `Status` field; `graph-metadata` `derived.status`; `STATUS_CROSS_DOC_CONSISTENCY` rule (`validator-registry.json`) | **Partial** — vocabulary and granularity differ |
| `stale_after` (absolute instant) | None. `CONTINUITY_FRESHNESS` is an opt-in strict-only completion check, not a per-doc staleness instant (`validation-rules.md:57`); graph `last_accessed_at` is telemetry | **Gap (spec-kit)** |
| Actor convention `human:` / `process:` / `producer/version` | `last_updated_by` is a free string (`"opencode-gpt-5"` in the documented example, `save-workflow.md:309`) | **Gap (spec-kit)** — cheap to align |
| `okf_version` (bundle-root `index.md`) | Format-version markers exist per document (`SPECKIT_TEMPLATE_SOURCE`, `SPECKIT_LEVEL`, `spec.md.tmpl:30-49`) and `description.json.level`; no single declared corpus version | **Partial** |

## B. File-by-file

| OKF file | spec-kit analogue | Note |
|---|---|---|
| Concept doc (`<concept>.md`) | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `decision-record.md`, … | Same unit (one markdown doc with frontmatter), different contract: spec-kit requires level-gated sections and anchors, OKF requires none |
| `index.md` (per directory) | **No analogue.** Closest: Phase Documentation Map in a parent `spec.md` (`phase-definitions.md:125-137`), `description.json` keywords, and the global trigger index JSON | **Gap (spec-kit)**; the global index is generated, not authored per folder |
| `log.md` (per directory) | Packet-local nested changelogs generated at completion (`nested-changelog.md:16,37,44-45`) + the L3+ `change-log` anchor in `spec.md` (`spec.md.tmpl:380-385`) | **Partial** — exists at packet level, not at every directory |
| `references/` convention | `scratch/`, `research/`, `review/`, `improvement/` local-owner folders (`folder-structure.md:150-235`) | **Partial** — both reserve reserved-purpose folders |
| Bundle root | Spec packet directory (`folder-structure.md:64`) | Same container idea; spec-kit never exports/ships a packet as a portable unit |
| Cross-links as graph edges | Markdown links between packet docs; `graph-metadata.json` manual edges (`depends_on`, `supersedes`, `related_to`) + `children_ids` | **Partial** — edges exist, no extraction/traversal consumer |
| Attested computation concept | No analogue. Closest surfaces: verification sections in `tasks.md`, scripts under `runtime/`, `research/` evidence | **Out of scope for adoption** (recorded in iteration 7) |

## C. Where spec-kit is ahead of OKF (gaps in OKF)

- Levels and level contracts: seven packet shapes with required/optional docs (`spec-kit-docs.json:103-117` etc.). OKF has no levels; one `type` value is the whole required surface (`okf-SPEC.md:177-188`).
- Enforceable structure: 40 registered validation rules (`validator-registry.json`) vs OKF's three permissive conformance rules (`okf-SPEC.md:736-762`).
- Anchor grammar with stable line addressing and diagnostics (`grep-convention.md:191-213`). OKF has no addressing primitive.
- Phase system: lean-trio parents, phase map, parent/child pointers, detection rule (`phase-definitions.md:97-140`). OKF's hierarchy is purely conventional.
- Generated sidecar metadata with source fingerprints (`graph-metadata.json`, `save-workflow.md:298`). OKF keeps everything in the one concept file and has no integrity hash.
- Global retrieval: committed trigger index (13,150 paths / 33,666 phrase entries, iteration 3 observation) + literal scan contract. OKF has no retrieval tooling at all — consumption is left to consumers.
- Two completion gates: tasks checklist + acceptance-criteria closure (`SKILL.md:444-458`). OKF has no completion concept.

## D. Conflicts that block naive adoption

1. **Conformance universality.** OKF conformance rule 1 requires every non-reserved `.md` in a bundle to carry parseable frontmatter; rule 2 requires a non-empty `type` (`okf-SPEC.md:740-744`). The `specs/` corpus is full of non-conformant markdown by that standard (research iterations, review docs, scratch, archive). Declaring `specs/` an OKF bundle today would be false; declaring it one after typing every doc is a migration of thousands of files (blast radius in iteration 8).
2. **Reserved filenames.** OKF reserves `index.md` and `log.md` at every level (`okf-SPEC.md:134-149`). Spec-kit has no such reserved names and uses `changelog/` directories; adding per-folder `index.md`/`log.md` would create new validation and retrieval surface, not reuse existing one.
3. **One-file-per-concept vs split surfaces.** OKF puts provenance/trust/lifecycle in the concept's own frontmatter (`okf-SPEC.md:201-207`). Spec-kit deliberately splits: authored frontmatter, generated `description.json` + `graph-metadata.json`, machine-owned `_memory.continuity` (`save-workflow.md:298`). Any OKF-styled field must have exactly one owner or it will duplicate state.
4. **Prescriptive vs permissive validation culture.** Spec-kit fails closed on missing files, placeholders, anchors and closure; OKF instructs consumers never to reject for missing optional families, unknown types, unknown keys or broken links (`okf-SPEC.md:749-762`). A checker can hold both contracts only by keeping OKF-style permissiveness scoped to a separate interchange surface.
5. **Link base.** OKF recommends bundle-root-absolute links `/tables/x.md` (`okf-SPEC.md:444-450`); spec-kit documents use repo-relative links and has its own link checker (`LINKS_VALID` in `validator-registry.json:411`). Mixing bases without a base declaration breaks one of the two.

## Sources

- `[SOURCE: scratch/seed/okf-SPEC.md:134-149, 177-207, 736-762, 444-450]`
- `[SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:57, 60]`
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json]` (40 rule ids incl. `LINKS_VALID` at :411)
- `[SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:195-232, 250, 298, 305-317]`
- `[SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:97-140]`
- `[SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:64, 150-235]`
- `[SOURCE: .skilled/skills/system-spec-kit/references/workflows/nested-changelog.md:16, 37, 44-45]`
- `[SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:30-49, 380-385]`
- `[SOURCE: .skilled/skills/system-spec-kit/SKILL.md:2, 444-458]`

## Open questions carried forward

- For each gap, is the touched surface narrow enough for an additive change? (iteration 7)
- Does typing every document (`type`) break the frontmatter allowlist or the trigger-index generator? (iteration 8)

## Next focus

Iteration 7 — Candidate ideas and feasibility: typed concepts, per-folder index files, a change log file, provenance and freshness fields, bundle export or import. For each: touched surfaces, callers, validators, effort and benefit estimate.

## Negative knowledge (tried, failed / dead ends)

- Mapping `description.json` to an OKF concept was attempted and rejected: it is generated and carries no body, so it maps to no OKF structure. The authored-vs-generated boundary is the crosswalk's real fault line.
