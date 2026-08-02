---
title: "Feature Specification: executor-and-dispatch-contract-truth"
description: "Every document that tells an agent which external executor exists and how to invoke it is wrong somewhere, and wrong in the direction that produces a degraded dispatch rather than a visible error. This phase makes executor and dispatch contracts derived rather than retyped, and repairs the red fleet gate that makes every no-regression claim unfalsifiable."
trigger_phrases:
  - "executor roster drift"
  - "cli reference currency"
  - "dispatch contract truth"
  - "fleet gate baseline"
  - "structured output flags"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/001-executor-and-dispatch-contract-truth"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "skd025-001-build"
    recent_action: "Applied behavior-preserving executor and dispatch-contract documentation corrections"
    next_safe_action: "Run scoped documentation gates and reconcile remaining deferred YAML work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Q1 — fold the unsound refutation's file correction into the RE-004-01 edit?"
      - "Q2 — bring the two unaudited CLI packets into scope?"
      - "DR-1 — retire the Copilot branches or register the kind?"
      - "DR-2 — is the Cursor parameterized-model rejection a capability claim or an allowlist policy?"
      - "DR-3 — which document owns the executor roster number?"
    answered_questions: []
---
# Feature Specification: executor-and-dispatch-contract-truth

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

Documents across five CLI packets, five deep-loop packets and two MCP packets publish executor rosters, flag tables and invocation forms that the installed binaries and the live executor schema contradict. The failure mode is silent: a leaf told that a CLI has no structured-output flag hand-prompts JSON instead of constraining it, and a leaf told a dispatch route exists gets an exception or a silent downgrade. This phase repairs the documents and replaces the retyped rosters with derivation from the single authority that owns each one.

**Key Decisions**: retire versus register the unreachable Copilot branches; separate CLI capability from packet policy; name one owner for the executor roster number.

**Critical Dependencies**: none — this phase starts first. Its first action repairs the red fleet gate that every other phase's no-regression claim depends on.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

### Current execution state

The 22 frozen scope items are dispositioned against the supplied HEAD confirmation: 20 were confirmed as documentation drift, two were already fixed concurrently, and the two cli-pi gaps were added. The fleet gate is recorded as **11/11 clean** from the concurrent manifest regeneration. `RE-004-12` remains deferred because its targets are command YAML branches and this BUILD leaf is restricted to documentation edits; the decision record remains Proposed and no YAML or code change is made here.

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Every document that tells an agent which external executor exists and how to invoke it is wrong somewhere. The `cli-codex` reference states verbatim that the CLI has no native structured-output flag and instructs authors to ask for JSON in the prompt; the installed binary ships both a JSONL event flag and a JSON-Schema flag for the final response. The `cli-claude-code` reference passes a session identifier to a flag that takes a boolean. The `cli-cursor` packet declares a parameterized-model surface "rejected outright" while the installed CLI documents it, and advertises an auth-token pair that no longer exists. The `cli-devin` documentation presents OS sandboxing as a fifth permission mode when it is an orthogonal containment flag. On the deep-loop side, four documents publish a three-item executor list whose first and third entries are the *same* string against a live schema of seven kinds; one `SKILL.md` advertises two dispatch routes that its own kind-resolver throws on; three command YAMLs branch on an executor kind the schema does not define; and one `SKILL.md` ships with no tool-permission frontmatter at all. The Code Mode catalog advertises a tool inventory unrelated to the manuals actually configured, and its workflow examples call a namespace that is not the live one. Underneath all of it, the fleet gate is red on one hub root, so no claim about regressions is currently falsifiable.

### Purpose

