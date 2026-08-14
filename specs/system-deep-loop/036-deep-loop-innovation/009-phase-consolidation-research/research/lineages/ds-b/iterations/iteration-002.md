# Iteration 2: Cluster Design Part 1 — Multi-Phase Parent Set for 001-017 + 018-033

## Focus
Design the concrete multi-phase parent (grandparent) grouping for the original program phases 001-017 and the remediation tree 018-033, grounded in the dependency chain (phase-tree.json), phase kinds (leaf/parent), themes, and statuses. Produce optimized group names and the membership mapping. (047-052 and 053-056 grouped in iteration 3.)

## Findings

### F2.1 — Grounding: the original program's dependency chain is a strict linear spine
`manifest/phase-tree.json` `phases[]` records `depends_on` per phase; the program is a single cross-mode spine with no branching at the top level:
- 003 → 004 → (005, 006) → 007 → 008 → 009 → 010 → 011 → 012 → 013 → 014 → 015 → 016 → 017; research inputs 001-002 are read-only and feed 004's ledger. [SOURCE: file:specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json]

**Key implication for grouping:** because the chain is linear and dependency-ordered, a "group by theme" must preserve this order within each group — but the grouping itself does not need cross-group dependency edges if groups are ordered 1→2→3→4 in the same sequence. This makes grouping SAFE: no dependency cycle is introduced by nesting 001-017 under, e.g., 3-4 grandparent folders arranged in program order.

### F2.2 — Grounding: kind and status distribution of 001-033
- Parents (have children): 004(3), 006(4), 007(7), 008(5), 009(7), 010(5), 011(5), 012(4), 013(8), 014(3). [SOURCE: file:.../{004,006-014}/graph-metadata.json]
- Leaves: 001, 002, 003, 005, 015, 016, 017, 018, 019, 020, 021, 022, 023, 024, 025, 026, 027, 028, 029, 030, 031, 032, 033, 035.
- Status (from graph-metadata derived.status): complete = 001,002,003,005,019,020,023,026,027,033; in_progress = 013,018,021,022,024,025,028,029,030,031,032; planned = 004,006,007,008,009,010,011,012,014,015,016,017,035. [SOURCE: child graph-metadata.json files]
- Child phase-parents 004 and 006-014 have `kind=parent` in phase-tree.json; all are Planned except 013 (In Progress). The grandparent grouping does not change their `kind` — they remain fractal parents inside their new home.

### F2.3 — Proposed cluster set for 001-017 (4 multi-phase parents, program-ordered)
Design principle: one grandparent per *phase-map band* of the original program, preserving the phase-map's internal ordering and the SOL-ultra sequencing invariants. Each new grandparent is a lean phase-parent (spec.md + description.json + graph-metadata.json).

| Proposed grandparent slug | Members (current) | Theme / binding rationale |
|---|---|---|
| `001-research-inputs-and-baseline` | 001, 002, 003 | Read-only research inputs (001/002, 8+59+111 recs) + the frozen BASE/taxonomy/census (003) that everything is proven against. 003 is the pinned baseline consumed by 004+. |
| `002-ledger-and-spine-architecture` | 004, 005, 006 | The spine contract (004: ADR + 178-row bijective ledger + transition policy), the early fan-out live-tools unblock (005), and the dark transition-authorized ledger core (006: envelope/ledger/fingerprints/gateway). All depend on the frozen contract. |
| `003-shared-services-and-migration-bridge` | 007, 008 | Shared evidence/control services (007: receipts, sealed artifacts, adjudication, budgets, gauges, locks) + the compatibility/shadow/rollback bridge (008: upcasters, shadow parity, state classification, rollback drills). 007 precedes 008 in the chain; both are the "dark substrate grows safely" band. |
| `004-orchestration-convergence-and-mode-contracts` | 009, 010, 011, 012 | Durable fan-out/fan-in (009) + novelty/claims/projections (010) + convergence/termination/health (011) + shared mode contracts/fixtures (012). These are the runtime-verification band and all mutually depend; 012 is the parallel-safety contract for the mode fan-out. |
| `005-mode-migration-cutover-and-gate` | 013, 014, 015, 016, 017 | The eight per-mode migrations (013) → staged authority cutover (014) → legacy retirement (015) → whole-system gate (016) → integrate-latest/closeout (017). The execution-and-verification tail. |

