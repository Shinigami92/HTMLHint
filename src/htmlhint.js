export const HTMLHint = new (require('./core')).HTMLHint();
export { HTMLParser } from './htmlparser';
export { Reporter } from './reporter';
export default HTMLHint;

// console.log('HTMLHint', HTMLHint);
// console.log('exports', exports);

// if (typeof exports === 'object' && exports) {
//     exports.HTMLHint = HTMLHint;
// }

// module.exports.HTMLHint = HTMLHint;
