const x = {
  get a() { return () => 69; },
};

x.a = 4;

console.log( x.a() )
