//! GEMM kernels: f32 activations × {f32, i8} weights, row-major dot layout.
//!
//! Weight matrices are stored [n_out, k] row-major (the PyTorch layout), so
//! the inner product runs over contiguous memory for both operands. Compute
//! is f32 with runtime SIMD dispatch (AVX-512 / AVX2); int8 weights are
//! unpacked to f32 inside the kernel (weight-only quantization — activations
//! stay f32).

use rayon::prelude::*;

#[cfg(target_arch = "x86_64")]
mod simd {
    #[inline(always)]
    pub fn dot_f32(a: &[f32], b: &[f32]) -> f32 {
        #[cfg(target_arch = "x86_64")]
        {
            if std::arch::is_x86_feature_detected!("avx512f") {
                return unsafe { dot_f32_avx512(a, b) };
            }
        }
        dot_f32_base(a, b)
    }

    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "avx512f")]
    unsafe fn dot_f32_avx512(a: &[f32], b: &[f32]) -> f32 {
        use std::arch::x86_64::*;
        let n = a.len();
        let mut i = 0usize;
        let mut acc0 = _mm512_setzero_ps();
        let mut acc1 = _mm512_setzero_ps();
        let mut tail = _mm512_setzero_ps();
        while i + 32 <= n {
            let a0 = _mm512_loadu_ps(a.as_ptr().add(i));
            let b0 = _mm512_loadu_ps(b.as_ptr().add(i));
            let a1 = _mm512_loadu_ps(a.as_ptr().add(i + 16));
            let b1 = _mm512_loadu_ps(b.as_ptr().add(i + 16));
            acc0 = _mm512_fmadd_ps(a0, b0, acc0);
            acc1 = _mm512_fmadd_ps(a1, b1, acc1);
            i += 32;
        }
        if i + 16 <= n {
            let a0 = _mm512_loadu_ps(a.as_ptr().add(i));
            let b0 = _mm512_loadu_ps(b.as_ptr().add(i));
            tail = _mm512_fmadd_ps(a0, b0, tail);
            i += 16;
        }
        let mut acc = _mm512_add_ps(acc0, acc1);
        acc = _mm512_add_ps(acc, tail);
        let mut total = _mm512_reduce_add_ps(acc);
        while i < n {
            total += *a.get_unchecked(i) * *b.get_unchecked(i);
            i += 1;
        }
        total
    }

    #[inline(always)]
    fn dot_f32_base(a: &[f32], b: &[f32]) -> f32 {
        #[target_feature(enable = "avx2,fma")]
        unsafe fn inner(a: &[f32], b: &[f32]) -> f32 {
            use std::arch::x86_64::*;
            let n = a.len();
            let mut i = 0usize;
            let mut acc0 = _mm256_setzero_ps();
            let mut acc1 = _mm256_setzero_ps();
            while i + 16 <= n {
                let a0 = _mm256_loadu_ps(a.as_ptr().add(i));
                let b0 = _mm256_loadu_ps(b.as_ptr().add(i));
                let a1 = _mm256_loadu_ps(a.as_ptr().add(i + 8));
                let b1 = _mm256_loadu_ps(b.as_ptr().add(i + 8));
                acc0 = _mm256_fmadd_ps(a0, b0, acc0);
                acc1 = _mm256_fmadd_ps(a1, b1, acc1);
                i += 16;
            }
            let mut acc = _mm256_add_ps(acc0, acc1);
            let mut s = [0f32; 8];
            while i + 8 <= n {
                let a0 = _mm256_loadu_ps(a.as_ptr().add(i));
                let b0 = _mm256_loadu_ps(b.as_ptr().add(i));
                acc = _mm256_fmadd_ps(a0, b0, acc);
                i += 8;
            }
            _mm256_storeu_ps(s.as_mut_ptr(), acc);
            let mut total: f32 = s.iter().sum();
            while i < n {
                total += unsafe { *a.get_unchecked(i) * *b.get_unchecked(i) };
                i += 1;
            }
            total
        }
        unsafe { inner(a, b) }
    }

    #[inline(always)]
    pub fn dot_i8(a: &[f32], b: &[i8]) -> f32 {
        #[target_feature(enable = "avx2")]
        unsafe fn inner(a: &[f32], b: &[i8]) -> f32 {
            use std::arch::x86_64::*;
            let n = a.len();
            let mut i = 0usize;
            let mut acc0 = _mm256_setzero_ps();
            let mut acc1 = _mm256_setzero_ps();
            while i + 16 <= n {
                // 16 x i8 -> two f32 vectors
                let bi = _mm_loadu_si128(b.as_ptr().add(i) as *const __m128i);
                let lo = _mm256_cvtepi8_epi32(bi);
                let hi = _mm256_cvtepi8_epi32(_mm_bsrli_si128(bi, 8));
                let b0 = _mm256_cvtepi32_ps(lo);
                let b1 = _mm256_cvtepi32_ps(hi);
                let a0 = _mm256_loadu_ps(a.as_ptr().add(i));
                let a1 = _mm256_loadu_ps(a.as_ptr().add(i + 8));
                acc0 = _mm256_fmadd_ps(a0, b0, acc0);
                acc1 = _mm256_fmadd_ps(a1, b1, acc1);
                i += 16;
            }
            let mut acc = _mm256_add_ps(acc0, acc1);
            let mut s = [0f32; 8];
            while i + 8 <= n {
                let mut bi8 = [0i8; 8];
                for j in 0..8 {
                    bi8[j] = *b.get_unchecked(i + j);
                }
                let mut bf = [0f32; 8];
                for (j, v) in bi8.iter().enumerate() {
                    bf[j] = *v as f32;
                }
                let a0 = _mm256_loadu_ps(a.as_ptr().add(i));
                let b0 = _mm256_loadu_ps(bf.as_ptr());
                acc = _mm256_fmadd_ps(a0, b0, acc);
                i += 8;
            }
            _mm256_storeu_ps(s.as_mut_ptr(), acc);
            let mut total: f32 = s.iter().sum();
            while i < n {
                total += unsafe { *a.get_unchecked(i) * *b.get_unchecked(i) as f32 };
                i += 1;
            }
            total
        }
        unsafe { inner(a, b) }
    }
}

