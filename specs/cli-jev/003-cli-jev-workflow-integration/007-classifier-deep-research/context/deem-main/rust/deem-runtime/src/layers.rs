//! Layer implementations: zero-centered RMSNorm, SwiGLU MLP, partial-rope
//! full attention (GQA), and the chunked gated-delta-rule linear attention.

use crate::config::Config;
use crate::kernels::{gemm_f32, gemm_i8};
use rayon::prelude::*;

// ---------------------------------------------------------------------------
// numerics
// ---------------------------------------------------------------------------

/// Fast branch-free exp for elementwise activations (silu/sigmoid paths).
/// exp(x) = 2^n * 2^r with n = round(x*log2e); degree-5 poly for 2^r.
/// Max rel error ~1e-6 on the [-0.5, 0.5] remainder — bf16 parity noise
/// (0.4%) dwarfs this. NOT used where exp precision is load-bearing
/// (softmax scores keep libm).
#[inline]
pub fn exp_fast(x: f32) -> f32 {
    const LOG2_E: f32 = 1.4426950408889634;
    let t = x * LOG2_E;
    let n = t.round();
    let r = t - n;
    // 2^r, |r| <= 0.5 (Taylor / minimax, degree 5)
    let p = 1.0
        + r * (0.6931472
            + r * (0.2402265
                + r * (0.0555041 + r * (0.0096181 + r * 0.0013322))));
    let n = n as i32;
    // scale by 2^n via exponent bits (valid for -126 <= n <= 127)
    if !((-126..=127).contains(&n)) {
        return if n > 127 { f32::INFINITY } else { 0.0 };
    }
    p * f32::from_bits(((n + 127) as u32) << 23)
}

#[inline]
pub fn silu(x: f32) -> f32 {
    x / (1.0 + exp_fast(-x))
}

#[inline]
pub fn sigmoid(x: f32) -> f32 {
    if x >= 0.0 {
        1.0 / (1.0 + exp_fast(-x))
    } else {
        let e = exp_fast(x);
        e / (1.0 + e)
    }
}

/// Qwen3_5RMSNorm (zero-centered): out = norm(x) * (1 + w), in f32.
/// x: [t, d] -> [t, d]
pub fn rmsnorm_batch(x: &[f32], w: &[f32], eps: f32, t: usize, d: usize) -> Vec<f32> {
    let mut out = vec![0.0f32; x.len()];
    out.par_chunks_exact_mut(d)
        .zip(x.par_chunks_exact(d))
        .for_each(|(orow, xrow)| {
            let acc: f32 = xrow.iter().map(|v| v * v).sum();
            let inv = (acc / d as f32 + eps).recip().sqrt();
            for j in 0..d {
                orow[j] = xrow[j] * inv * (1.0 + w[j]);
            }
        });
    out
}

/// Gated RMSNorm (GDN output): norm(x) * w * silu(z). x, z, w: [d].
#[inline]
pub fn rmsnorm_gated(x: &[f32], z: &[f32], w: &[f32], eps: f32) -> Vec<f32> {
    let d = x.len();
    let acc: f32 = x.iter().map(|v| v * v).sum();
    let inv = (acc / d as f32 + eps).recip().sqrt();
    let mut out = vec![0.0f32; d];
    for i in 0..d {
        out[i] = x[i] * inv * w[i] * silu(z[i]);
    }
    out
}

/// FLA-compatible l2norm: x * rsqrt(sum(x^2) + eps), in place.
#[inline]
pub fn l2norm(x: &mut [f32]) {
    let acc: f32 = x.iter().map(|v| v * v).sum();
    let inv = (acc + 1e-6).recip().sqrt();
    for v in x.iter_mut() {
        *v *= inv;
    }
}

// ---------------------------------------------------------------------------
// linear layer (f32 or int8 weight-only)
// ---------------------------------------------------------------------------

pub struct Linear {
    pub out_features: usize,
    pub in_features: usize,
    weights_f32: Option<Vec<f32>>,
    weights_i8: Option<Vec<i8>>,
    weights_bf16: Option<Vec<u16>>,
    scales: Option<Vec<f32>>,
    sums: Option<Vec<i32>>,
}

impl Linear {
    pub fn from_bf16(w: Vec<u16>, out_features: usize, in_features: usize) -> Self {
        assert_eq!(w.len(), out_features * in_features);
        Linear {
            out_features,
            in_features,
            weights_f32: None,
            weights_i8: None,
            weights_bf16: Some(w),
            scales: None,
            sums: None,
        }
    }

