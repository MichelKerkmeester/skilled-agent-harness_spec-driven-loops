---
title: "Feature Specification: Gateway [system-deep-loop/036-deep-loop-innovation/015-gateway-contract-remediation/spec]"
description: "Remediate the deep-loop state-write contract so exactly one path — the append gateway — is instructed, permitted, and enforced across prompt-pack templates, runtime projection refresh, the iteration validator, mode SKILLs, the conformance guard, and the ai-council MCP surface, closing the ten findings the 014 deep-review confirmed the 013 fix and its audit missed."
trigger_phrases:
  - "gateway contract remediation"
  - "state-write contract contradiction fix"
  - "prompt-pack direct append fix"
  - "review alignment projection refresh"
  - "check-agent-gateway fail closed"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/015-gateway-contract-remediation"
    last_updated_at: "2026-08-25T14:35:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the remediation spec from the 014 deep-review findings"
    next_safe_action: "Await operator approval of ADR-002 direction, then build WS1 first"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    completion_pct: 0
    open_questions:
      - "P0 resolution direction: wire review/alignment projection refresh (A) vs accept gateway receipts in the validator (B) — pending confirmation of whether 012 left review/alignment refresh unwired deliberately."
      - "ai-council sequential_thinking: remove everywhere vs whether .pi/mcp.json registers a genuinely live local server."
    answered_questions:
      - "Where does this live? New child 015 under the 036 phase parent (013 shipped/immutable, 014 is the review record)."
      - "Scope? All ten findings plus the fanout-merge tool bug."
---
# Feature Specification: Gateway State-Write Contract Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The `014-gateway-alignment-review` deep-review (20 iterations, two independent ox-alpha lineages) returned **FAIL** on the deep-loop state-write surface: **1 P0, 5 P1, 4 P2**, plus a **P0-masking bug in the review tooling itself**. Every finding was re-verified against source at synthesis and again by hand before this spec.

The blocking finding (P0) is that the state-write contract is **self-contradictory in shipped artifacts**. The `013` packet migrated the leaf **agent persona files** to "record through the append gateway," but a CLI-dispatched leaf actually executes the **prompt-pack template**, which still mandates a raw `echo '<json>' >> {state_log}` redirect; meanwhile the runtime only refreshes the legacy state projection for `research`, and the iteration validator requires the record to be present in that projection. The net effect: a leaf that obeys the `013` gateway-only instruction is deadlocked (its write never lands in the projection the validator reads, so it redispatches forever), while a leaf that obeys the prompt-pack commits exactly the direct-write bypass `013` was commissioned to eliminate.

This packet reconciles the contract to a single canonical write path (the append gateway) across all six surfaces the review named, closes the five P1 and four P2 findings, and fixes the merge-gate bug that silently dropped all findings.

<!-- /ANCHOR:executive-summary -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-25 |
| **Branch** | `system-deep-loop/036-deep-loop-innovation/015-gateway-contract-remediation` |
| **Source review** | `014-gateway-alignment-review/review/review-report.md` (FAIL; 10 findings) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a child of the `036-deep-loop-innovation` phase parent. Its lineage:

- `013-runtime-agent-gateway-alignment` (shipped to main): migrated the four leaf **agent persona files** across six runtimes to the gateway. Deliberately narrow-scoped — it excluded the prompt-pack templates, the runtime, the SKILLs, and the YAMLs.
- `014-gateway-alignment-review` (review record): the deep-review that found the excluded surfaces still carry the pre-gateway contract, producing the P0 contradiction.
- `015` (this packet): remediate the surfaces `013` left, so the gateway contract is coherent end-to-end.

`013` stays immutable (already on main). This packet does not reopen it; it completes the contract on the adjacent surfaces.

<!-- /ANCHOR:phase-context -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Ten confirmed findings, all cited to shipped source in `014`'s registry:

