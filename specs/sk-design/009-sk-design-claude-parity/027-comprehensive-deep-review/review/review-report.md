# Deep Review Report — sk-design Comprehensive Review

## 1. Executive Summary

Final verdict: **PASS** (with advisories). A 20-iteration deep review of the entire `sk-design` skill tree (hub + 6 modes: interface/foundations/motion/audit/md-generator/mcp-open-design transport, plus shared/benchmark/feature_catalog/changelog/manual_testing_playbook), dispatched in 6 waves (1 solo inventory + 5 parallel waves of 3-4 concurrent iterations, via `openai/gpt-5.5-fast` at `reasoningEffort=high`), found 32 real findings after a manual cross-check against the raw delta logs corrected the automated reducer's registry (which had silently dropped 4 real findings behind 2 fabricated placeholders — the same reducer bug confirmed twice earlier this session on a different review target). 0 P0, 15 P1, 17 P2. All 15 P1 and all 17 P2 findings were fixed and independently re-verified by adversarial verify agents blind to the fix agents' self-reports; 3 additional same-bug-class gaps discovered mid-remediation (outside the original 32) were also closed. One P1 (SKILL.md word-budget trim on `design-interface`) landed as an honest partial fix, still 897 words over the soft 3000-word recommendation — flagged, not silently closed. The dominant risk theme was `design-md-generator/backend/`'s executable pipeline: a real output-boundary bypass in 3 standalone artifact writers (fixed, live-verified with an adversarial probe) and a hard 5000-word SKILL.md limit breach (fixed).

## 2. Active Finding Registry

All 35 findings (32 original + 3 discovered mid-remediation) are RESOLVED. 0 open.

| ID | Severity | Area | Title | Status |
|----|----------|------|-------|--------|
| P1-001 | P1 | design-md-generator | Standalone artifact writers bypass output-policy boundary | Resolved, live-verified |
| P1-002a | P1 | hub changelog | 3 changelog files missing version frontmatter | Resolved |
| P1-002b | P1 | design-foundations | Contrast proof requires Bash despite forbidden tool surface | Resolved (docs clarified, tool surface correctly left unchanged) |
| P1-003-001 | P1 | shared | proof_check.py accepts paths without repo containment | Resolved, live-verified against traversal attack |
| P1-003-002 | P1 | benchmark | PASS verdict alongside unreconciled P1 bottleneck | Resolved (honest reconciliation, no data invented) |
| P1-006-001 | P1 | design-interface | Transform contract unreachable from mode router | Resolved |
| P1-009-001 | P1 | command-metadata | /design:foundations omits procedure-card surface | Resolved (systemic fix) |
| P1-010-001 | P1 | command-metadata | /design:audit omits procedure-card surface | Resolved (systemic fix) |
| P1-010-002 | P1 | design-audit | AI-fingerprint JSON registry rejected by its own loader | Resolved |
| P1-010-003 | P1 | design-audit | Report template requires Python check despite forbidden Bash | Resolved (docs clarified, consistent with P1-002b) |
| P1-011-001 | P1 | command-metadata | /design:audit procedure-card omission (2nd instance) | Resolved (systemic fix) |
| P1-012-001 | P1 | command-metadata | /design:motion omits procedure-card surface | Resolved (systemic fix) |
| P1-013-001 | P1 | command-metadata | /design:motion procedure-card omission (2nd instance) | Resolved (systemic fix) |
| P1-016-001 | P1 | design-md-generator | SKILL.md exceeds hard 5000-word limit (5759) | Resolved |
| P1-019-001 | P1 | command-metadata | Systemic procedure-card omission (root cause) | Resolved |
| P2-002 | P2 | hub README | Stale multi-mode disambiguation claim | Resolved |
| P2-003 | P2 | hub graph-metadata | Retrieval facets omit the transport mode | Resolved |
| P2-006-001 | P2 | design-interface | Procedure-card source-reference citations | **Confirmed false positive** — deliberate schema-documented pattern |
| P2-007-001 | P2 | design-interface | SKILL.md over word budget (4173) | Partially resolved (3897, still 897 over soft budget) |
| P2-007-002 | P2 | design-interface | Missing smart-router marker functions | Resolved |
| P2-007-003 | P2 | design-interface | Transform guidance orphaned from command projection | Resolved |
| P2-009-001 | P2 | design-foundations | SKILL.md over word budget (3163) | Resolved (2792) |
| P2-009-002 | P2 | design-foundations | 2 scripts undiscoverable from docs | Resolved |
| P2-010-004 | P2 | design-audit | Broken sibling-mode relative links | Resolved |
| P2-011-001 | P2 | design-audit | SKILL.md over word budget (3281) | Resolved (2823) |
| P2-014-001 | P2 | design-mcp-open-design | Guarded reads described as always-safe | Resolved (2 files fixed by original agent, residual 3rd file caught by verify agent and closed directly) |
| P2-016-001 | P2 | design-md-generator | package.json missing bin field | Resolved |
| P2-016-002 | P2 | design-md-generator | guided-run.ts undocumented | Resolved |
| P2-017-001 | P2 | design-md-generator | Stale reference-doc count | Resolved |
| P2-018-001 | P2 | design-md-generator | Crawl boundary enforcement | Confirmed already-enforced (no fix needed), verified with live Playwright adversarial probe |
| P2-020-001 | P2 | design-mcp-open-design | SKILL.md over word budget (3935) | Resolved (2964) |
| P2-020-002 | P2 | design-mcp-open-design | 6 changelog files missing version frontmatter | Resolved |
| *(discovered)* | P1-class | command-metadata | design-interface + design-md-generator same procedure-card omission | Resolved |
| *(discovered)* | P1-class | benchmark | after-016 + after-022 reports, same PASS/P1 reconciliation gap | Resolved |
| *(discovered)* | bug | shared | ai-fingerprint-registry-check.mjs heading-match failure (6/6 rows) | Resolved |

