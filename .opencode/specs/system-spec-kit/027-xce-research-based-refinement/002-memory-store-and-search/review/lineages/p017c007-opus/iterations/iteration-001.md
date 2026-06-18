# Iteration 1: Full-spectrum review — 007-output-surface-parity contract

## Focus
All four dimensions in one pass (maxIterations=1 fan-out lineage). Target: spec folder `007-output-surface-parity`, whose shipped deliverable is contract/markdown edits to `.opencode/commands/memory/search.md` and `.opencode/commands/memory/assets/search_presentation.txt` (committed `254289251a`). Scope: verify the contract is internally consistent and that `implementation-summary.md` claims resolve to shipped behavior.

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 6 (2 contract files + spec.md, plan.md, tasks.md, graph-metadata.json/description.json)
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00 (first pass, all findings new)

## Findings

### P0, Blocker
- None.

### P1, Required
- None.

### P2, Suggestion

- **F001**: Spec/plan/tasks remain unfilled template scaffolds while the phase is shipped — `spec.md:84-157` (problem/scope/requirements/success-criteria all `[placeholder]`), `plan.md:46-160` (template defaults), `tasks.md:53-77` (`T001 Create project structure` etc.). The only real, accurate documentation of what was built is `implementation-summary.md`. Effect: the `spec_code` core protocol has no normative REQ/SC in `spec.md` to anchor the shipped contract mandates (one-score, core-slot, surface-parity). Tolerated at Level 1 (these files need only exist) and validate.sh --strict passed per impl-summary, but it is a real traceability gap — a future reader cannot trace the mandates back to a requirement. Dimension: traceability.

- **F002**: Completion-metadata mismatch across the packet control files. `graph-metadata.json` reports `Status: planned` and lists `Key Files: spec.md, plan.md, tasks.md` (omits the two changed contract files and implementation-summary.md); `description.json` carries `memorySequence: 0` with no completion signal; `spec.md:51` METADATA Status is still the unfilled `[Draft/In Progress/Review/Complete]`. Meanwhile `implementation-summary.md` continuity reports `completion_pct: 100` and the work is committed (`254289251a`). The framework COMPLETION VERIFICATION RULE step 3 requires reconciling completion metadata so packet docs do not claim conflicting states; `planned` vs `100% + committed` is a live conflict visible to graph traversal and `/speckit:resume`. Non-blocking for the shipped contract. Dimension: maintainability.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | search.md:68,70,74,76; search_presentation.txt:84-100,102-116 | Shipped contract mandates are real, internally consistent, and match impl-summary claims; but spec.md carries no real REQ/SC to anchor them (F001). |
| checklist_evidence | n/a | hard | (no checklist.md — Level 1) | Not required/present at this level. |
| feature_catalog_code | n/a | advisory | — | No catalog claim in scope. |
| playbook_capability | n/a | advisory | — | No playbook scenario in scope. |

### Claim verification (impl-summary citations re-read at source)
- "One score, one scale, one name" → `search.md:70` and `search_presentation.txt:93-96`: mandate `similarity` 0–1 two-decimal as sole metric; `confidence`/percentage banned; `79.44 → 0.79`. CONFIRMED. Render math correct (79.44/100 = 0.7944 → 0.79).
- "Five mandatory core slots" → `search.md:68` and `search_presentation.txt:84-91`: query echo, similarity, `#id`, title, STATUS(RESULTS+INTENT); only omission path = empty-result fallback (Section 3). CONFIRMED and the exemption is logically sound (results=0 → no scored rows).
- "Surface-parity clause" → `search.md:74` and `search_presentation.txt:98-100`: core slots + scale mandatory across `--command`, direct prompt, conversation. CONFIRMED.
- "Named optional trailing fields" → `search.md:76` + `§7` boundary `search.md:140`; render placement `search_presentation.txt:102-116` (between scored block and terminal STATUS footer). CONFIRMED — STATUS stays terminal/parseable.
- "COSTAR register note" → `search.md:11` and `search_presentation.txt:5`. CONFIRMED; explicitly framed as the contract's own register, not a global framework.
- "O1 §0 header + salience + startup gating untouched" → `search.md:13,17,21-22,116-120` present and structurally intact. CONFIRMED via git log (O1 `eac1eb5ef8` → O2 `254289251a`).
- "Constitutional-rows-excluded preserved" → `search_presentation.txt:130-132` unchanged. CONFIRMED.

## Assessment
- New findings ratio: 1.00 (first and only pass)
- Dimensions addressed: correctness (PASS), security (PASS / N/A — markdown contract, no new executable surface; §0 `bash -c` arg-join is prior O1 work and unchanged), traceability (P2 F001), maintainability (P2 F002)
- Novelty justification: comprehensive single-pass; both findings are documentation/metadata hygiene, not deliverable defects. No P0/P1 surfaced after re-reading cited evidence at source.

## Ruled Out
- "Confidence/percentage could still leak in render": ruled out as a contract defect — the ban is explicit in both files (`search.md:70`, `search_presentation.txt:95`) and the self-check (`search.md:78`) scans for it. The residual risk is enforcement-is-contract-not-mechanical, which impl-summary already records as a Known Limitation (not a new finding).
- "Empty-result fallback violates surface parity by dropping the score": ruled out — the core-slot mandate explicitly exempts the empty-result path, and results=0 means there are no scored rows to render.

## Dead Ends
- Searching for a second/duplicate ranking number in the asset: none present; the field-mapping table maps `result.score`/`result.similarity` to a single `<score>` slot.

## Recommended Next Focus
None — maxIterations=1 reached; proceed to synthesis. If a follow-up packet is opened: (1) refill spec.md/plan.md/tasks.md from implementation-summary.md so the mandates trace to REQ/SC, and (2) reconcile graph-metadata.json Status (`planned` → complete) and refresh description.json.

Review verdict: PASS
