---
title: "Feature Specification: Header, Directive and Structure Sweep"
description: "One defect pattern — the file-opening contract — has drifted across roughly 1,400 authored files in every governed language, because exact header shape is documented as a permanently manual gate and nothing ever checked it. This phase closes that pattern with a deterministic codemod run in three independently gated blast-radius lanes, proving behavior preservation with per-file parse checks, per-root verifier deltas against a captured baseline, and per-package test suites."
trigger_phrases:
  - "boxed header sweep"
  - "component header codemod"
  - "use strict directive sweep"
  - "portable shebang sweep"
  - "import group order sweep"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/003-header-directive-and-structure-sweep"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the header and directive sweep phase from the track (b) synthesis proposal"
    next_safe_action: "Wait for child 001's baseline and gate decision, then run T001 to re-derive the census per lane"
    blockers:
      - "Blocked on child 001: the program baseline and the exact-header gate decision"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions:
      - "Q4 - is the gate an opt-in verifier flag or a scripted per-file assertion?"
      - "Q2 - do the non-runtime deep-loop files belong to lane B or to 020?"
    answered_questions: []
---
# Feature Specification: Header, Directive and Structure Sweep

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

The file-opening contract — a boxed module header, an immediate strict-mode directive, a portable shebang, sequential section numbering, and grouped imports — is the single most-violated rule in the repository, and for a structural reason: the alignment verifier checks strict mode and shebangs but has never checked header shape, which the automation reference names a permanently manual gate. Roughly 1,400 authored files drifted behind that blind spot. This phase closes the whole pattern with a deterministic codemod, run in three blast-radius lanes that are gated independently so a syntax error in a benchmark rig can never take down a live hook.

**Key Decisions**: the gate is a machine gate with a captured baseline, so the claim is "N warnings closed, zero new" rather than `PASS`; the invariant is that no changed hunk falls below the first executable line, except separately reviewed import-order hunks.

**Critical Dependencies**: child 001 (baseline capture, gate decision); the documentation-coverage track's code child for lane B; the security register's children for any shared file.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `sk-code/021-code-conformance-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The JavaScript style guide states that all JavaScript files MUST begin with a boxed header identifying the module, 78 characters wide, immediately followed by `'use strict';` for `.js` and `.cjs` files — and that `.mjs` and plugin ESM files do not take the directive. Python and shell files take a `COMPONENT:` header. Shell scripts take the portable `#!/usr/bin/env bash` shebang, which the standard lists under P0 hard blockers. TypeScript sources take a boxed `MODULE:` header and four-group import ordering.

None of the header rules is machine-checked. The alignment verifier checks strict mode (`JS-USE-STRICT`) and shell strict mode (`SH-STRICT-MODE`) and shebang portability, but the automation reference explicitly lists exact headers, naming, comment quality, and module/package-boundary choice as permanently manual gates. The consequence is measurable and was re-derived at HEAD in this session: 19 of 39 promoted compiled-routing modules carry no boxed header; 2 of 5 doctor diagnostics carry none while the verifier returns `PASS` on that directory; 42 of 42 prompt-models benchmark harness modules carry none; all 10 sk-design Python gates carry none; both authored `.github` bridge scripts and the hand-authored Claude statusline script carry none.

Because a mechanical `PASS` never meant conformance, no completion claim in the history of this repository ever falsified the header rule. That is the defect this phase closes, and it is why the phase is a codemod with a machine gate rather than a hand pass.

### Purpose

Close the file-opening contract across every governed language, in a diff whose every hunk is inspectable and provably confined to the region above the first executable statement, verified per file, per root and per package rather than asserted.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — the seven transforms

