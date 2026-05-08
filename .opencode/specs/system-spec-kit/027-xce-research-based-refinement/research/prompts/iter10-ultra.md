Deep-research iter 10/10 (FINAL SYNTHESIS) for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

READ FIRST: <packet>/spec.md (especially §6 Success Criteria, REQ-001 through REQ-011), all 9 prior iters: <packet>/research/iterations/iteration-001.md through iteration-009.md.

ITER 10 FOCUS: SYNTHESIS — NOT a new RQ. Consolidate all 9 prior iters into final deliverables.

WRITE 5 ARTIFACTS (last iter writes more than usual):

1. **<packet>/research/research.md** (final synthesis, ~12-17 sections per spec REQ-001):
   - Executive Summary (1 paragraph)
   - Per-RQ section (RQ1-RQ9), each citing iteration-NNN.md findings + ≥2 file:line refs (1 from external/, 1 from mcp_server/)
   - PRAT Reconstruction section (REQ-007)
   - Steering Pattern Transfer section (REQ-008)
   - Open Questions
   - References

2. **<packet>/research/findings.md** (adoption matrix per REQ-002):
   - Table with columns: Feature | Verdict (ADOPT/ADAPT/DEFER/SKIP) | Rationale (≥2 sentences) | Blast radius (file count + LOC) | Suggested sub-packet
   - Every XCE feature surfaced in external/README.md must appear
   - Explicit "Will NOT adopt" section listing the 9 SKIP items from iter-9

3. **<packet>/research/sub-packet-proposals.md** (1-4 sub-packets per REQ-003):
   - Each proposal: scope summary, level estimate (L1/L2/L3), dependencies, risk register, 2-bullet "out of scope" guard
   - Suggested packet IDs (e.g., 028-code-graph-hld-lld, 029-code-graph-trace, 030-code-graph-impact-analysis, 031-skill-advisor-first-action-mandate, 032-eval-harness)

4. **<packet>/research/resource-map.md** (path ledger per REQ-009):
   - Inputs (read-only paths used during research)
   - Outputs (created paths)
   - External references (URLs from external/README.md only)

5. **APPEND <packet>/research/deep-research-state.jsonl**: {"type":"iteration","iteration":10,"newInfoRatio":<0..1, likely low ~0.10-0.20 for synthesis>,"status":"complete","focus":"SYNTHESIS"}
   AND ALSO APPEND ONE line: {"type":"event","event":"converged","stopReason":"max_iterations_with_synthesis","run":10,"timestamp":"<now>"}

CRITICAL: APPEND ONLY to deep-research-state.jsonl — DO NOT OVERWRITE. Use `>> ` not `> ` in echo. Use Edit tool with append-mode if available.

CONSTRAINTS: LEAF, max 14 tool calls (last iter has higher cap), read-only against external/+mcp_server/, write only research/, file:line cites.

DELIVERABLES (per spec §6):
- SC-001: 30-min readability budget for the 3 main docs combined
- SC-002: every adoption verdict cites ≥1 file:line from external/ AND ≥1 from mcp_server/
- SC-003: sub-packet proposals concrete enough to scaffold via /spec_kit:plan
- SC-005: NO hallucinated XCE tool names, parameters, or behaviors
- Verdict diversity: ≥1 ADOPT + ≥1 DEFER + ≥1 SKIP (all already present from prior iters)
