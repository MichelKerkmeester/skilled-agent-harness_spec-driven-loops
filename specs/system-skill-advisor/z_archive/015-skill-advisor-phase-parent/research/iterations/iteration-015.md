# Iteration 15: Round H Rust Reference — aionforge-trust → C4/D2 Beta Posterior (the from-scratch reference)

## Focus
Round H: mine the actual aionforge Rust `aionforge-trust` for the reference implementation of the reliability-weighted Beta posterior — C4 (Advisor) + D2 (Deep Loop) both confirmed to have ZERO internal Beta math. Read-only.

## Reference patterns (newInfoRatio 0.65)
| Technique | aionforge impl | Transferable to TS |
|---|---|---|
| Beta posterior closed form | trust.rs:43-57 — `α=prior_α+Σr, β=prior_β+Σ(1−r), score=α/(α+β)` | Ports VERBATIM (pure f64). The sybil-bound (denominator grows by exactly 1/attester → posterior asymptotes to attester-quality mean, can NEVER reach 1.0 by count) is the design reason vs log-odds pooling — must preserve |
| Per-source sanitize + canonical-order sum | trust.rs:46-53 (non-finite→0.5, else clamp[0,1]); promoter.rs:668-687 (sort by source id BEFORE summing) | `Number.isFinite` + clamp; sort sources by key before summing → byte-identical on replay |
| Two-gate AND promotion | promoter.rs:441-446 (`k>=needed_k && posterior>=threshold`); strictest_rule independent max-k/max-threshold :704-717 | AND of two orthogonal gates; demotion = re-run same gate negated (symmetric) |
| Cold-start neutrality | promoter.rs:691-697 (`reliability()` → 0.5 for unscored) | `?? 0.5` on map lookup; all-cold → prior mean, nothing promotes cold |
| **Reachability config-validation** | promoter.rs:147-177 — reject if `threshold > (prior_α+k)/(prior_α+prior_β+k)` (unsatisfiable AND-gates); k<2 rejected; threshold∈(0.5,1.0] | Highest-leverage correctness guard: reject dead config at construction, don't silently promote nothing. Validate priors before the reachability division |

## Key port note
The ENTIRE pipeline is pure arithmetic — ports cleanly to TS. Only the type-system (enums/Option/Result), Copy-id zero-alloc sort, and Ed25519-audit layer are Rust-specific (out of scope for C4/D2). **This is the complete from-scratch reference: build C4's promotion gate (and D2's reliability) directly on this formula + reachability validation.**

## Next Focus
C4/D2 are now reference-backed builds (the Beta posterior + reachability validation port verbatim). Feeds Round I/J (C4 build sketch + the migration plan).
