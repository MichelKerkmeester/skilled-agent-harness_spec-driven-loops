# Iteration 16: Continuity and resume authority

## Focus

Compare packet-local handover parsing, `_memory.continuity` validation, the
continuity freshness gate, and the resume ladder. The question is whether the
successor continuity surfaces agree on which state is valid and current after the
retired memory surface was removed.

## Findings

1. **LUNA-054 — Resume freshness-ranks an unbound handover document over validated continuity. P1. CONFIRMED source-contract gap; cross-packet or stale-resume impact is INFERRED.** The handover parser accepts summary/action text and chooses a timestamp from several aliases or the file mtime, but it does not parse a packet pointer or compare a stored fingerprint to the current packet. When both sources exist, the resume ladder selects whichever timestamp is newer and returns it as `freshnessWinner`; the result carries the handover document fingerprint only as descriptive metadata. The freshness validator, meanwhile, reads the continuity timestamp from `implementation-summary.md` and compares it with `graph-metadata.json`; it does not validate a handover timestamp against the graph. A newer handover can therefore outrank a valid continuity record without passing the same packet/freshness checks. Smallest fix: require handover packet identity plus a content fingerprint, validate both against the resolved packet and graph metadata, and freshness-rank only validated signals. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:577-619] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:1000-1063] [SOURCE: .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:350-365,389-435] [INFERENCE: a newer unbound or stale handover could steer resume actions away from the current continuity state; no adversarial handover was created]

2. **LUNA-055 — Resume consumes malformed thin continuity through a permissive fallback. P2. CONFIRMED validation/resume inconsistency; unsafe-context impact is INFERRED.** `readThinContinuityRecord` returns `ok: false` for any normalized-field error and for a continuity block that still exceeds the 2048-byte budget after compaction. `parseContinuitySignal` then ignores that failure and manually extracts only five required fields from the raw continuity block; if those fields exist, it returns a usable continuity signal anyway. Thus the writer/validator can reject an oversized or otherwise malformed successor record while resume still treats it as authoritative context. Smallest fix: make the fallback explicit legacy-only behavior (with a legacy marker and warning), or return no continuity signal whenever strict validation fails. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:977-1005,1008-1026] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:622-669] [INFERENCE: a rejected record with intact required fields can still influence resumed work; this pass did not synthesize a malformed packet]

## Ruled Out

- The access-telemetry store is not classified as a reintroduced memory database: its source describes a JSON file next to the runtime database, uses atomic temp-file replacement, and fails closed on write errors. The finding frontier is the resume/freshness contract, not the existence of this successor store. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/graph/access-telemetry.ts:4-9,28-44,59-69]
- The 2048-byte limit itself is intentional and enforced during normalized serialization; the finding is that the resume fallback bypasses that enforcement, not that the limit should be removed. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:977-996]

## Dead Ends

- No new package/dependency finding was promoted from this angle; the inspected paths use existing runtime/shared imports and the issue is contract validation.

## Edge Cases

- A handover file may intentionally be a human-authored short-form artifact. That does not remove the need to bind it to the resolved packet before allowing it to win freshness; the smallest fix can preserve the short form while adding machine-readable identity.
- The resume fallback may be needed during a migration window. If retained, the caller needs an explicit legacy marker and a visible non-authoritative status rather than silently returning a normal continuity signal.

## Questions Remaining

- Q7 gains a confirmed disagreement between freshness validation and resume source selection.
- Q1 and Q6 remain open for additional live retired-surface residue and successor coverage.
- Q2-Q5 remain open for registrations, dependencies, tests, and documentation drift.

## Sources Consulted

- [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:577-619,622-669,1000-1063]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:291-347,350-485]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:977-1026]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/graph/access-telemetry.ts:4-9,28-69]

## Assessment

- New information ratio: 0.86
- Questions addressed: Q7
- Questions answered: Q7 = expanded (resume and freshness authorities diverge)
- Confidence: high for the code-contract findings; medium for operational impact because no malformed or foreign handover was introduced

## Reflection

- What worked and why: tracing both source-selection branches and the validator's actual entry points exposed a seam that file-by-file documentation review would miss.
- What did not work and why: no runtime test was executed because this detached lineage is read/research-only and the requested write surface excludes repository tooling outputs.
- What I would do differently: inspect the gate and reducer handoffs next to see whether this same authority split can be hidden by a green workflow result.

## Recommended Next Focus

Angle 7: inspect validation, generated metadata, routing, and lineage gate implementations for fail-open or path-mismatch behavior that can report success over the decommission debt.
