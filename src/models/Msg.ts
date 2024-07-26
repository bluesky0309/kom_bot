import { Schema, Model, model } from 'mongoose'

export interface ISetting extends Document {
    key: string
    value: string
}
interface ISettingModel extends Model<ISetting> {}

const SettingSchema: Schema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: String,
        required: true
    }
})

const Setting: ISettingModel = model<ISetting, ISettingModel>('settings', SettingSchema)
export default Setting
