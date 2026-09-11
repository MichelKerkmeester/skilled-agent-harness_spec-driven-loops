---
title: "Before and after: the goal system"
description: "What a session goal was before this packet, what it is now, and every file that moved."
trigger_phrases:
  - "goal before and after"
  - "what changed about goals"
  - "goal system comparison"
  - "goal unification summary"
importance_tier: "normal"
contextType: "general"
---
# Before and after: the goal system

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> One packet, eight phases. The packet's `goal.md` went from a file nothing read to the only goal every runtime reads.

---

## 1. THE SHORT VERSION

Every packet already had a `goal.md`. Every runtime already had a goal command. Nothing connected them.

The file sat in the packet. The runtime kept its own copy in a hidden JSON store. The two drifted apart the moment either one changed, and nobody noticed, because no check compared them.

Now the file is the goal. The store holds a pointer to it and nothing else.

---

## 2. SIDE BY SIDE

| | Before | After |
|---|---|---|
| **Where the goal lives** | A per-session JSON record under `.opencode/skills/.state/goal/`, keyed by a hash of workspace, runtime and session | The bound packet's `goal.md`, read from disk every turn |
| **What the store holds** | The whole directive | A pointer to the packet, liveness and telemetry |
| **Editing the file** | Changed nothing the model saw | Changes what the model sees next turn |
| **What gets sent to chat** | The full file text, frontmatter included | The durable slice only, frontmatter stripped |
| **Who decides where frontmatter ends** | Each caller, separately | One shared module, imported by both implementations |
| **Resend on change** | Prose instruction, no code | A hash of the durable slice fires it; log edits never do |
| **Reminder while unset** | Nothing | One line rides every injected turn, and work never stops |
| **Size checks** | None, after an earlier rule was deleted | Warns past 3000 characters, fails past 4000 |
| **Binding rows** | Could name a child goal that was never written | Fails validation |
| **Runtimes that reach the goal** | OpenCode only; Cursor refused, Devin had been removed | OpenCode, Pi, Cursor and Devin read the same file |
| **Claude Code and Codex** | Native commands, disconnected from packets | Native commands kept, fed through the speckit workflows |

---

## 3. WHY THE OLD SHAPE HURT

Three failures came out of the same root.

**The 4000-character cap ate the wrong end.** Instructions said to paste the whole file, so roughly twenty-six lines of bookkeeping went in first. Truncation then took the completion criteria off the tail, which is the part that decides when the work is done.

**Nothing noticed drift.** A goal edited in the packet and a goal set in the runtime were two unrelated strings. Neither side could tell it was stale.

**Each runtime solved it alone.** Two implementations drew the frontmatter boundary in two places, so a fix in one left the other leaking.

---

## 4. WHAT THE SESSION DOES NOW

A session binds to exactly one packet. That packet's `goal.md` is the directive, nested when the packet is phased and singular when it is not.

When a decision, a binding row or a criterion changes, the agent rewrites the file, then resends the stripped slice in chat and names the command that records the resend on that runtime. While the goal stays unset, a one-line reminder rides every turn. Work continues throughout. Only the operator stops it.

Once set, the agent acknowledges in one line and moves on.

---

## 5. FILES THAT CHANGED

400 files in one commit. 338 of them are the packet's own documents, so 62 carry the behaviour.

| Area | Files | New | What moved |
|------|-------|-----|-----------|
| Goal hook core and adapters | 12 | 4 | The shared slice module and its tests, packet-backed read and write in the core, a Devin adapter that never existed |
| OpenCode plugin | 6 | 1 | Bind, unbind, resent, log and packet actions, a cache key that cannot collide, a cross-implementation parity test |
| system-spec-kit | 17 | 0 | Template, playbook, budget contract, two restored validator rules, hook registry, trigger index |
| OpenCode commands | 7 | 0 | Plan, implement, complete, resume and save learned when to bind, resend, remind and log |
| CLI hub documents | 8 | 1 | Per-runtime testing playbooks and the feature catalogue |
| Cursor, Pi, Devin surfaces | 4 | 1 | Injection adapters and the Devin hook registration |
| Root and shared docs | 8 | 0 | `AGENTS.md` posture rule, repository README, hook and plugin READMEs, injection contract |

### The pieces worth knowing by name

- `.opencode/hooks/goal/lib/goal-slice.cjs` is the one place the frontmatter boundary is drawn. Both the hook core and the OpenCode plugin import it, so they cannot disagree.
- `.opencode/hooks/goal/lib/goal-core.cjs` reads the packet file on every render and appends log rows under a lock that both sessions share.
- `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` holds the two checks that came back: the size budget and the missing binding child.
- `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json` carries the budget numbers, so the template, the playbook and the validator read one source.
- `.opencode/skills/.state/goal/README.md` records the demotion. The store was kept and narrowed, not deleted.

---

## 6. PROOF

All figures below were read from a run, not remembered.

| Gate | Result |
|------|--------|
| Goal hook suites | 124 passed, 0 failed |
| OpenCode goal plugin suites | 140 passed, 0 failed |
| Spec-doc validator suite | 27 passed |
| Packet strict validation | 9 folders, 0 errors |

Research came first: fifteen iterations, ten on DeepSeek and five on GLM, each citing line numbers in the real code. Three review passes and a hardening pass followed. Of twenty-seven advisories, twenty-two were fixed, two were kept as recorded decisions, one was rejected with evidence, and one stays open.

---

## 7. STILL OPEN

**The Devin prompt-submit merge rule.** Three hooks write `additionalContext` on the same event. Which one the host keeps needs a live Devin run to settle.

**The `AGENTS.md` posture block.** It is committed and serving. An operator read is still owed, because that file governs every session in the repository.
