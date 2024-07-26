"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
/**
 * delay specific time Promise
 * @param {*} duration seconds
 * @returns
 */
const sleep = (duration) => new Promise((resolve, reject) => {
    try {
        setTimeout(() => {
            resolve();
        }, duration * 1000);
    }
    catch (err) {
        reject();
    }
});
exports.sleep = sleep;
//# sourceMappingURL=utils.js.map