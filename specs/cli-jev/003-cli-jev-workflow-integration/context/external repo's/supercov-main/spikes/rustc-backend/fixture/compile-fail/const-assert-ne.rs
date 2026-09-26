pub const fn const_assert_not_equal(left: usize, right: usize) -> usize {
    assert_ne!(left, right);
    1
}

pub const VALUE: usize = const_assert_not_equal(1, 2);
