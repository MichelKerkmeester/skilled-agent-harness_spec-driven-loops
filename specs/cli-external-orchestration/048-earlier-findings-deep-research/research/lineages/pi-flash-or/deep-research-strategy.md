---
title: Deep Research Strategy - sk-vision host-adapter findings
description: Iterative root-cause research over the five sk-vision host-adapter findings across Cursor and Devin.
trigger_phrases:
  - "sk-vision findings deep research"
  - "cursor mcp approval"
  - "devin permission mode disastrous"
  - "moondream ocr truncation"
  - "mcp.json resolution"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Root-cause and propose durable fixes for five sk-vision host-adapter findings recorded while running the manual-testing-playbook across Cursor and Devin.

### Usage
- **Init:** Orchestrator copied this template and populated Topic, Key Questions, Known Context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, reducer refreshes machine-owned sections.
- **Mutability:** Mutable — analyst-owned sections stable; machine-owned sections rewritten by reducer.

---

## 2. TOPIC
Root-cause and propose durable fixes for the five sk-vision host-adapter findings in this packet's resource-map.md: (1) Cursor one-time MCP approval before a server loads; (2) Devin -p rejecting MCP tool calls unless --permission-mode dangerous (smart unavailable); (3) default moondream2 truncating OCR/VQA text to ~1 token while true OCR needs moondream3 (which shows a token-doubling artifact); (4) Cursor reading .mcp.json via the .cursor/mcp.json symlink rather than .claude/mcp.json for per-server env; (5) the sk-vision image base64 param failing 'Incorrect padding' while path works, and sk_vision_inspect not forwarding a settings object.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] F1: Is per-server manual MCP approval Cursor's intended security posture, and what is the cleanest pre-approval path for a repo's own server? (It.002)
- [x] F2: Is there a narrower per-tool/per-server MCP allowlist for Devin non-interactive that avoids --permission-mode dangerous? (It.003)
- [x] F3: What is the root cause of the 1-token moondream2 OCR/VQA truncation (generation cap vs decode bug), and the moondream3 token-doubling artifact? (It.004-005)
- [x] F4: What is Cursor's exact MCP config-resolution chain and where must per-server env overrides live? (It.006)
- [x] F5: What is the root cause of the base64 'Incorrect padding' failure, and should sk_vision_inspect forward a settings object? (It.007-008)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Do NOT implement the fixes; report findings only (implementation is a follow-on packet).
- Do NOT modify the sk-vision skill code or any host config in this repo; the researched surface is read-only.
- Do NOT claim a root cause without evidence (code line, log, or [SOURCE]).

---

## 5. STOP CONDITIONS
- 10 iterations completed (stopPolicy=max-iterations) — do NOT synthesize early; convergence is telemetry only.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- F1: Cursor per-server MCP approval is intended security posture; pre-approve via `--approve-mcps` (CI) / `cursor-agent mcp enable` (operator) / `~/.cursor/mcp.json` (It.002)
- F2: Devin MCP tools are confirmation-gated; `permissions.allow: ["mcp__sk-vision__*"]` in `.devin/config.local.json` is the least-privileged non-interactive fix; `dangerous` too broad (It.003)
- F3: moondream2 1-token output = model-capability gap exposed by unenforced `_require_task("ocr")` (not a token cap); md3 doubling = preview-checkpoint repetition/sampling artifact; fix = enforce guard + document moondream3-for-OCR + settings (temp 0) (It.004-005)
- F4: Cursor reads its own scope (`.cursor/mcp.json` symlinked to `.mcp.json`/`.claude/mcp.json`); per-server env must be authored there (env block or envFile), not only `.claude/mcp.json` (It.006)
- F5: 'Incorrect padding' = strict `base64.b64decode` on unpadded/URL-safe data URL in `_resolve_image`; settings dropped at TS schema boundary; fixes = tolerant decoder + 3-layer settings passthrough (It.007-008)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading the shared runtime + TS tool layer directly (tools.ts/photon.ts/runtime.py) before web research: located the P0 code-level root causes for F3a/F5 (It.001, It.004, It.007)
- Reading the installed moondream/kestrel library internals (config.py, skills/query.py): distinguished MD2 template quirks from MD3 preview artifacts (It.004-005)
- Combining local cli-cursor/cli-devin reference docs with web research: nailed F1/F2/F4 host contracts (It.002, It.003, It.006)
- Local python verification of base64.b64decode behavior: turned F5a from hypothesis into confirmed reproduction (It.007)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- N/A: no approach failed; all five findings resolved with primary-source evidence (It.001-010)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `trusted:true`/`autoApprove:true` in Cursor mcp.json: not a supported field (It.002)
- Devin `--permission-mode smart`: unavailable on install; falls back to normal (It.003)
- Devin `mcp__*` blanket allow: too broad, documented high-risk (It.003)
- sk-vision 1-token generation cap: settings=None; kestrel default 768 (It.004)
- sk-vision text-doubling synthesis bug: handle_ocr returns verbatim; renderOCR trims only (It.005)
- General env read from `.claude/mcp.json`: Cursor honors its own scope only (It.006)
- TS-side-only base64 fix: decoder lives in Python; one fix covers all hosts (It.007)
- Per-host settings plumbing: shared definitions make it one change for all hosts (It.008)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Implementation follow-up (out of research scope): whether to add settings to all 13 tools or only inspect/ocr first — recommend inspect/ocr (It.008-009)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Loop complete (10/10, stopPolicy=max-iterations). Synthesis: compile research.md with per-finding root cause, bug-vs-expected, durable fix, and cross-host generalization.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers:
  - `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/017-cursor-devin-testing-playbook/scratch/run-2026-08-17/` — transcripts (vsn-017 through vsn-020) + OCR fixture + outcomes.
  - `specs/cli-external-orchestration/048-earlier-findings-deep-research/resource-map.md` — the five-finding corpus.
  - `.opencode/skills/sk-vision/vision-runtime/python/runtime.py` — model lifecycle, OCR/scene/query handlers, source resolution.
  - `.opencode/skills/sk-vision/vision-runtime/src/mcp/server.ts` — MCP stdio server for Cursor/Devin.
  - `.opencode/skills/sk-vision/vision-runtime/src/opencode/tools.ts` — shared 13-tool definitions (inspect lacks settings).
  - `.opencode/skills/sk-vision/hooks/{cursor,devin}/` — per-host MCP config blobs.
- Reuse candidates: `MOONDREAM3_ONLY_TASKS` + `_require_task` gating in runtime.py; `SIGKILL` probe scripts in scratch dir.
- Integration points: Cursor `.cursor/mcp.json` symlink chain; Devin `.devin/mcp_config.json` symlink.
- Constraints/risks: researched surface is read-only; fixes are recommendations only.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10 (stopPolicy=max-iterations)
- Convergence threshold: 0.05 (telemetry only under max-iterations)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (this run)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-08-17T18:18:43Z
