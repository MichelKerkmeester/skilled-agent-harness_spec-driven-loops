# Iteration 9 — Cross-arc reference completeness and correctness

**Spec folder**: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/` (pre-approved, skip Gate 3)
**Framework**: RCAF (Role / Context / Action / Format) per cli-devin SKILL.md §3 SWE-1.6 contract
**Iteration**: 9 of 10 — prior trail [11, 5, 8, 2, 2, 4, 1, 2] @ newInfoRatio = [1.00 × 8]
**Bundle-gate language**: standard (do NOT tighten; SWE-1.6 over-tightens defensively)

---

## R — ROLE

You are a **cross-arc citation auditor** verifying that every cross-arc reference (any cite mentioning a phase/packet/arc number outside this packet's own arc `131/000/001`) in the deep-loop-runtime skill's documentation surface:

1. Resolves to an actual path on disk
2. Cites an ADR number that exists in that decision-record.md
3. Points to a topic that matches what the doc says it points to
4. Is consistent across SKILL.md + README.md + changelog/v1.0.0.0.md + changelog/v1.1.0.0.md + references/*.md + feature_catalog/feature_catalog.md + manual_testing_playbook/manual_testing_playbook.md

This is the iter 9 focus per `research/deep-research-strategy.md` §4: "Cross-arc references: phase 118 ADRs, phase 117 council ruling, phase 129/001 ADR-001 (council primitives)."

You are dispatched by an orchestrator that has performed a **complete inventory sweep** (`grep -rn -E "(phase |packet |arc )?1(17|18|29|31)..."` across all doc surfaces) and has discovered:

- **DR-029 (iter 6) is INCOMPLETE.** It enumerated 4 sites citing "Packet 129/001 ADR-001" (SKILL.md:144, README.md:198, README.md:247, README.md:417). The orchestrator's sweep found:
  - **5th site (NEW)**: `changelog/v1.1.0.0.md:63` — "3.5 Council primitives (5 modules per packet 129/001 ADR-001)"
  - **6th drift on SKILL.md L144 (NEW)**: SKILL.md L144 contains a SECOND "packet 129" phrase that DR-029 did not call out — "These primitives are consumed by downstream **packet 129 phases 003-006** for per-topic orchestration, multi-topic session state, command wiring, parity tests, and docs." Verified: those phases actually live at `131/001/{010, 011, 012, 013}` (per-topic-multi-round, session-findings-registry, command-and-skill-wiring, parity-cost-docs). So SKILL.md L144 has TWO independent "129" drifts, not one.

All other 117/118/131 citations in the orchestrator's inventory have been pre-verified to resolve on disk with correct ADR numbers and topic match.

Your job is to (a) CONFIRM these new findings via direct file reads and (b) produce ONE final cross-arc-citation finding (DR-037) that supersedes DR-029 with the complete 5-site + secondary-phrase map.

---

## C — CONTEXT

### C.1 — Orchestrator's complete cross-arc citation inventory (pre-verified path resolution)

| # | Surface:Line | Citation form | Resolves on disk? | Topic match? | Verdict |
|---|--------------|---------------|-------------------|--------------|---------|
| 1 | `SKILL.md:144` (phrase A) | "Packet 129/001 ADR-001" | **NO** — packet 129 does not exist | n/a | **BROKEN** (DR-029) |
| 2 | `SKILL.md:144` (phrase B) | "downstream packet 129 phases 003-006" | **NO** — actual location is `131/001/010-013` | n/a | **BROKEN** (NEW, missed by DR-029) |
| 3 | `SKILL.md:251` | "117 ADR-001" + `131/.../001-core-isolation-deliberation/decision-record.md` (L265) | YES | YES — ADR-001 = "SPLIT: Move Pure Runtime Libs..." | PASS |
| 4 | `SKILL.md:252` | "118 ADR-001" | YES (cited in L262-264 as 003/004/005 phases under 131-deep-skill-evolution; ADR-001 in 005 = "Complete Removal of Four MCP Tools") | YES | PASS |
| 5 | `SKILL.md:261-264` | 118 phase parent + phases 003/004/005/008 paths | YES — all paths resolve under `131-deep-skill-evolution/spec.md` and `003-deep-loop-runtime/` | YES | PASS |
| 6 | `SKILL.md:265` | "117 council deliberation" path | YES | YES | PASS |
| 7 | `README.md:59` | "Arc 118 (FULL_ISOLATE_NO_MCP)" + "117 AI Council SPLIT ruling" (prose) | YES (descriptive, not a path) | YES (matches the 117 ruling at 131/003/001 and the 118 ADRs at 131/003/004,005) | PASS |
| 8 | `README.md:116` | spec-folder `131-deep-skill-evolution` (in example command) | YES | YES | PASS |
| 9 | `README.md:198` | "Packet 129/001 ADR-001" | **NO** | n/a | **BROKEN** (DR-029) |
| 10 | `README.md:247` | "(per packet 129/001 ADR-001)" | **NO** | n/a | **BROKEN** (DR-029) |
| 11 | `README.md:345` | spec-folder `131-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime` (in example command) | YES | YES | PASS |
| 12 | `README.md:401` | "Arc 118 ADR-001" (prose claim about removing 4 MCP tools) | YES — matches `131/003/005/decision-record.md` ADR-001 | YES | PASS |
| 13 | `README.md:417` | "Packet 129/001 ADR-001" | **NO** | n/a | **BROKEN** (DR-029) |
| 14 | `README.md:438` | "(arc 118 consolidation)" pointing at `changelog/v1.0.0.0.md` | YES | YES | PASS |
| 15 | `README.md:458` | `131-deep-skill-evolution/spec.md` | YES | YES | PASS |
| 16 | `README.md:459` | `131-deep-skill-evolution/003-deep-loop-runtime/004-script-shim-db-relocation/decision-record.md` ADR-001 | YES — ADR-001 = "Per-Invocation DB Ownership..." | YES (matches "script interface contract and DB lifecycle ownership transfer") | PASS |
| 17 | `README.md:460` | `131-deep-skill-evolution/003-deep-loop-runtime/005-mcp-tool-surface-removal/decision-record.md` ADR-001 | YES — ADR-001 = "Complete Removal of Four MCP Tools (No Backward-Compat Aliases)" | YES (matches "MCP tool surface removal rationale") | PASS |
| 18 | `README.md:461` | `131-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/decision-record.md` "117 council ruling (SPLIT, superseded by 118)" | YES — ADR-001 = "SPLIT — Move Pure Runtime Libs..." | YES | PASS |
| 19 | `changelog/v1.0.0.0.md:3` | spec folder `131-deep-skill-evolution/003-deep-loop-runtime/009-verification-changelog-closeout/` | YES | YES | PASS |
| 20 | `changelog/v1.0.0.0.md:9,72,77` | "Arc 118" prose claims (FULL_ISOLATE_NO_MCP, MCP tool deletion) | YES (prose, not paths) | YES | PASS |
| 21 | `changelog/v1.0.0.0.md:94` | `131-deep-skill-evolution/spec.md` | YES | YES | PASS |
| 22 | `changelog/v1.0.0.0.md:95` | "117 council ruling (superseded)" + `131-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/decision-record.md` ADR-001 | YES | YES | PASS |
| 23 | `changelog/v1.0.0.0.md:96` | "118/003 ADR-001: script interface contract..." | YES (= `131/003/004/decision-record.md` ADR-001) | YES | PASS |
| 24 | `changelog/v1.0.0.0.md:97` | "118/004 ADR-001: MCP tool surface removal" | YES (= `131/003/005/decision-record.md` ADR-001) | YES | PASS |
| 25 | `changelog/v1.1.0.0.md:8,107,117` | spec folder + project arc `131-deep-skill-evolution/...` | YES | YES | PASS |
| 26 | `changelog/v1.1.0.0.md:45` | "arc-118 FULL_ISOLATE_NO_MCP consolidation" (prose) | YES | YES | PASS |
| 27 | `changelog/v1.1.0.0.md:63` | "5 modules per packet 129/001 ADR-001" | **NO** | n/a | **BROKEN** (NEW, missed by DR-029) |
| 28 | `changelog/v1.1.0.0.md:116` | "Predecessor changelog: changelog/v1.0.0.0.md (arc 118 consolidation)" | YES | YES | PASS |
| 29 | `references/script_interface_contract.md:21` | "The 118 FULL_ISOLATE_NO_MCP arc removed the four..." | YES (prose, not a path) | YES | PASS |
| 30 | `graph-metadata.json:155` | "118 FULL_ISOLATE_NO_MCP arc" in causal_summary (prose) | YES (prose) | YES | PASS |
| 31 | `feature_catalog/feature_catalog.md` | No cross-arc citations | n/a | n/a | n/a |
| 32 | `manual_testing_playbook/manual_testing_playbook.md` | No cross-arc citations | n/a | n/a | n/a |

### C.2 — Resolution map for the broken "129/001 ADR-001" citation (per DR-029 + iter 7 patch package)

| Phrase in doc | Should resolve to |
|--------------|-------------------|
| "Packet 129/001 ADR-001" (council primitives) | `131/001/008-iterative-research-and-architecture/decision-record.md` ADR-001 "Runtime Boundary Decision" |
| "downstream packet 129 phases 003-006" (SKILL.md:144 only) | `131/001/{010-iterative-per-topic-multi-round, 011-iterative-session-findings-registry, 012-iterative-command-and-skill-wiring, 013-iterative-parity-cost-docs}` |

### C.3 — Prior iter findings that bear on this audit (do NOT re-report; SUPERSEDE only DR-029)

| Finding | Iter | Scope | Why iter 9 is novel |
|---------|------|-------|---------------------|
| DR-029 (P1, cross-arc-citation-drift) | 6 | 4 sites: SKILL.md:144, README.md:198, :247, :417 | Iter 9 finds **2 additional drifts** (changelog/v1.1.0.0.md:63 + SKILL.md L144 phrase B "downstream packet 129 phases 003-006"). Iter 9 produces DR-037 as a SUPERSEDE-DR-029 finding with complete site map. |
| Iter 7 §C DR-029 patch package | 7 | 4 replacement strings for the 4 DR-029 sites | Iter 9 expands the patch package to 6 replacement strings (4 from iter 7 + 2 new). |
| DR-001..DR-036 | 1-8 | Various surfaces | None target the changelog/v1.1.0.0.md:63 "129/001" citation or the SKILL.md:144 phrase-B "packet 129 phases 003-006". Iter 9 surface is structurally novel for these two phrases. |

### C.4 — Boundaries

- **SC-007 invariant**: NO edits to `lib/`, `scripts/`, `tests/`, `storage/` of `deep-loop-runtime/`.
- **iter-3 DR-023 boundary**: no edits to `system-spec-kit/mcp_server/deep-review/scripts/reduce-state.cjs`.
- **ADR-004 LOG_ONLY**: documentation-class findings only. No code defects expected from a citation sweep.
- **NO file edits this iteration** — emit findings markdown ONLY. The remediation packet applies actual fixes later.

---

## A — ACTION

Perform a **two-pass audit** with sequential_thinking MCP enforcement (≥5 thoughts before output).

### STEP 1 — Confirm the 2 NEW drifts via direct file reads

**1a. Confirm DRIFT at `changelog/v1.1.0.0.md:63`**:
- Read `.opencode/skills/deep-loop-runtime/changelog/v1.1.0.0.md` lines 55-70 directly.
- Verify L63 contains the exact phrase "5 modules per packet 129/001 ADR-001".
- Confirm: same "Packet 129/001" pattern as the 4 DR-029 sites; packet 129 still does not exist.

**1b. Confirm DRIFT at `SKILL.md:144` phrase B ("downstream packet 129 phases 003-006")**:
- Read `.opencode/skills/deep-loop-runtime/SKILL.md` lines 140-150 directly.
- Verify L144 contains BOTH:
  - "Packet 129/001 ADR-001 extends `deep-loop-runtime/lib/`..." (the DR-029 cite — phrase A)
  - "These primitives are consumed by downstream **packet 129 phases 003-006** for per-topic orchestration, multi-topic session state, command wiring, parity tests, and docs." (the NEW drift — phrase B)
- Confirm: phrase B's "129 phases 003-006" maps to actual phases `131/001/{010, 011, 012, 013}` (`010-iterative-per-topic-multi-round`, `011-iterative-session-findings-registry`, `012-iterative-command-and-skill-wiring`, `013-iterative-parity-cost-docs`) — i.e. 4 phases under `131/001`, not 4 phases under non-existent `129`.

### STEP 2 — Emit DR-037 finding (supersedes-DR-029)

If both drifts confirmed in STEP 1, emit **DR-037 (P1, cross-arc-citation-drift-completion)** with:

- **Drift summary**: DR-029 (iter 6) enumerated 4 of 5 sites citing the non-existent "Packet 129/001 ADR-001". The 5th site is `changelog/v1.1.0.0.md:63`. Additionally, `SKILL.md:144` carries a SECOND drift phrase ("downstream packet 129 phases 003-006") that DR-029 did not call out — this phrase maps to actual phases `131/001/010-013`.
- **Severity rationale**: P1 because changelog is operator-facing release-notes documentation (anyone reading the v1.1.0 changelog to understand the council coverage gets a dead-end citation) AND the SKILL.md phrase-B drift propagates the same wrong packet ID to a different anchor (phases 003-006 vs ADR-001). Both are user-facing reader-navigation breaks.
- **Total broken-citation count**: 6 phrases across 5 sites (SKILL.md:144 has 2 phrases on one line).
- **Supersedes**: DR-029 (iter 6).
- **Recommended replacement strings** (extends iter 7 §C package by 2 entries):

| # | File:Line | CURRENT (verbatim) | REPLACEMENT |
|---|-----------|--------------------|-------------|
| 1 | `SKILL.md:144` (phrase A) | "Packet 129/001 ADR-001 extends `deep-loop-runtime/lib/` with council-compatible infrastructure primitives..." | "Packet 131/001/008 ADR-001 (Runtime Boundary Decision) extends `deep-loop-runtime/lib/` with council-compatible infrastructure primitives..." |
| 2 | `SKILL.md:144` (phrase B — NEW) | "These primitives are consumed by downstream packet 129 phases 003-006 for per-topic orchestration, multi-topic session state, command wiring, parity tests, and docs." | "These primitives are consumed by downstream phases `131/001/010-013` (per-topic multi-round, session-findings registry, command and skill wiring, parity/cost/docs) for per-topic orchestration, multi-topic session state, command wiring, parity tests, and docs." |
| 3 | `README.md:198` | "Packet 129/001 ADR-001 extended this skill with council-compatible runtime primitives..." | "Packet 131/001/008 ADR-001 (Runtime Boundary Decision) extended this skill with council-compatible runtime primitives..." |
| 4 | `README.md:247` | "│   └── council/                          # 5 cjs modules (per packet 129/001 ADR-001)" | "│   └── council/                          # 5 cjs modules (per packet 131/001/008 ADR-001)" |
| 5 | `README.md:417` | "Packet 129/001 ADR-001 decided that durability primitives..." | "Packet 131/001/008 ADR-001 (Runtime Boundary Decision) decided that durability primitives..." |
| 6 | `changelog/v1.1.0.0.md:63` (NEW) | "- 3.5 Council primitives (5 modules per packet 129/001 ADR-001)" | "- 3.5 Council primitives (5 modules per packet 131/001/008 ADR-001)" |

### STEP 3 — Verify all OTHER cross-arc citations in C.1 (PASS-confirmation only)

Spot-check that the 24 PASS-rated citations in C.1 actually pass by direct file read on at least 4 representative samples:

- `README.md:459-461` cross-arc decision-record links (3 paths) — confirm each path exists AND each cited ADR-001 topic matches the cited prose.
- `SKILL.md:251-252` (117/118 ADR-001 prose claims).
- `changelog/v1.0.0.0.md:95-97` (3 cross-arc citations).
- `references/script_interface_contract.md:21` (arc 118 prose).

For each, classify PASS / FAIL with verbatim quote.

### STEP 4 — Negative-knowledge verification (DEFENSIVE)

Verify these are NOT findings:

- **117 council ruling citations**: README.md:461 + SKILL.md:265 + changelog/v1.0.0.0.md:95 all point at `131/003-deep-loop-runtime/001-core-isolation-deliberation/decision-record.md` (the post-rename current path). ADR-001 in that file = "SPLIT — Move Pure Runtime Libs to deep-loop-runtime/, Keep MCP Handlers + DB Owner in system-spec-kit" — matches the "117 SPLIT ruling" prose framing.
- **118 ADR-001 citations**: SKILL.md:252,261-264 + README.md:401,459,460 + changelog/v1.0.0.0.md:96-97 all point at `131/003-deep-loop-runtime/{004,005}-*/decision-record.md` (the renamed phase paths). 004 ADR-001 = "Per-Invocation DB Ownership..." (script interface contract); 005 ADR-001 = "Complete Removal of Four MCP Tools..." (MCP tool surface removal). Topic match is exact.
- **Arc 118 / FULL_ISOLATE_NO_MCP prose**: descriptive references in README L59, changelog/v1.0.0.0.md L9, references/script_interface_contract.md L21, graph-metadata.json L155 are PROSE not paths — they describe the historical arc and are accurate.
- **Spec folder paths (`131-deep-skill-evolution/...`)**: every absolute path under `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/...` cited in the docs resolves on disk (verified by orchestrator).

If any of these checks REVEAL a third drift NOT in the inventory, emit a fourth finding. Otherwise STOP at DR-037 (1 finding total that supersedes DR-029 with 6 sites).

### STEP 5 — Saturation judgment

If iter 9 yields ≤2 findings (this iter is expected to yield 1, since DR-037 supersedes DR-029) AND iter 10 is mandated as the synthesis pass per loop_protocol, document for the convergence-summary.md that:

- The audit surface has reached **finding-discovery saturation**. 8 of 9 audit iterations sweep distinct artifacts/surfaces; iter 9 closes the last specific named scope (cross-arc citations) by completing iter 6's DR-029.
- The structural `newInfoRatio < 0.05 for 2 consecutive iters` trigger is unreachable on this trajectory (zero re-reports across 9 iters = constant 1.00 ratio). This is a known operational pattern, not a defect.
- The operational `≤2 findings AND 0 P1+ for 2 consecutive iters` early-stop is structurally impossible to reach because the audit surface always returns at least 1 P1 per iter when documentation drift is dense (which is the case for a 470-LOC README + 266-LOC SKILL.md + multi-changelog skill). The dense doc surface guarantees a P1-class drift per iter.
- Recommendation: iter 10 should be **synthesis-only** (re-read all 9 iters, hunt transverse patterns, emit `research/research.md` + `research/convergence-summary.md` + `research/resource-map.md` per loop_protocol §17). No additional discovery dispatch is justified.

---

## F — FORMAT

Emit a markdown report with the following exact structure:

```markdown
## §A — DRIFT 1a confirmation (changelog/v1.1.0.0.md:63)

