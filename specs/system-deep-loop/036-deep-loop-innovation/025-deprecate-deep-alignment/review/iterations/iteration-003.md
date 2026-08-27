# Deep Review Iteration 003 — Traceability (Removal-Completeness Core Pass)

## Dimension

**Traceability** — removal-completeness core pass. Cross-reference integrity across all active surfaces, generated-metadata consistency vs the six surviving modes, spec-vs-code (spec_code) and checklist-evidence (checklist_evidence) core protocols, plus the four overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability).

## Files Reviewed

- `specs/system-deep-loop/036-deep-loop-innovation/025-deprecate-deep-alignment/spec.md` (REQ-001, REQ-002, scope, success criteria)
- `specs/system-deep-loop/036-deep-loop-innovation/025-deprecate-deep-alignment/checklist.md` (CHK-001–CHK-061 evidence rows vs commits)
- `specs/system-deep-loop/036-deep-loop-innovation/024-executor-kind-routing/checklist.md:73-77` (supersession note for deleted `deep-alignment-auto.yaml`)
- `.opencode/skills/system-deep-loop/mode-registry.json:29-175` (`deprecatedModes: []`, 6 modes, no alignment)
- `.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/shipped-census.ts:111-580` (`SHIPPED_MODE_CENSUS` — 7 declarations, no alignment)
- Repo-wide grep for `deep-alignment|command-benchmark|conformance-benchmark|/deep:alignment|/deep:command-benchmark` (1446 files; active-surface hits classified below)
- Prior iterations 001 (correctness) + 002 (security) narratives and findings registry

## Findings by Severity

### P0 (Critical)
None.

### P1 (Major)
None.

### P2 (Minor)

#### P2-004 Checklist Verification Summary and _memory frontmatter stale re CHK-024
- **File:** `specs/system-deep-loop/036-deep-loop-innovation/025-deprecate-deep-alignment/checklist.md:124` (summary) + `:11` (_memory frontmatter) vs `:68` (CHK-024)
- **Claim:** The checklist's Verification Summary and `_memory` frontmatter contradict the CHK-024 checkbox/evidence row, leaving a documentation-freshness inconsistency that makes the packet's own verification status ambiguous.
- **Evidence refs:**
  - `checklist.md:68` — CHK-024 is marked `[x]` with detailed evidence: "fresh clean `npx vitest run` = 6 failed / 146 passed (152 files); all 6 failing files are pre-existing (0 alignment/conformance refs each); the 3 regressions ... are fixed and absent from the failing set."
  - `checklist.md:124` — Verification Summary: "All completeness, reference, testing, and file-organization items pass; the sole open box is CHK-024 (the whole-suite vitest confirmation)."
  - `checklist.md:11` — `_memory.continuity.recent_action`: "Authored the checklist; all items pass except the whole-suite vitest confirmation"; `next_safe_action`: "Confirm whole-suite vitest; commit; push v4 + main".
- **Counterevidence sought:** (1) Was CHK-024 actually confirmed later, leaving the summary stale? — The checkbox `[x]` and the detailed evidence (specific pass/fail counts, named pre-existing failures) read as a completed run, not a placeholder. The summary/frontmatter were authored before the run and never refreshed. (2) Could the `[x]` be aspirational? — Unlikely: the evidence names exact counts (6 failed / 146 passed / 152 files) and three specific fixed-regression files; this is observed-output evidence, not a plan.
- **Alternative explanation:** The checkbox was flipped and evidence filled after the vitest run, but the summary paragraph and frontmatter were not updated in the same edit. Stale prose, not a missing verification.
- **Final severity:** P2 — documentation-freshness inconsistency internal to the spec packet. No code defect; the verification itself appears complete. The ambiguity is that a reader cannot tell from the summary whether CHK-024 is open or closed.
- **Confidence:** 0.85
- **Downgrade trigger:** Would mark informational if the summary is updated to match the checkbox (one-line edit to `checklist.md:124` and the frontmatter `recent_action`/`next_safe_action`).
- **Finding class:** doc_freshness
- **Scope proof:** `checklist.md:68` (checkbox `[x]` + evidence) vs `checklist.md:124` (summary "sole open box is CHK-024") vs `checklist.md:11` (frontmatter "all items pass except the whole-suite vitest confirmation") — three contradictory statements in one file.
- **Affected surface hints:** ["checklist", "spec-packet-025", "verification-status"]
- **Risk score:** 2 (advisory only)
- **Recommendation:** Update the Verification Summary (`checklist.md:124`) and the `_memory` frontmatter `recent_action`/`next_safe_action` to reflect that CHK-024 is confirmed, so the packet's self-reported status is internally consistent. No code change.