#[cfg(not(target_arch = "x86_64"))]
mod simd {
    #[inline(always)]
    pub fn dot_f32(a: &[f32], b: &[f32]) -> f32 {
        #[cfg(target_arch = "x86_64")]
        {
            if std::arch::is_x86_feature_detected!("avx512f") {
                return unsafe { dot_f32_avx512(a, b) };
            }
        }
        dot_f32_base(a, b)
    }

    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "avx512f")]
    unsafe fn dot_f32_avx512(a: &[f32], b: &[f32]) -> f32 {
        use std::arch::x86_64::*;
        let n = a.len();
        let mut i = 0usize;
        let mut acc0 = _mm512_setzero_ps();
        let mut acc1 = _mm512_setzero_ps();
        let mut tail = _mm512_setzero_ps();
        while i + 32 <= n {
            let a0 = _mm512_loadu_ps(a.as_ptr().add(i));
            let b0 = _mm512_loadu_ps(b.as_ptr().add(i));
            let a1 = _mm512_loadu_ps(a.as_ptr().add(i + 16));
            let b1 = _mm512_loadu_ps(b.as_ptr().add(i + 16));
            acc0 = _mm512_fmadd_ps(a0, b0, acc0);
            acc1 = _mm512_fmadd_ps(a1, b1, acc1);
            i += 32;
        }
        if i + 16 <= n {
            let a0 = _mm512_loadu_ps(a.as_ptr().add(i));
            let b0 = _mm512_loadu_ps(b.as_ptr().add(i));
            tail = _mm512_fmadd_ps(a0, b0, tail);
            i += 16;
        }
        let mut acc = _mm512_add_ps(acc0, acc1);
        acc = _mm512_add_ps(acc, tail);
        let mut total = _mm512_reduce_add_ps(acc);
        while i < n {
            total += *a.get_unchecked(i) * *b.get_unchecked(i);
            i += 1;
        }
        total
    }

    #[inline(always)]
    fn dot_f32_base(a: &[f32], b: &[f32]) -> f32 {
        a.iter().zip(b).map(|(x, y)| x * y).sum()
    }

    #[inline(always)]
    pub fn dot_i8(a: &[f32], b: &[i8]) -> f32 {
        a.iter().zip(b).map(|(x, y)| x * (*y as f32)).sum()
    }
}

/// out[m, n] = a[m, k] @ b^T where a is [m, k] row-major, b is [n, k] row-major.
///
/// Parallelism is over n-blocks (weight rows): each weight row is read once,
/// activations (m x k, small) stay cache-resident.
pub fn gemm_f32(a: &[f32], b: &[f32], m: usize, n: usize, k: usize) -> Vec<f32> {
    let mut out = vec![0.0f32; m * n];
    const NB: usize = 128;
    let out_ptr = out.as_mut_ptr() as usize;
    (0..n.div_ceil(NB))
        .into_par_iter()
        .for_each(|nblk| unsafe {
            let nb0 = nblk * NB;
            let nb1 = (nb0 + NB).min(n);
            (0..m).into_par_iter().for_each(|mi| {
                let arow = a.get_unchecked(mi * k..mi * k + k);
                let orow = out_ptr as *mut f32;
                for i in nb0..nb1 {
                    *orow.add(mi * n + i) =
                        simd::dot_f32(arow, b.get_unchecked(i * k..i * k + k));
                }
            });
        });
    out
}

/// out[m, n] = a[m, k] @ diag(scale) @ b_q^T, b_q is [n, k] int8.
///
/// Each weight-row block is dequantized once into an L2-resident scratch
/// buffer, then dotted against every activation row (conversion amortized).
pub fn gemm_i8(
    a: &[f32],
    b_q: &[i8],
    scales: &[f32],
    m: usize,
    n: usize,
    k: usize,
) -> Vec<f32> {
    let mut out = vec![0.0f32; m * n];
    const NB: usize = 64;
    let out_ptr = out.as_mut_ptr() as usize;
    (0..n.div_ceil(NB))
        .into_par_iter()
        .for_each(|nblk| unsafe {
            let nb0 = nblk * NB;
            let nb0 = nb0;
            let nb1 = (nb0 + NB).min(n);
            let mut scratch = vec![0f32; NB * k];
            for (dst, src) in scratch
                .iter_mut()
                .zip(b_q[nb0 * k..nb1 * k].iter())
            {
                *dst = *src as f32;
            }
            for mi in 0..m {
                let arow = a.get_unchecked(mi * k..mi * k + k);
                let orow = out_ptr as *mut f32;  // indexed below
                for (bi, i) in (nb0..nb1).enumerate() {
                    *orow.add(mi * n + i) = simd::dot_f32(
                        arow,
                        scratch.get_unchecked(bi * k..bi * k + k),
                    ) * *scales.get_unchecked(i);
                }
            }
        });
    out
}

/// out[m, n] = a[m, k] @ b^T with weights stored as raw bf16 (u16) and
/// activations converted per-row to bf16. Requires AVX-512 BF16
/// (vdpbf16ps: 32 MACs per instruction, native single-uop on Zen 4+).
#[cfg(target_arch = "x86_64")]
pub mod bf16 {
    #[allow(unused_imports)]
    use std::arch::x86_64::{
        __m512bh, __m512i, _mm512_castsi512_ph, _mm512_dpbf16_ps, _mm512_loadu_si512,
        _mm512_reduce_add_ps, _mm512_setzero_ps, _mm512_setzero_si512, __m512,
    };
    #[inline(always)]
    unsafe fn transmute_bh(v: std::arch::x86_64::__m512i) -> __m512bh {
        core::mem::transmute(v)
    }

    #[target_feature(enable = "avx512f,avx512bf16")]
    unsafe fn dot_bf16(a: &[u16], b: &[u16]) -> f32 {
        use std::arch::x86_64::*;
        let n = a.len();
        let mut i = 0usize;
        let mut acc0 = _mm512_setzero_ps();
        let mut acc1 = _mm512_setzero_ps();
        while i + 64 <= n {
            let a0 = _mm512_loadu_si512(a.as_ptr().add(i) as *const __m512i);
            let b0 = _mm512_loadu_si512(b.as_ptr().add(i) as *const __m512i);
            let a1 = _mm512_loadu_si512(a.as_ptr().add(i + 32) as *const __m512i);
            let b1 = _mm512_loadu_si512(b.as_ptr().add(i + 32) as *const __m512i);
            acc0 = _mm512_dpbf16_ps(
                acc0,
                transmute_bh(a0),
                transmute_bh(b0),
            );
            acc1 = _mm512_dpbf16_ps(
                acc1,
                transmute_bh(a1),
                transmute_bh(b1),
            );
            i += 64;
        }
        if i + 32 <= n {
            let a0 = _mm512_loadu_si512(a.as_ptr().add(i) as *const __m512i);
            let b0 = _mm512_loadu_si512(b.as_ptr().add(i) as *const __m512i);
            acc0 = _mm512_dpbf16_ps(
                acc0,
                transmute_bh(a0),
                transmute_bh(b0),
            );
            i += 32;
        }
        let acc = _mm512_add_ps(acc0, acc1);
        let mut total = _mm512_reduce_add_ps(acc);
        while i < n {
            total += bf16_to_f32(a[i]) * bf16_to_f32(b[i]);
            i += 1;
        }
        total
    }

    fn bf16_to_f32(v: u16) -> f32 {
        f32::from_bits((v as u32) << 16)
    }

    /// f32 -> bf16 with round-to-nearest-even (shift trick + vpmovdw).
    #[target_feature(enable = "avx512f")]
    unsafe fn f32_to_bf16_row(src: &[f32], dst: &mut [u16]) {
        use std::arch::x86_64::*;
        let n = src.len();
        let mut i = 0usize;
        let half = _mm512_set1_epi32(0x7FFF);
        let one = _mm512_set1_epi32(1);
        while i + 16 <= n {
            let v = _mm512_loadu_ps(src.as_ptr().add(i));
            let u = _mm512_castps_si512(v);
            let lsb = _mm512_and_si512(_mm512_srli_epi32(u, 16), one);
            let r = _mm512_srli_epi32(_mm512_add_epi32(_mm512_add_epi32(u, half), lsb), 16);
            let packed = _mm512_cvtepi32_epi16(r);
            _mm256_storeu_si256(dst.as_mut_ptr().add(i) as *mut __m256i, packed);
            i += 16;
        }
        while i < n {
            let u = src[i].to_bits();
            let lsb = (u >> 16) & 1;
            let r = u + 0x7FFF + lsb;
            dst[i] = (r >> 16) as u16;
            i += 1;
        }
    }

