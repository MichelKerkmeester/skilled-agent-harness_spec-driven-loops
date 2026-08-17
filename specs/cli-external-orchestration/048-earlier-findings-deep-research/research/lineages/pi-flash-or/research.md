# Deep Research: sk-vision host-adapter findings (pi-flash-or lineage)

Lineage: `pi-flash-or` · Session `fanout-pi-flash-or-1786990303810-r1u8es` · Generation 1
Spec folder: `specs/cli-external-orchestration/048-earlier-findings-deep-research`
Executor: cli-pi (deepseek/deepseek-v4-flash-latest, max reasoning)
10 iterations · stopPolicy=max-iterations · convergenceThreshold 0.05 (telemetry only)

---

## 1. EXECUTIVE SUMMARY

Five findings recorded while running the sk-vision manual-testing-playbook across Cursor and Devin were root-caused against primary evidence (runtime code, TS tool layer, moondream/kestrel library internals, host config surface, transcripts, web docs). Summary of verdicts:

| # | Finding | Root cause | Bug vs expected | Cleanest durable fix |
|---|---------|-----------|-----------------|----------------------|
| F1 | Cursor one-time MCP approval | Cursor's intended one-time trust grant for project-scoped MCP servers | Expected (security posture) | `--approve-mcps` for CI/one-offs; `cursor-agent mcp enable` for operators; optional `~/.cursor/mcp.json` |
| F2 | Devin `-p` rejects MCP unless `dangerous` | MCP tools are confirmation-gated; `-p` cannot answer prompts; `smart` unavailable | Expected + contract gap (skill default `accept-edits` insufficient for MCP tasks) | `permissions.allow: ["mcp__sk-vision__*"]` in `.devin/config.local.json` (least privilege) |
| F3 | moondream2 truncates OCR/VQA to ~1 token; moondream3 doubles | moondream2 lacks OCR capability (2B checkpoint); the `ocr` task guard is declared but **unenforced** in `handle_ocr`; md3 doubling is a preview-checkpoint repetition/sampling artifact | Bug (missing guard) + expected (model capability) | Enforce `_require_task("ocr")` (P0); document moondream3-for-OCR + verify-against-ground-truth; settings passthrough (F5b) enables temperature-0 mitigation |
| F4 | Cursor reads `.mcp.json` via `.cursor/mcp.json` symlink, not `.claude/mcp.json` | Cursor reads its own config scope (`.cursor/mcp.json` project / `~/.cursor/mcp.json` user); env in `.claude/mcp.json` alone is not honored | Expected (Cursor design) + docs gap | Author per-server env in `.cursor/mcp.json` scope (env block or envFile); document the chain in hooks README |
| F5 | `image` base64 param → 'Incorrect padding'; `inspect` drops `settings` | `_resolve_image` uses strict `base64.b64decode` (fails on unpadded/URL-safe data URLs); `settings` is dropped at the TS schema boundary (tools.ts/types.ts/photon.ts) while the Python runtime already forwards it | Bug (both) | Tolerant decoder in `runtime.py` (P0); 3-layer settings passthrough (P0) |

**Cross-cutting:** 3 P0 code fixes live in the **shared** runtime/tool layer and therefore propagate to all four hosts (Pi, OpenCode, Cursor, Devin) with one change each; 3 documentation/contract fixes unblock operators and CI today with zero runtime risk.

---

## 2. TOPIC

Root-cause and propose durable fixes for the five sk-vision host-adapter findings in this packet's resource-map.md.

---

## 3. KEY QUESTIONS AND ANSWERS

1. **F1** — Is per-server manual MCP approval Cursor's intended security posture, and what is the cleanest pre-approval path? **Answer:** Yes — intended. Pre-approve via `--approve-mcps` (per-dispatch/CI), `cursor-agent mcp enable <id>` (persistent operator trust), or moving the server to `~/.cursor/mcp.json` (user scope avoids project-level approval). `"trusted":true`/`"autoApprove":true` are not supported mcp.json fields. (It.002)
2. **F2** — Is there a narrower Devin MCP allowlist that avoids `dangerous`? **Answer:** Yes — `permissions.allow: ["mcp__<server>__<tool>"]` (or `"mcp__sk-vision__*"`) in `.devin/config.json` / `.devin/config.local.json`; then `devin -p` auto-approves exactly those MCP tools under `auto`/`accept-edits`. `smart` is unavailable on this install. (It.003)
3. **F3** — Root cause of 1-token moondream2 truncation and md3 doubling? **Answer:** Not a sk-vision token cap (skill passes `settings=None`; kestrel default is 768). moondream2 (2B) simply cannot do faithful OCR; the real defect is `handle_ocr` not enforcing the declared `_require_task("ocr")` guard (unlike `handle_segment`). md3 doubling (`CODE 42184218` vs truth `CODE 4218`) is a preview-checkpoint repetition/sampling artifact returned verbatim — not a sk-vision synthesis bug. (It.004–005)
4. **F4** — Cursor's exact MCP config-resolution chain and env placement? **Answer:** Cursor reads the same config as its editor: `.cursor/mcp.json` (project) then `~/.cursor/mcp.json` (user). In this repo `.cursor/mcp.json` symlinks to `.mcp.json` → `.claude/mcp.json`, so content is reached — but env is only honored from Cursor's own scope, via the server's `env` block or `envFile`. Writing env only into `.claude/mcp.json` as a Claude-Code file has no effect. (It.006)
5. **F5** — Root cause of 'Incorrect padding' and should inspect forward settings? **Answer:** `_resolve_image`'s data branch calls strict `base64.b64decode` which raises `binascii.Error: Incorrect padding` on unpadded/URL-safe data URLs (verified locally); the `path` param bypasses decode. And yes — the runtime already forwards `settings` on query/caption/ocr/detect/point/segment, but the TS schemas (types.ts) and provider (photon.ts) drop it, so `max_tokens`/`temperature` cannot be passed. (It.007–008)