| Rule | Applies to | Transform |
|------|-----------|-----------|
| **R-HDR-JS** | `.js`, `.cjs`, `.mjs`, `.ts` (non-`.d.ts`) | Insert a 78-character boxed header naming the module, immediately after the shebang if one is present and before any other content. Existing non-canonical preamble prose is folded into the box body, never deleted |
| **R-STRICT** | `.js`, `.cjs` only | Insert `'use strict';` on the line immediately following the header. **Never** added to `.mjs` (ES modules are strict by definition, and the verifier intentionally skips them) or to `.ts` |
| **R-HDR-PY** | `.py` | Insert a `COMPONENT:` header block after the shebang and before the first import or statement; an existing module docstring is preserved and follows the header |
| **R-HDR-SH** | `.sh` | Insert a `COMPONENT:` header block after the shebang and before `set -euo pipefail` |
| **R-SHEBANG** | `.sh` | Rewrite a non-portable shebang (`#!/bin/bash`, `#!/bin/sh` where bash features are used) to `#!/usr/bin/env bash`. Line 1 only |
| **R-SECNUM** | any file using numbered comment sections | Renumber sections sequentially from 1 with no repeats. Comment text is otherwise untouched |
| **R-IMPORTS** | `.ts`, `.js`, `.mjs`, `.cjs` | Reorder import or require statements into built-in, third-party, local groups, blank-line separated. Reordering only — no specifier is added, removed or rewritten |

### In Scope — the three lanes

| Lane | Roots | Why this blast radius |
|------|-------|----------------------|
| **A — runtime-reachable** | `.opencode/bin` (including `lib/compiled-routing`), `.opencode/hooks`, `.opencode/plugins`, `.opencode/scripts` (including `git-hooks`), `.opencode/commands/doctor/scripts`, `.github/hooks/scripts`, `.claude/statusline-command.sh` | A syntax error breaks a live surface: a hook that runs on every edit or commit, a front-door CLI, or a CI bridge |
| **B — tooling** | `.opencode/skills/sk-doc/**/scripts`, `.opencode/skills/sk-design/**`, mcp-code-mode, mcp-figma executable examples, `.opencode/skills/system-deep-loop/shared/**` and `deep-improvement/scripts/**` (non-runtime) | A syntax error breaks an authoring or diagnostic tool; noticed quickly, no runtime outage |
| **C — benchmark harnesses** | `.opencode/skills/sk-prompt/**/benchmarks/**` (harness, grader, runner, deterministic checkers), `.opencode/skills/system-spec-kit/**/benchmarks/**` scripts | A syntax error costs a benchmark rerun. **Fixture subjects are untouched** |

Compiled-routing modules are byte-sensitive: their generated outputs and activation manifests are re-derived and byte-compared after the lane.

### Out of Scope — the exemption list

These are rulings from child 001 and are not re-litigated here.

| Exemption | Reason |
|-----------|--------|
| `**/benchmarks/**/fixtures/**` and seeded subject corpora | Immutable subject data. These files violate the standard *by design* — a fixture using a non-portable shebang, bare Node imports, `any`, or a missing module header is the input a grader is scored against. Editing them silently invalidates every historical benchmark result. Recorded as an accepted exception |
| `dist/`, `external/`, `node_modules/`, `.venv`, `z_archive` | Zero tracked authored files; generated or vendored. `dist/` is verified by rebuild-and-parity, never by style rules |
| `.claude/{commands,skills,specs,changelog,manual-testing-playbook}` and `.claude/hooks/*` | Symlinks sharing an inode with their `.opencode/` source; already governed there. Only `.claude/statusline-command.sh` is hand-authored and in scope |
| `.mjs` files, for **R-STRICT** only | ES modules are strict by definition; the verifier intentionally skips `.mjs` strict-mode enforcement. Adding the directive would be a spurious diff |
| `.d.ts` files | Declaration output, not authored source |
| `system-deep-loop/runtime/**` | Owned by 020 |
| The three `.opencode/bin` git-coordination scripts, for **R-STRICT**-equivalent shell strict mode | Their missing `set -euo pipefail` is deliberate and correctness-critical; owned by child 004. This lane must not "fix" them |
| Pattern and example assets, for naming | Governed manually; naming is child 005's, shebangs are this lane's |

### Out of Scope — behaviour

- **Any change below the first executable line**, except reviewed import-order hunks. A scripted assertion enforces this and blocks the file when violated.
- **Any comment-content change** — that is child 002's.
- **Any module-format, containment, naming, or organisation change** — that is child 005's.

### Files to Change

The finding list names examples; **the census is the authoritative work list.** Counts below were re-derived at HEAD in this session using the box-drawing-character test (a `╔`/`═`/`─`-class header line within the first five lines).

