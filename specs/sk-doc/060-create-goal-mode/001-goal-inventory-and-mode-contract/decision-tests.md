---
title: "Decision Tests: Should This Packet Goal Be Authored?"
description: "Four pre-write tests distinguish goal-file content from session state, classify the target packet, choose revise versus add and enforce parent-first amendments."
trigger_phrases:
  - "author a packet goal"
  - "add goal.md to a phase parent"
  - "bind or resend a session goal"
  - "child goal parent amendment"
importance_tier: important
contextType: reference
version: 1.0.0.0
---
# Decision Tests: Should This Packet Goal Be Authored?

Run these tests before writing. They decide whether the request belongs to packet-goal authoring and where it must go instead (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/tasks.md:51-53`; `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:103-123`).

---

## 1. FILE CONTENT OR SESSION STATE?

**Ask:** Is the request about authoring or revising a packet's `goal.md`, or setting, binding, injecting or resending a session objective? The packet document and the runtime's session string are separate objects (`.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:117-123`; `.skilled/hooks/goal/README.md:32,65-67`).

- **Pass:** “Write a `goal.md` for this existing packet from its spec and acceptance criteria.” Continue with packet-goal authoring (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:73-76`).
- **Redirect:** “Set or resend the goal for my current session.” Do not write a packet file; route to the goal hooks or the host's native goal command and hand over the chat slice where required (`.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:80-95,117-123`; `.skilled/hooks/goal/goal-plugin.md:155-170`).

---

## 2. DOES THE PACKET EXIST, AND WHAT IS ITS ROLE?

**Ask:** Is there an existing target packet, and is it top-level, a phase parent or a nested phase child? The phase-child classifier checks whether the parent directory contains `spec.md`; the scan otherwise classifies a packet with phase children as a phase parent and one without them as top-level (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/goal-corpus-scan.cjs:37-64`).

- **Pass:** “Revise the top-level goal in this existing packet.” Confirm the packet path and classify the goal role before choosing its structure (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:73-76,106-108`).
- **Redirect:** “Create a new phased spec packet and its goals.” Route packet creation and phase planning through system-spec-kit first; sk-create-goal authors goal files from an existing packet's source documents (`.skilled/skills/system-spec-kit/SKILL.md:438-441`; `specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:73-76`).

---

## 3. DOES A GOAL ALREADY EXIST?

**Ask:** If the target packet exists, does `goal.md` already exist? An existing goal means revise it; an existing packet without a goal means add or retrofit one; a missing packet is packet planning or scaffolding, not goal-file authoring (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:77,109,175-177,206`).

- **Pass:** “Add a phase-parent `goal.md` to this existing packet; it has no parent goal yet.” Treat it as a retrofit and render the phase-level contract (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:77,109,206`).
- **Redirect:** “Create the packet and its phase map while adding the goal.” Stop goal authoring until the packet exists and its authoritative phase map and source documents are available (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:45-50,73-79,175-177`).

---

## 4. IS THE CHILD CHANGE A PARENT AMENDMENT?

**Ask:** Would the requested child-goal change alter a parent decision or parent criterion? If so, the parent changes first and its updated chat slice is resent; a phase-local change that does not affect either needs no parent resend (`specs/sk-doc/060-create-goal-mode/goal.md:65-70`; `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:93-96`).

- **Pass:** “Change this child's goal in a way that changes a parent decision; amend the parent first, then update the child and print the parent's new chat slice.” Follow parent precedence and the resend rule (`specs/sk-doc/060-create-goal-mode/goal.md:75-91`; `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:80-95`).
- **Redirect:** “Change the child goal so it overrides the parent decision, but leave the parent untouched.” Refuse that ordering and redirect to a parent-first amendment before editing the child (`specs/sk-doc/060-create-goal-mode/goal.md:65-70,86-91`; `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:93-95`).
