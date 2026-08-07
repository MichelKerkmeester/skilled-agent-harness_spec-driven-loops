# Deep Research Strategy — Document Diff Skill Architecture

## 2. TOPIC
Research the architecture and v1 contract for the standalone local AI document diff skill.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

All questions resolved. See §6 Answered Questions for resolutions.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing the diff skill (research only)
- Evaluating cloud-based diff services
- Real-time collaborative diff
- Git integration (the tool must work without Git)
- Visual/PDF pixel-level diff in v1

---

## 5. STOP CONDITIONS
- 10 iterations completed (config.stopPolicy: max-iterations)
- convergenceThreshold is 0 — convergence is effectively disabled; run full iteration budget
- All 5 key questions answered with evidence-backed findings

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
All 5 key questions answered:
- [x] Q1: Adapter pattern with MDAST/HAST/mammoth, format tiers (Iteration 3)
- [x] Q2: jsdiff (Myers) + format-specific normalizers (Iteration 2)
- [x] Q3: Four-phase model, filesystem storage, SHA-256 hashes, TTL (Iteration 4)
- [x] Q4: diff2html + fidelity header, self-contained HTML (Iteration 5)
- [x] Q5: TypeScript/Node.js core + 5 CLI commands + OpenCode wrapper (Iteration 8)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Direct npm/GitHub source inspection: gave actionable library choices with version/license/usage data (Iterations 1-2)
- Format-tier classification: clear separation of full/limited/unsupported avoids scope creep (Iteration 3)
- Adapter pattern: clean separation of parse/normalize/diff concerns (Iteration 3)
- Filesystem snapshots: transparent, debuggable, zero-dependency (Iteration 4)
- CLI-first design: works for both humans and AI agents (Iteration 8)
- All 5 key questions answered with evidence (Iteration 10)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- No single "unified document diff" framework found: must compose from pieces (Iteration 1)
- PDF structured comparison: fundamentally infeasible without OCR/layout analysis (Iteration 3)
- diff-match-patch discovered but already archived: dead end (Iteration 2)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
None yet.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- diff-match-patch: archived Aug 2024, no maintenance (Iteration 2)
- Python/Rust/Deno runtimes: ecosystem mismatch (Iteration 6)
- SQLite snapshot storage: unnecessary v1 dependency (Iteration 4)
- PDF diff in v1: no layout-preserving parser (Iteration 3)
- Server-side/CDN rendering: violates local-first constraint (Iteration 5)
- GUI-only/REST API: violates AI agent integration requirement (Iteration 8)
- Custom diff algorithm: jsdiff extensible enough (Iteration 2)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
None yet.
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Research complete. Hand off to Phase 2: Core Implementation (adapters, snapshots, diff engine). See `research.md` for full synthesis.
<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

### From spec.md
- v1 must be local-first with automatic snapshots
- Semantic and structural comparison preferred over visual-only
- Self-contained HTML output with fidelity/risk reporting
- Portable core + one standalone skill wrapper
- Research & recommendation phase only; no implementation

### From resource-map.md
- Total references: 38 files across 29 rows
- Categories: Commands=1, Skills=16, Specs=13, Scripts=8
- resource-map.md present; coverage gate active
- Spec Kit owns packet structure; deep-research owns iterative evidence

### Bounded Context Snapshot
- Source pointers: spec.md defines five key open questions for the research charter
- Reuse candidates: spec.md §3 Requirements already captures v1 scope constraints
- Integration points: deep-research contract through `.opencode/commands/deep/research.md`
- Constraints: Level 3 spec; must not implement product; research output is `research/research.md`

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0 (disabled — run full budget)
- stopPolicy: max-iterations
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: false (full synthesis at end)
- research/research.md ownership: workflow-owned canonical synthesis output
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime_capabilities.json`
- Current generation: 1
- Started: 2026-07-13T14:05:00Z
