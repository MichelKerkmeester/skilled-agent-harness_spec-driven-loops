---
title: "Feature Specification: Code README truth and missing orientation"
description: "Twenty code READMEs make claims a reader cannot act on: installers that do not exist behind a broken symlink, a test harness that was deleted, links resolving under a nonexistent directory, a CI workflow that was removed while three live guards go undocumented, and suite counts off by up to sixteen. Three folders that the need-based applicability rule genuinely demands a README for have none. This phase re-derives every claim from source."
trigger_phrases:
  - "readme false claims"
  - "stale readme inventory"
  - "missing code readme"
  - "broken readme link gate"
importance_tier: "high"
contextType: "planning"
parent: "sk-doc/022-code-readme-coverage"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the phase spec from the track-A research synthesis"
    next_safe_action: "Run Task T001 — confirm all 20 findings against HEAD"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions:
      - "Q1 — the three new READMEs need the tree ruling before they can be authored"
    answered_questions:
      - "Classes (a) and (b) are ruling-independent and may start immediately"
      - "The confirmed missing-README set outside runtime/** is three folders, not 122"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Code README Truth And Missing Orientation

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `sk-doc/022-code-readme-coverage` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

These are the only findings in the program with real operator cost. A reader following them runs commands that fail and looks for files that do not exist.

- `install-guides/install-scripts/README.md:35` claims "9 install scripts, 3 real + 6 symlinks". The directory holds 3 real and 3 symlinks, and `install-chrome-devtools.sh` points at `../../skills/mcp-chrome-devtools/…`, which does not exist — `test -e` returns false.
- `scripts/git-hooks/tests/README.md` documents `post-commit-code-graph-invalidation.sh` at three separate lines. The directory holds three other harnesses and not that file.
- `hooks/git/README.md` links resolve under `.opencode/hooks/skills/`, a directory that does not exist.
- `.github/workflows/README.md` documents `isolation-check.yml`, which is absent, while `naming-standard-guard.yml`, `runtime-no-spec-import.yml` and `spec-root-resolution-matrix.yml` are present and mentioned zero times.
- Test READMEs state suite counts as literals and the literals are wrong: one claims five where six exist, one claims three where nineteen exist.
- Three folders have no README and no parent mention: `sk-design/shared/authored-brand` (a reusable validation boundary), `system-spec-kit/scripts/runtime-mirrors` and `system-skill-advisor/mcp-server/scripts/command-bridges` (both carry an authored-versus-generated boundary a reader cannot infer, and both are mentioned zero times by their parent README).

Every one of these is a retyped or never-updated claim. Two of the research findings themselves carried stale counts for the same reason, which is the argument for deriving counts instead of writing them.

### Purpose

Make every claim in these twenty files true against the source, and give the three genuinely uncovered folders orientation — then install the mechanical gates that stop the class from recurring.

### Non-Goals

- Structural conformance work (trees, separators, heading case). That is `003`. This phase touches structure only where a file is being rewritten anyway.
- Any content in `system-deep-loop` mode-root READMEs owned by WS1 `032`.
- Any file under `runtime/**`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Three classes.

**(a) Non-runnable or broken content** — links, commands and symlinks that do not resolve.
**(b) Stale inventories** — counts and file lists that no longer match the directory.
**(c) Genuinely missing orientation** — the three folders the need-based rule does demand a README for. **[OPERATOR-DECISION: Q1 — tree vs table]** decides what tree shape these three carry.

### Out of Scope

- Structural sweep of substantively-accurate READMEs — `003` owns it.
- `runtime/**` — `036/019` owns it.
- `shared/rollout/README.md` governance contradiction — WS1 `F-036-05` owns it.

### Findings in scope

