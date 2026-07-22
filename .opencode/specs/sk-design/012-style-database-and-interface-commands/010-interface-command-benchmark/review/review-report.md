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

---

# V2 — Prompt-Parity Rerun (correction of the v1 verdict)

> Triggered by an independent Opus review that found the v1 verdict confounded: the codex/LUNA leg alone
> was handed a handicapping manifest (`colorStrategy=owned-tokens`, "cap PROOF_TIER at observed", "do not
> fabricate tokens") while the native legs self-resolved to author concrete hex, and the three legs solved
> different problems (different domains/themes/densities). V2 re-runs all three on ONE fully-specified brief
> (engineering-metrics domain, dark theme, comfortable density, `colorStrategy=Restrained` for all) with an
> **equalized instruction set** — the codex leg leveled UP to native parity (author concrete hex, proof
> ceiling `validated`). Evidence: `review/legs-v2/`.

## V2 results (equalized)

| Metric | deepseek (cli-opencode) | mimo (cli-opencode) | LUNA (cli-codex, un-handicapped) |
|---|---|---|---|
| Visible blocks | 8/8 | 8/8 | 8/8 |
| Taste specificity (proxy) | 70 | 46 | **23** |
| Concrete hex tokens | 28 | 26 | **11** |
| Proof ceiling | `validated` | `validated` | `validated` |
| Contrast label | `validated` | `validated` (**v1 was `measured` — fixed**) | `validated` / `blocked` |
| Cost (this run) | ~$0.0192 | ~$0.0200 | (codex, ChatGPT-OAuth — not $-metered) |
| Fixed domain honored | ✓ | ✓ | ✓ |

## What v2 corrects in the v1 verdict

1. **The v1 "~18× taste gap" (110 vs 6) was mostly an artifact — it compressed to ~3× (70 vs 23).** LUNA,
   told to author concrete hex like the native legs, produced **11 hex tokens (v1: zero, "values
   unassigned")** and quadrupled its specificity (~6 → 23). Most of the v1 gap was **my prompt handicap**
   (`owned-tokens` + don't-fabricate suppressed exactly the tokens the proxy counts), plus deepseek's
   verbosity (three repeated ASCII state diagrams), plus the legs solving different problems. **Not
   transport.**
2. **The corrected finding: taste needs the *dials in the prompt* more than it needs the *mode*.** The
   native command's value is that it resolves those dials (colorStrategy, density, proof ceiling)
   automatically — but a raw codex port handed the same dials closes ~75% of the gap. A **modest, real**
   residual remains (native ~70/46 vs raw-port ~23; ~2.5× more concrete hex), so the native path is still
   better for live design work — but the effect is small, not the order-of-magnitude v1 implied.
3. **"No executor overclaimed" (v1) was false and is now moot.** mimo's v1 leg labeled WCAG contrast
   `measured` (v1 `leg2-mimo.md:342`) — an overclaim on a read-only run. The **explicit v2 proof
   convention fixed it**: all three v2 legs label contrast `validated` and reserve `measured`/`verified`
   for a real render. This confirms the reviewer's P2 (state the rule in the contract).
4. **"mimo a cheaper second" (v1) is refuted.** With cost now surfaced: deepseek ~$0.0192 vs mimo ~$0.0200
   on this run — mimo is marginally *more* expensive, not cheaper.
5. **Portability still holds** — all three still emitted 8/8 blocks under the equalized, fully-specified
   brief, with honest proof tiers.

## Corrected bottom line

**Trust:** the presentation contract is portable (8/8 across all three, both runs); the proof-tier discipline
works when the convention is explicit; the native cli-opencode path is a **modest** design-quality win over a
raw codex port, not a large one. **Retract from v1:** the ~18× taste gap, "taste needs the mode," "no
overclaims," and "mimo cheaper" — all artifacts of an asymmetric harness. **Still open (P1, not run here):**
repeats/variance (n=1 per leg) and a blind rubric-scored taste judgment to replace the verbosity-biased
keyword proxy.

---

# V3 — Blind Rubric Judgment (replaces the keyword-count taste proxy)

> The reviewer's other P0: the keyword-count taste proxy is verbosity-biased and untrustworthy. V3 tests
> it directly. The three v2 artifacts were **anonymized** (model tells scrubbed) and **shuffled**
> (A=mimo, B=LUNA, C=deepseek — mapping withheld from the judges), then scored **blind** by **three
> independent Claude-Opus judges** (a different model family from all three contestants) on a 5-dimension,
> 1–5 rubric: distinctiveness, coherence, state-completeness, concreteness/buildability, rigor/honesty.

## Aggregate (n=3 judges, unanimous ranking)

| Direction → model | J1 | J2 | J3 | Avg /25 | Blind rank | Keyword-proxy rank (v2) |
|---|---|---|---|---|---|---|
| **B → gpt-5.6-luna** (cli-codex, raw port) | 24 | 24 | 24 | **24.0** | **1st** | 3rd (last) |
| **C → deepseek-v4-pro** (cli-opencode, native) | 23 | 24 | 23 | **23.3** | 2nd | 1st |
| **A → mimo-v2.5-pro** (cli-opencode, native) | 15 | 15 | 16 | **15.3** | 3rd | 2nd |

All three judges, independently and blind, produced the **identical** ordering: **LUNA ≈ deepseek ≫ mimo**.

## What V3 overturns

1. **The keyword-count taste proxy is not just imprecise — it INVERTED the ranking.** It ranked LUNA
   *last* (23) where blind design judgment ranks it *first* (24.0); it ranked mimo *second* (46) where
   judgment ranks it *last* (15.3). Only deepseek's position (proxy 1st → blind 2nd) was roughly right.
   The proxy rewarded concrete-token *verbosity* and missed *design coherence*. **Retire it as a quality
   metric** (the reviewer's P0, now empirically confirmed).
2. **Design quality tracked the MODEL, not the transport.** The raw cli-codex port (gpt-5.6-luna) was
   judged the best direction on this brief — beating both native cli-opencode legs. So even the v2
   "native path is a modest design win" is not supported by blind judgment: once prompts are equalized,
   **model reasoning drove quality more than native-vs-raw transport.** The native path's real value is
   *convenience* (it auto-resolves the dials), not a quality ceiling.
3. **Why LUNA won (judges' consensus):** its "Signal Path" concept binds the fixed PR→Review→Cycle→Deploy
   metric sequence into a four-node pipeline that activates on data — unifying palette, motion, layout,
   and copy around one idea — and it was the only entry to author empty / first-run / loading / error as
   four distinct states with per-metric copy, plus the most disciplined proof ledger. deepseek's
   terminal/CLI direction was a close, highly-rigorous second; mimo's concentric-pulse + sidebar/card-grid
   was judged the templated AI-default dashboard it claimed to avoid (no error state, thin rigor, one judge
   flagged process-text leakage).

## Honest scope

- **Still n=1 brief, one run per leg.** This is a robust *method* result (3 blind judges unanimous → the
  proxy is unreliable, blind rubric is trustworthy) and a robust *single-brief* result (LUNA best here).
  It is NOT yet a general model ranking — a different brief or repeated runs could reorder the top two
  (LUNA and deepseek are within ~0.7/25). The **remaining P1** is repeats + multi-brief to test stability.
- The judges are Claude-Opus (independent of all three contestants), which removes same-family bias but is
  itself one family; a cross-family judge panel would harden it further.

## Final corrected bottom line (v1 → v2 → v3)

Portable presentation contract (verified, all runs). Proof-tier discipline works when the convention is
explicit. **Taste ranking, by trustworthy blind judgment on this brief: gpt-5.6-luna ≳ deepseek-v4-pro ≫
mimo-v2.5-pro** — the opposite of what the keyword proxy said, and driven by model quality, not transport.
Everything the v1 report concluded about executor ranking was an artifact of an asymmetric harness + a bad
metric; the corrected record is here.
