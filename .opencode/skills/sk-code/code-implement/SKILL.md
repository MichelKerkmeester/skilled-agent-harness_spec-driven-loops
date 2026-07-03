---
name: code-implement
description: Research and implementation; WEBFLOW/OPENCODE authoring; Motion.dev overlay consumption.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task]
version: 1.0.0.0
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: code-implement, implement, implementation, webflow, opencode, motion.dev, surface-router -->

# Code Implement (implement)

`implement` is the implementation MODE child of the `sk-code` family. It will own research, implementation, and surface-aware authoring while consuming the shared surface-detection router.

---

## 1. WHEN TO USE

Use this mode when the request is to write, modify, refactor, or build code in the detected surface.

### When NOT to Use
- Use `code-quality` for author-side quality gates after implementation.
- Use `code-debug` for root-cause debugging of failures.
- Use `code-verify` for verification evidence without workspace mutation.
- Use `code-review` for findings-first review output.

---

## 2. SMART ROUTING

Mode-internal routing will be authored later. This skeleton defers surface identity to the shared router and keeps implementation workflow details out of the hub.

---

## 3. HOW IT WORKS

The implement workflow contract will be authored later. This packet is the placeholder for implementation-specific sequencing, resources, and evidence expectations.

---

## 4. RULES

### ALWAYS
- Keep implementation workflow rules in this packet, not in the hub.

### NEVER
- Do not add a packet-local `graph-metadata.json`.

---

## 5. REFERENCES

- Hub: `../SKILL.md`.
- Registry: `../mode-registry.json`.
- Shared router placeholder: `../shared/README.md`.
