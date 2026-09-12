---
title: "Deep-Research Strategy: Goal unification (fanout lineage deepseek, iterations 1-10)"
trigger_phrases:
  - "goal unification strategy deepseek"
---

# Deep-Research Strategy: Goal unification (fanout lineage deepseek)

> Charter of record: `../../deep-research-strategy.md` (packet-level, defines the eight angles and the
> iteration allocation table). This file is the lineage's mutable working plan. Iterations 1-10 run here;
> iterations 11-15 continue on a separate `glm` lineage.

## Research Topic

Decide, with `file:line` citations from this repository, how the cross-runtime goal hook
(`.opencode/hooks/goal/`, `.opencode/plugins/opencode-goal.js`) should be rebuilt so that the packet
`goal.md` under `specs/` is the single source of goal state — nested when a packet is phased and singular
otherwise — while spec-kit keeps the parent goal current and resends it in chat without frontmatter.
Research only: no code edits, no template edits, no re-litigation of the operator constraints already frozen.

## Known Context

Captured at init from the packet charter (`../../deep-research-strategy.md`), read but not re-derived:

- Goal template: `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` (goal | v2.2) carries
  frontmatter with a `_memory.continuity` block plus anchors directive, binding (phase only), completion,
  and log sections.
- Playbook: `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` — set string
  is pointer + binding sentence + criteria copied verbatim; §5 resend rule says "full text"; §7 cites a 3000
  budget; §8 links a validator that was deleted (`check-goal-shape.sh`, removed in commit `1cdc362aa62`).
- Structural validation today: `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:203-229`
  makes a goal.md continuity block mandatory and requires anchors when present.
- Core hook: `.opencode/hooks/goal/lib/goal-core.cjs` — `resolveStateDir` (:145), scope key
  sha256([workspace, runtime, sessionId]) (:174-208), `readGoalRecordForScope` (:622), `renderGoalBrief`
  (:405), `buildGoalPrompt`, `status !== 'active'` gate (:384), `setGoal` (:897). Store at
  `<repo>/.opencode/skills/.state/goal/<key>.json` with `.locks/` and archive; currently holds only a README.
- Plugin: `.opencode/plugins/opencode-goal.js` is an independent implementation keyed on
  sha256(sessionId) with caps 4000 objective / 4000 goal_prompt / 4800 injection (:29-33).
- Runtime adapters: `.opencode/hooks/goal/pi/goal-context.ts`, `cursor/goal-inject.mjs`, `bin/goal.cjs`;
  commands `.opencode/commands/goal-opencode.md`, `.cursor/commands/goal-cursor.md` (refuses when no session
  identity), `.pi/prompts/goal-pi.md`. No goal hook exists for Claude Code, Codex, or Devin (Devin removed in
  `specs/hooks/009-goal-isolation/006-*`).
- Speckit commands `.opencode/commands/speckit/{plan,implement,complete,resume}.md` whitelist `opencode_goal`
  tools only; `.opencode/commands/speckit/assets/speckit-plan.yaml` `goal_prompting.set_mutation.dispatch_by_runtime`
  and `objective_shape: "Pointer plus copied completion criteria; never a file body"`.
- Contracts: `.opencode/hooks/hooks/injection-contract.md`,
  `.opencode/skills/system-spec-kit/references/config/hook-system.md`,
  `.opencode/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md`.
- History packets: `specs/hooks/003-goal-hooks-cross-runtime`, `specs/hooks/009-goal-isolation` (removed a
  process-global current-goal pointer), `specs/system-speckit/033-system-speckit-v4/010-goal-file-addon`,
  `.../029-goal-operator-resync-rule`.
- Frozen operator constraints (do not re-litigate): goal commands ship for pi, opencode, cursor, devin;
  Claude Code and Codex keep their native goal command and reach nesting through speckit commands or natural
  conversation; the parent durable slice is at most 4000 characters excluding frontmatter, children unbounded.
- `resource_map_present: false` — the packet has no `resource-map.md`; skipping coverage gate.

## Key Questions

