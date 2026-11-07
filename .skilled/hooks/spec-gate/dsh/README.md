---
title: "Spec Gate Hooks: DSH Adapter Links"
description: "Relative links to the DSH Gate-3 classifier and enforcement adapters in system-spec-kit."
trigger_phrases:
  - "spec gate dsh hook"
  - "dsh gate 3 classifier"
  - "dsh spec gate enforce"
version: 1.0.0.0
---

# Spec Gate Hooks: DSH Adapter Links

---

## 1. OVERVIEW

`dsh/` holds the DSH links for the Spec Gate concern. Both files are relative symlinks to the adapters in `system-spec-kit/runtime/hooks/dsh/`, and the `repo-guards` bundle imports the same real files through its own links. The adapters run on `agent/pre-step` and `tools/pre-execute`. Classify reads only the message the operator typed and adds the deferral notice. Enforce asks at the first undelivered write or edit and denies by the shared verdict.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `spec-gate-classify.mjs` | `agent/pre-step` | Link to `system-spec-kit/runtime/hooks/dsh/spec-gate-classify.mjs`. Sanitizes the operator prompt, runs the shared classifier and returns the step with one deferral notice. | Fails open. `ERROR_POLICY` is `fail-open` and the step continues unchanged. |
| `spec-gate-enforce.mjs` | `tools/pre-execute` on `write`, `edit`, `apply_patch` and `bash` | Link to `system-spec-kit/runtime/hooks/dsh/spec-gate-enforce.mjs`. Returns `{ kind: 'deny' }` on deny and `{ kind: 'ask' }` at the first undelivered write or edit. | Fails closed. A core failure returns `{ kind: 'deny' }` with the shared guard unavailable reason. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Spec Gate concern, its policy core and its delivery table.
- [`../../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`](../../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs): the shared policy core both adapters call.
- [`../tests/dsh-spec-gate.test.mjs`](../tests/dsh-spec-gate.test.mjs): the adapter tests.