| ID | Sev | Class | File | Defect |
|----|-----|-------|------|--------|
| `RA-007-01` | P1 | a | `.opencode/install-guides/install-scripts/README.md` | Claims 9 installers (3 real + 6 symlinks); actual 3 real + 3 symlinks, one symlink broken |
| `RA-007-02` | P1 | a | `.opencode/hooks/git/README.md` | Links resolve under a nonexistent `.opencode/hooks/skills/` |
| `RA-007-03` | P1 | a | `.opencode/scripts/git-hooks/tests/README.md` | Documents a deleted harness at `:29`, `:40`, `:54` |
| `RA-010-02` | P1 | a | `.github/workflows/README.md` | Documents removed `isolation-check.yml` at `:32`, `:49`; three live guards undocumented |
| `RA-004-01` | P1 | b | `system-deep-loop/deep-improvement/scripts/agent-improvement/tests/README.md` | README and frontmatter both say five Vitest suites; six exist |
| `RA-004-02` | P1 | b | `system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/README.md` | Says three Vitest suites; **19** exist (research recorded 20 — carry the correction) |
| `RA-004-03` | P1 | b | `system-deep-loop/deep-research/scripts/README.md` | Three live entrypoints mentioned zero times |
| `RA-004-04` | P1 | b | `system-deep-loop/deep-review/scripts/README.md` | Stale entrypoint inventory |
| `RA-005-20` | P2 | b | `sk-doc/sk-create-skill/scripts/README.md` | Stale inventory |
| `RA-005-21` | P2 | b | `sk-doc/sk-create-skill/scripts/lib/README.md` | Stale inventory |
| `RA-005-22` | P2 | b | `sk-doc/sk-create-skill/scripts/tests/README.md` | Stale inventory |
| `RA-005-33` | P2 | b | `system-skill-advisor/mcp-server/handlers/skill-graph/README.md` | Stale inventory |
| `RA-005-38` | P2 | b | `system-skill-advisor/mcp-server/lib/skill-graph/README.md` | Stale inventory |
| `RA-006-05` | P2 | b | `.opencode/commands/doctor/scripts/README.md` | Stale entrypoint inventory |
| `RA-007-04` | P2 | b | `.opencode/plugins/README.md` | Two loaded plugins omitted |
| `RA-007-05` | P2 | b | `.opencode/plugins/tests/README.md` | Stale inventory |
| `RA-007-06` | P2 | b | `.opencode/scripts/README.md` | Live entrypoints omitted |
| `RA-002-01` | P2 | c | `.opencode/skills/sk-design/shared/authored-brand/` | No README; 3 files incl. a reusable validation boundary |
| `RA-003-01` | P2 | c | `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/` | No README; parent `scripts/README.md` mentions it zero times |
| `RA-005-01` | P2 | c | `.opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/` | No README; 4 files incl. a generated JSON and its deriver; parent mentions it zero times |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| The 17 files listed above under classes (a) and (b) | Modify | Re-derive every claim from source; replace literal counts |
| `.opencode/skills/sk-design/shared/authored-brand/README.md` | Create | Orientation for the validation boundary |
| `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/README.md` | Create | Orientation incl. the authored-vs-generated boundary |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/README.md` | Create | Orientation incl. the generated-JSON boundary |
| Parent READMEs of the three new folders | Modify | Add the child to the parent's inventory so it is discoverable |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every inline-code filename, relative link and command path in the touched set resolves on disk from the README's own location | The referenced-path resolution script reports zero unresolved across all 20 files |
| REQ-002 | No README in scope states a file or suite count as a retyped literal | Each stated count is either derived at author time and asserted by the gate (`ls \| wc -l` versus the stated number), or replaced with a "selected files" label |
| REQ-003 | Every documented validation command runs green from the repo root, or is explicitly marked as an example | Commands in `git-hooks/tests` and the three benchmark test READMEs are actually executed and their output recorded |
| REQ-004 | No broken symlink is presented as an available surface | `find .opencode/install-guides/install-scripts -type l ! -exec test -e {} \; -print` returns empty, or the README states the surface is unavailable |
| REQ-005 | Every claim is re-derived from source, never edited from the old text | Per-file evidence row names the source read, not the prior README wording |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The three new READMEs pass `001`'s code-folder validator mode | Validator run over the three files: zero blocking issues. **[OPERATOR-DECISION: Q1 — tree vs table]** |
| REQ-007 | Each of the three new folders is reachable from its parent README | Parent README names the child folder and its purpose |
| REQ-008 | A second reader audits a 5-of-20 sample against source | Sample audit recorded with per-file verdicts; fixes are hypotheses too |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader can follow any of the 20 files and every path, command and count they encounter is real.
- **SC-002**: All 8 P1 nonconformances outside `runtime/**` are closed.
- **SC-003**: The referenced-path resolution gate and the derived-count gate exist as runnable scripts, so the class cannot silently return.
- **SC-004**: The three previously invisible folders are documented and discoverable from their parents.
- **SC-005**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` → Errors: 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fixing from the old text instead of the source reproduces the drift | High | REQ-005: every evidence row names the source read |
| Risk | New literal counts introduced while fixing old ones | High | REQ-002 forbids retyped literals outright |
| Risk | A structural rewrite smuggles in a factual change | Medium | Structure is `003`'s job; touch it here only where the file is already being rewritten |
| Risk | The sweep in `003` later reformats these files and breaks a reference | Medium | `003` re-runs this phase's resolution gate per lane |
| Dependency | `001`'s ruling | Blocks class (c) only | Start (a) and (b) immediately; hold the three new READMEs |
| Dependency | `001`'s validator mode | REQ-006 | The three new files are the mode's first real consumers |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The resolution gate evaluates paths relative to each README's own location, so it gives the same verdict from any CWD.
- **NFR-R02**: The derived-count gate fails closed — an unparseable count is a failure, not a skip.

### Security
- **NFR-S01**: No credential, token or machine-local absolute path appears in any authored README.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A path inside a fenced example block that is deliberately illustrative: must be markable as an example rather than failing the gate.
- A count that is legitimately approximate ("dozens of fixtures"): allowed only as a non-numeric label.
- A symlink target that exists but points outside the repo: treated as unavailable.

### Error Scenarios
- A documented command that requires a daemon or network: marked as an example per `SKILL.md:187` rather than executed.
- A parent README that itself carries a stale inventory when the new child is added: fix the child's row only; the parent's other rows belong to `003`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 20 files, 3 new, plus two gate scripts |
| Risk | 6/25 | Documentation-only; no runtime behavior |
| Research | 8/20 | Every claim must be re-derived from source |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Class (c) is blocked on the tree ruling. Should the three new READMEs be authored provisionally and re-shaped after the ruling, or held? *Recommendation: hold — authoring twice is the more expensive path and the folders have been undocumented for longer than this phase will take.*
- Should the referenced-path resolution gate run in CI over the whole repo after this phase, or only over the touched set? *Recommendation: touched set here; repo-wide adoption is a separate decision with its own baseline.*
<!-- /ANCHOR:questions -->
