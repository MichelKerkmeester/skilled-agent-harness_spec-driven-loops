//! Model weights, loading, and single-sequence forward.

use crate::config::{Config, LayerKind};
use crate::layers::{
    full_attention_forward, gated_delta_rule, rmsnorm_batch, rmsnorm_gated, sigmoid, Mlp,
    Linear, RopeTables,
};
use crate::safetensors::SafeTensors;

use std::path::Path;

pub struct Model {
    pub config: Config,
    pub rope: RopeTables,
    // per-layer weights
    pub input_layernorm: Vec<Vec<f32>>,
    pub post_attention_layernorm: Vec<Vec<f32>>,
    pub final_norm: Vec<f32>,
    pub mlp: Vec<Mlp>,
    // GDN layers
    pub gdn_qkv: Vec<Linear>,
    pub gdn_z: Vec<Linear>,
    pub gdn_b: Vec<Linear>,
    pub gdn_a: Vec<Linear>,
    pub gdn_conv: Vec<Vec<f32>>,
    pub gdn_dt_bias: Vec<Vec<f32>>,
    pub gdn_a_log: Vec<Vec<f32>>,
    pub gdn_norm_w: Vec<Vec<f32>>,
    pub gdn_out_proj: Vec<Linear>,
    // full-attention layers
    pub attn_q: Vec<Linear>,
    pub attn_k: Vec<Linear>,
    pub attn_v: Vec<Linear>,
    pub attn_o: Vec<Linear>,
    pub q_norm: Vec<Vec<f32>>,
    pub k_norm: Vec<Vec<f32>>,
    // embeddings
    pub embed: Vec<f32>,
    pub head: Vec<f32>,
}

fn get2(st: &SafeTensors, key: &str, name: &str) -> std::io::Result<Vec<f32>> {
    st.to_f32(key)
        .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, name.to_string()))
}

pub struct LoadOptions {
    pub quantize: bool,
}

impl Default for LoadOptions {
    fn default() -> Self {
        LoadOptions { quantize: true }
    }
}

