# deem-runtime — Rust CPU inference lane

Minimal high-performance CPU runtime for Deem letter-slot decision models
(Qwen3.5 hybrid backbone: 18 gated-delta-net linear-attention layers + 6
full-attention layers per 24, partial rope, zero-centered RMSNorm). No
Python, no C++ dependencies at runtime.

## Components

| Path | What |
|---|---|
| `src/safetensors.rs` | Minimal safetensors reader (bf16/f16/f32) |
| `src/config.rs` | HF `config.json` parsing (nested `text_config` or flat) |
| `src/kernels.rs` | AVX2/SIMD GEMM kernels; f32 and weight-only INT8 paths |
| `src/layers.rs` | RMSNorm, SwiGLU MLP, GQA attention + rope, chunked gated-delta-rule |
| `src/model.rs` | Weight loading (per-output-channel INT8 quantization at load), forward |
| `src/format.rs` | Byte-compatible port of `src/deem/format.py` (prompt, softmax, confidence) |
| `src/readout.rs` | Letter-slot readout (26-letter rows of the LM head only) |
| `src/tokenizer.rs` | `tokenizers` wrapper; single-token letter assertion |
| `src/server.rs` | `/v1/systemone` wire-compatible HTTP server |
| `src/bin/deem_server.rs` | `deem-server` binary (env vars mirror the Python server) |
| `tests/parity.rs` | Parity against torch reference tensors |

## Parity

`rust/parity/export_reference.py` dumps the exact serving path (HF
transformers, bf16) — tokens, per-layer hidden states, letter logits — to
`/tmp/opencode/deem-parity/raw/*.bin`. The parity test replays the same
prompt through the Rust runtime:

```bash
.venv-sft/bin/python rust/parity/export_reference.py \
    --checkpoint <ckpt> --out /tmp/opencode/deem-parity/ref.npz --device cuda
DEEM_PARITY_CKPT=<ckpt> cargo test --release parity
```

Current: max letter-logit diff **0.085** on logits of scale ±22 (bf16 noise;
Rust computes f32). Embeddings match exactly.

## Benchmarks

`gemmbench` (isolated GEMM) and `bench` (end-to-end forward) binaries.
Measured 2026-09-24 on a **heavily contended** Ryzen 9950X (other training
+ eval jobs running; treat as lower bounds):

| Path | 84 tok | 300 tok | 2000 tok |
|---|---|---|---|
| int8 (tiled, vpdpbusd) | 159 ms | **349 ms** | 2.2 s |
| bf16 (tiled, vdpbf16ps) | 181 ms | 385 ms | 2.5 s |
| f32 (AVX-512 dot) | — | 434 ms | 2.6 s |

`quantize: true` runs the int8 path: weights int8 with per-row scales,
activations quantized once per row-group to offset-encoded u8 with
per-512-element-block scales (Q8_0-style), 4x6 register-blocked tiles of
`vpdpbusd` with per-block offset correction. **~3.4 TFLOPs/s** isolated
(zero quality-loss flags; passes the 0.35 letter-logit parity gate).
`quantize: false` (default) loads weights straight from the checkpoint's
bf16 (exact, 1.6 GB resident) and runs the same tile structure with
`vdpbf16ps` (~1.5 TFLOPs/s). Without AVX-512 BF16/VNNI both fall back
to f32 automatically.

Instruction peaks measured on this Zen 5 (9950X), register-only:
vpdpbusd 695 GFLOPs/core, vfmaddps 190, vdpbf16ps 109 (no AVX-512 FP16
on Zen 5; vpdpbssd is not implemented). So int8 is the fast lane and
bf16 is the quality lane — the kernel structure is identical.

Stage split at 300 tok: GDN ~640 ms (projections dominate — the chunk scan
is only ~0.8 ms/layer), MLP ~400 ms, attention ~290 ms. Isolated GEMM
rate: ~843 GFLOPs/s.

Kernel findings (2026-09-24):

