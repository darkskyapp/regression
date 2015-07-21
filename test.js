(function() {
  "use strict";
  var assert, eq, regression;

  assert     = require("assert");
  regression = require("./");

  eq = (function() {
    var has_length, is_array, is_close_to;

    is_array = function(array) {
      assert(
        Array.isArray(array),
        "expected " + JSON.stringify(array) + " to be an Array"
      );
    };

    has_length = function(array, length) {
      assert(
        array.length === length,
        "expected " + JSON.stringify(array) + " to be of length " + length
      );
    };

    is_close_to = function(a, b, error) {
      assert(
        Math.abs(b - a) < error,
        "expected " + a + " to be close to " + b + " (+/- " + error + ")"
      );
    };

    return function(actual, expected, message) {
      var i, n;

      is_array(expected);
      n = expected.length;

      is_array(actual);
      has_length(actual, n);

      for(i = 0; i < n; i++) {
        is_close_to(actual[i], expected[i], 0.0001);
      }
    };
  })();

  describe("regression", function() {
    describe("linear", function() {
      it(
        "should return the best fit for an overdetermined 2D system",
        function() {
          eq(
            regression.linear(
              [
                 1.0,  1.0,
                 1.0,  2.0,
                 1.0,  3.0,
                 1.0,  4.0
              ],
              [
                 6.0,
                 5.0,
                 7.0,
                10.0
              ],
              2
            ),
            [
              3.5,
              1.4
            ]
          );
        }
      );
    });

    describe("sinusoidal", function() {
    });
  });
})();
