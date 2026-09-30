use deem_runtime::layers::gated_delta_rule;

/// Reference: the original scalar chunked scan (pre-optimization).
fn gdn_ref(
    q: &mut [f32], k: &mut [f32], v: &[f32], beta: &[f32], g: &[f32],
    t: usize, num_heads: usize, dk: usize, dv: usize, chunk_size: usize,
) -> Vec<f32> {
    let scale = 1.0f32 / (dk as f32).sqrt();
    for p in 0..t {
        for h in 0..num_heads {
            let base = (p * num_heads + h) * dk;
            l2norm(&mut q[base..base + dk]);
            l2norm(&mut k[base..base + dk]);
            for d in 0..dk {
                q[base + d] *= scale;
            }
        }
    }
    let padded_t = ((t + chunk_size - 1) / chunk_size) * chunk_size;
    let num_chunks = padded_t / chunk_size;
    let mut out = vec![0.0f32; t * num_heads * dv];
    for h in 0..num_heads {
        let mut s = vec![0.0f32; dk * dv];
        let mut s_t = vec![0.0f32; dv * dk];
        // padded per-head copies (zeros past t)
        let mut qh = vec![0.0f32; padded_t * dk];
        let mut kh = vec![0.0f32; padded_t * dk];
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
        for c in 0..num_chunks {
            let cs = c * chunk_size;
            if cs >= t { break; }
            let getk = |p: usize, d: usize| kh[p * dk + d];
            let getq = |p: usize, d: usize| qh[p * dk + d];
            let getv = |p: usize, d: usize| vh[p * dv + d];
            let mut cum_decay = vec![0.0f64; chunk_size];
            let mut cum_last = 0.0f64;
            for i in 0..chunk_size {
                cum_last += gh[cs + i] as f64;
                cum_decay[i] = cum_last;
            }
            let e_cum: Vec<f32> = cum_decay.iter().map(|x| x.exp() as f32).collect();
            let kd: Vec<f32> = cum_decay.iter().map(|x| (cum_last - x) as f32).map(|x| x.exp()).collect();
            let mut ut_strict = vec![0.0f32; chunk_size * chunk_size];
            let mut intra = vec![0.0f32; chunk_size * chunk_size];
            let mut v_beta = vec![0.0f32; chunk_size * dv];
            let mut decayed_k_beta = vec![0.0f32; chunk_size * dk];
            let mut k_beta = vec![0.0f32; chunk_size * dk];
            for i in 0..chunk_size {
                let bi = betah[cs + i];
                let exp_cum = cum_decay[i].exp() as f32;
                for d in 0..dv {
                    v_beta[i * dv + d] = getv(cs + i, d) * bi;
                }
                for d in 0..dk {
                    let kb = getk(cs + i, d) * bi;
                    k_beta[i * dk + d] = kb;
                    decayed_k_beta[i * dk + d] = kb * exp_cum;
                }
            }
            for i in 0..chunk_size {
                for j in 0..=i {
                    let w = ((cum_decay[i] - cum_decay[j]) as f32).exp();
                    let mut ut = 0.0f32;
                    let mut qk = 0.0f32;
                    for d in 0..dk {
                        ut += k_beta[i * dk + d] * getk(cs + j, d);
                        qk += getq(cs + i, d) * getk(cs + j, d);
                    }
                    intra[i * chunk_size + j] = qk * w;
                    if i > j {
                        ut_strict[i * chunk_size + j] = ut * w;
                    }
                }
            }
            let mut new_values = v_beta;
            let mut k_cumdecay = decayed_k_beta;
            solve(&mut new_values, &ut_strict, chunk_size, dv);
            solve(&mut k_cumdecay, &ut_strict, chunk_size, dk);
            let mut v_new = vec![0.0f32; chunk_size * dv];
            for i in 0..chunk_size {
                for j in 0..dv {
                    let mut acc = 0.0f32;
                    for d in 0..dk {
                        acc += k_cumdecay[i * dk + d] * s_t[j * dk + d];
                    }
                    v_new[i * dv + j] = new_values[i * dv + j] - acc;
                }
            }
            for i in 0..chunk_size {
                let ec = e_cum[i];
                for j in 0..dv {
                    let mut acc = 0.0f32;
                    for d in 0..dk {
                        acc += getq(cs + i, d) * ec * s_t[j * dk + d];
                    }
                    let mut acc2 = 0.0f32;
                    for p2 in 0..chunk_size {
                        acc2 += intra[i * chunk_size + p2] * v_new[p2 * dv + j];
                    }
                    if cs + i < t {
                        out[(cs + i) * num_heads * dv + h * dv + j] = acc + acc2;
                    }
                }
            }
            let chunk_decay = cum_last.exp() as f32;
            let mut upd = vec![0.0f32; dk * dv];
            for i in 0..chunk_size {
                for d in 0..dk {
                    let kv = getk(cs + i, d) * kd[i];
                    for j in 0..dv {
                        upd[d * dv + j] += kv * v_new[i * dv + j];
                    }
                }
            }
            for d in 0..dk {
                for j in 0..dv {
                    s[d * dv + j] = s[d * dv + j] * chunk_decay + upd[d * dv + j];
                    s_t[j * dk + d] = s_t[j * dk + d] * chunk_decay + upd[d * dv + j];
                }
            }
        }
    }
    out
}

