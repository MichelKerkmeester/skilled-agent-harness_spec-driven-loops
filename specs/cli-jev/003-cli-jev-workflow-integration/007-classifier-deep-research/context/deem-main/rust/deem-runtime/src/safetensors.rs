//! Minimal safetensors reader: enough to mmap .safetensors files and expose
//! tensors as borrowed or owned buffers without a heavyweight dependency.

use std::collections::HashMap;
use std::fs::File;
use std::io::Read;
use std::path::Path;

#[derive(Debug)]
pub struct Tensor {
    pub dtype: Dtype,
    pub shape: Vec<usize>,
    pub data: Vec<u8>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Dtype {
    F32,
    Bf16,
    F16,
    F64,
    I64,
    U8,
    U32,
}

impl Dtype {
    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "F32" => Some(Dtype::F32),
            "BF16" => Some(Dtype::Bf16),
            "F16" => Some(Dtype::F16),
            "F64" => Some(Dtype::F64),
            "I64" => Some(Dtype::I64),
            "U8" => Some(Dtype::U8),
            "U32" => Some(Dtype::U32),
            _ => None,
        }
    }

    pub fn size(self) -> usize {
        match self {
            Dtype::F32 | Dtype::I64 | Dtype::U32 => 4,
            Dtype::Bf16 | Dtype::F16 | Dtype::U8 => 2,
            Dtype::F64 => 8,
        }
    }
}

#[derive(Debug)]
pub struct SafeTensors {
    tensors: HashMap<String, Tensor>,
}

impl SafeTensors {
    pub fn open(path: &Path) -> std::io::Result<Self> {
        let mut file = File::open(path)?;
        let mut len_buf = [0u8; 8];
        file.read_exact(&mut len_buf)?;
        let header_len = u64::from_le_bytes(len_buf) as usize;
        if header_len > 512 * 1024 * 1024 {
            return Err(std::io::Error::new(
                std::io::ErrorKind::InvalidData,
                "safetensors header too large",
            ));
        }
        let mut header = vec![0u8; header_len];
        file.read_exact(&mut header)?;
        let mut use_rest = file.take(u64::MAX);
        let mut data = Vec::new();
        use_rest.read_to_end(&mut data)?;

        let header: serde_json::Value = serde_json::from_slice(&header)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e))?;
        let entries = header
            .as_object()
            .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::InvalidData, "bad header"))?;

        let mut tensors = HashMap::new();
        for (name, meta) in entries {
            if name == "__metadata__" {
                continue;
            }
            let dtype = Dtype::from_str(
                meta["dtype"].as_str().unwrap_or_default(),
            )
            .ok_or_else(|| {
                std::io::Error::new(
                    std::io::ErrorKind::InvalidData,
                    format!("unknown dtype in {name}"),
                )
            })?;
            let shape: Vec<usize> = meta["shape"]
                .as_array()
                .map(|a| a.iter().filter_map(|v| v.as_u64().map(|x| x as usize)).collect())
                .unwrap_or_default();
            let offsets = meta["data_offsets"]
                .as_array()
                .ok_or_else(|| {
                    std::io::Error::new(std::io::ErrorKind::InvalidData, "missing offsets")
                })?;
            let start = offsets[0].as_u64().unwrap_or(0) as usize;
            let end = offsets[1].as_u64().unwrap_or(0) as usize;
            if end > data.len() {
                return Err(std::io::Error::new(
                    std::io::ErrorKind::InvalidData,
                    format!("tensor {name} out of bounds"),
                ));
            }
            tensors.insert(
                name.to_string(),
                Tensor {
                    dtype,
                    shape,
                    data: data[start..end].to_vec(),
                },
            );
        }
        Ok(SafeTensors { tensors })
    }

    pub fn get(&self, name: &str) -> Option<&Tensor> {
        self.tensors.get(name)
    }

    /// Union two shard maps (later wins on collision).
    pub fn extend(&mut self, other: SafeTensors) {
        for (k, v) in other.tensors {
            self.tensors.insert(k, v);
        }
    }

    /// Raw bf16 payload as u16 (little-endian), no conversion.
    /// None if the tensor is not bf16.
    pub fn to_bf16_raw(&self, name: &str) -> Option<Vec<u16>> {
        let t = self.tensors.get(name)?;
        if t.dtype != Dtype::Bf16 {
            return None;
        }
        Some(
            t.data
                .chunks_exact(2)
                .map(|c| u16::from_le_bytes([c[0], c[1]]))
                .collect(),
        )
    }

    /// bf16/f16 -> f32, f32 copy.
    pub fn to_f32(&self, name: &str) -> Option<Vec<f32>> {
        let t = self.tensors.get(name)?;
        let n: usize = t.shape.iter().product();
        match t.dtype {
            Dtype::F32 => {
                let mut out = vec![0f32; n];
                for (o, chunk) in out.iter_mut().zip(t.data.chunks_exact(4)) {
                    *o = f32::from_le_bytes([chunk[0], chunk[1], chunk[2], chunk[3]]);
                }
                Some(out)
            }
            Dtype::Bf16 => Some(
                t.data
                    .chunks_exact(2)
                    .map(|c| f32::from_bits(u32::from_le_bytes([c[0], c[1], 0, 0]) << 16))
                    .collect(),
            ),
            Dtype::F16 => Some(
                t.data
                    .chunks_exact(2)
                    .map(|c| half_to_f32(u16::from_le_bytes([c[0], c[1]])))
                    .collect(),
            ),
            _ => None,
        }
    }
}

fn half_to_f32(h: u16) -> f32 {
    let sign = ((h >> 15) & 1) as u32;
    let exp = ((h >> 10) & 0x1f) as u32;
    let frac = (h & 0x3ff) as u32;
    let bits = if exp == 0 {
        if frac == 0 {
            sign << 31
        } else {
            let e = (frac as f32).log2().floor() as i32 + 1;
            let e = (127 - 15 - e + 23) as u32;
            let frac = ((frac as u32) << e) & 0x7ff_ffff;
            (sign << 31) | frac
        }
    } else if exp == 0x1f {
        (sign << 31) | 0x7f80_0000 | (frac << 13)
    } else {
        (sign << 31) | ((exp - 15 + 127) << 23) | (frac << 13)
    };
    f32::from_bits(bits)
}
