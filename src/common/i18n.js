import i18nData from './i18n.json';

export {
  addTrData,
  getLanguage,
  setLanguage,
  tr,
}

const textDict = i18nData;

// 三级结构:
//  * 语言 language
//  * 上下文 context
//  * 翻译项 item pair
// interface ITrDataEntry {
//   [context: string]: { [id: string]: string };
// }
// interface ITrData {
//   zh?: ITrDataEntry,
//   en?: ITrDataEntry,
// }

// enum Language {
//   zh = 'zh',
//   en = 'en',
// }

// 默认中文
let textLanguage = 'zh';

function addTrData(d) {
  for (const lang of Object.keys(d)) {
    const o = d[lang];
    for (const item of Object.keys(o)) {
      textDict[lang][item] = o[item];
    }
  }
}

function setLanguage(lang) {
  textLanguage = lang;
}

function getLanguage() {
  return textLanguage;
}

function tr(context, id, ...params) {
  const o = textDict[textLanguage];
  if (!o) { return id; }

  const ctx = o[context];
  if (!ctx) { return id; }

  let text = ctx[id] || id;
  text = text.replace(
    /\{(\d+)\}/g,
    (match, index) => (index < params.length ? params[index] : match)
  );
  return text;
};
