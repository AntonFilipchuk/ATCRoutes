export const name = "routes";

export const testRoute = {
  name: "test",
  points: {
    test1: "280",
    test2: "270",
    test3: "260",
    test4: "250",
    test5: "240",
    test6: "200",
  },
};

export const dimgi3A = {
  name: "dimgi3A",
  points: {
    dimgi: "280",
    vivzo: "270",
    mefed: "260",
    logpu: "240",
    duzev: "220",
    otsur: "200",
    gekla: "190",
    enmur: "150-160",
    kibur: "150",
    lo: "140",
    bemas: "130",
    tebdi: "100",
    tepta: "80",
    fidot: "70",
    roruk: "60",
  },
};

export const bekip3A = {
  name: "bekip3A",
  points: {
    bekip: "270",
    soruk: "210",
    odnel: "170",
    gigun: "150",
    aslek: "130",
    bupos: "90",
    orsif: "80",
    mezer: "70",
    fidot: "70",
    roruk: "60",
  },
};

export const bilru3A = {
  name: "bilru3A",
  points: {
    bilru: "170",
    nukdi: "150",
    preki: "110",
    lerte: "90",
    ww306: "70",
    mezer: "70",
    fidot: "70",
    roruk: "60",
  },
};

export const romta3A = {
  name: "romta3A",
  points: {
    romta: "240",
    tazol: "220",
    subod: "210",
    agmer: "200",
    famla: "180",
    odnel: "170",
    gigun: "150",
    aslek: "130",
    bupos: "90",
    orsif: "80",
    mezer: "70",
    fidot: "70",
    roruk: "60",
  },
};

export function getStandartRoutes() {
  return [dimgi3A, bekip3A, bilru3A, romta3A];
}
