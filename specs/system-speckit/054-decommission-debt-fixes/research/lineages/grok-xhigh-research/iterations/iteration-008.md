# Iteration 8: Successor coverage versus the retired memory surface

## Focus
Angle 6. What the trigger index, ripgrep lane and continuity writer do not cover that the retired memory surface did, and which leftover readers still pretend they do.

## Findings

### F-I8-001 — Startup priming has no successor. CONFIRMED. P1
The retired structural index used to feed the SessionStart brief and a cached session summary. The live handler says that index is gone and the fallback surface is the only surface left. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:141-142]
The continuity writer writes packet docs. It is not called from `handleStartup()`. Resume still points at `/speckit:resume`. A new session gets four lines of generic text, not the last packet.
This is the largest successor gap on the restored session-lifecycle path.
Smallest fix: either document the gap in the session-lifecycle README (F-I4-004) or have startup read `handover.md` / lastSpecFolder from hook-state the way resume already does.

### F-I8-002 — `session_learning` folder detection has no writer successor. CONFIRMED. P1
Priority 2.5 still reads the retired table (F-I5-002). The continuity writer does not insert `session_learning`. Hook-state `lastSpecFolder` is the live analog, used by resume, not by folder-detector.
Smallest fix: delete Priority 2.5, or retarget it at hook-state.

### F-I8-003 — Trigger index plus ripgrep do not replace body-level recall, and the doctor still grades them against sqlite. CONFIRMED. P1
The declared-loss table lists semantic paraphrase, vector/BM25 fusion, decay, access tracking, session-search dedup, causal graph and checkpoints as gone, with no replacement. [SOURCE: .opencode/skills/system-spec-kit/references/memory/memory-system.md:211-220]
That table is honest. The miss is the harness: `parity-check.mjs` and `/doctor memory` still require `parity_unexplained_differences: 0` against a frozen three-arm baseline whose first arm queries `memory_index`. [SOURCE: .opencode/commands/doctor/assets/doctor-memory.yaml:36-42] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs:8-12]
A green doctor run can mean "legacy sqlite still agrees with the index", which is not a successor proof.
Smallest fix: drop the legacy arm from the doctor pass policy.

### F-I8-004 — The capability-loss table says nothing fingerprints a session; continuity still does. CONFIRMED. P2
The table: "Session deduplication | Gone. Nothing fingerprints a session or suppresses a repeat". [SOURCE: .opencode/skills/system-spec-kit/references/memory/memory-system.md:217]
`thin-continuity-record.ts` still stores `session_dedup.fingerprint` / `session_id`. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:38] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:837-841]
`continuity-freshness.ts` reads that fingerprint to decide completion freshness. [SOURCE: .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:116-125]
Two different "session dedup" ideas. Search-result suppression is gone. Continuity fingerprinting is not. The table overstates the loss and hides the remaining gate.
Smallest fix: split the row: search-result dedup gone; continuity fingerprint remains.

### F-I8-005 — `/memory:search` does not search arbitrary code, and that is documented. CONFIRMED. P2 (negative)
AGENTS.md and the search command both say retrieval is lexical over spec docs and skill docs. [SOURCE: AGENTS.md:330] [SOURCE: .opencode/commands/memory/search.md:2]
That is a declared loss, not an accidental miss. Do not treat "cannot search src/" as decommission residue.

## Sources Consulted
- .opencode/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:141-142
- .opencode/skills/system-spec-kit/references/memory/memory-system.md:211-220
- .opencode/commands/doctor/assets/doctor-memory.yaml:36-42
- .opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs:8-12
- .opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:38,837-841
- .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:116-125
- AGENTS.md:330

## Assessment
- newInfoRatio: 0.50
- Novelty justification: startup-has-no-successor and doctor-still-grades-sqlite are the new synthesis. session_learning restated. Dedup-table overstatement is new. Code-search limit ruled out.
- Confidence: high.

## Reflection
- Worked: read the declared-loss table against the actual continuity schema.
- Failed: generate-context.ts has no `session_dedup` string; the field is assembled in `thin-continuity-record.ts`.
- Ruled out: treating "no code search" as a miss.

## Dead Ends
- generate-context.ts `session_dedup` grep (no hit; writer is elsewhere).

## Recommended Next Focus
Angle 7. Gates that can pass while lying: CONTINUITY_FRESHNESS skip-as-pass, validate.sh `--strict` vs warnings, generated-metadata grandfather, and the dist-freshness warning path.
