---
name: code-debug
description: Root-cause debugging; error recovery; escalation discipline.
allowed-tools: [Read, Edit, Bash, Grep, Glob, Task]
version: 1.0.0.0
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: code-debug, debug, root cause, fix bug, error recovery, escalation -->

# Code Debug (debug)

`debug` is the debugging MODE child of the `sk-code` family. It will own root-cause investigation, error recovery, and escalation discipline while consuming the shared surface-detection router.

---

## 1. WHEN TO USE

Use this mode when the request is to diagnose a failure, fix a bug, recover from errors, or trace symptoms to root cause.

### When NOT to Use
- Use `code-implement` for planned implementation work.
- Use `code-quality` for author-side quality gates.
- Use `code-verify` for verification evidence after a fix.
- Use `code-review` for findings-first review output.

---

## 2. SMART ROUTING

Mode-internal routing will be authored later. This skeleton defers surface identity to the shared router and keeps debugging workflow details out of the hub.

---

## 3. HOW IT WORKS

The debug workflow contract will be authored later. This packet is the placeholder for root-cause sequencing, recovery rules, and evidence expectations.

---

## 4. RULES

### ALWAYS
- Keep debugging workflow rules in this packet, not in the hub.

### NEVER
- Do not add a packet-local `graph-metadata.json`.

---

## 5. REFERENCES

- Hub: `../SKILL.md`.
- Registry: `../mode-registry.json`.
- Shared router placeholder: `../shared/README.md`.
