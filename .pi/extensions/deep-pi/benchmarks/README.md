# DeepPi Benchmarks

---

## 1. OVERVIEW

Micro-benchmarks that measure the CPU cost of the prefix-shape operations the `before_provider_request` hook performs on every provider call: cloning the request payload and computing SHA-256 digests of its system prompt, tool schemas, and conversation messages.

---

## 2. KEY FILES

| File | Role |
| --- | --- |
| `before-provider-request.mjs` | Synthetic benchmark that generates payloads at four conversation lengths (10, 50, 200, 800 turns), measures three operations (`clone`, `digest`, `clone+digest`) over 500 measured rounds after 50 warmup rounds, and prints a JSON results object with per-operation elapsed milliseconds and ms-per-operation. Uses a deterministic seeded shuffle to avoid order bias. A `sink` variable prevents dead-code elimination. |

---

## 3. ENTRYPOINTS

```bash
node benchmarks/before-provider-request.mjs
```

The script prints a JSON object to stdout containing the Node version, warmup and measured round counts, and per-case timing results.

---

## 4. RELATED

- [deep-pi README](../README.md)
- [Changes from Upstream](../CHANGES-FROM-UPSTREAM.md)
