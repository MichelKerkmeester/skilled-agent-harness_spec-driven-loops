pub const fn const_assertion(value: bool) -> usize {
    assert!(value);
    1
}

pub const VALUE: usize = const_assertion(false);
