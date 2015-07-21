(function() {
  "use strict";
  var linear, sinusoidal, regression;

  linear = (function() {
    var invert;

    invert = function(a, n) {
      var d;

      switch(n >>> 0) {
        case 0:
          return [];

        case 1:
          return [1.0 / a[0]];

        case 2:
          d = a[0] * a[3] - a[1] * a[2];
          return [a[3] / d, -a[1] / d, -a[2] / d, a[0] / d];

        case 3:
          d = a[0] * (a[4] * a[8] - a[5] * a[7]) +
              a[1] * (a[5] * a[6] - a[3] * a[8]) +
              a[2] * (a[3] * a[7] - a[4] * a[6]) ;
          return [
            (a[4] * a[8] - a[5] * a[7]) / d,
            (a[2] * a[7] - a[1] * a[8]) / d,
            (a[1] * a[5] - a[2] * a[4]) / d,
            (a[5] * a[6] - a[3] * a[8]) / d,
            (a[0] * a[8] - a[2] * a[6]) / d,
            (a[2] * a[3] - a[0] * a[5]) / d,
            (a[3] * a[7] - a[4] * a[6]) / d,
            (a[6] * a[1] - a[0] * a[7]) / d,
            (a[0] * a[4] - a[1] * a[3]) / d
          ];

        default:
          throw new Error("FIXME");
      }
    };

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

      a = invert(a, m);

      i = m;
      c = new Array(i);
      while(i--) {
        c[i] = 0.0;

        for(j = m; j--; ) {
          c[i] += a[j + i * m] * b[j];
        }
      }

      return c;
    };
  })();

  sinusoidal = function(x, y, f) {
    var a, b, i, fit, u;

    u = new Array(x.length * 3);

    for(i = x.length; i--; ) {
      u[i * 3 + 0] = 1.0;
      u[i * 3 + 1] = Math.sin(x[i] * f);
      u[i * 3 + 2] = Math.cos(x[i] * f);
    }

    fit = linear(u, y, 3);

    a = fit[1];
    b = fit[2];
    fit[1] = Math.sqrt(a * a + b * b);
    fit[2] = Math.atan2(b, a);

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
