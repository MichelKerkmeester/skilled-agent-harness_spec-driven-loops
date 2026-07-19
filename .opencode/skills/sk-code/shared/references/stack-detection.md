---
title: Stack & Surface Detection
description: Surface detection (WEBFLOW/OPENCODE/UNKNOWN) and OPENCODE language sub-detection. Primary routing key for sk-code.
trigger_phrases:
  - "sk-code surface detection"
  - "webflow opencode detection"
  - "stack detection routing key"
  - "language sub detection"
importance_tier: important
contextType: general
version: 4.1.0.9
---

# Router Reference - Code Surface Detection

`sk-code` detects the code surface before intent classification. Surface detection uses CWD plus changed or target files because the same repository can contain Webflow frontend code and OpenCode system code.

---

## 1. OVERVIEW

### Core Principle

Detect **where the work is happening** before deciding which standards apply.

| Surface | Owns | Does Not Own |
| --- | --- | --- |
| WEBFLOW | Webflow / vanilla HTML, CSS, JavaScript, animation libraries, CDN/minification, browser behavior | `.opencode/` system code |
| OPENCODE | `.opencode/` skills, agents, commands, MCP/server code, scripts, tests, JSON/JSONC config | Webflow/browser behavior |
| UNKNOWN | Fallback for unsupported or ambiguous surfaces | No standards applied until clarified |

`motion_dev/` is a peer resource category rather than a surface. Surface detection still chooses WEBFLOW, OPENCODE, or UNKNOWN first; Motion.dev API, performance, and decision guidance is loaded afterward when the intent requires cross-stack animation context.

---

## 2. DETECTION ORDER

**Precedence**: OPENCODE target/CWD wins over WEBFLOW markers. WEBFLOW wins over UNKNOWN. Use early-return logic — later branches must not overwrite earlier matches.

```bash
# 1. OPENCODE (highest precedence — disambiguates mixed-marker workspaces)
# CWD under .opencode/ OR any changed/target file under .opencode/

# 2. WEBFLOW
[ -d "src/2_javascript" ]
ls *.webflow.js 2>/dev/null | head -1
grep -lq "Webflow\.push\|--vw-" src/**/*.{js,css,html} 2>/dev/null
grep -lqE "window\.Motion|window\.gsap|gsap\.(to|from|set|timeline|registerPlugin)|new Lenis|new Hls|new Swiper|FilePond" \
  src/**/*.{js,mjs,ts,html} *.{js,mjs,ts,html} 2>/dev/null
[ -f "wrangler.toml" ]

# 3. UNKNOWN
# Ask which surface and verification commands apply.
```

**Why OPENCODE wins precedence**: `.opencode/` system tools (e.g. preview servers, mock fixtures, animation demos under `.opencode/skills/sk-doc/scripts/`) may import vanilla animation libraries internally without being WEBFLOW-shipping artifacts. A first-match-WEBFLOW order would mis-route this work to the wrong standards. The target/CWD path is the strongest unambiguous signal of which surface owns the work.

**Generic-Node guard**: WEBFLOW markers are gated to actual Webflow signals (vendor globals, Webflow paths, `wrangler.toml`, `src/2_javascript/`). Bare Motion package imports and generic Motion documentation mentions are MOTION_DEV intent signals after surface selection, not WEBFLOW surface markers. Generic Node.js outside `.opencode/` and without WEBFLOW markers stays UNKNOWN until the user clarifies the surface.

### Explicit Non-Webflow Guards

Prompt-level negative Webflow language wins before WEBFLOW fallback logic. If the user explicitly says any of the following, the surface MUST be UNKNOWN for implementation requests, or N/A for documentation-style cross-stack guidance:

- `NOT Webflow`
- `no Webflow Designer`
- `without Webflow`
- `non-Webflow`
- `vanilla HTML/CSS/JS only`
- `stack-agnostic`
- equivalent wording that excludes Webflow as the implementation surface

