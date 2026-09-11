---
title: "Before/After Record: the goal system"
description: "What a session goal was before the unification packet, what it is now, and which files carry the difference."
trigger_phrases:
  - "goal before after"
  - "what changed about goals"
  - "goal system comparison"
  - "goal unification record"
importance_tier: "normal"
contextType: "general"
---
# Before/After Record: the goal system

<!-- SPECKIT_TEMPLATE_SOURCE: before-after | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Compares the session goal as it worked before this packet with the packet-bound goal every runtime now reads, for a reader who was not in the room.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** specs/system-speckit/033-system-speckit-v4/036-goal-unification
**Status:** Accepted
**Date:** 2026-09-11
**Owner:** Michel Kerkmeester
**Related packet:** specs/system-speckit/033-system-speckit-v4/036-goal-unification
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:summary -->
## 2. SUMMARY

**What changed:** The packet's `goal.md` became the single source of goal state for every runtime. The per-session store was narrowed to a pointer, the frontmatter stopped reaching chat, and a changed goal now resends itself.

**Why it changed:** Every packet already had a `goal.md` and every runtime already had a goal command, but no code connected them. The file sat in the packet while the runtime kept its own copy in a hidden store, and the two drifted apart the moment either changed. No check compared them, so nobody noticed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:comparison -->
## 3. COMPARISON

**Where the goal lives**
Before: a per-session JSON record under `.opencode/skills/.state/goal/`, keyed by a hash of workspace, runtime and session. Nothing read the packet document.
After: the bound packet's `goal.md`, read from disk on every render. The store keeps a pointer to it, liveness and telemetry, and never the directive.

**Editing the file**
Before: changed nothing the model saw, because the runtime was serving its own copy.
After: changes what the model sees on the next turn. A bound record whose document is gone injects nothing rather than a stale copy.

**What reaches chat**
Before: the instructions said to resend the full text, which included roughly twenty-six lines of bookkeeping. That bookkeeping consumed the character budget and truncation then took the completion criteria off the tail.
After: only the durable slice, frontmatter stripped. One shared module draws that boundary for both implementations, so a fix in one cannot leave the other leaking.

**How criteria are carried**
Before: flattened into the single objective line, where a budget cut landed mid-requirement.
After: their own labelled field, one per line. A budget drops whole criteria and says how many it left behind.

**Resend and reminder**
Before: prose instruction with no code behind it.
After: a hash of the durable slice fires the resend, so a decision, a binding row or a criterion triggers it and a log edit never does. A one-line reminder rides every injected turn while the copy is behind, and work never stops for it.

**Size and shape checks**
Before: none. An earlier rule had been deleted, and the playbook still linked to it.
After: the validator warns past 3,000 durable characters and fails past 4,000, and refuses a binding row naming a child that does not exist inside the packet.

**Runtime coverage**
Before: OpenCode only. Cursor refused for want of session identity and Devin had been removed.
After: OpenCode, Pi, Cursor and Devin all resolve the same file. Cursor and Devin inject only. Claude Code and Codex keep their native goal command and are fed through the speckit workflows.
<!-- /ANCHOR:comparison -->

---

<!-- ANCHOR:net-effect -->
## 4. NET EFFECT

**Behavior:** Editing a packet's `goal.md` is now the way to change what every runtime is working toward. The agent resends the stripped slice unprompted when the durable part changes, names the command that records the resend on that runtime, and keeps reminding without halting.

**Operational impact:** 400 files in one commit, of which 338 are the packet's own documents. The 62 that carry behaviour split as follows: the goal hook core and adapters (12 files, 4 new), the spec-kit template, validator and playbook (17), the OpenCode plugin (6, 1 new), the OpenCode speckit commands (7), the CLI hub documents and catalogues (8, 1 new), root and shared documents (8), and the Cursor, Pi and Devin surfaces (4, 1 new). Four pieces are worth knowing by name: `goal-slice.cjs` draws the frontmatter boundary, `goal-core.cjs` holds the packet-backed read and the shared log lock, `spec-doc-structure.ts` holds the two restored checks, and `spec-kit-docs.json` holds the budget numbers that keep template, playbook and validator agreeing.

**Follow-up:** None outstanding. The four decisions the hardening phase left open were settled by the operator and built, and the Devin host merge rule was settled by a live run.
<!-- /ANCHOR:net-effect -->

---

<!-- ANCHOR:notes-caveats -->
## 5. NOTES & CAVEATS

The legacy store was demoted rather than deleted. It holds one tracked `README.md` and no records on this checkout, because other machines may still carry records under either of two old key schemes and that README is their migration note.

One review finding was rejected with evidence rather than fixed. Rooting the packet lock in the record-store override was implemented, probed and reverted: an end-to-end run showed the lock split and four of ten rows lost. A regression test now pins cross-store contention.

The Devin host concatenates `additionalContext` across hooks, confirmed by a live run against CLI 3000.6.14. That is host behaviour rather than a documented contract, so it deserves a re-check after a Devin upgrade.
<!-- /ANCHOR:notes-caveats -->
