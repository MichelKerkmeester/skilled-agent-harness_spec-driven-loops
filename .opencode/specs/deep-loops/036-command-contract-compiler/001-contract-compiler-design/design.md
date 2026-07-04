# Contract Compiler — Verified Design

> Consolidated, verified design for the build-time command-contract compiler (packet 036, carved from 035). This supersedes the original GPT-produced seed (retained in git history). It merges three dispatched design passes — each independently Sonnet-verified — with four corrections found during verification. Detailed evidence lives in the sibling working docs:
> - `design-citations.md` — the authority-chain verification (REQ-001).
> - `design-unknowns.md` — injection seam, checksum ownership, CLI parity (REQ-002/003/004).
> - `design-expansion.md` — pacing/resume, rollout live consumer, 035 T002 unblock.
>
> Convention: any file, field, or script that does NOT exist today is labelled `proposed-new`. Everything else is a live, cited source.

---

## 1. The problem this compiler solves

A `/deep:*` command's real contract is distributed across a resolution chain of maintained files and weighted by file position, so a GPT executor does not reliably see it. The compiler collapses that chain into one self-contained, grep-checkable Markdown contract per command, injected at a deterministic seam so it lands in the executor's first prompt block. Maintainers keep editing the layered sources; the compiled artifact is generated output guarded against drift.

---

## 2. Verified authority chain — 16 files (`/deep:review`)

The seed named 14 files; verification (`design-citations.md`) corrected this to **16**. Additions over the seed: the `:confirm` workflow, the canonical `review_mode_contract.yaml`, `state_format.md`, and — found in verification of this design — `convergence.md` (the CONTINUE/STOP/STUCK_RECOVERY algorithm, referenced at `deep_review_auto.yaml:64` beside `state_format.md`). The `deep_review_config.json` path drift (command-assets → skill-assets) is corrected.

| # | File | Role |
|---|------|------|
| 1 | `.opencode/commands/deep/review.md` | Thin router: tool allowlist, owned assets, setup gate, mode routing |
| 2 | `.../assets/deep_review_presentation.txt` | Visible prompts, `:auto` branch, default/fan-out/lifecycle/stop policy, confirm prompt |
| 3 | `system-spec-kit/.../auto_mode_contract.md` | Shared `:auto` three-tier resolution + fail-fast |
| 4 | `.../assets/deep_review_auto.yaml` | Autonomous workflow, setup inputs, state paths, preflight |
| 5 | `.../assets/deep_review_confirm.yaml` | Interactive workflow, approval gates, parallel setup authority |
| 6 | `deep-loop-workflows/mode-registry.json` | review → runtime loop / packet / command / agent / artifact root |
| 7 | `deep-loop-workflows/SKILL.md` | Hub registry routing |
| 8 | `deep-review/SKILL.md` | Mode invocation + state-machine rules |
| 9 | `deep-review/references/protocol/loop_protocol.md` | Protocol refs, init outputs, dispatch validation, synthesis/verdict |
| 10 | `deep-review/references/state/state_format.md` | 8 state files, artifact-root resolution, config schema |
| 11 | `deep-review/assets/review_mode_contract.yaml` | Canonical review taxonomy/severities/verdicts/gates (self-declared sourceOfTruth) |
| 12 | `deep-review/references/convergence/convergence.md` | CONTINUE/STOP/STUCK_RECOVERY algorithm, release-readiness classes |
| 13 | `deep-review/assets/deep_review_config.json` | Config template (session/lineage/executor/dimensions/gates/reducer) |
| 14 | `deep-review/assets/prompt_pack_iteration.md.tmpl` | Per-iteration prompt, write boundary, 3 required artifacts |
| 15 | `.opencode/agents/deep-review.md` | LEAF agent packet-boundary gate, read-only target rule, BINDING emissions |
| 16 | `deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs` | Rollout injection-mode resolver |

