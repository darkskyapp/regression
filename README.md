regression
==========

A tiny Javascript toolkit for regression analysis.

Be warned that I am neither an expert on linear algebra nor numerical
stability: this toolkit should be perfectly adequate for prototyping and
experimentation, but you should use a real linear algebra toolkit for
production applications. (Unfortunately, none seem to exist in Javascript. We
at The Dark Sky Company use this toolkit for prototyping, but switch to
[NumPy][1] for production applications.)

[1]: http://www.numpy.org/

API
---

*   `regression.linear(x,y,n)`: Calculates the [ordinary least squares
    linear regression][2] on a dataset. `x` should be an N×M matrix, while `y`
    should be an N×1 column vector. Usage is straightforward:

        /* Find the best fit for the overdetermined system of equations:
         * 
         *     1 * a[1] + 0 * b[1] =  1
         *     1 * a[2] + 1 * b[2] = -1
         *     1 * a[3] + 2 * b[3] = -3
         *     1 * a[4] + 3 * b[4] = -5
         *     1 * a[5] + 4 * b[5] = -7
         * 
         * The answer is a=1 and b=-2 (which, in this case, solves each
         * equation exactly). */
        console.log(
          regression.linear(
            [
              1, 0,
              1, 1,
              1, 2,
              1, 3,
              1, 4
            ],
            [
               1,
              -1,
              -3,
              -5,
              -7
            ],
            2
          )
        );
        /* => [1, -2] */

    **Note: due to laziness, this only works on 1D, 2D, and 3D datasets. It
    should be straightforward to support higher dimensions if necessary.**

*   `regression.sinusoidal(x,y,frequency)`: Calculates the best fit [sinusoidal
    model][3] with the given frequency for the given dataset. `x` and `y`
    should both be N×1 column vectors. Usage is similarly straightforward:

        /* This finds the following sinusoidal model:
         * 
         *     f(x) = 0 + 1 * sin(x * Math.PI + 0.5 * Math.PI)
         * 
         * That is, the function returns the constant, amplitude, and phase of
         * the model, respectively. */
        console.log(
          regression.sinusoidal(
            [ 0,  1,  2,  3],
            [+1, -1, +1, -1],
            Math.PI
          );
        );
        /* => [0, 1, 0.5 * Math.PI] */

[2]: https://en.wikipedia.org/wiki/Ordinary_least_squares
[3]: https://en.wikipedia.org/wiki/Sinusoidal_model
