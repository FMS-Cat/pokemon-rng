import TinyMT from "./tinymt";

// ------

let natureE = [
  "Hardy", "Lonely", "Brave", "Adamant", "Naughty",
  "Bold", "Docile", "Relaxed", "Impish", "Lax",
  "Timid", "Hasty", "Serious", "Jolly", "Naive",
  "Modest", "Mild", "Quiet", "Bashful", "Rash",
  "Calm", "Gentle", "Sassy", "Careful", "Quirky"
];

let natureM = [
  "A↑A↓", "A↑B↓", "A↑S↓", "A↑C↓", "A↑D↓",
  "B↑A↓", "B↑B↓", "B↑S↓", "B↑C↓", "B↑D↓",
  "S↑A↓", "S↑B↓", "S↑S↓", "S↑C↓", "S↑D↓",
  "C↑A↓", "C↑B↓", "C↑S↓", "C↑C↓", "C↑D↓",
  "D↑A↓", "D↑B↓", "D↑S↓", "D↑C↓", "D↑D↓"
];

let hiddenE = [
  "Fighting", "Flying", "Poison", "Ground",
  "Rock", "Bug", "Ghost", "Steel",
  "Fire", "Water", "Grass", "Electric",
  "Phychic", "Ice", "Dragon", "Dark"
];

// ------

rngSeed.value = "A33C7D5B,A6D61F57,36D8C12D,1DA619EC";

for ( let i = 0; i < 25; i ++ ) {
  let op = document.createElement( "option" );
  op.setAttribute( "value", natureE[ i ] );
  op.innerText = `${natureE[ i ]} (${natureM[ i ]})`;
  filterNature.appendChild( op );
}

for ( let i = 0; i < 16; i ++ ) {
  let op = document.createElement( "option" );
  op.setAttribute( "value", hiddenE[ i ] );
  op.innerText = `${hiddenE[ i ]}`;
  filterHidden.appendChild( op );
}

// ------

let tinymt = new TinyMT( rngSeed.value );

let initTable = () => {
  while ( eggTable.firstChild ) {
    eggTable.removeChild( eggTable.firstChild );
  }

  let tr = document.createElement( "tr" );
  eggTable.appendChild( tr );
  [ "Fr", "Acc", "H", "A", "B", "C", "D", "S", "Nature", "Ab", "Gd", "Bl", "Hidden", "*", "SV", "Seed" ].map( ( v ) => {
    let th = document.createElement( "th" );
    th.innerText = v;
    th.style.background = "#f83";
    th.style.color = "#fff";
    tr.appendChild( th );
  } );
};
initTable();

let genTd = ( str, col ) => {
  let td = document.createElement( "td" );
  td.innerText = str;
  td.style.color = col || "#000";
  return td;
};

let appendTable = ( egg, matched ) => {
  let tr = document.createElement( "tr" );
  tr.style.background = matched ? "#fed" : "#fff";
  eggTable.appendChild( tr );
  
  tr.appendChild( genTd( egg.frame ) );
  tr.appendChild( genTd( egg.frames ) );
  for ( let i = 0; i < 6; i ++ ) {
    tr.appendChild( genTd( egg.iv[ i ], egg.inh[ i ] === 1 ? "#06f" : egg.inh[ i ] === 2 ? "#f06" : false ) );
  }
  tr.appendChild( genTd( egg.nature ) );
  tr.appendChild( genTd( egg.ability ) );
  tr.appendChild( genTd( egg.gender, egg.gender === "M" ? "#06f" : egg.gender === "F" ? "#f06" : false ) );
  tr.appendChild( genTd( egg.ball, egg.ball === "M" ? "#06f" : "#f06" ) );
  tr.appendChild( genTd( egg.hidden ) );
  tr.appendChild( genTd( egg.shiny ) );
  tr.appendChild( genTd( egg.sv ) );
  tr.appendChild( genTd( egg.seed ) );
};

