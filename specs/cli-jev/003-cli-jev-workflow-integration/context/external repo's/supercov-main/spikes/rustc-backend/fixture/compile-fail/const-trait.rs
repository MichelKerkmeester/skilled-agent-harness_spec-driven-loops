#[const_trait]
pub trait Value {
    fn value(&self) -> usize;
}

impl const Value for usize {
    fn value(&self) -> usize {
        *self
    }
}

pub const VALUE: usize = 3usize.value();
