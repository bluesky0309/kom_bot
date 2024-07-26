import { start, menu, textHandler, messageHandler, callbackQuery } from '@/bot/controllers/main.controller'

export default (_bot: any) => {
    // start
    _bot.command('start', start)
    _bot.action('start', start)
    // menu
    _bot.command('menu', menu)
    _bot.action('menu', menu)

    _bot.on('text', textHandler)
    // message from web app
    _bot.on('message', messageHandler)
    // callback
    _bot.on('callback_query', callbackQuery)
}