The 3-way setup authority (router + presentation + auto_mode_contract) is structurally captured; the compiler must read full line ranges, not the seed's narrow slices.

---

## 3. Contract schema

One compiled artifact per command carries: `id`, `version`, `sourceDigests[]`, a `gate3Precedence` line bound to the classifier, `renderBlocks.auto|confirm` (literal START/END markers, rendered verbatim), `setup.requiredFields[]` + `mode`, `outputTemplate` (prompt-pack + required artifacts), `writeBoundary` (approved root / allowed / read-only / banned), a typed `executorContract` (mode-bound to autonomous + writeBoundary), `refs` to the 035 dispatch-receipt + progress-record mechanisms (referenced, not re-implemented), `tools` (allowed + per-executor permitted), and an `absorptionAbort` rule (findings without a dispatch receipt = role absorption → write nothing). Full schema in `design-unknowns.md` and the seed lineage.

---

## 4. Compiler, build target, and injection seam (REQ-002 — resolved)

**Build target:** `.opencode/commands/deep/assets/compiled/deep_review.contract.md` (`proposed-new`) — the canonical, checked-in compiled artifact.

**Injection seam:** the compiled contract reaches the executor through the **command-template shell-interpolation prelude** — a `!`…`` line in the command Markdown body, the mechanism `/memory:search:17` already uses (verified: it is the *only* current user of the pattern, a real singular precedent). A `proposed-new` `render-command-contract.cjs` runs at that seam and emits the contract as command-scoped Markdown, after the H1 and before `## 1. ROUTER CONTRACT`, so it lands in the executor's first prompt block.

**Ruled out (corrections):**
- **Plugins** — every plugin hook (`experimental.chat.system.transform` / `.messages.transform` / `.session.compacting`) is session- or turn-scoped, keyed by dedup marker, never by command name. Verified across all plugin files + the project hook reference. Wrong granularity for a per-command contract; usable only as a secondary session-global hint.
- **Root `AGENTS.md`** — a global, session-wide instructions file (same class as CLAUDE.md); the same "session-global, not command-scoped" reasoning disqualifies it. Recorded here explicitly (the seam candidate REQ-002 named alongside plugins).

**Canonical-file ↔ render-seam reconciliation:** the compiled `deep_review.contract.md` is the canonical checked-in artifact and drift-guard subject; the render prelude emits/splices that artifact's content into the command body at run time. The file is the source of truth for CI + review; the prelude is the runtime delivery. These are complementary, not two competing outputs.

---

## 5. External-ref taxonomy

`read_contract` (inline stable excerpts with digest), `render_template` (compile marked blocks + prompt-pack; fail on unresolved markers/placeholders), `invoke_script` (executable refs with tool allowlist + args schema), `dynamic_target` (runtime paths like `{artifact_dir}` bound only through deterministic setup), `conditional_fanout` (compile branches + activation predicate + required receipts), `post_loop_save` (save-payload schema + phase-save script ref, never free prose).

---

## 6. Checksum ownership + drift guard (REQ-003 — resolved)

The compiler owns generated digests; maintained sources own the truth. The compiled artifact carries a generated header with `sourceDigests[]` (one per maintained source slice) and a `compiledBodyDigest` that **excludes the digest header** (no self-referential hash). Drift-guard read path: (1) read recorded `sourceDigests`; (2) recompute live-source digests, fail on any mismatch; (3) re-render body, recompute normalized body digest excluding the header; (4) fail if checked-in body ≠ re-rendered body, unless `--accept-compiled-drift` records the delta. Resolve order: maintained sources always win.

