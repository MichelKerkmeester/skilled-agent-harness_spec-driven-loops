# Probe contract v2

This contract freezes the language-neutral meaning of Supercov's second probe
format. The Rust engine implements it directly; target-language runtime shims
may not weaken these semantics.

## Exact decision encoding

A compound decision with `n` source-ordered conditions has one numeric frame.
The frame starts at zero. When condition `i` is evaluated, exactly one base-3
digit is added:

- `0 * 3^i`: the condition was not reached;
- `1 * 3^i`: the condition was reached and was false;
- `2 * 3^i`: the condition was reached and was true.

The decision outcome is stored separately. Thus short-circuit `null` values in
the v1 `McdcVector` are never conflated with evaluated false values. Recording
must reconstruct the exact v1 vector and must produce the same stable decision
ID, manifest, evidence, witness result, and per-test/phase attribution as v1.

JavaScript's number transport is exact through 32 conditions, including the
doubled outcome index. Wider decisions must use the exact v1 frame transport;
they may not be truncated, aliased, or omitted. Other language frontends may
use a wider integer or bitmap while preserving the same ternary semantics.

## Evaluation and transport

- A condition expression is evaluated exactly once and its original value is
  returned to native control flow.
- The complete decision value is evaluated before the encoded frame is passed
  to the recorder. Argument evaluation order must not expose a stale frame.
- Point IDs and decision IDs remain stable strings in published evidence.
  File-local numeric indices are runtime-only implementation details.
- One epoch represents one exact run, worker, test, retry, and phase context.
  Repeated observations may be suppressed only inside that epoch.
- Async context switches must activate the matching epoch before user code
  resumes. Concurrently interleaved attempts must never share an epoch.
- If a host cannot provide a fast context-switch hook, probes must fall back to
  resolving context on the probe path. Performance may degrade; attribution
  may not.
- Browser adapters must activate a new epoch whenever test or phase identity
  changes, including pages, frames, workers, and newly created documents.

## Conformance gates

Every probe-v2 implementation must keep all of these passing:

1. v1/v2 manifests and normalized evidence are identical across the generated,
   property, hand-written, Test262, and ecosystem corpora.
2. Original and v2 programs have identical values, errors, side effects, and
   ordering across that corpus.
3. Interleaved async attempts, retries, phases, browser workers, and cloned
   processes retain exact attribution.
4. No supported decision silently falls outside the denominator.
5. Median runtime overhead is at most 1.10x on the pinned realistic benchmark;
   the adversarial empty hot loop is reported in absolute time as a separate
   stress metric rather than disguised as a representative ratio. The tighter
   1.05x target is deferred optimization work, not an architecture gate.