---

## 4. METHODOLOGY

Per finding: (1) locate the code path in the shared runtime/tool layer; (2) confirm with transcripts or local reproduction; (3) classify bug-vs-expected against host/library documentation; (4) propose the minimal durable fix with exact file locations; (5) generalize across hosts. Evidence types: direct file reads (runtime.py, tools.ts, photon.ts, types.ts, server.ts, moondream/kestrel library), transcript logs (vsn-017…vsn-020), local Python reproduction, and web documentation (Cursor/Devin/Moondream).

---

## 5. FINDINGS DETAIL

### 5.1 F1 — Cursor one-time MCP approval (It.002)

**Root cause:** Cursor project-scoped MCP servers require a one-time operator trust grant before tools load; a configured-but-unapproved server shows `not loaded (needs approval)`. This mirrors VS Code workspace trust and is intended security behavior.

**Bug vs expected:** Expected. No `trusted`/`autoApprove` JSON field exists in Cursor mcp.json (community-confirmed `autoApprove` not supported).

**Durable fix / documentation:**
- CI/one-off: `cursor-agent -p "<task>" --model composer-2.5 --auto-review --sandbox enabled --approve-mcps` (auto-approves configured servers for that dispatch).
- Operator persistent: `cursor-agent mcp enable sk-vision` (trust mutation — never run by the playbook itself).
- Optional: move the server to `~/.cursor/mcp.json` to avoid re-approval on each project.
- Docs: cli-cursor skill should present `--approve-mcps` as the documented non-interactive path for MCP-dependent automated dispatches.

**Cross-host generalization:** Trust grants are per-host by design; Pi/OpenCode attach tools in-process (no gate), Cursor uses approval, Devin uses allowlists (F2). Common principle: grant tool/server-scoped trust rather than disabling all approval.

### 5.2 F2 — Devin `-p` MCP rejection (It.003)

**Root cause:** Devin MCP tools are treated as confirmation-requiring tools; in non-interactive `devin -p` no prompt can be answered, so the call is rejected. `auto`/`accept-edits` do not auto-approve MCP tools; `smart` is unavailable on this install ("Smart permission mode is not available. Falling back to normal."); only `dangerous` (all tools) worked.

**Bug vs expected:** Expected baseline behavior; the gap is a **contract gap** — the cli-devin skill defaults to `accept-edits` without surfacing the MCP-tool rule.

**Durable fix / documentation:**
```json
// .devin/config.local.json (machine-local) — least-privileged MCP allowlist
{
  "permissions": { "allow": ["mcp__sk-vision__sk_vision_ocr", "mcp__sk-vision__sk_vision_inspect"] }
}
```
or `"mcp__sk-vision__*"` for the whole server; `"mcp__*"` is documented high-risk. Then `devin -p` under `auto`/`accept-edits` auto-approves exactly those calls. Reserve `dangerous` for throwaway/isolated runners. Docs: cli-devin skill should recommend this allowlist as the non-interactive MCP route.

**Cross-host generalization:** Same principle as F1 — least-privilege tool trust, never blanket approval.

### 5.3 F3 — moondream2 1-token truncation + moondream3 doubling (It.004–005)

**Root cause (F3a):** Not a generation cap. sk-vision passes `settings=None`; kestrel's `AR_DEFAULT_MAX_NEW_TOKENS = 768`. The default `DEFAULT_MODEL = "moondream2"` is a 2B Phi-1.5-based checkpoint that is not trained for faithful OCR transcription; its `query()` collapses the transcription prompt to ~1–2 tokens ("SK"/"GR"/"CO"). The triggerable defect: `MOONDREAM3_ONLY_TASKS = {"segment", "reason", "ocr"}` declares `ocr` as moondream3-only, `handle_segment` enforces via `_require_task("segment")`, but **`handle_ocr` never calls `_require_task("ocr")`** — so moondream2 silently returns garbage instead of failing loudly.