| Lane | Root | Files | Missing header | Findings |
|------|------|-------|----------------|----------|
| A | `.opencode/bin/lib/compiled-routing/**/*.cjs` | 39 | **19** | RB-005-04 |
| A | `.opencode/bin/**/*.cjs` (whole root, incl. the above) | 63 | **26** | RB-005-04 |
| A | `.opencode/hooks/**/*.{cjs,mjs,js}` | 37 | **5** | RB-006-05 |
| A | `.opencode/hooks/**/*.ts` | 5 | 0 | RB-004-23, RB-006-06 (import order, not headers) |
| A | `.opencode/plugins/**/*.{cjs,mjs,js}` | 19 | **1** | RB-006-07 (import order) |
| A | `.opencode/scripts/**/*.sh` | 10 | **9** | RB-006-08, RB-006-09 |
| A | `.opencode/commands/doctor/scripts/*.cjs` | 5 | **2** | RB-010-06; RB-005-05 (strict mode) |
| A | `.github/hooks/scripts/*.sh` | 2 | **2** | RB-006-10 |
| A | `.claude/statusline-command.sh` | 1 | **1** | RB-006-11 |
| B | `.opencode/skills/sk-doc/**/scripts/*.{py,cjs,js,sh}` | 52 | **13** | RB-004-13, RB-004-14, RB-004-15 |
| B | `.opencode/skills/sk-design/**/*.py` | 10 | **10** | RB-007-06, RB-010-07 |
| B | mcp-code-mode `*.{cjs,ts}` | 2 | **2** | RB-010-04, RB-010-05 |
| B | `system-deep-loop/shared/**` + `deep-improvement/scripts/**` `*.{cjs,js,mjs}` | 75 | **5** | RB-003-06, RB-003-07, RB-003-08 |
| B | mcp-figma executable examples | (T001) | (T001) | RB-007-07 (shebang) |
| B | Constitutional staleness CLI, config module, durable Python helper | (T001) | (T001) | RB-002-07, RB-002-09, RB-002-10 |
| C | `.opencode/skills/sk-prompt/**/benchmarks/**/*.cjs` | 42 | **42** | RB-004-17, RB-004-18, RB-004-19, RB-004-20, RB-004-21, RB-002-06 |
| C | `.opencode/skills/system-spec-kit/**/benchmarks/**/*.{cjs,py}` | 3 | **3** | RB-002-08 |
| — | Cross-lane pattern anchor | — | — | RB-004-16, RB-008-04 |

**Census reconciliation is a T001 obligation.** The synthesis's repo-wide census reported 558 `.cjs`, 258 `.py` and 240 `.sh`; a tracked-file count at HEAD in this session returned **566**, **129** and **241**. The `.py` gap is large and most likely a tracked-versus-walked difference (virtualenvs, untracked scratch). Only tracked authored files are in scope, so the tracked count governs — but T001 must reconcile the two explicitly rather than silently adopting one.

**T001 will also surface files that no finding names.** The verifier baseline already shows two shell libraries under `.opencode/scripts/git-hooks/lib/` failing `SH-STRICT-MODE` that appear in no finding. The census, not the finding list, is the work list.

### Findings Covered (34)

