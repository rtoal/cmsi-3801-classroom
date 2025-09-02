
import unittest
from exercises import (
    first_then_apply,
    say,
    powers_generator,
    meaningful_line_count,
    Quaternion)


class TestExercises(unittest.TestCase):
    def test_first_then_apply(self):
        def nonempty(s): return s != ""
        def length_greater_than_3(s): return len(s) > 3
        def to_lower(s): return s.lower()
        def starts_with_b(s): return s.lower().startswith('b')
        self.assertIsNone(first_then_apply([], nonempty, to_lower))
        self.assertEqual(first_then_apply(
            ["", "A", "B"], nonempty, to_lower), "a")
        self.assertIsNone(first_then_apply(
            ["", "A", "ABC"], length_greater_than_3, to_lower))
        self.assertEqual(first_then_apply(
            ["ABC", "ABCD", "ABCDE"], length_greater_than_3, to_lower), "abcd")
        self.assertEqual(first_then_apply(
            ["ABC", "ABCD", "ABCDE", "Bee"], starts_with_b, to_lower), "bee")
        self.assertEqual(first_then_apply(
            ["ABC", "ABCD", "ABCDE", "Bee"], starts_with_b, len), 3)
        # Test kwargs
        self.assertEqual(
            first_then_apply(
                strings=["A", "B"], predicate=nonempty, function=to_lower),
            "a")
        self.assertEqual(
            first_then_apply(
                predicate=length_greater_than_3, function=to_lower, strings=["A", "B"]),
            None)

    def test_say(self):
        self.assertEqual(say(), "")
        self.assertEqual(say("hi")(), "hi")
        self.assertEqual(say("hi")("there")(), "hi there")
        self.assertEqual(say("hello")("my")("name")("is")(
            "Colette")(), "hello my name is Colette")
        self.assertEqual(say("h i")(), "h i")
        self.assertEqual(say("hi ")("   there")(), "hi     there")
        self.assertEqual(say("")("")("dog")("")("go")(), "  dog  go")
        self.assertEqual(say("😄🤗")("💀👊🏾")(), "😄🤗 💀👊🏾")

    def test_powers_generator(self):
        g2 = powers_generator(base=3, limit=100)
        self.assertEqual(next(g2), 1)
        self.assertEqual(next(g2), 3)
        self.assertEqual(next(g2), 9)
        self.assertEqual(next(g2), 27)
        self.assertEqual(next(g2), 81)
        with self.assertRaises(StopIteration):
            next(g2)
        self.assertEqual(list(powers_generator(
            base=3, limit=27)), [1, 3, 9, 27])

    def test_meaningful_line_count(self):
        with self.assertRaises(FileNotFoundError) as e:
            meaningful_line_count("no-such-file.txt")
        self.assertEqual(meaningful_line_count(
            "../../test-data/test-for-line-count.txt"), 5)

    def test_quaternion(self):
        q = Quaternion(3.5, 2.25, -100.0, -1.25)
        self.assertEqual(q.a, 3.5)
        self.assertEqual(q.b, 2.25)
        self.assertEqual(q.c, -100.0)
        self.assertEqual(q.d, -1.25)

        q1 = Quaternion(1.0, 3.0, 5.0, 2.0)
        q2 = Quaternion(-2.0, 2.0, 8.0, -1.0)
        q3 = Quaternion(-1.0, 5.0, 13.0, 1.0)
        q4 = Quaternion(-46.0, -25.0, 5.0, 9.0)

        zero = Quaternion()
        i = Quaternion(b=1)
        j = Quaternion(c=1)
        k = Quaternion(d=1)

        self.assertEqual(zero.coefficients, (0.0, 0.0, 0.0, 0.0))
        self.assertEqual(i.coefficients, (0.0, 1.0, 0.0, 0.0))
        self.assertEqual(j.coefficients, (0.0, 0.0, 1.0, 0.0))
        self.assertEqual(k.coefficients, (0.0, 0.0, 0.0, 1.0))
        self.assertEqual(q2.coefficients, (-2.0, 2.0, 8.0, -1.0))
        self.assertEqual(q4.conjugate, Quaternion(-46.0, 25.0, -5.0, -9.0))

        self.assertEqual(q1 + q2, q3)
        self.assertEqual(q1 * q2, q4)
        self.assertEqual(q1 + zero, q1)
        self.assertEqual(q1 * zero, zero)
        self.assertEqual(i * j, k)
        self.assertEqual(j * k, i)
        self.assertEqual(j + i, Quaternion(c=1, b=1))

        self.assertEqual(f"{zero}", "0")
        self.assertEqual(f"{j}", "j")
        self.assertEqual(f"{k.conjugate}", "-k")
        self.assertEqual(
            f"{j.conjugate * Quaternion(2.0, 0.0, 0.0, 0.0)}", "-2.0j")
        self.assertEqual(f"{j + k}", "j+k")
        self.assertEqual(f"{Quaternion(0.0, -1.0, 0.0, 2.25)}", "-i+2.25k")
        self.assertEqual(
            f"{Quaternion(-20.0, -1.75, 13.0, -2.25)}", "-20.0-1.75i+13.0j-2.25k")
        self.assertEqual(f"{Quaternion(-1.0, -2.0, 0.0, 0.0)}", "-1.0-2.0i")
        self.assertEqual(f"{Quaternion(1.0, 0.0, -2.0, 5.0)}", "1.0-2.0j+5.0k")


if __name__ == "__main__":
    unittest.main()
