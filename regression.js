(function() {
  "use strict";
  var linear, sinusoidal, regression;

  linear = (function() {
    var solve;

    /* Solve Ax=B for x. A should be an NxN square matrix, B should be an Nx1
     * column vector. */
    /* FIXME: This is solved using Cramer's rule naively, which is (hideously)
     * inefficient and exhibits numerical stability issues. This solver should
     * be replaced with, for example, something like this:
     * http://web.eecs.utk.edu/~itamar/Papers/JDA2011.pdf */
    solve = (function() {
      var determinant;

      determinant = function(a, n) {
        switch(n >>> 0) {
          /* Not valid. */
          case 0:
            return NaN;

          /* Several small matrices are special-cased, for efficiency. */
          case 1:
            return 1.0 / a[0];

          case 2:
            return a[0] * a[3] - a[1] * a[2];

          case 3:
            return a[0] * (a[4] * a[8] - a[5] * a[7]) +
                   a[1] * (a[5] * a[6] - a[3] * a[8]) +
                   a[2] * (a[3] * a[7] - a[4] * a[6]) ;

          /* Larger matrices have to be done the old-fashioned way. */
          default:
            throw new Error("FIXME");
        }
      };

      return function(a, b) {
        var d, i, j, n, t, x;

        n = b.length;
        d = determinant(a, n);
        x = new Array(n);
        t = new Array(n);

        for(i = n; i--; ) {
          for(j = n; j--; ) {
            t[j] = a[i + j * n];
            a[i + j * n] = b[j];
          }

          x[i] = determinant(a, n) / d;

          for(j = n; j--; ) {
            a[i + j * n] = t[j];
          }
        }

        return x;
      };
    })();

    return function(x, y, m) {
      var a, b, c, i, j, k, n;

      n = y.length;

      i = m * m;
      a = new Array(i);
      while(i--) {
        a[i] = 0.0;
      }

      i = m;
      b = new Array(i);
      while(i--) {
        b[i] = 0.0;
      }

      for(i = n; i--; ) {
        for(j = m; j--; ) {
          for(k = m; k--; ) {
            a[k + j * m] += x[k + i * m] * x[j + i * m];
          }

          b[j] += x[j + i * m] * y[i];
        }
      }

      return solve(a, b);
    };
  })();

  sinusoidal = function(x, y, frequency, phase) {
    var a, b, i, fit, u;

    frequency = +frequency;
    phase     = +phase;

    if(isFinite(phase)) {
      u = new Array(x.length * 2);

      for(i = x.length; i--; ) {
        u[i * 2 + 0] = 1.0;
        u[i * 2 + 1] = Math.sin(x[i] * frequency + phase);
      }

      fit = linear(u, y, 2);
      fit.push(phase, frequency);
    }

    else {
      u = new Array(x.length * 3);

      for(i = x.length; i--; ) {
        u[i * 3 + 0] = 1.0;
        u[i * 3 + 1] = Math.sin(x[i] * frequency);
        u[i * 3 + 2] = Math.cos(x[i] * frequency);
      }

      fit = linear(u, y, 3);
      fit.push(frequency);

      a = fit[1];
      b = fit[2];
      fit[1] = Math.sqrt(a * a + b * b);
      fit[2] = Math.atan2(b, a);
    }

    return fit;
  };

  if(typeof exports !== "undefined") {
    regression = exports;
  }

  else {
    regression = {};
    window.regression = regression;
  }

  regression.linear     = linear;
  regression.sinusoidal = sinusoidal;
})();