**Root cause (F3b):** The `CODE 42184218` / `CODE 4 4218` outputs (truth: `CODE 4218`) are a moondream3-**preview** checkpoint repetition/sampling artifact. sk-vision returns `res["answer"]` verbatim; `renderOCR` only trims. MD3's base query template uses a single `answer_prefix: [3]` with no `answer_suppressed_token_ids` (unlike MD2's `[3,3]` doubled-id quirk), so this is not the MD2 template artifact — it is sampling-level repetition.

**Bug vs expected:** Bug (unenforced guard) + expected (model capability/preview artifact).

**Durable fix:**
1. P0: add `_require_task("ocr")` at the top of `handle_ocr` (mirror `handle_segment`).
2. Docs: SKILL.md should state `sk_vision_ocr` requires a Moondream 3.x checkpoint (`SK_VISION_MODEL=moondream3-preview`); treat md3-preview output as approximately correct — verify against ground truth when exactness matters.
3. Enabler: settings passthrough (F5b) so operators can pass `{"temperature": 0, "max_tokens": 256}` to reduce md3 sampling doubling.

**Cross-host generalization:** Host-independent (same runtime on all four hosts); remediation belongs in the shared runtime/SKILL.md, not per-host.

### 5.4 F4 — Cursor `.mcp.json` resolution chain (It.006)

**Root cause:** Cursor CLI reads the **same config as the Cursor editor** (no tool-private namespace): `.cursor/mcp.json` (project) then `~/.cursor/mcp.json` (user), merged with project→user→nested precedence. In this repo `.cursor/mcp.json` is a symlink to `.mcp.json` → `.claude/mcp.json`, so the *content* is reachable — but Cursor only honors per-server `env` from **its own scope** (env block or `envFile` for stdio servers). Setting `SK_VISION_MODEL` only in `.claude/mcp.json` has no effect on a dispatched cursor-agent.

**Bug vs expected:** Expected (Cursor design); the gap is sk-vision's host-plumbing/docs: `hooks/cursor/mcp.json` is a portable reference blob, not an owned source Cursor auto-loads.

