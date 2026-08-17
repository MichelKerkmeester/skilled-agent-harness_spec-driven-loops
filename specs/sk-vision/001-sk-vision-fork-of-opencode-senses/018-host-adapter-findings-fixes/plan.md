---
title: "Implementation Plan: Fix the five sk-vision host-adapter findings"
description: "Three phases: runtime code bugs, sk-vision docs, cli-cursor/cli-devin MCP docs — implemented by DeepSeek V4 Flash, verified by Claude."
trigger_phrases:
  - "sk-vision host-adapter findings fixes plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/018-host-adapter-findings-fixes"
    last_updated_at: "2026-08-17T20:30:00.000Z"
    last_updated_by: "claude"
    recent_action: "DeepSeek Flash fixed all 5 findings across 3 phases; Claude verified."
    next_safe_action: "Commit the packet on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/018-host-adapter-findings-fixes/plan.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/opencode/tools.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-018-host-adapter-findings-fixes"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fix the five sk-vision host-adapter findings

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python (moondream runtime) + TypeScript (provider/tools) + markdown skills |
| **Framework** | sk-vision vision-runtime; cli-external-orchestration skills |
| **Storage** | `vision-runtime/{python,src}`; sk-vision + cli-cursor/cli-devin `SKILL.md` |
| **Testing** | `runtime.test.ts`, `photon.test.ts`; `python3 -c` decode checks; `tsc`; package `--check` |

### Overview
Implement the `048` §6 plan in three phases, dispatching DeepSeek V4 Flash (cli-pi, OpenRouter, max thinking) per phase with precise per-file instructions, and verifying each phase before the next.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root causes + exact targets known. Evidence: `048/research.md` §5-6 + read code lines.
- [x] Executor chosen. Evidence: cli-pi `openrouter/deepseek/deepseek-v4-flash-latest` max thinking.

### Definition of Done
- [ ] Three code bugs fixed + tested; four doc gaps closed. Evidence: `implementation-summary.md`.
- [x] Runtime tests + `tsc` + package green. Evidence: provider/server 6/6; runtime 3/3; `tsc` 0; `--check` PASS.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Small-model implementation with Claude verification: precise per-file dispatch prompts → the model edits → Claude runs objective checks (decode probes, tests, `tsc`, grep) before accepting.

### Key Components
- **`runtime.py`** — `_resolve_image` (base64) + `handle_ocr` (task guard); already forwards `settings`.
- **`types.ts` / `photon.ts` / `tools.ts`** — the settings-passthrough chain.
- **Skill docs** — sk-vision + cli-cursor + cli-devin operational contracts.

### Data Flow
`sk_vision_ocr({settings})` → tools.ts arg → photon.ts payload → Python `params["settings"]` → moondream `SamplingSettings`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Runtime code bugs (F5a, F3a, F5b)
- [x] base64 + OCR guard + settings passthrough landed. Evidence: `runtime.py` + `tools.ts` diffs; tests green.

### Phase 2: sk-vision docs (F3b, F4)
- [x] OCR-model + Cursor env-scope documented. Evidence: `SKILL.md` + `hooks/README.md` grep.

### Phase 3: cli docs (F1, F2)
- [x] cli-cursor + cli-devin MCP recipes documented. Evidence: `cli-cursor` / `cli-devin` `SKILL.md` grep.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Decode | base64 tolerance | `python3 -c` before/after |
| Guard | OCR task rejection | direct `handle_ocr` probe |
| Passthrough | settings reaches Python | `runtime.test.ts` / probe |
| Types | TS compiles | `tsc --noEmit` |
| Package | skill valid | `validate_skill_package.py --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `048` research §6 | Internal | Landed | No fix spec |
| cli-pi OpenRouter DeepSeek Flash | Internal | Landed | No implementation executor |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A dispatched fix is wrong or breaks tests.
- **Procedure**: `git checkout` the affected runtime/doc file(s) to discard the bad edit, re-scope the dispatch prompt, and re-run. Each phase is verified before the next, so a bad phase never blocks a good one.
<!-- /ANCHOR:rollback -->
