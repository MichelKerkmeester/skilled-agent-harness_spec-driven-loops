---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
The README freshness fix commits 0725425d46..HEAD on branch worktrees/122-readme-freshness-research: wording fixes F1 to F23 in the root README and eleven related docs, the removal of parent-skill doctor check 13c with its tests, the frontmatter versioning standard line, and the phase's spec docs. Executor: cli-devin, model deepseek-v4-1-flash-max. Stop policy: max-iterations (5). Diff for the product files: `specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- The README `version:` lines of system-spec-kit, system-skill-advisor, sk-git, sk-doc and system-deep-loop: the operator ruled that every doc keeps its own version.
- `.skilled/changelog/skilled/v4.0.0.4.md`: release notes are written elsewhere.
- README prose outside the lines this phase changed.

---

## 5. STOP CONDITIONS
- Five iterations complete (stop policy max-iterations; convergence is telemetry only).
- A usage limit or a missing `devin` binary stops the run with no fallback executor.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Re-deriving every count from the tree itself (agent glob, command glob, validator-registry read) instead of trusting the diff: all count families matched the new text. (iteration 1)
- Reading the truncated grep output from its overflow file: 16 pattern matches reconciled exactly to the 15 fixed anchors plus the pre-existing line 1336, closing the residual-stale-count question with file evidence. (iteration 1)
- Gate/flag counts re-derived directly from pre-commit (eleven `# ---` headers: ten implemented gates plus a CI-only tool-ownership note at 919-922; nine distinct SPECKIT_SKIP_* flags): the README's ten/nine text matched exactly. (iteration 2)
- Doc-to-code claims closed by direct reads: surfaceHint (schema 1-64 plus `--surface-hint` argv to the compiled-route front door), checkVersionParity (ROUTER.md plus three JSON files vs SKILL.md), the cli-hermes probe line, and the 13c removal (no residual reporting code or docs in .skilled). (iteration 2)
- Diff-read of the review patch proved the 13c removal surgical: the checker's only hunks are the section comment `(13a-13d)` to `(13a, 13b, 13d)`, the README_VERSION_WARN_ONLY set plus checkReadmeVersion block, and the call site in checkVersionParity. (iteration 3)
- Guard-value proof for the new test: against the pre-removal checker the assertion matches the restored FAIL line and the test fails (pass 0, fail 1), so it proves the removal rather than describing it. (iteration 3)
- Symbol-survival scan after the removal: `warn` keeps its definition and four call sites (178, 188, 596, 997, 1252) and `markdownVersion` keeps four (1812, 1826, 1843, 1850). (iteration 3)
- Rule-consistency check: the per-doc version standard gives every non-SKILL doc its own edition, so 13c's README == SKILL.md demand contradicted the standard it was checked against. (iteration 3)
- Ledger-vs-tree recount: every count the ledger cites was re-derived by reading the cited lines: root README counts (11/37/41/7-warn/20) match the ledger text at every anchor, and the related-doc fixes F18-F23 read as proposed. (iteration 4)
- Remaining-row verification: RM-2 read at pre-commit:919-924 (header, CI-only note, no gate body), RM-3 confirmed against checkVersionParity (13a at parent-skill-check.cjs:1849-1863), frontmatter-versioning.md:30 and the bump engine's raise path (frontmatter-version.mjs:409-414). (iteration 4)
- Diff scope reconciliation: the patch's diff --git list holds exactly 15 product files (11 related docs plus the root README, the checker, its test and the versioning reference), matching the ledger's "15 files across six dispatches". (iteration 4)
- Full-diff security scan: all 491 patch lines read directly (every changed line of the 15 product files); the only credential-adjacent text is the `pk_` prefix mention and the `cupt auth`/OAuth wording at README.md:1435 — no token value, secret or absolute user path in any changed line. (iteration 5)
- Version-line sweep: exactly seven raises, each a single third-segment step with the fourth segment reset — uniform, consistent with the hook's raise path recorded in iteration 4. (iteration 5)

---

