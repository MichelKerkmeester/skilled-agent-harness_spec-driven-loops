---
title: "XCE Research-Based Refinement — Final Synthesis"
packet: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement"
iterations: 10 (001–009 per-RQ, 010 synthesis)
converged: true
stopReason: "max_iterations_with_synthesis"
totalFindings: 47 (F-001 through F-047)
verdicts: {ADOPT:4, ADAPT:9, DEFER:2, SKIP:6}
created: "2026-05-08T18:00:00Z"
---

# XCE Research-Based Refinement — Research Synthesis

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-01/research.md.
## RQ6 — Steering Pattern Transfer

**Question**: How do we adapt XCE's static "ALWAYS call X FIRST" pattern to our dynamic skill_advisor brief?

**Findings consolidated from iteration-006.md (F-033 through F-038):**

XCE's 6 steering files converge on a 3-element pattern (F-033): unconditional "Always use xanther-xce" (CLAUDE.md:5, kiro.md:4, opencode-prompt.txt:1, etc.), ordering "FIRST" / "first on any task" (CLAUDE.md:6, kiro.md:6), and "Prefer X over file reading/grep" (CLAUDE.md:12, kiro.md:12). All steering is static — fires unconditionally on every prompt, with hard-coded target tool `xce_get_context`.

Our current render.ts brief (skill_advisor/lib/render.ts:155-158) uses "use ${label}" — a suggestion. Gap analysis (F-034): "use" is weaker than "Always use" / "MUST invoke", no ordering guidance, no behavioral framing. However, we CANNOT adopt unconditional steering — our advisor fires DYNAMICALLY (confidence ≥ 0.8 threshold at render.ts:124-133) and selects from 16 skills. The proposed change (F-036): add `FIRST_ACTION_HINT` map + modify 2 `capText` calls at lines 149-152 and 155-158 to "MUST invoke ${label} FIRST (${score}/${uncertainty}) — ${action_hint}". Estimated ~30 LOC in `skill_advisor/lib/render.ts`.

Intent→first-action table (F-035) maps all 16 skills to their primary first-action directive. `system-spec-kit` maps to "validate gates BEFORE reading/editing files"; `mcp-coco-index` to "semantic search BEFORE grep/file-reading" — most closely mirroring XCE's "use X before reading files" pattern.

**Local file:line cites**: `skill_advisor/lib/render.ts:155-158` (current "use" brief), `skill_advisor/lib/render.ts:124-133` (confidence ≥ 0.8 threshold gate)
**External file:line cites**: `external/steering/CLAUDE.md:5-6` ("Always use xanther-xce MCP tools before reading files" + "Call xce_get_context first"), `external/README.md:188` ("~20% token reduction when the agent uses XCE proactively")

**Verdict**: ADAPT — strengthen directive from "use" to "MUST invoke X FIRST" with per-skill action hint. Cannot ADOPT unconditional static pattern due to dynamic advisor architecture. ~30 LOC.

---

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-01/research.md.
## RQ9 — Non-Adoption Boundary

**Question**: What XCE patterns must we explicitly NOT adopt?

**Findings consolidated from iteration-009.md (SKIP-1 through SKIP-9):**

Nine explicit SKIP items documented with rationale and file:line citations (full details in `findings.md`):

| # | Item | Core rationale | Cite |
|---|------|---------------|------|
| SKIP-1 | Closed-source PRAT internals | PRAT is name-only (external/README.md:29); zero source. Spec.md:58 forbids non-public reverse-engineering. | external/README.md:29, spec.md:58 |
| SKIP-2 | SaaS hosting (mcp.xanther.ai) | Our system runs local Stdio MCP with in-process SQLite. SaaS hosting requires network dependency. | external/README.md:74,88-93, spec.md:125 |
| SKIP-3 | Centralized xanther.ai dependency | Requires signup (README:53), API key (README:53), xanther-cli (README:60), MCP endpoint (README:74). Our system has zero external deps. | external/README.md:51-62,74-81,229-244 |
| SKIP-4 | SaaS pricing model | Tiered pricing (README:264-270): Free 100 queries → $20/mo unlimited. Our system is open-source, unlimited. | external/README.md:264-270, spec.md:48 |
| SKIP-5 | Static unconditional "ALWAYS" steering | 6 files hard-code unconditional "Always use" (steering/CLAUDE.md:5, etc.). Our advisor is dynamic (confidence ≥ 0.8 gate). | external/steering/CLAUDE.md:5, render.ts:124-133 |
| SKIP-6 | Hard-coded single-tool first call | ALL steering hard-codes `xce_get_context` (README:113,130,144,158,171,180). Our advisor selects from 16 skills dynamically. | external/README.md:113,130,144,158,171,180 |
| SKIP-7 | mini-swe-agent (closed-source) | Named only (README:37). Zero docs, zero source. Agent scaffold is not adoptable. | external/README.md:37, spec.md:125-126 |
| SKIP-8 | SWE-bench Docker infrastructure | Requires ~50GB Docker + Python eval pipeline. Spec.md:127 excludes SWE-bench eval. | external/README.md:37-45, spec.md:127 |
| SKIP-9 | Cascade hybrid multi-pass strategy | Benchmark row only (README:43). Zero implementation docs. Speculation would violate REQ-006. | external/README.md:43, spec.md REQ-006 |

**Verdict diversity**: 9 SKIP + 2 DEFER + 6 ADAPT + 4 ADOPT = 21 items across all 4 buckets. Anti-bias guard satisfied.

---

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-01/research.md.
## Steering Pattern Transfer (REQ-008)

XCE's static steering (6 project-level rules files) uses three-element mandate: (1) unconditional "Always use XCE", (2) ordering "FIRST step", (3) replacement directive "Prefer XCE over file reading/grep". Our advisor is dynamic — fires only when confidence ≥ 0.8 (render.ts:124-133) and selects from 16 skills.

Proposed transfer (F-036, iteration-006.md:115-182):
1. Add `FIRST_ACTION_HINT` map to `skill_advisor/lib/render.ts:46-75` (~17 LOC)
2. Modify normal brief at lines 155-158: `"use ${label}"` → `"MUST invoke ${label} FIRST (${score}/${uncertainty}) — ${action_hint}"`
3. Modify ambiguous brief at lines 149-152: add `" — MUST invoke one FIRST"`

**Example**: `"Advisor: live; use system-spec-kit 0.92/0.10 pass."` → `"Advisor: live; MUST invoke system-spec-kit FIRST (0.92/0.10) — validate gates BEFORE reading/editing files."`

Estimated ~30 LOC. Token budget impact: brief grows from ~60-80 chars to ~90-180 chars, well within the 80-token default cap (DEFAULT_TOKEN_CAP at render.ts:43). Measurement protocol: baseline-vs-after on N ≥ 10 sessions per condition, query `total_tokens` from `session-analytics-db.ts:104` post-session-stop, compute paired delta with Welch's t-test.

---

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-01/research.md.
