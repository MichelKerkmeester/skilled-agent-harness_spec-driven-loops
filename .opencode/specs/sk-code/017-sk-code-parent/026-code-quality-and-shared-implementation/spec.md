---
title: "Feature Specification: Implement the code-quality + shared-assets research backlog (packet 124/026)"
description: "Level 2 implementation of the five ranked proposals from the 025 code-quality-and-shared research packet: rewrite the stale sk-code/shared/README navigation index and fix the checklist display label, align the pre-commit hook docs to both real gates, add an advisory CODE_QUALITY_RESULT v1 evidence-handoff envelope, add comment-hygiene hook coverage (TH-002) plus a deep-review consumption note, and tune sk-code quality-mode router/advisor vocabulary — all un-gated scope shipped; the advisor-fixture slice and two deep-loop contract bugs deferred to their owning lanes."
trigger_phrases:
  - "sk-code code-quality shared implementation"
  - "code-quality shared assets implementation"
  - "sk-code code-quality upgrade implementation"
importance_tier: "high"
contextType: "general"
parent: "sk-code/017-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/026-code-quality-and-shared-implementation"
    last_updated_at: "2026-07-07T14:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented the five proposals' un-gated scope; deferred gated advisor and deep-loop items"
    next_safe_action: "Register 026 in the 124 parent and validate --strict"
---
# Feature Specification: Implement the code-quality + shared-assets research backlog (packet 124/026)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sibling research packet `025-code-quality-and-shared-research` ran ten capped-converged deep-research iterations and produced a ranked, owner-bounded backlog of five upgrade proposals for the `sk-code/code-quality` sub-skill and `sk-code/shared` assets. That packet is findings-only. Left unimplemented, several concrete defects persist: `sk-code/shared/README.md` is a stale placeholder rather than navigation over the already-populated `shared/references/`; the `code-quality` docs display the checklist label `assets/opencode-checklists/` which does not match the real `assets/checklists/` directory; the `.opencode/hooks/README.md` documents the pre-commit hook as comment-hygiene-only when it actually enforces two gates; `code-quality` emits no structured, downstream-consumable evidence envelope; the comment-hygiene hook branch has no manual test coverage; and quality-gate prompts route imperfectly because the parent `sk-code` quality-mode vocabulary is thin.

### Purpose
Execute the un-gated scope of all five ranked proposals so that `sk-code`'s shared and code-quality docs describe reality, `code-quality` emits a stable advisory evidence envelope that downstream deep-review can consume without letting the gate claim success, the hook docs match what the pre-commit hook actually enforces, the comment-hygiene hook branch gains manual-test coverage, and quality-mode prompts route to `sk-code` with tuned parent vocabulary. Ship every un-gated proposal in this packet; hand the one advisor-lane fixture slice and the two deep-loop contract bugs to their owning lanes with a documented reason.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Proposal A (P1/first, docs & navigation):** rewrite `sk-code/shared/README.md` from a stale placeholder into a real navigation index over `shared/references/` (frontmatter version bump), and fix the display label `assets/opencode-checklists/` → `assets/checklists/` in `code-quality/SKILL.md` and `code-quality/README.md` (labels only; hrefs preserved).
- **Proposal B (P1/third, hook-doc alignment):** align `.opencode/hooks/README.md` to the pre-commit hook's two real gates (comment-hygiene + staged agent-mirror-sync) across all stale spots plus the fail-open row, and add a one-sentence note to `code-quality/SKILL.md` that pre-commit additionally carries the mirror-sync gate.
- **Proposal C (P1/second, evidence envelope):** add an advisory `CODE_QUALITY_RESULT v1` evidence-handoff envelope to `code-quality/SKILL.md` (Section 3), mirroring `.opencode/agents/code.md`'s `AGENT_IO_RESULT v1` precedent, with `status: advisory` (never pass/success) and a guardrail that it never reads as a completion claim and never replaces the `workflow_verify.md` handoff.
- **Proposal D (P2/fifth, hook coverage):** add manual scenario `TH-002` (comment-hygiene hook branch) to the manual-testing playbook §15 and a new per-feature file `manual_testing_playbook/tooling-and-hooks/comment-hygiene-hook.md` containing a deep-review consumption note; reconcile playbook totals 29 → 30.
- **Proposal E (P2/fourth, router/advisor vocab — sk-code slice only):** add quality-mode vocabulary additively to `sk-code/mode-registry.json`, `hub-router.json`, and `graph-metadata.json`, keeping one `sk-code` advisor identity and no packet-local metadata.
- **Consistency reconciliations (docs-describe-reality):** playbook §5 coverage figure 28/28 → 30/30, and the `check-dist-staleness-hook.md` "Related" cross-reference repointed to TH-002.

