---
title: "Implementation Plan: Deep-Research Remediation Program"
description: "Verify-first remediation of the 198 Fable-verified findings from the tri-system deep research, ordered by risk lane (security → code-graph apply → idempotency → launcher → advisor → continuity → shadow/feedback → sweep), plus the dashboard render-contract true-solution investigation."
trigger_phrases:
  - "deep research remediation plan"
  - "029 remediation plan"
  - "lane remediation order"
  - "verify first remediation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/005-verification-and-remediation/003-deep-research-remediation"
    last_updated_at: "2026-06-12T12:10:00Z"
    last_updated_by: "claude-fable-orchestrator"
    recent_action: "L1 lane + L8 true-solution shipped and Fable-verified"
    next_safe_action: "Continue Goal B at L2 code-graph apply safety"
    blockers: []
    key_files:
      - "backlog/remediation-backlog.json"
      - "L1-security-safety/disposition.md"
      - "L8-command-adherence/disposition.md"
    session_dedup:
      fingerprint: "sha256:2003d4aca44bb943b1eae69b36f1d9ebe8fe3f8a5e907a323dbee96013ac03b3"
      session_id: "029-remediation-resume-2026-06-12"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep-Research Remediation Program

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server, scripts, shared), Node CJS (launchers), Markdown command/skill docs |
| **Framework** | spec-kit MCP daemon + daemon-backed CLIs |
| **Storage** | SQLite (context-index.sqlite + shards) via better-sqlite3 |
| **Testing** | vitest (unit + stress harnesses), live daemon verification, model-dispatch probes |

### Overview
Work the 198-item Fable-verified backlog down lane by lane in risk order, with a hard verify-first protocol per finding: Fable verify still-real, implement (hand for storage/security/launcher; fenced gpt-5.5-fast seats for docs), Fable adversarial re-verify against the original proof, scoped lane commit, disposition update. The L8 dashboard lane additionally required a fresh investigation into why doc-only render contracts "failed" — resolved as a probe-harness artifact.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (backlog with per-finding proofs)
- [x] Success criteria measurable (per-finding Fable re-verify against original proof)
- [x] Dependencies identified (one warm daemon; ≤3 concurrent opencode; claude2 verify seats)

### Definition of Done
- [ ] All acceptance criteria met (every non-refuted backlog item dispositioned)
- [x] Tests passing for shipped lanes (L1: 13 lock tests + 97 telemetry/scrubber tests green)
- [x] Docs updated for shipped lanes (L1 + L8 dispositions, catalog, 022 reconciliation)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator + verify-first sub-agents over a lane-partitioned backlog.

### Key Components
- **Backlog registry** (`backlog/remediation-backlog.json`): 203 items, per-item verdict + proof; lanes L1–L9.
- **Lane dispositions** (`L*-*/disposition.md`): what shipped, verdicts, held items, newly discovered follow-ons.
- **Verify artifacts** (`verify/*.md`): adversarial Fable verdicts gating every commit.

### Data Flow
Finding → Fable still-real check → implementation (hand or fenced seat) → Fable adversarial re-verify → scoped commit → disposition + backlog bookkeeping.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/lib/search/*` (DB open/close) | owns canonical DB lifecycle | update (single-writer lock) | 8 lock tests + live second-daemon refusal (exit 86) |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | daemon supervision | update (exit-86 contract, self-lease guard) | 5 decision tests + Fable verdict |
| `shared/parsing/secret-scrubber.ts` | canonical scrubber | created (promoted byte-identical) | shasum + Fable zero-diff check |
| `scripts/core/workflow.ts` | CLI save lane | update (fail-closed scrub before persistence) | 27 scrubber tests + planted-secret runtime smoke |
| `mcp_server/lib/telemetry/consumption-logger.ts` | query telemetry | update (hash-only fingerprints + legacy purge) | 97 tests + live DB 0 prefix rows |
| command routers + cli-opencode skill | dispatch/render contracts | update (--command rule, score slot, placeholder sweep) | 3/3 envelope gauntlet + negative control + prompt-card guard |

Same-class producer inventories and consumer greps are recorded per finding in the lane dispositions and verify verdicts.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Backlog banked with Fable verdicts (190 STILL-REAL + 8 adherence recs)
- [x] Handover + resume protocol established
- [x] DB health + single-daemon preflight

### Phase 2: Core Implementation (by lane risk order)
- [x] L1 security/safety (6/6 findings closed)
- [x] L8 command adherence (true solution shipped; harness artifact resolved)
- [ ] L2 code-graph apply safety (28: batch-verified 28/28 still-real; 13 doc/hygiene fixes shipped; apply-pipeline cluster + 9 code items held with sequencing plan in the lane disposition)
- [ ] L3 idempotency flag-ON blockers (5)
- [ ] L4 launcher lifecycle parity (15)
- [ ] L5 advisor correctness (35)
- [ ] L6 save/continuity truth (17)
- [ ] L7 shadow/feedback honesty (19)
- [ ] L9 P2/P3 sweep (65)

### Phase 3: Verification
- [x] Per-fix Fable adversarial re-verify before every commit (standing rule)
- [x] Live deployment verification after daemon-affecting changes
- [ ] Final backlog reconciliation when all lanes close
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit suites colocated in `mcp_server/tests/` per fix; cross-process lock semantics tested with real child processes; live verification against the warm daemon (refusal probes, planted-secret smokes, post-recycle DB checks); model-behavior claims gated by the `L8-command-adherence/probe.sh` gauntlet with its labeled negative control.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Exactly one warm spec-memory daemon during storage work (enforced by the shipped lock).
- claude2 (account 2) availability for Fable verify seats; native Fable fallback on session limit.
- cli-opencode contract for gpt-5.5 probes/seats (≤3 concurrent; `</dev/null`).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every fix lands as a scoped per-lane commit on `028-mcp-to-cli-tool-transition`; revert the lane commit(s) to roll back. The DB lock carries a kill switch (`SPECKIT_DB_LOCK_DISABLE=1`) for emergency unblocking without a revert; daemon dist rolls back via rebuild from the prior commit + transparent recycle.
<!-- /ANCHOR:rollback -->
