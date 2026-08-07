---
title: "Iter 6 — Security (commit ba6816a49 re-review)"
iter_number: 6
dimension: security
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: ba6816a490b1a20d4f74135179c10096c5348921
---

# Iter 6 — Security

## 1. SCOPED ANGLE

This iteration performs a security-focused re-review of commit `ba6816a49`, which introduces environment parsing helpers, logging telemetry, and input validation gates. The review threat-models every new attack surface introduced or modified by the commit across six probes: (1) parseBoundedEnv injection vectors, (2) logger format-string risks, (3) device allowlist completeness, (4) embedder registry gate bypass, (5) log injection via env values, and (6) name length cap bypass.

## 2. REFERENCES READ

- `.opencode/skills/system-spec-kit/mcp_server/lib/util.ts` (NEW file, lines 1-19)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` (lines 1-197)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py` (lines 1-143)
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts` (lines 1-94)

## 3. FINDINGS

### Probe 1 — parseBoundedEnv injection (verdict SAFE)

The `parseBoundedEnv` function at <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/util/env.ts" lines="5-19" /> uses `Number.parseInt(raw, 10)` which correctly handles edge cases:

- `"1e1000"` → parses as `1` (stops at 'e'), not Infinity
- `"123abc"` → parses as `123` (stops at non-digit)
- Negative numbers below min → clamped by `Math.max(min, parsed)`
- Leading whitespace → `parseInt` handles this correctly
- `NaN` / `Infinity` / floats → filtered by `Number.isInteger(parsed)` check at line 15
- `MAX_SAFE_INTEGER` → clamp works correctly
- `min`/`max` as NaN → caught by `!Number.isFinite(...)` throw at line 6
- `min > max` → caught by throw at line 9

**Verdict**: SAFE — all injection vectors are handled by existing validation.

### Probe 2 — Format-string risks (verdict SAFE)

TypeScript uses structured logging with object payloads (e.g., <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts" lines="78-84" />), which is safe from format-string injection.

Python uses old-style `%` formatting with literal format strings:
- <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="64-68" />
- <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="132-135" />
- <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="147-151" />

The format string is always a string literal in source code, not user-derived. Values are passed as subsequent arguments to `%r` formatting.

**Verdict**: SAFE — no format-string injection risk.

### Probe 3 — Device allowlist completeness (verdict P1)

The allowlist at <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="12" /> is `{"cuda", "mps", "cpu"}`. The `_resolve_device` function at <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="60-68" /> normalizes input with `.strip().lower()` before checking membership.

This rejects legitimate PyTorch device strings like `"cuda:0"`, `"xpu"` (Intel), `"hip"` (ROCm), `"vulkan"`, etc. While `torch.device()` does not have known RCE via arbitrary device strings (this is a usability filter, not a security control), the allowlist is overly strict for legitimate multi-GPU setups.

**Verdict**: P1 — usability issue (legitimate `"cuda:0"` rejected by strict allowlist).

### Probe 4 — Embedder registry gate (verdict SAFE)

The `_is_registered_embedder` gate at <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="107-110" /> calls `get_embedder_metadata(name)` from `registered_embedders.py`. The `get_embedder_metadata` function at <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py" lines="124-129" /> is a simple linear search over the frozen `MANIFESTS` tuple — no side effects, no dynamic imports, no `eval`, no network calls.

If an attacker sets `COCOINDEX_CODE_EMBEDDING_MODEL=<malicious>`, the gate returns `False` and the code falls back to `_DEFAULT_MODEL` at <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="146-152" />.

**Verdict**: SAFE — no gate bypass possible.

### Probe 5 — Log injection (verdict SAFE)

All Python `logger.warning` calls in `config.py` use `%r` formatting (lines 64-68, 132-135, 147-151). The `%r` specifier calls `repr()` on the env values, which escapes newlines and special characters. An attacker setting `COCOINDEX_CODE_DEVICE=$'\n[ERROR] fake log line'` would have the newline escaped as literal `\n` in the output, preventing log injection.

**Verdict**: SAFE — `repr()` blocks log injection.

### Probe 6 — Name length cap (verdict SAFE)

The `MAX_EMBEDDER_NAME_LENGTH = 256` check at <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts" lines="32,58-60" /> uses JavaScript `.length` (UTF-16 code units). An attacker with multi-byte UTF-8 could fit more bytes than 256 characters (up to ~768 with 3-byte chars, ~1024 with 4-byte chars).

However, the check runs BEFORE `getManifest(name)` at line 61, so registry-key attacks via long names are blocked. The downstream consumer (SQLite TEXT column, registry lookup) is char-bounded, not byte-bounded, so the UTF-16 code unit count is the appropriate metric.

**Verdict**: SAFE — length check prevents registry-key attacks.

### NEW P0/P1/P2 findings

**P1 — Device allowlist too strict for legitimate PyTorch device strings**
- **Location**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="12,60-68" />
- **Evidence**: The allowlist `{"cuda", "mps", "cpu"}` rejects legitimate device strings like `"cuda:0"`, `"xpu"`, `"hip"`, etc. The normalization at line 61 converts `"CUDA:0"` to `"cuda:0"`, which is not in the allowlist. While not a security vulnerability (torch.device() has no known RCE via device strings), this is a usability P1 for users with multi-GPU or non-standard backends.
- **Reproduction**: Set `COCOINDEX_CODE_DEVICE=cuda:0` → warning logged, device falls back to auto-detection.

## 4. POSITIVE OBSERVATIONS

1. **parseBoundedEnv defense-in-depth**: The function validates both input parsing (via `Number.isInteger`) and bounds (via `Math.min/max`), with explicit throws for invalid caller-supplied bounds.
2. **Safe Python logging**: All log calls use `%r` (repr) formatting, which automatically escapes special characters and prevents log injection.
3. **Structured logging in TypeScript**: Object payloads are used instead of format strings, eliminating format-string injection risk.
4. **Registry lookup is pure**: `get_embedder_metadata` is a simple linear search with no side effects, making the embedder gate robust against supply chain attacks.
5. **Length check ordering**: The name length check runs before registry lookup, preventing potential DoS via long keys.

## 5. JSONL DELTA ROW

```json
{"ts":"2026-05-17T23:32:00.000Z","event":"iter_complete","iter":6,"dimension":"security","p0_count":0,"p1_count":1,"p2_count":0,"refs_read_count":4,"probes_safe":5,"verdict_so_far":"1 P1 (device allowlist usability issue)"}
```

