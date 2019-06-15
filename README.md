# Arbuckle

Arbitrary precision arithmetic and special functions, care of [`arb`](http://arblib.org/), by way of WebAssembly.

Note: arbitrary precision NYI -- first incarnation leans heavily on [arbcmath](https://github.com/fredrik-johansson/arbcmath/blob/master/arbcmath.h) utility, so only allows for `double complex` precision.

---

## TODO

- [ ] worker helper (possibly using transferrable array buffer to pass back and forth w/o copy)
- [ ] improve calling conventions for true arbitrary precision (capture state)
- [ ] publish docker build image

## Miscellany

* [arb docs](http://arblib.org/arb.html)
* [flint user manual](http://flintlib.org/flint-dev.pdf)

`arb_get_str` returns a value that can be fed back into `arb_set_str` with default flags
  guaranteed to produce an interval containing the original interval


special flint types ulong and slong
* max values given by UWORD_MAX and WORD_MAX
* min values given by UWORD_MIN and WORD_MIN ??

Returns f as a double, rounding down towards zero if f cannot be represented exactly.
The outcome is undefined if f is too large to fit in the normal range of a double.

```c
double fmpz_get_d ( const fmpz_t f)
```

Sets f to the double c, rounding down towards zero if the value of c is fractional. The
outcome is undefined if c is infinite, not-a-number, or subnormal.

```c
void fmpz_set_d ( fmpz_t f , double c)
```