| ID | Sev | Lane | Title |
|----|-----|------|-------|
| RB-002-06 | P2 | C | CLI ground-truth generator lacks JavaScript header and strict mode |
| RB-002-07 | P2 | B | Constitutional staleness CLI lacks boxed header (its snake_case naming belongs to 005) |
| RB-002-08 | P2 | C | Benchmark Python scripts omit the required component header |
| RB-002-09 | P2 | B | Durable Python helper omits the component header (its broad-except belongs to 005) |
| RB-002-10 | P2 | B | Config module repeats section number 1 |
| RB-003-06 | P2 | B | Reviewer scorer omits the JavaScript module header |
| RB-003-07 | P2 | B | Shared progress module omits the boxed header and numbered opening sections |
| RB-003-08 | P2 | B | Shared rollout resolver uses a noncanonical component header |
| RB-004-13 | P2 | B | Frontmatter engine lacks the canonical boxed JavaScript header |
| RB-004-14 | P2 | B | Frontmatter shell gate lacks the required component header |
| RB-004-15 | P2 | B | Shared Python naming guards omit component headers |
| RB-004-16 | P2 | A | Compiled-routing CJS scripts omit boxed headers |
| RB-004-17 | P2 | C | MiMo bake-off CJS harness lacks strict mode and boxed headers |
| RB-004-18 | P2 | C | SWE eval-loop CJS scripts lack required headers and strict mode |
| RB-004-19 | P2 | C | Extraction-rerun CJS scripts lack required headers and strict mode |
| RB-004-20 | P2 | C | MiniMax eval-loop CJS scripts lack required headers and strict mode |
| RB-004-21 | P2 | C | MiniMax eval-rig CJS harness lacks required headers and strict mode |
| RB-004-23 | P2 | A | Pi TypeScript imports violate the documented group order |
| RB-005-04 | P2 | A | Promoted compiled-routing modules lack canonical JavaScript headers — **19/39 confirmed at HEAD** |
| RB-005-05 | P2 | A | Doctor freshness diagnostic lacks strict mode and canonical header — **confirmed: `JS-USE-STRICT [WARN]` on `skill-graph-freshness.cjs:1`** |
| RB-006-05 | P2 | A | Hook ESM/CommonJS modules use noncanonical headers |
| RB-006-06 | P2 | A | Pi TypeScript adapters violate quote and import-group conventions |
| RB-006-07 | P2 | A | Plugin import groups place local code before third-party code |
| RB-006-08 | P2 | A | Repository scripts omit required component headers |
| RB-006-09 | P2 | A | Git lifecycle hooks omit component headers |
| RB-006-10 | P2 | A | Copilot bridge wrappers omit component headers — **confirmed: 2/2 at HEAD** |
| RB-006-11 | P2 | A | Hand-authored Claude statusline script omits component header — **confirmed** |
| RB-007-06 | P2 | B | Shared sk-design Python gates omit the canonical component header — **confirmed: 10/10 at HEAD** |
| RB-007-07 | P2 | B | Figma executable examples use a noncanonical Bash shebang |
| RB-008-04 | P2 | — | Exact component-header and strict-mode drift spans durable surfaces *(pattern anchor — its work list is the census)* |
| RB-010-04 | P2 | B | Code Mode postinstall checker lacks the required CJS header and strict mode — **confirmed** |
| RB-010-05 | P2 | B | Code Mode TypeScript entry has a noncanonical header preamble |
| RB-010-06 | P2 | A | Doctor CJS diagnostics omit boxed module headers — **confirmed: 2/5 at HEAD** |
| RB-010-07 | P2 | B | Design contrast checker omits the Python component header |