### Out of Scope
- **Advisor-fixture slice (GATED):** new quality-mode rows (`expectedSkill: 'sk-code'`) in `system-skill-advisor/.../intent-prompt-corpus.ts`. This crosses into the live advisor lane and needs the coordinated 193-row re-baseline; it is bundled with the pending advisor-vocab item for the advisor re-baseline window.
- **Deep-loop contract bug #1:** `verify-iteration.cjs` requires `research/deltas/iter-NNN.jsonl` but the deep-research leaf allowed-write list excludes it. Owner: deep-loop. Separate packet.
- **Deep-loop contract bug #2:** `resource_map.emit=true` is configured but the leaf cannot write `research/resource-map.md`. Owner: deep-loop workflow/reducer. Separate packet.
- **Out-of-scope flag (not fixed):** `sk-code/shared/assets/patterns/README.md` has a stale self-path — noted for a later pass, left untouched because it is a concurrent-dirty file outside this packet.
- New TypeScript/runtime logic, sub-agent dispatch authority for `code-quality`, formal review output, or a standalone `code-quality` advisor identity.

### Files to Change During Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/shared/README.md` | Modify | Rewrite placeholder into a navigation index over `shared/references/`; frontmatter version 1.0.0.0 → 1.0.0.1 |
| `.opencode/skills/sk-code/code-quality/SKILL.md` | Modify | Checklist display-label fix; one-sentence mirror-sync note; `CODE_QUALITY_RESULT v1` advisory envelope in Section 3 |
| `.opencode/skills/sk-code/code-quality/README.md` | Modify | Checklist display-label fix (`assets/opencode-checklists/` → `assets/checklists/`) |
| `.opencode/hooks/README.md` | Modify | Align five doc spots plus the fail-open row to the pre-commit hook's two gates |
| `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md` | Modify | Add TH-002 in §15; update §16 gap, §17 index, totals 29 → 30, and §5 figure 28 → 30 |
| `.opencode/skills/sk-code/manual_testing_playbook/tooling-and-hooks/comment-hygiene-hook.md` | Create | Per-feature file for TH-002 with a deep-review consumption note |
| `.opencode/skills/sk-code/manual_testing_playbook/tooling-and-hooks/check-dist-staleness-hook.md` | Modify | Repoint the "Related" cross-reference to TH-002 |
| `.opencode/skills/sk-code/mode-registry.json` | Modify | Add quality-mode aliases (additive) |
| `.opencode/skills/sk-code/hub-router.json` | Modify | Add matching quality-mode router vocabulary (registry ↔ router synced) |
| `.opencode/skills/sk-code/graph-metadata.json` | Modify | Add quality-mode phrases to top-level `intent_signals` plus derived trigger phrases/key topics |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-001 | Proposal A (rank: first) — docs & navigation cleanup | `shared/README.md` is a real navigation index over `shared/references/` (version 1.0.0.1); `grep -c opencode-checklists` returns 0 in both `code-quality/SKILL.md` and `code-quality/README.md`; the label `assets/checklists/` is present; hrefs unchanged | problem |
| REQ-002 | Proposal B (rank: third) — hook-doc alignment | `.opencode/hooks/README.md` documents two independent gates (comment-hygiene + staged agent-mirror-sync) across all stale spots plus the fail-open row; `code-quality/SKILL.md` carries the one-sentence mirror-sync note | scope |
| REQ-003 | Proposal C (rank: second) — advisory evidence envelope | `code-quality/SKILL.md` Section 3 has a `CODE_QUALITY_RESULT v1` block with `status: advisory` (never pass/success), the ten analog fields, and a guardrail that its presence never reads as a completion claim and never replaces the `workflow_verify.md` handoff | scope |

