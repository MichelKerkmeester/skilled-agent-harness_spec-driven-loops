# Iteration 47 — kimi

**Angle:** Doctor command assets still reference retired context-index__*.sqlite glob in presentation text and shell examples

**Findings:** 6

- **[P1] drift** `.opencode/commands/doctor/assets/doctor_memory.yaml:24` — Memory doctor invariant text names retired per-profile DB glob
  - evidence: profile DBs (ollama, hf-local, voyage, and openai profiles matching context-index__*.sqlite) as the memory-owned stores
  - fix: Replace 'context-index__*.sqlite' with 'context-index.sqlite and vectors/context-vectors__*.sqlite'.
- **[P1] dead** `.opencode/commands/doctor/assets/doctor_memory.yaml:153` — Memory doctor discovery shell example uses non-matching retired glob
  - evidence: Bash: stat -f '%m %z' database/context-index__*.sqlite (mtime + size for present profile DBs)
  - fix: Change the glob to 'database/context-index.sqlite database/vectors/context-vectors__*.sqlite'.
- **[P1] dead** `.opencode/commands/doctor/assets/doctor_causal-graph.yaml:161` — Causal-graph doctor discovery shell example uses non-matching retired glob
  - evidence: Bash: stat -f '%m %z' mcp_server/database/context-index__*.sqlite
  - fix: Change the glob to 'mcp_server/database/context-index.sqlite'.
- **[P1] drift** `.opencode/commands/doctor/assets/doctor_causal-graph.yaml:174` — Causal-graph doctor fail-fast text references retired missing-DB glob
  - evidence: context-index__*.sqlite missing -> STATUS=MISSING with recommendation to run /doctor memory
  - fix: Change to 'context-index.sqlite missing -> STATUS=MISSING ...'.
- **[P1] drift** `.opencode/commands/doctor/assets/doctor_causal-graph.yaml:251` — Causal-graph doctor halt condition references retired missing-DB glob
  - evidence: context-index__*.sqlite missing -> STATUS=MISSING; recommend /doctor memory
  - fix: Change to 'context-index.sqlite missing -> STATUS=MISSING; recommend /doctor memory'.
- **[P1] drift** `.opencode/commands/doctor/assets/doctor_speckit_presentation.txt:49` — Speckit doctor symptom router still advertises retired DB glob
  - evidence: "context-index__*.sqlite missing" warning           -> 2  Memory
  - fix: Change to '"context-index.sqlite missing" warning -> 2 Memory'.