**[OPERATOR-DECISION: Q2 — the non-runtime deep-loop border]** RB-003-06, RB-003-07 and RB-003-08 sit in `system-deep-loop/shared/**` and `deep-improvement/scripts/**`. Lane B claims them on the reading that 020 owns `runtime/**` only. If ruled otherwise, they move to 020 and lane B's census shrinks by the five files identified above.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every touched file parses | `node --check` for JS/CJS, an ESM parse for `.mjs`, `tsc --noEmit` for TS, `python3 -m py_compile` for Python, `bash -n` plus ShellCheck for shell — per file, not per batch |
| REQ-002 | No hunk falls below the first executable line | A scripted assertion over `git diff` blocks any file with a below-the-line hunk, except hunks on the separately reviewed import-order list |
| REQ-003 | Each lane's verifier delta is a claim, not a `PASS` | Per root: baseline from child 001, post-lane run, and a stated "N closed, zero new". A `PASS` with no delta is not acceptable evidence |
| REQ-004 | No exempt file is touched | `git diff --name-only` intersected with the exemption globs returns empty |
| REQ-005 | Lane A's live surfaces still run | Post-edit hook smoke, pre-commit on a scratch commit, `.opencode/bin` front-door invocations, and the compiled-route manifest test all green |
| REQ-006 | Compiled-routing generated outputs are byte-identical | Regenerate after the lane and `diff` against the pre-lane artifacts; any byte difference blocks the lane |
| REQ-007 | `.mjs` files receive no strict-mode directive | `git diff` contains zero `'use strict'` additions in a `.mjs` file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Every touched package's suite is green with a reported delta | Per package: baseline test count and result captured before the lane, compared after |
| REQ-009 | Import reordering changes no specifier | For each reordered file, the sorted multiset of import specifiers before and after is identical |
| REQ-010 | Header bodies preserve prior preamble content | Any prose that existed above the first executable line is present in the new header, not deleted |
| REQ-011 | The census governs, and its gap against the finding list is recorded | T001 output lists files in the census that no finding named, and findings whose named file the census does not contain |
| REQ-012 | Lane ordering is respected | Lane B does not start before the documentation-coverage track's code child lands; any file on a security-register work list is edited after that child |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: For every lane root, the post-lane verifier run reports the pre-lane finding count minus the closed findings, with zero new findings — stated as a delta against child 001's captured baseline.
- **SC-002**: The header census for each lane root reaches zero missing headers, measured with the same command that produced the baseline count.
- **SC-003**: The below-the-line assertion passes on the whole diff, with the import-order exception list enumerated and individually reviewed.
- **SC-004**: Lane A's live-surface smoke suite is green: the post-edit hook fires, a scratch commit passes pre-commit, each `.opencode/bin` front door runs, and the compiled-route manifest test passes.
- **SC-005**: Compiled-routing regenerated outputs are byte-identical to their pre-lane state.
- **SC-006**: Every touched package's test suite reports the same pass/fail counts as its captured baseline.
- **SC-007**: Zero files matching an exemption glob appear in the diff.
- **SC-008**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A codemod inserts a header above a shebang, making a script non-executable | High — breaks a live hook | R-HDR-* explicitly inserts *after* the shebang; a lane A test executes every touched executable |
| Risk | Import reordering changes evaluation order and therefore behaviour | High | Specifier-multiset equality check; per-package suite; module-initialisation-order smoke on files with side-effectful imports |
| Risk | Compiled-routing header insertion changes a generated byte | High | Byte-parity check on regenerated outputs blocks the lane |
| Risk | The codemod touches a fixture subject and silently invalidates benchmark history | High | Exemption glob enforced as a diff assertion, not just a codemod filter |
| Risk | Adding `set -euo pipefail`-adjacent structure to the three git-coordination scripts | High | Those three are explicitly excluded from this lane; child 004 owns them command-by-command |
| Risk | `'use strict'` added to a `.mjs` file | Medium | Rule scoped to `.js`/`.cjs`; REQ-007 asserts zero such additions |
| Risk | Racing a concurrent rewrite on a shared file | Medium | Lane sequencing plus a work-list diff at T001 |
| Dependency | Child 001 — captured baseline | Red | Without it, every delta claim is unanchored |
| Dependency | Child 001 — Q4 gate decision | Red | Determines whether the header gate is a verifier flag or a scripted assertion |
| Dependency | Documentation-coverage track's code child | Yellow | Lane B sequences after it to avoid racing on the same package's suite |
| Dependency | Child 002 | Green | Independent, but running 002 first makes these diffs smaller |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Header insertion adds bytes to files that hooks read on every edit. The post-edit path's latency must be re-measured on lane A and stay within its existing budget.
- **NFR-P02**: The codemod itself runs offline and deterministically — same input, same output, no network and no model dispatch — so a lane can be re-run to reproduce a diff exactly.

### Security
- **NFR-S01**: No header body may contain a credential, an absolute developer path, or an internal URL.
- **NFR-S02**: File modes are preserved. An executable script must remain executable after the transform; a lane A test asserts this.

### Reliability
- **NFR-R01**: Every lane is independently revertible. A lane's diff is one commit per root, so a bad root reverts without disturbing a good one.
- **NFR-R02**: The codemod is idempotent: a second run over an already-transformed tree produces an empty diff.

---

## 8. EDGE CASES

### Data Boundaries
- A file whose first line is a shebang: the header goes after it, never before.
- A file with an existing non-canonical preamble: the prose is folded into the box body, never dropped.
- A Python file with a module docstring that is read at runtime via `__doc__`: the header precedes the docstring and the docstring is untouched.
- A file with zero imports: R-IMPORTS is a no-op, not an insertion.
- A file already conformant: the codemod produces no diff (idempotence).
- A `.cjs` file that already has `'use strict'` but no header: the header goes above the directive, and the directive is not duplicated.