pub fn load_model(dir: &Path, opts: LoadOptions) -> std::io::Result<Model> {
    let config_text = std::fs::read_to_string(dir.join("config.json"))?;
    let config = crate::config::load_config(&config_text)?;

    // Find safetensors shards
    let mut files: Vec<std::path::PathBuf> = Vec::new();
    for entry in std::fs::read_dir(dir)? {
        let p = entry?.path();
        let name = p.file_name().unwrap().to_string_lossy();
        if name.ends_with(".safetensors") {
            files.push(p);
        }
    }
    files.sort();
    if files.is_empty() {
        return Err(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            "no .safetensors files found",
        ));
    }
    // Merge shard maps
    let mut tensors = SafeTensors::open(&files[0])?;
    for f in &files[1..] {
        let more = SafeTensors::open(f)?;
        tensors.extend(more);
    }

    let q = |w: &[f32], o: usize, i: usize| -> Linear {
        if opts.quantize {
            Linear::quantize(w, o, i)
        } else {
            Linear::from_f32(w.to_vec(), o, i)
        }
    };

    // Resolve checkpoint key prefix (base models: model.language_model.*,
    // merged CausalLM checkpoints: model.*).
    let has = |p: &str| -> bool { tensors.get(p).is_some() };
    let prefix = if has("model.language_model.embed_tokens.weight") {
        "model.language_model"
    } else if has("model.embed_tokens.weight") {
        "model"
    } else {
        return Err(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            "unrecognized checkpoint layout",
        ));
    };

    let mut lin = |name: String| -> std::io::Result<Vec<f32>> {
        let key = format!("{prefix}.{name}");
        get2(&tensors, &key, &name)
    };

    // Load a Linear straight from bf16 checkpoint weights when AVX-512
    // BF16 is available (no conversion error, half the f32 memory,
    // ~2x dot rate via vdpbf16ps); fall back to the f32/i8 path.
    let qn = |name: String, o: usize, i: usize| -> Linear {
        if !opts.quantize && cfg!(target_arch = "x86_64") {
            let detected = std::arch::is_x86_feature_detected!("avx512f")
                && std::arch::is_x86_feature_detected!("avx512bf16");
            if detected {
                let key = format!("{prefix}.{name}");
                if let Some(b) = tensors.to_bf16_raw(&key) {
                    return Linear::from_bf16(b, o, i);
                }
            }
        }
        let w = lin(name).unwrap_or_default();
        q(&w, o, i)
    };

    let n = config.num_layers;
    let hidden = config.hidden_size;
    let key_dim = config.linear_key_head_dim * config.linear_num_key_heads;
    let value_dim = config.linear_value_head_dim * config.linear_num_value_heads;
    let conv_dim = key_dim * 2 + value_dim;

    let mut m = Model {
        rope: RopeTables::new(
            config.rope_theta,
            config.partial_rotary_factor,
            config.head_dim,
            4096,
        ),
        config,
        input_layernorm: Vec::with_capacity(n),
        post_attention_layernorm: Vec::with_capacity(n),
        final_norm: Vec::new(),
        mlp: Vec::with_capacity(n),
        gdn_qkv: Vec::with_capacity(n),
        gdn_z: Vec::with_capacity(n),
        gdn_b: Vec::with_capacity(n),
        gdn_a: Vec::with_capacity(n),
        gdn_conv: Vec::with_capacity(n),
        gdn_dt_bias: Vec::with_capacity(n),
        gdn_a_log: Vec::with_capacity(n),
        gdn_norm_w: Vec::with_capacity(n),
        gdn_out_proj: Vec::with_capacity(n),
        attn_q: Vec::with_capacity(n),
        attn_k: Vec::with_capacity(n),
        attn_v: Vec::with_capacity(n),
        attn_o: Vec::with_capacity(n),
        q_norm: Vec::with_capacity(n),
        k_norm: Vec::with_capacity(n),
        embed: Vec::new(),
        head: Vec::new(),
    };

    for i in 0..n {
        m.input_layernorm
            .push(lin(format!("layers.{i}.input_layernorm.weight"))?);
        m.post_attention_layernorm
            .push(lin(format!("layers.{i}.post_attention_layernorm.weight"))?);
        m.mlp.push(Mlp {
            gate: qn(format!("layers.{i}.mlp.gate_proj.weight"), m.config.intermediate_size, hidden),
            up: qn(format!("layers.{i}.mlp.up_proj.weight"), m.config.intermediate_size, hidden),
            down: qn(format!("layers.{i}.mlp.down_proj.weight"), hidden, m.config.intermediate_size),
        });

        if m.config.layer_types[i] == LayerKind::LinearAttention {
            let b = lin(format!("layers.{i}.linear_attn.in_proj_b.weight"))?;
            let a = lin(format!("layers.{i}.linear_attn.in_proj_a.weight"))?;
            let conv = lin(format!("layers.{i}.linear_attn.conv1d.weight"))?;
            m.gdn_qkv.push(qn(format!("layers.{i}.linear_attn.in_proj_qkv.weight"), conv_dim, hidden));
            m.gdn_z.push(qn(format!("layers.{i}.linear_attn.in_proj_z.weight"), value_dim, hidden));
            m.gdn_b.push(Linear::from_f32(b, m.config.linear_num_value_heads, hidden));
            m.gdn_a.push(Linear::from_f32(a, m.config.linear_num_value_heads, hidden));
            m.gdn_conv.push(conv);
            m.gdn_dt_bias
                .push(lin(format!("layers.{i}.linear_attn.dt_bias"))?);
            m.gdn_a_log
                .push(lin(format!("layers.{i}.linear_attn.A_log"))?);
            m.gdn_norm_w
                .push(lin(format!("layers.{i}.linear_attn.norm.weight"))?);
            m.gdn_out_proj.push(qn(format!("layers.{i}.linear_attn.out_proj.weight"), hidden, value_dim));
        } else {
            let qo = m.config.num_heads * m.config.head_dim * 2;
            let ko = m.config.num_kv_heads * m.config.head_dim;
            m.attn_q.push(qn(format!("layers.{i}.self_attn.q_proj.weight"), qo, hidden));
            m.attn_k.push(qn(format!("layers.{i}.self_attn.k_proj.weight"), ko, hidden));
            m.attn_v.push(qn(format!("layers.{i}.self_attn.v_proj.weight"), ko, hidden));
            m.attn_o.push(qn(
                format!("layers.{i}.self_attn.o_proj.weight"),
                hidden,
                m.config.num_heads * m.config.head_dim,
            ));
            m.q_norm.push(lin(format!("layers.{i}.self_attn.q_norm.weight"))?);
            m.k_norm.push(lin(format!("layers.{i}.self_attn.k_norm.weight"))?);
        }
    }
    m.final_norm = lin("norm.weight".to_string())?;
    m.embed = lin("embed_tokens.weight".to_string())?;
    m.head = if m.config.tie_word_embeddings {
        m.embed.clone()
    } else {
        // lm_head lives outside the model prefix in merged checkpoints
        // (e.g. lm_head.weight vs model.language_model.lm_head.weight).
        let prefixed = format!("{prefix}.lm_head.weight");
        match get2(&tensors, &prefixed, "lm_head.weight")
            .or_else(|_| get2(&tensors, "lm_head.weight", "lm_head.weight"))
        {
            Ok(h) => h,
            Err(_) => {
                return Err(std::io::Error::new(
                    std::io::ErrorKind::NotFound,
                    "lm_head.weight not found and tie_word_embeddings is false",
                ))
            }
        }
    };
    Ok(m)
}

