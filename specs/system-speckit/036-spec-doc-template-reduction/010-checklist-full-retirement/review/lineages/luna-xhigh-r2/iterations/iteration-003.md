# Iteration 3: Traceability — packet closure, catalog parity, and generated status

## Dispatcher
- Executor binding: `cli-pi` / `gpt-5.6-luna` / xhigh.
- Resolved route: `mode=review target_agent=deep-review`.
- Read state before analysis: two completed dimensions, active F001-F004, next focus traceability.
- Budget profile: verify; direct packet/source comparisons and bounded exact searches.
- No repository validation, repair, build, memory-save, graph, or git-write command was run.

## Dimension
Traceability. This pass executes the core `spec_code` and `checklist_evidence` checks and the applicable feature-catalog overlay against the packet's claimed closure state.

## Files Reviewed
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/spec.md:53-86,126-143`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/plan.md:49-86`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:105-214`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/acceptance-criteria.md:50-92`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/implementation-summary.md:15-78`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/graph-metadata.json:35-45`
- `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1260-1320`
- `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:1-20`
- `.opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md:705-718,5060-5068`
- `.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh:729-744`
- `.opencode/skills/system-spec-kit/scripts/tests/check-ac-coverage.sh:135-211`

## Findings by Severity

### P0 Findings
- None. The traceability failures block a truthful PASS but do not establish destructive data loss, auth bypass, or immediate privileged compromise.

### P1 Findings

1. **A required P1 verification item is unchecked while the packet claims complete closure** — `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:116-119,163-164,200-208` — the local protocol says a P1 item must be complete or user-approved, CHK-FIX-006 is explicitly `[ ]` and marked `DEFERRED`, and the summary reports `P1 Items | 0 | 0/0` with `Verification Date: Not yet`. The same packet says `Status: Complete` (`spec.md:55-62`, `implementation-summary.md:27-33`) and `Closeable: Yes` (`acceptance-criteria.md:90-92`). No approval or decision record is named. This is a hard checklist-evidence contradiction.

   - Finding class: `matrix/evidence`
   - Scope proof: The protocol, unchecked item, summary, metadata status, acceptance closure, and implementation summary were reread together; no packet-local approval or exception was found.
   - Affected surface hints: `["tasks.md verification protocol", "CHK-FIX-006", "verification summary", "acceptance-criteria closure", "implementation-summary status"]`
   - Claim-adjudication packet:

```json
{
  "findingId": "F005",
  "claim": "The packet cannot truthfully claim complete closure while CHK-FIX-006 remains an unchecked P1 item because its own protocol requires completion or user approval.",
  "evidenceRefs": [
    "specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:116-119",
    "specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:163-164",
    "specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:200-208",
    "specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/acceptance-criteria.md:90-92"
  ],
  "counterevidenceSought": "Compared the P1 completion protocol, CHK-FIX-006, the verification summary, acceptance closure, spec status, implementation-summary status, and packet decision-record availability; no approval or exception was found.",
  "alternativeExplanation": "The deferred environment variant may be considered low risk and implicitly accepted by the implementation summary, but the packet's protocol requires an explicit approval for a deferred P1 and no such approval is recorded.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "A checked CHK-FIX-006 with evidence, a recorded user approval/decision record, or an explicit protocol amendment that governs this deferral."
}
```

2. **The feature catalog still documents the retired checklist as a live indexed spec document** — `.opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md:705-718,5060-5068` — the catalog says canonical scans discover `checklist.md`, creates causal edges through `tasks -> checklist`, and exposes `SPECKIT_INDEX_SPEC_DOCS` as covering checklist files. The current classifier's canonical filename set excludes `checklist.md` (`.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:8-20`), and the packet's stated purpose is to remove all read paths (`spec.md:126-143`). The catalog is therefore materially stale on the capability the retirement claims to remove.

   - Finding class: `class-of-bug`
   - Scope proof: The feature-catalog statements and the current executable filename allowlist were directly compared; both the scanner description and flag entry independently retain the retired filename.
   - Affected surface hints: `["feature-catalog canonical document list", "SPECKIT_INDEX_SPEC_DOCS entry", "spec-doc-paths.ts filename allowlist", "memory index documentation"]`
   - Claim-adjudication packet:

```json
{
  "findingId": "F006",
  "claim": "The feature catalog documents checklist.md as a live indexed spec document after the executable spec-document classifier removed it.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md:705-718",
    ".opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md:5060-5068",
    ".opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:8-20"
  ],
  "counterevidenceSought": "Read both independent catalog descriptions and the current SPEC_DOCUMENT_FILENAMES allowlist; no generated-section marker or retirement exception explains the checklist entries.",
  "alternativeExplanation": "The catalog may intentionally preserve historical behavior for old packets, but it uses present-tense scanner and flag descriptions and does not label checklist.md as historical or retired.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "The catalog entries are removed or explicitly marked historical with the current acceptance-criteria/tasks-only behavior documented and checked."
}
```

3. **Generated metadata reports this packet as `in_progress` while canonical packet documents report `Complete`** — `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/graph-metadata.json:42`; `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/spec.md:55-62`; `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/implementation-summary.md:27-33` — the graph metadata is current-generation (`graph-metadata.json:223-224`) but its derived status is `in_progress`. The derivation code treats the merged verification slice as authoritative and returns `in_progress` when any checkbox is open (`graph-metadata-parser.ts:1289-1307`). Because CHK-FIX-006 is open, graph/index consumers can correctly surface the packet as incomplete even though the packet's canonical status and acceptance closure say complete. This is a cross-document completion contract failure, not merely a stale line citation.

   - Finding class: `cross-consumer`
   - Scope proof: The packet status fields, generated status, current fingerprint generation, and deriveStatus branch were directly compared; the disagreement is reproducible from retained content without relying on inference.
   - Affected surface hints: `["graph-metadata.json derived.status", "deriveStatus", "tasks.md open P1 item", "spec.md status", "implementation-summary status"]`
   - Claim-adjudication packet:

```json
{
  "findingId": "F007",
  "claim": "The packet's generated graph metadata and canonical closure documents disagree: deriveStatus produces in_progress because an open verification item remains, while spec.md and implementation-summary.md claim Complete.",
  "evidenceRefs": [
    "specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/graph-metadata.json:42",
    "specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/spec.md:55-62",
    "specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/implementation-summary.md:27-33",
    ".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1289-1307"
  ],
  "counterevidenceSought": "Reread the generated status, canonical status tables, current-generation marker, merged-verification extraction, and completion evaluator; no status override or exclusion for CHK-FIX-006 was found.",
  "alternativeExplanation": "The graph metadata may simply predate the final closure edit, but its source fingerprint generation is current and no packet-local note says the derived status is intentionally stale.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Regenerate metadata after reconciling CHK-FIX-006 and prove graph-derived status matches the packet's final closure state."
}
```

### P2 Findings

1. **AC-001 and T004 retain a stale producer line citation** — `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/acceptance-criteria.md:58`; `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:66` — both cite `upgrade-level.sh:632`, while the current Level 1-to-Level 2 creation block is at `.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh:729-744`. The producer behavior is present; the evidence pointer is not maintainable.

   - Finding class: `instance-only`
   - Scope proof: The packet citations and current producer block were directly reread; no second producer block at line 632 was found.
   - Affected surface hints: `["AC-001", "T004", "upgrade-level.sh producer block"]`

## Traceability Checks
- `spec_code`: partial — producer and core contract align, but feature-catalog documentation and generated status disagree with the claimed final state.
- `checklist_evidence`: fail — CHK-FIX-006 is an unchecked P1 without the approval required by the packet protocol; the summary simultaneously reports zero P1 items.
- `feature_catalog_code`: fail (advisory overlay) — two present-tense catalog descriptions retain checklist indexing after the executable allowlist removed it.
- `playbook_capability`: notApplicable — no packet-local playbook scenario or executable playbook claim was named for this retirement.
- `resource-map.md`: absent at initialization; coverage gate skipped.

## Integration Evidence
- Packet closure: `tasks.md:116-119,163-164,200-208`, `acceptance-criteria.md:90-92`, and `implementation-summary.md:27-33` were compared.
- Generated completion: `graph-metadata.json:42,223-224` was compared with `graph-metadata-parser.ts:1289-1307`.
- Catalog/runtime parity: `feature-catalog.md:705-718,5060-5068` was compared with `spec-doc-paths.ts:8-20`.
- Producer citation: `acceptance-criteria.md:58` and `tasks.md:66` were compared with `upgrade-level.sh:729-744`.
- Core evidence rule: `check-ac-coverage.sh:135-211` was reread; no live test was run under the write-surface restriction.

## Edge Cases
- The feature catalog is documentation, but its present-tense scanner and flag descriptions are operational guidance and therefore belong to the applicable feature-catalog overlay.
- F005 and F007 share the open CHK-FIX-006 cause but expose different contract failures: one is the packet's hard closure protocol and the other is the generated metadata status consumed by index/graph paths.
- The stale line citation is P2 because it does not change producer behavior or the closure decision.
- `decision-record.md` is absent from this packet; all acceptance rows are marked Met, so no waiver is authorized by the acceptance preamble.
- Code graph and semantic memory were unavailable. Direct packet/source reads supplied the fallback evidence.

## Confirmed-Clean Surfaces
- Current acceptance-criteria and tasks-only producer behavior remains visible in `upgrade-level.sh:729-744` and `check-ac-coverage.sh:135-211`.
- The current source-document filename allowlist excludes `checklist.md`.
- No P0 candidate was found in this traceability pass.

## Ruled Out
- A valid packet-local approval for CHK-FIX-006: not found in the packet's decision or implementation documents.
- A current runtime checklist filename entry: ruled out by `spec-doc-paths.ts:8-20`; the catalog entry is the stale side.
- A graph metadata generation mismatch as the sole explanation: `source_fingerprint_docset: 3` is current, and the status disagreement follows the open verification item.
- A producer defect at the cited line: the live creation block exists at `upgrade-level.sh:729-744`; only the packet citation is stale.

## Next Focus
- dimension: maintainability
- focus area: documentation drift, test fixture upkeep, explanatory comments, and safe follow-on change cost after the retirement
- reason: all three required source/traceability dimensions have been exercised; the hard max-iterations policy requires one final broadened pass
- rotation status: correctness, security, and traceability complete
- blocked/productive carry-forward: retain F001-F008; do not retry fixed fingerprint-marker or static-scan hypotheses
- required evidence: current docs/tests/comments and exact downstream maintenance surfaces
- recovery note: convergence remains telemetry only; dispatch the fourth pass regardless of low-yield signals

## Verdict
- New findings: P0=0, P1=3, P2=1.
- Cumulative active findings: P0=0, P1=6, P2=2.
- New findings ratio: 1.0.
- Provisional iteration verdict: CONDITIONAL.

Review verdict: CONDITIONAL