    /// a: [m, k] f32 row-major; b_bf16: [n, k] raw bf16.
    ///
    /// llama.cpp-style tiled GEMM (tinyBLAS): activations are converted
    /// to bf16 once for the whole tensor, then 4x6 register-blocked
    /// outer-product tiles run with vdpbf16ps, reducing once per tile.
    pub fn gemm_bf16(
        a: &[f32],
        b_bf16: &[u16],
        m: usize,
        n: usize,
        k: usize,
    ) -> Vec<f32> {
        use rayon::prelude::*;
        let mut out = vec![0.0f32; m * n];
        if m == 0 || n == 0 || k == 0 {
            return out;
        }
        // One job per activation row-group: convert the group's rows to
        // bf16 once, then stream all weight tiles past them (single phase,
        // no intermediate barrier). Weights are re-read per group but fit
        // in L3.
        const RM: usize = 4; // weight rows per tile
        const RN: usize = 6; // activation rows per tile
        let out_ptr = out.as_mut_ptr() as usize;
        (0..m.div_ceil(RN))
            .into_par_iter()
            .for_each(|it| unsafe {
                let i0 = it * RN;
                let jc = RN.min(m - i0);
                let mut qa = vec![0u16; RN * k];
                for j in 0..jc {
                    f32_to_bf16_row(
                        a.get_unchecked((i0 + j) * k..(i0 + j + 1) * k),
                        &mut qa[j * k..(j + 1) * k],
                    );
                }
                let nt = n.div_ceil(RM);
                for jt in 0..nt {
                    let j0 = jt * RM;
                    if jc == RN && j0 + RM <= n {
                        tile_bf16_full(
                            qa.as_ptr(),
                            b_bf16.as_ptr(),
                            out_ptr as *mut f32,
                            m,
                            n,
                            k,
                            i0,
                            j0,
                        );
                    } else {
                        tile_bf16_edge(
                            qa.as_ptr(),
                            b_bf16.as_ptr(),
                            out_ptr as *mut f32,
                            m,
                            n,
                            k,
                            i0,
                            j0,
                        );
                    }
                }
            });
        out
    }

    /// Fully-unrolled 6x4 tile: 24 accumulators live in zmm registers.
    #[target_feature(enable = "avx512f,avx512bf16")]
    unsafe fn tile_bf16_full(
        qa: *const u16,
        b: *const u16,
        out: *mut f32,
        m: usize,
        n: usize,
        k: usize,
        i0: usize,
        j0: usize,
    ) {
        const RM: usize = 4;
        const RN: usize = 6;
        let mut acc = [_mm512_setzero_ps(); RM * RN];
        let mut kk = 0usize;
        while kk + 32 <= k {
            // load 6 activation rows (32 bf16 = 64 bytes each, local rows)
            let a = [
                transmute_bh(_mm512_loadu_si512(qa.add(kk) as *const __m512i)),
                transmute_bh(_mm512_loadu_si512(qa.add(k + kk) as *const __m512i)),
                transmute_bh(_mm512_loadu_si512(qa.add(2 * k + kk) as *const __m512i)),
                transmute_bh(_mm512_loadu_si512(qa.add(3 * k + kk) as *const __m512i)),
                transmute_bh(_mm512_loadu_si512(qa.add(4 * k + kk) as *const __m512i)),
                transmute_bh(_mm512_loadu_si512(qa.add(5 * k + kk) as *const __m512i)),
            ];
            let w = [
                transmute_bh(_mm512_loadu_si512(b.add(j0 * k + kk) as *const __m512i)),
                transmute_bh(_mm512_loadu_si512(b.add((j0 + 1) * k + kk) as *const __m512i)),
                transmute_bh(_mm512_loadu_si512(b.add((j0 + 2) * k + kk) as *const __m512i)),
                transmute_bh(_mm512_loadu_si512(b.add((j0 + 3) * k + kk) as *const __m512i)),
            ];
            for i in 0..RM {
                for j in 0..RN {
                    acc[j * RM + i] =
                        _mm512_dpbf16_ps(acc[j * RM + i], a[j], w[i]);
                }
            }
            kk += 32;
        }
        // reduce once per tile
        for j in 0..RN {
            for i in 0..RM {
                *out.add((i0 + j) * n + j0 + i) = _mm512_reduce_add_ps(acc[j * RM + i]);
            }
        }
        if kk < k {
            for j in 0..RN {
                for i in 0..RM {
                    let mut sum = *out.add((i0 + j) * n + j0 + i);
                    let arow = qa.add(j * k);
                    let brow = b.add((j0 + i) * k);
                    for t in kk..k {
                        sum += bf16_to_f32(*arow.add(t)) * bf16_to_f32(*brow.add(t));
                    }
                    *out.add((i0 + j) * n + j0 + i) = sum;
                }
            }
        }
    }

    /// Edge tiles (m % 6 != 0 or n % 4 != 0): runtime bounds, stack accs.
    #[target_feature(enable = "avx512f,avx512bf16")]
    unsafe fn tile_bf16_edge(
        qa: *const u16,
        b: *const u16,
        out: *mut f32,
        m: usize,
        n: usize,
        k: usize,
        i0: usize,
        j0: usize,
    ) {
        const RM: usize = 4;
        const RN: usize = 6;
        let jc = RN.min(m - i0);
        let ic = RM.min(n - j0);
        let mut acc = [_mm512_setzero_ps(); RM * RN];
        let mut kk = 0usize;
        while kk + 32 <= k {
            let mut a = [transmute_bh(_mm512_setzero_si512()); RN];
            for j in 0..jc {
                a[j] = transmute_bh(_mm512_loadu_si512(
                    qa.add(j * k + kk) as *const __m512i,
                ));
            }
            for i in 0..ic {
                let w = transmute_bh(_mm512_loadu_si512(
                    b.add((j0 + i) * k + kk) as *const __m512i,
                ));
                for j in 0..jc {
                    acc[j * RM + i] =
                        _mm512_dpbf16_ps(acc[j * RM + i], a[j], w);
                }
            }
            kk += 32;
        }
        for j in 0..jc {
            for i in 0..ic {
                *out.add((i0 + j) * n + j0 + i) = _mm512_reduce_add_ps(acc[j * RM + i]);
            }
        }
        if kk < k {
            for j in 0..jc {
                for i in 0..ic {
                    let mut sum = *out.add((i0 + j) * n + j0 + i);
                    let arow = qa.add(j * k);
                    let brow = b.add((j0 + i) * k);
                    for t in kk..k {
                        sum += bf16_to_f32(*arow.add(t)) * bf16_to_f32(*brow.add(t));
                    }
                    *out.add((i0 + j) * n + j0 + i) = sum;
                }
            }
        }
    }
}

