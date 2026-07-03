---
name: code-review
description: Findings-first review; security/correctness baseline; checklists; output contract; PR-state gates.
allowed-tools: [Read, Bash, Grep, Glob, Write]
version: 1.0.0.0
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: code-review, review, findings-first, security review, correctness, pr review -->

# Code Review (review)

`review` is the findings-first review MODE child of the `sk-code` family. It will own review output, security/correctness baseline, checklists, and PR-state gates while using only its review-result cache for writes.

---

## 1. WHEN TO USE

Use this mode when the request is a code review, PR review, security/correctness review, or findings-first quality assessment.

### When NOT to Use
- Use `code-implement` to apply accepted fixes.
- Use `code-quality` for author-side quality gates before review.
- Use `code-debug` to root-cause a failing symptom.
- Use `code-verify` to collect verification evidence without review findings.

---

## 2. SMART ROUTING

Mode-internal routing will be authored later. This skeleton defers surface identity to the shared router and keeps review workflow details out of the hub.

---

## 3. HOW IT WORKS

The review workflow contract will be authored later. This packet is the placeholder for findings-first output, cache behavior, checklists, and PR-state gates.

---

## 4. RULES

### ALWAYS
- Keep review workflow rules in this packet, not in the hub.

### NEVER
- Do not add a packet-local `graph-metadata.json`.

---

## 5. REFERENCES

- Hub: `../SKILL.md`.
- Registry: `../mode-registry.json`.
- Shared router placeholder: `../shared/README.md`.
