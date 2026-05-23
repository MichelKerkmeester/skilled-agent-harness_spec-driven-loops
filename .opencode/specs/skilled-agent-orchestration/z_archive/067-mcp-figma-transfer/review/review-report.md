# Deep Review Report — 067-mcp-figma-transfer

**Iterations:** 7 (cli-codex executor for iters 1-6 D-dimension reviews; Claude orchestrated synthesis at iter 7 + this report)
**Stop reason:** max_iterations reached + convergence trend (no new P0 in iter 7)
**Final Verdict:** **FAIL — CONDITIONAL on remediation**
**Remediation phase:** `004-deep-review-remediation/` (recommended scope below)

---

## 1. Executive Summary

The 067-mcp-figma-transfer packet's actual implementation work shipped successfully across 3 git repos (7 commits total). The advisor SQLite state is clean, the Figma agent folders are functional in both Barter and Public, the user's manual scope revert (`766206b`) is well-formed, and the parity test gap from mcp-figma deletion was closed by user session-sync `bdb739d97`.

**However, the packet documentation has substantial DRIFT against actual repo state**, and the skill folder DELETION broke several non-test cross-references that prior opus hooks (E + F) didn't catch. The deep review's adversarial iteration (iter 006) surfaced these gaps with concrete evidence.

**Severity profile:** 3 P0, 10 P1, 5 P2 — high count of P1s indicating broad-but-shallow drift rather than deep correctness defects. Most issues are stale-doc / dead-link / count-drift — not behavioral regressions.

**Recommendation:** Author phase `004-deep-review-remediation/` with the prioritized remediation list below; implement with cli-codex.

---

## 2. Verdict by Dimension

| Dimension | Verdict | Severity Distribution | Iter |
|---|---|---|---|
| D1 Correctness | PASS | 0 P0 / 0 P1 / 0 P2 | 001 |
| D2 Security | CONDITIONAL | 0 P0 / 2 P1 / 0 P2 | 002 |
| D3 Traceability | **FAIL** | 2 P0 / 3 P1 / 1 P2 | 003 |
| D4 Maintainability | CONDITIONAL | 0 P0 / 2 P1 / 1 P2 | 004 |
| Cross-cutting | **FAIL** | 0 P0 / 2 P1 / 1 P2 | 005 |
| Adversarial | **FAIL** | 1 P0 / 3 P1 / 2 P2 | 006 |
| Convergence | n/a | n/a | 007 |

---

## 3. P0 Blockers (3)

| ID | Finding | Source | Affected Files | Remediation |
|---|---|---|---|---|
| **P0-1** | All 3 phase children FAIL `validate.sh --strict` with 4 errors each (TEMPLATE_SOURCE missing, TEMPLATE_HEADERS, ANCHORS_VALID, FRONTMATTER_MEMORY_BLOCK 9-10 issues). Parent passes; children don't. Parent spec.md:108 requires each phase to pass --strict before next phase. | iter 003 + 006 | `.../001/{spec,plan,tasks,checklist,decision-record,implementation-summary}.md` × 3 children | Add required template-source headers + anchor markers + frontmatter memory block keys to bring child docs into compliance |
| **P0-2** | All P0 checklist items in 3 phase children are unchecked `[ ]` with no evidence — directly contradicts implementation-summaries claiming "all P0 green" | iter 003 | `.../00X/checklist.md` × 3 children, lines 45+ | Mark each P0 item `[x]` with concrete EVIDENCE citation (file:line, command output, opus hook reference) |
| **P0-3** | `review/deep-review-state.jsonl` contains ONLY the init event — no per-iteration records. Violates sk-deep-review contract that every iteration appends JSONL state with `findingsNew`, `dimensionsCovered`, `convergenceData`. | iter 006 | `review/deep-review-state.jsonl` | Backfill 7 iteration JSONL records from iter outputs; update strategy.md `Completed Dimensions` table |

---

## 4. P1 Required (10)

