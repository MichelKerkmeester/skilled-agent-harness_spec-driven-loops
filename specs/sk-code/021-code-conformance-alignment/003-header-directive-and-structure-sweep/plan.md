---
title: "Implementation Plan: Header, Directive and Structure Sweep"
description: "Close the file-opening contract across every governed language with a deterministic, idempotent codemod run in three blast-radius lanes. Two gates run per root: a header census that must reach zero, and a drift-verifier delta against child 001's captured baseline that must show zero new findings. Behavior preservation is proven per file by parse check, per package by typecheck and test suite, and on lane A by executing the live surfaces."
trigger_phrases:
  - "header sweep plan"
  - "codemod lane gating"
  - "verify alignment drift baseline delta"
  - "behavior preservation header codemod"
importance_tier: "high"
contextType: "planning"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/003-header-directive-and-structure-sweep"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan for the header and directive sweep"
    next_safe_action: "Wait on child 001's baseline, then run T001 census reconciliation"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Header, Directive and Structure Sweep

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript (CJS/ESM), Python 3.11, Bash 3.2+ |
| **Framework** | None. The codemod is a standalone offline transform; the gate is the existing stdlib-only alignment verifier |
| **Storage** | None. The only persisted artifacts are the captured baselines and the regenerated compiled-routing outputs used for byte parity |
| **Testing** | Per file: `node --check`, ESM parse, `tsc --noEmit`, `python3 -m py_compile`, `bash -n` + ShellCheck. Per root: `verify_alignment_drift.py` delta plus a header census. Per package: Vitest / `node --test` / pytest. Lane A additionally: live-surface execution |

### Overview

The codemod is deterministic and idempotent, so a lane can be re-run to reproduce its diff exactly and a second run over transformed files yields nothing. The important design point is that **the drift verifier alone cannot gate this phase**, and pretending otherwise is exactly the failure that produced the population: the verifier checks strict mode, shell strict mode and shebang portability, but not header shape. On four of the seven lane A roots it already returns `PASS` while header-less files sit in the scanned set. So each root carries **two** gates — a header census that must fall to zero, which is the *closure* gate, and a verifier delta that must show zero new findings, which is the *no-regression* gate. Neither substitutes for the other.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Child 001 landed with a captured per-root baseline
- [ ] **[OPERATOR-DECISION: Q4 — exact-header automated check]** resolved, so the closure gate is either the verifier's opt-in flag or the scripted assertion
- [ ] **[OPERATOR-DECISION: Q2 — the non-runtime deep-loop border]** resolved, so lane B's roots are final
- [ ] Codemod idempotence demonstrated on a scratch copy before any lane runs

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
- [ ] Per root: header census at zero, verifier delta reported as "N closed, zero new"
- [ ] Lane A live surfaces executed and green
- [ ] Compiled-routing regenerated outputs byte-identical
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Lane-gated deterministic codemod. One transform library, seven rules, three blast-radius lanes, two gates per root, one commit per root so any root reverts alone.

### Key Components

- **Transform library**: implements R-HDR-JS, R-STRICT, R-HDR-PY, R-HDR-SH, R-SHEBANG, R-SECNUM, R-IMPORTS. Pure function from file text to file text; no filesystem side effects beyond the write, and file mode preserved.
- **Exemption filter**: applied both inside the codemod (so it never opens an exempt file) and again as a diff assertion (so an accidental edit is still caught). Belt and braces, because the fixture exemption protects benchmark history.
- **Below-the-line assertion**: parses each diff hunk and confirms it lies above the file's first executable statement, with an explicit allow-list for reviewed import-order hunks.
- **Header census**: the same command that produced the pre-lane count, re-run after. It is the closure gate.
- **Drift verifier** (`verify_alignment_drift.py`): the no-regression gate. Flags confirmed at HEAD: `--root` (repeatable), `--fail-on-warn`, `--check-router`.
- **Live-surface suite** (lane A only): post-edit hook smoke, pre-commit on a scratch commit, `.opencode/bin` front-door invocation, compiled-route manifest test, compiled-routing byte parity.

### Data Flow

