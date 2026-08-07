---
title: "Feature Specification: Code Conformance Alignment to the sk-code / code-opencode Standard"
description: "The enforcement mechanism for the sk-code code-opencode standard is itself broken — a dead post-edit hook, a completion gate scoped to one skill tree, and header shape left permanently manual — and that blindness let roughly 1,400 authored files drift from the file-opening, comment-hygiene, portability, and containment contracts. This phased program repairs the gate first, then sweeps the drift in blast-radius order, and amends the one place where the standard, not the code, is the nonconforming artifact."
trigger_phrases:
  - "code conformance alignment sk-code"
  - "boxed header drift sweep"
  - "comment hygiene durable why"
  - "alignment drift verifier scope"
  - "sk-code code-opencode standard conformance"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase-parent spec and five child phase packages"
    next_safe_action: "Resolve operator decisions Q1-Q5, then scaffold and execute child 001 before any code batch runs"
    blockers:
      - "OPERATOR-DECISION Q1 (placement) gates scaffolding of the whole parent"
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions:
      - "Q1 - Is sk-code/021 the right home for a repo-wide conformance program?"
      - "Q2 - Does 020 own the whole system-deep-loop skill or only runtime/**?"
      - "Q3 - Who owns the canonical path-containment helper?"
      - "Q4 - Should exact header shape become a blocking automated check?"
      - "Q5 - Should the three-guard wrapper scan beyond .opencode/skills/sk-code?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Code Conformance Alignment to the sk-code / code-opencode Standard

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-code` |
| **Predecessor** | `sk-code/020-content-quality-remediation` |
| **Successor** | None |
| **Handoff Criteria** | Gate repair lands in child 001 before any code batch runs; each subsequent child reports a captured-baseline drift delta, not a bare PASS |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-code `code-opencode` surface defines a file-opening contract, a hard-block comment-hygiene gate, portability blockers, and a canonical path-containment pattern for every authored code file in this repository. A ten-iteration research loop registered 79 active nonconformance findings against that standard. The findings are real, but they are a symptom: **the enforcement mechanism for the standard is itself broken, and its blindness is what produced the population.** Three mechanisms failed independently and simultaneously — the live post-edit quality hook stopped parsing and ran dead on the Claude runtime; the mandated three-guard completion gate scopes its verifier to `.opencode/skills/sk-code` and therefore structurally cannot see drift anywhere else; and exact header shape, naming, comment quality, and boundary choice are documented as permanently manual gates, so a mechanical `PASS` never meant conformance. Drift then accumulated exactly where nothing was watching: roughly 1,400 files across the governed languages are missing their required opening header, and the standard's own enforcement pointers name files that are not the installed ones.

A second, narrower problem sits inside the same register: in one place the **standard**, not the code, is the nonconforming artifact. The documented test-filename vocabulary describes 43 of the 1,228 TypeScript test files in `.opencode/skills`; `*.vitest.ts` accounts for the rest, and both the runner configs and the alignment verifier already encode that real convention.

### Purpose

Repair the enforcement mechanism, settle the scope rulings once so no later child re-litigates them, then close the drift population in blast-radius order with a machine gate that reports a baseline-to-delta claim rather than a bare `PASS` — and amend the single documented rule that describes a repository that does not exist.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Repair of the enforcement mechanism: the live post-edit adapter, the duplicated pre-commit and post-edit hook pairs, the standard's enforcement pointers, and the three-guard wrapper's scan root.
- Six binding scope rulings (vendored/generated code, runtime mirrors, benchmark fixtures versus harnesses, test-name vocabulary, generic phase/spec labels in comments, pattern and example assets), recorded once and never re-litigated by a child.
- One amendment to the governing standard's test-filename vocabulary, with a canonical discovery contract across the Node runner and the Vitest configs.
- Replacement of every ephemeral-artifact pointer in a code comment with the durable WHY it stood in for.
- A codemod sweep of the file-opening contract — boxed `MODULE:` headers, `COMPONENT:` headers, `'use strict'`, portable shebangs, section numbering, import grouping — across every governed language, run in three independently gated blast-radius lanes.
- Repair of the findings where code is not merely inconsistent but is non-portable or falsely reports itself as verified.
- Judgment-tier repairs: path containment, module and package boundaries, exported-symbol naming, and file organisation.
- A one-task amendment to `system-deep-loop/036-deep-loop-innovation/020-sk-code-opencode-alignment` fixing the shared border between the two programs.

### Out of Scope

- **`dist/` and `external/` trees** — `git ls-files '*/dist/*'` returns 0 files and `git ls-files | grep '/external/'` returns 0; both are gitignored and neither contains an authored file, so authoring rules never apply. `dist/` is verified by rebuild-and-parity, never by style rules.
- **Symlinked `.claude/` mirrors** — `.claude/{commands,skills,specs,changelog,manual-testing-playbook}` and `.claude/hooks/*` share an inode with their `.opencode/` source and are already governed there; sweeping them would double-count.
- **Benchmark fixture subjects and seeded subject corpora** — `**/benchmarks/**/fixtures/**` violates the standard by design, because those files are the inputs a grader is scored against. Editing them silently invalidates every historical benchmark result.
- **Test filename migration** — no `*.vitest.ts` file is renamed; the standard is amended instead.
- **`system-deep-loop/runtime/**`** — owned by `036-deep-loop-innovation/020-sk-code-opencode-alignment`, which stays the sole authority for that tree.
- **Path-containment defects in the security register** (`write-containment.ts`, `persist-artifacts.cjs`, `orchestrate-topic.cjs`, `promote-candidate.cjs`) — owned by the whole-system-gate program; referenced, never re-filed.
- **README and documentation prose** — owned by the documentation-coverage track; no child here touches a `README.md`.
- **Any behavior change.** Every child is behavior-preserving by construction.

### Files to Change

Summary across all phases — per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs` | Modify | 001 | Regression fixture for the parse-breaking failure mode (merge-marker repair already landed) |
| `.opencode/scripts/git-hooks/pre-commit` · `.opencode/hooks/git/pre-commit` | Modify | 001 | Reconcile the two coexisting pre-commit files to one installed path |
| `.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` | Modify | 001 | Close checker vocabulary holes with paired fixtures |
| `.opencode/skills/sk-code/sk-code-opencode/references/shared/code-organization/directory-and-test-conventions.md` | Modify | 001 | Amend the test-filename vocabulary to the repository's real convention |
| `.opencode/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md` | Modify | 001 | Correct the enforcement pointers to name the installed hooks |
| `.opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | Modify | 001 | Widen or explicitly narrow the verifier scan root |
| `.opencode/scripts/run-node-tests.mjs` | Modify | 001 | One canonical discovery contract, plus a discovery canary |
| `system-deep-loop/deep-improvement/scripts/**` · `sk-doc/**` · `sk-prompt/**` · `.opencode/hooks/goal/**` · `.opencode/plugins/tests/**` | Modify | 002 | Comment-only replacement of ephemeral-artifact pointers |
| `.opencode/bin/**` · `.opencode/hooks/**` · `.opencode/plugins/**` · `.opencode/scripts/**` · `.opencode/commands/doctor/scripts/**` · `.github/hooks/scripts/**` · `.claude/statusline-command.sh` | Modify | 003 lane A | Header, strict-mode, shebang and import-order sweep on runtime-reachable code |
| `sk-doc/**/scripts/**` · `sk-design/**` · `mcp-code-mode/**` · `system-deep-loop/shared/**` | Modify | 003 lane B | Same sweep on tooling code |
| `sk-prompt/**/benchmarks/**` · `system-spec-kit/**/benchmarks/**` (harness only) | Modify | 003 lane C | Same sweep on benchmark harnesses; fixture subjects untouched |
| `.opencode/bin/git-sync.sh` · `.opencode/bin/git-live-follow.sh` · `.opencode/bin/worktree-status.sh` | Modify | 004 | Guarded errexit adoption, command by command |
| `system-spec-kit/**` audit helpers · `test_dual_threshold.py` · two MCP Vitest suites · `validate-flowchart.sh` | Modify | 004 | Remove hardcoded checkout roots and silent-skip false greens |
| `skill-graph-db.ts` · `cwd-check.cjs` · `extract-files-from-markdown.cjs` · `archive-compiled-routing.cjs` | Modify | 005 | Canonical realpath containment replacing lexical prefix checks |
| `system-spec-kit/mcp-server/**` · `system-skill-advisor/**` · md-generator backend | Modify | 005 | `node:` specifier normalisation with per-package rebuild |
| `vector-index-store.ts` · `wait-patterns.js` · `context-server.ts` · compiled-routing authored source | Modify | 005 | Naming, organisation and authority decisions |
| `system-deep-loop/036-deep-loop-innovation/020-sk-code-opencode-alignment/spec.md` | Modify | 001 | Border amendment (see `020-amendment.md`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-conformance-rulings-and-gate-repair/` | Repair the enforcement mechanism, close the checker's vocabulary holes, amend the test-name vocabulary, and record the six binding rulings. Level 3. 14 findings. | Planned |
| 002 | `002-comment-hygiene-durable-why/` | Replace every ephemeral-artifact pointer in a code comment with the durable WHY it stood in for. Comment-only diffs. Level 2. 10 findings. | Planned |
| 003 | `003-header-directive-and-structure-sweep/` | Codemod the file-opening contract across every governed language in three blast-radius lanes, gated by a captured verifier baseline. Level 3. 34 findings. | Planned |
| 004 | `004-portability-and-false-green-repair/` | Repair the code that is non-portable or falsely reports itself as verified. Level 3 by risk override. 7 findings. | Planned |
| 005 | `005-boundaries-containment-and-naming/` | The judgment tier: containment, module and package boundaries, exported-symbol naming, file organisation. Level 3. 14 findings. | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- **001 lands first.** Children 002, 003 and 005 are hard-blocked on 001 because their gates do not exist until 001 builds them. Child 004 may start in parallel with 001; its shell and portability lanes do not depend on the comment checker.
- **A ruling recorded in 001 is frozen.** No child re-opens a §3 ruling; a child that believes a ruling is wrong escalates rather than deviating.
- **Every child's T001 re-derives its work list against HEAD** before any edit. Findings name examples, not populations.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Comment checker parses, runs, and recognises the closed vocabulary holes; the generic-label semantic boundary is written into the decision record with a positive/negative fixture pair | `check-comment-hygiene.test.sh` green with the new fixtures; each new fixture demonstrated failing before its rule landed |
| 001 | 003 | The drift-verifier baseline for every lane root is captured and recorded; the exact-header gate decision (Q4) is resolved and, if adopted, implemented as an opt-in flag | Recorded per-root baseline output committed as the program baseline; `verify_alignment_drift.py --root <lane-root>` reproduces it |
| 001 | 005 | The containment-helper ownership decision (Q3) is resolved and the helper's import path is known | Decision record entry names the helper module and its owner |
| 001 | 020 | The border amendment is applied to 020's spec so `runtime/**` versus non-runtime ownership is unambiguous | `020-sk-code-opencode-alignment/spec.md` states the resolved scope and the cross-reference |
| 003 lane A | 003 lane B | Lane A's live-surface smoke suite is green and its verifier delta is reported as "N warnings closed, zero new" | Hook smoke, `.opencode/bin` front-door invocations, compiled-route manifest test |
| 003 lane B | 003 lane C | Lane B's owning-package suites are green; the documentation-coverage track's own code child has landed | Per-package vitest/pytest, plus a check that the other track's files are not in this lane's work list |
| 004 | — | Every repaired test actually executes; a skip is a failure for this child | Test runner output shows executed, not skipped, for each repaired suite |
| 005 | — | Per package: typecheck, build, and full suite green with a reported baseline delta; byte-parity on any regenerated output | Per-package gate output plus a diff of regenerated artifacts |
<!-- /ANCHOR:phase-map -->

---

## FINDING DISPOSITIONS

All **79** active findings are owned by exactly one child; the per-child scope tables in each `spec.md` are the authoritative register.

| Child | Findings | P1 | P2 |
|-------|----------|----|----|
| 001 — rulings and gate repair | 14 | 8 | 6 |
| 002 — comment hygiene | 10 | 8 | 2 |
| 003 — header and directive sweep | 34 | 0 | 34 |
| 004 — portability and false green | 7 | 5 | 2 |
| 005 — boundaries, containment, naming | 14 | 7 | 7 |
| **Total** | **79** | **28** | **51** |

Two synthesis-level findings are additionally owned by child 001 and are not part of the 79: **SYN-1** (the three-guard wrapper scopes the alignment verifier to `.opencode/skills/sk-code` only) and **SYN-2** (the standard's enforcement pointers name files that are not the installed ones).

### Refuted — do not resurrect (5, not counted in the 79)

| ID | Why it is not a defect |
|----|------------------------|
| RB-004-02 | Serving-snapshot reads — the scanner derives its root from the selected hub; reads from the separate activation root are the stated contract |
| RB-004-05 | `new Function` in a model-code evaluator — the standard carries no prohibition on a deliberate dynamic-code harness. May warrant a security review; the conformance claim cites no real rule |
| RB-004-06 | Grader-cache model-build placeholder — the file openly pins and identifies it, which is what the verification doctrine requires |
| RB-004-07 | Validator dependency fallback — the Python standard prohibits *bare* handlers, not a documented `except Exception` fallback with a fixed default |
| RB-007-10 | Frozen-manifest availability — the cited path returned `ENOENT`, so availability was never a resolved fact |

### Evidence corrections carried forward

| ID | Correction | Owner |
|----|-----------|-------|
| RB-004-12 | The "lacks a boxed header" half is **false** — the boxed header is present. Only the ESM-in-ordinary-`.js` module-format decision survives | 005 T001 |
| RB-007-08 | Claims sixteen snake_case functions; a count at HEAD found fifteen | 005 T001 |
| RB-002-05 | Names four symbols; two matched the cited grep form, two use a different declaration form | 005 T001 |

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

Five operator decisions gate this program. Each is tagged `OPERATOR-DECISION: Q<n>` at every point in the child packages where it changes an authored element.

- **[OPERATOR-DECISION: Q1 — placement]** Is `.opencode/specs/sk-code/021-code-conformance-alignment/` the right home, or should this hang under an existing parent? *Recommendation: the new `sk-code/021` parent — the work is repo-wide, `sk-code` owns the standard, and siblings 019/020 in that track are Complete and concern sk-code's own documents. Blocks: everything.*
- **[OPERATOR-DECISION: Q2 — the non-runtime deep-loop border]** 020's Non-Goals say "Alignment of non-`system-deep-loop` surfaces" and its Out of Scope says "Code outside the `system-deep-loop` runtime". Read as `runtime/**` only, this program claims the non-runtime deep-loop trees. If the intent was that 020 covers the whole skill, five findings move to 020. *Recommendation: 020 owns `runtime/**` and only that tree. Blocks: 002 and 003 work lists, and the 020 amendment.*
- **[OPERATOR-DECISION: Q3 — containment helper ownership]** The security register has the higher-severity containment instances and should own the canonical realpath helper; child 005 consumes it. If that program will not land soon, should 005 author the helper in a shared location for later adoption, or fix its five instances locally and accept a later consolidation? *Recommendation: consume; fall back to authoring in a shared location. Blocks: 005's containment lane.*
- **[OPERATOR-DECISION: Q4 — exact-header automated check]** Header shape is deliberately a manual gate, and that is precisely why the population drifted. Adding an exact-header check to the verifier would make child 003 self-gating and prevent recurrence, but it changes the verifier's contract and needs documented exceptions for plugins, fixtures, assets and examples. *Recommendation: yes, as a new opt-in flag, promoted to default only after 003 completes. Blocks: 001's decision record and 003's gate design.*
- **[OPERATOR-DECISION: Q5 — three-guard scan scope]** The wrapper scans `.opencode/skills/sk-code` only, so the rule that every system-code completion claim runs the three-guard entry point has been near-vacuous outside that tree. Widening it surfaces the full backlog on every completion claim until 003 and 004 land. *Recommendation: widen with `--fail-on-warn` off until the sweep lands. Blocks: 001's gate-repair task.*
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