**v1.1.0.0.md L63 verbatim**: "<quote>"

**Drift verdict**: CONFIRMED (5th site of the "Packet 129/001 ADR-001" pattern; missed by DR-029)

## §B — DRIFT 1b confirmation (SKILL.md:144 phrase B)

**SKILL.md L144 verbatim (full line)**: "<quote>"

**Phrase A** (DR-029 cite): "Packet 129/001 ADR-001 extends `deep-loop-runtime/lib/`..."

**Phrase B** (NEW drift): "These primitives are consumed by downstream packet 129 phases 003-006..."

**Phase 003-006 resolution**: `131/001/{010, 011, 012, 013}` — verified on disk

**Drift verdict**: CONFIRMED (2 independent "129" drifts on one line; DR-029 caught only phrase A)

## §C — DR-037 finding emitted (P1, supersedes DR-029)

| # | File:Line | CURRENT | REPLACEMENT |
|---|-----------|---------|-------------|
| 1 | SKILL.md:144 (A) | <quote> | <replacement> |
| 2 | SKILL.md:144 (B) | <quote> | <replacement> |
| 3 | README.md:198 | <quote> | <replacement> |
| 4 | README.md:247 | <quote> | <replacement> |
| 5 | README.md:417 | <quote> | <replacement> |
| 6 | changelog/v1.1.0.0.md:63 | <quote> | <replacement> |

