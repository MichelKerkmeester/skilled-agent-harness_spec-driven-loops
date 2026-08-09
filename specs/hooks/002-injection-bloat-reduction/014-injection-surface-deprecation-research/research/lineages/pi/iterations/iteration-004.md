# Iteration 4: Behavioral Value Evidence — Redundancy, Advisor Routing, Gate-3 Effect

## Focus

What the surfaces actually DO when present: (a) redundancy of the three directives vs the root doc, (b) the advisor route line's behavioral value chain, (c) the Gate-3 question's behavioral effect and its known noise defect. Lays the evidence basis for q5 dispositions.

## Findings

### F1. The directives are NOT verbatim duplicates of AGENTS.md — they are condensed dispositional reminders, but comment-hygiene restates a root-doc HARD BLOCK

- `rg "reason about the problem and the person|lead with the result|only real command output counts|pass-or-fail" AGENTS.md` → **zero hits**: the governor and proof-over-appearance directive texts do not appear verbatim anywhere in the root doc.
- The render.ts comments state the design: governor is "the thermostat that re-states the disposition as context grows... the full five-step protocol lives in AGENTS.md section 4" (render.ts:111-121). Comment hygiene IS a direct restatement of AGENTS.md:58's `Comment Hygiene [HARD] BLOCK` (different wording, same rule).
- AGENTS.md:417-419 documents the "Directive Capsule": "Hook-capable runtimes may restate the operating disposition on each turn, including comment hygiene, governor, and proof-over-appearance guidance. The capsule is a short reminder; this framework remains the durable source of the full rules."
- **Value model:** the directives are only valuable as per-turn reminders of rules the model might otherwise drop as context grows — exactly the claim 002's behavioral negative controls were designed to test and **never did** (0/13 applicable activation cells have evidence, iteration 2). Their marginal value above the root doc is asserted, not demonstrated. [SOURCE: AGENTS.md:58,417-419, render.ts:111-123]

### F2. The advisor route line has in-vivo behavioral value — including in this very session

- This lineage's own dispatch prompt carried `Advisor: live; use system-deep-loop 0.95/0.12 pass.`, and this session is executing the deep-research skill as a direct result. The recommendation line demonstrably routes behavior (Gate 2: "Confidence ≥ 0.8 → MUST invoke skill").
- The advisor surface is the repo's routing backbone: 12 skill hubs (sk-code, sk-doc, sk-git, sk-prompt, system-spec-kit, system-skill-advisor, system-deep-loop, system-code-graph, mcp-tooling, mcp-code-mode, cli-external-orchestration, sk-design) with a large test surface (command-binding-existence, command-bridges-drift-guard, cross-skill-edges, daemon-freshness-foundation, runtime-parity — 2 advisor hits in hook tests). [SOURCE: .opencode/skills/ (12 hubs), system-skill-advisor/mcp-server/tests/]
- Cost is 42-43 B (iteration 3) — the cheapest per-turn surface, and it is dynamic (the actual recommendation), not constant text.

### F3. The Gate-3 question has proven behavioral weight AND a documented noise defect (037)

- **Value:** the question is the front end of the Gate-3 HARD BLOCK, backed by `evaluateMutation` [BLOCK] denials (injection-contract.md §3) — a control that can stop a Write/Edit/Bash dead in its tracks. Live repo state confirms real sessions carry gate state: `.opencode/skills/.spec-gate-state/63353...json` = `{"status":"open","askedAtMs":...}`, and `spec-gate-warnings.log` shows today's claude session c537246c receiving gate advisories on every bash call (08:17-08:33Z). [SOURCE: .opencode/skills/.spec-gate-state/, spec-gate-warnings.log]
- **Noise defect (proven by packet 037):** "the SPEC FOLDER QUESTION is re-injected on nearly every turn: once the gate opens, the shared core re-surfaces it on every subsequent turn regardless of content (all six runtimes)"; answer grammar rejects the bare-letter answers the question invites; in Pi "per-invocation session identity defeats answer persistence while embedded compacted history trips the keyword classifier". 037 is 98% complete (core question semantics + answer grammar + pi adapter hardening). [SOURCE: specs/cli-external-orchestration/037-spec-gate-question-noise/spec.md:69-70]
- **Net:** the Gate-3 question is the one injection with both a documented behavioral mechanism (denial authority) and a live fix pipeline for its repetition defect. Its per-turn bloat is an acknowledged defect being fixed, not a design constant.

### F4. Active-goal, continuity, dist-warning briefs: value depends on opt-in state, cost is near-zero today

- Active-goal: renders only when an active goal record exists; none exists today (`.goal-state/` has README only, iteration 3). Value = session steering when used; cost = 0 now, up to 4,800 chars/turn on Pi when active.
- Continuity (SessionStart ~389 B + compact recovery): fires once per session boundary; value = resume/compaction recovery — the only surface explicitly built for context-loss events.
- Dist-warning: OpenCode-only, pre-risky-Bash, event-driven — cheap and targeted.

## Sources Consulted

- AGENTS.md (lines 58, 417-419)
- render.ts:111-123 (directive design comments)
- specs/cli-external-orchestration/037-spec-gate-question-noise/spec.md (lines 69-70)
- .opencode/skills/.spec-gate-state/63353...json; spec-gate-warnings.log (2026-08-09 events)
- system-skill-advisor/mcp-server/tests/ (test surface); .opencode/skills/ (12 hubs)
- This session's dispatch prompt (advisor line → skill routing in vivo)

## Assessment

- **newInfoRatio: 0.8** — 037 packet discovery, live gate-state files, and the no-verbatim-duplication finding are new to the lineage; F2's in-vivo evidence is new framing.
- **Confidence:** high.
- **q5 groundwork:** disposition candidates now have behavioral-value evidence on both sides; next iteration can weigh disposition + migration design.

## Reflection

- What worked: checking AGENTS.md for verbatim duplication (negative result is itself a finding); discovering 037 which reframes Gate-3 as "proven value, known defect being fixed".
- What failed: nothing material.
- Ruled out: treating the directives as required *because* the root doc lacks them (root doc covers all three policies in full form — §1, §4, §Operating Discipline — the directives are restatements by design).

## Recommended Next Focus

Iteration 5: Disposition synthesis per surface (q5 core) — keep/deprecate/redesign matrix with evidence weights, and the migration path: what must change in render.ts, prompt-advisor.ts, spec-gate-core.mjs, goal adapters, and the 002/007 program (activation vs deprecation interplay, fallback coverage).
