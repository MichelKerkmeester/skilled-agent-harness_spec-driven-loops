# Goal Prompt — Tackle the 036 Open Backlog with DeepSeek v4 Flash (opencode-go)

> Kickoff brief for a future session. Paste it, or point a session at this file. It is scoped so a
> weak model does useful work **without** the failure modes the executor's own docs warn about.

---

## Goal

Advance the open sub-packets of `specs/system-deep-loop/036-deep-loop-innovation` toward `Complete`,
using **DeepSeek v4 Flash at its highest variant, via cli-opencode (opencode-go provider)** as the
primary executor — scoped to work it can do safely, escalating the rest.

## ⚠️ Read this before dispatching (non-negotiable)

1. **Read `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` first.** (Project rule:
   never compose a cli-X prompt without reading its SKILL.md.)
2. **DeepSeek + `--dangerously-skip-permissions` has deleted files before.** On 2026-05-04 an
   `opencode-go/deepseek` dispatch deleted 44 files across two phase folders. The four-layer RM-8
   mitigation is the **only** active protection: (L1) the rendered prompt carries literal
   `BANNED OPERATIONS` + `ALLOWED WRITE PATHS`; (L2) `--dir` points at a **fresh git worktree**;
   (L3) main is clean/committed with a recorded recovery-baseline commit hash; (L4) for
   **phase-parent / multi-phase targets, prefer `cli-copilot` + `gpt-5.6-sol` high over DeepSeek**.
3. **Write-containment is the net, not a guarantee.** Packet 010 hardened the fan-out lineage prompt
   so a weak model is told exactly what not to run; packet 011 added artifact-progress liveness so a
   slow DeepSeek lineage is not falsely killed. Both help — neither replaces the worktree + baseline.

## Executor

- **Primary:** `cli-opencode`, `--model deepseek/deepseek-v4-flash`, highest available `--variant`
  (confirm the exact variant name via `opencode models deepseek` / `references/providers-and-models.md`
  — DeepSeek may cap at `high`, there may be no literal `max`), `--format json`, `--dir <fresh-worktree>`.
- **Escalation for substantive/multi-phase builds:** `cli-copilot` + `gpt-5.6-sol` reasoning high
  (verify availability on the Copilot surface first).
- **Fan-out children** inherit an enforced spec-gate and hang at 0% CPU unless dispatched with
  `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run ... </dev/null`.

## Scope — IN

Open leaves under these children (auto-status `in_progress`/`planned`; some may already be built and
only need closeout — triage first):

- **002 substrate-and-orchestration:** 003-shared-evidence-and-control-services,
  004-compatibility-shadow-and-rollback-bridge, 005-fanout-fanin-durable-orchestration,
  007-convergence-termination-and-health.
- **005 blocker-closeout:** 001-completion-evidence-reconcile,
  002-shadow-parity-independent-derivation, 004-durable-write-boundaries.
- **006 runtime-docs-and-integrity-hardening:** 003-artifact-certificate-binding,
  006-fanout-dispatch-integrity, 007-improvement-promotion-authority,
  008-runtime-mirror-and-routing-parity, 009-silent-failure-and-harness-repair,
  010-docs-drift-and-p2-batch.
- **007 executor-and-cli-hardening:** 002-executor-wiring-and-parity,
  003-write-containment-hardening, 004-deep-alignment-integrity, 006-residual-finding-closeouts.
- **Closeout-only:** 004/003-drift-census-and-plan-revalidation, 009/005-closeout-and-drift-reconcile.

## Scope — EXCLUDED (operator-gated — do NOT touch without a fresh explicit go)

These flip the live runtime from old writers to new (high blast radius). They stay parked:

- 003/004 legacy-writer-retirement
- 009/003 pilot-mode-cutover
- 009/004 fleet-authority-cutover
- 004/001 whole-system-gate (operator directive: **stop at merge**)

## Approach (sequenced — safest first, cheapest signal first)

1. **Triage (DeepSeek-safe, read-only).** For each IN-scope leaf, decide: *genuinely unbuilt* vs
   *built but unmarked* (has implementation-summary + code, only the checklist/status/metadata is
   stale). Output a table: packet → verdict → what's missing.
2. **Closeout wave (low risk).** For built-but-unmarked leaves: run `validate.sh <folder> --strict`,
   tick the checklist against real evidence, reconcile metadata (`backfill-graph-metadata.js` last),
   flip status to Complete. DeepSeek can draft; a strong model verifies the evidence is real.
3. **Docs/hardening wave (DeepSeek-friendly).** 006 docs-drift, README/integrity items — DeepSeek's
   strength (observation + prose), lowest code risk.
4. **Substantive build wave (ESCALATE).** 002 engine plumbing + 007 executor hardening are real code.
   Prefer `cli-copilot gpt-5.6-sol high`, or DeepSeek only under full RM-8 + a mandatory strong-model
   verify pass before any commit. Never unsupervised DeepSeek on these.
5. **Verify + bank.** Every DeepSeek-authored change gets a strong-model review before commit;
   `validate.sh --strict` Errors:0; commit per packet; push per your allowlist.

## Definition of done (per packet)

- `validate.sh <folder> --strict` → Errors: 0.
- Checklist items ticked with concrete evidence (file:line / command / named test / number).
- Metadata reconciled (description.json + graph-metadata.json), status Complete, continuity fresh.
- Scoped diff only; no task-created residue; no gated item touched.

## Guardrails

- One fresh worktree per work session; record the baseline commit hash before any dispatch.
- Comment hygiene: no spec paths / packet-phase ids / finding ids in code comments.
- If a leaf turns out to need a gated cutover to finish, STOP and surface it — do not proceed.
- Optional: run this brief through `sk-prompt` / `sk-prompt-models` to CLEAR-optimize the exact
  dispatch prompt for DeepSeek before fan-out.