**Correction — enumerated-source edge case:** steps 1–4 catch a *listed* source changing, but not a *newly-required* source that was never added to the compiler's source list. The drift guard must therefore also assert that the compiled `sourceDigests` set equals the command's actually-referenced authority set (derived from the command's YAML `skill_reference` block + owned-assets table), failing when the live command references a source the compiled artifact does not enumerate.

Drift severity: hard-fail on stale source digest, unresolved marker/placeholder, tool-allowlist overflow, or missing-source; warn on non-execution presentation-copy changes.

---

## 7. Deterministic setup loader

Parses suffix, flags, `PRE-BOUND SETUP ANSWERS`, positional spec-folder extraction, and defaults *before* model execution (following `auto_mode_contract.md` Tier 1). Emits one hydrated packet `{contractPath, setupValues, writeBoundary, selectedWorkflow, renderedPromptPrelude}`. Fails before YAML load on any `[PLACEHOLDER]`, unknown required field, duplicate marker block, invalid path, or tool mismatch.

---

## 8. Fold-in / retrofit

Render blocks → `renderBlocks.auto|confirm` (literal markers). Top-of-file executor block → typed `executorContract` (mode-bound autonomous + writeBoundary), avoiding another raw hard-rule prelude. Injection dedupe → `sourceDigests` + one root-policy canonical hash + mirror note. The 14 `.opencode/agents/*.md` files (the LEAF agent per command + siblings) become thin pointers: "load compiled contract for command X"; per-agent rules remain source inputs only where mode-specific.

**AGENTS.md autonomous-precedence bridge (parent-scope item) — how it lands:** 035 carried the Gate-3 autonomous-precedence rule as prose in the root policy (`AGENTS.md`/`CLAUDE.md`), which is exactly the distributed-instruction fragility this packet removes. It is NOT delivered as more global prose. Instead the compiled contract makes precedence a machine-bound fact: `gate3Precedence` + `declaresAutonomousExecution`/`ownsSpecFolderSetup`/`writeBoundary` in the contract (§3), fed to `classifyPrompt` before any write (§9, §11). The retrofit therefore *thins* the root `AGENTS.md`/policy Gate-3 prose to a pointer at the compiled mechanism rather than restating the rule — the bridge is superseded structurally, not re-authored.

---

## 9. Pacing / resume (deliverable 5 — verified)

The contract carries a compact `proposed-new` `pacing`/`resume` block that references existing runtime primitives, not a new liveness system:
- **Pacing** derives `firstArtifactDeadlineSeconds: 60` from the live `PROGRESS_THRESHOLD_SECONDS` (not a new policy value); requires a started/completed progress pair or artifact write before any >60s step; a pre-cap finalizer writes a checkpoint + partial status (never "convergence") when progress exists before a cap; and forbids budget extension for a dark stall (extend only when progress records or artifact mtimes prove visible progress).
- **Resume** routes `/deep:*` resume triggers + `:auto` through `classifyPrompt(..., {executionMode:'AUTONOMOUS', boundSpecFolder, commandContract})` — reusing the classifier's already-existing `CommandContract` shape and prebound-spec-folder satisfaction (verified live at `gate-3-classifier.ts:67-72,653-681,812-820`). Progress records reset liveness but are never counted as iteration/convergence/completion (enforced by the three reducers' existing `filterCompletionBearingRecords`). `lineage_mode=restart` is an operator-authorized archive; council convergence (from `convergence.md`) permits exactly one bounded referee pass per persisted round — any repeat adjudication loop is illegal without a later explicit opt-in flag (closes the F-018 hidden-loop risk).

---

## 10. Rollout flag → live consumer (deliverable 6 — verified)

`SPECKIT_COMMAND_INJECTION_MODE` / `resolveInjectionMode(command)` exists but has no live caller. The `proposed-new` `render-command-contract.cjs`, invoked at the §4 bang-shell seam, becomes the live consumer:
1. Calls `resolveInjectionMode('deep/review')`.
2. Parses `$ARGUMENTS` with the documented command-template argv semantics.
3. `fallback` → emits the captured legacy body slice **byte-for-byte** (zero behavior change; every command ships here first).
4. `fix` → emits the compiled contract first, then the minimum legacy body for command discovery / setup / YAML handoff.
5. Emits no model-visible explanation of the flag decision.
6. Writes one JSONL **manifest** row per render (`command`, `mode`, `argsSha256`, `legacyBodySha256`, `compiledContractSha256`, `renderedSha256`, `sourceDigests`).

