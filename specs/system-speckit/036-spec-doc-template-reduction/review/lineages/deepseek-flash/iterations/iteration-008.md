# Iteration 008: D3 — Continuity Save-Path Deep-Dive (generate-context behavior + 004 validator-first)

## Focus
Resolve the 002/004 shared open question ("Does a full generate-context.js save rewrite _memory blocks in multiple docs or only implementation-summary?") at code level; verify the 004 validator-first dependency claim.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 4 (scripts/memory/generate-context.ts [imports+entry], mcp-server/lib/continuity/authored-continuity-snapshot.ts, mcp-server/lib/continuity/thin-continuity-record.ts, mcp-server/lib/validation/spec-doc-structure.ts [re-check 779-789])
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.02

## Findings

### P2, Suggestion
- **F026**: Continuity save path updates handover.md + implementation-summary.md only — four _memory copies are never refreshed, and handover.md carries a second continuity surface, `mcp-server/lib/continuity/authored-continuity-snapshot.ts:195-220`, [Description: the snapshot writes (1) `handover.md` — created if missing, always updated with a recoveryContext section (lines 195-203) — and (2) `implementation-summary.md` — updated only if it exists (lines 205-220). spec.md/plan.md/tasks.md/checklist.md _memory blocks are never touched by saves, confirming the 004 premise that the four copies are static dead weight — but the canonicalization plan targets implementation-summary only and omits the handover.md continuity surface. Also 004's key_files lists only the CLI wrapper `scripts/memory/generate-context.ts`; the write logic lives in `mcp-server/lib/continuity/{authored-continuity-snapshot,thin-continuity-record}.ts` (F016-class key_files gap).] (dimension: traceability)

## Open Question Resolution (002 spec.md:176 / 004 spec.md:162)
| Question | Code-level answer | Source |
|----------|-------------------|--------|
| Does generate-context.js rewrite _memory across multiple docs or only implementation-summary? | It rewrites implementation-summary.md (_memory block via thin-continuity-record) AND handover.md (continuity snapshot section, created if absent); the other four contract docs are never rewritten | authored-continuity-snapshot.ts:195-220 |
| Implication for 004 REQ-004 | The template change (drop 4 redundant copies) is SAFE for the save path — saves never expect them; the canonical block lives in implementation-summary, with handover.md as a secondary recovery surface that 004 should explicitly scope | — |

## Verified Claims
| Claim (004 spec) | Evidence | Verdict |
|------------------|----------|---------|
| FRONTMATTER_MEMORY_BLOCK validates the block in contract docs (dependency for validator-first sequencing) | spec-doc-structure.ts:12,101,109-118,1160-1161; SESSION_LINEAGE packet scan at :779-789 | pass — 004's ordering rationale (relax validators before dropping copies) is structurally sound |

## Claim Adjudication Packets (new P0/P1)
None — no new P0/P1 findings this iteration.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | 004 open question resolved at code level; FRONTMATTER_MEMORY_BLOCK dependency confirmed | F026 planning seed |

## Assessment
- New findings ratio: 0.02
- Dimensions addressed: traceability
- Novelty justification: F026 is the first code-level answer to the packet's shared open question; the handover.md surface was unmentioned in 004's scope

## Ruled Out
- "generate-context rewrites all five docs": disproven — only implementation-summary (if exists) and handover.md.

## Dead Ends
- Full generate-context.ts read: not needed — the write path is fully owned by authored-continuity-snapshot.ts (confirmed via imports + writeFileSync locations).

## Recommended Next Focus
- Dimension: correctness/traceability (broadening — overlay protocols + residual scope sweep)
- Focus area: feature_catalog_code + playbook_capability overlays (applicability to this spec-folder target), 001 research/ artifacts vs R1-R6 citations (F003 depth), 003 research.md.tmpl widget-taxonomy claim verification.

## Review verdict: CONDITIONAL
