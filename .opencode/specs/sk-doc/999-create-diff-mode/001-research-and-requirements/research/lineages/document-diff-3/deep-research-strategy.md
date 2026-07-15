# Deep Research Strategy - Document Diff v1 Architecture

## 2. TOPIC
Research the architecture and v1 contract for the standalone local AI document diff skill

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
All questions answered — see §6.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Writing production parser, diff, snapshot, renderer, CLI, or skill code
- Starting a hosted service, browser-only product, collaborative review system, or cloud sync
- Persistent multi-version history beyond minimum baseline lifecycle
- Claiming visual-layout equivalence from semantic extraction alone
- Selecting implementation phases without citing converged research

---

## 5. STOP CONDITIONS
- All 7 key questions have evidence-backed answers ✓
- 10 iterations completed (max-iterations policy) ✓

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- **Q1**: Structured token model with sections[], fidelity scoring, format-specific adapters (iter-1, iter-9)
- **Q2**: jsdiff Myers algorithm for v1 core, histogram as v2 upgrade path (iter-1, iter-2)
- **Q3**: SHA-256 content-addressed snapshots, 30-day LRU retention, atomic writes, explicit-pair fallback (iter-3)
- **Q4**: Self-contained dual-mode HTML (side-by-side + unified), CSP script-src 'none', fidelity dashboard, keyboard navigation (iter-4)
- **Q5**: Two-layer architecture: portable npm core (doc-diff-core) + OpenCode skill wrapper; full TypeScript API and CLI contract defined (iter-5)
- **Q6**: 4-tier format matrix (Full/Limited/Adapter/Unsupported) covering 7 formats with specific fidelity scores (iter-1, iter-6)
- **Q7**: diff (BSD-3-Clause) + mammoth (BSD-2-Clause) + cheerio (MIT) + remark (MIT) + pdf-parse (MIT); all permissively licensed and actively maintained (iter-2, iter-7)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- npm package pages provided authoritative, up-to-date library documentation (iter-1, iter-2)
- The canonical representation model (structured sections + fidelity scoring) mapped cleanly to real library APIs (iter-1, iter-9)
- Content-addressed snapshot storage (like Git) elegantly solves naming, dedup, and integrity (iter-3)
- Spec.md guardrails kept research focused and prevented scope creep (all iterations)
- Format tier model (Full/Limited/Adapter/Unsupported) proved robust across all formats (iter-6)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- pdf-parse npm page returned 403; PDF adapter research relied on general knowledge rather than primary docs (iter-2, iter-6)
- Pure-JS PDF structure extraction remains weak; no maintained library found for heading/table inference from PDF layout (iter-6)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- Custom markdown parser instead of remark/mdast — existing ecosystem is well-established (iter-2)
- jsdom (heavy) over cheerio (lightweight) for HTML extraction (iter-2)
- SQLite for snapshot metadata — overkill for v1; flat-file index sufficient (iter-3)
- In-memory snapshot cache — loses data on crash; disk-first with atomic writes is safer (iter-3)
- Monolithic skill-only architecture — loses portability, violates ADR-001 (iter-5)
- WASM-based diff engine for v1 — unnecessary performance optimization (iter-5)
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Character-only diff as primary approach — loses document structure (iter-1)
- Server-rendered HTML report — violates local-only constraint (iter-4)
- External CSS framework dependency — must be self-contained (iter-4)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Saturated: diff algorithm selection (Myers confirmed across 3 iterations)
- Remaining frontier: PDF structure inference, move detection algorithm, perceptual image diff
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Should v2 use WASM for PDF parsing (PDFium) to improve structure extraction?
- Should the report support export to Markdown or PDF for sharing?
- Should snapshot storage use SQLite for concurrent-write safety at scale?
- Should move detection use histogram algorithm or AST-based diff?
- Should we add image-perceptual-diff for DOCX embedded images?
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
RESEARCH COMPLETE — proceed to synthesis and implementation planning
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
[Initial bootstrap context — see iteration artifacts for detailed findings]

## 13. RESEARCH BOUNDARIES
- Max iterations: 10 (reached)
- Convergence threshold: 0 (off — max-iterations policy)
- Started: 2026-07-13T15:00:00Z
- Completed: 2026-07-13T16:15:00Z
- Lineage: fanout-document-diff-3
- All 7 primary research questions answered with evidence