#[cfg(target_arch = "x86_64")]
pub mod vnni {
    /// u8 x i8 dot via vdpbusd (AVX-512 VNNI). `a` is an offset-encoded
    /// activation row (x = (q - 128) * scale); `b` is the int8 weight row.
    /// Returns the raw int32 dot; the caller applies scales and the
    /// 128 * sum(b) offset correction.
    #[target_feature(enable = "avx512f,avx512vnni")]
    unsafe fn dot_u8_i8_vnni(a: &[u8], b: &[i8]) -> i32 {
        use std::arch::x86_64::*;
        let n = a.len();
        let mut i = 0usize;
        let mut acc = _mm512_setzero_si512();
        while i + 64 <= n {
            let av = _mm512_loadu_si512(a.as_ptr().add(i) as *const __m512i);
            let bv = _mm512_loadu_si512(b.as_ptr().add(i) as *const __m512i);
            acc = _mm512_dpbusd_epi32(acc, av, bv);
            i += 64;
        }
        let mut total = _mm512_reduce_add_epi32(acc);
        while i < n {
            total += a[i] as i32 * b[i] as i32;
            i += 1;
        }
        total
    }

    /// out[m, n] = a[m, k] @ diag(scales) @ b_q^T with dynamic 8-bit
    /// activation quantization (llama.cpp-style: per-row symmetric
    /// activation scale + +128 u8 offset, corrected via precomputed
    /// weight-row sums).
    pub fn gemm_i8_dyn(
        a: &[f32],
        b_q: &[i8],
        b_sum: &[i32],
        scales: &[f32],
        m: usize,
        n: usize,
        k: usize,
    ) -> Vec<f32> {
        use rayon::prelude::*;
        let mut out = vec![0.0f32; m * n];
        const NB: usize = 64;
        let out_ptr = out.as_mut_ptr() as usize;
        (0..n.div_ceil(NB))
            .into_par_iter()
            .for_each(|nblk| unsafe {
                let nb0 = nblk * NB;
                let nb1 = (nb0 + NB).min(n);
                let mut qa = vec![0u8; k];
                for mi in 0..m {
                    let arow = a.get_unchecked(mi * k..mi * k + k);
                    // dynamic per-row symmetric quantization
                    let mut maxabs = 0.0f32;
                    for v in arow.iter() {
                        maxabs = maxabs.max(v.abs());
                    }
                    let inv = if maxabs > 0.0 {
                        127.0 / maxabs
                    } else {
                        0.0
                    };
                    for (q, v) in qa.iter_mut().zip(arow.iter()) {
                        *q = ((v * inv).round() as i32 + 128).clamp(0, 255) as u8;
                    }
                    let orow = out_ptr as *mut f32;
                    for i in nb0..nb1 {
                        let bq = b_q.get_unchecked(i * k..i * k + k);
                        let dot =
                            dot_u8_i8_vnni(&qa, bq) - 128 * b_sum.get_unchecked(i);
                        *orow.add(mi * n + i) =
                            dot as f32 * (maxabs / 127.0) * *scales.get_unchecked(i);
                    }
                }
            });
        out
    }
}


