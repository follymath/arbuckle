'use strict'

const Arbuckle = require('./lib/arbuckle')()
Arbuckle.then(() => {
  const lib = Arbuckle.lib

  console.log('chi(3/38):', lib.chi(3/38).slice(2).join(' + ') + 'i')

  var s = [ Math.random(), 22371.182 ]
  for (var i = 1; i <= 10; ++i) {
    console.log('zeta(' + s.join('+') + 'i, 1/' + i + '):', lib.zeta2(s, 1/i).slice(4).join(' + ') + 'i')
  }

  var s = [ Math.random(), 2237.182 ]
  for (var i = 1; i <= 100; ++i) {
    console.log('zeta(' + s.join('+') + 'i, 1/' + i + '):', lib.zeta2(s, 1/i).slice(4).join(' + ') + 'i')
  }
})
