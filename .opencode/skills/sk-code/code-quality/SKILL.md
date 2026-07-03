---
name: code-quality
description: Quality gate; P0/P1/P2 author checks; comment hygiene; surface checklists.
allowed-tools: [Read, Edit, Bash, Grep, Glob]
version: 1.0.0.0
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: code-quality, quality gate, comment hygiene, surface checklists, p0, p1, p2 -->

# Code Quality (quality)

`quality` is the author-side quality MODE child of the `sk-code` family. It will own quality gates, comment hygiene, and surface checklists while consuming the shared surface-detection router.

---

## 1. WHEN TO USE

Use this mode when the request is to apply author-side quality checks, surface checklists, or comment-hygiene review after code changes.

### When NOT to Use
- Use `code-implement` to write or refactor code.
- Use `code-debug` to trace a failing symptom to root cause.
- Use `code-verify` to collect verification evidence.
- Use `code-review` for findings-first review output.

---

## 2. SMART ROUTING

Mode-internal routing will be authored later. This skeleton defers surface identity to the shared router and keeps quality workflow details out of the hub.

---

## 3. HOW IT WORKS

The quality workflow contract will be authored later. This packet is the placeholder for author-side check sequencing, resources, and evidence expectations.

---

## 4. RULES

### ALWAYS
- Keep quality workflow rules in this packet, not in the hub.

### NEVER
- Do not add a packet-local `graph-metadata.json`.

---

## 5. REFERENCES

- Hub: `../SKILL.md`.
- Registry: `../mode-registry.json`.
- Shared router placeholder: `../shared/README.md`.