fn l2norm(x: &mut [f32]) {
    let n = x.iter().map(|v| v * v).sum::<f32>().sqrt();
    if n > 0.0 {
        for v in x.iter_mut() {
            *v /= n;
        }
    }
}

fn solve(rhs: &mut [f32], lower: &[f32], n: usize, m: usize) {
    for i in 1..n {
        let row = &lower[i * n..(i + 1) * n];
        for kk in 0..i {
            let r = row[kk];
            if r == 0.0 { continue; }
            for j in 0..m {
                rhs[i * m + j] -= r * rhs[kk * m + j];
            }
        }
    }
}

use std::cell::Cell;
thread_local! {
    static RNG: Cell<u64> = const { Cell::new(123456789u64) };
    static T: Cell<usize> = const { Cell::new(200usize) };
}
fn rnd() -> f32 {
    RNG.with(|r| {
        let mut v = r.get();
        v = v.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        r.set(v);
        ((v >> 33) as u32 as f32 / u32::MAX as f32) * 2.0 - 1.0
    })
}

#[test]
fn gdn_matches_reference() {
    let t = T.with(|v| v.get());
    let num_heads = 4usize;
    let dk = 128usize;
    let dv = 128usize;
    let q0: Vec<f32> = (0..t * num_heads * dk).map(|_| rnd()).collect();
    let k0: Vec<f32> = (0..t * num_heads * dk).map(|_| rnd()).collect();
    let v: Vec<f32> = (0..t * num_heads * dv).map(|_| rnd()).collect();
    let beta: Vec<f32> = (0..t * num_heads).map(|_| 0.5 + rnd().abs()).collect();
    let g: Vec<f32> = (0..t * num_heads).map(|_| -rnd().abs()).collect();

    let mut qa = q0.clone();
    let mut ka = k0.clone();
    let got = gated_delta_rule(&mut qa, &mut ka, &v, &beta, &g, t, num_heads, dk, dv, 64);
    let mut qb = q0.clone();
    let mut kb = k0.clone();
    let want = gdn_ref(&mut qb, &mut kb, &v, &beta, &g, t, num_heads, dk, dv, 64);
    let mut worst = 0f32;
    let mut wi = 0usize;
    for i in 0..got.len() {
        let d = (got[i] - want[i]).abs();
        if d > worst {
            worst = d;
            wi = i;
        }
    }
    println!("worst={worst} at {wi} (p={} h={} d={})", wi / (num_heads * dv), (wi / dv) % num_heads, wi % dv);
    println!("got={:.6} want={:.6}", got[wi], want[wi]);
    assert!(worst < 5e-3, "worst diff {worst} (t={})", T.with(|v| v.get()));
}

#[test]
fn gdn_sizes() {
    for &t in [64usize, 65, 128, 129, 200].iter() {
        T.with(|v| v.set(t));
        let r = std::panic::catch_unwind(gdn_matches_reference);
        println!("t={t}: {:?}", if r.is_ok() { "ok" } else { "FAIL" });
        assert!(r.is_ok(), "t={t} failed");
        T.with(|v| v.set(200));
    }
}