fn softplus(x: f32) -> f32 {
    if x > 20.0 {
        x
    } else if x < -20.0 {
        x.exp()
    } else {
        (1.0 + x.exp()).ln()
    }
}

use rayon::prelude::*;

impl Model {
    /// Forward pass over token ids. Returns final hidden states [t, hidden].
    pub fn forward_hidden(&self, tokens: &[u32]) -> Vec<f32> {
        self.forward_hidden_inner(tokens, None)
    }

    /// Profiled forward: reports per-stage times to stderr.
    pub fn forward_hidden_profiled(&self, tokens: &[u32]) -> Vec<f32> {
        let mut t = Timings::default();
        let out = self.forward_hidden_inner(tokens, Some(&mut t));
        eprintln!("{t}");
        out
    }

    /// Hidden state after each layer block (post attn+MLP), for parity
    /// bisection. Index i of the returned Vec is the hidden state after
    /// layer i's full block; the final element is the final-normed output.
    pub fn forward_trace(&self, tokens: &[u32]) -> Vec<Vec<f32>> {
        let t = tokens.len();
        let hidden = self.config.hidden_size;
        let mut x = vec![0.0f32; t * hidden];
        for (p, tok) in tokens.iter().enumerate() {
            let base = (*tok as usize) * hidden;
            x[p * hidden..(p + 1) * hidden]
                .copy_from_slice(&self.embed[base..base + hidden]);
        }
        let mut trace = Vec::with_capacity(self.config.layer_types.len() + 1);
        let mut attn_counter = 0usize;
        for (i, kind) in self.config.layer_types.iter().enumerate() {
            let normed = rmsnorm_batch(
                &x,
                &self.input_layernorm[i],
                self.config.rms_eps,
                t,
                hidden,
            );
            let out = match kind {
                LayerKind::LinearAttention => self.gdn_forward(i, &normed, t),
                LayerKind::FullAttention => {
                    let idx = attn_counter;
                    attn_counter += 1;
                    full_attention_forward(
                        &normed,
                        t,
                        &self.attn_q[idx],
                        &self.attn_k[idx],
                        &self.attn_v[idx],
                        &self.attn_o[idx],
                        &self.q_norm[idx],
                        &self.k_norm[idx],
                        &self.rope,
                        &self.config,
                    )
                }
            };
            for (a, b) in x.iter_mut().zip(out.iter()) {
                *a += b;
            }
            let normed = rmsnorm_batch(
                &x,
                &self.post_attention_layernorm[i],
                self.config.rms_eps,
                t,
                hidden,
            );
            let mlp_out = self.mlp[i].forward(&normed, t);
            for (a, b) in x.iter_mut().zip(mlp_out.iter()) {
                *a += b;
            }
            trace.push(x.clone());
        }
        let final_h = rmsnorm_batch(
            &x,
            &self.final_norm,
            self.config.rms_eps,
            t,
            hidden,
        );
        trace.push(final_h);
        trace
    }