- **F-008 (P0) — three-way write-contract contradiction.** `deep-review/assets/prompt-pack-iteration.md.tmpl:117-118` (and the research/alignment siblings) instruct `echo '<json>' >> {state_paths_state_log}`; the agent persona `.opencode/agents/deep-review.md:250` mandates gateway `--event-json`; the runtime `append-mode-event.ts` refreshes the legacy projection only for `mode==='research'` (branches at :191,205); `verify-iteration.cjs:167` requires the record in the state log. A gateway-clean review/alignment leaf therefore fails `state_record_missing` and redispatches; a pack-obedient leaf bypasses the gateway.
- **F-001 (P1)** — ai-council prompts mandate the decommissioned `sequential_thinking` MCP (`.opencode/agents/ai-council.md:22`; `AGENTS.md:391` declares it decommissioned).
- **F-002 (P1)** — research/review leaves and their prompt packs lack the untrusted-target prompt-injection guard the loop protocol mandates and the alignment leaf demonstrates (`deep-alignment.md:25`).
- **F-003 + P1-002 (P1)** — mode SKILLs teach pre-gateway doctrine: `deep-review/SKILL.md:60` "reduce-state.cjs is the SINGLE state writer", contradicting the gateway model; the file never mentions the gateway (unlike `deep-research/SKILL.md:272`).
- **P1-001 (P1)** — confirm-mode YAMLs dispatch full-write CLI leaves without the write-containment guards their auto-mode siblings carry (`deep-research-confirm.yaml:1060+` vs the auto branch).
- **P1-003 (P1)** — the `013` guard `check-agent-gateway.sh` fails open: `|| continue` silently skips unresolvable agents (`:26-31`) and exit stays 0 with no `checked==24` floor assertion.
- **P2-001** — ASCII flow arrows next to state-file names desensitize grep guards. **P2-002** — duplicated sandbox-capability prose rots silently. **P2-003** — the guard's regexes miss single-`>` truncate, `| tee`, and no-space-backtick `--event-json`, and never scan the prompt-packs/YAMLs/docs where the P0 bypass actually lives. **P2-004** — `deep-research/SKILL.md:272` calls the gateway's one-record input a "JSONL delta" (delta/payload conflation).
- **TOOL bug (elevated deferred)** — `fanout-merge.cjs:759` filters on `finding.status==='active'` while lineage registries emit `disposition: active`, so the first merge returned a silent empty PASS over 11 real findings. A release gate consuming raw merge output would stamp PASS over an active P0.

### Purpose

Make the append gateway the single canonical state-write path, instructed and enforced identically across every artifact a dispatched leaf touches, so that a contract-clean leaf writes durably and passes validation with no direct-write path available; and close the remaining doc, guard, containment, MCP-staleness, and merge-gate findings.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **WS1 (P0):** reconcile the write contract — fix the three prompt-pack templates to route through `append-mode-event.cjs`; make gateway-only writes satisfy `verify-iteration.cjs` (direction decided in `decision-record.md` ADR-002).
- **WS2 (P1):** remove the decommissioned `sequential_thinking` mandate from ai-council prompts/metadata across runtimes; resolve `.pi/mcp.json`.
- **WS3 (P1):** port the untrusted-target injection guard into the research/review leaves and their prompt packs.
- **WS4 (P1):** rewrite mode-SKILL state-writer doctrine to the gateway-owned model and fix the "JSONL delta" terminology (folds P2-004).
- **WS5 (P1):** port the auto-YAML write-containment block into the two confirm YAMLs.
- **WS6 (P1):** make `check-agent-gateway.sh` fail closed — count floor + unresolvable-agent failure + extended regexes + prompt-pack/YAML scanning (folds P2-001/P2-003).
- **WS7 (TOOL):** fix `fanout-merge.cjs` field-name drift so the merge gate cannot silently PASS over active findings.
- **P2 advisories** batched with their touching surfaces.

### Out of Scope

- Reopening `013` (shipped to main; immutable).
- The append gateway's core append/authorization/ledger machinery beyond the review/alignment projection-refresh wiring named in WS1.
- Any deep-loop surface unrelated to the state-write contract.
- Executing the fix — this packet is the **plan**; implementation is a separate, authorized build.

### Files to Change (target surfaces)

