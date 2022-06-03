require('dotenv').load()

const { Stage, BaseScene, Telegraf } = require('telegraf')
const TelegrafI18n = require('telegraf-i18n')
const LocalSession = require('telegraf-session-local')
const path = require('path')

const bot = new Telegraf(process.env.telegram_token);

const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, 'locales'),
    defaultLanguage: 'ru',
    sessionName: 'session',
    useSession: true,
    templateData: {
        pluralize: TelegrafI18n.pluralize,
        uppercase: (value) => value.toUpperCase()
    }
});

const {
    registration_scene,
    registration_scene_2,
    registration_scene_3,
    registration_scene_4,
    registration_scene_5
} = require('./scenes/registrationScene.js');

const { addBalance_scene } = require('./scenes/addBalanceScene.js');

const stage = new Stage([
    registration_scene,
    registration_scene_2,
    registration_scene_3,
    registration_scene_4,
    registration_scene_5,
    addBalance_scene
]);

bot.use((new LocalSession({ database: 'session.json' })).middleware())
bot.use(i18n.middleware());
bot.use(stage.middleware());

module.exports = {
    bot,
    i18n
}