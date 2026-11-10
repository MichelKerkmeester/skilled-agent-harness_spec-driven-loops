# Iteration 4: runtime/hooks/lib, runtime/hooks/pi, spec-gate adapters (cross-runtime)

## Focus
Priority surface 4 — `runtime/hooks/lib`, `runtime/hooks/pi` and the spec-gate `.mjs` adapters across claude/codex/cursor/devin: parity between runtimes, swallowed errors, path handling, hook conventions.

## Findings

### F4.1 [P1] cursor and devin `spec-gate-classify.mjs` duplicate the shared `hook-adapter-shared.mjs` stdin/parse helpers that claude/codex classify adapters reuse
- **Code:** `runtime/hooks/cursor/spec-gate-classify.mjs:26-33` (local `readStdin()`) and `:37-43` (inline `JSON.parse` try/catch); `runtime/hooks/devin/spec-gate-classify.mjs:29,42` (same). Contrast: `runtime/hooks/claude/spec-gate-classify.mjs:22-23` and `runtime/hooks/codex/spec-gate-classify.mjs` import `parseJsonFailOpen, readStdin` from `../lib/hook-adapter-shared.mjs`.
- **Standard:** `shared/code-organization/imports-and-exports.md` §1 (single source of truth for a helper); `universal/code-quality-standards.md` §7 design-restraint ladder rung 4 (reuse the available helper rather than reimplementing).
- **What is present:** `runtime/hooks/lib/hook-adapter-shared.mjs:8,14` exports `readStdin()` and `parseJsonFailOpen()` specifically so hook adapters stop repeating this boilerplate inline. The enforce adapters (all four runtimes) use it; the classify adapters are inconsistent — claude and codex import the shared helpers, while cursor and devin re-implement them verbatim (same `Buffer.concat` chunk loop and the same `try { JSON.parse } catch { return null/approve }`). The cursor/devin copies carry the same semantics as the shared helper but are a second duty to keep in sync.
- **Severity:** P1 — a duplicate helper with an intra-family parity divergence; a change to stdin collection or fail-open parsing must be applied in three places (shared + cursor + devin), and the two classifiers silently drift from the shared code path.
- **One-line fix:** **mechanical** — replace the local `readStdin()`/inline `JSON.parse` in `cursor/spec-gate-classify.mjs` and `devin/spec-gate-classify.mjs` with `import { parseJsonFailOpen, readStdin } from '../lib/hook-adapter-shared.mjs';`.

### F4.2 [P2] cursor `spec-gate-classify.mjs` is documented dormant and emits a different output contract than its wired siblings
- **Code:** `runtime/hooks/cursor/spec-gate-classify.mjs:6-19` (STATUS: dormant, `beforeSubmitPrompt` never fires under cursor-agent), `:33` (`approve()` writes `{ permission: 'allow' }`), `:75-76` (`agent_message: result.question`) versus `runtime/hooks/claude/spec-gate-classify.mjs:25-27,59-62` (`{ hookSpecificOutput: { hookEventName, additionalContext }}`).
- **Standard:** `shared/code-organization/imports-and-exports.md` §1 (a single adapter should match its family's contract unless divergence is recorded); `universal/code-quality-standards.md` §7 rung 1 (don't keep dormant scaffolding a runtime cannot reach).
- **What is present:** The cursor classify adapter is explicitly not wired to any confirmed CLI attachment point, yet it remains in the tree and uses a different output shape (`permission`/`agent_message`) than the live `hookSpecificOutput`/`additionalContext` shape shared by claude/codex/devin. So runtime Gate-3 parity is incomplete: cursor never surfaces the question even when the sibling runtimes do, and its dormant adapter's contract cannot be exercised by the live hook surface.
- **Severity:** P2 — documented dormant adapter; parity and maintenance cost, not a live correctness break (it does not fire). The divergence is recorded in its header, so this is a documentation/cleanup concern rather than a silent drift.
- **One-line fix:** **judgment-required** — either register the cursor hook once a `beforeSubmitPrompt` attachment is confirmed (and align its output to `hookSpecificOutput`/`additionalContext` to match siblings), or remove the dormant adapter and note cursor as a non-carrying runtime.

## Sources Consulted
- `runtime/hooks/lib/hook-adapter-shared.mjs:8,14`
- `runtime/hooks/claude/spec-gate-classify.mjs:22-23,25-27,59-62`
- `runtime/hooks/codex/spec-gate-classify.mjs` (shared-helper import)
- `runtime/hooks/cursor/spec-gate-classify.mjs:6-19,26-43,75-76`
- `runtime/hooks/devin/spec-gate-classify.mjs:29,42`
- `runtime/hooks/lib/spec-gate/spec-gate-core.mjs` (fail-open contract)
- `shared/code-organization/imports-and-exports.md`
- `shared/references/universal/code-quality-standards.md`

## Assessment
- **newInfoRatio:** 0.55
- **Novelty justification:** The classify-adapter helper duplication (cursor + devin reinventing `readStdin`/`parseJsonFailOpen` that claude/codex import, despite the shared module existing for exactly this) is new; the dormant cursor adapter's divergent output contract is a secondary parity observation.
- **Confidence:** High for F4.1 (diff + direct read confirm the local copies and the shared import); Medium for F4.2 (the dormancy is stated in the file header, so the "never fires" claim is the author-documented status, not independently re-proven here). Confirmed-negatives: the many `catch (_) {}` blocks in `spec-gate-core.mjs` are each documented fail-open (the header states "Every entrypoint fails OPEN; ... a classifier throw ... resolves to allow/no-op") — deliberate, not silent swallows. The completion-evidence `main().catch(...)` catches are the already-fixed set and were not re-reported.

## Reflection
- What worked: Differencing the four runtime `spec-gate-classify.mjs` adapters exposed which ones reuse the shared helper and which reinstate it — a parity check a single-file read hides.
- What failed: The error-handling half of this angle is dominated by documented fail-open catches, so there was little to report beyond the duplication; the pi/hook-adapter (TS) surface uses a structured error path rather than empty catches.
- Ruled out: Reporting the `catch (_) { ... }` blocks in `spec-gate-core.mjs` as swallowed errors — each is a reasoned fail-open path (transport-free core must never block a guarded mutation), matching the module's explicit contract.

## Recommended Next Focus
Iteration 5 — `shared/**` beyond config/gate-3-classifier/frontmatter/path-containment: algorithms, contracts, ranking/scoring/chunking/predicates/embeddings providers — dead code, boundaries, coverage floor, retired residue.
