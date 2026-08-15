# Phase 002 — Per-Packet Extraction (cheap/free, parallel)

> Charter only. Full narrative in `../plan.md` §4 Phase 2. This is the coverage spine.

## Goal

Turn each packet's own shipped-truth doc into a normalized, user-facing release fragment —
one cheap worker per packet, complete deterministic coverage.

## Inputs

- `001-context-pack/context-pack.md` (path map + diffstat).
- Each packet's `implementation-summary.md` (+ `spec.md` if needed).

## Per-worker contract

Read one packet's summary + its diffstat → emit a release fragment:
- 3–8 user-facing bullets ("what changed + why it matters").
- Breaking-change flags + migration notes.
- Normalized front-matter: section, packet id, magnitude.

## Model

DeepSeek V4 Flash via the `opencode-go` gateway (2x-subsidized fan-out provider).

## PROVEN RECIPE (pilot validated 2026-08-14, sk-doc/028, 25s, read-only, grounded)

- **Read-only workers.** The PARENT reads each packet's `implementation-summary.md`, inlines it
  into the prompt, and WRITES the returned fragment. Workers get NO filesystem write authority and
  NO `--dangerously-skip-permissions` — this eliminates the RM-8 destructive-write hazard
  (cli-opencode `references/destructive-scope-violations.md`). Inlining also means zero tool calls,
  sidestepping the DeepSeek `:`-in-tool-name gotcha (no `--pure` needed).
- **Prompt = RCAF** (Role/Context/Action/Format; sk-prompt-models mandate for DeepSeek). "Invent
  nothing; ground every bullet in the summary." Strict JSON fragment output.
- **Dispatch:** `timeout 300 env MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run
  --model opencode-go/deepseek-v4-flash --dir <repo> "<prompt>" </dev/null`. `</dev/null` is
  mandatory (Rule 5 hang guard). No `--variant` (flash is non-reasoning).
- **Packets without a rollup `implementation-summary.md`:** parent concatenates child summaries (or
  falls back to top-level `spec.md`) before inlining. ~half the packets need this.
- **Parallelism:** Rule 16 — a fan-out needs explicit operator authorization + a concurrency number;
  each backgrounded dispatch reaped by captured PID.

## Exit criteria

- One fragment per packet (~54). No packet skipped.
- Fragments schema-consistent for the Phase-4 reduce.
