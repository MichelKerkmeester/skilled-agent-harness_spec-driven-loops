---
title: "Feature Specification: Phase 4: Remediate Agent Files (Both Runtimes)"
description: "9 confirmed findings (AGT-01..AGT-09) from the 132 conformance deep-research: a systemic S4 frontmatter-schema cluster where create-agent emits only OpenCode permission: for both runtimes so every generated Claude agent runs unrestricted (AGT-02/03/08/09), plus 5 instance-level drift/gap findings (AGT-01 path self-reference, AGT-04 allowlist gap, AGT-06 missing Path Convention line, AGT-07 mirror-parity prose). AGT-05 (.codex/agents empty-mirror refs) is recorded as an operator-gated deferral, not fixed."
trigger_phrases:
  - "remediate agent files"
  - "cross runtime agent sync"
  - "claude opencode agent drift"
  - "agent tool grant coherence"
  - "004-remediation-agents"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-command-agent-conformance-audit/004-remediation-agents"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "fable-5"
    recent_action: "Fixed 8/9 AGT findings (AGT-05 deferred); validate.sh --strict pending"
    next_safe_action: "Run generate-description/backfill-graph-metadata/validate.sh on this folder"
    blockers:
      - "AGT-05 fix is gated on an operator design decision (.codex/agents restore vs remove)"
    key_files:
      - ".opencode/skills/sk-doc/create-agent/SKILL.md"
      - ".opencode/skills/sk-doc/create-agent/assets/agent_template.md"
      - ".claude/agents/deep-improvement.md"
      - ".claude/agents/deep-research.md"
      - ".opencode/agents/deep-research.md"
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Is .codex/agents intended to be restored as a generated mirror later, or should the 6 AGT-05 references be removed? (gates AGT-05 execution)"
      - "AGT-07 parity: add the canonical-source clause to the OpenCode mirror (recommended, additive) or drop it from Claude (destructive)?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Phase 4: Remediate Agent Files (Both Runtimes)

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-remediation-doctor |
| **Successor** | 005-readme-alignment |
| **Handoff Criteria** | All 4 P1 findings (AGT-01..AGT-04) closed with grep-verified evidence; P2 findings AGT-06/07/08/09 closed or explicitly deferred with operator sign-off; AGT-05 recorded as an operator-gated deferral (no source edit); `validate.sh --strict` exits 0 on this folder. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Command, agent, and asset conformance audit against current skill reality specification.

**Scope Boundary**: Exactly the 9 findings owned by this phase per `001-conformance-deep-research/research/research.md` §3.3 (AGENTS) and §6 (Remediation Routing): AGT-01, AGT-02, AGT-03, AGT-04 (P1) and AGT-05, AGT-06, AGT-07, AGT-08, AGT-09 (P2). Slash-command files (phase 002), the `/doctor` subsystem (phase 003), and README wording/rosters (phase 005 — READMEs are out of scope for the whole audit per research.md §"Surface audited") are NOT touched here. `.claude/agents/README.txt` and `.opencode/agents/README.txt` are explicitly out of scope: no AGT finding names them.

**Sequencing (mandatory, per research.md §6 phase-004 note)**: AGT-03 (create-agent per-runtime schema branch) MUST land before AGT-02 (the one miswired Claude agent instance it root-causes) so create-agent stops generating AGT-02-class bugs. AGT-08 (wording fix in the same SKILL.md) bundles with AGT-03. AGT-09 (validator enforcement) follows AGT-03 so it enforces the finalized schema rule.

**Dependencies**:
- The confirmed, re-verified (2026-07-10) finding evidence from Phase 1 (`001-conformance-deep-research/research/research.md`) is the sole source of scope for this phase — no new drift discovery happens here.
- `.opencode/agents/*.md` is the canonical source of body content for the 11 unaffected agents; `.claude/agents/*.md` mirrors it. AGT-02/AGT-03 concern the frontmatter *schema* layer, which is runtime-specific by design (not a body-sync defect).
- AGT-05 is gated on an open design question owned by the operator (see spec.md §7); it is NOT phase 005's scope either — it stays open until answered.

