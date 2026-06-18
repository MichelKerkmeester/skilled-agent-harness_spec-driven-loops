# Deep Review Report — 027/022 provenance injection

**Target:** `lib/storage/write-provenance.ts` + provenance tagging threaded through the memory write path.
**Method:** 3 narrow-lens seats (cli-opencode gpt-5.5-fast, xhigh) → Fable 5 adversarial verify (timed out at 900s on the 16-file scope) → orchestrator adjudication → gpt-5.5-xhigh remediation → re-verification → commit.

## Seat coverage (3 iterations)

| Seat | Lens | Raw outcome |
|------|------|-------------|
| 1 | Provenance-default safety + guard wiring | 3× P0 (default-human reachable on memory_update / reindex-retire / auto-promotion) + 1× P1 (PE reinforce) + 2 ruled_out |
| 2 | Refactor integrity | 1× P1 (governed-ingest regression) + 1× P2 (chunk pre-swap tag) + 3 ruled_out (create-record logic preserved, memory_update guard intact, save status shapes preserved) |
| 3 | Read-path + tests + scope | 1× P1 (PE update loses provenance) + 1× P1 (022 docs missing) + 1× P2 (unrelated ENV row) + 2 ruled_out (search ranking unchanged, guard test strengthened-not-weakened) |

Fable's comprehensive verify timed out (the 16-file scope exceeded the 900s budget), so adjudication was done by the orchestrator from the seat evidence.

## Adjudication + remediation

- **Governed-ingest regression (seat 2 P1) — CONFIRMED, this change introduced it. FIXED.** Injecting default scan/ingest provenance into the `validateGovernedIngest` input made `requiresGovernedIngest` true (it triggers on any provenance string), so `memory_index_scan({specFolder})` / `memory_ingest_start({paths})` failed demanding tenant/session scope. Fix: governance is now gated on `requiresGovernedIngest(args)` over the original caller args, and provenance is threaded as a separate `WriteProvenanceContext` to the persist site — scan/ingest stay ungoverned while rows are still tagged.
- **PE update/reinforce lose provenance (seat 3 P1 + seat 1 P1) — CONFIRMED. FIXED.** The caller `writeProvenance` is now threaded through `evaluateAndApplyPeDecision` into both the PE update and PE reinforce mutation paths, so those automated mutations tag the row with the real caller provenance instead of defaulting to human.
- **memory_update default-human (seat 1 P0 #1) — NOT REACHABLE / no change.** No automated caller invokes `memory_update` bare; reducers use the save/storage paths. The human-facing default-human is correct for that surface. Documented.
- **Reindex-retire + auto-promotion lack a source_kind ingress guard (seat 1 P0 #2, #3) — PRE-EXISTING guard-coverage gaps, documented as P0 follow-ons.** The same-path reindex retire (`lineage-state.ts retirePredecessorForActiveReindex`) and feedback auto-promotion (`auto-promotion.ts`) can change protected manual fields without a `source_kind` check. These predate this phase; extending the constitutional ingress guard to them is a separate guard-enforcement phase, and the provenance tagging this phase ships is its prerequisite. Recorded in `spec.md` / `implementation-summary.md` Known Limitations.
- **Chunk pre-swap provenance tag (seat 2 P2) — accepted/noted.** A retained existing parent can be re-tagged before a re-chunk safe-swap succeeds; metadata-only, no row duplication.
- **ENV_REFERENCE row (seat 3 P2) — excluded.** The `SPECKIT_ADVISOR_DOC_TRIGGERS` row is a concurrent session's unrelated change; left untouched and out of this commit.
- **022 docs missing (seat 3 P1) — FIXED.** Authored spec/plan/tasks/checklist/implementation-summary with real content.
- **Ruled_out (confirmed safe):** the −107 create-record refactor preserved all identity/dedup/lineage/error logic; the memory_update constitutional guard is intact and its test was *strengthened*; the publication-gate read annotation does not change search ranking/membership; provenance persistence is schema-guarded (no crash when columns absent).

## Verification after remediation

- `tsc --noEmit`: 0. Guard/provenance suite + affected (8 files): 78 pass. Handler-memory-index/ingest + 3 new provenance tests (pe-gating-provenance, pe-orchestration-provenance, write-provenance): pass (pre-existing conditional skips). `validate.sh --strict` (022): 0/0. Comment hygiene: clean. ENV_REFERENCE.md not touched.

**Disposition:** 022 review complete. Scope = provenance TAGGING of automated writers so the existing trust/overwrite guard + publication gate can use it. The change's own regression (governed-ingest) and gaps (PE provenance, missing docs) are fixed; two pre-existing guard-coverage gaps are documented as P0 follow-ons (this phase's tagging is their prerequisite).
