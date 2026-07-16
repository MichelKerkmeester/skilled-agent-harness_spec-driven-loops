# Iteration 5: Close Q1 (sk-design shipped?) + Q5 (structural artifacts)

## Focus
Resolve the two open/partial questions to unblock the coverage gate: (Q1) was sk-design phase 005 actually shipped, or is the graph `draft` status a real defect? (Q5) Are stray structural artifacts (root `descriptions.json`, `changelog`-as-packet, `z_archive` lifecycle) drift or intended design?

## Findings

### F5.1 — sk-design phase 005: work shipped, but status stays `draft` BY DESIGN (intentional status-semantics drift)
The phase-005 implementation-summary records: *"Completed | Yes — 001-008 authored, validated (0 errors), landed; scratch cleared"* and recent_action *"Authored and landed 001-008 reconstruction"*. The reconstruction target skills DO exist (`.opencode/skills/sk-design/{design-audit,design-foundations,design-interface,...}`). However the same summary states: *"Best-effort reconstruction. These packets document already-shipped skill behavior synthesized from source; each is labeled a RECONSTRUCTION DRAFT and should be verified against its SKILL.md before being treated as authoritative."*
- **Conclusion:** the work is done, but the packet status is deliberately held at `draft` because the reconstructions are drafts pending source-verification. So the 006 spec's "complete/shipped" claim and the graph's `draft` are **both correct under different definitions of "complete"** (work-landed vs status-field-finalized). This is a **known, intentional status-semantics mismatch**, not a defect — but it is exactly the kind of drift that misleads automated gates (006 used "001/003/005 complete" to satisfy its own launch gate while the graph says draft).
- [SOURCE: file:.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/005-sk-design-reconstruct/implementation-summary.md]
- [SOURCE: file:.opencode/skills/sk-design/ (skills present)]

### F5.2 — Q1 finalized: status drift is systemic AND partly intentional; the actionable core is spec-overstates-complete
Consolidating Q1 (iters 1+5): the ~45 raw / ~23 semantic status mismatches split into (a) **intentional draft-pending-verification** (sk-design family) and (b) **genuine drift** where spec.md claims `complete`/`blocked` but graph says `in_progress`/`planned` with no draft caveat (the dominant pattern, e.g. cli-001, sk-doc/015, sk-git/014, sk-prompt/001/002/004, deep-loop/033/068). The actionable drift category is (b): narrative over-states completion relative to derived state, which is hazardous for any gate that reads spec.md prose instead of graph-metadata.
- [SOURCE: iteration-001.md F1.1-F1.2 + F5.1 above]

### F5.3 — Root cause of numbering drift is documented in parent 000 graph-metadata
The parent `000-migration-from-soa-and-cleanup/graph-metadata.json` causal_summary explicitly states: *"Five spec-kit tracks ... have active packet numbering that collides with or sits below their own zarchive/ ceilings, plus assorted untracked stub/duplicate directories left behind by prior partial migrations."* This corroborates F2.1 (dual-scheme / partial migrations) and adds a new sub-finding: **untracked stub/duplicate directories** exist from prior partial migrations (e.g. system-speckit 002/003/004/007 shadowed by 0-file duplicate copies at 026-029).
- [SOURCE: file:.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/graph-metadata.json] causal_summary

### F5.4 — Q5 finalized: structural artifacts are mostly intended design, not drift
- **Root `.opencode/specs/descriptions.json` (2.8MB):** a **generated aggregate index** `{version, generated, folders}` — the machine-generated rollup of all per-packet `description.json` files. Not drift; it is the canonical cross-packet index produced by `generate-context.js`. (Every track also has a track-level `description.json`.)
- **`system-skill-advisor/changelog`:** a non-numbered folder that functions as a phase-parent (contains numbered child `002-skill-advisor-runtime`). It breaks the `NNN-` convention but is a deliberate "changelog" namespace, not drift. Minor convention deviation.
- **`z_archive` = `planned` (7/8):** genuine anomaly per F1.4, but plausibly explained by F4.4 (optimization programs never assign archives a terminal status). Design gap, not active drift.
- **Conclusion:** stray structural artifacts are overwhelmingly intended design (generated rollups, lean phase-parents, archive lifecycle). The only genuine structural drift signals are the `z_archive=planned` status gap and the `changelog`/`999` convention deviations.

## Sources Consulted
- 005-sk-design-reconstruct/implementation-summary.md + graph-metadata.json.
- `.opencode/skills/sk-design/` tree.
- parent 000 graph-metadata.json causal_summary.
- root `descriptions.json` (python json inspection), track-level `description.json` files.

## Assessment
- **newInfoRatio: 0.55** — resolves two open questions with evidence; the sk-design "intentional draft" resolution and the root-cause causal_summary are new, but the broader Q1/Q5 characterization was partly seeded. Moderate novelty.
- **Confidence:** high on sk-design resolution (direct summary quote); high on descriptions.json being generated; medium on z_archive=planned hypothesis (still inferred).
- **Q1 status:** answered. **Q5 status:** answered. All 5 key questions now evidence-backed.

## Reflection
- **Worked:** reading the implementation-summary (not just graph-metadata) disambiguated intentional-draft from real drift — graph status alone is insufficient to classify drift severity.
- **Failed:** none.
- **Ruled out:** "root descriptions.json is drift" — it is a generated aggregate index.

## Recommended Next Focus
All 5 key questions answered → legal STOP candidate. Iteration 6 (if gate permits STOP): enter synthesis. Else: verify legal-stop gates (coverage 5/5, source diversity, quality) and synthesize `research.md`.