### Error Scenarios
- The codemod cannot determine a module name: the file is skipped and listed for manual handling rather than given a generated placeholder.
- A parse check fails after transform: that file is reverted immediately and quarantined; the lane does not continue past a parse failure.
- A byte-parity check on a regenerated artifact fails: the entire compiled-routing portion of lane A is reverted.
- A package suite regresses: the lane is reverted to its captured baseline and the failure is investigated before any retry.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 24/25 | Files: ~1,400 in the population, 3 lanes, 15+ roots, 5 languages |
| Risk | 18/25 | Auth: N, API: N, Breaking: Y if a transform is wrong — lane A touches every live hook and front door |
| Research | 8/20 | The transforms are specified; the open work is census reconciliation and per-file module naming |
| Multi-Agent | 8/15 | Workstreams: 3 lanes, independently gated and separately revertible |
| Coordination | 12/15 | Dependencies: child 001, another track's code child, the security register's children |
| **Total** | **70/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Header inserted above a shebang breaks an executable | H | L | Rule inserts after shebang; every touched executable is invoked in lane A |
| R-002 | Import reorder changes side-effect ordering | H | M | Specifier-multiset check plus per-package suite plus init-order smoke |
| R-003 | Compiled-routing generated byte changes | H | M | Byte-parity gate blocks the lane |
| R-004 | Fixture subject edited, benchmark history invalidated | H | L | Diff-level exemption assertion, not just a codemod filter |
| R-005 | `'use strict'` added to `.mjs` | M | M | Rule scoped by extension; REQ-007 asserts zero |
| R-006 | Census undercounts because it uses a tracked-file list | M | M | T001 reconciles tracked versus walked counts explicitly |
| R-007 | Codemod not idempotent, producing churn on re-run | M | L | Idempotence test: second run yields an empty diff |
| R-008 | File mode lost during rewrite | M | L | Mode-preservation assertion in lane A |

---

## 11. USER STORIES

### US-001: A completion claim is falsifiable (Priority: P0)

**As a** reviewer of this sweep, **I want** each lane to report warnings closed and warnings introduced against a captured baseline, **so that** I can tell a real fix from a gate that never looked.

**Acceptance Criteria**:
1. Given the baseline from child 001, When a lane completes, Then its evidence states the pre count, the post count, and zero new findings.
2. Given a lane's evidence, When I re-run the same verifier command, Then I reproduce the post count.

### US-002: The sweep cannot break a live surface (Priority: P0)

**As an** operator whose every edit runs through these hooks, **I want** lane A gated by executing the live surfaces, **so that** a header insertion cannot silently disable my tooling.

**Acceptance Criteria**:
1. Given lane A is complete, When I make a scratch edit, Then the post-edit hook runs.
2. Given lane A is complete, When I make a scratch commit, Then the pre-commit hook runs and blocks a deliberately violating file.
3. Given lane A is complete, When I invoke each `.opencode/bin` front door, Then each runs without a parse error.

### US-003: Benchmark history stays valid (Priority: P1)

**As an** owner of historical benchmark results, **I want** fixture subjects provably untouched, **so that** past scores remain comparable.

**Acceptance Criteria**:
1. Given the full diff, When I intersect it with the fixture exemption globs, Then the result is empty.

---

## 12. OPEN QUESTIONS

- **[OPERATOR-DECISION: Q4 — exact-header automated check]** Is this lane's header gate an opt-in verifier flag delivered by child 001, or a scripted per-file assertion owned here? The flag is preferable because it prevents recurrence; the assertion is the fallback if Q4 is answered "leave manual". *Recommendation: the opt-in flag.*
- **[OPERATOR-DECISION: Q2 — the non-runtime deep-loop border]** Do the `system-deep-loop/shared/**` and `deep-improvement/scripts/**` files belong to lane B or to 020? *Recommendation: lane B.*
- What is the correct module name for each file the codemod cannot infer one for? Resolved per file during the lane, listed rather than generated.
- Does the `.py` census gap (129 tracked versus 258 reported) hide authored files outside the tracked set? T001 resolves this; if it does, the lane B population grows.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
