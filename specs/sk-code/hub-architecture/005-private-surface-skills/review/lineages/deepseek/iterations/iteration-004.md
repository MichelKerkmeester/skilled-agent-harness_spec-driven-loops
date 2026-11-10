# Review Iteration 004 — Maintainability

**Lineage:** `deepseek` · **Session:** `fanout-deepseek-1792944728998-cwb2cp` · **Iteration:** 4 of 5
**Dimension:** maintainability (rule duplication, evidence durability, next-change cost)

## Dimension

Maintainability: what does the next change cost, and where can a future edit silently drop a rule the packet depends on? This pass looks at how the `local-*` rule is spread across scan sites, how the two root inventories are maintained, and how durable the packet's own proof is across phases.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:1-58`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:152-205`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:198-212`
- `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:52-70`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:78-92`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`, `generate-router-intent-signals.cjs`, `regenerate-skill-derived.cjs` (skip sites)
- `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` (skip site)
- `.skilled/scripts/git-hooks/pre-commit:96-121`
- `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:1014-1034`
- `.gitignore:230-239`
- `specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/implementation-summary.md:58,67`
- `specs/sk-code/013-private-surface-skills/002-hub-surface-removal/implementation-summary.md:82`
- `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/` (16 tracked files)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

#### 1. R4-P2-001 — Sixteen scan sites each restate the rule, and nothing detects one that omits it

- **Severity:** P2
- **File:** `specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/implementation-summary.md:58`
- **Claim:** "Sixteen scans state their rule for a top-level `local-*` entry" — eight follow a trusted link and eight skip by name.
- **Evidence:** The rule is written out independently in each site: name-only skips in `skill_graph_compiler.py:203-209`, `sync-skills-hermes.cjs:59`, `derive-command-bridges.cjs:83`, `metadata-loader.ts:38`, `ci-skill-root-metadata.cjs`, `generate-router-intent-signals.cjs`, `regenerate-skill-derived.cjs` and `skill-graph-freshness.cjs`; trust-checked scans in `projection.ts:1533`, `watcher.ts:202`, `freshness.ts:146`, `skill-graph-db.ts:738` and the Python readers, all calling the shared `private-skill-target.ts` / `skill_advisor_runtime.py` containment helper. Only the containment half is shared; the name half is a repeated `startsWith('local-')` in four languages.
- **Counterevidence sought:** Looked for a shared predicate (e.g. `isPrivateSkillName`) or a repo check that fails when a scan omits the rule. None exists; the inventory is prose in a phase document, not a test.
- **Alternative explanation:** Splitting the rule is deliberate — a tracked writer must skip unconditionally while a local scan must trust-check, so a single boolean would be wrong. The *name* test, however, is identical everywhere, and that is the part that repeats.
- **Final severity:** P2. The cost lands on the next scan: choosing the right rule and remembering to add it at all.
- **Confidence:** high for the duplication; medium for the claim that a helper would be cheaper than the explicit sites.
- **Downgrade trigger:** a test or lint that enumerates scan sites and asserts each states a rule.

#### 2. R4-P2-002 — The two root inventories are hand-maintained and the reason they differ is not recorded at the guard

- **Severity:** P2
- **File:** `.skilled/scripts/git-hooks/pre-commit:105`
- **Claim:** `.gitignore:236-239` carries four ignore rules, the guard's regex carries eight roots, and the harness loops the same eight by hand (`pre-commit.test.sh:1016`, `:1026`). The three lists must be kept consistent by whoever adds a runtime root.
- **Evidence:** `pre-commit:105` (`skilled|opencode|claude|pi|devin|hermes|codex|cursor`), `.gitignore:236-239` (`.skilled`, `.hermes`, `.codex`, `.cursor`), `pre-commit.test.sh:1016` (same eight, hardcoded). The reason only four roots need ignore rules is documented at `.gitignore:230-235` ("git cannot stage a path beneath a symlink"), not at the guard, so a maintainer editing the guard sees an eight-item list with no note about which roots are real directories.
- **Counterevidence sought:** Checked whether one list derives from the other. It does not; both are literals.
- **Alternative explanation:** The difference is intentional and documented one file away, and the harness does cover all eight roots, so a missed root fails a test rather than escaping silently — provided someone adds the root to the harness as well.
- **Final severity:** P2.
- **Confidence:** high for the facts; medium for the judgment that the comment belongs at the guard.
- **Downgrade trigger:** a generated root list or a comment at `pre-commit:105` naming the four-rule rationale.

#### 3. R4-P2-003 — Evidence durability is uneven, and the two contested phases are the ones with no durable proof

- **Severity:** P2
- **File:** `specs/sk-code/013-private-surface-skills/002-hub-surface-removal/implementation-summary.md:82`
- **Claim:** Phase 005 keeps 15 tracked evidence files under `scratch/evidence/` (16 tracked entries including `.gitkeep`); phases 001 and 002 keep only `.gitkeep` and refer to proofs that are not in the tree — "Worker reports record T039-T104 and T107 proofs" (`:82`) — and phase 003's `scratch/` is empty.
- **Evidence:** `git ls-files` on each phase's `scratch/` (005: 16, 004: 4, 002: 1, 001: 1, 003: 0 tracked); `002/implementation-summary.md:82`; `003/acceptance-criteria.md:347` (a `/tmp` path).
- **Counterevidence sought:** Checked whether the worker reports live elsewhere in the packet. They do not; the only artifacts are the summaries that cite them.
- **Alternative explanation:** Each phase chose its own evidence practice, and the packet never set a standard. The consequence is that the phases whose closure rows are contested (002, 003) are exactly the ones whose proof cannot be re-read.
- **Final severity:** P2 — a maintainability defect about proof practice; the substantive contradictions are R3-P1-002/003/004 and R3-P2-004.
- **Confidence:** high.
- **Downgrade trigger:** none.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | The rule is implemented everywhere it is claimed; its duplication and the evidence asymmetry are the maintainability cost. |
| `checklist_evidence` | core | partial | Evidence exists and is tracked for 005; 002/003 rely on references and a temp path (R4-P2-003). |

## Next Dimension

D5 Completeness: the remaining acceptance rows across all five phases, the overlay protocols, and a final reconciliation of the goal against the record.

## Verdict

Three P2 advisories. The packet's code is easy to read and its rule is stated everywhere it must be; the cost is repetition and an uneven proof standard, not a defect in behavior.

Review verdict: PASS
