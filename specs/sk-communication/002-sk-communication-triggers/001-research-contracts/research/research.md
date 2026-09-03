---
title: "002 sk-communication-triggers — Phase 001 Research & Contracts"
trigger_phrases: []
---
# 002 sk-communication-triggers — Phase 001 Research & Contracts

Verified findings grounding the two trigger commands. Every claim below was read
from the live tree (file:line where load-bearing). Engine-model decision (Fork 1)
is still open pending operator confirmation; everything else is settled.

---

## 1. CONFIRMED FACTS

### 1.1 sk-communication is OFF by default, opt-in per machine
- Gate: `isProjectionEnabled()` — `cli-communication-projection/src/config/enablement.ts:56`.
- Two opt-in sources (env wins, else local file):
  - Env var `COMMUNICATION_PROJECTION_ENABLED` (`enablement.ts:9`); truthy = `1|true|on` (`enablement.ts:29-31`).
  - Git-ignored `enablement.local.json` `{ "enabled": true }` at package root (`enablement.ts:12,33`).
- Every activation path consults it first: `src/wrapper/run.ts:35`, `src/runtime/project-message.ts:116`.
- Skill is held OUT of advisor routing on purpose (route-exclusions denylist) — invoked by hand.

### 1.2 The runnable flow (what command 2 drives)
- Bin: `cli-output-wrapper` → `bin/cli-output-wrapper.mjs` (package.json `bin`).
- Shape: `cli-output-wrapper <runtime> [-- <command...>]` — it WRAPS a target CLI command,
  captures its output, projects it, re-renders. Not a standalone "rewrite this text" tool.
- Requires `dist/` (imports `../dist/index.js`, `../dist/wrapper/index.js`) → `npm run build` first.
- When `!isProjectionEnabled()` → prints "projection disabled; passing through" and runs the
  target unmodified (`cli-output-wrapper.mjs:71-75`). This is the byte-exact passthrough guarantee.

### 1.3 Provider engines that EXIST today
- `src/providers/` exports `executeProviderRoute`, `getProviderAdapter`, registry, presets (`src/providers/index.ts`).
- Presets: `createLlamaCppModelRecord`, `createOllamaModelRecord` (LOCAL), `createOpenCodeGoDeepSeekV4FlashRecord` (HOSTED).
- **There is NO cli-* skill provider family.** grep for `cli-|child_process|spawn` in `src/providers/*.ts` → none.
  → Routing a rewrite through cli-codex/cli-devin/etc. is NOT a wired feature today.
