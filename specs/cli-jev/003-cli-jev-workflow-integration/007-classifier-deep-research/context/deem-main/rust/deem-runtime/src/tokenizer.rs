//! Tokenizer wrapper: loads tokenizer.json from the checkpoint directory.

use std::path::Path;

pub struct Tokenizer {
    inner: tokenizers::Tokenizer,
    /// Token ids of the 26 single-letter option rows (A..Z).
    pub letter_ids: Vec<u32>,
}

impl Tokenizer {
    pub fn load(dir: &Path) -> Result<Self, String> {
        let path = dir.join("tokenizer.json");
        let inner = tokenizers::Tokenizer::from_file(path.to_str().ok_or("bad path")?)
            .map_err(|e| e.to_string())?;
        let mut letter_ids = Vec::with_capacity(26);
        for i in 0..26u8 {
            let ch = String::from((b'A' + i) as char);
            let ids = inner
                .encode(ch, false)
                .map_err(|e| e.to_string())?
                .get_ids()
                .to_vec();
            if ids.len() != 1 {
                return Err(format!(
                    "letter {} is not a single token ({:?})",
                    b'A' + i,
                    ids
                ));
            }
            letter_ids.push(ids[0]);
        }
        Ok(Tokenizer { inner, letter_ids })
    }

    pub fn encode(&self, text: &str) -> Vec<u32> {
        self.inner
            .encode(text, false)
            .expect("tokenization failed")
            .get_ids()
            .to_vec()
    }
}
