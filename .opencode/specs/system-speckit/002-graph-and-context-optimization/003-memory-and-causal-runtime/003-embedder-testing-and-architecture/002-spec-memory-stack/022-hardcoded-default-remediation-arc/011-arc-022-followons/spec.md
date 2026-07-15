---
title: "Spec: 022/011 Arc Follow-Ons (MCP Recovery + Validator Fix + opencode Idle-Kill Mitigation + RERANKER Vendor Defaults)"
description: "Bundle of follow-on fixes after the 022 arc shipped: mk_skill_advisor MCP -32000 recovery (build doesn't copy data/*.json), validator script 6-bug fix, opencode v1.15.10 reactive-EOF idle-kill mitigation (wrapper + memory + SKILL.md elevation), RERANKER_CANONICAL voyage/cohere vendor canonical fill. LANE_WEIGHTS_JSON structural deferred."
trigger_phrases:
  - "022/011 arc followons"
  - "mk_skill_advisor recovery"
  - "validate-doc-model-refs.js fix"
  - "opencode-persistent wrapper"
  - "reactive-EOF idle kill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/011-arc-022-followons"
    last_updated_at: "2026-05-23T18:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 011 shipped"
    next_safe_action: "Operator /mcp reconnect + commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/scripts/validate-doc-model-refs.js"
      - ".opencode/bin/opencode-persistent"
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/system-spec-kit/shared/embeddings/registry.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/data/prompt-policy.default.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b11"
      session_id: "016-002-022-011"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "LANE_WEIGHTS_JSON wiring deferred — needs bench-diff to confirm zero behavior change when env unset"
      - "build pipeline: tsc doesn't copy data/*.json into dist; manual copy is the immediate fix; package.json postbuild step is the permanent fix (deferred)"
    answered_questions:
      - "MCP -32000 root cause: 4.1MB stale SQLite WAL + orphan IPC socket + missing data/*.json in dist (the 004b JSON file)"
      - "Validator false-positive root cause: 5 bugs combined (missing /g flag x2, missing sbert/ prefix, missing / in suffix regex, wrong path resolution ../../../→../../) + wrapper-prefix normalization for unwrapped HF model ids"
      - "opencode idle-kill: NOT a built-in timeout. Reactive Bun.js session-EOF handling. Mitigation = </dev/null for non-interactive + tmux-wrapper for interactive (opencode-persistent)"
      - "RERANKER voyage/cohere: pinned to vendor-documented current rerankers (rerank-2.5 / rerank-v3.5) with TODO for bench-validation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- REVERTED: Step 3 opencode-persistent wrapper + cli-opencode SKILL.md rule 5 elevation REVERTED 2026-05-23 same-day per operator directive. See implementation-summary.md §6 "Post-ship Reversion". Other steps (1, 2, 4a) still active. References below to opencode-persistent + reactive-EOF mitigation reflect the ORIGINAL ship; treat as historical work-of-record. -->

# Spec: 022/011 Arc Follow-Ons

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Type | Multi-fix follow-on packet (MCP recovery + validator fix + opencode mitigation + RERANKER fill) |
| Files changed | 6 modified + 2 new |
| Wall-clock | ~90 min |
| Predecessor | All 12 phases of 022 arc shipped |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Three independent debt items surfaced post-022 arc convergence:

1. **mk_skill_advisor MCP -32000 reconnect failure.** Stale 4.1 MB SQLite WAL + orphan IPC socket + missing `data/prompt-policy.default.json` in compiled dist (the 004b JSON file was created in source but tsc build doesn't copy non-TS assets).

2. **`validate-doc-model-refs.js` (shipped by 010) false-positives.** 6 bugs combined: `matchAll` without `/g` flag (×2) throwing TypeError swallowed by outer try/catch, missing `sbert/` prefix in MODEL_ORG_PREFIXES, missing `/` in suffix regex, path-resolution off-by-one (`../../../` → `../../`), no wrapper-prefix normalization.

3. **opencode v1.15.10 reactive-EOF idle-kill.** NOT a built-in timeout — Bun.js session handler reacts to parent terminal stdio EOF. Binary string evidence: `"Session closed with error code"`, `"stream.push() after EOF"`. Affects any opencode session whose parent terminal closes / shell exits / App Nap suspends.

Plus the 022/005 follow-on of filling `RERANKER_CANONICAL` voyage/cohere empty placeholders.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (shipped this packet)

1. **MCP recovery (Step 1):** killed orphan processes, cleared 4.1 MB stale SQLite WAL + lease + IPC socket, rebuilt dist via `npm run build`, manually copied `data/prompt-policy.default.json` into `dist/system-skill-advisor/mcp_server/data/` (tsc doesn't copy static JSON). Launcher probe with `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-skill-advisor` returns clean lease.

2. **Validator 6-bug fix (Step 2):**
   - lines 41-42 + 55-56: added `/g` flag to matchAll regexes (was throwing TypeError swallowed by try/catch → empty canonical set)
   - line 165 MODEL_ORG_PREFIXES: added `'sbert/'` to support CocoIndex's wrapper namespace
   - line 210 orgNamePattern: changed `[a-zA-Z0-9._-]+` → `[a-zA-Z0-9._/-]+` to match multi-level wrapped names
   - lines 22-29 path resolution: `../../../` → `../../` (registry + cocoindex now load correctly)
   - lines 102-107 wrapper-prefix normalization: for canonical names like `sbert/X`, also add unwrapped form `X` so docs that cite the underlying HF model id match.

3. **opencode reactive-EOF mitigation (Step 3, PRIORITY #1):**
   - New `.opencode/bin/opencode-persistent` wrapper (executable bash; tmux-backed primary mode + nohup+setsid fallback + `--detect` + `--help`)
   - Updated `cli-opencode/SKILL.md` §4 ALWAYS rule 5 to broaden `</dev/null` requirement from "background loops" to any non-interactive invocation, citing the reactive-EOF root cause + wrapper script reference
   - New user-memory entry `feedback_opencode_idle_kill_reactive_eof.md` with diagnosis + 3 mitigation patterns + verification recipe
   - MEMORY.md indexed

4. **RERANKER_CANONICAL voyage/cohere fill (Step 4a):**
   - `voyage`: `'rerank-2.5'` (Voyage's flagship general-purpose reranker)
   - `cohere`: `'rerank-v3.5'` (Cohere's flagship reranker)
   - TODO comment: bench-validate on project fixture in a future packet.

### Out of Scope (deferred follow-ons)

- **Step 4b: SPECKIT_ADVISOR_LANE_WEIGHTS_JSON wiring.** Structural refactor of lane-registry.ts to add env-var override for SCORER_LANE_REGISTRY. ~90 min + bench-diff needed; deferred to follow-on packet.
- **Step 4c: ENV_REFERENCE consistency pass on 17 new env vars.** Done piecemeal during 022 arc shipping; deferred final review.
- **Step 4d: validate-doc-model-refs.js pre-commit hook.** Advisory hook; validator now functional but 6 remaining drift hits are legitimate (llama-cpp HF_EMBEDDINGS_MODEL defaults not in any canonical source). Wire pre-commit after llama-cpp canonical added.
- **Permanent build-pipeline fix:** package.json postbuild step `&& cp -r data dist/system-skill-advisor/mcp_server/` to auto-copy JSON. Deferred to follow-on (manual copy works for now).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Verification |
|---|---|---|
| R1 | mk_skill_advisor launcher probe succeeds with SPECKIT_IPC_SOCKET_DIR set | manual probe + log shows "LEASE_HELD_BY" |
| R2 | validate-doc-model-refs.js exits 1 on remaining-drift docs (not exit 0 swallowing all) | `node script; echo $?` returns 1 |
| R3 | Validator no longer flags current canonical Qwen3-Reranker-0.6B or sbert-wrapped nomic | grep |
| R4 | opencode-persistent wrapper exists, executable, --help works, --detect prints diagnosis | smoke test |
| R5 | cli-opencode SKILL.md rule 5 cites "reactive-EOF" and references opencode-persistent | grep |
| R6 | New memory entry exists + indexed in MEMORY.md | ls + grep |
| R7 | RERANKER_CANONICAL voyage = 'rerank-2.5', cohere = 'rerank-v3.5' | grep |
| R8 | system-spec-kit typecheck:root exit 0 | npm run typecheck:root |
| R9 | Strict-validate phase 011 exit 0 | validate.sh --strict |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

R1–R9 pass. 3 active operational debts cleared (MCP, validator, opencode idle-kill). 1 minor canonical-fill complete.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Multi-step in-session execution, mixed executors:

- **Main agent** (Step 1, 2, 4a): direct Edit + Bash for runtime cleanup, validator bug-hunt, registry edit.
- **cli-codex gpt-5.5 high fast** (Step 3): dispatched at PID via `codex exec --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast" --sandbox workspace-write`. Shipped opencode-persistent wrapper + cli-opencode SKILL.md edit. Memory file outside workspace — main agent wrote it.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|---|---|
| dist/ JSON copy is manual (not in build pipeline) — future `npm run build` overwrites dist/ and loses the copy | Documented in implementation-summary; permanent fix is package.json postbuild step (deferred). Run `cp data/*.json dist/.../mcp_server/data/` after every build until then. |
| Validator still has legitimate drift hits (llama-cpp HF defaults) | Validator now correctly identifies real drift; advisory mode acceptable until llama-cpp canonical added to a future packet |
| opencode-persistent wrapper requires tmux for best UX | Fallback to nohup+setsid documented; --detect mode prints which mode would be used |
| voyage/cohere reranker names not bench-validated | TODO comment in registry.ts + 022/011 follow-on note in spec |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Should `cli-opencode/SKILL.md` default invocation pattern reference `opencode-persistent` for interactive use? (Currently the rule 5 update mentions it; the default-invocation section §3 does not.)
- Should `validate-doc-model-refs.js` learn about llama-cpp HF_EMBEDDINGS_MODEL canonical (currently flagged as drift)?
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Parent arc: `../spec.md`
- Predecessor packets: 010 (validator script ship), 005 (RERANKER_CANONICAL declaration), 004b (data/prompt-policy.default.json ship)
- Memory: `feedback_opencode_idle_kill_reactive_eof.md` (NEW), `project_022_hardcoded_default_remediation_arc.md` (UPDATED)
- Original plan file: `~/.claude/plans/turn-these-spec-folders-shimmying-lagoon.md` (overwritten 2026-05-23 with this packet's plan)
<!-- /ANCHOR:cross-links -->

<!-- ANCHOR:nfr -->
## 10. NON-FUNCTIONAL REQUIREMENTS

- Behavior preserved (no runtime semantics change; bug fixes + new docs only)
- typecheck:root exit 0 maintained
- Validator script remains backward-compatible (exit codes + flags unchanged)
- opencode-persistent gracefully degrades (tmux missing → nohup+setsid)
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

- Operator runs `npm run build` and loses the manual JSON copy: handle by re-running `cp data/*.json dist/.../mcp_server/data/` until package.json postbuild lands.
- Validator script encounters a doc citing a real-but-uncatalogued model name (llama-cpp HF default) → reports drift; this is currently a TRUE flag; will be reclassified when canonical source added.
- opencode-persistent invoked on a host without tmux AND user wants interactive mode → wrapper prints fallback warning + uses nohup+setsid (non-interactive but session survives parent close).
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY

LEVEL 2 multi-fix packet. 4 independent debt items + 1 deferred. Mixed executors.
<!-- /ANCHOR:complexity -->