    pub fn from_f32(w: Vec<f32>, out_features: usize, in_features: usize) -> Self {
        assert_eq!(w.len(), out_features * in_features);
        Linear {
            out_features,
            in_features,
            weights_f32: Some(w),
            weights_i8: None,
            weights_bf16: None,
            scales: None,
            sums: None,
        }
    }

    /// Weight-only symmetric int8 quantization, per output channel.
    pub fn quantize(w: &[f32], out_features: usize, in_features: usize) -> Self {
        let mut q = vec![0i8; w.len()];
        // per-(row, k-block) weight scales (block size must match
        // kernels::i8t::BLK)
        const BLK0: usize = 128;
        let nb0 = in_features.div_ceil(BLK0);
        let mut scales = vec![0f32; out_features * nb0];
        for o in 0..out_features {
            let row = &w[o * in_features..(o + 1) * in_features];
            for b in 0..nb0 {
                let s = b * BLK0;
                let e = ((b + 1) * BLK0).min(in_features);
                let maxabs = row[s..e].iter().fold(0f32, |m, v| m.max(v.abs()));
                let scale = if maxabs > 0.0 { maxabs / 127.0 } else { 0.0 };
                scales[o * nb0 + b] = scale;
                for i in s..e {
                    q[o * in_features + i] = (row[i] / scale).round().clamp(-128.0, 127.0) as i8;
                }
            }
        }
        // per-(row, k-block) sums of the *quantized* i8 rows for the VNNI
        // offset fix (block size must match kernels::i8t::BLK)
        const BLK: usize = 128;
        let nb = in_features.div_ceil(BLK);
        let mut sums = vec![0i32; out_features * nb];
        for o in 0..out_features {
            let row = &q[o * in_features..(o + 1) * in_features];
            for b in 0..nb {
                let be = ((b + 1) * BLK).min(in_features);
                sums[o * nb + b] =
                    row[b * BLK..be].iter().map(|v| *v as i32).sum();
            }
        }
        Linear {
            out_features,
            in_features,
            weights_f32: None,
            weights_i8: Some(q),
            weights_bf16: None,
            scales: Some(scales),
            sums: Some(sums),
        }
    }

    /// int8 weights [out, in] (quantized path only)
    pub fn w_q(&self) -> &[i8] {
        self.weights_i8.as_ref().map(|v| v.as_slice()).unwrap_or(&[])
    }

    /// per-row dequant scales
    pub fn scales(&self) -> &[f32] {
        self.scales.as_ref().map(|v| v.as_slice()).unwrap_or(&[])
    }

    /// per-(row, block) weight sums
    pub fn sums(&self) -> &[i32] {
        self.sums.as_ref().map(|v| v.as_slice()).unwrap_or(&[])
    }

    pub fn quantized(&self) -> bool {
        self.weights_i8.is_some()
    }

    /// x: [t, in] row-major -> [t, out] row-major
    pub fn forward(&self, x: &[f32], t: usize) -> Vec<f32> {
        if let Some(b) = &self.weights_bf16 {
            #[cfg(target_arch = "x86_64")]
            {
                if std::arch::is_x86_feature_detected!("avx512f")
                    && std::arch::is_x86_feature_detected!("avx512bf16")
                {
                    return unsafe {
                        crate::kernels::bf16::gemm_bf16(
                            x,
                            b,
                            t,
                            self.out_features,
                            self.in_features,
                        )
                    };
                }
            }
            // no AVX-512 BF16: dequantize once (not expected in practice)
            let w: Vec<f32> =
                b.iter().map(|v| f32::from_bits((*v as u32) << 16)).collect();
            return gemm_f32(x, &w, t, self.out_features, self.in_features);
        }
        if let Some(w) = &self.weights_f32 {
            return gemm_f32(x, w, t, self.out_features, self.in_features);
        }
        #[cfg(target_arch = "x86_64")]
        {
            if std::arch::is_x86_feature_detected!("avx512f")
                && std::arch::is_x86_feature_detected!("avx512vnni")
            {
                return crate::kernels::i8t::gemm_i8_tiled(
                    x,
                    self.weights_i8.as_ref().unwrap(),
                    self.scales.as_ref().unwrap(),
                    self.sums.as_ref().unwrap(),
                    t,
                    self.out_features,
                    self.in_features,
                );
            }
        }
        gemm_i8(
            x,
            self.weights_i8.as_ref().unwrap(),
            self.scales.as_ref().unwrap(),
            t,
            self.out_features,
            self.in_features,
        )
    }
}