    fn forward_hidden_inner(&self, tokens: &[u32], mut timing: Option<&mut Timings>) -> Vec<f32> {
        let t = tokens.len();
        let hidden = self.config.hidden_size;
        let mut x = vec![0.0f32; t * hidden];
        for (p, tok) in tokens.iter().enumerate() {
            let base = (*tok as usize) * hidden;
            x[p * hidden..(p + 1) * hidden]
                .copy_from_slice(&self.embed[base..base + hidden]);
        }

        let mut attn_counter = 0usize;
        let mut gdn_counter = 0usize;
        for (i, kind) in self.config.layer_types.iter().enumerate() {
            let normed = rmsnorm_batch(
                &x,
                &self.input_layernorm[i],
                self.config.rms_eps,
                t,
                hidden,
            );
            let out = match kind {
                LayerKind::LinearAttention => {
                    gdn_counter += 1;
                    let start = std::time::Instant::now();
                    let o = self.gdn_forward(i, &normed, t);
                    if let Some(tm) = timing.as_mut() {
                        tm.gdn_ms += start.elapsed().as_secs_f64() * 1000.0;
                    }
                    o
                }
                LayerKind::FullAttention => {
                    let idx = attn_counter;
                    attn_counter += 1;
                    let start = std::time::Instant::now();
                    let o = full_attention_forward(
                        &normed,
                        t,
                        &self.attn_q[idx],
                        &self.attn_k[idx],
                        &self.attn_v[idx],
                        &self.attn_o[idx],
                        &self.q_norm[idx],
                        &self.k_norm[idx],
                        &self.rope,
                        &self.config,
                    );
                    if let Some(tm) = timing.as_mut() {
                        tm.attn_ms += start.elapsed().as_secs_f64() * 1000.0;
                    }
                    o
                }
            };
            for (a, b) in x.iter_mut().zip(out.iter()) {
                *a += b;
            }

            let normed = rmsnorm_batch(
                &x,
                &self.post_attention_layernorm[i],
                self.config.rms_eps,
                t,
                hidden,
            );
            let start = std::time::Instant::now();
            let mlp_out = self.mlp[i].forward(&normed, t);
            if let Some(tm) = timing.as_mut() {
                tm.mlp_ms += start.elapsed().as_secs_f64() * 1000.0;
            }
            for (a, b) in x.iter_mut().zip(mlp_out.iter()) {
                *a += b;
            }
        }

        rmsnorm_batch(
            &x,
            &self.final_norm,
            self.config.rms_eps,
            t,
            hidden,
        )
    }
}

#[derive(Default)]
struct Timings {
    gdn_ms: f64,
    attn_ms: f64,
    mlp_ms: f64,
}

impl std::fmt::Display for Timings {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "gdn={:.0}ms attn={:.0}ms mlp={:.0}ms",
            self.gdn_ms, self.attn_ms, self.mlp_ms
        )
    }
}