No document retypes an executor roster: every roster is derived from the schema, the resolver allowlist or the registry that owns it, or it links to the one place that holds it — and every flag table is regenerated from a versioned, checked-in capture of the installed CLI's own help output.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Repair of the red fleet-gate invariant and capture of the **true** fleet pass count as this program's baseline. This is the first action of the phase and of the whole packet.
- CLI reference currency across the four audited CLI packets, regenerated from versioned help fixtures rather than hand-edited.
- Audit of the two CLI packets that carry zero findings across all ten research iterations, plus the two gaps the synthesis confirmed in one of them. **[OPERATOR-DECISION: Q2 — unaudited CLI packets]**
- Executor-kind lists in deep-loop `SKILL.md` files and references, made subset-checkable against the executor schema and the council resolver allowlist.
- Disposition of the unreachable Copilot branches in three command YAMLs. **[OPERATOR-DECISION: DR-1 — Copilot retire or register]**
- Code Mode catalog, namespace examples and allowed-tools reconciliation against the live manual configuration and the registered tool count.
- The MCP hub README topology statement and the leaf manifest that fails the gate.
- The corruption sweep for the malformed three-item executor list, including any instances no research leaf reported.

### Out of Scope

- Deep-loop roster, lane and adapter counts, and deep-loop link rot — owned by the whole-system-gate docs-drift child. This phase owns executor **kind** lists only. Same files in two cases, disjoint line sets, named as a merge hazard below.
- The fan-out feature-catalog leaf — ceded to the track (c) packet.
- Registering a new executor kind in code. If DR-1 rules "register", the code change routes to the track (b) packet and this phase carries only the documentation half.
- Changing the executor schema, the council resolver or any test to make a document true. These are authorities.

### Findings in scope — the 20 registry findings

`⚑` marks an iteration-4 orchestrator-salvaged finding. The salvage did not degrade evidence quality (the synthesis re-verified 7 of 7, and one salvaged finding understated its own severity), but every `⚑` item still gets an explicit re-verify flag in `tasks.md` T001 because its provenance differs from the rest.

| ID | Sev | Primary surface | Claim | Verification status at authoring |
|----|-----|-----------------|-------|----------------------------------|
| RE-004-01 ⚑ | P1 | `system-deep-loop/deep-alignment/SKILL.md` | No tool-permission frontmatter; fail-closed outcomes documented as 3 of 6 | Confirmed by synthesis against HEAD |
| RE-004-03 ⚑ | P1 | `system-deep-loop/deep-research/references/guides/capability-matrix.md` | Matrix contradicts the live runtime-capabilities data | Confirmed by synthesis (read-through, not re-derived) |
| RE-004-04 ⚑ | P1 | `system-deep-loop/deep-research/SKILL.md` | Names three dispatch branches against a seven-kind schema | Confirmed by synthesis against HEAD |
| RE-004-05 ⚑ | P1 | `system-deep-loop/deep-review/references/protocol/loop-protocol.md` | Same pre-parity three-item list | Confirmed by synthesis against HEAD |
| RE-004-06 ⚑ | P1 | `system-deep-loop/deep-ai-council/SKILL.md` | Advertises dispatch routes the resolver rejects | Confirmed — **worse than stated**: a second advertised route is also rejected |
| RE-004-07 ⚑ | P2 | `system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md` | Duplicated executor rows in the seat-vantage table | Confirmed by synthesis |
| RE-004-08 ⚑ | P1 | `system-deep-loop/deep-improvement/references/model-benchmark/lane-b-mechanics.md` | Dispatcher map is stale and carries the malformed list verbatim | Confirmed verbatim by synthesis |
| RE-004-12 ⚑ | P1 | `.opencode/commands/deep/assets/deep-*-{auto,confirm}.yaml` | Copilot branches exist for a kind the schema does not define | Confirmed — zero schema hits, three YAML branch sites |
| RE-005-01 | P1 | `cli-external-orchestration/cli-claude-code/references/cli-reference.md` | Removed and malformed invocation forms, including a boolean flag given a value | Unverified — confirm in T001 |
| RE-005-02 | P1 | `cli-external-orchestration/cli-codex/references/cli-reference.md` | Denies native structured output the installed binary ships; obsolete resume syntax | Confirmed against the live binary |
| RE-005-03 | P1 | `cli-external-orchestration/cli-cursor/**` | Rejects a parameterized-model surface the CLI advertises; names a retired auth-token pair | Unverified — confirm in T001; DR-2 |
| RE-005-04 | P1 | `cli-external-orchestration/cli-devin/**` | Sandboxing presented as a fifth permission mode | Confirmed verbatim by synthesis |
| RE-005-05 | P2 | `cli-external-orchestration/cli-devin/README.md` | Missing the required numbered OVERVIEW section | Unverified — one of only three true structural violations in the whole program |
| RE-005-06 | P1 | `mcp-tooling/README.md` | Describes a three-packet topology against a six-mode registry | Confirmed by synthesis |
| RE-005-07 | P1 | `mcp-tooling/mcp-mobbin/README.md` | Contradicts its own live three-tool contract | Unverified — confirm in T001 |
| RE-008-02 | P1 | `mcp-code-mode/references/tool-catalog.md` | Advertises a tool inventory unrelated to the configured manuals | Unverified — confirm in T001 |
| RE-008-03 | P1 | `mcp-code-mode/references/workflows.md` | Examples call a namespace that is not the live one | Unverified — confirm in T001 |
| RE-008-04 | P1 | `mcp-code-mode/SKILL.md` | Leaf-routing prose contradicts the generated manifest | Unverified — confirm in T001 |
| RE-008-05 | P2 | `mcp-code-mode/SKILL.md` | Allowed-tools omits registered auxiliary tools | Unverified — confirm in T001 |
| RE-009-04 | P1 | `mcp-tooling/leaf-manifest.json` | Manifest retains a deleted reference; **this is the red fleet gate** | **Reproduced live at authoring** — 2 invariant failures, 0 warnings |

