---
name: code-verify
description: Verification; Iron Law evidence; mutation/falsifier ritual.
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.0.0.0
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: code-verify, verify, verification, iron law, mutation test, falsifier -->

# Code Verify (verify)

`verify` is the verification MODE child of the `sk-code` family. It will own verification evidence, Iron Law checks, and mutation/falsifier ritual while consuming the shared surface-detection router.

---

## 1. WHEN TO USE

Use this mode when the request is to run or reason about verification evidence without mutating the workspace.

### When NOT to Use
- Use `code-implement` to write or refactor code.
- Use `code-quality` for author-side quality gates.
- Use `code-debug` when verification failures require root-cause repair.
- Use `code-review` for findings-first review output.

---

## 2. SMART ROUTING

Mode-internal routing will be authored later. This skeleton defers surface identity to the shared router and keeps verification workflow details out of the hub.

---

## 3. HOW IT WORKS

The verify workflow contract will be authored later. This packet is the placeholder for evidence sequencing, falsifier ritual, and verification output expectations.

---

## 4. RULES

### ALWAYS
- Keep verification workflow rules in this packet, not in the hub.

### NEVER
- Do not add a packet-local `graph-metadata.json`.

---

## 5. REFERENCES

- Hub: `../SKILL.md`.
- Registry: `../mode-registry.json`.
- Shared router placeholder: `../shared/README.md`.