// ---------------------------------------------------------------------------
// MLP (SwiGLU)
// ---------------------------------------------------------------------------

pub struct Mlp {
    pub gate: Linear,
    pub up: Linear,
    pub down: Linear,
}

impl Mlp {
    pub fn forward(&self, x: &[f32], t: usize) -> Vec<f32> {
        let gate = self.gate.forward(x, t);
        let up = self.up.forward(x, t);
        let d = self.gate.out_features;
        let mut act = vec![0.0f32; t * d];
        crate::kernels::scan::silu_mul(&gate, &up, &mut act);
        self.down.forward(&act, t)
    }
}

// ---------------------------------------------------------------------------
// Full attention
// ---------------------------------------------------------------------------

/// Precomputed partial rope tables (concat / rotate_half layout).
pub struct RopeTables {
    pub cos: Vec<f32>,
    pub sin: Vec<f32>,
    pub dim: usize,
}

impl RopeTables {
    pub fn new(
        theta: f64,
        partial_rotary_factor: f64,
        head_dim: usize,
        max_positions: usize,
    ) -> Self {
        let dim = (head_dim as f64 * partial_rotary_factor) as usize;
        let half = dim / 2;
        let mut cos = vec![0.0f32; max_positions * dim];
        let mut sin = vec![0.0f32; max_positions * dim];
        for p in 0..max_positions {
            for i in 0..half {
                let inv_f = (1.0 / theta.powf((2 * i) as f64 / dim as f64)) as f64;
                let (c, s) = ((p as f64 * inv_f).cos(), (p as f64 * inv_f).sin());
                cos[p * dim + i] = c as f32;
                sin[p * dim + i] = s as f32;
                cos[p * dim + i + half] = c as f32;
                sin[p * dim + i + half] = s as f32;
            }
        }
        RopeTables { cos, sin, dim }
    }
}

/// In-place partial rope on one head vector (concat layout).
#[inline]
fn apply_rope(x: &mut [f32], cos: &[f32], sin: &[f32], dim: usize) {
    let half = dim / 2;
    for i in 0..half {
        let (c, s) = (cos[i], sin[i]);
        let (x1, x2) = (x[i], x[i + half]);
        x[i] = x1 * c - x2 * s;
        x[i + half] = x2 * c + x1 * s;
    }
}

