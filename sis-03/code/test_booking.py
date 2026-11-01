import unittest
from booking import can_book


class TestCanBook(unittest.TestCase):
    def setUp(self):
        self.now = 540
        self.existing = [(600, 660)]

    def test_t1_touching(self):
        self.assertTrue(can_book(660, 720, self.now, False, self.existing))

    def test_t2_overlap(self):
        self.assertFalse(can_book(630, 690, self.now, False, self.existing))

    def test_t3_blocked(self):
        self.assertFalse(can_book(660, 720, self.now, True, self.existing))

    def test_t4_exactly_120(self):
        self.assertTrue(can_book(720, 840, self.now, False, self.existing))

    def test_t5_121_minutes(self):
        self.assertFalse(can_book(720, 841, self.now, False, self.existing))

    def test_t6_starts_now(self):
        self.assertFalse(can_book(540, 570, self.now, False, self.existing))

    def test_t7_reversed(self):
        self.assertFalse(can_book(720, 660, self.now, False, self.existing))

    def test_t8_midnight(self):
        self.assertTrue(can_book(1380, 1440, self.now, False, self.existing))

    def test_t9_past_midnight(self):
        self.assertFalse(can_book(1380, 1441, self.now, False, self.existing))

    def test_t10_second_booking(self):
        existing = [(600, 660), (700, 760)]
        self.assertFalse(can_book(720, 780, self.now, False, existing))

    def test_t11_same_check_twice(self):
        before = self.existing.copy()
        can_book(660, 720, self.now, False, self.existing)
        result = can_book(660, 720, self.now, False, self.existing)
        self.assertTrue(result)
        self.assertEqual(self.existing, before)

    def test_now_out_of_range(self):
        self.assertFalse(can_book(660, 720, -1, False, self.existing))

    def test_bool_is_not_integer_time(self):
        self.assertFalse(can_book(660, 720, True, False, self.existing))
    def test_equal_start_end(self):
            self.assertFalse(can_book(720, 720, self.now, False, self.existing))
    
    def test_request_inside_existing(self):
        self.assertFalse(can_book(610, 650, self.now, False, self.existing))
    
    def test_existing_inside_request(self):
        self.assertFalse(can_book(570, 690, self.now, False, self.existing))
    
    def test_result_is_real_true_boolean(self):
        result = can_book(660, 720, self.now, False, self.existing)
        self.assertIs(result, True)
    
    def test_result_is_real_false_boolean(self):
        result = can_book(630, 690, self.now, False, self.existing)
        self.assertIs(result, False)
    def test_existing_list_order_is_unchanged(self):
        existing = [(700, 760), (600, 660)]
        original = existing.copy()

        can_book(660, 690, self.now, False, existing)

        self.assertEqual(existing, original)

if __name__ == "__main__":
    unittest.main()