**Deliverables**:
- `create-agent/SKILL.md` + `assets/agent_template.md` document and enforce a per-runtime frontmatter schema branch (AGT-03, AGT-08).
- `.claude/agents/deep-improvement.md` normalized to the `tools:` schema (AGT-02).
- `.claude/agents/deep-research.md:11` and `.claude/agents/markdown.md:11` path-localized (AGT-01).
- Both `deep-research.md` agent allowlists include `research/deltas/iter-NNN.jsonl` (AGT-04).
- `validate_document.py` gains an agent-frontmatter schema pass (AGT-09).
- `ai-council.md` (both runtimes) gains a Path Convention line (AGT-06); `orchestrate.md` mirror-parity prose reconciled (AGT-07).
- AGT-05 recorded as a documented, operator-gated deferral with zero source diff.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`001-conformance-deep-research` confirmed 9 agent-surface defects (AGT-01..AGT-09), re-verified against file:line evidence as of 2026-07-10. The systemic root cause (S4): `create-agent/SKILL.md:71-96` and `assets/agent_template.md:34` declare OpenCode's `permission:` object as the sole canonical agent-frontmatter schema for BOTH runtimes and falsely call Claude's `tools:` schema "deprecated" (AGT-03, AGT-08). Claude Code silently ignores `permission:` blocks — it enforces only `tools:` — so `.claude/agents/deep-improvement.md` (generated from this template) runs with the parent session's full, unrestricted tool set instead of its intended deny-list (AGT-02). Nothing catches this: `validate_document.py` (838 lines) has zero frontmatter-schema checks for `--type agent` (AGT-09). Five further instance-level defects round out the set: a stale `.opencode/agents` path self-reference in 2 Claude agent bodies (AGT-01), a deep-research leaf-agent write-allowlist that omits the workflow-required `research/deltas/iter-NNN.jsonl` artifact in both runtimes (AGT-04), 6 agent-body references to an absent `.codex/agents` mirror directory with no design resolution (AGT-05, deferred), `ai-council.md`'s missing Path Convention line in both runtimes (AGT-06), and an `orchestrate.md` mirror-parity gap in the canonical-source provenance clause (AGT-07).

### Purpose
Every P1 finding (AGT-01..AGT-04) is fixed with grep-verifiable evidence; every P2 finding (AGT-06..AGT-09) is fixed or explicitly deferred with a documented reason; AGT-05 is recorded as an operator-gated deferral with zero source diff. `create-agent` stops generating AGT-02-class bugs going forward, and `validate_document.py` catches any future recurrence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- AGT-03/AGT-08: add a per-runtime frontmatter schema branch + fix "deprecated" wording in `create-agent/SKILL.md` and `assets/agent_template.md`.
- AGT-02: normalize `.claude/agents/deep-improvement.md` frontmatter from `permission:` to `tools:`.
- AGT-01: localize the `.opencode/agents` self-reference to `.claude/agents` in 2 Claude agent bodies.
- AGT-04: add `research/deltas/iter-NNN.jsonl` to the deep-research leaf-agent write-allowlist in both runtimes.
- AGT-09: add a `--type agent` frontmatter schema pass to `validate_document.py`.
- AGT-06: add a Path Convention self-reference line to `ai-council.md` in both runtimes.
- AGT-07: reconcile the `orchestrate.md` canonical-source provenance-clause parity gap between mirrors.
- AGT-05: document the deferred `.codex/agents` empty-mirror decision; NO source edit pending operator resolution.

