---
name: deep-ai-council
description: Deep AI Council deliberation workflow for multi-seat planning, council artifact persistence, convergence checks, and packet-local ai-council outputs.
---

# Deep AI Council

The Deep AI Council skill owns council deliberation guidance, artifact persistence helpers, convergence references, and manual validation for the `@deep-ai-council` runtime agent. It is planning-only: council runs produce recommendations and packet-local `ai-council/**` artifacts, not application-code or spec-doc mutations.

---

## 1. WHEN TO USE

Use this skill when the task asks for multi-seat AI council deliberation, planning strategy comparison, council artifact persistence, council convergence checks, or recovery of packet-local `ai-council/**` outputs.

Do not use it for graph-backed council storage or graph MCP tools. Those are intentionally deferred to a later phase.

---

## 2. SMART ROUTING

### Resource Domains

- `references/` contains the council state format, artifact folder layout, seat diversity, output schema, convergence signals, and caller wiring.
- `scripts/` contains deterministic helpers for parsing council reports, writing packet-local artifacts, audit events, rollback support, and completion advisories.
- `assets/testing_playbook/` contains operator-facing manual validation scenarios.

### Intent Routing

| Intent | Signals | Load |
| --- | --- | --- |
| `COUNCIL_RUN` | council deliberation, strategy council, planning council | `references/seat-diversity-patterns.md`, `references/convergence-signals.md` |
| `ARTIFACT_PERSISTENCE` | persist council artifacts, ai-council state, council report parser | `references/folder-layout.md`, `references/output-schema.md`, `references/state-format.md`, `references/command-wiring.md` |
| `RECOVERY_OR_AUDIT` | council rollback, completion advisory, missing council_complete | `references/state-format.md`, `scripts/advise-council-completion.cjs`, `scripts/lib/rollback.js` |

### Router Contract

```text
Task mentions council deliberation?
  YES -> Load seat diversity + convergence references.
Task mentions persistence, report parsing, or ai-council artifacts?
  YES -> Load folder layout + output schema + state format + scripts.
Task mentions graph database, graph MCP, or coverage graph?
  YES -> STOP; graph support is out of scope for this skill phase.
```

---

## 3. HOW IT WORKS

1. Resolve the target spec folder before any council execution.
2. Select two or three distinct council seats with different reasoning lenses and, when real executors are available, different AI vantage targets.
3. Deliberate across independent proposals, adversarial critique, and convergence reconciliation.
4. Return a council report with required sections from `references/output-schema.md`.
5. Persist packet-local artifacts with `scripts/persist-artifacts.cjs` when the caller owns a write-capable context.
6. Verify completion with `scripts/advise-council-completion.cjs` and the append-only state rules in `references/state-format.md`.

---

## 4. RULES

### ALWAYS

- Keep council writes scoped to packet-local `ai-council/**` artifacts.
- Preserve the planning-only boundary; implementation remains with implementation agents.
- Use distinct strategy lenses and avoid simulated external AI claims unless clearly labeled.
- Append a `council_complete` event for completed persisted runs.
- Treat graph-backed storage, graph DBs, and graph MCP tools as out of scope.

### NEVER

- Write application code, authored spec docs, or files outside `ai-council/**` as part of a council run.
- Add backward-compatible old-name shims without concrete active-consumer evidence.
- Claim an external CLI or AI system participated unless it actually ran.
- Rewrite historical state rows; state evolution is additive-only.

### ESCALATE IF

- No packet/spec folder can be resolved for artifact persistence.
- Required report sections are missing and persistence would be lossy.
- A caller still depends on the old `multi-ai-council` runtime name and cannot be renamed.
- The request requires graph support or advisor regression/test finalization outside the current task boundary.

---

## 5. REFERENCES

- `references/folder-layout.md` — packet-local artifact tree and writer ownership.
- `references/output-schema.md` — markdown report contract parsed by the persistence helper.
- `references/state-format.md` — append-only JSONL event semantics.
- `references/seat-diversity-patterns.md` — seat lens and vantage diversity rules.
- `references/convergence-signals.md` — lightweight convergence and escape-hatch rules.
- `references/command-wiring.md` — caller-owned post-dispatch persistence patterns.
- `assets/testing_playbook/manual_testing_playbook.md` — manual validation scenarios.

---

## 6. SUCCESS CRITERIA

- Council requests route to `deep-ai-council` surfaces.
- Runtime mirrors use `@deep-ai-council` as the primary agent identity.
- Council references and scripts live inside this skill package.
- Scoped grep shows no active runtime/config dispatch references to `multi-ai-council`.
- Persistence helpers parse and write the existing council artifact contract without adding graph behavior.
