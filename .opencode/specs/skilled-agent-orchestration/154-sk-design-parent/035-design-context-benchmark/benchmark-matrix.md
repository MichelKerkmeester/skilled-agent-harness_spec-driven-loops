# Benchmark Matrix — context-loading contract efficacy (A/B)

**Design:** each small model built the SAME card (Anobel "Bestellimieten", 560×480) twice — **(A)** baseline, no contract; **(B)** with the context-loading dispatch protocol (manifest + read the contract/cards + emit proof fields). Test subjects: **MiniMax M3** (`minimax/MiniMax-M3`, TIDD-EC) and **Kimi K2.7** (`kimi-for-coding/k2p7`, COSTAR). Both transports live; no substitution needed. All 4 runs exited 0 and wrote `card.html` + `notes.md` to their run dir only (scope clean).

## Rubric scores (1 = present/correct, 0 = absent, ◐ = present-but-flawed)

| # | Rubric criterion | minimax-A | minimax-B | kimi-A | kimi-B |
|---|---|:--:|:--:|:--:|:--:|
| 1 | Register set first (Brand/Product + why + dials) | ✗ | ✓ | ✗ | ✓ |
| 2 | Contrast-pair inventory done early | ✗ | ✓ | ✗ | ◐ |
| 3 | Interface pre-flight emitted | ✗ | ✓ | ✗ | ✓ |
| 4 | Audit evidence labeled (confirmed/inferred/n-a) | ✗ | ✓ | ✗ | ✓ |
| 5 | Both cards present (context-loaded + proof-of-application) | ✗ | ✓ | ✗ | ✓ |
| 6 | Four observed misses avoided | ✗ | ✓ | ✗ | ◐ |
| | **Score / 6** | **0** | **6.0** | **0** | **5.0** |
| | **Lift (B − A)** | **+6.0** | | **+5.0** | |

## What baseline (A) did — the misses recurred
- **minimax-A**: dove straight into IA; **no register**, no dials, no inventory, no pre-flight, no cards. Its accessibility note asserted `#787878` on white ≈ **4.6:1 (AA pass)** and shipped it as muted text. Independently computed, `#787878`/white = **4.42:1 — FAILS** body 4.5:1. The late-contrast miss recurred and shipped a latent WCAG-AA defect.
- **kimi-A**: same shape — no register/inventory/pre-flight/cards; prose-only accessibility; used gold once (within "rare").

## What the contract (B) changed
- **minimax-B (6/6)**: set register first (Product, V4/M2/D6), then a **rigorous Python-computed contrast inventory** that **caught `#787878` at 4.42:1 and moved all body text to `#043367` (12.54:1, verified)**, scoped out `#dbab00` (2.13:1 on white), walked the full interface pre-flight (verdict SHIP), and labeled audit evidence across 5 dimensions. Both cards filled. Every observed miss explicitly prevented.
- **kimi-B (5/6)**: produced the **full proof structure** — register first (Product, V1/M1/D4), a 12-pair inventory, a compact pre-flight, labeled audit evidence, both cards. **Flaw (◐):** its contrast math mislabeled failing pairs as pass — `#787878`/`#f2f3f6` reported "4.1:1 pass" (actual 3.98, fails) and `#787878`/white "4.5:1 pass" (actual 4.42, fails). The mechanism fired; the model's arithmetic didn't fully hold.

## Verdict — does the contract work?
**Yes, measurably.** Handing a delegated small model the contract (condition B) flips behavior from "every miss recurs, 0/6" to "all proof fields filled, 5–6/6" — a **+5 to +6 lift, consistent across two different models and prompt frameworks**. For the **delegated dispatch path**, the advisory contract carried by the dispatch template is empirically **sufficient** to change behavior; no executable gate was needed for the models to comply.

## Caveats (honest, and they point at the next fix)
1. **Weak-model arithmetic is the soft spot.** kimi-B ran the inventory but mislabeled two failing contrast pairs as pass. The mechanism made it *do* the check; it didn't make the check *correct*. This is concrete evidence for the deferred **deterministic contrast script** (research §17) — a calculator the model calls, not eyeballs.
2. **This tests the delegated path, not the orchestrator's own discipline.** The lift comes from the model being *handed* the contract. No one hands the orchestrator the contract — which is why the deep review's F-004 (executable/router enforcement, or a hard self-check) matters most for the *orchestrator* path, even though it is not required for *delegation*.
3. **n=1 per cell** (one build per model×condition). Direction is unambiguous (0→5/6) but not a multi-sample statistical result.