**Rationale:** 5 grandparents covering 17 children, each 3-4 members, each a coherent phase-map band of the original 001-017 program. All are under the `ok` (<20) health threshold. The ordering 001→005 reproduces the dependency spine, so no cross-grandparent back-edges are needed.

### F2.4 — Proposed cluster set for 018-033 (2 multi-phase parents)
The remediation tree splits naturally by the parent spec.md's own narration: the *four named cutover blockers* (021-024) and the *remaining remediation/hardening* tree.

| Proposed grandparent slug | Members (current) | Theme / binding rationale |
|---|---|---|
| `006-drift-revalidation-and-blocker-closeout` | 018, 021, 022, 023, 024 | The pre-execution drift revalidation (018) plus the four named cutover blockers from spec.md §5 table (021 completion-evidence reconcile = Blocker 4, 022 shadow-parity independent derivation = Blocker 1, 023 legacy-compat vocabulary = Blocker 2, 024 durable write boundaries = Blocker 3). These gate the 014 cutover (handoff table row "021-024 → 014"). |
| `007-remediation-docs-integrity-and-hardening` | 019, 020, 025, 026, 027, 028, 029, 030, 031, 032, 033 | Docs/alignment (019 runtime readmes, 020 sk-code alignment, 032 docs-drift+P2 batch) + integrity/hardening bindings (025 artifact-certificate, 026 alignment-coverage, 027 mode-gate/contract, 028 fanout-dispatch, 029 promotion-authority, 030 runtime-mirror parity, 031 silent-failure, 033 identity/lock). 035 excluded (CLI-adapter stress; grouped in iter 3 with 047-052). |

**Rationale:** 2 grandparents covering 15 children (018-033 minus 035), 11 + 4 members. 007 is the larger (11) but still under the 20 warning threshold and well under the 40 error threshold; if desired it can later split 019/020/032 (docs) from 025-033 (integrity) — flagged as an optional sub-split, not required.

### F2.5 — Group count check
With iteration 3's groups (035, 047-052 → executor/hardening; 053-056 → review tree), the 036 direct-child listing drops from **45** to **9 grandparents + 057 research host = ~10 direct children**. This is squarely `ok` health (<20) and reduces the phase-map from ~50 rows to ~10 rows. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:24-25; parent spec.md]

## Sources Consulted
- specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json (phases, depends_on, kind)
- Parent spec.md PHASE MAP + handoff table (001-032 statuses, blocker naming 021-024)
- Child graph-metadata.json statuses for 001-033
- Child spec.md H1 titles for 018-033

## Assessment
- **newInfoRatio:** 0.85
- **noveltyJustification:** Derived the cluster design for 001-017 (5 grandparents, program-ordered) and 018-033 (2 grandparents split at the blocker boundary) from the phase-tree dependency chain and the parent's own blocker naming — a new synthesis not present in the parent docs.
- **Confidence:** Confirmed for membership (from on-disk metadata); the *optimal* grouping is judgment (alternative splits noted).

## Reflection
- What worked: using the SOL-ultra sequencing invariants and the parent spec's own blocker narration as the grouping axis produced groups that preserve dependency order and read naturally.
- What failed: none.
- Ruled out: grouping 019/020/032 separately from 025-033 into a third remediation grandparent — NOT required for health (11 < 20); noted as optional sub-split. Also ruled out splitting 007's integrity band across two grandparents — unnecessary.

## Recommended Next Focus
Iteration 3: Cluster design part 2 — group 035 + 047-052 (executor/CLI-hardening tree) and 053-056 (review/rollback tree), assign final grandparent names + numbering scheme, and complete the full reference-surface inventory for the migration plan.