impl Model {
    fn gdn_forward(&self, layer_idx: usize, normed: &[f32], t: usize) -> Vec<f32> {
        let cfg = &self.config;
        let hidden = cfg.hidden_size;
        let num_heads = cfg.linear_num_value_heads;
        let num_k_heads = cfg.linear_num_key_heads;
        let dk = cfg.linear_key_head_dim;
        let dv = cfg.linear_value_head_dim;
        let idx = gdn_layer_index(self, layer_idx);

        let mixed = self.gdn_qkv[idx].forward(normed, t); // [t, conv_dim]
        let z = self.gdn_z[idx].forward(normed, t); // [t, value_dim]
        let b = self.gdn_b[idx].forward(normed, t); // [t, H]
        let a = self.gdn_a[idx].forward(normed, t); // [t, H]

        let _ = hidden;

        let conv_dim = mixed.len() / t;
        // causal depthwise conv (kernel 4, lookback 3) + silu, AVX-512,
        // parallel over row blocks; weights transposed once to [k4, conv_dim]
        let k4 = cfg.linear_conv_kernel;
        let conv_w = &self.gdn_conv[idx]; // [conv_dim, k4]
        let mut wt = vec![0.0f32; conv_dim * k4];
        for c in 0..conv_dim {
            for j in 0..k4 {
                wt[j * conv_dim + c] = conv_w[c * k4 + j];
            }
        }
        let conv_out = {
            const RB: usize = 64; // rows per job
            let mut co = vec![0.0f32; mixed.len()];
            let co_ptr = std::sync::Arc::new(std::sync::atomic::AtomicPtr::new(
                co.as_mut_ptr(),
            ));
            let njobs = t.div_ceil(RB);
            (0..njobs).into_par_iter().for_each(|jb| {
                let co = unsafe {
                    std::slice::from_raw_parts_mut(
                        co_ptr.load(std::sync::atomic::Ordering::Relaxed),
                        mixed.len(),
                    )
                };
                let p0 = jb * RB;
                let p1 = (p0 + RB).min(t);
                let mut acc = vec![0.0f32; conv_dim];
                for p in p0..p1 {
                    for c in 0..conv_dim {
                        acc[c] = 0.0;
                    }
                    for j in 0..k4 {
                        let src = p as isize + j as isize - (k4 as isize - 1);
                        if src < 0 {
                            continue;
                        }
                        let in_row = &mixed
                            [src as usize * conv_dim..src as usize * conv_dim + conv_dim];
                        crate::kernels::scan::fma_row(
                            &mut acc,
                            &wt[j * conv_dim..(j + 1) * conv_dim],
                            in_row,
                        );
                    }
                    let out_row = &mut co[p * conv_dim..(p + 1) * conv_dim];
                    out_row.copy_from_slice(&acc);
                    crate::kernels::scan::silu_in_place(out_row);
                }
            });
            co
        };

        // split q [t, Hk, dk], k [t, Hk, dk], v [t, Hv, dv] — GQA layout:
        // key heads and value heads differ (e.g. deem-9b: 16 key / 32 value).
        // Matches transformers' Qwen3NextGatedDeltaNet: split as
        // [key_dim, key_dim, value_dim], then q/k are repeat_interleave'd
        // to value heads before the delta-rule scan.
        let key_dim = dk * num_k_heads;
        let gqa = num_heads / num_k_heads.max(1);
        let mut q = vec![0.0f32; t * num_heads * dk];
        let mut k = vec![0.0f32; t * num_heads * dk];
        let mut v = vec![0.0f32; t * num_heads * dv];
        let mut beta = vec![0.0f32; t * num_heads];
        let mut g = vec![0.0f32; t * num_heads];
        let dt_bias = &self.gdn_dt_bias[idx];
        let a_log = &self.gdn_a_log[idx];
        for p in 0..t {
            for h in 0..num_heads {
                let kh = h / gqa.max(1);
                for d in 0..dk {
                    q[(p * num_heads + h) * dk + d] =
                        conv_out[p * conv_dim + kh * dk + d];
                    k[(p * num_heads + h) * dk + d] =
                        conv_out[p * conv_dim + key_dim + kh * dk + d];
                    v[(p * num_heads + h) * dv + d] =
                        conv_out[p * conv_dim + 2 * key_dim + h * dv + d];
                }
                beta[p * num_heads + h] = sigmoid(b[p * num_heads + h]);
                g[p * num_heads + h] = -a_log[h].exp()
                    * softplus(a[p * num_heads + h] + dt_bias[h]);
            }
        }

        let core = gated_delta_rule(
            &mut q, &mut k, &v, &beta, &g, t, num_heads, dk, dv, 64,
        );

        // gated norm + out_proj (vectorized over rows)
        let mut normed_out = vec![0.0f32; t * num_heads * dv];
        {
            let w = &self.gdn_norm_w[idx];
            let eps = self.config.rms_eps;
            normed_out
                .par_chunks_exact_mut(num_heads * dv)
                .zip(core.par_chunks_exact(num_heads * dv))
                .zip(z.par_chunks_exact(num_heads * dv))
                .for_each(|((orow, xrow), zrow)| {
                    for h in 0..num_heads {
                        let x = &xrow[h * dv..(h + 1) * dv];
                        let zz = &zrow[h * dv..(h + 1) * dv];
                        let or = &mut orow[h * dv..(h + 1) * dv];
                        let acc = crate::kernels::scan::dot_xx(x);
                        let inv = (acc / dv as f32 + eps).recip().sqrt();
                        let mut zs = zz.to_vec();
                        crate::kernels::scan::silu_in_place(&mut zs);
                        crate::kernels::scan::mul3_scaled(x, w, &zs, inv, or);
                    }
                });
        }
        self.gdn_out_proj[idx].forward(&normed_out, t)
    }
}

fn gdn_layer_index(m: &Model, layer_idx: usize) -> usize {
    m.config
        .layer_types
        .iter()
        .take(layer_idx)
        .filter(|k| **k == LayerKind::LinearAttention)
        .count()
}