- **bf16 weights + `vdpbf16ps` dot** (default): exact checkpoint weights,
  1.6 GB resident, ~1.3x over the f32 dot at our shapes. Per-GEMM
  activation rows are converted to bf16 with RNE (vpmovdw pack).
- **AVX-512 f32 dot** (runtime-dispatched) beats every int8 path at our
  shapes: activation rows are short (K ≤ 3584) and weights fit in L3, so
  the memory savings of int8 never pay for the quantize/dequant overhead.
- **Dynamic u8 activation quantization + `vdpbusd` (AVX-512 VNNI)** was
  implemented and benchmarked — it *loses* to plain f32 at these shapes
  (~380 vs ~843 GFLOPs/s): per-row quantization overhead dominates when
  the weight matrix streams from L3 anyway. Kept for memory-constrained
  deployments (0.9 GB vs 3 GB resident).
- Fast branch-free exp (Taylor 2^r) for silu/sigmoid paths; libm exp
  retained in softmax where precision is load-bearing.
- Attention is parallel over heads (was the 2k-token bottleneck: O(T²)
  scalar loop, 9.7 s → 1.8 s at T=2000).

## How llama.cpp does fast CPU prompt processing (2026-08 source study)

llama.cpp dispatches every MUL_MAT through three tiers (all runtime-CPUID
checked, all with hand-written per-arch kernels):

**Tier 0 — "llamafile sgemm"** (`ggml-cpu/llamafile/sgemm.cpp`), tried
first for prompt processing (n_tokens >= 2):
- F32/F16/BF16 weights × F32 activations → `tinyBLAS`: register-blocked
  outer-product micro-kernels. AVX-512 F32: KN=16 (__m512), tile
  RM=4 weight rows × RN=6 activation rows = 24 f32 accumators, BM=4
  unroll. Per k-step: 10 loads → 24 FMAs; `hsum` only once per tile.
- Q4_0/Q5_0/IQ4_NL/Q8_0 weights × Q8_0 activations → `tinyBLAS_Q0_AVX`:
  weights dequantized *in registers* (denibble LUT), per-32-block fp16
  scales multiplied into the f32 accumulator per k-block.
- `mnpack` compiles the residual-tile dispatch at compile time so the N
  dimension is tiled with at most two tile shapes — no inner-loop
  branching on remainders.

**Tier 1 — repack buffer** (`ggml-cpu/repack.cpp`), weights land in a
special buffer type at load:
- Weight rows repacked *once* into 8-row interleaved super-blocks
  (e.g. `block_q4_0x8`): one 512-bit load then feeds 8 weight rows of
  the tile; scale arrays stored separately for vector loads.
- Per forward: activations quantized **once for the whole tensor** into
  4-row interleaved `block_q8_0x4` (per-32-block fp16 scales), in
  parallel across threads, before any GEMM tile runs.
- 8×8 tile GEMM kernels (AVX-512 VNNI `vdpbusd` when available, else
  maddubs with the abs/sign trick), nibble sign-extension via a 16-byte
  LUT + `vpshufb`, in-register blends/shuffles for the tile layouts.
- Dispatch: `nrows > 3 → gemm`, else `gemv` per chunk.

**Tier 2 — generic vec_dot path** (`ggml-cpu.c`): whole activation
tensor converted to the weight type's `vec_dot_type` (Q8_0/Q8_K/Q8_1)
into `wdata`, then 16×16 block-tiled dot loops with atomic
work-stealing over chunks; `num_rows_per_vec_dot` = 1 or 2 for
multi-row kernels.

Key lessons for our runtime:
1. **Convert activations once per GEMM**, never per block (we converted
   per n-block: 32-64 redundant conversions per row). *Applied*: one
   conversion per activation row-group job.