#### P2-005 035-command-surface-benchmark fixture corpus still contains deep-alignment prompt mirrors (out of 025 scope, observation)
- **File:** `specs/system-deep-loop/035-command-surface-benchmark/002-deterministic-fixtures-oracle/fixtures/corpus/public/clean-control/.codex/prompts/deep-alignment.md:1` (and 13 sibling corpus dirs)
- **Claim:** The 035 deterministic-fixtures-oracle corpus still ships `.codex/prompts/deep-alignment.md` mirror fixtures across its public/held-out/base corpus sets — including the `clean-control` case, which is meant to represent a defect-free command surface. After the 025 removal, a `deep-alignment` prompt mirror is an orphan relative to the real command surface, so the `clean-control` fixture may now encode an orphan-mirror defect rather than a clean baseline.
- **Evidence refs:**
  - `fixtures/corpus/public/clean-control/.codex/prompts/deep-alignment.md` — mirror present in the clean-control case.
  - 13 additional corpus dirs (`public-missing-mirror`, `public-mirror-drift`, `public-gate-obligation-unmet`, `held-out-orphan-mirror`, `base/clean-command-tree`, etc.) each contain the same `deep-alignment.md` mirror.
  - `025-deprecate-deep-alignment/spec.md:98` (REQ-001) scopes the zero-active-refs bar to "active files (historical benchmark reports + changelogs excluded)" — the 035 fixtures are test corpus, not active routing, so they are outside the 025 removal scope.