let frame = 0;
let egg = () => {
  let frames = 0;
  let ret = {};
  ret.seed = tinymt.getStateString();

  // ------

  {
    let ratio = parseInt( parentGender.value );
    if ( ratio === 6 ) {
      ret.gender = "-";
    } else if ( ratio === 5 ) {
      ret.gender = "F";
    } else if ( ratio === 4 ) {
      ret.gender = "M";
    } else {
      let r = ( ratio === 1 ) ? 32 : ( ratio === 2 ) ? 63 : ( ratio === 3 ) ? 189 : 126;
      ret.gender = ( ( ( tinymt.gen() % 252 ) + 1 ) < r ) ? "F" : "M";
      frames ++;
    }
  }

  // ------

  {
    ret.nature = natureE[ tinymt.gen() % 25 ];
    frames ++;

    let M = parseInt( parentMItem.value );
    let F = parseInt( parentFItem.value );
    if ( M === 1 && F === 1 ) {
      ret.nature = ( ( tinymt.gen() % 2 ) === 1 ) ? "F" : "M";
    } else if ( M === 1 || F === 1 ) {
      ret.nature = "Ev";
    }
  }

  // ------

  {
    let ab = parseInt( parentFDitto.checked ? parentMAbility.value : parentFAbility.value );
    let dice = tinymt.gen() % 100;
    frames ++;

    if ( ab === 1 ) {
      ret.ability = ( dice < 80 ) ? "1" : "2";
    } else if ( ab === 2 ) {
      ret.ability = ( dice < 20 ) ? "1" : "2";
    } else {
      ret.ability = ( dice < 20 ) ? "1" : ( dice < 40 ) ? "2" : "H";
    }
  }

  // ------

  {
    let M = parseInt( parentMItem.value );
    let F = parseInt( parentFItem.value );
    let knot = M === 2 || F === 2;
    let inhn = knot ? 5 : 3;
    let inhl = [ 0, 0, 0, 0, 0, 0 ];
    let inhi = 0;

    if ( 3 <= M && M <= 8 ) {
      inhl[ M - 3 ] = 1;
      inhi ++;
    }

    if ( 3 <= F && F <= 8 ) {
      inhl[ F - 3 ] = 2;
      inhi ++;
    }

    while ( inhi < inhn ) {
      let dice = tinymt.gen() % 6;
      frames ++;
      if ( inhl[ dice ] === 0 ) {
        inhl[ dice ] = ( ( tinymt.gen() % 2 ) === 1 ) ? 2 : 1;
        frames ++;
        inhi ++;
      }
    }
    ret.inh = inhl;

    ret.iv = [];
    for ( let i = 0; i < 6; i ++ ) { ret.iv[ i ] = tinymt.gen() % 32; }
    frames += 6;
    
    for ( let i = 0; i < 6; i ++ ) {
      if ( inhl[ i ] === 1 ) {
        ret.iv[ i ] = parseInt( document.getElementById( `parentMIV${i}` ).value );
      } else if ( inhl[ i ] === 2 ) {
        ret.iv[ i ] = parseInt( document.getElementById( `parentFIV${i}` ).value );
      }
    }
  }

  // ------

  {
    let h = (
      ( ret.iv[ 0 ] % 2 ) +
      ( ret.iv[ 1 ] % 2 ) * 2 +
      ( ret.iv[ 2 ] % 2 ) * 4 +
      ( ret.iv[ 5 ] % 2 ) * 8 +
      ( ret.iv[ 3 ] % 2 ) * 16 +
      ( ret.iv[ 4 ] % 2 ) * 32
    );
    ret.hidden = hiddenE[ ~~( h * 15 / 63 ) ];
  }

  // ------

  {
    let pid = tinymt.gen();
    ret.sv = "-";
    ret.shiny = "-";
    frames ++;

    let redices = ( shinyCharm.checked ? 2 : 0 ) + ( parentMasuda.checked ? 6 : 0 );
    for ( let i = 0; i < redices; i ++ ) {
      pid = tinymt.gen();
      frames ++;
      ret.sv = ( ( pid >>> 16 ) ^ ( pid & 0xffff ) ) >>> 4;
      ret.shiny = ( ret.sv === parseInt( shinyTSV.value ) ) ? "*" : "";
      if ( ret.shiny ) { break; }
    }
  }

  // ------

  {
    ret.ball = "F";
    if ( parentFDitto.checked ) {
      ret.ball = "M";
    } else if ( !parentDiff.checked ) {
      ret.ball = ( ( tinymt.gen() % 100 ) < 50 ) ? "F" : "M";
      frames ++;
    }
  }

  // ------

  tinymt.gen();
  tinymt.gen();
  frames += 2;

  ret.frame = frame;
  frame ++;
  ret.frames = frames;
  ret.seedA = tinymt.getStateString();

  // ------

  tinymt.setState( ret.seed );
  tinymt.gen();
  ret.seedR = tinymt.getStateString();
  return ret;
};

