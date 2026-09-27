//! deem-runtime: minimal high-performance CPU runtime for Deem letter-slot
//! decision models (Qwen3.5 hybrid backbone).

pub mod config;
pub mod format;
pub mod kernels;
pub mod layers;
pub mod model;
pub mod readout;
pub mod safetensors;
pub mod server;
pub mod tokenizer;

pub use model::{load_model, LoadOptions, Model};


/// Pin rayon's default pool to physical cores (SHT siblings hurt the
/// AVX-512-heavy kernels; measured 2101ms vs 2190ms at 2k tokens on a
/// 16C/32T 9950X). Best-effort: falls back to rayon's default.
pub fn init_thread_pool() {
    if std::env::var_os("RAYON_NUM_THREADS").is_some() {
        return;
    }
    if let Some(n) = physical_cores() {
        std::env::set_var("RAYON_NUM_THREADS", n.to_string());
    }
}

fn physical_cores() -> Option<usize> {
    let info = std::fs::read_to_string("/proc/cpuinfo").ok()?;
    let mut cores = std::collections::HashSet::new();
    let mut phys: Option<String> = None;
    let mut core: Option<String> = None;
    for line in info.lines() {
        if let Some(v) = line.strip_prefix("physical id") {
            phys = Some(v.trim_start_matches(|c: char| !c.is_ascii_digit()).trim().to_string());
        }
        if let Some(v) = line.strip_prefix("core id") {
            core = Some(v.trim_start_matches(|c: char| !c.is_ascii_digit()).trim().to_string());
        }
        if line.is_empty() {
            if let (Some(p), Some(c)) = (phys.clone(), core.clone()) {
                cores.insert((p, c));
            }
            phys = None;
            core = None;
        }
    }
    if cores.is_empty() {
        None
    } else {
        Some(cores.len())
    }
}