/// One full-attention layer over a single sequence. Returns [t, hidden].
#[allow(clippy::too_many_arguments)]
pub fn full_attention_forward(
    hidden: &[f32],
    t: usize,
    q_proj: &Linear,
    k_proj: &Linear,
    v_proj: &Linear,
    o_proj: &Linear,
    q_norm_w: &[f32],
    k_norm_w: &[f32],
    rope: &RopeTables,
    cfg: &Config,
) -> Vec<f32> {
    let h = cfg.num_heads;
    let kv_h = cfg.num_kv_heads;
    let hd = cfg.head_dim;
    let n_kv_rep = h / kv_h;
    let scaling = (hd as f32).recip().sqrt();

    let qg = q_proj.forward(hidden, t); // [t, h*hd*2]
    let kf = k_proj.forward(hidden, t); // [t, kv_h*hd]
    let vf = v_proj.forward(hidden, t); // [t, kv_h*hd]

    // q = [t, h, hd], gate = [t, h, hd] (contiguous halves)
    let mut q = vec![0.0f32; t * h * hd];
    let mut gate = vec![0.0f32; t * h * hd];
    for p in 0..t {
        let row = &qg[p * h * hd * 2..(p + 1) * h * hd * 2];
        for head in 0..h {
            let src = &row[head * hd * 2..(head + 1) * hd * 2];
            let dst = (p * h + head) * hd;
            q[dst..dst + hd].copy_from_slice(&src[..hd]);
            gate[dst..dst + hd].copy_from_slice(&src[hd..]);
        }
    }

    // zero-centered RMSNorm over the head vector, then rope
    for p in 0..t {
        for head in 0..h {
            let v = &mut q[(p * h + head) * hd..(p * h + head) * hd + hd];
            norm_inplace(v, q_norm_w);
        }
    }
    let mut k = vec![0.0f32; t * kv_h * hd];
    for p in 0..t {
        for head in 0..kv_h {
            let src = (p * kv_h + head) * hd;
            let v = &mut k[src..src + hd];
            for d in 0..hd {
                v[d] = kf[src + d];
            }
            norm_inplace(v, k_norm_w);
        }
    }
    for p in 0..t {
        let cos_p = &rope.cos[p * rope.dim..(p + 1) * rope.dim];
        let sin_p = &rope.sin[p * rope.dim..(p + 1) * rope.dim];
        for head in 0..h {
            apply_rope(
                &mut q[(p * h + head) * hd..(p * h + head) * hd + hd],
                cos_p,
                sin_p,
                rope.dim,
            );
        }
        for head in 0..kv_h {
            apply_rope(
                &mut k[(p * kv_h + head) * hd..(p * kv_h + head) * hd + hd],
                cos_p,
                sin_p,
                rope.dim,
            );
        }
    }

    // causal attention with GQA — blockwise (head x query-block) tasks.
    // Per block: scores = Q_b K^T (gemm_nt), softmax in place (vector exp),
    // then out_b = P V (gemm_nn). Causality: mask j > p to -1e30.
    let mut attn = vec![0.0f32; t * h * hd];
    let kbuf: Vec<Vec<f32>> = (0..kv_h)
        .map(|kv_i| {
            let mut kb = vec![0.0f32; t * hd];
            for p in 0..t {
                let src = (p * kv_h + kv_i) * hd;
                kb[p * hd..(p + 1) * hd].copy_from_slice(&k[src..src + hd]);
            }
            kb
        })
        .collect();
    let vbuf: Vec<Vec<f32>> = (0..kv_h)
        .map(|kv_i| {
            let mut vb = vec![0.0f32; t * hd];
            for p in 0..t {
                let src = (p * kv_h + kv_i) * hd;
                vb[p * hd..(p + 1) * hd].copy_from_slice(&vf[src..src + hd]);
            }
            vb
        })
        .collect();
    const QB: usize = 64;
    let nblk = t.div_ceil(QB);
    let attn_ptr = {
        let p = attn.as_mut_ptr();
        std::sync::Arc::new(std::sync::atomic::AtomicPtr::new(p))
    };
    let _ = &attn;
    (0..h * nblk).into_par_iter().for_each(|task| {
        let head = task / nblk;
        let blk = task % nblk;
        let kv_head = head / n_kv_rep;
        let p0 = blk * QB;
        let rows = QB.min(t - p0);
        let kend = p0 + rows; // causal key extent for this block
        let a_off = (p0 * h + head) * hd;
        // scores[rows, kend] = q rows x k rows^T
        let mut sc = vec![0.0f32; rows * kend];
        crate::kernels::scan::gemm_nt(
            &q[a_off..],
            h * hd,
            &kbuf[kv_head],
            hd,
            rows,
            kend,
            hd,
            &mut sc,
            kend,
        );
        // softmax rows (masked)
        for r in 0..rows {
            let p = p0 + r;
            let row = &mut sc[r * kend..(r + 1) * kend];
            row[p + 1..kend].fill(-1e30);
            row[..=p].iter_mut().for_each(|v| *v *= scaling);
            let m = row[..=p].iter().copied().fold(f32::NEG_INFINITY, f32::max);
            row[..=p].iter_mut().for_each(|v| *v -= m);
            crate::kernels::scan::exp_in_place(row);
            row[p + 1..kend].fill(0.0);
            let total: f32 = row.iter().sum();
            let inv = 1.0 / total;
            row.iter_mut().for_each(|v| *v *= inv);
        }
        // out_b = P @ V
        let mut out = vec![0.0f32; rows * hd];
        crate::kernels::scan::gemm_nn(
            &sc,
            kend,
            &vbuf[kv_head],
            hd,
            rows,
            hd,
            kend,
            &mut out,
            hd,
        );
        let dst = unsafe {
            std::slice::from_raw_parts_mut(
                attn_ptr.load(std::sync::atomic::Ordering::Relaxed)
                    .add((p0 * h + head) * hd),
                rows * h * hd,
            )
        };
        for r in 0..rows {
            let dst = &mut dst[r * h * hd..(r + 1) * h * hd];
            dst[..hd].copy_from_slice(&out[r * hd..(r + 1) * hd]);
        }
    });

    // output gating + o_proj
    let mut gated = vec![0.0f32; t * h * hd];
    for i in 0..t * h * hd {
        gated[i] = attn[i] * sigmoid(gate[i]);
    }
    o_proj.forward(&gated, t)
}

