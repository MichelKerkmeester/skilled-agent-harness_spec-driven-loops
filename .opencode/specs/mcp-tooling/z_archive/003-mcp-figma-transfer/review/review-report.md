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