Census → codemod → per-file parse check → below-the-line assertion → exemption assertion → verifier delta → package suites → (lane A) live-surface suite → commit. A failure at any stage reverts that root and stops the lane; the lane never proceeds past a parse failure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/bin/**` (63 `.cjs`, 26 header-less) | Front-door CLIs and the compiled-routing library | update — headers, strict mode | `node --check` each; front-door invocation; compiled-route manifest test; byte parity on regenerated outputs |
| `.opencode/bin/git-sync.sh`, `git-live-follow.sh`, `worktree-status.sh` | Deliberately non-errexit git coordination | **not a consumer** — excluded from this lane; owned by child 004 | Their 3 `SH-STRICT-MODE` errors are expected to persist through this lane unchanged |
| `.opencode/hooks/**` (37 JS, 5 header-less; 5 TS) | Live post-edit, goal and lifecycle hooks | update — headers, import order | `node --check`; post-edit smoke on a scratch edit |
| `.opencode/plugins/**` (19 JS, 1 header-less) | OpenCode plugin loader surface | update — header, import grouping | `node --check`; plugin test suite; `.mjs` receives no strict directive |
| `.opencode/scripts/**` (10 `.sh`, 9 header-less) | Git hooks and repository scripts | update — component headers | `bash -n` + ShellCheck; scratch-commit pre-commit run |
| `.opencode/scripts/git-hooks/lib/{autostash-orphan-guard,memory-drift-marker}.sh` | Shell libraries currently failing `SH-STRICT-MODE` with **no finding naming them** | update or route to 004 — decided at T001 | The census, not the finding list, decides; whichever child takes them records it |
| `.opencode/commands/doctor/scripts/*.cjs` (5, 2 header-less) | Diagnostics | update — headers, strict mode | `node --check`; doctor route smoke; verifier warning count 1 → 0 |
| `.github/hooks/scripts/*.sh` (2, both header-less) | CI runtime bridge wiring | update — component headers | `bash -n`; the bridge still runs in its CI context |
| `.claude/statusline-command.sh` | Hand-authored, non-symlinked | update — component header | `bash -n`; statusline still renders |
| `.claude/{commands,skills,specs,hooks}/**` | Symlinks to `.opencode/` sources | **not a consumer** — same inode; governed at source | `find .claude -type l` confirms; diff must contain none of them |
| sk-doc scripts (52, 13 header-less) | Documentation tooling | update | Per-language parse; sk-doc suites; **sequenced after the documentation-coverage track's code child** |
| sk-design `**/*.py` (10, all header-less) | Design gates | update | `py_compile`; design gate suites |
| mcp-code-mode entry + postinstall checker | Tooling | update | `node --check` / `tsc --noEmit` |
| `system-deep-loop/shared/**`, `deep-improvement/scripts/**` (75, 5 header-less) | Non-runtime deep-loop tooling | update — **[OPERATOR-DECISION: Q2]** | Deep-loop package suites; sequenced after any security-register child touching the same file |
| `sk-prompt/**/benchmarks/**` (42 `.cjs`, all header-less) | Benchmark harness, grader, runner | update | `node --check`; a benchmark rerun on one representative rig |
| `**/benchmarks/**/fixtures/**` | Subject corpora | **not a consumer** — permanently exempt | Diff intersected with the exemption glob must be empty |
| `system-deep-loop/runtime/**` | Owned by 020 | **not a consumer** | Absent from the diff |

Required inventories:
- Same-class producers: the census command per root is the producer inventory. Findings name examples; the census names the population.
- Consumers of changed symbols: **none** — no symbol, export or specifier changes. R-IMPORTS reorders only, and the specifier-multiset equality check proves it. Record this as a checked claim, not an assumption.
- Matrix axes: {language: ts, js, cjs, mjs, py, sh} × {shebang: present, absent} × {existing preamble: none, non-canonical prose, canonical} × {lane: A, B, C}. Every cell that exists in the tree needs at least one verified file.
- Algorithm invariant: **every changed hunk lies above the file's first executable statement**, except hunks on the reviewed import-order allow-list. Adversarial cases: a file whose first line is a shebang; a `.cjs` with an existing bare `'use strict'` and no header; a Python file whose module docstring is read at runtime; a file with a preamble comment that is load-bearing for a build tool (a source-map or license pragma); a file with zero imports.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm findings and re-derive the census per lane root; reconcile against the tracked-versus-walked file-count gap
- [ ] Build and prove the transform library: idempotence, mode preservation, shebang handling, specifier-multiset equality
- [ ] Build the below-the-line and exemption assertions and demonstrate each failing on a deliberate violation
- [ ] Capture per-root pre-lane numbers: verifier findings and header census

### Phase 2: Core Implementation
- [ ] Lane A, one root at a time, each its own commit, each fully gated before the next
- [ ] Lane B, after the documentation-coverage track's code child lands
- [ ] Lane C, fixture subjects untouched

### Phase 3: Verification
- [ ] Manual testing complete — lane A live surfaces executed
- [ ] Edge cases handled — every matrix cell has a verified file
- [ ] Documentation updated — spec, plan, tasks, checklist and decision record reconciled
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The transform library's seven rules, including idempotence and mode preservation | The codemod's own test suite, written before any lane runs |
| Contract | No hunk below the first executable line | Below-the-line assertion over `git diff` |
| Contract | No exempt file touched | `git diff --name-only` intersected with the exemption globs |
| Contract | Import reordering preserves the specifier multiset | Per-file sorted-multiset comparison |
| Closure gate | Header census reaches zero per root | The census command, re-run |
| No-regression gate | Verifier findings per root | `verify_alignment_drift.py --root <R>` |
| Integration | Per-package typecheck, build and suite | `tsc --noEmit`, package build, Vitest / `node --test` / pytest |
| Integration (lane A) | Live surfaces still run | Post-edit smoke, scratch-commit pre-commit, `.opencode/bin` front doors, compiled-route manifest test |
| Parity (lane A) | Compiled-routing generated outputs unchanged | Regenerate and `diff` against pre-lane artifacts |
| Manual | Every reviewed import-order hunk | Diff review against the allow-list |

### The machine gate, per root

Baseline column: re-derived at HEAD in this session. `verify_alignment_drift.py` findings come from `python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root <ROOT>`; the header census is the box-drawing-header test over the root's tracked files. **Child 001's captured baseline supersedes these numbers if it disagrees; T001 reconciles.**

| Lane | Root | Verifier before | Verifier after (expected) | Census before (missing) | Census after (expected) |
|------|------|-----------------|---------------------------|-------------------------|-------------------------|
| A | `.opencode/bin` | FAIL — 3 errors (`SH-STRICT-MODE`), 0 warnings | **3 errors, unchanged** — those three are child 004's and must NOT be closed here | 26 of 63 `.cjs` (19 of 39 in `lib/compiled-routing`) | **0** |
| A | `.opencode/hooks` | PASS — 43 scanned, 0 findings | PASS — 0 findings, **zero new** | 5 of 37 JS | **0** |
| A | `.opencode/plugins` | PASS — 33 scanned, 0 findings | PASS — 0 findings, **zero new** | 1 of 19 JS | **0** |
| A | `.opencode/scripts` | 2 errors + 1 warning (`SH-STRICT-MODE`) | **1 warning** if the two `lib/*.sh` errors are taken here; **2 errors + 1 warning unchanged** if routed to 004. Decided at T001 | 9 of 10 `.sh` | **0** |
| A | `.opencode/commands/doctor/scripts` | PASS with 1 warning (`JS-USE-STRICT` on `skill-graph-freshness.cjs:1`) | **0 warnings** — RB-005-05 closed | 2 of 5 `.cjs` | **0** |
| A | `.github/hooks/scripts` | PASS — 2 scanned, 0 findings | PASS — 0 findings, **zero new** | 2 of 2 `.sh` | **0** |
| A | `.claude/statusline-command.sh` | (single file — run as part of a parent root) | zero new | 1 of 1 | **0** |
| B | sk-doc `**/scripts` | Capture at T001 | zero new | 13 of 52 | **0** |
| B | sk-design `**/*.py` | Capture at T001 | zero new | 10 of 10 | **0** |
| B | mcp-code-mode | Capture at T001 | zero new | 2 of 2 | **0** |
| B | deep-loop `shared/**` + `deep-improvement/scripts/**` | Capture at T001 | zero new | 5 of 75 | **0** (or moved to 020 per Q2) |
| C | sk-prompt `**/benchmarks/**` | Capture at T001 | zero new | 42 of 42 `.cjs` | **0** |
| C | spec-kit `**/benchmarks/**` scripts | Capture at T001 | zero new | 3 of 3 | **0** |

**Read the first row carefully.** `.opencode/bin` is expected to still report 3 errors after this lane. Those errors are the deliberately-non-errexit git-coordination scripts that child 004 owns command-by-command; "fixing" them here with a blanket flag would abort a rebase mid-flight. A lane A completion claim that reports `.opencode/bin` as PASS is a red flag, not a success.

**And read the PASS rows carefully.** Four roots are already `PASS` while carrying header-less files. That is the blind spot this phase exists to close, and it is why the census is the closure gate and the verifier is only the no-regression gate.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 001 — captured baseline | Internal | Red | Every delta claim is unanchored; the phase cannot report a falsifiable result |
| Child 001 — Q4 gate decision | Internal | Red | Determines whether closure is gated by a verifier flag or a scripted assertion |
| Child 004 — the three git-coordination scripts | Internal | Green | Not blocking; this lane must simply leave them alone |
| Documentation-coverage track's code child | External to this program | Yellow | Lane B waits, to avoid racing on the same package's suite |
| Security register's children | External to this program | Yellow | Per-file sequencing on shared deep-loop files |
| Operator decision Q2 | Internal | Yellow | Lane B's root list is provisional until answered |
| `verify_alignment_drift.py` flag surface | Internal | Green | Confirmed at HEAD: `--root` (repeatable), `--fail-on-warn`, `--check-router` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a parse failure after transform; a package suite regression; a byte difference in a regenerated compiled-routing output; a live-surface smoke failure; a below-the-line or exemption assertion failure.
- **Procedure**: each root is one commit, so `git revert <root-commit>` restores that root without touching a completed one. For a single quarantined file, `git checkout <pre-lane-sha> -- <file>`. After any revert, re-run that root's parse checks, its package suite and — for lane A — its live-surface smoke, because rollback must not itself break a live surface.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Child 001 (baseline + gate) ──┐
                              ├──► Lane A ──► Lane B ──► Lane C
Phase 1 (census + codemod) ───┘        ▲
                                       │
Doc-coverage track code child ─────────┘ (gates Lane B only)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Census + codemod build | Child 001 | All lanes |
| Lane A | Census, codemod, baseline | Lane B (sequential by policy, not by technical need) |
| Lane B | Lane A, doc-coverage track's code child | Lane C |
| Lane C | Lane B | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Census + codemod build and proof | High | 8-12 hours |
| Lane A (7 roots, live surfaces, byte parity) | High | 10-14 hours |
| Lane B (5 root groups) | Med | 6-9 hours |
| Lane C (2 root groups, 45 files) | Low | 3-5 hours |
| Verification and reconciliation | Med | 3-5 hours |
| **Total** | | **30-45 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — no data; the pre-lane compiled-routing generated outputs are copied aside for byte comparison
- [ ] Feature flag configured — the exact-header verifier check ships opt-in; that is the flag
- [ ] Monitoring alerts set — N/A; the live-surface smoke is the signal

### Rollback Procedure
1. Identify the failing root from the gate output.
2. `git revert <root-commit>` — one root, one commit.
3. Re-run that root's parse checks and its package suite.
4. For lane A, re-run the live-surface smoke: the post-edit hook must fire and the pre-commit hook must block a violating scratch commit.
5. Re-run the header census for that root and record it back at its baseline value.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. Compiled-routing generated outputs are regenerated, not migrated; byte parity is asserted rather than restored.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Census + reconcile│───►│  Lane A          │───►│  Lane B          │
│ (T001)           │    │  runtime-reachable│    │  tooling         │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                       │
┌────────▼─────────┐    ┌────────▼─────────┐    ┌────────▼─────────┐
│ Codemod + proofs │    │ Live-surface     │    │  Lane C          │
│ (idempotent)     │    │ smoke + parity   │    │  benchmark rigs  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Census + reconcile | Child 001 baseline | Authoritative per-root work list | Codemod scoping, all lanes |
| Codemod + proofs | Census | Idempotent, mode-preserving transform | All lanes |
| Assertions | Codemod | Below-the-line and exemption gates | All lanes |
| Lane A | Codemod, assertions, baseline | Conformant runtime-reachable tree | Lane B (policy) |
| Lane B | Lane A, doc-coverage track's code child | Conformant tooling tree | Lane C |
| Lane C | Lane B | Conformant harness tree | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Census reconciliation** - 3-4 hours - CRITICAL
2. **Codemod build with idempotence, mode and shebang proofs** - 8-12 hours - CRITICAL
3. **Lane A, root by root, with live-surface gating** - 10-14 hours - CRITICAL

**Total Critical Path**: 21-30 hours

**Parallel Opportunities**:
- The below-the-line and exemption assertions can be built alongside the transform library.
- Lane C is technically independent of lanes A and B and could run in parallel if two agents are available; it is sequenced last only because its blast radius is lowest and it should not consume review attention first.
- Per-package baseline test captures for lanes B and C can be taken while lane A executes.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Census authoritative | Per-root counts reconciled against the synthesis census and child 001's baseline; unnamed-by-any-finding files listed | End of Phase 1 |
| M2 | Codemod trustworthy | Idempotent, mode-preserving, shebang-safe, specifier-multiset-preserving — each proven by its own test | End of Phase 1 |
| M3 | Lane A closed | All 7 roots at census zero, verifier zero-new, live surfaces green, compiled-routing byte-identical | Mid Phase 2 |
| M4 | Lane B closed | All roots at census zero with package suites green | Late Phase 2 |
| M5 | Lane C closed | All roots at census zero; fixture-subject diff intersection empty | End of Phase 2 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Two gates per root, not one

**Status**: Proposed

**Context**: The drift verifier does not check header shape. On four lane A roots it returns `PASS` today while header-less files sit in the scanned set. Gating this phase on the verifier alone would reproduce the exact blindness that created the population.

**Decision**: Every root carries a header census as the closure gate and a verifier delta as the no-regression gate. A completion claim must report both.

**Consequences**:
- The claim becomes falsifiable in both directions: the class is closed, and nothing else broke.
- Two numbers must be captured and reported per root, which is more bookkeeping than a single `PASS`.

**Alternatives Rejected**:
- *Verifier only*: cannot see the defect being fixed.
- *Census only*: cannot see a regression the transform introduces.

### ADR-002: Three lanes ordered by blast radius, one commit per root

**Status**: Proposed

**Context**: The population spans live hooks that run on every edit, authoring tooling, and benchmark rigs. A single sweeping commit would make a bad transform unrevertible without losing good work.

**Decision**: Three lanes, gated independently; within a lane, one commit per root.

**Consequences**:
- Any root reverts alone, and lane A's live surfaces are gated by actually executing them.
- The phase takes longer and produces more commits than a single sweep.

**Alternatives Rejected**:
- *One commit for the whole sweep*: unrevertible at useful granularity.
- *Per-file commits*: review noise without additional safety, since the gates are per root.

### ADR-003: Fixture subjects are permanently exempt, enforced twice

**Status**: Proposed — ruling inherited from child 001

**Context**: Benchmark fixture subjects violate the standard by design; they are the inputs a grader is scored against. Editing them silently invalidates every historical result.

**Decision**: Exempt `**/benchmarks/**/fixtures/**` and seeded subject corpora, enforced both as a codemod filter and as a post-hoc diff assertion.

**Consequences**:
- Benchmark history stays comparable, and an accidental edit is caught even if the filter is wrong.
- The standard carries a permanent documented exception, which must be discoverable so a future author does not "fix" the fixtures.

**Alternatives Rejected**:
- *Filter only*: a filter bug would silently corrupt the corpus.
- *Sweep fixtures too*: destroys the comparability of every historical benchmark result.
