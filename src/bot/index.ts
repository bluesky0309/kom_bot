import { Telegraf, Scenes, session } from 'telegraf'
import { Express, Request, Response } from 'express'
import User from '@/models/Users'
// scenes
import { stakingV3Scene, withdrawV3Scene, transferStakershipScene, acceptStakershipScene, changeCompoundModeScene, stakingLPScene, claimWithV1Scene, claimWithV2Scene, uploadScene } from './scenes'
// commands
import mainCommands from './commands/main.commands'
import stakingCommands from './commands/staking'
import launchpadCommands from './commands/launchpad'
import adminCommands from './commands/admin.commands'
import { ADS_LOGO } from '@/constants/pictures'

export default (app: Express) => {
    const _bot = new Telegraf(process.env.BOT_TOKEN, {
        handlerTimeout: 9_000_000 // 2.5 hours in milliseconds
    })
    //@ts-expect-error scene
    const stages = new Scenes.Stage([uploadScene, stakingV3Scene, withdrawV3Scene, transferStakershipScene, acceptStakershipScene, changeCompoundModeScene, stakingLPScene, claimWithV1Scene, claimWithV2Scene])
    // use TG's session
    _bot.use(session())
    // use tg scene's middlewares
    _bot.use(stages.middleware())
    //set commands
    const commands = [
        { command: '/menu', description: 'Show Main Menu' },
        { command: '/menu_staking', description: 'Show Menu for Stakings' },
        { command: '/menu_staking_v1', description: 'Show Menu for Staking V1' },
        { command: '/menu_staking_v2', description: 'Show Menu for Staking V2' },
        { command: '/menu_staking_v3', description: 'Show Menu for Staking V3' },
        { command: '/menu_staking_lp', description: 'Show Menu for Staking LP' },
        { command: '/launchpad', description: 'Show Menu for Launchpad' },
        // { command: '/launchpad_upcoming', description: 'Show Menu for Launchpad Upcoming' },
        // { command: '/launchpad_active', description: 'Show Menu for Launchpad Active' },
        // { command: '/launchpad_ended', description: 'Show Menu for Launchpad Ended' },
        // { command: '/launchpad_vesting', description: 'Show Menu for Launchpad Vesting' },
        { command: '/help', description: 'Get help and instructions' }
    ]
    _bot.telegram.setMyCommands(commands)
    // launch TG bot instance
    _bot.launch()
    // admin comds
    adminCommands(_bot)
    // staking comds
    stakingCommands(_bot)
    // launchpad comds
    launchpadCommands(_bot)
    // main comds
    mainCommands(_bot)
    console.log('start..')

    app.post('/api/message', async (req: Request, res: Response) => {
        const users = await User.find({})
        users.map(async (user) => {
            try {
                const msg =
                    `\nDear $KOMmunity!\n` +
                    `\n🔎  Check out the exciting IKOs coming your way!\n` +
                    `\n✅  Invest with confidence as these projects have met our strict criteria.\n` +
                    `\n⭐ Learn more about KOM Priority Projects:` +
                    `\n<a href="https://bit.ly/PRIORITY-IKO"><u>https://bit.ly/PRIORITY-IKO</u></a>` +
                    `\n- 1:1 liquidity ratio with IMC` +
                    `\n- Refund if price drops below IKO for 3 straight days before 50% vesting\n` +
                    `\n⭐ Discover Kommunitas Secure IKO:` +
                    `\n<a href="https://bit.ly/SECURE-IKO"><u>https://bit.ly/SECURE-IKO</u></a>` +
                    `\n- Listing within 14 days` +
                    `\n- 72-hour decision window\n` +
                    `\n⭐ Explore Kommunitas Exclusive IKO:` +
                    `\n<a href="https://bit.ly/EXCLUSIVE-IKO"><u>https://bit.ly/EXCLUSIVE-IKO</u></a>` +
                    `\n- 5-day refund period after listing\n` +
                    `\n💥  Get ready for some amazing projects on our Launchpad!\n`
                _bot.telegram['sendPhoto'](user.id, ADS_LOGO, {
                    caption: msg,
                    parse_mode: 'HTML'
                })
            } catch (err) {
                console.log('error to send msg to user...')
            }
        })
        res.json('success')
    })
}
