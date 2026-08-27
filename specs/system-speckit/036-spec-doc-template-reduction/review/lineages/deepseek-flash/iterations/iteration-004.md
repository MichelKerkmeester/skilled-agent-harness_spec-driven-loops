# Iteration 004: D3 Traceability — spec_code Protocol Sweep (002-006 claims vs shipped surfaces)

## Focus
Execute the core spec_code protocol: verify every normative claim and key_file reference in specs 002-006 against the shipped templates/scripts/mcp-server tree.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 20 (templates/manifest/{tasks,checklist,decision-record,research}.md.tmpl + spec-kit-docs.json, mcp-server/lib/validation/{orchestrator,spec-doc-structure}.ts, mcp-server/lib/resume/resume-ladder.ts, mcp-server/dist/lib/resume/resume-ladder.js.map, scripts/rules/{check-ac-coverage,check-template-headers}.sh, scripts/memory/generate-context.ts, scripts/tests/scaffold-golden-snapshots.vitest.ts + .snap)
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.20

## Findings

### P1, Required
- **F017**: 003 spec's core premise "decision-record L3≡L3+ 138 identical lines" contradicts the shipped template, `.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:1-167`, [Description: the shipped template already shares one ADR skeleton inside the `level:3,3+` gate (anchors adr-001..adr-001-impl, lines 61-167); the only duplication is the ~24-line frontmatter pair (lines 1-29 vs 31-59 differ only in the IF gate, title tag, packet_pointer, and recent_action). The spec's problem statement (003 spec.md:85, 32) — "duplicates its entire ADR skeleton — 138 byte-identical lines" — is not true of the current file, so REQ-001's empty-diff dedup targets work that is already done. The genuinely broken bit is the L3+ frontmatter description: `not "A decision was required..." -->` (line 4) — garbled, same family as F009.] (dimension: traceability — spec_code fail)

### P2, Suggestion
- **F016**: 004 spec's key_files points to a wrong resume-ladder path, `004-continuity-single-source/spec.md:22`, [Description: the spec lists `mcp-server/lib/graph/resume-ladder.ts`, but the source lives at `mcp-server/lib/resume/resume-ladder.ts` (confirmed via lib tree and dist source map); `lib/graph/resume-ladder.ts` does not exist. The resume-ladder itself exists and is the correct conceptual reference — the path is wrong.] (dimension: traceability)

## Verified Claims (spec_code pass — recorded evidence)
| Claim (spec) | Shipped evidence | Verdict |
|--------------|------------------|---------|
| 002: files-to-change all exist | tasks.md.tmpl, checklist.md.tmpl, spec-kit-docs.json, graph-metadata-parser.ts, orchestrator.ts, check-ac-coverage.sh, snapshot file — all present | pass |
| 002: check-anchors has second code path (pairing/order ~100-172) | check-anchors.sh:106-168 duplicate/unclosed/orphaned-anchor loop | pass |
| 002: detectLevel ~157-171 | orchestrator.ts:150 `detectLevel` | pass |
| 002: PRIORITY_TAGS ~550-561 | orchestrator.ts:550-561 `validatePriorityTags` (exact) | pass |
| 002: check-ac-coverage bindings ~54,57,198-200 | check-ac-coverage.sh:54,57,198-200 (exact); :57 returns 1 silently when no checklist → advisory gate dark (matches 002 risk table) | pass |
| 004: FRONTMATTER_MEMORY_BLOCK + SESSION_LINEAGE | spec-doc-structure.ts:12,101,109-118 (SESSION_LINEAGE_BROKEN), :779-789 packet-wide session-id scan | pass |
| 005: SELF-CHECK/FAILURE-MODES have no code consumer | grep across scripts/ + mcp-server/ (non-dist and dist) returns zero | pass |
| 003: research.md.tmpl is 948 lines | wc -l = 948 (exact) | pass |
| 006: validate.sh + golden-snapshot harness exist | validate.sh, scaffold-golden-snapshots.vitest.ts + .snap present | pass |
| 003: decision-record L3≡L3+ 138 identical skeleton lines | skeleton shared (tmpl:61-167); only ~24 frontmatter lines duplicated | FAIL (F017) |
| 004: resume-ladder at mcp-server/lib/graph/ | actual source at mcp-server/lib/resume/resume-ladder.ts | FAIL (F016) |

## Claim Adjudication Packets (new P0/P1)

```json
{
  "findingId": "F017",
  "claim": "The 003 spec's problem statement that decision-record.md.tmpl duplicates its entire ADR skeleton as 138 byte-identical lines is contradicted by the shipped template, which shares one skeleton and duplicates only frontmatter.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:1-29",
    ".opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:31-59",
    ".opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl:61-167",
    "specs/system-speckit/036-spec-doc-template-reduction/003-template-dedup/spec.md:32",
    "specs/system-speckit/036-spec-doc-template-reduction/003-template-dedup/spec.md:85"
  ],
  "counterevidenceSought": "Diffed the L3 block (lines 1-29) against the L3+ block (lines 31-59): 5 differing lines (IF gate, title, description, packet_pointer, recent_action), rest identical; the ADR anchor skeleton sits entirely inside the shared level:3,3+ gate.",
  "alternativeExplanation": "The 138-line duplication may have existed before packet 033's renderer refactor and the file may have been partially deduped since the spec was written. Either way the shipped state contradicts the spec's premise, which is what spec_code audits.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If the rendered output for L3 and L3+ (post-render, not the tmpl source) is verified to still contain 138 duplicated lines via golden snapshots, downgrade to P2 with the premise restored as render-level.",
  "transitions": [{ "iteration": 4, "from": null, "to": "P1", "reason": "Initial discovery during spec_code sweep" }]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | 9 claims pass, 2 fail (F016, F017) | F017 is a hard-gate failure: normative claim contradicts shipped template |
| checklist_evidence | notApplicable | hard | No checklist.md in any child folder | 002-006 specs carry **Given** acceptance criteria, not checkboxes; no checklist claims to evidence |
| feature_catalog_code | pending | advisory | — | Deferred to iteration 9 |
| playbook_capability | pending | advisory | — | Deferred to iteration 9 |

## Assessment
- New findings ratio: 0.20
- Dimensions addressed: traceability (spec_code core)
- Novelty justification: F016/F017 are the first file-level failures found in the claim sweep; all other 002-006 claims verified

## Ruled Out
- "resume-ladder.ts missing entirely": dist artifacts + source at lib/resume/resume-ladder.ts — module exists; only the spec's path is wrong.
- "SELF-CHECK consumed by tooling": grep empty — the 005 spec's answered question is confirmed.

## Dead Ends
- check-template-headers.sh exists (002's alternative-path mention): no divergence found at existence level; behavioral verification out of scope without running tooling.

## Recommended Next Focus
- Dimension: traceability (checklist_evidence + cross-doc consistency)
- Focus area: plan.md-vs-spec.md pairing (authored spec vs scaffold plan — F001 impact), tasks.md vs spec REQ ids, graph-metadata.json/description.json consistency, parent phase-map vs child reality (F004), _memory block consistency across docs (F002 SESSION_LINEAGE consumer now confirmed at spec-doc-structure.ts:779-789).

## Review verdict: CONDITIONAL
