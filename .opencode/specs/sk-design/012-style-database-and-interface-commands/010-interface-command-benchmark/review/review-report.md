# /interface:* Benchmark Scorecard — Structure + Live Multi-Model Quality

> Hybrid benchmark. Structure axis = deterministic conformance. Live axis = `/interface:design` on one
> shared brief (Product-register analytics-dashboard **empty state**) across three executors. Evidence:
> `legs/leg{1,2,3}-*.{json,md,txt,log}`. Run 2026-07-22.

## Axis 1 — Structure / conformance (deterministic)

`interface-command-contract.test.mjs` → **8/8 pass**. Per-command router conformance:

| Command | Router-detected | One `@`-include | No command-taste | Modes wired |
|---|:--:|:--:|:--:|:--:|
| `/interface:design` | ✓ | ✓ (1) | ✓ | ✓ |
| `/interface:foundations` | ✓ | ✓ (1) | ✓ | ✓ |
| `/interface:motion` | ✓ | ✓ (1) | ✓ | ✓ |
| `/interface:audit` | ✓ | ✓ (1) | ✓ | ✓ |
| `/interface:design-reference` | ✓ | ✓ (1) | ✓ | ✓ |

All five conform. **Structure axis: PASS.**

## Axis 2 — Live output quality (`/interface:design`, one shared brief)

| Leg | Transport | Model | Reaches command via |
|---|---|---|---|
| 1 | cli-opencode | `deepseek/deepseek-v4-pro --variant high` | native `--command interface/design :auto` |
| 2 | cli-opencode | `xiaomi/mimo-v2.5-pro` | native `--command interface/design :auto` |
| 3 | cli-codex | `gpt-5.6-luna` (high, fast) | raw prompt — presentation + shared contract inlined |

| Rubric dimension | Leg 1 deepseek | Leg 2 mimo | Leg 3 LUNA |
|---|---|---|---|
| **1. Presentation fidelity** (8 visible blocks) | **8/8** | **8/8** | **8/8** |
| **2. Grounding discipline** (Reuse Report + Violation Scan) | Full · honest `no-fit` | Full · honest `no-fit` | Full · honest `no-fit` |
| **3. Proof-tier honesty** | Honest — `validated (advisory)`, "render-dependent blocked until build" | Honest — `PROOF_TIER=validated`, "no runtime render" | Honest — `PROOF_TIER=observed` (most conservative), explicit "no measured/validated/verified claims" |
| **4. Real content + states** | Full — empty/first-run/loading, no lorem | Full — empty/first-run/loading, no lorem | Full — empty/first-run/loading, no lorem |
| **5. Design taste** (specificity density) | **Strong** — ~110 token/palette/type/motion specifics; gauge-as-identity | Moderate — ~38 specifics; ghost-pulse motion | **Thin** — ~6 specifics; structurally complete but design-sparse |
| **6. Artifact-first output** | ✓ leads with direction spec | ✓ ends `STATUS=OK PRODUCES=…` | ✓ leads with artifact |
| Artifact size (extracted) | 27.2 KB | 20.3 KB | 9.7 KB |

## Verdict

**Presentation-contract fidelity is portable and robust.** All three executors emitted all 8 visible blocks
with full grounding discipline and honest proof tiers — **including the codex/LUNA leg driven by a raw
inlined prompt with no OpenCode command runtime.** This validates packet `009`'s presentation-asset design:
the contract survives a cross-runtime port. No executor overclaimed a proof tier on a read-only run.

**Design output quality does NOT travel as well as structure.** Ranked on taste/specificity:
**deepseek (strong) > mimo (moderate) > LUNA (thin)** — 110 vs 38 vs 6 design specifics; 27 vs 20 vs 10 KB.
The two native cli-opencode legs, which load the full `sk-design` interface mode, produced markedly richer,
more distinctive directions than the raw-prompt codex leg. Structure ports on the presentation asset alone;
taste needs the mode.

**Best overall live executor: cli-opencode + `deepseek-v4-pro`** — top design richness, full contract,
honest proof. `mimo-v2.5-pro` is a solid, cheaper second (same structure, lighter taste). `gpt-5.6-luna`
proves contract portability and had the most conservative proof discipline, but is design-sparse as a raw
port — it would need a native design path to compete.

## Cross-runtime finding (answers the spec's open question)

The codex/LUNA taste gap is a **transport** limitation, not a model-quality verdict: LUNA got the contract
as inlined text with no `sk-design` mode, no design-system loader, and no register/dial resolution beyond
the manifest. A **native cli-codex design path** (loading `sk-design` the way cli-opencode does) would
close most of the gap — which is exactly the driver-leg work packet
`035/015-command-benchmark-cli-opencode-driver` scopes (for cli-opencode; the same pattern would extend to
cli-codex). Until then, run live `/interface:*` quality benchmarks through **cli-opencode**, not a raw
codex port.

## Method notes / honesty

- One brief, one command (`/interface:design`) — the flagship, best proxy for presentation-contract
  fidelity. `foundations`/`motion`/`audit` live runs are a noted extension, not run here.
- `deep:command-benchmark` was **not** used — its frozen conformance/behavior engines cannot select these
  models (established before this run); this bespoke harness was built instead.
- Scores are from the real leg artifacts under `legs/`; taste "specificity density" is a keyword-count
  proxy (palette/type/motion/token mentions), a directional signal, not an absolute quality metric.
