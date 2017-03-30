let TinyMT = class {
  constructor( stateString ) {
    let tinymt = this;
    tinymt.state = new Uint32Array( 4 );
    tinymt.setState( stateString );
  }

  getState() {
    let tinymt = this;
    return new Uint32Array( tinymt.state );
  }

  setState( stateString ) {
    let tinymt = this;
    let str = stateString.split( "," );
    for ( let i = 0; i < 4; i ++ ) {
      tinymt.state[ i ] = parseInt( str[ 3 - i ], 16 );
    }
  }

  getStateString() {
    let tinymt = this;
    let ret = "";
    for ( let i = 3; 0 <= i; i -- ) {
      let s = ( tinymt.state[ i ] ).toString( 16 ).toUpperCase();
      let z = new Array( 8 - s.length + 1 ).join( '0' );
      ret += z + s + ( i !== 0 ? "," : "" );
    }
    return ret;
  }

  nextState() {
    let tinymt = this;
    let x = ( tinymt.state[ 0 ] & TinyMT.CONSTANT ) ^ tinymt.state[ 1 ] ^ tinymt.state[ 2 ];
    let y = tinymt.state[ 3 ];
    x ^= ( x << 1 );
    y ^= ( y >>> 1 ) ^ x;
    tinymt.state[ 0 ] = tinymt.state[ 1 ];
    tinymt.state[ 1 ] = tinymt.state[ 2 ];
    tinymt.state[ 2 ] = x ^ ( ( y << 10 ) & 0xffffffff );
    tinymt.state[ 3 ] = y;
    if ( y & 0x1 ) {
      tinymt.state[ 1 ] ^= TinyMT.MAT1;
      tinymt.state[ 2 ] ^= TinyMT.MAT2;
    }
  }

  gen() {
    let tinymt = this;
    tinymt.nextState();
    let t = tinymt.state[ 0 ] + ( tinymt.state[ 2 ] >>> 8 );
    return ( t ^ tinymt.state[ 3 ] ^ -( t & 0x1 ) & TinyMT.TMAT ) >>> 0;
  }
};

TinyMT.CONSTANT = 0x7fffffff;
TinyMT.MAT1 = 0x8f7011ee;
TinyMT.MAT2 = 0xfc78ff1f;
TinyMT.TMAT = 0x3793fdff;

export default TinyMT;