**Severity**: P1 (5 user-facing reader-navigation breaks)
**Class**: cross-arc-citation-drift-completion
**Supersedes**: DR-029 (iter 6)

## §D — PASS-confirmation spot-checks (STEP 3)

| Citation | Verbatim | Resolves? | Topic match? | Verdict |
|----------|----------|-----------|--------------|---------|
| README.md:459 | <quote> | YES/NO | YES/NO | PASS/FAIL |
| README.md:460 | <quote> | YES/NO | YES/NO | PASS/FAIL |
| README.md:461 | <quote> | YES/NO | YES/NO | PASS/FAIL |
| SKILL.md:251 | <quote> | YES/NO | YES/NO | PASS/FAIL |
| SKILL.md:252 | <quote> | YES/NO | YES/NO | PASS/FAIL |
| changelog/v1.0.0.0.md:95 | <quote> | YES/NO | YES/NO | PASS/FAIL |
| changelog/v1.0.0.0.md:96 | <quote> | YES/NO | YES/NO | PASS/FAIL |
| changelog/v1.0.0.0.md:97 | <quote> | YES/NO | YES/NO | PASS/FAIL |
| references/script_interface_contract.md:21 | <quote> | YES/NO | YES/NO | PASS/FAIL |

## §E — Negative knowledge / non-finding verification (STEP 4)