## 9. WHAT FAILED
- Directory-wide grep for the ClickUp counts (pattern 111 / 35 scenarios / cupt auth / OAuth / pk_ token over **/*.md): OAuth matches flooded the result cap before reaching feature-catalog.md and the playbook, so doc-level counts stayed corroborated-only. (iteration 1)
- Glob over .{codex,cursor,devin,opencode,hermes}/agents/*.md returned nothing in this worktree: the mirror dirs are not materialized here, so the mirror sentence could not be closed locally. (iteration 1)
- Independent re-derivation of every remaining F12-F23 related-doc claim (sk-git 9 categories, sk-design-chart 29 forms, deep-loop runtime changelog/, INSTALL-GUIDE header, system-spec-kit Node engines and hooks adapters, spec docs): not reached within the iteration budget; carried forward. (iteration 2)
- Both identifier scans hit their result caps on token collisions (bare `13c` inside T-013c test ids, `#b3813c` hex, sha256 and image-url substrings), so the bare-`13c` sweep is corroborated-only; the identifier-precise terms (checkReadmeVersion, README_VERSION_WARN_ONLY) returned zero product hits. (iteration 3)
- RM-1's exact printed string (ERROR: Unknown command: list-tools) cannot be reproduced without execution: the message template and its list-tools hint path are present (skill-advisor-cli.ts:544,764,1574,1078), but this dispatch runs no shell, so the row stays corroborated-only. (iteration 4)
- The runtime-mirror sentence could not be closed again: the .codex/.cursor/.devin/.opencode/.hermes agent trees are not materialized in this worktree, so agent_cross_runtime stays blocked on the orchestrator's readlink evidence. (iteration 4)
- The five changed docs without version hunks (bin/README.md, bin/lib/README.md, .skilled/scripts/git-hooks/README.md, the two runtime READMEs) were not re-read to confirm they carry no version field: no shell in this dispatch and the read budget went to the full 491-line diff, so that sub-question stays corroborated-only. (iteration 5)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`cli-hermes` command claim** — corroborated by the mode's own integration-patterns probe step (evidence: `integration-patterns.md:30`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`cli-hermes` command claim** — corroborated by the mode's own integration-patterns probe step (evidence: `integration-patterns.md:30`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`cli-hermes` command claim** — corroborated by the mode's own integration-patterns probe step (evidence: `integration-patterns.md:30`).

### **`frontmatter-versioning.md:122` naming a removed or wrong check** — the sentence now names the version check that compares `ROUTER.md` and the three JSON files with `SKILL.md`, and that is what the code does (evidence: `parent-skill-check.cjs:1849–1854`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`frontmatter-versioning.md:122` naming a removed or wrong check** — the sentence now names the version check that compares `ROUTER.md` and the three JSON files with `SKILL.md`, and that is what the code does (evidence: `parent-skill-check.cjs:1849–1854`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`frontmatter-versioning.md:122` naming a removed or wrong check** — the sentence now names the version check that compares `ROUTER.md` and the three JSON files with `SKILL.md`, and that is what the code does (evidence: `parent-skill-check.cjs:1849–1854`).

### **`pre-commit` eleventh header contradicting "ten"** — the 919 header is an explicit CI-only note with no gate body (evidence: `pre-commit:919–924`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`pre-commit` eleventh header contradicting "ten"** — the 919 header is an explicit CI-only note with no gate body (evidence: `pre-commit:919–924`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`pre-commit` eleventh header contradicting "ten"** — the 919 header is an explicit CI-only note with no gate body (evidence: `pre-commit:919–924`).

### **`surfaceHint` documentation drift** — schema bounds, argv forwarding and unknown-surface handling all match the README sentence (evidence: `advisor-tool-schemas.ts:251`, `handlers/advisor-recommend.ts:381`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`surfaceHint` documentation drift** — schema bounds, argv forwarding and unknown-surface handling all match the README sentence (evidence: `advisor-tool-schemas.ts:251`, `handlers/advisor-recommend.ts:381`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`surfaceHint` documentation drift** — schema bounds, argv forwarding and unknown-surface handling all match the README sentence (evidence: `advisor-tool-schemas.ts:251`, `handlers/advisor-recommend.ts:381`).

### **git-hooks README sub-gate/bypass count drift** — ten implemented gates and nine bypass flags in `pre-commit`; the README's ten/nine text matches the named set exactly; zero residual "nine"/"eight" counts in the README (evidence: `pre-commit:93–924`, `README.md:24,110`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **git-hooks README sub-gate/bypass count drift** — ten implemented gates and nine bypass flags in `pre-commit`; the README's ten/nine text matches the named set exactly; zero residual "nine"/"eight" counts in the README (evidence: `pre-commit:93–924`, `README.md:24,110`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **git-hooks README sub-gate/bypass count drift** — ten implemented gates and nine bypass flags in `pre-commit`; the README's ten/nine text matches the named set exactly; zero residual "nine"/"eight" counts in the README (evidence: `pre-commit:93–924`, `README.md:24,110`).

### **Incomplete 13c removal** — no reporting code, constants or docs referencing the check remain in `.skilled`; tests updated (evidence: `.skilled` grep for `13c-readme|checkReadmeVersion|README_VERSION_WARN_ONLY` returns only the new negative assertion at `tests:437`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Incomplete 13c removal** — no reporting code, constants or docs referencing the check remain in `.skilled`; tests updated (evidence: `.skilled` grep for `13c-readme|checkReadmeVersion|README_VERSION_WARN_ONLY` returns only the new negative assertion at `tests:437`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Incomplete 13c removal** — no reporting code, constants or docs referencing the check remain in `.skilled`; tests updated (evidence: `.skilled` grep for `13c-readme|checkReadmeVersion|README_VERSION_WARN_ONLY` returns only the new negative assertion at `tests:437`).

### **Third-party import in `bin/lib`** — 21 bare specifiers, all Node core; no npm package in any module or in the generated `compiled-routing/**` closure (evidence: bare-specifier scan over `.skilled/bin/lib/*.cjs`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Third-party import in `bin/lib`** — 21 bare specifiers, all Node core; no npm package in any module or in the generated `compiled-routing/**` closure (evidence: bare-specifier scan over `.skilled/bin/lib/*.cjs`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Third-party import in `bin/lib`** — 21 bare specifiers, all Node core; no npm package in any module or in the generated `compiled-routing/**` closure (evidence: bare-specifier scan over `.skilled/bin/lib/*.cjs`).

### `agent_cross_runtime` (overlay): blocked — the `.codex/.cursor/.devin/.opencode/.hermes` agent trees are not materialized in this worktree (same limitation as iteration 1), so the README:933 mirror sentence rests on the orchestrator's `readlink` evidence recorded in the ledger's F11 row. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `agent_cross_runtime` (overlay): blocked — the `.codex/.cursor/.devin/.opencode/.hermes` agent trees are not materialized in this worktree (same limitation as iteration 1), so the README:933 mirror sentence rests on the orchestrator's `readlink` evidence recorded in the ledger's F11 row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` (overlay): blocked — the `.codex/.cursor/.devin/.opencode/.hermes` agent trees are not materialized in this worktree (same limitation as iteration 1), so the README:933 mirror sentence rests on the orchestrator's `readlink` evidence recorded in the ledger's F11 row.

### `checklist_evidence` (core): **pending** — deferred to the traceability iteration. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence` (core): **pending** — deferred to the traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): **pending** — deferred to the traceability iteration.

### `checklist_evidence` (core): partial — tasks.md's completion block contradicts its own open tasks (finding 2); every other checklist row carries evidence that checks out (CHK-FIX-005's "23 F rows, 4 DC rows, 3 RM rows" counts match the ledger exactly). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence` (core): partial — tasks.md's completion block contradicts its own open tasks (finding 2); every other checklist row carries evidence that checks out (CHK-FIX-005's "23 F rows, 4 DC rows, 3 RM rows" counts match the ledger exactly).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): partial — tasks.md's completion block contradicts its own open tasks (finding 2); every other checklist row carries evidence that checks out (CHK-FIX-005's "23 F rows, 4 DC rows, 3 RM rows" counts match the ledger exactly).

### `feature_catalog_code` (overlay): pass — the 111-feature catalog + 35-scenario playbook text at README.md:881 matches the research's re-run counts [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md:21]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `feature_catalog_code` (overlay): pass — the 111-feature catalog + 35-scenario playbook text at README.md:881 matches the research's re-run counts [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md:21].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` (overlay): pass — the 111-feature catalog + 35-scenario playbook text at README.md:881 matches the research's re-run counts [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md:21].

### `playbook_capability` (overlay): pass — the sk-git README reads 9 categories at `:204`, `:267` and `:288` with zero residual "8 categories", and the unresolved scenario number is deliberately dropped [SOURCE: .skilled/skills/sk-git/README.md:204]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `playbook_capability` (overlay): pass — the sk-git README reads 9 categories at `:204`, `:267` and `:288` with zero residual "8 categories", and the unresolved scenario number is deliberately dropped [SOURCE: .skilled/skills/sk-git/README.md:204].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` (overlay): pass — the sk-git README reads 9 categories at `:204`, `:267` and `:288` with zero residual "8 categories", and the unresolved scenario number is deliberately dropped [SOURCE: .skilled/skills/sk-git/README.md:204].

### `skill_agent` (overlay): notApplicable — the diff changes docs and one doctor checker; no skill↔agent mapping surface moved. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `skill_agent` (overlay): notApplicable — the diff changes docs and one doctor checker; no skill↔agent mapping surface moved.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` (overlay): notApplicable — the diff changes docs and one doctor checker; no skill↔agent mapping surface moved.

### `spec_code` (core): **partial** — carried; the maintainability read adds no new spec-row mapping, and spec-doc reconciliation remains pending. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code` (core): **partial** — carried; the maintainability read adds no new spec-row mapping, and spec-doc reconciliation remains pending.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): **partial** — carried; the maintainability read adds no new spec-row mapping, and spec-doc reconciliation remains pending.

### `spec_code` (core): pass — every ledger proof reached bears out. Root README counts match the ledger text at every anchor: 11 agents (`:24`, `:66`, `:98`, `:125`, `:933`), 37 commands (`:80`, `:1074`), 41 rules / seven warn-only (`:147`, `:421`, `:426`, `:785`), 20 doctor workflows (`:1278`), the ClickUp auth rewrite and 111/35 catalog counts (`:881`, `:1435`); zero stale tokens remain (12 Specialized, Twelve specialized, 39 command, 42 rules, 42 validation, 19 underlying, 96-feature, 37-scenario, CLICKUP_API_KEY) [SOURCE: README.md:881]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code` (core): pass — every ledger proof reached bears out. Root README counts match the ledger text at every anchor: 11 agents (`:24`, `:66`, `:98`, `:125`, `:933`), 37 commands (`:80`, `:1074`), 41 rules / seven warn-only (`:147`, `:421`, `:426`, `:785`), 20 doctor workflows (`:1278`), the ClickUp auth rewrite and 111/35 catalog counts (`:881`, `:1435`); zero stale tokens remain (12 Specialized, Twelve specialized, 39 command, 42 rules, 42 validation, 19 underlying, 96-feature, 37-scenario, CLICKUP_API_KEY) [SOURCE: README.md:881].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): pass — every ledger proof reached bears out. Root README counts match the ledger text at every anchor: 11 agents (`:24`, `:66`, `:98`, `:125`, `:933`), 37 commands (`:80`, `:1074`), 41 rules / seven warn-only (`:147`, `:421`, `:426`, `:785`), 20 doctor workflows (`:1278`), the ClickUp auth rewrite and 111/35 catalog counts (`:881`, `:1435`); zero stale tokens remain (12 Specialized, Twelve specialized, 39 command, 42 rules, 42 validation, 19 underlying, 96-feature, 37-scenario, CLICKUP_API_KEY) [SOURCE: README.md:881].

### 13c removal surgicalness: the checker's only hunks are the section comment, the 13c block and its call site; no other line changed (iteration 3, evidence: review-diff.patch:41-82) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: 13c removal surgicalness: the checker's only hunks are the section comment, the 13c block and its call site; no other line changed (iteration 3, evidence: review-diff.patch:41-82)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 13c removal surgicalness: the checker's only hunks are the section comment, the 13c block and its call site; no other line changed (iteration 3, evidence: review-diff.patch:41-82)

### Absolute private path in the changed surface — all path mentions repo-relative (iteration 5, evidence: review-diff.patch:1-491). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Absolute private path in the changed surface — all path mentions repo-relative (iteration 5, evidence: review-diff.patch:1-491).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Absolute private path in the changed surface — all path mentions repo-relative (iteration 5, evidence: review-diff.patch:1-491).

### ASCII box misalignment at README.md:125 and :147 (evidence: line-by-line column check of both boxes). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: ASCII box misalignment at README.md:125 and :147 (evidence: line-by-line column check of both boxes).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: ASCII box misalignment at README.md:125 and :147 (evidence: line-by-line column check of both boxes).

### Box, tree or table breakage from the wording fixes — edges and columns verified on every changed block (iteration 5, evidence: review-diff.patch:137-148, 293-298, 405-422). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Box, tree or table breakage from the wording fixes — edges and columns verified on every changed block (iteration 5, evidence: review-diff.patch:137-148, 293-298, 405-422).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Box, tree or table breakage from the wording fixes — edges and columns verified on every changed block (iteration 5, evidence: review-diff.patch:137-148, 293-298, 405-422).

### ClickUp env-var staleness and auth wording (evidence: skill references above). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: ClickUp env-var staleness and auth wording (evidence: skill references above).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: ClickUp env-var staleness and auth wording (evidence: skill references above).

### Command/rule/agent count staleness (evidence: tree and registry recounts above). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Command/rule/agent count staleness (evidence: tree and registry recounts above).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Command/rule/agent count staleness (evidence: tree and registry recounts above).

### Commit agreement: pass — tasks T003–T005 map to the named SHAs, and the ledger's four product commits match the dispatch's commit list; the spec-docs commit is packet documentation, recorded as an edge case below. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Commit agreement: pass — tasks T003–T005 map to the named SHAs, and the ledger's four product commits match the dispatch's commit list; the spec-docs commit is packet documentation, recorded as an edge case below.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Commit agreement: pass — tasks T003–T005 map to the named SHAs, and the ledger's four product commits match the dispatch's commit list; the spec-docs commit is packet documentation, recorded as an edge case below.

### Dead code after the removal: `warn` (178, 188, 596, 997, 1252) and `markdownVersion` (1812, 1826, 1843, 1850) keep live call sites (iteration 3, evidence: parent-skill-check.cjs) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Dead code after the removal: `warn` (178, 188, 596, 997, 1252) and `markdownVersion` (1812, 1826, 1843, 1850) keep live call sites (iteration 3, evidence: parent-skill-check.cjs)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dead code after the removal: `warn` (178, 188, 596, 997, 1252) and `markdownVersion` (1812, 1826, 1843, 1850) keep live call sites (iteration 3, evidence: parent-skill-check.cjs)

### Disproving R4-P2-001 or R4-P2-002 — no counterevidence found; both stay active (iteration 5). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Disproving R4-P2-001 or R4-P2-002 — no counterevidence found; both stay active (iteration 5).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Disproving R4-P2-001 or R4-P2-002 — no counterevidence found; both stay active (iteration 5).

### F-row completeness: no 023 Section 11 row is missing from the ledger; every row is Fixed with a proof. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: F-row completeness: no 023 Section 11 row is missing from the ledger; every row is Fixed with a proof.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: F-row completeness: no 023 Section 11 row is missing from the ledger; every row is Fixed with a proof.

### F1–F23 completeness vs 023 Section 11: pass — all 23 rows exist in the ledger as `Fixed` with backticked proofs, and the DC-1 to DC-4 rows cover the 13c retirement [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md:170]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: F1–F23 completeness vs 023 Section 11: pass — all 23 rows exist in the ledger as `Fixed` with backticked proofs, and the DC-1 to DC-4 rows cover the 13c retirement [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md:170].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: F1–F23 completeness vs 023 Section 11: pass — all 23 rows exist in the ledger as `Fixed` with backticked proofs, and the DC-1 to DC-4 rows cover the 13c retirement [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md:170].

### Ledger counts vs the READMEs: zero residual stale values in scope (targeted scans over README.md and the related docs). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Ledger counts vs the READMEs: zero residual stale values in scope (targeted scans over README.md and the related docs).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ledger counts vs the READMEs: zero residual stale values in scope (targeted scans over README.md and the related docs).

### Ledger counts vs the related docs: pass — F18 "Node.js 22.12 or newer" at spec-kit README `:49`, F19 "Devin, OpenCode, and Pi" at runtime README `:26`, F20 9 categories, F21 "twenty-nine forms" at sk-doc README `:220`, F23 `changelog/` tree line at deep-loop runtime README `:25`; F22's body version line is deleted in the diff [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:183]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Ledger counts vs the related docs: pass — F18 "Node.js 22.12 or newer" at spec-kit README `:49`, F19 "Devin, OpenCode, and Pi" at runtime README `:26`, F20 9 categories, F21 "twenty-nine forms" at sk-doc README `:220`, F23 `changelog/` tree line at deep-loop runtime README `:25`; F22's body version line is deleted in the diff [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:183].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ledger counts vs the related docs: pass — F18 "Node.js 22.12 or newer" at spec-kit README `:49`, F19 "Devin, OpenCode, and Pi" at runtime README `:26`, F20 9 categories, F21 "twenty-nine forms" at sk-doc README `:220`, F23 `changelog/` tree line at deep-loop runtime README `:25`; F22's body version line is deleted in the diff [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/scratch/review-diff.patch:183].

### New-test guard value: the test fails against the pre-removal checker (assertion matches the restored FAIL line; pass 0 / fail 1), so it proves the removal (iteration 3, evidence: review-diff.patch:102-113; parent-skill-check-invariants.test.cjs:437) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: New-test guard value: the test fails against the pre-removal checker (assertion matches the restored FAIL line; pass 0 / fail 1), so it proves the removal (iteration 3, evidence: review-diff.patch:102-113; parent-skill-check-invariants.test.cjs:437)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New-test guard value: the test fails against the pre-removal checker (assertion matches the restored FAIL line; pass 0 / fail 1), so it proves the removal (iteration 3, evidence: review-diff.patch:102-113; parent-skill-check-invariants.test.cjs:437)

### Off-pattern or multi-step version changes — all seven raises are one-step third-segment raises (iteration 5, evidence: review-diff.patch:169-170, 191-192, 211-212, 233-234, 255-256, 307-308, 338-339). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Off-pattern or multi-step version changes — all seven raises are one-step third-segment raises (iteration 5, evidence: review-diff.patch:169-170, 191-192, 211-212, 233-234, 255-256, 307-308, 338-339).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Off-pattern or multi-step version changes — all seven raises are one-step third-segment raises (iteration 5, evidence: review-diff.patch:169-170, 191-192, 211-212, 233-234, 255-256, 307-308, 338-339).

### Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): not in scope for this dimension; unchanged. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): not in scope for this dimension; unchanged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): not in scope for this dimension; unchanged.

### Parent packet rows: pass — phase-map row 24 and the 023→024 transition row are present and consistent [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/spec.md:140]; the binding row and the "024 added" log row (criterion 1 = 25, criterion 2 stays 105 until the 024 summary completes) match the phase state [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/goal.md:163]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Parent packet rows: pass — phase-map row 24 and the 023→024 transition row are present and consistent [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/spec.md:140]; the binding row and the "024 added" log row (criterion 1 = 25, criterion 2 stays 105 until the 024 summary completes) match the phase state [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/goal.md:163].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Parent packet rows: pass — phase-map row 24 and the 023→024 transition row are present and consistent [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/spec.md:140]; the binding row and the "024 added" log row (criterion 1 = 25, criterion 2 stays 105 until the 024 summary completes) match the phase state [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/goal.md:163].

### Per-doc version rule protection: READMEs carry their own edition under the standard; 13c's README == SKILL.md demand contradicted it and had to warn-exempt four hubs (iteration 3, evidence: frontmatter-versioning.md:17,30; review-diff.patch:54-56) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Per-doc version rule protection: READMEs carry their own edition under the standard; 13c's README == SKILL.md demand contradicted it and had to warn-exempt four hubs (iteration 3, evidence: frontmatter-versioning.md:17,30; review-diff.patch:54-56)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Per-doc version rule protection: READMEs carry their own edition under the standard; 13c's README == SKILL.md demand contradicted it and had to warn-exempt four hubs (iteration 3, evidence: frontmatter-versioning.md:17,30; review-diff.patch:54-56)

### Related-doc repeat staleness: no stale repeat remains in the docs this phase touched. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Related-doc repeat staleness: no stale repeat remains in the docs this phase touched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Related-doc repeat staleness: no stale repeat remains in the docs this phase touched.

### Residual stale counts elsewhere in README.md (evidence: targeted scan, zero residual matches). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Residual stale counts elsewhere in README.md (evidence: targeted scan, zero residual matches).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Residual stale counts elsewhere in README.md (evidence: targeted scan, zero residual matches).

### RM-1: corroborated — the "Unknown command: …" template and its list-tools hint path exist in the advisor CLI (`skill-advisor-cli.ts:544,764,1574,1078`), and no README claims otherwise; the exact printed string cannot be reproduced without execution, so it stays corroborated-only. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: RM-1: corroborated — the "Unknown command: …" template and its list-tools hint path exist in the advisor CLI (`skill-advisor-cli.ts:544,764,1574,1078`), and no README claims otherwise; the exact printed string cannot be reproduced without execution, so it stays corroborated-only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: RM-1: corroborated — the "Unknown command: …" template and its list-tools hint path exist in the advisor CLI (`skill-advisor-cli.ts:544,764,1574,1078`), and no README claims otherwise; the exact printed string cannot be reproduced without execution, so it stays corroborated-only.

### RM-2: pass — `pre-commit:919` carries the tool-ownership-map header, a CI-only note explains why there is no body, and `exit 0` follows; the README's ten-gate count is unaffected [SOURCE: .skilled/scripts/git-hooks/pre-commit:919]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: RM-2: pass — `pre-commit:919` carries the tool-ownership-map header, a CI-only note explains why there is no body, and `exit 0` follows; the README's ten-gate count is unaffected [SOURCE: .skilled/scripts/git-hooks/pre-commit:919].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: RM-2: pass — `pre-commit:919` carries the tool-ownership-map header, a CI-only note explains why there is no body, and `exit 0` follows; the README's ten-gate count is unaffected [SOURCE: .skilled/scripts/git-hooks/pre-commit:919].

### RM-3: pass — check 13a (`checkVersionParity`) requires `ROUTER.md` and the three JSON files to carry the SKILL.md version [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1849]; the standard lists `ROUTER.md` as carrying its own edition [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30]; and the bump engine raises a non-SKILL doc whose body changed [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:409]. The row's open-conflict framing is accurate and already declared in Known Limitations. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: RM-3: pass — check 13a (`checkVersionParity`) requires `ROUTER.md` and the three JSON files to carry the SKILL.md version [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1849]; the standard lists `ROUTER.md` as carrying its own edition [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30]; and the bump engine raises a non-SKILL doc whose body changed [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:409]. The row's open-conflict framing is accurate and already declared in Known Limitations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: RM-3: pass — check 13a (`checkVersionParity`) requires `ROUTER.md` and the three JSON files to carry the SKILL.md version [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1849]; the standard lists `ROUTER.md` as carrying its own edition [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30]; and the bump engine raises a non-SKILL doc whose body changed [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:409]. The row's open-conflict framing is accurate and already declared in Known Limitations.

### Secret or token value in the changed surface — every changed line read; only the `pk_` prefix and `cupt auth`/OAuth wording, no value (iteration 5, evidence: review-diff.patch:1-491; README.md:1435). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Secret or token value in the changed surface — every changed line read; only the `pk_` prefix and `cupt auth`/OAuth wording, no value (iteration 5, evidence: review-diff.patch:1-491; README.md:1435).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secret or token value in the changed surface — every changed line read; only the `pk_` prefix and `cupt auth`/OAuth wording, no value (iteration 5, evidence: review-diff.patch:1-491; README.md:1435).

### Section 13 header comment: `(13a, 13b, 13d)` names exactly the checks in the section (iteration 3, evidence: parent-skill-check.cjs:1757,1783,1804,1842) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Section 13 header comment: `(13a, 13b, 13d)` names exactly the checks in the section (iteration 3, evidence: parent-skill-check.cjs:1757,1783,1804,1842)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Section 13 header comment: `(13a, 13b, 13d)` names exactly the checks in the section (iteration 3, evidence: parent-skill-check.cjs:1757,1783,1804,1842)

### The 14 recorded line numbers being stale (evidence: every changed line sits at its recorded number in the current file). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The 14 recorded line numbers being stale (evidence: every changed line sits at its recorded number in the current file).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The 14 recorded line numbers being stale (evidence: every changed line sits at its recorded number in the current file).

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- ASCII box misalignment at README.md:125 and :147: right edges column-consistent on every line (iteration 1, evidence: README.md:123-128, README.md:144-149)
- Residual stale counts in README.md (12 agents, 39 commands, 42 rules, 19 YAML workflows, 96-feature, 37-scenario, CLICKUP_API_KEY/CLICKUP_TEAM_ID, hermes status): zero residual occurrences (iteration 1, evidence: targeted README.md scan; 16 matches reconcile to the fixed anchors plus line 1336)
- Stale ClickUp env-var requirement and auth wording: removed at :1435 and contradicted nowhere (iteration 1, evidence: mcp-tools.md:52)
- Warn-rule count and named rules: 41 registry entries, exactly 7 warn, FRONTMATTER_VALUES and SOURCE_TAGS among them (iteration 1, evidence: validator-registry.json)
- git-hooks README sub-gate/bypass counts: ten implemented sub-gates and nine bypass flags in pre-commit (the 919 header is a CI-only note, not an 11th sub-gate); no residual nine/eight counts in the README (iteration 2, evidence: pre-commit:93-924; README.md:24,110)
- bin/lib "Node core only" imports claim: 21 bare specifiers, all Node core; relative requires are intra-folder (iteration 2, evidence: bin/lib/*.cjs scan; compiled-route-admission.cjs:27)
- Advisor surfaceHint sentence: schema min 1/max 64, forwarded as --surface-hint argv to compiled-route.cjs, unknown surfaces ignored (iteration 2, evidence: advisor-tool-schemas.ts:251; handlers/advisor-recommend.ts:381)
- frontmatter-versioning.md:122 sentence: checkVersionParity compares ROUTER.md and the three JSON files with SKILL.md (iteration 2, evidence: parent-skill-check.cjs:1849-1854)
- Doctor check 13c removal: no reporting code, constant or docs remain in .skilled; section comment and tests updated (iteration 2, evidence: parent-skill-check.cjs:1754; tests:433-439)
- cli-hermes probe line: exact command corroborated by the mode's integration-patterns probe step (iteration 2, evidence: cli-hermes/references/integration-patterns.md:30)
- Ledger proofs vs the tree: every F-row count and the F18-F23 fix strings bear out on direct read; no F-row is missing from the ledger and no in-scope README repeat remains stale (iteration 4, evidence: README.md anchors; sk-git/sk-doc/spec-kit/deep-loop READMEs; review-diff.patch:1-365)
- Remaining rows RM-2 and RM-3: operative claims verified (iteration 4, evidence: pre-commit:919-924; parent-skill-check.cjs:1842-1868; frontmatter-versioning.md:30; frontmatter-version.mjs:409-414)
- Parent packet rows for 024: phase-map row, transition row, binding row and the "024 added" log row all present and consistent with the phase (iteration 4, evidence: 011/spec.md:140,175; 011/goal.md:86,163)
- Secret or token value in the changed surface: none — the `pk_` prefix and `cupt auth`/OAuth wording at README.md:1435 name a prefix, a command and a flow, never a value (iteration 5, evidence: review-diff.patch:1-491; README.md:1435)
- Absolute private path in the changed surface: none — every changed path mention is repo-relative (iteration 5, evidence: review-diff.patch:1-491)
- Version-line drift: all seven raises are one-step third-segment raises with the fourth segment reset (1.7.3.0→1.7.4.0, 1.0.0.0→1.0.1.0, 2.3.4.0→2.3.5.0, 1.0.2.0→1.0.3.0, 1.8.4.0→1.8.5.0, 0.12.0.54→0.12.1.0, 2.7.0.99→2.7.1.0) (iteration 5, evidence: review-diff.patch:169-170, 191-192, 211-212, 233-234, 255-256, 307-308, 338-339)
- Box, tree and table breakage from the wording fixes: the root README boxes (:122-125, :144-147), the git-hooks diagram (:137-141) and the changed trees keep column-consistent edges (iteration 5, evidence: review-diff.patch:405-422, 137-148, 293-298)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- **Dimension:** none — the five-iteration cap is reached (stop policy max-iterations); iteration 5 closed the security dimension and the loop hands off to synthesis. - **Carry-forward:** (a) `agent_cross_runtime` mirror closure — still blocked; (b) the five non-version-bumped docs — corroborated-only; (c) R4-P2-001 and R4-P2-002 — doc-state fixes for the remediation step, not review blockers.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Source of the fixes: `specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/research.md` Section 11. Ledger: `specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/implementation-summary.md`. resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1, 2, 4 | Iteration 4 re-read every ledger proof reached: F-row counts, F18-F23 fix strings, the F1-F23/Section 11 row set and the parent packet rows all agree; two doc-state P2s recorded (R4-P2-001, R4-P2-002) |
| `checklist_evidence` | core | partial | 4 | tasks.md completion block contradicts its own open tasks (R4-P2-002); every other checklist-evidence row checked out |
| `skill_agent` | overlay | notApplicable | 4 | The diff changes docs and one checker; no skill-agent mapping surface moved |
| `agent_cross_runtime` | overlay | blocked | 1, 4 | Mirror trees (.codex/.cursor/.devin/.opencode/.hermes agents) are not materialized in this worktree; F11 rests on the orchestrator's readlink evidence |
| `feature_catalog_code` | overlay | pass | 1, 4 | The 111-feature catalog and 35-scenario playbook counts at README.md:881 match the research sources |
| `playbook_capability` | overlay | pass | 4 | sk-git README now reads 9 categories at :204, :267, :288 with zero stale "8 categories"; the scenario number is deliberately dropped |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| README.md | [D1] | 1 | [0 P0, 0 P1, 0 P2] | partial |
| eleven related docs (F12-F23) + spec docs | [D1 partial] | 2 | [0 P0, 0 P1, 0 P2] | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: [from config]
- Convergence threshold: [from config]
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=[from config.sessionId], parentSessionId=[from config.parentSessionId], generation=[from config.generation], lineageMode=[from config.lineageMode]
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: [from config.reviewTargetType]
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: [timestamp]
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