/// Solve (I + L) X = B where B is [n, m] row-major, L strictly lower [n, n].
pub fn solve_unit_lower_tri_multi(rhs: &mut [f32], lower: &[f32], n: usize, m: usize) {
    for i in 1..n {
        let row = &lower[i * n..(i + 1) * n];
        for j in 0..m {
            let mut acc = 0.0f32;
            for kk in 0..i {
                acc += row[kk] * rhs[kk * m + j];
            }
            rhs[i * m + j] -= acc;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn gemm_matches_naive() {
        let m = 5;
        let n = 7;
        let k = 13;
        let a: Vec<f32> = (0..m * k).map(|i| (i as f32) * 0.1 - 1.0).collect();
        let b: Vec<f32> = (0..n * k).map(|i| (i as f32) * 0.05 - 0.3).collect();
        let out = gemm_f32(&a, &b, m, n, k);
        for i in 0..m {
            for j in 0..n {
                let mut want = 0.0f32;
                for x in 0..k {
                    want += a[i * k + x] * b[j * k + x];
                }
                assert!((out[i * n + j] - want).abs() < 1e-4);
            }
        }
    }
}

/// Tiled int8 GEMM (llama.cpp tier-1 style). Weights are int8 with
/// per-row scales and precomputed row sums; activations are quantized
/// once per row-group to offset-encoded u8 (x ~= (q - 128) / scale).
/// 4 weight rows x 6 activation rows per tile, vpdpbusd accumulates
/// in i32, reduce once per tile. Single phase: one job per row-group.
#[cfg(target_arch = "x86_64")]
pub mod i8t {
    use std::arch::x86_64::{
        __m128i, __m512, __m512bh, __m512i, _mm512_add_epi32, _mm512_add_ps,
        _mm512_andnot_ps, _mm512_cvtepi32_epi8, _mm512_cvtepi32_ps,
        _mm512_cvt_roundps_epu32, _mm512_dpbusd_epi32, _mm512_fmadd_ps,
        _mm512_loadu_ps, _mm512_loadu_si512, _mm512_max_ps, _mm512_min_ps,
        _mm512_mul_ps, _mm512_reduce_add_epi32, _mm512_reduce_add_ps,
        _mm512_reduce_max_ps, _mm512_set1_epi32, _mm512_set1_ps, _mm512_setzero,
        _mm512_setzero_ps, _mm512_setzero_si512, _mm512_sub_epi32, _mm512_sub_ps,
        _mm_storeu_si128,
    };

    /// Activation quantization block size (elements per scale).
    pub const BLK: usize = 128;

    /// f32 row -> offset-encoded u8 (x ~ (q-128)*scale), one scale per
    /// BLK-element block (llama.cpp Q8_0-style). Returns per-block scales.
    #[target_feature(enable = "avx512f")]
    unsafe fn quantize_row_u8(src: &[f32], dst: &mut [u8], scales: &mut [f32]) {
        let n = src.len();
        let nb = scales.len();
        let sign = _mm512_set1_ps(-0.0f32);
        let zero = _mm512_set1_ps(0.0f32);
        let hi = _mm512_set1_ps(255.0f32);
        let mut i = 0usize;
        for b in 0..nb {
            let e = (i + BLK).min(n);
            let mut maxabs = 0.0f32;
            while i + 16 <= e {
                let v = _mm512_loadu_ps(src.as_ptr().add(i));
                maxabs =
                    maxabs.max(_mm512_reduce_max_ps(_mm512_andnot_ps(sign, v)));
                i += 16;
            }
            while i < e {
                maxabs = maxabs.max(src[i].abs());
                i += 1;
            }
            let scale = maxabs / 127.0;
            scales[b] = scale;
        }
        let i = 0usize;
        let mut i = i;
        // second pass: quantize each block with its scale
        i = 0;
        for b in 0..nb {
            let e = (i + BLK).min(n);
            let inv = if scales[b] > 0.0 {
                1.0 / scales[b]
            } else {
                0.0
            };
            let vinv = _mm512_set1_ps(inv);
            let off = _mm512_set1_ps(128.0);
            while i + 16 <= e {
                let v = _mm512_loadu_ps(src.as_ptr().add(i));
                let q = _mm512_add_ps(_mm512_mul_ps(v, vinv), off);
                let q = _mm512_min_ps(_mm512_max_ps(q, zero), hi);
                let u = _mm512_cvt_roundps_epu32(
                    q,
                    std::arch::x86_64::_MM_FROUND_TO_NEAREST_INT
                        | std::arch::x86_64::_MM_FROUND_NO_EXC,
                );
                let packed = _mm512_cvtepi32_epi8(u);
                _mm_storeu_si128(dst.as_mut_ptr().add(i) as *mut __m128i, packed);
                i += 16;
            }
            while i < e {
                let v = src[i] * inv + 128.0;
                dst[i] = v.round().clamp(0.0, 255.0) as u8;
                i += 1;
            }
        }
        let _ = zero;
        let _ = hi;
    }

    /// Debug/test hook: run the row quantizer.
    pub fn quantize_row_u8_pub(
        src: &[f32],
        dst: &mut [u8],
        scales: &mut [f32],
    ) {
        unsafe { quantize_row_u8(src, dst, scales) };
    }

    /// 4 (weight) x 6 (activation) tile, per-BLK-block activation scales.
    /// facc (f32 partials) lives in memory; corrections at block
    /// boundaries ride the f32 pipe.
    #[target_feature(enable = "avx512f,avx512vnni")]
    unsafe fn tile_i8_full(
        qa: *const u8,
        w: *const i8,
        out: *mut f32,
        n: usize,
        k: usize,
        i0: usize,
        j0: usize,
        sa: &[f32],      // [6 * nb] activation scales
        nb: usize,
        w_scales: &[f32], // [n, nb]
        wsums: &[i32],    // [n * nb] per-block weight sums
    ) {
        let mut acc = [_mm512_setzero_si512(); 24];
        let mut facc = [_mm512_setzero_ps(); 24];
        let mut kk = 0usize;
        for b in 0..nb {
            // reset i32 accs at block start
            acc = [_mm512_setzero_si512(); 24];
            let kend = (kk + BLK).min(k);
            while kk + 64 <= kend {
                let a = [
                    _mm512_loadu_si512(qa.add(kk) as *const __m512i),
                    _mm512_loadu_si512(qa.add(k + kk) as *const __m512i),
                    _mm512_loadu_si512(qa.add(2 * k + kk) as *const __m512i),
                    _mm512_loadu_si512(qa.add(3 * k + kk) as *const __m512i),
                    _mm512_loadu_si512(qa.add(4 * k + kk) as *const __m512i),
                    _mm512_loadu_si512(qa.add(5 * k + kk) as *const __m512i),
                ];
                for i in 0..4usize {
                    let wv =
                        _mm512_loadu_si512(w.add((j0 + i) * k + kk) as *const __m512i);
                    for j in 0..6usize {
                        acc[j * 4 + i] =
                            _mm512_dpbusd_epi32(acc[j * 4 + i], a[j], wv);
                    }
                }
                kk += 64;
            }
            // block boundary: facc += (D - 128*sum_w) * s_a * s_w
            for i in 0..4usize {
                let wsum = (*wsums.get_unchecked((j0 + i) * nb + b)) * 128;
                let corr = _mm512_set1_epi32(wsum / 16);
                for j in 0..6usize {
                    let d = _mm512_sub_epi32(acc[j * 4 + i], corr);
                    let sw = (*sa.get_unchecked(j * nb + b))
                        * w_scales.get_unchecked((j0 + i) * nb + b);
                    facc[j * 4 + i] = _mm512_fmadd_ps(
                        _mm512_cvtepi32_ps(d),
                        _mm512_set1_ps(sw),
                        facc[j * 4 + i],
                    );
                }
            }
        }
        for j in 0..6usize {
            for i in 0..4usize {
                *out.add((i0 + j) * n + j0 + i) =
                    _mm512_reduce_add_ps(facc[j * 4 + i]);
            }
        }
    }

    /// Edge tiles: runtime bounds (no weight-scale/blocks beyond n, m).
    #[target_feature(enable = "avx512f,avx512vnni")]
    unsafe fn tile_i8_edge(
        qa: *const u8,
        w: *const i8,
        out: *mut f32,
        n: usize,
        k: usize,
        i0: usize,
        j0: usize,
        jc: usize,
        sa: &[f32],
        nb: usize,
        w_scales: &[f32],
        wsums: &[i32],
    ) {
        const RM: usize = 4;
        let ic = RM.min(n - j0);
        let mut acc = [_mm512_setzero_si512(); RM * 6];
        let mut facc = [_mm512_setzero_ps(); RM * 6];
        let mut kk = 0usize;
        for b in 0..nb {
            acc = [_mm512_setzero_si512(); RM * 6];
            let kend = (kk + BLK).min(k);
            while kk + 64 <= kend {
                let mut a = [_mm512_setzero_si512(); 6];
                for j in 0..jc {
                    a[j] = _mm512_loadu_si512(qa.add(j * k + kk) as *const __m512i);
                }
                for i in 0..ic {
                    let wv =
                        _mm512_loadu_si512(w.add((j0 + i) * k + kk) as *const __m512i);
                    for j in 0..jc {
                        acc[j * RM + i] =
                            _mm512_dpbusd_epi32(acc[j * RM + i], a[j], wv);
                    }
                }
                kk += 64;
            }
            for i in 0..ic {
                let wsum = (*wsums.get_unchecked((j0 + i) * nb + b)) * 128;
                let corr = _mm512_set1_epi32(wsum / 16);
                for j in 0..jc {
                    let d = _mm512_sub_epi32(acc[j * RM + i], corr);
                    let sw = (*sa.get_unchecked(j * nb + b))
                        * w_scales.get_unchecked((j0 + i) * nb + b);
                    facc[j * RM + i] = _mm512_fmadd_ps(
                        _mm512_cvtepi32_ps(d),
                        _mm512_set1_ps(sw),
                        facc[j * RM + i],
                    );
                }
            }
        }
        for j in 0..jc {
            for i in 0..ic {
                *out.add((i0 + j) * n + j0 + i) =
                    _mm512_reduce_add_ps(facc[j * RM + i]);
            }
        }
    }

    /// out[m, n] = a[m, k] @ diag(w_scale) @ w_q^T
    pub fn gemm_i8_tiled(
        a: &[f32],
        w_q: &[i8],
        w_scales: &[f32],
        wsums: &[i32],
        m: usize,
        n: usize,
        k: usize,
    ) -> Vec<f32> {
        use rayon::prelude::*;
        let mut out = vec![0.0f32; m * n];
        if m == 0 || n == 0 || k == 0 {
            return out;
        }
        let nb = k.div_ceil(BLK);
        const RM: usize = 4; // weight rows per tile
        const RN: usize = 6; // activation rows per tile
        const RG: usize = 2; // row-groups per job (12 activation rows)
        let out_ptr = out.as_mut_ptr() as usize;
        (0..m.div_ceil(RN * RG))
            .into_par_iter()
            .for_each(|grp| unsafe {
                let i0 = grp * RN * RG;
                for half in 0..RG {
                    let i0h = i0 + half * RN;
                    if i0h >= m {
                        break;
                    }
                    let jc = RN.min(m - i0h);
                    let mut qa = vec![0u8; RN * k];
                    let mut sa = vec![0f32; RN * nb];
                    for j in 0..jc {
                        let src = a.get_unchecked((i0h + j) * k..(i0h + j + 1) * k);
                        let dst = qa.as_mut_slice().get_unchecked_mut(j * k..(j + 1) * k);
                        let scales = sa.as_mut_slice().get_unchecked_mut(j * nb..(j + 1) * nb);
                        quantize_row_u8(src, dst, scales);
                    }
                    let nt = n.div_ceil(RM);
                    for jt in 0..nt {
                        let j0 = jt * RM;
                        if jc == RN && j0 + RM <= n {
                            tile_i8_full(
                                qa.as_ptr(),
                                w_q.as_ptr(),
                                out_ptr as *mut f32,
                                n,
                                k,
                                i0h,
                                j0,
                                &sa,
                                nb,
                                w_scales,
                                wsums,
                            );
                        } else {
                            tile_i8_edge(
                                qa.as_ptr(),
                                w_q.as_ptr(),
                                out_ptr as *mut f32,
                                n,
                                k,
                                i0h,
                                j0,
                                jc,
                                &sa,
                                nb,
                                w_scales,
                                wsums,
                            );
                        }
                    }
                }
            });
        out
    }
}

// ---------------------------------------------------------------------------
// Small sequential f32 GEMMs + transcendental helpers for the scan/attention
// kernels. All accumulate into C. Strides are row strides in f32 elements.
// ---------------------------------------------------------------------------
pub mod scan {
    #[inline(always)]
    fn dot_k(a: &[f32], b: &[f32], k: usize) -> f32 {
        #[cfg(target_arch = "x86_64")]
        {
            if std::arch::is_x86_feature_detected!("avx512f") {
                return unsafe { dot_k_avx512(a, b, k) };
            }
        }
        let mut acc = 0f32;
        for i in 0..k {
            acc += a[i] * b[i];
        }
        acc
    }

    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "avx512f")]
    unsafe fn dot_k_avx512(a: &[f32], b: &[f32], k: usize) -> f32 {
        use std::arch::x86_64::*;
        let mut i = 0usize;
        let mut a0 = _mm512_setzero_ps();
        let mut a1 = _mm512_setzero_ps();
        let mut a2 = _mm512_setzero_ps();
        let mut a3 = _mm512_setzero_ps();
        while i + 64 <= k {
            a0 = _mm512_fmadd_ps(
                _mm512_loadu_ps(a.as_ptr().add(i)),
                _mm512_loadu_ps(b.as_ptr().add(i)),
                a0,
            );
            a1 = _mm512_fmadd_ps(
                _mm512_loadu_ps(a.as_ptr().add(i + 16)),
                _mm512_loadu_ps(b.as_ptr().add(i + 16)),
                a1,
            );
            a2 = _mm512_fmadd_ps(
                _mm512_loadu_ps(a.as_ptr().add(i + 32)),
                _mm512_loadu_ps(b.as_ptr().add(i + 32)),
                a2,
            );
            a3 = _mm512_fmadd_ps(
                _mm512_loadu_ps(a.as_ptr().add(i + 48)),
                _mm512_loadu_ps(b.as_ptr().add(i + 48)),
                a3,
            );
            i += 64;
        }
        while i + 16 <= k {
            a0 = _mm512_fmadd_ps(
                _mm512_loadu_ps(a.as_ptr().add(i)),
                _mm512_loadu_ps(b.as_ptr().add(i)),
                a0,
            );
            i += 16;
        }
        let acc = _mm512_add_ps(
            _mm512_add_ps(a0, a1),
            _mm512_add_ps(a2, a3),
        );
        let mut total = _mm512_reduce_add_ps(acc);
        while i < k {
            total += a[i] * b[i];
            i += 1;
        }
        total
    }

    /// C[m,n] += A[m,k] · B[n,k]^T
    pub fn gemm_nt(
        a: &[f32],
        lda: usize,
        b: &[f32],
        ldb: usize,
        m: usize,
        n: usize,
        k: usize,
        c: &mut [f32],
        ldc: usize,
    ) {
        for mi in 0..m {
            let arow = &a[mi * lda..mi * lda + k];
            let crow = &mut c[mi * ldc..mi * ldc + n];
            for j in 0..n {
                crow[j] += dot_k(arow, &b[j * ldb..j * ldb + k], k);
            }
        }
    }

    /// C[m,n] += A[m,k] · B[k,n]
    pub fn gemm_nn(
        a: &[f32],
        lda: usize,
        b: &[f32],
        ldb: usize,
        m: usize,
        n: usize,
        k: usize,
        c: &mut [f32],
        ldc: usize,
    ) {
        #[cfg(target_arch = "x86_64")]
        {
            if std::arch::is_x86_feature_detected!("avx512f")
                && std::arch::is_x86_feature_detected!("avx512dq")
                && n % 16 == 0
            {
                return unsafe { gemm_nn_avx512(a, lda, b, ldb, m, n, k, c, ldc) };
            }
        }
        gemm_nn_base(a, lda, b, ldb, m, n, k, c, ldc);
    }

    fn gemm_nn_base(
        a: &[f32],
        lda: usize,
        b: &[f32],
        ldb: usize,
        m: usize,
        n: usize,
        k: usize,
        c: &mut [f32],
        ldc: usize,
    ) {
        for mi in 0..m {
            let arow = &a[mi * lda..mi * lda + k];
            let crow = &mut c[mi * ldc..mi * ldc + n];
            for p in 0..k {
                let r = arow[p];
                let brow = &b[p * ldb..p * ldb + n];
                for j in 0..n {
                    crow[j] += r * brow[j];
                }
            }
        }
    }

    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "avx512f,avx512dq")]
    unsafe fn gemm_nn_avx512(
        a: &[f32],
        lda: usize,
        b: &[f32],
        ldb: usize,
        m: usize,
        n: usize,
        k: usize,
        c: &mut [f32],
        ldc: usize,
    ) {
        use std::arch::x86_64::*;
        const KB: usize = 256;
        let kb_blocks = k.div_ceil(KB);
        for kb in 0..kb_blocks {
            let p0 = kb * KB;
            let p1 = (p0 + KB).min(k);
            for mi in 0..m {
                let arow = &a[mi * lda..mi * lda + k];
                let crow = c.as_mut_ptr().add(mi * ldc);
                for p in p0..p1 {
                    let bc = _mm512_set1_ps(*arow.get_unchecked(p));
                    let brow = b.as_ptr().add(p * ldb);
                    let mut j = 0usize;
                    while j + 32 <= n {
                        _mm512_storeu_ps(
                            crow.add(j),
                            _mm512_fmadd_ps(
                                bc,
                                _mm512_loadu_ps(brow.add(j)),
                                _mm512_loadu_ps(crow.add(j)),
                            ),
                        );
                        _mm512_storeu_ps(
                            crow.add(j + 16),
                            _mm512_fmadd_ps(
                                bc,
                                _mm512_loadu_ps(brow.add(j + 16)),
                                _mm512_loadu_ps(crow.add(j + 16)),
                            ),
                        );
                        j += 32;
                    }
                    while j < n {
                        _mm512_storeu_ps(
                            crow.add(j),
                            _mm512_fmadd_ps(
                                bc,
                                _mm512_loadu_ps(brow.add(j)),
                                _mm512_loadu_ps(crow.add(j)),
                            ),
                        );
                        j += 16;
                    }
                }
            }
        }
    }



    /// out[i] = x[i] * w[i] * zs[i] * scale  (elementwise, vectorized)
    pub fn mul3_scaled(x: &[f32], w: &[f32], zs: &[f32], scale: f32, out: &mut [f32]) {
        #[cfg(target_arch = "x86_64")]
        {
            if std::arch::is_x86_feature_detected!("avx512f") {
                return unsafe { mul3_avx512(x, w, zs, scale, out) };
            }
        }
        for i in 0..x.len() {
            out[i] = x[i] * w[i] * zs[i] * scale;
        }
    }

    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "avx512f")]
    unsafe fn mul3_avx512(x: &[f32], w: &[f32], zs: &[f32], scale: f32, out: &mut [f32]) {
        use std::arch::x86_64::*;
        let sc = _mm512_set1_ps(scale);
        let n = x.len();
        let mut i = 0usize;
        while i + 16 <= n {
            let a = _mm512_loadu_ps(x.as_ptr().add(i));
            let b = _mm512_loadu_ps(w.as_ptr().add(i));
            let c = _mm512_loadu_ps(zs.as_ptr().add(i));
            _mm512_storeu_ps(
                out.as_mut_ptr().add(i),
                _mm512_mul_ps(_mm512_mul_ps(_mm512_mul_ps(a, b), c), sc),
            );
            i += 16;
        }
        while i < n {
            out[i] = x[i] * w[i] * zs[i] * scale;
            i += 1;
        }
    }

    /// acc[c] += w[c] * x[c] over the slice (vectorized).
    pub fn fma_row(acc: &mut [f32], w: &[f32], x: &[f32]) {
        #[cfg(target_arch = "x86_64")]
        {
            if std::arch::is_x86_feature_detected!("avx512f") {
                return unsafe { fma_row_avx512(acc, w, x) };
            }
        }
        for i in 0..acc.len() {
            acc[i] += w[i] * x[i];
        }
    }

    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "avx512f")]
    unsafe fn fma_row_avx512(acc: &mut [f32], w: &[f32], x: &[f32]) {
        use std::arch::x86_64::*;
        let n = acc.len();
        let mut i = 0usize;
        while i + 32 <= n {
            for off in [0, 16] {
                let a = _mm512_loadu_ps(acc.as_ptr().add(i + off));
                let b = _mm512_loadu_ps(w.as_ptr().add(i + off));
                let c = _mm512_loadu_ps(x.as_ptr().add(i + off));
                _mm512_storeu_ps(
                    acc.as_mut_ptr().add(i + off),
                    _mm512_fmadd_ps(b, c, a),
                );
            }
            i += 32;
        }
        while i + 16 <= n {
            let a = _mm512_loadu_ps(acc.as_ptr().add(i));
            let b = _mm512_loadu_ps(w.as_ptr().add(i));
            let c = _mm512_loadu_ps(x.as_ptr().add(i));
            _mm512_storeu_ps(acc.as_mut_ptr().add(i), _mm512_fmadd_ps(b, c, a));
            i += 16;
        }
    }

    /// Vectorized sum of squares.
    pub fn dot_xx(x: &[f32]) -> f32 {
        super::simd::dot_f32(x, x)
    }


    /// out[i] = silu(g[i]) * u[i], vectorized (no allocation).
    pub fn silu_mul(g: &[f32], u: &[f32], out: &mut [f32]) {
        #[cfg(target_arch = "x86_64")]
        {
            if std::arch::is_x86_feature_detected!("avx512f") {
                return unsafe { silu_mul_avx512(g, u, out) };
            }
        }
        for i in 0..g.len() {
            out[i] = crate::layers::silu(g[i]) * u[i];
        }
    }

    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "avx512f")]
    unsafe fn silu_mul_avx512(g: &[f32], u: &[f32], out: &mut [f32]) {
        use std::arch::x86_64::*;
        let one = _mm512_set1_ps(1.0);
        let neg = _mm512_set1_ps(-0.0);
        let n = g.len();
        let mut i = 0usize;
        while i + 16 <= n {
            let gv = _mm512_loadu_ps(g.as_ptr().add(i));
            let uv = _mm512_loadu_ps(u.as_ptr().add(i));
            let e = exp16(_mm512_xor_ps(gv, neg));
            let sig = _mm512_div_ps(one, _mm512_add_ps(one, e));
            _mm512_storeu_ps(
                out.as_mut_ptr().add(i),
                _mm512_mul_ps(_mm512_mul_ps(gv, sig), uv),
            );
            i += 16;
        }
        while i < n {
            out[i] = crate::layers::silu(g[i]) * u[i];
            i += 1;
        }
    }


    /// x[i] *= s, vectorized.
    pub fn scale_in_place(x: &mut [f32], s: f32) {
        #[cfg(target_arch = "x86_64")]
        {
            if std::arch::is_x86_feature_detected!("avx512f") {
                return unsafe { scale_avx512(x, s) };
            }
        }
        for v in x.iter_mut() {
            *v *= s;
        }
    }

    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "avx512f")]
    unsafe fn scale_avx512(x: &mut [f32], s: f32) {
        use std::arch::x86_64::*;
        let sv = _mm512_set1_ps(s);
        let n = x.len();
        let mut i = 0usize;
        while i + 32 <= n {
            for off in [0, 16] {
                _mm512_storeu_ps(
                    x.as_mut_ptr().add(i + off),
                    _mm512_mul_ps(_mm512_loadu_ps(x.as_ptr().add(i + off)), sv),
                );
            }
            i += 32;
        }
        while i + 16 <= n {
            _mm512_storeu_ps(
                x.as_mut_ptr().add(i),
                _mm512_mul_ps(_mm512_loadu_ps(x.as_ptr().add(i)), sv),
            );
            i += 16;
        }
        while i < n {
            x[i] *= s;
            i += 1;
        }
    }

    /// Vector elementwise: x[i] = x[i] * mul + add.
    pub fn scale_add_in_place(x: &mut [f32], mul: f32, add: f32) {
        for v in x.iter_mut() {
            *v = *v * mul + add;
        }
    }


    /// x[i] = sigmoid(x[i]), vectorized.
    pub fn sigmoid_in_place(x: &mut [f32]) {
        #[cfg(target_arch = "x86_64")]
        {
            if std::arch::is_x86_feature_detected!("avx512f") {
                return unsafe { sigmoid_avx512(x) };
            }
        }
        for v in x.iter_mut() {
            *v = crate::layers::sigmoid(*v);
        }
    }

    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "avx512f")]
    unsafe fn sigmoid_avx512(x: &mut [f32]) {
        use std::arch::x86_64::*;
        let one = _mm512_set1_ps(1.0);
        let neg = _mm512_set1_ps(-0.0);
        let n = x.len();
        let mut i = 0usize;
        while i + 16 <= n {
            let v = _mm512_loadu_ps(x.as_ptr().add(i));
            let e = exp16(_mm512_xor_ps(v, neg));
            _mm512_storeu_ps(
                x.as_mut_ptr().add(i),
                _mm512_div_ps(one, _mm512_add_ps(one, e)),
            );
            i += 16;
        }
        if i < n {
            let mut buf = [0f32; 16];
            buf[..n - i].copy_from_slice(&x[i..n]);
            let v = _mm512_loadu_ps(buf.as_ptr());
            let e = exp16(_mm512_xor_ps(v, neg));
            _mm512_storeu_ps(buf.as_mut_ptr(), _mm512_div_ps(one, _mm512_add_ps(one, e)));
            x[i..n].copy_from_slice(&buf[..n - i]);
        }
    }

    /// x[i] = silu(x[i]) = x / (1 + exp(-x)), vectorized.
    pub fn silu_in_place(x: &mut [f32]) {
        #[cfg(target_arch = "x86_64")]
        {
            if std::arch::is_x86_feature_detected!("avx512f") {
                return unsafe { silu_sigmoid_impl(x, true) };
            }
        }
        for v in x.iter_mut() {
            *v = crate::layers::silu(*v);
        }
    }

    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "avx512f")]
    unsafe fn silu_sigmoid_impl(x: &mut [f32], is_silu: bool) {
        use std::arch::x86_64::*;
        let one = _mm512_set1_ps(1.0);
        let zero = _mm512_setzero_ps();
        let neg = _mm512_set1_ps(-0.0);
        let sign_bit = _mm512_set1_ps(-0.0);
        let _ = sign_bit;
        let n = x.len();
        let mut i = 0usize;
        while i + 16 <= n {
            let v = _mm512_loadu_ps(x.as_ptr().add(i));
            let e = exp16(_mm512_xor_ps(v, neg));
            let sig = _mm512_div_ps(one, _mm512_add_ps(one, e));
            let r = if is_silu {
                _mm512_mul_ps(v, sig)
            } else {
                sig
            };
            _mm512_storeu_ps(x.as_mut_ptr().add(i), r);
            i += 16;
        }
        if i < n {
            let mut buf = [0f32; 16];
            buf[..n - i].copy_from_slice(&x[i..n]);
            let v = _mm512_loadu_ps(buf.as_ptr());
            let e = exp16(_mm512_xor_ps(v, neg));
            let sig = _mm512_div_ps(one, _mm512_add_ps(one, e));
            let r = if is_silu {
                _mm512_mul_ps(v, sig)
            } else {
                sig
            };
            _mm512_storeu_ps(buf.as_mut_ptr(), r);
            x[i..n].copy_from_slice(&buf[..n - i]);
        }
    }

    /// Vector exp over a slice, in place: x[i] = exp(x[i]).
    /// Accurate to ~1e-7 relative; matches the scalar fast exp closely.
    pub fn exp_in_place(x: &mut [f32]) {
        #[cfg(target_arch = "x86_64")]
        {
            if std::arch::is_x86_feature_detected!("avx512f") {
                return unsafe { exp_in_place_avx512(x) };
            }
        }
        for v in x.iter_mut() {
            *v = crate::layers::exp_fast(*v);
        }
    }

    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "avx512f")]
    unsafe fn exp_in_place_avx512(x: &mut [f32]) {
        use std::arch::x86_64::*;
        let n = x.len();
        let mut i = 0usize;
        while i + 16 <= n {
            let v = _mm512_loadu_ps(x.as_ptr().add(i));
            _mm512_storeu_ps(x.as_mut_ptr().add(i), exp16(v));
            i += 16;
        }
        if i < n {
            let mut buf = [0f32; 16];
            buf[..n - i]
                .copy_from_slice(unsafe { x.get_unchecked(i..n) });
            let mut v = _mm512_loadu_ps(buf.as_ptr());
            v = exp16(v);
            _mm512_storeu_ps(buf.as_mut_ptr(), v);
            x[i..].copy_from_slice(&buf[..n - i]);
        }
    }

    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "avx512f")]
    pub(crate) unsafe fn exp16(x: std::arch::x86_64::__m512) -> std::arch::x86_64::__m512 {
        use std::arch::x86_64::*;
        let log2e = _mm512_set1_ps(std::f32::consts::LOG2_E);
        let n = _mm512_roundscale_ps(_mm512_mul_ps(x, log2e), 0);
        let r = _mm512_fnmadd_ps(
            n,
            _mm512_set1_ps(std::f32::consts::LN_2),
            x,
        );
        // Horner, coefficients of e^r Taylor series
        let mut p = _mm512_set1_ps(1.0 / 720.0);
        p = _mm512_fmadd_ps(r, p, _mm512_set1_ps(1.0 / 120.0));
        p = _mm512_fmadd_ps(r, p, _mm512_set1_ps(1.0 / 24.0));
        p = _mm512_fmadd_ps(r, p, _mm512_set1_ps(1.0 / 6.0));
        p = _mm512_fmadd_ps(r, p, _mm512_set1_ps(0.5));
        p = _mm512_fmadd_ps(r, p, _mm512_set1_ps(1.0));
        p = _mm512_fmadd_ps(r, p, _mm512_set1_ps(1.0));
        _mm512_scalef_ps(p, n)
    }

