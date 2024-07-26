import User from '@/models/Users'
import path from 'path'
import Setting from '@/models/Msg'

const checkAdmin = async (ctx: any) => {
    const _user = await User.findOne({ id: ctx?.from?.id })
    if (_user?.role !== 'admin') {
        return Promise.reject('You are not a admin')
    } else {
        return Promise.resolve('admin')
    }
}

/**
 * return params of command
 * @param {*} str command string /add param0; param1; ...
 * @param {*} command /add
 * @returns [param0, param1, param2]
 */
const getParams = (str: string = '', command: string = '', split: string = ' ') => {
    const params = str.substring(command.length).trim()
    const splits = params.split(split).filter((item) => /\S/.test(item))
    return splits.map((item) => item.trim())
}

export default (_bot: any) => {
    // start
    _bot.command('sendmsg', async (ctx: any) => {
        const banner = await Setting.findOne({ key: 'logo' })
        const file = path.resolve(__dirname, '../../public/', banner?.value ?? 'AgACAgQAAxkBAAImtWaZnT92BuLUY9gbWS5PSGMSpPpCAALRxDEbx2HRUBjgeeSocqRJAQADAgADeQADNQQ')
        try {
            await checkAdmin(ctx)
            const msg = ctx.message.text.substring('sendmsg'.length + 1).trim()
            const users = await User.find({})
            users.map(async (user) => {
                try {
                    _bot.telegram['sendPhoto'](
                        user.id,
                        { source: file },
                        {
                            caption: msg
                            // parse_mode: "HTML",
                        }
                    ).catch((err: any) => {
                        ctx.reply('⚠ cannot parse your messsage. Please retry')
                    })
                } catch (err) {
                    console.log('error to send msg to user...')
                    throw err
                }
            })
        } catch (err) {
            ctx.reply(`⚠ ${String(err)}`)
        }
    })

    _bot.command('listadmins', async (ctx: any) => {
        try {
            await checkAdmin(ctx)
            const _admins = await User.find({ role: 'admin' })
            const msg = _admins.reduce((text, item, index) => (text += `${index + 1}. userId: ${item.id}\n    username: ${item.username}\n    fullName: ${item.first_name}(${item.username})\n`), `😃 Admins (${_admins.length})\n`)
            ctx.reply(msg, {})
        } catch (err) {
            ctx.reply(`⚠ ${String(err)}`)
        }
    })

    _bot.command('setadmin', async (ctx: any) => {
        try {
            await checkAdmin(ctx)
            const params = getParams(ctx.message.text, '/setadmin')
            if (params.length !== 1) {
                throw 'Invalid command format \n/setadmin username'
            } else {
                const [_newAdmin] = params
                const _user = await User.findOne({ username: _newAdmin })
                if (!_user) {
                    throw `${_newAdmin} is not a registered user.`
                } else if (_user.role === 'admin') {
                    throw `${_newAdmin} is already an admin .`
                } else {
                    _user.role = 'admin'
                    await _user.save()
                    ctx.reply(`✔ ${_newAdmin} is successfully set as an admin`)
                }
            }
        } catch (err) {
            ctx.reply(`⚠ ${String(err)}`)
        }
    })

    _bot.command('setbanner', async (ctx: any) => {
        try {
            await checkAdmin(ctx)
            ctx.scene.enter('uploadScene')
        } catch (err) {
            console.log('list admins', err)
        }
    })
}