**Comparator + promotion** (`proposed-new`, CI + local): for `fallback` commands, rendered output must byte-match the captured legacy body (any diff blocks promotion); for `fix`, only the compiled prelude / manifest / digest headers may differ; promotion refuses on stale source digests or a `fix` that omits the Gate-3 classifier contract, receipt/progress refs, write boundary, or required setup values; promotion requires a live acceptance run with the baseline leg green.

---

## 11. 035 T002 unblock (deliverable 7 — verified)

T002 (cells RVB-007, RSB-005, RSB-007, ACB-004-high, ACB-005, CXB-004) is blocked because the receipt-audit + Gate-3 fixes reach GPT only as instruction prose. Moving them into the compiled contract + live consumer makes the flip measurable. **Wiring-complete criteria:** live compiled-contract injection for all four deep commands (fallback byte-identical, fix prepends the contract); Gate-3 autonomous precedence machine-bound (contract facts fed to `classifyPrompt` before any write); a deterministic dispatch id bound into both `runAuditedExecutorCommand` and `post_dispatch_validate.dispatchReceipt` (verified today only random model ids); route-proof demotion exercised (valid receipt → route fields advisory, `mode` hard; missing/invalid → `dispatch_receipt_missing|invalid_mac|intent_mismatch`); progress non-completion preserved; council bounded to one referee pass; manifest evidence captured per leg.

**Cell mapping** (each grounded in the real 033 scorecards — RVB-007/RSB-007 = role absorption with fabricated route-proofs, RSB-005 = absorption-by-timeout, ACB-004/005 = silent high-effort stall, CXB-004 = stall both efforts): the contract's absorption-abort + validated-receipt fixes target the absorption cells; per-seat progress + bounded referee target the council cells; host-owned per-seat settle targets CXB-004. *(CXB-004's ideal-pass shape is a question-halt with zero seats; the mapping's "host-owned per-seat progress makes an internal sweep's liveness visible" is a defensible generalization against the observed stall, verified against the 033 scorecards rather than asserted.)*

**Re-run protocol:** capture fallback baseline via `opencode run --command` (never raw slash text); flip target command(s) to `fix`; re-run the six cells on gpt-fast-med + high; compare via the manifest comparator (a baseline regression blocks promotion even if the target cell improves); record the result back in 035 phase 004 only after the live run validates the flip.

---

## 12. Consolidated residual risks

- **Fan-out receipt/progress parity is NOT solved.** Single-executor CLI branches route through the audited receipt writer; `fanout-run.cjs` does not (verified: zero `runAuditedExecutorCommand`/`receiptDir`/`dispatchId` in 1843 lines). A build phase must route fan-out through the audited writer or a parity adapter with identical intent/completion validation. T002 must not claim fan-out receipt parity.
- **Byte-identical fallback** depends on the OpenCode renderer not normalizing whitespace around shell-interpolation output; if it does, the renderer must own the whole legacy body and keep the bootstrap outside the compared payload.
- **Deterministic dispatch id** requires refactoring current random ids in YAML-rendered Node snippets before receipt validation can bind reliably.
- **Pre-cap finalizer** can't rely on early token-budget signals from external CLIs; fallback is wall-clock + artifact/progress based. Advisory macOS/BSD locks keep single-writer safety best-effort.

---

## 13. Feasibility

Confirmed research-sized (matches the seed verdict + plan-review GAP-53/54): schema + review-only compiler M; drift-guard + CI M-L; setup loader L; rollout consumer + manifest + comparator M-L; retrofit of all commands + 14 agents L; fan-out parity M; pacing/resume + convergence M-L. The phase breakdown is in `phase-decomposition.md`.
