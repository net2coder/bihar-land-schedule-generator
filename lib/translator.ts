const directWords: Record<string, string> = {
  amin: "अमीन",
  anchal: "अंचल",
  bihar: "बिहार",
  dakshin: "दक्षिण",
  decimal: "डिसमिल",
  jila: "जिला",
  jamabandi: "जमाबंदी",
  khata: "खाता",
  khesra: "खेसरा",
  kumar: "कुमार",
  mauja: "मौजा",
  mouza: "मौजा",
  malik: "मालिक",
  paschim: "पश्चिम",
  patna: "पटना",
  purab: "पूर्व",
  purv: "पूर्व",
  raiyat: "रैयत",
  thana: "थाना",
  uttar: "उत्तर",
  west: "पश्चिम",
  east: "पूर्व",
  north: "उत्तर",
  south: "दक्षिण",
};

const consonants: Record<string, string> = {
  ksh: "क्ष",
  gya: "ज्ञ",
  gy: "ज्ञ",
  shr: "श्र",
  kh: "ख",
  gh: "घ",
  chh: "छ",
  ch: "च",
  jh: "झ",
  th: "थ",
  dh: "ध",
  ph: "फ",
  bh: "भ",
  sh: "श",
  tr: "त्र",
  k: "क",
  q: "क",
  g: "ग",
  c: "क",
  j: "ज",
  z: "ज",
  t: "त",
  d: "द",
  n: "न",
  p: "प",
  f: "फ",
  b: "ब",
  m: "म",
  y: "य",
  r: "र",
  l: "ल",
  v: "व",
  w: "व",
  s: "स",
  h: "ह",
};

const independentVowels: Record<string, string> = {
  aa: "आ",
  ai: "ऐ",
  au: "औ",
  ee: "ई",
  ii: "ई",
  oo: "ऊ",
  a: "अ",
  i: "इ",
  u: "उ",
  e: "ए",
  o: "ओ",
};

const vowelMarks: Record<string, string> = {
  aa: "ा",
  ai: "ै",
  au: "ौ",
  ee: "ी",
  ii: "ी",
  oo: "ू",
  a: "",
  i: "ि",
  u: "ु",
  e: "े",
  o: "ो",
};

const consonantKeys = Object.keys(consonants).sort((a, b) => b.length - a.length);
const vowelKeys = Object.keys(independentVowels).sort((a, b) => b.length - a.length);

function nextToken(source: string, index: number, map: Record<string, string>, keys: string[]) {
  for (const key of keys) {
    if (source.startsWith(key, index)) {
      return { key, value: map[key] };
    }
  }

  return null;
}

function hasNextVowel(source: string, index: number) {
  return Boolean(nextToken(source, index, independentVowels, vowelKeys));
}

function splitWord(word: string) {
  const match = word.match(/^([A-Za-z]+)([^A-Za-z]*)$/);
  return {
    latin: match?.[1] ?? "",
    suffix: match?.[2] ?? "",
  };
}

export function transliterateWord(word: string) {
  if (!word || /[\u0900-\u097F]/.test(word) || /^\d+(\.\d+)?$/.test(word)) {
    return word;
  }

  const { latin, suffix } = splitWord(word);
  if (!latin) {
    return word;
  }

  const lower = latin.toLowerCase();
  if (directWords[lower]) {
    return `${directWords[lower]}${suffix}`;
  }

  let index = 0;
  let output = "";

  while (index < lower.length) {
    const consonant = nextToken(lower, index, consonants, consonantKeys);

    if (consonant) {
      output += consonant.value;
      index += consonant.key.length;

      const vowel = nextToken(lower, index, vowelMarks, vowelKeys);
      if (vowel) {
        output += vowel.value;
        index += vowel.key.length;
      } else if (index < lower.length && !hasNextVowel(lower, index)) {
        output += "्";
      }
      continue;
    }

    const vowel = nextToken(lower, index, independentVowels, vowelKeys);
    if (vowel) {
      output += vowel.value;
      index += vowel.key.length;
      continue;
    }

    output += latin[index];
    index += 1;
  }

  return `${output}${suffix}`;
}

export function transliterateTrailingWord(value: string) {
  if (!value.endsWith(" ")) {
    return value;
  }

  const withoutSpace = value.slice(0, -1);
  const match = withoutSpace.match(/(\S+)$/);

  if (!match) {
    return value;
  }

  const word = match[1];
  const start = withoutSpace.slice(0, -word.length);

  return `${start}${transliterateWord(word)} `;
}
