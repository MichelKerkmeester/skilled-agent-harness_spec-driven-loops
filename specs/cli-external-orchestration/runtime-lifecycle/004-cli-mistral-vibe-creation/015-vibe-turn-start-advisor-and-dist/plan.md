---
title: "Implementation Plan: Phase 15: vibe-turn-start-advisor-and-dist"
description: "Add a pre_agent turn-start composer with the skill advisor brief as its first part, and a non-strict post_tool dist-freshness hook. Both answer through additional_context, fail open, and are proven by unit tests and one keyed run."
trigger_phrases:
  - "vibe turn start advisor and dist plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: vibe-turn-start-advisor-and-dist

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules; one TypeScript constant; the Python dist checker |
| **Framework** | Vibe 3.1.2 `pre_agent` and `post_tool` hooks; the shared skill advisor handler and its directive lifecycle |
| **Storage** | The advisor's existing file-backed directive store. Nothing new |
| **Testing** | `node --test` unit tests and one keyed `vibe -p` run with the rendered home hooks |

### Overview
The composer copies `session-start.mjs`: it parses stdin, runs a fixed list of part builders, each in its own try/catch, and joins the non-empty results into one `additional_context`. Its first part maps the Vibe `pre_agent` payload to the advisor handler's input, under runtime `vibe`. The dist hook runs `check-dist-staleness.sh` in single-file mode for an edit, and `--all` with rebuild off for a matched shell command. It returns any banner as `additional_context`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node --test .skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs` prints `fail 0`, so the shared handler works before reuse
- [ ] `python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh --all` exits 0

### Definition of Done
- [ ] `node --test .skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs .vibe/plugins/repo-guards/tests/dist-freshness.test.mjs` prints `fail 0`
- [ ] A keyed run shows both contexts in its journal
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ordered fail-open composer.

### Key Components
- **Turn-start composer** (`turn-start.mjs`): Vibe runs `pre_agent` hooks one after another, and the message waits for them. One process carrying several parts costs less than several entries. Phases 016 to 019 add parts here instead of new entries.
- **Advisor part** (`system-skill-advisor/hooks/vibe/prompt-advisor.mjs`): the payload mapping and the skip rules. Without it the composer has nothing to send.
- **Dist hook** (`dist-freshness.mjs`): a separate non-strict entry, so its fail-open path never shares a process with the strict `post-edit-quality` entry, whose failure blanks the result.

### Data Flow
The operator sends a prompt. Vibe runs `spec-gate-classify`, then the composer, which builds the advisor part from `prompt` and `session_id` and returns `additional_context`. Vibe adds that text after the message, for the model only. On a `write_file` or `edit`, Vibe runs the strict post-edit check and the dist hook. The dist hook reads `tool_input.file_path`, runs the checker, and appends any banner to the tool result.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the shared advisor handler and the dist checker both run, and records the advisor's current label list. Implementation adds the `vibe` label and rebuilds, then adds the composer, the advisor part, the dist hook, their tests and the two `hooks.toml` registrations. Verification runs the unit tests, the renderer test, a latency measurement against a 1500 ms p95 limit, two keyed runs (one main session for the advisor, one child dispatch for the dist warning) and the dedupe check. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`turn-start.test.mjs` spawns the composer with an injected advisor stub and checks six cases: a main-session prompt gets the stub brief, a blank prompt gets nothing, a child gets nothing, a subagent gets nothing, a throwing part leaves the others intact, and malformed stdin exits 0 with no output. `dist-freshness.test.mjs` points the hook at a fixture checker and checks three cases: an edit warns, a matched shell command warns, an unmatched one stays silent. Two keyed runs then show the contexts in the journal: a main-session run for the advisor brief, because the advisor part skips children, and the documented child dispatch for the dist warning, because only a child may write without the spec gate denying it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node.js, Python 3, the advisor runtime's build (`npm run build` in `.skilled/skills/system-skill-advisor/runtime`), `vibe 3.1.2` and `MISTRAL_API_KEY` for the keyed run. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: messages stall on the composer, or a dist warning floods every edit. Delete the `turn-start` or `dist-freshness` entry from `.vibe/hooks.toml`. That turns the hook off in the next session without touching code. Then revert the phase's commit.
<!-- /ANCHOR:rollback -->

---
