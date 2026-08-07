---
title: "Handover: Remaining post-rename items (compiled-routing recompile + dist rebuild)"
description: "Two operator-gated items remain after the sk-prefix rename program: re-activate sk-doc compiled routing, and rebuild the mcp-server dist once the pi-hooks land."
contextType: "handover"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
---

# Handover — Remaining Post-Rename Items

## Current state (all shipped to `origin/skilled/v4.0.0.0`)

- **Rename program (030)** + **LUNA review remediation (010)** — complete. R1-P1 (catalog parity + guard), R4-P2 (fail-closed freshness + tests), R3-P1 (current-state record) all closed; committed `943617d3d7`.
- **Rename fallout (011)** — REQ-1 done: `sk-code-router-sync.vitest.ts` repointed to canonical `sk-*` names, suite 10/10; committed `98a8443d3f`.

Two items remain. **Neither is a live bug** — both are safe to defer.

---

## REMAINING 1 — Re-activate sk-doc compiled routing (operator-gated)

**What:** the sk-doc compiled-routing manifest was never recompiled after the mode rename, so it drifts from the frozen route-gold (32 rows, verdict `BLOCKED-BY-COMPILED-DRIFT`).

**Why it can wait:** the runtime already serves sk-doc via **legacy** (correct routing) — the drift only blocks the *compiled* path, it does not mis-route.

**Verify the state:**
```bash
node .opencode/bin/compiled-route-status.cjs --hub sk-doc --pretty          # -> servingAuthority: legacy
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \
  --skill sk-doc --outputs-dir /tmp/parity --trace-mode router --route-gold on --compiled-routing-parity on
# -> sk-doc verdict=BLOCKED-BY-COMPILED-DRIFT scenarios=32
```

**To resume (operator release step):** drive the gated compiler pipeline to regenerate
`.opencode/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` from the current
`sk-doc/mode-registry.json`, then re-attest `serving-closure.manifest.json`. There is **no CLI/main
entrypoint** — `004-compiler-n1-shadow/compiler/compiler.cjs` is a library — so this belongs to the
compiled-routing program, not an ad-hoc edit. **Do not** hand-edit the manifest, and **do not** touch the
frozen scorer/route-gold digests. Success = parity returns to 32/32 matches and `servingAuthority` can flip
back to `compiled`.

---

## REMAINING 2 — Rebuild the mcp-server dist (external blocker)

**What:** `validate.sh --strict` is blocked repo-wide because `system-spec-kit/mcp-server` dist is stale.

**Blocker (not ours):**
```bash
cd .opencode/skills/system-spec-kit/mcp-server && npm run build
# fails on hooks/pi/*.ts:
#   Cannot find module '@earendil-works/pi-coding-agent'   (TS2307)
#   Parameter 'event'/'ctx' implicitly has 'any' type      (TS7006)
#   import path can only end with '.ts'                     (TS5097)
```

**Owned by:** the hook-runtime program (worktrees `0118-hook-runtime-relocation`, `0120-unify-hooks-tree`).
The `hooks/pi/*.ts` files are theirs and out of scope here — do **not** fix them from a sk-doc packet.

**To resume:** once that program installs `@earendil-works/pi-coding-agent` and clears the pi-hook
type/import errors (or excludes those files from the mcp-server tsconfig), run the build on **main/CI**
(per sk-git's large-reorg rule), then re-run `validate.sh --strict` on packets 010 and 011 to clear the
deferred strict-validation gate.

---

## Housekeeping (optional)

- Branch `sk-doc/0114-mode-sk-prefix-rename` is at `3d77decd9a`; its content is on origin as the
  cherry-picked `943617d3d7`. Safe to delete.
- The primary checkout carries ~17 dirty files from a concurrent session (036/043 deep-loop metadata) —
  **not** part of this work; left untouched.

## Resume pointer

Start from this packet's `implementation-summary.md` (REQ-2/REQ-3 sections) — it carries the same root
causes and evidence. Nothing here blocks shipping; both items are deferred by design.
