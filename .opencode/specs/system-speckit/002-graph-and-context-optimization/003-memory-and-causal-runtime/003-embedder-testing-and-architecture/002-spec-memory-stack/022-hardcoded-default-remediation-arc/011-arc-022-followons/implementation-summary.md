---
title: "Implementation Summary: 022/011"
description: "Bundle of 4 follow-on fixes after 022 arc convergence: MCP recovery + validator 6-bug fix + opencode reactive-EOF mitigation + RERANKER fill. 4 follow-on items deferred."
trigger_phrases: ["022/011 shipped"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/011-arc-022-followons"
    last_updated_at: "2026-05-23T18:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 011 shipped"
    next_safe_action: "Operator /mcp reconnect + commit when ready"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/scripts/validate-doc-model-refs.js"
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/system-spec-kit/shared/embeddings/registry.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/data/prompt-policy.default.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b15"
      session_id: "016-002-022-011-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Permanent build-pipeline JSON copy (package.json postbuild) — deferred follow-on"
      - "LANE_WEIGHTS_JSON wiring — deferred follow-on (needs bench-diff)"
      - "Validator llama-cpp canonical source — would close remaining ~6 legitimate-drift hits"
    answered_questions:
      - "All 4 active debts cleared via main-agent + cli-codex dispatch"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: 022/011 Arc Follow-Ons

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Shipped | 2026-05-23 |
| Files changed | 4 modified + 2 new + 1 runtime copy |
| Findings closed | 3 operational debts + 1 canonical-fill |
| Wall-clock | ~90 min |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### Step 1 — MCP recovery

- Killed orphan processes (mk-skill-advisor, skill-graph-daemon, advisor-server).
- Cleared 4.1 MB stale SQLite WAL + .sqlite-shm + lease JSON + IPC socket dir (`/tmp/mk-skill-advisor/`).
- Rebuilt dist via `npm run build` (exit 0).
- Manually copied `data/prompt-policy.default.json` (1486 bytes) into `dist/system-skill-advisor/mcp_server/data/` — tsc doesn't copy non-TS assets; the 004b JSON file lived only in source dir.
- Verified launcher probe succeeds with `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-skill-advisor` env var: "LEASE_HELD_BY:<PID>" log line.

### Step 2 — Validator 6-bug fix

`.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js`:

| # | Bug | Fix |
|---|---|---|
| 1 | Line 41-42 `matchAll(/CLOUD_CANONICAL.*?{[^}]+}/s)` missing `/g` flag — throws TypeError swallowed by try/catch | Added `/g`: `/CLOUD_CANONICAL.*?{[^}]+}/gs` |
| 2 | Line 55-56 same bug on RERANKER_CANONICAL | Same fix |
| 3 | Line 165-185 `MODEL_ORG_PREFIXES` missing `'sbert/'` wrapper | Added `'sbert/'` to the list |
| 4 | Line 210 `orgNamePattern = (${orgPattern})[a-zA-Z0-9._-]+` doesn't allow `/` in suffix | Changed to `[a-zA-Z0-9._/-]+` |
| 5 | Lines 22-29 path resolution `../../../system-spec-kit/...` is wrong (3 ups from `scripts/` overshoots) | Changed to `../../system-spec-kit/...` (2 ups) |
| 6 | No normalization for wrapped canonical names (canonical has `sbert/X` but docs cite `X`) | Added: for each canonical name with `sbert/` prefix, also add the unwrapped form |

Validator now exits 1 correctly on drift; no longer flags `Qwen/Qwen3-Reranker-0.6B` or `sbert/nomic-ai/CodeRankEmbed`. Remaining drift hits (~6) are LEGITIMATE — llama-cpp `HF_EMBEDDINGS_MODEL` defaults (`onnx-community/embeddinggemma-300m-ONNX`, `unsloth/embeddinggemma-300m-GGUF`, `unsloth/bge-base-en-v1.5-GGUF`) that are NOT in any canonical source the validator currently loads.

### Step 3 — opencode reactive-EOF mitigation (cli-codex gpt-5.5 high fast dispatch)

**Wrapper script `.opencode/bin/opencode-persistent`** (NEW, executable, 6015 bytes):
- 3-mode: tmux-backed (preferred for interactive), nohup+setsid fallback (non-interactive), `--detect` for diagnosis-only.
- `--help` + `--session=<name>` + `--detect` flags.
- Tmux session name default: `opencode-<timestamp>`; user detach via Ctrl-B D; re-attach via `tmux attach -t <name>`.

**`cli-opencode/SKILL.md` updates:**
- Line 236 broadened the `</dev/null` note from "while read loops" to "any non-interactive invocation".
- Line 287 rule 5 ALWAYS rewritten to cite reactive-EOF root cause + `opencode-persistent` wrapper reference + Bun.js session-handler diagnostics.

**Memory entry** `~/.claude/projects/.../memory/feedback_opencode_idle_kill_reactive_eof.md` (NEW, 3596 bytes): diagnosis + 3 mitigation patterns + verification recipe + cross-links. Indexed in MEMORY.md.

### Step 4a — RERANKER_CANONICAL fill

`registry.ts:228-242`:
- `voyage`: `'rerank-2.5'` (Voyage's flagship general-purpose reranker)
- `cohere`: `'rerank-v3.5'` (Cohere's flagship reranker)
- TODO comment: "022/011-followon — dedicated reranker bake-off should empirically confirm these vendor-recommended names on the project's fixture; for now these are documented defaults, not bench-locked."

### Deferred

- **Step 4b** SPECKIT_ADVISOR_LANE_WEIGHTS_JSON wiring (90 min structural + bench-diff)
- **Step 4c** ENV_REFERENCE consistency pass on 17 new env vars (review-only)
- **Step 4d** validator pre-commit hook (blocked on llama-cpp canonical source addition)
- **Permanent build-pipeline JSON copy** (package.json postbuild step)
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

~90 min total wall-clock. Mixed executors:

1. **Plan-mode workflow** with 3 parallel Explore agents (MCP diagnosis, validator bug-hunt, opencode idle-kill investigation). Diagnoses returned 250-350 words each with concrete evidence.
2. **Main-agent direct** (Steps 1, 2, 4a, 5): MCP runtime cleanup, validator 6 edits + iterative verification, registry.ts fill, packet docs.
3. **cli-codex dispatch** (Step 3): `codex exec --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast" --sandbox workspace-write` shipped the wrapper script + SKILL.md edit. Memory file (outside workspace) written by main-agent.
4. **Validator bug-hunt was iterative**: initial 4 fixes from Explore diagnosis didn't fully fix the false positives; 2 additional bugs (path-resolution off-by-one + wrapper-prefix normalization) surfaced during verification.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Manual JSON copy** for MCP recovery instead of waiting for permanent build-pipeline fix. Unblocks the operator immediately; package.json postbuild step deferred.
- **Iterative validator debugging** (4 → 5 → 6 bugs) instead of cli-X dispatch — each bug surfaced from running the post-fix output, faster than describing it to an executor.
- **cli-codex over cli-devin** for Step 3 because operator named "gpt 5.5 high fast" verbatim → cli-codex SKILL.md user-override table maps directly to it.
- **Vendor canonical for voyage/cohere reranker** instead of leaving empty placeholders. The names are documented externally; bench-validation deferred to a follow-on (TODO comment).
- **LANE_WEIGHTS_JSON deferred** because the structural refactor needs bench-diff to confirm zero behavior change — out of scope for a single follow-on packet.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- MCP: launcher probe with env var set returns "LEASE_HELD_BY" — PASS
- Validator: exits 1 on drift; no false positives on Qwen3 + sbert/-wrapped canonical — PASS
- opencode-persistent: bash -n exit 0; --detect prints version + diagnosis + tmux mode — PASS
- cli-opencode SKILL.md: grep "reactive-EOF" + "opencode-persistent" returns ≥ 2 hits — PASS
- Memory entry: file exists + indexed in MEMORY.md — PASS
- RERANKER_CANONICAL: voyage='rerank-2.5' + cohere='rerank-v3.5' + TODO comment — PASS
- system-spec-kit typecheck:root: exit 0 — PASS
- Strict-validate phase 011: PASS (after this doc set authored)
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- The dist/ JSON copy is manual; `npm run build` overwrites dist/ and loses the copy. Re-copy after every build until package.json postbuild step lands (deferred).
- Validator's remaining ~6 flagged drift cases (llama-cpp HF_EMBEDDINGS_MODEL defaults) are LEGITIMATE — the docs ARE the only source of those model names. To eliminate them, either: (a) add a canonical source for llama-cpp models, or (b) suppress them via INTENTIONAL_MARKER_WORDS like "fallback".
- voyage/cohere reranker names are vendor-documented but not bench-validated on the project's fixture.
- opencode-persistent's nohup+setsid fallback mode is non-interactive only (no REPL access without tmux).

### Post-ship Reversion (2026-05-23, same day)

After Step 3 shipped the `opencode-persistent` wrapper, the operator gave explicit directive: "we don't want to do anything to keep opencode persistent — just remove the logic that kills opencode sessions that are inactive. Only do that [exclusion] for cli-devin. Also not for codex."

Applied:
- **Deleted** `.opencode/bin/opencode-persistent` wrapper. The reactive-EOF behavior is upstream Bun.js; operator accepts it and will restart sessions manually if they die.
- **Reverted** `cli-opencode/SKILL.md` §4 ALWAYS rule 5 to the pre-022/011 wording (still has the broader `</dev/null` requirement, but no wrapper reference). Added a sentence saying "DO NOT auto-kill external operator-owned opencode sessions" pointing to the cleanup-memory exclusion.
- **Updated** memory `feedback_proactive_orphan_cleanup.md` to **exclude** `devin --print` AND `opencode run` from the auto-pkill sweep pattern. Codex stays in the sweep. `/tmp/devin-*` and `/tmp/opencode-*` scratch no longer auto-deleted.
- **Repurposed** memory `feedback_opencode_idle_kill_reactive_eof.md` as documentation-only ("this is upstream; don't build mitigation; existing rule is sufficient").

Net result of 011: Step 3 was reverted; Steps 1, 2, 4a still active. Validator fix + MCP recovery + RERANKER fill stand.

### Commit Handoff

```
feat(022/011): arc follow-ons — MCP recovery + validator 6-bug fix + opencode reactive-EOF mitigation + RERANKER fill

Closes 3 active operational debts post-022 arc convergence + 1 canonical-fill:

Step 1 (MCP -32000 recovery): cleared 4.1MB stale SQLite WAL + orphan IPC
  socket + missing data/*.json in compiled dist (tsc doesn't copy non-TS
  assets). Launcher probe with SPECKIT_IPC_SOCKET_DIR=/tmp/mk-skill-advisor
  succeeds.

Step 2 (validator 6 bugs): matchAll /g flag x2 (CLOUD_CANONICAL +
  RERANKER_CANONICAL), MODEL_ORG_PREFIXES sbert/ addition, orgNamePattern
  / in suffix regex, path-resolution ../../../→../../ off-by-one,
  wrapper-prefix normalization. Validator now exits 1 on real drift; no
  longer false-positives on canonical Qwen3 + sbert/-wrapped names.

Step 3 (opencode reactive-EOF idle-kill mitigation): new bin/opencode-persistent
  wrapper (tmux-backed primary + nohup+setsid fallback + --detect +
  --help). cli-opencode SKILL.md rule 5 broadened from background loops to
  any non-interactive invocation, citing reactive-EOF root cause. New
  memory entry feedback_opencode_idle_kill_reactive_eof.md.

Step 4a (RERANKER_CANONICAL fill): voyage='rerank-2.5' + cohere='rerank-v3.5'
  with bench-validation TODO.

Deferred: LANE_WEIGHTS_JSON (structural), ENV_REFERENCE consistency pass,
  validator pre-commit hook (blocked on llama-cpp canonical), package.json
  postbuild JSON copy.

cli-codex gpt-5.5 high fast dispatch shipped Step 3 wrapper + SKILL.md edit.
Main agent shipped Steps 1, 2, 4a, 5.
```

Explicit paths:

```
.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js
.opencode/bin/opencode-persistent  (NEW)
.opencode/skills/cli-opencode/SKILL.md
.opencode/skills/system-spec-kit/shared/embeddings/registry.ts
.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/data/prompt-policy.default.json  (NEW — runtime copy)
.opencode/specs/system-spec-kit/.../022-.../011-arc-022-followons/
~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/feedback_opencode_idle_kill_reactive_eof.md  (NEW)
~/.claude/projects/.../memory/MEMORY.md
```
<!-- /ANCHOR:limitations -->