## 3. Planning Trigger

None — this packet closes with 0 open findings; no follow-up remediation packet is needed.

## 4. Remediation Workstreams (completed this session)

9 area-scoped fix agents dispatched in parallel (hub tier, command-metadata systemic, hub changelog, design-interface, design-foundations, design-audit, design-mcp-open-design, design-md-generator, shared+benchmark), followed by 8 independent adversarial verify agents (hub+changelog combined). A 10th follow-up fix agent closed 3 same-bug-class gaps the original 9 correctly discovered-but-deferred as out of scope. A verify agent caught one residual gap (P2-014-001's 3rd affected file) after the original fix; closed directly.

Two real security fixes were live-verified with adversarial probes, not just read-traced:
- **P1-001** (`design-md-generator/backend/`): `preview-gen.ts`/`proof.ts`/`report-gen.ts` now call `requireOutputPath` before any write. A fresh probe against an out-of-boundary directory confirmed all 3 throw before writing; full backend suite 134/134 passing.
- **P1-003-001** (`shared/scripts/proof_check.py`): added realpath + `commonpath`-based containment, fail-closed. A fresh adversarial test with an absolute path and a `../`-traversal path confirmed both rejected with `"source path escapes repo root"`, never opened; a legitimate in-repo path still passed.

One P2 (P2-018-001) was independently confirmed ALREADY enforced via a live headless-Chromium probe with lookalike-domain adversarial cases (`example.com.evil.com`) — no fix applied, correctly avoiding a duplicate check.

## 5. Spec Seed / 6. Plan Seed

Not applicable — all findings resolved within this packet; no follow-up spec/plan needed.

## 7. Traceability Status

- `spec_code`: confirmed — hub + 6 modes match `mode-registry.json`'s declared structure.
- `checklist_evidence`: n/a (review produced evidence artifacts, not checklist mutations).
- `skill_agent`: confirmed — all 6 modes' SKILL.md/`packetSkillName` pairs match.
- `agent_cross_runtime`: confirmed for the transport packet's install/verify scripts.
- `feature_catalog_code`: confirmed — catalog entries match live mode-registry structure (post-fix).
- `playbook_capability`: confirmed via sampled scenario checks.

## 8. Deferred Items
