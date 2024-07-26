"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SettingSchema = new mongoose_1.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: String,
        required: true
    }
});
const Setting = (0, mongoose_1.model)('settings', SettingSchema);
exports.default = Setting;
//# sourceMappingURL=Msg.js.map