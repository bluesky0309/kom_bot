import { Scenes, Context } from 'telegraf'
import { callbackQuery, enterScene, textHandler } from '../../controllers/staking/lp/staking.controller'
import { menu } from '@/bot/controllers/main.controller'
import axios from 'axios'
import Setting from '@/models/Msg'
import fs from 'fs'
import path from 'path'

// Create a new scene
export const uploadScene = new Scenes.BaseScene<Context>('uploadScene')

// enter staing scene
uploadScene.enter(async (ctx: any) => {
    ctx.reply('🤙 Please upload image what you want to provide', {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [[{ text: '👈 BACK' }]],
            resize_keyboard: true
        }
    })
})
// Handle the password input
uploadScene.on('text', async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137
    if (ctx.message.text === '👈 BACK') {
        await ctx.scene.leave()
        return menu(ctx)
    }
})
// Handle the password prompt
uploadScene.on('callback_query', callbackQuery)

/**
 * @message
 * deal with user custom message
 */
uploadScene.on('photo', async (ctx: any) => {
    try {
        const photo = ctx.message.photo
        if (photo) {
            const { file_id } = ctx.message.photo.pop()
            const { href } = await ctx.telegram.getFileLink(file_id)
            const response = await axios({
                method: 'get',
                url: href,
                responseType: 'stream'
            })
            await response.data.pipe(fs.createWriteStream(path.resolve(__dirname, '../../../public/', file_id)))
            await Setting.findOneAndUpdate({ key: 'logo' }, { value: file_id }, { new: true, upsert: true })
            ctx.reply('😁 Successfully set logo image')
            await ctx.scene.leave()
        }
    } catch (err) {
        ctx.reply('⚠ Failed to upload, please try again')
        await ctx.scene.leave()
    }
})