| File Path | Workstream | Change Type |
|-----------|-----------|-------------|
| `.opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` | WS1 | Modify |
| `.opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | WS1 | Modify |
| `.opencode/skills/system-deep-loop/deep-alignment/assets/alignment-prompt-pack.md.tmpl` | WS1 | Modify |
| `.opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts` | WS1 | Modify (per ADR-002) |
| `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | WS1 | Modify (per ADR-002) |
| `.opencode/agents/ai-council.md`, `.claude/agents/ai-council.md`, `.pi/mcp.json` (+ other runtimes) | WS2 | Modify |
| research/review leaf prompts + their prompt packs | WS3 | Modify |
| `deep-review/SKILL.md`, `deep-research/SKILL.md` (+ alignment/ai-council SKILLs) | WS4 | Modify |
| `.opencode/commands/deep/assets/deep-research-confirm.yaml`, `deep-review-confirm.yaml` | WS5 | Modify |
| `specs/.../013-runtime-agent-gateway-alignment/scripts/check-agent-gateway.sh` | WS6 | Modify |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | WS7 | Modify |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No shipped artifact instructs a direct `{state_log}` append | Grep across prompt-packs, agent prompts, SKILLs, and YAMLs finds zero `>> {state_log}` / `>> *-state.jsonl` write instructions; every state-write instruction names `append-mode-event.cjs`. |
| REQ-002 | A gateway-only review/alignment leaf passes validation | With the ADR-002 direction applied, a leaf that writes only through the gateway has its record satisfy `verify-iteration.cjs` (no `state_record_missing`), proven by a negative-control run that reproduces the deadlock before the fix and clears it after. |
| REQ-003 | The conformance guard fails closed and covers the bypass surface | `check-agent-gateway.sh` exits non-zero when fewer than the expected agents resolve or any target is unresolvable, and its scan includes the prompt-pack templates where the P0 bypass lived. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | ai-council no longer mandates a decommissioned MCP | No ai-council prompt/metadata references `sequential_thinking` unless a genuinely live local server backs it; `.pi/mcp.json` reconciled. |
| REQ-005 | Injection-guard parity | Research/review leaves and prompt packs carry the untrusted-target guard the alignment leaf demonstrates. |
| REQ-006 | SKILL doctrine matches the gateway | No mode SKILL claims reduce-state is the SINGLE state writer; each names the gateway as the state-log writer; "JSONL delta" terminology corrected. |
| REQ-007 | Containment parity | The two confirm YAMLs carry the auto-mode write-containment guards. |
| REQ-008 | Merge gate cannot silently pass | `fanout-merge.cjs` consumes the field the registries actually emit; a fixture with an active finding yields a non-empty, non-PASS merge. |

### P2 - Advisories (batch with touching surfaces)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Guard regex depth | Guard rejects single-`>` truncate, `\| tee`, and no-space-backtick `--event-json` shapes. |
| REQ-010 | Doc-drift reduction | ASCII-arrow desensitization and duplicated sandbox prose addressed where the touched files allow. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero artifacts instruct a direct state-log append; the gateway is the only instructed write path (grep-proven).
- **SC-002**: A negative-control dispatch reproduces the gateway-only-leaf deadlock before the fix and passes after (REQ-002).
- **SC-003**: The hardened guard fails closed and, run over the tree, reports the expected agent count with the prompt-packs in scope.
- **SC-004**: All five P1 findings closed with file:line/command evidence; the merge-gate fixture proves the bug is fixed.
- **SC-005**: `validate.sh <spec-folder> --strict` exits clean; the scoped diff carries only the named target surfaces plus this spec folder; deep-loop runtime tests pass at baseline+delta.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Prompt-pack change breaks all future review/research/alignment dispatch | High — this is live runtime every deep-loop run executes | Negative-control dispatch before and after; stage WS1 first and gate on a real one-iteration run passing. |
| Risk | ADR-002 direction A (wire projection refresh) contradicts a deliberate 012 design choice | Wrong fix re-breaks the projection contract | Build must first confirm WHY review/alignment refresh was left unwired (deliberate vs unfinished) before committing a direction. Logic-Sync if evidence conflicts. |
| Risk | Removing `sequential_thinking` breaks a runtime that still has a live local server | ai-council loses a real capability | Inspect `.pi/mcp.json` for a live registration before removing; remove only where the server is truly gone. |
| Dependency | `014` review findings + registry | The evidence base for every workstream | Shipped and re-verified; `014/review/review-report.md`. |
| Dependency | 012 runtime-enablement contracts (ledger, projection, gateway) | The model WS1 reconciles against | Shipped; this packet extends its review/alignment wiring, does not replace it. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Correctness (the load-bearing NFR)
The state-write path is a correctness boundary: a leaf either writes durably to the authoritative ledger and its projection, or it does not. There is no acceptable "mostly writes." The remediation must leave exactly one instructed path and prove it end-to-end, not merely delete the contradictory prose.

### Reversibility
Every workstream must state a concrete rollback. Because nothing here is committed at plan time and the fix lands on a worktree branch, rollback before merge is `git restore`; after merge it is a revert of the scoped diff. WS1's runtime changes must be revertible without leaving the projection in a half-wired state.

### Security-adjacency
WS3 (injection guard), WS5 (write containment), and WS6 (fail-open guard) are security-adjacent. Their closure requires closed-gate replay with file:line/command evidence, per the review's `fixCompletenessRequired`.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Gateway returns exit 2 (refused)
A leaf whose gateway append is refused must halt and name the failed check, never fall back to a direct write. The prompt-pack rewrite must preserve this — replacing the redirect with the gateway call must not introduce a "if the gateway fails, echo to the file" fallback.

