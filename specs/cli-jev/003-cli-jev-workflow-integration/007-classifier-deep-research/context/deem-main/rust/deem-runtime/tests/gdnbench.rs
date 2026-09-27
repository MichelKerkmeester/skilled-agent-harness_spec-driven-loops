use deem_runtime::layers::gated_delta_rule;

#[test]
fn scan_bench() {
    let t = 2000usize;
    let dk = 128usize;
    let dv = 128usize;
    let data: Vec<f32> = (0..t * dk * 2 + t * dv)
        .map(|i| ((i as f32 * 0.37).sin() * 0.5))
        .collect();
    let n = t * dk;
    let mut q: Vec<f32> = data[..n].to_vec();
    let mut k: Vec<f32> = data[n..2 * n].to_vec();
    let v: Vec<f32> = data[2 * n..2 * n + t * dv].to_vec();
    let beta = vec![0.5f32; t];
    let g = vec![-0.1f32; t];

    for &heads in [1usize, 4, 8, 16, 16].iter() {
        let mut qq = q.clone();
        let mut kk = k.clone();
        for h in 1..heads {
            qq.extend_from_slice(&q);
            kk.extend_from_slice(&k);
        }
        let betah = vec![0.5f32; t * heads];
        let gh = vec![-0.1f32; t * heads];
        let mut vh = v.clone();
        for _ in 1..heads {
            vh.extend_from_slice(&v);
        }
        let start = std::time::Instant::now();
        let out = gated_delta_rule(&mut qq, &mut kk, &vh, &betah, &gh, t, heads, dk, dv, 64);
        let el = start.elapsed();
        println!("heads={heads}: {el:?} outlen={}", out.len());
    }
}
