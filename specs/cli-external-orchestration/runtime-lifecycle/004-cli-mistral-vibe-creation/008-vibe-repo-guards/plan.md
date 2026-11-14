---
title: "Implementation Plan: Phase 8: vibe-repo-guards"
description: "Classify the 21 OpenCode plugins, settle Vibe's hook wire format with one fixture hook, then port the deny-capable guards as strict pre_tool hooks and post-edit quality as a strict post_tool hook."
trigger_phrases:
  - "vibe repo guards plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: vibe-repo-guards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TOML hook config and Node hook scripts |
| **Framework** | Mistral Vibe 3.1.2 hooks: seven types, `strict` only on `pre_tool`, `post_tool` and `pre_agent` |
| **Storage** | None. Fixture sessions write `export.json` under a scratch `--output-dir` |
| **Testing** | Keyed `vibe -p` fixture sessions, read where the wire-format fixture shows a deny |

### Overview
First, every plugin gets a verdict, so the port list comes from the table and not from memory. Next, one fixture hook records what Vibe sends and how a deny travels back. Only then are the guards ported, each one reusing the Claude-format hook scripts this repository already runs where Vibe's `claude_code` protocol accepts them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `.vibe/config.toml` from phase 006 exists and `vibe config schema` accepts it under `--trust`
- [ ] `ls .opencode/plugins/*.js | wc -l` prints 21

### Definition of Done
- [ ] The classification table holds 21 rows
- [ ] Each ported guard's violation fixture shows its deny and its clean fixture shows the call completing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declarative hook bundle.

### Key Components
- **`.vibe/hooks.toml`**: declares each guard with `name`, `type`, `command`, `match` and `strict`. Without it Vibe runs no repository guard.
- **`.vibe/plugins/repo-guards/`**: the guard scripts and their fixtures. Its prior art is `.dsh/plugins/repo-guards/`, the same guards re-expressed for dsh.

### Data Flow
Before a tool call, Vibe runs each matching `pre_tool` hook with the call as input. How a strict hook's deny travels back, and where a session records it, is what the wire-format fixture settles. After a tool call, the `post_tool` quality hook reads the edited file. `STRICT_HOOK_TYPES` in `vibe/core/hooks/models.py` lists `post_tool` as a type whose failing hook may block.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup lists the 21 plugins and writes their classification table. Implementation settles the wire format with one fixture hook, then ports each deny-capable guard and post-edit quality into `.vibe/hooks.toml` and `.vibe/plugins/repo-guards/`. Verification runs a violating and a clean fixture session per guard and reads each deny where the wire-format fixture found it. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each guard gets two keyed `vibe -p` runs with a disposable `VIBE_HOME`, a roster `--model`, `--trust` and `--output-dir`, started from a folder inside the checkout that is not its root. The violating run must show the deny where the wire-format fixture recorded it, and the clean run must show the call completing. Exit codes are not evidence, because a denial still exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`vibe` 3.1.2 on PATH, Node for the guard scripts, `jq` to read session output, and `MISTRAL_API_KEY` for every fixture session. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a strict hook blocks clean calls in a way its fixture did not catch. Remove that guard's entry from `.vibe/hooks.toml`, which leaves the others running, or revert the phase commit to remove the whole bundle.
<!-- /ANCHOR:rollback -->

---
