
Module.api = {
  exp: { argc: 1 },
  expm1: { argc: 1 },
  log: { argc: 1 },
  log1p: { argc: 1 },
  pow: { argc: 2 },

  sqrt: { argc: 1 },
  rsqrt: { argc: 1 },
  cbrt: { argc: 1 },

  sin: { argc: 1 },
  cos: { argc: 1 },
  tan: { argc: 1 },
  cot: { argc: 1 },

  sinpi: { argc: 1 },
  cospi: { argc: 1 },
  tanpi: { argc: 1 },
  cotpi: { argc: 1 },

  asin: { argc: 1 },
  acos: { argc: 1 },
  atan: { argc: 1 },

  sinh: { argc: 1 },
  cosh: { argc: 1 },
  tanh: { argc: 1 },
  coth: { argc: 1 },

  asinh: { argc: 1 },
  acosh: { argc: 1 },
  atanh: { argc: 1 },

  gamma: { argc: 1 },
  rgamma: { argc: 1 },
  lgamma: { argc: 1 },
  digamma: { argc: 1 },
  zeta: { argc: 1 },
  zeta2: { argc: 2 },
  polygamma: { argc: 2 },
  polylog: { argc: 2 },
  barnesg: { argc: 1 },
  lbarnesg: { argc: 1 },

  erf: { argc: 1 },
  erfc: { argc: 1 },
  erfi: { argc: 1 },
  gammaup: { argc: 2 },
  expint: { argc: 2 },
  ei: { argc: 1 },
  si: { argc: 1 },
  ci: { argc: 1 },
  shi: { argc: 1 },
  chi: { argc: 1 },
  li: { argc: 1 },
  lioffset: { argc: 1 },

  besselj: { argc: 2 },
  bessely: { argc: 2 },
  besseli: { argc: 2 },
  besselk: { argc: 2 },

  ai: { argc: 1 },
  aiprime: { argc: 1 },
  bi: { argc: 1 },
  biprime: { argc: 1 },

  hyperu: { argc: 3 },
  hyp0f1: { argc: 2 },
  hyp0f1r: { argc: 2 },
  hyp1f1: { argc: 3 },
  hyp1f1r: { argc: 3 },
  hyp2f1: { argc: 4 },
  hyp2f1r: { argc: 4 },

  chebyt: { argc: 2 },
  chebyu: { argc: 2 },
  jacobip: { argc: 4 },
  gegenbauerc: { argc: 3 },
  laguerrel: { argc: 3 },
  hermiteh: { argc: 2 },
  legenp: { argc: 3 },
  legenpv: { argc: 3 },
  legenq: { argc: 3 },
  legenqv: { argc: 3 },

  modeta: { argc: 1 },
  modj: { argc: 1 },
  modlambda: { argc: 1 },
  moddelta: { argc: 1 },

  agm1: { argc: 1 },
  ellipk: { argc: 1 },
  ellipe: { argc: 1 },
  ellipp: { argc: 2 },

  theta1: { argc: 2 },
  theta2: { argc: 2 },
  theta3: { argc: 2 },
  theta4: { argc: 2 },
}

Module.onRuntimeInitialized = function () {

  function parseArg(z) {
    if (typeof z === 'number') {
      return [ z, 0 ]
    }

    if (z && typeof z.length == 'number') {
      return [ z[0], z[1] || 0 ]
    }

    if (z && typeof z.length == 'number') {
      return [ z[0], z[1] || 0 ]
    }

    if (z && typeof z.re === 'number') {
      return [ z.re, z.im || 0 ]
    }

    throw new TypeError('arg must be of numeric or complex form')
  }

  const lib = Module.lib = {}

  Object.keys(Module.api).forEach(function (name) {
    const ccall_name = 'arbuckle_' + name
    const api = Module.api[name]

    // default function api arg count to 1 if not specified
    if (!api.argc) api.argc = 1
    const argc = api.argc

    const fn = lib[name] = function () {
      // parse out complexes from args list
      const args = []
      for (var k = 0, len = arguments.length; k < len; ++k) {
        args[k] = parseArg(arguments[k])
        // TODO set any defaults
      }

      if (args.length !== argc) {
        throw new TypeError('arg count mismatch, requires: ' + argc + ', got: ' + args.length)
      }

      // allocate an array of double pairs, 1 pair per in param, and 1 for out param
      const data = new Float64Array(2 * (argc + 1))

      // populate with input argument doubles
      for (var k = 0; k < argc; ++k) {
        data[2*k + 0] = args[k][0]
        data[2*k + 1] = args[k][1]
      }

      // get data byte size, allocate memory on heap, and get pointer
      const el_size = data.BYTES_PER_ELEMENT
      const size = data.length * el_size
      const ptr = Module._malloc(size)

      // copy data to emscripten heap (directly accessed from Module.HEAPU8)
      for (var k = 0; k < argc; ++k) {
        Module.setValue(ptr + (2*k + 0) * el_size, data[2*k + 0], 'double')
        Module.setValue(ptr + (2*k + 1) * el_size, data[2*k + 1], 'double')
      }

      // call the appropriate arbuckle'd arbcmath function, result into 2 tail elements of pointer
      Module.ccall(ccall_name, 'number', [ 'number' ], [ ptr ])

      data[2*argc + 0] = Module.getValue(ptr + (2*argc + 0) * el_size, 'double')
      data[2*argc + 1] = Module.getValue(ptr + (2*argc + 1) * el_size, 'double')

      // TODO try/catch to avoid leaking
      // free memory
      Module._free(ptr)

      return data
    }

    // attach metadata
    fn.name = name
    fn.api = api
  })
}
