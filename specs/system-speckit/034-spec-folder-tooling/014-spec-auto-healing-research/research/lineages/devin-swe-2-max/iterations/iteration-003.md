# Iteration 3: Q2 - producers of the top failure classes (archive.sh, templates, create.sh)

## Focus

Trace the largest failure classes to the code that produces them: `archive.sh` for path-consistency failures, the core spec template for ANCHORS_VALID, and `create.sh`'s seeding for phrase/placeholder classes.

## Actions Taken

1. Read `archive.sh` archive flow (lines 255-334) and grepped it for `description.json`/`specFolder`/`graph-metadata` handling.
2. Read `create.sh` `replace_template_default_trigger_phrases` (lines 391-479) and its call sites.
3. Byte-checked the scaffold sample (`scaffold-sample/spec.md.txt`) anchor layout for a fresh Level 2 phase child.
4. Read `templates/core/spec.md.tmpl` lines 180-219 and 390-427 around the `questions` anchor.
5. Confirmed ANCHORS_VALID semantics in `validator-registry.json` and `validation-rules.md`.

## Findings

1. CONFIRMED hypothesis (steer.md Q2 example): `archive.sh` moves a packet with `cp -R` to a temp dir, `mv` to `z_archive/`, `rm -rf` of the source, then `refresh_track_root` on the PARENT track only. Nothing rewrites the moved packet's own `description.json` `specFolder` or `graph-metadata.json` path fields, so every archived packet goes stale at move time. This is the direct producer of METADATA_DISK_PATH_CONSISTENCY (2,898 baseline hits) and part of GRAPH_METADATA_CHILD_IDENTITY. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:269-301; refresh at :294; deliberate non-rewrite of phase-parent children_ids at :296-301]
2. CONFIRMED hypothesis (steer.md Q2 example): `templates/core/spec.md.tmpl` opens `ANCHOR:questions` at line 184 for all levels; for levels 1/2/3 the closer renders at line 399, which means the L2 sections `nfr` (190), `edge-cases`, and `complexity` sit INSIDE `questions`. The level 3+ closer is separate at line 425. Fresh scaffold output reproduces it exactly: `scaffold-sample/spec.md.txt` has `questions` open at 128 wrapping `nfr` (132-146), `edge-cases` (150-166), `complexity` (170-179), closing at 187. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:184,399,425; specs/.../research/scaffold-sample/spec.md.txt:128-187]
3. The validator forbids exactly this: `validation-rules.md` states "No nesting - anchors cannot contain other anchors" and ANCHORS_VALID "Validates anchor syntax, pairing, order, and uniqueness". So the shipping template still mints ANCHORS_VALID failures on every new Level 1/2/3 spec.md today. CONFIRMED [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:392; .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:100-107]
4. `create.sh` seeds trigger phrases by exact-block replacement: `replace_template_default_trigger_phrases` swaps the four known template default blocks (spec/acceptance-criteria/plan/tasks/implementation-summary, 4 phrases each) only when the whole default block is present, deriving phrases from packet slug + description with a shared stop-word trim. CONFIRMED [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:394-463; call sites :986,:1191,:1776,:1982]
5. create.sh also generates `description.json` per folder (and warns rather than fails when the generator is missing), and writes phase-parent `phase-map` anchors into the parent spec (lines 1590-1694) -- i.e. create-time writes are the origin of much of the metadata the corpus later drifted on. CONFIRMED [SOURCE: create.sh:1704-1769,:1982-2003,:2069-2100]
6. Contradiction recorded per steer.md section 0: archive.sh deliberately does NOT prune the phase parent's `children_ids` (documented at lines 296-301 as "a reviewed prune"), yet the validator's GRAPH_METADATA_CHILD_IDENTITY flags stale child listings. Both behaviors are intentional in different layers; the repair need is a documented prune path, not a silent rewrite. [SOURCE: archive.sh:296-301; validator-registry.json GRAPH_METADATA_CHILD_IDENTITY entry]

## Ruled Out

- `git mv`-style index rewriting as the producer: archive.sh is filesystem-level `cp/mv/rm`, so git history of the moved folder is preserved but recorded paths are not (the failure is in JSON metadata, not git).

## Dead Ends

None.

## Edge Cases

- Contradictory evidence: finding 6 (intentional non-prune vs validator flag) recorded unresolved; the lane brief treats it as "reviewed prune" territory, not auto-fix.
- Missing dependency: none.

## Recommendations

| ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| R3.1 | Fix the `questions` anchor at the source: move `<!-- ANCHOR:questions -->` open to just above the OPEN QUESTIONS section (after the level-conditional L2/L3 blocks) in `templates/core/spec.md.tmpl`, so NFR/edge-cases/complexity are no longer nested | Q2 | `templates/core/spec.md.tmpl` | S | Low: template-only change; existing packets unaffected, new packets stop minting ANCHORS_VALID | spec.md.tmpl, plus matching examples/level-*/spec.md exemplars | spec.md.tmpl:184,399,425; validation-rules.md:392 | CONFIRMED |
| R3.2 | Make `archive.sh` re-derive the moved packet's recorded paths post-move: after `mv`, invoke the same derivation `repair-derived.cjs` performs (specFolder, graph paths) so archived packets never record a stale path | Q2, Q1 | `archive.sh` post-move block (after :293) calling `repair-derived.cjs --folder <new path> --apply` | S | Med: archive gains a dependency on the Node healer; keep the warn-not-fail pattern already used for refresh_track_root | archive.sh | archive.sh:284-294 never touches the packet's own metadata; fix-specfolder.mjs shows the fix is trivial | CONFIRMED producer; INFERRED wiring |
| R3.3 | Emit a per-packet "template version drift" signal: scaffolds carry `SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2`; when templates bump, packets created by older versions keep old bugs (this is the pre-v4 problem in miniature) | Q2, Q3 | `check-template-staleness.sh` + validator TEMPLATE_SOURCE | S | Low: reporting only | check-template-staleness.sh exists (steer.md:67); TEMPLATE_SOURCE comment convention confirmed at create.sh:794-805 | INFERRED |

Idempotency/reversibility: R3.1 is template-only, idempotent by definition, reversed by editing the template back, changes no existing document. R3.2 re-derives deterministic fields only (no prose), idempotent via skip-when-equal, reversible by re-running after restore. R3.3 is read-only reporting.

## Sources Consulted

- `steer.md` (lead brief, sections 0-3)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` (lines 255-334, grep)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` (lines 390-479, 773-805, 1590-1819, 1982-2100)
- `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` (lines 180-219, 390-427)
- `specs/.../research/scaffold-sample/spec.md.txt` (lines 124-191)
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` (lines 90-140)
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` (line 392)

## Assessment

- New information ratio: 0.9 (all six findings new or hypothesis-confirming with line-level evidence)
- Questions addressed: Q2 substantially (two of the lead's three named examples confirmed at the source)
- Questions answered: none marked; Q2 needs one more pass over `heal-spec-docs.cjs`/`upgrade-legacy.mjs` producers and old-template-version evidence

## Reflection

- What worked: reading the scaffold byte-copy next to the conditional template made the anchoring bug undeniable -- the rendered output shows the nesting, not just the template.
- What did not: nothing failed.
- Do differently: check whether `repair-derived.cjs` already covers the archive path fix (its allow-list decides R3.2's wiring).

## Recommended Next Focus

Iteration 4 (Q2 continued): read `repair-derived.cjs` + `README-repair-derived.md` for its allow-list scope, `heal-spec-docs.cjs` and `upgrade-legacy.mjs` for what healing already exists, and where old template versions surface (check-template-staleness.sh, MIGRATION.md).
