# Research Brief R2 — Dispatch-receipt mechanism design (kill the forgery path)

READ-ONLY RESEARCH TASK. No file writes are requested. Do not ask about spec
folders or documentation scope. Do not ask any questions; produce the design.

## Context (verified by prior research)

Role absorption at medium effort works because: the LEAF prompt's route-proof
fields (target_agent, agent_definition_loaded, resolved_route) are MODEL-
AUTHORED in the state JSONL; post-dispatch-validate.ts checks only presence/
equality; the auto-YAML CLI branch runs `opencode run` directly, bypassing
runAuditedExecutorCommand in executor-audit.ts; validation runs only after
artifacts exist. An executor can do the work inline and write the proof.

## Your task — design the unforgeable receipt, ready to implement

Read (repo-root relative):
1. `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` — the
   audited command wrapper's current event surface (what it can already attest).
2. `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`
   — the validator entry points and result shapes.
3. `.opencode/commands/deep/assets/deep_review_auto.yaml` lines 760-960 — the
   dispatch step + CLI branch + post_dispatch_validate wiring.

Design deliverables (fenced blocks with exact file targets):
1. **Receipt record schema** (JSONL): fields the DISPATCH MECHANISM writes
   (not the model) — event, executor kind (native task | audited CLI), child
   pid/session id, prompt hash, timestamps, route fields — and where it is
   written relative to the fixture/state tree.
2. **YAML wiring**: the pre_dispatch_receipt step insertion (before LEAF work
   may run) + the changed CLI branch routing through the audited wrapper, as
   before/after YAML excerpts.
3. **Validator change**: the post-dispatch-validate signature/behavior change
   that requires the receipt and compares receipt-derived route fields against
   the state log (making model-written fields advisory only). Include 4-6
   test-case one-liners: native dispatch → pass; audited CLI → pass; inline
   work + forged JSONL → reject; receipt present but route mismatch → reject.
4. **Migration note**: what breaks for existing green paths (Claude native)
   and how to keep them passing unchanged.

## Output contract (strict)
Markdown, no preamble, sections DELIVERABLE 1-4. Cite current file:line for
everything you change. Precision over breadth.