### P2 - Optional (defer with documented reason)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-004 | Proposal D (rank: fifth) — hook coverage + deep-review note | `TH-002` exists in playbook §15; `tooling-and-hooks/comment-hygiene-hook.md` exists with a deep-review consumption note; playbook scenario totals reconcile 29 → 30 (categories stay 9) | scope |
| REQ-005 | Proposal E (rank: fourth) — router/advisor vocab (sk-code slice) | Five quality-mode phrases are added additively to `mode-registry.json`, `hub-router.json`, and `graph-metadata.json` with registry ↔ router synced and one `sk-code` advisor identity; drift-guards stay green | scope |
| REQ-006 | Consistency reconciliations | Playbook §5 coverage reads 30/30; `check-dist-staleness-hook.md` "Related" cross-reference points to TH-002 | scope |
| REQ-007 | Gated/other-lane items isolated | The advisor-fixture slice and the two deep-loop contract bugs are documented as deferred to their owning lanes; `shared/assets/patterns/README.md` is left untouched | scope |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Proposal A shipped — `shared/README.md` is a navigation index (frontmatter version 1.0.0.1), and `grep -c opencode-checklists` returns 0 in both `code-quality/SKILL.md` and `code-quality/README.md` with hrefs preserved. [EVIDENCE: rewritten `shared/README.md`; grep 0/0]
- **SC-002**: Proposal B shipped — `.opencode/hooks/README.md` reframes the pre-commit surface as two independent gates across the description, overview, files table, ASCII diagram, and BOUNDARIES/fail-open row; `code-quality/SKILL.md` carries the one-sentence mirror-sync note. [EVIDENCE: `.opencode/hooks/README.md`; `code-quality/SKILL.md`]
- **SC-003**: Proposal C shipped — a `CODE_QUALITY_RESULT v1` advisory envelope with ten fields and `status: advisory` sits in `code-quality/SKILL.md` Section 3, mirroring `code.md`'s `AGENT_IO_RESULT v1`, with the no-success-claim guardrail restated. [EVIDENCE: `code-quality/SKILL.md` Section 3]
- **SC-004**: Proposal D shipped — `TH-002` (comment-hygiene hook branch) is in playbook §15, the new `tooling-and-hooks/comment-hygiene-hook.md` carries the deep-review consumption note, and playbook totals read 30 scenarios / 9 categories. [EVIDENCE: `manual_testing_playbook.md` §15/§16/§17; new per-feature file]
- **SC-005**: Proposal E shipped — five quality-mode phrases are added to `mode-registry.json`, `hub-router.json`, and `graph-metadata.json` (registry ↔ router synced, one advisor identity), and drift-guards are GREEN: vocab-sync score 100 / driftDetected false, parent-skill-check STRICT 0 warnings, router-sync vitest 4/4. [EVIDENCE: three JSON files; drift-guard runs]
- **SC-006**: Consistency reconciliations complete — playbook §5 coverage reads 30/30 and the `check-dist-staleness-hook.md` "Related" cross-reference points to TH-002. [EVIDENCE: `manual_testing_playbook.md` §5; `check-dist-staleness-hook.md`]
- **SC-007**: Deferrals isolated and validated — the advisor-fixture slice and both deep-loop contract bugs are documented as owned by other lanes, `shared/assets/patterns/README.md` is untouched, and `validate.sh --strict` reports Errors 0. [EVIDENCE: this spec's Out of Scope; `validate.sh --strict`]

### Acceptance Scenarios

- **Scenario 1**: **Given** an author finishes a scoped code change and asks for a quality check, **when** they consult `code-quality/SKILL.md`, **then** they can emit an advisory `CODE_QUALITY_RESULT v1` envelope that carries evidence downstream without the envelope reading as a completion claim or replacing the verification handoff.
- **Scenario 2**: **Given** a reader wants to know what the pre-commit hook enforces, **when** they read `.opencode/hooks/README.md`, **then** both the comment-hygiene gate and the staged agent-mirror-sync gate are documented, including the fail-open behavior.
- **Scenario 3**: **Given** a quality-gate prompt such as "check before done" or "p0 p1 p2 review", **when** the sk-code router evaluates quality-mode vocabulary, **then** the added aliases match while the drift-guards (vocab-sync, parent-skill-check STRICT, router-sync vitest) remain green.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Vocab edits can desync the router ↔ advisor projection | Drift-guard failure / mis-routing | Keep edits additive and registry ↔ router synced; gate on vocab-sync, parent-skill-check STRICT, and the router-sync vitest |
| Risk | The evidence envelope could be misread as a completion claim | `code-quality` overstates status | Mark `status: advisory` (never pass/success) and restate the no-success-claim guardrail, mirroring `code.md`'s precedent |
| Risk | Checklist-label edit could regress live hrefs | Broken links in code-quality docs | Change display labels only; leave hrefs and the system-spec-kit checklist handoff intact |
| Risk | Playbook total/index drift after adding TH-002 | Internally inconsistent playbook | Reconcile §15 (scenario), §16 (gap), §17 (index), the totals block (29 → 30), and the §5 figure (28 → 30) together |
| Dependency | Live advisor TypeScript lane | Advisor-fixture slice must wait for lane quiet + re-baseline | Keep this packet to the sk-code-local, un-gated slice; defer the fixture rows to the advisor re-baseline window |
| Dependency | deep-loop delta/resource-map contract | Two contract bugs remain until deep-loop resolves them | Document owner routing; do not work around them in this packet |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every doc/JSON edit must describe reality — no placeholder text, no display labels that do not resolve to a real directory, and no hook documentation that undercounts the enforced gates.

### Maintainability
- **NFR-M01**: `code-quality` gains an evidence envelope and doc fixes but does not gain new-file authority, sub-agent dispatch, formal review output, final verification evidence, or completion/done/passing claims; there is one `sk-code` advisor identity and no packet-local `graph-metadata.json` for `code-quality`.

### Safety
- **NFR-S01**: The advisor TypeScript lane and the deep-loop contract are not disturbed; gated and other-lane items are deferred with documented owner routing rather than worked around.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- The checklist-label fix touches display text only; the `../code-opencode/assets/checklists/` hrefs and the system-spec-kit checklist handoff for `.opencode/specs/` targets must remain exactly as they were.

### Error Scenarios
- If a vocab addition would desync the router ↔ advisor projection, the vocab-sync or router-sync guard fails; the additive phrases must keep both surfaces consistent rather than introducing a `code-quality`-local advisor target.
- The comment-hygiene hook is warn-only (PostToolUse warns and exits 0); TH-002 must exercise that warn path and the direct `check-comment-hygiene.sh` checker/fix, not assert a blocking failure.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Ten files across shared docs, code-quality docs, hook docs, the manual-testing playbook, and three router/advisor JSON surfaces |
| Risk | 11/25 | Docs/JSON only, no new runtime logic; the only real hazard is router ↔ advisor vocab drift, contained by drift-guards |
| Research | 9/20 | The 025 research packet already ranked and owner-bounded the proposals; verification confirmed each premise against the live branch |
| **Total** | **35/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking. The advisor-fixture slice and the two deep-loop contract bugs are explicitly out of scope for this packet and owned by their respective lanes; the `shared/assets/patterns/README.md` stale self-path is noted for a later pass.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research sibling**: `../025-code-quality-and-shared-research/` (the ranked backlog this packet implements)
- **Parent hub**: `../` (`124-sk-code-parent`)
- **Envelope precedent**: `.opencode/agents/code.md` (`AGENT_IO_RESULT v1`)
- **Deferred advisor slice**: `system-skill-advisor/001-scorer-saturation-root-fix` (advisor re-baseline window)

<!-- /ANCHOR:related-docs -->
