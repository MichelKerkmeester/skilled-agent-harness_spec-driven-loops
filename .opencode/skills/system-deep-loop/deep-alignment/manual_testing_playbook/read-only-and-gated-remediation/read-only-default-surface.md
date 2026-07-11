---
title: "DAL-024 -- Read-only default: audited artifacts are never modified"
description: "Verify the default loop observes and reports only: SKILL.md's allowed-tools carries no Write/Edit, CONVERGE writes nothing, adapters read but never mutate audited artifacts, and the one wrapped tool that would mutate the tree (minify-webflow.mjs) is explicitly excluded from check()."
version: 1.0.0.0
---

# DAL-024 -- Read-only default: audited artifacts are never modified

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-024`.

---

## 1. OVERVIEW

This scenario validates alignment invariant 3 (read-only default) for `DAL-024`. The objective is to verify that the default loop only observes and reports: `SKILL.md`'s `allowed-tools` carries no Write/Edit in the default surface (Task/Bash are reserved for gated remediation), `check-convergence.cjs` writes nothing (decision only), the adapters read but never mutate audited artifacts, and the one wrapped sk-code tool that would write to the tree (`minify-webflow.mjs`) is explicitly listed in `excludedFromCheck` with a read-only-by-default reason, while the static sk-design adapter never renders.

### WHY THIS MATTERS

Read-only-by-default is the invariant that makes it safe to run an unattended conformance sweep against real packets: the audit cannot damage what it inspects. Any write path in the default loop — a mutating wrapped tool, a Write-tool allowance, a rendering side effect — would break that guarantee. This is a critical-path scenario.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify no Write/Edit in the default surface, CONVERGE is decision-only, and the tree-mutating minify-webflow.mjs is excluded from the sk-code check().
- Real user request: Can I run this audit on my real packets without it changing anything?
- Prompt: `Validate the deep-alignment read-only default: no Write/Edit in the default surface, CONVERGE is decision-only, and the tree-mutating minify-webflow.mjs is excluded from the sk-code check().`
- Expected execution process: Read `SKILL.md`'s `allowed-tools` + read-only note, confirm `check-convergence.cjs` performs no writes, read `sk-code.cjs standardSource().excludedFromCheck`, and confirm the static sk-design adapter has no render path.
- Desired user-facing outcome: The user is told the default audit reads and reports only — it has no Write/Edit tools, its convergence check writes nothing, and it never runs the mutating minifier or renders a page.
- Expected signals: `SKILL.md` `allowed-tools` lists read/query tools plus Task/Bash reserved for gated remediation, with a note that the default surface has no Write/Edit; `check-convergence.cjs` writes nothing (decision only); `sk-code.cjs standardSource().excludedFromCheck` names `minify-webflow.mjs` with a read-only-by-default reason; the static sk-design adapter never renders; SKILL.md ALWAYS-#4 and NEVER-#3 state the rule.
- Pass/fail posture: PASS if the default surface has no Write/Edit, CONVERGE writes nothing, and the mutating minifier is excluded. FAIL if any default path can mutate an audited artifact.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the tool surface is checked before the per-script write paths.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the deep-alignment read-only default: no Write/Edit in the default surface, CONVERGE is decision-only, and the tree-mutating minify-webflow.mjs is excluded from the sk-code check().
### Commands
1. `bash: rg -n 'allowed-tools|read-only by default|no Write/Edit|reserved for the gated' .opencode/skills/system-deep-loop/deep-alignment/SKILL.md`
2. `bash: rg -n 'decision only; no writes|no writes|writeFileSync|write' .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs || echo "no writeFileSync in check-convergence.cjs (expected)"`
3. `bash: node -e "const c=require('./.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs'); const ss=c.standardSource('sk-code'); console.log(JSON.stringify(ss.excludedFromCheck,null,2));"`
4. `bash: rg -n 'never render|STATIC-ONLY|NFR-S01' .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs; rg -n 'Read-only by default|Keep the audited target read-only|Modify an audited artifact' .opencode/skills/system-deep-loop/deep-alignment/SKILL.md`
### Expected
`allowed-tools` lists `[Read, Grep, Glob, Task, Bash, memory_context, memory_search, code_graph_query]` with the SKILL.md note that the default surface has no Write/Edit and Task/Bash are reserved for gated remediation; `check-convergence.cjs` has no `writeFileSync` (decision-only, confirmed by the header "no writes"); `sk-code` `excludedFromCheck` names `minify-webflow.mjs` with a reason citing ADR-005/NFR-S01 tree mutation; the static sk-design adapter declares STATIC-ONLY and has no render path; SKILL.md ALWAYS-#4 / NEVER-#3 state the read-only rule.
### Evidence
Capture the allowed-tools + read-only note, the absence of writes in check-convergence.cjs, the excludedFromCheck entry, and the STATIC-ONLY / ALWAYS-#4 / NEVER-#3 statements.
### Pass/Fail
PASS if the default surface has no Write/Edit, CONVERGE writes nothing, and the mutating minifier is excluded. FAIL if any default path can mutate an audited artifact.
### Failure Triage
If `check()` in sk-code ever spawns `minify-webflow.mjs`, or `check-convergence.cjs` writes a file, the read-only default is violated (the finding). Note the reducer DOES write reducer-owned files under `alignment/` (registry/report) — that is loop state, not an audited artifact, and is out of this scenario's scope.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `read-only-and-gated-remediation/` | Invariant category; the default surface's read-only guarantees are exercised here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` | `allowed-tools`, read-only note, ALWAYS-#4 / NEVER-#3 |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs` | Decision-only (no writes) |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs` | `excludedFromCheck` for the tree-mutating minifier |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs` | STATIC-ONLY, never renders |

---

## 5. SOURCE METADATA

- Group: READ-ONLY AND GATED REMEDIATION
- Playbook ID: DAL-024
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `read-only-and-gated-remediation/read-only-default-surface.md`
- Criticality: Critical-path scenario (see root §5 hard rule).