| ID | Finding | Source | Affected Files | Remediation |
|---|---|---|---|---|
| **P1-1** | Code Mode install-guide JSON snippet uses unprefixed `${FIGMA_API_KEY}` — would produce broken Code Mode config. Same INSTALL_GUIDE later documents the prefix rule correctly at line 471-485, so the early snippet contradicts the rule. | iter 002 | `Barter+Public Figma INSTALL_GUIDE.md:341-365` | Edit env var to `${figma_FIGMA_API_KEY}` |
| **P1-2** | Phase implementation-summaries omit later commits (66e1e87, 766206b, b03bf7563, bdb739d97). Future readers auditing the summaries miss those state-changing commits. | iter 003 | All 3 implementation-summary.md "Cumulative commit ledger" tables | Add missing commit rows |
| **P1-3** | D9 supersession not propagated into Phase 2 formal docs — Phase 2 spec.md, decision-record (ADR-009), and implementation-summary still describe open-source framing while user `766206b` reverted to internal scope. | iter 003 + 005 | `002-public-figma-agent/{spec.md, decision-record.md, implementation-summary.md}` | Add tombstone/supersession marker to ADR-009; update Phase 2 scope sections to reflect internal-only |
| **P1-4** | Phase 2 cross-phase ADR index lists ADR-013 as highest Phase 3 ADR; actual is ADR-014 (D8) | iter 003 | `002-public-figma-agent/decision-record.md` Decision Index table | Update table to include ADR-014 |
| **P1-5** | Phase 3 implementation-summary "Cumulative commit ledger" missing Commit 5b row (`7307e056d`); current ledger lists only commits 1-5 + "TBD" | iter 005 | `003-mcp-figma-skill-removal/implementation-summary.md §7` | Insert Commit 5b row with SHA `7307e056d` |
| **P1-6** | Skill index `.opencode/skills/README.md` has CONTRADICTORY counts: line 44 says 21 skill folders; line 54 says 16. Actual `ls -d .opencode/skills/*/` returns 17. | iter 004 | `.opencode/skills/README.md:44, 54` | Reconcile both counts to 17 (current actual) |
| **P1-7** | install_guides counts inconsistent across multiple lines: README.md:1453 says 18 skills, :1464 says 15; SET-UP - AGENTS.md:523 says 9, :525-532 lists 6, :975 + :1000 say 9. | iter 004 | `install_guides/README.md, install_guides/SET-UP - AGENTS.md` | Reconcile all skill counts to current actual (17 for full skills count; install-only subset count needs re-derivation) |
| **P1-8** | ADR-005 BODY is still pre-revision while metadata says "Accepted (revised)". Body says "Full bundling — include node_modules in commit"; correct revised state is documented only in implementation-summary §4 + ADR metadata note. | iter 005 | `001-barter-figma-agent/decision-record.md` ADR-005 body lines 179-182, 188-191 | Rewrite ADR-005 Decision/Consequences to match the actual gitignored-pattern + revision note |
| **P1-9** | Hook F current 1-failure state NOT reflected in Phase 3 closeout docs — implementation-summary.md still says "293/296, 3 known failures"; actual is 295/296 with only sk-code drift remaining. | iter 005 | `003-mcp-figma-skill-removal/implementation-summary.md` lines 3, 15, 103-111 + frontmatter; parent spec.md:104 | Update Hook F status to 1 failure post-bdb739d97; ledger the parity-fix commit |
| **P1-10** | mcp-figma deletion broke `.opencode/install_guides/MCP - Figma.md` symlink (target was `../skill/mcp-figma/INSTALL_GUIDE.md`, now broken). install_guides/README.md:83 still advertises this link. | iter 006 | `.opencode/install_guides/MCP - Figma.md`, `.opencode/install_guides/README.md:83` | Delete the broken symlink; remove the README entry; or repoint to AI_Systems Figma INSTALL_GUIDE.md if cross-repo link acceptable |
| **P1-11** | Both Barter + Public Figma READMEs (lines 674-677) link to deleted `mcp-figma/{INSTALL_GUIDE.md, README.md, SKILL.md, changelog/}` — DEAD LINKS in shipped agents. Combined Workflows KB doc (line 1068-1070) repeats. | iter 006 | `Barter+Public/Figma/README.md:674-677`; `Barter+Public/Figma/knowledge base/reference/Figma - Reference - Combined Workflows - v0.100.md:1068-1070` | Remove dead source-skill links OR repoint to historical commit/spec packet |
| **P1-12** | Public/Figma INSTALL_GUIDE.md:401-414 hardcodes Barter `cwd` path: `/Users/.../AI_Systems/Barter/MCP Agents/Figma/mcp servers/figma-mcp-stdio`. A user following Public's local-bundled path would launch from Barter, not Public. | iter 006 | `Public/Figma/INSTALL_GUIDE.md:401-414`; `Public/Figma/mcp servers/figma-mcp-stdio/config-snippets.md:112-127` | Replace Barter path with Public path in Public's install guide + config snippets |

