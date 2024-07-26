import { Schema, Model, model } from 'mongoose'

export interface IUser extends Document {
    id: string
    first_name: string
    username: string
    role: string
}
interface IUserModel extends Model<IUser> {}

const UserSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    }
})

const User: IUserModel = model<IUser, IUserModel>('users', UserSchema)
export default User
