use std::time::Instant;

fn main() {
    deem_runtime::init_thread_pool();
    let t = 300usize;
    let (m, n, k) = (t, 4096usize, 1024usize);
    let a: Vec<f32> = vec![0.01; m * k];
    let b: Vec<f32> = vec![0.02; n * k];
    // warmup
    let _ = deem_runtime::kernels::gemm_f32(&a, &b, m, n, k);
    let runs = 10;
    let mut best = f64::MAX;
    for _ in 0..runs {
        let s = Instant::now();
        let out = deem_runtime::kernels::gemm_f32(&a, &b, m, n, k);
        best = best.min(s.elapsed().as_secs_f64());
        std::hint::black_box(&out);
    }
    let flops = 2.0 * (m * n * k) as f64;
    println!(
        "gemm [{}x{}]x[{}x{}]: {:.2}ms  ({:.0} GFLOPs/s)",
        m, k, k, n,
        best * 1e3,
        flops / best / 1e9
    );
    // bf16 path
    {
        let m = t;
        let n = 4096usize;
        let k = 1024usize;
        let a: Vec<f32> = vec![0.01; m * k];
        let b: Vec<u16> = vec![0x3C00; n * k]; // bf16(1.0)
        let s = Instant::now();
        let o = unsafe { deem_runtime::kernels::bf16::gemm_bf16(&a, &b, m, n, k) };
        std::hint::black_box(&o);
        println!(
            "gemm_bf16 (vdpbf16ps)  : {:.2}ms ({:.0} GFLOPs/s)",
            s.elapsed().as_secs_f64() * 1e3,
            (2.0 * (m * n * k) as f64) / s.elapsed().as_secs_f64() / 1e9
        );
    }
    // tiled int8 (vpdpbusd)
    {
        let m = t;
        let n = 4096usize;
        let k = 1024usize;
        let a: Vec<f32> = vec![0.01; m * k];
        let b_q: Vec<i8> = vec![7; n * k];
        let scales: Vec<f32> = vec![0.001; n];
        let b_sums: Vec<i32> = vec![k as i32 * 7; n];
        let o = deem_runtime::kernels::i8t::gemm_i8_tiled(&a, &b_q, &scales, &b_sums, m, n, k);
        std::hint::black_box(&o);
        let s = Instant::now();
        let o = deem_runtime::kernels::i8t::gemm_i8_tiled(&a, &b_q, &scales, &b_sums, m, n, k);
        std::hint::black_box(&o);
        println!(
            "gemm_i8_tiled (vpdpbusd): {:.2}ms ({:.0} GFLOPs/s)",
            s.elapsed().as_secs_f64() * 1e3,
            (2.0 * (m * n * k) as f64) / s.elapsed().as_secs_f64() / 1e9
        );
    }
    // int8 paths
    {
        let m = t;
        let n = 4096usize;
        let k = 1024usize;
        let a: Vec<f32> = vec![0.01; m * k];
        let b_q: Vec<i8> = vec![7; n * k];
        let scales: Vec<f32> = vec![0.001; n];
        let b_sums: Vec<i32> = vec![k as i32 * 7; n];
        let _ = deem_runtime::kernels::gemm_i8(&a, &b_q, &scales, m, n, k);
        let s = Instant::now();
        let o = deem_runtime::kernels::gemm_i8(&a, &b_q, &scales, m, n, k);
        std::hint::black_box(&o);
        println!(
            "gemm_i8 (dequant-f32)  : {:.2}ms ({:.0} GFLOPs/s)",
            s.elapsed().as_secs_f64() * 1e3,
            (2.0 * (m * n * k) as f64) / s.elapsed().as_secs_f64() / 1e9
        );
        let s = Instant::now();
        let o = unsafe {
            deem_runtime::kernels::vnni::gemm_i8_dyn(&a, &b_q, &b_sums, &scales, m, n, k)
        };
        std::hint::black_box(&o);
        println!(
            "gemm_i8_dyn (vnni)     : {:.2}ms ({:.0} GFLOPs/s)",
            s.elapsed().as_secs_f64() * 1e3,
            (2.0 * (m * n * k) as f64) / s.elapsed().as_secs_f64() / 1e9
        );
    }
    // MLP shapes at m=2000
    for (mm, nn, kk) in [(2000usize, 3584usize, 1024usize), (2000, 1024, 3584)] {
        let a: Vec<f32> = vec![0.01; mm * kk];
        let b: Vec<f32> = vec![0.02; nn * kk];
        let s = Instant::now();
        let o = deem_runtime::kernels::gemm_f32(&a, &b, mm, nn, kk);
        std::hint::black_box(&o);
        println!(
            "f32  [{mm}x{kk}]x[{kk}x{nn}]: {:.2}ms ({:.0} GFLOPs/s)",
            s.elapsed().as_secs_f64() * 1e3,
            (2.0 * (mm * nn * kk) as f64) / s.elapsed().as_secs_f64() / 1e9
        );
        let lin = deem_runtime::layers::Linear::quantize(&b, nn, kk);
        let b_q = lin.w_q().to_vec();
        let scales = lin.scales().to_vec();
        let b_sums = lin.sums().to_vec();
        let s = Instant::now();
        let o = deem_runtime::kernels::i8t::gemm_i8_tiled(&a, &b_q, &scales, &b_sums, mm, nn, kk);
        std::hint::black_box(&o);
        println!(
            "i8t  [{mm}x{kk}]x[{kk}x{nn}]: {:.2}ms ({:.0} GFLOPs/s)",
            s.elapsed().as_secs_f64() * 1e3,
            (2.0 * (mm * nn * kk) as f64) / s.elapsed().as_secs_f64() / 1e9
        );
    }
    let (m2, n2, k2) = (t, 1024usize, 3584usize);
    let a2: Vec<f32> = vec![0.01; m2 * k2];
    let b2: Vec<f32> = vec![0.02; n2 * k2];
    let s = Instant::now();
    let o2 = deem_runtime::kernels::gemm_f32(&a2, &b2, m2, n2, k2);
    std::hint::black_box(&o2);
    println!(
        "gemm [{m2}x{k2}]x[{k2}x{n2}]: {:.2}ms  ({:.0} GFLOPs/s)",
        s.elapsed().as_secs_f64() * 1e3,
        (2.0 * (m2 * n2 * k2) as f64) / s.elapsed().as_secs_f64() / 1e9
    );
}
