use deem_runtime::kernels::i8t::BLK;

#[test]
fn i8t_matches_reference() {
    let m = 12;
    let n = 100;
    let k = 1024;
    let rng: std::cell::Cell<u32> = std::cell::Cell::new(42);
    let mut rnd = || {
        rng.set(rng.get().wrapping_mul(1664525).wrapping_add(1013904223));
        ((rng.get() >> 8) as f32 / 8388608.0) - 1.0
    };
    let a: Vec<f32> = (0..m * k).map(|_| rnd() * 3.0).collect();
    let b: Vec<f32> = (0..n * k).map(|_| rnd() * 2.0).collect();
    // quantize weights per (row, BLK block)
    let mut w_q = vec![0i8; n * k];
    let nb = k.div_ceil(BLK);
    let mut w_scales = vec![0f32; n * nb];
    for i in 0..n {
        let row = &b[i * k..(i + 1) * k];
        for blk in 0..nb {
            let s = blk * BLK;
            let e = ((blk + 1) * BLK).min(k);
            let maxabs = row[s..e].iter().fold(0f32, |x, v| x.max(v.abs()));
            let scale = maxabs / 127.0;
            w_scales[i * nb + blk] = scale;
            for t in s..e {
                w_q[i * k + t] = (row[t] / scale).round().clamp(-128.0, 127.0) as i8;
            }
        }
    }
    let _ = &nb;
    let mut wsums = vec![0i32; n * nb];
    for i in 0..n {
        for blk in 0..nb {
            let s = blk * BLK;
            let e = ((blk + 1) * BLK).min(k);
            wsums[i * nb + blk] = w_q[i * k + s..i * k + e]
                .iter()
                .map(|v| *v as i32)
                .sum();
        }
    }
    let out = deem_runtime::kernels::i8t::gemm_i8_tiled(
        &a, &w_q, &w_scales, &wsums, m, n, k,
    );
    // reference: exact int8 semantics (weights already quantized above;
    // activations quantized per BLK block with the same scheme)
use deem_runtime::kernels::i8t::BLK;
    let mut worst = 0f32;
    let mut worst_i = 0;
    for mi in 0..m {
        for i in 0..n {
            let mut qa = vec![0u8; k];
            let mut sa = vec![0f32; nb];
            deem_runtime::kernels::i8t::quantize_row_u8_pub(
                &a[mi * k..(mi + 1) * k],
                &mut qa,
                &mut sa,
            );
            let mut want = 0.0;
            for blk in 0..nb {
                let s = blk * BLK;
                let e = ((blk + 1) * BLK).min(k);
                let mut d = 0i64;
                for t in s..e {
                    d += (qa[t] as i32 - 128) as i64 * w_q[i * k + t] as i64;
                }
                want += d as f32 * sa[blk] * w_scales[i * nb + blk];
            }
            let d = (out[mi * n + i] - want).abs();
            if d > worst {
                worst = d;
                worst_i = i;
            }
        }
    }
    let mag: f32 = (0..n * k).map(|i| b[i].abs()).sum::<f32>() / (n * k) as f32;
    println!("worst={worst} col={worst_i} mean|w|={mag}");
    assert!(worst < 1e-2, "worst diff {worst} vs mean|w| {mag}");
}