| ID | Question | Angle | Decision |
|----|----------|-------|----------|
| KQ1 | How does a session learn which packet's `goal.md` is active, and what breaks with two sessions in one packet or one session switching packets? | A1 | D1 binding |
| KQ2 | Which surfaces render goal text today, where would a frontmatter strip function sit, and what breaks when one call site reads raw? | A2 | D3 strip |
| KQ3 | What does `.opencode/skills/.state/goal/` uniquely hold that `goal.md` cannot, and should it retire or demote? | A3 | D2 store fate |
| KQ4 | What predicate triggers a resend, at what cadence, with what dedup, and how does it stay non-blocking? | A4 | D4 resend |
| KQ5 | For each runtime: which command and hook surfaces and which session identity exist, and do Claude Code and Codex expose a native goal command? | A5 | D5 runtimes |
| KQ6 | How does a packet-shared `goal.md` avoid re-introducing what `specs/hooks/009-goal-isolation` removed? | A6 | D7 isolation |
| KQ7 | What may mutate the parent goal unprompted, what needs ratification, and how does a child change propagate? | A7 | D7 isolation |
| KQ8 | What is the real budget arithmetic against every cap, the cut order when over, and where is the budget enforced? | A8 | D6 budget |

## Answered Questions

All eight angles carry an evidence-backed answer; the decision matrix lives in `research.md`.

- KQ1 (D1): explicit per-session `packetPath`, written only by a bind step, never inferred. Residual: none.
- KQ2 (D3): marker slice (body → log anchor, `IF level:phase` resolved); objective keeps its own
  pointer+criteria slice. Residual: the CJS/ESM seam for a shared extractor.
- KQ3 (D2): demote the store to a per-session index + telemetry; the durable objective is the only content
  that leaves it. Residual: none.
- KQ4 (D4): edge trigger on the durable-slice hash, packet-scoped dedup, fail-open. Residual: none.
- KQ5 (D5): pi/opencode/cursor ship, devin defers (no command surface), Claude/Codex stay native.
  Residual: host injection caps UNKNOWN.
- KQ6 (D7): selection, liveness, telemetry, locks, dedup stay per-session; only the directive is shared.
- KQ7 (authority): log + continuity bookkeeping auto; durable slice command-mediated and ratified; child
  amendments land on the parent first.
- KQ8 (D6): caps chain 4000 → 1200 → 576 inside a 4800 block; enforce at the validator that already owns
  goal.md rules. Residual: packet 036's real parent goal not measured here.

## What Worked

- Reading the *other* consumers of session state (completion-evidence and compaction hooks) surfaced the
  `lastSpecFolder` binding carrier the goal hook never used.
- Tracing the transcript detector's reason enum gave free, authoritative failure-mode vocabulary.
- Reading renderer *arithmetic* turned "strip the frontmatter" into a quantified budget argument, and
  iteration 8's cap chain (576-char objective preview) came out of constants, not documentation.
- Reading the isolation ADR rather than its spec surfaced the constraints the design had to honor
  (opaque filenames, never guess, cut over together).
- Forcing the two second passes (A1+A3, A2+A4) into single artifacts exposed real conflation — the
  objective/prompt mix-up and the `IF level:phase` trap.

## What Failed

- A repo-wide search for an existing "current packet pointer" returned no such artifact: no pointer exists.
- A search for an automated `goal.md` writer found none; the continuity library's `goal` facet looked like
  one and proved to be a naming collision.
- The playbook's claimed budget rule is absent from `validation-rules.md`; the reference dangles.
- The charter's `injection-contract.md` path does not resolve (the file is one level up).
- Host-level injection caps could not be confirmed from the repo at all.

## Exhausted Approaches

- cwd/nearest-packet inference (iteration 1) — revisit only as a *suggested* bind the operator confirms.
- Resend predicates other than the durable-slice hash (iteration 4) — mtime, cadence, in-file fingerprint.
- YAML parsing and materialized slices (iteration 2) — both cost more than the marker slice.
- Retiring the legacy store (iteration 3) and operator-only durable writes (iteration 7).

## Ruled-Out Directions

See `findings-registry.json` → `ruledOut` (18 entries, each with a citation). Headline entries:

- **O1-C nearest-packet inference** (`session-stop.ts:112`), **O2-A YAML parse** (`goal.md.tmpl:16`),
  **O2-D materialized slice** (`goal-set-string-playbook.md:74`), **O3-A retire the store**
  (`goal-core.cjs:524`), **O3-D liveness in frontmatter** (`.state/goal/README.md:31`), **O4-C mtime** and
  **O4-D in-file fingerprint** (`goal-set-string-playbook.md:79`, `continuity-freshness.ts:56`),
  **O7-B auto durable rewrites** (`goal.md.tmpl:54`), **line-range slicing** (`goal.md.tmpl:65`).

## Next Focus

Synthesis reached at the iteration cap. `research.md`, `convergence-report.md`, and `synthesis.json` exist;
stop reason `maxIterationsReached`. Successor lineage: `glm` (iterations 11-15) per the charter — verify A5,
reconcile A6+A7, verify the budget arithmetic on packet 036's real parent goal, attack the thinnest-evidence
angle (CJS/ESM seam and plugin drift), then rank D1-D7.
