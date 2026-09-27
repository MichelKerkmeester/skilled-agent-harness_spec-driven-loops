use std::time::Instant;

fn main() {
    deem_runtime::init_thread_pool();
    let args: Vec<String> = std::env::args().collect();
    let ckpt = args
        .get(1)
        .cloned()
        .unwrap_or_else(|| "Qwen/Qwen3.5-0.8B".to_string());
    let n_tokens: usize = args.get(2).cloned().and_then(|s| s.parse().ok()).unwrap_or(300);
    let runs: usize = args.get(3).cloned().and_then(|s| s.parse().ok()).unwrap_or(3);

    let tokens: Vec<u32> = (0..n_tokens as u32).map(|i| 100000 + i % 500).collect();

    for quantize in [false, true] {
        let t0 = Instant::now();
        let model = deem_runtime::model::load_model(
            std::path::Path::new(&ckpt),
            deem_runtime::LoadOptions { quantize },
        )
        .expect("load");
        let load = t0.elapsed();
        // warmup
        let h = model.forward_hidden(&tokens);
        let mut best = f64::MAX;
        for _ in 0..runs {
            let t = Instant::now();
            model.forward_hidden_profiled(&tokens);
            best = best.min(t.elapsed().as_secs_f64());
        }
        let sum: f32 = h.iter().sum();
        println!(
            "{:>8} load={:.1}s  best={:.0}ms  ({n_tokens} tok, {runs} runs)  hidden_sum={sum:.1}",
            if quantize { "int8" } else { "f32" },
            load.as_secs_f64(),
            best * 1000.0,
        );
    }
}
