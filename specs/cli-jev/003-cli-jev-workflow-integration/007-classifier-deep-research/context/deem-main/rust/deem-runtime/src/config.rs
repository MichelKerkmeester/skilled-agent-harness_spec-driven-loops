//! HF config parsing for the Qwen3.5 text backbone (the subset Deem needs).

use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct RootConfig {
    #[serde(default)]
    text_config: Option<TextConfigRaw>,
    // Some fields may be lifted directly when there is no nested text_config.
    #[serde(flatten)]
    flat: Option<TextConfigRaw>,
}

#[derive(Debug, Deserialize)]
struct RopeParameters {
    #[serde(default = "default_rope_theta")]
    rope_theta: f64,
    #[serde(default = "default_one")]
    partial_rotary_factor: f64,
    #[serde(default = "default_mrope_section")]
    mrope_section: Vec<usize>,
}

fn default_rope_theta() -> f64 {
    10000000.0
}
fn default_one() -> f64 {
    1.0
}
fn default_mrope_section() -> Vec<usize> {
    vec![11, 11, 10]
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "snake_case")]
enum LayerType {
    LinearAttention,
    FullAttention,
    #[serde(other)]
    Unknown,
}

#[derive(Debug, Deserialize)]
struct TextConfigRaw {
    #[serde(default)]
    hidden_size: Option<usize>,
    #[serde(default)]
    intermediate_size: Option<usize>,
    #[serde(default)]
    num_hidden_layers: Option<usize>,
    #[serde(default)]
    layer_types: Option<Vec<String>>,
    #[serde(default)]
    num_attention_heads: Option<usize>,
    #[serde(default)]
    num_key_value_heads: Option<usize>,
    #[serde(default)]
    head_dim: Option<usize>,
    #[serde(default)]
    rms_norm_eps: Option<f64>,
    #[serde(default)]
    vocab_size: Option<usize>,
    #[serde(default)]
    tie_word_embeddings: Option<bool>,
    #[serde(default)]
    full_attention_interval: Option<usize>,
    #[serde(default)]
    linear_conv_kernel_dim: Option<usize>,
    #[serde(default)]
    linear_key_head_dim: Option<usize>,
    #[serde(default)]
    linear_num_key_heads: Option<usize>,
    #[serde(default)]
    linear_num_value_heads: Option<usize>,
    #[serde(default)]
    linear_value_head_dim: Option<usize>,
    #[serde(default)]
    rope_parameters: Option<RopeParameters>,
}

#[derive(Debug, Clone)]
pub struct Config {
    pub hidden_size: usize,
    pub intermediate_size: usize,
    pub num_layers: usize,
    pub layer_types: Vec<LayerKind>,
    pub num_heads: usize,
    pub num_kv_heads: usize,
    pub head_dim: usize,
    pub rms_eps: f32,
    pub vocab_size: usize,
    pub tie_word_embeddings: bool,
    pub linear_conv_kernel: usize,
    pub linear_key_head_dim: usize,
    pub linear_num_key_heads: usize,
    pub linear_num_value_heads: usize,
    pub linear_value_head_dim: usize,
    pub rope_theta: f64,
    pub partial_rotary_factor: f64,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum LayerKind {
    LinearAttention,
    FullAttention,
}

pub fn load_config(text: &str) -> std::io::Result<Config> {
    let root: RootConfig = serde_json::from_str(text)
        .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e))?;
    let raw = root.text_config.or(root.flat).ok_or_else(|| {
        std::io::Error::new(std::io::ErrorKind::InvalidData, "no text_config")
    })?;

    let full_attention_interval = raw.full_attention_interval.unwrap_or(4);
    let num_layers = raw.num_hidden_layers.ok_or(missing("num_hidden_layers"))?;
    let layer_types: Vec<LayerKind> = match raw.layer_types {
        Some(types) => types
            .iter()
            .map(|t| match t.as_str() {
                "full_attention" => LayerKind::FullAttention,
                _ => LayerKind::LinearAttention,
            })
            .collect(),
        None => (0..num_layers)
            .map(|i| {
                if (i + 1) % full_attention_interval == 0 {
                    LayerKind::FullAttention
                } else {
                    LayerKind::LinearAttention
                }
            })
            .collect(),
    };
    if layer_types.len() != num_layers {
        return Err(std::io::Error::new(
            std::io::ErrorKind::InvalidData,
            "layer_types length mismatch",
        ));
    }

    let head_dim = raw.head_dim.ok_or(missing("head_dim"))?;
    let rope = raw.rope_parameters.unwrap_or(RopeParameters {
        rope_theta: default_rope_theta(),
        partial_rotary_factor: default_one(),
        mrope_section: default_mrope_section(),
    });

    Ok(Config {
        hidden_size: raw.hidden_size.ok_or(missing("hidden_size"))?,
        intermediate_size: raw.intermediate_size.ok_or(missing("intermediate_size"))?,
        num_layers,
        layer_types,
        num_heads: raw.num_attention_heads.ok_or(missing("num_attention_heads"))?,
        num_kv_heads: raw.num_key_value_heads.ok_or(missing("num_key_value_heads"))?,
        head_dim,
        rms_eps: raw.rms_norm_eps.unwrap_or(1e-6) as f32,
        vocab_size: raw.vocab_size.ok_or(missing("vocab_size"))?,
        tie_word_embeddings: raw.tie_word_embeddings.unwrap_or(true),
        linear_conv_kernel: raw.linear_conv_kernel_dim.unwrap_or(4),
        linear_key_head_dim: raw.linear_key_head_dim.unwrap_or(128),
        linear_num_key_heads: raw.linear_num_key_heads.unwrap_or(16),
        linear_num_value_heads: raw.linear_num_value_heads.unwrap_or(16),
        linear_value_head_dim: raw.linear_value_head_dim.unwrap_or(128),
        rope_theta: rope.rope_theta,
        partial_rotary_factor: rope.partial_rotary_factor,
    })
}

fn missing(field: &str) -> std::io::Error {
    std::io::Error::new(
        std::io::ErrorKind::InvalidData,
        format!("missing config field: {field}"),
    )
}