### Out of Scope
- Slash-command and doctor-route remediation - owned by phases 002/003.
- `.claude/agents/README.txt` and `.opencode/agents/README.txt` (roster, `.codex/agents/*.toml` sibling line) - no AGT finding names these files; README remediation is out of scope for the entire audit per research.md ("READMEs are out of scope (phase 005)").
- Renaming, adding, or deleting agents - this phase aligns the existing 12, it does not change the roster.
- Changing agent runtime behavior or dispatch semantics beyond correcting the 9 confirmed findings.
- Broad cross-runtime body-sync beyond the specific lines each finding cites (the audit's Rejected/Ruled-Out §5 item 5 already confirmed 11 of 12 pairs are body-sync clean; `orchestrate.md`'s one intentional delta is AGT-07, handled explicitly).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/create-agent/SKILL.md:71-96` | Modify | AGT-03: add runtime-detection branch — emit `tools:` for `.claude/agents/`, `permission:` for `.opencode/agents/`. |
| `.opencode/skills/sk-doc/create-agent/assets/agent_template.md:34` | Modify | AGT-03: add both-schema row to the frontmatter comparison table. |
| `.opencode/skills/sk-doc/create-agent/SKILL.md:105` | Modify | AGT-08: replace "deprecated" wording for `tools:` with "runtime-specific" + decision rule. |
| `.opencode/skills/sk-doc/create-agent/SKILL.md:177` | Modify | AGT-08: replace "deprecated" wording for `tools:` at the second site. |
| `.claude/agents/deep-improvement.md:4-19` | Modify | AGT-02: replace the OpenCode `permission:` frontmatter block with Claude `tools: Read, Write, Edit, Bash, Grep, Glob`. |
| `.claude/agents/deep-research.md:11` | Modify | AGT-01: `.opencode/agents/*.md` → `.claude/agents/*.md` in the Path Convention line. |
| `.claude/agents/markdown.md:11` | Modify | AGT-01: `.opencode/agents/*.md` → `.claude/agents/*.md` in the Path Convention line. |
| `.opencode/agents/deep-research.md:69-73` | Modify | AGT-04: add `research/deltas/iter-NNN.jsonl` to the write-allowlist. |
| `.claude/agents/deep-research.md:52-56` | Modify | AGT-04: add `research/deltas/iter-NNN.jsonl` to the write-allowlist. |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Modify | AGT-09: add a `--type agent` frontmatter schema pass (symlinked at `.opencode/skills/sk-doc/scripts/validate_document.py`). |
| `.claude/agents/ai-council.md` | Modify | AGT-06: add a Path Convention self-reference line (currently absent; no prior line to cite). |
| `.opencode/agents/ai-council.md` | Modify | AGT-06: add a Path Convention self-reference line (currently absent; no prior line to cite). |
| `.opencode/agents/orchestrate.md:809` | Modify | AGT-07: add the "canonical source in `.opencode/agents/`" provenance clause (parity with `.claude/agents/orchestrate.md`). |
| `.claude/agents/orchestrate.md:784` (research.md citation; confirmed on-disk at line 798 as of 2026-07-10 — drift, re-confirm before editing) | Reference only, likely unchanged | AGT-07: existing provenance clause is the parity source; no edit expected unless the operator picks the "drop from Claude" alternative. |
| `.claude/agents/orchestrate.md:21`, `.claude/agents/deep-review.md:277`, `.claude/agents/prompt-improver.md:52`, `.opencode/agents/orchestrate.md:32`, `.opencode/agents/deep-review.md:294`, `.opencode/agents/prompt-improver.md:67` | Defer (no edit) | AGT-05: `.codex/agents` empty-mirror references — deferred pending the operator design decision recorded in §7. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | AGT-03: `create-agent` emits the runtime-correct frontmatter schema. | `create-agent/SKILL.md` and `assets/agent_template.md` document a runtime branch: `tools:` for `.claude/agents/`, `permission:` for `.opencode/agents/`; `grep -n "tools:" .opencode/skills/sk-doc/create-agent/SKILL.md` returns a match documenting the Claude branch. |
| REQ-002 | AGT-02: `.claude/agents/deep-improvement.md` uses Claude's `tools:` schema, not OpenCode's `permission:`. | `grep -c '^tools:' .claude/agents/deep-improvement.md` = 1; `grep -c '^permission:' .claude/agents/deep-improvement.md` = 0; the `tools:` list preserves the original deny-list intent (excludes webfetch/memory/chrome_devtools/task/patch). |
| REQ-003 | AGT-01: fix the confirmed `.opencode/agents` path self-reference drift in 2 Claude agent bodies. | `grep -rn "\.opencode/agents" .claude/agents/deep-research.md .claude/agents/markdown.md` returns no matches. |
| REQ-004 | AGT-04: the deep-research leaf-agent write-allowlist includes the workflow-required delta artifact in both runtimes. | `grep -n "research/deltas/iter" .opencode/agents/deep-research.md .claude/agents/deep-research.md` returns a match in each file's allowlist section. |

### P2 - Optional (complete OR documented deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | AGT-05: record the `.codex/agents` empty-mirror deferral; do not edit the 6 cited sites. | Open Questions (§7) records the operator-gated design question; `git diff --stat` shows zero changes to the 6 AGT-05 files pending an answer. |
| REQ-006 | AGT-06: `ai-council.md` gains a Path Convention self-reference line in both runtimes. | `grep -c "Path Convention" .claude/agents/ai-council.md .opencode/agents/ai-council.md` = 1 for each file. |
| REQ-007 | AGT-07: `orchestrate.md` mirror-parity gap in the canonical-source provenance clause is reconciled. | `grep -n "canonical source" .claude/agents/orchestrate.md .opencode/agents/orchestrate.md` returns a match in both files. |
| REQ-008 | AGT-08: `create-agent/SKILL.md` no longer calls `tools:` "deprecated". | `grep -c "deprecated" .opencode/skills/sk-doc/create-agent/SKILL.md` = 0; both sites (lines ~105, ~177) use "runtime-specific" and state the decision rule. |
| REQ-009 | AGT-09: `validate_document.py` enforces agent-frontmatter schema per runtime. | A dedicated `--type agent` branch exists that requires non-empty `tools:` (and warns on `permission:`) under `.claude/agents/`, and requires a `permission:` object (and warns on `tools:`) under `.opencode/agents/`; running it against the post-fix `.claude/agents/deep-improvement.md` reports no schema violation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `create-agent/SKILL.md` and `assets/agent_template.md` document and the wording no longer calls `tools:` deprecated (AGT-03, AGT-08): `grep -c "deprecated" .opencode/skills/sk-doc/create-agent/SKILL.md` = 0.
- **SC-002**: `.claude/agents/deep-improvement.md` uses `tools:` not `permission:` (AGT-02): `grep -c '^tools:' .claude/agents/deep-improvement.md` = 1 and `grep -c '^permission:' .claude/agents/deep-improvement.md` = 0.
- **SC-003**: No stale `.opencode/agents` self-reference remains in `.claude/agents/deep-research.md` or `.claude/agents/markdown.md` (AGT-01): `grep -rn "\.opencode/agents" .claude/agents/deep-research.md .claude/agents/markdown.md` returns no matches.
- **SC-004**: Both `deep-research.md` write-allowlists include the delta artifact (AGT-04): `grep -n "research/deltas/iter" .opencode/agents/deep-research.md .claude/agents/deep-research.md` returns a match in each file.
- **SC-005**: `validate_document.py` has a working `--type agent` frontmatter-schema pass (AGT-09), exercised against both a compliant and a non-compliant fixture.
- **SC-006**: `ai-council.md` (both runtimes) has exactly one Path Convention line (AGT-06): `grep -c "Path Convention" .claude/agents/ai-council.md .opencode/agents/ai-council.md` = 1 each.
- **SC-007**: `orchestrate.md` mirrors agree on the canonical-source provenance clause (AGT-07): `grep -n "canonical source" .claude/agents/orchestrate.md .opencode/agents/orchestrate.md` returns a match in both files.
- **SC-008**: AGT-05 has zero source diff and an explicit deferral record: `git diff --stat -- .claude/agents/orchestrate.md .claude/agents/deep-review.md .claude/agents/prompt-improver.md .opencode/agents/orchestrate.md .opencode/agents/deep-review.md .opencode/agents/prompt-improver.md` shows no AGT-05-attributable hunks until the operator answers §7.
- **SC-009**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Sequencing: AGT-03 before AGT-02/AGT-09 | Fixing `deep-improvement.md` or the validator before the schema branch exists means "correct" is undefined; risk of re-doing the fix. | Execute Phase 1 (AGT-03+AGT-08) first per plan.md; AGT-02 and AGT-09 explicitly depend on it. |
| Dependency | AGT-05 operator design decision | AGT-05 cannot be fixed without an answer to "is `.codex/agents` a future generated mirror?" | Record the deferral in §7 Open Questions; do not edit the 6 cited sites; re-open this REQ once answered. |
| Risk | False-positive `codex` edits | Med | Preserve the audit's established false-positive guard: `codex` in deep-improvement.md/prompt-improver.md/orchestrate.md denoting the live `.codex` runtime mirror or the codex benchmark executor is untouched; only the AGT-05-cited empty-mirror-directory claims are flagged, and even those are deferred, not edited, this phase. |
| Risk | AGT-02 fix narrows capability incorrectly | Med | Map the `tools:` list from the EXISTING `permission:` allow-set (Read, Write, Edit, Bash, Grep, Glob) so the fix corrects the schema without silently changing intended capability. |
| Risk | AGT-07 judgment call (add vs. drop) | Low | Default to additive (add the provenance clause to the OpenCode mirror); flagged as an open question in §7 rather than decided unilaterally. |
| Risk | Concurrent sibling phases (002/003/005) touch adjacent files | Low | This phase's file list (spec.md §3) has zero path overlap with phases 002/003; README.txt is explicitly excluded to avoid colliding with phase 005. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: Every agent frontmatter file remains valid, parseable YAML after every AGT fix (no syntax breakage introduced by schema edits).
- **NFR-C02**: The `.claude`/`.opencode` runtime pair for every touched agent stays behaviorally content-equivalent outside the specific cited lines — no incidental body drift.

### Traceability
- **NFR-T01**: Every source edit this phase makes is traceable to exactly one AGT finding ID via a commit message or PR description reference.
- **NFR-T02**: `validate_document.py`'s new agent-frontmatter check (AGT-09) is deterministic: same input file always yields the same pass/warn verdict.

### Reversibility
- **NFR-R01**: Every fix is a plain-text diff revertible with `git revert`; no destructive or generative steps (no file deletion, no regenerated binary artifacts).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Schema Boundaries
- **Agent with no frontmatter tool grant at all** (should not occur post-AGT-09, since the new check requires `tools:` or `permission:` under the respective runtime dir) — AGT-09's check must flag this as a violation, not silently pass it.
- **Agent using BOTH `tools:` and `permission:`** (cross-contaminated) — AGT-09's check warns on the runtime-inappropriate key rather than only checking for the presence of the correct one.

### Deferral Boundaries
- **AGT-05 answered mid-phase**: if the operator resolves the `.codex/agents` design question while this phase is in flight, AGT-05 moves from "deferred" to an executable REQ using the same file:line evidence already recorded in spec.md §3; no new research needed.
- **AGT-07 direction reversed**: if the operator picks "drop from Claude" instead of the recommended "add to OpenCode", the fix touches `.claude/agents/orchestrate.md` instead of `.opencode/agents/orchestrate.md` — SC-007's grep assertion (match in both files) becomes "match in neither file" and must be updated before claiming that criterion met.

### Sequencing Boundaries
- **AGT-02/AGT-09 attempted before AGT-03 lands**: both explicitly depend on AGT-03's finalized schema rule; if executed out of order, the fix has no canonical pattern to follow and must be redone.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 9 findings, ~20 file:line sites across 2 runtime agent dirs + 1 skill (2 files) + 1 validator script; no new files created. |
| Risk | 10/25 | AGT-02/03 are security-adjacent (unrestricted-tool-grant defect) but confined to markdown frontmatter, not runtime application code; no auth/API/breaking-change surface. |
| Research | 4/20 | Findings are fully pre-researched and re-verified by `001-conformance-deep-research`; this phase applies fixes, it does not investigate. |
| **Total** | **26/70** | **Level 2** — verification-focused remediation of confirmed findings, not net-new feature work. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is `.codex/agents` intended to be restored as a generated mirror in a later phase, or should the 6 AGT-05-cited references be removed? **UNRESOLVED — gates AGT-05 execution; carried from research.md §7 "Deferred design decisions".**
- AGT-07 parity direction: add the canonical-source clause to the OpenCode mirror (additive, recommended default) or drop it from the Claude mirror (destructive)? **UNRESOLVED — default is additive per plan.md; flag for operator override before executing.**
- For agents whose `.claude` `tools:` list and `.opencode` `permission:` block appear divergent beyond grammar (a genuine capability disagreement, not covered by the 9 AGT findings), which runtime is authoritative? **Out of this phase's confirmed-findings scope; noted for a future audit pass if discovered during execution.**
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Findings Source**: See `../001-conformance-deep-research/research/research.md` §3.3 (AGENTS) and §6 (Remediation Routing)

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-001
REQ-002
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
REQ-009
-->