2. **Register-block the micro-kernel** so each loaded vector feeds many
   accumulators (llama.cpp: 10 loads → 24 FMAs; we had ~2 loads → 1 dot).
   *Applied*: 4x6 tile, 24 `vdpbf16ps` accumulators live in zmm
   registers — the arrays must be indexed with compile-time bounds
   (runtime bounds spill the accumulators to stack: measured 10x
   slower). Edge tiles get a separate runtime-bounds kernel
   (llama.cpp's mnpack trick).
3. **Reduce once per tile**, not once per row pair. *Applied*
   (`_mm512_reduce_add_ps` once per tile).
4. Scales in fp16, loaded 16-wide, applied late per accumulator.
   (Not needed for us: bf16 weights carry no scales.)
5. Atomic chunked work distribution across the whole thread pool.
   *Applied differently*: one rayon job per activation row-group
   (single phase, no barrier); weights re-streamed per group from L3.

Result: bf16 GEMM 1093 → 1482 GFLOPs/s; int8 tiled GEMM (built after
measuring that Zen 5 runs `vpdpbusd` at 3.7x the f32 FMA rate) reaches
**3422 GFLOPs/s**. Two int8 bugs found via the parity harness: the
offset correction must be divided by the 16 accumulator lanes, and the
quantizer scale (maxabs/127) must not be re-divided by 127.

### Vectorizing the non-GEMM stages (the real bottleneck)

After the GEMMs hit 3.4 TFLOPs/s, a 2k-token forward still took 4.9 s.
Per-stage profiling showed GDN = 2.7 s, attention = 1.5 s, MLP = 0.8 s —
and almost none of it was GEMM:

- **Attention** was one query row at a time with scalar dots (O(T²) scalar
  loops). Rewritten as (head x 64-row query block) tasks: QK^T + softmax
  + PV via block GEMMs with a vectorized exp (AVX-512 polynomial
  2^n-scaled Taylor, ~16 exps per cycle). 1.5 s -> 0.4 s.
- **GDN chunk scan**: the chunked delta rule's inner ops (64x64 dot
  matrices, triangular solves, state outer products) were all scalar.
  Rewritten with the same small-GEMM kernels (dot products via a
  transposed-K buffer so everything is broadcast-FMA, no reductions);
  width-vectorized forward substitution; vectorized exp/decay tables;
  parallel-row transposed-K extraction. Two numerical traps found by the
  parity harness: (1) factoring the decay weights w[i,j] = exp(cd_i -
  cd_j) as a rank-one product overflows f32 (chunk decay sums reach -250
  on real data); compute w directly. (2) multiplying by -0.0 does NOT
  negate a vector (-0.0 * x = +0.0) — sign flips need XOR.
- **Conv/silu/norms**: the depthwise conv, gated RMSNorm, and MLP
  silu(x)*gate were scalar per element (7M+ scalar transcendentals per
  layer at 2k tokens). All AVX-512 vectorized now.
- int8 quantization: per-block WEIGHT scales (per-row scales put the
  parity at the 8-bit noise floor, ~0.4-0.6 letter-logit max diff; the
  gate is 0.35). Per-block scales cut weight error ~3x; the int8 path
  sits at max 0.42 / mean 0.09 — the max is one outlier letter.

Two counter-intuitive negative results worth remembering:
- Clipping outliers to shrink the activation quantization scale made
  quality *much worse* (6x at clip=2): the outliers are load-bearing.
- The per-row-scale int8 activation path failed parity (0.66); block
  scales (512/element) with boundary corrections riding the idle f32
  pipe brought it under the 0.35 gate at almost no speed cost.

## Serving

```bash
DEEM_CHECKPOINT=<hf-checkpoint-dir> \
DEEM_CALIBRATION=scripts/sft/temperature_vX.json \
DEEM_CALIBRATION_KEY=vX \
DEEM_PORT=8300 \
    ./target/release/deem-server
```

Wire-compatible with `serve/deem_server.py`: `POST /v1/systemone`,
`GET /v1/models`, `GET /health`; per-question isolation rows, per-dataset /
per-primitive calibration temperatures, derived confidence
`(N·pmax − 1)/(N − 1)`, noul `2·pmax − 1`.

Caveats / TODO:

- single order per choice (no `DEEM_N_ORDERS` averaging yet — the eval
  harness covers both orders offline)
- 26-option cap (single-token letters), same as the torch backend
- ensemble backends not supported (single checkpoint)
