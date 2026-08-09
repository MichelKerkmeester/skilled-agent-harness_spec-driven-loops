# bench

`gr bench --bmb` scores Graphene's belief layer against MnemeBrain's belief
maintenance benchmark. The scenarios, the runner and the scoring are the
benchmark's own; this directory holds only the adapter and the recorded result.

The benchmark is pinned, not vendored:

```
git clone https://github.com/mnemebrain/mnemebrain-benchmark
cd mnemebrain-benchmark && git checkout c8bd56a809c3ac624817370dc8b9eb5cdf6a7342
```

then, from the repository root:

```
gr bench --bmb
```

which writes `score.json`.

## Reading the result

Graphene declares only the capabilities its belief layer implements, so the
categories it does not claim are **skipped by the benchmark, not scored zero**.
Five of the eight are skipped — temporal decay, counterfactual sandboxing,
consolidation, multi-hop retrieval and pattern separation — because they belong
to the knowledge-base component, which does not exist yet.

That scope line is the useful output, more than the headline number. Spec
[10](../specs/10-verification.md) §2 asked for this run before the rest of the
system exists, so the boundary would be drawn from evidence rather than opinion.

`known_divergences` in `score.json` records the checks Graphene fails on purpose,
with the reason. **A divergence that is not written down there is a defect**, not
a difference of opinion.

## Why the adapter holds no belief logic

Every operation shells out to `gr`. If Graphene scores well here it is because
the belief layer earned it, and the way to check that claim is to read
`graphene_adapter.py` and see that there is nothing in it to score.

The adapter does compute one thing Graphene does not hold: a scalar confidence.
Graphene keeps a four-valued truth state and a fidelity rung, deliberately, and
the benchmark asks for a number. It is derived from the evidence on record, the
same way every time, and the derivation is in `_confidence`.