// ------

let go = () => {
  tinymt.setState( rngSeed.value );
  let start = parseInt( rangeS.value );
  let end = parseInt( rangeE.value );

  initTable();

  frame = start;
  for ( let i = 0; i < start; i ++ ) {
    tinymt.gen();
  }
  let target = parseInt( targetFrame.value );
  let targetAccI = 0;
  let targetAccP = start;
  let targetEnabled = false;
  if ( target < start ) {
    targetGuide.innerText = "🚀🚀🚀 Target frame exceeded! 🚀🚀🚀";
  } else if ( end < target ) {
    targetGuide.innerText = "👾👾👾 Target is too large! 👾👾👾";
  } else if ( start === target ) {
    targetGuide.innerText = "🐣🐣🐣 GRAB YOUR EGG NOW 🐣🐣🐣";
  } else {
    targetEnabled = true;
  }

  for ( let i = start; i <= end; i ++ ) {
    let e = egg();

    if ( targetEnabled ) {
      if ( targetAccP === i ) {
        let next = targetAccP + e.frames;
        if ( target < next ) {
          let rej = target - targetAccP;
          targetGuide.innerText = `Accept ${targetAccI} then reject ${rej}`;
          targetEnabled = false;
        } else {
          targetAccI ++;
          targetAccP = next;
        }
      }
    }

    let filtered = false;
    for ( let dummy = 0; dummy < 1; dummy ++ ) {
      for ( let i = 0; i < 6; i ++ ) {
        let ivs = parseInt( document.getElementById( `filterIV${i}S` ).value );
        let ive = parseInt( document.getElementById( `filterIV${i}E` ).value );
        if ( e.iv[ i ] < ivs || ive < e.iv[ i ] ) {
          filtered = true; break;
        }
      }
      if ( filtered ) { continue; }

      let nat = filterNature.value;
      if ( nat !== "Any" && nat !== e.nature ) { filtered = true; continue; }

      let ab = filterAbility.value;
      if ( ab !== "Any" && ab !== e.ability ) { filtered = true; continue; }

      let gd = filterGender.value;
      if ( gd !== "Any" && gd !== e.gender ) { filtered = true; continue; }

      let bl = filterBall.value;
      if ( bl !== "Any" && bl !== e.ball ) { filtered = true; continue; }

      let hidden = filterHidden.value;
      if ( hidden !== "Any" && hidden !== e.hidden ) { filtered = true; continue; }

      let shiny = filterShiny.checked;
      if ( shiny && e.shiny !== "*" ) { filtered = true; continue; }
    }
    
    if ( disableFilters.checked || !filtered ) {
      appendTable( e, !filtered );
    }
  }
};

// ------

buttonGo.onclick = () => {
  go();
};

buttonRej.onclick = () => {
  rangeS.value = parseInt( rangeS.value ) + 1;
  go();
};

buttonAcc.onclick = () => {
  let trs = eggTable.getElementsByTagName( "tr" );
  if ( trs.length <= 1 ) { alert( "nope" ); return; }
  let acc = trs[ 1 ].getElementsByTagName( "td" )[ 1 ].innerText;
  rangeS.value = parseInt( rangeS.value ) + parseInt( acc );
  go();
};

// ------

let airhorn = document.createElement( "audio" );
airhorn.src = "airhorn.wav";

buttonAirhorn.onclick = () => {
  airhorn.currentTime = 0;
  airhorn.play();
};