| Check | Verdict |
|-------|---------|
| 117 council ruling citations (3 sites) | PASS (all resolve, topic exact) |
| 118 ADR-001 citations (6 sites) | PASS (all resolve, topic exact) |
| Arc 118 prose | PASS (descriptive, accurate) |
| 131-deep-skill-evolution spec folder paths | PASS (all resolve) |
| Third hidden drift? | YES/NO with detail |

## §F — Saturation judgment (STEP 5)

- Finding-discovery saturation reached: YES / NO
- Iter 10 should be synthesis-only: YES / NO
- Soft-convergence structurally unreachable (1.00 × 9): CONFIRMED
- Operational early-stop unreachable (dense doc surface): CONFIRMED

## §G — Totals

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 1 (DR-037 supersedes DR-029) |
| P2 | 0 |
| **Total** | **1** |

**newInfoRatio**: 1.00 (1/1 novel; DR-037 captures 2 drift phrases that DR-029 missed)

## §H — Verdict

**Iter 9 verdict**: CROSS-ARC CITATION COMPLETION. DR-029's 4-site enumeration is incomplete; iter 9 closes the gap with 2 additional drifts (changelog/v1.1.0.0.md:63 + SKILL.md:144 phrase B). The 6 broken-citation replacement strings are packaged in §C and ready for the council-omission remediation packet. All other 24 cross-arc citations PASS.
```

---

## Constraints

1. **NEVER edit any file inside `.opencode/skills/deep-loop-runtime/lib/`, `scripts/`, `tests/`, `storage/`** (SC-007 invariant).
2. **NEVER edit `.opencode/skills/system-spec-kit/mcp_server/deep-review/scripts/reduce-state.cjs`** (iter-3 DR-023 boundary).
3. **NEVER edit ANY file in this iteration** — emit findings markdown to stdout only. The remediation packet applies actual fixes later.
4. **Use sequential_thinking MCP** with ≥5 thoughts before producing structured output.
5. **DO NOT re-report DR-001..DR-036 or AF-0001..AF-0080**. DR-037 SUPERSEDES DR-029 — that is a sanctioned exception (the two new drift phrases are novel; the 4 original sites are repackaged for completeness).
6. **Bundle gate**: keep grep/exec verification commands at standard density; do not embed multiple `verify | rg | wc` chains that push SWE-1.6 toward defensive output.
7. **Honest non-findings**: if STEP 1's direct read does NOT find the changelog/v1.1.0.0.md:63 drift or the SKILL.md:144 phrase B drift, emit NO finding for that surface and explain why. Do NOT rubber-stamp the orchestrator's pre-flags — verify independently via `sed -n` or equivalent direct read.

Begin with sequential_thinking, then proceed step-by-step.
