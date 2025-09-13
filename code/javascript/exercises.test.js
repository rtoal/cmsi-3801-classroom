import { describe, it } from "node:test"
import { deepEqual, throws, rejects } from "node:assert/strict"
import {
  firstThenApply,
  say,
  powersGenerator,
  meaningfulLineCount,
  Quaternion,
} from "./exercises.js"

describe("The firstThenApply function", () => {
  const nonempty = (s) => s !== ""
  const lengthGreaterThan3 = (s) => s.length > 3
  const toLower = (s) => s.toLowerCase()
  const startsWithB = (s) => s.toLowerCase().startsWith("b")
  deepEqual(firstThenApply([], nonempty, toLower), undefined)
  deepEqual(firstThenApply(["", "A", "B"], nonempty, toLower), "a")
  deepEqual(
    firstThenApply(["", "A", "ABC"], lengthGreaterThan3, toLower),
    undefined
  )
  deepEqual(
    firstThenApply(["ABC", "ABCD", "ABCDE"], lengthGreaterThan3, toLower),
    "abcd"
  )
  deepEqual(
    firstThenApply(["ABC", "ABCD", "ABCDE", "Bee"], startsWithB, toLower),
    "bee"
  )
  deepEqual(
    firstThenApply(
      ["ABC", "ABCD", "ABCDE", "Bee"],
      startsWithB,
      (s) => s.length
    ),
    3
  )
})

describe("The say function", () => {
  it("works when there are no words", () => {
    deepEqual(say(), "")
  })
  it("works when there are words", () => {
    deepEqual(say("hi")(), "hi")
    deepEqual(say("hi")("there")(), "hi there")
    deepEqual(
      say("hello")("my")("name")("is")("Colette")(),
      "hello my name is Colette"
    )
  })
  it("handles spaces and empty words", () => {
    deepEqual(say("h i")(), "h i")
    deepEqual(say("hi ")("   there")(), "hi     there")
    deepEqual(say("")("")("dog")("")("go")(), "  dog  go")
  })
  it("handles emojis", () => {
    deepEqual(say("😄🤗")("💀👊🏾")(), "😄🤗 💀👊🏾")
  })
})

describe("The powers generator", () => {
  it("works as expected", () => {
    const g1 = powersGenerator({ ofBase: 2, upTo: 1 })
    deepEqual(g1.next(), { value: 1, done: false })
    deepEqual(g1.next(), { value: undefined, done: true })
    const g2 = powersGenerator({ ofBase: 3, upTo: 100 })
    deepEqual(g2.next(), { value: 1, done: false })
    deepEqual(g2.next(), { value: 3, done: false })
    deepEqual(g2.next(), { value: 9, done: false })
    deepEqual(g2.next(), { value: 27, done: false })
    deepEqual(g2.next(), { value: 81, done: false })
    deepEqual(g2.next(), { value: undefined, done: true })
    deepEqual([...powersGenerator({ ofBase: 3, upTo: 27 })], [1, 3, 9, 27])
  })
})

describe("The meaningfulLineCount function", async () => {
  await it("throws if no such file", async () => {
    rejects(async () => await meaningfulLineCount("NoSuchFile.txt"), /Error/)
  })
  await it("correctly counts lines for the test file", async () => {
    const count = await meaningfulLineCount(
      "../../test-data/test-for-line-count.txt"
    )
    deepEqual(count, 5)
  })
})

describe("The Quaternion class", () => {
  const zero = new Quaternion(0, 0, 0, 0)
  const i = new Quaternion(0, 1, 0, 0)
  const j = new Quaternion(0, 0, 1, 0)
  const k = new Quaternion(0, 0, 0, 1)
  const q = new Quaternion(3.5, 2.25, -100, -1.25)
  const q1 = new Quaternion(1, 3, 5, 2)
  const q2 = new Quaternion(-2, 2, 8, -1)
  const q3 = new Quaternion(-1, 5, 13, 1)
  const q4 = new Quaternion(-46, -25, 5, 9)
  it("can access fields", () => {
    deepEqual(q.a, 3.5)
    deepEqual(q.b, 2.25)
    deepEqual(q.c, -100)
    deepEqual(q.d, -1.25)
  })
  it("freezes instances", () => {
    deepEqual(Object.isFrozen(q), true)
    throws(() => (q.a = 0), /Cannot assign to read only property 'a'/)
    throws(() => (q.b = 0), /TypeError/)
    throws(() => (q.c = 0), /TypeError/)
    throws(() => (q.d = 0), /TypeError/)
  })
  it("can echo coefficients", () => {
    deepEqual(q1.coefficients, [1, 3, 5, 2])
    deepEqual(q2.coefficients, [-2, 2, 8, -1])
    deepEqual(i.coefficients, [0, 1, 0, 0])
    deepEqual(j.coefficients, [0, 0, 1, 0])
    deepEqual(k.coefficients, [0, 0, 0, 1])
    deepEqual(zero.coefficients, [0, 0, 0, 0])
  })
  it("can compute the conjugate", () => {
    deepEqual(q1.conjugate, new Quaternion(1, -3, -5, -2))
    deepEqual(q2.conjugate, new Quaternion(-2, -2, -8, 1))
    deepEqual(i.conjugate, new Quaternion(0, -1, -0, -0))
    deepEqual(j.conjugate, new Quaternion(0, -0, -1, -0))
    deepEqual(k.conjugate, new Quaternion(0, -0, -0, -1))
    deepEqual(zero.conjugate, new Quaternion(0, -0, -0, -0))
  })
  it("adds and multiplies correctly", () => {
    deepEqual(q1.plus(zero), q1)
    deepEqual(q1.times(zero), zero)
    deepEqual(q1.plus(q2), q3)
    deepEqual(q1.times(q2), q4)
    deepEqual(i.times(j), k)
    deepEqual(j.times(k), i)
    deepEqual(i.times(k), new Quaternion(0, 0, -1, 0))
  })
  it("has a string representation", () => {
    deepEqual(`${zero}`, "0")
    deepEqual(`${i}`, "i")
    deepEqual(`${k.conjugate}`, "-k")
    deepEqual(`${j.conjugate.times(new Quaternion(2, 0, 0, 0))}`, "-2j")
    deepEqual(`${j.plus(k)}`, "j+k")
    deepEqual(`${new Quaternion(0, -1, 0, 2.25)}`, "-i+2.25k")
    deepEqual(`${new Quaternion(-20, -1.75, 13, -2.25)}`, "-20-1.75i+13j-2.25k")
    deepEqual(`${new Quaternion(-1, -2, 0, 0)}`, "-1-2i")
    deepEqual(`${new Quaternion(1, 0, -2, 5)}`, "1-2j+5k")
  })
})