#[inline]
fn norm_inplace(v: &mut [f32], w: &[f32]) {
    let hd = v.len();
    let acc: f32 = v.iter().map(|x| x * x).sum();
    let inv = (acc / hd as f32 + 1e-6).recip().sqrt();
    for d in 0..hd {
        v[d] = v[d] * inv * (1.0 + w[d]);
    }
}

// ---------------------------------------------------------------------------
// Chunked gated delta rule (linear attention core)
// ---------------------------------------------------------------------------

/// Chunked gated-delta-rule scan for one layer (all heads).
///
/// * `q`, `k`: [t, H, Dk] — consumed: l2-normed in place, q scaled 1/sqrt(dk).
/// * `v`: [t, H, Dv], `beta`: [t, H], `g`: [t, H]
/// Returns [t, H, Dv].
pub fn gated_delta_rule(
    q: &mut [f32],
    k: &mut [f32],
    v: &[f32],
    beta: &[f32],
    g: &[f32],
    t: usize,
    num_heads: usize,
    dk: usize,
    dv: usize,
    chunk_size: usize,
) -> Vec<f32> {
    #[cfg(target_arch = "x86_64")]
    {
        if std::arch::is_x86_feature_detected!("avx512f")
            && std::arch::is_x86_feature_detected!("avx512bw")
        {
            return unsafe {
                gated_delta_rule_avx512(
                    q, k, v, beta, g, t, num_heads, dk, dv, chunk_size,
                )
            };
        }
    }
    gated_delta_rule_base(q, k, v, beta, g, t, num_heads, dk, dv, chunk_size)
}

#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "avx512f,avx512bw")]
unsafe fn gated_delta_rule_avx512(
    q: &mut [f32],
    k: &mut [f32],
    v: &[f32],
    beta: &[f32],
    g: &[f32],
    t: usize,
    num_heads: usize,
    dk: usize,
    dv: usize,
    chunk_size: usize,
) -> Vec<f32> {
    gated_delta_rule_base(q, k, v, beta, g, t, num_heads, dk, dv, chunk_size)
}