- **Counterevidence sought:** (1) Are these fixtures active routing surfaces? — No: they live under a separate spec packet (`035-command-surface-benchmark`) as deterministic oracle inputs, not under `.codex/prompts/` at the repo root. (2) Does the 025 spec claim to update them? — No: 025 scope (spec.md:66-81) lists only the deep-alignment mode packet, conformance family, and shared runtime; 035 is not mentioned. (3) Could the fixtures be intentionally frozen historical snapshots? — Possibly: the oracle may validate against a fixed corpus regardless of the live command surface. This was not confirmed (the 035 packet's oracle contract was not read this iteration).
- **Alternative explanation:** The 035 oracle corpus is a deliberately frozen snapshot of a prior command surface state, and the `deep-alignment` mirrors are intentional historical inputs the oracle validates against — not stale references. If so, no update is needed.
- **Final severity:** P2 — out of the 025 removal scope; observation-only. Flagged because the focus guidance asked to distinguish active references from archival/historical ones, and these fixtures are neither clearly active nor clearly archived. The 035 packet owner should confirm whether the corpus is a frozen snapshot or a live-baseline that needs post-removal refresh.
- **Confidence:** 0.62
- **Downgrade trigger:** Would mark out-of-scope (no finding) if the 035 oracle contract documents the corpus as a frozen historical snapshot independent of the live command surface.
- **Finding class:** cross_packet_traceability
- **Scope proof:** grep hits under `specs/system-deep-loop/035-command-surface-benchmark/` are in a different spec packet than 025; 025's scope does not list 035.
- **Affected surface hints:** ["035-command-surface-benchmark", "deterministic-fixtures-oracle", "fixture-corpus"]
- **Risk score:** 1 (observation only, out of scope)
- **Recommendation:** Confirm with the 035 packet owner whether the deterministic-fixtures-oracle corpus is a frozen snapshot or a live baseline. If live, refresh the `clean-control` and related corpus dirs to remove the now-orphan `deep-alignment` mirrors. No 025 code change.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | 025 spec REQ-001 (0 active refs) confirmed by repo-wide grep — zero active-surface hits in `.opencode/.claude/.codex/.cursor/.pi/.devin/README.md`; all matches are historical benchmark reports, changelogs, the 024 supersession note, or 035 test fixtures. REQ-002 (surviving modes) confirmed: `mode-registry.json:30-175` has 6 modes, `deprecatedModes: []`, no alignment. The spec/checklist "8→7 modes" claim refers to `SHIPPED_MODE_CENSUS` declarations (`shipped-census.ts:111-580` = 7 declarations, was 8 before alignment) — accurate, not a mode-registry mismatch. Success criteria SC-001/SC-002/SC-003 cited by author; SC-001 independently confirmed, SC-002/SC-003 cited as author evidence (observation-only, not re-run). |
| `checklist_evidence` | core | partial | Evidence rows cross-checked against commits: CHK-030 "174 total deletions" + CHK cleanup commits (766b59d6bc3 4 mirrors, b955f937fc9 4 symlinks) = 182 deleted paths in scope-files.txt — reconciles. CHK-031 "shipped-census (8→7 modes)" confirmed against `shipped-census.ts` (7 declarations). CHK-024 checkbox+evidence say PASS but Verification Summary (`:124`) and `_memory` frontmatter (`:11`) say it is still open → P2-004. Remaining CHK evidence (CHK-020/021/022/023 test gates) cited as author evidence; not independently re-run (observation-only). |
| `skill_agent` | overlay | pass | `system-deep-loop/SKILL.md` updated in 766b59d6bc3 — 6 surviving modes in the mode table, no alignment (confirmed iter 1). `mode-registry.json` consistent. |
| `agent_cross_runtime` | overlay | pass | No orphaned agent/command mirrors on any active runtime surface (`.claude/.codex/.cursor/.pi/.devin`); 0 dangling symlinks (commit b955f937fc9 removed the 4 dangling mirrors; confirmed iter 1). The 035 fixture corpus mirrors are test inputs in a separate spec packet, not active runtime mirrors → P2-005 (observation). |
| `feature_catalog_code` | overlay | pass | The deleted `deep-alignment/feature-catalog/` directory is in the deleted-paths list. No active feature-catalog references in generated metadata (iter 1 confirmed). No surviving feature-catalog references the removed mode. |
| `playbook_capability` | overlay | pass | The deleted `deep-alignment/manual-testing-playbook/` is in deleted paths. cli-cursor/cli-devin roster-enumeration playbook files in scope were updated (iter 1 active-surface grep returned zero deep-alignment hits, which covers these roster files). No surviving playbook references the removed mode. |

## SCOPE VIOLATIONS
None. All writes confined to the three allowed state-file paths (`iterations/iteration-003.md`, `deltas/iter-003.jsonl`, `deep-review-strategy.md`). No reviewed source/spec/config file was modified.

## Next Dimension

**Maintainability** (iteration 4) — the last remaining dimension. Focus: shared-runtime surgery legibility (mode-enum/union edits, `append-mode-event` gateway alignment-branch removal), generated-metadata regeneration provenance, and whether the removal left any dead-code or comment-hygiene residue in the ~25 surgically edited shared runtime files.

## Verdict

No P0 or P1 findings this iteration. Two P2 advisories: P2-004 (stale checklist summary/frontmatter contradicting the CHK-024 checkbox — documentation freshness, no code defect) and P2-005 (035 fixture corpus still contains deep-alignment mirrors — out of 025 scope, observation for the 035 packet owner). The removal-completeness core pass confirms: zero active-surface orphan references across all six runtimes + README; generated metadata consistent with the 6 surviving modes and 7 census declarations; spec claims match code; the 024 supersession note is honest and correct. P2-only → PASS with advisories.

Review verdict: PASS
