# Iteration 4: Q1/Q3 - the healing fleet that already exists (repair-derived, heal-spec-docs, upgrade-legacy)

## Focus

Inventory the permanent repair tooling the branch already ships and where its boundaries sit: `repair-derived.cjs` allow-list, `heal-spec-docs.cjs` derivable-only healing, `upgrade-legacy.mjs` orchestration and baseline mechanics.

## Actions Taken

1. Read `README-repair-derived.md` in full (the derived-vs-authored contract).
2. Grepped `repair-derived.cjs` for archive handling and the allow-list.
3. Read `heal-spec-docs.cjs` head and flag handling.
4. Read `upgrade-legacy.mjs` lines 1-478: header contract, arg parsing, root resolution, discovery, validation worker pool, step order, baseline recording.
5. Re-read `steer.md` sections 3-5.

## Findings

1. `repair-derived.cjs` is already the canonical deterministic healer: report-only by default, `--apply` to write, bare paths refused, every applied step named in the dry run first, and an explicit allow-list where "anything added must be recomputable from repository state". Exit 0/1/2 encodes clean/repairable/failed. CONFIRMED [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md:22-26,73-86,113-118]
2. CONTRADICTION recorded per steer.md section 0: `README-repair-derived.md` section 6 says "Archived and scratch trees are skipped. They are frozen copies that will never be brought to current standards, and measuring them reports permanent debt nobody can act on", and the code enforces it (`FROZEN_TREES` includes `z_archive` at repair-derived.cjs:389). Yet phase 013 repaired 1,935 archived packets - the corpus work went around the refusal with one-off scripts (`fix-specfolder.mjs`). The README's "never be brought to current standards" claim is refuted by the phase that did exactly that. [SOURCE: README-repair-derived.md:135-137; repair-derived.cjs:389; 013 spec.md problem statement]
3. `heal-spec-docs.cjs` is the authored-adjacent healer: restores only literal template defaults (trigger_phrases per doc class) and SPECKIT_TEMPLATE_SOURCE headers when the document's own anchor set matches the template signature - "it never authors content". Dry run by default; `SKIP_DIRS` always contains z_archive for discovery, but an explicit `--folder` bypasses discovery, which is how archive packets could be reached. CONFIRMED [SOURCE: heal-spec-docs.cjs:4-17,36-56,187-193]
4. `upgrade-legacy.mjs` is the Q3 orchestrator already shipped: validates every packet (`validate.sh --strict --json --no-recursive`), repairs only failing packets in dependency order (fill-frontmatter -> heal-spec-docs -> repair-derived -> migrate-generated-json), then records remaining findings in `upgrade-baseline.json` beside the packet; the validator downgrades recorded findings to warnings while unlisted findings stay errors. CONFIRMED [SOURCE: upgrade-legacy.mjs:8-16,227-254,378-415,421-458]
5. upgrade-legacy detects the pre-v4 layout directly: `resolveRoots` refuses `.opencode/specs` roots with exit 2 and prints the exact migration recipe (`rm -f specs && git mv .opencode/specs specs && ln -s ../specs .opencode/specs`) BEFORE any write. CONFIRMED [SOURCE: upgrade-legacy.mjs:151-162]
6. Containment and idempotency are already engineered in: roots resolved to real paths and confined to the repo (symlink cannot escape), `research`/`review`/`context` artifact trees exempt, archived packets recorded-not-repaired without `--include-archive`, baseline write skipped when identical and refused outside roots, NEVER_RECORDED_RULES keeps validator-non-recordable rules out of the baseline. CONFIRMED [SOURCE: upgrade-legacy.mjs:78-97,126-170,192-208,439-458]
7. The validator already has `--json` output (used at upgrade-legacy.mjs:230), so the scratchpad's verbose-text scraping filled a residual gap: per-rule detail lines grouped by folder, which JSON entries carry but lanes wanted in the `### folder / x RULE` shape. CONFIRMED [SOURCE: upgrade-legacy.mjs:230; scratchpad val-detail.sh]

## Ruled Out

- Building a new corpus-heal command from scratch: upgrade-legacy.mjs already IS that command; the gap is coverage (archive opt-in exists but the freeze rules differ per tool), not existence.
- Treating the README's "never bring archived to standards" as policy: it is a stale design note contradicted by phase 013's completed repair of 1,935 archived packets.

## Dead Ends

None.

## Edge Cases

- Contradictory evidence: finding 2 (README freeze claim vs phase 013 archive repair) is recorded with both sources; resolution favors observed behavior + upgrade-legacy's `--include-archive` design.

## Recommendations

| ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| R4.1 | Fold the phase 013 one-offs into `upgrade-legacy.mjs`'s step list rather than new tools: add an anchor-dedup step (port of fix-dup-anchors.mjs) and a specFolder/path step that runs before repair-derived under `--include-archive`, keeping report-first/--apply semantics | Q1, Q3 | upgrade-legacy.mjs STEPS section + a new `spec/fix-dup-anchors` module | M | Med: anchor surgery is textual and the ported logic must keep "prose never touched" | upgrade-legacy.mjs, new step module, tests | fix-dup-anchors.mjs:1-6 safety contract; upgrade-legacy.mjs:378-415 step pattern | CONFIRMED fit; INFERRED effort |
| R4.2 | Fix the stale contract: README-repair-derived.md section 6 "never be brought to current standards" is wrong after phase 013; document when `--folder` bypasses FROZEN_TREES and when archive repair is legitimate | Q2 | README-repair-derived.md + FROZEN_TREES comment | S | Low: doc/comment only | README-repair-derived.md | contradiction evidence above | CONFIRMED |
| R4.3 | Reuse `upgrade-baseline.json` as the general "recorded debt" mechanism for old repos: its schema {schema, recordedBy, recordedAt, findings[]} plus the validator's recorded-finding downgrade is exactly the reversible, audit-friendly mechanism Q3 needs | Q3 | already implemented; document in MIGRATION.md | S | Low: exists and is atomic tmp+rename | docs only | upgrade-legacy.mjs:421-458,89-97 | CONFIRMED |

Idempotency/reversibility: R4.1 keeps dry-run default and skip-when-equal; anchor dedup renames markers (reversible text edit, no prose change). R4.2 is docs. R4.3 already exists; the baseline file is user-deletable and validator-visible.

## Sources Consulted

- `steer.md` (lead brief)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md` (full)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` (grep: :389 FROZEN_TREES, exits)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` (lines 1-56, 178-229)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` (lines 1-478)
- `scratchpad/fix-specfolder.mjs`, `val-detail.sh`

## Assessment

- New information ratio: 0.85 (findings 1,4,5,6,7 new; 2-3 partially new extensions of iteration 3's producer work)
- Questions addressed: Q1 (existing tool boundaries), Q3 (the orchestrator and its pre-v4 detection exist)
- Questions answered: none fully marked; Q3's detection leg is close

## Reflection

- What worked: reading README + code pairs exposed both the design contract and where the doc drifted from it (the archive-freeze claim).
- What did not: nothing failed; `--json` validator output found faster than expected.
- Do differently: next pass should verify whether `/doctor:update` already invokes upgrade-legacy or leaves it orphaned, and how "old repo" is detected beyond the .opencode path.

## Recommended Next Focus

Iteration 5 (Q2 close + Q3 open): read `check-template-staleness.sh`, `templates/MIGRATION.md`, `templates/CONTRACT.md` for old-version detection, and start `/doctor:update` wiring (`.skilled/commands/doctor/update.md`, `doctor-update-*.yaml`).
