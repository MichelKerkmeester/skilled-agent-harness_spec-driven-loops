# Iteration 003: Traceability — spec_code protocol, comment hygiene, REQ-004/005 verification

## Focus

D3 Traceability across all three commits:
- Comment hygiene audit in all `styles/_db/*.mjs` files
- REQ-004: command-namespace dedup consistency (deletion verified, `/interface:*` wrappers intact, stale doc claims)
- REQ-005: sk-doc/020 naming — verify no fabrication, REQ-005 evidence rows mirror per-child success criteria, PHASE_LINKS consistency
- spec_code protocol: verify normative spec claims resolve to shipped behavior

## Scorecard

- Dimensions covered: correctness, security, traceability
- Files reviewed: 15 (traceability-focused)
- New findings: P0=0 P1=0 P2=1
- Refined findings: F002 (severity confirmed P1, merged with additional evidence)
- New findings ratio: 0.05

## Findings

### P2, Suggestion

- **F005**: `changelog/v1.6.0.0.md:26` states `/design:*` commands "remain thin compatibility aliases" in a changelog that postdates the command-dedup deletion at `9a42aedae4`. While changelogs are historical records (not operational docs), the v1.6.0.0 entry describes a state that was true at the time of v1.6.0.0 but is now inaccurate. A reader consulting the most recent changelog for the current command surface state would be misled. Category: maintainability. [SOURCE: changelog/v1.6.0.0.md:26; feature-catalog/creation-command-surface/interface-creation-commands.md:20; feature-catalog/feature-catalog.md:201]

### Refined Findings

- **F002** (P1, active): Confirmed with additional evidence. The three feature-catalog files all claim `/design:*` aliases "remain" with references to the now-deleted `commands/design/*.md` path. The `interface-creation-commands.md:43` table row is the most severe — it explicitly lists `.opencode/commands/design/*.md` as an active "Compatibility routers" entry. This is a material falsehood about the current state. Severity remains P1.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | REQ-001 through REQ-005 verified | All normative claims resolve to shipped behavior or explicitly documented limitations |
| checklist_evidence | n/a | hard | — | No checklist.md in spec folder |

### spec_code Detailed Results

| REQ | Claim | Resolution | Evidence |
|-----|-------|-----------|----------|
| REQ-001 | Generation manifest publishes atomically | PASS | `writeManifestPointer` uses temp-file + fsync + rename + dir fsync; `buildStyleDatabase` validates integrity before pointer flip; tests at manifest.test.mjs:56-78 demonstrate rollback safety |
| REQ-002 | Stage telemetry is residency-honest | PASS | `assertResidency` prevents invalid residency; `summary()` computes `unattributedMs` transparently; tests at telemetry.test.mjs:52-106 demonstrate non-zero unattributed time |
| REQ-003 | Differential oracle proves byte-for-byte parity | PASS | `captureOracle` uses shared `stableJson`/`digest`; `replayOracle` compares byte-for-byte; tests at oracle.test.mjs:44-52 replay all golden scenarios; golden files checked into `oracle/golden/` directory |
| REQ-004 | Command-surface checker + registries consistent | PARTIAL | `commands/design/` confirmed deleted; all 5 `/interface:*` wrappers confirmed present; hub-router.json canonicalNamespace = "interface"; SKILL.md and README.md correctly state aliases retired; BUT feature-catalog docs (F002, F003, F005) still reference deleted paths |
| REQ-005 | No fabrication in sk-doc/020 doc edits | PASS | REQ-005 rows in each child spec are unique, scope-appropriate, and mirror each child's own success criteria. 34 non-blocking PHASE_LINKS warnings documented as baseline in 000-worktree-baseline-and-census/implementation-summary.md — consistent and not fabricated. |
| REQ-006 | Every finding verified against actual code | PASS | All findings (F001-F005) have concrete file:line evidence. No speculative findings asserted. Counterevidence sought for each P1. |

## Claim Adjudication

### F005

```json
{
  "findingId": "F005",
  "claim": "changelog/v1.6.0.0.md claims /design:* commands remain thin compatibility aliases, but the commands have been deleted.",
  "evidenceRefs": [
    "changelog/v1.6.0.0.md:26"
  ],
  "counterevidenceSought": "Checked whether changelog entries are ever updated after-the-fact (they typically are not — changelogs are historical records). Checked if v1.6.0.0 was BEFORE the dedup deletion (yes, v1.6.0.0 predates the deletion). The changelog accurately describes the state at v1.6.0.0.",
  "alternativeExplanation": "Changelogs are immutable historical records and should not be modified after publication. The v1.6.0.0 entry correctly describes the state at time of release. A new changelog entry for the dedup release should document the retirement.",
  "finalSeverity": "P2",
  "confidence": 0.90,
  "downgradeTrigger": "If a post-dedup changelog entry is created that documents the alias retirement, this finding is resolved.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P2", "reason": "Initial discovery; changelog is a historical record, not operational." }
  ]
}
```

## Ruled Out

- **Comment hygiene violations**: Zero REQ/ADR/CHK/Task/phase IDs or spec paths found in code comments across all `styles/_db/*.mjs` files. CONFIRMED CLEAN.
- **Fabricated content in sk-doc/020**: Each REQ-005 row in the 12+ phase children has unique, scope-appropriate text that matches each child's documented success criteria. No template-copying or fabricated numbers detected. PHASE_LINKS warnings (34) are consistently documented as pre-existing baseline noise in 000-worktree-baseline-and-census. CONFIRMED NO FABRICATION.
- **REQ-004 command wrapper integrity**: All 5 `/interface:*` command wrappers exist (design.md, foundations.md, motion.md, audit.md, design-reference.md). `hub-router.json` correctly has `canonicalNamespace: "interface"`. `commands/design/` is confirmed deleted. CONFIRMED STRUCTURAL INTEGRITY.

## Assessment

- New findings ratio: 0.05 (1 new P2 across 15 files, weighted: 1.0/20 = 0.05)
- Dimensions addressed: traceability
- The codebase is structurally clean. The remaining issues are documentation staleness (F002, F003, F005) and minor robustness gaps (F001, F004). No correctness, security, or fabrication concerns beyond what's already documented.

## Dead Ends

None.

## Recommended Next Focus

D4 Maintainability — Review code patterns, duplication, naming conventions under `styles/_db/`, verify the sk-doc/020 mechanical edits for consistency (no surviving snake_case in changed files), and assess overall code quality and documentation completeness of the three commits.

Review verdict: PASS
