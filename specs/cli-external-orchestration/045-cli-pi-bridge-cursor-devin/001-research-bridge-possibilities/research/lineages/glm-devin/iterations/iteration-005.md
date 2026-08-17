# Iteration 5: Ranked verdict and parent-purpose alignment

## Focus
Order the candidate paths by technical feasibility and account-safety, map each to the parent spec's purpose, state the recommendation, and list the open feature requests to track.

## Actions Taken
- Re-read the parent spec `specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/spec.md` for the purpose and phase-transition rules.
- Aggregated the four prior iterations' findings, ruled-out directions, and residual UNKNOWNs into a ranked verdict matrix.
- Cross-checked each path against the parent spec's in-scope/out-of-scope boundaries.

## Findings

### F1. Five candidate paths identified across the four iterations
Synthesizing iterations 1–4, the distinct paths to surface Cursor/Devin models in Pi's `/model` picker are:

| # | Path | Auth source | Upstream target | Pi hook |
|---|------|------------|-----------------|---------|
| P1 | Built-in Pi Cursor/Devin provider | n/a | n/a | n/a |
| P2 | Token-reuse HTTP (Cursor) | `cursor-agent` OAuth / `CURSOR_API_KEY` | `api2.cursor.sh` (private) | `models.json` or `registerProvider` |
| P3 | Token-reuse HTTP (Devin) | `credentials.toml` `windsurf_api_key` | `server.codeium.com` (private) | `models.json` or `registerProvider` |
| P4 | Reverse-engineered OpenAI proxy | user token | private Cursor/Devin backend | `models.json` (localhost gateway) |
| P5 | CLI-spawn OpenAI gateway | official CLI's own auth | official CLI subprocess | `models.json` (localhost gateway) |

[SOURCE: iterations 1–4 findings aggregation]

### F2. Ranked verdict matrix
| Path | Technical feasibility | Account-safety | ToS | Parent-purpose fit | Verdict |
|------|----------------------|----------------|-----|-------------------|---------|
| P1 Built-in | **Not feasible** — no built-in Cursor/Devin provider exists (iter 1) | n/a | n/a | n/a | **Ruled out** (iter 1) |
| P2 Cursor token-reuse HTTP | Feasible mechanically, but `api2.cursor.sh` is private Connect-RPC, not one of Pi's 9 API types; would need `streamSimple` reverse-engineering | **Unsafe** — account ban risk | **Violates §1.5** (staff ruling, iter 2) | Fails ToS/account-safety scope | **Ruled out** (iter 2) |
| P3 Devin token-reuse HTTP | Not feasible — `api.devin.ai` v3 is session REST, not chat completions; `server.codeium.com` is private | **Unsafe** — full account credential exposure | **Violates §2.3 analog** (iter 3) | Fails ToS/account-safety scope | **Ruled out** (iter 3) |
| P4 Reverse-engineered proxy | Feasible mechanically (exemplar: `Cursor-To-OpenAI`) | **Unsafe** — ban risk | **Violates §1.5(i)** (re-confirmed iter 4) | Fails ToS/account-safety scope | **Ruled out** (iter 4) |
| P5 CLI-spawn gateway | **Feasible** (exemplar: `cursor-agent-api-proxy`; Pi `models.json` with `openai-completions`) | **Ambiguous** — uses official client but exposes subscription to third-party harness; unresolved by staff letter | **ToS-ambiguous** for Cursor; **worse for Devin** (session-per-request, minutes) | Partial — adds a Pi-picker affordance but duplicates existing executor dispatch with nested-harness cost | **Conditionally feasible, not recommended** |

### F3. Recommendation: do not build a native Pi Cursor/Devin bridge now
**No path is both technically clean and account-safe.** The four ToS-blocked paths (P1–P4) are ruled out with first-hand evidence. The sole technically-feasible path (P5, CLI-spawn gateway) is ToS-ambiguous for Cursor, worse for Devin (session-based, unsuitable for interactive `/model`), and duplicates the repo's existing `cli-cursor`/`cli-devin` executor dispatch with extra hops and a nested-harness cost that breaks Pi's native tool loop. The parent spec's purpose is to investigate feasibility and ToS/account-safety — not to ship a bridge — so the correct output is a **not-feasible-now verdict with open feature requests**, not an implementation. [SOURCE: parent spec.md purpose + scope] [SOURCE: iterations 1–4]

### F4. Open feature requests to track (the unblock conditions)
The research identifies two vendor-side feature requests whose shipment would change the verdict:

