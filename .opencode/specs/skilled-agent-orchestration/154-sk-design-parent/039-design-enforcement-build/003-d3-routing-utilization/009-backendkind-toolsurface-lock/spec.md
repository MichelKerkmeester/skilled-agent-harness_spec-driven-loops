---
title: "D3-R9 — backendKind→toolSurface lock"
description: "Add a per-mode toolSurface (allowed/forbidden/mutatesWorkspace/bashAllowlist) to sk-design and gate backend-kind/tool-policy mismatch using captured raw.toolCalls."
trigger_phrases:
  - "d3-r9 toolsurface lock"
  - "backendkind tool surface design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D3-R9 — backendKind→toolSurface lock

## 1. OBJECTIVE
Add a per-mode `toolSurface` declaration (`allowed`, `forbidden`, `mutatesWorkspace`, `bashAllowlist`) to sk-design and gate any backend-kind / tool-policy / bash-allowlist mismatch using the captured `raw.toolCalls` stream.

## 2. WHY
A mode's backend kind does not currently constrain which tools it may call, so a read-only mode could mutate the workspace undetected. Binding `toolSurface` to `backendKind` makes that a blocking violation.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/sk-design/SKILL.md` (+ scorer consuming `raw.toolCalls`)
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D3 — Routing & Utilization

## 4. BUILD OUTLINE
- Declare `toolSurface` per workflow mode (allowed/forbidden/mutatesWorkspace/bashAllowlist).
- Gate backend-kind, tool-policy, and bash-allowlist mismatches against captured `raw.toolCalls`.
- Fail closed when a forbidden tool or off-allowlist bash command appears.

## 5. ACCEPTANCE
- The scorer fails a run whose `raw.toolCalls` includes a forbidden tool or a bash command outside the mode's `bashAllowlist`; a compliant run passes.

## 6. EVIDENCE
- `sk-design/SKILL.md:62` — mode definition region where `toolSurface` attaches.
- Source: `research/research.md` §6 (D3-R9).

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