- Prompt/rewrite contract: `src/contracts/prompt.ts` (source for command 1's in-context rubric).

### 1.4 The pipeline (frozen invariants)
```
canonical event/transcript ─ unchanged persistence + model context
  └ assemble → protect spans → privacy route (classify+consent BEFORE ranking)
    → provider rewrite (local|hosted) → fidelity validate → render:
      atomic replace | append | sidecar | original-only
```
- Canonical bytes never mutated; rejected candidate returns exact-original.
- No silent local→hosted egress; privacy runs before ranking.
- Two tiers: full-projection (client-owned, atomic) vs safe-native (append/sidecar/original-only).

### 1.5 Command authoring standard (sk-doc/sk-create-command)
- Canonical location: `.opencode/commands/<name>.md` (root) or `.opencode/commands/<ns>/<action>.md`.
- Kebab-case `^[a-z0-9]+(?:-[a-z0-9]+)*$`; underscores rejected.
- Frontmatter: `description` (single-line, ≤110 chars), `argument-hint` when input expected, least-priv `allowed-tools`.
- Mandatory input gate immediately after frontmatter for any required `<arg>`; forbids inference; waits for input.
- H2 = `## N. SECTION-NAME` (full integers). Router type when 2+ of {Router Contract, Owned Assets, Mode Routing, Execution Targets} or a Presentation Boundary; router core = OWNED ASSETS + PRESENTATION BOUNDARY.
- Validate: `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <file> --type command` (exit 0 required),
  `check_authored_name_kebab.py`, `extract_structure.py`.
- Comment/body hygiene: no design rationale, no spec/packet ids in the shipped command body.

### 1.6 Cross-runtime mirror model
- `.opencode/commands/` is the source of truth. Other runtimes hold SYMLINKS:
  - `.claude/commands/interface/design.md -> ../../../.opencode/commands/interface/design.md` (verified).
  - `.cursor/commands/interface-design.md -> ../../.opencode/commands/interface/design.md` (namespace flattened with `-`).
  - `.codex/prompts/` mirrors similarly.
- For ROOT commands the symlink targets are:
  - `.claude/commands/rewrite-response.md -> ../../.opencode/commands/rewrite-response.md`
  - `.cursor/commands/rewrite-response.md -> ../../.opencode/commands/rewrite-response.md`
  - `.codex/prompts/rewrite-response.md -> ../../.opencode/commands/rewrite-response.md`
- No single command-symlink generator script was found; mirrors are created to match the convention.

### 1.7 cli-* roster (external-engine candidates)
Exactly 6: `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-opencode`, `cli-pi`
(`.opencode/skills/cli-external-orchestration/cli-*/`). This is the "all CLI skills" set.

### 1.8 Dispatch contract (implementation engine)
- devin: INSTALLED (`~/.local/bin/devin`) + "Logged in" — pre-flight PASSES.
- Gemini 3.7 Flash HIGH = `gemini-3-7-flash-high` — in the enforced allowlist (`fanout-run.cjs:1971`).
- GLM fallback = `glm-5-2` (no dedicated "-high" tier; effort via `--permission-mode`).
- Orchestrated dispatch delegates to `system-deep-loop/runtime/scripts/fanout-run.cjs` (executor kind `cli-devin`);
  do NOT build a packet-local adapter.
- Personas travel in the PROMPT (installed devin does not reliably dispatch custom `.claude/agents/*` via run_subagent):
  - MARKDOWN persona → instruct child to load `sk-doc`/`sk-create-command`, template-first (`.opencode/agents/markdown.md`).
  - CODE persona → instruct child to load `sk-code`, surface-detect, run its verification (`.opencode/agents/code.md`).
- Single-dispatch discipline: one cli-* dispatch at a time unless operator authorizes N parallel.
- Pass spec folder as pre-approved (skip Gate 3) in every dispatch prompt.

---

## 2. CONFIRMED DESIGN DECISIONS

- **Command names (LOCKED):**
  - `/rewrite-response` → command 1 (self-rewrite, no LLM). Root command.
  - `/rewrite-response-by-external-agent` → command 2 (engine choice). Root command.
- **Command 1 is engine-independent** — pure in-context prompt command, no package code, no provider.
  It loads sk-communication's plain-English rubric (derived from `src/contracts/prompt.ts` + SKILL plain-English
  goals) and instructs the active AI to re-emit its prior turn transformed. Canonical bytes untouched.
- **ON/OFF state store (proposed):** process-scoped `COMMUNICATION_PROJECTION_ENABLED=1` for the single
  invocation; flip-off guaranteed via shell `trap ... EXIT` / `finally` so it clears even on error. The env var
  naturally dies with the command's subprocess; nothing persists to `enablement.local.json`.

---

## 3. OPEN FORKS

### Fork 1 (BLOCKING) — command 2 rewrite-engine model
Operator leaning: **New package provider**. Options:
- **(A) Command-level routing** — command 2 routes the rewrite to the chosen engine itself; package untouched.
- **(B) New package provider** — add a cli-* provider family in `src/providers/` bridging to `fanout-run.cjs`,
  so the projection pipeline dispatches to cli-* skills natively. Touches shipped runtime; needs `npm run check`.
  Must declare egress posture + fail closed on unknown (privacy invariant).
- **(C) Existing providers only** — drive current local vs hosted + native; "CLI skill" = hosted preset.

Sub-question if (B): does the user pick just the cli-* SKILL (default model) or SKILL + model?

### Fork 2 — "all CLI skills" scope
Operator leaning: **All 6**. (Alt: curated subset cli-devin/cli-codex/cli-opencode.)

### Fork 3 (defaultable) — self-rewrite display for command 1
Proposed: emit the improved version, briefly labeled as a rewrite. (Alt: before + after.)

---

## 4. PROPOSED PHASE TREE (pending Fork 1)
- 001 research-contracts (this) — settled facts + contracts.
- 002 rewrite-response command (`/rewrite-response`) — engine-independent; can proceed now.
- 003 rewrite-response-by-external-agent command — shape depends on Fork 1.
- 004 SKILL.md update — document both commands + ON/OFF ceremony; depends on Fork 1.
- 005 verification — validate_document.py, validate.sh --strict, npm run check (if package touched).
