pub const fn const_assert_equal(left: usize, right: usize) -> usize {
    assert_eq!(left, right);
    1
}

pub const VALUE: usize = const_assert_equal(1, 1);