fn gated_delta_rule_base(
    q: &mut [f32],
    k: &mut [f32],
    v: &[f32],
    beta: &[f32],
    g: &[f32],
    t: usize,
    num_heads: usize,
    dk: usize,
    dv: usize,
    chunk_size: usize,
) -> Vec<f32> {
    let scale = 1.0f32 / (dk as f32).sqrt();
    let norm_row = |q: &mut [f32], k: &mut [f32]| {
        for h in 0..num_heads {
            let base = h * dk;
            let acc_q = crate::kernels::scan::dot_xx(&q[base..base + dk]);
            let inv_q = (acc_q + 1e-6).recip().sqrt() * scale;
            crate::kernels::scan::scale_in_place(&mut q[base..base + dk], inv_q);
            let acc_k = crate::kernels::scan::dot_xx(&k[base..base + dk]);
            let inv_k = (acc_k + 1e-6).recip().sqrt();
            crate::kernels::scan::scale_in_place(&mut k[base..base + dk], inv_k);
        }
    };
    use rayon::prelude::*;
    q.par_chunks_exact_mut(num_heads * dk)
        .zip(k.par_chunks_exact_mut(num_heads * dk))
        .for_each(|(qrow, krow)| norm_row(qrow, krow));

    let padded_t = ((t + chunk_size - 1) / chunk_size) * chunk_size;
    let num_chunks = padded_t / chunk_size;

    let per_head: Vec<Vec<f32>> = (0..num_heads)
        .into_par_iter()
        .map(|h| {
            // Padded per-head buffers (zeros past t).
            let mut qh = vec![0.0f32; padded_t * dk];
            let mut kh = vec![0.0f32; padded_t * dk];
            let mut kht = vec![0.0f32; dk * padded_t];
            let mut vh = vec![0.0f32; padded_t * dv];
            let mut betah = vec![0.0f32; padded_t];
            let mut gh = vec![0.0f32; padded_t];
            for p in 0..t {
                for d in 0..dk {
                    qh[p * dk + d] = q[(p * num_heads + h) * dk + d];
                    kh[p * dk + d] = k[(p * num_heads + h) * dk + d];
                }
                for d in 0..dv {
                    vh[p * dv + d] = v[(p * num_heads + h) * dv + d];
                }
                betah[p] = beta[p * num_heads + h];
                gh[p] = g[p * num_heads + h];
            }
            // kht[d * padded_t + p] = kh[p * dk + d]
            for p in 0..t {
                for d in 0..dk {
                    kht[d * padded_t + p] = kh[p * dk + d];
                }
            }
            let mut s = vec![0.0f32; dk * dv]; // [dk, dv] row-major
            let mut out_h = vec![0.0f32; padded_t * dv];
            // scratch buffers (hoisted out of the chunk loop)
            let n2 = chunk_size * chunk_size;
            let mut ut_strict = vec![0.0f32; n2];
            let mut intra = vec![0.0f32; n2];
            let mut qk = vec![0.0f32; n2];
            let mut ut_raw = vec![0.0f32; n2];
            let mut wtab = vec![0.0f32; n2];
            let mut khts = vec![0.0f32; dk * chunk_size];
            let mut v_new = vec![0.0f32; chunk_size * dv];
            let mut qec = vec![0.0f32; chunk_size * dk];
            let mut k_dec_t = vec![0.0f32; dk * chunk_size];
            let mut k_dec = vec![0.0f32; chunk_size * dk];
            let mut v_beta = vec![0.0f32; chunk_size * dv];
            let mut decayed_k_beta = vec![0.0f32; chunk_size * dk];
            let mut k_beta = vec![0.0f32; chunk_size * dk];
            let mut upd = vec![0.0f32; dk * dv];

            for c in 0..num_chunks {
                let cs = c * chunk_size;
                if cs >= t {
                    break;
                }
                let mut cum_decay = vec![0.0f64; chunk_size];
                let mut cum_last = 0.0f64;
                for i in 0..chunk_size {
                    cum_last += gh[cs + i] as f64;
                    cum_decay[i] = cum_last;
                }
                // exp tables (differences are always <= 0: no overflow)
                let e_cum: Vec<f32> = cum_decay.iter().map(|x| x.exp() as f32).collect();
                let kd: Vec<f32> = cum_decay
                    .iter()
                    .map(|x| (cum_last - x) as f32)
                    .map(|x| x.exp())
                    .collect();

                // per-row beta scaling
                for i in 0..chunk_size {
                    let bi = betah[cs + i];
                    let exp_cum = e_cum[i];
                    let src = &kh[(cs + i) * dk..(cs + i + 1) * dk];
                    let krow = &mut k_beta[i * dk..(i + 1) * dk];
                    let vb = &mut v_beta[i * dv..(i + 1) * dv];
                    let vsrc = &vh[(cs + i) * dv..(cs + i + 1) * dv];
                    for d in 0..dv {
                        vb[d] = vsrc[d] * bi;
                    }
                    for d in 0..dk {
                        let kb = src[d] * bi;
                        krow[d] = kb;
                        decayed_k_beta[i * dk + d] = kb * exp_cum;
                    }
                }
                // khts = plain (k)^T block: [dk, chunk]
                for dd in 0..dk {
                    let row_src = &kht[dd * padded_t + cs..dd * padded_t + cs + chunk_size];
                    let dst = &mut khts[dd * chunk_size..(dd + 1) * chunk_size];
                    dst.copy_from_slice(row_src);
                }

                // qk = q @ k^T, ut_raw = k_beta @ k^T (via khts = k^T)
                for v in qk.iter_mut() {
                    *v = 0.0;
                }
                crate::kernels::scan::gemm_nn(
                    &qh[cs * dk..],
                    dk,
                    &khts,
                    chunk_size,
                    chunk_size,
                    chunk_size,
                    dk,
                    &mut qk,
                    chunk_size,
                );
                for v in ut_raw.iter_mut() {
                    *v = 0.0;
                }
                crate::kernels::scan::gemm_nn(
                    &k_beta[..],
                    dk,
                    &khts,
                    chunk_size,
                    chunk_size,
                    chunk_size,
                    dk,
                    &mut ut_raw,
                    chunk_size,
                );

                // wtab[i][j] = exp(cd_i - cd_j), vectorized; mask with weights.
                for i in 0..chunk_size {
                    let ci = cum_decay[i] as f32;
                    let row = &mut wtab[i * chunk_size..(i + 1) * chunk_size];
                    for (j, w) in row.iter_mut().enumerate() {
                        *w = ci - cum_decay[j] as f32;
                    }
                    crate::kernels::scan::exp_in_place(row);
                }
                for i in 0..chunk_size {
                    let qkrow = &qk[i * chunk_size..(i + 1) * chunk_size];
                    let utrow_src = &ut_raw[i * chunk_size..(i + 1) * chunk_size];
                    let wi = &wtab[i * chunk_size..(i + 1) * chunk_size];
                    let intra_row = &mut intra[i * chunk_size..(i + 1) * chunk_size];
                    let ut_row = &mut ut_strict[i * chunk_size..(i + 1) * chunk_size];
                    for j in 0..i {
                        intra_row[j] = qkrow[j] * wi[j];
                        ut_row[j] = utrow_src[j] * wi[j];
                    }
                    intra_row[i] = qkrow[i] * wi[i];
                    ut_row[i] = 0.0;
                    for j in (i + 1)..chunk_size {
                        intra_row[j] = 0.0;
                        ut_row[j] = 0.0;
                    }
                }

                let new_values = crate::kernels::scan::solve_tri_copy(
                    &v_beta,
                    &ut_strict,
                    chunk_size,
                    dv,
                );
                let new_values = new_values;
                let k_cumdecay = crate::kernels::scan::solve_tri_copy(
                    &decayed_k_beta,
                    &ut_strict,
                    chunk_size,
                    dk,
                );

                let new_values = new_values;

                // v_new = new_values - k_cumdecay @ S
                for v in v_new.iter_mut() {
                    *v = 0.0;
                }
                crate::kernels::scan::gemm_nn(
                    &k_cumdecay,
                    dk,
                    &s,
                    dv,
                    chunk_size,
                    dv,
                    dk,
                    &mut v_new,
                    dv,
                );
                for i in 0..chunk_size {
                    let dst = &mut v_new[i * dv..(i + 1) * dv];
                    let src = &new_values[i * dv..(i + 1) * dv];
                    for j in 0..dv {
                        dst[j] = src[j] - dst[j];
                    }
                }

                // out = (q * exp_cum) @ S + intra @ v_new
                for i in 0..chunk_size {
                    let ec = e_cum[i];
                    let src = &qh[(cs + i) * dk..(cs + i + 1) * dk];
                    let d2 = &mut qec[i * dk..(i + 1) * dk];
                    for d in 0..dk {
                        d2[d] = src[d] * ec;
                    }
                }
                let out_chunk = &mut out_h[cs * dv..cs * dv + chunk_size * dv];
                for v in out_chunk.iter_mut() {
                    *v = 0.0;
                }
                crate::kernels::scan::gemm_nn(
                    &qec,
                    dk,
                    &s,
                    dv,
                    chunk_size,
                    dv,
                    dk,
                    out_chunk,
                    dv,
                );
                crate::kernels::scan::gemm_nn(
                    &intra,
                    chunk_size,
                    &v_new,
                    dv,
                    chunk_size,
                    dv,
                    chunk_size,
                    out_chunk,
                    dv,
                );

                // S = S * chunk_decay + (k*kd)^T @ v_new
                let chunk_decay = cum_last.exp() as f32;
                for dd in 0..dk {
                    let dst = &mut khts[dd * chunk_size..(dd + 1) * chunk_size];
                    for i in 0..chunk_size {
                        dst[i] *= kd[i];
                    }
                }
                for v in upd.iter_mut() {
                    *v = 0.0;
                }
                crate::kernels::scan::gemm_nn(
                    &khts,
                    chunk_size,
                    &v_new,
                    dv,
                    dk,
                    dv,
                    chunk_size,
                    &mut upd,
                    dv,
                );
                for i in 0..dk * dv {
                    s[i] = s[i] * chunk_decay + upd[i];
                }

            }
            out_h
        })
        .collect();

    let mut out = vec![0.0f32; t * num_heads * dv];
    for p in 0..t {
        for h in 0..num_heads {
            for d in 0..dv {
                out[(p * num_heads + h) * dv + d] = per_head[h][p * dv + d];
            }
        }
    }
    out
}