1. **Cursor public OpenAI-compatible `/v1/chat/completions`** — staff confirmed this is an open feature request, not a shipped product. If shipped, a Pi `models.json` provider could call it directly with `CURSOR_API_KEY` (User API Keys are already a supported headless auth), eliminating the reverse-engineering and private-endpoint ToS issues. [SOURCE: https://forum.cursor.com/t/.../167778 staff reply] [SOURCE: .opencode/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md:72-91]

2. **Devin raw-completions surface** — Devin's public API is session REST (`POST .../sessions`), not chat completions. A raw-completions surface (or a `cog_` service-user key path for consumer Pro) would enable a Pi `models.json` provider. Currently UNKNOWN whether consumer Devin Pro can mint v3 `cog_` keys. [SOURCE: https://cognitionai.mintlify.app/api-reference/overview] [SOURCE: iteration 3 residual UNKNOWN]

3. **(Secondary) Cursor staff clarification on CLI-spawn gateways** — the staff letter did not resolve whether fronting the official CLI (not private endpoints) is ToS-safe. A clarification would resolve the P5 ambiguity. [SOURCE: iteration 4 residual UNKNOWN]

### F5. Parent-purpose alignment and phase-transition note
The parent spec defines the problem as investigating how `cli pi` can natively expose Cursor/Devin subscription-backed models, with ToS/account-safety in scope and implementation out of scope. This packet answers all five key questions with first-hand evidence:
- Q1 (Pi picker architecture) — answered iter 1
- Q2 (Cursor auth reuse) — answered iter 2 (ToS-blocked)
- Q3 (Devin auth reuse) — answered iter 3 (ToS-blocked)
- Q4 (Local gateway) — answered iter 4 (feasible but nested-harness + ToS-ambiguous + duplicates executor)
- Q5 (Ranked verdict) — answered iter 5 (no clean path; track vendor feature requests)

The parent spec's phase-transition rules gate implementation on a research verdict. The verdict is **not-feasible-now** pending the two vendor feature requests above. Any future implementation packet should re-verify the ToS landscape at that time, since both Cursor's ToS (last updated Aug 13, 2026) and Cognition's (last updated Jun 30, 2026) are recent and may change. [SOURCE: parent spec.md phase-transition rules]

### F6. What this repo should do instead
The repo already has the correct architecture for Cursor/Devin access: the `cli-cursor` and `cli-devin` skills dispatch to the official CLIs as executors with enforced allowlists. The research confirms this is the ToS-safe path. The repo should:
1. Keep the existing `cli-cursor`/`cli-devin` executor dispatch as the supported Cursor/Devin surface.
2. Track the two vendor feature requests (F4) and re-evaluate when either ships.
3. Not add a Pi `models.json` Cursor/Devin provider or a CLI-spawn gateway, since both are either ToS-blocked or offer no advantage over the existing executor.

[SOURCE: .opencode/skills/cli-external-orchestration/cli-cursor/references/providers-and-models.md:43-73] [SOURCE: parent spec.md scope (existing executors out of scope to change)]

## Questions Answered
- Q5 (full): Ranked verdict — P1–P4 ruled out (ToS-blocked or not feasible); P5 conditionally feasible but not recommended (ToS-ambiguous, nested-harness, duplicates existing executor). Recommendation: do not build a native Pi Cursor/Devin bridge now; track Cursor public `/v1/chat/completions` and Devin raw-completions feature requests; keep existing `cli-cursor`/`cli-devin` executor dispatch as the supported surface.

## Questions Remaining
None — all five key questions answered.

## Dead Ends
(none new)

## Ruled Out
(none new — P1–P4 already ruled out in prior iterations; P5 is conditionally feasible but not recommended)

## Reflection
What worked: aggregating four iterations of first-hand evidence into a single ranked matrix made the verdict legible. What failed: nothing this pass. Negative knowledge: the parent spec's purpose was investigation, not implementation — the correct output is a verdict with open feature requests, not a bridge.

## Assessment
- newInfoRatio: 0.45
- Novelty justification: The five-path synthesis, the ranked verdict matrix, the three open feature requests, and the parent-purpose alignment are new syntheses (not new evidence). The underlying evidence is from iterations 1–4.
- Confidence: high on the verdict (all five paths assessed with first-hand evidence); medium on the vendor feature-request timelines (staff said "no firm timeline").

## Recommended Next Focus
phase_synthesis: write `research/research.md` (canonical synthesis), `research/resource-map.md`, final dashboard, and final findings-registry. Then output `FANOUT_LINEAGE_COMPLETE:glm-devin`.

## SCOPE VIOLATIONS
None.