**Durable fix / documentation:**
- Author per-server env in the `env` block of the sk-vision server within `.cursor/mcp.json` (or a project-scoped `.mcp.json` that `.cursor/mcp.json` symlinks to), or use `envFile` pointing at a gitignored `.env.mcp`.
- hooks README + cli-cursor skill should document the chain explicitly (Cursor reads `.cursor/mcp.json`; env lives in Cursor's scope; portable blob is a reference).

**Cross-host generalization:** Per-server env must be authored in the host's own config scope (Cursor `.cursor/mcp.json`; Claude Code `.mcp.json`; Devin MCP definition/launch). A shared `.claude/mcp.json`-centric assumption breaks Cursor.

### 5.5 F5 — base64 'Incorrect padding' + settings passthrough (It.007–008)

**Root cause (F5a):** `runtime.py::_resolve_image` data branch:
```python
if kind == "data":
    data = source["data"]
    if "," in data:
        data = data.split(",", 1)[1]
    return Image.open(io.BytesIO(base64.b64decode(data)))
```
`base64.b64decode` (stdlib, `validate=False` default) still raises `binascii.Error: Incorrect padding` for payloads whose length is not a multiple of 4 / missing `=` padding, and rejects URL-safe alphabet. LLM-produced data URLs are frequently unpadded or URL-safe → `INVALID_INPUT`. The `path` param works because it never enters the base64 path. Verified locally: `base64.b64decode('iVBORw0KGgo')` → `Incorrect padding`; `'iVBORw0KGgo='` → OK.

**Root cause (F5b):** Python runtime already forwards `settings=params.get("settings") or None` on query/caption/ocr/detect/point/segment, and moondream `SamplingSettings` supports `temperature`/`top_p`/`max_tokens`/`max_objects` — but the TS layer drops it: `tools.ts` inspect args are only `path`/`image`/`question`; `QueryRequest`/`SceneRequest`/`OCRRequest` in `types.ts` have no `settings`; `photon.ts` never sends it.

**Bug vs expected:** Bug (both).

**Durable fix:**
1. P0 — `runtime.py _resolve_image` data branch: strip whitespace, translate URL-safe alphabet (`-`→`+`, `_`→`/`), re-pad (`data += "=" * (-len(data) % 4)`), decode with a clear error naming the parameter. One change fixes all hosts.
2. P0 — settings passthrough (3 layers, one PR): `types.ts` add optional `settings` to request types; `photon.ts` forward `settings` in each `client.request` payload; `tools.ts` add an optional `settings` JSON-string arg to `sk_vision_inspect` (+ `sk_vision_ocr` first, then the rest). The MCP server (`server.ts`) inherits the new arg automatically because it reuses the shared definitions.

**Cross-host generalization:** Host-independent; the shared runtime/tool layer makes each fix a single change for all four hosts.

---

## 6. IMPLEMENTATION PLAN (proposed, follow-on packet)

Ordered by blast radius; each item is a recommendation, not yet implemented (research scope).

1. `vision-runtime/python/runtime.py` — tolerant base64 decode in `_resolve_image` (F5a).
2. `vision-runtime/python/runtime.py` — `_require_task("ocr")` in `handle_ocr` (F3a).
3. `vision-runtime/src/providers/types.ts` + `providers/photon.ts` + `opencode/tools.ts` — settings passthrough (F5b).
4. `sk-vision/SKILL.md` + `hooks/README.md` — OCR model guidance (moondream3 for `ocr`, verify preview output) and Cursor env-scope documentation (F3b, F4).
5. `cli-external-orchestration/cli-cursor/SKILL.md` — `--approve-mcps` recipe for MCP-dependent automated dispatches (F1).
6. `cli-external-orchestration/cli-devin/SKILL.md` — MCP `permissions.allow` contract (F2).

---

## 7. LIMITATIONS

- moondream3-preview output variance was observed across hosts (Cursor `CODE 42184218`, Devin `CODE 4 4218`); the doubling classification relies on library config inspection + web documentation, not a controlled sampling experiment.
- Devin `permissions.allow` exact prefix shape (`mcp__<server>__<tool>`) is per community/docs mirrors; verify on the installed `devin --help`/version.
- No live re-run was performed on Cursor/Devin (researched surface read-only; fixes are recommendations).

---

## 8. REFERENCES

- Resource map: `specs/cli-external-orchestration/048-earlier-findings-deep-research/resource-map.md`
- Runtime: `.opencode/skills/sk-vision/vision-runtime/python/runtime.py`
- Tool layer: `.opencode/skills/sk-vision/vision-runtime/src/opencode/tools.ts`, `src/providers/photon.ts`, `src/providers/types.ts`, `src/mcp/server.ts`
- Host docs: `.opencode/skills/cli-external-orchestration/cli-cursor/` and `cli-devin/` SKILL.md + references
- Evidence: `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/017-cursor-devin-testing-playbook/scratch/run-2026-08-17/` (vsn-017…vsn-020)
- Library: `~/.cache/sk-vision/venv/.../kestrel/` + `moondream/`
- Web: docs.cursor.com/context/model-context-protocol · forum.cursor.com · docs.devinai.cn/cli/reference/permissions · huggingface.co/vikhyatk/moondream2 · moondream.ai/p/models

---

## 9. ELIMINATED ALTERNATIVES

- `trusted:true` / `autoApprove:true` in Cursor mcp.json (unsupported field).
- Devin `--permission-mode smart` (unavailable; falls back to normal).
- Devin `mcp__*` blanket allow (too broad, documented high-risk).
- A sk-vision 1-token generation cap (settings=None; kestrel default 768).
- A sk-vision text-doubling synthesis bug (handle_ocr returns verbatim; renderOCR trims only).
- Reading env from `.claude/mcp.json` as a general Cursor mechanism (Cursor honors its own scope).
- TS-side-only base64 fix (the decoder lives in Python; one fix covers all hosts).
- Per-host settings plumbing (shared definitions make it one change for all hosts).

## 10. DIVERGENCE MAP

No divergent pivots were needed: all five findings resolved along the intended fan-out with primary-source evidence. Saturated directions: the shared-layer code paths (runtime.py, tools.ts, photon.ts) are fully mapped; host config surfaces (Cursor/Devin) are fully documented; no remaining frontier. Failed pivots: none. Audited overrides: none.

---

## 11. OPEN QUESTIONS

- Implementation follow-up (out of research scope): add `settings` to all 13 tools or only `inspect`/`ocr` first — recommendation: `inspect`/`ocr` first.

---

## 12. CONVERGENCE REPORT

- Stop reason: maxIterationsReached (stopPolicy=max-iterations; convergence is telemetry only)
- Total iterations: 10
- Questions answered: 5 / 5 (1 implementation-follow-up open)
- Remaining questions: 1 (implementation-scope follow-up)
- Last 3 iteration summaries: run 8: F5b settings passthrough (0.55) · run 9: cross-host generalization & fixes (0.45) · run 10: final verification (0.35)
- Convergence threshold: 0.05 (telemetry only)
- Average newInfoRatio trend: 0.95 → 0.35 (declining as expected under forced depth; all findings resolved)
- Divergence summary: none recorded — straight-line resolution across all five findings
