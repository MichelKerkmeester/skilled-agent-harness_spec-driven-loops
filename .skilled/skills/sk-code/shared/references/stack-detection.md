---
title: Stack & Surface Detection
description: Surface detection (SKILLED/UNKNOWN) and SKILLED language sub-detection. Primary routing key for sk-code.
trigger_phrases:
  - "sk-code surface detection"
  - "stack detection routing key"
  - "language sub detection"
importance_tier: important
contextType: general
version: 2.2.2.0
---

# Router Reference - Code Surface Detection

`sk-code` detects the code surface before intent classification. Surface detection uses CWD plus changed or target files because the same repository can hold this framework's own system code beside another stack.

---

## 1. OVERVIEW

### Core Principle

Detect **where the work is happening** before deciding which standards apply.

| Surface | Owns | Does Not Own |
| --- | --- | --- |
| SKILLED | `.skilled/` skills, agents, commands, MCP/server code, scripts, tests, JSON/JSONC config | browser-behavior work for another stack |
| UNKNOWN | Fallback for unsupported or ambiguous surfaces | No standards applied until clarified |

Motion.dev is a peer resource category rather than a surface. Surface detection chooses SKILLED or UNKNOWN first; Motion.dev API, performance, and decision guidance is loaded afterward when the intent requires cross-stack animation context.

---

## 2. DETECTION ORDER

**Precedence**: SKILLED > UNKNOWN. An SKILLED target/CWD wins, but only when its **resolved** real path lands inside the hub's own `.skilled/` directory — see the symlink guard below. Everything else stays UNKNOWN until the user clarifies the surface. Use early-return logic — later branches must not overwrite earlier matches.

```bash
# 1. SKILLED (highest precedence — disambiguates mixed-marker workspaces)
# CWD under .skilled/ OR any changed/target file under .skilled/

# 2. UNKNOWN
# Ask which surface and verification commands apply.
```

**Why SKILLED wins precedence**: `.skilled/` system tools (e.g. preview servers, mock fixtures, animation demos under `.skilled/skills/sk-doc/scripts/`) may import vanilla animation libraries internally without belonging to another stack's shipping artifacts. A first-match on another surface would mis-route this work to the wrong standards. The target/CWD path is the strongest unambiguous signal of which surface owns the work.

**Symlink guard — required for SKILLED detection.** A downstream plugin repository symlinks
`.opencode`, `.claude`, `.codex`, `.cursor`, and `.devin` at its root back to this hub, so hub skills
and agents are visible to tooling that expects those folders at a repo root. A literal "is there a
`.opencode/` segment at or above CWD" test therefore reports SKILLED for **every** task in that
repository, including one that never touches a hub file. Resolve symlinks before testing: SKILLED
holds only when the **resolved** real path of the CWD or of a changed/target file lands inside the
hub's actual `.skilled/` directory. A plugin source file reached through the repo root's symlink
does not; a genuine hub file reached through it does, so SKILLED still wins for real hub work. The
guard changes how the test is performed, not which surface wins.

---

## 3. SKILLED LANGUAGE SUB-DETECTION

After SKILLED surface detection, select language resources by extension first:

| Language | Extensions | Resource Folder |
| --- | --- | --- |
| JAVASCRIPT | `.js`, `.mjs`, `.cjs` | `sk-code-skilled/references/javascript/` |
| TYPESCRIPT | `.ts`, `.tsx`, `.mts`, `.d.ts` | `sk-code-skilled/references/typescript/` |
| PYTHON | `.py` | `sk-code-skilled/references/python/` |
| SHELL | `.sh`, `.bash` | `sk-code-skilled/references/shell/` |
| RUST | `.rs`; fallback markers `Cargo.toml`, `Cargo.lock`; napi-rs/wasm-bindgen vocabulary | `sk-code-skilled/references/rust/` |
| CONFIG | `.json`, `.jsonc` | `sk-code-skilled/references/config/` |
| CONFIG | `.yaml`, `.yml` | `sk-code-skilled/references/config/` |

When multiple languages are touched, load shared OpenCode guidance plus each touched language quick reference/checklist. Rust is a touched-language-set case, not a first-match override: a napi-rs/WASM parity task that touches both `.rs` and `.ts` loads the Rust trio AND the TypeScript trio plus shared guidance, because the Rust module must be verified byte-for-byte against its TypeScript oracle. Cargo markers (`Cargo.toml`/`Cargo.lock`) are evaluated only after SKILLED surface detection, never as a cross-project surface signal.

YAML is a live OpenCode config-adjacent genre for command routers, command auto/confirm assets, and workflow contracts. A live-surface scan found 65 YAML/YML files under `.skilled/commands` and `.skilled/skills`, excluding `node_modules` and `dist`.

---

## 4. TEST CASES

| Context | Expected Surface | Reason |
| --- | --- | --- |
| CWD `.skilled/skills/sk-code` | SKILLED | Skill/system code context |
| Changed `.skilled/agents/code.md` | SKILLED | Target file under `.skilled/` |

| Literal path string contains `.opencode/` but resolves outside the hub | not SKILLED | The realpath gate refuses SKILLED on a string match alone |
| Changed `apps/desktop/src/styles/app.css` AND changed `.opencode/agents/code.md` | **SKILLED** | `.opencode/` target wins when a task also touches a path outside the hub |
| Root `package.json` with no `.skilled/` target | UNKNOWN | Generic Node.js is not owned |
| `go.mod` or `next.config.js` only | UNKNOWN | Go/NextJS placeholder routes were removed |

---

## 5. RELATED RESOURCES

- [`../../ROUTER.md`](../../ROUTER.md) — root intent classification, resource maps, declared shared controls, and load tiers
- [`./phase-detection.md`](./phase-detection.md) — Phase 1/2/3 lifecycle and per-phase resource loading
- `SKILL.md` section 2 — operator-facing summary of the routing contract
