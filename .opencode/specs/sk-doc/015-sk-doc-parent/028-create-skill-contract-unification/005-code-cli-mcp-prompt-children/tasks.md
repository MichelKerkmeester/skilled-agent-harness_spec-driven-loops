---
title: "Tasks: sk-code / cli / mcp / sk-prompt Children Contract Conformance"
description: "One work-item per file: LUNA MAX update then fresh Sonnet-5 xhigh verify then validator gate, for the 12 files in this batch."
trigger_phrases:
  - "005-code-cli-mcp-prompt-children tasks"
  - "per-file conformance tasks"
  - "LUNA update Sonnet verify"
importance_tier: "normal"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/028-create-skill-contract-unification"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/028-create-skill-contract-unification/005-code-cli-mcp-prompt-children"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded conformance phase tasks (planned)"
    next_safe_action: "Dispatch LUNA-MAX updates after operator go-ahead"
    blockers: []
    key_files: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: sk-code / cli / mcp / sk-prompt Children Contract Conformance

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable (>=5 concurrent per wave) |

**Format**: `T### [P?] Description (path)`. Each file has one update task and one verify+gate task.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm worktree at origin tip; capture per-file validator baseline for all 12 files [EVIDENCE: `git worktree` wt-028 at origin tip; baseline via `baseline_sweep.py`]
- [x] T002 Compose the LUNA update prompt (contract target + scope lock + `GATE-3 PRE-RESOLVED`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Update tasks — dispatched in waves of >=5 (fresh LUNA MAX per file):

- [~] T003 [P] LUNA MAX update `sk-code/code-opencode` SKILL.md to contract (`.opencode/skills/sk-code/code-opencode/SKILL.md`) [EVIDENCE: EXEMPT — packetKind: surface]
- [x] T004 [P] LUNA MAX update `sk-code/code-quality` SKILL.md to contract (`.opencode/skills/sk-code/code-quality/SKILL.md`) [EVIDENCE: `a38c06d3a4`; gate PASS + Sonnet-5 verify PASS]
- [x] T005 [P] LUNA MAX update `sk-code/code-review` SKILL.md to contract (`.opencode/skills/sk-code/code-review/SKILL.md`) [EVIDENCE: `a38c06d3a4`; gate PASS + Sonnet-5 verify PASS]
- [~] T006 [P] LUNA MAX update `sk-code/code-webflow` SKILL.md to contract (`.opencode/skills/sk-code/code-webflow/SKILL.md`) [EVIDENCE: EXEMPT — packetKind: surface]
- [x] T007 [P] LUNA MAX update `cli-external-orchestration/cli-claude-code` SKILL.md to contract (`.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T008 [P] LUNA MAX update `cli-external-orchestration/cli-codex` SKILL.md to contract (`.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T009 [P] LUNA MAX update `cli-external-orchestration/cli-opencode` SKILL.md to contract (`.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T010 [P] LUNA MAX update `mcp-tooling/mcp-chrome-devtools` SKILL.md to contract (`.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T011 [P] LUNA MAX update `mcp-tooling/mcp-click-up` SKILL.md to contract (`.opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`) [EVIDENCE: `a38c06d3a4`; gate PASS + Sonnet-5 verify PASS]
- [x] T012 [P] LUNA MAX update `mcp-tooling/mcp-figma` SKILL.md to contract (`.opencode/skills/mcp-tooling/mcp-figma/SKILL.md`) [EVIDENCE: `a38c06d3a4`; gate PASS + Sonnet-5 verify PASS]
- [x] T013 [P] LUNA MAX update `sk-prompt/prompt-improve` SKILL.md to contract (`.opencode/skills/sk-prompt/prompt-improve/SKILL.md`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T014 [P] LUNA MAX update `sk-prompt/prompt-models` SKILL.md to contract (`.opencode/skills/sk-prompt/prompt-models/SKILL.md`) [EVIDENCE: `a38c06d3a4`; gate PASS + Sonnet-5 verify PASS]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Verify + gate tasks — a fresh Sonnet-5 xhigh agent per file, then the validator:

- [~] T015 [P] fresh Sonnet-5 xhigh verify `sk-code/code-opencode` + validator gate (`.opencode/skills/sk-code/code-opencode/`) [EVIDENCE: EXEMPT — packetKind: surface]
- [x] T016 [P] fresh Sonnet-5 xhigh verify `sk-code/code-quality` + validator gate (`.opencode/skills/sk-code/code-quality/`) [EVIDENCE: `a38c06d3a4`; gate PASS + Sonnet-5 verify PASS]
- [x] T017 [P] fresh Sonnet-5 xhigh verify `sk-code/code-review` + validator gate (`.opencode/skills/sk-code/code-review/`) [EVIDENCE: `a38c06d3a4`; gate PASS + Sonnet-5 verify PASS]
- [~] T018 [P] fresh Sonnet-5 xhigh verify `sk-code/code-webflow` + validator gate (`.opencode/skills/sk-code/code-webflow/`) [EVIDENCE: EXEMPT — packetKind: surface]
- [x] T019 [P] fresh Sonnet-5 xhigh verify `cli-external-orchestration/cli-claude-code` + validator gate (`.opencode/skills/cli-external-orchestration/cli-claude-code/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T020 [P] fresh Sonnet-5 xhigh verify `cli-external-orchestration/cli-codex` + validator gate (`.opencode/skills/cli-external-orchestration/cli-codex/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T021 [P] fresh Sonnet-5 xhigh verify `cli-external-orchestration/cli-opencode` + validator gate (`.opencode/skills/cli-external-orchestration/cli-opencode/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T022 [P] fresh Sonnet-5 xhigh verify `mcp-tooling/mcp-chrome-devtools` + validator gate (`.opencode/skills/mcp-tooling/mcp-chrome-devtools/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T023 [P] fresh Sonnet-5 xhigh verify `mcp-tooling/mcp-click-up` + validator gate (`.opencode/skills/mcp-tooling/mcp-click-up/`) [EVIDENCE: `a38c06d3a4`; gate PASS + Sonnet-5 verify PASS]
- [x] T024 [P] fresh Sonnet-5 xhigh verify `mcp-tooling/mcp-figma` + validator gate (`.opencode/skills/mcp-tooling/mcp-figma/`) [EVIDENCE: `a38c06d3a4`; gate PASS + Sonnet-5 verify PASS]
- [x] T025 [P] fresh Sonnet-5 xhigh verify `sk-prompt/prompt-improve` + validator gate (`.opencode/skills/sk-prompt/prompt-improve/`) [EVIDENCE: already conformant at baseline; no edit]
- [x] T026 [P] fresh Sonnet-5 xhigh verify `sk-prompt/prompt-models` + validator gate (`.opencode/skills/sk-prompt/prompt-models/`) [EVIDENCE: `a38c06d3a4`; gate PASS + Sonnet-5 verify PASS]

- [x] T027 Owning-hub regression check green; `validate.sh --strict` Errors 0; reconcile packet docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 12 update tasks complete (fresh LUNA MAX each)
- [x] All 12 verify+gate tasks complete (fresh Sonnet-5 xhigh each), validator green
- [x] No file outside this batch modified; hub regression green
- [x] `validate.sh --strict` Errors 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `./spec.md`
- **Plan**: `./plan.md`
- **Checklist**: `./checklist.md`
<!-- /ANCHOR:cross-refs -->