### Review/alignment projection genuinely has no consumer
If the build finds review/alignment deliberately have no projection consumer (so refresh was correctly skipped), ADR-002 direction B (validator accepts a gateway receipt) is the correct path, not A. The plan must not hard-code A.

### The guard's own count changes
If a runtime's agent set legitimately changes (e.g. a new runtime added), the `checked==24` floor becomes stale. WS6 must derive the expected count from the runtime × agent matrix, not a hard-coded literal, so a legitimate change updates the floor rather than silently passing.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | ~13 files across prompt-packs, runtime (2), SKILLs (4), agents, YAMLs (2), guard, merge tool; systems: deep-loop runtime, 6 agent runtimes, CI guard |
| Risk | 22/25 | Breaking: YES — live runtime every deep-loop dispatch executes; wrong prompt-pack/wiring change breaks all future review/research/alignment runs |
| Research | 12/20 | The `014` deep-review is the research; plus one open runtime-intent question (ADR-002 A vs B) |
| Multi-Agent | 6/15 | Buildable single-implementer + independent verify; no fan-out required |
| Coordination | 10/15 | WS1 blocks downstream; sequential gating with a real-dispatch gate after WS1 |
| **Total** | **68/100** | **Level 3** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | WS1 prompt-pack change breaks live dispatch | H | M | Negative-control one-iteration dispatch gate after WS1, before any other workstream |
| R-002 | ADR-002 direction chosen wrong (A vs B) | H | M | Confirm 012's projection-refresh intent first; make the direction an ADR the operator approves |
| R-003 | `sequential_thinking` removed where a live local server exists | M | L | Inspect `.pi/mcp.json` before removal |
| R-004 | Guard hardening over-fits and rejects a legitimate future agent shape | L | M | Derive expected count from the matrix; regexes target write-verbs, not any state-file mention |
| R-005 | Merge-tool fix masks a second field-drift elsewhere in the merge path | M | L | Add a fixture with a known-active finding as a regression test, not just a field rename |

<!-- /ANCHOR:risk-matrix -->
---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Operator approving the remediation direction (Priority: P0)

**As an** operator, **I want** the P0 resolution direction (ADR-002 A vs B) stated with its rationale and the open runtime-intent question flagged, **so that** I approve the right fix before any live-runtime change is made.

**Acceptance Criteria**:
1. Given `decision-record.md`, When I read ADR-002, Then it states the recommended direction, the alternative, and the exact check the build must run first to confirm 012's intent.

### US-002: Implementer executing WS1 (Priority: P0)

**As** whoever builds WS1, **I want** a concrete before/after for each prompt-pack template and the validator, **so that** I can make the change and prove it with a negative-control dispatch.

**Acceptance Criteria**:
1. Given `tasks.md`, When WS1 starts, Then each target file, its current instruction line, and the gateway replacement are named, plus the exact reproduce-then-fix check.

### US-003: Reviewer confirming closure (Priority: P1)

**As** a reviewer, **I want** each finding mapped to a task with a file:line/command proof, **so that** I can confirm all ten are closed rather than assumed.

**Acceptance Criteria**:
1. Given `checklist.md`, When the build claims done, Then each finding ID has a checked item citing the evidence that closed it.

<!-- /ANCHOR:user-stories -->
---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- **ADR-002 direction (A vs B):** does the review/alignment gateway path have a legacy-projection consumer at all? If yes → direction A (wire the refresh). If no → direction B (validator accepts a gateway receipt). The build must confirm 012's intent before choosing; recorded as the pivotal decision in `decision-record.md`.
- **`.pi/mcp.json` sequential_thinking:** stale registration to remove, or a genuinely live local server to keep? Requires inspecting that file at build time.

<!-- /ANCHOR:questions -->
---

## RELATED DOCUMENTS

- `plan.md` — the sequenced remediation approach (WS1-first behind the negative-control gate).
- `tasks.md` — T001–T010 with file:line targets and per-task proofs.
- `decision-record.md` — ADR-001 (canonical write path), ADR-002 (P0 direction), ADR-003 (ai-council MCP), ADR-004 (guard hardening).
- `checklist.md` — finding→task verification map.
- `../014-gateway-alignment-review/review/review-report.md` — the source review (FAIL; 10 findings + tool bug).
- `../013-runtime-agent-gateway-alignment/` — the shipped, immutable prior fix this packet completes.
