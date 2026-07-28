---
title: "Iteration 002 — Security: verify forgery hardening completeness + credential redaction coverage"
iteration: 2
dimension: security
verdict: CONDITIONAL
---

# Iteration 002 — Security

**Focus dimension**: D2 Security
**Target**: Verify the two security-related Phase 6 fixes (REQ-009 forgery hardening, REQ-010 credential redaction) are complete from a security perspective, and check whether the 4 broken imports from iteration 1 create any security exposure (e.g. a silently-disabled guard).

## 1. REQ-009 — Dispatch-Guard Forgery Hardening (Security Review)

**File**: `.opencode/runtime-hooks/task-dispatch/lib/dispatch-guard.cjs:132-165`

The fix adds a structural binding: the iteration marker must co-occur with a `Config:` path that resolves to a real on-disk deep-loop config file. This is a sound defense — a forger cannot produce filesystem state with prompt text alone.

**Security assessment**:
- The `Config:` regex (`STATE_CONFIG_PATH_REGEX`) captures `\S+` (non-whitespace), which is reasonable for a path token.
- `..` traversal is rejected (`rawPath.includes('..')` → null), preventing path traversal attacks that could point at an arbitrary file.
- The config validation checks `typeof config.mode === 'string'` and `Number.isFinite(Number(config.maxIterations))` — this is a presence check, not an exact-match check. The comment explains why: "a slightly stale prompt pack from an earlier reducer sync is legitimate." This is acceptable: the goal is to prove the path is a genuine deep-loop config, not to bind to exact iteration numbers.
- **Residual risk**: An attacker who can write a file to the project tree could create a fake config file that satisfies the check. However, this requires filesystem write access, which is a strictly higher privilege than prompt injection. The fix raises the bar from "text-only forgery" to "filesystem-write forgery" — a meaningful improvement.

[SOURCE: `.opencode/runtime-hooks/task-dispatch/lib/dispatch-guard.cjs:132-165`]

**Verdict on REQ-009 security**: PASS — the structural binding is sound and the path-traversal guard is present.

## 2. REQ-010 — Credential Redaction (Security Review)

**File**: `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs:112-141`

The two new patterns (PEM blocks, JWTs) close the specific gap from R3-P1-002. The PEM pattern uses non-greedy `[\s\S]+?` with `s`-equivalent flag (actually `[\s\S]` which is the portable equivalent), and the JWT pattern anchors on `eyJ` (the base64url encoding of `{"`).

**Security assessment**:
- The allowlist approach is inherently incomplete — it catches known shapes but misses novel credential formats. The fix acknowledges this by adding two more known shapes, not by switching to an entropy-based heuristic.
- **Residual risk (P2)**: A credential in an unrecognized format (e.g. a raw hex API key, a base64-encoded secret without a JWT structure, a cloud provider-specific token format not in the prefix list) would still be persisted verbatim. This is a known limitation of the allowlist approach, not a regression from the fix.
- The `scrubAndBoundField` function also scrubs the `model` and `target` fields, which is correct — these are substrings pulled from the raw command and could carry secret-shaped content.

[SOURCE: `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs:112-149`, `:159-162`]

**Verdict on REQ-010 security**: PASS for the two specific shapes called out in R3-P1-002. The broader allowlist-vs-heuristic question is a P2 advisory (F005), not a regression.

### F005 — P2: Credential redaction remains allowlist-based

**File**: `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs:112-141`

The redaction approach is still pattern-based. A credential in a truly novel shape (no keyword, no known prefix, no PEM/JWT structure) would still reach the audit log. This is a pre-existing design limitation, not a regression from the remediation. An entropy-based heuristic alongside the allowlist would be a future improvement.

[SOURCE: `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs:112-141`]

## 3. Security Impact of Broken Imports (F001-F004)

The 4 broken imports from iteration 1 have a security dimension: when `git-preflight-advisory.mjs` or `permission-request-policy.mjs` crashes at module-load, the guard they provide is **silently disabled**.

- `git-preflight-advisory.mjs` is a PreToolUse hook that advises on git operations. When it crashes, the runtime either surfaces an error (Claude, Cursor) or silently falls through to the `|| printf` fallback (Devin, Codex). In the fallback case, the operator gets no git advisory at all — the guard is gone without any visible signal.
- `permission-request-policy.mjs` is a Devin PreToolUse hook that enforces permission-request policy. When it crashes, the Devin runtime would surface an error, but the policy enforcement is bypassed.

This is a **security degradation**: the relocation silently disabled 2 guard hooks across 5 runtime wirings. This elevates the severity confirmation of F001/F002 from a correctness issue to also a security issue — the guards are not just broken, they are silently absent.

[SOURCE: `.claude/settings.json:31`, `.devin/hooks.v1.json:67,131`, `.codex/hooks.json:64`, `.cursor/hooks.json:61`]

## 4. Dimension Verdict

D2 Security: **CONDITIONAL** — the two Phase 6 security fixes (REQ-009, REQ-010) are sound and complete for their specific scope. The broken imports from iteration 1 create a security degradation (silently disabled guards) that is already captured as P0 in F001/F002. One new P2 advisory (F005: allowlist-based redaction limitation).

Review verdict: CONDITIONAL