This guard applies even when the prompt mentions Motion.dev, GSAP, Lenis, Swiper, or vanilla animation work. Those terms can trigger the MOTION_DEV resource intent, but they must not promote an explicitly non-Webflow request to WEBFLOW.

Expected CS-002 behavior:

| Prompt | Expected Surface | Expected Resource Scope |
| --- | --- | --- |
| `I'm building a vanilla HTML/CSS/JS landing page (NOT Webflow no Webflow Designer involved) and want to add motion.dev animations.` | UNKNOWN or N/A | `references/motion_dev/*` exact files only; no `references/webflow/*` |
| `Show stack-agnostic Motion.dev guidance for animate-on-scroll.` | N/A | `references/motion_dev/quick-start.md`, `references/motion_dev/scroll-and-gestures.md`, exact snippet assets |
| `Update Webflow page code that uses window.Motion.` | WEBFLOW | Webflow implementation refs plus Motion.dev peer refs |

---

## 3. OPENCODE LANGUAGE SUB-DETECTION

After OPENCODE surface detection, select language resources by extension first:

| Language | Extensions | Resource Folder |
| --- | --- | --- |
| JAVASCRIPT | `.js`, `.mjs`, `.cjs` | `code-opencode/references/javascript/` |
| TYPESCRIPT | `.ts`, `.tsx`, `.mts`, `.d.ts` | `code-opencode/references/typescript/` |
| PYTHON | `.py` | `code-opencode/references/python/` |
| SHELL | `.sh`, `.bash` | `code-opencode/references/shell/` |
| RUST | `.rs`; fallback markers `Cargo.toml`, `Cargo.lock`; napi-rs/wasm-bindgen vocabulary | `code-opencode/references/rust/` |
| CONFIG | `.json`, `.jsonc` | `code-opencode/references/config/` |
| CONFIG | `.yaml`, `.yml` | `code-opencode/references/config/` |

When multiple languages are touched, load shared OpenCode guidance plus each touched language quick reference/checklist. Rust is a touched-language-set case, not a first-match override: a napi-rs/WASM parity task that touches both `.rs` and `.ts` loads the Rust trio AND the TypeScript trio plus shared guidance, because the Rust module must be verified byte-for-byte against its TypeScript oracle. Cargo markers (`Cargo.toml`/`Cargo.lock`) are evaluated only after OPENCODE surface detection, never as a cross-project surface signal.

YAML is a live OpenCode config-adjacent genre for command routers, command auto/confirm assets, and workflow contracts. A live-surface scan found 65 YAML/YML files under `.opencode/commands` and `.opencode/skills`, excluding `node_modules` and `dist`.

---

## 4. TEST CASES

| Context | Expected Surface | Reason |
| --- | --- | --- |
| `src/2_javascript/`, `package.json` | WEBFLOW | Webflow marker wins (no `.opencode/` target present) |
| HTML/CSS/JS with GSAP or Lenis | WEBFLOW | Vanilla animation web signal |
| CWD `.opencode/skills/sk-code` | OPENCODE | Skill/system code context |
| Changed `.opencode/agents/code.md` | OPENCODE | Target file under `.opencode/` |
| WEBFLOW marker (Lenis, GSAP) AND changed `.opencode/skills/sk-doc/scripts/preview-server.js` | **OPENCODE** | Mixed-marker repo: OPENCODE target/CWD takes precedence over WEBFLOW library marker |
| Prompt says `NOT Webflow no Webflow Designer` and asks for Motion.dev guidance | **UNKNOWN/N/A** | Explicit non-Webflow guard blocks WEBFLOW promotion |
| Root `package.json` with no `.opencode/` target | UNKNOWN | Generic Node.js is not owned |
| `go.mod` or `next.config.js` only | UNKNOWN | Go/NextJS placeholder routes were removed |

---

## 5. RELATED RESOURCES

- `references/smart-routing.md` — intent classification, resource maps, and load tiers
- `references/phase-detection.md` — Phase 1/2/3 lifecycle and per-phase resource loading
- `SKILL.md` section 2 — operator-facing summary of the routing contract
