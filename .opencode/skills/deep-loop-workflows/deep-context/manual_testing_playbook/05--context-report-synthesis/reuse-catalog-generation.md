---
title: "SYN-001 -- Reuse Catalog Generation"
description: "This scenario validates Reuse Catalog Generation for `SYN-001`. It focuses on the REUSE catalog as the first and highest-value section of the Context Report, with code-graph-verified file:symbol citations and pointers-not-bodies discipline."
---

# SYN-001 -- Reuse Catalog Generation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SYN-001`.

---

## 1. OVERVIEW

This scenario validates Reuse Catalog Generation for `SYN-001`. It focuses on `step_compile_report` reading from `findings-registry.json`, running `step_verify_citations` to verify every reuse candidate's `file:symbol` against the code graph before inclusion (labeling stale refs `unverified`), and assembling the REUSE catalog as the first section with fields: `id`, `symbol (file:line)`, `signature`, `reuse verb (extend|compose|wrap|import)`, `confidence`, `agreement (k/N)`, `freshness`, and `notes`. Pointers and signatures are shipped; source bodies are never included.

### Why This Matters

The REUSE catalog is the core deliverable of the deep-context loop — it is what saves planning time by showing exactly which existing functions can be extended rather than rewritten. A stale or unverified `file:symbol` in the catalog is worse than omission because it directs the implementor to a non-existent or renamed function. The "pointers not bodies" discipline keeps the report lightweight and avoids context rot as the codebase evolves.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SYN-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify that the REUSE catalog leads the Context Report, uses code-graph verification, labels stale refs, and ships pointers not bodies.
- Real user request: `Verify that the deep-context REUSE catalog is the first section of the Context Report and every entry is code-graph-verified.`
- Prompt: `As a manual-testing orchestrator, validate the reuse catalog generation contract for deep-context against the auto YAML step_compile_report, context_report_template.md, and SKILL.md §3 output description. Verify the REUSE catalog leads the Context Report, each entry includes id, symbol, signature, reuse verb, confidence, agreement, freshness, and notes; stale refs are labeled unverified; pointers not source bodies are shipped. Return a concise verdict.`
- Expected execution process: Read `assets/context_report_template.md` for section ordering and REUSE catalog fields; read SKILL.md §3 for "pointers not bodies" rule; read SKILL.md §4 ALWAYS rule 4 for code-graph verification mandate; check auto YAML for `step_verify_citations` or equivalent.
- Expected signals: `context_report_template.md` exists with REUSE catalog as first content section; SKILL.md §4 ALWAYS rule 4 mandates code-graph verification of `file:symbol`; `unverified` freshness label is documented in agent definition or SKILL.md; "pointers not bodies" rule is in SKILL.md.
- Desired user-visible outcome: The REUSE catalog is the first section of every Context Report and each entry cites a code-graph-verified `file:symbol` that the implementor can use directly without re-verifying.
- Pass/fail: PASS if `context_report_template.md` exists with REUSE catalog first and SKILL.md documents both the verification mandate and pointers-not-bodies rule; FAIL if the template is missing or REUSE is not the first section.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; read template and grep SKILL.md.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SYN-001 | Reuse Catalog Generation | Verify REUSE catalog leads report with code-graph-verified pointers | `Verify that the deep-context REUSE catalog is the first section of the Context Report and every entry is code-graph-verified.` | 1. `ls .opencode/skills/deep-loop-workflows/deep-context/assets/context_report_template.md` -> 2. `rg "REUSE\|reuse.*catalog\|REUSE Catalog" .opencode/skills/deep-loop-workflows/deep-context/assets/context_report_template.md` -> 3. `rg "pointers.*bodies\|not.*bodies\|pointers.*source" .opencode/skills/deep-loop-workflows/deep-context/SKILL.md` -> 4. `rg "unverified\|freshness.*unverified\|verify.*citation\|step_verify_citations" .opencode/skills/deep-loop-workflows/deep-context/SKILL.md .opencode/commands/deep/assets/deep_context_auto.yaml` | Step 1: file exists; Step 2: REUSE catalog found as section; Step 3: pointers-not-bodies rule found; Step 4: verification mandate and unverified label found | File list and grep outputs | PASS if steps 1-4 all return matches; FAIL if template is missing or REUSE is not the first content section | 1. Open `context_report_template.md` to confirm section ordering manually. 2. Check SKILL.md §4 ALWAYS rules for the verification rule number. 3. Confirm `step_verify_citations` naming in the auto YAML's synthesis phase. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/05--context-report-synthesis/reuse-catalog-generation.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/assets/context_report_template.md` | Context Report schema: REUSE catalog first, field list, pointers not bodies |
| `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md` | §3: output description; §4 ALWAYS rules 4 and 6 (verification + pointers) |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | `step_compile_report` and `step_verify_citations` in the synthesis phase |
| `.opencode/agents/deep-context.md` | §4 OUTPUT SCHEMA: per-finding `freshness: verified | unverified` field |

---

## 5. SOURCE METADATA

- Group: Context Report Synthesis
- Playbook ID: SYN-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--context-report-synthesis/reuse-catalog-generation.md`
