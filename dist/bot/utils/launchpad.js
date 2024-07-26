"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjects = void 0;
const utils_1 = require("./utils");
/**
 * @param address user walllet address
 * @param status project type "upcoming", "active", "ended", "vesting"
 * @returns
 */
const getProjects = (status_1, ...args_1) => __awaiter(void 0, [status_1, ...args_1], void 0, function* (status, address = '', keyword = '', invested = false) {
    try {
        const { status: _status, result } = yield (0, utils_1.komAPI)(`${process.env.KOM_API_URL}/launchpad/project/?status=${status}&address=${address}&invested=${invested}`);
        if (_status === 'success') {
            return result.filter((r) => { var _a, _b; return (_b = (_a = r === null || r === void 0 ? void 0 : r.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes(keyword === null || keyword === void 0 ? void 0 : keyword.toLocaleLowerCase()); });
        }
        else {
            throw '';
        }
    }
    catch (err) {
        return [];
    }
});
exports.getProjects = getProjects;
//# sourceMappingURL=launchpad.js.map