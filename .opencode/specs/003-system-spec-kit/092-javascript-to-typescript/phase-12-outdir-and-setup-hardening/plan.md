# Plan: Phase 11 — outDir Migration + Setup Hardening + README Alignment

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-L
> **Session:** 6
> **Status:** Complete
> **Created:** 2026-02-07

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3plus-govern | v2.0 -->

---

## 1. Overview

**Goal:** Harden MCP setup, separate compiled output into `dist/`, and align all documentation.

**Scope:**
- 3 parallel streams (A: setup hardening, B: outDir refactor, C: README alignment)
- ~100 files across config, TypeScript, and documentation
- Estimated effort: 8–12 hours across multiple sessions

**Strategy:** Execute streams A and B first (they're infrastructure changes), then C (documentation reflects the new reality). Stream C+ was added retroactively when config files were discovered to still have broken patterns.

---

## 2. Execution Strategy

### Stream A: Setup Hardening (5 files)

**Priority:** First — prevents MCP startup failures for all users.

| File | Root Cause | Fix |
|------|-----------|-----|
| `opencode.json` | Placeholder API keys treated as real by auto-detection | Remove placeholders, set `EMBEDDINGS_PROVIDER: "hf-local"` |
| `install-code-mode.sh` | Stale npx cache with old isolated-vm | Add `rm -rf ~/.npm/_npx/*` cleanup |
| `install-spec-kit-memory.sh` | Same placeholder key issue + stale HF cache | Remove placeholders, add HF cache cleanup |
| `retry-manager.ts` | No handling for `ERR_DLOPEN_FAILED` | Add native module error detection |
| Root `package.json` | Outdated script paths | Update to `dist/` entry points |

### Stream B: outDir Refactor (~50 files)

**Priority:** Second — eliminates ~1400 compiled artifacts from source dirs.

**Phase B1: TypeScript Configuration**
- Add `"outDir": "dist/"` to 3 tsconfig files (shared, mcp_server, scripts)

**Phase B2: Path Resolution**
- Update `__dirname`-based path resolution in `config.ts` files
- Fix 3 scripts that compute paths relative to source location
- Update `vector-index.ts` and `vector-index-impl.js` import paths

**Phase B3: Package Entry Points**
- Update 5 `package.json` files to point `main` at `dist/` compiled output
- Create 8 cross-workspace re-export barrels for `@spec-kit/shared` and `@spec-kit/mcp-server`

**Phase B4: Test Updates**
- Update ~30 test files with new `dist/` path references
- Verify all test suites still pass

**Phase B5: Cleanup**
- Delete ~1400 compiled `.js` files from source directories
- Add `**/dist/` patterns to `.gitignore`

### Stream C: README Alignment (43 files)

**Priority:** Third — documentation reflects the new reality.

Delegated to 3 parallel agents:
- **Agent 1:** `mcp_server/README.md` (5 edits)
- **Agent 2:** `mcp_server/INSTALL_GUIDE.md` (23 edits)
- **Agent 3:** `system-spec-kit/README.md` (12 edits)
- **Remaining:** 40 sub-module READMEs (batch updates)

### Stream C+: Post-Discovery Config Fix (5 files)

**Priority:** P0 — discovered after Stream C that active config files still had broken patterns.

| File | Issues |
|------|--------|
| `.claude/mcp.json` | Wrong entry point, placeholder keys, `"auto"` provider |
| `.vscode/mcp.json` | Identical issues |
| `mcp_server/INSTALL_GUIDE.md` | Config examples with placeholders, missing troubleshooting |
| `mcp_server/README.md` | Incomplete HF cache troubleshooting |
| `install_guides/README.md` | 5 wrong entry points, old config examples, Ollama-first troubleshooting |

---

## 3. Execution Order

```
Stream A: Setup Hardening (5 files)          ← FIRST (prevents user-facing failures)
    ↓
Stream B: outDir Refactor (~50 files)        ← SECOND (infrastructure change)
    ↓
Stream C: README Alignment (43 files)        ← THIRD (docs reflect new reality)
    ↓
Stream C+: Config File Fix (5 files)         ← FOURTH (discovered post-C)
    ↓
VERIFY: grep checks for all broken patterns → 0 matches
```

---

## 4. Verification Strategy

### Per-Stream Verification

| Stream | Verification |
|--------|-------------|
| A | MCP server starts without crash; no placeholder keys in `opencode.json` |
| B | `tsc --build` produces output only in `dist/`; all tests pass |
| C | All READMEs reference `.ts` sources and `dist/` output |
| C+ | 7-point grep verification (see checklist) |

### Final Verification (7 checks)

1. `grep "YOUR_VOYAGE_API_KEY_HERE\|YOUR_OPENAI_API_KEY_HERE"` → 0 matches across all config/doc files
2. `grep "context-server.js"` → all show `dist/context-server.js`
3. `grep '"auto"'` in config files → 0 matches
4. `grep "generate-context.js"` → all show `scripts/dist/memory/generate-context.js`
5. `grep "ERR_DLOPEN\|transformers/.cache"` in INSTALL_GUIDE → matches in troubleshooting
6. `grep "transformers/.cache"` in README.md → match in troubleshooting
7. `grep "xenova"` in config files → 0 matches

---

## 5. Risk Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| outDir change breaks runtime imports | Medium | High | Run full test suite after each tsconfig change |
| README updates miss some files | Low | Medium | Use `find` to enumerate all READMEs, verify count |
| Config file patterns missed | Medium | High | Systematic grep verification across entire repo |
| Users have cached old config | Low | Low | Document migration steps in install guide |

---

## Cross-References

- **Spec:** See `spec.md`
- **Tasks:** See `tasks.md`
- **Checklist:** See `checklist.md`
- **Decision Record:** See `decision-record.md`
- **Parent Plan:** `092-javascript-to-typescript/plan.md`
