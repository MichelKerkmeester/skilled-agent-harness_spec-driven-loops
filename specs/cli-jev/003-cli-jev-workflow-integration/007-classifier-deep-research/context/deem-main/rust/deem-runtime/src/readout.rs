//! Letter-slot readout: prompt -> forward pass -> letter logits at the slot.

use crate::model::Model;
use crate::tokenizer::Tokenizer;

pub struct Readout {
    pub model: Model,
    pub tokenizer: Tokenizer,
}

impl Readout {
    pub fn load(dir: &std::path::Path, quantize: bool) -> Result<Self, String> {
        let model = crate::model::load_model(
            dir,
            crate::model::LoadOptions { quantize },
        )
        .map_err(|e| e.to_string())?;
        let tokenizer = Tokenizer::load(dir)?;
        Ok(Readout { model, tokenizer })
    }

    /// Letter logits at the answer slot (last token of the prompt).
    pub fn slot_logits(&self, prompt: &str) -> (Vec<f32>, usize) {
        let ids = self.tokenizer.encode(prompt);
        let t = ids.len();
        let hidden = self.model.forward_hidden(&ids);
        return self.letter_logits_from_hidden(&hidden, t - 1);
    }

    /// Batched variant: one forward pass per prompt (promps are per-question
    /// rows; callers batch at the HTTP layer).
    pub fn slot_logits_batch(&self, prompts: &[&str]) -> Vec<(Vec<f32>, usize)> {
        prompts
            .iter()
            .map(|p| self.slot_logits(p))
            .collect()
    }

    /// Read letter logits from precomputed hidden states at `position`.
    pub fn letter_logits_from_hidden(
        &self,
        hidden: &[f32],
        position: usize,
    ) -> (Vec<f32>, usize) {
        let hidden_size = self.model.config.hidden_size;
        let h = &hidden[position * hidden_size..(position + 1) * hidden_size];
        let head = &self.model.head;
        let mut logits = Vec::with_capacity(26);
        for tok in &self.tokenizer.letter_ids {
            let row = &head[(*tok as usize) * hidden_size..(*tok as usize + 1) * hidden_size];
            let mut dot = 0.0f32;
            for (a, b) in h.iter().zip(row.iter()) {
                dot += a * b;
            }
            logits.push(dot);
        }
        (logits, position + 1)
    }
}