---

## 5. P2 Suggestions (5)

| ID | Finding | Source | Affected Files | Remediation |
|---|---|---|---|---|
| **P2-1** | `figd_your_token` non-canonical placeholder in 2 KB MCP Knowledge docs (only `figd_your_token_here` is approved per D2 placeholder rule) | iter 002 + 006 | Both `Barter+Public Figma KB/Figma - Integrations - MCP Knowledge - v0.100.md:433` | s/figd_your_token/figd_your_token_here/ |
| **P2-2** | Parent `handover.md` absent — `_memory.continuity` blocks in implementation-summary serve as continuity but no canonical operator-friendly resume surface | iter 005 + 006 | (new file) `067-mcp-figma-transfer/handover.md` | Optional: author parent-level handover.md consolidating cross-repo state |
| **P2-3** | Telemetry retention preserves 4 mcp-figma rows in `compliance.jsonl` (gitignored). Per D2 spirit currently preserved as immutable history. | iter 005 | `.opencode/skills/.smart-router-telemetry/compliance.jsonl` | Optional purge for fresh telemetry baseline; otherwise leave as-is |
| **P2-4** | System Prompt KB doc references non-existent `references/tool_reference.md` at line 83 (the actual tool catalog is in MCP Knowledge KB doc) | iter 006 | `Barter+Public Figma knowledge base/system/Figma - System - Prompt - v0.100.md:83` | Replace with reference to `knowledge base/integrations/Figma - Integrations - MCP Knowledge - v0.100.md` |
| **P2-5** | `verify.sh` for figma-mcp-http exits 0 but prints "protocol layer untested" — overstates verification per documentation in INSTALL_GUIDE.md:606 | iter 006 | `Barter+Public Figma mcp servers/figma-mcp-http/verify.sh` + INSTALL_GUIDE.md:606 | Either update install-guide language to match script behavior, or extend script to actually verify MCP protocol response |

---

## 6. Re-classified Findings (from adversarial iter 006)

| Original classification | New classification | Reason |
|---|---|---|
| Iter 4 P2 (AGENTS.md heading drift) | **P1-13** (Barter↔Public AGENTS.md byte non-equivalence) | Phase 2 contract explicitly requires byte-equivalence for AGENTS.md; user `766206b` modified Public but not Barter. Should align both. |

Effective P1 count: **13 (with P1-13 added from re-classification)**.

---

## 7. Convergence Analysis

| Iteration | New P0 | New P1 | New P2 | Cumulative | Trend |
|---|---|---|---|---|---|
| 001 (D1) | 0 | 0 | 0 | 0/0/0 | clean |
| 002 (D2) | 0 | 2 | 0 | 0/2/0 | rising |
| 003 (D3) | 2 | 3 | 1 | 2/5/1 | rising |
| 004 (D4) | 0 | 2 | 1 | 2/7/2 | rising |
| 005 (Cross-cut) | 0 | 2 | 1 | 2/9/3 | rising |
| 006 (Adversarial) | 1 | 3 | 2 | 3/12/5 | rising |
| 007 (Synthesis) | 0 | 0 | 0 | 3/12+1=13/5 | converged |

Convergence achieved at iter 7 (no new P0/P1/P2 findings; iter 6 adversarial pass surfaced one more P0 + 3 more P1 + 2 more P2 reflecting deeper investigation).

**Note on convergence semantics:** strict newFindingsRatio threshold ≤0.10 was NOT met until iter 7 because the adversarial iter 6 deliberately found additional concerns (which is its job). The convergence is therefore "synthesis-converged" rather than "noise-floor-converged" — a normal outcome for a 7-iteration capped run.

---

## 8. Remediation Phase Recommendation

**Phase 4 — `004-deep-review-remediation/`** with the following scope:

### P0 Remediation Tasks (BLOCKING)

1. **R-001:** Add TEMPLATE_SOURCE + TEMPLATE_HEADERS + ANCHORS_VALID + FRONTMATTER_MEMORY_BLOCK keys to all child spec docs. Re-run `validate.sh --strict` and confirm exit 0 for all 3 children.
2. **R-002:** Mark all P0 checklist items `[x]` with EVIDENCE citation across 3 phase children's checklist.md.
3. **R-003:** Backfill `review/deep-review-state.jsonl` with 7 iteration records; update `review/deep-review-strategy.md` Completed Dimensions table.

