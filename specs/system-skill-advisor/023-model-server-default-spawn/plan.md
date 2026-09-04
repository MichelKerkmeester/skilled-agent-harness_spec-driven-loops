---
title: "Implementation Plan: skill-advisor model-server default spawn"
description: "Flip the launcher's spawn gate to default-on with a kill switch, and make the three socket resolvers fall back to the same short directory so the spawn works inside a worktree."
trigger_phrases:
  - "model server spawn plan"
  - "socket directory resolvers agree"
  - "demand listener lazy spawn"
  - "launcher supervision model server child"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: model server default spawn

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS launcher scripts, TypeScript vitest tests |
| **Framework** | None |
| **Storage** | Socket, pid, lock and give-up files under `/tmp/system-hf-embed` |
| **Testing** | vitest in the advisor and spec-kit trees, plus a live foreground launcher run |

### Overview
The launcher reads the flag into three states: default-on, explicit-on and off. Default-on arms the lazy demand listener and degrades with a log line when the supervision library is absent; explicit-on keeps that case fatal. The launcher stops handing the deleted memory database directory to the supervision control, and the supervision library and the model-server child drop the same stale fallback, so all three resolve the socket to the embedding client's short default.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Launcher-supervised sibling process behind a lazy demand listener

### Key Components
- **Launcher setting reader**: turns the flag into default-on, explicit-on or off, exported for tests
- **Supervision control**: binds the demand listener, spawns the child on the first request, keeps its files beside the socket
- **Model server child**: listens where the client and the supervision look by default

### Data Flow
An embedding client connects to the shared socket. Before the model server exists the launcher's demand listener answers 503 loading, releases the socket and spawns the child. The child binds the same path, loads the model and serves embeds; the launcher supervises it with the RSS watchdog and the crash-loop guard.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A unit test covers the setting semantics. The live proof ran the launcher in the foreground from the worktree with the flag unset, sent a demand request on the shared socket, and observed the child bind the same path. The model load then failed on the host's missing `onnxruntime-common`, which is outside this change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The host needs `onnxruntime-common` installed under the shared transformers package for the model to load; the lockfile lists it and the main checkout's install lacks it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Set `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=0` to turn the spawner off without a code change, or revert the single commit.
<!-- /ANCHOR:rollback -->

---