### Findings in scope — synthesis-discovered, not in the 74

| ID | Sev | Primary surface | Claim | Verification status |
|----|-----|-----------------|-------|---------------------|
| E-NEW-01 | P1 | `cli-external-orchestration/cli-pi/**` | No document states that print mode surfaces only the final assistant message, so a structured-output leaf silently loses intermediate content | Confirmed by the synthesis: zero grep hits for the concept across the packet |
| E-NEW-02 | P2 | `cli-external-orchestration/cli-pi/**` | No document warns that the JSON event stream can reach hundreds of megabytes when a tool call dumps a large file | Confirmed by the synthesis: zero size or volume warnings in the packet |

**Scope-table total for this phase: 20 + 2 = 22 items.** Every ID above appears in exactly one child of this packet.

### Refutation audit — why one closed ID still produces an edit here

Iteration 9 refuted `RE-004-02` (the deep-alignment README documents 4 convergence decisions where the code defines 6) on the stated ground that the README now lists exactly the four the code defines. That reason cites lines 63-66 of a decisions object that runs to line 68; lines 67-68 hold the two decisions the README omits. **The refuter cherry-picked its own citation range.** The synthesis re-read both files at HEAD: the README does list four, and the code does define six.

The ID stays closed — it is not resurrected and it holds no slot in the arithmetic above. But the underlying drift is real, it is the same defect as the un-refuted `RE-004-01` in the sibling `SKILL.md`, and the first task of this phase will walk straight into it. The zero-cost resolution is to correct the README table inside the same edit that closes `RE-004-01`, and to record here that the correction was made on refutation-audit grounds rather than on a reopened finding. **[OPERATOR-DECISION: Q1 — unsound refutation]**

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Modify | Regenerated by the manifest generator; first action of the phase |
| `.opencode/skills/cli-external-orchestration/cli-codex/references/cli-reference.md` | Modify | Structured-output flags and resume syntax, regenerated from a versioned help fixture |
| `.opencode/skills/cli-external-orchestration/cli-claude-code/references/cli-reference.md` | Modify | Invocation forms corrected; boolean flags no longer given values |
| `.opencode/skills/cli-external-orchestration/cli-cursor/references/{cli-reference,providers-and-models}.md` | Modify | Capability and policy stated as two separate claims; retired auth surface removed |
| `.opencode/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md` | Modify | Permission-mode table loses the containment row; containment documented as orthogonal |
| `.opencode/skills/cli-external-orchestration/cli-devin/README.md` | Modify | Numbered OVERVIEW section added |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/**` | Modify | Print-mode message semantics and event-stream volume warning |
| `.opencode/skills/cli-external-orchestration/cli-opencode/**` | Modify | New-audit findings, if any |
| `.opencode/skills/cli-external-orchestration/*/assets/cli-help/` | Create | Versioned help fixtures with captured version and date |
| `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` | Modify | Tool-permission frontmatter; full fail-closed outcome set |
| `.opencode/skills/system-deep-loop/deep-alignment/README.md` | Modify | Convergence-decision table, on refutation-audit grounds |
| `.opencode/skills/system-deep-loop/{deep-research,deep-ai-council}/SKILL.md` | Modify | Executor lists derived or linked |
| `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | Modify | Executor list derived or linked |
| `.opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md` | Modify | Matrix reconciled with the live capability data |
| `.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md` | Modify | Duplicated rows resolved |
| `.opencode/skills/system-deep-loop/deep-improvement/references/model-benchmark/lane-b-mechanics.md` | Modify | Dispatcher map derived; becomes the roster authority if DR-3 so rules |
| `.opencode/commands/deep/assets/deep-{research,review}-{auto,confirm}.yaml` | Modify | Copilot branches per DR-1 |
| `.opencode/skills/mcp-code-mode/{SKILL.md,references/{tool-catalog,workflows,naming-convention}.md}` | Modify | Inventory, namespaces and allowed-tools reconciled |
| `.opencode/skills/mcp-tooling/{README.md,mcp-mobbin/README.md}` | Modify | Hub topology and packet tool contract |
| `.opencode/skills/sk-doc/shared/scripts/` | Create | Shared helper, if this phase lands first. **[OPERATOR-DECISION: Q7 — shared tooling ownership]** |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The fleet gate returns to green and the true pass count is recorded as the program baseline before any other edit in this packet | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs <root>` run over all 11 hub roots; output recorded verbatim in the packet; the previously failing root reports 0 invariant failures |
| REQ-002 | Every finding in the scope tables is confirmed, marked stale, or marked already-fixed against HEAD before it is edited | `tasks.md` T001 produces a per-ID disposition table; no edit task starts before its ID has one |
| REQ-003 | No document in scope retypes an executor roster | For every roster in the changed files, either the document links to the owning authority, or a check asserts the listed set is a subset of the schema's kinds; the council documents' set is a subset of the resolver allowlist |
| REQ-004 | Every CLI flag table in scope is regenerated from a checked-in capture of that CLI's own help output, and the capture records the binary version and capture date | Fixture files exist for each audited CLI; each flag table's values are reproducible from its fixture by inspection |
| REQ-005 | The malformed three-item executor list is eliminated repo-wide, not just at the four reported sites | `rg -n 'cli-opencode[^\n]*cli-claude-code[^\n]*cli-opencode' .opencode/` returns zero; the pre-sweep count is recorded and any excess over the four known sites is repaired in this phase |
| REQ-006 | The unreachable Copilot branches are dispositioned by an accepted decision, not left ambiguous | `decision-record.md` ADR-001 status is Accepted; the YAMLs match the ruling; if the ruling is "register", the code half is filed to the track (b) packet and referenced here |
| REQ-007 | The packet validates clean | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0 with Errors: 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The two zero-finding CLI packets are audited and their findings scheduled or explicitly dispositioned | An audit note lists what was checked in each packet; the two synthesis-discovered gaps are closed; anything else found is either repaired here or recorded with a reason. **[OPERATOR-DECISION: Q2 — unaudited CLI packets]** |
| REQ-009 | The convergence-decision table in the deep-alignment README is corrected inside the tool-frontmatter edit | The README's decision set matches the code's decision set; `spec.md` records the refutation-audit rationale. **[OPERATOR-DECISION: Q1 — unsound refutation]** |
| REQ-010 | CLI capability and packet policy are stated as two separate claims wherever they were merged | The cursor packet contains a capability statement and a separate policy statement; neither is phrased as "unsupported". **[OPERATOR-DECISION: DR-2]** |
| REQ-011 | One document owns the executor roster number and the others link to it | `decision-record.md` ADR-003 names the owner; the track (c) catalog leaf's link target is agreed with that track. **[OPERATOR-DECISION: DR-3]** |
| REQ-012 | The runtime type-check and test suite are green before and after | `npm run typecheck && npm test` captured pre-edit and post-edit; delta reported, not just the final state |
| REQ-013 | The find-and-replace hypothesis is tested rather than assumed | `git log -S` run against the malformed pattern; result recorded as confirmed or not-established |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The fleet gate passes on all 11 hub roots and the pass count is recorded from a run, not from memory.
- **SC-002**: Zero occurrences of the malformed three-item executor pattern remain under `.opencode/`.
- **SC-003**: Every executor roster in the changed documents is either a link or a set proven to be a subset of its owning authority.
- **SC-004**: Every changed CLI flag table traces to a checked-in help fixture carrying a version and a date.
- **SC-005**: Each of the 22 scope items ends in exactly one state: repaired, stale-finding, already-fixed, or deferred-with-reason.
- **SC-006**: `validate.sh --strict` reports Errors: 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Installed CLI binaries present and runnable during the phase | Flag tables cannot be regenerated from fixtures that cannot be captured | Capture all fixtures in one early task; if a binary is unavailable, mark that packet's tables unverified rather than editing from memory |
| Dependency | The whole-system-gate docs-drift child touches one deep-research README this phase also edits | Merge conflict or silent overwrite | Named merge hazard; whichever lands second rebases. This phase owns executor-kind lines only |
| Dependency | Shared helper ownership across three tracks | Three near-identical validators ship | **[OPERATOR-DECISION: Q7]** — one home, others declare a consumer edge |
| Risk | Findings are hypotheses and the tree has moved since the research loop | High | T001 confirms every ID first. Below 75% confirmation the phase is re-scoped, not patched |
| Risk | The Copilot ruling turns a documentation phase into a code change | Med | Default is retire, which stays in documentation and YAML. Register routes the code half elsewhere |
| Risk | Regenerating the leaf manifest masks a real content problem instead of fixing it | Med | Verify the removed entry is genuinely gone from disk before regenerating; the gate names the missing target explicitly |
| Risk | The corruption sweep's pattern is too narrow and leaves near-miss variants | Med | Run the narrow pattern and a widened variant; record both counts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The derived-roster check and the corruption sweep must each complete in under 30 seconds on the full `.opencode/` tree, so they are cheap enough to run on every subsequent phase.

### Security
- **NFR-S01**: Captured CLI help fixtures must contain no credentials, tokens or machine-identifying paths. Each fixture is reviewed before it is committed.

### Reliability
- **NFR-R01**: Every check introduced by this phase must fail loudly on a missing input rather than passing vacuously. A check that cannot find its authority file reports an error, not a pass.

---

## 8. EDGE CASES

### Data Boundaries
- A CLI help output that changes between capture and edit: the fixture's captured version and date make the mismatch visible instead of silent.
- A roster that legitimately lists a subset of kinds (a document scoping itself to two executors on purpose): the check asserts subset, not equality, and the document states why it is a subset.

### Error Scenarios
- A binary missing from the machine: that packet's tables are marked unverified in the phase output rather than edited from memory.
- The manifest generator producing a different result than the gate's freshly computed hash: stop and investigate rather than committing the generator's output blind.
- The corruption sweep returning more sites than findings reported: the excess is in scope for this phase and is listed explicitly in the phase output.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | ~30 files across 11 skill packets and 4 command assets |
| Risk | 14/25 | Auth: N, API: N, Breaking: only if the Copilot ruling touches code |
| Research | 12/20 | Two unaudited packets, one find-and-replace hypothesis to test, five binaries to capture |
| Multi-Agent | 6/15 | Runs parallel to one sibling; coordinates with two external packets |
| Coordination | 10/15 | Named merge hazard, ceded findings, shared helper ownership |
| **Total** | **61/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Findings have gone stale; the phase edits a tree that already moved | H | M | T001 gate; re-scope threshold at 75% |
| R-002 | Two packets rewrite the same deep-research README | M | M | Merge hazard declared; executor-kind lines only |
| R-003 | Fleet-gate repair hides a real deletion | M | L | Confirm the removed target is genuinely absent before regenerating |
| R-004 | Copilot ruling expands scope into code | M | M | Default retire; register routes the code half to the code packet |
| R-005 | Fixture capture leaks machine paths | L | M | Review each fixture before commit |
| R-006 | The derived-roster check passes vacuously when it cannot parse a document | M | M | Fail loudly on unparsed rosters; count parsed documents and assert the count |

---

## 11. USER STORIES

### US-001: Structured-output dispatch (Priority: P0)

**As an** agent dispatching a structured-output leaf through an external CLI, **I want** the packet reference to name the CLI's real structured-output flags, **so that** I constrain the response with a schema instead of asking for JSON in the prompt and parsing hopefully.

**Acceptance Criteria**:
1. Given the codex packet reference, When I look up structured output, Then I find the JSONL event flag and the final-response schema flag, each traced to a versioned help fixture.
2. Given a print-mode dispatch through the pi packet, When I read the mode documentation, Then I am told that print mode surfaces only the final assistant message.

### US-002: Choosing an executor (Priority: P0)

**As an** agent choosing a dispatch route from a deep-loop `SKILL.md`, **I want** the advertised routes to be exactly the routes the resolver accepts, **so that** I do not select a route that raises an exception or silently degrades to native.

**Acceptance Criteria**:
1. Given any deep-loop document that lists executors, When I compare the list to the schema, Then the list is a subset and no entry is duplicated.
2. Given a council document, When I compare its advertised routes to the resolver allowlist, Then every advertised route is accepted.

### US-003: An honest baseline (Priority: P1)

**As a** reviewer of any later phase in this packet, **I want** the fleet-gate pass count to come from a recorded run, **so that** a "no regressions" claim can actually be falsified.

**Acceptance Criteria**:
1. Given the phase output, When I look for the baseline, Then I find verbatim gate output for all 11 roots with a date, not a remembered number.

---

## 12. OPEN QUESTIONS

- **[OPERATOR-DECISION: Q1 — unsound refutation]** Correct the deep-alignment README inside the frontmatter edit? Recommendation: yes; cost is one table, and the ID stays closed.
- **[OPERATOR-DECISION: Q2 — unaudited CLI packets]** Audit the two zero-finding CLI packets in this phase? Recommendation: yes; two real gaps were confirmed in one of them in minutes.
- **[OPERATOR-DECISION: DR-1 — Copilot retire or register]** Recommendation: retire the branches. Registering is a code change and belongs to the code-conformance packet.
- **[OPERATOR-DECISION: DR-2 — capability versus policy]** Recommendation: state both, separately; never merge them into "unsupported".
- **[OPERATOR-DECISION: DR-3 — roster ownership]** Recommendation: the model-benchmark mechanics reference is the authority for the dispatcher roster; the catalog leaf links to it.
- **[OPERATOR-DECISION: Q7 — shared tooling ownership]** If this phase lands first, does it build the shared helpers, or wait for the track that already claimed them?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: See `../spec.md`
