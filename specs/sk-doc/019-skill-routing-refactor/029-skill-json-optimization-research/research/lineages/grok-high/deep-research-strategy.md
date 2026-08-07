# Deep Research Strategy - grok-high lineage

## 2. TOPIC
Investigate whether every skill and skill-advisor related JSON across `.opencode/skills` is as optimized, automated, effective, tested, and integrated as it can be, and identify the highest-leverage gaps. Five dimensions covered across 5 iterations. Findings only; cite `file:line`. Deliverable: ranked opportunity map in `research.md`.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] (none — all five charter questions answered)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Do not implement fixes (findings only)
- Do not redesign the advisor scoring algorithm
- Do not change the H or S class contract fundamentally
- Do not write outside this lineage artifact directory

---

## 5. STOP CONDITIONS
- `stopPolicy: max-iterations` — all 5 iterations completed
- Stop reason: max_iterations

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] Which JSON types exist fleet-wide, and which are authored vs generated per H/S class? (iteration 1)
- [x] Which fields are redundant, unused, or drift-prone across skill-root and advisor JSON? (iteration 2)
- [x] What still requires hand-authoring that scaffolder/generators could emit or auto-validate? (iteration 3)
- [x] Do intent-signals and load-bearing fields actually drive advisor routing quality? (iteration 4)
- [x] Where are test/CI and end-to-end scaffold→gate→ingest→routing gaps sharpest? (iteration 5)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Fleet presence census + ci-skill-root-metadata JSON (iteration 1)
- Consumer tracing (projection / parseSkillMetadata / doctor) for dead fields (iteration 2)
- Scaffold + CI path inspection for automation holes (iteration 3)
- Live advisor_recommend probe for effectiveness (iteration 4)
- Test-density census + 024 checklist cross-check (iteration 5)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Assuming generate-description.js optimizes skill-root JSON (iteration 1)
- Equating class-gate green with routing quality (iteration 5)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Spec-folder generators as skill-root tools -- BLOCKED (iteration 1)
- What was tried: treating generate-description/backfill-graph-metadata as skill optimizers
- Why blocked: wrong schema domain
- Do NOT retry: conflating continuity metadata with advisor identity

### Scoring redesign -- BLOCKED (iteration 4)
- What was tried: considering weight/explicit.ts changes for F22
- Why blocked: research non-goal
- Do NOT retry within this packet
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Optimize skill-root description via generate-description.js (iteration 1)
- Delete description.json entirely (iteration 2)
- Auto-generate mode-registry/hub-router (iteration 3)
- Redesign lane weights / explicit.ts (iteration 4)
- Treat class-gate green as routing-quality proof (iteration 5)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: five charter dimensions each covered once
- Pivot lineage: none — stopPolicy forced full breadth
- Remaining frontier: cross-lineage merge with sol-high / glm-high
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Which single opportunity the cross-lineage merge ranks #1 (sol/glm may differ on ordering)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
SYNTHESIS COMPLETE. See `research.md` ranked opportunity map. Cross-lineage merge is packet-level, outside this lineage write scope.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- resource-map.md not present; skipping coverage gate
- Fan-out lineage label: `grok-high`
- Synthesis artifact: `research.md`

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 (reached)
- Stop reason: max_iterations
- Started: 2026-07-29T06:08:30.000Z
- Completed: 2026-07-29T06:33:00.000Z
