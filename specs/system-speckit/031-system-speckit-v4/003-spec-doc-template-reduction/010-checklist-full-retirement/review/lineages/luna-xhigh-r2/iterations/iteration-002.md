---
title: "Iteration 2: Security — path, symlink, and repair boundaries"
trigger_phrases: []
---
# Iteration 2: Security — path, symlink, and repair boundaries

## Dispatcher
- Executor binding: `cli-pi` / `gpt-5.6-luna` / xhigh.
- Resolved route: `mode=review target_agent=deep-review`.
- Read state before analysis: iteration 1, active F001, next focus security.
- Budget profile: verify; focused source reads and counterevidence search.
- No repository tests, repair commands, graph commands, or git writes were run.

## Dimension
Security. This pass checks whether retirement-adjacent resume, generated-metadata, fingerprint, and repair paths prove filesystem membership and preserve integrity under symlink and marker edge cases.

## Files Reviewed
- `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:853-918`
- `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:971-1050`
- `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:70-112`
- `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1700-1770`
- `.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:155-181`
- `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-schema.ts:76-96`
- `.opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs:107-135,346-360`
- `.opencode/skills/system-spec-kit/scripts/tests/fingerprint-docset-generation.sh:1-93`

## Findings by Severity

### P0 Findings
- None. The reviewed paths expose read/write integrity risks, but no confirmed authentication bypass, privileged execution, or destructive data loss was established.

### P1 Findings

1. **Resume resolution accepts an in-root symlink that redirects document reads outside the workspace** — `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:853-918,971-1050` — `resolveExistingFolder` compares `path.resolve` candidates with lexical `allowedRoots` and returns the unresolved folder path. `followPhaseParentRedirect` then appends child segments to that path, and `findSpecDocuments` plus `readStableMarkdownDocument` read from it. No `realpath` membership check is performed before the resumed packet documents are consumed. A symlink located under a supported specs root can therefore redirect resume reads to an external packet while still passing the lexical containment check.

   - Finding class: `cross-consumer`
   - Scope proof: Both explicit/fallback folder resolution and phase-child redirect paths were reread; both propagate lexical paths into the read path, and the stable reader checks file stability but not workspace-root membership.
   - Affected surface hints: `["resume ladder", "phase-parent redirect", "findSpecDocuments", "stable document reader", "workspace specs roots"]`
   - Claim-adjudication packet:

```json
{
  "findingId": "F002",
  "claim": "A symlink beneath a configured specs root can redirect resume reads outside the workspace because resume resolution proves only lexical containment.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:895-918",
    ".opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:971-1006",
    ".opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:540-559"
  ],
  "counterevidenceSought": "Read isPathWithinRoot, resolveExistingFolder, followPhaseParentRedirect, the post-resolution document lookup, and readStableMarkdownDocument; no realpath-root comparison or canonical recheck was found.",
  "alternativeExplanation": "The workspace may be trusted to contain only operator-controlled symlinks, but the resolver's allowed-root check is presented as a containment boundary and no such trust exception is documented in this path.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "If callers prove symlink creation is impossible for all supported workspace roots or a canonical realpath check is added before every resume read."
}
```

2. **Generated metadata write authorization can follow an in-root symlink to an external `specs` path** — `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1709-1737,1754-1767`; `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:78-88` — `writeGraphMetadataFile` canonicalizes the parent directory and classifies that canonical destination by the substring-based `isSpecsScopedPath` predicate, but the configured-root check is applied to the unresolved `resolvedFilePath`. A symlinked folder lexically beneath the configured root but canonically outside it can satisfy both checks when its external target contains a `/specs/` segment, so the atomic rename writes to the external canonical path. The same path-shape classifier does not prove workspace membership.

   - Finding class: `cross-consumer`
   - Scope proof: The classifier, canonical-parent construction, final root check, temp-file write, and rename were read together; the root check and canonical destination operate on different path identities.
   - Affected surface hints: `["isSpecsScopedPath", "writeGraphMetadataFile", "refreshGraphMetadataForSpecFolder", "atomic metadata rename", "configured specs roots"]`
   - Claim-adjudication packet:

```json
{
  "findingId": "F003",
  "claim": "Graph metadata writes can follow an in-root symlink to an external path containing a specs segment because final authorization checks the unresolved path lexically.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:78-88",
    ".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1709-1737",
    ".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1754-1767"
  ],
  "counterevidenceSought": "Read the path classifier, canonical parent resolution, unresolved configured-root check, and atomic write sequence; no canonical-root membership comparison was found at the final write boundary.",
  "alternativeExplanation": "All current callers may pass real in-root folders, but the exported writer and refresh function accept paths directly and the target retirement requirement explicitly treats symlink writes as a safety boundary.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "If a universal wrapper canonicalizes both the candidate destination and configured roots before authorization, with a regression test for an in-root symlink to an external `/specs/` target."
}
```

### P2 Findings

1. **Repair metadata writes have a scan-to-write replacement race** — `.opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs:107-135,346-360` — discovery records regular graph metadata files using `Dirent.isFile()`, but the later non-dry-run loop copies and writes each stored pathname without rechecking its type or canonical destination immediately before writing. A concurrent local replacement can change the path after scan and redirect the write. The race requires concurrent control of the maintenance workspace, so it remains advisory rather than P1.

   - Finding class: `instance-only`
   - Scope proof: The scan filter and later write loop were directly compared; no second `lstat`, no-follow open, or canonical destination revalidation occurs between them.
   - Affected surface hints: `["repair-graph-metadata scan", "repair write loop", "backup copy", "destination revalidation"]`

## Traceability Checks
- `spec_code`: partial — the packet claims deletions are confined to tracked in-repo paths, but linked runtime consumers still have symlink-sensitive boundaries.
- `checklist_evidence`: pending — dedicated packet evidence reconciliation is reserved for iteration 3.
- `feature_catalog_code`: pending — reserved for iteration 3.
- `playbook_capability`: pending — reserved for iteration 3.
- `resource-map.md`: absent at init; coverage gate skipped.

## Integration Evidence
- Resume consumer: `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:895-918` returns a lexically accepted folder path and `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:993-1049` reads documents from it.
- Path classifier and writer: `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:78-88` is shape-based; `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1709-1737` authorizes a canonical destination with an unresolved-path root check.
- Repair utility: `.opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs:107-135,346-360` separates scan from write without a final destination/type check.
- Fingerprint generation boundary: `.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:161-181` now skips only older/absent generations, and `.opencode/skills/system-spec-kit/scripts/tests/fingerprint-docset-generation.sh:63-78` pins current, old, absent, and future-marker behavior.

## Edge Cases
- An in-root symlink is the adversarial case for both F002 and F003; a lexical path test alone is insufficient evidence of containment.
- The current-generation fingerprint marker was reread as counterevidence to the earlier unknown-marker hypothesis; the equal and newer generation paths compare and the test includes generation 99.
- The P2 repair race is not a claim that ordinary single-process repair follows an existing symlink during discovery; static discovery filters directory entries by regular-file type.
- Code graph and semantic memory were unavailable. Direct source reads were used as the fallback ledger.

## Confirmed-Clean Surfaces
- `generated-metadata-integrity.ts:161-181` does not silently skip an integer future marker; it compares it like current generation.
- `fingerprint-docset-generation.sh:63-78` includes a regression case for an unrecognized future marker.
- No P0 candidate was confirmed after security boundary review.

## Ruled Out
- Unknown positive integer fingerprint generation silently disables drift detection: ruled out by `.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:170-181` and the future-marker fixture at `scripts/tests/fingerprint-docset-generation.sh:72-78`.
- Static repair discovery following an already-present symlink: ruled out by `.opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs:107-135`, which selects only `entry.isFile()` entries; the remaining issue is the later scan-to-write race.
- External absolute graph path without an in-root symlink: not reported as a separate finding because `writeGraphMetadataFile:1728-1737` rejects unresolved paths outside configured roots; F003 is limited to the symlink identity mismatch.

## Next Focus
- dimension: traceability
- focus area: reconcile requirements, acceptance criteria, task/checklist evidence, implementation summary, named tests, and remaining checklist references across live documentation
- reason: the packet claims Complete and all eight criteria Met; cross-document evidence must be checked independently after source-level passes
- rotation status: correctness and security complete
- blocked/productive carry-forward: retain F001-F003; do not retry fixed fingerprint-marker or static-scan hypotheses
- required evidence: direct packet lines, exact producer/consumer references, and active test/feature documentation surfaces
- recovery note: if traceability remains partial, prioritize the hard core protocols before advisory overlays

## Verdict
- New findings: P0=0, P1=2, P2=1.
- Cumulative active findings: P0=0, P1=3, P2=1.
- New findings ratio: 1.0.
- Provisional iteration verdict: CONDITIONAL.

Review verdict: CONDITIONAL