/// Solve (I + L) X = B where L strictly lower [n,n], B is [n,width].
    /// Returns the solved copy; input untouched.
    pub fn solve_tri_copy(b: &[f32], lower: &[f32], n: usize, width: usize) -> Vec<f32> {
        let mut x = b.to_vec();
        solve_unit_lower_tri_multi_vec(&mut x, lower, n, width);
        x
    }

    /// Solve (I + L) X = B where L strictly lower [n,n], B is [n,width].
    /// Width-vectorized forward substitution.
    pub fn solve_unit_lower_tri_multi_vec(rhs: &mut [f32], lower: &[f32], n: usize, width: usize) {
        #[cfg(target_arch = "x86_64")]
        {
            if std::arch::is_x86_feature_detected!("avx512f") {
                return unsafe { solve_vec_avx512(rhs, lower, n, width) };
            }
        }
        for i in 1..n {
            let row = &lower[i * n..(i + 1) * n];
            for kk in 0..i {
                let r = row[kk];
                if r == 0.0 {
                    continue;
                }
                for j in 0..width {
                    rhs[i * width + j] -= r * rhs[kk * width + j];
                }
            }
        }
    }

    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "avx512f")]
    unsafe fn solve_vec_avx512(rhs: &mut [f32], lower: &[f32], n: usize, width: usize) {
        use std::arch::x86_64::*;
        for i in 1..n {
            let row = lower.as_ptr().add(i * n);
            for kk in 0..i {
                let r = _mm512_set1_ps(*row.add(kk));
                let dst = rhs.as_mut_ptr().add(i * width);
                let src = rhs.as_ptr().add(kk * width);
                let mut j = 0usize;
                while j + 32 <= width {
                    for off in [0, 16] {
                        let s = _mm512_loadu_ps(src.add(j + off));
                        let d = _mm512_loadu_ps(dst.add(j + off));
                        _mm512_storeu_ps(
                            dst.add(j + off),
                            _mm512_fnmadd_ps(r, s, d),
                        );
                    }
                    j += 32;
                }
                while j < width {
                    let s = _mm512_loadu_ps(src.add(j));
                    let d = _mm512_loadu_ps(dst.add(j));
                    _mm512_storeu_ps(dst.add(j), _mm512_fnmadd_ps(r, s, d));
                    j += 16;
                }
            }
        }
    }
}
