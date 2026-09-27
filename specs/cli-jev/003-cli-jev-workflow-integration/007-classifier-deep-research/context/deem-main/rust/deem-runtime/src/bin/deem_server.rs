//! `deem-server` — drop-in /v1/systemone server for Deem on CPU.

use std::path::PathBuf;
use std::sync::Arc;

fn main() {
    deem_runtime::init_thread_pool();
    let checkpoint = std::env::var("DEEM_CHECKPOINT").unwrap_or_default();
    if checkpoint.is_empty() {
        eprintln!("DEEM_CHECKPOINT is required (HF checkpoint directory)");
        std::process::exit(2);
    }
    let host = std::env::var("DEEM_HOST").unwrap_or_else(|_| "127.0.0.1".into());
    let port: u16 = std::env::var("DEEM_PORT")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(8300);
    let model_id = std::env::var("DEEM_MODEL_ID").unwrap_or_else(|_| "deem-0.8".into());
    let quantize = std::env::var("DEEM_QUANTIZE")
        .map(|v| v != "0" && v != "false")
        .unwrap_or(true);

    let readout = match deem_runtime::readout::Readout::load(&PathBuf::from(&checkpoint), quantize)
    {
        Ok(r) => r,
 Err(e) => {
            eprintln!("failed to load checkpoint: {e}");
            std::process::exit(2);
        }
    };
    let calibration = std::env::var("DEEM_CALIBRATION").ok().map(|path| {
        let key = std::env::var("DEEM_CALIBRATION_KEY").ok();
        deem_runtime::server::Calibration::load(&PathBuf::from(path), key.as_deref())
    });

    // also support DEEM_CHECKPOINT=path:weight,checkpoint2:weight ensembles?
    // v1: single model.
    deem_runtime::server::run(
        Arc::new(readout),
        &host,
        port,
        &model_id,
        calibration,
    );
}