### P1 Remediation Tasks (REQUIRED)

4. **R-004:** Fix install-guide env var prefix in 2 INSTALL_GUIDE.md files (line 341-365).
5. **R-005:** Update 3 implementation-summary commit ledgers with all relevant SHAs.
6. **R-006:** Add D9 supersession marker to Phase 2 ADR-009 + update Phase 2 spec.md scope + Phase 2 implementation-summary.
7. **R-007:** Update Phase 2 ADR Decision Index with ADR-014.
8. **R-008:** Insert Commit 5b row in Phase 3 implementation-summary §7.
9. **R-009:** Reconcile skill index counts (`.opencode/skills/README.md`).
10. **R-010:** Reconcile install_guides counts (multiple files).
11. **R-011:** Rewrite ADR-005 Decision/Consequences body to match revised state.
12. **R-012:** Update Hook F status in Phase 3 implementation-summary + parent map (1 failure, not 3).
13. **R-013:** Delete broken `MCP - Figma.md` symlink + remove install_guides/README.md:83 entry.
14. **R-014:** Remove dead source-skill links from Barter + Public Figma READMEs (lines 674-677) + Combined Workflows KB doc.
15. **R-015:** Fix Public Figma INSTALL_GUIDE.md `cwd` to point at Public path, not Barter.
16. **R-016:** Align Barter + Public AGENTS.md byte-equivalence (apply 766206b's heading change to Barter as well).

### P2 Remediation Tasks (OPTIONAL)

17. **R-017:** s/figd_your_token/figd_your_token_here/ in 2 KB MCP Knowledge docs.
18. **R-018:** (Optional) Author `handover.md` for the parent.
19. **R-019:** (Optional) Telemetry purge or keep per D2.
20. **R-020:** Replace orphan `references/tool_reference.md` reference in System Prompt KB.
21. **R-021:** Update `verify.sh` documentation/behavior alignment.

### Estimated Effort

| Tier | Count | Wall-clock |
|---|---|---|
| P0 (R-001 to R-003) | 3 tasks | ~30-45 min — bulk via cli-codex |
| P1 (R-004 to R-016) | 13 tasks | ~60-90 min — primarily cli-codex authoring + Claude verification |
| P2 (R-017 to R-021) | 5 tasks | ~15-20 min — surgical edits |
| **Total** | **21 tasks** | **~2-2.5 hours** |

Executor: cli-codex (gpt-5.5 high reasoning, fast tier) for spec doc authoring + checklist evidence; Claude orchestrates + opus subagent verifies.

---

## 9. Status Summary

| Aspect | State |
|---|---|
| **Spec packet validates --strict (parent)** | ✅ PASS |
| **Spec packet validates --strict (children)** | ❌ FAIL × 3 (P0-1) |
| **Implementation work shipped** | ✅ 7 commits across 3 repos |
| **Advisor SQLite state** | ✅ Clean (18 nodes / 64 edges / 0 mcp-figma residue) |
| **Parity tests** | ✅ PASS (post-bdb739d97) |
| **Documentation drift** | ❌ Substantial — Phase 2 ADR-009, Hook F status, ADR-005 body, install guide counts, dead links |
| **User-side scope revert (766206b) reflected in formal docs** | ❌ NOT (P1-3 + P1-13) |
| **Future resume readiness** | ⚠️ FUNCTIONAL but operator must read review docs to get true state |
| **P0 outstanding** | 3 |
| **Overall verdict** | **CONDITIONAL — gates on P0 remediation** |

---

## 10. Recommended Next Command

```
/speckit:plan :auto "067-mcp-figma-transfer Phase 4: deep-review remediation — fix child --strict validators, P0 checklist evidence, deep-review-state JSONL backfill, plus 13 P1s + 5 P2s as scoped above"
```

OR direct via:

```
mkdir -p 067-mcp-figma-transfer/004-deep-review-remediation/
# Then author spec.md / plan.md / tasks.md / checklist.md scaffolded for the 21-task remediation set
```

---

**Generated:** 2026-05-05T11:40:00Z
**Iterations consumed:** 7 of 7 (max)
**Executor mix:** cli-codex (1-6 D-dimension reviews; iter 6 adversarial caught the most issues) + Claude (synthesis, this report, iter 7 convergence call)
**Output dir:** `.opencode/specs/skilled-agent-orchestration/067-mcp-figma-transfer/review/`
